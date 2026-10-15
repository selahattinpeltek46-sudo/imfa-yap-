"""Beyoğlu Erkek Kuaförü — index.html'i şablondan üretir.

SSS metinleri tek yerde (SORULAR) tutulur; hem sayfadaki <details> listesi hem FAQPage JSON-LD buradan
üretilir, böylece ikisi her zaman birebir aynı kalır. Bağlantılar (WhatsApp, Haritalar) da burada kodlanır.

Kullanım (repo kökünden):  python3 -I beyoglu-erkek-kuaforu/_proje/kaynak/olustur.py
"""
import html
import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

KOK = Path(__file__).resolve().parents[2]          # beyoglu-erkek-kuaforu/
SABLON = Path(__file__).with_name('index.sablon.html')

URL = 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/beyoglu-erkek-kuaforu/'
WHATSAPP = '905355089722'
ADRES_SORGU = 'Beyoğlu Erkek Kuaförü, Balık Sk. No:4, Kamer Hatun, 34435 Beyoğlu/İstanbul'


def wa(metin):
    return 'https://wa.me/' + WHATSAPP + '?text=' + quote(metin, safe='')


# (soru, cevap HTML, yalnız online randevu sistemi kuruluyken mi gösterilir)
SORULAR = [
    ('Randevusuz gelebilir miyim?',
     'Gelebilirsiniz; koltuk boşsa hemen, değilse kısa bir beklemeyle alırız. Beklemek istemiyorsanız '
     '<a href="#randevu">randevu alın</a> ya da arayın.', False),
    ('Fiyatlar ne kadar?',
     'Fiyatlar hizmete göre değişir ve dönem dönem güncellenir. Güncel fiyatı WhatsApp\'tan ya da telefonla sorabilirsiniz.', False),
    ('Çalışma saatleriniz nedir?',
     'Saatlerimiz güne göre değişebiliyor. Gelmeden önce <a href="tel:+905355089722" data-olay="telefon_tik" data-yer="sss">arayın</a> '
     'ya da WhatsApp\'tan yazın; en kolayı randevu almak.', False),
    ('Belirli bir ustayla çalışabilir miyim?',
     'Randevu formundaki not alanına ustanın adını yazın (ör. "Davut Abi"). Uygun değilse size başka bir saat öneririz.', False),
    ('İstediğim modeli nasıl anlatırım?',
     'Not alanına yazın ya da beğendiğiniz kesimin fotoğrafını WhatsApp\'tan gönderin.', False),
    ('Randevumu bana hatırlatır mısınız?',
     'Online randevu aldığınızda "Telefonuma ekle" ile randevu takviminize kaydolur ve 2 saat önce hatırlatır. '
     'Ayrıca randevudan önce salondan WhatsApp hatırlatması gelir.', True),
    ('Randevumu nasıl değiştirir veya iptal ederim?',
     'Randevu kodunuzla WhatsApp\'tan yazın ya da arayın.', False),
    ('Salon tam olarak nerede?',
     'Kamer Hatun Mahallesi, Balık Sokak No:4, 34435 Beyoğlu/İstanbul. Tarlabaşı Bulvarı\'na yakın bir ara sokakta; '
     'en kolayı <a href="#adres">"Yol tarifi"</a> butonu.', False),
]


def duz_metin(h):
    return html.unescape(re.sub(r'<[^>]+>', '', h))


def faq_html():
    satirlar = []
    for soru, cevap, yalniz_api in SORULAR:
        ek = ' data-yalniz-api' if yalniz_api else ''
        satirlar.append(f'          <details{ek}>\n            <summary>{soru}</summary>\n            <p>{cevap}</p>\n          </details>')
    return '\n'.join(satirlar)


def faq_json():
    # Yalnız API'ye bağlı (bazı durumlarda gizlenen) soru JSON-LD'ye girmez: Google, sayfada görünmeyen SSS'yi kabul etmez.
    veri = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
            {'@type': 'Question', 'name': s, 'acceptedAnswer': {'@type': 'Answer', 'text': duz_metin(c)}}
            for s, c, yalniz_api in SORULAR if not yalniz_api
        ],
    }
    return json.dumps(veri, ensure_ascii=False, indent=2).replace('\n', '\n  ')


FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Crect width='64' height='64' rx='8' fill='%2310201a'/%3E"
           "%3Crect x='6' y='10' width='52' height='3' fill='%23c9a961'/%3E"
           "%3Crect x='6' y='51' width='52' height='3' fill='%23c9a961'/%3E"
           "%3Ctext x='32' y='43' font-family='Arial' font-weight='700' font-size='26' fill='%23f2ede2' "
           "text-anchor='middle'%3EBEK%3C/text%3E%3C/svg%3E")

DEGERLER = {
    'URL': URL,
    'FAVICON': FAVICON,
    'HARITA': 'https://www.google.com/maps/search/?api=1&query=' + quote(ADRES_SORGU, safe=''),
    'YOL': 'https://www.google.com/maps/dir/?api=1&destination=' + quote(ADRES_SORGU, safe=''),
    'WA_RANDEVU': wa('Merhaba, randevu almak istiyorum.'),
    'WA_FIYAT': wa('Merhaba, güncel fiyatlarınızı öğrenebilir miyim?'),
    'WA_CILT': wa('Merhaba, cilt bakımı hakkında bilgi almak istiyorum.'),
    'WA_BOYA': wa('Merhaba, saç boyama hakkında bilgi almak istiyorum.'),
    'WA_USTA': wa('Merhaba, Davut Abi bugün salonda mı?'),
    'WA_EN': wa("Hello, I'd like to book a haircut. What are your prices?"),
    'FAQ_HTML': faq_html(),
    'FAQ_JSON': faq_json(),
}


def main():
    s = SABLON.read_text(encoding='utf-8')
    for ad, deger in DEGERLER.items():
        # HTML özniteliklerinde & → &amp; (JSON ve SSS blokları olduğu gibi)
        if ad not in ('FAQ_HTML', 'FAQ_JSON'):
            deger = deger.replace('&', '&amp;')
        s = s.replace('{{' + ad + '}}', deger)
    kalan = re.findall(r'\{\{\w+\}\}', s)
    if kalan:
        sys.exit('Doldurulmamış yer tutucu: ' + ', '.join(sorted(set(kalan))))
    (KOK / 'index.html').write_text(s, encoding='utf-8')
    print('yazıldı:', KOK / 'index.html')


if __name__ == '__main__':
    main()
