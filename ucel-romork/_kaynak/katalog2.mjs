// Üçel Katalog 2.0 — Tanıtım kataloğu (dijital PDF)
// Kurulum: cd ucel-romork/_kaynak && npm install && python3 gorseller.py (PDF JPEG'leri için)
// Çalıştırma: npm run katalog2        (Chromium yolu gerekirse: CHROMIUM_PATH=/yol/chrome)
// Çıktı: cikti/Ucel-Tarim-Aletleri-Katalog-2026.pdf
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import QRCode from 'qrcode';
import { chromium } from 'playwright-core';
import { FIRMA, KATEGORILER, URUNLER, DIGER, ISLER, NEDEN, IMALAT, SAHADAN, SSS } from './katalog2-veri.mjs';
import { TEKNIK, DIGER_TEKNIK, STANDART_CEKIM, BEKLENIYOR } from './teknik-veri.mjs';

// --taslak: eksik teknik veriler [TEKNİK VERİ BEKLENİYOR] olarak görünür (Üçel'e doldurması için)
// varsayılan (yayın): yalnızca Üçel'in teyit ettiği veriler görünür (müşteriye gönderilen sürüm)
const TASLAK = process.argv.includes('--taslak');

const BURASI = dirname(fileURLToPath(import.meta.url));
const CIKTI = join(BURASI, 'cikti');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const foto = (ad, kucuk = false) => pathToFileURL(join(CIKTI, 'pdf-gorsel', `${ad}${kucuk ? '-k' : ''}.jpg`)).href;
const marka = (dosya) => pathToFileURL(join(BURASI, 'marka', dosya)).href;
const font = (paket, dosya) => pathToFileURL(join(BURASI, 'node_modules', '@fontsource', paket, dosya)).href;
const wa = (m) => `https://wa.me/${FIRMA.whatsapp}?text=${encodeURIComponent(m)}`;
const qr = (metin) => QRCode.toString(metin, { type: 'svg', margin: 0, errorCorrectionLevel: 'L', color: { dark: '#1B1B1DFF', light: '#FFFFFF00' } });
const kat = (id) => KATEGORILER.find((k) => k.id === id);

const MESAJ = {
  urun: (ad) => `Merhaba, ${ad} hakkında bilgi almak istiyorum.\nTraktör/model:\nHP:\nYapacağım iş:`,
  uygun: 'Merhaba, bana uygun ekipmanı sormak istiyorum.\nTraktör/model:\nHP:\nYapacağım iş:\nArazim:',
  takas: 'Merhaba, takas için ekipmanımı göstermek istiyorum.\nEkipman:\nDurumu:',
  diger: (ad) => `Merhaba, ${ad} hakkında bilgi almak istiyorum.`,
  genel: 'Merhaba, Üçel kataloğunu inceledim, bilgi almak istiyorum.',
};

// Sayfa numaraları
const SAYFA = { kapak: 1, biz: 2, neden: 3, imalat: 4, harita: 5, bul: 6 };
URUNLER.forEach((u, i) => { SAYFA[u.id] = 7 + i * 2; });
SAYFA._diger = 7 + URUNLER.length * 2;
SAYFA._ikinciel = SAYFA._diger + 1;
SAYFA.sahadan = SAYFA._ikinciel + 1;
SAYFA.sss = SAYFA.sahadan + 1;
SAYFA.arka = SAYFA.sss + 1;
const no = (n) => String(n).padStart(2, '0');

const ust = (baslik) => `<header class="ust"><span class="mark">ÜÇEL</span><span>${esc(baslik)}</span></header>`;
const alt = (n, koyu = false) => `<footer class="alt${koyu ? ' koyu' : ''}"><span>${esc(FIRMA.ad)} · ${FIRMA.telefon}${TASLAK ? ' · <b style="color:var(--earth)">TASLAK — Üçel onayı bekleniyor</b>' : ''}</span><span class="pno">${no(n)}</span></footer>`;
const qrKutu = async (hedef, baslik, aciklama, sinif = '') => `<div class="qr ${sinif}"><div class="qr-kod">${await qr(hedef)}</div><p><b>${esc(baslik)}</b>${esc(aciklama)}</p></div>`;

const bekleniyor = (metin = BEKLENIYOR) => `<span class="bekleniyor">${esc(metin)}</span>`;
const doluMu = (v) => v !== null && v !== undefined && v !== '';

// Teknik tablo: değer tek ise tek sütun, { model: değer } ise model sütunları
function teknikTablo(satirlar) {
  const modeller = [...new Set(satirlar.flatMap(([, , v]) => (v && typeof v === 'object' ? Object.keys(v) : [])))];
  const gorunen = TASLAK ? satirlar : satirlar.filter(([, , v]) => doluMu(v));
  if (!gorunen.length) return '';
  const hucre = (v) => (doluMu(v) ? esc(v) : bekleniyor());
  const bas = modeller.length ? modeller.map((m) => `<th>${esc(m)}</th>`).join('') : '<th>Değer</th>';
  return `<table class="teknik"><thead><tr><th>Özellik</th>${bas}</tr></thead><tbody>${gorunen.map(([a, birim, v]) =>
    `<tr><td>${esc(a)}${birim ? `<small>${esc(birim)}</small>` : ''}</td>${modeller.length
      ? modeller.map((m) => `<td>${hucre(v && v[m])}</td>`).join('')
      : `<td>${hucre(typeof v === 'object' ? null : v)}</td>`}</tr>`).join('')}</tbody></table>`;
}

async function urunSayfasi(u) {
  const t = TEKNIK[u.id];
  const [ana, ...digerleri] = u.foto;
  const kucukler = digerleri.slice(0, 3);
  const eksikSayi = t.teknik.filter(([, , v]) => !doluMu(v)).length;
  const opsiyonlar = TASLAK ? t.opsiyon : t.opsiyon.filter(([, x]) => doluMu(x));
  const saha = t.saha
    ? `<figure class="saha-kare"><div class="f"><img src="${foto(t.saha[0], true)}" alt="${esc(t.saha[1])}"></div><figcaption>${esc(t.saha[1])}</figcaption></figure>`
    : TASLAK
      ? `<div class="bos-kare">${bekleniyor('[SAHA FOTOĞRAFI BEKLENİYOR]')}<p>Bu ürünün tarlada / ahırda çalışırken çekilmiş gerçek karesi.</p></div>`
      : `<a class="bos-kare yayin" href="#sahadan"><p>Teslimat ve saha karelerimiz: sayfa ${no(SAYFA.sahadan)}</p></a>`;

  const sol = `<section class="page urun" id="u-${u.id}">
  ${ust(kat(u.kategori).ad)}
  <div class="sekme">${esc(kat(u.kategori).ad)}</div>
  <figure class="u-ana${kucukler.length ? '' : ' tek'}"><img src="${foto(ana[0])}" alt="${esc(ana[1])}"></figure>
  ${kucukler.length ? `<div class="u-kucuk">${kucukler.map(([f, a]) => `<img src="${foto(f, true)}" alt="${esc(a)}">`).join('')}</div>` : ''}
  <div class="u-baslik">
    <h2>${esc(u.ad)}</h2>
    ${u.imalat ? '<span class="rozet">Kendi İmalatımız</span>' : ''}
  </div>
  <p class="u-kisa">${esc(u.kisa)}</p>
  <div class="u-govde">
    <div>
      <h3>Ne işe yarar?</h3>
      <ul class="tik">${u.kullanim.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <h3>Kimler için uygundur?</h3>
      <p>${esc(u.kimler)}</p>
    </div>
    <div>
      <h3>Sahadaki kullanım</h3>
      ${saha}
    </div>
  </div>
  ${TASLAK ? `<div class="foto-ihtiyac"><h3>Fotoğraf ihtiyacı <em>yalnızca taslakta</em></h3><p>Standart 6 kare (genel ön/arka 3/4, yakın detay, traktöre bağlı, sahada, teslimat) ve: ${t.cekim.map(esc).join(' · ')}</p></div>` : ''}
  <p class="devam">Teknik özellikler, uyum kriterleri ve opsiyonlar → sayfa ${no(SAYFA[u.id] + 1)}</p>
  ${alt(SAYFA[u.id])}
</section>`;

  const sag = `<section class="page urun teknik-sayfa${t.teknik.length > 12 ? ' sik' : ''}" id="t-${u.id}">
  ${ust(`${kat(u.kategori).ad} · ${u.ad}`)}
  <div class="sekme">${esc(kat(u.kategori).ad)}</div>
  <div class="t-baslik"><h2>${esc(u.ad)}</h2><span>Teknik bilgiler</span></div>
  <h3>Teknik özellikler</h3>
  ${teknikTablo(t.teknik) || '<p class="t-not">Ölçü, kapasite ve model seçeneklerini ihtiyacınıza göre birlikte belirliyoruz.</p>'}
  ${!TASLAK && eksikSayi && eksikSayi < t.teknik.length ? '<p class="t-not">Tabloda olmayan ölçü ve seçenekleri sorabilirsiniz.</p>' : ''}
  <div class="t-iki">
    <div>
      <h3>Uyum kriterleri</h3>
      <p class="t-aciklama">Bu ürünü seçerken şunlara bakın:</p>
      <table class="uyum">${t.uyum.map(([k, v]) => `<tr><td>${esc(k)}</td>${TASLAK || doluMu(v) ? `<td>${doluMu(v) ? esc(v) : bekleniyor()}</td>` : ''}</tr>`).join('')}</table>
    </div>
    <div>
      <h3>Opsiyonlar</h3>
      ${opsiyonlar.length ? `<ul class="tik ops">${opsiyonlar.map(([o, x]) => `<li><b>${esc(o)}</b>${doluMu(x) ? `<span>${esc(x)}</span>` : `<span>${bekleniyor()}</span>`}</li>`).join('')}</ul>` : '<p class="t-not">Opsiyonlar için bize sorun.</p>'}
    </div>
  </div>
  <div class="cta">
    <div>
      <strong>Traktörünüzü söyleyin, işinizi söyleyin.</strong>
      <p>Tabloya göre size uygun modeli birlikte belirleyelim. Mesajda traktörünüzün markasını, modelini, HP değerini ve yapacağınız işi yazın.</p>
    </div>
    <div class="qrs">
      ${await qrKutu(wa(MESAJ.urun(u.ad)), "WhatsApp'tan sor", 'Okutun, mesaj hazır gelsin')}
      ${await qrKutu(u.url, 'Ürünü incele', 'İnternet sayfası')}
    </div>
  </div>
  ${alt(SAYFA[u.id] + 1)}
</section>`;
  return sol + '\n' + sag;
}

async function html() {
  const urunSayfalari = [];
  for (const u of URUNLER) urunSayfalari.push(await urunSayfasi(u));
  const haritaKat = KATEGORILER.map((k) => {
    const liste = [
      ...URUNLER.filter((u) => u.kategori === k.id).map((u) => [u.ad, `#u-${u.id}`, SAYFA[u.id], u.imalat]),
      ...(k.id === 'ekim' ? [['Mibzer', '#diger', SAYFA._diger, false]] : []),
      ...(k.id === 'diger' ? [['Çayır Biçme Makinesi', '#diger', SAYFA._diger, false], ['Diğer tarım aletleri', '#diger', SAYFA._diger, false]] : []),
      ...(k.id === 'destek' ? [['Yedek Parça', '#diger', SAYFA._diger, false], ['İkinci El & Takas', '#ikinciel', SAYFA._ikinciel, false]] : []),
    ];
    return `<div class="hk"><h3>${esc(k.ad)}</h3>${liste.map(([ad, link, s, im]) => `<a href="${link}"><span>${esc(ad)}${im ? ' <i>Kendi imalat</i>' : ''}</span><b>${no(s)}</b></a>`).join('')}</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="tr"><head><meta charset="UTF-8"><title>${esc(FIRMA.ad)} — Ürün Kataloğu 2026</title>
${['oswald/500.css', 'oswald/600.css', 'inter/400.css', 'inter/600.css', 'inter/700.css'].map((f) => { const [p, d] = f.split('/'); return `<link rel="stylesheet" href="${font(p, d)}">`; }).join('\n')}
<style>
@page { size: A4; margin: 0; }
:root { --ink:#1B1B1D; --ink2:#3A3A3D; --muted:#6B665F; --line:#DDD7CD; --gold:#A9824F; --gold-l:#D2B181; --gold-d:#8A6A3F; --earth:#6B4A2F; --cream:#F2F0EC; --cream2:#E9E4DA; --wa:#1E8E4C; }
* { box-sizing: border-box; }
html, body { margin: 0; }
body { font: 400 10.5pt/1.5 'Inter', sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; background: #fff; padding: 20mm 14mm 18mm; }
.koyu { background: var(--ink); color: var(--cream); }
h1, h2 { font-family: 'Oswald', sans-serif; font-weight: 600; margin: 0; line-height: 1.05; letter-spacing: .3pt; }
h2 { font-size: 30pt; }
h3 { font: 700 9pt/1.3 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--gold-d); margin: 0 0 2mm; }
.koyu h3 { color: var(--gold-l); }
p { margin: 0 0 2.5mm; }
a { color: inherit; text-decoration: none; }
img { display: block; width: 100%; height: 100%; object-fit: cover; }
.lead { font-size: 12pt; line-height: 1.55; color: var(--ink2); }
.koyu .lead { color: #CFCAC2; }
.tik { list-style: none; margin: 0 0 4mm; padding: 0; }
.tik li { position: relative; padding-left: 5.5mm; margin-bottom: 1.3mm; }
.tik li::before { content: ''; position: absolute; left: .5mm; top: 1.4mm; width: 2.6mm; height: 1.3mm; border-left: .55mm solid var(--gold); border-bottom: .55mm solid var(--gold); transform: rotate(-45deg); }
.ust { position: absolute; top: 9mm; left: 14mm; right: 14mm; display: flex; align-items: center; gap: 3mm; font: 600 8pt/1 'Inter', sans-serif; letter-spacing: 1.2pt; text-transform: uppercase; color: var(--muted); }
.koyu .ust { color: #a3a19c; }
.mark { font: 600 11pt/1 'Oswald', sans-serif; letter-spacing: 2pt; color: var(--gold); }
.alt { position: absolute; left: 14mm; right: 14mm; bottom: 8mm; display: flex; justify-content: space-between; align-items: center; font-size: 8pt; color: var(--muted); border-top: .25mm solid var(--line); padding-top: 2.5mm; }
.alt.koyu { background: none; color: #8f8b84; border-color: rgba(242,240,236,.18); }
.pno { font: 600 11pt/1 'Oswald', sans-serif; color: var(--ink); }
.alt.koyu .pno { color: var(--gold-l); }
.rozet { display: inline-block; font: 700 7.5pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--gold-d); border: .35mm solid var(--gold); padding: 1.6mm 2.4mm; border-radius: .6mm; white-space: nowrap; }
.kutu { background: var(--cream); border-radius: 1mm; padding: 3.5mm 4mm 1.5mm; margin-bottom: 3.5mm; }
.kutu.uygun { background: #fff; border: .3mm solid var(--gold); }
.qrs { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
.qr { display: flex; gap: 2.5mm; align-items: center; }
.qr-kod { width: 21mm; height: 21mm; flex: none; }
.qr-kod svg { width: 100%; height: 100%; display: block; }
.qr p { font-size: 8pt; color: var(--muted); line-height: 1.3; margin: 0; }
.qr b { display: block; font-size: 9pt; color: var(--ink); }
.qr.acik .qr-kod { background: #fff; padding: 1.6mm; border-radius: .8mm; width: 25mm; height: 25mm; }
.koyu .qr p { color: #a3a19c; } .koyu .qr b { color: var(--cream); }

/* Kapak */
.kapak { padding: 0; }
.kapak .k-foto { position: absolute; inset: 0 0 100mm 0; }
.kapak .k-foto::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(27,27,29,.15) 0%, rgba(27,27,29,0) 35%, rgba(27,27,29,1) 100%); }
.kapak .k-logo { position: absolute; top: 12mm; left: 14mm; width: 44mm; height: 18mm; border-radius: 1mm; overflow: hidden; }
.kapak .k-yazi { position: absolute; left: 14mm; right: 14mm; bottom: 16mm; }
.kapak .firma { font: 600 13pt/1 'Oswald', sans-serif; letter-spacing: 3pt; color: var(--gold-l); margin-bottom: 6mm; }
.kapak h1 { font-size: 44pt; line-height: 1.02; margin-bottom: 5mm; }
.kapak .alt-slogan { font-size: 13pt; color: #CFCAC2; margin-bottom: 12mm; }
.kapak .k-meta { display: flex; justify-content: space-between; align-items: end; border-top: .3mm solid rgba(242,240,236,.25); padding-top: 5mm; font-size: 10pt; color: #a3a19c; }
.kapak .k-meta b { display: block; font: 600 13pt/1.2 'Oswald', sans-serif; color: var(--cream); letter-spacing: .5pt; }

/* Biz kimiz */
.biz-grid { display: grid; grid-template-columns: 1.15fr 1fr; gap: 8mm; margin-top: 6mm; }
.biz-foto { display: grid; gap: 3mm; grid-template-rows: 48mm 64mm; }
.biz-foto div { border-radius: 1mm; overflow: hidden; }
.bilgi { margin-top: 5mm; border-top: .3mm solid var(--line); }
.bilgi div { display: grid; grid-template-columns: 30mm 1fr; padding: 2.2mm 0; border-bottom: .25mm solid var(--line); font-size: 10pt; }
.bilgi dt { color: var(--muted); } .bilgi dd { margin: 0; font-weight: 600; }
.bilgi dl { margin: 0; }
.alinti { font: 500 17pt/1.3 'Oswald', sans-serif; color: var(--ink); border-left: .8mm solid var(--gold); padding-left: 5mm; margin: 8mm 0 0; }

/* Neden */
.degerler { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 10mm; }
.deger { border-top: .6mm solid var(--gold); padding-top: 4mm; }
.deger b { font: 600 26pt/1 'Oswald', sans-serif; color: var(--gold-l); display: block; margin-bottom: 3mm; }
.deger h2 { font-size: 18pt; margin-bottom: 2.5mm; color: var(--cream); }
.deger p { color: #CFCAC2; font-size: 11pt; }
.serit { margin-top: 12mm; background: #242426; border-radius: 1mm; padding: 6mm; display: flex; justify-content: space-between; gap: 6mm; align-items: center; }
.serit p { margin: 0; color: #CFCAC2; }
.serit strong { font: 600 16pt/1.2 'Oswald', sans-serif; color: var(--cream); display: block; }

/* İmalat */
.adimlar { list-style: none; margin: 7mm 0 0; padding: 0; display: grid; gap: 0; }
.adimlar li { display: grid; grid-template-columns: 12mm 30mm 1fr; gap: 3mm; padding: 3mm 0; border-bottom: .25mm solid var(--line); align-items: baseline; }
.adimlar b { font: 600 14pt/1 'Oswald', sans-serif; color: var(--gold); }
.adimlar strong { font: 600 12.5pt/1.2 'Oswald', sans-serif; }
.im-foto { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; height: 62mm; margin-top: 7mm; }
.im-foto figure { margin: 0; border-radius: 1mm; overflow: hidden; position: relative; }
.im-foto figcaption { position: absolute; left: 0; right: 0; bottom: 0; background: rgba(27,27,29,.78); color: #fff; font-size: 8pt; padding: 1.5mm 2.5mm; }

/* Harita */
.harita { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm 8mm; margin-top: 8mm; }
.hk h3 { border-bottom: .5mm solid var(--gold); padding-bottom: 2mm; margin-bottom: 1mm; color: var(--ink); font-size: 9.5pt; }
.hk a { display: flex; justify-content: space-between; align-items: baseline; padding: 2.4mm 0; border-bottom: .25mm solid var(--line); font-size: 11pt; }
.hk a b { font: 600 13pt/1 'Oswald', sans-serif; color: var(--gold-d); }
.hk a i { font-style: normal; font-size: 7.5pt; font-weight: 700; letter-spacing: .6pt; text-transform: uppercase; color: var(--gold-d); margin-left: 2mm; }
.not { font-size: 9pt; color: var(--muted); margin-top: 6mm; }

/* İşe göre bul */
.isler { margin-top: 6mm; display: grid; grid-template-columns: 1fr 1fr; gap: 2.5mm; }
.is { display: flex; justify-content: space-between; align-items: center; gap: 3mm; background: var(--cream); border-radius: 1mm; padding: 3.2mm 4mm; }
.is span { font-size: 9pt; color: var(--muted); display: block; }
.is strong { font: 600 12pt/1.2 'Oswald', sans-serif; display: block; }
.is b { font: 600 13pt/1 'Oswald', sans-serif; color: var(--gold-d); }
.soyle { margin-top: 8mm; background: var(--ink); color: var(--cream); border-radius: 1mm; padding: 7mm; display: grid; grid-template-columns: 1fr auto; gap: 6mm; align-items: center; }
.soyle h2 { font-size: 24pt; margin-bottom: 3mm; }
.soyle p { color: #CFCAC2; }
.soyle .tik li::before { border-color: var(--gold-l); }
.soyle .tik { color: var(--cream); }

/* Ürün sayfası */
.urun { display: flex; flex-direction: column; padding-bottom: 20mm; }
.sekme { position: absolute; right: 0; top: 60mm; background: var(--gold); color: #fff; font: 600 8pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; writing-mode: vertical-rl; padding: 4mm 1.6mm; border-radius: 1mm 0 0 1mm; }
.u-ana { margin: 0; height: 80mm; border-radius: 1mm; overflow: hidden; background: #111; flex: none; }
.u-ana.tek { height: 104mm; }
.u-kucuk { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; height: 24mm; margin-top: 2.5mm; flex: none; }
.u-kucuk img { border-radius: .8mm; height: 24mm; min-width: 0; }
.u-baslik { display: flex; align-items: center; gap: 4mm; margin-top: 5mm; }
.u-kisa { font-size: 11pt; color: var(--ink2); margin: 2mm 0 4mm; max-width: 165mm; }
.u-govde { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.u-govde > div > p { color: var(--ink2); margin-bottom: 4mm; }

/* Teknik sayfa */
.bekleniyor { display: inline-block; font: 600 7.6pt/1.2 'Inter', sans-serif; letter-spacing: .3pt; color: var(--earth); background: #F4ECE2; border: .25mm dashed var(--earth); border-radius: .6mm; padding: .7mm 1.6mm; white-space: nowrap; }
.saha-kare { margin: 0; }
.saha-kare .f { height: 44mm; border-radius: 1mm; overflow: hidden; }
.saha-kare figcaption { font-size: 8.5pt; color: var(--ink2); margin-top: 1.5mm; }
.bos-kare { display: block; height: 44mm; border: .3mm dashed var(--line); border-radius: 1mm; padding: 5mm; background: var(--cream); }
.bos-kare p { font-size: 9pt; color: var(--muted); margin-top: 3mm; }
.bos-kare.yayin { border-style: solid; }
.devam { position: absolute; left: 14mm; right: 14mm; bottom: 17mm; font-size: 8.5pt; color: var(--gold-d); font-weight: 600; text-align: right; margin: 0; }
.t-baslik { display: flex; align-items: baseline; gap: 4mm; margin: 0 0 5mm; border-bottom: .5mm solid var(--gold); padding-bottom: 3mm; }
.t-baslik h2 { font-size: 24pt; }
.t-baslik span { font: 600 9pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--muted); }
table.teknik { width: 100%; border-collapse: collapse; font-size: 9.4pt; margin-bottom: 3mm; }
table.teknik th { text-align: left; font: 700 7.5pt/1.2 'Inter', sans-serif; letter-spacing: .8pt; text-transform: uppercase; color: var(--muted); padding: 1.6mm 2mm; border-bottom: .4mm solid var(--ink); }
table.teknik td { padding: 1.45mm 2mm; border-bottom: .25mm solid var(--line); vertical-align: middle; }
table.teknik tr:nth-child(even) td { background: #FAF8F4; }
table.teknik td:first-child { width: 52%; }
table.teknik td small { display: inline; margin-left: 2mm; font-size: 7.6pt; color: var(--muted); }
table.teknik td + td { font-weight: 700; font-variant-numeric: tabular-nums; }
.t-not { font-size: 9.5pt; color: var(--muted); margin: 1mm 0 3mm; }
.t-iki { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm; margin-top: 4mm; }
.t-aciklama { font-size: 9pt; color: var(--muted); margin-bottom: 1.5mm; }
table.uyum { width: 100%; border-collapse: collapse; font-size: 9.2pt; }
table.uyum td { padding: 1.5mm 0; border-bottom: .25mm solid var(--line); vertical-align: middle; }
table.uyum td + td { text-align: right; }
.ops li { margin-bottom: 1.6mm; }
.ops li span .bekleniyor { margin-top: .4mm; }
.ops li b { display: block; font-weight: 600; font-size: 9.4pt; }
.ops li span { display: block; font-size: 8.4pt; color: var(--muted); margin-top: .6mm; }
.foto-ihtiyac { margin-top: 5mm; border: .3mm dashed var(--earth); border-radius: 1mm; padding: 3mm 4mm; background: #FBF7F1; }
.foto-ihtiyac h3 { color: var(--earth); margin-bottom: 1mm; }
.foto-ihtiyac h3 em { font-style: normal; font-weight: 600; letter-spacing: .3pt; text-transform: none; color: var(--muted); margin-left: 2mm; }
.foto-ihtiyac p { font-size: 8.5pt; color: var(--ink2); margin: 0; }
.teknik-sayfa { display: flex; flex-direction: column; }
.teknik-sayfa.sik table.teknik td { padding-top: 1.05mm; padding-bottom: 1.05mm; }
.cta { margin-top: auto; display: grid; grid-template-columns: 1fr 1.25fr; gap: 6mm; align-items: center; background: var(--cream); border-radius: 1mm; padding: 4mm 5mm; }
.cta strong { font: 600 13pt/1.2 'Oswald', sans-serif; display: block; margin-bottom: 1.5mm; }
.cta p { font-size: 9pt; color: var(--ink2); margin: 0; }
.cta .qrs { grid-template-columns: auto auto; gap: 5mm; }
.dk-teknik { font-size: 8pt; color: var(--muted); line-height: 1.6; }
.dk-teknik b { color: var(--ink); }

/* Diğer ürünler */
.dk { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; margin-top: 8mm; }
.dk article { border: .3mm solid var(--line); border-radius: 1mm; padding: 5mm; display: grid; gap: 3mm; }
.dk article span { font: 700 7.5pt/1 'Inter', sans-serif; letter-spacing: 1pt; text-transform: uppercase; color: var(--gold-d); }
.dk h2 { font-size: 19pt; }
.dk p { color: var(--ink2); margin: 0; }
.foto-yok { font-size: 8.5pt; color: var(--muted); font-style: italic; }

/* İkinci el & takas */
.ie { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; margin-top: 8mm; }
.ie h2 { font-size: 22pt; margin-bottom: 3mm; }
.akis { list-style: none; margin: 4mm 0 5mm; padding: 0; counter-reset: a; }
.akis li { counter-increment: a; display: grid; grid-template-columns: 9mm 1fr; gap: 2mm; padding: 2.4mm 0; border-bottom: .25mm solid var(--line); }
.akis li::before { content: counter(a, decimal-leading-zero); font: 600 12pt/1.2 'Oswald', sans-serif; color: var(--gold); }

/* Sahadan */
.sahadan { background: var(--cream); }
.saha { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm 5mm; margin-top: 6mm; }
.saha figure { margin: 0; }
.saha .f { height: 50mm; border-radius: 1mm; overflow: hidden; }
.saha figcaption { font-size: 8.5pt; color: var(--ink2); margin-top: 1.5mm; }

/* SSS */
.sss { columns: 2; column-gap: 8mm; margin-top: 6mm; }
.sss div { break-inside: avoid; padding: 2.6mm 0; border-bottom: .25mm solid var(--line); }
.sss b { display: block; font-size: 10pt; margin-bottom: 1mm; }
.sss p { font-size: 9.2pt; color: var(--ink2); margin: 0; }

/* Arka kapak */
.arka h2 { font-size: 30pt; margin: 6mm 0 4mm; }
.surec { list-style: none; margin: 8mm 0 0; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 3mm; counter-reset: s; }
.surec li { counter-increment: s; border-top: .6mm solid var(--gold); padding-top: 3mm; font-size: 9.5pt; color: #CFCAC2; }
.surec li::before { content: counter(s, decimal-leading-zero); display: block; font: 600 14pt/1 'Oswald', sans-serif; color: var(--gold-l); margin-bottom: 2mm; }
.tel { font: 600 38pt/1 'Oswald', sans-serif; letter-spacing: 1pt; color: var(--cream); margin: 3mm 0 0; }
.iletisim { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; margin-top: 8mm; font-size: 10pt; }
.iletisim dt { font-size: 7.5pt; letter-spacing: 1pt; text-transform: uppercase; color: #8f8b84; }
.iletisim dd { margin: 0 0 3mm; color: var(--cream); }
.arka .qrs3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 10mm; }
</style></head>
<body>

<!-- 01 KAPAK -->
<section class="page koyu kapak" id="kapak">
  <div class="k-foto"><img src="${foto('tarim-romorku-yesil')}" alt="Üçel tarım römorku"></div>
  <div class="k-logo"><img src="${marka('logo-mark.png')}" alt="Üçel logosu"></div>
  <div class="k-yazi">
    <p class="firma">ÜÇEL TARIM ALETLERİ</p>
    <h1>Tarlada da, yolda da<br>sağlam iş.</h1>
    <p class="alt-slogan">Göksun'da üretiyoruz. Türkiye'ye ulaştırıyoruz.</p>
    <div class="k-meta"><span><b>Tarım Makineleri &amp; Ekipmanları</b>Göksun / Kahramanmaraş</span><span style="text-align:right"><b>Ürün Kataloğu</b>2026</span></div>
  </div>
</section>

<!-- 02 BİZ KİMİZ -->
<section class="page" id="biz">
  ${ust('Biz kimiz?')}
  <h2>Göksun'da doğan bir<br>üretim hikâyesi.</h2>
  <div class="biz-grid">
    <div>
      <p class="lead">Üçel Tarım Aletleri'nin hikâyesi bir babanın yanında öğrenilen meslekle başladı. ${esc(FIRMA.yetkili)} bu mesleği babasının yanında öğrendi; bugün de aynı özenle babasıyla omuz omuza üretmeye devam ediyor.</p>
      <p>Göksun Sanayi Sitesi'ndeki atölyemizde ürettiğimiz her tarım aletinin arkasında yılların ustalığı, sahadaki tecrübe ve çiftçinin ihtiyacını bilmenin verdiği anlayış var.</p>
      <p>Bizim için önemli olan sadece bir makine satmak değil; müşterimizin aldığı ekipmanı işinde gönül rahatlığıyla kullanabilmesi.</p>
      <div class="bilgi"><dl>
        <div><dt>Firma</dt><dd>${esc(FIRMA.ad)} (${esc(FIRMA.resmiAd)})</dd></div>
        <div><dt>Yetkili</dt><dd>${esc(FIRMA.yetkili)}</dd></div>
        <div><dt>Atölye</dt><dd>${esc(FIRMA.adres1)}, ${esc(FIRMA.adres2)}</dd></div>
        <div><dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd></div>
      </dl></div>
      <p class="alinti">Babadan oğula aktarılan ustalık, bugün Göksun'da üretime devam ediyor.</p>
    </div>
    <div class="biz-foto">
      <div><img src="${marka('ucel-logo-tabela.jpg')}" alt="ÜÇEL ZİRAAT tabelası"></div>
      <div><img src="${foto('on-yukleyici-atolye')}" alt="Üçel atölyesi, Göksun Sanayi Sitesi"></div>
    </div>
  </div>
  ${alt(SAYFA.biz)}
</section>

<!-- 03 NEDEN ÜÇEL -->
<section class="page koyu" id="neden">
  ${ust('Neden Üçel?')}
  <h2 style="font-size:34pt">Göksun'dan güvenilir<br>bir adres.</h2>
  <div class="degerler">
    ${NEDEN.map(([b, a], i) => `<div class="deger"><b>${no(i + 1)}</b><h2>${esc(b)}</h2><p>${esc(a)}</p></div>`).join('')}
  </div>
  <div class="serit">
    <div><strong>Göksun'dan Türkiye'ye</strong><p>Türkiye geneline anlaşmalı kargo ve nakliye firmalarıyla gönderim.</p></div>
    <div><strong>İkinci el ve takas</strong><p>Alım, satım ve değerlendirme.</p></div>
  </div>
  ${alt(SAYFA.neden, true)}
</section>

<!-- 04 İMALAT -->
<section class="page" id="imalat">
  ${ust('Kendi imalatımız')}
  <h2>Fikirden tarlaya.</h2>
  <p class="lead" style="margin-top:4mm">Her ürün atölyemizde başlayan bir emeğin sonucu. Tasarımdan teslimata kadar her aşama Göksun Sanayi Sitesi'ndeki atölyemizde yürüyor.</p>
  <ol class="adimlar">${IMALAT.map(([b, a], i) => `<li><b>${no(i + 1)}</b><strong>${esc(b)}</strong><span>${esc(a)}</span></li>`).join('')}</ol>
  <div class="im-foto">
    <figure><img src="${marka('uretim-hidrolik-detay.jpg')}" alt="Üretim, hidrolik detay"><figcaption>Üretim — hidrolik detay</figcaption></figure>
    <figure><img src="${foto('tarim-romorku-yesil', true)}" alt="Kendi imalatımız römork"><figcaption>Kendi imalatımız römork</figcaption></figure>
  </div>
  ${alt(SAYFA.imalat)}
</section>

<!-- 05 ÜRÜN HARİTASI -->
<section class="page" id="harita">
  ${ust('Ürün haritası')}
  <h2>Ürünlerimiz</h2>
  <p class="lead" style="margin-top:3mm">Kategoriye göre bakın; sayfa numarasına dokunarak ürüne gidin.</p>
  <div class="harita">${haritaKat}</div>
  <p class="not">"Kendi imalat" işaretli ürünleri Göksun Sanayi Sitesi'ndeki atölyemizde üretiyoruz. Listede olmayan bir ekipman için bizi arayın.</p>
  ${alt(SAYFA.harita)}
</section>

<!-- 06 İŞE GÖRE BUL -->
<section class="page" id="bul">
  ${ust('İşinize göre ürün bulun')}
  <h2>Ne yapmak istiyorsunuz?</h2>
  <div class="isler">
    ${ISLER.map(([is, urun, hedef]) => `<a class="is" href="${hedef[0].startsWith('_') ? (hedef[0] === '_ikinciel' ? '#ikinciel' : '#diger') : `#u-${hedef[0]}`}"><div><span>${esc(is)}</span><strong>${esc(urun)}</strong></div><b>${no(SAYFA[hedef[0]])}</b></a>`).join('')}
  </div>
  <div class="soyle">
    <div>
      <h2>Traktörünü söyle,<br>işini söyle.</h2>
      <p>Emin değilseniz şu 4 bilgiyi bize yazın:</p>
      <ul class="tik"><li>Traktörünüzün markası, modeli ve HP değeri</li><li>Yapacağınız iş</li><li>Arazi şartlarınız</li><li>İhtiyacınız olan kapasite</li></ul>
      <p style="margin:0">Size uygun seçeneği birlikte değerlendirelim.</p>
    </div>
    ${await qrKutu(wa(MESAJ.uygun), 'WhatsApp', 'Okutun, soru formu hazır gelsin', 'acik')}
  </div>
  ${alt(SAYFA.bul)}
</section>

${urunSayfalari.join('\n')}

<!-- DİĞER ÜRÜNLER -->
<section class="page" id="diger">
  ${ust('Ekim · Biçim · Yedek parça')}
  <h2>Diğer ürünlerimiz</h2>
  <p class="lead" style="margin-top:3mm">Bu ürünler için güncel model ve fotoğrafları WhatsApp'tan paylaşıyoruz.</p>
  <div class="dk">
    ${(await Promise.all(DIGER.map(async (d) => `<article><span>${esc(d.kategori)}</span><h2>${esc(d.ad)}</h2><p>${esc(d.kisa)}</p>${TASLAK && DIGER_TEKNIK[d.ad] ? `<div class="dk-teknik"><b>Teknik veriler</b> ${bekleniyor()}<br>${DIGER_TEKNIK[d.ad].map(esc).join(' · ')}<br>${bekleniyor('[ÜRÜN FOTOĞRAFI BEKLENİYOR]')}</div>` : ''}<div class="qrs">${await qrKutu(wa(MESAJ.diger(d.ad)), "WhatsApp'tan sor", 'Hazır mesaj')}${await qrKutu(d.url, 'İncele', 'İnternet sayfası')}</div></article>`))).join('')}
  </div>
  ${alt(SAYFA._diger)}
</section>

<!-- İKİNCİ EL & TAKAS -->
<section class="page" id="ikinciel">
  ${ust('İkinci el & takas')}
  <h2>Eski ekipmanınızı<br>değerlendirelim.</h2>
  <div class="ie">
    <div>
      <h2>İkinci el</h2>
      <p>Elimizdeki ikinci el tarım aletleri sürekli değişiyor. Aradığınız ekipman türünü sorun, "bu ürün hâlâ mevcut mu?" diye yazın, hemen bakalım.</p>
      <p>Resmî garanti belgesi sunmuyoruz; her ekipmanı kontrol ediyor, gerçek durumunu (çalışır durumda mı, eksik parça var mı) dürüstçe paylaşıyoruz.</p>
      <p style="color:var(--muted);font-size:9.5pt">Römork · Pulluk · Kültivatör · Mibzer · Diğer ekipmanlar</p>
      ${await qrKutu(wa('Merhaba, ikinci el ekipmanlarınızı sormak istiyorum.\nAradığım ekipman:'), 'Güncel listeyi sor', 'WhatsApp')}
    </div>
    <div>
      <h2>Takas</h2>
      <p>Artık kullanmadığınız ekipmanı satmak ya da yeni ekipmanla takas etmek istiyorsanız:</p>
      <ol class="akis"><li>Ekipmanın birkaç net fotoğrafını çekin.</li><li>Fotoğrafları ve durumunu WhatsApp'tan gönderin.</li><li>Birlikte değerlendirelim.</li><li>Takas ya da nakit seçeneğini konuşalım.</li></ol>
      ${await qrKutu(wa(MESAJ.takas), 'Takas için fotoğraf gönder', 'WhatsApp')}
    </div>
  </div>
  ${alt(SAYFA._ikinciel)}
</section>

<!-- SAHADAN -->
<section class="page sahadan" id="sahadan">
  ${ust('Sahadan gerçek kareler')}
  <h2>Üretimden tarlaya.</h2>
  <p class="lead" style="margin-top:3mm">Üçel'i sadece katalogda değil, sahada da görün.</p>
  <div class="saha">${SAHADAN.map(([f, y]) => `<figure><div class="f"><img src="${foto(f, true)}" alt="${esc(y)}"></div><figcaption>${esc(y)}</figcaption></figure>`).join('')}</div>
  <div style="margin-top:6mm">${await qrKutu(FIRMA.harita, 'Google yorumlarımız ve konum', 'Gerçek müşteri yorumlarını Google Haritalar\'da okuyun')}</div>
  ${alt(SAYFA.sahadan)}
</section>

<!-- SSS -->
<section class="page" id="sss">
  ${ust('Sık sorulan sorular')}
  <h2>Aklınıza takılanlar</h2>
  <div class="sss">${SSS.map(([s, c]) => `<div><b>${esc(s)}</b><p>${esc(c)}</p></div>`).join('')}</div>
  ${alt(SAYFA.sss)}
</section>

<!-- ARKA KAPAK -->
<section class="page koyu arka" id="arka">
  ${ust('İletişim')}
  <h3 style="margin-top:4mm">Nasıl ilerliyoruz?</h3>
  <ol class="surec"><li>İhtiyacınızı anlatın.</li><li>Traktörünüzü ve yapacağınız işi öğrenelim.</li><li>Size uygun ürünü birlikte belirleyelim.</li><li>Özellik, seçenek ve fiyatı netleştirelim.</li><li>Teslimatı planlayalım.</li></ol>
  <h2>İhtiyacınız olan ekipmanı<br>birlikte bulalım.</h2>
  <p class="lead">Traktörünüzü söyleyin. Yapacağınız işi anlatın.<br>Size uygun seçeneği birlikte değerlendirelim.</p>
  <p style="margin:8mm 0 0;color:#a3a19c">Telefon ve WhatsApp</p>
  <p class="tel">${FIRMA.telefon}</p>
  <div class="iletisim"><dl>
    <dt>Firma</dt><dd>${esc(FIRMA.ad)}<br>Yetkili: ${esc(FIRMA.yetkili)}</dd>
    <dt>Adres</dt><dd>${esc(FIRMA.adres1)}<br>${esc(FIRMA.adres2)}</dd>
  </dl><dl>
    <dt>Çalışma saatleri</dt><dd>${esc(FIRMA.saatler)}</dd>
    <dt>İnternet</dt><dd>${esc(FIRMA.siteGorunen)}</dd>
  </dl></div>
  <div class="qrs3">
    ${await qrKutu(wa(MESAJ.genel), 'WhatsApp', 'Hemen yazın', 'acik')}
    ${await qrKutu(FIRMA.site, 'Web sitesi', 'Tüm ürünler', 'acik')}
    ${await qrKutu(FIRMA.harita, 'Konum', 'Yol tarifi', 'acik')}
  </div>
  ${alt(SAYFA.arka, true)}
</section>

</body></html>`;
}

mkdirSync(CIKTI, { recursive: true });
const ad = TASLAK ? 'Ucel-Tarim-Aletleri-Katalog-2026-TASLAK' : 'Ucel-Tarim-Aletleri-Katalog-2026';
const htmlDosya = join(CIKTI, `${ad}.html`);
writeFileSync(htmlDosya, await html());
const tarayici = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const sayfa = await tarayici.newPage();
await sayfa.goto(pathToFileURL(htmlDosya).href, { waitUntil: 'networkidle' });
await sayfa.evaluate(() => document.fonts.ready);
const tasan = await sayfa.evaluate(() => [...document.querySelectorAll('.page')].map((el, i) => {
  const alt = el.querySelector('.alt'); if (!alt) return null;
  const sinir = alt.getBoundingClientRect().top;
  const icerik = [...el.children].filter((c) => !c.matches('.alt, .sekme, .ust, .devam, .k-foto'));
  const enAlt = Math.max(...icerik.map((c) => c.getBoundingClientRect().bottom));
  return enAlt > sinir + 1 ? `sayfa ${i + 1}: içerik alt bilgiye ${Math.round(enAlt - sinir)} px taşıyor` : null;
}).filter(Boolean));
if (tasan.length) console.warn('UYARI — taşan sayfalar:\n' + tasan.join('\n'));
await sayfa.pdf({ path: join(CIKTI, `${ad}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
await tarayici.close();
console.log('yazıldı:', join('ucel-romork/_kaynak/cikti', `${ad}.pdf`), '·', SAYFA.arka, 'sayfa');
