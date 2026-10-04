// Üçel Ürün Kataloğu — sade, yatay (2:1) sayfa sistemi
// Her ürün tek sayfa: başlık | slogan | QR — ana görsel — kısa açıklama + 2 görsel — teknik tablo — iletişim şeridi
// Çalıştırma: node katalog3.mjs [--taslak]    (CHROMIUM_PATH gerekirse)
//   --taslak : eksik teknik alanlar [TEKNİK VERİ BEKLENİYOR] olarak görünür
//   varsayılan: yalnızca Üçel'in teyit ettiği teknik veriler görünür
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER, SAHADAN } from './katalog2-veri.mjs';
import { TEKNIK, BEKLENIYOR } from './teknik-veri.mjs';

const TASLAK = process.argv.includes('--taslak');
const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const foto = (ad) => pathToFileURL(join(CIKTI, 'pdf-gorsel', `${ad}.jpg`)).href;
const marka = (d) => pathToFileURL(join(BURASI, 'marka', d)).href;
const font = (p, d) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', p, d)).href;
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (t) => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'L', color: { dark: '#1B1B1DFF', light: '#FFFFFF00' } });
const dolu = (v) => v !== null && v !== undefined && v !== '';

// Katalog sayfası içeriği. Metinler ucel-tarim-aletleri sitesinden kısaltıldı.
// alanlar: teknik-veri.mjs'teki satır adları — katalogda yalnızca karar için gereken temel alanlar.
const SAYFALAR = [
  {
    id: 'pulluk', kategori: 'Toprak İşleme', imalat: false,
    aciklama: 'Tarlanın ekim öncesi derin işlenmesinde kullanılan temel ekipman. Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.',
    kullanim: ['Derin toprak işleme', 'Ekim öncesi hazırlık', 'Anız bozma'],
    gorsel: [['kulakli-pulluk', 'Kulaklı pulluk'], ['on-yukleyici-ve-pulluk', 'Üçel pulluk ve ön yükleyici']],
    alanlar: ['Model', 'Gövde sayısı', 'Toplam çalışma genişliği', 'Ağırlık', 'Gereken traktör gücü', 'Bağlantı tipi'],
  },
  {
    id: 'kultivator', kategori: 'Toprak İşleme', imalat: true,
    aciklama: 'Pullukla işlenmiş toprağın yüzeyini inceltip tohum yatağını hazırlar, yabani otla mücadelede kullanılır. Göksun Sanayi Sitesi\'ndeki atölyemizde üretiyoruz.',
    kullanim: ['Yüzey işleme', 'Tohum yatağı hazırlığı', 'Yabani ot mücadelesi'],
    gorsel: [['yayli-kultivator-kirmizi', 'Göksun yaylı kültivatör, kırmızı'], ['yayli-kultivator-mavi', 'Göksun yaylı kültivatör, mavi']],
    alanlar: ['Model', 'Ayak sayısı', 'Çalışma genişliği', 'Ağırlık', 'Gereken traktör gücü', 'Bağlantı tipi'],
  },
  {
    id: 'gubre-serpme', kategori: 'Gübreleme', imalat: false,
    aciklama: 'Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine.',
    kullanim: ['Kimyasal gübreleme', 'Organik gübreleme'],
    gorsel: [['romork-ve-gubre-serpme', 'Gübre serpme makinesi, teslimatta']],
    alanlar: ['Model', 'Gübre kapasitesi', 'Serpme genişliği', 'Tahrik', 'Gereken traktör gücü'],
  },
  {
    id: 'romork', kategori: 'Taşıma & Yükleme', imalat: true,
    aciklama: 'Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar atölyemizde üretiyoruz; kasa rengini ve yazısını isteğinize göre yapıyoruz.',
    kullanim: ['Ürün taşıma', 'Gübre ve yem', 'Odun ve malzeme', 'Hayvancılık'],
    gorsel: [['tarim-romorku-mavi', 'Tarım römorku, yandan görünüm'], ['tarim-romorku-yesil', 'Arkadan görünüm, kasada müşteri adı'], ['tarim-romorku-yesil-teslimat', 'Müşterimize teslimat']],
    alanlar: ['Model', 'Taşıma kapasitesi', 'Kasa iç ölçüsü (U × G × Y)', 'Dingil sayısı', 'Lastik ebadı', 'Damper', 'Gereken traktör gücü'],
  },
  {
    id: 'su-tankeri', kategori: 'Taşıma & Yükleme', imalat: false,
    aciklama: 'Tarla sulaması, hayvan suyu ve genel su taşımacılığı için traktörle çekilen tanker.',
    kullanim: ['Tarla sulama', 'Hayvan suyu', 'Su taşımacılığı'],
    gorsel: [['su-tankeri', 'Su tankerleri']],
    alanlar: ['Model', 'Su kapasitesi', 'Tank malzemesi', 'Dingil sayısı', 'Pompa', 'Gereken traktör gücü'],
  },
  {
    id: 'on-yukleyici', kategori: 'Taşıma & Yükleme', imalat: true,
    aciklama: 'Traktörünüzün önüne monte edilen; yem, gübre ve malzeme yükleme-boşaltma işlerini kolaylaştıran sistem. Kendi atölyemizde imal ediyor, montaj uygunluğunu traktör modelinize göre değerlendiriyoruz.',
    kullanim: ['Yükleme-boşaltma', 'Ahır ve çiftlik işleri', 'Malzeme taşıma'],
    gorsel: [['on-yukleyici-atolye', 'Ön yükleyici, atölyemizin önünde'], ['on-yukleyici-kubota', 'Kubota traktöre montaj'], ['on-yukleyici-kaldirma', 'Kepçe kaldırırken']],
    alanlar: ['Model', 'Uygun traktör gücü', 'Kaldırma kapasitesi', 'Maksimum kaldırma yüksekliği', 'Kova genişliği', 'Ağırlık (kova dahil)'],
  },
];
const urunAd = (id) => URUNLER.find((u) => u.id === id).ad;
const urunUrl = (id) => URUNLER.find((u) => u.id === id).url;

// Sayfa numaraları
const NO = { kapak: 1, biz: 2, urunler: 3 };
SAYFALAR.forEach((s, i) => { NO[s.id] = 4 + i; });
NO.sahadan = 4 + SAYFALAR.length; NO.takas = NO.sahadan + 1; NO.arka = NO.takas + 1;
const n2 = (n) => String(n).padStart(2, '0');

const footer = (no) => `<footer class="foot">
  <span class="f-marka">ÜÇEL <b>TARIM ALETLERİ</b></span>
  <span>Telefon / WhatsApp <b>${FIRMA.telefon}</b></span>
  <span>${esc(FIRMA.adres1)}, Göksun / Kahramanmaraş</span>
  <span>${esc(FIRMA.siteGorunen)}</span>
  <span class="f-no">${n2(no)}</span>
</footer>`;

function teknikTablo(s) {
  const satirlar = s.alanlar.map((ad) => TEKNIK[s.id].teknik.find(([a]) => a === ad)).filter(Boolean);
  const modelSatiri = satirlar.find(([a]) => a === 'Model');
  const modeller = modelSatiri && modelSatiri[2] && typeof modelSatiri[2] === 'object' ? Object.keys(modelSatiri[2]) : [];
  const govde = satirlar.filter(([a]) => a !== 'Model');
  const tekDeger = modelSatiri && dolu(modelSatiri[2]) && typeof modelSatiri[2] !== 'object' ? modelSatiri[2] : null;
  const gorunen = TASLAK ? govde : govde.filter(([, , v]) => dolu(v));
  const hucre = (v) => (dolu(v) ? esc(v) : `<span class="bek">${BEKLENIYOR}</span>`);
  const kolonlar = modeller.length ? modeller : [tekDeger || (TASLAK ? null : 'Değer')];
  const baslik = kolonlar.map((m) => `<th>${m ? esc(m) : `<span class="bek">${BEKLENIYOR}</span>`}</th>`).join('');
  if (!gorunen.length) {
    return `<div class="tablo-bos"><b>Teknik özellikler</b><p>Model, ölçü ve kapasite seçeneklerini traktörünüze ve işinize göre birlikte belirliyoruz. QR kodu okutun ya da arayın.</p></div>`;
  }
  return `<table class="teknik">
    <caption>Teknik Özellikler</caption>
    <thead><tr><th>Model</th>${baslik}</tr></thead>
    <tbody>${gorunen.map(([a, birim, v]) => `<tr><td>${esc(a)}${birim && birim !== '3 nokta, kategori' ? ` <small>(${esc(birim.split(' / ')[0] === birim ? birim : birim)})</small>` : ''}</td>${
      modeller.length ? modeller.map((m) => `<td>${hucre(v && v[m])}</td>`).join('') : `<td>${hucre(typeof v === 'object' ? null : v)}</td>`}</tr>`).join('')}</tbody>
  </table>`;
}

async function urunSayfasi(s) {
  const ad = urunAd(s.id);
  const [hero, ...yan] = s.gorsel;
  return `<section class="page urun" id="u-${s.id}">
  <header class="ust">
    <div class="u-baslik">
      <p class="kat">${esc(s.kategori)}${s.imalat ? '<span class="rozet">Kendi İmalatımız</span>' : ''}</p>
      <h1>${esc(ad)}</h1>
    </div>
    <p class="slogan">Tarlada da, yolda da sağlam iş.<span>Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</span></p>
    <div class="qr"><div class="qr-kod">${await qr(wa(`Merhaba, ${ad} hakkında bilgi almak istiyorum.\nTraktör/model:\nHP:\nYapacağım iş:`))}</div><p><b>WhatsApp'tan sor</b>Okutun, mesaj hazır gelsin</p></div>
  </header>
  <div class="govde${yan.length ? '' : ' tek'}">
    <figure class="hero"><img src="${foto(hero[0])}" alt="${esc(hero[1])}"><figcaption>${esc(hero[1])}</figcaption></figure>
    <div class="sag">
      <div class="ust-sag">
        <div class="aciklama">
          <p>${esc(s.aciklama)}</p>
          <ul class="etiket">${s.kullanim.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
        </div>
        ${yan.length ? `<div class="yan y${yan.length}">${yan.map(([f, a], i) => `<figure class="${i === 0 ? 'ikinci' : 'ucuncu'}"><img src="${foto(f)}" alt="${esc(a)}"><figcaption>${esc(a)}</figcaption></figure>`).join('')}</div>` : ''}
      </div>
      ${teknikTablo(s)}
    </div>
  </div>
  ${footer(NO[s.id])}
</section>`;
}

async function html() {
  const urunler = [];
  for (const s of SAYFALAR) urunler.push(await urunSayfasi(s));
  const qrWa = await qr(wa('Merhaba, Üçel kataloğunu inceledim, bilgi almak istiyorum.'));
  const qrSite = await qr(FIRMA.site);
  const qrHarita = await qr(FIRMA.harita);
  const qrTakas = await qr(wa('Merhaba, takas için ekipmanımı göstermek istiyorum.\nEkipman:\nDurumu:'));

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${esc(FIRMA.ad)} — Ürün Kataloğu 2026</title>
${['oswald/500.css', 'oswald/600.css', 'inter/400.css', 'inter/500.css', 'inter/600.css', 'inter/700.css'].map((f) => { const [p, d] = f.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('\n')}
<style>
@page { size: 420mm 210mm; margin: 0; }
:root { --ink:#1B1B1D; --ink2:#3A3A3D; --muted:#6B665F; --line:#DDD7CD; --gold:#A9824F; --gold-l:#D2B181; --gold-d:#8A6A3F; --cream:#F4F1EC; --paper:#FFFFFF; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font: 400 11pt/1.5 'Inter', sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 420mm; height: 210mm; position: relative; overflow: hidden; page-break-after: always; background: var(--paper);
  background-image: repeating-linear-gradient(135deg, rgba(169,130,79,.035) 0 1px, transparent 1px 7mm); }
h1, h2 { font-family: 'Oswald', sans-serif; font-weight: 600; margin: 0; line-height: 1.05; letter-spacing: .3pt; }
p { margin: 0; }
img { display: block; }

/* ortak üst şerit */
.ust { position: absolute; top: 0; left: 0; right: 0; height: 34mm; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; padding: 0 16mm; border-bottom: .4mm solid var(--line); background: var(--paper); }
.u-baslik .kat { font: 600 8.5pt/1 'Inter', sans-serif; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--gold-d); display: flex; align-items: center; gap: 4mm; margin-bottom: 2.5mm; }
.u-baslik h1 { font-size: 30pt; }
.rozet { font: 700 7pt/1 'Inter', sans-serif; letter-spacing: 1pt; color: var(--gold-d); border: .35mm solid var(--gold); padding: 1.4mm 2.2mm; border-radius: .6mm; }
.slogan { text-align: center; font: 500 15pt/1.2 'Oswald', sans-serif; color: var(--ink); letter-spacing: .4pt; }
.slogan span { display: block; font: 400 8.5pt/1.4 'Inter', sans-serif; color: var(--muted); letter-spacing: .3pt; margin-top: 1.2mm; }
.qr { justify-self: end; display: flex; align-items: center; gap: 3mm; }
.qr-kod { width: 23mm; height: 23mm; }
.qr-kod svg { width: 100%; height: 100%; display: block; }
.qr p { font-size: 8pt; color: var(--muted); line-height: 1.35; text-align: right; order: -1; }
.qr b { display: block; font-size: 9.5pt; color: var(--ink); }

/* ürün gövdesi */
.govde { position: absolute; top: 40mm; left: 16mm; right: 16mm; bottom: 20mm; display: grid; grid-template-columns: 0.95fr 1fr; gap: 10mm; }
.hero { margin: 0; background: var(--cream); border-radius: 1.5mm; display: flex; flex-direction: column; overflow: hidden; }
.hero img { flex: 1; min-height: 0; width: 100%; object-fit: contain; }
.hero figcaption, .yan figcaption { font-size: 7.5pt; color: var(--muted); padding: 1.6mm 3mm; background: var(--cream); }
.sag { display: grid; grid-template-rows: 1fr auto; gap: 6mm; min-height: 0; }
.ust-sag { display: grid; grid-template-columns: 1fr 1.35fr; gap: 7mm; min-height: 0; }
.govde.tek .ust-sag { grid-template-columns: 1fr; }
.aciklama { border-left: .7mm solid var(--gold); padding: 1mm 0 0 5mm; }
.aciklama p { font-size: 12pt; line-height: 1.55; color: var(--ink2); }
.etiket { list-style: none; margin: 5mm 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 2mm; }
.etiket li { font: 600 8.5pt/1 'Inter', sans-serif; color: var(--ink); background: var(--cream); border: .25mm solid var(--line); border-radius: 5mm; padding: 1.8mm 3.2mm; }
.yan { display: grid; gap: 3mm; min-height: 0; }
.yan.y1 { grid-template-rows: 1fr; }
.yan.y2 { grid-template-rows: 1.25fr 1fr; }
.yan figure { margin: 0; background: var(--cream); border-radius: 1.2mm; overflow: hidden; display: flex; flex-direction: column; min-height: 0; }
.yan img { flex: 1; min-height: 0; width: 100%; object-fit: contain; }
.yan .ucuncu figcaption { padding: 1.2mm 3mm; }

/* teknik tablo */
table.teknik { width: 100%; border-collapse: collapse; font-size: 9.6pt; }
table.teknik caption { text-align: left; font: 700 8.5pt/1 'Inter', sans-serif; letter-spacing: 1.2pt; text-transform: uppercase; color: var(--ink); background: var(--gold-l); padding: 2mm 3mm; border-radius: 1mm 1mm 0 0; }
table.teknik th { text-align: left; font-weight: 700; font-size: 9pt; padding: 1.6mm 3mm; background: var(--ink); color: #fff; }
table.teknik td { padding: 1.35mm 3mm; border-bottom: .25mm solid var(--line); }
table.teknik tr:nth-child(odd) td { background: #F8F6F2; }
table.teknik td:first-child { font-weight: 600; width: 50%; }
table.teknik td small { font-weight: 400; color: var(--muted); font-size: 8pt; }
table.teknik td + td { border-left: .25mm solid var(--line); font-variant-numeric: tabular-nums; }
.bek { font: 600 7.4pt/1.2 'Inter', sans-serif; color: #6B4A2F; background: #F4ECE2; border: .25mm dashed #6B4A2F; border-radius: .6mm; padding: .5mm 1.4mm; white-space: nowrap; }
th .bek { color: #F4ECE2; background: transparent; border-color: #F4ECE2; }
.tablo-bos { background: var(--cream); border-radius: 1.2mm; padding: 4mm 5mm; }
.tablo-bos b { display: block; font-size: 8.5pt; letter-spacing: 1.2pt; text-transform: uppercase; margin-bottom: 1.5mm; }
.tablo-bos p { font-size: 10pt; color: var(--ink2); }

/* alt şerit */
.foot { position: absolute; left: 0; right: 0; bottom: 0; height: 13mm; background: var(--ink); color: #CFCAC2; display: flex; align-items: center; gap: 9mm; padding: 0 16mm; font-size: 8.5pt; }
.foot b { color: #fff; font-weight: 600; }
.f-marka { font: 600 10.5pt/1 'Oswald', sans-serif; letter-spacing: 1.6pt; color: var(--gold-l); }
.f-marka b { color: #fff; font-weight: 500; }
.f-no { margin-left: auto; font: 600 12pt/1 'Oswald', sans-serif; color: var(--gold-l); }

/* kapak */
.kapak { display: grid; grid-template-columns: 1.15fr 1fr; background: var(--ink); color: #F2F0EC; }
.kapak .k-foto { position: relative; overflow: hidden; }
.kapak .k-foto img { width: 100%; height: 100%; object-fit: cover; }
.kapak .k-yazi { padding: 22mm 20mm 18mm; display: flex; flex-direction: column; }
.kapak .k-logo { width: 52mm; border-radius: 1mm; margin-bottom: 14mm; }
.kapak .firma { font: 600 13pt/1 'Oswald', sans-serif; letter-spacing: 3pt; color: var(--gold-l); margin-bottom: 6mm; }
.kapak h1 { font-size: 40pt; margin-bottom: 6mm; }
.kapak .alt-slogan { font-size: 13pt; color: #CFCAC2; }
.kapak .k-meta { margin-top: auto; border-top: .3mm solid rgba(242,240,236,.25); padding-top: 6mm; display: flex; justify-content: space-between; font-size: 10pt; color: #a3a19c; }
.kapak .k-meta b { display: block; font: 600 14pt/1.2 'Oswald', sans-serif; color: #F2F0EC; }

/* bilgi sayfaları */
.bilgi .icerik { position: absolute; top: 40mm; left: 16mm; right: 16mm; bottom: 20mm; }
.biz { display: grid; grid-template-columns: 1fr 1.1fr; gap: 12mm; height: 100%; }
.biz .metin p { font-size: 12.5pt; line-height: 1.6; color: var(--ink2); margin-bottom: 4mm; }
.degerler { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 8mm; margin-top: 7mm; }
.degerler div { border-top: .6mm solid var(--gold); padding-top: 2.5mm; }
.degerler b { display: block; font: 600 12pt/1.2 'Oswald', sans-serif; margin-bottom: 1mm; }
.degerler span { font-size: 9.5pt; color: var(--muted); line-height: 1.4; display: block; }
.biz .fotolar { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; min-height: 0; }
.biz figure { margin: 0; border-radius: 1.2mm; overflow: hidden; background: var(--cream); display: flex; flex-direction: column; }
.biz figure img { flex: 1; min-height: 0; width: 100%; object-fit: contain; }
.biz figcaption { font-size: 7.5pt; color: var(--muted); padding: 1.6mm 3mm; }
.dizin { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5mm; }
.dizin a { text-decoration: none; color: inherit; display: flex; flex-direction: column; background: var(--paper); border: .3mm solid var(--line); border-radius: 1.2mm; overflow: hidden; }
.dizin .d-foto { height: 70mm; background: var(--cream); }
.dizin .d-foto img { width: 100%; height: 100%; object-fit: contain; }
.dizin .d-yazi { padding: 3mm 3.5mm 3.5mm; }
.dizin .d-kat { font: 600 7pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--gold-d); }
.dizin h2 { font-size: 15pt; margin: 1.5mm 0 1mm; }
.dizin .d-no { font: 600 11pt/1 'Oswald', sans-serif; color: var(--muted); }
.dizin .im { font: 700 6.5pt/1 'Inter', sans-serif; letter-spacing: .8pt; color: var(--gold-d); }
.diger-serit { margin-top: 8mm; display: flex; align-items: center; gap: 8mm; background: var(--cream); border-radius: 1.2mm; padding: 5mm 7mm; }
.diger-serit b { font: 600 13pt/1 'Oswald', sans-serif; }
.diger-serit span { font-size: 11pt; color: var(--ink2); }
.saha { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 5mm; height: 100%; }
.saha figure { margin: 0; border-radius: 1.2mm; overflow: hidden; background: var(--cream); display: flex; flex-direction: column; min-height: 0; }
.saha img { flex: 1; min-height: 0; width: 100%; object-fit: contain; }
.saha figcaption { font-size: 8pt; color: var(--ink2); padding: 1.8mm 3mm; }
.takas { display: grid; grid-template-columns: 1fr 1.25fr; gap: 14mm; height: 100%; }
.takas h2 { font-size: 22pt; margin-bottom: 4mm; }
.takas p { font-size: 11pt; color: var(--ink2); margin-bottom: 3mm; }
.adim { list-style: none; padding: 0; margin: 4mm 0 6mm; counter-reset: a; }
.adim li { counter-increment: a; display: grid; grid-template-columns: 10mm 1fr; padding: 2.4mm 0; border-bottom: .25mm solid var(--line); font-size: 11pt; }
.adim li::before { content: counter(a, decimal-leading-zero); font: 600 13pt/1.2 'Oswald', sans-serif; color: var(--gold); }
.sss { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm 9mm; align-content: start; }
.sss div { border-bottom: .25mm solid var(--line); padding: 2.5mm 0; }
.sss b { display: block; font-size: 10.5pt; margin-bottom: .8mm; }
.sss span { font-size: 9.6pt; color: var(--ink2); line-height: 1.45; display: block; }
.mini-qr { display: flex; align-items: center; gap: 3mm; margin-top: 4mm; }
.mini-qr .qr-kod { width: 22mm; height: 22mm; }
.mini-qr p { font-size: 8.5pt; color: var(--muted); } .mini-qr b { display: block; color: var(--ink); font-size: 9.5pt; }
.h-sayfa { font: 600 8.5pt/1 'Inter', sans-serif; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--gold-d); margin-bottom: 2.5mm; }

/* arka kapak */
.arka { background: var(--ink); color: #F2F0EC; display: grid; grid-template-columns: 1.2fr 1fr; gap: 16mm; padding: 22mm 20mm 20mm; }
.arka h2 { font-size: 34pt; margin: 4mm 0 5mm; }
.arka .alt { font-size: 13pt; color: #CFCAC2; line-height: 1.55; }
.arka .tel { font: 600 40pt/1 'Oswald', sans-serif; letter-spacing: 1pt; margin-top: 12mm; }
.arka .tel-et { font-size: 9pt; color: #a3a19c; margin-top: 10mm; }
.arka dl { margin: 0; display: grid; gap: 4mm; font-size: 11pt; align-content: start; }
.arka dt { font-size: 8pt; letter-spacing: 1pt; text-transform: uppercase; color: #8f8b84; }
.arka dd { margin: .8mm 0 0; }
.arka .qrs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; margin-top: 10mm; }
.arka .qrs div { text-align: center; font-size: 8.5pt; color: #CFCAC2; }
.arka .qrs .qr-kod { width: 26mm; height: 26mm; background: #fff; padding: 1.8mm; border-radius: 1mm; margin: 0 auto 2mm; }
.arka .qrs b { display: block; color: #fff; font-size: 9.5pt; }
.k-mark { font: 600 13pt/1 'Oswald', sans-serif; letter-spacing: 3pt; color: var(--gold-l); }
</style></head><body>

<section class="page kapak">
  <div class="k-foto"><img src="${foto('tarim-romorku-yesil')}" alt="Üçel tarım römorku"></div>
  <div class="k-yazi">
    <img class="k-logo" src="${marka('logo-mark.png')}" alt="Üçel logosu">
    <p class="firma">ÜÇEL TARIM ALETLERİ</p>
    <h1>Tarlada da, yolda da<br>sağlam iş.</h1>
    <p class="alt-slogan">Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</p>
    <div class="k-meta"><span><b>Tarım Makineleri &amp; Ekipmanları</b>Göksun / Kahramanmaraş</span><span style="text-align:right"><b>Ürün Kataloğu</b>2026</span></div>
  </div>
</section>

<section class="page bilgi">
  <header class="ust"><div class="u-baslik"><p class="kat">Hakkımızda</p><h1>Biz kimiz?</h1></div><p class="slogan">Tarlada da, yolda da sağlam iş.<span>Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</span></p><div></div></header>
  <div class="icerik"><div class="biz">
    <div class="metin">
      <p>Üçel Tarım Aletleri, Göksun Sanayi Sitesi'nde tarım ekipmanı imalatı ve satışı yapan bir aile işletmesi. ${esc(FIRMA.yetkili)} mesleği babasının yanında öğrendi; bugün de babasıyla birlikte üretiyor.</p>
      <p>Römork, kültivatör ve ön yükleyiciyi kendi atölyemizde imal ediyor; tarım ekipmanı satışı, ikinci el ve takas hizmeti veriyoruz.</p>
      <div class="degerler">
        <div><b>Kendi İmalatımız</b><span>Göksun'daki atölyemizde üretim</span></div>
        <div><b>Sahadan Gelen Tecrübe</b><span>Ekipmanın sahada nasıl kullanıldığını biliyoruz</span></div>
        <div><b>İhtiyaca Göre Çözüm</b><span>Standart dışı ölçüde özel imalat</span></div>
        <div><b>Satış Sonrası Destek</b><span>Ürettiğimiz ve sattığımız ürünlere yedek parça</span></div>
      </div>
    </div>
    <div class="fotolar">
      <figure><img src="${marka('ucel-logo-tabela.jpg')}" alt="Üçel tabelası"><figcaption>Atölyemiz, Göksun Sanayi Sitesi</figcaption></figure>
      <figure><img src="${foto('on-yukleyici-atolye')}" alt="Atölye önünde ön yükleyici"><figcaption>Atölye önünde, teslimata hazır ön yükleyici</figcaption></figure>
    </div>
  </div></div>
  ${footer(NO.biz)}
</section>

<section class="page bilgi">
  <header class="ust"><div class="u-baslik"><p class="kat">Ürün dizini</p><h1>Ürünlerimiz</h1></div><p class="slogan">Tarlada da, yolda da sağlam iş.<span>Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</span></p><div></div></header>
  <div class="icerik">
    <div class="dizin">${SAYFALAR.map((s) => `<a href="#u-${s.id}"><div class="d-foto"><img src="${foto(s.gorsel[0][0])}" alt="${esc(urunAd(s.id))}"></div><div class="d-yazi"><p class="d-kat">${esc(s.kategori)}</p><h2>${esc(urunAd(s.id))}</h2><p class="d-no">Sayfa ${n2(NO[s.id])}${s.imalat ? ' · <span class="im">KENDİ İMALATIMIZ</span>' : ''}</p></div></a>`).join('')}</div>
    <div class="diger-serit"><b>Bunlar da var</b><span>Mibzer · Çayır Biçme Makinesi · Yedek Parça · İkinci El &amp; Takas (sayfa ${n2(NO.takas)}) — model ve fotoğraflar için WhatsApp'tan sorun.</span></div>
  </div>
  ${footer(NO.urunler)}
</section>

${urunler.join('\n')}

<section class="page bilgi">
  <header class="ust"><div class="u-baslik"><p class="kat">Sahadan gerçek kareler</p><h1>Üretimden tarlaya</h1></div><p class="slogan">Tarlada da, yolda da sağlam iş.<span>Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</span></p>
  <div class="qr"><div class="qr-kod">${qrHarita}</div><p><b>Google yorumları</b>ve konum</p></div></header>
  <div class="icerik"><div class="saha">${SAHADAN.slice(0, 6).map(([f, y]) => `<figure><img src="${foto(f)}" alt="${esc(y)}"><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div></div>
  ${footer(NO.sahadan)}
</section>

<section class="page bilgi" id="takas">
  <header class="ust"><div class="u-baslik"><p class="kat">İkinci el · Takas · Sorular</p><h1>Eski ekipmanınızı değerlendirelim</h1></div><div></div>
  <div class="qr"><div class="qr-kod">${qrTakas}</div><p><b>Takas için fotoğraf gönder</b>WhatsApp</p></div></header>
  <div class="icerik"><div class="takas">
    <div>
      <h2>İkinci el ve takas</h2>
      <p>Elimizdeki ikinci el ekipmanlar sürekli değişiyor; aradığınızı sorun. Her ekipmanın durumunu dürüstçe paylaşıyoruz. Resmî garanti belgesi sunmuyoruz.</p>
      <ol class="adim"><li>Ekipmanınızın fotoğrafını çekin.</li><li>WhatsApp'tan durumuyla birlikte gönderin.</li><li>Takas ya da nakit seçeneğini birlikte konuşalım.</li></ol>
    </div>
    <div>
      <p class="h-sayfa">Sık sorulanlar</p>
      <div class="sss">
        <div><b>Göksun dışına gönderiyor musunuz?</b><span>Evet, Türkiye geneline anlaşmalı nakliye ile.</span></div>
        <div><b>Fiyatlar ne kadar?</b><span>Ebat, kapasite ve modele göre değişir; WhatsApp'tan sorun.</span></div>
        <div><b>Traktörüme uygun mu?</b><span>Traktör modelinizi, HP değerini ve işinizi yazın, birlikte bakalım.</span></div>
        <div><b>Özel ölçü yapıyor musunuz?</b><span>Kendi imal ettiğimiz römork, kültivatör gibi ürünlerde evet.</span></div>
        <div><b>Yedek parça var mı?</b><span>Sattığımız ve sık kullanılan ekipmanlar için var.</span></div>
        <div><b>Garanti var mı?</b><span>Resmî garanti belgesi yok; ürettiğimiz ve sattığımız ürünün arkasında duruyoruz.</span></div>
      </div>
    </div>
  </div></div>
  ${footer(NO.takas)}
</section>

<section class="page arka">
  <div>
    <p class="k-mark">ÜÇEL TARIM ALETLERİ</p>
    <h2>İhtiyacınız olan ekipmanı<br>birlikte bulalım.</h2>
    <p class="alt">Traktörünüzü söyleyin. Yapacağınız işi anlatın.<br>Size uygun seçeneği birlikte değerlendirelim.</p>
    <p class="tel-et">Telefon ve WhatsApp</p>
    <p class="tel" style="margin-top:2mm">${FIRMA.telefon}</p>
  </div>
  <div>
    <dl>
      <div><dt>Adres</dt><dd>${esc(FIRMA.adres1)}<br>${esc(FIRMA.adres2)}</dd></div>
      <div><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd></div>
      <div><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></div>
      <div><dt>İnternet</dt><dd>${esc(FIRMA.siteGorunen)}</dd></div>
    </dl>
    <div class="qrs">
      <div><div class="qr-kod">${qrWa}</div><b>WhatsApp</b>Hemen yazın</div>
      <div><div class="qr-kod">${qrSite}</div><b>Web sitesi</b>Tüm ürünler</div>
      <div><div class="qr-kod">${qrHarita}</div><b>Konum</b>Yol tarifi</div>
    </div>
  </div>
</section>
</body></html>`;
}

mkdirSync(CIKTI, { recursive: true });
const ad = TASLAK ? 'Ucel-Urun-Katalogu-2026-sade-TASLAK' : 'Ucel-Urun-Katalogu-2026-sade';
const dosya = join(CIKTI, `${ad}.html`);
writeFileSync(dosya, await html());
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const s = await tarayici.newPage({ viewport: { width: 1588, height: 794 } });
await s.goto(pathToFileURL(dosya).href, { waitUntil: 'networkidle' });
await s.evaluate(() => document.fonts.ready);
const sorun = await s.evaluate(() => {
  const out = [];
  document.querySelectorAll('.page').forEach((p, i) => {
    const foot = p.querySelector('.foot'); const sinir = foot ? foot.getBoundingClientRect().top : p.getBoundingClientRect().bottom;
    p.querySelectorAll('.govde, .icerik, table, .aciklama, .yan').forEach((el) => {
      const r = el.getBoundingClientRect(); if (r.bottom > sinir + 1) out.push(`sayfa ${i + 1}: ${el.className || el.tagName} ${Math.round(r.bottom - sinir)}px taşıyor`);
      if (el.scrollHeight > el.clientHeight + 2 && getComputedStyle(el).overflow !== 'visible') out.push(`sayfa ${i + 1}: ${el.className} içi taşıyor`);
    });
    p.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push(`sayfa ${i + 1}: görsel yüklenmedi ${im.src}`); });
  });
  return out;
});
if (sorun.length) console.warn('UYARI:\n' + sorun.join('\n'));
await s.pdf({ path: join(CIKTI, `${ad}.pdf`), width: '420mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await tarayici.close();
console.log('yazıldı:', `cikti/${ad}.pdf`, '·', NO.arka, 'sayfa');
