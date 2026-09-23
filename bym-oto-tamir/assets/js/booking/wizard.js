// Çok adımlı randevu sihirbazı.
// Veri: catalog.js · Model: appointment.js · Depo: repository.js · Kurallar: availability.js
import { BRANDS, MODELS, OTHER, SERVICES, serviceById } from "./catalog.js";
import {
  createAppointment, isValidPhone, isValidPlate, formatPhoneInput, formatPlate,
  toISODate, fromISODate, formatDateTR, pad,
} from "./appointment.js";
import { SlotTakenError } from "./repository.js";
import { waLink, appointmentMessage } from "../whatsapp.js";

const STEPS = [
  { key: "brand", label: "Marka" },
  { key: "model", label: "Model" },
  { key: "service", label: "Hizmet" },
  { key: "date", label: "Tarih" },
  { key: "time", label: "Saat" },
  { key: "info", label: "Bilgiler" },
  { key: "summary", label: "Özet" },
];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export class BookingWizard {
  /**
   * @param {HTMLElement} root
   * @param {{repo, availability, mode:string, root:string}} deps
   */
  constructor(root, { repo, availability, mode, siteRoot = "" }) {
    this.root = root;
    this.repo = repo;
    this.av = availability;
    this.mode = mode;
    this.siteRoot = siteRoot;
    this.step = 0;
    this.dir = 1;
    this.errors = {};
    this.consent = false;
    this.done = null;
    this.slotNotice = "";
    this.data = { brand: "", model: "", service: "", date: "", time: "", name: "", phone: "", plate: "", note: "" };
    this.customModel = false;
    const t = this.av.today();
    this.calMonth = new Date(t.getFullYear(), t.getMonth(), 1);
    this.#prefill();
    this.render(false);
    root.addEventListener("click", (e) => this.#onClick(e));
    root.addEventListener("input", (e) => this.#onInput(e));
    root.addEventListener("change", (e) => this.#onChange(e));
    root.addEventListener("focusout", (e) => this.#onBlur(e));
    root.addEventListener("keydown", (e) => this.#onKey(e));
  }

  // --- URL ön doldurma: ?marka=BMW&hizmet=klima&not=... --------------------
  #prefill() {
    const q = new URLSearchParams(location.search);
    const brand = q.get("marka");
    const service = q.get("hizmet");
    const note = q.get("not");
    if (brand && BRANDS.includes(brand)) {
      this.data.brand = brand;
      this.step = 1;
    }
    if (service && serviceById(service)) this.data.service = service;
    if (note) this.data.note = note.slice(0, 500);
  }

  get key() { return STEPS[this.step].key; }

  canProceed(key = this.key) {
    const d = this.data;
    switch (key) {
      case "brand": return !!d.brand && (d.brand !== OTHER || !!d.brandOther?.trim());
      case "model": return !!d.model.trim();
      case "service": return !!d.service;
      case "date": return !!d.date;
      case "time": return !!d.time;
      case "info": return Object.keys(this.#validateInfo()).length === 0;
      default: return true;
    }
  }

  go(to) {
    if (to < 0 || to >= STEPS.length) return;
    this.dir = to > this.step ? 1 : -1;
    this.step = to;
    this.render(true);
  }

  next() {
    if (this.key === "info") {
      this.errors = this.#validateInfo();
      if (Object.keys(this.errors).length) {
        this.render(false);
        this.root.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
    }
    if (!this.canProceed()) return;
    this.go(this.step + 1);
  }

  back() { this.go(this.step - 1); }

  // --- Render -------------------------------------------------------------
  render(moveFocus) {
    if (this.done) return this.#renderDone(moveFocus);
    const s = STEPS[this.step];
    const bar = STEPS.map((_, i) => `<span class="${i <= this.step ? "is-done" : ""}"></span>`).join("");
    const isLast = s.key === "summary";
    const nextLabel = isLast ? "Randevuyu Onayla" : "Devam";
    const demo = this.mode !== "api"
      ? `<p class="wz__demo">Önizleme: Randevular şimdilik bu cihazda saklanır, onay sonrası WhatsApp ile iletilir.</p>` : "";
    this.root.innerHTML = `
      <div class="wz">
        <div class="wz__top">
          <div class="wz__meta"><span>Adım <b>${this.step + 1}</b> / ${STEPS.length}</span><span>${esc(s.label)}</span></div>
          <div class="wz__bar" aria-hidden="true">${bar}</div>
        </div>
        <div class="wz__body">
          <div class="wz__step ${this.dir < 0 ? "is-back" : ""}">${this[`step_${s.key}`]()}</div>
        </div>
        <div class="wz__foot">
          <button type="button" class="wz__back" data-act="back" ${this.step === 0 ? "hidden" : ""}>${icon("i-arrow-l")} Geri</button>
          <button type="button" class="btn ${isLast ? "btn--accent btn--lg" : "btn--light"}" data-act="${isLast ? "confirm" : "next"}"
            ${!isLast && s.key !== "info" && !this.canProceed() ? 'aria-disabled="true"' : ""}>${nextLabel} ${icon(isLast ? "i-tick" : "i-arrow")}</button>
        </div>
        ${demo}
      </div>`;
    if (s.key === "time") this.#loadSlots();
    if (moveFocus) {
      const h = this.root.querySelector(".wz__q");
      h?.focus({ preventScroll: true });
      const top = this.root.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.5) {
        const offset = (document.querySelector("[data-header]")?.offsetHeight || 64) + 12;
        window.scrollTo({ top: window.scrollY + top - offset, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    }
  }

  #q(title, hint) {
    return `<h3 class="wz__q" tabindex="-1">${title}</h3>${hint ? `<p class="wz__hint">${hint}</p>` : ""}`;
  }

  step_brand() {
    const opts = BRANDS.map((b) => `
      <button type="button" class="opt" data-pick="brand" data-val="${esc(b)}" aria-pressed="${this.data.brand === b}">
        <span>${esc(b)}</span>${icon("i-tick", "ic opt__check")}
      </button>`).join("");
    const other = this.data.brand === OTHER ? `
      <div class="field" style="margin-top:16px">
        <label for="bk-brand-other">Araç markası</label>
        <input id="bk-brand-other" class="input" data-field="brandOther" value="${esc(this.data.brandOther || "")}" placeholder="Örn. Skoda" autocomplete="off">
      </div>` : "";
    return `${this.#q("Aracınızın markası nedir?", "Markanızı seçin.")}<div class="opts opts--brands" role="group" aria-label="Araç markası">${opts}</div>${other}`;
  }

  step_model() {
    const brand = this.data.brand === OTHER ? (this.data.brandOther || "Aracınız") : this.data.brand;
    const list = MODELS[this.data.brand] || [];
    const custom = this.customModel || !list.length || (this.data.model && !list.includes(this.data.model));
    const chips = list.map((m) => `
      <button type="button" class="opt" data-pick="model" data-val="${esc(m)}" aria-pressed="${!custom && this.data.model === m}">
        <span>${esc(m)}</span>${icon("i-tick", "ic opt__check")}
      </button>`).join("");
    const otherBtn = list.length ? `
      <button type="button" class="opt" data-act="custom-model" aria-pressed="${custom}"><span>Listede yok</span>${icon("i-tick", "ic opt__check")}</button>` : "";
    const input = custom ? `
      <div class="field" style="margin-top:16px">
        <label for="bk-model">Model <span class="opt-l">(ve varsa yıl / motor)</span></label>
        <input id="bk-model" class="input" data-field="model" value="${esc(this.data.model)}" placeholder="Örn. Octavia 1.6 TDI 2018" autocomplete="off">
      </div>` : "";
    return `${this.#q(`${esc(brand)} · model`, "Aracınızın modelini seçin.")}
      ${list.length ? `<div class="opts" role="group" aria-label="Model">${chips}${otherBtn}</div>` : ""}${input}`;
  }

  step_service() {
    const opts = SERVICES.map((s) => `
      <button type="button" class="opt" data-pick="service" data-val="${s.id}" aria-pressed="${this.data.service === s.id}">
        <span class="opt__ic">${icon(s.icon)}</span><span>${esc(s.name)}</span>${icon("i-tick", "ic opt__check")}
      </button>`).join("");
    return `${this.#q("Hangi hizmete ihtiyacınız var?", "Emin değilseniz “Arıza Kontrolü”nü seçin.")}<div class="opts opts--list" role="group" aria-label="Hizmet">${opts}</div>`;
  }

  step_date() {
    const m = this.calMonth;
    const title = m.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    const today = this.av.today();
    const first = new Date(m.getFullYear(), m.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Pazartesi başlangıç
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = this.av.lastDay();
    const maxMonth = new Date(last.getFullYear(), last.getMonth(), 1);
    let cells = DOW.map((d) => `<div class="cal__dow" aria-hidden="true">${d}</div>`).join("");
    for (let i = 0; i < lead; i++) cells += "<span></span>";
    for (let d = 1; d <= days; d++) {
      const date = new Date(m.getFullYear(), m.getMonth(), d);
      const iso = toISODate(date);
      const open = this.av.isDateOpen(date);
      const sel = this.data.date === iso;
      const label = date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) + (open ? "" : ", müsait değil");
      cells += `<button type="button" class="cal__day ${+date === +today ? "is-today" : ""}" data-pick="date" data-val="${iso}"
        aria-pressed="${sel}" aria-label="${esc(label)}" ${open ? "" : "disabled"} tabindex="${sel || (!this.data.date && open && this.#firstOpen(m) === d) ? 0 : -1}">${d}</button>`;
    }
    return `${this.#q("Hangi gün gelmek istersiniz?", "Geçmiş tarihler ve kapalı günler seçilemez.")}
      <div class="cal">
        <div class="cal__head">
          <span class="cal__title" aria-live="polite">${esc(title)}</span>
          <div class="cal__nav">
            <button type="button" class="icon-btn" data-act="prev-month" aria-label="Önceki ay" ${m <= minMonth ? "disabled" : ""}>${icon("i-chev-l")}</button>
            <button type="button" class="icon-btn" data-act="next-month" aria-label="Sonraki ay" ${m >= maxMonth ? "disabled" : ""}>${icon("i-chev-r")}</button>
          </div>
        </div>
        <div class="cal__grid" role="group" aria-label="${esc(title)}">${cells}</div>
        <div class="cal__legend"><span>Pazar günleri kapalıdır.</span></div>
      </div>`;
  }

  #firstOpen(month) {
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= days; d++) if (this.av.isDateOpen(new Date(month.getFullYear(), month.getMonth(), d))) return d;
    return -1;
  }

  step_time() {
    const notice = this.slotNotice ? `<p class="err" role="alert" style="margin-bottom:14px">${esc(this.slotNotice)}</p>` : "";
    return `${this.#q("Size uygun saat hangisi?", "Müsait olmayan saatler pasif görünür.")}
      <button type="button" class="pick-date" data-act="goto" data-step="3">${icon("i-cal")} ${esc(formatDateTR(this.data.date))}</button>
      ${notice}
      <div data-slots><div class="slots">${this.av.slots.map(() => '<span class="slot" style="opacity:.3"></span>').join("")}</div></div>`;
  }

  async #loadSlots() {
    const date = this.data.date;
    const slots = await this.av.slotsFor(date);
    if (this.key !== "time" || this.data.date !== date) return;
    const box = this.root.querySelector("[data-slots]");
    if (!box) return;
    if (this.data.time && !slots.find((s) => s.time === this.data.time && s.available)) this.data.time = "";
    const btn = (s) => `<button type="button" class="slot" data-pick="time" data-val="${s.time}" aria-pressed="${this.data.time === s.time}"
      ${s.available ? "" : 'disabled aria-label="' + s.time + ', dolu"'}>${s.time}</button>`;
    const am = slots.filter((s) => s.time < "12:00");
    const pm = slots.filter((s) => s.time >= "12:00");
    const any = slots.some((s) => s.available);
    box.innerHTML = any
      ? `${am.length ? `<p class="slot-group">Öğleden önce</p><div class="slots" role="group" aria-label="Öğleden önce">${am.map(btn).join("")}</div>` : ""}
         ${pm.length ? `<p class="slot-group">Öğleden sonra</p><div class="slots" role="group" aria-label="Öğleden sonra">${pm.map(btn).join("")}</div>` : ""}`
      : `<p class="wz__hint">Bu gün için müsait saat kalmadı. <button type="button" class="summary__edit" data-act="goto" data-step="3">Başka bir gün seçin</button></p>`;
    this.#syncNext();
  }

  step_info() {
    const d = this.data, er = this.errors;
    const f = (id, key, label, attrs, extraCls = "") => `
      <div class="field">
        <label for="${id}">${label}</label>
        <input id="${id}" class="input ${extraCls}" data-field="${key}" value="${esc(d[key])}" ${attrs}
          aria-invalid="${!!er[key]}" aria-describedby="${id}-err">
        <span class="err" id="${id}-err">${esc(er[key] || "")}</span>
      </div>`;
    return `${this.#q("İletişim bilgileriniz", "Randevunuzu teyit etmek için sizinle bu bilgilerle iletişime geçeceğiz.")}
      ${f("bk-name", "name", "Ad Soyad", 'autocomplete="name" placeholder="Adınız ve soyadınız" required')}
      <div class="grid-2">
        ${f("bk-phone", "phone", "Telefon", 'type="tel" inputmode="tel" autocomplete="tel-national" placeholder="0 (5XX) XXX XX XX" required')}
        ${f("bk-plate", "plate", "Plaka", 'autocomplete="off" autocapitalize="characters" placeholder="46 ABC 123" required', "input--plate")}
      </div>
      <div class="field">
        <label for="bk-note">Açıklama <span class="opt-l">(isteğe bağlı)</span></label>
        <textarea id="bk-note" class="input" data-field="note" rows="3" maxlength="500" placeholder="Şikâyetinizi veya isteğinizi kısaca yazın">${esc(d.note)}</textarea>
      </div>
      <label class="check">
        <input type="checkbox" data-field="consent" ${this.consent ? "checked" : ""} aria-invalid="${!!er.consent}" aria-describedby="bk-consent-err">
        <span><a href="${this.siteRoot}kvkk/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>'ni okudum; randevu için bilgilerimin işlenmesini kabul ediyorum.</span>
      </label>
      <span class="err" id="bk-consent-err">${esc(er.consent || "")}</span>`;
  }

  #validateInfo() {
    const d = this.data, e = {};
    if (d.name.trim().length < 3) e.name = "Lütfen adınızı ve soyadınızı yazın.";
    if (!isValidPhone(d.phone)) e.phone = "Geçerli bir telefon numarası girin (0 5XX XXX XX XX).";
    if (!isValidPlate(d.plate)) e.plate = "Geçerli bir plaka girin (ör. 46 ABC 123).";
    if (!this.consent) e.consent = "Devam etmek için onay vermeniz gerekiyor.";
    return e;
  }

  step_summary() {
    const d = this.data;
    const brand = d.brand === OTHER ? d.brandOther : d.brand;
    const row = (label, value, step) => `
      <div class="summary__row"><dt>${label}</dt><dd>${esc(value)}</dd>
        <button type="button" class="summary__edit" data-act="goto" data-step="${step}" aria-label="${label} bilgisini değiştir">Değiştir</button></div>`;
    return `${this.#q("Randevu özetiniz", "Bilgileri kontrol edin ve randevunuzu onaylayın.")}
      <dl class="summary">
        ${row("Araç", `${brand} ${d.model}`, 0)}
        ${row("Hizmet", serviceById(d.service)?.name, 2)}
        ${row("Tarih", formatDateTR(d.date), 3)}
        ${row("Saat", d.time, 4)}
        ${row("Ad Soyad", d.name, 5)}
        ${row("Telefon", formatPhoneInput(d.phone), 5)}
        ${row("Plaka", formatPlate(d.plate), 5)}
        ${d.note ? row("Açıklama", d.note, 5) : ""}
      </dl>
      <p class="err" role="alert" data-submit-err></p>`;
  }

  #renderDone(moveFocus) {
    const a = this.done;
    const api = this.mode === "api";
    const sub = api
      ? "Randevu bilgileriniz BYM Automotive ekibine iletildi."
      : "Randevu talebinizi BYM Automotive ekibine iletmek için WhatsApp'tan gönderin.";
    this.root.innerHTML = `
      <div class="wz"><div class="wz__body">
        <div class="done">
          <div class="done__icon">${icon("i-tick")}</div>
          <h3 class="done__t" tabindex="-1">Randevunuz oluşturuldu.</h3>
          <p class="done__p">${sub}</p>
          <p class="done__ref">${esc(a.id)}</p>
          <p class="done__p"><strong>${esc(formatDateTR(a.date))} · ${esc(a.time)}</strong><br>${esc(serviceById(a.service)?.name)} · ${esc(a.brand)} ${esc(a.model)}</p>
          <div class="btn-row">
            <a class="btn btn--wa btn--lg" href="${waLink(appointmentMessage(a))}" target="_blank" rel="noopener">${icon("i-wa")} ${api ? "WhatsApp'tan yazın" : "WhatsApp ile gönder"}</a>
          </div>
          <div class="done__links">
            <button type="button" data-act="ics">Takvime ekle</button>
            <button type="button" data-act="restart">Yeni randevu</button>
          </div>
        </div>
      </div></div>`;
    if (moveFocus) this.root.querySelector(".done__t")?.focus({ preventScroll: true });
  }

  async confirm() {
    const btn = this.root.querySelector('[data-act="confirm"]');
    btn?.setAttribute("aria-disabled", "true");
    const d = this.data;
    const appt = createAppointment({ ...d, brand: d.brand === OTHER ? d.brandOther.trim() : d.brand });
    try {
      this.done = await this.repo.create(appt) || appt;
      this.render(true);
      document.dispatchEvent(new CustomEvent("bym:appointment", { detail: this.done }));
    } catch (err) {
      if (err instanceof SlotTakenError) {
        this.data.time = "";
        this.slotNotice = "Seçtiğiniz saat az önce doldu. Lütfen başka bir saat seçin.";
        this.go(4);
        return;
      }
      btn?.removeAttribute("aria-disabled");
      const box = this.root.querySelector("[data-submit-err]");
      if (box) box.textContent = "Randevu oluşturulamadı. Lütfen tekrar deneyin veya WhatsApp ile ulaşın.";
    }
  }

  #ics() {
    const a = this.done;
    const [y, mo, d] = a.date.split("-");
    const [h, mi] = a.time.split(":");
    const start = `${y}${mo}${d}T${h}${mi}00`;
    const endH = pad(Number(h) + 1);
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//BYM Automotive//Randevu//TR", "BEGIN:VEVENT",
      `UID:${a.id}@bymautomotive`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
      `DTSTART:${start}`, `DTEND:${y}${mo}${d}T${endH}${mi}00`,
      `SUMMARY:BYM Automotive – ${serviceById(a.service)?.name}`,
      `DESCRIPTION:${a.brand} ${a.model} · Ref: ${a.id}`,
      "LOCATION:BYM Automotive\\, Göksun", "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: `bym-randevu-${a.date}.ics` });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // --- Olaylar ------------------------------------------------------------
  #syncNext() {
    const b = this.root.querySelector('[data-act="next"]');
    if (!b || this.key === "info") return;
    this.canProceed() ? b.removeAttribute("aria-disabled") : b.setAttribute("aria-disabled", "true");
  }

  #onClick(e) {
    const t = e.target.closest("[data-pick],[data-act]");
    if (!t || !this.root.contains(t) || t.disabled) return;
    if (t.dataset.pick) {
      const key = t.dataset.pick, val = t.dataset.val;
      if (key === "brand" && this.data.brand !== val) { this.data.model = ""; this.customModel = false; }
      if (key === "model") this.customModel = false;
      if (key === "date" && this.data.date !== val) { this.data.time = ""; this.slotNotice = ""; }
      if (key === "time") this.slotNotice = "";
      this.data[key] = val;
      this.root.querySelectorAll(`[data-pick="${key}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      if (key === "brand" && val === OTHER) return this.render(false), this.root.querySelector("#bk-brand-other")?.focus();
      this.#syncNext();
      clearTimeout(this.autoT);
      this.autoT = setTimeout(() => this.next(), 220);
      return;
    }
    switch (t.dataset.act) {
      case "next": if (t.getAttribute("aria-disabled") !== "true" || this.key === "info") this.next(); break;
      case "back": this.back(); break;
      case "confirm": if (t.getAttribute("aria-disabled") !== "true") this.confirm(); break;
      case "goto": this.go(Number(t.dataset.step)); break;
      case "custom-model":
        this.customModel = true;
        this.data.model = "";
        this.render(false);
        this.root.querySelector("#bk-model")?.focus();
        break;
      case "prev-month":
      case "next-month":
        this.calMonth = new Date(this.calMonth.getFullYear(), this.calMonth.getMonth() + (t.dataset.act === "next-month" ? 1 : -1), 1);
        this.render(false);
        this.root.querySelector(`[data-act="${t.dataset.act}"]:not([disabled])`)?.focus();
        break;
      case "ics": this.#ics(); break;
      case "restart":
        this.done = null;
        this.data = { ...this.data, date: "", time: "", note: "" };
        this.go(2);
        break;
    }
  }

  #onInput(e) {
    const key = e.target.dataset.field;
    if (!key) return;
    if (key === "consent") return;
    let v = e.target.value;
    if (key === "phone") {
      const f = formatPhoneInput(v);
      if (f !== v && e.inputType !== "deleteContentBackward") { e.target.value = f; v = f; }
    }
    if (key === "plate") {
      const up = v.toLocaleUpperCase("tr-TR");
      if (up !== v) { const p = e.target.selectionStart; e.target.value = up; e.target.setSelectionRange(p, p); v = up; }
    }
    this.data[key] = v;
    if (this.errors[key]) {
      const err = this.#validateInfo()[key];
      if (!err) { delete this.errors[key]; e.target.setAttribute("aria-invalid", "false"); this.root.querySelector(`#${e.target.id}-err`).textContent = ""; }
    }
    this.#syncNext();
  }

  #onChange(e) {
    if (e.target.dataset.field === "consent") {
      this.consent = e.target.checked;
      if (this.consent && this.errors.consent) {
        delete this.errors.consent;
        e.target.setAttribute("aria-invalid", "false");
        this.root.querySelector("#bk-consent-err").textContent = "";
      }
    }
  }

  #onBlur(e) {
    const key = e.target.dataset.field;
    if (!["name", "phone", "plate"].includes(key) || !this.data[key]) return;
    if (key === "plate" && isValidPlate(this.data.plate)) { this.data.plate = formatPlate(this.data.plate); e.target.value = this.data.plate; }
    const err = this.#validateInfo()[key];
    e.target.setAttribute("aria-invalid", String(!!err));
    const box = this.root.querySelector(`#${e.target.id}-err`);
    if (box) box.textContent = err || "";
    if (err) this.errors[key] = err; else delete this.errors[key];
  }

  #onKey(e) {
    // Takvimde ok tuşları ile gezinme
    const day = e.target.closest?.(".cal__day");
    if (day) {
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (!(e.key in map)) return;
      e.preventDefault();
      const all = [...this.root.querySelectorAll(".cal__day")];
      let i = all.indexOf(day) + map[e.key];
      while (all[i] && all[i].disabled) i += Math.sign(map[e.key]);
      if (all[i]) { all.forEach((b) => (b.tabIndex = -1)); all[i].tabIndex = 0; all[i].focus(); }
      return;
    }
    // Metin alanlarında Enter → devam
    if (e.key === "Enter" && e.target.matches("input.input")) {
      e.preventDefault();
      this.next();
    }
  }
}
