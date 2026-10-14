# Basılı katalogdaki QR kodlarını üretir (SVG, ucel-romork/katalog/qr/).
#   pip install segno && python3 ucel-romork/_kaynak/katalog_qr.py
# Her ürün QR'ı WhatsApp'ı ürün adı yazılı hazır mesajla açar.
import pathlib
import urllib.parse

import segno

WA = '905324803051'
SITE = 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/ucel-romork/'
HARITA = 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote('Üçel Tarım Aletleri Göksun Kahramanmaraş')

def wa(mesaj):
    return f'https://wa.me/{WA}?text=' + urllib.parse.quote(mesaj)

def urun(ad):
    return wa(f'Merhaba, katalogdaki {ad} için fiyat ve bilgi almak istiyorum. Traktörüm: ')

KODLAR = {
    'whatsapp': wa('Merhaba, Üçel kataloğundan yazıyorum. Bilgi almak istiyorum.'),
    'harita': HARITA,
    'site': SITE,
    'romork': urun('Tarım Römorku'),
    'kultivator': urun('Yaylı Kültivatör'),
    'kepce': urun('Loader Kepçe'),
    'tapan': urun('Tapan'),
    'pulluk': urun('Pulluk'),
    'gubre': urun('Gübre Serpme Makinesi'),
    'tanker': urun('Su Tankeri'),
}

hedef = pathlib.Path(__file__).resolve().parent.parent / 'katalog' / 'qr'
hedef.mkdir(parents=True, exist_ok=True)
for ad, veri in KODLAR.items():
    segno.make(veri, error='m').save(hedef / f'{ad}.svg', scale=4, border=0, dark='#2A211B', light=None)
    print(ad, '→', veri)
