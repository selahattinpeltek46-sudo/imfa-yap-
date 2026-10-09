# Üçel web katalog — revizyon raporu (9 Ekim 2026)

Sayfa: https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/katalog/
Kaynak: `web-katalog.mjs` (metin `katalog5-metin.mjs`, teknik `teknik-veri.mjs`, fiyat `fiyat-veri.mjs`)

## 1. Mevcut durum (revizyon öncesi)

| Alan | Durum |
|---|---|
| Bölümler | Kapak · iş seçimi · 6 ürün · diğer ürünler · neden Üçel · takas · sahadan · SSS · iletişim |
| Bağlantılar | 9 `tel:`, 11 WhatsApp (ürüne özel mesaj), konum, PDF, site — hepsi çalışıyor |
| Güçlü yön | Hızlı, telefon öncelikli, gerçek fotoğraf, uydurma bilgi yok, kaynak etiketi (?k=) |
| Zayıf yön | Avantajlar kapalı bölmede gizli; iş seçimi sırası kart sırasından farklı; teslimat/destek bilgisi dağınık; fotoğraflar büyütülemiyor |

## 2. Hata listesi

| # | Bildirilen | Bulgu | Sonuç |
|---|---|---|---|
| 1 | `href="about:invalid#zCSafez"` | Yayındaki dosyada **yok**; 9 bağlantının hepsi `tel:+905324803051`. Bu ifade, bazı okuma araçlarının (Google'ın HTML temizleyicisi, yapay zekâ okuyucuları) gösteremediği `tel:` bağlantısının yerine yazdığı metindir | Hata değil, değişiklik gerekmedi |
| 2 | Alt çubuk butonları | WhatsApp ve Ara çalışıyor; çubuk üstteki butonlar görünmüyorken çıkıyor | ✅ |
| 3 | PDF bağlantısı | 200, `application/pdf`, 1,5 MB | ✅ |
| 4 | İş seçimi sırası ≠ kart sırası | Doğru tespit | ✅ Düzeltildi |
| 5 | Avantajlar gizli bölmede | Doğru tespit | ✅ Düzeltildi |

## 3. Uygulanan geliştirmeler

1. **Sıra birliği:** Ürün kartları kategoriye göre (taşıma → toprak işleme → yükleme → gübreleme → su) dizildi; "Ne yapmak istiyorsunuz?" listesi birebir aynı sırada, her ürün ayrı bağlantı.
2. **Görünür avantajlar:** Kapalı bölme kaldırıldı. Kendi imalatı ürünlerde "Üçel imalat avantajları", diğerlerinde "Neden Üçel?" başlıklı, ikonlu açık liste (kasa rengi/yazısı, özel imalat, yaylı ayak sistemi…). Tekrar eden maddeler ayıklandı.
3. **Üretim / satış ayrımı:** Kendi imalatı ürünlerde "Kendi imalatımız · Göksun atölyesi" rozeti.
4. **Teslimat ve destek bandı:** Türkiye geneline gönderim · Göksun ve çevresine yerinde · yedek parça · ikinci el ve takas (yalnızca sitede yazan bilgiler).
5. **Kutu ayrımı:** "Kimler için?" gri zemin + koyu sol çizgi; "Fiyat ve uygun model" açık yeşil zemin + yeşil sol çizgi.
6. **Fotoğraf büyütme:** Sahadan kareler ve ürün ek fotoğrafları dokununca büyüyor (1400 px), kapatma butonu ve dışına dokunma ile kapanıyor.
7. **Butonlar:** Yükseklik 56 px, ikon 24 px; bütün dokunma alanları ≥ 32 px (ölçüldü).
8. **Garanti metni:** Olumlu bilgi öne alındı, gerçek durum korundu: "İmal ettiğimiz ve sattığımız her ürünün arkasında duruyoruz; yedek parça desteğini Göksun'daki atölyemizden sağlıyoruz… Resmî garanti belgesi sunmuyoruz." (PDF'ler de güncellendi.)

## 4. Uygulanmayanlar ve nedeni (doğrulama gerekiyor)

Bunlar istenen metinde vardı ama Üçel'in teyit ettiği bilgi değil; yayına koymak müşteriye yanlış bilgi vermek olur.

| İstenen | Neden uygulanmadı | Teyit gelirse |
|---|---|---|
| "Kahramanmaraş, Sivas, Kayseri, Malatya, Adana, Osmaniye, Gaziantep'e **doğrudan** nakliye" | Sitede yalnızca "Türkiye geneline, genellikle anlaşmalı nakliye ile" yazıyor; il listesi ve "doğrudan" teslimat teyitli değil | İl listesi bandı 5 dakikada eklenir |
| "Üçel Birebir Usta ve İmalat **Garantisi** … revizyon ve teknik destek" | Sitede "Resmî garanti belgesi sunmuyoruz" ve "Genel bakım/onarım servisimiz yok" yazıyor. "Garanti" kelimesinin yasal bir anlamı var; çelişkili ve bağlayıcı olur | İşletme yazılı garanti verirse metin değişir |
| "Römork 2,5–10 ton, tek/çift dingil", "Kültivatör 7–13 ayak, ağır/hafif tip" | Bu aralıklar örnek olarak verilmiş, Üçel'in verisi değil | Teknik veri formuyla gelir, tablolar otomatik dolar |
| Fotoğraf altına "Elbistan teslimatı", "Sivas Gürün nakliyesi" | Fotoğrafların nerede çekildiği bilinmiyor | Üçel yer bilgisini verirse eklenir |

## 5. Ürün sunum şablonu (her ürün)

1. Fotoğraf (beyaz zemin ya da gerçek fotoğraf, kırpılmaz) → 2. Kategori + imalat rozeti → 3. Ürün adı → 4. Fayda cümlesi → 5. Tanım → 6. Nerede kullanılır (etiketler) → 7. Kimler için → 8. Fiyat / uygun model kutusu → 9. Teknik tablo (veri varsa) → 10. Avantajlar → 11. Ek fotoğraflar (büyütülebilir) → 12. Ürüne özel CTA + WhatsApp / Ara

## 6. Tasarım sistemi (web)

Renk: kırmızı #C8102E (vurgu), koyu #1F2124, zemin #F6F4F0, WhatsApp yeşili #1FA855 (yalnızca WhatsApp butonları ve fiyat kutusu çizgisi).
Yazı: Oswald (başlık), Inter (metin), Türkçe karakterler için latin-ext dosyalarıyla; gövde 16–17 px.
Bileşen: kart (üstte 6 px kırmızı çizgi), rozet, etiket (pill), bilgi kutusu (4 px sol çizgi), avantaj listesi (kırmızı daire içinde tik), buton (56 px).

## 7. Test raporu (390×844 telefon ekranı)

| Kontrol | Sonuç |
|---|---|
| `tel:` bağlantıları | 9 / 9 doğru |
| WhatsApp butonları | 11 / 11; `?k=mp` ile hepsi "(Marketplace)" etiketli |
| Geçersiz bağlantı (`about:`, `javascript:`) | 0 |
| Kırık iç bağlantı / dosya | 0 |
| PDF | 200, application/pdf |
| JavaScript hatası | 0 |
| Yatay kaydırma | Yok |
| 32 px altı dokunma alanı | 0 |
| Fotoğraf büyütme | Açılıyor, görsel yükleniyor, kapanıyor |
| İş seçimi ↔ kart sırası | Birebir aynı |

Doğrulanamayan: canlı adresi bu ortamdan açamadım (ağ kısıtı); testler yayına giden dosyaların aynısıyla, yerel sunucuda yapıldı.

---

# Tur 2 — `?k=ig` revizyonu (9 Ekim 2026)

Yedek: önceki sürüm `ucel-tarim-aletleri` deposunda `1d906c9` (etiket gönderimine sunucu izin vermedi; geri dönüş bu kayıtla yapılır).

## A. Tespitler (ölçümle)

| # | Tespit | Önem | Durum |
|---|---|---|---|
| 1 | WhatsApp butonlarında beyaz yazı / yeşil zemin kontrastı **3,09:1** (gerekli 4,5:1) — sayfanın ana butonları | Yüksek | ✅ #13843F ile **4,77:1** |
| 2 | Koyu üst bantta açık kırmızı etiketler **4,17:1** | Orta | ✅ #F0626B ile **5,12:1** |
| 3 | "Sattığımız … yedek parça" cümlesi 3 üründe aynen tekrar | Orta | ✅ Ürün kartlarından kaldırıldı; "Teslimat ve destek" bandında bir kez |
| 4 | Römork: "Kasa rengini ve yazısını…" ile "Kasaya isim…" neredeyse aynı | Düşük | ✅ Tek madde: "Kasa rengi ve yazısı isteğinize göre: isim, firma adı ya da “Maşallah”." |
| 5 | 13 px etiketler | Düşük | ✅ 14 px |
| 6 | Ürünler arası hızlı geçiş yok | Orta | ✅ Üstte yapışık ürün çubuğu (Römork · Kültivatör · Pulluk · Loader · Gübre · Su · Diğer · Takas · İletişim) |
| 7 | WhatsApp mesajları ürün sorusunu kısmen soruyordu | Orta | ✅ Ürüne özel sorular (aşağıda) |
| 8 | Yeni uzun mesajlar PDF'teki 6 QR'ı okunmaz yaptı (10/16) | **Kritik — yayına çıkmadan yakalandı** | ✅ QR için kısa mesaj kuralı: 16/16 |
| — | `about:invalid#zCSafez` | — | Dosyada yok (0); 9 `tel:` bağlantısı doğru |
| — | `<details>` içinde gizli avantajlar | — | Önceki turda kaldırıldı (0) |

## B. Değişen dosyalar

- `web-katalog.mjs` — renkler, kutu stilleri (#f4f6f4 zemin, #2e7d32 sol çizgi), ürün gezinme çubuğu, avantaj tekrar ayıklama, WhatsApp butonu (17 px, gölge)
- `katalog5-metin.mjs` — ürün başına WhatsApp mesajları, römork avantaj maddesi
- `katalog5.mjs` — basılı QR için kısa mesaj (`qrMesaj`, kodlanmış ≤ 180 karakter)
- Site: `katalog/`, `assets/katalog/*.pdf`

## C. Ürün bazlı WhatsApp mesajları

| Ürün | Sorulanlar |
|---|---|
| Römork | Taşıyacağım yük · İstediğim kasa ölçüsü / kapasite · Traktörüm (marka / model) |
| Kültivatör | Traktörüm ve HP · İstediğim ayak sayısı / çalışma genişliği |
| Pulluk | Traktörüm ve HP · Toprak yapısı / istediğim model |
| Loader kepçe | Traktörüm (marka / model) · Ne için kullanacağım |
| Gübre serpme | İstediğim kapasite · Gübre türü · Traktörüm ve HP |
| Su tankeri | İstediğim kapasite · Ne için kullanacağım · Traktörüm |

Hepsi "Merhaba, Üçel kataloğunda gördüğüm [ürün] hakkında bilgi almak istiyorum." ile başlar; `?k=` ile kaynak etiketi eklenir.

## D. Ürün bazında eksik bilgiler [İŞLETMEDEN DOĞRULANACAK]

| Ürün | Eksik |
|---|---|
| Römork | Kapasite seçenekleri (4 tonluk model teyidi), kasa ölçüleri, dingil, lastik, damper, gereken HP |
| Kültivatör | Ayak sayısı seçenekleri, çalışma genişliği, ağırlık, bağlantı, gereken HP |
| Pulluk | Üretim mi satış mı, gövde sayısı, iş genişliği, ağırlık, HP; yeni fotoğraf |
| Loader kepçe | Uyumlu traktörler, kaldırma kapasitesi / yüksekliği, kova genişliği, ataşmanlar; tam kadraj fotoğraf |
| Gübre serpme | Üretim mi satış mı, kapasite, serpme genişliği, tahrik, HP; ürünün tek başına fotoğrafı |
| Su tankeri | Üretim mi satış mı, kapasite seçenekleri, tank malzemesi, pompa, HP |
| Genel | Fiyat listesi; teslimat yapılan iller ve "doğrudan / kapıda" teslimat; garanti metni; fotoğrafların çekildiği yerler; müşteri fotoğraf izni |

## E. Test edilenler (yerel sunucu, yayına giden dosyaların aynısı)

| Kontrol | Sonuç |
|---|---|
| Telefon 390 px / tablet 820 px / masaüstü 1440 px yatay taşma | Yok / yok / yok |
| Kontrast (4,5:1 altı metin) | 0 |
| JavaScript / konsol hatası | 0 |
| Başlık hiyerarşisi | 1 × H1, bölümler H2, alt başlıklar H3 |
| `tel:` / WhatsApp | 9 / 11, hepsi doğru; `?k=mp` ile etiketli |
| İlk ekran yükü | 312 KB (görsellerin geri kalanı kaydırdıkça) |
| Görseller | İlk 2 görsel hemen, diğerleri `loading="lazy"` |
| PDF | 200, application/pdf; QR 16/16 (200 ve 100 dpi) |
| Fotoğraf büyütme, ürün çubuğu | Çalışıyor |

## F. Test edilemeyen / onay bekleyen

- Canlı adres bu ortamdan açılamıyor (ağ kısıtı); yayının başarıyla tamamlandığı GitHub kaydından doğrulanıyor.
- Instagram uygulama içi tarayıcıda gerçek cihaz testi: işletmenin telefonundan yapılmalı.
- **İl listesiyle "doğrudan kapıda teslimat" bandı** ve **"Üçel İmalat & Usta Garantisi" metni**: sitedeki mevcut bilgilerle çelişiyor (site: "anlaşmalı nakliye", "resmî garanti belgesi yok", "genel bakım/onarım servisimiz yok"). İşletme onaylarsa eklenir.
- **Fotoğraf altına teslimat yeri** ("Elbistan teslimatı" vb.): fotoğrafların nerede çekildiği bilinmiyor.

## G. Sonraki öneriler

1. Fiyat listesi gelince fiyat kutularının açılması (altyapı hazır)
2. Teknik veri formunun doldurulması → model tabloları
3. Kısa alan adı (ör. uceltarim.com) → kartlara, tabelaya yazılabilir
4. Teslimat yapılan illerin teyidi → bölgesel güven bandı
5. Pulluk / gübre serpme yeni fotoğrafları
