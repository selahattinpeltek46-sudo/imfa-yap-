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
    # 20.10.2026: Üçel'in gönderdiği yeni fotoğraflar
    'romork-mavi-2026', 'romork-damperli', 'romork-atolye-onu', 'romork-kirmizi-traktor',
    'pulluk-mavi', 'pulluk-mavi-2', 'pulluk-cesitleri', 'kepce-kirmizi-traktor', 'kepce-mavi', 'kepce-mavi-traktor',
    'tampon-on', 'kultivator-renkler', 'kultivator-mavi-atolye', 'kultivator-yesil', 'tanker-mavi', 'tanker-yesil',
    'tapan-loglu', 'tapan-loglu-traktor', 'gubre-serpme-tekli', 'gubre-serpme-sira', 'gubre-serpme-atolye',
    'saman-aspiratoru', 'helikopter-tirmik', 'ot-bicme-tamburu', 'ot-bicme-tamburu-2', 'odun-sepeti', 'odun-sepeti-2',
    'bahce-sepeti', 'ilac-makinasi', 'tas-toplama-tirmigi', 'tas-toplama-tirmigi-kirmizi',
    # 21.10.2026: yem karma
    'yem-karma-metkarsan', 'yem-karma-sagro', 'yem-karma-sagro-2',
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
    'k-tanker-mavi': ('tanker-mavi', [(0, 0, 0.17, 0.66)]),
    'k-tapan': ('tapan-loglu', []),
    'k-gubre': ('gubre-serpme-tekli', [(0, 0, 1, 0.31)]),
    'k-pulluk-2': ('pulluk-mavi', [(0, 0, 0.2, 1)]),
    'k-romork-kirmizi': ('romork-kirmizi-traktor', [(0, 0, 0.19, 1), (0.48, 0.28, 0.66, 0.355), (0.79, 0, 1, 0.6)]),
    'k-pulluk-3': ('pulluk-mavi-2', [(0, 0, 1, 0.12)]),
    'k-kepce-kirmizi': ('kepce-kirmizi-traktor', [(0, 0, 0.13, 1), (0.13, 0, 0.22, 0.6)]),
    'k-kepce-mavi': ('kepce-mavi-traktor', [(0, 0, 1, 0.08)]),
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

    im = Image.open(KAYNAK / f'{kaynak}.webp').convert('RGB')  # renk düzeltmesi yok
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
    im = Image.open(KAYNAK / f'{ad}.webp').convert('RGB')
    # En yüksek kalite: kaynak çözünürlüğü korunur (en büyük kenar 1800 px, A4'te ~250 dpi)
    # Fotoğrafa dokunulmaz: renk düzeltmesi yok, yalnızca JPEG'e çevrilir
    im.save(HEDEF / f'{ad}.jpg', quality=92, optimize=True, progressive=True, subsampling=0)
    print('foto', ad)

try:
    from rembg import new_session
except ImportError:
    print('rembg yok: dekupe atlandı (mevcut katalog/img/k-*.png dosyaları kullanılır)')
else:
    oturum = new_session('isnet-general-use')
    import sys
    secili = sys.argv[1:]  # ad verilirse yalnız onlar yeniden kesilir
    for ad, (kaynak, sil) in DEKUPE.items():
        if secili and ad not in secili:
            continue
        k = dekupe(oturum, kaynak, sil)
        k.thumbnail((1800, 1800))  # kaynak çözünürlüğü korunur
        k.save(HEDEF / f'{ad}.png', optimize=True)
        print('dekupe', ad)
