#!/usr/bin/env python3
"""Aytaç Mobilya sitesini üretir: 7 sayfa + sitemap.xml.

Ortak parçalar (üst çubuk, mesaj hazırlayıcı, konum, alt bilgi, schema) tek
yerde durur; metinler modul-2-icerik-seo.md'deki nihai metinlerdir.
Çalıştır:  python3 aytac-mobilya/_proje/uret.py
"""
import json
import os
from html import escape

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://selahattinpeltek46-sudo.github.io/imfa-yap-/aytac-mobilya/"
TARIH = "2026-10-20"
FIRMA = "Aytaç Mobilya Tasarım/İmalat"
ADRES = "30 Ağustos, 2071. Sk. 14A, 06794 Etimesgut/Ankara"
INSTAGRAM = "https://www.instagram.com/aytac_mobilya/"
IG_DM = "https://ig.me/m/aytac_mobilya"
HARITA = "https://www.google.com/maps/search/?api=1&query=AYTA%C3%87+MOB%C4%B0LYA+TASARIM%2F%C4%B0MALAT+Etimesgut"
YOL = "https://www.google.com/maps/dir/?api=1&destination=39.942563%2C32.650188"
LAT, LNG = 39.942563, 32.650188

# ---------------------------------------------------------------- fotoğraflar
# (dosya, alt metin, tür) — kaynak: @aytac_mobilya Instagram paylaşımları
FOTO = [
    ("mutfak-led-ust-dolap", "Açık gri kapaklı mutfak; üst dolapların altında şerit ışık, cam kapaklı vitrin dolap ve seramik tezgâh arası", "mutfak"),
    ("mutfak-tavan-bandi-led", "Tavan bandında şerit ışık, bronz cam kapaklı üst dolaplar ve uzun tezgâhlı mutfak", "mutfak"),
    ("mutfak-buzdolabi-nisi", "Buzdolabının yanında boy dolap, ışıklı cam kapaklı üst dolap ve çekmeceli alt dolap", "mutfak"),
    ("mutfak-boy-dolap", "Tavana kadar boy dolaplı uzun mutfak, cam kapaklı ışıklı üst dolap ve ankastre bulaşık makinesi", "mutfak"),
    ("mutfak-antrasit-alt-dolap", "Antrasit alt dolaplar, beyaz parlak üst dolaplar ve mermer desenli tezgâh arası", "mutfak"),
    ("mutfak-l-beyaz", "Beyaz L mutfak, siyah mermer desenli tezgâh arası ve cam kapaklı üst dolaplar", "mutfak"),
    ("gardirop-tavana-kadar-gri", "Tavana kadar açık gri gardırop, ince siyah boy kulpları", "gardirop"),
    ("gardirop-cizgili-kapak", "Yivli yüzeyli, kulpsuz görünümlü açık gri gardırop", "gardirop"),
    ("gardirop-ahsap-desen", "Ahşap desenli kapaklı, siyah kulplu gardırop", "gardirop"),
    ("gardirop-beyaz-yuvarlak-kulp", "Beyaz parlak kapaklı, siyah yuvarlak kulplu tavana kadar gardırop", "gardirop"),
    ("gardirop-surgulu-ayna", "Sürgülü kapaklı, aynalı gardırop", "gardirop"),
    ("gardirop-beyaz-boy", "Köşeyi dönen beyaz boy gardırop", "gardirop"),
    ("gardirop-gri-aynali", "Gri kapaklı, aynalı gardırop ve yatak", "gardirop"),
    ("gardirop-panjur-kapak", "Panjur kapaklı, ortası aynalı beyaz gardırop ve şifonyer; önünde bir kedi", "gardirop"),
    ("yatak-odasi-makyaj-masasi", "Yatak odasında kemerli ışıklı aynalı makyaj masası ve ışıklı raflar; yatak hâlâ koruma naylonunda", "yatak"),
    ("yatak-basligi-panel", "Dikey dilimli yatak başlığı paneli ve krem komodin", "yatak"),
    ("giyinme-yuvarlak-ayna", "Beyaz gardırop, çıtalı panel ve arkası ışıklı yuvarlak ayna", "yatak"),
    ("yatak-odasi-dolap-baslik", "Kabartma desenli gardırop ve kapitone yatak başlığı", "yatak"),
    ("banyo-oval-led-ayna", "Arkası ışıklı oval ayna ve tezgâh üstü lavabo", "banyo"),
    ("banyo-cizgili-boy-dolap", "Yivli kapaklı banyo boy dolabı, ışıklı oval ayna ve siyah tezgâh", "banyo"),
    ("banyo-makine-ustu-dolap", "Çamaşır makinesinin üstünde dolap, yanında lavabo dolabı", "banyo"),
    ("banyo-makine-yan-dolap", "Uzun beyaz banyo tezgâhı, çekmeceler ve çamaşır makinesi yeri; üstte ışıklı ayna", "banyo"),
    ("banyo-yuvarlak-led-ayna", "Yuvarlak ışıklı ayna, beyaz lavabo dolabı ve boy dolabı", "banyo"),
    ("banyo-gri-boy-dolap", "Duşakabinli banyoda boy dolapları, yuvarlak ışıklı ayna ve asma lavabo dolabı", "banyo"),
    ("banyo-dikey-led-ayna", "Dikey ışıklı ayna, yanlarda raflar ve gri lavabo dolabı", "banyo"),
    ("banyo-gri-kapak", "Gri kapaklı banyo boy dolabı, lavabo dolabı ve ışıklı ayna", "banyo"),
    ("vestiyer-mese-nis-oturma", "Boy dolaplarının ortasında meşe kaplı, ışıklı oturma nişi olan vestiyer", "antre"),
    ("vestiyer-citali-panel", "Beyaz boy dolabı, aynalı vestiyer, çıtalı panel ve askılar", "antre"),
    ("vestiyer-askili-mese", "Meşe desenli çekmeceli vestiyer, askılar ve oturma minderi", "antre"),
    ("ayakkabilik-antrasit", "Antrasit ayakkabılık ve oturma bankı; yanında matkap, montaj sırasında", "antre"),
    ("antre-led-ayna-petek-ortusu", "Antrede kafesli petek örtüsü ve üstünde sarı ışıklı ayna", "antre"),
    ("antre-kare-led-ayna", "Kafesli petek örtüsü ve üstünde kare ışıklı ayna", "antre"),
    ("kiler-raf", "Tavana kadar beyaz raflı kiler dolabı", "antre"),
    ("citali-bolme", "Antreyi salondan ayıran beyaz çıtalı bölme", "antre"),
    ("kitaplik-led-raf", "Meşe arka panelli, rafların altı ışıklı duvar nişi ve koltuk", "tv"),
    ("tv-unitesi-led-nis", "İki yanında ışıklı nişler olan TV duvarı ve asma TV ünitesi", "tv"),
    ("kitaplik-tavana-kadar", "Tavana kadar kitaplık; üstü ışıklı, altı kapaklı dolap", "tv"),
    ("tv-unitesi-somine", "Lacivert kapaklı, şömine görünümlü TV ünitesi", "tv"),
    ("magaza-raf-sistemi", "Mağaza içinde meşe ve beyaz raf sistemi, petek raflar ve tezgâh", "ticari"),
    ("magaza-tezgah-raf", "Mağazada meşe tezgâh ve camlı raf sistemi", "ticari"),
    ("ofis-calisma-masasi", "Ofiste mermer desenli, metal ayaklı çalışma masası", "ticari"),
]
FOTO_ALT = {f: a for f, a, _ in FOTO}
TURLER = [
    ("mutfak", "Mutfak"), ("gardirop", "Gardırop"), ("yatak", "Yatak odası"), ("banyo", "Banyo"),
    ("antre", "Antre"), ("tv", "TV ve kitaplık"), ("ticari", "Mağaza ve ofis"),
]
W, H = 347, 428

SAYFALAR = {
    "mutfak-dolabi": "Mutfak dolabı",
    "gardirop": "Gardırop ve yatak odası",
    "banyo-dolabi": "Banyo dolabı",
    "vestiyer": "Vestiyer ve antre",
    "tv-unitesi-kitaplik": "TV ünitesi ve kitaplık",
}
MENU = [("mutfak-dolabi", "Mutfak"), ("gardirop", "Gardırop"), ("banyo-dolabi", "Banyo"),
        ("vestiyer", "Vestiyer"), ("tv-unitesi-kitaplik", "TV ve kitaplık"), ("isler", "İşlerimiz")]
MESAJ_TURLERI = [("Mutfak dolabı", "mutfak dolabı"), ("Gardırop", "gardırop"), ("Banyo dolabı", "banyo dolabı"),
                 ("Vestiyer / antre", "vestiyer / antre"), ("TV ünitesi / kitaplık", "TV ünitesi / kitaplık"), ("Başka bir iş", "başka bir iş")]

# Ana sayfa girişindeki fotoğraf duvarı: 12 gerçek iş (masaüstünde 6×2, telefonda 3×4)
DUVAR = ["mutfak-led-ust-dolap", "gardirop-tavana-kadar-gri", "banyo-yuvarlak-led-ayna", "vestiyer-mese-nis-oturma",
         "tv-unitesi-led-nis", "mutfak-antrasit-alt-dolap", "kitaplik-led-raf", "banyo-cizgili-boy-dolap",
         "yatak-odasi-makyaj-masasi", "mutfak-buzdolabi-nisi", "kitaplik-tavana-kadar", "antre-led-ayna-petek-ortusu"]

# İnce çizgili simgeler (stroke = currentColor)
SIMGE = {
    "olcu": '<path d="M3 16.5 16.5 3l4.5 4.5L7.5 21z"/><path d="m7 13 2 2M10 10l1.5 1.5M13 7l2 2"/>',
    "cizim": '<path d="M4 20h16"/><path d="M6 16 15.5 6.5l2 2L8 18H6z"/><path d="m14 8 2 2"/>',
    "imalat": '<path d="M3 21V10l5 3V10l5 3V7l8 4v10z"/><path d="M7 17h2M12 17h2M17 17h1"/>',
    "yildiz": '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    "ok": '<path d="M4 12h15M14 7l5 5-5 5"/>',
    "konum": '<path d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "mesaj": '<path d="M4 5h16v11H9l-5 4z"/>',
}


def svg(ad, sinif="simge"):
    return (f'<svg class="{sinif}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" '
            f'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{SIMGE[ad]}</svg>')


def e(s):
    return escape(s, quote=True)


def img(dosya, k, sinif="", yukle="lazy", alt=None):
    a = e(FOTO_ALT[dosya] if alt is None else alt)
    return (f'<img src="{k}img/{dosya}.webp" width="{W}" height="{H}" alt="{a}" '
            f'loading="{yukle}" decoding="async"' + (f' class="{sinif}"' if sinif else "") + ">")


def sayi(turler):
    return sum(1 for _, _, t in FOTO if t in turler)


# ------------------------------------------------------------------- schema
def isletme():
    return {
        "@type": "HomeAndConstructionBusiness",
        "@id": URL + "#isletme",
        "name": FIRMA,
        "alternateName": "Aytaç Mobilya",
        "description": "Etimesgut'ta kişiye özel mobilya imalatı: ölçü, proje ve montaj. Mutfak dolabı, gardırop, banyo dolabı, vestiyer, TV ünitesi ve kitaplık.",
        "url": URL,
        "image": URL + "img/og.jpg",
        "logo": URL + "img/logo.png",
        "address": {"@type": "PostalAddress", "streetAddress": "30 Ağustos Mah., 2071. Sk. No:14A",
                    "addressLocality": "Etimesgut", "addressRegion": "Ankara", "postalCode": "06794", "addressCountry": "TR"},
        "geo": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
        "hasMap": HARITA,
        "areaServed": [{"@type": "AdministrativeArea", "name": "Etimesgut"}, {"@type": "City", "name": "Ankara"}],
        "sameAs": [INSTAGRAM],
        "makesOffer": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": ad, "url": URL + y + "/"}}
                       for y, ad in SAYFALAR.items()],
    }


def ld(*nesneler):
    graf = {"@context": "https://schema.org", "@graph": list(nesneler)}
    return '<script type="application/ld+json">' + json.dumps(graf, ensure_ascii=False, separators=(",", ":")) + "</script>"


def sss_ld(sss):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": s, "acceptedAnswer": {"@type": "Answer", "text": c}} for s, c in sss]}


def kirinti_ld(adlar):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": ad, "item": URL + yol} for i, (yol, ad) in enumerate(adlar)]}


# ------------------------------------------------------------- ortak parçalar
def bas(k, yol, title, meta, schema, seffaf=False):
    can = URL + (yol + "/" if yol else "")
    menu = "".join(f'<li><a href="{k}{y}/"{" aria-current=page" if y == yol else ""}>{e(a)}</a></li>' for y, a in MENU)
    return f"""<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(title)}</title>
  <meta name="description" content="{e(meta)}">
  <link rel="canonical" href="{can}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#161c27">
  <meta name="geo.region" content="TR-06">
  <meta name="geo.placename" content="Etimesgut, Ankara">
  <meta name="geo.position" content="{LAT};{LNG}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Aytaç Mobilya">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(meta)}">
  <meta property="og:url" content="{can}">
  <meta property="og:image" content="{URL}img/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="{k}img/favicon.png">
  <link rel="apple-touch-icon" href="{k}img/apple-touch-icon.png">
  <link rel="preload" href="{k}fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="{k}fonts/schibsted-grotesk-400-800-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{k}css/site.css">
  {schema}
</head>
<body>
<a class="atla" href="#icerik">İçeriğe geç</a>
<header class="ust{" ust--seffaf" if seffaf else ""}">
  <div class="ust__ic">
    <a class="marka" href="{k}" aria-label="Aytaç Mobilya ana sayfa">
      <img src="{k}img/logo.png" width="42" height="42" alt="">
      <span><b>Aytaç</b><small>Mobilya · Etimesgut</small></span>
    </a>
    <nav id="menu" class="menu" aria-label="Ana menü"><ul>{menu}</ul></nav>
    <a class="ust__cta" href="#mesaj" data-olay="mesaja_git">Projenizi konuşalım</a>
    <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="gizli-metin">Menü</span></button>
  </div>
</header>
<main id="icerik">
"""


def kapanis(k, secili=None, baslik="Odanızı birlikte değerlendirelim.", alt="Aklınızdaki mobilyayı ve odanızı anlatın. Fotoğraf ve kabaca ölçü gönderirseniz ilk konuşmada daha net bir şey söyleyebiliriz."):
    cipler = "".join(
        f'<label class="cip"><input type="checkbox" name="tur" value="{e(v)}"{" checked" if t == secili else ""}><span>{e(t)}</span></label>'
        for t, v in MESAJ_TURLERI)
    return f"""
<section class="kapanis" id="mesaj" aria-labelledby="mesaj-baslik">
  <div class="kap kapanis__izgara">
    <div class="kapanis__sol">
      <p class="ust-baslik ust-baslik--acik">Son adım</p>
      <h2 id="mesaj-baslik">{e(baslik)}</h2>
      <p class="kapanis__alt">{e(alt)}</p>
      <ul class="kapanis__bilgi">
        <li>{svg("konum")}<span>30 Ağustos Mah., 2071. Sk. No:14A<br>06794 Etimesgut / Ankara</span></li>
        <li>{svg("yildiz")}<span><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">Google'da 5,0 · 131 değerlendirme</a><br><small>20 Ekim 2026</small></span></li>
        <li data-tel-satiri hidden>{svg("mesaj")}<span><a data-tel data-olay="telefon_tikla" href="#">Telefon</a></span></li>
      </ul>
      <div class="kapanis__linkler">
        <a href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi_tikla">Yol tarifi al</a>
        <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">Instagram · @aytac_mobilya</a>
      </div>
    </div>
    <form class="hazirlayici" data-hazirlayici novalidate>
      <fieldset>
        <legend>Ne yaptırmak istiyorsunuz?</legend>
        <div class="cipler">{cipler}</div>
      </fieldset>
      <div class="alan-ikili">
        <label class="alan"><span>Semt</span>
          <input type="text" name="semt" autocomplete="address-level3" placeholder="ör. Elvan, Eryaman, Bağlıca" maxlength="60"></label>
        <label class="alan"><span>Not <small>(isteğe bağlı)</small></span>
          <input type="text" name="not" maxlength="400" placeholder="ör. 3,5 m duvar, buzdolabı yanında boy dolap"></label>
      </div>
      <div class="onizleme">
        <span class="onizleme__etiket">Gidecek mesaj</span>
        <output data-onizleme aria-live="polite"></output>
      </div>
      <div class="hazirlayici__eylem">
        <a class="dugme dugme--acik" data-gonder data-olay="whatsapp_tikla" href="{IG_DM}" target="_blank" rel="noopener">Mesajı gönder</a>
        <span class="durum" data-durum role="status"></span>
      </div>
      <p class="kucuk-not">Bu kutuya yazdıklarınız bize iletilmez; yalnız mesaj metni hazırlanır. Gönder'e bastığınızda <span data-kanal-adi>Instagram</span> açılır, mesajı orada siz gönderirsiniz.</p>
    </form>
  </div>
</section>
"""


def son(k):
    hizmet = "".join(f'<li><a href="{k}{y}/">{e(a)}</a></li>' for y, a in SAYFALAR.items())
    return f"""</main>
<footer class="alt">
  <div class="kap alt__izgara">
    <div class="alt__marka">
      <img src="{k}img/logo.png" width="52" height="52" alt="" loading="lazy">
      <p><b>Aytaç Mobilya</b><br>Tasarım · İmalat</p>
      <p class="alt__adres">{e(ADRES)}</p>
      <p data-tel-satiri hidden><a data-tel href="#">Telefon</a></p>
    </div>
    <div>
      <p class="alt__baslik">Çözümler</p>
      <ul>{hizmet}</ul>
    </div>
    <div>
      <p class="alt__baslik">Firma</p>
      <ul>
        <li><a href="{k}isler/">Yaptığımız işler</a></li>
        <li><a href="{k}#surec">Nasıl çalışıyoruz</a></li>
        <li><a href="{k}#sss">Sık sorulanlar</a></li>
        <li><a href="{k}#iletisim">İletişim</a></li>
      </ul>
    </div>
    <div>
      <p class="alt__baslik">Bu site hakkında</p>
      <p>Fotoğrafların hepsi <a href="{INSTAGRAM}" target="_blank" rel="noopener">@aytac_mobilya</a> hesabındaki paylaşımlardan; stok görsel yok.</p>
      <p>Site çerez kullanmaz ve sizden veri toplamaz.</p>
    </div>
  </div>
  <div class="kap alt__dip">
    <span>© 2026 Aytaç Mobilya — Etimesgut / Ankara</span>
    <span><a href="{INSTAGRAM}" target="_blank" rel="noopener">Instagram</a> · <a href="{HARITA}" target="_blank" rel="noopener">Google Haritalar</a></span>
  </div>
</footer>
<a class="yapiskan" href="#mesaj" data-olay="mesaja_git">{svg("mesaj")}Projenizi konuşalım</a>
<script src="{k}js/ayarlar.js"></script>
<script src="{k}js/site.js" defer></script>
</body>
</html>
"""


def sss_bolumu(sss, baslik="Merak edilenler.", id_="sss"):
    ogeler = "".join(f"<details><summary>{e(s)}</summary><p>{e(c)}</p></details>" for s, c in sss)
    return f"""
<section class="bolum sss" id="{id_}" aria-labelledby="sss-baslik">
  <div class="kap kap--dar">
    <p class="ust-baslik ust-baslik--orta">S.S.S.</p>
    <h2 id="sss-baslik" class="orta">{e(baslik)}</h2>
    <div class="sss__liste">{ogeler}</div>
    <p class="orta"><a class="dugme dugme--cizgi" href="#mesaj" data-not="Bir sorum var: ">Sorunuzu yazın</a></p>
  </div>
</section>"""


def yaz(yol, html):
    hedef = os.path.join(KOK, yol, "index.html") if yol else os.path.join(KOK, "index.html")
    os.makedirs(os.path.dirname(hedef), exist_ok=True)
    with open(hedef, "w", encoding="utf-8") as f:
        f.write(html)


# ---------------------------------------------------------------- ana sayfa
SSS_ANA = [
    ("Etimesgut dışına ölçüye geliyor musunuz?", "Adresimiz Etimesgut'ta. Ankara'nın başka bir semtindeyseniz mesajınıza yazın, gelip gelemeyeceğimizi hemen söyleyelim."),
    ("Ölçüye siz mi geliyorsunuz?", "Evet. Ölçü, proje ve montaj bizde: yerinde ölçü alıyor, çizimi hazırlıyor, ürettiğimiz mobilyayı evinizde kuruyoruz."),
    ("Fiyat nasıl belirleniyor?", "Ölçüye, kapak ve tezgâh seçimine, aydınlatma gibi detaylara göre değişiyor; bu yüzden sitede fiyat yazmıyoruz. Odanın fotoğrafını ve kabaca ölçüsünü gönderin, size göre konuşalım."),
    ("Fotoğraf göndererek bilgi alabilir miyim?", "Evet. Odanın fotoğrafını ve kabaca ölçüsünü gönderin; Instagram'da beğendiğiniz bir iş varsa onu da ekleyin."),
    ("Tek bir dolap için de geliyor musunuz?", "Fotoğraflarımızda tek parça işler de var: petek örtüsü, ayakkabılık, makine dolabı. Önce fotoğrafını gönderin."),
    ("Hangi kapak seçenekleri var?", "Fotoğraflarda mat, parlak ve ahşap desenli kapaklar görüyorsunuz. Hangisinin evinize uyacağını mesajda sorun, seçenekleri anlatalım."),
    ("Işıklı raf ve LED ayna yapıyor musunuz?", "Evet; raf içi, dolap altı ve ayna çevresi ışıklı işlerimiz fotoğraflarda. Işığın yeri proje aşamasında belirlenir."),
]

SEGMENT = [
    ("Yeni eve taşınıyorum", "Mutfak, gardırop, banyo ve antreyi birlikte planlayalım; aynı kapak rengiyle ev tek parça görünsün.",
     "Yeni evim için", "Yeni evim için mutfak, gardırop, banyo ve antreyi birlikte planlamak istiyorum."),
    ("Evimi yeniliyorum", "Eskiyen dolabın yerine ölçüye yenisini yapıyoruz. Tesisat ve priz yerleri ölçü günü netleşir.",
     "Yenileme için", "Evimdeki eski dolabın yerine ölçüye göre yenisini yaptırmak istiyorum."),
    ("Tek bir köşe için", "Makine dolabı, petek örtüsü, ayakkabılık, TV duvarı… Küçük işler de fotoğraflarımızda var.",
     "Bir köşe için", "Evimdeki tek bir köşe için ölçüye göre bir dolap yaptırmak istiyorum."),
    ("Fiyat araştırıyorum", "Fiyat ölçüye ve kapak seçimine göre değişir. Fotoğraf ve kabaca ölçü gönderin, size göre konuşalım.",
     "Fiyat için", "Fiyat bilgisi almak istiyorum; odanın fotoğrafını ve kabaca ölçüsünü gönderiyorum."),
]

COZUM = [
    ("mutfak-dolabi", "Mutfak dolabı", "Alt-üst dolap, buzdolabını içine alan boy dolap, kahve köşesi ve gizli LED.", "mutfak-led-ust-dolap", ["mutfak"], "Mutfak dolabı"),
    ("gardirop", "Gardırop ve yatak odası", "Tavana kadar, sürgülü aynalı ya da kulpsuz; yatak başlığı ve makyaj masası.", "gardirop-tavana-kadar-gri", ["gardirop", "yatak"], "Gardırop"),
    ("banyo-dolabi", "Banyo dolabı", "Lavabo altı, boy dolabı, çamaşır makinesi dolabı ve ışıklı aynalar.", "banyo-yuvarlak-led-ayna", ["banyo"], "Banyo dolabı"),
    ("vestiyer", "Vestiyer ve antre", "Oturma nişi, askılık, ayakkabılık, kiler rafı ve petek örtüsü.", "vestiyer-mese-nis-oturma", ["antre"], "Vestiyer / antre"),
    ("tv-unitesi-kitaplik", "TV ünitesi ve kitaplık", "Işıklı nişli TV duvarı ve tavana kadar kitaplık.", "tv-unitesi-led-nis", ["tv"], "TV ünitesi / kitaplık"),
    ("isler", "Mağaza ve ofis", "Mağaza rafı, tezgâh ve çalışma masası.", "magaza-raf-sistemi", ["ticari"], "Başka bir iş"),
]

SUREC = [
    ("Bize yazarsınız", "Odanın fotoğrafını ve kabaca ölçüsünü gönderirsiniz; Instagram'da beğendiğiniz bir iş varsa onu da eklersiniz."),
    ("Yerinde ölçü", "Evinize gelip ölçü alıyoruz. Duvar, kolon, tesisat ve priz yerleri burada netleşir."),
    ("Proje ve çizim", "Ölçüye göre çizimi hazırlıyoruz; kapak rengi, kulp ve ışık yeri bu aşamada seçilir."),
    ("İmalat", "Onayladığınız çizime göre mobilyanızı üretiyoruz."),
    ("Montaj", "Ürettiğimiz mobilyayı evinizde kuruyoruz."),
]

DETAY = [
    ("mutfak-buzdolabi-nisi", "Işıklı cam kapak", "Üst dolabın bir bölümünü camlı ve içi ışıklı yapmak, kapalı dolap sırasını hafifletir."),
    ("gardirop-tavana-kadar-gri", "İnce boy kulpu", "Tavana kadar kapaklarda boydan kulp, kapağı her yükseklikten tutmayı kolaylaştırır."),
    ("tv-unitesi-led-nis", "Işıklı niş", "Raf altına gizlenen şerit ışık, akşam salonda tek başına yeterli bir ışık verir."),
]

SATIRLAR = [("mutfak", "Mutfak dolabı", "Tüm mutfak işleri"), ("gardirop", "Gardırop", "Tüm gardırop işleri"), ("banyo", "Banyo dolabı", "Tüm banyo işleri"), ("antre", "Vestiyer ve antre", "Tüm antre işleri")]


def ana_sayfa():
    k = "./"
    schema = ld(isletme(), {"@type": "WebSite", "@id": URL + "#site", "url": URL, "name": "Aytaç Mobilya", "inLanguage": "tr-TR"},
                sss_ld(SSS_ANA))
    h = bas(k, "", "Aytaç Mobilya | Etimesgut Özel Ölçü Mobilya İmalatı",
            "Etimesgut'ta ölçüye göre mutfak dolabı, gardırop, banyo dolabı, vestiyer ve TV ünitesi. Yerinde ölçü, proje, imalat ve montaj. Gerçek iş fotoğrafları.",
            schema, seffaf=True)
    duvar = "".join(f'<li>{img(f, k, yukle="eager" if i < 6 else "lazy", alt="")}</li>' for i, f in enumerate(DUVAR))
    guven = [
        ("olcu", "Yerinde ölçü", "Duvar, kolon ve tesisatı evinizde ölçüyoruz."),
        ("cizim", "Proje ve çizim", "Kapak, kulp ve ışık yeri çizimde netleşir."),
        ("imalat", "Kendi imalatımız", "Onayladığınız çizime göre üretip kuruyoruz."),
    ]
    guven_html = "".join(f'<li>{svg(s)}<div><b>{e(b)}</b><span>{e(m)}</span></div></li>' for s, b, m in guven)
    guven_html += (f'<li>{svg("yildiz")}<div><b>Google\'da 5,0</b><span><a href="{HARITA}" target="_blank" rel="noopener" '
                   f'data-olay="yorum_tikla">131 değerlendirme</a> · yorumları biz seçmedik</span></div></li>')
    segment = "".join(f"""
      <li><h3>{e(b)}</h3><p>{e(m)}</p><a class="ok-link" href="#mesaj" data-not="{e(n)}">{e(c)} yazın</a></li>""" for b, m, c, n in SEGMENT)
    cozum = "".join(f"""
      <li class="cozum">
        <a class="cozum__foto" href="{k}{y}/{'#ticari' if y == 'isler' else ''}" tabindex="-1" aria-hidden="true">{img(f, k, alt="")}</a>
        <div class="cozum__metin">
          <span class="cozum__no">{i:02d}</span>
          <h3><a href="{k}{y}/{'#ticari' if y == 'isler' else ''}">{e(ad)}</a></h3>
          <p>{e(m)}</p>
          <div class="cozum__linkler">
            <a class="ok-link" href="#mesaj" data-tur="{e(dict(MESAJ_TURLERI)[sec])}">Bu iş için yazın</a>
            <a class="ince-link" href="{k}{'isler/#' + t[0] if y != 'isler' else 'isler/#ticari'}">{sayi(t)} örneği görün</a>
          </div>
        </div>
      </li>""" for i, (y, ad, m, f, t, sec) in enumerate(COZUM, 1))
    surec = "".join(f'<li><span class="surec__no">{i:02d}</span><h3>{e(b)}</h3><p>{e(m)}</p></li>' for i, (b, m) in enumerate(SUREC, 1))
    detay = "".join(f'<li><figure>{img(f, k)}<figcaption><b>{e(b)}</b><span>Neden önemli? {e(m)}</span></figcaption></figure></li>' for f, b, m in DETAY)
    satirlar = ""
    for t, ad, cap in SATIRLAR:
        fotolar = [f for f, _, tt in FOTO if tt == t][:7]
        kartlar = "".join(f'<li><figure>{img(f, k)}<figcaption>{e(FOTO_ALT[f])}</figcaption></figure></li>' for f in fotolar)
        satirlar += f"""
    <div class="satir">
      <div class="satir__bas"><h3>{e(ad)}</h3><a class="ince-link" href="{k}isler/#{t}">{e(cap)}</a></div>
      <ul class="satir__liste">{kartlar}</ul>
    </div>"""
    h += f"""
<section class="giris" aria-labelledby="giris-baslik">
  <ul class="giris__duvar" aria-hidden="true">{duvar}</ul>
  <div class="giris__perde"></div>
  <div class="kap giris__ic">
    <p class="ust-baslik ust-baslik--acik">Etimesgut · Kişiye özel mobilya imalatı</p>
    <h1 id="giris-baslik">Etimesgut'ta ölçüye göre mutfak, gardırop ve banyo dolabı</h1>
    <p class="giris__alt">Ölçüsünü yerinde alıyor, projesini çiziyor, kendimiz üretip evinize kuruyoruz. Arkadaki fotoğrafların hepsi bizim işlerimiz.</p>
    <div class="eylemler eylemler--orta">
      <a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">Projenizi konuşalım</a>
      <a class="dugme dugme--seffaf" href="{k}isler/">Yaptığımız işler</a>
    </div>
    <p class="giris__not">Odanızın fotoğrafını göndererek başlayabilirsiniz.</p>
  </div>
</section>

<section class="guven" aria-label="Neden Aytaç Mobilya">
  <ul class="kap guven__liste">{guven_html}</ul>
</section>

<section class="bolum" aria-labelledby="segment-baslik">
  <div class="kap">
    <p class="ust-baslik ust-baslik--orta">Size uygun başlangıç</p>
    <h2 id="segment-baslik" class="orta">Siz hangi ihtiyaçtasınız?</h2>
    <ul class="segment">{segment}
    </ul>
  </div>
</section>

<section class="bolum bolum--panel" id="cozumler" aria-labelledby="cozum-baslik">
  <div class="kap">
    <p class="ust-baslik ust-baslik--orta">Çözümlerimiz</p>
    <h2 id="cozum-baslik" class="orta">Odanıza göre, ölçüsüne göre.</h2>
    <p class="orta bolum__alt">Hazır mobilya köşeye, kolona, tavana oturmaz. Biz dolabı odanın ölçüsüne göre çiziyoruz.</p>
    <ul class="cozumler">{cozum}
    </ul>
  </div>
</section>

<section class="bant" aria-labelledby="bant-baslik">
  <div class="kap kap--dar orta">
    <p class="ust-baslik ust-baslik--orta">Başlangıç noktası</p>
    <h2 id="bant-baslik">Odanızı bize gösterin.</h2>
    <p class="bolum__alt">Ne istediğinizi bir iki cümleyle yazın, odanın fotoğrafını ekleyin; birlikte değerlendirelim.</p>
    <a class="dugme" href="#mesaj" data-olay="mesaja_git">Fotoğrafınızı gönderin</a>
  </div>
</section>

<section class="surec-bant" id="surec" aria-labelledby="surec-baslik">
  <div class="kap">
    <p class="ust-baslik ust-baslik--acik">Aytaç'ta bir iş nasıl ilerler?</p>
    <h2 id="surec-baslik">Siz anlatın,<br>ölçüsünü biz alalım.</h2>
    <p class="surec-bant__alt">Fotoğraftan montaja beş adım.</p>
    <ol class="surec">{surec}</ol>
    <p class="orta"><a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">İlk adımı atın</a></p>
  </div>
</section>

<section class="bolum iscilik" aria-labelledby="iscilik-baslik">
  <div class="kap iscilik__izgara">
    <figure class="iscilik__foto">{img("kitaplik-led-raf", k)}</figure>
    <div>
      <p class="ust-baslik">İşçilik</p>
      <h2 id="iscilik-baslik">İşçilik detayda<br>belli olur.</h2>
      <p class="iscilik__alt">"Kaliteliyiz" demek yerine fotoğraflarda görüneni yazıyoruz.</p>
      <dl class="ozellik">
        <div><dt>Yüzey</dt><dd>Mat, parlak ve ahşap desenli kapaklar</dd></div>
        <div><dt>Aydınlatma</dt><dd>Raf altı, dolap altı ve ayna arkası şerit ışık</dd></div>
        <div><dt>Kulp</dt><dd>İnce siyah boy kulpu, yuvarlak kulp ya da kulpsuz görünüm</dd></div>
        <div><dt>Ölçü</dt><dd>Tavana kadar, duvardan duvara</dd></div>
      </dl>
    </div>
  </div>
  <div class="kap">
    <p class="ust-baslik iscilik__detay-bas">Detaylar</p>
    <ul class="detaylar">{detay}</ul>
  </div>
</section>

<section class="bolum bolum--ust-cizgi" aria-labelledby="isler-baslik">
  <div class="kap">
    <p class="ust-baslik ust-baslik--orta">Gerçek projeler</p>
    <h2 id="isler-baslik" class="orta">Yaptığımız işler konuşsun.</h2>
    <p class="orta bolum__alt">Hepsi Instagram hesabımızda paylaştığımız işler. Kaydırarak diğerlerini görün.</p>
    {satirlar}
    <p class="orta satir__son"><a class="dugme dugme--cizgi" href="{k}isler/">{len(FOTO)} işin hepsini görün</a></p>
  </div>
</section>

<section class="bolum bolum--panel" id="iletisim" aria-labelledby="yer-baslik">
  <div class="kap yer__izgara">
    <div>
      <p class="ust-baslik">Etimesgut, 30 Ağustos Mahallesi</p>
      <h2 id="yer-baslik">2071. Sokak, No:14A.</h2>
      <p class="yer__alt">Aytaç Mobilya, Etimesgut'ta kişiye özel mobilya üreten bir imalatçı. Ölçü, proje ve montajı kendimiz yapıyor, işlerimizi bitirdikçe Instagram'da paylaşıyoruz.</p>
      <dl class="tablo">
        <div><dt>Adres</dt><dd>30 Ağustos Mah., 2071. Sk. 14A, 06794 Etimesgut/Ankara</dd></div>
        <div><dt>Plus code</dt><dd>WMV2+23 Etimesgut</dd></div>
        <div data-tel-satiri hidden><dt>Telefon</dt><dd><a data-tel href="#">Telefon</a></dd></div>
        <div><dt>Instagram</dt><dd><a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">@aytac_mobilya</a></dd></div>
        <div><dt>Google</dt><dd><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">5,0 · 131 değerlendirme</a></dd></div>
        <div><dt>Çalışma saati</dt><dd>Bugünkü saat <a href="{HARITA}" target="_blank" rel="noopener">Google Haritalar'da</a>; gelmeden önce yazın</dd></div>
      </dl>
      <div class="eylemler">
        <a class="dugme" href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi_tikla">Yol tarifi al</a>
        <a class="dugme dugme--cizgi" href="#mesaj" data-olay="mesaja_git">Mesaj yazın</a>
      </div>
    </div>
    <figure class="yer__foto">{img("vestiyer-citali-panel", k)}<figcaption>Fotoğraf: @aytac_mobilya</figcaption></figure>
  </div>
</section>
{sss_bolumu(SSS_ANA)}
{kapanis(k)}
"""
    h += son(k)
    yaz("", h)


# ------------------------------------------------------------ hizmet sayfası
HIZMET = {
    "mutfak-dolabi": dict(
        ust="Mutfak dolabı · Etimesgut / Ankara",
        tum="Tüm mutfak işleri", galeri="Kurduğumuz mutfaklar",
        title="Mutfak Dolabı Etimesgut, Ölçüye Göre | Aytaç Mobilya",
        meta="Etimesgut ve Ankara'da ölçüye göre mutfak dolabı: alt-üst dolap, boy dolap, buzdolabı nişi, kahve köşesi, gizli LED. Gerçek mutfak fotoğrafları.",
        h1="Ölçüye göre mutfak dolabı",
        giris="Duvardan duvara, tavana kadar. Buzdolabı, fırın ve bulaşık makinesinin yerini ölçüde belirliyor, dolabı ona göre çiziyoruz. Aşağıdaki mutfakların hepsi bizim kurduğumuz işler.",
        ana=["mutfak-led-ust-dolap", "mutfak-boy-dolap"], turler=["mutfak"], secili="Mutfak dolabı",
        detay=["Alt ve üst dolap", "Buzdolabını içine alan boy dolap", "Ankastre fırın ve bulaşık makinesi yeri",
               "Cam kapaklı, içi ışıklı üst dolap", "Tavan bandında ve dolap altında şerit ışık",
               "Mat, parlak ve iki renkli (antrasit alt, beyaz üst) kapak"],
        ek=("Kahve köşesi", "Mutfağın bir köşesini ya da buzdolabının yanını kahve köşesine çeviriyoruz: üstte açık raf veya cam kapak, altta çekmece, arada makine için tezgâh. Instagram'da \"Kahve köşesi\" başlığında örnekleri var."),
        hazirlik=["Buzdolabı, fırın ve bulaşık makinesinin genişliğini not alın; yenisini alacaksanız modelini yazın.",
                  "Su çıkışı, doğalgaz ve prizlerin yerini fotoğraflayın.",
                  "Duvarın uzunluğunu ve tavan yüksekliğini kabaca ölçün; köşe ya da kolon varsa belirtin.",
                  "Beğendiğiniz kapak rengini ya da Instagram'daki bir mutfağı ekleyin."],
        sss=[("Mutfak dolabı için ölçüye geliyor musunuz?", "Evet; yerinde ölçü alıyor, çizimi hazırlıyor ve montajı yapıyoruz. Etimesgut dışındaysanız semtinizi yazın."),
             ("Tezgâh da sizden mi?", "Fotoğraflardaki mutfaklarda tezgâh da var; istediğiniz tezgâh türünü mesajınızda sorun, konuşalım."),
             ("Eski mutfağı söküyor musunuz?", "Mesajınızda belirtin; ölçü günü konuşalım."),
             ("Kahve köşesi ayrıca yapılır mı?", "Evet; mutfağın bir köşesine ya da buzdolabının yanına ayrı bir kahve köşesi yapabiliyoruz. Yerin fotoğrafını gönderin.")],
        kardes=[("tv-unitesi-kitaplik", "Aydınlatmalı raf ve kitaplık"), ("banyo-dolabi", "Banyo dolabı")],
    ),
    "gardirop": dict(
        ust="Gardırop ve yatak odası · Ankara",
        tum="Tüm gardırop işleri", galeri="Gardıroplar ve yatak odaları",
        title="Gardırop ve Giyinme Dolabı, Ankara | Aytaç Mobilya",
        meta="Ölçüye göre gardırop: tavana kadar dolap, sürgülü aynalı kapak, kulpsuz ve profil kulplu modeller, yatak başlığı paneli. Etimesgut'tan Ankara'ya.",
        h1="Tavana kadar gardırop, ölçüye göre",
        giris="Hazır gardırobun tavanla arasında kalan boşluk, köşede kalan bir karış — ölçüye yapılan dolapta olmuyor. Kapak sayısını, askı ve raf düzenini odaya göre çiziyoruz.",
        ana=["gardirop-tavana-kadar-gri", "gardirop-panjur-kapak"], turler=["gardirop", "yatak"], secili="Gardırop",
        detay=["Tavana kadar boy dolap", "Sürgülü, aynalı kapak", "Kulpsuz görünüm ve ince siyah boy kulpu",
               "Yivli kapak yüzeyi", "Ahşap desenli kapak", "Yatak başlığı paneli, komodin, makyaj masası"],
        ek=("Yatak odasının geri kalanı", "Gardırobun yanına yatak başlığı paneli, komodin ve ışıklı aynalı makyaj masası da yapıyoruz; aynı kapak rengiyle oda tek parça görünür."),
        hazirlik=["Duvarın uzunluğunu ve tavan yüksekliğini kabaca ölçün.",
                  "Dolabın önünde kalacak boşluğu (yatak ile duvar arası) not alın; sürgülü mü kapaklı mı kararını bu belirler.",
                  "Pencere, priz ve kalorifer peteğinin yerini fotoğraflayın.",
                  "Askı mı raf mı daha çok lazım, yazın."],
        sss=[("Sürgülü mü kapaklı mı?", "Dolabın önünde ne kadar boşluk kaldığına göre değişiyor; ölçüde birlikte bakalım."),
             ("İç düzeni ben mi seçiyorum?", "Evet; askı, raf ve çekmece yerini projede birlikte belirliyoruz."),
             ("Gardırop tavana kadar olur mu?", "Evet; fotoğraflardaki gardıropların çoğu tavana kadar. Tavan yüksekliğini mesajınıza ekleyin.")],
        kardes=[("vestiyer", "Antrede boy dolabı"), ("tv-unitesi-kitaplik", "TV ünitesi ve kitaplık")],
    ),
    "banyo-dolabi": dict(
        ust="Banyo dolabı · Etimesgut / Ankara",
        tum="Tüm banyo işleri", galeri="Kurduğumuz banyolar",
        title="Banyo Dolabı ve LED Ayna, Etimesgut | Aytaç Mobilya",
        meta="Ölçüye göre banyo dolabı: lavabo altı dolap, boy dolabı, çamaşır makinesi dolabı ve LED aynalar. Etimesgut ve Ankara'dan gerçek banyo fotoğrafları.",
        h1="Banyo dolabı, makine dolabı ve LED ayna",
        giris="Banyoda her santim iş görür. Lavabo altını, makinenin üstünü ve kapı arkasındaki dar boşluğu ölçüye göre dolaba çeviriyoruz.",
        ana=["banyo-oval-led-ayna", "banyo-makine-yan-dolap"], turler=["banyo"], secili="Banyo dolabı",
        detay=["Lavabo altı dolap", "Tavana kadar boy dolabı", "Çamaşır makinesinin üstüne ve yanına dolap",
               "Oval, yuvarlak ve dikdörtgen LED ayna", "Yivli ve düz kapak"],
        ek=None,
        hazirlik=["Lavabo, klozet ve çamaşır makinesinin yerini gösteren geniş bir fotoğraf çekin.",
                  "Makinenin genişliğini ve yüksekliğini not alın.",
                  "Su çıkışları ve prizlerin yerini fotoğraflayın.",
                  "Ayna için istediğiniz şekli (oval, yuvarlak, dikdörtgen) yazın."],
        sss=[("Makine dolabı yapıyor musunuz?", "Evet; makinenin üstüne ve yanına dolap yaptığımız banyolar fotoğraflarda. Makinenin ölçüsünü mesajınıza ekleyin."),
             ("LED aynayı tek başına yaptırabilir miyim?", "Mesajınızda sorun; fotoğrafını görünce söyleyelim."),
             ("Küçük banyoya boy dolabı sığar mı?", "Banyonun fotoğrafını ve kapı arkası genişliğini gönderin; neyin sığacağını söyleyelim.")],
        kardes=[("vestiyer", "LED ayna ve petek örtüsü"), ("mutfak-dolabi", "Mutfak dolabı")],
    ),
    "vestiyer": dict(
        ust="Vestiyer ve antre · Etimesgut / Ankara",
        tum="Tüm antre işleri", galeri="Antre, ayakkabılık ve kiler",
        title="Vestiyer, Ayakkabılık ve Kiler Dolabı | Aytaç Mobilya",
        meta="Ölçüye göre vestiyer: oturma nişi, askılık, ayakkabılık, kiler rafı, petek örtüsü ve çıtalı bölme. Etimesgut ve Ankara'dan gerçek antre fotoğrafları.",
        h1="Vestiyer ve antre dolapları",
        giris="Kapıdan girince ilk görülen yer. Ayakkabı, mont ve çanta için dolap; oturup ayakkabı giyecek bir niş; kalorifer peteğini kapatan bir örtü.",
        ana=["vestiyer-mese-nis-oturma", "antre-led-ayna-petek-ortusu"], turler=["antre"], secili="Vestiyer / antre",
        detay=["Ahşap desenli oturma nişi ve askılık", "Boy dolabıyla birleşen vestiyer", "Kapaklı ayakkabılık",
               "Kiler için tavana kadar raf", "Kafesli petek örtüsü ve üstünde LED ayna", "Antreyi salondan ayıran çıtalı bölme"],
        ek=None,
        hazirlik=["Antrenin kapıdan bakan bir fotoğrafını çekin.",
                  "Duvarın genişliğini ve kapının açıldığı yönü not alın.",
                  "Kalorifer peteği, priz ve sigorta kutusunun yerini fotoğraflayın.",
                  "Ayakkabı, mont, süpürge — ne sığmalı, yazın."],
        sss=[("Dar antreye olur mu?", "Antrenin fotoğrafını ve genişliğini gönderin; neyin sığacağını söyleyelim."),
             ("Petek örtüsü yapıyor musunuz?", "Evet; kafesli petek örtüsü ve üstüne ışıklı ayna yaptığımız antreler fotoğraflarda."),
             ("Kiler dolabı da yapılır mı?", "Evet; tavana kadar raflı kiler dolabı örneğimiz galeride.")],
        kardes=[("banyo-dolabi", "LED ayna ve banyo dolabı"), ("gardirop", "Gardırop")],
    ),
    "tv-unitesi-kitaplik": dict(
        ust="TV ünitesi ve kitaplık · Etimesgut / Ankara",
        tum="Tüm TV ve kitaplık işleri", galeri="TV duvarları ve kitaplıklar",
        title="TV Ünitesi ve Kitaplık, Ölçüye Göre | Aytaç Mobilya",
        meta="Ölçüye göre TV ünitesi ve kitaplık: ışıklı nişler, tavana kadar raf, şömineli TV ünitesi. Etimesgut ve Ankara'dan gerçek salon fotoğrafları.",
        h1="TV ünitesi ve kitaplık",
        giris="Salonun bir duvarını tek parça düşünüyoruz: TV'nin yeri, kablo, raf ve ışık birlikte çiziliyor.",
        ana=["tv-unitesi-led-nis", "kitaplik-led-raf"], turler=["tv"], secili="TV ünitesi / kitaplık",
        detay=["İki yanı ışıklı nişli TV duvarı", "Raf altlarına gizli şerit ışık", "Tavana kadar kitaplık, altta kapaklı dolap",
               "Şömine görünümlü TV ünitesi"],
        ek=None,
        hazirlik=["TV'nin ekran boyunu ve duvarın genişliğini not alın.",
                  "Priz, anten ve internet kablosunun çıktığı yeri fotoğraflayın.",
                  "Kitaplık için kaç raf kitabınız olduğunu kabaca yazın."],
        sss=[("Kablolar görünür mü?", "Kablonun nereden geçeceğini projede belirliyoruz; prizin yerini ölçüde not ediyoruz."),
             ("Kitaplık tavana kadar olur mu?", "Evet; tavana kadar, altı kapaklı kitaplık örneğimiz galeride.")],
        kardes=[("mutfak-dolabi", "Kahve köşesi ve mutfak"), ("gardirop", "Gardırop")],
    ),
}


def ic_bas(k, yol, ad, ust, h1, giris, fotolar, eylemler, antet):
    """Hizmet ve İşler sayfalarının koyu giriş bandı."""
    kolaj = "".join(f'<figure class="ic-giris__f{i}">{img(f, k, yukle="eager")}</figure>' for i, f in enumerate(fotolar, 1))
    return f"""
<section class="ic-giris">
  <div class="kap ic-giris__izgara">
    <div class="ic-giris__metin">
      <nav class="kirinti" aria-label="Konum"><a href="{k}">Ana sayfa</a> <span aria-hidden="true">/</span> <span aria-current="page">{e(ad)}</span></nav>
      <p class="ust-baslik ust-baslik--acik">{e(ust)}</p>
      <h1>{e(h1)}</h1>
      <p class="ic-giris__alt">{e(giris)}</p>
      <div class="eylemler">{eylemler}</div>
      <dl class="ic-antet">{antet}</dl>
    </div>
    <div class="ic-giris__kolaj" aria-hidden="true">{kolaj}</div>
  </div>
</section>"""


def hizmet_sayfasi(yol):
    d = HIZMET[yol]
    k = "../"
    ad = SAYFALAR[yol]
    fotolar = [f for f, _, t in FOTO if t in d["turler"]]
    servis = {"@type": "Service", "name": d["h1"], "serviceType": ad, "description": d["meta"], "url": URL + yol + "/",
              "provider": {"@id": URL + "#isletme"},
              "areaServed": [{"@type": "AdministrativeArea", "name": "Etimesgut"}, {"@type": "City", "name": "Ankara"}],
              "image": [URL + f"img/{f}.webp" for f in fotolar[:6]]}
    schema = ld(isletme(), servis, kirinti_ld([("", "Ana sayfa"), (yol + "/", ad)]), sss_ld(d["sss"]))
    h = bas(k, yol, d["title"], d["meta"], schema)
    eylemler = (f'<a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">Bu iş için yazın</a>'
                f'<a class="dugme dugme--seffaf" href="{k}isler/#{d["turler"][0]}">{e(d["tum"])}</a>')
    antet = (f'<div><dt>Bu sayfada</dt><dd>{len(fotolar)} gerçek iş fotoğrafı</dd></div>'
             f'<div><dt>Google</dt><dd><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">5,0 · 131 değerlendirme</a></dd></div>'
             f'<div><dt>Hizmet</dt><dd>Ölçü · Proje · İmalat · Montaj</dd></div>')
    h += ic_bas(k, yol, ad, d["ust"], d["h1"], d["giris"], d["ana"], eylemler, antet)
    ek = f'<div class="ek"><h3>{e(d["ek"][0])}</h3><p>{e(d["ek"][1])}</p></div>' if d["ek"] else ""
    diger = "".join(f'<li><a href="{k}{y}/">{img(next(c[3] for c in COZUM if c[0] == y), k, alt="")}<span>{e(a)}</span></a></li>'
                    for y, a in SAYFALAR.items() if y != yol)
    kardes = " · ".join(f'<a href="{k}{y}/">{e(a)}</a>' for y, a in d["kardes"])
    h += f"""
<section class="bolum" aria-labelledby="foto-baslik">
  <div class="kap">
    <div class="bolum__bas">
      <div><p class="ust-baslik">Gerçek projeler</p><h2 id="foto-baslik">{e(d["galeri"])}</h2></div>
      <a class="ince-link" href="{k}isler/#{d['turler'][0]}">Galeride aç</a>
    </div>
    <ul class="izgara">{"".join(f"<li><figure>{img(f, k)}<figcaption>{e(FOTO_ALT[f])}</figcaption></figure></li>" for f in fotolar)}</ul>
  </div>
</section>

<section class="bolum bolum--panel" aria-labelledby="detay-baslik">
  <div class="kap ikili">
    <div>
      <p class="ust-baslik">Neler yapıyoruz</p>
      <h2 id="detay-baslik">Bu işlerde neler var</h2>
      <ul class="liste-cizgi">{"".join(f"<li>{e(x)}</li>" for x in d["detay"])}</ul>
      {ek}
    </div>
    <div>
      <p class="ust-baslik">Ölçü gününden önce</p>
      <h2>Hazırlayabilecekleriniz</h2>
      <ol class="liste-no">{"".join(f"<li>{e(x)}</li>" for x in d["hazirlik"])}</ol>
      <p class="kardes">Süreç: fotoğraf, yerinde ölçü, proje, imalat, montaj. <a href="{k}#surec">Adım adım okuyun</a>. Şunlara da bakın: {kardes}</p>
    </div>
  </div>
</section>
{sss_bolumu(d["sss"], "Bu konuda sorulanlar.")}
{kapanis(k, d["secili"])}
<nav class="bolum diger" aria-labelledby="diger-baslik"><div class="kap">
  <p class="ust-baslik ust-baslik--orta">Diğer çözümler</p><h2 id="diger-baslik" class="orta">Evin diğer odaları</h2>
  <ul class="diger__liste">{diger}</ul>
</div></nav>
"""
    h += son(k)
    yaz(yol, h)


# ------------------------------------------------------------------- işler
def isler_sayfasi():
    k = "../"
    yol = "isler"
    meta = f"Aytaç Mobilya'nın kurduğu mutfak, gardırop, banyo, vestiyer, TV ünitesi ve mağaza işlerinden {len(FOTO)} fotoğraf. Stok görsel yok, hepsi gerçek iş."
    galeri = {"@type": "CollectionPage", "name": "Yaptığımız işler", "url": URL + "isler/", "about": {"@id": URL + "#isletme"},
              "mainEntity": {"@type": "ImageGallery", "image": [
                  {"@type": "ImageObject", "contentUrl": URL + f"img/{f}.webp", "description": a, "width": W, "height": H} for f, a, _ in FOTO]}}
    schema = ld(isletme(), galeri, kirinti_ld([("", "Ana sayfa"), ("isler/", "Yaptığımız işler")]))
    h = bas(k, yol, "Yaptığımız İşler, Gerçek Ev Fotoğrafları | Aytaç Mobilya", meta, schema)
    eylemler = f'<a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">Benzerini isteyin</a>'
    antet = (f'<div><dt>Galeride</dt><dd>{len(FOTO)} gerçek iş fotoğrafı</dd></div>'
             f'<div><dt>Kaynak</dt><dd><a href="{INSTAGRAM}" target="_blank" rel="noopener">@aytac_mobilya</a></dd></div>')
    h += ic_bas(k, yol, "Yaptığımız işler", "Gerçek projeler", "Yaptığımız işler",
                "Hepsi Instagram hesabımızda paylaştığımız işler. Bazı karelerde koruma naylonu ya da matkap göreceksiniz.",
                ["mutfak-tavan-bandi-led", "gardirop-cizgili-kapak"], eylemler, antet)
    suzgec = '<button type="button" data-suz="hepsi" aria-pressed="true">Tümü</button>' + "".join(
        f'<button type="button" data-suz="{t}" aria-pressed="false">{e(a)} <small>{sayi([t])}</small></button>' for t, a in TURLER)
    ogeler = "".join(f"""<li data-tur="{t}"><button type="button" class="galeri__oge" data-buyut="{f}" aria-label="Büyüt: {e(a)}">{img(f, k)}</button></li>""" for f, a, t in FOTO)
    h += f"""
<section class="bolum galeri" aria-label="Fotoğraflar">
  <div class="kap">
    <div class="suzgec" role="group" aria-label="İş türüne göre süz">{suzgec}</div>
    <p class="galeri__sayi" data-sayi aria-live="polite">{len(FOTO)} fotoğraf</p>
    <ul class="izgara izgara--galeri">{ogeler}</ul>
    <p class="kucuk-not orta">Daha fazlası ve videolar: <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">Instagram · @aytac_mobilya</a></p>
  </div>
</section>
<dialog class="buyuk" data-buyuk aria-label="Fotoğraf">
  <form method="dialog"><button class="buyuk__kapat" aria-label="Kapat">Kapat</button></form>
  <img data-buyuk-img src="{k}img/{FOTO[0][0]}.webp" loading="lazy" alt="" width="{W}" height="{H}">
  <p data-buyuk-alt></p>
  <button type="button" class="dugme" data-benzeri data-olay="galeri_benzerini_iste">Bu fotoğraftaki gibi istiyorum</button>
</dialog>
{kapanis(k)}
"""
    h += son(k)
    yaz(yol, h)


def sitemap():
    yollar = [""] + list(SAYFALAR) + ["isler"]
    satir = "".join(f"  <url><loc>{URL}{y + '/' if y else ''}</loc><lastmod>{TARIH}</lastmod></url>\n" for y in yollar)
    with open(os.path.join(KOK, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + satir + "</urlset>\n")


if __name__ == "__main__":
    ana_sayfa()
    for y in SAYFALAR:
        hizmet_sayfasi(y)
    isler_sayfasi()
    sitemap()
    print("7 sayfa + sitemap.xml üretildi")
