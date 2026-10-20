# Osmanoğlu Mobilya — Modül 2: Bilgi Mimarisi, İçerik, SEO, Görsel (10–14)

Dayanak: `modul-1-strateji.md`. Nihai metinlerin tek kaynağı `icerik.py`; 12. bölüm `uret.py --metin` ile oradan üretilir.

## 10 — INFORMATION ARCHITECTURE

4 sayfa. Her biri bir arama niyetine ya da karar adımına karşılık geliyor.

| Sayfa | Amaç | Hedef kullanıcı | Temel soru | Verilen cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` Ana sayfa | Marka + 3 iş alanı + iletişim | Marka / "sincan mobilyacı" arayan, Haritalar'dan gelen | "Kimler, ne yapıyorlar, güvenilir mi?" | Ölçüye yapılan mobilya; gerçek mutfak, yorumlar, adres | Hero'daki gerçek kareler, 4,9/26 (tarihli), 3 yorum, atölye adresi | "sincan mobilya", "sincan mobilyacı", marka | WhatsApp | Hizmet sayfası / mesaj hazırlayıcı |
| `/mutfak-dolabi/` | En güçlü kanıtlı hizmet | Segment A | "Mutfağımı ölçüye yaptırabilir miyim, neye bakmalıyım?" | 3 karelik mutfak, birlikte seçilenler, süreç | Aynı işin 3 karesi, iki yorum | "mutfak dolabı ankara / sincan / eryaman" | WhatsApp (tür ön seçili) | Mesaj hazırlayıcı |
| `/vestiyer-gomme-dolap/` | Antre, gardırop, gömme dolap, TV ünitesi | Segment B | "Küçük antreme / koridoruma dolap yapılır mı?" | Antre karesi + detay, müşteri paylaşımı işler (Haritalar) | Antre karesi, yorumlar | "vestiyer ankara", "gömme dolap ankara", "gardırop sincan" | WhatsApp | Mesaj hazırlayıcı |
| `/karavan-mobilyasi/` | Niş: ahşap karavan | Segment C | "Ahşap karavan yaptırabileceğim bir usta var mı?" | Tek gerçek örnek (yorum), bildiklerimiz, ne getirmeli | Kamil C. yorumu, Haritalar fotoğraf bağlantısı | "karavan mobilyası ankara", "ahşap karavan yaptırma" | WhatsApp ("fikrim var") | Mesaj hazırlayıcı |

**Açılmayan sayfalar ve gerekçesi:** Hakkımızda (kuruluş yılı, ekip BİLİNMİYOR → boş sayfa olurdu), ayrı İletişim (her sayfanın sonunda konum bölümü var; menüde `#iletisim`), Galeri (yalnız 5 gerçek kare → hizmet sayfalarında), TV ünitesi ayrı sayfa (kendi fotoğrafı yok; vestiyer sayfasında), KVKK / Çerez (aşağıda).

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa:** Hero (sol: H1 + giriş + WhatsApp/Ara + puan satırı; sağ: tam boy 3 slaytlı sahne, detay etiketli) → Ne yapıyoruz (3 sıra: mutfak, vestiyer, karavan) → Bir mutfağa yakından bakınca (köşe karesi + 4 kontrol noktası) → Yorumlar (3) → Nasıl başlarız (4 adım) → Mesaj hazırlayıcı → SSS (4) → Konum / iletişim → Alt bilgi.
**Mutfak dolabı:** Hero (2 slayt) → Fotoğraftaki mutfak (3 kare) → Birlikte karar verdiğimiz şeyler (5) → Yorumlar (2) → Nasıl başlarız → Ankara'nın neresindeyiz → Mesaj hazırlayıcı (Mutfak dolabı seçili) → SSS (4) → Konum.
**Vestiyer ve gömme dolap:** Hero (antre, tek kare) → Bu antrede ne var (3) → Müşterilerin Haritalar'da paylaştığı işler (4 madde + bağlantı) → Yorumlar → Nasıl başlarız → Mesaj hazırlayıcı (Vestiyer seçili) → SSS (3) → Konum.
**Karavan:** Hero (temsili çizim, çizgi animasyonu) → Yorum alıntısı (büyük) → Bildiklerimiz + Konuşmaya gelirken → Mesaj hazırlayıcı (Karavan seçili) → SSS (3, ruhsat konusunda söz verilmez) → Konum.

**Hero kararı (kullanıcı isteği):** Tam boy (`100svh − üst çubuk`), animasyonlu: fotoğraflar çekmece gibi soldan açılır (clip-path), yavaş yakınlaşır, detay etiketleri sırayla gelir, ilerleme göstergesi mutfaktaki tutamak kanalı biçiminde. **Fotoğraf üstünde karartma katmanı, gradyan, filtre, bulanıklık yok** — metin fotoğrafın üstüne değil yanındaki düz panele yazılır. Durdur düğmesi (WCAG 2.2.2) ve `prefers-reduced-motion` desteği.

**Internal linking**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Ana sayfa "Ne yapıyoruz" | 3 hizmet sayfası | "Mutfak dolabı sayfası", "Vestiyer ve dolap sayfası", "Karavan sayfası" |
| Ana sayfa detay bölümü | /mutfak-dolabi/ | "Mutfak dolabında birlikte seçtiklerimiz" |
| /mutfak-dolabi/ | /vestiyer-gomme-dolap/ | "Antre, gardırop ve gömme dolap işlerimiz" |
| /vestiyer-gomme-dolap/ | /mutfak-dolabi/ | "Mutfak dolabı işlerimize bakın" |
| /karavan-mobilyasi/ | mutfak + vestiyer | "Asıl işimiz: mutfak dolabı", "Vestiyer ve gömme dolap" |
| Tüm sayfalar | Haritalar | "26 yorumun hepsini Google Haritalar'da okuyun", "Yol tarifi" |

**Yasal:** Form veri toplamıyor (yalnız WhatsApp metni üretir), analytics / pixel yok, site kendi çerezini kullanmıyor, harita tıklayınca yükleniyor → KVKK aydınlatma metni ve çerez banner'ı **gerekmez**. Alt bilgide durum açıkça yazılı. GA4 eklenirse çerez onayı + KVKK metni (şablon, hukuki kontrol gerekir) eklenmeli.

## 12 — COPYWRITING ENGINE

Ton: kısa cümle, somut gözlem, usta ağzı ("konuşalım", "yazın"). Kanıtsız iddia taraması: "en iyi", "kaliteli malzeme", "X yıllık tecrübe", "garanti", "ücretsiz keşif", "zamanında teslim" **firmanın ağzından yok**; bu tür ifadeler yalnız tırnak içinde müşteri yorumu olarak var. Kamil C.'nin "dünyanın en hafif ağacı" ifadesi alıntıda kaldı; kendi metnimizde "hafif bir ağaç" denir.

<!-- METIN:BAS -->
<!-- METIN:SON -->

## 13 — SEO & ANALYTICS ENGINE

| Intent | Keyword | Sayfa | Mesaj | İçerik | Kanıt | CTA |
|---|---|---|---|---|---|---|
| Yerel, ticari | sincan mobilyacı, sincan mobilya imalatı | / | Ölçüye yapılır, yerine oturur | 3 iş alanı, adres | Haritalar puanı, yorumlar | WhatsApp |
| Ticari | mutfak dolabı ankara / sincan / eryaman / etimesgut | /mutfak-dolabi/ | Mutfak duvarın ölçüsüyle başlar | Seçimler, kontrol noktaları | 3 kare | WhatsApp (mutfak) |
| Ticari | vestiyer ankara, gömme dolap ankara, gardırop sincan | /vestiyer-gomme-dolap/ | Kapıdan girince ilk gördüğünüz yer | Antre detayları | Antre karesi | WhatsApp |
| Niş, bilgi + ticari | ahşap karavan yaptırma, karavan mobilyası ankara, ayous karavan | /karavan-mobilyasi/ | Karavanınız da bir mobilya işidir | Bildiklerimiz, getirilecekler | Yorum | WhatsApp |
| Marka | osmanoğlu mobilya | / | — | NAP | Haritalar | Ara |

| Slug | Title (≤60) | Meta (≤155) | H1 |
|---|---|---|---|
| `/` | Osmanoğlu Mobilya \| Sincan, Ankara Özel Ölçü Mobilya (52) | bkz. §12 (152) | Ölçüye yapılır, yerine oturur. |
| `/mutfak-dolabi/` | Mutfak Dolabı Sincan, Ankara \| Osmanoğlu Mobilya (48) | bkz. §12 | Mutfak, duvarın ölçüsüyle başlar. |
| `/vestiyer-gomme-dolap/` | Vestiyer ve Gömme Dolap Ankara \| Osmanoğlu Mobilya (50) | bkz. §12 | Kapıdan girince ilk gördüğünüz yer. |
| `/karavan-mobilyasi/` | Ahşap Karavan ve Karavan Mobilyası \| Osmanoğlu (46) | bkz. §12 | Karavanınız da bir mobilya işidir. |

(H1'in üstündeki küçük satır — "Sincan / Ankara · özel ölçü mobilya" vb. — H1'in içinde, anahtar kelimeyi taşır.)

**Local SEO:** NAP her sayfada aynı (Osmanoğlu Mobilya · Ahi Evran Mahallesi, Sincan Sanayi Sitesi, 06000 Sincan / Ankara · 0532 177 06 19). Haritalar profili: web sitesi alanına site adresi eklensin (1 numaralı aksiyon); işletme adı "OSMANOĞLU MOBİLYA Mutfak Dekorasyon Sincan" anahtar kelime eki içeriyor — Google yönergelerine göre askıya alma riski var; tabela adıyla eşitlemek **öneridir, karar müşterinin**. Yorum stratejisi: teslimden sonra WhatsApp'tan Haritalar yorum bağlantısı + "fotoğraf ekler misiniz" ricası (fotoğraflı yorumlar zaten en güçlü kanıt). Haftalık saatler profile girilsin.
**Schema:** `HomeAndConstructionBusiness` (ad, adres, geo, telefon, hasMap, areaServed Ankara) her sayfada; alt sayfalarda `Service` + `BreadcrumbList`; her sayfada `FAQPage`. **`aggregateRating` yok** (self-serving review kuralı), **`openingHours` yok** (yalnız tek günün kapanışı biliniyor).
**Ölçüm planı:** GA4 kurulmadı (çerezsiz kalmak için). Olaylar `dataLayer`'a yazılıyor; GA4/GTM eklenince doğrudan kullanılabilir: `whatsapp_tikla`, `whatsapp_form`, `telefon_tikla`, `yol_tarifi`, `haritalar_tikla`, `harita_yukle`, `mesaj_kopyala` (+ `sayfa`). GA4 eklenirse onaydan önce yüklenmemeli.

## 14 — VISUAL INTELLIGENCE

| Dosya | Kaynak | Sınıf | Kullanıldığı yer |
|---|---|---|---|
| mutfak-pencere-l-tezgah | Video 1, kare 21 | ATTENTION · PROOF | Ana sayfa + mutfak hero (1. slayt), mutfak galerisi, OG görseli |
| mutfak-eviye-cekmeceler | Video 2, kare 38 | PRODUCT · PROOF | Hero 2. slayt, mutfak galerisi |
| antre-aynali-citali-vestiyer | Video 1, kare 37 (alttaki çöp poşeti ve ayakkabılar kırpıldı) | ATTENTION · PROOF | Hero 3. slayt, vestiyer hero + detay, ana sayfa iş satırı |
| mutfak-tezgah-kose | Video 2, kare 25 | PRODUCT | Ana sayfa detay bölümü, mutfak galerisi |
| mutfak-gun-isigi | Video 1, kare 14 | EMOTION | Ana sayfa mutfak satırı |
| karavan çizimi (SVG) | Temsili | BRAND | Karavan hero + ana sayfa satırı — "Temsili çizim" yazılı |

**Kullanılmayanlar:** Haritalar kapak fotoğrafı (showroom/ürün olabilir), yemek masası karesi (ürün mü müşteri eşyası mı belirsiz), yorumlardaki müşteri fotoğrafları (kullanım hakkı müşteride; yerine Haritalar bağlantısı). Videodaki "Film 1 / 30 Haziran 2021" yazılı ve fare imleçli kareler atlandı.
**Çözünürlük riski:** Kareler ~800 px. Hero'da 1,6× Lanczos + hafif keskinleştirme sürümü (`-buyuk.webp`) `srcset` ile verildi; bulanıklık filtresi yok, ama gerçek keskinlik için orijinaller gerekli.
**Tasarım dili:** fotoğraflardan türetildi — antre duvarının adaçayı yeşili (hero paneli), tahta kaplama (vurgu), siyah parlak kapak (metin, düğme), bakır damarlı tezgâh (koyu alt bilgi). İmza öğe: çekmecelerdeki yatay tutamak kanalı (`.kanal`: bölüm çizgileri, slayt göstergesi, liste işaretleri, SSS işareti).

**SHOT LIST (müşteriden)**
| # | Konu | Açı / ışık | Sayfa |
|---|---|---|---|
| 1 | Bu mutfak ve antrenin orijinal telefon fotoğrafları (2021) | — | Tüm hero'lar |
| 2 | 3–4 yeni mutfak, yatay, tüm duvar görünür | Göz hizası, gün ışığı, tavan lambaları açık, tezgâh boş | Mutfak hero / galeri |
| 3 | Çekmece açıkken iç düzen, köşe dolabı | 45°, yakın | Mutfak "birlikte seçtiklerimiz" |
| 4 | Gardırop / gömme dolap, kapaklar kapalı + açık | Karşıdan, tüm boy | Vestiyer |
| 5 | Atölye: tezgâhta kesim, kenar bantlama, montaj öncesi parçalar (yüz yok ya da izinli) | Doğal ışık | Ana sayfa "Nasıl başlarız" |
| 6 | Karavan (Kamil Bey'in izniyle) dış + iç | Yatay, açık hava | Karavan hero |
| 7 | Tabela / cephe | Karşıdan, gündüz | Konum bölümü, Haritalar |

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (açılmayanlar gerekçeli)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (gerekmez; koşulu yazılı)
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili çizim işaretli
- [x] `durum.md` güncellendi
