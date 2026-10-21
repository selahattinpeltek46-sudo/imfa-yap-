# Chromium aynı görseli her sayfaya ayrı gömer; aynı içerikli görselleri tek kopyada birleştirir.
#   python3 ucel-romork/_kaynak/pdf_sikistir.py dosya.pdf
import hashlib
import sys

import pikepdf


def birlestir(yol):
    pdf = pikepdf.open(yol, allow_overwriting_input=True)
    gorulen, n = {}, 0

    def gez(res):
        nonlocal n
        if res is None or '/XObject' not in res:
            return
        xo = res['/XObject']
        for k in list(xo.keys()):
            o = xo[k]
            if o.get('/Subtype') == '/Image':
                h = hashlib.md5(o.read_raw_bytes()).hexdigest()
                if '/SMask' in o:
                    h += hashlib.md5(o['/SMask'].read_raw_bytes()).hexdigest()
                if h in gorulen:
                    xo[k] = gorulen[h]; n += 1
                else:
                    gorulen[h] = o
            elif o.get('/Subtype') == '/Form':
                gez(o.get('/Resources'))

    for sayfa in pdf.pages:
        gez(sayfa.obj.get('/Resources'))
    pdf.remove_unreferenced_resources()
    pdf.save(yol, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    return n


def jpeg_yap(yol, kalite=80, en_buyuk=1300):
    """Büyük gömülü fotoğrafları JPEG kalite 80'e indirir (hafif sürüm için). Saydamlık maskesi (SMask) olduğu gibi kalır; yalnız renk verisi JPEG olur."""
    import io
    import zlib
    from PIL import Image
    from pikepdf import PdfImage
    pdf = pikepdf.open(yol, allow_overwriting_input=True)
    n = 0
    for o in list(pdf.objects):
        if not isinstance(o, pikepdf.Stream) or o.get('/Subtype') != '/Image' or o.get('/ColorSpace') != '/DeviceRGB':
            continue
        if len(o.read_raw_bytes()) < 150_000:  # Chromium fotoğrafları yüksek kalitede yeniden gömüyor
            continue
        try:
            im = PdfImage(o).as_pil_image().convert('RGB')
        except Exception:
            continue
        if '/SMask' not in o:
            im.thumbnail((en_buyuk, en_buyuk))  # maskeli görselde boyut maskeyle aynı kalmalı
        b = io.BytesIO(); im.save(b, 'JPEG', quality=kalite, optimize=True)
        o.write(b.getvalue(), filter=pikepdf.Name.DCTDecode)
        o.Width, o.Height = im.size
        o.ColorSpace = pikepdf.Name.DeviceRGB
        o.BitsPerComponent = 8
        for k in ('/DecodeParms', '/Decode'):
            if k in o:
                del o[k]
        n += 1
    pdf.save(yol, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    return n


if __name__ == '__main__':
    for yol in sys.argv[1:]:
        print(yol, 'birleştirilen görsel:', birlestir(yol))
