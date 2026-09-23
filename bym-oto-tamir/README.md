# BYM Oto Tamir — Web Sitesi

Göksun'daki BYM Oto Tamir için premium, mobil öncelikli, randevu odaklı statik web sitesi.
Framework yok: HTML + CSS + ES modülleri. Tüm sayfalar `_build/build.py` ile üretilir.

## Yayına almadan önce doğrulanacaklar

`_build/site.json` içinde `DOGRULANACAK` işaretli alanlar örnektir:

- [ ] Telefon ve WhatsApp numarası
- [ ] Açık adres + gerçek koordinat (Google İşletme Profili ile **birebir aynı** yazılmalı)
- [ ] Çalışma saatleri ve randevu saatleri
- [ ] Alan adı (`site_url`) — canonical, sitemap ve schema bunu kullanır
- [ ] Hizmet verilen markalar
- [ ] Instagram / Facebook adresleri
- [ ] Gerçek Google yorumları (yalnızca gerçek yorumlar; liste boşsa Google'a yönlendiren kart görünür)
- [ ] KVKK metninin hukuki kontrolü
- [ ] Hepsi tamamlanınca `"onizleme": false` (üstteki uyarı bandı kalkar)

## Klasör yapısı

```
bym-oto-tamir/
├── _build/                  # Kaynaklar (yayına çıkmaz)
│   ├── site.json            # Firma bilgileri, medya, markalar, yorumlar, randevu ayarları
│   ├── icerik.py            # Hizmetler, sorunlar, süreç, blog yazıları
│   ├── build.py             # Sayfa üreticisi
│   ├── medya.py             # Fotoğraf işleme (plaka bulanıklaştırma, WebP)
│   └── kaynak-fotograflar/  # Orijinal fotoğraflar
├── assets/
│   ├── css/site.css         # Tasarım sistemi
│   ├── media/               # Web için hazırlanmış görseller / hero videosu
│   └── js/
│       ├── main.js          # Giriş noktası
│       ├── ui.js            # Header, menü, animasyonlar, galeri, harita
│       ├── whatsapp.js      # WhatsApp mesaj şablonları
│       ├── config.js        # (üretilir) site.json'dan
│       ├── admin.js         # Yönetim paneli önizlemesi
│       └── booking/
│           ├── catalog.js       # Marka → model, hizmet listesi
│           ├── appointment.js   # Veri modeli, doğrulama (telefon, plaka)
│           ├── repository.js    # Depolama: LocalRepository | HttpRepository
│           ├── availability.js  # Kapalı gün, tatil, geçmiş/dolu saat kuralları
│           └── wizard.js        # 7 adımlı randevu sihirbazı
├── index.html, hizmetler/, randevu/, markalar/, blog/, hakkimizda/, iletisim/, kvkk/, yonetim/  (üretilir)
└── sitemap.xml, robots.txt, 404.html  (üretilir)
```

## Güncelleme

```bash
pip install pillow            # yalnızca medya.py için
python3 _build/medya.py       # yeni fotoğraf eklendiyse
python3 _build/build.py       # tüm sayfaları yeniden üret
python3 -m http.server 8000   # önizleme: http://localhost:8000
```

Üretilen HTML dosyaları elle düzenlenmez; değişiklikler `_build/` altındaki kaynaklarda yapılır.

### Fotoğraf / video değiştirme

- **Fotoğraf:** Dosyayı `_build/kaynak-fotograflar/` klasörüne koyun, `medya.py` içindeki `MEDYA` listesine ekleyin
  (plaka varsa `bulanik` alanına koordinat girin), sonra `site.json → medya.garaj` listesine ekleyin.
- **Hero videosu:** MP4 dosyasını (öneri: 1920px genişlik, 8–15 sn, sessiz, < 4 MB) `assets/media/` içine koyun ve
  `site.json → medya.hero.video` alanına dosya adını yazın. Video yoksa `poster` görseli hafif zoom efektiyle kullanılır.

## Randevu sistemi

Sihirbaz adımları: Marka → Model → Hizmet → Tarih → Saat → Bilgiler → Özet → Onay.
URL ile ön doldurma: `/randevu/?marka=BMW&hizmet=klima&not=Klima%20soğutmuyor`

**Modlar** (`site.json → randevu.mod`):

- `demo` (şu an): Randevu tarayıcıda (localStorage) saklanır; müşteri onay ekranında randevuyu WhatsApp ile işletmeye gönderir.
- `api`: Randevu `api_url` adresindeki backend'e gönderilir.

### Veri modeli

```json
{
  "id": "BYM-7K2MQA",
  "name": "Ali Yılmaz",
  "phone": "+905321234567",
  "plate": "46ABC123",
  "brand": "Volkswagen",
  "model": "Passat",
  "service": "periyodik-bakim",
  "date": "2026-09-25",
  "time": "09:00",
  "note": "",
  "status": "pending",
  "createdAt": "2026-09-23T08:00:00.000Z"
}
```

`status`: `pending` | `confirmed` | `completed` | `cancelled`

### API sözleşmesi (backend bağlandığında)

| Yöntem | Yol | Açıklama |
|---|---|---|
| `GET` | `/availability?date=YYYY-MM-DD` | `{ "booked": ["10:00", "14:00"] }` |
| `POST` | `/appointments` | Randevu oluşturur. Saat doluysa **409** döner. |
| `GET` | `/appointments?from=&to=&status=` | Randevu listesi (yönetim) |
| `PATCH` | `/appointments/:id` | `{ "status": "confirmed" }` |

Önerilen altyapı: Supabase / Firebase (ücretsiz katman yeterli) veya küçük bir Node/PHP servisi.
Yeni randevuda işletmeye WhatsApp Business API / SMS / e-posta bildirimi backend tarafında gönderilmelidir.

### Yönetim paneli

`/yonetim/` (arama motorlarına kapalı) randevu listesini ve durum değiştirmeyi gösteren bir önizlemedir.
Gerçek panelde kimlik doğrulama zorunludur. Aynı repository arayüzü üzerine şu modüller eklenecek:
Randevular · Müşteriler · Araçlar (bakım geçmişi) · Hizmetler · Çalışma saatleri / müsait saatler · Blog · Galeri · Yorumlar.

## SEO

- Her sayfada tekil `title`, `description`, `canonical`, Open Graph
- Schema.org: `AutoRepair` (LocalBusiness), `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`
- Tek `h1`, düzenli `h2/h3` hiyerarşisi, görsellerde `alt`, `sitemap.xml`, `robots.txt`
- NAP (ad, adres, telefon) tek kaynaktan (`site.json`) tüm sayfalara basılır; Google İşletme Profili ile aynı olmalıdır.
