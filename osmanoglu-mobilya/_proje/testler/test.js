// Kabul testleri: node osmanoglu-mobilya/_proje/testler/test.js  (kökte: python3 -m http.server 8766)
const { chromium } = require('playwright');
const B = 'http://localhost:8766/osmanoglu-mobilya/';
const CANLI = 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/osmanoglu-mobilya/';
const yollar = ['', 'mutfak-dolabi/', 'vestiyer-gomme-dolap/', 'karavan-mobilyasi/', 'projeler/', 'projeler/pencere-onu-l-mutfak/',
  'projeler/aynali-citali-antre/', 'nasil-calisiyoruz/', 'bilgi-merkezi/', 'bilgi-merkezi/mutfak-dolabi-yaptirmadan-once/',
  'bilgi-merkezi/kaba-olcu-nasil-alinir/', 'iletisim/'];
// fotoğraflı tam boy hero'su olan sayfalar
const fotolu = ['', 'mutfak-dolabi/', 'vestiyer-gomme-dolap/', 'projeler/pencere-onu-l-mutfak/', 'projeler/aynali-citali-antre/'];
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
        const h = document.querySelector('.hero'), s = document.querySelector('.sahne');
        const st = s ? getComputedStyle(s) : null;
        // karartma / bulanıklık yok: sahne ve fotoğraf üstünde filtre, yarı saydam katman, gradyan olmamalı
        const katman = s ? [...s.querySelectorAll('*')].filter(el => {
          const c = getComputedStyle(el), r = el.getBoundingClientRect(), sr = s.getBoundingClientRect();
          const tamKaplar = r.width >= sr.width * .9 && r.height >= sr.height * .9;
          return c.filter !== 'none' || c.backdropFilter !== 'none' || (tamKaplar && el.tagName !== 'IMG' && el.tagName !== 'FIGURE' && !el.classList.contains('kare') && !el.classList.contains('etiketler') && (c.backgroundColor !== 'rgba(0, 0, 0, 0)' || c.backgroundImage !== 'none'));
        }).map(el => el.className) : [];
        const gorunurEtiket = [...document.querySelectorAll('.slayt.aktif .etiket')].filter(e => !e.classList.contains('disarida') && getComputedStyle(e).opacity > .9);
        const sr = s && s.getBoundingClientRect();
        const etiketTasma = sr ? gorunurEtiket.filter(e => { const r = e.querySelector('b').getBoundingClientRect(); return r.left < sr.left - 1 || r.right > sr.right + 1; }).length : 0;
        const kesis = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        const engel = [...document.querySelectorAll('.hero__kart, .hero__kontrol')].map(x => x.getBoundingClientRect());
        const ortulen = gorunurEtiket.filter(e => engel.some(g => kesis(e.getBoundingClientRect(), g))).length;
        return { var: !!(h && s), yuk: h ? h.getBoundingClientRect().height : 0, ekran: innerHeight - document.querySelector('.ust').offsetHeight,
          katman, filtre: st ? st.filter : 'none', etiket: gorunurEtiket.length, etiketTasma, ortulen };
      });
      if (fotolu.includes(y)) {
        ok(hero.var, `${y} fotoğraflı hero yok`);
        ok(hero.yuk >= hero.ekran - 1, `${ad} ${y} hero tam boy değil: ${hero.yuk} < ${hero.ekran}`);
        ok(hero.katman.length === 0 && hero.filtre === 'none', `${ad} ${y} hero üstünde karartma/bulanıklık: ${hero.katman}`);
        ok(hero.etiket >= 2, `${ad} ${y} görünür detay etiketi ${hero.etiket}`);
        ok(hero.etiketTasma === 0, `${ad} ${y} etiket sahneden taşıyor (${hero.etiketTasma})`);
        ok(hero.ortulen === 0, `${ad} ${y} etiket kartın / kontrolün altında (${hero.ortulen})`);
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
  // slayt gösterisi
  const p = await (await b.newContext({ viewport: { width: 375, height: 760 } })).newPage();
  await p.goto(B, { waitUntil: 'networkidle' });
  const aktif = () => p.evaluate(() => document.querySelector('.slayt.aktif').dataset.slayt);
  ok(await aktif() === '0', 'ilk slayt aktif');
  await p.waitForTimeout(7600); ok(await aktif() === '1', 'slayt kendiliğinden ilerliyor: ' + await aktif());
  await p.click('[data-git="2"]'); ok(await aktif() === '2', 'kanal düğmesi slayta gidiyor');
  ok((await p.locator('[data-ad]').textContent()).startsWith('Antre'), 'slayt adı güncelleniyor');
  await p.click('[data-dur]'); await p.waitForTimeout(7600);
  ok(await aktif() === '2', 'Durdur çalışıyor (karşıt kontrol)');
  ok(await p.getAttribute('[data-dur]', 'aria-pressed') === 'true', 'Durdur aria-pressed');
  // az hareket tercihinde otomatik geçiş yok
  const pr = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })).newPage();
  await pr.goto(B, { waitUntil: 'networkidle' }); await pr.waitForTimeout(7600);
  ok(await pr.evaluate(() => document.querySelector('.slayt.aktif').dataset.slayt) === '0', 'reduced-motion: otomatik geçiş yok');
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
