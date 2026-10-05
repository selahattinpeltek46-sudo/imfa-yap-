# Üçel 2026 Satış Kataloğu — Aşama 5 · Son Kontrol (QA)

Kontrol edilen: `Ucel-Urun-Katalogu-2026.pdf` (yatay, 19 sayfa) ve `Ucel-Urun-Katalogu-2026-Telefon.pdf` (31 ekran).
Otomatik denetimler `katalog5.mjs` içinde her üretimde çalışır (taşma, başlık, görsel, yazı boyutu).

| Alan | Kontrol | Sonuç |
|---|---|---|
| **İçerik** | Her metin `katalog5-metin.mjs`'ten; siteden (S) ya da yeni yazım (Y) etiketli; Aşama 3'te onaylandı | ✅ |
| **Teknik** | PDF'teki bütün rakamlar tarandı: yalnızca telefon, posta kodu, saat, yıl, sayfa no ve adım numaraları. Uydurma teknik değer **yok** | ✅ |
| **Teknik** | "Bilgi için arayın" sayısı: 30 → 0 (yerine "Size uygun modeli birlikte seçelim" kutusu) | ✅ |
| **Tasarım** | Fontlar yalnızca Oswald + Inter; taşan sayfa yok; başlıklar koyu alanda | ✅ |
| **Yazım** | Çift boşluk / noktalama öncesi boşluk yok; tırnaklar Türkçe (“ ”); bütün metin baştan sona okundu | ✅ |
| **Marka** | Ürün adı her yerde "Loader Kepçe" ("ön yükleyici" 0); renk 5, font 2 | ✅ |
| **Satış** | Yatay: 16 QR'ın 16'sı okundu (ZXing). Her ürün QR'ı kendi hazır mesajını açıyor | ✅ |
| **Satış** | Telefon: 31 WhatsApp + 32 arama bağlantısı; her ürün ekranı kendi mesajıyla | ✅ |
| **UX** | Yatay 32, telefon 16 iç bağlantı (içindekiler, ürün kartları, iş seçimi) | ✅ |
| **Mobil** | En küçük yazı: yatay 9 pt, telefon 10 pt; telefon kapağında numara | ✅ |
| **Güven** | Riskli ifade taraması (en iyi, üstün, lider, kalite, dayanıklı, garantili, sertifika…): 0 | ✅ |
| **Güven** | Garanti dürüstçe: "Resmî garanti belgesi sunmuyoruz" (SSS, takas) | ✅ |
| **Site** | İndirme bandı: "Telefonda Aç" + "Kataloğu İndir (PDF)"; ana sayfa ve Ürünler'de; eski bağlantı korunuyor | ✅ |

## Açık kalanlar (tasarımla çözülemez — Üçel'den)

1. Teknik veri (model, kapasite, ölçü, HP) — **en büyük açık**; form hazır
2. Pulluk ve gübre serpme için yeni ürün fotoğrafı
3. Atölye / üretim fotoğrafları (gelirse "Nasıl üretiyoruz" sayfası eklenir)
4. Fotoğraflarda görünen müşterilerin izni
5. Firma adı kararı (Üçel Tarım Aletleri / Üçel Ziraat)
6. 4 tonluk römork teyidi; kırmızı hidrolik makinenin adı

## Son değerlendirme

| Alan | Eski | Yeni | Gelişim |
|---|---:|---:|---:|
| Tasarım | 70 | 86 | +16 |
| Okunabilirlik | 58 | 88 | +30 |
| Hedef kitle | 55 | 80 | +25 |
| Teknik bilgi | 10 | 20 | +10 |
| Satış | 50 | 83 | +33 |
| Güven | 60 | 74 | +14 |
| Marka | 62 | 78 | +16 |
| UX | 68 | 86 | +18 |
| Mobil | 25 | 88 | +63 |

Teknik bilgi puanı Üçel'in verisiyle 70+'ya, güven puanı üretim fotoğraflarıyla 85+'ya çıkar.

## En önemli 10 gelişim

1. Telefon sürümü: 31 ekran, en küçük yazı 10 pt, her ekranda WhatsApp / Ara butonu
2. "Bilgi için arayın" (30 yer) yerine kullanıcıyı mesaja yönlendiren seçim kutusu
3. Her ürüne özel WhatsApp mesajı ve CTA ("Ne taşıyacağınızı yazın…")
4. Ayrı "Neden Üçel?" sayfası: 5 neden, her biri fotoğraf ve kanıtla
5. "Ne yapmak istiyorsunuz?" sayfası: işe göre ürün eşleştirme
6. Kendi imalatı ürünler (römork, kültivatör, loader kepçe) iki sayfa ve öne alındı
7. Marka hikâyesi sitedeki gerçek sözlerle: "Baba oğul, aynı emek."
8. Ürün sayfası akışı: ürün → fayda → kullanım → kimler için → neden Üçel → CTA
9. Takas, 4 adımlı satış adımına dönüştü
10. Teknik veri altyapısı: veri gelince her model bir satır, HP sütunu kırmızı — tek komutla güncellenir
