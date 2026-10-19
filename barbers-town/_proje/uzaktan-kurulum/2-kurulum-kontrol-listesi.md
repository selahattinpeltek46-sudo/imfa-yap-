# 2 · Uzaktan kurulum kontrol listesi

Salon: **Barber's Town** · Tarih: ____ · Süre: görüşme ~15 dk + kurulum ~20 dk + teslim ~10 dk
Model: **Salona özel iş Gmail'i (B seçeneği)** — hesap ve veriler salonun, kurulum/bakım Dijital Otorite.

---

## A · Görüşmeden önce (sen, 5 dk)
- [ ] Bilgisayarda Chrome'da **yeni profil** aç (adı: "Barber's Town") — kendi hesabınla karışmasın
- [ ] Ham kod bağlantıları elinin altında:
  - `https://raw.githubusercontent.com/selahattinpeltek46-sudo/imfa-yap-/main/barbers-town/_proje/randevu-sistemi/Code.gs`
  - `https://raw.githubusercontent.com/selahattinpeltek46-sudo/imfa-yap-/main/barbers-town/_proje/randevu-sistemi/appsscript.json`
- [ ] Bu listeyi açık tut, cevapları aşağıya yaz

## B · Telefon görüşmesi (salon sahibiyle, ~15 dk)

**Ayarlar** (şu anki değerler tahmin — `[VARSAYIM]`):

| Soru | Şu an | Salonun cevabı |
|---|---|---|
| Hafta içi açılış – kapanış | 09:00 – 21:00 | |
| Cumartesi | 09:00 – 21:00 | |
| Pazar | 10:00 – 21:00 | |
| Tatil günü var mı? | yok | |
| Öğle arası / sabit mola | yok | |
| Aynı anda kaç koltuk çalışıyor? | 2 | |
| Cilt bakımı / lazer odası kaç kişi? | 1 | |
| VİP salon aynı anda kaç kişi? | 1 | |
| Saç & Sakal Kesim süresi | 45 dk | |
| Anatomik Saç Kesim süresi | 45 dk | |
| Özel Cilt Bakımı süresi | 45 dk | |
| Lazer Epilasyon süresi | 60 dk | |
| VİP Salon süresi | 60 dk | |
| Listede olmayan hizmet? | — | |
| En erken kaç saat sonrasına randevu verilsin? | 1 saat | |
| Kaç gün ileriye randevu açık olsun? | 21 gün | |
| Bildirimler hangi e-postaya gelsin? (salon sahibinin kişisel Gmail'i) | — | |
| Bayram/özel kapalı günler | — | |

**Hesap**
- [ ] "Randevu sistemi için size özel bir Google hesabı açıyorum, telefonunuza kod gelecek" de
- [ ] Hesap adı öner: `barberstown.randevu@gmail.com` (doluysa `barberstown.yeditepe…`)
- [ ] Doğrulama kodunu telefonda al
- [ ] **Kişisel Gmail şifresini asla isteme**

**Onay**
- [ ] 2 hafta ücretsiz pilot, sonra karar — sözlü onay; ardından WhatsApp'tan yazılı teyit ("2 hafta ücretsiz deneme, verileriniz size özel hesapta")

## C · Kurulum (sen, bilgisayardan, ~20 dk)
- [ ] Yeni Gmail'i oluştur → **kurtarma telefonu ve iki adımlı doğrulama: salonun numarası**
- [ ] Şifreyi güvenli bir yere yaz (teslimde salona verilecek)
- [ ] script.google.com → **Yeni proje** → adı: "Barber's Town Randevu"
- [ ] Proje Ayarları → "appsscript.json dosyasını göster" ✓
- [ ] **Kod.gs**: Ctrl+A → Delete → Code.gs yapıştır → 1. satır `/**` mi?
- [ ] Görüşmedeki cevaplara göre **AYAR** bölümünü düzenle (calisma, kaynaklar, hizmetler, bildirimEposta, enAzOnceDakika, ileriGun)
- [ ] **appsscript.json**: Ctrl+A → Delete → yapıştır → `script.scriptapp` satırı var mı?
- [ ] 💾 **Kaydet** → üstte "Kaydedilmemiş değişiklikler" yazısı **yok**
- [ ] Listeden **kurulum** → Çalıştır → İzinleri incele → Gelişmiş (sol altta gri) → "…sayfasına git" → İzin ver
- [ ] Yürütme günlüğünden not al: **panel şifresi** ______ · tablo linki ______ · "Otomatik görevler kuruldu" ✓
- [ ] **Dağıt → Yeni dağıtım** → Tür: Web uygulaması · Yürütme: **Ben** · Erişim: **Herkes** → Dağıt
- [ ] Web uygulaması URL'sini kopyala → **Claude'a gönder** (`ayarlar.js → randevuApi`'ye yazılıp yayına alınacak)
- [ ] Yayından sonra test: sitede kendine randevu al → panelde gör → e-posta geldi mi → **İptal et**
- [ ] Panelde "Kapıdan geldi" → hizmet → göründü mü → **İptal et**
- [ ] Sitedeki **DEMO** şeridi yok, normal adreste randevu formu boş saat gösteriyor

## D · Teslim (salon sahibiyle, görüntülü ~10 dk)
- [ ] **Takvimi paylaş:** Google Takvim → "Barber's Town Randevular" → ⋮ → Ayarlar ve paylaşım → Belirli kişilerle paylaş → salon sahibinin kişisel Gmail'i → **"Etkinliklerde değişiklik yapabilir"**
- [ ] Salon sahibinin telefonunda Google Takvim'de bu takvim görünüyor + bildirimler açık
- [ ] WhatsApp'tan gönder: panel linki `…/barbers-town/panel/` + 6 haneli şifre + **kullanım kartı** (dosya olarak gönder ki yazılar bulanıklaşmasın)
- [ ] Görüntülü aramada: paneli aç → şifre → **⋮ → Ana ekrana ekle**
- [ ] Birlikte bir kez: "Kapıdan geldi" → sil · "Telefon randevusu" → sil · "Mola ver" → kaldır
- [ ] Tek kuralı söyle: **"Her müşteri panele girsin."**
- [ ] Hesap şifresini teslim et; bakım erişimi konusunu konuş ve WhatsApp'ta yazılı teyit al
- [ ] ⚠️ Şifre değişirse paneli bir kez dene; çalışmazsa Apps Script'te **kurulum**'u yeniden çalıştır

## E · Pilot takibi (2 hafta)
- [ ] 1.–7. gün: her akşam panele bak (kayıt tablosu da var): eklenmeyen kapı müşterisi var mı?
- [ ] 3. gün: kısa mesaj — "Nasıl gidiyor, takıldığınız bir şey var mı?"
- [ ] 14. gün: kayıt tablosundan say → online randevu ___ · panelden eklenen ___ · iptal ___ · gelmeyen (salona sor) ___
- [ ] Sonuç görüşmesi: devam / bakım ücreti / Google yorumu ve referans izni iste
- [ ] Sonuçları `barbers-town/_proje/` altına not et → Dijital Otorite sitesine gerçek rakamla referans
