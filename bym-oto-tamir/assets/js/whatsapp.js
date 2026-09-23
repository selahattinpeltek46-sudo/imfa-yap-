// WhatsApp mesaj şablonları ve bağlantı üretimi.
import { CONFIG } from "./config.js";

export const GENERAL_MESSAGE = "Merhaba BYM Automotive, aracım için servis/randevu hakkında bilgi almak istiyorum.";

// wa.me: mobilde WhatsApp uygulamasını, masaüstünde WhatsApp Web'i açar.
// encodeURIComponent Türkçe karakterleri UTF-8 olarak doğru kodlar.
export function waLink(message = GENERAL_MESSAGE) {
  return `https://wa.me/${CONFIG.firma.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * @param {{service:string, vehicle:string, year:string, plate:string, problem:string,
 *          date:string, time:string, name:string, phone:string}} r  Özet için hazırlanmış metinler
 */
export function appointmentMessage(r) {
  const lines = ["Merhaba BYM Automotive,", "Randevu talebinde bulunmak istiyorum.", ""];
  const add = (label, value) => { if (value) lines.push(`${label}: ${value}`); };
  add("Hizmet", r.service);
  add("Araç", r.vehicle);
  add("Model Yılı", r.year);
  add("Plaka", r.plate);
  add("Sorun", r.problem);
  add("Tarih", r.date);
  add("Saat", r.time);
  add("Ad Soyad", r.name);
  add("Telefon", r.phone);
  lines.push("", "Randevu uygunluğunun teyit edilmesini rica ederim.");
  return lines.join("\n");
}
