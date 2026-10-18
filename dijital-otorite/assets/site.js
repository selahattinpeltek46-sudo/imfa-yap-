(function () {
  var WA = '905393009565';

  // İşler: telefon görüntüsü ekrana girince bir kez "röntgen taraması"
  var isler = document.querySelectorAll('.is');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (girdiler) {
      girdiler.forEach(function (g) {
        if (g.isIntersecting) { g.target.classList.add('taraniyor'); io.unobserve(g.target); }
      });
    }, { threshold: 0.5 });
    isler.forEach(function (el) { io.observe(el); });
  }

  // Ölçüm kancası: data-olay işaretli tıklamalar (GA4 / n8n bağlanınca buradan gönderilir)
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-olay]');
    if (el && window.dataLayer) window.dataLayer.push({ event: el.getAttribute('data-olay') });
  });

  // Dijital Röntgen formu → WhatsApp hazır mesaj
  var form = document.getElementById('rontgen-form');
  if (!form) return;
  function hata(id, mesaj) {
    var alan = document.getElementById('f-' + id), kutu = document.getElementById('h-' + id);
    if (mesaj) { kutu.textContent = mesaj; kutu.hidden = false; alan.setAttribute('aria-invalid', 'true'); }
    else { kutu.hidden = true; alan.removeAttribute('aria-invalid'); }
    return !mesaj;
  }
  function deger(id) { return document.getElementById('f-' + id).value.trim(); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var tamam = [
      hata('ad', deger('ad') ? '' : 'Adını yaz.'),
      hata('isletme', deger('isletme') ? '' : 'İşletmenin adını yaz.'),
      hata('sektor', deger('sektor') ? '' : 'Ne iş yaptığını seç.'),
      hata('kvkk', document.getElementById('f-kvkk').checked ? '' : 'Devam etmek için KVKK metnini onayla.')
    ].every(Boolean);
    if (!tamam) { var ilk = form.querySelector('[aria-invalid="true"]'); if (ilk) ilk.focus(); return; }
    var satirlar = [
      'RÖNTGEN başvurusu',
      'Ad: ' + deger('ad'),
      'İşletme: ' + deger('isletme'),
      'Sektör: ' + deger('sektor'),
      deger('yer') ? 'Yer: ' + deger('yer') : '',
      deger('link') ? 'Link: ' + deger('link') : '',
      'İstek: ' + deger('istek')
    ].filter(Boolean);
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(satirlar.join('\n'));
    var win = window.open(url, '_blank');
    if (win) { win.opener = null; } else { window.location.href = url; }
    var sonuc = document.getElementById('form-sonuc');
    sonuc.textContent = 'WhatsApp açıldı. Mesajı gönderdiğinde en kısa sürede dönüyorum.';
    sonuc.hidden = false;
  });
})();
