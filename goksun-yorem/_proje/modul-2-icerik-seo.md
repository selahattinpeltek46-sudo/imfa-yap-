# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Kaynak: `modul-1-strateji.md` (segmentler A/B/C, mesaj 07, teklif 08, CTA hiyerarşisi 09).

---

## 10 — INFORMATION ARCHITECTURE

Kullanıcı brifi **tek sayfalık landing page** istiyor; pazar küçük ve ürün yelpazesi tek sayfada anlatılabilir (M1 · Bulgu 2). Bu yüzden ayrı ürün sayfası üretilmedi. Form kişisel veri topladığı için yalnızca zorunlu yasal sayfa eklendi.

| Sayfa | Amaç | Hedef kullanıcı | Temel soru | Verilecek cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/goksun-yorem/` (Ana sayfa) | Sipariş ve randevu toplamak | Segment A, B, C | "Göksun'da taze et ve hakiki yayla ürünü nereden alırım?" | Göksun Yörem: günlük taze et + yöresel kahvaltılık, WhatsApp'tan sipariş | Fiziksel dükkan, süreç şeffaflığı, Instagram | "Göksun kasap", "Göksun tereyağı", "Göksun tulum peyniri" | WhatsApp Sipariş | Ürün → WhatsApp; Randevu → form → WhatsApp |
| `/goksun-yorem/kvkk/` | Formda toplanan veri için aydınlatma | Formu dolduran | "Bilgilerim ne olacak?" | Veri sorumlusu, amaç, süre, haklar | Şeffaflık | Yok (`noindex`) | Ana sayfaya dön | Ana sayfa |

Ana sayfa bölümleri (anchor = karar adımı):
| Anchor | Karar adımı |
|---|---|
| `#anasayfa` | Dikkat + anlama |
| `#biz-kimiz` | Güven |
| `#urunler` | İlgi + aksiyon |
| `#randevu` | Risk azaltma (süreç) + aksiyon |
| `#sss` | İtiraz giderme |
| `#iletisim` | Konum, saat, kanal |

Gereksiz sayfa kontrolü: Ayrı "Hakkımızda", "İletişim", "Ürünler" sayfaları **üretilmedi** — her biri ana sayfada karşılanıyor ve ayrı arama niyeti taşıyacak hacim yok.

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa bölüm sırası** (kullanıcının sırası korunmuş, iki küçük ekleme işaretli):
1. Header — logo, menü (Ana Sayfa · Biz Kimiz · Ürünler · Randevu · İletişim), yeşil WhatsApp Sipariş
2. Hero — overlay'li görsel, H1, alt başlık, 2 CTA, 3'lü bilgi şeridi (sadece doğrulanabilir/kullanıcı bilgisi)
3. Biz Kimiz — görsel + "%100 Taze & Yerli Kesim" rozeti, hikaye, 4 avantaj
4. Öne Çıkan Ürünler — 4 kart (kategori etiketi, görsel, açıklama, WhatsApp) + diğer ürün etiketleri + "Görseller temsilidir" notu
5. Randevu & Özel Sipariş — sol: **"Nasıl işler?" 3 adım (EK)**; sağ: koyu form (Ad Soyad, Telefon, Talep Türü, Tarih/Saat, Not, KVKK onayı, Gönder)
6. **SSS (EK)** — 5 soru; itirazları (M1 · 05) karşılar, FAQPage şeması
7. İletişim & Footer — adres, telefon, WhatsApp, Instagram, çalışma saatleri, KVKK bağlantısı, telif

**Internal linking planı**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Hero | `#urunler` | "Ürünleri İncele" |
| Hero | `#randevu` | "Özel Kesim Randevusu" |
| Biz Kimiz (son paragraf) | `#randevu` | "özel kesim randevusu" |
| Ürünler alt notu | `#randevu` | "toplu sipariş ve özel kesim için randevu alın" |
| SSS (toplu sipariş cevabı) | `#randevu` | "randevu formu" |
| Form KVKK onayı | `kvkk/` | "KVKK Aydınlatma Metni" |
| Footer | `kvkk/` | "KVKK Aydınlatma Metni" |
| KVKK sayfası | `../` | "Ana sayfaya dön" |

**Yasal**
- KVKK Aydınlatma Metni: **GEREKLİ** (form ad, telefon topluyor). Şablon, "hukuki kontrol gerekir" notuyla. Formda zorunlu "okudum" kutusu.
- Çerez Politikası / banner: **ŞU AN GEREKLİ DEĞİL** — sitede analytics/pixel yok; yalnızca CDN kaynakları (font, ikon, Tailwind) yükleniyor, sitenin kendisi çerez yazmıyor. GA4 eklenirse banner + onay sonrası yükleme zorunlu (13'e bakınız).

## 12 — COPYWRITING ENGINE

Kanıtsız iddia taraması (ilk sürümden çıkarılan/değiştirilen ifadeler):
| İlk sürüm | Sorun | Yeni |
|---|---|---|
| "Kurban / Adak Kesimi" seçeneği | Hizmet BİLİNMİYOR | Kaldırıldı |
| "Köy Yumurtası" | Brifte yok | "Kahvaltılıklar" |
| "Dinlendirilmiş, mermer dokulu" | Özgül üretim iddiası, kanıt yok | "İsteğinize göre kalınlıkta kesilen" |
| "Gözünüzün önünde çekilen kıyma" | Uygulama BİLİNMİYOR | "İstediğiniz yağ oranında hazırlanan kıyma" |
| "Yayıklanan ... hakiki tereyağı" | Üretim yöntemi BİLİNMİYOR | "Yayla sütünden elde edilen, katkısız tereyağı" |
| "Soğuk zincir hiç kırılmaz, gün boyu sterilize" | Mutlak iddia | "Soğuk zincire ve tezgah temizliğine özen" |
| "WhatsApp 7/24" | BİLİNMİYOR | "WhatsApp'tan mesaj bırakabilirsiniz" |
| "Hızlıca getirelim" | Süre vaadi | "Adresinize teslim edelim" |
| "Ustamız sizi arayacak" (form veriyi kimseye iletmiyordu) | Yanıltıcı | Form özeti WhatsApp'a aktarılır |
| Hero "Günlük yayla sütü" istatistiği | Sıklık BİLİNMİYOR | "Yayla Ürünleri" |

**Nihai metinler — Ana sayfa**
- Title: `Göksun Kasap & Şarküteri | Göksun Yörem Et ve Süt` (50 kr.)
- H1: **Ustasından Taze Et, Yöresinden Doğal Kahvaltılık**
- Hero alt metin: "Göksun yaylalarının temiz havasından sofranıza: günlük taze dana, kuzu ve tavuk etleri; katkısız yayla sütü, tereyağı, tulum peyniri ve süzme bal. İstediğiniz gibi hazırlayalım, WhatsApp'tan tek mesajla sipariş verin."
- CTA: "Ürünleri İncele" · "Özel Kesim Randevusu"
- Bilgi şeridi: "%100 — Taze & Yerli Kesim" · "Yayla — Süt Ürünleri" · "Kapıda — Adrese Teslimat"
- H2 Biz Kimiz: **Göksun'un Bereketini Ustalıkla Sofranıza Taşıyoruz**
  - P1: "Göksun Yörem; yöremizin temiz havasını, yayla ürünlerini ve geleneksel kasaplık anlayışını tek dükkanda buluşturur. Etlerimiz günlük, taze ve yerli kesim olarak tezgaha gelir; her parçayı sizin isteğinize göre hazırlarız." *(M4 · Revizyon R2 ile güncellendi)*
  - P2: "Hijyen bizim için işin temelidir: soğuk zincire, tezgah ve ekipman temizliğine her gün özen gösteririz. Yayla sütü, tereyağı ve tulum peyniri gibi kahvaltılıklarımızı katkı maddesi eklenmemiş, yöremizin geleneksel lezzetiyle sunarız."
  - P3: "Mangal, davet ya da kalabalık bir sofra mı hazırlıyorsunuz? **özel kesim randevusu** alın, siparişiniz istediğiniz saatte hazır olsun."
- Avantajlar: Günlük Taze Kesim — "Dana, kuzu ve tavuk etlerimiz her gün taze olarak tezgaha gelir." · Hijyenik Paketleme — "Gıdaya uygun malzemelerle, soğuk zincire özen gösterilerek paketlenir." · Katıksız Süt Ürünleri — "Yayla sütü, tereyağı ve tulum peyniri; katkı maddesi eklenmeden." · Adrese Teslimat — "WhatsApp'tan sipariş verin, Göksun merkezde adresinize teslim edelim."
- H2 Ürünler: **Tezgahımızın Gözdeleri** — "Taze etten yayla kahvaltılığına, en çok tercih edilen lezzetlerimiz. Güncel fiyat ve stok bilgisi için tek dokunuşla WhatsApp'tan yazın."
  - Taze Dana Biftek / Antrikot — "Izgara ve tava için isteğinize göre kalınlıkta kesilen dana antrikot ve bonfile."
  - Özel Kıyma & Kuzu Pirzola — "İstediğiniz yağ oranında hazırlanan dana kıyma ve mangalın vazgeçilmezi kuzu pirzola."
  - Göksun Yayla Tereyağı — "Yayla sütünden elde edilen, katkı maddesi eklenmemiş, kahvaltıların yıldızı tereyağı."
  - Yöresel Peynirler & Bal — "Tulum peyniri, yöresel peynirler ve kahvaltıların tatlı eşlikçisi süzme bal." *(M4 · R1)*
  - Alt not: "Görseller temsilidir. Toplu sipariş ve özel kesim için randevu alın."
- H2 Randevu: **Özel Kesim & Toplu Sipariş** — "Mangal davetiniz ya da kalabalık bir sofranız mı var? Formu doldurun, talebiniz WhatsApp üzerinden bize ulaşsın; ustamız ürün, miktar ve saati sizinle teyit etsin."
  - Nasıl işler: 1) **Talebinizi iletin** — Formu doldurun ya da WhatsApp'tan yazın. 2) **Birlikte teyit edelim** — Ürün, miktar, kesim şekli ve güncel fiyatı yazılı olarak netleştirelim. 3) **Hazır olsun** — Belirlediğimiz saatte dükkandan alın ya da adresinize teslim edelim.
  - Form başlığı: "Randevu / Sipariş Formu"; buton: "Talebimi Gönder"; KVKK: "KVKK Aydınlatma Metni'ni okudum, talebimle ilgili benimle iletişime geçilmesini kabul ediyorum."
  - Alert: "Teşekkürler {ad}! {talep} talebiniz {tarih} için hazırlandı. Onaylamak için WhatsApp açılacak; mesajı göndermeniz yeterli."
- H2 SSS: **Sıkça Sorulan Sorular**
  1. *Sipariş nasıl veririm?* — "Sayfadaki WhatsApp butonlarından birine dokunun; ürün adı hazır yazılmış bir mesaj açılır. Miktarı ve teslim şeklini yazıp gönderin, siparişinizi teyit edelim."
  2. *Adrese teslimat var mı?* — "Evet, Göksun merkezde adrese teslimat yapıyoruz. Merkez dışı adresler için WhatsApp'tan yazın, imkânımızı birlikte değerlendirelim."
  3. *Eti istediğim gibi kestirebilir miyim?* — "Elbette. Kalınlık, porsiyon, kıymanın yağ oranı, şiş ve köfte hazırlığı gibi isteklerinizi sipariş notuna yazmanız yeterli."
  4. *Toplu / mangal siparişini ne kadar önce vermeliyim?* — "Kalabalık siparişlerde en az bir gün önceden randevu formu ile talep iletmenizi öneririz; böylece ürün ve hazırlık zamanında planlanır."
  5. *Fiyatları nereden öğrenebilirim?* — "Et ve süt ürünlerinde fiyatlar güne göre değişebildiği için güncel fiyatı WhatsApp'tan ya da telefonla sorabilirsiniz."
- Footer: "Ustasından taze et, yöresinden doğal kahvaltılık. Göksun'un lezzetlerini hijyen ve güvenle sofranıza taşıyoruz." · Saatler `[VARSAYIM — teyit gerek]` · "© {yıl} Göksun Yörem Et ve Süt Ürünleri. Tüm hakları saklıdır."

## 13 — SEO & ANALYTICS ENGINE

| Intent | Keyword | Page | Message | Content | Proof | CTA |
|---|---|---|---|---|---|---|
| Yerel satın alma | göksun kasap | Ana sayfa | Taze et, usta kesim | Hero, Biz Kimiz | Adres, dükkan | WhatsApp |
| Yerel satın alma | göksun et / göksun şarküteri | Ana sayfa | Et + şarküteri tek yerde | Ürünler | Ürün kartları | Sipariş Ver |
| Yöresel ürün | göksun tereyağı / yayla tereyağı | Ana sayfa `#urunler` | Katkısız yayla ürünü | Tereyağı kartı | Yöre (coğrafya) | Sipariş Ver |
| Yöresel ürün | göksun tulum peyniri / göksun balı | Ana sayfa `#urunler` | Yöresel kahvaltılık | Peynir & Bal kartı | Yöre | Sipariş Ver |
| Hizmet | göksun özel kesim / mangal eti siparişi | Ana sayfa `#randevu` | Hazır gelsin | Randevu, SSS | Süreç | Form |
| Bilgi | göksun kasap telefon / adres | Ana sayfa `#iletisim` | Kolay ulaşım | Footer | NAP | Ara |

| Sayfa | Title | Meta description | H1 | Slug |
|---|---|---|---|---|
| Ana sayfa | Göksun Kasap & Şarküteri \| Göksun Yörem Et ve Süt (50) | Göksun'da günlük taze dana, kuzu, tavuk; katkısız yayla tereyağı, tulum peyniri ve süzme bal. WhatsApp'tan sipariş, adrese teslimat. (~140) | Ustasından Taze Et, Yöresinden Doğal Kahvaltılık | `/goksun-yorem/` |
| KVKK | KVKK Aydınlatma Metni \| Göksun Yörem (37) | Göksun Yörem Et ve Süt Ürünleri iletişim ve sipariş formu kişisel verilerin işlenmesine ilişkin aydınlatma metni. (~115) | KVKK Aydınlatma Metni | `/goksun-yorem/kvkk/` (noindex) |

**Local SEO**
- NAP: "Göksun Yörem Et ve Süt Ürünleri · Göksun Merkez, Göksun / Kahramanmaraş · [telefon]" — site, Instagram biyografisi ve Google Business'ta **birebir aynı** yazılmalı.
- Google Business Profili: kategori "Kasap" + ek kategori "Şarküteri"; ürün fotoğrafları; WhatsApp/telefon; saatler; site bağlantısı. (Sahibi tarafından açılmalı — ❌ bizim tarafımızdan yapılamaz.)
- Yorum stratejisi: Teslimat sonrası WhatsApp'tan nazik Google yorum bağlantısı. Sitede sahte/uydurma yorum **yok**.
- Yerel içerik: Hero ve Biz Kimiz'de "Göksun", "Kahramanmaraş", "yayla" doğal geçiyor.
- Schema: `LocalBusiness` → `ButcherShop` (adres, alan, sameAs Instagram, telefon yer tutucu değiştirilince), `FAQPage` (5 soru). `Product` şeması **eklenmedi** — fiyat/stok verisi yok, eksik Product şeması Google'da hata üretir.
- `sitemap.xml` (yalnızca ana sayfa), canonical, OG etiketleri.

**Ölçüm planı**
- Şu an: analytics YOK (çerez banner'ı gerekmesin diye). Sayfa içi olaylar `data-track` niteliğiyle işaretli ve tek bir `track()` fonksiyonundan geçiyor → GA4 eklenince tek satırda bağlanır.
- Olaylar: `whatsapp_click` (konum: header/hero/kart/sabit/footer + ürün), `phone_click`, `form_submit` (talep türü), `instagram_click`.
- GA4 eklenirse: çerez banner'ı + Consent Mode; GA4 etiketi onaydan sonra yüklenir.

## 14 — VISUAL INTELLIGENCE

Gerçek görsel: **YOK** (repoda firmaya ait fotoğraf bulunmuyor).

| Bölüm | Sınıf | Şu anki görsel | Durum |
|---|---|---|---|
| Hero arka planı | ATTENTION / EMOTION | Unsplash et tezgahı | Temsili — PROOF değil, kabul edilebilir |
| Biz Kimiz | BRAND / PROOF | Unsplash kasap dükkanı | ⚠️ PROOF alanı — "Temsili görsel" etiketi eklenmeli; gerçek dükkan fotoğrafı öncelikli |
| Ürün kartları ×4 | PRODUCT | Unsplash | Temsili — alt notla işaretli |
| Randevu arka planı | EMOTION | Unsplash et | Dekoratif (`aria-hidden`) |
| Logo | BRAND | İkon + yazı | Gerçek logo gelince değiştirilecek |

**SHOT LIST** (telefonla çekilebilir; gün ışığı veya beyaz LED, telefon "portre" modu kapalı)
| # | Konu | Açı | Işık | Kullanım |
|---|---|---|---|---|
| 1 | Dükkan dış cephe + tabela | Karşı kaldırımdan, göz hizası | Gündüz, gölgesiz saat | Biz Kimiz / Google Business |
| 2 | Temiz et tezgahı, vitrin dolu | 45°, vitrin camına yansımasız | Vitrin ışığı + ortam | Biz Kimiz (PROOF) |
| 3 | Usta iş başında (kesim, önlük, eldiven) | Bel hizası, yan | Doğal ışık | Biz Kimiz / Hero alternatifi |
| 4 | Dana antrikot tahta üzerinde | Üstten (flat lay) | Yumuşak yan ışık | Ürün kartı 1 |
| 5 | Kuzu pirzola + kıyma | 45° | Yumuşak yan ışık | Ürün kartı 2 |
| 6 | Tereyağı kalıbı, kesilmiş dilim | Yakın, 30° | Pencere ışığı | Ürün kartı 3 |
| 7 | Tulum peyniri + petek/süzme bal kahvaltı tabağı | Üstten | Pencere ışığı | Ürün kartı 4 |
| 8 | Paketlenmiş sipariş (etiketli) | 45° | Doğal | Hijyenik Paketleme / teslimat |
| 9 | Yayla manzarası (Göksun) | Geniş açı | Altın saat | Hero alternatifi (EMOTION) |

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili görseller işaretli
- [x] `durum.md` güncellendi
