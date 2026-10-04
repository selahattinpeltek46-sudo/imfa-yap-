// Üçel teknik veri formu — yazdırılıp elle doldurulacak A4 PDF.
// Alanlar teknik-veri.mjs'ten gelir; form ile katalog tabloları birebir eşleşir.
// Çalıştırma: npm run form   (CHROMIUM_PATH gerekirse)
// Çıktı: cikti/Ucel-Teknik-Veri-Formu.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER } from './katalog2-veri.mjs';
import { TEKNIK, DIGER_TEKNIK, STANDART_CEKIM } from './teknik-veri.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const font = (paket, dosya) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', paket, dosya)).href;
const ad = (id) => URUNLER.find((u) => u.id === id).ad;
const kutu = '<span class="cb"></span>';
const MODEL = 3; // model sütunu sayısı

let sayfaNo = 0;
const sayfa = (govde, baslik = '') => {
  sayfaNo += 1;
  return `<section class="page">
  <header class="ust"><span class="mark">ÜÇEL</span><span>Teknik Veri Formu${baslik ? ' · ' + esc(baslik) : ''}</span></header>
  ${govde}
  <footer class="alt"><span>Bilmediğiniz alanı boş bırakın. Tahmin yazmayın.</span><span>Sayfa ${sayfaNo}</span></footer>
</section>`;
};

const modelTablo = (satirlar) => `<table class="form">
  <thead><tr><th class="alan">Özellik</th><th class="birim">Birim / seçenek</th>${Array.from({ length: MODEL }, (_, i) => `<th>Model ${i + 1}</th>`).join('')}</tr></thead>
  <tbody>
    <tr class="model"><td class="alan"><b>Model adı / kodu</b></td><td class="birim"></td>${'<td></td>'.repeat(MODEL)}</tr>
    ${satirlar.filter(([a]) => a !== 'Model').map(([a, b]) => `<tr><td class="alan">${esc(a)}</td><td class="birim">${esc(b)}</td>${'<td></td>'.repeat(MODEL)}</tr>`).join('')}
  </tbody>
</table>`;

const cizgiler = (n) => `<div class="cizgiler">${'<span></span>'.repeat(n)}</div>`;

// Her ürün iki sayfa: 1) teknik tablo, uyum, opsiyon  2) malzeme, farklı kılan, ataşman, uyarı, fotoğraf, not
function urunSayfalari(id) {
  const t = TEKNIK[id];
  const s1 = sayfa(`
  <h2>${esc(ad(id))}</h2>
  <p class="yon">Her model için bir sütun kullanın. Tek model varsa yalnızca "Model 1" sütununu doldurun. Katalogda her model tabloda bir satır olur.</p>
  <h3>1. Teknik özellikler</h3>
  ${modelTablo(t.teknik)}
  <div class="iki">
    <div>
      <h3>2. Uyum</h3>
      <table class="cizgi">${t.uyum.map(([k]) => `<tr><td>${esc(k)}</td><td class="yaz"></td></tr>`).join('')}</table>
    </div>
    <div>
      <h3>3. Opsiyonlar</h3>
      <table class="cizgi ops">${t.opsiyon.map(([o]) => `<tr><td>${esc(o)}</td><td class="vy">${kutu} Var ${kutu} Yok</td></tr>`).join('')}
      <tr><td>Diğer: ______________________</td><td class="vy">${kutu} Var</td></tr></table>
    </div>
  </div>`, `${ad(id)} · 1/2`);
  let n = 4;
  const bolum = (b) => `<h3>${n++}. ${b}</h3>`;
  const s2 = sayfa(`
  <h2>${esc(ad(id))} <span class="devam">devam</span></h2>
  ${t.malzeme ? `${bolum('Malzeme ve imalat')}<p class="yon">Katalogda "Malzeme ve imalat" kutusunda yer alır. Ölçüyü birimiyle yazın (ör. profil 80×80×5 mm).</p>
  <table class="cizgi">${t.malzeme.map(([k]) => `<tr><td>${esc(k)}</td><td class="yaz genis"></td></tr>`).join('')}</table>` : ''}
  ${bolum('Modelimizi farklı kılan özellikler')}<p class="yon">Müşteri neden sizinkini seçmeli? Her satıra bir somut özellik yazın (ör. kullanılan malzeme, ayar kolaylığı, güçlendirilmiş bölge). Genel övgü değil, ölçülebilir bilgi.</p>
  ${cizgiler(t.atasman ? 3 : 4)}
  ${t.atasman ? `${bolum('Takılabilen ataşmanlar')}<table class="cizgi ops">${t.atasman.map(([o]) => `<tr><td>${esc(o)}</td><td class="vy">${kutu} Var ${kutu} Yok</td><td class="yaz">Not:</td></tr>`).join('')}
  <tr><td>Diğer: ______________________</td><td class="vy">${kutu} Var</td><td class="yaz">Not:</td></tr></table>` : ''}
  ${bolum('Kullanım ve bakım uyarıları')}<p class="yon">Müşterinin bilmesi gerekenler: yağlama, kontrol aralığı, kullanım sırasında dikkat edilecekler, kullanılacak yağ.</p>
  ${cizgiler(t.atasman ? 2 : 4)}
  <div class="iki alt-iki${STANDART_CEKIM.length + t.cekim.length > 10 ? ' uzun' : ''}">
    <div>
      ${bolum('Fotoğraf (çekildikçe işaretleyin)')}
      <ul class="liste">${[...STANDART_CEKIM.map((x) => x.split(' — ')[0] + (x.includes('—') ? ' — ' + x.split(' — ')[1].split(',')[0] : '')), ...t.cekim].map((x) => `<li>${kutu} ${esc(x)}</li>`).join('')}</ul>
    </div>
    <div>
      ${bolum('Not')}
      <div class="not-kutu kisa"></div>
    </div>
  </div>`, `${ad(id)} · 2/2`);
  return s1 + s2;
}

const html = () => `<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>Üçel Tarım Aletleri — Teknik Veri Formu</title>
${['oswald/600.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((f) => { const [p, d] = f.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('\n')}
<style>
@page { size: A4; margin: 0; }
:root { --ink:#1B1B1D; --muted:#5E5A54; --line:#9C968C; --soft:#E3DED5; --gold:#A9824F; --gold-d:#8A6A3F; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font: 400 9.5pt/1.4 'Inter', sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; padding: 17mm 12mm 16mm; }
h1, h2 { font-family: 'Oswald', sans-serif; font-weight: 600; margin: 0; line-height: 1.1; }
h1 { font-size: 26pt; margin-bottom: 3mm; }
h2 { font-size: 20pt; margin-bottom: 1mm; }
h3 { font: 700 8.5pt/1.3 'Inter', sans-serif; letter-spacing: .8pt; text-transform: uppercase; color: var(--gold-d); margin: 4mm 0 1.8mm; }
p { margin: 0 0 2mm; }
.ust { position: absolute; top: 7mm; left: 12mm; right: 12mm; display: flex; gap: 3mm; align-items: center; font: 600 7.5pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--muted); }
.mark { font: 600 10pt/1 'Oswald', sans-serif; letter-spacing: 2pt; color: var(--gold); }
.alt { position: absolute; left: 12mm; right: 12mm; bottom: 7mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--muted); border-top: .25mm solid var(--soft); padding-top: 2mm; }
.yon { font-size: 8.5pt; color: var(--muted); }
.cb { display: inline-block; width: 3.2mm; height: 3.2mm; border: .3mm solid var(--ink); border-radius: .4mm; vertical-align: -0.6mm; margin-right: .8mm; }
table { border-collapse: collapse; width: 100%; }
table.form th { font: 700 7.5pt/1.2 'Inter', sans-serif; letter-spacing: .5pt; text-transform: uppercase; text-align: left; color: var(--muted); padding: 1.4mm 1.8mm; border-bottom: .4mm solid var(--ink); }
table.form td { border: .25mm solid var(--line); padding: 0 1.8mm; height: 7.4mm; font-size: 9pt; }
table.form td.alan { width: 34%; }
table.form td.birim, table.form th.birim { width: 17%; font-size: 7.6pt; color: var(--muted); }
table.form tr.model td { background: #F4F0E8; }
table.cizgi td { padding: 0 1mm; height: 7mm; border-bottom: .25mm solid var(--line); font-size: 9pt; }
table.cizgi td.yaz { width: 48%; }
table.cizgi td.vy { width: 30%; white-space: nowrap; font-size: 8.5pt; }
.iki { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; }
.liste { list-style: none; margin: 0; padding: 0; columns: 1; }
.liste li { font-size: 8.4pt; padding: .9mm 0; }
.alt-iki.uzun { grid-template-columns: 1.7fr 1fr; }
.alt-iki.uzun .liste { columns: 2; column-gap: 4mm; }
.alt-iki.uzun .devam { font: 400 11pt 'Inter', sans-serif; color: var(--muted); }
.cizgiler span { display: block; height: 7.5mm; border-bottom: .25mm solid var(--line); }
table.cizgi td.yaz.genis { width: 55%; }
.not-kutu.kisa { height: 34mm; }
.not-kutu { height: 30mm; }
.not-kutu { border: .25mm solid var(--line); border-radius: .6mm; height: 40mm; background-image: repeating-linear-gradient(transparent 0 6.9mm, var(--soft) 6.9mm 7mm); }
/* kapak */
.kutu-bilgi { border: .3mm solid var(--gold); border-radius: 1mm; padding: 4mm 5mm; margin: 4mm 0; background: #FBF8F2; }
.adimlar { margin: 0; padding-left: 5mm; } .adimlar li { margin-bottom: 1.6mm; }
table.firma td { border-bottom: .25mm solid var(--line); padding: 1.6mm 1mm; vertical-align: top; font-size: 9pt; }
table.firma td:first-child { width: 36%; color: var(--muted); }
table.firma .mevcut { font-weight: 600; }
table.envanter th { font: 700 7.3pt/1.2 'Inter', sans-serif; letter-spacing: .4pt; text-transform: uppercase; text-align: left; color: var(--muted); padding: 1.4mm 1.5mm; border-bottom: .4mm solid var(--ink); }
table.envanter td { border: .25mm solid var(--line); padding: 0 1.5mm; height: 8.6mm; font-size: 8.8pt; }
table.envanter td.sec { white-space: nowrap; font-size: 8.2pt; }
.imza { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6mm; margin-top: 6mm; }
.imza div { border-top: .3mm solid var(--ink); padding-top: 1.5mm; font-size: 8pt; color: var(--muted); height: 16mm; }
</style></head><body>

${sayfa(`
  <h1>Katalog Teknik Veri Formu</h1>
  <p style="font-size:11pt">${esc(FIRMA.ad)} · Ürün Kataloğu 2026</p>
  <div class="kutu-bilgi">
    <p><b>Bu form ne için?</b> Kataloğun ürün sayfalarındaki teknik tablolar bu formdaki bilgilerle doldurulacak. Katalogda yalnızca sizin yazdığınız bilgiler yer alacak.</p>
    <p style="margin:0"><b>Nasıl doldurulur?</b></p>
    <ol class="adimlar">
      <li>Formu yazdırın, tükenmez kalemle okunaklı doldurun.</li>
      <li>Bilmediğiniz ya da emin olmadığınız alanı <b>boş bırakın</b>. Tahmin yazmayın.</li>
      <li>Bir ürünün birden fazla modeli varsa her model için ayrı sütun kullanın (Model 1, 2, 3).</li>
      <li>Birimleri yazın: ton, kg, mm, cm, lt, HP.</li>
      <li>Her sayfanın net fotoğrafını çekip formu size ileten kişiye WhatsApp'tan gönderin.</li>
    </ol>
  </div>
  <h3>A. Firma bilgileri — mevcut bilgiyi kontrol edin</h3>
  <table class="firma">
    <tr><td>Katalogda kullanılacak ad</td><td>${kutu} Üçel Tarım Aletleri &nbsp; ${kutu} Üçel Zirai Aletler &nbsp; ${kutu} Üçel Ziraat<br>${kutu} Başka: ______________________________</td></tr>
    <tr><td>Resmî / ticari unvan</td><td>__________________________________________________</td></tr>
    <tr><td>Adres</td><td><span class="mevcut">${esc(FIRMA.adres1)}, ${esc(FIRMA.adres2)}</span><br>${kutu} Doğru &nbsp; ${kutu} Düzeltme: ____________________________</td></tr>
    <tr><td>Telefon / WhatsApp</td><td><span class="mevcut">${FIRMA.telefon}</span> &nbsp; ${kutu} Doğru &nbsp; ${kutu} Düzeltme: ________________</td></tr>
    <tr><td>Çalışma saatleri</td><td><span class="mevcut">${esc(FIRMA.saatler)}</span> &nbsp; ${kutu} Doğru &nbsp; ${kutu} Düzeltme: ___________</td></tr>
    <tr><td>Yetkili</td><td><span class="mevcut">${esc(FIRMA.yetkili)}</span> &nbsp; ${kutu} Doğru &nbsp; ${kutu} Düzeltme: ___________</td></tr>
    <tr><td>Kaç yıldır üretim yapılıyor?<br><small>(katalogda yalnızca belgeliyse kullanılır)</small></td><td>______ yıl &nbsp; / &nbsp; kuruluş yılı: ________</td></tr>
  </table>
  <h3>B. Satış süreci</h3>
  <table class="firma">
    <tr><td>İmalat ürünlerinde ortalama teslim süresi</td><td>____ – ____ ${kutu} gün ${kutu} hafta</td></tr>
    <tr><td>Nakliye</td><td>${kutu} Biz götürüyoruz &nbsp; ${kutu} Anlaşmalı firma &nbsp; ${kutu} Müşteri teslim alıyor</td></tr>
    <tr><td>Model kodu<br><small>(katalog tablosunda her satırın başında yer alır)</small></td><td>${kutu} Kendi kodlarımız var (ürün sayfalarına yazın)<br>${kutu} Siz önerin (ör. ÜÇL-RMK-4, ÜÇL-KLT-9) &nbsp; ${kutu} Kod kullanmayalım</td></tr>
    <tr><td>Katalogdaki müşteri fotoğrafları</td><td>${kutu} İzin alındı &nbsp; ${kutu} İzin alınacak &nbsp; ${kutu} Yüzler bulanıklaştırılsın</td></tr>
  </table>`)}

${sayfa(`
  <h2>C. Ürün listesi</h2>
  <p class="yon">Her satır için işaretleyin. "Kendi imalat" yalnızca Göksun'daki atölyede ürettiğiniz ürünler için işaretlenmeli; katalogdaki "Kendi İmalatımız" rozeti buna göre konacak.</p>
  <table class="envanter">
    <thead><tr><th style="width:26%">Ürün</th><th>Satıyor musunuz?</th><th>Kimin üretimi?</th><th style="width:10%">Model sayısı</th><th style="width:26%">Model adları</th></tr></thead>
    <tbody>
      ${[...URUNLER.map((u) => u.ad), 'Mibzer', 'Çayır Biçme Makinesi', 'Döner Ot Tırmığı', 'Tesviye Küreği', 'Kırmızı hidrolik ekipman (fotoğraflarda) — adı: ________', 'Diğer: ______________', 'Diğer: ______________']
        .map((x) => `<tr><td>${esc(x)}</td><td class="sec">${kutu} Evet ${kutu} Hayır</td><td class="sec">${kutu} Kendi imalat ${kutu} Satış</td><td></td><td></td></tr>`).join('')}
    </tbody>
  </table>
  <h3>Yedek parça</h3>
  <table class="firma"><tr><td>Hangi ürünler için yedek parça var?</td><td>______________________________________________<br><br>______________________________________________</td></tr></table>`, 'Ürün listesi')}

${Object.keys(TEKNIK).map(urunSayfalari).join('\n')}

${sayfa(`
  <h2>Mibzer ve Çayır Biçme Makinesi</h2>
  <p class="yon">Yalnızca satıyorsanız doldurun. Marka ve model yazmanız yeterliyse teknik alanları boş bırakabilirsiniz.</p>
  ${Object.entries(DIGER_TEKNIK).map(([u, alanlar]) => `<h3>${esc(u)} — marka: ______________</h3>${modelTablo(alanlar.map((a) => { const m = a.match(/^(.*?)\s*\(([^)]*)\)$/); return m ? [m[1], m[2]] : [a, '']; }))}`).join('')}
  <h3>Fotoğraf</h3>
  <p>${kutu} Mibzer: genel görünüm, traktöre bağlı, sahada &nbsp;&nbsp; ${kutu} Çayır biçme: genel görünüm, bıçak/disk detayı, sahada</p>`, 'Mibzer · Çayır biçme')}

${sayfa(`
  <h2>Onay</h2>
  <p>Bu formdaki bilgiler katalogda ve internet sitesinde kullanılacaktır. Boş bırakılan alanlar katalogda gösterilmez.</p>
  <h3>Eklemek istedikleriniz</h3>
  <div class="not-kutu" style="height:120mm"></div>
  <div class="imza"><div>Ad Soyad</div><div>İmza</div><div>Tarih</div></div>`, 'Onay')}

</body></html>`;

mkdirSync(CIKTI, { recursive: true });
const dosya = join(CIKTI, 'Ucel-Teknik-Veri-Formu.html');
writeFileSync(dosya, html());
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const s = await tarayici.newPage();
await s.goto(pathToFileURL(dosya).href, { waitUntil: 'networkidle' });
await s.evaluate(() => document.fonts.ready);
const tasan = await s.evaluate(() => [...document.querySelectorAll('.page')].map((el, i) => {
  const sinir = el.querySelector('.alt').getBoundingClientRect().top;
  const enAlt = Math.max(...[...el.children].filter((c) => !c.matches('.alt, .ust')).map((c) => c.getBoundingClientRect().bottom));
  return enAlt > sinir + 1 ? `sayfa ${i + 1}: ${Math.round(enAlt - sinir)} px taşıyor` : null;
}).filter(Boolean));
if (tasan.length) console.warn('UYARI — taşan sayfalar:\n' + tasan.join('\n'));
await s.pdf({ path: join(CIKTI, 'Ucel-Teknik-Veri-Formu.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await tarayici.close();
console.log('yazıldı: ucel-romork/_kaynak/cikti/Ucel-Teknik-Veri-Formu.pdf ·', sayfaNo, 'sayfa');
