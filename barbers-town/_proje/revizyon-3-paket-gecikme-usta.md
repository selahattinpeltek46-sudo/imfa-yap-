# REVİZYON 3 — Paketler, gecikme bildirimi, "Ustamız" (gizli)

Tarih: 2026-10-15 · Tetikleyici: kullanıcı kadiralkan.com.tr analizinden çıkan fikirlerden **1 (ustanın hikâyesi), 4 (paket hizmetler) ve 6 (gecikme bildirimi)**'ni iki berber sitesine de istedi. Kadir Alkan'ın Şikâyetvar'daki en sık şikâyeti "randevuya rağmen 30–40 dk bekletilmek"; 6 bu açığı kapatmak için.

## Karar
| # | Özellik | Durum | Neden |
|---|---|---|---|
| 1 | "Ustamız" bölümü | ⏸ **Hazır ama gizli** (`hidden`) | Modül 1'de usta adı/tecrübe/kuruluş yılı BİLİNMİYOR — uydurulmaz. Bilgi formu: `usta-bilgi-formu.md` |
| 4 | Paketler ("Birlikte alın") | ✅ yayında | Yalnız sitede zaten olan hizmetlerin art arda tek randevuda birleşimi; fiyat/indirim iddiası yok, "paket fiyatını sorun" |
| 6 | Gecikme bildirimi | ✅ yayında (sunucu kurulunca çalışır) | Müşteriye söz (randevu metni + SSS), salona tek dokunuşluk panel + takvim etkinliğinde hazır WhatsApp bağlantıları |

Elenen: "Damat paketi" vb. — salonın böyle bir hizmeti doğrulanmadı.

## Paketler
| Paket | Adım 1 | Adım 2 | Toplam [VARSAYIM] |
|---|---|---|---|
| Saç & Sakal Kesim + Cilt Bakımı | koltuk 45 dk | bakım odası 45 dk | 90 dk |
| Anatomik Kesim + Cilt Bakımı | koltuk 45 dk | bakım odası 45 dk | 90 dk |

Randevu motoruna **çok adımlı hizmet** eklendi: `hizmetler[ad].adimlar` sırayla kontrol edilir, saat yalnız her adımın kaynağı kendi aralığında boşsa sunulur (`bosSaatler`). Takvimde tek etkinlik oluşur; `adimlar` etiketi `mesgulAraliklar` → `etkinlikAraliklari` ile adımlara bölünür (bozuk etiket → tek kaynak). Salonun elle eklediği etkinlikler eskisi gibi çalışır. Siteden alınan randevulara artık `ad`, `telefon`, `hizmet` etiketleri de yazılıyor (panel için). `appsscript.json` → `script.scriptapp` izni (panel bağlantısı için web uygulaması adresi).

## Değişen dosyalar
- `index.html` — Hizmetler'e "Birlikte alın" bloğu; formda `<optgroup label="Paketler">`; gizli `#usta` bölümü; randevu girişinde "Sıra kayarsa haber veririz"; yeni SSS "Sıra gecikirse … beklemek zorunda kalır mıyım?" (HTML + JSON-LD birebir).
- `css/site.css` — `.paketler`, `.usta*`, `.randevu__soz`, `[hidden]` koruması, mobil kırılımlar.
- `kvkk/index.html` — işleme amacına gecikme bildirimi; "reklam mesajı gönderilmez".
- `_proje/randevu-sistemi/Code.gs` — paket hizmetleri; saf fonksiyonlar `gecikmeMetni`, `gecikmeLinki`, `panelListesi`, `panelHtml`, `htmlKacis`, `aciklamadanTelefon`, `hizmetAdimlari`, `etkinlikAraliklari`; `doGet ?islem=panel&anahtar=` (anahtarsız/yanlış anahtarda takvim okunmaz); etkinlik açıklamasına 15/30 dk gecikme bağlantıları; e-postalara panel bağlantısı (`panelSatiri`); `kurulum()` `PANEL_ANAHTARI` üretir; `AYAR.gecikmeSecenekleri`.
- `_proje/randevu-sistemi/KURULUM.md` — gecikme paneli bölümü, yönetim tablosu, kurulum adımı, güvenlik notu.
- `_proje/usta-bilgi-formu.md` — salona gönderilecek soru listesi ve doldurma yönergesi.

## Testler
- Node: gecikme metni/bağlantısı, panel listesi/HTML/anahtar (Uğur ile aynı maddeler, Hatırlat düğmesi yok), paket: boş günde 09:00–19:30, bakım odası doluyken paket ✗ ama tek kesim ✓, koltuklar doluyken ✗, etkinliğin adımlara bölünmesi (+ bozuk etiket, `[bakim]` başlıklı elle etkinlik), `sure` = adım toplamı, paket kaydından sonra ikinci paket bakım çakışmasıyla engelleniyor, `doPost` etiketleri + `adimlar` + 90 dk → **hepsi geçti**.
- Playwright (1280 px ve 375 px): Uğur ile aynı maddeler (SSS 8 soru) → **hepsi geçti**.

## Audit
| # | Sınıf | Önem | Bulgu | Durum |
|---|---|---|---|---|
| G1 | CONVERSION/FACT | ORTA | Site "sıra kayarsa haber veririz" diyor; gönderim salonın panele dokunmasına bağlı | ⚠️ teslimde salona anlatılmalı; panel bağlantısı ana ekrana eklenmeli |
| G2 | SECURITY | ORTA | Panel bağlantısı müşteri ad/telefonunu gösterir | Gizli anahtar (UUID), `noindex`; sızarsa anahtar yenileme KURULUM'da |
| G3 | FACT | DÜŞÜK | Paket süreleri [VARSAYIM] | salon teyit etmeli (`AYAR.hizmetler`) |
| G4 | CONTENT | — | "Ustamız" yayında değil | salon bilgisi bekleniyor (`usta-bilgi-formu.md`) |
| G5 | TECHNICAL | DÜŞÜK | Sunucu kurulmadan (WhatsApp modu) panel/gecikme bağlantısı yok | Sistem kurulunca devreye girer |
