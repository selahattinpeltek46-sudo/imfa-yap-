# WhatsApp için hafif PDF: katalog/Ucel-Katalog-2026-hafif.pdf
#   python3 ucel-romork/_kaynak/katalog_hafif.py   (önce katalog.mjs ile index.html üretilmiş olmalı)
# Asıl katalog geçici bir klasöre kopyalanır, yalnızca görseller telefonda net kalacak boyuta
# küçültülür (fotoğraf en fazla 1100 px, ürün görseli 900 px), sonra aynı sayfadan PDF basılır.
# Fotoğrafların rengine ve kırpımına dokunulmaz.
import pathlib
import sys
import shutil
import subprocess
import tempfile

from PIL import Image

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import pdf_sikistir  # noqa: E402

KATALOG = pathlib.Path(__file__).resolve().parent.parent / 'katalog'
HEDEF = KATALOG / 'Ucel-Katalog-2026-hafif.pdf'

with tempfile.TemporaryDirectory() as tmp:
    kopya = pathlib.Path(tmp) / 'katalog'
    shutil.copytree(KATALOG, kopya, ignore=shutil.ignore_patterns('*.pdf'))
    for f in (kopya / 'img').iterdir():
        if f.suffix == '.jpg':
            im = Image.open(f); im.thumbnail((1100, 1100)); im.save(f, quality=80, optimize=True, progressive=True)
        elif f.suffix == '.png':
            im = Image.open(f); im.thumbnail((900, 900)); im.save(f, optimize=True)
    js = f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{kopya}/index.html', {{ waitUntil: 'networkidle' }});
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({{ path: '{HEDEF}', format: 'A4', printBackground: true, preferCSSPageSize: true }});
  await b.close();
}})();"""
    subprocess.run(['node', '-e', js], check=True, env={**__import__('os').environ, 'NODE_PATH': '/usr/local/lib/node_modules_global'})
pdf_sikistir.birlestir(HEDEF)
pdf_sikistir.jpeg_yap(HEDEF)
print(HEDEF, round(HEDEF.stat().st_size / 1e6, 1), 'MB')
