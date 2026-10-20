/* Barber Uğur — sitenin değiştirilebilir ayarları.
   Randevu sistemi kurulumu: barber-ugur/_proje/randevu-sistemi/KURULUM.md */
window.BU_AYARLAR = {
  whatsapp: '905428253389',

  // Google Apps Script web uygulamasının adresi (https://script.google.com/macros/s/…/exec).
  // Boşken form, talebi WhatsApp mesajı olarak hazırlar (sistem kurulana kadar yedek mod).
  randevuApi: '',

  // Deneme (demo) sistemi: yalnız adresin sonuna ?demo=1 eklenince kullanılır; müşteriler etkilenmez.
  // Kendi Google hesabınızda kurduğunuz "Barber Uğur DEMO" projesinin web uygulaması adresi.
  demoApi: '',

  // Kaç gün ileriye randevu verilir (sunucudaki AYAR.ileriGun ile aynı olmalı)
  ileriGun: 21,

  // "Telefonuma ekle" takvim dosyasındaki alarm: randevudan kaç dakika önce (Code.gs → AYAR.hatirlatmaDakika ile aynı)
  hatirlatmaDakika: 120
};
// Hizmet listesi, süreleri, çalışma saatleri ve kapasite sunucuda (_proje/randevu-sistemi/Code.gs → AYAR) tutulur.
// Site, hizmet adlarını formdaki <select> listesinden gönderir; adlar Code.gs ile birebir aynı olmalı.

// Demo modu: ?demo=1 ile açılınca bu sekme kapanana kadar demo kalır (logo, menü vb. tıklansa da).
// Çıkmak için adresin sonuna ?demo=0 ekleyin.
(function () {
  var q = location.search, acik = /[?&]demo=1(&|$)/.test(q);
  try {
    if (acik) sessionStorage.setItem('bu_demo', '1');
    else if (/[?&]demo=0(&|$)/.test(q)) sessionStorage.removeItem('bu_demo');
    acik = sessionStorage.getItem('bu_demo') === '1';
  } catch (e) { /* tarayıcı depolamayı engelliyorsa yalnız adrese bakılır */ }
  window.BU_DEMO = acik;
})();
