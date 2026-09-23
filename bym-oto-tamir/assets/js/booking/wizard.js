// Randevu talep sihirbazı — GitHub Pages uyumlu, backend gerektirmez.
//
// Adımlar: 01 Hizmet · 02 Araç (+ sorun açıklaması) · 03 Tarih & saat · 04 Bilgiler · 05 Onay
//
// Gönderim: "Randevu talebi gönder" butonu, bilgileri hazır bir WhatsApp mesajı olarak açar.
// Veriler tarayıcıya kaydedilmez ve üçüncü taraf bir servise gönderilmez.
// Gerçek zamanlı müsaitlik kontrolü olmadığı için randevu "kesinleşti" denmez;
// BYM ekibi uygunluğu teyit eder.
//
// Çalışma saatleri / kapalı günler: _build/site.json → randevu.saatler, randevu.kapali_gunler
import { BRANDS, OTHER, SERVICES, serviceById } from "./catalog.js";
import { isValidPhone, isValidPlate, formatPhoneInput, formatPlate, toISODate, fromISODate } from "./appointment.js";
import { waLink, appointmentMessage } from "../whatsapp.js";
import { CONFIG } from "../config.js";

const STEPS = [
  { key: "service", label: "Hizmet" },
  { key: "vehicle", label: "Araç" },
  { key: "datetime", label: "Tarih" },
  { key: "contact", label: "Bilgiler" },
  { key: "summary", label: "Onay" },
];

const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const THIS_YEAR = new Date().getFullYear();
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const icon = (id, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"></use></svg>`;
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (n) => String(n).padStart(2, "0");

// 25.09.2026
export function formatDateNumeric(iso) {
  const d = fromISODate(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}
// 25.09.2026 · Cuma
function formatDateLong(iso) {
  return `${formatDateNumeric(iso)} · ${fromISODate(iso).toLocaleDateString("tr-TR", { weekday: "long" })}`;
}

export class BookingWizard {
  constructor(root, { availability, siteRoot = "" }) {
    this.root = root;
    this.av = availability;
    this.siteRoot = siteRoot;
    this.step = 0;
    this.dir = 1;
    this.errors = {};
    this.done = false;
    this.data = { service: "", brand: "", model: "", year: "", plate: "", problem: "", date: "", time: "", name: "", phone: "" };
    const t = this.av.today();
    this.calMonth = new Date(t.getFullYear(), t.getMonth(), 1);
    this._prefill();
    this.render(false);
    root.addEventListener("click", (e) => this._onClick(e));
    root.addEventListener("input", (e) => this._onInput(e));
    root.addEventListener("focusout", (e) => this._onBlur(e));
    root.addEventListener("keydown", (e) => this._onKey(e));
  }

  // ?hizmet=klima&marka=BMW&not=... ile ön doldurma (hizmet ve belirti sayfalarından gelen bağlantılar)
  _prefill() {
    const q = new URLSearchParams(window.location.search);
    const service = q.get("hizmet");
    const brand = q.get("marka");
    const note = q.get("not");
    if (service && serviceById(service)) { this.data.service = service; this.step = 1; }
    if (brand) this.data.brand = brand.slice(0, 40);
    if (note) this.data.problem = note.slice(0, 500);
  }

  get key() { return STEPS[this.step].key; }

  // --- Doğrulama ----------------------------------------------------------
  _validate(key = this.key) {
    const d = this.data, e = {};
    if (key === "service" && !d.service) e.service = "Lütfen bir hizmet seçin.";
    if (key === "vehicle") {
      if (!d.brand.trim()) e.brand = "Lütfen aracınızın markasını girin.";
      if (!d.model.trim()) e.model = "Lütfen aracınızın modelini girin.";
      const y = d.year.trim();
      if (y && (!/^\d{4}$/.test(y) || +y < 1950 || +y > THIS_YEAR + 1)) e.year = `Lütfen geçerli bir model yılı girin (1950–${THIS_YEAR + 1}).`;
      if (d.plate.trim() && !isValidPlate(d.plate)) e.plate = "Plaka biçimi geçersiz (ör. 46 ABC 123).";
    }
    if (key === "datetime") {
      if (!d.date) e.date = "Lütfen tarih seçin.";
      else if (!this.av.isDateOpen(fromISODate(d.date))) e.date = "Seçilen gün uygun değil. Lütfen başka bir tarih seçin.";
      else if (!d.time) e.time = "Lütfen saat seçin.";
    }
    if (key === "contact") {
      if (d.name.trim().split(/\s+/).filter(Boolean).length < 2) e.name = "Lütfen adınızı ve soyadınızı girin.";
      if (!isValidPhone(d.phone)) e.phone = "Lütfen geçerli bir telefon numarası girin (ör. 0532 123 45 67).";
    }
    return e;
  }

  go(to) {
    if (to < 0 || to >= STEPS.length) return;
    this.dir = to > this.step ? 1 : -1;
    this.step = to;
    this.errors = {};
    this.render(true);
  }

  next() {
    this.errors = this._validate();
    if (Object.keys(this.errors).length) {
      this.render(false);
      const bad = this.root.querySelector('[aria-invalid="true"]') || this.root.querySelector(".wz__alert");
      if (bad) bad.focus();
      return;
    }
    this.go(this.step + 1);
  }

  // --- Özet verisi (ekran + WhatsApp mesajı) --------------------------------
  _summary() {
    const d = this.data;
    const phoneDigits = d.phone.replace(/\D/g, "");
    return {
      service: (serviceById(d.service) || {}).name || "",
      vehicle: `${d.brand.trim()} ${d.model.trim()}`.trim(),
      year: d.year.trim(),
      plate: d.plate.trim() ? formatPlate(d.plate) : "",
      problem: d.problem.trim(),
      date: d.date ? formatDateNumeric(d.date) : "",
      time: d.time,
      name: d.name.trim().replace(/\s+/g, " "),
      phone: phoneDigits ? formatPhoneInput(phoneDigits) : "",
    };
  }

  _waHref() {
    return waLink(appointmentMessage(this._summary()));
  }

  // --- Render -------------------------------------------------------------
  render(moveFocus) {
    if (this.done) return this._renderDone(moveFocus);
    const s = STEPS[this.step];
    const isLast = s.key === "summary";
    const steps = STEPS.map((x, i) => {
      const cls = i < this.step ? "is-done" : i === this.step ? "is-current" : "";
      return `<li class="${cls}"${i === this.step ? ' aria-current="step"' : ""}><span class="wz__num">${pad(i + 1)}</span><span class="wz__lbl">${x.label}</span></li>`;
    }).join("");
    const alerts = Object.keys(this.errors).filter((k) => ["service", "date", "time"].includes(k)).map((k) => this.errors[k]);
    const alert = alerts.length ? `<p class="wz__alert" role="alert" tabindex="-1">${esc(alerts[0])}</p>` : "";
    const foot = isLast
      ? `<button type="button" class="wz__back" data-act="edit">${icon("i-arrow-l")} Bilgileri Düzenle</button>
         <a class="btn btn--accent btn--lg" href="${this._waHref()}" target="_blank" rel="noopener" data-act="send">Randevu Talebi Gönder ${icon("i-arrow")}</a>`
      : `<button type="button" class="wz__back" data-act="back"${this.step === 0 ? " hidden" : ""}>${icon("i-arrow-l")} Geri</button>
         <button type="button" class="btn btn--light" data-act="next">İleri ${icon("i-arrow")}</button>`;
    const note = isLast
      ? "Talebiniz WhatsApp üzerinden BYM Automotive'e iletilir. Bilgileriniz başka bir yere kaydedilmez."
      : `Telefonla randevu: <a href="tel:${CONFIG.firma.telefon}">${esc(CONFIG.firma.telefonGorunen)}</a>`;
    this.root.innerHTML = `
      <div class="wz">
        <div class="wz__top">
          <ol class="wz__steps" aria-label="Randevu adımları">${steps}</ol>
          <p class="sr-only" aria-live="polite">Adım ${this.step + 1} / ${STEPS.length}: ${s.label}</p>
        </div>
        <div class="wz__body">
          <div class="wz__step${this.dir < 0 ? " is-back" : ""}">${this["step_" + s.key]()}${alert}</div>
        </div>
        <div class="wz__foot${isLast ? " wz__foot--send" : ""}">${foot}</div>
        <p class="wz__demo">${note}</p>
      </div>`;
    if (s.key === "datetime" && this.data.date) this._loadSlots();
    if (moveFocus) this._focusTop();
  }

  _focusTop() {
    const h = this.root.querySelector(".wz__q, .done__t");
    if (h) h.focus({ preventScroll: true });
    const top = this.root.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.5) {
      const hdr = document.querySelector("[data-header]");
      const offset = (hdr ? hdr.offsetHeight : 64) + 12;
      window.scrollTo({ top: window.scrollY + top - offset, behavior: reduceMotion() ? "auto" : "smooth" });
    }
  }

  _q(title, hint) {
    return `<h3 class="wz__q" tabindex="-1">${title}</h3>${hint ? `<p class="wz__hint">${hint}</p>` : ""}`;
  }

  _field(id, key, label, attrs, opts = {}) {
    const err = this.errors[key] || "";
    const optional = opts.optional ? ' <span class="opt-l">(isteğe bağlı)</span>' : "";
    return `
      <div class="field">
        <label for="${id}">${label}${optional}</label>
        <input id="${id}" class="input ${opts.cls || ""}" data-field="${key}" value="${esc(this.data[key])}" ${attrs}
          aria-invalid="${!!err}" aria-describedby="${id}-err">
        <span class="err" id="${id}-err">${esc(err)}</span>
      </div>`;
  }

  // 01 — Hizmet
  step_service() {
    const opts = SERVICES.map((s) => `
      <button type="button" class="opt" data-pick="service" data-val="${s.id}" aria-pressed="${this.data.service === s.id}">
        <span class="opt__ic">${icon(s.icon)}</span><span>${esc(s.name)}</span>${icon("i-tick", "ic opt__check")}
      </button>`).join("");
    return `${this._q("Hangi hizmete ihtiyacınız var?", "Emin değilseniz “Genel Araç Kontrolü”nü seçin.")}
      <div class="opts opts--list" role="group" aria-label="Hizmet">${opts}</div>`;
  }

  // 02 — Araç + sorun
  step_vehicle() {
    const brands = BRANDS.filter((b) => b !== OTHER).map((b) => `<option value="${esc(b)}"></option>`).join("");
    return `${this._q("Aracınızın bilgileri", "Marka ve model yeterli; diğer alanlar isteğe bağlıdır.")}
      <div class="grid-2">
        ${this._field("bk-brand", "brand", "Marka", 'list="bk-brands" autocomplete="off" autocapitalize="words" placeholder="Örn. BMW"')}
        ${this._field("bk-model", "model", "Model", 'autocomplete="off" placeholder="Örn. 520d"')}
      </div>
      <datalist id="bk-brands">${brands}</datalist>
      <div class="grid-2">
        ${this._field("bk-year", "year", "Model yılı", 'inputmode="numeric" maxlength="4" autocomplete="off" placeholder="Örn. 2018"', { optional: true })}
        ${this._field("bk-plate", "plate", "Plaka", 'autocomplete="off" autocapitalize="characters" placeholder="46 ABC 123"', { optional: true, cls: "input--plate" })}
      </div>
      <div class="field">
        <label for="bk-problem">Aracınızda yaşadığınız sorunu kısaca anlatın <span class="opt-l">(isteğe bağlı)</span></label>
        <textarea id="bk-problem" class="input" data-field="problem" rows="3" maxlength="500"
          placeholder="Örn: Motor arıza lambası yanıyor ve araç son günlerde titriyor.">${esc(this.data.problem)}</textarea>
      </div>`;
  }

  // 03 — Tarih & saat
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
      const label = `${formatDateNumeric(iso)}, ${date.toLocaleDateString("tr-TR", { weekday: "long" })}${open ? "" : ", seçilemez"}`;
      const tab = sel || (!this.data.date && open && first === d) ? 0 : -1;
      cells += `<button type="button" class="cal__day${+date === +today ? " is-today" : ""}" data-pick="date" data-val="${iso}"
        aria-pressed="${sel}" aria-label="${esc(label)}"${open ? "" : " disabled"} tabindex="${tab}">${d}</button>`;
    }
    const slotBox = this.data.date
      ? `<p class="pick-date">${icon("i-cal")} ${esc(formatDateLong(this.data.date))}</p>
         <div data-slots><div class="slots">${this.av.slots.map(() => '<span class="slot slot--ghost"></span>').join("")}</div></div>`
      : `<p class="slots-empty">${icon("i-clock")} Saatleri görmek için önce bir gün seçin.</p>`;
    return `${this._q("Size uygun gün ve saat", "Geçmiş tarihler ve kapalı günler seçilemez. Seçtiğiniz saat ekibimiz tarafından teyit edilir.")}
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

  _loadSlots() {
    const date = this.data.date;
    this.av.slotsFor(date).then((slots) => {
      if (this.done || this.key !== "datetime" || this.data.date !== date) return;
      const box = this.root.querySelector("[data-slots]");
      if (!box) return;
      if (this.data.time && !slots.some((s) => s.time === this.data.time && s.available)) this.data.time = "";
      const btn = (s) => `<button type="button" class="slot" data-pick="time" data-val="${s.time}" aria-pressed="${this.data.time === s.time}"${s.available ? "" : ` disabled aria-label="${s.time}, seçilemez"`}>${s.time}</button>`;
      const am = slots.filter((s) => s.time < "12:00");
      const pm = slots.filter((s) => s.time >= "12:00");
      box.innerHTML = slots.some((s) => s.available)
        ? `${am.length ? `<p class="slot-group">Öğleden önce</p><div class="slots" role="group" aria-label="Öğleden önce">${am.map(btn).join("")}</div>` : ""}
           ${pm.length ? `<p class="slot-group">Öğleden sonra</p><div class="slots" role="group" aria-label="Öğleden sonra">${pm.map(btn).join("")}</div>` : ""}`
        : `<p class="slots-empty">Bu gün için uygun saat kalmadı. Lütfen başka bir gün seçin.</p>`;
    });
  }

  // 04 — Bilgiler
  step_contact() {
    return `${this._q("İletişim bilgileriniz", "Uygunluk durumunu teyit etmek için bu numaradan size dönüş yapılır.")}
      ${this._field("bk-name", "name", "Ad Soyad", 'autocomplete="name" autocapitalize="words" placeholder="Adınız ve soyadınız"')}
      ${this._field("bk-phone", "phone", "Telefon", 'type="tel" inputmode="tel" autocomplete="tel-national" placeholder="0 (5XX) XXX XX XX"')}
      <p class="wz__legal">Talebi göndererek bilgilerinizin randevu amacıyla işlenmesine ilişkin
        <a href="${this.siteRoot}kvkk/" target="_blank" rel="noopener">KVKK Aydınlatma Metni</a>'ni okuduğunuzu kabul edersiniz.</p>`;
  }

  // 05 — Onay (özet)
  step_summary() {
    const r = this._summary();
    const row = (label, value, step) => value ? `
      <div class="summary__row"><dt>${label}</dt><dd>${esc(value)}</dd>
        <button type="button" class="summary__edit" data-act="goto" data-step="${step}" aria-label="${label} bilgisini değiştir">Değiştir</button></div>` : "";
    return `${this._q("Randevu talebinizi kontrol edin", "Bilgiler doğruysa talebinizi gönderin.")}
      <dl class="summary">
        ${row("Hizmet", r.service, 0)}
        ${row("Araç", r.vehicle, 1)}
        ${row("Model yılı", r.year, 1)}
        ${row("Plaka", r.plate, 1)}
        ${row("Sorun", r.problem, 1)}
        ${row("Tarih", this.data.date ? formatDateLong(this.data.date) : "", 2)}
        ${row("Saat", r.time, 2)}
        ${row("Ad Soyad", r.name, 3)}
        ${row("Telefon", r.phone, 3)}
      </dl>`;
  }

  _renderDone(moveFocus) {
    const r = this._summary();
    this.root.innerHTML = `
      <div class="wz"><div class="wz__body">
        <div class="done">
          <div class="done__icon">${icon("i-tick")}</div>
          <h3 class="done__t" tabindex="-1">Randevu talebiniz alındı.</h3>
          <p class="done__p">BYM Automotive ekibimiz uygunluğu teyit etmek için sizinle iletişime geçecektir.</p>
          <p class="done__p"><strong>${esc(this.data.date ? formatDateLong(this.data.date) : "")} · ${esc(r.time)}</strong><br>${esc(r.service)} · ${esc(r.vehicle)}</p>
          <p class="done__notice">Talebinizin bize ulaşması için açılan WhatsApp mesajını <strong>gönder</strong> tuşuna basarak iletin. WhatsApp açılmadıysa aşağıdaki butonu kullanın.</p>
          <div class="btn-row">
            <a class="btn btn--wa btn--lg" href="${this._waHref()}" target="_blank" rel="noopener">${icon("i-wa")} WhatsApp'tan Gönder</a>
            <a class="btn btn--ghost" href="tel:${CONFIG.firma.telefon}">${icon("i-phone")} Bizi arayın</a>
          </div>
          <div class="done__links"><button type="button" data-act="restart">Yeni talep oluştur</button></div>
        </div>
      </div></div>`;
    if (moveFocus) this._focusTop();
  }

  // --- Olaylar ------------------------------------------------------------
  _clearAlert() {
    const a = this.root.querySelector(".wz__alert");
    if (a) a.remove();
  }

  _onClick(e) {
    const t = e.target.closest("[data-pick],[data-act]");
    if (!t || !this.root.contains(t) || t.disabled) return;
    if (t.dataset.pick) {
      const key = t.dataset.pick, val = t.dataset.val;
      if (key === "date") {
        if (this.data.date !== val) this.data.time = "";
        this.data.date = val;
        delete this.errors.date;
        delete this.errors.time;
        this.render(false);
        const day = this.root.querySelector(`.cal__day[data-val="${val}"]`);
        if (day) day.focus({ preventScroll: true });
        const area = this.root.querySelector("[data-slot-area]");
        if (area && window.matchMedia("(max-width: 899px)").matches) area.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "nearest" });
        return;
      }
      this.data[key] = val;
      delete this.errors[key];
      this._clearAlert();
      this.root.querySelectorAll(`[data-pick="${key}"]`).forEach((b) => b.setAttribute("aria-pressed", String(b === t)));
      if (key === "service") { clearTimeout(this.autoT); this.autoT = setTimeout(() => this.next(), 220); }
      return;
    }
    switch (t.dataset.act) {
      case "next": this.next(); break;
      case "back": this.go(this.step - 1); break;
      case "edit": this.go(STEPS.length - 2); break;
      case "goto": this.go(Number(t.dataset.step)); break;
      case "send":
        // Bağlantının kendisi WhatsApp'ı açar (href); ardından onay ekranı gösterilir.
        this.done = true;
        setTimeout(() => this.render(true), 150);
        break;
      case "prev-month":
      case "next-month": {
        const dir = t.dataset.act === "next-month" ? 1 : -1;
        this.calMonth = new Date(this.calMonth.getFullYear(), this.calMonth.getMonth() + dir, 1);
        this.render(false);
        const nav = this.root.querySelector(`[data-act="${t.dataset.act}"]:not([disabled])`);
        if (nav) nav.focus();
        break;
      }
      case "restart":
        this.done = false;
        this.data = { ...this.data, date: "", time: "", problem: "" };
        this.go(0);
        break;
    }
  }

  _onInput(e) {
    const key = e.target.dataset.field;
    if (!key) return;
    let v = e.target.value;
    if (key === "phone" && e.inputType !== "deleteContentBackward") {
      const f = formatPhoneInput(v);
      if (f !== v) { e.target.value = f; v = f; }
    }
    if (key === "year") {
      const digits = v.replace(/\D/g, "").slice(0, 4);
      if (digits !== v) { e.target.value = digits; v = digits; }
    }
    if (key === "plate") {
      const up = v.toLocaleUpperCase("tr-TR");
      if (up !== v) { const p = e.target.selectionStart; e.target.value = up; e.target.setSelectionRange(p, p); v = up; }
    }
    this.data[key] = v;
    if (this.errors[key] && !this._validate()[key]) this._setErr(e.target, key, "");
  }

  _setErr(input, key, msg) {
    input.setAttribute("aria-invalid", String(!!msg));
    const box = this.root.querySelector(`#${input.id}-err`);
    if (box) box.textContent = msg;
    if (msg) this.errors[key] = msg; else delete this.errors[key];
  }

  _onBlur(e) {
    const key = e.target.dataset.field;
    if (!["name", "phone", "plate", "year"].includes(key) || !this.data[key]) return;
    if (key === "plate" && isValidPlate(this.data.plate)) { this.data.plate = formatPlate(this.data.plate); e.target.value = this.data.plate; }
    this._setErr(e.target, key, this._validate()[key] || "");
  }

  _onKey(e) {
    const day = e.target.closest && e.target.closest(".cal__day");
    if (day) {
      const map = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (!(e.key in map)) return;
      e.preventDefault();
      const all = Array.from(this.root.querySelectorAll(".cal__day"));
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
