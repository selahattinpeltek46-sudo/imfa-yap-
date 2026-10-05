// Üçel Tarım Aletleri — 2026 Satış Kataloğu (Aşama 4)
// Tek veriden iki çıktı:
//   cikti/Ucel-Urun-Katalogu-2026.pdf          yatay 420 × 210 mm (masaüstü, tablet, baskı) — QR'lı
//   cikti/Ucel-Urun-Katalogu-2026-Telefon.pdf  dikey 90 × 160 mm (telefon) — dokunulabilir butonlu
// Metinler: katalog5-metin.mjs · Teknik veri: teknik-veri.mjs · Plan: KATALOG-PLAN.md
// Önce: python3 gorseller.py && python3 dekupe.py
// Çalıştırma: node katalog5.mjs [--taslak]   (CHROMIUM_PATH gerekirse)
//   --taslak: boş teknik alanlar ve Üçel'den beklenen bilgiler işaretli görünür
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER, SAHADAN } from './katalog2-veri.mjs';
import { TEKNIK } from './teknik-veri.mjs';
import { SAYFALAR as P, URUN_METIN as U, SECIM_KUTUSU, SLOGAN, ALT_SLOGAN, TELEFON } from './katalog5-metin.mjs';

const TASLAK = process.argv.includes('--taslak');
const BEK = '[TEKNİK BİLGİ GEREKLİ]';
const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const t = (x) => esc(x && typeof x === 'object' ? x.t : x);
const dolu = (v) => v !== null && v !== undefined && v !== '';
const url = (p) => pathToFileURL(p).href;
const YOL = {
  d: (a) => join(CIKTI, 'dekupe', `${a}.jpg`),
  f: (a) => join(CIKTI, 'pdf-gorsel', `${a}.jpg`),
  k: (a) => join(CIKTI, 'pdf-gorsel', `${a}-k.jpg`),
  e: (a) => join(BURASI, 'foto-ek', `${a}.jpg`),
  m: (a) => join(BURASI, 'marka', a),
};
const g = (tur, a) => url(YOL[tur](a));
const font = (p, d) => url(join(BURASI, 'node_modules', '@fontsource', p, d));
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const TEL = 'tel:+90' + FIRMA.telefon.replace(/\D/g, '').replace(/^0/, '');
const qr = (x) => QRCode.toString(x, { type: 'svg', margin: 0, errorCorrectionLevel: 'L', color: { dark: '#1F2124FF', light: '#FFFFFF00' } });
const n2 = (n) => String(n).padStart(2, '0');
const ad = (id) => URUNLER.find((u) => u.id === id).ad;

// ---------- ürünler: görseller ve tablo alanları ----------
// hero/yan: [tür, dosya, açıklama] — d: beyaz zeminli ürün, f/e: gerçek fotoğraf (çerçeveli, kırpılmaz)
const URUN = {
  romork: {
    hero: ['d', 'tarim-romorku-yesil-traktor', 'Traktöre bağlı, arkadan görünüm'],
    yan: [['f', 'tarim-romorku-mavi', 'Mavi kasa, yandan'], ['f', 'tarim-romorku-yesil-teslimat', 'Müşterimize teslimat']],
    alanlar: ['Taşıma kapasitesi', 'Kasa iç ölçüsü (U × G × Y)', 'Dingil sayısı', 'Lastik ebadı', 'Damper', 'Gereken traktör gücü'],
  },
  kultivator: {
    hero: ['d', 'yayli-kultivator-kirmizi-2', 'Göksun yaylı kültivatör, kırmızı'],
    yan: [['d', 'yayli-kultivator-mavi-2', 'Mavi renkte'], ['e', 'kultivator-mavi-saha', null]],
    alanlar: ['Ayak sayısı', 'Çalışma genişliği', 'Ağırlık', 'Bağlantı tipi', 'Gereken traktör gücü'],
  },
  'on-yukleyici': {
    hero: ['d', 'on-yukleyici-traktor', 'Traktöre takılı, kepçe yukarıda'],
    yan: [['f', 'on-yukleyici-atolye', 'Atölyemizin önünde'], ['f', 'on-yukleyici-kubota', 'Kubota traktöre montaj']],
    alanlar: ['Kaldırma kapasitesi', 'Maksimum kaldırma yüksekliği', 'Kova genişliği', 'Ağırlık (kova dahil)', 'Uygun traktör gücü'],
  },
  pulluk: {
    hero: ['f', 'kulakli-pulluk', 'Kulaklı pulluk'],
    yan: [],
    alanlar: ['Gövde sayısı', 'Toplam çalışma genişliği', 'Ağırlık', 'Bağlantı tipi', 'Gereken traktör gücü'],
  },
  'gubre-serpme': {
    hero: ['f', 'romork-ve-gubre-serpme', 'Gübre serpme makinesi, teslimatta'],
    yan: [],
    alanlar: ['Gübre kapasitesi', 'Serpme genişliği', 'Tahrik', 'Gereken traktör gücü'],
  },
  'su-tankeri': {
    hero: ['d', 'su-tankeri-2', 'Su tankerleri'],
    yan: [],
    alanlar: ['Su kapasitesi', 'Tank malzemesi', 'Dingil sayısı', 'Pompa', 'Gereken traktör gücü'],
  },
};
const SIRA = ['romork', 'kultivator', 'on-yukleyici', 'pulluk', 'gubre-serpme', 'su-tankeri'];
for (const id of SIRA) {
  const u = URUN[id];
  u.yan.forEach((y) => { if (y[2] === null) y[2] = U[id].detayFoto.t; });
  for (const [tur, a] of [u.hero, ...u.yan]) if (!existsSync(YOL[tur](a))) throw new Error(`görsel yok: ${YOL[tur](a)} — gorseller.py / dekupe.py çalıştırın`);
}

// ---------- sayfa numaraları (yatay) ----------
const NO = {};
let sayac = 0;
const ekle = (k, n = 1) => { NO[k] = sayac + 1; sayac += n; };
ekle('kapak'); ekle('marka'); ekle('neden'); ekle('urunler'); ekle('secim');
for (const id of SIRA) ekle(id, U[id].sayfa);
ekle('diger'); ekle('takas'); ekle('sahadan'); ekle('sss'); ekle('iletisim');
const TOPLAM = sayac;
const hedef = (id) => (id === '_diger' ? 'diger' : id === '_takas' ? 'takas' : id);
const hedefAd = (id) => (id === '_diger' ? 'Diğer ürünler' : id === '_takas' ? 'İkinci el & takas' : ad(id));

// ---------- teknik tablo ----------
const satirlar = (id) => URUN[id].alanlar.map((a) => {
  const r = TEKNIK[id].teknik.find(([x]) => x === a);
  if (!r) throw new Error(`teknik-veri.mjs: ${id} / "${a}" yok`);
  return r;
});
const modeller = (id) => (TEKNIK[id].modeller || []).filter((m) => dolu(m.Model));
const hp = (a) => /traktör gücü/i.test(a);
const birim = (b) => (b && !b.includes(',') && !b.includes('/') && b !== 'adet' ? b : '');

function teknik(id, telefon = false) {
  const ms = modeller(id);
  const sat = satirlar(id);
  if (ms.length || TASLAK) {
    const sutun = ms.length && !TASLAK ? sat.filter(([a]) => ms.some((m) => dolu(m[a]))) : sat;
    const govde = ms.length
      ? ms.map((m) => `<tr><td class="mk">${esc(m.Model)}</td>${sutun.map(([a]) => `<td class="${hp(a) ? 'hp' : ''}">${dolu(m[a]) ? esc(m[a]) : '—'}</td>`).join('')}</tr>`).join('')
      : `<tr><td class="mk"><span class="bek">${BEK}</span></td>${sutun.map(([a]) => `<td class="${hp(a) ? 'hp' : ''}">?</td>`).join('')}</tr>`;
    if (telefon) {
      // telefonda sütun yerine model başına kart
      return `<div class="t-tablo"><p class="ara">Teknik özellikler</p>${(ms.length ? ms : [{ Model: null }]).map((m) => `<div class="t-model"><b>${m.Model ? esc(m.Model) : `<span class="bek">${BEK}</span>`}</b>${sutun.map(([a, b]) => `<p class="${hp(a) ? 'hp' : ''}"><span>${esc(a)}${birim(b) ? ` (${esc(birim(b))})` : ''}</span><em>${m.Model && dolu(m[a]) ? esc(m[a]) : (m.Model ? '—' : '?')}</em></p>`).join('')}</div>`).join('')}</div>`;
    }
    return `<table class="teknik"><thead><tr><th>Model</th>${sutun.map(([a, b]) => `<th class="${hp(a) ? 'hp' : ''}">${esc(a)}${birim(b) ? `<small>${esc(birim(b))}</small>` : ''}</th>`).join('')}</tr></thead><tbody>${govde}</tbody></table>`;
  }
  return secimKutusu(telefon);
}
const secimKutusu = (telefon) => `<div class="secim${telefon ? ' tel' : ''}"><h3>${t(SECIM_KUTUSU.baslik)}</h3><p>${t(SECIM_KUTUSU.giris)}</p><ol>${SECIM_KUTUSU.maddeler.map((m) => `<li>${t(m)}</li>`).join('')}</ol><p class="son">${t(SECIM_KUTUSU.sonuc)}</p></div>`;

// Üçel'den gelecek ek bilgiler (malzeme, farklı kılan, ataşman, uyarı) — yalnızca doluysa; taslakta liste
function ekBilgi(id) {
  const v = TEKNIK[id];
  const k = [];
  if (v.malzeme?.some(([, x]) => dolu(x))) k.push(['Malzeme ve imalat', `<dl>${v.malzeme.filter(([, x]) => dolu(x)).map(([a, x]) => `<dt>${esc(a)}</dt><dd>${esc(x)}</dd>`).join('')}</dl>`]);
  if (v.farkli?.length) k.push(['Modelimizi farklı kılan', `<ul>${v.farkli.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`]);
  const at = (v.atasman || []).filter(([, x]) => x);
  if (at.length) k.push(['Takılabilen ataşmanlar', `<ul>${at.map(([a, x]) => `<li>${esc(typeof x === 'string' ? `${a} — ${x}` : a)}</li>`).join('')}</ul>`]);
  if (v.uyari?.length) k.push(['Kullanım ve bakım', `<ul>${v.uyari.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`]);
  if (k.length) return `<div class="ek k${k.length}">${k.map(([b, i]) => `<div><h4>${b}</h4>${i}</div>`).join('')}</div>`;
  if (!TASLAK) return '';
  const bek = [...(v.malzeme ? ['Malzeme ve imalat'] : []), 'Modelimizi farklı kılan', ...(v.atasman ? ['Takılabilen ataşmanlar'] : []), 'Kullanım ve bakım', ...(U[id].secenekBekleyen || [])];
  return `<p class="taslak-not"><b>Üçel'den bekleniyor:</b> ${bek.map(esc).join(' · ')}</p>`;
}

// ---------- ikonlar (tek set, çizgi) ----------
const IK = {
  imalat: '<path d="M3 21h18M5 21V9l5 3V9l5 3V5h4v16"/>',
  cozum: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  saha: '<path d="M12 21c-4-4-7-7.5-7-11a7 7 0 0 1 14 0c0 3.5-3 7-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  destek: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  kamyon: '<path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  cuval: '<path d="M8 4h8l-1 3c3 1.5 4 4.5 4 8a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5c0-3.5 1-6.5 4-8z"/>',
  damla: '<path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z"/>',
  odun: '<rect x="3" y="9" width="18" height="6" rx="3"/><circle cx="6" cy="12" r="1.5"/>',
  hayvan: '<path d="M5 10c0-3 3-5 7-5s7 2 7 5v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><circle cx="9.5" cy="11" r=".8"/><circle cx="14.5" cy="11" r=".8"/>',
  toprak: '<path d="M3 17c3-2 6-2 9 0s6 2 9 0M3 12c3-2 6-2 9 0s6 2 9 0"/>',
  filiz: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-3 6-7 6zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
  yaprak: '<path d="M5 19C5 10 10 5 19 5c0 9-5 14-14 14zM5 19l8-8"/>',
  yukari: '<path d="M12 20V5M6 11l6-6 6 6M4 20h16"/>',
  ev: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6"/>',
  kutu: '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
  tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  ok: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  tik: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
};
const ikon = (k, renk = '#C8102E') => `<svg viewBox="0 0 24 24" fill="none" stroke="${renk}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IK[k]}</svg>`;
const kulIkon = (s) => {
  const x = s.toLocaleLowerCase('tr');
  if (/gübre|organik|kimyasal/.test(x)) return 'cuval';
  if (/sula|su /.test(x) || x.startsWith('su') || /hayvan suyu/.test(x)) return 'damla';
  if (/odun|malzeme/.test(x)) return 'odun';
  if (/hayvan/.test(x)) return 'hayvan';
  if (/tohum/.test(x)) return 'filiz';
  if (/ot/.test(x)) return 'yaprak';
  if (/yükleme/.test(x)) return 'yukari';
  if (/ahır|çiftlik/.test(x)) return 'ev';
  if (/toprak|anız|hazırlık/.test(x)) return 'toprak';
  return 'cuval';
};

// ---------- ortak parçalar ----------
const SITE_KISA = FIRMA.siteGorunen;
const footer = (no) => `<footer class="alt"><b>ÜÇEL TARIM ALETLERİ</b><span>Tel / WhatsApp <strong>${FIRMA.telefon}</strong></span><span>${esc(FIRMA.adres1)} · Göksun / Kahramanmaraş</span><span>${esc(SITE_KISA)}</span><i>${n2(no)}</i></footer>`;
const ust = (etiket, baslik, sag = '') => `<header class="ust"><div class="ust-koyu"><p class="etk">${t(etiket)}</p><h1>${t(baslik)}</h1></div><div class="ust-serit"></div>${sag}</header>`;
const foto = ([tur, a, yazi], sinif = '', kucuk = false) => tur === 'd'
  ? `<figure class="foto dek ${sinif}"><img src="${g('d', a)}" alt="${esc(yazi)}"><figcaption>${esc(yazi)}</figcaption></figure>`
  : `<figure class="foto cer ${sinif}"><div class="kutu"><img src="${g(kucuk && tur === 'f' ? 'k' : tur, a)}" alt="${esc(yazi)}"></div><figcaption>${esc(yazi)}</figcaption></figure>`;
const ctaBant = async (cta, mesaj, alt = 'QR\'ı okutun, mesaj hazır gelsin') => `<div class="cta"><a class="q" href="${esc(wa(mesaj))}">${await qr(wa(mesaj))}</a><div class="cta-yazi"><h3>${t(cta)}</h3><p>${ikon('wa', '#fff')}${esc(alt)}</p></div><a class="cta-tel" href="${TEL}"><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></a></div>`;
const kullanim = (u) => `<ul class="kul">${u.kullanim.map((k) => `<li><i>${ikon(kulIkon(k.t))}</i>${t(k)}</li>`).join('')}</ul>`;
const kimler = (u) => `<div class="kimler"><b>Kimler için?</b>${t(u.kimler)}</div>`;
const neden = (u, baslik = 'Neden Üçel?') => `<div class="neden-u"><b>${baslik}</b><ul>${u.neden.map((x) => `<li>${ikon('tik')}${t(x)}</li>`).join('')}</ul></div>`;

// =====================================================================
// YATAY KATALOG
// =====================================================================
async function yatay() {
  const qrHarita = await qr(FIRMA.harita);
  const qrSite = await qr(FIRMA.site);
  const sayfalar = [];
  const sec = (no, sinif, ic, id = '') => `<section class="page ${sinif}"${id ? ` id="${id}"` : ''}>${ic}${sinif.includes('kapak') ? '' : footer(no)}</section>`;
  const qrKart = (svg, b, a) => `<div class="qr-kart"><div class="kod">${svg}</div><p><b>${esc(b)}</b>${esc(a)}</p></div>`;

  // 01 kapak
  const K = P.kapak;
  sayfalar.push(`<section class="page kapak" id="kapak">
    <div class="k-koyu"></div><div class="k-serit"></div>
    <div class="k-sol">
      <div class="marka-satir"><img src="${g('m', 'logo-mark.png')}" alt="Üçel logosu"><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div></div>
      <p class="k-ust">${t(K.ust)}</p>
      <h1>${t(K.baslik).replace(', ', ',<br>')}</h1>
      <p class="k-alt">${t(K.alt)}</p>
      <nav class="icind"><p>İçindekiler</p>${[['marka', 'Göksun\'da üretiyoruz'], ['neden', 'Neden Üçel?'], ['urunler', 'Ürünlerimiz'], ['secim', 'Size uygun ekipman'], ...SIRA.map((id) => [id, ad(id)]), ['takas', 'İkinci el & takas'], ['sss', 'Sık sorulanlar'], ['iletisim', 'İletişim']].map(([k, a]) => `<a href="#${k}"><b>${n2(NO[k])}</b>${esc(a)}</a>`).join('')}</nav>
      <a class="k-tel" href="${TEL}"><b>${FIRMA.telefon}</b><span>Telefon<br>WhatsApp</span></a>
    </div>
    <img class="k-urun kp1" src="${g('d', 'tarim-romorku-yesil-traktor')}" alt="Üçel tarım römorku">
    <img class="k-urun kp2" src="${g('d', 'yayli-kultivator-kirmizi-2')}" alt="Göksun yaylı kültivatör">
    <span class="k-rozet">${t(K.rozet)}</span>
  </section>`);

  // 02 marka
  const M = P.marka;
  sayfalar.push(sec(NO.marka, 'marka', `${ust(M.etiket, M.baslik, qrKart(qrHarita, M.qr[0].t, M.qr[1].t))}
    <div class="govde m-govde">
      <div class="m-metin">
        <p class="h2">${t(M.alt)}</p>
        <p class="hikaye">${t(M.hikaye)}</p>
        <blockquote>${t(M.alinti)}</blockquote>
        <div class="isler">${M.isler.map(([b, x]) => `<div><b>${t(b)}</b><span>${t(x)}</span></div>`).join('')}</div>
        <p class="ziyaret">${ikon('saha')}${t(M.ziyaret)}</p>
      </div>
      <div class="mozaik">
        ${foto(['m', 'ucel-logo-tabela.jpg', 'Atölyemiz, Göksun Sanayi Sitesi'].map((x, i) => (i === 0 ? 'f' : x)).map((x, i) => x), 'genis').replace(g('f', 'ucel-logo-tabela.jpg'), g('m', 'ucel-logo-tabela.jpg'))}
        ${foto(['f', 'on-yukleyici-atolye', 'Atölyemizin önünde'], '', true)}
        ${foto(['f', 'tarim-romorku-yesil-teslimat', 'Müşterimize teslimat'], '', true)}
      </div>
    </div>`, 'marka'));

  // 03 neden
  const N = P.neden;
  const kanitFoto = [['f', 'on-yukleyici-atolye'], ['d', 'tarim-romorku-yesil-traktor'], ['f', 'tarim-romorku-traktor'], ['d', 'yayli-kultivator-kirmizi-2'], ['f', 'tarim-romorku-yuk-araci']];
  sayfalar.push(sec(NO.neden, 'neden', `${ust(N.etiket, N.baslik)}
    <div class="govde n-govde">${N.maddeler.map((x, i) => {
      const [tur, a] = kanitFoto[i];
      return `<div class="n-kart"><div class="n-foto ${tur === 'd' ? 'dek' : ''}"><img src="${g(tur === 'f' ? 'k' : tur, a)}" alt=""></div><div class="n-yazi"><i>${ikon(x.ikon)}</i><h3>${t(x.baslik)}</h3><p>${t(x.metin)}</p>${x.kanit ? `<p class="kanit">${t(x.kanit)}</p>` : ''}</div></div>`;
    }).join('')}</div>`, 'neden'));

  // 04 ürünlerimiz
  const UR = P.urunler;
  const kart = (id) => {
    if (id[0] === '_') return `<a class="u-kart mini" href="#${hedef(id)}"><b>${esc(hedefAd(id))}</b><span>Sayfa ${n2(NO[hedef(id)])} ${ikon('ok')}</span></a>`;
    const [tur, a] = URUN[id].hero;
    return `<a class="u-kart" href="#${id}"><div class="u-foto ${tur === 'd' ? 'dek' : ''}"><img src="${g(tur === 'f' ? 'k' : tur, a)}" alt=""><i>${n2(NO[id])}</i></div><div class="u-yazi"><h3>${esc(ad(id))}</h3><p>${t(U[id].fayda)}</p>${URUNLER.find((x) => x.id === id).imalat ? '<em>KENDİ İMALATIMIZ</em>' : ''}</div></a>`;
  };
  sayfalar.push(sec(NO.urunler, 'urunler', `${ust(UR.etiket, UR.baslik, qrKart(qrSite, 'Tüm ürünler', 'web sitemizde'))}
    <div class="govde ur-govde">${UR.kategoriler.map(([k, ids]) => `<div class="kat k${ids.length}"><p class="kat-ad">${t(k)}</p><div class="kat-ic">${ids.map(kart).join('')}</div></div>`).join('')}</div>
    <p class="ur-alt">${t(UR.alt)}</p>`, 'urunler'));

  // 05 seçim
  const SC = P.secim;
  sayfalar.push(sec(NO.secim, 'secim-s', `${ust(SC.etiket, SC.baslik)}
    <div class="govde sc-govde">
      <p class="h2">${t(SC.alt)}</p>
      <div class="isler-tablo">${SC.isler.map(([is, ids]) => `<div class="is"><b>${t(is)}</b><span class="ok">${ikon('ok')}</span><div>${ids.map((id) => `<a href="#${hedef(id)}">${esc(hedefAd(id))} <small>s. ${n2(NO[hedef(id)])}</small></a>`).join('')}</div></div>`).join('')}</div>
      <p class="hp-not">${t(SC.hpNot)}</p>
    </div>
    ${await ctaBant(SC.cta, SC.wa)}`, 'secim'));

  // ürün sayfaları
  for (const id of SIRA) {
    const u = U[id];
    const r = URUN[id];
    const no = NO[id];
    const etiket = `${u.kategori.t}${URUNLER.find((x) => x.id === id).imalat ? ' · Kendi imalatımız' : ''}`;
    if (u.sayfa === 2) {
      sayfalar.push(sec(no, 'urun u-a', `${ust(etiket, ad(id))}
        <div class="govde ua-govde">
          ${foto(r.hero, 'hero')}
          <div class="ua-sag">
            <p class="fayda">${t(u.fayda)}</p>
            <p class="tanim">${t(u.tanim)}</p>
            <p class="ara">Nerede kullanılır?</p>
            ${kullanim(u)}
            ${kimler(u)}
            ${neden(u)}
            <a class="devam" href="#${id}-2">${esc(u.sayfa2Baslik.t)} · sayfa ${n2(no + 1)} ${ikon('ok')}</a>
          </div>
        </div>`, id));
      sayfalar.push(sec(no + 1, 'urun u-b', `${ust(etiket, `${ad(id)} · ${u.sayfa2Baslik.t}`)}
        <div class="govde ub-govde">
          <div class="ub-sol">
            ${teknik(id)}
            ${u.secenekler ? `<div class="secenek"><p class="ara">Seçenekler</p><ul>${u.secenekler.map((x) => `<li>${ikon('tik')}${t(x)}</li>`).join('')}</ul></div>` : ''}
            ${ekBilgi(id)}
          </div>
          <div class="ub-sag">${r.yan.map((y) => foto(y, 'yan', true)).join('')}</div>
        </div>
        ${await ctaBant(u.cta, u.wa)}`, `${id}-2`));
    } else {
      sayfalar.push(sec(no, 'urun u-t', `${ust(etiket, ad(id))}
        <div class="govde ut-govde">
          ${foto(r.hero, 'hero')}
          <div class="ut-sag">
            <p class="fayda">${t(u.fayda)}</p>
            <p class="tanim">${t(u.tanim)}</p>
            <div class="ut-iki">${kullanim(u)}${kimler(u)}</div>
            ${teknik(id)}
            ${ekBilgi(id)}
          </div>
        </div>
        ${await ctaBant(u.cta, u.wa)}`, id));
    }
  }

  // diğer
  const D = P.diger;
  sayfalar.push(sec(NO.diger, 'diger-s', `${ust(D.etiket, D.baslik)}
    <div class="govde dg-govde">${D.urunler.map(([b, x]) => `<div class="dg-kart"><h3>${t(b)}</h3><p>${t(x)}</p></div>`).join('')}</div>
    ${await ctaBant(D.cta, D.wa)}`, 'diger'));

  // takas
  const T = P.takas;
  sayfalar.push(sec(NO.takas, 'takas-s', `${ust(T.etiket, T.baslik)}
    <div class="govde tk-govde">
      <p class="h2">${t(T.alt)}</p>
      <ol class="tk-adim">${T.adimlar.map((x, i) => `<li><b>${i + 1}</b><span>${t(x)}</span></li>`).join('')}</ol>
      <div class="tk-alt"><p>${ikon('kutu')}${t(T.ikinciEl)}</p><p>${ikon('destek')}${t(T.durust)}</p></div>
    </div>
    ${await ctaBant(T.cta, T.wa, 'QR\'ı okutun, fotoğrafı WhatsApp\'tan gönderin')}`, 'takas'));

  // sahadan
  const SH = P.sahadan;
  sayfalar.push(sec(NO.sahadan, 'sahadan-s', `${ust(SH.etiket, SH.baslik, qrKart(qrHarita, SH.qr[0].t, SH.qr[1].t))}
    <div class="govde sh-govde">${SAHADAN.slice(0, 6).map(([f, y]) => foto(['f', f, y], 'sh', true)).join('')}</div>`, 'sahadan'));

  // sss
  const SS = P.sss;
  sayfalar.push(sec(NO.sss, 'sss-s', `${ust(SS.etiket, SS.baslik)}
    <div class="govde ss-govde">${SS.sorular.map(([s, c]) => `<div class="soru"><h3>${t(s)}</h3><p>${t(c)}</p></div>`).join('')}</div>
    ${await ctaBant(SS.cta, SS.wa)}`, 'sss'));

  // iletişim
  const I = P.iletisim;
  sayfalar.push(`<section class="page iletisim" id="iletisim">
    <div class="il-serit"></div>
    <div class="il-sol">
      <div class="marka-satir"><img src="${g('m', 'logo-mark.png')}" alt="Üçel logosu"><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div></div>
      <h2>${t(I.baslik)}</h2>
      <p class="il-alt">${t(I.alt)}</p>
      <p class="il-et">${t(I.hizli)}</p>
      <a class="il-tel" href="${TEL}">${FIRMA.telefon}</a>
    </div>
    <div class="il-sag">
      <dl>
        <div><dt>Adres</dt><dd>${esc(FIRMA.adres1)}<br>${esc(FIRMA.adres2)}</dd></div>
        <div><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd></div>
        <div><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></div>
        <div><dt>İnternet</dt><dd>${esc(SITE_KISA)}</dd></div>
      </dl>
      <div class="il-qr">${[[wa(I.wa), ...I.qr[0]], [FIRMA.site, ...I.qr[1]], [FIRMA.harita, ...I.qr[2]]].map(([h, b, a]) => `<a href="${esc(h)}">QR:${esc(h)}<b>${t(b)}</b>${t(a)}</a>`).join('')}</div>
    </div>
    <div class="il-bant">
      ${['tarim-romorku-yesil-traktor', 'yayli-kultivator-kirmizi-2', 'on-yukleyici-traktor', 'su-tankeri-2'].map((a) => `<img src="${g('d', a)}" alt="">`).join('')}
      <p>${t(SLOGAN)}<span>${t(ALT_SLOGAN)}</span></p>
    </div>
  </section>`);

  let html = sayfalar.join('\n');
  for (const m of [...html.matchAll(/QR:([^<]+?)<b>/g)]) html = html.replace(m[0], `<span class="kod">${await qr(m[1].replace(/&amp;/g, '&'))}</span><b>`);
  return sarmala('yatay', html, CSS_YATAY);
}

// =====================================================================
// TELEFON KATALOĞU (her ekran: başlık · içerik · altta WhatsApp + Ara)
// =====================================================================
async function telefon() {
  const ekranlar = [];
  let no = 0;
  const ekran = (etiket, baslik, ic, mesaj = P.iletisim.wa, id = '', sinif = '') => {
    no += 1;
    ekranlar.push(`<section class="ekran ${sinif}"${id ? ` id="${id}"` : ''}>
      <header class="t-ust"><p class="etk">${t(etiket)}</p><h1>${t(baslik)}</h1><i>${no}</i></header>
      <div class="t-ic">${ic}</div>
      <nav class="t-bar"><a href="${esc(wa(mesaj))}">${ikon('wa', '#fff')}${t(TELEFON.butonWa)}</a><a href="${TEL}">${ikon('tel', '#fff')}${t(TELEFON.butonAra)}</a></nav>
    </section>`);
  };
  const tFoto = ([tur, a, yazi]) => `<figure class="t-foto ${tur === 'd' ? 'dek' : 'cer'}"><img src="${g(tur === 'f' ? 'f' : tur, a)}" alt="${esc(yazi)}"><figcaption>${esc(yazi)}</figcaption></figure>`;

  // kapak
  no += 1;
  ekranlar.push(`<section class="ekran t-kapak" id="t-kapak">
    <div class="tk-ust"><div class="marka-satir"><img src="${g('m', 'logo-mark.png')}" alt=""><div><b>ÜÇEL TARIM ALETLERİ</b><span>Göksun · Kahramanmaraş</span></div></div>
    <p class="k-ust">${t(P.kapak.ust)}</p><h1>${t(SLOGAN)}</h1><p class="k-alt">${t(ALT_SLOGAN)}</p><a class="tk-tel" href="${TEL}">${FIRMA.telefon}<span>Telefon · WhatsApp</span></a></div>
    <img class="tk-urun" src="${g('d', 'tarim-romorku-yesil-traktor')}" alt="">
    <a class="tk-git" href="#t-urunler">${t(P.kapak.telefonButon)} ${ikon('ok', '#fff')}</a>
    <nav class="t-bar"><a href="${esc(wa(P.iletisim.wa))}">${ikon('wa', '#fff')}${t(TELEFON.butonWa)}</a><a href="${TEL}">${ikon('tel', '#fff')}${t(TELEFON.butonAra)}</a></nav>
  </section>`);

  const M = P.marka;
  ekran(M.etiket, M.baslik, `<figure class="t-foto cer kisa"><img src="${g('m', 'ucel-logo-tabela.jpg')}" alt=""></figure><p class="t-metin">${t(M.hikaye)}</p><blockquote>${t(M.alinti)}</blockquote>`);
  const N = P.neden;
  const nk = (x) => `<div class="t-neden"><i>${ikon(x.ikon)}</i><div><h3>${t(x.baslik)}</h3><p>${t(x.metin)}</p>${x.kanit ? `<p class="kanit">${t(x.kanit)}</p>` : ''}</div></div>`;
  ekran(N.etiket, N.baslik, N.maddeler.slice(0, 3).map(nk).join(''), P.iletisim.wa, 't-neden');
  ekran(N.etiket, N.baslik, N.maddeler.slice(3).map(nk).join(''));

  // ürünlerimiz: dokunulabilir liste
  ekran(P.urunler.etiket, P.urunler.baslik, `<div class="t-liste">${SIRA.map((id) => {
    const [tur, a] = URUN[id].hero;
    return `<a href="#t-${id}"><span class="tl-foto ${tur === 'd' ? 'dek' : ''}"><img src="${g(tur === 'f' ? 'k' : tur, a)}" alt=""></span><span class="tl-yazi"><b>${esc(ad(id))}</b>${t(U[id].kategori)}</span>${ikon('ok')}</a>`;
  }).join('')}<a href="#t-diger" class="tl-mini"><span class="tl-yazi"><b>Diğer ürünler · İkinci el & takas</b></span>${ikon('ok')}</a></div>`, P.iletisim.wa, 't-urunler');
  ekran(P.secim.etiket, P.secim.baslik, `<div class="t-is">${P.secim.isler.map(([is, ids]) => `<p><b>${t(is)}</b>${ids.map((id) => `<a href="#t-${hedef(id)}">${esc(hedefAd(id))}</a>`).join('')}</p>`).join('')}</div>`, P.secim.wa);

  for (const id of SIRA) {
    const u = U[id];
    const r = URUN[id];
    const etiket = `${u.kategori.t}${URUNLER.find((x) => x.id === id).imalat ? ' · Kendi imalatımız' : ''}`;
    ekran(etiket, ad(id), `${tFoto(r.hero)}<p class="fayda">${t(u.fayda)}</p><p class="t-metin">${t(u.tanim)}</p>`, u.wa, `t-${id}`);
    ekran(etiket, ad(id), `<p class="ara">Nerede kullanılır?</p>${kullanim(u)}${kimler(u)}${neden(u)}`, u.wa);
    ekran(etiket, ad(id), `${teknik(id, true)}${u.secenekler ? `<div class="secenek"><p class="ara">Seçenekler</p><ul>${u.secenekler.map((x) => `<li>${ikon('tik')}${t(x)}</li>`).join('')}</ul></div>` : ''}<p class="t-cta">${t(u.cta)}</p>`, u.wa);
  }

  const D = P.diger;
  ekran(D.etiket, D.baslik, D.urunler.map(([b, x]) => `<div class="t-dg"><h3>${t(b)}</h3><p>${t(x)}</p></div>`).join('') + `<p class="t-cta">${t(D.cta)}</p>`, D.wa, 't-diger');
  const T = P.takas;
  ekran(T.etiket, T.baslik, `<p class="t-metin">${t(T.alt)}</p><ol class="t-adim">${T.adimlar.map((x, i) => `<li><b>${i + 1}</b>${t(x)}</li>`).join('')}</ol><p class="t-not">${t(T.durust)}</p><p class="t-cta">${t(T.cta)}</p>`, T.wa, 't-takas');
  ekran(P.sahadan.etiket, P.sahadan.baslik, `<div class="t-sahadan">${SAHADAN.slice(0, 4).map(([f, y]) => `<figure><img src="${g('k', f)}" alt=""><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div>`);
  const SS = P.sss;
  for (const [a, b] of [[0, 3], [3, 6], [6, 8]]) ekran(SS.etiket, SS.baslik, SS.sorular.slice(a, b).map(([s, c]) => `<div class="t-soru"><h3>${t(s)}</h3><p>${t(c)}</p></div>`).join('') + (b === 8 ? `<p class="t-cta">${t(SS.cta)}</p>` : ''), SS.wa);
  const I = P.iletisim;
  ekran({ t: 'İletişim' }, I.baslik, `<a class="t-tel" href="${TEL}">${FIRMA.telefon}</a><p class="t-metin">${t(I.hizli)}</p><dl class="t-dl"><dt>Adres</dt><dd>${esc(FIRMA.adres1)}, ${esc(FIRMA.adres2)}</dd><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></dl><div class="t-linkler"><a href="${esc(FIRMA.harita)}">${ikon('saha')}Konum ve yol tarifi</a><a href="${esc(FIRMA.site)}">${ikon('ok')}Web sitemiz</a></div>`, I.wa, 't-iletisim');

  return sarmala('telefon', ekranlar.join('\n'), CSS_TELEFON);
}

// =====================================================================
// CSS
// =====================================================================
const CSS_ORTAK = `
:root { --k:#C8102E; --ki:#E9454F; --d:#1F2124; --z:#F6F4F0; --c:#E2DED8; --g:#5F5B55; }
* { box-sizing: border-box; } html, body { margin: 0; }
body { font: 400 12pt/1.55 'Inter', sans-serif; color: var(--d); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
p, h1, h2, h3, h4, figure, blockquote, ul, ol, dl, dd { margin: 0; } ul, ol { padding: 0; list-style: none; }
a { color: inherit; text-decoration: none; } img { display: block; }
svg { display: block; }
.bek { font: 700 8.5pt/1.2 'Inter'; color: #8A1020; background: #FBEAEC; border: .3mm dashed var(--k); border-radius: .6mm; padding: .4mm 1.4mm; white-space: nowrap; }
.marka-satir { display: flex; align-items: center; gap: 4mm; }
.marka-satir img { height: 15mm; border-radius: 1.5mm; }
.marka-satir b { display: block; font: 700 14pt/1 'Oswald'; letter-spacing: 2.4pt; }
.marka-satir span { display: block; font-size: 9pt; letter-spacing: 1.4pt; text-transform: uppercase; color: #a3a19c; margin-top: 1.2mm; }
.ara { font: 700 9pt/1 'Inter'; letter-spacing: 1.4pt; text-transform: uppercase; color: var(--k); margin-bottom: 2mm; }
.kul { display: grid; grid-template-columns: 1fr 1fr; gap: 2.4mm 4mm; }
.kul li { display: flex; align-items: center; gap: 2.5mm; font: 600 10.5pt/1.25 'Inter'; }
.kul i { width: 9mm; height: 9mm; border-radius: 50%; background: #FBEAEC; display: grid; place-items: center; flex: none; } .kul svg { width: 5mm; height: 5mm; }
.kimler { background: #fff; border-left: 1.4mm solid var(--k); border-radius: 0 2mm 2mm 0; padding: 3mm 4mm; font-size: 10.5pt; line-height: 1.45; }
.kimler b { display: block; font: 700 9pt 'Inter'; letter-spacing: 1.2pt; text-transform: uppercase; color: var(--k); margin-bottom: 1mm; }
.neden-u b { display: block; font: 600 13pt/1.1 'Oswald'; margin-bottom: 2mm; }
.neden-u li, .secenek li { display: flex; gap: 2mm; align-items: flex-start; font-size: 10.5pt; line-height: 1.4; padding: .8mm 0; }
.neden-u svg, .secenek svg { width: 4.6mm; height: 4.6mm; flex: none; margin-top: .3mm; }
.secim { background: #fff; border: .4mm solid var(--c); border-top: 1.6mm solid var(--k); border-radius: 0 0 2.5mm 2.5mm; padding: 5mm 6mm; }
.secim h3 { font: 600 16pt/1.15 'Oswald'; margin-bottom: 2mm; }
.secim p { font-size: 11pt; } .secim .son { color: var(--g); font-size: 10pt; margin-top: 2.5mm; }
.secim ol { counter-reset: s; margin-top: 2mm; display: grid; gap: 1.6mm; }
.secim li { counter-increment: s; display: flex; align-items: center; gap: 3mm; font: 600 11.5pt/1.2 'Inter'; }
.secim li::before { content: counter(s); width: 7mm; height: 7mm; border-radius: 50%; background: var(--k); color: #fff; display: grid; place-items: center; font: 700 10pt 'Oswald'; flex: none; }
.taslak-not { font-size: 9pt; color: #8A1020; background: #FBEAEC; border: .3mm dashed var(--k); border-radius: 1mm; padding: 2mm 3mm; margin-top: 3mm; }
.ek { display: grid; gap: 3mm; margin-top: 3mm; } .ek.k2, .ek.k3, .ek.k4 { grid-template-columns: 1fr 1fr; }
.ek > div { background: #fff; border-top: 1.2mm solid var(--k); border-radius: 0 0 2mm 2mm; padding: 2.5mm 3.5mm; }
.ek h4 { font: 600 11pt/1.1 'Oswald'; margin-bottom: 1.5mm; } .ek li, .ek dl { font-size: 9.5pt; line-height: 1.35; }
.ek dl { display: grid; grid-template-columns: 1fr auto; gap: .8mm 3mm; } .ek dd { font-weight: 700; }
`;

const CSS_YATAY = `
@page { size: 420mm 210mm; margin: 0; }
.page { width: 420mm; height: 210mm; position: relative; overflow: hidden; page-break-after: always; background: var(--z); }
.ust { position: absolute; left: 0; right: 0; top: 0; height: 30mm; }
.ust-koyu { position: absolute; left: 0; top: 0; bottom: 0; width: 250mm; background: var(--d); clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%); padding: 6mm 16mm; color: #fff; }
.ust-serit { position: absolute; left: 236mm; top: 0; bottom: 0; width: 24mm; background: var(--k); clip-path: polygon(58% 0, 100% 0, 42% 100%, 0 100%); }
.etk { font: 700 9pt/1 'Inter'; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--ki); margin-bottom: 2.4mm; }
.ust h1 { font: 700 28pt/1 'Oswald'; letter-spacing: .3pt; white-space: nowrap; display: inline-block; }
.qr-kart { position: absolute; right: 16mm; top: 4mm; display: flex; align-items: center; gap: 3mm; background: #fff; border-radius: 2mm; padding: 2mm 2.5mm 2mm 3.5mm; box-shadow: 0 .6mm 2mm rgba(0,0,0,.12); }
.qr-kart .kod { width: 22mm; height: 22mm; order: 2; } .qr-kart svg { width: 100%; height: 100%; }
.qr-kart p { font-size: 9pt; color: var(--g); text-align: right; line-height: 1.35; } .qr-kart b { display: block; font-size: 10pt; color: var(--d); }
.govde { position: absolute; left: 16mm; right: 16mm; top: 38mm; bottom: 20mm; }
.cta ~ .govde, .govde:has(+ .cta) { bottom: 50mm; }
.h2 { font: 500 20pt/1.2 'Oswald'; margin-bottom: 4mm; }
.alt { position: absolute; left: 0; right: 0; bottom: 0; height: 12mm; background: var(--k); color: #fff; display: flex; align-items: center; gap: 10mm; padding: 0 16mm; font-size: 9pt; }
.alt b { font: 700 11pt/1 'Oswald'; letter-spacing: 1.6pt; } .alt strong { font-weight: 700; }
.alt i { margin-left: auto; font: 700 13pt/1 'Oswald'; font-style: normal; background: var(--d); padding: 1.4mm 3mm; border-radius: 1mm; }
/* fotoğraf */
.foto { display: flex; flex-direction: column; min-height: 0; }
.foto figcaption { font-size: 9pt; color: var(--g); margin-top: 1.5mm; }
.foto.dek { background: #fff; border-radius: 3mm; padding: 4mm; }
.foto.dek img { flex: 1; min-height: 0; width: 100%; object-fit: contain; }
.foto.cer .kutu { flex: 1; min-height: 0; display: flex; justify-content: center; align-items: flex-end; }
.foto.cer .kutu img { max-width: 100%; max-height: 100%; width: auto; height: auto; border-radius: 2mm; border-bottom: 1.2mm solid var(--k); }
.foto.cer figcaption { text-align: center; }
/* CTA bandı */
.cta { position: absolute; left: 16mm; right: 16mm; bottom: 17mm; height: 28mm; background: var(--k); color: #fff; border-radius: 2.5mm; display: flex; align-items: center; gap: 6mm; padding: 0 6mm 0 3mm; }
.cta .q { width: 23mm; height: 23mm; background: #fff; padding: 1.5mm; border-radius: 1.5mm; flex: none; } .cta .q svg { width: 100%; height: 100%; }
.cta h3 { font: 600 17pt/1.15 'Oswald'; }
.cta-yazi p { display: flex; align-items: center; gap: 1.6mm; font-size: 10pt; margin-top: 1.5mm; opacity: .95; } .cta-yazi p svg { width: 4.4mm; height: 4.4mm; }
.cta-tel { margin-left: auto; text-align: right; } .cta-tel b { display: block; font: 700 22pt/1 'Oswald'; letter-spacing: .4pt; } .cta-tel span { font-size: 9pt; opacity: .9; }
/* kapak */
.kapak .k-koyu { position: absolute; left: 0; top: 0; bottom: 0; width: 214mm; background: var(--d); clip-path: polygon(0 0, 100% 0, 82% 100%, 0 100%); }
.kapak .k-serit { position: absolute; inset: 0; background: var(--k); clip-path: polygon(51% 0, 54.4% 0, 43.2% 100%, 39.8% 100%); }
.k-sol { position: absolute; left: 18mm; top: 15mm; bottom: 13mm; width: 150mm; color: #fff; display: flex; flex-direction: column; }
.k-ust { margin-top: 12mm; font: 700 11pt/1 'Inter'; letter-spacing: 2pt; text-transform: uppercase; color: var(--ki); }
.kapak h1 { font: 700 46pt/1.02 'Oswald'; margin-top: 3mm; }
.k-alt { font-size: 13pt; color: #CFCAC2; margin-top: 4mm; }
.icind { margin-top: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 0 8mm; max-width: 136mm; }
.icind p { grid-column: 1 / -1; font: 700 9pt/1 'Inter'; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--ki); margin-bottom: 1.6mm; }
.icind a { display: flex; gap: 3mm; padding: 1.1mm 0; border-top: .25mm solid rgba(255,255,255,.16); font-size: 9.5pt; }
.icind a b { font: 700 10pt/1.3 'Oswald'; color: var(--ki); min-width: 6mm; }
.k-tel { margin-top: 5mm; display: flex; align-items: center; gap: 4mm; } .k-tel b { font: 700 24pt/1 'Oswald'; } .k-tel span { font-size: 9pt; color: #a3a19c; line-height: 1.3; }
.k-urun { position: absolute; mix-blend-mode: multiply; object-fit: contain; }
.kp1 { right: 10mm; top: 12mm; width: 182mm; height: 112mm; object-position: right top; }
.kp2 { right: 18mm; bottom: 10mm; width: 128mm; height: 68mm; object-position: right bottom; }
.k-rozet { position: absolute; left: 230mm; bottom: 16mm; font: 700 9pt/1 'Inter'; letter-spacing: 1.2pt; text-transform: uppercase; color: #fff; background: var(--d); padding: 2.4mm 3.5mm; border-radius: 1mm; border-left: 1.4mm solid var(--k); }
/* marka */
.m-govde { display: grid; grid-template-columns: 1fr 1.02fr; gap: 12mm; }
.m-metin { display: flex; flex-direction: column; }
.hikaye { font-size: 12pt; line-height: 1.6; }
blockquote { margin-top: 4mm; font: 500 15pt/1.3 'Oswald'; color: var(--d); border-left: 1.6mm solid var(--k); padding-left: 5mm; }
.isler { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin-top: auto; }
.isler div { background: var(--d); color: #fff; border-radius: 2mm; padding: 3mm 3.5mm; border-top: 1.2mm solid var(--k); }
.isler b { display: block; font: 600 13pt/1.1 'Oswald'; margin-bottom: 1mm; } .isler span { font-size: 9.5pt; color: #CFCAC2; line-height: 1.35; display: block; }
.ziyaret { display: flex; align-items: center; gap: 2mm; margin-top: 3mm; font-size: 10pt; color: var(--g); } .ziyaret svg { width: 5mm; height: 5mm; }
.mozaik { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1.2fr 1fr; gap: 4mm 5mm; min-height: 0; }
.mozaik .genis { grid-column: 1 / -1; }
/* neden */
.n-govde { display: grid; grid-template-columns: repeat(5, 1fr); gap: 5mm; }
.n-kart { background: #fff; border-radius: 2.5mm; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 .6mm 2mm rgba(0,0,0,.07); }
.n-foto { height: 62mm; background: var(--d); border-bottom: 1.2mm solid var(--k); }
.n-foto img { width: 100%; height: 100%; object-fit: cover; } .n-foto.dek { background: #fff; padding: 2mm; } .n-foto.dek img { object-fit: contain; mix-blend-mode: multiply; }
.n-yazi { padding: 4mm 4.5mm; display: flex; flex-direction: column; flex: 1; }
.n-yazi i { width: 10mm; height: 10mm; border-radius: 50%; background: #FBEAEC; display: grid; place-items: center; margin-top: -9mm; margin-bottom: 2mm; border: 1mm solid #fff; } .n-yazi svg { width: 5mm; height: 5mm; }
.n-yazi h3 { font: 600 16pt/1.15 'Oswald'; margin-bottom: 2mm; } .n-yazi p { font-size: 11pt; line-height: 1.5; }
.n-yazi .kanit { margin-top: auto; padding-top: 2.5mm; border-top: .3mm solid var(--c); font: 600 10pt/1.4 'Inter'; color: var(--k); }
/* ürünlerimiz */
.ur-govde { display: grid; grid-template-columns: minmax(0,2fr) minmax(0,1fr) minmax(0,2fr) minmax(0,1fr) minmax(0,1fr); gap: 5mm; bottom: 26mm; }
.kat { display: flex; flex-direction: column; min-height: 0; min-width: 0; } .kat-ic > * { min-width: 0; }
.kat-ad { font: 700 9pt/1 'Inter'; letter-spacing: 1.4pt; text-transform: uppercase; color: var(--k); padding-bottom: 2mm; border-bottom: .6mm solid var(--d); margin-bottom: 3mm; }
.kat-ic { display: grid; gap: 4mm; flex: 1; min-height: 0; grid-template-columns: minmax(0,1fr); } .kat.k2 .kat-ic { grid-template-columns: minmax(0,1fr) minmax(0,1fr); }
.kat:last-child .kat-ic { grid-template-columns: 1fr; grid-template-rows: auto auto 1fr; }
.u-kart { background: #fff; border-radius: 2.5mm; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 .6mm 2mm rgba(0,0,0,.08); }
.u-foto { height: 62mm; background: var(--d); border-bottom: 1.2mm solid var(--k); position: relative; }
.u-foto img { width: 100%; height: 100%; object-fit: contain; } .u-foto.dek { background: #fff; padding: 2mm; } .u-foto.dek img { mix-blend-mode: multiply; }
.u-foto i { position: absolute; left: 0; bottom: 0; font: 700 14pt/1 'Oswald'; font-style: normal; color: #fff; background: var(--k); padding: 1.6mm 2.6mm 1.2mm; border-radius: 0 1.5mm 0 0; }
.u-yazi { padding: 3mm 3.5mm 3.5mm; display: flex; flex-direction: column; flex: 1; }
.u-yazi h3 { font: 600 15pt/1.1 'Oswald'; margin-bottom: 1.5mm; } .u-yazi p { font-size: 10pt; line-height: 1.4; }
.u-yazi em { margin-top: auto; align-self: flex-start; font: 700 9pt/1 'Inter'; font-style: normal; letter-spacing: .6pt; color: #fff; background: var(--d); padding: 1.4mm 2mm; border-radius: .6mm; margin-top: 2.5mm; }
.u-kart.mini { padding: 4mm; justify-content: space-between; border-left: 1.4mm solid var(--k); }
.u-kart.mini b { font: 600 14pt/1.15 'Oswald'; } .u-kart.mini span { display: flex; align-items: center; gap: 1.5mm; font: 600 9.5pt 'Inter'; color: var(--k); } .u-kart.mini svg { width: 4mm; height: 4mm; }
.ur-alt { position: absolute; left: 16mm; bottom: 16mm; font-size: 10pt; color: var(--g); }
/* seçim */
.isler-tablo { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 10mm; }
.is { display: grid; grid-template-columns: 1fr 8mm 1.1fr; align-items: center; background: #fff; border-radius: 2mm; padding: 3mm 4mm; }
.is b { font: 600 13pt/1.2 'Oswald'; } .is .ok svg { width: 5mm; height: 5mm; stroke: var(--k); }
.is div { display: flex; flex-wrap: wrap; gap: 1.6mm; } .is a { font: 600 10.5pt/1.2 'Inter'; background: var(--z); border: .3mm solid var(--c); border-radius: 1mm; padding: 1.4mm 2.4mm; }
.is small { color: var(--k); font-weight: 700; margin-left: .8mm; font-size: 9pt; }
.hp-not { margin-top: 4mm; font-size: 10.5pt; color: var(--g); }
/* ürün A */
.ua-govde { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12mm; }
.ua-sag { display: flex; flex-direction: column; gap: 3.5mm; min-height: 0; }
.fayda { font: 500 22pt/1.18 'Oswald'; }
.tanim { font-size: 12pt; line-height: 1.55; color: #3A3A3D; }
.ua-sag .ara { margin: 1mm 0 -1mm; }
.devam { margin-top: auto; align-self: flex-start; display: flex; align-items: center; gap: 2mm; font: 700 10.5pt 'Inter'; color: #fff; background: var(--d); padding: 2.6mm 4mm; border-radius: 1.5mm; } .devam svg { width: 4.5mm; height: 4.5mm; stroke: #fff; }
/* ürün B */
.ub-govde { display: grid; grid-template-columns: 1.55fr 1fr; gap: 10mm; }
.ub-sol { display: flex; flex-direction: column; gap: 6mm; min-height: 0; }
.ub-sol .secim { padding: 7mm 8mm; } .ub-sol .secim h3 { font-size: 22pt; margin-bottom: 3mm; } .ub-sol .secim p { font-size: 12.5pt; } .ub-sol .secim li { font-size: 14pt; } .ub-sol .secim li::before { width: 9mm; height: 9mm; font-size: 12pt; } .ub-sol .secim ol { gap: 3mm; margin-top: 3mm; } .ub-sol .secim .son { font-size: 11pt; margin-top: 4mm; }
.ub-sol .secenek li { font-size: 12pt; }
.ub-sag { display: grid; grid-template-rows: 1fr 1fr; gap: 4mm; min-height: 0; }
.secenek ul { display: grid; grid-template-columns: 1fr 1fr; gap: 0 6mm; }
/* tek sayfa ürün */
.ut-govde { display: grid; grid-template-columns: 1fr 1.15fr; gap: 10mm; }
.ut-sag { display: flex; flex-direction: column; gap: 3mm; min-height: 0; }
.ut-sag .fayda { font-size: 20pt; } .ut-sag .tanim { font-size: 11pt; }
.ut-iki { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; align-items: start; } .ut-iki .kul { grid-template-columns: 1fr; gap: 1.6mm; }
.ut-sag .secim { padding: 3.5mm 5mm; } .ut-sag .secim h3 { font-size: 14pt; } .ut-sag .secim ol { grid-template-columns: repeat(3, auto); gap: 4mm; } .ut-sag .secim li { font-size: 10.5pt; }
/* teknik tablo */
table.teknik { width: 100%; border-collapse: collapse; background: #fff; border-radius: 2mm; overflow: hidden; font-size: 11pt; }
.teknik th { background: var(--d); color: #fff; font: 700 9.5pt/1.2 'Inter'; text-align: left; padding: 2.4mm 3mm; vertical-align: bottom; }
.teknik th small { display: block; font-weight: 400; font-size: 8.8pt; opacity: .8; margin-top: .5mm; } .teknik th.hp { background: var(--k); }
.teknik td { padding: 2.4mm 3mm; border-bottom: .3mm solid var(--c); text-align: center; font-variant-numeric: tabular-nums; }
.teknik td.mk { text-align: left; font-weight: 700; } .teknik td.hp { color: var(--k); font-weight: 700; }
/* diğer */
.dg-govde { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; align-items: start; }
.dg-kart { background: #fff; border-top: 1.6mm solid var(--k); border-radius: 0 0 2.5mm 2.5mm; padding: 6mm; }
.dg-kart h3 { font: 600 17pt/1.15 'Oswald'; margin-bottom: 3mm; } .dg-kart p { font-size: 11.5pt; line-height: 1.5; }
/* takas */
.tk-adim { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; counter-reset: a; }
.tk-adim li { background: #fff; border-radius: 2.5mm; padding: 5mm; display: flex; flex-direction: column; gap: 3mm; }
.tk-adim b { width: 13mm; height: 13mm; border-radius: 50%; background: var(--k); color: #fff; display: grid; place-items: center; font: 700 18pt 'Oswald'; }
.tk-adim span { font: 600 14pt/1.25 'Oswald'; }
.tk-alt { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 6mm; }
.tk-alt p { display: flex; gap: 3mm; align-items: flex-start; font-size: 11pt; line-height: 1.45; } .tk-alt svg { width: 6mm; height: 6mm; flex: none; }
/* sahadan */
.sh-govde { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 4mm 8mm; }
.sh-govde .foto figcaption { font-size: 9pt; color: var(--d); }
/* sss */
.ss-govde { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12mm; align-content: start; }
.soru { padding: 2.6mm 0; border-bottom: .3mm solid var(--c); }
.soru h3 { font: 700 11pt/1.3 'Inter'; margin-bottom: .6mm; } .soru p { font-size: 10.5pt; line-height: 1.45; color: #3A3A3D; }
/* iletişim */
.iletisim { background: var(--d); color: #F2F0EC; }
.il-serit { position: absolute; inset: 0; background: var(--k); clip-path: polygon(59% 0, 62% 0, 55.4% 100%, 52.4% 100%); }
.il-sol { position: absolute; left: 20mm; top: 16mm; width: 196mm; }
.iletisim h2 { font: 700 30pt/1.1 'Oswald'; margin: 9mm 0 4mm; } .il-alt { font-size: 12.5pt; color: #CFCAC2; line-height: 1.55; }
.il-et { font-size: 10pt; color: #a3a19c; margin-top: 7mm; } .il-tel { display: block; font: 700 40pt/1 'Oswald'; letter-spacing: 1pt; margin-top: 2mm; }
.il-sag { position: absolute; left: 268mm; right: 16mm; top: 16mm; }
.il-sag dl { display: grid; gap: 2.6mm; font-size: 10.5pt; } .il-sag dt { font-size: 9pt; letter-spacing: 1pt; text-transform: uppercase; color: #8f8b84; } .il-sag dd { margin-top: .4mm; }
.il-qr { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 6mm; }
.il-qr a { text-align: center; font-size: 9pt; color: #CFCAC2; } .il-qr b { display: block; color: #fff; font-size: 10pt; }
.il-qr .kod { display: block; width: 26mm; height: 26mm; background: #fff; padding: 2mm; border-radius: 1.5mm; margin: 0 auto 2mm; } .il-qr svg { width: 100%; height: 100%; }
.il-bant { position: absolute; left: 0; right: 0; bottom: 0; height: 44mm; background: #fff; display: grid; grid-template-columns: repeat(4, 1fr) 1.15fr; align-items: center; gap: 6mm; padding: 4mm 16mm; border-top: 1.4mm solid var(--k); }
.il-bant img { width: 100%; height: 34mm; object-fit: contain; mix-blend-mode: multiply; }
.il-bant p { font: 600 15pt/1.2 'Oswald'; color: var(--d); } .il-bant span { display: block; font: 400 9.5pt/1.4 'Inter'; color: var(--g); margin-top: 1.5mm; }
`;

const CSS_TELEFON = `
@page { size: 90mm 160mm; margin: 0; }
body { font-size: 12.5pt; }
.ekran { width: 90mm; height: 160mm; position: relative; overflow: hidden; page-break-after: always; background: var(--z); display: grid; grid-template-rows: auto minmax(0, 1fr) 15mm; }
.t-ust { background: var(--d); color: #fff; padding: 5mm 7mm 4.5mm; position: relative; }
.t-ust .etk { font: 700 8.5pt/1.2 'Inter'; letter-spacing: 1.4pt; text-transform: uppercase; color: var(--ki); margin-bottom: 1.6mm; }
.t-ust h1 { font: 700 22pt/1.05 'Oswald'; } .t-ust i { position: absolute; right: 6mm; top: 5mm; font: 700 10pt 'Oswald'; font-style: normal; color: #8f8b84; }
.t-ic { padding: 4mm 6mm; display: flex; flex-direction: column; gap: 2.6mm; min-height: 0; overflow: hidden; }
.t-bar { display: grid; grid-template-columns: 1.6fr 1fr; }
.t-bar a { display: flex; align-items: center; justify-content: center; gap: 2mm; font: 700 11.5pt 'Inter'; color: #fff; } .t-bar svg { width: 5.5mm; height: 5.5mm; }
.t-bar a:first-child { background: var(--k); } .t-bar a:last-child { background: var(--d); }
.t-foto { background: #fff; border-radius: 2.5mm; padding: 2mm; height: 46mm; display: flex; flex-direction: column; flex: none; }
.t-foto img { flex: 1; min-height: 0; width: 100%; object-fit: contain; } .t-foto.dek img { mix-blend-mode: multiply; }
.t-foto.kisa { height: 30mm; } .t-foto.kisa img { mix-blend-mode: normal; }
.t-neden .kanit { margin-top: 1mm; font: 600 10pt/1.35 'Inter'; color: var(--k); }
.sikisik .t-isler p { padding: 1mm 0; }
.t-foto figcaption { font-size: 10pt; color: var(--g); text-align: center; margin-top: 1mm; } .t-foto.cer { background: var(--d); } .t-foto.cer figcaption { color: #CFCAC2; }
.fayda { font: 500 17pt/1.2 'Oswald'; }
.t-metin { font-size: 12pt; line-height: 1.5; color: #3A3A3D; }
blockquote { font: 500 13.5pt/1.3 'Oswald'; border-left: 1.4mm solid var(--k); padding-left: 3.5mm; }
.kul { grid-template-columns: 1fr 1fr; gap: 2mm 2mm; } .kul li { font-size: 11pt; } .kul i { width: 8mm; height: 8mm; }
.kimler, .neden-u li, .secenek li { font-size: 11.5pt; }
.t-neden { display: flex; gap: 3mm; background: #fff; border-radius: 2mm; padding: 2.4mm 3mm; }
.t-neden i { width: 10mm; height: 10mm; border-radius: 50%; background: #FBEAEC; display: grid; place-items: center; flex: none; } .t-neden svg { width: 5.5mm; height: 5.5mm; }
.t-neden h3 { font: 600 13.5pt/1.15 'Oswald'; margin-bottom: .5mm; } .t-neden p { font-size: 10.2pt; line-height: 1.38; }
.t-isler p { font-size: 10.5pt; line-height: 1.4; padding: 1.5mm 0; border-top: .3mm solid var(--c); } .t-isler b { display: block; font: 600 12pt 'Oswald'; }
.t-liste { display: flex; flex-direction: column; gap: 1.6mm; }
.t-liste a { display: flex; align-items: center; gap: 3mm; background: #fff; border-radius: 2mm; padding: 1.2mm 2.5mm 1.2mm 1.2mm; }
.tl-foto { width: 16mm; height: 11mm; flex: none; background: var(--d); border-radius: 1.2mm; overflow: hidden; } .tl-foto.dek { background: #fff; }
.tl-foto img { width: 100%; height: 100%; object-fit: contain; } .tl-foto.dek img { mix-blend-mode: multiply; }
.tl-yazi { flex: 1; font-size: 9.5pt; line-height: 1.3; color: var(--g); } .tl-yazi b { display: block; font: 600 12pt/1.15 'Oswald'; color: var(--d); }
.t-liste svg { width: 4.5mm; height: 4.5mm; stroke: var(--k); flex: none; } .t-liste .tl-mini { padding: 3mm; border-left: 1.4mm solid var(--k); }
.t-is p { background: #fff; border-radius: 2mm; padding: 1.1mm 2.6mm; margin-bottom: .9mm; } .t-is b { display: block; font: 600 11.5pt/1.15 'Oswald'; margin-bottom: .2mm; }
.t-is a { display: inline-block; font: 600 10pt/1.25 'Inter'; color: var(--k); margin-right: 3mm; }
.t-not { font-size: 10.5pt; color: var(--g); }
.t-cta { margin-top: auto; font: 600 13pt/1.25 'Oswald'; color: var(--k); }
.secim.tel { padding: 3mm 3.5mm; } .secim.tel h3 { font-size: 14pt; margin-bottom: 1mm; } .secim.tel li { font-size: 11pt; } .secim.tel ol { gap: 1.2mm; } .secim.tel .son { margin-top: 1.6mm; }
.ekran .secenek li { font-size: 10.5pt; padding: .5mm 0; }
.t-model { background: #fff; border-radius: 2mm; padding: 2.5mm 3mm; } .t-model b { display: block; font: 600 12pt 'Oswald'; margin-bottom: 1mm; }
.t-model p { display: flex; justify-content: space-between; gap: 2mm; font-size: 10.5pt; padding: .9mm 0; border-top: .3mm solid var(--c); } .t-model p.hp em { color: var(--k); font-weight: 700; } .t-model em { font-style: normal; font-weight: 600; }
.t-dg { background: #fff; border-left: 1.4mm solid var(--k); border-radius: 0 2mm 2mm 0; padding: 1.8mm 3mm; } .t-dg h3 { font: 600 13pt/1.15 'Oswald'; } .t-dg p { font-size: 10.5pt; line-height: 1.4; }
.t-adim { display: grid; gap: 1.6mm; } .t-adim li { display: flex; align-items: center; gap: 3mm; background: #fff; border-radius: 2mm; padding: 1.8mm 3mm; font: 600 11.5pt/1.25 'Inter'; }
.t-adim b { width: 8mm; height: 8mm; border-radius: 50%; background: var(--k); color: #fff; display: grid; place-items: center; font: 700 12pt 'Oswald'; flex: none; }
.t-sahadan { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; } .t-sahadan img { width: 100%; height: 30mm; object-fit: cover; border-radius: 1.5mm; border-bottom: 1mm solid var(--k); }
.t-sahadan figcaption { font-size: 9pt; line-height: 1.3; color: var(--g); margin-top: 1mm; }
.t-soru { padding: 1.8mm 0; border-bottom: .3mm solid var(--c); } .t-soru h3 { font: 700 11.5pt/1.3 'Inter'; margin-bottom: .6mm; } .t-soru p { font-size: 10.5pt; line-height: 1.42; color: #3A3A3D; }
.t-tel { font: 700 27pt/1 'Oswald'; color: var(--k); }
.t-dl { display: grid; gap: .3mm; font-size: 10.5pt; } .t-dl dt { font-size: 8.5pt; letter-spacing: 1pt; text-transform: uppercase; color: var(--g); margin-top: 1mm; }
.t-linkler { display: grid; gap: 1.6mm; } .t-linkler a { display: flex; align-items: center; gap: 2.5mm; background: #fff; border-radius: 2mm; padding: 2.2mm 3mm; font: 600 11.5pt 'Inter'; } .t-linkler svg { width: 5mm; height: 5mm; }
.t-kapak { background: var(--d); color: #fff; grid-template-rows: auto minmax(0, 1fr) auto 15mm; }
.tk-ust { padding: 7mm 7mm 4mm; } .t-kapak .marka-satir img { height: 11mm; } .t-kapak .marka-satir b { font-size: 11.5pt; letter-spacing: 1.2pt; white-space: nowrap; } .t-kapak .marka-satir span { font-size: 8.5pt; }
.t-kapak .k-ust { margin-top: 8mm; font: 700 10pt/1 'Inter'; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--ki); }
.t-kapak h1 { font: 700 27pt/1.05 'Oswald'; margin-top: 2.5mm; } .t-kapak .k-alt { font-size: 11.5pt; color: #CFCAC2; margin-top: 3mm; }
.tk-urun { width: 100%; height: 100%; min-height: 0; object-fit: contain; background: #fff; padding: 3mm; mix-blend-mode: normal; border-top: 1.6mm solid var(--k); }
.tk-git { display: flex; align-items: center; justify-content: center; gap: 2mm; background: var(--d); padding: 3.5mm; font: 600 13pt 'Oswald'; letter-spacing: .5pt; } .tk-git svg { width: 5mm; height: 5mm; }
/* telefon: en küçük yazı 10 pt */
.tk-tel { display: block; margin-top: 3mm; font: 700 19pt/1 'Oswald'; letter-spacing: .4pt; } .tk-tel span { display: block; font: 400 10pt 'Inter'; color: #a3a19c; margin-top: 1mm; }
.t-ust .etk { font-size: 10pt; letter-spacing: .6pt; }
.ekran .ara, .ekran .kimler b { font-size: 10pt; letter-spacing: .8pt; }
.t-sahadan figcaption { font-size: 10pt; } .tl-yazi { font-size: 10pt; } .t-dl dt { font-size: 10pt; letter-spacing: .4pt; }
.ekran .marka-satir span { font-size: 10pt; letter-spacing: .4pt; }
`;

function sarmala(tur, govde, css) {
  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${esc(FIRMA.ad)} — Ürün Kataloğu 2026${tur === 'telefon' ? ' (Telefon)' : ''}</title>
${['oswald/500.css', 'oswald/600.css', 'oswald/700.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('\n')}
<style>${CSS_ORTAK}${css}</style></head><body>${govde}</body></html>`;
}

// ---------- üretim + denetim ----------
async function uret(tarayici, html, ad, w, h, sinif) {
  const dosya = join(CIKTI, `${ad}.html`);
  writeFileSync(dosya, html);
  const s = await tarayici.newPage();
  await s.goto(url(dosya), { waitUntil: 'networkidle' });
  await s.evaluate(() => document.fonts.ready);
  const sorun = await s.evaluate((sinif) => {
    const out = [];
    const mm = 96 / 25.4;
    document.querySelectorAll(sinif).forEach((p, i) => {
      const pr = p.getBoundingClientRect();
      const engel = [...p.querySelectorAll(':scope > .alt, :scope > .cta, :scope > .t-bar, :scope > .il-bant')].map((e) => e.getBoundingClientRect().top);
      const sinir = Math.min(pr.bottom, ...engel);
      p.querySelectorAll('.govde, .govde > *, .t-ic > *, .ua-sag > *, .ub-sol > *, .ut-sag > *, .k-sol, .il-sol, .il-sag').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height && r.bottom > sinir + 1 && !el.closest('.cta')) out.push(`sayfa ${i + 1}: ${el.className || el.tagName} ${Math.round((r.bottom - sinir) / mm)} mm taşıyor`);
        if (r.right > pr.right + 1) out.push(`sayfa ${i + 1}: ${el.className || el.tagName} sağdan taşıyor`);
      });
      p.querySelectorAll('.t-ic').forEach((el) => { if (el.scrollHeight > el.clientHeight + 2) out.push(`ekran ${i + 1}: içerik ${Math.round((el.scrollHeight - el.clientHeight) / mm)} mm sığmıyor`); });
      const h1 = p.querySelector('.ust h1'); const ko = p.querySelector('.ust-koyu');
      if (h1 && ko && h1.getBoundingClientRect().right > ko.getBoundingClientRect().left + ko.getBoundingClientRect().width * .9) out.push(`sayfa ${i + 1}: başlık koyu alandan taşıyor`);
      p.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push(`sayfa ${i + 1}: görsel yüklenmedi ${im.src}`); });
      // 9 pt altı yazı (rozetler hariç)
      p.querySelectorAll('p, span, li, a, td, th, figcaption, dd, dt, b, small, em').forEach((el) => {
        const fs = parseFloat(getComputedStyle(el).fontSize) * 0.75;
        if (el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && fs < 8.4 && !el.closest('.bek')) out.push(`sayfa ${i + 1}: küçük yazı ${fs.toFixed(1)} pt "${el.textContent.trim().slice(0, 30)}"`);
      });
    });
    return [...new Set(out)];
  }, sinif);
  if (sorun.length) console.warn(`UYARI (${ad}):\n` + sorun.join('\n'));
  await s.pdf({ path: join(CIKTI, `${ad}.pdf`), width: w, height: h, printBackground: true, preferCSSPageSize: true });
  await s.close();
  return sorun.length;
}

mkdirSync(CIKTI, { recursive: true });
const ek = TASLAK ? '-TASLAK' : '';
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
await uret(tarayici, await yatay(), `Ucel-Urun-Katalogu-2026${ek}`, '420mm', '210mm', '.page');
await uret(tarayici, await telefon(), `Ucel-Urun-Katalogu-2026-Telefon${ek}`, '90mm', '160mm', '.ekran');
await tarayici.close();
console.log(`yazıldı: cikti/Ucel-Urun-Katalogu-2026${ek}.pdf (${TOPLAM} sayfa) ve -Telefon${ek}.pdf`);
