// Çalıştırma: node barbers-town/_proje/randevu-sistemi/testler/entegrasyon.test.js
// Gerçek Code.gs + sahte Google servisleri: tüm akışlar ve ters durumlar
const { yukle } = require('./sahte-google');
const G = require('../Code.gs');
let gecen = 0, kalan = 0;
function kontrol(ad, kosul, ayrinti) {
  if (kosul) { gecen++; console.log('  ✓ ' + ad); }
  else { kalan++; console.log('  ✗ ' + ad + (ayrinti !== undefined ? '  → ' + JSON.stringify(ayrinti) : '')); }
}
const tr = d => new Date(d.getTime() + 3 * 36e5).toISOString().slice(0, 10); // İstanbul tarihi
const gunEkle = n => tr(new Date(Date.now() + n * 864e5));
const T1 = gunEkle(1), T2 = gunEkle(2);

console.log('\n[1] Saf fonksiyonlar');
kontrol('turkceTarih 2026-10-17', G.turkceTarih('2026-10-17') === '17 Ekim Cumartesi', G.turkceTarih('2026-10-17'));
kontrol('turkceTarih 2026-01-05', G.turkceTarih('2026-01-05') === '5 Ocak Pazartesi', G.turkceTarih('2026-01-05'));
kontrol('adDuzelt küçük harf', G.adDuzelt('selahattin peltek') === 'Selahattin Peltek', G.adDuzelt('selahattin peltek'));
kontrol('adDuzelt Türkçe i/ı', G.adDuzelt('ışık iclal') === 'Işık İclal', G.adDuzelt('ışık iclal'));
kontrol('adDuzelt fazla boşluk', G.adDuzelt('  ali   veli ') === 'Ali Veli', G.adDuzelt('  ali   veli '));
kontrol('adDuzelt büyük harfe dokunmaz', G.adDuzelt('McKenzie ALİ') === 'McKenzie ALİ');
const r0 = { ad: 'Ali', hizmet: 'Saç & Sakal Kesim', tarih: '2026-10-17', saat: '13:00' };
kontrol('hatırlatma metni', G.mesajMetni('hatirlat', r0).includes('17 Ekim Cumartesi, saat 13:00 (Saç & Sakal Kesim)'));
kontrol('taşındı metni', G.mesajMetni('tasindi', r0).includes('17 Ekim Cumartesi, saat 13:00 olarak güncellendi'));
kontrol('iptal metni', G.mesajMetni('iptal', r0).includes('iptal edildi'));
kontrol('elle eklenen (hizmetsiz) metinde boşluk hatası yok', !G.mesajMetni('iptal', { ...r0, hizmet: '' }).includes('  '));
kontrol('mesai uyarısı: 22:00', G.mesaiUyarisi(G.AYAR, '2026-10-19', 22 * 60, 22 * 60 + 45).includes('dışında'));
kontrol('mesai uyarısı: 10:00 yok', G.mesaiUyarisi(G.AYAR, '2026-10-19', 600, 645) === '');

console.log('\n[2] Kurulum');
const A = yukle();
A.baglam.kurulum();
kontrol('3 otomatik görev kuruldu', A.kayit.tetikleyiciler.map(t => t.ad).join() === 'hatirlatmaKontrol,tabloyuEsitle,aylikOzet', A.kayit.tetikleyiciler);
A.baglam.kurulum();
kontrol('kurulum tekrar çalışınca görevler çoğalmıyor', A.kayit.tetikleyiciler.length === 3, A.kayit.tetikleyiciler.length);
kontrol('panel şifresi 6 hane', /^\d{6}$/.test(A.ozellikler.PANEL_PIN));
const pin1 = A.ozellikler.PANEL_PIN; A.baglam.kurulum();
kontrol('kurulum tekrarında şifre değişmiyor', A.ozellikler.PANEL_PIN === pin1);

console.log('\n[3] Site randevusu (Türkçe tarih, isim, hatırlatıcı)');
const rv = (ad, saat, hizmet = 'Saç & Sakal Kesim', tel = '0532 111 22 33', tarih = T1) => A.post({ ad, telefon: tel, hizmet, tarih, saat, not: '' });
const b1 = rv('ali ışık', '10:00');
kontrol('randevu alındı', b1.ok && /^BT-/.test(b1.kod), b1);
const e1 = A.takvim().olaylar[0];
kontrol('takvimde ad düzeltildi', e1.baslik === 'Saç & Sakal Kesim — Ali Işık', e1.baslik);
kontrol('salon telefonuna 120 dk hatırlatıcı', e1.hatirlaticilar.join() === '120', e1.hatirlaticilar);
kontrol('açıklamada hatırlatma bağlantısı', e1.aciklama.includes('Hatırlatma mesajı: https://wa.me/905321112233?text='));
const ep = A.kayit.epostalar.at(-1);
kontrol('e-posta konusu Türkçe tarih', ep.konu === 'Yeni randevu: ' + G.turkceTarih(T1) + ', 10:00 — Saç & Sakal Kesim', ep.konu);
kontrol('e-posta gövdesinde ad düzeltilmiş', ep.govde.startsWith('Ali Işık (05321112233)'));
const s1 = A.sayfa().satirlar[1];
kontrol('tabloda tarih/saat metin', s1[2] === T1 && s1[3] === '10:00' && s1[5] === 'Ali Işık', s1);
kontrol('panelde açıklamadaki bağlantı nota karışmıyor', G.etkinlikCoz(e1.baslik, e1.aciklama).not === '');

console.log('\n[4] Kapasite ve çakışma');
A.onbellekTemizle();
const b2 = rv('veli', '10:00', 'Anatomik Saç Kesim', '0533 000 00 01');
kontrol('2. koltuk 10:00 alındı', b2.ok, b2);
const b3 = rv('can', '10:00', 'Saç & Sakal Kesim', '0533 000 00 02');
kontrol('3. kişi 10:00 → dolu', !b3.ok && b3.dolu, b3);
const b4 = rv('deniz', '10:00', 'Lazer Epilasyon', '0533 000 00 03');
kontrol('aynı saatte lazer (başka kaynak) alınabiliyor', b4.ok, b4);
const b5 = rv('emre', '11:00', 'Saç & Sakal Kesim', '0533 000 00 04');
kontrol('11:00 alındı', b5.ok);
A.onbellekTemizle();
kontrol('aynı numaradan günlük sınır (3)', [1, 2, 3, 4].map(i => rv('x', ['12:00', '13:00', '14:00', '15:00'][i - 1], 'VİP Salon', '0599 999 99 99')).at(-1).ok === false);

console.log('\n[5] Panel: liste');
const L = A.panel('liste', { tarih: T1 });
kontrol('liste ok', L.ok, L);
const k1 = L.randevular.find(x => x.ad === 'Ali Işık');
kontrol('hatırlatma bağlantısı sunucudan geliyor', k1.wa.startsWith('https://wa.me/905321112233?text=') && decodeURIComponent(k1.wa).includes('saat 10:00'), k1.wa);

console.log('\n[6] Panel: saati değiştir');
let t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '10:30' });
kontrol('10:30 → dolu (10:00 ve 11:00 koltuk randevularıyla çakışıyor)', !t.ok && t.dolu, t);
t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '10:00' });
kontrol('kendi saatine taşıma kendisiyle çakışmıyor', t.ok, t);
e1.setTag('hatirlatildi', '1');
t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '12:00' });
kontrol('12:00 taşındı', t.ok && e1.bas.toISOString() === new Date(T1 + 'T12:00:00+03:00').toISOString(), t);
kontrol('süre korundu (45 dk)', (e1.bit - e1.bas) === 45 * 6e4);
kontrol('taşınınca hatırlatma etiketi sıfırlandı', e1.getTag('hatirlatildi') === null);
kontrol('tablo güncellendi', A.sayfa().satirlar[1][3] === '12:00' && A.sayfa().satirlar[1][8] === 'Taşındı (panel)', A.sayfa().satirlar[1]);
kontrol('müşteriye "güncellendi" mesajı', decodeURIComponent(t.wa).includes('saat 12:00 olarak güncellendi'));
t = A.panel('tasi', { id: k1.id, tarih: gunEkle(-1), saat: '12:00' });
kontrol('geçmişe taşıma reddedildi', !t.ok && t.hata.includes('Geçmiş'), t);
t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '22:00' });
kontrol('mesai dışına taşıma: izin + uyarı', t.ok && t.uyari.includes('dışında'), t);
t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '23:30' });
kontrol('gece yarısını aşan taşıma reddedildi', !t.ok, t);
t = A.panel('tasi', { id: 'yok', tarih: T1, saat: '12:00' });
kontrol('olmayan randevu: anlaşılır hata', !t.ok && t.hata.includes('bulunamadı'));
t = A.panel('tasi', { id: k1.id, tarih: T1, saat: '25:99x' });
kontrol('bozuk saat reddedildi', !t.ok);
A.panel('tasi', { id: k1.id, tarih: T1, saat: '12:00' });

console.log('\n[7] Panel: saat kapat');
let k = A.panel('kapat', { tarih: T1, tumGun: false, bas: '11:30', bit: '13:00', not: 'öğle arası' });
kontrol('kapatıldı ve çakışan 2 randevu bildirildi (11:00 ve 12:00)', k.ok && k.cakisan === 2, k);
const m = A.get({ islem: 'musait', tarih: T1, hizmet: 'Saç & Sakal Kesim' });
kontrol('kapalı aralık sitede boş görünmüyor', !m.saatler.includes('12:00') && !m.saatler.includes('11:30') && m.saatler.includes('13:00'), m.saatler);
kontrol('kapalı aralık lazeri de kapatıyor', !A.get({ islem: 'musait', tarih: T1, hizmet: 'Lazer Epilasyon' }).saatler.includes('12:00'));
k = A.panel('kapat', { tarih: T1, tumGun: false, bas: '15:00', bit: '14:00' });
kontrol('ters saat aralığı reddedildi', !k.ok, k);
k = A.panel('kapat', { tarih: T2, tumGun: true, not: 'izin' });
kontrol('tüm gün kapatıldı', k.ok && k.cakisan === 0, k);
kontrol('tüm gün kapalı → hiç boş saat yok', A.get({ islem: 'musait', tarih: T2, hizmet: 'VİP Salon' }).saatler.length === 0);
A.onbellekTemizle();
kontrol('kapalı güne siteden randevu alınamıyor', rv('zeki', '12:00', 'VİP Salon', '0533 000 00 09', T2).dolu === true);
const kapali = A.panel('liste', { tarih: T2 }).randevular[0];
kontrol('kapalı saat listede, WhatsApp bağlantısız', kapali.kapali && kapali.wa === '', kapali);
const kal = A.panel('iptal', { id: kapali.id });
kontrol('kapalı saat kaldırıldı → gün yeniden açık', kal.ok && A.get({ islem: 'musait', tarih: T2, hizmet: 'VİP Salon' }).saatler.length > 0);

console.log('\n[8] Panel: iptal');
const L2 = A.panel('liste', { tarih: T1 }).randevular;
const veli = L2.find(x => x.ad === 'Veli');
const ip = A.panel('iptal', { id: veli.id });
kontrol('iptal edildi + iptal mesajı', ip.ok && decodeURIComponent(ip.wa).includes('Anatomik Saç Kesim randevunuz iptal edildi'), ip);
kontrol('tabloda İptal (panel)', A.sayfa().satirlar.find(r => r[5] === 'Veli')[8] === 'İptal (panel)');
kontrol('ikinci kez iptal: anlaşılır hata', A.panel('iptal', { id: veli.id }).hata.includes('bulunamadı'));

console.log('\n[9] Panel güvenliği');
A.onbellekTemizle();
const yanlis = [1, 2, 3, 4, 5].map(() => A.post({ islem: 'panel', pin: '000000', eylem: 'liste', tarih: T1 }));
kontrol('yanlış şifre reddediliyor', yanlis[0].pin === false);
kontrol('5 yanlıştan sonra doğru şifre de kilitli', A.panel('liste', { tarih: T1 }).hata.includes('Çok fazla'));
A.onbellekTemizle();
kontrol('şifresiz taşıma yapılamıyor', A.post({ islem: 'panel', eylem: 'tasi', id: k1.id, tarih: T1, saat: '13:00' }).pin === false);
A.onbellekTemizle();

console.log('\n[10] Otomatik hatırlatma (15 dk görevi)');
const B = yukle(); B.baglam.kurulum();
const tk = B.takvim(), simdi = Date.now();
const ekle = (baslik, aciklama, dkSonra, olusturmaDkOnce) => { const x = tk.createEvent(baslik, new Date(simdi + dkSonra * 6e4), new Date(simdi + (dkSonra + 45) * 6e4), { description: aciklama }); x.olusturma = new Date(simdi - olusturmaDkOnce * 6e4); return x; };
const ac = tel => 'Kod: BT-XXXXX\nTelefon: ' + tel + '\nNot: -\nKaynak: site formu';
const h1 = ekle('Saç & Sakal Kesim — Ahmet', ac('05320000001'), 90, 300);
const h2 = ekle('Saç & Sakal Kesim — Yeni', ac('05320000002'), 60, 10);   // 10 dk önce alındı
const h3 = ekle('KAPALI — mola', '', 30, 300);
const h4 = ekle('Mehmet saç (telefonla)', '', 45, 300);                    // telefonsuz elle
const h5 = ekle('Saç & Sakal Kesim — Uzak', ac('05320000005'), 150, 300); // 2.5 saat sonra
const h6 = ekle('Saç & Sakal Kesim — Önceden', ac('05320000006'), 100, 300); h6.setTag('hatirlatildi', '1');
const h7 = ekle('Saç & Sakal Kesim — Başlamış', ac('05320000007'), -10, 300);
B.baglam.hatirlatmaKontrol();
const he = B.kayit.epostalar;
kontrol('tek e-posta gönderildi', he.length === 1, he.length);
kontrol('yalnız uygun randevu (Ahmet) listede', he[0] && he[0].govde.includes('Ahmet') && !/Yeni|mola|Mehmet|Uzak|Önceden|Başlamış/.test(he[0].govde), he[0] && he[0].govde);
kontrol('e-postada müşteriye WhatsApp hatırlatma bağlantısı', he[0] && he[0].govde.includes('https://wa.me/905320000001?text='));
kontrol('hatırlatılan etiketlendi', h1.getTag('hatirlatildi') === '1');
B.baglam.hatirlatmaKontrol();
kontrol('ikinci turda tekrar e-posta yok', B.kayit.epostalar.length === 1, B.kayit.epostalar.length);

console.log('\n[11] Tablo eşitleme (gece görevi)');
const C = yukle(); C.baglam.kurulum();
const c1 = C.post({ ad: 'aa', telefon: '05320000011', hizmet: 'VİP Salon', tarih: T1, saat: '10:00' });
const c2 = C.post({ ad: 'bb', telefon: '05320000012', hizmet: 'VİP Salon', tarih: T1, saat: '12:00' });
const c3 = C.post({ ad: 'cc', telefon: '05320000013', hizmet: 'VİP Salon', tarih: T1, saat: '14:00' });
const olay = kod => C.takvim().olaylar.find(x => x.etiket.kod === kod);
olay(c1.kod).deleteEvent();                                                   // takvim uygulamasından silindi
olay(c2.kod).setTime(new Date(T2 + 'T16:00:00+03:00'), new Date(T2 + 'T17:00:00+03:00')); // takvimde sürüklendi
C.sayfa().satirlar[3][2] = new Date(T1 + 'T00:00:00+03:00');                  // Sheets metni tarihe çevirmiş olsun
C.sayfa().appendRow([new Date(), 'BT-ESKI1', '2020-01-01', '10:00', 'VİP Salon', 'Eski', '0', '', 'Alındı']);
C.baglam.tabloyuEsitle();
const sat = kod => C.sayfa().satirlar.find(r => r[1] === kod);
kontrol('takvimden silinen → İptal (takvimden)', sat(c1.kod)[8] === 'İptal (takvimden)', sat(c1.kod));
kontrol('takvimde taşınan → yeni tarih/saat + Taşındı (takvimden)', sat(c2.kod)[2] === T2 && sat(c2.kod)[3] === '16:00' && sat(c2.kod)[8] === 'Taşındı (takvimden)', sat(c2.kod));
kontrol('tarihe dönüşmüş hücre doğru okundu, değişmedi', sat(c3.kod)[8] === 'Alındı', sat(c3.kod));
kontrol('30 günden eski satıra dokunulmadı', sat('BT-ESKI1')[8] === 'Alındı');
C.baglam.tabloyuEsitle();
kontrol('ikinci çalıştırmada durum değişmiyor', sat(c2.kod)[8] === 'Taşındı (takvimden)' && sat(c1.kod)[8] === 'İptal (takvimden)');

console.log('\n[12] Aylık özet');
const D = yukle(); D.baglam.kurulum();
const bugun = new Date(Date.now() + 3 * 36e5);
const gecenTarih = new Date(Date.UTC(bugun.getUTCFullYear(), bugun.getUTCMonth() - 1, 10));
const gecenAy = gecenTarih.toISOString().slice(0, 7);
[['VİP Salon', 'Alındı'], ['Saç & Sakal Kesim', 'Alındı'], ['Saç & Sakal Kesim', 'Taşındı (panel)'], ['Lazer Epilasyon', 'İptal (panel)']]
  .forEach(([h, d], i) => D.sayfa().appendRow([new Date(), 'BT-O' + i, gecenAy + '-1' + i, '10:00', h, 'X', '0', '', d]));
D.sayfa().appendRow([new Date(), 'BT-BU', gunEkle(0), '10:00', 'VİP Salon', 'X', '0', '', 'Alındı']); // bu ay: sayılmamalı
D.baglam.aylikOzet();
const oz = D.kayit.epostalar[0];
kontrol('özet e-postası gitti', !!oz);
kontrol('geçen ay: 4 talep, 1 iptal, 3 gerçekleşen', oz && oz.govde.includes('Toplam talep: 4') && oz.govde.includes('İptal: 1') && oz.govde.includes('Gerçekleşen/bekleyen: 3'), oz && oz.govde);
kontrol('hizmet dökümü (Saç & Sakal 2)', oz && oz.govde.includes('Saç & Sakal Kesim: 2'));

console.log('\n[13] Ters durumlar: e-posta kotası, uzak taşıma');
const E = yukle(); E.baglam.kurulum();
E.kayit.kota = 3;
const eq = E.post({ ad: 'kota testi', telefon: '05320000021', hizmet: 'VİP Salon', tarih: T1, saat: '10:00' });
kontrol('kota azken randevu yine alınıyor', eq.ok, eq);
kontrol('kota azken önemsiz "yeni randevu" e-postası atlanıyor', E.kayit.epostalar.length === 0, E.kayit.epostalar.length);
E.kayit.kota = 0;
const eh = E.takvim().createEvent('Saç & Sakal Kesim — Kota', new Date(Date.now() + 90 * 6e4), new Date(Date.now() + 135 * 6e4), { description: 'Kod: BT-K\nTelefon: 05320000022\nNot: -' });
eh.olusturma = new Date(Date.now() - 300 * 6e4);
E.baglam.hatirlatmaKontrol();
kontrol('kota bitince hatırlatma etiketlenmiyor (sonra yeniden denenecek)', eh.getTag('hatirlatildi') === null);
E.kayit.kota = 50; E.baglam.hatirlatmaKontrol();
kontrol('kota açılınca hatırlatma gidiyor', eh.getTag('hatirlatildi') === '1' && E.kayit.epostalar.length === 1);
const uz = E.panel('liste', { tarih: T1 }).randevular.find(x => x.ad === 'Kota Testi');
const uzakTarih = gunEkle(40);
const ut = E.panel('tasi', { id: uz.id, tarih: uzakTarih, saat: '12:00' });
kontrol('40 gün sonraya taşındı', ut.ok, ut);
E.baglam.tabloyuEsitle();
const us = E.sayfa().satirlar.find(r => r[5] === 'Kota Testi');
kontrol('uzak taşıma gece görevinde "iptal" sayılmıyor', us[8] === 'Taşındı (panel)' && us[2] === uzakTarih, us);

console.log('\n[14] Panelden müşteri ekleme (kapıdan geldi / telefon randevusu)');
const P = yukle(); P.baglam.kurulum();
const T3 = gunEkle(3), BUGUN = gunEkle(0);
kontrol('saf: geçmiş gün reddedilir', !!G.hizliPlan(G.AYAR, { tur: 'telefon', tarih: gunEkle(-1), hizmet: 'Saç & Sakal Kesim', saat: '10:00' }, BUGUN, -Infinity).hata);
kontrol('saf: geçersiz tür reddedilir', !!G.hizliPlan(G.AYAR, { tur: 'x', tarih: T3, hizmet: 'Saç & Sakal Kesim' }, BUGUN, -Infinity).hata);
const bos3 = P.panel('bos', { tarih: T3, hizmet: 'Saç & Sakal Kesim' });
kontrol('boş saatler (panel) 09:00 ile başlıyor', bos3.ok && bos3.saatler[0] === G.AYAR.calisma[G.haftaninGunu(T3)][0], bos3);
const tp = P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Saç & Sakal Kesim', saat: '11:00', ad: 'ayşe ışık', telefon: '0532 444 55 66' });
kontrol('telefon randevusu eklendi', tp.ok && /^BT-/.test(tp.kod) && tp.bas === '11:00' && tp.bit === '11:45', tp);
kontrol('müşteriye onay mesajı bağlantısı', tp.wa.startsWith('https://wa.me/905324445566') && decodeURIComponent(tp.wa).includes('randevunuz alındı'), tp.wa);
const te = P.takvim().olaylar.at(-1);
kontrol('takvimde ad düzeltildi', te.baslik === 'Saç & Sakal Kesim — Ayşe Işık', te.baslik);
kontrol('telefon randevusuna 120 dk hatırlatıcı', te.hatirlaticilar.join() === '120', te.hatirlaticilar);
kontrol('tabloda "Panel: telefon"', P.sayfa().satirlar.at(-1)[8] === 'Panel: telefon' && P.sayfa().satirlar.at(-1)[3] === '11:00', P.sayfa().satirlar.at(-1));
const lt = P.panel('liste', { tarih: T3 });
const lr = lt.randevular.find(x => x.kod === tp.kod);
kontrol('listede telefon ve kaynak görünüyor', lr && lr.telefon === '05324445566' && lr.kaynakNot === 'panel (telefon)' && !!lr.wa, lr);
kontrol('liste hizmet listesini ve bugünü veriyor', lt.hizmetler.length === Object.keys(G.AYAR.hizmetler).length && lt.bugun === BUGUN, lt.bugun);
kontrol('2. koltuk 11:00 eklendi', P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Anatomik Saç Kesim', saat: '11:00' }).ok);
const dolu = P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Saç & Sakal Kesim', saat: '11:15' });
kontrol('3. kişi çakışan saatte → dolu sorusu', !dolu.ok && dolu.dolu, dolu);
kontrol('"yine de ekle" (zorla) çalışıyor', P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Saç & Sakal Kesim', saat: '11:15', zorla: true }).ok);
kontrol('dolu saat artık boş listesinde yok', P.panel('bos', { tarih: T3, hizmet: 'Saç & Sakal Kesim' }).saatler.indexOf('11:00') === -1);
kontrol('lazer aynı saatte ayrı kaynak → eklenir', P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Lazer Epilasyon', saat: '11:00' }).ok);
kontrol('mesai dışı reddedilir', P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Saç & Sakal Kesim', saat: '20:45' }).hata.includes('dışında'));
kontrol('hatalı telefon reddedilir', P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'Saç & Sakal Kesim', saat: '15:00', telefon: '123' }).hata.includes('geçersiz'));
kontrol('kapat ile kapanan saate eklenmez', (P.panel('kapat', { tarih: T3, tumGun: false, bas: '16:00', bit: '17:00' }), P.panel('ekle', { tur: 'telefon', tarih: T3, hizmet: 'VİP Salon', saat: '16:00' }).dolu === true));
kontrol('"kapıdan geldi" ileri gün için reddedilir', P.panel('ekle', { tur: 'kapi', tarih: T3, hizmet: 'Saç & Sakal Kesim' }).hata.includes('yalnız bugün'));
const kp = P.panel('ekle', { tur: 'kapi', tarih: BUGUN, hizmet: 'Saç & Sakal Kesim', zorla: true });
kontrol('kapıdan geldi eklendi (telefonsuz, WhatsApp yok)', kp.ok && kp.wa === '' && /^\d{2}:\d[05]$/.test(kp.bas), kp);
const kl = P.panel('liste', { tarih: BUGUN }).randevular.find(x => x.kod === kp.kod);
kontrol('kapıdan müşteri listede: ad, kaynak, telefon boş', kl && kl.ad === 'Kapıdan müşteri' && kl.kaynakNot === 'panel (kapıdan)' && kl.telefon === '' && kl.wa === '', kl);
kontrol('kapıdan müşteriye takvim hatırlatıcısı eklenmiyor', P.takvim().olaylar.at(-1).hatirlaticilar.length === 0);
P.baglam.hatirlatmaKontrol();
kontrol('telefonsuz kapıdan müşteri hatırlatma e-postasına girmiyor', !P.kayit.epostalar.some(e => e.govde.includes('Kapıdan müşteri')));
kontrol('yanlış şifreyle ekleme yapılamaz', P.post({ islem: 'panel', pin: '000000', eylem: 'ekle', tur: 'kapi', tarih: BUGUN, hizmet: 'Saç & Sakal Kesim' }).pin === false);

console.log('\nSONUÇ: ' + gecen + ' geçti, ' + kalan + ' kaldı');
process.exit(kalan ? 1 : 0);
