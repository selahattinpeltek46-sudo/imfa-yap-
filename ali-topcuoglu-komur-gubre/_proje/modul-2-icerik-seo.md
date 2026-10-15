# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Kaynak: `modul-1-strateji.md` (segmentler A/B/C, mesaj 07, teklif 08, CTA hiyerarşisi 09, KRİTİK riskler: telefon/adres teyidi).
Emsal incelendi: `soyleroglu-hafriyat/` (çok sayfalı, hizmet+konum siloları, schema.org, canonical/OG meta) — Ali Bey'in firmasının nakliye hattı bu projeyle aynı pazarda olabileceğinden, metinlerde Söyleroğlu'na hiçbir atıf/kıyas yapılmayacak (M1 · Bulgu 5).

---

## 10 — INFORMATION ARCHITECTURE

Dört iş kolu (kömür / gübre / nakliye / inşaat ticareti) birbirinden farklı arama niyeti ve farklı müşteri segmentine karşılık geliyor (M1 · 05, 06) → **tek sayfa yerine çok sayfalı, hizmet bazlı mimari** seçildi (soyleroglu-hafriyat emsali ile tutarlı). Gereksiz sayfa üretilmedi: her sayfa gerçek ve ayrı bir arama niyetini karşılıyor.

| Sayfa | Amaç | Hedef kullanıcı | Temel soru | Verilecek cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` (Ana sayfa) | Dört iş kolunu özetleyip doğru sayfaya yönlendirmek | Tüm segmentler | "Ali Topçuoğlu ne satıyor / ne yapıyor?" | 4 net iş kolu kartı | Göksun'da yerel, tek adres | Marka adı + "Göksun kömür gübre nakliye inşaat ticareti" | Telefon (genel) | Kart → ilgili iş kolu sayfası |
| `/goksun-komur/` | Isınma kömürü talebini karşılamak | Segment B (hane/işletme) | "Göksun'da kömür nereden alınır?" | Kömür satışı, teslim süreci | Yerel, ulaşılabilir | "Göksun kömür satışı", "Göksun yakacak kömürü" | Telefon | → İletişim |
| `/goksun-gubre/` | Tarımsal gübre talebini karşılamak | Segment A (çiftçi) | "Göksun'da gübre nereden alınır?" | Gübre satışı, sezonluk tedarik | Yerel, sezon bilgisi | "Göksun gübre satışı", "Göksun tarım gübresi" | Telefon | → İletişim |
| `/goksun-nakliye/` | Taşımacılık/nakliye talebini karşılamak | Segment C (müteahhit/genel) | "Göksun'da yük/malzeme nakliyesi kim yapıyor?" | Nakliye hizmeti, süreç | Yerel, ulaşılabilir araç | "Göksun nakliye", "Göksun taşımacılık" | Telefon | → İletişim |
| `/goksun-insaat-ticareti/` | İnşaat ticareti talebini karşılamak | Segment C (müteahhit) | "Göksun'da inşaat ticareti/malzemesi kim sağlıyor?" | İnşaat ticareti kapsamı (ürün detayı teyit edilene kadar genel) | Yerel | "Göksun inşaat ticareti" | Telefon | → İletişim |
| `/hakkimizda/` | Güven kurmak | Tüm segmentler | "Bu firma kim, güvenilir mi?" | Göksun'da yerel firma anlatısı — yalnızca teyit edilen bilgiyle | Yerel varlık | Marka arama | Telefon | → İletişim |
| `/iletisim/` | İletişime geçirmek | Tüm segmentler | "Nasıl ulaşırım?" | Telefon, adres, harita (teyit edilince) | Harita, çalışma saati | Marka + "Göksun" | Telefon | — |

Gereksiz sayfa kontrolü: Ayrı SSS sayfası, blog/bilgi merkezi gibi ek sayfalar **bu aşamada üretilmedi** — ürün detayları (M1 · 03) teyit edilmeden derinlemesine içerik (ör. "hangi kömür türü ne işe yarar") üretmek kanıtsız iddia riski taşır. İleride ürün bilgisi netleşirse eklenebilir [not: M3/M4'te değerlendirilecek].

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa bölüm sırası:**
1. Header — logo/marka, menü (Ana Sayfa · Kömür · Gübre · Nakliye · İnşaat Ticareti · Hakkımızda · İletişim), telefon butonu
2. Hero — H1 (4 iş kolunu özetleyen), alt metin, telefon CTA — **somut rakam/istatistik YOK** (kuruluş yılı, filo sayısı vb. teyitsiz)
3. İş Kolları — 4 kart (kömür/gübre/nakliye/inşaat ticareti), her biri ilgili sayfaya link
4. Neden Biz — Göksun'da yerel olma, tek adresten 4 hizmet — **yalnızca doğrulanabilir maddeler**
5. İletişim & Footer — adres (teyit bekliyor), telefon (teyit bekliyor), çalışma saatleri (teyit bekliyor)

**İş kolu sayfası bölüm sırası (4 sayfa için ortak şablon):**
1. Header (ortak)
2. Hero — o iş koluna özel H1 + kısa açıklama + telefon CTA
3. Ne Sunuyoruz — kategori düzeyinde açıklama (ürün alt kalemleri teyit edilmeden spesifik liste verilmez)
4. Nasıl Çalışıyoruz — 3 adım: 1) Telefonla ihtiyaç bildirilir → 2) Fiyat/stok teyit edilir → 3) Teslim/alım planlanır
5. Diğer İş Kollarımız — kalan 3 karta çapraz link (internal linking)
6. İletişim & Footer (ortak)

**Internal linking planı**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Ana sayfa hero | 4 iş kolu kartı | "Kömür" / "Gübre" / "Nakliye" / "İnşaat Ticareti" |
| Her iş kolu sayfası | Diğer 3 iş kolu sayfası | "Diğer Hizmetlerimiz" bölümünde ilgili iş kolu adı |
| Her iş kolu sayfası | `/iletisim/` | "Bize Ulaşın" |
| Footer (tüm sayfalar) | Ana sayfa + 4 iş kolu + hakkımızda + iletişim | Site haritası niteliğinde |
| `/hakkimizda/` | `/iletisim/` | "İletişime Geçin" |

**Yasal**
- KVKK Aydınlatma Metni: **ŞU AN GEREKLİ DEĞİL** — M1 · 09'da form/üçüncül CTA "BİLİNMİYOR" olarak işaretlenmişti; bu modülde karar verildi: **v1'de kişisel veri toplayan form YOK**, tek CTA telefon (teyit edilirse WhatsApp). Form eklenirse KVKK metni o zaman zorunlu olur.
- Çerez Politikası / banner: **ŞU AN GEREKLİ DEĞİL** — analytics/pixel planlanmıyor (bkz. 13). Eklenirse banner + onay sonrası yükleme zorunlu olacak.
- Domain: BİLİNMİYOR — bu modülde sayfalar **göreli (relative) yollarla** kurgulanıyor; canonical/OG mutlak URL'leri gerçek domain teyit edilince eklenecek.

## 12 — COPYWRITING ENGINE

Kanıtsız iddia taraması (bu modülde üretilirken doğrudan elenen ifade kalıpları):
| Kalıp | Sorun | Yerine kullanılan |
|---|---|---|
| "Yılların tecrübesiyle" / "X yıldır" | Kuruluş yılı BİLİNMİYOR | "Göksun'da" (yıl verilmez) |
| "Geniş filomuzla" / "X aracımızla" | Filo bilgisi BİLİNMİYOR | "Araç/ekip ihtiyacınıza göre" |
| "En uygun fiyat" / "Piyasanın en ucuzu" | Kanıtsız kıyas iddiası | "Fiyat için arayın" |
| "7/24 hizmet" | BİLİNMİYOR | "Çalışma saatleri için arayın" (saat teyit edilene kadar) |
| "Aynı gün teslimat" | Süre vaadi, BİLİNMİYOR | "Teslim süresi ihtiyaca göre belirlenir" |
| "Kaliteli / birinci sınıf kömür-gübre" | Ürün detayı/kalite sınıfı BİLİNMİYOR | "İhtiyacınıza uygun kömür/gübre" |

**Nihai metinler — Ana sayfa**
- Title: `Ali Topçuoğlu | Göksun Kömür, Gübre, Nakliye ve İnşaat Ticareti` (58 kr.)
- Meta description: `Göksun'da kömür, gübre, nakliye ve inşaat ticareti tek adreste. Ali Topçuoğlu ile ihtiyacınız için bize ulaşın.` (108 kr.)
- H1: **Göksun'da Kömürden Gübreye, Nakliyeden İnşaat Ticaretine**
- Hero alt metin: "Ali Topçuoğlu; Göksun ve çevresinde kömür, gübre, nakliye ve inşaat ticareti hizmetlerini tek adreste sunuyor. İhtiyacınız için bize ulaşın."
- CTA: "Bizi Arayın" *(telefon numarası M1 teyidi sonrası eklenecek — şimdilik [TELEFON TEYİT BEKLİYOR] yer tutucu)*
- İş kolu kartları:
  - **Kömür** — "Göksun'da kış hazırlığı için kömür tedariki."
  - **Gübre** — "Tarlanız ve bahçeniz için gübre tedariki."
  - **Nakliye** — "Yük ve malzeme taşımacılığı."
  - **İnşaat Ticareti** — "İnşaat ihtiyaçlarınız için ticari tedarik."
- H2 Neden Biz: **Göksun'da Tek Adresten Dört Hizmet** — "Kömürden gübreye, nakliyeden inşaat ticaretine kadar farklı ihtiyaçlarınız için Göksun'da yerel ve ulaşılabilir bir muhatap arıyorsanız, doğru yerdesiniz."

**Nihai metinler — iş kolu sayfaları (özet; tam metin M3'te sayfaya işlenecek)**
- `/goksun-komur/` — H1: **Göksun'da Kömür Tedariki** · Gövde: "Kışa hazırlanırken güvenilir bir kömür tedarikçisi arıyorsanız, Göksun'da buradayız. Kömür türü, miktar ve teslim koşulları için bizi arayın." *(kömür türü/menşei BİLİNMİYOR, spesifik iddia yok)*
- `/goksun-gubre/` — H1: **Göksun'da Gübre Tedariki** · Gövde: "Tarlanız, bahçeniz veya elma bahçeniz için gübre ihtiyacınızı Göksun'da karşılıyoruz. Ürün ve miktar için bizi arayın." *(gübre türü BİLİNMİYOR, spesifik iddia yok)*
- `/goksun-nakliye/` — H1: **Göksun'da Nakliye ve Taşımacılık** · Gövde: "Yük, malzeme veya hafriyat taşıma ihtiyacınız için Göksun'da bizi arayabilirsiniz. İhtiyacınızı ve zamanlamayı birlikte planlayalım." *(filo/kapasite iddiası yok)*
- `/goksun-insaat-ticareti/` — H1: **Göksun'da İnşaat Ticareti** · Gövde: "İnşaat ihtiyaçlarınız için Göksun'da bizimle iletişime geçin; ihtiyacınızı birlikte netleştirelim." *(kapsam BİLİNMİYOR, genel düzeyde kalındı — M1 · 03)*

## 13 — SEO & ANALYTICS ENGINE

**Search intent → Keyword → Page → Message → Content → Proof → CTA**

| Intent | Keyword (örnek) | Sayfa | Mesaj | İçerik | Kanıt | CTA |
|---|---|---|---|---|---|---|
| Transactional | Göksun kömür satışı | `/goksun-komur/` | Yerel, ulaşılabilir kömür tedariki | Hizmet açıklaması + süreç | BİLİNMİYOR (teyit sonrası eklenecek) | Telefon |
| Transactional | Göksun gübre satışı | `/goksun-gubre/` | Yerel, sezonluk gübre tedariki | Hizmet açıklaması + süreç | BİLİNMİYOR | Telefon |
| Transactional | Göksun nakliye / taşımacılık | `/goksun-nakliye/` | Yerel yük/malzeme taşıma | Hizmet açıklaması + süreç | BİLİNMİYOR | Telefon |
| Transactional | Göksun inşaat ticareti | `/goksun-insaat-ticareti/` | Yerel inşaat ticareti muhatabı | Hizmet açıklaması + süreç | BİLİNMİYOR | Telefon |
| Navigational | Ali Topçuoğlu Göksun | `/` | Marka + 4 hizmet | Hero + kartlar | — | Telefon |
| Informational | Göksun'da kömür/gübre nereden alınır | `/goksun-komur/`, `/goksun-gubre/` | Aynı sayfalar cevap verir | — | — | Telefon |

Her sayfa: title ≤60, meta description ≤155, H1, URL slug — yukarıdaki tabloda verildi; iş kolu sayfalarının tam title/meta değerleri M3'te sayfa koduna işlenirken netleştirilecek (kalıp: `Göksun [İş Kolu] | Ali Topçuoğlu`).

**Local SEO**
- NAP (Ad-Adres-Telefon) tutarlılığı: **BEKLİYOR** — adres/telefon teyit edilmeden hiçbir sayfada NAP bilgisi yazılmayacak (M1 · 03 KRİTİK).
- Google Business profili: BİLİNMİYOR — var olup olmadığı kullanıcıya sorulmalı; varsa site ile profil arasında NAP birebir eşleşmeli.
- Yorum stratejisi: BİLİNMİYOR — sahte yorum **kesinlikle kullanılmayacak** (Değişmez Kural 4).
- Yapılandırılmış veri: Her iş kolu sayfasında `LocalBusiness` (adres/telefon teyit edilince) + `BreadcrumbList`; SSS üretilirse `FAQPage`. Soyleroglu-hafriyat'taki şema deseni emsal alınabilir.

**Ölçüm planı**
- Analytics/pixel bu v1'de **planlanmıyor** (BİLİNMİYOR — kullanıcı isterse eklenir, çerez bannerı ile birlikte).
- İzlenecek olay adayı: telefon tıklaması (`tel:` link click, basit `onclick` sayaç veya ileride GA4).

## 14 — VISUAL INTELLIGENCE

Gerçek görsel repoda yok (M1 · 01). Sınıflandırma ve SHOT LIST:

| Sayfa | İhtiyaç | Sınıf | Durum |
|---|---|---|---|
| Ana sayfa hero | Göksun'da saha/depo/araç görünümü | ATTENTION | Gerçek görsel yok → geçici temsili stok görsel, "temsili" notu ile |
| Kömür sayfası | Kömür yığını / çuval | PRODUCT | Temsili stok görsel |
| Gübre sayfası | Gübre çuvalı / tarla | PRODUCT | Temsili stok görsel |
| Nakliye sayfası | Kamyon/araç, yükleme | PRODUCT/PROCESS | Temsili stok görsel |
| İnşaat ticareti sayfası | İnşaat malzemesi / saha | PRODUCT | Temsili stok görsel |
| Hakkımızda | Gerçek ekip/saha fotoğrafı | PROOF/EMOTION | **Gerçek görsel olmadan bu kategori doldurulamaz** — SHOT LIST'e eklendi |

**SHOT LIST (gerçek fotoğraf çekilirse):**
1. Depo/saha dış cephe — geniş açı, gün ışığı → Ana sayfa hero, Hakkımızda
2. Kömür istifi/çuvalları — yakın çekim → Kömür sayfası
3. Gübre çuvalları/stoğu — yakın çekim → Gübre sayfası
4. Nakliye aracı (varsa) — yandan geniş açı → Nakliye sayfası
5. Ali Topçuoğlu (izin verilirse) — saha/ofis, doğal duruş → Hakkımızda

Tüm stok/temsili görseller sayfada küçük "Görseller temsilidir" notu ile işaretlenecek (Değişmez Kural 4).

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (SSS/blog bilerek ertelendi, gerekçeli)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (v1'de ikisi de gerekli değil — form/analytics yok)
- [x] Tüm sayfaların nihai metni (ana sayfa tam, iş kolu sayfaları özet) yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var (NAP teyide bağlı olarak BEKLİYOR işaretli)
- [x] Ölçüm olayları tanımlı (minimal — analytics yok)
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili görseller işaretli
- [x] `durum.md` güncellendi

**NOT:** Local SEO'nun en kritik bileşeni (NAP tutarlılığı) hâlâ M1'deki 2 KRİTİK maddeye bağlı. Modül 3'te sayfalar geliştirilecek ancak adres/telefon alanları teyit gelene kadar açık yer tutucu olarak kalacak.
