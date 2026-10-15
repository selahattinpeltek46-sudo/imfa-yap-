# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Proje: Beyoğlu Erkek Kuaförü · Girdi: `modul-1-strateji.md` · Tarih: 2026-10-15
Yayın adresi: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/beyoglu-erkek-kuaforu/`

---

## 10 — INFORMATION ARCHITECTURE

Karar: **tek sayfa + KVKK sayfası.** Taslaktaki tek sayfa yapısı doğru; 6 hizmet ve fiyatsız liste için ayrı sayfalar boş tekrar olur. Taslaktan farklar: "Galeri" → "Salon" (yalnız kişisiz kareler), yeni **Randevu** (çalışan form), yeni **In English**, yeni **Sorular**, yeni **Adres** (harita + yol tarifi).

| Sayfa / bölüm | Amaç | Hedef kullanıcı | Temel soru | Verilecek cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` Açılış | Kim, nerede, nasıl ulaşırım | Tümü | "Bu berber nerede, iyi mi?" | Beyoğlu Kamer Hatun'da berber, Balık Sk. No:4 | Google 4,9 · 1.957 yorum (bağlantılı); gerçek salon fotoğrafı | "beyoğlu berber", "beyoğlu erkek kuaförü" | Randevu al / WhatsApp / Ara | Hizmetler |
| `/#hizmetler` | Ne yapılıyor | A, C | "İstediğim hizmet var mı, fiyat?" | 6 hizmet; 4'ü randevulu, 2'si "Sorun"; fiyat WhatsApp'tan | Fiyat konusunda şeffaflık | "ustura tıraş beyoğlu", "erkek saç kesimi taksim" | Hizmeti seçili randevu | Randevu |
| `/#salon` | Atmosfer, işçilik | A, B | "İçerisi nasıl?" | Avize, yeşil duvar, ustura takımı, fade | Gerçek fotoğraf (kişisiz) | Görsel arama | — | Usta / Randevu |
| `/#usta` | Kişi ilişkisi | A | "Kim kesecek?" | Davut Abi; tercihinizi nota yazın | Ad (kullanıcı bilgisi) | Marka | Randevu al | Randevu |
| `/#randevu` | Dönüşüm | Karar vermiş | "Nasıl randevu alırım?" | Hizmet → gün → saat → kod (yedek: WhatsApp) | Ücretsiz, ön ödemesiz, kodla iptal | "berber randevu beyoğlu" | Randevuyu onayla / WhatsApp'tan gönder | Kod ekranı → takvime ekle |
| `/#english` | Turist | B | "Where, how much, how?" | Address, ask price on WhatsApp, directions | Same rating | "barber taksim", "barber beyoglu" | WhatsApp (EN) / Directions | — |
| `/#sorular` | İtiraz giderme | Tümü | "Randevusuz, fiyat, saat, usta?" | 7 soru-cevap | Şeffaflık | FAQPage | Ara | Adres |
| `/#adres` | Ziyaret | A, B | "Nasıl bulurum?" | Adres, Tarlabaşı Blv. referansı, harita | Gerçek adres | Local NAP | Yol tarifi | — |
| `/kvkk/` | Yasal | Form kullanan | "Bilgim nereye gidiyor?" | Aydınlatma metni (şablon) | Şeffaflık | Düşük | Ana sayfaya dön | — |

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa bölüm sırası:**
1. **Üst bant** (koyu ayna-yeşili): yazı logo "Beyoğlu / Erkek Kuaförü" + menü (Hizmetler · Salon · Randevu · Sorular · Adres) + telefon. Altında altın **kartonpiyer** şeridi.
2. **Açılış**: üst bilgi satırı, H1, tanıtım, CTA'lar, Google puan bağlantısı (metin içinde, kutu değil), künye (adres, telefon, saat notu). Sağda salon fotoğrafı, yeşil boyalı ayna çerçevesi gibi kalın yeşil çerçeve + ince altın iç çizgi.
3. **Hizmetler** — taslaktaki noktalı fiyat panosu korunur; fiyat yerine "Randevu al" / "Sorun".
4. **Salon** — adaçayı-yeşili dokulu duvar zemini; 3 kare (avize, tıraş fırçası, fade) ayna çerçeveli.
5. **Ustamız** — kısa metin.
6. **Randevu** — form + sonuç ekranı (kod, telefonuma ekle, Google Takvim, WhatsApp).
7. **In English** — kısa blok.
8. **Sorular** (`<details>`).
9. **Adres** — adres, bilgiler, yol tarifi, tıklayınca yüklenen harita.
10. **Alt bilgi** + **mobil sabit alt bar** (Randevu · WhatsApp · Ara).

**Internal linking planı:**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Menü | `#hizmetler`, `#salon`, `#randevu`, `#sorular`, `#adres` | Hizmetler / Salon / Randevu / Sorular / Adres |
| Menü | `#english` | EN |
| Açılış | `#randevu` | "Randevu al" |
| Açılış | Google Haritalar | "Google Haritalar'da 4,9 · 1.957 yorum" |
| Hizmet satırı | `#randevu` (hizmeti önceden seçer) | "Randevu al" |
| Fiyat notu, "Sorun" satırları | WhatsApp (hazır mesaj) | "WhatsApp'tan sorun" / "Sorun" |
| Usta | `#randevu` | "Randevu al" |
| Sorular | `#randevu`, `tel:` | "randevu alın", "arayın" |
| Form, alt bilgi | `/kvkk/` | "KVKK Aydınlatma Metni" |
| KVKK | `/` | "Ana sayfaya dön" |

**Yasal:**
- KVKK Aydınlatma Metni: form ad, telefon, randevu bilgisi topluyor; veri salonun Google hesabına (Takvim/E-Tablo) ve/veya WhatsApp'a gidiyor → **gerekli**, şablon, "hukuki kontrol gerekir".
- Çerez banner'ı: analytics yok; harita yalnız tıklamayla yüklenir → zorunlu olmayan çerez yok → **banner gerekmez** (SYSTEM LEARNING). Google Fonts IP iletimi KVKK metninde belirtilir. GA4 eklenirse banner zorunlu.
- Fotoğraflar: Google Haritalar'daki ziyaretçi fotoğraflarından, **yüz görünmeyecek şekilde** kırpıldı; salon orijinallerini verince değiştirilecek (bkz. 14).

## 12 — COPYWRITING ENGINE

**Title:** Beyoğlu Erkek Kuaförü | Berber, Kamer Hatun Beyoğlu
**Meta:** Beyoğlu Kamer Hatun'da, Tarlabaşı Bulvarı'na yakın berber. Saç kesimi, ustura ile sakal tıraşı. Google'da 4,9 (1.957 yorum). Online randevu.

**Açılış**
- Üst bilgi: Berber · Kamer Hatun, Beyoğlu
- H1: Beyoğlu Erkek Kuaförü
- Tanıtım: Avizeli, yeşil duvarlı salonumuzda saç kesimi ve köpüklü ustura tıraşı. Boş saatinizi buradan seçin; geldiğinizde koltuk hazır olsun.
- CTA: Randevu al · WhatsApp · Ara
- Puan: ★ Google Haritalar'da 4,9 · 1.957 yorum
- Künye: Adres — Balık Sk. No:4, Kamer Hatun · Telefon — 0535 508 97 22 · Saatler — Gelmeden önce arayın

**Hizmetler** — H2: Hizmetler
- Giriş: Saç ve sakal başta olmak üzere aşağıdaki hizmetleri veriyoruz. Modelinizi randevu alırken not olarak yazabilirsiniz.
- Saç kesimi — Makas ya da makine; istediğiniz modeli nota yazın. → Randevu al
- Sakal tıraşı — Köpük, fırça ve ustura ile. → Randevu al
- Saç & sakal — İkisi bir arada, tek randevuda. → Randevu al
- Çocuk kesimi — 12 yaş altı. → Randevu al
- Cilt bakımı — Maske ve bakım; içeriğini ve süresini sorun. → Sorun
- Saç boyama — Beyaz kapatma ya da renk; önce görüşelim. → Sorun
- Not: Fiyatlar dönem dönem güncelleniyor. Güncel fiyatı gelmeden önce WhatsApp'tan sorun; listede olmayan bir hizmet için de yazın.

**Salon** — H2: Salon
- Giriş: Adaçayı yeşili duvarlar, altın kartonpiyer, tavanda kristal avize. Tezgâhta köpük kâsesi ve tıraş fırçası.
- Görsel altyazıları: "Tavandaki avize" · "Köpük kâsesi ve tıraş fırçası" · "Fade kesim"

**Ustamız** — H2: Davut Abi
- Metin: Salonun ustası Davut Abi. Onun koltuğuna oturmak istiyorsanız randevu alırken not alanına "Davut Abi" yazın; o gün salonda olup olmadığını da WhatsApp'tan sorabilirsiniz.
- CTA: Randevu al

**Randevu** — H2: Randevu
- Giriş 1: Hizmeti ve günü seçin, o günün boş saatleri listelensin. Seçtiğiniz saat size ayrılır ve ekranda bir randevu kodu görürsünüz.
- Giriş 2: Randevu ücretsizdir, ön ödeme yoktur. Gelemeyecekseniz kodunuzla haber verin; o saati başkasına açalım.
- Telefonla: 0535 508 97 22
- Form: Hizmet · Gün · Saat · Ad soyad · Cep telefonu · Not (isteğe bağlı, örnek: "yanlar kısa, üstü makas · Davut Abi") · KVKK onayı
- Buton (API): Randevuyu onayla · (yedek): Randevu talebini WhatsApp'tan gönder
- Form altı (API): Onayladığınızda saat size ayrılır ve salonun takvimine işlenir. · (yedek): Talebiniz WhatsApp'ta hazır mesaj olarak açılır. Mesajı gönderince bize ulaşır, saati WhatsApp'tan teyit ederiz.
- Sonuç: Randevunuz alındı · Hizmet / Gün / Saat / Kod · Telefonuma ekle (2 saat önce hatırlatır) · Google Takvim · WhatsApp · Yeni randevu al

**In English** — H2: Barber in Beyoğlu, near Taksim
- Haircut, beard shave with foam and straight razor, kids' cut. We are on Balık Sokak No:4, Kamer Hatun, a short walk from Tarlabaşı Boulevard.
- Ask the price on WhatsApp before you come — no surprises.
- CTA: Message us on WhatsApp (hazır İngilizce mesaj) · Get directions

**Sorular** — H2: Sorular
1. Randevusuz gelebilir miyim? — Gelebilirsiniz; koltuk boşsa hemen, değilse kısa bir beklemeyle alırız. Beklemek istemiyorsanız randevu alın ya da arayın.
2. Fiyatlar ne kadar? — Fiyatlar hizmete göre değişir ve dönem dönem güncellenir. Güncel fiyatı WhatsApp'tan ya da telefonla sorabilirsiniz.
3. Çalışma saatleriniz nedir? — Saatlerimiz güne göre değişebiliyor. Gelmeden önce arayın ya da WhatsApp'tan yazın; en kolayı randevu almak.
4. Belirli bir ustayla çalışabilir miyim? — Randevu formundaki not alanına ustanın adını yazın (ör. "Davut Abi"). Uygun değilse size başka bir saat öneririz.
5. İstediğim modeli nasıl anlatırım? — Not alanına yazın ya da beğendiğiniz kesimin fotoğrafını WhatsApp'tan gönderin.
6. Randevumu bana hatırlatır mısınız? — Online randevu aldığınızda "Telefonuma ekle" ile randevu takviminize kaydolur ve 2 saat önce hatırlatır. Ayrıca randevudan önce salondan WhatsApp hatırlatması gelir.
7. Randevumu nasıl değiştirir veya iptal ederim? — Randevu kodunuzla WhatsApp'tan yazın ya da arayın.
8. Salon tam olarak nerede? — Kamer Hatun Mahallesi, Balık Sokak No:4, 34435 Beyoğlu/İstanbul. Tarlabaşı Bulvarı'na yakın bir ara sokakta; en kolayı "Yol tarifi" butonu.

(6. soru yalnız online randevu sistemi kurulunca doğru olur → API boşken site bu soruyu gizler; bkz. 16.)

**Adres** — H2: Adres · adres bloğu · Telefon ve WhatsApp · Saatler: gelmeden arayın · Konum: Tarlabaşı Bulvarı'na yakın, ara sokak · Butonlar: Yol tarifi / Google Haritalar'da aç · Harita perdesi: "Haritayı göster — Harita Google'dan yüklenir. Siz tıklamadan Google'a bilgi gitmez."

**Alt bilgi:** Beyoğlu Erkek Kuaförü · Berber · adres · 0535 508 97 22 · WhatsApp · KVKK · "Google puanı ve yorum sayısı 15 Ekim 2026'da aktarıldı."

**Kanıtsız iddia taraması:** Taslaktaki şu ifadeler **çıkarıldı**: "Beyoğlu'nun en sevilen berberlerinden biri", "kendinizi evinizde hissedeceğiniz tek adres", "30+ yıl tecrübe", "30 yıldır aynı sevgi ve titizlikle", "Bir aile gibi çalışıyoruz", "Deneyimli ustalarımız", "her müşteri bir dost", "sıcak havlu + masaj" (fotoğrafta yok), örnek fiyatlar, "1957+ müşteri yorumu" ("+" eklenmiş). Sayısal iddia yalnız 4,9 / 1.957 (kaynaklı, tarihli). Saat iddiası yok.

## 13 — SEO & ANALYTICS ENGINE

| Intent | Keyword | Page | Message | Content | Proof | CTA |
|---|---|---|---|---|---|---|
| Yerel, işlem | beyoğlu berber, beyoğlu erkek kuaförü | `/` | Kamer Hatun'da berber, online randevu | Açılış + hizmetler | 4,9 · 1.957 | Randevu |
| Yerel, semt | taksim berber, tarlabaşı berber, kamer hatun berber | `/` | Tarlabaşı Blv.'ye yakın | Adres | Harita | Yol tarifi |
| Hizmet | ustura tıraş beyoğlu, sakal tıraşı taksim, erkek saç kesimi beyoğlu | `/#hizmetler` | Köpük + ustura | Hizmet satırları | Salon fotoğrafı | Randevu |
| Turist | barber taksim, barber beyoglu, turkish barber istanbul | `/#english` | Near Taksim, ask price first | EN blok | Rating | WhatsApp |
| Marka | beyoğlu erkek kuaförü balık sokak | `/` | Resmî site | Tümü | NAP | Ara |

| Sayfa | Title (≤60) | Meta (≤155) | H1 | Slug |
|---|---|---|---|---|
| Ana sayfa | Beyoğlu Erkek Kuaförü \| Berber, Kamer Hatun Beyoğlu | (12'deki meta) | Beyoğlu Erkek Kuaförü | `/beyoglu-erkek-kuaforu/` |
| KVKK | KVKK Aydınlatma Metni \| Beyoğlu Erkek Kuaförü | Beyoğlu Erkek Kuaförü randevu formu ve iletişim kanallarında paylaşılan kişisel verilerin işlenmesine ilişkin aydınlatma metni. | KVKK Aydınlatma Metni | `/beyoglu-erkek-kuaforu/kvkk/` |

**Local SEO**
- NAP (tüm sayfalarda birebir): "Beyoğlu Erkek Kuaförü · Kamer Hatun, Balık Sk. No:4, 34435 Beyoğlu/İstanbul · 0535 508 97 22"
- Google Business: (1) **"24 saat açık" saatini düzelt** — en acil iş; (2) "Web sitesi" alanına site adresi, "Randevu bağlantısı"na `…/#randevu`; (3) hizmet listesi ve fiyatlar; (4) salonun kendi fotoğrafları.
- Yorum stratejisi: randevu sonrası WhatsApp teşekkür mesajında Haritalar yorum bağlantısı; yorumlara işletme olarak yanıt.
- Schema: `BarberShop` (ad, adres, telefon, url, hasMap, `knowsLanguage` YOK — teyitsiz) + `FAQPage` (sayfadaki metinle birebir). `aggregateRating` **eklenmez**; `geo` koordinatı bilinmediği için eklenmez; `openingHours` eklenmez.
- `sitemap.xml` (2 URL), canonical, `og:` etiketleri, `lang="tr"`; İngilizce blok `lang="en"`.

**Ölçüm planı:** GA4 şimdilik yok. CTA'lar `data-olay` taşır: `randevu_cta_tik`, `whatsapp_tik`, `telefon_tik`, `yol_tarifi_tik`, `yorum_tik`, `harita_yukle`, `randevu_form_gonder`, `randevu_olustu`, `takvime_ekle_tik`. `olay()` yalnız `window.gtag` varsa gönderir; GA4 çerez onayından sonra yüklenmeli.

## 14 — VISUAL INTELLIGENCE

**Mevcut görseller (taslaktaki 12 kare) — sınıf ve karar:**
| # | Sınıf | Karar |
|---|---|---|
| 2 Salon geneli | ATTENTION + PROOF | **Açılış** (441×537, müşteri arkadan, berber küçük; yüz tanınmıyor) → `salon.webp` |
| 6 üst kısım: tavan göbeği + avize (aynadan) | BRAND | **Salon** → `avize.webp` (küçük, kişi yok) |
| 10 alt kısım: lavabo, tıraş fırçası, köpük kâsesi | PROCESS | **Salon** → `firca.webp` (kişi yok) |
| 11 Fade, arkadan | PROOF (işçilik) | **Salon** → `fade.webp` (soldaki ikinci kişi kırpıldı; yüz yok) |
| 0, 1, 3, 5, 6, 7, 8, 9, 10 üst | EMOTION | **Kullanılmadı** — müşteri yüzleri, rıza yok (SYSTEM LEARNING) |
| 4 Haritalar kartı | — | **Kullanılmadı** (taslakta yanlışlıkla galeride) — yalnız bilgi kaynağı |

Not: fotoğraflar 430–760 px; açılışta en fazla ~440 px genişlikte, çerçeve içinde gösterilir (büyütme yok). Taslaktaki 21:9 tam genişlik ekip bandı kaldırıldı (dikey 497 px kareyi 1900 px'e büyütüyordu).

**Tasarım dili (fotoğraflardan; taslağın paleti korunarak):**
| Öğe | Salondaki karşılığı |
|---|---|
| Koyu yeşil zemin `#10201a` / `#16241e` | Koyu yeşil boyalı ayna çerçeveleri ve dolaplar |
| Adaçayı yeşili, hafif dokulu açık zemin `#a9bba9` (SVG gürültü) | Dokulu yeşil duvar boyası |
| Altın `#c9a961`, iki çizgili boncuklu şerit | Altın kartonpiyer |
| Fotoğraflarda kalın yeşil çerçeve + ince altın iç çizgi | Yeşil çerçeveli aynalar |
| Ahşap tonu `#8a5a34` (fiyat panosu noktaları, ayraç) | Ahşap çekmeceli tezgâh, zemin |
| Oswald (başlık) · Inter (gövde) · IBM Plex Mono (etiket) | Taslağın tipografisi korunur |
Kaçınılanlar (SYSTEM LEARNING): çizgili eyebrow (taslakta vardı → kaldırıldı), büyük puan kutusu (taslakta vardı → metin içi bağlantı), ikonlu kart ızgarası, 3'lü "neden biz", klişe slogan ("usturanın zarafeti" → somut tanım).

**SHOT LIST (salondan istenecek):**
| # | Konu | Açı / ışık | Kullanılacak yer | Sınıf |
|---|---|---|---|---|
| 1 | Salon geniş açı, kişisiz (avize, aynalar, koltuklar) | Kapıdan, yatay, ≥2000 px, ışıklar açık | Açılış | ATTENTION |
| 2 | Cephe ve sokak (tabela, kapı) | Karşı kaldırımdan, gündüz | Adres ("nasıl bulurum") | PROOF |
| 3 | Ustura + fırça + kâse yakın plan | Tezgâhta, yan ışık | Hizmetler / Salon | PROCESS |
| 4 | Davut Abi portresi (kendi izniyle) | Koltuğun yanında, göz hizası | Usta | EMOTION / PROOF |
| 5 | 6–9 bitmiş kesim (müşteri yazılı izinli, arkadan/yan) | Aynı ışık, sade arka plan | Salon | PROOF |
| 6 | Fiyat panosu (varsa) | Düz, okunur | Hizmetler (fiyatlar) | CONVERSION |
| 7 | Logo dosyası (varsa) | — | Üst bant, favicon | BRAND |

Stok/temsili fotoğraf kullanılmadı. Yazı logo **temsili** (web fontuyla).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (tek sayfa + KVKK)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (KVKK gerekli, banner gerekmez)
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı (taslaktan 10 ifade çıkarıldı)
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili öğe (yazı logo) işaretli
- [x] `durum.md` güncellendi
