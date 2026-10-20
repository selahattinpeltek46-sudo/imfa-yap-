# Revizyon 1 — Tasarım inceliği (2026-10-20)

**İstek (kullanıcı):** "Hero bölümü, içerik/tasarım yapısı, butonlardaki ince detaylar, yazı stili daha iyi olabilir; amaç estetik, güven veren, kaliteli bir site."

| Alan | Önce | Sonra | Neden |
|---|---|---|---|
| Başlık yazı tipi | Schibsted Grotesk 800, sıkı aralık (kaba, "afiş" hissi) | **Newsreader** 500 (serif) — opsz 48'de sabitlenip Türkçe karakterlere indirildi: 39 KB | Usta işi / kalıcılık hissi; gövde metni grotesk kaldı |
| Giriş metin sütunu | H1 + alt metin + 2 düğme + mono not | + **antet**: teknik çizimin bilgi kutusu gibi 4 hücre (Hizmet · Konum · Google 5,0/131 · Fotoğraflar) | Güven bilgisi ilk ekranda, düğmelerin hemen altında; ayrı yorum şeridi kaldırıldı (tekrar) |
| Giriş kolajı | Derzli 3 fotoğraf | + **ölçü çizgileri** ("duvardan duvara", "tavana kadar") ve kaynak satırı | Ölçüye göre imalat fikrini görselle anlatır; sayı uydurulmadı |
| Düğmeler | LED çizgisi | + sağda ok (hover'da kayar), LED çizgisi hover'da uzar ve parlar, alt "baza" gölgesi, basınca 1 px iner; ikincil düğmede kulp çizgisi meşe rengine döner | İnce işçilik hissi |
| İş türü kapakları | Ad + içerik | Ad serif + **gerçek fotoğraf sayısı** (6, 12, 8, 8, 4) | Somut kanıt |
| Hizmet sayfaları | — | Düğmelerin altında 2 hücreli antet (sayfadaki fotoğraf sayısı + Google) | Aynı güven dili |
| Mobil sabit düğme | Hep görünür | İlk düğmeler ekrandan çıkınca görünür, mesaj bölümünde gizlenir | İlk ekranda içerik örtülmez |
| Metin | İşler girişi "fotoğrafları düzenlemeden paylaşıyoruz" | Kaldırıldı | Doğrulanmamış iddia |

Testler: `test.js` (7 sayfa × 2 ekran) ve `etkilesim.js` geçti. OG görseli yeni başlık yazı tipiyle yeniden üretildi.
