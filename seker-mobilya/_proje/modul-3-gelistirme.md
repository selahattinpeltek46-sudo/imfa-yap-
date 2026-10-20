# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Önce okundu: `modul-1-strateji.md`, `modul-2-icerik-seo.md`

## 15 — TECH STACK & DEVELOPMENT PLAN

| Konu | Karar | Gerekçe |
|---|---|---|
| Teknoloji | Statik HTML + CSS + vanilla JS; sayfalar `_proje/uret.py` ile `_proje/icerik.py`'deki tek kaynaktan üretilir | Repo GitHub Pages ile derlemesiz yayınlanıyor; 8 sayfalık vitrin için CMS / framework gereksiz. Üretici yalnız geliştirmede çalışır, yayın düz HTML. |
| Yazı tipleri | Fraunces + Hanken Grotesk, woff2 (OFL, `@fontsource-variable` paketlerinden) `fonts/` içinde | Harici istek, çerez, KVKK yükü yok |
| WhatsApp | `https://wa.me/905357618538?text=…` — numara `js/ayarlar.js`'te tek yerde; HTML'de de aynı numarayla hazır bağlantı (JS çalışmasa da çalışır) | Business API gerekmez |
| Form | Sunucu yok → **mesaj hazırlayıcı**: seçimler tarayıcıda WhatsApp metnine dönüşür, ziyaretçi kendisi gönderir; "Mesajı kopyala" yedeği; telefon alternatifi | Veri toplanmaz → KVKK metni gerekmez; Formspree vb. üçüncü taraf ve spam riski yok |
| Harita | Tıklayınca yüklenen Google iframe; öncesinde çıtalı panel dokulu yer tutucu | İlk yükte Google'a istek / çerez yok |
| Analytics | GA4 kurulmadı; olaylar `dataLayer`'da | Modül 2 ölçüm planı; eklenirse çerez onayı şart |
| İkinci adres | `ayarlar.js → ikinciAdres` (boş = gizli) | Teyit edilince tek satırla tüm sayfalarda görünür |

**Dosya yapısı:** `seker-mobilya/index.html`, `tv-unitesi/`, `banyo/`, `mutfak/`, `giyinme-odasi-gardirop/`, `portmanto/`, `duvar-paneli-petek-kapama/`, `isler/` (her biri `index.html`), `css/site.css`, `js/ayarlar.js`, `js/site.js`, `img/` (47 WebP + logo, favicon, apple-touch-icon, og.jpg), `fonts/` (6 woff2), `sitemap.xml`. Yayınlanmayan: `_proje/` (deploy'da otomatik silinir).

**Riskler:** (1) kareler 348 px → retina ekranda yumuşak (orijinaller istendi); (2) 0535 hattı WhatsApp'ta değilse birincil CTA çalışmaz (telefon yanında); (3) iki adres belirsizliği; (4) Haritalar'daki web sitesi bağlantısı müşteri değiştirene kadar ölü siteye gitmeye devam eder.

**Değişiklik kapsamı:** yalnız `seker-mobilya/` (yeni) + `.claude/skills/selahattin-ai/SKILL.md` (System Learning). Kök site, diğer firma klasörleri, deploy workflow'u değişmedi.

**Acceptance criteria** (hepsi `testler/test.js` ile otomatik; 297/297 geçti)
1. 8 sayfanın hepsi masaüstü (1366) ve mobilde (375) konsol hatasız, 4xx/5xx yanıtsız
2. 375 px'te yatay taşma yok (`scrollWidth - innerWidth ≤ 0`)
3. Her sayfada title ≤60, meta 70–155, tek H1, doğru canonical, geçerli JSON-LD
4. Tüm görseller yükleniyor, hepsinde `alt` var, hiçbiri 362 CSS px'ten geniş değil
5. Tüm WhatsApp bağlantıları `wa.me/905357618538?text=` ile, tüm `tel:` bağlantıları `+905357618538`
6. NAP adresi her sayfada görünür
7. İlk yüklemede localhost dışına **hiç istek yok** (harita tıklanmadan)
8. `[hidden]` öğeler gerçekten gizli
9. Tüm iç bağlantılar 200
10. Mesaj hazırlayıcı: sayfaya göre tür ön seçili; seçim/yazı → önizleme = gönderilen WhatsApp metni (birebir)
11. Mobil menü: başta kapalı, açılır, Esc ile kapanır
12. Harita yalnız tıklayınca iframe ekliyor
13. Galeri süzgeci: `isler/#banyo` → 15 kare, `hashchange` → `#tv` 6 kare, "Hepsi" 47; `dataLayer` olayı düşüyor

## 16 — DEVELOPMENT

- **INSPECT / UNDERSTAND:** repo yapısı, deploy workflow'u, `_config.yml`, önceki mobilya projesi (`aytac-mobilya/` — yöntem referansı; kod ve tasarım paylaşılmadı).
- **PLAN → PATCH:** görsel çıkarma (ekran kaydı → 47 kare), logo (profil fotoğrafından dairesel kesim), `icerik.py` (metin + envanter), `uret.py`, `site.css`, `site.js`, `ayarlar.js`, og görseli (`_proje/og.html` → Playwright ekran görüntüsü).
- **TEST:** Playwright ile tam sayfa ekran görüntüleri (masaüstü + mobil) incelendi; 3 düzeltme yapıldı: (1) detay bölümünde liste ile metnin ayrık durması → liste metin sütununa alındı; (2) oda dizininde zayıf özetler ("TV duvarı salonun yüzü.") → sayfa başına ayrı `ozet` alanı; (3) Google satırında çift yıldız. Görsel kontrolde: 3 sabitlenmiş paylaşımda Instagram simgesi kalıyordu → ek kırpma; bir karede fare imleci vardı → aynı işin imleçsiz karesi; tüm detay noktalarının doğru parçaya denk geldiği tek tek bakıldı.
- **REGRESSION:** `git diff --stat` yalnız `seker-mobilya/` ve `SKILL.md`'yi gösteriyor.
- **DEPLOY:** `claude/epic-einstein-x28dko` dalına commit + push. main'e birleşince adres: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/seker-mobilya/`.

**Yeniden üretme:** `python3 seker-mobilya/_proje/uret.py` (site) · `python3 seker-mobilya/_proje/uret.py --metin` (Modül 2 metin bölümü) · test: kökte `python3 -m http.server 8765` + `node seker-mobilya/_proje/testler/test.js`.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi (297/297)
- [x] Modül 2'deki tüm sayfalar üretildi (8/8)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
