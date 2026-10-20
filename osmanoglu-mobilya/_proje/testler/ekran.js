// Kullanım: node ekran.js <çıktı klasörü> [yol...]  (kökte: python3 -m http.server 8766)
// Önce ilk ekran (hero, animasyon bitince), sonra tam sayfa; masa (1440) + mobil (375)
const { chromium } = require('playwright');
const B = 'http://localhost:8766/osmanoglu-mobilya/';
const [out, ...yollar] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  for (const [ad, vp] of [['masa', { width: 1440, height: 900 }], ['mobil', { width: 375, height: 760 }]]) {
    const p = await (await b.newContext({ viewport: vp, deviceScaleFactor: 1 })).newPage();
    for (const y of (yollar.length ? yollar : [''])) {
      const n = (y || 'ana').replace(/\W+/g, '');
      await p.goto(B + y, { waitUntil: 'networkidle' });
      await p.waitForTimeout(3000);
      await p.screenshot({ path: `${out}/${ad}-${n}-hero.png` });
      await p.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 500) { scrollTo(0, i); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
      await p.waitForTimeout(900);
      await p.screenshot({ path: `${out}/${ad}-${n}.png`, fullPage: true });
    }
  }
  await b.close();
})();
