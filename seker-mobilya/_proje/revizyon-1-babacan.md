# Revizyon 1 — Babacan Mobilya düzeni — 2026-10-20

**İstek (kullanıcı):** "Gayet iyi ama aynı Babacan Mobilya gibi hero kısmı ve diğer bölümler harika olsun."

**Örnek alınan:** `selahattinpeltek46-sudo/babacan-mobilya` düzeni — repoda aynı gün Aytaç Mobilya'ya uygulanmış hâli (`aytac-mobilya/_proje/revizyon-2-profesyonel.md`) bölüm bölüm incelendi. **Yapı alındı; içerik kopyalanmadı** (Babacan'ın "ücretsiz keşif", çalışma saati, kurucu hikâyesi yok). Renkler Şeker'in kendi işlerinden: koyu ceviz (#1C1713), kırık beyaz lake, açık gri lake paneli, gizli şerit ışığın sıcak altını (#DCAE5C).

## Kaldırılanlar
- Fotoğraf üstündeki numaralı detay noktaları (kural: fotoğrafın üstüne metin/işaret konmaz; detay yanında anlatılır).
- Üzerinde yazı olan 22 Reels kapağı ve "işe başladığımız gün" kareleri (hepsinin üstünde sonradan eklenmiş yazı vardı). Sitede yalnız **yazısız 25 gerçek kare** kaldı.
- Eski kolaj + çıtalı panel arka planı, oda dizini, yuvarlak düğmeler (yerine Babacan'ın düz dikdörtgen düğmeleri + ok).

## Yeni ana sayfa (bölüm sırası)
1. Şeffaf üst çubuk (kaydırınca dolar) + **tam genişlik giriş**: 12 gerçek işten fotoğraf duvarı (masaüstü 6×2, telefon 3×4; her kare doğal boyutuna yakın), koyu perde, ön başlık, serif H1, iki düğme.
2. Güven şeridi (4 madde, çizgi simgeler): Ölçüye özel · Tek ekip · Yenibosna'da adres · Google'da 4,9 / 93.
3. "Siz hangi ihtiyaçtasınız?" — 4 başlangıç (odayı baştan, banyo yenileme, tek köşe, fiyat); her biri mesaj hazırlayıcıda tür ve kapsamı önceden seçer.
4. Çözümlerimiz — 6 numaralı kart (fotoğraf, özet, "Bu iş için yazın", örnek sayısı).
5. "Odanızı bize gösterin." bandı.
6. Koyu süreç bandı — 5 adım.
7. İşçilik — büyük fotoğraf + özellik tablosu (Yüzey, Panel, Aydınlatma, Ayna — yalnız fotoğrafta görülenler) + 3 detay fotoğrafı ("Neden önemli?").
8. "Yaptığımız işler konuşsun." — kategori kategori yatay kaydırmalı satırlar.
9. Konum — adres tablosu (adres, plus code, telefon, Instagram, Google, çalışma saati notu) + tıkla-yükle harita.
10. SSS (7 soru, FAQPage).
11. Koyu kapanış + mesaj hazırlayıcı ("Gidecek mesaj" önizlemesi).
12. 4 sütunlu koyu alt bilgi.

## Hizmet sayfaları
Koyu giriş bandı (kırıntı, ön başlık, H1, iki düğme, 3 hücreli bilgi şeridi, 2 fotoğraflı kolaj) → "Kurduğumuz …" gerçek proje ızgarası (alt yazılı) → "Bu işlerde neler var" + **"Ölçü gününden önce hazırlayabilecekleriniz"** (sayfaya özel 5 madde — yeni, faydalı, özgün içerik) → SSS (3–4 soru) → koyu kapanış + mesaj → "Evin diğer odaları" kartları.

## SEO
- İşletme şemasına `makesOffer` (6 hizmet), ana sayfaya FAQPage (7 soru), sayfalara `geo.*` meta ve `max-image-preview:large`.
- Her hizmet sayfasına hazırlık listesi + ek SSS → daha fazla özgün metin.
- OG görseli yeni girişin 1200×630 ekran görüntüsü (`testler/og.js`); `og.html` kaldırıldı.

## Görsel boyutu
Ekran kaydı kareleri 348 px → çözüm kartları ve detay fotoğrafları 348 px sütunla sınırlandı (önceden ~372 px'e büyüyordu). Test 1366 / 900 / 375 px'te hiçbir görselin 362 px'ten geniş gösterilmediğini kontrol ediyor.

## Test
`testler/test.js` — 8 sayfa × 3 genişlik + etkileşim: **467/467 geçti**. Yeni kontroller: WhatsApp düğmesinin okunurluğu (ilk ekran görüntüsünde beyaz üstüne beyaz çıkmıştı → düzeltildi), "TV" kelimesinin mesajda küçülmemesi (Python ve JS aynı kural), şeffaf üst çubuğun kaydırınca dolması, kart/ihtiyaç bağlantılarının mesajı önceden doldurması, kaydırmalı satırdaki tembel görsellerin yüklenmesi, kaldırılan Reels karelerinin hiçbir sayfada kalmaması.

## Müşteriden (değişmedi + 1 yeni)
Önceki 7 madde geçerli (`modul-4-denetim-teslim.md`). **Yeni:** petek kapama ve genç odası işlerinin **yazısız** fotoğrafları — şu an bu iki işin yalnız yazılı Reels kapakları var, bu yüzden sitede fotoğrafla gösterilemiyor.
