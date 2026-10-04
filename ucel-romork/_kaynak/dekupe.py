"""Ürün fotoğraflarının arka planını kaldırır (yalnızca kenarı temiz çıkanlar için).

Gereken: pip install "rembg[cpu]"   (ilk çalıştırmada ~180 MB model indirilir)
Çalıştırma (bu klasörde): python3 dekupe.py
Girdi: cikti/pdf-gorsel/<ad>.jpg (gorseller.py üretir)
       foto-beyaz/<ad>.jpg — Üçel'in gönderdiği, arka planı zaten beyaz fotoğraflar (rembg gerekmez)
Çıktı: cikti/dekupe/<ad>.jpg — beyaz zemin, PDF için sıkıştırılmış JPEG

Hangi fotoğrafın dekupe edileceği elle seçildi: pulluk ve ön yükleyici fotoğraflarında
kenarlar temiz çıkmadığı (arka plan parçaları, insan, bina kaldığı) için bunlar listede yok;
katalogda gerçek fotoğrafları çerçeveli kullanılır.
"""
from pathlib import Path

from PIL import Image, ImageFilter

BURASI = Path(__file__).resolve().parent
GIRDI = BURASI / 'cikti' / 'pdf-gorsel'
CIKTI = BURASI / 'cikti' / 'dekupe'

HAZIR = BURASI / 'foto-beyaz'
DEKUPE = ['tarim-romorku-yesil', 'yayli-kultivator-kirmizi', 'yayli-kultivator-mavi', 'su-tankeri']


def golgeli(on: Image.Image, uzun_kenar=1500) -> Image.Image:
    on.thumbnail((uzun_kenar, uzun_kenar), Image.LANCZOS)
    w, h = on.size
    pay_x, pay_ust, pay_alt = int(w * .04), int(h * .03), int(h * .10)
    tuval = Image.new('RGBA', (w + 2 * pay_x, h + pay_ust + pay_alt), (255, 255, 255, 255))
    # zemin gölgesi: ürün siluetinin alt kısmından yayvan, yumuşak bir leke
    alfa = on.split()[3]
    golge = Image.new('L', tuval.size, 0)
    sil = alfa.resize((w, max(1, int(h * .18))))
    golge.paste(sil, (pay_x, pay_ust + h - int(h * .10)))
    golge = golge.filter(ImageFilter.GaussianBlur(max(6, w // 45)))
    golge = golge.point(lambda v: int(v * .38))
    koyu = Image.new('RGBA', tuval.size, (20, 20, 22, 255))
    tuval = Image.composite(koyu, tuval, golge)
    tuval.alpha_composite(on, (pay_x, pay_ust))
    return tuval.convert('RGB')


def hazir_kopyala():
    """Beyaz zeminli hazır fotoğrafları boş kenarlarından kırpıp aynı klasöre yazar."""
    for f in sorted(HAZIR.glob('*.jpg')):
        im = Image.open(f).convert('RGB')
        maske = im.convert('L').point(lambda v: 255 if v < 245 else 0)
        kutu = maske.getbbox()
        if kutu:
            pay = 12
            kutu = (max(0, kutu[0] - pay), max(0, kutu[1] - pay), min(im.width, kutu[2] + pay), min(im.height, kutu[3] + pay))
            im = im.crop(kutu)
        im.save(CIKTI / f.name, 'JPEG', quality=86, optimize=True, progressive=True)
        print('hazır:', f.stem)


def main():
    CIKTI.mkdir(parents=True, exist_ok=True)
    hazir_kopyala()
    try:
        from rembg import new_session, remove
    except ImportError:
        print('rembg kurulu değil; yalnızca hazır fotoğraflar işlendi')
        return
    oturum = new_session('isnet-general-use')
    for ad in DEKUPE:
        im = Image.open(GIRDI / f'{ad}.jpg').convert('RGB')
        on = remove(im, session=oturum, alpha_matting=True, alpha_matting_foreground_threshold=240,
                    alpha_matting_background_threshold=15, alpha_matting_erode_size=8)
        on = on.crop(on.getbbox())
        golgeli(on).save(CIKTI / f'{ad}.jpg', 'JPEG', quality=86, optimize=True, progressive=True)
        print('dekupe:', ad)


if __name__ == '__main__':
    main()
