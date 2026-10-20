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

# Fotoğrafta görülen detaylara işaret: (x %, y %, etiket, etiket yönü)
ISARET = {
    "mutfak-led-ust-dolap": [(56, 5, "dolap altı şerit ışık", "sol"), (24, 21, "cam kapaklı vitrin", "sag"), (77, 52, "ankastre fırın yeri", "sol")],
    "kitaplik-led-raf": [(62, 28, "raf altı gizli ışık", "sag"), (40, 52, "meşe arka panel", "sol")],
    "banyo-oval-led-ayna": [(63, 30, "ayna arkası LED", "sag"), (50, 80, "tezgâh üstü lavabo", "sol")],
    "mutfak-tavan-bandi-led": [(28, 8, "tavan bandında şerit ışık", "sag"), (57, 30, "bronz cam kapak", "sol"), (55, 47, "tezgâh üstü ışık", "sol"), (96, 33, "köşede ışıklı vitrin", "sol")],
}

SAYFALAR = {
    "mutfak-dolabi": "Mutfak dolabı",
    "gardirop": "Gardırop ve giyinme",
    "banyo-dolabi": "Banyo dolabı",
    "vestiyer": "Vestiyer ve antre",
    "tv-unitesi-kitaplik": "TV ünitesi ve kitaplık",
}
MENU = [("mutfak-dolabi", "Mutfak"), ("gardirop", "Gardırop"), ("banyo-dolabi", "Banyo"),
        ("vestiyer", "Vestiyer"), ("tv-unitesi-kitaplik", "TV ve kitaplık"), ("isler", "İşler")]
MESAJ_TURLERI = [("Mutfak dolabı", "mutfak dolabı"), ("Gardırop", "gardırop"), ("Banyo dolabı", "banyo dolabı"),
                 ("Vestiyer / antre", "vestiyer / antre"), ("TV ünitesi / kitaplık", "TV ünitesi / kitaplık"), ("Başka bir iş", "başka bir iş")]


def e(s):
    return escape(s, quote=True)


def img(dosya, k, sinif="", yukle="lazy", sizes=None):
    a = e(FOTO_ALT[dosya])
    return (f'<img src="{k}img/{dosya}.webp" width="{W}" height="{H}" alt="{a}" '
            f'loading="{yukle}" decoding="async"' + (f' class="{sinif}"' if sinif else "") + ">")


def isaretli(dosya, k, yukle="lazy", sinif="", isaret=True):
    """Fotoğraf + üzerinde görülen detayları adlandıran ince işaret çizgileri."""
    if not isaret:
        return f'<figure class="isaretli {sinif}">{img(dosya, k, yukle=yukle)}</figure>'
    isaretler = "".join(
        f'<span class="isaret isaret--{y}" style="--x:{x}%;--y:{yy}%"><span>{e(t)}</span></span>'
        for x, yy, t, y in ISARET.get(dosya, []))
    return (f'<figure class="isaretli {sinif}">{img(dosya, k, yukle=yukle)}'
            f'<div class="isaretler" aria-hidden="true">{isaretler}</div></figure>')


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
def bas(k, yol, title, meta, schema, og=None):
    can = URL + (yol + "/" if yol else "")
    og = og or URL + "img/og.jpg"
    return f"""<!doctype html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{e(title)}</title>
  <meta name="description" content="{e(meta)}">
  <link rel="canonical" href="{can}">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#f2efe9">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="Aytaç Mobilya">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(meta)}">
  <meta property="og:url" content="{can}">
  <meta property="og:image" content="{og}">
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
<header class="ust">
  <div class="ust__ic">
    <a class="marka" href="{k}" aria-label="Aytaç Mobilya ana sayfa">
      <img src="{k}img/logo.png" width="44" height="44" alt="">
      <span><b>Aytaç Mobilya</b><small>Tasarım · İmalat · Etimesgut</small></span>
    </a>
    <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu">Menü</button>
    <nav id="menu" class="menu" aria-label="Ana menü">
      <ul>{"".join(f'<li><a href="{k}{y}/"{" aria-current=page" if y == yol else ""}>{e(a)}</a></li>' for y, a in MENU)}</ul>
      <a class="dugme dugme--kucuk" href="#mesaj" data-olay="mesaja_git">Fotoğraf gönder</a>
    </nav>
  </div>
</header>
<main id="icerik">
"""


def mesaj_bolumu(k, secili=None, baslik="Ne yaptırmak istiyorsunuz?"):
    cipler = "".join(
        f'<label class="cip"><input type="checkbox" name="tur" value="{e(v)}"{" checked" if t == secili else ""}><span>{e(t)}</span></label>'
        for t, v in MESAJ_TURLERI)
    return f"""
<section class="mesaj" id="mesaj" aria-labelledby="mesaj-baslik">
  <div class="kap mesaj__izgara">
    <div class="mesaj__sol">
      <h2 id="mesaj-baslik">{e(baslik)}</h2>
      <p>Seçin, mesajınız hazırlansın. Göndermeden önce istediğiniz gibi değiştirebilirsiniz. Odanın fotoğraflarını mesajın ardından ekleyin; kabaca ölçü de yazarsanız ilk konuşmada daha net bir şey söyleyebiliriz.</p>
      <form class="hazirlayici" data-hazirlayici novalidate>
        <fieldset>
          <legend>İş türü</legend>
          <div class="cipler">{cipler}</div>
        </fieldset>
        <label class="alan"><span>Semt</span>
          <input type="text" name="semt" autocomplete="address-level3" placeholder="ör. Elvan, Eryaman, Bağlıca" maxlength="60"></label>
        <label class="alan"><span>Not <small>(isteğe bağlı)</small></span>
          <textarea name="not" rows="3" maxlength="400" placeholder="ör. 3,5 metre duvar, buzdolabı yanında boy dolap olsun"></textarea></label>
        <div class="onizleme">
          <span class="onizleme__etiket">Gidecek mesaj</span>
          <output data-onizleme aria-live="polite"></output>
        </div>
        <div class="hazirlayici__eylem">
          <a class="dugme" data-gonder data-olay="whatsapp_tikla" href="{IG_DM}" target="_blank" rel="noopener">Mesajı gönder</a>
          <span class="durum" data-durum role="status"></span>
        </div>
        <p class="kucuk-not">Bu kutuya yazdıklarınız bize iletilmez; yalnız mesaj metni hazırlanır. Gönder'e bastığınızda <span data-kanal-adi>Instagram</span> açılır, mesajı orada siz gönderirsiniz.</p>
      </form>
    </div>
    <aside class="konum" aria-labelledby="konum-baslik">
      <h2 id="konum-baslik" class="konum__baslik">Bize ulaşın</h2>
      <address>
        <b>{e(FIRMA)}</b><br>
        30 Ağustos Mah., 2071. Sk. No:14A<br>06794 Etimesgut / Ankara
      </address>
      <p class="konum__kod"><span>Plus code</span> WMV2+23 Etimesgut</p>
      <p class="konum__saat">Bugünkü açılış ve kapanış saatini Google Haritalar'da görebilirsiniz. Gelmeden önce yazmanızı öneririz.</p>
      <ul class="konum__linkler">
        <li data-tel-satiri hidden><a data-tel data-olay="telefon_tikla" href="#">Telefon</a></li>
        <li><a href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi_tikla">Yol tarifi al</a></li>
        <li><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">Google Haritalar'da gör</a></li>
        <li><a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">Instagram · @aytac_mobilya</a></li>
      </ul>
    </aside>
  </div>
</section>
"""


def son(k, sayfa_js=""):
    hizmet = "".join(f'<li><a href="{k}{y}/">{e(a)}</a></li>' for y, a in SAYFALAR.items())
    return f"""</main>
<footer class="alt">
  <div class="kap alt__izgara">
    <div>
      <p class="alt__marka">Aytaç Mobilya</p>
      <p>{e(FIRMA)}<br>{e(ADRES)}</p>
      <p data-tel-satiri hidden><a data-tel href="#">Telefon</a></p>
    </div>
    <div>
      <p class="alt__baslik">İşler</p>
      <ul>{hizmet}<li><a href="{k}isler/">Tüm işler</a></li></ul>
    </div>
    <div>
      <p class="alt__baslik">Bu site hakkında</p>
      <p>Fotoğrafların hepsi <a href="{INSTAGRAM}" target="_blank" rel="noopener">@aytac_mobilya</a> Instagram hesabındaki paylaşımlardan; stok görsel yok.</p>
      <p>Bu site çerez kullanmaz ve sizden veri toplamaz. Mesajınız yalnız siz gönderdiğinizde WhatsApp veya Instagram üzerinden bize ulaşır.</p>
    </div>
  </div>
</footer>
<a class="yapiskan" href="#mesaj" data-olay="mesaja_git">Fotoğraf gönder</a>
<script src="{k}js/ayarlar.js"></script>
<script src="{k}js/site.js" defer></script>{sayfa_js}
</body>
</html>
"""


def sss_bolumu(sss, baslik="Sık sorulanlar"):
    ogeler = "".join(f"<details><summary>{e(s)}</summary><p>{e(c)}</p></details>" for s, c in sss)
    return f"""
<section class="sss kap" aria-labelledby="sss-baslik">
  <h2 id="sss-baslik">{e(baslik)}</h2>
  <div class="sss__liste">{ogeler}</div>
</section>"""


def yaz(yol, html):
    hedef = os.path.join(KOK, yol, "index.html") if yol else os.path.join(KOK, "index.html")
    os.makedirs(os.path.dirname(hedef), exist_ok=True)
    with open(hedef, "w", encoding="utf-8") as f:
        f.write(html)


# ---------------------------------------------------------------- ana sayfa
SSS_ANA = [
    ("Fiyat ne kadar?", "Ölçüye, kapak ve tezgâh seçimine göre değişiyor; bu yüzden burada fiyat yazmıyoruz. Odanın fotoğrafını ve kabaca ölçüsünü gönderin, size göre konuşalım."),
    ("Etimesgut dışına geliyor musunuz?", "Adresimiz Etimesgut'ta. Ankara'nın başka bir semtindeyseniz mesajınıza yazın, gelip gelemeyeceğimizi hemen söyleyelim."),
    ("Tek bir dolap için de geliyor musunuz?", "Instagram'ımızda tek parça işler de var: petek örtüsü, ayakkabılık, makine dolabı. Önce fotoğrafını gönderin."),
    ("Ölçüye siz mi geliyorsunuz?", "Evet. Ölçü, proje ve montaj bizde."),
    ("Hangi kapak seçenekleri var?", "Fotoğraflarda mat, parlak ve ahşap desenli kapaklar görüyorsunuz. Hangisinin sizin evinize uyacağını mesajda sorun, seçenekleri anlatalım."),
    ("Işıklı raf ve LED ayna yapıyor musunuz?", "Evet; raf içi, dolap altı ve ayna çevresi ışıklı işlerimiz fotoğraflarda. Işığın yeri proje aşamasında belirlenir."),
]

KAPAKLAR = [
    ("mutfak-dolabi", "Mutfak dolabı", "alt-üst dolap, boy dolap, buzdolabı nişi, kahve köşesi", "mutfak-boy-dolap"),
    ("gardirop", "Gardırop ve giyinme", "tavana kadar, sürgülü aynalı, kulpsuz kapak", "gardirop-tavana-kadar-gri"),
    ("banyo-dolabi", "Banyo dolabı", "lavabo altı, boy dolabı, makine dolabı, LED ayna", "banyo-yuvarlak-led-ayna"),
    ("vestiyer", "Vestiyer ve antre", "oturma nişi, ayakkabılık, kiler rafı, petek örtüsü", "vestiyer-mese-nis-oturma"),
    ("tv-unitesi-kitaplik", "TV ünitesi ve kitaplık", "ışıklı niş, tavana kadar raf", "tv-unitesi-led-nis"),
]

SUREC = [
    ("Fotoğraf", "Odanın fotoğrafını ve kabaca ölçüsünü WhatsApp'tan gönderin. Ne istediğinizi bir iki cümleyle yazın; Instagram'da beğendiğiniz bir iş varsa onu da ekleyin."),
    ("Ölçü", "Yerinde ölçü alıyoruz. Duvar, kolon, tesisat ve priz yerleri burada netleşir."),
    ("Proje", "Ölçüye göre çizimi hazırlıyoruz; kapak rengi, kulp ve ışık yeri bu aşamada seçilir."),
    ("İmalat", "Onayladığınız çizime göre üretiyoruz."),
    ("Montaj", "Evinizde kuruyoruz."),
]


def ana_sayfa():
    k = "./"
    SAYI = {y: sum(1 for _, _, t in FOTO if t in HIZMET[y]["turler"]) for y in SAYFALAR}
    schema = ld(isletme(), {"@type": "WebSite", "@id": URL + "#site", "url": URL, "name": "Aytaç Mobilya", "inLanguage": "tr-TR"},
                sss_ld(SSS_ANA))
    h = bas(k, "", "Aytaç Mobilya | Etimesgut Özel Ölçü Mobilya İmalatı",
            "Etimesgut'ta ölçüye göre mutfak dolabı, gardırop, banyo dolabı, vestiyer ve TV ünitesi. Ölçü, proje, imalat ve montaj. Gerçek iş fotoğrafları.", schema)
    kapaklar = "".join(f"""
      <li><a class="kapak" href="{k}{y}/">
        {img(f, k)}
        <span class="kapak__kulp" aria-hidden="true"></span>
        <span class="kapak__ad">{e(ad)}<small>{SAYI[y]} fotoğraf</small></span>
        <span class="kapak__icerik">{e(ic)}</span>
      </a></li>""" for y, ad, ic, f in KAPAKLAR)
    surec = "".join(f'<li><span class="surec__no">{i:02d}</span><h3>{e(b)}</h3><p>{e(m)}</p></li>' for i, (b, m) in enumerate(SUREC, 1))
    son_isler = ["mutfak-antrasit-alt-dolap", "yatak-odasi-makyaj-masasi", "vestiyer-citali-panel", "banyo-gri-boy-dolap",
                 "kitaplik-tavana-kadar", "gardirop-panjur-kapak", "antre-led-ayna-petek-ortusu", "magaza-raf-sistemi"]
    h += f"""
<section class="giris">
  <div class="kap giris__izgara">
    <div class="giris__metin">
      <h1>Etimesgut'ta ölçüye göre mutfak, gardırop ve banyo dolabı</h1>
      <p class="giris__alt">Ölçünüzü alıyoruz, projesini çiziyoruz, kendimiz üretip evinize kuruyoruz.</p>
      <div class="eylemler">
        <a class="dugme" href="#mesaj" data-olay="mesaja_git">Odanın fotoğrafını gönder</a>
        <a class="dugme dugme--cizgi" href="{k}isler/">Yaptığımız işler</a>
      </div>
      <dl class="antet">
        <div><dt>Hizmet</dt><dd>Ölçü · Proje · İmalat · Montaj</dd></div>
        <div><dt>Konum</dt><dd>Etimesgut / Ankara</dd></div>
        <div><dt>Google Haritalar</dt><dd><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">5,0 · 131 değerlendirme</a><small>20 Ekim 2026 · yorumları biz seçmedik</small></dd></div>
        <div><dt>Fotoğraflar</dt><dd>Kendi işlerimiz<small>stok görsel yok</small></dd></div>
      </dl>
    </div>
    <div class="giris__sag">
      <div class="olcu olcu--yatay" aria-hidden="true"><span>duvardan duvara</span></div>
      <div class="olcu olcu--dikey" aria-hidden="true"><span>tavana kadar</span></div>
      <div class="giris__kapaklar">
        {isaretli("mutfak-led-ust-dolap", k, "eager", "giris__k1")}
        {isaretli("kitaplik-led-raf", k, "eager", "giris__k2", isaret=False)}
        {isaretli("banyo-oval-led-ayna", k, "eager", "giris__k3", isaret=False)}
      </div>
      <p class="giris__not">Fotoğraflar <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">@aytac_mobilya</a> paylaşımlarından</p>
    </div>
  </div>
</section>

<section class="kap bolum" aria-labelledby="ne-baslik">
  <h2 id="ne-baslik" class="led">Odaya göre değil, ölçüye göre</h2>
  <ul class="kapaklar">{kapaklar}
  </ul>
</section>

<section class="yakin" aria-labelledby="yakin-baslik">
  <div class="kap yakin__izgara">
    {isaretli("mutfak-tavan-bandi-led", k, sinif="yakin__foto")}
    <div class="yakin__metin">
      <h2 id="yakin-baslik" class="led">Bir mutfakta nelere bakmalı</h2>
      <p>Bu mutfak Instagram'da paylaştığımız işlerden biri. Fotoğrafta görebildikleriniz:</p>
      <ol class="detay">
        <li>Tavan bandına gizlenmiş şerit ışık</li>
        <li>Üst dolapta cam kapaklı, içi ışıklı vitrin</li>
        <li>Tezgâh boyunca uzanan alt dolap, eviye ve ocak yeri</li>
        <li>Duvara kadar giden üst dolap sırası, arada boşluk yok</li>
        <li>Kulpsuz görünen kapaklar</li>
      </ol>
      <p>Kendi mutfağınızda hangilerinin olacağını ölçü günü birlikte konuşuruz.</p>
      <a class="ok-link" href="{k}mutfak-dolabi/">Mutfak işlerinin hepsi</a>
    </div>
  </div>
</section>

<section class="kap bolum" id="surec" aria-labelledby="surec-baslik">
  <h2 id="surec-baslik" class="led">Nasıl ilerliyor</h2>
  <ol class="surec">{surec}</ol>
</section>

<section class="kap bolum" aria-labelledby="son-baslik">
  <div class="bolum__bas">
    <h2 id="son-baslik" class="led">Son paylaştıklarımız</h2>
    <a class="ok-link" href="{k}isler/">{len(FOTO)} işin hepsini görün</a>
  </div>
  <ul class="izgara">{"".join(f"<li>{img(f, k)}</li>" for f in son_isler)}</ul>
</section>

<section class="kap bolum biz" aria-labelledby="biz-baslik">
  <h2 id="biz-baslik">Biz kimiz</h2>
  <p>Aytaç Mobilya, Etimesgut'ta kişiye özel mobilya üreten bir imalatçı. Ölçü, proje ve montajı kendimiz yapıyoruz; işlerimizi bitirdikçe <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">@aytac_mobilya</a> hesabında paylaşıyoruz.</p>
</section>
{sss_bolumu(SSS_ANA)}
{mesaj_bolumu(k)}
"""
    h += son(k)
    yaz("", h)


# ------------------------------------------------------------ hizmet sayfası
HIZMET = {
    "mutfak-dolabi": dict(
        tum="Tüm mutfak işleri", galeri="Kurduğumuz mutfaklar",
        title="Mutfak Dolabı Etimesgut, Ölçüye Göre | Aytaç Mobilya",
        meta="Etimesgut ve Ankara'da ölçüye göre mutfak dolabı: alt-üst dolap, boy dolap, buzdolabı nişi, kahve köşesi, gizli LED. Gerçek mutfak fotoğrafları.",
        h1="Ölçüye göre mutfak dolabı",
        giris="Duvardan duvara, tavana kadar. Buzdolabı, fırın ve bulaşık makinesinin yerini ölçüde belirliyor, dolabı ona göre çiziyoruz. Aşağıdaki mutfakların hepsi bizim kurduğumuz işler.",
        ana="mutfak-led-ust-dolap", turler=["mutfak"], secili="Mutfak dolabı",
        detay=["Alt ve üst dolap", "Buzdolabını içine alan boy dolap", "Ankastre fırın ve bulaşık makinesi yeri",
               "Cam kapaklı, içi ışıklı üst dolap", "Tavan bandında ve dolap altında şerit ışık",
               "Mat, parlak ve iki renkli (antrasit alt, beyaz üst) kapak"],
        ek=("Kahve köşesi", "Mutfağın bir köşesini ya da buzdolabının yanını kahve köşesine çeviriyoruz: üstte açık raf veya cam kapak, altta çekmece, arada makine için tezgâh. Instagram'da \"Kahve köşesi\" başlığında örnekleri var."),
        sss=[("Tezgâh da sizden mi?", "Fotoğraflardaki mutfaklarda tezgâh da var; istediğiniz tezgâh türünü mesajınızda sorun, konuşalım."),
             ("Eski mutfağı söküyor musunuz?", "Mesajınızda belirtin; ölçü günü konuşalım.")],
        kardes=[("tv-unitesi-kitaplik", "Aydınlatmalı raf ve kitaplık"), ("banyo-dolabi", "Banyo dolabı")],
    ),
    "gardirop": dict(
        tum="Tüm gardırop işleri", galeri="Gardıroplar ve yatak odaları",
        title="Gardırop ve Giyinme Dolabı, Ankara | Aytaç Mobilya",
        meta="Ölçüye göre gardırop: tavana kadar dolap, sürgülü aynalı kapak, kulpsuz ve profil kulplu modeller, yatak başlığı paneli. Etimesgut'tan Ankara'ya.",
        h1="Tavana kadar gardırop, ölçüye göre",
        giris="Hazır gardırobun tavanla arasında kalan boşluk, köşede kalan bir karış — ölçüye yapılan dolapta olmuyor. Kapak sayısını, askı ve raf düzenini odaya göre çiziyoruz.",
        ana="gardirop-tavana-kadar-gri", turler=["gardirop", "yatak"], secili="Gardırop",
        detay=["Tavana kadar boy dolap", "Sürgülü, aynalı kapak", "Kulpsuz görünüm ve ince siyah boy kulpu",
               "Yivli kapak yüzeyi", "Ahşap desenli kapak", "Yatak başlığı paneli, komodin, makyaj masası"],
        ek=("Yatak odasının geri kalanı", "Gardırobun yanına yatak başlığı paneli, komodin ve ışıklı aynalı makyaj masası da yapıyoruz; aynı kapak rengiyle oda tek parça görünür."),
        sss=[("Sürgülü mü kapaklı mı?", "Dolabın önünde ne kadar boşluk kaldığına göre değişiyor; ölçüde birlikte bakalım."),
             ("İç düzeni ben mi seçiyorum?", "Evet; askı, raf ve çekmece yerini projede birlikte belirliyoruz.")],
        kardes=[("vestiyer", "Antrede boy dolabı"), ("tv-unitesi-kitaplik", "TV ünitesi ve kitaplık")],
    ),
    "banyo-dolabi": dict(
        tum="Tüm banyo işleri", galeri="Kurduğumuz banyolar",
        title="Banyo Dolabı ve LED Ayna, Etimesgut | Aytaç Mobilya",
        meta="Ölçüye göre banyo dolabı: lavabo altı dolap, boy dolabı, çamaşır makinesi dolabı ve LED aynalar. Etimesgut ve Ankara'dan gerçek banyo fotoğrafları.",
        h1="Banyo dolabı, makine dolabı ve LED ayna",
        giris="Banyoda her santim iş görür. Lavabo altını, makinenin üstünü ve kapı arkasındaki dar boşluğu ölçüye göre dolaba çeviriyoruz.",
        ana="banyo-oval-led-ayna", turler=["banyo"], secili="Banyo dolabı",
        detay=["Lavabo altı dolap", "Tavana kadar boy dolabı", "Çamaşır makinesinin üstüne ve yanına dolap",
               "Oval, yuvarlak ve dikdörtgen LED ayna", "Yivli ve düz kapak"],
        ek=None,
        sss=[("Makine dolabı yapıyor musunuz?", "Evet; makinenin üstüne ve yanına dolap yaptığımız banyolar fotoğraflarda. Makinenin ölçüsünü mesajınıza ekleyin."),
             ("LED aynayı tek başına yaptırabilir miyim?", "Mesajınızda sorun; fotoğrafını görünce söyleyelim.")],
        kardes=[("vestiyer", "LED ayna ve petek örtüsü"), ("mutfak-dolabi", "Mutfak dolabı")],
    ),
    "vestiyer": dict(
        tum="Tüm antre işleri", galeri="Antre, ayakkabılık ve kiler",
        title="Vestiyer, Ayakkabılık ve Kiler Dolabı | Aytaç Mobilya",
        meta="Ölçüye göre vestiyer: oturma nişi, askılık, ayakkabılık, kiler rafı, petek örtüsü ve çıtalı bölme. Etimesgut ve Ankara'dan gerçek antre fotoğrafları.",
        h1="Vestiyer ve antre dolapları",
        giris="Kapıdan girince ilk görülen yer. Ayakkabı, mont ve çanta için dolap; oturup ayakkabı giyecek bir niş; kalorifer peteğini kapatan bir örtü.",
        ana="vestiyer-mese-nis-oturma", turler=["antre"], secili="Vestiyer / antre",
        detay=["Ahşap desenli oturma nişi ve askılık", "Boy dolabıyla birleşen vestiyer", "Kapaklı ayakkabılık",
               "Kiler için tavana kadar raf", "Kafesli petek örtüsü ve üstünde LED ayna", "Antreyi salondan ayıran çıtalı bölme"],
        ek=None,
        sss=[("Dar antreye olur mu?", "Antrenin fotoğrafını ve genişliğini gönderin; neyin sığacağını söyleyelim.")],
        kardes=[("banyo-dolabi", "LED ayna ve banyo dolabı"), ("gardirop", "Gardırop")],
    ),
    "tv-unitesi-kitaplik": dict(
        tum="Tüm TV ve kitaplık işleri", galeri="TV duvarları ve kitaplıklar",
        title="TV Ünitesi ve Kitaplık, Ölçüye Göre | Aytaç Mobilya",
        meta="Ölçüye göre TV ünitesi ve kitaplık: ışıklı nişler, tavana kadar raf, şömineli TV ünitesi. Etimesgut ve Ankara'dan gerçek salon fotoğrafları.",
        h1="TV ünitesi ve kitaplık",
        giris="Salonun bir duvarını tek parça düşünüyoruz: TV'nin yeri, kablo, raf ve ışık birlikte çiziliyor.",
        ana="kitaplik-led-raf", turler=["tv"], secili="TV ünitesi / kitaplık",
        detay=["İki yanı ışıklı nişli TV duvarı", "Raf altlarına gizli şerit ışık", "Tavana kadar kitaplık, altta kapaklı dolap",
               "Şömine görünümlü TV ünitesi"],
        ek=None,
        sss=[("Kablolar görünür mü?", "Kablonun nereden geçeceğini projede belirliyoruz; prizin yerini ölçüde not ediyoruz.")],
        kardes=[("mutfak-dolabi", "Kahve köşesi ve mutfak"), ("gardirop", "Gardırop")],
    ),
}


def hizmet_sayfasi(yol):
    d = HIZMET[yol]
    k = "../"
    ad = SAYFALAR[yol]
    fotolar = [f for f, _, t in FOTO if t in d["turler"] and f != d["ana"]]
    servis = {"@type": "Service", "name": d["h1"], "serviceType": ad, "description": d["meta"], "url": URL + yol + "/",
              "provider": {"@id": URL + "#isletme"},
              "areaServed": [{"@type": "AdministrativeArea", "name": "Etimesgut"}, {"@type": "City", "name": "Ankara"}],
              "image": [URL + f"img/{d['ana']}.webp"] + [URL + f"img/{f}.webp" for f in fotolar[:5]]}
    schema = ld(isletme(), servis, kirinti_ld([("", "Ana sayfa"), (yol + "/", ad)]), sss_ld(d["sss"]))
    h = bas(k, yol, d["title"], d["meta"], schema)
    ek = ""
    if d["ek"]:
        ek = f'<div class="ek"><h2 class="led">{e(d["ek"][0])}</h2><p>{e(d["ek"][1])}</p></div>'
    diger = "".join(f'<li><a href="{k}{y}/">{e(a)}</a></li>' for y, a in SAYFALAR.items() if y != yol)
    kardes = " · ".join(f'<a href="{k}{y}/">{e(a)}</a>' for y, a in d["kardes"])
    h += f"""
<nav class="kap kirinti" aria-label="Konum"><a href="{k}">Ana sayfa</a> <span aria-hidden="true">/</span> <span aria-current="page">{e(ad)}</span></nav>
<section class="kap hizmet-giris">
  <div class="hizmet-giris__metin">
    <h1>{e(d["h1"])}</h1>
    <p class="giris__alt">{e(d["giris"])}</p>
    <div class="eylemler">
      <a class="dugme" href="#mesaj" data-olay="mesaja_git">Bu iş için yaz</a>
      <a class="dugme dugme--cizgi" href="{k}isler/#{d['turler'][0]}">{e(d["tum"])}</a>
    </div>
    <dl class="antet antet--kisa">
      <div><dt>Bu sayfada</dt><dd>{len(fotolar) + 1} gerçek iş fotoğrafı<small>stok görsel yok</small></dd></div>
      <div><dt>Google Haritalar</dt><dd><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorum_tikla">5,0 · 131 değerlendirme</a><small>20 Ekim 2026</small></dd></div>
    </dl>
  </div>
  {isaretli(d["ana"], k, "eager", "hizmet-giris__foto") if d["ana"] in ISARET else '<figure class="isaretli hizmet-giris__foto">' + img(d["ana"], k, yukle="eager") + "</figure>"}
</section>

<section class="kap bolum" aria-labelledby="foto-baslik">
  <h2 id="foto-baslik" class="led">{e(d["galeri"])}</h2>
  <ul class="izgara izgara--hizmet">{"".join(f"<li><figure>{img(f, k)}<figcaption>{e(FOTO_ALT[f])}</figcaption></figure></li>" for f in fotolar)}</ul>
</section>

<section class="kap bolum ikili" aria-labelledby="detay-baslik">
  <div>
    <h2 id="detay-baslik" class="led">Bu işlerde neler var</h2>
    <ul class="detay detay--madde">{"".join(f"<li>{e(x)}</li>" for x in d["detay"])}</ul>
  </div>
  <div>
    {ek}
    <div class="ek">
      <h2 class="led">Nasıl ilerliyor</h2>
      <p>Fotoğraf, ölçü, proje, imalat, montaj. Önce odanın fotoğrafını gönderiyorsunuz; yerinde ölçüden sonra çizim, onaydan sonra imalat ve montaj. <a href="{k}#surec">Süreci adım adım okuyun</a>.</p>
      <p class="kardes">Şunlara da bakın: {kardes}</p>
    </div>
  </div>
</section>
{sss_bolumu(d["sss"])}
{mesaj_bolumu(k, d["secili"])}
<nav class="kap diger" aria-label="Diğer işler"><p>Diğer işler</p><ul>{diger}<li><a href="{k}isler/">Tüm işler</a></li></ul></nav>
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
    suzgec = '<button type="button" data-suz="hepsi" aria-pressed="true">Tümü</button>' + "".join(
        f'<button type="button" data-suz="{t}" aria-pressed="false">{e(a)}</button>' for t, a in TURLER)
    ogeler = "".join(f"""<li data-tur="{t}"><button type="button" class="galeri__oge" data-buyut="{f}" aria-label="Büyüt: {e(a)}">{img(f, k)}</button></li>""" for f, a, t in FOTO)
    h += f"""
<nav class="kap kirinti" aria-label="Konum"><a href="{k}">Ana sayfa</a> <span aria-hidden="true">/</span> <span aria-current="page">Yaptığımız işler</span></nav>
<section class="kap hizmet-giris hizmet-giris--tek">
  <div class="hizmet-giris__metin">
    <h1>Yaptığımız işler</h1>
    <p class="giris__alt">Hepsi Instagram hesabımızda paylaştığımız işler. Bazı karelerde koruma naylonu ya da matkap göreceksiniz.</p>
  </div>
</section>
<section class="kap bolum galeri" aria-label="Fotoğraflar">
  <div class="suzgec" role="group" aria-label="İş türüne göre süz">{suzgec}</div>
  <p class="galeri__sayi" data-sayi aria-live="polite">{len(FOTO)} fotoğraf</p>
  <ul class="izgara izgara--galeri">{ogeler}</ul>
  <p class="kucuk-not">Daha fazlası ve videolar: <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram_tikla">Instagram · @aytac_mobilya</a></p>
</section>
<dialog class="buyuk" data-buyuk aria-label="Fotoğraf">
  <form method="dialog"><button class="buyuk__kapat" aria-label="Kapat">Kapat</button></form>
  <img data-buyuk-img src="{k}img/{FOTO[0][0]}.webp" loading="lazy" alt="" width="{W}" height="{H}">
  <p data-buyuk-alt></p>
  <button type="button" class="dugme" data-benzeri data-olay="galeri_benzerini_iste">Bu fotoğraftaki gibi istiyorum</button>
</dialog>
{mesaj_bolumu(k)}
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
