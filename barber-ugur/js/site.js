/* Barber Uğur — online randevu formu, tıklayınca yüklenen harita, ölçüm olayları */
(function () {
  'use strict';

  var A = window.BU_AYARLAR || {};
  var WHATSAPP = A.whatsapp || '905428253389';
  var API = A.randevuApi || '';
  var ILERI_GUN = A.ileriGun || 21;

  // GA4 eklendiğinde (çerez onayından sonra) window.gtag tanımlı olur; o zamana kadar sessizce geçer.
  function olay(ad, yer) {
    if (typeof window.gtag === 'function') window.gtag('event', ad, { konum: yer || '' });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-olay]');
    if (el) olay(el.getAttribute('data-olay'), el.getAttribute('data-yer'));
  });

  function waUrl(metin) {
    return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(metin);
  }

  // WhatsApp'ı yeni sekmede aç; tarayıcı engellerse aynı sekmede.
  function whatsappAc(metin) {
    var url = waUrl(metin);
    var pencere = window.open(url, '_blank');
    if (pencere) pencere.opener = null;
    else window.location.href = url;
  }

  function iki(n) { return (n < 10 ? '0' : '') + n; }
  function isoTarih(d) { return d.getFullYear() + '-' + iki(d.getMonth() + 1) + '-' + iki(d.getDate()); }
  function uzunTarih(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
  }

  /* ───────────── Randevu formu ───────────── */
  var form = document.getElementById('randevu-formu');
  if (form) {
    var mod = API ? 'api' : 'wa';
    var hizmetSec = form.elements.hizmet;
    var gunler = document.getElementById('gunler');
    var saatler = document.getElementById('saatler');
    var saatBilgi = document.getElementById('saat-bilgi');
    var durum = document.getElementById('form-durum');
    var gonder = document.getElementById('gonder');
    var gonderYazi = document.getElementById('gonder-yazi');
    var sonuc = document.getElementById('randevu-sonuc');
    var istekNo = 0;

    function modAyarla(yeni) {
      mod = yeni;
      form.setAttribute('data-mod', mod);
      gonderYazi.textContent = mod === 'api' ? 'Randevuyu onayla' : "Randevu talebini WhatsApp'tan gönder";
    }
    modAyarla(mod);

    // Gün çipleri
    var bugun = new Date();
    var kisaGun = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    var kisaAy = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    for (var i = 0; i <= ILERI_GUN; i++) {
      var d = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate() + i);
      var ust = i === 0 ? 'Bugün' : i === 1 ? 'Yarın' : kisaGun[d.getDay()];
      var etiket = document.createElement('label');
      etiket.className = 'cip';
      etiket.innerHTML = '<input type="radio" name="gun" value="' + isoTarih(d) + '">' +
        '<span><small>' + ust + '</small>' + d.getDate() + ' ' + kisaAy[d.getMonth()] + '</span>';
      gunler.appendChild(etiket);
    }

    function secili(ad) {
      var el = form.querySelector('input[name="' + ad + '"]:checked');
      return el ? el.value : '';
    }

    function saatleriCiz(liste) {
      saatler.innerHTML = '';
      liste.forEach(function (s) {
        var l = document.createElement('label');
        l.className = 'cip';
        l.innerHTML = '<input type="radio" name="saat" value="' + s + '"><span>' + s + '</span>';
        saatler.appendChild(l);
      });
    }

    // Sunucu yokken (yedek mod) gösterilen tercih saatleri [VARSAYIM: 09:00–20:00]
    function yerelSaatler(tarih) {
      var liste = [], simdi = new Date(), bugunMu = tarih === isoTarih(simdi);
      var enErken = simdi.getHours() * 60 + simdi.getMinutes() + 60;
      for (var t = 9 * 60; t <= 19 * 60 + 30; t += 30) {
        if (bugunMu && t < enErken) continue;
        liste.push(iki(Math.floor(t / 60)) + ':' + iki(t % 60));
      }
      return liste;
    }

    function saatleriYukle() {
      var hizmet = hizmetSec.value, tarih = secili('gun');
      hataGoster('h-saat', '');
      saatler.innerHTML = '';
      if (!hizmet || !tarih) { saatBilgi.textContent = 'Önce hizmet ve gün seçin.'; return; }

      if (mod === 'wa') {
        var yerel = yerelSaatler(tarih);
        saatleriCiz(yerel);
        saatBilgi.textContent = yerel.length
          ? "Saat tercihinizi seçin; salon WhatsApp'tan teyit eder."
          : 'Bugün için uygun saat kalmadı, başka bir gün seçin.';
        return;
      }

      var no = ++istekNo;
      saatBilgi.textContent = 'Boş saatler yükleniyor…';
      fetch(API + '?islem=musait&tarih=' + tarih + '&hizmet=' + encodeURIComponent(hizmet))
        .then(function (r) { return r.json(); })
        .then(function (v) {
          if (no !== istekNo) return; // daha yeni bir seçim yapıldı
          if (!v.ok) throw new Error(v.hata || 'hata');
          saatleriCiz(v.saatler);
          if (v.kapali) saatBilgi.textContent = 'Bu gün kapalıyız, başka bir gün seçin.';
          else if (!v.saatler.length) saatBilgi.textContent = 'Bu gün için boş saat kalmadı, başka bir gün seçin.';
          else saatBilgi.textContent = v.saatler.length + ' boş saat var. Size uygun olanı seçin.';
        })
        .catch(function () {
          if (no !== istekNo) return;
          // Randevu sunucusuna ulaşılamazsa WhatsApp yedek moduna geç
          modAyarla('wa');
          saatleriYukle();
          durum.textContent = "Online randevu sistemine şu an ulaşılamıyor; talebinizi WhatsApp'tan iletebilirsiniz.";
        });
    }

    hizmetSec.addEventListener('change', function () { hataGoster('h-hizmet', ''); saatleriYukle(); });
    gunler.addEventListener('change', function () { hataGoster('h-gun', ''); saatleriYukle(); });
    saatler.addEventListener('change', function () { hataGoster('h-saat', ''); });

    // Hizmet kartındaki "Randevu al" bağlantısı hizmeti önceden seçer
    document.querySelectorAll('[data-hizmet]').forEach(function (a) {
      a.addEventListener('click', function () {
        hizmetSec.value = a.getAttribute('data-hizmet');
        hizmetSec.dispatchEvent(new Event('change'));
      });
    });

    function hataGoster(id, mesaj, alan) {
      document.getElementById(id).textContent = mesaj;
      if (alan) alan.setAttribute('aria-invalid', mesaj ? 'true' : 'false');
    }

    function telefonTemizle(tel) {
      var t = String(tel || '').replace(/[^\d]/g, '');
      if (t.indexOf('90') === 0 && t.length === 12) t = t.slice(2);
      if (t.indexOf('0') === 0 && t.length === 11) t = t.slice(1);
      return /^5\d{9}$/.test(t) ? '0' + t : null;
    }

    function dogrula() {
      var hatalar = [];
      function kontrol(kosul, id, mesaj, odak, alan) {
        hataGoster(id, kosul ? '' : mesaj, alan);
        if (!kosul) hatalar.push(odak);
      }
      kontrol(!!hizmetSec.value, 'h-hizmet', 'Lütfen bir hizmet seçin.', hizmetSec, hizmetSec);
      kontrol(!!secili('gun'), 'h-gun', 'Lütfen bir gün seçin.', gunler.querySelector('input'));
      kontrol(!!secili('saat'), 'h-saat', 'Lütfen bir saat seçin.', saatler.querySelector('input') || gunler.querySelector('input'));
      var ad = form.elements.ad;
      kontrol(ad.value.trim().length >= 2, 'h-ad', 'Lütfen adınızı yazın.', ad, ad);
      var tel = form.elements.telefon;
      kontrol(!!telefonTemizle(tel.value), 'h-tel', 'Lütfen geçerli bir cep telefonu yazın (05xx xxx xx xx).', tel, tel);
      var kvkk = form.elements.kvkk;
      kontrol(kvkk.checked, 'h-kvkk', 'Devam etmek için aydınlatma metnini onaylayın.', kvkk, kvkk);
      if (hatalar.length) { hatalar[0].focus(); return null; }
      return {
        hizmet: hizmetSec.value,
        tarih: secili('gun'),
        saat: secili('saat'),
        ad: ad.value.trim(),
        telefon: telefonTemizle(tel.value),
        not: form.elements.not.value.trim(),
        tuzak: form.elements.tuzak.value
      };
    }

    function sonucGoster(v) {
      var bas = new Date(v.tarih + 'T' + v.saat + ':00+03:00');
      var bit = new Date(bas.getTime() + (v.sure || 30) * 60000);
      var gcal = function (d) { return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
      document.getElementById('s-hizmet').textContent = v.hizmet;
      document.getElementById('s-gun').textContent = uzunTarih(v.tarih);
      document.getElementById('s-saat').textContent = v.saat;
      document.getElementById('s-kod').textContent = v.kod;
      document.getElementById('s-takvim').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent("Barber Uğur — " + v.hizmet) +
        '&dates=' + gcal(bas) + '/' + gcal(bit) +
        '&details=' + encodeURIComponent('Randevu kodu: ' + v.kod + '\nTel: 0542 825 33 89') +
        '&location=' + encodeURIComponent("Barber Uğur, Gazi Muhtar Paşa Blv. Gazi Apt. No:46/E, Mücahitler, Şehitkamil/Gaziantep");
      document.getElementById('s-wa').href = waUrl('Merhaba, randevu kodum ' + v.kod + ' (' + uzunTarih(v.tarih) + ' ' + v.saat + ', ' + v.hizmet + ').');
      form.hidden = true;
      sonuc.hidden = false;
      sonuc.scrollIntoView({ block: 'start' });
      sonuc.focus({ preventScroll: true });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      durum.textContent = '';
      var v = dogrula();
      if (!v) return;

      if (mod === 'wa') {
        var satirlar = [
          'Merhaba, randevu almak istiyorum.',
          'Ad: ' + v.ad,
          'Telefon: ' + v.telefon,
          'Hizmet: ' + v.hizmet,
          'Gün: ' + uzunTarih(v.tarih),
          'Saat: ' + v.saat
        ];
        if (v.not) satirlar.push('Not: ' + v.not);
        olay('randevu_form_gonder', 'whatsapp');
        durum.textContent = 'WhatsApp açılıyor — mesajı gönderdiğinizde talebiniz bize ulaşır.';
        whatsappAc(satirlar.join('\n'));
        return;
      }

      gonder.disabled = true;
      gonderYazi.textContent = 'Gönderiliyor…';
      fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(v) })
        .then(function (r) { return r.json(); })
        .then(function (c) {
          if (c.ok) {
            olay('randevu_olustu', v.hizmet);
            sonucGoster({ hizmet: c.hizmet || v.hizmet, tarih: c.tarih || v.tarih, saat: c.saat || v.saat, kod: c.kod, sure: c.sure });
          } else if (c.dolu) {
            saatleriYukle();
            hataGoster('h-saat', c.hata);
            saatBilgi.scrollIntoView({ block: 'center' });
          } else {
            durum.textContent = c.hata || 'Randevu alınamadı, lütfen tekrar deneyin.';
          }
        })
        .catch(function () {
          durum.innerHTML = 'Bağlantı hatası oluştu. Tekrar deneyin ya da <a href="' +
            waUrl('Merhaba, ' + uzunTarih(v.tarih) + ' ' + v.saat + ' için ' + v.hizmet + ' randevusu almak istiyorum. Ad: ' + v.ad) +
            '" target="_blank" rel="noopener">WhatsApp\'tan yazın</a>.';
        })
        .then(function () {
          gonder.disabled = false;
          gonderYazi.textContent = 'Randevuyu onayla';
        });
    });

    document.getElementById('yeni-randevu').addEventListener('click', function () {
      form.reset();
      saatleriCiz([]);
      saatBilgi.textContent = 'Önce hizmet ve gün seçin.';
      sonuc.hidden = true;
      form.hidden = false;
      form.scrollIntoView({ block: 'start' });
      hizmetSec.focus({ preventScroll: true });
    });
  }

  /* ───────────── Harita yalnızca kullanıcı isteyince yüklenir ───────────── */
  var harita = document.getElementById('harita');
  var yukle = document.getElementById('harita-yukle');
  if (harita && yukle) {
    yukle.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=37.0753689,37.366534&z=17&hl=tr&output=embed';
      iframe.title = 'Barber Uğur konumu — Google Haritalar';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      harita.appendChild(iframe);
    });
  }
})();
