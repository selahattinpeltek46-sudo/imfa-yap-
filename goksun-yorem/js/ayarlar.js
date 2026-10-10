/*
 * GÖKSUN YÖREM — SİTE AYARLARI VE ÜRÜN KATALOĞU
 * ------------------------------------------------
 * İşletme bilgileri, teslimat şartları, ürünler ve fiyatlar YALNIZCA bu dosyadan yönetilir.
 * Sitenin geri kalanı (ürün listesi, sepet, WhatsApp mesajı, iletişim bağlantıları) buradan okur.
 *
 * Kurallar:
 *  - Bilinmeyen bilgi için null bırakın; site bunu "işletme tarafından bildirilecek" diye gösterir.
 *  - Fiyatlar TL cinsindendir (ör. 650 veya 649.90). null = fiyat sipariş teyidinde bildirilir.
 *  - Ürün eklemek için URUNLER listesine yeni bir satır ekleyin; "id" benzersiz olmalı.
 */
window.GOKSUN = {
  ayarlar: {
    isletmeAdi: 'Göksun Yörem Et ve Süt Ürünleri',

    // WhatsApp sipariş hattı: ülke kodu ile, boşluksuz (ör. '905321234567').
    // 'X' içerdiği sürece sipariş gönderimi kapalıdır ve sitede uyarı gösterilir.
    whatsappNumarasi: '905XXXXXXXXX',
    telefon: '+905XXXXXXXXX',            // tel: bağlantısı için (ör. '+905321234567')
    telefonGorunen: '0 (5XX) XXX XX XX', // sitede görünen biçim (ör. '0 (532) 123 45 67')

    teslimat: {
      adreseTeslimat: true,     // Yerel adrese teslimat sunuluyor mu?
      teslimAlma: true,         // İşletmeden teslim alma sunuluyor mu?
      ucret: null,              // TL. null = işletme bildirecek, 0 = ücretsiz
      minimumSiparis: null,     // TL. null = minimum tutar yok / bilinmiyor
      saatler: null,            // ör. 'Her gün 10:00–19:00'. null = gösterilmez
      // Hizmet verilen mahalle/köyler. Boş liste = müşteri serbestçe yazar.
      // ör. ['Merkez', 'Yeşilköy', ...]
      bolgeler: []
    },

    // Ödeme sipariş teyidinden sonra yapılır; online ödeme yoktur.
    odeme: {
      adreseTeslimat: 'Teslimatta ödeme',
      teslimAlma: 'İşletmede ödeme'
    }
  },

  // Satış birimleri. Miktarlar tamsayı "mili birim" ile tutulur (1 kg = 1000, 1 adet = 1000).
  birimler: {
    kg:      { ad: 'kg',      fiyatEki: '/kg',      adim: 500,  min: 500,  tartimli: true },
    kavanoz: { ad: 'kavanoz', fiyatEki: '/kavanoz', adim: 1000, min: 1000, tartimli: false },
    litre:   { ad: 'litre',   fiyatEki: '/litre',   adim: 1000, min: 1000, tartimli: false }
  },

  kategoriler: [
    { id: 'dana',       ad: 'Dana Eti',                       ikon: 'fa-cow',
      gorsel: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=400&q=70' },
    { id: 'kuzu',       ad: 'Kuzu Eti',                       ikon: 'fa-drumstick-bite',
      gorsel: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?auto=format&fit=crop&w=400&q=70' },
    { id: 'peynir',     ad: 'Peynir Çeşitleri',               ikon: 'fa-cheese',
      gorsel: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=70' },
    { id: 'bal',        ad: 'Göksun Doğal Yayla Balı',        ikon: 'fa-jar',
      gorsel: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=70' },
    { id: 'kahvaltilik', ad: 'Kahvaltılık ve Yöresel Ürünler', ikon: 'fa-mug-hot',
      gorsel: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=70' }
  ],

  // gorsel: null ise kategori görseli kullanılır. fiyat: null = teyitte bildirilir.
  urunler: [
    { id: 'dana-antrikot', kategori: 'dana', ad: 'Dana Antrikot', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Izgara ve tava için isteğinize göre kalınlıkta kesilir.' },
    { id: 'dana-bonfile', kategori: 'dana', ad: 'Dana Bonfile', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Porsiyon veya bütün olarak hazırlanır.' },
    { id: 'dana-kiyma', kategori: 'dana', ad: 'Dana Kıyma', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'İstediğiniz yağ oranını sipariş notuna yazın.' },
    { id: 'dana-ozel', kategori: 'dana', ad: 'Dana Eti – İstediğiniz Kesim', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Kuşbaşı, haşlamalık vb. kesim isteğinizi sipariş notuna yazın.' },

    { id: 'kuzu-pirzola', kategori: 'kuzu', ad: 'Kuzu Pirzola', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Mangal ve ızgara için.' },
    { id: 'kuzu-ozel', kategori: 'kuzu', ad: 'Kuzu Eti – İstediğiniz Kesim', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Kesim ve porsiyon isteğinizi sipariş notuna yazın.' },

    { id: 'tulum-peyniri', kategori: 'peynir', ad: 'Tulum Peyniri', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Geleneksel yöresel peynir.' },
    { id: 'yoresel-peynir', kategori: 'peynir', ad: 'Yöresel Peynir Çeşitleri', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Güncel çeşitleri sipariş teyidinde öğrenebilirsiniz.' },

    { id: 'yayla-bali', kategori: 'bal', ad: 'Göksun Doğal Yayla Balı (Süzme)', birim: 'kavanoz', fiyat: null, gorsel: null,
      aciklama: 'Kavanoz gramajı sipariş teyidinde bildirilir.' },

    { id: 'yayla-tereyagi', kategori: 'kahvaltilik', ad: 'Göksun Yayla Tereyağı', birim: 'kg', fiyat: null, gorsel: null,
      aciklama: 'Yayla sütünden, katkı maddesi eklenmeden.' },
    { id: 'yayla-sutu', kategori: 'kahvaltilik', ad: 'Katıksız Yayla Sütü', birim: 'litre', fiyat: null, gorsel: null,
      aciklama: 'Günlük ihtiyacınız kadar.' }
  ]
};
