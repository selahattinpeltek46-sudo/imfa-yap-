// Üçel Katalog 6 — "sayfa sayfa katalog" denemesi: kapak (koyu) + Römork ürün sayfası (açık)
// Aynı HTML: A4 PDF (basılı / WhatsApp) ve telefon görünümü (web).
// Teknik değerler uydurulmaz: Üçel formu doldurana kadar tabloda "Form ile eklenecek" yazar.
// Çalıştırma: node katalog6.mjs   →  cikti/Katalog6-Kapak-Romork.pdf, cikti/katalog6/index.html
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA } from './katalog2-veri.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const SITE_IMG = '/home/user/ucel-tarim-aletleri/katalog/img/';
const url = (p) => pathToFileURL(p).href;
const font = (paket, w) => url(join(BURASI, 'node_modules/@fontsource', paket, `${w}.css`));
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (x, renk = '#1B1B1D') => QRCode.toString(x, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: renk, light: '#FFFFFF00' } });
const LOGO = url(join(BURASI, 'marka/logo-k3.svg'));
const WA_IKON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';

const ICINDEKILER = [
  ['01', 'Tarım Römorku', 'Üçel imalatı'], ['02', 'Yaylı Kültivatör', 'Üçel imalatı'], ['03', 'Loader Kepçe', 'Üçel imalatı'],
  ['04', 'Tapan', 'Toprak işleme'], ['05', 'Pulluk', 'Toprak işleme'], ['06', 'Gübre Serpme', 'Gübreleme'], ['07', 'Su Tankeri', 'Su'],
];

const ROMORK = {
  no: '01', etiket: 'Taşıma · Üçel imalatı', ad: 'Tarım Römorku',
  fayda: 'Ürününüzü, yeminizi, odununuzu tek römorkla taşıyın.',
  ana: url(join(BURASI, 'foto-beyaz/tarim-romorku-yesil-traktor-kirpik.jpg')),
  mini: [[url(SITE_IMG + 'tarim-romorku-mavi-1400.webp'), 'Mavi kasa, ÜÇEL yazılı'], [url(SITE_IMG + 'tarim-romorku-traktor-1400.webp'), 'Kamyona yüklenirken']],
  hakkinda: "Kaynağından boyasına kadar Göksun Sanayi Sitesi'ndeki atölyemizde üretiyoruz. Kasa rengini ve yazısını isteğinize göre yapıyoruz; standart dışı ölçüde özel imalat da yapabiliyoruz.",
  kullanim: ['Tarla ürünü', 'Gübre ve yem', 'Odun ve malzeme'],
  secenek: ['Kasa rengi isteğe göre', 'Kasa yazısı isteğe göre', 'Standart dışı ölçüde özel imalat'],
  teknik: ['Model', 'Taşıma kapasitesi (ton)', 'Kasa iç ölçüsü (mm)', 'Dingil', 'Lastik ebadı', 'Damper', 'Boş ağırlık (kg)', 'Gereken traktör gücü (HP)'],
  mesaj: 'Merhaba, Tarım Römorku için fiyat ve bilgi almak istiyorum. Traktörüm: … İlim: …',
};

const kapak = async () => `<section class="page kapak">
  <div class="k-ust">
    <img class="k-logo" src="${LOGO}" alt="">
    <p class="k-marka"><b>ÜÇEL</b><span>TARIM ALETLERİ</span></p>
    <div class="k-cizgi"><span></span><i></i><span></span></div>
    <p class="et">Ürün Kataloğu 2026 · Göksun</p>
    <h1>Tarlada da, yolda da&nbsp;sağlam&nbsp;iş.</h1>
    <p class="k-alt">Römork, kültivatör ve loader kepçeyi Göksun'da kendimiz üretiyoruz. Diğer tarım aletlerinin satışını yapıyoruz.</p>
  </div>
  <div class="k-foto"></div>
  <div class="k-dip">
    <ol class="k-liste">${ICINDEKILER.map(([n, a, k]) => `<li><span class="n">${n}</span><span class="a">${a}</span><span class="k${k === 'Üçel imalatı' ? ' im' : ''}">${k}</span></li>`).join('')}</ol>
    <div class="k-iletisim">
      <div class="k-qr">${await qr(FIRMA.site, '#1B1B1D')}</div>
      <p><b>${FIRMA.telefon}</b>Telefon · WhatsApp<br>${FIRMA.adres1}<br>${FIRMA.saatler}</p>
    </div>
  </div>
</section>`;

const urun = async (u) => `<section class="page urun">
  <header class="u-ust">
    <span class="no">${u.no}</span>
    <div class="u-baslik"><p class="et">${u.etiket}</p><h2>${u.ad}</h2><p class="fayda">${u.fayda}</p></div>
    <img class="u-logo" src="${LOGO}" alt="">
  </header>
  <div class="u-foto"><img src="${u.ana}" alt="${u.ad}"></div>
  <div class="u-mini">${u.mini.map(([s, c]) => `<figure><img src="${s}" alt=""><figcaption>${c}</figcaption></figure>`).join('')}</div>
  <div class="u-bilgi">
    <div class="u-tablo">
      <h3>Teknik özellikler</h3>
      <table>${u.teknik.map((a) => `<tr><th>${a}</th><td><span class="bekle">Form ile eklenecek</span></td></tr>`).join('')}</table>
    </div>
    <div class="u-yan">
      <div class="kutu"><h3>Ürün hakkında</h3><p>${u.hakkinda}</p></div>
      <div class="kutu"><h3>Ne taşır?</h3><ul class="cips">${u.kullanim.map((k) => `<li>${k}</li>`).join('')}</ul></div>
      <div class="kutu"><h3>Seçenekler</h3><ul class="arti">${u.secenek.map((k) => `<li>${k}</li>`).join('')}</ul></div>
    </div>
  </div>
  <footer class="u-bant">
    <div class="u-qr">${await qr(wa(u.mesaj), '#1B1B1D')}</div>
    <div class="u-cta"><b>Fiyat için QR'ı okutun</b><span>WhatsApp'ta mesajınız hazır açılır.</span></div>
    <a class="u-wa" href="${wa(u.mesaj)}">${WA_IKON}WhatsApp'tan fiyat al</a>
    <div class="u-tel"><b>${FIRMA.telefon}</b><span>Göksun Sanayi Sitesi · ${FIRMA.saatler}</span></div>
    <span class="u-sayfa">${u.no}</span>
  </footer>
</section>`;

const CSS = `
@page { size: A4; margin: 0; }
:root { --ink:#1B1B1D; --altin:#C9A66E; --altin-k:#8a6a3c; --krem:#F6F3EE; --cer:#F1EDE6; --cizgi:#E4DED3; --gri:#5c5850; --wa:#13843F; }
* { box-sizing:border-box; } html { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { margin:0; font:400 10pt/1.5 Inter,sans-serif; color:var(--ink); background:#d9d4ca; }
img { display:block; max-width:100%; } p,h1,h2,h3,ul,ol,figure { margin:0; } a { color:inherit; text-decoration:none; }
h1,h2,h3 { font-family:Oswald,sans-serif; font-weight:600; line-height:1.1; }
.et { font:700 8pt/1 Inter; letter-spacing:.24em; text-transform:uppercase; color:var(--altin-k); }
.page { width:210mm; height:297mm; overflow:hidden; position:relative; background:#fff; margin:0 auto; page-break-after:always; break-after:page; }
@media screen and (min-width:601px) { body { padding:10mm 0; } .page { margin-bottom:10mm; box-shadow:0 2mm 8mm rgba(0,0,0,.15); } }

/* KAPAK — koyu */
.kapak { background:var(--ink); color:#fff; display:flex; flex-direction:column; }
.k-ust { padding:22mm 18mm 0; text-align:center; }
.k-logo { width:34mm; height:34mm; margin:0 auto; }
.k-marka b { display:block; font:700 30pt/1 Oswald; letter-spacing:.28em; margin:6mm 0 0 .28em; } .k-marka span { display:block; font:600 9pt/1 Inter; letter-spacing:.42em; color:var(--altin); margin:3mm 0 0 .42em; }
.k-cizgi { display:flex; align-items:center; gap:3mm; width:60mm; margin:8mm auto 8mm; } .k-cizgi span { flex:1; height:.4mm; background:var(--altin); } .k-cizgi i { width:2.2mm; height:2.2mm; background:var(--altin); transform:rotate(45deg); }
.kapak .et { color:var(--altin); } .kapak h1 { font-size:34pt; margin:5mm 0 4mm; } .k-alt { color:#cfccc6; font-size:11pt; max-width:140mm; margin:0 auto; }
.k-foto { flex:1; margin-top:8mm; background:url(${url(SITE_IMG + 'tarim-romorku-traktor-1400.webp')}) center 45%/cover; position:relative; }
.k-foto:before, .k-foto:after { content:''; position:absolute; left:0; right:0; height:35%; } .k-foto:before { top:0; background:linear-gradient(var(--ink),transparent); } .k-foto:after { bottom:0; background:linear-gradient(transparent,var(--ink)); }
.k-dip { display:grid; grid-template-columns:1fr 52mm; gap:10mm; padding:0 18mm 16mm; align-items:end; }
.k-liste { list-style:none; padding:0; border-top:.5mm solid var(--altin); }
.k-liste li { display:grid; grid-template-columns:10mm 1fr auto; padding:2mm 0; border-bottom:.2mm solid #34343a; align-items:baseline; }
.k-liste .n { font:700 11pt Oswald; color:var(--altin); } .k-liste .a { font:600 12pt Oswald; } .k-liste .k { font:700 6.5pt Inter; letter-spacing:.12em; text-transform:uppercase; color:#8f8b84; } .k-liste .k.im { color:var(--altin); }
.k-iletisim { text-align:center; font-size:8.5pt; color:#b9b5ad; } .k-qr { width:26mm; height:26mm; background:#fff; padding:2mm; border-radius:2mm; margin:0 auto 3mm; } .k-qr svg { width:100%; height:100%; }
.k-iletisim b { display:block; font:700 15pt Oswald; color:#fff; letter-spacing:.03em; }

/* ÜRÜN SAYFASI — açık */
.urun { display:flex; flex-direction:column; }
.u-ust { display:grid; grid-template-columns:auto 1fr auto; gap:6mm; align-items:start; padding:14mm 16mm 6mm; border-bottom:.5mm solid var(--ink); margin:0 0 0; }
.no { font:700 40pt/0.9 Oswald; color:var(--altin); } .u-baslik h2 { font-size:30pt; margin:2.5mm 0 2mm; } .fayda { font-size:11.5pt; color:var(--gri); }
.u-logo { width:15mm; height:15mm; }
.u-foto { margin:6mm 16mm 0; height:92mm; background:var(--cer); border-radius:3mm; overflow:hidden; padding:5mm; } .u-foto img { height:100%; width:100%; object-fit:contain; mix-blend-mode:multiply; }
.u-mini { display:grid; grid-template-columns:1fr 1fr; gap:4mm; margin:4mm 16mm 0; }
.u-mini img { height:30mm; width:100%; object-fit:cover; border-radius:2mm; } .u-mini figcaption { font-size:7.5pt; color:var(--gri); margin-top:1.2mm; }
.u-bilgi { display:grid; grid-template-columns:1.05fr 1fr; gap:8mm; margin:6mm 16mm 0; flex:1; }
.u-bilgi h3 { font-size:12pt; margin-bottom:2.5mm; }
.u-tablo table { width:100%; border-collapse:collapse; font-size:8.8pt; } .u-tablo th, .u-tablo td { text-align:left; padding:1.9mm 0; border-top:.25mm solid var(--cizgi); vertical-align:top; } .u-tablo tr:last-child th, .u-tablo tr:last-child td { border-bottom:.25mm solid var(--cizgi); }
.u-tablo th { font-weight:600; color:var(--ink); width:52%; padding-right:3mm; } .bekle { color:#a09a90; font-style:italic; }
.u-yan { display:grid; gap:4mm; align-content:start; } .kutu { background:var(--krem); border-radius:2.5mm; padding:3.5mm 4mm; border-left:1mm solid var(--altin); } .kutu p { font-size:9pt; color:#3a3a3d; }
.cips { list-style:none; padding:0; display:flex; flex-wrap:wrap; gap:1.5mm; } .cips li { background:#fff; border:.25mm solid var(--cizgi); border-radius:99px; padding:.8mm 3mm; font-size:8.5pt; font-weight:600; }
.arti { list-style:none; padding:0; display:grid; gap:1.2mm; } .arti li { display:flex; gap:2mm; font-size:9pt; font-weight:600; } .arti li:before { content:''; width:1.6mm; height:1.6mm; margin-top:1.5mm; background:var(--altin); transform:rotate(45deg); flex:none; }
.u-bant { margin-top:6mm; background:var(--ink); color:#fff; display:grid; grid-template-columns:auto 1fr auto; gap:5mm; align-items:center; padding:5mm 16mm; position:relative; }
.u-qr { width:24mm; height:24mm; background:#fff; padding:1.8mm; border-radius:1.5mm; } .u-qr svg { width:100%; height:100%; }
.u-cta b { display:block; font:600 14pt Oswald; } .u-cta span { font-size:8.5pt; color:#b9b5ad; }
.u-wa { display:none; }
.u-tel { text-align:right; } .u-tel b { display:block; font:700 17pt Oswald; color:var(--altin); letter-spacing:.03em; } .u-tel span { font-size:7.5pt; color:#b9b5ad; }
.u-sayfa { position:absolute; right:16mm; top:-7mm; font:700 8pt Inter; color:var(--altin-k); letter-spacing:.2em; }

/* TELEFON — aynı sayfalar, akışkan */
@media screen and (max-width:600px) {
  body { background:#fff; font-size:16px; }
  .page { width:auto; height:auto; overflow:visible; }
  .kapak { padding-bottom:28px; }
  .k-ust { padding:40px 16px 0; } .k-logo { width:96px; height:96px; } .k-marka b { font-size:34px; } .k-marka span { font-size:11px; }
  .k-cizgi { width:180px; margin:24px auto; } .kapak .et { font-size:12px; } .kapak h1 { font-size:38px; margin:16px 0 12px; } .k-alt { font-size:16px; }
  .k-foto { flex:none; height:260px; margin-top:24px; }
  .k-dip { grid-template-columns:1fr; padding:0 16px; gap:24px; } .k-liste li { padding:10px 0; grid-template-columns:36px 1fr auto; } .k-liste .n { font-size:18px; } .k-liste .a { font-size:19px; } .k-liste .k { font-size:10.5px; }
  .k-qr { display:none; } .k-iletisim { font-size:14px; } .k-iletisim b { font-size:26px; }
  .u-ust { grid-template-columns:auto 1fr; padding:32px 16px 16px; gap:14px; } .u-logo { display:none; } .no { font-size:48px; } .u-baslik h2 { font-size:36px; } .fayda { font-size:17px; }
  .u-foto { margin:16px 16px 0; height:auto; aspect-ratio:4/3; padding:12px; } .u-mini { margin:10px 16px 0; gap:10px; } .u-mini img { height:auto; aspect-ratio:4/3; } .u-mini figcaption { font-size:12.5px; }
  .u-bilgi { grid-template-columns:1fr; margin:24px 16px 0; gap:20px; } .u-bilgi h3 { font-size:22px; margin-bottom:10px; }
  .u-tablo table { font-size:15px; } .u-tablo th, .u-tablo td { padding:10px 0; } .u-yan { gap:12px; } .kutu { padding:14px 16px; border-left-width:4px; } .kutu p, .arti li { font-size:15.5px; } .cips li { font-size:14px; padding:4px 12px; } .arti li:before { width:7px; height:7px; margin-top:8px; }
  .u-bant { grid-template-columns:1fr; margin-top:28px; padding:24px 16px; gap:14px; } .u-qr, .u-cta, .u-sayfa { display:none; }
  .u-wa { display:flex; align-items:center; justify-content:center; gap:8px; min-height:54px; border-radius:10px; background:var(--wa); font:700 17px Inter; } .u-wa svg { width:22px; height:22px; }
  .u-tel { text-align:center; } .u-tel b { font-size:28px; } .u-tel span { font-size:13px; }
}`;

const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Üçel Tarım Aletleri · Ürün Kataloğu 2026</title>
${['oswald/600', 'oswald/700', 'inter/400', 'inter/600', 'inter/700'].map((f) => { const [p, w] = f.split('/'); return `<link rel="stylesheet" href="${font(p, w)}">`; }).join('')}
<style>${CSS}</style></head><body>
${await kapak()}
${await urun(ROMORK)}
</body></html>`;

const KLASOR = join(CIKTI, 'katalog6');
mkdirSync(KLASOR, { recursive: true });
const dosya = join(KLASOR, 'index.html');
writeFileSync(dosya, html);

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pg = await b.newPage();
await pg.goto(url(dosya), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
await pg.pdf({ path: join(CIKTI, 'Katalog6-Kapak-Romork.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
const tel = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await tel.goto(url(dosya), { waitUntil: 'networkidle' });
await tel.evaluate(() => document.fonts.ready);
const t = await tel.evaluate(() => ({ tasma: document.documentElement.scrollWidth > innerWidth, kirik: [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src) }));
console.log('telefon', t);
await tel.screenshot({ path: join(KLASOR, 'telefon.png'), fullPage: true });
await b.close();
console.log('ok');
