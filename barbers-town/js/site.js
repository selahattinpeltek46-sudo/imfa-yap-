/* Barber's Town — randevu formu → WhatsApp, tıklayınca yüklenen harita, ölçüm olayları */
(function () {
  'use strict';

  var WHATSAPP = '905357294333';

  // GA4 eklendiğinde (çerez onayından sonra) window.gtag tanımlı olur; o zamana kadar sessizce geçer.
  function olay(ad, yer) {
    if (typeof window.gtag === 'function') window.gtag('event', ad, { konum: yer || '' });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-olay]');
    if (el) olay(el.getAttribute('data-olay'), el.getAttribute('data-yer'));
  });

  // WhatsApp'ı yeni sekmede aç; tarayıcı engellerse aynı sekmede.
  function whatsappAc(metin) {
    var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(metin);
    var pencere = window.open(url, '_blank');
    if (pencere) pencere.opener = null;
    else window.location.href = url;
  }

  // Randevu formu
  var form = document.getElementById('randevu-formu');
  if (form) {
    var gun = form.elements.gun;
    var bugun = new Date();
    bugun.setMinutes(bugun.getMinutes() - bugun.getTimezoneOffset());
    gun.min = bugun.toISOString().slice(0, 10);

    var kurallar = [
      { alan: form.elements.ad, hata: 'h-ad', mesaj: 'Lütfen adınızı yazın.' },
      { alan: form.elements.hizmet, hata: 'h-hizmet', mesaj: 'Lütfen bir hizmet seçin.' },
      { alan: gun, hata: 'h-gun', mesaj: 'Lütfen bugün ya da sonraki bir gün seçin.' }
    ];

    function gecerli(k) {
      var deger = k.alan.value.trim();
      if (!deger) return false;
      if (k.alan === gun && deger < gun.min) return false;
      return true;
    }

    function goster(k, hatali) {
      k.alan.setAttribute('aria-invalid', hatali ? 'true' : 'false');
      document.getElementById(k.hata).textContent = hatali ? k.mesaj : '';
    }

    kurallar.forEach(function (k) {
      k.alan.addEventListener('change', function () { goster(k, !gecerli(k)); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ilkHata = null;
      kurallar.forEach(function (k) {
        var hatali = !gecerli(k);
        goster(k, hatali);
        if (hatali && !ilkHata) ilkHata = k.alan;
      });
      if (ilkHata) { ilkHata.focus(); return; }

      var tarih = new Date(gun.value + 'T12:00:00').toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });
      var satirlar = [
        'Merhaba, randevu almak istiyorum.',
        'Ad: ' + form.elements.ad.value.trim(),
        'Hizmet: ' + form.elements.hizmet.value,
        'Gün: ' + tarih,
        'Saat tercihi: ' + form.elements.saat.value
      ];
      var not = form.elements.not.value.trim();
      if (not) satirlar.push('Not: ' + not);

      olay('randevu_form_gonder', form.elements.hizmet.value);
      document.getElementById('form-durum').textContent = 'WhatsApp açılıyor — mesajı gönderdiğinizde talebiniz bize ulaşır.';
      whatsappAc(satirlar.join('\n'));
    });
  }

  // Harita yalnızca kullanıcı isteyince yüklenir
  var harita = document.getElementById('harita');
  var yukle = document.getElementById('harita-yukle');
  if (harita && yukle) {
    yukle.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=37.0343773,37.3244184&z=17&hl=tr&output=embed';
      iframe.title = "Barber's Town konumu — Google Haritalar";
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      harita.appendChild(iframe);
    });
  }
})();
