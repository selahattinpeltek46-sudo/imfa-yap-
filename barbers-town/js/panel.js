/* Barber's Town — salon paneli: günün randevuları, arama, WhatsApp hatırlatma, iptal */
(function () {
  'use strict';

  var A = window.BT_AYARLAR || {};
  var DEMO = !!window.BT_DEMO;
  var API = (DEMO ? A.demoApi : A.randevuApi) || '';
  var PIN_ANAHTARI = DEMO ? 'bt_panel_pin_demo' : 'bt_panel_pin';

  var $ = function (id) { return document.getElementById(id); };
  var giris = $('giris'), pano = $('pano'), liste = $('liste'), durum = $('durum');
  var secilenTarih = '';
  var bildirim = '';

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
    return fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(govde) })
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

    li.appendChild(el('div', 'rv__ad', r.kapali ? r.ad : (r.ad || 'İsimsiz')));
    var alt = r.kapali ? 'Kapalı saat' : r.elle ? 'Takvime elle eklendi' : r.hizmet;
    li.appendChild(el('div', 'rv__hizmet', alt + (r.kod ? ' · ' : '')));
    if (r.kod) li.lastChild.appendChild(el('span', 'rv__kod', r.kod));
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
    if (!r.kapali) {
      var iptal = el('button', 'e-iptal', 'İptal et');
      iptal.type = 'button';
      iptal.addEventListener('click', function () { iptalSor(eylem, r); });
      eylem.appendChild(iptal);
    }
    if (eylem.childNodes.length) li.appendChild(eylem);
    return li;
  }

  function iptalSor(kutu, r) {
    kutu.innerHTML = '';
    kutu.appendChild(el('span', null, 'Bu randevu silinsin mi?'));
    var evet = el('button', 'e-onay', 'Evet, iptal et');
    var hayir = el('button', 'e-vazgec', 'Vazgeç');
    evet.type = hayir.type = 'button';
    hayir.addEventListener('click', yukle);
    evet.addEventListener('click', function () {
      evet.disabled = true;
      evet.textContent = 'Siliniyor…';
      istek({ eylem: 'iptal', id: r.id }).then(function (c) {
        bildirim = c.ok ? 'Randevu iptal edildi, saat sitede yeniden boş.' : (c.hata || 'İptal edilemedi.');
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
    secilenTarih = iso;
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
