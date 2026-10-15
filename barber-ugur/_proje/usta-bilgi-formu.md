# Barber Uğur — "Ustamız" bölümü için bilgi formu

Sitede **gizli** bir "Ustamız" bölümü hazır (`index.html` → `<section id="usta" hidden>`). Strateji notunda usta adı, tecrübe ve kuruluş yılı **BİLİNMİYOR** olarak işaretli. Bu yüzden bölüm, aşağıdaki bilgiler dükkân tarafından verilene kadar yayına alınmaz. Hiçbir bilgi tahminle doldurulmaz.

## Dükkâna gönderilecek mesaj (WhatsApp'a kopyalayın)

> Merhaba, sitenize "Ustamız" bölümü ekliyoruz. Müşteriler kime emanet olduklarını görünce daha rahat randevu alıyor. Şu soruları kısaca cevaplar mısınız?
> 1. Sitede görünecek ad soyad (ya da yalnız ad)?
> 2. Kaç yıldır bu meslekte?
> 3. Bu dükkân hangi yıl açıldı?
> 4. Mesleğe nasıl başladınız, nerede / kimin yanında yetiştiniz? (2–3 cümle, kendi sözlerinizle)
> 5. En çok hangi işte iddialısınız? (ör. fade, sakal şekillendirme, anatomik kesim)
> 6. Sertifika, kurs belgesi, yarışma derecesi ya da sizden bahseden bir haber/video var mı? Varsa fotoğrafını veya linkini gönderin.
> 7. Aynanın önünde, iş başında bir fotoğrafınızı gönderebilir misiniz? (dikey, iyi ışıkta; müşterinin yüzü görünmesin)
> 8. Bu bilgilerin ve fotoğrafın sitede yayınlanmasına izin veriyor musunuz?

## Cevaplar gelince

| Alan | Nereye |
|---|---|
| 1 | `#usta-baslik` + fotoğrafın `alt` metni |
| 2, 3, 5 | `.usta__kunye` (Meslekte / açılış yılı / Uzmanlık) |
| 4 | `.usta__metin p` — ustanın kendi anlatımı, abartı sıfatı eklenmeden |
| 6 | `.usta__belgeler` — yalnız kanıtı (fotoğraf/link) olan maddeler; yoksa liste silinir |
| 7 | `img/usta.webp` (640×800, WebP, kişi onaylı) |
| 8 | **İzin yoksa yayına alınmaz.** |

Sonra: `hidden` özniteliğini silin, menüye `<a href="#usta">Ustamız</a>` ekleyin, sayfada hiç `[DOLDURULACAK` kalmadığını kontrol edin (`grep -n DOLDURULACAK barber-ugur/index.html` boş dönmeli).
