# Revizyon 2 — Profesyonel tasarım (Babacan Mobilya düzeni) — 2026-10-20

**İstek (kullanıcı):** "Bu siteyi Babacan Mobilya sitesi gibi tam profesyonel bir tasarıma kavuşturalım: görünüm, tasarım, SEO, içerik ve hero. Bazı görsellerde sonradan eklenmiş gibi yazılar var, onları kaldıralım; basit duruyor."

**Örnek alınan:** `selahattinpeltek46-sudo/babacan-mobilya` (yerelde açılıp bölüm bölüm incelendi). Yapı alındı; metinler Aytaç'ın doğrulanmış bilgileriyle yeniden yazıldı (Babacan'daki "ücretsiz keşif", çalışma saati, kurucu hikâyesi gibi Aytaç için bilinmeyen bilgiler **kopyalanmadı**).

## Kaldırılanlar
- Fotoğrafların üstündeki işaret etiketleri ("dolap altı şerit ışık" vb.) ve ölçü çizgisi yazıları — kullanıcı "sonradan eklenmiş gibi, basit" buldu. Fotoğrafların kendisinde yazı yok (41 kare tek tek kontrol edildi).
- Antet kutusu, mono yazı tipi, LED çizgili düğmeler (yerine sade dikdörtgen + ok).

## Yeni ana sayfa (bölüm sırası)
1. Şeffaf üst çubuk (kaydırınca dolar) + **tam genişlik giriş**: 12 gerçek işten fotoğraf duvarı (masaüstü 6×2, telefon 3×4 — her kare doğal çözünürlüğe yakın, bulanıklaşmıyor), koyu perde, ön başlık, serif H1, iki düğme.
2. Güven şeridi (4 madde, çizgi simgeler): Yerinde ölçü · Proje ve çizim · Kendi imalatımız · Google 5,0 / 131.
3. "Siz hangi ihtiyaçtasınız?" — 4 başlangıç (yeni ev, yenileme, tek köşe, fiyat); her biri mesajı önceden doldurur.
4. Çözümlerimiz — 6 numaralı kart (fotoğraf, açıklama, "Bu iş için yazın", gerçek örnek sayısı).
5. "Odanızı bize gösterin." bandı.
6. Koyu süreç bandı — 5 adım.
7. İşçilik — büyük fotoğraf + özellik tablosu (Yüzey, Aydınlatma, Kulp, Ölçü — yalnız fotoğrafta görülenler) + 3 detay fotoğrafı ("Neden önemli?").
8. "Yaptığımız işler konuşsun." — kategori kategori yatay kaydırmalı satırlar.
9. Konum — adres tablosu + fotoğraf.
10. SSS (7 soru).
11. Koyu kapanış bölümü + mesaj hazırlayıcı.
12. 4 sütunlu koyu alt bilgi.

## Hizmet sayfaları
Koyu giriş bandı (kırıntı, ön başlık, H1, düğmeler, 3 hücreli bilgi şeridi, 2 fotoğraflı kolaj) → gerçek projeler ızgarası → "Bu işlerde neler var" + **"Ölçü gününden önce hazırlayabilecekleriniz"** (yeni, sayfaya özel, faydalı içerik) → SSS (2–4 soru, şemada) → kapanış → "Evin diğer odaları" kartları.

## SEO
- Her hizmet sayfasına sayfaya özel hazırlık listesi ve ek SSS → daha fazla özgün metin, FAQPage zenginleşti.
- İşletme şemasına `makesOffer` (5 hizmet), sayfalara `geo.*` meta, `max-image-preview:large`.
- OG görseli yeni girişin ekran görüntüsü (`testler/og.js`); eski `og.html` kaldırıldı.

## Test
`test.js` (7 sayfa × 1366/375 px) ve `etkilesim.js` geçti. Kaydırmalı satırlardaki 27 tembel görselin görünür olunca yüklendiği ayrıca doğrulandı.
