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

---
# REVİZYON 3 — "Yapay zekâ ile yapıldığı anlaşılmasın" tasarım yenilemesi

Kullanıcı isteği: site hazır şablon / yapay zekâ işi gibi görünmesin, emek verilmiş ve araştırılmış görünsün.

**Kaldırılan tipik şablon izleri:** her bölüm başında çizgili küçük üst başlık, ikonlu kart ızgarası, büyük "5,0" puan kutusu, 3 maddelik "neden biz" listesi, "Konuşan biz değil, müşterilerimiz" gibi klişe slogan, berber direği şeridi, sistem yazı tipi, her yerde yuvarlak köşeli kartlar, siyah + altın "lüks" kalıbı.

**Salondan türetilen tasarım dili:**
| Öğe | Salondaki karşılığı |
|---|---|
| Koyu bölümlerdeki dikey çizgi deseni | Bekleme salonu ve koltuk arkasındaki çıtalı duvar panelleri |
| Açık gri zemin | Salonun gri sıva duvarları |
| Açılış fotoğrafının altın ışıklı çerçevesi | Berber istasyonlarındaki LED çerçeveli aynalar |
| Hizmet listesi beyaz ışıklı levhalar | Girişteki ışıklı hizmet tabelası (aynı sıra, aynı yazım) |
| El yazısı "Günün Sözü" panosu (Mevlânâ alıntısı) | Girişteki beyaz yazı tahtası — fotoğraftaki gerçek söz |
| Kırmızı ince şerit | Kapıdaki kırmızı halı |
| Logo | Dış cephedeki oval ışıklı tabela; galeri'de içerideki taçlı logo |
| Yazı tipleri | Alfa Slab One (tabeladaki kalın slab harfler), Rokkitt (levha yazısı), Barlow / Barlow Condensed (gövde, etiketler), Caveat (pano el yazısı) |

Metinler sadeleştirildi; yalnız fotoğraflarda görülen ya da Haritalar'da doğrulanan şeyler yazıldı. Testler (form, randevu, taşma) tekrarlandı: hepsi geçti.
Önizleme: claude.ai artifact (özel bağlantı). Gerçek yayın: main'e birleştirildikten sonra GitHub Pages.

---
# REVİZYON 4 — Salon paneli + canlı demo (2026-10-17)

- **Salon paneli** (`panel/`): şifreli günlük liste; ara, WhatsApp hatırlatma, iptal. Salonun "randevuları nereden takip ederiz?" sorusunun cevabı.
- **Demo:** Kullanıcının kendi Google hesabında Apps Script kuruldu; `ayarlar.js → demoApi` bağlandı. `?demo=1` ile site + panel deneme sistemine bağlanır; canlı site WhatsApp modunda kalır.
- **Gerçek uçtan uca test (kullanıcı):** randevu alındı → e-posta bildirimi geldi → panelde 13:00–13:45 göründü → iptal edildi → saat yeniden boşaldı. ✅
- **Bulunan hata:** logoya tıklayınca `?demo=1` düşüyor, site normal moda dönüyordu → demo bayrağı sessionStorage'da tutuldu, `?demo=0` ile çıkış (PR #18).
- **Kurulumda takılınan yerler (müşteri kurulumunda dikkat):** kodu `myFunction` içine yapıştırma; appsscript.json'u eski içerikle karıştırma; fonksiyon listesinde `kurulum` yerine ilk fonksiyonun seçili kalması; "doğrulanmamış uygulama" ekranında e-posta bağlantısına tıklayıp "Gelişmiş"i kaçırma; panel şifresini günlükte kaçırma (Proje Ayarları → Komut dosyası özellikleri → PANEL_PIN).

**Sıradaki:** 30 sn ekran kaydı → salona mesaj → salon onaylarsa salonun Gmail'inde aynı kurulum ve adres `randevuApi`'ye. Teyit edilecek: açılış saati, tatil günü, koltuk sayısı, hizmet süreleri. İyileştirme önerisi: e-postada Türkçe tarih ("17 Ekim Cumartesi"), isim baş harf büyütme.

---
# REVİZYON 5 — Saati değiştir, saat kapat, hatırlatma, tablo eşitleme, aylık özet (2026-10-18)

Kullanıcı isteği: "hepsini yap ve analiz et — doğru mu, yanlışlık/aksi durum var mı?"

## Yapılanlar
| # | Özellik | Nerede |
|---|---|---|
| 1 | Panel **Saati değiştir** (kapasite kontrolü, mesai dışı uyarısı, geçmiş/gece yarısı engeli) + müşteriye "güncellendi" WhatsApp | Code.gs `panel/tasi`, panel.js |
| 2 | Panel **Saat / gün kapat** + çakışan randevu sayısı uyarısı; kapalı satırda **Kaldır** | Code.gs `panel/kapat`, panel.js, panel/index.html |
| 3 | İptal sonrası müşteriye "iptal edildi" WhatsApp | Code.gs `panel/iptal`, panel.js |
| 4 | Hatırlatma: müşteri **Telefonuma ekle** (.ics, 2 saat önce alarm) + salon telefonuna 2 saat önce takvim bildirimi + 15 dk'lık görevle salona WhatsApp bağlantılı e-posta | site.js, index.html, Code.gs `hatirlatmaKontrol` |
| 5 | Gece **tablo eşitleme** (takvimden silinen/taşınan) | Code.gs `tabloyuEsitle` |
| 6 | **Aylık özet** e-postası | Code.gs `aylikOzet` |
| 7 | E-postada Türkçe tarih ("19 Ekim Pazartesi"), isim baş harfleri (Türkçe i/İ, ı/I) | Code.gs `turkceTarih`, `adDuzelt` |

## Doğrulama
- **Sahte Google ortamı** (`testler/sahte-google.js`): gerçek Code.gs; Takvim, E-Tablo, Gmail, kilit, önbellek, tetikleyiciler taklit edildi. `testler/entegrasyon.test.js` → **77/77 geçti** (13 bölüm: saf fonksiyonlar, kurulum, site randevusu, kapasite, panel liste/taşı/kapat/iptal, güvenlik, hatırlatma, tablo eşitleme, aylık özet, kota ve uzak taşıma).
- **Tarayıcı uçtan uca** (Playwright → gerçek Code.gs): **23/23** (ics içeriği/saat/satır uzunluğu, form akışları, otomatik yenileme koruması karşıt kontrolle, 375 px).
- **Eski sunucu uyumluluğu:** yeni panel + eski Code.gs → liste, hatırlatma, iptal çalışıyor; yeni düğmeler anlaşılır "Code.gs güncellenmeli" uyarısı veriyor.

## Bulunan ve düzeltilen hatalar (denetim sırasında)
| # | Önem | Bulgu | Düzeltme |
|---|---|---|---|
| D1 | YÜKSEK | `display:grid/flex` tanımlı bileşenlerde `hidden` çalışmıyordu → "Saat kapat" formu hep açık, "Tüm gün" saatleri gizlemiyordu | site.css `[hidden]{display:none!important}` |
| D2 | ORTA | Kart düğme satırının `grid-column:2` kuralı kapatma formunu iki sütuna bölüyordu | `.rv > .rv__eylem` ile sınırlandı |
| D3 | ORTA | 21 günden ileriye taşınan randevu gece görevinde "iptal" sayılırdı | eşitleme aralığı +365 gün |
| D4 | ORTA | Yoğun günde Gmail kotası (~100/gün) dolabilir; hatırlatma kaybolurdu | `epostaGonder` kota kontrolü; önemsizler kotanın son 5'inde atlanır; hatırlatma gönderilemezse etiketlenmez → sonraki turda tekrar |
| D5 | ORTA | Açık form varken dakikalık yenileme formu siliyordu | `duzenleniyor` bayrağı (karşıt kontrollü test) |
| D6 | DÜŞÜK | Eski sunucuda iptal sonrası yanlış "Bağlantı hatası" | `c.randevu` korumalı |
| D7 | DÜŞÜK | .ics satırları 75 bayt sınırını aşıyordu (Türkçe harfler) | RFC 5545 satır katlama |

## Bilinen sınırlar (bilinçli)
- Panel kilidi (5 yanlış/10 dk) herkese uygulanır — kötü niyetli biri salonu 10 dk dışarıda bırakabilir.
- Müşteriye mesajlar **yarı otomatik** (salon tek dokunuşla gönderir); tam otomatik SMS/WhatsApp ücretli API gerektirir.
- Takvime elle eklenen telefonsuz randevulara otomatik hatırlatma yok.
- iOS'ta bazı uygulama içi tarayıcılar (.ics data bağlantısı) indirmeyi engelleyebilir → "Google Takvim" yedek düğmesi duruyor.
- Canlı Google ortamında henüz denenmedi: kullanıcı Code.gs + appsscript.json'u güncelleyip `kurulum` + yeni sürüm dağıtımı yapmalı (KURULUM.md §4b).
