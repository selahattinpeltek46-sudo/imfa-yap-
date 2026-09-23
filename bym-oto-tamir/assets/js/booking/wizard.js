// Randevu sihirbazı — 5 adım + onay.
// 1 Hizmet · 2 Araç · 3 Tarih/Saat · 4 İletişim · 5 Özet → Onay
//
// Backend yok: Özet adımındaki buton, talep bilgileriyle hazırlanmış WhatsApp
// mesajını açar. Talep ayrıca yalnızca bu tarayıcıda saklanır (repository).
// Randevu kesinleşmiş gibi gösterilmez; ekip uygunluğu teyit eder.
import { BRANDS, MODELS, OTHER, SERVICES, serviceById } from "./catalog.js";
import {
  createAppointment, makeRef, isValidPhone, isValidPlate, formatPhoneInput, formatPlate,
  toISODate, formatDateTR,
} from "./appointment.js";
import { waLink, appointmentMessage } from "../whatsapp.js";
import { CONFIG } from "../config.js";

const STEPS = [
  { key: "service", label: "Hizmet" },
  { key: "vehicle", label: "Araç" },
  { key: "datetime", label: "Tarih & Saat" },
  { key: "contact", label: "İletişim" },
  { key: "summary", label: "Özet" },
];

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export class BookingWizard {
  constructor(root, { repo, availability, siteRoot = "" }) {
    this.root = root;
    this.repo = repo;
    this.av = availability;
    this.siteRoot = siteRoot;
    this.step = 0;
    this.dir = 1;
    this.errors = {};
    this.consent = false;
    this.customModel = false;
    this.done = null;
    this.ref = makeRef();
    this.data = { service: "", brand: "", brandOther: "", model: "", plate: "", date: "", time: "", name: "", phone: "", note: "" };
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

  // ?hizmet=klima&marka=BMW&not=... ile ön doldurma
  #prefill() {
    const q = new URLSearchParams(location.search);
    const service = q.get("hizmet");
    const brand = q.get("marka");
    const note = q.get("not");
    if (service && serviceById(service)) { this.data.service = service; this.step = 1; }
    if (brand && BRANDS.includes(brand)) this.data.brand = brand;
    if (note) this.data.note = note.slice(0, 500);
  }

  get key() { return STEPS[this.step].key; }

  #errorsFor(key) {
    const d = this.data, e = {};
    if (key === "vehicle") {
      if (!d.brand) e.brand = "Lütfen aracınızın markasını seçin.";
      else if (d.brand === OTHER && !d.brandOther.trim()) e.brandOther = "Lütfen markayı yazın.";
      if (d.brand && !d.model.trim()) e.model = "Lütfen modeli seçin veya yazın.";
      if (d.plate.trim() && !isValidPlate(d.plate)) e.plate = "Plaka biçimi geçersiz (ör. 46 ABC 123).";
    }
    if (key === "contact") {
      if (d.name.trim().length < 3) e.name = "Lütfen adınızı ve soyadınızı yazın.";
      if (!isValidPhone(d.phone)) e.phone = "Geçerli bir telefon numarası girin (0 5XX XXX XX XX).";
      if (!this.consent) e.consent = "Devam etmek için onay vermeniz gerekiyor.";
    }
    return e;
  }

  canProceed(key = this.key) {
    const d = this.data;
    if (key === "service") return !!d.service;
    if (key === "datetime") return !!d.date && !!d.time;
    if (key === "vehicle" || key === "contact") return Object.keys(this.#errorsFor(key)).length === 0;
    return true;
  }

  go(to) {
    if (to < 0 || to >= STEPS.length) return;
    this.dir = to > this.step ? 1 : -1;
    this.step = to;
    this.errors = {};
    this.render(true);
  }

  next() {
    if (this.key === "vehicle" || this.key === "contact") {
      this.errors = this.#errorsFor(this.key);
      if (Object.keys(this.errors).length) {
        this.render(false);
        this.root.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
    }
    if (!this.canProceed()) return;
    this.go(this.step + 1);
  }

  // --- Render -------------------------------------------------------------
  render(moveFocus) {
    if (this.done) return this.#renderDone(moveFocus);
    const s = STEPS[this.step];
    const steps = STEPS.map((x, i) =>
      `<li class="${i < this.step ? "is-done" : i === this.step ? "is-current" : ""}"${i === this.step ? ' aria-current="step"' : ""}><span>${x.label}</span></li>`).join("");
    const isLast = s.key === "summary";
    const soft = s.key === "vehicle" || s.key === "contact";
    const action = isLast
      ? `<a class="btn btn--wa btn--lg" href="${waLink(appointmentMessage(this.#appointment()))}" target="_blank" rel="noopener" data-act="send">${icon("i-wa")} Talebi WhatsApp ile gönder</a>`
      : `<button type="button" class="btn btn--light" data-act="next"${!soft && !this.canProceed() ? ' aria-disabled="true"' : ""}>Devam ${icon("i-arrow")}</button>`;
    const note = isLast
      ? "Butona bastığınızda bilgileriniz WhatsApp mesajı olarak hazırlanır; göndermeyi siz onaylarsınız."
      : `Telefonla randevu: <a href="tel:${CONFIG.firma.telefon}">${esc(CONFIG.firma.telefonGorunen)}</a>`;
    this.root.innerHTML = `
      <div class="wz">
        <div class="wz__top">
          <p class="wz__meta"><span>Adım <b>${this.step + 1}</b> / ${STEPS.length}</span><span>${esc(s.label)}</span></p>
          <ol class="wz__steps" aria-label="Randevu adımları">${steps}</ol>
        </div>
        <div class="wz__body">
          <div class="wz__step${this.dir < 0 ? " is-back" : ""}">${this[`step_${s.key}`]()}</div>
        </div>
        <div class="wz__foot${isLast ? " wz__foot--send" : ""}">
          <button type="button" class="wz__back" data-act="back"${this.step === 0 ? " hidden" : ""}>${icon("i-arrow-l")} Geri</button>
          ${action}
        </div>
        <p class="wz__demo">${note}</p>
      </div>`;
    if (s.key === "datetime" && this.data.date) this.#loadSlots();
    if (moveFocus) {
      this.root.querySelector(".wz__q")?.focus({ preventScroll: true });
      const top = this.root.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.5) {
        const offset = (document.querySelector("[data-header]")?.offsetHeight || 64) + 12;
        scrollTo({ top: scrollY + top - offset, behavior: reduceMotion() ? "auto" : "smooth" });
      }
    }
  }

  #q(title, hint) {
    return `<h3 class="wz__q" tabindex="-1">${title}</h3>${hint ? `<p class="wz__hint">${hint}</p>` : ""}`;
  }

  #field(id, key, label, attrs, cls = "", optional = false) {
    const err = this.errors[key] || "";
    return `
      <div class="field">
        <label for="${id}">${label}${optional ? ' <span class="opt-l">(isteğe bağlı)</span>' : ""}</label>
        <input id="${id}" class="input ${cls}" data-field="${key}" value="${esc(this.data[key])}" ${attrs}
          aria-invalid="${!!err}" aria-describedby="${id}-err">
        <span class="err" id="${id}-err">${esc(err)}</span>
      </div>`;
  }

  #select(id, key, label, options, disabled = false) {
    const err = this.errors[key] || "";
    return `
      <div class="field">
        <label for="${id}">${label}</label>
        <select id="${id}" class="input" data-select="${key}"${disabled ? " disabled" : ""} aria-invalid="${!!err}" aria-describedby="${id}-err">${options}</select>
        <span class="err" id="${id}-err">${esc(err)}</span>
      </div>`;
  }

  // 1 — Hizmet
  step_service() {
    const opts = SERVICES.map((s) => `
      <button type="button" class="opt" data-pick="service" data-val="${s.id}" aria-pressed="${this.data.service === s.id}">
        <span class="opt__ic">${icon(s.icon)}</span><span>${esc(s.name)}</span>${icon("i-tick", "ic opt__check")}
      </button>`).join("");
    return `${this.#q("Hangi hizmete ihtiyacınız var?", "Emin değilseniz “Arıza Kontrolü”nü seçin.")}
      <div class="opts opts--list" role="group" aria-label="Hizmet">${opts}</div>`;
  }

  // 2 — Araç
  step_vehicle() {
    const d = this.data;
    const brandOpts = `<option value="">Marka seçin</option>` + BRANDS.map((b) => `<option${d.brand === b ? " selected" : ""}>${esc(b)}</option>`).join("");
    const models = MODELS[d.brand] || [];
    const custom = d.brand === OTHER || this.customModel || (d.model && !models.includes(d.model));
    let model;
    if (!d.brand) {
      model = this.#select("bk-model-s", "model", "Model", "<option>Önce marka seçin</option>", true);
    } else if (!custom && models.length) {
      const mo = `<option value="">Model seçin</option>` + models.map((m) => `<option${d.model === m ? " selected" : ""}>${esc(m)}</option>`).join("") + `<option value="__other">Listede yok</option>`;
      model = this.#select("bk-model-s", "model", "Model", mo);
    } else {
      model = this.#field("bk-model", "model", "Model", 'autocomplete="off" placeholder="Örn. Octavia 1.6 TDI"');
    }
    const other = d.brand === OTHER ? this.#field("bk-brand-other", "brandOther", "Marka adı", 'autocomplete="off" placeholder="Örn. Skoda"') : "";
    return `${this.#q("Aracınızın bilgileri", "Marka ve model yeterli; plaka isteğe bağlıdır.")}
      <div class="grid-2">
        ${this.#select("bk-brand", "brand", "Marka", brandOpts)}
        ${other || model}
      </div>
      ${other ? model : ""}
      ${this.#field("bk-plate", "plate", "Plaka", 'autocomplete="off" autocapitalize="characters" placeholder="46 ABC 123"', "input--plate", true)}`;
  }

  // 3 — Tarih & saat
  step_datetime() {
    const m = this.calMonth;
    const title = m.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    const today = this.av.today();
    const lead = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
    const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = this.av.lastDay();
    const maxMonth = new Date(last.getFullYear(), last.getMonth(), 1);
    let first = -1;
    let cells = DOW.map((x) => `<div class="cal__dow" aria-hidden="true">${x}</div>`).join("");
    for (let i = 0; i < lead; i++) cells += "<span></span>";
    for (let d = 1; d <= days; d++) {
      const date = new Date(m.getFullYear(), m.getMonth(), d);
      const iso = toISODate(date);
      const open = this.av.isDateOpen(date);
      if (open && first < 0) first = d;
      const sel = this.data.date === iso;
      const label = date.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" }) + (open ? "" : ", müsait değil");
      const tab = sel || (!this.data.date && open && first === d) ? 0 : -1;
      cells += `<button type="button" class="cal__day${+date === +today ? " is-today" : ""}" data-pick="date" data-val="${iso}"
        aria-pressed="${sel}" aria-label="${esc(label)}"${open ? "" : " disabled"} tabindex="${tab}">${d}</button>`;
    }
    const slotBox = this.data.date
      ? `<p class="pick-date">${icon("i-cal")} ${esc(formatDateTR(this.data.date))}</p>
         <div data-slots aria-live="polite"><div class="slots">${this.av.slots.map(() => '<span class="slot slot--ghost"></span>').join("")}</div></div>`
      : `<p class="slots-empty">${icon("i-clock")} Saatleri görmek için önce bir gün seçin.</p>`;
    return `${this.#q("Size uygun gün ve saat", "Pazar günleri kapalıyız. Geçmiş tarih ve saatler seçilemez.")}
      <div class="dt">
        <div class="cal">
          <div class="cal__head">
            <span class="cal__title" aria-live="polite">${esc(title)}</span>
            <div class="cal__nav">
              <button type="button" class="icon-btn" data-act="prev-month" aria-label="Önceki ay"${m <= minMonth ? " disabled" : ""}>${icon("i-chev-l")}</button>
              <button type="button" class="icon-btn" data-act="next-month" aria-label="Sonraki ay"${m >= maxMonth ? " disabled" : ""}>${icon("i-chev-r")}</button>
            </div>
          </div>
          <div class="cal__grid" role="group" aria-label="${esc(title)}">${cells}</div>
        </div>
        <div class="dt__slots" data-slot-area>${slotBox}</div>
      </div>`;
  }

  async #loadSlots() {
    const date = this.data.date;
    const slots = await this.av.slotsFor(date);
    if (this.key !== "datetime" || this.data.date !== date) return;
    const box = this.root.querySelector("[data-slots]");
    if (!box) return;
    if (this.data.time && !slots.find((s) => s.time === this.data.time && s.available)) this.data.time = "";
    const btn = (s) => `<button type="button" class="slot" data-pick="time" data-val="${s.time}" aria-pressed="${this.data.time === s.time}"${s.available ? "" : ` disabled aria-label="${s.time}, müsait değil"`}>${s.time}</button>`;
    const am = slots.filter((s) => s.time < "12:00");
    const pm = slots.filter((s) => s.time >= "12:00");
    box.innerHTML = slots.some((s) => s.available)
      ? `${am.length ? `<p class="slot-group">Öğleden önce</p><div class="slots" role="group" aria-label="Öğleden önce">${am.map(btn).join("")}</div>` : ""}
         ${pm.length ? `<p class="slot-group">Öğleden sonra</p><div class="slots" role="group" aria-label="Öğleden sonra">${pm.map(btn).join("")}</div>` : ""}`
      : `<p class="slots-empty">Bu gün için uygun saat kalmadı. Lütfen başka bir gün seçin.</p>`;
    this.#syncNext();
  }

  // 4 — İletişim
  step_contact() {
    const er = this.errors;
    return `${this.#q("İletişim bilgileriniz", "Uygunluk durumunu teyit etmek için bu numaradan size dönüş yapılır.")}
      ${this.#field("bk-name", "name", "Ad Soyad", 'autocomplete="name" placeholder="Adınız ve soyadınız"')}
      ${this.#field("bk-phone", "phone", "Telefon", 'type="tel" inputmode="tel" autocomplete="tel-national" placeholder="0 (5XX) XXX XX XX"')}
      <div class="field">
        <label for="bk-note">Şikâyet / not <span class="opt-l">(isteğe bağlı)</span></label>
        <textarea id="bk-note" class="input" data-field="note" rows="3" maxlength="500" placeholder="Aracınızda fark ettiğiniz belirtiyi kısaca yazın">${esc(this.data.note)}</textarea>
      </div>
      <label class="check">
        <input type="checkbox" data-field="consent"${this.consent ? " checked" : ""} aria-invalid="${!!er.consent}" aria-describedby="bk-consent-err">
        <span><a href="${this.siteRoot}kvkk/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>'ni okudum; randevu talebim için bilgilerimin işlenmesini kabul ediyorum.</span>
      </label>
      <span class="err" id="bk-consent-err">${esc(er.consent || "")}</span>`;
  }

  // 5 — Özet
  step_summary() {
    const a = this.#appointment();
    const row = (label, value, step) => value ? `
      <div class="summary__row"><dt>${label}</dt><dd>${esc(value)}</dd>
        <button type="button" class="summary__edit" data-act="goto" data-step="${step}" aria-label="${label} bilgisini değiştir">Değiştir</button></div>` : "";
    return `${this.#q("Randevu talebinizin özeti", "Bilgileri kontrol edin ve talebinizi WhatsApp ile gönderin.")}
      <dl class="summary">
        ${row("Hizmet", serviceById(a.service)?.name, 0)}
        ${row("Araç", `${a.brand} ${a.model}`.trim(), 1)}
        ${row("Plaka", a.plate ? formatPlate(a.plate) : "", 1)}
        ${row("Tarih", formatDateTR(a.date), 2)}
        ${row("Saat", a.time, 2)}
        ${row("Ad Soyad", a.name, 3)}
        ${row("Telefon", formatPhoneInput(a.phone), 3)}
        ${row("Not", a.note, 3)}
      </dl>`;
  }

  #appointment() {
    const d = this.data;
    return createAppointment({ ...d, id: this.ref, brand: d.brand === OTHER ? d.brandOther.trim() : d.brand });
  }

  #renderDone(moveFocus) {
    const a = this.done;
    this.root.innerHTML = `
      <div class="wz"><div class="wz__body">
        <div class="done">
          <div class="done__icon">${icon("i-tick")}</div>
          <h3 class="done__t" tabindex="-1">Randevu talebiniz oluşturuldu.</h3>
          <p class="done__p">Ekibimiz uygunluk durumunu teyit etmek için sizinle iletişime geçecektir.</p>
          <p class="done__ref">${esc(a.id)}</p>
          <p class="done__p"><strong>${esc(formatDateTR(a.date))} · ${esc(a.time)}</strong><br>${esc(serviceById(a.service)?.name)} · ${esc(a.brand)} ${esc(a.model)}</p>
          <p class="done__small">WhatsApp mesajını göndermediyseniz talebiniz bize ulaşmamış olabilir.</p>
          <div class="btn-row">
            <a class="btn btn--wa" href="${waLink(appointmentMessage(a))}" target="_blank" rel="noopener">${icon("i-wa")} Mesajı tekrar aç</a>
            <a class="btn btn--ghost" href="tel:${CONFIG.firma.telefon}">${icon("i-phone")} Bizi arayın</a>
          </div>
          <div class="done__links"><button type="button" data-act="restart">Yeni talep oluştur</button></div>
        </div>
      </div></div>`;
    if (moveFocus) this.root.querySelector(".done__t")?.focus({ preventScroll: true });
  }

  #send() {
    const appt = this.#appointment();
    this.repo.create(appt).catch(() => {});
    this.done = appt;
    // Bağlantı WhatsApp'ı yeni sekmede açar; onay ekranı hemen ardından gösterilir
    setTimeout(() => this.render(true), 150);
  }

  // --- Olaylar ------------------------------------------------------------
  #syncNext() {
    const b = this.root.querySelector('[data-act="next"]');
    if (!b || this.key === "vehicle" || this.key === "contact") return;
    this.canProceed() ? b.removeAttribute("aria-disabled") : b.setAttribute("aria-disabled", "true");
  }

  #onClick(e) {
    const t = e.target.closest("[data-pick],[data-act]");
    if (!t || !this.root.contains(t) || t.disabled) return;
    if (t.dataset.pick) {
      const key = t.dataset.pick, val = t.dataset.val;
      if (key === "date") {
        if (this.data.date !== val) this.data.time = "";
        this.data.date = val;
        this.render(false);
        this.root.querySelector(`.cal__day[data-val="${val}"]`)?.focus({ preventScroll: true });
        const area = this.root.querySelector("[data-slot-area]");
        if (area && matchMedia("(max-width: 899px)").matches) area.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "nearest" });
        return;
      }
      this.data[key] = val;
      this.root.querySelectorAll(`[data-pick="${key}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      this.#syncNext();
      if (key === "service") { clearTimeout(this.autoT); this.autoT = setTimeout(() => this.next(), 220); }
      return;
    }
    switch (t.dataset.act) {
      case "next": if (t.getAttribute("aria-disabled") !== "true") this.next(); break;
      case "back": this.go(this.step - 1); break;
      case "goto": this.go(Number(t.dataset.step)); break;
      case "send": this.#send(); break; // bağlantının kendisi WhatsApp'ı açar
      case "prev-month":
      case "next-month":
        this.calMonth = new Date(this.calMonth.getFullYear(), this.calMonth.getMonth() + (t.dataset.act === "next-month" ? 1 : -1), 1);
        this.render(false);
        this.root.querySelector(`[data-act="${t.dataset.act}"]:not([disabled])`)?.focus();
        break;
      case "restart":
        this.done = null;
        this.ref = makeRef();
        this.data = { ...this.data, date: "", time: "", note: "" };
        this.go(0);
        break;
    }
  }

  #onChange(e) {
    const sel = e.target.dataset.select;
    if (sel === "brand") {
      this.data.brand = e.target.value;
      this.data.model = "";
      this.customModel = false;
      delete this.errors.brand;
      delete this.errors.model;
      this.render(false);
      this.root.querySelector(this.data.brand === OTHER ? "#bk-brand-other" : "#bk-model-s")?.focus();
      return;
    }
    if (sel === "model") {
      if (e.target.value === "__other") {
        this.customModel = true;
        this.data.model = "";
        this.render(false);
        this.root.querySelector("#bk-model")?.focus();
      } else {
        this.data.model = e.target.value;
        if (this.data.model) this.#setErr(e.target, "model", "");
      }
      return;
    }
    if (e.target.dataset.field === "consent") {
      this.consent = e.target.checked;
      if (this.consent) this.#setErr(e.target, "consent", "", "bk-consent-err");
    }
  }

  #onInput(e) {
    const key = e.target.dataset.field;
    if (!key || key === "consent") return;
    let v = e.target.value;
    if (key === "phone" && e.inputType !== "deleteContentBackward") {
      const f = formatPhoneInput(v);
      if (f !== v) { e.target.value = f; v = f; }
    }
    if (key === "plate") {
      const up = v.toLocaleUpperCase("tr-TR");
      if (up !== v) { const p = e.target.selectionStart; e.target.value = up; e.target.setSelectionRange(p, p); v = up; }
    }
    this.data[key] = v;
    if (this.errors[key] && !this.#errorsFor(this.key)[key]) this.#setErr(e.target, key, "");
  }

  #setErr(input, key, msg, boxId = `${input.id}-err`) {
    input.setAttribute("aria-invalid", String(!!msg));
    const box = this.root.querySelector(`#${boxId}`);
    if (box) box.textContent = msg;
    if (msg) this.errors[key] = msg; else delete this.errors[key];
  }

  #onBlur(e) {
    const key = e.target.dataset.field;
    if (!["name", "phone", "plate"].includes(key) || !this.data[key]) return;
    if (key === "plate" && isValidPlate(this.data.plate)) { this.data.plate = formatPlate(this.data.plate); e.target.value = this.data.plate; }
    this.#setErr(e.target, key, this.#errorsFor(this.key)[key] || "");
  }

  #onKey(e) {
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
    if (e.key === "Enter" && e.target.matches("input.input")) {
      e.preventDefault();
      this.next();
    }
  }
}
