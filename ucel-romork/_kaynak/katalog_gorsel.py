# Katalog görselleri: ucel-romork/img/*.webp → ucel-romork/katalog/img/
#   pip install pillow scipy "rembg[cpu]"
#   python3 ucel-romork/_kaynak/katalog_gorsel.py
#
# 1) Fotoğraflar: sıcak renk düzeltmesi + JPEG (Chromium JPEG'i PDF'e olduğu gibi gömer, dosya küçük kalır).
# 2) Dekupe (stüdyo görünümü): ürün arka plandan ayrılır, kenar pusu temizlenir → PNG.
#    İnsan ya da kalabalık arka plan olan fotoğraflar dekupe edilmez, "sahadan" fotoğrafı olarak kalır.
import pathlib

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

KOK = pathlib.Path(__file__).resolve().parent.parent
KAYNAK = KOK / 'img'
HEDEF = KOK / 'katalog' / 'img'

FOTOLAR = [
    'tarim-romorku-mavi', 'tarim-romorku-yesil', 'tarim-romorku-yesil-teslimat', 'tarim-romorku-traktor',
    'tarim-romorku-yuk-araci', 'yayli-kultivator-kirmizi', 'yayli-kultivator-mavi', 'on-yukleyici-atolye',
    'on-yukleyici-kubota', 'on-yukleyici-saha', 'on-yukleyici-mavi', 'on-yukleyici-kaldirma',
    'on-yukleyici-ve-pulluk', 'kulakli-pulluk', 'romork-ve-gubre-serpme', 'su-tankeri',
    'doner-ot-tirmigi-sevkiyat',
]

# ad: (kaynak, silinecek bölgeler [x0, y0, x1, y1] oran olarak)
DEKUPE = {
    'k-romork': ('tarim-romorku-mavi', [(0.86, 0, 1, 1), (0.78, 0, 1, 0.35)]),
    'k-romork-yesil': ('tarim-romorku-yesil', []),
    'k-kultivator': ('yayli-kultivator-kirmizi', []),
    'k-kultivator-mavi': ('yayli-kultivator-mavi', [(0, 0, 0.21, 1)]),
    'k-kepce': ('on-yukleyici-atolye', [(0, 0.28, 0.245, 0.40), (0.245, 0.32, 0.385, 0.40)]),
    'k-tanker': ('su-tankeri', []),
    'k-pulluk': ('kulakli-pulluk', []),
}


def sicak(im):
    """Hafif sıcak ton, biraz kontrast ve doygunluk: tüm fotoğraflar aynı aileden görünsün."""
    im = ImageEnhance.Contrast(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.06)
    a = np.asarray(im).astype('float32')
    a[..., 0] *= 1.03
    a[..., 2] *= 0.95
    return Image.fromarray(a.clip(0, 255).astype('uint8'))


def dekupe(oturum, kaynak, sil):
    from rembg import remove
    from scipy import ndimage

    im = sicak(Image.open(KAYNAK / f'{kaynak}.webp').convert('RGB'))
    a = np.array(remove(im, session=oturum).convert('RGBA'))
    al = a[..., 3]
    m = al > 150  # yarı saydam pus atılır
    H, W = m.shape
    for x0, y0, x1, y1 in sil:
        m[int(y0 * H):int(y1 * H), int(x0 * W):int(x1 * W)] = False
    m = ndimage.binary_opening(m, iterations=2)
    lab, n = ndimage.label(m)
    if n:
        boy = ndimage.sum(m, lab, range(1, n + 1))
        m = np.isin(lab, [i + 1 for i, s in enumerate(boy) if s >= 0.03 * boy.max()])
    yumusak = np.array(Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8)))
    a[..., 3] = np.minimum(yumusak, np.where(al > 40, 255, 0))
    out = Image.fromarray(a)
    return out.crop(out.getbbox())


HEDEF.mkdir(parents=True, exist_ok=True)
for ad in FOTOLAR:
    sicak(Image.open(KAYNAK / f'{ad}.webp').convert('RGB')).save(HEDEF / f'{ad}.jpg', quality=86, optimize=True, progressive=True)
    print('foto', ad)

try:
    from rembg import new_session
except ImportError:
    print('rembg yok: dekupe atlandı (mevcut katalog/img/k-*.png dosyaları kullanılır)')
else:
    oturum = new_session('isnet-general-use')
    for ad, (kaynak, sil) in DEKUPE.items():
        dekupe(oturum, kaynak, sil).save(HEDEF / f'{ad}.png', optimize=True)
        print('dekupe', ad)
