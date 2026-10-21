# Basılı katalogdaki QR kodlarını üretir (SVG, ucel-romork/katalog/qr/).
#   pip install segno && python3 ucel-romork/_kaynak/katalog_qr.py
# Her ürün QR'ı WhatsApp'ı ürün adı yazılı hazır mesajla açar.
import json
import pathlib
import urllib.parse

import segno

WA = '905324803051'
SITE = 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/ucel-romork/'
# İşletme adı + açık adres: işletme haritada kayıtlı değilse de Göksun Sanayi Sitesi'ne götürür
HARITA = 'https://www.google.com/maps/search/?api=1&query=' + urllib.parse.quote('Üçel Tarım Aletleri, Yeni Mah. Göksun Sanayi Sitesi, 46660 Göksun, Kahramanmaraş')

def wa(mesaj):
    return f'https://wa.me/{WA}?text=' + urllib.parse.quote(mesaj)

def urun(ad):
    return wa(f'Merhaba, katalogdaki {ad} için fiyat ve bilgi almak istiyorum. Traktörüm: ')

KODLAR = {
    'whatsapp': wa('Merhaba, Üçel kataloğundan yazıyorum. Bilgi almak istiyorum.'),
    'harita': HARITA,
    'site': SITE,
    # Üçel'in Facebook hesabı (21.10.2026, Üçel'den). Arka kapakta Google yorum yerine.
    'facebook': 'https://www.facebook.com/hytckcnsz/',
    'romork': urun('Tarım Römorku'),
    'kultivator': urun('Yaylı Kültivatör'),
    'kepce': urun('Loader Kepçe'),
    'tapan': urun('Loğlu Tapan'),
    'pulluk': urun('Pulluk'),
    'gubre': urun('Gübre Serpme Makinesi'),
    'tanker': urun('Su Tankeri'),
    # C · Diğer ürünlerimiz
    'tampon': urun('Traktör Ön Tamponu'),
    'odun-sepeti': urun('Traktör Arkası Odun Sepeti'),
    'bahce-sepeti': urun('Traktör Arkası Bahçe Sepeti'),
    'tas-toplama': urun('Taş Toplama Tırmığı'),
    'helikopter': urun('Helikopter Ot Toplama Tırmığı'),
    'ot-bicme': urun('Ot Biçme Tamburu'),
    'aspirator': urun('Saman Üfleme Aspiratörü'),
    'ilac': urun('İlaç Makinesi'),
    'vinc': urun('Traktör Arkası Yükleme Vinci'),
    'yem-karma': urun('Yem Karma Makinesi'),
}

hedef = pathlib.Path(__file__).resolve().parent.parent / 'katalog' / 'qr'
hedef.mkdir(parents=True, exist_ok=True)
# Katalogdaki dokunulabilir bağlantılar da aynı adresleri kullanır (katalog.mjs okur)
(hedef / 'linkler.json').write_text(json.dumps(KODLAR, ensure_ascii=False, indent=1))
for ad, veri in KODLAR.items():
    segno.make(veri, error='m').save(hedef / f'{ad}.svg', scale=4, border=0, dark='#1E1E1E', light=None)
    print(ad, '→', veri)
