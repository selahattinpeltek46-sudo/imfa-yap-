# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Önce oku: `<firma>/_proje/modul-1-strateji.md`, `<firma>/_proje/modul-2-icerik-seo.md`
Çıktı: site dosyaları (`<firma>/` altında) + `<firma>/_proje/modul-3-gelistirme.md`

## 15 — TECH STACK & DEVELOPMENT PLAN
- **Mevcut sistem:** Repo GitHub Pages ile derlemesiz yayınlanıyor (`.github/workflows/deploy-pages.yml`, repo kökü yayınlanır). Mevcut siteler statik HTML/CSS/JS.
- **Varsayılan teknoloji:** statik HTML + CSS + vanilla JS. Başka bir teknoloji (Next.js, WordPress vb.) yalnızca somut gerekçeyle ve yayın altyapısı etkisi yazılarak seçilir.
- **Entegrasyonlar:** WhatsApp → `https://wa.me/90XXXXXXXXXX?text=...` tıkla-yaz linki (varsayılan; Business API gerekmez). Form → statik sitede sunucu yok; Formspree / Web3Forms benzeri servis veya WhatsApp'a yönlendirme — seçimi ve riskini yaz. Analytics → Modül 2 ölçüm planı.
- **Dosya yapısı:** `<firma>/index.html`, sayfa başına klasör (`<firma>/<sayfa>/index.html`), `images/`, ortak css/js. Mevcut sitelerin yapısına uy.
- **Riskler** ve **değişiklik kapsamı** (hangi dosyalar oluşur / değişir; kapsam dışı dosyalara dokunulmaz).
- **Acceptance criteria:** ölçülebilir maddeler (ör. 375px'te yatay kaydırma yok, tüm CTA'lar çalışıyor, her sayfada title/meta/H1 var).

## 16 — DEVELOPMENT
INSPECT → UNDERSTAND → PLAN → PATCH → TEST → REGRESSION → DEPLOY
- Kod sohbete yapıştırılmaz; dosyalara yazılır.
- Responsive (mobil öncelikli), semantik HTML, erişilebilir (alt metin, kontrast, klavye), hızlı (görseller optimize, lazy-load).
- Metinler Modül 2'deki nihai metinlerle birebir; schema, meta ve ölçüm kodları eklenir.
- Tarayıcıda (Playwright / Chromium) desktop ve mobil ekran görüntüsüyle kontrol et.
- **Regression:** Diğer firma klasörleri ve kök site değişmedi (`git diff --stat` ile doğrula).
- Commit + push; main'e birleştirme PR ile.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [ ] 15 ve 16 başlıkları dosyada var
- [ ] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [ ] Acceptance criteria yazılı ve her biri test edildi
- [ ] Modül 2'deki tüm sayfalar üretildi
- [ ] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [ ] Kapsam dışı dosyalarda değişiklik yok
- [ ] Commit + push yapıldı
- [ ] `durum.md` güncellendi
