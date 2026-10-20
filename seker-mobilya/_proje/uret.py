#!/usr/bin/env python3
"""Şeker Mobilya sitesini üretir: 8 sayfa + sitemap.xml.

Metinler ve fotoğraf envanteri icerik.py'de (tek kaynak). Ortak parçalar
(üst çubuk, mesaj hazırlayıcı, konum, alt bilgi, schema) burada.
Çalıştır:  python3 seker-mobilya/_proje/uret.py          → siteyi yazar
           python3 seker-mobilya/_proje/uret.py --metin  → modul-2'nin 12. bölümünü yeniler
"""
import json
import os
import sys
from html import escape

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icerik import (ANA, DETAY, FOTO, H, ISLER, MESAJ_TURLERI, PUAN, SAYFA, SAYFA_SIRASI,  # noqa: E402
                    TARIH, TARIH_OKUNUR, TURLER, W, YORUM)

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://selahattinpeltek46-sudo.github.io/imfa-yap-/seker-mobilya/"
FIRMA = "Şeker Mobilya"
TEL_GORUNEN = "0535 761 85 38"
TEL = "+905357618538"
WA = "905357618538"
ADRES_SATIR = "Yenibosna Merkez, Ahmet Yesevi Cd. No:120, 34192 Bahçelievler/İstanbul"
INSTAGRAM = "https://www.instagram.com/sekermobilya/"
YOUTUBE = "https://www.youtube.com/@sekermobilya"
LAT, LNG = 41.0028125, 28.8389375
HARITA = "https://www.google.com/maps/search/?api=1&query=%C5%9Eeker+mobilya+Ahmet+Yesevi+Cd.+No%3A120+Bah%C3%A7elievler"
YOL = f"https://www.google.com/maps/dir/?api=1&destination={LAT}%2C{LNG}"
HARITA_GOMME = f"https://maps.google.com/maps?q={LAT},{LNG}&z=16&output=embed"
MENU = [(s, SAYFA[s]["menu"]) for s in SAYFA_SIRASI] + [("isler", "İşler")]


def e(s):
    return escape(s, quote=True)


def wa(metin):
    from urllib.parse import quote
    return f"https://wa.me/{WA}?text={quote(metin)}"


def img(dosya, k, yukle="lazy", sinif=""):
    alt = FOTO[dosya][0]
    return (f'<img src="{k}img/{dosya}.webp" width="{W}" height="{H}" alt="{e(alt)}" loading="{yukle}" '
            f'decoding="async"' + (f' class="{sinif}"' if sinif else "") + ">")


def detayli(dosya, k, yukle="lazy"):
    """Fotoğraf + numaralı detay noktaları (görülen detay, sıfat değil). Adları detay_liste() verir."""
    noktalar = "".join(f'<span class="nokta" style="--x:{x}%;--y:{y}%">{i + 1}</span>' for i, (x, y, _) in enumerate(DETAY.get(dosya, [])))
    return (f'<figure class="detayli">{img(dosya, k, yukle)}'
            f'<div class="noktalar" aria-hidden="true">{noktalar}</div></figure>')


def detay_liste(dosya):
    return '<ol class="detay-liste">' + "".join(f"<li><span>{i + 1}</span>{e(ad)}</li>" for i, (_, _, ad) in enumerate(DETAY.get(dosya, []))) + "</ol>"


def kolaj(dosyalar, k, ilk_yukle="lazy"):
    a, b, c = dosyalar
    return (f'<div class="kolaj"><figure class="kolaj__buyuk">{img(a, k, ilk_yukle)}</figure>'
            f'<figure class="kolaj__k1">{img(b, k, ilk_yukle)}</figure>'
            f'<figure class="kolaj__k2">{img(c, k)}</figure><span class="kolaj__panel" aria-hidden="true"></span></div>')


def kare(dosya, k, etiket=True):
    alt, tur, yazili, oncesi = FOTO[dosya]
    not_ = "İşe başladığımız gün" if oncesi else ("Reels kapağı" if yazili else "")
    return (f'<figure class="kare" data-tur="{tur}">{img(dosya, k)}'
            + (f'<figcaption>{e(not_)}</figcaption>' if (not_ and etiket) else "") + "</figure>")


# ------------------------------------------------------------------- schema
def isletme():
    return {
        "@type": "HomeAndConstructionBusiness",
        "@id": URL + "#isletme",
        "name": FIRMA,
        "alternateName": "Kemal Şeker Mobilya",
        "slogan": "Evinize tat katıyoruz",
        "description": "Bahçelievler Yenibosna'da ölçüye özel mobilya ve ev dekorasyonu: TV ünitesi, giyinme odası, portmanto, banyo ve mutfak dolabı, çıtalı duvar paneli, lake petek kapama.",
        "url": URL,
        "image": URL + "img/og.jpg",
        "logo": URL + "img/logo.png",
        "telephone": TEL,
        "address": {"@type": "PostalAddress", "streetAddress": "Yenibosna Merkez Mah., Ahmet Yesevi Cd. No:120",
                    "addressLocality": "Bahçelievler", "addressRegion": "İstanbul", "postalCode": "34192", "addressCountry": "TR"},
        "geo": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
        "hasMap": HARITA,
        "areaServed": [{"@type": "AdministrativeArea", "name": "Bahçelievler"}, {"@type": "AdministrativeArea", "name": "Küçükçekmece"},
                       {"@type": "City", "name": "İstanbul"}],
        "sameAs": [INSTAGRAM, YOUTUBE],
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


def hizmet_ld(slug):
    s = SAYFA[slug]
    return {"@type": "Service", "@id": URL + slug + "/#hizmet", "name": s["ad"], "serviceType": s["ad"],
            "provider": {"@id": URL + "#isletme"}, "areaServed": {"@type": "AdministrativeArea", "name": "Bahçelievler"},
            "url": URL + slug + "/", "description": s["meta"]}


# ------------------------------------------------------------- ortak parçalar
def bas(k, yol, title, meta, schema):
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
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#f4f1eb">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="tr_TR">
  <meta property="og:site_name" content="{FIRMA}">
  <meta property="og:title" content="{e(title)}">
  <meta property="og:description" content="{e(meta)}">
  <meta property="og:url" content="{can}">
  <meta property="og:image" content="{URL}img/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="{k}img/favicon.png">
  <link rel="apple-touch-icon" href="{k}img/apple-touch-icon.png">
  <link rel="preload" href="{k}fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="{k}fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="{k}css/site.css">
  {schema}
</head>
<body>
<a class="atla" href="#icerik">İçeriğe geç</a>
<header class="ust">
  <div class="ust__ic">
    <a class="marka" href="{k}" aria-label="Şeker Mobilya ana sayfa">
      <img src="{k}img/logo.png" width="46" height="46" alt="">
      <span><b>Şeker Mobilya</b><small>Bahçelievler · Yenibosna</small></span>
    </a>
    <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu"><span></span>Menü</button>
    <nav id="menu" class="menu" aria-label="Ana menü">
      <ul>{menu}</ul>
      <a class="dugme dugme--kucuk" href="#mesaj" data-olay="mesaja_git">Fotoğraf gönder</a>
    </nav>
  </div>
</header>
<main id="icerik">
"""


def kirinti(k, adlar):
    parca = [f'<a href="{k}">Ana sayfa</a>'] + [e(a) for a in adlar]
    return f'<nav class="kirinti" aria-label="Sayfa yolu">{" <span>/</span> ".join(parca)}</nav>'


def mesaj_bolumu(k, secili):
    turler = "".join(
        f'<label class="secim"><input type="radio" name="tur" value="{e(t)}"{" checked" if t == secili else ""}><span>{e(t)}</span></label>'
        for t in MESAJ_TURLERI)
    ilk = f"Merhaba, {secili.lower()} için bilgi almak istiyorum." if secili else "Merhaba, bilgi almak istiyorum."
    return f"""
<section class="mesaj" id="mesaj" aria-labelledby="mesaj-baslik">
  <div class="kap mesaj__ic">
    <div class="mesaj__metin">
      <h2 id="mesaj-baslik">Odanın fotoğrafını gönderin</h2>
      <p>Birkaç seçimle WhatsApp mesajınızı hazırlayın; fotoğrafları WhatsApp'ta ekleyin. Bu sayfa hiçbir bilgiyi kaydetmez ya da bir yere göndermez — mesajı siz gönderirsiniz.</p>
      <p class="mesaj__tel">WhatsApp kullanmıyorsanız arayın: <a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a></p>
    </div>
    <form class="hazirla" data-hazirla novalidate>
      <fieldset>
        <legend>Ne yaptırmak istiyorsunuz?</legend>
        <div class="secimler">{turler}</div>
      </fieldset>
      <fieldset>
        <legend>İşin kapsamı</legend>
        <div class="secimler">
          <label class="secim"><input type="radio" name="kapsam" value="tek parça"><span>Tek parça</span></label>
          <label class="secim"><input type="radio" name="kapsam" value="odanın tamamı"><span>Odanın tamamı</span></label>
          <label class="secim"><input type="radio" name="kapsam" value="henüz bilmiyorum"><span>Henüz bilmiyorum</span></label>
        </div>
      </fieldset>
      <div class="alanlar">
        <label>Semt / ilçe <input type="text" name="ilce" autocomplete="address-level2" maxlength="60" placeholder="ör. Yenibosna"></label>
        <label>Kaba ölçü (isteğe bağlı) <input type="text" name="olcu" maxlength="80" placeholder="ör. duvar 3,20 m"></label>
      </div>
      <label class="onay"><input type="checkbox" name="foto" checked> Fotoğraf da göndereceğim</label>
      <p class="onizleme" aria-live="polite" data-onizleme>{e(ilk)}</p>
      <div class="hazirla__dugmeler">
        <a class="dugme" href="{e(wa(ilk))}" data-wa data-olay="whatsapp" target="_blank" rel="noopener">WhatsApp'ta gönder</a>
        <button class="dugme dugme--cizgi" type="button" data-kopyala>Mesajı kopyala</button>
      </div>
    </form>
  </div>
</section>"""


def konum(k):
    return f"""
<section class="konum" aria-labelledby="konum-baslik">
  <div class="kap konum__ic">
    <div>
      <h2 id="konum-baslik">Yenibosna'dayız</h2>
      <address>
        <b>{FIRMA}</b><br>{e(ADRES_SATIR)}<br>
        <a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a>
      </address>
      <p class="kucuk">Bugünkü açılış ve kapanış saatini <a href="{HARITA}" target="_blank" rel="noopener" data-olay="harita">Google Haritalar'da</a> görebilirsiniz. Gelmeden önce aramanızı öneririz.</p>
      <p class="ikinci-adres" data-ikinci-adres hidden></p>
      <div class="konum__dugmeler">
        <a class="dugme dugme--cizgi" href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi">Yol tarifi</a>
        <a class="dugme dugme--cizgi" href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram">Instagram</a>
      </div>
    </div>
    <div class="harita" data-harita="{e(HARITA_GOMME)}">
      <button type="button" class="harita__dugme" data-olay="harita_yukle">Haritayı göster<small>Google Haritalar yüklenir</small></button>
    </div>
  </div>
</section>"""


def son(k):
    menu = "".join(f'<li><a href="{k}{y}/">{e(a)}</a></li>' for y, a in MENU)
    return f"""
</main>
<footer class="alt">
  <div class="kap alt__ic">
    <div class="alt__marka">
      <img src="{k}img/logo.png" width="72" height="72" alt="Şeker Mobilya logosu" loading="lazy">
      <p class="slogan">Evinize tat katıyoruz.</p>
    </div>
    <div>
      <h2>İletişim</h2>
      <p>{e(ADRES_SATIR)}<br><a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a></p>
      <p><a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram">Instagram @sekermobilya</a><br>
      <a href="{YOUTUBE}" target="_blank" rel="noopener">YouTube @sekermobilya</a></p>
    </div>
    <div>
      <h2>Sayfalar</h2>
      <ul>{menu}</ul>
    </div>
  </div>
  <p class="kap alt__not">Sitedeki fotoğraflar Şeker Mobilya'nın Instagram hesabında paylaşılan işlerdir. Bu site kendi çerezini kullanmaz ve ziyaretçi verisi toplamaz; harita yalnız siz tıklayınca Google Haritalar'dan yüklenir.</p>
</footer>
<div class="alt-cubuk" aria-label="Hızlı iletişim">
  <a href="{e(wa('Merhaba, bilgi almak istiyorum.'))}" data-wa-sabit data-olay="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
  <a href="tel:{TEL}" data-olay="telefon">Ara</a>
</div>
<script src="{k}js/ayarlar.js"></script>
<script src="{k}js/site.js" defer></script>
</body>
</html>
"""


def yorum_satiri():
    metin = ANA["yorum_p"].format(puan=PUAN, yorum=YORUM, tarih=TARIH_OKUNUR)
    return f'<p class="yorum"><span class="yildiz" aria-hidden="true">★</span> <a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorumlar">{e(metin)}</a></p>'


# ------------------------------------------------------------------ sayfalar
def ana_sayfa():
    k = ""
    odalar = []
    for i, s in enumerate(SAYFA_SIRASI):
        p = SAYFA[s]
        odalar.append(
            f'<li><a class="oda" href="{s}/"><span class="oda__no">{i + 1:02d}</span>'
            f'<span class="oda__ad">{e(p["ad"])}</span><span class="oda__ozet">{e(p["ozet"])}</span>'
            f'<span class="oda__foto">{img(p["kapak"][0], k)}</span></a></li>')
    surec = "".join(f"<li><h3>{e(b)}</h3><p>{e(m)}</p></li>" for b, m in ANA["surec"])
    baslangic = "".join(kare(d, k, etiket=False) for d in ANA["baslangic"])
    govde = f"""
<section class="giris">
  <div class="kap giris__ic">
    <div class="giris__metin">
      <p class="ust-yazi">Şeker Mobilya · Bahçelievler</p>
      <h1>{e(ANA["h1"])}</h1>
      <p class="giris__p">{e(ANA["giris"])}</p>
      <div class="giris__dugmeler">
        <a class="dugme" href="#mesaj" data-olay="mesaja_git">Odanın fotoğrafını gönderin</a>
        <a class="dugme dugme--cizgi" href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a>
      </div>
      {yorum_satiri()}
    </div>
    {kolaj(ANA["kapak"], k, "eager")}
  </div>
</section>

<section class="imza" aria-labelledby="imza-baslik">
  <div class="kap imza__ic">
    {detayli(ANA["imza_foto"], k)}
    <div class="imza__metin">
      <h2 id="imza-baslik">{e(ANA["imza_h2"])}</h2>
      <p>{e(ANA["imza_p"])}</p>
      {detay_liste(ANA["imza_foto"])}
      <p><a class="ok" href="duvar-paneli-petek-kapama/">Çıtalı duvar paneli ve petek kapama</a></p>
    </div>
  </div>
</section>

<section class="odalar" aria-labelledby="odalar-baslik">
  <div class="kap">
    <h2 id="odalar-baslik">{e(ANA["odalar_h2"])}</h2>
    <ol class="oda-listesi">{"".join(odalar)}</ol>
    <p class="odalar__alt"><a class="ok" href="isler/">Bütün işler: 47 kare</a></p>
  </div>
</section>

<section class="baslangic" aria-labelledby="baslangic-baslik">
  <div class="kap baslangic__ic">
    <div>
      <h2 id="baslangic-baslik">{e(ANA["baslangic_h2"])}</h2>
      <p>{e(ANA["baslangic_p"])}</p>
      <p><a class="ok" href="{INSTAGRAM}reels/" target="_blank" rel="noopener" data-olay="instagram">Videoları Instagram'da izleyin</a></p>
    </div>
    <div class="baslangic__kareler">{baslangic}</div>
  </div>
</section>

<section class="surec" aria-labelledby="surec-baslik">
  <div class="kap">
    <h2 id="surec-baslik">{e(ANA["surec_h2"])}</h2>
    <ol class="surec__liste">{surec}</ol>
  </div>
</section>
{mesaj_bolumu(k, "")}
{konum(k)}"""
    sema = ld(isletme(), {"@type": "WebSite", "@id": URL + "#site", "url": URL, "name": FIRMA, "inLanguage": "tr-TR"})
    return bas(k, "", ANA["title"], ANA["meta"], sema) + govde + son(k)


def hizmet_sayfasi(slug):
    k = "../"
    p = SAYFA[slug]
    bolumler = []
    for i, (h2, metin, fotolar) in enumerate(p["bolumler"]):
        kareler = "".join(kare(f, k) for f in fotolar)
        bolumler.append(f'<section class="bolum{" bolum--fotolu" if fotolar else ""}"><div class="bolum__metin"><h2>{e(h2)}</h2><p>{e(metin)}</p></div>'
                        + (f'<div class="bolum__kareler">{kareler}</div>' if kareler else "") + "</section>")
    kullanilan = set(p["kapak"]) | {p["detay_foto"]} | {f for _, _, fs in p["bolumler"] for f in fs}
    turler = {p["tur"]} | ({"genc"} if slug == "giyinme-odasi-gardirop" else set())
    galeri = [f for f, v in FOTO.items() if v[1] in turler and f not in kullanilan]
    sss = "".join(f"<details><summary>{e(s)}</summary><p>{e(c)}</p></details>" for s, c in p["sss"])
    ilgili = "".join(f'<li><a class="ok" href="{k}{s}/">{e(SAYFA[s]["ad"])}</a></li>' for s in p["ilgili"])
    govde = f"""
<section class="giris giris--alt">
  <div class="kap">{kirinti(k, [p["ad"]])}</div>
  <div class="kap giris__ic">
    <div class="giris__metin">
      <h1>{e(p["h1"])}</h1>
      <p class="giris__p">{e(p["giris"])}</p>
      <div class="giris__dugmeler">
        <a class="dugme" href="#mesaj" data-olay="mesaja_git">Fotoğraf gönderin</a>
        <a class="dugme dugme--cizgi" href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a>
      </div>
      {yorum_satiri()}
    </div>
    {kolaj(p["kapak"], k, "eager")}
  </div>
</section>

<section class="imza imza--sayfa" aria-labelledby="detay-baslik">
  <div class="kap imza__ic">
    {detayli(p["detay_foto"], k)}
    <div class="imza__metin">
      <h2 id="detay-baslik">Bu işte görülenler</h2>
      <p>Fotoğraftaki numaralar, bu işte birlikte yaptığımız parçaları gösteriyor.</p>
      {detay_liste(p["detay_foto"])}
    </div>
  </div>
</section>

<div class="kap bolumler">{"".join(bolumler)}</div>
""" + (f"""
<section class="galeri-bolum" aria-labelledby="galeri-baslik">
  <div class="kap">
    <h2 id="galeri-baslik">Instagram'dan diğer kareler</h2>
    <div class="galeri">{"".join(kare(f, k) for f in galeri)}</div>
    <p><a class="ok" href="{k}isler/#{p['tur']}">Bütün işler</a></p>
  </div>
</section>""" if galeri else "") + f"""

<section class="sss" aria-labelledby="sss-baslik">
  <div class="kap sss__ic">
    <h2 id="sss-baslik">Sık sorulanlar</h2>
    <div>{sss}</div>
  </div>
</section>
{mesaj_bolumu(k, p["mesaj"])}
<nav class="kap ilgili" aria-label="İlgili sayfalar"><h2>Bunlara da bakın</h2><ul>{ilgili}</ul></nav>
{konum(k)}"""
    sema = ld(isletme(), hizmet_ld(slug), sss_ld(p["sss"]), kirinti_ld([("", "Ana sayfa"), (slug + "/", p["ad"])]))
    return bas(k, slug, p["title"], p["meta"], sema) + govde + son(k)


def isler_sayfasi():
    k = "../"
    filtre = '<button type="button" data-filtre="hepsi" aria-pressed="true">Hepsi</button>' + "".join(
        f'<button type="button" data-filtre="{t}" aria-pressed="false">{e(a)}</button>' for t, a in TURLER)
    sira = [t for t, _ in TURLER]
    kareler = sorted(FOTO, key=lambda f: (sira.index(FOTO[f][1]), FOTO[f][2], FOTO[f][3]))
    govde = f"""
<section class="giris giris--alt giris--isler">
  <div class="kap">{kirinti(k, ["İşler"])}
    <h1>{e(ISLER["h1"])}</h1>
    <p class="giris__p">{e(ISLER["giris"])}</p>
  </div>
</section>
<section class="kap galeri-bolum" aria-label="Fotoğraflar">
  <div class="filtre" role="group" aria-label="Oda türüne göre süz">{filtre}</div>
  <div class="galeri galeri--tum" data-galeri>{"".join(kare(f, k) for f in kareler)}</div>
  <p class="sayac" data-sayac aria-live="polite"></p>
</section>
{mesaj_bolumu(k, "")}
{konum(k)}"""
    sema = ld(isletme(), kirinti_ld([("", "Ana sayfa"), ("isler/", "İşler")]))
    return bas(k, "isler", ISLER["title"], ISLER["meta"], sema) + govde + son(k)


def yaz(yol, icerik):
    tam = os.path.join(KOK, yol)
    os.makedirs(os.path.dirname(tam), exist_ok=True)
    with open(tam, "w", encoding="utf-8") as f:
        f.write(icerik)


def site():
    yaz("index.html", ana_sayfa())
    for s in SAYFA_SIRASI:
        yaz(f"{s}/index.html", hizmet_sayfasi(s))
    yaz("isler/index.html", isler_sayfasi())
    yollar = [""] + [s + "/" for s in SAYFA_SIRASI] + ["isler/"]
    yaz("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "".join(f"  <url><loc>{URL}{y}</loc><lastmod>{TARIH}</lastmod></url>\n" for y in yollar) + "</urlset>\n")
    print("yazıldı:", len(yollar), "sayfa")


def metin():
    """modul-2-icerik-seo.md içindeki 12. bölümü icerik.py'den yeniler."""
    s = ["<!-- METIN:BAS (uret.py --metin ile üretilir; elle düzenleme icerik.py'de) -->"]
    s.append(f"### Ana sayfa `/`\n- **Title:** {ANA['title']}\n- **Meta:** {ANA['meta']}\n- **H1:** {ANA['h1']}\n- **Giriş:** {ANA['giris']}")
    s.append(f"- **H2 {ANA['imza_h2']}:** {ANA['imza_p']} (detaylar: " + "; ".join(d for _, _, d in DETAY[ANA['imza_foto']]) + ")")
    s.append(f"- **H2 {ANA['odalar_h2']}:** 6 oda satırı (sayfa adı + giriş cümlesi + kapak karesi)")
    s.append(f"- **H2 {ANA['baslangic_h2']}:** {ANA['baslangic_p']}")
    s.append(f"- **H2 {ANA['surec_h2']}:** " + " → ".join(f"**{b}:** {m}" for b, m in ANA["surec"]))
    s.append("- **Yorum satırı:** " + ANA["yorum_p"].format(puan=PUAN, yorum=YORUM, tarih=TARIH_OKUNUR))
    s.append("- **H2 Odanın fotoğrafını gönderin:** Birkaç seçimle WhatsApp mesajınızı hazırlayın; fotoğrafları WhatsApp'ta ekleyin. Bu sayfa hiçbir bilgiyi kaydetmez ya da bir yere göndermez — mesajı siz gönderirsiniz. · CTA: WhatsApp'ta gönder / Mesajı kopyala")
    s.append("- **H2 Yenibosna'dayız:** adres + telefon · \"Bugünkü açılış ve kapanış saatini Google Haritalar'da görebilirsiniz. Gelmeden önce aramanızı öneririz.\" · Yol tarifi · Instagram")
    for slug in SAYFA_SIRASI:
        p = SAYFA[slug]
        s.append(f"\n### {p['ad']} `/{slug}/`\n- **Title:** {p['title']}\n- **Meta:** {p['meta']}\n- **H1:** {p['h1']}\n- **Giriş:** {p['giris']}")
        if p["detay_foto"] in DETAY:
            s.append("- **H2 Bu işte görülenler:** " + "; ".join(d for _, _, d in DETAY[p["detay_foto"]]))
        for h2, m, _ in p["bolumler"]:
            s.append(f"- **H2 {h2}:** {m}")
        s.append("- **SSS:**\n" + "\n".join(f"  - *{q}* — {a}" for q, a in p["sss"]))
    s.append(f"\n### İşler `/isler/`\n- **Title:** {ISLER['title']}\n- **Meta:** {ISLER['meta']}\n- **H1:** {ISLER['h1']}\n- **Giriş:** {ISLER['giris']}")
    s.append("\n### Ortak\n- Alt bilgi notu: \"Sitedeki fotoğraflar Şeker Mobilya'nın Instagram hesabında paylaşılan işlerdir. Bu site kendi çerezini kullanmaz ve ziyaretçi verisi toplamaz; harita yalnız siz tıklayınca Google Haritalar'dan yüklenir.\"\n- Slogan (firmanın): \"Evinize tat katıyoruz.\"")
    s.append("<!-- METIN:SON -->")
    yeni = "\n".join(s)
    yol = os.path.join(KOK, "_proje", "modul-2-icerik-seo.md")
    md = open(yol, encoding="utf-8").read()
    a, b = md.index("<!-- METIN:BAS"), md.index("<!-- METIN:SON -->") + len("<!-- METIN:SON -->")
    open(yol, "w", encoding="utf-8").write(md[:a] + yeni + md[b:])
    print("modul-2 metin bölümü yenilendi")


if __name__ == "__main__":
    metin() if "--metin" in sys.argv else site()
