# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Şeker Mobilya** · Klasör: `seker-mobilya/` · Tarih: 2026-10-20
Girdi: (1) Google Haritalar işletme kartı ekran görüntüsü (`kaynak-haritalar-karti.png`), (2) Instagram profili `@sekermobilya` ekran kaydı (26 sn, 1810×896; profil başlığı + ızgaranın üst ~70 paylaşımı; başlık karesi `kaynak-instagram-profil.png`), (3) kullanıcı talebi: "web sitesi analiz, değerlendirme, uygulama, tasarım ve SEO uzmanı gibi; önce analiz et, nasıl yapman gerektiğini çıkar; estetik, anlaşılır, premium olsun".

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Haritalar: "Şeker mobilya, mobilya imalatı, mobilya tadilatı, Ev dekorasyonu" · Instagram: kullanıcı adı `sekermobilya`, görünen ad "Kemal Şeker Mobilya" · Logo: "ŞEKER MOBİLYA" | DOĞRULANMIŞ |
| Marka adı (sitede) | **Şeker Mobilya** — Haritalar adındaki ekler anahtar kelime (aşağıda risk notu) | Karar |
| Sektör | Haritalar kategorisi "Mobilya İmalatçısı"; Instagram kategorisi "Mobilya"; bio "Özel Tasarım Mobilya" | DOĞRULANMIŞ |
| Adres 1 (Haritalar) | Yenibosna Merkez, Ahmet Yesevi Cd. No:120, 34192 Bahçelievler/İstanbul · plus code 2R3Q+4H → 8GHC2R3Q+4H → 41.00281, 28.83894 | DOĞRULANMIŞ (kart) / koordinat hesaplandı |
| Adres 2 (Instagram) | Atatürk Mahallesi, İkitelli Cd. Şekeroğulları İş Merkezi No:50, 34307 Küçükçekmece, İstanbul | DOĞRULANMIŞ (bio) — **hangisinin mağaza, hangisinin atölye olduğu BİLİNMİYOR** |
| Telefon | 0535 761 85 38 (Haritalar) → +90 535 761 85 38 | DOĞRULANMIŞ |
| WhatsApp | Numara mobil hat; WhatsApp'ta kayıtlı olduğu | [VARSAYIM] — test edilmeli |
| Çalışma saati | Kayıt günü (20.10.2026, Salı) "Açık · Kapanış saati: 21:00" | DOĞRULANMIŞ (yalnız o gün) |
| Google puanı | 4,9 ★ · 93 değerlendirme (20.10.2026) | DOĞRULANMIŞ |
| Web sitesi | Haritalar'da `sekermobilya.wordpress.com` — adres **DNS'te çözülmüyor** (2026-10-20 kontrolü: `ENOTFOUND`) → Haritalar'dan gelen ziyaretçi ölü bağlantıya gidiyor | DOĞRULANMIŞ |
| Instagram | 972 gönderi · 6.763 takipçi · 57 takip · bio: "✨ Evinize Tat Katıyoruz · Özel Tasarım Mobilya · TV Ünitesi • Giyinme Odası • Portmanto · Mutfak • Banyo • Yatak Odası… devamı" · öne çıkanlar: Ünlüyüz!, Keşif, Fatih Ürek, Çimstone, Mağazamız, Şekeroğulları | DOĞRULANMIŞ |
| YouTube | youtube.com/@sekermobilya (bio bağlantısı; içerik incelenemedi — konteynerden erişim yok) | DOĞRULANMIŞ (varlık) |
| Logo | Kırmızı halka içinde nane yeşili oval, beyaz "ŞK" monogramı, "1979"; altında kırmızı "ŞEKER", nane yeşili "MOBİLYA" | DOĞRULANMIŞ (profil fotoğrafı) |
| Kuruluş yılı | Logoda "1979" yazıyor | KULLANICI / MÜŞTERİ BİLGİSİ (firma beyanı) — teyit edilene kadar "x yıllık tecrübe" yazılmaz |
| Ürün / hizmet | Paylaşımlarda görülen işler: TV ünitesi ve duvar ünitesi (LED'li raf, mermer görünümlü panel, ceviz kaplama), çıtalı duvar paneli, giyinme odası (cam kapaklı LED'li, düz kapaklı), gardırop ve gömme dolap, portmanto / antre duvarı, banyo dolabı + LED ayna + boy dolap + çamaşır makinesi dolabı, **baştan sona banyo yenileme**, mutfak (çekmece sistemleri, kiler boy dolabı), genç/çocuk odası (ranza, kemerli niş, lila lake), **lake petek kapama**, kapı lake boyama, konsol / dekoratif duvar | DOĞRULANMIŞ (fotoğraf + kapak yazıları) — kapsam sınırı BİLİNMİYOR |
| Ticari amaç | Bahçelievler–Küçükçekmece hattından ölçü/keşif talebi; Haritalar'daki ölü site bağlantısını gerçek bir vitrinle değiştirmek | [VARSAYIM] |
| E-posta | — | BİLİNMİYOR |

**Repo incelemesi:** firmaya ait klasör yoktu → `seker-mobilya/` açıldı. Önceki mobilya projesi `aytac-mobilya/` yöntem için referans alındı, dosyaları paylaşılmadı (her site kendi kimliğiyle).

**Instagram ızgarası gözlemi (ekran kaydından ~55 tekil paylaşım, 47'si seçildi):**
- **Görsel dil:** açık gri / kırık beyaz mat lake, yer yer ceviz kaplama ve sıcak altın ışık; **dikey çıtalı (yivli) panel** neredeyse her işte var (yatak başı duvarı, banyo boy dolabı kenarı, antre duvarı, TV duvarı); **gizli LED** (tavan bandı, raf altı, ayna arkası, dolap içi); oval / yuvarlak / yarım ay aynalar; mermer görünümlü panel.
- **Kapsam:** firma tek parça dolaptan çok **odanın tamamını** bitiriyor: "Baştan Sona Yepyeni Banyo", "Baştan sona yepyeni mutfak", "Lake Boyama Petek Kapama", "After" etiketli lake boyalı kapı. Haritalar adındaki "mobilya tadilatı, ev dekorasyonu" bununla uyumlu.
- **Önce kareleri:** "PVC plastik duvar ve hazır dolap yeterli" (eski banyo), boş oda "2026 Modern TV Ünitesi", sökülmüş kapı "Beyaz bir portmanto yeterli". Hangi "sonra" karesine ait oldukları kesin değil → **önce/sonra çifti olarak eşleştirilmez**, "işe başladığımız gün" karesi olarak kullanılır.
- **Kapak yazıları:** Reels kapaklarında büyük beyaz yazı var ("Çok özel, lake genç kız odası"). Yazılı kareler premium vitrin için uygun değil → yalnız galeride, yazısız kareler sayfa başlarında.
- **Kişi:** seçilen karelerde insan yüzü yok (bir karede yalnız el). Haritalar kapak fotoğrafında bir kişi var → kullanılmaz.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ad, Haritalar adresi, plus code, telefon, kategori, Instagram kullanıcı adı | DOĞRULANMIŞ |
| 2 | Google 4,9 ★ / 93 değerlendirme (20.10.2026) | DOĞRULANMIŞ — sitede tarih + kaynak linkiyle; JSON-LD'ye `aggregateRating` konmaz |
| 3 | O gün kapanış 21:00 | DOĞRULANMIŞ (kısmi) — haftalık saat gibi yazılmaz |
| 4 | Instagram'daki ikinci adres (Küçükçekmece, Şekeroğulları İş Merkezi) | DOĞRULANMIŞ (bio) — rolü BİLİNMİYOR |
| 5 | Slogan "Evinize Tat Katıyoruz" | DOĞRULANMIŞ (bio) — firmanın kendi sloganı, kullanılabilir |
| 6 | "1979" | Firma beyanı (logo) — logo içinde görünür, metinde yıl hesabı yapılmaz |
| 7 | Hizmet listesi (01'deki) | DOĞRULANMIŞ (fotoğraf + bio) |
| 8 | Görsel dil: mat lake + çıtalı panel + gizli LED + ceviz + oval ayna | DOĞRULANMIŞ (fotoğraf) |
| 9 | Firma "oda bitiren" bir iş yapıyor (dolap + panel + ışık + boya + banyo yenileme) | ARAŞTIRMA BULGUSU (kapak yazıları + Haritalar adı) |
| 10 | Eski site `sekermobilya.wordpress.com` kapalı | DOĞRULANMIŞ (DNS) |
| 11 | Web'de (rehber, Armut vb.) firmaya dair başka kayıt bulunamadı | ARAŞTIRMA BULGUSU |
| 12 | "Çimstone" öne çıkanı | DOĞRULANMIŞ (başlık) — bayilik / tezgâh malzemesi ilişkisi BİLİNMİYOR → kullanılmaz |
| 13 | "Ünlüyüz!" / "Fatih Ürek" öne çıkanları | DOĞRULANMIŞ (başlık) — bağlam ve izin BİLİNMİYOR → sitede ünlü adı **kullanılmaz** |
| 14 | "Keşif" öne çıkanı | DOĞRULANMIŞ (başlık) — keşfin ücretli/ücretsiz olduğu BİLİNMİYOR → "ücretsiz keşif" yazılmaz |
| 15 | Fiyat, garanti, teslim süresi, malzeme markası | BİLİNMİYOR — vaat edilmez |
| 16 | Hizmet bölgesi | Bahçelievler + Küçükçekmece DOĞRULANMIŞ (adresler); İstanbul Avrupa yakası geneli [VARSAYIM] |
| 17 | Görsel kullanım hakkı | Firmanın kendi Instagram'ı, site firma adına → [VARSAYIM] izinli; yazılı onay istenir |
| 18 | Görsel çözünürlüğü | Ekran kaydından 348×428 px | DOĞRULANMIŞ — orijinaller istenir |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| **KRİTİK** | İki adresin rolü (mağaza / atölye / eski adres?) | Yanlış adrese gelen müşteri; NAP tutarlılığı (Google, Instagram, site aynı adresi söylemeli) | 09, 13, 16, 20 | Sitede yalnız **Haritalar adresi** (yorumların bağlı olduğu kayıt) yayınlanır + "gelmeden önce arayın". İkinci adres `js/ayarlar.js`'te hazır, teyitle tek satırda açılır. |
| YÜKSEK | 0535 hattı WhatsApp'ta mı | Birincil CTA | 09, 16, 20 | Evet [VARSAYIM]; WhatsApp ve arama düğmesi yan yana, biri çalışmazsa öteki var |
| YÜKSEK | Fotoğrafların orijinalleri | Kareler 348 px; büyük ekranda yumuşar | 14, 16 | Kareler doğal boyutta (büyütmeden), çok-kare kolaj düzeni |
| YÜKSEK | Haftalık çalışma saatleri | "Bugün gidebilir miyim?" | 12, 13 | Yalnız "Haritalar'da bugünkü saati görün" + "arayın" |
| ORTA | Keşif ücreti, ölçü süreci, ortalama teslim süresi | Risk azaltma, SSS | 08, 12 | Süreç adımları adlandırılır, süre ve ücret yazılmaz |
| ORTA | Malzeme bilgisi (MDF lam, lake, akrilik; menteşe markası; Çimstone ilişkisi) | Kalite kanıtı | 12 | Malzeme yalnız fotoğrafta görülen yüzey adıyla anılır (lake, ceviz görünümlü kaplama, mermer görünümlü panel) |
| ORTA | Kuruluş yılı teyidi (1979) | Güçlü güven unsuru olabilir | 07, 12 | Teyide kadar yalnız logoda kalır |
| ORTA | Hizmet bölgesi sınırı | Yerel SEO | 13 | "Bahçelievler ve Küçükçekmece'den çalışıyoruz; ilçenizi yazın" |
| DÜŞÜK | E-posta, YouTube içerikleri | Footer, video kanıt | 13, 14 | E-posta yok; YouTube bağlantısı footer'da |
| DÜŞÜK | Ünlü müşteri paylaşımının izni | Güven unsuru | 07 | Kullanılmaz |

## 04 — DEEP RESEARCH

**1. Firmanın dijital izi**
- **Kaynak:** Haritalar kartı (web sitesi alanı) + `sekermobilya.wordpress.com` DNS sorgusu (2026-10-20: ENOTFOUND); web araması `"Şeker Mobilya" Bahçelievler Yenibosna` — firmaya ait sonuç yok.
- **Yorum:** Firma internette Instagram (6.763 takipçi, 972 paylaşım) + Haritalar (93 yorum) ile var; ama Haritalar'daki "Web sitesi" düğmesi **ölü bir adrese** gidiyor. Bu, karar anındaki müşteriyi kaybettiren en ucuz düzeltilecek hata: yeni site yayınlanınca Haritalar'daki bağlantı değiştirilmeli (handoff'ta 1 numaralı müşteri aksiyonu).

**2. Yerel pazar ve rakip dili**
- **Kaynak:** armut.com/bahcelievler-marangoz, armut.com/istanbul-ozel-mobilya-yapimi, armut.com/bahcelievler-cekmece-yapimi — profiller "20 yıllık tecrübe", "50 yıldır mobilyacılık", "40 yıllık aile geleneği" gibi kendi beyanlarını kullanıyor; hizmet listeleri aynı (mutfak, banyo dolabı, gardırop, TV ünitesi); bir kısmı "3D çizim" vurguluyor.
- **Yorum:** Rakiplerin dili yıl sayısı ve sıfat üzerine. Şeker'in ayrışması sıfattan değil **görünen işten** gelir: aynı dil (çıtalı panel + gizli ışık + lake) her işte tekrar ediyor → bu bir "imza". Site bu imzayı adlandırır.

**3. Arama niyeti**
- **Kaynak:** Instagram kapak yazıları firmanın kendi anahtar kelimeleri: "Modern TV Ünitesi", "Modern Duvar Ünitesi", "Lake Boyama Petek Kapama", "Modern Antre Duvar Dekorasyonu", "Gömme alanlar için iki portmanto", "Modern düz kapaklı giyinme odası", "İnox renk kapak modern banyo dolap", "Küçük banyoya çekmeceli dolap". Web araması "lake petek kapama İstanbul" — ilgili ticari sonuç dönmedi.
- **Yorum:** "petek kapama", "giyinme odası", "portmanto", "TV ünitesi" + ilçe adı aramalarında yerel rekabet zayıf görünüyor (arama sonucu yok ≠ hacim yok; Search Console verisiyle doğrulanmalı). Bu yüzden sayfalar Instagram'daki gerçek kapak ifadeleriyle adlandırılır. Fiyat ölçüye bağlı → fiyat yazılmaz, "ölçü + fotoğraf gönderin" denir.

**4. Güncel eğilimler (firmanın kendi ızgarasından)**
- **Kaynak:** Instagram ızgarası (yeni → eski).
- **Yorum:** Çıtalı panel, tavan bandında LED, oval LED ayna, cam kapaklı ışıklı giyinme odası, asma klozet + tezgâh üstü lavabo — 2024–2026 konut tadilatının yaygın dili. Kapak yazılarında "2026" vurgusu var → güncellik firmanın kendi anlatısı.

**5. Güven unsurları**
- **Kaynak:** Haritalar (4,9 / 93), Instagram (972 paylaşım), iki fiziksel adres, logo "1979".
- **Yorum:** 93 yorum ve 4,9 güçlü; 972 paylaşım "sürekli iş çıkıyor" kanıtı. Uydurma yorum metni yazılmaz, ziyaretçi Haritalar'da okur. Mağaza fotoğrafı ("Mağazamız" öne çıkanı) var ama kayıtta görünmüyor → SHOT LIST.

**6. Dönüşüm fırsatları**
- Ölçü işi uzaktan başlar: müşteri odanın fotoğrafını ve kaba ölçüsünü WhatsApp'tan atar. Site bu ilk mesajı **hazırlar**: oda türü + ilçe + "fotoğraf göndereceğim" seçimi → hazır WhatsApp metni (veri toplanmaz, sunucu yok).
- "Odanın tamamı mı, tek parça mı?" sorusu müşteriyi doğru konuşmaya sokar: tadilat (banyo/mutfak) ile tek dolap farklı görüşmelerdir.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Odasını baştan yaptıran ev sahibi (birincil)
| Alan | İçerik |
|---|---|
| Tetikleyici | Yeni daire, eski banyonun / mutfağın yorulması, PVC duvar + hazır dolabın artık kaldırılamaması, düğün / yeni ev |
| İhtiyaç | Dolap, duvar paneli, ışık, ayna ve boyayı **tek ekipten** almak; ustaları ayrı ayrı koordine etmemek |
| Problem | Beş ayrı usta = beş ayrı takvim; hazır ürün ölçüye oturmuyor; renkler birbirini tutmuyor |
| Karar mekanizması | Çoğunlukla çift birlikte; görseli Instagram'da gören kişi ilk mesajı atar, bütçe ortak karar |
| Karar kriteri | Önceki işlerin görüntüsü, Google yorumları, fiyat, ne kadar sürede biteceği, ulaşılabilirlik |
| İçsel risk | "Para verip beğenmezsem", "ev kaç gün kullanılamaz", "LED'ler bozulursa" |
| Dışsal / sosyal risk | Misafirin göreceği salon / banyo; aile önerisi |
| Arzu | "Otel gibi" banyo, "mimar elinden çıkmış" salon; sıcak ışık, derli toplu duvar |
| İtiraz | "Fiyat çok değişken", "söz verip geciktiriyorlar", "tadilat çok kirli" |
| Müşteri dili | "TV ünitesi yaptırmak istiyorum", "LED'li olsun", "çıtalı panel", "petek kapama", "banyoyu baştan yaptırmak istiyorum", "giyinme odası", "fiyat alabilir miyim", "Yenibosna'ya / Küçükçekmece'ye geliyor musunuz" |
| Güven ihtiyacı | Gerçek ev fotoğrafı, gerçek yorum, gidip görülebilecek adres |
| Beklenen sonuç | Görseldeki gibi bir oda, söylenen sürede, temiz teslim |
| Daha derin problem | Evin "bitmemiş" hissi ve onu bitirecek tek muhatap ihtiyacı |

### Segment B — Tek parça arayan (portmanto, banyo dolabı, petek kapama)
Tetikleyici: tek köşe sorunlu (antre, makine yeri, çirkin petek) · İhtiyaç: hızlı, net · Problem: hazır ürün ölçüye uymuyor · Karar: tek kişi · Kriter: benzer iş fotoğrafı + fiyat · İçsel risk: "küçük iş diye önemsemezler" · Sosyal risk: düşük · Arzu: o köşenin toparlanması · İtiraz: "tek parça için gelirler mi" · Dil: "portmanto", "petek kapama", "çamaşır makinesi dolabı", "küçük banyo dolabı" · Güven: aynı işin fotoğrafı · Sonuç: köşe çözülür · Derin problem: küçük alanın verimsizliği.

### Segment C — Çocuk / genç odası hazırlayan ebeveyn
Tetikleyici: çocuğun büyümesi, iki çocuğun aynı odayı paylaşması · İhtiyaç: ranza, çalışma masası, dolap tek parçada · Karar: ebeveyn, renk seçiminde çocuk · Kriter: güvenlik, depolama, renk · Risk: "çocuk büyüyünce oda eskir" · Dil: "kız-erkek tek oda", "genç kız odası", "lila", "ranza" · Güven: ızgarada 4 genç odası paylaşımı. Ayrı sayfa açılmaz (yazısız kare yok), gardırop sayfasında H2 + galeri türü.

## 06 — MARKET & COMPETITOR INTELLIGENCE
_(Puanlama yok.)_

| Tür | Kim | Konumlanma | Kullandığı mesajlar | Güven unsurları | Segment | Açık kalan fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Bahçelievler / Küçükçekmece'deki özel ölçü mobilyacı ve marangozlar (Armut profilleri, Haritalar) | "Her türlü özel ölçü mobilya" | Yıl sayısı, "kaliteli malzeme", "uygun fiyat" | Kendi beyanları, az yorum | Fiyat odaklı | Kanıtı fotoğrafla gösteren, işini adlandıran bir site |
| DOĞRUDAN | Instagram'da TV ünitesi / panel duvar yapan atölyeler | Reels + "DM'den fiyat" | Trend kelimeler ("2026", "lüks") | Takipçi, video | Görsel odaklı genç çiftler | Aranabilirlik: Instagram Google'da "petek kapama Bahçelievler" diye bulunmaz |
| DOLAYLI | Hazır mobilya / mutfak markaları (IKEA, mağaza zincirleri) | Hızlı, katalog | Standart ölçü, kampanya | Marka bilinirliği | Bütçe ve hız arayan | Ölçüye oturmama → "kolonlu duvar, alçak tavan, makine yeri" sayfaları |
| DOLAYLI | Banyo / mutfak tadilat firmaları (fayans, tesisat) | Anahtar teslim tadilat | "Anahtar teslim", "garantili" | Referans fotoğrafı | Komple tadilat | Şeker'in dolap + panel + ışık bütünlüğü |
| ALTERNATİF | Ayrı ayrı usta (boyacı + marangoz + elektrikçi) | Ucuz | — | Tanıdık önerisi | Fiyat duyarlı | "Tek muhatap" anlatısı |

## 07 — MESSAGE ENGINE

**Ana mesaj:** *Odanın son hâlini tek ekipten alın.* Dolap, çıtalı duvar, gizli ışık ve lake boya — Bahçelievler'den, ölçünüze göre.
**Slogan (firmanın kendi):** "Evinize tat katıyoruz." — yalnız logo / kapanış bölümünde, başlık olarak değil.

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A — Oda baştan | Banyo/salon yorgun, PVC duvar + hazır dolap | Beş ayrı usta, uzayan tadilat | Bitmiş, sıcak ışıklı, derli toplu oda | Dolap + panel + ışık + boya tek ekipten | Instagram'daki "baştan sona" işler (gerçek kareler), 4,9/93 Google | Odanın fotoğrafını WhatsApp'tan gönderin |
| B — Tek parça | Antre/petek/makine köşesi | "Küçük iş diye gelmezler" | Köşenin toparlanması | Ölçüye özel portmanto, petek kapama, makine dolabı | Aynı iş türünün kareleri | Ölçüyü ve fotoğrafı yazın |
| C — Genç odası | Paylaşılan oda, depolama | Güvenlik, çabuk eskime | Çocuğun sevdiği renk, düzen | Ranza + dolap + masa birlikte | 4 genç odası paylaşımı | Oda ölçüsünü ve yaşları yazın |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Hazır mobilya ölçüye oturmuyor; oda dolap, duvar ve ışık olarak parça parça kalıyor |
| Çözüm | Ölçüye özel imalat + duvar paneli + gizli LED + lake boya (kapı, petek) — Instagram'da görülen kapsam |
| Fayda | Tek muhatap, birbirini tutan malzeme ve renk, boşluk kalmayan ölçü |
| Süreç | 1) Fotoğraf + kaba ölçü WhatsApp'tan → 2) ölçü / keşif (ücret BİLİNMİYOR, yazılmaz) → 3) malzeme ve renk seçimi → 4) imalat → 5) montaj ve teslim |
| Kanıt | Gerçek iş kareleri (Instagram'dan, temsili değil); Google 4,9 / 93 (tarihli, kaynaklı); iki fiziksel adres (biri teyitte) |
| Risk azaltma | Doğrulanmış garanti / ücretsiz keşif YOK → vaat edilmez. Gerçek risk azaltıcılar: gidip görülebilecek adres, fotoğrafla ön görüşme (taahhütsüz), Google yorumlarına açık bağlantı |
| CTA | "Odanın fotoğrafını gönderin" (WhatsApp) · "Hemen arayın" (0535 761 85 38) |

## 09 — CONVERSION ENGINE

**Yolculuk:**
| Adım | Site karşılığı |
|---|---|
| Dikkat | Haritalar "Web sitesi" düğmesi, Google araması ("TV ünitesi Bahçelievler"), Instagram bio linki |
| Anlama | Hero: ne yapıldığı (oda türleri) + nerede (Bahçelievler) tek ekranda |
| İlgi | Oda türüne göre gerçek kareler, görülen detayın adı ("ayna arkası LED", "çıtalı panel") |
| Güven | Google 4,9 / 93 (bağlantılı), "işe başladığımız gün" kareleri, adres + harita |
| Risk azaltma | Fotoğrafla ön görüşme, fiyatın neye göre değiştiğinin dürüst anlatımı |
| Aksiyon | Mesaj hazırlayıcı → WhatsApp; telefon |

**CTA hiyerarşisi:** birincil **WhatsApp** (hazır mesajla, `wa.me/905357618538`) · ikincil **telefon** (`tel:+905357618538`) · üçüncül **Yol tarifi** (Haritalar) ve **Instagram** (daha fazla iş).

**Sayfa başına next step:** her hizmet sayfası → o oda türü seçili mesaj hazırlayıcı; İşler sayfası → kareye göre ilgili hizmet sayfası + WhatsApp; mobilde sabit alt çubuk (WhatsApp · Ara).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (Segment A)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta dayanıyor (garanti/keşif BİLİNMİYOR olarak işaretli)
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
