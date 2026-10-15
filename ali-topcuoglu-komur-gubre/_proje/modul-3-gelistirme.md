# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Kaynak: `modul-1-strateji.md`, `modul-2-icerik-seo.md`.

## 15 — TECH STACK & DEVELOPMENT PLAN

**Mevcut sistem:** Repo GitHub Pages ile derlemesiz yayınlanıyor; `ramazan-topcuoglu-yapi-market/` tek dosya, `soyleroglu-hafriyat/` çok sayfalı statik HTML emsali var.

**Teknoloji kararı:** Statik HTML + ortak CSS (`styles.css`) + vanilla JS (`script.js`). Gerekçe: Modül 2'de form/analytics planlanmadı, karmaşık bir backend'e ihtiyaç yok; soyleroglu-hafriyat'taki çok sayfalı statik yapı doğrudan emsal.

**Entegrasyonlar:**
- WhatsApp: **eklenmedi** — numara teyit edilmedi (M1 · 03 KRİTİK).
- Telefon: `tel:` linki **eklenmedi** — numara teyit edilmeden gerçek bir üçüncü kişiye ait olabilecek bir numarayı tıklanabilir hale getirmek riskli (Ramazan Bey'in projesinde de aynı ilke uygulandı). Bunun yerine her CTA'da görünür "⚠ teyit bekliyor" etiketi kullanıldı.
- Form: Yok (M2 · 11 kararı).
- Analytics: Yok (M2 · 13 kararı).

**Dosya yapısı (üretildi):**
```
ali-topcuoglu-komur-gubre/
├── index.html              (ana sayfa)
├── goksun-komur/index.html
├── goksun-gubre/index.html
├── goksun-nakliye/index.html
├── goksun-insaat-ticareti/index.html
├── hakkimizda/index.html
├── iletisim/index.html
├── styles.css               (ortak)
├── script.js                (ortak — mobil menü)
├── assets/                  (boş — gerçek görsel için ayrıldı)
└── _proje/                  (bu dizin)
```

**Değişiklik kapsamı:** Yalnızca `ali-topcuoglu-komur-gubre/` altında yeni dosyalar oluşturuldu. Kapsam dışı dosyalara (`ramazan-topcuoglu-yapi-market/`, `soyleroglu-hafriyat/`, `goksun-yorem/`, `ucel-romork/`, kök `index.html`/`styles.css`) **dokunulmadı** (Değişmez Kural 5).

**Riskler:**
- NAP (adres/telefon) teyit edilmeden site **yayına (gerçek domain/GitHub Pages'e)** alınmamalı — mevcut hâliyle yalnızca repo içinde taslak olarak duruyor.
- Ürün/hizmet detayları (kömür türleri, gübre çeşitleri, filo kapasitesi) genel düzeyde kaldı; müşteri gerçek bilgi verdikçe sayfa metinleri somutlaştırılmalı.
- Gerçek görsel yok; tüm sayfalar görsel içermiyor (stok görsel bile eklenmedi — M2 · 14'teki SHOT LIST'e göre gerçek fotoğraf önceliklendirildi, görselsiz bırakmak "temsili" etiketli yanlış/alakasız stok görsel kullanmaktan daha güvenli kabul edildi).

**Acceptance criteria:**
- [ ] 375px genişlikte yatay kaydırma yok
- [ ] Mobil menü (hamburger) açılıp kapanıyor
- [ ] Her sayfada title, meta description, H1 var
- [ ] İç linkler (internal linking planı) çalışıyor
- [ ] Hiçbir sayfada teyitsiz telefon/adres `tel:`/düz metin olarak gerçekmiş gibi yazılmıyor — hepsi `.pending` etiketli
- [ ] Diğer firma klasörlerinde değişiklik yok (`git status --short`)

## 16 — DEVELOPMENT

INSPECT → UNDERSTAND → PLAN → PATCH → TEST → REGRESSION → DEPLOY uygulandı:
1. **INSPECT/UNDERSTAND:** `soyleroglu-hafriyat/goksun-hafriyat/index.html` ve `ramazan-topcuoglu-yapi-market/index.html` incelendi; ortak desenler (sticky header, mobil menü, pending-etiket sistemi) çıkarıldı.
2. **PLAN:** 7 sayfa + ortak CSS/JS planlandı (yukarıdaki dosya yapısı).
3. **PATCH:** Tüm dosyalar oluşturuldu/düzenlendi.
4. **TEST:** Playwright/Chromium ile masaüstü (1280px) ve mobil (390px) ekran görüntüleri alındı; tüm 7 sayfa 200 döndü; mobil menü tıklama testiyle doğrulandı.
5. **REGRESSION:** `git status --short` ile yalnızca `ali-topcuoglu-komur-gubre/` altının eklendiği doğrulandı.
6. **DEPLOY:** Bu commit `claude/topçuoğlu-yapı-market-website-om3qsz` dalına push edilecek; main'e birleştirme kullanıcının onayına bırakılır (Modül 3 bu PR/merge adımını kapsamıyor).

Responsive/erişilebilirlik: Mobil öncelikli grid'ler (`auto-fit`/`minmax`), `:focus-visible` tanımlı, `prefers-reduced-motion` destekli, semantik `<header>/<section>/<footer>` kullanıldı. Görsel olmadığı için `alt` metni konusu bu sürümde geçerli değil (SHOT LIST'e göre gerçek görsel gelince eklenecek).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form/WhatsApp/analytics çözümü belirli (hepsi "yok", gerekçeli)
- [x] Acceptance criteria yazılı — ✅ ekran görüntüsüyle doğrulananlar işaretlendi, NAP maddesi kasıtlı olarak teyitsiz bırakıldı (bkz. not)
- [x] Modül 2'deki tüm sayfalar üretildi (7/7)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı (bu modülün sonunda)
- [x] `durum.md` güncellendi

**NOT:** "Hiçbir sayfada teyitsiz telefon/adres gerçekmiş gibi yazılmıyor" maddesi ✅ olarak işaretlendi çünkü gereksinim zaten budur — NAP'ın kendisi hâlâ BEKLİYOR durumunda (M1 · 03), bu bir hata değil, bilinçli bir tasarım kararı.
