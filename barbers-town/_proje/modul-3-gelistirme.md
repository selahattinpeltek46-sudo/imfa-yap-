# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Proje: Barber's Town · Girdi: `modul-1-strateji.md`, `modul-2-icerik-seo.md` · Tarih: 2026-10-15

---

## 15 — TECH STACK & DEVELOPMENT PLAN

- **Mevcut sistem:** Repo GitHub Pages ile derlemesiz yayınlanıyor; `_proje/` klasörleri `_config.yml` ile yayından hariç.
- **Teknoloji kararı:** Statik HTML + tek CSS dosyası + vanilla JS. Gerekçe: 2 sayfa, sunucu ihtiyacı yok. Diğer sitelerden farklı olarak **Tailwind CDN, Google Fonts ve FontAwesome kullanılmadı**: (1) üçüncü taraf istek → çerez/KVKK yükü yok, banner gerekmez; (2) CDN kapalı test ortamında da birebir aynı görünüm; (3) daha hızlı ilk boyama. İkonlar satır içi SVG `<symbol>`, yazı tipi sistem yığını.
- **Entegrasyonlar:**
  - WhatsApp → `https://wa.me/905357294333?text=...` (her CTA'ya özel hazır mesaj; JS kapalıyken de çalışan statik linkler).
  - Form → sunucu yok; doğrulama + WhatsApp özet mesajı (SYSTEM LEARNING kuralı). Form metni verinin nereye gittiğini açıkça söylüyor. Risk: kullanıcı mesajı göndermezse talep ulaşmaz — metinde belirtiliyor.
  - Harita → tıklayınca yüklenen Google Maps iframe'i (anahtarsız embed). Yol tarifi `maps/dir/?api=1`, profil `maps?cid=9388906250267932206`.
  - Analytics → kurulmadı; `data-olay` nitelikleri + `olay()` fonksiyonu hazır (GA4 eklenince çerez onayı şart).
- **Dosya yapısı / değişiklik kapsamı (yalnız yeni dosyalar):**
  `barbers-town/index.html` · `css/site.css` · `js/site.js` · `kvkk/index.html` · `img/og.png` (1200×630, sosyal paylaşım) · `sitemap.xml` · `_proje/*.md`. Kök site ve diğer firma klasörlerine dokunulmaz.
- **Riskler:** WhatsApp aktifliği teyitsiz; hizmet listesi varsayım; gerçek fotoğraf yok; çalışma saati kısmi.
- **Acceptance criteria:**
  1. 375 px'te `scrollWidth - innerWidth = 0` (ana sayfa + KVKK)
  2. Her sayfada tek H1, title ≤60, meta ≤155, canonical
  3. Tüm WhatsApp linkleri doğru numara + hizmete özel hazır mesaj
  4. Form: boş gönderimde 3 alan hatası; geçerli gönderimde ad/hizmet/gün/saat/not içeren WhatsApp mesajı; geçmiş tarih reddedilir
  5. Harita iframe'i yalnız tıklamayla yüklenir
  6. JSON-LD (HairSalon + FAQPage) geçerli JSON; konsol hatası yok
  7. Görsellerde alt metni olmayan `<img>` yok
  8. `git status` yalnız `barbers-town/` + `SKILL.md` değişikliği gösterir

## 16 — DEVELOPMENT

INSPECT (goksun-yorem yapısı, `_config.yml`, deploy akışı) → UNDERSTAND (tek sayfa + KVKK kararı) → PLAN (15) → PATCH (dosyalar yazıldı; WhatsApp linkleri Python ile `encodeURIComponent` eşdeğeri kodlandı) → TEST → REGRESSION → DEPLOY.

**Test sonuçları (Playwright / Chromium 1194, 1366×900 ve 375×812):**

| # | Kriter | Sonuç |
|---|---|---|
| 1 | Yatay taşma (masaüstü / mobil / KVKK) | 0 / 0 / 0 ✅ |
| 2 | H1 sayısı; title 58 & 37; meta 134 & 119 | ✅ |
| 3 | WhatsApp linkleri (10 adet) | `905357294333`, mesajlar doğru çözülüyor ✅ |
| 4 | Form boş → "Lütfen adınızı yazın.", "Lütfen bir hizmet seçin.", "Lütfen bugün ya da sonraki bir gün seçin." · dolu → `Ad: Ali / Hizmet: Saç + Sakal / Gün: 16 Ekim Cuma / Saat tercihi: Öğleden önce / Not: yanlar sıfır` | ✅ |
| 5 | "Haritayı göster" → 1 iframe | ✅ |
| 6 | JSON-LD parse, konsol / sayfa hatası | Hata yok ✅ |
| 7 | `img` alt eksikliği | 0 ✅ |
| 8 | Kapsam | Yalnız yeni klasör ✅ |

Ekran görüntüsü kontrolü: masaüstü ve mobil tam sayfa incelendi. Düzeltilen: logodaki makas figürü "TOWN" yazısına değiyordu → sola alındı (logo, OG görseli). OG görselinde "MERKEZİ" büyük harf dönüşümü için `lang="tr"` eklendi.

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
