/*
 * GÖKSUN YÖREM — ÜRÜN KATALOĞU, SEPET VE WHATSAPP SİPARİŞİ
 * Veriler js/ayarlar.js dosyasından okunur. Bu dosyada işletme bilgisi bulunmaz.
 *
 * Para: tüm hesaplar tamsayı kuruş ile yapılır.
 * Miktar: tamsayı "mili birim" ile tutulur (1,5 kg = 1500; 2 kavanoz = 2000).
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
  var DEPO_ANAHTARI = 'goksunYoremSepet:v1';
  var MAKS_MILI = 100000; // bir üründe en fazla 100 birim (kg / kavanoz / litre)

  // ---------- Yardımcılar ----------
  var urunHaritasi = {};
  G.urunler.forEach(function (u) { urunHaritasi[u.id] = u; });
  var kategoriHaritasi = {};
  G.kategoriler.forEach(function (k) { kategoriHaritasi[k.id] = k; });

  function birimOf(urun) { return G.birimler[urun.birim]; }

  function tlToKurus(tl) {
    return (typeof tl === 'number' && isFinite(tl) && tl >= 0) ? Math.round(tl * 100) : null;
  }

  var paraBicimi = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });
  function tl(kurus) { return paraBicimi.format(kurus / 100); }

  function miktarYazi(urun, mili) {
    var sayi = (mili / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 3 });
    return sayi + ' ' + birimOf(urun).ad;
  }

  function satirTutari(urun, mili) {
    var k = tlToKurus(urun.fiyat);
    return k === null ? null : Math.round(k * mili / 1000);
  }

  function fiyatYazi(urun) {
    var k = tlToKurus(urun.fiyat);
    return k === null ? 'Fiyat sipariş teyidinde bildirilir' : tl(k) + ' ' + birimOf(urun).fiyatEki;
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

  // Küçük DOM yardımcısı: metinler daima textContent ile eklenir.
  function h(etiket, ozellikler, cocuklar) {
    var el = document.createElement(etiket);
    if (ozellikler) Object.keys(ozellikler).forEach(function (a) {
      var d = ozellikler[a];
      if (d === null || d === undefined || d === false) return;
      if (a === 'class') el.className = d;
      else if (a === 'text') el.textContent = d;
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

  // ---------- Sepet durumu ----------
  var sepet = {}; // { urunId: mili }

  function gecerliMiktar(urun, mili) {
    var b = birimOf(urun);
    if (typeof mili !== 'number' || !isFinite(mili)) return null;
    mili = Math.round(mili / b.adim) * b.adim;
    if (mili < b.min) return null;
    return Math.min(mili, MAKS_MILI);
  }

  function sepetiYukle() {
    sepet = {};
    try {
      var ham = JSON.parse(localStorage.getItem(DEPO_ANAHTARI) || '{}');
      Object.keys(ham || {}).forEach(function (id) {
        var urun = urunHaritasi[id];
        if (!urun || !birimOf(urun)) return;
        var m = gecerliMiktar(urun, ham[id]);
        if (m !== null) sepet[id] = m;
      });
    } catch (e) { /* bozuk veya erişilemeyen depo: boş sepetle devam */ }
  }

  function sepetiKaydet() {
    try { localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(sepet)); } catch (e) { /* gizli sekme vb. */ }
  }

  function ekle(id) {
    var urun = urunHaritasi[id]; if (!urun) return;
    var b = birimOf(urun);
    var yeni = sepet[id] ? sepet[id] + b.adim : b.min;
    sepet[id] = Math.min(yeni, MAKS_MILI);
    izle('add_to_cart', { urun: id });
    degisti();
  }

  function azalt(id) {
    var urun = urunHaritasi[id]; if (!urun || !sepet[id]) return;
    var yeni = sepet[id] - birimOf(urun).adim;
    if (yeni < birimOf(urun).min) delete sepet[id]; else sepet[id] = yeni;
    degisti();
  }

  function sil(id) { delete sepet[id]; degisti(); }

  function bosalt() { sepet = {}; degisti(); }

  // ---------- Hesaplama ----------
  function teslimatTercihi() {
    var r = document.querySelector('input[name="teslimat"]:checked');
    return r ? r.value : null;
  }

  function hesapla() {
    var satirlar = [];
    var araToplam = 0, fiyatliVar = false, fiyatsizVar = false, tartimliVar = false;
    G.urunler.forEach(function (urun) { // katalog sırası korunur
      var mili = sepet[urun.id];
      if (!mili) return;
      var tutar = satirTutari(urun, mili);
      if (tutar === null) fiyatsizVar = true; else { araToplam += tutar; fiyatliVar = true; }
      if (birimOf(urun).tartimli) tartimliVar = true;
      satirlar.push({ urun: urun, mili: mili, tutar: tutar });
    });

    var tercih = teslimatTercihi();
    var ucretKurus = tlToKurus(TESLIMAT.ucret);
    var teslimatUcreti = tercih === 'adres' ? ucretKurus : 0; // null = işletme bildirecek
    var ucretBelirsiz = tercih === 'adres' && ucretKurus === null;

    return {
      satirlar: satirlar,
      kalem: satirlar.length,
      araToplam: araToplam,
      fiyatliVar: fiyatliVar,
      fiyatsizVar: fiyatsizVar,
      tartimliVar: tartimliVar,
      tercih: tercih,
      teslimatUcreti: teslimatUcreti,
      genelToplam: fiyatliVar ? araToplam + (teslimatUcreti || 0) : null,
      tahmini: tartimliVar || fiyatsizVar || ucretBelirsiz
    };
  }

  // ---------- Katalog ----------
  var katalogEl = document.getElementById('katalog');
  var kategoriNavEl = document.getElementById('kategori-nav');
  var kartAksiyonlari = {}; // urunId -> aksiyon kutusu

  function kategoriGorseli(urun) {
    return urun.gorsel || (kategoriHaritasi[urun.kategori] || {}).gorsel || null;
  }

  function aksiyonCiz(urun) {
    var kutu = kartAksiyonlari[urun.id];
    if (!kutu) return;
    kutu.textContent = '';
    var mili = sepet[urun.id];
    if (!mili) {
      kutu.appendChild(h('button', {
        type: 'button',
        class: 'w-full inline-flex items-center justify-center gap-2 bg-bordo hover:bg-bordo-light text-white font-heading font-bold text-sm min-h-[44px] px-4 rounded-full transition',
        'aria-label': urun.ad + ' sepete ekle',
        onclick: function () { ekle(urun.id); odakla(urun.id, 'arti'); }
      }, [ikon('fa-cart-plus'), 'Sepete ekle']));
      return;
    }
    kutu.appendChild(miktarKontrolu(urun, mili, 'kart'));
  }

  function miktarKontrolu(urun, mili, yer) {
    var b = birimOf(urun);
    var minde = mili <= b.min;
    return h('div', { class: 'flex items-center justify-between gap-2 bg-white border-2 border-bordo/30 rounded-full p-1', role: 'group', 'aria-label': urun.ad + ' miktarı' }, [
      h('button', {
        type: 'button', 'data-odak': urun.id + '-eksi-' + yer,
        class: 'w-11 h-11 shrink-0 rounded-full bg-krem-dark hover:bg-bordo hover:text-white text-bordo flex items-center justify-center transition',
        'aria-label': minde ? urun.ad + ' sepetten çıkar' : urun.ad + ' miktarını azalt',
        onclick: function () { azalt(urun.id); odakla(urun.id, sepet[urun.id] ? 'eksi' : 'ekle', yer); }
      }, [ikon(minde ? 'fa-trash-can' : 'fa-minus')]),
      h('span', { class: 'font-heading font-bold text-base tabular-nums text-center flex-1', 'aria-live': 'polite', text: miktarYazi(urun, mili) }),
      h('button', {
        type: 'button', 'data-odak': urun.id + '-arti-' + yer,
        class: 'w-11 h-11 shrink-0 rounded-full bg-bordo hover:bg-bordo-light text-white flex items-center justify-center transition disabled:opacity-40',
        'aria-label': urun.ad + ' miktarını artır', disabled: mili >= MAKS_MILI,
        onclick: function () { ekle(urun.id); odakla(urun.id, 'arti', yer); }
      }, [ikon('fa-plus')])
    ]);
  }

  // Yeniden çizim sonrası klavye odağını aynı kontrolde tut.
  function odakla(id, ne, yer) {
    yer = yer || 'kart';
    requestAnimationFrame(function () {
      var el = document.querySelector('[data-odak="' + id + '-' + ne + '-' + yer + '"]');
      if (!el && yer === 'kart') {
        var kutu = kartAksiyonlari[id];
        el = kutu && kutu.querySelector('button');
      }
      if (el) el.focus();
    });
  }

  function katalogCiz() {
    if (!katalogEl) return;
    katalogEl.textContent = '';
    if (kategoriNavEl) kategoriNavEl.textContent = '';

    G.kategoriler.forEach(function (kat) {
      var urunler = G.urunler.filter(function (u) { return u.kategori === kat.id && birimOf(u); });
      if (!urunler.length) return;

      if (kategoriNavEl) kategoriNavEl.appendChild(h('li', null, [
        h('a', { href: '#kat-' + kat.id, class: 'inline-flex items-center gap-2 whitespace-nowrap bg-white border border-krem-dark hover:border-bordo hover:text-bordo font-semibold text-sm px-4 min-h-[44px] rounded-full transition' },
          [ikon(kat.ikon + ' text-bordo'), kat.ad])
      ]));

      var liste = h('ul', { class: 'grid md:grid-cols-2 gap-4 lg:gap-5' });
      urunler.forEach(function (urun) {
        var gorsel = kategoriGorseli(urun);
        var aksiyon = h('div', { class: 'mt-4' });
        kartAksiyonlari[urun.id] = aksiyon;
        liste.appendChild(h('li', { class: 'bg-white rounded-2xl shadow-card border border-krem-dark p-4 flex gap-4' }, [
          h('div', { class: 'relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-xl overflow-hidden img-fallback flex items-center justify-center text-white/70' }, [
            ikon(kat.ikon + ' text-2xl'),
            gorsel ? h('img', {
              src: gorsel, alt: urun.ad + ' (temsili görsel)', loading: 'lazy', width: '96', height: '96',
              class: 'absolute inset-0 w-full h-full object-cover',
              onerror: function () { this.remove(); }
            }) : null
          ]),
          h('div', { class: 'flex-1 min-w-0 flex flex-col' }, [
            h('h4', { class: 'font-heading font-bold text-base leading-snug', text: urun.ad }),
            urun.aciklama ? h('p', { class: 'text-komur/70 text-sm mt-1 leading-relaxed', text: urun.aciklama }) : null,
            h('p', { class: 'mt-2 text-sm' }, [
              h('span', { class: tlToKurus(urun.fiyat) === null ? 'text-komur/70 italic' : 'font-heading font-bold text-bordo text-base', text: fiyatYazi(urun) }),
              h('span', { class: 'block text-xs text-komur/60 mt-0.5', text: 'Satış birimi: ' + birimOf(urun).ad + (birimOf(urun).tartimli ? ' · tutar tartımla kesinleşir' : '') })
            ]),
            aksiyon
          ])
        ]));
        aksiyonCiz(urun);
      });

      katalogEl.appendChild(h('section', { id: 'kat-' + kat.id, class: 'scroll-mt-40', 'aria-labelledby': 'kat-baslik-' + kat.id }, [
        h('h3', { id: 'kat-baslik-' + kat.id, class: 'font-heading font-extrabold text-2xl flex items-center gap-3 mb-5' }, [
          h('span', { class: 'w-10 h-10 rounded-xl bg-bordo/10 text-bordo flex items-center justify-center text-lg' }, [ikon(kat.ikon)]),
          kat.ad
        ]),
        liste
      ]));
    });
  }

  // ---------- Sepet görünümü ----------
  var listeEl = document.getElementById('sepet-liste');
  var bosEl = document.getElementById('sepet-bos');
  var ozetEl = document.getElementById('sepet-ozet');
  var gonderBtn = document.getElementById('siparis-devam');
  var barEl = document.getElementById('sepet-bar');

  function ozetSatiri(etiket, deger, vurgulu, aciklama) {
    return h('div', { class: 'flex items-start justify-between gap-4 py-2' + (vurgulu ? ' border-t border-krem-dark mt-1 pt-3' : '') }, [
      h('dt', { class: vurgulu ? 'font-heading font-extrabold text-lg' : 'text-komur/75' }, [etiket, aciklama ? h('span', { class: 'block text-xs font-normal font-body text-komur/60', text: aciklama }) : null]),
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
      barEl.querySelector('[data-bar-toplam]').textContent =
        s.genelToplam === null ? 'Fiyat teyitte' : (s.tahmini ? '~' : '') + tl(s.genelToplam);
    }

    if (!listeEl) return;
    listeEl.textContent = '';
    bosEl.hidden = s.kalem > 0;
    ozetEl.hidden = s.kalem === 0;

    s.satirlar.forEach(function (sat) {
      var u = sat.urun;
      listeEl.appendChild(h('li', { class: 'py-4 border-b border-krem-dark last:border-0' }, [
        h('div', { class: 'flex items-start justify-between gap-3' }, [
          h('div', { class: 'min-w-0' }, [
            h('p', { class: 'font-heading font-bold leading-snug', text: u.ad }),
            h('p', { class: 'text-sm text-komur/65 mt-0.5', text: fiyatYazi(u) })
          ]),
          h('button', {
            type: 'button', class: 'shrink-0 text-sm text-komur/60 hover:text-bordo underline underline-offset-4 min-h-[44px] px-1',
            'aria-label': u.ad + ' ürününü sepetten sil', onclick: function () { sil(u.id); }
          }, ['Sil'])
        ]),
        h('div', { class: 'mt-2 flex items-center justify-between gap-4' }, [
          h('div', { class: 'w-48 max-w-[60%]' }, [miktarKontrolu(u, sat.mili, 'sepet')]),
          h('p', { class: 'font-heading font-bold text-right', text: sat.tutar === null ? 'Teyitte' : (birimOf(u).tartimli ? '~' : '') + tl(sat.tutar) })
        ])
      ]));
    });

    // Özet
    ozetEl.textContent = '';
    var dl = h('dl', { class: 'text-sm' });
    var araYazi = s.fiyatliVar ? tl(s.araToplam) : 'Teyitte bildirilecek';
    dl.appendChild(ozetSatiri('Ara toplam', araYazi, false,
      s.fiyatliVar && s.fiyatsizVar ? 'Fiyatı belirtilmeyen ürünler hariç' : null));
    if (s.tercih === 'adres') {
      var ucretYazi = s.teslimatUcreti === null ? 'İşletme bildirecek' : (s.teslimatUcreti === 0 ? 'Ücretsiz' : tl(s.teslimatUcreti));
      dl.appendChild(ozetSatiri('Teslimat ücreti', ucretYazi));
    } else if (s.tercih === 'magaza') {
      dl.appendChild(ozetSatiri('Teslimat', 'İşletmeden teslim alma'));
    }
    dl.appendChild(ozetSatiri(s.tahmini && s.fiyatliVar ? 'Tahmini toplam' : 'Genel toplam',
      s.genelToplam === null ? 'Teyitte bildirilecek' : tl(s.genelToplam), true));
    ozetEl.appendChild(dl);

    var notlar = [];
    if (s.tartimliVar) notlar.push('Kilo ile satılan ürünlerde tutar tahminidir; kesin tutar tartım sonrası belirlenir.');
    if (s.fiyatsizVar) notlar.push('Fiyatı belirtilmeyen ürünlerin fiyatı sipariş teyidinde bildirilir.');
    var minK = tlToKurus(TESLIMAT.minimumSiparis);
    if (minK !== null) notlar.push('Minimum sipariş tutarı: ' + tl(minK) + '.');
    notlar.push('Ödeme, sipariş teyidinden sonra teslimatta veya işletmede yapılır. Online ödeme alınmaz.');
    ozetEl.appendChild(h('ul', { class: 'mt-3 space-y-1.5 text-xs text-komur/70' },
      notlar.map(function (n) { return h('li', { class: 'flex gap-2' }, [ikon('fa-circle-info text-orman mt-0.5'), n]); })));

    if (gonderBtn) gonderBtn.disabled = s.kalem === 0;
  }

  function degisti() {
    sepetiKaydet();
    Object.keys(kartAksiyonlari).forEach(function (id) { aksiyonCiz(urunHaritasi[id]); });
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
    var girdi = form.querySelector('[name="' + ad + '"]');
    if (el) { el.textContent = mesaj || ''; el.hidden = !mesaj; }
    if (girdi) {
      form.querySelectorAll('[name="' + ad + '"]').forEach(function (g) {
        if (mesaj) g.setAttribute('aria-invalid', 'true'); else g.removeAttribute('aria-invalid');
      });
    }
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

  function mesajOlustur(s, v) {
    var satirlar = [];
    satirlar.push('*' + AYAR.isletmeAdi + '*');
    satirlar.push('*Web Sitesi Sipariş Talebi*');
    satirlar.push('');
    satirlar.push('*Ürünler*');
    s.satirlar.forEach(function (sat, i) {
      var u = sat.urun, k = tlToKurus(u.fiyat);
      var satir = (i + 1) + ') ' + u.ad + ' — ' + miktarYazi(u, sat.mili);
      if (k === null) satir += ' (fiyat teyitte)';
      else satir += ' × ' + tl(k) + birimOf(u).fiyatEki + ' = ' + (birimOf(u).tartimli ? '~' : '') + tl(sat.tutar);
      satirlar.push(satir);
    });
    satirlar.push('');
    satirlar.push('Ara toplam: ' + (s.fiyatliVar ? tl(s.araToplam) + (s.fiyatsizVar ? ' (fiyatı belirtilmeyenler hariç)' : '') : 'teyitte bildirilecek'));
    if (s.tercih === 'adres') {
      satirlar.push('Teslimat ücreti: ' + (s.teslimatUcreti === null ? 'işletme bildirecek' : (s.teslimatUcreti === 0 ? 'ücretsiz' : tl(s.teslimatUcreti))));
    }
    satirlar.push((s.tahmini && s.fiyatliVar ? 'Tahmini toplam: ' : 'Genel toplam: ') +
      (s.genelToplam === null ? 'teyitte bildirilecek' : tl(s.genelToplam)));
    if (s.tartimliVar) satirlar.push('(Kilo ile satılan ürünlerde tutar tartım sonrası kesinleşir.)');
    satirlar.push('');
    satirlar.push('*Müşteri:* ' + v.ad);
    satirlar.push('*Telefon:* ' + telefonYazi(v.telefon));
    satirlar.push('*Teslimat:* ' + (v.tercih === 'adres' ? 'Adrese teslimat' : 'İşletmeden teslim alma'));
    if (v.tercih === 'adres') {
      satirlar.push('*Mahalle/Köy:* ' + v.bolge);
      satirlar.push('*Adres:* ' + v.adres);
    }
    if (v.not) satirlar.push('*Not:* ' + v.not);
    satirlar.push('*Ödeme:* ' + (v.tercih === 'adres' ? AYAR.odeme.adreseTeslimat : AYAR.odeme.teslimAlma));
    satirlar.push('');
    satirlar.push('Siparişimin teyidini bekliyorum. (Sipariş, işletme teyit ettiğinde kesinleşir.)');
    return satirlar.join('\n');
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
      document.getElementById('urunler').scrollIntoView({ behavior: 'smooth' });
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

    var metin = mesajOlustur(s, d.veri);
    document.getElementById('onizleme-metin').textContent = metin;
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
    onizlemeEl.hidden = false;
    izle('begin_checkout', { kalem: s.kalem, teslimat: d.veri.tercih });
    onizlemeEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('onizleme-baslik').focus({ preventScroll: true });
  }

  function formuKur() {
    if (!form) return;

    // Teslimat seçenekleri ayarlara göre
    var secenekler = [];
    if (TESLIMAT.adreseTeslimat) secenekler.push({ deger: 'adres', ad: 'Adrese teslimat', alt: 'Göksun içi adresinize getirelim', ikon: 'fa-truck-fast' });
    if (TESLIMAT.teslimAlma) secenekler.push({ deger: 'magaza', ad: 'İşletmeden teslim alma', alt: 'Hazır olunca dükkandan alın', ikon: 'fa-store' });
    var secKutu = document.getElementById('teslimat-secenekleri');
    secenekler.forEach(function (sc, i) {
      secKutu.appendChild(h('label', { class: 'teslimat-secenek flex items-start gap-3 bg-white border-2 border-krem-dark rounded-xl p-4 cursor-pointer hover:border-bordo/50 transition' }, [
        h('input', { type: 'radio', name: 'teslimat', value: sc.deger, class: 'mt-1 w-5 h-5 shrink-0 accent-[#8B0000]', 'aria-describedby': 'hata-teslimat', checked: secenekler.length === 1 && i === 0 }),
        h('span', null, [
          h('span', { class: 'font-heading font-bold flex items-center gap-2' }, [ikon(sc.ikon + ' text-bordo'), sc.ad]),
          h('span', { class: 'block text-sm text-komur/65', text: sc.alt })
        ])
      ]));
    });

    // Mahalle / köy: liste tanımlıysa seçim kutusu, değilse serbest metin
    var bolgeKutu = document.getElementById('bolge-kutu');
    var bolgeler = Array.isArray(TESLIMAT.bolgeler) ? TESLIMAT.bolgeler : [];
    var girdiSinif = 'w-full bg-white border-2 border-krem-dark rounded-xl px-4 min-h-[48px] focus:outline-none focus:border-bordo transition';
    if (bolgeler.length) {
      bolgeKutu.appendChild(h('select', { id: 'bolge', name: 'bolge', class: girdiSinif, required: true, 'aria-describedby': 'hata-bolge' },
        [h('option', { value: '', text: 'Seçiniz' })].concat(bolgeler.map(function (b) { return h('option', { value: b, text: b }); }))));
    } else {
      bolgeKutu.appendChild(h('input', { id: 'bolge', name: 'bolge', type: 'text', class: girdiSinif, required: true, maxlength: '80', autocomplete: 'address-level3', placeholder: 'Örn: Merkez, Yeşilköy…', 'aria-describedby': 'hata-bolge' }));
    }

    // Teslimat bilgileri (ayarlarda tanımlıysa)
    var bilgi = [];
    if (TESLIMAT.saatler) bilgi.push('Teslimat saatleri: ' + TESLIMAT.saatler);
    var ucretK = tlToKurus(TESLIMAT.ucret);
    bilgi.push('Teslimat ücreti: ' + (ucretK === null ? 'sipariş teyidinde bildirilir' : (ucretK === 0 ? 'ücretsiz' : tl(ucretK))));
    if (bolgeler.length) bilgi.push('Hizmet bölgeleri: ' + bolgeler.join(', '));
    else bilgi.push('Teslimat yapılabilecek bölgeler sipariş teyidinde netleştirilir.');
    var bilgiEl = document.getElementById('teslimat-bilgi');
    bilgi.forEach(function (b) { bilgiEl.appendChild(h('li', { text: b })); });

    form.addEventListener('change', function (e) {
      if (e.target.name === 'teslimat') {
        teslimatAlanlariniGuncelle();
        hataGoster('teslimat', '');
        sepetCiz();
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
      izle('siparis_whatsapp', { kalem: hesapla().kalem });
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

  // ---------- Sabit sepet çubuğu: sepet bölümündeyken gizle ----------
  function barGorunurlugu() {
    var sepetBolumu = document.getElementById('sepet');
    if (!barEl || !sepetBolumu || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (girdiler) {
      document.body.classList.toggle('sepet-gorunur', girdiler[0].isIntersecting);
    }, { threshold: 0.05 }).observe(sepetBolumu);
  }

  // ---------- Başlat ----------
  sepetiYukle();
  katalogCiz();
  formuKur();
  sepetCiz();
  barGorunurlugu();
  document.documentElement.classList.add('sepet-hazir');

  // Başka sekmede sepet değişirse eşitle
  window.addEventListener('storage', function (e) {
    if (e.key !== DEPO_ANAHTARI) return;
    sepetiYukle();
    Object.keys(kartAksiyonlari).forEach(function (id) { aksiyonCiz(urunHaritasi[id]); });
    sepetCiz();
  });

  // Test ve hata ayıklama için salt-okunur erişim
  window.GOKSUN_SEPET = { hesapla: hesapla, mesajOlustur: mesajOlustur, telefonNormalize: telefonNormalize };
})();
