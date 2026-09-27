// Üçel e-katalog sayfa üretici.
// Depo kökünden çalıştırın:  node ucel-romork/_kaynak/build.mjs
// Veri: ./veri.mjs · Çıktı: ucel-romork/ altındaki HTML sayfaları ve sitemap.xml
import { writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIRMA, KATEGORILER, KULLANIM, URUNLER, SAHADAN } from './veri.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..');
const SURUM = '2'; // CSS/JS önbellek kırıcı

/* ---------- yardımcılar ---------- */
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kat = (id) => KATEGORILER.find((k) => k.id === id);
const urun = (id) => URUNLER.find((u) => u.id === id);
const urunYolu = (u) => `urunler/${u.id}/`;
const katYolu = (k) => `urunler/${k.id}/`;
const mutlak = (yol) => FIRMA.site + yol;
const wa = (mesaj) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(mesaj)}`;

const MESAJ = {
  genel: 'Merhaba, Üçel e-kataloğunu inceledim, bilgi almak istiyorum.',
  fiyat: (u) => `Merhaba, "${u.ad}" için fiyat ve teknik bilgi almak istiyorum.\n${mutlak(urunYolu(u))}`,
  uygun: (u) => `Merhaba, "${u.ad}" traktörüme uygun mu?\nTraktörüm (marka/model): \n${mutlak(urunYolu(u))}`,
  teknik: (u) => `Merhaba, "${u.ad}" için ölçü ve kapasite seçeneklerini öğrenmek istiyorum.\n${mutlak(urunYolu(u))}`,
  ozel: (u) => `Merhaba, "${u.ad}" için renk/yazı/ölçü seçeneklerini konuşmak istiyorum.\n${mutlak(urunYolu(u))}`,
  sahadan: 'Merhaba, sahadaki ürünlerinizi gördüm, bilgi almak istiyorum.',
};

const IKON = {
  wa: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .78.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.25-.12-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.77.96-.14.17-.28.19-.53.07a6.7 6.7 0 0 1-3.3-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43l-.75-1.8c-.2-.48-.4-.4-.55-.41h-.47a.9.9 0 0 0-.65.3 2.7 2.7 0 0 0-.85 2.02 4.7 4.7 0 0 0 1 2.5 10.8 10.8 0 0 0 4.1 3.63c1.54.66 2.14.72 2.9.6.47-.07 1.45-.6 1.65-1.17.2-.57.2-1.06.14-1.17-.06-.1-.22-.16-.47-.28z"/></svg>',
  tel: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
  pin: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>',
  liste: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 5h4v4H4zm6 1h10v2H10zM4 10h4v4H4zm6 1h10v2H10zm-6 4h4v4H4zm6 1h10v2H10z"/></svg>',
  onay: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6L20.1 8.4 18.7 7z"/></svg>',
};

const btnWa = (href, metin, sinif = 'btn btn-wa') => `<a class="${sinif}" href="${href}" target="_blank" rel="noopener">${IKON.wa}<span>${esc(metin)}</span></a>`;
const img = (p, ad, alt, { kart = false, lazy = true, w, h, sinif = '' } = {}) =>
  `<img${sinif ? ` class="${sinif}"` : ''} src="${p}img/${ad}${kart ? '-k' : ''}.webp" alt="${esc(alt)}"${w ? ` width="${w}" height="${h}"` : ''}${lazy ? ' loading="lazy"' : ''} decoding="async">`;

/* ---------- iskelet ---------- */
function sayfa({ yol, title, desc, og = 'ana', govde, jsonld = [], aktif = '' }) {
  const p = '../'.repeat(yol.split('/').filter(Boolean).length); // göreli kök
  const canonical = mutlak(yol);
  const ld = jsonld.map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="${esc(FIRMA.ad)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${FIRMA.site}img/og/${og}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#1C211D">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${p}assets/site.css?v=${SURUM}">
${ld}
</head>
<body>
<a class="skip" href="#icerik">İçeriğe geç</a>
<header class="top">
  <div class="wrap top-in">
    <a class="brand" href="${p || './'}" aria-label="${esc(FIRMA.ad)} ana sayfa">
      <span class="brand-mark">ÜÇEL</span>
      <span class="brand-sub">Tarım Aletleri<br>${esc(FIRMA.ilce)}</span>
    </a>
    <nav class="nav" aria-label="Ana menü">
      <a href="${p}#urunler"${aktif === 'urunler' ? ' aria-current="page"' : ''}>Ürünler</a>
      <a href="${p}sahadan/"${aktif === 'sahadan' ? ' aria-current="page"' : ''}>Sahadan</a>
      <a href="${p}iletisim/"${aktif === 'iletisim' ? ' aria-current="page"' : ''}>İletişim</a>
    </nav>
    ${btnWa(wa(MESAJ.genel), 'WhatsApp', 'btn btn-wa btn-sm top-wa')}
  </div>
</header>
<main id="icerik">
${govde(p)}
</main>
<footer class="foot">
  <div class="wrap foot-in">
    <div>
      <p class="foot-brand">${esc(FIRMA.ad)}</p>
      <p>${esc(FIRMA.yer)}<br>Telefon ve WhatsApp: <a href="tel:${FIRMA.telefonE164}">${FIRMA.telefon}</a></p>
    </div>
    <nav class="foot-nav" aria-label="Alt menü">
      ${KATEGORILER.map((k) => `<a href="${p}${katYolu(k)}">${esc(k.ad)}</a>`).join('')}
      <a href="${p}sahadan/">Sahadan</a>
      <a href="${p}iletisim/">İletişim</a>
    </nav>
  </div>
</footer>
<nav class="dock" aria-label="Hızlı iletişim">
  <a href="tel:${FIRMA.telefonE164}">${IKON.tel}<span>Ara</span></a>
  <a class="dock-wa" href="${wa(MESAJ.genel)}" target="_blank" rel="noopener">${IKON.wa}<span>WhatsApp</span></a>
  <a href="${p}#urunler">${IKON.liste}<span>Ürünler</span></a>
</nav>
<script src="${p}assets/site.js?v=${SURUM}" defer></script>
</body>
</html>
`;
}

const breadcrumbLd = (parcalar) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: parcalar.map(([ad, yol], i) => ({ '@type': 'ListItem', position: i + 1, name: ad, item: mutlak(yol) })),
});
const breadcrumbHtml = (p, parcalar) => `<nav class="crumb" aria-label="Konum"><ol>${parcalar.map(([ad, yol], i) =>
  i === parcalar.length - 1 ? `<li aria-current="page">${esc(ad)}</li>` : `<li><a href="${p}${yol}">${esc(ad)}</a></li>`).join('')}</ol></nav>`;

/* ---------- bileşenler ---------- */
function urunKarti(p, u, { baslikSeviye = 'h3' } = {}) {
  const [foto, alt] = u.foto[0];
  return `<article class="card" data-kullanim="${u.kullanim.join(' ')}">
  <a class="card-link" href="${p}${urunYolu(u)}">
    <div class="card-media">${img(p, foto, alt, { kart: true })}${u.foto.length > 1 ? `<span class="card-count">${u.foto.length} fotoğraf</span>` : ''}</div>
    <div class="card-body">
      <p class="eyebrow">${esc(kat(u.kategori).ad)}</p>
      <${baslikSeviye} class="card-title">${esc(u.ad)}</${baslikSeviye}>
      <p class="card-ozet">${u.ozet.map(esc).join(' · ')}</p>
    </div>
  </a>
  <div class="card-cta">${btnWa(wa(MESAJ.fiyat(u)), 'Fiyatını sor', 'btn btn-wa btn-block')}</div>
</article>`;
}

const surecBlok = () => `<section class="band">
  <div class="wrap">
    <h2>Nasıl ilerliyoruz?</h2>
    <ol class="steps">
      <li><b>01</b><h3>İhtiyacınızı anlatın.</h3><p>Ne taşıyacağınızı, traktörünüzü ve arazinizi yazın.</p></li>
      <li><b>02</b><h3>Size uygun ürünü birlikte belirleyelim.</h3><p>Ölçü, renk ve yazıyı sizinle konuşarak netleştiriyoruz.</p></li>
      <li><b>03</b><h3>Fiyat, özellik ve teslimatı netleştirelim.</h3><p>Her şey açık olduktan sonra siparişe geçiyoruz.</p></li>
    </ol>
    ${btnWa(wa(MESAJ.genel), "WhatsApp'tan görüşelim")}
  </div>
</section>`;

const iletisimBlok = (p) => `<section class="contact">
  <div class="wrap contact-in">
    <div>
      <h2>Aklınıza takılanı sorun</h2>
      <p>Ürün, ölçü, fiyat… Telefonla ya da WhatsApp'tan doğrudan bize ulaşın.</p>
      <p class="tel-text">${IKON.tel}<span>${FIRMA.telefon}</span></p>
    </div>
    <div class="contact-btns">
      ${btnWa(wa(MESAJ.genel), "WhatsApp'tan yaz", 'btn btn-wa btn-lg')}
      <a class="btn btn-line-light btn-lg" href="tel:${FIRMA.telefonE164}">${IKON.tel}<span>Ara</span></a>
      <a class="btn btn-line-light btn-lg" href="${FIRMA.harita}" target="_blank" rel="noopener">${IKON.pin}<span>Yol tarifi</span></a>
    </div>
  </div>
</section>`;

/* ---------- ana sayfa ---------- */
function anaSayfa() {
  const one = URUNLER.filter((u) => u.one);
  const ld = [{
    '@context': 'https://schema.org', '@type': 'Store', name: FIRMA.ad, telephone: FIRMA.telefonE164,
    url: FIRMA.site, image: `${FIRMA.site}img/og/ana.jpg`,
    address: { '@type': 'PostalAddress', addressLocality: FIRMA.ilce, addressRegion: FIRMA.il, addressCountry: 'TR' },
  }];
  return sayfa({
    yol: '', og: 'ana', aktif: 'urunler', jsonld: ld,
    title: 'Üçel Tarım Aletleri | Göksun Römork ve Tarım Ekipmanları',
    desc: "Göksun'da tarım römorku, su tankeri, traktör ön yükleyici ve toprak işleme aletleri. Ürünleri inceleyin, WhatsApp'tan bilgi alın.",
    govde: (p) => `
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="eyebrow">${esc(FIRMA.ad)} · ${esc(FIRMA.yer)}</p>
      <h1>Tarlada da yolda da sağlam iş.</h1>
      <p class="lead">Göksun'da tarımın ihtiyacına göre römork ve tarım ekipmanları. Rengini, yazısını birlikte seçelim.</p>
      <div class="hero-cta">
        <a class="btn btn-dark btn-lg" href="#urunler">Ürünleri incele</a>
        ${btnWa(wa(MESAJ.genel), "WhatsApp'tan bilgi al", 'btn btn-wa btn-lg')}
      </div>
    </div>
    <figure class="hero-media">
      ${img(p, 'tarim-romorku-yesil', 'Yeşil tarım römorku, kasasında ÜÇEL SANAYİ GÖKSUN yazısı', { lazy: false, w: 1123, h: 785 })}
      <figcaption>Müşterimize teslim edilen tarım römorku. Kasa rengi ve yazısı müşterinin isteğiyle.</figcaption>
    </figure>
  </div>
</section>

<section class="cats" aria-labelledby="kat-baslik">
  <div class="wrap">
    <h2 id="kat-baslik" class="sr-only">Kategoriler</h2>
    <div class="cat-grid">
      ${KATEGORILER.map((k) => {
        const liste = URUNLER.filter((u) => u.kategori === k.id);
        const [foto, alt] = liste[0].foto[0];
        return `<a class="cat" href="${p}${katYolu(k)}">${img(p, foto, alt, { kart: true })}<span class="cat-name">${esc(k.ad)}</span><span class="cat-count">${liste.length} ürün</span></a>`;
      }).join('')}
    </div>
  </div>
</section>

<section class="trust" aria-label="Neden Üçel">
  <div class="wrap trust-in">
    <ul class="trust-list">
      <li>${IKON.onay}<span><b>Göksun'daki atölyemizde yapıyoruz.</b> Römorklarımız ÜÇEL SANAYİ GÖKSUN yazısıyla çıkıyor.</span></li>
      <li>${IKON.onay}<span><b>Renk ve kasa yazısı size özel.</b> Adınız, firmanız ya da "Maşallah".</span></li>
      <li>${IKON.onay}<span><b>Farklı marka traktörlere kepçe montajı.</b> Kubota ve diğer markalardan örnekler.</span></li>
      <li>${IKON.onay}<span><b>Doğrudan bize ulaşın.</b> ${FIRMA.telefon}</span></li>
    </ul>
    <figure class="trust-media">${img(p, 'on-yukleyici-atolye', 'Üçel atölyesi önünde, mavi traktöre takılı kırmızı ön yükleyici', { kart: true })}<figcaption>Üçel atölyesi, Göksun</figcaption></figure>
  </div>
</section>

<section class="products" id="urunler" aria-labelledby="urun-baslik">
  <div class="wrap">
    <div class="sec-head">
      <h2 id="urun-baslik">Ürünler</h2>
      <p>Hangi iş için arıyorsunuz?</p>
    </div>
    <div class="filters" role="group" aria-label="Kullanım alanına göre süz">
      <button type="button" class="chip" data-filtre="hepsi" aria-pressed="true">Tümü</button>
      ${KULLANIM.map((k) => `<button type="button" class="chip" data-filtre="${k.id}" aria-pressed="false">${esc(k.ad)}</button>`).join('')}
    </div>
    <div class="grid" id="urunGrid">
      ${URUNLER.map((u) => urunKarti(p, u)).join('\n')}
    </div>
  </div>
</section>

<section class="field">
  <div class="wrap">
    <div class="sec-head">
      <h2>Sadece katalogda değil, sahada da.</h2>
      <p>Müşterilerimize teslim ettiğimiz ürünler, kendi traktörlerinin yanında.</p>
    </div>
    <div class="field-grid">
      ${SAHADAN.slice(0, 4).map(([foto, yazi]) => `<figure>${img(p, foto, yazi, { kart: true })}<figcaption>${esc(yazi)}</figcaption></figure>`).join('')}
    </div>
    <a class="btn btn-line" href="${p}sahadan/">Tüm saha fotoğrafları</a>
  </div>
</section>

${surecBlok()}
${iletisimBlok(p)}
<script>
  // Eski tek sayfalık katalogdaki ürün bağlantılarını (#kultivator vb.) yeni sayfalara yönlendir
  (function () {
    var eski = ${JSON.stringify(Object.fromEntries(URUNLER.map((u) => [u.eskiId, urunYolu(u)])))};
    var h = location.hash.slice(1);
    if (eski[h]) location.replace(eski[h]);
  })();
</script>`,
  });
}

/* ---------- kategori sayfası ---------- */
function kategoriSayfasi(k) {
  const liste = URUNLER.filter((u) => u.kategori === k.id);
  const yol = katYolu(k);
  const parcalar = [['Ana sayfa', ''], [k.ad, yol]];
  return sayfa({
    yol, og: 'ana', aktif: 'urunler', title: k.seoTitle, desc: k.seoDesc, jsonld: [breadcrumbLd(parcalar)],
    govde: (p) => `
<section class="page-head">
  <div class="wrap">
    ${breadcrumbHtml(p, parcalar)}
    <h1>${esc(k.ad)}</h1>
    <p class="lead">${esc(k.giris)}</p>
  </div>
</section>
<section class="products">
  <div class="wrap">
    <div class="grid">${liste.map((u) => urunKarti(p, u, { baslikSeviye: 'h2' })).join('\n')}</div>
  </div>
</section>
${surecBlok()}
${iletisimBlok(p)}`,
  });
}

/* ---------- ürün sayfası ---------- */
function urunSayfasi(u) {
  const k = kat(u.kategori);
  const yol = urunYolu(u);
  const parcalar = [['Ana sayfa', ''], [k.ad, katYolu(k)], [u.ad, yol]];
  const bilinen = Object.entries(u.teknik).filter(([, v]) => v);
  const eksikVar = Object.values(u.teknik).some((v) => !v);
  const benzer = URUNLER.filter((x) => x.id !== u.id && (x.kategori === u.kategori || x.kullanim.some((y) => u.kullanim.includes(y)))).slice(0, 3);
  const title = `${u.ad} | Üçel Tarım Aletleri Göksun`;
  const desc = `${u.deger} Fiyat ve bilgi için WhatsApp'tan yazın.`.slice(0, 158);
  const ld = [breadcrumbLd(parcalar), {
    '@context': 'https://schema.org', '@type': 'Product', name: u.ad, description: u.deger, category: k.ad,
    brand: { '@type': 'Brand', name: 'Üçel' }, image: u.foto.map(([f]) => `${FIRMA.site}img/${f}.webp`), url: mutlak(yol),
  }];
  return sayfa({
    yol, og: u.id, aktif: 'urunler', title, desc, jsonld: ld,
    govde: (p) => `
<section class="pd">
  <div class="wrap">
    ${breadcrumbHtml(p, parcalar)}
    <div class="pd-top">
      <div class="gallery" data-galeri>
        <div class="gallery-main">
          ${img(p, u.foto[0][0], u.foto[0][1], { lazy: false, sinif: 'gallery-img' })}
          ${u.foto.length > 1 ? `<span class="gallery-count" aria-live="polite">1 / ${u.foto.length}</span>
          <button type="button" class="gallery-nav prev" aria-label="Önceki fotoğraf">&#8249;</button>
          <button type="button" class="gallery-nav next" aria-label="Sonraki fotoğraf">&#8250;</button>` : ''}
        </div>
        ${u.foto.length > 1 ? `<div class="thumbs">${u.foto.map(([f, alt], i) =>
          `<a href="${p}img/${f}.webp" data-i="${i}" data-alt="${esc(alt)}"${i === 0 ? ' aria-current="true"' : ''}>${img(p, f, '', { kart: true })}</a>`).join('')}</div>` : ''}
      </div>
      <div class="pd-info">
        <p class="eyebrow">${esc(k.ad)}</p>
        <h1>${esc(u.ad)}</h1>
        <p class="pd-ozet">${u.ozet.map(esc).join(' · ')}</p>
        <p class="lead">${esc(u.deger)}</p>
        <div class="pd-cta">
          ${btnWa(wa(MESAJ.fiyat(u)), 'Bu ürünün fiyatını sor', 'btn btn-wa btn-lg btn-block')}
          ${btnWa(wa(MESAJ.uygun(u)), 'Traktörüme uygun mu?', 'btn btn-line btn-lg btn-block')}
        </div>
        <p class="tel-note">Telefon: <a href="tel:${FIRMA.telefonE164}">${FIRMA.telefon}</a></p>
      </div>
    </div>
  </div>
</section>

<section class="pd-sec">
  <div class="wrap pd-cols">
    <div>
      <h2>Bu ürün ne işinize yarar?</h2>
      <ul class="ticks">${u.faydalar.map((f) => `<li>${IKON.onay}<span>${esc(f)}</span></li>`).join('')}</ul>
    </div>
    <div class="fit">
      <h2>Size uygun olabilir</h2>
      <ul class="ticks">${u.uygunluk.map((f) => `<li>${IKON.onay}<span>${esc(f)}</span></li>`).join('')}</ul>
      <p>Emin değilseniz traktörünüzün marka ve modelini yazın, birlikte bakalım.</p>
      ${btnWa(wa(MESAJ.uygun(u)), 'Traktörüme uygun mu?', 'btn btn-green')}
    </div>
  </div>
</section>

<section class="pd-sec">
  <div class="wrap pd-cols">
    <div>
      <h2>Teknik bilgiler</h2>
      ${bilinen.length ? `<dl class="specs">${bilinen.map(([a, v]) => `<div><dt>${esc(a)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : ''}
      ${eksikVar ? `<p>${bilinen.length ? 'Diğer ölçü ve kapasite seçeneklerini' : 'Ölçü ve kapasite seçeneklerini'} ihtiyacınıza göre birlikte belirliyoruz.</p>
      ${btnWa(wa(MESAJ.teknik(u)), 'Teknik bilgi al', 'btn btn-line')}` : ''}
    </div>
    <div>
      ${u.secenekler.length ? `<h2>Size özel</h2>
      <ul class="ticks">${u.secenekler.map((f) => `<li>${IKON.onay}<span>${esc(f)}</span></li>`).join('')}</ul>
      ${btnWa(wa(MESAJ.ozel(u)), 'Renk ve yazı için görüş', 'btn btn-line')}` : ''}
      <h2 class="${u.secenekler.length ? 'mt' : ''}">Fiyat nasıl belirlenir?</h2>
      <p>Fiyat; ölçüye, donanıma ve seçtiğiniz özelliklere göre değişiyor. Ürünü ve traktörünüzü yazın, size güncel fiyatı iletelim.</p>
    </div>
  </div>
</section>

<section class="pd-sec quote">
  <div class="wrap">
    <h2>Teklif isteyin</h2>
    <p>Bilgileri doldurun, WhatsApp'ta hazır mesaj olarak açılsın. Göndermeden önce değiştirebilirsiniz.</p>
    <form class="quote-form" data-teklif data-urun="${esc(u.ad)}" data-link="${mutlak(yol)}" data-wa="${FIRMA.whatsapp}">
      <label>Adet<input id="adet" name="adet" type="number" min="1" value="1" inputmode="numeric"></label>
      <label>Traktör (marka / model)<input id="traktor" name="traktor" type="text" autocomplete="off" placeholder="Örn. New Holland 65-56"></label>
      <label>Yer (ilçe / köy)<input id="yer" name="yer" type="text" autocomplete="address-level2" placeholder="Örn. Göksun"></label>
      <label class="full">Not<textarea id="not" name="not" rows="2" placeholder="Ne taşıyacağınız, istediğiniz renk…"></textarea></label>
      <button class="btn btn-wa btn-lg" type="submit">${IKON.wa}<span>WhatsApp'ta teklif iste</span></button>
    </form>
  </div>
</section>

${benzer.length ? `<section class="products">
  <div class="wrap">
    <h2>Benzer ürünler</h2>
    <div class="grid">${benzer.map((x) => urunKarti(p, x)).join('\n')}</div>
  </div>
</section>` : ''}
${iletisimBlok(p)}`,
  });
}

/* ---------- sahadan ---------- */
function sahadanSayfasi() {
  const yol = 'sahadan/';
  const parcalar = [['Ana sayfa', ''], ['Sahadan', yol]];
  return sayfa({
    yol, og: 'ana', aktif: 'sahadan', jsonld: [breadcrumbLd(parcalar)],
    title: 'Sahadan Teslimatlar | Üçel Tarım Aletleri Göksun',
    desc: 'Üçel römork ve tarım aletlerinin gerçek teslimat ve saha fotoğrafları. Müşterilerimizin traktörlerinin yanında.',
    govde: (p) => `
<section class="page-head">
  <div class="wrap">
    ${breadcrumbHtml(p, parcalar)}
    <h1>Sadece katalogda değil, sahada da.</h1>
    <p class="lead">Müşterilerimize teslim ettiğimiz ürünler. Her fotoğrafın altında ürünün sayfasına bağlantı var.</p>
  </div>
</section>
<section class="field">
  <div class="wrap">
    <div class="field-grid field-grid-lg">
      ${SAHADAN.map(([foto, yazi, uid]) => `<figure>${img(p, foto, yazi, { kart: true })}<figcaption>${esc(yazi)} <a href="${p}${urunYolu(urun(uid))}">${esc(urun(uid).ad)} →</a></figcaption></figure>`).join('')}
    </div>
    ${btnWa(wa(MESAJ.sahadan), "WhatsApp'tan bilgi al")}
  </div>
</section>
${iletisimBlok(p)}`,
  });
}

/* ---------- iletişim ---------- */
function iletisimSayfasi() {
  const yol = 'iletisim/';
  const parcalar = [['Ana sayfa', ''], ['İletişim', yol]];
  return sayfa({
    yol, og: 'ana', aktif: 'iletisim', jsonld: [breadcrumbLd(parcalar)],
    title: 'İletişim | Üçel Tarım Aletleri Göksun',
    desc: `Üçel Tarım Aletleri, ${FIRMA.yer}. Telefon ve WhatsApp: ${FIRMA.telefon}.`,
    govde: (p) => `
<section class="page-head">
  <div class="wrap">
    ${breadcrumbHtml(p, parcalar)}
    <h1>İletişim</h1>
    <p class="lead">En hızlı yol WhatsApp. Ürünün adını ve traktörünüzü yazmanız yeterli.</p>
  </div>
</section>
<section class="pd-sec">
  <div class="wrap pd-cols">
    <dl class="specs nap">
      <div><dt>Firma</dt><dd>${esc(FIRMA.ad)}</dd></div>
      <div><dt>Yer</dt><dd>${esc(FIRMA.yer)}</dd></div>
      <div><dt>Telefon / WhatsApp</dt><dd><a href="tel:${FIRMA.telefonE164}">${FIRMA.telefon}</a></dd></div>
    </dl>
    <div class="stack">
      ${btnWa(wa(MESAJ.genel), "WhatsApp'tan yaz", 'btn btn-wa btn-lg btn-block')}
      <a class="btn btn-line btn-lg btn-block" href="tel:${FIRMA.telefonE164}">${IKON.tel}<span>Ara: ${FIRMA.telefon}</span></a>
      <a class="btn btn-line btn-lg btn-block" href="${FIRMA.harita}" target="_blank" rel="noopener">${IKON.pin}<span>Haritada yol tarifi al</span></a>
    </div>
  </div>
</section>`,
  });
}

/* ---------- yaz ---------- */
function yaz(yol, html) {
  const dosya = join(KOK, yol, 'index.html');
  mkdirSync(dirname(dosya), { recursive: true });
  writeFileSync(dosya, html);
  console.log('yazıldı:', join('ucel-romork', yol, 'index.html'));
}

// Eski tek sayfa dosyaları artık kullanılmıyor
for (const eski of ['katalog.css', 'katalog.js']) {
  if (existsSync(join(KOK, eski))) rmSync(join(KOK, eski));
}
if (existsSync(join(KOK, 'urunler'))) rmSync(join(KOK, 'urunler'), { recursive: true });

yaz('', anaSayfa());
KATEGORILER.forEach((k) => yaz(katYolu(k), kategoriSayfasi(k)));
URUNLER.forEach((u) => yaz(urunYolu(u), urunSayfasi(u)));
yaz('sahadan/', sahadanSayfasi());
yaz('iletisim/', iletisimSayfasi());

const yollar = ['', ...KATEGORILER.map(katYolu), ...URUNLER.map(urunYolu), 'sahadan/', 'iletisim/'];
writeFileSync(join(KOK, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${yollar.map((y) => `  <url><loc>${mutlak(y)}</loc></url>`).join('\n')}
</urlset>
`);
console.log('yazıldı: ucel-romork/sitemap.xml');
