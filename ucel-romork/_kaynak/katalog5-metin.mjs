// Üçel 2026 Satış Kataloğu — Aşama 3 metinleri (yatay + telefon aynı metni kullanır)
//
// Her metin etiketli:
//   S('…')  site / mevcut kaynaktan (ucel-tarim-aletleri sitesi, katalog2-veri.mjs) — anlamı değiştirilmeden
//   Y('…')  yeni yazım — yalnızca sitedeki bilgiyi sade dile çevirir, yeni bilgi / iddia EKLEMEZ
// Teknik değerler burada yok: teknik-veri.mjs'ten gelir; boşsa "uygun model seçimi" kutusu gösterilir.
// Plan: KATALOG-PLAN.md

export const S = (t) => ({ t, k: 'site' });
export const Y = (t) => ({ t, k: 'yeni' });

export const SLOGAN = S('Tarlada da, yolda da sağlam iş.');
export const ALT_SLOGAN = S('Göksun\'da üretiyoruz. Türkiye\'ye ulaştırıyoruz.');

// Veri gelene kadar teknik tablonun yerine geçen kutu
export const SECIM_KUTUSU = {
  baslik: Y('Size uygun modeli birlikte seçelim'),
  giris: Y('Bize üç şey yazın:'),
  maddeler: [Y('Traktörünüz (marka / model)'), Y('Beygir gücü (HP)'), Y('Yapacağınız iş')],
  sonuc: Y('Ölçü, kapasite ve fiyat bilgisini size özel iletelim.'),
};

export const SAYFALAR = {
  kapak: {
    ust: Y('Ürün Kataloğu 2026'),
    baslik: SLOGAN,
    alt: ALT_SLOGAN,
    rozet: Y('Kendi imalatımız · Göksun'),
    telefonButon: Y('Ürünleri görün'),
  },

  marka: {
    etiket: Y('Hakkımızda'),
    baslik: S('Baba oğul, aynı emek.'),
    alt: Y('Göksun Sanayi Sitesi\'ndeki atölyemizden'),
    hikaye: S('Yıllardır Göksun\'da tarımla uğraşan insanların neye ihtiyacı olduğunu görerek bu işi büyüttük. Bahadır Kocabaş bu mesleği babasının yanında öğrendi; bugün de aynı özenle babasıyla omuz omuza üretmeye devam ediyor.'),
    alinti: S('Bizim için önemli olan sadece bir makine satmak değil; müşterimizin aldığı ekipmanı işinde gönül rahatlığıyla kullanabilmesi.'),
    isler: [
      [Y('İmalat'), S('Römork, kültivatör ve loader kepçeyi kendi atölyemizde imal ediyoruz.')],
      [Y('Satış'), S('Pulluk, mibzer, gübre serpme makinesi, su tankeri ve yedek parça.')],
      [Y('İkinci el ve takas'), S('İkinci el tarım aleti alıp satıyor, takas yapıyoruz.')],
    ],
    ziyaret: S('Atölyemize gelip ürünlerimizi yerinde inceleyebilirsiniz.'),
    qr: [Y('Konumu açın'), Y('Yol tarifi')],
  },

  neden: {
    etiket: Y('Neden Üçel?'),
    baslik: Y('Bizi farklı kılan beş şey'),
    maddeler: [
      { ikon: 'imalat', baslik: S('Kendi imalatımız'), metin: S('Römork, kültivatör ve loader kepçeyi Göksun Sanayi Sitesi\'ndeki atölyemizde kendimiz üretiyoruz.'), kanit: Y('Ürünlerimizin üzerinde ÜÇEL · GÖKSUN yazar.') },
      { ikon: 'cozum', baslik: S('İhtiyaca göre üretim'), metin: S('Kendi imal ettiğimiz ekipmanlarda standart ölçülerin dışında, ihtiyacınıza göre özel imalat yapabiliyoruz.'), kanit: Y('Römork kasasının rengini ve yazısını siz seçersiniz.') },
      { ikon: 'saha', baslik: S('Sahadan gelen tecrübe'), metin: S('Tarım makinelerinin yalnızca satışını değil, sahada nasıl kullanıldığını da biliyoruz.') },
      { ikon: 'destek', baslik: Y('Yedek parça ve destek'), metin: S('Tesliminden sonra da yanınızdayız. Kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyoruz.') },
      { ikon: 'kamyon', baslik: Y('Türkiye\'ye gönderim'), metin: S('Göksun ve çevresine yerinde, Türkiye geneline de gönderimle hizmet veriyoruz.'), kanit: Y('Nakliye seçeneğini şehrinize göre birlikte belirliyoruz.') },
    ],
  },

  // Üretim fotoğrafları gelirse eklenir (KATALOG-PLAN.md · sayfa 04)
  uretim: {
    etiket: Y('Nasıl üretiyoruz'),
    baslik: Y('Atölyemizden tarlanıza'),
    adimlar: [
      [S('Kesim ve kaynak'), S('Sac ve profili ölçüsüne göre atölyemizde kesiyor, iskeleti kendi kaynakçılığımızla kuruyoruz.')],
      [S('Montaj'), S('Parçaları birleştirip hareketli aksamı monte ediyoruz.')],
      [S('Boya'), S('Boya işlemini özenle uyguluyoruz.')],
      [S('Son kontrol ve teslimat'), S('Teslimat öncesi kaynak, hareketli aksam ve işçiliği son kez kontrol ediyoruz.')],
    ],
  },

  urunler: {
    etiket: Y('Ürünlerimiz'),
    baslik: Y('Aradığınızı kategoriye göre bulun'),
    alt: Y('Bir ürüne dokunun, sayfası açılsın.'),
    kategoriler: [
      [Y('Toprak işleme'), ['pulluk', 'kultivator']],
      [Y('Gübreleme'), ['gubre-serpme']],
      [Y('Taşıma'), ['romork', 'su-tankeri']],
      [Y('Yükleme'), ['on-yukleyici']],
      [Y('Diğer'), ['_diger', '_takas']],
    ],
  },

  secim: {
    etiket: Y('Ekipman seçimi'),
    baslik: Y('Ne yapmak istiyorsunuz?'),
    alt: Y('İşinizi bulun, size uygun ekipmanı görün.'),
    isler: [
      [S('Toprağı hazırlıyorum'), ['pulluk', 'kultivator']],
      [S('Gübreleme yapacağım'), ['gubre-serpme']],
      [S('Taşıma yapacağım'), ['romork']],
      [S('Su taşıyacağım'), ['su-tankeri']],
      [S('Yükleme yapacağım'), ['on-yukleyici']],
      [S('Ekime hazırlanıyorum'), ['_diger']],
      [S('İkinci el bakıyorum / takas'), ['_takas']],
    ],
    hpNot: Y('Traktörünüzün gücüne göre model önerisi için bize yazın.'),
    cta: Y('Traktörünüzü yazın, size uygun ekipmanları birlikte listeleyelim.'),
    wa: 'Merhaba, traktörüme uygun ekipmanlar hakkında bilgi almak istiyorum.\nTraktör / HP:\nYapacağım iş:',
  },

  diger: {
    etiket: Y('Diğer ürünler'),
    baslik: Y('Bunlar da var'),
    urunler: [
      [S('Mibzer'), S('Tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makinesi.')],
      [S('Çayır Biçme Makinesi'), S('Kaba yem üretimi için çayır, yonca ve otlak biçiminde kullanılır.')],
      [S('Yedek Parça'), S('Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz. İhtiyacınızı iletin, uygunluğuna bakalım.')],
      [S('Diğer Tarım Aletleri'), S('Listede görmediğiniz bir ekipman mı arıyorsunuz? Sorun, birlikte bakalım.')],
    ],
    cta: Y('Aradığınız ekipmanı bulamadınız mı? Bize yazın.'),
    wa: 'Merhaba, bir ekipman arıyorum.\nAradığım ekipman:\nTraktörüm:',
  },

  takas: {
    etiket: Y('İkinci el · Takas'),
    baslik: Y('Eski makinenizi değerlendirelim'),
    alt: S('Kullanmadığınız aletinizi yeni ya da ikinci el bir ekipmanla takas edebiliriz.'),
    adimlar: [Y('Fotoğrafını çekin'), Y('WhatsApp\'tan durumuyla birlikte gönderin'), Y('Ekipmanı birlikte değerlendirelim'), Y('Takas ya da satış seçeneğini konuşalım')],
    ikinciEl: S('İkinci el tarım aleti de alıp satıyoruz. Aradığınız ekipmanı sorun.'),
    durust: S('Resmî garanti yok; her ekipmanı kontrol ediyor, gerçek durumunu dürüstçe paylaşıyoruz.'),
    cta: Y('Eski makinenizin fotoğrafını gönderin.'),
    wa: 'Merhaba, takas / ikinci el için ekipmanımı göstermek istiyorum.\nEkipman:\nDurumu:',
  },

  sahadan: {
    etiket: Y('Sahadan'),
    baslik: Y('Sahadan kareler'),
    alt: Y('Atölyemizden ve teslimatlarımızdan gerçek fotoğraflar.'),
    qr: [Y('Google yorumları'), Y('ve konum')],
  },

  sss: {
    etiket: Y('Sık sorulanlar'),
    baslik: Y('Merak ettikleriniz'),
    sorular: [
      [S('Göksun dışına satış yapıyor musunuz?'), S('Evet, Türkiye geneline gönderim yapıyoruz. Şehrinizi belirtin, nakliye seçeneklerini birlikte konuşalım.')],
      [Y('Nakliye nasıl oluyor?'), S('Nakliyeyi genellikle anlaşmalı kargo / nakliye firmalarıyla sağlıyoruz; size uygun seçeneği birlikte belirleriz.')],
      [S('Fiyatlar ne kadar?'), S('Fiyat; ebat, kapasite ve modele göre değişir. Güncel fiyat ve stok için arayın ya da WhatsApp\'tan yazın.')],
      [S('Traktörüme uygun ekipmanı nasıl seçerim?'), S('Traktörünüzün modelini, beygir gücünü ve yapacağınız işi anlatın; uygun ekipmana birlikte bakalım.')],
      [S('Özel ölçüde üretim yapıyor musunuz?'), S('Evet. Kendi atölyemizde imal ettiğimiz römork, kültivatör gibi ekipmanlarda ihtiyacınıza göre özel imalat yapabiliyoruz.')],
      [S('Yedek parça var mı?'), S('Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.')],
      [S('Bakım ve onarım yapıyor musunuz?'), S('Genel bir bakım / onarım servisimiz yok. Kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyor, elimizden geldiğince yönlendiriyoruz.')],
      [S('Ürünlerde garanti var mı?'), S('Resmî bir garanti belgesi sunmuyoruz; imal ettiğimiz ve sattığımız her ürünün arkasında duruyoruz. Bir sorun olursa bizi arayın.')],
    ],
    cta: Y('Sorunuz burada yoksa bize yazın.'),
    wa: 'Merhaba, bir sorum var:',
  },

  iletisim: {
    baslik: Y('İhtiyacınız olan ekipmanı birlikte bulalım.'),
    alt: Y('Traktörünüzü söyleyin, yapacağınız işi anlatın; size uygun seçeneği birlikte değerlendirelim.'),
    hizli: S('En hızlı yol WhatsApp\'tan yazmak ya da telefonla aramak.'),
    ziyaret: S('Göksun Sanayi Sitesi\'ndeki atölyemize gelip ürünlerimizi yerinde inceleyebilirsiniz.'),
    qr: [[Y('WhatsApp'), Y('Hemen yazın')], [Y('Web sitesi'), Y('Tüm ürünler')], [Y('Konum'), Y('Yol tarifi')]],
    wa: 'Merhaba, Üçel kataloğunu inceledim, bilgi almak istiyorum.',
  },
};

// Ürün sayfaları. Kendi imalatı 3 ürün iki sayfa (tanıtım + seçenek/teknik), satış ürünleri tek sayfa.
export const URUN_METIN = {
  romork: {
    kategori: Y('Taşıma'), sayfa: 2,
    fayda: Y('Ürününüzü, yeminizi, odununuzu tek römorkla taşıyın.'),
    tanim: S('Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar Göksun\'daki atölyemizde üretiyoruz.'),
    kullanim: [S('Tarla ürünü'), S('Gübre ve yem'), S('Odun ve malzeme'), S('Hayvancılık')],
    kimler: S('Ürün taşıyan, hayvancılık yapan, gübre ve yem nakli olan ya da genel taşıma ihtiyacı olan çiftçiler için.'),
    neden: [S('Kaynağından boyasına kadar atölyemizde üretiyoruz.'), S('Kasa rengini ve yazısını isteğinize göre yapıyoruz.'), S('Standart dışı ölçüde özel imalat yapabiliyoruz.')],
    secenekler: [S('Kasa rengi size özel'), S('Kasaya isim, firma adı ya da "Maşallah" yazısı'), S('Standart dışı ölçüde özel imalat')],
    secenekBekleyen: ['Damperli / dampersiz', 'Kapasite seçenekleri (4 tonluk model teyidi)'],
    sayfa2Baslik: Y('Seçenekler ve teknik bilgi'),
    cta: Y('Ne taşıyacağınızı yazın, uygun römorku birlikte belirleyelim.'),
    wa: 'Merhaba, tarım römorku hakkında bilgi almak istiyorum.\nTaşıyacağım yük:\nTraktörüm:',
  },
  kultivator: {
    kategori: Y('Toprak işleme'), sayfa: 2,
    fayda: Y('Pulluktan sonra toprağı inceltir, tohum yatağını hazırlar.'),
    tanim: S('Pullukla işlenmiş toprağın yüzeyini inceltip tohum yatağını hazırlayan ekipman. Göksun Sanayi Sitesi\'ndeki atölyemizde üretiyoruz.'),
    kullanim: [S('Toprak yüzey işleme'), S('Tohum yatağı hazırlığı'), S('Yabani ot mücadelesi')],
    kimler: S('Ekim öncesi toprak yüzeyini hazırlamak ve yabani otla mücadele etmek isteyen çiftçiler için.'),
    neden: [S('Göksun\'daki atölyemizde üretiyoruz.'), S('Yaylı ayak sistemi'), S('Farklı ayak sayısı ve ebat seçenekleri')],
    secenekler: [S('Farklı ayak sayısı ve ebat seçenekleri'), S('Kırmızı ve mavi renk')],
    secenekBekleyen: ['Ayak sayısı seçenekleri', 'Merdane / tırmık eklentisi'],
    detayFoto: Y('Mavi Göksun yaylı kültivatör'),
    sayfa2Baslik: Y('Seçenekler ve teknik bilgi'),
    cta: Y('Traktörünüzün gücünü yazın, uygun modeli birlikte seçelim.'),
    wa: 'Merhaba, kültivatör hakkında bilgi almak istiyorum.\nTraktör / HP:\nTarla büyüklüğü:',
  },
  'on-yukleyici': {
    kategori: Y('Yükleme'), sayfa: 2,
    fayda: Y('Yem, gübre ve malzemeyi traktörünüzle kaldırın, taşıyın.'),
    tanim: S('Traktörünüze monte edilen, yem, gübre ve malzeme gibi yükleri kaldırıp taşımanızı sağlayan sistem. Kendi atölyemizde imal ediyoruz.'),
    kullanim: [S('Yükleme-boşaltma'), S('Ahır ve çiftlik işleri'), S('Malzeme taşıma')],
    kimler: S('Ahır ve çiftlik işleri yapan, düzenli yükleme-boşaltma ihtiyacı olan çiftçiler için.'),
    neden: [S('Kendi atölyemizde imal ediyoruz.'), S('Montaj uygunluğunu traktör modelinize göre birlikte değerlendiriyoruz.'), S('Kırmızı ve mavi renk örnekleri')],
    secenekler: [S('Kırmızı ve mavi renk')],
    secenekBekleyen: ['Uyumlu traktörler', 'Ataşmanlar', 'Kova ölçüleri'],
    sayfa2Baslik: Y('Teknik bilgi ve montaj'),
    cta: Y('Traktörünüzün marka ve modelini yazın, montaja uygunluğuna bakalım.'),
    wa: 'Merhaba, loader kepçe hakkında bilgi almak istiyorum.\nTraktör marka / model:\nHP:',
  },
  pulluk: {
    kategori: Y('Toprak işleme'), sayfa: 1,
    fayda: Y('Ekim öncesi tarlanızı derin işleyin.'),
    tanim: S('Tarlanın ekim öncesi derin işlenmesinde kullanılan temel ekipman. Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.'),
    kullanim: [S('Derin toprak işleme'), S('Ekim öncesi hazırlık'), S('Anız bozma')],
    kimler: S('Tarlasını ekim öncesi derin işlemek isteyen, anız bozacak çiftçiler için.'),
    neden: [Y('Traktörünüzün gücüne uygun pulluğu birlikte seçiyoruz.'), S('Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.')],
    secenekBekleyen: ['Gövde sayısı seçenekleri', 'Marka / üretici'],
    cta: Y('Toprağınızı ve traktörünüzü anlatın, uygun pulluğu birlikte seçelim.'),
    wa: 'Merhaba, pulluk hakkında bilgi almak istiyorum.\nTraktör / HP:\nToprak yapısı:',
  },
  'gubre-serpme': {
    kategori: Y('Gübreleme'), sayfa: 1,
    fayda: Y('Gübreyi tarlanıza dengeli dağıtın.'),
    tanim: S('Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine.'),
    kullanim: [S('Kimyasal gübreleme'), S('Organik gübreleme')],
    kimler: S('Düzenli gübreleme yapan çiftçiler için.'),
    neden: [S('Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.')],
    secenekBekleyen: ['Kapasite seçenekleri'],
    cta: Y('Traktörünüzü ve gübre türünü yazın, uygun makineyi birlikte seçelim.'),
    wa: 'Merhaba, gübre serpme makinesi hakkında bilgi almak istiyorum.\nTraktör / HP:\nGübre türü (kimyasal / organik):',
  },
  'su-tankeri': {
    kategori: Y('Taşıma'), sayfa: 1,
    fayda: Y('Tarlaya da, hayvana da suyu traktörünüzle taşıyın.'),
    tanim: S('Tarla sulaması ve genel su taşımacılığı için traktörle çekilen tanker.'),
    kullanim: [S('Tarla sulama'), S('Hayvan suyu'), S('Su taşımacılığı')],
    kimler: S('Sulama ihtiyacı olan ya da düzenli su taşıyan çiftçiler için.'),
    neden: [S('Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.')],
    secenekBekleyen: ['Kapasite seçenekleri', 'Pompa'],
    cta: Y('Suyu ne için taşıyacağınızı yazın, uygun tankeri birlikte seçelim.'),
    wa: 'Merhaba, su tankeri hakkında bilgi almak istiyorum.\nKullanım (sulama / hayvan suyu):\nTraktörüm:',
  },
};

// Telefon sürümüne özel kısa metinler
export const TELEFON = {
  butonWa: Y('WhatsApp\'tan yaz'),
  butonAra: Y('Ara'),
  devam: Y('Teknik bilgi ve seçenekler sonraki ekranda'),
};
