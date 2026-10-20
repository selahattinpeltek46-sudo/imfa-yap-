const { chromium } = require('playwright');
const B = 'http://localhost:8765/aytac-mobilya/';
(async () => {
  const b = await chromium.launch();
  let hata = 0; const ok = (c, m) => { console.log(c ? '✅' : '❌', m); if (!c) hata++; };

  // 1) Numara yokken: Instagram modu + kopyalama
  let ctx = await b.newContext({ viewport: { width: 375, height: 760 }, permissions: ['clipboard-read', 'clipboard-write'] });
  let p = await ctx.newPage();
  await p.goto(B + 'banyo-dolabi/');
  ok(await p.locator('input[value="banyo dolabı"]').isChecked(), 'banyo sayfasında banyo önceden seçili');
  ok(await p.locator('[data-tel-satiri]').first().isHidden(), 'numara yokken telefon satırı gizli');
  await p.locator('label.cip:has-text("Vestiyer")').click();
  await p.fill('input[name=semt]', 'Eryaman');
  const on = await p.textContent('[data-onizleme]');
  ok(on.includes('banyo dolabı, vestiyer / antre için') && on.includes('Semt: Eryaman.'), 'önizleme: ' + JSON.stringify(on));
  ok((await p.getAttribute('[data-gonder]', 'href')) === 'https://ig.me/m/aytac_mobilya', 'gönder → Instagram DM');
  const istek = ctx.waitForEvent('request', r => r.url().startsWith('https://ig.me/'));
  const [yeni] = await Promise.all([ctx.waitForEvent('page'), p.click('[data-gonder]')]);
  ok((await istek).url() === 'https://ig.me/m/aytac_mobilya', 'yeni sekmede ig.me istendi');
  await yeni.close();
  await p.waitForTimeout(200);
  const pano = await p.evaluate(() => navigator.clipboard.readText());
  ok(pano === on, 'mesaj panoya kopyalandı');
  ok((await p.textContent('[data-durum]')).includes('kopyalandı'), 'durum mesajı');
  const dl = await p.evaluate(() => window.dataLayer.map(x => x.event));
  ok(dl.includes('instagram_tikla'), 'dataLayer olayı: ' + dl.join(','));
  // menü
  await p.click('.menu-dugme');
  ok(await p.locator('#menu').isVisible(), 'mobil menü açılıyor');
  ok((await p.getAttribute('.menu-dugme', 'aria-expanded')) === 'true', 'aria-expanded');
  await ctx.close();

  // 2) Numara girilince: WhatsApp modu
  ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.route('**/aytac-mobilya/js/ayarlar.js', r => r.fulfill({ contentType: 'text/javascript', body: 'window.AYTAC={whatsapp:"905321234567",telefon:"0532 123 45 67",instagram:"aytac_mobilya"};' }));
  p = await ctx.newPage();
  await p.goto(B + 'isler/');
  ok(await p.locator('[data-tel-satiri]').first().isVisible(), 'numara varken telefon satırı görünür');
  ok((await p.getAttribute('[data-tel]', 'href')) === 'tel:+905321234567', 'tel linki');
  ok((await p.textContent('[data-gonder]')).includes('WhatsApp'), 'düğme WhatsApp');
  // süzgeç
  await p.click('button[data-suz="banyo"]');
  const gorunen = await p.locator('.izgara--galeri li:visible').count();
  ok(gorunen === 8 && (await p.textContent('[data-sayi]')) === '8 fotoğraf', 'banyo süzgeci 8 fotoğraf');
  ok(p.url().endsWith('#banyo'), 'adres #banyo');
  // büyüt + benzeri
  await p.locator('.izgara--galeri li:visible button').first().click();
  ok(await p.locator('[data-buyuk]').isVisible(), 'büyük görünüm açıldı');
  await p.click('[data-benzeri]');
  const not = await p.inputValue('[name=not]');
  ok(not.includes('banyo-oval-led-ayna'), 'not dolduruldu: ' + not.slice(0, 50));
  const href = await p.getAttribute('[data-gonder]', 'href');
  ok(href.startsWith('https://wa.me/905321234567?text=') && decodeURIComponent(href.split('text=')[1]).includes('banyo-oval-led-ayna'), 'wa.me linki notla');
  // #mutfak ile doğrudan açılış
  await p.goto(B + 'isler/#mutfak');
  ok((await p.textContent('[data-sayi]')) === '6 fotoğraf', 'isler/#mutfak açılışta süzülüyor');
  await ctx.close();
  console.log(hata ? hata + ' hata' : 'ETKİLEŞİM TESTLERİ GEÇTİ');
  await b.close();
})();
