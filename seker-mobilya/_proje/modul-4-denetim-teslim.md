# 🔴 MODÜL 4 — DENETİM, FINAL QA, TESLİM VE ÖĞRENME (17–22)

Önce okundu: `modul-1…3`, üretilen site dosyaları.

## 17 — EVALUATION

| Boyut | Sonuç |
|---|---|
| Doğruluk | NAP Haritalar kartıyla birebir; puan tarihli; metinde yalnız görülen işler |
| Context uyumu | Firmanın "oda bitiren" kapsamı (dolap + panel + ışık + boya + banyo yenileme) ana mesaja taşındı; slogan "Evinize tat katıyoruz" alt bilgide |
| Marka | Logo renkleri yalnız vurgu; tasarım dili firmanın kendi işlerinden (lake, çıtalı panel, gizli ışık, ceviz) |
| UX | İlk ekranda ne/nerede/CTA; oda dizini; her sayfada tür ön seçili mesaj; mobil sabit çubuk |
| Conversion | WhatsApp > telefon > yol tarifi / Instagram; mesaj hazırlayıcı ilk mesajı hazırlıyor |
| SEO | 6 iş adına 6 sayfa (firmanın kendi kapak kelimeleri), local schema, FAQPage, sitemap |
| Visual | 47 gerçek kare, hiçbiri büyütülmeden; numaralı detay imza öğesi |
| Technical | Derlemesiz statik, harici istek yok, 297 otomatik test |
| Accessibility | Semantik başlıklar, alt metinler, odak halkası, klavyeyle menü/Esc, radyo seçimler gerçek `input`, `aria-live` önizleme, kontrast (soluk metin #6D675F / zemin ≈ 5:1) |
| Performance | Görseller WebP ~15–30 KB, tembel yükleme, 2 yazı tipi önyükleme, JS ~4 KB |
| Evidence | Temsili görsel yok; Reels kapağı / başlangıç kareleri etiketli; önce/sonra iddiası yok |

## 18 — AUDIT

| # | Sınıf | Önem | Konum | Bulgu | Durum |
|---|---|---|---|---|---|
| 1 | FACT | **KRİTİK** | Tüm sayfalar (konum) | İki adres var (Haritalar: Bahçelievler; Instagram: Küçükçekmece) — rolleri bilinmiyor | Müşteri girdisi gerekli; sitede yalnız Haritalar adresi + "gelmeden önce arayın"; ikinci adres ayarla hazır |
| 2 | CONVERSION | YÜKSEK | Haritalar kaydı (site dışı) | Haritalar'daki "Web sitesi" ölü `wordpress.com` adresine gidiyor | Müşteri aksiyonu #1 (handoff) |
| 3 | EVIDENCE | YÜKSEK | `icerik.py` (ilk taslak) | "Alan temizlenerek teslim", "en çok sorulan işlerimiz", "hepsi böyle başladı" | ✅ düzeltildi (Modül 2 / 12) |
| 4 | FACT | ORTA | `uret.py` alt bilgi | "Bu site çerez kullanmaz" — harita tıklanınca Google çerez bırakabilir | ✅ "kendi çerezini kullanmaz; harita yalnız siz tıklayınca yüklenir" |
| 5 | UX | ORTA | Ana sayfa / hizmet detay bölümü | Detay listesi metinden ayrık duruyordu | ✅ liste metin sütununda |
| 6 | UX | ORTA | Ana sayfa dizin | Bazı özetler bilgi taşımıyordu | ✅ `ozet` alanı |
| 7 | BRAND / EVIDENCE | ORTA | `img/` | Sabitlenmiş paylaşımlarda Instagram simgesi; bir karede fare imleci | ✅ yeniden kırpıldı / değiştirildi |
| 8 | CONVERSION | ORTA | Birincil CTA | 0535 hattının WhatsApp'ta olduğu doğrulanmadı | ⚠️ müşteri tek mesajla doğrulamalı; telefon her yerde yanında |
| 9 | SEO | ORTA | Haritalar adı | Ad alanında anahtar kelime ("mobilya imalatı, mobilya tadilatı, Ev dekorasyonu") — askıya alma riski | Öneri müşteriye (Modül 2 / 13); karar müşterinin |
| 10 | UX | DÜŞÜK | Görseller | 348 px kareler retina'da yumuşak | Orijinal fotoğraf talebi (SHOT LIST #1) |
| 11 | BRAND | DÜŞÜK | Galeri | Reels kapak yazıları vitrin estetiğini bozuyor | Yalnız galeride, etiketli; yazısız kare gelince değiştirilir |
| 12 | UX | DÜŞÜK | Mesaj hazırlayıcı | Clipboard API olmayan eski tarayıcıda "Kopyala" sessiz kalır | Not edildi (WhatsApp düğmesi asıl yol) |
| 13 | HALLUCINATION | — | Tüm metin | Kuruluş yılı, ünlü müşteri, Çimstone bayiliği, ücretsiz keşif, garanti — hiçbiri metinde yok | ✅ tarandı |

## 19 — REVISION
KRİTİK (#1) ve YÜKSEK (#2) müşteri girdisine bağlı; site tarafında olası en güvenli çözüm uygulandı (tek doğrulanmış adres, ikinci adres için hazır ayar; handoff'ta 1. aksiyon). #3–#7 düzeltildi ve her düzeltmeden sonra test + ekran görüntüsü tekrarlandı (son koşu 297/297). #8–#12 not edildi.

## 20 — FINAL QA
- [x] Desktop görünüm (1366, 8 sayfa ekran görüntüsü incelendi)
- [x] Mobil görünüm (375px, yatay kaydırma yok — test)
- [x] Tüm iç ve dış linkler çalışıyor (iç: test 200; dış: Instagram, YouTube, Haritalar, wa.me — biçim kontrolü)
- [x] Tüm CTA'lar doğru hedefe gidiyor
- [x] WhatsApp linki doğru numara ve hazır mesajla açılıyor (metin birebir test edildi) — ⚠️ hattın WhatsApp kaydı müşteride doğrulanacak
- [x] Formlar: veri toplanmıyor; mesaj hazırlayıcı doğru metni üretiyor
- [x] Görseller yükleniyor, alt metinleri var; temsili görsel yok, Reels/başlangıç kareleri işaretli
- [x] Her sayfada title, meta description, tek H1, canonical; schema JSON olarak geçerli
- [x] İçerik: yazım ve kanıtsız iddia taraması
- [x] NAP tüm sayfalarda aynı ve doğru (Haritalar kartı)
- [x] KVKK / çerez: gerekmiyor (veri ve çerez yok; harita tıkla-yükle)
- [x] Ölçüm olayları `dataLayer`'a düşüyor (GA4 kurulmadı — bilinçli)
- [x] Regression: diğer siteler etkilenmedi (`git diff --stat`)

## 21 — HANDOFF

**Yapılanlar:** 8 sayfalık site (ana sayfa, 6 hizmet, İşler), 47 gerçek iş karesi, logo/favicon/og görseli, mesaj hazırlayıcı (WhatsApp), tıkla-yükle harita, local schema + FAQ + breadcrumb, sitemap, 297 otomatik test, 4 modül raporu.
**Yapılmayanlar:** GA4 / Meta Pixel (onay + KVKK gerekir); Hakkımızda sayfası (doğrulanmış içerik yok); ikinci adresin yayını; önce/sonra karşılaştırması (eşleşen kare yok); Search Console kaydı (hesap erişimi gerekir); YouTube içeriğinin incelenmesi (konteynerden erişim yok).
**Doğrulanan bilgiler:** ad, Haritalar adresi, plus code, telefon, kategori, 4,9/93 (20.10.2026), o günün kapanış saati, Instagram sayıları ve bio, ikinci adresin varlığı, eski sitenin kapalı olduğu.
**Varsayımlar:** 0535 hattı WhatsApp'ta; fotoğraf kullanım izni; hizmet bölgesi Avrupa yakası; süreç adımları (ölçü yerinde alınır).
**Kalan riskler:** audit #1, #2, #8, #9, #10.

**Müşteriden beklenenler (öncelik sırasıyla):**
1. Google Haritalar'da "Web sitesi" alanını yeni siteye çevirmek (şu an ölü adres).
2. İki adresin rolü: hangisi mağaza, hangisi atölye? Müşteri hangisine gelmeli?
3. 0535 761 85 38 WhatsApp'ta mı? (bir test mesajı yeterli)
4. Haftalık çalışma saatleri ve kapalı gün.
5. 15–20 işin orijinal fotoğrafı + SHOT LIST'teki mağaza/atölye çekimleri.
6. Fotoğrafların sitede kullanımı için yazılı onay; "1979" kuruluş yılı teyidi (teyitle "1979'dan beri" kullanılabilir).
7. Haritalar işletme adı önerisine karar.

**Dosya listesi:** `seker-mobilya/{index.html, sitemap.xml, tv-unitesi/, banyo/, mutfak/, giyinme-odasi-gardirop/, portmanto/, duvar-paneli-petek-kapama/, isler/, css/site.css, js/site.js, js/ayarlar.js, img/ (51), fonts/ (6)}` · `_proje/{modul-1…4, durum.md, icerik.py, uret.py, og.html, testler/test.js, testler/ekran.js, kaynak-haritalar-karti.png, kaynak-instagram-profil.png}`.

**Bakım önerileri:** yeni iş → kareyi `img/`'ye koy, `icerik.py → FOTO`'ya bir satır ekle, `uret.py`'yi çalıştır; ayda bir Instagram'dan 3–5 yeni kare; numara/adres değişirse `ayarlar.js` + `uret.py` sabitleri; GA4 eklenecekse önce çerez onayı.

## 22 — LEARNING / SYSTEM UPDATE
`SKILL.md → SYSTEM LEARNING`'e eklenenler (2026-10-20, seker-mobilya):
- KURAL: Haritalar'daki "web sitesi" bağlantısı mutlaka açılıp denenir; ölüyse handoff'ta 1 numaralı müşteri aksiyonu.
- KURAL: Instagram bio adresi ile Haritalar adresi farklıysa sitede yalnız yorumların bağlı olduğu Haritalar adresi yayınlanır; diğeri `ayarlar.js`'te boş alanla hazır bekler.
- STANDART: Haritalar işletme adında anahtar kelime varsa site markayı tabela adıyla kullanır; ad düzeltmesi askıya alma riskiyle birlikte öneri olarak verilir, karar müşterinin.
- ÇÖZÜM: Sabitlenmiş Instagram paylaşımlarında sağ üst simge daha büyük → bu kareler için üstten ~65 px + orantılı yan kırpma; ekran kaydında fare imleci olan kareyi aynı işin başka karesiyle değiştir.
- WORKFLOW: Nihai metinler `icerik.py`'de tek kaynak; `uret.py --metin` Modül 2'nin 12. bölümünü işaretler arasına yazar → rapor ile site metni ayrışmaz.
- HATA: "Bu site çerez kullanmaz" ifadesi, tıkla-yükle harita olsa bile fazla kesin. ÇÖZÜM: "kendi çerezini kullanmaz; harita yalnız siz tıklayınca yüklenir".
- STANDART: Reels kapak yazılı kareler vitrin (kolaj, detay) alanında kullanılmaz; galeride "Reels kapağı" etiketiyle durur.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [x] Tüm KRİTİK / YÜKSEK audit bulguları düzeltildi — site tarafında; #1 ve #2 müşteri girdisine bağlı (handoff 1–2)
- [x] Final QA listesinde ❌ kalmadı (⚠️ WhatsApp kaydı handoff'ta)
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING güncellendi
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti sunuldu
