# 🔵 MODÜL 2 — BİLGİ MİMARİSİ, İÇERİK, SEO VE GÖRSEL (10–14)

Proje: Barber's Town · Girdi: `modul-1-strateji.md` · Tarih: 2026-10-15
Yayın adresi: `https://selahattinpeltek46-sudo.github.io/imfa-yap-/barbers-town/`

---

## 10 — INFORMATION ARCHITECTURE

Karar: **tek sayfa + KVKK sayfası.** Gerekçe: Hizmet sayısı az, fiyat ve portföy bilgisi yok; ayrı "hizmetler / hakkımızda / iletişim" sayfaları boş tekrar olur. Arama niyeti (yer + "berber") tek güçlü sayfayla karşılanır. Her bölüm bir karar adımına karşılık gelir.

| Sayfa / bölüm | Amaç | Hedef kullanıcı | Temel soru | Verilecek cevap | Güven unsuru | SEO amacı | CTA | Next step |
|---|---|---|---|---|---|---|---|---|
| `/` Hero | Kim, nerede, nasıl ulaşırım | Tümü | "Bu berber nerede, iyi mi?" | Yeditepe'de erkek kuaförü, 5,0 ★ | Google puanı | "gaziantep erkek kuaför", "yeditepe berber" | WhatsApp randevu / Ara | Hizmetler |
| `/#hizmetler` | Ne yapılıyor | A, B, C | "İstediğim hizmet var mı?" | 6 hizmet kartı, fiyat WhatsApp'tan | Net, abartısız tanım | "sakal tıraşı gaziantep", "damat tıraşı gaziantep" | Hizmete özel WhatsApp | Neden biz |
| `/#neden` | Güven | Kararsız olan | "Gerçekten iyi mi?" | 140 değerlendirme, 5,0; yorumlar Haritalar'da | Bağlantılı, tarihli puan | — | Yorumları oku | Randevu |
| `/#randevu` | Dönüşüm | Karar vermiş | "Nasıl randevu alırım?" | 3 adım + form → WhatsApp | Ücretsiz, ön ödemesiz | "berber randevu gaziantep" | Formu WhatsApp'a gönder | Teyit |
| `/#sss` | İtiraz giderme | Tümü | "Randevusuz olur mu, fiyat?" | 6 soru-cevap | Şeffaflık | FAQPage rich result | Ara | Konum |
| `/#konum` | Ziyaret | C | "Nasıl giderim, saat kaçta kapanıyor?" | Açık adres, plus code, kapanış 21:00, harita | Gerçek adres | Local NAP | Yol tarifi | — |
| `/kvkk/` | Yasal | Form kullanan | "Bilgim nereye gidiyor?" | Aydınlatma metni (şablon) | Şeffaflık | noindex değil, düşük öncelik | Ana sayfaya dön | — |

## 11 — WEBSITE BLUEPRINT & LEGAL

**Ana sayfa bölüm sırası:**
1. Header (oval logo, menü: Hizmetler · Randevu · SSS · Konum, "Ara" butonu)
2. Hero (eyebrow, H1, alt metin, 2 CTA, puan rozeti, bilgi şeridi: kapanış 21:00 · Yeditepe · randevu ücretsiz)
3. Hizmetler (6 kart + fiyat notu)
4. Neden Barber's Town (büyük puan bloğu + 3 madde)
5. Randevu (3 adım + form)
6. SSS (akordeon, `<details>`)
7. Konum (adres kartı + tıklayınca yüklenen harita)
8. Footer (NAP, KVKK, not)
9. Mobil sabit alt bar (WhatsApp · Ara)

**Internal linking planı:**
| Nereden | Nereye | Bağlantı metni |
|---|---|---|
| Header | `#hizmetler`, `#randevu`, `#sss`, `#konum` | Hizmetler / Randevu / SSS / Konum |
| Hero | `#hizmetler` | "Hizmetlere bak" (metin linki) |
| Hizmet kartı | WhatsApp | "Bu hizmet için yaz" |
| Neden | Google Haritalar | "Yorumları Google'da okuyun" |
| SSS (fiyat, saat) | `#randevu`, `#konum` | "randevu formu", "konum" |
| Form notu, footer | `/kvkk/` | "KVKK Aydınlatma Metni" |
| KVKK | `/` | "Ana sayfaya dön" |

**Yasal:**
- KVKK Aydınlatma Metni: form ad/tercih topluyor (veri WhatsApp üzerinden işletmeye ulaşıyor) → **gerekli**, şablon, "hukuki kontrol gerekir" notuyla.
- Çerez politikası / banner: analytics yok, harita iframe'i yalnız kullanıcı "Haritayı yükle"ye tıklayınca yüklenir, Google Fonts yerine sistem/yerel yazı tipi → zorunlu olmayan çerez yok → **banner gerekmez**. GA4 eklenirse banner zorunlu (handoff notu).

## 12 — COPYWRITING ENGINE

**Title:** Barber's Town | Erkek Kuaförü Yeditepe, Şahinbey Gaziantep
**Meta:** Gaziantep Yeditepe'de erkek kuaförü: saç kesimi, sakal ve bakım. Google'da 5,0 puan (140 yorum). WhatsApp'tan randevu: 0535 729 43 33.

**Hero**
- Eyebrow: Erkek Kuaför & Güzellik Merkezi · Şahinbey / Gaziantep
- H1: Yeditepe'de kırmızı halıyla karşılanan erkek kuaförü
- Alt: Saç kesimi, sakal ve bakım. Saatinizi WhatsApp'tan ayırtın; geldiğinizde koltuğunuz hazır olsun.
- CTA1: WhatsApp'tan Randevu Al · CTA2: Hemen Ara · metin linki: Hizmetlere bak
- Rozet: ★ 5,0 · Google'da 140 değerlendirme
- Şerit: Akşam 21:00'e kadar · 7 Tepe Mah., Şahinbey · Randevu ücretsiz

**Hizmetler** — H2: Hizmetler · Giriş: "Saçınızı, sakalınızı ve cildinizi tek koltukta toparlayın."
1. Saç Kesimi — Klasik kesimden fade'e; istediğiniz modeli önceden fotoğrafla gönderebilirsiniz.
2. Sakal Tıraşı & Şekillendirme — Sakalınıza hat, form ve temiz bir bitiş.
3. Saç + Sakal — İkisini bir arada, tek randevuda.
4. Çocuk Tıraşı — Küçük beyler için sakin ve özenli kesim.
5. Cilt Bakımı — Tıraş sonrası cildinizi rahatlatan bakım.
6. Damat Tıraşı — Büyük gün için saç, sakal ve bakım; tarihinizi önceden ayırtın.
Not: "Güncel fiyatlar ve hizmet detayları için WhatsApp'tan yazın." (Hizmet listesi [VARSAYIM] — `index.html` hizmet kartlarından ve form seçeneklerinden düzenlenir.)

**Neden** — H2: Konuşan biz değil, müşterilerimiz
- Büyük blok: 5,0 / ★★★★★ / Google Haritalar'da 140 değerlendirme · "15 Ekim 2026 itibarıyla" · Link: Yorumları Google'da okuyun
- Madde 1 — Önceden yazın, beklemeyin: Saatinizi WhatsApp'tan ayarlayın, geldiğinizde sıranız hazır olsun.
- Madde 2 — Modelinizi konuşalım: Beğendiğiniz kesimin fotoğrafını gönderin; koltuğa oturmadan ne istediğinizi bilelim.
- Madde 3 — Akşam da açığız: İş ya da okul çıkışı uğrayın; kapanışımız 21:00.

**Randevu** — H2: 3 adımda randevu
1. Hizmeti ve gününüzü seçin · 2. Mesajı WhatsApp'tan gönderin · 3. Saatinizi teyit edelim, gelin.
Form alanları: Adınız · Hizmet · Gün · Saat tercihi (Öğleden önce / Öğleden sonra / Akşam) · Not (isteğe bağlı)
Buton: "Randevu Talebini WhatsApp'tan Gönder"
Form altı metin: "Bu form bilgilerinizi hiçbir sunucuya kaydetmez; yalnızca WhatsApp'ta hazır bir mesaj oluşturur. Mesajı siz gönderdiğinizde bize ulaşır ve saatinizi teyit ederiz. Ayrıntılar: KVKK Aydınlatma Metni."

**SSS** — H2: Sık sorulan sorular
1. Randevusuz gelebilir miyim? — Gelebilirsiniz; uygunluk durumuna göre hemen ya da kısa bir beklemeyle alırız. Beklemek istemiyorsanız önceden WhatsApp'tan yazmanız ya da aramanız yeterli.
2. Fiyatlar ne kadar? — Fiyatlar hizmete göre değişir ve dönem dönem güncellenir. Güncel fiyatı WhatsApp'tan ya da telefonla sorabilirsiniz.
3. Çalışma saatleriniz nedir? — Akşam 21:00'e kadar açığız. Açılış saati ve tatil günü için gelmeden önce aramanızı öneririz.
4. İstediğim modeli nasıl anlatırım? — Beğendiğiniz kesimin fotoğrafını randevu mesajınıza ekleyin; gelmeden önce birlikte konuşalım.
5. Damat tıraşı için ne zaman yazmalıyım? — Düğün tarihiniz belli olur olmaz yazın; günün yoğunluğuna göre saatinizi ayırtalım.
6. Dükkân tam olarak nerede? — 7 Tepe Mahallesi, 85043 Nolu Cadde, Maliyeci Ahmet Sitesi A Blok No:75/A, Şahinbey/Gaziantep. Haritada "28MF+QQ" kodu ile de bulabilirsiniz.

**Konum** — H2: Bizi bulun · adres · telefon · kapanış 21:00 · butonlar: Yol Tarifi Al / Haritada Aç · "Haritayı göster" (tıklayınca Google haritası yüklenir; yüklenmeden Google'a veri gitmez).

**Footer:** Barber's Town Erkek Kuaför & Güzellik Merkezi · adres · 0535 729 43 33 · KVKK Aydınlatma Metni · © 2026

Kanıtsız iddia taraması: "en iyi", "usta", "yıllık tecrübe", "hijyen garantisi", "uzman ekip", "premium ürün" ifadeleri **kullanılmadı**. Tek sayısal iddia (5,0 / 140) tarihli ve kaynağa bağlı. "Kırmızı halı" fotoğrafla doğrulanmış.

## 13 — SEO & ANALYTICS ENGINE

| Intent | Keyword | Page | Message | Content | Proof | CTA |
|---|---|---|---|---|---|---|
| Yerel, işlem | gaziantep erkek kuaför, antep berber | `/` | Yeditepe'de erkek kuaförü | Hero + hizmetler | 5,0 ★ | WhatsApp |
| Yerel, mahalle | yeditepe berber, şahinbey berber | `/` | Mahallenizde, 21:00'e kadar | Konum | Adres + harita | Yol tarifi |
| Hizmet | sakal tıraşı gaziantep, damat tıraşı gaziantep | `/#hizmetler` | Tek koltukta saç-sakal-bakım | Kartlar | — | Hizmete özel WhatsApp |
| Marka | barber's town gaziantep | `/` | Resmî site | Tümü | NAP | Ara |

| Sayfa | Title (≤60) | Meta (≤155) | H1 | Slug |
|---|---|---|---|---|
| Ana sayfa | Barber's Town \| Erkek Kuaförü Yeditepe, Şahinbey Gaziantep (57) | (12'deki meta, ~140) | Yeditepe'de kırmızı halıyla karşılanan erkek kuaförü | `/barbers-town/` |
| KVKK | KVKK Aydınlatma Metni \| Barber's Town (37) | Barber's Town randevu formu ve iletişim kanallarında paylaşılan kişisel verilerin işlenmesine ilişkin aydınlatma metni. | KVKK Aydınlatma Metni | `/barbers-town/kvkk/` |

**Local SEO**
- NAP (tüm sayfalarda birebir): "Barber's Town Erkek Kuaför & Güzellik Merkezi · 7 Tepe Mahallesi, 85043 Nolu Cad. Maliyeci Ahmet Sitesi A Blok No:75/A İç Kapı No:1, 27000 Şahinbey/Gaziantep · 0535 729 43 33"
- Google Business: site yayına alınınca profildeki "Web sitesi ekleyin" alanına bu adres girilmeli; fotoğraf ve hizmet listesi profilde de doldurulmalı.
- Yorum stratejisi: koltuktan kalkan müşteriye WhatsApp'tan teşekkür + Haritalar yorum bağlantısı; yorumlara sahip olarak yanıt.
- Schema: `HairSalon` (ad, adres, geo, telefon, url, hasMap, priceRange yok) + `FAQPage`. **`aggregateRating` eklenmedi:** Google, işletmenin kendi sitesinde kendi hakkındaki puanı (self-serving review) yıldız olarak göstermiyor; yanlış kullanım işaretleme riski taşır.
- `sitemap.xml` (2 URL), canonical, `og:` etiketleri, `lang="tr"`.

**Ölçüm planı:** GA4 şimdilik kurulmadı (müşteri hesabı yok). Tüm CTA'lar `data-olay` niteliği taşır: `whatsapp_tik`, `telefon_tik`, `yol_tarifi_tik`, `randevu_form_gonder`, `yorum_tik`, `harita_yukle`. `js/site.js` içindeki `olay()` fonksiyonu `window.gtag` varsa olayı yollar; GA4 eklenirken çerez banner'ı ile yalnız onaydan sonra yüklenmeli.

## 14 — VISUAL INTELLIGENCE

**Mevcut görsel:** Haritalar kartındaki cephe fotoğrafı (377 px genişlik).
- Sınıf: ATTENTION + BRAND + PROOF (gerçek dükkân).
- Analiz: antrasit cephe, sıcak aplik ışıkları, kırmızı halı, oval siyah-beyaz tabela, gece çekimi.
- Kullanım kararı: **Sitede kullanılmadı.** Çözünürlük yetersiz (hero için ≥1600 px gerekir) ve fotoğrafı yükleyenin kim olduğu / kullanım hakkı bilinmiyor. Görsel dil (renk, ışık, kırmızı halı, oval logo) tasarıma aktarıldı.

**Tasarım dili (fotoğraftan türetilen):**
- Zemin: gece antrasiti `#141416`, yüzey `#1d1d21`
- Vurgu: aplik altını `#e3b04b`
- Kırmızı halı: `#b3202a` (ince şeritler, randevu vurguları)
- Metin: kırık beyaz `#f4f1ea`
- Logo: tabeladaki oval rozetin SVG yorumu (makaslı) — **temsili**, gerçek logo dosyası gelince değiştirilecek.
- Fotoğraf yerine: tipografi, ince altın çizgiler, CSS ile berber direği şeridi, ikonlar (satır içi SVG).

**Sayfa bazında görsel ihtiyacı ve SHOT LIST (müşteriden):**
| # | Konu | Açı / ışık | Kullanılacak yer | Sınıf |
|---|---|---|---|---|
| 1 | Cephe, akşam, tabela + kırmızı halı | Karşıdan, yatay, tabela ışıkları açık, ≥2000 px | Hero arka planı | ATTENTION / BRAND |
| 2 | İç mekân geniş açı (koltuklar, aynalar) | Köşeden, gün ışığı + iç ışık | Neden bölümü | PROOF |
| 3 | Usta iş başında (makas/makine yakın plan) | 45°, sığ alan derinliği | Hizmetler başlığı | PROCESS |
| 4 | 6–9 bitmiş kesim (fade, sakal hattı) — müşteri izinli | Arka plan sade, aynı ışık | Galeri (ileride) | PROOF |
| 5 | Damat hazırlığı (izinli) | Doğal, sıcak ton | Damat kartı | EMOTION |
| 6 | Logo vektör dosyası (SVG/AI/PDF) | — | Header, favicon | BRAND |

Stok görsel kullanılmadı → "temsili" işaretlenecek fotoğraf yok; yalnız logo "temsili".

---
## ✔ ÇIKIŞ KONTROL LİSTESİ — MODÜL 2
- [x] 10–14 başlıklarının beşi de dosyada var
- [x] Her sayfa için 8 alan dolu; gereksiz sayfa yok (tek sayfa + KVKK)
- [x] Internal linking planı var
- [x] KVKK / çerez gereksinimi belirlendi (KVKK gerekli, banner gerekmez)
- [x] Tüm sayfaların nihai metni yazıldı; kanıtsız iddia taraması yapıldı
- [x] Her sayfanın title, meta, H1, slug değeri var; local SEO ve schema planı var
- [x] Ölçüm olayları tanımlı
- [x] Görseller sınıflandı, SHOT LIST hazır, temsili öğe (logo) işaretli
- [x] `durum.md` güncellendi
