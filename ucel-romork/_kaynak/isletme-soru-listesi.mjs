// Üçel'e gönderilecek tek soru listesi (A4 PDF). Cevaplar gelince: fiyatlar → ucel-tarim-aletleri/assets/fiyatlar.js,
// metin teyitleri → ilgili ürün sayfası.
// Çalıştırma: node isletme-soru-listesi.mjs  →  cikti/Ucel-Isletme-Soru-Listesi.pdf
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const BURASI = dirname(fileURLToPath(import.meta.url));
const font = (p) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', p)).href;

const GENEL = [
  ['Fiyatlar sitede açıkça yazsın mı?', 'Evet, model model yazılsın · "…TL\'den başlayan" yazılsın · Hayır, WhatsApp\'tan verilsin'],
  ['Fiyatlara KDV dahil mi? Fiyat atölye teslim mi?', ''],
  ['Ödeme nasıl yapılıyor? (peşin, havale, taksit, kredi kartı …)', ''],
  ['Sipariş verilen bir ürün ortalama kaç günde hazır oluyor?', ''],
  ['Nakliyeyi kim ayarlıyor, ücreti kim ödüyor? Hangi illere sık gönderiyorsunuz?', ''],
  ['Kendi aracınızla teslim ettiğiniz bir bölge var mı? Varsa hangi iller / ilçeler?', ''],
  ['Garanti konusunda müşteriye ne söylüyorsunuz? (Sitede şu an: "Resmî garanti belgesi sunmuyoruz; ürünlerimizin arkasında duruyoruz.")', 'Doğru · Değişmeli:'],
  ['Firma adı sitede hangisi olsun?', 'Üçel Tarım Aletleri · Üçel Ziraat · İkisi birlikte'],
  ['Müşterilerin en çok sorduğu 10 soru nedir? (Sesli mesaj da olur)', ''],
  ['Şu an Instagram / Facebook / TikTok\'ta gönderdiğiniz otomatik mesajın ekran görüntüsü', ''],
  ['Teslimat fotoğraflarındaki müşterilerin sitede görünmesine izin var mı?', 'Var · Yok · Yüzü kapatılsın'],
];

const URUNLER = [
  { ad: 'Tarım Römorku', link: 'urunler/romork/', sorular: [
    'Kaç tonluk modeller var? Kasa ölçüleri (uzunluk × genişlik × yükseklik)?',
    'Çift dingil yapıyor musunuz? (Fotoğraflardaki römorkların hepsi tek dingil)',
    'Damperli model var mı?',
    'Hangi beygire hangi römork uygun?',
    'Eski sitede "4 tonluk modelimiz mevcut" yazıyordu; doğru mu, hâlâ yapılıyor mu?',
  ] },
  { ad: 'Tapan', link: 'urunler/tapan/', sorular: [
    'Tapanın tipi ne? (düz, merdaneli, dişli …)',
    'Kendi imalatınız mı, satılan ürün mü?',
    'Genişlik seçenekleri ve hangi beygire uygun?',
  ], foto: 'Tapanın tek başına, yandan çekilmiş fotoğrafı (sitede tapan fotoğrafı yok)' },
  { ad: 'Yaylı Kültivatör', link: 'urunler/kultivator/', sorular: [
    'Ayak sayısı seçenekleri ve çalışma genişlikleri?',
    'Hangi beygire hangi model uygun?',
    'Merdane / tırmık eki yapıyor musunuz?',
    'Sitedeki "kultivator-ayak-yakin" fotoğrafındaki üç ayaklı kırmızı alet ne? (dipkazan mı?) Ayrı ürünse sayfası açılsın mı?',
  ] },
  { ad: 'Loader Kepçe', link: 'urunler/on-yukleyici/', sorular: [
    'Kepçe traktörün arkasına mı, önüne mi takılıyor? (Fotoğraflarda arkada görünüyor; sitede "Ön Yükleyici" yazıyor)',
    'Hangi traktör markalarına / modellerine takılabiliyor?',
    'Kova ölçüsü ve kaldırma kapasitesi?',
    'Montajı siz mi yapıyorsunuz?',
    'Kolda görünen "150" etiketi neyi gösteriyor?',
  ] },
  { ad: 'Pulluk', link: 'urunler/pulluk/', sorular: [
    'Kendi imalatınız mı, satılan ürün mü? (Gece fotoğrafındaki pullukta Üçel etiketi var)',
    'Gövde sayısı seçenekleri ve hangi beygire uygun?',
  ], foto: 'Pulluğun düz zeminde, yandan çekilmiş net fotoğrafı' },
  { ad: 'Gübre Serpme Makinesi', link: 'urunler/gubre-serpme/', sorular: [
    'Kendi imalatınız mı, satılan ürün mü?',
    'Kapasite seçenekleri?',
    'Tankerlerin yanındaki fotoğrafta görünen yeşil makine gübre serpme mi?',
  ], foto: 'Makinenin tek başına çekilmiş fotoğrafı' },
  { ad: 'Su Tankeri', link: 'urunler/su-tankeri/', sorular: [
    'Kendi imalatınız mı, satılan ürün mü?',
    'Kapasite seçenekleri (litre)?',
    'Pompalı model var mı?',
  ] },
];

const kutu = (n = 1) => Array.from({ length: n }, () => '<div class="cizgi"></div>').join('');
const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<link rel="stylesheet" href="${font('inter/400.css')}"><link rel="stylesheet" href="${font('inter/700.css')}"><link rel="stylesheet" href="${font('oswald/600.css')}">
<style>
@page { size: A4; margin: 14mm 14mm 16mm; }
* { box-sizing: border-box; } body { margin: 0; font: 400 10.5pt/1.45 Inter, sans-serif; color: #1B1B1D; }
h1, h2 { font-family: Oswald, sans-serif; font-weight: 600; margin: 0; }
.kapak { border-bottom: 3px solid #A9824F; padding-bottom: 8px; margin-bottom: 12px; }
.kapak h1 { font-size: 22pt; } .kapak p { margin: 4px 0 0; color: #555; }
.nasil { background: #F4F1EC; border-left: 4px solid #A9824F; padding: 8px 12px; margin: 0 0 14px; }
h2 { font-size: 14pt; margin: 14px 0 6px; padding-bottom: 3px; border-bottom: 1px solid #ddd; }
h2 small { font: 400 9pt Inter; color: #777; }
ol { margin: 0; padding-left: 28px; } li { margin: 0 0 6px; break-inside: avoid; }
.secenek { color: #6b5230; font-size: 9.5pt; }
.cizgi { border-bottom: 1px solid #bbb; height: 18px; }
table { width: 100%; border-collapse: collapse; margin: 6px 0 4px; break-inside: avoid; }
th, td { border: 1px solid #bbb; padding: 4px 6px; text-align: left; font-size: 9.5pt; height: 22px; }
th { background: #1B1B1D; color: #fff; font-weight: 700; }
.urun { break-inside: avoid; }
.foto { margin: 4px 0 0; font-size: 9.5pt; } .foto b { color: #A9824F; }
.alt { margin-top: 14px; font-size: 9pt; color: #777; }
</style></head><body>
<div class="kapak"><h1>Üçel Tarım Aletleri · Siteye eklenecek bilgiler</h1>
<p>Hazırlanma: ${new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} · Yetkili: Bahadır Kocabaş · 0532 480 30 51</p></div>
<div class="nasil"><b>Nasıl doldurulur?</b> Bildiğiniz kadarını yazın; boş kalan soru sitede yazılmaz, uydurulmaz. Fiyat tablolarına model, ölçü/kapasite ve fiyatı yazdığınızda ürün sayfasında fiyat tablosu ve her modelin yanında "Bu modeli sor" butonu çıkar. Kâğıda yazıp fotoğrafını göndermeniz ya da sesli mesajla anlatmanız da yeterli.</div>

<h2>1. Genel</h2>
<ol>${GENEL.map(([s, sec]) => `<li>${s}${sec ? `<div class="secenek">${sec}</div>` : ''}${kutu(1)}</li>`).join('')}</ol>

${URUNLER.map((u, i) => `<div class="urun"><h2>${i + 2}. ${u.ad} <small>· site: …/${u.link}</small></h2>
<ol>${u.sorular.map((s) => `<li>${s}${kutu(1)}</li>`).join('')}</ol>
<table><thead><tr><th style="width:34%">Model</th><th style="width:40%">Ölçü / kapasite</th><th>Fiyat</th></tr></thead><tbody>${'<tr><td></td><td></td><td></td></tr>'.repeat(4)}</tbody></table>
${u.foto ? `<p class="foto"><b>Fotoğraf gerekli:</b> ${u.foto}</p>` : ''}</div>`).join('')}

<p class="alt">Fiyat tablolarının güncellendiği tarih: ______________ · Not (KDV, teslim yeri vb.): ________________________________</p>
</body></html>`;

const dosya = join(BURASI, 'cikti', 'isletme-soru-listesi.html');
writeFileSync(dosya, html);
const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : { executablePath: '/opt/pw-browsers/chromium' });
const s = await b.newPage();
await s.goto(pathToFileURL(dosya).href, { waitUntil: 'networkidle' });
await s.evaluate(() => document.fonts.ready);
await s.pdf({ path: join(BURASI, 'cikti', 'Ucel-Isletme-Soru-Listesi.pdf'), format: 'A4', printBackground: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: '<div style="font:8pt sans-serif;color:#888;width:100%;text-align:center"><span class="pageNumber"></span> / <span class="totalPages"></span></div>', margin: { top: '14mm', bottom: '16mm', left: '14mm', right: '14mm' } });
await b.close();
console.log('yazıldı: cikti/Ucel-Isletme-Soru-Listesi.pdf');
