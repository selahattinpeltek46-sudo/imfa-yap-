# Orijinal ekran görüntülerinden web görsellerini üretir.
# Çalıştırma (depo kökünden): python3 ucel-romork/_kaynak/gorseller.py
from pathlib import Path
from PIL import Image

KOK = Path(__file__).resolve().parents[2]
CIKTI = KOK / 'ucel-romork' / 'img'
PDF_GORSEL = KOK / 'ucel-romork' / '_kaynak' / 'cikti' / 'pdf-gorsel'

# kaynak dosya sonu -> (yeni ad, üstten kırpılacak px; ekran görüntüsündeki büyüteç simgeleri için)
HARITA = {
    '111148': ('tarim-romorku-mavi', 8),
    '111318': ('tarim-romorku-yesil', 0),
    '111326': ('tarim-romorku-yesil-teslimat', 0),
    '111309': ('tarim-romorku-yuk-araci', 0),
    '111139': ('tarim-romorku-traktor', 0),
    '111358': ('romork-ve-gubre-serpme', 0),
    '111114': ('su-tankeri', 52),
    '111130': ('on-yukleyici-atolye', 52),
    '111239': ('on-yukleyici-kubota', 0),
    '111013': ('on-yukleyici-mavi', 0),
    '111005': ('on-yukleyici-saha', 0),
    '110949': ('on-yukleyici-kaldirma', 0),
    '111408': ('on-yukleyici-ve-pulluk', 0),
    '111206': ('yayli-kultivator-kirmizi', 0),
    '111220': ('yayli-kultivator-mavi', 52),
    '111215': ('kulakli-pulluk', 0),
    '111427': ('tesviye-kuregi', 0),
    '111433': ('doner-ot-tirmigi', 0),
    '111441 - Kopya': ('doner-ot-tirmigi-sevkiyat', 0),
}
# WhatsApp/sosyal paylaşım önizlemesi (1200x630 JPG)
OG = {
    'ana': 'tarim-romorku-yesil', 'tarim-romorku': 'tarim-romorku-mavi', 'su-tankeri': 'su-tankeri',
    'on-yukleyici': 'on-yukleyici-atolye', 'yayli-kultivator': 'yayli-kultivator-kirmizi',
    'kulakli-pulluk': 'kulakli-pulluk', 'tesviye-kuregi': 'tesviye-kuregi',
    'doner-ot-tirmigi': 'doner-ot-tirmigi', 'gubre-serpme-makinesi': 'romork-ve-gubre-serpme',
}

def kapla(im, w, h):
    oran = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * oran), round(im.height * oran)), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))

def main():
    for eski in CIKTI.glob('*.webp'):
        eski.unlink()
    (CIKTI / 'og').mkdir(parents=True, exist_ok=True)
    PDF_GORSEL.mkdir(parents=True, exist_ok=True)
    buyukler = {}
    for kaynak, (ad, ust) in HARITA.items():
        im = Image.open(KOK / f'Ekran görüntüsü 2026-09-09 {kaynak}.png').convert('RGB')
        if ust:
            im = im.crop((0, ust, im.width, im.height))
        buyukler[ad] = im.copy()
        b = im.copy(); b.thumbnail((1600, 1600)); b.save(CIKTI / f'{ad}.webp', 'WEBP', quality=80)
        k = im.copy(); k.thumbnail((800, 800)); k.save(CIKTI / f'{ad}-k.webp', 'WEBP', quality=76)
        # PDF katalog için JPEG (Chromium JPEG'i yeniden sıkıştırmadan gömer); yayınlanmaz
        pj = im.copy(); pj.thumbnail((1400, 1400)); pj.save(PDF_GORSEL / f'{ad}.jpg', 'JPEG', quality=78, optimize=True, progressive=True)
        pk = im.copy(); pk.thumbnail((700, 700)); pk.save(PDF_GORSEL / f'{ad}-k.jpg', 'JPEG', quality=74, optimize=True, progressive=True)
        print(ad, b.size)
    for ad, gorsel in OG.items():
        kapla(buyukler[gorsel], 1200, 630).save(CIKTI / 'og' / f'{ad}.jpg', 'JPEG', quality=82, optimize=True)

if __name__ == '__main__':
    main()
