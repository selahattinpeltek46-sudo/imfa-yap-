# Osmanoğlu Mobilya — Modül 3: Teknoloji ve Geliştirme (15–16)

## 15 — TECH STACK & DEVELOPMENT PLAN

- **Mevcut sistem:** Repo GitHub Pages ile derlemesiz yayınlanıyor; `_proje` klasörleri yayından çıkarılıyor (`_config.yml` + `deploy-pages.yml`). Yeni bir dışlama gerekmedi.
- **Teknoloji:** statik HTML + CSS + vanilla JS. 4 sayfanın ortak parçaları `_proje/uret.py` ile tek kaynaktan üretilir, metinler `_proje/icerik.py`'de. Çıktı düz HTML; yayın derlemesiz kalır.
- **Yazı tipleri:** Bricolage Grotesque (başlık, değişken) + Figtree (metin), woff2 olarak gömülü (`npm pack @fontsource-variable/...`) → harici istek ve çerez yok.
- **Hero:** CSS `clip-path` ile çekmece geçişi + `transform: scale` yakınlaşma + sırayla gelen detay etiketleri; JS yalnız slayt sırası, ilerleme göstergesi, Durdur ve etiket konumlaması (object-fit: cover kırpmasına göre piksel hesabı). Karartma katmanı, gradyan, `filter`, `backdrop-filter` yok.
- **Entegrasyonlar:** WhatsApp → `wa.me/905321770619?text=…` (her bağlantının kendi hazır mesajı; numara `js/ayarlar.js`'ten tek yerden değişir). Form → sunucu yok; mesaj hazırlayıcı veri toplamaz, WhatsApp metni üretir + panoya kopyalar. Harita → tıklayınca yüklenen iframe. Analytics → yok; olaylar `dataLayer`'da (Modül 2 / 13).
- **Dosya yapısı:**
  ```
  osmanoglu-mobilya/
    index.html · mutfak-dolabi/ · vestiyer-gomme-dolap/ · karavan-mobilyasi/ · sitemap.xml
    css/site.css · js/ayarlar.js · js/site.js · fonts/ (4 woff2) · img/ (8 webp + og.jpg + ikonlar)
    _proje/  (yayınlanmaz: modül raporları, icerik.py, uret.py, og.html, kaynak/, testler/)
  ```
- **Riskler:** düşük çözünürlüklü kaynak kareler (Modül 2 / 14); WhatsApp kaydı doğrulanmadı; Haritalar bağlantısı `cid` yerine ad araması (cid bilinmiyor).
- **Değişiklik kapsamı:** yalnız `osmanoglu-mobilya/` (yeni) ve `.claude/skills/selahattin-ai/SKILL.md` (System Learning). Kök site ve diğer firma klasörlerine dokunulmadı.

**Acceptance criteria** (hepsi `testler/test.js` ile otomatik; 1440, 820, 375 px)
1. Hero yüksekliği ≥ ekran − üst çubuk (tam boy).
2. Hero sahnesinde `filter` / `backdrop-filter` yok ve fotoğrafı kaplayan renkli/gradyan katman yok (testin bunu yakaladığı yapay katmanla doğrulandı: 2 öğe yakalandı).
3. Her fotoğraflı hero'da ≥ 2 görünür detay etiketi; hiçbiri sahneden taşmıyor.
4. Slayt kendiliğinden ilerliyor; kanal düğmesi slayta gidiyor; Durdur çalışıyor (karşıt kontrol); `prefers-reduced-motion`'da otomatik geçiş yok.
5. Her sayfada title ≤ 60, meta 70–155, tek H1, canonical canlı adres, geçerli JSON-LD (aggregateRating yok).
6. Yatay taşma 0; kırık görsel 0; boş alt metin 0; konsol hatası 0; 4xx/5xx yok.
7. Harita tıklanmadan dış alan adına istek yok.
8. Tüm WhatsApp bağlantıları `wa.me/905321770619?text=`; tüm tel bağlantıları `tel:+905321770619`; NAP her sayfada.
9. Mesaj hazırlayıcı: sayfaya göre tür ön seçili; önizleme = gönderilen metin.
10. Mobil menü açılır / Esc ile kapanır; tüm iç bağlantılar ve çapalar 200.
11. Kaydırınca beliren bölümlerin hepsi görünür hâle geliyor.

### v2 revizyonu (2026-10-20, kullanıcı: "basit duruyor, Babacan Mobilya seviyesinde olsun")
- Referans: `selahattinpeltek46-sudo/babacan-mobilya` (salt okunur klon) masaüstünde bölüm bölüm incelendi.
- **12 sayfa** (`uret.py` bileşenleri: hero, hero_duz, güven şeridi, ihtiyaç, ilkeler, çözümler, foto CTA, süreç, işçilik, projeler, yorumlar, iletişim, SSS, CTA bandı, mesaj hazırlayıcı, numaralı liste, makale).
- **Yazı tipleri:** Bodoni Moda (normal + italik) + Albert Sans, woff2 gömülü; eski Bricolage / Figtree kaldırıldı.
- **Hero:** kenardan kenara fotoğraf + krem kart; geniş ekran kırpması için `ODAK` (object-position y) ve etiketlerin bu odakla hesaplanması; kartın / kontrolün altında kalan etiket gizlenir.
- **Mobil:** tam ekran menü, alt sabit WhatsApp / Ara çubuğu; masaüstünde kayan WhatsApp düğmesi.
- **Ek kabul kriterleri:** 12 sayfa × 3 genişlik; fotoğraflı 5 hero'da ≥ 2 görünür etiket ve hiçbiri kart / kontrol altında değil. Sonuç: **719/719**.

## 16 — DEVELOPMENT

INSPECT → UNDERSTAND → PLAN → PATCH → TEST → REGRESSION → DEPLOY

- **Inspect:** iki ekran kaydı 4 fps'de kareye bölündü, sahne başına en keskin kare kenar varyansıyla seçildi; "Film 1" yazılı ve imleçli kareler atlandı.
- **Patch:** `uret.py` 4 sayfa + sitemap üretir; `uret.py --metin` Modül 2 / 12'yi aynı kaynaktan yazar.
- **Geliştirme sırasında bulunup düzeltilenler:** (1) etiketler `%` ile konumlanınca `object-fit: cover` kırpması yüzünden mobilde yanlış noktayı gösteriyordu → JS ile görüntü koordinatından piksel hesabı; (2) etiketler yakınlaşma animasyonunda kayıyordu → fotoğraf ve etiketler aynı `.kare` içinde birlikte ölçekleniyor; (3) mobilde alttaki etiket gösterge plakasının altında kalıyordu → konum + "dışarıda" eşiği; (4) sağ kenara yakın etiket daralıp 3 satıra kırılıyordu → `width: max-content`; (5) antre karesinde çöp poşeti → kırpıldı; (6) SSS işareti açıkken "−" kapalıyken "|" idi → "+ / −".
- **Test:** `node osmanoglu-mobilya/_proje/testler/test.js` → **268/268**. Ekran görüntüsü: `testler/ekran.js` (1440 + 375; ilk ekran ve tam sayfa), 4 sayfa gözle kontrol edildi.
- **Regression:** `git status` yalnız `osmanoglu-mobilya/` ve SKILL.md'yi gösteriyor.
- **Deploy:** `claude/youthful-cray-4utyhy` dalına commit + push; main'e birleştirme PR ile (kullanıcı onayıyla).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 3
- [x] 15 ve 16 başlıkları dosyada var
- [x] Teknoloji kararı gerekçeli; form / WhatsApp / analytics çözümü belirli
- [x] Acceptance criteria yazılı ve her biri test edildi
- [x] Modül 2'deki tüm sayfalar üretildi (v2: 12/12)
- [x] Desktop + mobil ekran görüntüsü kontrolü yapıldı
- [x] Kapsam dışı dosyalarda değişiklik yok
- [x] Commit + push yapıldı
- [x] `durum.md` güncellendi
