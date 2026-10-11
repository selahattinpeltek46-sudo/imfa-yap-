# Site üretim araçları (ucel-tarim-aletleri)

Site sayfaları bu betiklerle üretildi; `romork/index.html` üst/alt kısmı şablon olarak kullanılır.

| Betik | Ürettiği sayfalar |
|---|---|
| `liste-sayfalar.py` | urunler/ (hub) ve 4 kategori; `URUN` sözlüğü: ad, görsel, **imalat rozeti** |
| `dort-sayfa.py` | mibzer, çayır biçme, yedek parça, diğer |
| `iki-sayfa.py` | gübre serpme, su tankeri |
| `kurumsal.py` | ikinci el, takas, imalat, iletişim, hakkımızda, Göksun, tarım makineleri |
| `genel-test.mjs` | `node genel-test.mjs urunler/romork/ ...` → taşma, kontrast, kırık bağlantı, H1, WhatsApp etiketi, form mesajı |

Römork, tapan, kültivatör, loader kepçe, pulluk ve ana sayfa elle yazıldı (bu klasörde betiği yok).
Fiyatlar: `ucel-tarim-aletleri/assets/fiyatlar.js` (tek dosya). Bir ürün imalat teyidi alırsa `liste-sayfalar.py` içindeki `URUN[...]` son alanını `True` yapın.
