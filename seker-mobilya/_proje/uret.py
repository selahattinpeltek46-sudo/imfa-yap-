#!/usr/bin/env python3
"""Şeker Mobilya sitesini üretir: 8 sayfa + sitemap.xml (Revizyon 1: Babacan Mobilya düzeni).

Metinler ve fotoğraf envanteri icerik.py'de (tek kaynak). Ortak parçalar
(üst çubuk, kapanış + mesaj hazırlayıcı, alt bilgi, schema) burada.
Çalıştır:  python3 seker-mobilya/_proje/uret.py          → siteyi yazar
           python3 seker-mobilya/_proje/uret.py --metin  → modul-2'nin 12. bölümünü yeniler
"""
import json
import os
import sys
from html import escape
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from icerik import (ANA, FOTO, H, ISLER, MESAJ_TURLERI, PUAN, SAYFA, SAYFA_SIRASI,  # noqa: E402
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
MENU = [(s, SAYFA[s]["menu"]) for s in SAYFA_SIRASI] + [("isler", "İşlerimiz")]
OK = '<svg class="ok-i" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
SIMGE = {
    "olcu": '<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    "ekip": '<path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    "konum": '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    "yildiz": '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
}


def e(s):
    return escape(s, quote=True)


def wa(metin):
    return f"https://wa.me/{WA}?text={quote(metin)}"


def simge(ad):
    return f'<svg class="simge" viewBox="0 0 24 24" aria-hidden="true">{SIMGE[ad]}</svg>'


def img(dosya, k, yukle="lazy"):
    return (f'<img src="{k}img/{dosya}.webp" width="{W}" height="{H}" alt="{e(FOTO[dosya][0])}" '
            f'loading="{yukle}" decoding="async">')


def tur_fotolari(tur):
    return [f for f, v in FOTO.items() if v[1] == tur]


def sayfa_fotolari(slug):
    p = SAYFA[slug]
    return p.get("fotolar") or tur_fotolari(p["tur"])


def kucuk(s):
    """Cümle içi küçük harf: 'Banyo' → 'banyo', 'TV ünitesi' olduğu gibi kalır."""
    if s[:2].isupper():
        return s
    return {"İ": "i", "I": "ı"}.get(s[0], s[0].lower()) + s[1:]


def ust_baslik(metin, sinif=""):
    return f'<p class="ust-baslik{(" " + sinif) if sinif else ""}">{e(metin)}</p>'


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
        "makesOffer": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": SAYFA[s]["ad"], "url": URL + s + "/"}} for s in SAYFA_SIRASI],
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
  <meta name="geo.region" content="TR-34">
  <meta name="geo.placename" content="Bahçelievler, İstanbul">
  <meta name="geo.position" content="{LAT};{LNG}">
  <meta name="theme-color" content="#1c1713">
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
<header class="ust{" ust--seffaf" if seffaf else ""}">
  <div class="ust__ic">
    <a class="marka" href="{k}" aria-label="Şeker Mobilya ana sayfa">
      <img src="{k}img/logo.png" width="44" height="44" alt="">
      <span><b>Şeker Mobilya</b><small>Yenibosna · Bahçelievler</small></span>
    </a>
    <button class="menu-dugme" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menü"><span></span><span></span></button>
    <nav id="menu" class="menu" aria-label="Ana menü">
      <ul>{menu}</ul>
      <a class="menu__eylem" href="#mesaj" data-olay="mesaja_git">Projenizi konuşalım</a>
    </nav>
  </div>
</header>
<main id="icerik">
"""


def kirinti(k, adlar):
    parca = [f'<a href="{k}">Ana sayfa</a>'] + [e(a) for a in adlar]
    return f'<nav class="kirinti" aria-label="Sayfa yolu">{" / ".join(parca)}</nav>'


def kapanis(k, secili):
    turler = "".join(
        f'<label class="secim"><input type="radio" name="tur" value="{e(t)}"{" checked" if t == secili else ""}><span>{e(t)}</span></label>'
        for t in MESAJ_TURLERI)
    ilk = f"Merhaba Şeker Mobilya, {kucuk(secili)} için bilgi almak istiyorum." if secili else "Merhaba Şeker Mobilya, bilgi almak istiyorum."
    ilk += "\nFotoğrafları bu mesajın ardından gönderiyorum."
    return f"""
<section class="kapanis" id="mesaj" aria-labelledby="mesaj-baslik">
  <div class="kap kapanis__ic">
    <div class="kapanis__metin">
      {ust_baslik(ANA["kapanis_ust"], "ust-baslik--acik")}
      <h2 id="mesaj-baslik">{e(ANA["kapanis_h2"])}</h2>
      <p class="kapanis__alt">{e(ANA["kapanis_p"])}</p>
      <ul class="kapanis__bilgi">
        <li>{simge("konum")}<span>Ahmet Yesevi Cd. No:120<br>34192 Yenibosna / Bahçelievler</span></li>
        <li>{simge("yildiz")}<span><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorumlar">Google'da {PUAN} · {YORUM} değerlendirme</a><small>{TARIH_OKUNUR}</small></span></li>
      </ul>
      <p class="kapanis__baglanti"><a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a><a href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi">Yol tarifi al</a><a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram">Instagram · @sekermobilya</a></p>
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
        <label><span>Semt</span><input type="text" name="ilce" autocomplete="address-level2" maxlength="60" placeholder="ör. Yenibosna, Şirinevler"></label>
        <label><span>Not <small>(isteğe bağlı)</small></span><input type="text" name="olcu" maxlength="80" placeholder="ör. duvar 3,20 m, makine yeri"></label>
      </div>
      <label class="onay"><input type="checkbox" name="foto" checked> Fotoğraf da göndereceğim</label>
      <div class="onizleme"><span>Gidecek mesaj</span><p aria-live="polite" data-onizleme>{e(ilk)}</p></div>
      <div class="hazirla__dugmeler">
        <a class="dugme dugme--acik" href="{e(wa(ilk))}" data-wa data-olay="whatsapp" target="_blank" rel="noopener">WhatsApp'ta gönder {OK}</a>
        <button class="dugme dugme--seffaf" type="button" data-kopyala>Mesajı kopyala</button>
      </div>
      <p class="hazirla__not">Bu kutuya yazdıklarınız bize iletilmez; yalnız mesaj metni hazırlanır. Gönder'e bastığınızda WhatsApp açılır, mesajı orada siz gönderirsiniz. WhatsApp kullanmıyorsanız arayın: <a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a></p>
    </form>
  </div>
</section>"""


def son(k):
    cozum = "".join(f'<li><a href="{k}{s}/">{e(SAYFA[s]["ad"])}</a></li>' for s in SAYFA_SIRASI)
    return f"""
</main>
<footer class="alt">
  <div class="kap alt__ic">
    <div class="alt__marka">
      <img src="{k}img/logo.png" width="64" height="64" alt="Şeker Mobilya logosu" loading="lazy">
      <p class="alt__ad">Şeker Mobilya</p>
      <p class="slogan">Evinize tat katıyoruz.</p>
      <p>{e(ADRES_SATIR)}<br><a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a></p>
    </div>
    <div><h2>Çözümler</h2><ul>{cozum}</ul></div>
    <div><h2>Firma</h2><ul>
      <li><a href="{k}isler/">Yaptığımız işler</a></li>
      <li><a href="{k}#surec">Nasıl çalışıyoruz</a></li>
      <li><a href="{k}#sss">Sık sorulanlar</a></li>
      <li><a href="{k}#konum">İletişim ve konum</a></li>
    </ul></div>
    <div><h2>Bu site hakkında</h2>
      <p>Fotoğrafların hepsi <a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram">@sekermobilya</a> hesabındaki paylaşımlardan; stok görsel yok.</p>
      <p>Site kendi çerezini kullanmaz ve sizden veri toplamaz; harita yalnız siz tıklayınca Google Haritalar'dan yüklenir.</p>
    </div>
  </div>
  <div class="kap alt__son">
    <span>© 2026 Şeker Mobilya — Yenibosna / Bahçelievler</span>
    <span><a href="{INSTAGRAM}" target="_blank" rel="noopener">Instagram</a> · <a href="{YOUTUBE}" target="_blank" rel="noopener">YouTube</a> · <a href="{HARITA}" target="_blank" rel="noopener" data-olay="harita">Google Haritalar</a></span>
  </div>
</footer>
<div class="alt-cubuk" aria-label="Hızlı iletişim">
  <a href="{e(wa('Merhaba Şeker Mobilya, bilgi almak istiyorum.'))}" data-wa-sabit data-olay="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
  <a href="tel:{TEL}" data-olay="telefon">Ara</a>
</div>
<script src="{k}js/ayarlar.js"></script>
<script src="{k}js/site.js" defer></script>
</body>
</html>
"""


def kart(slug, k, i):
    p = SAYFA[slug]
    n = len(sayfa_fotolari(slug))
    return (f'<li class="kart"><a class="kart__foto" href="{k}{slug}/" tabindex="-1" aria-hidden="true">{img(p["kapak"][0], k)}</a>'
            f'<div class="kart__govde"><span class="kart__no">{i:02d}</span><h3><a href="{k}{slug}/">{e(p["ad"])}</a></h3>'
            f'<p>{e(p["ozet"])}</p><div class="kart__alt"><a class="ok" href="#mesaj" data-sec-tur="{e(p["mesaj"])}" data-olay="mesaja_git">Bu iş için yazın {OK}</a>'
            f'<a class="kart__sayi" href="{k}{slug}/">{n} örneği görün</a></div></div></li>')


def sss_blok(sss):
    return "".join(f"<details><summary>{e(s)}</summary><p>{e(c)}</p></details>" for s, c in sss)


# ------------------------------------------------------------------ sayfalar
def ana_sayfa():
    k = ""
    duvar = "".join(f"<li>{img(f, k, 'eager' if i < 6 else 'lazy')}</li>" for i, f in enumerate(ANA["duvar"]))
    guven = "".join(f'<li>{simge(s)}<div><b>{e(b)}</b><span>{e(m.format(yorum=YORUM))}</span></div></li>' for s, b, m in ANA["guven"])
    ihtiyac = "".join(
        f'<li><h3>{e(b)}</h3><p>{e(m)}</p><a class="ok" href="#mesaj" data-sec-tur="{e(t)}" data-sec-kapsam="{e(kp)}" data-olay="mesaja_git">{e(l)} {OK}</a></li>'
        for b, m, l, t, kp in ANA["ihtiyac"])
    kartlar = "".join(kart(s, k, i + 1) for i, s in enumerate(SAYFA_SIRASI))
    surec = "".join(f"<li><span class=\"surec__no\">{i + 1:02d}</span><h3>{e(b)}</h3><p>{e(m)}</p></li>" for i, (b, m) in enumerate(ANA["surec"]))
    ozellik = "".join(f"<div><dt>{e(a)}</dt><dd>{e(d)}</dd></div>" for a, d in ANA["ozellik"])
    detay = "".join(f"<figure>{img(f, k)}<figcaption><b>{e(b)}</b>{e(n)}</figcaption></figure>" for f, b, n in ANA["detaylar"])
    satirlar = []
    for tur, ad in TURLER:
        slug = next(s for s in SAYFA_SIRASI if SAYFA[s]["tur"] == tur)
        fotolar = sayfa_fotolari(slug)
        satirlar.append(
            f'<div class="satir"><div class="satir__bas"><h3>{e(ad)}</h3><a href="{slug}/">Tüm {e(kucuk(ad))} işleri</a></div>'
            f'<ul class="satir__liste">' + "".join(f"<li><figure>{img(f, k)}<figcaption>{e(FOTO[f][0])}</figcaption></figure></li>" for f in fotolar) + "</ul></div>")
    govde = f"""
<section class="giris" aria-labelledby="giris-baslik">
  <ul class="giris__duvar" aria-hidden="true">{duvar}</ul>
  <div class="giris__perde" aria-hidden="true"></div>
  <div class="kap giris__ic">
    {ust_baslik(ANA["ust"], "ust-baslik--acik")}
    <h1 id="giris-baslik">{e(ANA["h1"])}</h1>
    <p class="giris__alt">{e(ANA["giris"])}</p>
    <div class="eylemler eylemler--orta">
      <a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">Projenizi konuşalım {OK}</a>
      <a class="dugme dugme--seffaf" href="isler/">Yaptığımız işler {OK}</a>
    </div>
    <p class="giris__not">{e(ANA["not"])}</p>
  </div>
</section>

<section class="guven" aria-label="Neden Şeker Mobilya"><ul class="kap guven__ic">{guven}</ul></section>

<section class="bolum" aria-labelledby="ihtiyac-baslik">
  <div class="kap">
    {ust_baslik(ANA["ihtiyac_ust"], "ust-baslik--orta")}
    <h2 id="ihtiyac-baslik" class="orta">{e(ANA["ihtiyac_h2"])}</h2>
    <ul class="ihtiyac">{ihtiyac}</ul>
  </div>
</section>

<section class="bolum bolum--panel" aria-labelledby="cozum-baslik">
  <div class="kap">
    {ust_baslik(ANA["cozum_ust"], "ust-baslik--orta")}
    <h2 id="cozum-baslik" class="orta">{e(ANA["cozum_h2"])}</h2>
    <p class="bolum__alt orta">{e(ANA["cozum_p"])}</p>
    <ul class="kartlar">{kartlar}</ul>
  </div>
</section>

<section class="bant" aria-labelledby="bant-baslik">
  <div class="kap orta">
    {ust_baslik(ANA["bant_ust"], "ust-baslik--orta")}
    <h2 id="bant-baslik">{e(ANA["bant_h2"])}</h2>
    <p class="bolum__alt">{e(ANA["bant_p"])}</p>
    <a class="dugme" href="#mesaj" data-olay="mesaja_git">Fotoğrafınızı gönderin {OK}</a>
  </div>
</section>

<section class="surec" id="surec" aria-labelledby="surec-baslik">
  <div class="kap">
    {ust_baslik(ANA["surec_ust"], "ust-baslik--acik")}
    <h2 id="surec-baslik">{e(ANA["surec_h2"])}</h2>
    <p class="surec__alt">{e(ANA["surec_alt"])}</p>
    <ol class="surec__liste">{surec}</ol>
    <p class="orta"><a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">İlk adımı atın {OK}</a></p>
  </div>
</section>

<section class="bolum" aria-labelledby="iscilik-baslik">
  <div class="kap iscilik">
    <figure class="iscilik__foto">{img(ANA["iscilik_foto"], k)}</figure>
    <div>
      {ust_baslik(ANA["iscilik_ust"])}
      <h2 id="iscilik-baslik">{e(ANA["iscilik_h2"])}</h2>
      <p class="iscilik__alt">{e(ANA["iscilik_alt"])}</p>
      <dl class="ozellik">{ozellik}</dl>
    </div>
  </div>
  <div class="kap">
    {ust_baslik("Detaylar")}
    <div class="detaylar">{detay}</div>
  </div>
</section>

<section class="bolum bolum--cizgi" aria-labelledby="isler-baslik">
  <div class="kap">
    {ust_baslik(ANA["isler_ust"], "ust-baslik--orta")}
    <h2 id="isler-baslik" class="orta">{e(ANA["isler_h2"])}</h2>
    <p class="bolum__alt orta">{e(ANA["isler_p"])}</p>
    {"".join(satirlar)}
    <p class="orta satir__son"><a class="dugme dugme--cizgi" href="isler/">{len(FOTO)} işin hepsini görün {OK}</a></p>
  </div>
</section>

<section class="bolum bolum--panel" id="konum" aria-labelledby="konum-baslik">
  <div class="kap konum">
    <div>
      {ust_baslik(ANA["konum_ust"])}
      <h2 id="konum-baslik">{e(ANA["konum_h2"])}</h2>
      <p class="konum__p">{e(ANA["konum_p"])}</p>
      <table class="tablo">
        <tr><th scope="row">Adres</th><td>{e(ADRES_SATIR)}</td></tr>
        <tr><th scope="row">Plus code</th><td>2R3Q+4H Bahçelievler</td></tr>
        <tr><th scope="row">Telefon</th><td><a href="tel:{TEL}" data-olay="telefon">{TEL_GORUNEN}</a></td></tr>
        <tr><th scope="row">Instagram</th><td><a href="{INSTAGRAM}" target="_blank" rel="noopener" data-olay="instagram">@sekermobilya</a></td></tr>
        <tr><th scope="row">Google</th><td><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorumlar">{PUAN} · {YORUM} değerlendirme</a></td></tr>
        <tr><th scope="row">Çalışma saati</th><td>Bugünkü saat <a href="{HARITA}" target="_blank" rel="noopener" data-olay="harita">Google Haritalar'da</a>; gelmeden önce arayın</td></tr>
      </table>
      <p class="ikinci-adres" data-ikinci-adres hidden></p>
      <div class="eylemler">
        <a class="dugme" href="{YOL}" target="_blank" rel="noopener" data-olay="yol_tarifi">Yol tarifi al {OK}</a>
        <a class="dugme dugme--cizgi" href="#mesaj" data-olay="mesaja_git">Mesaj yazın {OK}</a>
      </div>
    </div>
    <div class="harita" data-harita="{e(HARITA_GOMME)}">
      <button type="button" class="harita__dugme" data-olay="harita_yukle">Haritayı göster<small>Google Haritalar yüklenir</small></button>
    </div>
  </div>
</section>

<section class="bolum" id="sss" aria-labelledby="sss-baslik">
  <div class="kap sss">
    {ust_baslik(ANA["sss_ust"], "ust-baslik--orta")}
    <h2 id="sss-baslik" class="orta">{e(ANA["sss_h2"])}</h2>
    <div class="sss__liste">{sss_blok(ANA["sss"])}</div>
    <p class="orta"><a class="dugme dugme--cizgi" href="#mesaj" data-olay="mesaja_git">Sorunuzu yazın {OK}</a></p>
  </div>
</section>
{kapanis(k, "")}"""
    sema = ld(isletme(), {"@type": "WebSite", "@id": URL + "#site", "url": URL, "name": FIRMA, "inLanguage": "tr-TR"}, sss_ld(ANA["sss"]))
    return bas(k, "", ANA["title"], ANA["meta"], sema, seffaf=True) + govde + son(k)


def hizmet_sayfasi(slug):
    k = "../"
    p = SAYFA[slug]
    fotolar = sayfa_fotolari(slug)
    projeler = "".join(f"<figure>{img(f, k)}<figcaption>{e(FOTO[f][0])}</figcaption></figure>" for f in fotolar)
    bolumler = "".join(f"<div><h3>{e(h)}</h3><p>{e(m)}</p></div>" for h, m in p["bolumler"])
    hazirlik = "".join(f"<li>{e(h)}</li>" for h in p["hazirlik"])
    diger = "".join(kart(s, k, SAYFA_SIRASI.index(s) + 1) for s in p["ilgili"])
    a, b = p["kapak"]
    govde = f"""
<section class="sayfa-giris" aria-labelledby="sayfa-baslik">
  <div class="kap sayfa-giris__ic">
    <div>
      {kirinti(k, [p["ad"]])}
      {ust_baslik(p["ust"], "ust-baslik--acik")}
      <h1 id="sayfa-baslik">{e(p["h1"])}</h1>
      <p class="sayfa-giris__alt">{e(p["giris"])}</p>
      <div class="eylemler">
        <a class="dugme dugme--acik" href="#mesaj" data-olay="mesaja_git">Bu iş için yazın {OK}</a>
        <a class="dugme dugme--seffaf" href="#projeler">Tüm {e(kucuk(SAYFA[slug]["menu"]))} işleri {OK}</a>
      </div>
      <dl class="bilgi-serit">
        <div><dt>Bu sayfada</dt><dd>{len(fotolar)} gerçek iş fotoğrafı</dd></div>
        <div><dt>Google</dt><dd><a href="{HARITA}" target="_blank" rel="noopener" data-olay="yorumlar">{PUAN} · {YORUM} değerlendirme</a></dd></div>
        <div><dt>Hizmet</dt><dd>Ölçü · İmalat · Montaj</dd></div>
      </dl>
    </div>
    <div class="sayfa-giris__kolaj" aria-hidden="true">
      <figure class="kolaj-a">{img(a, k, "eager")}</figure>
      <figure class="kolaj-b">{img(b, k, "eager")}</figure>
    </div>
  </div>
</section>

<section class="bolum" id="projeler" aria-labelledby="projeler-baslik">
  <div class="kap">
    <div class="bolum__bas">
      <div>{ust_baslik("Gerçek projeler")}<h2 id="projeler-baslik">{e(p["proje_h2"])}</h2></div>
      <a href="{k}isler/#{p['tur']}">Galeride aç</a>
    </div>
    <div class="projeler">{projeler}</div>
  </div>
</section>

<section class="bolum bolum--panel" aria-labelledby="neler-baslik">
  <div class="kap iki-sutun">
    <div>
      {ust_baslik("Bu işlerde neler var")}
      <h2 id="neler-baslik">Ne yapıyoruz, nasıl yapıyoruz</h2>
      <div class="maddeler">{bolumler}</div>
    </div>
    <aside class="hazirlik" aria-labelledby="hazirlik-baslik">
      <h2 id="hazirlik-baslik">Ölçü gününden önce hazırlayabilecekleriniz</h2>
      <p>Bunlar zorunlu değil; ama ilk mesajda olursa konuşma çok daha hızlı ilerler.</p>
      <ol>{hazirlik}</ol>
      <a class="ok" href="#mesaj" data-olay="mesaja_git">Bunlarla birlikte yazın {OK}</a>
    </aside>
  </div>
</section>

<section class="bolum" aria-labelledby="sss-baslik">
  <div class="kap sss">
    {ust_baslik("S.S.S.", "ust-baslik--orta")}
    <h2 id="sss-baslik" class="orta">Merak edilenler.</h2>
    <div class="sss__liste">{sss_blok(p["sss"])}</div>
  </div>
</section>
{kapanis(k, p["mesaj"])}

<section class="bolum" aria-labelledby="diger-baslik">
  <div class="kap">
    {ust_baslik("Evin diğer odaları", "ust-baslik--orta")}
    <h2 id="diger-baslik" class="orta">Bunlara da bakın.</h2>
    <ul class="kartlar">{diger}</ul>
  </div>
</section>"""
    sema = ld(isletme(), hizmet_ld(slug), sss_ld(p["sss"]), kirinti_ld([("", "Ana sayfa"), (slug + "/", p["ad"])]))
    return bas(k, slug, p["title"], p["meta"], sema) + govde + son(k)


def isler_sayfasi():
    k = "../"
    filtre = '<button type="button" data-filtre="hepsi" aria-pressed="true">Hepsi</button>' + "".join(
        f'<button type="button" data-filtre="{t}" aria-pressed="false">{e(a)}</button>' for t, a in TURLER)
    sira = [t for t, _ in TURLER]
    kareler = sorted(FOTO, key=lambda f: sira.index(FOTO[f][1]))
    govde = f"""
<section class="sayfa-giris sayfa-giris--kisa" aria-labelledby="sayfa-baslik">
  <div class="kap">
    {kirinti(k, ["İşlerimiz"])}
    {ust_baslik(ISLER["ust"], "ust-baslik--acik")}
    <h1 id="sayfa-baslik">{e(ISLER["h1"])}</h1>
    <p class="sayfa-giris__alt">{e(ISLER["giris"])}</p>
  </div>
</section>
<section class="bolum" aria-label="Fotoğraflar">
  <div class="kap">
    <div class="filtre" role="group" aria-label="Oda türüne göre süz">{filtre}</div>
    <div class="projeler" data-galeri>{"".join(f'<figure class="kare" data-tur="{FOTO[f][1]}">{img(f, k)}<figcaption>{e(FOTO[f][0])}</figcaption></figure>' for f in kareler)}</div>
    <p class="sayac" data-sayac aria-live="polite"></p>
  </div>
</section>
{kapanis(k, "")}"""
    sema = ld(isletme(), kirinti_ld([("", "Ana sayfa"), ("isler/", "İşlerimiz")]))
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
    s.append(f"### Ana sayfa `/`\n- **Title:** {ANA['title']}\n- **Meta:** {ANA['meta']}\n- **Ön başlık:** {ANA['ust']}\n- **H1:** {ANA['h1']}\n- **Giriş:** {ANA['giris']} · *{ANA['not']}*")
    s.append("- **Güven şeridi:** " + " · ".join(f"**{b}** — {m.format(yorum=YORUM)}" for _, b, m in ANA["guven"]))
    s.append(f"- **H2 {ANA['ihtiyac_h2']}:** " + " · ".join(f"**{b}** — {m} ({l})" for b, m, l, _, _ in ANA["ihtiyac"]))
    s.append(f"- **H2 {ANA['cozum_h2']}:** {ANA['cozum_p']} (6 kart: sayfa adı + özet + \"Bu iş için yazın\" + örnek sayısı)")
    s.append(f"- **H2 {ANA['bant_h2']}:** {ANA['bant_p']}")
    s.append(f"- **H2 {ANA['surec_h2']}:** {ANA['surec_alt']} " + " → ".join(f"**{b}:** {m}" for b, m in ANA["surec"]))
    s.append(f"- **H2 {ANA['iscilik_h2']}:** {ANA['iscilik_alt']} " + " · ".join(f"**{a}:** {d}" for a, d in ANA["ozellik"]))
    s.append("- **Detaylar:** " + " · ".join(f"**{b}** — {n}" for _, b, n in ANA["detaylar"]))
    s.append(f"- **H2 {ANA['isler_h2']}:** {ANA['isler_p']}")
    s.append(f"- **H2 {ANA['konum_h2']}:** {ANA['konum_p']} (adres tablosu)")
    s.append(f"- **H2 {ANA['sss_h2']}:**\n" + "\n".join(f"  - *{q}* — {a}" for q, a in ANA["sss"]))
    s.append(f"- **H2 {ANA['kapanis_h2']}:** {ANA['kapanis_p']} · Mesaj notu: \"Bu kutuya yazdıklarınız bize iletilmez; yalnız mesaj metni hazırlanır. Gönder'e bastığınızda WhatsApp açılır, mesajı orada siz gönderirsiniz.\"")
    for slug in SAYFA_SIRASI:
        p = SAYFA[slug]
        s.append(f"\n### {p['ad']} `/{slug}/`\n- **Title:** {p['title']}\n- **Meta:** {p['meta']}\n- **Ön başlık:** {p['ust']}\n- **H1:** {p['h1']}\n- **Giriş:** {p['giris']}\n- **H2 {p['proje_h2']}:** {len(sayfa_fotolari(slug))} gerçek kare")
        for h3, m in p["bolumler"]:
            s.append(f"- **H3 {h3}:** {m}")
        s.append("- **H2 Ölçü gününden önce hazırlayabilecekleriniz:** " + " · ".join(p["hazirlik"]))
        s.append("- **SSS:**\n" + "\n".join(f"  - *{q}* — {a}" for q, a in p["sss"]))
    s.append(f"\n### İşlerimiz `/isler/`\n- **Title:** {ISLER['title']}\n- **Meta:** {ISLER['meta']}\n- **H1:** {ISLER['h1']}\n- **Giriş:** {ISLER['giris']}")
    s.append("\n### Ortak\n- Alt bilgi: \"Fotoğrafların hepsi @sekermobilya hesabındaki paylaşımlardan; stok görsel yok.\" · \"Site kendi çerezini kullanmaz ve sizden veri toplamaz; harita yalnız siz tıklayınca Google Haritalar'dan yüklenir.\"\n- Slogan (firmanın): \"Evinize tat katıyoruz.\"")
    s.append("<!-- METIN:SON -->")
    yeni = "\n".join(s)
    yol = os.path.join(KOK, "_proje", "modul-2-icerik-seo.md")
    md = open(yol, encoding="utf-8").read()
    a, b = md.index("<!-- METIN:BAS"), md.index("<!-- METIN:SON -->") + len("<!-- METIN:SON -->")
    open(yol, "w", encoding="utf-8").write(md[:a] + yeni + md[b:])
    print("modul-2 metin bölümü yenilendi")


if __name__ == "__main__":
    metin() if "--metin" in sys.argv else site()
