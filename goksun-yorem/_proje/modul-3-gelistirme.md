# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Kaynak: `modul-1-strateji.md`, `modul-2-icerik-seo.md`.

---

## 15 — TECH STACK & DEVELOPMENT PLAN

**Mevcut sistem:** Repo, GitHub Pages ile derlemesiz yayınlanıyor (`.github/workflows/deploy-pages.yml`, repo kökü yayınlanır; `_proje` klasörleri yayından çıkarılır). Site adresi: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/goksun-yorem/` (özel alan adı yok — [VARSAYIM], alan adı alınınca canonical/sitemap/OG güncellenecek).

**Teknoloji kararı:** Statik HTML + Tailwind CSS (CDN) + vanilla JS.
- Gerekçe: Kullanıcı brifi açıkça "tek HTML dosyası, Tailwind CDN, FontAwesome CDN" istiyor; sayfa tek ve içerik sabit, sunucu tarafı ihtiyaç yok.
- Yayın etkisi: Yok — mevcut Pages iş akışı klasörü olduğu gibi yayınlar.
- Bilinen bedel: Tailwind Play CDN çalışma anında CSS üretir (~300 KB JS, ilk boyamada kısa gecikme) ve Tailwind tarafından "üretim için önerilmez" olarak işaretlidir. Brif gereği korunmuştur; ileride `tailwindcss` CLI ile derlenmiş tek bir CSS dosyasına geçiş önerilir (Modül 4 · Riskler).

**Entegrasyonlar**
| İhtiyaç | Çözüm | Risk / not |
|---|---|---|
| WhatsApp sipariş | `https://wa.me/<numara>?text=...` — her butonda ürüne özel hazır mesaj; numara tek JS sabitinde (`WHATSAPP_NUMARASI`) | Numara yer tutucu → yayından önce zorunlu değişiklik |
| Form | Sunucu yok → doğrulama + brifteki `alert` + **özetin WhatsApp'ta açılması**. Formspree/Web3Forms seçilmedi: üçüncü taraf hesap, KVKK yurt dışı aktarım ve e-postanın takip edilmemesi riski; işletmenin zaten WhatsApp'ı aktif kullandığı varsayıldı | Kullanıcı mesajı WhatsApp'ta "gönder"e basmazsa talep ulaşmaz — alert metni bunu açıkça söylüyor |
| Telefon | `tel:` bağlantısı, `TELEFON_NUMARASI` sabiti | Yer tutucu |
| Analytics | Şimdilik yok (çerez banner'ı gerekmesin). `track()` fonksiyonu `gtag` varsa olay gönderir: `whatsapp_click`, `phone_click`, `form_submit`, `instagram_click` | GA4 eklenince onay banner'ı zorunlu |
| SEO | Title/meta/canonical/OG, `ButcherShop` + `FAQPage` JSON-LD, `sitemap.xml` | Telefon şemaya numara netleşince eklenecek |

**Dosya yapısı / değişiklik kapsamı**
| Dosya | İşlem |
|---|---|
| `goksun-yorem/index.html` | Güncellendi (M2 metinleri, SSS, KVKK onayı, şema, ölçüm, erişilebilirlik) |
| `goksun-yorem/kvkk/index.html` | Yeni (şablon, `noindex`) |
| `goksun-yorem/sitemap.xml` | Yeni |
| `goksun-yorem/_proje/*.md` | Yeni (yayına çıkmaz) |
| Diğer tüm dosyalar | **Dokunulmadı** |

**Acceptance criteria**
| # | Kriter | Sonuç |
|---|---|---|
| AC1 | 375 / 820 / 1440 px'te yatay kaydırma yok (`scrollWidth - innerWidth = 0`) | ✅ (ilk testte mobilde 4 px taşma bulundu → `#biz-kimiz` `overflow-x-clip` ile düzeltildi) |
| AC2 | Tüm WhatsApp bağlantıları (9 adet) `https://wa.me/` ile başlıyor | ✅ |
| AC3 | Telefon bağlantıları `tel:` | ✅ |
| AC4 | Sayfada tek H1; title ≤60 (49), meta ≤155 (132) | ✅ |
| AC5 | Tüm `#` iç bağlantılarının hedefi var | ✅ |
| AC6 | Her `<img>` alt niteliğine sahip; dekoratifler `alt=""` + `aria-hidden` | ✅ |
| AC7 | JSON-LD blokları geçerli JSON | ✅ (2/2) |
| AC8 | Form: boş gönderim uyarır, KVKK işaretsiz uyarır, geçerli gönderimde alert + WhatsApp özeti açılır + form sıfırlanır | ✅ (mesaj içeriği test edildi) |
| AC9 | Mobil menü açılır, bağlantıya tıklayınca kapanır; Esc ile kapanır | ✅ (açma/kapama test edildi) |
| AC10 | Görsel yüklenemezse bölüm bozulmaz (gradyan zemin) | ✅ (test ortamında Unsplash kapalıydı, fallback görüldü) |
| AC11 | Konsol/JS hatası yok | ✅ |
| AC12 | KVKK sayfası mobilde taşmasız, ana sayfaya dönüş bağlantısı var | ✅ |

## 16 — DEVELOPMENT

**INSPECT → UNDERSTAND:** İlk sürüm incelendi; M2 · 12'deki kanıtsız iddia tablosundaki 10 ifade tespit edildi. Form verisi hiçbir yere iletilmiyordu ("ustamız arayacak" yanıltıcıydı).

**PLAN → PATCH (yapılanlar)**
- Metinler M2 · 12 ile birebir değiştirildi; "Kurban/Adak", "Köy yumurtası", "7/24", "mermer dokulu", "yayıklanan" vb. kaldırıldı.
- "Nasıl işler?" 3 adım ve SSS bölümü (5 soru, `<details>` ile klavye erişilebilir) eklendi.
- Form → alert + WhatsApp özeti; KVKK onay kutusu; geçmiş tarih engeli.
- Ürün görsellerine ve Biz Kimiz görseline "temsili" işaretleri.
- SEO: yeni title/meta, canonical, OG, favicon (SVG), `ButcherShop` + `FAQPage` şeması, `sitemap.xml`.
- Erişilebilirlik: "İçeriğe geç" bağlantısı, ikonlara `aria-hidden`, `:focus-visible` çerçevesi, menü butonunda dinamik `aria-label`, footer başlıkları sıralı (h2), kontrast için gri metinler %65→%70 ve bordo-light→red-400 (koyu zeminde).
- Mobil: logo tek satır, header taşması giderildi; hero alt boşluğu sabit WhatsApp butonu için artırıldı; footer alt boşluğu mobilde sabit butona yer bırakıyor.

**TEST:** Playwright + Chromium; Tailwind CDN test ortamında erişilemediği için aynı `tailwind.config` ile yerelde derlenen CSS enjekte edildi, FontAwesome npm paketinden sunuldu (yayın ortamında CDN'ler kullanılır).
- Ekran görüntüleri: masaüstü 1440, tablet 820, mobil 375 (tam sayfa), mobil menü, mobil hero, mobil form, KVKK — gözle kontrol edildi.
- Not: Unsplash test ortamından erişilemediği için gerçek fotoğraflı görünüm doğrulanamadı (⚠️ M4'te risk olarak kayıtlı).

**REGRESSION:** `git diff --stat` yalnızca `goksun-yorem/` altını gösteriyor (commit öncesi kontrol edildi).

**DEPLOY:** Değişiklikler `claude/intelligent-newton-g54q27` dalına commit + push edildi. `main`'e birleştirme PR ile (kullanıcı onayıyla).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (ana sayfa, KVKK)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
