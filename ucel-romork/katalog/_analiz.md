# Üçel Ürün Kataloğu — mevcut PDF analizi ve yeni katalog notları

İncelenen dosya: `Üçel Tarım Aletleri Ürün Kataloğu.pdf` (Canva, 12 sayfa, A4, 27 MB)

## 1. Mevcut katalogda tespit edilenler

### Yapı ve sıralama
- **Sayfa sırası bozuk.** PDF'in fiziksel sırası: Kapak → 8 → 9 → 10 → 11 → 12 → 2 → 3 → 4 → 5 → 6 → 7. Baskıya ya da WhatsApp'a bu haliyle giderse okuyucu Pulluk'tan başlar.
- 12 sayfa var, kitapçık baskısı için sayfa sayısı 4'ün katı olmalı (12 uyuyor ama içerik eklenince 16 gerekecek).
- "C · Satıştan sonra da yanınızdayız" sekmesi var ama A ve B'deki gibi bir C bölüm sayfası yok.

### Görsel tutarlılık
- **Her ürün sayfası farklı bir şablonla yapılmış.** Başlık bantları, logo yerleşimi, ikon stili, yazı tipleri ve alt bant (QR / "Bizi arayın" / "Hemen WhatsApp" / "İletişime geçin") sayfadan sayfaya değişiyor.
- **Logo 4 farklı şekilde kullanılmış:** kapakta dişli içinde "ÜH" monogramı, arka kapakta dişli içinde "Ü", ürün sayfalarında başak + dişli, sayfa 11'de "UÇEL" (Ü noktaları yok, Ç'nin çengeli yanlış yerde).
- Sayfalar Canva'dan **düz resim olarak** çıkmış (yaklaşık 115 dpi). Baskı için en az 300 dpi gerekiyor; yazılar basılınca bulanık olur.
- Kapaktaki kırmızı-mavi-altın şerit güzel bir fikir ama başka hiçbir yerde tekrar edilmiyor.

### Görseller
- **Ürün görselleri yapay zekâ ile üretilmiş ve gerçek ürünlerle uyuşmuyor.** Katalogda siyah-altın römork ve siyah-altın loader var; Üçel'in gerçek ürünleri mavi, yeşil ve kırmızı. Görsellerdeki yazılar bozuk ("ÜÇEL JAAA LUUUEUR", "ÜÇEL İMALAYT", "UCCOCKA"). Müşteri teslimatta farklı bir ürün görünce güven kaybı olur.
- 7 ürünün 4'ünde (Tapan, Pulluk, Gübre serpme, Su tankeri) ana fotoğraf ya da sahadan fotoğrafı "eklenecek" yazılı boş kutu. Kapakta da "Kapak fotoğrafı eklenecek" duruyor; arka kapaktaki 3 QR kutusu boş, sayfa 11'de "QR KOD BURAYA" yazıyor.
- Oysa web sitesi için Üçel'in **gerçek fotoğrafları** zaten var (`ucel-romork/img/`): mavi/yeşil römorklar, kırmızı/mavi loader, Göksun kültivatör, kulaklı pulluk, su tankeri, gübre serpme.

### Metin ve yazım hataları
- Su tankeri: "Kapasite **(tl)**" → "(lt)" olmalı.
- Gübre serpme: "**Olçüler**" → "Ölçüler"; "SEÇENEKLER" başlığı üst üste binmiş; "Gereken traktör gücü" altında taşan çizgi.
- Tapan: Teknik tabloda ilk satırın ("Model") ve "Tapana özel" tablosunun ilk satırının etiketi eksik.
- Pulluk: "SAHADAN" etiketi bozuk görünüyor.
- Römork: "Lastik ebadı," sonunda fazladan işaret.
- Sayfa 11: "ÜRÜNÜ SEÇİN", "WHATSAPP'TAN YAZIN" başlıklarının arkasında silik ikinci kopyaları kalmış.
- Loader sayfası "Loader Kepçe", web sitesi "Ön Yükleyici (Kepçe)" diyor — aynı ürün iki isimle.

### İçerik
- **"Bilgi için iletişime geçin" 60'tan fazla kez tekrar ediyor.** Teknik tablolar dolu gibi görünüp hiçbir bilgi vermiyor; katalog bitmemiş izlenimi bırakıyor.
- Web sitesindeki tesviye küreği ve döner ot tırmığı katalogda yok; katalogdaki Tapan sitede yok.
- Güçlü yanlar korunmalı: kısa ve sıcak dil ("Tarlada da, yolda da sağlam iş."), A (imalat) / B (satış) ayrımı, "3 adımda fiyat alın", hizmetler (ikinci el, takas, özel imalat, yedek parça), "Listede yoksa sorun".

## 2. Yeni katalogda yapılanlar (`katalog/`)

| Konu | Eski | Yeni |
|---|---|---|
| Sayfa sırası | Karışık | Düzgün, 16 sayfa (kitapçık baskısına uygun) |
| Şablon | Her sayfa farklı | Tüm ürün sayfaları aynı düzen: başlık bandı → ad + rozet → büyük fotoğraf → teknik tablo / ne işe yarar / seçenekler → sahadan → alt bant |
| Renk | Soğuk siyah + altın | Sıcak krem zemin, espresso kahve, hasat altını; kırmızı-mavi-altın şerit (Üçel ürünlerinin renkleri) imza öğesi olarak her yerde |
| Görseller | Yapay zekâ + boş kutular | Üçel'in gerçek fotoğrafları; her fotoğrafta "Gerçek fotoğraf" notu. Yalnızca Tapan'da eski katalogdaki görsel "Temsili görsel" etiketiyle |
| QR | Boş / "QR KOD BURAYA" | Gerçek QR'lar. Her ürün sayfasındaki QR, WhatsApp'ı o ürünün adı yazılı mesajla açar. Arka kapakta WhatsApp, Konum, Web sitesi |
| Teknik tablo | 60+ kez "Bilgi için iletişime geçin" | Bilinen değerler yazılı (Yaylı ayak, Kulaklı tip, 4 gövde), bilinmeyenler kısaca "Modele göre" + tek açıklama satırı |
| Yeni sayfalar | — | "Hoş geldiniz + içindekiler", "Hangi iş için hangi alet?" (sezon rehberi), "Sahadan" galerisi, "Bize yazarken bunları ekleyin" doldurulabilir not formu |
| Dosya | 27 MB, 115 dpi resim | 4 MB, yazılar vektör (her ölçüde net) |

## 3. Üçel'den beklenenler (katalog bunlarla tamamlanır)
1. **Logo dosyası** (vektör: AI, SVG ya da PDF). Şu an geçici bir dişli + Ü amblemi kullanılıyor.
2. **Tapan fotoğrafı** (gerçek ürün) — şu an temsili görsel var.
3. Pulluk, gübre serpme ve su tankeri için daha net, sade arka planlı birer fotoğraf (varsa).
4. Teknik değerler: römork kapasitesi/kasa ölçüsü, kültivatör ayak sayısı ve genişliği, loader kaldırma kapasitesi, tanker hacmi vb. Gelen her değer `_kaynak/katalog.mjs` içinde ilgili satıra yazılır, "Modele göre" kendiliğinden kalkar.
5. Teyit: Gübre serpme ve su tankeri gerçekten bayi ürünü mü? (Fotoğraflarda ÜÇEL yazısı var.) Çalışma saatleri "Her gün 08:00–19:00" doğru mu?

## 4. Yeniden üretme
```
python3 ucel-romork/_kaynak/katalog_qr.py      # QR kodları (pip install segno)
python3 ucel-romork/_kaynak/katalog_gorsel.py  # fotoğraflar (JPEG)
node ucel-romork/_kaynak/katalog.mjs --pdf     # index.html + Ucel-Katalog-2026.pdf
```
