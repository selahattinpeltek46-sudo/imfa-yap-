# Üçel — Sosyal medya ve otomatik mesaj kiti

Amaç: Instagram, Facebook, Marketplace ve TikTok'tan gelen herkesi **tek web kataloğa**, oradan da
**hazır bir WhatsApp mesajına** götürmek. Metinler katalogdaki onaylı metinlerle aynı dili kullanır.

> Fiyat yazan yerlerde `[FİYAT]` bırakıldı: işletmenin kendi güncel fiyatı yazılır. Fiyat uydurulmaz.

---

## 1. Bağlantılar (her platforma kendi bağlantısı)

Bu bağlantıdan gelen kişi WhatsApp'a bastığında mesajı **(Instagram)**, **(TikTok)** gibi bir etiketle başlar.
Böylece hangi platformun müşteri getirdiği mesajlara bakarak görülür.

| Nerede | Bağlantı |
|---|---|
| Instagram (biyografi, mesaj) | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=ig |
| Facebook sayfası / Messenger | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=fb |
| Facebook Marketplace | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=mp |
| TikTok (profil) | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=tt |
| WhatsApp (durum, mesaj) | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=wa |
| Basılı QR (broşür, tabela) | https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=qr |

Neden PDF değil de bu bağlantı? Instagram ve Facebook'un uygulama içi tarayıcısı PDF'i çoğu zaman açamaz
(boş sayfa ya da inmeyen dosya). Web katalog anında açılır. PDF yine sayfanın en altında indirilebilir.

---

## 2. Instagram

**Biyografi** (150 karakter sınırı):
```
🚜 Römork · Kültivatör · Loader Kepçe imalatı
📍 Göksun Sanayi Sitesi / Kahramanmaraş
🚚 Türkiye'ye gönderim
📞 0532 480 30 51
```
Biyografi bağlantısı: `https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=ig`

**Otomatik karşılama mesajı** (Meta Business Suite → Gelen Kutusu → Otomasyonlar → Anında yanıt):
```
Merhaba, Üçel Tarım Aletleri'ne hoş geldiniz 👋
Bütün ürünlerimiz burada: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=ig

Size uygun modeli ve fiyatı hemen iletelim. Lütfen yazın:
1) Hangi ürün?  2) Traktörünüz ve HP  3) İl / ilçe
📞 0532 480 30 51
```

**Kayıtlı yanıtlar** (Ayarlar → İşletme → Kayıtlı yanıtlar; mesajda `/` yazınca çıkar):

| Kısayol | Metin |
|---|---|
| `/fiyat` | `[ÜRÜN] için güncel fiyatımız: [FİYAT]. Fiyat [TARİH] tarihinde geçerlidir. Traktörünüzü ve il/ilçenizi yazarsanız gönderim seçeneğini de iletelim.` |
| `/katalog` | `Bütün ürünlerimiz ve fotoğrafları: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=ig` |
| `/uygun` | `Size uygun modeli seçmemiz için traktörünüzün markasını, beygir gücünü (HP) ve yapacağınız işi yazar mısınız?` |
| `/konum` | `Göksun Sanayi Sitesi, Yeni Mah., 46660 Göksun/Kahramanmaraş. Her gün 08:00–19:00. Yol tarifi: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/#iletisim` |
| `/gonderim` | `Türkiye geneline gönderim yapıyoruz. Şehrinizi yazın, nakliye seçeneğini birlikte belirleyelim.` |
| `/takas` | `Eski makinenizin fotoğrafını ve durumunu buradan gönderin; değerlendirip takas ya da satış seçeneğini konuşalım.` |
| `/whatsapp` | `Fotoğraf ve video göndermek için WhatsApp'tan devam edelim: wa.me/905324803051` |

**Sabitlenmiş gönderi önerisi** (profilin en üstünde 3 gönderi):
1. Genel katalog kartı (`cikti/sosyal/dikey/katalog.jpg`)
2. Römork kartı
3. Kültivatör ya da loader kepçe kartı

Gönderi açıklaması:
```
Göksun'da üretiyoruz, Türkiye'ye gönderiyoruz.
Fiyat ve size uygun model için WhatsApp: 0532 480 30 51
Bütün ürünler: profildeki bağlantı 👆
```

---

## 3. Facebook sayfası ve Messenger

Karşılama mesajı Instagram'dakiyle aynı, bağlantı `?k=fb`.

**Sık sorulan sorular butonları** (Meta Business Suite → Otomasyonlar → Sık sorulan sorular; menü adları
sürüme göre değişebilir, yerini işletme sahibi kontrol etsin). En fazla 4 soru önerilir:

| Buton | Otomatik cevap |
|---|---|
| 💰 Fiyat öğrenmek istiyorum | `Hangi ürün için fiyat istiyorsunuz? Traktörünüzü ve il/ilçenizi de yazarsanız güncel fiyatı ve gönderim seçeneğini birlikte iletelim. Ürünler: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=fb` |
| 🚜 Ürünleri görmek istiyorum | `Bütün ürünlerimiz fotoğraflarıyla burada: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=fb` |
| 📍 Neredesiniz? | `Göksun Sanayi Sitesi, Kahramanmaraş. Her gün 08:00–19:00. Türkiye geneline gönderim yapıyoruz.` |
| 🔁 Takas / ikinci el | `Eski makinenizin fotoğrafını gönderin, değerlendirelim. Takas ya da satış seçeneğini birlikte konuşalım.` |

---

## 4. Facebook Marketplace ilanı

Her ürün için ayrı ilan; görsel olarak `cikti/sosyal/kare/<ürün>.jpg` + gerçek fotoğraflar.

**Başlık kalıbı:** `[Ürün adı] · Göksun imalatı · Türkiye'ye gönderim`
Örnek: `Tarım Römorku · Göksun imalatı · Türkiye'ye gönderim`

**Açıklama kalıbı** (katalogdaki onaylı metinlerle):
```
[Fayda cümlesi]
[Tanım]

Nerede kullanılır: [kullanım alanları]
Kimler için: [kimler için]

✔ [Neden Üçel 1]
✔ [Neden Üçel 2]

Fiyat: [FİYAT] ([TARİH] itibarıyla)
Size uygun modeli seçmek için traktörünüzü ve HP değerini yazın.
Bütün ürünler: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=mp
📞 0532 480 30 51 · Göksun / Kahramanmaraş
```
Römork örneği:
```
Ürününüzü, yeminizi, odununuzu tek römorkla taşıyın.
Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar Göksun'daki atölyemizde üretiyoruz.

Nerede kullanılır: tarla ürünü, gübre ve yem, odun ve malzeme, hayvancılık
Kimler için: ürün taşıyan, hayvancılık yapan, gübre ve yem nakli olan çiftçiler için.

✔ Kasa rengini ve yazısını isteğinize göre yapıyoruz
✔ Standart dışı ölçüde özel imalat

Fiyat: [FİYAT] ([TARİH] itibarıyla)
Bütün ürünler: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=mp
📞 0532 480 30 51 · Göksun / Kahramanmaraş
```

---

## 5. WhatsApp Business

**Karşılama mesajı** (Ayarlar → İşletme araçları → Karşılama mesajı):
```
Merhaba, Üçel Tarım Aletleri 👋
Ürünlerimiz: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=wa
Hangi ürünle ilgileniyorsunuz? Traktörünüzü ve HP değerini de yazarsanız uygun modeli ve fiyatı hemen iletelim.
```

**Uzaktayım mesajı** (çalışma saati dışı, 19:00–08:00):
```
Mesajınız bize ulaştı, sabah 08:00'den itibaren dönüş yapacağız.
Bu arada bütün ürünlerimize buradan bakabilirsiniz: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=wa
```

**Hızlı yanıtlar:** Instagram'daki `/fiyat`, `/katalog`, `/uygun`, `/konum`, `/gonderim`, `/takas` metinlerinin aynısı.

**WhatsApp Katalog** (İşletme araçları → Katalog; ürün başına en fazla 10 görsel; WhatsApp ürünleri birkaç gün içinde onaylar):

| Alan | Ne yazılır |
|---|---|
| Ürün adı | Katalogdaki ad (ör. Tarım Römorku) |
| Fiyat | Varsa `[FİYAT]`; yoksa boş bırakılır |
| Açıklama | Fayda cümlesi + tanım + kimler için |
| Bağlantı | `https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/#romork` gibi ürünün kendi bölümü |
| Ürün kodu | Model kodu kararından sonra |
| Görseller | `cikti/sosyal/kare/<ürün>.jpg` + gerçek fotoğraflar |

Katalog bağlantısı: `https://wa.me/c/905324803051` (WhatsApp Business katalog açıldıktan sonra çalışır).

---

## 6. TikTok

**Profil:**
```
Göksun'da tarım aleti imalatı 🚜
Römork · Kültivatör · Loader Kepçe
📞 0532 480 30 51
```
Profil bağlantısı: `https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/?k=tt` (TikTok'ta profil bağlantısı hesap türüne göre açılır.)

**Yorumlara cevap kalıbı:**
`Fiyat ve size uygun model için WhatsApp: 0532 480 30 51. Bütün ürünler profildeki bağlantıda 👆`

**Video fikirleri** (yalnızca gerçek çekim):
- Teslimat günü: römork traktöre bağlanıyor, müşteriye yola çıkıyor (müşteri izniyle)
- Atölyede kaynak / boya, 15 saniye
- Kültivatör tarlada çalışırken
- Loader kepçe yükleme yaparken

---

## 7. Fiyat mesajı nasıl yazılmalı?

Fiyatı tek başına göndermek yerine üç bilgiyle birlikte göndermek güven verir ve konuşmayı sürdürür:
```
[Ürün / model]: [FİYAT]
Fiyat [TARİH] tarihinde geçerlidir, [KDV / teslim bilgisi].
Size en uygun modeli seçmek için traktörünüzü ve il/ilçenizi yazar mısınız?
```
- Tarih yazmak, eski fiyatın ekran görüntüsüyle sonradan doğacak tartışmayı önler.
- Soruyla bitirmek, müşterinin cevap vermesini kolaylaştırır.
- "Son 2 adet", "bugüne özel" gibi doğru olmayan aciliyet ifadeleri kullanılmamalı.
