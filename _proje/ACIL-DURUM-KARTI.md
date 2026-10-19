# 🚑 ACİL DURUM KARTI — Dijital Otorite siteleri

Panik yok. Sırayla git. Her adım birkaç dakika sürer.
(Bu dosya `_proje/` içinde olduğu için yayına çıkmaz.)

## Sitelerim
| Site | Adres | Randevu sistemi |
|---|---|---|
| Dijital Otorite | selahattinpeltek46-sudo.github.io/imfa-yap-/dijital-otorite/ | Yok (WhatsApp formu) |
| İMFA Yapı | selahattinpeltek46-sudo.github.io/imfa-yap-/ | Yok |
| Söyleroğlu Hafriyat | soylerogluhafriyat.com | Yok |
| Üçel Tarım Aletleri | …/imfa-yap-/ucel-romork/ | Yok |
| Barber Uğur | …/imfa-yap-/barber-ugur/ | Apps Script (henüz bağlanmadı → WhatsApp modu) |
| Barber's Town | …/imfa-yap-/barbers-town/ · panel: …/barbers-town/panel/ | Apps Script (demo senin hesabında; canlı henüz bağlanmadı) |

---

## 1 · Sadece bende mi? (1 dk)
- Wi-Fi'yi kapat, **mobil veriyle** aç. Başka bir telefondan da dene.
- `downforeveryoneorjustme.com` → adresi yaz.
- Sadece sende bozuksa: tarayıcı önbelleği / internet. **Bitti.**

## 2 · Hangi parça bozuk? (2 dk)
| Ne görüyorsun? | Sorun | Git |
|---|---|---|
| Alan adı açılmıyor ama `selahattinpeltek46-sudo.github.io/imfa-yap-/…` açılıyor | Alan adı / DNS | **3** |
| Hiçbir site açılmıyor | GitHub | **4** |
| Site açılıyor ama bozuk görünüyor / bir bölüm yok | Son güncelleme | **5** |
| Site açılıyor, randevu çalışmıyor | Randevu sistemi | **6** |

## 3 · Alan adı
- Alan adını aldığın firmanın paneline gir: **süresi doldu mu? Ödeme geçti mi?**
- Repoda o sitenin `CNAME` dosyası duruyor mu? (ör. `soyleroglu-hafriyat/CNAME` → `soylerogluhafriyat.com`)
- DNS ayarını yeni değiştirdiysen 1–24 saat beklemek gerekebilir.
- Bu sırada müşteriye GitHub adresini ver; site orada çalışıyor.

## 4 · GitHub
- `githubstatus.com` → "Pages" kırmızı mı? Öyleyse **bekle**, genelde kısa sürer.
- GitHub'a giriş yapabiliyor musun? Yapamıyorsan hesap kurtarma (kurtarma kodları!).
- Repo özel (private) yapıldıysa ücretsiz planda Pages durur → Settings → genel (public) yap.

## 5 · Hatalı güncelleme → geri al (5 dk)
1. GitHub → repo → **Actions** sekmesi: en üstteki "Deploy to GitHub Pages" kırmızı ✗ mı?
2. **Pull requests → Closed** → en son birleştirilen PR'ı aç → **Revert** → çıkan yeni PR'ı **Merge**.
3. 1–2 dk sonra site eski hâline döner. Hiçbir şey kaybolmaz; değişiklik geçmişte durur.
4. Ya da Claude'a: **"Son birleştirilen değişikliği geri al ve yayına al."**

## 6 · Randevu sistemi çalışmıyor
Site bu durumda **kendiliğinden WhatsApp moduna** geçer (sunucu 12 sn cevap vermezse de). Müşteri kaybolmaz → acele etme.
- Salona sor: "Google şifresini değiştirdin mi? Takvimde bir şey sildin mi? Google'dan bir izin uyarısı geldi mi?"
- Salonun Google hesabıyla **script.google.com** → projeyi aç → sol menü **Yürütmeler** → kırmızı satırdaki hata mesajını oku / Claude'a gönder.
- Sık nedenler:
  | Belirti | Çözüm |
  |---|---|
  | "Yetki" / "Authorization" hatası | `kurulum` fonksiyonunu bir kez çalıştır, izinleri yeniden ver |
  | Takvim bulunamadı | `kurulum` takvimi yeniden oluşturur; eski randevuları tablodan kontrol et |
  | Kod güncellendi, site eski adrese gidiyor | Dağıt → **Dağıtımları yönet** → kalem → Yeni sürüm (yeni dağıtım açma, adres değişir!) |
  | E-posta gelmiyor ama randevu düşüyor | Günlük e-posta kotası (≈100) doldu; ertesi gün düzelir |
- Panel şifresi unutuldu: Proje Ayarları → Komut dosyası özellikleri → `PANEL_PIN`.

## 7 · Müşteriye haber ver (sessiz kalma)
> Merhaba, sitede kısa bir teknik sorun var, şu an üzerindeyim. Bu arada randevu/talepler WhatsApp'tan gelmeye devam ediyor, bir şey kaçmıyor. Düzelince haber vereceğim.

Düzelince:
> Sorun giderildi, site normal çalışıyor. Sebebi: ____. Tekrar olmaması için ____ yaptım.

---

## Önleme (bir kez kur, unut)
- [ ] **UptimeRobot** (ücretsiz): tüm site adreslerini ekle, bildirim e-posta/Telegram.
- [ ] **GitHub iki adımlı doğrulama** + kurtarma kodlarını kaydet.
- [ ] Alan adlarında **otomatik yenileme** + bitişten 1 ay önce takvim hatırlatması.
- [ ] Değişiklikler **PR ile** yayına girer, doğrudan main'e değil.
- [ ] **Ayda bir 5 dk kontrol:** her site açılıyor mu, WhatsApp butonu doğru numaraya gidiyor mu, randevu formu boş saat gösteriyor mu.
- [ ] Göksun Yörem yayına girmeden önce Tailwind CDN'den kurtarılmalı (CDN kapanırsa site tasarımsız görünür).
