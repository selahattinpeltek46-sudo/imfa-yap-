#!/usr/bin/env python3
"""GitHub Pages için yayın klasörünü (_site) hazırlar.

Repoda duran her şey siteye gitmez:
  * HTML/CSS/JS ve site dosyaları (CNAME, robots.txt, sitemap.xml ...) her zaman kopyalanır.
  * Fotoğraf/video gibi medya dosyaları SADECE bir sayfada kullanılıyorsa kopyalanır.
    Kullanılmayan ham fotoğraflar, ekran görüntüleri, yedek videolar repoda kalır
    ama yayına çıkmaz; böylece 1 GB site sınırı boşuna dolmaz.

Ayrıca:
  * Sayfalarda adı geçen ama repoda olmayan medya varsa hata verir (kırık görsel yayına çıkmaz).
  * Boyut sınırlarını kontrol eder, rapor basar.

Kullanım:  python3 scripts/build-site.py [çıktı_klasörü]
"""
import os
import re
import shutil
import sys
from urllib.parse import unquote, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "_site"))

MB = 1024 * 1024
SITE_LIMIT = 1024 * MB          # GitHub Pages yayın sınırı
SITE_FAIL = 950 * MB            # bunun üstünde yayını durdur
SITE_WARN = 700 * MB            # bunun üstünde uyar
FILE_FAIL = 95 * MB             # git zaten 100 MB üstünü kabul etmez
FILE_WARN = 20 * MB             # tek dosya için uyarı

# Her zaman yayınlanan dosya türleri
TEXT_EXT = {".html", ".htm", ".css", ".js", ".xml", ".txt", ".json", ".webmanifest", ".ico"}
ALWAYS_NAMES = {"CNAME", ".nojekyll"}
# Sadece kullanılıyorsa yayınlanan medya türleri
MEDIA_EXT = {".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".mp4", ".webm", ".mov",
             ".svg", ".mp3", ".pdf", ".woff", ".woff2", ".ttf", ".otf"}
# Taranmayan / hiç yayınlanmayan klasörler
SKIP_DIRS = {".git", ".github", "scripts", "_site", "node_modules"}
# Medya klasörlerindeki HTML vb. dosyalar taslaktır, yayınlanmaz
MEDIA_DIRS = {"images", "assets"}
# Kendi alan adı olan alt siteler: mutlak URL'ler bu klasörlere eşlenir
DOMAINS = {"soylerogluhafriyat.com": "soyleroglu-hafriyat"}

ext_re = "|".join(e[1:] for e in sorted(MEDIA_EXT | TEXT_EXT))
REF_RE = re.compile(r"""["'(]\s*([^"'<>\n]+?\.(?:%s))\s*[)"']""" % ext_re, re.IGNORECASE)
SRCSET_RE = re.compile(r"""srcset\s*=\s*["']([^"']+)["']""", re.IGNORECASE)


def walk_files():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            yield os.path.join(dirpath, name)


def resolve(ref, source):
    ref = ref.strip()
    if ref.startswith(("data:", "mailto:", "tel:", "javascript:")):
        return None
    if ref.startswith("//"):
        ref = "https:" + ref
    if re.match(r"^[a-z]+://", ref, re.I):
        u = urlparse(ref)
        sub = DOMAINS.get(u.netloc.lower().removeprefix("www."))
        if sub is None:
            return None  # başka sitedeki dosya
        return os.path.normpath(os.path.join(ROOT, sub, unquote(u.path).lstrip("/")))
    path = unquote(ref.split("#")[0].split("?")[0])
    if path.startswith("/"):
        return os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
    return os.path.normpath(os.path.join(os.path.dirname(source), path))


def main():
    all_files = list(walk_files())
    text_files = [f for f in all_files
                  if (os.path.splitext(f)[1].lower() in TEXT_EXT or os.path.basename(f) in ALWAYS_NAMES)
                  and not MEDIA_DIRS & set(os.path.relpath(f, ROOT).split(os.sep)[:-1])]

    used, missing = set(), []
    for src in text_files:
        if os.path.splitext(src)[1].lower() not in {".html", ".htm", ".css", ".js", ".xml", ".json", ".webmanifest"}:
            continue
        with open(src, encoding="utf-8", errors="ignore") as fh:
            text = fh.read()
        refs = [m.group(1) for m in REF_RE.finditer(text)]
        for m in SRCSET_RE.finditer(text):
            refs += [part.strip().split(" ")[0] for part in m.group(1).split(",")]
        for ref in refs:
            target = resolve(ref, src)
            if target is None or os.path.splitext(target)[1].lower() not in MEDIA_EXT:
                continue
            if os.path.isfile(target):
                used.add(target)
            else:
                missing.append((os.path.relpath(src, ROOT), ref))

    publish = sorted(set(text_files) | used)

    if os.path.exists(OUT):
        shutil.rmtree(OUT)
    total, errors, warnings = 0, [], []
    for f in publish:
        rel = os.path.relpath(f, ROOT)
        size = os.path.getsize(f)
        total += size
        if size > FILE_FAIL:
            errors.append(f"Dosya çok büyük ({size / MB:.1f} MB): {rel}")
        elif size > FILE_WARN:
            warnings.append(f"Büyük dosya ({size / MB:.1f} MB) — küçültmeyi düşünün: {rel}")
        dest = os.path.join(OUT, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy2(f, dest)
    open(os.path.join(OUT, ".nojekyll"), "w").close()

    for src, ref in missing:
        errors.append(f"Kırık bağlantı: {src} içinde '{ref}' bulunamadı")
    if total > SITE_FAIL:
        errors.append(f"Site {total / MB:.0f} MB — GitHub Pages sınırı {SITE_LIMIT / MB:.0f} MB")
    elif total > SITE_WARN:
        warnings.append(f"Site {total / MB:.0f} MB — 1 GB sınırına yaklaşıyor")

    repo_media = sum(os.path.getsize(f) for f in all_files if os.path.splitext(f)[1].lower() in MEDIA_EXT)
    print(f"Yayınlanan dosya : {len(publish)}")
    print(f"Yayın boyutu     : {total / MB:.1f} MB / {SITE_LIMIT / MB:.0f} MB (%{total * 100 / SITE_LIMIT:.0f})")
    print(f"Repodaki medya   : {repo_media / MB:.1f} MB (kullanılmayanlar yayına çıkmadı)")
    for sub in sorted({p.split(os.sep)[0] for p in (os.path.relpath(f, ROOT) for f in publish) if os.sep in p}):
        size = sum(os.path.getsize(f) for f in publish if os.path.relpath(f, ROOT).startswith(sub + os.sep))
        print(f"  {sub:<22} {size / MB:7.1f} MB")

    gha = os.environ.get("GITHUB_ACTIONS") == "true"
    for w in warnings:
        print(f"::warning::{w}" if gha else f"UYARI: {w}")
    for e in errors:
        print(f"::error::{e}" if gha else f"HATA: {e}")
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
