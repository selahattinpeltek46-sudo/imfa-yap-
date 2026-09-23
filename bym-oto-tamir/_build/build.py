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


HURL = {h["slug"]: h["url"] for h in I.HIZMETLER}


def hizmet_url(slug):
    return HURL[slug]


WA_RANDEVU = "Merhaba BYM Automotive, randevu talebinde bulunmak istiyorum."
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
<symbol id="i-eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></symbol>
<symbol id="i-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></symbol>
<symbol id="i-key" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.8-9.8M17 6l3 3M14.5 8.5l2 2"/></symbol>
<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></symbol>
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
<script>document.documentElement.className+=" js";</script>
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
    from urllib.parse import quote
    harita = f"https://www.google.com/maps/search/?api=1&amp;query={quote(F['harita_sorgu'])}"
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
        <h2 class="ftr__h">BYM</h2>
        <ul>
          <li><a href="{r}randevu/">Randevu Al</a></li>
          <li><a href="{r}hizmetler/">Hizmetler</a></li>
          <li><a href="{r}hakkimizda/">Hakkımızda</a></li>
          <li><a href="{r}blog/">Bilgi Merkezi</a></li>
          <li><a href="{r}iletisim/">İletişim</a></li>
        </ul>
      </nav>
      <nav class="ftr__col" aria-label="Hizmetler">
        <h2 class="ftr__h">Hizmetler</h2>
        <ul>{"".join(f'<li><a href="{r}{h["url"]}">{e(h["ad"])}</a></li>' for h in I.HIZMETLER)}</ul>
      </nav>
      <div class="ftr__col">
        <h2 class="ftr__h">İletişim</h2>
        <ul class="ftr__contact">
          <li><a href="tel:{F['telefon_link']}">{ikon('i-phone')} {e(F['telefon_gorunen'])}</a></li>
          <li><a href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener">{ikon('i-wa')} {e(F.get('whatsapp_gorunen', 'WhatsApp'))}</a></li>
          <li><a href="{harita}" target="_blank" rel="noopener">{ikon('i-pin')} {e(ADRES_TEK)}</a></li>
          <li><a href="{harita}" target="_blank" rel="noopener" class="ftr__maps">Google Haritalar'da aç {ikon('i-arrow')}</a></li>
        </ul>
        <h2 class="ftr__h ftr__h--gap">Çalışma Saatleri</h2>
        <ul class="ftr__hours">{saatler}</ul>
      </div>
    </div>
    <div class="ftr__bottom">
      <span>© {date.today().year} {e(F['ad'])}</span>
      <span class="ftr__legal"><a href="{r}gizlilik/">Gizlilik Politikası</a><a href="{r}kvkk/">KVKK Aydınlatma Metni</a></span>
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
        "areaServed": [{"@type": "City", "name": "Göksun"}, {"@type": "AdministrativeArea", "name": "Kahramanmaraş"}],
        "openingHoursSpecification": hours,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Oto servis hizmetleri",
            "itemListElement": [
                {"@type": "Offer", "itemOffered": {"@type": "Service", "name": h["ad"], "url": f"{URL}/{h['url']}"}}
                for h in I.HIZMETLER
            ],
        },
    }
    if F.get("konum"):
        d["geo"] = {"@type": "GeoCoordinates", "latitude": F["konum"]["enlem"], "longitude": F["konum"]["boylam"]}
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
def fallback_form(fid, r):
    """Wizard çalışmadığında (JS kapalı ya da yüklenemedi) gösterilen tek sayfalık randevu formu.
    JS varsa alanlar birleştirilip WhatsApp mesajı olarak açılır; JS yoksa form wa.me'ye hazır bir
    selamlama mesajıyla gider. Wizard başladığında bu form DOM'dan kaldırılır (wizard.js → innerHTML)."""
    k = f"fb-{fid}"
    hizmet = "".join(f'<option>{e(h["ad"])}</option>' for h in I.HIZMETLER)
    saat = "".join(f"<option>{e(t)}</option>" for t in CFG["randevu"]["saatler"])
    kapali = json.dumps(CFG["randevu"]["kapali_gunler"])
    return f"""<form class="booking__fallback" id="{k}" action="https://wa.me/{F['whatsapp']}" method="get" target="_blank" novalidate>
      <h3 class="wz__q">Randevu talebi oluşturun</h3>
      <p class="wz__hint">Formu doldurun; talebiniz WhatsApp üzerinden BYM Automotive'e iletilsin. Ekibimiz uygunluğu teyit etmek için size döner.</p>
      <input type="hidden" name="text" value="{e(WA_RANDEVU)}">
      <div class="grid-2">
        <div class="field"><label for="{k}-service">Hizmet</label>
          <select id="{k}-service" class="input" data-f="service" required><option value="">Hizmet seçin</option>{hizmet}</select></div>
        <div class="field"><label for="{k}-vehicle">Araç marka / model</label>
          <input id="{k}-vehicle" class="input" data-f="vehicle" required autocomplete="off" placeholder="Örn. BMW 520d"></div>
      </div>
      <div class="grid-2">
        <div class="field"><label for="{k}-date">Tarih</label>
          <input id="{k}-date" class="input" type="date" data-f="date" required></div>
        <div class="field"><label for="{k}-time">Saat</label>
          <select id="{k}-time" class="input" data-f="time" required><option value="">Saat seçin</option>{saat}</select></div>
      </div>
      <div class="grid-2">
        <div class="field"><label for="{k}-name">Ad Soyad</label>
          <input id="{k}-name" class="input" data-f="name" required autocomplete="name" placeholder="Adınız ve soyadınız"></div>
        <div class="field"><label for="{k}-phone">Telefon</label>
          <input id="{k}-phone" class="input" type="tel" data-f="phone" required inputmode="tel" autocomplete="tel-national" placeholder="0 (5XX) XXX XX XX"></div>
      </div>
      <div class="field"><label for="{k}-problem">Sorun / açıklama <span class="opt-l">(isteğe bağlı)</span></label>
        <textarea id="{k}-problem" class="input" data-f="problem" rows="3" maxlength="500" placeholder="Örn: Motor arıza lambası yanıyor ve araç son günlerde titriyor."></textarea></div>
      <p class="err booking__fb-err" role="alert"></p>
      <div class="booking__fb-foot">
        <button type="submit" class="btn btn--accent btn--lg">Randevu Talebi Gönder {ikon('i-arrow')}</button>
        <a class="booking__fb-tel" href="tel:{F['telefon_link']}">{ikon('i-phone')} {e(F['telefon_gorunen'])}</a>
      </div>
      <p class="booking__fb-ok" role="status"></p>
      <p class="wz__legal">Talebi göndererek <a href="{r}kvkk/">KVKK Aydınlatma Metni</a>'ni okuduğunuzu kabul edersiniz.</p>
    </form>
    <script>(function(){{
      var f=document.getElementById("{k}");if(!f)return;
      var closed={kapali};
      function p(n){{return(n<10?"0":"")+n;}}
      function v(x){{var el=f.querySelector('[data-f="'+x+'"]');return el?el.value.replace(/^\\s+|\\s+$/g,""):"";}}
      var t=new Date(),min=t.getFullYear()+"-"+p(t.getMonth()+1)+"-"+p(t.getDate());
      f.querySelector('[data-f="date"]').setAttribute("min",min);
      f.addEventListener("submit",function(ev){{
        ev.preventDefault();
        var err=f.querySelector(".booking__fb-err"),ok=f.querySelector(".booking__fb-ok"),m="";
        err.textContent="";ok.textContent="";
        var d=v("date"),ph=v("phone").replace(/\\D/g,"");
        if(ph.indexOf("90")===0)ph=ph.slice(2);if(ph.charAt(0)==="0")ph=ph.slice(1);
        var dp=d.split("-"),day=d?new Date(+dp[0],+dp[1]-1,+dp[2]).getDay():-1;
        if(!v("service"))m="Lütfen bir hizmet seçin.";
        else if(!v("vehicle"))m="Lütfen aracınızın marka ve modelini girin.";
        else if(!d)m="Lütfen tarih seçin.";
        else if(d<min)m="Geçmiş bir tarih seçilemez.";
        else if(closed.indexOf(day)>-1)m="Seçtiğiniz gün kapalıyız. Lütfen başka bir gün seçin.";
        else if(!v("time"))m="Lütfen saat seçin.";
        else if(v("name").split(/\\s+/).length<2)m="Lütfen adınızı ve soyadınızı girin.";
        else if(!/^[2-5][0-9]{{9}}$/.test(ph))m="Lütfen geçerli bir telefon numarası girin.";
        if(m){{err.textContent=m;return;}}
        var L=["Merhaba BYM Automotive,","Randevu talebinde bulunmak istiyorum.",""];
        L.push("Hizmet: "+v("service"));L.push("Araç: "+v("vehicle"));
        L.push("Tarih: "+dp[2]+"."+dp[1]+"."+dp[0]);L.push("Saat: "+v("time"));
        L.push("Ad Soyad: "+v("name").replace(/\\s+/g," "));L.push("Telefon: 0"+ph);
        if(v("problem"))L.push("Sorun: "+v("problem"));
        L.push("","Randevu uygunluğunun teyit edilmesini rica ederim.");
        var url=f.getAttribute("action")+"?text="+encodeURIComponent(L.join("\\n"));
        var w=window.open(url,"_blank");if(w){{w.opener=null;}}else{{window.location.href=url;}}
        ok.textContent="WhatsApp açıldı. Mesajı gönderdiğinizde talebiniz BYM Automotive'e ulaşır; ekibimiz uygunluğu teyit etmek için size döner.";
      }});
    }})();</script>"""


def booking_block(r, h_tag="h2", baslik_id="randevu-baslik"):
    return f"""
<div class="booking-shell">
  <div class="booking-intro reveal">
    <p class="eyebrow">Online randevu</p>
    <{h_tag} id="{baslik_id}" class="h-xl">Servis Randevunuzu Oluşturun</{h_tag}>
    <p class="lead">Size uygun günü ve saati seçin,<br class="br-d"> servise gelmeden önce randevunuzu planlayın.</p>
    <ol class="booking-points">
      <li><span class="mono">01</span> Hizmeti ve aracınızı seçin</li>
      <li><span class="mono">02</span> Size uygun gün ve saati belirleyin</li>
      <li><span class="mono">03</span> Talebiniz WhatsApp ile ekibimize iletilir</li>
      <li><span class="mono">04</span> Ekibimiz uygunluğu teyit etmek için size döner</li>
    </ol>
    <p class="booking-alt">Telefonla randevu için <a href="tel:{F['telefon_link']}">{e(F['telefon_gorunen'])}</a></p>
  </div>
  <div class="booking reveal" id="{baslik_id}-form" data-booking>
    <script>(function(){{var b=document.getElementById("{baslik_id}-form");if(!b)return;b.className+=" is-js";setTimeout(function(){{if(!/is-ready/.test(b.className))b.className+=" is-failed";}},8000);}})();</script>
    <div class="booking__skeleton" aria-hidden="true"></div>
    {fallback_form(baslik_id, r)}
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
      <a class="map__btn" href="https://www.google.com/maps/search/?api=1&amp;query={q}" target="_blank" rel="noopener" data-map-load>{ikon('i-pin')} Haritayı göster</a>
    </div>
  </div>
</section>"""


def service_cards(r, liste=None, baslik_tag="h3"):
    out = ""
    for i, h in enumerate(liste or I.HIZMETLER):
        out += f"""
    <article class="svc reveal" style="--d:{(i % 4) * 60}ms">
      <span class="svc__ic">{ikon(h['ikon'])}</span>
      <{baslik_tag} class="svc__t"><a href="{r}{h['url']}" class="svc__link">{e(h['ad'])}</a></{baslik_tag}>
      <p class="svc__p">{e(h['ozet'])}</p>
      <div class="svc__actions">
        <a class="svc__more" href="{r}{h['url']}" aria-label="{e(h['ad'])} hakkında detaylı bilgi">Detaylı Bilgi {ikon('i-arrow')}</a>
        <a class="svc__book" href="{r}randevu/?hizmet={h['randevu']}" aria-label="{e(h['ad'])} için randevu al">Randevu Al</a>
      </div>
    </article>"""
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
def hero_media(r):
    hero = M["hero"]
    if hero.get("video"):
        sources = ""
        if hero.get("video_webm"):
            sources += f'<source src="{r}assets/media/{hero["video_webm"]}" type="video/webm">'
        sources += f'<source src="{r}assets/media/{hero["video"]}" type="video/mp4">'
        return f'<video class="hero__media" autoplay muted loop playsinline preload="metadata" poster="{r}assets/media/{hero["poster"]}" aria-hidden="true" data-hero-video>{sources}</video>'
    return f'<img class="hero__media hero__media--still" src="{r}assets/media/{hero["poster"]}" alt="{e(hero["alt"])}" fetchpriority="high" decoding="async">'


def symptom_block(r, baslik_tag="h2"):
    """Aracınızda ne var? — erişilebilir sekme/akordeon. Desktop: liste + panel; mobil: akordeon."""
    from urllib.parse import quote
    items = ""
    for i, s_ in enumerate(I.SORUNLAR):
        acik = i == 0
        h = next(x for x in I.HIZMETLER if x["slug"] == s_["hizmet"])
        nedenler = "".join(f"<li>{e(n)}</li>" for n in s_["nedenler"])
        kontroller = "".join(f"<li>{ikon('i-tick')}<span>{e(k)}</span></li>" for k in s_["kontroller"])
        uyari = f'<p class="sym__warn">{e(s_["uyari"])}</p>' if s_.get("uyari") else ""
        items += f"""
      <button type="button" class="sym__tab" id="sym-t-{s_['id']}" aria-controls="sym-p-{s_['id']}" aria-expanded="{str(acik).lower()}" data-sym-tab>
        <span>{e(s_['baslik'])}</span>{ikon('i-plus', 'ic sym__plus')}
      </button>
      <div class="sym__panel" id="sym-p-{s_['id']}" role="region" aria-labelledby="sym-t-{s_['id']}">
        <h3 class="sym__h">{e(s_['baslik'])}</h3>
        <p class="sym__lead">{e(s_['aciklama'])}</p>
        {uyari}
        <div class="sym__cols">
          <div>
            <h4 class="sym__label">Olası nedenler</h4>
            <ul class="sym__list">{nedenler}</ul>
          </div>
          <div>
            <h4 class="sym__label">Kontrol edilmesi gereken noktalar</h4>
            <ul class="sym__checks">{kontroller}</ul>
          </div>
        </div>
        <div class="sym__process">
          <h4 class="sym__label">BYM'de süreç</h4>
          <ol><li>Arıza kayıtları ve belirti dinlenir</li><li>İlgili sistem kontrol edilir</li><li>Tespit ve öneriler size aktarılır</li><li>Onayınızla işleme geçilir</li></ol>
        </div>
        <p class="sym__note">Bu bilgiler genel yönlendirme içindir. Kesin teşhis, araç kontrol edildikten sonra konur.</p>
        <div class="btn-row">
          <a class="btn btn--accent" href="{r}randevu/?hizmet={s_['randevu']}&amp;not={quote(s_['baslik'])}">Bu belirti için randevu al {ikon('i-arrow')}</a>
          <a class="btn btn--ghost" href="{r}{h['url']}">{e(h['ad'])} hizmeti</a>
        </div>
      </div>"""
    return f"""
<section class="section" id="belirti" aria-labelledby="sorun-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Belirti rehberi</p>
        <{baslik_tag} id="sorun-baslik" class="h-xl">Aracınızda<br>ne var?</{baslik_tag}>
      </div>
      <p class="muted sec-head__note">Belirtiyi seçin; olası nedenleri, kontrol edilecek noktaları ve servis sürecini görün.</p>
    </div>
    <div class="sym reveal" data-sym>{items}
    </div>
  </div>
</section>"""


def garage_block(r):
    kategoriler = [k for k in M.get("kategoriler", []) if any(g.get("kategori") == k for g in M["garaj"])]
    filtre = ""
    if len(kategoriler) > 1:
        chips = '<button type="button" class="chip" data-filter="" aria-pressed="true">Tümü</button>'
        chips += "".join(f'<button type="button" class="chip" data-filter="{e(k)}" aria-pressed="false">{e(k)}</button>' for k in kategoriler)
        filtre = f'<div class="garage__filters" role="group" aria-label="Kategoriye göre filtrele">{chips}</div>'
    kart = ""
    for i, g in enumerate(M["garaj"]):
        bilgi = f'<span class="g-cap__car">{e(g.get("arac", ""))}</span><span class="g-cap__txt">{e(g.get("aciklama", g.get("etiket", "")))}</span>'
        kart += f"""<figure class="g-item reveal" data-cat="{e(g.get('kategori', ''))}"><button type="button" class="g-btn" data-lightbox="{i}" aria-label="Fotoğrafı büyüt: {e(g['alt'])}"><img src="{r}assets/media/{g['src']}" alt="{e(g['alt'])}" width="{g['w']}" height="{g['h']}" loading="lazy" decoding="async"></button><figcaption class="g-cap"><span class="g-cap__cat mono">{e(g.get('kategori', ''))}</span>{bilgi}</figcaption></figure>"""
    return f"""
<section class="section section--alt" id="garage" aria-labelledby="garaj-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Servisten gerçek görüntüler</p>
        <h2 id="garaj-baslik" class="h-xl garage-title">BYM GARAGE</h2>
      </div>
      <p class="muted sec-head__note">Servisimizden gerçek görüntüler. Stok fotoğraf kullanmıyoruz.</p>
    </div>
    {filtre}
    <div class="garage" data-gallery>{kart}</div>
  </div>
</section>"""


def cases_block(r):
    liste = CFG.get("vakalar", {}).get("liste", [])
    if not liste:
        return ""
    kart = ""
    for v in liste:
        foto = f'<img src="{r}assets/media/{e(v["foto"])}" alt="{e(v["arac"])}" loading="lazy" decoding="async">' if v.get("foto") else ""
        kart += f"""<article class="case reveal">{foto}<dl>
          <div><dt>Araç</dt><dd>{e(v['arac'])}</dd></div>
          <div><dt>Sorun / talep</dt><dd>{e(v['talep'])}</dd></div>
          <div><dt>Yapılan kontroller</dt><dd>{e(v['kontroller'])}</dd></div>
          <div><dt>Uygulanan işlem</dt><dd>{e(v['islem'])}</dd></div>
          <div><dt>Son kontrol</dt><dd>{e(v['son_kontrol'])}</dd></div></dl></article>"""
    return f"""
<section class="section" aria-labelledby="vaka-baslik">
  <div class="wrap">
    <div class="sec-head reveal"><div><p class="eyebrow">Vaka çalışmaları</p><h2 id="vaka-baslik" class="h-xl">Gerçek servis süreçleri</h2></div></div>
    <div class="cases">{kart}</div>
  </div>
</section>"""


def faq_block(sss, baslik="Sık sorulan sorular"):
    items = "".join(f'<details class="faq"><summary>{e(q)}<span aria-hidden="true"></span></summary><p>{e(a)}</p></details>' for q, a in sss)
    return f"""
<section class="section section--tight" aria-labelledby="sss-baslik">
  <div class="wrap faq-wrap">
    <div class="reveal"><p class="eyebrow">SSS</p><h2 id="sss-baslik" class="h-lg">{baslik}</h2></div>
    <div class="faqs reveal">{items}</div>
  </div>
</section>"""


def faq_schema(sss):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in sss]}


# ---------------------------------------------------------------------------
# ANASAYFA
# ---------------------------------------------------------------------------
def anasayfa():
    yol, r = "", ""
    guven_hero = "".join(f"<li>{ikon('i-tick')}{e(g)}</li>" for g in I.GUVEN)
    guven_band = "".join(
        f'<li class="reveal" style="--d:{i*50}ms"><span class="mono">{i+1:02d}</span>{e(g)}</li>'
        for i, g in enumerate(I.GUVEN_BANDI)
    )
    neden = "".join(
        f"""<article class="why reveal" style="--d:{i*70}ms"><div class="why__top"><span class="why__ic">{ikon(ic)}</span><span class="why__n mono">{i+1:02d}</span></div><h3 class="why__t">{e(tr_upper(t))}</h3><p>{e(p)}</p></article>"""
        for i, (t, p, ic) in enumerate(I.NEDEN)
    )
    surec = "".join(
        f"""<li class="step reveal" style="--d:{i*70}ms"><span class="step__n mono">{i+1:02d}</span><h3 class="step__t">{e(tr_upper(t))}</h3><p>{e(p)}</p></li>"""
        for i, (t, p) in enumerate(I.SUREC)
    )

    html = head(r, yol, "BYM Automotive | Göksun Oto Servis, Bakım ve Onarım",
                "BYM Automotive (BYM Servis): Göksun'da araç bakımı, bilgisayarlı arıza tespiti, motor, oto elektrik, fren ve klima servisi. Online randevu, şeffaf süreç, onaylı işlem.",
                schema=[business_schema(), {"@context": "https://schema.org", "@type": "WebSite", "name": F["ad"], "url": f"{URL}/"}, faq_schema(I.SSS_GENEL)])
    html += header(r, "home")
    html += f"""
<main id="icerik">

<section class="hero" aria-labelledby="hero-baslik">
  <div class="hero__bg">{hero_media(r)}</div>
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
      <a class="btn btn--accent btn--lg" href="{r}randevu/">Randevu Al {ikon('i-arrow')}</a>
      <a class="btn btn--glass btn--lg" href="{wa_link(WA_GENEL)}" target="_blank" rel="noopener" data-wa>{ikon('i-wa')} WhatsApp'tan Ulaş</a>
    </div>
    <ul class="hero__trust">{guven_hero}</ul>
  </div>
</section>

<section class="band" aria-label="Çalışma prensiplerimiz">
  <ul class="wrap band__list">{guven_band}</ul>
</section>

<section class="section section--booking" id="randevu" aria-labelledby="randevu-baslik">
  <div class="wrap">{booking_block(r)}</div>
</section>

<section class="section section--alt" aria-labelledby="neden-baslik">
  <div class="wrap why-grid">
    <div class="why-head reveal">
      <p class="eyebrow">Neden BYM?</p>
      <h2 id="neden-baslik" class="h-xl">Serviste güven,<br><span class="silver">işlemde şeffaflık.</span></h2>
      <p class="muted">Aracınızı bıraktığınızda ne yapılacağını bilirsiniz. Onayınız olmadan işlem yapılmaz ve aracınız kontrolleri tamamlanarak teslim edilir.</p>
    </div>
    <div class="why-cards">{neden}</div>
  </div>
</section>

<section class="section" id="hizmetler" aria-labelledby="hizmet-baslik">
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

{symptom_block(r)}

<section class="section section--alt" id="surec" aria-labelledby="surec-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Servis süreci</p>
        <h2 id="surec-baslik" class="h-xl">BYM'de servis süreci<br>nasıl ilerliyor?</h2>
      </div>
      <p class="muted sec-head__note">Her adımda ne olduğunu bilirsiniz. Onayınız alınmadan işleme geçilmez.</p>
    </div>
    <ol class="timeline" data-timeline>{surec}</ol>
  </div>
</section>

{garage_block(r)}
{cases_block(r)}
{reviews_block(r)}
{faq_block(I.SSS_GENEL)}

<section class="section section--alt" aria-labelledby="blog-baslik">
  <div class="wrap">
    <div class="sec-head reveal">
      <div>
        <p class="eyebrow">Bilgi merkezi</p>
        <h2 id="blog-baslik" class="h-xl">BYM Bilgi Merkezi</h2>
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
            tarih = f' ({e(F["google_puan_tarihi"])} itibarıyla)' if F.get("google_puan_tarihi") else ""
            puan = f'<p class="rev-empty__score"><strong>{e(F["google_puan"])}</strong><span>/ 5 · Google\'da {F.get("google_yorum_sayisi", "")} yorum{tarih}</span></p>'
        alintilar = "".join(
            f'<figure class="rev-quote"><blockquote>“{e(a["metin"])}”</blockquote><figcaption>{e(a["kaynak"])}</figcaption></figure>'
            for a in CFG["yorumlar"].get("alintilar", []))
        icerik = f"""
    <div class="rev-empty reveal">
      <div class="rev-empty__stars" aria-hidden="true">{yildizlar}</div>
      {puan}
      {alintilar}
      <p class="muted">Sitemizde yalnızca Google İşletme Profili'mizdeki gerçek yorumlara yer veriyoruz.</p>
      <a class="btn btn--light" href="{e(F['google_yorum_link'])}" target="_blank" rel="noopener">Google'da tüm yorumları gör {ikon('i-arrow')}</a>
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
    data = [{"src": f"{r}assets/media/{g['src']}", "alt": g["alt"], "etiket": " · ".join(x for x in (g.get("kategori"), g.get("arac"), g.get("aciklama")) if x)} for g in M["garaj"]]
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
    yol = h["url"]
    r = rel(yol)
    parca = [("Hizmetler", "hizmetler/"), (h["ad"], yol)]
    from urllib.parse import quote
    wa = wa_link(f"Merhaba BYM Automotive, {h['ad']} hizmeti hakkında bilgi almak istiyorum.")
    kapsam = "".join(f"<li>{ikon('i-tick')}<span>{e(k)}</span></li>" for k in h["kapsam"])
    belirti = "".join(
        f'<li><a href="{r}randevu/?hizmet={h["randevu"]}&amp;not={quote(b)}"><span>{e(b)}</span>{ikon("i-arrow")}</a></li>'
        for b in h["belirtiler"])
    sss = "".join(f"<details class=\"faq\"><summary>{e(q)}<span aria-hidden=\"true\"></span></summary><p>{e(a)}</p></details>" for q, a in h["sss"])
    kontrol = "".join(f'<li><span class="mono">{i+1:02d}</span><div><strong>{e(t)}</strong><p>{e(d)}</p></div></li>' for i, (t, d) in enumerate(I.SUREC))
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
{page_hero(r, parca, "Hizmet · Göksun", e(h['ad']), e(h['giris']), extra)}
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
        <h2 class="h-md">Kontrol süreci</h2>
        <ol class="proc">{kontrol}</ol>
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
                "BYM Automotive'de aracınız için online servis randevusu oluşturun. Hizmeti, aracınızı, gün ve saati seçin; talebiniz WhatsApp ile ekibimize iletilsin.",
                schema=[breadcrumb_schema(parca), faq_schema(I.SSS_GENEL[:2] + I.SSS_GENEL[3:])])
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
{faq_block(I.SSS_GENEL[:2] + I.SSS_GENEL[3:], "Randevu hakkında")}
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
    ilke = "".join(f'<li class="reveal"><span class="why__ic">{ikon(ic)}</span><div><h3>{e(t)}</h3><p>{e(p)}</p></div></li>' for i, (t, p, ic) in enumerate(I.NEDEN))
    ekip_liste = CFG.get("ekip", {}).get("liste", [])
    ekip = ""
    if ekip_liste:
        kart = "".join(f'<figure class="team__m reveal"><img src="{r}assets/media/{e(k["foto"])}" alt="{e(k["isim"])}" loading="lazy" decoding="async"><figcaption><strong>{e(k["isim"])}</strong><span>{e(k["gorev"])}</span></figcaption></figure>' for k in ekip_liste)
        ekip = f'<section class="section"><div class="wrap"><div class="sec-head"><div><p class="eyebrow">Ekip</p><h2 class="h-xl">Aracınızla ilgilenen ekip</h2></div></div><div class="team">{kart}</div></div></section>'

    baslik = 'Aracınızın<br><span class="silver">özel hastanesi.</span>'
    html = head(r, yol, "Hakkımızda | BYM Automotive", "BYM Automotive'in servis anlayışı: doğru teşhis, şeffaf süreç, müşteri onayıyla işlem ve kontrollü teslim.", schema=[breadcrumb_schema(parca)])
    html += header(r, "hakkimizda")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Hakkımızda", baslik, "Tabelamızda yazan bu söz, işimize nasıl baktığımızı anlatıyor: Her aracı önce dinler, kontrol eder, sonra ne yapılacağını sahibine açıkça anlatırız.")}
<section class="section section--flush-top">
  <div class="wrap about">
    <figure class="about__img reveal"><img src="{r}assets/media/{img['src']}" alt="{e(img['alt'])}" width="{img['w']}" height="{img['h']}" loading="lazy" decoding="async"><figcaption>BYM Servis · Göksun</figcaption></figure>
    <div class="about__txt reveal">
      <h2 class="h-lg">Aracınızı insanlara emanet edersiniz.</h2>
      <p>BYM, Göksun sanayi sitesinde bakım, arıza tespiti ve onarım hizmeti veren bir oto servisidir. Birçok müşterimiz bizi tabelamızın üzerindeki kırmızı araçtan tanır.</p>
      <p>Servis anlayışımız basit: Aracınızı teslim alırken sizi dinleriz, kontrol ettikten sonra neyin neden gerektiğini açıkça anlatırız ve onayınızı almadan işleme geçmeyiz. İş bittiğinde aracı kontrollerini tamamlayarak teslim ederiz.</p>
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
{ekip}
{garage_block(r)}
{cta_final(r)}
{contact_block(r)}
</main>"""
    html += lightbox_data(r)
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
    if not CFG["markalar"].get("sayfa_uret"):
        return
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
        <a class="btn btn--ghost" href="{r}{h['url']}">{e(h['ad'])} hizmeti</a>
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
def gizlilik():
    yol = "gizlilik/"
    r = rel(yol)
    parca = [("Gizlilik Politikası", yol)]
    html = head(r, yol, "Gizlilik Politikası | BYM Automotive", "BYM Automotive web sitesi gizlilik politikası.", schema=[breadcrumb_schema(parca)], robots="noindex,follow")
    html += header(r, "")
    html += f"""<main id="icerik">
{page_hero(r, parca, "Yasal", "Gizlilik Politikası", "Bu sayfa, web sitemizi kullanırken hangi bilgilerin nasıl işlendiğini açıklar.")}
<section class="section section--flush-top">
  <div class="wrap prose">
    <p class="note">Bu metin taslaktır; işletme tarafından gözden geçirilmelidir.</p>
    <h2>Randevu talepleri</h2>
    <p>Randevu formuna girdiğiniz bilgiler bir sunucuya gönderilmez. Formu tamamladığınızda bu bilgilerle hazır bir WhatsApp mesajı oluşturulur; mesajı göndermeyi siz onaylarsınız. Talebinizin bir kopyası yalnızca kendi tarayıcınızda (yerel depolama) tutulur ve tarayıcı verilerinizi temizleyerek silebilirsiniz.</p>
    <h2>Çerezler ve analiz</h2>
    <p>Sitemizde reklam veya ziyaretçi takibi amaçlı çerez ya da analiz aracı kullanılmamaktadır.</p>
    <h2>Üçüncü taraf hizmetler</h2>
    <ul>
      <li><strong>Google Fonts:</strong> Yazı tiplerinin yüklenmesi sırasında tarayıcınız Google sunucularına bağlanır.</li>
      <li><strong>Google Haritalar:</strong> Harita yalnızca "Haritayı göster" butonuna bastığınızda yüklenir.</li>
      <li><strong>WhatsApp:</strong> WhatsApp bağlantıları, mesajlaşma için WhatsApp uygulamasını veya sitesini açar.</li>
    </ul>
    <h2>İletişim</h2>
    <p>Sorularınız için {e(F['telefon_gorunen'])} numarasından bize ulaşabilirsiniz. Kişisel verilerle ilgili ayrıntılar için <a href="{r}kvkk/">KVKK Aydınlatma Metni</a>'ne bakabilirsiniz.</p>
  </div>
</section>
</main>"""
    html += footer(r)
    yaz(yol, html, None)


def yonlendirme(eski, yeni):
    """Taşınan sayfalar için 404 yerine yönlendirme sayfası."""
    r = rel(eski)
    hedef = f"{r}{yeni}"
    html = f"""<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>Sayfa taşındı | {e(F['ad'])}</title>
<meta name="robots" content="noindex,follow"><link rel="canonical" href="{URL}/{yeni}">
<meta http-equiv="refresh" content="0; url={hedef}"></head>
<body><p>Bu sayfa taşındı: <a href="{hedef}">{URL}/{yeni}</a></p></body></html>
"""
    yaz(eski, html, None)


def yonlendirmeler():
    for h in I.HIZMETLER:
        yonlendirme(f"hizmetler/{h['slug']}/", h["url"])
    if not CFG["markalar"].get("sayfa_uret"):
        yonlendirme("markalar/", "hizmetler/")
        for m in CFG["markalar"]["liste"]:
            yonlendirme(f"markalar/{slugify(m)}/", "hizmetler/")
    yonlendirme("yonetim/", "randevu/")


def sayfa_404():
    yol = "404.html"
    # 404 her derinlikte sunulur; bu yüzden site kökü mutlak yol olarak verilir
    from urllib.parse import urlparse
    r = urlparse(URL).path.rstrip("/") + "/"
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
    (SITE / "robots.txt").write_text(f"User-agent: *\nAllow: /\nDisallow: /_build/\n\nSitemap: {URL}/sitemap.xml\n", encoding="utf-8")


URETILEN = ["hizmetler", "markalar", "yonetim", "randevu", "hakkimizda", "iletisim", "kvkk", "gizlilik", "blog"] + [h["url"].strip("/") for h in I.HIZMETLER]


def temizle():
    import shutil
    for d in URETILEN:
        if (SITE / d).is_dir():
            shutil.rmtree(SITE / d)


def main():
    temizle()
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
    gizlilik()
    yonlendirmeler()
    sayfa_404()
    js_config()
    sitemap()
    print(f"{len(SAYFALAR)} sayfa sitemap'e eklendi; toplam HTML üretildi.")


if __name__ == "__main__":
    main()
