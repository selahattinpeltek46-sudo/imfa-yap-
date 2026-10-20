# Osmanoğlu Mobilya — Modül 4: Denetim, Final QA, Teslim, Öğrenme (17–22)

## 17 — EVALUATION

| Eksen | Sonuç |
|---|---|
| Doğruluk | NAP, puan (tarihli), yorumlar Haritalar ekran görüntüleriyle birebir (yalnız noktalama + 2 yazım düzeltmesi, `icerik.py`'de belirtildi) |
| Context uyumu | Kullanıcının üç isteği: tam boy ✔, animasyonlu ✔, karartma / bulanıklık yok ✔ (otomatik test) |
| Marka | Renk ve imza öğe firmanın kendi işinden; logo yok → yazı logotipi |
| UX | Metin fotoğraf üstünde değil, düz panelde → her ışıkta okunur; Durdur düğmesi; mobilde fotoğraf üstte, metin altta |
| Conversion | Her ekranda WhatsApp (üst çubuk), sayfa başına hazır mesaj, mesaj hazırlayıcı, telefon, yol tarifi |
| SEO | 4 niyet / 4 sayfa, title/meta/H1/canonical, schema, sitemap |
| Visual | 5 gerçek kare + 1 temsili çizim (işaretli); çözünürlük sınırda |
| Technical | Derlemesiz, harici istek yok, 0 konsol hatası |
| Accessibility | Alt metinler, odak halkası, atla bağlantısı, `aria-pressed`, `aria-live` slayt adı, reduced-motion |
| Performance | Tüm varlıklar 568 KB; hero ilk kare `fetchpriority=high`, diğerleri gerektiğinde |
| Evidence | Firma ağzından kanıtsız iddia yok; garanti / ücretsiz keşif / süre / fiyat yazılmadı |

## 18 — AUDIT

| # | Sınıf | Önem | Konum | Bulgu |
|---|---|---|---|---|
| 1 | EVIDENCE | YÜKSEK | `icerik.py` YORUMLAR (ilk sürüm) | Emre K. ve Kamil C. yorumları kısaltılıp yeniden cümlelenmişti ("geniş çaplı üretim kapasitesi" düşmüştü) → alıntı ≠ müşteri sözü |
| 2 | TECHNICAL | YÜKSEK | hero etiketleri | `%` konum + `object-fit: cover` → mobilde etiket yanlış nesneyi gösteriyordu |
| 3 | BRAND | YÜKSEK | antre karesi | Hero'da çöp poşeti ve ayakkabılar görünüyordu |
| 4 | UX | ORTA | mobil hero | Alt etiket gösterge plakasının altında kalıyor, iki etiket üst üste biniyordu |
| 5 | UX | ORTA | vestiyer hero, masa | Sağ kenardaki etiket 3 satıra kırılıyordu |
| 6 | UX | DÜŞÜK | SSS | Kapalıyken "−" işareti (anlam ters) |
| 7 | EVIDENCE | YÜKSEK (açık) | tüm hero'lar | Kaynak kareler ~800 px; büyük ekranda yumuşak. Orijinaller gerekli |
| 8 | FACT | ORTA (açık) | WhatsApp | 0532 177 06 19'un WhatsApp kaydı doğrulanmadı |
| 9 | SEO | ORTA (açık) | Haritalar profili | Web sitesi alanı boş; işletme adında anahtar kelime eki |
| 10 | SEO | DÜŞÜK (açık) | Haritalar bağlantısı | `cid` bilinmediği için ad araması; aynı adlı başka kayıt yok gibi görünse de kesin bağlantı daha iyi |
| 11 | CONVERSION | DÜŞÜK | mobil hero | 375×760'ta hero CTA'ları ilk ekranın altında; üst çubuktaki WhatsApp düğmesi her an görünür → kabul |
| 12 | CONTEXT | DÜŞÜK | çalışma saatleri | Yalnız bir günün kapanışı biliniyor → yayınlanmadı, "arayın" notu |

## 19 — REVISION

- #1 → yorumlar kelimesi kelimesine yeniden yazıldı; değişiklikler (noktalama, "ramen→rağmen", "ayos→ayous") dosyada açıklandı; Haritalar'daki "Diğer" kısaltması "…" ile gösterildi.
- #2 → etiketler JS ile görüntü koordinatından piksele çevriliyor; fotoğraf + etiket aynı katmanda ölçekleniyor. Test: "görünür etiket ≥ 2, sahneden taşan 0" × 3 genişlik.
- #3 → antre karesi alttan kırpıldı (796×597), etiket koordinatları yeniden hesaplandı.
- #4, #5, #6 → düzeltildi, ekran görüntüsüyle yeniden bakıldı.
- #7–#10 → müşteri girdisine bağlı (Handoff). #11–#12 → not edildi.
- Her düzeltmeden sonra `test.js` yeniden koşturuldu: v1 268/268, v2 719/719.

### v2 denetimi (editoryal yeniden tasarım)
| # | Sınıf | Önem | Konum | Bulgu → çözüm |
|---|---|---|---|---|
| 13 | INSTRUCTION | KRİTİK | tüm site | Kullanıcı tasarımı "basit" buldu; Babacan seviyesi istendi → 12 sayfalık editoryal yeniden tasarım |
| 14 | UX | YÜKSEK | hero, masa | Dikey fotoğraf geniş ekranda pencereye zum yapıyordu, çekmeceler görünmüyordu → `ODAK` ile dikey odak; etiketler yeniden konumlandı |
| 15 | UX | YÜKSEK | hero, masa | Etiketler krem kartın altında kalıyordu (hepsi gizlenmişti) → JS çakışma kontrolü + yeni noktalar; test: ≥ 2 görünür, 0 örtülen |
| 16 | UX | ORTA | hero, masa | Sayaç plakası kayan WhatsApp düğmesiyle çakışıyordu → plaka sağ üste |
| 17 | EVIDENCE | ORTA | ilkeler | "Üretimi ve montajı usta takip eder" doğrulanmamış süreç iddiasıydı → "Sorularınızı baştan sorun" |
| 18 | EVIDENCE | YÜKSEK → v3'te çözüldü | hero | Kenardan kenara hero ~800 px karelerle 1,8× büyütülüyordu → v3 mozaik (aşağıda) |

### v3 — hero görseli (kullanıcı: "hero'daki görsel çok zayıf")
| # | Sınıf | Önem | Konum | Bulgu → çözüm |
|---|---|---|---|---|
| 19 | UX / VISUAL | KRİTİK | hero (5 sayfa) | ~800 px kare kenardan kenara 1,8× büyütülünce yumuşak görünüyordu → kullanıcı seçimiyle **gerçek kare mozaiği**: 5 tam kare + aynı karelerden kendi çözünürlüğünde kesilmiş 9 detay, 3 sütunda yavaşça kayar; hiçbir kare büyütülmez (test: gösterilen genişlik ≤ doğal genişlik). Slayt + detay etiketi sistemi kaldırıldı; her karede kısa etiket. Durdur düğmesi, hover'da duraklama, reduced-motion'da duruk. 717/717 test. |

## 20 — FINAL QA

- [x] Desktop görünüm (1440, 4 sayfa)
- [x] Mobil görünüm (375 px, yatay kaydırma 0; 820 px tablet de test edildi)
- [x] Tüm iç ve dış linkler çalışıyor (iç bağlantı + çapa testi; dış: wa.me, tel:, Google Haritalar)
- [x] Tüm CTA'lar doğru hedefe gidiyor
- [⚠️] WhatsApp linki doğru numara ve hazır mesajla açılıyor — mekanizma ✔, numaranın WhatsApp kaydı doğrulanmadı
- [x] Formlar: veri gönderilmez; hazırlayıcı WhatsApp metnini doğru üretiyor (test)
- [x] Görseller yükleniyor, alt metinleri var, temsili çizim işaretli
- [x] Her sayfada title, meta description, tek H1, canonical; schema geçerli JSON
- [x] İçerik: yazım kontrolü, kanıtsız iddia yok
- [x] NAP tüm sayfalarda aynı
- [x] KVKK / çerez: gerekmez (veri ve çerez yok); alt bilgide açıklama
- [x] Ölçüm olayları `dataLayer`'a düşüyor (test)
- [x] Regression: diğer siteler etkilenmedi

## 21 — HANDOFF

**Yapılanlar:** analiz (Modül 1–2), v2'de 12 sayfalık editoryal site (projeler, süreç, bilgi merkezi + 2 rehber, iletişim dahil), tam boy animasyonlu hero (3 gerçek kare, çekmece geçişi, detay etiketleri, karartmasız), mesaj hazırlayıcı, schema, sitemap, OG görseli, 719 otomatik test.
**Yapılmayanlar:** GA4 (çerezsiz kalmak için), Hakkımızda sayfası (bilgi yok; Murat Usta'nın fotoğrafı ve hikâyesi gelirse eklenir), müşteri yorum fotoğrafları (hak sahibi müşteriler), çalışma saatleri, KVKK metni (gerekmiyor).
**Doğrulanan bilgiler:** ad, kategori, adres, plus code, telefon, 4,9/26 (20.10.2026), 3 yorum metni, videodaki işler.
**Varsayımlar:** marka adı "Osmanoğlu Mobilya"; WhatsApp = cep numarası; hizmet alanı Ankara geneli; Sanayi Sitesi'ndeki yer atölye.
**Kalan riskler:** düşük çözünürlüklü hero kareleri; WhatsApp kaydı; Haritalar ad eki.
**Dosyalar:** `osmanoglu-mobilya/` (bkz. Modül 3 / 15).
**Bakım:** yeni metin → `icerik.py`, sonra `python3 osmanoglu-mobilya/_proje/uret.py` ve `--metin`; numara → `js/ayarlar.js`; yeni fotoğraf → `img/` + `FOTO` / `HERO` (etiket koordinatı fotoğrafa göre %).
**Müşteriden beklenenler (öncelik sırasıyla)** — v2 ek: Murat Usta'nın atölyede bir fotoğrafı ve kısa hikâyesi (Babacan'daki "işin başında ben varım" bölümü için; şu an bilgi olmadığı için açılmadı):
1. Google Haritalar profiline site adresini ekleyin: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/osmanoglu-mobilya/`
2. 0532 177 06 19 WhatsApp'ta kayıtlı mı? Değilse WhatsApp numarası.
3. Bu mutfağın ve antrenin orijinal fotoğrafları (videoya dönüştürülmeden önceki dosyalar).
4. Haftalık çalışma saatleri (sitede ve Haritalar'da).
5. SHOT LIST'teki yeni iş fotoğrafları (Modül 2 / 14).
6. Kamil Bey'den karavan fotoğraflarını sitede kullanma izni.
7. Ücretsiz ölçü / keşif, garanti, tezgâh tedariki gibi konularda gerçekte ne sunulduğu (sunuluyorsa siteye eklenir).
8. Haritalar paylaşım bağlantısı (kesin `cid` için).

## 22 — LEARNING / SYSTEM UPDATE

SKILL.md → System Learning'e eklendi:
- HATA/ÇÖZÜM: Fotoğraf üstü detay etiketi `%` ile konumlanırsa `object-fit: cover` kırpması yüzünden ekran oranı değişince yanlış noktayı gösterir → görüntü koordinatından piksele JS ile çevir, fotoğrafla aynı katmanda ölçekle.
- KURAL: Müşteri yorumu alıntısı kelimesi kelimesine; yalnız noktalama / bariz yazım düzeltilir ve belirtilir.
- STANDART: "Karartma / bulanıklık yok" isteği → metni fotoğrafın yanına düz panele koy, testte sahne öğelerinde `filter`, `backdrop-filter` ve fotoğrafı kaplayan renkli katman olmadığını doğrula (testin yakaladığını yapay katmanla kanıtla).
- WORKFLOW: Windows Fotoğraflar slayt videosundan kare: 4 fps → sahne başına kenar varyansıyla en keskin kare; başlık ("Film 1") ve imleç karelerini atla; hero için 1,6× Lanczos + hafif keskinleştirme `srcset` sürümü.
- STANDART: Gerçek kare ev içi dağınıklık (çöp poşeti, ayakkabı) içeriyorsa hero'ya koymadan önce kırp.

## FINAL — YÖNETİCİ ÖZETİ

1. **İşletme:** Osmanoğlu Mobilya — Sincan Sanayi Sitesi'nde mobilya imalatçısı; Google'da 4,9 / 26 yorum; web sitesi yoktu.
2. **Ana problem:** Dijitalde tek varlık Haritalar kaydı; işleri anlatan, kendine ait bir yer yok.
3. **Hedef müşteri:** Batı Ankara'da (Sincan, Etimesgut, Eryaman) mutfak / dolap yaptıracak aileler; niş: ahşap karavan isteyenler.
4. **Ana içgörü:** Müşteriler ustayı ve malzemeyi övüyor ("Murat ustanın ustalığı", "malzeme kalitesi"); rakipler ise yıl ve liste sayıyor. Fark, işin detayını göstermek.
5. **Konumlandırma:** "Ölçüye yapılır, yerine oturur." — ustayla doğrudan, atölyeden.
6. **Teklif:** Fotoğraf + kaba ölçüyle WhatsApp'tan başla → konuş → ölçü/seçim → üretim/montaj. Doğrulanmamış garanti / ücretsiz keşif vaadi yok.
7. **Web mimarisi:** 12 sayfa — Ana sayfa, 3 çözüm, Projeler + 2 proje, Nasıl çalışıyoruz, Bilgi merkezi + 2 rehber, İletişim.
8. **SEO stratejisi:** Sayfa başına tek niyet; yerel NAP + schema; Haritalar profiline site bağlantısı ve yorum isteme akışı.
9. **Görsel strateji:** Videodan çıkarılan 5 gerçek kare; tam boy, karartmasız, çekmece gibi açılan hero ve fotoğraftaki detayı adlandıran etiketler; renkler işin malzemelerinden.
10. **Teknoloji ve geliştirme:** Statik, derlemesiz, çerezsiz; tek kaynaklı üretici; 268/719 otomatik test.
11. **Audit:** 18 bulgu; KRİTİK/YÜKSEK olanlar düzeltildi; açık kalanlar (hero çözünürlüğü, WhatsApp kaydı, Haritalar adı) müşteri girdisine bağlı.
12. **Kalan riskler:** ~800 px hero kareleri, WhatsApp kaydı, Haritalar ad eki.
13. **Sonraki en önemli aksiyon:** Haritalar profiline site adresini eklemek ve orijinal fotoğrafları almak.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 4
- [x] 17–22 başlıklarının altısı da dosyada var
- [x] Tüm KRİTİK / YÜKSEK audit bulguları düzeltildi (açık kalan #7 müşteri girdisi gerektiriyor, handoff'ta)
- [x] Final QA listesinde ❌ yok (⚠️ WhatsApp kaydı handoff'ta)
- [x] Handoff raporu eksiksiz
- [x] SYSTEM LEARNING güncellendi
- [x] `durum.md` 22 aşamanın tamamını gösteriyor
- [x] Yönetici özeti sunuldu
