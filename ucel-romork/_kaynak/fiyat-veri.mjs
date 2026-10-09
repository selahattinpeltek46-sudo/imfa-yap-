// Üçel fiyat listesi — web katalog, fiyat görseli ve otomatik mesajlar buradan okur.
//
// KURAL: Buraya yalnızca Üçel'in yazılı olarak verdiği fiyat girilir. Tahmin yok.
// Boş bırakılan ürünlerde fiyat yerine "Fiyat ve uygun model için yazın" görünür.
//
// guncelleme: fiyatların geçerli olduğu tarih, ör. '9 Ekim 2026' — boşsa hiçbir fiyat gösterilmez
// not       : bütün fiyatlar için tek satırlık not, ör. 'KDV dahil, Göksun teslim'
// urunler   : { urunId: [[model / açıklama, fiyat metni], …] }   ör. romork: [['4 tonluk damperli', '000.000 TL']]

export const FIYAT = {
  guncelleme: null,
  not: null,
  urunler: {
    romork: [],
    kultivator: [],
    'on-yukleyici': [],
    pulluk: [],
    'gubre-serpme': [],
    'su-tankeri': [],
  },
};

export const fiyatVar = (id) => Boolean(FIYAT.guncelleme) && (FIYAT.urunler[id] || []).length > 0;
