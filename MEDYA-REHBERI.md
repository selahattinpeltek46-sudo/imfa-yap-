# Fotoğraf ve Video Rehberi

Siteler GitHub Pages üzerinde yayınlanıyor. Bu sayfa, yer ve trafik sınırlarına takılmadan fotoğraf ve video eklemek için gereken her şeyi anlatıyor.

## Sınırlar

| Sınır | Değer |
|---|---|
| Yayınlanan sitenin toplam boyutu | 1 GB |
| Tek dosya (git ile) | 100 MB |
| Tek dosya (GitHub web sitesinden yükleme) | 25 MB |
| Aylık trafik (esnek sınır) | 100 GB |

## Otomatik olarak yapılanlar

Her yayında `scripts/build-site.py` çalışır ve şunları yapar:

- **Siteye sadece sayfalarda kullanılan fotoğraf ve videoları koyar.** Ham fotoğraflar (ör. `raw-fotograflar/`), ekran görüntüleri ve yedek videolar repoda durabilir. Bunlar yayına çıkmaz, 1 GB'lık yerden yemez.
- **Kırık bağlantı varsa yayını durdurur.** Bir sayfa var olmayan bir dosyayı gösteriyorsa site bozuk hâliyle yayınlanmaz. Hata mesajı GitHub'daki **Actions** sekmesinde görünür.
- **Boyutu kontrol eder.** 20 MB'tan büyük dosyalarda ve site 700 MB'ı geçince uyarı verir. 950 MB'ın üstünde yayını durdurur.
- `images/` ve `assets/` klasörlerindeki HTML taslakları yayınlanmaz.

Bilgisayarda aynı kontrolü çalıştırmak için:

```
python3 scripts/build-site.py
```

## Yeni fotoğraf eklerken

1. **Format:** `.webp` (en iyisi) ya da `.jpg`. PNG kullanmayın. Aynı fotoğraf PNG'de 10–15 kat daha büyük oluyor.
2. **Boyut:** En uzun kenar en fazla **1920 piksel** olsun. Hedef dosya boyutu **300 KB'ın altı**.
   Ücretsiz dönüştürücü: <https://squoosh.app> (WebP seçin, kaliteyi 80 yapın).
3. **Dosya adı:** Küçük harf, Türkçe karakter ve boşluk olmasın.
   Örnek: `mutfak-beyaz-klasik-1.webp`. `WhatsApp Image 2026-...jpeg` gibi adlar kullanmayın.
4. `<img>` etiketine `loading="lazy"` ekleyin. Sayfanın en üstündeki büyük görselde eklemeyin.

## Yeni video eklerken

1. **Kısa tutun:** 10–20 saniye yeterli.
2. **Küçültün:** 720p, H.264 (`.mp4`), sesi gerekmiyorsa sessiz. Hedef boyut **5 MB'ın altı**.
   Ücretsiz araç: HandBrake, "Fast 720p30" ayarı.
3. **Kapak görseli ekleyin:** Videodan bir kare alıp `poster-...jpg` olarak kaydedin.
4. **Sayfaya geç yüklenecek şekilde koyun.** Videonun, ziyaretçi o bölüme gelince inmesi için:

   ```html
   <video data-lazy-src="assets/video-adi.mp4" poster="assets/poster-video-adi.jpg"
          muted loop playsinline preload="none"></video>
   ```

   `autoplay` ile `src=` kullanmayın. Bu şekilde her ziyarette video baştan iner ve aylık 100 GB trafik hızla dolar.

5. **Uzun ya da çok sayıda video** (tanıtım filmi, röportaj vb.) varsa YouTube'a yükleyip sayfaya gömün. Bunlar hiçbir sınırı etkilemez.

## Bilinmesi gerekenler

- Repodan silinen dosya git geçmişinde kalır. Yani repo küçülmez. Bu yüzden büyük dosyaları **yüklemeden önce** küçültün.
- Yayın boyutunu görmek için: GitHub → **Actions** → son "Deploy to GitHub Pages" çalışması → "Build site" adımı.
