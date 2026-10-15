# REVİZYON 4 — Paketler, gecikme bildirimi, "Ustamız" (gizli)

Tarih: 2026-10-15 · Tetikleyici: kullanıcı kadiralkan.com.tr analizinden çıkan fikirlerden **1 (ustanın hikâyesi), 4 (paket hizmetler) ve 6 (gecikme bildirimi)**'ni iki berber sitesine de istedi. Kadir Alkan'ın Şikâyetvar'daki en sık şikâyeti "randevuya rağmen 30–40 dk bekletilmek"; 6 bu açığı kapatmak için.

## Karar
| # | Özellik | Durum | Neden |
|---|---|---|---|
| 1 | "Ustamız" bölümü | ⏸ **Hazır ama gizli** (`hidden`) | Modül 1'de usta adı/tecrübe/kuruluş yılı BİLİNMİYOR — uydurulmaz. Bilgi formu: `usta-bilgi-formu.md` |
| 4 | Paketler ("Birlikte alın") | ✅ yayında | Yalnız sitede zaten olan hizmetlerin art arda tek randevuda birleşimi; fiyat/indirim iddiası yok, "paket fiyatını sorun" |
| 6 | Gecikme bildirimi | ✅ yayında (sunucu kurulunca çalışır) | Müşteriye söz (randevu metni + SSS), dükkâna tek dokunuşluk panel + takvim etkinliğinde hazır WhatsApp bağlantıları |

Elenen: "Damat paketi" vb. — dükkânın böyle bir hizmeti doğrulanmadı.

## Paketler
| Paket | İçerik | Süre [VARSAYIM] | Kaynak |
|---|---|---|---|
| Baba & Çocuk | Saç kesimi + çocuk tıraşı art arda | 60 dk | koltuk |
| Saç & Sakal + Yüz Maskesi | Saç & sakal, ardından yüz maskesi | 60 dk | koltuk |

Panelde Barber Uğur'a özel olarak **Hatırlat** düğmesi de var (Revizyon 2'deki hatırlatma bağlantısı).

## Değişen dosyalar
- `index.html` — Hizmetler'e "Birlikte alın" bloğu; formda `<optgroup label="Paketler">`; gizli `#usta` bölümü; randevu girişinde "Sıra kayarsa haber veririz"; yeni SSS "Sıra gecikirse … beklemek zorunda kalır mıyım?" (HTML + JSON-LD birebir).
- `css/site.css` — `.paketler`, `.usta*`, `.randevu__soz`, `[hidden]` koruması, mobil kırılımlar.
- `kvkk/index.html` — işleme amacına gecikme bildirimi; "reklam mesajı gönderilmez".
- `_proje/randevu-sistemi/Code.gs` — paket hizmetleri; saf fonksiyonlar `gecikmeMetni`, `gecikmeLinki`, `panelListesi`, `panelHtml`, `htmlKacis`; `doGet ?islem=panel&anahtar=` (anahtarsız/yanlış anahtarda takvim okunmaz); etkinlik açıklamasına 15/30 dk gecikme bağlantıları; e-postalara panel bağlantısı (`panelSatiri`); `kurulum()` `PANEL_ANAHTARI` üretir; `AYAR.gecikmeSecenekleri`.
- `_proje/randevu-sistemi/KURULUM.md` — gecikme paneli bölümü, yönetim tablosu, kurulum adımı, güvenlik notu.
- `_proje/usta-bilgi-formu.md` — dükkâna gönderilecek soru listesi ve doldurma yönergesi.

## Testler
- Node (saf + sahte Google servisleri): gecikme metni/yeni saat (14:30+15 → 14:45, 19:45+30 → 20:15), müşteri numarasına bağlantı, panel listesi (60 dk'dan eski ✗, KAPALI ✗, açıklamadan telefon, telefonsuz satır), HTML kaçışı (`<script>` → `&lt;script&gt;`), Hatırlat düğmesi, yanlış/eksik anahtarda takvim okunmuyor, `doPost` etiketleri + 2 gecikme bağlantısı + 60 dk paket + e-postada panel bağlantısı, eski hatırlatma fonksiyonları → **hepsi geçti**.
- Playwright (1280 px ve 375 px): `#usta` görünmüyor ve `img/usta.webp` istenmiyor, görünür `[DOLDURULACAK` yok, yatay taşma yok, paket "Randevu al" formda paketi seçiyor, gecikme sözü görünür, SSS HTML = JSON-LD (10 soru), WhatsApp modunda "Hizmet: Baba & Çocuk" mesaja yazılıyor, konsol hatası yok → **hepsi geçti**.

## Audit
| # | Sınıf | Önem | Bulgu | Durum |
|---|---|---|---|---|
| G1 | CONVERSION/FACT | ORTA | Site "sıra kayarsa haber veririz" diyor; gönderim dükkânın panele dokunmasına bağlı | ⚠️ teslimde dükkâna anlatılmalı; panel bağlantısı ana ekrana eklenmeli |
| G2 | SECURITY | ORTA | Panel bağlantısı müşteri ad/telefonunu gösterir | Gizli anahtar (UUID), `noindex`; sızarsa anahtar yenileme KURULUM'da |
| G3 | FACT | DÜŞÜK | Paket süreleri [VARSAYIM] | dükkân teyit etmeli (`AYAR.hizmetler`) |
| G4 | CONTENT | — | "Ustamız" yayında değil | dükkân bilgisi bekleniyor (`usta-bilgi-formu.md`) |
| G5 | TECHNICAL | DÜŞÜK | Sunucu kurulmadan (WhatsApp modu) panel/gecikme bağlantısı yok | Sistem kurulunca devreye girer |
