// Üçel basılı ürün kataloğu (A4, 16 sayfa).
//   python3 ucel-romork/_kaynak/katalog_qr.py   (QR kodları — bir kez)
//   python3 ucel-romork/_kaynak/katalog_gorsel.py (fotoğraflar + dekupe — bir kez)
//   node ucel-romork/_kaynak/katalog.mjs        (katalog/index.html)
//   node ucel-romork/_kaynak/katalog.mjs --pdf  (+ katalog/Ucel-Katalog-2026.pdf)
//
// KURAL (veri.mjs ile aynı): Üçel'in teyit etmediği teknik değer yazılmaz.
// Bilinmeyen ölçüler sayfada tek bir "Ölçüler modele göre" listesinde toplanır.
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FIRMA } from './veri.mjs';

const KOK = join(dirname(fileURLToPath(import.meta.url)), '..', 'katalog');

// ---------- İkonlar (24x24, çizgi) ----------
const IKON = {
  gear: '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7v.2a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9 10.5c0 2 2.5 4.5 4.5 4.5l1.2-1.2-1.7-.8-.8.7c-.8-.3-1.6-1.1-1.9-1.9l.7-.8-.8-1.7L9 10.5z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  wheat: '<path d="M12 22V6"/><path d="M12 6c-1.6-1-1.6-3.2 0-4.2 1.6 1 1.6 3.2 0 4.2z"/><path d="M12 11c-2.6 0-4-1.6-4-3.6 2.6 0 4 1.6 4 3.6zM12 11c2.6 0 4-1.6 4-3.6-2.6 0-4 1.6-4 3.6zM12 16c-2.6 0-4-1.6-4-3.6 2.6 0 4 1.6 4 3.6zM12 16c2.6 0 4-1.6 4-3.6-2.6 0-4 1.6-4 3.6z"/>',
  sack: '<path d="M9 7h6l-1-3h-4z"/><path d="M9 7c-3 2-5 5-5 9a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5c0-4-2-7-5-9"/><path d="M10 14h4"/>',
  logs: '<circle cx="7" cy="17" r="3.5"/><circle cx="17" cy="17" r="3.5"/><circle cx="12" cy="9" r="3.5"/><circle cx="7" cy="17" r=".8"/><circle cx="17" cy="17" r=".8"/><circle cx="12" cy="9" r=".8"/>',
  tractor: '<circle cx="7" cy="16" r="4"/><circle cx="18.5" cy="18" r="2"/><path d="M3 12V5h7l2 6h7a2 2 0 0 1 2 2v3M11 16h5.5M6 5V3"/>',
  drop: '<path d="M12 2.7s6 6.3 6 11.1a6 6 0 0 1-12 0C6 9 12 2.7 12 2.7z"/>',
  cow: '<path d="M7 8h10l-1 6.5a4 4 0 0 1-8 0z"/><path d="M7 8 4 5M17 8l3-3M4 9h3M17 9h3"/><circle cx="10.5" cy="15.5" r=".6"/><circle cx="13.5" cy="15.5" r=".6"/>',
  soil: '<path d="M12 2v7M9 6l3 3 3-3"/><path d="M2 13c3-2 7-2 10 0s7 2 10 0M2 18c3-2 7-2 10 0s7 2 10 0"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 12c0-3.3-2.2-5.5-6.5-5.5 0 3.3 2.2 5.5 6.5 5.5zM12 10c0-3.3 2.2-5.5 6.5-5.5 0 3.3-2.2 5.5-6.5 5.5z"/><path d="M6 21h12"/>',
  noweed: '<circle cx="12" cy="12" r="9.5"/><path d="M5.3 5.3l13.4 13.4"/><path d="M12 17v-5c0-2-1.3-3.3-3.5-3.3M12 13c0-2 1.3-3.3 3.5-3.3"/>',
  lift: '<rect x="3" y="12" width="10" height="8" rx="1"/><path d="M18 20V5M15 8l3-3 3 3"/>',
  barn: '<path d="M3 21V10l9-6 9 6v11"/><path d="M9 21v-6h6v6M9 15l6 6M15 15l-6 6"/>',
  box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>',
  spread: '<path d="M6 3h12l-3 7H9z"/><path d="M12 10v3"/><circle cx="12" cy="15" r="2"/><path d="M5 19l-2 2M19 19l2 2M12 19v3M7.5 17.5 6 18.5M16.5 17.5 18 18.5"/>',
  flat: '<path d="M3 19h18"/><path d="M3 14c2-3 4-3 6-1s4 2 6 0 4-2 6 1"/><path d="M8 4h8l-1 5H9z"/>',
  hammer: '<path d="m15 12-8.5 8.5a2.1 2.1 0 1 1-3-3L12 9"/><path d="M17.6 15 22 10.6"/><path d="m20.9 11.7-1.3-1.3a3.2 3.2 0 0 1-.9-2.2v-.9L16 4.6A5.6 5.6 0 0 0 12.1 3H9l.9.8A6.2 6.2 0 0 1 12 8.4V10l2 2h2.5l2.3 1.9"/>',
  plough: '<path d="M2 20h20"/><path d="M4 20c0-6 4.5-10 10-10h3"/><path d="M14 4l5 6-5 2"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  cycle: '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z"/>',
  truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2M15 18H9M19 18h2a1 1 0 0 0 1-1v-3.6a1 1 0 0 0-.2-.6l-3.5-4.4a1 1 0 0 0-.8-.4H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
  question: '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  list: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6"/>',
  hand: '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a3 3 0 0 0-4.2 0l-.9.9a1 1 0 1 1-3-3l2.8-2.8a5.8 5.8 0 0 1 7.1-.9l.5.3a2 2 0 0 0 1.4.3L21 4"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3M3 4h8"/>',
  camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  paint: '<path d="M12 22a10 10 0 1 1 10-10c0 2-1.8 3-4 3h-2a2 2 0 0 0-1.4 3.4A2 2 0 0 1 12 22z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7" r="1"/><circle cx="16.5" cy="10.5" r="1"/>',
  pen: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  gauge: '<path d="m12 14 4-4M3.3 19a10 10 0 1 1 17.4 0"/>',
  ruler: '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0zM14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
const i = (ad) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IKON[ad]}</svg>`;

const DISLI = 'M39.9 10.3 L42.8 0.5 L57.2 0.5 L60.1 10.3 L61.1 10.5 L68.5 3.6 L81.0 10.7 L78.6 20.6 L79.4 21.4 L89.3 19.0 L96.4 31.5 L89.5 38.9 L89.7 39.9 L99.5 42.8 L99.5 57.2 L89.7 60.1 L89.5 61.1 L96.4 68.5 L89.3 81.0 L79.4 78.6 L78.6 79.4 L81.0 89.3 L68.5 96.4 L61.1 89.5 L60.1 89.7 L57.2 99.5 L42.8 99.5 L39.9 89.7 L38.9 89.5 L31.5 96.4 L19.0 89.3 L21.4 79.4 L20.6 78.6 L10.7 81.0 L3.6 68.5 L10.5 61.1 L10.3 60.1 L0.5 57.2 L0.5 42.8 L10.3 39.9 L10.5 38.9 L3.6 31.5 L10.7 19.0 L20.6 21.4 L21.4 20.6 L19.0 10.7 L31.5 3.6 L38.9 10.5Z';
// Üçel amblemi: dişli + Ü (Üçel onayladı).
const amblem = `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${DISLI}" fill="#D4A24C"/><circle cx="50" cy="50" r="33" fill="#2A211B"/><circle cx="50" cy="50" r="29" fill="none" stroke="#D4A24C" stroke-width="1.5"/><text x="50" y="66" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" font-size="44" fill="#D4A24C">Ü</text></svg>`;
const logo = (cls = '') => `<div class="logo ${cls}">${amblem}<div><b>ÜÇEL</b><small>Tarım Aletleri · Göksun</small></div></div>`;
const serit = '<div class="stripes" aria-hidden="true"><i></i><i></i><i></i></div>';
const foto = (ad) => `img/${ad}.jpg`;      // katalog_gorsel.py: sıcak tonlu fotoğraf
const kesit = (ad) => `img/${ad}.png`;     // katalog_gorsel.py: dekupe (arka planı ayrılmış ürün)

// ---------- Ürünler ----------
// sahne: kesit (stüdyo görünümü) ya da foto. ikinci: sahnede küçük renk seçeneği.
// bilinen: Üçel'in teyit ettiği değerler. olcu: modele göre değişen ölçüler (sayfada tek listede).
const RENK = { mavi: ['Mavi', '#1F5FA8'], yesil: ['Yeşil', '#1E6A55'], kirmizi: ['Kırmızı', '#B8132C'] };
const URUNLER = [
  {
    no: '01', qr: 'romork', ad: 'Tarım Römorku', bolum: 'A', cat: 'Taşıma', imalat: true,
    tag: 'Ürününüzü, yeminizi, odununuzu tek römorkla taşıyın.',
    sahne: { kesit: 'k-romork', gen: 150 }, ikinci: { kesit: 'k-romork-yesil', not: 'Yeşil kasa, üzerinde müşterimizin adı' },
    lead: 'Tarladan eve, depodan tarlaya yük taşımanın temel aleti. Kaynağından boyasına kadar Göksun Sanayi Sitesi’ndeki atölyemizde üretiyoruz.',
    ozellik: [['wheat', 'Hasat ve yem', 'Ürün, saman, yem ve gübre'], ['logs', 'Odun ve malzeme', 'Yakacaktan yapı malzemesine'], ['pen', 'Size özel', 'Kasa rengi ve kasa yazısı isteğinize göre']],
    bilinen: [['Üretim', 'Üçel · Göksun atölyesi'], ['Kasa rengi', 'İsteğe göre'], ['Kasa yazısı', 'İsim, firma adı, “Maşallah”']],
    olcu: ['Taşıma kapasitesi', 'Kasa iç ölçüsü', 'Dingil', 'Damper', 'Lastik ebadı', 'Traktör gücü'],
    renk: ['mavi', 'yesil', 'kirmizi'], renkNot: 've istediğiniz diğer renkler',
    sec: ['Standart dışı ölçüde özel imalat'],
    saha: [['tarim-romorku-yesil-teslimat', 'Teslim günü: kasada müşterimizin adı yazılı.'], ['tarim-romorku-traktor', 'Mavi römork, yola çıkmadan önce.']],
  },
  {
    no: '02', qr: 'kultivator', ad: 'Yaylı Kültivatör', bolum: 'A', cat: 'Toprak işleme', imalat: true,
    tag: 'Pulluktan sonra toprağı inceltir, tohum yatağını hazırlar.',
    sahne: { kesit: 'k-kultivator', gen: 140 }, ikinci: { kesit: 'k-kultivator-mavi', not: 'Mavi renk seçeneği' },
    lead: 'Göksun model yaylı kültivatör. Yaylı ayaklar taşa çarpınca esner; hem aleti hem traktörü korur.',
    ozellik: [['soil', 'Toprağı inceltir', 'Sürülmüş toprağı ufalar'], ['sprout', 'Tohum yatağı', 'Ekim için düzgün yatak'], ['noweed', 'Ot mücadelesi', 'Yabancı otu söker']],
    bilinen: [['Ayak tipi', 'Yaylı'], ['Model', 'Göksun'], ['Üretim', 'Üçel · Göksun atölyesi']],
    olcu: ['Ayak sayısı', 'Çalışma genişliği', 'Çalışma derinliği', 'Traktör gücü'],
    renk: ['kirmizi', 'mavi'],
    sec: ['Farklı ayak sayısı ve ebat'],
    saha: [['yayli-kultivator-kirmizi', 'Kırmızı Göksun kültivatörler, teslime hazır.'], ['yayli-kultivator-mavi', 'Mavi seçenek, atölyemizin önünde.']],
  },
  {
    no: '03', qr: 'kepce', ad: 'Loader Kepçe', bolum: 'A', cat: 'Yükleme', imalat: true,
    tag: 'Gübre, yem ve malzemeyi traktörünüzle yükleyin.',
    sahne: { kesit: 'k-kepce', gen: 120 },
    lead: 'Traktörünüzün önüne takılan hidrolik kepçe. Yem, gübre ve malzemeyi kaldırıp taşır. Kendi atölyemizde imal ediyoruz.',
    ozellik: [['lift', 'Yükleme', 'Gübre, yem, toprak, malzeme'], ['barn', 'Ahır ve çiftlik', 'Günlük işte kol gücünü azaltır'], ['tractor', 'Traktörünüze göre', 'Montaj uygunluğunu birlikte kontrol ederiz']],
    bilinen: [['Çalışma', 'Hidrolik'], ['Montaj', 'Traktörünüzün modeline göre'], ['Üretim', 'Üçel · Göksun atölyesi']],
    olcu: ['Kaldırma kapasitesi', 'Kaldırma yüksekliği', 'Kepçe genişliği', 'Traktör gücü'],
    renk: ['kirmizi', 'mavi'],
    sec: [],
    saha: [['on-yukleyici-kubota', 'Traktöre takılmış kırmızı loader.'], ['on-yukleyici-mavi', 'Mavi traktöre mavi loader.']],
  },
  {
    no: '04', qr: 'tanker', ad: 'Su Tankeri', bolum: 'A', cat: 'Su', imalat: true,
    tag: 'Tarla sulaması ve hayvan suyu için traktörle çekilen tanker.',
    sahne: { kesit: 'k-tanker', gen: 155 },
    lead: 'Merada ve yaylada hayvanlara, bahçede fidana, tarla başında ilaçlamaya su taşır. Göksun’daki atölyemizde imal ediyoruz.',
    ozellik: [['drop', 'Tarla sulama', 'Bahçe, fidan ve tarla başı'], ['cow', 'Hayvan suyu', 'Merada ve yaylada'], ['truck', 'Su taşıma', 'Traktörle çekilir, çeki oklu şasi']],
    bilinen: [['Çekiş', 'Traktörle, çeki oklu şasi'], ['Üretim', 'Üçel · Göksun atölyesi']],
    olcu: ['Kapasite (lt)', 'Tank malzemesi', 'Dingil', 'Pompa', 'Traktör gücü'],
    sec: ['Farklı kapasite seçenekleri'],
    bilgi: ['Hangi kapasite size uygun?', 'Hayvan sayınızı, sulayacağınız alanı ve traktörünüzün gücünü yazın; ihtiyacınıza uygun tank kapasitesini birlikte seçelim.', [['cow', 'Hayvan sayısı'], ['drop', 'Sulama alanı'], ['gauge', 'Traktör gücü']]],
    saha: [['su-tankeri', 'Teslime hazır su tankerleri, Göksun.']],
  },
  {
    no: '05', qr: 'tapan', ad: 'Tapan', bolum: 'B', cat: 'Toprak işleme',
    tag: 'Ekim öncesi tarlayı düzler, kesek kırar.',
    sahne: { kesit: 'tapan-temsili', uzanti: 'webp', gen: 135, not: 'Temsili görsel' },
    lead: 'Pulluk ve kültivatörden sonra tarlanın yüzeyini düzleyip keseği kıran, ekime hazırlayan alet.',
    ozellik: [['flat', 'Düzler', 'Tarla yüzeyini düzgünleştirir'], ['hammer', 'Kesek kırar', 'İri toprak parçalarını ufalar'], ['sprout', 'Ekime hazırlar', 'Ekim makinesi düzgün çalışır']],
    bilinen: [],
    olcu: ['Çalışma genişliği', 'Katlanır / sabit', 'Ağırlık', 'Traktör gücü'],
    sec: ['Farklı genişlik seçenekleri'],
    akis: 2,
  },
  {
    no: '06', qr: 'pulluk', ad: 'Pulluk', bolum: 'B', cat: 'Toprak işleme',
    tag: 'Tarlanın ekim öncesi derin işlenmesinde temel alet.',
    sahne: { kesit: 'k-pulluk', gen: 92 },
    lead: 'Toprağı devirerek sürer, anızı ve bitki artıklarını toprağa gömer. Toprağınıza ve traktörünüzün gücüne uygun pulluk traktörü gereksiz yormaz.',
    ozellik: [['soil', 'Derin işleme', 'Toprağı devirerek sürer'], ['plough', 'Anız bozma', 'Artıkları toprağa gömer'], ['gauge', 'Gücüne uygun', 'Traktörünüzü gereksiz yormaz']],
    bilinen: [['Tip', 'Kulaklı'], ['Gövde sayısı', '4 (fotoğraftaki model)']],
    olcu: ['Çalışma genişliği', 'Çalışma derinliği', 'Traktör gücü'],
    sec: ['Farklı gövde sayısı seçenekleri'],
    saha: [['kulakli-pulluk', 'Kulaklı pulluklar, teslime hazır.'], ['on-yukleyici-ve-pulluk', 'Akşam teslimatı: pulluk ve loader birlikte.']],
  },
  {
    no: '07', qr: 'gubre', ad: 'Gübre Serpme Makinesi', bolum: 'B', cat: 'Gübreleme',
    tag: 'Gübreyi tarlanıza dengeli şekilde dağıtın.',
    sahne: { foto: 'romork-ve-gubre-serpme', pos: '50% 42%', not: 'Teslim günü, müşterimizle birlikte' },
    lead: 'Traktörün arkasına takılır; granül gübreyi tarlaya eşit şekilde serper. Elle serpmeye göre hem zaman kazandırır hem gübre israfını azaltır.',
    ozellik: [['spread', 'Dengeli serpme', 'Granül gübreyi eşit dağıtır'], ['clock', 'Zaman kazandırır', 'Elle serpmeye göre çok hızlı'], ['tractor', 'Arkaya takılır', 'Traktör arkasına monte edilir']],
    bilinen: [],
    olcu: ['Depo hacmi', 'Serpme genişliği', 'Tip', 'Traktör gücü'],
    sec: ['Farklı kapasite seçenekleri'],
    akis: 3,
  },
];
const A = URUNLER.filter((u) => u.bolum === 'A');
const B = URUNLER.filter((u) => u.bolum === 'B');
// Sayfa numaraları: kapak 1, tanıtım 2, rehber 3, A ayırıcı 4, A ürünleri 5-8, B ayırıcı 9, B ürünleri 10-12, sahadan 13, hizmetler 14, fiyat 15, arka 16
const SAYFA = { romork: 5, kultivator: 6, kepce: 7, tanker: 8, tapan: 10, pulluk: 11, gubre: 12 };
const AKIS = ['Pulluk', 'Kültivatör', 'Tapan', 'Gübre serpme', 'Ekim'];

const sahneSrc = (s) => (s.kesit ? `img/${s.kesit}.${s.uzanti || 'png'}` : foto(s.foto));
// Küçük önizleme (bölüm sayfası, rehber): dekupe varsa dekupe, yoksa fotoğraf
const kucuk = (u, cls = '') => (u.sahne.kesit
  ? `<img class="${cls} cut" src="${sahneSrc(u.sahne)}" alt="${u.ad}">`
  : `<img class="${cls} ph" src="${foto(u.sahne.foto)}" alt="${u.ad}" style="object-position:${u.sahne.pos || '50% 50%'}">`);

const altBant = (qr, no, cta = 'Fiyat için QR’ı okutun', alt = 'WhatsApp’ta mesajınız hazır açılır') => `
  <footer class="pf">
    <div class="qr"><img src="qr/${qr}.svg" alt="WhatsApp QR kodu"></div>
    <div class="pf-cta"><b>${cta}</b><span>${alt}</span></div>
    <div class="pf-sep"></div>
    <div class="pf-tel">${i('phone')}<div><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></div></div>
    <div class="pf-no">${no}</div>
  </footer>`;

const ustCizgi = (sag) => `<header class="top">${logo('logo-ink')}<span class="top-rule"></span><span class="top-meta">${sag}</span></header>`;

const urunSayfa = (u) => {
  const s = u.sahne;
  const sahne = s.kesit
    ? `<div class="stage ${u.ikinci ? 'has-second' : ''}">
        <span class="stage-no">${u.no}</span>
        <div class="stage-title">
          <span class="badge ${u.imalat ? 'made' : ''}">${i(u.imalat ? 'gear' : 'hand')} ${u.imalat ? 'Kendi imalatımız' : 'Satışını yapıyoruz'}</span>
          <h1>${u.ad}</h1><p class="tag">${u.tag}</p>
        </div>
        <figure class="product" style="--w:${s.gen}mm"><img src="${sahneSrc(s)}" alt="${u.ad}"></figure>
        ${u.ikinci ? `<figure class="second"><img src="${kesit(u.ikinci.kesit)}" alt="${u.ikinci.not}"><figcaption>${u.ikinci.not}</figcaption></figure>` : ''}
        ${s.not ? `<span class="stage-note">${i('camera')} ${s.not}</span>` : ''}
      </div>`
    : `<div class="stage photo">
        <img class="stage-photo" src="${foto(s.foto)}" alt="${u.ad}" style="object-position:${s.pos}">
        <span class="stage-no">${u.no}</span>
        <div class="stage-title">
          <span class="badge">${i('hand')} Satışını yapıyoruz</span>
          <h1>${u.ad}</h1><p class="tag">${u.tag}</p>
        </div>
        <span class="stage-note">${i('camera')} ${s.not}</span>
      </div>`;

  const renk = u.renk
    ? `<div class="swatches">${u.renk.map((r) => `<span><i style="background:${RENK[r][1]}"></i>${RENK[r][0]}</span>`).join('')}${u.renkNot ? `<em>${u.renkNot}</em>` : ''}</div>`
    : '';
  const alt = u.saha && !u.bilgi
    ? `<div class="saha"><div class="lbl">${i('camera')} Sahadan · gerçek fotoğraflar</div>
        <div class="saha-grid n${u.saha.length}">${u.saha.map(([f, c]) => `<figure><img src="${foto(f)}" alt="${c}"><figcaption>${c}</figcaption></figure>`).join('')}</div></div>`
    : u.bilgi
    ? `<div class="saha"><div class="lbl">${i('camera')} Sahadan · ${u.bilgi[0]}</div>
        <div class="saha-grid mix"><figure><img src="${foto(u.saha[0][0])}" alt="${u.saha[0][1]}"><figcaption>${u.saha[0][1]}</figcaption></figure>
        <div class="flow"><ol>${u.bilgi[2].map(([ik, t]) => `<li>${i(ik)}<span>${t}</span></li>`).join('')}</ol><p>${u.bilgi[1]}</p></div></div></div>`
    : `<div class="saha"><div class="lbl">${i('tractor')} Tarlada iş sırası</div>
        <div class="flow wide"><ol class="seq">${AKIS.map((a, k) => `<li class="${k === u.akis ? 'on' : ''}"><b>${k + 1}</b>${a}</li>`).join('')}</ol>
        <p><b>${u.ad}</b> ${u.akis + 1}. adımda kullanılır. Hangi aletin hangi işe yaradığını sayfa 3’teki rehberde bulabilirsiniz.</p></div></div>`;

  return `
<section class="page product-page ${u.imalat ? '' : 'sale'}" id="${u.qr}">
  ${ustCizgi(`<b>${u.no}</b> / 07 · ${u.cat}`)}
  ${sahne}
  <ul class="feats">${u.ozellik.map(([ik, t, d]) => `<li><span class="fi">${i(ik)}</span><div><b>${t}</b><span>${d}</span></div></li>`).join('')}</ul>
  <div class="info">
    <div class="info-l">
      <p class="lead">${u.lead}</p>
      ${u.bilinen.length ? `<table class="spec">${u.bilinen.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table>` : ''}

    </div>
    <div class="info-r">
      <div class="h3">${i('ruler')} Ölçüler modele göre</div>
      <ul class="chips">${u.olcu.map((o) => `<li>${o}</li>`).join('')}</ul>
      <p class="note">Size uygun modelin ölçü tablosunu WhatsApp’tan hemen gönderiyoruz.</p>
      ${u.renk ? `<div class="h3">${i('paint')} Renk seçenekleri</div>${renk}` : ''}
      ${u.sec.length ? `<ul class="checks">${u.sec.map((x) => `<li>${i('check')}<span>${x}</span></li>`).join('')}</ul>` : ''}
      ${u.imalat ? '' : `<div class="assure"><div class="h3">${i('hand')} Üçel’den alırken</div><ul class="checks">
        <li>${i('check')}<span>Traktörünüze uygunluğunu birlikte kontrol ederiz</span></li>
        <li>${i('check')}<span>Yedek parça desteği</span></li>
        <li>${i('check')}<span>Türkiye geneline gönderim</span></li></ul></div>`}
    </div>
  </div>
  ${alt}
  ${altBant(u.qr, SAYFA[u.qr])}
</section>`;
};

// ---------- Kapak ----------
const kapak = `
<section class="page dark cover">
  <div class="cover-top"><span>Ürün kataloğu <em>2026</em></span>${serit}<span><em>Göksun</em> · Kahramanmaraş</span></div>
  ${logo('logo-lg')}
  <h1>Tarlada da, yolda da<br><em>sağlam iş.</em></h1>
  <div class="showroom">
    <img class="s-romork" src="${kesit('k-romork')}" alt="Üçel tarım römorku">
    <img class="s-kepce" src="${kesit('k-kepce')}" alt="Üçel loader kepçe">
    <img class="s-kult" src="${kesit('k-kultivator')}" alt="Üçel yaylı kültivatör">
  </div>
  <p class="sub">Römork, kültivatör, loader kepçe ve su tankerini Göksun’daki atölyemizde kendimiz üretiyoruz. Diğer tarım aletlerinin satışını yapıyoruz.</p>
  <div class="cover-bottom">
    <div><div class="toc-h">${i('gear')} Kendi imalatımız</div>
      <ul class="toc-mini">${A.map((u) => `<li><b>${u.no}</b>${u.ad}<span>${SAYFA[u.qr]}</span></li>`).join('')}</ul></div>
    <div><div class="toc-h">${i('hand')} Sattığımız ürünler</div>
      <ul class="toc-mini">${B.map((u) => `<li><b>${u.no}</b>${u.ad}<span>${SAYFA[u.qr]}</span></li>`).join('')}</ul></div>
    <div class="cover-call">${i('phone')}<b>${FIRMA.telefon}</b><span>Telefon · WhatsApp<br>Her gün 08:00–19:00</span></div>
  </div>
</section>`;

const sayfaBaslik = (kicker, baslik) => `<div><p class="kicker">${kicker}</p><h2 class="display">${baslik}</h2></div>`;
const basitAlt = (no) => altBant('whatsapp', no, 'Sorunuz mu var?', 'QR’ı okutun, WhatsApp’tan yazın');

// ---------- Tanıtım ----------
const tanitim = `
<section class="page">
  <figure class="intro-hero">
    <img src="${foto('tarim-romorku-yesil-teslimat')}" alt="Üçel römorkunu teslim alan müşteri">
    <div class="intro-hero-txt"><p class="kicker">Hoş geldiniz</p><h2 class="display">Göksun’dan,<br>tarlanıza.</h2></div>
    <figcaption>Yeni römorkunu teslim alan müşterimiz. Kasada kendi adı yazılı.</figcaption>
  </figure>
  <div class="intro">
    <div class="intro-grid">
      <p class="big">Üçel Tarım Aletleri olarak Göksun Sanayi Sitesi’ndeki atölyemizde <strong>römork, yaylı kültivatör, loader kepçe ve su tankerini kaynağından boyasına kadar kendimiz üretiyoruz.</strong> Ürünlerimizin üzerinde <strong>ÜÇEL · GÖKSUN</strong> yazar.</p>
      <p class="big">Pulluk, tapan ve gübre serpme makinesi gibi diğer aletlerin satışını da yapıyoruz. Traktörünüze ve işinize uygun olanı <strong>birlikte seçiyoruz.</strong></p>
    </div>
    <ul class="values">
      <li>${i('gear')}<b>Kendi imalatımız</b><span>Dört ürün Göksun’daki atölyemizden çıkar.</span></li>
      <li>${i('paint')}<b>Size özel</b><span>Kasa rengi ve kasa yazısı isteğinize göre.</span></li>
      <li>${i('truck')}<b>Türkiye geneli</b><span>Anlaşmalı nakliyeyle kapınıza.</span></li>
      <li>${i('wrench')}<b>Satıştan sonra</b><span>Yedek parça, takas, ikinci el.</span></li>
    </ul>
    <div class="toc">
      <div><h3>A · Kendi imalatımız</h3><ul>${A.map((u) => `<li><b>${u.no}</b>${u.ad}<span></span><em>${SAYFA[u.qr]}</em></li>`).join('')}</ul></div>
      <div><h3>B · Sattığımız ürünler</h3><ul>${B.map((u) => `<li><b>${u.no}</b>${u.ad}<span></span><em>${SAYFA[u.qr]}</em></li>`).join('')}
        <li><b>${i('tractor')}</b>Hangi iş için hangi alet?<span></span><em>3</em></li>
        <li><b>${i('wrench')}</b>Sahadan · Hizmetler · Fiyat<span></span><em>13</em></li></ul></div>
    </div>
  </div>
  ${basitAlt(2)}
</section>`;

// ---------- Rehber ----------
const urun = Object.fromEntries(URUNLER.map((u) => [u.qr, u]));
const ADIM = [
  ['pulluk', '1 · Sonbahar / ilkbahar', 'Toprağı sürmek', 'Toprağı devirir, anızı gömer. Derin işleme için ilk adım.'],
  ['kultivator', '2 · Ekim öncesi', 'Toprağı inceltmek', 'Sürülmüş toprağı ufalar, tohum yatağını hazırlar.'],
  ['tapan', '3 · Ekim öncesi', 'Tarlayı düzlemek', 'Keseği kırar, yüzeyi düzler; ekim makinesi düzgün çalışır.'],
  ['gubre', '4 · Ekimle birlikte', 'Gübre vermek', 'Granül gübreyi tarlaya dengeli şekilde serper.'],
  ['tanker', '5 · Yaz boyunca', 'Su taşımak', 'Tarla sulaması, merada ve yaylada hayvan suyu.'],
  ['romork', '6 · Hasat ve kış', 'Taşımak', 'Ürün, saman, yem, odun ve gübre taşıma.'],
  ['kepce', '7 · Her mevsim', 'Yüklemek', 'Gübre, yem ve malzemeyi kaldırır, römorka yükler.'],
];
const rehber = `
<section class="page">
  <div class="intro" style="padding-top:14mm">
    ${sayfaBaslik('Rehber', 'Hangi iş için hangi alet?')}
    <p class="big">Tarlanın sürümünden hasadın taşınmasına kadar, sezon boyunca işinizi gören aletler.</p>
    <ol class="steps">
      ${ADIM.map(([q, z, t, d]) => `<li><span class="thumb">${kucuk(urun[q])}</span><div><h3><small>${z}</small>${t}</h3><p>${d}</p></div><div class="go">${urun[q].ad}<span>Sayfa ${SAYFA[q]} ${i('arrow')}</span></div></li>`).join('')}
    </ol>
    <div class="tip">${i('gauge')}<p><b>Önce traktörünüze bakın.</b> Her aletin istediği traktör gücü farklıdır. Traktörünüzün marka, model ve beygir gücünü yazın; gücüne uygun olanı söyleyelim.</p></div>
  </div>
  ${basitAlt(3)}
</section>`;

// ---------- Bölüm ayırıcı ----------
const bolumSayfa = (harf, baslik, metin, liste, no, sekme) => `
<section class="page dark">
  <div class="section">
    <svg class="gear-bg" viewBox="0 0 100 100" aria-hidden="true"><path d="${DISLI}"/></svg>
    <span class="tab">${sekme}</span>
    <p class="kicker">Bölüm ${harf}</p>
    <h2 class="display">${baslik}</h2>
    <p class="sub">${metin}</p>
    <ul class="cards n${liste.length}">
      ${liste.map((u) => `<li><div class="card-img">${kucuk(u)}</div><div class="card-txt"><b>${u.no}</b><strong>${u.ad}</strong><span>Sayfa ${SAYFA[u.qr]} ${i('arrow')}</span></div></li>`).join('')}
    </ul>
    <div class="sec-foot">${serit}<span>${no}</span></div>
  </div>
</section>`;

// ---------- Sahadan ----------
const sahadan = `
<section class="page">
  <div class="intro">
    ${sayfaBaslik('Sahadan', 'Teslim ettiklerimiz')}
    <p class="quote">Bu sayfadaki fotoğrafların hepsi gerçek: atölyemizden çıkan aletler, müşterilerimizin elinde.</p>
    <div class="gallery">
      <figure class="wide"><img src="${foto('tarim-romorku-yesil')}" alt="Yeşil tarım römorku" style="object-position:50% 60%"><figcaption>Yeşil römork, kasasında müşterimizin adıyla.</figcaption></figure>
      <figure><img src="${foto('on-yukleyici-kaldirma')}" alt="Loader kepçe kaldırırken"><figcaption>Loader kepçe tam yükseklikte.</figcaption></figure>
      <figure><img src="${foto('on-yukleyici-saha')}" alt="Loader kepçe sahada"><figcaption>Traktöre takılı, işe hazır.</figcaption></figure>
      <figure><img src="${foto('tarim-romorku-yuk-araci')}" alt="Römork yük aracında"><figcaption>Uzak illere: römork yük aracında yola çıkıyor.</figcaption></figure>
      <figure><img src="${foto('on-yukleyici-atolye')}" alt="Atölye önünde loader"><figcaption>Göksun Sanayi Sitesi’ndeki atölyemizin önü.</figcaption></figure>
    </div>
  </div>
  ${basitAlt(13)}
</section>`;

// ---------- Hizmetler ----------
const hizmetler = `
<section class="page">
  <div class="intro">
    ${sayfaBaslik('Satıştan sonra da yanınızdayız', 'Hizmetlerimiz')}
    <p class="big">Sadece satış değil; aletinizin her aşamasında yanınızdayız.</p>
    <ul class="svc">
      <li><span class="n">${i('cycle')}</span><div><b>İkinci el</b><span>İkinci el tarım aleti alıp satıyoruz; gerçek durumunu dürüstçe paylaşıyoruz.</span></div></li>
      <li><span class="n">${i('swap')}</span><div><b>Takas</b><span>Eski aletinizin fotoğrafını gönderin; yeni ya da ikinci el bir aletle takas edelim.</span></div></li>
      <li><span class="n">${i('ruler')}</span><div><b>Özel imalat</b><span>Kendi imal ettiğimiz aletlerde ihtiyacınıza göre özel ölçü yapabiliyoruz.</span></div></li>
      <li><span class="n">${i('gear')}</span><div><b>Yedek parça</b><span>Sattığımız ve sık kullanılan aletler için yedek parça bulunduruyoruz.</span></div></li>
    </ul>
    <figure class="intro-photo"><img src="${foto('doner-ot-tirmigi-sevkiyat')}" alt="Atölye önünde sevkiyat" style="object-position:50% 35%"><figcaption>Atölyemizin önünde: bir alet müşterimize gönderilmek üzere yükleniyor.</figcaption></figure>
    <div class="ask">
      <div><h3>Listede yoksa sorun</h3><p>Katalogda görmediğiniz aletler için de bize yazın; birlikte bakalım.</p>
        <ul class="chips"><li>Mibzer</li><li>Çayır biçme makinesi</li><li>Döner ot tırmığı</li><li>Tesviye küreği</li><li>ve diğerleri</li></ul></div>
      <span class="ask-i">${i('question')}</span>
    </div>
    <div class="ship">${i('truck')}<p><b>Türkiye geneline gönderim.</b> Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz. Şehrinizi yazın, seçeneği birlikte belirleyelim.</p></div>
  </div>
  ${basitAlt(14)}
</section>`;

// ---------- Fiyat ----------
const fiyat = `
<section class="page">
  <div class="intro">
    ${sayfaBaslik('Kolay sipariş', '3 adımda fiyat alın')}
    <ol class="three">
      <li><b>1</b>${i('list')}<strong>Ürünü seçin</strong><span>Bu katalogdan ihtiyacınıza uygun aleti bulun.</span></li>
      <li><b>2</b>${i('chat')}<strong>WhatsApp’tan yazın</strong><span>Ürün sayfasındaki QR’ı okutun; mesajınız hazır açılır.</span></li>
      <li><b>3</b>${i('hand')}<strong>Fiyatı konuşalım</strong><span>Fiyatı, seçenekleri ve teslimatı birlikte netleştirelim.</span></li>
    </ol>
    <div class="form">
      <h3>Bize yazarken bunları ekleyin</h3>
      <p>Bu bilgilerle size en uygun aleti ve doğru fiyatı ilk mesajda verebiliriz. Kalemle doldurup fotoğrafını da gönderebilirsiniz.</p>
      <div class="form-rows">
        <div>${i('list')} İstediğiniz alet:</div>
        <div>${i('tractor')} Traktör marka / model:</div>
        <div>${i('gauge')} Traktör gücü (HP):</div>
        <div>${i('pin')} İl / ilçe:</div>
        <div>${i('soil')} Arazi (taşlı, ağır, düz…):</div>
        <div>${i('paint')} Renk / kasa yazısı:</div>
        <div>${i('user')} Ad soyad:</div>
        <div>${i('phone')} Telefon:</div>
      </div>
      <div class="form-notes"><span>Notlarım</span></div>
    </div>
  </div>
  ${basitAlt(15)}
</section>`;

// ---------- Arka kapak ----------
const arka = `
<section class="page dark">
  <div class="back">
    ${logo('logo-lg')}
    <p class="lbl">Fiyat ve bilgi için</p>
    <p class="tel">${FIRMA.telefon}</p>
    <p class="hours">Telefon ve WhatsApp · Her gün 08:00 – 19:00</p>
    <ul class="qrs">
      <li><div class="qr"><img src="qr/whatsapp.svg" alt="WhatsApp QR"></div><b>${i('chat')} WhatsApp</b><span>Mesajınız hazır açılır</span></li>
      <li><div class="qr"><img src="qr/harita.svg" alt="Konum QR"></div><b>${i('pin')} Konum</b><span>Yol tarifi alın</span></li>
      <li><div class="qr"><img src="qr/site.svg" alt="Web sitesi QR"></div><b>${i('globe')} Web sitesi</b><span>Tüm ürünler ve fotoğraflar</span></li>
    </ul>
    <div class="back-row"><img src="${kesit('k-kultivator-mavi')}" alt=""><img src="${kesit('k-romork-yesil')}" alt=""><img src="${kesit('k-tanker')}" alt=""></div>
    <p class="svcs"><b>Hizmetlerimiz</b>İkinci el · Takas · Özel imalat · Yedek parça</p>
    <address>Üçel Tarım Aletleri · Yeni Mah., Göksun Sanayi Sitesi, 46660 Göksun / Kahramanmaraş</address>
    ${serit}
  </div>
</section>`;

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Üçel Ürün Kataloğu 2026</title>
<meta name="description" content="Üçel Tarım Aletleri 2026 ürün kataloğu: tarım römorku, yaylı kültivatör, loader kepçe, su tankeri, tapan, pulluk ve gübre serpme makinesi. Göksun / Kahramanmaraş.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="katalog.css">
</head>
<body>
${kapak}
${tanitim}
${rehber}
${bolumSayfa('A', 'Kendi<br><em>imalatımız</em>', 'Göksun Sanayi Sitesi’ndeki atölyemizde kaynağından boyasına kadar kendimiz üretiyoruz. Ürünlerimizin üzerinde <b>ÜÇEL · GÖKSUN</b> yazar.', A, 4, 'A · İmalat')}
${A.map(urunSayfa).join('')}
${bolumSayfa('B', 'Sattığımız<br><em>ürünler</em>', 'Toprak hazırlığından gübrelemeye. Traktörünüze ve işinize uygun olanı birlikte seçelim.', B, 9, 'B · Satış')}
${B.map(urunSayfa).join('')}
${sahadan}
${hizmetler}
${fiyat}
${arka}
</body>
</html>
`;
writeFileSync(join(KOK, 'index.html'), html);
console.log('katalog/index.html yazıldı');

if (process.argv.includes('--pdf')) {
  const { createRequire } = await import('node:module');
  const { chromium } = createRequire(import.meta.url)('playwright'); // NODE_PATH'teki global kurulum
  const tarayici = await chromium.launch();
  const sayfa = await tarayici.newPage();
  await sayfa.goto('file://' + join(KOK, 'index.html'), { waitUntil: 'networkidle' });
  await sayfa.evaluate(() => document.fonts.ready);
  await sayfa.pdf({ path: join(KOK, 'Ucel-Katalog-2026.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await tarayici.close();
  console.log('katalog/Ucel-Katalog-2026.pdf yazıldı');
}
