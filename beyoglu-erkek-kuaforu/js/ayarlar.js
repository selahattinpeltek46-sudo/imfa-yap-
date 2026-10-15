/* Beyoğlu Erkek Kuaförü — sitenin değiştirilebilir ayarları.
   Randevu sistemi kurulumu: beyoglu-erkek-kuaforu/_proje/randevu-sistemi/KURULUM.md */
window.BEK_AYARLAR = {
  whatsapp: '905355089722',

  // Google Apps Script web uygulamasının adresi (https://script.google.com/macros/s/…/exec).
  // Boşken form, talebi WhatsApp mesajı olarak hazırlar (sistem kurulana kadar yedek mod).
  randevuApi: '',

  // Kaç gün ileriye randevu verilir (sunucudaki AYAR.ileriGun ile aynı olmalı)
  ileriGun: 21,

  // "Telefonuma ekle" takvim dosyasındaki alarm: randevudan kaç dakika önce (Code.gs → AYAR.hatirlatmaDakika ile aynı)
  hatirlatmaDakika: 120
};
// Hizmet listesi, süreleri, çalışma saatleri ve kapasite sunucuda (_proje/randevu-sistemi/Code.gs → AYAR) tutulur.
// Site, hizmet adlarını formdaki <select> listesinden gönderir; adlar Code.gs ile birebir aynı olmalı.
