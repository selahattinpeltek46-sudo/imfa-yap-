/* Barber's Town — sitenin değiştirilebilir ayarları.
   Randevu sistemi kurulumu: barbers-town/_proje/randevu-sistemi/KURULUM.md */
window.BT_AYARLAR = {
  whatsapp: '905357294333',

  // Google Apps Script web uygulamasının adresi (https://script.google.com/macros/s/…/exec).
  // Boşken form, talebi WhatsApp mesajı olarak hazırlar (sistem kurulana kadar yedek mod).
  randevuApi: '',

  // Deneme (demo) sistemi: yalnız adresin sonuna ?demo=1 eklenince kullanılır; müşteriler etkilenmez.
  demoApi: 'https://script.google.com/macros/s/AKfycbyy35dHjZ0PUWOcNhMozWZujN3dgnbhRPRA9Hjh_vMBnxU8JvUwoJMms0c3v2CRMFqL/exec',

  // Kaç gün ileriye randevu verilir (sunucudaki AYAR.ileriGun ile aynı olmalı)
  ileriGun: 21
};
// Hizmet listesi, süreleri, çalışma saatleri ve kapasite sunucuda (_proje/randevu-sistemi/Code.gs → AYAR) tutulur.
// Site, hizmet adlarını formdaki <select> listesinden gönderir; adlar Code.gs ile birebir aynı olmalı.
