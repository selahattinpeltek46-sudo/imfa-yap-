# Katalogda kullanılan site fotoğraflarını (../img/*.webp) JPEG'e çevirir.
# Chromium JPEG'i PDF'e olduğu gibi gömer; WebP'yi açıp yeniden sıkıştırmadığı için PDF küçük kalır.
#   python3 ucel-romork/_kaynak/katalog_gorsel.py
import pathlib
import re

from PIL import Image

KOK = pathlib.Path(__file__).resolve().parent.parent
kaynak = (KOK / '_kaynak' / 'katalog.mjs').read_text()
adlar = set(re.findall(r"'([a-z-]+)'", kaynak))
hedef = KOK / 'katalog' / 'img'
hedef.mkdir(parents=True, exist_ok=True)
for f in sorted((KOK / 'img').glob('*.webp')):
    if f.stem in adlar and not f.stem.endswith('-k'):
        Image.open(f).convert('RGB').save(hedef / f'{f.stem}.jpg', quality=84, optimize=True, progressive=True)
        print(f.stem)
