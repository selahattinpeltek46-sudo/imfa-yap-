// Kabul testleri: node osmanoglu-mobilya/_proje/testler/test.js  (kökte: python3 -m http.server 8766)
const { chromium } = require('playwright');
const B = 'http://localhost:8766/osmanoglu-mobilya/';
const CANLI = 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/osmanoglu-mobilya/';
const yollar = ['', 'mutfak-dolabi/', 'vestiyer-gomme-dolap/', 'karavan-mobilyasi/', 'projeler/', 'projeler/pencere-onu-l-mutfak/',
  'projeler/aynali-citali-antre/', 'nasil-calisiyoruz/', 'bilgi-merkezi/', 'bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/',
  'bilgi-merkezi/kaba-olcu-nasil-alinir/', 'iletisim/'];
// fotoğraflı tam boy hero'su olan sayfalar
const fotolu = ['', 'mutfak-dolabi/', 'vestiyer-gomme-dolap/', 'karavan-mobilyasi/', 'projeler/pencere-onu-l-mutfak/', 'projeler/aynali-citali-antre/'];
(async () => {
  const b = await chromium.launch();
  let hata = 0, test = 0;
  const ok = (c, m) => { test++; if (!c) { hata++; console.log('❌', m); } };
  const hrefler = new Set();
  for (const [ad, vp] of [['masa', { width: 1440, height: 900 }], ['tablet', { width: 820, height: 1180 }], ['mobil', { width: 375, height: 760 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    for (const y of yollar) {
      const p = await ctx.newPage();
      const errs = [], bad = [], dis = [];
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', e => errs.push(String(e)));
      p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
      p.on('request', r => { if (!r.url().startsWith('http://localhost')) dis.push(r.url()); });
      await p.goto(B + y, { waitUntil: 'networkidle' });
      await p.waitForTimeout(2600);
      const hero = await p.evaluate(() => {
        const h = document.querySelector('.hero'), m = document.querySelector('.mozaik');
        // karartma / bulanıklık yok: mozaik ve karelerde filtre yok, kareleri kaplayan renkli / gradyan katman yok
        const katman = m ? [...m.querySelectorAll('*')].filter(el => {
          const c = getComputedStyle(el);
          if (c.filter !== 'none' || c.backdropFilter !== 'none') return true;
          if (el.tagName === 'IMG' || el.matches('figcaption, button, .mozaik__sutun, .mozaik__serit, .karo')) return false;
          return c.backgroundColor !== 'rgba(0, 0, 0, 0)' || c.backgroundImage !== 'none';
        }).map(el => el.className) : [];
        const kareler = m ? [...m.querySelectorAll('.karo img')].filter(i => { const r = i.getBoundingClientRect(); return r.width > 0 && r.bottom > 0 && r.top < innerHeight; }) : [];
        // kalite: hiçbir kare doğal çözünürlüğünden büyük gösterilmez
        const buyutulen = kareler.filter(i => i.getBoundingClientRect().width > i.naturalWidth + 1).map(i => i.currentSrc);
        const mr = m && m.getBoundingClientRect();
        return { var: !!(h && m), yuk: h ? h.getBoundingClientRect().height : 0, ekran: innerHeight - document.querySelector('.ust').offsetHeight,
          katman, filtre: m ? getComputedStyle(m).filter : 'none', gorunen: kareler.length, buyutulen, mozaikYuk: mr ? mr.height : 0 };
      });
      if (fotolu.includes(y)) {
        ok(hero.var, `${y} mozaik hero yok`);
        ok(hero.yuk >= hero.ekran - 1, `${ad} ${y} hero tam boy değil: ${hero.yuk} < ${hero.ekran}`);
        ok(hero.katman.length === 0 && hero.filtre === 'none', `${ad} ${y} hero üstünde karartma/bulanıklık: ${hero.katman}`);
        ok(hero.gorunen >= 4, `${ad} ${y} ilk ekranda görünen kare ${hero.gorunen}`);
        ok(hero.buyutulen.length === 0, `${ad} ${y} büyütülen (bulanık) kare: ${hero.buyutulen}`);
        ok(hero.mozaikYuk >= 300, `${ad} ${y} mozaik yüksekliği ${hero.mozaikYuk}`);
      }
      await p.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 600) { scrollTo(0, i); await new Promise(r => setTimeout(r, 25)); } scrollTo(0, 0); });
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => ({
        title: document.title, meta: document.querySelector('meta[name=description]').content,
        h1: document.querySelectorAll('h1').length, canon: (document.querySelector('link[rel=canonical]') || {}).href,
        tasma: document.documentElement.scrollWidth - innerWidth,
        kirik: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
        altYok: [...document.images].filter(i => !i.getAttribute('alt')).length,
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return JSON.stringify(j).includes('aggregateRating') ? 0 : 1 } catch (e) { return 0 } }),
        wa: [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.href),
        tel: [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href')),
        hrefs: [...document.querySelectorAll('a[href]')].map(a => a.href),
        gizli: [...document.querySelectorAll('[hidden]')].filter(e => getComputedStyle(e).display !== 'none').length,
        nap: document.body.innerText.includes('Ahi Evran Mahallesi, Sincan Sanayi Sitesi') && document.body.innerText.includes('0532 177 06 19'),
        beklet: [...document.querySelectorAll('.beklet')].filter(e => !e.classList.contains('gorundu')).length,
      }));
      r.hrefs.forEach(h => hrefler.add(h));
      ok(errs.length === 0, `${ad} ${y} konsol: ${errs.join(' | ')}`);
      ok(bad.length === 0, `${ad} ${y} kötü yanıt: ${bad.join(' | ')}`);
      ok(dis.length === 0, `${ad} ${y} dış istek (harita tıklanmadan): ${dis.join(' | ')}`);
      ok(r.title.length <= 60, `${y} title ${r.title.length}`);
      ok(r.meta.length <= 155 && r.meta.length > 70, `${y} meta ${r.meta.length}`);
      ok(r.h1 === 1, `${y} h1 ${r.h1}`);
      ok(r.canon === CANLI + y, `${y} canonical ${r.canon}`);
      ok(r.tasma <= 0, `${ad} ${y} yatay taşma ${r.tasma}`);
      ok(r.kirik.length === 0, `${y} kırık görsel ${r.kirik}`);
      ok(r.altYok === 0, `${y} alt yok`);
      ok(r.ld.length > 0 && r.ld.every(Boolean), `${y} JSON-LD (geçerli, aggregateRating yok)`);
      ok(r.wa.length > 0 && r.wa.every(h => h.startsWith('https://wa.me/905321770619?text=')), `${y} WhatsApp ${r.wa}`);
      ok(r.tel.length > 0 && r.tel.every(h => h === 'tel:+905321770619'), `${y} tel ${r.tel}`);
      ok(r.gizli === 0, `${y} [hidden] görünüyor`);
      ok(r.nap, `${y} NAP eksik`);
      ok(r.beklet === 0, `${ad} ${y} kaydırınca görünmeyen bölüm ${r.beklet}`);
      await p.close();
    }
    await ctx.close();
  }
  // iç bağlantılar
  const bp = await b.newPage();
  for (const h of hrefler) {
    if (!h.startsWith('http://localhost')) continue;
    const r = await bp.goto(h.split('#')[0]);
    ok(r && r.status() === 200, `kırık iç bağlantı ${h}`);
    const id = h.split('#')[1];
    if (id) ok(await bp.locator('#' + id).count() === 1, `çapa yok ${h}`);
  }
  // mozaik hareketi, Durdur ve az hareket tercihi
  const p = await (await b.newContext({ viewport: { width: 375, height: 760 } })).newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  const konum = () => p.evaluate(() => getComputedStyle(document.querySelector('.mozaik__serit')).transform);
  const k1 = await konum(); await p.waitForTimeout(1500); const k2 = await konum();
  ok(k1 !== k2, 'mozaik kayıyor');
  await p.click('[data-dur]'); await p.waitForTimeout(200);
  const k3 = await konum(); await p.waitForTimeout(1500);
  ok(k3 === await konum(), 'Durdur çalışıyor (karşıt kontrol)');
  ok(await p.getAttribute('[data-dur]', 'aria-pressed') === 'true', 'Durdur aria-pressed');
  ok(await p.evaluate(() => [...document.querySelectorAll('.karo[aria-hidden="true"]')].length > 0), 'döngü kopyaları ekran okuyucudan gizli');
  const pr = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await pr.goto(B, { waitUntil: 'networkidle' });
  ok(await pr.evaluate(() => document.querySelector('[data-mozaik]').classList.contains('durdu')), 'reduced-motion: mozaik duruk');
  // Instagram galerisi: büyütme yok, süzgeç çalışıyor
  for (const vp of [{ width: 1440, height: 900 }, { width: 375, height: 760 }]) {
    const g = await (await b.newContext({ viewport: vp })).newPage();
    await g.goto(B + 'projeler/', { waitUntil: 'networkidle' });
    await g.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 500) { scrollTo(0, i); await new Promise(r => setTimeout(r, 30)); } });
    const buyuk = await g.evaluate(() => [...document.querySelectorAll('.ig-kare img')].filter(i => i.getBoundingClientRect().width > i.naturalWidth + 1).length);
    ok(buyuk === 0, `${vp.width} galeride büyütülen kare ${buyuk}`);
    if (vp.width === 1440) {
      const say = () => g.evaluate(() => [...document.querySelectorAll('#galeri .ig-kare')].filter(f => !f.hidden).length);
      const hepsi = await say();
      await g.click('#galeri [data-suz="karavan"]');
      ok(await say() === 4 && hepsi > 20, `süzgeç karavan 4 / hepsi ${hepsi}: ${await say()}`);
      await g.click('#galeri [data-suz="hepsi"]');
      ok(await say() === hepsi, 'süzgeç hepsi geri geliyor');
    }
  }
  // mesaj hazırlayıcı
  await p.goto(B + 'mutfak-dolabi/', { waitUntil: 'networkidle' });
  ok(await p.locator('input[name=tur]:checked').inputValue() === 'Mutfak dolabı', 'mutfak sayfasında tür ön seçili');
  await p.fill('input[name=ilce]', 'Eryaman');
  await p.fill('input[name=olcu]', '320 × 260 cm, L');
  const href = await p.locator('[data-wa]').getAttribute('href');
  const metin = decodeURIComponent(href.split('text=')[1]);
  ok(metin === 'Merhaba, mutfak dolabı için bilgi almak istiyorum.\nSemt / ilçe: Eryaman\nKaba ölçü: 320 × 260 cm, L\nAlanın fotoğraflarını bu mesajın ardından gönderiyorum.', 'WhatsApp metni: ' + metin);
  ok((await p.locator('[data-onizleme]').textContent()) === metin, 'önizleme = gönderilen metin');
  await p.locator('label.secim:has-text("Karavan")').click();
  ok(decodeURIComponent((await p.locator('[data-wa]').getAttribute('href')).split('text=')[1]).startsWith('Merhaba, karavan için'), 'tür değişince metin değişiyor');
  // menü
  ok(!(await p.locator('#menu').isVisible()), 'mobil menü başta kapalı');
  await p.click('.menu-dugme'); await p.waitForTimeout(400); ok(await p.locator('#menu').isVisible(), 'menü açılıyor');
  await p.keyboard.press('Escape'); await p.waitForTimeout(400); ok(!(await p.locator('#menu').isVisible()), 'Esc menüyü kapatıyor');
  // harita tıkla-yükle (iletişim sayfası)
  await p.goto(B + 'iletisim/', { waitUntil: 'networkidle' });
  ok(await p.locator('.harita iframe').count() === 0, 'harita başta yüklenmemiş');
  await p.route('https://maps.google.com/**', r => r.fulfill({ body: 'harita' }));
  await p.click('.harita button'); ok(await p.locator('.harita iframe').count() === 1, 'harita tıklayınca yükleniyor');
  // dataLayer
  await p.click('#iletisim a[href^="tel:"]', { noWaitAfter: true }).catch(() => {});
  ok(await p.evaluate(() => dataLayer.some(o => o.event === 'telefon_tikla') && dataLayer.some(o => o.event === 'harita_yukle')), 'dataLayer olayları');
  console.log(`${test - hata}/${test} test geçti`);
  await b.close();
  process.exit(hata ? 1 : 0);
})();
