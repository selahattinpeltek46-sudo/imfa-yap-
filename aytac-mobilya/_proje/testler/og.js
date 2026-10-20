const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto('http://localhost:8765/aytac-mobilya/_proje/og.html');
  await p.waitForTimeout(500);
  await p.screenshot({ path: process.argv[2], type: 'jpeg', quality: 86 });
  await b.close();
})();
