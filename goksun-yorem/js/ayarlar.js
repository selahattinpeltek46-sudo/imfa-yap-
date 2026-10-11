/*
 * GÖKSUN YÖREM — SİTE AYARLARI VE ÜRÜN KATALOĞU
 * ------------------------------------------------
 * İşletme bilgileri, teslimat şartları, ürünler, fiyatlar ve stok durumu YALNIZCA bu dosyadan yönetilir.
 * Sitenin geri kalanı (ürün listesi, sepet, WhatsApp mesajı, iletişim bağlantıları) buradan okur.
 *
 * Kurallar:
 *  - Bilinmeyen bilgi için null bırakın; site bunu "işletme teyit edecek" diye gösterir.
 *  - fiyat: TL (ör. 650 veya 649.90). null = fiyat sipariş teyidinde bildirilir. Asla 0 yazmayın.
 *  - stok: true = var, false = şu an yok (sepete eklenemez), null = sipariş teyidinde bildirilir.
 *  - aktif: false olan ürün sitede görünmez (işletme sunmaya başlayınca true yapın).
 *  - Bir ürün birden fazla kategoride görünebilir: kategoriler: ['dana', 'kiyma'].
 */
window.GOKSUN = {
  ayarlar: {
    isletmeAdi: 'Göksun Yörem Et ve Süt Ürünleri',
    siparisReferansOnEki: 'GY',

    // WhatsApp sipariş hattı: ülke kodu ile, yalnızca rakam (ör. '905321234567').
    // Geçersiz/boş bırakılırsa WhatsApp bağlantıları oluşturulmaz ve sitede uyarı gösterilir.
    // Kaynak: işletmenin paylaşımındaki "0539 300 95 65 WhatsApp DM" bilgisi.
    whatsappNumarasi: '905393009565',
    telefon: '+905393009565',            // tel: bağlantısı için
    telefonGorunen: '0 (539) 300 95 65', // sitede görünen biçim

    teslimat: {
      adreseTeslimat: true,     // Yerel adrese teslimat sunuluyor mu?
      teslimAlma: true,         // Dükkândan teslim alma sunuluyor mu?
      ucret: null,              // TL. null = işletme bildirecek, 0 = ücretsiz
      minimumSiparis: null,     // TL. null = minimum tutar yok / bilinmiyor
      saatler: null,            // ör. 'Her gün 10:00–19:00'. null = gösterilmez
      // Hizmet verilen mahalle/köyler. Boş liste = müşteri serbestçe yazar.
      bolgeler: []
    },

    // Ödeme sipariş teyidinden sonra yapılır; online ödeme yoktur.
    odeme: {
      adreseTeslimat: 'Teslimatta ödeme',
      teslimAlma: 'Dükkânda ödeme'
    }
  },

  // Satış birimleri. Miktarlar tamsayı "mili birim" ile tutulur (1 kg = 1000, 1 adet = 1000).
  // adim/min: 500 = 0,5 kg. Tartımlı birimlerde kesin tutar tartım sonrası belirlenir.
  birimler: {
    kg:      { ad: 'kg',      fiyatEki: '/kg',      adim: 500,  min: 500,  tartimli: true },
    adet:    { ad: 'adet',    fiyatEki: '/adet',    adim: 1000, min: 1000, tartimli: false },
    paket:   { ad: 'paket',   fiyatEki: '/paket',   adim: 1000, min: 1000, tartimli: false },
    kavanoz: { ad: 'kavanoz', fiyatEki: '/kavanoz', adim: 1000, min: 1000, tartimli: false },
    litre:   { ad: 'litre',   fiyatEki: '/litre',   adim: 1000, min: 1000, tartimli: false }
  },

  // Kategori sırası menüdeki sıradır. bosMesaj: kategoride aktif ürün yokken gösterilir.
  kategoriler: [
    { id: 'dana',     ad: 'Dana Eti',           ikon: 'fa-cow' },
    { id: 'kuzu',     ad: 'Kuzu Eti',           ikon: 'fa-utensils' },
    { id: 'tavuk',    ad: 'Tavuk',              ikon: 'fa-drumstick-bite' },
    { id: 'kiyma',    ad: 'Kıyma',              ikon: 'fa-bowl-food' },
    { id: 'kusbasi',  ad: 'Kuşbaşı',            ikon: 'fa-cubes' },
    { id: 'sislik',   ad: 'Şişlik Et',          ikon: 'fa-fire' },
    { id: 'kemikli',  ad: 'Kemikli Et',         ikon: 'fa-bone' },
    { id: 'kofte',    ad: 'Köfte ve Köftelik',  ikon: 'fa-burger' },
    { id: 'soslu',    ad: 'Soslu Ürünler',      ikon: 'fa-pepper-hot' },
    { id: 'paket',    ad: 'Hazır Et Paketleri', ikon: 'fa-box',
      bosMesaj: 'Hazır paket içerikleri işletme tarafından belirlendiğinde burada yer alacak. Şimdilik ürünleri tek tek sepete ekleyebilir, paket isteğinizi sipariş notuna yazabilirsiniz.' },
    { id: 'sut',      ad: 'Süt Ürünleri ve Kahvaltılık', ikon: 'fa-cheese' }
  ],

  /*
   * Ürünler
   *  gorsel: dükkândan çekilmiş fotoğraf yolu (null = ikon gösterilir; stok/temsili fotoğraf kullanılmaz)
   *  gorselAciklama: fotoğrafın gerçekte neyi gösterdiği (alt metin)
   *  secenekler: hazırlama tercihleri (müşteri seçer, işletme teyit eder). Boş = seçim yok.
   */
  urunler: [
    { id: 'dana-biftek', ad: 'Dana Biftek / Antrikot', kategoriler: ['dana'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: 'img/dana-dilim-600.webp', gorselAciklama: 'Tezgahımızda dilimlenmiş dana biftekleri',
      aciklama: 'Izgara ve tava için.', secenekler: ['İnce dilim', 'Kalın dilim', 'Bütün parça'] },

    { id: 'dana-kusbasi', ad: 'Dana Kuşbaşı', kategoriler: ['dana', 'kusbasi', 'sislik'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: null, gorselAciklama: null,
      aciklama: 'Sote, kavurma ve şiş için.', secenekler: ['Küçük kuşbaşı', 'Sotelik', 'Şişlik (iri)'] },

    { id: 'dana-kiyma', ad: 'Dana Kıyma', kategoriler: ['dana', 'kiyma', 'kofte'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: null, gorselAciklama: null,
      aciklama: 'İstediğiniz yağ oranında hazırlanır.', secenekler: ['Normal', 'Az yağlı', 'Köftelik'] },

    { id: 'dana-kemikli', ad: 'Kemikli Dana Eti', kategoriler: ['dana', 'kemikli'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: 'img/vitrin-600.webp', gorselAciklama: 'Vitrinimizdeki dana etleri',
      aciklama: 'Haşlama ve yemeklik.', secenekler: [] },

    { id: 'dana-ozel', ad: 'Dana Eti – İstediğiniz Kesim', kategoriler: ['dana'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: 'img/dana-kesim-600.webp', gorselAciklama: 'Kesim tezgahımızda dana eti',
      aciklama: 'Kesim şeklini hazırlama notuna yazın.', secenekler: [] },

    { id: 'kuzu-pirzola', ad: 'Kuzu Pirzola', kategoriler: ['kuzu', 'kemikli'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: null, gorselAciklama: null,
      aciklama: 'Mangal ve ızgara için.', secenekler: [] },

    { id: 'kuzu-ozel', ad: 'Kuzu Eti – İstediğiniz Kesim', kategoriler: ['kuzu'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: null, gorselAciklama: null,
      aciklama: 'Kesim ve porsiyon isteğinizi hazırlama notuna yazın.', secenekler: [] },

    { id: 'tavuk', ad: 'Taze Tavuk', kategoriler: ['tavuk'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: null, gorselAciklama: null,
      aciklama: 'Parça tercihinizi seçin.', secenekler: ['Bütün', 'But', 'Göğüs', 'Kanat'] },

    { id: 'marine-tavuk', ad: 'Soslu (Marine) Tavuk', kategoriler: ['tavuk', 'soslu'], birim: 'kg',
      fiyat: null, stok: null, aktif: true,
      gorsel: 'img/marine-tavuk-600.webp', gorselAciklama: 'Vitrinimizde soslu marine tavuk',
      aciklama: 'Mangala ve fırına hazır.', secenekler: ['Kanat', 'Karışık parça'] },

    // Örnek: işletme sunmaya başlayınca aktif: true yapın, içeriği ve fiyatı yazın.
    { id: 'mangal-paketi', ad: 'Mangal Paketi', kategoriler: ['paket'], birim: 'paket',
      fiyat: null, stok: null, aktif: false,
      gorsel: null, gorselAciklama: null,
      aciklama: 'İçerik: işletme tarafından belirlenecek.', secenekler: [] },
    { id: 'ailelik-paket', ad: 'Ailelik Et Paketi', kategoriler: ['paket'], birim: 'paket',
      fiyat: null, stok: null, aktif: false,
      gorsel: null, gorselAciklama: null,
      aciklama: 'İçerik: işletme tarafından belirlenecek.', secenekler: [] },

    { id: 'tulum-peyniri', ad: 'Tulum Peyniri', kategoriler: ['sut'], birim: 'kg',
      fiyat: null, stok: null, aktif: true, gorsel: null, gorselAciklama: null,
      aciklama: 'Geleneksel yöresel peynir.', secenekler: [] },
    { id: 'yayla-tereyagi', ad: 'Göksun Yayla Tereyağı', kategoriler: ['sut'], birim: 'kg',
      fiyat: null, stok: null, aktif: true, gorsel: null, gorselAciklama: null,
      aciklama: 'Yayla sütünden, katkı maddesi eklenmeden.', secenekler: [] },
    { id: 'yayla-bali', ad: 'Göksun Doğal Yayla Balı (Süzme)', kategoriler: ['sut'], birim: 'kavanoz',
      fiyat: null, stok: null, aktif: true, gorsel: null, gorselAciklama: null,
      aciklama: 'Kavanoz gramajı sipariş teyidinde bildirilir.', secenekler: [] },
    { id: 'yayla-sutu', ad: 'Katıksız Yayla Sütü', kategoriler: ['sut'], birim: 'litre',
      fiyat: null, stok: null, aktif: true, gorsel: null, gorselAciklama: null,
      aciklama: 'Günlük ihtiyacınız kadar.', secenekler: [] }
  ]
};
