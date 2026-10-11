# Kasap Sipariş Sistemi — Analiz, Uygulama ve Test Raporu (v2)

Tarih: 2026-10-11 · Dal: `claude/intelligent-newton-g54q27` · Önceki sürüm: PR #5 (sepet v1)

## 1. Ön analiz (değişiklik öncesi)

| Konu | Bulgu |
|---|---|
| Proje | `imfa-yap-` reposu, `goksun-yorem/` klasörü; statik HTML + Tailwind CDN + vanilla JS; GitHub Pages, derlemesiz. |
| Çalışan | Sepet v1 (ekle/artır/azalt/sil, localStorage, kuruş hesabı, form doğrulama, WhatsApp önizlemesi), randevu formu, SSS, KVKK. |
| Eksik | 10 kasap kategorisi yok; bir ürün yalnız tek kategoride; ürün bazında hazırlama tercihi ve notu yok; sipariş referansı/tarihi yok; stok bilgisi yok; numara geçersizken header/footer'da yine `wa.me` bağlantısı üretiliyordu; tüm görseller Unsplash stok görseli. |
| Veri | Fiyat yok, stok yok, numara yok (v1). |

## 2. Değiştirilen / eklenen dosyalar

| Dosya | Değişiklik |
|---|---|
| `js/ayarlar.js` | Kategoriler (11), ürünler çoklu kategori (`kategoriler: [...]`), `stok`, `aktif`, `secenekler` (hazırlama), gerçek fotoğraf alanları, `adet`/`paket` birimleri, sipariş referans öneki, **WhatsApp numarası 0539 300 95 65** |
| `js/sepet.js` | Kategori filtresi (Tümü + kategoriler, tekrarsız), ürün+tercih bazlı sepet satırları, ürün hazırlama notu, stok/fiyat teyit rozetleri, stokta olmayan ürünü engelleme, sepete ekleme geri bildirimi, sipariş referansı + tarih, mesajda `[Teyit gerekli: …]` işaretleri, fiyatı bilinmeyen ürün varken genel toplamı gizleme, "WhatsApp açıldı ama gönderilmedi" uyarısı |
| `index.html` | 4 adımlı sipariş şeridi, filtre çubuğu, bildirim alanı, önizlemede referans ve gönderim uyarısı, numara geçersizse WhatsApp bağlantısı üretmeme (header/footer/sabit buton/randevu formu), gerçek fotoğraflar (hero, Biz Kimiz, randevu arka planı, "Dükkânımızdan Kareler" galerisi), og:image ve şema görseli + telefon, SSS'ye 2 yeni soru (teslimat teyidi, ödeme) ve güncellenen 2 cevap |
| `img/*.webp` (yeni) | İşletmenin gönderdiği 5 fotoğraf; EXIF/konum verisi silindi, 600 ve 1200 px WebP (toplam ~1,1 MB, sayfada çoğu 600 px yüklenir) |

## 3. Kategori ve ürün eşleşmesi

| Kategori | Ürünler (tek kayıt, birden çok kategoride görünür) |
|---|---|
| Dana Eti | Dana Biftek/Antrikot, Dana Kuşbaşı, Dana Kıyma, Kemikli Dana Eti, Dana – İstediğiniz Kesim |
| Kuzu Eti | Kuzu Pirzola, Kuzu – İstediğiniz Kesim |
| Tavuk | Taze Tavuk (Bütün/But/Göğüs/Kanat), Soslu (Marine) Tavuk |
| Kıyma | Dana Kıyma (Normal / Az yağlı / Köftelik) |
| Kuşbaşı | Dana Kuşbaşı |
| Şişlik Et | Dana Kuşbaşı (tercih: Şişlik) |
| Kemikli Et | Kemikli Dana Eti, Kuzu Pirzola |
| Köfte ve Köftelik | Dana Kıyma (tercih: Köftelik) — hazır köfte doğrulanmadığı için eklenmedi |
| Soslu Ürünler | Soslu (Marine) Tavuk — vitrin fotoğrafıyla doğrulandı |
| Hazır Et Paketleri | Mangal Paketi, Ailelik Et Paketi **pasif** (`aktif: false`); kategori dürüst bir "içerik belirlenince" mesajı gösterir |
| Süt Ürünleri ve Kahvaltılık | Tulum peyniri, yayla tereyağı, yayla balı, yayla sütü (önceki sürümden korundu) |

Tüm ürünlerde `fiyat: null`, `stok: null` → kartta "Fiyat sipariş teyidinde bildirilir" ve "Stok ve fiyat teyitte". Hiçbir yerde 0 TL veya uydurma fiyat yok.

## 4. Test sonuçları (Playwright + Chromium — 52/52 geçti)

Fiyat, stok ve numara senaryoları test sırasında bellekte geçici değerlerle (649,90 TL/kg, 450 TL/kavanoz, 0,10 TL/kg; kuzu pirzola stokta yok; boş numara) çalıştırıldı; `ayarlar.js` değiştirilmedi.

| Senaryo | Sonuç |
|---|---|
| Kategori filtreleri, "Tümü"de tekrar yok, pasif ürün gizli, çoklu kategori, boş kategori mesajı | ✅ |
| Sepete ekleme, aynı ürün+tercihte miktar artışı, azaltma, minimumda çıkarma | ✅ |
| Aynı ürünün farklı tercihleri ayrı satır; yalnız seçilen satırın silinmesi | ✅ |
| Birden fazla ürün (5 satır) doğru listeleniyor | ✅ |
| Fiyatı bilinmeyen ürün varken genel toplam gösterilmiyor; bilinenlerin kuruş toplamı doğru (155.005 kuruş) | ✅ |
| Tümü fiyatlıyken tahmini toplam ~1.874,85 ₺ ("~" ve "tahmini" ile) | ✅ |
| Stokta olmayan ürün sepete eklenemiyor; depodan da temizleniyor | ✅ |
| Yenilemede satırlar, tercihler ve ürün notları korunuyor; bozuk depo verisi temizleniyor | ✅ |
| Boş sepetle sipariş engelleniyor | ✅ |
| Form: zorunlu alanlar, geçersiz telefon, adrese teslimatta mahalle+adres zorunlu, teslim almada adres gizli | ✅ |
| Mesaj: referans + tarih, müşteri, ürün/tercih/miktar/birim, hazırlama notu, teyit işaretleri, teslimat, adres, ödeme, not, teyit açıklaması | ✅ |
| Türkçe karakter, satır sonu, `&` ve tırnak: bağlantı içeriği önizlemeyle birebir | ✅ |
| Doğru numara (`wa.me/905393009565`); header/footer/telefon bağlantıları | ✅ |
| Numara tanımsızken: hiçbir WhatsApp bağlantısı üretilmiyor, gönder kapalı, uyarı görünüyor | ✅ |
| WhatsApp'a tıklayınca "mesajı göndermeden sipariş ulaşmaz" uyarısı | ✅ |
| 375 px ve 1440 px'te yatay taşma yok, konsol hatası yok, kırık iç bağlantı yok, yerel fotoğraflar yükleniyor | ✅ |
| Klavye ile ekleme ve odak; JS kapalıyken içerik okunur | ✅ |

Test edilemeyenler: canlı GitHub Pages (bu ortamdan github.io erişimi yok), gerçek WhatsApp uygulaması, gerçek telefonlar.

## 5. İşletmeden alınması gerekenler

1. **WhatsApp numarasının teyidi** — 0539 300 95 65 işletmenin paylaşım görselinden alındı; sipariş hattı olarak kullanılacağını ve aynı numaranın aranabildiğini onaylayın.
2. **Fiyatlar** (kg/paket başına) ve güncelleme sıklığı.
3. **Stok** — sürekli bulunan ürünler (`stok: true`), olmayanlar (`stok: false`).
4. **Ürün listesinin onayı** — özellikle tavuk parçaları, kemikli dana, kuzu çeşitleri; hazır köfte yapılıyor mu; mangal/ailelik paket içerikleri ve fiyatları.
5. **Hazırlama tercihleri** — listelenen seçenekler gerçekten sunuluyor mu.
6. **Satış adımı** — et 0,5 kg adımla mı satılıyor (şu an varsayım).
7. **Teslimat** — bölgeler (mahalle/köy listesi), ücret, minimum tutar, saatler.
8. **Ödeme yöntemleri** (nakit/kart/IBAN).
9. **Esnaflık geçmişi** — "yaklaşık 20 yıl" bilgisi doğrulanırsa Biz Kimiz'e eklenebilir; doğrulanmadığı için eklenmedi.
10. **Ürün fotoğrafları** — kuşbaşı, kıyma, tavuk, kuzu, süt ürünleri için. (Sohbette görüntü olarak gelen ek fotoğraflar dosya olarak ulaşmadı; tekrar gönderilmeli.)

## 6. WhatsApp sipariş hattı

`goksun-yorem/js/ayarlar.js` → `whatsappNumarasi: '905393009565'` (ülke kodu ile, yalnız rakam). Numara değişirse yalnızca bu satır ile `telefon` / `telefonGorunen` güncellenir; sitedeki tüm bağlantılar ve sipariş mesajı buradan okunur. Satır boş bırakılırsa site hiçbir WhatsApp bağlantısı üretmez ve müşteriye uyarı gösterir.

## 7. Yayından önce kalan eksikler

- Numaranın işletme tarafından teyidi (yukarıda 1).
- Fiyat ve stok verisi girilmeden müşteri tutar göremez; sipariş yine de çalışır (teyitle).
- Kıyma, kuşbaşı, tavuk, kuzu ve süt ürünleri için gerçek fotoğraf.
- KVKK metninin hukuki kontrolü.
- Canlıda telefondan bir deneme siparişi (mesajın işletmenin WhatsApp'ına düştüğünün kontrolü).

**Önemli:** Sipariş sunucuya kaydedilmez. Müşteri açılan WhatsApp mesajını **gönderdiğinde** işletmeye ulaşır ve işletmenin teyidiyle kesinleşir.
