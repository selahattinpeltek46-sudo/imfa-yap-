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
 *  - Salon paneli (barbers-town/panel/): liste, saati değiştir, iptal, saat kapatma; müşteriye hazır WhatsApp mesajı.
 *
 * Otomatik görevler (kurulum() oluşturur):
 *  - hatirlatmaKontrol: 15 dakikada bir; 2 saat içinde başlayacak randevular için salona hatırlatma e-postası.
 *  - tabloyuEsitle: her gece; takvimde silinen/taşınan randevuları kayıt tablosuna işler.
 *  - aylikOzet: her ayın 1'i; geçen ayın randevu özetini e-postalar.
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
  bildirimEposta: '',      // boşsa betiği kuran Google hesabına gider
  hatirlatmaDakika: 120,   // randevudan kaç dakika önce salona hatırlatma gelir
  // E-posta bildirimleri. Ücretsiz Gmail'de günlük gönderim sınırı ~100'dür; yoğun salonda
  // takvim bildirimleri ve panel yeterliyse bunlardan biri kapatılabilir (false).
  yeniRandevuEposta: true,
  hatirlatmaEposta: true,
  dukkanAdi: "Barber's Town"
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
  var ad = adDuzelt(String(v.ad || '').slice(0, 60));
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

var GUNLER = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
var AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

/** "2026-10-17" → "17 Ekim Cumartesi" */
function turkceTarih(tarih) {
  var p = String(tarih).split('-');
  return Number(p[2]) + ' ' + AYLAR[Number(p[1]) - 1] + ' ' + GUNLER[haftaninGunu(tarih)];
}

/** Her kelimenin ilk harfini Türkçe kurala göre büyütür ("selahattin ışık" → "Selahattin Işık"); kalan harflere dokunmaz. */
function adDuzelt(ad) {
  var buyuk = function (h) { return h === 'i' ? 'İ' : h === 'ı' ? 'I' : h.toUpperCase(); };
  return String(ad || '').trim().split(/\s+/).map(function (k) { return k ? buyuk(k.charAt(0)) + k.slice(1) : k; }).join(' ');
}

function waLink(telefon, metin) {
  return 'https://wa.me/90' + String(telefon).replace(/^0/, '') + '?text=' + encodeURIComponent(metin);
}

/** Müşteriye gidecek hazır mesajlar. tur: 'hatirlat' | 'tasindi' | 'iptal' */
function mesajMetni(tur, r, dukkan) {
  var gun = turkceTarih(r.tarih), imza = ' — ' + (dukkan || "Barber's Town");
  if (tur === 'hatirlat') return 'Merhaba ' + r.ad + ', randevunuzu hatırlatmak istedik: ' + gun + ', saat ' + r.saat + ' (' + r.hizmet + '). Gelemeyecekseniz lütfen haber verin.' + imza;
  if (tur === 'tasindi') return 'Merhaba ' + r.ad + ', ' + (r.hizmet ? r.hizmet + ' ' : '') + 'randevunuz ' + gun + ', saat ' + r.saat + ' olarak güncellendi. Uygun değilse lütfen bize yazın.' + imza;
  return 'Merhaba ' + r.ad + ', ' + gun + ' saat ' + r.saat + ' için olan ' + (r.hizmet ? r.hizmet + ' ' : '') + 'randevunuz iptal edildi. Yeni bir saat için bize yazabilir ya da siteden randevu alabilirsiniz.' + imza;
}

/** Randevuyu yeni aralığa taşımak mümkün mü? (kendisi hariç dolu aralıklar verilmeli) */
function tasinabilir(ayar, mesguller, kaynak, bas, bit) {
  if (kaynak === 'KAPALI') return true;
  return cakisanSayisi(mesguller, kaynak, bas, bit) < (ayar.kaynaklar[kaynak] || 1);
}

/** Taşınan saat çalışma saatleri dışındaysa uyarı metni döner (salon yine de taşıyabilir). */
function mesaiUyarisi(ayar, tarih, basDk, bitDk) {
  var aralik = ayar.calisma[haftaninGunu(tarih)];
  if (!aralik || ayar.kapaliTarihler.indexOf(tarih) !== -1) return 'Bu gün normalde kapalı.';
  if (basDk < dakikaya(aralik[0]) || bitDk > dakikaya(aralik[1])) return 'Bu saat çalışma saatleri (' + aralik[0] + '–' + aralik[1] + ') dışında.';
  return '';
}

/**
 * Hatırlatılacak randevular. etkinlikler: [{basMs, olusturmaMs, baslik, aciklama, hatirlatildi}]
 * Kural: başlamamış, en geç `dakika` sonra başlayacak, telefonu olan, KAPALI olmayan, daha önce hatırlatılmamış
 * ve son 30 dakikada alınmamış (müşteri zaten yeni aldı) randevular.
 */
function hatirlatilacaklar(etkinlikler, simdiMs, dakika) {
  return etkinlikler.filter(function (e) {
    if (e.hatirlatildi || /KAPALI/i.test(e.baslik)) return false;
    if (e.basMs <= simdiMs || e.basMs - simdiMs > dakika * 6e4) return false;
    if (simdiMs - e.olusturmaMs < 30 * 6e4) return false;
    return !!etkinlikCoz(e.baslik, e.aciklama).telefon;
  });
}

/**
 * Kayıt tablosu ile takvimi karşılaştırır. satirlar: [{satirNo, kod, tarih, saat, durum}],
 * harita: {kod: {tarih, saat}} (takvimde [aralikBas, aralikBit] arasında bulunan randevular).
 * Dönen: [{satirNo, durum, tarih?, saat?}]
 */
function tabloFarklari(satirlar, harita, aralikBas, aralikBit) {
  var degisiklik = [];
  satirlar.forEach(function (s) {
    if (!s.kod || /^İptal/.test(s.durum) || s.tarih < aralikBas || s.tarih > aralikBit) return;
    var t = harita[s.kod];
    if (!t) degisiklik.push({ satirNo: s.satirNo, durum: 'İptal (takvimden)' });
    else if (t.tarih !== s.tarih || t.saat !== s.saat) degisiklik.push({ satirNo: s.satirNo, durum: 'Taşındı (takvimden)', tarih: t.tarih, saat: t.saat });
  });
  return degisiklik;
}

/** Geçen ayın özet metni. satirlar: [{tarih, hizmet, durum}], ay: 'YYYY-MM' */
function ozetMetni(satirlar, ay) {
  var ayinki = satirlar.filter(function (s) { return String(s.tarih).slice(0, 7) === ay; });
  var iptal = ayinki.filter(function (s) { return /^İptal/.test(s.durum); }).length;
  var hizmetler = {};
  ayinki.forEach(function (s) { if (!/^İptal/.test(s.durum)) hizmetler[s.hizmet] = (hizmetler[s.hizmet] || 0) + 1; });
  var p = ay.split('-');
  var satir = Object.keys(hizmetler).sort(function (a, b) { return hizmetler[b] - hizmetler[a]; })
    .map(function (h) { return '  ' + h + ': ' + hizmetler[h]; }).join('\n');
  return AYLAR[Number(p[1]) - 1] + ' ' + p[0] + ' — online randevu özeti\n\n' +
    'Toplam talep: ' + ayinki.length + '\nGerçekleşen/bekleyen: ' + (ayinki.length - iptal) + '\nİptal: ' + iptal +
    (satir ? '\n\nHizmetlere göre:\n' + satir : '');
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
      id: e.getId(),
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

function tablo() { return SpreadsheetApp.openById(ozellik('TABLO_ID')); }

/** Tablo hücresindeki tarih/saat değerini metne çevirir (Sheets bazen metni tarihe dönüştürür). */
function hucreMetni(deger, bicim, saatDilimi) {
  if (Object.prototype.toString.call(deger) === '[object Date]') return Utilities.formatDate(deger, saatDilimi, bicim);
  return String(deger || '').replace(/^'/, '');
}

/** Kod ile kayıt tablosundaki satırı bulur ve verilen sütunları yazar. sutunlar: {3: tarih, 4: saat, 9: durum} */
function tabloSatiriGuncelle(kod, sutunlar) {
  if (!kod) return;
  var sayfa = tablo().getSheets()[0];
  var son = sayfa.getLastRow();
  if (son < 2) return;
  var kodlar = sayfa.getRange(1, 2, son, 1).getValues();
  for (var i = kodlar.length - 1; i >= 1; i--) {
    if (kodlar[i][0] === kod) {
      Object.keys(sutunlar).forEach(function (sutun) { sayfa.getRange(i + 1, Number(sutun)).setValue(sutunlar[sutun]); });
      return;
    }
  }
}

function salonEposta() { return AYAR.bildirimEposta || Session.getEffectiveUser().getEmail(); }

/** Günlük kota bitmek üzereyse (son 5) yalnız önemli e-postaları gönderir; e-posta hatası randevuyu asla bozmaz. */
function epostaGonder(konu, govde, onemli) {
  try {
    var kalan = MailApp.getRemainingDailyQuota();
    if (kalan <= 0 || (!onemli && kalan <= 5)) return false;
    MailApp.sendEmail(salonEposta(), konu, govde);
    return true;
  } catch (x) { return false; }
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
      { description: 'Kod: ' + kod + '\nTelefon: ' + r.telefon + '\nNot: ' + (r.not || '-') + '\nKaynak: site formu' +
        '\n\nHatırlatma mesajı: ' + waLink(r.telefon, mesajMetni('hatirlat', r, AYAR.dukkanAdi)) }
    );
    etkinlik.setTag('kaynak', hizmet.kaynak);
    etkinlik.setTag('kod', kod);
    try { etkinlik.removeAllReminders(); etkinlik.addPopupReminder(AYAR.hatirlatmaDakika); } catch (x) { /* hatırlatıcı eklenemese de randevu geçerli */ }

    SpreadsheetApp.openById(ozellik('TABLO_ID')).getSheets()[0].appendRow([
      new Date(), kod, "'" + r.tarih, "'" + r.saat, r.hizmet, r.ad, "'" + r.telefon, r.not, 'Alındı'
    ]);
    onbellek.put(sayacAnahtari, String(sayac + 1), 21600);
  } finally {
    kilit.releaseLock();
  }

  if (AYAR.yeniRandevuEposta) {
    epostaGonder(
      'Yeni randevu: ' + turkceTarih(r.tarih) + ', ' + r.saat + ' — ' + r.hizmet,
      r.ad + ' (' + r.telefon + ')\n' + r.hizmet + '\n' + turkceTarih(r.tarih) + ', saat ' + r.saat + '\nNot: ' + (r.not || '-') +
      '\nKod: ' + kod + '\n\nYönetmek için salon panelini açın (saati değiştir / iptal).\nMüşteriye yaz: https://wa.me/90' + r.telefon.slice(1), false);
  }

  return json({ ok: true, kod: kod, tarih: r.tarih, saat: r.saat, hizmet: r.hizmet, sure: AYAR.hizmetler[r.hizmet].sure });
}

/**
 * Salon paneli (POST gövdesi {islem:'panel', pin, eylem, ...}).
 *  eylem 'liste' {tarih}  → o günün randevuları
 *  eylem 'iptal' {id}     → randevuyu takvimden siler, kayıt tablosunda durumu "İptal" yapar
 *  eylem 'tasi'  {id, tarih, saat} → randevuyu yeni saate taşır (kapasite kontrolüyle)
 *  eylem 'kapat' {tarih, tumGun, bas, bit, not} → KAPALI etkinliği ekler
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
      c.wa = c.telefon && !c.kapali ? waLink(c.telefon, mesajMetni('hatirlat', { ad: c.ad, hizmet: c.hizmet || 'randevu', tarih: v.tarih, saat: c.bas }, AYAR.dukkanAdi)) : '';
      return c;
    });
    return json({ ok: true, tarih: v.tarih, randevular: liste });
  }

  var saatYaz = function (d) { return Utilities.formatDate(d, 'Europe/Istanbul', 'HH:mm'); };
  var tarihYaz = function (d) { return Utilities.formatDate(d, 'Europe/Istanbul', 'yyyy-MM-dd'); };

  if (v.eylem === 'iptal') {
    var e = takvim().getEventById(String(v.id || ''));
    if (!e) return json({ ok: false, hata: 'Randevu bulunamadı; zaten silinmiş olabilir.' });
    var c = etkinlikCoz(e.getTitle(), e.getDescription());
    var bilgi = { ad: c.ad, telefon: c.telefon, hizmet: c.hizmet, tarih: tarihYaz(e.getStartTime()), saat: saatYaz(e.getStartTime()) };
    e.deleteEvent();
    tabloSatiriGuncelle(c.kod, { 9: 'İptal (panel)' });
    return json({ ok: true, randevu: bilgi, wa: c.telefon ? waLink(c.telefon, mesajMetni('iptal', bilgi, AYAR.dukkanAdi)) : '' });
  }

  if (v.eylem === 'tasi') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tarih || '') || !/^\d{2}:\d{2}$/.test(v.saat || '')) return json({ ok: false, hata: 'Geçersiz tarih veya saat.' });
    var kilit = LockService.getScriptLock();
    if (!kilit.tryLock(15000)) return json({ ok: false, hata: 'Yoğunluk var, tekrar deneyin.' });
    try {
      var et = takvim().getEventById(String(v.id || ''));
      if (!et) return json({ ok: false, hata: 'Randevu bulunamadı; silinmiş olabilir.' });
      if (et.isAllDayEvent()) return json({ ok: false, hata: 'Tüm gün etkinlikleri taşınamaz.' });
      var sure = et.getEndTime() - et.getStartTime();
      var yeniBas = new Date(v.tarih + 'T' + v.saat + ':00' + AYAR.saatDilimiOfseti);
      var yeniBit = new Date(yeniBas.getTime() + sure);
      if (yeniBas.getTime() < Date.now()) return json({ ok: false, hata: 'Geçmiş bir saate taşınamaz.' });
      var basDk = dakikaya(v.saat), bitDk = basDk + Math.round(sure / 6e4);
      if (bitDk > 24 * 60) return json({ ok: false, hata: 'Randevu gece yarısını geçemez.' });
      var kaynak = kaynakBul(et.getTitle(), et.getTag('kaynak'));
      var kendisi = et.getId();
      var digerleri = mesgulAraliklar(v.tarih).filter(function (m) { return m.id !== kendisi; });
      if (!tasinabilir(AYAR, digerleri, kaynak, basDk, bitDk)) return json({ ok: false, dolu: true, hata: 'Bu saat dolu (ya da kapalı). Başka bir saat seçin.' });
      et.setTime(yeniBas, yeniBit);
      try { et.deleteTag('hatirlatildi'); } catch (x) { /* etiket yoksa sorun değil */ }
      var ct = etkinlikCoz(et.getTitle(), et.getDescription());
      tabloSatiriGuncelle(ct.kod, { 3: "'" + v.tarih, 4: "'" + v.saat, 9: 'Taşındı (panel)' });
      var yeni = { ad: ct.ad, telefon: ct.telefon, hizmet: ct.hizmet, tarih: v.tarih, saat: v.saat };
      return json({ ok: true, uyari: mesaiUyarisi(AYAR, v.tarih, basDk, bitDk), randevu: yeni,
        wa: ct.telefon ? waLink(ct.telefon, mesajMetni('tasindi', yeni, AYAR.dukkanAdi)) : '' });
    } finally {
      kilit.releaseLock();
    }
  }

  if (v.eylem === 'kapat') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.tarih || '')) return json({ ok: false, hata: 'Geçersiz tarih.' });
    var aciklama = String(v.not || '').trim().slice(0, 60);
    var baslik = 'KAPALI' + (aciklama ? ' — ' + aciklama : '');
    var gunBas = gunBaslangici(v.tarih), kb, kbit, k;
    if (v.tumGun) {
      kb = gunBas; kbit = new Date(gunBas.getTime() + 864e5);
      k = takvim().createAllDayEvent(baslik, gunBas);
    } else {
      if (!/^\d{2}:\d{2}$/.test(v.bas || '') || !/^\d{2}:\d{2}$/.test(v.bit || '') || v.bit <= v.bas) return json({ ok: false, hata: 'Bitiş saati başlangıçtan sonra olmalı.' });
      kb = new Date(v.tarih + 'T' + v.bas + ':00' + AYAR.saatDilimiOfseti);
      kbit = new Date(v.tarih + 'T' + v.bit + ':00' + AYAR.saatDilimiOfseti);
      k = takvim().createEvent(baslik, kb, kbit);
    }
    k.setTag('kaynak', 'KAPALI');
    var etkilenen = takvim().getEvents(kb, kbit).filter(function (x) { return x.getId() !== k.getId() && !/KAPALI/i.test(x.getTitle()); }).length;
    return json({ ok: true, cakisan: etkilenen });
  }
  return json({ ok: false, hata: 'Geçersiz işlem' });
}

/** 15 dakikada bir çalışır: yakında başlayacak randevular için salona tek e-posta (WhatsApp bağlantılarıyla). */
function hatirlatmaKontrol() {
  var kilit = LockService.getScriptLock();
  if (!kilit.tryLock(5000)) return;
  try {
    var simdi = Date.now();
    var olaylar = takvim().getEvents(new Date(simdi), new Date(simdi + (AYAR.hatirlatmaDakika + 15) * 6e4));
    var aday = olaylar.map(function (e) {
      return { olay: e, basMs: e.getStartTime().getTime(), olusturmaMs: e.getDateCreated().getTime(),
        baslik: e.getTitle(), aciklama: e.getDescription(), hatirlatildi: !!e.getTag('hatirlatildi') };
    });
    var liste = hatirlatilacaklar(aday, simdi, AYAR.hatirlatmaDakika);
    if (!liste.length || !AYAR.hatirlatmaEposta) return;
    var satirlar = liste.map(function (x) {
      var c = etkinlikCoz(x.baslik, x.aciklama);
      var r = { ad: c.ad, hizmet: c.hizmet || 'randevu', tarih: Utilities.formatDate(new Date(x.basMs), 'Europe/Istanbul', 'yyyy-MM-dd'),
        saat: Utilities.formatDate(new Date(x.basMs), 'Europe/Istanbul', 'HH:mm') };
      return r.saat + ' · ' + r.hizmet + ' · ' + r.ad + ' (' + c.telefon + ')\nHatırlatma gönder: ' + waLink(c.telefon, mesajMetni('hatirlat', r, AYAR.dukkanAdi));
    });
    var gitti = epostaGonder('Hatırlatma: ' + liste.length + ' randevu yaklaşıyor',
      'Aşağıdaki randevular ' + AYAR.hatirlatmaDakika / 60 + ' saat içinde başlıyor. Bağlantıya dokununca müşteriye hazır hatırlatma mesajı açılır.\n\n' + satirlar.join('\n\n'), true);
    // Gönderilemezse etiketlenmez; sonraki turda (kota açılınca) yeniden denenir.
    if (gitti) liste.forEach(function (x) { x.olay.setTag('hatirlatildi', '1'); });
  } finally {
    kilit.releaseLock();
  }
}

/** Her gece çalışır: takvimde silinen veya taşınan randevuları kayıt tablosuna işler (son 30 gün + ileri tarihler). */
function tabloyuEsitle() {
  var ss = tablo(), sayfa = ss.getSheets()[0], tz = ss.getSpreadsheetTimeZone();
  var son = sayfa.getLastRow();
  if (son < 2) return;
  var degerler = sayfa.getRange(2, 1, son - 1, 9).getValues();
  var satirlar = degerler.map(function (d, i) {
    return { satirNo: i + 2, kod: String(d[1]), tarih: hucreMetni(d[2], 'yyyy-MM-dd', tz), saat: hucreMetni(d[3], 'HH:mm', tz), durum: String(d[8]) };
  });
  var bugun = bugunTarih();
  var aralikBas = Utilities.formatDate(new Date(gunBaslangici(bugun).getTime() - 30 * 864e5), 'Europe/Istanbul', 'yyyy-MM-dd');
  // İleri tarafı geniş tutulur: salon panelden randevuyu 21 günden ileriye taşırsa yanlışlıkla "iptal" sayılmasın.
  var aralikBit = Utilities.formatDate(new Date(gunBaslangici(bugun).getTime() + 365 * 864e5), 'Europe/Istanbul', 'yyyy-MM-dd');
  var harita = {};
  takvim().getEvents(gunBaslangici(aralikBas), new Date(gunBaslangici(aralikBit).getTime() + 864e5)).forEach(function (e) {
    var kod = e.getTag('kod') || etkinlikCoz(e.getTitle(), e.getDescription()).kod;
    if (kod) harita[kod] = { tarih: Utilities.formatDate(e.getStartTime(), 'Europe/Istanbul', 'yyyy-MM-dd'), saat: Utilities.formatDate(e.getStartTime(), 'Europe/Istanbul', 'HH:mm') };
  });
  tabloFarklari(satirlar, harita, aralikBas, aralikBit).forEach(function (f) {
    sayfa.getRange(f.satirNo, 9).setValue(f.durum);
    if (f.tarih) { sayfa.getRange(f.satirNo, 3).setValue("'" + f.tarih); sayfa.getRange(f.satirNo, 4).setValue("'" + f.saat); }
  });
}

/** Her ayın 1'inde çalışır: geçen ayın özetini salona e-postalar. */
function aylikOzet() {
  var ss = tablo(), sayfa = ss.getSheets()[0], tz = ss.getSpreadsheetTimeZone();
  var son = sayfa.getLastRow();
  if (son < 2) return;
  var bugun = gunBaslangici(bugunTarih());
  var gecenAy = Utilities.formatDate(new Date(bugun.getTime() - 15 * 864e5 - (Number(Utilities.formatDate(bugun, 'Europe/Istanbul', 'd')) - 1) * 864e5), 'Europe/Istanbul', 'yyyy-MM');
  var satirlar = sayfa.getRange(2, 1, son - 1, 9).getValues().map(function (d) {
    return { tarih: hucreMetni(d[2], 'yyyy-MM-dd', tz), hizmet: String(d[4]), durum: String(d[8]) };
  });
  epostaGonder(AYAR.dukkanAdi + ' — aylık randevu özeti', ozetMetni(satirlar, gecenAy), true);
}

/** Otomatik görevleri (yeniden) kurar; aynı görev iki kez oluşmaz. */
function tetikleyicileriKur() {
  var adlar = ['hatirlatmaKontrol', 'tabloyuEsitle', 'aylikOzet'];
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (adlar.indexOf(t.getHandlerFunction()) !== -1) ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('hatirlatmaKontrol').timeBased().everyMinutes(15).create();
  ScriptApp.newTrigger('tabloyuEsitle').timeBased().everyDays(1).atHour(3).create();
  ScriptApp.newTrigger('aylikOzet').timeBased().onMonthDay(1).atHour(9).create();
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
  tetikleyicileriKur();
  Logger.log('Otomatik görevler kuruldu: hatırlatma (15 dk), tablo eşitleme (gece 03:00), aylık özet (ayın 1i).');
  Logger.log('Takvim: ' + p.getProperty('TAKVIM_ID'));
  Logger.log('Salon paneli şifresi: ' + p.getProperty('PANEL_PIN'));
  Logger.log('Tablo: https://docs.google.com/spreadsheets/d/' + p.getProperty('TABLO_ID'));
}

/* Node testleri için dışa aktarım (Apps Script'te etkisizdir) */
if (typeof module !== 'undefined') {
  module.exports = { AYAR: AYAR, bosSaatler: bosSaatler, dogrula: dogrula, telefonTemizle: telefonTemizle,
    kaynakBul: kaynakBul, haftaninGunu: haftaninGunu, cakisanSayisi: cakisanSayisi,
    etkinlikCoz: etkinlikCoz, pinDogru: pinDogru, turkceTarih: turkceTarih, adDuzelt: adDuzelt, mesajMetni: mesajMetni,
    tasinabilir: tasinabilir, mesaiUyarisi: mesaiUyarisi, hatirlatilacaklar: hatirlatilacaklar, tabloFarklari: tabloFarklari,
    ozetMetni: ozetMetni, waLink: waLink };
}
