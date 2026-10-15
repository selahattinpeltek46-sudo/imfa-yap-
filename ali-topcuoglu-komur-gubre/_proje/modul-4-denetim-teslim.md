# 🔴 MODÜL 4 — DENETİM, FINAL QA, TESLİM VE ÖĞRENME (17–22)

Kaynak: `modul-1-strateji.md`, `modul-2-icerik-seo.md`, `modul-3-gelistirme.md` + üretilen 7 sayfa.

## 17 — EVALUATION

| Boyut | Durum |
|---|---|
| Doğruluk | Tüm somut iddialar (yıl, filo, ürün detayı) kasıtlı olarak dışarıda bırakıldı; mevcut metin kanıtsız iddia içermiyor |
| Context uyumu | M1/M2'deki segment ve mesajlarla birebir örtüşüyor |
| Marka | Ramazan Bey'in sitesinden bilinçli olarak farklı palet/tipografi (M1 · 03: iki firma arasında bağlantı kurulmayacak kararı) |
| UX | Tutarlı header/footer, 3 adımlı süreç her iş kolu sayfasında tekrarlanıyor, çapraz linkler çalışıyor |
| Conversion | CTA'lar net ama telefon numarası eksik olduğu için şu an **fiilen tıklanabilir bir dönüşüm yolu yok** — KRİTİK (bkz. 18) |
| SEO | Title/meta/H1/slug her sayfada var; BreadcrumbList şeması 6/7 sayfada (ana sayfa hariç, standart) |
| Visual | Gerçek/stok görsel yok — M2 kararı gereği yanlış/alakasız görsel kullanmaktansa görselsiz bırakıldı |
| Technical | Responsive, semantik HTML, `:focus-visible`, `prefers-reduced-motion` |
| Accessibility | Görsel olmadığı için alt metin konusu geçerli değil; buton/link kontrastı yeterli |
| Performance | Harici bağımlılık yalnızca Google Fonts; sayfa ağırlığı düşük |
| Evidence | Tüm kanıt halkaları M1/M2'de BİLİNMİYOR olarak doğru şekilde işaretlenmiş |

## 18 — AUDIT

| # | Sınıf | Önem | Konum | Bulgu |
|---|---|---|---|---|
| A1 | CONVERSION | KRİTİK | Tüm sayfalar | Telefon numarası teyit edilmediği için hiçbir CTA fiilen tıklanabilir değil — site şu haliyle dönüşüm üretemez |
| A2 | FACT | KRİTİK | `iletisim/`, footer (tüm sayfalar) | Adres yalnızca "Göksun, Kahramanmaraş" genel düzeyinde; tam adres/harita yok |
| A3 | TECHNICAL | YÜKSEK | `iletisim/index.html` (M3 sonunda) | Sayfanın ana başlığı `<h2>` olarak kodlanmıştı, `<h1>` yoktu — **bu modülde tespit edilip düzeltildi** |
| A4 | SEO | ORTA | `index.html`, `hakkimizda/`, `iletisim/` | BreadcrumbList şeması yalnızca 4 iş kolu sayfasında vardı — **bu modülde `hakkimizda/` ve `iletisim/`'e eklendi** (ana sayfaya breadcrumb eklenmedi, standart pratik: kök sayfa breadcrumb gerektirmez) |
| A5 | EVIDENCE | DÜŞÜK | Tüm sayfalar | Görsel hiç yok — SHOT LIST'e göre gerçek fotoğraf gelince doldurulacak, şimdilik bilinçli boşluk |
| A6 | SEO | DÜŞÜK | Tüm sayfalar | Canonical/OG meta etiketleri yok — domain BİLİNMİYOR olduğu için M2'de bilinçli ertelendi |
| A7 | SEO | DÜŞÜK | Tüm sayfalar | `LocalBusiness` şeması yok — NAP teyit edilmeden eklenemez (M1 · 03 KRİTİK'e bağlı) |

## 19 — REVISION

- A3 (YÜKSEK): Düzeltildi — `iletisim/index.html`'de `<h2 class="section-title">` → `<h1 class="section-title">`.
- A4 (ORTA): Düzeltildi — `hakkimizda/index.html` ve `iletisim/index.html`'e `BreadcrumbList` şeması eklendi.
- A1, A2 (KRİTİK): **Düzeltilemedi** — bunlar kod hatası değil, eksik müşteri bilgisi. Kullanıcıdan telefon ve tam adres teyidi gelmeden düzeltilemez (bkz. Handoff).
- A5, A6, A7 (DÜŞÜK): Not edildi, bu sürümde düzeltilmedi — sırasıyla gerçek görsel, domain ve NAP teyidine bağlı.

Düzeltmeler sonrası tekrar test: H1 sayımı ve BreadcrumbList varlığı yeniden grep ile doğrulandı — her sayfada tam 1 `<h1>` var, 6/7 sayfada BreadcrumbList var (ana sayfa hariç, kasıtlı).

## 20 — FINAL QA

- [x] Desktop görünüm (1280px, Playwright/Chromium ile 7 sayfa da kontrol edildi)
- [x] Mobil görünüm (390px, yatay kaydırma yok, hamburger menü açılıp kapanıyor — tıklama testiyle doğrulandı)
- [x] Tüm iç linkler çalışıyor (grep ile hedef klasörler doğrulandı)
- [ ] Tüm CTA'lar doğru hedefe gidiyor — ❌ **CTA'lar telefon numarası olmadığı için işlevsiz, bilinçli olarak `tel:` linki eklenmedi** (bkz. A1)
- [ ] WhatsApp linki — ❌ **Numara yok, buton da yok** (M3 · 15 kararı)
- [x] Formlar — N/A (form yok, M2 · 11 kararı)
- [x] Görseller — N/A (görsel yok, hepsi bilinçli boşluk, "temsili" yanlış görsel riski alınmadı)
- [x] Her sayfada title, meta description, tek H1 var; BreadcrumbList 6/7 sayfada — ❌ canonical yok (domain BİLİNMİYOR, M2 kararı)
- [x] İçerik: kanıtsız iddia taraması yapıldı, temiz
- [ ] NAP tüm sayfalarda aynı ve doğru — ❌ **NAP henüz teyit edilmedi, bu yüzden "aynı ve doğru" değil, "aynı ve BEKLİYOR"**
- [x] KVKK/çerez — N/A (gerekmiyor, M2 · 11 kararı)
- [x] Ölçüm olayları — N/A (analytics yok, M2 · 13 kararı)
- [x] Regression: `git status --short` ile yalnızca `ali-topcuoglu-komur-gubre/` değişti; diğer firma klasörleri (`ramazan-topcuoglu-yapi-market/`, `soyleroglu-hafriyat/`, `goksun-yorem/`, `ucel-romork/`) etkilenmedi

**Kalan ❌ maddeler müşteri bilgisi eksikliğinden kaynaklanıyor, kod/tasarım hatası değil — bkz. 21 Handoff.**

## 21 — HANDOFF

**Yapılanlar:**
- SELAHATTİN AI akışıyla tam strateji (4 segment yerine 3 segment + 4 iş kolu), bilgi mimarisi, SEO planı ve 7 sayfalık çok dilde değil tek dilde (TR) statik site üretildi.
- Ortak `styles.css`/`script.js`, mobil menü, responsive tasarım, BreadcrumbList şeması (6/7 sayfa).
- Kanıtsız hiçbir iddia (yıl, filo, ürün detayı, fiyat) kullanılmadı.

**Yapılmayanlar (bilerek):**
- Telefon/WhatsApp CTA'ları işlevsel değil (numara yok).
- Tam adres ve harita yok.
- Gerçek veya stok görsel yok.
- Canonical/OG meta, LocalBusiness şeması, domain bağlantısı yok.
- KVKK/çerez, form, analytics — bu sürümde kapsam dışı (gerekçeli).

**Doğrulanan bilgiler (KULLANICI BİLGİSİ):**
- Firma adı ve iş kolu (kömür/gübre/nakliye/inşaat ticareti) — kullanıcı tarafından teyit edildi.

**Varsayımlar / araştırma bulguları (teyitsiz):**
- Adres/telefon adayı (KMTSO kaydı) — M1 · 01.
- Çalışma saatleri, kuruluş yılı, ürün detayları, filo kapasitesi — hiçbiri sitede somut yazılmadı.

**Kalan riskler:**
- KRİTİK: Telefon/adres teyit edilmeden site gerçek bir domain'e/GitHub Pages'e **yayına alınmamalı**.
- YÜKSEK: Ramazan Bey'in firmasıyla ilişki (işbirliği mi, bağımsız mı) hâlâ netleşmedi; şu an iki site arasında hiçbir bağlantı yok — bu kasıtlı ve güvenli bir varsayılan.

**Dosya listesi:** `ali-topcuoglu-komur-gubre/{index.html, goksun-komur/, goksun-gubre/, goksun-nakliye/, goksun-insaat-ticareti/, hakkimizda/, iletisim/, styles.css, script.js, assets/, _proje/}`

**Sonraki bakım önerileri:** Telefon/adres teyit edildiğinde tüm `.pending` etiketli alanları tek tek güncelle (Ramazan Bey'in projesinde izlenen yöntemle aynı); gerçek görsel geldiğinde SHOT LIST'teki eşleştirmeyi kullan.

**Müşteriden beklenenler:**
1. Telefon numarası (KRİTİK)
2. Tam adres (KRİTİK)
3. Çalışma saatleri (ORTA)
4. Gerçek fotoğraflar — depo/saha, ürünler, varsa Ali Bey (ORTA)
5. Kömür türleri, gübre çeşitleri, nakliye kapasitesi, inşaat ticareti kapsamı gibi ürün detayları (YÜKSEK — mesaj netliği için)
6. Ramazan Bey'in firmasıyla ilişki kurulup kurulmayacağı (ORTA)

## 22 — LEARNING / SYSTEM UPDATE

`SKILL.md` → `SYSTEM LEARNING` bölümüne eklenecek maddeler:
- [2026-10-15] [ali-topcuoglu-komur-gubre] KURAL: Bir kardeş/aile firması projesine başlarken, firma adı aynı göründüğü için önceki projenin ürün/sektör varsayımını miras almak (ör. "o da yapı market yapar") tehlikeli bir kısayoldur — iş kolu her zaman ayrıca teyit edilmeli.
- [2026-10-15] [ali-topcuoglu-komur-gubre] HATA: Bir sayfanın ana başlığı yanlışlıkla `<h2>` olarak kodlanmıştı (`<h1>` yoktu) — Modül 3'ün kendi Final QA'sında bu tür tek-H1 kontrolü otomatik grep ile yapılmamıştı, hata Modül 4 denetiminde yakalandı. ÇÖZÜM: Modül 3'ün "TEST" adımına artık her sayfa için `grep -c "<h1" sayfa.html` kontrolü eklenmeli, Modül 4'e bırakılmamalı.
- [2026-10-15] [ali-topcuoglu-komur-gubre] WORKFLOW: Uzun bir oturumda konteyner/ortam yeniden başlatılabiliyor ve yerel git kopyası, önceki push'lardan **daha eski bir noktadan** sığ (shallow) klonlanabiliyor — bu durumda `git push` "fetch first" veya "unrelated histories" hatası verebilir. ÇÖZÜM: `git push` reddedilirse asla `--force` ile üzerine yazma; önce `git fetch --unshallow origin` (sığ klon şüphesi varsa) sonra `git merge origin/<branch>` dene; iki proje farklı klasörlerde olduğu sürece çakışmasız birleşir.
- [2026-10-15] [ali-topcuoglu-komur-gubre] STANDART: Telefon/adres gibi gerçek üçüncü kişilere ait olabilecek, araştırmayla bulunan ama kullanıcı tarafından karakter karakter teyit edilmemiş iletişim bilgileri, `tel:`/`mailto:` linki olarak **asla** tıklanabilir hale getirilmemeli; yalnızca kullanıcı açıkça "bu doğru" dediğinde linke dönüştürülmeli (Ramazan Bey projesindeki örnekle tutarlı).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [x] KRİTİK/YÜKSEK audit bulgularından düzeltilebilir olanlar (A3, A4) düzeltildi; düzeltilemeyenler (A1, A2 — müşteri bilgisi eksikliği) handoff'ta açıkça belirtildi
- [x] Final QA listesinde kalan ❌'lar nedenleriyle handoff'ta açıklandı
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING maddeleri hazırlandı (SKILL.md'ye işlenecek)
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti kullanıcıya sunulacak (bu mesajın sonunda)
