// Üçel basılı ürün kataloğu (A4, 14 sayfa) — Üçel'in Canva kataloğundaki sarı-siyah tasarım üzerine.
//   python3 ucel-romork/_kaynak/katalog_qr.py   (QR kodları — bir kez)
//   python3 ucel-romork/_kaynak/katalog_gorsel.py (fotoğraflar + dekupe — bir kez)
//   node ucel-romork/_kaynak/katalog.mjs        (katalog/index.html)
//   node ucel-romork/_kaynak/katalog.mjs --pdf  (+ katalog/Ucel-Katalog-2026.pdf)
//   python3 ucel-romork/_kaynak/pdf_sikistir.py ucel-romork/katalog/Ucel-Katalog-2026.pdf (tekrar eden görseller)
//   python3 ucel-romork/_kaynak/katalog_hafif.py (+ WhatsApp için hafif PDF)
//
// KURAL (veri.mjs ile aynı): Üçel'in teyit etmediği teknik değer yazılmaz.
import { readFileSync, writeFileSync } from 'node:fs';
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
  star: '<path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
};
const i = (ad) => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${IKON[ad]}</svg>`;


// ---------- Marka öğeleri (Üçel'in Canva kataloğundan: sarı-siyah-açık gri, Poppins, dişli amblem) ----------
const AMBLEM = 'img/logo-amblem.png'; // Canva kataloğundan alınan amblem (dişli + monogram)
const logo = (cls = '') => `<div class="logo ${cls}"><img src="${AMBLEM}" alt=""><div><b>ÜÇEL</b><small>TARIM ALETLERİ</small></div></div>`;
const foto = (ad) => `img/${ad}.jpg`;      // katalog_gorsel.py: sıcak tonlu fotoğraf
const kesit = (ad) => `img/${ad}.png`;     // katalog_gorsel.py: dekupe (arka planı ayrılmış ürün)
const susler = '<i class="corner-tl" aria-hidden="true"></i><i class="corner-tr" aria-hidden="true"><b></b><b></b></i>';

// ---------- Ürünler ----------
// sahne: kesit (dekupe) ya da foto. bilinen: Üçel'in teyit ettiği değerler.
// olcu: modele göre değişen ölçüler; teknik tabloda "Modele göre" yazar (değer gelince bilinen'e taşınır).
const RENK = { mavi: ['Mavi', '#1F5FA8'], yesil: ['Yeşil', '#1E6A55'], kirmizi: ['Kırmızı', '#C0172F'] };
const URUNLER = [
  {
    no: '01', qr: 'romork', ad: 'Tarım Römorku', bolum: 'A', cat: 'Taşıma', imalat: true,
    tag: 'Ürününüzü, yeminizi ve odununuzu tek römorkla taşıyın.',
    lead: 'Tarladan eve, depodan tarlaya yük taşımanın temel aleti. Kaynağından boyasına kadar Göksun’daki atölyemizde üretiyoruz.',
    sahne: { kesit: 'k-romork' },
    uses: [['wheat', 'Tarla ürünü'], ['sack', 'Gübre ve yem'], ['logs', 'Odun ve malzeme']], usesH: 'Ne taşır?',
    bilinen: [['Taşıma kapasitesi', '2 – 10 ton arası']],
    olcu: ['Kasa iç ölçüsü (mm)', 'Dingil', 'Damper', 'Lastik ebadı', 'Traktör gücü (HP)'],
    renk: ['mavi', 'yesil', 'kirmizi'], renkNot: 've istediğiniz diğer renkler',
    sec: ['2 tondan 10 tona kadar kapasite seçenekleri', 'Kasa rengi isteğe göre', 'Kasaya isim, firma adı ya da “Maşallah” yazısı', 'Standart dışı ölçüde özel imalat'],
    saha: [['romork-damperli', 'Damperli römork, kasa kaldırılmış.'], ['romork-kirmizi-traktor', 'Kırmızı römork, traktöre bağlı.']],
  },
  {
    no: '05', qr: 'kultivator', ad: 'Yaylı Kültivatör', bolum: 'B', cat: 'Toprak işleme', imalat: true,
    tag: 'Pulluktan sonra toprağı inceltir, tohum yatağını hazırlar.',
    lead: 'Göksun model yaylı kültivatör. Yaylı ayaklar taşa çarpınca esner; hem aleti hem traktörü korur. Atölyemizde üretiyoruz.',
    sahne: { kesit: 'k-kultivator' },
    uses: [['soil', 'Toprak yüzey işleme'], ['sprout', 'Tohum yatağı'], ['noweed', 'Yabani ot mücadelesi']], usesH: 'Ne işe yarar?',
    bilinen: [['Model', 'Göksun'], ['Ayak tipi', 'Yaylı'], ['Ayak sayısı', '9 – 11']],
    olcu: ['Çalışma genişliği (cm)', 'Çalışma derinliği (cm)', 'Traktör gücü (HP)'],
    renk: ['kirmizi', 'mavi', 'yesil'],
    sec: ['9 ile 11 ayak arası seçenekler'],
    saha: [['kultivator-renkler', 'Kırmızı, mavi ve yeşil kültivatörler.'], ['kultivator-mavi-atolye', 'Atölyemizin önünde mavi kültivatörler.']],
  },
  {
    no: '02', qr: 'kepce', ad: 'Loader Kepçe', bolum: 'A', cat: 'Yükleme', imalat: true,
    tag: 'Traktör arkası asistan kepçe: gübre, yem ve malzemeyi yükleyin.',
    lead: 'Traktörünüzün arkasına takılan hidrolik asistan kepçe. Yem, gübre ve malzemeyi kaldırıp taşır. Kendi atölyemizde imal ediyoruz.',
    sahne: { kesit: 'k-kepce' },
    uses: [['lift', 'Yükleme ve boşaltma'], ['barn', 'Ahır ve çiftlik işleri'], ['box', 'Malzeme taşıma']], usesH: 'Ne işe yarar?',
    bilinen: [['Çalışma', 'Hidrolik'], ['Montaj', 'Traktörün arkasına'], ['Kepçe tipi', 'Düz · Çeneli']],
    olcu: ['Kaldırma kapasitesi (kg)', 'Kaldırma yüksekliği (cm)', 'Kepçe genişliği (cm)', 'Traktör gücü (HP)'],
    renk: ['kirmizi', 'mavi'],
    sec: ['Düz kepçe ya da çenesi açılan kepçe', 'Traktörünüze montaj uygunluğunu birlikte kontrol ederiz'],
    saha: [['kepce-kirmizi-traktor', 'Traktörün arkasına takılı kırmızı kepçe.'], ['kepce-mavi', 'Mavi asistan kepçeler.']],
  },
  {
    no: '03', qr: 'tanker', ad: 'Su Tankeri', bolum: 'A', cat: 'Su', imalat: true,
    tag: 'Tarla sulaması ve hayvan suyu için traktörle çekilen tanker.',
    lead: 'Merada ve yaylada hayvanlara, bahçede fidana, tarla başında ilaçlamaya su taşır. Göksun’daki atölyemizde imal ediyoruz.',
    sahne: { kesit: 'k-tanker-mavi' },
    uses: [['drop', 'Tarla sulama'], ['cow', 'Hayvan suyu'], ['truck', 'Genel su taşıma']], usesH: 'Ne işe yarar?',
    bilinen: [['Tank kapasitesi', '2 – 7 ton'], ['Çekiş', 'Traktörle, çeki oklu şasi']],
    olcu: ['Tank malzemesi', 'Dingil', 'Pompa', 'Traktör gücü (HP)'],
    renk: ['mavi', 'yesil'],
    sec: ['2 tondan 7 tona kapasite seçenekleri', 'Hayvan sayınıza ve sulama alanınıza göre birlikte seçelim'],
    saha: [['tanker-yesil', 'Yeşil su tankeri.'], ['su-tankeri', 'Mavi su tankerleri.']],
  },
  {
    no: '06', qr: 'tapan', ad: 'Loğlu Tapan', bolum: 'B', cat: 'Toprak işleme', imalat: true,
    tag: 'Ekim öncesi tarlayı düzler, kesek kırar.',
    lead: 'Pulluk ve kültivatörden sonra tarlanın yüzeyini düzler, keseği kırar. Arkasındaki loğ (silindir) toprağı bastırarak ekime hazırlar.',
    sahne: { kesit: 'k-tapan' },
    uses: [['flat', 'Tarlayı düzler'], ['hammer', 'Kesek kırar'], ['sprout', 'Ekime hazırlar']], usesH: 'Ne işe yarar?',
    bilinen: [['Tip', 'Loğlu (silindirli)']],
    olcu: ['Çalışma genişliği (cm)', 'Katlanır / sabit', 'Ağırlık (kg)', 'Traktör gücü (HP)'],
    sec: ['Farklı genişlik seçenekleri'],
    saha: [['tapan-loglu-traktor', 'Traktöre takılı loğlu tapan.'], ['tapan-loglu', 'Loğlu tapan, atölyemizin önünde.']],
    akis: 2, akisNot: 'Tapan, pulluk ve kültivatörden sonra, ekimden hemen önce kullanılır.',
  },
  {
    no: '04', qr: 'pulluk', ad: 'Pulluk', bolum: 'B', cat: 'Toprak işleme', imalat: true,
    tag: 'Tarlanın ekim öncesi derin işlenmesinde temel alet.',
    lead: 'Toprağı devirerek sürer, anızı toprağa gömer. Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.',
    sahne: { kesit: 'k-pulluk-2' },
    uses: [['soil', 'Derin toprak işleme'], ['sprout', 'Ekim öncesi hazırlık'], ['plough', 'Anız bozma']], usesH: 'Ne işe yarar?',
    bilinen: [['Tip', 'Kulaklı'], ['Gövde sayısı', '3’lü ve 4’lü']],
    olcu: ['Çalışma genişliği (cm)', 'Çalışma derinliği (cm)', 'Traktör gücü (HP)'],
    sec: ['3’lü ve 4’lü pulluk çeşitleri'],
    saha: [['pulluk-mavi-2', 'Mavi kulaklı pulluk.'], ['pulluk-cesitleri', 'Pulluk çeşitlerimiz.']],
  },
  {
    no: '07', qr: 'gubre', ad: 'Gübre Serpme Makinesi', bolum: 'B', cat: 'Gübreleme', imalat: true,
    tag: 'Gübreyi tarlanıza dengeli şekilde dağıtın.',
    lead: 'Traktörün arkasına takılır; granül gübreyi tarlaya eşit serper. Elle serpmeye göre zaman kazandırır.',
    sahne: { kesit: 'k-gubre' },
    uses: [['spread', 'Granül gübre serpme'], ['wheat', 'Dengeli dağıtım'], ['tractor', 'Traktör arkasına takılır']], usesH: 'Ne işe yarar?',
    bilinen: [],
    bilinen: [['Depo hacmi', '400 – 600 lt']],
    olcu: ['Serpme genişliği (m)', 'Tip', 'Traktör gücü (HP)'],
    sec: ['400 ve 600 litre arası depo seçenekleri'],
    saha: [['gubre-serpme-sira', 'Gübre serpme makineleri.'], ['gubre-serpme-atolye', 'Atölyemizin önünde.']],
    akis: 3, akisNot: 'Taban gübresi için ekimden önce, üst gübre için bitki büyürken kullanılır.',
  },
];
// C · Diğer ürünlerimiz (Üçel'in 20.10.2026'da WhatsApp'tan gönderdiği liste).
// Üçel teyidi (21.10.2026): markasız olanların hepsi kendi imalatı, markalı olanlar satış.
const DIGER = [
  [{ qr: 'tampon', imalat: true, ad: 'Traktör Ön Tamponu', foto: 'tampon-on', pos: '50% 62%', cat: 'Traktör', d: 'Traktörün önüne takılan tampon. Boyasını beğendiğiniz renkte yapıyoruz.' },
   { qr: 'odun-sepeti', imalat: true, ad: 'Traktör Arkası Odun Sepeti', foto: 'odun-sepeti', pos: '50% 55%', cat: 'Taşıma', d: 'Odun ve malzeme taşımak için traktörün arkasına takılan sepet.' },
   { qr: 'bahce-sepeti', imalat: true, ad: 'Traktör Arkası Bahçe Sepeti', foto: 'bahce-sepeti', pos: '45% 60%', cat: 'Taşıma', d: 'Bahçede ürün, kasa ve malzeme taşımak için traktör arkası sepet.' },
   { qr: 'tas-toplama', imalat: true, ad: 'Taş Toplama Tırmığı', foto: 'tas-toplama-tirmigi', pos: '50% 55%', cat: 'Toprak işleme', d: 'Tarladaki taşları toplayıp ayıklamak için traktör arkasına takılır.' }],
  [{ qr: 'helikopter', imalat: true, ad: 'Helikopter Ot Toplama Tırmığı', foto: 'helikopter-tirmik', pos: '50% 60%', cat: 'Ot ve saman', d: 'Biçilmiş otu toplayıp sıraya dizer, balyalamaya hazırlar.' },
   { qr: 'ot-bicme', ad: 'Ot Biçme Tamburu', foto: 'ot-bicme-tamburu', pos: '50% 60%', cat: 'Ot ve saman', marka: 'Sürüm marka · Satış', d: 'Çayır, yonca ve ot biçimi için tamburlu biçme makinesi.' },
   { qr: 'aspirator', ad: 'Saman Üfleme Aspiratörü', foto: 'saman-aspiratoru', pos: '50% 62%', cat: 'Ot ve saman', marka: 'Satışını yapıyoruz', d: 'Samanı üfleyerek samanlığa ya da depoya aktarır.' },
   { qr: 'ilac', ad: 'İlaç Makinesi', foto: 'ilac-makinasi', pos: '50% 58%', cat: 'İlaçlama', marka: 'Satışını yapıyoruz', d: 'Hortum makaralı ilaçlama makinesi; bahçe ve tarla ilaçlaması için.' },
   { qr: 'yem-karma', ad: 'Yem Karma Makinesi', foto: ['yem-karma-metkarsan', 'yem-karma-sagro-2'], pos: '50% 55%', cat: 'Hayvancılık', marka: 'Satışını yapıyoruz', d: 'Hayvan yemini karıştırır. Metkarsan ve Sagro marka seçenekleri.' },
   { qr: 'vinc', imalat: true, ad: 'Traktör Arkası Yükleme Vinci', cat: 'Yükleme', d: 'Traktörün arkasına takılan yükleme vinci.' }],
];

const sirala = (l) => l.sort((a, b) => a.no.localeCompare(b.no));
const A = sirala(URUNLER.filter((u) => u.bolum === 'A'));
const B = sirala(URUNLER.filter((u) => u.bolum === 'B'));
// Sayfa numaraları (7 ürünün hepsi Üçel imalatı): kapak 1, A taşıma 2, ürünler 3-5, B toprak işleme 6, ürünler 7-10, C diğer ürünler 11-12, hizmetler 13, arka kapak 14
// QR kodlarıyla aynı adresler (katalog_qr.py üretir): PDF telefonda açılınca QR okutulamaz, dokunulur
const WA = JSON.parse(readFileSync(join(KOK, 'qr', 'linkler.json'), 'utf8'));
const TEL = 'tel:' + FIRMA.telefonE164;
const SAYFA = { romork: 3, kepce: 4, tanker: 5, pulluk: 7, kultivator: 8, tapan: 9, gubre: 10 };
const AKIS = ['Pulluk', 'Kültivatör', 'Tapan', 'Gübre', 'Ekim'];

const sahneSrc = (s) => (s.kesit ? `img/${s.kesit}.${s.uzanti || 'png'}` : foto(s.foto));
const kucuk = (u) => (u.sahne.kesit
  ? `<img class="cut" src="${sahneSrc(u.sahne)}" alt="${u.ad}">`
  : `<img class="ph" src="${foto(u.sahne.foto)}" alt="${u.ad}" style="object-position:${u.sahne.pos || '50% 50%'}">`);
const etiket = (ik, t) => `<div class="tagbar">${i(ik)}<span>${t}</span></div>`;

const altBant = (no, qr = 'whatsapp', ust = 'Fiyat ve bilgi için', alt = 'QR’ı okutun ya da dokunun; WhatsApp’ta mesajınız hazır açılır') => `
  <footer class="pf">
    <a class="qr" href="${WA[qr]}"><img src="qr/${qr}.svg" alt="WhatsApp QR kodu"></a>
    <a class="pf-cta" href="${WA[qr]}"><b>${ust}</b><span>${alt}</span></a>
    <a class="pf-tel" href="${TEL}"><em class="wa">${i('phone')}</em><div><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></div></a>
    <div class="pf-no">${no}</div>
  </footer>`;

const ustSerit = (sag) => `
  <header class="top">
    ${logo()}
    <div class="top-r"><p class="top-k">ÜRÜN KATALOĞU <em>2026</em> · GÖKSUN</p>${sag}</div>
  </header>`;

// ---------- Ürün sayfası (7 ürün aynı düzen) ----------
const urunSayfa = (u) => {
  const s = u.sahne;
  const sahne = s.kesit
    ? `<figure class="hero"><span class="hero-band"></span><img class="hero-cut" src="${sahneSrc(s)}" alt="${u.ad}">${s.not ? `<figcaption>${i('camera')} ${s.not}</figcaption>` : `<figcaption>${i('camera')} Gerçek fotoğraf</figcaption>`}</figure>`
    : `<figure class="hero photo"><img src="${foto(s.foto)}" alt="${u.ad}" style="object-position:${s.pos}"><figcaption>${i('camera')} ${s.not}</figcaption></figure>`;
  const renk = u.renk
    ? `<div class="swatches">${u.renk.map((r) => `<span><i style="background:${RENK[r][1]}"></i>${RENK[r][0]}</span>`).join('')}${u.renkNot ? `<em>${u.renkNot}</em>` : ''}</div>`
    : '';
  const alt = u.saha
    ? `<div class="saha">${etiket('camera', 'Sahadan')}
        <div class="saha-grid n${u.saha.length}">${u.saha.map(([f, c]) => `<figure><img src="${foto(f)}" alt="${c}"><figcaption>${c}</figcaption></figure>`).join('')}</div></div>`
    : `<div class="saha">${etiket('tractor', 'Tarlada iş sırası')}
        <div class="flow"><ol>${AKIS.map((a, k) => `<li class="${k === u.akis ? 'on' : ''}"><b>${k + 1}</b>${a}</li>`).join('')}</ol>
        <p>${u.akisNot}</p></div></div>
       <a class="ask-cta" href="${WA[u.qr]}">${i('chat')}<span><b>Fotoğraf ve ölçü isteyin</b>${u.ad} için güncel fotoğrafları ve ölçüleri WhatsApp’tan gönderelim.</span>${i('arrow')}</a>`;

  return `
<section class="page product" id="${u.qr}">
  ${susler}
  ${ustSerit(`<div class="cat"><b>${u.no}</b><span>${u.cat} · ${u.imalat ? 'Üçel imalatı' : 'Satışını yapıyoruz'}</span></div>`)}
  <div class="intro-row">
    <div class="intro-txt">
      <h1 class="${u.ad.length > 16 ? 'long' : ''}">${u.ad}</h1>
      <p class="tag">${u.tag}</p>
      <span class="bar"></span>
      <p class="lead">${u.lead}</p>
      <span class="badge ${u.imalat ? 'made' : ''}">${i(u.imalat ? 'gear' : 'hand')} ${u.imalat ? 'Kendi imalatımız' : 'Satışını yapıyoruz'}</span>
    </div>
    ${sahne}
  </div>
  <div class="uses-row">
    <h2>${u.usesH}</h2>
    <ul class="uses">${u.uses.map(([ik, t]) => `<li><em class="ui">${i(ik)}</em>${t}</li>`).join('')}</ul>
  </div>
  <div class="cols">
    <div>
      ${etiket('gear', 'Teknik bilgiler')}
      <table class="spec">
        ${u.bilinen.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}
        ${u.olcu.map((k) => `<tr><th>${k}</th><td class="mg">Modele göre</td></tr>`).join('')}
      </table>
      <a class="note" href="${WA[u.qr]}">${i('chat')} Ölçüleri WhatsApp’tan isteyin, gönderelim.</a>
    </div>
    <div>
      ${etiket('list', 'Seçenekler')}
      <ul class="checks">${u.sec.map((x) => `<li>${i('check')}<span>${x}</span></li>`).join('')}
        ${u.imalat ? '' : `<li>${i('check')}<span>Traktörünüze uygunluğunu birlikte kontrol ederiz</span></li><li>${i('check')}<span>Yedek parça desteği</span></li>`}
      </ul>
      ${u.renk ? `<p class="olcu-h">Renk seçenekleri:</p>${renk}` : ''}
    </div>
  </div>
  ${alt}
  ${altBant(SAYFA[u.qr], u.qr)}
</section>`;
};

// ---------- Kapak ----------
const kapak = `
<section class="page cover">
  ${susler}
  <p class="cover-k">ÜRÜN KATALOĞU <em>2026</em> · GÖKSUN</p>
  ${logo('logo-lg')}
  <h1>Tarlada da,<br>yolda da sağlam iş.</h1>
  <p class="sub">Römorktan pulluğa, aletlerimizi Göksun’daki atölyemizde kendimiz üretiyoruz.<br>Markalı makinelerin de satışını yapıyoruz.</p>
  <div class="showroom">
    <span class="sr-band"></span>
    <img class="s-romork-k" src="${kesit('k-romork-kirmizi')}" alt="Üçel kırmızı tarım römorku">
    <img class="s-orta" src="${kesit('k-gubre')}" alt="Üçel gübre serpme makinesi">
    <img class="s-romork" src="${kesit('k-romork')}" alt="Üçel tarım römorku">
    <img class="s-kepce" src="${kesit('k-kepce-mavi')}" alt="Üçel loader kepçe">
    <img class="s-kult" src="${kesit('k-kultivator')}" alt="Üçel yaylı kültivatör">
  </div>
  <ul class="cover-strip">
    ${[['k-tanker-mavi', 'Su tankeri'], ['k-kultivator-mavi', 'Kültivatör'], ['k-tapan', 'Loğlu tapan'], ['k-pulluk-2', 'Pulluk'], ['k-gubre', 'Gübre serpme']].map(([k, ad]) => `<li><img src="${kesit(k)}" alt="${ad}"><span>${ad}</span></li>`).join('')}
  </ul>
  <div class="cover-bottom">
    <div><div class="toc-h">${i('truck')} Taşıma ve yükleme</div>
      <ul class="toc">${A.map((u) => `<li><b>${u.no}</b>${u.ad}<span>${SAYFA[u.qr]}</span></li>`).join('')}</ul></div>
    <div><div class="toc-h">${i('soil')} Toprak işleme</div>
      <ul class="toc">${B.map((u) => `<li><b>${u.no}</b>${u.ad}<span>${SAYFA[u.qr]}</span></li>`).join('')}
        <li><b>${i('list')}</b>Diğer ürünlerimiz<span>11</span></li>
        <li><b>${i('wrench')}</b>Hizmetlerimiz<span>13</span></li></ul></div>
    <a class="cover-call" href="${WA.whatsapp}"><em class="wa">${i('chat')}</em><b>${FIRMA.telefon}</b><span>Telefon · WhatsApp</span></a>
  </div>
</section>`;

// ---------- Bölüm sayfası ----------
const bolumSayfa = (harf, baslik, metin, liste, no) => `
<section class="page section">
  ${susler}
  <p class="cover-k">ÜRÜN KATALOĞU <em>2026</em> · GÖKSUN</p>
  ${logo('logo-md')}
  <div class="sec-title"><p class="sec-k">Bölüm ${harf} · Kendi imalatımız</p><h2>${baslik}</h2><span class="bar"></span><p class="sub">${metin}</p></div>
  <ul class="cards n${liste.length}">
    ${liste.map((u) => `<li><span class="card-no">${u.no}</span><div class="card-img">${kucuk(u)}</div><div class="card-txt"><strong>${u.ad}</strong><span>${u.tag}</span><em>Sayfa ${SAYFA[u.qr]} ${i('arrow')}</em></div></li>`).join('')}
  </ul>
  <div class="sec-no"><span>SAYFA</span><b>${no}</b></div>
</section>`;

// ---------- C · Diğer ürünlerimiz ----------
const digerSayfa = (liste, no, ilk) => `
<section class="page product others">
  ${susler}
  ${ustSerit(`<div class="cat"><b>C</b><span>Diğer ürünlerimiz</span></div>`)}
  <div class="svc-head"><h1>Diğer ürünlerimiz</h1><p class="tag">${ilk ? 'Traktör, taşıma ve tarla işleri için diğer aletlerimiz.' : 'Ot, saman, ilaçlama ve hayvancılık işleri için.'}</p></div>
  <ul class="others-grid n${liste.length}">
    ${liste.map((u) => `<li>
      <figure class="${!u.foto ? 'bos' : Array.isArray(u.foto) ? 'cift' : ''}">${!u.foto ? `<em class="ui">${i('camera')}</em><small>Fotoğrafı WhatsApp’tan gönderelim</small>` : [].concat(u.foto).map((f) => `<img src="${foto(f)}" alt="${u.ad}" style="object-position:${u.pos}">`).join('')}<span class="o-cat">${u.cat}</span>${u.marka ? `<span class="o-marka">${u.marka}</span>` : u.imalat ? `<span class="o-marka made">${i('gear')} Kendi imalatımız</span>` : ''}</figure>
      <div class="o-txt"><strong>${u.ad}</strong><span>${u.d}</span><a href="${WA[u.qr]}">${i('chat')} Fiyat ve bilgi isteyin ${i('arrow')}</a></div>
    </li>`).join('')}
  </ul>
  ${altBant(no, 'whatsapp', 'Fiyat ve bilgi için', 'QR’ı okutun ya da ürünün altındaki bağlantıya dokunun')}
</section>`;

// ---------- Hizmetler ----------
const hizmetler = `
<section class="page product services">
  ${susler}
  ${ustSerit(`<div class="cat"><b>D</b><span>Satıştan sonra da yanınızdayız</span></div>`)}
  <div class="svc-head"><h1>Hizmetlerimiz</h1><p class="tag">Sadece satış değil; aletinizin her aşamasında yanınızdayız.</p></div>
  <ul class="svc">
    <li><em class="ui">${i('cycle')}</em><b>İkinci el</b><span>İkinci el tarım aleti alıp satıyoruz; gerçek durumunu dürüstçe paylaşıyoruz.</span></li>
    <li><em class="ui">${i('swap')}</em><b>Takas</b><span>Eski aletinizin fotoğrafını gönderin; yeni ya da ikinci el bir aletle takas edelim.</span></li>
    <li><em class="ui">${i('ruler')}</em><b>Özel imalat</b><span>Kendi imal ettiğimiz aletlerde ihtiyacınıza göre özel ölçü yapıyoruz.</span></li>
    <li><em class="ui">${i('gear')}</em><b>Yedek parça</b><span>Ürettiğimiz ve sattığımız aletler için yedek parça bulunduruyoruz.</span></li>
  </ul>
  <div class="ask"><em class="ui">${i('question')}</em><div><h3>Listede yoksa sorun</h3><p>Mibzer, tesviye küreği ve katalogda görmediğiniz diğer aletler için de bize yazın; birlikte bakalım.</p></div></div>
  <div class="three-h"><h2>3 adımda fiyat alın</h2></div>
  <ol class="three">
    <li><b>1</b><div><strong>Ürünü seçin</strong><span>Bu katalogdan ihtiyacınıza uygun aleti bulun.</span></div></li>
    <li><b>2</b><div><strong>WhatsApp’tan yazın</strong><span>Ürün adını, traktörünüzü ve ilinizi yazmanız yeterli.</span></div></li>
    <li><b>3</b><div><strong>Fiyatı konuşalım</strong><span>Fiyatı, seçenekleri ve teslimatı birlikte netleştirelim.</span></div></li>
  </ol>
  <div class="atolye-row">
    <figure class="atolye"><img src="${foto('doner-ot-tirmigi-sevkiyat')}" alt="Üçel atölyesi önünde sevkiyat"><figcaption>Atölyemizin önünde sevkiyat.</figcaption></figure>
    <div class="atolye-txt">
      <h3>Atölyemiz</h3>
      <p>${i('pin')}<span>Yeni Mah., Göksun Sanayi Sitesi,<br>46660 Göksun / Kahramanmaraş</span></p>
      <p>${i('clock')}<span>Her gün 08:00 – 19:00</span></p>
      <a class="yol" href="${WA.harita}">${i('pin')} Yol tarifi alın</a>
    </div>
  </div>
  <div class="ship"><em class="ui">${i('truck')}</em><p><b>Türkiye geneline gönderim.</b> Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinizi yazın, seçeneği birlikte belirleyelim.</p></div>
  ${altBant(13, 'whatsapp', 'Sorunuz mu var?', 'QR’ı okutun, WhatsApp’tan yazın')}
</section>`;

// ---------- Arka kapak ----------
const arka = `
<section class="page back">
  ${susler}
  ${logo('logo-lg')}
  <p class="lbl">Fiyat ve bilgi için</p>
  <a class="tel" href="${TEL}">${FIRMA.telefon}</a>
  <p class="hours">Telefon ve WhatsApp · Her gün 08:00 – 19:00</p>
  <ul class="qrs">
    <li><a href="${WA.whatsapp}"><em class="ui">${i('chat')}</em><b>WhatsApp</b><span>Mesajınız hazır açılır</span><span class="qr"><img src="qr/whatsapp.svg" alt="WhatsApp QR"></span></a></li>
    <li><a href="${WA.harita}"><em class="ui">${i('pin')}</em><b>Konum</b><span>Yol tarifi alın</span><span class="qr"><img src="qr/harita.svg" alt="Konum QR"></span></a></li>
    <li><a href="${WA.yorum}"><em class="ui">${i('star')}</em><b>Google yorum</b><span>Bizi değerlendirin</span><span class="qr"><img src="qr/yorum.svg" alt="Google yorum QR"></span></a></li>
  </ul>
  <div class="back-foot">
    <div class="back-row"><img src="${kesit('k-kultivator-mavi')}" alt=""><img src="${kesit('k-romork')}" alt=""><img src="${kesit('k-tanker-mavi')}" alt=""></div>
    <em class="ui">${i('gear')}</em>
    <h3>Hizmetlerimiz</h3>
    <p class="svcs">İkinci el · Takas · Özel imalat · Yedek parça</p>
    <address>${i('pin')} Üçel Tarım Aletleri · Yeni Mah., Göksun Sanayi Sitesi, <span class="nw">46660 Göksun / Kahramanmaraş</span></address>
    <span class="pf-no">14</span>
  </div>
</section>`;

const html = `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Üçel Ürün Kataloğu 2026</title>
<meta name="description" content="Üçel Tarım Aletleri 2026 ürün kataloğu: tarım römorku, yaylı kültivatör, asistan kepçe, su tankeri, loğlu tapan, pulluk, gübre serpme makinesi ve diğer tarım aletleri. Göksun / Kahramanmaraş.">
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="katalog.css">
</head>
<body>
${kapak}
${bolumSayfa('A', 'Taşıma ve yükleme', 'Göksun Sanayi Sitesi’ndeki atölyemizde kaynağından boyasına kadar kendimiz üretiyoruz. Ürünlerimizin üzerinde <b>ÜÇEL · GÖKSUN</b> yazar.', A, 2)}
${A.map(urunSayfa).join('')}
${bolumSayfa('B', 'Toprak işleme ve gübreleme', 'Sürümden ekime kadar tarla işlerinizin aletleri. Hepsi Göksun’daki atölyemizde, kendi imalatımız.', B, 6)}
${B.map(urunSayfa).join('')}
${digerSayfa(DIGER[0], 11, true)}
${digerSayfa(DIGER[1], 12, false)}
${hizmetler}
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
