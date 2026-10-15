# REVİZYON 2 — Randevu hatırlatması (2 saat önce)

Tarih: 2026-10-15 · Tetikleyici: kullanıcı "randevudan 1–2 saat önce hatırlatma mesajı gelse" dedi; seçenekler sunuldu (1: müşterinin takvim alarmı, 2: dükkândan tek dokunuşla WhatsApp, 3: ücretli SMS / WhatsApp API) → kullanıcı **1 + 2**'yi seçti. Süre: 2 saat (müşteri iptal ederse saat başkasına verilebilir).

## Karar
| Seçenek | Maliyet | Otomasyon | Durum |
|---|---|---|---|
| 1. `.ics` takvim dosyası, `VALARM -PT120M` | Ücretsiz | Müşteri "Telefonuma ekle"ye dokunursa tam otomatik | ✅ yapıldı |
| 2. Takvim bildirimi + Gmail e-postası → `wa.me` hazır mesaj | Ücretsiz | Dükkân tek dokunuş | ✅ yapıldı |
| 3. SMS (Netgsm vb.) / WhatsApp Business API | Mesaj başı ücret, başlık/şablon onayı | Tam otomatik | ⏳ ileride; kod hazır nokta: `hatirlatmaKontrol` |

## Değişen dosyalar
- `_proje/randevu-sistemi/Code.gs` — saf fonksiyonlar `hatirlatmaMetni`, `hatirlatmaLinki`, `aciklamadanTelefon`, `hatirlatilacaklar`; randevu kaydında etkinliğe ad/telefon/hizmet etiketi, 120 dk takvim bildirimi, açıklamaya WhatsApp bağlantısı; `hatirlatmaKontrol` (15 dk'lık zaman tetikleyicisi, tek e-posta, "bildirildi" etiketi); `kurulum()` tetikleyiciyi oluşturur; `AYAR.hatirlatmaDakika/hatirlatmaEposta/dukkanAdi/dukkanAdres`.
- `_proje/randevu-sistemi/appsscript.json` — `script.scriptapp` izni (tetikleyici için).
- `_proje/randevu-sistemi/KURULUM.md` — §1b hatırlatma, yönetim tablosu, kurulum adımı.
- `js/site.js` — `icsMetni()` (UTC saat, RFC 5545 kaçışları, CRLF), sonuç ekranında `data:text/calendar` indirme bağlantısı.
- `js/ayarlar.js` — `hatirlatmaDakika: 120`.
- `index.html` — sonuç ekranında "Telefonuma ekle" (birincil) + açıklama, "Google Takvim" (ikincil); yeni SSS "Randevumu bana hatırlatır mısınız?" (HTML + JSON-LD).
- `css/site.css` — `.hatirlat` kutusu; sonuç başlığı renk düzeltmesi.
- `kvkk/index.html` — işleme amacına randevu hatırlatması; "reklam mesajı gönderilmez".

## Testler
- Node (saf + sahte Google servisleri, 18 madde): metin, müşteri numarasına link, açıklamadan telefon (boşluklu/+90/yok), pencere (110 dk ✓ / 130 dk ✗ / başlamış ✗), tekrar yok, az önce alınan ✗, KAPALI ✗, telefonsuz elle ✗, telefonlu elle ✓; `hatirlatmaKontrol` yalnız uygun randevuyu e-postalıyor, etiketliyor, ikinci turda tekrar göndermiyor → **hepsi geçti**.
- Playwright (26 madde, önceki uçtan uca testler + `.ics`): `TRIGGER:-PT120M`, `UID`, CRLF, 09:00 TR = `06:00Z`, süre 30 dk, virgül kaçışları → **hepsi geçti**.
- Test betiği hataları (kod değil): sahte etkinlikte gelecekteki oluşturma tarihi; "az önce alındı" senaryosunun yanlış kurulması.

## Audit
| # | Sınıf | Önem | Bulgu | Durum |
|---|---|---|---|---|
| H1 | CONVERSION/FACT | ORTA | Site "dükkândan WhatsApp hatırlatması gelir" diyor; gönderim dükkânın dokunmasına bağlı | ⚠️ dükkâna kurulumda anlatılmalı; unutuluyorsa SMS'e geçilmeli |
| H2 | TECHNICAL | DÜŞÜK | Instagram/WhatsApp uygulama içi tarayıcılar `.ics` indirmeyi engelleyebilir | "Google Takvim" yedek düğmesi duruyor |
| H3 | LEGAL | DÜŞÜK | Hatırlatma bilgilendirme iletisidir (ticari ileti değil) — KVKK metnine eklendi | hukuki kontrol gerekir |
| H4 | TECHNICAL | DÜŞÜK | WhatsApp modunda (sunucu kurulmadan) randevu kesinleşmediği için `.ics`/hatırlatma yok | Sistem kurulunca devreye girer |
