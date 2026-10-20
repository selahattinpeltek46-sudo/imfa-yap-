// Kullanım: node ekran.js <çıktı klasörü> [yol...]  — tam sayfa masa (1366) + mobil (375) ekran görüntüsü
const { chromium } = require('playwright');
const B = 'http://localhost:8765/seker-mobilya/';
const [out, ...yollar] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  for (const [ad, vp] of [['masa', { width: 1366, height: 860 }], ['mobil', { width: 375, height: 760 }]]) {
    const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 1 })).newPage();
    for (const y of (yollar.length ? yollar : [''])) {
      await p.goto(B + y, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 500) { scrollTo(0, i); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
      await p.waitForTimeout(400);
      await p.screenshot({ path: `${out}/${ad}-${(y || 'ana').replace(/\W+/g, '')}.png`, fullPage: true });
    }
  }
  await b.close();
})();
