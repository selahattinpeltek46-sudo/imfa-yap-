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

## 2. Salon randevuları nasıl kontrol eder?

**En kolay yol: Salon paneli** → `https://selahattinpeltek46-sudo.github.io/imfa-yap-/barbers-town/panel/`
Telefonda açılır, 6 haneli şifreyle girilir (şifre bir kez girilince o telefonda hatırlanır). Bugün / yarın / istenen günün randevuları saat sırasıyla listelenir; her randevuda **Ara**, **WhatsApp hatırlatma** (hazır mesaj) ve **İptal et** düğmeleri var. Liste her dakika kendini yeniler. Şifre `kurulum()` çalıştırılınca Yürütme günlüğüne yazılır (Proje Ayarları → Komut dosyası özellikleri → `PANEL_PIN` ile değiştirilebilir). 10 dakikada 5 yanlış denemede panel kilitlenir.

Google Takvim ile de yönetilebilir:

| İş | Nasıl |
|---|---|
| Gelen randevuları görmek | Telefondaki **Google Takvim** uygulaması → "Barber's Town Randevular" takvimi. Her randevu: hizmet — müşteri adı; açıklamada telefon, not, randevu kodu. |
| Yeni randevu bildirimi | Takvim bildirimi + Gmail'e "Yeni randevu" e-postası (içinde müşteriye WhatsApp linki). |
| **İptal etmek** | Takvimde etkinliği **silin** → o saat sitede hemen yeniden boş görünür. |
| Saati değiştirmek | Etkinliği takvimde sürükleyin / saatini düzenleyin. Müşteriye WhatsApp'tan haber verin. |
| Telefonla gelen randevu | Takvime elle etkinlik ekleyin (ör. "Ahmet saç"). 1 koltuk dolu sayılır. Lazer/cilt için başlığı `[bakim]`, VİP için `[vip]` ile başlatın. |
| Mola, izin, erken kapanış | Takvime başlığında **KAPALI** geçen etkinlik ekleyin (ör. "KAPALI öğle arası" 13:00–14:00). O aralık tüm hizmetlere kapanır. Tüm gün etkinliği = tüm gün kapalı. |
| Usta izinli → kapasite 1 | O gün için "Mehmet izinli" adlı tüm gün etkinliği ekleyin → bir koltuk tüm gün dolu sayılır. |
| Geçmiş kayıtlar, rapor | "Barber's Town Randevu Kayıtları" E-Tablosu: kayıt zamanı, kod, tarih, saat, hizmet, ad, telefon, not, durum. |
| Müşteri iptal/değişiklik isterse | Müşteri randevu koduyla WhatsApp'tan yazar → takvimde kodu arayın (Takvim aramasında açıklama da aranır). |

> Dikkat: Bu takvime randevuyla ilgisiz kişisel etkinlik eklemeyin; her etkinlik bir koltuğu meşgul sayar.

## 3. Önce DEMO (kendi hesabınızda deneme)

Salona göstermeden önce sistemi **kendi** Gmail hesabınızda kurup deneyin. Canlı site etkilenmez:
1. Aşağıdaki kurulum adımlarını kendi hesabınızla yapın (proje adı: "Barber's Town DEMO").
2. Çıkan web uygulaması adresini `js/ayarlar.js` → **`demoApi`** satırına yazın (`randevuApi` boş kalır).
3. Demo site: `…/barbers-town/?demo=1` (üstte kırmızı "DEMO" şeridi görünür) · Demo panel: `…/barbers-town/panel/?demo=1`
4. Normal adresteki site WhatsApp modunda kalır; müşteri randevuları sizin deneme takviminize düşmez.

Salon onaylayınca aynı adımlar salonun hesabında yapılır ve adres bu kez **`randevuApi`** satırına yazılır.

## 4. Kurulum (bir kez, ~15 dakika, ücretsiz)

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
   Bu adım takvimi ve kayıt tablosunu oluşturur; Yürütme günlüğünde tablo linki görünür.
6. **Dağıt → Yeni dağıtım → Tür: Web uygulaması**
   - Yürütme yetkisi: **Ben**
   - Erişimi olanlar: **Herkes**
   → **Dağıt** → çıkan **Web uygulaması URL**'sini kopyalayın (`https://script.google.com/macros/s/…/exec`).
7. Sitede `barbers-town/js/ayarlar.js` dosyasında `randevuApi: ''` satırına bu URL'yi yapıştırın, commit + push.
8. Telefonda Google Takvim uygulamasını açın, "Barber's Town Randevular" takviminin görünür ve bildirimlerin açık olduğunu kontrol edin.

**Test:** URL'nin sonuna `?islem=musait&tarih=2026-10-20&hizmet=VİP%20Salon` ekleyip tarayıcıda açın → `{"ok":true,…,"saatler":[…]}` görmelisiniz. Sonra sitede kendinize bir randevu alın, takvimde göründüğünü kontrol edip silin.

**Code.gs'yi sonradan değiştirirseniz:** Dağıt → Dağıtımları yönet → kalem → Sürüm: **Yeni sürüm** → Dağıt (URL aynı kalır).

## 5. Güvenlik ve sınırlar

- Siteden yalnız "boş saatler" okunabilir; müşteri adları/telefonları dışarı verilmez.
- Spam: gizli tuzak alanı (botlar doldurur, kayıt yapılmaz), telefon doğrulaması (05xx), aynı numaradan günde en fazla 3 randevu.
- Google ücretsiz kotaları: günlük ~100 e-posta (tüketici hesabı), takvim etkinliği oluşturma ~5.000/gün — bir salon için fazlasıyla yeterli. E-posta kotası dolarsa randevu yine kaydedilir.
- KVKK: Veriler salonun Google hesabında tutulur; aydınlatma metni buna göre güncellendi (hukuki kontrol gerekir). Kayıt tablosundaki 1 yılı aşan satırlar silinmeli.

## 6. Teyit edilmesi gereken varsayımlar

| Ayar | Şu anki değer | Durum |
|---|---|---|
| Açılış saati | 09:00 (Pazar 10:00) | [VARSAYIM] — yalnız kapanış 21:00 doğrulandı |
| Tatil günü | yok | [VARSAYIM] |
| Koltuk sayısı | 2 | [VARSAYIM] — fotoğrafta en az 2 istasyon görülüyor |
| Hizmet süreleri | 45 / 45 / 45 / 60 / 60 dk | [VARSAYIM] |
| En erken randevu | 60 dk sonrası | öneri |
| İleri tarih | 21 gün | öneri |
