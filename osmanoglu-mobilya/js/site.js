(function () {
  "use strict";
  var A = window.OSMANOGLU || {};
  var azHareket = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.dataLayer = window.dataLayer || [];
  function olay(ad, veri) { var o = { event: ad }; for (var k in veri || {}) o[k] = veri[k]; window.dataLayer.push(o); }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-olay]");
    if (a) olay(a.getAttribute("data-olay"), { sayfa: location.pathname });
  });

  // numara ayarlar.js'ten: her bağlantı kendi hazır mesajını korur
  function waLink(metin) { return "https://wa.me/" + (A.whatsapp || "") + "?text=" + encodeURIComponent(metin); }
  if (A.whatsapp) document.querySelectorAll("a[href^='https://wa.me/']").forEach(function (a) {
    a.href = a.href.replace(/^https:\/\/wa\.me\/\d+/, "https://wa.me/" + A.whatsapp);
  });

  // menü
  var dugme = document.querySelector(".menu-dugme"), menu = document.getElementById("menu");
  function kapat() { menu.classList.remove("acik"); dugme.setAttribute("aria-expanded", "false"); }
  if (dugme && menu) {
    dugme.addEventListener("click", function () {
      var acik = menu.classList.toggle("acik");
      dugme.setAttribute("aria-expanded", acik ? "true" : "false");
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) kapat(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("acik")) { kapat(); dugme.focus(); }
    });
  }

  // hero mozaiği: sütunlar CSS ile kayar; Durdur düğmesi (WCAG 2.2.2) ve az hareket tercihi
  document.querySelectorAll("[data-mozaik]").forEach(function (m) {
    var dur = m.querySelector("[data-dur]");
    function ayarla(durdu) {
      m.classList.toggle("durdu", durdu);
      dur.setAttribute("aria-pressed", durdu ? "true" : "false");
      dur.textContent = durdu ? "Oynat" : "Durdur";
    }
    ayarla(azHareket);
    dur.addEventListener("click", function () { ayarla(!m.classList.contains("durdu")); olay("mozaik_dur"); });
  });

  // ekrana girince beliren bölümler
  var gozcu = "IntersectionObserver" in window && !azHareket ? new IntersectionObserver(function (girdiler) {
    girdiler.forEach(function (g) { if (g.isIntersecting) { g.target.classList.add("gorundu"); g.target.classList.remove("beklet"); gozcu.unobserve(g.target); } });
  }, { rootMargin: "0px 0px -12% 0px" }) : null;
  document.querySelectorAll(".r, .karavan").forEach(function (el) {
    if (!gozcu) return;
    if (!el.classList.contains("karavan")) el.classList.add("beklet");
    gozcu.observe(el);
  });

  // mesaj hazırlayıcı: veri toplanmaz, yalnız WhatsApp metni oluşturulur
  document.querySelectorAll("[data-hazirla]").forEach(function (form) {
    var onizleme = form.querySelector("[data-onizleme]"), wa = form.querySelector("[data-wa]"), kopyala = form.querySelector("[data-kopyala]");
    function deger(ad) { var s = form.querySelector('[name="' + ad + '"]:checked'); return s ? s.value : ""; }
    function temiz(s) { return (s || "").replace(/\s+/g, " ").trim(); }
    function metin() {
      var tur = deger("tur"), ilce = temiz(form.ilce.value), olcu = temiz(form.olcu.value);
      var m = "Merhaba, " + (tur ? tur.toLocaleLowerCase("tr") + " için " : "") + "bilgi almak istiyorum.";
      if (ilce) m += "\nSemt / ilçe: " + ilce;
      if (olcu) m += "\nKaba ölçü: " + olcu;
      if (form.foto.checked) m += "\nAlanın fotoğraflarını bu mesajın ardından gönderiyorum.";
      return m;
    }
    function guncelle() { var m = metin(); onizleme.textContent = m; wa.href = waLink(m); }
    form.addEventListener("input", guncelle);
    form.addEventListener("change", guncelle);
    form.addEventListener("submit", function (e) { e.preventDefault(); wa.click(); });
    kopyala.addEventListener("click", function () {
      var m = metin(), eski = kopyala.textContent;
      function tamam() { kopyala.textContent = "Kopyalandı"; olay("mesaj_kopyala"); setTimeout(function () { kopyala.textContent = eski; }, 2000); }
      if (navigator.clipboard) navigator.clipboard.writeText(m).then(tamam, function () {});
    });
    guncelle();
  });

  // harita: tıklayınca yükle (öncesinde Google'a istek gitmez)
  document.querySelectorAll("[data-harita]").forEach(function (kutu) {
    var b = kutu.querySelector("button");
    b.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = kutu.getAttribute("data-harita"); f.title = "Osmanoğlu Mobilya konumu, Google Haritalar";
      f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      kutu.classList.add("yuklendi");
      kutu.appendChild(f); b.remove();
      olay("harita_yukle");
    });
  });
})();
