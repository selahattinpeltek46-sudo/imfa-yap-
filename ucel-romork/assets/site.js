/* Üçel e-katalog V2 — küçük etkileşimler. JavaScript olmadan da sayfalar çalışır. */
(function () {
  // Kullanım alanına göre ürün süzme (ana sayfa)
  var filtreler = document.querySelectorAll('[data-filtre]');
  filtreler.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filtre');
      filtreler.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      document.querySelectorAll('#urunGrid .card').forEach(function (kart) {
        var alanlar = (kart.getAttribute('data-kullanim') || '').split(' ');
        kart.hidden = f !== 'hepsi' && alanlar.indexOf(f) === -1;
      });
    });
  });

  // Ürün galerisi
  document.querySelectorAll('[data-galeri]').forEach(function (g) {
    var ana = g.querySelector('.gallery-img');
    var sayac = g.querySelector('.gallery-count');
    var kucukler = Array.prototype.slice.call(g.querySelectorAll('.thumbs a'));
    if (!kucukler.length) return;
    var aktif = 0;
    function goster(i) {
      aktif = (i + kucukler.length) % kucukler.length;
      var a = kucukler[aktif];
      ana.src = a.getAttribute('href');
      ana.alt = a.getAttribute('data-alt');
      kucukler.forEach(function (k, j) { k.setAttribute('aria-current', String(j === aktif)); });
      if (sayac) sayac.textContent = (aktif + 1) + ' / ' + kucukler.length;
    }
    kucukler.forEach(function (a, i) {
      a.addEventListener('click', function (e) { e.preventDefault(); goster(i); });
    });
    g.querySelector('.prev').addEventListener('click', function () { goster(aktif - 1); });
    g.querySelector('.next').addEventListener('click', function () { goster(aktif + 1); });
    var x = null;
    ana.addEventListener('touchstart', function (e) { x = e.touches[0].clientX; }, { passive: true });
    ana.addEventListener('touchend', function (e) {
      if (x === null) return;
      var fark = e.changedTouches[0].clientX - x;
      if (Math.abs(fark) > 40) goster(aktif + (fark < 0 ? 1 : -1));
      x = null;
    });
  });

  // Teklif formu → hazır WhatsApp mesajı (sunucu yok, veri saklanmaz)
  document.querySelectorAll('[data-teklif]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = function (ad) { return (form.elements[ad].value || '').trim(); };
      var satirlar = [
        'Merhaba, teklif almak istiyorum.',
        'Ürün: ' + form.getAttribute('data-urun') + ' · Adet: ' + (d('adet') || '1'),
      ];
      if (d('traktor')) satirlar.push('Traktör: ' + d('traktor'));
      if (d('yer')) satirlar.push('Yer: ' + d('yer'));
      if (d('not')) satirlar.push('Not: ' + d('not'));
      satirlar.push(form.getAttribute('data-link'));
      var url = 'https://wa.me/' + form.getAttribute('data-wa') + '?text=' + encodeURIComponent(satirlar.join('\n'));
      location.href = url;
    });
  });
})();
