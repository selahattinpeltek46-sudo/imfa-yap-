// Randevu veri modeli, doğrulama ve yardımcılar.
// Bu yapı backend ile birebir paylaşılır (bkz. README → API sözleşmesi).

export const STATUS = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const STATUS_LABEL = {
  pending: "Beklemede",
  confirmed: "Onaylandı",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} name
 * @property {string} phone   E.164 (+905xxxxxxxxx)
 * @property {string} plate   Boşluksuz, büyük harf (46ABC123)
 * @property {string} brand
 * @property {string} model
 * @property {string} service Hizmet kimliği (catalog.SERVICES[].id)
 * @property {string} date    YYYY-MM-DD
 * @property {string} time    HH:MM
 * @property {string} note
 * @property {"pending"|"confirmed"|"completed"|"cancelled"} status
 * @property {string} createdAt ISO
 */

export function createAppointment(data) {
  return {
    id: data.id || makeRef(),
    name: data.name.trim(),
    phone: normalizePhone(data.phone),
    plate: normalizePlate(data.plate),
    brand: data.brand,
    model: data.model,
    service: data.service,
    date: data.date,
    time: data.time,
    note: (data.note || "").trim(),
    status: data.status || STATUS.PENDING,
    createdAt: data.createdAt || new Date().toISOString(),
  };
}

export function makeRef() {
  const alphabet = "ABCDEFGHJKLMNPRSTUVYZ23456789";
  let s = "";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  for (const b of bytes) s += alphabet[b % alphabet.length];
  return `BYM-${s}`;
}

// --- Telefon ---------------------------------------------------------------
export function normalizePhone(v) {
  let d = String(v || "").replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.length === 10 ? `+90${d}` : String(v || "").trim();
}

export function isValidPhone(v) {
  let d = String(v || "").replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return /^5\d{9}$/.test(d) || /^[2-4]\d{9}$/.test(d);
}

export function formatPhoneInput(v) {
  let d = String(v || "").replace(/\D/g, "");
  if (d.startsWith("90")) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  d = d.slice(0, 10);
  const p = [d.slice(0, 3), d.slice(3, 6), d.slice(6, 8), d.slice(8, 10)].filter(Boolean);
  if (!p.length) return "";
  return `0 (${p[0]}${p[0].length === 3 ? ")" : ""}${p[1] ? " " + p[1] : ""}${p[2] ? " " + p[2] : ""}${p[3] ? " " + p[3] : ""}`;
}

// --- Plaka -----------------------------------------------------------------
// Türkiye plaka formatı: 01–81 il kodu + 1–3 harf + 2–4 rakam
export function normalizePlate(v) {
  return String(v || "")
    .toLocaleUpperCase("tr-TR")
    .replace(/İ/g, "I")
    .replace(/[^A-Z0-9]/g, "");
}

export function isValidPlate(v) {
  const p = normalizePlate(v);
  const m = p.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);
  if (!m) return false;
  const il = Number(m[1]);
  return il >= 1 && il <= 81;
}

export function formatPlate(v) {
  const p = normalizePlate(v);
  const m = p.match(/^(\d{2})([A-Z]{1,3})(\d{2,4})$/);
  return m ? `${m[1]} ${m[2]} ${m[3]}` : p;
}

// --- Tarih -----------------------------------------------------------------
export const pad = (n) => String(n).padStart(2, "0");
export const toISODate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISODate = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const formatDateTR = (iso, opts = { weekday: "long", day: "numeric", month: "long" }) =>
  fromISODate(iso).toLocaleDateString("tr-TR", opts);
