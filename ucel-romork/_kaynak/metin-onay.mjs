// Aşama 3 — metin onay belgesi: katalog5-metin.mjs'teki bütün metinleri sayfa sırasıyla,
// kaynak etiketiyle (Siteden / Yeni yazım) A4 PDF olarak çıkarır. Çalıştırma: node metin-onay.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { SAYFALAR as P, URUN_METIN as U, SECIM_KUTUSU, SLOGAN, ALT_SLOGAN, TELEFON } from './katalog5-metin.mjs';
import { URUNLER, SAHADAN } from './katalog2-veri.mjs';
import { TEKNIK } from './teknik-veri.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const font = (p, d) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', p, d)).href;
const ad = (id) => URUNLER.find((u) => u.id === id).ad;
const say = { site: 0, yeni: 0 };
const m = (x) => { say[x.k] += 1; return `<span class="m ${x.k}">${esc(x.t)}</span>`; };
const sat = (etiket, x) => `<tr><th>${esc(etiket)}</th><td>${Array.isArray(x) ? x.map(m).join('<br>') : m(x)}</td></tr>`;
const ham = (etiket, t) => `<tr><th>${esc(etiket)}</th><td><span class="m wa">${esc(t).replace(/\n/g, '<br>')}</span></td></tr>`;
const bek = (etiket, xs) => `<tr><th>${esc(etiket)}</th><td>${xs.map((x) => `<span class="m bek">${esc(x)}</span>`).join(' ')}</td></tr>`;
const blok = (no, baslik, satirlar, not = '') => `<section><h2><b>${no}</b>${esc(baslik)}</h2>${not ? `<p class="not">${not}</p>` : ''}<table>${satirlar.join('')}</table></section>`;

const urunBlok = (no, id) => {
  const u = U[id];
  const alanlar = TEKNIK[id].teknik.filter(([a]) => a !== 'Model').map(([a]) => a);
  return blok(no, `${ad(id)}${u.sayfa === 2 ? ' (2 sayfa)' : ''}`, [
    sat('Kategori', u.kategori), sat('Fayda cümlesi', u.fayda), sat('Tanım', u.tanim), sat('Nerede kullanılır?', u.kullanim),
    sat('Kimler için?', u.kimler), sat('Neden Üçel?', u.neden), ...(u.secenekler ? [sat('Seçenekler', u.secenekler)] : []),
    ...(u.detayFoto ? [sat('Detay fotoğrafı', u.detayFoto)] : []), ...(u.sayfa2Baslik ? [sat('2. sayfa başlığı', u.sayfa2Baslik)] : []),
    sat('CTA', u.cta), ham('WhatsApp mesajı', u.wa),
    bek('Teyit bekleyen', u.secenekBekleyen || []),
    bek('Teknik tablo (veri bekleniyor)', alanlar.slice(0, 8)),
  ], 'Teknik veri gelene kadar tablo yerine "Size uygun modeli birlikte seçelim" kutusu çıkar.');
};

const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>Üçel 2026 — Katalog Metinleri</title>
${['oswald/600.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('')}
<style>
@page { size: A4; margin: 14mm 14mm 16mm; }
body { font: 400 9.6pt/1.45 'Inter'; color: #1F2124; margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
h1 { font: 600 22pt/1.1 'Oswald'; margin: 0 0 2mm; }
.ust { font: 700 8pt 'Inter'; letter-spacing: 1.5pt; color: #C8102E; text-transform: uppercase; }
.lejant { display: flex; gap: 6mm; margin: 4mm 0 6mm; font-size: 9pt; flex-wrap: wrap; }
section { break-inside: avoid; margin-bottom: 6mm; }
h2 { font: 600 13pt/1.2 'Oswald'; margin: 0 0 1.5mm; display: flex; gap: 3mm; align-items: center; border-bottom: .5mm solid #C8102E; padding-bottom: 1mm; }
h2 b { background: #1F2124; color: #fff; font-size: 10pt; padding: .6mm 2mm; border-radius: .8mm; }
.not { font-size: 8.4pt; color: #5F5B55; margin: 0 0 1.5mm; }
table { width: 100%; border-collapse: collapse; }
th { width: 34mm; text-align: left; vertical-align: top; font: 600 8.2pt/1.4 'Inter'; color: #5F5B55; padding: 1.2mm 2mm 1.2mm 0; border-bottom: .25mm solid #E2DED8; }
td { padding: 1.2mm 0; border-bottom: .25mm solid #E2DED8; }
.m { padding-left: 2.2mm; border-left: 1mm solid; display: inline-block; margin: .3mm 0; }
.m.site { border-color: #2E8B57; } .m.yeni { border-color: #2D6CDF; background: #EEF3FD; }
.m.wa { border-color: #8f8b84; font-size: 8.6pt; color: #3A3A3D; } .m.bek { border-color: #C8102E; color: #8A1020; font-size: 8.4pt; }
.ozet { background: #F6F4F0; border-left: 1.4mm solid #C8102E; padding: 3mm 4mm; margin-bottom: 6mm; font-size: 9.4pt; }
.ozet b { font-weight: 700; }
</style></head><body>
<p class="ust">Aşama 3 · Metin onayı</p>
<h1>Üçel Tarım Aletleri — 2026 katalog metinleri</h1>
<div class="lejant"><span class="m site">Siteden: sitenizde zaten yazan bilgi</span><span class="m yeni">Yeni yazım: siteden bilgiyle yazıldı, yeni bilgi eklemez</span><span class="m wa">QR / buton ile açılan WhatsApp mesajı</span><span class="m bek">Üçel'den teyit bekliyor</span></div>
<div class="ozet" id="ozet"></div>
${blok('01', 'Kapak', [sat('Üst yazı', P.kapak.ust), sat('Başlık', P.kapak.baslik), sat('Alt başlık', P.kapak.alt), sat('Rozet', P.kapak.rozet), sat('Telefon: buton', P.kapak.telefonButon)])}
${blok('02', 'Göksun\'da üretiyoruz (marka)', [sat('Etiket', P.marka.etiket), sat('Başlık', P.marka.baslik), sat('Alt başlık', P.marka.alt), sat('Hikâye', P.marka.hikaye), sat('Alıntı', P.marka.alinti), ...P.marka.isler.map(([b, t]) => sat(b.t, t)), sat('Ziyaret', P.marka.ziyaret), sat('QR', P.marka.qr)])}
${blok('03', 'Neden Üçel?', [sat('Başlık', P.neden.baslik), ...P.neden.maddeler.flatMap((x, i) => [sat(`${i + 1}. başlık`, x.baslik), sat(`${i + 1}. metin`, x.metin), ...(x.kanit ? [sat(`${i + 1}. kanıt`, x.kanit)] : [])])])}
${blok('04', 'Nasıl üretiyoruz', [sat('Başlık', P.uretim.baslik), ...P.uretim.adimlar.map(([b, t]) => sat(b.t, t))], 'Yalnızca Üçel üretim fotoğrafları gönderirse eklenir.')}
${blok('05', 'Ürünlerimiz', [sat('Başlık', P.urunler.baslik), sat('Alt başlık', P.urunler.alt), sat('Kategoriler', P.urunler.kategoriler.map(([k]) => k)), sat('Kart metinleri', ['pulluk', 'kultivator', 'gubre-serpme', 'romork', 'su-tankeri', 'on-yukleyici'].map((id) => U[id].fayda))])}
${blok('06', 'Ekipman seçimi', [sat('Başlık', P.secim.baslik), sat('Alt başlık', P.secim.alt), ...P.secim.isler.map(([is, ids]) => `<tr><th>${m(is)}</th><td>${ids.map((i) => i[0] === '_' ? (i === '_takas' ? 'İkinci el & takas' : 'Mibzer (Diğer ürünler)') : ad(i)).join(' · ')}</td></tr>`), sat('HP notu', P.secim.hpNot), sat('CTA', P.secim.cta), ham('WhatsApp mesajı', P.secim.wa)], 'HP verisi gelince her işe "uygun traktör gücü" sütunu eklenir.')}
${urunBlok('07–08', 'romork')}
${urunBlok('09–10', 'kultivator')}
${urunBlok('11–12', 'on-yukleyici')}
${urunBlok('13', 'pulluk')}
${urunBlok('14', 'gubre-serpme')}
${urunBlok('15', 'su-tankeri')}
${blok('—', 'Teknik veri yokken çıkan kutu (her ürün)', [sat('Başlık', SECIM_KUTUSU.baslik), sat('Giriş', SECIM_KUTUSU.giris), sat('Maddeler', SECIM_KUTUSU.maddeler), sat('Sonuç', SECIM_KUTUSU.sonuc)])}
${blok('16', 'Diğer ürünler', [sat('Başlık', P.diger.baslik), ...P.diger.urunler.map(([b, t]) => sat(b.t, t)), sat('CTA', P.diger.cta), ham('WhatsApp mesajı', P.diger.wa)])}
${blok('17', 'Eski makinenizi değerlendirelim', [sat('Başlık', P.takas.baslik), sat('Alt başlık', P.takas.alt), sat('Adımlar', P.takas.adimlar), sat('İkinci el', P.takas.ikinciEl), sat('Dürüstlük notu', P.takas.durust), sat('CTA', P.takas.cta), ham('WhatsApp mesajı', P.takas.wa)])}
${blok('18', 'Sahadan kareler', [sat('Başlık', P.sahadan.baslik), sat('Alt başlık', P.sahadan.alt), `<tr><th>Fotoğraf açıklamaları</th><td>${SAHADAN.map(([, y]) => `<span class="m site">${esc(y)}</span>`).join('<br>')}</td></tr>`, sat('QR', P.sahadan.qr)], 'Müşteri görünen fotoğraflar için izin teyidi bekleniyor.')}
${blok('19', 'Sık sorulanlar', [sat('Başlık', P.sss.baslik), ...P.sss.sorular.flatMap(([s, c]) => [`<tr><th>Soru</th><td>${m(s)}</td></tr>`, sat('Cevap', c)]), sat('CTA', P.sss.cta)])}
${blok('20', 'İletişim / arka kapak', [sat('Başlık', P.iletisim.baslik), sat('Alt başlık', P.iletisim.alt), sat('Hızlı iletişim', P.iletisim.hizli), sat('Ziyaret', P.iletisim.ziyaret), sat('QR etiketleri', P.iletisim.qr.map(([a, b]) => ({ t: `${a.t} · ${b.t}`, k: 'yeni' }))), sat('Slogan', [SLOGAN, ALT_SLOGAN]), ham('WhatsApp mesajı', P.iletisim.wa)])}
${blok('T', 'Telefon sürümüne özel', [sat('Alt buton 1', TELEFON.butonWa), sat('Alt buton 2', TELEFON.butonAra), sat('Ekran geçişi', TELEFON.devam)])}
</body></html>`;

mkdirSync(CIKTI, { recursive: true });
const dosya = join(CIKTI, 'Ucel-Katalog-Metinleri-Asama3.html');
writeFileSync(dosya, html.replace('<div class="ozet" id="ozet"></div>', `<div class="ozet"><b>${say.site + say.yeni} metin</b> · <b>${say.site}</b> tanesi sitenizde zaten yazan bilgiden, <b>${say.yeni}</b> tanesi yeni yazım (başlık, fayda cümlesi, CTA). Yeni yazımlar yeni bilgi ya da iddia içermez; yalnızca sitedeki bilgiyi kısa ve sade söyler. Teknik değer yazılmadı.</div>`));
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const p = await b.newPage();
await p.goto(pathToFileURL(dosya).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.pdf({ path: join(CIKTI, 'Ucel-Katalog-Metinleri-Asama3.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true,
  displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font:8px Arial;color:#888;width:100%;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
await b.close();
console.log('yazıldı: cikti/Ucel-Katalog-Metinleri-Asama3.pdf ·', say.site, 'siteden ·', say.yeni, 'yeni');
