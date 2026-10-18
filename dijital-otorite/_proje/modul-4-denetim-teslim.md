# Dijital Otorite — MODÜL 4: Denetim, QA, Teslim, Öğrenme (17–22)

## 17 — EVALUATION
Doğruluk ✅ (referans açıklamaları repodaki sitelerle birebir) · Context ✅ (Instagram'la aynı marka, RÖNTGEN akışı) · Marka ✅ · UX ✅ (mobil sabit bar, tek birincil CTA) · Conversion ✅ (3 seviyeli CTA) · SEO ✅ · Visual ✅ (Amca + gerçek ekran görüntüleri) · Technical ✅ · Accessibility ✅ (alt metin, odak halkası, label'lar, aria-invalid) · Performance ✅ (webp, lazy-load, JS < 3 KB) · Evidence ⚠️ (aşağıda).

## 18 — AUDIT
| # | Sınıf | Önem | Konum | Bulgu |
|---|---|---|---|---|
| A1 | TECHNICAL | YÜKSEK | deploy-pages.yml | `dijital-otorite/` altındaki iç dosyalar (MARKA.md, takvim, ham görseller, videolar) yayına çıkacaktı |
| A2 | CONTEXT | YÜKSEK | index.html, site.js | WhatsApp numarası kullanıcı onayı almadı [VARSAYIM] |
| A3 | TECHNICAL | ORTA | site.css `img` | `height` özniteliği `aspect-ratio`'yu ezip Amca yüzlerini uzatıyordu |
| A4 | SEO | DÜŞÜK | index.html og:image | webp önizleme görseli bazı uygulamalarda (WhatsApp) görünmeyebilir |
| A5 | EVIDENCE | ORTA | #isler | soylerogluhafriyat.com ve GitHub Pages linklerinin canlılığı konteynerden doğrulanamadı |
| A6 | EVIDENCE | ORTA | #isler | İMFA Yapı'nın Dijital Otorite işi olduğu repo kökünden çıkarıldı [VARSAYIM] |
| A7 | CONTEXT | DÜŞÜK | #hakkimda | "dükkânına gelirim" [VARSAYIM] |
| A8 | EVIDENCE | DÜŞÜK | #isler | Müşteri adlarının sitede gösterilmesi izni önce/sonra iznine dayanıyor [VARSAYIM] |

## 19 — REVISION
- A1 ✅ Workflow'a iç dosyaları hariç tutan 1 satır eklendi (site için gerekenler `index.html`, `kvkk/`, `assets/`, `img/` yayında kalır).
- A3 ✅ `img{height:auto}`; yeniden test: yüzler yuvarlak, kırık görsel yok.
- A4 ✅ `img/og.jpg` (1200×630) + boyut etiketleri.
- A2 ✅ Kullanıcı numarayı onayladı (2026-10-18).
- A5–A8 ⏳ Kullanıcı onayı gerekiyor → Handoff.

## 20 — FINAL QA
- [x] Desktop görünüm
- [x] Mobil görünüm (375px, yatay kaydırma yok)
- [x] Tüm iç linkler çalışıyor · [ ] dış linkler ⚠️ konteynerden doğrulanamadı (A5)
- [x] Tüm CTA'lar doğru hedefe gidiyor
- [x] WhatsApp linki doğru numara ve hazır mesajla açılıyor (numara onayı A2)
- [x] Form WhatsApp'a doğru mesajı üretiyor
- [x] Görseller yükleniyor, alt metinleri var; illüstrasyonlar açıkça çizgi film
- [x] Her sayfada title, meta description, tek H1, canonical; schema geçerli
- [x] İçerik: yazım, kanıtsız iddia yok (TÜİK verisi kaynaklı)
- [x] NAP tüm sayfalarda aynı
- [x] KVKK metni (şablon, hukuki kontrol gerekir); çerez banner'ı gerekmez (analytics yok)
- [x] Ölçüm kancaları (`data-olay`) yerinde; GA4 yok
- [x] Regression: diğer siteler etkilenmedi

## 21 — HANDOFF
**Yapılanlar:** Tek sayfa site (hero, teşhis, süreç, 5 gerçek iş, 3 paket, hakkımda, Röntgen formu, SSS) + KVKK sayfası · SEO etiketleri, schema, OG görseli · iç dosyaların yayından hariç tutulması.
**Yapılmayanlar:** Fiyatlar · logo · Selahattin fotoğrafı · GA4 · Google Business profili · alan adı · n8n bağlantısı (Aşama 5) · yayın (main'e birleştirme PR ile).
**Doğrulananlar:** Referans sitelerin içerikleri (repo), TÜİK oranı (iki haber kaynağı), IG profili.
**Varsayımlar:** A6, A7, A8.
**Kalan riskler:** Numara yanlışsa birincil CTA boşa düşer · canlı linkler.
**Dosyalar:** `dijital-otorite/index.html`, `kvkk/index.html`, `assets/site.css`, `assets/site.js`, `img/*`, `.github/workflows/deploy-pages.yml` (+1 satır), `_proje/modul-1..4`, `durum.md`.
**Bakım:** Yeni müşteri sitesi bittikçe `#isler`'e kart ekle (telefon ekran görüntüsü 520×1125 webp) · Google Business profili aç ve NAP'ı aynı yaz · alan adı alınınca canonical/og/schema URL'lerini güncelle.
**Kullanıcıdan beklenenler:** İMFA Yapı ve diğer müşterilerin isim/link izni · logo · fiyat kararı · alan adı · yayına almak için PR onayı.

## 22 — LEARNING / SYSTEM UPDATE
SKILL.md SYSTEM LEARNING'e eklendi (3 madde).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [x] Tüm KRİTİK / YÜKSEK audit bulguları düzeltildi (A2 kullanıcı onayına bağlı, handoff'ta)
- [x] Final QA listesinde ❌ kalmadı (⚠️ dış linkler handoff'ta)
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING güncellendi
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti sunuldu
