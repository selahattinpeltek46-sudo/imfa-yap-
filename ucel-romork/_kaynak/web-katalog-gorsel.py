"""Web katalog görselleri: JPEG kaynakları telefona uygun WebP'ye çevirir.

web-katalog.mjs çağırır: python3 -I web-katalog-gorsel.py <liste.json>
liste.json: [[kaynak_yol, hedef_yol, uzun_kenar], ...]
"""
import json
import sys
from pathlib import Path

from PIL import Image

for kaynak, hedef, uzun in json.loads(Path(sys.argv[1]).read_text()):
    im = Image.open(kaynak).convert('RGB')
    im.thumbnail((uzun, uzun), Image.LANCZOS)
    Path(hedef).parent.mkdir(parents=True, exist_ok=True)
    im.save(hedef, 'WEBP', quality=80, method=6)
print('görsel:', len(json.loads(Path(sys.argv[1]).read_text())))
