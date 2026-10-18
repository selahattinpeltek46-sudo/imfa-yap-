# Dijital Otorite — MODÜL 1: Strateji, Araştırma, Teklif (01–09)

SELAHATTİN AI v2.1 · 2026-10-18 · Site klasörü: `dijital-otorite/` (yayın: GitHub Pages `…/imfa-yap-/dijital-otorite/`)

---

## 01 — PROJECT INTAKE

| Alan | Bilgi | Sınıf |
|---|---|---|
| Ad | Dijital Otorite (Instagram: @dijital.otorite) | DOĞRULANMIŞ (profil ekran görüntüsü) |
| Sahibi | Selahattin Peltek | KULLANICI BİLGİSİ |
| Sektör | Dijital pazarlama / web tasarım / sosyal medya (yerel ajans) | DOĞRULANMIŞ (IG bio: "Büyüme Mimarisi · Dijital pazarlama · Şirket Doktoru") |
| Hizmet bölgesi | Göksun merkezli; Kahramanmaraş ve Gaziantep'te işler var | DOĞRULANMIŞ (repo: Göksun, Kahramanmaraş, Gaziantep müşteri siteleri) |
| Web sitesi | Yok (bu proje) | DOĞRULANMIŞ |
| Sosyal medya | Instagram: 11 gönderi, 8 takipçi (Ekim 2026) | DOĞRULANMIŞ |
| Google Business | Bilinmiyor | BİLİNMİYOR |
| Hizmetler | Web sitesi, Google Haritalar/işletme profili, sosyal medya yönetimi ve içerik, reklam; randevu/sipariş sistemleri | DOĞRULANMIŞ (IG gönderileri + repodaki teslim edilmiş siteler: WhatsApp sipariş, Apps Script randevu) |
| Ticari amaç | Yerel KOBİ/esnaftan düzenli web + sosyal medya müşterisi kazanmak | KULLANICI BİLGİSİ |
| Hedef kitle | Göksun ve Kahramanmaraş esnafı, 35–60 yaş işletme sahipleri | KULLANICI BİLGİSİ + `MARKA.md` |
| Telefon / WhatsApp | 0539 300 95 65 (IG gönderilerinde görünüyor) | DOĞRULANMIŞ ama site için KULLANICI ONAYI BEKLİYOR |
| E-posta | selahattinpeltek46@gmail.com [VARSAYIM: iş e-postası olarak kullanılabilir] | VARSAYIM |
| Adres | Göksun (açık adres yok) | BİLİNMİYOR |

**Repodaki kanıtlar (portföy):**
| Müşteri | Yer | Teslim edilen | Yayın |
|---|---|---|---|
| İMFA Yapı | Kahramanmaraş | Kurumsal inşaat sitesi | GitHub Pages kökü (DOĞRULANMIŞ dosya) |
| Söyleroğlu Hafriyat | Göksun | 12 hizmet sayfalı kurumsal site, B2B, bilgi merkezi | soylerogluhafriyat.com (CNAME; kullanıcı yayında dedi) |
| Üçel Tarım Aletleri | Göksun | Ürün kataloğu sitesi | GitHub Pages |
| Barber Uğur | Gaziantep | Site + online randevu + hatırlatma | GitHub Pages |
| Barber's Town | Gaziantep | Site + online randevu (Google Takvim) | GitHub Pages |
| Göksun Yörem | Göksun | Katalog + WhatsApp sipariş sepeti | **YAYINDA DEĞİL** → referans gösterilmez |

## 02 — CONTEXT ENGINE (Master Context)

| Bilgi | Sınıf |
|---|---|
| Hesap yeni; hikâye/mizah içerikleri 134–198, ilan tarzı gönderiler 10–23 izlenme aldı | DOĞRULANMIŞ |
| Konumlandırma: "Göksun esnafının dijital doktoru", çağrı kelimesi "RÖNTGEN" | KULLANICI BİLGİSİ (MARKA.md'de onaylı) |
| Marka renkleri lacivert + altın; maskot Dükkân Amca (karakter kartı mevcut) | KULLANICI BİLGİSİ |
| Selahattin kameraya ilk etapta çıkmıyor, ses var | KULLANICI BİLGİSİ |
| 5 yayındaki müşteri sitesi gerçek iş kanıtı | DOĞRULANMIŞ (repo) |
| "Yıllardır bu sektördeyim" — süre belirsiz | BİLİNMİYOR → sitede yıl yazılmaz |
| Müşteri yorumu / referans sözü yok | BİLİNMİYOR → uydurulmaz |
| Fiyatlar | BİLİNMİYOR |
| Logo dosyası | BİLİNMİYOR (IG profil görseli var, dosya yok) |
| Röntgen formu → otomasyon (n8n + Claude) Aşama 5'te kurulacak | KULLANICI BİLGİSİ |

## 03 — INFORMATION GAP

| Öncelik | Eksik | Neden önemli | Etkilediği aşama | Şu anki varsayım |
|---|---|---|---|---|
| KRİTİK | Sitede kullanılacak WhatsApp numarası onayı | Birincil CTA | 09, 12, 16 | 0539 300 95 65 [VARSAYIM] |
| YÜKSEK | Paket fiyatları / fiyat gösterilsin mi | Teklif ve güven | 08, 12 | Fiyat yok; "paketler + teklif al" [VARSAYIM] |
| YÜKSEK | Müşteri izinleri (portföyde isim ve link) | Sahte kanıt riski | 08, 12 | Kullanıcı önce/sonra için izin verdi → portföy için de geçerli [VARSAYIM] |
| ORTA | Logo dosyası | Marka tutarlılığı | 14, 16 | Yazı logosu (wordmark) |
| ORTA | Alan adı | SEO, güven | 13, 16 | GitHub Pages alt klasörü |
| ORTA | Selahattin'in deneyim süresi, eğitim | Hakkımda bölümü | 12 | Süre yazılmaz |
| DÜŞÜK | Açık adres / Google Business profili | Yerel SEO | 13 | "Göksun / Kahramanmaraş" |

## 04 — DEEP RESEARCH

**Yerel pazar**
- Kaynak: Wikipedia "Göksun" (2022 TÜİK): ilçe nüfusu 50.676. Kahramanmaraş Ü. belgesi (TÜİK 2017): 51.615.
- Yorum: Küçük, birbirini tanıyan bir pazar. Tavsiye ve görünür yerel kanıt (tanıdık işletme isimleri) reklamdan daha güçlü.

**Dijitalleşme açığı**
- Kaynak: TÜİK Girişimlerde Bilişim Teknolojileri Kullanım Araştırması 2025 (alomaliye.com, dunya.com aktarımı): 10+ çalışanlı girişimlerde web sitesi sahipliği %56,5 (10–49 çalışan: %52,4); sosyal medya kullanımı %55,2; yapay zekâ kullanımı %7,5.
- Yorum: Ölçülen en küçük grupta bile her iki işletmeden biri web sitesiz. Göksun esnafının büyük kısmı 1–9 çalışanlı ve bu araştırmaya bile girmiyor → açık daha büyük [VARSAYIM]. Bu bilgi sitede kaynakla verilebilir.

**Rakip/arama**
- Kaynak: Web araması "Kahramanmaraş dijital ajans" — Kahramanmaraş merkezli belirgin ajans sonucu çıkmadı; dizinlerde (firmasec.com) diğer illerden ajanslar ve Gaziantep'ten (Nane Dijital) ajans listeleniyor.
- Yorum: Göksun'a özgü dijital ajans görünmüyor. "Göksun web sitesi / Göksun sosyal medya" aramalarında rekabet çok düşük olabilir [ARAŞTIRMA BULGUSU, Google'da doğrulanmadı — konteynerden Google açılmıyor].

**Güven unsurları (sektör)**
- Yorum: Esnaf ajansa "parayı alıp kaybolur mu, bana uygun mu, işe yarar mı" sorularıyla bakar. En güçlü kanıt: tanıdığı bir işletmenin sitesini telefonda açıp görmek.

**Dönüşüm fırsatı**
- Yorum: Ücretsiz "Dijital Röntgen" düşük riskli giriş kapısı; WhatsApp yerel iletişimin varsayılan kanalı.

## 05 — CUSTOMER INTELLIGENCE

### Segment A — Göksun esnafı (dükkân sahibi; kasap, bakkal, berber, usta, kafe)
| Alan | İçerik |
|---|---|
| Tetikleyici | Karşı dükkânın Instagram'da/Google'da görünmesi; azalan müşteri; çocuğunun "internete koy" demesi |
| İhtiyaç | Telefonda bulunmak; ürün/fiyatı göstermek; WhatsApp'tan sipariş almak |
| Problem | Zaman yok, teknik bilgi yok, "kime yaptıracağım" bilinmiyor |
| Karar mekanizması | Dükkân sahibi tek başına; bazen genç aile üyesi etkiler |
| Karar kriteri | Fiyat, tanıdık güveni, örnek iş görmek, hızlı teslim |
| İçsel risk | "Para harcarım, işe yaramaz"; "Ben bu işlerden anlamam, rezil olurum" |
| Dışsal/sosyal risk | "Esnaf ne der, gösteriş yapıyor"; kötü bir site çevreye ayıp olur |
| Arzu | Dükkânın dolu olması, "büyük şehirdeki gibi" görünmek |
| İtiraz | "Benim müşterim beni zaten tanır", "Pahalıdır", "Bana gerek yok" |
| Müşteri dili | "Bize internet lazım mı?", "Bir sayfa yapsan ne kadar?", "Instagram'ı sen yönet" |
| Güven ihtiyacı | Tanıdık işletme örneği, yüz yüze görüşme, net fiyat, Göksun'dan biri olmak |
| Beklenen sonuç | Telefonla gelen müşteri, WhatsApp siparişi |
| Daha derin problem | Kontrolü kaybetme ve geride kalma korkusu |

### Segment B — Saha/hizmet işletmesi (hafriyat, tarım aletleri, inşaat, oto)
| Alan | İçerik |
|---|---|
| Tetikleyici | Büyük iş/ihale, kurumsal müşterinin "siteniz var mı" sorusu |
| İhtiyaç | Kurumsal görünüm, hizmet ve makine listesi, teklif formu |
| Problem | İş sahada iyi ama ekranda görünmüyor |
| Karar mekanizması | Patron + bazen ortak |
| Karar kriteri | Kurumsallık, ciddiyet, referans |
| İçsel risk | Zaman kaybı |
| Dışsal risk | Rakibe göre geride görünmek |
| Arzu | "Büyük firma" algısı |
| İtiraz | "İşimiz tavsiyeyle geliyor" |
| Müşteri dili | "Teklif gönderebileceğimiz bir şey lazım" |
| Güven ihtiyacı | Söyleroğlu/İMFA gibi kurumsal örnek |
| Beklenen sonuç | Teklif talebi, kurumsal itibar |
| Daha derin problem | İtibarın sadece kişisel ilişkilere bağlı olması |

### Segment C — Randevulu hizmet (berber, kuaför, güzellik) — Gaziantep örnekleri
Tetikleyici: telefonla randevu karmaşası · İhtiyaç: online randevu · Kanıt: Barber Uğur, Barber's Town (çalışan randevu sistemi).

## 06 — MARKET & COMPETITOR INTELLIGENCE (puanlama yok)

| Tür | Rakip | Konumlanma | Mesaj | Güven unsuru | Segment | Açık fırsat |
|---|---|---|---|---|---|---|
| DOĞRUDAN | Kahramanmaraş/Gaziantep ajansları (ör. dizinde Nane Dijital – Gaziantep) | Bölgesel ajans | "Sosyal medya yönetimi, reklam" | Kurumsal portföy | Orta/büyük firma | Göksun esnafına özel, yüz yüze, küçük bütçe |
| DOLAYLI | İstanbul/online freelancer, hazır site paketleri (Wix, ikas vb.) | Ucuz/hızlı | "Kendi siten 1 günde" | Marka gücü | Kendin-yap | Esnaf kendi yapamaz → "biz yaparız, biz yönetiriz" |
| ALTERNATİF | Esnafın yeğeni/çocuğu, "Instagram'ı kendim açarım" | Bedava | — | Aile güveni | Mikro esnaf | Süreklilik ve sonuç: Amca serisi tam bunu anlatıyor |

## 07 — MESSAGE ENGINE

**Ana mesaj:** "Müşterin seni önce telefonda arıyor. Orada olalım." / alt: "Göksun esnafının dijital doktoru: teşhis, reçete, tedavi."

| Segment | Problem | Kaygı | Arzu | Çözüm | Kanıt | Aksiyon |
|---|---|---|---|---|---|---|
| A Esnaf | Müşteri telefonda bulamıyor | "Para harcarım boşa gider" | Dolu dükkân | Ücretsiz röntgen → küçük, net reçete → site + Google + Instagram | Göksun'dan Söyleroğlu, Üçel sitesi (link) | "RÖNTGEN" WhatsApp |
| B Saha | İş sahada, ekranda yok | Ciddiyetsiz görünmek | Kurumsal itibar | Hizmet sayfalı kurumsal site + teklif butonu | Söyleroğlu (12 hizmet sayfası), İMFA Yapı | Teklif iste |
| C Randevu | Telefon trafiği | Kaçan randevu | Düzen | Online randevu + hatırlatma | Barber Uğur, Barber's Town | Demo iste |

## 08 — OFFER ENGINE

| Halka | İçerik |
|---|---|
| Problem | Dijitalde görünmeyen işletme müşteriyi rakibe kaptırıyor |
| Çözüm | 3 adım: **Röntgen** (ücretsiz inceleme) → **Reçete** (3 maddelik yapılacaklar + teklif) → **Tedavi** (site, Google profili, sosyal medya) |
| Fayda | Telefonda bulunmak, WhatsApp'tan sipariş/teklif almak |
| Süreç | Form/WhatsApp → inceleme → yüz yüze görüşme → teslim → aylık kontrol |
| Kanıt | 5 yayındaki gerçek müşteri sitesi (link). Rakamsal sonuç/yorum: BİLİNMİYOR → kullanılmaz |
| Risk azaltma | Ücretsiz Dijital Röntgen (kullanıcının gerçekten sunduğu: IG'de duyuruldu). Garanti yok — uydurulmaz |
| Paketler | Başlangıç (site + Google profili) · Büyüme (+ aylık sosyal medya) · Premium (+ reklam, randevu/sipariş sistemi, otomasyon). Fiyat: BİLİNMİYOR → "Teklif al" |
| CTA | "RÖNTGEN yaz" (WhatsApp) |

## 09 — CONVERSION ENGINE

Yolculuk: **Dikkat** (Instagram Amca/Röntgen içerikleri) → **Anlama** (hero: problem + 3 adım) → **İlgi** (paketler) → **Güven** (gerçek siteler, telefonda açılan önizlemeler, Göksun'dan biri) → **Risk azaltma** (ücretsiz röntgen, yüz yüze) → **Aksiyon** (WhatsApp).

CTA hiyerarşisi:
1. **Birincil:** WhatsApp "RÖNTGEN" (hazır mesajlı `wa.me`)
2. **İkincil:** Dijital Röntgen formu (işletme adı, sektör, Instagram/Google linki) → şimdilik WhatsApp özet mesajına dönüşür; Aşama 5'te n8n webhook'una bağlanır
3. **Üçüncül:** Telefonla ara, Instagram'ı takip et

Sayfa başına next step: Ana sayfa → Röntgen · Referans kartı → canlı siteyi aç → Paket → "Bu paket için teklif" WhatsApp.

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 1
- [x] 01–09 başlıklarının dokuzu da dosyada var
- [x] Her bilgi 5 sınıftan birinde; varsayımlar `[VARSAYIM]` etiketli
- [x] INFORMATION GAP öncelikli ve her eksikliğin varsayımı yazılı
- [x] Araştırmada kaynak ve yorum ayrı
- [x] En az 1 segment için 05'teki 13 alanın hepsi dolu (A ve B)
- [x] Rakipler 3 türe ayrılmış, puanlama yok
- [x] Mesaj ve teklif zincirleri eksiksiz; kanıt halkası gerçek kanıta dayanıyor ya da BİLİNMİYOR diye işaretli
- [x] CTA hiyerarşisi tanımlı
- [x] `durum.md` güncellendi
