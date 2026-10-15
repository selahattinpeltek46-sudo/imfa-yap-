# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Barber Uğur** · Klasör: `barber-ugur/` · Tarih: 2026-10-15
Girdi: kullanıcının paylaştığı Google Haritalar işletme kartı ekran görüntüsü + Haritalar bağlantısı ("antep berber" aramasından) + "şimdi sırada bu var, hazırlayalım" talebi.

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Barber Uğur (tabelada da "Barber Uğur") | DOĞRULANMIŞ (Haritalar kartı + cephe fotoğrafı) |
| Sektör | Berber; Haritalar kategorisi "Berber Dükkânı" | DOĞRULANMIŞ |
| Adres | Mücahitler, Gazi Muhtar Paşa Blv. Gazi Apartmanı No:46/E, 27090 Şehitkamil/Gaziantep | DOĞRULANMIŞ (Haritalar) |
| Plus code / koordinat | 39G8+4J Şehitkamil · 37.0753689, 37.366534 (URL'den) | DOĞRULANMIŞ |
| Haritalar cid | `0x585050b52beddf6f` → 6363675012530823023 | DOĞRULANMIŞ (URL'den hesaplandı) |
| Telefon | 0542 825 33 89 | DOĞRULANMIŞ |
| WhatsApp | Aynı numara (mobil hat) | [VARSAYIM] — teyit gerek |
| Çalışma saati | Görüntünün alındığı gün "Açık · Kapanış 20:00"; açılış saati ve kapalı gün BİLİNMİYOR | DOĞRULANMIŞ (kısmi) |
| Google puanı | 4,9 ★ · 70 değerlendirme (15.10.2026 itibarıyla) | DOĞRULANMIŞ |
| Erişilebilirlik | Kartta tekerlekli sandalye simgesi (Google'da "tekerlekli sandalyeyle erişilebilir giriş" özelliği) | DOĞRULANMIŞ (Haritalar özelliği) |
| Web sitesi | Yok (kartta "Web sitesi ekleyin") | DOĞRULANMIŞ |
| Sosyal medya | Bulunamadı | BİLİNMİYOR |
| Hizmetler | Kategori "Berber Dükkânı" → saç kesimi, sakal tıraşı | Kategori DOĞRULANMIŞ, hizmet listesi [VARSAYIM] |
| Fiyatlar | — | BİLİNMİYOR |
| Ticari amaç | Randevu / ziyaret almak, Haritalar'dan gelen kişiye güven vermek | [VARSAYIM] |
| Görseller | Yalnız Haritalar kartındaki cephe fotoğrafı (≈380 px, yükleyeni ve kullanım hakkı belirsiz) | DOĞRULANMIŞ / kullanım hakkı BİLİNMİYOR |

Repo incelemesi: firmaya ait klasör yoktu; `barber-ugur/` yeni açıldı. En yakın emsal `barbers-town/` (aynı şehirde berber, aynı gün) — randevu sistemi şablonu oradan alınır (SYSTEM LEARNING).

**Cephe fotoğrafı gözlemi (gündüz çekimi):** siyah tabela bandında beyaz, kalın serifli "Barber Uğur" yazısı · koyu çerçeveli büyük cam vitrin, cam kapı · dükkân önünde kaldırımda ahşap sandalyeler/oturma yeri · içeride duvarda büyük, sıcak renkli (kırmızı-turuncu-sarı) bir tablo · solda kaldırımda yazılı bir pano (içeriği okunamıyor) · ağaçlı bulvar.
→ Marka dili: **gündüz, açık, vitrinli mahalle dükkânı**; siyah tabela + beyaz serif harf + ahşap + tablodaki sıcak kırmızı.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ad, adres, telefon, plus code, kategori, koordinat | DOĞRULANMIŞ |
| 2 | Google 4,9 ★ / 70 değerlendirme | DOĞRULANMIŞ (tarih + kaynakla kullanılacak) |
| 3 | Kapanış 20:00 (en az bir gün için) | DOĞRULANMIŞ (kısmi) |
| 4 | Tekerlekli sandalyeyle erişilebilir giriş | DOĞRULANMIŞ (Google özelliği; işletme/kullanıcı beyanına dayanır) |
| 5 | Siyah tabela, beyaz serif "Barber Uğur" yazısı, cam vitrin, önünde oturma yeri | DOĞRULANMIŞ (fotoğraf) |
| 6 | İnternette (web, haber, rehber) işletmeye dair başka iz yok | ARAŞTIRMA BULGUSU |
| 7 | Bulvar üzerinde zemin kat dükkân ("No:46/E") | ARAŞTIRMA BULGUSU (adres + fotoğraftan çıkarım) |
| 8 | WhatsApp hattı = telefon | [VARSAYIM] |
| 9 | Hizmetler: saç kesimi, sakal tıraşı, saç + sakal | [VARSAYIM] — "berber dükkânı" kategorisinin çekirdeği; form ve `Code.gs`'den düzenlenir |
| 10 | Usta sayısı / koltuk sayısı | BİLİNMİYOR → randevu sisteminde 1 koltuk [VARSAYIM] (en temkinli değer, çift rezervasyonu önler) |
| 11 | "Uğur" kişi adı mı, usta mı | BİLİNMİYOR — sitede "Uğur Usta" gibi kişi iddiası yapılmaz, yalnız marka adı kullanılır |
| 12 | Kuruluş yılı, tecrübe | BİLİNMİYOR — kullanılmayacak |
| 13 | Fiyat | BİLİNMİYOR — "fiyatı WhatsApp'tan sorun" |
| 14 | Kart ile ödeme, otopark, çocuk tıraşı | BİLİNMİYOR — kullanılmayacak |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| YÜKSEK | WhatsApp'ın bu numarada aktif olması | Birincil/yedek CTA WhatsApp | 09, 16, 20 | Aktif [VARSAYIM]; telefon her yerde yanında |
| YÜKSEK | Gerçek hizmet listesi ve fiyatlar | Yanlış hizmet = güven kaybı | 08, 12 | 3 çekirdek hizmet (saç, sakal, saç+sakal), fiyat yok |
| YÜKSEK | Gerçek fotoğraflar (iç mekân, işler) | Berberde karar görselle verilir | 14 | Fotoğrafsız, tabela/vitrin dilinden türetilmiş tipografik tasarım + SHOT LIST |
| ORTA | Haftalık çalışma saatleri | "Şimdi gidebilir miyim?" | 11, 12, randevu | Yalnız "kapanış 20:00" yazılır; randevu sisteminde 09:00–20:00, Pazar kapalı [VARSAYIM] |
| ORTA | Koltuk/usta sayısı, hizmet süreleri | Randevu kapasitesi | 16 | 1 koltuk; 30 / 20 / 45 dk [VARSAYIM] |
| ORTA | Instagram hesabı | Saç modeli portföyü | 10, 13 | Yok; eklenince footer'a |
| DÜŞÜK | Logo dosyası | Marka tutarlılığı | 14 | Tabeladaki serif yazının web fontuyla yorumu (temsili) |
| DÜŞÜK | İzinli yorum alıntıları | Sosyal kanıt | 07 | Alıntı YOK; yalnız puan + Haritalar bağlantısı |

KRİTİK eksik yok: telefon ve adres doğrulanmış; site yayına uygun bir sürümle teslim edilebilir.

## 04 — DEEP RESEARCH

**Bulgu 1 — İşletmenin çevrimiçi izi**
Kaynak: "Barber Uğur" Gaziantep Şehitkamil web araması (2026-10-15) — işletmeye ait sonuç yok; Haritalar sayfası konteynerden açılamıyor (SYSTEM LEARNING).
Yorum: Tek dijital varlık Haritalar profili. Site; adını arayan, Haritalar'da "web sitesi"ne tıklayan ya da WhatsApp'ta link paylaşılan kişi için **dijital vitrin + randevu kapısı** olmalı.

**Bulgu 2 — Fiyat düzenlemesi**
Kaynak: Türkiye Gazetesi ve TGRT Haber 2026 haberleri (berber tarifeleri semtten semte değişiyor, yıl içinde zamlar); Ocak 2026'da Gaziantep Berberler Esnaf Odası'nın 2026 A sınıfı tarifesi yayımladığı bilgisi (rakamlar arama sonucunda yok).
Yorum: Fiyat oda tarifesine bağlı ve yıl içinde değişiyor → sitede sabit fiyat yazılmaz; "güncel fiyatı sorun".

**Bulgu 3 — Konum bağlamı**
Kaynak: Haritalar kartı (Mücahitler, Gazi Muhtar Paşa Bulvarı, Şehitkamil); fotoğrafta ağaçlı, işlek bulvar ve yan yana dükkânlar. Web aramasında bulvar hakkında ek kaynak çıkmadı.
Yorum: Bulvar üzerinde, yoldan geçenin gördüğü bir dükkân [VARSAYIM: yaya + araçla geçen trafik]. "Nasıl bulurum" sorusu için tabela tarifi (siyah tabela, beyaz yazı) ve plus code değerli.

**Bulgu 4 — Puan/yorum hacmi**
Kaynak: Haritalar kartı — 70 değerlendirmede 4,9.
Yorum: Güçlü sosyal kanıt; sitenin ana kanıt halkası (tarih + bağlantıyla, uydurma alıntı olmadan). `aggregateRating` JSON-LD'ye eklenmez (SYSTEM LEARNING).

**Bulgu 5 — Arama niyeti**
Kaynak: kullanıcının Haritalar araması "antep berber" (URL'deki sorgu).
Yorum: "antep berber", "gaziantep berber", "şehitkamil berber", "mücahitler berber" gibi yer + kategori aramaları. Çoğu Haritalar'da çözülür; site, profile "web sitesi" olarak eklendiğinde güven ve yerel SEO sinyali olur.

**Bulgu 6 — Erişilebilirlik**
Kaynak: Haritalar kartındaki tekerlekli sandalye simgesi.
Yorum: Mahalle berberlerinin çoğunda basamak var; bu özellik yaşlı, engelli ya da bebek arabalı ziyaretçi için gerçek bir karar unsuru. Sitede "Google'da belirtildiği üzere" diye, abartısız yazılır.

**Bulgu 7 — Randevu standardı**
Kaynak: `barbers-town/` projesi (aynı şehir, aynı hafta) ve Fresha'daki berber listeleri.
Yorum: Online boş saat gösteren randevu, berber sitelerinde beklenen standart. Ücretsiz Apps Script + Google Takvim şablonu hazır → yeniden kullanılır; kurulana kadar WhatsApp modu.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Mahalle / bulvar çevresinde yaşayan veya çalışan erkek (20–55) [VARSAYIM]
| Alan | İçerik |
|---|---|
| Tetikleyici | Saçın uzaması, hafta sonu/düğün/bayram, iş toplantısı |
| İhtiyaç | Yakın, temiz, istediğini anlayan berber; beklememek |
| Problem | Akşam ve cumartesi sıra; berberin müsait olup olmadığını bilmemek |
| Karar mekanizması | Kendisi; Haritalar puanı, yakınlık, arkadaş tavsiyesi |
| Karar kriteri | Puan, yürüme mesafesi, açık olması, fiyat |
| İçsel risk | "İstediğim gibi olmaz", "boşuna gidip beklerim" |
| Dışsal / sosyal risk | Kötü kesimle işte/çevrede görünmek |
| Arzu | Temiz, düzgün, "elden geçmiş" görünüm; kısa sürede çıkmak |
| İtiraz | "Sıra var mıdır?", "Fiyatı ne?" |
| Müşteri dili | "abi yanları kısa, üstü makas", "sakalı düzeltelim", "akşam gelsem müsait misin", "kaçta kapatıyorsun" |
| Güven ihtiyacı | Gerçek puan, net adres, açık saat |
| Beklenen sonuç | Gittiğinde koltuğun hazır olması |
| Daha derin problem | Zamanını boşa harcamamak, kendini bakımlı hissetmek |

### Segment B — Özel gün (düğün, nişan, bayram öncesi)
Tetikleyici: tarih yaklaşınca · İhtiyaç: kesin saat · İtiraz: "bayram öncesi yer bulamam" · Mesaj: "günü önceden ayırtın".

### Segment C — Erişim ihtiyacı olan ziyaretçi (yaşlı, tekerlekli sandalye kullanan, refakatçi)
Tetikleyici: rutin tıraş · İhtiyaç: basamaksız giriş, bekleme olmadan hizmet · Karar: kişi + yakını · Mesaj: "Girişimiz tekerlekli sandalyeye uygun (Google'da belirtildiği gibi); saat ayırtın, beklemeyin."

## 06 — MARKET & COMPETITOR INTELLIGENCE
(Puanlama yok.)

| Tür | Rakip | Konumlanma | Mesaj | Güven unsuru | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Şehitkamil'deki diğer berberler ("antep berber" sonuçları) | Mahalle berberi | Ad + telefon | Haritalar puanı | Mahalle | Çoğunun web sitesi ve online randevusu yok |
| DOĞRUDAN | "Barber/barbershop" konseptli yeni nesil erkek salonları | Deneyim, tasarım | Instagram işleri | Fotoğraf portföyü | Genç, stil odaklı | Barber Uğur'un portföyü yok → SHOT LIST |
| DOLAYLI | AVM'lerdeki kuaför zincirleri | Kolaylık | Kampanya | Marka | Alışverişe gelen | Bulvar üzerinde, yürüme mesafesi |
| ALTERNATİF | Evde kendi kesimi / eve gelen berber | Ucuz, kolay | — | — | Fiyat duyarlı | Profesyonel sonuç, beklemesiz randevu |

Not: Haritalar konteynerden taranamadığı için rakip adları listelenmedi (uydurulmadı).

## 07 — MESSAGE ENGINE

**Ana mesaj:** "Gazi Muhtar Paşa Bulvarı'ndaki berber — saatini seç, gelince bekleme."

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A | Sıra, belirsizlik | "Boşuna gidip beklerim" | Gelince koltuğa oturmak | Online boş saat seç / WhatsApp | Google 4,9 ★ · 70 değerlendirme (tarihli, bağlantılı) | Randevu al |
| B | Özel günde yer bulamamak | "O gün dolu olur" | Kesin saat | 3 hafta öncesine kadar randevu | Aynı puan | Randevu al |
| C | Basamak, bekleme | "Girebilir miyim?" | Rahat giriş | Erişilebilir giriş + saatli randevu | Google erişilebilirlik özelliği | Ara / randevu |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Sırada beklemek, açık mı değil mi bilmemek |
| Çözüm | Saatli randevu: saç, sakal, saç + sakal |
| Fayda | Gelince beklemeden koltuğa oturmak; modeli önceden yazmak |
| Süreç | 1) Hizmet + gün → 2) Boş saati seç → 3) Ad + telefon → randevu kodu (sistem kurulana kadar: WhatsApp mesajı → dükkân teyit eder) |
| Kanıt | Google 4,9 ★ · 70 değerlendirme (15.10.2026) — DOĞRULANMIŞ |
| Risk azaltma | Randevu ücretsiz, ön ödeme yok, kodla iptal/değişiklik. Garanti/indirim YOK (firmanın sunduğu bilinmiyor) |
| CTA | "Randevu al" · "WhatsApp" · "Ara" |

## 09 — CONVERSION ENGINE

Yolculuk: **Dikkat** (Haritalar / paylaşılan link; tabela gibi siyah bant + büyük serif ad) → **Anlama** (Berber, Gazi Muhtar Paşa Blv., kapanış 20:00) → **İlgi** (hizmetler) → **Güven** (4,9 ★/70, gerçek adres, erişilebilir giriş) → **Risk azaltma** (ücretsiz, ön ödemesiz, kodla iptal) → **Aksiyon** (randevu).

CTA hiyerarşisi:
- Birincil: **Randevu al** (sayfa içi form; API yoksa WhatsApp mesajı üretir)
- İkincil: **WhatsApp** (`wa.me/905428253389`, hazır mesaj) ve **Ara** (`tel:+905428253389`)
- Üçüncül: **Yol tarifi** (Google Haritalar, koordinatla) · Google yorumları

Next step: Açılış → randevu / WhatsApp · Hizmetler → hizmeti önceden seçerek forma · Randevu → kod ekranı (takvime ekle) · Adres → yol tarifi · Mobilde sabit alt bar (Randevu + WhatsApp + Ara).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (Segment A)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta (Google puanı, erişilebilirlik özelliği) dayanıyor
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi

---
## GÜNCELLEME — Kullanıcının gönderdiği 5 fotoğraf (aynı oturum, 2026-10-15)

Fotoğraflar sohbette görüldü, **diske dosya olarak ulaşmadı** (SYSTEM LEARNING'deki bilinen durum) → sitede kullanılamadı; bilgiler metne ve tasarıma aktarıldı.

| Yeni bilgi | Kaynak fotoğraf | Önceki → yeni sınıf |
|---|---|---|
| Üstte arkadan aydınlatmalı, dikey çıtalı "✂ Men's Hair Design" tabelası; altında siyah tentede "Barber Uğur" | Gece cephe | BİLİNMİYOR → DOĞRULANMIŞ |
| Kapı önünde ahşap oturma grubu (2 sandalye, kanepe, masa); taş döşemeli kaldırım | Gece cephe | DOĞRULANMIŞ |
| Haritalar fotoğrafındaki soldaki pano **komşu marketin** panosu ("…DİBELLİ MARKET") — fiyat listesi değil | Gece cephe | belirsiz → DOĞRULANMIŞ |
| İçeride altın LED çerçeveli aynalı, siyah-altın koltuklu 4+ istasyon; gri duvar; spot ışıklar | İç mekân (gündüz, cadde görünür) | DOĞRULANMIŞ |
| Güllü, sakallı berber figürlü büyük duvar resmi (turuncu-kırmızı güller) | 3 fotoğraf | DOĞRULANMIŞ |
| Çocuklar için oyuncak araba şeklinde tıraş koltuğu | İç mekân (beyaz tuğla desenli bölüm) | → **Çocuk tıraşı** hizmeti DOĞRULANMIŞ |
| Müşteride yüz maskesi | Ayna selfie'si | → **Yüz maskesi** DOĞRULANMIŞ (tek kare; süre/fiyat BİLİNMİYOR → randevu hizmeti yapılmadı, "Sorun") |
| Siyah mermer desenli lavabo tezgâhı, kumaş/deri bekleme koltukları, altın barok aynalar | İç mekân | DOĞRULANMIŞ |
| Logolu siyah tişörtlü en az 3 çalışan | Ayna selfie'si | Ekip >1 kişi → randevuda 2 koltuk [VARSAYIM] |

⚠️ **Tutarlılık notu:** Beyaz 3D tuğla duvar kâğıdı + çapraz çıtalı siyah raflı 3 istasyonlu bölüm ile gri duvarlı altın LED aynalı bölüm farklı görünüyor. Duvar resmi her ikisinde de var → aynı dükkânın iki alanı ya da tadilat öncesi/sonrası olabilir [VARSAYIM: aynı dükkân]. Kullanıcıya soruldu.

**Hizmet listesi (03 güncellemesi):** Saç kesimi · Sakal tıraşı · Saç & sakal ([VARSAYIM], kategori çekirdeği) · Çocuk tıraşı (fotoğraf) · Yüz maskesi (fotoğraf, yalnız WhatsApp'tan bilgi).
**Kişi/çocuk yüzü:** Ayna selfie'si ve gece cephe fotoğrafında müşteri ve çalışan yüzleri var → dosyalar gelse bile açık rıza olmadan yayımlanmaz; gece cephe yalnız tabela kısmı kırpılarak kullanılabilir.
