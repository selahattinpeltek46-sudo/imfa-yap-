# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Proje: Barber Uğur · Girdi: `modul-1-strateji.md`, `modul-2-icerik-seo.md` · Tarih: 2026-10-15

---

## 15 — TECH STACK & DEVELOPMENT PLAN

- **Mevcut sistem:** GitHub Pages, derlemesiz; `_proje/` klasörleri yayından hariç (`_config.yml` + deploy workflow).
- **Teknoloji kararı:** Statik HTML + tek CSS + vanilla JS (bağımlılık yok). Gerekçe: 2 sayfa, sunucu ihtiyacı yok; `barbers-town` ile aynı mimari → bakım kolay.
- **Yazı tipi:** Google Fonts "Archivo" (değişken genişlik/kalınlık) — tente yazısının geniş-kalın karakteri için. Çerez bırakmaz; IP aktarımı KVKK metninde yazıyor.
- **Entegrasyonlar:**
  - Randevu → `barbers-town` şablonu (SYSTEM LEARNING): Google Apps Script + Google Takvim + E-Tablo; `js/ayarlar.js → randevuApi` boşken form **WhatsApp moduna** düşer. Kod `_proje/randevu-sistemi/Code.gs`, kurulum `KURULUM.md`. Uyarlama: 4 hizmet, tek kaynak (`koltuk: 2`), kapanış 20:00, Pazar kapalı [VARSAYIM], kod öneki `BU-`.
  - WhatsApp → `wa.me/905428253389?text=…` (her CTA'ya özel mesaj, JS'siz de çalışır).
  - Harita → tıklayınca yüklenen iframe; yol tarifi `maps/dir/?api=1&destination=37.0753689,37.366534`; profil `maps?cid=6363675012530823023`.
  - Analytics → kurulmadı; `data-olay` + `olay()` hazır.
- **Dosyalar (yalnız yeni):** `barber-ugur/index.html` · `css/site.css` · `js/ayarlar.js` · `js/site.js` (barbers-town'dan uyarlandı) · `kvkk/index.html` · `img/og.png` (1200×630) · `sitemap.xml` · `_proje/*`. Kök site ve diğer firma klasörlerine dokunulmaz.
- **Riskler:** WhatsApp aktifliği teyitsiz; açılış saati/tatil günü varsayım; fotoğraf dosyaları yok; randevu sistemi dükkânın Google hesabında kurulana kadar WhatsApp modu.
- **Acceptance criteria:**
  1. 375 px ve 1366 px'te `scrollWidth - innerWidth = 0` (ana sayfa + KVKK)
  2. Tek H1; title ≤60; meta ≤155; canonical; JSON-LD geçerli
  3. Tüm WhatsApp linkleri `905428253389` + hazır mesaj
  4. Form hizmetleri = `Code.gs` hizmetleri; hizmet linkleri formda hizmeti önceden seçer
  5. Boş gönderim → 6 alan hatası; WhatsApp modunda ad/telefon/hizmet/gün/saat/not içeren mesaj
  6. API modu: kod ekranı; 2 koltuk dolunca saat listeden düşer; eşzamanlı dolumda "az önce doldu"; sunucu çökünce WhatsApp modu
  7. `Code.gs` saf fonksiyonları: Pazar kapalı, son başlangıç saatleri, kapasite, KAPALI blok, doğrulama
  8. Harita yalnız tıklamayla; konsol hatası yok; alt metinsiz `<img>` yok
  9. `git status` yalnız `barber-ugur/` + `SKILL.md`

## 16 — DEVELOPMENT

INSPECT (`barbers-town` yapısı ve randevu şablonu, deploy) → UNDERSTAND (tek sayfa + KVKK) → PLAN (15) → PATCH → TEST → REGRESSION → DEPLOY.

**Test sonuçları (Playwright / Chromium 1194):**
| # | Kriter | Sonuç |
|---|---|---|
| 1 | Yatay taşma masaüstü / mobil / KVKK | 0 / 0 / 0 ✅ |
| 2 | H1 = 1; title 54; meta 137; JSON-LD ×2 parse | ✅ |
| 3 | WhatsApp linkleri (5 statik + dinamik) | ✅ |
| 4 | Form ↔ Code.gs hizmet adları; `data-hizmet` önceden seçim | ✅ |
| 5 | Boş gönderim 6 hata; WhatsApp mesajı `Ad: Ali Veli / Telefon: 05321112233 / Hizmet: Sakal Tıraşı / Gün: 17 Ekim Cumartesi / Saat: 09:00 / Not: yanlar kısa` | ✅ |
| 6 | API (sahte sunucu = gerçek Code.gs fonksiyonları): kod `BU-…` gösterildi; aynı saate 2. randevu alındı; 3.'de 09:00 düştü; eşzamanlılık "az önce doldu"; sunucu çökük → WhatsApp modu | ✅ |
| 7 | Code.gs birim testleri (8 madde) | ✅ |
| 8 | Harita iframe tıklamayla; konsol/sayfa hatası 0; alt eksik 0 | ✅ |
| 9 | Kapsam | ✅ (bkz. Modül 4) |

Not: Test sırasında iki **test betiği** hatası düzeltildi (sahte sunucuda sabit tarih; tek harfli ad doğrulamaya takıldı — sitenin davranışı doğruydu).

Ekran görüntüsü kontrolü: masaüstü (1366) ve mobil (375) tam sayfa incelendi; mobil sabit alt bar (Randevu · WhatsApp · Ara) içerikle çakışmıyor (alt bilgi 120 px boşluk).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (ana sayfa + KVKK)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
