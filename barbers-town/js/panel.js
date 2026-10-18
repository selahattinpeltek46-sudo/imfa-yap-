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
  var duzenleniyor = false; // açık bir form varken otomatik yenileme formu silmesin

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
    if (r.not) li.appendChild(el('div', 'rv__not', r.not));

    var eylem = el('div', 'rv__eylem');
    if (r.telefon) {
      var ara = el('a', 'e-ara', 'Ara');
      ara.href = 'tel:' + r.telefon;
      eylem.appendChild(ara);
    }
    // Eski sunucu kodu (Code.gs güncellenmeden önce) hazır bağlantı göndermez; o durumda burada kurulur.
    var waHref = r.wa || (r.telefon && !r.kapali ? 'https://wa.me/90' + r.telefon.replace(/^0/, '') + '?text=' + encodeURIComponent(
      'Merhaba ' + r.ad + ', randevunuzu hatırlatmak istedik: ' + gunAdi(tarih).replace(/^(Bugün|Yarın) · /, '') + ', saat ' + r.bas + ' (' + (r.hizmet || 'randevu') + "). Gelemeyecekseniz lütfen haber verin. — Barber's Town") : '');
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
