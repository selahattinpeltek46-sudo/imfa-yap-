# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Barber's Town Erkek Kuaför & Güzellik Merkezi** · Klasör: `barbers-town/` · Tarih: 2026-10-15
Girdi: kullanıcının paylaştığı Google Haritalar işletme kartı ekran görüntüsü + Haritalar bağlantısı + "araştırıp web sitesi yap" talebi.

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | BARBER'S TOWN ERKEK KUAFÖR&GÜZELLİK MERKEZİ (tabelada: "BARBER'S TOWN") | DOĞRULANMIŞ (Haritalar kartı + tabela fotoğrafı) |
| Sektör | Erkek kuaförü / berber; Haritalar kategorisi "Güzellik Salonu" | DOĞRULANMIŞ |
| Adres | 7 Tepe Mahallesi (Yeditepe), 85043 Nolu Cad., Maliyeci Ahmet Sitesi A Blok No:75/A İç Kapı No:1, 27000 Şahinbey/Gaziantep | DOĞRULANMIŞ (Haritalar) |
| Plus code / koordinat | 28MF+QQ Şahinbey · 37.0343773, 37.3244184 | DOĞRULANMIŞ |
| Telefon | 0535 729 43 33 | DOĞRULANMIŞ |
| WhatsApp | Aynı numara (mobil hat) | [VARSAYIM] — teyit gerek |
| Çalışma saati | Görüntü alındığı gün "Açık · Kapanış 21:00"; açılış saati ve kapalı gün BİLİNMİYOR | DOĞRULANMIŞ (kısmi) |
| Google puanı | 5,0 ★ · 140 değerlendirme (15.10.2026 itibarıyla) | DOĞRULANMIŞ |
| Web sitesi | Yok (kartta "Web sitesi ekleyin") | DOĞRULANMIŞ |
| Sosyal medya | Bulunamadı | BİLİNMİYOR |
| Hizmetler | "Erkek kuaför & güzellik merkezi" adı → saç, sakal, bakım | Ad DOĞRULANMIŞ, hizmet listesi [VARSAYIM] |
| Fiyatlar | — | BİLİNMİYOR |
| Ticari amaç | Randevu / ziyaret almak, Google'da adı arayanı dükkâna yönlendirmek | [VARSAYIM] (kullanıcı "web sitesi yap" dedi) |
| Görseller | Yalnız Haritalar kartındaki cephe fotoğrafı (377 px, telif sahibi belirsiz) | DOĞRULANMIŞ / kullanım hakkı BİLİNMİYOR |

Repo incelemesi: firmaya ait klasör yoktu; `barbers-town/` yeni açıldı. Kökteki ekran görüntüleri başka projelere ait.

Cephe fotoğrafı gözlemi: koyu antrasit cephe, sıcak sarı aplik ışıklar, giriş merdiveninde kırmızı halı, makas figürlü oval siyah-beyaz "BARBER'S TOWN" tabelası, kemerli giriş. → Marka dili: koyu, gece aydınlatmalı, "kırmızı halı" karşılama.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ad, adres, telefon, plus code, kategori | DOĞRULANMIŞ |
| 2 | Google 5,0 ★ / 140 değerlendirme | DOĞRULANMIŞ (tarihle birlikte kullanılacak) |
| 3 | Kapanış 21:00 (en az bir gün için) | DOĞRULANMIŞ (kısmi) |
| 4 | Tabela: makaslı oval logo, siyah-beyaz | DOĞRULANMIŞ |
| 5 | Kırmızı halılı giriş, sıcak ışıklı modern cephe | DOĞRULANMIŞ (fotoğraf) |
| 6 | Haritalar ID son eki `/g/11yz…` → profil görece yeni açılmış olabilir | ARAŞTIRMA BULGUSU (dolaylı çıkarım) |
| 7 | İnternette (web, haber, rehber) işletmeye dair başka iz yok | ARAŞTIRMA BULGUSU |
| 8 | WhatsApp hattı = telefon | [VARSAYIM] |
| 9 | Hizmetler: saç kesimi, sakal tıraşı/şekillendirme, saç-sakal, çocuk tıraşı, cilt bakımı, kaş/ağda, damat tıraşı | [VARSAYIM] — hizmet kartları ve form seçeneklerinde düzenlenir |
| 10 | Randevu sistemi var mı / walk-in mi | BİLİNMİYOR → site "randevu talebi + gelebilirsiniz" der |
| 11 | Kuruluş yılı, usta adı, tecrübe, ekip sayısı | BİLİNMİYOR — sitede kullanılmayacak |
| 12 | Fiyat | BİLİNMİYOR — "fiyat için yazın" |
| 13 | Otopark, kart ile ödeme, klima vb. | BİLİNMİYOR — kullanılmayacak |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| YÜKSEK | WhatsApp'ın bu numarada aktif olduğu | Birincil CTA WhatsApp | 09, 16, 20 | Aktif [VARSAYIM]; telefon CTA'sı her yerde yanında |
| YÜKSEK | Gerçek hizmet listesi ve fiyatlar | Karar kriteri; yanlış hizmet = güven kaybı | 08, 12 | Kategori-tipik liste, fiyat yok, "teyit gerek" notu proje dosyalarında |
| YÜKSEK | Gerçek fotoğraflar (iç mekân, işler) | Berberde karar görselle verilir | 14 | Fotoğrafsız tipografik tasarım + SHOT LIST; Haritalar fotoğrafı telif belirsizliği nedeniyle kullanılmadı |
| ORTA | Haftalık çalışma saatleri | "Şimdi gidebilir miyim?" sorusu | 11, 12 | Yalnız "kapanış 21:00" yazılır, ayrıntı için ara |
| ORTA | Instagram hesabı | Saç modeli portföyü için en güçlü kanal | 10, 13 | Yok; alan hazır, boşsa gizli |
| DÜŞÜK | Logo dosyası | Marka tutarlılığı | 14 | Tabeladan esinlenen SVG oval yazı logosu (temsili) |
| DÜŞÜK | Yorum metinleri (izinli) | Sosyal kanıt | 07 | Yorum alıntısı YOK; yalnız puan + Haritalar bağlantısı |

KRİTİK eksik yok: telefon ve adres doğrulanmış olduğundan site yayına uygun bir sürümle teslim edilebilir.

## 04 — DEEP RESEARCH

**Bulgu 1 — İşletmenin çevrimiçi izi**
Kaynak: "Barber's Town Gaziantep kuaför", "Barbers Town erkek kuaför Şahinbey instagram" web aramaları (2026-10-15) — sonuç yok; Haritalar sayfası konteynerden açılamadı.
Yorum: İşletmenin tek dijital varlığı Haritalar profili. Site; adını arayan, Haritalar'dan "web sitesi" tıklayan veya WhatsApp'ta link paylaşılan kişiye hizmet eden **dijital kartvizit + randevu kapısı** olmalı.

**Bulgu 2 — Fiyat düzenlemesi**
Kaynak: Gazete haberleri — Gaziantep Berberler Esnaf Odası 2026 için A sınıfı berber fiyat tarifesi yayımladı (ayrıntılı rakamlar arama sonucunda yoktu). İstanbul Berberler Odası 2026: saç 500 TL, sakal 300 TL, kombine 800 TL (habergazetesi.com.tr).
Yorum: Fiyatlar oda tarifesine bağlı ve yılda en az bir kez değişiyor; sitede sabit fiyat yazmak hızla eskir. "Güncel fiyatı WhatsApp'tan sorun" + ileride düzenlenebilir fiyat alanı doğru çözüm.

**Bulgu 3 — Mahalle bağlamı**
Kaynak: tablejourney.com "Yeditepe ve Güneykent" sayfası — Yeditepe, Gaziantep Üniversitesi çevresinde kafeler ve çalışma mekânları olan bir semt.
Yorum: Öğrenci ve genç çalışan nüfus muhtemel [VARSAYIM]; mobil-öncelikli, hızlı, WhatsApp ile randevu uyumlu.

**Bulgu 4 — Puan/yorum hacmi**
Kaynak: Haritalar kartı — 140 değerlendirmenin hepsi ortalamada 5,0.
Yorum: Bu, yeni kurulan bir dükkân için çok güçlü bir sosyal kanıt; sitenin ana kanıt halkası bu olacak (tarih ve bağlantıyla, uydurma alıntı olmadan).

**Bulgu 5 — Arama niyeti**
Kaynak: kullanıcının kendi Haritalar araması "antep berber" (URL'deki sorgu parametresi).
Yorum: İnsanlar "antep berber", "gaziantep erkek kuaför", "şahinbey berber", "yeditepe berber" gibi yer + kategori aramalarıyla geliyor. Bu aramalar büyük oranda Haritalar'da çözülür; site Haritalar profiline "web sitesi" olarak eklendiğinde güveni artırır ve yerel SEO sinyali olur.

**Bulgu 6 — Güncel eğilimler**
Kaynak: Fresha'nın Türkiye berber listeleri (fresha.com) — İstanbul'daki erkek kuaförleri online randevu, hizmet menüsü ve fotoğraf galerisiyle listeleniyor.
Yorum: Hizmet menüsü + randevu + görsel portföy berber sitelerinin beklenen standardı. Online ödeme/rezervasyon sistemi gerekmez; WhatsApp randevusu yerel ölçekte yeterli.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Düzenli tıraş olan genç erkek (öğrenci / çalışan, 18–35) [VARSAYIM]
| Alan | İçerik |
|---|---|
| Tetikleyici | Saçın uzaması, hafta sonu planı, iş görüşmesi, fotoğraf |
| İhtiyaç | İstediği modeli (fade, skin fade vb.) doğru uygulayan usta |
| Problem | Her berber istediği modeli anlamıyor; sırada beklemek |
| Karar mekanizması | Kendisi; arkadaş tavsiyesi ve Haritalar puanı |
| Karar kriteri | Puan/yorum, yakınlık, çalışma saati, fiyat |
| İçsel risk | "Saçımı mahvederler" |
| Dışsal / sosyal risk | Kötü kesimle okulda/işte görünmek |
| Arzu | Temiz, keskin, "yeni çıkmış" görünüm |
| İtiraz | "Pahalı mıdır, sıra var mıdır?" |
| Müşteri dili | "abi yanları sıfır, üstü makas", "sakalı alalım", "fade", "akşam gelsem müsait mi" |
| Güven ihtiyacı | Gerçek puan, işin fotoğrafı, net adres |
| Beklenen sonuç | Beklemeden, istediği modelle çıkmak |
| Daha derin problem | Kendini bakımlı ve özgüvenli hissetmek |

### Segment B — Damat / özel gün
Tetikleyici: düğün, nişan · İhtiyaç: saç-sakal-cilt bakımı paketi, saat garantisi · Karar: damat + çevresi · İtiraz: "o gün sıra olur mu?" · Mesaj: önceden tarih ayırtın.

### Segment C — Baba + çocuk / mahalle sakini
Tetikleyici: rutin · İhtiyaç: yakın, temiz, güvenilir · Karar kriteri: yakınlık, ilgi · Mesaj: mahallenizde, akşam 21:00'e kadar.

## 06 — MARKET & COMPETITOR INTELLIGENCE
(Puanlama yok.)

| Tür | Rakip | Konumlanma | Mesaj | Güven unsuru | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Yeditepe / Şahinbey'deki diğer erkek kuaförleri (Haritalar'da "antep berber") | Mahalle berberi | Ad + telefon | Haritalar puanı | Mahalle | Çoğunun web sitesi yok → site + 5,0 puan ayrıştırır |
| DOĞRUDAN | Gaziantep'teki "barber/barbershop" konseptli premium erkek salonları | Deneyim, tasarım | Instagram işleri | Fotoğraf portföyü | Genç, stil odaklı | Barber's Town aynı premium cepheye sahip; portföy eksik |
| DOLAYLI | AVM içi zincir kuaförler | Kolaylık | Kampanya | Marka | Alışverişe gelen | Mahalleye yakınlık, akşam saati |
| ALTERNATİF | Evde makine ile kendi kesimi / ev hizmeti veren berber | Ucuz/kolay | — | — | Fiyat duyarlı | "Profesyonel sonuç" ve bakım hizmetleri |

Not: Haritalar konteynerden taranamadığı için rakip adları listelenmedi (uydurulmadı).

## 07 — MESSAGE ENGINE

**Ana mesaj:** "Yeditepe'de, kırmızı halıyla karşılanan erkek kuaförü — Google'da 140 yorumda 5,0 puan."

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A | İstediği model uygulanmıyor, sıra bekleniyor | "Saçım kötü olur" | Keskin, temiz görünüm | WhatsApp'tan saat ayarla, modelini fotoğrafla gönder | Google 5,0 ★ / 140 değerlendirme (tarihli, bağlantılı) | WhatsApp'tan randevu |
| B | Özel günde yetişememe | "O gün sıra olur mu?" | Fotoğraflarda kusursuz görünmek | Damat tıraşı için önceden tarih ayırtma | Aynı puan; hizmet detayı BİLİNMİYOR | "Tarih ayırt" WhatsApp mesajı |
| C | Uygun saatte yakın berber | "Açık mı?" | Kolaylık | Mahallede, akşam 21:00'e kadar | Adres + yol tarifi | Yol tarifi / ara |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Beklemek, istenen modelin tutturulamaması |
| Çözüm | Randevulu erkek kuaförü: saç, sakal, bakım |
| Fayda | Gelince beklemeden koltuğa oturmak; modeli önceden konuşmak |
| Süreç | 1) WhatsApp'tan hizmet + gün/saat seç → 2) Dükkân saati teyit eder → 3) Gel, kırmızı halıdan geç |
| Kanıt | Google 5,0 ★ · 140 değerlendirme (15.10.2026) — gerçek, doğrulanmış |
| Risk azaltma | Randevu ücretsiz, ön ödeme yok, model fotoğrafını önceden gönderme imkânı (WhatsApp'ın doğası gereği gerçek). Garanti / indirim YOK (firma sunduğu bilinmiyor) |
| CTA | "WhatsApp'tan Randevu Al" · "Hemen Ara" |

## 09 — CONVERSION ENGINE

Yolculuk: **Dikkat** (Haritalar / paylaşılan link, koyu-ışıklı hero) → **Anlama** (Erkek kuaförü, Yeditepe, akşam 21:00'e kadar) → **İlgi** (hizmet menüsü) → **Güven** (5,0 ★/140, gerçek adres, harita) → **Risk azaltma** (ücretsiz randevu, model fotoğrafı gönder) → **Aksiyon** (WhatsApp).

CTA hiyerarşisi:
- Birincil: **WhatsApp'tan randevu** (hazır mesajlı `wa.me/905357294333`)
- İkincil: **Ara** (`tel:+905357294333`)
- Üçüncül: **Yol tarifi** (Google Haritalar) + randevu formu (bilgiyi WhatsApp mesajına dönüştürür)

Next step: Hero → WhatsApp/ara · Hizmetler → hizmete özel WhatsApp mesajı · Puan bölümü → Haritalar yorumları · Konum → yol tarifi · Mobilde sabit alt bar (WhatsApp + Ara).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (Segment A)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta (Google puanı) dayanıyor
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
