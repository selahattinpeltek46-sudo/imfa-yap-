/* Barber Uğur — salon paneli (Barber's Town paneliyle aynı kod; yalnız ayar adları farklı): günün randevuları, arama, WhatsApp hatırlatma, iptal, taşıma, kapatma,
   tek dokunuşla müşteri ekleme (kapıdan geldi, telefon randevusu) ve hızlı mola */
(function () {
  'use strict';

  var A = window.BU_AYARLAR || {};
  var DEMO = !!window.BU_DEMO;
  var API = (DEMO ? A.demoApi : A.randevuApi) || '';
  var PIN_ANAHTARI = DEMO ? 'bu_panel_pin_demo' : 'bu_panel_pin';

  var $ = function (id) { return document.getElementById(id); };
  var giris = $('giris'), pano = $('pano'), liste = $('liste'), durum = $('durum');
  var secilenTarih = '';
  var bildirim = '';
  var duzenleniyor = false; // açık bir form varken otomatik yenileme formu silmesin
  var hizmetler = [];       // sunucudan: [{ad, sure}] (Code.gs güncel değilse boş kalır)
  var sunucuBugun = '';     // sunucunun "bugün"ü

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

  // Sunucu yanıt vermezse sonsuza kadar beklemesin: süre dolunca istek iptal edilir, hata yolu çalışır.
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

  function istek(govde) {
    govde.islem = 'panel';
    govde.pin = pin;
    return sureliFetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(govde) }, 20000)
      .then(function (r) { return r.json(); })
      .then(function (c) {
        if (!c.ok && c.hata === 'Geçersiz işlem') c.hata = 'Bu özellik için Google Apps Script kodunun (Code.gs) güncellenmesi gerekiyor. Kurulum kılavuzundaki "Güncelleme" adımlarını uygulayın.';
        return c;
      });
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

    li.appendChild(el('div', 'rv__ad', r.kapali ? r.ad : (r.ad || 'İsimsiz')));
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
    }
    // Eski sunucu kodu (Code.gs güncellenmeden önce) hazır bağlantı göndermez; o durumda burada kurulur.
    var waHref = r.wa || (r.telefon && !r.kapali ? 'https://wa.me/90' + r.telefon.replace(/^0/, '') + '?text=' + encodeURIComponent(
      'Merhaba ' + r.ad + ', randevunuzu hatırlatmak istedik: ' + gunAdi(tarih).replace(/^(Bugün|Yarın) · /, '') + ', saat ' + r.bas + ' (' + (r.hizmet || 'randevu') + "). Gelemeyecekseniz lütfen haber verin. — Barber Uğur") : '');
    if (waHref) {
      var wa = el('a', 'e-wa', 'WhatsApp hatırlatma');
      wa.href = waHref;
      wa.target = '_blank';
      wa.rel = 'noopener';
      eylem.appendChild(wa);
    }
    if (!r.kapali && !r.tumGun) {
      var tasi = el('button', 'e-vazgec', 'Saati değiştir');
      tasi.type = 'button';
      tasi.addEventListener('click', function () { tasiForm(eylem, r, tarih); });
      eylem.appendChild(tasi);
    }
    var sil = el('button', 'e-iptal', r.kapali ? 'Kaldır' : 'İptal et');
    sil.type = 'button';
    sil.addEventListener('click', function () { iptalSor(eylem, r); });
    eylem.appendChild(sil);
    li.appendChild(eylem);
    return li;
  }

  /* Üstteki bildirim kutusu: işlem sonucu + müşteriye hazır WhatsApp mesajı */
  function bildirimGoster(metin, wa, uyari) {
    var kutu = $('bildirim-kutu');
    kutu.innerHTML = '';
    kutu.appendChild(el('p', 'bk__metin', metin));
    if (uyari) kutu.appendChild(el('p', 'bk__uyari', uyari));
    var satir = el('div', 'rv__eylem');
    if (wa) {
      var a = el('a', 'e-wa', 'Müşteriye WhatsApp\'tan bildir');
      a.href = wa; a.target = '_blank'; a.rel = 'noopener';
      satir.appendChild(a);
    }
    var kapat = el('button', 'e-vazgec', 'Tamam');
    kapat.type = 'button';
    kapat.addEventListener('click', function () { kutu.hidden = true; });
    satir.appendChild(kapat);
    kutu.appendChild(satir);
    kutu.hidden = false;
    kutu.scrollIntoView({ block: 'nearest' });
  }

  function tasiForm(kutu, r, tarih) {
    duzenleniyor = true;
    kutu.innerHTML = '';
    var gun = el('input'); gun.type = 'date'; gun.value = tarih; gun.setAttribute('aria-label', 'Yeni gün');
    var saat = el('input'); saat.type = 'time'; saat.step = 900; saat.value = r.bas; saat.setAttribute('aria-label', 'Yeni saat');
    var kaydet = el('button', 'e-onay e-onay--koyu', 'Taşı');
    var vazgec = el('button', 'e-vazgec', 'Vazgeç');
    kaydet.type = vazgec.type = 'button';
    var hata = el('p', 'alan-hata');
    vazgec.addEventListener('click', function () { duzenleniyor = false; yukle(); });
    kaydet.addEventListener('click', function () {
      if (!gun.value || !saat.value) { hata.textContent = 'Gün ve saat seçin.'; return; }
      kaydet.disabled = true; kaydet.textContent = 'Taşınıyor…';
      istek({ eylem: 'tasi', id: r.id, tarih: gun.value, saat: saat.value.slice(0, 5) }).then(function (c) {
        if (!c.ok) { hata.textContent = c.hata || 'Taşınamadı.'; kaydet.disabled = false; kaydet.textContent = 'Taşı'; return; }
        duzenleniyor = false;
        bildirimGoster(c.randevu.ad + ' — randevu ' + gunAdi(c.randevu.tarih) + ', saat ' + c.randevu.saat + ' olarak taşındı.', c.wa, c.uyari);
        yukle();
      }).catch(function () { hata.textContent = 'Bağlantı hatası, tekrar deneyin.'; kaydet.disabled = false; kaydet.textContent = 'Taşı'; });
    });
    [gun, saat, kaydet, vazgec].forEach(function (x) { kutu.appendChild(x); });
    kutu.appendChild(hata);
    saat.focus();
  }

  function iptalSor(kutu, r) {
    duzenleniyor = true;
    kutu.innerHTML = '';
    kutu.appendChild(el('span', null, r.kapali ? 'Kapalı saat kaldırılsın mı?' : 'Bu randevu silinsin mi?'));
    var evet = el('button', 'e-onay', r.kapali ? 'Evet, kaldır' : 'Evet, iptal et');
    var hayir = el('button', 'e-vazgec', 'Vazgeç');
    evet.type = hayir.type = 'button';
    hayir.addEventListener('click', function () { duzenleniyor = false; yukle(); });
    evet.addEventListener('click', function () {
      evet.disabled = true;
      evet.textContent = 'Siliniyor…';
      istek({ eylem: 'iptal', id: r.id }).then(function (c) {
        duzenleniyor = false;
        if (!c.ok) bildirim = c.hata || 'İptal edilemedi.';
        else if (r.kapali) bildirim = 'Kapalı saat kaldırıldı.';
        else bildirimGoster(((c.randevu && c.randevu.ad) || 'Randevu') + ' — randevu iptal edildi; saat sitede yeniden boş.', c.wa || '');
        yukle();
      }).catch(function () { duzenleniyor = false; durum.textContent = 'Bağlantı hatası, tekrar deneyin.'; yukle(); });
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

  function gunSec(iso, dugme) {
    hizliKapat();
    duzenleniyor = !kapatForm.hidden;
    secilenTarih = iso;
    $('tarih').value = iso;
    document.querySelectorAll('.gun-sec button').forEach(function (b) { b.setAttribute('aria-pressed', b === dugme ? 'true' : 'false'); });
    yukle();
  }

  document.querySelectorAll('.gun-sec button').forEach(function (b) {
    b.addEventListener('click', function () { gunSec(isoTarih(new Date(Date.now() + Number(b.dataset.gun) * 864e5)), b); });
  });
  $('tarih').addEventListener('change', function () { if (this.value) gunSec(this.value, null); });

  /* Saat / gün kapatma */
  var kapatForm = $('kapat-form');
  $('kapat-ac').addEventListener('click', function () {
    duzenleniyor = true;
    kapatForm.hidden = false;
    $('k-tarih').value = secilenTarih;
    $('k-hata').textContent = '';
    $('k-bas').focus();
  });
  $('k-vazgec').addEventListener('click', function () { duzenleniyor = false; kapatForm.hidden = true; });
  $('k-tumgun').addEventListener('change', function () {
    $('k-saatler').hidden = this.checked;
  });
  kapatForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var g = { eylem: 'kapat', tarih: $('k-tarih').value, tumGun: $('k-tumgun').checked, bas: $('k-bas').value.slice(0, 5), bit: $('k-bit').value.slice(0, 5), not: $('k-not').value };
    if (!g.tarih) { $('k-hata').textContent = 'Gün seçin.'; return; }
    if (!g.tumGun && (!g.bas || !g.bit || g.bit <= g.bas)) { $('k-hata').textContent = 'Bitiş saati başlangıçtan sonra olmalı.'; return; }
    var dugme = $('k-kaydet');
    dugme.disabled = true;
    istek(g).then(function (c) {
      dugme.disabled = false;
      if (!c.ok) { $('k-hata').textContent = c.hata || 'Kapatılamadı.'; return; }
      duzenleniyor = false;
      kapatForm.hidden = true;
      kapatForm.reset();
      $('k-saatler').hidden = false;
      bildirimGoster(gunAdi(g.tarih) + (g.tumGun ? ' tüm gün' : ', ' + g.bas + '–' + g.bit) + ' kapatıldı; sitede bu saatlere randevu alınamaz.', '',
        c.cakisan ? 'Bu aralıkta zaten ' + c.cakisan + ' randevu var. Onları ayrıca taşıyın ya da iptal edin.' : '');
      gunSec(g.tarih, null);
    }).catch(function () { dugme.disabled = false; $('k-hata').textContent = 'Bağlantı hatası, tekrar deneyin.'; });
  });

  /* ───────── Tek dokunuşla ekleme: kapıdan geldi · telefon randevusu · mola ───────── */
  var hKutu = $('hizli-kutu');

  function bugunMu() { return secilenTarih === (sunucuBugun || isoTarih(new Date())); }

  function hizliDurum() {
    var bugun = bugunMu();
    document.querySelectorAll('.hizli button').forEach(function (b) {
      var t = b.dataset.tur;
      b.disabled = (t === 'kapi' || t === 'mola') && !bugun;
      b.title = b.disabled ? 'Yalnız bugün için' : '';
    });
  }

  function hizliKapat() { hKutu.hidden = true; hKutu.innerHTML = ''; duzenleniyor = !kapatForm.hidden; }

  function kutuAc(baslik) {
    duzenleniyor = true;
    hKutu.innerHTML = '';
    hKutu.hidden = false;
    hKutu.appendChild(el('h3', null, baslik));
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
  }

  function mesaj(metin, hata) {
    var m = hKutu.querySelector('.hizli-mesaj') || hKutu.appendChild(el('p', 'hizli-mesaj'));
    m.className = 'hizli-mesaj' + (hata ? ' hata' : '');
    m.textContent = metin;
  }

  function secimler(liste, tik) {
    var kap = el('div', 'secimler');
    liste.forEach(function (x) {
      var b = el('button', '', x.metin);
      b.type = 'button';
      if (x.alt) b.appendChild(el('small', null, x.alt));
      b.addEventListener('click', function () { tik(x); });
      kap.appendChild(b);
    });
    hKutu.appendChild(kap);
  }

  function dugmelerKilit(kilit) { hKutu.querySelectorAll('button').forEach(function (b) { b.disabled = kilit; }); }

  // Ekleme isteği. Koltuk doluysa "yine de ekle?" sorar: müşteri zaten koltuktaysa gerçek budur.
  function ekle(govde, basari) {
    govde.eylem = 'ekle';
    govde.tarih = secilenTarih;
    dugmelerKilit(true);
    mesaj('Kaydediliyor…');
    istek(govde).then(function (c) {
      if (c.pin === false) { pin = ''; sakla(''); girisGoster(c.hata); return; }
      if (c.ok) { hizliKapat(); bildirimGoster(basari(c), c.wa || ''); yukle(); return; }
      dugmelerKilit(false);
      if (c.dolu) {
        mesaj(c.hata + ' Yine de eklensin mi?', true);
        var eski = hKutu.querySelector('.hizli-alt');
        if (eski) eski.remove();
        altDugmeler([
          { metin: 'Evet, yine de ekle', sinif: 'tehlike', tik: function () { govde.zorla = true; ekle(govde, basari); } },
          { metin: 'Vazgeç', tik: hizliKapat }
        ]);
        return;
      }
      mesaj(c.hata || 'Eklenemedi.', true);
    }).catch(function () { dugmelerKilit(false); mesaj('Bağlantı hatası. Tekrar deneyin.', true); });
  }

  function hizmetSecimleri(tik) {
    if (!hizmetler.length) { mesaj('Bu özellik için Code.gs güncellenmeli (kurulum kılavuzu → Güncelleme).', true); return; }
    secimler(hizmetler.map(function (h) { return { metin: h.ad, alt: h.sure + ' dk', deger: h.ad }; }), tik);
  }

  var akislar = {
    kapi: function () {
      kutuAc('Kapıdan geldi · hangi hizmet?');
      hizmetSecimleri(function (x) {
        ekle({ tur: 'kapi', hizmet: x.deger }, function (c) { return 'Eklendi: ' + c.bas + '–' + c.bit + ' · ' + x.deger + '. Bu sürede o koltuk sitede dolu görünür.'; });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: hizliKapat }]);
    },

    telefon: function () {
      kutuAc('Telefon randevusu · ' + gunAdi(secilenTarih));
      hizmetSecimleri(function (h) {
        kutuAc('Telefon randevusu · ' + h.deger);
        mesaj('Boş saatler yükleniyor…');
        istek({ eylem: 'bos', tarih: secilenTarih, hizmet: h.deger }).then(function (c) {
          if (!c.ok) { mesaj(c.hata || 'Saatler alınamadı.', true); altDugmeler([{ metin: 'Kapat', tik: hizliKapat }]); return; }
          hKutu.querySelector('.hizli-mesaj').remove();
          if (!c.saatler.length) { mesaj(c.kapali ? 'Bu gün kapalı.' : 'Bu gün için boş saat kalmadı.', true); altDugmeler([{ metin: 'Kapat', tik: hizliKapat }]); return; }
          secimler(c.saatler.map(function (s) { return { metin: s, deger: s }; }), function (s) {
            kutuAc('Telefon randevusu · ' + h.deger + ' · ' + gunAdi(secilenTarih).replace(/^(Bugün|Yarın) · .*/, '$1') + ' ' + s.deger);
            var ad = el('div', 'alan');
            ad.innerHTML = '<label for="h-ad">Müşterinin adı <small>(isteğe bağlı)</small></label><input id="h-ad" autocomplete="off">';
            var tel = el('div', 'alan');
            tel.innerHTML = '<label for="h-tel">Telefonu <small>(isteğe bağlı; onay ve hatırlatma için)</small></label><input id="h-tel" type="tel" inputmode="tel" placeholder="05xx xxx xx xx" autocomplete="off">';
            hKutu.appendChild(ad);
            hKutu.appendChild(tel);
            altDugmeler([
              { metin: 'Kaydet', sinif: 'ana', tik: function () {
                ekle({ tur: 'telefon', hizmet: h.deger, saat: s.deger, ad: $('h-ad').value, telefon: $('h-tel').value },
                  function (c) { return 'Telefon randevusu eklendi: ' + gunAdi(secilenTarih) + ', ' + c.bas + ' · ' + h.deger + '.'; });
              } },
              { metin: 'Vazgeç', tik: hizliKapat }
            ]);
            $('h-ad').focus();
          });
          altDugmeler([{ metin: 'Vazgeç', tik: hizliKapat }]);
        }).catch(function () { mesaj('Bağlantı hatası.', true); });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: hizliKapat }]);
    },

    // Mola: var olan "kapat" işlemini şu andan itibaren seçilen süre için kullanır.
    mola: function () {
      kutuAc('Mola · şu andan itibaren ne kadar?');
      secimler([15, 30, 45, 60].map(function (d) { return { metin: d + ' dk', deger: d }; }), function (x) {
        var simdi = new Date();
        var bas = Math.floor((simdi.getHours() * 60 + simdi.getMinutes()) / 5) * 5, bit = Math.min(bas + x.deger, 24 * 60 - 1);
        var hhmm = function (dk) { return iki(Math.floor(dk / 60)) + ':' + iki(dk % 60); };
        dugmelerKilit(true);
        mesaj('Kaydediliyor…');
        istek({ eylem: 'kapat', tarih: secilenTarih, tumGun: false, bas: hhmm(bas), bit: hhmm(bit), not: 'Mola' }).then(function (c) {
          if (!c.ok) { dugmelerKilit(false); mesaj(c.hata || 'Eklenemedi.', true); return; }
          hizliKapat();
          bildirimGoster('Mola: ' + hhmm(bas) + '–' + hhmm(bit) + '. Bu sürede sitede randevu alınamaz.', '',
            c.cakisan ? 'Bu aralıkta zaten ' + c.cakisan + ' randevu var.' : '');
          yukle();
        }).catch(function () { dugmelerKilit(false); mesaj('Bağlantı hatası. Tekrar deneyin.', true); });
      });
      altDugmeler([{ metin: 'Vazgeç', tik: hizliKapat }]);
    }
  };

  document.querySelectorAll('.hizli button').forEach(function (b) {
    b.addEventListener('click', function () {
      akislar[b.dataset.tur]();
      hKutu.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  });

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

  setInterval(function () { if (pin && !document.hidden && !pano.hidden && !duzenleniyor) yukle(); }, 60000);

  secilenTarih = isoTarih(new Date());
  $('tarih').value = secilenTarih;
  if (pin) yukle(); else girisGoster();
})();
