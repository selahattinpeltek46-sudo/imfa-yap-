// Aşama 2 — tasarım sistemi görsel özeti (onay için; katalog üretimi değil). Çalıştırma: node tasarim-sistemi-ornek.mjs
import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const K = new URL('./', import.meta.url).pathname;
const S = K + 'cikti/';
const { default: QRCode } = await import(K + 'node_modules/qrcode/lib/index.js');
const { chromium } = await import(K + 'node_modules/playwright-core/index.mjs');
const f = (p) => pathToFileURL(p).href;
const font = (p, d) => f(`${K}node_modules/@fontsource/${p}/${d}`);
const dek = (a) => f(`${K}cikti/dekupe/${a}.jpg`);
const qr = await QRCode.toString('https://wa.me/905324803051?text=' + encodeURIComponent('Merhaba, römork hakkında bilgi almak istiyorum.\nTaşıyacağım yük:\nTraktörüm:'), { type: 'svg', margin: 0, errorCorrectionLevel: 'L', color: { dark: '#1F2124FF', light: '#FFFFFF00' } });
const ik = {
  urun: '<path d="M4 20h16M6 20V10l6-5 6 5v10"/><path d="M10 20v-5h4v5"/>',
  gubre: '<path d="M12 3c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-6 5-10z"/>',
  odun: '<rect x="3" y="9" width="18" height="6" rx="3"/><circle cx="6" cy="12" r="1.5"/>',
  hayvan: '<path d="M5 10c0-3 3-5 7-5s7 2 7 5v4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z"/><circle cx="9.5" cy="11" r=".8"/><circle cx="14.5" cy="11" r=".8"/>',
  wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.7z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z"/>',
  tel: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
};
const svg = (k, c = '#C8102E') => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ik[k]}</svg>`;
const kul = [['urun', 'Ürün taşıma'], ['gubre', 'Gübre ve yem'], ['odun', 'Odun ve malzeme'], ['hayvan', 'Hayvancılık']];

const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
${['oswald/500.css', 'oswald/600.css', 'oswald/700.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('')}
<style>
@page { margin: 0; } * { box-sizing: border-box; } html, body { margin: 0; }
:root { --k:#C8102E; --d:#1F2124; --z:#F6F4F0; --c:#E2DED8; --g:#5F5B55; }
body { font: 400 12pt/1.55 'Inter'; color: var(--d); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
p { margin: 0; } h1, h2, h3 { margin: 0; }
.yatay { width: 420mm; height: 210mm; position: relative; overflow: hidden; background: var(--z); page-break-after: always; padding: 14mm 16mm; display: grid; grid-template-columns: 118mm 1fr; gap: 12mm; }
.etk { font: 700 9pt/1 'Inter'; letter-spacing: 1.5pt; text-transform: uppercase; color: var(--k); margin-bottom: 3mm; }
.baslik-ana { font: 700 30pt/1 'Oswald'; margin-bottom: 7mm; }
.renk { display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; margin-bottom: 8mm; }
.renk div { border-radius: 2mm; height: 22mm; padding: 2mm; display: flex; flex-direction: column; justify-content: flex-end; font: 600 7.5pt/1.25 'Inter'; border: .3mm solid var(--c); }
.tip > div { display: flex; align-items: baseline; gap: 4mm; border-bottom: .3mm solid var(--c); padding: 2mm 0; }
.tip small { font: 400 9pt 'Inter'; color: var(--g); min-width: 34mm; }
.not { margin-top: 6mm; font-size: 9.5pt; color: var(--g); line-height: 1.5; }
.not b { color: var(--d); }
/* örnek ürün sayfası parçası */
.ornek { background: #fff; border-radius: 3mm; box-shadow: 0 1mm 4mm rgba(0,0,0,.08); overflow: hidden; display: grid; grid-template-rows: 26mm 1fr 30mm; }
.ust { background: var(--d); color: #fff; padding: 5mm 8mm; position: relative; }
.ust::after { content: ''; position: absolute; right: 0; top: 0; bottom: 0; width: 60mm; background: var(--k); clip-path: polygon(30% 0, 100% 0, 100% 100%, 0 100%); }
.ust .etk { color: #E9454F; margin-bottom: 2mm; } .ust h1 { font: 700 26pt/1 'Oswald'; }
.gov { display: grid; grid-template-columns: 1.15fr 1fr; gap: 8mm; padding: 6mm 8mm; min-height: 0; }
.gov img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; min-height: 0; }
.fayda { font: 500 18pt/1.2 'Oswald'; margin-bottom: 4mm; }
.kul { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm; margin-bottom: 4mm; }
.kul div { display: flex; align-items: center; gap: 2.5mm; font: 600 10pt/1.2 'Inter'; }
.kul i { width: 9mm; height: 9mm; border-radius: 50%; background: #FBEAEC; display: grid; place-items: center; flex: none; } .kul svg { width: 5mm; height: 5mm; }
.kimler { background: var(--z); border-left: 1.4mm solid var(--k); border-radius: 0 2mm 2mm 0; padding: 3mm 4mm; font-size: 10.5pt; margin-bottom: 4mm; }
.kimler b { display: block; font: 700 9pt 'Inter'; letter-spacing: 1pt; text-transform: uppercase; color: var(--k); margin-bottom: 1mm; }
table { width: 100%; border-collapse: collapse; font-size: 10.5pt; }
th { background: var(--d); color: #fff; font: 700 9pt/1.2 'Inter'; text-align: left; padding: 2mm 2.5mm; } th.hp { background: var(--k); }
td { padding: 2mm 2.5mm; border-bottom: .3mm solid var(--c); } td.hp { color: var(--k); font-weight: 700; }
.bek { font: 700 8pt 'Inter'; color: #8A1020; background: #FBEAEC; border: .25mm dashed var(--k); padding: .4mm 1.2mm; border-radius: .6mm; }
.cta { background: var(--k); color: #fff; display: flex; align-items: center; gap: 6mm; padding: 0 8mm; }
.cta .q { width: 24mm; height: 24mm; background: #fff; padding: 1.6mm; border-radius: 1.5mm; flex: none; } .cta svg { width: 100%; height: 100%; display: block; }
.cta h3 { font: 600 16pt/1.15 'Oswald'; } .cta p { font-size: 10pt; opacity: .92; margin-top: 1mm; }
.cta .tel { margin-left: auto; text-align: right; font: 700 20pt/1 'Oswald'; } .cta .tel span { display: block; font: 400 9pt 'Inter'; opacity: .85; margin-top: 1mm; }
.etiketler { position: absolute; font: 700 8pt/1 'Inter'; color: #fff; background: #3b6fd8; padding: 1mm 2mm; border-radius: 1mm; }
/* telefon */
.tel-sayfa { width: 90mm; height: 160mm; position: relative; overflow: hidden; background: var(--z); display: grid; grid-template-rows: 27mm 44mm minmax(0,1fr) 15mm; }
.t-ust { background: var(--d); color: #fff; padding: 6mm 7mm; } .t-ust .etk { color: #E9454F; font-size: 8.5pt; margin-bottom: 2mm; } .t-ust h1 { font: 700 24pt/1 'Oswald'; }
.t-foto { background: #fff; padding: 2mm 5mm; } .t-foto img { width: 100%; height: 100%; object-fit: contain; mix-blend-mode: multiply; }
.t-gov { padding: 4mm 7mm 0; min-height: 0; overflow: hidden; } .t-gov .kimler { font-size: 10pt; margin: 0; } .t-gov .fayda { font-size: 16pt; margin-bottom: 3.5mm; }
.t-gov .kul div { font-size: 10pt; } .t-gov .kul { margin-bottom: 3mm; }
.t-bar { display: grid; grid-template-columns: 1.6fr 1fr; }
.t-bar a { display: flex; align-items: center; justify-content: center; gap: 2mm; font: 700 11pt 'Inter'; color: #fff; text-decoration: none; }
.t-bar a:first-child { background: var(--k); } .t-bar a:last-child { background: var(--d); } .t-bar svg { width: 5.5mm; height: 5.5mm; }
</style></head><body>
<section class="yatay">
  <div>
    <p class="etk">Aşama 2 · Tasarım sistemi</p>
    <h1 class="baslik-ana">Üçel 2026 — Konsept C</h1>
    <p class="etk" style="color:var(--g)">Renk · 5 renk</p>
    <div class="renk">
      <div style="background:#C8102E;color:#fff">Kırmızı<br>#C8102E<br>CTA · vurgu</div>
      <div style="background:#1F2124;color:#fff">Koyu<br>#1F2124<br>başlık</div>
      <div style="background:#F6F4F0">Kırık beyaz<br>#F6F4F0<br>zemin</div>
      <div style="background:#E2DED8">Çizgi<br>#E2DED8</div>
      <div style="background:#5F5B55;color:#fff">Metin grisi<br>#5F5B55</div>
    </div>
    <p class="etk" style="color:var(--g)">Yazı · 2 aile</p>
    <div class="tip">
      <div><small>Sayfa başlığı · Oswald 34</small><span style="font:700 34pt/1 'Oswald'">Tarım Römorku</span></div>
      <div><small>Fayda · Oswald 500 · 20</small><span style="font:500 20pt/1.1 'Oswald'">Ağır yükü tek seferde taşıyın.</span></div>
      <div><small>Teknik rakam · Oswald 28</small><span style="font:600 28pt/1 'Oswald'">4 <span style="font:400 10pt 'Inter'">ton</span></span><span class="bek" style="margin-left:2mm">ÖRNEK · teyit bekliyor</span></div>
      <div><small>Gövde · Inter 12</small><span>Kaynağından boyasına atölyemizde üretiyoruz.</span></div>
      <div><small>En küçük · Inter 9</small><span style="font-size:9pt;color:var(--g)">Fotoğraf açıklaması, etiket</span></div>
    </div>
    <p class="not"><b>Kurallar:</b> 9 pt altı yazı yok · bir sayfa = bir mesaj · fotoğraf kırpılmaz · slogan yalnızca kapak, marka ve arka kapakta · ikon tek set, çizgi, kırmızı · telefon sürümünde QR yerine dokunulabilir buton.</p>
  </div>
  <div class="ornek">
    <div class="ust"><p class="etk">Taşıma · Kendi imalatımız</p><h1>Tarım Römorku</h1></div>
    <div class="gov">
      <img src="${dek('tarim-romorku-yesil-traktor')}">
      <div>
        <p class="fayda">Tarladan depoya, ağır yükü tek seferde taşıyın.</p>
        <div class="kul">${kul.map(([k, t]) => `<div><i>${svg(k)}</i>${t}</div>`).join('')}</div>
        <div class="kimler"><b>Kimler için?</b>Ürün taşıyan, hayvancılık yapan, gübre ve yem nakli olan ya da genel taşıma ihtiyacı olan çiftçiler için.</div>
        <table><thead><tr><th>Model</th><th>Kapasite</th><th>Kasa iç ölçüsü</th><th>Dingil</th><th class="hp">Traktör gücü</th></tr></thead>
        <tbody><tr><td><b>4 tonluk</b></td><td><span class="bek">teyit</span></td><td><span class="bek">gerekli</span></td><td><span class="bek">gerekli</span></td><td class="hp"><span class="bek">gerekli</span></td></tr></tbody></table>
      </div>
    </div>
    <div class="cta"><div class="q">${qr}</div><div><h3>Ne taşıyacağınızı yazın,<br>uygun römorku birlikte belirleyelim.</h3><p>QR'ı okutun — mesaj hazır gelir</p></div><p class="tel">0532 480 30 51<span>Telefon · WhatsApp</span></p></div>
  </div>
</section>
<section class="tel-sayfa">
  <div class="t-ust"><p class="etk">Taşıma · Kendi imalatımız</p><h1>Tarım Römorku</h1></div>
  <div class="t-foto"><img src="${dek('tarim-romorku-yesil-traktor')}"></div>
  <div class="t-gov">
    <p class="fayda">Tarladan depoya, ağır yükü tek seferde taşıyın.</p>
    <div class="kul">${kul.map(([k, t]) => `<div><i>${svg(k)}</i>${t}</div>`).join('')}</div>
    <div class="kimler"><b>Kimler için?</b>Ürün taşıyan, hayvancılık yapan, gübre ve yem nakli olan ya da genel taşıma ihtiyacı olan çiftçiler için.</div>
  </div>
  <div class="t-bar"><a href="https://wa.me/905324803051">${svg('wa', '#fff')}WhatsApp'tan yaz</a><a href="tel:+905324803051">${svg('tel', '#fff')}Ara</a></div>
</section>
</body></html>`;
writeFileSync(S + 'ts.html', html);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage();
await p.goto(f(S + 'ts.html'), { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
// iki farklı sayfa boyutu: önce yatay, sonra telefon ayrı PDF
await p.addStyleTag({ content: '.tel-sayfa{display:none}' });
await p.pdf({ path: S + 'yatay.pdf', width: '420mm', height: '210mm', printBackground: true });
await p.addStyleTag({ content: '.yatay{display:none}.tel-sayfa{display:grid}' });
await p.pdf({ path: S + 'telefon.pdf', width: '90mm', height: '160mm', printBackground: true });
await b.close();
console.log('ok');
