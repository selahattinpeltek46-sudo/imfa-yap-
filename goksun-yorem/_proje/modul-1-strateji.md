# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Göksun Yörem Et ve Süt Ürünleri** · Klasör: `goksun-yorem/` · Tarih: 2026-10-10
Girdi: kullanıcının landing page brifi (marka, hizmetler, renk paleti, bölüm sırası) + ilk sürüm `goksun-yorem/index.html`.

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Göksun Yörem Et ve Süt Ürünleri | KULLANICI BİLGİSİ |
| Sektör | Kasap, şarküteri, yöresel gıda | KULLANICI BİLGİSİ |
| Konum / hizmet bölgesi | Göksun / Kahramanmaraş; adres "Göksun Merkez" (açık adres yok) | KULLANICI BİLGİSİ (açık adres BİLİNMİYOR) |
| Web sitesi | Yok — bu proje ilk site | KULLANICI BİLGİSİ |
| Sosyal medya | Instagram @selahattin_peltek | KULLANICI BİLGİSİ |
| Google Business | BİLİNMİYOR | BİLİNMİYOR |
| Ürünler | Taze dana, kuzu, tavuk, balık; katıksız yayla sütü, yayla tereyağı, tulum peyniri, süzme bal, kahvaltılıklar | KULLANICI BİLGİSİ |
| Ek hizmetler (brifte) | Özel kesim randevusu, toplu mangal hazırlığı, dükkandan teslimat, adrese teslimat | KULLANICI BİLGİSİ |
| Ticari amaç | WhatsApp üzerinden sipariş ve özel kesim/toplu sipariş talebi toplamak | KULLANICI BİLGİSİ (brif: "dönüşüm odaklı") |
| Hedef kitle | Göksun'da yaşayan aileler; mangal / davet organize edenler; Göksun dışında yöresel ürün isteyenler | VARSAYIM |
| Telefon / WhatsApp | Numara verilmedi | BİLİNMİYOR |
| E-posta | Verilmedi | BİLİNMİYOR |
| Çalışma saatleri | Verilmedi | BİLİNMİYOR |
| Logo / gerçek fotoğraf | Repoda yok | BİLİNMİYOR |

Repo incelemesi: `goksun-yorem/` klasöründe yalnızca ilk sürüm `index.html` var; firmaya ait görsel yok. Kökteki `Ekran görüntüsü*.png` dosyaları başka projelere ait.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Marka adı, ürün listesi, renk paleti, tipografi, bölüm sırası | KULLANICI BİLGİSİ |
| 2 | Instagram hesabı @selahattin_peltek | KULLANICI BİLGİSİ |
| 3 | Sipariş kanalı WhatsApp | KULLANICI BİLGİSİ |
| 4 | "%100 Taze & Yerli Kesim" rozeti | KULLANICI BİLGİSİ (brifte istendi; belge/kanıt BİLİNMİYOR) |
| 5 | Göksun ~1.350 m rakımda, kışı sert; "Akdeniz'in Sibiryası" diye anılır | ARAŞTIRMA BULGUSU (kaynak kalitesi orta) |
| 6 | Göksun nüfusu ~50.676 (2022) | ARAŞTIRMA BULGUSU |
| 7 | Bölgede çevrimiçi görünür kasap/şarküteri rakibi bulunamadı | ARAŞTIRMA BULGUSU (web araması; harita verisi taranamadı) |
| 8 | Adrese teslimatın Göksun merkezle sınırlı olduğu | [VARSAYIM] |
| 9 | Kargo ile il dışına gönderim (tereyağı, peynir, bal) | BİLİNMİYOR — sitede vaat edilmeyecek |
| 10 | Çalışma saatleri | BİLİNMİYOR — sitede "[VARSAYIM]" işaretli örnek saat, teyit gerek |
| 11 | Kurban/adak kesimi hizmeti | BİLİNMİYOR — ilk sürümde eklenmişti, kanıtsız olduğu için kaldırılacak |
| 12 | Köy yumurtası | BİLİNMİYOR — brifte yok, kaldırılacak |
| 13 | Usta / kuruluş yılı / tecrübe süresi | BİLİNMİYOR — sitede yıl/rakam kullanılmayacak |
| 14 | Hijyen belgesi (işletme kayıt no., TSE vb.) | BİLİNMİYOR |
| 15 | Fiyatlar | BİLİNMİYOR — sitede fiyat yok, "güncel fiyat WhatsApp'tan" |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| KRİTİK | WhatsApp / telefon numarası | Tüm CTA'lar buna bağlı; olmadan site dönüşüm üretemez | 09, 15, 18 | Tek bir JS sabitinde yer tutucu `905XXXXXXXXX`; yayından önce değiştirilecek |
| YÜKSEK | Açık adres + Google Business | Yerel SEO ve "nerede?" sorusu | 13, 14 | "Göksun Merkez, Kahramanmaraş" |
| YÜKSEK | Gerçek dükkan / ürün fotoğrafları | Gıdada güven görselle kurulur; stok görsel sahte kanıt riski | 14, 17 | Unsplash stok görseller, sitede "temsili" notu |
| ORTA | Çalışma saatleri | Ziyaret kararı | 10, 11 | Pzt–Cmt 08:00–20:00, Pazar 09:00–18:00 [VARSAYIM] |
| ORTA | Teslimat bölgesi ve koşulları | Adrese teslimat vaadinin kapsamı | 08 | Göksun merkez ve yakın çevre [VARSAYIM] |
| ORTA | Hijyen/işletme belgeleri | Güven kanıtı | 07, 08 | Kanıt halkası "BİLİNMİYOR"; belge numarası iddiası yok |
| DÜŞÜK | Logo | Marka tutarlılığı | 14 | İkon + yazı logosu |
| DÜŞÜK | Müşteri yorumları | Sosyal kanıt | 07 | Yorum bölümü YOK (sahte yorum yasak) |

## 04 — DEEP RESEARCH

**Bulgu 1 — Yerel coğrafya**
Kaynak: Yandex soru-cevap içeriği (yandex.com.tr/yacevap) ve PeakVisor (peakvisor.com/adm/goeksun.html): Göksun ~1.350 m rakımda; kışları soğuk; "Akdeniz'in Sibiryası" olarak anılıyor; ilçede 55 adlandırılmış dağ var, en yükseği Berit Dağı (2.989 m).
Yorum: "Yayla" kavramı Göksun için pazarlama süsü değil, coğrafi gerçek. Mesajda yayla/rakım vurgusu güvenle kullanılabilir; rakam olarak sitede yalnızca genel ifade ("yüksek yaylalar") kullanılacak, kesin rakım verilmeyecek.

**Bulgu 2 — Nüfus / pazar büyüklüğü**
Kaynak: Wikipedia "Göksun" (arama özeti): nüfus 50.676 (2022).
Yorum: Küçük ve ilişki odaklı bir pazar. Ağızdan ağıza ve Instagram/WhatsApp, arama motorundan daha belirleyici. Site, "kartvizit + sipariş kapısı" işlevi görmeli.

**Bulgu 3 — Çevrimiçi rekabet**
Kaynak: "Göksun kasap et süt ürünleri", "Göksun Yörem" web aramaları — Göksun'a özgü kasap/şarküteri web sitesi çıkmadı.
Yorum: "Göksun kasap", "Göksun tereyağı" gibi yerel aramalarda rakipsiz alan var. Tek sayfa bile doğru başlık/meta/yerel şema ile görünürlük kazanabilir. (Not: Google Haritalar taranamadı; harita listelerinde rakip olabilir.)

**Bulgu 4 — Ürün geleneği**
Kaynak: Wikipedia "Tulum cheese"; Lonely Planet "Discover Turkey cheese": tulum peyniri deri/tulumda olgunlaştırılan geleneksel peynir; yayla tereyağı yayıkla elde edilir.
Yorum: "Geleneksel yöntem" iddiası kategori olarak doğru; ancak Göksun Yörem'in kendi üretim yöntemi BİLİNMİYOR → sitede "yöremizin geleneksel yöntemleriyle hazırlanan" gibi kategori ifadesi kullanılır, "kendi yayığımızda" gibi özgül üretim iddiası kullanılmaz.

**Bulgu 5 — WhatsApp sipariş davranışı**
Kaynak: SendPulse blog (WhatsApp otomatik yanıt), eleman.net WhatsApp sipariş sorumlusu ilanı, Selçuk Üni. SUSBED makalesi (online yemek siparişinde güven ve algılanan değer).
Yorum: Hızlı ilk yanıt, sipariş özetinin teyidi ve şeffaf durum bilgisi güveni artırıyor. Sitedeki WhatsApp mesajları **hazır doldurulmuş ve yapılandırılmış** (ürün, miktar, teslim şekli) olmalı; form da sonuçta WhatsApp'a özet göndermeli.

**Bulgu 6 — Dijital eğilim (genel)**
Kaynak: Yukarıdaki WhatsApp Business içerikleri.
Yorum: Küçük gıda işletmelerinde e-ticaret altyapısı yerine WhatsApp siparişi yaygın ve düşük sürtünmeli. Sepet/ödeme sistemi bu proje için gereksiz.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Göksun'da yaşayan aile (ana segment)
| Alan | İçerik |
|---|---|
| Tetikleyici | Haftalık et alışverişi, misafir, kahvaltılık bitmesi |
| İhtiyaç | Taze, güvenilir et; katkısız süt ürünü |
| Problem | Etin tazeliğini/kaynağını bilememek; markette "yayla" yazan ürünün gerçekliğinden şüphe |
| Karar mekanizması | Çoğunlukla evdeki alışverişi yöneten kişi; büyük alımlarda aile birlikte |
| Karar kriteri | Tazelik, hijyen, tanıdıklık/güven, fiyat, istenen gibi kesim |
| İçsel risk | "Bayat ya da karışık kıyma alırım" |
| Dışsal / sosyal risk | Misafire kötü et sunmak |
| Arzu | Kasabını tanımak, "her zamankinden" diyebilmek |
| İtiraz | "Market daha ucuz", "dükkana gitmeden nasıl güveneyim" |
| Müşteri dili | "Taze mi?", "Kıymayı önümde çekin", "Yağsız olsun", "Sabah kesim mi?", "Hakiki tereyağı var mı?" |
| Güven ihtiyacı | Dükkanı görmek, ustanın yüzü, hijyen, tutarlı kalite |
| Beklenen sonuç | Sofraya güvenle konan et ve kahvaltılık |
| Daha derin problem | Gıdada güven kaybı — "Ne yediğimi bilmek istiyorum" |

### Segment B — Mangal / davet / toplu sipariş veren
| Alan | İçerik |
|---|---|
| Tetikleyici | Düğün, nişan, mevlit, hafta sonu piknik, iş yeri yemeği |
| İhtiyaç | Doğru miktar, hazır (şiş, köfte, marine) ve zamanında teslim |
| Problem | Miktar hesabı, son dakika yetişmemesi |
| Karar mekanizması | Organizasyonu üstlenen kişi; bütçede aile büyükleri |
| Karar kriteri | Zamanlama, hazırlık hizmeti, kişi başı maliyet |
| İçsel risk | "Et yetmez / artar" |
| Dışsal / sosyal risk | Kalabalık önünde mahcup olmak |
| Arzu | "Her şey hazır gelsin, ben sadece pişireyim" |
| İtiraz | "Önceden ödeme mi istiyorlar?", "Zamanında hazır olur mu?" |
| Müşteri dili | "20 kişiye ne kadar et lazım?", "Şişe dizer misiniz?", "Cumartesi sabah alırım" |
| Güven ihtiyacı | Randevu/teyit, ustanın miktar önerisi |
| Beklenen sonuç | Sorunsuz geçen davet |
| Daha derin problem | Organizasyon stresi |

### Segment C — Göksun dışındaki gurbetçi / yöre özlemi olan (ikincil)
Tetikleyici: Memleket özlemi, Instagram'da görme · İhtiyaç: Hakiki tereyağı, tulum peyniri, bal · İtiraz: Uzaktan gönderim mümkün mü (BİLİNMİYOR). → Kargo teyit edilene kadar sitede vaat yok; "Göksun dışı talepler için WhatsApp'tan yazın" ifadesiyle kapı açık bırakılır.

## 06 — MARKET & COMPETITOR INTELLIGENCE
(Puanlama yapılmamıştır.)

| Tür | Rakip | Konumlanma | Kullandığı mesajlar | Güven unsurları | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Göksun'daki diğer kasaplar (isim/çevrimiçi varlık bulunamadı) | Mahalle kasabı | Ağızdan ağıza, tabela | Tanıdıklık | Yerel aile | Çevrimiçi görünürlük ve WhatsApp sipariş kolaylığı |
| DOLAYLI | Zincir marketlerin et reyonları | Fiyat + erişim | Kampanya, indirim | Marka, paketli ürün etiketi | Fiyat odaklı | Kişiye özel kesim, yöresellik, usta ilişkisi |
| DOLAYLI | Pazar yerindeki köylü üreticiler (süt ürünü/bal) | "Köyden doğal" | Doğallık | Üreticiyle yüz yüze | Kahvaltılık arayan | Tek noktada et + kahvaltılık, hijyenik paket |
| ALTERNATİF | Çevrimiçi yöresel ürün siteleri / Instagram satıcıları | Ulusal kargo | "Yayla", "köy" | Yorum sayıları | Şehirli | Gerçek Göksun adresi, dükkan |
| ALTERNATİF | Kendi kesimi / kurbanlık alıp kestirme | Maliyet | — | — | Toplu tüketim | Hazırlık hizmeti |

## 07 — MESSAGE ENGINE

**Ana mesaj:** *Ustasından taze et, yöresinden doğal kahvaltılık — Göksun'da, tek dükkanda.*

| Halka | Segment A (Aile) | Segment B (Mangal/Toplu) |
|---|---|---|
| Problem | Etin tazeliğini, ürünün gerçekten yayladan olduğunu bilememek | Kalabalığa doğru miktarı zamanında hazırlamak |
| Kaygı | Bayat / karışık ürün | Yetmemesi, gecikmesi |
| Arzu | Güvendiği bir kasap | Her şey hazır gelsin |
| Çözüm | Günlük kesim, isteğe göre hazırlık, katkısız yayla ürünleri | Özel kesim randevusu, mangal hazırlığı, belirlenen saatte teslim |
| Kanıt | Dükkan Göksun merkezde, görülebilir (DOĞRULANABİLİR); Instagram hesabı (KULLANICI BİLGİSİ); belge, yorum, yıl → BİLİNMİYOR | Form/WhatsApp ile yazılı teyit (süreç kanıtı); geçmiş organizasyon referansı → BİLİNMİYOR |
| Aksiyon | WhatsApp'tan sipariş ver | Randevu formu → WhatsApp'a özet |

Segment C mesajı: "Göksun'un tereyağı ve tulum peyniri, yanında süzme bal — memleket lezzeti için bize yazın." (kargo vaadi yok; balın menşei BİLİNMİYOR — M4 · R1)

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Taze ve güvenilir et/kahvaltılık bulmak; toplu siparişte zaman ve miktar stresi |
| Çözüm | Günlük taze et + yöresel süt ürünleri tek dükkanda; WhatsApp'tan sipariş; özel kesim randevusu |
| Fayda | Sıra beklememe, istenen kesim, eve teslim, katkısız ürün |
| Süreç | 1) WhatsApp'a yaz / formu doldur → 2) Usta ürün, miktar ve saati teyit eder → 3) Dükkandan al ya da adrese teslim |
| Kanıt | Fiziksel dükkan (Göksun merkez), Instagram. Belgeler/yorumlar BİLİNMİYOR |
| Risk azaltma | Siparişin yazılı teyidi (WhatsApp); güncel fiyatın önceden bildirilmesi. Garanti / iade **sunulmuyor** (firma bilgisi yok, uydurulmadı) |
| CTA | "WhatsApp'tan Sipariş Ver" · "Özel Kesim Randevusu Al" |

## 09 — CONVERSION ENGINE

Yolculuk (tek sayfa üzerinde):
| Aşama | Bölüm | Görevi |
|---|---|---|
| Dikkat | Hero | İştah kabartan görsel + ana mesaj |
| Anlama | Hero alt metin, ürün etiketleri | Ne satılıyor, nerede |
| İlgi | Öne çıkan ürünler | Somut ürün, tek tıkla sipariş |
| Güven | Biz Kimiz + 4 avantaj | Hijyen, gelenek, yerellik |
| Risk azaltma | "Nasıl sipariş verilir" 3 adım + yazılı teyit | Belirsizliği kaldır |
| Aksiyon | WhatsApp butonları, form | Sipariş |

CTA hiyerarşisi:
- **Birincil:** WhatsApp sipariş (header, hero, kartlar, sabit buton, footer)
- **İkincil:** Telefonla ara (footer, mobil)
- **Üçüncül:** Randevu formu (gönderince alert + WhatsApp'a özet aktarımı)

Next step haritası: Hero → Ürünler · Ürün kartı → WhatsApp (ürün adıyla dolu mesaj) · Biz Kimiz → Randevu · Form → WhatsApp · Footer → WhatsApp/Telefon/Instagram

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (A ve B)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta dayanıyor ya da BİLİNMİYOR diye işaretli
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
