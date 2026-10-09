// Üçel — telefon öncelikli WEB katalog (Instagram / Facebook / TikTok / Marketplace'ten gelenler için)
// PDF, uygulama içi tarayıcılarda güvenilir açılmadığı için asıl paylaşım bağlantısı bu sayfadır.
// Metin: katalog5-metin.mjs · Teknik: teknik-veri.mjs · Fiyat: fiyat-veri.mjs (boşsa fiyat gösterilmez)
//
// Çalıştırma: node web-katalog.mjs [hedef-klasör]
//   varsayılan hedef: cikti/web-katalog  (siteye: ucel-tarim-aletleri/katalog/ olarak kopyalanır)
// Kaynak etiketi: sayfa ?k=instagram gibi açılırsa WhatsApp mesajı "(Instagram)" ile başlar.
import { writeFileSync, readFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER, SAHADAN } from './katalog2-veri.mjs';
import { TEKNIK } from './teknik-veri.mjs';
import { FIYAT, fiyatVar } from './fiyat-veri.mjs';
import { SAYFALAR as P, URUN_METIN as U, SECIM_KUTUSU, SLOGAN, ALT_SLOGAN } from './katalog5-metin.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const HEDEF = resolve(process.argv[2] || join(BURASI, 'cikti', 'web-katalog'));
const ADRES = FIRMA.site + 'katalog/';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (x) => esc(x && typeof x === 'object' ? x.t : x);
const dolu = (v) => v !== null && v !== undefined && v !== '';
const ad = (id) => URUNLER.find((u) => u.id === id).ad;
const imalat = (id) => URUNLER.find((u) => u.id === id).imalat;
const TEL = '+90' + FIRMA.telefon.replace(/\D/g, '').replace(/^0/, '');

// kategori sırası: taşıma → toprak işleme → yükleme → gübreleme → su; "Ne yapmak istiyorsunuz?" listesi de bu sırayı izler
const KISA = { 'kultivator': 'Kültivatör', 'gubre-serpme': 'Gübre Serpme', romork: 'Römork' };
const SIRA = ['romork', 'kultivator', 'pulluk', 'on-yukleyici', 'gubre-serpme', 'su-tankeri'];
// [tür, dosya] — d: beyaz zeminli ürün (cikti/dekupe), f: gerçek fotoğraf (cikti/pdf-gorsel), e: foto-ek
const GORSEL = {
  romork: { ana: ['d', 'tarim-romorku-yesil-traktor'], ek: [['f', 'tarim-romorku-mavi', 'Mavi kasa'], ['f', 'tarim-romorku-yesil-teslimat', 'Teslimatta']] },
  kultivator: { ana: ['d', 'yayli-kultivator-kirmizi-2'], ek: [['d', 'yayli-kultivator-mavi-2', 'Mavi renkte'], ['e', 'kultivator-mavi-saha', 'Mavi Göksun kültivatör']] },
  'on-yukleyici': { ana: ['d', 'on-yukleyici-traktor'], ek: [['f', 'on-yukleyici-atolye', 'Atölyemizin önünde'], ['f', 'on-yukleyici-kubota', 'Kubota traktöre montaj']] },
  pulluk: { ana: ['f', 'kulakli-pulluk'], ek: [] },
  'gubre-serpme': { ana: ['f', 'romork-ve-gubre-serpme'], ek: [] },
  'su-tankeri': { ana: ['d', 'su-tankeri-2'], ek: [] },
};
const ALANLAR = {
  romork: ['Taşıma kapasitesi', 'Kasa iç ölçüsü (U × G × Y)', 'Dingil sayısı', 'Lastik ebadı', 'Damper', 'Gereken traktör gücü'],
  kultivator: ['Ayak sayısı', 'Çalışma genişliği', 'Ağırlık', 'Bağlantı tipi', 'Gereken traktör gücü'],
  'on-yukleyici': ['Kaldırma kapasitesi', 'Maksimum kaldırma yüksekliği', 'Kova genişliği', 'Ağırlık (kova dahil)', 'Uygun traktör gücü'],
  pulluk: ['Gövde sayısı', 'Toplam çalışma genişliği', 'Ağırlık', 'Bağlantı tipi', 'Gereken traktör gücü'],
  'gubre-serpme': ['Gübre kapasitesi', 'Serpme genişliği', 'Tahrik', 'Gereken traktör gücü'],
  'su-tankeri': ['Su kapasitesi', 'Tank malzemesi', 'Dingil sayısı', 'Pompa', 'Gereken traktör gücü'],
};

// ---------- görseller ----------
const YOL = {
  d: (a) => join(BURASI, 'cikti', 'dekupe', `${a}.jpg`),
  f: (a) => join(BURASI, 'cikti', 'pdf-gorsel', `${a}.jpg`),
  e: (a) => join(BURASI, 'foto-ek', `${a}.jpg`),
};
const istek = new Map();
const img = ([tur, a], uzun = 900) => {
  const ad_ = `${a}-${uzun}.webp`;
  istek.set(ad_, [YOL[tur](a), join(HEDEF, 'img', ad_), uzun]);
  return `img/${ad_}`;
};

// ---------- fontlar ----------
const FONTLAR = [];
for (const [aile, paket, agirlik] of [['Oswald', 'oswald', 500], ['Oswald', 'oswald', 700], ['Inter', 'inter', 400], ['Inter', 'inter', 700]]) {
  const css = readFileSync(join(BURASI, 'node_modules', '@fontsource', paket, `${agirlik}.css`), 'utf8');
  for (const alt of ['latin-ext', 'latin']) {
    const blok = css.split('/* ').find((x) => x.startsWith(`${paket}-${alt}-${agirlik}-normal */`));
    const aralik = blok.match(/unicode-range:\s*([^;]+);/)[1];
    const dosya = `${paket}-${alt}-${agirlik}.woff2`;
    FONTLAR.push({ kaynak: join(BURASI, 'node_modules', '@fontsource', paket, 'files', `${paket}-${alt}-${agirlik}-normal.woff2`), dosya, css: `@font-face { font-family: '${aile}'; font-weight: ${agirlik}; font-display: swap; src: url(font/${dosya}) format('woff2'); unicode-range: ${aralik}; }` });
  }
}
const FONT_CSS = FONTLAR.map((f) => f.css).join('\n');

// ---------- parçalar ----------
const ikon = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>',
  tel: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>',
  tik: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11z"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  kamyon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="17.5" r="1.8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17" cy="17.5" r="1.8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  parca: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/></svg>',
  takas: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 2h8l5 5v15H6z M14 2v5h5 M9 14h6 M9 18h6"/></svg>',
};
// WhatsApp butonu: mesaj data-msg'de; sayfa betiği kaynak etiketini ekleyip href'i kurar
const waBtn = (mesaj, yazi, sinif = '') => `<a class="btn wa ${sinif}" data-msg="${esc(mesaj)}" href="https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(mesaj)}" target="_blank" rel="noopener">${ikon.wa}<span>${esc(yazi)}</span></a>`;
const telBtn = (yazi = 'Ara', sinif = '') => `<a class="btn tel ${sinif}" href="tel:${TEL}">${ikon.tel}<span>${esc(yazi)}</span></a>`;

function teknik(id) {
  const ms = (TEKNIK[id].modeller || []).filter((m) => dolu(m.Model));
  if (!ms.length) return '';
  const sat = ALANLAR[id].map((a) => TEKNIK[id].teknik.find(([x]) => x === a)).filter(Boolean).filter(([a]) => ms.some((m) => dolu(m[a])));
  return `<div class="tablo-kap"><table><thead><tr><th>Model</th>${sat.map(([a, b]) => `<th>${esc(a)}${b && !b.includes(',') && !b.includes('/') && b !== 'adet' ? ` <small>${esc(b)}</small>` : ''}</th>`).join('')}</tr></thead><tbody>${ms.map((m) => `<tr><th>${esc(m.Model)}</th>${sat.map(([a]) => `<td>${dolu(m[a]) ? esc(m[a]) : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function fiyat(id) {
  if (!fiyatVar(id)) return '';
  return `<div class="fiyat"><b>Fiyat <small>${esc(FIYAT.guncelleme)}${FIYAT.not ? ' · ' + esc(FIYAT.not) : ''}</small></b><ul>${FIYAT.urunler[id].map(([m, f]) => `<li><span>${esc(m)}</span><strong>${esc(f)}</strong></li>`).join('')}</ul></div>`;
}

// Ürüne özgü avantajlar: neden + seçenekler, aynı kökle başlayan madde bir kez (ör. "Kasa rengi…" / "Kasaya isim…").
// Genel firma bilgisi ("Sattığımız … yedek parça") ürün kartında tekrarlanmaz; "Teslimat ve destek" bandında bir kez yazar.
const avantajlar = (u) => {
  const kok = (x) => x.t.toLocaleLowerCase('tr').slice(0, 4);
  const gor = new Set();
  return [...u.neden, ...(u.secenekler || [])]
    .filter((x) => !/^Sattığımız/.test(x.t))
    .filter((x) => !(imalat(u.id) && /atölye/i.test(x.t)))
    .filter((x) => (gor.has(kok(x)) ? false : gor.add(kok(x))));
};

function urunKart(id) {
  const u = { ...U[id], id };
  const g = GORSEL[id];
  const [tur] = g.ana;
  return `<article class="urun" id="${id}">
    <div class="u-foto ${tur === 'd' ? 'beyaz' : 'koyu'}">${tur === 'd' ? '' : `<img class="arka" src="${img(g.ana, 1000)}" alt="" aria-hidden="true" loading="lazy">`}<img src="${img(g.ana, 1000)}" alt="${esc(ad(id))}" loading="lazy" width="1000" height="700">${imalat(id) ? '<p class="rozet">Kendi imalatımız · Göksun</p>' : ''}</div>
    <div class="u-ic">
      <p class="etk">${t(u.kategori)}</p>
      <h2>${esc(ad(id))}</h2>
      <p class="fayda">${t(u.fayda)}</p>
      <p>${t(u.tanim)}</p>
      <ul class="cips">${u.kullanim.map((k) => `<li>${t(k)}</li>`).join('')}</ul>
      <p class="kimler"><b>Kimler için?</b> ${t(u.kimler)}</p>
      ${fiyat(id)}
      ${teknik(id)}
      ${avantajlar(u).length ? `<div class="avantaj"><p class="ara">${imalat(id) ? 'Üçel imalat avantajları' : 'Neden Üçel?'}</p><ul>${avantajlar(u).map((x) => `<li>${ikon.tik}${t(x)}</li>`).join('')}</ul></div>` : ''}
      ${g.ek.length ? `<div class="ek-foto">${g.ek.map(([tr, a, y]) => `<figure><button type="button" class="buyut" data-buyuk="${img([tr, a], 1400)}" aria-label="Büyüt: ${esc(y)}"><img src="${img([tr, a], 600)}" alt="${esc(y)}" loading="lazy"></button><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div>` : ''}
      <p class="cta-yazi">${t(u.cta)}</p>
      <div class="butonlar">${waBtn(u.wa, 'Fiyat ve bilgi al')}${telBtn()}</div>
    </div>
  </article>`;
}

// "Ne yapmak istiyorsunuz?" satırları ve içindeki ürünler, sayfadaki ürün kartı sırasıyla
const isSirali = () => {
  const sira = (i) => (i === '_diger' ? 90 : i === '_takas' ? 91 : SIRA.indexOf(i));
  return P.secim.isler.map(([is, ids]) => [is, [...ids].sort((a, b) => sira(a) - sira(b))]).sort((a, b) => sira(a[1][0]) - sira(b[1][0]));
};

const SAYI = ['sıfır', 'bir', 'iki', 'üç', 'dört', 'beş'];
function html() {
  const N = P.neden;
  const nedenler = N.maddeler.filter((x) => !['destek', 'kamyon'].includes(x.ikon));
  const nedenBaslik = t(N.baslik).replace('beş', SAYI[nedenler.length]);
  const kapak = img(['d', 'yayli-kultivator-kirmizi-2'], 1000);
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Ürün Kataloğu 2026 · Üçel Tarım Aletleri, Göksun</title>
<meta name="description" content="Römork, kültivatör, loader kepçe, pulluk, gübre serpme ve su tankeri. Göksun'da üretiyoruz, Türkiye'ye gönderiyoruz. WhatsApp: ${FIRMA.telefon}">
<meta name="theme-color" content="#1F2124">
<link rel="canonical" href="${ADRES}">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="Üçel Tarım Aletleri">
<meta property="og:title" content="Üçel Tarım Aletleri · Ürün Kataloğu 2026">
<meta property="og:description" content="Römork, kültivatör, loader kepçe ve daha fazlası. Göksun'da üretiyoruz. Fiyat ve uygun model için WhatsApp'tan yazın.">
<meta property="og:url" content="${ADRES}">
<meta property="og:image" content="${ADRES}img/paylasim.jpg">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="../assets/icon.svg" type="image/svg+xml">
<link rel="preload" href="font/oswald-latin-700.woff2" as="font" type="font/woff2" crossorigin>
<style>
${FONT_CSS}
:root { --k:#C8102E; --ki:#F0626B; --d:#1F2124; --z:#F6F4F0; --c:#E2DED8; --g:#5F5B55; --wa:#13843F; }
* { box-sizing: border-box; } html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { margin: 0; font: 400 17px/1.55 'Inter', system-ui, sans-serif; color: var(--d); background: #E9E6E1; padding-bottom: 76px; }
img { display: block; max-width: 100%; height: auto; } a { color: inherit; }
h1, h2, h3 { font-family: 'Oswald', sans-serif; margin: 0; line-height: 1.1; }
p { margin: 0 0 .7em; }
.sayfa { max-width: 600px; margin: 0 auto; background: var(--z); min-height: 100vh; }
section, .urun { scroll-margin-top: 8px; }
/* üst */
.ust { background: var(--d); color: #fff; padding: 18px 18px 22px; position: relative; overflow: hidden; }
.ust::after { content: ''; position: absolute; right: -56px; top: 0; bottom: 0; width: 104px; background: var(--k); transform: skewX(-18deg); }
.marka { display: flex; align-items: center; gap: 12px; position: relative; z-index: 1; }
.marka img { width: 64px; border-radius: 6px; }
.marka b { display: block; font: 700 18px/1.1 'Oswald'; letter-spacing: 1.5px; }
.marka span { font-size: 14px; color: #b7b2aa; letter-spacing: .5px; }
.ust .etk { color: var(--ki); margin-top: 20px; }
.ust h1 { font-size: 36px; position: relative; z-index: 1; }
.ust .alt { color: #CFCAC2; margin: 8px 0 0; position: relative; z-index: 1; }
.kapak-foto { background: #fff; padding: 12px 16px; border-bottom: 5px solid var(--k); }
.ust-buton { display: grid; grid-template-columns: 1.6fr 1fr; gap: 10px; padding: 14px 16px; background: var(--d); }
/* buton */
.btn { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 56px; padding: 8px 16px; border-radius: 10px; font: 700 16px/1.2 'Inter'; text-decoration: none; text-align: center; }
.btn svg { width: 24px; height: 24px; flex: none; }
.btn.wa { background: var(--wa); color: #fff; box-shadow: 0 3px 0 #0B5A2A; font-size: 17px; } .btn.tel { background: var(--d); color: #fff; } .btn.acik { background: #fff; color: var(--d); border: 2px solid var(--c); }
/* hızlı ürün gezinme: sayfanın üstüne yapışır, yatay kaydırılır */
.urun-nav { position: sticky; top: 0; z-index: 8; display: flex; gap: 8px; overflow-x: auto; padding: 10px 12px; background: rgba(246,244,240,.97); border-bottom: 1px solid var(--c); scrollbar-width: none; }
.urun-nav::-webkit-scrollbar { display: none; }
.urun-nav a.aktif { background: var(--d); color: #fff; border-color: var(--d); }
.urun-nav a { flex: none; font: 700 15px/1 'Inter'; color: var(--d); text-decoration: none; background: #fff; border: 1px solid var(--c); border-radius: 99px; padding: 13px 14px; }
section, .urun { scroll-margin-top: 64px; }
/* bölüm */
.blok { padding: 26px 16px; }
.blok > h2 { font-size: 28px; margin-bottom: 6px; }
.etk { font: 700 14px/1.2 'Inter'; letter-spacing: 1.4px; text-transform: uppercase; color: var(--k); margin: 0 0 6px; }
.etk span { color: var(--d); }
.aciklama { color: var(--g); }
/* iş seçimi */
.isler { display: grid; gap: 8px; margin-top: 12px; }
.isler .is { display: flex; justify-content: space-between; align-items: center; gap: 10px; background: #fff; border-radius: 10px; padding: 10px 12px 10px 14px; border-left: 5px solid var(--k); }
.isler b { font: 500 18px/1.2 'Oswald'; } .isler span { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.isler a { font-size: 15px; color: var(--k); font-weight: 700; text-decoration: none; padding: 6px 0; text-align: right; }
/* ürün */
.urun { background: #fff; margin: 0 0 18px; border-top: 6px solid var(--k); }
.u-foto { aspect-ratio: 10 / 7; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.u-foto.beyaz { background: #fff; padding: 10px; } .u-foto.koyu { background: var(--d); }
.u-foto img { width: 100%; height: 100%; object-fit: contain; position: relative; }
.u-foto img.arka { position: absolute; inset: 0; object-fit: cover; filter: blur(22px) brightness(.7); transform: scale(1.2); }
.u-foto .rozet { position: absolute; left: 12px; bottom: 12px; margin: 0; z-index: 1; box-shadow: 0 2px 8px rgba(0,0,0,.25); }
.u-ic { padding: 18px 16px 20px; }
.u-ic h2 { font-size: 32px; margin-bottom: 8px; }
.fayda { font: 500 21px/1.3 'Oswald'; }
.cips { list-style: none; padding: 0; margin: 4px 0 14px; display: flex; flex-wrap: wrap; gap: 8px; }
.cips li { background: var(--z); border: 1px solid var(--c); border-radius: 99px; padding: 6px 12px; font-size: 15px; font-weight: 700; }
.kimler { background: #f4f6f4; border-left: 4px solid #2e7d32; padding: 10px 12px; margin: 10px 0; border-radius: 4px; font-size: 16px; }
.kimler b { color: #2e7d32; }
.fiyat { border: 2px solid var(--d); border-radius: 10px; padding: 12px 14px; margin: 14px 0; }
.fiyat b { display: block; font: 700 19px/1.2 'Oswald'; margin-bottom: 4px; } .fiyat b small { font: 400 13px 'Inter'; color: var(--g); }
.fiyat.bos { border: 0; border-left: 4px solid #2e7d32; border-radius: 4px; background: #f4f6f4; padding: 10px 12px; margin: 10px 0; } .fiyat.bos span { font-size: 15px; }
.fiyat ul { list-style: none; margin: 0; padding: 0; } .fiyat li { display: flex; justify-content: space-between; gap: 10px; padding: 6px 0; border-top: 1px solid var(--c); }
.fiyat strong { color: var(--k); white-space: nowrap; }
.tablo-kap { overflow-x: auto; margin: 0 0 14px; } table { border-collapse: collapse; font-size: 15px; min-width: 100%; }
th, td { padding: 8px 10px; border-bottom: 1px solid var(--c); text-align: left; white-space: nowrap; } thead th { background: var(--d); color: #fff; } thead th:last-child { background: var(--k); } th small { font-weight: 400; opacity: .8; }
details { border-top: 1px solid var(--c); border-bottom: 1px solid var(--c); margin: 14px 0; }
summary { cursor: pointer; padding: 13px 0; font: 700 16px 'Inter'; list-style: none; display: flex; justify-content: space-between; }
summary::after { content: '+'; color: var(--k); font-size: 22px; line-height: 1; } details[open] summary::after { content: '–'; }
.rozet { display: inline-block; margin: 0 0 8px; font: 700 14px/1 'Inter'; letter-spacing: .6px; text-transform: uppercase; color: #fff; background: var(--k); padding: 7px 10px; border-radius: 6px; }
.avantaj { background: #fff; border: 2px solid var(--c); border-radius: 10px; padding: 12px 14px 6px; margin: 14px 0; }
.avantaj ul { list-style: none; padding: 0; margin: 0; } .avantaj li { display: flex; gap: 10px; padding: 6px 0; font-size: 16px; font-weight: 700; border-top: 1px solid var(--z); }
.avantaj li:first-child { border-top: 0; } .avantaj svg { width: 22px; height: 22px; flex: none; color: #fff; background: var(--k); border-radius: 50%; padding: 3px; }
.destek ul { list-style: none; padding: 0; margin: 12px 0 0; display: grid; gap: 10px; }
.destek li { display: flex; gap: 12px; align-items: flex-start; background: #fff; border-radius: 10px; padding: 12px 14px; }
.sss-link { margin: 12px 0 0; } .sss-link a { font-weight: 700; color: var(--k); text-decoration: none; display: inline-block; padding: 6px 0; }
.destek li svg { width: 28px; height: 28px; flex: none; color: var(--k); } .destek b { display: block; font: 500 18px/1.2 'Oswald'; } .destek span { font-size: 15px; color: var(--g); }
button.buyut { all: unset; display: block; cursor: zoom-in; width: 100%; }
dialog#kutu { border: 0; padding: 0; background: transparent; max-width: 96vw; max-height: 92vh; }
dialog#kutu::backdrop { background: rgba(0,0,0,.88); }
dialog#kutu img { max-width: 96vw; max-height: 80vh; border-radius: 8px; margin: 0 auto; }
dialog#kutu p { color: #fff; font-size: 15px; text-align: center; margin: 10px 0 0; }
dialog#kutu .kapat { position: fixed; top: 12px; right: 12px; width: 48px; height: 48px; border-radius: 50%; border: 0; background: #fff; color: var(--d); font-size: 30px; line-height: 1; cursor: pointer; }
.tikli { list-style: none; padding: 0; margin: 0 0 12px; } .tikli li { display: flex; gap: 8px; padding: 4px 0; font-size: 16px; } .tikli svg { width: 20px; height: 20px; color: var(--k); flex: none; margin-top: 2px; }
.ara { font: 700 14px 'Inter'; letter-spacing: 1px; text-transform: uppercase; color: var(--k); margin: 6px 0 4px; }
.ek-foto { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; } .ek-foto figure { margin: 0; } .ek-foto img { border-radius: 8px; aspect-ratio: 4 / 3; object-fit: cover; width: 100%; } .ek-foto figcaption { font-size: 14px; color: var(--g); margin-top: 4px; }
.cta-yazi { font: 500 19px/1.3 'Oswald'; color: var(--k); margin: 6px 0 12px; }
.butonlar { display: grid; grid-template-columns: 1.7fr 1fr; gap: 10px; }
/* neden */
.neden { display: grid; gap: 10px; margin-top: 12px; }
.neden div { background: #fff; border-radius: 10px; padding: 14px; } .neden h3 { font-size: 20px; margin-bottom: 4px; } .neden p { font-size: 16px; margin: 0; } .neden .kanit { color: var(--k); font-weight: 700; font-size: 15px; margin-top: 6px; }
/* diğer, takas, sss */
.kart { background: #fff; border-radius: 10px; padding: 14px; margin-top: 10px; border-left: 5px solid var(--k); } .kart h3 { font-size: 20px; margin-bottom: 4px; } .kart p { margin: 0; font-size: 16px; }
.adim { list-style: none; padding: 0; margin: 12px 0; display: grid; gap: 8px; counter-reset: a; }
.adim li { counter-increment: a; display: flex; align-items: center; gap: 12px; background: #fff; border-radius: 10px; padding: 12px; font-weight: 700; }
.adim li::before { content: counter(a); width: 34px; height: 34px; flex: none; border-radius: 50%; background: var(--k); color: #fff; display: grid; place-items: center; font: 700 18px 'Oswald'; }
.not { font-size: 15px; color: var(--g); }
.sss details { background: #fff; border: 0; border-radius: 10px; padding: 0 14px; margin: 8px 0; } .sss summary { font-size: 16px; gap: 10px; } .sss details p { font-size: 16px; padding-bottom: 12px; margin: 0; }
.saha { display: flex; gap: 10px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; margin-top: 12px; }
.saha figure { flex: 0 0 78%; margin: 0; scroll-snap-align: start; } .saha img { border-radius: 10px; aspect-ratio: 4 / 3; object-fit: cover; width: 100%; } .saha figcaption { font-size: 14px; color: var(--g); margin-top: 6px; }
/* iletişim */
.iletisim { background: var(--d); color: #fff; } .iletisim .etk { color: var(--ki); }
.iletisim .num { display: block; font: 700 38px/1 'Oswald'; color: #fff; text-decoration: none; margin: 10px 0 14px; }
.iletisim dl { margin: 0 0 16px; } .iletisim dt { font-size: 13px; letter-spacing: 1px; text-transform: uppercase; color: #a3a19c; margin-top: 10px; } .iletisim dd { margin: 2px 0 0; }
.linkler { display: grid; gap: 10px; }
.alt-bilgi { padding: 18px 16px 26px; font-size: 14px; color: var(--g); text-align: center; }
/* sabit alt çubuk */
.cubuk { position: fixed; left: 0; right: 0; bottom: 0; z-index: 9; display: flex; justify-content: center; background: rgba(31,33,36,.96); padding: 10px 12px calc(10px + env(safe-area-inset-bottom)); }
.cubuk div { display: grid; grid-template-columns: 1.7fr 1fr; gap: 10px; width: 100%; max-width: 576px; }
.cubuk .btn { min-height: 50px; }
.cubuk { transition: transform .25s ease; } .cubuk.gizli { transform: translateY(110%); }
@media (min-width: 640px) { body { padding-top: 24px; } .sayfa { border-radius: 14px; overflow: hidden; box-shadow: 0 6px 30px rgba(0,0,0,.12); } }
</style>
</head>
<body>
<div class="sayfa">
<header class="ust">
  <div class="marka"><img src="img/logo.webp" alt="Üçel logosu" width="64" height="26"><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div></div>
  <p class="etk">${t(P.kapak.ust)}</p>
  <h1>${t(SLOGAN)}</h1>
  <p class="alt">${t(ALT_SLOGAN)}</p>
</header>
<div class="kapak-foto"><img src="${kapak}" alt="Göksun yaylı kültivatör" width="1000" height="700"></div>
<div class="ust-buton">${waBtn(P.iletisim.wa, 'WhatsApp\'tan yaz')}${telBtn()}</div>

<nav class="urun-nav" aria-label="Ürünler">${SIRA.map((id) => `<a href="#${id}">${esc(KISA[id] || ad(id))}</a>`).join('')}<a href="#diger">Diğer</a><a href="#takas">Takas</a><a href="#sss">Sorular</a><a href="#iletisim">İletişim</a></nav>

<section class="blok" id="sec">
  <p class="etk">${t(P.secim.etiket)}</p>
  <h2>${t(P.secim.baslik)}</h2>
  <p class="aciklama">${t(P.secim.alt)}</p>
  <div class="isler">${isSirali().map(([is, ids]) => `<div class="is"><b>${t(is)}</b><span>${ids.map((i) => `<a href="#${i === '_diger' ? 'diger' : i === '_takas' ? 'takas' : i}">${i === '_diger' ? 'Mibzer' : i === '_takas' ? 'İkinci el & takas' : esc(ad(i))} →</a>`).join('')}</span></div>`).join('')}</div>
</section>

<section class="blok destek" id="destek">
  <p class="etk">Teslimat ve destek</p>
  <h2>Göksun'dan Türkiye'ye</h2>
  <ul>
    <li>${ikon.wa}<div><b>${t(SECIM_KUTUSU.baslik)}</b><span>WhatsApp'tan traktörünüzü (marka / model), beygir gücünü ve yapacağınız işi yazın. ${t(SECIM_KUTUSU.sonuc)}</span></div></li>
    <li>${ikon.kamyon}<div><b>Türkiye geneline gönderim</b><span>Şehrinizi yazın, nakliye seçeneğini birlikte belirleyelim.</span></div></li>
    <li>${ikon.pin}<div><b>Göksun ve çevresine yerinde</b><span>Atölyemize gelip ürünleri yerinde inceleyebilirsiniz.</span></div></li>
    <li>${ikon.parca}<div><b>Yedek parça</b><span>Ürettiğimiz ve sattığımız ürünler için.</span></div></li>
    <li>${ikon.takas}<div><b>İkinci el ve takas</b><span>Eski makinenizi değerlendiriyoruz.</span></div></li>
  </ul>
  <p class="sss-link"><a href="#sss">Nakliye, garanti ve bakım soruları →</a></p>
</section>

${SIRA.map(urunKart).join('\n')}

<section class="blok" id="diger">
  <p class="etk">${t(P.diger.etiket)}</p>
  <h2>${t(P.diger.baslik)}</h2>
  ${P.diger.urunler.map(([b, x]) => `<div class="kart"><h3>${t(b)}</h3><p>${t(x)}</p></div>`).join('')}
  <p class="cta-yazi" style="margin-top:16px">${t(P.diger.cta)}</p>
  ${waBtn(P.diger.wa, 'Aradığımı yazayım')}
</section>

<section class="blok" id="neden">
  <p class="etk">${t(N.etiket)}</p>
  <h2>${nedenBaslik}</h2>
  <div class="neden">${nedenler.map((x) => `<div><h3>${t(x.baslik)}</h3><p>${t(x.metin)}</p>${x.kanit ? `<p class="kanit">${t(x.kanit)}</p>` : ''}</div>`).join('')}</div>
</section>

<section class="blok" id="takas">
  <p class="etk">${t(P.takas.etiket)}</p>
  <h2>${t(P.takas.baslik)}</h2>
  <p>${t(P.takas.alt)}</p>
  <ol class="adim">${P.takas.adimlar.map((x) => `<li>${t(x)}</li>`).join('')}</ol>
  <p class="not">${t(P.takas.durust)}</p>
  ${waBtn(P.takas.wa, 'Fotoğrafını gönder')}
</section>

<section class="blok" id="sahadan">
  <p class="etk">${t(P.sahadan.etiket)}</p>
  <h2>${t(P.sahadan.baslik)}</h2>
  <p class="aciklama">Büyütmek için fotoğrafa dokunun.</p>
  <div class="saha">${SAHADAN.map(([f, y]) => `<figure><button type="button" class="buyut" data-buyuk="${img(['f', f], 1400)}" aria-label="Büyüt: ${esc(y)}"><img src="${img(['f', f], 700)}" alt="${esc(y)}" loading="lazy"></button><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div>
</section>

<section class="blok sss" id="sss">
  <p class="etk">${t(P.sss.etiket)}</p>
  <h2>${t(P.sss.baslik)}</h2>
  ${P.sss.sorular.map(([s, c]) => `<details><summary>${t(s)}</summary><p>${t(c)}</p></details>`).join('')}
</section>

<section class="blok iletisim" id="iletisim">
  <p class="etk">İletişim</p>
  <h2>${t(P.iletisim.baslik)}</h2>
  <a class="num" href="tel:${TEL}">${FIRMA.telefon}</a>
  <dl><dt>Adres</dt><dd>${esc(FIRMA.adres1)}, ${esc(FIRMA.adres2)}</dd><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></dl>
  <div class="linkler">
    ${waBtn(P.iletisim.wa, 'WhatsApp\'tan yazın')}
    <a class="btn acik" href="${esc(FIRMA.harita)}" target="_blank" rel="noopener">${ikon.pin}<span>Konum ve yol tarifi</span></a>
    <a class="btn acik" href="../assets/katalog/Ucel-Tarim-Aletleri-Katalog-2026-Telefon.pdf">${ikon.pdf}<span>Kataloğu PDF olarak indir</span></a>
  </div>
</section>
<p class="alt-bilgi">© 2026 ${esc(FIRMA.ad)} · <a href="../">Web sitemiz</a></p>
</div>

<dialog id="kutu" aria-label="Fotoğraf"><form method="dialog"><button class="kapat" aria-label="Kapat">×</button></form><img alt=""><p></p></dialog>

<nav class="cubuk gizli" aria-label="Hızlı iletişim"><div>${waBtn(P.iletisim.wa, 'WhatsApp\'tan yaz')}${telBtn()}</div></nav>

<script>
// Alt çubuk: üstteki WhatsApp / Ara butonları ekrandan çıkınca görünür (aynı butonlar iki kez görünmesin)
(function () {
  var ust = document.querySelector('.ust-buton'), cubuk = document.querySelector('.cubuk');
  if (!ust || !('IntersectionObserver' in window)) { cubuk.classList.remove('gizli'); return; }
  new IntersectionObserver(function (e) { cubuk.classList.toggle('gizli', e[0].isIntersecting); }).observe(ust);
})();
// Gezinme: ekrandaki ürün / bölümün düğmesi koyulaşır ve çubukta görünür kalır
(function () {
  var nav = document.querySelector('.urun-nav');
  if (!nav || !('IntersectionObserver' in window)) return;
  var dugme = {};
  nav.querySelectorAll('a').forEach(function (a) { dugme[a.getAttribute('href').slice(1)] = a; });
  var gozcu = new IntersectionObserver(function (e) {
    e.forEach(function (x) {
      if (!x.isIntersecting) return;
      nav.querySelectorAll('a.aktif').forEach(function (a) { a.classList.remove('aktif'); });
      var a = dugme[x.target.id];
      a.classList.add('aktif');
      nav.scrollTo({ left: a.offsetLeft - 12, behavior: 'smooth' });
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  Object.keys(dugme).forEach(function (id) { var el = document.getElementById(id); if (el) gozcu.observe(el); });
})();
// Fotoğraf büyütme
(function () {
  var d = document.getElementById('kutu');
  if (!d || !d.showModal) return;
  document.querySelectorAll('button.buyut').forEach(function (b) {
    b.addEventListener('click', function () {
      d.querySelector('img').src = b.getAttribute('data-buyuk');
      d.querySelector('img').alt = b.querySelector('img').alt;
      d.querySelector('p').textContent = b.querySelector('img').alt;
      d.showModal();
    });
  });
  d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
})();
// Kaynak etiketi: ?k=instagram → WhatsApp mesajı "(Instagram)" ile başlar; oturum boyunca hatırlanır.
(function () {
  var ADLAR = { instagram: 'Instagram', ig: 'Instagram', facebook: 'Facebook', fb: 'Facebook', marketplace: 'Marketplace', mp: 'Marketplace', tiktok: 'TikTok', tt: 'TikTok', whatsapp: 'WhatsApp', wa: 'WhatsApp', qr: 'QR', site: 'Site' };
  var k = null;
  try { k = new URLSearchParams(location.search).get('k'); if (k) sessionStorage.setItem('k', k); else k = sessionStorage.getItem('k'); } catch (e) {}
  var ad = k && ADLAR[k.toLowerCase()];
  if (!ad) return;
  document.querySelectorAll('a[data-msg]').forEach(function (a) {
    a.href = 'https://wa.me/${FIRMA.whatsapp}?text=' + encodeURIComponent('(' + ad + ') ' + a.getAttribute('data-msg'));
  });
})();
</script>
</body>
</html>`;
}

// ---------- üretim ----------
mkdirSync(join(HEDEF, 'img'), { recursive: true });
mkdirSync(join(HEDEF, 'font'), { recursive: true });
const sayfa = html();
writeFileSync(join(HEDEF, 'index.html'), sayfa);

// fontlar: her ağırlık için latin + latin-ext (ğ ş İ) dosyası, @fontsource'un unicode-range değerleriyle
for (const f of FONTLAR) copyFileSync(f.kaynak, join(HEDEF, 'font', f.dosya));

istek.set('logo.webp', [join(BURASI, 'marka', 'logo-mark.png'), join(HEDEF, 'img', 'logo.webp'), 240]);
for (const [, [k]] of istek) if (!existsSync(k)) throw new Error(`görsel yok: ${k}`);
const liste = join(BURASI, 'cikti', 'web-katalog-gorsel.json');
writeFileSync(liste, JSON.stringify([...istek.values()]));
const py = spawnSync('python3', ['-I', join(BURASI, 'web-katalog-gorsel.py'), liste], { encoding: 'utf8' });
if (py.status !== 0) throw new Error(py.stderr);
process.stdout.write(py.stdout);

// paylaşım önizleme görseli (WhatsApp / Instagram / Facebook bağlantı kartı) 1200×630
const font = (p, d) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', p, d)).href;
const og = `<!DOCTYPE html><html><head><meta charset="utf-8">${['oswald/700.css', 'inter/400.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('')}
<style>body{margin:0}.k{width:1200px;height:630px;position:relative;overflow:hidden;background:#fff;font-family:Inter}
.s{position:absolute;left:0;top:0;bottom:0;width:640px;background:#1F2124;clip-path:polygon(0 0,100% 0,82% 100%,0 100%)}
.r{position:absolute;inset:0;background:#C8102E;clip-path:polygon(51% 0,55% 0,46% 100%,42% 100%)}
.y{position:absolute;left:56px;top:52px;width:470px;color:#fff}.y img{height:56px;border-radius:6px}
.y b{display:block;font:700 22px Oswald;letter-spacing:3px;margin-top:22px}.y h1{font:700 64px/1.02 Oswald;margin:18px 0 0}
.y p{font-size:24px;color:#CFCAC2;margin:16px 0 0}.t{position:absolute;left:56px;bottom:46px;font:700 40px Oswald;color:#fff}
.u{position:absolute;right:30px;top:60px;width:560px;height:440px;object-fit:contain}
.e{position:absolute;right:40px;bottom:40px;background:#C8102E;color:#fff;font:700 24px Inter;padding:14px 22px;border-radius:8px}</style></head>
<body><div class="k"><div class="s"></div><div class="r"></div><div class="y"><img src="${pathToFileURL(join(BURASI, 'marka', 'logo-mark.png')).href}"><b>ÜÇEL TARIM ALETLERİ</b><h1>Ürün Kataloğu 2026</h1><p>${t(ALT_SLOGAN)}</p></div>
<p class="t">${FIRMA.telefon}</p><img class="u" src="${pathToFileURL(YOL.d('tarim-romorku-yesil-traktor')).href}"><span class="e">Fiyat için WhatsApp'tan yazın</span></div></body></html>`;
const ogDosya = join(BURASI, 'cikti', 'web-og.html');
writeFileSync(ogDosya, og);
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const s = await tarayici.newPage({ viewport: { width: 1200, height: 630 } });
await s.goto(pathToFileURL(ogDosya).href, { waitUntil: 'networkidle' });
await s.evaluate(() => document.fonts.ready);
await s.screenshot({ path: join(HEDEF, 'img', 'paylasim.jpg'), type: 'jpeg', quality: 85 });
await tarayici.close();
console.log('yazıldı:', HEDEF);
