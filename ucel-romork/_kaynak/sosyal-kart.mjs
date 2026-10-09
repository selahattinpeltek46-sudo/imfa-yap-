// Sosyal medya ürün kartları — katalogla aynı tasarım dili, aynı metin ve fotoğraflar.
//   1080×1350: Instagram / Facebook gönderi        → cikti/sosyal/dikey/<urun>.jpg
//   1080×1080: Marketplace ilanı, WhatsApp Business katalog → cikti/sosyal/kare/<urun>.jpg
// Ayrıca: genel "katalog" kartı (her iki boyut). Fiyat yazılmaz; fiyat için WhatsApp'a yönlendirir.
// Çalıştırma: node sosyal-kart.mjs   (önce dekupe.py / gorseller.py)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER } from './katalog2-veri.mjs';
import { URUN_METIN as U, SLOGAN, ALT_SLOGAN } from './katalog5-metin.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti', 'sosyal');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (x) => esc(x && typeof x === 'object' ? x.t : x);
const url = (p) => pathToFileURL(p).href;
const font = (p, d) => url(join(BURASI, 'node_modules', '@fontsource', p, d));
const YOL = { d: (a) => join(BURASI, 'cikti', 'dekupe', `${a}.jpg`), f: (a) => join(BURASI, 'cikti', 'pdf-gorsel', `${a}.jpg`) };

const KARTLAR = [
  ['romork', ['d', 'tarim-romorku-yesil-traktor']],
  ['kultivator', ['d', 'yayli-kultivator-kirmizi-2']],
  ['on-yukleyici', ['d', 'on-yukleyici-traktor']],
  ['pulluk', ['f', 'kulakli-pulluk']],
  ['gubre-serpme', ['f', 'romork-ve-gubre-serpme']],
  ['su-tankeri', ['d', 'su-tankeri-2']],
];

const kart = (id, [tur, a]) => {
  const u = U[id];
  const urun = URUNLER.find((x) => x.id === id);
  return `<section class="kart" data-ad="${id}">
    <header><img class="logo" src="${url(join(BURASI, 'marka', 'logo-mark.png'))}"><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div>${urun.imalat ? '<em>KENDİ İMALATIMIZ</em>' : ''}</header>
    <div class="foto ${tur === 'd' ? 'beyaz' : 'koyu'}"><img src="${url(YOL[tur](a))}"></div>
    <div class="yazi"><p class="kat">${t(u.kategori)}</p><h1>${esc(urun.ad)}</h1><p class="fayda">${t(u.fayda)}</p>
      <ul>${u.kullanim.slice(0, 3).map((k) => `<li>${t(k)}</li>`).join('')}</ul></div>
    <footer><div><b>Fiyat için WhatsApp'tan yazın</b><span>Göksun'dan Türkiye'ye gönderim</span></div><strong>${FIRMA.telefon}</strong></footer>
  </section>`;
};
const genel = `<section class="kart genel" data-ad="katalog">
  <header><img class="logo" src="${url(join(BURASI, 'marka', 'logo-mark.png'))}"><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div></header>
  <div class="g-ust"><p class="kat">Ürün Kataloğu 2026</p><h1>${t(SLOGAN)}</h1><p class="fayda">${t(ALT_SLOGAN)}</p></div>
  <div class="g-izgara">${KARTLAR.map(([, [tur, a]]) => `<div class="${tur === 'd' ? 'beyaz' : 'koyu'}"><img src="${url(YOL[tur](a))}"></div>`).join('')}</div>
  <footer><div><b>Tüm ürünler ve fiyat için</b><span>WhatsApp'tan yazın, kataloğu gönderelim</span></div><strong>${FIRMA.telefon}</strong></footer>
</section>`;

const css = (kare) => `
* { box-sizing: border-box; } body { margin: 0; font-family: 'Inter'; }
.kart { width: 1080px; height: ${kare ? 1080 : 1350}px; background: #F6F4F0; display: flex; flex-direction: column; overflow: hidden; position: relative; }
header { background: #1F2124; color: #fff; display: flex; align-items: center; gap: 20px; padding: 30px 48px; position: relative; overflow: hidden; }
header::after { content: ''; position: absolute; right: -40px; top: 0; bottom: 0; width: 110px; background: #C8102E; transform: skewX(-18deg); }
.logo { height: 66px; border-radius: 8px; } header b { display: block; font: 700 34px/1 'Oswald'; letter-spacing: 3px; } header span { font-size: 22px; color: #b7b2aa; }
header em { margin-left: auto; margin-right: 70px; font: 700 22px 'Inter'; font-style: normal; letter-spacing: 1.5px; background: #C8102E; padding: 10px 16px; border-radius: 6px; position: relative; z-index: 1; }
.foto { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; border-bottom: 10px solid #C8102E; }
.foto.beyaz { background: #fff; padding: 20px 40px; } .foto.koyu { background: #1F2124; }
.foto img { max-width: 100%; max-height: 100%; object-fit: contain; }
.yazi { padding: ${kare ? '26px 48px 22px' : '40px 48px 34px'}; }
.kat { margin: 0 0 8px; font: 700 24px 'Inter'; letter-spacing: 2px; text-transform: uppercase; color: #C8102E; }
h1 { margin: 0; font: 700 ${kare ? 74 : 92}px/1 'Oswald'; color: #1F2124; }
.fayda { margin: 14px 0 0; font: 500 ${kare ? 34 : 40}px/1.2 'Oswald'; color: #1F2124; }
ul { list-style: none; padding: 0; margin: ${kare ? 18 : 26}px 0 0; display: flex; flex-wrap: wrap; gap: 12px; }
li { font: 700 24px 'Inter'; background: #fff; border: 2px solid #E2DED8; border-radius: 99px; padding: 10px 20px; }
footer { background: #C8102E; color: #fff; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 30px 48px; }
footer b { display: block; font: 700 34px/1.1 'Oswald'; } footer span { font-size: 22px; opacity: .92; } footer strong { font: 700 52px/1 'Oswald'; white-space: nowrap; }
.genel .g-ust { padding: 40px 48px 20px; } .genel h1 { font-size: ${kare ? 70 : 76}px; }
.g-izgara { flex: 1; min-height: 0; display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 12px; padding: 12px 48px 36px; }
.g-izgara div { border-radius: 12px; overflow: hidden; display: flex; align-items: center; justify-content: center; border-bottom: 6px solid #C8102E; }
.g-izgara .beyaz { background: #fff; padding: 10px; } .g-izgara .koyu { background: #1F2124; }
.g-izgara img { max-width: 100%; max-height: 100%; object-fit: contain; }
.genel ul { display: none; }
`;

mkdirSync(CIKTI, { recursive: true });
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
for (const [klasor, kare] of [['dikey', false], ['kare', true]]) {
  mkdirSync(join(CIKTI, klasor), { recursive: true });
  const dosya = join(CIKTI, `${klasor}.html`);
  writeFileSync(dosya, `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">${['oswald/500.css', 'oswald/700.css', 'inter/400.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('')}<style>${css(kare)}</style></head><body>${genel}${KARTLAR.map(([id, g]) => kart(id, g)).join('')}</body></html>`);
  const s = await tarayici.newPage({ viewport: { width: 1080, height: kare ? 1080 : 1350 } });
  await s.goto(url(dosya), { waitUntil: 'networkidle' });
  await s.evaluate(() => document.fonts.ready);
  const tasan = await s.evaluate(() => [...document.querySelectorAll('.kart')].filter((k) => k.querySelector('.yazi, .g-ust') && [...k.children].reduce((a, c) => a + c.getBoundingClientRect().height, 0) > k.getBoundingClientRect().height + 2).map((k) => k.dataset.ad));
  if (tasan.length) console.warn(`UYARI (${klasor}) taşan kart:`, tasan.join(', '));
  for (const el of await s.$$('.kart')) await el.screenshot({ path: join(CIKTI, klasor, `${await el.getAttribute('data-ad')}.jpg`), type: 'jpeg', quality: 88 });
  await s.close();
}
await tarayici.close();
console.log('yazıldı: cikti/sosyal/dikey ve cikti/sosyal/kare ·', KARTLAR.length + 1, 'kart');
