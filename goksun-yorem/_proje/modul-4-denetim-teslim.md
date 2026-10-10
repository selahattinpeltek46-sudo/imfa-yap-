# 🔴 MODÜL 4 — DENETİM, FINAL QA, TESLİM VE ÖĞRENME (17–22)

Kaynak: `modul-1-strateji.md`, `modul-2-icerik-seo.md`, `modul-3-gelistirme.md`, `goksun-yorem/index.html`, `goksun-yorem/kvkk/index.html`, `goksun-yorem/sitemap.xml`.

---

## 17 — EVALUATION

| Boyut | Değerlendirme |
|---|---|
| Doğruluk | M2 metinleri kanıtsız iddia taramasından geçmişti; denetimde 3 yeni sorun bulundu (18 · A3–A5) → düzeltildi |
| Context uyumu | Brifteki 6 bölüm, sırası, renkler, fontlar, CDN'ler, tek HTML, alert korunmuş. Eklenen SSS, "Nasıl işler?" ve KVKK sayfası gerekçeli (M2 · 10–11) |
| Marka | Bordo/krem/orman/kömür paleti tutarlı; Montserrat başlık, Open Sans gövde |
| UX | Mobil menü, sabit WhatsApp, tek kolon mobil akış; logo mobilde tek satır |
| Conversion | 9 WhatsApp noktası, ürüne özel hazır mesaj; form → WhatsApp özeti. Numara yer tutucu olduğu için şu an **gerçek dönüşüm üretemez** (A1) |
| SEO | Title 49 kr., meta 132 kr., tek H1, canonical, OG, `ButcherShop` + `FAQPage`, sitemap |
| Visual | Görseller temsili ve işaretli; Unsplash ID'leri test ortamında doğrulanamadı (A2) |
| Technical | JS hatası yok; 3 genişlikte yatay taşma yok; Tailwind Play CDN üretim bedeli (A7) |
| Accessibility | Skip-link, alt metinler, `aria-hidden` ikonlar, focus çerçevesi, `<details>` SSS, etiketli form alanları, `prefers-reduced-motion` |
| Performance | Görseller `loading="lazy"`, hero `fetchpriority="high"`; Tailwind CDN ~300 KB JS darboğaz |
| Evidence | Sahte yorum/rakam/yıl yok; "%100 Taze & Yerli Kesim" kullanıcı beyanı (A6) |

## 18 — AUDIT

| # | Sınıf | Önem | Konum | Bulgu |
|---|---|---|---|---|
| A1 | CONVERSION | KRİTİK | `index.html` script: `WHATSAPP_NUMARASI`, `TELEFON_NUMARASI`, `TELEFON_GORUNEN` | Numaralar yer tutucu; tüm CTA'lar ve form çalışmaz |
| A2 | EVIDENCE / VISUAL | YÜKSEK | `index.html` tüm `<img>` | Unsplash fotoğraf ID'leri bu ortamdan açılamadı; içerik/alt metin uyumu doğrulanamadı |
| A3 | HALLUCINATION | YÜKSEK | `index.html` Biz Kimiz P1 | "yayla otlarıyla beslenen hayvanları", "kuşaktan kuşağa aktarılan" — besleme ve aile geleneği BİLİNMİYOR |
| A4 | HALLUCINATION | YÜKSEK | `index.html` Biz Kimiz P1 | "Etlerimizi yerel üreticilerden temin eder" — tedarik kaynağı BİLİNMİYOR ("yerli kesim" ≠ "yerel üretici") |
| A5 | HALLUCINATION | YÜKSEK | `index.html` Ürün kartı 4 | "Göksun yaylalarından süzme bal" — balın menşei BİLİNMİYOR |
| A6 | EVIDENCE | ORTA | Hero şeridi + Biz Kimiz rozeti | "%100 Taze & Yerli Kesim" brifte istendi, belgesi BİLİNMİYOR |
| A7 | TECHNICAL | ORTA | `<head>` Tailwind Play CDN | Çalışma anında CSS üretimi; üretimde önerilmez, ilk boyama gecikir |
| A8 | FACT | ORTA | Footer Çalışma Saatleri | Saatler [VARSAYIM], gerçek bilgi değil |
| A9 | CONTEXT | DÜŞÜK | Footer Instagram | @selahattin_peltek kişisel hesap olabilir; işletme hesabı açılırsa değiştirilmeli |
| A10 | UX | DÜŞÜK | Mobil hero (375 px) | İlk ekranda sabit WhatsApp butonu bilgi şeridinin son kutusunun üstüne geliyor; kaydırınca kalkıyor |
| A11 | SEO | DÜŞÜK | JSON-LD | `telephone` ve `openingHours` şemada yok (bilgi gelince eklenecek) |
| A12 | TECHNICAL | DÜŞÜK | Alan adı | Canonical/OG/sitemap GitHub Pages adresini kullanıyor |

## 19 — REVISION

| # | Bulgu | Aksiyon | Test |
|---|---|---|---|
| R1 | A5 | "…ve kahvaltıların tatlı eşlikçisi süzme bal." M1 Segment C mesajı ve M2 metni de güncellendi | Test paketi tekrar → ✅ |
| R2 | A3 + A4 | P1 → "yöremizin temiz havasını, yayla ürünlerini ve geleneksel kasaplık anlayışını tek dükkanda buluşturur. Etlerimiz günlük, taze ve yerli kesim olarak tezgaha gelir…"; "Yerel Tedarik" rozeti → "Yerli Kesim" | ✅ |
| R3 | A1 | **Düzeltilemez** (müşteri bilgisi gerekli). Tek noktadan değişecek şekilde 3 sabit hazır; handoff'ta 1. sıradaki iş | ❌ — müşteriden numara bekleniyor |
| R4 | A2 | Bu ortamdan düzeltilemez; görsel yüklenmezse gradyan zemin bozulmayı önlüyor; tüm görseller "temsili" işaretli; SHOT LIST (M2 · 14) hazır | ⚠️ — yayın sonrası gözle kontrol gerekli |
| R5 | A6 | Brif gereği korundu; KULLANICI BİLGİSİ olarak kayıtlı | Not edildi |
| R6 | A7 | Brif gereği CDN korundu; derlenmiş CSS'e geçiş bakım önerisine yazıldı | Not edildi |
| R7 | A8 | Müşteri teyidi bekleniyor; handoff'ta | Not edildi |
| R8 | A9–A12 | Not edildi (DÜŞÜK) | — |

Revizyon sonrası tam test paketi (3 genişlik, CTA'lar, form akışı, JSON-LD, konsol) tekrar çalıştırıldı: tümü ✅.

## 20 — FINAL QA

- [x] ✅ Desktop görünüm (1440 px ekran görüntüsü)
- [x] ✅ Mobil görünüm (375 px, yatay kaydırma 0)
- [x] ✅ Tüm iç linkler çalışıyor (tüm `#` hedefleri mevcut; `kvkk/` ↔ `../`)
- [x] ✅ Tüm CTA'lar doğru hedefe gidiyor (hero → ürünler/randevu; 9 WhatsApp `wa.me` ile)
- [ ] ❌ WhatsApp linki **doğru numara** ile açılıyor — hazır mesajlar doğru, numara yer tutucu (A1)
- [x] ✅ Form doğrulama + alert + WhatsApp özeti (numara yer tutucu dışında)
- [ ] ⚠️ Görseller yükleniyor — doğrulanamadı (A2); alt metinler var, temsili görseller işaretli ✅
- [x] ✅ Title, meta description, tek H1, canonical; schema geçerli JSON (KVKK `noindex`)
- [x] ✅ İçerik: kanıtsız iddia taraması tamamlandı (R1, R2)
- [x] ✅ NAP: "Göksun Yörem Et ve Süt Ürünleri · Göksun Merkez, Göksun / Kahramanmaraş" header/footer/schema/KVKK'da aynı (telefon bekleniyor)
- [x] ✅ KVKK aydınlatma metni + form onayı (şablon, hukuki kontrol notu); çerez banner'ı gerekmiyor (analytics yok)
- [x] ✅ Ölçüm olayları kodda tanımlı (`gtag` olmadığında sessiz); GA4 kurulmadı
- [x] ✅ Regression: yalnızca `goksun-yorem/` ve `.claude/skills/selahattin-ai/SKILL.md` (öğrenme notu) değişti

Kalan ❌/⚠️ maddelerin nedeni 21'de.

## 21 — HANDOFF

**Yapılanlar**
- 22 aşamalı strateji → içerik/SEO → geliştirme → denetim dosyaları (`_proje/`)
- Tek sayfalık landing page (brifteki 6 bölüm + SSS + "Nasıl işler?"), KVKK sayfası, sitemap
- Kanıtsız iddia temizliği, form → WhatsApp aktarımı, yerel SEO şeması, erişilebilirlik, mobil düzeltmeler

**Yapılmayanlar**
- Gerçek numara, saat, adres, fotoğraf eklenmedi (bilgi yok)
- Google Business profili açılmadı (sahibinin yapması gerekir)
- GA4 / çerez banner'ı kurulmadı (ölçüm istenmedi; altyapı hazır)
- Tailwind derlenmiş CSS'e geçirilmedi (brif CDN istedi)
- `main`'e birleştirme yapılmadı (PR kullanıcı onayıyla)

**Doğrulanan bilgiler:** Marka adı, ürünler, Instagram hesabı, konum (kullanıcı); Göksun'un yüksek rakımlı/yayla bölgesi olduğu (araştırma).

**Varsayımlar:** Teslimat bölgesi Göksun merkez; çalışma saatleri; site adresi GitHub Pages; formun WhatsApp'a aktarılmasının kabul edilebilir olduğu.

**Kalan riskler:** A1 (numara) · A2 (görseller) · A7 (CDN performansı) · A8 (saatler) · KVKK metninin hukuki kontrolü.

**Dosya listesi**
- `goksun-yorem/index.html`
- `goksun-yorem/kvkk/index.html`
- `goksun-yorem/sitemap.xml`
- `goksun-yorem/_proje/modul-1-strateji.md`, `modul-2-icerik-seo.md`, `modul-3-gelistirme.md`, `modul-4-denetim-teslim.md`, `durum.md` (yayına çıkmaz)

**Müşteriden beklenenler (öncelik sırasıyla)**
1. WhatsApp ve telefon numarası → `index.html` sonundaki 3 sabit
2. Açık adres + Google Business profili bağlantısı
3. Gerçek çalışma saatleri
4. SHOT LIST'teki fotoğraflar (özellikle dükkan içi, usta, ürünler)
5. Teslimat bölgesi/koşulları ve il dışı kargo yapılıp yapılmadığı
6. Logo (varsa), işletme Instagram hesabı (kişisel hesaptan farklıysa)

**Bakım önerileri**
- Fotoğraflar gelince Unsplash yerine `goksun-yorem/img/` altına WebP olarak koy, "temsili" etiketlerini kaldır.
- Alan adı alınırsa canonical, OG, sitemap ve şemadaki URL'yi güncelle.
- Telefon ve saatler netleşince JSON-LD'ye `telephone` ve `openingHoursSpecification` ekle.
- Trafik artınca Tailwind'i CLI ile derlenmiş tek CSS dosyasına geçir.
- GA4 eklenecekse önce çerez banner'ı + Consent Mode.

## 22 — LEARNING / SYSTEM UPDATE

- **Yeni kural:** Brifte hazır metin istense bile ürün menşei ("X yaylasından bal"), hayvan besleme ve "kuşaktan kuşağa" gibi aile geleneği ifadeleri kanıtsız iddia sayılır; denetimde ilk bakılacak yerler bunlar.
- **Yeni hata:** İlk sürümde form verisi hiçbir yere gitmiyordu ama metin "ustamız sizi arayacak" diyordu → statik sitede form metni, verinin gerçekten nereye gittiğini söylemeli.
- **Yeni çözüm:** Sunucusuz statik sitelerde form → doğrulama + `wa.me` özet mesajı; `window.open` dönüşü `null` ise aynı sekmede aç (`noopener` parametresi `null` döndürdüğü için kullanılmaz, sonra `win.opener = null`).
- **Yeni workflow:** Test ortamında CDN'ler kapalıysa Playwright `route` ile Tailwind'i aynı config'le yerelde derleyip enjekte et, FontAwesome'u npm paketinden sun.
- **Yeni kalite standardı:** Dekoratif mutlak konumlu kutular (`-right-5` vb.) mobilde yatay taşma yapar; bölüme `overflow-x-clip` ver ve 375 px'te `scrollWidth` testi yap.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [x] Tüm KRİTİK / YÜKSEK audit bulguları düzeltildi — A3, A4, A5 düzeltildi; ❌ A1 (numara) ve ⚠️ A2 (görsel) müşteri bilgisi/ağ erişimi gerektirdiği için handoff'ta
- [x] Final QA listesinde ❌ kalmadı (kalan varsa nedeni handoff'ta) — kalan 2 madde handoff'ta
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING güncellendi
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti sunuldu
