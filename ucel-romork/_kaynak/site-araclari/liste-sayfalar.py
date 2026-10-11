# Ürünler (hub) ve kategori sayfaları: aynı kart sistemi; imalat rozeti yalnızca teyitli ürünlerde
import re, json
SITE = '/home/user/ucel-tarim-aletleri/'
URL = 'https://selahattinpeltek46-sudo.github.io/ucel-tarim-aletleri/'

# yol, ad, kısa kullanım, görsel, beyaz zemin, imalat
URUN = {
    'romork': ('Tarım Römorku', 'Ürün, yem, gübre ve odun taşıma', 'romork/yesil-romork.webp', True, True),
    'kultivator': ('Yaylı Kültivatör', 'Pulluktan sonra toprağı inceltir', 'kultivator/kirmizi.webp', True, True),
    'on-yukleyici': ('Loader Kepçe', 'Gübre, yem ve malzeme yükleme', 'loader/kirmizi.webp', True, True),
    'tapan': ('Tapan', 'Ekim öncesi tarlayı düzler, kesek kırar', 'tapan-cizim.svg', False, False),
    'pulluk': ('Pulluk', 'Ekim öncesi derin toprak işleme', 'pulluk/kulakli.webp', False, False),
    'mibzer': ('Mibzer', 'Tahıl ve yem bitkisi ekimi', None, False, False),
    'gubre-serpme': ('Gübre Serpme Makinesi', 'Kimyasal ve organik gübreyi dengeli dağıtır', 'gubre/romork-uzerinde.webp', False, False),
    'su-tankeri': ('Su Tankeri', 'Tarla sulama ve hayvan suyu', 'tanker/tanker.webp', True, False),
    'cayir-bicme': ('Çayır Biçme Makinesi', 'Çayır, yonca ve otlak biçimi', None, False, False),
}


def kart(yol, on):
    ad, kul, gor, beyaz, imalat = URUN[yol]
    foto = ('<span class="us-kart-foto%s"><img src="%sassets/%s" alt="" loading="lazy"></span>' % (' beyaz' if beyaz else '', on, gor)) if gor else '<span class="us-kart-foto us-kart-bos" aria-hidden="true">Fotoğrafı WhatsApp\'tan isteyin</span>'
    rozet = '<span class="us-rozet">Üçel imalatı</span>' if imalat else ''
    return '        <a class="us-kart" href="%surunler/%s/">%s%s<b>%s</b><span>%s</span><em>Fiyat al →</em></a>\n' % (on, yol, foto, rozet, ad, kul)


def izgara(yollar, on):
    return '      <div class="us-urunler">\n' + ''.join(kart(y, on) for y in yollar) + '      </div>\n'


def destek(on):
    return f'''      <div class="us-surec">
        <a href="{on}ikinci-el/"><b>İkinci el</b><span>İkinci el tarım aleti alıp satıyoruz; gerçek durumunu dürüstçe paylaşıyoruz.</span></a>
        <a href="{on}takas/"><b>Takas</b><span>Eski aletinizin fotoğrafını gönderin, yeni ya da ikinci el bir ekipmanla takas edelim.</span></a>
        <a href="{on}imalat/"><b>Özel imalat</b><span>Kendi imal ettiğimiz ekipmanlarda ihtiyacınıza göre özel ölçü yapabiliyoruz.</span></a>
        <a href="{on}urunler/yedek-parca/"><b>Yedek parça</b><span>Sattığımız ve sık kullanılan ekipmanlar için yedek parça bulunduruyoruz.</span></a>
      </div>
'''


def hub(on):
    return f'''<main class="us">
  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb"><a href="../index.html">Ana Sayfa</a><span>/</span><span aria-current="page">Ürünler</span></nav>
      <p class="us-etiket">Ürünlerimiz</p>
      <h1>Tarım makineleri ve ekipmanlar</h1>
      <p class="us-fayda">Göksun'da üretiyoruz. İhtiyacınıza uygun ekipmanı birlikte belirliyoruz.</p>
      <p class="us-metin">Ürüne dokunun; fotoğrafları ve fiyat formunu görün. Traktörünüzü ve ilinizi yazdığınız mesaj WhatsApp'ta hazır açılır.</p>
    </div>
  </section>

  <section class="us-bolum">
    <div class="us-ic">
      <p class="us-etiket">Kendi imalatımız</p>
      <h2>Göksun atölyemizde üretiyoruz</h2>
      <p class="us-metin">Römork, kültivatör ve loader kepçeyi Göksun Sanayi Sitesi'ndeki atölyemizde kendimiz üretiyoruz. Ürünlerimizin üzerinde ÜÇEL · GÖKSUN yazar.</p>
{izgara(['romork', 'kultivator', 'on-yukleyici'], on)}    </div>
  </section>

  <section class="us-bolum us-koyu">
    <div class="us-ic">
      <p class="us-etiket">Diğer ürünlerimiz</p>
      <h2>Toprak hazırlığından suya</h2>
{izgara(['tapan', 'pulluk', 'mibzer', 'gubre-serpme', 'su-tankeri', 'cayir-bicme'], on)}      <p class="us-diger">Kategoriye göre: <a href="toprak-isleme/">Toprak işleme</a> · <a href="ekim/">Ekim</a> · <a href="gubreleme/">Gübreleme</a> · <a href="tasima-yukleme/">Taşıma ve yükleme</a> · <a href="diger/">Listede yoksa sorun</a></p>
    </div>
  </section>

  <section class="us-bolum">
    <div class="us-ic">
      <p class="us-etiket">Hizmetlerimiz</p>
      <h2>İkinci el, takas, özel imalat, yedek parça</h2>
{destek(on)}      <p class="us-adres"><b>Türkiye geneline gönderim:</b> Nakliyeyi genellikle anlaşmalı nakliye firmalarıyla sağlıyoruz; şehrinizi yazın, seçeneği birlikte belirleyelim.</p>
    </div>
  </section>
</main>
'''


KAT = {
    'toprak-isleme': ('Toprak İşleme', 'Toprak İşleme Makineleri · Göksun | Üçel Tarım Aletleri', "Pulluk, yaylı kültivatör ve tapan: ekim öncesi toprak hazırlığı ekipmanları. Traktörünüze uygun olanı birlikte seçelim; fiyat için ürün sayfasındaki formu doldurun.",
                      'Ekim öncesi tarlayı hazırlayan ekipmanlar. Sıra şöyle ilerler: pullukla derin sürüm, kültivatörle yüzey hazırlığı, tapanla düzeltme.', ['pulluk', 'kultivator', 'tapan']),
    'ekim': ('Ekim', 'Ekim Makineleri · Göksun | Üçel Tarım Aletleri', "Mibzer: tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makinesi. Fiyat için ürün sayfasındaki formu doldurun.",
             'Tohumu düzenli sıra aralığıyla ve dengeli şekilde toprağa yerleştiren ekim makineleri. Ekimden önce toprak hazırlığı için tapan ve kültivatöre de bakın.', ['mibzer', 'tapan']),
    'gubreleme': ('Gübreleme', 'Gübreleme Makineleri · Göksun | Üçel Tarım Aletleri', "Gübre serpme makinesi: kimyasal ya da organik gübreyi tarlanıza dengeli dağıtın. Traktörünüze uygun makineyi birlikte seçelim.",
                  'Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtan ekipmanlar. Gübreyi tarlaya taşımak için römorka da bakın.', ['gubre-serpme', 'romork']),
    'tasima-yukleme': ('Taşıma ve Yükleme', 'Taşıma ve Yükleme Ekipmanları · Göksun | Üçel Tarım Aletleri', "Tarım römorku, loader kepçe ve su tankeri. Römork ve loader kepçe kendi imalatımız. Fiyat için ürün sayfasındaki formu doldurun.",
                       'Tarladan eve, depodan tarlaya yük, su ve malzeme taşıma-yükleme işleriniz için. Römork ve loader kepçeyi Göksun atölyemizde kendimiz üretiyoruz.', ['romork', 'on-yukleyici', 'su-tankeri']),
}


def kategori(yol):
    ad, _, _, metin, liste = KAT[yol]
    return f'''<main class="us">
  <section class="us-giris">
    <div class="us-ic">
      <nav class="breadcrumb" aria-label="breadcrumb"><a href="../../index.html">Ana Sayfa</a><span>/</span><a href="../">Ürünler</a><span>/</span><span aria-current="page">{ad}</span></nav>
      <p class="us-etiket">Kategori</p>
      <h1>{ad}</h1>
      <p class="us-metin">{metin}</p>
{izgara(liste, '../../')}      <p class="us-diger">Diğer kategoriler: {' · '.join('<a href="../%s/">%s</a>' % (k, v[0]) for k, v in KAT.items() if k != yol)} · <a href="../">Tüm ürünler</a></p>
    </div>
  </section>

  <section class="us-bolum us-koyu">
    <div class="us-ic">
      <p class="us-etiket">Hizmetlerimiz</p>
      <h2>İkinci el, takas, özel imalat, yedek parça</h2>
{destek('../../')}    </div>
  </section>
</main>
'''


def bas_son(sablon_yolu, title, desc, url, crumbs):
    s = open(SITE + sablon_yolu, encoding='utf8').read()
    bas = s[:s.index('<main class="us">')]
    son = s[s.index('<footer'):]
    bas = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % title, bas)
    bas = re.sub(r'(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*"', lambda m: m.group(1) + title + '"', bas)
    bas = re.sub(r'(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*"', lambda m: m.group(1) + desc + '"', bas)
    bas = re.sub(r'(<link rel="canonical" href=")[^"]*"', lambda m: m.group(1) + url + '"', bas)
    bas = re.sub(r'(<meta property="og:url" content=")[^"]*"', lambda m: m.group(1) + url + '"', bas)
    bas = re.sub(r'<script type="application/ld\+json">.*?</script>\n?', '', bas, flags=re.S)
    bc = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(crumbs)]}
    bas = bas.replace('</head>', '<script type="application/ld+json">\n' + json.dumps(bc, ensure_ascii=False, indent=1) + '\n</script>\n</head>')
    bas = re.sub(r'<body[^>]*>', '<body>', bas)
    return bas, son


# Hub (derinlik 1): katalog sayfasının üst/alt kısmı
bas, son = bas_son('katalog/index.html', 'Tarım Makineleri ve Ekipmanlar · Göksun | Üçel Tarım Aletleri',
                   "Römork, yaylı kültivatör ve loader kepçe kendi imalatımız; tapan, pulluk, mibzer, gübre serpme, su tankeri ve çayır biçme. Ürünü seçin, fiyatı WhatsApp'tan alın.",
                   URL + 'urunler/', [('Ana Sayfa', URL), ('Ürünler', URL + 'urunler/')])
son = re.sub(r'<script>\n// Kaynak etiketi.*?</script>\n', '', son, flags=re.S)
open(SITE + 'urunler/index.html', 'w', encoding='utf8').write(bas + hub('../') + '\n' + son)
for yol, v in KAT.items():
    bas, son = bas_son('urunler/romork/index.html', v[1], v[2], URL + 'urunler/%s/' % yol, [('Ana Sayfa', URL), ('Ürünler', URL + 'urunler/'), (v[0], URL + 'urunler/%s/' % yol)])
    son = son.replace('<script src="../../assets/fiyatlar.js"></script>\n', '')
    open(SITE + 'urunler/%s/index.html' % yol, 'w', encoding='utf8').write(bas + kategori(yol) + '\n' + son)
print('ok')
