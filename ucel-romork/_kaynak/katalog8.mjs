// Üçel Katalog 8 — tam katalog (12 sayfa, A4 + telefon), katalog7 mini kataloğun kalıbıyla.
// 1 kapak · 2 A ara kapak · 3–5 imalat ürünleri · 6 B ara kapak · 7–10 satış ürünleri · 11 hizmetler · 12 arka kapak
// Metinler sitede onaylı metinlerden (katalog2-veri.mjs). Teknik değerler uydurulmaz: "Form ile eklenecek".
// Çalıştırma: node katalog8.mjs  →  cikti/Ucel-Katalog-2026.pdf, cikti/katalog8/index.html (+ telefon.png)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA } from './katalog2-veri.mjs';
import { STIL } from './katalog-stil.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const SITE_IMG = '/home/user/ucel-tarim-aletleri/katalog/img/';
const SITE_AS = '/home/user/ucel-tarim-aletleri/assets/';
const url = (p) => pathToFileURL(p).href;
const img = (f) => url(SITE_IMG + f);
const yerel = (f) => url(join(BURASI, f));
const font = (p, w) => url(join(BURASI, 'node_modules/@fontsource', p, `${w}.css`));
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (x) => QRCode.toString(x, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1B1B1D', light: '#FFFFFF00' } });
const LOGO = yerel('marka/logo-k3.svg');
const TAPAN = yerel('marka/tapan-cizim-acik.svg');

const disli = (ic, renk = '#C9A66E') => `<svg class="disli" viewBox="0 0 104 104" aria-hidden="true"><g fill="${renk}">${Array.from({ length: 18 }, (_, i) => `<rect x="48" y="4" width="8" height="12" rx="1.5" transform="rotate(${i * 20} 52 52)"/>`).join('')}</g><circle cx="52" cy="52" r="38" fill="none" stroke="${renk}" stroke-width="5"/><text x="52" y="53" text-anchor="middle" dominant-baseline="central" font-family="Oswald" font-weight="700" font-size="${String(ic).length > 1 ? 30 : 34}" fill="${renk}">${ic}</text></svg>`;

const IKON = {
  tahil: '<path d="M12 21V8"/><path d="M12 8c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4zM12 8c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4zM12 13c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4zM12 13c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4zM12 18c-2.5 0-3.5-2-3.5-4 2.5 0 3.5 2 3.5 4zM12 18c2.5 0 3.5-2 3.5-4-2.5 0-3.5 2-3.5 4z"/>',
  yem: '<path d="M7 7h10l2 4v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-8z"/><path d="M5 11h14M9 7l1-3h4l1 3"/>',
  odun: '<circle cx="7.5" cy="16" r="3.5"/><circle cx="16.5" cy="16" r="3.5"/><circle cx="12" cy="9" r="3.5"/><circle cx="7.5" cy="16" r="1"/><circle cx="16.5" cy="16" r="1"/><circle cx="12" cy="9" r="1"/>',
  toprak: '<path d="M3 16c3-2 6 2 9 0s6-2 9 0M3 20c3-2 6 2 9 0s6-2 9 0"/><path d="M12 13V7"/><path d="M12 9c-2 0-3-1.5-3-3 2 0 3 1.5 3 3zM12 8c2 0 3-1.5 3-3-2 0-3 1.5-3 3z"/>',
  tohum: '<path d="M3 18c3-2 6 2 9 0s6-2 9 0"/><ellipse cx="7" cy="11" rx="1.6" ry="2.4" transform="rotate(-20 7 11)"/><ellipse cx="12" cy="9" rx="1.6" ry="2.4"/><ellipse cx="17" cy="11" rx="1.6" ry="2.4" transform="rotate(20 17 11)"/>',
  ot: '<path d="M3 20h18"/><path d="M6 20c0-5 1-9 3-12M10 20c0-6-1-10-3-13M14 20c0-4 1-8 4-11M18 20c0-3-1-6-3-8"/>',
  yukle: '<rect x="4" y="12" width="16" height="8" rx="1"/><path d="M12 9V3M9 6l3-3 3 3"/>',
  ahir: '<path d="M3 11l9-7 9 7v9H3z"/><path d="M9 20v-6h6v6M9 14l6 6M15 14l-6 6"/>',
  malzeme: '<rect x="3" y="13" width="8" height="7" rx="1"/><rect x="13" y="13" width="8" height="7" rx="1"/><rect x="8" y="5" width="8" height="7" rx="1"/>',
  duzle: '<path d="M3 17h18"/><path d="M5 13h14"/><path d="M7 9l-3 4 3 4M17 9l3 4-3 4"/>',
  derin: '<path d="M3 8c3-2 6 2 9 0s6-2 9 0"/><path d="M12 11v9M9 17l3 3 3-3"/>',
  anız: '<path d="M3 20h18"/><path d="M5 20v-5M8 20v-7M11 20v-4M14 20v-6M17 20v-5M20 20v-3"/>',
  kimyasal: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"/><path d="M7.5 15h9"/>',
  organik: '<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19c3-4 6-7 10-9"/>',
  su: '<path d="M12 3c3 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 9 7 12 3z"/>',
  sulama: '<path d="M8 3c2 2.7 4 4.8 4 7a4 4 0 0 1-8 0c0-2.2 2-4.3 4-7z"/><path d="M3 18c3-2 6 2 9 0s6-2 9 0"/><path d="M16 8c1.2 1.6 2.5 2.9 2.5 4.2a2.5 2.5 0 0 1-5 0c0-1.3 1.3-2.6 2.5-4.2z"/>',
  kova: '<path d="M5 8h14l-2 12H7z"/><path d="M5 8c0-3 3-5 7-5s7 2 7 5"/><path d="M9 13c1 1 5 1 6 0"/>',
  renk: '<path d="M12 3c3 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 9 7 12 3z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  yazi: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
  olcu: '<path d="M3 17l14-14 4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
  traktor: '<circle cx="7" cy="16" r="4"/><circle cx="18" cy="17" r="3"/><path d="M5 12V6h6l2 6h6v2"/><path d="M11 6v6"/>',
  arti: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
  konum: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
  ikinci: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
  takas: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>',
  imalat: '<path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6"/>',
  parca: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
  kamyon: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
};
const ikon = (k) => `<svg class="ik" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IKON[k]}</svg>`;

const sekme = (no, yazi, sira) => `<div class="sekme" style="--sira:${sira}"><span>${no} · ${yazi}</span></div>`;
const sayfaNo = (n) => `<div class="sno">${disli(n)}</div>`;
const disliCizgi = `<div class="dcizgi"><span></span><img src="${LOGO}" alt=""><span></span></div>`;
const bekle = '<span class="bekle">Form ile eklenecek</span>';
const ORTAK_SON = ['Ağırlık (kg)', 'Gereken traktör gücü (HP)', 'Bağlantı'];

// foto: { ana, tip: 'dekupe' | 'tam' | 'cizim' }, sahadan: [[src, yazı]]
const U = [
  { id: 'romork', no: '01', s: 3, kat: 'Taşıma', ad: 'Tarım Römorku', im: true,
    fayda: 'Ürününüzü, yeminizi, odununuzu tek römorkla taşıyın.',
    hk: "Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar Göksun'daki atölyemizde üretiyoruz.",
    ana: yerel('foto-beyaz/tarim-romorku-yesil-traktor-kirpik.jpg'), tip: 'dekupe', kucuk: img('tarim-romorku-yesil-traktor-1000.webp'),
    baslik: 'Ne taşır?', isler: [['tahil', 'Tarla ürünü'], ['yem', 'Gübre ve yem'], ['odun', 'Odun ve malzeme']],
    secenek: [['renk', 'Kasa rengi isteğe göre'], ['yazi', 'Kasa yazısı isteğe göre'], ['olcu', 'Standart dışı ölçüde özel imalat']],
    tablo: ['Kapasite (ton)', 'Kasa iç ölçüsü (mm)'], ozel: ['Dingil', 'Damper', 'Lastik ebadı'], ozelAd: 'Römorka özel',
    sahadan: [[img('tarim-romorku-mavi-1400.webp'), 'Mavi kasa, ÜÇEL yazılı'], [img('tarim-romorku-traktor-1400.webp'), 'Kamyona yüklenirken']] },
  { id: 'kultivator', no: '02', s: 4, kat: 'Toprak işleme', ad: 'Yaylı Kültivatör', im: true,
    fayda: 'Pulluktan sonra toprağı inceltir, tohum yatağını hazırlar.',
    hk: "Pullukla işlenmiş toprağın yüzeyini inceltip tohum yatağını hazırlayan ekipman. Göksun Sanayi Sitesi'ndeki atölyemizde üretiyoruz.",
    ana: yerel('foto-beyaz/yayli-kultivator-kirmizi-2-kirpik.jpg'), tip: 'dekupe', kucuk: img('yayli-kultivator-kirmizi-2-1000.webp'),
    baslik: 'Ne işe yarar?', isler: [['toprak', 'Toprak yüzey işleme'], ['tohum', 'Tohum yatağı'], ['ot', 'Yabani ot mücadelesi']],
    secenek: [['olcu', 'Farklı ayak sayısı ve ebat'], ['arti', 'Yaylı ayak sistemi'], ['renk', 'Kırmızı ve mavi renk']],
    tablo: ['Çalışma genişliği (cm)', 'Ölçüler (mm)'], ozel: ['Ayak sayısı', 'Çalışma derinliği (cm)', 'Yay tipi'], ozelAd: 'Kültivatöre özel',
    sahadan: [[yerel('foto-beyaz/yayli-kultivator-mavi-2-kirpik.jpg'), 'Mavi renk'], [yerel('foto-ek/kultivator-mavi-saha-temiz.jpg'), 'Mavi kültivatör, sahada']] },
  { id: 'loader', no: '03', s: 5, kat: 'Yükleme', ad: 'Loader Kepçe', im: true,
    fayda: 'Gübre, yem ve malzemeyi traktörünüzle yükleyin.',
    hk: 'Traktörünüze monte edilen, yem, gübre ve malzeme gibi yükleri kaldırıp taşımanızı sağlayan sistem. Kendi atölyemizde imal ediyoruz.',
    ana: yerel('foto-beyaz/on-yukleyici-traktor-kirpik.jpg'), tip: 'dekupe', kucuk: img('on-yukleyici-traktor-1000.webp'),
    baslik: 'Ne işe yarar?', isler: [['yukle', 'Yükleme ve boşaltma'], ['ahir', 'Ahır ve çiftlik işleri'], ['malzeme', 'Malzeme taşıma']],
    secenek: [['traktor', 'Traktörünüzün modeline göre montaj uygunluğunu birlikte değerlendiririz'], ['renk', 'Kırmızı ve mavi renk örnekleri']],
    tablo: ['Kaldırma kapasitesi (kg)', 'Ölçüler (mm)'], ozel: ['Kaldırma yüksekliği (cm)', 'Kepçe genişliği (cm)', 'Hidrolik'], ozelAd: 'Loader kepçeye özel',
    sahadan: [[img('on-yukleyici-atolye-1400.webp'), 'Traktöre monteli'], [img('on-yukleyici-kubota-1400.webp'), 'Kırmızı traktöre monteli']] },
  { id: 'tapan', no: '04', s: 7, kat: 'Toprak işleme', ad: 'Tapan', im: false,
    fayda: 'Ekim öncesi tarlayı düzler, kesek kırar.',
    hk: 'Pulluk ve kültivatörden sonra tarlanın yüzeyini düzleyip keseği kıran, ekime hazırlayan ekipman.',
    ana: TAPAN, tip: 'cizim', kucuk: TAPAN,
    baslik: 'Ne işe yarar?', isler: [['duzle', 'Tarlayı düzler'], ['toprak', 'Kesek kırar'], ['tohum', 'Ekime hazırlar']],
    secenek: [['olcu', 'Farklı genişlik seçenekleri için bizi arayın']],
    tablo: ['Çalışma genişliği (cm)', 'Ölçüler (mm)'], ozel: ['Tip', 'Katlanır mı'], ozelAd: 'Tapana özel',
    sahadan: [] },
  { id: 'pulluk', no: '05', s: 8, kat: 'Toprak işleme', ad: 'Pulluk', im: false,
    fayda: 'Tarlanın ekim öncesi derin işlenmesinde temel ekipman.',
    hk: 'Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.',
    ana: img('kulakli-pulluk-1000.webp'), tip: 'tam', kucuk: img('kulakli-pulluk-1000.webp'),
    baslik: 'Ne işe yarar?', isler: [['derin', 'Derin toprak işleme'], ['toprak', 'Ekim öncesi hazırlık'], ['anız', 'Anız bozma']],
    secenek: [['olcu', 'Farklı gövde sayısı seçenekleri için bizi arayın']],
    tablo: ['Toplam çalışma genişliği (cm)', 'Ölçüler (mm)'], ozel: ['Tip', 'Gövde sayısı', 'Çalışma derinliği (cm)'], ozelAd: 'Pulluğa özel',
    sahadan: [] },
  { id: 'gubre', no: '06', s: 9, kat: 'Gübreleme', ad: 'Gübre Serpme Makinesi', im: false,
    fayda: 'Gübreyi tarlanıza dengeli şekilde dağıtın.',
    hk: 'Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine.',
    ana: img('romork-ve-gubre-serpme-1400.webp'), tip: 'tam', kucuk: img('romork-ve-gubre-serpme-1000.webp'),
    baslik: 'Ne işe yarar?', isler: [['kimyasal', 'Kimyasal gübreleme'], ['organik', 'Organik gübreleme'], ['tahil', 'Verim için dengeli dağıtım']],
    secenek: [['olcu', 'Farklı kapasite seçenekleri için bizi arayın']],
    tablo: ['Depo hacmi (lt)', 'Ölçüler (mm)'], ozel: ['Serpme genişliği (m)', 'Tip'], ozelAd: 'Gübre serpmeye özel',
    sahadan: [[yerel('foto-ek/su-tankeri-gubre-serpme-temiz.jpg'), 'Gübre serpme ve su tankerleri']] },
  { id: 'tanker', no: '07', s: 10, kat: 'Su', ad: 'Su Tankeri', im: false,
    fayda: 'Tarla sulaması ve hayvan suyu için traktörle çekilen tanker.',
    hk: 'Tarla sulaması ve genel su taşımacılığı için traktörle çekilen tanker.',
    ana: yerel('foto-beyaz/su-tankeri-2-kirpik.jpg'), tip: 'dekupe', kucuk: img('su-tankeri-2-1000.webp'),
    baslik: 'Ne işe yarar?', isler: [['sulama', 'Tarla sulama'], ['kova', 'Hayvan suyu'], ['su', 'Genel su taşıma']],
    secenek: [['olcu', 'Farklı kapasite seçenekleri için bizi arayın']],
    tablo: ['Kapasite (lt)', 'Ölçüler (mm)'], ozel: ['Tank malzemesi', 'Dingil', 'Pompa'], ozelAd: 'Su tankerine özel',
    sahadan: [[yerel('foto-ek/su-tankeri-gubre-serpme-temiz.jpg'), 'Su tankerleri']] },
];
// gübre ile tankerin "sahadan" fotoğrafı aynı; gübre sayfasında tekrar etmesin diye gübreden kaldır
U[5].sahadan = [];
// gübre sayfasında 3. iş kutusu verim iddiası gibi okunmasın: sitedeki iki kullanım + traktör arkası
U[5].isler = [['kimyasal', 'Kimyasal gübreleme'], ['organik', 'Organik gübreleme'], ['traktor', 'Traktör arkasına monte']];

const IMALAT = U.filter((u) => u.im), SATIS = U.filter((u) => !u.im);

const kapak = () => `<section class="page kapak">
  <div class="k-ust">
    <img class="k-logo" src="${LOGO}" alt="">
    <p class="k-marka"><b>ÜÇEL</b><span>TARIM ALETLERİ</span></p>
    <div class="k-cizgi"><span></span><i></i><span></span></div>
    <p class="et">Ürün Kataloğu 2026 · Göksun</p>
    <h1>Tarlada da, yolda da&nbsp;sağlam&nbsp;iş.</h1>
    <p class="k-alt">Römork, kültivatör ve loader kepçeyi Göksun'da kendimiz üretiyoruz. Diğer tarım aletlerinin satışını yapıyoruz.</p>
  </div>
  <div class="k-foto" style="--foto:url(${img('tarim-romorku-traktor-1400.webp')})"></div>
  <div class="k-dip">
    <div class="k-grup"><p class="et">Kendi imalatımız</p>${IMALAT.map((u) => `<p class="k-sat"><span>${u.no}</span>${u.ad}<em>${u.s}</em></p>`).join('')}</div>
    <div class="k-grup"><p class="et">Sattığımız ürünler</p>${SATIS.map((u) => `<p class="k-sat"><span>${u.no}</span>${u.ad}<em>${u.s}</em></p>`).join('')}</div>
    <div class="k-tel"><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></div>
  </div>
</section>`;

const araKapak = (harf, sira, s, baslik, yazi, foto, liste) => `<section class="page ara">
  ${sekme(harf, harf === 'A' ? 'İmalat' : 'Satış', sira)}
  <div class="a-foto" style="--foto:url(${foto})"></div>
  <div class="a-ic">
    <p class="et">Bölüm ${harf}</p>
    <h2>${baslik}</h2>
    ${disliCizgi}
    <p class="a-yazi">${yazi}</p>
    <div class="a-liste${liste.length > 3 ? ' dort' : ''}">${liste.map((u) => `<div class="a-urun"><div class="a-th${u.tip === 'tam' ? ' tam' : ''}"><img src="${u.kucuk}" alt=""></div><span class="n">${u.no}</span><b>${u.ad}</b><span class="s">Sayfa ${u.s}</span></div>`).join('')}</div>
  </div>
  ${sayfaNo(s)}
</section>`;

const urun = async (u) => {
  const mesaj = `Merhaba, ${u.ad} için fiyat ve bilgi almak istiyorum. Traktörüm: … İlim: …`;
  const sahadan = u.sahadan.length
    ? `<div class="u-sahadan${u.sahadan.length === 1 ? ' tek' : ''}"><p class="et">Sahadan</p>${u.sahadan.map(([s, c]) => `<figure><img src="${s}" alt=""><figcaption>${c}</figcaption></figure>`).join('')}</div>`
    : '<div class="u-sahadan bos"><p class="et">Sahadan</p><div class="yer">Bu ürünün sahadan fotoğrafları eklenecek.</div></div>';
  return `<section class="page urun" id="${u.id}">
  ${sekme(u.no, u.kat, u.im ? 1 : 3)}
  <header class="u-ust">
    <span class="no">${u.no}</span>
    <div><p class="et">${u.kat}${u.im ? ' · Üçel imalatı' : ''}</p><h2>${u.ad}</h2><p class="fayda">${u.fayda}</p></div>
  </header>
  <div class="dcizgi ince"><span></span></div>
  <div class="u-foto ${u.tip}"><img src="${u.ana}" alt="${u.ad}">${u.tip === 'cizim' ? '<i>Temsili çizim · fotoğraf eklenecek</i>' : ''}</div>
  <div class="u-bilgi">
    <div class="u-tablo">
      <h3>Teknik özellikler</h3>
      <table>${['Model', ...u.tablo, ...ORTAK_SON].map((a) => `<tr><th>${a}</th><td>${bekle}</td></tr>`).join('')}
        <tr class="ara-sat"><th colspan="2">${u.ozelAd}</th></tr>${u.ozel.map((a) => `<tr><th>${a}</th><td>${bekle}</td></tr>`).join('')}</table>
    </div>
    <div class="u-yan">
      <p class="hk">${u.hk}</p>
      <h3>${u.baslik}</h3>
      <div class="ikonlar">${u.isler.map(([k, t]) => `<div>${ikon(k)}<span>${t}</span></div>`).join('')}</div>
      <h3>Seçenekler</h3>
      <ul class="sec">${u.secenek.map(([k, t]) => `<li>${ikon(k)}${t}</li>`).join('')}</ul>
    </div>
  </div>
  ${sahadan}
  <footer class="u-bant">
    <div class="qrc">${await qr(wa(mesaj))}</div>
    <div class="u-cta"><b>Fiyat için QR'ı okutun</b><span>WhatsApp'ta mesajınız hazır açılır.</span></div>
    <a class="u-wa" href="${wa(mesaj)}">${ikon('wa')}WhatsApp'tan fiyat al</a>
    <div class="u-tel"><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></div>
  </footer>
  ${sayfaNo(u.s)}
</section>`;
};

const HIZ = [
  ['ikinci', 'İkinci el', 'İkinci el tarım aleti alıp satıyoruz; gerçek durumunu dürüstçe paylaşıyoruz.'],
  ['takas', 'Takas', 'Eski aletinizin fotoğrafını gönderin, yeni ya da ikinci el bir ekipmanla takas edelim.'],
  ['imalat', 'Özel imalat', 'Kendi imal ettiğimiz ekipmanlarda ihtiyacınıza göre özel ölçü yapabiliyoruz.'],
  ['parca', 'Yedek parça', 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.'],
];
const ADIM = [['1', 'Ürünü seçin', 'Bu katalogdan ihtiyacınıza uygun ürünü bulun.'], ['2', "WhatsApp'tan yazın", 'Ürünün adını, traktörünüzü ve ilinizi yazmanız yeterli.'], ['3', 'Fiyatı konuşalım', 'Fiyatı, seçenekleri ve teslimatı birlikte netleştirelim.']];

const hizmet = async () => `<section class="page hizmet">
  ${sekme('C', 'Hizmetler', 4)}
  <header class="u-ust"><span class="no">C</span><div><p class="et">Satıştan sonra da yanınızdayız</p><h2>Hizmetlerimiz</h2><p class="fayda">Sadece satış değil; aletinizin her aşamasında yanınızdayız.</p></div></header>
  <div class="dcizgi ince"><span></span></div>
  <div class="h-kart">${HIZ.map(([k, b, t]) => `<div>${ikon(k)}<b>${b}</b><p>${t}</p></div>`).join('')}</div>
  <div class="h-yok"><div><p class="et">Listede yoksa sorun</p><p>Mibzer, çayır biçme makinesi ve katalogda görmediğiniz diğer tarım aletleri için de bize yazın; birlikte bakalım.</p></div></div>
  <div class="h-adim"><h3>3 adımda fiyat alın</h3><ol>${ADIM.map(([n, b, t]) => `<li><span>${n}</span><b>${b}</b><p>${t}</p></li>`).join('')}</ol></div>
  <div class="h-gonder">${ikon('kamyon')}<p><b>Türkiye geneline gönderim.</b> Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinizi yazın, seçeneği birlikte belirleyelim.</p></div>
  <footer class="u-bant">
    <div class="qrc">${await qr(wa('Merhaba, katalog hakkında bilgi almak istiyorum.'))}</div>
    <div class="u-cta"><b>Sorunuz mu var?</b><span>QR'ı okutun, WhatsApp'tan yazın.</span></div>
    <a class="u-wa" href="${wa('Merhaba, katalog hakkında bilgi almak istiyorum.')}">${ikon('wa')}WhatsApp'tan yazın</a>
    <div class="u-tel"><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></div>
  </footer>
  ${sayfaNo(11)}
</section>`;

const arka = async () => {
  const kartlar = await Promise.all([[wa('Merhaba, katalog hakkında bilgi almak istiyorum.'), 'wa', 'WhatsApp', 'Mesaj hazır açılır'], [FIRMA.harita, 'konum', 'Konum', 'Yol tarifi alın'], [FIRMA.site, 'web', 'Web sitesi', 'Tüm ürünler']]
    .map(async ([h, k, b, a]) => `<a class="b-qr" href="${h}"><div class="qrc">${await qr(h)}</div>${ikon(k)}<b>${b}</b><span>${a}</span></a>`));
  return `<section class="page arka">
  <div class="b-ust">
    <img class="b-logo" src="${LOGO}" alt="">
    <p class="k-marka"><b>ÜÇEL</b><span>TARIM ALETLERİ</span></p>
    ${disliCizgi}
    <p class="et">Fiyat ve bilgi için</p>
    <a class="b-tel" href="tel:+905324803051">${FIRMA.telefon}</a>
    <p class="b-alt">Telefon ve WhatsApp · ${FIRMA.saatler}</p>
  </div>
  <div class="b-qrlar">${kartlar.join('')}</div>
  <div class="b-hiz"><p class="et">Hizmetlerimiz</p><p>İkinci el <i></i> Takas <i></i> Özel imalat <i></i> Yedek parça</p></div>
  <div class="b-adres">${ikon('konum')}<p><b>Üçel Tarım Aletleri</b>${FIRMA.adres1}, ${FIRMA.adres2}</p></div>
</section>`;
};

const EK = `
.k-sat { display:flex; } .k-sat em { margin-left:auto; font:600 8pt Inter; font-style:normal; color:#8f8b84; padding-top:1mm; }
.a-liste.dort { gap:3mm; } .a-liste.dort .a-urun { padding:2mm; } .a-liste.dort .a-th { height:17mm; }
.a-th.tam img { object-fit:cover; padding:0; mix-blend-mode:normal; }
.u-foto.tam { padding:0; } .u-foto.tam img { object-fit:cover; mix-blend-mode:normal; border-radius:3mm; } .u-foto.tam:after { display:none; }
.u-foto.cizim { padding:0; } .u-foto.cizim img { object-fit:cover; mix-blend-mode:normal; border-radius:3mm; } .u-foto.cizim:after { display:none; }
.u-foto i { position:absolute; z-index:2; left:4mm; bottom:4mm; font:600 8pt Inter; font-style:normal; color:var(--gri); background:#fff; padding:1.2mm 3mm; border-radius:99px; }
.u-sahadan.tek { grid-template-columns:20mm 1fr 1fr; }
.u-sahadan.bos .yer { grid-column:span 2; height:24mm; border:.35mm dashed var(--cizgi); border-radius:2mm; display:grid; place-items:center; font-size:8.5pt; color:#a09a90; background:repeating-linear-gradient(135deg,#faf8f4 0 3mm,#f4f0ea 3mm 6mm); }
/* hizmetler */
.hizmet .u-ust h2 { font-size:30pt; }
.h-kart { display:grid; grid-template-columns:1fr 1fr; gap:5mm; margin:7mm calc(var(--kenar) + 8mm) 0 var(--kenar); }
.h-kart div { border:.25mm solid var(--cizgi); border-top:.8mm solid var(--altin); border-radius:2.5mm; padding:5mm; } .h-kart .ik { width:8mm; height:8mm; margin-bottom:2.5mm; } .h-kart b { display:block; font:600 14pt Oswald; margin-bottom:1.5mm; } .h-kart p { font-size:9.5pt; color:#3a3a3d; }
.h-yok { margin:5mm calc(var(--kenar) + 8mm) 0 var(--kenar); background:var(--krem); border-left:1mm solid var(--altin); border-radius:2.5mm; padding:4.5mm 5mm; font-size:10pt; } .h-yok .et { margin-bottom:2mm; }
.h-adim { margin:7mm calc(var(--kenar) + 8mm) 0 var(--kenar); } .h-adim h3 { font-size:15pt; margin-bottom:3mm; }
.h-adim ol { list-style:none; padding:0; margin:0; display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; } .h-adim li { background:var(--ink); color:#fff; border-radius:2.5mm; padding:4.5mm; }
.h-adim li span { display:grid; place-items:center; width:9mm; height:9mm; border:.4mm solid var(--altin); border-radius:50%; font:700 13pt Oswald; color:var(--altin); margin-bottom:3mm; } .h-adim li b { display:block; font-size:10.5pt; margin-bottom:1mm; } .h-adim li p { font-size:8.8pt; color:#b9b5ad; }
.h-gonder { display:flex; gap:4mm; align-items:center; margin:6mm calc(var(--kenar) + 8mm) 0 var(--kenar); font-size:9.5pt; color:#3a3a3d; } .h-gonder .ik { width:9mm; height:9mm; }
@media screen and (max-width:600px) {
  .k-sat em { display:none; } .a-liste.dort .a-th { height:72px; }
  .u-foto.tam, .u-foto.cizim { padding:0; } .u-foto i { font-size:12px; left:12px; bottom:12px; padding:4px 10px; }
  .u-sahadan.tek { grid-template-columns:1fr; } .u-sahadan.tek .et { grid-column:auto; }
  .u-sahadan.bos .yer { height:72px; font-size:13px; }
  .h-kart { grid-template-columns:1fr; margin:20px 16px 0; gap:10px; } .h-kart div { padding:16px; border-top-width:3px; } .h-kart .ik { width:28px; height:28px; } .h-kart b { font-size:21px; } .h-kart p { font-size:15px; }
  .h-yok { margin:16px 16px 0; padding:16px; font-size:15.5px; border-left-width:4px; }
  .h-adim { margin:28px 16px 0; } .h-adim h3 { font-size:24px; margin-bottom:12px; } .h-adim ol { grid-template-columns:1fr; gap:10px; } .h-adim li { padding:16px; } .h-adim li span { width:36px; height:36px; font-size:18px; } .h-adim li b { font-size:17px; } .h-adim li p { font-size:15px; }
  .h-gonder { margin:20px 16px 0; font-size:15px; gap:12px; } .h-gonder .ik { width:32px; height:32px; }
}`;

const sayfalar = [
  kapak(),
  araKapak('A', 0, 2, 'Kendi imalatımız', "Göksun Sanayi Sitesi'ndeki atölyemizde kaynağından boyasına kadar kendimiz üretiyoruz. Ürünlerimizin üzerinde <b>ÜÇEL · GÖKSUN</b> yazar.", img('on-yukleyici-atolye-1400.webp'), IMALAT),
  ...(await Promise.all(IMALAT.map(urun))),
  araKapak('B', 2, 6, 'Sattığımız ürünler', 'Toprak hazırlığından gübrelemeye, sudan taşımaya. Traktörünüze ve işinize uygun olanı birlikte seçelim.', yerel('foto-ek/su-tankeri-gubre-serpme-temiz.jpg'), SATIS),
  ...(await Promise.all(SATIS.map(urun))),
  await hizmet(),
  await arka(),
];

const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Üçel Tarım Aletleri · Ürün Kataloğu 2026</title>
${['oswald/600', 'oswald/700', 'inter/400', 'inter/600', 'inter/700'].map((f) => `<link rel="stylesheet" href="${font(...f.split('/'))}">`).join('')}
<style>${STIL}${EK}</style></head><body>
${sayfalar.join('\n')}
</body></html>`;

const KLASOR = join(CIKTI, 'katalog8');
mkdirSync(KLASOR, { recursive: true });
const dosya = join(KLASOR, 'index.html');
writeFileSync(dosya, html);

const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pg = await b.newPage({ viewport: { width: 900, height: 1200 } });
await pg.goto(url(dosya), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
console.log('kırık', await pg.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src)));
// A4 sayfada taşan (iskeletten dışarı çıkan) içerik var mı?
console.log('taşma', await pg.evaluate(() => [...document.querySelectorAll('.page')].map((p, i) => {
  const r = p.getBoundingClientRect(); const bant = p.querySelector('.u-bant');
  const alt = bant ? bant.getBoundingClientRect().top : r.bottom;
  const icerik = [...p.querySelectorAll('.u-sahadan, .h-gonder, .u-bilgi')].map((e) => e.getBoundingClientRect().bottom);
  return [i + 1, Math.max(0, ...icerik) > alt + 1];
}).filter(([, t]) => t)));
await pg.pdf({ path: join(CIKTI, 'Ucel-Katalog-2026.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
const tel = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
await tel.goto(url(dosya), { waitUntil: 'networkidle' });
await tel.evaluate(() => document.fonts.ready);
console.log('telefon', await tel.evaluate(() => ({ tasma: document.documentElement.scrollWidth > innerWidth, h: document.documentElement.scrollHeight })));
await tel.screenshot({ path: join(KLASOR, 'telefon.png'), fullPage: true });
await b.close();
console.log('ok');
