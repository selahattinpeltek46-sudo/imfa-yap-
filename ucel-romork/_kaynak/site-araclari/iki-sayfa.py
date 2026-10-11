# Gübre serpme ve su tankeri sayfalarını römork sayfasının üst/alt kısmıyla üretir
import re, json, urllib.parse
SITE = '/home/user/ucel-tarim-aletleri/'
URL = 'https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/'
HARITA = 'https://www.google.com/maps/search/?api=1&query=%C3%9C%C3%A7el%20Zirai%20Aletler%2C%20Yeni%20Mah.%2C%20G%C3%B6ksun%20Sanayi%20Sitesi%2C%20G%C3%B6ksun%2FKahramanmara%C5%9F'


def secim(etiket, soru, ler):
    return f'''        <fieldset data-etiket="{etiket}">
          <legend>{soru}</legend>
          <div class="us-secim">
''' + ''.join(f'            <label><input type="checkbox" value="{x}"><span>{x}</span></label>\n' for x in ler) + '''          </div>
        </fieldset>
'''


def alan(soru, ad, etiket, ornek, birim=None, sayi=False):
    ek = (' data-birim="%s"' % birim if birim else '') + (' inputmode="numeric"' if sayi else '')
    return '        <label class="us-alan">%s<input type="text" name="%s" data-etiket="%s"%s placeholder="%s" autocomplete="off"></label>\n' % (soru, ad, etiket, ek, ornek)


def sayfa(u):
    wa = f"Merhaba, sitenizdeki {u['ad']} için fiyat almak istiyorum."
    sorular = ''.join(f'        <li><b>{b}</b><span>{m}</span></li>\n' for b, m in u['secim'])
    galeri = ''.join(f'''        <figure><button type="button" class="us-buyut" data-buyuk="../../assets/{b}"><img src="../../assets/{k}" alt="{a}" loading="lazy" width="{w}" height="{h}"></button><figcaption>{c}</figcaption></figure>\n''' for b, k, a, w, h, c in u['galeri'])
    galeri_blok = ('      <div class="us-galeri">\n' + galeri + '      </div>\n') if galeri else ''
    sss = ''.join(f'        <details class="faq-item"><summary>{s}</summary><p>{c}</p></details>\n' for s, c in u['sss'])
    return f'''<main class="us">

  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb">
        <a href="../../index.html">Ana Sayfa</a><span>/</span><a href="../">Ürünler</a><span>/</span><span aria-current="page">{u['ad']}</span>
      </nav>
      <div class="us-giris-izgara">
        <div>
          <p class="us-etiket">{u['etiket']}</p>
          <h1>{u['ad']}</h1>
          <p class="us-fayda">{u['fayda']}</p>
          <p class="us-metin">{u['metin']}</p>
          <div class="us-butonlar">
            <a class="us-btn us-wa" href="#fiyat">Fiyat ve modeller</a>
            <a class="us-btn us-cizgi" href="tel:+905324803051">Ara: 0532 480 30 51</a>
          </div>
        </div>
        <figure class="us-ana-foto{u.get('foto_sinif', '')}"><img src="../../assets/{u['ana'][0]}" alt="{u['ana'][1]}" width="{u['ana'][2]}" height="{u['ana'][3]}"></figure>
      </div>
      <ul class="us-kisa">
''' + ''.join(f'        <li><b>{b}</b><span>{s}</span></li>\n' for b, s in u['kisa']) + f'''      </ul>
    </div>
  </section>

  <section class="us-bolum" id="fiyat">
    <div class="us-ic">
      <p class="us-etiket">Fiyat</p>
      <h2>{u['ad']} fiyatları</h2>
      <div id="fiyatTablo" data-urun="{u['veri']}" data-ad="{u['ad']}" hidden></div>
      <div id="fiyatBos" class="us-kutu">
        <p>Güncel fiyatı ve elimizdeki modelleri <b>WhatsApp'tan hemen iletiyoruz.</b> Aşağıdaki kısa formu doldurun; mesajınız hazır olarak açılsın, siz sadece gönderin.</p>
      </div>
      <form class="us-form">
        <p class="us-form-baslik">Size uygun {u['kucuk']} ve fiyatı için</p>
{u['form']}        <button type="submit" class="us-btn us-wa us-tam">WhatsApp'tan fiyat iste</button>
        <p class="us-kucuk">Boş bıraktığınız soruları WhatsApp'ta birlikte tamamlarız.</p>
      </form>
    </div>
  </section>

  <section class="us-bolum us-koyu">
    <div class="us-ic">
      <p class="us-etiket">Doğru seçim</p>
      <h2>Hangi {u['kucuk']} size uygun?</h2>
      <p class="us-metin">{u['secim_giris']}</p>
      <ol class="us-sorular">
{sorular}      </ol>
      <p class="us-adres">Daha fazlası için: <a href="../../tarim-rehberi/{u['rehber'][0]}/">{u['rehber'][1]} →</a></p>
    </div>
  </section>

  <section class="us-bolum" id="teslimat">
    <div class="us-ic">
      <p class="us-etiket">Teslimat</p>
      <h2>{u['ad']} size nasıl ulaşır?</h2>
      <ol class="us-adim">
        <li><b>WhatsApp'tan yazın</b><span>{u['adim1']}</span></li>
        <li><b>Teslim alın</b><span>Göksun'daki atölyemizden teslim alabilirsiniz. Başka şehirdeyseniz nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinize göre birlikte belirleriz.</span></li>
      </ol>
{galeri_blok}      <p class="us-adres"><b>Atölye:</b> Yeni Mah., Göksun Sanayi Sitesi, 46660 Göksun / Kahramanmaraş · Her gün 08:00 – 19:00 · <a href="{HARITA}" target="_blank" rel="noopener">Yol tarifi →</a></p>
    </div>
  </section>

  <section class="us-bolum us-koyu" id="sorular">
    <div class="us-ic">
      <p class="us-etiket">Sık sorulanlar</p>
      <h2>Merak ettikleriniz</h2>
      <div class="faq-list">
{sss}      </div>
    </div>
  </section>

  <section class="us-bolum us-son">
    <div class="us-ic">
      <h2>{u['son']}</h2>
      <p class="us-metin">{u['son_metin']}</p>
      <div class="us-butonlar">
        <a class="us-btn us-wa" data-msg="{wa}" href="https://wa.me/905324803051?text={urllib.parse.quote(wa)}" target="_blank" rel="noopener">WhatsApp'tan yaz</a>
        <a class="us-btn us-cizgi" href="tel:+905324803051">Ara: 0532 480 30 51</a>
      </div>
      <p class="us-diger">Diğer ürünler: {u['diger']} · <a href="../">Tümü</a></p>
    </div>
  </section>
</main>

<dialog id="usKutu" class="us-kutu-foto" aria-label="Fotoğraf"><form method="dialog"><button class="us-kapat" aria-label="Kapat">×</button></form><img alt=""><p></p></dialog>
'''


ORTAK_SSS = [
    ('Göksun dışına gönderiyor musunuz?', 'Evet, Türkiye geneline gönderim yapıyoruz. Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinizi yazın, seçeneği birlikte belirleyelim.'),
    ('Atölyenize gelip görebilir miyim?', 'Evet. Göksun Sanayi Sitesi\'ndeki atölyemize her gün 08:00 – 19:00 arası gelebilirsiniz. Gelmeden önce arayın, elimizdeki modelleri söyleyelim.'),
    ('Yedek parça bulabilir miyim?', 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz. İhtiyacınızı iletin, uygunluğuna bakalım.'),
    ('Garanti var mı?', 'Resmî bir garanti belgesi sunmuyoruz; sattığımız her ürünün arkasında duruyoruz. Bir sorun olursa bizi arayın.'),
]

URUNLER = [
    dict(yol='gubre-serpme', veri='gubre', ad='Gübre Serpme Makinesi', kucuk='gübre serpme makinesi', etiket='Gübreleme',
         baslik='Gübre Serpme Makinesi · Göksun | Üçel Tarım Aletleri', og='assets/gubre-serpme-mavi-goksun.jpg',
         desc="Kimyasal ya da organik gübreyi tarlanıza dengeli dağıtın. Traktörünüze ve tarlanıza uygun gübre serpme makinesini birlikte seçelim. Fiyat için formu doldurun.",
         fayda='Gübreyi tarlanıza dengeli dağıtın.',
         metin='Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine. Tarlanıza ve traktörünüze uygun olanı birlikte seçiyoruz.',
         ana=('gubre/romork-uzerinde.webp', 'Mavi gübre serpme makinesi, teslimat için römork üzerinde, müşterimizle', 687, 754), foto_sinif=' us-foto-tam',
         kisa=[('Kimyasal ve organik', 'gübre için'), ('Traktör arkasına', 'monte edilir'), ('Yedek parça', 'sattığımız ekipmanlar için'), ('Türkiye geneline', 'gönderim')],
         form=alan('1. Traktörünüz (marka / model)', 'traktor', 'Traktörüm', 'Örn. Erkunt Nitro 75') + alan('2. Beygir gücü (HP)', 'hp', 'Beygir gücü', 'Örn. 75', 'HP', True)
         + secim('Gübre türü', '3. Hangi gübreyi atacaksınız?', ['Kimyasal gübre', 'Organik gübre'])
         + alan('4. Tarlanız kaç dönüm?', 'donum', 'Tarla büyüklüğü', 'Örn. 100', 'dönüm', True) + alan('5. İl / ilçe', 'il', 'İl / ilçe', 'Örn. Pınarbaşı / Kayseri')
         + alan('İstediğiniz kapasite (isteğe bağlı)', 'not', 'İstediğim kapasite', 'Biliyorsanız yazın'),
         secim_giris='Makineyi üç soruya göre birlikte seçiyoruz:',
         secim=[('Hangi gübreyi atacaksınız?', 'Kimyasal ve organik gübre farklı akar ve farklı dağılır. Gübre türünü yazın.'),
                ('Tarlanız ne kadar büyük?', 'Büyük tarlada depo kapasitesi, kaç kez dolum yapacağınızı belirler. Dönümünüzü yazın.'),
                ('Traktörünüz kaç beygir?', 'Makine traktör arkasına monte edilir; dolu depoyu taşıyacak traktör gücü önemlidir.')],
         rehber=('gubre-serpme-secimi', 'Gübre serpme makinesi seçimi'),
         adim1='Traktörünüzü, gübre türünü ve tarlanızı konuşur, modeli ve fiyatı netleştiririz.',
         galeri=[],
         sss=[('Gübre serpme makinesi fiyatı ne kadar?', 'Fiyat modele ve kapasiteye göre değişir. <a href="#fiyat">Yukarıdaki formu</a> doldurun, güncel fiyatı WhatsApp\'tan iletelim.'),
              ('Hem kimyasal hem organik gübre atılır mı?', 'Gübre serpme makinesi kimyasal ya da organik gübreyi tarlanıza dengeli dağıtmak için kullanılır. Hangi gübreyi atacağınızı yazın, uygun modeli birlikte seçelim.'),
              ('Traktörüme uygun makineyi nasıl seçerim?', 'Traktörünüzün marka ve modelini, beygir gücünü ve tarlanızın büyüklüğünü yazın; uygun makineyi birlikte seçelim.')] + ORTAK_SSS
             + [('Eski makinemi takas edebilir miyim?', 'Evet. Fotoğrafını WhatsApp\'tan gönderin, değerlendirelim. <a href="../../takas/">Takas hakkında →</a>')],
         son='Gübre serpme makinenizi birlikte seçelim', son_metin='Traktörünüzü ve gübre türünü yazın, fiyatı ve uygun modeli iletelim.',
         diger='<a href="../romork/">Römork</a> · <a href="../su-tankeri/">Su tankeri</a> · <a href="../kultivator/">Kültivatör</a> · <a href="../tapan/">Tapan</a> · <a href="../pulluk/">Pulluk</a>'),
    dict(yol='su-tankeri', veri='tanker', ad='Su Tankeri', kucuk='su tankeri', etiket='Taşıma',
         baslik='Su Tankeri · Göksun | Üçel Tarım Aletleri', og='assets/su-tankeri-gubre-serpme.jpg',
         desc="Tarlaya da, hayvana da suyu traktörünüzle taşıyın. Traktörle çekilen su tankeri; ihtiyacınıza uygun tankeri birlikte seçelim. Fiyat için formu doldurun.",
         fayda='Tarlaya da, hayvana da suyu traktörünüzle taşıyın.',
         metin='Tarla sulaması, hayvan suyu ve genel su taşımacılığı için traktörle çekilen tanker. Suyu ne için taşıyacağınıza göre uygun tankeri birlikte seçiyoruz.',
         ana=('tanker/tanker.webp', 'İki su tankeri, mavi şasi ve gümüş tank', 938, 471),
         kisa=[('Traktörle çekilir', 'tarlaya, ahıra'), ('Tarla sulama', 've hayvan suyu'), ('Yedek parça', 'sattığımız ekipmanlar için'), ('Türkiye geneline', 'gönderim')],
         form=secim('Ne için kullanacağım', '1. Suyu ne için taşıyacaksınız?', ['Tarla sulama', 'Hayvan suyu', 'Su taşımacılığı'])
         + alan('2. Traktörünüz (marka / model)', 'traktor', 'Traktörüm', 'Örn. New Holland TD75') + alan('3. Beygir gücü (HP)', 'hp', 'Beygir gücü', 'Örn. 75', 'HP', True)
         + alan('4. İl / ilçe', 'il', 'İl / ilçe', 'Örn. Andırın / Kahramanmaraş') + alan('İstediğiniz kapasite (isteğe bağlı)', 'not', 'İstediğim kapasite', 'Biliyorsanız yazın'),
         secim_giris='Tankeri üç soruya göre birlikte seçiyoruz:',
         secim=[('Suyu ne için taşıyacaksınız?', 'Tarla sulaması, hayvan suyu ya da genel su taşımacılığı: ihtiyacınız tankerin büyüklüğünü belirler.'),
                ('Ne kadar suya ihtiyacınız var?', 'Günde kaç sefer yapacağınızı düşünün; doğru kapasite sizi gereksiz seferden kurtarır.'),
                ('Traktörünüz kaç beygir, yol nasıl?', 'Dolu tanker ağırdır. Traktörünüzün gücünü ve yolunuzu (yokuş, toprak yol) yazın, uygun tankeri önerelim.')],
         rehber=('su-tankeri-secimi', 'Su tankeri seçimi'),
         adim1='Suyu ne için taşıyacağınızı ve traktörünüzü konuşur, kapasiteyi ve fiyatı netleştiririz.',
         galeri=[('tanker/saha-1400.webp', 'tanker/saha-700.webp', 'İki su tankeri sahada, mavi şasi ve gümüş tank', 700, 462, 'Sahada iki tanker')],
         sss=[('Su tankeri fiyatı ne kadar?', 'Fiyat kapasiteye ve modele göre değişir. <a href="#fiyat">Yukarıdaki formu</a> doldurun, güncel fiyatı WhatsApp\'tan iletelim.'),
              ('Hangi kapasiteler var?', 'Elimizdeki kapasite seçeneklerini WhatsApp\'tan iletiyoruz. Suyu ne için taşıyacağınızı yazın, uygun olanı birlikte seçelim.'),
              ('Traktörüme uygun tankeri nasıl seçerim?', 'Traktörünüzün marka ve modelini, beygir gücünü ve suyu nerede taşıyacağınızı yazın; uygun tankeri birlikte seçelim.')] + ORTAK_SSS
             + [('Eski tankerimi takas edebilir miyim?', 'Evet. Fotoğrafını WhatsApp\'tan gönderin, değerlendirelim. <a href="../../takas/">Takas hakkında →</a>')],
         son='Su tankerinizi birlikte seçelim', son_metin='Suyu ne için taşıyacağınızı ve traktörünüzü yazın, fiyatı ve uygun modeli iletelim.',
         diger='<a href="../romork/">Römork</a> · <a href="../gubre-serpme/">Gübre serpme</a> · <a href="../on-yukleyici/">Loader kepçe</a> · <a href="../kultivator/">Kültivatör</a> · <a href="../pulluk/">Pulluk</a>'),
]

rom = open(SITE + 'urunler/romork/index.html', encoding='utf8').read()
bas0 = rom[:rom.index('<main class="us">')]
son = rom[rom.index('<footer'):]
odesc = re.search(r'<meta name="description" content="([^"]*)"', bas0).group(1)
for u in URUNLER:
    govde = sayfa(u)
    bas = bas0.replace(odesc, u['desc']).replace('Tarım Römorku · Göksun İmalatı | Üçel Tarım Aletleri', u['baslik'])
    bas = bas.replace(URL + 'urunler/romork/', URL + 'urunler/' + u['yol'] + '/').replace(URL + 'assets/romork-yesil-goksun.jpg', URL + u['og'])
    bas = bas.replace('"name": "Tarım Römorku",', f'"name": "{u["ad"]}",').replace('"position": 3, "name": "Römork"', f'"position": 3, "name": "{u["ad"]}"')
    faq = re.findall(r'<summary>(.*?)</summary><p>(.*?)</p>', govde)
    fj = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub('<[^>]+>', '', a)}} for q, a in faq]}, ensure_ascii=False, indent=1)
    bas = re.sub(r'<script type="application/ld\+json">\n\{\n "@context": "https://schema.org",\n "@type": "FAQPage".*?</script>', lambda m: '<script type="application/ld+json">\n' + fj + '\n</script>', bas, flags=re.S)
    bas = bas.replace('data-urun-ad="Tarım Römorku"', f'data-urun-ad="{u["ad"]}"')
    open(SITE + f'urunler/{u["yol"]}/index.html', 'w', encoding='utf8').write(bas + govde + '\n' + son)
    print(u['yol'], len(faq))
p = SITE + 'assets/fiyatlar.js'
s = open(p, encoding='utf8').read()
if 'gubre:' not in s:
    s = s.replace("  pulluk: [],", "  pulluk: [],\n  gubre: [],\n  tanker: [],")
    open(p, 'w', encoding='utf8').write(s)
