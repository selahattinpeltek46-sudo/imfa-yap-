# Üçel Tarım Aletleri — 2026 Satış Kataloğu · Aşama 2

Onaylanan: Konsept **C (sıcak, güvenilir yerel üretici)** + ürün sayfalarında **A'nın sadeliği**.
İki çıktı tek veriden üretilir: **Yatay katalog** (masaüstü / tablet / baskı) ve **Telefon kataloğu** (dikey).

Kural: veri yoksa uydurulmaz. Taslakta `[TEKNİK BİLGİ GEREKLİ]`, yayında o alan gizlenir ya da
"Size uygun modeli seçelim" kutusuna dönüşür.

---

## A. Final tasarım sistemi

### A1. Renk (5 renk, fazlası yok)

| Ad | Kod | Kullanım |
|---|---|---|
| Üçel Kırmızısı | `#C8102E` | CTA, sayfa no, vurgu çizgisi, tablodaki HP sütunu. Sayfa alanının en fazla ~%10'u |
| Koyu | `#1F2124` | Başlıklar, koyu bloklar, tablo başlığı |
| Kırık beyaz | `#F6F4F0` | Sayfa zemini |
| Çizgi grisi | `#E2DED8` | Kart kenarı, tablo satır çizgisi |
| Metin grisi | `#5F5B55` | İkincil metin, fotoğraf açıklaması (beyaz/kırık beyaz üstünde AA kontrast) |

Beyaz (`#FFFFFF`) kart ve ürün fotoğrafı zemini. Logodaki altın yalnızca logonun içinde kalır.
WhatsApp yeşili yalnızca WhatsApp ikonunun içinde.

### A2. Tipografi (2 aile)

- **Oswald** (500/600/700) — başlıklar, büyük rakamlar, sayfa numarası
- **Inter** (400/600/700) — gövde, tablo, açıklama

| Rol | Yatay (420×210 mm) | Telefon (90×160 mm) |
|---|---|---|
| Kapak başlığı | Oswald 700 · 54 pt | Oswald 700 · 34 pt |
| Sayfa başlığı (H1) | Oswald 700 · 34 pt | Oswald 700 · 26 pt |
| Fayda cümlesi (H2) | Oswald 500 · 20 pt | Oswald 500 · 17 pt |
| Ara başlık (H3) | Inter 700 · 10 pt, büyük harf, 1.5 pt aralık | Inter 700 · 9.5 pt |
| Gövde | Inter 400 · 12 pt / 1.55 | Inter 400 · 12.5 pt / 1.5 |
| Büyük teknik rakam | Oswald 600 · 28 pt + birim Inter 10 pt | Oswald 600 · 24 pt |
| Tablo | Inter 10.5 pt (değer 600) | Inter 11 pt |
| Açıklama / etiket | Inter 9.5 pt | Inter 10 pt |
| **En küçük yazı** | **9 pt** (altına inilmez) | **10 pt** |

### A3. Izgara ve boşluk

- **Yatay:** 12 sütun · kenar 16 mm · oluk 6 mm · üst bant 30 mm · alt şerit 12 mm
- **Telefon:** 4 sütun · kenar 7 mm · oluk 4 mm · alt CTA çubuğu 16 mm
- Boşluk birimi 4 mm (4 / 8 / 12 / 16 / 24)
- Bir sayfa = bir ana mesaj

### A4. Bileşenler

| Bileşen | Tanım |
|---|---|
| **Üst bant** | Koyu açılı alan + kategori etiketi + sayfa başlığı. Slogan yalnızca kapak, marka ve arka kapakta (her sayfada tekrar yok) |
| **Ürün fotoğrafı** | Beyaz zeminli ürün (kenarı temiz). Oran korunur, kırpılmaz. Ürün sayfanın en büyük öğesi |
| **Saha fotoğrafı** | Gerçek fotoğraf, oranı korunur, alt kenarında 1.2 mm kırmızı çizgi, altında gerçek açıklama |
| **Fayda cümlesi** | Ürün adının hemen altında, tek cümle, Oswald 500 |
| **Kullanım etiketleri** | İkon + kısa ifade, en fazla 4 adet |
| **"Kimler için?" kutusu** | Kırık beyaz zemin, sol kırmızı çizgi, 1–2 satır (sitedeki `kimler` metni) |
| **Teknik tablo** | Satır = model. Sütunlar ürüne göre 4–6 özellik. En sağda kırmızı "Traktör gücü (HP)". Veri yoksa tablo yerine *Uygun model seçimi* kutusu |
| **Uygun model seçimi kutusu** | "Bize 3 şey yazın: traktörünüz · HP · yapacağınız iş" + QR / buton |
| **Neden Üçel şeridi** | Ürüne özgü 2–3 kanıt maddesi (yalnızca teyitli bilgiler) |
| **CTA bandı** | Kırmızı alan: bağlama özel soru + telefon + QR (yatay) / dokunulabilir buton (telefon) |
| **İkonlar** | Tek set, çizgi ikon, 2 px, kırmızı, 24 birim ızgara. Yalnızca kullanım alanları ve "Neden Üçel"de |
| **Sayfa no** | Alt şeritte sağda, koyu kutu içinde Oswald |
| **Alt şerit** | Kırmızı: ÜÇEL TARIM ALETLERİ · telefon · adres · site |

### A5. QR ve WhatsApp

- **Yatay katalog:** her QR 26–28 mm, yanında ne işe yaradığı yazılı ("WhatsApp'tan bilgi al", "Konumu aç").
  QR okutulunca ürün adı ve sorular yazılı hazır mesaj açılır.
- **Telefon kataloğu:** QR kullanılmaz (kişi kendi ekranındaki QR'ı okutamaz). Yerine her ekranın altında
  dokunulabilir **"WhatsApp'tan yaz"** ve **"Ara"** butonları.

### A6. Bağlama özel CTA'lar

| Sayfa | CTA | Hazır WhatsApp mesajı |
|---|---|---|
| Römork | Ne taşıyacağınızı yazın, uygun römorku birlikte belirleyelim. | Taşıyacağım yük: / Traktörüm: |
| Kültivatör | Traktörünüzün gücünü yazın, uygun modeli birlikte seçelim. | Traktör / HP: / Tarla büyüklüğü: |
| Loader kepçe | Traktörünüzün marka ve modelini yazın, montaja uygunluğuna bakalım. | Traktör marka / model: / HP: |
| Pulluk | Toprağınızı ve traktörünüzü anlatın, uygun pulluğu birlikte seçelim. | Traktör / HP: / Toprak yapısı: |
| Gübre serpme | Traktörünüzü ve tarlanızı yazın, uygun makineyi birlikte seçelim. | Traktör / HP: / Gübre türü: |
| Su tankeri | Suyu ne için taşıyacağınızı yazın, uygun tankeri birlikte seçelim. | Kullanım: / Traktörüm: |
| Ekipman seçimi | Traktörünüzü yazın, size uygun ekipmanları birlikte listeleyelim. | Traktör / HP: / Yapacağım iş: |
| Takas | Eski makinenizin fotoğrafını gönderin. | Ekipman: / Durumu: |
| Diğer ürünler | Aradığınız ekipmanı bulamadınız mı? Bize yazın. | Aradığım ekipman: |
| Genel / arka kapak | İhtiyacınızı yazın, birlikte bakalım. | — |

### A7. Fotoğraf stili

- Ürün: beyaz/düz zemin, ürünün tamamı, 3/4 açı, gündüz ışığı
- Saha: traktöre bağlı ya da iş başında, ürün kadrajda tam
- Üretim: kaynak, boya, montaj (yüz görünmesi şart değil)
- Yapay / stok görsel yok. Müşteri fotoğrafı yalnızca izinle

---

## B. Sayfa sayfa plan — Yatay katalog (20 sayfa)

Sayfa 4 ve 6, Üçel'den gelecek fotoğraf / veriye bağlıdır; gelmezse katalog 18 sayfa çıkar.

### 01 · Kapak
- **Amaç:** Kim olduğumuzu ve ne sunduğumuzu 3 saniyede anlatmak
- **Ana mesaj:** Göksun'da üretilen, sağlam tarım ekipmanları
- **Başlık:** Ürün Kataloğu 2026 · **Alt:** Tarlada da, yolda da sağlam iş.
- **Görsel:** Römork (traktöre bağlı, beyaz zemin) büyük; kültivatör ikinci plan
- **Metin:** Logo + ÜÇEL TARIM ALETLERİ · Göksun / Kahramanmaraş
- **CTA:** Telefon numarası büyük; içindekiler (tıklanır)
- **Düzen:** Sol koyu blok (metin), sağ beyaz (ürün)
- **Foto:** `tarim-romorku-yesil-traktor`, `yayli-kultivator-kirmizi-2`
- **Eksik veri:** Kullanılacak firma adı (Tarım Aletleri / Ziraat)

### 02 · Göksun'da üretiyoruz
- **Amaç:** "Bu insanlar işini biliyor" hissi
- **Ana mesaj:** Baba-oğul, Göksun Sanayi Sitesi'nde kendi atölyesinde üretiyor
- **Başlık:** Göksun'da üretiyoruz.
- **Görsel:** Tabela (büyük), atölye önü, teslimat; Bahadır Kocabaş fotoğrafı gelirse o büyük
- **Metin:** 3–4 cümlelik hikâye (sitedeki gerçek bilgiler) + üç iş: İmalat · Satış · İkinci el & takas
- **CTA:** Konum QR'ı — "Atölyemize gelin"
- **Eksik:** Ekip fotoğrafı; kuruluş yılı (yalnızca belgeliyse)

### 03 · Neden Üçel?
- **Amaç:** Güven; rakipten ayrışma
- **Ana mesaj:** 5 somut neden, her biri bir kanıtla
- **İçerik (yalnızca teyitli):**
  1. Kendi üretimimiz — römork, kültivatör, loader kepçe Göksun'daki atölyede (kanıt: ürünlerdeki ÜÇEL / GÖKSUN yazısı)
  2. İhtiyaca göre üretim — standart dışı ölçü; römork kasa rengi ve yazısı isteğe göre (kanıt: müşteri adı yazılı kasa)
  3. Sahadan gelen tecrübe — ekipmanın sahada nasıl kullanıldığını biliyoruz
  4. Yedek parça — ürettiğimiz ve sattığımız ürünlere
  5. Türkiye'ye gönderim — anlaşmalı nakliye (kanıt: yük aracında teslimat fotoğrafı)
- **Düzen:** 5 sütun, her sütunda fotoğraf + ikon + başlık + 1 cümle
- **CTA:** yok (sayfa güven için)

### 04 · Nasıl üretiyoruz *(fotoğraf gelirse)*
- **Amaç:** "Kendi imalatımız" iddiasını görünür kanıta çevirmek
- **Görsel:** Kaynak → boya → montaj → teslimat (4 kare)
- **Metin:** Her kareye 1 satır gerçek açıklama
- **Eksik:** Üretim fotoğraflarının tamamı. Gelmezse sayfa çıkar, 2. sayfaya tek kare eklenir

### 05 · Ürünlerimiz (ürün haritası)
- **Amaç:** Aradığını 5 saniyede bulmak
- **Düzen:** Kategori sütunları — Toprak İşleme (pulluk, kültivatör) · Gübreleme (gübre serpme) · Taşıma (römork, su tankeri) · Yükleme (loader kepçe) · Diğer (mibzer, çayır biçme, yedek parça, takas)
- **Kart:** fotoğraf + ad + 1 satır fayda + sayfa no + KENDİ İMALATIMIZ etiketi (yalnızca 3 ürün)
- **CTA:** "Tüm ürünler" site QR'ı

### 06 · Size uygun ekipmanı seçin *(HP verisi gelince tam hâli)*
- **Amaç:** "Kendi ihtiyacımla eşleştir" adımı
- **Şimdi:** "Ne yapmak istiyorsunuz?" → ürün (iş bazlı eşleştirme; uydurma yok)
  Toprağı derin işlemek → Pulluk · Tohum yatağı hazırlamak → Kültivatör · Gübre atmak → Gübre serpme ·
  Yük taşımak → Römork · Su taşımak → Su tankeri · Yükleme-boşaltma → Loader kepçe
- **Veri gelince:** HP aralığı sütunu eklenir (ör. "40–60 HP traktör → …")
- **CTA:** Traktörünüzü yazın, size uygun ekipmanları birlikte listeleyelim.
- **Eksik:** Her model için traktör HP uyumu

### 07–08 · Tarım Römorku (2 sayfa)
**07 — Tanıtım**
- **Ana mesaj (fayda):** Tarladan depoya, ağır yükü tek seferde taşıyın.
- **Görsel:** Traktöre bağlı römork (büyük)
- **Metin:** Kısa tanım + Kullanım: ürün · gübre ve yem · odun ve malzeme · hayvancılık
- **Kimler için:** sitedeki metin
- **Neden Üçel:** Kaynağından boyasına atölyemizde · Kasa rengi ve yazısı isteğe göre · Standart dışı ölçü
- **Foto:** `tarim-romorku-yesil-traktor`, teslimat
**08 — Seçenekler ve teknik**
- **Teknik tablo:** Model · Kapasite (ton) · Kasa iç ölçüsü · Dingil · Lastik · Damper · HP
- **Seçenekler:** Kasa rengi · Kasa yazısı · Özel ölçü (teyitli) / Damper, ilave kasa (teyit bekliyor)
- **Görsel:** Mavi kasa, yük aracında teslimat
- **CTA:** Ne taşıyacağınızı yazın, uygun römorku birlikte belirleyelim.
- **Eksik:** Tüm teknik değerler; 4 tonluk model teyidi; damper/dingil seçenekleri

### 09–10 · Kültivatör / Tapan (2 sayfa)
**09 — Tanıtım**
- **Fayda:** Pulluktan sonra toprağı inceltir, tohum yatağını hazırlar.
- **Görsel:** Kırmızı Göksun kültivatör (büyük), mavi renk seçeneği
- **Kullanım:** yüzey işleme · tohum yatağı · yabani ot
- **Neden Üçel:** Atölyemizde üretim · kırmızı ve mavi renk (fotoğraflarda)
**10 — Teknik**
- **Tablo:** Model · Ayak sayısı · Çalışma genişliği · Ağırlık · Bağlantı · HP
- **Detay görseli:** yay ve uç demiri yakın çekim (`kultivator-ayak-yakin` — sitede var)
- **CTA:** Traktörünüzün gücünü yazın, uygun modeli birlikte seçelim.
- **Eksik:** Ayak sayısı seçenekleri ve tüm ölçüler

### 11–12 · Loader Kepçe (2 sayfa)
**11 — Tanıtım**
- **Fayda:** Yem, gübre ve malzemeyi traktörünüzle kolayca yükleyip boşaltın.
- **Görsel:** Traktöre takılı kepçe (tam kadraj çekim gelirse o)
- **Kullanım:** yükleme-boşaltma · ahır ve çiftlik · malzeme taşıma
- **Neden Üçel:** Atölyemizde imalat · montaj uygunluğu traktör modelinize göre değerlendirilir
**12 — Teknik ve ataşman**
- **Tablo:** Model · Kaldırma kapasitesi · Kaldırma yüksekliği · Kova genişliği · Ağırlık · Uygun HP
- **Ataşmanlar:** yalnızca Üçel'in "var" dediği
- **Görsel:** atölye önünde, Kubota montajı
- **CTA:** Traktörünüzün marka ve modelini yazın, montaja uygunluğuna bakalım.
- **Eksik:** Uyumlu traktörler, kapasite, ataşman listesi; tam kadraj fotoğraf

### 13 · Pulluk
- **Fayda:** Ekim öncesi tarlanızı derin işleyin; traktörünüzü yormayan pulluk.
- **Görsel:** mevcut pulluk fotoğrafı → **yeni çekim gerekli**
- **Tablo:** Model · Gövde sayısı · İş genişliği · Ağırlık · HP
- **CTA:** Toprağınızı ve traktörünüzü anlatın, uygun pulluğu birlikte seçelim.
- **Eksik:** Tüm teknik değerler; marka/üretici (satış ürünü); yeni fotoğraf

### 14 · Gübre Serpme Makinesi
- **Fayda:** Gübreyi tarlanıza dengeli dağıtın.
- **Görsel:** mevcut (römork üstünde) → **tek başına yeni çekim gerekli**
- **Tablo:** Model · Kapasite · Serpme genişliği · Tahrik · HP
- **CTA:** Traktörünüzü ve tarlanızı yazın, uygun makineyi birlikte seçelim.
- **Eksik:** Tüm teknik değerler; yeni fotoğraf

### 15 · Su Tankeri
- **Fayda:** Tarlaya, hayvana, nereye gerekiyorsa suyu taşıyın.
- **Görsel:** `su-tankeri-2`
- **Tablo:** Model · Kapasite (lt) · Tank malzemesi · Dingil · Pompa · HP
- **CTA:** Suyu ne için taşıyacağınızı yazın, uygun tankeri birlikte seçelim.
- **Eksik:** Kapasite seçenekleri ve tüm değerler

### 16 · Diğer ürünler
- **İçerik:** Mibzer · Çayır biçme makinesi · Döner ot tırmığı · Tesviye küreği · Yedek parça (fotoğrafı olanlar fotoğraflı)
- **CTA:** Aradığınız ekipmanı bulamadınız mı? Bize yazın.
- **Eksik:** Mibzer / çayır biçme marka-model ve fotoğraf

### 17 · Eski makinenizi değerlendirelim
- **Amaç:** Takası satış hunisine bağlamak
- **4 adım:** 1 Fotoğrafını çekin · 2 WhatsApp'tan durumuyla gönderin · 3 Değerlendirelim · 4 Takas ya da nakit seçeneğini konuşalım
- **Dürüstlük notu:** İkinci elde resmî garanti belgesi yok; durumunu açıkça paylaşıyoruz
- **CTA:** Eski makinenizin fotoğrafını gönderin. (büyük QR)

### 18 · Sahadan kareler
- 6 gerçek fotoğraf (teslimat, montaj, saha) + gerçek açıklamalar
- **CTA:** Google yorumları ve konum QR'ı
- **Eksik:** Müşteri fotoğraf izni

### 19 · Sık sorulanlar
- 6–8 soru: nereye gönderiyorsunuz · fiyat · traktörüme uyar mı · özel ölçü · yedek parça · garanti · teslim süresi (veri gelirse) · ödeme (yazılmaz, sorulur)
- **CTA:** Sorunuz burada yoksa yazın.

### 20 · İletişim / arka kapak
- Telefon (büyük), adres, saatler, yetkili, site + 3 QR (WhatsApp · Site · Konum), alt ürün bandı, slogan
- **CTA:** İhtiyacınızı yazın, birlikte bakalım.

---

## C. Telefon kataloğu (dikey, 90×160 mm)

Her yatay sayfa 1–2 ekrana bölünür; her ekranın altında sabit **WhatsApp'tan yaz · Ara** çubuğu.

| Yatay sayfa | Telefon ekranları |
|---|---|
| 01 Kapak | 1 (ürün + başlık + "Kataloğa başla") |
| 02 Göksun'da üretiyoruz | 1 |
| 03 Neden Üçel | 2 (5 neden: 3 + 2) |
| 04 Nasıl üretiyoruz | 1 (fotoğraf gelirse) |
| 05 Ürünlerimiz | 1 (dokunulabilir liste) |
| 06 Ekipman seçimi | 1 |
| Kendi imalatı 3 ürün (2'şer sayfa) | 3 × 3 = 9 (tanıtım · kullanım ve neden · teknik + CTA) |
| Satış ürünleri 3 ürün | 3 × 2 = 6 (tanıtım · teknik + CTA) |
| 16 Diğer ürünler | 1 |
| 17 Takas | 1 |
| 18 Sahadan | 1 |
| 19 SSS | 2 |
| 20 İletişim | 1 |
| **Toplam** | **≈ 28 ekran** |

---

## D. Akış kontrolü (her ürün sayfasında)

ürün (görsel) → fayda (H2) → uygunluk (kullanım + kimler için) → teknik (tablo / seçim kutusu) → güven (Neden Üçel) → CTA

Göz sırası testi: 1 ürün · 2 fayda cümlesi · 3 teknik · 4 CTA. Her sayfa bu sırayla kontrol edilecek.

## E. Sonraki aşamalar

3. **Metinler** — bu plana göre bütün metinler (onaya sunulur)
4. **Tasarım** — yatay + telefon üretimi
5. **QA** — içerik, teknik, tasarım, yazım, marka, satış, UX, mobil, güven
