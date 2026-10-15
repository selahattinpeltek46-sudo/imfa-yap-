# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Ali Topçuoğlu Kömür Gübre Taşımacılık İnşaat Ticaret Sanayi Limited Şirketi** · Klasör: `ali-topcuoglu-komur-gubre/` · Tarih: 2026-10-15
Girdi: Kullanıcının sözlü brifi (Ali Topçuoğlu, Ramazan Topçuoğlu'nun kardeşi, Göksun'da ayrı ve büyük bir firma) + bu oturumda yapılan web araştırması + kullanıcının iş kolu teyidi.
Bağlantılı proje: `ramazan-topcuoglu-yapi-market/` (kardeş firma, aynı aile — ayrı ve bağımsız bir site olarak yürütülüyor, CLAUDE.md Kural 5 gereği birbirine karışmayacak).

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Ali Topçuoğlu Kömür Gübre Taşımacılık İnşaat Ticaret Sanayi Limited Şirketi | KULLANICI BİLGİSİ (ad + iş kolu kullanıcı tarafından teyit edildi) |
| Sektör | Kömür satışı · gübre satışı · taşımacılık/nakliye · inşaat ticareti | KULLANICI BİLGİSİ |
| Konum / hizmet bölgesi | Göksun / Kahramanmaraş; muhtemel adres Kurtuluş Mah. Mehmet Akif Ersoy Cad. No:2, Göksun/Kahramanmaraş | ARAŞTIRMA BULGUSU (KMTSO üye kaydı; firma adında "Ali Topçuoğlu" geçtiği için güçlü aday, ancak kullanıcı tarafından karakter karakter teyit edilmedi) |
| Telefon | Muhtemelen (0344) 714 21 76 | ARAŞTIRMA BULGUSU (aynı kaynak; teyit gerekiyor) |
| Web sitesi | Yok — bu proje ilk site | KULLANICI BİLGİSİ |
| Sosyal medya | BİLİNMİYOR | BİLİNMİYOR |
| Google Business | BİLİNMİYOR | BİLİNMİYOR |
| Ürün / hizmetler | Kömür (muhtemelen ısınma kömürü), gübre (muhtemelen kimyevi/tarım gübresi), taşımacılık/nakliye, inşaat ticareti malzemeleri | KULLANICI BİLGİSİ (unvandan) — ürünlerin tam kapsamı (kömür türleri, gübre çeşitleri, nakliye filosu, inşaat ticaretinin tam içeriği) BİLİNMİYOR |
| Ticari amaç | BİLİNMİYOR — bu proje henüz brif aşamasında; [VARSAYIM] telefonla sipariş/teklif toplamak | [VARSAYIM] |
| Hedef kitle | Göksun ve çevresindeki çiftçiler (gübre), haneler ve küçük işletmeler (kömür), müteahhit/inşaat firmaları (taşımacılık + inşaat ticareti) | VARSAYIM (unvan ve sektör araştırmasından çıkarıldı) |
| WhatsApp | BİLİNMİYOR | BİLİNMİYOR |
| E-posta | BİLİNMİYOR | BİLİNMİYOR |
| Çalışma saatleri | BİLİNMİYOR | BİLİNMİYOR |
| Logo / gerçek fotoğraf | Repoda yok | BİLİNMİYOR |
| Kuruluş yılı / tecrübe süresi | BİLİNMİYOR | BİLİNMİYOR |
| Filo / ekipman (nakliye için kritik) | BİLİNMİYOR | BİLİNMİYOR |

Repo incelemesi: `ali-topcuoglu-komur-gubre/` yeni açıldı, içinde dosya yok. Kök dizindeki `ramazan-topcuoglu-yapi-market/` kardeş firmanın sitesi — Kural 5 gereği bu projenin kapsamı dışında, dokunulmuyor.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ali Topçuoğlu, Ramazan Topçuoğlu'nun kardeşi; ikisi de Göksun'da ayrı ayrı "büyük firmalar" işletiyor | KULLANICI BİLGİSİ |
| 2 | Ali Bey'in firması kömür-gübre-taşımacılık-inşaat ticareti kombinasyonu | KULLANICI BİLGİSİ (teyit edildi) |
| 3 | Olası adres/telefon kaydı (KMTSO) | ARAŞTIRMA BULGUSU — teyit gerekiyor |
| 4 | Göksun ~1.350 m rakımda, kışları sert soğuk ("Akdeniz'in Sibiryası" olarak anılıyor) | ARAŞTIRMA BULGUSU (önceki proje `goksun-yorem` için de doğrulanmış coğrafi kaynak — bu proje için yeniden kullanılıyor) |
| 5 | Göksun'a doğalgaz dağıtımı kademeli ilerliyor; bazı mahalleler (Bahçelievler, Kurtuluş'un bir bölümü) gazlı, kapsamın tamamı BİLİNMİYOR | ARAŞTIRMA BULGUSU (Göksun Belediyesi arşiv haberi + akillitarife.com 2026 rehberi; tarih belirsiz, güncel kapsam teyitsiz) |
| 6 | Göksun'un başlıca tarım ürünleri: elma (öne çıkan), buğday, arpa, şeker pancarı, nohut, fasulye, ceviz | ARAŞTIRMA BULGUSU (Maraş Manşet Gazetesi, DOĞAKA bölgesel tarım verisi) |
| 7 | Kimyevi gübre fiyat artışları çiftçileri alternatif (leonardit/organik) gübreye yönlendiriyor — genel bölgesel haber, Göksun'a özgü değil | ARAŞTIRMA BULGUSU (Maraş Pusula; ~700 gün önceki habere dayanıyor, güncelliği şüpheli) |
| 8 | Göksun'da çevrimiçi görünür, Göksun'a özgü kömür/gübre bayii bulunamadı; Kahramanmaraş merkez ve Türkoğlu'nda gübre firmaları var ama Göksun'a kayıtlı görünmüyorlar | ARAŞTIRMA BULGUSU (web araması; harita verisi taranamadı, bu nedenle kesin değil) |
| 9 | Göksun'da/çevresinde hafriyat-nakliye firmaları mevcut: Alicanlar Hafriyat (1986'dan beri, kendi beyanıyla), Asejan Taşımacılık, Şeroğulları Hafriyat, Kırışoğlu Hafriyat Nakliyat Turizm İnşaat Taahhüt | ARAŞTIRMA BULGUSU (dizin siteleri; güncellik ve tam adresler teyitsiz) |
| 10 | `soyleroglu-hafriyat/` adlı başka bir proje repoda zaten var — hafriyat/nakliye sektöründe doğrudan dolaylı rakip/emsal olabilir, aynı repo içinde başka bir müşteri | DOĞRULANMIŞ (repo içi gözlem) — Ali Bey'in firmasıyla ilişkisi BİLİNMİYOR, rakip mi değil mi netleşmeli |
| 11 | Ramazan Bey'in yapı marketiyle ürün örtüşmesi olabilir mi (ör. inşaat ticareti ⟷ yapı malzemeleri) | [VARSAYIM] — iki kardeş firması birbirine yönlendirme/çapraz referans fırsatı olabilir, ama rekabet de olabilir; kullanıcıya sorulacak (bkz. 03) |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| KRİTİK | Telefon / WhatsApp numarasının kesin teyidi | Tüm CTA'lar buna bağlı; yanlış numarayla yayına çıkmak gerçek bir üçüncü kişiye zarar verebilir | 09, 15, 18 | Araştırmada bulunan (0344) 714 21 76 **teyit edilene kadar** geliştirmede kullanılmayacak; site taslağında açık yer tutucu olacak |
| KRİTİK | Adresin kesin teyidi | Yerel SEO, harita, "nerede?" sorusu; Ramazan Bey'in adresiyle aynı cadde/numara olması aile kompleksi mi yoksa hatalı kayıt mı belirsiz | 10, 13, 18 | Kurtuluş Mah. M. Akif Ersoy Cad. No:2 [VARSAYIM], teyit gerekiyor |
| YÜKSEK | Ürünlerin tam kapsamı: kömür türleri (linyit/ithal/kok vb.), gübre çeşitleri (kimyevi/organik, hangi markalar), taşımacılık hizmetinin kapsamı (araç tipi, hangi yükler), inşaat ticaretinin içeriği | Mesaj, teklif ve sayfa mimarisi doğrudan buna bağlı | 04 (tamamlandı, genel), 07, 08, 10 | Dört ana iş kolu (kömür/gübre/nakliye/inşaat ticareti) ayrı ayrı ele alınacak; ürün detayları kullanıcıdan gelene kadar genel/kategori düzeyinde kalacak |
| YÜKSEK | Ramazan Bey'in yapı marketiyle ilişki (işbirliği mi, bağımsız mı, rekabet mi) | Çapraz link/mesaj stratejisi ve "iki kardeş firması" anlatısının kullanılıp kullanılmayacağı buna bağlı | 07, 09, 13 | [VARSAYIM] İki firma tamamen bağımsız sunulacak, aile bağı sadece kullanıcı onayı ile ve yalnızca doğruysa belirtilecek — şimdilik sitede "kardeş firma" anlatısı KULLANILMAYACAK |
| ORTA | Çalışma saatleri | Ziyaret/arama kararı | 10, 15 | Pzt–Cmt 08:00–18:00 [VARSAYIM], teyit gerekiyor |
| ORTA | Filo / ekipman bilgisi (nakliye için kaç araç, kapasite) | Taşımacılık hizmetinin güvenilirlik kanıtı | 08, 14 | BİLİNMİYOR — sitede somut sayı kullanılmayacak |
| ORTA | Kuruluş yılı / tecrübe süresi | Güven unsuru olarak kullanılabilir mi | 07, 08 | BİLİNMİYOR — sitede yıl/tecrübe iddiası kullanılmayacak |
| DÜŞÜK | Logo | Marka tutarlılığı | 14 | İkon + yazı logosu (Ramazan Bey'in sitesindeki gibi) |
| DÜŞÜK | Gerçek saha/depo fotoğrafları | Güven; stok görsel "temsili" etiketiyle kullanılacak | 14 | Geçici stok görseller, "temsili" notu ile |

## 04 — DEEP RESEARCH

**Bulgu 1 — Göksun'un iklimi ve ısınma ihtiyacı**
Kaynak: Yandex soru-cevap, PeakVisor (önceki `goksun-yorem` projesinde doğrulanmış) + Göksun Belediyesi arşiv haberi, akillitarife.com (2026).
Yorum: Göksun yüksek rakımlı ve kışı sert bir ilçe; doğalgaz dağıtımı kademeli ilerliyor ve tüm mahalleleri kapsadığına dair kanıt yok. Bu, kömürün hâlâ gerçek bir ısınma ihtiyacı olduğuna işaret ediyor — ama "herkes kömürle ısınıyor" gibi abartılı bir iddia kurulamaz; mesaj "kışa hazırlık" ve "güvenilir tedarik" etrafında kurulmalı, doğalgazı küçümseyen bir ton kullanılmamalı.

**Bulgu 2 — Tarımsal yapı ve gübre talebi**
Kaynak: Maraş Manşet Gazetesi ("Kahramanmaraş'ın İlçelerinde Hangi Tarım Ürünleri Yetişiyor?"), DOĞAKA bölgesel tarım verisi.
Yorum: Göksun elmasıyla öne çıkan, ayrıca tahıl ve baklagil üreten bir tarım ilçesi. Çiftçi segmenti gerçek ve somut: meyve bahçesi ve tarla sahipleri düzenli gübre alıcısı. Ancak gübre fiyat artışı / alternatif arayışı haberi (Bulgu 3) eski ve tek kaynaklı — sitede "uygun fiyat" gibi genel ifadeler kullanılabilir, güncel fiyat karşılaştırması iddia edilemez.

**Bulgu 3 — Gübre fiyat baskısı**
Kaynak: Maraş Pusula ("Kahramanmaraş'ta leonardit, organik gübre...").
Yorum: Haber ~700 gün eski ve tek bir üreticinin görüşüne dayanıyor; Göksun'a özgü değil. Sitede kanıt olarak KULLANILMAYACAK, sadece arka plan bağlamı olarak değerlendirildi.

**Bulgu 4 — Çevrimiçi rekabet (kömür/gübre)**
Kaynak: "Göksun kömür bayii gübre bayii", "Göksun tarım gübre" web aramaları; bulurum.com gübre firmaları listesi (Kahramanmaraş merkez/Türkoğlu ağırlıklı, Göksun kaydı yok); KMTSO arama sonuçları; TİGEM bayi listesi (Tunet İnşaat Nakliyat Temizlik Gıda Petrol Ürünleri — Göksun'da kayıtlı ama petrol ağırlıklı, gübre bayisi değilmiş gibi görünüyor); Teco bayi sayfası (Demirulus Meşrubat Gıda Tekel Maddesi Yem Gübre Taahhüt San. Tic. Ltd. Şti. — Göksun'da, yem/gübre karışık bir ticaret).
Yorum: Göksun'a özgü, çevrimiçi görünür ve sadece kömür-gübre odaklı bir rakip bulunamadı; bulunan firmalar (Demirulus, Tunet) karma ürün yelpazesine sahip (yem, gıda, petrol, tekel maddesi gibi). Bu, Ali Bey'in firması için çevrimiçi görünürlükte gerçek bir boşluk olabileceğini gösteriyor — ama harita/yerinde rakip taranamadığı için kesin değil.

**Bulgu 5 — Nakliye/hafriyat rekabeti**
Kaynak: "Göksun nakliye hafriyat taşımacılık" web araması; Alicanlar Hafriyat kendi sitesi; Tikla.com.tr rehberi; repo içi gözlem (`soyleroglu-hafriyat/` projesi).
Yorum: Göksun ve çevresinde hafriyat/nakliye alanında en az birkaç aktif firma var (Alicanlar Hafriyat 1986'dan beri kendi beyanıyla faaliyette). Önemli not: repo içinde zaten **Söyleroğlu Hafriyat** adlı başka bir müşteri projesi var — bu, Ali Bey'in taşımacılık/nakliye hizmetiyle doğrudan aynı pazarda olabilir. Bu iki proje birbirine rakip olarak konumlanmamalı; Ali Bey'in sitesinde Söyleroğlu'na dair hiçbir kıyas veya olumsuz atıf yapılmayacak (Kural: iyi/kötü puanlama yok).

**Bulgu 6 — İnşaat ticareti ⟷ yapı market örtüşmesi**
Kaynak: Bu konuşmadaki önceki araştırma (Ramazan Bey'in `ramazan-topcuoglu-yapi-market` projesi, Modül öncesi).
Yorum: Ramazan Bey'in firması genel yapı malzemeleri/boya/nalburiye satıyor; Ali Bey'in unvanındaki "inşaat ticareti" muhtemelen toptan/büyük ölçekli malzeme veya nakliye odaklı olabilir — ama bu VARSAYIM'dır. İki firma arasında ürün çakışması veya işbirliği olup olmadığı BİLİNMİYOR (bkz. 03). Netleşene kadar sitede iki firma arasında hiçbir bağlantı kurulmayacak.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Çiftçi / bahçe-tarla sahibi (gübre müşterisi)
| Alan | İçerik |
|---|---|
| Tetikleyici | Ekim/dikim sezonu, gübreleme dönemi, elma bahçesi bakımı |
| İhtiyaç | Doğru zamanda, yeterli miktarda ve güvenilir gübre tedariki |
| Problem | Fiyat artışları, stok bulamama, yanlış/etkisiz ürün alma riski |
| Karar mekanizması | Çiftçinin/bahçe sahibinin kendisi; büyük arazilerde aile/ortak karar |
| Karar kriteri | Fiyat, stok güvencesi, teslim hızı, tanıdıklık |
| İçsel risk | "Parayı verip etkisiz/yanlış ürün aldım" |
| Dışsal / sosyal risk | Komşu çiftçiye göre verim kaybı |
| Arzu | Sezonu kaçırmadan, güvendiği bir yerden tedarik |
| İtiraz | "Fiyat çok arttı", "stok var mı emin değilim" |
| Müşteri dili | "Gübre geldi mi?", "Ne kadar lazım elma bahçesine?", "Kaça?" |
| Güven ihtiyacı | Tanıdık/yerel satıcı, net fiyat, zamanında teslim |
| Beklenen sonuç | Sağlıklı ürün/verim, sezonu kaçırmamak |
| Daha derin problem | Artan girdi maliyetleri karşısında üretimin karşılığını alamama endişesi (bölgesel haberlerde de yansıyor — Bulgu 2) |

### Segment B — Hane / küçük işletme (kömür müşterisi)
| Alan | İçerik |
|---|---|
| Tetikleyici | Kış hazırlığı, soğuklar bastırmadan stok yapma |
| İhtiyaç | Yeterli, kaliteli ve zamanında teslim edilen yakacak kömürü |
| Problem | Kışın ortasında kömür bulamama veya pahalıya alma riski |
| Karar mekanizması | Hane reisi / işletme sahibi |
| Karar kriteri | Fiyat, teslim hızı (eve/işyerine getirme), kömürün yanma kalitesi |
| İçsel risk | "Kış ortasında kömürüm biter" |
| Dışsal / sosyal risk | Yok denecek kadar az — bireysel bir ihtiyaç |
| Arzu | Kışı dert etmeden geçirmek |
| İtiraz | "Doğalgaza geçtim, kömüre gerek yok" (bir kısım müşteri için gerçek bir itiraz — Bulgu 1) |
| Müşteri dili | "Kömür var mı?", "Eve kadar getiriyor musunuz?", "Tonu kaça?" |
| Güven ihtiyacı | Zamanında teslimat, doğru tartı/ölçü |
| Beklenen sonuç | Sorunsuz, sıcak bir kış |
| Daha derin problem | Kış aylarında temel bir ihtiyacın kesintiye uğraması korkusu |

### Segment C — Müteahhit / küçük inşaat işletmesi (nakliye + inşaat ticareti müşterisi, ikincil)
Tetikleyici: Şantiye malzeme/hafriyat taşıma ihtiyacı · İhtiyaç: Güvenilir araç/şoför, zamanında teslim · İtiraz: "Araç bulabilecek miyim, ne zaman gelir?" · Müşteri dili: "Kaç ton taşıyorsunuz?", "Araç ne zaman müsait?" · Güven ihtiyacı: Geçmiş iş deneyimi, araç/filo yeterliliği (BİLİNMİYOR, bkz. 03). → Filo bilgisi teyit edilene kadar sitede somut kapasite iddiası (ör. "X ton", "X araç") KULLANILMAYACAK.

## 06 — MARKET & COMPETITOR INTELLIGENCE
(Puanlama yapılmamıştır.)

| Tür | Rakip | Konumlanma | Kullandığı mesajlar | Güven unsurları | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Demirulus Meşrubat Gıda Tekel Maddesi Yem Gübre Taahhüt San. Tic. Ltd. Şti. (Göksun, Teco bayi listesi) | Karma ticaret (meşrubat, gıda, yem, gübre) | BİLİNMİYOR (web varlığı bulunamadı) | BİLİNMİYOR | Çiftçi | Gübrede uzmanlaşmış, net ve çevrimiçi görünür bir tedarikçi konumlanması |
| DOĞRUDAN | Tunet İnşaat Nakliyat Temizlik Gıda Petrol Ürünleri San. Tic. Ltd. Şti. (Göksun, TİGEM bayi listesi) | Karma ticaret, petrol ürünleri ağırlıklı | BİLİNMİYOR | BİLİNMİYOR | Hane / işletme | Kömürde net konumlanma |
| DOĞRUDAN | Alicanlar Hafriyat (Kahramanmaraş/Göksun'da hizmet, kendi beyanıyla 1986'dan beri) | "Aile geleneği", kum-çakıl-hafriyat-nakliye | "1986'dan beri", aile işletmesi vurgusu | Uzun süredir faaliyet iddiası (kendi beyanı, bağımsız doğrulama yok) | Müteahhit | Göksun'a özgü, yerel ve kişisel ilişkili nakliye hizmeti |
| DOLAYLI | Kahramanmaraş merkez/Türkoğlu'ndaki büyük gübre firmaları (bulurum.com listesi) | Daha büyük ölçek, il merkezine yakınlık | BİLİNMİYOR | BİLİNMİYOR | Çiftçi | Göksun'da yerinde, nakliye derdi olmayan tedarik |
| DOLAYLI | Doğalgaz dağıtım şirketi (Kahramanmaraş Doğalgaz) | Alternatif ısınma kaynağı, altyapı yatırımı | "Modern, temiz ısınma" | Kurumsal, resmi altyapı | Hane | Doğalgazın henüz ulaşmadığı bölgelerde kömürün hâlâ gerekli olduğu net anlatım |
| ALTERNATİF | Çiftçinin organik/leonardit gübreye yönelmesi (Bulgu 3) | Maliyet odaklı alternatif arayışı | "Daha uygun, doğal" | Üretici beyanı | Çiftçi | Hem kimyevi hem alternatif gübre seçeneği sunan tedarikçi konumu (ürün kapsamı teyit edilirse) |
| ALTERNATİF | Diğer hafriyat/nakliye firmaları (Söyleroğlu Hafriyat — repo içi, Şeroğulları, Kırışoğlu, Asejan) | Çeşitli | BİLİNMİYOR | BİLİNMİYOR | Müteahhit | — (Söyleroğlu repo içi başka bir müşteri; kıyas/olumsuz atıf yapılmayacak) |

## 07 — MESSAGE ENGINE

**Ana mesaj (taslak, iş kolu detayları teyit edilene kadar genel düzeyde):** *Göksun'da kömürden gübreye, nakliyeden inşaat ticaretine — tek güvenilir adres.*

| Halka | Segment A (Çiftçi) | Segment B (Hane — Kömür) |
|---|---|---|
| Problem | Sezonunda doğru gübreyi bulamama | Kış ortasında kömürsüz kalma |
| Kaygı | Etkisiz ürün, fiyat belirsizliği | Zamanında teslim edilmeme |
| Arzu | Güvendiği bir tedarikçiden, zamanında | Kışı dert etmeden geçirmek |
| Çözüm | Göksun'da yerinde gübre tedariki | Göksun'da yerinde kömür tedariki, eve teslim [VARSAYIM — teslim hizmeti teyit edilmeli] |
| Kanıt | BİLİNMİYOR (yıl, belge, referans yok) — şimdilik kanıt halkası boş bırakılacak | Aynı |
| Aksiyon | Telefonla/WhatsApp'tan fiyat ve stok sor | Aynı |

Segment C (Müteahhit/nakliye) mesajı: "Göksun'da şantiyenizin nakliye ve malzeme ihtiyacına güvenilir çözüm." (filo/kapasite iddiası yok — bkz. 03)

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Kömür, gübre, nakliye ve inşaat ticaretinde Göksun'da dağınık, çevrimiçi görünmeyen bir tedarik piyasası |
| Çözüm | Dört iş kolunun tek bir güvenilir adreste toplanması |
| Fayda | Tek telefonla ihtiyacı karşılama, yerel/yakın tedarik, aracı gerektirmeme |
| Süreç | 1) Telefon/WhatsApp ile ihtiyaç ve miktar bildirilir → 2) Fiyat ve stok teyit edilir → 3) Teslim/alım planlanır |
| Kanıt | BİLİNMİYOR — kuruluş yılı, belge, referans, filo kapasitesi gibi hiçbir somut kanıt şu an elde yok |
| Risk azaltma | BİLİNMİYOR — garanti/iade gibi bir vaat firma tarafından teyit edilmeden **uydurulmayacak** |
| CTA | "Telefonla Arayın" (birincil, WhatsApp teyit edilirse ikincil kanal olarak eklenecek) |

## 09 — CONVERSION ENGINE

Yolculuk (ilk sürümde muhtemelen tek sayfa; Modül 2'de bilgi mimarisi netleşecek):
| Aşama | Bölüm | Görevi |
|---|---|---|
| Dikkat | Hero | Dört iş kolunu net özetleyen başlık |
| Anlama | Hero alt metin, hizmet kartları | Kömür / gübre / nakliye / inşaat ticareti ayrımı |
| İlgi | Hizmet detay kartları | Her iş kolu için kısa, somut açıklama |
| Güven | Hakkımızda | Göksun'da yerel, aile işletmesi vurgusu — yalnızca teyit edilen bilgiyle |
| Risk azaltma | "Nasıl çalışıyoruz" adımları | Belirsizliği azaltma |
| Aksiyon | Telefon/WhatsApp butonları | İletişim |

CTA hiyerarşisi:
- **Birincil:** Telefonla arama (telefon numarası teyit edilene kadar sitede yer tutucu/işaretli)
- **İkincil:** WhatsApp (numara teyit edilirse eklenecek)
- **Üçüncül:** BİLİNMİYOR — form gerekip gerekmediği Modül 2'de değerlendirilecek

Next step haritası: Hero → Hizmetler · Hizmet kartı → Telefon (ilgili iş koluna özel ön doldurulmuş mesaj, WhatsApp teyit edilirse) · Hakkımızda → İletişim · Footer → Telefon

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı — 2 KRİTİK madde (telefon, adres) var
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (A ve B)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta dayanıyor ya da BİLİNMİYOR diye işaretli
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi

**NOT — KRİTİK DURUM:** Bu projede 2 KRİTİK bilgi eksikliği var (telefon ve adresin kesin teyidi). Otomatik pilot ilkeleri gereği Modül 2'ye genel/kategori düzeyinde devam edilebilir (bilgi mimarisi, SEO iskeleti, metin taslağı iş kolu bazında, kişiye özel iddia olmadan hazırlanabilir), ancak **Modül 3 (geliştirme/yayın)** öncesinde bu iki bilgi mutlaka kullanıcıdan teyit alınmalı — yanlış telefon/adresle yayına çıkmak gerçek bir üçüncü kişiye zarar verebilir.
