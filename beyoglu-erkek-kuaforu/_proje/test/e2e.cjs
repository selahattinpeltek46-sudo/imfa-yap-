/* Beyoğlu Erkek Kuaförü — uçtan uca testler (Playwright / Chromium).
   Kullanım (repo kökünden):
     python3 -m http.server 8765 &          # repo kökünü sun
     node beyoglu-erkek-kuaforu/_proje/test/e2e.cjs [ekran-görüntüsü-klasörü]
   API modu, gerçek Code.gs fonksiyonlarını kullanan sahte sunucuya (route) bağlanarak test edilir. */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const KOK = 'http://localhost:8765/beyoglu-erkek-kuaforu/';
const CIKTI = process.argv[2] || path.join(__dirname, 'cikti');
fs.mkdirSync(CIKTI, { recursive: true });
const GS = require(path.join(__dirname, '..', 'randevu-sistemi', 'Code.gs'));
const API = 'https://api.test/exec';

let hata = 0;
function kontrol(kosul, ad, ek) {
  console.log((kosul ? '✅' : '❌') + ' ' + ad + (ek !== undefined ? ' — ' + ek : ''));
  if (!kosul) hata++;
}

function bugunIso() {
  const d = new Date(Date.now() + 3 * 3600e3); // Türkiye saati
  return d.toISOString().slice(0, 10);
}

/* Sahte Apps Script sunucusu: aynı saf fonksiyonlarla */
function sahteSunucu() {
  const mesgul = {}; // tarih → [{bas, bit, kaynak}]
  const s = {
    mesgul, coktu: false,
    musait(tarih, hizmet) {
      const bugun = bugunIso();
      const simdi = tarih === bugun ? (() => { const d = new Date(Date.now() + 3 * 3600e3); return d.getUTCHours() * 60 + d.getUTCMinutes(); })() : -Infinity;
      return GS.bosSaatler(GS.AYAR, tarih, hizmet, mesgul[tarih] || [], simdi);
    },
    ekle(tarih, saat, hizmet) {
      const p = saat.split(':'); const bas = +p[0] * 60 + +p[1];
      (mesgul[tarih] = mesgul[tarih] || []).push({ bas, bit: bas + GS.AYAR.hizmetler[hizmet].sure, kaynak: 'koltuk' });
    },
    async route(route) {
      if (s.coktu) return route.abort();
      const req = route.request();
      const u = new URL(req.url());
      const json = (o) => route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(o) });
      if (req.method() === 'GET') {
        const r = s.musait(u.searchParams.get('tarih'), u.searchParams.get('hizmet'));
        return json(r.hata ? { ok: false, hata: r.hata } : { ok: true, kapali: r.kapali, saatler: r.saatler });
      }
      const v = JSON.parse(req.postData());
      const d = GS.dogrula(GS.AYAR, v, bugunIso());
      if (d.hata) return json({ ok: false, hata: d.hata });
      const r = d.veri;
      if (s.musait(r.tarih, r.hizmet).saatler.indexOf(r.saat) === -1) return json({ ok: false, dolu: true, hata: 'Bu saat az önce doldu. Lütfen başka bir saat seçin.' });
      s.ekle(r.tarih, r.saat, r.hizmet);
      return json({ ok: true, kod: 'BEK-TEST' + Object.keys(mesgul).length, tarih: r.tarih, saat: r.saat, hizmet: r.hizmet, sure: GS.AYAR.hizmetler[r.hizmet].sure });
    }
  };
  return s;
}

async function sayfaAc(tarayici, genislik, secenek = {}) {
  const ctx = await tarayici.newContext({ viewport: { width: genislik, height: genislik < 600 ? 812 : 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const konsol = [];
  page.on('console', (m) => { if (m.type() === 'error') konsol.push(m.text()); });
  page.on('pageerror', (e) => konsol.push(String(e)));
  await page.addInitScript(() => {
    window.__acilan = [];
    window.open = function (u) { window.__acilan.push(u); return {}; };
  });
  if (secenek.api) {
    await page.route('**/js/ayarlar.js', async (route) => {
      const r = await route.fetch();
      const metin = (await r.text()).replace("randevuApi: ''", "randevuApi: '" + API + "'");
      route.fulfill({ response: r, body: metin });
    });
    await page.route(API + '**', (route) => secenek.api.route(route));
  }
  await page.goto(secenek.yol || KOK, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  return { ctx, page, konsol };
}

async function genelKontroller(tarayici) {
  for (const [ad, w] of [['masaustu', 1366], ['tablet', 820], ['mobil', 375]]) {
    const { ctx, page, konsol } = await sayfaAc(tarayici, w);
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    kontrol(tasma === 0, `${ad}: yatay taşma yok`, tasma);
    await page.screenshot({ path: path.join(CIKTI, `ana-${ad}.png`), fullPage: true });
    if (ad === 'masaustu') {
      const bilgi = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        title: document.title.length,
        meta: document.querySelector('meta[name=description]').content.length,
        canonical: !!document.querySelector('link[rel=canonical]'),
        jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent)['@type']; } catch (e) { return 'HATA'; } }),
        altsiz: [...document.images].filter((i) => !i.alt).length,
        kirikResim: [...document.images].filter((i) => !i.complete || !i.naturalWidth).length,
        faqJson: JSON.parse([...document.querySelectorAll('script[type="application/ld+json"]')][1].textContent).mainEntity.map((q) => q.name),
        faqGorunen: [...document.querySelectorAll('.sss details')].filter((d) => !d.hidden).map((d) => d.querySelector('summary').textContent.trim()),
        hatirlatmaGizli: [...document.querySelectorAll('[data-yalniz-api]')].every((e) => e.hidden),
        waLinkleri: [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.href),
        enLang: document.getElementById('english').lang,
        fontlar: document.fonts.check('600 20px Oswald') && document.fonts.check('16px Inter')
      }));
      kontrol(bilgi.h1 === 1, 'tek H1');
      kontrol(bilgi.title <= 60, 'title ≤ 60', bilgi.title);
      kontrol(bilgi.meta <= 155, 'meta ≤ 155', bilgi.meta);
      kontrol(bilgi.canonical, 'canonical var');
      kontrol(bilgi.jsonld.join() === 'BarberShop,FAQPage', 'JSON-LD geçerli', bilgi.jsonld.join());
      kontrol(bilgi.altsiz === 0 && bilgi.kirikResim === 0, 'tüm resimler yüklü ve alt metinli');
      kontrol(JSON.stringify(bilgi.faqJson) === JSON.stringify(bilgi.faqGorunen), 'FAQ JSON-LD = görünen sorular', bilgi.faqGorunen.length);
      kontrol(bilgi.hatirlatmaGizli, 'WhatsApp modunda hatırlatma sorusu gizli');
      kontrol(bilgi.waLinkleri.length >= 8 && bilgi.waLinkleri.every((u) => u.startsWith('https://wa.me/905355089722?text=')), 'WhatsApp linkleri doğru numara + mesaj', bilgi.waLinkleri.length);
      kontrol(bilgi.enLang === 'en', 'İngilizce bölüm lang="en"');
      kontrol(bilgi.fontlar, 'Oswald + Inter yüklendi');
      // Harita yalnız tıklayınca
      kontrol(await page.locator('#harita iframe').count() === 0, 'harita tıklamadan yüklenmiyor');
      await page.click('#harita-yukle');
      kontrol(await page.locator('#harita iframe').count() === 1, 'harita tıklayınca yükleniyor');
    }
    kontrol(konsol.length === 0, `${ad}: konsol hatası yok`, konsol.join(' | '));
    await ctx.close();
  }
  // KVKK
  for (const w of [1366, 375]) {
    const { ctx, page, konsol } = await sayfaAc(tarayici, w, { yol: KOK + 'kvkk/' });
    const tasma = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    kontrol(tasma === 0 && konsol.length === 0, `KVKK ${w}px: taşma yok, hata yok`, tasma);
    if (w === 375) await page.screenshot({ path: path.join(CIKTI, 'kvkk-mobil.png'), fullPage: true });
    await ctx.close();
  }
}

async function formDoldur(page, { hizmet, gunIndeks = 1, saat, ad = 'Ali Veli', tel = '0532 111 22 33', not = '' }) {
  if (hizmet) await page.selectOption('#f-hizmet', hizmet);
  await page.locator('#gunler .cip').nth(gunIndeks).click();
  await page.waitForFunction(() => document.querySelectorAll('#saatler .cip').length > 0);
  const sec = saat ? page.locator(`#saatler input[value="${saat}"]`) : page.locator('#saatler input').first();
  await sec.locator('xpath=..').click();
  await page.fill('#f-ad', ad);
  await page.fill('#f-tel', tel);
  if (not) await page.fill('#f-not', not);
  await page.check('#f-kvkk');
}

async function waModu(tarayici) {
  const { ctx, page, konsol } = await sayfaAc(tarayici, 375);
  kontrol(await page.locator('#gonder-yazi').textContent() === "Randevu talebini WhatsApp'tan gönder", 'WA modu buton metni');
  await page.click('#gonder');
  const hatalar = await page.$$eval('.alan-hata', (l) => l.filter((e) => e.textContent).length);
  kontrol(hatalar === 6, 'boş gönderimde 6 alan hatası', hatalar);
  // Hizmet satırındaki bağlantı hizmeti önceden seçer
  await page.click('a[data-hizmet="Sakal Tıraşı"]');
  kontrol(await page.inputValue('#f-hizmet') === 'Sakal Tıraşı', 'hizmet bağlantısı formda hizmeti seçiyor');
  await formDoldur(page, { saat: '10:00', not: 'yanlar kısa · Davut Abi' });
  await page.click('#gonder');
  const url = await page.evaluate(() => window.__acilan[0] || '');
  const mesaj = decodeURIComponent(url.split('text=')[1] || '');
  kontrol(url.startsWith('https://wa.me/905355089722?text=') && /Ad: Ali Veli/.test(mesaj) && /Telefon: 05321112233/.test(mesaj) &&
    /Hizmet: Sakal Tıraşı/.test(mesaj) && /Gün: /.test(mesaj) && /Saat: 10:00/.test(mesaj) && /Not: yanlar kısa · Davut Abi/.test(mesaj),
    'WhatsApp mesajı tüm alanları içeriyor', mesaj.replace(/\n/g, ' / '));
  const saatler = await page.$$eval('#saatler input', (l) => l.map((i) => i.value));
  kontrol(saatler[0] === '10:00' && saatler[saatler.length - 1] === '20:00', 'yedek modda saatler 10:00–20:00', saatler[0] + '…' + saatler[saatler.length - 1]);
  kontrol(konsol.length === 0, 'WA modu: konsol hatası yok', konsol.join(' | '));
  await ctx.close();
}

async function apiModu(tarayici) {
  const sunucu = sahteSunucu();
  const { ctx, page, konsol } = await sayfaAc(tarayici, 1366, { api: sunucu });
  kontrol(await page.locator('#gonder-yazi').textContent() === 'Randevuyu onayla', 'API modu buton metni');
  kontrol(await page.locator('details[data-yalniz-api]').isVisible(), 'API modunda hatırlatma sorusu görünür');
  await formDoldur(page, { hizmet: 'Saç Kesimi', gunIndeks: 2, saat: '11:00' });
  await page.click('#gonder');
  await page.waitForSelector('#randevu-sonuc:not([hidden])');
  const kod = await page.textContent('#s-kod');
  const ics = await page.getAttribute('#s-ics', 'href');
  const icsMetin = decodeURIComponent(ics.split(',')[1]);
  kontrol(/^BEK-/.test(kod), 'randevu kodu gösterildi', kod);
  kontrol(/BEGIN:VCALENDAR/.test(icsMetin) && /TRIGGER:-PT120M/.test(icsMetin) && /LOCATION:Beyoğlu Erkek Kuaförü\\, Kamer Hatun/.test(icsMetin) && icsMetin.indexOf('\r\n') > 0,
    '.ics: alarm 120 dk, adres, CRLF');
  await page.waitForTimeout(1200); // yumuşak kaydırma bitsin
  await page.screenshot({ path: path.join(CIKTI, 'randevu-sonuc.png') });
  // 2 koltuk: aynı saate ikinci randevu alınır, üçüncüde saat listeden düşer
  await page.click('#yeni-randevu');
  await formDoldur(page, { hizmet: 'Saç Kesimi', gunIndeks: 2, saat: '11:00', tel: '0533 222 33 44' });
  await page.click('#gonder');
  await page.waitForSelector('#randevu-sonuc:not([hidden])');
  kontrol(true, 'aynı saate 2. randevu alındı');
  await page.click('#yeni-randevu');
  await page.selectOption('#f-hizmet', 'Saç Kesimi');
  await page.locator('#gunler .cip').nth(2).click();
  await page.waitForFunction(() => document.querySelectorAll('#saatler .cip').length > 0);
  const liste = await page.$$eval('#saatler input', (l) => l.map((i) => i.value));
  const yok = ['10:45', '11:00', '11:15'].every((t) => liste.indexOf(t) === -1);
  const var_ = ['10:30', '11:30'].every((t) => liste.indexOf(t) !== -1);
  kontrol(yok && var_, 'kapasite dolunca çakışan saatler düşüyor (10:45–11:15 yok; 10:30 ve 11:30 var)');
  // Eşzamanlılık: seçili saat gönderimden önce başkası tarafından doluyor
  await formDoldur(page, { hizmet: 'Saç Kesimi', gunIndeks: 3, saat: '15:00', tel: '0534 333 44 55' });
  const tarih3 = await page.$eval('#gunler input:checked', (i) => i.value);
  sunucu.ekle(tarih3, '15:00', 'Saç Kesimi'); sunucu.ekle(tarih3, '15:00', 'Saç Kesimi');
  await page.click('#gonder');
  await page.waitForFunction(() => /az önce doldu/.test(document.getElementById('h-saat').textContent));
  kontrol(true, 'eşzamanlı dolumda "az önce doldu" uyarısı');
  // Sunucu çökerse WhatsApp moduna geçiş
  sunucu.coktu = true;
  await page.locator('#gunler .cip').nth(4).click();
  await page.waitForFunction(() => document.getElementById('randevu-formu').dataset.mod === 'wa');
  kontrol(await page.locator('#gonder-yazi').textContent() === "Randevu talebini WhatsApp'tan gönder", 'sunucu çökünce WhatsApp moduna geçiyor');
  const beklenen = konsol.filter((k) => !/Failed to load resource|ERR_FAILED/.test(k));
  kontrol(beklenen.length === 0, 'API modu: beklenmeyen konsol hatası yok', beklenen.join(' | '));
  await ctx.close();
}

function birimTestleri() {
  const A = GS.AYAR;
  const form = fs.readFileSync(path.join(__dirname, '..', 'kaynak', 'index.sablon.html'), 'utf8');
  const secenekler = [...form.match(/<select id="f-hizmet"[\s\S]*?<\/select>/)[0].matchAll(/<option>([^<]+)<\/option>/g)].map((m) => m[1].replace('&amp;', '&'));
  kontrol(JSON.stringify(secenekler) === JSON.stringify(Object.keys(A.hizmetler)), 'form hizmetleri = Code.gs hizmetleri', secenekler.join(', '));
  const pazartesi = GS.bosSaatler(A, '2026-10-19', 'Saç & Sakal', [], -Infinity);
  kontrol(pazartesi.saatler[0] === '10:00' && pazartesi.saatler[pazartesi.saatler.length - 1] === '20:00', 'Saç & Sakal son başlangıç 20:00 (50 dk, kapanış 21:00)', pazartesi.saatler.slice(-1)[0]);
  const pazar = GS.bosSaatler(A, '2026-10-18', 'Saç Kesimi', [], -Infinity);
  kontrol(!pazar.kapali && pazar.saatler.length > 0, 'Pazar açık [VARSAYIM]');
  const kapali = GS.bosSaatler(A, '2026-10-19', 'Saç Kesimi', [{ bas: 600, bit: 1260, kaynak: 'KAPALI' }], -Infinity);
  kontrol(kapali.saatler.length === 0, 'KAPALI etkinliği günü kapatıyor');
  kontrol(GS.dogrula(A, { ad: 'Ali', telefon: '+90 532 111 22 33', hizmet: 'Çocuk Kesimi', tarih: '2026-10-20', saat: '10:00' }, '2026-10-15').veri.telefon === '05321112233', 'doğrulama: +90 numara temizleniyor');
  kontrol(!!GS.dogrula(A, { ad: 'Ali', telefon: '05321112233', hizmet: 'Cilt Bakımı', tarih: '2026-10-20', saat: '10:00' }, '2026-10-15').hata, 'doğrulama: randevuya kapalı hizmet reddediliyor');
  kontrol(/Beyoğlu Erkek Kuaförü · Balık Sk\. No:4/.test(GS.hatirlatmaMetni(A, { ad: 'Ali Veli', saat: '16:00', hizmet: 'Saç Kesimi', kod: 'BEK-X' })), 'hatırlatma metninde salon adı + adres');
}

(async () => {
  birimTestleri();
  const tarayici = await chromium.launch();
  try {
    await genelKontroller(tarayici);
    await waModu(tarayici);
    await apiModu(tarayici);
  } finally {
    await tarayici.close();
  }
  console.log(hata ? `\n${hata} test BAŞARISIZ` : '\nTüm testler geçti');
  process.exit(hata ? 1 : 0);
})();
