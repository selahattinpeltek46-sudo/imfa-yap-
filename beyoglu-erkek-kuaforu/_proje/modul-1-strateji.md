# 🟢 MODÜL 1 — STRATEJİ, ARAŞTIRMA VE TEKLİF MİMARİSİ (01–09)

Proje: **Beyoğlu Erkek Kuaförü** · Klasör: `beyoglu-erkek-kuaforu/` · Tarih: 2026-10-15
Girdi: kullanıcının daha önce hazırladığı tek dosyalık taslak (`_proje/kaynak/eski-taslak.html`, 748 KB, 12 gömülü JPEG) + "Selahattin AI ile yeniden kur" talebi. Taslağın içindeki 5 numaralı görsel bir **Google Haritalar işletme kartı ekran görüntüsü** → birincil DOĞRULANMIŞ kaynak (SYSTEM LEARNING).

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Beyoğlu Erkek Kuaförü | DOĞRULANMIŞ (Haritalar kartı) |
| Sektör | Berber; Haritalar kategorisi "İstanbul'da bir berber" | DOĞRULANMIŞ |
| Adres | Kamer Hatun, Balık Sk. No:4, 34435 Beyoğlu/İstanbul | DOĞRULANMIŞ (Haritalar kartı) |
| Konum bağlamı | Kart haritasında pin, Tarlabaşı Bulvarı'nın hemen güneyinde | DOĞRULANMIŞ (harita küçük resmi) |
| Telefon | 0535 508 97 22 | DOĞRULANMIŞ |
| WhatsApp | Aynı numara (mobil hat) | [VARSAYIM] — teyit gerek |
| Çalışma saati | Haritalar: "24 saat açık" | DOĞRULANMIŞ (Google kaydı) — ama berber için olağan dışı → muhtemelen hatalı girilmiş; sitede kullanılmaz |
| Google puanı | 4,9 ★ · 1.957 yorum | DOĞRULANMIŞ (ekran görüntüsü tarihi BİLİNMİYOR; 2026 taslağında) |
| Web sitesi | Kartta görünmüyor | BİLİNMİYOR |
| Instagram | Taslakta "eklenecek" | BİLİNMİYOR |
| Usta | "Davut Abi", "30 yıldır makas tutuyor" | KULLANICI BİLGİSİ (taslak metni) — işletme teyidi yok |
| Hizmetler (taslak) | Saç kesimi, sakal tıraşı, saç + sakal, çocuk kesimi, cilt bakımı, saç boyama | KULLANICI BİLGİSİ; fotoğraflarla kısmen doğrulandı (bkz. 02) |
| Fiyatlar (taslak) | 250 / 150 / 350 / 200 / 300 / 400 ₺ — taslakta "örnek olup güncel liste ile değiştirilecektir" | [VARSAYIM] → **kullanılmaz** |
| Ticari amaç | Randevu / ziyaret, yoldan geçen ve turiste güven | [VARSAYIM] |
| Görseller | 11 fotoğraf + 1 Haritalar kartı; 430–760 px; çoğu Google Haritalar'daki müşteri fotoğrafı (ekran görüntüsü, birinde "‹" kaydırma oku) | DOĞRULANMIŞ / kullanım hakkı BİLİNMİYOR |

Repo incelemesi: firmaya ait klasör yoktu; `beyoglu-erkek-kuaforu/` açıldı. Emsaller: `barber-ugur/` (randevu + hatırlatma şablonu, en güncel), `barbers-town/`.

**Fotoğraf gözlemi (12 kare):**
| # | İçerik | Kişi | Not |
|---|---|---|---|
| 0 | Beyaz gömlekli berber, köpüklü müşteriye ustura öncesi köpük | Müşteri yüzü tanınır | Altın barok ayna, havlu rafı |
| 1 | Müşteri selfie'si, yüzünde köpük | Müşteri yüzü | Oval ahşap ayna, yeşil dolap |
| 2 | Salon geneli: berber koltuğu, müşteri arkadan, berber çalışıyor | Müşteri arkadan; berber küçük | **Kişisiz sayılabilecek tek geniş kare** |
| 3 | 3 kişi poz | Yüzler | Altın kartonpiyer, yağlı boya tablo, yeşil kapı |
| 4 | Haritalar kartı ekran görüntüsü | — | Taslakta galeride "Kesim sonrası" diye kullanılmış (hata) |
| 5 | Berber + müşteri, ayna | Yüzler | Tuğla duvar, lambalar |
| 6 | Ayna selfie'si, kırmızı önlük | Yüzler | Avize, tavan göbeği, altın kartonpiyer |
| 7 | 4 kişi poz | Yüzler | — |
| 8, 9 | Müşteri selfie'leri | Yüzler | Duvar saati, tuğla |
| 10 | Ayna selfie'si | Yüzler (üst yarı) | Alt yarı: lavabo, **tıraş fırçası**, köpük kâsesi |
| 11 | Fade kesim, arkadan | Müşteri arkadan | İşçilik kanıtı |

→ **Marka dili (fotoğraflardan):** dokulu adaçayı-yeşili duvar · koyu yeşil boyalı ahşap ayna çerçeveleri ve dolaplar · altın kartonpiyer ve barok ayna · kristal avize + tavan göbeği · ahşap çekmeceli tezgâh, ahşap zemin · eski usul berber koltukları. Taslağın yeşil-altın paleti bu malzemelerden geliyor → korunur, "siyah+altın lüks" klişesine kaymaz.

## 02 — CONTEXT ENGINE (Master Context)

| # | Bilgi | Sınıf |
|---|---|---|
| 1 | Ad, adres, telefon, kategori | DOĞRULANMIŞ (Haritalar kartı) |
| 2 | Google 4,9 ★ / 1.957 yorum | DOĞRULANMIŞ (tarihsiz ekran görüntüsü → sitede "Google Haritalar'da" + bağlantı, rakam yuvarlanmadan) |
| 3 | "24 saat açık" | DOĞRULANMIŞ Google kaydı, **içerik olarak şüpheli** → sitede saat yazılmaz |
| 4 | Ustura ile köpüklü tıraş | DOĞRULANMIŞ (foto 0, 1, 8, 10: köpük, fırça, kâse) |
| 5 | Saç kesimi, fade | DOĞRULANMIŞ (foto 11) |
| 6 | Yüz maskesi / cilt bakımı | Foto 10'da beyaz maske benzeri krem → kısmen DOĞRULANMIŞ |
| 7 | Saç boyama, çocuk kesimi | KULLANICI BİLGİSİ (taslak); fotoğrafta yok |
| 8 | Salon: yeşil duvar, altın kartonpiyer, avize, barok ayna, tuğla bölüm | DOĞRULANMIŞ |
| 9 | En az 2–3 çalışan (farklı fotoğraflarda farklı berberler: beyaz gömlekli, siyah gömlekli) | DOĞRULANMIŞ (fotoğraflar) → randevuda 2 koltuk [VARSAYIM] |
| 10 | "Davut Abi" ve "30 yıl" | KULLANICI BİLGİSİ — "30 yıl" kanıtsız iddia kuralı gereği sitede kullanılmaz; ad, teyit notuyla kullanılır |
| 11 | Konum Beyoğlu, Tarlabaşı Blv.'ye yakın; turistik bölge | ARAŞTIRMA BULGUSU |
| 12 | Fiyatlar | BİLİNMİYOR (taslaktakiler örnek) |
| 13 | Fotoğrafların yükleyeni / kullanım hakkı | BİLİNMİYOR |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| YÜKSEK | Gerçek fiyat listesi | Taslaktaki fiyatlar 2026 İstanbul düzeyinin yarısı (bkz. 04) → yanlış beklenti, kapıda tartışma | 08, 12 | Fiyat yazılmaz; "WhatsApp'tan sorun" |
| YÜKSEK | Fotoğraf kullanım hakkı / müşteri rızası | KVKK + Google Haritalar fotoğrafları yükleyenin malı | 14 | Yalnız yüz görünmeyen 3 kare kırpılarak, "Google Haritalar'daki fotoğraflardan" notuyla; SHOT LIST |
| YÜKSEK | Gerçek çalışma saatleri | "24 saat açık" büyük ihtimalle hatalı; gece gelen müşteri kapıyı kapalı bulursa yorum riski | 11, 12, 16 | Sitede saat yok, "gelmeden arayın"; randevu sisteminde 10:00–21:00, her gün [VARSAYIM] |
| YÜKSEK | WhatsApp'ın bu numarada aktif olması | Birincil/yedek CTA | 09, 16 | Aktif [VARSAYIM]; telefon her yerde yanında |
| ORTA | "Davut Abi" kim, fotoğrafı hangisi; "30 yıl" doğru mu | Kişi tanıtımı güçlü güven unsuru | 12 | Ad kullanılır, yıl ve fotoğraf eşleştirmesi yapılmaz |
| ORTA | Koltuk sayısı, hizmet süreleri | Randevu kapasitesi | 16 | 2 koltuk; 30/30/50/25/30/60 dk [VARSAYIM] |
| ORTA | Instagram | Portföy | 13 | Yok; eklenince alt bilgiye |
| ORTA | Yabancı dil (İngilizce) konuşan çalışan | Turist segmenti | 12 | Kısa İngilizce bölüm; "İngilizce konuşuruz" iddiası yok |
| DÜŞÜK | Logo | Marka | 14 | Tipografik logo (temsili) |
| DÜŞÜK | İzinli yorum alıntıları | Sosyal kanıt | 07 | Alıntı yok; puan + Haritalar bağlantısı |

KRİTİK eksik yok: adres, telefon, puan doğrulanmış; site yayına uygun sürümle teslim edilebilir.

## 04 — DEEP RESEARCH

**Bulgu 1 — İşletmenin çevrimiçi izi**
Kaynak: "Beyoğlu Erkek Kuaförü" Balık Sokak Kamer Hatun web araması (2026-10-15) — işletmeye ait sonuç yok; Kamer Hatun Caddesi yalnız SALT Araştırma arşivinde tarihi yapı fotoğraflarıyla geçiyor.
Yorum: Tek dijital varlık Haritalar profili ve onun 1.957 yorumu. Site, Haritalar profiline "web sitesi" olarak eklendiğinde vitrin + randevu kapısı olur.

**Bulgu 2 — 2026 İstanbul fiyat düzeyi**
Kaynak: habergazetesi.com.tr, "İstanbul Berberler Odası 2026 yılı yeni fiyat listesini açıkladı" (odaya atfen: saç 500 ₺, sakal 300 ₺, saç+sakal 800 ₺, çocuk 350 ₺, yüz maskesi 200 ₺); ensonhaber.com "İstanbul'da saç ve sakal kesimi 500 lirayı buldu"; oda başkanı açıklaması: A-B-C üç ayrı tarife.
Yorum: Taslaktaki 250/150/350 ₺ bu düzeyin yaklaşık yarısı. Resmi duyuru doğrulanamadı ve tarife sınıfa göre değişiyor → sitede **rakam yazılmaz**; işletmenin panosundaki liste fotoğrafı gelince eklenir.

**Bulgu 3 — Turist fiyat şikâyetleri**
Kaynak: NTV, Mayıs 2026 — Fatih'te turiste 400 ₺ yerine 7.100 ₺ fatura kesen berber mühürlendi.
Yorum: Beyoğlu'nda yabancı ziyaretçinin en büyük kaygısı "kapıda sürpriz fiyat". Fiyatı **önceden WhatsApp'tan sorma** imkânı ve kısa İngilizce bölüm bu kaygıya cevap; "garanti" iddiası yapılmaz.

**Bulgu 4 — Konum**
Kaynak: Haritalar kartı küçük haritası (Tarlabaşı Blv., Anadolu Mahallesi etiketi), adres (Kamer Hatun Mah., 34435).
Yorum: Taksim–Tarlabaşı arasında, otel ve kısa süreli kiralık daire yoğun bir bölge [VARSAYIM: turist + bölgede çalışan + mahalleli karışık müşteri]. Ara sokakta olduğu için "nasıl bulurum" kritik → yol tarifi butonu, Tarlabaşı Bulvarı'na referans.

**Bulgu 5 — Yorum hacmi**
Kaynak: Haritalar kartı — 1.957 yorumda 4,9.
Yorum: Mahalle berberi için çok yüksek hacim; ana kanıt halkası. `aggregateRating` JSON-LD'ye eklenmez (SYSTEM LEARNING / Google self-serving review kuralı); sitede kaynak bağlantısıyla gösterilir.

**Bulgu 6 — Arama niyeti**
Kaynak: yer + kategori aramaları ("beyoğlu berber", "taksim berber", "tarlabaşı berber", "barber taksim", "barber near me istanbul").
Yorum: Çoğu Haritalar'da çözülür; site Türkçe ana + İngilizce özet ile her iki dili karşılar. "Erkek kuaförü" ve "berber" ikisi de kullanılır.

**Bulgu 7 — Randevu standardı**
Kaynak: `barber-ugur/` ve `barbers-town/` projeleri.
Yorum: Apps Script + Google Takvim şablonu (boş saat, çift rezervasyon kilidi, .ics hatırlatma) hazır → uyarlanır; kurulana kadar form WhatsApp modunda çalışır. Taslaktaki "hiçbir yere gitmeyen form" hatası böylece kapanır.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Beyoğlu'nda yaşayan / çalışan erkek (20–55) [VARSAYIM]
| Alan | İçerik |
|---|---|
| Tetikleyici | Saçın uzaması, hafta sonu, iş görüşmesi, düğün/bayram |
| İhtiyaç | Yakın, bildiği, sohbeti olan berber; beklememek |
| Problem | Akşam ve hafta sonu sıra; dükkânın dolu olup olmadığını bilmemek |
| Karar mekanizması | Kendisi; alışkanlık, Haritalar puanı, arkadaş tavsiyesi |
| Karar kriteri | Usta, yakınlık, puan, fiyat |
| İçsel risk | "İstediğim gibi olmaz", "boşuna gidip beklerim" |
| Dışsal / sosyal risk | Kötü kesimle işte/çevrede görünmek |
| Arzu | Temiz kesim, ustura tıraşı sonrası "elden geçmiş" his |
| İtiraz | "Sıra var mı?", "Fiyat ne kadar?" |
| Müşteri dili | "abi yanları sıfır, üstü makas", "sakalı ustura ile alalım", "akşam müsait misin", "Davut abi var mı bugün" |
| Güven ihtiyacı | Gerçek puan, tanıdık usta, açık adres |
| Beklenen sonuç | Gelince koltuğun hazır olması |
| Daha derin problem | Zamanını boşa harcamamak; kendini bakımlı ve "mahallenin adamı" hissetmek |

### Segment B — Turist / kısa süreli ziyaretçi (otel, Airbnb) [VARSAYIM, Bulgu 3–4]
Tetikleyici: tatilde "İstanbul'da klasik Türk berberi" deneyimi · İhtiyaç: anlaşılır fiyat, kolay adres · Kaygı: kapıda sürpriz fiyat, dil · Karar: Haritalar puanı + fotoğraflar · Mesaj: "Fiyatı önceden WhatsApp'tan sorun; yol tarifi tek tıkla."

### Segment C — Özel gün (düğün, nişan, bayram öncesi)
Tetikleyici: tarih yaklaşınca · İhtiyaç: kesin saat · İtiraz: "o gün yer bulamam" · Mesaj: "Günü önceden ayırtın."

## 06 — MARKET & COMPETITOR INTELLIGENCE
(Puanlama yok.)

| Tür | Rakip | Konumlanma | Mesaj | Güven unsuru | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Taksim–Tarlabaşı–Cihangir'deki mahalle berberleri | Yakınlık, alışkanlık | Ad + telefon | Haritalar puanı | Mahalle | Çoğunun sitesi ve online randevusu yok |
| DOĞRUDAN | İstiklal/Galata çevresindeki turist odaklı "Turkish barber" dükkânları | Deneyim (ateşle tüy alma, masaj) | Paket, İngilizce | Instagram, TripAdvisor | Turist | Şeffaf fiyat iletişimi; 1.957 yorumluk yerel güven |
| DOĞRUDAN | "Barbershop" konseptli yeni nesil salonlar | Tasarım, fade | Instagram işleri | Portföy | Genç | Burada da fade var (foto 11) → SHOT LIST ile portföy |
| DOLAYLI | AVM / zincir kuaförler | Kolaylık | Kampanya | Marka | Alışverişe gelen | Usta ilişkisi, salon atmosferi |
| ALTERNATİF | Evde kesim / eve gelen berber | Ucuz, kolay | — | — | Fiyat duyarlı | Ustura tıraşı ve salon deneyimi evde olmaz |

Not: Haritalar konteynerden taranamadığı için rakip adları listelenmedi (uydurulmadı).

## 07 — MESSAGE ENGINE

**Ana mesaj:** "Tarlabaşı'nın arkasında, yeşil duvarlı, avizeli mahalle berberi — saatini seç, gelince bekleme."

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A | Sıra, belirsizlik | "Boşuna giderim" | Gelince koltuğa oturmak | Online boş saat / WhatsApp | Google 4,9 ★ · 1.957 yorum (bağlantılı) | Randevu al |
| B | Dil, sürpriz fiyat, ara sokak | "Kazıklanırım" | Klasik İstanbul berberi deneyimi | İngilizce özet, fiyatı önceden sor, yol tarifi | Aynı puan; gerçek salon fotoğrafı | WhatsApp / Directions |
| C | Özel günde yer yok | "O gün dolu" | Kesin saat | 3 hafta ileriye randevu | Aynı puan | Randevu al |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Sırada beklemek, açık mı/dolu mu bilmemek, fiyatı bilmemek |
| Çözüm | Saatli randevu: saç kesimi, sakal tıraşı (ustura), saç + sakal, çocuk kesimi, cilt bakımı, saç boyama |
| Fayda | Gelince beklemeden koltuğa oturmak; modeli önceden not etmek; fiyatı önceden öğrenmek |
| Süreç | 1) Hizmet + gün → 2) Boş saat → 3) Ad + telefon → randevu kodu (sistem kurulana kadar: WhatsApp mesajı → salon teyit eder) |
| Kanıt | Google Haritalar 4,9 ★ · 1.957 yorum — DOĞRULANMIŞ |
| Risk azaltma | Randevu ücretsiz, ön ödeme yok, kodla iptal; fiyatı önceden sorma. Garanti/indirim YOK (sunulduğu bilinmiyor) |
| CTA | "Randevu al" · "WhatsApp" · "Ara" · "Yol tarifi" |

## 09 — CONVERSION ENGINE

Yolculuk: **Dikkat** (Haritalar / paylaşılan link; yeşil duvar + altın çıta + salon fotoğrafı) → **Anlama** (Beyoğlu'nda berber, Balık Sk. No:4) → **İlgi** (hizmetler, ustura) → **Güven** (4,9/1.957, gerçek salon, usta adı) → **Risk azaltma** (ücretsiz randevu, fiyatı önceden sor) → **Aksiyon** (randevu / WhatsApp).

CTA hiyerarşisi:
- Birincil: **Randevu al** (sayfa içi form; API yoksa WhatsApp mesajı üretir)
- İkincil: **WhatsApp** (`wa.me/905355089722`, hazır mesaj) ve **Ara** (`tel:+905355089722`)
- Üçüncül: **Yol tarifi** (Google Haritalar, adres sorgusu) · Google yorumları

Next step: Açılış → randevu · Hizmet satırı → hizmeti seçili randevu · Fiyat notu → WhatsApp fiyat mesajı · Randevu → kod ekranı + takvime ekle · Adres → yol tarifi · İngilizce bölüm → WhatsApp (İngilizce hazır mesaj) · Mobilde sabit alt bar (Randevu · WhatsApp · Ara).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (Segment A)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta (Google puanı, salon fotoğrafları) dayanıyor
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
