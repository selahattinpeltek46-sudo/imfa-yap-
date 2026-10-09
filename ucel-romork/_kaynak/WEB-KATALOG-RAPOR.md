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
