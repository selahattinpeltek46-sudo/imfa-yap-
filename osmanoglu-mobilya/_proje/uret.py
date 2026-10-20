#!/usr/bin/env python3
"""Osmanoğlu Mobilya sitesini üretir (v2, editoryal tasarım): 12 sayfa + sitemap.xml.

Metinler ve fotoğraf envanteri icerik.py'de (tek kaynak). Bileşenler (üst çubuk, tam boy hero, güven şeridi,
ihtiyaç ızgarası, ilkeler, çözüm kartları, süreç, işçilik tablosu, projeler, yorumlar, iletişim, SSS, CTA bandı,
alt bilgi, schema) burada.
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
from icerik import (ADIMLAR, COZUM_EK, COZUMLER, DETAY_ALT, DETAY_BASLIK, DETAY_KARELER, DETAY_TABLO,  # noqa: E402
                    BUYUK, FOTO, GUVEN, HAZIRLIK, IHTIYAC, KARO, MOZAIK, ILETISIM_TABLO, ILKELER, ILKELER_ALT, ILKELER_BASLIK,
                    KARAVAN, MAKALELER, MESAJ_TURLERI, MUTFAK, PROJELER, PUAN, SAYFA, SAYFA_SIRASI, SSS, TARIH,
                    TARIH_OKUNUR, VESTIYER, YORUM_SAYISI, YORUMLAR)

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

MENU = [("mutfak-dolabi/", "Mutfak Dolabı"), ("vestiyer-gomme-dolap/", "Vestiyer & Dolap"), ("karavan-mobilyasi/", "Karavan"),
        ("projeler/", "Projeler"), ("nasil-calisiyoruz/", "Nasıl Çalışıyoruz?"), ("bilgi-merkezi/", "Bilgi Merkezi"),
        ("iletisim/", "İletişim")]

IKON = {
    "atolye": '<path d="M3 21V9l9-6 9 6v12"/><path d="M9 21v-6h6v6"/>',
    "olcu": '<path d="M3 17 17 3l4 4L7 21z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>',
    "usta": '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    "yildiz": '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    "wa": '<path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5z"/><path d="M8.5 8.8c.3 2.6 2.4 4.8 5 5.4l1.2-1.2 2 .9-.4 1.6c-3.8.4-8-3.6-7.7-7.6l1.6-.4.9 2z"/>',
    "tel": '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
    "ok": '<path d="M5 12h14M13 6l6 6-6 6"/>',
}


def e(s):
    return escape(s, quote=True)


def ikon(ad, sinif="ikon"):
    return f'<svg class="{sinif}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">{IKON[ad]}</svg>'


def wa(metin):
    return f"https://wa.me/{WA}?text={quote(metin)}"


def img(dosya, k, yukle="lazy", boyut="(min-width: 900px) 50vw, 100vw", oncelik=False, sinif=""):
    alt, w, h = FOTO[dosya]
    src = f"{k}img/{dosya}.webp"
    srcset = f' srcset="{src} {w}w, {k}img/{dosya}-buyuk.webp {round(w * 1.8)}w" sizes="{boyut}"' if dosya in BUYUK else ""
    return (f'<img src="{src}"{srcset} '
            f'width="{w}" height="{h}" alt="{e(alt)}" loading="{yukle}" decoding="async"'
            + (' fetchpriority="high"' if oncelik else "") + (f' class="{sinif}"' if sinif else "") + ">")


def baslik(t, seviye=2, idm=""):
    """İki satırlı editoryal başlık: ikinci satır italik."""
    a, b = t
    return f'<h{seviye}{f" id={chr(34)}{idm}{chr(34)}" if idm else ""}>{e(a)} <em>{e(b)}</em></h{seviye}>'


def ust_baslik(t):
    return f'<p class="ust-baslik">{e(t)}</p>'


def dugme(href, metin, tur="koyu", olay="", ikon_ad="", dis=False):
    return (f'<a class="dugme dugme--{tur}" href="{href}"' + (f' data-olay="{olay}"' if olay else "")
            + (' rel="noopener" target="_blank"' if dis else "") + ">"
            + (ikon(ikon_ad) if ikon_ad else "") + f"<span>{e(metin)}</span></a>")


def bag(href, metin, dis=False, olay=""):
    return (f'<a class="bag" href="{href}"' + (' rel="noopener" target="_blank"' if dis else "")
            + (f' data-olay="{olay}"' if olay else "") + f">{e(metin)}{ikon('ok')}</a>")


# ------------------------------------------------------------------- schema
def isletme():
    return {
        "@type": "HomeAndConstructionBusiness",
        "@id": URL + "#isletme",
        "name": FIRMA,
        "description": "Sincan Sanayi Sitesi'nde özel ölçü mutfak dolabı, vestiyer, gardırop, gömme dolap ve karavan mobilyası.",
        "url": URL,
        "telephone": TEL,
        "image": URL + "img/mutfak-pencere-l-tezgah-buyuk.webp",
        "address": {"@type": "PostalAddress", "streetAddress": ADRES[0], "addressLocality": "Sincan",
                    "addressRegion": "Ankara", "postalCode": "06000", "addressCountry": "TR"},
        "geo": {"@type": "GeoCoordinates", "latitude": LAT, "longitude": LNG},
        "hasMap": HARITA,
        "areaServed": {"@type": "City", "name": "Ankara"},
    }


def kirinti_liste(yol):
    parcalar, adim = [(FIRMA, "")], ""
    for p in [x for x in yol.split("/") if x]:
        adim += p + "/"
        parcalar.append((SAYFA[adim]["menu"], adim))
    return parcalar


def schema(yol, s):
    graf = [isletme()]
    if yol:
        graf.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "name": ad, "item": URL + y} for i, (ad, y) in enumerate(kirinti_liste(yol))]})
    if yol in ("mutfak-dolabi/", "vestiyer-gomme-dolap/", "karavan-mobilyasi/"):
        graf.append({"@type": "Service", "name": s["menu"], "serviceType": s["menu"], "provider": {"@id": URL + "#isletme"},
                     "areaServed": {"@type": "City", "name": "Ankara"}, "url": URL + yol})
    if yol in MAKALELER:
        graf.append({"@type": "Article", "headline": s["h1"] + " " + s["h1_em"], "description": s["meta"],
                     "datePublished": TARIH, "dateModified": TARIH, "inLanguage": "tr",
                     "author": {"@id": URL + "#isletme"}, "publisher": {"@id": URL + "#isletme"}, "mainEntityOfPage": URL + yol})
    if SSS.get(yol):
        graf.append({"@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in SSS[yol]]})
    return json.dumps({"@context": "https://schema.org", "@graph": graf}, ensure_ascii=False)


# ------------------------------------------------------------------- iskelet
def ust(yol, k):
    def aktif(y):
        return y == yol or (y != "" and yol.startswith(y))
    linkler = "".join(f'<a href="{k}{y}"{" aria-current=page" if aktif(y) else ""}>{e(ad)}</a>' for y, ad in MENU)
    return f"""<a class="atla" href="#icerik">İçeriğe geç</a>
<header class="ust">
  <a class="logo" href="{k}" aria-label="{FIRMA}, ana sayfa"><span class="logo__ad">Osmanoğlu</span><span class="logo__alt">Mobilya · Sincan</span></a>
  <nav id="menu" class="menu" aria-label="Ana menü">{linkler}
    <div class="menu__alt"><a href="tel:{TEL}" data-olay="telefon_tikla">{TEL_GORUNEN}</a><span>{ADRES[0]}, {ADRES[1]}</span></div></nav>
  <a class="ust__cta" href="{wa(SAYFA[yol]['wa'])}" data-olay="whatsapp_tikla">Projenizi Konuşalım</a>
  <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu"><span></span><span></span><span class="gizli">Menü</span></button>
</header>"""


def alt(k):
    cozum = "".join(f'<li><a href="{k}{y}">{e(SAYFA[y]["menu"])}</a></li>' for y in ("mutfak-dolabi/", "vestiyer-gomme-dolap/", "karavan-mobilyasi/"))
    kurum = "".join(f'<li><a href="{k}{y}">{e(SAYFA[y]["menu"])}</a></li>' for y in ("projeler/", "nasil-calisiyoruz/", "bilgi-merkezi/", "iletisim/"))
    return f"""<footer class="alt">
  <div class="alt__ic">
    <div class="alt__marka"><p class="logo logo--alt"><span class="logo__ad">Osmanoğlu</span><span class="logo__alt">Mobilya · Sincan</span></p>
      <p>Ankara için özel ölçü mutfak, vestiyer ve dolap. Sincan Sanayi Sitesi'ndeki atölyemizden.</p></div>
    <div><p class="alt__bas">Çözümler</p><ul>{cozum}</ul></div>
    <div><p class="alt__bas">Kurumsal</p><ul>{kurum}</ul></div>
    <div><p class="alt__bas">İletişim</p><ul><li><a href="tel:{TEL}" data-olay="telefon_tikla">{TEL_GORUNEN}</a></li>
      <li><a href="{wa('Merhaba, bilgi almak istiyorum.')}" data-olay="whatsapp_tikla">WhatsApp</a></li>
      <li>{ADRES[0]},<br>{ADRES[1]}</li><li><a href="{YOL}" rel="noopener" target="_blank" data-olay="yol_tarifi">Yol tarifi</a></li></ul></div>
  </div>
  <div class="alt__son"><p>© {FIRMA} — Sincan / Ankara</p>
    <p>Bu site kendi çerezini kullanmaz ve ziyaretçi verisi toplamaz; harita yalnız siz tıklayınca yüklenir. Fotoğraflar kendi işlerimizdir; karavan çizimi temsilidir.</p></div>
</footer>
<a class="yuzen-wa" href="{wa('Merhaba, bilgi almak istiyorum.')}" data-olay="whatsapp_tikla" aria-label="WhatsApp'tan yazın">{ikon('wa')}</a>
<div class="mobil-cubuk"><a href="{wa('Merhaba, bilgi almak istiyorum.')}" data-olay="whatsapp_tikla">{ikon('wa')}<span>WhatsApp</span></a><a href="tel:{TEL}" data-olay="telefon_tikla">{ikon('tel')}<span>Ara</span></a></div>"""


def sayfa(yol, govde, ek_head=""):
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
<meta property="og:type" content="{"article" if yol in MAKALELER else "website"}">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="{FIRMA}">
<meta property="og:title" content="{e(s["title"])}">
<meta property="og:description" content="{e(s["meta"])}">
<meta property="og:url" content="{URL}{yol}">
<meta property="og:image" content="{URL}img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f4efe6">
<link rel="icon" href="{k}img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{k}img/apple-touch-icon.png">
<link rel="preload" href="{k}fonts/bodoni-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{k}css/site.css">{ek_head}
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


# ------------------------------------------------------------------- hero
def kirinti(yol, k):
    if not yol:
        return ""
    parca = kirinti_liste(yol)
    li = "".join(f'<li><a href="{k}{y}">{e(ad)}</a></li>' for ad, y in parca[:-1]) + f'<li aria-current="page">{e(parca[-1][0])}</li>'
    return f'<nav class="kirinti" aria-label="Sayfa yolu"><ol>{li}</ol></nav>'


def hero_kart(yol, s, k, cta=True):
    return f"""<div class="hero__kart">
    {kirinti(yol, k)}
    {ust_baslik(s["ust"])}
    <h1>{e(s["h1"])} <em>{e(s["h1_em"])}</em></h1>
    <p class="hero__giris">{e(s["giris"])}</p>
    {f'<div class="cta">{dugme(wa(s["wa"]), "Projenizi Konuşalım", "koyu", "whatsapp_tikla", "wa")}{dugme(f"tel:{TEL}", TEL_GORUNEN, "cizgi", "telefon_tikla", "tel")}</div>' if cta else ""}
    <p class="hero__not"><a href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">Google Haritalar: <strong>{PUAN}</strong> · {YORUM_SAYISI} yorum</a> · {TARIH_OKUNUR} itibarıyla</p>
  </div>"""


def hero(yol, s, k):
    """Tam boy hero: solda düz krem panelde metin, sağda gerçek karelerden yavaşça kayan 3 sütunlu mozaik.
    Kareler büyütülmez (kendi çözünürlüğünde ya da küçültülerek gösterilir); karartma / gradyan / bulanıklık yok."""
    sutunlar = ""
    for i, sutun in enumerate(MOZAIK[yol]):
        def karo(d, kopya):
            return (f'<figure class="karo"{" aria-hidden=true" if kopya else ""}>{img(d, k, "eager" if (i < 2 and not kopya) else "lazy", boyut="(min-width: 900px) 20vw, 50vw", oncelik=(i == 0 and d == sutun[0] and not kopya))}'
                    f'<figcaption>{e(KARO[d])}</figcaption></figure>')
        # kesintisiz döngü için sütun iki kez yazılır; ikinci kopya ekran okuyucudan gizli
        sutunlar += (f'<div class="mozaik__sutun mozaik__sutun--{i + 1}"><div class="mozaik__serit">'
                     + "".join(karo(d, False) for d in sutun) + "".join(karo(d, True) for d in sutun) + "</div></div>")
    return f"""<section class="hero{" hero--alt" if yol else ""}">
  {hero_kart(yol, s, k)}
  <div class="mozaik" data-mozaik aria-label="Yaptığımız işlerden kareler">{sutunlar}
    <button type="button" class="mozaik__dur" data-dur aria-pressed="false">Durdur</button></div>
</section>"""


def hero_duz(yol, s, k, sag=""):
    """Fotoğrafsız sayfalar (liste, makale, iletişim, karavan): adaçayı zeminli büyük başlık."""
    return f"""<section class="hero-duz{" hero-duz--ikili" if sag else ""}">
  <div class="hero-duz__ic">{hero_kart(yol, s, k, cta=not sag)}{f'<div class="hero-duz__sag">{sag}</div>' if sag else ""}</div>
</section>"""


# ------------------------------------------------------------------- bölümler
def guven_seridi():
    li = "".join(f'<li>{ikon(i)}<div><strong>{e(b)}</strong><span>{e(m)}</span></div></li>' for i, b, m in GUVEN)
    return f'<section class="guven" aria-label="Bizi tanıyın"><ul class="guven__liste">{li}</ul></section>'


def ihtiyac():
    kart = "".join(
        f'<li class="r"><h3>{e(b)}</h3><p>{e(m)}</p>{bag(wa(msj), cta, olay="whatsapp_tikla")}</li>' for b, m, cta, msj in IHTIYAC)
    return f"""<section class="bolum" aria-labelledby="ihtiyac-bas">
  <div class="bas bas--orta">{ust_baslik("Size uygun başlangıç")}<h2 id="ihtiyac-bas">Siz hangi <em>ihtiyaçtasınız?</em></h2></div>
  <ul class="ihtiyac">{kart}</ul>
</section>"""


def ilkeler():
    li = "".join(f'<li class="r"><strong>{e(b)}</strong> {e(m)}</li>' for b, m in ILKELER)
    return f"""<section class="bolum ikili" aria-labelledby="ilke-bas">
  <div class="ikili__sol">{ust_baslik("Bizim iş yapma biçimimiz")}{baslik(ILKELER_BASLIK, idm="ilke-bas")}<p class="italik">{e(ILKELER_ALT)}</p>
    {dugme("nasil-calisiyoruz/", "Nasıl çalıştığımızı görün", "cizgi")}</div>
  <ol class="ilke-liste">{li}</ol>
</section>"""


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


def cozumler(k=""):
    kart = ""
    for c in COZUMLER:
        gorsel = (img(c["foto"], k, boyut="(min-width: 900px) 33vw, 100vw") if c["foto"]
                  else f'<div class="cizim-kutu">{karavan_svg()}<span>Temsili çizim</span></div>')
        kart += (f'<article class="cozum r"><a class="cozum__foto" href="{k}{c["sayfa"]}" tabindex="-1" aria-hidden="true">{gorsel}</a>'
                 f'<div class="cozum__metin"><span class="no">{c["no"]}</span><h3><a href="{k}{c["sayfa"]}">{e(c["baslik"])}</a></h3>'
                 f'<p>{e(c["metin"])}</p>{bag(k + c["sayfa"], c["cta"])}</div></article>')
    return f"""<section class="bolum bant bant--tas" id="cozumler" aria-labelledby="cozum-bas">
  <div class="bas bas--orta">{ust_baslik("Çözümlerimiz")}<h2 id="cozum-bas">Mekânınıza göre <em>çözümler.</em></h2>
    <p>Hepsi ölçüyle, hepsi Sincan'daki atölyemizden.</p></div>
  <div class="cozum-izgara">{kart}</div>
  <p class="cozum-ek">{e(COZUM_EK)} {bag(HARITA, "Haritalar'da görün", dis=True, olay="haritalar_tikla")}</p>
</section>"""


def foto_cta(metin="Mobilya ihtiyacınızı anlatın, alanınızın fotoğraflarını WhatsApp'tan gönderin; birlikte değerlendirelim."):
    return f"""<section class="bolum foto-cta r" aria-labelledby="fcta-bas">
  {ust_baslik("Başlangıç noktası")}<h2 id="fcta-bas">Mekânınızı <em>bize gösterin.</em></h2><p>{e(metin)}</p>
  <div class="cta cta--orta">{dugme(wa("Merhaba, alanımın fotoğraflarını gönderiyorum."), "WhatsApp'tan fotoğraf gönderin", "koyu", "whatsapp_tikla", "wa")}</div>
</section>"""


def surec(k="", foto=True):
    li = "".join(f'<li class="r"><span class="no">{i + 1:02d}</span><h3>{e(b)}</h3><p>{e(m)}</p><span class="kim">{e(kim)}</span></li>'
                 for i, (b, m, kim) in enumerate(ADIMLAR))
    return f"""<section class="koyu" aria-labelledby="surec-bas">
  <div class="bolum">
    <div class="bas">{ust_baslik("Nasıl çalışıyoruz?")}<h2 id="surec-bas">Siz anlatın, <em>biz birlikte planlayalım.</em></h2>
      <p class="italik">"Sipariş verirsem ne olacak?" sorusunun cevabı.</p></div>
    <div class="surec{" surec--foto" if foto else ""}"><ol class="surec__liste">{li}</ol>
      {f'<figure class="surec__foto r">{img("mutfak-eviye-cekmeceler", k, boyut="(min-width: 900px) 30vw, 100vw")}<figcaption>Atölyeden çıkan bir mutfağın eviye hattı.</figcaption></figure>' if foto else ""}</div>
    <div class="cta">{dugme(wa("Merhaba, işime başlamak için bilgi almak istiyorum."), "WhatsApp'tan başlayın", "acik", "whatsapp_tikla", "wa")}
      {bag(k + "nasil-calisiyoruz/", "Süreci ayrıntılı okuyun") if foto else ""}</div>
  </div>
</section>"""


def iscilik(k=""):
    tablo = "".join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in DETAY_TABLO)
    kareler = "".join(f'<figure class="r">{img(d, k, boyut="(min-width: 900px) 33vw, 100vw")}<figcaption><strong>{e(b)}</strong>{e(m)}</figcaption></figure>'
                      for d, b, m in DETAY_KARELER)
    return f"""<section class="bolum" aria-labelledby="iscilik-bas">
  <div class="iscilik">
    <figure class="iscilik__foto r">{img("mutfak-eviye-cekmeceler", k, boyut="(min-width: 900px) 50vw, 100vw")}</figure>
    <div class="iscilik__metin r">{ust_baslik("İşçilik")}{baslik(DETAY_BASLIK, idm="iscilik-bas")}<p class="italik">{e(DETAY_ALT)}</p>
      <dl class="ozellik">{tablo}</dl><p class="kucuk">Fotoğraftan okunan bilgiler; malzeme markası ve kalınlıkları her işte ayrıca konuşulur.</p></div>
  </div>
  <div class="uclu">{kareler}</div>
</section>"""


def proje_kartlari(k=""):
    kart = ""
    for y, p in PROJELER.items():
        kart += (f'<article class="proje r"><a href="{k}{y}" class="proje__foto">{img(p["kapak"], k, boyut="(min-width: 900px) 50vw, 100vw")}</a>'
                 f'<div class="proje__metin"><p class="ust-baslik">{e(p["kategori"])} · {e(p["konum"])}</p>'
                 f'<h3><a href="{k}{y}">{e(SAYFA[y]["menu"])}</a></h3><p>{e(p["ozet"])}</p>{bag(k + y, "Projeyi inceleyin")}</div></article>')
    kamil = next(x for x in YORUMLAR if x["kisi"] == "Kamil C.")
    kart += (f'<article class="proje proje--yorum r"><a href="{k}karavan-mobilyasi/" class="proje__foto cizim-kutu" tabindex="-1" aria-hidden="true">{karavan_svg()}<span>Temsili çizim</span></a>'
             f'<div class="proje__metin"><p class="ust-baslik">Karavan · Müşteri yorumu</p><h3><a href="{k}karavan-mobilyasi/">Ayous ağacından karavan</a></h3>'
             f'<p>"{e(kamil["metin"][:118].rsplit(" ", 1)[0])}…" — {e(kamil["kisi"])}</p>{bag(k + "karavan-mobilyasi/", "Karavan sayfası")}</div></article>')
    return kart


def projeler_bolumu(k=""):
    return f"""<section class="bolum" id="projeler" aria-labelledby="proje-bas">
  <div class="bas bas--orta">{ust_baslik("Gerçek projeler")}<h2 id="proje-bas">Yaptığımız işler <em>konuşsun.</em></h2>
    <p class="italik">Her işin fotoğrafını, ne gördüğünüzü yazarak paylaşıyoruz.</p></div>
  <div class="proje-izgara">{proje_kartlari(k)}</div>
  <p class="orta">{bag(k + "projeler/", "Tüm projeler")}</p>
</section>"""


def yorumlar(secim=None):
    liste = [y for y in YORUMLAR if secim is None or y["kisi"] in secim]
    kart = "".join(
        f'<blockquote class="yorum r"><p>{e(y["metin"])}</p><footer><strong>{e(y["kisi"])}</strong><span>{e(y["konu"])} · {e(y["zaman"])}, Google</span></footer></blockquote>'
        for y in liste)
    return f"""<section class="bolum bant bant--adacayi" aria-labelledby="yorum-bas">
  <div class="bas bas--orta">{ust_baslik(f"Google Haritalar · {PUAN} · {YORUM_SAYISI} yorum")}<h2 id="yorum-bas">Müşterilerimiz <em>ne yazdı?</em></h2>
    <p>Yorumlardan, {TARIH_OKUNUR} tarihinde okunduğu gibi. Tamamı ve müşterilerin paylaştığı fotoğraflar Haritalar'da.</p></div>
  <div class="yorum-izgara{" yorum-izgara--iki" if len(liste) == 2 else ""}">{kart}</div>
  <p class="orta">{bag(HARITA, f"{YORUM_SAYISI} yorumun hepsini okuyun", dis=True, olay="haritalar_tikla")}</p>
</section>"""


def iletisim_blok(baslik_goster=True):
    satir = ""
    for ad, deger, tur in ILETISIM_TABLO:
        if tur == "tel":
            d = f'<a href="tel:{TEL}" data-olay="telefon_tikla">{e(deger)}</a>'
        elif tur == "wa":
            d = f'<a href="{wa("Merhaba, bilgi almak istiyorum.")}" data-olay="whatsapp_tikla">{e(deger)}</a>'
        else:
            d = e(deger)
        satir += f"<div><dt>{e(ad)}</dt><dd>{d}</dd></div>"
    return f"""<section class="bolum ikili ikili--orta" id="iletisim" aria-labelledby="ilet-bas">
  <div class="ikili__sol r">{ust_baslik("Sincan'da, işin başında") if baslik_goster else ""}<h2 id="ilet-bas">Sincan <em>Sanayi Sitesi.</em></h2>
    <p>Atölyemizde gelip malzemeyi görebilir, işinizi ustayla konuşabilirsiniz.</p>
    <dl class="ozellik ozellik--satir">{satir}</dl>
    <p class="kucuk">{TARIH_OKUNUR} Salı günü Haritalar'da kapanış 18:30 görünüyordu; haftalık saatler için arayın.</p>
    <div class="cta">{dugme(YOL, "Yol tarifi", "cizgi", "yol_tarifi", dis=True)}</div></div>
  <div class="harita r" data-harita="{HARITA_GOMME}">
    <button type="button">Haritayı göster</button>
    <p>Harita Google'dan yüklenir; siz tıklayana kadar Google'a istek gönderilmez.</p>
  </div>
</section>"""


def sss(yol, k=""):
    li = "".join(f"<details><summary>{e(q)}</summary><p>{e(a)}</p></details>" for q, a in SSS[yol])
    return f"""<section class="bolum" aria-labelledby="sss-bas">
  <div class="bas bas--orta">{ust_baslik("S.S.S.")}<h2 id="sss-bas">Merak <em>edilenler.</em></h2></div>
  <div class="sss">{li}</div>
  <div class="cta cta--orta">{dugme(wa("Merhaba, bir sorum var:"), "Sorunuzu WhatsApp'tan sorun", "cizgi", "whatsapp_tikla")}</div>
</section>"""


def cta_bandi(k=""):
    return f"""<section class="cta-bant" aria-labelledby="cta-bas">
  <div class="cta-bant__ic r">{ust_baslik("Osmanoğlu Mobilya")}<h2 id="cta-bas">Mekânınızı birlikte <em>değerlendirelim.</em></h2>
    <p class="italik">Aklınızdaki mobilyayı, alanınızı ve ihtiyacınızı konuşalım. Fotoğraflarınızı WhatsApp'tan gönderin.</p>
    <div class="cta cta--orta">{dugme(wa("Merhaba, projemi konuşmak istiyorum."), "WhatsApp'tan projenizi gönderin", "acik", "whatsapp_tikla", "wa")}
      {dugme(f"tel:{TEL}", "Telefonla ulaşın", "cizgi-acik", "telefon_tikla", "tel")}</div>
    <p class="kucuk">ya da konumu görün: <a href="{HARITA}" rel="noopener" target="_blank" data-olay="haritalar_tikla">Google Haritalar</a></p></div>
</section>"""


def hazirlayici(on_tur=""):
    turler = "".join(
        f'<label class="secim"><input type="radio" name="tur" value="{e(t)}"{" checked" if t == on_tur else ""}><span>{e(t)}</span></label>'
        for t in MESAJ_TURLERI)
    return f"""<section class="bolum ikili" id="mesaj" aria-labelledby="mesaj-bas">
  <div class="ikili__sol">{ust_baslik("Mesaj hazırlayıcı")}<h2 id="mesaj-bas">Mesajınızı <em>birlikte hazırlayalım.</em></h2>
    <p>Bu form hiçbir yere kayıt göndermez. Seçtikleriniz mesaja dönüşür; "WhatsApp'ta aç" deyince mesaj sizin WhatsApp'ınızda, gönderilmeye hazır açılır.</p></div>
  <form class="hazirla r" data-hazirla>
    <fieldset><legend>Ne yaptırmak istiyorsunuz?</legend><div class="secimler">{turler}</div></fieldset>
    <div class="alanlar">
      <label>Semt / ilçe <input name="ilce" autocomplete="address-level2" placeholder="ör. Eryaman"></label>
      <label>Kaba ölçü (biliyorsanız) <input name="olcu" placeholder="ör. 320 × 260 cm, L"></label>
    </div>
    <label class="kutu"><input type="checkbox" name="foto" checked> Alanın fotoğraflarını mesajın ardından göndereceğim</label>
    <div class="onizleme"><span>Gidecek mesaj</span><pre data-onizleme></pre></div>
    <div class="cta"><a class="dugme dugme--koyu" data-wa href="{wa('Merhaba, bilgi almak istiyorum.')}" data-olay="whatsapp_form" rel="noopener" target="_blank">{ikon('wa')}<span>WhatsApp'ta aç</span></a>
    <button class="dugme dugme--cizgi" type="button" data-kopyala><span>Mesajı kopyala</span></button></div>
  </form>
</section>"""


def metin_blok(ust, bas, paragraflar, sag=""):
    p = "".join(f"<p>{e(x)}</p>" for x in paragraflar)
    return f"""<section class="bolum ikili">
  <div class="ikili__sol r">{ust_baslik(ust)}{baslik(bas)}</div>
  <div class="metin r">{p}{sag}</div>
</section>"""


def numarali(ust, bas, liste, idm):
    li = "".join(f'<li class="r"><span class="no">{i + 1:02d}</span><h3>{e(b)}</h3><p>{e(m)}</p></li>' for i, (b, m) in enumerate(liste))
    return f"""<section class="bolum" aria-labelledby="{idm}">
  <div class="bas">{ust_baslik(ust)}{baslik(bas, idm=idm)}</div>
  <ol class="numarali">{li}</ol>
</section>"""


# ------------------------------------------------------------------- sayfalar
def ana():
    k, s = "", SAYFA[""]
    govde = "\n".join([hero("", s, k), guven_seridi(), ihtiyac(), ilkeler(), cozumler(k), foto_cta(), surec(k),
                       iscilik(k), projeler_bolumu(k), yorumlar(), iletisim_blok(), sss(""), cta_bandi(k)])
    return sayfa("", govde)


def mutfak():
    yol, k = "mutfak-dolabi/", "../"
    s, m = SAYFA[yol], MUTFAK
    ilce = "".join(f"<li>{e(x)}</li>" for x in m["ilce_liste"])
    galeri = "".join(f'<figure class="r">{img(d, k, boyut="(min-width: 900px) 25vw, 50vw")}</figure>'
                     for d in ("mutfak-pencere-l-tezgah", "mutfak-eviye-cekmeceler", "mutfak-tezgah-kose", "mutfak-gun-isigi"))
    govde = "\n".join([
        hero(yol, s, k), guven_seridi(),
        metin_blok("Neden özel ölçü?", m["giris_baslik"], m["giris_metin"]),
        f'<section class="bolum bant bant--tas" aria-labelledby="gal-bas"><div class="bas bas--orta">{ust_baslik("Proje")}<h2 id="gal-bas">Pencere önü <em>L mutfak.</em></h2>'
        f'<p>Aynı işin dört karesi: genel görünüm, eviye hattı, köşe dönüşü, öğle ışığı.</p></div><div class="galeri">{galeri}</div>'
        f'<p class="orta">{bag(k + "projeler/pencere-onu-l-mutfak/", "Projenin ayrıntıları")}</p></section>',
        numarali("Seçimler", m["secim_baslik"], m["secimler"], "secim-bas"),
        iscilik(k), surec(k, foto=False), yorumlar(["Murat T.", "Emre K."]),
        f'<section class="bolum ikili ikili--orta"><div class="ikili__sol r">{ust_baslik("Hizmet bölgesi")}{baslik(m["ilce_baslik"])}<p>{e(m["ilceler"])}</p></div>'
        f'<ul class="etiket-liste r">{ilce}</ul></section>',
        hazirlayici(s["tur"]), sss(yol, k),
        f'<section class="bolum ilgili"><p class="ust-baslik">İlgili</p><div class="ilgili__liste">{bag(k + "bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/", "Mutfak dolabı yaptırmadan önce 8 soru")}'
        f'{bag(k + "bilgi-merkezi/kaba-olcu-nasil-alinir/", "Kaba ölçü nasıl alınır?")}{bag(k + "vestiyer-gomme-dolap/", "Vestiyer ve gömme dolap")}</div></section>',
        cta_bandi(k)])
    return sayfa(yol, govde)


def vestiyer():
    yol, k = "vestiyer-gomme-dolap/", "../"
    s, v = SAYFA[yol], VESTIYER
    detay = "".join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in v["detay"])
    diger = "".join(f"<li>{e(x)}</li>" for x in v["diger"])
    govde = "\n".join([
        hero(yol, s, k), guven_seridi(),
        metin_blok("Antre ve koridor", v["giris_baslik"], v["giris_metin"]),
        f'<section class="bolum bant bant--tas" aria-labelledby="ant-bas"><div class="iscilik"><figure class="iscilik__foto r">{img("antre-aynali-citali-vestiyer", k)}</figure>'
        f'<div class="iscilik__metin r">{ust_baslik("Proje")}<h2 id="ant-bas">Bu antrede <em>ne var?</em></h2><dl class="ozellik">{detay}</dl>'
        f'{bag(k + "projeler/aynali-citali-antre/", "Projenin ayrıntıları")}</div></div></section>',
        numarali("Yaptığımız işler", ("Antreden", "yatak odasına."), v["turler"], "tur-bas"),
        f'<section class="bolum ikili ikili--orta"><div class="ikili__sol r">{ust_baslik("Google Haritalar")}{baslik(v["diger_baslik"])}<p>{e(v["diger_giris"])}</p>'
        f'{bag(HARITA, "Fotoğrafları Haritalar\'da görün", dis=True, olay="haritalar_tikla")}</div><ul class="cizgili r">{diger}</ul></section>',
        yorumlar(["Emre K.", "Murat T."]), surec(k, foto=False), hazirlayici(s["tur"]), sss(yol, k),
        f'<section class="bolum ilgili"><p class="ust-baslik">İlgili</p><div class="ilgili__liste">{bag(k + "mutfak-dolabi/", "Mutfak dolabı")}'
        f'{bag(k + "bilgi-merkezi/kaba-olcu-nasil-alinir/", "Kaba ölçü nasıl alınır?")}{bag(k + "projeler/", "Projeler")}</div></section>',
        cta_bandi(k)])
    return sayfa(yol, govde)


def karavan():
    yol, k = "karavan-mobilyasi/", "../"
    s, kv = SAYFA[yol], KARAVAN
    kamil = next(y for y in YORUMLAR if y["kisi"] == "Kamil C.")
    bilinen = "".join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in kv["bilinen"])
    getir = "".join(f"<li>{e(x)}</li>" for x in kv["getir"])
    sag = f'<figure class="karavan-kutu">{karavan_svg()}<figcaption>{e(kv["cizim_notu"])}</figcaption></figure>'
    govde = "\n".join([
        hero_duz(yol, s, k, sag),
        f'<section class="bolum alinti" aria-labelledby="alinti-bas"><div class="bas bas--orta">{ust_baslik("Müşteri yorumu")}{baslik(kv["yorum_baslik"], idm="alinti-bas")}</div>'
        f'<blockquote class="yorum yorum--buyuk r"><p>{e(kamil["metin"])}</p><footer><strong>{e(kamil["kisi"])}</strong><span>{e(kamil["konu"])} · {e(kamil["zaman"])}, Google</span></footer></blockquote>'
        f'<p class="orta">{bag(HARITA, "Karavanın fotoğrafları Haritalar yorumunda", dis=True, olay="haritalar_tikla")}</p></section>',
        f'<section class="bolum bant bant--tas ikili"><div class="ikili__sol r">{ust_baslik("Bildiklerimiz")}{baslik(kv["bilinen_baslik"])}<dl class="ozellik">{bilinen}</dl></div>'
        f'<div class="r">{ust_baslik("Hazırlık")}{baslik(kv["getir_baslik"])}<ul class="cizgili">{getir}</ul></div></section>',
        hazirlayici(s["tur"]), sss(yol, k),
        f'<section class="bolum ilgili"><p class="ust-baslik">Asıl işimiz</p><div class="ilgili__liste">{bag(k + "mutfak-dolabi/", "Mutfak dolabı")}{bag(k + "vestiyer-gomme-dolap/", "Vestiyer ve gömme dolap")}</div></section>',
        cta_bandi(k)])
    return sayfa(yol, govde)


def projeler():
    yol, k = "projeler/", "../"
    govde = "\n".join([hero_duz(yol, SAYFA[yol], k),
                       f'<section class="bolum"><div class="proje-izgara">{proje_kartlari(k)}</div></section>',
                       yorumlar(), foto_cta(), cta_bandi(k)])
    return sayfa(yol, govde)


def proje(yol):
    k = "../../"
    s, p = SAYFA[yol], PROJELER[yol]
    tablo = "".join(f'<div><dt>{e(a)}</dt><dd>{e(b)}</dd></div>' for a, b in p["tablo"])
    galeri = "".join(f'<figure class="r">{img(d, k, boyut="(min-width: 900px) 25vw, 50vw")}</figure>' for d in p["kareler"][1:])
    diger = next(y for y in PROJELER if y != yol)
    hizmet = "mutfak-dolabi/" if "mutfak" in yol else "vestiyer-gomme-dolap/"
    govde = "\n".join([
        hero(yol, s, k),
        f'<section class="bolum ikili"><div class="ikili__sol r">{ust_baslik("Fotoğraftan okunanlar")}<h2>Projenin <em>detayları.</em></h2>'
        f'<dl class="ozellik">{tablo}</dl><p class="kucuk">Konum: {e(p["konum"])}. Malzeme markası ve kalınlıkları fotoğraftan okunmaz; her işte ayrıca konuşulur.</p></div>'
        f'<div class="metin r">{"".join(f"<p>{e(x)}</p>" for x in p["metin"])}</div></section>',
        (f'<section class="bolum bant bant--tas"><div class="galeri galeri--{len(p["kareler"]) - 1}">{galeri}</div></section>' if galeri else ""),
        f'<section class="bolum ilgili"><p class="ust-baslik">Devam edin</p><div class="ilgili__liste">{bag(k + diger, SAYFA[diger]["menu"])}'
        f'{bag(k + hizmet, SAYFA[hizmet]["menu"])}{bag(k + "projeler/", "Tüm projeler")}</div></section>',
        foto_cta("Benzer bir iş için alanınızın fotoğraflarını gönderin; neyin nasıl uyarlanabileceğini birlikte konuşalım."),
        cta_bandi(k)])
    return sayfa(yol, govde)


def nasil():
    yol, k = "nasil-calisiyoruz/", "../"
    li = "".join(f'<li class="r"><span class="no">{i + 1:02d}</span><div><h2 class="h3">{e(b)}</h2><p>{e(m)}</p></div><span class="kim">{e(kim)}</span></li>'
                 for i, (b, m, kim) in enumerate(ADIMLAR))
    hz = "".join(f'<li class="r"><h3>{e(b)}</h3><p>{e(m)}</p></li>' for b, m in HAZIRLIK)
    govde = "\n".join([
        hero_duz(yol, SAYFA[yol], k),
        f'<section class="bolum"><ol class="adim-uzun">{li}</ol></section>',
        f'<section class="bolum bant bant--tas" aria-labelledby="hz-bas"><div class="bas bas--orta">{ust_baslik("Hazırlık")}<h2 id="hz-bas">Başlamadan önce <em>hazırlayın.</em></h2></div>'
        f'<ul class="ihtiyac ihtiyac--acik">{hz}</ul><p class="orta">{bag(k + "bilgi-merkezi/kaba-olcu-nasil-alinir/", "Kaba ölçü nasıl alınır?")}</p></section>',
        hazirlayici(), sss(yol, k), cta_bandi(k)])
    return sayfa(yol, govde)


def bilgi():
    yol, k = "bilgi-merkezi/", "../"
    kart = "".join(
        f'<article class="makale-kart r"><p class="ust-baslik">{e(SAYFA[y]["ust"])} · {e(m["okuma"])} okuma</p>'
        f'<h2 class="h3"><a href="{k}{y}">{e(SAYFA[y]["h1"])} {e(SAYFA[y]["h1_em"])}</a></h2><p>{e(m["ozet"])}</p>{bag(k + y, "Okuyun")}</article>'
        for y, m in MAKALELER.items())
    govde = "\n".join([hero_duz(yol, SAYFA[yol], k), f'<section class="bolum"><div class="makale-izgara">{kart}</div></section>', foto_cta(), cta_bandi(k)])
    return sayfa(yol, govde)


def makale(yol):
    k = "../../"
    s, m = SAYFA[yol], MAKALELER[yol]
    govde_m = "".join(f'<h2 class="h3">{e(b)}</h2><p>{e(t)}</p>' for b, t in m["bolumler"])
    diger = next(y for y in MAKALELER if y != yol)
    govde = "\n".join([
        hero_duz(yol, s, k),
        f'<article class="bolum makale"><p class="makale__bilgi">{e(m["okuma"])} okuma · {TARIH_OKUNUR} · {FIRMA}</p>{govde_m}'
        f'<aside class="makale__son"><p>{e(m["son"])}</p><div class="cta">{dugme(wa(s["wa"]), "WhatsApp\'tan yazın", "koyu", "whatsapp_tikla", "wa")}</div></aside></article>',
        f'<section class="bolum ilgili"><p class="ust-baslik">Diğer rehber</p><div class="ilgili__liste">{bag(k + diger, SAYFA[diger]["h1"] + " " + SAYFA[diger]["h1_em"])}'
        f'{bag(k + "mutfak-dolabi/", "Mutfak dolabı")}{bag(k + "nasil-calisiyoruz/", "Nasıl çalışıyoruz?")}</div></section>',
        cta_bandi(k)])
    return sayfa(yol, govde)


def iletisim():
    yol, k = "iletisim/", "../"
    govde = "\n".join([hero_duz(yol, SAYFA[yol], k), iletisim_blok(baslik_goster=False), hazirlayici(), sss(yol, k), cta_bandi(k)])
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
                   f"- **Üst başlık**: {s['ust']}\n- **H1**: {s['h1']} {s['h1_em']}\n- **Giriş**: {s['giris']}\n- **WhatsApp hazır mesaj**: {s['wa']}\n"
                   + "".join(f"- **SSS** — {q} → {a}\n" for q, a in SSS.get(y, [])))
    out.append("### Ana sayfa bölümleri\n"
               + "- **Güven şeridi**: " + " · ".join(f"{b} ({m})" for _, b, m in GUVEN) + "\n"
               + "- **Siz hangi ihtiyaçtasınız?**\n" + "".join(f"  - {b}: {m} [{c}]\n" for b, m, c, _ in IHTIYAC)
               + f"- **{' '.join(ILKELER_BASLIK)}** — {ILKELER_ALT}\n" + "".join(f"  - {b} {m}\n" for b, m in ILKELER)
               + "- **Çözümler**\n" + "".join(f"  - {c['baslik']}: {c['metin']}\n" for c in COZUMLER) + f"  - {COZUM_EK}\n"
               + "- **Süreç**\n" + "".join(f"  - {b} ({kim}): {m}\n" for b, m, kim in ADIMLAR)
               + f"- **{' '.join(DETAY_BASLIK)}** — {DETAY_ALT}\n" + "".join(f"  - {a}: {b}\n" for a, b in DETAY_TABLO)
               + "".join(f"  - {b}: {m}\n" for _, b, m in DETAY_KARELER))
    out.append("### Mutfak dolabı gövdesi\n" + "".join(f"- {x}\n" for x in MUTFAK["giris_metin"]) + "".join(f"- {b}: {t}\n" for b, t in MUTFAK["secimler"]) + f"- {MUTFAK['ilceler']}\n")
    out.append("### Vestiyer gövdesi\n" + "".join(f"- {x}\n" for x in VESTIYER["giris_metin"]) + "".join(f"- {b}: {t}\n" for b, t in VESTIYER["detay"] + VESTIYER["turler"])
               + f"- {VESTIYER['diger_giris']}\n" + "".join(f"  - {x}\n" for x in VESTIYER["diger"]))
    out.append("### Karavan gövdesi\n" + "".join(f"- {b}: {t}\n" for b, t in KARAVAN["bilinen"]) + "".join(f"- Getirin: {x}\n" for x in KARAVAN["getir"]))
    for y, p in PROJELER.items():
        out.append(f"### Proje /{y}\n" + "".join(f"- {a}: {b}\n" for a, b in p["tablo"]) + "".join(f"- {x}\n" for x in p["metin"]))
    out.append("### Nasıl çalışıyoruz — hazırlık\n" + "".join(f"- {b}: {m}\n" for b, m in HAZIRLIK))
    for y, m in MAKALELER.items():
        out.append(f"### Makale /{y}\n" + "".join(f"- **{b}** {t}\n" for b, t in m["bolumler"]) + f"- {m['son']}\n")
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
    yaz("projeler/", projeler())
    for y in PROJELER:
        yaz(y, proje(y))
    yaz("nasil-calisiyoruz/", nasil())
    yaz("bilgi-merkezi/", bilgi())
    for y in MAKALELER:
        yaz(y, makale(y))
    yaz("iletisim/", iletisim())
    with open(os.path.join(KOK, "sitemap.xml"), "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + "".join(f"  <url><loc>{URL}{y}</loc><lastmod>{TARIH}</lastmod></url>\n" for y in SAYFA_SIRASI) + "</urlset>\n")
    print(f"{len(SAYFA_SIRASI)} sayfa + sitemap.xml yazıldı")


if __name__ == "__main__":
    main()
