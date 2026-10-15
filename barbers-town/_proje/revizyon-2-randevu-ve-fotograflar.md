# REVİZYON 2 — Gerçek fotoğraflar, doğrulanmış hizmetler ve online randevu sistemi

Tarih: 2026-10-15 · Tetikleyici: kullanıcı salon fotoğraflarını gönderdi ve "randevu konusu çok önemli — form nasıl olacak, nasıl çalışacak, nasıl kontrol edilecek" diye sordu.
Not: Arada gönderilen "Vedat Sezgin Exclusive Hair Salon" fotoğrafı kullanıcı tarafından "bu projeye ait değil" denildi → kullanılmadı.

## Yeni DOĞRULANMIŞ bilgiler (fotoğraflardan)
| Bilgi | Kaynak | Önceki durum → yeni |
|---|---|---|
| Hizmetler: VİP Salon, Lazer Epilasyon, Özel Cilt Bakım, Saç Sakal Kesim, Kozmetik Ürünler, Anatomik Saç Kesim | Salon içi ışıklı hizmet tabelası + dış cephe tabelası | [VARSAYIM] 6 hizmet (çocuk, damat…) → **tabeladaki liste**; çocuk tıraşı ve damat tıraşı sitede kaldırıldı |
| Halil Yeter · Mehmet Yeter | Dış cephe tabelası (isimler + 0535 729 43 33) | BİLİNMİYOR → footer'a eklendi (rol bilinmiyor, "usta/sahip" denmedi) |
| Telefon 0535 729 43 33 | Dış cephe tabelası | Haritalar + tabela ile çift doğrulandı |
| Gerçek logo: taçlı, çapraz makaslı, ustura, yıldız, "BARBER'S TOWN" kurdele | Salon duvarı | Temsili SVG → header'da dış cephe oval tabelası (o da gerçek), galeri'de iç logo fotoğrafı |
| İç mekân: altın LED çerçeveli aynalar, siyah berber koltukları, çizgili LED duvar paneli | Salon fotoğrafı | Hero görseli |
| Bekleme salonu (chesterfield koltuklar), teras, Türk kahvesi servisi, "Günün Sözü" panosu | 3 fotoğraf | "Bekleme salonu ve teras" maddesi (kahve "ikram politikası" olarak iddia edilmedi) |
| Lazer epilasyon cihazlı ayrı bakım odası | Fotoğraf (sohbette görüldü, dosya olarak ulaşmadı) | Kart metni "ayrı odada" |

## Görsel kararları
| Dosya | Kaynak | Kırpma gerekçesi |
|---|---|---|
| `img/salon.webp` (hero) | iç mekân | Soldaki çocuk ve müşteri kadraj dışı bırakıldı |
| `img/ikram.webp` | kahve + günün sözü + teras | Kişi yok |
| `img/urun-rafi.webp` | ürün rafları | Alttaki kişilerin yüzleri kırpıldı |
| `img/logo-duvar.webp` | logo duvarı | Altındaki kişiler kırpıldı |
| `img/hizmet-tabelasi.webp` | hizmet tabelası | Alttaki kişi kırpıldı |
Kullanılmayanlar: kişilerin (özellikle çocukların) yüzünün göründüğü kareler — açık rıza olmadan yayımlanmaz. Sohbette görülen dış cephe (gece, kırmızı halı), lazer odası, tatlı/soğuk kahve ve ikinci logo fotoğrafları sohbetten dosya olarak alınamadı → repoya eklenmesi istendi. Tatlı/soğuk kahve görseli stüdyo/üretilmiş görünümlü; gerçek ikram kanıtı gibi kullanılmamalı.

## Online randevu sistemi — karar
| Seçenek | Artı | Eksi | Karar |
|---|---|---|---|
| A. Sadece WhatsApp mesajı (önceki) | Kurulum yok | Boş saat görünmez, çift rezervasyon kontrolü yok, salon her mesaja tek tek cevap verir | Yedek mod olarak kaldı |
| B. Fresha / Booksy vb. hazır platform | Hazır panel | Abonelik/komisyon, marka dışı sayfa, müşteri verisi platformda | Önerilmedi |
| **C. Google Apps Script + Google Takvim + E-Tablo** | Ücretsiz, salon zaten telefonda Google Takvim kullanabilir, sunucu yok, GitHub Pages ile uyumlu, çift rezervasyon kilidi | Bir kez 15 dk kurulum (salonun Google hesabıyla) | **Seçildi** |

Akış, yönetim ve kurulum: `randevu-sistemi/KURULUM.md`. Kod: `randevu-sistemi/Code.gs` (yayın dışı `_proje` altında).

### Form
1. Hizmet (5 seçenek; hizmet kartındaki "Randevu al" önceden seçer) → 2. Gün çipleri (bugün + 21 gün) → 3. Boş saat çipleri (sunucudan) → Ad soyad, cep telefonu, not, KVKK onayı, gizli spam tuzağı → "Randevuyu Onayla" → sonuç ekranı: hizmet, gün, saat, **randevu kodu**, "Takvimime ekle" (Google Takvim), WhatsApp.
Sunucu adresi yoksa veya ulaşılamazsa form kendiliğinden WhatsApp moduna geçer (buton ve açıklama metni değişir).

### Test sonuçları
- `Code.gs` saf fonksiyon testleri (Node): kapasite, süre çakışması, KAPALI blokları, bugün için en erken saat, kapalı gün, ileri tarih sınırı, telefon biçimleri, spam tuzağı → **tümü geçti**.
- Uçtan uca (Playwright, sahte sunucu = gerçek Code.gs mantığı):
  - Boş gönderim: 6 alan hatası ✅
  - WhatsApp modu mesajı: ad, telefon, hizmet, gün, saat, not ✅
  - API modu: randevu alındı, kod gösterildi ✅ · aynı saate 2. koltuk randevusu alındı ✅ · 3. müşteride 10:00 listeden düştü ✅
  - Eşzamanlılık: liste açıkken saat başkası tarafından doldu → "Bu saat az önce doldu", liste yenilendi ✅
  - Sunucu çökük → WhatsApp moduna geçiş + bilgi mesajı ✅
  - 375 px / 1366 px yatay taşma 0, tek H1, alt metinsiz görsel yok, konsol hatası yok ✅

## Audit (revizyon 2)
| # | Sınıf | Önem | Bulgu | Durum |
|---|---|---|---|---|
| R1 | FACT | YÜKSEK | Önceki hizmet listesi varsayımdı (çocuk, damat) | ✅ tabeladaki listeyle değiştirildi |
| R2 | EVIDENCE | YÜKSEK | Çocuk yüzü içeren fotoğraflar | ✅ kırpıldı / kullanılmadı |
| R3 | CONVERSION | YÜKSEK | Randevu kontrolü yoktu | ✅ online sistem + yönetim kılavuzu |
| R4 | TECHNICAL | ORTA | Sistem canlı değil (salonun Google hesabı gerekir) | ⚠️ kurulum adımı salona ait; o zamana kadar WhatsApp modu |
| R5 | FACT | ORTA | Açılış saati, koltuk sayısı, hizmet süreleri | ⚠️ [VARSAYIM] — KURULUM.md §5 |
| R6 | LEGAL | ORTA | Veriler artık Google'da saklanıyor | ✅ KVKK metni güncellendi (yurt dışı aktarım notu) — hukuki kontrol gerekir |
| R7 | VISUAL | DÜŞÜK | Kaynak fotoğraflar ~680 px; büyük ekranda yumuşak | ⚠️ orijinal çözünürlük istenmeli |
