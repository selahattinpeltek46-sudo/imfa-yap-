/*
 * GÖKSUN YÖREM — ÜRÜN KATALOĞU, SEPET VE WHATSAPP SİPARİŞİ
 * Veriler js/ayarlar.js dosyasından okunur. Bu dosyada işletme bilgisi bulunmaz.
 *
 * Para: tüm hesaplar tamsayı kuruş ile yapılır.
 * Miktar: tamsayı "mili birim" ile tutulur (1,5 kg = 1500; 2 adet = 2000).
 * Sepet satırı = ürün + hazırlama tercihi; aynı ürünün farklı tercihleri ayrı satırdır.
 * Güvenlik: kullanıcı ve katalog metinleri DOM'a yalnızca textContent ile yazılır.
 */
(function () {
  'use strict';

  var G = window.GOKSUN;
  if (!G || !G.ayarlar || !Array.isArray(G.urunler)) {
    console.error('Göksun Yörem: js/ayarlar.js yüklenemedi; sepet devre dışı.');
    return;
  }

  var AYAR = G.ayarlar;
  var TESLIMAT = AYAR.teslimat || {};
  var DEPO_ANAHTARI = 'goksunYoremSepet:v2';
  var MAKS_MILI = 100000;   // bir satırda en fazla 100 birim
  var NOT_MAKS = 120;       // ürün hazırlama notu

  // ---------- Yardımcılar ----------
  var URUNLER = G.urunler.filter(function (u) { return u.aktif !== false && G.birimler[u.birim]; });
  var urunHaritasi = {};
  URUNLER.forEach(function (u) { urunHaritasi[u.id] = u; });

  function birimOf(urun) { return G.birimler[urun.birim]; }
  function secenekleri(urun) { return Array.isArray(urun.secenekler) ? urun.secenekler : []; }
  function stoktaYok(urun) { return urun.stok === false; }

  function tlToKurus(tl) {
    return (typeof tl === 'number' && isFinite(tl) && tl > 0) ? Math.round(tl * 100) : null;
  }

  var paraBicimi = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });
  function tl(kurus) { return paraBicimi.format(kurus / 100); }

  function miktarYazi(urun, mili) {
    return (mili / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 3 }) + ' ' + birimOf(urun).ad;
  }

  function satirTutari(urun, mili) {
    var k = tlToKurus(urun.fiyat);
    return k === null ? null : Math.round(k * mili / 1000);
  }

  function fiyatYazi(urun) {
    var k = tlToKurus(urun.fiyat);
    return k === null ? 'Fiyat sipariş teyidinde bildirilir' : tl(k) + ' ' + birimOf(urun).fiyatEki;
  }

  // İşletmenin teyit etmesi gerekenler (fiyat, stok, tartım)
  function teyitler(urun) {
    var t = [];
    if (tlToKurus(urun.fiyat) === null) t.push('fiyat');
    if (urun.stok !== true) t.push('stok');
    if (birimOf(urun).tartimli) t.push('kesin ağırlık');
    return t;
  }

  function temizTek(s, maks) {
    return String(s || '').replace(/[\u0000-\u001F\u007F]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maks);
  }
  function temizCok(s, maks) {
    return String(s || '').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000B-\u001F\u007F]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n').trim().slice(0, maks);
  }

  function whatsappHazir() { return /^\d{10,15}$/.test(String(AYAR.whatsappNumarasi || '')); }

  function izle(olay, parametre) {
    // Yalnızca kişisel veri içermeyen olaylar gönderilir.
    if (typeof window.gtag === 'function') window.gtag('event', olay, parametre || {});
  }

  function h(etiket, ozellikler, cocuklar) {
    var el = document.createElement(etiket);
    if (ozellikler) Object.keys(ozellikler).forEach(function (a) {
      var d = ozellikler[a];
      if (d === null || d === undefined || d === false) return;
      if (a === 'class') el.className = d;
      else if (a === 'text') el.textContent = d;
      else if (a === 'value') el.value = d;
      else if (a.indexOf('on') === 0) el.addEventListener(a.slice(2), d);
      else el.setAttribute(a, d === true ? '' : d);
    });
    (cocuklar || []).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }
  function ikon(sinif) { return h('i', { class: 'fa-solid ' + sinif, 'aria-hidden': 'true' }); }

  // Kısa geri bildirim (ekran okuyucu + görsel)
  var bildirimEl = document.getElementById('sepet-bildirim');
  var bildirimZamani = null;
  function bildir(metin) {
    if (!bildirimEl) return;
    bildirimEl.textContent = metin;
    bildirimEl.classList.add('gorunur');
    clearTimeout(bildirimZamani);
    bildirimZamani = setTimeout(function () { bildirimEl.classList.remove('gorunur'); }, 2200);
  }

  // ---------- Sepet durumu ----------
  // satırlar: [{ id, secenek, mili, not }]
  var sepet = [];

  function satirBul(id, secenek) {
    for (var i = 0; i < sepet.length; i++) if (sepet[i].id === id && sepet[i].secenek === (secenek || '')) return sepet[i];
    return null;
  }
  function satirAdi(urun, secenek) { return urun.ad + (secenek ? ' (' + secenek + ')' : ''); }

  function gecerliMiktar(urun, mili) {
    var b = birimOf(urun);
    if (typeof mili !== 'number' || !isFinite(mili)) return null;
    mili = Math.round(mili / b.adim) * b.adim;
    if (mili < b.min) return null;
    return Math.min(mili, MAKS_MILI);
  }

  function sepetiYukle() {
    sepet = [];
    try {
      var ham = JSON.parse(localStorage.getItem(DEPO_ANAHTARI) || '[]');
      if (!Array.isArray(ham)) return;
      ham.forEach(function (s) {
        if (!s || typeof s !== 'object') return;
        var urun = urunHaritasi[s.id];
        if (!urun || stoktaYok(urun)) return;
        var secenek = typeof s.secenek === 'string' && secenekleri(urun).indexOf(s.secenek) !== -1 ? s.secenek : '';
        if (secenekleri(urun).length && !secenek) secenek = secenekleri(urun)[0];
        var m = gecerliMiktar(urun, s.mili);
        if (m === null || satirBul(urun.id, secenek)) return;
        sepet.push({ id: urun.id, secenek: secenek, mili: m, not: temizTek(s.not, NOT_MAKS) });
      });
    } catch (e) { /* bozuk veya erişilemeyen depo: boş sepetle devam */ }
  }

  function sepetiKaydet() {
    try { localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(sepet)); } catch (e) { /* gizli sekme vb. */ }
  }

  function ekle(id, secenek) {
    var urun = urunHaritasi[id]; if (!urun || stoktaYok(urun)) return;
    var b = birimOf(urun);
    var s = satirBul(id, secenek);
    if (s) s.mili = Math.min(s.mili + b.adim, MAKS_MILI);
    else { s = { id: id, secenek: secenek || '', mili: b.min, not: '' }; sepet.push(s); izle('add_to_cart', { urun: id }); }
    degisti();
    bildir(satirAdi(urun, s.secenek) + ': sepette ' + miktarYazi(urun, s.mili));
  }

  function azalt(id, secenek) {
    var urun = urunHaritasi[id]; var s = satirBul(id, secenek);
    if (!urun || !s) return;
    var yeni = s.mili - birimOf(urun).adim;
    if (yeni < birimOf(urun).min) { sil(id, secenek); return; }
    s.mili = yeni;
    degisti();
    bildir(satirAdi(urun, s.secenek) + ': ' + miktarYazi(urun, s.mili));
  }

  function sil(id, secenek) {
    var urun = urunHaritasi[id];
    sepet = sepet.filter(function (s) { return !(s.id === id && s.secenek === (secenek || '')); });
    degisti();
    if (urun) bildir(satirAdi(urun, secenek) + ' sepetten çıkarıldı.');
  }

  function bosalt() { sepet = []; degisti(); }

  // ---------- Hesaplama ----------
  function teslimatTercihi() {
    var r = document.querySelector('input[name="teslimat"]:checked');
    return r ? r.value : null;
  }

  function ucretKurusu() { return TESLIMAT.ucret === 0 ? 0 : tlToKurus(TESLIMAT.ucret); }

  function hesapla() {
    var satirlar = [];
    var araToplam = 0, fiyatliVar = false, fiyatsizVar = false, tartimliVar = false;
    sepet.forEach(function (s) {
      var urun = urunHaritasi[s.id]; if (!urun) return;
      var tutar = satirTutari(urun, s.mili);
      if (tutar === null) fiyatsizVar = true; else { araToplam += tutar; fiyatliVar = true; }
      if (birimOf(urun).tartimli) tartimliVar = true;
      satirlar.push({ urun: urun, secenek: s.secenek, mili: s.mili, not: s.not, tutar: tutar, teyit: teyitler(urun) });
    });

    var tercih = teslimatTercihi();
    var teslimatUcreti = tercih === 'adres' ? ucretKurusu() : 0; // null = işletme bildirecek

    return {
      satirlar: satirlar,
      kalem: satirlar.length,
      araToplam: araToplam,
      fiyatliVar: fiyatliVar,
      fiyatsizVar: fiyatsizVar,
      tartimliVar: tartimliVar,
      tercih: tercih,
      teslimatUcreti: teslimatUcreti,
      // Fiyatı bilinmeyen ürün varsa genel toplam gösterilmez (yanıltıcı olur).
      tahminiToplam: fiyatliVar && !fiyatsizVar ? araToplam + (teslimatUcreti || 0) : null,
      ucretBelirsiz: tercih === 'adres' && teslimatUcreti === null
    };
  }

  // ---------- Katalog ----------
  var katalogEl = document.getElementById('katalog');
  var filtreEl = document.getElementById('kategori-nav');
  var secilenKategori = 'tumu';
  var kartDurumu = {}; // urunId -> { secenek, kutu }

  function kategoriUrunleri(katId) {
    return katId === 'tumu' ? URUNLER : URUNLER.filter(function (u) { return (u.kategoriler || []).indexOf(katId) !== -1; });
  }

  function filtreCiz() {
    if (!filtreEl) return;
    filtreEl.textContent = '';
    var liste = [{ id: 'tumu', ad: 'Tümü', ikon: 'fa-border-all' }].concat(G.kategoriler.filter(function (k) {
      return kategoriUrunleri(k.id).length || k.bosMesaj;
    }));
    liste.forEach(function (k) {
      var secili = k.id === secilenKategori;
      filtreEl.appendChild(h('li', null, [
        h('button', {
          type: 'button', 'aria-pressed': secili ? 'true' : 'false', 'data-kategori': k.id,
          class: 'inline-flex items-center gap-2 whitespace-nowrap border-2 font-semibold text-sm px-4 min-h-[44px] rounded-full transition ' +
            (secili ? 'bg-bordo border-bordo text-white' : 'bg-white border-krem-dark text-komur hover:border-bordo hover:text-bordo'),
          onclick: function () {
            secilenKategori = k.id;
            filtreCiz(); katalogCiz();
            var hedef = filtreEl.querySelector('[data-kategori="' + k.id + '"]');
            if (hedef) { hedef.focus(); hedef.scrollIntoView({ block: 'nearest', inline: 'center' }); }
          }
        }, [ikon(k.ikon + (secili ? '' : ' text-bordo')), k.ad])
      ]));
    });
  }

  function aksiyonCiz(urun) {
    var d = kartDurumu[urun.id];
    if (!d || !d.kutu || !d.kutu.isConnected) return;
    var kutu = d.kutu;
    kutu.textContent = '';
    if (stoktaYok(urun)) {
      kutu.appendChild(h('p', { class: 'text-sm font-semibold text-komur/70 bg-krem-dark rounded-full text-center py-3', text: 'Şu an mevcut değil' }));
      return;
    }
    var s = satirBul(urun.id, d.secenek);
    if (!s) {
      kutu.appendChild(h('button', {
        type: 'button', 'data-odak': urun.id + '-ekle-kart',
        class: 'w-full inline-flex items-center justify-center gap-2 bg-bordo hover:bg-bordo-light text-white font-heading font-bold text-base min-h-[48px] px-4 rounded-full transition',
        'aria-label': satirAdi(urun, d.secenek) + ' sepete ekle',
        onclick: function () { ekle(urun.id, d.secenek); odakla(urun.id + (d.secenek ? '-' + secenekleri(urun).indexOf(d.secenek) : ''), 'arti', 'kart', urun.id); }
      }, [ikon('fa-cart-plus'), 'Sepete ekle']));
      return;
    }
    kutu.appendChild(miktarKontrolu(urun, s, 'kart'));
  }

  function miktarKontrolu(urun, s, yer) {
    var b = birimOf(urun);
    var minde = s.mili <= b.min;
    var ad = satirAdi(urun, s.secenek);
    var anahtarEki = s.secenek ? '-' + secenekleri(urun).indexOf(s.secenek) : '';
    return h('div', { class: 'flex items-center justify-between gap-2 bg-white border-2 border-bordo/30 rounded-full p-1', role: 'group', 'aria-label': ad + ' miktarı' }, [
      h('button', {
        type: 'button', 'data-odak': urun.id + anahtarEki + '-eksi-' + yer,
        class: 'w-11 h-11 shrink-0 rounded-full bg-krem-dark hover:bg-bordo hover:text-white text-bordo flex items-center justify-center transition',
        'aria-label': minde ? ad + ' sepetten çıkar' : ad + ' miktarını azalt',
        onclick: function () { azalt(urun.id, s.secenek); odakla(urun.id + anahtarEki, satirBul(urun.id, s.secenek) ? 'eksi' : 'ekle', yer, urun.id); }
      }, [ikon(minde ? 'fa-trash-can' : 'fa-minus')]),
      h('span', { class: 'font-heading font-bold text-base tabular-nums text-center flex-1', text: miktarYazi(urun, s.mili) }),
      h('button', {
        type: 'button', 'data-odak': urun.id + anahtarEki + '-arti-' + yer,
        class: 'w-11 h-11 shrink-0 rounded-full bg-bordo hover:bg-bordo-light text-white flex items-center justify-center transition disabled:opacity-40',
        'aria-label': ad + ' miktarını artır', disabled: s.mili >= MAKS_MILI,
        onclick: function () { ekle(urun.id, s.secenek); odakla(urun.id + anahtarEki, 'arti', yer, urun.id); }
      }, [ikon('fa-plus')])
    ]);
  }

  // Yeniden çizim sonrası klavye odağını aynı kontrolde tut.
  function odakla(odakId, ne, yer, urunId) {
    requestAnimationFrame(function () {
      var el = document.querySelector('[data-odak="' + odakId + '-' + ne + '-' + yer + '"]');
      if (!el && yer === 'kart') {
        var d = kartDurumu[urunId || odakId];
        el = d && d.kutu && d.kutu.querySelector('button');
      }
      if (el) el.focus();
    });
  }

  function rozet(metin, sinif) { return h('span', { class: 'inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ' + sinif, text: metin }); }

  function teyitRozeti(urun) {
    if (stoktaYok(urun)) return rozet('Şu an yok', 'bg-red-100 text-red-800');
    var t = teyitler(urun);
    var stok = t.indexOf('stok') !== -1, fiyat = t.indexOf('fiyat') !== -1;
    if (stok && fiyat) return rozet('Stok ve fiyat teyitte', 'bg-yellow-100 text-yellow-900');
    if (stok) return rozet('Stok teyitte', 'bg-yellow-100 text-yellow-900');
    if (fiyat) return rozet('Fiyat teyitte', 'bg-yellow-100 text-yellow-900');
    return rozet('Stokta', 'bg-green-100 text-green-900');
  }

  function kartCiz(urun) {
    var b = birimOf(urun);
    var d = kartDurumu[urun.id] || (kartDurumu[urun.id] = { secenek: secenekleri(urun)[0] || '' });
    d.kutu = h('div', { class: 'mt-3' });

    var ilkKat = G.kategoriler.filter(function (k) { return (urun.kategoriler || []).indexOf(k.id) !== -1; })[0] || {};
    // Fotoğraf yoksa kompakt şerit (boş büyük kutu yerine); stok/temsili fotoğraf kullanılmaz.
    var gorselKutu = h('div', { class: 'relative overflow-hidden flex items-center justify-center ' +
      (urun.gorsel ? 'aspect-[4/3] bg-krem-dark text-bordo/40' : 'h-16 bg-krem text-bordo/50') }, [
      ikon((ilkKat.ikon || 'fa-utensils') + (urun.gorsel ? ' text-5xl' : ' text-2xl'))
    ]);
    if (urun.gorsel) {
      gorselKutu.appendChild(h('img', {
        src: urun.gorsel, alt: urun.gorselAciklama || urun.ad, loading: 'lazy', width: '600', height: '450',
        class: 'absolute inset-0 w-full h-full object-cover', onerror: function () { this.remove(); }
      }));
      gorselKutu.appendChild(h('span', { class: 'absolute bottom-2 left-2 bg-komur/75 text-white text-xs font-semibold px-2.5 py-1 rounded-full' }, [ikon('fa-camera mr-1'), 'Dükkânımızdan']));
    }

    var secimEl = null;
    if (secenekleri(urun).length) {
      var secimId = 'secim-' + urun.id;
      secimEl = h('div', { class: 'mt-3' }, [
        h('label', { for: secimId, class: 'block text-sm font-semibold text-komur/80 mb-1', text: 'Hazırlama tercihi' }),
        h('select', {
          id: secimId, class: 'w-full bg-white border-2 border-krem-dark rounded-xl px-3 min-h-[44px] focus:outline-none focus:border-bordo',
          onchange: function () { d.secenek = this.value; aksiyonCiz(urun); }
        }, secenekleri(urun).map(function (sc) { return h('option', { value: sc, text: sc, selected: sc === d.secenek }); }))
      ]);
    }

    return h('li', { class: 'bg-white rounded-2xl shadow-card border border-krem-dark overflow-hidden flex flex-col' }, [
      gorselKutu,
      h('div', { class: 'p-4 flex-1 flex flex-col' }, [
        h('h3', { class: 'font-heading font-bold text-lg leading-snug', text: urun.ad }),
        urun.aciklama ? h('p', { class: 'text-komur/75 text-sm mt-1 leading-relaxed', text: urun.aciklama }) : null,
        h('p', { class: 'mt-2 ' + (tlToKurus(urun.fiyat) === null ? 'text-sm text-komur/80' : 'font-heading font-bold text-bordo text-lg'), text: fiyatYazi(urun) }),
        h('div', { class: 'mt-2 flex flex-wrap gap-1.5' }, [
          rozet('Birim: ' + b.ad, 'bg-krem text-komur/80'),
          b.tartimli ? rozet('Tartımla kesinleşir', 'bg-krem text-komur/80') : null,
          teyitRozeti(urun)
        ]),
        h('div', { class: 'mt-auto' }, [secimEl, d.kutu])
      ])
    ]);
  }

  function katalogCiz() {
    if (!katalogEl) return;
    katalogEl.textContent = '';
    var urunler = kategoriUrunleri(secilenKategori);
    var kat = G.kategoriler.filter(function (k) { return k.id === secilenKategori; })[0];

    katalogEl.appendChild(h('p', { id: 'katalog-durum', class: 'text-sm text-komur/75 mb-4', 'aria-live': 'polite',
      text: (kat ? kat.ad : 'Tüm ürünler') + ' · ' + urunler.length + ' ürün' }));

    if (!urunler.length) {
      katalogEl.appendChild(h('div', { class: 'bg-krem rounded-2xl p-6 text-komur/85' }, [
        h('p', { class: 'font-heading font-bold', text: kat ? kat.ad : '' }),
        h('p', { class: 'mt-1', text: (kat && kat.bosMesaj) || 'Bu kategoride şu an listelenen ürün yok. İsteğinizi sipariş notuna yazabilirsiniz.' })
      ]));
      return;
    }
    var liste = h('ul', { class: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start' });
    urunler.forEach(function (u) { liste.appendChild(kartCiz(u)); });
    katalogEl.appendChild(liste);
    urunler.forEach(aksiyonCiz);
  }

  // ---------- Sepet görünümü ----------
  var listeEl = document.getElementById('sepet-liste');
  var bosEl = document.getElementById('sepet-bos');
  var ozetEl = document.getElementById('sepet-ozet');
  var gonderBtn = document.getElementById('siparis-devam');
  var barEl = document.getElementById('sepet-bar');

  function ozetSatiri(etiket, deger, vurgulu, aciklama) {
    return h('div', { class: 'flex items-start justify-between gap-4 py-2' + (vurgulu ? ' border-t border-krem-dark mt-1 pt-3' : '') }, [
      h('dt', { class: vurgulu ? 'font-heading font-extrabold text-lg' : 'text-komur/80' }, [etiket, aciklama ? h('span', { class: 'block text-xs font-normal font-body text-komur/65', text: aciklama }) : null]),
      h('dd', { class: 'text-right ' + (vurgulu ? 'font-heading font-extrabold text-lg text-bordo' : 'font-semibold'), text: deger })
    ]);
  }

  function sepetCiz() {
    var s = hesapla();

    document.querySelectorAll('[data-sepet-adet]').forEach(function (el) {
      el.textContent = String(s.kalem);
      el.hidden = s.kalem === 0;
    });
    document.querySelectorAll('[data-sepet-etiket]').forEach(function (el) {
      el.setAttribute('aria-label', 'Sepet: ' + (s.kalem ? s.kalem + ' ürün' : 'boş'));
    });
    document.body.classList.toggle('sepet-dolu', s.kalem > 0);

    if (barEl) {
      barEl.querySelector('[data-bar-adet]').textContent = s.kalem + ' ürün';
      barEl.querySelector('[data-bar-toplam]').textContent = s.tahminiToplam !== null ? '~' + tl(s.tahminiToplam) : 'Fiyat teyitte';
    }

    if (!listeEl) return;
    listeEl.textContent = '';
    bosEl.hidden = s.kalem > 0;
    ozetEl.hidden = s.kalem === 0;

    s.satirlar.forEach(function (sat, i) {
      var u = sat.urun;
      var satir = satirBul(u.id, sat.secenek);
      var notId = 'urun-notu-' + i;
      listeEl.appendChild(h('li', { class: 'py-4 border-b border-krem-dark last:border-0' }, [
        h('div', { class: 'flex items-start justify-between gap-3' }, [
          h('div', { class: 'min-w-0' }, [
            h('p', { class: 'font-heading font-bold leading-snug', text: u.ad }),
            sat.secenek ? h('p', { class: 'text-sm text-bordo font-semibold', text: sat.secenek }) : null,
            h('p', { class: 'text-sm text-komur/70 mt-0.5', text: fiyatYazi(u) })
          ]),
          h('button', {
            type: 'button', class: 'shrink-0 inline-flex items-center gap-1 text-sm text-komur/75 hover:text-bordo underline underline-offset-4 min-h-[44px] px-1',
            'aria-label': satirAdi(u, sat.secenek) + ' ürününü sepetten sil', onclick: function () { sil(u.id, sat.secenek); }
          }, [ikon('fa-xmark'), 'Sil'])
        ]),
        h('div', { class: 'mt-2 flex items-center justify-between gap-4' }, [
          h('div', { class: 'w-48 max-w-[62%]' }, [miktarKontrolu(u, satir, 'sepet')]),
          h('p', { class: 'font-heading font-bold text-right text-sm sm:text-base', text: sat.tutar === null ? 'Fiyat teyitte' : '~' + tl(sat.tutar) })
        ]),
        h('div', { class: 'mt-2' }, [
          h('label', { for: notId, class: 'sr-only', text: satirAdi(u, sat.secenek) + ' hazırlama notu' }),
          h('input', {
            id: notId, type: 'text', maxlength: String(NOT_MAKS), value: sat.not || '', 'data-urun-notu': '',
            placeholder: 'Hazırlama notu (isteğe bağlı): ör. ince kesilsin',
            class: 'w-full bg-krem/60 border border-krem-dark rounded-lg px-3 min-h-[44px] text-sm focus:outline-none focus:border-bordo',
            oninput: function () { satir.not = temizTek(this.value, NOT_MAKS); sepetiKaydet(); onizlemeyiKapat(); }
          })
        ])
      ]));
    });

    // Özet
    ozetEl.textContent = '';
    var dl = h('dl', { class: 'text-sm' });
    if (s.fiyatliVar) {
      dl.appendChild(ozetSatiri(s.fiyatsizVar ? 'Fiyatı belli ürünler' : 'Tahmini ara toplam', '~' + tl(s.araToplam), false,
        s.fiyatsizVar ? 'Fiyatı teyitte olan ürünler dahil değil' : null));
    }
    if (s.tercih === 'adres') {
      dl.appendChild(ozetSatiri('Teslimat ücreti', s.teslimatUcreti === null ? 'İşletme bildirecek' : (s.teslimatUcreti === 0 ? 'Ücretsiz' : tl(s.teslimatUcreti))));
    } else if (s.tercih === 'magaza') {
      dl.appendChild(ozetSatiri('Teslimat', 'Dükkândan teslim alma'));
    }
    dl.appendChild(ozetSatiri('Tahmini toplam',
      s.tahminiToplam !== null ? '~' + tl(s.tahminiToplam) + (s.ucretBelirsiz ? ' + teslimat' : '') : 'Teyitte bildirilecek', true));
    ozetEl.appendChild(dl);

    var notlar = [];
    if (s.tartimliVar) notlar.push('Kilo ile satılan ürünlerde kesin ağırlık ve tutar tartım sonrası belli olur.');
    if (s.fiyatsizVar) notlar.push('Fiyatı ve stoğu teyitte olan ürünler, işletme size dönüş yaptığında netleşir.');
    var minK = tlToKurus(TESLIMAT.minimumSiparis);
    if (minK !== null) notlar.push('Minimum sipariş tutarı: ' + tl(minK) + '.');
    notlar.push('Ödeme, sipariş teyidinden sonra teslimatta veya dükkânda yapılır. Online ödeme alınmaz.');
    ozetEl.appendChild(h('ul', { class: 'mt-3 space-y-1.5 text-xs text-komur/80' },
      notlar.map(function (n) { return h('li', { class: 'flex gap-2' }, [ikon('fa-circle-info text-orman mt-0.5'), n]); })));

    if (gonderBtn) gonderBtn.disabled = s.kalem === 0;
  }

  function degisti() {
    sepetiKaydet();
    URUNLER.forEach(aksiyonCiz);
    sepetCiz();
    onizlemeyiKapat();
  }

  // ---------- Sipariş formu ----------
  var form = document.getElementById('siparis-form');
  var onizlemeEl = document.getElementById('siparis-onizleme');
  var genelHataEl = document.getElementById('siparis-genel-hata');

  function alan(ad) { return form.elements[ad]; }

  function hataGoster(ad, mesaj) {
    var el = document.getElementById('hata-' + ad);
    if (el) { el.textContent = mesaj || ''; el.hidden = !mesaj; }
    form.querySelectorAll('[name="' + ad + '"]').forEach(function (g) {
      if (mesaj) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid');
    });
  }

  function telefonNormalize(ham) {
    var d = String(ham || '').replace(/\D/g, '');
    if (d.length === 12 && d.indexOf('90') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return /^[2-5]\d{9}$/.test(d) ? d : null;
  }
  function telefonYazi(d) {
    return '0 (' + d.slice(0, 3) + ') ' + d.slice(3, 6) + ' ' + d.slice(6, 8) + ' ' + d.slice(8);
  }

  function teslimatAlanlariniGuncelle() {
    var adres = teslimatTercihi() === 'adres';
    var kutu = document.getElementById('adres-alanlari');
    if (kutu) {
      kutu.hidden = !adres;
      kutu.querySelectorAll('input, select, textarea').forEach(function (g) { g.disabled = !adres; });
    }
    if (!adres) { hataGoster('bolge', ''); hataGoster('adres', ''); }
  }

  function dogrula() {
    var hatalar = [];
    var veri = {
      ad: temizTek(alan('ad').value, 60),
      telefon: telefonNormalize(alan('telefon').value),
      tercih: teslimatTercihi(),
      bolge: alan('bolge') ? temizTek(alan('bolge').value, 80) : '',
      adres: alan('adres') ? temizCok(alan('adres').value, 300) : '',
      not: temizCok(alan('not').value, 500)
    };
    function kontrol(ad, kosul, mesaj) {
      hataGoster(ad, kosul ? '' : mesaj);
      if (!kosul) hatalar.push(ad);
    }
    kontrol('ad', veri.ad.length >= 3, 'Lütfen adınızı ve soyadınızı yazın.');
    kontrol('telefon', !!veri.telefon, alan('telefon').value.trim()
      ? 'Telefon numarası geçersiz. Örnek: 0532 123 45 67'
      : 'Lütfen telefon numaranızı yazın.');
    kontrol('teslimat', !!veri.tercih, 'Lütfen bir teslimat tercihi seçin.');
    if (veri.tercih === 'adres') {
      kontrol('bolge', veri.bolge.length >= 2, 'Lütfen mahalle veya köyünüzü belirtin.');
      kontrol('adres', veri.adres.length >= 10, 'Lütfen açık adresinizi yazın (sokak, no, tarif).');
    }
    return { gecerli: hatalar.length === 0, hatalar: hatalar, veri: veri };
  }

  function ikiHane(n) { return (n < 10 ? '0' : '') + n; }
  function referansOlustur(t) {
    var r = new Uint16Array(1);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(r); else r[0] = Math.floor(Math.random() * 65535);
    return (AYAR.siparisReferansOnEki || 'GY') + '-' + String(t.getFullYear()).slice(2) + ikiHane(t.getMonth() + 1) + ikiHane(t.getDate()) +
      '-' + ('000' + (r[0] % 10000)).slice(-4);
  }

  function mesajOlustur(s, v, ref, zaman) {
    var m = [];
    m.push('*' + AYAR.isletmeAdi + '*');
    m.push('*Web Sitesi Sipariş Talebi*');
    m.push('Ref: ' + ref + ' · ' + zaman.toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }));
    m.push('');
    m.push('*Müşteri:* ' + v.ad);
    m.push('*Telefon:* ' + telefonYazi(v.telefon));
    m.push('');
    m.push('*Ürünler*');
    s.satirlar.forEach(function (sat, i) {
      var u = sat.urun, k = tlToKurus(u.fiyat);
      var satir = (i + 1) + ') ' + u.ad + (sat.secenek ? ' – ' + sat.secenek : '') + ': ' + miktarYazi(u, sat.mili);
      if (k !== null) satir += ' × ' + tl(k) + birimOf(u).fiyatEki + ' ≈ ' + tl(sat.tutar);
      m.push(satir);
      if (sat.not) m.push('   Hazırlama notu: ' + sat.not);
      if (sat.teyit.length) m.push('   [Teyit gerekli: ' + sat.teyit.join(', ') + ']');
    });
    m.push('');
    if (s.fiyatliVar) m.push('Tahmini ara toplam: ~' + tl(s.araToplam) + (s.fiyatsizVar ? ' (fiyatı teyitte olan ürünler hariç)' : ''));
    else m.push('Tutar: fiyatlar işletme teyidinde bildirilecek');
    if (s.tercih === 'adres') {
      m.push('Teslimat ücreti: ' + (s.teslimatUcreti === null ? 'işletme bildirecek' : (s.teslimatUcreti === 0 ? 'ücretsiz' : tl(s.teslimatUcreti))));
    }
    m.push('');
    m.push('*Teslimat:* ' + (v.tercih === 'adres' ? 'Adrese teslimat' : 'Dükkândan teslim alma'));
    if (v.tercih === 'adres') {
      m.push('*Mahalle/Köy:* ' + v.bolge);
      m.push('*Adres:* ' + v.adres);
    }
    m.push('*Ödeme:* ' + (v.tercih === 'adres' ? AYAR.odeme.adreseTeslimat : AYAR.odeme.teslimAlma) + ' (teyitten sonra)');
    if (v.not) m.push('*Sipariş notu:* ' + v.not);
    m.push('');
    m.push('Stok, kesin ağırlık, tutar ve teslimat zamanını teyit etmenizi rica ederim. Sipariş, sizin teyidinizle kesinleşir.');
    return m.join('\n');
  }

  function waLinki(metin) {
    return 'https://wa.me/' + AYAR.whatsappNumarasi + '?text=' + encodeURIComponent(metin);
  }

  function onizlemeyiKapat() {
    if (onizlemeEl && !onizlemeEl.hidden) onizlemeEl.hidden = true;
  }

  function genelHata(mesaj) {
    if (!genelHataEl) return;
    genelHataEl.textContent = mesaj || '';
    genelHataEl.hidden = !mesaj;
  }

  function gonder(e) {
    e.preventDefault();
    genelHata('');
    var s = hesapla();
    if (s.kalem === 0) {
      genelHata('Sepetiniz boş. Lütfen önce ürün ekleyin.');
      return;
    }
    var d = dogrula();
    if (!d.gecerli) {
      genelHata('Lütfen işaretli alanları kontrol edin.');
      var ilk = form.querySelector('[name="' + d.hatalar[0] + '"]');
      if (ilk) ilk.focus();
      return;
    }
    var minK = tlToKurus(TESLIMAT.minimumSiparis);
    if (minK !== null && !s.fiyatsizVar && s.araToplam < minK) {
      genelHata('Minimum sipariş tutarı ' + tl(minK) + '. Sepetinize ürün ekleyebilirsiniz.');
      return;
    }

    var zaman = new Date();
    var ref = referansOlustur(zaman);
    var metin = mesajOlustur(s, d.veri, ref, zaman);
    document.getElementById('onizleme-metin').textContent = metin;
    document.getElementById('onizleme-ref').textContent = ref;
    var link = document.getElementById('onizleme-whatsapp');
    var uyari = document.getElementById('onizleme-numara-uyari');
    if (whatsappHazir()) {
      link.href = waLinki(metin);
      link.removeAttribute('aria-disabled');
      link.classList.remove('pointer-events-none', 'opacity-50');
      uyari.hidden = true;
    } else {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      link.classList.add('pointer-events-none', 'opacity-50');
      uyari.hidden = false;
      console.warn('Göksun Yörem: WhatsApp numarası js/ayarlar.js içinde tanımlanmamış.');
    }
    document.getElementById('onizleme-acildi').hidden = true;
    onizlemeEl.hidden = false;
    izle('begin_checkout', { kalem: s.kalem, teslimat: d.veri.tercih });
    onizlemeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('onizleme-baslik').focus({ preventScroll: true });
  }

  function formuKur() {
    if (!form) return;

    var secenekler = [];
    if (TESLIMAT.adreseTeslimat) secenekler.push({ deger: 'adres', ad: 'Adrese teslimat', alt: 'Göksun içi adresinize getirelim', ikon: 'fa-truck-fast' });
    if (TESLIMAT.teslimAlma) secenekler.push({ deger: 'magaza', ad: 'Dükkândan teslim alma', alt: 'Hazır olunca dükkândan alın', ikon: 'fa-store' });
    var secKutu = document.getElementById('teslimat-secenekleri');
    secenekler.forEach(function (sc, i) {
      secKutu.appendChild(h('label', { class: 'teslimat-secenek flex items-start gap-3 bg-white border-2 border-krem-dark rounded-xl p-4 cursor-pointer hover:border-bordo/50 transition' }, [
        h('input', { type: 'radio', name: 'teslimat', value: sc.deger, class: 'mt-1 w-5 h-5 shrink-0 accent-[#8B0000]', 'aria-describedby': 'hata-teslimat', checked: secenekler.length === 1 && i === 0 }),
        h('span', null, [
          h('span', { class: 'font-heading font-bold flex items-center gap-2' }, [ikon(sc.ikon + ' text-bordo'), sc.ad]),
          h('span', { class: 'block text-sm text-komur/75', text: sc.alt })
        ])
      ]));
    });

    var bolgeKutu = document.getElementById('bolge-kutu');
    var bolgeler = Array.isArray(TESLIMAT.bolgeler) ? TESLIMAT.bolgeler : [];
    var girdiSinif = 'w-full bg-white border-2 border-krem-dark rounded-xl px-4 min-h-[48px] focus:outline-none focus:border-bordo transition';
    if (bolgeler.length) {
      bolgeKutu.appendChild(h('select', { id: 'bolge', name: 'bolge', class: girdiSinif, required: true, 'aria-describedby': 'hata-bolge' },
        [h('option', { value: '', text: 'Seçiniz' })].concat(bolgeler.map(function (b) { return h('option', { value: b, text: b }); }))));
    } else {
      bolgeKutu.appendChild(h('input', { id: 'bolge', name: 'bolge', type: 'text', class: girdiSinif, required: true, maxlength: '80', autocomplete: 'address-level3', placeholder: 'Örn: Merkez, Yeşilköy…', 'aria-describedby': 'hata-bolge' }));
    }

    var bilgi = [];
    if (TESLIMAT.saatler) bilgi.push('Teslimat saatleri: ' + TESLIMAT.saatler);
    var ucretK = ucretKurusu();
    bilgi.push('Teslimat ücreti: ' + (ucretK === null ? 'sipariş teyidinde bildirilir' : (ucretK === 0 ? 'ücretsiz' : tl(ucretK))));
    if (bolgeler.length) bilgi.push('Hizmet bölgeleri: ' + bolgeler.join(', '));
    else bilgi.push('Teslimat yapılabilecek bölgeler ve saat sipariş teyidinde netleştirilir.');
    var bilgiEl = document.getElementById('teslimat-bilgi');
    bilgi.forEach(function (b) { bilgiEl.appendChild(h('li', { text: b })); });

    form.addEventListener('change', function (e) {
      if (e.target.name === 'teslimat') {
        teslimatAlanlariniGuncelle();
        hataGoster('teslimat', '');
        sepetCiz();
        onizlemeyiKapat();
      }
    });
    form.addEventListener('input', function (e) {
      if (e.target.name) hataGoster(e.target.name, '');
      onizlemeyiKapat();
    });
    form.addEventListener('submit', gonder);
    teslimatAlanlariniGuncelle();

    document.getElementById('onizleme-kopyala').addEventListener('click', function () {
      var metin = document.getElementById('onizleme-metin').textContent;
      var durum = document.getElementById('onizleme-kopya-durum');
      function bitti(ok) { durum.textContent = ok ? 'Mesaj kopyalandı.' : 'Kopyalanamadı; metni seçip kopyalayın.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(metin).then(function () { bitti(true); }, function () { bitti(false); });
      } else bitti(false);
    });
    document.getElementById('onizleme-whatsapp').addEventListener('click', function () {
      if (!this.getAttribute('href')) return;
      izle('siparis_whatsapp', { kalem: hesapla().kalem });
      // WhatsApp açıldı; sipariş ancak müşteri mesajı gönderince ulaşır.
      document.getElementById('onizleme-acildi').hidden = false;
    });
    document.getElementById('onizleme-duzenle').addEventListener('click', function () {
      onizlemeyiKapat();
      alan('ad').focus();
    });
    document.getElementById('onizleme-temizle').addEventListener('click', function () {
      bosalt();
      form.reset();
      teslimatAlanlariniGuncelle();
      sepetCiz();
      document.getElementById('sepet-baslik').focus();
    });
  }

  function barGorunurlugu() {
    var sepetBolumu = document.getElementById('sepet');
    if (!barEl || !sepetBolumu || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (girdiler) {
      document.body.classList.toggle('sepet-gorunur', girdiler[0].isIntersecting);
    }, { threshold: 0.05 }).observe(sepetBolumu);
  }

  // Sayfadaki "Dana Etlerini Sipariş Et" gibi bağlantılar katalogda ilgili kategoriyi açar.
  function kategoriSec(id) {
    var var_ = id === 'tumu' || G.kategoriler.some(function (k) { return k.id === id; });
    if (!var_) return;
    secilenKategori = id;
    filtreCiz();
    katalogCiz();
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-kategori-git]');
    if (a) kategoriSec(a.getAttribute('data-kategori-git'));
  });

  // ---------- Başlat ----------
  sepetiYukle();
  filtreCiz();
  katalogCiz();
  formuKur();
  sepetCiz();
  barGorunurlugu();
  document.documentElement.classList.add('sepet-hazir');

  window.addEventListener('storage', function (e) {
    if (e.key !== DEPO_ANAHTARI) return;
    sepetiYukle();
    URUNLER.forEach(aksiyonCiz);
    sepetCiz();
  });

  // Test ve hata ayıklama için salt-okunur erişim
  window.GOKSUN_SEPET = { kategoriSec: kategoriSec, hesapla: hesapla, mesajOlustur: mesajOlustur, telefonNormalize: telefonNormalize, whatsappHazir: whatsappHazir };
})();
