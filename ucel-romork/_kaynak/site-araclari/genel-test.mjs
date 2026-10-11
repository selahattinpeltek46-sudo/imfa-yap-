// Kullanım: node genel-test.mjs yol1 yol2 ...  (ör. urunler/mibzer/)
import { chromium } from '/home/user/imfa-yap-/ucel-romork/_kaynak/node_modules/playwright-core/index.mjs';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const kok = '/home/user/ucel-tarim-aletleri', BAS = '/ucel-tarim-aletleri';
const tip = { '.html':'text/html; charset=utf-8', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.pdf':'application/pdf', '.json':'application/json' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]).slice(BAS.length); if (p.endsWith('/')) p += 'index.html'; const f = path.join(kok, p); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': tip[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(8771);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const yol of process.argv.slice(2)) for (const w of [360, 1280]) {
  const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
  await ctx.route(/fonts\.(googleapis|gstatic)|maps\.google/, (r) => r.abort());
  const pg = await ctx.newPage(); const hata = [];
  pg.on('pageerror', (e) => hata.push(String(e))); pg.on('response', (x) => x.status() >= 400 && hata.push(x.status() + ' ' + x.url()));
  await pg.goto('http://localhost:8771' + BAS + '/' + yol + '?k=ig', { waitUntil: 'networkidle' });
  const r = await pg.evaluate(async () => {
    const tasan = [...document.querySelectorAll('body *')].filter((e) => { const x = e.getBoundingClientRect(); return x.width && x.right > innerWidth + 1 && !e.closest('.nav-links,.us-tablo-kap'); }).map((e) => e.className).slice(0, 3);
    const lum = (c) => { const v = c.match(/[\d.]+/g).slice(0, 3).map((n) => { n /= 255; return n <= .03928 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4; }); return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
    const bg = (e) => { while (e) { const c = getComputedStyle(e).backgroundColor; if (c && !c.endsWith(', 0)') && c !== 'transparent') return c; e = e.parentElement; } return 'rgb(27,27,29)'; };
    const kontrast = []; document.querySelectorAll('main *').forEach((e) => { if (!e.offsetParent || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const cs = getComputedStyle(e); const a = lum(cs.color), c = lum(bg(e)); const o = (Math.max(a, c) + .05) / (Math.min(a, c) + .05); const buyuk = parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700); if (o < (buyuk ? 3 : 4.5)) kontrast.push(e.textContent.trim().slice(0, 20) + ' ' + o.toFixed(2)); });
    const kirik = []; for (const l of new Set([...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)))) { const res = await fetch(l.split('#')[0]); if (!res.ok) kirik.push(l); else if (l.includes('#') && l.split('#')[0] === location.href.split('#')[0].split('?')[0] + location.search && !document.getElementById(l.split('#')[1])) kirik.push(l); }
    return { tasan, kontrast: kontrast.slice(0, 3), kirik, h1: document.querySelectorAll('h1').length, waEtiketsiz: [...document.querySelectorAll('a[href^="https://wa.me/"]')].filter((a) => !a.closest('.footer-social') && !decodeURIComponent(a.href).includes('(Instagram)')).length };
  });
  let mesaj = '';
  if (w === 360 && await pg.locator('form.us-form').count()) {
    await pg.evaluate(() => { window._a = []; window.open = (x) => window._a.push(x); });
    const ilk = pg.locator('form.us-form input[type=text]').first(); await ilk.fill('Deneme');
    if (await pg.locator('form.us-form .us-secim label').count()) await pg.locator('form.us-form .us-secim label').first().click();
    await pg.locator('form.us-form button[type=submit]').click();
    mesaj = await pg.evaluate(() => window._a[0] ? decodeURIComponent(window._a[0].split('text=')[1]).replace(/\n/g, ' | ') : 'MESAJ YOK');
  }
  console.log(yol, w, JSON.stringify(r), hata.length ? JSON.stringify(hata) : '', mesaj);
  await ctx.close();
}
await b.close(); srv.close();
