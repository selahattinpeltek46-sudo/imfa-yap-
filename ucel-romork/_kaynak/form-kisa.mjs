// Üçel kısa teknik bilgi formu — her ürün tek sayfa; alanlar katalog6 ürün sayfasındaki tabloyla aynı.
// Yazdırıp elle doldurulur ya da fotoğrafı WhatsApp'tan gönderilir. Bilinmeyen alan boş bırakılır.
// Çalıştırma: node form-kisa.mjs  →  cikti/Ucel-Teknik-Bilgi-Formu.pdf
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { FIRMA } from './katalog2-veri.mjs';

const BURASI = dirname(fileURLToPath(import.meta.url));
const url = (p) => pathToFileURL(p).href;
const font = (p, w) => url(join(BURASI, 'node_modules/@fontsource', p, `${w}.css`));
const LOGO = url(join(BURASI, 'marka/logo-k3.svg'));
const SITE_IMG = '/home/user/ucel-tarim-aletleri/katalog/img/';

// [ad, foto, imalat sorusu, alanlar [alan, ipucu], seçenekler]
const URUNLER = [
  ['Tarım Römorku', 'tarim-romorku-yesil-traktor-1000.webp', true,
    [['Taşıma kapasitesi', 'ton'], ['Kasa iç ölçüsü (U × G × Y)', 'mm'], ['Dingil', 'tek / çift'], ['Lastik ebadı', ''], ['Damper', 'yok / arkaya / üç yöne'], ['Fren', 'var / yok, tipi'], ['Boş ağırlık', 'kg'], ['Gereken traktör gücü', 'HP']],
    ['Kasa rengi isteğe göre', 'Kasa yazısı isteğe göre', 'Standart dışı ölçüde özel imalat', 'Kasa yükseltme (ilave)', 'Branda / kafes']],
  ['Yaylı Kültivatör', 'yayli-kultivator-kirmizi-2-1000.webp', true,
    [['Ayak sayısı', 'adet'], ['Çalışma genişliği', 'cm'], ['Çalışma derinliği', 'cm'], ['Yay tipi', ''], ['Bağlantı', '3 nokta, kategori'], ['Ağırlık', 'kg'], ['Gereken traktör gücü', 'HP']],
    ['Farklı ayak sayısı', 'Kırmızı / mavi renk', 'Merdane ilavesi', 'Tapan ilavesi']],
  ['Loader Kepçe', 'on-yukleyici-traktor-1000.webp', true,
    [['Kaldırma kapasitesi', 'kg'], ['Kaldırma yüksekliği', 'cm'], ['Kepçe genişliği', 'cm'], ['Kepçe hacmi', 'm³'], ['Montaj yeri', 'ön / arka'], ['Hidrolik', 'traktörden / ayrı pompa'], ['Uygun traktör marka ve modelleri', ''], ['Ağırlık', 'kg']],
    ['Farklı kepçe ebatları', 'Çatal (palet) ataşmanı', 'Kepçe rengi']],
  ['Tapan', null, false,
    [['Tip', 'zincirli / çubuklu / merdaneli'], ['Çalışma genişliği', 'cm'], ['Katlanır mı', 'evet / hayır'], ['Bağlantı', '3 nokta / çeki'], ['Ağırlık', 'kg'], ['Gereken traktör gücü', 'HP']],
    ['Farklı genişlikler', 'Katlanır model']],
  ['Pulluk', 'kulakli-pulluk-1000.webp', false,
    [['Tip', 'kulaklı / diskli / çizel'], ['Gövde sayısı', 'adet'], ['Toplam çalışma genişliği', 'cm'], ['Çalışma derinliği', 'cm'], ['Emniyet sistemi', 'yaylı / kesme pimli'], ['Ağırlık', 'kg'], ['Gereken traktör gücü', 'HP']],
    ['Farklı gövde sayısı', 'Ön kesici / diskli bıçak', 'Derinlik tekerleği']],
  ['Gübre Serpme', 'romork-ve-gubre-serpme-1000.webp', false,
    [['Depo hacmi', 'lt / kg'], ['Serpme genişliği', 'm'], ['Tip', 'tek / çift diskli'], ['Çalışma şekli', 'kuyruk mili (PTO) / hidrolik'], ['Ağırlık', 'kg'], ['Gereken traktör gücü', 'HP']],
    ['Organik gübre için', 'Farklı depo hacmi']],
  ['Su Tankeri', 'su-tankeri-2-1000.webp', false,
    [['Kapasite', 'lt'], ['Tank malzemesi', 'sac / galvaniz / paslanmaz'], ['Sac kalınlığı', 'mm'], ['Dingil', 'tek / çift'], ['Lastik ebadı', ''], ['Pompa', 'var / yok'], ['Boş ağırlık', 'kg']],
    ['Farklı kapasite', 'Pompa', 'Hortum makarası']],
];
const FOTO = ['Önden çapraz, ürünün tamamı', 'Arkadan çapraz', 'Yakın detay (kaynak, bağlantı)', 'Traktöre bağlı ya da çalışırken'];
const kutu = '<span class="cb"></span>';

let no = 0;
const sayfa = (icerik, baslik) => {
  no += 1;
  return `<section class="page"><header class="ust"><img src="${LOGO}" alt=""><span class="m"><b>ÜÇEL</b> Teknik Bilgi Formu</span><span class="b">${baslik}</span></header>${icerik}<footer class="alt"><span>Bilmediğiniz yeri boş bırakın, tahmin yazmayın. Doldurduğunuz sayfanın fotoğrafını WhatsApp'tan gönderin.</span><span>${no} / ${URUNLER.length + 1}</span></footer></section>`;
};

const giris = sayfa(`<div class="giris">
  <h1>Kataloğu tamamlamak için ürün bilgileri</h1>
  <p class="lead">Katalogdaki her ürün sayfasında bir <b>teknik özellikler</b> tablosu var. Bu tabloyu yalnızca sizin verdiğiniz bilgilerle dolduracağız; bilmediğimiz hiçbir değeri yazmıyoruz.</p>
  <ol class="adim">
    <li><b>Her ürün için bir sayfa var.</b> O ürünü kaç modelde yapıyor ya da satıyorsanız her modeli bir sütuna yazın (en fazla 3).</li>
    <li><b>Bilmediğiniz yeri boş bırakın.</b> Emin olmadığınız bir değeri yazmayın; sonra sorarız.</li>
    <li><b>Fiyat satırı isteğe bağlı.</b> Fiyatları şimdi yazmak istemezseniz boş bırakın, sonra ekleriz.</li>
    <li><b>Fotoğraf listesini işaretleyin.</b> Çekebileceğiniz fotoğrafları işaretleyin; düz bir duvar önünde, gündüz ışığında çekilirse en iyisi olur.</li>
    <li><b>Gönderin.</b> Doldurduğunuz sayfaların fotoğrafını <b>${FIRMA.telefon}</b> numarasından WhatsApp ile iletin.</li>
  </ol>
  <div class="ozet"><h3>Formdaki ürünler</h3><ol>${URUNLER.map(([a, , im]) => `<li>${a}${im ? ' <i>(Üçel imalatı)</i>' : ''}</li>`).join('')}</ol></div>
  <div class="imza"><span>Formu dolduran: ..................................................</span><span>Tarih: ....... / ....... / 2026</span></div>
</div>`, 'Nasıl doldurulur?');

const urunSayfa = ([ad, foto, im, alanlar, secenek]) => sayfa(`<div class="ub">
  <div class="uf">${foto ? `<img src="${url(SITE_IMG + foto)}" alt="">` : '<span>Fotoğraf yok</span>'}</div>
  <div><h2>${ad}</h2>
    <p class="soru">Bu ürünü kendiniz mi üretiyorsunuz?</p><p class="soru sec2"><span>${kutu}Evet, Üçel imalatı</span><span>${kutu}Hayır, satışını yapıyoruz</span></p>
    <p class="soru">Kaç model var? ${kutu} 1 &nbsp; ${kutu} 2 &nbsp; ${kutu} 3 &nbsp; ${kutu} Daha fazla: ........</p>
  </div>
</div>
<table class="form"><thead><tr><th class="a">Özellik</th><th class="i">Birim / seçenek</th><th>Model 1</th><th>Model 2</th><th>Model 3</th></tr></thead><tbody>
  <tr class="mdl"><td class="a"><b>Model adı / kodu</b></td><td class="i"></td><td></td><td></td><td></td></tr>
  ${alanlar.map(([a, i]) => `<tr><td class="a">${a}</td><td class="i">${i}</td><td></td><td></td><td></td></tr>`).join('')}
  <tr class="fy"><td class="a">Fiyat <i>(isteğe bağlı)</i></td><td class="i">TL, KDV dahil mi?</td><td></td><td></td><td></td></tr>
</tbody></table>
<div class="iki">
  <div><h3>Seçenekler</h3><table class="sec"><thead><tr><th></th><th>Var</th><th>Yok</th></tr></thead><tbody>${secenek.map((s) => `<tr><td>${s}</td><td>${kutu}</td><td>${kutu}</td></tr>`).join('')}<tr><td>Diğer: ..............................</td><td>${kutu}</td><td>${kutu}</td></tr></tbody></table></div>
  <div><h3>Çekebileceğiniz fotoğraflar</h3><ul class="fl">${FOTO.map((f) => `<li>${kutu}${f}</li>`).join('')}</ul></div>
</div>
<h3>Müşteriye söylemek istediğiniz bir şey <span>(1–2 cümle; ör. ürünü farklı kılan özellik)</span></h3>
<div class="cz"><span></span><span></span><span></span></div>`, ad);

const CSS = `@page { size:A4; margin:0; } * { box-sizing:border-box; } html { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { margin:0; font:400 9.5pt/1.45 Inter,sans-serif; color:#1B1B1D; } h1,h2,h3 { font-family:Oswald,sans-serif; font-weight:600; margin:0; line-height:1.15; } p,ol,ul { margin:0; }
.page { width:210mm; height:297mm; padding:12mm 15mm 0; position:relative; page-break-after:always; overflow:hidden; }
.ust { display:flex; align-items:center; gap:3mm; padding-bottom:3mm; border-bottom:.5mm solid #1B1B1D; margin-bottom:6mm; } .ust img { width:10mm; height:10mm; } .ust .m { font-size:9pt; color:#5c5850; } .ust .m b { font:700 12pt Oswald; letter-spacing:.2em; color:#1B1B1D; margin-right:2mm; } .ust .b { margin-left:auto; font:600 13pt Oswald; }
.alt { position:absolute; left:15mm; right:15mm; bottom:8mm; display:flex; justify-content:space-between; gap:6mm; font-size:7.5pt; color:#8a6a3c; border-top:.25mm solid #E4DED3; padding-top:2mm; }
.giris h1 { font-size:24pt; margin-bottom:4mm; } .lead { font-size:11pt; color:#3a3a3d; margin-bottom:6mm; max-width:165mm; }
.adim { padding-left:6mm; display:grid; gap:3mm; font-size:10.5pt; margin-bottom:8mm; } .adim b { color:#1B1B1D; }
.ozet { background:#F6F3EE; border-left:1mm solid #C9A66E; border-radius:2mm; padding:5mm 6mm; } .ozet h3 { font-size:13pt; margin-bottom:2mm; } .ozet ol { columns:2; padding-left:5mm; font-size:10.5pt; } .ozet i { color:#8a6a3c; font-style:normal; font-size:9pt; }
.imza { display:flex; justify-content:space-between; margin-top:14mm; font-size:10pt; }
.ub { display:grid; grid-template-columns:42mm 1fr; gap:6mm; align-items:center; margin-bottom:5mm; }
.uf { height:30mm; background:#F1EDE6; border-radius:2mm; display:grid; place-items:center; overflow:hidden; } .uf img { width:100%; height:100%; object-fit:contain; padding:2mm; mix-blend-mode:multiply; } .uf span { font-size:8pt; color:#8f8b84; }
.ub h2 { font-size:22pt; margin-bottom:2.5mm; } .soru { font-size:10pt; margin-top:1.5mm; } .sec2 { display:flex; gap:8mm; margin-top:1mm; }
.cb { display:inline-block; width:3.6mm; height:3.6mm; border:.35mm solid #1B1B1D; border-radius:.6mm; vertical-align:-.6mm; margin-right:1.2mm; }
table.form { width:100%; border-collapse:collapse; font-size:9.5pt; margin-bottom:6mm; } table.form th, table.form td { border:.3mm solid #b8b0a3; padding:0 2.5mm; height:10.5mm; text-align:left; }
table.form thead th { height:8mm; background:#1B1B1D; color:#fff; font-size:8.5pt; font-weight:600; border-color:#1B1B1D; } table.form .a { width:52mm; } table.form .i { width:36mm; font-size:8pt; color:#8a6a3c; }
table.form tr.mdl td { background:#F6F3EE; } table.form tr.fy td { background:#FBF8F2; } table.form i { color:#8f8b84; font-size:8pt; }
.iki { display:grid; grid-template-columns:1.1fr 1fr; gap:8mm; margin-bottom:5mm; } h3 { font-size:12pt; margin-bottom:2mm; } h3 span { font:400 8.5pt Inter; color:#8f8b84; }
table.sec { width:100%; border-collapse:collapse; font-size:9.5pt; } table.sec th { font-size:8pt; color:#8a6a3c; text-align:center; width:12mm; } table.sec th:first-child { width:auto; } table.sec td { padding:1.6mm 0; border-bottom:.25mm solid #E4DED3; } table.sec td + td { text-align:center; }
.fl { list-style:none; padding:0; display:grid; gap:2.2mm; font-size:9.5pt; }
.cz span { display:block; height:9mm; border-bottom:.3mm solid #b8b0a3; }`;

const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">${['oswald/600', 'oswald/700', 'inter/400', 'inter/600', 'inter/700'].map((f) => `<link rel="stylesheet" href="${font(...f.split('/'))}">`).join('')}<style>${CSS}</style></head><body>${giris}${URUNLER.map(urunSayfa).join('')}</body></html>`;
mkdirSync(join(BURASI, 'cikti/form-kisa'), { recursive: true });
const dosya = join(BURASI, 'cikti/form-kisa/index.html');
writeFileSync(dosya, html);
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
const pg = await b.newPage();
await pg.goto(url(dosya), { waitUntil: 'networkidle' });
await pg.evaluate(() => document.fonts.ready);
const tasan = await pg.evaluate(() => [...document.querySelectorAll('.page')].map((p, i) => [i + 1, p.scrollHeight > p.clientHeight + 1]).filter(([, t]) => t));
console.log('taşan sayfa:', tasan);
await pg.pdf({ path: join(BURASI, 'cikti/Ucel-Teknik-Bilgi-Formu.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
await b.close();
console.log('ok');
