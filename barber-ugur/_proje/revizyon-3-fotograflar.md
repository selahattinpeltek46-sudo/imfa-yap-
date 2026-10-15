# REVİZYON 3 — Dükkânın kendi fotoğrafları

Tarih: 2026-10-15 · Tetikleyici: kullanıcı 4 fotoğrafı tekrar gönderdi (bu kez dosya olarak ulaştı) ve adresi yazılı olarak teyit etti.

## Adres
"Mücahitler, Gazi Muhtar Paşa Blv. Gazi Apartmanı No:46/E, 27090 Şehitkamil/Gaziantep" — Haritalar kartıyla birebir; sınıf: DOĞRULANMIŞ + KULLANICI BİLGİSİ. Sitede değişiklik gerekmedi.

## Görseller
| Dosya | Kaynak | İşlem | Kullanım | Sınıf (14) |
|---|---|---|---|---|
| `img/cephe-gece.webp` (662×813) | Gece cephe | Vitrin camındaki **kişiler yumuşak maskeyle bulanıklaştırıldı** (buzlu cam etkisi); tabela, tente, oturma grubu net | Açılış (vitrin bölmesi) | ATTENTION / BRAND / PROOF |
| `img/ic-genis.webp` (1206×639) | İç mekân geniş açı | Kişi yok, olduğu gibi | "İçeride" büyük kare; OG görseli | PROOF / EMOTION |
| `img/ic-duvar-resmi.webp` (1219×637) | Duvar resmi + 3 istasyon | Kişi yok, olduğu gibi | "İçeride" | PROOF |
| `img/ic-altin-aynalar.webp` (530×813) | Cadde tarafı altın LED aynalar | Soldaki dış mekân kişisi ve sağdaki siyah şerit kırpıldı | "İçeride" | PROOF |
| `img/og.png` (1200×630) | ic-genis + tabela tipografisi | Yeniden üretildi | WhatsApp / sosyal paylaşım önizlemesi | CONVERSION |
Kullanılmayan: ayna selfie'si (müşteri ve çalışan yüzleri).

## Sayfa değişiklikleri
- Açılış: vitrin 2 sütun → sol: tanıtım + CTA, altında künye; sağ: gece cephe fotoğrafı (2 satır boyu). Mobilde metin → foto (4:5) → künye.
- Yeni bölüm `#iceride` (koyu): "İçeride" + 1 geniş + 2 kare fotoğraf, kısa altyazılar; menüye "İçeride".
- Schema `image` dizisine gerçek fotoğraflar eklendi.
- Grid sütunları `minmax(0, …)` (resimlerin min-content genişliği 1366'da 148 px taşma yapıyordu → 0).

## Test
Taşma 1366 / 375: 0 / 0 · tek H1 · alt metinsiz `<img>` 0 · JSON-LD geçerli · konsol hatası 0 · randevu uçtan uca 26/26 · hatırlatma 18/18.

## Açık soru (kapandı sayılmadı)
İki iç mekân görünümü (beyaz tuğla duvarlı bölüm / gri duvarlı altın LED bölüm) aynı dükkânın iki alanı olarak sunuldu; kullanıcı fotoğrafları birlikte bu dükkân için gönderdi [VARSAYIM: aynı dükkân, iki bölüm].
