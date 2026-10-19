/* Barber's Town — salon paneli: günün randevuları, arama, WhatsApp hatırlatma, iptal,
   tek dokunuşla ekleme (kapıdan gelen, telefon randevusu, mola, kapatma) */
(function () {
  'use strict';

  // Randevu sunucusu yanıt vermezse sonsuza kadar beklemesin: süre dolunca istek iptal edilir ve
  // hata yolu (WhatsApp yedeği) çalışır. Apps Script ilk istekte birkaç saniye "uyanabilir".
  function sureliFetch(url, secenek, ms) {
    var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    var o = secenek || {};
    if (ctrl) o.signal = ctrl.signal;
    return Promise.race([
      fetch(url, o),
      new Promise(function (_, red) {
        setTimeout(function () { if (ctrl) ctrl.abort(); red(new Error('zaman aşımı')); }, ms);
      })
    ]);
  }

  var A = window.BT_AYARLAR || {};
  var DEMO = !!window.BT_DEMO;
  var API = (DEMO ? A.demoApi : A.randevuApi) || '';
  var PIN_ANAHTARI = DEMO ? 'bt_panel_pin_demo' : 'bt_panel_pin';

  var $ = function (id) { return document.getElementById(id); };
  var giris = $('giris'), pano = $('pano'), liste = $('liste'), durum = $('durum');
  var secilenTarih = '';
  var bildirim = '';
  var hizmetler = [];      // sunucudan: [{ad, sure}]
  var sunucuBugun = '';    // sunucunun "bugün"ü (telefon saati yanlış olsa da doğru gün)

  if (DEMO) document.title = 'DEMO · ' + document.title;
  if (!API) { $('baglanti-yok').hidden = false; return; }

  function sakla(deger) { try { deger ? localStorage.setItem(PIN_ANAHTARI, deger) : localStorage.removeItem(PIN_ANAHTARI); } catch (e) { /* gizli sekme */ } }
  function oku() { try { return localStorage.getItem(PIN_ANAHTARI) || ''; } catch (e) { return ''; } }
  var pin = oku();

  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function isoTarih(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
  function gunAdi(iso) {
    var bugun = isoTarih(new Date());
    var yarin = isoTarih(new Date(Date.now() + 864e5));
    var uzun = new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
    return iso === bugun ? 'Bugün · ' + uzun : iso === yarin ? 'Yarın · ' + uzun : uzun;
  }

  function istek(govde) {
    govde.islem = 'panel';
    govde.pin = pin;
    return sureliFetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(govde) }, 20000)
      .then(function (r) { return r.json(); });
  }

  function girisGoster(hata) {
    pano.hidden = true;
    $('cikis').hidden = true;
    giris.hidden = false;
    $('pin-hata').textContent = hata || '';
    $('pin').value = '';
    $('pin').focus();
  }

  function panoGoster() {
    giris.hidden = true;
    pano.hidden = false;
    $('cikis').hidden = false;
  }

  function el(etiket, sinif, metin) {
    var e = document.createElement(etiket);
    if (sinif) e.className = sinif;
    if (metin != null) e.textContent = metin;
    return e;
  }

  function kart(r, tarih) {
    var li = el('li', 'rv' + (r.kapali ? ' rv--kapali' : ''));
    var simdi = new Date();
    if (tarih === isoTarih(simdi) && r.bit && r.bit <= iki(simdi.getHours()) + ':' + iki(simdi.getMinutes())) li.classList.add('rv--gecti');

    var saat = el('div', 'rv__saat', r.tumGun ? 'Tüm gün' : r.bas);
    if (r.bit) saat.appendChild(el('small', null, '– ' + r.bit));
    li.appendChild(saat);

    li.appendChild(el('div', 'rv__ad', r.kapali ? (r.ad.replace(/^\s*KAPALI\s*[—-]?\s*/i, '') || 'Kapalı') : (r.ad || 'İsimsiz')));
    var alt = r.kapali ? 'Kapalı saat' : r.elle ? 'Takvime elle eklendi' : r.hizmet;
    li.appendChild(el('div', 'rv__hizmet', alt + (r.kod ? ' · ' : '')));
    if (r.kod) li.lastChild.appendChild(el('span', 'rv__kod', r.kod));
    if (/kapıdan/.test(r.kaynakNot || '')) li.lastChild.appendChild(el('span', 'rv__etiket', 'Kapıdan'));
    else if (/telefon/.test(r.kaynakNot || '')) li.lastChild.appendChild(el('span', 'rv__etiket', 'Telefon'));
    if (r.not) li.appendChild(el('div', 'rv__not', r.not));

    var eylem = el('div', 'rv__eylem');
    if (r.telefon) {
      var ara = el('a', 'e-ara', 'Ara');
      ara.href = 'tel:' + r.telefon;
      eylem.appendChild(ara);
      var wa = el('a', 'e-wa', 'WhatsApp hatırlatma');
      var gun = tarih === isoTarih(new Date()) ? 'bugün' : new Date(tarih + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
      wa.href = 'https://wa.me/90' + r.telefon.replace(/^0/, '') + '?text=' + encodeURIComponent(
        'Merhaba ' + r.ad + ', randevunuzu hatırlatmak istedik: ' + gun + ', saat ' + r.bas + ' (' + r.hizmet + "). Görüşmek üzere! — Barber's Town");
      wa.target = '_blank';
      wa.rel = 'noopener';
      eylem.appendChild(wa);
    }
    var iptal = el('button', 'e-iptal', r.kapali ? 'Kaldır' : 'İptal et');
    iptal.type = 'button';
    iptal.addEventListener('click', function () { iptalSor(eylem, r); });
    eylem.appendChild(iptal);
    if (eylem.childNodes.length) li.appendChild(eylem);
    return li;
  }

  function iptalSor(kutu, r) {
    kutu.innerHTML = '';
    kutu.appendChild(el('span', null, r.kapali ? 'Kapalı saat kaldırılsın mı?' : 'Bu randevu silinsin mi?'));
    var evet = el('button', 'e-onay', r.kapali ? 'Evet, kaldır' : 'Evet, iptal et');
    var hayir = el('button', 'e-vazgec', 'Vazgeç');
    evet.type = hayir.type = 'button';
    hayir.addEventListener('click', yukle);
    evet.addEventListener('click', function () {
      evet.disabled = true;
      evet.textContent = 'Siliniyor…';
      istek({ eylem: 'iptal', id: r.id }).then(function (c) {
        bildirim = c.ok ? (r.kapali ? 'Kapalı saat kaldırıldı.' : 'Randevu iptal edildi, saat sitede yeniden boş.') : (c.hata || 'İptal edilemedi.');
        yukle();
      }).catch(function () { durum.textContent = 'Bağlantı hatası, tekrar deneyin.'; yukle(); });
    });
    kutu.appendChild(evet);
    kutu.appendChild(hayir);
    evet.focus();
  }

  function yukle() {
    var tarih = secilenTarih;
    durum.textContent = 'Yükleniyor…';
    istek({ eylem: 'liste', tarih: tarih }).then(function (c) {
      if (c.pin === false) { pin = ''; sakla(''); girisGoster(c.hata); return; }
      if (!c.ok) { durum.textContent = c.hata || 'Liste alınamadı.'; return; }
      if (tarih !== secilenTarih) return;
      if (c.hizmetler) hizmetler = c.hizmetler;
      if (c.bugun) sunucuBugun = c.bugun;
      hizliDurum();
      panoGoster();
      var rv = c.randevular.slice().sort(function (a, b) { return (a.bas || '00:00').localeCompare(b.bas || '00:00'); });
      var sayi = rv.filter(function (r) { return !r.kapali; }).length;
      $('gun-baslik').textContent = gunAdi(tarih);
      $('sayi').textContent = sayi ? sayi + ' randevu' : '';
      liste.innerHTML = '';
      if (!rv.length) liste.appendChild(el('li', 'bos', 'Bu gün için randevu yok.'));
      rv.forEach(function (r) { liste.appendChild(kart(r, tarih)); });
      durum.textContent = (bildirim ? bildirim + ' · ' : '') + 'Son güncelleme ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) + ' · her dakika yenilenir';
      bildirim = '';
    }).catch(function () { durum.textContent = 'Bağlantı hatası. İnternetinizi kontrol edip sayfayı yenileyin.'; });
  }

  /* ───────── Tek dokunuşla ekleme ───────── */
  var hKutu = $('hizli-kutu');
  var tamamZaman = null;

  function bugunMu() { return secilenTarih === (sunucuBugun || isoTarih(new Date())); }

  function hizliDurum() {
    var bugun = bugunMu();
    document.querySelectorAll('.hizli button').forEach(function (b) {
      var t = b.dataset.tur;
      b.disabled = (t === 'kapi' || t === 'mola') && !bugun;
      b.title = b.disabled ? 'Yalnız bugün için' : '';
    });
  }

  function tamamGoster(metin) {
    var t = $('tamam');
    t.textContent = metin;
    t.hidden = false;
    clearTimeout(tamamZaman);
    tamamZaman = setTimeout(function () { t.hidden = true; }, 8000);
  }

  function kutuKapat() { hKutu.hidden = true; hKutu.innerHTML = ''; }

  function kutuAc(baslik) {
    hKutu.innerHTML = '';
    hKutu.hidden = false;
    hKutu.appendChild(el('h3', null, baslik));
    return hKutu;
  }

  function altDugmeler(dugmeler) {
    var alt = el('div', 'hizli-alt');
    dugmeler.forEach(function (d) {
      var b = el('button', d.sinif || '', d.metin);
      b.type = 'button';
      b.addEventListener('click', d.tik);
      alt.appendChild(b);
    });
    hKutu.appendChild(alt);
    return alt;
  }

  function mesaj(metin, hata) {
    var m = hKutu.querySelector('.hizli-mesaj') || hKutu.appendChild(el('p', 'hizli-mesaj'));
    m.className = 'hizli-mesaj' + (hata ? ' hata' : '');
    m.textContent = metin;
  }

  function secimler(liste, tik) {
    var kap = el('div', 'secimler');
    liste.forEach(function (x) {
      var b = el('button', x.sinif || '', x.metin);
      b.type = 'button';
      if (x.alt) b.appendChild(el('small', null, x.alt));
      b.addEventListener('click', function () { tik(x, b); });
      kap.appendChild(b);
    });
    hKutu.appendChild(kap);
    return kap;
  }

  // Ekleme isteği; koltuk doluysa "yine de ekle" sorar (müşteri zaten koltuktaysa gerçek budur).
  function ekle(govde, basari) {
    govde.eylem = 'ekle';
    govde.tarih = secilenTarih;
    hKutu.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    mesaj('Kaydediliyor…');
    istek(govde).then(function (c) {
      if (c.pin === false) { pin = ''; sakla(''); girisGoster(c.hata); return; }
      if (c.ok) { kutuKapat(); tamamGoster(basari(c)); yukle(); return; }
      hKutu.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      if (c.dolu) {
        mesaj(c.hata + ' Yine de eklensin mi?', true);
        var eski = hKutu.querySelector('.hizli-alt');
        if (eski) eski.remove();
        altDugmeler([
          { metin: 'Evet, yine de ekle', sinif: 'tehlike', tik: function () { govde.zorla = true; ekle(govde, basari); } },
          { metin: 'Vazgeç', tik: kutuKapat }
        ]);
        return;
      }
      mesaj(c.hata || 'Eklenemedi.', true);
    }).catch(function () {
      hKutu.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      mesaj('Bağlantı hatası. Tekrar deneyin.', true);
    });
  }

  function hizmetSecimleri(tik) {
    if (!hizmetler.length) { mesaj('Hizmet listesi yüklenemedi; sayfayı yenileyin.', true); return; }
    secimler(hizmetler.map(function (h) { return { metin: h.ad, alt: h.sure + ' dk', deger: h.ad }; }), tik);
  }

  var akislar = {
    kapi: function () {
      kutuAc('Kapıdan geldi · hangi hizmet?');
      hizmetSecimleri(function (x) {
        ekle({ tur: 'kapi', hizmet: x.deger }, function (c) { return 'Eklendi: ' + c.bas + '–' + c.bit + ' · ' + x.deger; });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: kutuKapat }]);
    },

    telefon: function () {
      kutuAc('Telefon randevusu · ' + gunAdi(secilenTarih));
      hizmetSecimleri(function (h) {
        kutuAc('Telefon randevusu · ' + h.deger);
        mesaj('Boş saatler yükleniyor…');
        istek({ eylem: 'bos', tarih: secilenTarih, hizmet: h.deger }).then(function (c) {
          if (!c.ok) { mesaj(c.hata || 'Saatler alınamadı.', true); return; }
          hKutu.querySelector('.hizli-mesaj').remove();
          if (!c.saatler.length) { mesaj(c.kapali ? 'Bu gün kapalı.' : 'Bu gün için boş saat kalmadı.', true); altDugmeler([{ metin: 'Kapat', tik: kutuKapat }]); return; }
          secimler(c.saatler.map(function (s) { return { metin: s, deger: s }; }), function (s) {
            kutuAc('Telefon randevusu · ' + h.deger + ' · ' + s.deger);
            var ad = el('div', 'alan');
            ad.innerHTML = '<label for="h-ad">Müşterinin adı <small>(isteğe bağlı)</small></label><input id="h-ad" autocomplete="off">';
            var tel = el('div', 'alan');
            tel.innerHTML = '<label for="h-tel">Telefonu <small>(isteğe bağlı, hatırlatma için)</small></label><input id="h-tel" type="tel" inputmode="tel" placeholder="05xx xxx xx xx" autocomplete="off">';
            hKutu.appendChild(ad);
            hKutu.appendChild(tel);
            altDugmeler([
              { metin: 'Kaydet', sinif: 'ana', tik: function () {
                ekle({ tur: 'telefon', hizmet: h.deger, saat: s.deger, ad: $('h-ad').value, telefon: $('h-tel').value },
                  function (c) { return 'Telefon randevusu eklendi: ' + c.bas + ' · ' + h.deger; });
              } },
              { metin: 'Vazgeç', tik: kutuKapat }
            ]);
            $('h-ad').focus();
          });
          altDugmeler([{ metin: 'Vazgeç', tik: kutuKapat }]);
        }).catch(function () { mesaj('Bağlantı hatası.', true); });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: kutuKapat }]);
    },

    mola: function () {
      kutuAc('Mola · şu andan itibaren ne kadar?');
      secimler([15, 30, 45, 60].map(function (d) { return { metin: d + ' dk', deger: d }; }), function (x) {
        ekle({ tur: 'mola', sure: x.deger }, function (c) {
          return 'Mola: ' + c.bas + '–' + c.bit + '. Bu aralıkta siteden randevu alınamaz.' + (c.etkilenen ? ' Dikkat: ' + c.etkilenen + ' randevu bu aralıkta.' : '');
        });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: kutuKapat }]);
    },

    kapat: function () {
      kutuAc('Kapat · ' + gunAdi(secilenTarih));
      var liste = [];
      if (bugunMu()) liste.push({ metin: 'Şimdi kapat', alt: 'kapanış saatine kadar', deger: false, sinif: 'tehlike' });
      liste.push({ metin: 'Tüm günü kapat', alt: 'izin, tatil', deger: true, sinif: 'tehlike' });
      secimler(liste, function (x) {
        kutuAc(x.deger ? gunAdi(secilenTarih) + ' tamamen kapatılsın mı?' : 'Bugün şimdi kapatılsın mı?');
        mesaj('Siteden bu aralığa randevu alınamaz. Var olan randevular silinmez; gerekirse müşterilere haber verin.');
        altDugmeler([
          { metin: 'Evet, kapat', sinif: 'tehlike', tik: function () {
            ekle({ tur: 'kapat', tumGun: x.deger }, function (c) {
              return (x.deger ? 'Gün kapatıldı.' : 'Kapatıldı: ' + c.bas + '–' + c.bit + '.') +
                (c.etkilenen ? ' Dikkat: bu aralıkta ' + c.etkilenen + ' randevu var, müşterilere haber verin.' : '');
            });
          } },
          { metin: 'Vazgeç', tik: kutuKapat }
        ]);
      });
      altDugmeler([{ metin: 'Vazgeç', tik: kutuKapat }]);
    }
  };

  document.querySelectorAll('.hizli button').forEach(function (b) {
    b.addEventListener('click', function () {
      akislar[b.dataset.tur]();
      hKutu.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });

  function gunSec(iso, dugme) {
    secilenTarih = iso;
    kutuKapat();
    $('tarih').value = iso;
    document.querySelectorAll('.gun-sec button').forEach(function (b) { b.setAttribute('aria-pressed', b === dugme ? 'true' : 'false'); });
    yukle();
  }

  document.querySelectorAll('.gun-sec button').forEach(function (b) {
    b.addEventListener('click', function () { gunSec(isoTarih(new Date(Date.now() + Number(b.dataset.gun) * 864e5)), b); });
  });
  $('tarih').addEventListener('change', function () { if (this.value) gunSec(this.value, null); });

  giris.addEventListener('submit', function (e) {
    e.preventDefault();
    var deger = $('pin').value.trim();
    if (!/^\d{6}$/.test(deger)) { $('pin-hata').textContent = 'Şifre 6 haneli bir sayıdır.'; return; }
    pin = deger;
    sakla(pin);
    $('pin-hata').textContent = '';
    yukle();
  });

  $('cikis').addEventListener('click', function () { pin = ''; sakla(''); girisGoster(); });

  setInterval(function () { if (pin && !document.hidden && !pano.hidden) yukle(); }, 60000);

  secilenTarih = isoTarih(new Date());
  $('tarih').value = secilenTarih;
  if (pin) yukle(); else girisGoster();
})();
