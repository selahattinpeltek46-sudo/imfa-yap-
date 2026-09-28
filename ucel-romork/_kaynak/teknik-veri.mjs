// Üçel Katalog 2.0 — Ürün teknik veri şablonları
//
// KURAL: Buraya yalnızca Üçel'in yazılı olarak teyit ettiği değer girilir.
// null = [TEKNİK VERİ BEKLENİYOR]. Fotoğraftan tahmin edilen ya da sitede
// "Doğrulanmadı" etiketli bilgi (ör. römork 4 ton, tek/çift dingil) değer olarak girilmez.
//
// Birden fazla model varsa: deger yerine { 'Model A': '…', 'Model B': '…' } yazılabilir;
// katalog tabloyu otomatik olarak model sütunlarına böler.
//
// teknik  : [alan, birim, deger]
// uyum    : [kriter, deger]           → "Uyum kriterleri"
// opsiyon : [ad, aciklama|null]       → açıklama null ise ayrıntı bekleniyor
// saha    : [foto, açıklama] | null   → "Sahadaki kullanım"
// cekim   : ürüne özel çekilmesi gereken kareler (standart 6 karenin üstüne)

export const BEKLENIYOR = '[TEKNİK VERİ BEKLENİYOR]';

export const STANDART_CEKIM = [
  'Genel görünüm — ön 3/4 açı, ürünün tamamı, sade arka plan',
  'Genel görünüm — arka 3/4 açı',
  'Yakın detay — kaynak dikişleri, birleşim noktaları',
  'Traktöre bağlı görünüm — mümkünse farklı marka traktörle',
  'Sahada çalışırken — tarlada / ahırda / yolda',
  'Teslimat — müşteriyle, yazılı izinle',
];

export const TEKNIK = {
  pulluk: {
    teknik: [
      ['Model', '', null],
      ['Tip', 'kulaklı / diskli / çizel', null],
      ['Gövde sayısı', 'adet', null],
      ['Gövde başına iş genişliği', 'cm', null],
      ['Toplam çalışma genişliği', 'cm', null],
      ['Çalışma derinliği', 'cm', null],
      ['Ağırlık', 'kg', null],
      ['Gereken traktör gücü', 'HP', null],
      ['Bağlantı tipi', '3 nokta, kategori', null],
      ['Emniyet sistemi', 'yaylı / kesme pimli', null],
      ['Ölçüler (U × G × Y)', 'mm', null],
    ],
    uyum: [['Traktör gücü', null], ['Askı kategorisi', null], ['Toprak yapısı', null], ['Arazi eğimi', null]],
    opsiyon: [['Farklı gövde sayısı seçenekleri', null], ['Ön kesici / diskli bıçak', null], ['Derinlik tekerleği', null]],
    saha: null,
    cekim: ['Gövde ve kulak yakın çekim', 'Emniyet sistemi detayı', 'Tarlada sürüm sırasında (toprak devrilirken)'],
  },
  kultivator: {
    teknik: [
      ['Model', '', null],
      ['Ayak sayısı', 'adet', null],
      ['Ayak tipi', 'yaylı / sabit', null],
      ['Sıra sayısı', 'sıra', null],
      ['Çalışma genişliği', 'cm', null],
      ['Çalışma derinliği', 'cm', null],
      ['Ağırlık', 'kg', null],
      ['Gereken traktör gücü', 'HP', null],
      ['Bağlantı tipi', '3 nokta, kategori', null],
      ['Uç demiri tipi', 'kazayağı / sivri', null],
      ['Ölçüler (U × G × Y)', 'mm', null],
    ],
    uyum: [['Traktör gücü', null], ['Askı kategorisi', null], ['Toprak yapısı (taşlı / ağır)', null], ['Tarla büyüklüğü', null]],
    opsiyon: [['Farklı ayak sayısı ve ebat seçenekleri', 'Sitede belirtilmiş; seçenekler bekleniyor'], ['Kırmızı ve mavi renk', 'Fotoğraflarda görülüyor'], ['Merdane / tırmık eklentisi', null]],
    saha: null,
    cekim: ['Yay ve ayak yakın çekim', 'Uç demiri detayı', 'Tarlada çalışırken', 'Atölyede kaynak/montaj aşaması'],
  },
  'gubre-serpme': {
    teknik: [
      ['Model', '', null],
      ['Gübre kapasitesi', 'lt / kg', null],
      ['Serpme genişliği', 'm', null],
      ['Tahrik', 'kuyruk mili (PTO)', null],
      ['PTO devri', 'dev/dk', null],
      ['Disk sayısı', 'adet', null],
      ['Ağırlık (boş)', 'kg', null],
      ['Gereken traktör gücü', 'HP', null],
      ['Bağlantı tipi', '3 nokta, kategori', null],
      ['Debi ayarı', '', null],
    ],
    uyum: [['Traktör gücü', null], ['PTO (kuyruk mili) uyumu', null], ['Gübre türü (granül / toz / organik)', null], ['Arazi büyüklüğü', null]],
    opsiyon: [['Farklı kapasite seçenekleri', 'Sitede belirtilmiş; seçenekler bekleniyor'], ['Depo yükseltme (ilave)', null], ['Kenar serpme', null]],
    saha: ['romork-ve-gubre-serpme', 'Gübre serpme makinesi müşteriye teslim edilirken.'],
    cekim: ['Tek başına genel görünüm (römork üstünde değil)', 'Disk ve dağıtıcı detayı', 'Debi ayar kolu', 'Tarlada serpme yaparken'],
  },
  romork: {
    teknik: [
      ['Model', '', null],
      ['Taşıma kapasitesi', 'ton', null],
      ['Kasa iç ölçüsü (U × G × Y)', 'mm', null],
      ['Kasa sacı kalınlığı (taban / yan)', 'mm', null],
      ['Dış ölçüler (U × G × Y)', 'mm', null],
      ['Boş ağırlık', 'kg', null],
      ['Dingil sayısı', 'tek / çift', null],
      ['Dingil kapasitesi', 'ton', null],
      ['Lastik ebadı', '', null],
      ['Damper', 'yok / arkaya / üç yöne', null],
      ['Hidrolik (damper silindiri)', '', null],
      ['Fren', '', null],
      ['Bağlantı tipi (çeki oku)', '', null],
      ['Aydınlatma', '', null],
      ['Gereken traktör gücü', 'HP', null],
    ],
    uyum: [['Traktör gücü', null], ['Traktör hidroliği (damper için)', null], ['Çeki bağlantısı', null], ['Yol / arazi eğimi', null]],
    opsiyon: [['Kasa rengi', 'Müşteri isteğine göre (fotoğraflarda mavi, yeşil)'], ['Kasa yazısı', 'İsim, firma adı ya da "Maşallah"'], ['Özel ölçü imalat', 'Standart dışı ölçüde üretim (sitede belirtilmiş)'], ['Damperli / dampersiz', null], ['Kasa ilavesi (yükseltme)', null], ['Branda / kasa üstü kafes', null]],
    saha: ['tarim-romorku-yesil-teslimat', 'Yeşil tarım römorku teslimatta; kasada müşterinin adı yazılı.'],
    cekim: ['Şasi ve dingil alttan', 'Çeki oku ve bağlantı', 'Kasa kapak mandalları', 'Damper silindiri (varsa)', 'Kasa içi, üstten', 'Yüklü halde yolda / tarlada'],
  },
  'su-tankeri': {
    teknik: [
      ['Model', '', null],
      ['Su kapasitesi', 'lt', null],
      ['Tank malzemesi', 'galvaniz / sac / paslanmaz', null],
      ['Sac kalınlığı', 'mm', null],
      ['Dalgakıran', 'var / yok, adet', null],
      ['Tank ölçüleri', 'mm', null],
      ['Boş ağırlık', 'kg', null],
      ['Dingil sayısı', 'tek / çift', null],
      ['Lastik ebadı', '', null],
      ['Pompa', 'yok / PTO / motopomp', null],
      ['Vana / çıkış çapı', 'inç', null],
      ['Dolum ağzı çapı', 'mm', null],
      ['Bağlantı tipi (çeki oku)', '', null],
      ['Gereken traktör gücü', 'HP', null],
    ],
    uyum: [['Traktör gücü (dolu tank)', null], ['Çeki bağlantısı', null], ['Yol / arazi eğimi', null], ['Pompa için PTO', null]],
    opsiyon: [['Farklı kapasite seçenekleri', 'Sitede belirtilmiş; seçenekler bekleniyor'], ['Pompa', null], ['Hortum ve makara', null], ['Hayvan suluğu çıkışı', null]],
    saha: null,
    cekim: ['Dolum ağzı', 'Vana ve çıkışlar', 'Şasi ve dingil', 'Traktöre bağlı, dolu halde', 'Merada / ahırda kullanımda'],
  },
  'on-yukleyici': {
    teknik: [
      ['Model', '', null],
      ['Uygun traktör gücü', 'HP', null],
      ['Kaldırma kapasitesi', 'kg', null],
      ['Maksimum kaldırma yüksekliği', 'mm', null],
      ['Boşaltma yüksekliği', 'mm', null],
      ['Kova genişliği', 'cm', null],
      ['Kova hacmi', 'm³', null],
      ['Ağırlık (kova dahil)', 'kg', null],
      ['Hidrolik', 'traktör hidroliği / ayrı pompa', null],
      ['Silindir sayısı ve çapı', '', null],
      ['Kumanda', 'joystick / valf kolu', null],
      ['Montaj tipi', 'sabit / hızlı sökme', null],
    ],
    uyum: [['Traktör markası ve modeli', null], ['Traktör gücü', null], ['Traktör hidrolik debisi', null], ['Ön aks yük sınırı', null]],
    opsiyon: [['Kırmızı ve mavi renk', 'Fotoğraflarda görülüyor'], ['Balya kıskacı', null], ['Palet çatalı', null], ['Kar küreği', null], ['Farklı kova ölçüleri', null]],
    saha: ['on-yukleyici-kaldirma', 'Ön yükleyici kepçeyi kaldırırken.'],
    cekim: ['Traktöre bağlantı braketi', 'Hidrolik silindir ve hortumlar', 'Kumanda kolu (kabin içi)', 'Kova yakın çekim', 'Yüklü kova ile çalışırken (gübre, toprak, yem)'],
  },
};

export const DIGER_TEKNIK = {
  Mibzer: ['Model', 'Sıra sayısı', 'Sıra aralığı (cm)', 'Tohum deposu (lt)', 'Gübre deposu (lt)', 'Çalışma genişliği (cm)', 'Ağırlık (kg)', 'Gereken traktör gücü (HP)', 'Bağlantı tipi', 'Uygun tohumlar'],
  'Çayır Biçme Makinesi': ['Model', 'Tip (tamburlu / diskli / parmaklı)', 'Çalışma genişliği (cm)', 'PTO devri (dev/dk)', 'Ağırlık (kg)', 'Gereken traktör gücü (HP)', 'Bağlantı tipi'],
};
