// Çalıştırma: node barber-ugur/_proje/randevu-sistemi/testler/entegrasyon.test.js
// Barber Uğur'a özel ayarların testi. Ortak kod (Barber's Town ile aynı) tüm ayrıntılarıyla
// barbers-town/_proje/randevu-sistemi/testler/entegrasyon.test.js içinde test edilir.
const fs = require('fs'), path = require('path');
const { yukle } = require('./sahte-google');
const G = require('../Code.gs');
let gecen = 0, kalan = 0;
function kontrol(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log('  ✓ ' + ad); }
  else { kalan++; console.log('  ✗ ' + ad + (ayrinti !== undefined ? '  → ' + JSON.stringify(ayrinti) : '')); }
}
const tr = d => new Date(d.getTime() + 3 * 36e5).toISOString().slice(0, 10);
const gunEkle = n => tr(new Date(Date.now() + n * 864e5));
const ilkGun = haftaGunu => { for (let i = 1; i < 9; i++) if (G.haftaninGunu(gunEkle(i)) === haftaGunu) return gunEkle(i); };
const PAZAR = ilkGun(0), SALI = ilkGun(2), CARS = ilkGun(3);

console.log('\n[1] Ayar ve site uyumu');
const html = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'index.html'), 'utf8');
const sec = html.match(/<select[^>]*id="f-hizmet"[\s\S]*?<\/select>/)[0];
const formHizmetler = [...sec.matchAll(/<option[^>]*>([^<]+)</g)].map(m => m[1].replace(/&amp;/g, '&').trim()).filter(x => !/Seçin/.test(x));
kontrol('sitedeki hizmet listesi Code.gs ile birebir aynı', JSON.stringify(formHizmetler) === JSON.stringify(Object.keys(G.AYAR.hizmetler)), { form: formHizmetler, ayar: Object.keys(G.AYAR.hizmetler) });
const ayarJs = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'js', 'ayarlar.js'), 'utf8');
kontrol('site ileriGun = AYAR.ileriGun', new RegExp('ileriGun:\\s*' + G.AYAR.ileriGun).test(ayarJs));
kontrol('site hatirlatmaDakika = AYAR.hatirlatmaDakika', new RegExp('hatirlatmaDakika:\\s*' + G.AYAR.hatirlatmaDakika).test(ayarJs));
kontrol('dükkân adı Barber Uğur', G.AYAR.dukkanAdi === 'Barber Uğur');
kontrol('mesaj imzası Barber Uğur', G.mesajMetni('hatirlat', { ad: 'Ali', hizmet: 'Saç Kesimi', tarih: SALI, saat: '10:00' }).endsWith('— Barber Uğur'));

console.log('\n[2] Kurulum ve site randevusu');
const A = yukle(); A.baglam.kurulum();
kontrol('3 otomatik görev', A.kayit.tetikleyiciler.length === 3, A.kayit.tetikleyiciler);
kontrol('Pazar kapalı', A.get({ islem: 'musait', tarih: PAZAR, hizmet: 'Saç Kesimi' }).kapali === true);
const sb = A.get({ islem: 'musait', tarih: SALI, hizmet: 'Saç & Sakal' });
kontrol('Salı 09:00 açılış, son başlangıç 19:15 (45 dk, 20:00 kapanış)', sb.saatler[0] === '09:00' && sb.saatler.at(-1) === '19:15', [sb.saatler[0], sb.saatler.at(-1)]);
kontrol('Sakal Tıraşı (20 dk) son başlangıç 19:30', A.get({ islem: 'musait', tarih: SALI, hizmet: 'Sakal Tıraşı' }).saatler.at(-1) === '19:30');
const r1 = A.post({ ad: 'mehmet öz', telefon: '0532 111 22 33', hizmet: 'Saç Kesimi', tarih: SALI, saat: '10:00', not: '' });
kontrol('randevu alındı, kod BU-', r1.ok && /^BU-/.test(r1.kod), r1);
kontrol('takvim: ad düzeltildi + 120 dk hatırlatıcı', A.takvim().olaylar[0].baslik === 'Saç Kesimi — Mehmet Öz' && A.takvim().olaylar[0].hatirlaticilar.join() === '120');
kontrol('e-posta bildirimi gitti', A.kayit.epostalar.at(-1).konu.includes('Saç Kesimi'));

console.log('\n[3] Panel');
const L = A.panel('liste', { tarih: SALI });
kontrol('liste: 1 randevu + 4 hizmet', L.ok && L.randevular.length === 1 && L.hizmetler.length === 4, L);
kontrol('2. koltuk 10:00', A.panel('ekle', { tur: 'telefon', tarih: SALI, hizmet: 'Saç & Sakal', saat: '10:00', ad: 'ali' }).ok);
const d3 = A.panel('ekle', { tur: 'telefon', tarih: SALI, hizmet: 'Çocuk Tıraşı', saat: '10:15' });
kontrol('3. kişi çakışan saatte → dolu', d3.dolu === true, d3);
kontrol('telefon randevusu mesai dışı (19:30 Saç & Sakal) reddedilir', !!A.panel('ekle', { tur: 'telefon', tarih: SALI, hizmet: 'Saç & Sakal', saat: '19:30' }).hata);
kontrol('Pazar telefon randevusu reddedilir', !!A.panel('ekle', { tur: 'telefon', tarih: PAZAR, hizmet: 'Saç Kesimi', saat: '12:00' }).hata);
const tp = A.panel('ekle', { tur: 'telefon', tarih: CARS, hizmet: 'Sakal Tıraşı', saat: '15:00', ad: 'can', telefon: '0533 222 33 44' });
kontrol('telefon randevusu + onay mesajı (imza Barber Uğur)', tp.ok && decodeURIComponent(tp.wa).includes('randevunuz alındı') && decodeURIComponent(tp.wa).includes('Barber Uğur'), tp);
kontrol('panelden mola (kapat) çalışıyor', A.panel('kapat', { tarih: CARS, tumGun: false, bas: '13:00', bit: '13:30', not: 'Mola' }).ok);
kontrol('kapalı saate eklenmez', A.panel('ekle', { tur: 'telefon', tarih: CARS, hizmet: 'Saç Kesimi', saat: '13:00' }).dolu === true);
const t = A.panel('tasi', { id: A.panel('liste', { tarih: CARS }).randevular.find(x => x.ad === 'Can').id, tarih: CARS, saat: '16:00' });
kontrol('saati değiştir çalışıyor', t.ok, t);
kontrol('"kapıdan geldi" ileri gün için reddedilir', !!A.panel('ekle', { tur: 'kapi', tarih: SALI, hizmet: 'Saç Kesimi' }).hata);

console.log('\nSONUÇ: ' + gecen + ' geçti, ' + kalan + ' kaldı');
process.exit(kalan ? 1 : 0);
