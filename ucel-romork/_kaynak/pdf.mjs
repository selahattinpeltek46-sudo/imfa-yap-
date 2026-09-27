// Üçel PDF katalog üretici — site ile aynı veriden (veri.mjs) üretilir.
//
// Kurulum (bir kez):  cd ucel-romork/_kaynak && npm install
//   Chromium yoksa:   npx playwright-core install chromium
// Çalıştırma:
//   npm run pdf          → yayın sürümü (bilinmeyen bilgiler gizlenir)
//   npm run pdf:taslak   → taslak (bilinmeyen bilgiler "Üçel'den gelecek" kutusu olarak görünür)
// Çıktı: ucel-romork/_kaynak/cikti/ altında PDF (ve kontrol için HTML)
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA, KATEGORILER, URUNLER, SAHADAN } from './veri.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
// PDF için JPEG görseller: önce `python3 ucel-romork/_kaynak/gorseller.py` çalıştırılmalı
const IMG = join(BURASI, 'cikti', 'pdf-gorsel');
const CIKTI = join(BURASI, 'cikti');
const TASLAK = process.argv.includes('--taslak');
const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const bugun = new Date();
const DONEM = `${AYLAR[bugun.getMonth()]} ${bugun.getFullYear()}`;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const foto = (ad, kart = false) => pathToFileURL(join(IMG, `${ad}${kart ? '-k' : ''}.jpg`)).href;
const font = (paket, dosya) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', paket, dosya)).href;
const kat = (id) => KATEGORILER.find((k) => k.id === id);
const urunUrl = (u) => `${FIRMA.site}urunler/${u.id}/`;
const waUrl = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (metin) => QRCode.toString(metin, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#1C211D', light: '#FFFFFF00' } });

// Taslakta eksik bilgi kutusu, yayında hiçbir şey
const eksik = (ne) => (TASLAK ? `<span class="eksik">Üçel'den gelecek: ${esc(ne)}</span>` : '');

async function urunSayfasi(u, no) {
  const [ana, ...digerleri] = u.foto;
  const kucukler = digerleri.slice(0, 3);
  const teknik = Object.entries(u.teknik);
  const bilinen = teknik.filter(([, v]) => v);
  const tabloSatirlari = TASLAK ? teknik : bilinen;
  const qrUrun = await qr(urunUrl(u));
  const qrWa = await qr(waUrl(`Merhaba, "${u.ad}" hakkında bilgi almak istiyorum.`));
  return `<section class="page urun">
  <header class="ph"><span class="brand-mini">ÜÇEL</span><span>${esc(kat(u.kategori).ad)}</span><span class="no">${String(no).padStart(2, '0')}</span></header>
  <figure class="u-ana"><img src="${foto(ana[0])}" alt=""></figure>
  ${kucukler.length ? `<div class="u-kucuk k${kucukler.length}">${kucukler.map(([f]) => `<img src="${foto(f, true)}" alt="">`).join('')}</div>` : ''}
  <div class="u-govde">
    <div class="u-sol">
      <h2>${esc(u.ad)}</h2>
      <p class="ozet">${u.ozet.map(esc).join(' · ')}</p>
      <p class="deger">${esc(u.deger)}</p>
      <h3>Ne işinize yarar?</h3>
      <ul class="ticks">${u.faydalar.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      ${u.secenekler.length ? `<h3>Size özel</h3><ul class="ticks">${u.secenekler.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
    </div>
    <div class="u-sag">
      <h3>Teknik bilgiler</h3>
      ${tabloSatirlari.length ? `<table class="specs">${tabloSatirlari.map(([a, v]) => `<tr><th>${esc(a)}</th><td>${v ? esc(v) : eksik('değer')}</td></tr>`).join('')}</table>` : ''}
      ${!TASLAK && bilinen.length < teknik.length ? `<p class="not">${bilinen.length ? 'Diğer ölçü ve kapasite' : 'Ölçü ve kapasite'} seçeneklerini ihtiyacınıza göre birlikte belirliyoruz.</p>` : ''}
      <div class="fit">
        <h3>Size uygun olabilir</h3>
        <ul class="ticks">${u.uygunluk.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      </div>
      <div class="qrs">
        <div class="qr"><div class="qr-kod">${qrUrun}</div><p><b>Ürün sayfası</b>Tüm fotoğraflar</p></div>
        <div class="qr"><div class="qr-kod">${qrWa}</div><p><b>WhatsApp'tan sor</b>${FIRMA.telefon}</p></div>
      </div>
    </div>
  </div>
</section>`;
}

async function html() {
  const qrSite = await qr(FIRMA.site);
  const qrWa = await qr(waUrl('Merhaba, Üçel kataloğunu inceledim, bilgi almak istiyorum.'));
  const urunler = [];
  for (const [i, u] of URUNLER.entries()) urunler.push(await urunSayfasi(u, i + 1));

  return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>Üçel Tarım Aletleri — Ürün Kataloğu ${DONEM}</title>
<link rel="stylesheet" href="${font('barlow', '400.css')}">
<link rel="stylesheet" href="${font('barlow', '600.css')}">
<link rel="stylesheet" href="${font('barlow', '700.css')}">
<link rel="stylesheet" href="${font('barlow-condensed', '700.css')}">
<style>
@page { size: A4; margin: 0; }
:root { --stone:#EDEFEA; --ink:#1C211D; --ink2:#3A423C; --muted:#5F6961; --line:#D5DAD3; --field:#2F5D3A; --fieldsoft:#E1EBE2; --earth:#7A5A3A; --earthsoft:#EEE7DD; --brand:#B8132C; --wa:#1E8E4C; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font: 400 10.5pt/1.5 'Barlow', sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; background: #fff; }
h1, h2 { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; margin: 0; line-height: 1.02; }
h3 { font: 700 10pt/1.3 'Barlow', sans-serif; letter-spacing: .8pt; text-transform: uppercase; color: var(--muted); margin: 0 0 2.5mm; }
p { margin: 0; }
ul { margin: 0; padding: 0; list-style: none; }
img { display: block; width: 100%; height: 100%; object-fit: cover; }
.ticks li { position: relative; padding-left: 5.5mm; margin-bottom: 1.4mm; }
.ticks li::before { content: ''; position: absolute; left: .6mm; top: 1.3mm; width: 2.6mm; height: 1.4mm; border-left: .6mm solid var(--field); border-bottom: .6mm solid var(--field); transform: rotate(-45deg); }
.brand-mark { font: 700 26pt/1 'Barlow Condensed', sans-serif; letter-spacing: 3pt; color: #fff; background: var(--brand); padding: 2.5mm 4mm 1.8mm; display: inline-block; border-radius: 1mm; }
.brand-mini { font: 700 11pt/1 'Barlow Condensed', sans-serif; letter-spacing: 1.5pt; color: #fff; background: var(--brand); padding: 1.2mm 2mm .8mm; border-radius: .6mm; }
.eksik { display: inline-block; border: .3mm dashed var(--earth); background: var(--earthsoft); color: var(--earth); font-weight: 600; font-size: 9pt; padding: .8mm 2mm; border-radius: .8mm; }
.eksik.blok { display: block; padding: 3mm; }

/* Kapak */
.kapak { background: var(--ink); color: #fff; }
.kapak .k-foto { position: absolute; inset: 0 0 92mm 0; }
.kapak .k-foto::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(28,33,29,0) 55%, rgba(28,33,29,1) 100%); }
.kapak .k-yazi { position: absolute; left: 16mm; right: 16mm; bottom: 18mm; display: grid; gap: 5mm; }
.kapak h1 { font-size: 46pt; }
.kapak .k-alt { font-size: 13pt; color: rgba(255,255,255,.82); max-width: 150mm; }
.kapak .k-meta { display: flex; justify-content: space-between; align-items: end; border-top: .3mm solid rgba(255,255,255,.3); padding-top: 5mm; font-size: 10.5pt; color: rgba(255,255,255,.8); }
.kapak .k-meta b { color: #fff; font-size: 13pt; display: block; }

/* Sayfa başlığı */
.ph { position: absolute; top: 10mm; left: 14mm; right: 14mm; display: flex; align-items: center; gap: 4mm; font: 600 9pt/1 'Barlow', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--muted); }
.ph .no { margin-left: auto; font: 700 14pt/1 'Barlow Condensed', sans-serif; color: var(--ink); }

/* Üçel sayfası */
.icerik { padding: 24mm 14mm 14mm; display: grid; gap: 8mm; }
.icerik h2 { font-size: 30pt; }
.hak-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 8mm; align-items: start; }
.hak-grid .foto { height: 70mm; border-radius: 1.2mm; overflow: hidden; }
.guven li { padding: 2.6mm 0 2.6mm 7mm; border-bottom: .25mm solid var(--line); position: relative; font-size: 11pt; }
.guven li::before { content: ''; position: absolute; left: 1mm; top: 3.8mm; width: 3mm; height: 1.6mm; border-left: .7mm solid var(--field); border-bottom: .7mm solid var(--field); transform: rotate(-45deg); }
.guven b { display: block; }
.toc { display: grid; grid-template-columns: 1fr 1fr; gap: 0 8mm; }
.toc div { display: flex; justify-content: space-between; padding: 2.2mm 0; border-bottom: .25mm solid var(--line); font-size: 11pt; }
.toc span:last-child { font: 700 12pt/1 'Barlow Condensed', sans-serif; }
.nasil { background: var(--stone); border-radius: 1.2mm; padding: 5mm 6mm; }
.nasil p { color: var(--ink2); }

/* Ürün sayfası */
.u-ana { position: absolute; top: 20mm; left: 14mm; right: 14mm; height: 100mm; margin: 0; border-radius: 1.2mm; overflow: hidden; background: #111; }
.u-kucuk { position: absolute; top: 123mm; left: 14mm; right: 14mm; height: 30mm; display: grid; gap: 3mm; grid-template-columns: repeat(3, 1fr); grid-template-rows: 30mm; overflow: hidden; }
.u-kucuk img { border-radius: 1mm; height: 30mm; min-width: 0; }
.u-govde { position: absolute; left: 14mm; right: 14mm; bottom: 12mm; top: 158mm; display: grid; grid-template-columns: 1fr 1fr; gap: 9mm; }
.urun:not(:has(.u-kucuk)) .u-ana { height: 130mm; }
.urun:not(:has(.u-kucuk)) .u-govde { top: 156mm; }
.u-sol h2 { font-size: 28pt; margin-bottom: 1.5mm; }
.ozet { font-weight: 600; color: var(--field); margin-bottom: 3mm; }
.deger { font-size: 11pt; color: var(--ink2); margin-bottom: 5mm; }
.u-sol h3, .u-sag h3 { margin-top: 1mm; }
.u-sol .ticks { margin-bottom: 4mm; }
.specs { width: 100%; border-collapse: collapse; margin-bottom: 4mm; font-size: 10pt; }
.specs th, .specs td { text-align: left; padding: 1.8mm 2mm; border-bottom: .25mm solid var(--line); vertical-align: middle; }
.specs th { font-weight: 400; color: var(--muted); width: 48%; }
.specs td { font-weight: 700; }
.not { font-size: 9.5pt; color: var(--muted); margin-bottom: 4mm; }
.fit { background: var(--fieldsoft); border-radius: 1.2mm; padding: 3.5mm 4mm 2mm; margin-bottom: 4mm; font-size: 10pt; }
.qrs { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.qr { display: flex; gap: 2.5mm; align-items: center; }
.qr-kod { width: 20mm; height: 20mm; flex: none; }
.qr-kod svg { width: 100%; height: 100%; display: block; }
.qr p { font-size: 8.5pt; color: var(--muted); line-height: 1.3; }
.qr b { display: block; color: var(--ink); font-size: 9.5pt; }

/* Sahadan */
.saha-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.saha-grid figure { margin: 0; }
.saha-grid .f { height: 56mm; border-radius: 1mm; overflow: hidden; }
.saha-grid figcaption { font-size: 9.5pt; color: var(--ink2); margin-top: 1.5mm; }
.sahadan { background: var(--earthsoft); }

/* Arka kapak */
.arka { background: var(--ink); color: #fff; }
.arka .icerik { padding-top: 22mm; gap: 10mm; }
.arka h2 { font-size: 34pt; }
.adimlar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; }
.adimlar div { border-top: .6mm solid #fff; padding-top: 3mm; }
.adimlar b { font: 700 13pt/1 'Barlow Condensed', sans-serif; color: rgba(255,255,255,.6); display: block; margin-bottom: 2mm; }
.adimlar p { color: rgba(255,255,255,.8); font-size: 10pt; }
.adimlar h3 { color: #fff; text-transform: none; letter-spacing: 0; font-size: 12pt; }
.tel { font: 700 34pt/1 'Barlow Condensed', sans-serif; letter-spacing: 1pt; }
.iletisim { display: grid; grid-template-columns: 1fr auto; gap: 8mm; align-items: end; }
.iletisim dl { margin: 0; display: grid; gap: 3mm; font-size: 11pt; }
.iletisim dt { font-size: 8.5pt; letter-spacing: 1pt; text-transform: uppercase; color: rgba(255,255,255,.55); }
.iletisim dd { margin: 0; }
.arka .qrs { grid-template-columns: auto auto; gap: 8mm; }
.arka .qr-kod { width: 28mm; height: 28mm; background: #fff; padding: 2mm; border-radius: 1mm; }
.arka .qr p { color: rgba(255,255,255,.7); } .arka .qr b { color: #fff; }
.arka .eksik { background: rgba(255,255,255,.08); color: #E8C9A6; border-color: #E8C9A6; }
.dipnot { position: absolute; left: 14mm; right: 14mm; bottom: 12mm; font-size: 8.5pt; color: rgba(255,255,255,.55); border-top: .25mm solid rgba(255,255,255,.2); padding-top: 3mm; }
${TASLAK ? `.page::before { content: 'TASLAK · Üçel onayı bekleniyor'; position: absolute; right: 14mm; bottom: 4mm; font: 600 7.5pt/1 'Barlow', sans-serif; letter-spacing: 1pt; color: var(--earth); z-index: 5; }
.kapak::before, .arka::before { color: #E8C9A6; }` : ''}
</style></head>
<body>

<section class="page kapak">
  <div class="k-foto"><img src="${foto('tarim-romorku-yesil')}" alt=""></div>
  <div class="k-yazi">
    <span><span class="brand-mark">ÜÇEL</span></span>
    <h1>Tarlada da yolda da<br>sağlam iş.</h1>
    <p class="k-alt">Göksun'da tarımın ihtiyacına göre römork ve tarım ekipmanları. Rengini, yazısını birlikte seçelim.</p>
    <div class="k-meta"><span><b>${esc(FIRMA.ad)}</b>${esc(FIRMA.yer)}</span><span><b>Ürün Kataloğu</b>${DONEM}</span></div>
  </div>
</section>

<section class="page">
  <header class="ph"><span class="brand-mini">ÜÇEL</span><span>Üçel Tarım Aletleri</span></header>
  <div class="icerik">
    <h2>Bizi tanıyın</h2>
    <div class="hak-grid">
      <div>
        ${FIRMA.hakkinda ? `<p style="font-size:11.5pt;margin-bottom:4mm">${esc(FIRMA.hakkinda)}</p>` : TASLAK ? `<p class="eksik blok">Üçel'den gelecek: firma hakkında 2–3 cümle (atölye, usta, ne zamandan beri). Yalnızca belgelenebilen bilgi.</p>` : ''}
        <ul class="guven">
          <li><b>Göksun'daki atölyemizde yapıyoruz.</b>Römorklarımız ÜÇEL SANAYİ GÖKSUN yazısıyla çıkıyor.</li>
          <li><b>Renk ve kasa yazısı size özel.</b>Adınız, firmanız ya da "Maşallah".</li>
          <li><b>Farklı marka traktörlere kepçe montajı.</b>Kubota ve diğer markalardan örnekler.</li>
          <li><b>Doğrudan bize ulaşın.</b>Telefon ve WhatsApp: ${FIRMA.telefon}</li>
        </ul>
      </div>
      <div><div class="foto"><img src="${foto('on-yukleyici-atolye')}" alt=""></div><p style="font-size:9pt;color:var(--muted);margin-top:1.5mm">Üçel atölyesi, Göksun</p></div>
    </div>
    <div>
      <h3>Bu katalogda</h3>
      <div class="toc">${URUNLER.map((u, i) => `<div><span>${esc(u.ad)}</span><span>${String(i + 1).padStart(2, '0')}</span></div>`).join('')}</div>
    </div>
    <div class="nasil">
      <h3>Bu katalog nasıl kullanılır?</h3>
      <p>Her ürün sayfasında iki kare kod var. Telefonunuzun kamerasıyla okutun: biri ürünün internetteki sayfasını, diğeri ürün adı yazılı hazır bir WhatsApp mesajını açar.</p>
    </div>
  </div>
</section>

${urunler.join('\n')}

<section class="page sahadan">
  <header class="ph"><span class="brand-mini">ÜÇEL</span><span>Sahadan</span></header>
  <div class="icerik">
    <h2>Sadece katalogda değil, sahada da.</h2>
    <div class="saha-grid">${SAHADAN.slice(0, 6).map(([f, yazi]) => `<figure><div class="f"><img src="${foto(f, true)}" alt=""></div><figcaption>${esc(yazi)}</figcaption></figure>`).join('')}</div>
  </div>
</section>

<section class="page arka">
  <div class="icerik">
    <span><span class="brand-mark">ÜÇEL</span></span>
    <h2>Nasıl ilerliyoruz?</h2>
    <div class="adimlar">
      <div><b>01</b><h3>İhtiyacınızı anlatın.</h3><p>Ne taşıyacağınızı, traktörünüzü ve arazinizi yazın.</p></div>
      <div><b>02</b><h3>Size uygun ürünü birlikte belirleyelim.</h3><p>Ölçü, renk ve yazıyı sizinle konuşarak netleştiriyoruz.</p></div>
      <div><b>03</b><h3>Fiyat, özellik ve teslimatı netleştirelim.</h3><p>Her şey açık olduktan sonra siparişe geçiyoruz.</p></div>
    </div>
    <div>
      <p style="color:rgba(255,255,255,.7);margin-bottom:2mm">Telefon ve WhatsApp</p>
      <p class="tel">${FIRMA.telefon}</p>
    </div>
    <div class="iletisim">
      <dl>
        <div><dt>Firma</dt><dd>${esc(FIRMA.ad)}</dd></div>
        <div><dt>Adres</dt><dd>${FIRMA.adres ? esc(FIRMA.adres) : TASLAK ? eksik('açık adres') : esc(FIRMA.yer)}</dd></div>
        ${FIRMA.calismaSaatleri || TASLAK ? `<div><dt>Çalışma saatleri</dt><dd>${FIRMA.calismaSaatleri ? esc(FIRMA.calismaSaatleri) : eksik('çalışma saatleri')}</dd></div>` : ''}
        <div><dt>İnternet</dt><dd>${esc(FIRMA.site.replace('https://', ''))}</dd></div>
      </dl>
      <div class="qrs">
        <div class="qr"><div class="qr-kod">${qrWa}</div><p><b>WhatsApp</b>Okutun, yazın</p></div>
        <div class="qr"><div class="qr-kod">${qrSite}</div><p><b>E-katalog</b>Tüm ürünler</p></div>
      </div>
    </div>
  </div>
  <p class="dipnot">Ürün fotoğrafları Üçel'in kendi ürünleri ve müşteri teslimatlarıdır. Fiyat; ölçüye, donanıma ve seçtiğiniz özelliklere göre değişir. Güncel bilgi için bizi arayın. · Katalog tarihi: ${DONEM}</p>
</section>

</body></html>`;
}

const icerik = await html();
mkdirSync(CIKTI, { recursive: true });
const ad = TASLAK ? 'ucel-katalog-taslak' : `ucel-katalog-${bugun.getFullYear()}-${String(bugun.getMonth() + 1).padStart(2, '0')}`;
const htmlDosya = join(CIKTI, `${ad}.html`);
writeFileSync(htmlDosya, icerik);

const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const sayfa = await tarayici.newPage();
await sayfa.goto(pathToFileURL(htmlDosya).href, { waitUntil: 'networkidle' });
await sayfa.evaluate(() => document.fonts.ready);
await sayfa.pdf({ path: join(CIKTI, `${ad}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
await tarayici.close();
console.log('yazıldı:', join('ucel-romork/_kaynak/cikti', `${ad}.pdf`));
