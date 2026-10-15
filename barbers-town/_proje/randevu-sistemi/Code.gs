/**
 * Barber's Town — Online Randevu Sistemi (Google Apps Script)
 *
 * Ne yapar?
 *  - Sitedeki forma o gün ve hizmet için BOŞ saatleri verir (GET ?islem=musait).
 *  - Gelen randevuyu kilit altında tekrar kontrol eder; saat doluysa reddeder (çift rezervasyon olmaz).
 *  - Randevuyu salonun Google Takvimine etkinlik olarak yazar, Google E-Tablo'ya kaydeder,
 *    salona e-posta bildirimi gönderir.
 *  - Paketler: art arda iki adımlı hizmet (ör. kesim koltukta, ardından cilt bakımı bakım odasında);
 *    her adım kendi kaynağında boşsa saat sunulur.
 *  - Gecikme bildirimi: salon panelinde (GET ?islem=panel&anahtar=…) günün kalan randevuları listelenir;
 *    "15 dk" / "30 dk" düğmesi müşteriye "sıra kaydı, şu saatte gelin" hazır WhatsApp mesajını açar.
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
    'VİP Salon':          { sure: 60, kaynak: 'vip' },
    // Paketler: sitede zaten sunulan hizmetlerin art arda tek randevuda alınması (indirim iddiası yok).
    // adimlar sırayla uygulanır; sure = adımların toplamı.
    'Saç & Sakal Kesim + Cilt Bakımı': { sure: 90, adimlar: [{ kaynak: 'koltuk', sure: 45 }, { kaynak: 'bakim', sure: 45 }] },
    'Anatomik Kesim + Cilt Bakımı':    { sure: 90, adimlar: [{ kaynak: 'koltuk', sure: 45 }, { kaynak: 'bakim', sure: 45 }] }
  },

  gunlukTelefonSiniri: 3,  // aynı numaradan bir günde en fazla kaç randevu
  bildirimEposta: '',      // boşsa betiği kuran Google hesabına gider

  // Panelde ve takvim etkinliğinde sunulan gecikme düğmeleri (dakika)
  gecikmeSecenekleri: [15, 30],
  dukkanAdi: "Barber's Town",
  dukkanAdres: '7 Tepe Mah. 85043 Nolu Cad. No:75/A, Şahinbey'
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
  var adim = hizmetAdimlari(hizmet);
  var enErken = simdiDk + ayar.enAzOnceDakika;
  var saatler = [];
  for (var t = acilis; t + hizmet.sure <= kapanis; t += ayar.adimDakika) {
    if (t < enErken) continue;
    var uygun = true, a = t;
    for (var i = 0; i < adim.length && uygun; i++) {
      uygun = cakisanSayisi(mesguller, adim[i].kaynak, a, a + adim[i].sure) < (ayar.kaynaklar[adim[i].kaynak] || 1);
      a += adim[i].sure;
    }
    if (uygun) saatler.push(saate(t));
  }
  return { kapali: false, saatler: saatler };
}

/** Hizmetin sıralı adımları: paketlerde adimlar, tek hizmette tek adım. */
function hizmetAdimlari(hizmet) {
  return hizmet.adimlar || [{ kaynak: hizmet.kaynak, sure: hizmet.sure }];
}

/**
 * Bir takvim etkinliğinin dolu aralıkları (gün başından dakika). Paket etkinliğinde "adimlar" etiketi
 * her adımı kendi kaynağına yazar; diğerlerinde tüm etkinlik tek kaynaktır.
 */
function etkinlikAraliklari(bas, bit, baslik, kaynakEtiketi, adimEtiketi) {
  if (adimEtiketi && !/KAPALI/i.test(baslik)) {
    try {
      var t = bas;
      return JSON.parse(adimEtiketi).map(function (a) {
        var r = { bas: t, bit: t + a.sure, kaynak: a.kaynak };
        t += a.sure;
        return r;
      });
    } catch (x) { /* bozuk etiket: aşağıda tek kaynak say */ }
  }
  return [{ bas: bas, bit: bit, kaynak: kaynakBul(baslik, kaynakEtiketi) }];
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

function randevuKodu() {
  var harfler = 'ABCDEFGHJKLMNPRSTUVYZ23456789', k = 'BT-';
  for (var i = 0; i < 5; i++) k += harfler.charAt(Math.floor(Math.random() * harfler.length));
  return k;
}

/* ───────────── Gecikme bildirimi ve salon paneli (saf fonksiyonlar) ───────────── */

/** Etkinlik açıklamasından telefonu bulur (site kaydı: "Telefon: 05…"; elle eklenen: herhangi bir cep numarası). */
function aciklamadanTelefon(aciklama) {
  var m = String(aciklama || '').match(/(?:\+?90[\s-]?)?0?5\d{2}[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}/);
  return m ? telefonTemizle(m[0]) : null;
}

/** Müşteriye gidecek gecikme metni. r: {ad, saat, hizmet, kod}, dk: gecikme dakikası */
function gecikmeMetni(ayar, r, dk) {
  var ad = String(r.ad || '').trim().split(/\s+/)[0];
  var yeni = saate((dakikaya(r.saat) + dk) % 1440);
  var satirlar = [
    'Merhaba' + (ad ? ' ' + ad : '') + ',',
    'Bugün saat ' + r.saat + ' randevunuz için sıramız yaklaşık ' + dk + ' dakika kaydı.',
    'Beklememeniz için ' + yeni + ' gibi gelmeniz yeterli.',
    'Bu saat size uymuyorsa bu mesaja yazın, başka bir saate alalım. Kusura bakmayın.'
  ];
  if (r.kod) satirlar.push('Randevu kodu: ' + r.kod);
  satirlar.push(ayar.dukkanAdi + ' · ' + ayar.dukkanAdres);
  return satirlar.join('\n');
}

function gecikmeLinki(ayar, r, dk) {
  return 'https://wa.me/90' + r.telefon.slice(1) + '?text=' + encodeURIComponent(gecikmeMetni(ayar, r, dk));
}

/**
 * Panelde gösterilecek randevular: başlamamış ya da 60 dk'dan kısa süre önce başlamış, KAPALI olmayan,
 * saate göre sıralı. etkinlikler: [{baslik, aciklama, bas (ms), telefon?, ad?, hizmet?, kod?}]
 */
function panelListesi(etkinlikler, simdi) {
  return etkinlikler.filter(function (e) {
    return !/KAPALI/i.test(e.baslik) && e.bas > simdi - 60 * 6e4;
  }).sort(function (a, b) { return a.bas - b.bas; }).map(function (e) {
    var parca = String(e.baslik || '').split(' — ');
    return {
      bas: e.bas,
      telefon: e.telefon || aciklamadanTelefon(e.aciklama),
      ad: e.ad || parca[parca.length - 1],
      hizmet: e.hizmet || (parca.length > 1 ? parca[0] : ''),
      kod: e.kod || '',
      basladi: e.bas <= simdi
    };
  });
}

function htmlKacis(t) {
  return String(t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

/** Salon paneli HTML'i. liste: panelListesi() çıktısı + her satırda saat ('HH:mm') */
function panelHtml(ayar, liste, gunEtiketi) {
  var satirlar = liste.map(function (r) {
    var dugmeler = '';
    if (r.telefon) {
      ayar.gecikmeSecenekleri.forEach(function (dk) {
        dugmeler += '<a class="d g" target="_blank" rel="noopener" href="' + htmlKacis(gecikmeLinki(ayar, r, dk)) + '">' + dk + ' dk gecikme</a>';
      });
      dugmeler += '<a class="d" href="tel:+90' + r.telefon.slice(1) + '">Ara</a>';
    } else {
      dugmeler = '<span class="y">Telefon yok — etkinlik açıklamasına cep numarası yazın</span>';
    }
    return '<li' + (r.basladi ? ' class="b"' : '') + '><p><strong>' + htmlKacis(r.saat) + '</strong> ' + htmlKacis(r.ad) +
      (r.hizmet ? ' <span>· ' + htmlKacis(r.hizmet) + '</span>' : '') + '</p><div>' + dugmeler + '</div></li>';
  }).join('');
  return '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">' +
    '<title>' + htmlKacis(ayar.dukkanAdi) + ' — Bugünün randevuları</title><style>' +
    'body{margin:0;font:16px/1.45 system-ui,sans-serif;background:#f3f1ec;color:#141414}' +
    'header{background:#141414;color:#f3f1ec;padding:16px}h1{margin:0;font-size:1.25rem}header p{margin:.2rem 0 0;color:#bdb8ae;font-size:.9rem}' +
    'ul{list-style:none;margin:0;padding:8px 12px 40px}li{background:#fff;margin:8px 0;padding:12px;border-left:4px solid #d9a441}' +
    'li.b{opacity:.6}li p{margin:0 0 .6rem}li span{color:#5c5850}' +
    '.d{display:inline-block;margin:0 6px 6px 0;padding:10px 12px;border:1px solid #141414;color:#141414;text-decoration:none;font-weight:600;min-height:44px;box-sizing:border-box}' +
    '.g{background:#141414;color:#fff}.y{color:#b3261e;font-size:.9rem}.bos{padding:24px 16px;color:#5c5850}' +
    '</style></head><body><header><h1>' + htmlKacis(ayar.dukkanAdi) + ' — ' + htmlKacis(gunEtiketi) + '</h1>' +
    '<p>Sıra kayarsa müşterinin "gecikme" düğmesine dokunun; WhatsApp\'ta hazır mesaj açılır, Gönder\'e basın.</p></header>' +
    (satirlar ? '<ul>' + satirlar + '</ul>' : '<p class="bos">Bugün kalan randevu yok.</p>') + '</body></html>';
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
  return takvim().getEvents(bas, bit).reduce(function (liste, e) {
    return liste.concat(etkinlikAraliklari(
      Math.round((e.getStartTime() - bas) / 6e4),
      Math.round((e.getEndTime() - bas) / 6e4),
      e.getTitle(), e.getTag('kaynak'), e.getTag('adimlar')
    ));
  }, []);
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
    if (p.islem === 'panel') return panel(p.anahtar);
    return json({ ok: true, servis: "Barber's Town randevu" });
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
    etkinlik.setTag('kaynak', hizmetAdimlari(hizmet)[0].kaynak);
    if (hizmet.adimlar) etkinlik.setTag('adimlar', JSON.stringify(hizmet.adimlar));
    etkinlik.setTag('kod', kod);
    etkinlik.setTag('ad', r.ad);
    etkinlik.setTag('telefon', r.telefon);
    etkinlik.setTag('hizmet', r.hizmet);
    // Salonun telefonundaki takvimde etkinliğe dokununca gecikme mesajı tek dokunuşla açılır
    var kisi = { ad: r.ad, telefon: r.telefon, saat: r.saat, hizmet: r.hizmet, kod: kod };
    etkinlik.setDescription(etkinlik.getDescription() + AYAR.gecikmeSecenekleri.map(function (dk) {
      return '\n\n' + dk + ' dk gecikme bildir (WhatsApp):\n' + gecikmeLinki(AYAR, kisi, dk);
    }).join(''));

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
      '\nKod: ' + kod + '\n\nİptal için etkinliği Google Takvim\'den silin.\nMüşteriye yaz: https://wa.me/90' + r.telefon.slice(1) +
      panelSatiri());
  } catch (x) { /* e-posta kotası dolsa da randevu kaydı geçerli */ }

  return json({ ok: true, kod: kod, tarih: r.tarih, saat: r.saat, hizmet: r.hizmet, sure: AYAR.hizmetler[r.hizmet].sure });
}

/** E-postaların sonuna eklenen panel bağlantısı (web uygulaması yayınlanmamışsa boş). */
function panelSatiri() {
  try {
    var url = ScriptApp.getService().getUrl();
    var anahtar = ozellik('PANEL_ANAHTARI');
    return url && anahtar ? '\n\nSıra kayarsa gecikme bildirimi — bugünün listesi:\n' + url + '?islem=panel&anahtar=' + anahtar : '';
  } catch (x) { return ''; }
}

/**
 * Salon paneli: GET ?islem=panel&anahtar=… — günün kalan randevuları ve gecikme düğmeleri.
 * Anahtar kurulum() ile üretilir; bilinmeden müşteri bilgisi görüntülenemez.
 */
function panel(anahtar) {
  var gercek = ozellik('PANEL_ANAHTARI');
  if (!gercek || anahtar !== gercek) {
    return HtmlService.createHtmlOutput('<p style="font:16px system-ui;padding:16px">Bu bağlantı geçersiz.</p>');
  }
  var simdi = Date.now();
  var tarih = bugunTarih();
  var gunSonu = new Date(gunBaslangici(tarih).getTime() + 864e5);
  var etkinlikler = takvim().getEvents(new Date(simdi - 60 * 6e4), gunSonu).map(function (e) {
    return {
      baslik: e.getTitle(), aciklama: e.getDescription(), bas: e.getStartTime().getTime(),
      telefon: e.getTag('telefon'), ad: e.getTag('ad'), hizmet: e.getTag('hizmet'), kod: e.getTag('kod')
    };
  });
  var liste = panelListesi(etkinlikler, simdi).map(function (r) {
    r.saat = Utilities.formatDate(new Date(r.bas), 'Europe/Istanbul', 'HH:mm');
    return r;
  });
  var gunEtiketi = Utilities.formatDate(new Date(), 'Europe/Istanbul', 'dd.MM.yyyy');
  return HtmlService.createHtmlOutput(panelHtml(AYAR, liste, gunEtiketi))
    .setTitle(AYAR.dukkanAdi + ' — Bugünün randevuları')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Bir kez elle çalıştırın: takvimi, kayıt tablosunu ve panel anahtarını oluşturur. */
function kurulum() {
  var p = PropertiesService.getScriptProperties();
  if (!p.getProperty('PANEL_ANAHTARI')) p.setProperty('PANEL_ANAHTARI', Utilities.getUuid().replace(/-/g, ''));
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
  Logger.log('Takvim: ' + p.getProperty('TAKVIM_ID'));
  Logger.log('Tablo: https://docs.google.com/spreadsheets/d/' + p.getProperty('TABLO_ID'));
  Logger.log('Panel: <web uygulaması adresi>?islem=panel&anahtar=' + p.getProperty('PANEL_ANAHTARI'));
}

/* Node testleri için dışa aktarım (Apps Script'te etkisizdir) */
if (typeof module !== 'undefined') {
  module.exports = { AYAR: AYAR, bosSaatler: bosSaatler, dogrula: dogrula, telefonTemizle: telefonTemizle,
    kaynakBul: kaynakBul, haftaninGunu: haftaninGunu, cakisanSayisi: cakisanSayisi,
    hizmetAdimlari: hizmetAdimlari, etkinlikAraliklari: etkinlikAraliklari, aciklamadanTelefon: aciklamadanTelefon,
    gecikmeMetni: gecikmeMetni, gecikmeLinki: gecikmeLinki, panelListesi: panelListesi, panelHtml: panelHtml,
    htmlKacis: htmlKacis, panel: panel };
}
