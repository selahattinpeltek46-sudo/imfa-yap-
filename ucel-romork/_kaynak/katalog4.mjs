// Üçel Ürün Kataloğu 2026 — yatay (420 × 210 mm), kırmızı tema (onaylanan örnek sayfa: "A · Üçel Kırmızısı")
// Her ürün tek sayfa: başlık | slogan | QR — solda büyük ana görsel — sağda kısa açıklama + 2./3. görsel — altta teknik tablo — iletişim şeridi
// Önce: python3 gorseller.py && python3 dekupe.py
// Çalıştırma: node katalog4.mjs [--taslak]    (CHROMIUM_PATH gerekirse)
//   --taslak : boş teknik alanlar [TEKNİK VERİ BEKLENİYOR] olarak görünür (Üçel'e kontrol için)
//   --deneme : yalnızca düzen testi — uydurma "00" değerlerle doldurur, her sayfaya DENEME damgası basar. ASLA dağıtılmaz.
//   varsayılan: boş alanlarda değer uydurulmaz, "Bilgi için arayın" yazar; boş ek kutular görünmez
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA, URUNLER, SAHADAN } from './katalog2-veri.mjs';
import { TEKNIK, BEKLENIYOR } from './teknik-veri.mjs';

const TASLAK = process.argv.includes('--taslak');
const DENEME = process.argv.includes('--deneme');
const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const foto = (ad, kucuk = false) => pathToFileURL(join(CIKTI, 'pdf-gorsel', `${ad}${kucuk ? '-k' : ''}.jpg`)).href;
const dekupe = (ad) => pathToFileURL(join(CIKTI, 'dekupe', `${ad}.jpg`)).href;
const marka = (d) => pathToFileURL(join(BURASI, 'marka', d)).href;
const font = (p, d) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', p, d)).href;
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (t) => QRCode.toString(t, { type: 'svg', margin: 0, errorCorrectionLevel: 'L', color: { dark: '#1F2124FF', light: '#FFFFFF00' } });
const dolu = (v) => v !== null && v !== undefined && v !== '';
const SLOGAN = ['Tarlada da, yolda da sağlam iş.', 'Göksun\'da üretiyoruz. Türkiye\'ye ulaştırıyoruz.'];

// Görsel: d = dekupe (beyaz zeminli, gölgeli; yalnızca kenarı temiz çıkanlar), f = gerçek fotoğraf (çerçeveli, kırpılmaz)
const SAYFALAR = [
  {
    id: 'pulluk', kategori: 'Toprak İşleme', imalat: false, model: 'Kulaklı pulluk',
    aciklama: 'Tarlanın ekim öncesi derin işlenmesinde kullanılan temel ekipman. Toprağınıza ve traktörünüzün gücüne uygun pulluk, traktörünüzü gereksiz yormaz.',
    kullanim: ['Derin toprak işleme', 'Ekim öncesi hazırlık', 'Anız bozma'],
    hero: ['f', 'kulakli-pulluk', 'Kulaklı pulluk'],
    yan: [['f', 'on-yukleyici-ve-pulluk', 'Pulluk ve ön yükleyici']],
    alanlar: ['Gövde sayısı', 'Toplam çalışma genişliği', 'Ağırlık', 'Gereken traktör gücü', 'Bağlantı tipi'],
  },
  {
    id: 'kultivator', kategori: 'Toprak İşleme', imalat: true, model: 'Göksun yaylı kültivatör',
    aciklama: 'Pullukla işlenmiş toprağın yüzeyini inceltip tohum yatağını hazırlar, yabani otla mücadelede kullanılır. Göksun Sanayi Sitesi\'ndeki atölyemizde üretiyoruz.',
    kullanim: ['Yüzey işleme', 'Tohum yatağı', 'Yabani ot mücadelesi'],
    hero: ['d', 'yayli-kultivator-kirmizi', 'Göksun yaylı kültivatör, kırmızı'],
    yan: [['d', 'yayli-kultivator-mavi', 'Mavi renkte']],
    alanlar: ['Ayak sayısı', 'Çalışma genişliği', 'Ağırlık', 'Gereken traktör gücü', 'Bağlantı tipi'],
  },
  {
    id: 'gubre-serpme', kategori: 'Gübreleme', imalat: false, model: 'Traktör arkası gübre serpme',
    aciklama: 'Kimyasal ya da organik gübreyi tarlanıza dengeli şekilde dağıtmanızı sağlayan, traktör arkasına monte edilen makine.',
    kullanim: ['Kimyasal gübreleme', 'Organik gübreleme'],
    hero: ['f', 'romork-ve-gubre-serpme', 'Gübre serpme makinesi, teslimatta'],
    yan: [],
    alanlar: ['Gübre kapasitesi', 'Serpme genişliği', 'Tahrik', 'Gereken traktör gücü'],
  },
  {
    id: 'romork', kategori: 'Taşıma & Yükleme', imalat: true, model: 'Damperli tarım römorku',
    aciklama: 'Tarladan eve, depodan tarlaya yük taşımanın temel ekipmanı. Kaynağından boyasına kadar atölyemizde üretiyoruz; kasa rengini ve yazısını isteğinize göre yapıyoruz.',
    kullanim: ['Ürün taşıma', 'Gübre ve yem', 'Odun ve malzeme', 'Hayvancılık'],
    hero: ['d', 'tarim-romorku-yesil', 'Arkadan görünüm, kasada müşteri adı'],
    yan: [['f', 'tarim-romorku-mavi', 'Mavi kasa, yandan'], ['f', 'tarim-romorku-yesil-teslimat', 'Müşterimize teslimat']],
    alanlar: ['Taşıma kapasitesi', 'Kasa iç ölçüsü (U × G × Y)', 'Dingil sayısı', 'Lastik ebadı', 'Damper', 'Gereken traktör gücü'],
  },
  {
    id: 'su-tankeri', kategori: 'Taşıma & Yükleme', imalat: false, model: 'Traktörle çekilen su tankeri',
    aciklama: 'Tarla sulaması, hayvan suyu ve genel su taşımacılığı için traktörle çekilen tanker.',
    kullanim: ['Tarla sulama', 'Hayvan suyu', 'Su taşımacılığı'],
    hero: ['d', 'su-tankeri', 'Su tankerleri'],
    yan: [],
    alanlar: ['Su kapasitesi', 'Tank malzemesi', 'Dingil sayısı', 'Pompa', 'Gereken traktör gücü'],
  },
  {
    id: 'on-yukleyici', kategori: 'Taşıma & Yükleme', imalat: true, model: 'Traktör ön yükleyici (kepçe)',
    aciklama: 'Traktörünüzün önüne monte edilen; yem, gübre ve malzeme yükleme-boşaltma işlerini kolaylaştıran sistem. Kendi atölyemizde imal ediyor, montaj uygunluğunu traktör modelinize göre değerlendiriyoruz.',
    kullanim: ['Yükleme-boşaltma', 'Ahır ve çiftlik işleri', 'Malzeme taşıma'],
    hero: ['f', 'on-yukleyici-atolye', 'Ön yükleyici, atölyemizin önünde'],
    yan: [['f', 'on-yukleyici-kubota', 'Kubota traktöre montaj'], ['f', 'on-yukleyici-kaldirma', 'Kepçe kaldırırken']],
    alanlar: ['Kaldırma kapasitesi', 'Maksimum kaldırma yüksekliği', 'Kova genişliği', 'Ağırlık (kova dahil)', 'Uygun traktör gücü'],
  },
];
const urunAd = (id) => URUNLER.find((u) => u.id === id).ad;

const NO = { kapak: 1, biz: 2, urunler: 3 };
SAYFALAR.forEach((s, i) => { NO[s.id] = 4 + i; });
NO.sahadan = 4 + SAYFALAR.length; NO.takas = NO.sahadan + 1; NO.arka = NO.takas + 1;
const n2 = (n) => String(n).padStart(2, '0');

const footer = (no) => `<footer class="foot">
  <span class="f-marka">ÜÇEL TARIM ALETLERİ</span>
  <span>Tel / WhatsApp <b>${FIRMA.telefon}</b></span>
  <span>${esc(FIRMA.adres1)} · Göksun / Kahramanmaraş</span>
  <span>${esc(FIRMA.siteGorunen)}</span>
  <span class="f-no">${n2(no)}</span>
</footer>`;

const ust = ({ kat, baslik, alt, qrSvg, qrB, qrA }) => `<div class="sol-ust"></div><div class="serit"></div>
  <div class="baslik"><p class="kat">${esc(kat)}</p><h1>${esc(baslik)}</h1>${alt ? `<p class="model">${esc(alt)}</p>` : ''}</div>
  <div class="slogan"><b>${SLOGAN[0]}</b><span>${SLOGAN[1]}</span></div>
  ${qrSvg ? `<div class="qr"><div class="kod">${qrSvg}</div><p><b>${esc(qrB)}</b>${esc(qrA)}</p></div>` : ''}`;

const gorsel = ([tur, ad, yazi], sinif, kucuk = false) => tur === 'd'
  ? `<figure class="${sinif} dek"><img src="${dekupe(ad)}" alt="${esc(yazi)}"><figcaption>${esc(yazi)}</figcaption></figure>`
  : `<figure class="${sinif} cer"><div class="kutu"><img src="${foto(ad, kucuk)}" alt="${esc(yazi)}"></div><figcaption>${esc(yazi)}</figcaption></figure>`;

// --deneme: düzeni dolu veriyle görmek için sahte değerler (gerçek veri DEĞİL, çıktı dağıtılmaz)
function denemeVerisi(kaynak) {
  const v = structuredClone(kaynak);
  for (const t of Object.values(v)) {
    const alanlar = t.teknik.map(([a]) => a).filter((a) => a !== 'Model');
    t.modeller = [1, 2, 3].map((n) => Object.fromEntries([['Model', `DENEME-${n}`], ...alanlar.map((a) => [a, '00'])]));
    t.farkli = ['Deneme maddesi: kısa bir cümle', 'Deneme maddesi: ikinci özellik', 'Deneme maddesi: üçüncü özellik'];
    t.uyari = ['Deneme uyarısı: kullanım öncesi kontrol', 'Deneme uyarısı: bakım aralığı'];
    if (t.malzeme) t.malzeme = t.malzeme.map(([k]) => [k, '00 mm']);
    if (t.atasman) t.atasman = t.atasman.map(([k], i) => [k, i % 2 === 0 ? true : null]);
  }
  return v;
}
const VERI = DENEME ? denemeVerisi(TEKNIK) : TEKNIK;

const bek = (kisa = false) => `<span class="bek">${kisa ? 'BEKLENİYOR' : BEKLENIYOR}</span>`;
const birimYaz = (b) => (b && !b.includes(',') && !b.includes('/') && b !== 'adet' ? esc(b) : '');

// Elmaksan düzeni: her model bir satır, sütunlar özellikler, en sağda gereken traktör gücü.
// Model verisi yoksa: yayında tek sütunlu özellik listesi ("Bilgi için arayın"), taslakta boş model satırları.
function teknikTablo(s) {
  const t = VERI[s.id];
  const satirlar = s.alanlar.map((ad) => {
    const r = t.teknik.find(([a]) => a === ad);
    if (!r) throw new Error(`teknik-veri.mjs: ${s.id} / "${ad}" alanı yok`);
    return r;
  });
  const modeller = (t.modeller || []).filter((m) => dolu(m.Model));
  const hp = (a) => /traktör gücü/i.test(a);
  if (modeller.length || TASLAK) {
    const sutun = modeller.length && !TASLAK ? satirlar.filter(([a]) => modeller.some((m) => dolu(m[a]))) : satirlar;
    const govde = modeller.length
      ? modeller.map((m) => `<tr><td class="mk">${esc(m.Model)}</td>${sutun.map(([a]) => `<td class="${hp(a) ? 'hp' : ''}">${dolu(m[a]) ? esc(m[a]) : (TASLAK ? bek(true) : '—')}</td>`).join('')}</tr>`).join('')
      : [1, 2].map((n) => `<tr><td class="mk">${bek(true)}</td>${sutun.map(([a]) => `<td class="${hp(a) ? 'hp' : ''}"><span class="soru">?</span></td>`).join('')}</tr>`).join('');
    return `<table class="teknik modelli">
    <caption>Teknik Özellikler${modeller.length ? '' : ` <span class="cap-not">Her model bir satır · ${BEKLENIYOR}</span>`}</caption>
    <thead><tr><th>Model</th>${sutun.map(([a, b]) => `<th class="${hp(a) ? 'hp' : ''}">${esc(a)}${birimYaz(b) ? `<small>${birimYaz(b)}</small>` : ''}</th>`).join('')}</tr></thead>
    <tbody>${govde}</tbody>
  </table>`;
  }
  const tek = t.teknik.find(([a]) => a === 'Model');
  return `<table class="teknik">
    <thead><tr><th>Teknik Özellikler</th><th>${tek && dolu(tek[2]) && typeof tek[2] !== 'object' ? esc(tek[2]) : 'Değer'}</th></tr></thead>
    <tbody>${satirlar.map(([a, b, v]) => `<tr><td>${esc(a)}${birimYaz(b) ? ` <small>(${birimYaz(b)})</small>` : ''}</td><td>${dolu(v) && typeof v !== 'object' ? esc(v) : '<span class="sor">Bilgi için arayın</span>'}</td></tr>`).join('')}</tbody>
  </table>`;
}

// Ana görselin altındaki bilgi kutuları. Yayında yalnızca Üçel'in doldurduğu kutular görünür.
function ekKutular(s) {
  const t = VERI[s.id];
  const k = [];
  const liste = (xs) => `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (t.malzeme) {
    const d = t.malzeme.filter(([, v]) => dolu(v));
    if (d.length || TASLAK) k.push(['Malzeme ve imalat', `<dl>${(TASLAK ? t.malzeme : d).map(([a, v]) => `<dt>${esc(a)}</dt><dd>${dolu(v) ? esc(v) : bek(true)}</dd>`).join('')}</dl>`]);
  }
  if (t.farkli) {
    if (t.farkli.length) k.push(['Modelimizi farklı kılan', liste(t.farkli)]);
    else if (TASLAK && s.imalat) k.push(['Modelimizi farklı kılan', `<p class="bos">${bek()}<br>Ör. kullanılan malzeme, ayar kolaylığı, dayanıklılık detayı</p>`]);
  }
  if (t.atasman) {
    const var_ = t.atasman.filter(([, v]) => v);
    if (var_.length && !TASLAK) k.push(['Takılabilen ataşmanlar', liste(var_.map(([a, v]) => (typeof v === 'string' ? `${a} — ${v}` : a)))]);
    else if (TASLAK) k.push(['Takılabilen ataşmanlar', `<p class="bos">${bek(true)} hangileri var?</p><ul class="sorgu">${t.atasman.map(([a, v]) => `<li>${v ? '<b class="ok">✓</b>' : '<span class="cb"></span>'} ${esc(a)}</li>`).join('')}</ul>`]);
  }
  if (t.uyari) {
    if (t.uyari.length) k.push(['Kullanım ve bakım', liste(t.uyari)]);
    else if (TASLAK) k.push(['Kullanım ve bakım', `<p class="bos">${bek()}<br>Ör. yağlama, kontrol, kullanım sırasında dikkat</p>`]);
  }
  return k.length ? `<div class="ek k${k.length}">${k.map(([b, i]) => `<div class="ek-kutu"><h3>${b}</h3>${i}</div>`).join('')}</div>` : '';
}

const ADIMLAR = `<div class="adimlar"><b>Size uygun olanı birlikte seçelim</b><ol><li>Traktörünüzün modelini ve HP değerini yazın.</li><li>Yapacağınız işi anlatın.</li><li>Uygun seçeneği birlikte belirleyelim.</li></ol></div>`;

async function urunSayfasi(s) {
  const ad = urunAd(s.id);
  const ek = ekKutular(s);
  const kod = await qr(wa(`Merhaba, ${ad} hakkında bilgi almak istiyorum.\nTraktör/model:\nHP:\nYapacağım iş:`));
  return `<section class="page urun" id="u-${s.id}">
  ${ust({ kat: s.kategori, baslik: ad, alt: s.model, qrSvg: kod, qrB: 'WhatsApp\'tan sor', qrA: 'okutun, mesaj hazır' })}
  ${ek ? gorsel(s.hero, 'hero kisa') : gorsel(s.hero, 'hero')}
  ${ek}
  ${s.imalat ? '<span class="rozet">KENDİ İMALATIMIZ</span>' : ''}
  <div class="sag">
    <div class="sag-ust y${s.yan.length}">
      <div class="aciklama"><p>${esc(s.aciklama)}</p><ul>${s.kullanim.map((k) => `<li>${esc(k)}</li>`).join('')}</ul></div>
      ${s.yan.length ? `<div class="yan">${s.yan.map((g) => gorsel(g, 'yg', true)).join('')}</div>` : ADIMLAR}
    </div>
    ${teknikTablo(s)}
  </div>
  ${DENEME ? '<div class="damga">DENEME — GERÇEK VERİ DEĞİL</div>' : ''}
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
  const kucukGorsel = (s) => (s.hero[0] === 'd' ? `<img class="dk" src="${dekupe(s.hero[1])}" alt="">` : `<img src="${foto(s.hero[1], true)}" alt="">`);

  return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><title>${esc(FIRMA.ad)} — Ürün Kataloğu 2026</title>
${['oswald/500.css', 'oswald/600.css', 'oswald/700.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((x) => { const [p, d] = x.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('\n')}
<style>
@page { size: 420mm 210mm; margin: 0; }
:root { --koyu:#1F2124; --vurgu:#C8102E; --ince:#E9454F; --zemin:#F5F3F0; --gri:#6B6862; --cizgi:#E2DED8; }
* { box-sizing: border-box; } html, body { margin: 0; }
body { font: 400 11pt/1.5 'Inter', sans-serif; color: var(--koyu); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
p { margin: 0; } img { display: block; } figure { margin: 0; }
.page { width: 420mm; height: 210mm; position: relative; overflow: hidden; page-break-after: always;
  background: #fff radial-gradient(circle at 1px 1px, rgba(31,33,36,.07) 1px, transparent 1.2px) 0 0 / 5mm 5mm; }
h1, h2 { font-family: 'Oswald', sans-serif; margin: 0; line-height: 1.05; }

/* üst bant */
.sol-ust { position: absolute; left: 0; top: 0; width: 175mm; height: 46mm; background: var(--koyu); clip-path: polygon(0 0, 100% 0, 84% 100%, 0 100%); }
.serit { position: absolute; left: 0; right: 0; top: 0; height: 46mm; background: var(--vurgu); clip-path: polygon(46% 0, 100% 0, 100% 34%, 43.2% 100%, 41.2% 100%); }
.baslik { position: absolute; left: 16mm; top: 9mm; color: #fff; max-width: 135mm; }
.kat { margin: 0 0 2mm; font: 700 8.5pt/1 'Inter'; letter-spacing: 2pt; text-transform: uppercase; color: var(--ince); }
h1 { font: 700 30pt/1 'Oswald'; letter-spacing: .3pt; white-space: nowrap; }
.model { margin-top: 2.5mm; font: 400 10.5pt/1 'Inter'; color: #CFCAC2; }
.slogan { position: absolute; left: 198mm; top: 15mm; color: #fff; }
.slogan b { display: block; font: 600 17pt/1.1 'Oswald'; letter-spacing: .3pt; }
.slogan span { font-size: 9pt; opacity: .9; }
.qr { position: absolute; right: 14mm; top: 8mm; display: flex; gap: 3mm; align-items: center; background: #fff; padding: 2.5mm 3mm 2.5mm 4mm; border-radius: 2mm; box-shadow: 0 1mm 3mm rgba(0,0,0,.15); }
.qr .kod { width: 24mm; height: 24mm; order: 2; } .qr svg { width: 100%; height: 100%; display: block; }
.qr p { font-size: 8pt; color: #555; text-align: right; line-height: 1.35; } .qr b { display: block; font-size: 9.5pt; color: var(--koyu); }

/* görseller */
.dek img { mix-blend-mode: multiply; object-fit: contain; }
/* gerçek fotoğraf: çerçeve fotoğrafın kendi oranına oturur, kırpılmaz, boş kara bant kalmaz */
.cer .kutu { display: flex; justify-content: center; align-items: flex-end; }
.cer .kutu img { max-height: 100%; max-width: 100%; width: auto; height: auto; object-fit: contain; object-position: bottom; border-radius: 2mm; border-bottom: 1.2mm solid var(--vurgu); box-shadow: 0 1mm 3mm rgba(0,0,0,.18); }
.cer figcaption { text-align: center; }
figcaption { font-size: 8pt; color: var(--gri); margin-top: 1.5mm; }
.hero { position: absolute; left: 14mm; top: 52mm; width: 216mm; height: 130mm; display: flex; flex-direction: column; }
.hero.dek img { flex: 1; min-height: 0; width: 100%; }
.hero .kutu { flex: 1; min-height: 0; }
.hero.dek figcaption { padding-left: 1mm; }
.rozet { position: absolute; left: 14mm; top: 52mm; font: 700 8pt/1 'Inter'; letter-spacing: 1.2pt; color: #fff; background: var(--vurgu); padding: 2mm 3mm; border-radius: 1mm; box-shadow: 0 .6mm 1.5mm rgba(0,0,0,.2); }


/* sağ sütun */
.sag { position: absolute; left: 240mm; right: 12mm; top: 52mm; bottom: 19mm; display: grid; grid-template-rows: 1fr auto; gap: 5mm; }
.sag-ust { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; min-height: 0; }
.aciklama { background: var(--zemin); border-radius: 3mm; padding: 5mm 5.5mm; border-left: 1.4mm solid var(--vurgu); align-self: start; }
.aciklama p { font-size: 10.6pt; line-height: 1.55; margin-bottom: 3.5mm; }
.aciklama ul { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 1.6mm; }
.aciklama li { font: 700 7.8pt/1 'Inter'; background: var(--koyu); color: #fff; padding: 1.8mm 2.5mm; border-radius: 1mm; }
.yan { display: flex; flex-direction: column; gap: 3mm; min-height: 0; }
.yg { flex: 1; min-height: 0; display: flex; flex-direction: column; }
.yg .kutu, .yg.dek img { flex: 1; min-height: 0; }
.yg.dek img { width: 100%; }
.yg figcaption { margin-top: 1mm; font-size: 7.5pt; }
.adimlar { align-self: start; border: .4mm solid var(--cizgi); border-radius: 3mm; padding: 5mm 5.5mm; background: #fff; }
.adimlar b { display: block; font: 600 12.5pt/1.2 'Oswald'; margin-bottom: 2.5mm; }
.adimlar ol { margin: 0; padding: 0; list-style: none; counter-reset: a; }
.adimlar li { counter-increment: a; display: grid; grid-template-columns: 8mm 1fr; font-size: 9.6pt; padding: 1.6mm 0; border-top: .25mm solid var(--cizgi); }
.adimlar li::before { content: counter(a); font: 700 12pt/1.1 'Oswald'; color: var(--vurgu); }

/* teknik tablo */
.teknik { width: 100%; border-collapse: collapse; font-size: 9.8pt; }
.teknik th { text-align: left; padding: 2.4mm 3.5mm; background: var(--koyu); color: #fff; font: 700 9.3pt/1 'Inter'; }
.teknik th:first-child { background: var(--vurgu); letter-spacing: .6pt; text-transform: uppercase; font-size: 8.6pt; }
.teknik td { padding: 1.9mm 3.5mm; background: #ECEAE6; }
.teknik tr:nth-child(even) td { background: #F5F4F1; }
.teknik td:first-child { font-weight: 700; width: 55%; }
.teknik td small { font-weight: 400; color: var(--gri); font-size: 8pt; }
.teknik td + td { border-left: .6mm solid #fff; }
.sor { font-size: 8.4pt; color: var(--gri); }
/* model satırlı tablo */
.teknik caption { caption-side: top; text-align: left; font: 700 8.6pt/1 'Inter'; letter-spacing: .6pt; text-transform: uppercase; color: #fff; background: var(--vurgu); padding: 2.4mm 3.5mm; border-radius: 1.5mm 1.5mm 0 0; }
.cap-not { font-weight: 600; letter-spacing: 0; text-transform: none; font-size: 7.4pt; opacity: .9; margin-left: 2mm; }
.modelli th { font-size: 7.8pt; line-height: 1.15; vertical-align: bottom; padding: 2mm 2mm; }
.modelli th:first-child { background: var(--koyu); letter-spacing: 0; text-transform: none; font-size: 7.8pt; }
.modelli th small { display: block; font-weight: 400; font-size: 7pt; opacity: .75; margin-top: .6mm; }
.modelli td { padding: 1.9mm 2mm; text-align: center; font-variant-numeric: tabular-nums; font-size: 9.4pt; }
.modelli td.mk { text-align: left; font-weight: 700; width: auto; white-space: nowrap; }
.modelli th.hp { background: var(--vurgu); }
.modelli td.hp { font-weight: 700; color: var(--vurgu); }
.soru { color: #b9b3aa; font-weight: 700; }
/* ana görsel altı bilgi kutuları */
.hero.kisa { height: 86mm; }
.ek { position: absolute; left: 14mm; width: 216mm; top: 143mm; bottom: 19mm; display: grid; gap: 4mm; }
.ek.k1 { grid-template-columns: 1fr; } .ek.k2 { grid-template-columns: 1fr 1fr; } .ek.k3 { grid-template-columns: repeat(3, 1fr); } .ek.k4 { grid-template-columns: repeat(4, 1fr); }
.ek-kutu { background: var(--zemin); border-top: 1.2mm solid var(--vurgu); border-radius: 0 0 2mm 2mm; padding: 3mm 3.5mm; overflow: hidden; min-height: 0; }
.ek-kutu h3 { margin: 0 0 1.8mm; font: 600 10.5pt/1.1 'Oswald'; letter-spacing: .2pt; }
.ek-kutu ul { margin: 0; padding: 0; list-style: none; }
.ek-kutu li { font-size: 8.4pt; line-height: 1.35; padding: .8mm 0 .8mm 3.2mm; position: relative; }
.ek-kutu li::before { content: ''; position: absolute; left: 0; top: 2.1mm; width: 1.4mm; height: 1.4mm; background: var(--vurgu); }
.ek-kutu dl { margin: 0; display: grid; grid-template-columns: 1fr auto; gap: .9mm 2mm; font-size: 8pt; line-height: 1.25; }
.ek-kutu dt { color: #3A3A3D; } .ek-kutu dd { margin: 0; font-weight: 700; text-align: right; }
.ek-kutu .sorgu li { padding: .35mm 0; } .ek-kutu .sorgu li::before { display: none; }
.ek-kutu .cb { display: inline-block; width: 2.6mm; height: 2.6mm; border: .3mm solid var(--gri); border-radius: .4mm; vertical-align: -.4mm; margin-right: 1mm; }
.ek-kutu .bos + .sorgu { margin-top: 1mm; }
.ek-kutu .bos { font-size: 7.8pt; color: var(--gri); line-height: 1.5; }
.ok { color: #1a7f37; }
.damga { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) rotate(-14deg); font: 700 46pt/1 'Oswald'; color: rgba(200,16,46,.16); border: 2mm solid rgba(200,16,46,.16); padding: 4mm 10mm; white-space: nowrap; pointer-events: none; }
.bek { font: 700 7.2pt/1.2 'Inter'; color: #8A1020; background: #FBEAEC; border: .25mm dashed #C8102E; border-radius: .6mm; padding: .5mm 1.4mm; white-space: nowrap; }

/* alt şerit */
.foot { position: absolute; left: 0; right: 0; bottom: 0; height: 13mm; background: var(--vurgu); color: #fff; display: flex; align-items: center; gap: 11mm; padding: 0 16mm; font-size: 9pt; }
.foot b { font-weight: 700; }
.f-marka { font: 700 11pt/1 'Oswald'; letter-spacing: 1.5pt; }
.f-no { margin-left: auto; font: 700 13pt/1 'Oswald'; background: var(--koyu); padding: 1.6mm 3mm; border-radius: 1mm; }

/* bilgi sayfaları gövdesi */
.icerik { position: absolute; left: 16mm; right: 14mm; top: 54mm; bottom: 20mm; }
.biz { display: grid; grid-template-columns: 1fr 1.1fr; gap: 12mm; height: 100%; }
.biz .metin p { font-size: 12pt; line-height: 1.6; margin-bottom: 4mm; }
.degerler { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 6mm; margin-top: 6mm; }
.degerler div { background: var(--zemin); border-left: 1.2mm solid var(--vurgu); border-radius: 1.5mm; padding: 3mm 4mm; }
.degerler b { display: block; font: 600 12pt/1.2 'Oswald'; margin-bottom: .8mm; }
.degerler span { font-size: 9.3pt; color: var(--gri); line-height: 1.4; display: block; }
.biz .fotolar { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; min-height: 0; }
.biz .fotolar figure, .saha figure { display: flex; flex-direction: column; min-height: 0; }
.biz .kutu, .saha .kutu { flex: 1; min-height: 0; }

.dizin { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5mm; }
.dizin a { text-decoration: none; color: inherit; display: flex; flex-direction: column; background: #fff; border-radius: 2mm; overflow: hidden; box-shadow: 0 .8mm 2.5mm rgba(0,0,0,.12); }
.dizin .d-foto { height: 62mm; background: var(--koyu); border-bottom: 1.2mm solid var(--vurgu); }
.dizin .d-foto.dek { background: #fff; padding: 2mm; }
.dizin .d-foto img { width: 100%; height: 100%; object-fit: contain; }
.dizin .d-foto img.dk { mix-blend-mode: multiply; }
.dizin .d-yazi { padding: 3mm 3.5mm 3.5mm; flex: 1; display: flex; flex-direction: column; }
.dizin .d-kat { font: 700 6.8pt/1 'Inter'; letter-spacing: 1pt; text-transform: uppercase; color: var(--vurgu); }
.dizin h2 { font: 600 14pt/1.1 'Oswald'; margin: 1.5mm 0 2mm; }
.dizin .d-alt { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
.dizin .d-no { font: 700 12pt/1 'Oswald'; color: var(--koyu); }
.dizin .im { font: 700 6.2pt/1 'Inter'; letter-spacing: .6pt; color: #fff; background: var(--vurgu); padding: 1.2mm 1.6mm; border-radius: .6mm; }
.diger-serit { margin-top: 7mm; display: flex; align-items: center; gap: 8mm; background: var(--koyu); color: #fff; border-radius: 2mm; padding: 4.5mm 7mm; border-left: 2mm solid var(--vurgu); }
.diger-serit b { font: 600 13pt/1 'Oswald'; color: var(--ince); white-space: nowrap; }
.diger-serit span { font-size: 10.5pt; }
.alt-serit { position: absolute; left: 0; right: 0; bottom: 0; gap: 12mm; } .alt-serit strong { font: 700 13pt/1 'Oswald'; letter-spacing: .5pt; margin-left: 2mm; }

.saha { display: grid; grid-template-columns: repeat(3, 1fr); grid-template-rows: 1fr 1fr; gap: 4mm 6mm; height: 100%; }
.saha figcaption { font-size: 8.2pt; color: var(--koyu); }

.takas { display: grid; grid-template-columns: 1fr 1.3fr; gap: 12mm; }
.takas h2 { font: 600 20pt/1.1 'Oswald'; margin-bottom: 3mm; }
.takas .sol { background: var(--zemin); border-left: 1.4mm solid var(--vurgu); border-radius: 3mm; padding: 6mm 7mm; align-self: start; }
.takas .sol p { font-size: 11.5pt; margin-bottom: 3mm; }
.adim { list-style: none; padding: 0; margin: 3mm 0 0; counter-reset: a; }
.adim li { counter-increment: a; display: grid; grid-template-columns: 11mm 1fr; padding: 3.2mm 0; border-top: .25mm solid var(--cizgi); font-size: 11.5pt; }
.adim li::before { content: counter(a, decimal-leading-zero); font: 700 13pt/1.1 'Oswald'; color: var(--vurgu); }
.h-sayfa { font: 700 8.5pt/1 'Inter'; letter-spacing: 1.6pt; text-transform: uppercase; color: var(--vurgu); margin-bottom: 2mm; }
.sss { display: grid; grid-template-columns: 1fr 1fr; gap: 0 9mm; align-content: start; }
.sss div { border-bottom: .3mm solid var(--cizgi); padding: 4mm 0; }
.sss b { display: block; font-size: 11.4pt; margin-bottom: .8mm; }
.sss span { font-size: 10.3pt; color: #3A3A3D; line-height: 1.45; display: block; }

/* kapak */
.kapak .k-sol { position: absolute; left: 0; top: 0; bottom: 0; width: 205mm; background: var(--koyu); clip-path: polygon(0 0, 100% 0, 78% 100%, 0 100%); }
.kapak .k-serit { position: absolute; inset: 0; background: var(--vurgu); clip-path: polygon(48.8% 0, 52.4% 0, 39.6% 100%, 36% 100%); }
.kapak .k-yazi { position: absolute; left: 20mm; top: 20mm; bottom: 18mm; width: 140mm; color: #fff; display: flex; flex-direction: column; }
.kapak .k-logo { width: 44mm; border-radius: 1mm; margin-bottom: 12mm; }
.kapak .firma { font: 700 12pt/1 'Oswald'; letter-spacing: 3pt; color: var(--ince); margin-bottom: 5mm; }
.kapak h1 { font: 700 40pt/1.05 'Oswald'; white-space: normal; margin-bottom: 5mm; }
.kapak .alt-slogan { font-size: 13pt; color: #CFCAC2; }
.kapak .k-meta { margin-top: auto; display: flex; gap: 14mm; font-size: 9.5pt; color: #a3a19c; }
.kapak .k-meta b { display: block; font: 600 14pt/1.2 'Oswald'; color: #fff; }
.kapak .k-urun { position: absolute; mix-blend-mode: multiply; object-fit: contain; }
.kapak .k1 { right: 10mm; top: 12mm; width: 205mm; height: 118mm; }
.kapak .k2 { right: 22mm; bottom: 14mm; width: 128mm; height: 72mm; }
.kapak .k-yil { position: absolute; right: 16mm; top: 12mm; font: 700 11pt/1 'Oswald'; letter-spacing: 2pt; color: #fff; background: var(--vurgu); padding: 2.4mm 4mm; border-radius: 1mm; }

/* arka kapak */
.arka { background: var(--koyu); color: #F2F0EC; }
.arka .a-serit { position: absolute; inset: 0; background: var(--vurgu); clip-path: polygon(58% 0, 61% 0, 53% 100%, 50% 100%); }
.arka .a-sol { position: absolute; left: 20mm; top: 22mm; width: 190mm; }
.arka .k-mark { font: 700 12pt/1 'Oswald'; letter-spacing: 3pt; color: var(--ince); }
.arka h2 { font: 700 32pt/1.1 'Oswald'; margin: 5mm 0; }
.arka .alt { font-size: 12.5pt; color: #CFCAC2; line-height: 1.55; }
.arka .tel-et { font-size: 9pt; color: #a3a19c; margin-top: 12mm; letter-spacing: 1pt; text-transform: uppercase; }
.arka .tel { font: 700 42pt/1 'Oswald'; letter-spacing: 1pt; margin-top: 2mm; }
.arka .a-sag { position: absolute; left: 262mm; right: 18mm; top: 22mm; }
.arka dl { margin: 0; display: grid; gap: 4mm; font-size: 10.8pt; }
.arka dt { font-size: 7.8pt; letter-spacing: 1pt; text-transform: uppercase; color: #8f8b84; }
.arka dd { margin: .6mm 0 0; }
.arka .qrs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 9mm; }
.arka .qrs div { text-align: center; font-size: 8.3pt; color: #CFCAC2; }
.arka .qrs .kod { width: 28mm; height: 28mm; background: #fff; padding: 2mm; border-radius: 1.5mm; margin: 0 auto 2mm; }
.arka .qrs svg { width: 100%; height: 100%; display: block; }
.arka .qrs b { display: block; color: #fff; font-size: 9.5pt; }
.arka .a-logo { position: absolute; left: 20mm; bottom: 16mm; width: 30mm; border-radius: 1mm; }
</style></head><body>

<section class="page kapak">
  <div class="k-sol"></div><div class="k-serit"></div>
  <div class="k-yazi">
    <img class="k-logo" src="${marka('logo-mark.png')}" alt="Üçel logosu">
    <p class="firma">ÜÇEL TARIM ALETLERİ</p>
    <h1>Tarlada da, yolda da<br>sağlam iş.</h1>
    <p class="alt-slogan">${SLOGAN[1]}</p>
    <div class="k-meta"><span><b>Ürün Kataloğu</b>Tarım makineleri ve ekipmanları</span><span><b>${FIRMA.telefon}</b>Telefon / WhatsApp</span></div>
  </div>
  <img class="k-urun k1" src="${dekupe('tarim-romorku-yesil')}" alt="Üçel tarım römorku">
  <img class="k-urun k2" src="${dekupe('yayli-kultivator-kirmizi')}" alt="Göksun yaylı kültivatör">
  <span class="k-yil">2026</span>
</section>

<section class="page bilgi">
  ${ust({ kat: 'Hakkımızda', baslik: 'Biz kimiz?', alt: 'Göksun Sanayi Sitesi, Kahramanmaraş', qrSvg: qrHarita, qrB: 'Konum ve yorumlar', qrA: 'Google Haritalar' })}
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
      <figure class="cer"><div class="kutu"><img src="${marka('ucel-logo-tabela.jpg')}" alt="Üçel tabelası"></div><figcaption>Atölyemiz, Göksun Sanayi Sitesi</figcaption></figure>
      <figure class="cer"><div class="kutu"><img src="${foto('on-yukleyici-atolye')}" alt="Atölye önünde ön yükleyici"></div><figcaption>Atölyemizin önünde ön yükleyici</figcaption></figure>
    </div>
  </div></div>
  ${footer(NO.biz)}
</section>

<section class="page bilgi">
  ${ust({ kat: 'Ürün dizini', baslik: 'Ürünlerimiz', alt: 'Ürüne dokunun, sayfasına gidin', qrSvg: qrSite, qrB: 'Tüm ürünler', qrA: 'web sitemizde' })}
  <div class="icerik">
    <div class="dizin">${SAYFALAR.map((s) => `<a href="#u-${s.id}"><div class="d-foto${s.hero[0] === 'd' ? ' dek' : ''}">${kucukGorsel(s)}</div><div class="d-yazi"><p class="d-kat">${esc(s.kategori)}</p><h2>${esc(urunAd(s.id))}</h2><div class="d-alt"><span class="d-no">${n2(NO[s.id])}</span>${s.imalat ? '<span class="im">KENDİ İMALATIMIZ</span>' : ''}</div></div></a>`).join('')}</div>
    <div class="diger-serit"><b>Bunlar da var</b><span>Mibzer · Çayır biçme makinesi · Yedek parça · İkinci el &amp; takas (sayfa ${n2(NO.takas)}) — model ve fotoğraf için WhatsApp'tan sorun.</span></div>
  </div>
  ${footer(NO.urunler)}
</section>

${urunler.join('\n')}

<section class="page bilgi">
  ${ust({ kat: 'Sahadan gerçek kareler', baslik: 'Üretimden tarlaya', alt: 'Atölyemizden ve teslimatlarımızdan', qrSvg: qrHarita, qrB: 'Google yorumları', qrA: 've konum' })}
  <div class="icerik"><div class="saha">${SAHADAN.slice(0, 6).map(([f, y]) => `<figure class="cer"><div class="kutu"><img src="${foto(f, true)}" alt="${esc(y)}"></div><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div></div>
  ${footer(NO.sahadan)}
</section>

<section class="page bilgi" id="takas">
  ${ust({ kat: 'İkinci el · Takas · Sorular', baslik: 'İkinci El & Takas', alt: 'Eski ekipmanınızı değerlendirelim', qrSvg: qrTakas, qrB: 'Takas için fotoğraf gönder', qrA: 'WhatsApp' })}
  <div class="icerik"><div class="takas">
    <div class="sol">
      <h2>Nasıl işliyor?</h2>
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
  </div>
  <div class="diger-serit alt-serit"><b>Bize ulaşın</b><span>Tel / WhatsApp <strong>${FIRMA.telefon}</strong></span><span>${esc(FIRMA.saatler)}</span><span>${esc(FIRMA.adres1)}, ${esc(FIRMA.adres2)}</span></div>
  </div>
  ${footer(NO.takas)}
</section>

<section class="page arka">
  <div class="a-serit"></div>
  <div class="a-sol">
    <p class="k-mark">ÜÇEL TARIM ALETLERİ</p>
    <h2>İhtiyacınız olan ekipmanı<br>birlikte bulalım.</h2>
    <p class="alt">Traktörünüzü söyleyin. Yapacağınız işi anlatın.<br>Size uygun seçeneği birlikte değerlendirelim.</p>
    <p class="tel-et">Telefon ve WhatsApp</p>
    <p class="tel">${FIRMA.telefon}</p>
  </div>
  <img class="a-logo" src="${marka('logo-mark.png')}" alt="Üçel logosu">
  <div class="a-sag">
    <dl>
      <div><dt>Adres</dt><dd>${esc(FIRMA.adres1)}<br>${esc(FIRMA.adres2)}</dd></div>
      <div><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd></div>
      <div><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></div>
      <div><dt>İnternet</dt><dd>${esc(FIRMA.siteGorunen)}</dd></div>
    </dl>
    <div class="qrs">
      <div><div class="kod">${qrWa}</div><b>WhatsApp</b>Hemen yazın</div>
      <div><div class="kod">${qrSite}</div><b>Web sitesi</b>Tüm ürünler</div>
      <div><div class="kod">${qrHarita}</div><b>Konum</b>Yol tarifi</div>
    </div>
  </div>
</section>
</body></html>`;
}

for (const s of SAYFALAR) {
  for (const [tur, ad] of [s.hero, ...s.yan]) {
    const yol = tur === 'd' ? join(CIKTI, 'dekupe', `${ad}.jpg`) : join(CIKTI, 'pdf-gorsel', `${ad}.jpg`);
    if (!existsSync(yol)) throw new Error(`görsel yok: ${yol} — önce gorseller.py / dekupe.py çalıştırın`);
  }
}
mkdirSync(CIKTI, { recursive: true });
const ad = DENEME ? 'Ucel-Urun-Katalogu-2026-DENEME' : TASLAK ? 'Ucel-Urun-Katalogu-2026-TASLAK' : 'Ucel-Urun-Katalogu-2026';
const dosya = join(CIKTI, `${ad}.html`);
writeFileSync(dosya, await html());
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const s = await tarayici.newPage({ viewport: { width: 1588, height: 794 } });
await s.goto(pathToFileURL(dosya).href, { waitUntil: 'networkidle' });
await s.evaluate(() => document.fonts.ready);
const sorun = await s.evaluate(() => {
  const out = [];
  const ic = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
  document.querySelectorAll('.page').forEach((p, i) => {
    const foot = p.querySelector('.foot'); const sinir = foot ? foot.getBoundingClientRect().top : p.getBoundingClientRect().bottom;
    const sayfa = p.getBoundingClientRect();
    p.querySelectorAll('.ek-kutu').forEach((el) => { if (el.scrollHeight > el.clientHeight + 2) out.push(`sayfa ${i + 1}: "${el.querySelector('h3').textContent}" kutusu taşıyor`); });
    const tbl = p.querySelector('table.teknik'); if (tbl && tbl.parentElement.getBoundingClientRect().right + 1 < tbl.getBoundingClientRect().right) out.push(`sayfa ${i + 1}: tablo sağa taşıyor`);
    p.querySelectorAll('.sag, .sag-ust, .aciklama, table, .hero, .ek, .icerik, .dizin, .saha, .sss, .qr, .baslik, .slogan, .a-sag, .a-sol, .k-yazi').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > sinir + 1) out.push(`sayfa ${i + 1}: ${el.className || el.tagName} ${Math.round(r.bottom - sinir)}px alt şeride taşıyor`);
      if (r.right > sayfa.right + 1) out.push(`sayfa ${i + 1}: ${el.className || el.tagName} sağdan taşıyor`);
    });
    const h = p.querySelector('.baslik h1');
    if (h && h.getBoundingClientRect().right > 150 * 96 / 25.4) out.push(`sayfa ${i + 1}: başlık koyu alandan taşıyor`);
    const b = p.querySelector('.baslik'), sl = p.querySelector('.slogan'), q = p.querySelector('.qr');
    if (b && sl && ic(b.getBoundingClientRect(), sl.getBoundingClientRect())) out.push(`sayfa ${i + 1}: başlık slogana biniyor`);
    if (sl && q && ic(sl.getBoundingClientRect(), q.getBoundingClientRect())) out.push(`sayfa ${i + 1}: slogan QR'a biniyor`);
    const tb = p.querySelector('table'), su = p.querySelector('.sag-ust');
    if (tb && su && su.scrollHeight > su.clientHeight + 2) out.push(`sayfa ${i + 1}: sağ üst blok sıkıştı`);
    p.querySelectorAll('img').forEach((im) => { if (!im.complete || !im.naturalWidth) out.push(`sayfa ${i + 1}: görsel yüklenmedi ${im.src}`); });
  });
  return out;
});
if (sorun.length) console.warn('UYARI:\n' + sorun.join('\n'));
await s.pdf({ path: join(CIKTI, `${ad}.pdf`), width: '420mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
await tarayici.close();
console.log('yazıldı:', `cikti/${ad}.pdf`, '·', NO.arka, 'sayfa');
