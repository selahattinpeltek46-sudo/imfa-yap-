# 2. aşama: ikinci el, takas, imalat, iletişim, hakkımızda, Göksun, tarım makineleri (derinlik 1)
import re, types, urllib.parse
import os; S = os.path.dirname(os.path.abspath(__file__)) + '/'
src = open(S + 'liste-sayfalar.py', encoding='utf8').read()
m = types.ModuleType('ls'); exec(src[:src.index('# Hub (derinlik 1)')], m.__dict__)
SITE, URL = m.SITE, m.URL
HARITA = 'https://www.google.com/maps/search/?api=1&query=%C3%9C%C3%A7el%20Zirai%20Aletler%2C%20Yeni%20Mah.%2C%20G%C3%B6ksun%20Sanayi%20Sitesi%2C%20G%C3%B6ksun%2FKahramanmara%C5%9F'
IFRAME = 'https://maps.google.com/maps?q=%C3%9C%C3%A7el%20Zirai%20Aletler%2C%20Yeni%20Mah.%2C%20G%C3%B6ksun%20Sanayi%20Sitesi%2C%2046660%20G%C3%B6ksun%2FKahramanmara%C5%9F&t=&z=16&ie=UTF8&iwloc=&output=embed'
ON = '../'


def secim(etiket, soru, ler):
    return ('        <fieldset data-etiket="%s">\n          <legend>%s</legend>\n          <div class="us-secim">\n' % (etiket, soru)
            + ''.join('            <label><input type="checkbox" value="%s"><span>%s</span></label>\n' % (x, x) for x in ler) + '          </div>\n        </fieldset>\n')


def alan(soru, ad, etiket, ornek, birim=None, sayi=False):
    ek = (' data-birim="%s"' % birim if birim else '') + (' inputmode="numeric"' if sayi else '')
    return '        <label class="us-alan">%s<input type="text" name="%s" data-etiket="%s"%s placeholder="%s" autocomplete="off"></label>\n' % (soru, ad, etiket, ek, ornek)


def form(giris, baslik, alanlar, buton="WhatsApp'tan gönder", notu="Boş bıraktığınız soruları WhatsApp'ta birlikte tamamlarız."):
    return f'''      <form class="us-form" data-giris="{giris}">
        <p class="us-form-baslik">{baslik}</p>
{alanlar}        <button type="submit" class="us-btn us-wa us-tam">{buton}</button>
        <p class="us-kucuk">{notu}</p>
      </form>
'''


def wa(msg, yazi="WhatsApp'tan yaz"):
    return f'<a class="us-btn us-wa" data-msg="{msg}" href="https://wa.me/905324803051?text={urllib.parse.quote(msg)}" target="_blank" rel="noopener">{yazi}</a>'


TEL = '<a class="us-btn us-cizgi" href="tel:+905324803051">Ara: 0532 480 30 51</a>'
TRAKTOR = alan('Traktörünüz (marka / model)', 'traktor', 'Traktörüm', 'Örn. New Holland TT50') + alan('Beygir gücü (HP)', 'hp', 'Beygir gücü', 'Örn. 50', 'HP', True)
IL = alan('İl / ilçe', 'il', 'İl / ilçe', 'Örn. Göksun / Kahramanmaraş')
ILETISIM = f'''          <dl class="us-iletisim">
            <dt>Adres</dt><dd>Yeni Mah., Göksun Sanayi Sitesi, 46660 Göksun / Kahramanmaraş</dd>
            <dt>Telefon / WhatsApp</dt><dd><a href="tel:+905324803051">0532 480 30 51</a></dd>
            <dt>Çalışma saatleri</dt><dd>Her gün 08:00 – 19:00</dd>
            <dt>Yetkili</dt><dd>Bahadır Kocabaş</dd>
          </dl>
'''


def giris(crumb, etiket, h1, fayda, metin, butonlar, foto=None):
    sag = f'        <figure class="us-ana-foto us-foto-tam"><img src="{foto[0]}" alt="{foto[1]}" width="{foto[2]}" height="{foto[3]}"></figure>\n' if foto else ''
    ic = f'''          <p class="us-etiket">{etiket}</p>
          <h1>{h1}</h1>
          <p class="us-fayda">{fayda}</p>
          <p class="us-metin">{metin}</p>
          <div class="us-butonlar">{butonlar}</div>
'''
    govde = (f'      <div class="us-giris-izgara">\n        <div>\n{ic}        </div>\n{sag}      </div>\n') if foto else ic.replace('          ', '      ')
    return f'''  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb"><a href="../index.html">Ana Sayfa</a><span>/</span><span aria-current="page">{crumb}</span></nav>
{govde}    </div>
  </section>
'''


def bolum(etiket, h2, ic, koyu=False, kimlik=''):
    return f'''  <section class="us-bolum{' us-koyu' if koyu else ''}"{f' id="{kimlik}"' if kimlik else ''}>
    <div class="us-ic">
      <p class="us-etiket">{etiket}</p>
      <h2>{h2}</h2>
{ic}    </div>
  </section>
'''


def adimlar(l, cls='us-adim'):
    return f'      <ol class="{cls}">\n' + ''.join('        <li><b>%s</b><span>%s</span></li>\n' % x for x in l) + '      </ol>\n'


def p(t, cls='us-metin'):
    return f'      <p class="{cls}">{t}</p>\n'


SAYFA = {}

SAYFA['ikinci-el'] = ('İkinci El', 'İkinci El Tarım Aletleri · Göksun | Üçel Tarım Aletleri',
    "Göksun'da ikinci el römork, pulluk, kültivatör ve mibzer. Elimizdekiler sürekli değişiyor; aradığınızı yazın, uygun ekipmanı ve gerçek durumunu WhatsApp'tan iletelim.",
    giris('İkinci El', 'İkinci el', 'İkinci el tarım aletleri', 'Kullanılmış ama işinizi görecek ekipman.',
          "Elimizdeki ikinci el tarım aletleri sürekli değişiyor; bu yüzden sabit bir liste yerine aradığınızı bize sormanızı öneririz. Her ikinci el ekipmanı kontrol ediyor, gerçek durumunu (çalışır durumda mı, eksik parça var mı) dürüstçe paylaşıyoruz.",
          '<a class="us-btn us-wa" href="#sor">Aradığımı yazayım</a>' + TEL)
    + bolum('Sorun', 'Ne arıyorsunuz?', form('Merhaba, sitenizden yazıyorum. İkinci el ekipman arıyorum.', 'İkinci el ekipman için',
          secim('Aradığım ekipman', '1. Ne arıyorsunuz?', ['Römork', 'Pulluk', 'Kültivatör', 'Mibzer', 'Diğer']) + TRAKTOR + IL), kimlik='sor')
    + bolum('Nasıl işler?', 'Üç adımda', adimlar([('Aradığınızı yazın', 'Ekipman türünü, traktörünüzü ve ilinizi yazın.'),
          ('Elimizdekini iletelim', 'Uygun ekipman varsa durumunu ve fiyatını WhatsApp\'tan paylaşalım.'),
          ('Görün ve karar verin', 'Atölyemize gelip yerinde bakabilirsiniz; başka şehirdeyseniz nakliyeyi birlikte konuşalım.')])
          + p('İkinci el ürünlerde resmî garanti belgesi verilmez. Karar vermeden önce aklınıza takılan her şeyi sorabilirsiniz.', 'us-adres')
          + p('Elinizde değerlendirmek istediğiniz bir ekipman mı var? <a href="../takas/">Takas sayfası →</a>', 'us-diger'), koyu=True))

SAYFA['takas'] = ('Takas', 'Takas ve Eski Ekipman Değerlendirme · Göksun | Üçel Tarım Aletleri',
    "Eski römork, pulluk, kültivatör ya da mibzerinizin fotoğrafını gönderin; satış ya da yeni/ikinci el bir ekipmanla takas seçeneğini birlikte konuşalım.",
    giris('Takas', 'Takas ve değerlendirme', 'Eski makinenizi değerlendirelim', 'Fotoğrafını gönderin, birlikte bakalım.',
          'Artık kullanmadığınız tarım ekipmanını satmak ya da yeni veya ikinci el bir ekipmanla takas etmek istiyorsanız bize fotoğrafını gönderin.',
          '<a class="us-btn us-wa" href="#sor">Ekipmanımı yazayım</a>' + TEL)
    + bolum('Nasıl işler?', 'Üç adımda takas', adimlar([('Fotoğrafını çekin', 'Elinizdeki ekipmanın birkaç net fotoğrafını çekin.'),
          ('WhatsApp\'tan gönderin', 'Aşağıdaki formu doldurun, ardından fotoğrafları ve ekipmanın durumunu aynı sohbete ekleyin.'),
          ('Birlikte değerlendirelim', 'Satış ya da takas seçeneklerini birlikte konuşup anlaşalım.')]), koyu=True)
    + bolum('Sorun', 'Ekipmanınızı yazın', form('Merhaba, sitenizden yazıyorum. Elimdeki ekipmanı değerlendirmek istiyorum.', 'Takas / değerlendirme için',
          secim('Ekipmanım', '1. Elinizdeki ekipman', ['Römork', 'Pulluk', 'Kültivatör', 'Mibzer', 'Diğer'])
          + secim('İsteğim', '2. Ne istiyorsunuz?', ['Satmak', 'Yeni ekipmanla takas', 'İkinci el ile takas'])
          + alan('Marka / model / yıl (biliyorsanız)', 'model', 'Marka / model / yıl', 'Biliyorsanız yazın') + IL,
          notu='Mesajı gönderdikten sonra fotoğrafları aynı sohbete ekleyin.'), kimlik='sor')
    + bolum('İkinci el', 'İkinci el mi arıyorsunuz?', p('Elimizdeki ikinci el ekipmanlar sürekli değişiyor. <a href="../ikinci-el/">İkinci el sayfası →</a>', 'us-diger'), koyu=True))

SAYFA['imalat'] = ('İmalat', 'İmalat ve Özel Üretim · Göksun Atölyesi | Üçel Tarım Aletleri',
    "Römork, kültivatör ve loader kepçeyi Göksun Sanayi Sitesi'ndeki atölyemizde kendimiz üretiyoruz. İhtiyacınıza göre özel ölçü için traktörünüzü ve işinizi yazın.",
    giris('İmalat', 'Kendi imalatımız', "Göksun'da üretiyoruz", 'Atölyemizde başlayan emek, tarlanızda iş görür.',
          "Römork, kültivatör ve loader kepçeyi Göksun Sanayi Sitesi'ndeki atölyemizde kendimiz üretiyoruz. Ürünlerimizin üzerinde ÜÇEL · GÖKSUN yazar. Kendi imal ettiğimiz ekipmanlarda standart ölçülerin dışında, ihtiyacınıza göre özel imalat yapabiliyoruz.",
          '<a class="us-btn us-wa" href="#ozel">Özel imalat için yazın</a>' + TEL,
          ('../assets/ana/atolye-700.webp', 'Kırmızı loader kepçe, Üçel atölyesinin önünde', 700, 513))
    + bolum('Ürettiklerimiz', 'Göksun atölyemizden', m.izgara(['romork', 'kultivator', 'on-yukleyici'], ON))
    + bolum('Süreç', 'Atölyeden tarlaya', adimlar([('Ölçü', 'Ekipmanın kullanım amacına ve traktör uyumuna göre ölçüleri birlikte belirliyoruz.'),
          ('Kesim ve kaynak', 'Sac ve profili atölyemizde kesiyor, gövdeyi kendi kaynakçılığımızla kuruyoruz.'),
          ('Montaj ve boya', 'Parçaları birleştirip boyuyoruz. Römorkta kasa rengini ve yazısını siz seçersiniz.'),
          ('Kontrol ve teslimat', 'Teslimattan önce son kontrolü yapıyor, atölyemizden teslim ediyoruz; isterseniz nakliyesini birlikte konuşuyoruz.')]), koyu=True)
    + bolum('Özel imalat', 'İhtiyacınıza göre özel ölçü', p('Standart ölçülerin dışında bir ihtiyacınız mı var? Traktörünüzü ve işinizi anlatın, atölyemizde nasıl karşılayabileceğimizi birlikte konuşalım.')
          + form('Merhaba, sitenizden yazıyorum. Özel imalat için bilgi almak istiyorum.', 'Özel imalat için',
                 secim('Ürün', '1. Hangi ürün?', ['Römork', 'Kültivatör', 'Loader kepçe']) + alan('İstediğiniz ölçü / özellik', 'not', 'İsteğim', 'Örn. kasa ölçüsü, renk') + TRAKTOR + IL), kimlik='ozel'))

SAYFA['iletisim'] = ('İletişim', 'İletişim · Göksun Sanayi Sitesi | Üçel Tarım Aletleri',
    "Üçel Tarım Aletleri: Yeni Mah., Göksun Sanayi Sitesi, Göksun/Kahramanmaraş. Telefon ve WhatsApp 0532 480 30 51. Her gün 08:00 – 19:00.",
    '''  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb"><a href="../index.html">Ana Sayfa</a><span>/</span><span aria-current="page">İletişim</span></nav>
      <div class="us-giris-izgara">
        <div>
          <p class="us-etiket">İletişim</p>
          <h1>Üçel Tarım Aletleri iletişim</h1>
          <p class="us-fayda">Ne alacağınızdan emin değilseniz sorun değil.</p>
          <p class="us-metin">Traktörünüzü ve yapacağınız işi anlatın, size uygun seçenekleri konuşalım. En hızlı dönüş WhatsApp'tan oluyor; e-posta adresimiz şu an bulunmuyor.</p>
''' + ILETISIM + '''          <div class="us-butonlar">''' + wa('Merhaba, Üçel Tarım Aletleri sitenizden yazıyorum.') + f'''<a class="us-btn us-cizgi" href="{HARITA}" target="_blank" rel="noopener">Yol tarifi</a></div>
        </div>
        <div class="us-harita"><iframe title="Üçel Tarım Aletleri konumu" src="{IFRAME}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
      </div>
    </div>
  </section>
''' + bolum('Bize yazın', 'Mesajınız WhatsApp\'ta hazır açılsın', form('Merhaba, Üçel Tarım Aletleri sitenizden yazıyorum.', 'Kısa form',
          alan('Ne arıyorsunuz?', 'urun', 'Aradığım', 'Örn. römork, yedek parça') + TRAKTOR + IL + alan('Mesajınız (isteğe bağlı)', 'mesaj', 'Mesajım', 'Yazmak istediğiniz')), koyu=True))

SAYFA['hakkimizda'] = ('Hakkımızda', 'Hakkımızda · Baba Oğul Aile İşletmesi | Üçel Tarım Aletleri',
    "Üçel Tarım Aletleri, Göksun Sanayi Sitesi'nde tarım ekipmanı satışı ve imalatı yapan bir aile işletmesi. Bahadır Kocabaş mesleği babasının yanında öğrendi.",
    giris('Hakkımızda', 'Hakkımızda', 'Baba oğul, aynı emek', 'Göksun Sanayi Sitesi\'nde bir aile işletmesi.',
          "Yıllardır Göksun'da tarımla uğraşan insanların neye ihtiyacı olduğunu görerek bu işi büyüttük. Bahadır Kocabaş, bu mesleği babasının yanında öğrendi; bugün de aynı özenle babasıyla omuz omuza üretmeye devam ediyor. Bizim için önemli olan sadece bir makine satmak değil, müşterimizin aldığı ekipmanı işinde gönül rahatlığıyla kullanabilmesi.",
          wa('Merhaba, Üçel Tarım Aletleri sitenizden yazıyorum.') + TEL,
          ('../assets/ana/teslimat-1200.webp', 'Yeşil Üçel römorku teslimat günü, sahibiyle', 1167, 725))
    + bolum('Biz kimiz?', 'Satış ve imalat', p('Üçel Tarım Aletleri (Üçel Zirai Aletler), Göksun Sanayi Sitesi\'nde tarım ekipmanı satışı ve imalatı yapan bir aile işletmesidir. Römork, kültivatör ve loader kepçeyi kendi atölyemizde imal ediyoruz; tapan, pulluk, mibzer, gübre serpme makinesi, su tankeri ve yedek parça satıyoruz. İkinci el alım-satımı ve takas da yapıyoruz.')
          + p('<a href="../imalat/">İmalatımız →</a> · <a href="../urunler/">Ürünlerimiz →</a>', 'us-diger'), koyu=True)
    + bolum('Nerede?', 'Göksun\'dan Türkiye\'ye', p('Göksun Sanayi Sitesi, Yeni Mah., 46660 Göksun/Kahramanmaraş adresindeyiz. Göksun ve çevresine yerinde, Türkiye geneline de gönderimle hizmet veriyoruz.')
          + p('Göksun ve çevresindeki çiftçilere, traktör sahiplerine, küçük ve orta ölçekli üreticilere; yeni ekipman arayanlara olduğu kadar ikinci el ya da takas arayanlara da hizmet veriyoruz.')
          + '      <div class="us-butonlar">' + wa('Merhaba, Üçel Tarım Aletleri sitenizden yazıyorum.') + f'<a class="us-btn us-cizgi" href="{HARITA}" target="_blank" rel="noopener">Yol tarifi</a></div>\n'))

SAYFA['goksun-tarim-aletleri'] = ('Göksun Tarım Aletleri', 'Göksun Tarım Aletleri ve Tarım Makineleri | Üçel Tarım Aletleri',
    "Göksun'da tarım aleti arıyorsanız: römork, kültivatör ve loader kepçe imalatı; tapan, pulluk, mibzer, gübre serpme, su tankeri, ikinci el, takas ve yedek parça. Göksun Sanayi Sitesi.",
    giris('Göksun Tarım Aletleri', 'Göksun Sanayi Sitesi', 'Göksun tarım aletleri ve tarım makineleri', "Göksun'da üretiyoruz. İhtiyacınıza uygun ekipmanı birlikte belirliyoruz.",
          "Göksun ve çevresinde tarım aleti, zirai alet ya da tarım makinesi arıyorsanız Üçel Tarım Aletleri Göksun Sanayi Sitesi'nde. Bahadır Kocabaş bu işi babasının yanında öğrendi; bugün de babasıyla aynı atölyede üretmeye devam ediyor.",
          '<a class="us-btn us-wa" href="#urunler">Ürünleri gör</a>' + TEL,
          ('../assets/ana/teslimat-1200.webp', 'Yeşil Üçel römorku teslimat günü, Göksun', 1167, 725))
    + bolum('Ürünlerimiz', 'Göksun\'da neler var?', m.izgara(['romork', 'kultivator', 'on-yukleyici', 'tapan', 'pulluk', 'mibzer', 'gubre-serpme', 'su-tankeri', 'cayir-bicme'], ON), kimlik='urunler')
    + bolum('Hizmetlerimiz', 'Yeni, ikinci el, takas, yedek parça', p('Yeni ekipman satın almak isteyen, ikinci el bir alet arayan, elindeki ekipmanı takas etmek ya da değerlendirmek isteyen veya sattığımız ürünler için yedek parça arayan çiftçilere hizmet veriyoruz.') + m.destek(ON), koyu=True)
    + bolum('İletişim', 'Atölyemize bekleriz', ILETISIM.replace('          ', '      ') + '      <div class="us-butonlar">' + wa('Merhaba, Üçel Tarım Aletleri sitenizden yazıyorum.') + f'<a class="us-btn us-cizgi" href="{HARITA}" target="_blank" rel="noopener">Yol tarifi</a></div>\n'))

kat = ''
for k, v in m.KAT.items():
    if k == 'ekim':
        v = (v[0], v[1], v[2], v[3], ['mibzer'])
    kat += bolum('Kategori', '<a href="../urunler/%s/">%s</a>' % (k, v[0]), p(v[3]) + m.izgara(v[4], ON), koyu=(list(m.KAT).index(k) % 2 == 1))
SAYFA['tarim-makineleri'] = ('Tarım Makineleri', 'Göksun Tarım Makineleri · Kategoriler | Üçel Tarım Aletleri',
    "Göksun tarım makineleri: toprak işleme, ekim, gübreleme, taşıma ve yükleme. Römork, kültivatör ve loader kepçe kendi imalatımız. Ürünü seçin, fiyatı WhatsApp'tan alın.",
    giris('Tarım Makineleri', 'Kategoriler', 'Göksun tarım makineleri', 'İhtiyacınıza göre kategoriye bakın, doğrudan ürüne geçin.',
          "Göksun Sanayi Sitesi'ndeki atölyemizde imal ettiğimiz ve sattığımız ekipmanlar aşağıda işe göre gruplandı. <b>Üçel imalatı</b> rozetli ürünleri kendimiz üretiyoruz.",
          '<a class="us-btn us-wa" href="../urunler/">Tüm ürünler</a>' + TEL)
    + kat
    + bolum('Diğer', 'Yedek parça ve listede olmayanlar', m.izgara(['cayir-bicme'], ON) + p('<a href="../urunler/yedek-parca/">Yedek parça →</a> · <a href="../urunler/diger/">Aradığınız listede yoksa sorun →</a>', 'us-diger')))

for yol, (crumb, title, desc, govde) in SAYFA.items():
    bas, son = m.bas_son('katalog/index.html', title, desc, URL + yol + '/', [('Ana Sayfa', URL), (crumb, URL + yol + '/')])
    son = re.sub(r'<script>\n// Kaynak etiketi.*?</script>\n', '', son, flags=re.S)
    open(SITE + yol + '/index.html', 'w', encoding='utf8').write(bas + '<main class="us">\n' + govde + '</main>\n\n' + son)
    print(yol, len(govde))
