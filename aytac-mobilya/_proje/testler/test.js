const { chromium } = require('playwright');
const B = 'http://localhost:8765/aytac-mobilya/';
const yollar = ['', 'mutfak-dolabi/', 'gardirop/', 'banyo-dolabi/', 'vestiyer/', 'tv-unitesi-kitaplik/', 'isler/'];
const out = process.argv[2];
(async () => {
  const b = await chromium.launch();
  let hata = 0;
  const ok = (c, m) => { if (!c) { hata++; console.log('❌', m); } };
  for (const [ad, vp] of [['masa', { width: 1366, height: 860 }], ['mobil', { width: 375, height: 760 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    for (const y of yollar) {
      const p = await ctx.newPage();
      const errs = [];
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', e => errs.push(String(e)));
      const bad = [];
      p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
      await p.goto(B + y, { waitUntil: 'networkidle' });
      // tembel görselleri yükle
      await p.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 600) { window.scrollTo(0, i); await new Promise(r => setTimeout(r, 90)); } window.scrollTo(0, 0); });
      await p.evaluate(async()=>{for(const u of document.querySelectorAll(".satir__liste")){u.scrollLeft=9999;await new Promise(r=>setTimeout(r,150));u.scrollLeft=0}}); await p.waitForTimeout(600);
      const r = await p.evaluate(() => ({
        title: document.title, meta: document.querySelector('meta[name=description]').content,
        h1: document.querySelectorAll('h1').length, canon: !!document.querySelector('link[rel=canonical]'),
        tasma: document.documentElement.scrollWidth - innerWidth,
        kirik: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
        altYok: [...document.images].filter(i => !i.hasAttribute('alt')).length,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return 1 } catch (e) { return 0 } }),
        gonder: (document.querySelector('[data-gonder]') || {}).href,
        onizleme: (document.querySelector('[data-onizleme]') || {}).textContent,
      }));
      ok(errs.length === 0, `${ad} ${y} konsol: ${errs.join(' | ')}`);
      ok(bad.length === 0, `${ad} ${y} kötü yanıt: ${bad.join(' | ')}`);
      ok(r.title.length <= 60, `${y} title ${r.title.length}`);
      ok(r.meta.length <= 155 && r.meta.length > 70, `${y} meta ${r.meta.length}`);
      ok(r.h1 === 1, `${y} h1 ${r.h1}`);
      ok(r.canon, `${y} canonical`);
      ok(r.tasma <= 0, `${ad} ${y} yatay taşma ${r.tasma}`);
      ok(r.kirik.length === 0, `${y} kırık görsel ${r.kirik}`);
      ok(r.altYok === 0, `${y} alt yok`);
      ok(r.ld.every(x => x), `${y} json-ld`);
      ok(r.gonder === 'https://ig.me/m/aytac_mobilya', `${y} gönder ${r.gonder}`);
      if (ad === 'masa') console.log(y || '/', r.title.length, r.meta.length, JSON.stringify(r.onizleme));
      if (y === '' || y === 'mutfak-dolabi/' || y === 'isler/') await p.screenshot({ path: `${out}/${ad}-${y.replace('/', '') || 'ana'}.png`, fullPage: true });
      await p.close();
    }
    await ctx.close();
  }
  console.log(hata ? `${hata} hata` : 'TÜM KONTROLLER GEÇTİ');
  await b.close();
})();
