// Kabul testleri: node seker-mobilya/_proje/testler/test.js  (kökte: python3 -m http.server 8765)
const { chromium } = require('playwright');
const B = 'http://localhost:8765/seker-mobilya/';
const yollar = ['', 'tv-unitesi/', 'banyo/', 'mutfak/', 'giyinme-odasi-gardirop/', 'portmanto/', 'duvar-paneli-petek-kapama/', 'isler/'];
(async () => {
  const b = await chromium.launch();
  let hata = 0, test = 0;
  const ok = (c, m) => { test++; if (!c) { hata++; console.log('❌', m); } };
  const hrefler = new Set();
  for (const [ad, vp] of [['masa', { width: 1366, height: 860 }], ['tablet', { width: 900, height: 1000 }], ['mobil', { width: 375, height: 760 }]]) {
    const ctx = await b.newContext({ viewport: vp });
    for (const y of yollar) {
      const p = await ctx.newPage();
      const errs = [], bad = [], dis = [];
      p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
      p.on('pageerror', e => errs.push(String(e)));
      p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
      p.on('request', r => { if (!r.url().startsWith('http://localhost')) dis.push(r.url()); });
      await p.goto(B + y, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { for (let i = 0; i < document.body.scrollHeight; i += 600) { scrollTo(0, i); await new Promise(r => setTimeout(r, 25)); } scrollTo(0, 0); });
      await p.waitForTimeout(300);
      const r = await p.evaluate(() => ({
        title: document.title, meta: document.querySelector('meta[name=description]').content,
        h1: document.querySelectorAll('h1').length, canon: (document.querySelector('link[rel=canonical]') || {}).href,
        tasma: document.documentElement.scrollWidth - innerWidth,
        kirik: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src),
        altYok: [...document.images].filter(i => !i.hasAttribute('alt')).length,
        buyuk: [...document.images].filter(i => { const r = i.getBoundingClientRect(); return r.width > 362 || r.height > 446; }).map(i => i.src),
        ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { JSON.parse(s.textContent); return 1 } catch (e) { return 0 } }),
        wa: [...document.querySelectorAll('a[href*="wa.me"]')].map(a => a.href),
        tel: [...document.querySelectorAll('a[href^="tel:"]')].map(a => a.getAttribute('href')),
        hrefs: [...document.querySelectorAll('a[href]')].map(a => a.href),
        gizli: [...document.querySelectorAll('[hidden]')].filter(e => getComputedStyle(e).display !== 'none').length,
        adres: document.body.innerText.includes('Ahmet Yesevi Cd. No:120'),
        yaziliYok: ![...document.images].some(i => /reels|oncesi|petek-kapama|genc-odasi/.test(i.src)),
      }));
      r.hrefs.forEach(h => hrefler.add(h));
      ok(errs.length === 0, `${ad} ${y} konsol: ${errs.join(' | ')}`);
      ok(bad.length === 0, `${ad} ${y} kötü yanıt: ${bad.join(' | ')}`);
      ok(dis.length === 0, `${ad} ${y} dış istek (harita tıklanmadan): ${dis.join(' | ')}`);
      ok(r.title.length <= 60, `${y} title ${r.title.length}`);
      ok(r.meta.length <= 155 && r.meta.length > 70, `${y} meta ${r.meta.length}`);
      ok(r.h1 === 1, `${y} h1 ${r.h1}`);
      ok(r.canon === B.replace('http://localhost:8765/', 'https://selahattinpeltek46-sudo.github.io/imfa-yap-/') + y, `${y} canonical ${r.canon}`);
      ok(r.tasma <= 0, `${ad} ${y} yatay taşma ${r.tasma}`);
      ok(r.kirik.length === 0, `${y} kırık görsel ${r.kirik}`);
      ok(r.altYok === 0, `${y} alt yok`);
      ok(r.buyuk.length === 0, `${ad} ${y} 360 px'ten büyük gösterilen görsel ${r.buyuk}`);
      ok(r.yaziliYok, `${y} kaldırılan Reels kapağı hâlâ var`);
      ok(r.ld.length > 0 && r.ld.every(Boolean), `${y} JSON-LD`);
      ok(r.wa.length > 0 && r.wa.every(h => h.startsWith('https://wa.me/905357618538?text=')), `${y} WhatsApp ${r.wa}`);
      ok(r.tel.length > 0 && r.tel.every(h => h === 'tel:+905357618538'), `${y} tel ${r.tel}`);
      ok(r.gizli === 0, `${y} [hidden] görünüyor`);
      ok(r.adres, `${y} NAP adres yok`);
      await p.close();
    }
    await ctx.close();
  }
  // iç bağlantılar
  for (const h of hrefler) {
    if (!h.startsWith('http://localhost')) continue;
    const r = await (await b.newPage()).goto(h.split('#')[0]);
    ok(r && r.status() === 200, `kırık iç bağlantı ${h}`);
  }
  // etkileşim
  const p = await (await b.newContext({ viewport: { width: 375, height: 760 } })).newPage();
  await p.goto(B + 'banyo/', { waitUntil: 'networkidle' });
  ok(await p.locator('input[name=tur]:checked').inputValue() === 'Banyo dolabı / banyo yenileme', 'banyo sayfasında tür ön seçili');
  await p.locator('label.secim:has-text("Odanın tamamı")').click();
  await p.fill('input[name=ilce]', 'Yenibosna');
  await p.fill('input[name=olcu]', '2,10 m');
  const metin = decodeURIComponent((await p.locator('[data-wa]').getAttribute('href')).split('text=')[1]);
  ok(metin === 'Merhaba Şeker Mobilya, banyo dolabı / banyo yenileme için bilgi almak istiyorum.\nKapsam: odanın tamamı\nSemt / ilçe: Yenibosna\nNot: 2,10 m\nFotoğrafları bu mesajın ardından gönderiyorum.', 'WhatsApp metni: ' + metin);
  ok((await p.locator('[data-onizleme]').textContent()) === metin, 'önizleme = gönderilen metin');
  const renk = await p.locator('[data-wa]').evaluate(a => [getComputedStyle(a).color, getComputedStyle(a).backgroundColor]);
  ok(renk[0] !== renk[1], 'WhatsApp düğmesi okunur (yazı ≠ zemin) ' + renk);
  // TV ünitesi: "TV" küçülmez, JS ile Python aynı metni üretir
  await p.goto(B + 'tv-unitesi/', { waitUntil: 'networkidle' });
  const ilk = await p.locator('[data-onizleme]').textContent();
  ok(ilk.startsWith('Merhaba Şeker Mobilya, TV ünitesi / duvar ünitesi için'), 'TV metni: ' + ilk);
  // menü
  ok(!(await p.locator('#menu').isVisible()), 'mobil menü başta kapalı');
  await p.click('.menu-dugme'); ok(await p.locator('#menu').isVisible(), 'menü açılıyor');
  await p.keyboard.press('Escape'); ok(!(await p.locator('#menu').isVisible()), 'Esc menüyü kapatıyor');
  // ana sayfa: şeffaf üst çubuk kaydırınca doluyor; kart mesajı önceden dolduruyor
  await p.goto(B, { waitUntil: 'networkidle' });
  ok(!(await p.locator('.ust').evaluate(e => e.classList.contains('dolu'))), 'üst çubuk başta şeffaf');
  await p.evaluate(() => scrollTo(0, 600)); await p.waitForTimeout(100);
  ok(await p.locator('.ust').evaluate(e => e.classList.contains('dolu')), 'üst çubuk kaydırınca dolu');
  await p.locator('.kart a[data-sec-tur="Mutfak dolabı"]').click();
  ok(await p.locator('input[name=tur]:checked').inputValue() === 'Mutfak dolabı', 'kart türü seçiyor');
  await p.locator('.ihtiyac a:has-text("Bir köşe için yazın")').click();
  ok(await p.locator('input[name=kapsam]:checked').inputValue() === 'tek parça', 'ihtiyaç kapsamı seçiyor');
  ok(await p.locator('input[name=tur]:checked').count() === 0, 'ihtiyaç (türsüz) türü temizliyor');
  // kaydırmalı satırlarda tembel görseller görünür olunca yükleniyor
  const satir = p.locator('.satir__liste').nth(1);
  await satir.scrollIntoViewIfNeeded();
  await satir.evaluate(el => el.scrollTo(el.scrollWidth, 0)); await p.waitForTimeout(600);
  ok(await satir.evaluate(el => [...el.querySelectorAll('img')].every(i => i.complete && i.naturalWidth > 0)), 'satırdaki tüm görseller yüklendi');
  // harita tıkla-yükle
  ok(await p.locator('.harita iframe').count() === 0, 'harita başta yüklenmemiş');
  await p.click('.harita__dugme'); ok(await p.locator('.harita iframe').count() === 1, 'harita tıklayınca yükleniyor');
  // galeri süzgeci + hashchange
  await p.goto(B + 'isler/#banyo', { waitUntil: 'networkidle' });
  const say = () => p.evaluate(() => [...document.querySelectorAll('.kare')].filter(k => !k.hidden).length);
  ok(await say() === 8, 'isler/#banyo 8 kare: ' + await say());
  await p.evaluate(() => { location.hash = 'tv'; }); await p.waitForTimeout(100);
  ok(await say() === 4, 'hashchange #tv 4 kare: ' + await say());
  await p.click('[data-filtre=hepsi]'); ok(await say() === 25, 'hepsi 25');
  await p.click('[data-filtre=mutfak]');
  ok(await p.evaluate(() => dataLayer.some(o => o.event === 'galeri_suz' && o.tur === 'mutfak')), 'dataLayer galeri_suz');
  console.log(`${test - hata}/${test} test geçti`);
  await b.close();
  process.exit(hata ? 1 : 0);
})();
