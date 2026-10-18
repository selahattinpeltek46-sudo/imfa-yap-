# Dijital Otorite — MODÜL 3: Teknoloji ve Geliştirme (15–16)

## 15 — TECH STACK & DEVELOPMENT PLAN
- **Teknoloji:** Statik HTML + CSS + vanilla JS (repo standardı; GitHub Pages, derlemesiz). Framework gerekçesi yok.
- **Fontlar:** Google Fonts — Barlow Condensed (başlık, Instagram tasarımlarıyla aynı), IBM Plex Sans (gövde), IBM Plex Mono (etiket).
- **WhatsApp:** `https://wa.me/905393009565?text=…` (hazır mesajlı). Numara kullanıcı onaylı — tek yerde değil, `index.html` (oluşturucu sabiti) + `assets/site.js` (`WA`).
- **Form:** Sunucu yok → doğrulama + WhatsApp özet mesajı (SYSTEM LEARNING: goksun-yorem). Metin verinin nereye gittiğini açıkça söyler. Aşama 5'te `site.js` içindeki gönderim bir n8n webhook'una (`fetch POST`) bağlanacak; WhatsApp yedek olarak kalacak.
- **Analytics:** Yok (çerez banner'ı gerekmesin). `data-olay` kancaları + `window.dataLayer` varsa olay itilir.
- **Dosya yapısı:** `dijital-otorite/index.html`, `kvkk/index.html`, `assets/site.css`, `assets/site.js`, `img/` (webp + og.jpg).
- **Değişiklik kapsamı:** Yalnız `dijital-otorite/` + `.github/workflows/deploy-pages.yml`'e 1 satır (iç içerik dosyalarını — MARKA.md, takvim, ham görseller, videolar — yayından hariç tutmak için). Diğer siteler ve kök dosyalar değişmedi.
- **Riskler:** Yayın yalnız `main` dalından (PR birleşince) · numara onayı · referans sitelerin canlılığı (konteynerden doğrulanamıyor).

**Acceptance criteria**
1. 375 px ve 1366 px'te yatay taşma = 0
2. Tek H1, title ≤ 60, meta ≤ 155, canonical, geçerli JSON-LD (ProfessionalService + FAQPage)
3. Tüm iç çapa linkleri hedef buluyor; KVKK sayfası 200
4. Form boş gönderimde 4 hata mesajı, dolu gönderimde doğru numaraya doğru hazır mesaj
5. Tüm görseller yükleniyor, hepsinde alt metin
6. Konsol hatası yok
7. `prefers-reduced-motion` ile animasyon kapalı

## 16 — DEVELOPMENT
INSPECT (repo siteleri, deploy workflow) → PLAN (M2) → PATCH (dosyalar) → TEST (Playwright, Chromium):
| Kriter | Sonuç |
|---|---|
| 1 Taşma | ✅ mobil 0 · masaüstü 0 · KVKK 0 |
| 2 SEO etiketleri | ✅ title 51, meta 131, 1 H1, schema parse OK |
| 3 Linkler | ✅ kırık çapa yok, kvkk/ 200, og.jpg 200 |
| 4 Form | ✅ 4 hata mesajı; mesaj: "RÖNTGEN başvurusu / Ad / İşletme / Sektör / İstek" → wa.me/905393009565 |
| 5 Görseller | ✅ kırık yok (ilk testte `height` özniteliği oranı bozuyordu → `img{height:auto}` ile düzeltildi), alt eksik 0 |
| 6 Konsol | ✅ hata yok |
| 7 Hareket | ✅ CSS'te reduced-motion kuralı |
Ekran görüntüleri: masaüstü 1366 + mobil 375 tam sayfa incelendi.
**Regression:** `git diff --stat` → `dijital-otorite/` dışında yalnız deploy-pages.yml (+1 satır).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (ana sayfa + KVKK)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok (workflow satırı gerekçeli)
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
