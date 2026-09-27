// Üçel e-katalog verisi. Sayfalar bu dosyadan üretilir:
//   node ucel-romork/_kaynak/build.mjs
//
// KURAL: Üçel'in yazılı olarak teyit etmediği hiçbir teknik değer yazılmaz.
// Bilinmeyen değer null kalır ve sayfada hiç gösterilmez.
// "kanit" alanı, bilginin nereden geldiğini not etmek içindir (sayfada görünmez).

export const FIRMA = {
  ad: 'Üçel Tarım Aletleri',
  kisaAd: 'Üçel',
  yer: 'Göksun / Kahramanmaraş',
  ilce: 'Göksun',
  il: 'Kahramanmaraş',
  telefon: '0532 480 30 51',
  telefonE164: '+905324803051',
  whatsapp: '905324803051',
  harita: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Üçel Tarım Aletleri Göksun Kahramanmaraş'),
  // Yayın adresi (canonical, og:image ve WhatsApp mesajındaki linkler için)
  site: 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/ucel-romork/',
};

export const KATEGORILER = [
  {
    id: 'romorklar', ad: 'Römorklar', tekil: 'Römork',
    giris: 'Göksun atölyemizde yapılan tarım römorkları. Kasa rengini ve üzerine yazılacak adı birlikte seçiyoruz.',
    seoTitle: 'Tarım Römorku | Üçel Tarım Aletleri Göksun',
    seoDesc: "Üçel'in Göksun atölyesinde yapılan tarım römorkları. Renk ve kasa yazısı size özel. Model ve fiyat için WhatsApp'tan yazın.",
  },
  {
    id: 'su-tankerleri', ad: 'Su Tankerleri', tekil: 'Su tankeri',
    giris: 'Traktörle çekilen su tankerleri. Hayvancılıkta, bahçede ve tarlada su taşımak için.',
    seoTitle: 'Traktör Su Tankeri | Üçel Tarım Aletleri Göksun',
    seoDesc: "Hayvancılık ve tarla için traktörle çekilen su tankeri. Hacim seçenekleri ve fiyat için Üçel'e WhatsApp'tan ulaşın.",
  },
  {
    id: 'on-yukleyiciler', ad: 'Ön Yükleyiciler', tekil: 'Ön yükleyici',
    giris: 'Traktörün önüne takılan hidrolik kepçeler. Traktörünüze uygunluğunu birlikte kontrol ediyoruz.',
    seoTitle: 'Traktör Ön Yükleyici (Kepçe) | Üçel Göksun',
    seoDesc: "Farklı marka traktörlere takılan hidrolik ön yükleyici. Traktörünüze uygunluğunu WhatsApp'tan birlikte kontrol edelim.",
  },
  {
    id: 'toprak-isleme', ad: 'Toprak İşleme', tekil: 'Toprak işleme',
    giris: 'Kültivatör, pulluk ve tesviye küreği. Traktörünüzün gücüne ve arazinize göre birlikte seçelim.',
    seoTitle: 'Kültivatör, Pulluk, Tesviye Küreği | Üçel Göksun',
    seoDesc: 'Yaylı kültivatör, kulaklı pulluk ve tesviye küreği. Traktörünüze ve arazinize uygun olanı Üçel ile birlikte seçin.',
  },
  {
    id: 'diger-ekipmanlar', ad: 'Diğer Ekipmanlar', tekil: 'Ekipman',
    giris: 'Ot toplama ve gübreleme ekipmanları.',
    seoTitle: 'Döner Tırmık ve Gübre Serpme | Üçel Göksun',
    seoDesc: "Döner ot tırmığı ve gübre serpme makinesi. Bilgi ve fiyat için Üçel'e WhatsApp'tan ulaşın.",
  },
];

// Kullanım alanı filtreleri (ana sayfada "Hangi iş için arıyorsunuz?")
export const KULLANIM = [
  { id: 'yuk', ad: 'Yük taşıma' },
  { id: 'hayvancilik', ad: 'Hayvancılık' },
  { id: 'su', ad: 'Su' },
  { id: 'tarla', ad: 'Tarla hazırlığı' },
  { id: 'ot', ad: 'Ot ve saman' },
  { id: 'gubre', ad: 'Gübre' },
];

export const URUNLER = [
  {
    id: 'tarim-romorku', eskiId: 'tarim-romorku', kategori: 'romorklar', one: true,
    ad: 'Tarım Römorku',
    ozet: ['Renk size özel', 'Kasa yazısı size özel'],
    deger: 'Göksun atölyemizde yapılan tarım römorku. Kasa rengini ve üzerine yazılacak adı birlikte seçiyoruz.',
    faydalar: ['Saman, yem ve hasat taşıma', 'Odun ve yakacak taşıma', 'Gübre ve toprak taşıma', 'Tarladan ahıra, köyden pazara yük'],
    uygunluk: ['Traktörünüzün çekiş gücü yeterliyse', 'Taşıyacağınız yük römorkun kapasitesine uyuyorsa', 'Gideceğiniz yol ve arazi şartlarına uygunsa'],
    teknik: { 'Taşıma kapasitesi': null, 'Dingil sayısı': null, 'Kasa iç ölçüsü': null, 'Lastik ebadı': null, 'Damper': null },
    secenekler: ['Kasa rengi (mavi, yeşil ve diğer renkler)', 'Kasaya isim, firma adı ya da "Maşallah" yazısı'],
    kullanim: ['yuk', 'hayvancilik', 'ot', 'gubre'],
    foto: [
      ['tarim-romorku-mavi', 'Mavi tarım römorku, kasasında ÜÇEL yazısı ve ay-yıldız'],
      ['tarim-romorku-yesil', 'Yeşil tarım römorku, arkadan görünüm, kasada müşteri adı yazılı'],
      ['tarim-romorku-yesil-teslimat', 'Yeşil tarım römorku teslimatta, sahibi römorkun yanında'],
      ['tarim-romorku-traktor', 'Mavi tarım römorku yük aracında, yanında New Holland traktör'],
      ['tarim-romorku-yuk-araci', 'Mavi tarım römorku teslimat için yük aracında'],
    ],
    kanit: 'Fotoğraflar: müşteri adı yazılı kasalar, farklı renkler, ÜÇEL SANAYİ GÖKSUN yazısı.',
  },
  {
    id: 'su-tankeri', eskiId: 'su-tankeri', kategori: 'su-tankerleri', one: true,
    ad: 'Su Tankeri Römorku',
    ozet: ['Traktörle çekilir', 'Çeki oklu şasi'],
    deger: 'Traktörle çekilen su tankeri. Hayvan sulama, bahçe ve tarla işleri için.',
    faydalar: ['Merada ve yaylada hayvanlara su', 'Bahçe ve fidan sulaması', 'Tarla başında su ihtiyacı'],
    uygunluk: ['İhtiyacınız olan su miktarına uygunsa', 'Traktörünüzün çekiş gücü yeterliyse', 'Gideceğiniz yolun durumuna uygunsa'],
    teknik: { 'Tank hacmi': null, 'Tank malzemesi': null, 'Dingil sayısı': null, 'Lastik ebadı': null },
    secenekler: [],
    kullanim: ['su', 'hayvancilik'],
    foto: [['su-tankeri', 'İki adet su tankeri römorku, oval gövdeli tank ve mavi şasi']],
    kanit: 'Fotoğraf: iki tanker, tek dingil görünümlü şasi, park ayağı.',
  },
  {
    id: 'on-yukleyici', eskiId: 'on-yukleyici', kategori: 'on-yukleyiciler', one: true,
    ad: 'Traktör Ön Yükleyici (Kepçe)',
    ozet: ['Hidrolik', 'Farklı marka traktörlere'],
    deger: 'Traktörün önüne takılan hidrolik kepçe. Traktörünüzün marka ve modelini söyleyin, uygunluğunu birlikte kontrol edelim.',
    faydalar: ['Gübre ve toprak yükleme', 'Saman ve yem aktarma', 'Tesviye ve dolgu işleri', 'Avlu ve yol temizliği'],
    uygunluk: ['Traktörünüzün marka ve modeline uygunsa', 'Traktörünüzün beygir gücü yeterliyse', 'Yapacağınız işe (gübre, toprak, yem) uygunsa'],
    teknik: { 'Uygun traktör gücü': null, 'Kaldırma kapasitesi': null, 'Kepçe genişliği': null },
    secenekler: ['Kırmızı ve mavi renk örnekleri'],
    kullanim: ['yuk', 'hayvancilik', 'gubre', 'ot'],
    foto: [
      ['on-yukleyici-atolye', 'Mavi traktöre takılı kırmızı ön yükleyici, kepçe yukarıda'],
      ['on-yukleyici-kubota', 'Kubota traktöre takılı kırmızı ön yükleyici'],
      ['on-yukleyici-kaldirma', 'Ön yükleyici kepçeyi kaldırırken'],
      ['on-yukleyici-saha', 'Kırmızı ön yükleyici sahada, kepçe aşağıda'],
      ['on-yukleyici-mavi', 'Mavi traktöre takılı mavi ön yükleyici'],
      ['on-yukleyici-ve-pulluk', 'Üçel ön yükleyici ve pulluk'],
    ],
    kanit: 'Fotoğraflar: Kubota ve farklı traktörlerde montaj; kırmızı ve mavi.',
  },
  {
    id: 'yayli-kultivator', eskiId: 'kultivator', kategori: 'toprak-isleme',
    ad: 'Göksun Yaylı Kültivatör',
    ozet: ['Yaylı ayaklar', 'Kırmızı · Mavi'],
    deger: 'Yaylı ayaklı Göksun model kültivatör. Toprağı kabartmak ve ot temizliği için.',
    faydalar: ['Ekim öncesi toprağı kabartma', 'Yabancı otla mücadele', 'Toprağı havalandırma'],
    uygunluk: ['Traktörünüzün beygir gücü yeterliyse', 'Arazinizin yapısına (taşlı, ağır toprak) uygunsa', 'İhtiyacınız olan iş genişliğine uygunsa'],
    teknik: { 'Ayak tipi': 'Yaylı', 'Ayak sayısı': null, 'İş genişliği': null, 'Gereken traktör gücü': null },
    secenekler: ['Kırmızı ve mavi renk'],
    kullanim: ['tarla'],
    foto: [
      ['yayli-kultivator-kirmizi', 'Kırmızı Göksun yaylı kültivatör'],
      ['yayli-kultivator-mavi', 'Mavi Göksun yaylı kültivatör'],
    ],
    kanit: 'Fotoğraflar: yaylı ayaklar görünür, GÖKSUN ve ÜÇEL TARIM yazısı.',
  },
  {
    id: 'kulakli-pulluk', eskiId: 'pulluk', kategori: 'toprak-isleme',
    ad: 'Kulaklı Pulluk',
    ozet: ['Toprağı devirerek sürer'],
    deger: 'Toprağı devirerek süren kulaklı pulluk.',
    faydalar: ['Toprağı derin sürme ve devirme', 'Anız ve bitki artıklarını toprağa gömme'],
    uygunluk: ['Traktörünüzün beygir gücü yeterliyse', 'Arazinizin yapısına uygunsa'],
    teknik: { 'Gövde sayısı (fotoğraftaki model)': '4', 'İş genişliği': null, 'Gereken traktör gücü': null },
    secenekler: [],
    kullanim: ['tarla'],
    foto: [['kulakli-pulluk', 'Mavi dört gövdeli kulaklı pulluk']],
    kanit: 'Fotoğraf: 4 kulak sayılıyor.',
  },
  {
    id: 'tesviye-kuregi', eskiId: 'tesviye', kategori: 'toprak-isleme',
    ad: 'Tesviye Küreği',
    ozet: ['Geniş bıçak', 'Traktör arkasına takılır'],
    deger: 'Traktörün arkasına takılan geniş bıçaklı kürek.',
    faydalar: ['Toprak düzeltme', 'Avlu ve yol düzeltme'],
    uygunluk: ['Traktörünüzün beygir gücü yeterliyse', 'İhtiyacınız olan bıçak genişliğine uygunsa'],
    teknik: { 'Bıçak genişliği': null },
    secenekler: [],
    kullanim: ['tarla'],
    foto: [['tesviye-kuregi', 'Mavi tesviye kürekleri yan yana']],
    kanit: 'Ürün adı fotoğraftan verildi — Üçel teyidi bekleniyor.',
  },
  {
    id: 'doner-ot-tirmigi', eskiId: 'tirmik', kategori: 'diger-ekipmanlar',
    ad: 'Döner Ot Tırmığı',
    ozet: ['Tekerlekli şasi', 'Döner kollar'],
    deger: 'Biçilmiş otu sıraya toplamak için döner tırmık.',
    faydalar: ['Biçilmiş otu sıraya toplama', 'Balyalamaya hazırlık'],
    uygunluk: ['Traktörünüze uygunsa', 'Arazinizin büyüklüğüne uygunsa'],
    teknik: { 'İş genişliği': null, 'Kol sayısı': null },
    secenekler: [],
    kullanim: ['ot', 'hayvancilik'],
    foto: [
      ['doner-ot-tirmigi', 'Kırmızı döner ot tırmıkları'],
      ['doner-ot-tirmigi-sevkiyat', 'Döner ot tırmığı müşteriye gönderilmek üzere araca yükleniyor'],
    ],
    kanit: 'Üçel imalatı mı bayi ürünü mü — teyit bekleniyor. "İmal ediyoruz" yazılmaz.',
  },
  {
    id: 'gubre-serpme-makinesi', eskiId: 'gubre-serpme', kategori: 'diger-ekipmanlar',
    ad: 'Gübre Serpme Makinesi',
    ozet: ['Traktörle kullanılır'],
    deger: 'Traktöre takılan gübre serpme makinesi.',
    faydalar: ['Granül gübreyi tarlaya serpme'],
    uygunluk: ['Traktörünüze uygunsa', 'Arazinizin büyüklüğüne uygunsa'],
    teknik: { 'Depo hacmi': null, 'Serpme genişliği': null },
    secenekler: [],
    kullanim: ['gubre', 'tarla'],
    foto: [['romork-ve-gubre-serpme', 'Mavi gübre serpme makinesi, römork üzerinde teslimatta']],
    kanit: 'Üçel imalatı mı bayi ürünü mü — teyit bekleniyor.',
  },
];

// Sahadan: gerçek teslimat ve saha fotoğrafları
export const SAHADAN = [
  ['tarim-romorku-yesil-teslimat', 'Yeşil tarım römorku teslimatta. Kasada müşterinin adı yazılı.', 'tarim-romorku'],
  ['tarim-romorku-traktor', 'Mavi römork yük aracında, New Holland traktörün yanında.', 'tarim-romorku'],
  ['romork-ve-gubre-serpme', 'Mavi römork ve gübre serpme makinesi, müşterimizle birlikte.', 'gubre-serpme-makinesi'],
  ['on-yukleyici-kubota', 'Kubota traktöre takılmış kırmızı ön yükleyici.', 'on-yukleyici'],
  ['tarim-romorku-yuk-araci', 'Mavi tarım römorku teslimat için yük aracında.', 'tarim-romorku'],
  ['doner-ot-tirmigi-sevkiyat', 'Döner ot tırmığı araca yükleniyor.', 'doner-ot-tirmigi'],
  ['on-yukleyici-saha', 'Kırmızı ön yükleyici, traktöre takılı halde.', 'on-yukleyici'],
  ['on-yukleyici-ve-pulluk', 'Üçel ön yükleyici ve pulluk.', 'on-yukleyici'],
];
