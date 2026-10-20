#!/usr/bin/env python3
"""Osmanoğlu Mobilya sitesini üretir: 4 sayfa + sitemap.xml.

Metinler ve fotoğraf envanteri icerik.py'de (tek kaynak). Ortak parçalar
(üst çubuk, hero sahnesi, mesaj hazırlayıcı, konum, alt bilgi, schema) burada.
Çalıştır:  python3 osmanoglu-mobilya/_proje/uret.py          → siteyi yazar
           python3 osmanoglu-mobilya/_proje/uret.py --metin  → modul-2'nin 12. bölümünü yeniler
"""
import json
import os
import re
import sys
from html import escape
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icerik import (ADIMLAR, DETAY, DETAY_BASLIK, DETAY_GIRIS, FOTO, HERO, ISLER, KARAVAN,  # noqa: E402
                    MESAJ_TURLERI, MUTFAK, PUAN, SAYFA, SAYFA_SIRASI, SSS, TARIH, TARIH_OKUNUR,
                    VESTIYER, YORUM_SAYISI, YORUMLAR)

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = "https://selahattinpeltek46-sudo.github.io/imfa-yap-/osmanoglu-mobilya/"
FIRMA = "Osmanoğlu Mobilya"
TEL_GORUNEN = "0532 177 06 19"
TEL = "+905321770619"
WA = "905321770619"
ADRES = ("Ahi Evran Mahallesi, Sincan Sanayi Sitesi", "06000 Sincan / Ankara")
LAT, LNG = 39.9649375, 32.5679375
HARITA = "https://www.google.com/maps/search/?api=1&query=" + quote("OSMANOĞLU MOBİLYA Mutfak Dekorasyon Sincan")
YOL = f"https://www.google.com/maps/dir/?api=1&destination={LAT}%2C{LNG}"
HARITA_GOMME = f"https://maps.google.com/maps?q={LAT},{LNG}&z=16&output=embed"


def e(s):
    return escape(s, quote=True)


def wa(metin):
    return f"https://wa.me/{WA}?text={quote(metin)}"


def img(dosya, k, yukle="lazy", sinif="", boyut="(min-width: 900px) 50vw, 100vw", oncelik=False):
    alt, w, h, buyuk = FOTO[dosya]
    src = f"{k}img/{dosya}.webp"
    srcset = f' srcset="{src} {w}w, {k}img/{dosya}-buyuk.webp {round(w * 1.6)}w" sizes="{boyut}"' if buyuk else ""
    return (f'<img src="{src}"{srcset} width="{w}" height="{h}" alt="{e(alt)}" loading="{yukle}" decoding="async"'
            + (' fetchpriority="high"' if oncelik else "") + (f' class="{sinif}"' if sinif else "") + ">")


def kanal(sinif=""):
    """İmza öğe: mutfaktaki yatay tutamak kanalı."""
    return f'<span class="kanal{(" " + sinif) if sinif else ""}" aria-hidden="true"></span>'


# ------------------------------------------------------------------- schema
def isletme():
    return {
        "@type": "HomeAndConstructionBusiness",
        "@id": URL + "#isletme",
        "name": FIRMA,
        "description": "Sincan Sanayi Sitesi'nde özel ölçü mutfak dolabı, vestiyer, gardırop, gömme dolap ve karavan mobilyası.",
        "url": URL,
        "telephone": TEL,
        "image": URL + "img/mutfak-pencere-l-tezgah.webp",
        "address": {"@type": "PostalAddress", "streetAddress": ADRES[0], "addressLocality": "Sincan",
                    "addressRegion": "Ankara", "postalCode": "06000", "addressCountry": "TR"},
        "geo": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
        "hasMap": HARITA,
        "areaServed": {"@type": "City", "name": "Ankara"},
    }


def schema(yol, s):
    graf = [isletme()]
    if yol:
        graf.append({"@type": "Service", "name": s["menu"], "serviceType": s["menu"], "provider": {"@id": URL + "#isletme"},
                     "areaServed": {"@type": "City", "name": "Ankara"}, "url": URL + yol})
        graf.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": FIRMA, "item": URL},
            {"@type": "ListItem", "position": 2, "name": s["menu"], "item": URL + yol}]})
    graf.append({"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in SSS[yol]]})
    return json.dumps({"@context": "https://schema.org", "@graph": graf}, ensure_ascii=False)


# ------------------------------------------------------------------- parçalar
def ust(yol, k):
    linkler = "".join(
        f'<a href="{k}{y}"{" aria-current=page" if y == yol else ""}>{e(SAYFA[y]["menu"])}</a>'
        for y in SAYFA_SIRASI if y)
    return f"""<a class="atla" href="#icerik">İçeriğe geç</a>
<header class="ust">
  <a class="logo" href="{k}" aria-label="{FIRMA}, ana sayfa"><span class="logo__ad">Osmanoğlu</span><span class="logo__alt">Mobilya · Sincan</span></a>
  <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="gizli">Menü</span></button>
  <nav id="menu" class="menu" aria-label="Ana menü">{linkler}<a href="{k}#iletisim">İletişim</a>
    <a class="menu__tel" href="tel:{TEL}" data-olay="telefon_tikla">{TEL_GORUNEN}</a></nav>
  <a class="dugme dugme--wa ust__wa" href="{wa(SAYFA[yol]['wa'])}" data-olay="whatsapp_tikla">WhatsApp</a>
</header>"""


def h1(s):
    return f'<h1><span class="h1-ust">{e(s["h1_ust"])}</span><span class="h1-ana">{e(s["h1"])}</span></h1>'


def cta_ikili(s, ikincil=True):
    return (f'<div class="cta"><a class="dugme dugme--wa" href="{wa(s["wa"])}" data-olay="whatsapp_tikla">WhatsApp\'tan yazın</a>'
            + (f'<a class="dugme dugme--cizgi" href="tel:{TEL}" data-olay="telefon_tikla">Arayın · {TEL_GORUNEN}</a>' if ikincil else "")
            + "</div>")


def puan_satiri():
    return (f'<p class="puan"><a href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">'
            f'Google Haritalar: <strong>{PUAN}</strong> · {YORUM_SAYISI} yorum</a> <span>({TARIH_OKUNUR} itibarıyla)</span></p>')


def etiketler(liste):
    return "".join(
        f'<span class="etiket etiket--{yon}" data-x="{x}" data-y="{y}" style="--x:{x}%;--y:{y}%;--s:{i}"><i></i><b>{e(ad)}</b></span>'
        for i, (x, y, yon, ad) in enumerate(liste))


def sahne(slaytlar, k, oto=True):
    """Hero sahnesi: tam boy gerçek fotoğraflar; karartma / bulanıklık yok. Geçiş: çekmece gibi soldan sağa açılır."""
    kareler = "".join(
        f'<figure class="slayt{" aktif" if i == 0 else ""}" data-slayt="{i}" data-baslik="{e(bas)}"{"" if i == 0 else " aria-hidden=true"}>'
        f'<div class="kare">{img(d, k, "eager" if i == 0 else "lazy", boyut="(min-width: 900px) 60vw, 100vw", oncelik=i == 0)}'
        f'<div class="etiketler" aria-hidden="true">{etiketler(et)}</div></div>'
        f'<figcaption class="gizli">{e(bas)}: ' + ", ".join(e(t[3]) for t in et) + "</figcaption></figure>"
        for i, (d, bas, et) in enumerate(slaytlar))
    if len(slaytlar) == 1:
        return f'<div class="sahne sahne--tek">{kareler}</div>'
    nokta = "".join(
        f'<button type="button" class="kanal-dugme{" aktif" if i == 0 else ""}" data-git="{i}" aria-label="{i + 1}. fotoğraf: {e(bas)}"><span></span></button>'
        for i, (_, bas, _e) in enumerate(slaytlar))
    return (f'<div class="sahne" data-sahne{" data-oto" if oto else ""} aria-roledescription="slayt gösterisi" aria-label="Yaptığımız işlerden kareler">{kareler}'
            f'<div class="sahne__alt"><div class="kanallar">{nokta}</div>'
            f'<button type="button" class="sahne__dur" data-dur aria-pressed="false">Durdur</button>'
            f'<span class="sahne__ad" data-ad aria-live="polite">{e(slaytlar[0][1])}</span></div></div>')


def hero(yol, s, k, slaytlar):
    return f"""<section class="hero{" hero--alt" if yol else ""}">
  <div class="hero__panel">
    {h1(s)}
    {kanal("kanal--ciz")}
    <p class="hero__giris">{e(s["giris"])}</p>
    {cta_ikili(s)}
    {puan_satiri()}
  </div>
  {sahne(slaytlar, k)}
</section>"""


def yorumlar(secim=None):
    liste = [y for y in YORUMLAR if secim is None or y["kisi"] in secim]
    kartlar = "".join(
        f'<blockquote class="yorum"><p>{e(y["metin"])}</p><footer><strong>{e(y["kisi"])}</strong> · {e(y["konu"])} · <span>{e(y["zaman"])}, Google</span></footer></blockquote>'
        for y in liste)
    return f"""<section class="bolum yorumlar" aria-labelledby="yorum-bas">
  <div class="bolum__bas"><h2 id="yorum-bas">Müşterilerimiz ne yazdı?</h2>
  <p>Google Haritalar'daki yorumlardan, {TARIH_OKUNUR} tarihinde okunduğu gibi. Yorumların tamamı ve müşterilerin paylaştığı fotoğraflar Haritalar'da.</p></div>
  <div class="yorum-liste">{kartlar}</div>
  <p class="yorumlar__alt"><a class="bag" href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">{YORUM_SAYISI} yorumun hepsini Google Haritalar'da okuyun</a></p>
</section>"""


def adimlar():
    li = "".join(f'<li><h3>{e(b)}</h3><p>{e(m)}</p></li>' for b, m in ADIMLAR)
    return f"""<section class="bolum adimlar" aria-labelledby="adim-bas">
  <div class="bolum__bas"><h2 id="adim-bas">Nasıl başlarız?</h2></div>
  <ol class="adim-liste">{li}</ol>
</section>"""


def hazirlayici(on_tur=""):
    turler = "".join(
        f'<label class="secim"><input type="radio" name="tur" value="{e(t)}"{" checked" if t == on_tur else ""}><span>{e(t)}</span></label>'
        for t in MESAJ_TURLERI)
    return f"""<section class="bolum mesaj" id="mesaj" aria-labelledby="mesaj-bas">
  <div class="bolum__bas"><h2 id="mesaj-bas">Mesajınızı birlikte hazırlayalım</h2>
  <p>Bu form hiçbir yere kayıt göndermez. Seçtikleriniz aşağıdaki mesaja dönüşür; "WhatsApp'ta aç" deyince mesaj sizin WhatsApp'ınızda, gönderilmeye hazır açılır.</p></div>
  <form class="hazirla" data-hazirla>
    <fieldset><legend>Ne yaptırmak istiyorsunuz?</legend><div class="secimler">{turler}</div></fieldset>
    <div class="alanlar">
      <label>Semt / ilçe <input name="ilce" autocomplete="address-level2" placeholder="ör. Eryaman"></label>
      <label>Kaba ölçü (biliyorsanız) <input name="olcu" placeholder="ör. 320 × 260 cm, L"></label>
    </div>
    <label class="kutu"><input type="checkbox" name="foto" checked> Alanın fotoğraflarını mesajın ardından göndereceğim</label>
    <div class="onizleme"><span>Gidecek mesaj</span><pre data-onizleme></pre></div>
    <div class="cta"><a class="dugme dugme--wa" data-wa href="{wa('Merhaba, bilgi almak istiyorum.')}" data-olay="whatsapp_form" rel="noopener" target="_blank">WhatsApp'ta aç</a>
    <button class="dugme dugme--cizgi" type="button" data-kopyala>Mesajı kopyala</button></div>
  </form>
</section>"""


def sss(yol):
    li = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in SSS[yol])
    return f"""<section class="bolum sss" aria-labelledby="sss-bas">
  <div class="bolum__bas"><h2 id="sss-bas">Sık sorulanlar</h2></div>
  <div class="sss-liste">{li}</div>
</section>"""


def konum():
    return f"""<section class="bolum konum" id="iletisim" aria-labelledby="konum-bas">
  <div class="konum__metin">
    <h2 id="konum-bas">Atölyemiz Sincan Sanayi Sitesi'nde</h2>
    <address><strong>{FIRMA}</strong><br>{ADRES[0]}<br>{ADRES[1]}</address>
    <p class="konum__tel"><a href="tel:{TEL}" data-olay="telefon_tikla">{TEL_GORUNEN}</a></p>
    <p class="not">Çalışma saatlerimizi henüz burada yayınlamadık ({TARIH_OKUNUR} Salı günü Haritalar'da kapanış 18:30 görünüyordu). Gelmeden önce arayın; usta montajda olabilir.</p>
    <div class="cta"><a class="dugme dugme--wa" href="{wa('Merhaba, atölyenize gelmek istiyorum. Ne zaman uygunsunuz?')}" data-olay="whatsapp_tikla">WhatsApp'tan yazın</a>
    <a class="dugme dugme--cizgi" href="{YOL}" rel="noopener" target="_blank" data-olay="yol_tarifi">Yol tarifi</a></div>
  </div>
  <div class="harita" data-harita="{HARITA_GOMME}">
    <button type="button">Haritayı göster</button>
    <p>Harita Google'dan yüklenir; siz tıklayana kadar Google'a istek gönderilmez.</p>
  </div>
</section>"""


def alt(k):
    linkler = "".join(f'<li><a href="{k}{y}">{e(SAYFA[y]["menu"])}</a></li>' for y in SAYFA_SIRASI if y)
    return f"""<footer class="alt">
  <div class="alt__ic">
    <div><p class="logo logo--alt"><span class="logo__ad">Osmanoğlu</span><span class="logo__alt">Mobilya · Sincan</span></p>
    <p>{ADRES[0]}, {ADRES[1]}<br><a href="tel:{TEL}" data-olay="telefon_tikla">{TEL_GORUNEN}</a></p></div>
    <ul>{linkler}</ul>
    <p class="alt__not">Bu site kendi çerezini kullanmaz ve ziyaretçi verisi toplamaz; harita yalnız siz tıklayınca yüklenir. Sitedeki fotoğraflar kendi işlerimizdir; karavan çizimi temsilidir.</p>
  </div>
  {kanal()}
</footer>
"""


def sayfa(yol, govde):
    s = SAYFA[yol]
    k = "../" * yol.count("/")
    return f"""<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(s["title"])}</title>
<meta name="description" content="{e(s["meta"])}">
<link rel="canonical" href="{URL}{yol}">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:title" content="{e(s["title"])}">
<meta property="og:description" content="{e(s["meta"])}">
<meta property="og:url" content="{URL}{yol}">
<meta property="og:image" content="{URL}img/og.jpg">
<meta name="theme-color" content="#dde1d4">
<link rel="icon" href="{k}img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{k}img/apple-touch-icon.png">
<link rel="preload" href="{k}fonts/bricolage-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{k}css/site.css">
<script type="application/ld+json">{schema(yol, s)}</script>
</head>
<body>
{ust(yol, k)}
<main id="icerik">
{govde}
</main>
{alt(k)}
<script src="{k}js/ayarlar.js"></script>
<script src="{k}js/site.js"></script>
</body>
</html>
"""


# ------------------------------------------------------------------- sayfa gövdeleri
def ana():
    k = ""
    s = SAYFA[""]
    isler = ""
    for i, x in enumerate(ISLER):
        gorsel = (f'<figure class="is__foto">{img(x["foto"], k)}</figure>' if x["foto"]
                  else f'<figure class="is__foto is__foto--cizim">{karavan_svg()}<figcaption>Temsili çizim</figcaption></figure>')
        isler += (f'<article class="is{" is--ters" if i % 2 else ""}">{gorsel}<div class="is__metin">{kanal()}'
                  f'<h3>{e(x["baslik"])}</h3><p>{e(x["metin"])}</p><a class="bag" href="{x["sayfa"]}">{e(x["baglanti"])}</a></div></article>')
    detay = "".join(f'<li><h3>{e(b)}</h3><p>{e(m)}</p></li>' for b, m in DETAY)
    govde = f"""{hero("", s, k, HERO)}
<section class="bolum isler" aria-labelledby="is-bas">
  <div class="bolum__bas"><h2 id="is-bas">Ne yapıyoruz?</h2><p>Hepsi ölçüyle, hepsi Sincan'daki atölyemizden.</p></div>
  {isler}
</section>
<section class="bolum detay" aria-labelledby="detay-bas">
  <figure class="detay__foto">{img("mutfak-tezgah-kose", k)}</figure>
  <div class="detay__metin"><h2 id="detay-bas">{e(DETAY_BASLIK)}</h2><p>{e(DETAY_GIRIS)}</p><ol class="detay-liste">{detay}</ol>
  <a class="bag" href="mutfak-dolabi/">Mutfak dolabında birlikte seçtiklerimiz</a></div>
</section>
{yorumlar()}
{adimlar()}
{hazirlayici()}
{sss("")}
{konum()}"""
    return sayfa("", govde)


def mutfak():
    yol, k = "mutfak-dolabi/", "../"
    s = SAYFA[yol]
    m = MUTFAK
    galeri = "".join(f'<figure>{img(d, k)}</figure>' for d in ("mutfak-pencere-l-tezgah", "mutfak-eviye-cekmeceler", "mutfak-tezgah-kose"))
    secim = "".join(f'<li><h3>{e(b)}</h3><p>{e(t)}</p></li>' for b, t in m["secimler"])
    govde = f"""{hero(yol, s, k, [HERO[0], HERO[1]])}
<section class="bolum galeri" aria-labelledby="gal-bas">
  <div class="bolum__bas"><h2 id="gal-bas">{e(m["galeri_baslik"])}</h2><p>{e(m["galeri_giris"])}</p></div>
  <div class="galeri__kareler">{galeri}</div>
</section>
<section class="bolum secimler-bolum" aria-labelledby="sec-bas">
  <div class="bolum__bas"><h2 id="sec-bas">{e(m["secim_baslik"])}</h2></div>
  <ol class="detay-liste detay-liste--genis">{secim}</ol>
</section>
{yorumlar(["Murat T.", "Emre K."])}
{adimlar()}
<section class="bolum ilce" aria-labelledby="ilce-bas"><div class="bolum__bas"><h2 id="ilce-bas">{e(m["ilceler_baslik"])}</h2><p>{e(m["ilceler"])}</p></div>
  <p><a class="bag" href="../vestiyer-gomme-dolap/">Antre, gardırop ve gömme dolap işlerimiz</a></p></section>
{hazirlayici(s["tur"])}
{sss(yol)}
{konum()}"""
    return sayfa(yol, govde)


def vestiyer():
    yol, k = "vestiyer-gomme-dolap/", "../"
    s = SAYFA[yol]
    v = VESTIYER
    detay = "".join(f'<li><h3>{e(b)}</h3><p>{e(t)}</p></li>' for b, t in v["detay"])
    diger = "".join(f"<li>{e(x)}</li>" for x in v["diger"])
    govde = f"""{hero(yol, s, k, [HERO[2]])}
<section class="bolum detay" aria-labelledby="detay-bas">
  <figure class="detay__foto">{img("antre-aynali-citali-vestiyer", k)}</figure>
  <div class="detay__metin"><h2 id="detay-bas">{e(v["detay_baslik"])}</h2><ol class="detay-liste">{detay}</ol></div>
</section>
<section class="bolum diger" aria-labelledby="diger-bas">
  <div class="bolum__bas"><h2 id="diger-bas">{e(v["diger_baslik"])}</h2><p>{e(v["diger_giris"])}</p></div>
  <ul class="cizgili">{diger}</ul>
  <p><a class="bag" href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">Fotoğrafları Google Haritalar'da görün</a></p>
</section>
{yorumlar(["Emre K.", "Murat T."])}
{adimlar()}
<section class="bolum ilce"><p><a class="bag" href="../mutfak-dolabi/">Mutfak dolabı işlerimize bakın</a></p></section>
{hazirlayici(s["tur"])}
{sss(yol)}
{konum()}"""
    return sayfa(yol, govde)


def karavan_svg():
    """Temsili çizim: çıtalı ahşap karavan. Çizgiler ekrana girince çizilir."""
    citalar = "".join(f'<line pathLength="1" x1="{x}" y1="64" x2="{x}" y2="196"/>' for x in range(64, 352, 16))
    return f"""<svg class="karavan" viewBox="0 0 420 260" role="img" aria-label="Temsili çizim: çıtalı ahşap kaplamalı küçük karavan">
  <defs><clipPath id="govde"><path d="M40 196 V96 Q40 56 92 56 H330 Q372 56 380 110 V196 Z"/></clipPath></defs>
  <path class="karavan__dolgu" d="M40 196 V96 Q40 56 92 56 H330 Q372 56 380 110 V196 Z"/>
  <g class="karavan__cita" clip-path="url(#govde)">{citalar}</g>
  <path class="karavan__hat" pathLength="1" d="M40 196 V96 Q40 56 92 56 H330 Q372 56 380 110 V196 Z"/>
  <rect class="karavan__hat" pathLength="1" x="96" y="96" width="78" height="46" rx="6"/>
  <rect class="karavan__hat" pathLength="1" x="226" y="96" width="44" height="88" rx="4"/>
  <rect class="karavan__hat" pathLength="1" x="296" y="100" width="52" height="34" rx="6"/>
  <path class="karavan__hat" pathLength="1" d="M20 206 H400 M380 196 L404 206"/>
  <circle class="karavan__hat" pathLength="1" cx="150" cy="212" r="24"/><circle class="karavan__hat" pathLength="1" cx="150" cy="212" r="8"/>
</svg>"""


def karavan():
    yol, k = "karavan-mobilyasi/", "../"
    s = SAYFA[yol]
    kv = KARAVAN
    kamil = next(y for y in YORUMLAR if y["kisi"] == "Kamil C.")
    bilinen = "".join(f'<li><h3>{e(b)}</h3><p>{e(t)}</p></li>' for b, t in kv["bilinen"])
    getir = "".join(f"<li>{e(x)}</li>" for x in kv["getir"])
    govde = f"""<section class="hero hero--alt hero--cizim">
  <div class="hero__panel">
    {h1(s)}
    {kanal("kanal--ciz")}
    <p class="hero__giris">{e(s["giris"])}</p>
    {cta_ikili(s)}
    {puan_satiri()}
  </div>
  <div class="sahne sahne--cizim"><figure>{karavan_svg()}<figcaption>{e(kv["cizim_notu"])}</figcaption></figure></div>
</section>
<section class="bolum alinti" aria-labelledby="alinti-bas">
  <div class="bolum__bas"><h2 id="alinti-bas">{e(kv["yorum_giris"])}</h2></div>
  <blockquote class="yorum yorum--buyuk"><p>{e(kamil["metin"])}</p><footer><strong>{e(kamil["kisi"])}</strong> · {e(kamil["konu"])} · <span>{e(kamil["zaman"])}, Google</span></footer></blockquote>
  <p><a class="bag" href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">Karavanın fotoğrafları Google Haritalar yorumunda</a></p>
</section>
<section class="bolum detay detay--metin" aria-labelledby="bil-bas">
  <div class="detay__metin"><h2 id="bil-bas">{e(kv["bilinen_baslik"])}</h2><ol class="detay-liste">{bilinen}</ol></div>
  <div class="detay__metin"><h2>{e(kv["getir_baslik"])}</h2><ul class="cizgili">{getir}</ul></div>
</section>
{hazirlayici(s["tur"])}
{sss(yol)}
<section class="bolum ilce"><p><a class="bag" href="../mutfak-dolabi/">Asıl işimiz: mutfak dolabı</a> · <a class="bag" href="../vestiyer-gomme-dolap/">Vestiyer ve gömme dolap</a></p></section>
{konum()}"""
    return sayfa(yol, govde)


# ------------------------------------------------------------------- yazım
def yaz(yol, html):
    hedef = os.path.join(KOK, yol, "index.html")
    os.makedirs(os.path.dirname(hedef), exist_ok=True)
    with open(hedef, "w", encoding="utf-8") as f:
        f.write(html)


def metin_raporu():
    """Modül 2 / 12: nihai metinler, sitedekiyle aynı kaynaktan."""
    out = []
    for y in SAYFA_SIRASI:
        s = SAYFA[y]
        out.append(f"### /{y}\n- **title** ({len(s['title'])}): {s['title']}\n- **meta** ({len(s['meta'])}): {s['meta']}\n"
                   f"- **H1**: {s['h1_ust']} / {s['h1']}\n- **Giriş**: {s['giris']}\n- **WhatsApp hazır mesaj**: {s['wa']}\n"
                   + "".join(f"- **SSS** — {q} → {a}\n" for q, a in SSS[y]))
    out.append("### Ana sayfa bölümleri\n" + "".join(f"- **{x['baslik']}**: {x['metin']}\n" for x in ISLER)
               + f"- **{DETAY_BASLIK}**: {DETAY_GIRIS}\n" + "".join(f"  - {b}: {m}\n" for b, m in DETAY)
               + "- **Nasıl başlarız?**\n" + "".join(f"  - {b}: {m}\n" for b, m in ADIMLAR))
    out.append("### Mutfak dolabı gövdesi\n" + f"- {MUTFAK['galeri_giris']}\n" + "".join(f"- {b}: {t}\n" for b, t in MUTFAK["secimler"]) + f"- {MUTFAK['ilceler']}\n")
    out.append("### Vestiyer gövdesi\n" + "".join(f"- {b}: {t}\n" for b, t in VESTIYER["detay"]) + f"- {VESTIYER['diger_giris']}\n" + "".join(f"  - {x}\n" for x in VESTIYER["diger"]))
    out.append("### Karavan gövdesi\n" + "".join(f"- {b}: {t}\n" for b, t in KARAVAN["bilinen"]) + "".join(f"- Getirin: {x}\n" for x in KARAVAN["getir"]))
    out.append("### Yorum alıntıları\n" + "".join(f"- {y['kisi']} ({y['zaman']}): {y['metin']}\n" for y in YORUMLAR))
    return "\n".join(out)


def main():
    if "--metin" in sys.argv:
        p = os.path.join(KOK, "_proje", "modul-2-icerik-seo.md")
        s = open(p, encoding="utf-8").read()
        s = re.sub(r"(<!-- METIN:BAS -->\n).*?(\n<!-- METIN:SON -->)", lambda m: m.group(1) + metin_raporu() + m.group(2), s, flags=re.S)
        open(p, "w", encoding="utf-8").write(s)
        print("modul-2 §12 yenilendi")
        return
    yaz("", ana())
    yaz("mutfak-dolabi/", mutfak())
    yaz("vestiyer-gomme-dolap/", vestiyer())
    yaz("karavan-mobilyasi/", karavan())
    with open(os.path.join(KOK, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + "".join(f"  <url><loc>{URL}{y}</loc><lastmod>{TARIH}</lastmod></url>\n" for y in SAYFA_SIRASI) + "</urlset>\n")
    print("4 sayfa + sitemap.xml yazıldı")


if __name__ == "__main__":
    main()
