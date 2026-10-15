# 🟡 MODÜL 3 — TEKNOLOJİ VE GELİŞTİRME (15–16)

Proje: Beyoğlu Erkek Kuaförü · Girdi: `modul-1-strateji.md`, `modul-2-icerik-seo.md` · Tarih: 2026-10-15

---

## 15 — TECH STACK & DEVELOPMENT PLAN

- **Mevcut sistem:** GitHub Pages, derlemesiz; `_proje/` klasörleri yayından hariç (Jekyll alt çizgili klasörleri yayımlamaz).
- **Eski taslak:** tek HTML dosyası, 748 KB (12 JPEG base64 gömülü), form verisi hiçbir yere gitmiyordu. `_proje/kaynak/eski-taslak.html` olarak arşivlendi.
- **Teknoloji kararı:** Statik HTML + tek CSS + vanilla JS (bağımlılık yok). Gerekçe: 2 sayfa, sunucu gerekmiyor; `barber-ugur` ve `barbers-town` ile aynı mimari → bakım ve randevu şablonu ortak.
- **Üretim:** `index.html`, `_proje/kaynak/index.sablon.html` + `olustur.py` ile üretilir. SSS metni tek yerde tutulur; sayfadaki liste ile FAQPage JSON-LD her zaman aynı kalır. WhatsApp/Haritalar bağlantıları script'te kodlanır (elle URL kodlama hatası olmaz).
- **Yazı tipleri:** Taslaktaki Oswald + Inter + IBM Plex Mono korundu (Google Fonts; çerez bırakmaz, IP aktarımı KVKK metninde).
- **Entegrasyonlar:**
  - Randevu → `barber-ugur` şablonu (SYSTEM LEARNING): Google Apps Script + Google Takvim + E-Tablo + 2 saat önce hatırlatma. `js/ayarlar.js → randevuApi` boşken form **WhatsApp moduna** düşer. Uyarlama: 4 hizmet (Saç Kesimi 30 · Sakal Tıraşı 30 · Saç & Sakal 50 · Çocuk Kesimi 25 dk), `koltuk: 2`, her gün 10:00–21:00 [VARSAYIM], kod öneki `BEK-`. Cilt bakımı ve saç boyama randevuya açılmadı ("Sorun" → WhatsApp).
  - WhatsApp → `wa.me/905355089722?text=…` (her CTA'ya özel mesaj; İngilizce bölümde İngilizce mesaj; JS'siz de çalışır).
  - Harita → tıklayınca yüklenen iframe (adres sorgusuyla); yol tarifi ve profil bağlantısı `maps/dir` + `maps/search` adres sorgusuyla (koordinat/cid bilinmiyor).
  - Analytics → kurulmadı; `data-olay` + `olay()` hazır.
- **Dosyalar (yalnız yeni, hepsi `beyoglu-erkek-kuaforu/` altında):** `index.html` · `css/site.css` · `js/ayarlar.js` · `js/site.js` (barber-ugur'dan uyarlandı) · `kvkk/index.html` · `img/` (salon, avize, firca, fade .webp + og.jpg) · `sitemap.xml` · `_proje/*` (modül çıktıları, randevu sistemi, kaynak/şablon, test). Kök site ve diğer firma klasörlerine dokunulmaz.
- **Riskler:** WhatsApp aktifliği teyitsiz; saatler bilinmiyor ("24 saat açık" kaydı); fotoğraf kullanım hakkı belirsiz (yalnız kişisiz kırpımlar); randevu sistemi salonun Google hesabında kurulana kadar WhatsApp modu.
- **Acceptance criteria:**
  1. 375 / 820 / 1366 px'te `scrollWidth - innerWidth = 0` (ana sayfa + KVKK)
  2. Tek H1; title ≤60; meta ≤155; canonical; 2 JSON-LD parse ediliyor
  3. Tüm WhatsApp linkleri `905355089722` + hazır mesaj
  4. Form hizmetleri = `Code.gs` hizmetleri; hizmet bağlantısı formda hizmeti önceden seçer
  5. Boş gönderim → 6 alan hatası; WhatsApp modunda ad/telefon/hizmet/gün/saat/not içeren mesaj
  6. API modu: kod ekranı + .ics (120 dk alarm, CRLF); 2 koltuk dolunca çakışan saatler düşer; eşzamanlı dolumda "az önce doldu"; sunucu çökünce WhatsApp modu
  7. FAQ JSON-LD = sayfada görünen sorular; API'ye bağlı "hatırlatma" sorusu WhatsApp modunda gizli ve JSON-LD'de yok
  8. Harita yalnız tıklamayla; konsol hatası 0; alt metinsiz / kırık `<img>` 0
  9. Metin kontrastı ≥ 4.5:1 (ana metin ve bağlantılar)
  10. `git status` yalnız `beyoglu-erkek-kuaforu/` + `SKILL.md`

## 16 — DEVELOPMENT

INSPECT (eski taslak, barber-ugur yapısı ve randevu şablonu) → UNDERSTAND (tek sayfa + KVKK) → PLAN (15) → PATCH → TEST → REGRESSION → DEPLOY.

**Test sonuçları (`_proje/test/e2e.cjs`, Playwright / Chromium; 43 kontrol):**
| # | Kriter | Sonuç |
|---|---|---|
| 1 | Yatay taşma masaüstü / tablet / mobil / KVKK ×2 | 0 / 0 / 0 / 0 / 0 ✅ |
| 2 | H1 = 1; title 51; meta 140; JSON-LD BarberShop + FAQPage | ✅ |
| 3 | 8 WhatsApp linki doğru numara + mesaj | ✅ |
| 4 | Form ↔ Code.gs hizmet adları; `data-hizmet` ön seçim | ✅ |
| 5 | Boş gönderim 6 hata; mesaj: `Ad: Ali Veli / Telefon: 05321112233 / Hizmet: Sakal Tıraşı / Gün: 16 Ekim Cuma / Saat: 10:00 / Not: yanlar kısa · Davut Abi`; yedek saatler 10:00…20:00 | ✅ |
| 6 | API (sahte sunucu = gerçek Code.gs fonksiyonları): kod `BEK-…`; .ics alarm/adres/CRLF; aynı saate 2. randevu; 3.'de 10:45–11:15 düştü (10:30 ve 11:30 açık); "az önce doldu"; sunucu çökük → WhatsApp modu | ✅ |
| 7 | FAQ JSON-LD = 7 görünen soru; hatırlatma sorusu WA modunda gizli, API modunda görünür | ✅ |
| 8 | Harita tıklamayla; konsol hatası 0; resimler yüklü ve alt metinli; Oswald + Inter yüklü | ✅ |
| 9 | Kontrast: metin/duvar 5.55, mürekkep/duvar 8.55, sis/koyu 7.75, altın/koyu 7.5, ahşap/duvar 5.28 | ✅ |
| 10 | Kapsam | ✅ (bkz. Modül 4) |
| — | Code.gs birim testleri (7 madde: son başlangıç 20:00, Pazar açık, KAPALI blok, +90 temizleme, kapalı hizmet reddi, hatırlatma metni) | ✅ |

Test sırasında düzeltilenler:
- Test beklentisi hatası: 30 dk'lık kesimde 11:00 randevusu 10:30 ve 11:30 başlangıçlarıyla çakışmaz; beklenti düzeltildi (site davranışı doğruydu).
- Ekran görüntüsü kontrolünden: masaüstünde Salon bölümünde büyük boşluk → Usta bloğu fırça fotoğrafının altına (grid alanı) taşındı; tablette avize metnin yanına alındı; randevu kartında koyu tema yüzünden onay kutusu koyu görünüyordu → karta `color-scheme: light`; alt bilginin 120 px alt boşluğu yalnız mobile (sabit bar) bırakıldı; ahşap vurgu rengi koyulaştırıldı (kontrast 3.8 → 5.28).
- Randevu sonucu ekran görüntüsü yumuşak kaydırma sırasında alınmıştı (başlık menünün altında görünüyordu); ölçümle doğrulandı: kaydırma bitince sonuç kutusu menünün 100 px altında. Teste bekleme eklendi.

Ekran görüntüsü kontrolü: masaüstü (1366), tablet (820), mobil (375) tam sayfa incelendi; mobil sabit alt bar (Randevu · WhatsApp · Ara) içerikle çakışmıyor.

**Taslağa göre ölçülebilir fark:** sayfa ağırlığı 748 KB tek HTML → HTML 28 KB + görseller 86 KB (WebP) + CSS/JS; çalışmayan form → çalışan WhatsApp/online randevu; SEO etiketi yok → title, meta, canonical, OG, 2 JSON-LD, sitemap.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (ana sayfa + KVKK)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı (+ tablet)
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı (Modül 4 sonunda, tek commit)
- [x] `durum.md` güncellendi
