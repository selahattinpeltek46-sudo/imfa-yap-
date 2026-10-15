# Barber Uğur — Online Randevu Sistemi

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
4. Ekranda randevu kodu ◀─────────  (BU-XXXXX)
   + "Takvimime ekle" + WhatsApp
```

- **Çift rezervasyon olmaz:** Saat, kayıt anında kilit altında yeniden kontrol edilir. Aynı saat için iki kişi aynı anda onaylarsa kapasite dolduğunda ikinciye "bu saat az önce doldu" denir ve güncel liste gösterilir.
- **Kapasite:** `koltuk: 2` — aynı saatte en fazla 2 online randevu. Dükkânda daha fazla koltuk var; geri kalanlar randevusuz gelenlere kalır. Daha fazla ya da az online randevu istenirse bu sayı değiştirilir.
- **Sistem kurulmadan / çökerse:** Form otomatik olarak **WhatsApp moduna** geçer; müşteri talebi hazır WhatsApp mesajı olarak gönderir. Site hiçbir zaman "kırık" görünmez.

## 2. Salon randevuları nasıl kontrol eder?

| İş | Nasıl |
|---|---|
| Gelen randevuları görmek | Telefondaki **Google Takvim** uygulaması → "Barber Uğur Randevular" takvimi. Her randevu: hizmet — müşteri adı; açıklamada telefon, not, randevu kodu. |
| Yeni randevu bildirimi | Takvim bildirimi + Gmail'e "Yeni randevu" e-postası (içinde müşteriye WhatsApp linki). |
| **İptal etmek** | Takvimde etkinliği **silin** → o saat sitede hemen yeniden boş görünür. |
| Saati değiştirmek | Etkinliği takvimde sürükleyin / saatini düzenleyin. Müşteriye WhatsApp'tan haber verin. |
| Telefonla gelen randevu | Takvime elle etkinlik ekleyin (ör. "Ahmet saç"). 1 koltuk dolu sayılır. |
| Mola, izin, erken kapanış | Takvime başlığında **KAPALI** geçen etkinlik ekleyin (ör. "KAPALI öğle arası" 13:00–14:00). O aralık tüm hizmetlere kapanır. Tüm gün etkinliği = tüm gün kapalı. |
| Usta izinli → kapasite 1 | O gün için "Usta izinli" adlı tüm gün etkinliği ekleyin → bir koltuk tüm gün dolu sayılır. |
| Geçmiş kayıtlar, rapor | "Barber Uğur Randevu Kayıtları" E-Tablosu: kayıt zamanı, kod, tarih, saat, hizmet, ad, telefon, not, durum. |
| Müşteri iptal/değişiklik isterse | Müşteri randevu koduyla WhatsApp'tan yazar → takvimde kodu arayın (Takvim aramasında açıklama da aranır). |

> Dikkat: Bu takvime randevuyla ilgisiz kişisel etkinlik eklemeyin; her etkinlik bir koltuğu meşgul sayar.

## 3. Kurulum (bir kez, ~15 dakika, ücretsiz)

Gerekli: salonun bir Google (Gmail) hesabı.

1. Salonun Google hesabıyla **https://script.google.com** → **Yeni proje**. Adı: "Barber Uğur Randevu".
2. Sol menü **Proje Ayarları** → "appsscript.json manifest dosyasını düzenleyicide göster" kutusunu işaretleyin.
3. `Code.gs` içeriğini silin, bu klasördeki **`Code.gs`** dosyasının tamamını yapıştırın. `appsscript.json` içeriğini bu klasördeki **`appsscript.json`** ile değiştirin. Kaydedin.
4. `Code.gs` başındaki **AYAR** bölümünü salonla birlikte kontrol edin:
   - `calisma`: her günün açılış–kapanış saati (`null` = kapalı gün)
   - `kaynaklar`: aynı anda kaç online randevu koltuğu ayrılıyor
   - `hizmetler`: süreler (dakika). **Hizmet adlarını değiştirirseniz** sitedeki formdaki adlarla (index.html → `f-hizmet`) birebir aynı olmalı.
   - `bildirimEposta`: bildirim gidecek adres (boş = bu Google hesabı)
5. Üstteki fonksiyon listesinden **`kurulum`** seçin → **Çalıştır**. İzin ekranında hesabı seçin → "Gelişmiş" → "Barber Uğur Randevu'ya git (güvenli değil)" → **İzin ver**. (Uyarı, betiğin Google tarafından incelenmemiş kişisel betik olmasındandır.)
   Bu adım takvimi ve kayıt tablosunu oluşturur; Yürütme günlüğünde tablo linki görünür.
6. **Dağıt → Yeni dağıtım → Tür: Web uygulaması**
   - Yürütme yetkisi: **Ben**
   - Erişimi olanlar: **Herkes**
   → **Dağıt** → çıkan **Web uygulaması URL**'sini kopyalayın (`https://script.google.com/macros/s/…/exec`).
7. Sitede `barber-ugur/js/ayarlar.js` dosyasında `randevuApi: ''` satırına bu URL'yi yapıştırın, commit + push.
8. Telefonda Google Takvim uygulamasını açın, "Barber Uğur Randevular" takviminin görünür ve bildirimlerin açık olduğunu kontrol edin.

**Test:** URL'nin sonuna `?islem=musait&tarih=2026-10-20&hizmet=Sa%C3%A7%20Kesimi` ekleyip tarayıcıda açın → `{"ok":true,…,"saatler":[…]}` görmelisiniz. Sonra sitede kendinize bir randevu alın, takvimde göründüğünü kontrol edip silin.

**Code.gs'yi sonradan değiştirirseniz:** Dağıt → Dağıtımları yönet → kalem → Sürüm: **Yeni sürüm** → Dağıt (URL aynı kalır).

## 4. Güvenlik ve sınırlar

- Siteden yalnız "boş saatler" okunabilir; müşteri adları/telefonları dışarı verilmez.
- Spam: gizli tuzak alanı (botlar doldurur, kayıt yapılmaz), telefon doğrulaması (05xx), aynı numaradan günde en fazla 3 randevu.
- Google ücretsiz kotaları: günlük ~100 e-posta (tüketici hesabı), takvim etkinliği oluşturma ~5.000/gün — bir salon için fazlasıyla yeterli. E-posta kotası dolarsa randevu yine kaydedilir.
- KVKK: Veriler salonun Google hesabında tutulur; aydınlatma metni buna göre güncellendi (hukuki kontrol gerekir). Kayıt tablosundaki 1 yılı aşan satırlar silinmeli.

## 5. Teyit edilmesi gereken varsayımlar

| Ayar | Şu anki değer | Durum |
|---|---|---|
| Açılış saati | 09:00 | [VARSAYIM] — yalnız kapanış 20:00 doğrulandı (Haritalar, bir gün için) |
| Tatil günü | Pazar | [VARSAYIM] — Pazar açıksa `calisma[0]` = `['10:00', '20:00']` gibi yazılır |
| Online randevuya ayrılan koltuk | 2 | [VARSAYIM] — fotoğraflarda 4'ten fazla istasyon görülüyor |
| Hizmet süreleri | Saç 30 · Sakal 20 · Saç & Sakal 45 · Çocuk 30 dk | [VARSAYIM] |
| En erken randevu | 60 dk sonrası | öneri |
| İleri tarih | 21 gün | öneri |
