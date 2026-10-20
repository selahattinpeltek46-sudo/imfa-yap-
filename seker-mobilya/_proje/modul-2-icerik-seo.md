# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Önce okundu: `modul-1-strateji.md` · Tek kaynak: nihai metinler ve fotoğraf envanteri `_proje/icerik.py`'de; 12. bölüm `python3 seker-mobilya/_proje/uret.py --metin` ile oradan üretilir (site ile rapor arasında metin farkı oluşmaz).

---

## 10 — INFORMATION ARCHITECTURE

8 sayfa. Her hizmet sayfası, firmanın Instagram kapak yazılarında kendi kullandığı bir iş adına ve ayrı bir arama niyetine karşılık geliyor. **Açılmayanlar:** Hakkımızda (kuruluş yılı, ekip, atölye doğrulanmadı → boş "biz" metni olurdu), İletişim (her sayfanın sonunda konum + mesaj bölümü var; ayrı sayfa tekrar olurdu), Genç odası (yazısız kare yok → gardırop sayfasında H2 + galeri türü), Blog (içerik üretecek kaynak yok).

| Sayfa | Amaç | Hedef kullanıcı | Temel soru | Verilen cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` Ana sayfa | Ne yapıldığını ve nerede olunduğunu tek ekranda göstermek | Haritalar / Instagram'dan gelen, A–C | "Bu firma benim odamı yapar mı?" | 6 oda türü + "tek ekip" fikri + gerçek kareler | Google 4,9/93 (bağlantılı), işe başlanan gün kareleri, adres | Marka + "Bahçelievler özel ölçü mobilya" | Odanın fotoğrafını gönderin | Oda sayfası veya mesaj hazırlayıcı |
| `/tv-unitesi/` | TV duvarı talebi | A | "Duvarın tamamını yapar mısınız, LED olur mu?" | Duvar tek tasarım, ışığın yerleri, yüzeyler | 6 gerçek kare + detay işaretleri | "TV ünitesi Bahçelievler", "duvar ünitesi", "LED'li TV ünitesi" | WhatsApp (tür ön seçili) | Duvar paneli sayfası |
| `/banyo/` | Banyo dolabı + banyo yenileme | A, B | "Makine yerine dolap olur mu, küçük banyoya ne sığar?" | Makine dolabı, çekmeceli lavabo dolabı, ışıklı ayna, baştan yenileme | 15 kare (en zengin tür) | "banyo dolabı Bahçelievler", "çamaşır makinesi dolabı", "banyo yenileme" | WhatsApp | Mutfak / duvar |
| `/mutfak/` | Mutfak dolabı | A | "Dar mutfakta düzen nasıl olur?" | Çekmece, kiler boy dolap, tezgâh + cam kapak | 5 kare | "mutfak dolabı Bahçelievler", "özel ölçü mutfak" | WhatsApp | Banyo / giyinme |
| `/giyinme-odasi-gardirop/` | Giyinme odası, gardırop, genç odası | A, C | "Ne kadar alan lazım, cam kapak olur mu?" | Cam kapak + iç ışık, tavana kadar düz kapak, genç odası | 8 kare | "giyinme odası", "gömme dolap", "genç odası" | WhatsApp | Portmanto |
| `/portmanto/` | Portmanto ve antre | B | "Dar antreye sığar mı?" | Gömme portmanto, çıtalı duvar + ayna, kapı lake boyama | 9 kare | "portmanto Bahçelievler", "antre dekorasyonu" | WhatsApp | Duvar paneli |
| `/duvar-paneli-petek-kapama/` | Çıtalı panel + petek kapama | A, B | "Petek kapama ısıyı keser mi?" | Panel + ışık, ısı aralıklı lake kapama | 4 kare (+ ortak TV duvarı karesi) | "lake petek kapama", "çıtalı duvar paneli" (yerel rekabet zayıf) | WhatsApp | TV ünitesi |
| `/isler/` | Bütün kanıt tek yerde | Karşılaştıran ziyaretçi | "Başka neler yaptılar?" | 47 kare, oda türüne göre süzülür | "Temsili görsel yok" beyanı + Reels kapağı etiketi | Görsel arama, marka | Mesaj hazırlayıcı | İlgili hizmet sayfası |

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa (bölüm sırası):** üst çubuk (logo, 6 oda + İşler, "Fotoğraf gönder") → giriş (H1, kısa açıklama, WhatsApp + telefon, Google satırı, 3'lü kolaj ve arkasında çıtalı panel + ışık bandı) → "Bir odada neleri birlikte yapıyoruz" (numaralı detaylı fotoğraf) → "Hangi oda için yazıyorsunuz?" (6 satırlık dizin) → "İşe başladığımız gün" (3 başlangıç karesi, koyu ceviz zemin) → "Fotoğraftan teslime" (5 adım) → mesaj hazırlayıcı → konum → alt bilgi → (mobil) sabit WhatsApp/Ara çubuğu.

**Hizmet sayfaları:** kırıntı → giriş (H1 + kolaj + CTA + Google satırı) → "Bu işte görülenler" (numaralı detaylar) → 3–4 H2 bölümü (metin + ilgili kareler) → "Instagram'dan diğer kareler" (o türün kalan kareleri) → SSS (3 soru, FAQPage) → mesaj hazırlayıcı (tür ön seçili) → "Bunlara da bakın" → konum → alt bilgi.

**İşler:** kırıntı → H1 + beyan → süzgeç (Hepsi + 7 tür; `#tür` bağlantısı ve `hashchange` ile) → 47 kare → mesaj → konum.

**Internal linking:**
| Kaynak | Hedef | Bağlantı metni |
|---|---|---|
| Tüm sayfalar (menü, alt bilgi) | 6 hizmet + İşler | Oda adları |
| Ana sayfa imza bölümü | Duvar paneli | "Çıtalı duvar paneli ve petek kapama" |
| Ana sayfa dizin | 6 hizmet | Sayfa adı (satırın tamamı bağlantı) |
| Ana sayfa | İşler | "Bütün işler: 47 kare" |
| Hizmet sayfası galerisi | `isler/#tür` | "Bütün işler" |
| TV ünitesi | Duvar paneli, Giyinme | sayfa adları ("Bunlara da bakın") |
| Banyo | Mutfak, Duvar paneli | 〃 |
| Mutfak | Banyo, Giyinme | 〃 |
| Giyinme | Portmanto, Duvar paneli | 〃 |
| Portmanto | Duvar paneli, Giyinme | 〃 |
| Duvar paneli | TV ünitesi, Portmanto | 〃 |

**Yasal:** Site hiçbir veri toplamaz (mesaj hazırlayıcı yalnız tarayıcıda metin oluşturur, gönderimi ziyaretçi WhatsApp'ta yapar), analytics / pixel yok, yazı tipleri sitenin kendi sunucusunda → **KVKK aydınlatma metni ve çerez banner'ı gerekmiyor**. Google harita iframe'i yalnız "Haritayı göster" tıklanınca yüklenir (öncesinde Google'a istek yok — testle doğrulandı). İleride GA4 / Meta Pixel eklenirse çerez onayı + aydınlatma metni zorunlu olur (şablon, hukuki kontrol gerekir). Alt bilgi notu bunu açıkça söyler.

## 12 — COPYWRITING ENGINE

**Ton:** sakin, somut, birinci çoğul ("yapıyoruz"). Sıfat yerine görülen detayın adı. Fiyat, süre, garanti, ücretsiz keşif, yıl sayısı, "lider / en iyi / kaliteli malzeme" yok.

**Kanıtsız iddia taraması (yapıldı, düzeltilenler):** "alan temizlenerek teslim edilir" → "teslim edilir"; "Instagram'da en çok sorulan işlerimizden" → çıkarıldı; "genç odalarımızın hepsi böyle başladı" → çıkarıldı; "lila ve pembe nişli odalar bu şekilde yapıldı" → "bunun örneği"; "çizilir" (çizim/3D vaadi) → "tasarlanır / yapılır". "1979" metinde kullanılmadı (yalnız logoda). Ünlü müşteri adı kullanılmadı. "Ücretsiz keşif" yazılmadı ("keşif sırasında" süreç adı olarak kaldı).

<!-- METIN:BAS (uret.py --metin ile üretilir; elle düzenleme icerik.py'de) -->
### Ana sayfa `/`
- **Title:** Şeker Mobilya | Bahçelievler Özel Ölçü Mobilya ve Dekorasyon
- **Meta:** Yenibosna'dan TV ünitesi, giyinme odası, portmanto, banyo ve mutfak dolabı; çıtalı duvar paneli, gizli LED ve lake boya. Odanın fotoğrafını gönderin.
- **H1:** Ölçüye özel mobilya, duvar ve ışık: odanın son hâli tek ekipten.
- **Giriş:** TV ünitesinden giyinme odasına, banyo dolabından petek kapamaya kadar; dolabı, çıtalı duvarı, gizli ışığı ve lake boyayı aynı ekip yapıyor. Bahçelievler Yenibosna'dayız.
- **H2 Bir odada neleri birlikte yapıyoruz:** Instagram'daki işlerimize bakınca aynı şeyler tekrar ediyor: ölçüye oturan dolap, çıtalı panel, gizli ışık ve ayna. Hepsi birbirini tutsun diye aynı ekipten çıkıyor. Bu yatak odasında görülenler: (detaylar: Tavana kadar çıtalı duvar paneli; Tavan bandında gizli ışık; Arkası ışıklı yuvarlak ayna; Duvara asılı komodin)
- **H2 Hangi oda için yazıyorsunuz?:** 6 oda satırı (sayfa adı + giriş cümlesi + kapak karesi)
- **H2 İşe başladığımız gün:** Videolarımızın çoğu boş odadan başlar: sökülmüş duvar, kapısı çıkarılmış antre, parkesi kalkmış salon. Bunlar o videoların ilk kareleri; bitmiş hâlleri Instagram'da.
- **H2 Fotoğraftan teslime:** **Fotoğraf ve kaba ölçü:** Odanın birkaç fotoğrafını ve aklınızdaki işi WhatsApp'tan gönderin. Kaba ölçü yeterli; metre yoksa da yazın. → **Ölçü:** Kesin ölçüyü yerinde alıyoruz; kolon, tesisat, petek ve priz yerleri o gün netleşir. → **Renk ve malzeme:** Lake rengi, kaplama, kulp, ışığın yeri ve rengi birlikte seçilir. → **İmalat:** Parçalar ölçünüze göre üretilir. → **Montaj ve teslim:** Yerinde montaj yapılır, ışıklar bağlanır ve teslim edilir.
- **Yorum satırı:** Google Haritalar'da 4,9 puan · 93 değerlendirme (20 Ekim 2026 itibarıyla). Yorumları kendiniz okuyun.
- **H2 Odanın fotoğrafını gönderin:** Birkaç seçimle WhatsApp mesajınızı hazırlayın; fotoğrafları WhatsApp'ta ekleyin. Bu sayfa hiçbir bilgiyi kaydetmez ya da bir yere göndermez — mesajı siz gönderirsiniz. · CTA: WhatsApp'ta gönder / Mesajı kopyala
- **H2 Yenibosna'dayız:** adres + telefon · "Bugünkü açılış ve kapanış saatini Google Haritalar'da görebilirsiniz. Gelmeden önce aramanızı öneririz." · Yol tarifi · Instagram

### TV ünitesi `/tv-unitesi/`
- **Title:** TV Ünitesi ve Duvar Ünitesi | Şeker Mobilya Bahçelievler
- **Meta:** Ölçüye özel TV ünitesi ve duvar ünitesi: LED'li raflar, mermer görünümlü panel, ceviz kaplama, çıtalı panel. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** TV ünitesi ve duvar ünitesi
- **Giriş:** TV duvarı salonun yüzü. Rafları, kapakları, paneli ve ışığı duvarın ölçüsüne göre tek parça gibi kuruyoruz; kablo görünmesin, ışık doğrudan göze gelmesin.
- **H2 Bu işte görülenler:** Mermer görünümlü panel; Raf altı ışık; Çıtalı TV paneli; Çerçeveli lake kapak
- **H2 Duvarın tamamı, tek tasarım:** Yalnız TV sehpası değil; iki yandaki raflar, üstteki kapaklar ve TV'nin arkasındaki panel birlikte tasarlanır. Böylece duvar baştan sona aynı çizgide biter. Tavana kadar çıkan üst kapaklar hem depolama hem de daha yüksek bir tavan hissi verir.
- **H2 Işık: raf altı, panel çevresi, tavan bandı:** Işık şeridini rafın altına, TV panelinin çevresine ya da tavan bandına gizliyoruz. Şerit görünmez, yalnız yüzeye vuran sıcak ışık görünür. Işığın rengi ve nereye bağlanacağı ölçü günü konuşulur.
- **H2 Yüzey seçenekleri:** İşlerimizde en çok açık gri ve krem lake, ceviz kaplama, mermer görünümlü panel ve çıtalı panel kullanıyoruz. Seçimi örnekleri görerek, odanın zemini ve ışığıyla birlikte yapıyoruz.
- **SSS:**
  - *TV ünitesi fiyatı ne kadar?* — Fiyat duvarın ölçüsüne, kapak ve panel yüzeyine, ışık miktarına göre değişir. Duvarın fotoğrafını ve kaba ölçüsünü WhatsApp'tan gönderin; ona göre konuşalım.
  - *Kablolar görünür mü?* — TV paneli ve dolaplar kabloların geçeceği yer düşünülerek yapılır; prizlerin ve uydu/internet kablosunun yeri ölçü günü netleşir.
  - *Sadece raflı bir TV ünitesi de yapıyor musunuz?* — Evet. Duvarın tamamı şart değil; tek bir alt modül ya da yalnız raf da yapılır. Ne istediğinizi yazmanız yeterli.

### Banyo dolabı ve banyo yenileme `/banyo/`
- **Title:** Banyo Dolabı ve Banyo Yenileme | Şeker Mobilya Bahçelievler
- **Meta:** Ölçüye özel banyo dolabı, boy dolap, çamaşır makinesi dolabı ve LED ayna; banyoyu baştan sona yeniliyoruz. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** Banyo dolabı ve banyoyu baştan yenileme
- **Giriş:** Küçük bir lavabo dolabından makine yerli boy dolaba, ışıklı aynadan baştan sona yenilenen banyoya kadar. Banyonun her santimini ölçüsüne göre kullanıyoruz.
- **H2 Bu işte görülenler:** Arkası ışıklı oval ayna; Açık raf kutuları; Gömme lavabolu tezgâh; Çıtalı boy dolap
- **H2 Çamaşır makinesi için boy dolap:** Makineyi dolabın içine ya da altına alıp üstünü ve yanını boy dolapla kapatıyoruz. Deterjan, havlu ve temizlik malzemesi kapağın arkasına girer; banyo derli toplu görünür.
- **H2 Küçük banyoya çekmeceli dolap:** Dar banyoda kapak yerine çekmece çoğu zaman daha çok yer açar. Lavabo dolabını banyonun ölçüsüne göre daraltıp derinliğini ayarlıyoruz.
- **H2 Işıklı ayna ve aynalı üst dolap:** Oval, yuvarlak ya da dikdörtgen; arkası ışıklı ayna veya içi raflı aynalı dolap. Tezgâh üstü lavabo ile antrasit, ceviz ya da açık gri kapak birlikte seçilir.
- **H2 Baştan sona banyo yenileme:** Instagram'daki "baştan sona yepyeni banyo" videolarımız eski PVC duvar ve hazır dolapla başlar. Banyonun yenilenmesinde hangi işleri bizim yapacağımızı keşif sırasında açıkça konuşuyoruz.
- **SSS:**
  - *Banyo dolabı nemden etkilenir mi?* — Banyo dolabında kullanılacak gövde ve kapak malzemesini banyonun havalandırmasına göre birlikte seçiyoruz. Malzeme seçeneklerini ölçü günü örnekleriyle gösteririz.
  - *Mevcut lavaboyu kullanabilir miyiz?* — Çoğu zaman evet; dolabı mevcut lavabonun ölçüsüne göre yaparız. Lavabonun ve giderin fotoğrafını göndermeniz yeterli.
  - *Banyo dolabı fiyatı ne kadar?* — Ölçüye, kapak yüzeyine, ayna ve ışığa göre değişir. Banyonun fotoğrafını ve genişliğini WhatsApp'tan gönderin.

### Mutfak dolabı `/mutfak/`
- **Title:** Mutfak Dolabı Özel Ölçü | Şeker Mobilya Bahçelievler
- **Meta:** Ölçüye özel mutfak dolabı: tam açılan çekmeceler, kiler boy dolap, tavana kadar üst dolap, cam kapak. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** Mutfak dolabı, ölçüye özel
- **Giriş:** Mutfakta mesele görüntü kadar düzen: çekmecelerin nasıl açıldığı, kilerin nereye sığdığı, üst dolabın tavana kadar çıkıp çıkmadığı. Dolabı mutfağınızın ölçüsüne ve kullanımınıza göre kuruyoruz.
- **H2 Bu işte görülenler:** Tam açılan çekmeceler; Eviye dolabı; Tavana kadar üst dolap
- **H2 Kapak yerine çekmece:** Alt dolaplarda çekmece, arkaya itilmiş tencereyi aramayı bitirir. Dar mutfakta bile yan yana tam açılan çekmeceler kuruyoruz.
- **H2 Kiler ve boy dolap:** Boy dolabın içine çekme raflı kiler koymak, mutfağın en çok yer kazandıran parçası. Buzdolabı ve fırın yeriyle birlikte ölçülür.
- **H2 Tezgâh ve cam kapak:** Beyaz tezgâh, açık gri kapaklar, füme cam kapaklı boy dolap; Instagram'daki mutfaklarımızda en çok bu dil var. Tezgâh malzemesini örneklerle birlikte seçiyoruz.
- **SSS:**
  - *Mutfak dolabı fiyatı ne kadar?* — Fiyat duvar uzunluğuna, dolap sayısına, kapak ve tezgâh malzemesine göre değişir. Mutfağın fotoğrafını ve kaba ölçüsünü gönderin.
  - *Eski mutfağı siz mi söküyorsunuz?* — Sökümün kapsamını ölçü günü konuşuyoruz; ne yapılacağını önceden netleştiririz.
  - *Ankastre cihazlar sonra mı alınmalı?* — Cihazları önceden seçerseniz ölçüsünü dolaba göre ayarlarız; seçmediyseniz standart ölçüye göre yer bırakırız. Bunu ölçü günü birlikte karar veririz.

### Giyinme odası, gardırop ve genç odası `/giyinme-odasi-gardirop/`
- **Title:** Giyinme Odası ve Gardırop | Şeker Mobilya Bahçelievler
- **Meta:** Cam kapaklı ışıklı giyinme odası, tavana kadar gömme dolap, gardırop ve genç odası; ölçüye özel. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** Giyinme odası, gardırop ve genç odası
- **Giriş:** Cam kapaklı ve içi ışıklı giyinme odası, koridorda tavana kadar gömme dolap, makyaj masasıyla birleşen gardırop. Duvarın köşesine, kolonuna ve tavan yüksekliğine göre.
- **H2 Bu işte görülenler:** Cam kapak; Dolap içi ışık; Köşeyi dönen modül
- **H2 Cam kapak ve dolap içi ışık:** Giyinme odasında cam kapak ve içeriden gelen ışık, kıyafeti kapak açmadan gösterir; oda da bir vitrin gibi durur. Kapak açılınca yanan ya da sürekli yanan ışık seçilebilir.
- **H2 Tavana kadar düz kapak:** Koridorda ya da yatak odasında tavana kadar çıkan, kulpsuz görünümlü düz kapaklar duvarla bir bütün olur. Gömme alanlar boşa gitmez.
- **H2 Genç ve çocuk odası:** Ranza, çalışma köşesi, kemerli ışıklı niş ve çocuğun seçtiği lake renk birlikte tasarlanır. İki çocuğun paylaştığı odada basamakları çekmeceli ranza gibi çözümler kuruyoruz.
- **SSS:**
  - *Giyinme odası için ne kadar alan gerekir?* — Küçük bir oda, bir duvar boyu ya da bir köşe yeterli olabilir. Alanın fotoğrafını ve ölçüsünü gönderin, nasıl yerleşeceğini konuşalım.
  - *Gardırop fiyatı ne kadar?* — Genişliğe, yüksekliğe, kapak türüne (düz, cam, aynalı) ve iç düzene göre değişir. Ölçüyü ve istediğiniz kapağı yazın.
  - *Genç odasında renk seçebiliyor muyuz?* — Evet; lake kapaklarda renk seçilir. Instagram'daki lila genç odası ve pembe ışıklı nişli oda bunun örneği.

### Portmanto ve antre `/portmanto/`
- **Title:** Portmanto ve Antre Dekorasyonu | Şeker Mobilya Bahçelievler
- **Meta:** Ölçüye özel portmanto, gömme alan portmantosu, ceviz çıtalı antre duvarı, aynalı konsol. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** Portmanto ve antre duvarı
- **Giriş:** Eve girince ilk görülen yer antre. Ayakkabı, mont ve anahtar için yeri olan bir portmanto; yanında çıtalı duvar, ayna ve ince bir konsol.
- **H2 Bu işte görülenler:** Ceviz çıtalı duvar; Yarım ay ayna; Asma konsol
- **H2 Gömme alana portmanto:** Antredeki girintiye ya da kapı arkasındaki boşluğa ölçüsünde portmanto yapıyoruz; gerekirse yanına kitaplık ekleniyor.
- **H2 Çıtalı duvar ve ayna:** Ceviz ya da açık renk çıtalı panel, yarım ay veya yuvarlak ayna ve duvara asılı konsol; küçük antreyi de karşılama alanına çevirir.
- **H2 Kapı lake boyama:** Antreyle birlikte kapıyı da lake boyayla yeniliyoruz; Instagram'daki "After" videosunda portmantonun yanındaki kapı böyle.
- **SSS:**
  - *Portmanto fiyatı ne kadar?* — Genişliğe, ayna ve panel olup olmamasına göre değişir. Antrenin fotoğrafını ve ölçüsünü gönderin.
  - *Dar bir antreye sığar mı?* — Derinliği antreye göre azaltılmış, duvara asılı modüllerle dar antrelere de portmanto yapıyoruz.
  - *Çelik kapı veya iç kapı da boyanıyor mu?* — İç kapı lake boyamayı yapıyoruz; kapınızın türünü fotoğrafla gönderin, uygun olup olmadığını söyleyelim.

### Çıtalı duvar paneli ve lake petek kapama `/duvar-paneli-petek-kapama/`
- **Title:** Çıtalı Duvar Paneli ve Lake Petek Kapama | Şeker Mobilya
- **Meta:** Çıtalı (yivli) duvar paneli, tavan bandında gizli LED, lake petek kapama ve duvar dekorasyonu. Bahçelievler Yenibosna, Şeker Mobilya.
- **H1:** Çıtalı duvar paneli ve lake petek kapama
- **Giriş:** Duvarı mobilyanın bir parçası gibi bitiriyoruz: yatak başında tavana kadar çıtalı panel, tavan bandında gizli ışık, pencere altında görüntüyü bozan peteğe lake bir kapama.
- **H2 Bu işte görülenler:** Tavana kadar çıtalı duvar paneli; Tavan bandında gizli ışık; Arkası ışıklı yuvarlak ayna; Duvara asılı komodin
- **H2 Çıtalı duvar paneli:** Dikey çıtalı panel duvara derinlik verir, yatak başı ya da TV duvarında odanın odak noktası olur. Paneli komodin, ayna ve ışıkla birlikte tasarlıyoruz.
- **H2 Lake petek kapama:** Peteğin önüne, ısının geçeceği aralıklarla lake bir kapama yapıyoruz; üstü raf ya da konsol olarak kullanılabilir. Rengi duvara ya da dolaplara göre seçilir.
- **H2 Duvar dekorasyonu:** Konsol, ayna ve desenli duvarla küçük bir köşeyi de tamamlıyoruz.
- **SSS:**
  - *Petek kapama ısıyı engeller mi?* — Kapama, sıcak havanın geçeceği açıklıklarla yapılır; peteğin önü tamamen kapatılmaz. Ölçü günü peteğin tipine göre şekli belirlenir.
  - *Petek kapama için petek sökülür mü?* — Genellikle sökülmez; kapama peteğin önüne ve çevresine ölçüsüne göre yapılır. Peteğin fotoğrafını gönderin.
  - *Çıtalı panel hangi odalarda olur?* — İşlerimizde yatak başı duvarı, TV duvarı, antre ve banyo boy dolabının kenarında kullandık.

### İşler `/isler/`
- **Title:** İşlerimiz: Instagram'dan Gerçek Kareler | Şeker Mobilya
- **Meta:** TV ünitesi, banyo, mutfak, giyinme odası, genç odası, portmanto ve petek kapama: @sekermobilya Instagram'ında paylaştığımız işlerden 47 kare.
- **H1:** İşlerimiz
- **Giriş:** Buradaki tüm kareler Instagram'da (@sekermobilya) paylaştığımız işlerden alındı; temsili görsel yok. Yazılı olanlar Reels videolarının kapağı; videoların tamamı Instagram'da.

### Ortak
- Alt bilgi notu: "Sitedeki fotoğraflar Şeker Mobilya'nın Instagram hesabında paylaşılan işlerdir. Bu site kendi çerezini kullanmaz ve ziyaretçi verisi toplamaz; harita yalnız siz tıklayınca Google Haritalar'dan yüklenir."
- Slogan (firmanın): "Evinize tat katıyoruz."
<!-- METIN:SON -->

## 13 — SEO & ANALYTICS ENGINE

**Search intent → sayfa tablosu**
| Intent | Anahtar kelime (örnek) | Sayfa | Mesaj | İçerik | Kanıt | CTA |
|---|---|---|---|---|---|---|
| Yerel ticari | TV ünitesi Bahçelievler / Yenibosna, LED'li TV ünitesi, duvar ünitesi | `/tv-unitesi/` | Duvarın tamamı tek tasarım | Işık yerleri, yüzeyler, SSS fiyat | 6 kare | WhatsApp |
| Yerel ticari | banyo dolabı Bahçelievler, çamaşır makinesi dolabı, banyo yenileme | `/banyo/` | Banyonun her santimi | Makine dolabı, küçük banyo, ayna | 15 kare | WhatsApp |
| Yerel ticari | mutfak dolabı Bahçelievler, özel ölçü mutfak dolabı | `/mutfak/` | Görüntü kadar düzen | Çekmece, kiler, tezgâh | 5 kare | WhatsApp |
| Yerel ticari | giyinme odası, gömme dolap, gardırop, genç odası | `/giyinme-odasi-gardirop/` | Köşeye, kolona, tavana göre | Cam kapak, düz kapak, genç odası | 8 kare (4 + 4 genç odası) | WhatsApp |
| Yerel ticari | portmanto Bahçelievler, antre dekorasyonu, gömme portmanto | `/portmanto/` | İlk görülen yer | Gömme, çıtalı duvar, kapı boyama | 9 kare | WhatsApp |
| Bilgi + ticari | lake petek kapama, petek kapama ısıyı keser mi, çıtalı duvar paneli | `/duvar-paneli-petek-kapama/` | Duvarı mobilya gibi bitirmek | Panel, kapama, SSS | 4 kare | WhatsApp |
| Marka / navigasyon | Şeker Mobilya, Kemal Şeker Mobilya, Şeker Mobilya Yenibosna | `/` | Tek ekip | 6 oda dizini | Google 4,9/93 | WhatsApp / Ara |
| Görsel / karşılaştırma | (görsel arama) | `/isler/` | Temsili görsel yok | 47 kare | Instagram kaynağı | Mesaj |

**Sayfa başına teknik değerler** (title ≤60, meta ≤155 — testle doğrulandı)
| Slug | Title | Meta (karakter) | H1 |
|---|---|---|---|
| `/` | Şeker Mobilya \| Bahçelievler Özel Ölçü Mobilya ve Dekorasyon | 149 | Ölçüye özel mobilya, duvar ve ışık: odanın son hâli tek ekipten. |
| `/tv-unitesi/` | TV Ünitesi ve Duvar Ünitesi \| Şeker Mobilya Bahçelievler | 147 | TV ünitesi ve duvar ünitesi |
| `/banyo/` | Banyo Dolabı ve Banyo Yenileme \| Şeker Mobilya Bahçelievler | 145 | Banyo dolabı ve banyoyu baştan yenileme |
| `/mutfak/` | Mutfak Dolabı Özel Ölçü \| Şeker Mobilya Bahçelievler | 140 | Mutfak dolabı, ölçüye özel |
| `/giyinme-odasi-gardirop/` | Giyinme Odası ve Gardırop \| Şeker Mobilya Bahçelievler | 135 | Giyinme odası, gardırop ve genç odası |
| `/portmanto/` | Portmanto ve Antre Dekorasyonu \| Şeker Mobilya Bahçelievler | 127 | Portmanto ve antre duvarı |
| `/duvar-paneli-petek-kapama/` | Çıtalı Duvar Paneli ve Lake Petek Kapama \| Şeker Mobilya | 133 | Çıtalı duvar paneli ve lake petek kapama |
| `/isler/` | İşlerimiz: Instagram'dan Gerçek Kareler \| Şeker Mobilya | 141 | İşlerimiz |

**Local SEO**
- **NAP:** `Şeker Mobilya · Yenibosna Merkez, Ahmet Yesevi Cd. No:120, 34192 Bahçelievler/İstanbul · 0535 761 85 38` — tüm sayfalarda konum bölümü + alt bilgi + JSON-LD'de birebir aynı (testle kontrol). İkinci adres teyitle eklenir (`js/ayarlar.js`); teyitten önce Instagram bio ile Haritalar'ın aynı adresi göstermesi önerilir.
- **Google Business — müşteri aksiyonları (öncelik sırasıyla):** (1) "Web sitesi" alanını ölü `sekermobilya.wordpress.com` yerine yeni siteye çevirmek; (2) işletme adı "Şeker mobilya, mobilya imalatı, mobilya tadilatı, Ev dekorasyonu" anahtar kelime eklidir — Google yönergeleri adın gerçek tabela adı olmasını ister; askıya alma riski taşır. Ad değişikliği sıralamayı etkileyebileceği için karar müşterinin; öneri: tabela adıyla "Şeker Mobilya", hizmetler "Hizmetler" ve "Kategoriler" alanına (Mobilya İmalatçısı + Mutfak Dolabı Mağazası + İç Mimar gibi uygun ek kategoriler); (3) haftalık saatleri eksiksiz girmek; (4) her işten sonra 2–3 fotoğrafı Haritalar'a da yüklemek; (5) yorum isteği: teslim günü WhatsApp'tan Haritalar yorum bağlantısı göndermek (teşvik / ödül yok — Google kuralı).
- **Yerel içerik:** sayfa metinleri Yenibosna / Bahçelievler adını doğal yerlerde geçirir; ilçe adı doldurma yapılmaz.
- **Yapılandırılmış veri:** her sayfada `HomeAndConstructionBusiness` (adres, geo, telefon, sameAs Instagram + YouTube, areaServed); hizmet sayfalarında `Service` + `FAQPage` + `BreadcrumbList`; ana sayfada `WebSite`. **`aggregateRating` yok** (Google self-serving review kuralı); puan sitede tarihli ve kaynak bağlantılı metin olarak.
- **Sitemap:** `seker-mobilya/sitemap.xml` (8 URL). Search Console'a eklenmeli (müşteri / ajans hesabı).

**Ölçüm planı:** GA4 şu an **kurulmadı** (çerez onayı yükü ve KVKK metni gerektirir; müşteri isterse eklenir). Olaylar hazır, `window.dataLayer`'a düşüyor: `whatsapp`, `telefon`, `mesaja_git`, `mesaj_kopyala`, `yol_tarifi`, `harita`, `harita_yukle`, `instagram`, `yorumlar`, `galeri_suz` (+ `sayfa`). GA4/GTM eklenince bu olaylar dönüşüm olarak işaretlenir — onaydan önce yüklenmez.

## 14 — VISUAL INTELLIGENCE

**Kaynak:** Instagram ekran kaydı → 6 fps kare → ızgara ayırıcıları → tam görünen hücreler → aHash tekilleştirme → en keskin kare → Instagram simgeleri için üstten 37 px (sabitlenmiş paylaşımlarda 64–70 px + orantılı yan kırpma) → 348×428 WebP. 47 kare. Fare imleci görünen bir kare elendi, aynı işin imleçsiz karesi alındı.

**Sınıflandırma**
| Sınıf | Kareler |
|---|---|
| ATTENTION | `tv-unitesi-mermer-panel-led-raf`, `banyo-oval-led-ayna-boy-dolap`, `giyinme-odasi-cam-kapak-led` (ana sayfa kolajı), `yatak-odasi-citali-duvar-led` |
| PRODUCT | Yazısız 25 kare (her hizmet sayfasının kolajı + bölüm kareleri) |
| PROCESS | `banyo-oncesi-pvc-duvar`, `tv-unitesi-oncesi-bos-oda`, `portmanto-oncesi` ("işe başladığımız gün" — sonrası ile eşleştirilmedi) |
| PROOF | Tüm kareler (gerçek iş, Instagram kaynağı); Haritalar puanı (metin) |
| EMOTION | Sıcak ışıklı kareler (TV LED çerçeve, giyinme odası, oval ayna) |
| BRAND | Logo (profil fotoğrafından, 332 px), renkler: kırmızı #C4303A + nane #52C0A7 yalnız küçük vurgu |
| CONVERSION | — (fotoğraf yok; mesaj hazırlayıcı tasarım öğesi) |

**Tasarım dili (fotoğraflardan türetildi):** kırık beyaz lake zemin (#F4F1EB), açık gri lake ara yüzey, koyu ceviz bölüm (#2A201A), **gizli şerit ışık rengi** (#F1C56F) yalnız ince çizgi ve parıltı olarak (üst çubuğun altı = tavan bandı, süreç noktaları, mesaj bölümünün üst kenarı), **çıtalı panel dokusu** CSS ile (kolajın arkası, harita yer tutucusu). İmza öğe: fotoğrafın üzerinde numaralı noktalar + yanda görülen parçaların adı. Yazı: Fraunces (başlık) + Hanken Grotesk (metin), woff2 olarak sitenin içinde.

**Kurallar:** hiçbir fotoğraf 360 CSS px'ten geniş gösterilmez (testli); Reels kapağı ve başlangıç kareleri etiketli; temsili/stok görsel **yok**; Haritalar kapak fotoğrafı (kişi var) ve öne çıkanlardaki ünlü fotoğrafı kullanılmadı.

**SHOT LIST (müşteriden)**
| # | Konu | Açı / ışık | Kullanılacağı yer |
|---|---|---|---|
| 1 | Seçili 15–20 işin **orijinal fotoğrafları** (telefon galerisinden, sıkıştırılmamış) | — | Tüm sayfalar (2× netlik) |
| 2 | Mağaza / showroom cephesi ve içi (kişisiz) | Gün ışığı, karşıdan + 45° | Konum bölümü, adres teyidi |
| 3 | Atölye: kesim, lake boyahane, montaj hazırlığı | Doğal ışık, eller olabilir, yüz yok | Süreç bölümü ("İmalat") |
| 4 | Aynı açıdan önce / sonra çiftleri (3–4 iş) | Aynı noktadan, aynı yükseklikten | Ana sayfa "işe başladığımız gün" → önce/sonra |
| 5 | Lake renk kartelası, kaplama ve tezgâh numuneleri | Üstten, gün ışığı | Renk ve malzeme adımı, SSS |
| 6 | Petek kapama yakın çekim (ısı aralıkları) — yazısız | 45°, yakın | Duvar paneli sayfası kapağı |
| 7 | Genç odası yazısız kareleri | Geniş açı | Gardırop sayfası H2 |

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (açılmayanlar gerekçeli)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (gerekmiyor; koşulu yazılı)
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili görsel yok
- [x] `durum.md` güncellendi
