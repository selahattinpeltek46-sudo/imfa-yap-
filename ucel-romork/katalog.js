/* Üçel Römork e-katalog
 * Ürün ve bilgi içerikleri aşağıdaki listelerde. Teknik değeri henüz bilinmeyen
 * alanlar null bırakıldı; sayfada "Bilgi için arayın" olarak görünür.
 * Değer geldikçe null yerine yazmanız yeterli, örn. kapasite: "5 ton".
 */
const FIRMA = {
  tel: '+905324803051',
  telGorunen: '0532 480 30 51',
  wa: '905324803051',
  harita: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Üçel Tarım Aletleri Göksun Kahramanmaraş'),
};

const KATEGORILER = [
  { id: 'hepsi', ad: 'Tümü' },
  { id: 'romork', ad: 'Römorklar' },
  { id: 'yukleyici', ad: 'Ön Yükleyici' },
  { id: 'toprak', ad: 'Toprak İşleme' },
  { id: 'diger', ad: 'Diğer Ekipmanlar' },
];

const URUNLER = [
  {
    id: 'tarim-romorku',
    kategori: 'romork',
    ad: 'Tarım Römorku',
    etiket: 'Size özel boya ve yazı',
    kisa: 'Göksun atölyemizde yapılan tarım römorku. Rengini ve kasaya yazılacak adı siz seçin.',
    aciklama: 'Göksun atölyemizde yaptığımız tarım römorku. Kasanın rengini ve üzerine yazılacak isim ya da firma adını birlikte belirliyoruz. Mavi, yeşil ve farklı renklerde teslim ettiğimiz örnekleri fotoğraflarda görebilirsiniz.',
    oneCikanlar: ['Kasa rengi isteğe göre', 'Kasaya isim / firma adı yazısı', 'Yan kapaklarda kilitli mandallar', 'Arka stop lambası ve reflektörler'],
    teknik: { 'Taşıma kapasitesi': null, 'Kasa ölçüleri': null, 'Dingil sayısı': null, 'Damper seçeneği': null },
    foto: ['damperli-romork-mavi', 'damperli-romork-yesil', 'damperli-romork-yesil-musteri', 'damperli-romork-new-holland', 'damperli-romork-teslimat'],
  },
  {
    id: 'su-tankeri',
    kategori: 'romork',
    ad: 'Su Tankeri Römorku',
    etiket: '2026 model',
    kisa: 'Traktörle çekilen su tankeri. Hayvancılıkta, bahçede ve tarlada su taşımak için.',
    aciklama: 'Traktörle çekilen, çeki oklu şasi üzerine oturtulmuş su tankeri. Hayvan sulama, bahçe ve tarla işleri için su taşımada kullanılır.',
    oneCikanlar: ['Çeki oklu şasi', 'Park ayağı', 'Oval gövdeli tank'],
    teknik: { 'Tank hacmi': null, 'Tank malzemesi': null, 'Dingil sayısı': null },
    foto: ['su-tankeri'],
  },
  {
    id: 'on-yukleyici',
    kategori: 'yukleyici',
    ad: 'Traktör Ön Yükleyici (Kepçe)',
    etiket: 'Farklı traktör markalarına',
    kisa: 'Traktörünüze takılan hidrolik kepçe. Yükleme, taşıma ve tesviye işleri için.',
    aciklama: 'Traktörün önüne takılan hidrolik ön yükleyici. New Holland ve Kubota gibi farklı marka traktörlere montaj yaptığımız örnekler fotoğraflarda. Traktörünüzün marka ve modelini söyleyin, uygunluğunu konuşalım.',
    oneCikanlar: ['Hidrolik silindirle kaldırma ve boşaltma', 'Farklı marka traktörlere montaj', 'Kırmızı ve mavi renk örnekleri'],
    teknik: { 'Kaldırma kapasitesi': null, 'Kepçe genişliği': null, 'Uygun traktör modelleri': null },
    foto: ['on-yukleyici-kirmizi', 'on-yukleyici-kubota', 'on-yukleyici-kaldirma', 'on-yukleyici-saha', 'on-yukleyici-mavi', 'pulluk-loader-gece'],
  },
  {
    id: 'kultivator',
    kategori: 'toprak',
    ad: 'Göksun Yaylı Kültivatör',
    etiket: 'Kırmızı · Mavi',
    kisa: 'Yaylı ayaklı kültivatör. Toprağı kabartmak ve ot temizliği için.',
    aciklama: 'Yaylı ayaklı Göksun model kültivatör. Kırmızı ve mavi renk seçenekleri fotoğraflarda.',
    oneCikanlar: ['Yaylı ayaklar', 'Kırmızı ve mavi renk', 'Traktör üç nokta askısına bağlanır'],
    teknik: { 'Ayak sayısı': null, 'İş genişliği': null, 'Gereken traktör gücü': null },
    foto: ['kultivator-kirmizi', 'kultivator-mavi'],
  },
  {
    id: 'pulluk',
    kategori: 'toprak',
    ad: 'Kulaklı Pulluk',
    etiket: 'Toprak işleme',
    kisa: 'Toprağı devirerek süren kulaklı pulluk.',
    aciklama: 'Toprağı devirerek süren kulaklı pulluk. Fotoğraftaki model dört gövdelidir.',
    oneCikanlar: ['Fotoğraftaki model: 4 gövdeli', 'Traktör üç nokta askısına bağlanır'],
    teknik: { 'Gövde sayısı seçenekleri': null, 'İş genişliği': null, 'Gereken traktör gücü': null },
    foto: ['pulluk'],
  },
  {
    id: 'tesviye',
    kategori: 'toprak',
    ad: 'Tesviye Küreği',
    etiket: 'Toprak düzeltme',
    kisa: 'Traktör arkasına takılan geniş bıçaklı kürek.',
    aciklama: 'Traktörün arkasına takılan, geniş bıçaklı kürek.',
    oneCikanlar: ['Geniş bıçak', 'Traktör üç nokta askısına bağlanır'],
    teknik: { 'Bıçak genişliği': null, 'Açı ayarı': null },
    foto: ['tesviye-kuregi'],
  },
  {
    id: 'tirmik',
    kategori: 'diger',
    ad: 'Döner Ot Tırmığı',
    etiket: 'Ot toplama',
    kisa: 'Biçilmiş otu sıraya toplamak için döner tırmık.',
    aciklama: 'Biçilmiş otu sıraya toplamak için kullanılan döner tırmık.',
    oneCikanlar: ['Tekerlekli şasi', 'Döner kollu yapı'],
    teknik: { 'İş genişliği': null, 'Kol sayısı': null },
    foto: ['tirmik', 'tirmik-sevkiyat'],
  },
  {
    id: 'gubre-serpme',
    kategori: 'diger',
    ad: 'Gübre Serpme Makinesi',
    etiket: 'Gübreleme',
    kisa: 'Traktöre takılan gübre serpme makinesi.',
    aciklama: 'Traktöre takılan gübre serpme makinesi.',
    oneCikanlar: ['Traktörle kullanılır'],
    teknik: { 'Depo hacmi': null, 'Serpme genişliği': null },
    foto: ['romork-gubre-serpme'],
  },
];

const BILGILER = [
  {
    id: 'ozel', ikon: 'i-tool', ad: 'Size Özel İmalat', alt: 'Renk ve yazı sizden',
    govde: '<p>Römorkunuzun rengini ve kasaya yazılacak adı birlikte belirliyoruz. Ölçü ve kapasite ihtiyacınızı telefonda konuşalım.</p>',
  },
  {
    id: 'siparis', ikon: 'i-list', ad: 'Sipariş Nasıl Verilir?', alt: '3 kolay adım',
    govde: '<ol class="is-steps"><li><b>Bize ulaşın.</b> Arayın ya da WhatsApp\'tan yazın.</li><li><b>İhtiyacınızı anlatın.</b> Traktörünüzün markasını ve ne iş yapacağınızı söyleyin.</li><li><b>Birlikte netleştirelim.</b> Renk, yazı, fiyat ve teslim tarihini birlikte belirleyelim.</li></ol>',
  },
  {
    id: 'teslimat', ikon: 'i-truck', ad: 'Teslimat', alt: 'Nakliye bilgisi',
    govde: '<p>Teslim şekli ve nakliye hakkında güncel bilgi için bizi arayın.</p>',
  },
  {
    id: 'garanti', ikon: 'i-shield', ad: 'Garanti & Servis', alt: 'Yedek parça',
    govde: '<p>Garanti, servis ve yedek parça hakkında güncel bilgi için bizi arayın.</p>',
  },
  {
    id: 'odeme', ikon: 'i-card', ad: 'Ödeme Seçenekleri', alt: 'Fiyat ve ödeme',
    govde: '<p>Fiyat ve ödeme seçenekleri hakkında güncel bilgi için bizi arayın.</p>',
  },
  {
    id: 'konum', ikon: 'i-pin', ad: 'Konum', alt: 'Göksun / Kahramanmaraş',
    govde: '<p>Göksun / Kahramanmaraş. Yol tarifi için aşağıdaki butona dokunun ya da bizi arayın.</p><p><a class="btn btn-primary btn-lg js-map" href="#" target="_blank" rel="noopener">Haritada Aç</a></p>',
  },
];

/* ---------- yardımcılar ---------- */
const $ = (s, el = document) => el.querySelector(s);
const img = (ad) => `img/${ad}.webp`;
const waLink = (msg) => `https://wa.me/${FIRMA.wa}?text=${encodeURIComponent(msg)}`;
const urunMesaji = (u) => `Merhaba, e-katalogdaki "${u.ad}" için fiyat ve bilgi almak istiyorum.`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function baglantilariKur(kok = document) {
  kok.querySelectorAll('.js-tel').forEach((a) => { a.href = `tel:${FIRMA.tel}`; });
  kok.querySelectorAll('.js-map').forEach((a) => { a.href = FIRMA.harita; });
  kok.querySelectorAll('.js-wa').forEach((a) => {
    a.href = waLink(a.dataset.msg || 'Merhaba, bilgi almak istiyorum.');
  });
}

/* ---------- bilgi butonları ---------- */
function bilgileriCiz() {
  $('#infoGrid').innerHTML = BILGILER.map((b) => `
    <button class="info-btn" type="button" data-info="${b.id}">
      <span class="info-ic"><svg class="i"><use href="#${b.ikon}"/></svg></span>
      <span class="info-tx"><b>${esc(b.ad)}</b><small>${esc(b.alt)}</small></span>
    </button>`).join('');
  $('#infoGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-info]');
    if (btn) bilgiAc(btn.dataset.info);
  });
}

function bilgiAc(id) {
  const b = BILGILER.find((x) => x.id === id);
  if (!b) return;
  $('#isIcon').innerHTML = `<svg class="i"><use href="#${b.ikon}"/></svg>`;
  $('#isTitle').textContent = b.ad;
  $('#isBody').innerHTML = b.govde;
  $('#isWa').href = waLink(`Merhaba, "${b.ad}" hakkında bilgi almak istiyorum.`);
  baglantilariKur($('#infoSheet'));
  pencereAc($('#infoSheet'));
}

/* ---------- kategoriler ve ürünler ---------- */
let aktifKategori = 'hepsi';

function kategorileriCiz() {
  $('#catBar').innerHTML = KATEGORILER.map((k) => {
    const adet = k.id === 'hepsi' ? URUNLER.length : URUNLER.filter((u) => u.kategori === k.id).length;
    return `<button class="cat" type="button" role="tab" data-cat="${k.id}" aria-selected="${k.id === aktifKategori}">${esc(k.ad)} <span>${adet}</span></button>`;
  }).join('');
  $('#catBar').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    aktifKategori = btn.dataset.cat;
    $('#catBar').querySelectorAll('.cat').forEach((c) => c.setAttribute('aria-selected', c === btn));
    btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    urunleriCiz();
    const hedef = $('#katalog').getBoundingClientRect().top + window.scrollY - $('.topbar').offsetHeight;
    if (window.scrollY > hedef) window.scrollTo({ top: hedef, behavior: 'smooth' });
  });
}

function urunleriCiz() {
  const liste = aktifKategori === 'hepsi' ? URUNLER : URUNLER.filter((u) => u.kategori === aktifKategori);
  $('#productGrid').innerHTML = liste.map((u) => {
    const kat = KATEGORILER.find((k) => k.id === u.kategori).ad;
    return `
    <article class="card">
      <button class="card-media" type="button" data-detay="${u.id}" aria-label="${esc(u.ad)} detay">
        <img src="${img(u.foto[0])}" alt="${esc(u.ad)}" loading="lazy">
        <span class="card-tag">${esc(u.etiket)}</span>
        ${u.foto.length > 1 ? `<span class="card-count">${u.foto.length} foto</span>` : ''}
      </button>
      <div class="card-body">
        <p class="card-cat">${esc(kat)}</p>
        <h3>${esc(u.ad)}</h3>
        <p class="card-desc">${esc(u.kisa)}</p>
        <div class="card-actions">
          <button class="btn btn-ghost" type="button" data-detay="${u.id}">Detay</button>
          <a class="btn btn-wa" href="${waLink(urunMesaji(u))}" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg>Fiyat Sor</a>
          <a class="btn btn-icon" href="tel:${FIRMA.tel}" aria-label="${esc(u.ad)} için ara"><svg class="i"><use href="#i-tel"/></svg></a>
        </div>
      </div>
    </article>`;
  }).join('');
}

/* ---------- ürün detay penceresi ---------- */
let aktifUrun = null;
let aktifFoto = 0;

function fotoGoster(i) {
  const n = aktifUrun.foto.length;
  aktifFoto = (i + n) % n;
  $('#psImg').src = img(aktifUrun.foto[aktifFoto]);
  $('#psImg').alt = `${aktifUrun.ad} — fotoğraf ${aktifFoto + 1}`;
  $('#psCount').textContent = `${aktifFoto + 1} / ${n}`;
  $('#psThumbs').querySelectorAll('button').forEach((b, j) => b.setAttribute('aria-current', j === aktifFoto));
}

function urunAc(id) {
  aktifUrun = URUNLER.find((u) => u.id === id);
  if (!aktifUrun) return;
  const u = aktifUrun;
  const tek = u.foto.length < 2;
  $('#productSheet').classList.toggle('single', tek);
  $('#psCat').textContent = KATEGORILER.find((k) => k.id === u.kategori).ad;
  $('#psTitle').textContent = u.ad;
  $('#psDesc').textContent = u.aciklama;
  $('#psHighlights').innerHTML = u.oneCikanlar.map((o) => `<li>${esc(o)}</li>`).join('');
  $('#psSpecs').innerHTML = Object.entries(u.teknik).map(([k, v]) =>
    `<div><dt>${esc(k)}</dt><dd${v ? '' : ' class="ask"'}>${v ? esc(v) : 'Bilgi için arayın'}</dd></div>`).join('');
  $('#psThumbs').innerHTML = tek ? '' : u.foto.map((f, j) =>
    `<button type="button" data-foto="${j}" aria-label="Fotoğraf ${j + 1}"><img src="${img(f)}" alt="" loading="lazy"></button>`).join('');
  $('#psWa').href = waLink(urunMesaji(u));
  fotoGoster(0);
  pencereAc($('#productSheet'));
  history.replaceState(null, '', `#${u.id}`);
}

/* ---------- pencere yönetimi ---------- */
function pencereAc(d) {
  if (typeof d.showModal === 'function') d.showModal(); else d.setAttribute('open', '');
  document.body.classList.add('locked');
}
function pencereKapat(d) {
  if (typeof d.close === 'function') d.close(); else d.removeAttribute('open');
}

document.querySelectorAll('dialog.sheet').forEach((d) => {
  d.addEventListener('close', () => {
    document.body.classList.remove('locked');
    if (d.id === 'productSheet') history.replaceState(null, '', location.pathname + location.search);
  });
  d.addEventListener('click', (e) => {
    if (e.target === d || e.target.closest('[data-close]')) pencereKapat(d);
  });
});

document.addEventListener('click', (e) => {
  const d = e.target.closest('[data-detay]');
  if (d) urunAc(d.dataset.detay);
  const t = e.target.closest('[data-foto]');
  if (t) fotoGoster(Number(t.dataset.foto));
});
$('#psPrev').addEventListener('click', () => fotoGoster(aktifFoto - 1));
$('#psNext').addEventListener('click', () => fotoGoster(aktifFoto + 1));
document.addEventListener('keydown', (e) => {
  if (!$('#productSheet').open) return;
  if (e.key === 'ArrowLeft') fotoGoster(aktifFoto - 1);
  if (e.key === 'ArrowRight') fotoGoster(aktifFoto + 1);
});

// Parmakla kaydırarak fotoğraf değiştirme
let dokunX = null;
$('#psImg').addEventListener('touchstart', (e) => { dokunX = e.touches[0].clientX; }, { passive: true });
$('#psImg').addEventListener('touchend', (e) => {
  if (dokunX === null) return;
  const fark = e.changedTouches[0].clientX - dokunX;
  if (Math.abs(fark) > 40) fotoGoster(aktifFoto + (fark < 0 ? 1 : -1));
  dokunX = null;
});

/* ---------- başlat ---------- */
$('#yil').textContent = new Date().getFullYear();
bilgileriCiz();
kategorileriCiz();
urunleriCiz();
baglantilariKur();

// Bağlantıyla doğrudan bir ürün açılabilir: ucel-romork/#on-yukleyici
const hash = location.hash.slice(1);
if (URUNLER.some((u) => u.id === hash)) urunAc(hash);
