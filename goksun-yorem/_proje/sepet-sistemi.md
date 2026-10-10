# Sepetli Yerel Sipariş Sistemi — Analiz, Uygulama ve Test Raporu

Tarih: 2026-10-10 · Dal: `claude/intelligent-newton-g54q27`

## 1. Analiz (uygulama öncesi)

| Konu | Bulgu |
|---|---|
| Doğru proje | `selahattinpeltek46-sudo/imfa-yap-` reposu, `goksun-yorem/` klasörü. Yayın: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/goksun-yorem/`. Brifte örnek verilen `babacan-mobilya` adresi **başka bir repo**; ona dokunulmadı. |
| Teknoloji | Statik HTML + Tailwind Play CDN + FontAwesome CDN + satır içi vanilla JS. Derleme yok. GitHub Pages, repo kökünü yayınlıyor (`.github/workflows/deploy-pages.yml`); `_proje` klasörleri yayından çıkarılıyor. |
| Göreli yollar | `kvkk/` ve `../` göreli; yeni dosyalar da göreli (`js/ayarlar.js`, `js/sepet.js`) → alt dizinde yayında sorun yok. |
| Ürünler | 4 sabit kart (dana antrikot/bonfile, kıyma & kuzu pirzola, tereyağı, peynir & bal) + etiket şeridi (tavuk, balık, süt, bal, kahvaltılık). |
| Fiyatlar | **Yok.** Sitede ve repoda hiçbir fiyat bilgisi bulunmuyor. |
| WhatsApp / telefon | **Yer tutucu** (`905XXXXXXXXX`). Gerçek numara yok. |
| Görseller | Unsplash stok görseller (temsili), yerel ürün fotoğrafı yok. |
| Sipariş akışı | Her kartta ürün adıyla dolu WhatsApp bağlantısı; randevu formu → alert + WhatsApp. Sepet yoktu. |
| Sorunlar | (a) JS kapalıyken `.reveal` öğeleri `opacity:0` kalıyordu → içerik görünmüyordu. (b) Ürün/iletişim bilgisi tek merkezde değildi. |

## 2. Yapılanlar

**Yeni dosyalar**
- `js/ayarlar.js` — Tek merkez: işletme adı, WhatsApp/telefon, teslimat ayarları (adrese teslimat / teslim alma, ücret, minimum tutar, saatler, mahalle-köy listesi), ödeme metinleri, satış birimleri, kategoriler, ürünler ve fiyatlar.
- `js/sepet.js` — Katalog çizimi, sepet, hesaplama, form doğrulama, sipariş mesajı ve WhatsApp aktarımı.

**Değişen dosya**
- `index.html` — "Öne Çıkan Ürünler" yerine kategorili **Ürünlerimiz** kataloğu (yapışkan kategori menüsü); yeni **Sepetim** bölümü (sepet + teslimat formu + sipariş özeti); header'a rozetli sepet butonu, menülere "Sepetim"; mobilde alt sepet çubuğu; iletişim bilgileri artık `js/ayarlar.js`'ten okunuyor; SSS'de sipariş ve fiyat cevapları yeni akışa göre güncellendi (görünür metin + FAQPage şeması); JS kapalıyken içerik görünür (`no-js`/`js` sınıfı).

**Korunanlar:** Hero, Biz Kimiz, Randevu formu, SSS, footer, KVKK sayfası, SEO etiketleri, şema, renkler ve tipografi.

## 3. Özellikler

- **Katalog:** 5 kategori (Dana Eti, Kuzu Eti, Peynir Çeşitleri, Göksun Doğal Yayla Balı, Kahvaltılık ve Yöresel Ürünler), 11 ürün. Kartta görsel (temsili), ad, açıklama, satış birimi, fiyat (yoksa "Fiyat sipariş teyidinde bildirilir"), Sepete ekle.
- **Birimler:** kg (0,5 kg adım/min — tartımlı), kavanoz (1 adet), litre (1). Adım ve minimum `js/ayarlar.js → birimler` içinden değiştirilir.
- **Sepet:** ekle / aynı ürün → miktar artar / artır-azalt / minimumda azalt = sepetten çıkar / sil / boş sepet mesajı / ürün sayısı rozeti / localStorage ile kalıcılık (bozuk veya negatif kayıtlar yüklenirken atılır) / sekmeler arası eşitleme. Üst sınır: ürün başına 100 birim.
- **Para hesabı:** Tamsayı kuruş ve tamsayı "mili birim" (1,5 kg = 1500) → kayan nokta hatası yok. Tartımlı ürünlerde "~" ile **tahmini** gösterim ve açıklama.
- **Fiyatsız ürünler:** Toplam "teyitte bildirilecek"; karışık sepette "fiyatı belirtilmeyen ürünler hariç" notu.
- **Form:** Ad soyad, telefon (TR biçimleri kabul: 0532…, +90 532…, 532…), teslimat tercihi, mahalle/köy (liste tanımlıysa seçim kutusu, değilse serbest metin), açık adres (yalnız adrese teslimatta zorunlu ve görünür), not. Hatalar alanın altında, `aria-invalid` ile.
- **WhatsApp:** Önce sayfada **sipariş özeti önizlemesi** (açılır pencere yok) → "WhatsApp'ta Gönder" (gerçek bağlantı, `encodeURIComponent`), "Mesajı Kopyala", "Bilgileri düzenle", "Mesajı gönderdim, sepeti temizle". Numara tanımlı değilse gönder butonu kapalı ve müşteriye uyarı gösterilir.
- **Ödeme metni:** Adrese teslimatta "Teslimatta ödeme", teslim almada "İşletmede ödeme" (ayarlardan değiştirilebilir). Online ödeme yok.
- **Güvenlik/gizlilik:** Kullanıcı metni DOM'a yalnızca `textContent` ile yazılır; kontrol karakterleri temizlenir, uzunluklar sınırlanır. Form verisi saklanmaz (yalnızca sepet ürün/miktarları localStorage'da). Ölçüm olayları kişisel veri içermez. Müşteri bilgileri sitenin URL'sine yazılmaz; yalnızca kullanıcının açtığı `wa.me` bağlantısının mesaj metninde yer alır (WhatsApp'ın çalışma şekli gereği).
- **Erişilebilirlik:** 44 px+ dokunma alanları, klavyeyle ekleme sonrası odak korunuyor, `aria-live` miktar ve sepet, etiketli alanlar.

## 4. Test sonuçları (Playwright + Chromium, 41/41 geçti)

Test ortamında CDN'ler kapalı olduğu için Tailwind aynı config ile yerelde derlenip enjekte edildi; FontAwesome npm paketinden sunuldu. Fiyat ve numara senaryoları için `js/ayarlar.js` test sırasında bellekte geçici değerlerle (649,90 TL/kg, 450 TL/kavanoz, 0,10 TL/kg; numara 905321234567) değiştirildi — **dosyadaki gerçek değerler değiştirilmedi**.

| # | Senaryo | Sonuç |
|---|---|---|
| 1 | Sepete ürün ekleme | ✅ |
| 2 | Aynı üründen tekrar ekleme (0,5 → 1,5 kg, kalem sayısı 1) | ✅ |
| 3 | Artırma / azaltma; minimumda azaltma ürünü çıkarır, 0/negatif yok | ✅ |
| 4 | Sepetten silme | ✅ |
| 5 | Toplam: 649,90×1 + 450×2 + 0,10×1 = 1.550,00 ₺ (tam kuruş); 1,5 kg × 649,90 = ~974,85 ₺; fiyatsız sepette "Teyitte bildirilecek" | ✅ |
| 6 | Yenileme sonrası sepet korunuyor; bozuk/negatif depo verisi temizleniyor | ✅ |
| 7 | Boş sepet mesajı, gönder butonu kapalı, zorla gönderim engelleniyor | ✅ |
| 8 | Eksik ad/telefon/teslimat; geçersiz telefon; eksik mahalle/adres; teslim almada adres gizli | ✅ |
| 9 | Mesajdaki Türkçe karakterler, satır sonları, miktar/birim, `&` ve tırnak kodlaması | ✅ |
| 10 | Doğru numaraya yönlendirme (`wa.me/905321234567?text=…`); numara yer tutucuyken gönderim kapalı | ✅ |
| 11 | 375 px ve 1440 px yatay taşma yok; mobil sepet çubuğu; ekran görüntüleriyle gözle kontrol | ✅ |
| 12 | GitHub Pages | ⚠️ Göreli yollar yerelde (file://) doğrulandı; **canlı yayın bu ortamdan test edilemedi** (github.io erişimi yok) |
| 13 | Konsol hatası yok (yalnızca test ortamının engellediği görsel/font istekleri hariç); kırık iç bağlantı yok | ✅ |
| + | Klavye ile ekleme ve odak; JS kapalıyken içerik okunur ve sepet gizli; KVKK sayfası açılıyor | ✅ |

Test edilemeyenler: gerçek WhatsApp uygulamasında mesajın açılışı (yalnız bağlantı içeriği doğrulandı), gerçek cihazlar, canlı GitHub Pages, Unsplash görsellerinin yüklenmesi.

## 5. İşletmeden beklenen bilgiler

1. **WhatsApp sipariş numarası** ve telefon → bunlar olmadan sipariş gönderilemez.
2. **Ürün fiyatları** (kg / kavanoz / litre başına) ve fiyatların ne sıklıkla değiştiği.
3. Satış birimleri ve adımlar: et/peynir/tereyağı kaçar gram adımla satılıyor (şu an 0,5 kg [VARSAYIM]); bal kavanozu kaç gram; süt litreyle mi satılıyor.
4. Teslimat: ücret, minimum sipariş tutarı, teslimat saatleri, hizmet verilen mahalle/köyler.
5. Ödeme yöntemleri (nakit / kart / havale) — şu an yalnızca "teslimatta / işletmede ödeme" yazıyor.
6. Ürün listesinin doğrulanması (ör. tavuk ve balık katalogda yok; brif kategorilerine uyuldu, sitede "notta belirtin" diye geçiyor).
7. Gerçek ürün fotoğrafları.

## 6. Ayarlar nereden değiştirilir? → `goksun-yorem/js/ayarlar.js`

| Ne | Alan |
|---|---|
| WhatsApp numarası | `ayarlar.whatsappNumarasi` (ör. `'905321234567'`) |
| Telefon | `ayarlar.telefon`, `ayarlar.telefonGorunen` |
| Teslimat ücreti / minimum / saatler | `ayarlar.teslimat.ucret`, `.minimumSiparis`, `.saatler` |
| Mahalle / köy listesi | `ayarlar.teslimat.bolgeler` (boş = serbest metin) |
| Teslimat seçeneklerini aç/kapa | `ayarlar.teslimat.adreseTeslimat`, `.teslimAlma` |
| Ödeme metinleri | `ayarlar.odeme` |
| Fiyat | ilgili ürünün `fiyat` alanı (TL; `null` = teyitte bildirilir) |
| Ürün ekle/çıkar | `urunler` listesi |
| Birim adımı / minimum | `birimler` (mili birim: 500 = 0,5 kg) |

## 7. Yayına alma

1. `js/ayarlar.js` içinde en az `whatsappNumarasi`, `telefon`, `telefonGorunen` doldurulur (fiyatlar varsa eklenir).
2. Değişiklikler commit'lenip `main`'e birleştirilir (PR ile).
3. GitHub Actions "Deploy to GitHub Pages" otomatik çalışır (~30 sn).
4. Canlı adreste telefonla kontrol: ürün ekle → sepet → form → "WhatsApp'ta Gönder" doğru sohbeti açıyor mu.

**Önemli:** Bu sürümde sipariş sunucuya kaydedilmez. Sipariş, müşteri açılan WhatsApp mesajını **gönderdiğinde** işletmeye ulaşır ve işletmenin teyidiyle kesinleşir.
