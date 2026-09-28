// Üçel Katalog 2.0 — Tanıtım kataloğu verisi
//
// KAYNAK KURALI
//   S = ucel-tarim-aletleri sitesi (metinler oradan, kısaltılarak)
//   F = fotoğrafta görünen
//   Ü = Üçel'in yazılı teyidi (teknik değerler yalnızca buradan girer)
// Sitede "Doğrulanmadı" etiketli bilgiler (römork 4 ton, tek/çift dingil) kullanılmaz.

const SITE = 'https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/';

export const FIRMA = {
  ad: 'Üçel Tarım Aletleri',
  resmiAd: 'Üçel Zirai Aletler',
  yetkili: 'Bahadır Kocabaş',
  adres1: 'Yeni Mah., Göksun Sanayi Sitesi',
  adres2: '46660 Göksun / Kahramanmaraş',
  telefon: '0532 480 30 51',
  whatsapp: '905324803051',
  saatler: 'Her gün 08:00 – 19:00',
  site: SITE,
  siteGorunen: 'selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri',
  harita: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Üçel Zirai Aletler, Yeni Mah., Göksun Sanayi Sitesi, Göksun/Kahramanmaraş'),
};

export const KATEGORILER = [
  { id: 'toprak', ad: 'Toprak İşleme' },
  { id: 'ekim', ad: 'Ekim' },
  { id: 'gubre', ad: 'Gübreleme' },
  { id: 'tasima', ad: 'Taşıma & Yükleme' },
  { id: 'diger', ad: 'Biçim & Diğer' },
  { id: 'destek', ad: 'Yedek Parça · İkinci El · Takas' },
];

// Katalogdaki sırayla (tarım takvimi: toprak → ekim → gübre → taşıma → biçim)
export const URUNLER = [
  {
    id: 'pulluk', kategori: 'toprak', ad: 'Pulluk', imalat: false, url: SITE + 'urunler/pulluk/',
    kisa: 'Tarlanın ekim öncesi derin işlenmesinde kullanılan temel ekipman. Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.',
    kullanim: ['Tarla toprağının derin işlenmesi', 'Ekim öncesi toprak hazırlığı', 'Anız bozma'],
    kimler: 'Tarlasını ekim öncesi derin işlemek isteyen, anız bozacak çiftçiler için.',
    secenekler: ['Farklı gövde sayısı seçenekleri için bizi arayın'],
    foto: [['kulakli-pulluk', 'Mavi kulaklı pulluk'], ['on-yukleyici-ve-pulluk', 'Üçel pulluk ve ön yükleyici']],
  },
  {
    id: 'kultivator', kategori: 'toprak', ad: 'Kültivatör / Tapan', imalat: true, url: SITE + 'urunler/kultivator/',
    kisa: 'Pullukla işlenmiş toprağın yüzeyini inceltip tohum yatağını hazırlayan ekipman. Göksun Sanayi Sitesi\'ndeki atölyemizde üretiyoruz.',
    kullanim: ['Toprak yüzey işleme', 'Tohum yatağı hazırlığı', 'Yabani ot mücadelesi'],
    kimler: 'Ekim öncesi toprak yüzeyini hazırlamak ve yabani otla mücadele etmek isteyen çiftçiler için.',
    secenekler: ['Farklı ayak sayısı ve ebat seçenekleri', 'Yaylı ayak sistemi', 'Kırmızı ve mavi renk'],
    foto: [['yayli-kultivator-kirmizi', 'Kırmızı Göksun yaylı kültivatör'], ['yayli-kultivator-mavi', 'Mavi Göksun yaylı kültivatör']],
  },
  {
    id: 'gubre-serpme', kategori: 'gubre', ad: 'Gübre Serpme Makinesi', imalat: false, url: SITE + 'urunler/gubre-serpme/',
    kisa: 'Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine.',
    kullanim: ['Kimyasal gübreleme', 'Organik gübreleme'],
    kimler: 'Düzenli gübreleme yapan çiftçiler için.',
    secenekler: ['Farklı kapasite seçenekleri için bizi arayın'],
    foto: [['romork-ve-gubre-serpme', 'Gübre serpme makinesi, teslimat için römork üzerinde']],
  },
  {
    id: 'romork', kategori: 'tasima', ad: 'Tarım Römorku', imalat: true, url: SITE + 'urunler/romork/',
    kisa: 'Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar Göksun\'daki atölyemizde üretiyoruz.',
    kullanim: ['Tarla ürünü taşıma', 'Gübre ve yem taşıma', 'Odun ve malzeme nakliyesi', 'Hayvancılıkta kullanım'],
    kimler: 'Ürün taşıyan, hayvancılık yapan, gübre ve yem nakli olan ya da genel taşıma ihtiyacı olan çiftçiler için.',
    secenekler: ['Kasa rengi size özel', 'Kasaya isim, firma adı ya da "Maşallah" yazısı', 'Standart dışı ölçüde özel imalat', 'Damperli / dampersiz seçenekler için bizi arayın'],
    foto: [['tarim-romorku-mavi', 'Mavi Üçel tarım römorku'], ['tarim-romorku-yesil-teslimat', 'Yeşil römork teslimatta, sahibiyle'], ['tarim-romorku-traktor', 'Mavi römork yük aracında, traktörün yanında'], ['tarim-romorku-yesil', 'Yeşil römork, kasada müşteri adı']],
  },
  {
    id: 'su-tankeri', kategori: 'tasima', ad: 'Su Tankeri', imalat: false, url: SITE + 'urunler/su-tankeri/',
    kisa: 'Tarla sulaması ve genel su taşımacılığı için traktörle çekilen tanker.',
    kullanim: ['Tarla sulama', 'Hayvan suyu taşıma', 'Genel su taşımacılığı'],
    kimler: 'Sulama ihtiyacı olan ya da düzenli su taşıyan çiftçiler için.',
    secenekler: ['Farklı kapasite seçenekleri için bizi arayın'],
    foto: [['su-tankeri', 'Su tankerleri']],
  },
  {
    id: 'on-yukleyici', kategori: 'tasima', ad: 'Ön Yükleyici (Loader)', imalat: true, url: SITE + 'urunler/on-yukleyici/',
    kisa: 'Traktörünüzün önüne monte edilen, yem, gübre ve malzeme gibi yükleri kaldırıp taşımanızı sağlayan sistem. Kendi atölyemizde imal ediyoruz.',
    kullanim: ['Yükleme-boşaltma işleri', 'Ahır ve çiftlik işleri', 'Malzeme taşıma'],
    kimler: 'Ahır ve çiftlik işleri yapan, düzenli yükleme-boşaltma ihtiyacı olan çiftçiler için.',
    secenekler: ['Traktörünüzün modeline göre montaj uygunluğu birlikte değerlendirilir', 'Kırmızı ve mavi renk örnekleri'],
    foto: [['on-yukleyici-atolye', 'Üçel atölyesi önünde ön yükleyici'], ['on-yukleyici-kubota', 'Kubota traktöre takılı ön yükleyici'], ['on-yukleyici-kaldirma', 'Ön yükleyici kepçeyi kaldırırken'], ['on-yukleyici-mavi', 'Mavi ön yükleyici']],
  },
];

// Fotoğrafı henüz olmayan ürünler (tek sayfada)
export const DIGER = [
  { ad: 'Mibzer', kategori: 'Ekim', kisa: 'Tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makinesi.', url: SITE + 'urunler/mibzer/' },
  { ad: 'Çayır Biçme Makinesi', kategori: 'Biçim', kisa: 'Kaba yem üretimi için çayır, yonca ve otlak biçiminde kullanılır.', url: SITE + 'urunler/cayir-bicme/' },
  { ad: 'Yedek Parça', kategori: 'Destek', kisa: 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz. İhtiyacınızı iletin, uygunluğuna bakalım.', url: SITE + 'urunler/yedek-parca/' },
  { ad: 'Diğer Tarım Aletleri', kategori: 'Diğer', kisa: 'Listede görmediğiniz bir ekipman mı arıyorsunuz? Sorun, birlikte bakalım.', url: SITE + 'urunler/diger/' },
];

// "Ne yapmak istiyorsunuz?" (sitedeki "İşiniz Ne?" bölümü)
export const ISLER = [
  ['Toprağı hazırlıyorum', 'Pulluk · Kültivatör / Tapan', ['pulluk', 'kultivator']],
  ['Ekime hazırlanıyorum', 'Mibzer', ['_diger']],
  ['Gübreleme yapacağım', 'Gübre Serpme Makinesi', ['gubre-serpme']],
  ['Taşıma yapacağım', 'Tarım Römorku', ['romork']],
  ['Su taşıyacağım', 'Su Tankeri', ['su-tankeri']],
  ['Yükleme yapacağım', 'Ön Yükleyici', ['on-yukleyici']],
  ['Yedek parça arıyorum', 'Yedek Parça', ['_diger']],
  ['İkinci el bakıyorum / takas', 'İkinci El & Takas', ['_ikinciel']],
];

export const NEDEN = [
  ['Kendi İmalatımız', 'Römork, kültivatör ve ön yükleyiciyi Göksun Sanayi Sitesi\'ndeki atölyemizde kendimiz üretiyoruz.'],
  ['Sahadan Gelen Tecrübe', 'Tarım makinelerinin yalnızca satışını değil, sahada nasıl kullanıldığını da biliyoruz.'],
  ['İhtiyaca Göre Çözüm', 'Kendi imal ettiğimiz ekipmanlarda standart ölçülerin dışında, ihtiyacınıza göre özel imalat yapabiliyoruz.'],
  ['Satış Sonrası Destek', 'Tesliminden sonra da yanınızdayız. Kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyoruz.'],
];

export const IMALAT = [
  ['Tasarım', 'Ekipmanın kullanım amacına ve traktör uyumuna göre ölçüleri belirliyoruz.'],
  ['Kesim', 'Sac ve profili işin gerektirdiği ölçüye göre atölyemizde kesiyoruz.'],
  ['Kaynak', 'İskelet ve gövde birleşimini kendi kaynakçılığımızla kuruyoruz.'],
  ['Montaj', 'Parçaları birleştirip hareketli aksamı monte ediyoruz.'],
  ['Boya', 'Hava koşullarına dayanıklı olması için boya işlemini özenle uyguluyoruz.'],
  ['Son kontrol', 'Teslimat öncesi kaynak, hareketli aksam ve işçiliği son kez kontrol ediyoruz.'],
  ['Teslimat', 'Atölyemizden teslim ediyor, isterseniz nakliyesini de birlikte konuşuyoruz.'],
];

export const SAHADAN = [
  ['tarim-romorku-yesil-teslimat', 'Yeşil tarım römorku teslimatta. Kasada müşterinin adı yazılı.'],
  ['tarim-romorku-traktor', 'Mavi römork yük aracında, New Holland traktörün yanında.'],
  ['romork-ve-gubre-serpme', 'Römork ve gübre serpme makinesi, müşterimizle birlikte.'],
  ['on-yukleyici-kubota', 'Kubota traktöre takılmış ön yükleyici.'],
  ['tarim-romorku-yuk-araci', 'Mavi tarım römorku teslimat için yük aracında.'],
  ['doner-ot-tirmigi-sevkiyat', 'Atölyemizin önünde teslimat için yükleme.'],
];

// Sitedeki sık sorulan sorular (kısaltılmış)
export const SSS = [
  ['Üçel Tarım Aletleri nerede?', 'Yeni Mah., Göksun Sanayi Sitesi, 46660 Göksun / Kahramanmaraş.'],
  ['Göksun dışına satış yapıyor musunuz?', 'Evet, Türkiye geneline gönderim yapıyoruz. Şehrinizi belirtin, nakliye seçeneklerini birlikte konuşalım.'],
  ['Ürünler güvenli şekilde ulaşıyor mu?', 'Nakliyeyi genellikle anlaşmalı kargo/nakliye firmalarıyla sağlıyoruz; size uygun seçeneği birlikte belirleriz.'],
  ['Fiyatlar ne kadar?', 'Fiyat; ebat, kapasite ve modele göre değişir. Güncel fiyat ve stok için arayın ya da WhatsApp\'tan yazın.'],
  ['Traktörüme uygun ekipmanı nasıl seçerim?', 'Traktörünüzün modelini, beygir gücünü ve yapacağınız işi anlatın; uygun ekipmana birlikte bakalım.'],
  ['Özel ölçüde üretim yapıyor musunuz?', 'Evet. Kendi atölyemizde imal ettiğimiz römork, kültivatör gibi ekipmanlarda ihtiyacınıza göre özel imalat yapabiliyoruz.'],
  ['İkinci el tarım aleti alıyor musunuz?', 'Evet, ikinci el alıp satıyoruz. Elinizdeki ekipmanın fotoğrafını WhatsApp\'tan gönderin.'],
  ['Takas yapıyor musunuz?', 'Evet. Kullanmadığınız aletinizi yeni ya da ikinci el bir ekipmanla takas edebiliriz.'],
  ['Yedek parça var mı?', 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.'],
  ['Bakım ve onarım yapıyor musunuz?', 'Genel bir bakım/onarım servisimiz yok. Kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyor, elimizden geldiğince yönlendiriyoruz.'],
  ['Ürünlerde garanti var mı?', 'Resmî bir garanti belgesi sunmuyoruz; imal ettiğimiz ve sattığımız her ürünün arkasında duruyoruz. Bir sorun olursa bizi arayın.'],
  ['İkinci el ürünlerin durumu nasıl?', 'Resmî garanti yok; her ekipmanı kontrol ediyor, gerçek durumunu dürüstçe paylaşıyoruz.'],
];
