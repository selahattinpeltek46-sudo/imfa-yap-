# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Proje: **Aytaç Mobilya** · Önce okundu: `modul-1-strateji.md`, `modul-2-icerik-seo.md` · Tarih: 2026-10-20

## 15 — TECH STACK & DEVELOPMENT PLAN

**Mevcut sistem:** Repo GitHub Pages ile derlemesiz yayınlanıyor (`.github/workflows/deploy-pages.yml`); `_proje` klasörleri yayından çıkarılıyor. Diğer siteler statik HTML/CSS/JS.

**Karar:** statik HTML + CSS + vanilla JS. Gerekçe: 7 sayfa, sunucu ihtiyacı yok, hız ve SEO için en sade yol; mevcut yayın altyapısına sıfır değişiklik.
- **Üretim:** 7 sayfanın ortak parçaları (üst çubuk, mesaj hazırlayıcı, konum, alt bilgi, schema) tek Python betiğinde: `_proje/uret.py` → `python3 aytac-mobilya/_proje/uret.py`. Çıktı düz HTML; yayın için derleme adımı **gerekmez** (betik yalnız içerik değişince elle çalıştırılır).
- **WhatsApp:** `https://wa.me/<numara>?text=<hazır mesaj>`; numara `js/ayarlar.js` içinde tek yerde. Numara boşken düğme Instagram DM'ye (`ig.me/m/aytac_mobilya`) gider ve mesaj panoya kopyalanır (Instagram önceden doldurmaya izin vermiyor).
- **Form:** yok. Mesaj hazırlayıcı yalnız metin üretir; veri sunucuya gitmez → KVKK/çerez yükü yok.
- **Analytics:** kurulmadı. Olaylar `window.dataLayer`'a itiliyor (`whatsapp_tikla`, `instagram_tikla`, `telefon_tikla`, `yol_tarifi_tikla`, `yorum_tikla`, `mesaja_git`, `galeri_benzerini_iste`); GA4/GTM eklenince çerez onayıyla birlikte okunur.
- **Yazı tipleri:** Schibsted Grotesk + IBM Plex Mono, `fonts/` altında gömülü (Google'a istek yok).
- **Harita:** iframe yok; Google Haritalar arama ve yol tarifi bağlantıları (plus code'dan hesaplanan koordinat).

**Dosya yapısı**
```
aytac-mobilya/
  index.html                 ana sayfa
  mutfak-dolabi/ gardirop/ banyo-dolabi/ vestiyer/ tv-unitesi-kitaplik/ isler/   (index.html)
  css/site.css   js/ayarlar.js   js/site.js
  img/  41 iş fotoğrafı (347×428 WebP) + logo.png, favicon.png, apple-touch-icon.png, og.jpg
  fonts/  6 woff2
  sitemap.xml
  _proje/  modül çıktıları, uret.py, og.html (paylaşım görseli kaynağı), kaynak-haritalar-karti.png
```

**Riskler:** (1) Telefon numarası yok → birincil CTA şimdilik Instagram DM. (2) Fotoğraflar 347 px → retina ekranda hafif yumuşak; tasarım fotoğrafı hiçbir yerde ~360 px CSS genişliğinin üstüne büyütmüyor. (3) Kullanım izni sözlü/yazılı alınmalı.

**Değişiklik kapsamı:** yalnız `aytac-mobilya/` oluşturuldu. Kök `index.html`, diğer firma klasörleri, workflow: dokunulmadı.

**Acceptance criteria**
| # | Ölçüt | Test |
|---|---|---|
| AC1 | 7 sayfanın hepsinde tek H1, canonical, title ≤60, meta 70–155 | `test.js` |
| AC2 | 1366 px ve 375 px'te yatay taşma 0 | `test.js` |
| AC3 | Konsol hatası ve 4xx/5xx kaynak yok, kırık görsel yok, tüm görsellerde alt | `test.js` |
| AC4 | Tüm JSON-LD blokları geçerli JSON | `test.js` |
| AC5 | Numara yokken: gönder → `ig.me/m/aytac_mobilya`, mesaj panoya, telefon satırı gizli | `etkilesim.js` |
| AC6 | Numara girilince: gönder → `wa.me/<numara>?text=…`, `tel:` linki görünür | `etkilesim.js` (ayarlar.js sahte yanıtla) |
| AC7 | Hizmet sayfasında ilgili iş türü önceden seçili; önizleme seçime göre değişiyor | `etkilesim.js` |
| AC8 | Galeri süzgeci sayıyı ve adresi (#tür) güncelliyor; #tür ile açılış süzülüyor | `etkilesim.js` |
| AC9 | "Bu fotoğraftaki gibi" → not alanı ve WhatsApp metni fotoğraf adıyla doluyor | `etkilesim.js` |
| AC10 | Mobil menü açılıyor, aria-expanded güncelleniyor | `etkilesim.js` |
| AC11 | Tüm iç bağlantılar ve çapalar (#mesaj, #surec) çözülüyor | Python tarayıcı |

## 16 — DEVELOPMENT

INSPECT → mevcut sitelerin yapısı (barber-ugur: `css/`, `js/`, `img/`, sitemap) incelendi; aynı düzen kullanıldı.
UNDERSTAND → Modül 2 metinleri `uret.py` içine birebir alındı (yalnız 18–19'da işaretlenen düzeltilmiş hâlleri).
PLAN → 15'teki yapı.
PATCH → yazılan dosyalar yukarıda.
TEST →
- `test.js` (Playwright/Chromium, 7 sayfa × 2 ekran): **TÜM KONTROLLER GEÇTİ**. İlk turda yakalananlar ve düzeltmeler: vestiyer ve işler meta açıklaması 157/158 karakter → kısaltıldı; büyük görünümdeki boş `src` kırık görsel sayılıyordu → ilk fotoğrafla dolduruldu.
- `etkilesim.js`: **ETKİLEŞİM TESTLERİ GEÇTİ** (19 kontrol). Yakalanan: `isler/#mutfak` aynı sayfada açılınca süzülmüyordu → `hashchange` dinleyicisi eklendi. Mesajda "tv ünitesi" küçük harfe dönüyordu → değerler ayrı tanımlandı, `toLowerCase` kaldırıldı.
- İç bağlantı taraması: 0 kırık.
- Görsel kontrol (ekran görüntüsü): ilk giriş kolajında üç dar fotoğraf etiketleri kesiyordu ve kolaj küçük kalıyordu → bir büyük (işaretli) + iki küçük düzenine geçildi, H1 küçültüldü; Instagram ızgarasından gelen 1 px koyu kenar ve köşe artığı için tüm kareler yeniden kırpıldı (347×428); "Yakından bakın" fotoğrafında çakışan iki etiket ayrıldı; süreç numaraları 01–05 yapıldı; hizmet ızgarası 3 sütun.
REGRESSION → `git diff --stat` yalnız `aytac-mobilya/` gösteriyor.
DEPLOY → commit + push `claude/upbeat-fermi-xdfy38`. main'e birleştirme PR ile (kullanıcı isteyince).

Test betikleri oturumun geçici klasöründe çalıştırıldı; kalıcı olsun diye `_proje/testler/` altına kopyalandı (`NODE_PATH=$(npm root -g) node test.js <çıktı-klasörü>`; önce repo kökünde `python3 -m http.server 8765`).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (7/7)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
