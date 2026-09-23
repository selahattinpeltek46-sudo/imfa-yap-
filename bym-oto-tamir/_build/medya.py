"""
BYM Automotive — medya hazırlama.

Kaynak fotoğrafları (_build/kaynak-fotograflar) web için hazırlar:
  - kenar kırpma (ekran görüntüsü okları vb.)
  - plaka bulanıklaştırma (müşteri gizliliği)
  - WebP çıktısı (assets/media)

Yeni fotoğraf eklemek için:
  1. Dosyayı _build/kaynak-fotograflar klasörüne koyun.
  2. Aşağıdaki MEDYA listesine bir satır ekleyin.
  3. `python3 _build/medya.py` ve ardından `python3 _build/build.py` çalıştırın.

Gereksinim: pip install pillow
"""
from pathlib import Path

from PIL import Image, ImageFilter

KOK = Path(__file__).resolve().parent
KAYNAK = KOK / "kaynak-fotograflar"
HEDEF = KOK.parent / "assets" / "media"

# ad: çıktı dosya adı (uzantısız)
# kirp: (sol, üst, sağ, alt) piksel — None ise kırpılmaz
# bulanik: plaka vb. gizlenecek alanlar [(sol, üst, sağ, alt), ...] (kırpma ÖNCESİ koordinatlar)
MEDYA = [
    {"kaynak": "servis-dis-cephe.png", "ad": "bym-servis-dis-cephe", "kirp": (8, 0, 542, 297), "bulanik": []},
    {"kaynak": "lift-golf.png", "ad": "bym-lift-arac", "kirp": None, "bulanik": [(412, 52, 520, 88)]},
    {"kaynak": "motor-tdi-dikey.png", "ad": "bym-motor-bolmesi", "kirp": None, "bulanik": []},
    {"kaynak": "motor-tdi-passat.png", "ad": "bym-motor-tdi", "kirp": (30, 0, 590, 402), "bulanik": []},
    {"kaynak": "panamera-kanal.webp", "ad": "bym-kanal-arac-kabul", "kirp": None, "bulanik": [(248, 470, 436, 522)]},
]

# Sosyal medya paylaşım görseli (og:image) — JPEG
OG_KAYNAK = "bym-servis-dis-cephe"


def bulaniklastir(im, kutu):
    bolge = im.crop(kutu)
    # Önce küçültüp büyüterek okunmaz hale getir, sonra yumuşat
    w, h = bolge.size
    bolge = bolge.resize((max(1, w // 10), max(1, h // 10)), Image.BILINEAR).resize((w, h), Image.BILINEAR)
    bolge = bolge.filter(ImageFilter.GaussianBlur(4))
    im.paste(bolge, kutu[:2])


def isle():
    HEDEF.mkdir(parents=True, exist_ok=True)
    for m in MEDYA:
        im = Image.open(KAYNAK / m["kaynak"]).convert("RGB")
        for kutu in m["bulanik"]:
            bulaniklastir(im, kutu)
        if m["kirp"]:
            im = im.crop(m["kirp"])
        cikti = HEDEF / f'{m["ad"]}.webp'
        im.save(cikti, "WEBP", quality=84, method=6)
        print(f"{cikti.name}: {im.size[0]}x{im.size[1]}")
        if m["ad"] == OG_KAYNAK:
            im.save(HEDEF / "og-bym-oto-tamir.jpg", "JPEG", quality=86, optimize=True, progressive=True)


if __name__ == "__main__":
    isle()
