# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Aytaç Mobilya Tasarım / İmalat** · Klasör: `aytac-mobilya/` · Tarih: 2026-10-20
Girdi: (1) Google Haritalar işletme kartı ekran görüntüsü (`kaynak-haritalar-karti.png`), (2) Instagram profili `@aytac_mobilya` ekran kaydı (48 sn, 1334×878; profil başlığı + ızgaranın tamamı kaydırılarak), (3) kullanıcı talebi: "önce analiz, sonra site; modern, güven veren, stok fotoğrafsız, kaliteyi yansıtan, göz alıcı ama güven veren, güçlü SEO, basmakalıp yapay zekâ hissi olmayacak".

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Haritalar: "AYTAÇ MOBİLYA TASARIM/İMALAT" · Instagram: "AYTAÇ MOBİLYA" / `aytac_mobilya` | DOĞRULANMIŞ |
| Sektör | Haritalar kategorisi "Mobilya İmalatçısı"; Instagram bio "Kişiye Özel Mobilya İmalatı · Ölçü, Proje & Montaj" | DOĞRULANMIŞ |
| Adres | 30 Ağustos, 2071. Sk. 14A, 06794 Etimesgut/Ankara (Instagram konumu: "2071. Sk, Elvan, Ankara") | DOĞRULANMIŞ |
| Plus code / koordinat | WMV2+23 Etimesgut → tam kod 8GFJWMV2+23 → 39.94256, 32.65019 | DOĞRULANMIŞ (kart) / koordinat hesaplandı |
| Telefon | Kartta "… 50 44 33" — ilk hanelerin üstünü "Web sitesini aç" ipucu kutusu örtüyor | ❌ BİLİNMİYOR (KRİTİK) |
| WhatsApp | Bio: "Sipariş & Bilgi için DM-WhatsApp" → WhatsApp hattı var, numarası bilinmiyor | DOĞRULANMIŞ (varlık) / numara BİLİNMİYOR |
| Çalışma saati | Kayıt günü (20.10.2026, Salı) "Açık · Kapanış saati 22:00" | DOĞRULANMIŞ (yalnız o gün) |
| Google puanı | 5,0 ★ · 131 değerlendirme (20.10.2026) | DOĞRULANMIŞ |
| Web sitesi | Yok — Haritalar'daki "web sitesi" alanı Instagram'a gidiyor | DOĞRULANMIŞ |
| Instagram | 124 gönderi · 812 takipçi · kategori "Tasarım ve Moda" · öne çıkanlar: Kahve köşesi, Mutfak, Kitaplık, Banyo, Şifonyer, Balon kapak, Kitaplık… | DOĞRULANMIŞ |
| Logo | Lacivert daire içinde altın sarısı çizgiyle çatı + "AYTAÇ" + "Mobilya" etiketi | DOĞRULANMIŞ (profil fotoğrafı) |
| Ürün / hizmet | Paylaşımlardan görülen işler: mutfak dolabı, gardırop (kapaklı, sürgülü-aynalı, tavana kadar), banyo dolabı + LED aynalar, çamaşır makinesi dolabı, vestiyer/portmanto, ayakkabılık, kiler rafı, TV ünitesi, aydınlatmalı nişler, kitaplık, kahve köşesi, şifonyer/makyaj masası, yatak başlığı paneli, çalışma masası, çıtalı bölme, petek (kalorifer) örtüsü, mağaza raf + tezgâhı, çocuk ranzası/karyolası | DOĞRULANMIŞ (fotoğraf) — kapsam sınırı BİLİNMİYOR |
| Ticari amaç | Etimesgut ve Ankara'dan ölçü/keşif talebi almak; Instagram'daki işleri aranabilir hâle getirmek | [VARSAYIM] |
| Hedef kitle | Yeni taşınan / tadilat yapan ev sahipleri, yeni teslim konut alanları, küçük işletmeler | [VARSAYIM] (araştırma 04–05) |
| E-posta | — | BİLİNMİYOR |

**Repo incelemesi:** firmaya ait klasör yoktu → `aytac-mobilya/` açıldı. Kökteki `Ekran görüntüsü 2026-09-*.png` dosyaları başka projelere ait; dokunulmadı.

**Instagram ızgarası gözlemi (96 tekil paylaşım çıkarıldı):**
- **Yeni dönem (ızgaranın üst ⅔'ü):** kulpsuz / profil kulplu mat lake kapaklar (açık gri, kırık beyaz), meşe desenli niş ve tezgâhlar, *her yerde gizli LED şerit* (dolap altı, raf içi, tavan bandı, ayna arkası), yuvarlak / kemerli / dikdörtgen LED aynalar, tavana kadar dolaplar, siyah ince boy kulpları. Çekimler teslim günü, gerçek evlerde; bazılarında koruma naylonu, matkap, montaj artığı var → **gerçek iş kanıtı**.
- **Eski dönem (ızgaranın alt ⅓'ü):** parlak beyaz klasik kapaklar, çocuk ranzaları, ve showroom ortamında koltuk takımı / yemek masası / kadife yatak. Bunların firmanın imalatı mı, satışı yapılan hazır ürün mü olduğu BİLİNMİYOR → sitede kullanılmaz.
- Bir paylaşımda "ESKİ GÖRÜNTÜSÜ" yazısı var → firma önce/sonra paylaşıyor; ama sonrası hangi kare, eşleşme belirsiz → önce/sonra iddiası yapılmaz.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ad, adres, plus code, kategori, Instagram kullanıcı adı | DOĞRULANMIŞ |
| 2 | Google 5,0 ★ / 131 değerlendirme (20.10.2026) | DOĞRULANMIŞ — sitede tarih + kaynak linkiyle; JSON-LD'ye `aggregateRating` konmaz |
| 3 | O gün kapanış 22:00 | DOĞRULANMIŞ (kısmi) — haftalık saat gibi yazılmaz |
| 4 | Hizmet akışı "Ölçü, Proje & Montaj" | DOĞRULANMIŞ (bio) — süreç bölümünün omurgası |
| 5 | İş türleri listesi (01'deki) | DOĞRULANMIŞ (fotoğraf) |
| 6 | Görsel dil: mat lake + meşe + gizli LED + siyah ince kulp | DOĞRULANMIŞ (fotoğraf) |
| 7 | İşler müşteri evlerinde, teslim günü çekilmiş | ARAŞTIRMA BULGUSU (çıkarım: naylon, alet, boş oda) |
| 8 | İnternette (rehber, Armut vb.) firmaya dair başka kayıt yok | ARAŞTIRMA BULGUSU |
| 9 | Telefon / WhatsApp numarası | BİLİNMİYOR (KRİTİK) |
| 10 | Kuruluş yılı, ekip, atölye büyüklüğü, malzeme markaları (MDF, akrilik, lake vb.) | BİLİNMİYOR — kullanılmaz |
| 11 | Fiyat, garanti, teslim süresi, ücretsiz keşif | BİLİNMİYOR — vaat edilmez |
| 12 | Hizmet bölgesi | Etimesgut DOĞRULANMIŞ; Ankara geneli [VARSAYIM] (bio "Ankara / Etimesgut") |
| 13 | Eski showroom ürünleri imalat mı satış mı | BİLİNMİYOR — kullanılmaz |
| 14 | Görsel kullanım hakkı | Firmanın kendi Instagram'ı; site firma adına yapılıyor → [VARSAYIM] izinli; yazılı onay istenir |
| 15 | Görsel çözünürlüğü | Ekran kaydından ≈349×464 px | DOĞRULANMIŞ — orijinaller istenir |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| **KRİTİK** | Telefon / WhatsApp numarası | Birincil CTA ve NAP tutarlılığı | 09, 13, 16, 20 | Numara tek dosyada (`js/ayarlar.js`); boşken tüm "Yaz/Ara" düğmeleri Instagram DM'ye (`ig.me/m/aytac_mobilya`) gider — bio zaten "DM" diyor. JSON-LD'de `telephone` numara gelince eklenir. |
| YÜKSEK | Fotoğrafların orijinalleri (telefon galerisinden, tam çözünürlük) | Ekran kaydı kareleri retina ekranda yumuşak | 14, 16 | 349×464 kareler doğal boyutta (büyütmeden) kullanılır; tasarım küçük-çok kare üzerine kurulur |
| YÜKSEK | Haftalık çalışma saatleri, kapalı gün | "Bugün gidebilir miyim?" | 12, 13 | Yalnız "Haritalar'da bugünkü saati görün" + "gelmeden önce yazın" |
| ORTA | Malzeme bilgisi (gövde/kapak malzemesi, menteşe-ray markası) | Kalite kanıtı, SSS | 12 | Malzeme adı verilmez; "malzemeyi ölçü günü örneklerle birlikte seçiyoruz" gibi süreç dili de kullanılmaz (doğrulanmadı) → SSS "sorun, örnek gösterelim" |
| ORTA | Atölye / imalat fotoğrafı, ekip | "Kendi imalatı" iddiasının görsel kanıtı | 14 | Haritalar kategorisi + bio "imalat" yeterli; SHOT LIST'te atölye çekimi |
| ORTA | Hizmet bölgesi sınırı | Yerel SEO sayfa kapsamı | 13 | "Etimesgut merkezli, Ankara geneli — adresinizi yazın" |
| DÜŞÜK | E-posta, Google Business'ın ana bağlantısı | Footer, schema | 13 | E-posta yok; Haritalar arama linki |
| DÜŞÜK | Proje isimleri / semtleri | Proje sayfası zenginliği | 12 | Projeler iş türüyle anılır, semt uydurulmaz |

## 04 — DEEP RESEARCH

**1. Firmanın dijital izi**
- **Kaynak:** Web araması `"Aytaç Mobilya" Etimesgut telefon` — firmaya ait sonuç yok; çıkan sayfalar alakasız rehber ve Armut kategori sayfaları.
- **Yorum:** Firma internette yalnız Instagram + Haritalar'dan ibaret. Site, "Etimesgut mutfak dolabı" gibi aramalarda firmanın tek aranabilir vitrini olacak. Rakiplerin büyük kısmı da sitesiz → küçük ama net bir SEO açığı.

**2. Yerel pazar ve rakip dili**
- **Kaynak:** armut.com/etimesgut-ozel-olcu-dolap, /etimesgut-marangoz, /etimesgut-mutfak-dekorasyon, /ankara-ozel-olcu-dolap — usta profilleri "1980'den beri", "uygun fiyat garantisi", "zamanında teslimat", "kaliteli malzeme ve temiz işçilik" gibi kendi beyanlarını kullanıyor; hizmet listeleri hep aynı: mutfak dolabı, banyo dolabı, vestiyer, TV ünitesi, gardırop.
- **Yorum:** Sektörde dil tamamen ezber ve kanıtsız. Ayrışma, sıfat yerine *fotoğrafla görünen detayı adlandırmaktan* gelir ("tezgâh altı LED", "tavana kadar kapak", "makine dolabı"). Hizmet listesi rakiplerle aynı → SEO sayfaları da bu beş başlık üzerine kurulur, içerik farkı gerçek fotoğraf + gerçek detaydan gelir.

**3. Fiyat ve arama niyeti**
- **Kaynak:** armut.com/fiyatlari/ankara-mutfak-dolabi-yapimi ve Etimesgut talep ilanları (ör. "Yapracık TOKİ 3+1, 3,5 m alt-üst dolap + tezgâh", "kahve köşesi" talebi). Kullanıcıların girdiği bütçeler çok geniş aralıkta.
- **Yorum:** Arayan kişi "fiyat" sorar ama fiyat ölçüye bağlı; sitede fiyat verilmez, "fiyat ölçüye ve malzemeye göre çıkar, ölçünüzü/fotoğrafınızı gönderin" denir. **Kahve köşesi** gerçek bir arama talebi ve firmanın öne çıkan hikâyesi → mutfak sayfasında ayrı H2.

**4. Güncel eğilimler (firmanın kendi ızgarasından)**
- **Kaynak:** Instagram ızgarası (yeni → eski sıralı).
- **Yorum:** Firma klasik parlak beyazdan, mat lake + meşe + LED şerit diline geçmiş; yeni konut / tadilat alıcısının istediği dil bu. Site yalnız yeni dönemi gösterir.

**5. Güven unsurları**
- **Kaynak:** Haritalar kartı (5,0 / 131), Instagram (124 paylaşım, gerçek ev çekimleri).
- **Yorum:** 131 yorumun tamamının 5 yıldız olması bu sektörde çok güçlü bir kanıt; sitenin ana kanıtı bu ve fotoğraflar. Uydurma yorum metni yazılmaz; ziyaretçi Haritalar'da kendisi okur.

**6. Dönüşüm fırsatları**
- Ölçü işi uzaktan başlar: kişi odanın fotoğrafını ve kabaca ölçüsünü WhatsApp'tan atar. Site bu ilk mesajı **hazırlayan** bir araç sunabilir: iş türü + ilçe + "fotoğraf ekleyeceğim" seçimiyle hazır WhatsApp mesajı (form değil; veri toplanmaz).

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Yeni taşınan / tadilat yapan ev sahibi (birincil)
| Alan | İçerik |
|---|---|
| Tetikleyici | Yeni daire teslimi, tadilat, eski mutfağın / dolabın sökülmesi |
| İhtiyaç | Ölçüye tam oturan mutfak, gardırop, banyo dolabı; tek elden ölçü-imalat-montaj |
| Problem | Hazır dolap köşeye/kolona/tavana oturmuyor; boşluk kalıyor |
| Karar mekanizması | Çift birlikte; çoğunlukla görsel tercihi evin hanımı, bütçeyi birlikte; fotoğrafı Instagram'da görüp ilk mesajı atan kişi |
| Karar kriteri | Önceki işlerin görüntüsü, yorumlar, fiyat, teslim tarihi, iletişim hızı |
| İçsel risk | "Para verip beğenmezsem", "kapaklar zamanla bozulur mu" |
| Dışsal / sosyal risk | Misafirin göreceği mutfak; komşu/aile önerisi |
| Arzu | Derli toplu, ışığı yerinde, "mimar elinden çıkmış gibi" bir ev |
| İtiraz | "Mobilyacılar söz verip geciktiriyor", "fiyat çok değişken" |
| Müşteri dili | "Ölçüye göre yapıyor musunuz", "fiyat alabilir miyim", "Etimesgut'a geliyor musunuz", "tavana kadar olsun", "kahve köşesi istiyorum", "LED'li ayna" |
| Güven ihtiyacı | Gerçek ev fotoğrafı, gerçek yorum, adresi olan atölye |
| Beklenen sonuç | Söylenen ölçüde, söylenen günde, temiz montaj |
| Daha derin problem | Evin "bitmemiş" hissi; dağınıklık ve depolama sıkıntısı |

### Segment B — Tek parça arayan (banyo dolabı, vestiyer, TV ünitesi)
Tetikleyici: tek alan sorunlu (makine yeri, antre, TV duvarı) · İhtiyaç: hızlı, net fiyat · Problem: hazır ürün ölçüye uymuyor · Karar: tek kişi · Kriter: fotoğraf + fiyat · İçsel risk: "küçük iş diye önemsemezler" · Sosyal risk: düşük · Arzu: o köşenin toparlanması · İtiraz: "tek parça için gelirler mi" · Dil: "çamaşır makinesi dolabı", "petek örtüsü", "ayakkabılık" · Güven: benzer işin fotoğrafı · Sonuç: köşe çözülür · Derin problem: küçük alanın verimsizliği.

### Segment C — Küçük işletme (mağaza, ofis)
Tetikleyici: dükkân açılışı · İhtiyaç: raf, tezgâh, masa · Karar: işletme sahibi · Kriter: süre, dayanıklılık · Risk: açılışın gecikmesi · Dil: "mağaza rafı", "tezgâh" · Güven: ticari iş fotoğrafı (ızgarada mağaza rafı + tezgâh, ofis masası var). Sitede yalnız proje galerisinde yer alır (tek örnek → ayrı sayfa açılmaz).

## 06 — MARKET & COMPETITOR INTELLIGENCE
_(Puanlama yok. Rakip adı yalnız kaynakta görüldüyse yazılır.)_

| Tür | Kim | Konumlanma | Mesajları | Güven unsuru | Segment | Açık kalan fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Etimesgut/Ankara özel ölçü mobilya atölyeleri (Armut'ta: Özdemir Mobilya, Hanımeliay Mobilya ve isimsiz profiller) | "Her türlü özel ölçü işi" | Kuruluş yılı, uygun fiyat, zamanında teslim | Kendi beyanı, platform yorumları | A, B | Kimse işini detayla anlatmıyor; çoğu sitesiz |
| DOLAYLI | Hazır mobilya zincirleri / modüler mutfak markaları | Katalog + standart modül | Kampanya, taksit | Marka adı | A | Ölçüye oturmama sorunu → "ölçüye göre" mesajı |
| DOLAYLI | Armut / Instagram üzerinden iş toplayan bağımsız ustalar | Hızlı ve ucuz | Fiyat | Platform puanı | B | Adres + atölye + 131 yorum güveni |
| ALTERNATİF | Hazır ürün + kendin monte et (IKEA tipi, e-ticaret) | Ucuz, hemen | Fiyat, hız | Marka | B | Montaj, ölçü uyumsuzluğu, köşe kayıpları |

## 07 — MESSAGE ENGINE

**Ana mesaj:** *Ölçünüzü alıyor, projesini çiziyor, kendimiz üretip evinize kuruyoruz.* — "Ölçü, Proje & Montaj" (bio) + "Kişiye Özel Mobilya İmalatı" + Haritalar kategorisi "Mobilya İmalatçısı": hepsi doğrulanmış.
*(Not: İmalatın 2071. Sk. adresinde mi başka yerde mi yapıldığı BİLİNMİYOR → "atölyemiz şu adreste" denmez; adres "bize uğrayın" bağlamında verilir.)*

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A | Hazır dolap odaya oturmuyor | Beğenmeme, gecikme | Bitmiş, ışığı yerinde bir ev | Ölçü → çizim → imalat → montaj | 5,0 / 131 Google yorumu + gerçek ev fotoğrafları | Odanın fotoğrafını WhatsApp'tan gönder |
| B | Tek köşe (makine, antre, TV) dağınık | "Küçük iş diye önemsemezler" | O köşenin derlenmesi | Tek parça özel ölçü | Banyo/vestiyer/TV fotoğrafları | O köşenin fotoğrafını gönder |
| C | Dükkân rafı/tezgâhı | Açılış gecikmesi | Düzenli vitrin | Ölçüye raf + tezgâh | Mağaza fotoğrafı | Plan/fotoğraf gönder |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Ev ölçüleri standart değil; hazır mobilya boşluk bırakır |
| Çözüm | Kişiye özel imalat: mutfak, gardırop, banyo, vestiyer, TV ünitesi/kitaplık |
| Fayda | Duvardan duvara, tavana kadar kullanılan alan; gizli aydınlatma; tek muhatap |
| Süreç | 1) Fotoğraf + kabaca ölçü WhatsApp'tan 2) Yerinde ölçü 3) Proje / çizim 4) İmalat 5) Montaj (bio: "Ölçü, Proje & Montaj") — adımların süreleri BİLİNMİYOR, yazılmaz |
| Kanıt | Google 5,0 / 131 (tarihli, linkli) · 124 Instagram paylaşımı · gerçek ev fotoğrafları |
| Risk azaltma | **Firmanın gerçekten sunduğu doğrulanmış bir garanti / ücretsiz keşif yok → yazılmaz.** Yalnız: "Fiyatı ölçüden sonra yazılı/net konuşuruz" da doğrulanmadığı için yazılmaz. Risk azaltma = görünürlük: adres, yorumlar, iş fotoğrafları, "önce fotoğraf gönderin, fikir verelim" (bio'daki DM-WhatsApp akışı) |
| CTA | "Odanızın fotoğrafını gönderin" (WhatsApp; numara gelene dek Instagram DM) |

## 09 — CONVERSION ENGINE

**Yolculuk:** Dikkat (Haritalar / Google araması / Instagram) → Anlama (ilk ekranda: ne yapıyor, nerede) → İlgi (iş türüne göre fotoğraflar) → Güven (5,0 / 131, gerçek evler, adres) → Risk azaltma (önce fotoğraf gönder, yüz yüze ölçü) → Aksiyon (WhatsApp mesaj hazırlayıcı).

**CTA hiyerarşisi**
1. **Birincil:** WhatsApp — "Fotoğraf gönder / Ölçü iste" (hazır mesajla). Numara yokken → Instagram DM.
2. **İkincil:** Telefonla ara (numara gelince görünür) · Yol tarifi (Haritalar).
3. **Üçüncül:** Instagram'da tüm işler · Google yorumlarını oku.

| Sayfa | Next step |
|---|---|
| Ana sayfa | İş türü sayfası veya mesaj hazırlayıcı |
| İş türü sayfası | O iş türü önceden seçili WhatsApp mesajı |
| İşler (galeri) | Benzer işi seç → mesajda "bu fotoğraftaki gibi" |

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (Segment A)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta dayanıyor, garanti/keşif BİLİNMİYOR diye işaretli
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
