# Mibzer, çayır biçme, yedek parça, diğer: ürün sayfası şablonuyla (fotoğrafsız giriş)
import re, json, urllib.parse
SITE = '/home/user/ucel-tarim-aletleri/'
URL = 'https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/'
HARITA = 'https://www.google.com/maps/search/?api=1&query=%C3%9C%C3%A7el%20Zirai%20Aletler%2C%20Yeni%20Mah.%2C%20G%C3%B6ksun%20Sanayi%20Sitesi%2C%20G%C3%B6ksun%2FKahramanmara%C5%9F'


def secim(etiket, soru, ler):
    return ('        <fieldset data-etiket="%s">\n          <legend>%s</legend>\n          <div class="us-secim">\n' % (etiket, soru)
            + ''.join('            <label><input type="checkbox" value="%s"><span>%s</span></label>\n' % (x, x) for x in ler) + '          </div>\n        </fieldset>\n')


def alan(soru, ad, etiket, ornek, birim=None, sayi=False):
    ek = (' data-birim="%s"' % birim if birim else '') + (' inputmode="numeric"' if sayi else '')
    return '        <label class="us-alan">%s<input type="text" name="%s" data-etiket="%s"%s placeholder="%s" autocomplete="off"></label>\n' % (soru, ad, etiket, ek, ornek)


TRAKTOR = alan('Traktörünüz (marka / model)', 'traktor', 'Traktörüm', 'Örn. New Holland TT50') + alan('Beygir gücü (HP)', 'hp', 'Beygir gücü', 'Örn. 50', 'HP', True)
IL = alan('İl / ilçe', 'il', 'İl / ilçe', 'Örn. Göksun / Kahramanmaraş')
TESLIM = "Göksun'daki atölyemizden teslim alabilirsiniz. Başka şehirdeyseniz nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinize göre birlikte belirleriz."
ORTAK = [
    ('Göksun dışına gönderiyor musunuz?', 'Evet, Türkiye geneline gönderim yapıyoruz. Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinizi yazın, seçeneği birlikte belirleyelim.'),
    ('Atölyenize gelip görebilir miyim?', 'Evet. Göksun Sanayi Sitesi\'ndeki atölyemize her gün 08:00 – 19:00 arası gelebilirsiniz. Gelmeden önce arayın, elimizdeki modelleri söyleyelim.'),
]
YP = ('Yedek parça bulabilir miyim?', 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz. İhtiyacınızı iletin, uygunluğuna bakalım. <a href="../yedek-parca/">Yedek parça →</a>')
GAR = ('Garanti var mı?', 'Resmî bir garanti belgesi sunmuyoruz; sattığımız her ürünün arkasında duruyoruz. Bir sorun olursa bizi arayın.')
TAKAS = ('Eski ekipmanımı takas edebilir miyim?', 'Evet. Fotoğrafını WhatsApp\'tan gönderin, değerlendirelim. <a href="../../takas/">Takas hakkında →</a>')
SIRA = '''  <section class="us-bolum">
    <div class="us-ic">
      <p class="us-etiket">Toprak hazırlığı</p>
      <h2>Mibzer işin neresinde?</h2>
      <ol class="us-adim">
        <li><b><a href="../pulluk/">Pulluk</a></b><span>Toprağı derin sürer, anızı gömer.</span></li>
        <li><b><a href="../kultivator/">Kültivatör</a></b><span>Sürülmüş toprağın yüzeyini inceltir.</span></li>
        <li><b><a href="../tapan/">Tapan</a></b><span>Yüzeyi düzler, kesekleri kırar, toprağı bastırır.</span></li>
        <li><b>Mibzer</b><span>Tohumu düzenli sıra aralığıyla toprağa yerleştirir.</span></li>
      </ol>
    </div>
  </section>
'''

U = [
    dict(yol='mibzer', ad='Mibzer', kucuk='mibzer', etiket='Ekim', baslik='Mibzer · Göksun | Üçel Tarım Aletleri',
         desc="Tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makinesi. Traktörünüze ve ekeceğiniz ürüne uygun mibzeri birlikte seçelim.",
         fayda='Tohumunuzu düzenli sıra aralığıyla ekin.',
         metin='Mibzer, tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makinesidir. Tahıl ve yem bitkisi ekimi yapan çiftçiler için; traktörünüze ve ekeceğiniz ürüne uygun mibzeri birlikte seçiyoruz.',
         kisa=[('Tahıl ve yem bitkisi', 'ekimi'), ('Düzenli sıra aralığı', 'dengeli ekim'), ('Traktörünüze göre', 'birlikte seçelim'), ('Türkiye geneline', 'gönderim')],
         form=secim('Ekeceğim ürün', '1. Ne ekeceksiniz?', ['Tahıl', 'Yem bitkisi']) + TRAKTOR + alan('Tarlanız kaç dönüm?', 'donum', 'Tarla büyüklüğü', 'Örn. 80', 'dönüm', True) + IL,
         secim_l=[('Ne ekeceksiniz?', 'Tahıl ile yem bitkisinin tohumu farklıdır; ekeceğiniz ürün mibzer seçimini belirler.'),
                  ('Traktörünüz kaç beygir?', 'Mibzerin genişliği traktör gücünüze uygun olmalı. Beygir gücünüzü yazın.'),
                  ('Tarlanız ne kadar büyük?', 'Büyük tarlada geniş mibzer zaman kazandırır; küçük ve dağınık tarlada dar mibzer daha rahat döner.')],
         ek=SIRA, adim1='Ekeceğiniz ürünü ve traktörünüzü konuşur, modeli ve fiyatı netleştiririz.',
         sss=[('Mibzer fiyatı ne kadar?', 'Fiyat modele göre değişir. <a href="#fiyat">Yukarıdaki formu</a> doldurun, güncel fiyatı WhatsApp\'tan iletelim.'),
              ('Hangi ürünlerin ekiminde kullanılır?', 'Tahıl ve yem bitkisi ekiminde. Ekeceğiniz ürünü yazın, uygun mibzeri birlikte seçelim.')] + ORTAK + [YP, GAR, TAKAS],
         diger='<a href="../tapan/">Tapan</a> · <a href="../kultivator/">Kültivatör</a> · <a href="../pulluk/">Pulluk</a> · <a href="../gubre-serpme/">Gübre serpme</a>'),
    dict(yol='cayir-bicme', ad='Çayır Biçme Makinesi', kucuk='çayır biçme makinesi', etiket='Kaba yem', baslik='Çayır Biçme Makinesi · Göksun | Üçel Tarım Aletleri',
         desc="Kaba yem üretimi için çayır, yonca ve otlak biçiminde kullanılan makine. Traktörünüze ve alanınıza uygun modeli birlikte seçelim; fiyat için formu doldurun.",
         fayda='Kaba yeminizi kendiniz biçin.',
         metin='Çayır biçme makinesi, kaba yem üretimi için çayır, yonca ve otlak biçiminde kullanılır. Hayvancılık yapan, kaba yem üreten çiftçiler için; traktörünüze uygun modeli birlikte seçiyoruz.',
         kisa=[('Çayır, yonca, otlak', 'biçimi'), ('Kaba yem', 'üretimi için'), ('Traktörünüze göre', 'birlikte seçelim'), ('Türkiye geneline', 'gönderim')],
         form=secim('Biçeceğim alan', '1. Ne biçeceksiniz?', ['Çayır', 'Yonca', 'Otlak']) + TRAKTOR + alan('Alanınız kaç dönüm?', 'donum', 'Alan büyüklüğü', 'Örn. 30', 'dönüm', True) + IL,
         secim_l=[('Ne biçeceksiniz?', 'Çayır, yonca ya da otlak: biçeceğiniz alanı yazın.'),
                  ('Traktörünüz kaç beygir?', 'Makine traktörünüze uygun olmalı. Marka, model ve beygir gücünü yazın.'),
                  ('Alanınız ne kadar büyük?', 'Biçeceğiniz alanın büyüklüğü, size uygun modeli belirlemeye yardım eder.')],
         ek='', adim1='Biçeceğiniz alanı ve traktörünüzü konuşur, modeli ve fiyatı netleştiririz.',
         sss=[('Çayır biçme makinesi fiyatı ne kadar?', 'Fiyat modele göre değişir. <a href="#fiyat">Yukarıdaki formu</a> doldurun, güncel fiyatı WhatsApp\'tan iletelim.'),
              ('Nerede kullanılır?', 'Kaba yem üretimi için çayır, yonca ve otlak biçiminde.')] + ORTAK + [YP, GAR, TAKAS],
         diger='<a href="../romork/">Römork</a> · <a href="../on-yukleyici/">Loader kepçe</a> · <a href="../su-tankeri/">Su tankeri</a> · <a href="../mibzer/">Mibzer</a>'),
    dict(yol='yedek-parca', ad='Yedek Parça', kucuk='yedek parça', etiket='Destek', baslik='Tarım Aletleri Yedek Parça · Göksun | Üçel Tarım Aletleri',
         desc="Sattığımız ve sık kullanılan tarım ekipmanları için yedek parça. Parçanın fotoğrafını WhatsApp'tan gönderin, uygunluğuna bakalım. Göksun'dan Türkiye geneline gönderim.",
         fayda='Aletiniz yarı yolda kalmasın.',
         metin='Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz; kendi ürettiğimiz ürünlerin yedek parçasını da sağlıyoruz. İhtiyacınızı iletin, uygunluğuna birlikte bakalım.',
         kisa=[('Kendi ürettiğimiz', 'ürünler için'), ('Sattığımız ekipmanlar', 'için'), ('Fotoğrafla sorun', 'WhatsApp\'tan'), ('Türkiye geneline', 'gönderim')],
         form=alan('1. Hangi ekipman için?', 'ekipman', 'Ekipman', 'Örn. Üçel römork, kültivatör') + alan('2. Hangi parça?', 'parca', 'Parça', 'Örn. kültivatör ayağı') + alan('3. Ekipmanın markası / modeli (biliyorsanız)', 'model', 'Marka / model', 'Biliyorsanız yazın') + IL,
         form_giris='Merhaba, sitenizden yedek parça soruyorum.', form_baslik='Parçayı sormak için', form_not='Parçanın fotoğrafını WhatsApp\'ta gönderirseniz daha hızlı bakarız.',
         fiyat_baslik='Yedek parça sorun', bos_metin='Parçanın uygunluğunu ve fiyatını <b>WhatsApp\'tan iletiyoruz.</b> Aşağıdaki kısa formu doldurun; mesajınız hazır olarak açılsın, ardından parçanın fotoğrafını gönderin.',
         secim_baslik='Doğru parçayı nasıl buluruz?', secim_giris='Parçayı hızlı bulmamız için üç bilgi yeterli:',
         secim_l=[('Hangi ekipman?', 'Römork, kültivatör, loader kepçe ya da başka bir ekipman: hangi alet için parça aradığınızı yazın.'),
                  ('Hangi parça?', 'Parçanın adını bilmiyorsanız sorun değil; fotoğrafını göndermeniz yeterli.'),
                  ('Marka ve model', 'Ekipmanın markasını ve modelini biliyorsanız yazın; Üçel imalatıysa söylemeniz yeterli.')],
         ek='', adim1='Parçayı ve ekipmanınızı konuşur, uygunluğa ve fiyata birlikte bakarız.', rehber=None,
         sss=[('Her parça bulunuyor mu?', 'Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz; ihtiyacınızı bize iletin, uygunluğuna bakalım.'),
              ('Kendi ürettiğiniz ürünlerin parçası var mı?', 'Evet, kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyoruz.'),
              ('Bakım ve onarım yapıyor musunuz?', 'Genel bir bakım/onarım servisimiz yok. Kendi ürettiğimiz ve sattığımız ürünler için yedek parça sağlıyor, elimizden geldiğince yönlendiriyoruz.')] + ORTAK,
         diger='<a href="../romork/">Römork</a> · <a href="../kultivator/">Kültivatör</a> · <a href="../on-yukleyici/">Loader kepçe</a> · <a href="../pulluk/">Pulluk</a>'),
    dict(yol='diger', ad='Diğer Tarım Aletleri', kucuk='ekipman', etiket='Diğer ürünler', baslik='Diğer Tarım Aletleri · Göksun | Üçel Tarım Aletleri',
         desc="Listede görmediğiniz bir tarım ekipmanı mı arıyorsunuz? Traktörünüzü ve işinizi yazın, birlikte bakalım. Üçel Tarım Aletleri, Göksun.",
         fayda='Aradığınızı listede bulamadınız mı? Sorun, birlikte bakalım.',
         metin='Sitede tek tek listelemediğimiz tarım ekipmanları için de bize yazabilirsiniz. Ne aradığınızı ve traktörünüzü anlatın; elimizdeki ve bulabileceğimiz seçenekleri birlikte değerlendirelim.',
         kisa=[('Listede yoksa', 'sorun'), ('Traktörünüze göre', 'birlikte bakalım'), ('İkinci el ve takas', 'seçenekleri'), ('Türkiye geneline', 'gönderim')],
         form=alan('1. Aradığınız ekipman', 'ekipman', 'Aradığım ekipman', 'Örn. balya makinesi') + TRAKTOR + IL,
         form_giris='Merhaba, sitenizden yazıyorum. Bir ekipman arıyorum.', form_baslik='Aradığınızı yazın',
         fiyat_baslik='Ne arıyorsunuz?', bos_metin='Aradığınız ekipmanı yazın; <b>WhatsApp\'tan hemen dönüş yapalım.</b>',
         secim_baslik='Bu ürünler de bizde', secim_giris='Aradığınız aşağıdakilerden biriyse doğrudan sayfasına gidin:',
         secim_l=[('<a href="../romork/">Römork</a> · <a href="../kultivator/">Kültivatör</a> · <a href="../on-yukleyici/">Loader kepçe</a>', 'Kendi imalatımız.'),
                  ('<a href="../tapan/">Tapan</a> · <a href="../pulluk/">Pulluk</a> · <a href="../mibzer/">Mibzer</a>', 'Toprak hazırlığı ve ekim.'),
                  ('<a href="../gubre-serpme/">Gübre serpme</a> · <a href="../su-tankeri/">Su tankeri</a> · <a href="../cayir-bicme/">Çayır biçme</a>', 'Gübreleme, su ve kaba yem.'),
                  ('<a href="../../ikinci-el/">İkinci el</a> · <a href="../../takas/">Takas</a> · <a href="../yedek-parca/">Yedek parça</a>', 'Eski aletinizi değerlendirin, parçanızı bulun.')],
         ek='', adim1='Aradığınızı ve traktörünüzü konuşur, seçenekleri birlikte değerlendiririz.', rehber=None,
         sss=[('Aradığım ürün burada yoksa ne yapmalıyım?', 'Bizi arayın ya da WhatsApp\'tan yazın, ihtiyacınızı birlikte değerlendirelim.')] + ORTAK + [TAKAS],
         diger='<a href="../">Tüm ürünler</a>'),
]
REHBER = {'mibzer': None, 'cayir-bicme': None}


def sayfa(u):
    wa = "Merhaba, sitenizdeki %s için fiyat almak istiyorum." % u['ad'] if u['yol'] not in ('yedek-parca', 'diger') else u['form_giris']
    giris_attr = ' data-giris="%s"' % u['form_giris'] if u.get('form_giris') else ''
    sorular = ''.join('        <li><b>%s</b><span>%s</span></li>\n' % x for x in u['secim_l'])
    sss = ''.join('        <details class="faq-item"><summary>%s</summary><p>%s</p></details>\n' % x for x in u['sss'])
    kisa = ''.join('        <li><b>%s</b><span>%s</span></li>\n' % x for x in u['kisa'])
    return f'''<main class="us">

  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb">
        <a href="../../index.html">Ana Sayfa</a><span>/</span><a href="../">Ürünler</a><span>/</span><span aria-current="page">{u['ad']}</span>
      </nav>
      <p class="us-etiket">{u['etiket']}</p>
      <h1>{u['ad']}</h1>
      <p class="us-fayda">{u['fayda']}</p>
      <p class="us-metin">{u['metin']}</p>
      <div class="us-butonlar">
        <a class="us-btn us-wa" href="#fiyat">{'Parça sor' if u['yol'] == 'yedek-parca' else 'Ne aradığınızı yazın' if u['yol'] == 'diger' else 'Fiyat ve modeller'}</a>
        <a class="us-btn us-cizgi" href="tel:+905324803051">Ara: 0532 480 30 51</a>
      </div>
      <ul class="us-kisa">
{kisa}      </ul>
    </div>
  </section>

  <section class="us-bolum" id="fiyat">
    <div class="us-ic">
      <p class="us-etiket">{'Sorun' if u.get('fiyat_baslik') else 'Fiyat'}</p>
      <h2>{u.get('fiyat_baslik', u['ad'] + ' fiyatları')}</h2>
      <div id="fiyatBos" class="us-kutu">
        <p>{u.get('bos_metin', "Güncel fiyatı ve elimizdeki modelleri <b>WhatsApp'tan hemen iletiyoruz.</b> Aşağıdaki kısa formu doldurun; mesajınız hazır olarak açılsın, siz sadece gönderin.")}</p>
      </div>
      <form class="us-form"{giris_attr}>
        <p class="us-form-baslik">{u.get('form_baslik', 'Size uygun ' + u['kucuk'] + ' ve fiyatı için')}</p>
{u['form']}        <button type="submit" class="us-btn us-wa us-tam">WhatsApp'tan sor</button>
        <p class="us-kucuk">{u.get('form_not', "Boş bıraktığınız soruları WhatsApp'ta birlikte tamamlarız.")}</p>
      </form>
    </div>
  </section>

  <section class="us-bolum us-koyu">
    <div class="us-ic">
      <p class="us-etiket">Doğru seçim</p>
      <h2>{u.get('secim_baslik', 'Hangi ' + u['kucuk'] + ' size uygun?')}</h2>
      <p class="us-metin">{u.get('secim_giris', 'Üç soruya göre birlikte seçiyoruz:')}</p>
      <ol class="us-sorular">
{sorular}      </ol>
    </div>
  </section>

{u['ek']}  <section class="us-bolum us-koyu" id="teslimat">
    <div class="us-ic">
      <p class="us-etiket">Teslimat</p>
      <h2>Size nasıl ulaşır?</h2>
      <ol class="us-adim">
        <li><b>WhatsApp'tan yazın</b><span>{u['adim1']}</span></li>
        <li><b>Teslim alın</b><span>{TESLIM}</span></li>
      </ol>
      <p class="us-adres"><b>Atölye:</b> Yeni Mah., Göksun Sanayi Sitesi, 46660 Göksun / Kahramanmaraş · Her gün 08:00 – 19:00 · <a href="{HARITA}" target="_blank" rel="noopener">Yol tarifi →</a></p>
    </div>
  </section>

  <section class="us-bolum" id="sorular">
    <div class="us-ic">
      <p class="us-etiket">Sık sorulanlar</p>
      <h2>Merak ettikleriniz</h2>
      <div class="faq-list">
{sss}      </div>
    </div>
  </section>

  <section class="us-bolum us-son us-koyu">
    <div class="us-ic">
      <h2>Birlikte bakalım</h2>
      <p class="us-metin">Traktörünüzü ve ihtiyacınızı yazın, uygun seçeneği ve fiyatı iletelim.</p>
      <div class="us-butonlar">
        <a class="us-btn us-wa" data-msg="{wa}" href="https://wa.me/905324803051?text={urllib.parse.quote(wa)}" target="_blank" rel="noopener">WhatsApp'tan yaz</a>
        <a class="us-btn us-cizgi" href="tel:+905324803051">Ara: 0532 480 30 51</a>
      </div>
      <p class="us-diger">Diğer ürünler: {u['diger']} · <a href="../">Tümü</a></p>
    </div>
  </section>
</main>
'''


rom = open(SITE + 'urunler/romork/index.html', encoding='utf8').read()
bas0 = rom[:rom.index('<main class="us">')]
son = rom[rom.index('<footer'):]
odesc = re.search(r'<meta name="description" content="([^"]*)"', bas0).group(1)
for u in U:
    govde = sayfa(u)
    bas = bas0.replace(odesc, u['desc']).replace('Tarım Römorku · Göksun İmalatı | Üçel Tarım Aletleri', u['baslik'])
    bas = bas.replace(URL + 'urunler/romork/', URL + 'urunler/' + u['yol'] + '/')
    bas = re.sub(r'\n\s*"image": "[^"]*",', '', bas)
    bas = re.sub(r'<meta property="og:image" content="[^"]*">\n', '<meta property="og:image" content="' + URL + 'katalog/img/paylasim.jpg">\n', bas)
    bas = re.sub(r'<meta name="twitter:image" content="[^"]*">\n', '<meta name="twitter:image" content="' + URL + 'katalog/img/paylasim.jpg">\n', bas)
    bas = bas.replace('"name": "Tarım Römorku",', '"name": "%s",' % u['ad']).replace('"position": 3, "name": "Römork"', '"position": 3, "name": "%s"' % u['ad'])
    faq = re.findall(r'<summary>(.*?)</summary><p>(.*?)</p>', govde)
    fj = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub('<[^>]+>', '', a)}} for q, a in faq]}, ensure_ascii=False, indent=1)
    bas = re.sub(r'<script type="application/ld\+json">\n\{\n "@context": "https://schema.org",\n "@type": "FAQPage".*?</script>', lambda m: '<script type="application/ld+json">\n' + fj + '\n</script>', bas, flags=re.S)
    if u['yol'] in ('yedek-parca', 'diger'):  # Product şeması yerine yalnızca breadcrumb + SSS
        bas = re.sub(r'<script type="application/ld\+json">\n\{\n  "@context": "https://schema.org",\n  "@type": "Product".*?</script>\n', '', bas, flags=re.S)
    bas = bas.replace('data-urun-ad="Tarım Römorku"', 'data-urun-ad="%s"' % u['ad'])
    open(SITE + 'urunler/%s/index.html' % u['yol'], 'w', encoding='utf8').write(bas + govde + '\n' + son)
    print(u['yol'], len(faq), bas.count('"Product"'))
