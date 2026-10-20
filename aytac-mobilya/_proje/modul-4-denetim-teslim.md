# 🔴 MODÜL 4 — DENETİM, FINAL QA, TESLİM VE ÖĞRENME (17–22)

Proje: **Aytaç Mobilya** · Okundu: modül 1–3 çıktıları + `aytac-mobilya/` site dosyaları · Tarih: 2026-10-20

## 17 — EVALUATION

| Eksen | Sonuç |
|---|---|
| Doğruluk | NAP, plus code, puan/yorum sayısı kart ekran görüntüsüyle birebir. Fotoğraflar firmanın kendi hesabından. |
| Context uyumu | Kullanıcı hedefleri: modern ✔ · güven veren (adres, 131 yorum, rötuşsuz gerçek kareler, kaynak açıklaması) ✔ · stok fotoğraf yok ✔ · kalite (detayları adlandıran işaretli fotoğraflar) ✔ · güçlü SEO (5 niyet sayfası + şema + sitemap) ✔ · yapay zekâ hissi yok (aşağıda) ✔ |
| Marka | Renkler logodan (lacivert) ve işlerden (mat lake, meşe, LED kehribarı) türetildi; logo olduğu gibi kullanıldı, yeniden çizilmedi. |
| "Yapay zekâ görünümü" kontrolü | İkonlu kart ızgarası yok, bölüm başı eyebrow yok, 3'lü "neden biz" yok, büyük puan kutusu yok (puan tek cümle), siyah+altın yok, sistem fontu yok, "hayalinizdeki / kaliteli / profesyonel" yok. İmza öğeler işin kendisinden: dolap kapağı derzi, boy kulpu, dolap altı LED çizgisi, şerit metre, fotoğraf üstü teknik not etiketleri. |
| UX | Her sayfada tek ana eylem; hizmet sayfasında iş türü önceden seçili; mobilde sabit "Fotoğraf gönder" (mesaj bölümünde gizleniyor). |
| Conversion | Birincil CTA çalışıyor ama şimdilik Instagram DM'ye gidiyor (numara yok). |
| SEO | 7 benzersiz title/meta/H1; Service + FAQ + Breadcrumb + işletme şeması; iç link planı uygulandı. |
| Visual | 41 gerçek kare; en büyük gösterim ≈360 px (doğal çözünürlük 347 px). |
| Technical | Statik, derlemesiz; konsol hatası 0; kırık link 0. |
| Accessibility | Atlama linki, odak halkası, alt metinler, aria-pressed/expanded, `<dialog>`, `prefers-reduced-motion`. |
| Performance | HTML 21 KB, CSS 20 KB, JS 7 KB; fotoğraf ort. 15 KB (WebP); 1 yazı tipi önyüklemesi; görseller tembel yükleme. |
| Evidence | Aşağıdaki denetimde 3 çıkarım bulunup düzeltildi. |

## 18 — AUDIT

| # | Sınıf | Önem | Konum | Bulgu | Durum |
|---|---|---|---|---|---|
| 1 | CONVERSION | **KRİTİK** | `js/ayarlar.js` | Telefon/WhatsApp numarası yok; birincil CTA WhatsApp yerine Instagram DM | Müşteri girdisine bağlı — geçici çözüm çalışıyor (IG DM + panoya kopyalama) |
| 2 | EVIDENCE | YÜKSEK | `isler/` giriş | "Hepsi müşteri evlerinden" — galeride mağaza, ofis ve olası showroom kareleri var | ✅ düzeltildi |
| 3 | EVIDENCE | YÜKSEK | Ana sayfa "Yakından bakın" | "Bu mutfak bir müşterimizin evinden" — çıkarım | ✅ düzeltildi |
| 4 | EVIDENCE | ORTA | Konum bloğu | "Ölçü ve montaj için dışarıda olabiliyoruz" — doğrulanmamış çalışma düzeni | ✅ kaldırıldı |
| 5 | VISUAL / TECHNICAL | YÜKSEK | Tüm fotoğraflar | 347 px ekran kaydı kareleri; retina ekranda yumuşak | Müşteri girdisine bağlı (orijinaller) — tasarım büyütmüyor |
| 6 | EVIDENCE | ORTA | Görsel kullanım hakkı | Firmanın kendi Instagram'ı ama yazılı onay yok | Teslimde onay istenecek |
| 7 | SEO | ORTA | Google Business | Web sitesi alanı Instagram'a gidiyor; site yayına çıkınca bu alana site adresi yazılmalı | Müşteri/ajans aksiyonu |
| 8 | ACCESSIBILITY | DÜŞÜK | `css/site.css` `.alan small` | Koyu zeminde küçük metin kontrastı ≈4,2:1 | ✅ #a2a6ae (≈6:1) |
| 9 | UX | DÜŞÜK | `js/site.js` | Pano izni reddedilirse Instagram açılır ama metin kopyalanmamış olur, kullanıcıya ayrı uyarı yok | Not edildi — numara gelince bu yol devre dışı kalır |
| 10 | SEO | DÜŞÜK | `sitemap.xml` | Kök `robots.txt` yok; sitemap Search Console'a elle gönderilmeli | Handoff'ta |
| 11 | CONTEXT | DÜŞÜK | Çalışma saatleri | Yalnız "bugünkü saat Haritalar'da" — haftalık saat bilinmiyor | Müşteri girdisine bağlı |

Yanlış/uydurma bilgi (HALLUCINATION) taraması: fiyat, garanti, süre, yıl, malzeme markası, ekip sayısı, semt-proje eşleşmesi — **hiçbiri sitede yok**. Rakip adı sitede yok.

## 19 — REVISION
- KRİTİK #1: koddaki her şey hazır; numara gelince **tek satır** (`js/ayarlar.js`) + JSON-LD'ye `telephone` (`uret.py` → `isletme()`), yeniden üret. Bu, müşteriden gelecek bilgiye bağlı olduğu için ❌ olarak devrediliyor.
- YÜKSEK #2, #3 ✅ (`uret.py` + `modul-2` metni güncellendi, sayfalar yeniden üretildi). #5 müşteri girdisi.
- ORTA #4 ✅, #6–#7 handoff.
- DÜŞÜK #8 ✅; #9–#11 not edildi.
- Düzeltmelerden sonra `test.js` ve `etkilesim.js` yeniden koşturuldu: **ikisi de geçti**.

## 20 — FINAL QA

- [x] Desktop görünüm (1366 px, ekran görüntüsüyle)
- [x] Mobil görünüm (375 px, yatay kaydırma 0 — 7 sayfa)
- [x] Tüm iç ve dış linkler çalışıyor (iç: 0 kırık; dış: Instagram, ig.me, Haritalar arama/yol tarifi)
- [x] Tüm CTA'lar doğru hedefe gidiyor (#mesaj; gönder → ig.me / wa.me)
- [ ] ❌ WhatsApp linki doğru numara ve hazır mesajla açılıyor — **mekanizma test edildi (sahte numarayla wa.me + metin ✔), gerçek numara yok**
- [x] Formlar — form yok; mesaj hazırlayıcı metni doğru üretiyor, panoya kopyalıyor
- [x] Görseller yükleniyor, alt metinleri var; temsili görsel yok
- [x] Her sayfada title, meta description, tek H1, canonical; JSON-LD geçerli JSON
- [x] İçerik: yazım kontrolü, kanıtsız iddia yok (18'de 3 çıkarım temizlendi)
- [x] NAP tüm sayfalarda aynı (tek kaynaktan üretiliyor); telefon eklenince yine tek kaynak
- [x] KVKK / çerez — veri ve çerez yok → gerekmez (alt bilgide gizlilik notu)
- [x] Ölçüm olayları dataLayer'a düşüyor (test: `instagram_tikla`)
- [x] Regression: yalnız `aytac-mobilya/` değişti

## 21 — HANDOFF

**Yapılanlar**
- Analiz: Modül 1 (strateji, 3 segment, rakip türleri, mesaj ve teklif zinciri, CTA hiyerarşisi) ve Modül 2 (IA, nihai metinler, SEO tablosu, şema planı, görsel sınıflama, SHOT LIST).
- Site: 7 sayfa (`/`, `/mutfak-dolabi/`, `/gardirop/`, `/banyo-dolabi/`, `/vestiyer/`, `/tv-unitesi-kitaplik/`, `/isler/`), sitemap, OG görseli, favicon.
- Instagram ekran kaydından 96 tekil paylaşım ayıklandı, 41'i seçildi.
- Testler: `_proje/testler/` (Playwright).

**Yapılmayanlar**
- Telefon/WhatsApp entegrasyonu (numara yok) · GA4 (çerez onayı gerektirir; kararı müşteriye) · Hakkımızda/blog (bilgi yok) · eski showroom ürünleri (imalat olduğu belirsiz) · önce/sonra bölümü (eşleşme belirsiz) · kök portföy sayfasına ekleme (kapsam dışı) · main'e birleştirme (PR kullanıcı isteyince).

**Doğrulanan bilgiler:** ad, adres, plus code, kategori, 5,0/131 (20.10.2026), Instagram hesabı ve bio, iş türleri.
**Varsayımlar:** Ankara geneline hizmet; fotoğrafların sitede kullanım izni; hizmet listesinin fotoğraflardaki işlerle sınırlı olduğu.
**Kalan riskler:** numara yok (KRİTİK) · fotoğraf çözünürlüğü · kullanım izni · haftalık saatler.

**Dosya listesi:** `index.html` · `{mutfak-dolabi,gardirop,banyo-dolabi,vestiyer,tv-unitesi-kitaplik,isler}/index.html` · `css/site.css` · `js/ayarlar.js` · `js/site.js` · `img/` (41 WebP + logo, favicon, apple-touch-icon, og.jpg) · `fonts/` (6 woff2) · `sitemap.xml` · `_proje/` (modül 1–4, durum, uret.py, og.html, testler/, kaynak-haritalar-karti.png).

**Bakım:** metin/sayfa değişikliği → `uret.py` düzenle → `python3 aytac-mobilya/_proje/uret.py` → testleri çalıştır. Yeni fotoğraf → `img/`'ye 347×428 (veya orijinal oranda daha büyük) WebP + `FOTO` listesine bir satır. Paylaşım görseli → `_proje/og.html` + `testler/og.js`.

**Müşteriden beklenenler**
1. **WhatsApp / telefon numarası** (Haritalar kartında son haneler "50 44 33" görünüyor, başı ipucu kutusunun altında kaldı).
2. Son işlerin **orijinal fotoğrafları** (telefon galerisinden, sıkıştırmasız) + SHOT LIST (modül 2/14).
3. Fotoğrafların sitede kullanılmasına yazılı onay (WhatsApp mesajı yeterli).
4. Haftalık çalışma saatleri ve kapalı gün.
5. Hizmet verilen bölgeler (Ankara geneli mi?).
6. Site yayına çıkınca Google İşletme Profili'nde web sitesi alanına site adresinin yazılması; Search Console'a `sitemap.xml` gönderimi.

## 22 — LEARNING / SYSTEM UPDATE
SKILL.md → SYSTEM LEARNING'e eklenenler:
- WORKFLOW: Instagram profil ekran kaydından gerçek görsel çıkarma (5 fps kare → ızgara ayırıcı satırları → hücre → aHash tekilleştirme → en keskin kare; üst 30 px simge ve 1 px kenar kırpma).
- KURAL: Instagram ızgarasında eski dönem "showroom" ürünleri imalat kanıtı sayılmaz; yalnız yeni dönem / montaj izli kareler.
- STANDART: Galeride mağaza/ofis/showroom karesi varsa "hepsi müşteri evlerinden" denmez; "Instagram'da paylaştığımız işler" denir.
- ÇÖZÜM: Numara bilinmiyorsa WhatsApp CTA'sı tek ayardan beslenir; boşken `ig.me/m/<kullanıcı>` + mesajı panoya kopyalama.
- STANDART: Düşük çözünürlüklü gerçek kareler: tasarımı "çok kare, doğal boyut" üzerine kur; tek büyük hero yerine derzli kolaj.
- WORKFLOW: Çok sayfalı statik sitede ortak parçaları `_proje/uret.py` ile üret; çıktı derlemesiz yayınlanır.
- ÇÖZÜM: Google Fonts'u `woff2` olarak gömmek → harici istek yok, KVKK/çerez yükü yok.

## FINAL — YÖNETİCİ ÖZETİ
1. **İşletme:** Aytaç Mobilya Tasarım/İmalat — Etimesgut (30 Ağustos Mah. 2071. Sk. 14A), kişiye özel mobilya imalatı; ölçü, proje, montaj.
2. **Ana problem:** Web sitesi yok; işler yalnız Instagram'da, aramada görünmüyor; Haritalar'daki "web sitesi" Instagram'a gidiyor.
3. **Hedef müşteri:** Yeni taşınan / tadilat yapan ev sahibi (birincil), tek parça arayanlar, küçük işletmeler.
4. **Ana içgörü:** Sektörün dili ezber ve kanıtsız; bu firmanın elinde rakiplerde olmayan iki gerçek kanıt var: 131 yorumun tamamı 5 yıldız ve 124 rötuşsuz iş fotoğrafı.
5. **Konumlandırma:** "Ölçünüzü alıyor, projesini çiziyor, kendimiz üretip evinize kuruyoruz" — sıfat değil, fotoğrafta görülen detay.
6. **Teklif:** Fotoğraf → ölçü → proje → imalat → montaj; fiyat/garanti vaadi yok, risk azaltma = görünürlük.
7. **Web mimarisi:** Ana sayfa + 5 hizmet niyeti sayfası + filtrelenebilir İşler galerisi; her sayfa mesaj hazırlayıcıyla biter.
8. **SEO:** "Etimesgut/Ankara + iş türü" niyetleri, Service/FAQ/Breadcrumb/işletme şeması, sitemap; Google Business'ta site adresi ve yorumlarda iş türü + semt.
9. **Görsel strateji:** Stok sıfır; 41 gerçek kare; tasarım dili kapaklardan (derz, kulp, LED, meşe) türetildi; fotoğraf üstü teknik not etiketleri imza öğe.
10. **Teknoloji:** Statik HTML/CSS/JS, `uret.py` ile tek kaynaktan; 11 kabul ölçütü otomatik testle geçti.
11. **Audit:** 11 bulgu; 3 kanıt çıkarımı ve 1 kontrast sorunu düzeltildi; KRİTİK 1 (numara) müşteri girdisine bağlı.
12. **Kalan riskler:** Numara yok · fotoğraflar 347 px · kullanım onayı · haftalık saat.
13. **Sonraki en önemli aksiyon:** Firmadan WhatsApp numarasını ve orijinal fotoğrafları almak → `ayarlar.js` + `uret.py` → yeniden üret → main'e birleştir ve Google İşletme Profili'ne site adresini yaz.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [ ] ❌ Tüm KRİTİK / YÜKSEK audit bulguları düzeltildi — #1 (numara) ve #5 (orijinal fotoğraf) müşteri girdisine bağlı; geçici çözümler çalışıyor, handoff'ta
- [x] Final QA listesinde ❌ kalanın nedeni handoff'ta (WhatsApp numarası)
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING güncellendi
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti sunuldu
