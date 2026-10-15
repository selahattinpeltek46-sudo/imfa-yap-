# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Proje: Barber Uğur · Girdi: `modul-1-strateji.md` · Tarih: 2026-10-15
Yayın adresi: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/barber-ugur/`

---

## 10 — INFORMATION ARCHITECTURE

Karar: **tek sayfa + KVKK sayfası.** Gerekçe: 3 hizmet, fiyat ve portföy yok; ayrı "hizmetler / hakkımızda / iletişim" sayfaları boş tekrar olur. Arama niyeti (yer + "berber") tek güçlü sayfayla karşılanır; her bölüm bir karar adımına karşılık gelir.

| Sayfa / bölüm | Amaç | Hedef kullanıcı | Temel soru | Verilecek cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` Açılış (tabela + vitrin) | Kim, nerede, nasıl ulaşırım | Tümü | "Bu berber nerede, iyi mi, açık mı?" | Gazi Muhtar Paşa Blv.'da berber, kapanış 20:00 | Google 4,9 ★ / 70 | "şehitkamil berber", "antep berber", marka | Randevu al / WhatsApp / Ara | Hizmetler |
| `/#hizmetler` | Ne yapılıyor | A, B | "İstediğim hizmet var mı, fiyat?" | 3 hizmet; fiyat WhatsApp'tan | Abartısız tanım | "sakal tıraşı şehitkamil" | Hizmeti seçili randevu | Randevu |
| `/#randevu` | Dönüşüm | Karar vermiş | "Nasıl randevu alırım, ne zaman boş?" | Hizmet → gün → boş saat → kod | Ücretsiz, ön ödemesiz, kodla iptal | "berber randevu gaziantep" | Randevuyu onayla / WhatsApp'tan gönder | Kod ekranı → takvime ekle |
| `/#sorular` | İtiraz giderme | Tümü | "Randevusuz olur mu, fiyat, saat, erişim?" | 7 soru-cevap | Şeffaflık | FAQPage | Ara | Adres |
| `/#adres` | Ziyaret | A, C | "Nasıl bulurum, girebilir miyim?" | Adres, tabela tarifi, plus code, erişilebilir giriş, harita | Gerçek adres | Local NAP | Yol tarifi | — |
| `/kvkk/` | Yasal | Form kullanan | "Bilgim nereye gidiyor?" | Aydınlatma metni (şablon) | Şeffaflık | Düşük öncelik | Ana sayfaya dön | — |

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa bölüm sırası:**
1. **Tabela** (siyah bant): küçük menü (Hizmetler · Randevu · Sorular · Adres · telefon) + büyük serif "Barber Uğur" (H1) — cephedeki tabelanın karşılığı.
2. **Vitrin** (koyu çerçeveli cam bölmeler): üst bilgi, tanıtım cümlesi, CTA'lar (Randevu al · WhatsApp · Ara), Google puan bağlantısı; yan bölmede künye (kapanış, adres, telefon, giriş).
3. **Hizmetler**: 3 satır, ad ⋯ "Randevu al" (vitrin/pano yazısı gibi noktalı çizgi); fiyat notu.
4. **Randevu**: açıklama + form (hizmet, gün çipleri, saat çipleri, ad, telefon, not, KVKK onayı) + sonuç ekranı (kod, takvime ekle, WhatsApp).
5. **Sorular** (`<details>`).
6. **Adres**: adres, bilgi listesi, yol tarifi / Haritalar butonları, tıklayınca yüklenen harita.
7. **Alt bilgi** (siyah bant, tabela tekrarı): NAP, WhatsApp, KVKK, puan tarihi.
8. **Mobil sabit alt bar**: Randevu al · WhatsApp · Ara.

**Internal linking planı:**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Menü | `#hizmetler`, `#randevu`, `#sorular`, `#adres` | Hizmetler / Randevu / Sorular / Adres |
| Vitrin | `#randevu` | "Randevu al" |
| Vitrin | Google Haritalar (cid) | "Google'da 4,9 · 70 değerlendirme" |
| Hizmet satırı | `#randevu` (hizmeti önceden seçer) | "Randevu al" |
| Fiyat notu | WhatsApp (fiyat mesajı) | "WhatsApp'tan sorun" |
| Sorular | `#randevu`, `tel:` | "randevu formundan", "arayın" |
| Form, alt bilgi | `/kvkk/` | "KVKK Aydınlatma Metni" |
| KVKK | `/` | "Ana sayfaya dön" |

**Yasal:**
- KVKK Aydınlatma Metni: form ad, telefon, randevu bilgisi topluyor; veri salonun Google hesabına (Takvim/E-Tablo) ve/veya WhatsApp'a gidiyor → **gerekli**, şablon, "hukuki kontrol gerekir".
- Çerez banner'ı: analytics yok; harita yalnız tıklamayla yüklenir → zorunlu olmayan çerez yok → **banner gerekmez**. Google Fonts IP'yi Google'a iletir (çerez değil); KVKK metninde belirtilir. GA4 eklenirse banner zorunlu.

## 12 — COPYWRITING ENGINE

**Title:** Barber Uğur | Berber, Gazi Muhtar Paşa Blv. Şehitkamil
**Meta:** Şehitkamil Mücahitler'de, Gazi Muhtar Paşa Bulvarı üzerinde berber. Google'da 4,9 puan (70 değerlendirme). Boş saati seçin, randevu alın.

**Tabela + vitrin**
- Üst bilgi: Berber · Mücahitler, Şehitkamil
- H1: Barber Uğur
- Tanıtım: Gazi Muhtar Paşa Bulvarı'nda, siyah tabelalı, cam vitrinli dükkân. Boş saatinizi buradan seçin; geldiğinizde koltuk hazır olsun.
- CTA: Randevu al · WhatsApp · Ara
- Puan: ★ Google'da 4,9 · 70 değerlendirme
- Künye: Kapanış — 20:00 · Adres — Gazi Muhtar Paşa Blv. No:46/E · Telefon — 0542 825 33 89 · Giriş — Tekerlekli sandalyeye uygun

**Hizmetler** — H2: Hizmetler
- Giriş: Berberde ne varsa onu yapıyoruz: saç ve sakal. Randevu alırken modelinizi not olarak yazabilirsiniz.
- Saç kesimi — İstediğiniz modeli not alanına yazın ya da fotoğrafını WhatsApp'tan gönderin.
- Sakal tıraşı — Sakalın hattını, boyunu ve şeklini düzeltme.
- Saç & sakal — İkisi bir arada, tek randevuda.
- Not: Fiyatlar oda tarifesine göre dönem dönem değişiyor. Güncel fiyatı WhatsApp'tan sorun. Listede olmayan bir hizmet için de önce yazın.

**Randevu** — H2: Randevu
- Giriş 1: Hizmeti ve günü seçin, o günün boş saatleri listelensin. Seçtiğiniz saat size ayrılır ve ekranda bir randevu kodu görürsünüz.
- Giriş 2: Randevu ücretsizdir, ön ödeme yoktur. Gelemeyecekseniz kodunuzla haber verin; o saati başkasına açalım.
- Telefonla: 0542 825 33 89
- Form: Hizmet · Gün · Saat · Ad soyad · Cep telefonu · Not (isteğe bağlı, örnek: "yanlar kısa, üstü makas") · KVKK onayı
- Buton (API): Randevuyu onayla · (yedek): Randevu talebini WhatsApp'tan gönder
- Form altı (API): Onayladığınızda saat size ayrılır ve dükkânın takvimine işlenir. · (yedek): Talebiniz WhatsApp'ta hazır mesaj olarak açılır. Mesajı gönderince bize ulaşır, saati WhatsApp'tan teyit ederiz.
- Sonuç: Randevunuz alındı · Hizmet / Gün / Saat / Kod · "Değişiklik ya da iptal için bu kodla WhatsApp'tan yazın veya arayın." · Takvimime ekle · WhatsApp · Yeni randevu al

**Sorular** — H2: Sorular
1. Randevusuz gelebilir miyim? — Gelebilirsiniz; koltuk boşsa hemen, değilse kısa bir beklemeyle alırız. Beklemek istemiyorsanız randevu alın ya da arayın.
2. Fiyatlar ne kadar? — Fiyatlar hizmete göre değişir ve dönem dönem güncellenir. Güncel fiyatı WhatsApp'tan ya da telefonla sorabilirsiniz.
3. Çalışma saatleriniz nedir? — Akşam 20:00'de kapatıyoruz. Açılış saati ve tatil günü için gelmeden önce arayın.
4. Tekerlekli sandalyeyle girebilir miyim? — Google Haritalar'da girişimiz tekerlekli sandalyeyle erişilebilir olarak işaretli. Özel bir ihtiyacınız varsa randevu notuna yazın.
5. İstediğim modeli nasıl anlatırım? — Randevu formundaki not alanına yazın ya da beğendiğiniz kesimin fotoğrafını WhatsApp'tan gönderin.
6. Randevumu nasıl değiştirir veya iptal ederim? — Randevu kodunuzla WhatsApp'tan yazın ya da arayın. Gelemeyecekseniz haber vermeniz, o saati başka birine açmamızı sağlar.
7. Dükkân tam olarak nerede? — Mücahitler Mahallesi, Gazi Muhtar Paşa Bulvarı, Gazi Apartmanı No:46/E, Şehitkamil/Gaziantep. Siyah tabelada beyaz harflerle "Barber Uğur" yazar. Haritada "39G8+4J" koduyla da bulabilirsiniz.

**Adres** — H2: Adres · adres bloğu · Telefon ve WhatsApp · Kapanış 20:00 (açılış ve tatil günü için arayın) · Harita kodu 39G8+4J Şehitkamil · Giriş: tekerlekli sandalyeye uygun (Google Haritalar bilgisi) · Tabela tarifi · Butonlar: Yol tarifi / Google Haritalar'da aç · Harita perdesi: "Haritayı göster — Harita Google'dan yüklenir. Siz tıklamadan Google'a bilgi gitmez."

**Alt bilgi:** Barber Uğur · Berber Dükkânı · adres · 0542 825 33 89 · WhatsApp · KVKK Aydınlatma Metni · "Google puanı 15 Ekim 2026 tarihli."

**Kanıtsız iddia taraması:** "en iyi", "usta", "Uğur Usta", "yıllık tecrübe", "hijyen garantisi", "uzman ekip", "premium" **kullanılmadı**. Sayısal iddia yalnız 4,9 / 70 (tarihli, kaynaklı). Erişilebilirlik "Google Haritalar'da işaretli" diye kaynağıyla yazıldı. Kapanış saati "açılış/tatil için arayın" ile birlikte.

## 13 — SEO & ANALYTICS ENGINE

| Intent | Keyword | Page | Message | Content | Proof | CTA |
|---|---|---|---|---|---|---|
| Yerel, işlem | antep berber, gaziantep berber | `/` | Bulvar üzerinde berber, online randevu | Vitrin + hizmetler | 4,9 ★ | Randevu |
| Yerel, semt | şehitkamil berber, mücahitler berber, gazi muhtar paşa bulvarı berber | `/` | Adres ve tabela tarifi | Adres | Harita + plus code | Yol tarifi |
| Hizmet | sakal tıraşı şehitkamil, erkek saç kesimi gaziantep | `/#hizmetler` | Saç, sakal, ikisi birden | Hizmet satırları | — | Randevu |
| Marka | barber uğur, barber uğur gaziantep | `/` | Resmî site | Tümü | NAP | Ara |

| Sayfa | Title (≤60) | Meta (≤155) | H1 | Slug |
|---|---|---|---|---|
| Ana sayfa | Barber Uğur \| Berber, Gazi Muhtar Paşa Blv. Şehitkamil | (12'deki meta) | Barber Uğur | `/barber-ugur/` |
| KVKK | KVKK Aydınlatma Metni \| Barber Uğur | Barber Uğur randevu formu ve iletişim kanallarında paylaşılan kişisel verilerin işlenmesine ilişkin aydınlatma metni. | KVKK Aydınlatma Metni | `/barber-ugur/kvkk/` |

H1 yalnız marka adı: marka araması ve tabela birebirliği için. Yer + kategori sinyali title, meta, üst bilgi satırı, H2'ler ve adres metninde.

**Local SEO**
- NAP (tüm sayfalarda birebir): "Barber Uğur · Mücahitler, Gazi Muhtar Paşa Blv. Gazi Apartmanı No:46/E, 27090 Şehitkamil/Gaziantep · 0542 825 33 89"
- Google Business: yayından sonra profildeki "Web sitesi ekleyin" alanına site adresi; "Randevu bağlantısı" alanına `…/barber-ugur/#randevu`. Profil fotoğrafları ve hizmet listesi doldurulmalı.
- Yorum stratejisi: randevu sonrası WhatsApp teşekkür mesajında Haritalar yorum bağlantısı; yorumlara işletme olarak yanıt.
- Schema: `BarberShop` (ad, adres, geo, telefon, url, hasMap, `amenityFeature` erişilebilir giriş) + `FAQPage`. `aggregateRating` **eklenmedi** (self-serving review kuralı).
- `sitemap.xml` (2 URL), canonical, `og:` etiketleri, `lang="tr"`.

**Ölçüm planı:** GA4 şimdilik yok. Tüm CTA'lar `data-olay` taşır: `randevu_cta_tik`, `whatsapp_tik`, `telefon_tik`, `yol_tarifi_tik`, `yorum_tik`, `harita_yukle`, `randevu_form_gonder`, `randevu_olustu`, `takvime_ekle_tik`. `js/site.js` → `olay()` yalnız `window.gtag` varsa gönderir; GA4 çerez onayından sonra yüklenmeli.

## 14 — VISUAL INTELLIGENCE

**Mevcut görsel:** Haritalar kartındaki cephe fotoğrafı (≈380 px).
- Sınıf: ATTENTION + BRAND + PROOF (gerçek dükkân).
- Analiz: siyah tabela bandı, beyaz kalın serif harfler; koyu çerçeveli cam vitrin; önde ahşap sandalyeler; içeride sıcak kırmızı-turuncu tablo; gündüz, ağaçlı bulvar.
- Kullanım kararı: **Sitede kullanılmadı** — çözünürlük yetersiz, yükleyeni ve kullanım hakkı bilinmiyor (SYSTEM LEARNING). Görsel dil tasarıma aktarıldı.

**Tasarım dili (fotoğraftan türetilen):**
| Öğe | Dükkândaki karşılığı |
|---|---|
| Siyah üst bant + büyük beyaz serif ad (DM Serif Display) | Cephe tabelası |
| Koyu kayıtlı cam bölmeler (vitrin), hafif çapraz yansıma | Cam vitrin ve kapı |
| Ahşap tonu ince şerit ve ayraçlar `#9a6b40` | Kaldırımdaki ahşap sandalyeler |
| Sıcak kırmızı vurgu (CTA) `#b8432f` | İçerideki tablonun rengi |
| Açık taş/kâğıt zemin `#efebe4` | Gündüz ışığı, kaldırım |
| Gövde yazısı Archivo | Sade, okunur dükkân yazısı |
Kaçınılanlar (SYSTEM LEARNING): çizgili eyebrow, ikonlu kart ızgarası, büyük puan kutusu, 3'lü "neden biz", klişe slogan, siyah+altın "lüks".

**SHOT LIST (dükkândan istenecek):**
| # | Konu | Açı / ışık | Kullanılacak yer | Sınıf |
|---|---|---|---|---|
| 1 | Cephe, tabela net, gündüz ve akşam | Karşı kaldırımdan, yatay, ≥2000 px | Vitrin bölümü arka planı | ATTENTION / BRAND |
| 2 | İç mekân geniş açı (koltuk, ayna, duvardaki tablo) | Köşeden, iç ışık açık, kişi yok | Adres / dükkân | PROOF |
| 3 | Makas/makine iş başında yakın plan (yüz yok) | 45°, sığ alan derinliği | Hizmetler | PROCESS |
| 4 | 6–9 bitmiş kesim (müşteri yazılı izinli, çocuk yok) | Sade arka plan, aynı ışık | Galeri (ileride) | PROOF |
| 5 | Giriş kapısı (erişilebilir giriş) | Kaldırımdan | Sorular / adres | PROOF |
| 6 | Logo dosyası (varsa SVG/PDF) | — | Tabela, favicon | BRAND |

Stok/temsili fotoğraf kullanılmadı. Yazı-logo (web fontuyla tabela yorumu) **temsili**.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (tek sayfa + KVKK)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (KVKK gerekli, banner gerekmez)
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili öğe (yazı-logo) işaretli
- [x] `durum.md` güncellendi

---
## GÜNCELLEME — Fotoğraflardan sonra nihai metin ve görsel dil (siteyle birebir)

**Değişen metinler (12):**
- Vitrin tanıtımı: "Gazi Muhtar Paşa Bulvarı'nda, akşamları ışıklı tabelasıyla uzaktan seçilen dükkân. Boş saatinizi buradan seçin; geldiğinizde koltuk hazır olsun."
- Hizmetler girişi: "İçeride ışıklı aynalı koltuklar ve çocuklar için oyuncak araba şeklinde bir tıraş koltuğu var. Modelinizi randevu alırken not olarak yazabilirsiniz."
- Hizmet satırları: Saç kesimi · Sakal tıraşı · Saç & sakal · **Çocuk tıraşı** ("Küçükler oyuncak araba koltuğunda oturuyor.") · **Yüz maskesi** ("Tıraşın ardından yapılıyor; istiyorsanız randevu notuna yazın." → CTA "Sorun", WhatsApp)
- Form hizmetleri: Saç Kesimi · Sakal Tıraşı · Saç & Sakal · Çocuk Tıraşı (Code.gs ile birebir)
- Yeni soru: "Çocuğumu getirebilir miyim?" — "Getirebilirsiniz. Çocuklar için oyuncak araba şeklinde bir tıraş koltuğumuz var. Randevu formunda "Çocuk tıraşı"nı seçin."
- "Dükkân tam olarak nerede?" ve adres tarifi: "Üstte ışıklı "Men's Hair Design" tabelası, altında "Barber Uğur" yazan siyah tente var." / "Kapının önünde ahşap bir oturma grubu var."
- Alt bilgi: "Barber Uğur — Men's Hair Design · Berber"
- Schema: `alternateName: "Barber Uğur Men's Hair Design"`, açıklamaya çocuk tıraşı.

**Görsel dil (14) — güncel:** Gündüz/serif yorumunun yerine gece cephesi:
| Öğe | Dükkândaki karşılığı |
|---|---|
| Sıcak turuncu ışıklı, dikey çıtalı kutu + siyah plaka "Men's Hair Design" + makas | Üst tabela |
| Koyu tente içinde büyük, geniş, kalın "Barber Uğur" (H1, Archivo 118% genişlik) | Tente yazısı (kalın sans; ilk gündüz fotoğrafından "serif" çıkarımı düzeltildi) |
| Koyu kayıtlı cam bölmeler + hafif çapraz yansıma + turuncu ışık sızması | Gece aydınlık vitrin |
| Taş gri şerit + ahşap çizgi | Kaldırım ve ahşap oturma grubu |
| Açık gri zemin `#e6e5e1` | İçerideki gri duvar |
| Gül kırmızısı `#b8432f` (CTA) | Duvar resmindeki güller |
| Seçili saat çipinde turuncu alt çizgi, harita perdesi çıtalı ışık | LED aynalar / tabela |

**SHOT LIST'e ek:** gönderilen 5 fotoğrafın **orijinal dosyaları** (sohbetten alınamadı) — özellikle iki iç mekân geniş açı (kişi yok, doğrudan kullanılabilir) ve gece cephe (tabela kırpılarak).
