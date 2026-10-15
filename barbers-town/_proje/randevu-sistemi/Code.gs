/**
 * Barber's Town — Online Randevu Sistemi (Google Apps Script)
 *
 * Ne yapar?
 *  - Sitedeki forma o gün ve hizmet için BOŞ saatleri verir (GET ?islem=musait).
 *  - Gelen randevuyu kilit altında tekrar kontrol eder; saat doluysa reddeder (çift rezervasyon olmaz).
 *  - Randevuyu salonun Google Takvimine etkinlik olarak yazar, Google E-Tablo'ya kaydeder,
 *    salona e-posta bildirimi gönderir.
 *
 * Salon nasıl yönetir?
 *  - Telefondaki Google Takvim uygulamasında "Barber's Town Randevular" takvimini görür.
 *  - İptal: etkinliği silmek yeterli → saat sitede yeniden boş görünür.
 *  - Telefonla gelen randevu: takvime elle etkinlik ekleyin → 1 koltuk dolu sayılır.
 *    Başlık [bakim] veya [vip] ile başlarsa o kaynağı doldurur.
 *  - Saat/gün kapatma (mola, izin): başlığında "KAPALI" geçen etkinlik ekleyin → o aralık herkese kapanır.
 *
 * Kurulum adımları: KURULUM.md
 */

var AYAR = {
  takvimAdi: "Barber's Town Randevular",
  tabloAdi: "Barber's Town Randevu Kayıtları",
  saatDilimiOfseti: '+03:00', // Türkiye (yaz/kış saati uygulaması yok)

  // Haftanın günleri: 0 = Pazar … 6 = Cumartesi. null = kapalı.
  // [VARSAYIM] Yalnız kapanış 21:00 doğrulandı; açılış ve tatil günü salonla teyit edilmeli.
  calisma: {
    0: ['10:00', '21:00'],
    1: ['09:00', '21:00'],
    2: ['09:00', '21:00'],
    3: ['09:00', '21:00'],
    4: ['09:00', '21:00'],
    5: ['09:00', '21:00'],
    6: ['09:00', '21:00']
  },
  kapaliTarihler: [],      // ör. ['2026-10-29'] — bayram, tatil
  adimDakika: 15,          // randevu başlangıçları kaçar dakika arayla sunulur
  enAzOnceDakika: 60,      // en erken kaç dakika sonrasına randevu alınabilir
  ileriGun: 21,            // kaç gün ileriye randevu verilir

  // Aynı anda kaç müşteri alınabilir [VARSAYIM — salon teyit etmeli]
  kaynaklar: { koltuk: 2, bakim: 1, vip: 1 },

  // Hizmet adları sitedeki formla birebir aynı olmalı. sure: dakika [VARSAYIM]
  hizmetler: {
    'Saç & Sakal Kesim':  { sure: 45, kaynak: 'koltuk' },
    'Anatomik Saç Kesim': { sure: 45, kaynak: 'koltuk' },
    'Özel Cilt Bakımı':   { sure: 45, kaynak: 'bakim' },
    'Lazer Epilasyon':    { sure: 60, kaynak: 'bakim' },
    'VİP Salon':          { sure: 60, kaynak: 'vip' }
  },

  gunlukTelefonSiniri: 3,  // aynı numaradan bir günde en fazla kaç randevu
  bildirimEposta: ''       // boşsa betiği kuran Google hesabına gider
};

/* ───────────── Saf hesaplama fonksiyonları (Node ile test edilebilir) ───────────── */

function dakikaya(saat) {
  var p = saat.split(':');
  return Number(p[0]) * 60 + Number(p[1]);
}

function saate(dk) {
  var s = Math.floor(dk / 60), d = dk % 60;
  return (s < 10 ? '0' : '') + s + ':' + (d < 10 ? '0' : '') + d;
}

/** "2026-10-16" → o günün haftalık indeksi (0 = Pazar), saat diliminden bağımsız. */
function haftaninGunu(tarih) {
  var p = tarih.split('-');
  return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay();
}

/** Dolu aralık listesinden, verilen kaynak için o anda kaç birim kullanıldığını sayar. */
function cakisanSayisi(mesguller, kaynak, bas, bit) {
  var n = 0;
  for (var i = 0; i < mesguller.length; i++) {
    var m = mesguller[i];
    if (m.bas < bit && bas < m.bit && (m.kaynak === kaynak || m.kaynak === 'KAPALI')) {
      if (m.kaynak === 'KAPALI') return Infinity;
      n++;
    }
  }
  return n;
}

/**
 * Boş başlangıç saatlerini döndürür.
 * mesguller: [{bas, bit, kaynak}] — gün başından itibaren dakika.
 * simdiDk: bugünse şu anki dakika, değilse -Infinity.
 */
function bosSaatler(ayar, tarih, hizmetAdi, mesguller, simdiDk) {
  var hizmet = ayar.hizmetler[hizmetAdi];
  if (!hizmet) return { hata: 'Geçersiz hizmet' };
  var aralik = ayar.calisma[haftaninGunu(tarih)];
  if (!aralik || ayar.kapaliTarihler.indexOf(tarih) !== -1) return { kapali: true, saatler: [] };

  var acilis = dakikaya(aralik[0]), kapanis = dakikaya(aralik[1]);
  var kapasite = ayar.kaynaklar[hizmet.kaynak] || 1;
  var enErken = simdiDk + ayar.enAzOnceDakika;
  var saatler = [];
  for (var t = acilis; t + hizmet.sure <= kapanis; t += ayar.adimDakika) {
    if (t < enErken) continue;
    if (cakisanSayisi(mesguller, hizmet.kaynak, t, t + hizmet.sure) < kapasite) saatler.push(saate(t));
  }
  return { kapali: false, saatler: saatler };
}

/** Etkinlik başlığı / etiketinden kaynak türünü çıkarır (salonun elle eklediği etkinlikler dahil). */
function kaynakBul(baslik, etiket) {
  if (etiket) return etiket;
  if (/KAPALI/i.test(baslik)) return 'KAPALI';
  var m = /^\s*\[(koltuk|bakim|vip)\]/i.exec(baslik);
  return m ? m[1].toLowerCase() : 'koltuk';
}

function telefonTemizle(tel) {
  var t = String(tel || '').replace(/[^\d]/g, '');
  if (t.indexOf('90') === 0 && t.length === 12) t = t.slice(2);
  if (t.indexOf('0') === 0 && t.length === 11) t = t.slice(1);
  return /^5\d{9}$/.test(t) ? '0' + t : null;
}

/** Gelen randevu verisini doğrular; hata mesajı ya da temizlenmiş veri döner. */
function dogrula(ayar, v, bugun) {
  if (v.tuzak) return { hata: 'spam' };
  var ad = String(v.ad || '').trim().slice(0, 60);
  if (ad.length < 2) return { hata: 'Lütfen adınızı yazın.' };
  var tel = telefonTemizle(v.telefon);
  if (!tel) return { hata: 'Lütfen geçerli bir cep telefonu numarası yazın (05xx xxx xx xx).' };
  if (!ayar.hizmetler[v.hizmet]) return { hata: 'Lütfen bir hizmet seçin.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tarih || '')) return { hata: 'Lütfen bir gün seçin.' };
  if (v.tarih < bugun) return { hata: 'Geçmiş bir gün seçilemez.' };
  var sinir = new Date(Date.parse(bugun + 'T00:00:00Z') + ayar.ileriGun * 864e5).toISOString().slice(0, 10);
  if (v.tarih > sinir) return { hata: 'En fazla ' + ayar.ileriGun + ' gün sonrasına randevu alınabilir.' };
  if (!/^\d{2}:\d{2}$/.test(v.saat || '')) return { hata: 'Lütfen bir saat seçin.' };
  return {
    veri: { ad: ad, telefon: tel, hizmet: v.hizmet, tarih: v.tarih, saat: v.saat, not: String(v.not || '').trim().slice(0, 300) }
  };
}

/** Takvim etkinliğini panelde gösterilecek alanlara ayırır (site randevusu ya da salonun elle eklediği). */
function etkinlikCoz(baslik, aciklama) {
  var a = String(aciklama || '');
  var al = function (etiket) { var m = new RegExp('^' + etiket + ':\\s*(.*)$', 'm').exec(a); return m ? m[1].trim() : ''; };
  var kod = al('Kod');
  var parca = String(baslik || '').split(' — ');
  if (kod && parca.length >= 2) {
    var not = al('Not');
    return { hizmet: parca[0], ad: parca.slice(1).join(' — '), telefon: al('Telefon'), not: not === '-' ? '' : not, kod: kod, elle: false };
  }
  return { hizmet: '', ad: String(baslik || ''), telefon: '', not: a.trim(), kod: '', elle: true };
}

/** Panel şifresini karşılaştırır (sabit süreli karşılaştırma). */
function pinDogru(girilen, kayitli) {
  girilen = String(girilen || ''); kayitli = String(kayitli || '');
  if (!kayitli || girilen.length !== kayitli.length) return false;
  var fark = 0;
  for (var i = 0; i < kayitli.length; i++) fark |= girilen.charCodeAt(i) ^ kayitli.charCodeAt(i);
  return fark === 0;
}

function randevuKodu() {
  var harfler = 'ABCDEFGHJKLMNPRSTUVYZ23456789', k = 'BT-';
  for (var i = 0; i < 5; i++) k += harfler.charAt(Math.floor(Math.random() * harfler.length));
  return k;
}

/* ───────────── Google servisleri ───────────── */

function ozellik(ad) { return PropertiesService.getScriptProperties().getProperty(ad); }

function takvim() {
  var id = ozellik('TAKVIM_ID');
  if (!id) throw new Error('Kurulum yapılmamış: önce kurulum() fonksiyonunu çalıştırın.');
  return CalendarApp.getCalendarById(id);
}

function gunBaslangici(tarih) { return new Date(tarih + 'T00:00:00' + AYAR.saatDilimiOfseti); }

function bugunTarih() {
  return Utilities.formatDate(new Date(), 'Europe/Istanbul', 'yyyy-MM-dd');
}

function mesgulAraliklar(tarih) {
  var bas = gunBaslangici(tarih);
  var bit = new Date(bas.getTime() + 864e5);
  return takvim().getEvents(bas, bit).map(function (e) {
    return {
      bas: Math.round((e.getStartTime() - bas) / 6e4),
      bit: Math.round((e.getEndTime() - bas) / 6e4),
      kaynak: kaynakBul(e.getTitle(), e.getTag('kaynak'))
    };
  });
}

function simdiDakika(tarih) {
  if (tarih !== bugunTarih()) return -Infinity;
  return Math.floor((Date.now() - gunBaslangici(tarih).getTime()) / 6e4);
}

function json(nesne) {
  return ContentService.createTextOutput(JSON.stringify(nesne)).setMimeType(ContentService.MimeType.JSON);
}

/** GET ?islem=musait&tarih=2026-10-16&hizmet=Saç%20%26%20Sakal%20Kesim */
function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.islem === 'musait') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.tarih || '')) return json({ ok: false, hata: 'Geçersiz tarih' });
      var s = bosSaatler(AYAR, p.tarih, p.hizmet, mesgulAraliklar(p.tarih), simdiDakika(p.tarih));
      if (s.hata) return json({ ok: false, hata: s.hata });
      return json({ ok: true, tarih: p.tarih, kapali: s.kapali, saatler: s.saatler });
    }
    return json({ ok: true, servis: "Barber's Town randevu" });
  } catch (hata) {
    return json({ ok: false, hata: 'Sunucu hatası' });
  }
}

/** POST (Content-Type: text/plain) gövde: {ad, telefon, hizmet, tarih, saat, not, tuzak} */
function doPost(e) {
  var v;
  try { v = JSON.parse(e.postData.contents); } catch (x) { return json({ ok: false, hata: 'Geçersiz istek' }); }
  if (v.islem === 'panel') return panel(v);

  var d = dogrula(AYAR, v, bugunTarih());
  if (d.hata === 'spam') return json({ ok: true, kod: randevuKodu() }); // botlara sessizce başarı göster
  if (d.hata) return json({ ok: false, hata: d.hata });
  var r = d.veri;

  var onbellek = CacheService.getScriptCache();
  var sayacAnahtari = 'tel_' + r.telefon + '_' + bugunTarih();
  var sayac = Number(onbellek.get(sayacAnahtari) || 0);
  if (sayac >= AYAR.gunlukTelefonSiniri) {
    return json({ ok: false, hata: 'Bu numarayla bugün çok sayıda randevu talebi alındı. Lütfen bizi arayın.' });
  }

  var kilit = LockService.getScriptLock();
  if (!kilit.tryLock(15000)) return json({ ok: false, hata: 'Yoğunluk var, lütfen tekrar deneyin.' });
  try {
    // Kilit altında son kontrol: saat hâlâ boş mu?
    var bos = bosSaatler(AYAR, r.tarih, r.hizmet, mesgulAraliklar(r.tarih), simdiDakika(r.tarih));
    if (bos.saatler.indexOf(r.saat) === -1) {
      return json({ ok: false, dolu: true, hata: 'Bu saat az önce doldu. Lütfen başka bir saat seçin.' });
    }
    var hizmet = AYAR.hizmetler[r.hizmet];
    var bas = new Date(r.tarih + 'T' + r.saat + ':00' + AYAR.saatDilimiOfseti);
    var bit = new Date(bas.getTime() + hizmet.sure * 6e4);
    var kod = randevuKodu();

    var etkinlik = takvim().createEvent(
      r.hizmet + ' — ' + r.ad,
      bas, bit,
      { description: 'Kod: ' + kod + '\nTelefon: ' + r.telefon + '\nNot: ' + (r.not || '-') + '\nKaynak: site formu' }
    );
    etkinlik.setTag('kaynak', hizmet.kaynak);
    etkinlik.setTag('kod', kod);

    SpreadsheetApp.openById(ozellik('TABLO_ID')).getSheets()[0].appendRow([
      new Date(), kod, r.tarih, r.saat, r.hizmet, r.ad, "'" + r.telefon, r.not, 'Alındı'
    ]);
    onbellek.put(sayacAnahtari, String(sayac + 1), 21600);
  } finally {
    kilit.releaseLock();
  }

  try {
    MailApp.sendEmail(AYAR.bildirimEposta || Session.getEffectiveUser().getEmail(),
      'Yeni randevu: ' + r.tarih + ' ' + r.saat + ' — ' + r.hizmet,
      r.ad + ' (' + r.telefon + ')\n' + r.hizmet + '\n' + r.tarih + ' ' + r.saat + '\nNot: ' + (r.not || '-') +
      '\nKod: ' + kod + '\n\nİptal için etkinliği Google Takvim\'den silin.\nMüşteriye yaz: https://wa.me/90' + r.telefon.slice(1));
  } catch (x) { /* e-posta kotası dolsa da randevu kaydı geçerli */ }

  return json({ ok: true, kod: kod, tarih: r.tarih, saat: r.saat, hizmet: r.hizmet, sure: AYAR.hizmetler[r.hizmet].sure });
}

/**
 * Salon paneli (POST gövdesi {islem:'panel', pin, eylem, ...}).
 *  eylem 'liste' {tarih}  → o günün randevuları
 *  eylem 'iptal' {id}     → randevuyu takvimden siler, kayıt tablosunda durumu "İptal" yapar
 * Şifre (PANEL_PIN) kurulum() ile oluşturulur; 10 dakikada 5 yanlış denemeden sonra kilitlenir.
 */
function panel(v) {
  var onbellek = CacheService.getScriptCache();
  var yanlis = Number(onbellek.get('pin_yanlis') || 0);
  if (yanlis >= 5) return json({ ok: false, hata: 'Çok fazla yanlış deneme. 10 dakika sonra tekrar deneyin.' });
  if (!pinDogru(v.pin, ozellik('PANEL_PIN'))) {
    onbellek.put('pin_yanlis', String(yanlis + 1), 600);
    return json({ ok: false, pin: false, hata: 'Şifre yanlış.' });
  }

  if (v.eylem === 'liste') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tarih || '')) return json({ ok: false, hata: 'Geçersiz tarih' });
    var bas = gunBaslangici(v.tarih), bit = new Date(bas.getTime() + 864e5);
    var saat = function (d) { return Utilities.formatDate(d, 'Europe/Istanbul', 'HH:mm'); };
    var liste = takvim().getEvents(bas, bit).map(function (e) {
      var c = etkinlikCoz(e.getTitle(), e.getDescription());
      c.id = e.getId();
      c.tumGun = e.isAllDayEvent();
      c.bas = c.tumGun ? '' : saat(e.getStartTime());
      c.bit = c.tumGun ? '' : saat(e.getEndTime());
      c.kapali = /KAPALI/i.test(e.getTitle());
      return c;
    });
    return json({ ok: true, tarih: v.tarih, randevular: liste });
  }

  if (v.eylem === 'iptal') {
    var e = takvim().getEventById(String(v.id || ''));
    if (!e) return json({ ok: false, hata: 'Randevu bulunamadı; zaten silinmiş olabilir.' });
    var kod = etkinlikCoz(e.getTitle(), e.getDescription()).kod;
    e.deleteEvent();
    if (kod) {
      var sayfa = SpreadsheetApp.openById(ozellik('TABLO_ID')).getSheets()[0];
      var kodlar = sayfa.getRange(1, 2, sayfa.getLastRow(), 1).getValues();
      for (var i = kodlar.length - 1; i >= 0; i--) {
        if (kodlar[i][0] === kod) { sayfa.getRange(i + 1, 9).setValue('İptal (panel)'); break; }
      }
    }
    return json({ ok: true });
  }
  return json({ ok: false, hata: 'Geçersiz işlem' });
}

/** Bir kez elle çalıştırın: takvimi ve kayıt tablosunu oluşturur. */
function kurulum() {
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('TAKVIM_ID')) {
    var t = CalendarApp.createCalendar(AYAR.takvimAdi, { timeZone: 'Europe/Istanbul', color: CalendarApp.Color.YELLOW });
    p.setProperty('TAKVIM_ID', t.getId());
  }
  if (!p.getProperty('TABLO_ID')) {
    var ss = SpreadsheetApp.create(AYAR.tabloAdi);
    ss.getSheets()[0].appendRow(['Kayıt zamanı', 'Kod', 'Tarih', 'Saat', 'Hizmet', 'Ad', 'Telefon', 'Not', 'Durum']);
    ss.getSheets()[0].setFrozenRows(1);
    p.setProperty('TABLO_ID', ss.getId());
  }
  if (!p.getProperty('PANEL_PIN')) {
    p.setProperty('PANEL_PIN', String(Math.floor(100000 + Math.random() * 900000)));
  }
  Logger.log('Takvim: ' + p.getProperty('TAKVIM_ID'));
  Logger.log('Salon paneli şifresi: ' + p.getProperty('PANEL_PIN'));
  Logger.log('Tablo: https://docs.google.com/spreadsheets/d/' + p.getProperty('TABLO_ID'));
}

/* Node testleri için dışa aktarım (Apps Script'te etkisizdir) */
if (typeof module !== 'undefined') {
  module.exports = { AYAR: AYAR, bosSaatler: bosSaatler, dogrula: dogrula, telefonTemizle: telefonTemizle,
    kaynakBul: kaynakBul, haftaninGunu: haftaninGunu, cakisanSayisi: cakisanSayisi,
    etkinlikCoz: etkinlikCoz, pinDogru: pinDogru };
}
