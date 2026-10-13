// Katalog 8'i sitenin katalog sayfasına çevirir (önce `node katalog8.mjs` çalıştırılır).
//  - cikti/katalog8/index.html okunur; dosya yolları siteye kopyalanan görsellere çevrilir
//  - telefon/tablet (≤860 px) akışkan görünüm, bilgisayarda A4 sayfalar
//  - sitenin eski katalog sayfasından korunanlar: meta/OG etiketleri, ?k kaynak etiketi, ürün gezinme çubuğu,
//    alt WhatsApp çubuğu, fotoğraf büyütme, PDF indirme
//  - assets/katalog altındaki iki PDF yeni tasarımla değiştirilir (bağlantılar aynı kalır)
// Çalıştırma: node web-katalog8.mjs  [SITE=/home/user/ucel-tarim-aletleri]
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const BURASI = dirname(fileURLToPath(import.meta.url));
const SITE = process.env.SITE || '/home/user/ucel-tarim-aletleri';
const KAT = join(SITE, 'katalog');
const FS = join(BURASI, 'node_modules/@fontsource');
const TEL = '905324803051';

let html = readFileSync(join(BURASI, 'cikti/katalog8/index.html'), 'utf8');
// eski sayfa (meta etiketleri ve @font-face için) git'teki son kayıtlı sürümden okunur; betik tekrar çalıştırılınca kendi çıktısını okumasın
const eski = execFileSync('git', ['-C', SITE, 'show', `${process.env.ESKI || 'e5dff74'}:katalog/index.html`], { encoding: 'utf8' });
if (!eski.includes('<link rel="preload"')) throw new Error('eski katalog sayfası beklenen biçimde değil');

// 1) yazı tipleri: sitenin font klasörüne 600 ağırlıkları da kopyalanır, @font-face eski sayfadan alınır
for (const [p, w] of [['oswald', 600], ['inter', 600]]) for (const alt of ['latin', 'latin-ext']) copyFileSync(join(FS, p, 'files', `${p}-${alt}-${w}-normal.woff2`), join(KAT, 'font', `${p}-${alt}-${w}.woff2`));
const yuzler = eski.match(/@font-face[^}]+}/g);
const ekYuz = yuzler.filter((y) => /oswald-latin(-ext)?-500|inter-latin(-ext)?-400/.test(y)).map((y) => y.replace(/weight: (500|400)/, 'weight: 600').replace(/-(500|400)\.woff2/, '-600.woff2'));
const FONT_CSS = [...yuzler, ...ekYuz].join('\n');
html = html.replace(/(<link rel="stylesheet" href="file:[^"]+">)+/, '');

// 2) görseller: file:// yolları siteye kopyalanır
mkdirSync(join(KAT, 'img/k8'), { recursive: true });
html = html.replace(/file:\/\/[^"')\s]+/g, (u) => {
  const yol = fileURLToPath(u);
  if (yol.endsWith('logo-k3.svg')) return '../assets/logo-k3.svg';
  copyFileSync(yol, join(KAT, 'img/k8', basename(yol)));
  return 'img/k8/' + basename(yol);
});

// 3) kırılım: telefon ve tablet akışkan, bilgisayarda A4 sayfa
html = html.replace(/max-width:600px/g, 'max-width:860px').replace(/min-width:601px/g, 'min-width:861px');

// 4) bölüm kimlikleri (gezinme için)
html = html.replace('<section class="page kapak">', '<section class="page kapak" id="kapak">')
  .replace('<section class="page hizmet">', '<section class="page hizmet" id="hizmetler">')
  .replace('<section class="page arka">', '<section class="page arka" id="iletisim">');

// 5) WhatsApp bağlantıları: ?k kaynak etiketi için mesaj data-msg'de
html = html.replace(/href="https:\/\/wa\.me\/\d+\?text=([^"]+)"/g, (m, t) => `${m} data-msg="${decodeURIComponent(t).replace(/"/g, '&quot;')}" target="_blank" rel="noopener"`);
// QR'lar bilgisayarda tıklanabilsin
html = html.replace(/<div class="qrc">/g, '<div class="qrc" aria-hidden="true">');

// 6) <head>: eski sayfanın meta / OG etiketleri korunur
const meta = eski.slice(eski.indexOf('<meta name="viewport"'), eski.indexOf('<link rel="preload"'));
html = html.replace(/<meta name="viewport"[^>]*>\s*<title>[^<]*<\/title>/, meta.trim());

const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>';
const PDF_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 2h8l5 5v15H6zM14 2v5h5M12 11v6M9 14l3 3 3-3"/></svg>';
const genelMesaj = 'Merhaba, Üçel kataloğunu inceledim, bilgi almak istiyorum.';
const waGenel = `https://wa.me/${TEL}?text=${encodeURIComponent(genelMesaj)}`;
const GEZ = [['kapak', 'Katalog'], ['romork', 'Römork'], ['kultivator', 'Kültivatör'], ['loader', 'Loader Kepçe'], ['tapan', 'Tapan'], ['pulluk', 'Pulluk'], ['gubre', 'Gübre Serpme'], ['tanker', 'Su Tankeri'], ['hizmetler', 'Hizmetler'], ['iletisim', 'İletişim']];

const UST = `<header class="w-ust"><div class="w-ic">
  <a class="w-marka" href="../"><img src="../assets/logo-k3.svg" alt="" width="40" height="40"><span><b>ÜÇEL</b><small>TARIM ALETLERİ</small></span></a>
  <a class="w-pdf" href="../assets/katalog/Ucel-Tarim-Aletleri-Katalog-2026.pdf">${PDF_SVG}<span>PDF indir</span></a>
</div></header>
<nav class="w-gez" aria-label="Katalogda gezin"><div class="w-ic">${GEZ.map(([id, a]) => `<a href="#${id}">${a}</a>`).join('')}</div></nav>
<main class="w-katalog">`;
const ALT = `</main>
<p class="w-son">© 2026 Üçel Tarım Aletleri · <a href="../">Web sitemiz</a> · <a href="../assets/katalog/Ucel-Tarim-Aletleri-Katalog-2026.pdf">Kataloğu PDF olarak indir</a></p>
<nav class="w-cubuk" aria-label="Hızlı iletişim"><a class="w-wa" href="${waGenel}" data-msg="${genelMesaj}" target="_blank" rel="noopener">${WA_SVG}WhatsApp'tan yazın</a><a class="w-ara" href="tel:+905324803051">Ara</a></nav>
<dialog id="kutu" aria-label="Fotoğraf"><form method="dialog"><button class="kapat" aria-label="Kapat">×</button></form><img alt=""><p></p></dialog>
<script>
// Gezinme: ekrandaki bölümün düğmesi koyulaşır
(function () {
  var nav = document.querySelector('.w-gez .w-ic');
  if (!nav || !('IntersectionObserver' in window)) return;
  var d = {};
  nav.querySelectorAll('a').forEach(function (a) { d[a.getAttribute('href').slice(1)] = a; });
  var g = new IntersectionObserver(function (e) {
    e.forEach(function (x) {
      if (!x.isIntersecting) return;
      nav.querySelectorAll('a.aktif').forEach(function (a) { a.classList.remove('aktif'); });
      var a = d[x.target.id]; if (!a) return;
      a.classList.add('aktif'); nav.scrollTo({ left: a.offsetLeft - 12, behavior: 'smooth' });
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  Object.keys(d).forEach(function (id) { var el = document.getElementById(id); if (el) g.observe(el); });
})();
// Fotoğraf büyütme (Sahadan fotoğrafları)
(function () {
  var k = document.getElementById('kutu');
  if (!k || !k.showModal) return;
  document.querySelectorAll('.u-sahadan figure').forEach(function (f) {
    var i = f.querySelector('img'), c = f.querySelector('figcaption');
    f.tabIndex = 0; f.setAttribute('role', 'button');
    function ac() { k.querySelector('img').src = i.src; k.querySelector('img').alt = c ? c.textContent : ''; k.querySelector('p').textContent = c ? c.textContent : ''; k.showModal(); }
    f.addEventListener('click', ac);
    f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ac(); } });
  });
  k.addEventListener('click', function (e) { if (e.target === k) k.close(); });
})();
// Kaynak etiketi: ?k=instagram → WhatsApp mesajı "(Instagram)" ile başlar; oturum boyunca hatırlanır.
(function () {
  var ADLAR = { instagram: 'Instagram', ig: 'Instagram', facebook: 'Facebook', fb: 'Facebook', marketplace: 'Marketplace', mp: 'Marketplace', tiktok: 'TikTok', tt: 'TikTok', whatsapp: 'WhatsApp', wa: 'WhatsApp', qr: 'QR', site: 'Site' };
  var k = null;
  try { k = new URLSearchParams(location.search).get('k'); if (k) sessionStorage.setItem('k', k); else k = sessionStorage.getItem('k'); } catch (e) {}
  var ad = k && ADLAR[k.toLowerCase()];
  if (!ad) return;
  document.querySelectorAll('a[data-msg]').forEach(function (a) {
    a.href = 'https://wa.me/${TEL}?text=' + encodeURIComponent('(' + ad + ') ' + a.getAttribute('data-msg'));
  });
})();
</script>`;

const WEB_CSS = `
html { scroll-behavior:smooth; -webkit-text-size-adjust:100%; }
.page { scroll-margin-top:118px; }
.w-ic { max-width:1100px; margin:0 auto; padding:0 16px; }
.w-ust { position:sticky; top:0; z-index:20; background:#fff; border-bottom:1px solid #E4DED3; }
.w-ust .w-ic { height:64px; display:flex; align-items:center; justify-content:space-between; gap:12px; }
.w-marka { display:flex; align-items:center; gap:10px; } .w-marka img { width:40px; height:40px; }
.w-marka b { display:block; font:700 19px/1 Oswald; letter-spacing:3.5px; color:#1B1B1D; } .w-marka small { display:block; font:600 9.5px/1 Inter; letter-spacing:3px; color:#8a6a3c; margin-top:6px; }
.w-pdf { display:flex; align-items:center; gap:8px; font:700 14.5px Inter; color:#8a6a3c; border:1.5px solid #C9A66E; border-radius:8px; padding:9px 12px; } .w-pdf svg { width:18px; height:18px; }
.w-gez { position:sticky; top:64px; z-index:19; background:rgba(255,255,255,.97); border-bottom:1px solid #E4DED3; }
.w-gez .w-ic { display:flex; gap:8px; overflow-x:auto; padding:10px 16px; scrollbar-width:none; } .w-gez .w-ic::-webkit-scrollbar { display:none; }
.w-gez a { flex:none; font:600 14.5px/1 Inter; border:1.5px solid #E4DED3; border-radius:99px; padding:10px 14px; color:#1B1B1D; background:#fff; } .w-gez a.aktif { background:#1B1B1D; color:#fff; border-color:#1B1B1D; }
.w-son { text-align:center; font-size:14px; color:#5c5850; padding:24px 16px 32px; margin:0; } .w-son a { text-decoration:underline; }
.w-cubuk { display:none; }
.u-sahadan figure { cursor:zoom-in; }
dialog#kutu { border:0; padding:0; border-radius:12px; max-width:min(96vw,1100px); background:#111; color:#fff; }
dialog#kutu::backdrop { background:rgba(0,0,0,.8); } dialog#kutu img { max-height:80vh; width:auto; margin:0 auto; } dialog#kutu p { padding:10px 14px; font-size:14px; margin:0; }
dialog#kutu .kapat { position:absolute; right:8px; top:8px; width:44px; height:44px; border-radius:50%; border:0; background:rgba(0,0,0,.6); color:#fff; font-size:26px; cursor:pointer; }
/* bilgisayarda alt banttaki QR'ın yanında tıklanır WhatsApp düğmesi */
@media screen and (min-width:861px) {
  .u-bant { grid-template-columns:auto 1fr auto auto; padding-right:calc(var(--kenar) + 16mm); }
  .u-bant .u-wa { display:flex; align-items:center; gap:8px; padding:0 16px; min-height:46px; border-radius:8px; background:var(--wa); color:#fff; font:700 14px Inter; } .u-bant .u-wa .ik { color:#fff; width:18px; height:18px; }
  .u-bant .u-tel b { font-size:15pt; }
}
@media screen and (max-width:860px) {
  body { padding-bottom:76px; }
  .page { scroll-margin-top:112px; }
  .w-pdf span { display:none; } .w-pdf { padding:9px; }
  .w-cubuk { display:grid; grid-template-columns:2.2fr 1fr; gap:8px; position:fixed; left:0; right:0; bottom:0; z-index:30; padding:10px 16px calc(10px + env(safe-area-inset-bottom)); background:rgba(255,255,255,.97); border-top:1px solid #E4DED3; }
  .w-cubuk a { display:flex; align-items:center; justify-content:center; gap:8px; min-height:50px; border-radius:10px; font:700 16px Inter; } .w-cubuk svg { width:20px; height:20px; }
  .w-wa { background:#13843F; color:#fff; } .w-ara { border:2px solid #1B1B1D; color:#1B1B1D; }
}
@media print { .w-ust, .w-gez, .w-cubuk, .w-son, dialog { display:none !important; } }
`;

html = html.replace('<style>', `<style>\n${FONT_CSS}\n`).replace('</style>', `${WEB_CSS}</style>`);
html = html.replace('<body>', `<body>\n${UST}`).replace('</body>', `${ALT}\n</body>`);
// telefonları tıklanır yap
html = html.replace(/<div class="u-tel"><b>([^<]+)<\/b>/g, '<div class="u-tel"><a href="tel:+905324803051"><b>$1</b></a>')
  .replace(/<div class="k-tel"><b>([^<]+)<\/b>/, '<div class="k-tel"><a href="tel:+905324803051"><b>$1</b></a>');
if (/file:\/\//.test(html)) throw new Error('file:// yolu kaldı');
writeFileSync(join(KAT, 'index.html'), html);

// 7) PDF'ler: A4 = yeni katalog; Telefon = aynı sayfanın telefon görünümü, tek uzun sayfa (metin seçilir, bağlantılar çalışır)
copyFileSync(join(BURASI, 'cikti/Ucel-Katalog-2026.pdf'), join(SITE, 'assets/katalog/Ucel-Tarim-Aletleri-Katalog-2026.pdf'));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await pg.goto(pathToFileURL(join(BURASI, 'cikti/katalog8/index.html')).href, { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
// Telefon PDF'i: telefon görünümünün ekran görüntüsü sayfalara bölünür, bağlantılar aynı yerlere tıklanır alan olarak eklenir
const linkler = await pg.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => { const r = a.getBoundingClientRect(); return { h: a.href, x: r.left, y: r.top + scrollY, w: r.width, hh: r.height }; }).filter((l) => l.w && l.hh));
const png = join(BURASI, 'cikti/katalog8/telefon-pdf.png');
await pg.screenshot({ path: png, fullPage: true });
await b.close();
const js = join(BURASI, 'cikti/katalog8/linkler.json');
writeFileSync(js, JSON.stringify(linkler));
execFileSync('python3', ['-I', '-c', `
import json, sys, io, pymupdf
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
im = Image.open(sys.argv[1]).convert('RGB'); L = json.load(open(sys.argv[2])); olcek = im.width / 390
H = 1400  # css px / sayfa
doc = pymupdf.open()
for y0 in range(0, round(im.height / olcek), H):
    y1 = min(round(im.height / olcek), y0 + H)
    parca = im.crop((0, round(y0 * olcek), im.width, round(y1 * olcek)))
    b = io.BytesIO(); parca.save(b, 'JPEG', quality=80)
    p = doc.new_page(width=390, height=y1 - y0)
    p.insert_image(p.rect, stream=b.getvalue())
    for l in L:
        if l['y'] >= y0 and l['y'] + l['hh'] <= y1:
            p.insert_link({'kind': pymupdf.LINK_URI, 'from': pymupdf.Rect(l['x'], l['y'] - y0, l['x'] + l['w'], l['y'] - y0 + l['hh']), 'uri': l['h']})
doc.save(sys.argv[3], garbage=3, deflate=True)
print('telefon pdf', len(doc), 'sayfa')
`, png, js, join(SITE, 'assets/katalog/Ucel-Tarim-Aletleri-Katalog-2026-Telefon.pdf')], { stdio: 'inherit' });
console.log('ok');
