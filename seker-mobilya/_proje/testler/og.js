// OG görseli = yeni girişin 1200×630 ekran görüntüsü: node seker-mobilya/_proje/testler/og.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:8765/seker-mobilya/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.giris{min-height:630px!important}.giris__not,.alt-cubuk{display:none}.giris__duvar li{animation:none!important}' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: 'seker-mobilya/img/og.jpg', type: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await b.close();
})();
