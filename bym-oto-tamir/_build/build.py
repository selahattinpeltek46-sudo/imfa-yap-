"""
BYM Automotive — statik site üreticisi.

Tüm HTML sayfaları, sitemap.xml ve assets/js/config.js bu betikle üretilir.
Firma bilgileri: _build/site.json   İçerikler: _build/icerik.py

Kullanım:  python3 _build/build.py
Üretilen dosyalar elle düzenlenmemelidir; değişiklikler kaynak dosyalarda yapılır.
"""
import json
import re
import sys
from datetime import date
from html import escape
from pathlib import Path

KOK = Path(__file__).resolve().parent
SITE = KOK.parent
sys.path.insert(0, str(KOK))

import icerik as I  # noqa: E402

CFG = json.loads((KOK / "site.json").read_text(encoding="utf-8"))
F = CFG["firma"]
M = CFG["medya"]
URL = CFG["site_url"].rstrip("/")
BUGUN = date.today().isoformat()
SAYFALAR = []  # sitemap için (yol, öncelik)


def e(s):
    return escape(str(s), quote=True)


def tr_upper(s):
    return s.replace("i", "İ").replace("ı", "I").upper()


def slugify(s):
    tr = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")
    return re.sub(r"[^a-z0-9]+", "-", s.translate(tr).lower()).strip("-")


def wa_link(mesaj):
    from urllib.parse import quote
    return f"https://wa.me/{F['whatsapp']}?text={quote(mesaj)}"


WA_GENEL = "Merhaba BYM Automotive, aracım için servis/randevu hakkında bilgi almak istiyorum."
ADRES_TEK = f"{F['adres']['sokak']}, {F['adres']['ilce']} / {F['adres']['il']}"


def ikon(ad, cls="ic"):
    return f'<svg class="{cls}" aria-hidden="true"><use href="#{ad}"></use></svg>'


# ---------------------------------------------------------------------------
# SVG SPRITE — sade çizgi ikonlar
# ---------------------------------------------------------------------------
SPRITE = """<svg xmlns="http://www.w3.org/2000/svg" style="display:none">
<symbol id="i-wrench" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></symbol>
<symbol id="i-scan" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4" width="19" height="14" rx="2"/><path d="M6 11h2.5l1.5-3 2.5 6 1.5-3H18"/><path d="M8 21h8"/></symbol>
<symbol id="i-engine" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 8V6h6v2"/><path d="M10 6V4"/><path d="M4 11h2V8h9l2 3h2v-1h2v6h-2v-1h-2l-2 3H8l-2-2H4z"/><path d="M2 11v4"/></symbol>
<symbol id="i-bolt" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 13.5h7L10 22l9-11.5h-7z"/></symbol>
<symbol id="i-disc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M17.5 5.5a8 8 0 0 1 2 4"/><path d="M12 5.5v1M12 17.5v1M5.5 12h1M17.5 12h1"/></symbol>
<symbol id="i-snow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/><path d="m9 3 3 2 3-2M9 21l3-2 3 2M3 9l2 3-2 3M21 9l-2 3 2 3"/></symbol>
<symbol id="i-gear" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><path d="M6 7v10M12 7v10M18 7v5H6"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></symbol>
<symbol id="i-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
<symbol id="i-arrow-l" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>
<symbol id="i-chev-l" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></symbol>
<symbol id="i-chev-r" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></symbol>
<symbol id="i-phone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></symbol>
<symbol id="i-wa" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.48-8.41"/></symbol>
<symbol id="i-cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4.5" width="18" height="16.5" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10h18"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
<symbol id="i-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></symbol>
<symbol id="i-car" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3v-5l2-5h14l2 5v5h-2"/><path d="M3 12h18"/><circle cx="7.5" cy="17" r="2"/><circle cx="16.5" cy="17" r="2"/><path d="M9.5 17h5"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></symbol>
<symbol id="i-insta" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></symbol>
<symbol id="i-fb" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></symbol>
</svg>"""

LOGO = f"""<span class="logo__mark" aria-hidden="true">BYM</span><span class="logo__words"><span class="logo__text">{F.get('logo_ust', 'AUTOMOTIVE')}</span><span class="logo__tag" lang="en">{F.get('tagline', '')}</span></span>"""

NAV = [
    ("Anasayfa", "", "home"),
    ("Hizmetler", "hizmetler/", "hizmetler"),
    ("Hakkımızda", "hakkimizda/", "hakkimizda"),
    ("Servis Süreci", "#surec", "surec"),
    ("BYM Garage", "#garage", "garage"),
    ("İletişim", "iletisim/", "iletisim"),
]


# ---------------------------------------------------------------------------
# ŞABLON PARÇALARI
# ---------------------------------------------------------------------------
def head(r, yol, baslik, aciklama, schema=None, robots="index,follow", og_img=None):
    canonical = f"{URL}/{yol}"
    og = f"{URL}/assets/media/{og_img or 'og-bym-oto-tamir.jpg'}"
    ld = ""
    for s in (schema or []):
        ld += '<script type="application/ld+json">' + json.dumps(s, ensure_ascii=False, separators=(",", ":")) + "</script>\n"
    return f"""<!DOCTYPE html>
<html lang="tr" data-root="{r}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(baslik)}</title>
<meta name="description" content="{e(aciklama)}">
<meta name="robots" content="{robots}">
<link rel="canonical" href="{canonical}">
<meta name="theme-color" content="#0B0B0C">
<meta property="og:type" content="website">
<meta property="og:locale" content="tr_TR">
<meta property="og:site_name" content="{e(F['ad'])}">
<meta property="og:title" content="{e(baslik)}">
<meta property="og:description" content="{e(aciklama)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="{r}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800&family=Geist+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{r}assets/css/site.css">
{ld}</head>
"""


def header(r, aktif):
    items = ""
    for ad, href, key in NAV:
        link = f"{r}{href}" if not href.startswith("#") else f"{r}{href}"
        cur = ' aria-current="page"' if key == aktif else ""
        items += f'<li><a href="{link}"{cur}>{ad}</a></li>'
    banner = ""
    if CFG.get("onizleme"):
        banner = f'<div class="preview-bar" role="note">{e(CFG.get("onizleme_metni", "Önizleme sürümü"))}</div>'
    return f"""<body>
<a class="skip" href="#icerik">İçeriğe geç</a>
{banner}
<header class="hdr" data-header>
  <div class="wrap hdr__in">
    <a class="logo" href="{r}" aria-label="{e(F['ad'])} anasayfa">{LOGO}</a>
    <nav class="nav" id="menu" aria-label="Ana menü" data-nav>
      <ul>{items}</ul>
      <div class="nav__foot">
        <a class="btn btn--accent btn--block" href="{r}randevu/">Randevu Al {ikon('i-arrow')}</a>
        <a class="nav__tel" href="tel:{F['telefon_link']}">{ikon('i-phone')} {e(F['telefon_gorunen'])}</a>
      </div>
    </nav>
    <div class="hdr__actions">
      <a class="btn btn--accent btn--sm hdr__cta" href="{r}randevu/">Randevu Al</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menüyü aç" data-menu-btn>
        <span></span><span></span>
      </button>
    </div>
  </div>
</header>
"""


def footer(r):
    saatler = "".join(f"<li><span>{e(s['gunler'])}</span><span>{e(s['saat'])}</span></li>" for s in F["calisma_saatleri"])
    sosyal = ""
    if F.get("instagram"):
        sosyal += f'<a href="{e(F["instagram"])}" aria-label="Instagram" rel="noopener" target="_blank">{ikon("i-insta")}</a>'
    if F.get("facebook"):
        sosyal += f'<a href="{e(F["facebook"])}" aria-label="Facebook" rel="noopener" target="_blank">{ikon("i-fb")}</a>'
    if not sosyal:
        sosyal = '<span class="muted small">Sosyal medya hesapları eklenecek</span>'
    harita = f"https://www.google.com/maps/search/?api=1&query={e(F['harita_sorgu']).replace(' ', '+')}"
    return f"""
<footer class="ftr">
  <div class="wrap">
    <div class="ftr__top">
      <div class="ftr__brand">
        <a class="logo" href="{r}" aria-label="{e(F['ad'])} anasayfa">{LOGO}</a>
        <p>Profesyonel bakım, doğru teşhis,<br>şeffaf servis deneyimi.</p>
        <p class="ftr__tag mono" lang="en">{e(F.get('tagline', ''))}</p>
        <div class="ftr__social">{sosyal}</div>
      </div>
      <nav class="ftr__col" aria-label="Hızlı menü">
        <h2 class="ftr__h">Hızlı Menü</h2>
        <ul>
          <li><a href="{r}hizmetler/">Hizmetler</a></li>
          <li><a href="{r}randevu/">Randevu</a></li>
          <li><a href="{r}hakkimizda/">Hakkımızda</a></li>
          <li><a href="{r}markalar/">Markalar</a></li>
          <li><a href="{r}blog/">Bilgi Merkezi</a></li>
          <li><a href="{r}iletisim/">İletişim</a></li>
        </ul>
      </nav>
      <div class="ftr__col">
        <h2 class="ftr__h">İletişim</h2>
        <ul class="ftr__contact">
          <li><a href="tel:{F['telefon_link']}">{ikon('i-phone')} {e(F['telefon_gorunen'])}</a></li>
          <li><a href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener">{ikon('i-wa')} {e(F.get('whatsapp_gorunen', 'WhatsApp'))}</a></li>
          <li><a href="{harita}" target="_blank" rel="noopener">{ikon('i-pin')} {e(ADRES_TEK)}</a></li>
        </ul>
      </div>
      <div class="ftr__col">
        <h2 class="ftr__h">Çalışma Saatleri</h2>
        <ul class="ftr__hours">{saatler}</ul>
      </div>
    </div>
    <div class="ftr__bottom">
      <span>© {date.today().year} {e(F['ad'])}</span>
      <span><a href="{r}kvkk/">KVKK Aydınlatma Metni</a></span>
    </div>
  </div>
</footer>

<nav class="actionbar" aria-label="Hızlı iletişim">
  <a href="tel:{F['telefon_link']}">{ikon('i-phone')}<span>Ara</span></a>
  <a href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" data-wa>{ikon('i-wa')}<span>WhatsApp</span></a>
  <a class="actionbar__main" href="{r}randevu/">{ikon('i-cal')}<span>Randevu</span></a>
</nav>
<a class="wa-float" href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" aria-label="WhatsApp ile yazın" data-wa>{ikon('i-wa')}</a>
{SPRITE}
<script type="module" src="{r}assets/js/main.js"></script>
</body>
</html>
"""


def breadcrumb(r, parcalar):
    """parcalar: [(ad, yol), ...] — son öğe mevcut sayfa."""
    li = f'<li><a href="{r}">Anasayfa</a></li>'
    for i, (ad, yol) in enumerate(parcalar):
        if i == len(parcalar) - 1:
            li += f'<li aria-current="page">{e(ad)}</li>'
        else:
            li += f'<li><a href="{r}{yol}">{e(ad)}</a></li>'
    return f'<nav class="crumbs" aria-label="Sayfa yolu"><ol>{li}</ol></nav>'


def breadcrumb_schema(parcalar):
    items = [{"@type": "ListItem", "position": 1, "name": "Anasayfa", "item": f"{URL}/"}]
    for i, (ad, yol) in enumerate(parcalar, start=2):
        items.append({"@type": "ListItem", "position": i, "name": ad, "item": f"{URL}/{yol}"})
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": items}


def business_schema():
    hours = []
    for s in F["calisma_saatleri"]:
        if s["schema_gunler"]:
            hours.append({"@type": "OpeningHoursSpecification", "dayOfWeek": s["schema_gunler"], "opens": s["acilis"], "closes": s["kapanis"]})
    same = [u for u in (F.get("instagram"), F.get("facebook")) if u]
    d = {
        "@context": "https://schema.org",
        "@type": "AutoRepair",
        "@id": f"{URL}/#isletme",
        "name": F["ad"],
        "alternateName": F.get("diger_adlar", [F.get("google_adi", F["ad"])]),
        "slogan": F.get("tagline", ""),
        "url": f"{URL}/",
        "image": f"{URL}/assets/media/og-bym-oto-tamir.jpg",
        "telephone": F["telefon_link"],
        "priceRange": "₺₺",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": F["adres"]["sokak"],
            "addressLocality": F["adres"]["ilce"],
            "addressRegion": F["adres"]["il"],
            "postalCode": F["adres"]["posta_kodu"],
            "addressCountry": F["adres"]["ulke"],
        },
        "geo": {"@type": "GeoCoordinates", "latitude": F["konum"]["enlem"], "longitude": F["konum"]["boylam"]},
        "areaServed": [{"@type": "City", "name": "Göksun"}, {"@type": "AdministrativeArea", "name": "Kahramanmaraş"}],
        "openingHoursSpecification": hours,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Oto servis hizmetleri",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": h["ad"], "url": f"{URL}/hizmetler/{h['slug']}/"}}
                for h in I.HIZMETLER
            ],
        },
    }
    if same:
        d["sameAs"] = same
    return d


def yaz(yol, html, oncelik="0.6"):
    """yol: 'hizmetler/klima/' gibi; '' = anasayfa."""
    hedef = SITE / yol / "index.html" if not yol.endswith(".html") else SITE / yol
    hedef.parent.mkdir(parents=True, exist_ok=True)
    hedef.write_text(html, encoding="utf-8")
    if oncelik:
        SAYFALAR.append((yol, oncelik))


def rel(yol):
    derinlik = yol.count("/") if not yol.endswith(".html") else yol.count("/")
    return "../" * derinlik


# ---------------------------------------------------------------------------
# ORTAK BÖLÜMLER
# ---------------------------------------------------------------------------
def booking_block(r, h_tag="h2", baslik_id="randevu-baslik"):
    return f"""
<div class="booking-shell">
  <div class="booking-intro reveal">
    <p class="eyebrow">Online randevu</p>
    <{h_tag} id="{baslik_id}" class="h-xl">Servis Randevunuzu Oluşturun</{h_tag}>
    <p class="lead">Size uygun günü ve saati seçin,<br class="br-d"> servise gelmeden önce randevunuzu planlayın.</p>
    <ul class="booking-points">
      <li>{ikon('i-tick')} Yaklaşık 1 dakika sürer</li>
      <li>{ikon('i-tick')} Müsait saatleri anında görün</li>
      <li>{ikon('i-tick')} Randevu bilgileriniz WhatsApp ile de iletilebilir</li>
    </ul>
    <p class="booking-alt">Telefonla randevu için <a href="tel:{F['telefon_link']}">{e(F['telefon_gorunen'])}</a></p>
  </div>
  <div class="booking reveal" data-booking aria-live="polite">
    <noscript><p class="booking__noscript">Randevu sihirbazı için JavaScript gereklidir. Randevu almak için <a href="{wa_link(WA_GENEL)}">WhatsApp</a> veya <a href="tel:{F['telefon_link']}">telefon</a> ile ulaşabilirsiniz.</p></noscript>
    <div class="booking__skeleton" aria-hidden="true"></div>
  </div>
</div>"""


def cta_final(r):
    return f"""
<section class="final" aria-labelledby="final-baslik">
  <div class="wrap final__in reveal">
    <h2 id="final-baslik" class="h-display">Aracınızın bakımını<br>ertelemeyin.</h2>
    <p class="lead">Size uygun zamanı seçin,<br class="br-m"> randevunuzu oluşturun.</p>
    <div class="btn-row">
      <a class="btn btn--accent btn--lg" href="{r}randevu/">Randevu Al {ikon('i-arrow')}</a>
      <a class="btn btn--ghost btn--lg" href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" data-wa>{ikon('i-wa')} WhatsApp'tan Ulaş</a>
    </div>
    <p class="final__sign">{e(F['ad'])} · <span lang="en">{e(F.get('tagline', ''))}</span></p>
  </div>
</section>"""


def contact_block(r):
    saatler = "".join(f"<li><span>{e(s['gunler'])}</span><strong>{e(s['saat'])}</strong></li>" for s in F["calisma_saatleri"])
    from urllib.parse import quote
    q = quote(F["harita_sorgu"])
    return f"""
<section class="contact" id="iletisim" aria-labelledby="iletisim-baslik">
  <div class="wrap contact__grid">
    <div class="contact__info reveal">
      <p class="eyebrow">İletişim</p>
      <h2 id="iletisim-baslik" class="h-xl">Göksun'da<br>BYM Automotive</h2>
      <p class="muted">Tabelanın üzerindeki kırmızı aracı gördüğünüzde doğru yerdesiniz.</p>
      <dl class="nap">
        <div><dt>{ikon('i-pin')} Adres</dt><dd>{e(ADRES_TEK)}</dd></div>
        <div><dt>{ikon('i-phone')} Telefon</dt><dd><a href="tel:{F['telefon_link']}">{e(F['telefon_gorunen'])}</a></dd></div>
        <div><dt>{ikon('i-wa')} WhatsApp</dt><dd><a href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" data-wa>{e(F.get('whatsapp_gorunen', 'Mesaj gönderin'))}</a></dd></div>
        <div><dt>{ikon('i-clock')} Çalışma saatleri</dt><dd><ul class="hours">{saatler}</ul></dd></div>
      </dl>
      <div class="btn-row">
        <a class="btn btn--light" href="https://www.google.com/maps/dir/?api=1&amp;destination={q}" target="_blank" rel="noopener">{ikon('i-pin')} Yol Tarifi Al</a>
        <a class="btn btn--ghost" href="{r}randevu/">Randevu Al</a>
      </div>
    </div>
    <div class="map reveal" data-map data-src="https://maps.google.com/maps?q={q}&amp;z=15&amp;output=embed">
      <img src="{r}assets/media/{M['hakkimizda']['src']}" alt="" width="{M['hakkimizda']['w']}" height="{M['hakkimizda']['h']}" loading="lazy" decoding="async">
      <button type="button" class="map__btn" data-map-load>{ikon('i-pin')} Haritayı göster</button>
    </div>
  </div>
</section>"""


def service_cards(r, liste=None, baslik_tag="h3"):
    out = ""
    for i, h in enumerate(liste or I.HIZMETLER):
        out += f"""
    <a class="svc reveal" href="{r}hizmetler/{h['slug']}/" style="--d:{(i % 4) * 60}ms">
      <span class="svc__ic">{ikon(h['ikon'])}</span>
      <{baslik_tag} class="svc__t">{e(h['ad'])}</{baslik_tag}>
      <p class="svc__p">{e(h['ozet'])}</p>
      <span class="svc__more">Detaylı İncele {ikon('i-arrow')}</span>
    </a>"""
    return out


def blog_cards(r, liste, baslik_tag="h3"):
    out = ""
    for p in liste:
        out += f"""
    <article class="post-card reveal">
      <a href="{r}blog/{p['slug']}/">
        <span class="post-card__meta">{p['okuma']} dk okuma</span>
        <{baslik_tag} class="post-card__t">{e(p['baslik'])}</{baslik_tag}>
        <p>{e(p['ozet'])}</p>
        <span class="link-arrow">Yazıyı oku {ikon('i-arrow')}</span>
      </a>
    </article>"""
    return out


def page_hero(r, parcalar, eyebrow, h1, lead, extra=""):
    return f"""
<section class="phero">
  <div class="wrap">
    {breadcrumb(r, parcalar)}
    <p class="eyebrow">{e(eyebrow)}</p>
    <h1 class="h-display h-display--page">{h1}</h1>
    <p class="lead phero__lead">{lead}</p>
    {extra}
  </div>
</section>"""


# ---------------------------------------------------------------------------
# ANASAYFA
# ---------------------------------------------------------------------------
def anasayfa():
    yol, r = "", ""
    hero = M["hero"]
    if hero.get("video"):
        sources = ""
        if hero.get("video_webm"):
            sources += f'<source src="{r}assets/media/{hero["video_webm"]}" type="video/webm">'
        sources += f'<source src="{r}assets/media/{hero["video"]}" type="video/mp4">'
        media = f'<video class="hero__media" autoplay muted loop playsinline preload="metadata" poster="{r}assets/media/{hero["poster"]}" aria-hidden="true" data-hero-video>{sources}</video>'
    else:
        media = f'<img class="hero__media hero__media--still" src="{r}assets/media/{hero["poster"]}" alt="{e(hero["alt"])}" fetchpriority="high" decoding="async">'

    guven_hero = "".join(f"<li>{ikon('i-tick')}{e(g)}</li>" for g in I.GUVEN)
    guven_band = "".join(
        f'<li class="reveal" style="--d:{i*50}ms"><span class="mono">{i+1:02d}</span>{e(g)}</li>'
        for i, g in enumerate(["Profesyonel Servis", "Şeffaf Süreç", "Randevulu Çalışma", "Teknik Teşhis", "Müşteri Onayı", "Kontrollü Teslim"])
    )
    neden = "".join(
        f"""<article class="why reveal" style="--d:{i*70}ms"><span class="why__n mono">{i+1:02d}</span><h3 class="why__t">{e(tr_upper(t))}</h3><p>{e(p)}</p></article>"""
        for i, (t, p) in enumerate(I.NEDEN)
    )
    sorunlar = "".join(
        f"""<li class="reveal" style="--d:{(i%4)*50}ms"><a class="issue" href="{r}hizmetler/{s['hizmet']}/"><span class="issue__t">{e(s['baslik'])}</span><span class="issue__cta">Bu sorunu incele {ikon('i-arrow')}</span></a></li>"""
        for i, s in enumerate(I.SORUNLAR)
    )
    surec = "".join(
        f"""<li class="step reveal" style="--d:{i*70}ms"><span class="step__n mono">{i+1:02d}</span><h3 class="step__t">{e(tr_upper(t))}</h3><p>{e(p)}</p></li>"""
        for i, (t, p) in enumerate(I.SUREC)
    )
    markalar = "".join(f'<li><a href="{r}markalar/{slugify(m)}/">{e(m)}</a></li>' for m in CFG["markalar"]["liste"])
    garaj = ""
    for i, g in enumerate(M["garaj"]):
        garaj += f"""<figure class="g-item g-item--{i+1} reveal" style="--d:{(i%3)*60}ms"><button type="button" class="g-btn" data-lightbox="{i}" aria-label="Fotoğrafı büyüt: {e(g['alt'])}"><img src="{r}assets/media/{g['src']}" alt="{e(g['alt'])}" width="{g['w']}" height="{g['h']}" loading="lazy" decoding="async"></button><figcaption>{e(g['etiket'])}</figcaption></figure>"""
    yorumlar = reviews_block(r)

    html = head(r, yol, "BYM Automotive | Göksun Oto Servis, Bakım ve Onarım",
                "BYM Automotive (BYM Servis); Göksun'da periyodik bakım, arıza tespiti, motor, mekanik ve oto servis hizmetleriyle aracınız için profesyonel çözümler sunar.",
                schema=[business_schema(), {"@context": "https://schema.org", "@type": "WebSite", "name": F["ad"], "url": f"{URL}/"}])
    html += header(r, "home")
    html += f"""
<main id="icerik">

<section class="hero" aria-labelledby="hero-baslik">
  <div class="hero__bg" data-parallax>{media}</div>
  <div class="hero__shade" aria-hidden="true"></div>
  <div class="wrap hero__in">
    <p class="eyebrow hero__eyebrow"><span class="dot" aria-hidden="true"></span><span lang="en">{e(F.get('tagline', ''))}</span><span class="hero__loc">· Göksun</span></p>
    <h1 id="hero-baslik" class="hero__h">
      <span class="line"><span>ARACINIZ İÇİN</span></span>
      <span class="line"><span>DOĞRU TEŞHİS.</span></span>
      <span class="line"><span class="silver">DOĞRU İŞLEM.</span></span>
    </h1>
    <p class="hero__p">Profesyonel bakım, arıza tespiti ve onarım hizmetlerinde<br class="br-d"> şeffaf ve planlı servis deneyimi.</p>
    <div class="btn-row hero__btns">
      <a class="btn btn--accent btn--lg" href="#randevu">Randevu Al {ikon('i-arrow')}</a>
      <a class="btn btn--glass btn--lg" href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" data-wa>{ikon('i-wa')} WhatsApp'tan Ulaş</a>
    </div>
    <ul class="hero__trust">{guven_hero}</ul>
  </div>
</section>

<section class="section section--booking" id="randevu" aria-labelledby="randevu-baslik">
  <div class="wrap">{booking_block(r)}</div>
</section>

<section class="band" aria-label="Çalışma prensiplerimiz">
  <ul class="wrap band__list">{guven_band}</ul>
</section>

<section class="section" aria-labelledby="neden-baslik">
  <div class="wrap why-grid">
    <div class="why-head reveal">
      <p class="eyebrow">Neden BYM?</p>
      <h2 id="neden-baslik" class="h-xl">Serviste güven,<br><span class="silver">işlemde şeffaflık.</span></h2>
      <p class="muted">Aracınızı bıraktığınız andan teslim aldığınız ana kadar ne yapıldığını bilirsiniz.</p>
    </div>
    <div class="why-cards">{neden}</div>
  </div>
</section>

<section class="section section--alt" id="hizmetler" aria-labelledby="hizmet-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Hizmetler</p>
        <h2 id="hizmet-baslik" class="h-xl">Aracınız için<br>gereken servis.</h2>
      </div>
      <a class="link-arrow" href="{r}hizmetler/">Tüm hizmetler {ikon('i-arrow')}</a>
    </div>
    <div class="svc-grid">{service_cards(r)}</div>
  </div>
</section>

<section class="section" aria-labelledby="sorun-baslik">
  <div class="wrap issues">
    <div class="issues__head reveal">
      <p class="eyebrow">Hızlı yönlendirme</p>
      <h2 id="sorun-baslik" class="h-xl">Aracınızda<br>ne var?</h2>
      <p class="muted">Belirtiyi seçin, ilgili servisi ve olası nedenleri inceleyin. Emin değilseniz randevuda açıklama olarak yazabilirsiniz.</p>
      <a class="btn btn--ghost" href="{r}randevu/?hizmet=ariza-kontrolu">Arıza kontrolü için randevu {ikon('i-arrow')}</a>
    </div>
    <ul class="issue-list">{sorunlar}</ul>
  </div>
</section>

<section class="section section--alt" id="surec" aria-labelledby="surec-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Servis süreci</p>
        <h2 id="surec-baslik" class="h-xl">BYM'de servis süreci<br>nasıl ilerliyor?</h2>
      </div>
    </div>
    <ol class="timeline" data-timeline>{surec}</ol>
  </div>
</section>

<section class="section section--tight" aria-labelledby="marka-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Markalar</p>
        <h2 id="marka-baslik" class="h-lg">Hizmet Verdiğimiz Markalar</h2>
      </div>
      <a class="link-arrow" href="{r}markalar/">Tüm markalar {ikon('i-arrow')}</a>
    </div>
    <ul class="brands reveal">{markalar}</ul>
  </div>
</section>

<section class="section section--alt" id="garage" aria-labelledby="garaj-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Servisten gerçek görüntüler</p>
        <h2 id="garaj-baslik" class="h-xl garage-title">BYM GARAGE</h2>
      </div>
      <p class="muted sec-head__note">Stok fotoğraf yok. Gördüğünüz her kare BYM servisinden.</p>
    </div>
    <div class="garage" data-gallery>{garaj}</div>
  </div>
</section>

{yorumlar}

<section class="section section--alt" aria-labelledby="blog-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Bilgi merkezi</p>
        <h2 id="blog-baslik" class="h-xl">BYM Otomotiv<br>Bilgi Merkezi</h2>
      </div>
      <a class="link-arrow" href="{r}blog/">Tüm yazılar {ikon('i-arrow')}</a>
    </div>
    <div class="post-grid">{blog_cards(r, I.BLOG[:3])}</div>
  </div>
</section>

{cta_final(r)}
{contact_block(r)}
</main>
"""
    html += lightbox_data(r)
    html += footer(r)
    yaz(yol, html, "1.0")


def reviews_block(r):
    liste = CFG["yorumlar"]["liste"]
    if liste:
        kart = ""
        for y in liste:
            yildiz = ikon("i-star") * int(y.get("puan", 5))
            arac = f'<span class="rev__car">{e(y["arac"])}</span>' if y.get("arac") else ""
            link = f'<a class="rev__src" href="{e(y["link"])}" target="_blank" rel="noopener">Google\'da görüntüle</a>' if y.get("link") else ""
            kart += f"""<figure class="rev reveal"><div class="rev__stars" aria-label="{y.get('puan',5)} yıldız">{yildiz}</div><blockquote>{e(y['metin'])}</blockquote><figcaption><strong>{e(y['isim'])}</strong>{arac}{link}</figcaption></figure>"""
        icerik = f'<div class="rev-grid">{kart}</div>'
    else:
        puan = ""
        dolu = int(float(str(F.get("google_puan", "5")).replace(",", ".")))
        yildizlar = ikon("i-star") * dolu + ikon("i-star", "ic is-dim") * (5 - dolu)
        if F.get("google_puan"):
            puan = f'<p class="rev-empty__score"><strong>{e(F["google_puan"])}</strong><span>/ 5 · Google\'da {F.get("google_yorum_sayisi", "")} yorum</span></p>'
        icerik = f"""
    <div class="rev-empty reveal">
      <div class="rev-empty__stars" aria-hidden="true">{yildizlar}</div>
      {puan}
      <p class="rev-empty__t">Müşterilerimizin gerçek yorumlarını Google'da okuyun.</p>
      <p class="muted">Sitemizde yalnızca Google İşletme Profili'mizdeki gerçek yorumlara yer veriyoruz.</p>
      <a class="btn btn--light" href="{e(F['google_yorum_link'])}" target="_blank" rel="noopener">Google yorumlarını gör {ikon('i-arrow')}</a>
    </div>"""
    return f"""
<section class="section" aria-labelledby="yorum-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Yorumlar</p>
        <h2 id="yorum-baslik" class="h-xl">Müşterilerimizin<br>deneyimi</h2>
      </div>
    </div>
    {icerik}
  </div>
</section>"""


def lightbox_data(r):
    data = [{"src": f"{r}assets/media/{g['src']}", "alt": g["alt"], "etiket": g["etiket"]} for g in M["garaj"]]
    return f'<script type="application/json" id="gallery-data">{json.dumps(data, ensure_ascii=False)}</script>\n'


# ---------------------------------------------------------------------------
# HİZMETLER
# ---------------------------------------------------------------------------
def hizmetler_index():
    yol = "hizmetler/"
    r = rel(yol)
    parca = [("Hizmetler", yol)]
    html = head(r, yol, "Oto Servis Hizmetleri | BYM Automotive",
                "Periyodik bakım, bilgisayarlı arıza tespiti, motor, oto elektrik, fren, klima ve şanzıman hizmetleri. BYM Automotive'de online randevu.",
                schema=[breadcrumb_schema(parca)])
    html += header(r, "hizmetler")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Hizmetler", "Aracınız için<br>gereken servis.", "Bakımdan arıza tespitine, motor ve mekanikten klimaya kadar aracınızın ihtiyaç duyduğu servisleri tek yerde planlayın.")}
<section class="section section--flush-top">
  <div class="wrap"><div class="svc-grid">{service_cards(r, baslik_tag="h2")}</div></div>
</section>
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.9")


def hizmet_sayfasi(h):
    yol = f"hizmetler/{h['slug']}/"
    r = rel(yol)
    parca = [("Hizmetler", "hizmetler/"), (h["ad"], yol)]
    from urllib.parse import quote
    wa = wa_link(f"Merhaba BYM Automotive, {h['ad']} hizmeti hakkında bilgi almak istiyorum.")
    kapsam = "".join(f"<li>{ikon('i-tick')}<span>{e(k)}</span></li>" for k in h["kapsam"])
    belirti = "".join(
        f'<li><a href="{r}randevu/?hizmet={h["randevu"]}&amp;not={quote(b)}"><span>{e(b)}</span>{ikon("i-arrow")}</a></li>'
        for b in h["belirtiler"])
    sss = "".join(f"<details class=\"faq\"><summary>{e(q)}<span aria-hidden=\"true\"></span></summary><p>{e(a)}</p></details>" for q, a in h["sss"])
    surec = "".join(f'<li><span class="mono">{i+1:02d}</span>{e(t)}</li>' for i, (t, _) in enumerate(I.SUREC))
    diger = [x for x in I.HIZMETLER if x["slug"] != h["slug"]][:4]
    ilgili_blog = [p for p in I.BLOG if p["hizmet"] == h["slug"]]
    blog_html = ""
    if ilgili_blog:
        blog_html = f"""
<section class="section section--tight">
  <div class="wrap">
    <h2 class="h-lg">İlgili yazılar</h2>
    <div class="post-grid post-grid--sm">{blog_cards(r, ilgili_blog)}</div>
  </div>
</section>"""
    schema = [
        breadcrumb_schema(parca),
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": h["ad"],
            "serviceType": h["ad"],
            "description": h["seo_aciklama"],
            "url": f"{URL}/{yol}",
            "provider": {"@id": f"{URL}/#isletme", "@type": "AutoRepair", "name": F["ad"]},
            "areaServed": {"@type": "City", "name": "Göksun"},
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in h["sss"]],
        },
    ]
    html = head(r, yol, h["seo_baslik"], h["seo_aciklama"], schema=schema)
    html += header(r, "hizmetler")
    extra = f"""<div class="btn-row">
      <a class="btn btn--accent btn--lg" href="{r}randevu/?hizmet={h['randevu']}">Bu hizmet için randevu al {ikon('i-arrow')}</a>
      <a class="btn btn--ghost btn--lg" href="{wa}" target="_blank" rel="noopener" data-wa>{ikon('i-wa')} WhatsApp</a>
    </div>"""
    html += f"""<main id="icerik">
{page_hero(r, parca, "Hizmet", e(h['ad']), e(h['giris']), extra)}
<section class="section section--flush-top">
  <div class="wrap detail">
    <div class="detail__main">
      <div class="panel reveal">
        <h2 class="h-md">Bu hizmet neleri kapsar?</h2>
        <ul class="checklist">{kapsam}</ul>
        <p class="note">Aracınıza hangi işlemlerin gerektiği kontrol sonrası belirlenir. Yapılacak işlemler ve parçalar size işlem öncesinde bildirilir; onayınız olmadan ek işlem yapılmaz.</p>
      </div>
      <div class="panel reveal">
        <h2 class="h-md">Hangi durumlarda gelmelisiniz?</h2>
        <p class="muted small">Belirtiye tıklayarak açıklaması hazır bir randevu oluşturabilirsiniz.</p>
        <ul class="symptoms">{belirti}</ul>
      </div>
      <div class="panel reveal">
        <h2 class="h-md">Sık sorulan sorular</h2>
        <div class="faqs">{sss}</div>
      </div>
    </div>
    <aside class="detail__side">
      <div class="side-card reveal">
        <p class="eyebrow">Servis süreci</p>
        <ol class="mini-steps">{surec}</ol>
        <a class="btn btn--accent btn--block" href="{r}randevu/?hizmet={h['randevu']}">Randevu Al {ikon('i-arrow')}</a>
        <a class="side-card__tel" href="tel:{F['telefon_link']}">{ikon('i-phone')} {e(F['telefon_gorunen'])}</a>
      </div>
    </aside>
  </div>
</section>
{blog_html}
<section class="section section--alt">
  <div class="wrap">
    <div class="sec-head"><div><h2 class="h-lg">Diğer hizmetler</h2></div><a class="link-arrow" href="{r}hizmetler/">Tümü {ikon('i-arrow')}</a></div>
    <div class="svc-grid">{service_cards(r, diger)}</div>
  </div>
</section>
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.8")


# ---------------------------------------------------------------------------
# RANDEVU
# ---------------------------------------------------------------------------
def randevu():
    yol = "randevu/"
    r = rel(yol)
    parca = [("Randevu", yol)]
    html = head(r, yol, "Online Servis Randevusu | BYM Automotive",
                "BYM Automotive'de aracınız için online servis randevusu oluşturun. Marka, hizmet, gün ve saati seçin; randevunuzu 1 dakikada planlayın.",
                schema=[breadcrumb_schema(parca)])
    html += header(r, "randevu")
    html += f"""<main id="icerik" class="page-booking">
<section class="section section--booking section--booking-page">
  <div class="wrap">
    {breadcrumb(r, parca)}
    {booking_block(r, h_tag="h1")}
  </div>
</section>
<section class="section section--alt section--tight">
  <div class="wrap">
    <h2 class="h-lg">Randevudan sonra ne olur?</h2>
    <ol class="timeline timeline--compact">{"".join(f'<li class="step"><span class="step__n mono">{i+1:02d}</span><h3 class="step__t">{e(tr_upper(t))}</h3><p>{e(p)}</p></li>' for i, (t, p) in enumerate(I.SUREC))}</ol>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, "0.9")


# ---------------------------------------------------------------------------
# HAKKIMIZDA / İLETİŞİM / KVKK
# ---------------------------------------------------------------------------
def hakkimizda():
    yol = "hakkimizda/"
    r = rel(yol)
    parca = [("Hakkımızda", yol)]
    img = M["hakkimizda"]
    ilke = "".join(f'<li class="reveal"><span class="mono">{i+1:02d}</span><div><h3>{e(t)}</h3><p>{e(p)}</p></div></li>' for i, (t, p) in enumerate(I.NEDEN))
    baslik = 'Aracınızın<br><span class="silver">özel hastanesi.</span>'
    html = head(r, yol, "Hakkımızda | BYM Automotive", "BYM Automotive'in servis anlayışı: doğru teşhis, şeffaf süreç, müşteri onayıyla işlem ve kontrollü teslim.", schema=[breadcrumb_schema(parca)])
    html += header(r, "hakkimizda")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Hakkımızda", baslik, "Tabelamızda yazan bu söz, işimize nasıl baktığımızı anlatıyor: Her aracı önce dinler, kontrol eder, sonra ne yapılacağını sahibine açıkça anlatırız.")}
<section class="section section--flush-top">
  <div class="wrap about">
    <figure class="about__img reveal"><img src="{r}assets/media/{img['src']}" alt="{e(img['alt'])}" width="{img['w']}" height="{img['h']}" loading="lazy" decoding="async"><figcaption>BYM Servis · Göksun</figcaption></figure>
    <div class="about__txt reveal">
      <h2 class="h-lg">Nasıl çalışıyoruz?</h2>
      <p>BYM Automotive, Göksun'da bakım, arıza tespiti ve onarım hizmeti veren bir oto servisidir. Amacımız; aracınızı bıraktığınızda neyin, neden ve ne kadar sürede yapılacağını bildiğiniz, planlı bir servis deneyimi sunmaktır.</p>
      <p>Randevulu çalışmamızın nedeni de budur: Aracınıza ayrılan zaman önceden planlanır, bekleme süresi kısalır ve her araca gereken dikkat gösterilir.</p>
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="wrap">
    <div class="sec-head"><div><p class="eyebrow">İlkelerimiz</p><h2 class="h-xl">Serviste güven,<br><span class="silver">işlemde şeffaflık.</span></h2></div></div>
    <ul class="principles">{ilke}</ul>
  </div>
</section>
{cta_final(r)}
{contact_block(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.7")


def iletisim():
    yol = "iletisim/"
    r = rel(yol)
    parca = [("İletişim", yol)]
    html = head(r, yol, "İletişim & Yol Tarifi | BYM Automotive Göksun",
                "BYM Automotive iletişim bilgileri, çalışma saatleri ve yol tarifi. Telefon, WhatsApp veya online randevu ile ulaşın.",
                schema=[breadcrumb_schema(parca), business_schema()])
    html += header(r, "iletisim")
    html += f"""<main id="icerik">
{page_hero(r, parca, "İletişim", "Bize ulaşın.", "Telefon, WhatsApp veya online randevu ile bize ulaşabilirsiniz. Servise gelmeden önce randevu oluşturmanızı öneririz.")}
{contact_block(r)}
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.8")


def kvkk():
    yol = "kvkk/"
    r = rel(yol)
    parca = [("KVKK Aydınlatma Metni", yol)]
    html = head(r, yol, "KVKK Aydınlatma Metni | BYM Automotive", "BYM Automotive kişisel verilerin korunması aydınlatma metni.", schema=[breadcrumb_schema(parca)], robots="noindex,follow")
    html += header(r, "")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Yasal", "KVKK Aydınlatma Metni", "6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında bilgilendirme.")}
<section class="section section--flush-top">
  <div class="wrap prose">
    <p class="note">Bu metin taslaktır; yayına alınmadan önce işletme tarafından hukuki olarak gözden geçirilmelidir.</p>
    <h2>Veri sorumlusu</h2>
    <p>{e(F['ad'])} ({e(ADRES_TEK)}).</p>
    <h2>İşlenen kişisel veriler</h2>
    <p>Randevu formu aracılığıyla paylaştığınız ad soyad, telefon numarası, araç plakası, araç marka/modeli, talep edilen hizmet, randevu tarihi/saati ve açıklama alanına yazdığınız bilgiler.</p>
    <h2>İşleme amaçları</h2>
    <p>Servis randevunuzun oluşturulması, sizinle iletişime geçilmesi, aracınıza verilecek hizmetin planlanması ve servis kaydının tutulması.</p>
    <h2>Hukuki sebep</h2>
    <p>Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması ve açık rızanız.</p>
    <h2>Aktarım</h2>
    <p>Kişisel verileriniz, yasal zorunluluklar dışında üçüncü kişilerle paylaşılmaz. Randevu bilgilerinizi WhatsApp üzerinden iletmeyi tercih etmeniz halinde, mesaj içeriği ilgili hizmet sağlayıcının altyapısı üzerinden iletilir.</p>
    <h2>Haklarınız</h2>
    <p>KVKK'nın 11. maddesi kapsamındaki haklarınıza ilişkin taleplerinizi {e(F['telefon_gorunen'])} numaralı telefondan veya işletme adresimize başvurarak iletebilirsiniz.</p>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, None)


# ---------------------------------------------------------------------------
# MARKALAR
# ---------------------------------------------------------------------------
def markalar():
    yol = "markalar/"
    r = rel(yol)
    parca = [("Markalar", yol)]
    liste = "".join(f'<li><a href="{r}markalar/{slugify(m)}/">{e(m)}<span>{ikon("i-arrow")}</span></a></li>' for m in CFG["markalar"]["liste"])
    html = head(r, yol, "Hizmet Verdiğimiz Markalar | BYM Automotive", "BYM Automotive'de bakım ve onarım hizmeti verilen araç markaları.", schema=[breadcrumb_schema(parca)])
    html += header(r, "")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Markalar", "Hizmet Verdiğimiz<br>Markalar", "Markanızı seçin; aracınız için sunduğumuz servisleri inceleyin ve randevu oluşturun.")}
<section class="section section--flush-top"><div class="wrap"><ul class="brands brands--lg">{liste}</ul></div></section>
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.7")
    for m in CFG["markalar"]["liste"]:
        marka_sayfasi(m)


def marka_sayfasi(m):
    s = slugify(m)
    yol = f"markalar/{s}/"
    r = rel(yol)
    parca = [("Markalar", "markalar/"), (m, yol)]
    from urllib.parse import quote
    html = head(r, yol, f"{m} Bakım ve Servis | BYM Automotive",
                f"{m} araçlarınız için periyodik bakım, arıza tespiti, motor, elektrik, fren ve klima servisi. BYM Automotive'de online randevu.",
                schema=[breadcrumb_schema(parca)])
    html += header(r, "")
    baslik = f'{e(m)}<br><span class="silver">bakım ve servis.</span>'
    extra = f"""<div class="btn-row"><a class="btn btn--accent btn--lg" href="{r}randevu/?marka={quote(m)}">{e(m)} için randevu al {ikon('i-arrow')}</a></div>"""
    html += f"""<main id="icerik">
{page_hero(r, parca, "Marka", baslik, f"{e(m)} aracınızın bakımı ve onarımında üreticinin bakım takvimi ve teknik değerleri esas alınır. Yapılacak işlemler size işlem öncesinde anlatılır, onayınızla uygulanır.", extra)}
<section class="section section--flush-top">
  <div class="wrap">
    <h2 class="h-lg">{e(m)} araçlar için hizmetler</h2>
    <div class="svc-grid">{service_cards(r)}</div>
  </div>
</section>
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.5")


# ---------------------------------------------------------------------------
# BLOG
# ---------------------------------------------------------------------------
def blog():
    yol = "blog/"
    r = rel(yol)
    parca = [("Bilgi Merkezi", yol)]
    html = head(r, yol, "BYM Otomotiv Bilgi Merkezi | Araç Bakım Rehberi",
                "Motor arıza lambası, periyodik bakım, fren sesleri, akü ve yağ değişimi hakkında anlaşılır ve doğru bilgiler.",
                schema=[breadcrumb_schema(parca)])
    html += header(r, "")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Bilgi merkezi", "BYM Otomotiv<br>Bilgi Merkezi", "Aracınızdaki belirtileri anlamanıza ve bakımınızı planlamanıza yardımcı olacak, sade ve doğru bilgiler.")}
<section class="section section--flush-top"><div class="wrap"><div class="post-grid">{blog_cards(r, I.BLOG, "h2")}</div></div></section>
{cta_final(r)}
</main>"""
    html += footer(r)
    yaz(yol, html, "0.7")
    for p in I.BLOG:
        blog_yazisi(p)


def blog_yazisi(p):
    yol = f"blog/{p['slug']}/"
    r = rel(yol)
    parca = [("Bilgi Merkezi", "blog/"), (p["baslik"], yol)]
    h = next(x for x in I.HIZMETLER if x["slug"] == p["hizmet"])
    diger = [x for x in I.BLOG if x["slug"] != p["slug"]][:3]
    schema = [
        breadcrumb_schema(parca),
        {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": p["baslik"],
            "description": p["ozet"],
            "datePublished": p["tarih"],
            "dateModified": p["tarih"],
            "inLanguage": "tr-TR",
            "mainEntityOfPage": f"{URL}/{yol}",
            "author": {"@type": "Organization", "name": F["ad"]},
            "publisher": {"@id": f"{URL}/#isletme", "@type": "AutoRepair", "name": F["ad"]},
        },
    ]
    tarih_tr = date.fromisoformat(p["tarih"]).strftime("%d.%m.%Y")
    html = head(r, yol, f"{p['baslik']} | BYM Automotive", p["ozet"], schema=schema)
    html += header(r, "")
    html += f"""<main id="icerik">
<article>
  <header class="phero phero--post">
    <div class="wrap wrap--narrow">
      {breadcrumb(r, parca)}
      <p class="eyebrow"><time datetime="{p['tarih']}">{tarih_tr}</time> · {p['okuma']} dk okuma</p>
      <h1 class="h-display h-display--post">{e(p['baslik'])}</h1>
      <p class="lead">{e(p['ozet'])}</p>
    </div>
  </header>
  <div class="wrap wrap--narrow prose">
    {p['govde']}
    <aside class="post-cta">
      <p class="post-cta__t">Aracınızda benzer bir belirti mi var?</p>
      <p class="muted">{e(h['ad'])} için randevu oluşturun; aracınızı kontrol edelim, ne yapılması gerektiğini size anlatalım.</p>
      <div class="btn-row">
        <a class="btn btn--accent" href="{r}randevu/?hizmet={h['randevu']}">Randevu Al {ikon('i-arrow')}</a>
        <a class="btn btn--ghost" href="{r}hizmetler/{h['slug']}/">{e(h['ad'])} hizmeti</a>
      </div>
    </aside>
  </div>
</article>
<section class="section section--alt">
  <div class="wrap">
    <h2 class="h-lg">Diğer yazılar</h2>
    <div class="post-grid">{blog_cards(r, diger)}</div>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, "0.6")


# ---------------------------------------------------------------------------
# YÖNETİM (demo) / 404
# ---------------------------------------------------------------------------
def yonetim():
    yol = "yonetim/"
    r = rel(yol)
    html = head(r, yol, "Randevu Yönetimi (Demo) | BYM Automotive", "Randevu yönetim paneli demo.", robots="noindex,nofollow")
    html += header(r, "")
    html += f"""<main id="icerik">
<section class="section section--booking-page">
  <div class="wrap">
    <p class="eyebrow">Yönetim · Demo</p>
    <h1 class="h-xl">Randevular</h1>
    <p class="muted">Bu sayfa, gelecekteki yönetim panelinin önizlemesidir. Demo modunda yalnızca bu tarayıcıda oluşturulan randevular listelenir.</p>
    <div class="admin" data-admin></div>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, None)


def sayfa_404():
    yol = "404.html"
    r = ""  # GitHub Pages 404'ü kök yoldan sunar; mutlak kök gerektiğinde site_url kullanılır
    html = head(r, "404.html", "Sayfa bulunamadı | BYM Automotive", "Aradığınız sayfa bulunamadı.", robots="noindex")
    html += header(r, "")
    html += f"""<main id="icerik">
<section class="phero phero--404">
  <div class="wrap">
    <p class="eyebrow mono">404</p>
    <h1 class="h-display h-display--page">Bu sayfa<br><span class="silver">bulunamadı.</span></h1>
    <p class="lead">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
    <div class="btn-row"><a class="btn btn--accent btn--lg" href="{r}">Anasayfaya dön</a><a class="btn btn--ghost btn--lg" href="{r}randevu/">Randevu Al</a></div>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, None)


# ---------------------------------------------------------------------------
# JS CONFIG / SITEMAP / ROBOTS
# ---------------------------------------------------------------------------
def js_config():
    cfg = {
        "firma": {"ad": F["ad"], "telefon": F["telefon_link"], "telefonGorunen": F["telefon_gorunen"], "whatsapp": F["whatsapp"], "adres": ADRES_TEK},
        "randevu": {
            "mod": CFG["randevu"]["mod"],
            "apiUrl": CFG["randevu"]["api_url"],
            "saatler": CFG["randevu"]["saatler"],
            "kapaliGunler": CFG["randevu"]["kapali_gunler"],
            "ileriGunLimiti": CFG["randevu"]["ileri_gun_limiti"],
            "tatiller": CFG["randevu"]["tatiller"],
        },
        "markalar": CFG["markalar"]["liste"],
    }
    out = "// OTOMATİK ÜRETİLDİ — _build/site.json dosyasını düzenleyip `python3 _build/build.py` çalıştırın.\n"
    out += "export const CONFIG = " + json.dumps(cfg, ensure_ascii=False, indent=2) + ";\n"
    p = SITE / "assets" / "js" / "config.js"
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(out, encoding="utf-8")


def sitemap():
    urls = "".join(
        f"<url><loc>{URL}/{y}</loc><lastmod>{BUGUN}</lastmod><priority>{o}</priority></url>\n" for y, o in SAYFALAR
    )
    (SITE / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{urls}</urlset>\n',
        encoding="utf-8",
    )
    (SITE / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /yonetim/\nDisallow: /_build/\n\nSitemap: {URL}/sitemap.xml\n", encoding="utf-8")


def main():
    anasayfa()
    hizmetler_index()
    for h in I.HIZMETLER:
        hizmet_sayfasi(h)
    randevu()
    hakkimizda()
    iletisim()
    kvkk()
    markalar()
    blog()
    yonetim()
    sayfa_404()
    js_config()
    sitemap()
    print(f"{len(SAYFALAR)} sayfa sitemap'e eklendi; toplam HTML üretildi.")


if __name__ == "__main__":
    main()
