// Paylaşım görseli: ana sayfa girişinin 1200×630 ekran görüntüsü (fotoğraf duvarı + başlık).
// Kullanım: repo kökünde `python3 -m http.server 8765`, sonra `NODE_PATH=$(npm root -g) node og.js <çıktı.jpg>`
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:8765/aytac-mobilya/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.ust__ic nav,.ust__cta,.giris__not,.eylemler{display:none!important}.giris{min-height:630px!important}.giris__ic{padding-top:70px!important}.giris__duvar li{animation:none!important}' });
  await p.waitForTimeout(400);
  await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 86 });
  await b.close();
})();
