/**
 * Beyoğlu Erkek Kuaförü — Online Randevu Sistemi (Google Apps Script)
 *
 * Ne yapar?
 *  - Sitedeki forma o gün ve hizmet için BOŞ saatleri verir (GET ?islem=musait).
 *  - Gelen randevuyu kilit altında tekrar kontrol eder; saat doluysa reddeder (çift rezervasyon olmaz).
 *  - Randevuyu salonun Google Takvimine etkinlik olarak yazar, Google E-Tablo'ya kaydeder,
 *    salona e-posta bildirimi gönderir.
 *  - Randevudan 2 saat önce dükkâna "hatırlatma gönder" bildirimi verir (takvim bildirimi + e-posta);
 *    bildirimdeki bağlantıya dokununca müşteriye hazır WhatsApp hatırlatma mesajı açılır.
 *
 * Salon nasıl yönetir?
 *  - Telefondaki Google Takvim uygulamasında "Beyoğlu Erkek Kuaförü Randevular" takvimini görür.
 *  - İptal: etkinliği silmek yeterli → saat sitede yeniden boş görünür.
 *  - Telefonla gelen randevu: takvime elle etkinlik ekleyin → 1 koltuk dolu sayılır.
 *    Açıklamaya müşterinin cep numarasını yazarsanız (ör. "0532 111 22 33") hatırlatma onun için de gelir.
 *  - Saat/gün kapatma (mola, izin): başlığında "KAPALI" geçen etkinlik ekleyin → o aralık herkese kapanır.
 *
 * Kurulum adımları: KURULUM.md
 */

var AYAR = {
  takvimAdi: 'Beyoğlu Erkek Kuaförü Randevular',
  tabloAdi: 'Beyoğlu Erkek Kuaförü Randevu Kayıtları',
  saatDilimiOfseti: '+03:00', // Türkiye (yaz/kış saati uygulaması yok)

  // Haftanın günleri: 0 = Pazar … 6 = Cumartesi. null = kapalı.
  // [VARSAYIM] Google Haritalar kaydı "24 saat açık" diyor (büyük ihtimalle hatalı girilmiş).
  // Gerçek saatler salonla teyit edilip buraya yazılmalı.
  calisma: {
    0: ['10:00', '21:00'],
    1: ['10:00', '21:00'],
    2: ['10:00', '21:00'],
    3: ['10:00', '21:00'],
    4: ['10:00', '21:00'],
    5: ['10:00', '21:00'],
    6: ['10:00', '21:00']
  },
  kapaliTarihler: [],      // ör. ['2026-10-29'] — bayram, tatil
  adimDakika: 15,          // randevu başlangıçları kaçar dakika arayla sunulur
  enAzOnceDakika: 60,      // en erken kaç dakika sonrasına randevu alınabilir
  ileriGun: 21,            // kaç gün ileriye randevu verilir

  // Aynı anda kaç müşteri alınabilir [VARSAYIM — fotoğraflarda en az 2–3 berber görülüyor; online randevuya 2 koltuk ayrıldı,
  // diğerleri randevusuz gelenlere kalır. Salon teyit etmeli]
  kaynaklar: { koltuk: 2 },

  // Hizmet adları sitedeki formla birebir aynı olmalı. sure: dakika [VARSAYIM]
  // Cilt bakımı ve saç boyama online randevuya açılmadı (süre/içerik bilinmiyor; sitede "Sorun" → WhatsApp).
  hizmetler: {
    'Saç Kesimi':   { sure: 30, kaynak: 'koltuk' },
    'Sakal Tıraşı': { sure: 30, kaynak: 'koltuk' },
    'Saç & Sakal':  { sure: 50, kaynak: 'koltuk' },
    'Çocuk Kesimi': { sure: 25, kaynak: 'koltuk' }
  },

  gunlukTelefonSiniri: 3,  // aynı numaradan bir günde en fazla kaç randevu
  bildirimEposta: '',      // boşsa betiği kuran Google hesabına gider

  // Hatırlatma: randevudan kaç dakika önce dükkâna "hatırlatma gönder" bildirimi gelsin.
  // Sitedeki js/ayarlar.js → hatirlatmaDakika ile aynı olmalı (müşterinin takvim alarmı).
  hatirlatmaDakika: 120,
  hatirlatmaEposta: true,  // false: yalnız takvim bildirimi (e-posta gönderilmez)
  dukkanAdi: 'Beyoğlu Erkek Kuaförü',
  dukkanAdres: 'Balık Sk. No:4, Kamer Hatun, Beyoğlu'
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
  var m = /^\s*\[(koltuk)\]/i.exec(baslik);
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

function randevuKodu() {
  var harfler = 'ABCDEFGHJKLMNPRSTUVYZ23456789', k = 'BEK-';
  for (var i = 0; i < 5; i++) k += harfler.charAt(Math.floor(Math.random() * harfler.length));
  return k;
}

/* ───────────── Hatırlatma (saf fonksiyonlar) ───────────── */

/** Müşteriye gidecek hatırlatma metni. r: {ad, saat, hizmet, kod} */
function hatirlatmaMetni(ayar, r) {
  var ad = String(r.ad || '').trim().split(/\s+/)[0];
  var satirlar = [
    'Merhaba' + (ad ? ' ' + ad : '') + ',',
    'Bugün saat ' + r.saat + (r.hizmet ? ' ' + r.hizmet : '') + ' randevunuzu hatırlatırız.',
    'Gelemeyecekseniz lütfen bu mesaja yazın; saatinizi başkasına açalım.'
  ];
  if (r.kod) satirlar.push('Randevu kodu: ' + r.kod);
  satirlar.push(ayar.dukkanAdi + ' · ' + ayar.dukkanAdres);
  return satirlar.join('\n');
}

/** Dükkânın dokunacağı WhatsApp bağlantısı (müşteriye hazır mesaj). tel: 05xxxxxxxxx */
function hatirlatmaLinki(ayar, r) {
  return 'https://wa.me/90' + r.telefon.slice(1) + '?text=' + encodeURIComponent(hatirlatmaMetni(ayar, r));
}

/** Etkinlik açıklamasından telefonu bulur (site kaydı: "Telefon: 05…"; elle eklenen: herhangi bir cep numarası). */
function aciklamadanTelefon(aciklama) {
  var m = String(aciklama || '').match(/(?:\+?90[\s-]?)?0?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
  return m ? telefonTemizle(m[0]) : null;
}

/**
 * Şimdi hatırlatılması gereken etkinlikleri seçer.
 * etkinlikler: [{id, baslik, aciklama, bas (ms), olusturma (ms), hatirlatildi (bool), telefon?, ad?, hizmet?, kod?}]
 * Kurallar: başlamamış · hatırlatma penceresine girmiş · daha önce hatırlatılmamış · KAPALI değil ·
 * telefonu belli · hatırlatma süresinden kısa süre önce alınmamış (az önce randevu alana mesaj gitmez).
 */
function hatirlatilacaklar(ayar, etkinlikler, simdi) {
  var pencere = ayar.hatirlatmaDakika * 6e4;
  return etkinlikler.filter(function (e) {
    if (e.hatirlatildi || /KAPALI/i.test(e.baslik)) return false;
    if (e.bas <= simdi || e.bas - simdi > pencere) return false;
    if (e.olusturma && e.bas - e.olusturma < pencere) return false;
    return !!(e.telefon || aciklamadanTelefon(e.aciklama));
  }).map(function (e) {
    var tel = e.telefon || aciklamadanTelefon(e.aciklama);
    var ad = e.ad || String(e.baslik || '').split(' — ').pop();
    return { id: e.id, bas: e.bas, telefon: tel, ad: ad, hizmet: e.hizmet || '', kod: e.kod || '' };
  });
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

/** GET ?islem=musait&tarih=2026-10-16&hizmet=Sa%C3%A7%20Kesimi */
function doGet(e) {
  var p = (e && e.parameter) || {};
  try {
    if (p.islem === 'musait') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.tarih || '')) return json({ ok: false, hata: 'Geçersiz tarih' });
      var s = bosSaatler(AYAR, p.tarih, p.hizmet, mesgulAraliklar(p.tarih), simdiDakika(p.tarih));
      if (s.hata) return json({ ok: false, hata: s.hata });
      return json({ ok: true, tarih: p.tarih, kapali: s.kapali, saatler: s.saatler });
    }
    return json({ ok: true, servis: 'Beyoğlu Erkek Kuaförü randevu' });
  } catch (hata) {
    return json({ ok: false, hata: 'Sunucu hatası' });
  }
}

/** POST (Content-Type: text/plain) gövde: {ad, telefon, hizmet, tarih, saat, not, tuzak} */
function doPost(e) {
  var v;
  try { v = JSON.parse(e.postData.contents); } catch (x) { return json({ ok: false, hata: 'Geçersiz istek' }); }

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
    etkinlik.setTag('ad', r.ad);
    etkinlik.setTag('telefon', r.telefon);
    etkinlik.setTag('hizmet', r.hizmet);
    // Dükkânın telefonundaki Google Takvim, randevudan 2 saat önce bildirim verir; açıklamadaki
    // bağlantıya dokununca müşteriye hazır WhatsApp hatırlatması açılır.
    etkinlik.removeAllReminders();
    etkinlik.addPopupReminder(AYAR.hatirlatmaDakika);
    etkinlik.setDescription(etkinlik.getDescription() + '\n\nHatırlatma gönder (WhatsApp):\n' +
      hatirlatmaLinki(AYAR, { ad: r.ad, telefon: r.telefon, saat: r.saat, hizmet: r.hizmet, kod: kod }));

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
 * Zaman tetikleyicisi (15 dakikada bir, kurulum() oluşturur): hatırlatma vakti gelen randevular için
 * dükkâna tek e-postada "WhatsApp'tan hatırlat" bağlantıları gönderir ve etkinliği işaretler.
 * Elle eklenen (telefonla alınan) randevular da açıklamada cep numarası varsa dahildir.
 */
function hatirlatmaKontrol() {
  var simdi = Date.now();
  var liste = takvim().getEvents(new Date(simdi), new Date(simdi + AYAR.hatirlatmaDakika * 6e4));
  var etkinlikler = liste.map(function (e) {
    return {
      id: e.getId(), ham: e, baslik: e.getTitle(), aciklama: e.getDescription(),
      bas: e.getStartTime().getTime(), olusturma: e.getDateCreated().getTime(),
      hatirlatildi: e.getTag('hatirlatma') === 'bildirildi',
      telefon: e.getTag('telefon'), ad: e.getTag('ad'), hizmet: e.getTag('hizmet'), kod: e.getTag('kod')
    };
  });
  var secilen = hatirlatilacaklar(AYAR, etkinlikler, simdi);
  if (!secilen.length) return;

  var satirlar = secilen.map(function (r) {
    r.saat = Utilities.formatDate(new Date(r.bas), 'Europe/Istanbul', 'HH:mm');
    return r.saat + ' · ' + r.ad + (r.hizmet ? ' · ' + r.hizmet : '') + '\nHatırlat: ' + hatirlatmaLinki(AYAR, r);
  });
  if (AYAR.hatirlatmaEposta) {
    try {
      MailApp.sendEmail(AYAR.bildirimEposta || Session.getEffectiveUser().getEmail(),
        'Hatırlatma gönder: ' + secilen.map(function (r) { return r.saat + ' ' + r.ad; }).join(', '),
        'Yaklaşan randevular. Bağlantıya dokunun, WhatsApp\'ta hazır mesaj açılır, Gönder\'e basın.\n\n' +
        satirlar.join('\n\n'));
    } catch (x) { return; } // kota dolduysa işaretleme yapma, sonraki turda tekrar dene
  }
  etkinlikler.forEach(function (e) {
    if (secilen.some(function (r) { return r.id === e.id; })) e.ham.setTag('hatirlatma', 'bildirildi');
  });
}

/** Bir kez elle çalıştırın: takvimi, kayıt tablosunu ve hatırlatma tetikleyicisini oluşturur. */
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
  var tetikVar = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === 'hatirlatmaKontrol'; });
  if (!tetikVar) ScriptApp.newTrigger('hatirlatmaKontrol').timeBased().everyMinutes(15).create();
  Logger.log('Takvim: ' + p.getProperty('TAKVIM_ID'));
  Logger.log('Tablo: https://docs.google.com/spreadsheets/d/' + p.getProperty('TABLO_ID'));
}

/* Node testleri için dışa aktarım (Apps Script'te etkisizdir) */
if (typeof module !== 'undefined') {
  module.exports = { AYAR: AYAR, bosSaatler: bosSaatler, dogrula: dogrula, telefonTemizle: telefonTemizle,
    kaynakBul: kaynakBul, haftaninGunu: haftaninGunu, cakisanSayisi: cakisanSayisi,
    hatirlatmaMetni: hatirlatmaMetni, hatirlatmaLinki: hatirlatmaLinki, aciklamadanTelefon: aciklamadanTelefon,
    hatirlatilacaklar: hatirlatilacaklar, hatirlatmaKontrol: hatirlatmaKontrol };
}
