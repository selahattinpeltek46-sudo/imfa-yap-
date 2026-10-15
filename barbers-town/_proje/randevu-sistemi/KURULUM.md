# Barber's Town — Online Randevu Sistemi

## 1. Nasıl çalışır? (tek bakışta)

```
Müşteri (site)                      Google (salonun hesabı, ücretsiz)            Salon (telefon)
──────────────                      ────────────────────────────────            ───────────────
1. Hizmet + gün seçer   ──GET──▶    Code.gs: takvime bakar, boş saatleri    
2. Boş saatleri görür   ◀─────────  hesaplar (kapasite, süre, molalar)
3. Ad + telefon + onay  ──POST─▶    Kilit altında saati TEKRAR kontrol eder
                                    ├─ doluysa: "Bu saat az önce doldu"      
                                    ├─ boşsa: Google Takvim'e etkinlik ─────▶ Takvim bildirimi
                                    ├─ E-Tablo'ya kayıt satırı              
                                    └─ E-posta bildirimi ───────────────────▶ Gmail
4. Ekranda randevu kodu ◀─────────  (BT-XXXXX)
   + "Takvimime ekle" + WhatsApp
```

- **Çift rezervasyon olmaz:** Saat, kayıt anında kilit altında yeniden kontrol edilir. Aynı saat için iki kişi aynı anda onaylarsa kapasite dolduğunda ikinciye "bu saat az önce doldu" denir ve güncel liste gösterilir.
- **Kapasite:** `koltuk: 2` (Saç & Sakal, Anatomik kesim), `bakim: 1` (Cilt bakımı, Lazer), `vip: 1` (VİP salon). Aynı saatte 2 koltuk randevusu + 1 lazer randevusu birlikte alınabilir.
- **Sistem kurulmadan / çökerse:** Form otomatik olarak **WhatsApp moduna** geçer; müşteri talebi hazır WhatsApp mesajı olarak gönderir. Site hiçbir zaman "kırık" görünmez.

## 1b. Sıra kayarsa gecikme bildirimi (ücretsiz, tek dokunuş)

Sitede müşteriye söz veriliyor: *"Sıra kayarsa randevu saatinizden önce WhatsApp'tan haber veririz, salonda beklemezsiniz."* Bu sözü tutmak için iki yol var:

| Nerede | Ne yapılır |
|---|---|
| **Salon paneli** (önerilen) | Telefonun ana ekranına eklenen tek bağlantı: `<web uygulaması URL>?islem=panel&anahtar=<PANEL_ANAHTARI>`. Günün kalan randevuları saat sırasıyla listelenir; her müşterinin yanında **15 dk gecikme**, **30 dk gecikme** ve **Ara** düğmeleri var. Düğmeye dokunun → WhatsApp'ta "sıramız 15 dakika kaydı, 14:45 gibi gelin" hazır mesajı açılır → **Gönder**. |
| Takvim etkinliği | Siteden alınan her randevunun açıklamasında "15 dk / 30 dk gecikme bildir" bağlantıları var. |

- Panel bağlantısı: `kurulum` çalıştırılınca Yürütme günlüğünde `Panel: …anahtar=…` satırı çıkar; başına web uygulaması URL'sini koyun. "Yeni randevu" e-postalarının sonunda da hazır bağlantı gelir.
- Bağlantıyı **yalnız salon telefonunda** tutun: müşteri adlarını ve telefonlarını gösterir. Sızarsa Proje Ayarları → Komut dosyası özellikleri → `PANEL_ANAHTARI`'nı silip `kurulum`'u tekrar çalıştırın (eski bağlantı geçersiz olur).
- Elle eklenen (telefonla alınan) randevular da panelde görünür; düğmeler için açıklamaya cep numarası yazılmalı.
- Gecikme süreleri `AYAR.gecikmeSecenekleri` (varsayılan `[15, 30]`).
- **Daha önce kurulduysa:** yeni `Code.gs`'yi yapıştırın, `kurulum`'u bir kez daha çalıştırın (yalnız panel anahtarını ekler), Dağıt → Dağıtımları yönet → **Yeni sürüm**.

## 1c. Paketler (art arda iki adım)

"Saç & Sakal Kesim + Cilt Bakımı" ve "Anatomik Kesim + Cilt Bakımı": önce koltukta 45 dk, ardından bakım odasında 45 dk [VARSAYIM süreler]. Saat yalnız **iki adım da boşsa** sunulur. Takvimde tek etkinlik (90 dk) görünür; silmek ikisini birden iptal eder. Paket adları sitedeki formla (`f-hizmet` → "Paketler") birebir aynı olmalı.

## 2. Salon randevuları nasıl kontrol eder?

| İş | Nasıl |
|---|---|
| Gelen randevuları görmek | Telefondaki **Google Takvim** uygulaması → "Barber's Town Randevular" takvimi. Her randevu: hizmet — müşteri adı; açıklamada telefon, not, randevu kodu. |
| Yeni randevu bildirimi | Takvim bildirimi + Gmail'e "Yeni randevu" e-postası (içinde müşteriye WhatsApp linki). |
| **İptal etmek** | Takvimde etkinliği **silin** → o saat sitede hemen yeniden boş görünür. |
| Saati değiştirmek | Etkinliği takvimde sürükleyin / saatini düzenleyin. Müşteriye WhatsApp'tan haber verin. |
| Telefonla gelen randevu | Takvime elle etkinlik ekleyin (ör. "Ahmet saç"). 1 koltuk dolu sayılır. Lazer/cilt için başlığı `[bakim]`, VİP için `[vip]` ile başlatın. |
| Sıra kaydı, müşteriye haber vermek | **Panel** (§1b) → müşterinin yanındaki "15 dk gecikme" → WhatsApp'ta **Gönder**. |
| Mola, izin, erken kapanış | Takvime başlığında **KAPALI** geçen etkinlik ekleyin (ör. "KAPALI öğle arası" 13:00–14:00). O aralık tüm hizmetlere kapanır. Tüm gün etkinliği = tüm gün kapalı. |
| Usta izinli → kapasite 1 | O gün için "Mehmet izinli" adlı tüm gün etkinliği ekleyin → bir koltuk tüm gün dolu sayılır. |
| Geçmiş kayıtlar, rapor | "Barber's Town Randevu Kayıtları" E-Tablosu: kayıt zamanı, kod, tarih, saat, hizmet, ad, telefon, not, durum. |
| Müşteri iptal/değişiklik isterse | Müşteri randevu koduyla WhatsApp'tan yazar → takvimde kodu arayın (Takvim aramasında açıklama da aranır). |

> Dikkat: Bu takvime randevuyla ilgisiz kişisel etkinlik eklemeyin; her etkinlik bir koltuğu meşgul sayar.

## 3. Kurulum (bir kez, ~15 dakika, ücretsiz)

Gerekli: salonun bir Google (Gmail) hesabı.

1. Salonun Google hesabıyla **https://script.google.com** → **Yeni proje**. Adı: "Barber's Town Randevu".
2. Sol menü **Proje Ayarları** → "appsscript.json manifest dosyasını düzenleyicide göster" kutusunu işaretleyin.
3. `Code.gs` içeriğini silin, bu klasördeki **`Code.gs`** dosyasının tamamını yapıştırın. `appsscript.json` içeriğini bu klasördeki **`appsscript.json`** ile değiştirin. Kaydedin.
4. `Code.gs` başındaki **AYAR** bölümünü salonla birlikte kontrol edin:
   - `calisma`: her günün açılış–kapanış saati (`null` = kapalı gün)
   - `kaynaklar`: aynı anda kaç koltuk / bakım odası / VİP salon çalışıyor
   - `hizmetler`: süreler (dakika). **Hizmet adlarını değiştirirseniz** sitedeki formdaki adlarla (index.html → `f-hizmet`) birebir aynı olmalı.
   - `bildirimEposta`: bildirim gidecek adres (boş = bu Google hesabı)
5. Üstteki fonksiyon listesinden **`kurulum`** seçin → **Çalıştır**. İzin ekranında hesabı seçin → "Gelişmiş" → "Barber's Town Randevu'ya git (güvenli değil)" → **İzin ver**. (Uyarı, betiğin Google tarafından incelenmemiş kişisel betik olmasındandır.)
   Bu adım takvimi, kayıt tablosunu ve **panel anahtarını** (§1b) oluşturur; Yürütme günlüğünde tablo ve panel satırı görünür.
6. **Dağıt → Yeni dağıtım → Tür: Web uygulaması**
   - Yürütme yetkisi: **Ben**
   - Erişimi olanlar: **Herkes**
   → **Dağıt** → çıkan **Web uygulaması URL**'sini kopyalayın (`https://script.google.com/macros/s/…/exec`).
7. Sitede `barbers-town/js/ayarlar.js` dosyasında `randevuApi: ''` satırına bu URL'yi yapıştırın, commit + push.
8. Telefonda Google Takvim uygulamasını açın, "Barber's Town Randevular" takviminin görünür ve bildirimlerin açık olduğunu kontrol edin.

**Test:** URL'nin sonuna `?islem=musait&tarih=2026-10-20&hizmet=VİP%20Salon` ekleyip tarayıcıda açın → `{"ok":true,…,"saatler":[…]}` görmelisiniz. Sonra sitede kendinize bir randevu alın, takvimde göründüğünü kontrol edip silin.

**Code.gs'yi sonradan değiştirirseniz:** Dağıt → Dağıtımları yönet → kalem → Sürüm: **Yeni sürüm** → Dağıt (URL aynı kalır).

## 4. Güvenlik ve sınırlar

- Siteden yalnız "boş saatler" okunabilir; müşteri adları/telefonları dışarı verilmez. Panel yalnız gizli anahtarla açılır (yanlış/eksik anahtarda takvim okunmaz).
- Spam: gizli tuzak alanı (botlar doldurur, kayıt yapılmaz), telefon doğrulaması (05xx), aynı numaradan günde en fazla 3 randevu.
- Google ücretsiz kotaları: günlük ~100 e-posta (tüketici hesabı), takvim etkinliği oluşturma ~5.000/gün — bir salon için fazlasıyla yeterli. E-posta kotası dolarsa randevu yine kaydedilir.
- KVKK: Veriler salonun Google hesabında tutulur; aydınlatma metni buna göre güncellendi (hukuki kontrol gerekir). Kayıt tablosundaki 1 yılı aşan satırlar silinmeli.

## 5. Teyit edilmesi gereken varsayımlar

| Ayar | Şu anki değer | Durum |
|---|---|---|
| Açılış saati | 09:00 (Pazar 10:00) | [VARSAYIM] — yalnız kapanış 21:00 doğrulandı |
| Tatil günü | yok | [VARSAYIM] |
| Koltuk sayısı | 2 | [VARSAYIM] — fotoğrafta en az 2 istasyon görülüyor |
| Hizmet süreleri | 45 / 45 / 45 / 60 / 60 dk | [VARSAYIM] |
| En erken randevu | 60 dk sonrası | öneri |
| İleri tarih | 21 gün | öneri |
