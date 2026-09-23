// WhatsApp mesaj şablonları ve bağlantı üretimi.
import { CONFIG } from "./config.js";
import { serviceById } from "./booking/catalog.js";
import { formatDateTR, formatPlate } from "./booking/appointment.js";

export const GENERAL_MESSAGE = "Merhaba BYM Oto Tamir, aracım için servis/randevu hakkında bilgi almak istiyorum.";

export function waLink(message = GENERAL_MESSAGE) {
  return `https://wa.me/${CONFIG.firma.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function appointmentMessage(a) {
  const service = serviceById(a.service)?.name || a.service;
  const lines = [
    "Merhaba BYM Oto Tamir,",
    "randevu talebi oluşturmak istiyorum.",
    "",
    `Araç: ${a.brand} ${a.model}`.trim(),
    `Hizmet: ${service}`,
    `Tarih: ${formatDateTR(a.date, { day: "numeric", month: "long", year: "numeric", weekday: "long" })}`,
    `Saat: ${a.time}`,
  ];
  if (a.name) lines.push("", `Ad Soyad: ${a.name}`);
  if (a.plate) lines.push(`Plaka: ${formatPlate(a.plate)}`);
  if (a.note) lines.push(`Açıklama: ${a.note}`);
  if (a.id) lines.push("", `Referans: ${a.id}`);
  return lines.join("\n");
}
