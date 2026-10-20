(function () {
  "use strict";
  var A = window.SEKER || {};
  window.dataLayer = window.dataLayer || [];
  function olay(ad, veri) { var o = { event: ad }; for (var k in veri || {}) o[k] = veri[k]; window.dataLayer.push(o); }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-olay]");
    if (a) olay(a.getAttribute("data-olay"), { sayfa: location.pathname });
  });

  // menü
  var dugme = document.querySelector(".menu-dugme"), menu = document.getElementById("menu");
  if (dugme && menu) {
    dugme.addEventListener("click", function () {
      var acik = menu.classList.toggle("acik");
      dugme.setAttribute("aria-expanded", acik ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { menu.classList.remove("acik"); dugme.setAttribute("aria-expanded", "false"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("acik")) { menu.classList.remove("acik"); dugme.setAttribute("aria-expanded", "false"); dugme.focus(); }
    });
  }

  function waLink(metin) { return "https://wa.me/" + (A.whatsapp || "") + "?text=" + encodeURIComponent(metin); }
  document.querySelectorAll("[data-wa-sabit]").forEach(function (a) { a.href = waLink("Merhaba, bilgi almak istiyorum."); });

  // mesaj hazırlayıcı: veri toplanmaz, yalnız WhatsApp metni oluşturulur
  document.querySelectorAll("[data-hazirla]").forEach(function (form) {
    var onizleme = form.querySelector("[data-onizleme]"), wa = form.querySelector("[data-wa]"), kopyala = form.querySelector("[data-kopyala]");
    function deger(ad) { var s = form.querySelector('[name="' + ad + '"]:checked'); return s ? s.value : ""; }
    function temiz(s) { return (s || "").replace(/\s+/g, " ").trim(); }
    function metin() {
      var tur = deger("tur"), kapsam = deger("kapsam"), ilce = temiz(form.ilce.value), olcu = temiz(form.olcu.value);
      var m = "Merhaba, " + (tur ? tur.toLocaleLowerCase("tr") + " için" : "") + (tur ? " " : "") + "bilgi almak istiyorum.";
      if (kapsam) m += "\nKapsam: " + kapsam;
      if (ilce) m += "\nSemt / ilçe: " + ilce;
      if (olcu) m += "\nKaba ölçü: " + olcu;
      if (form.foto.checked) m += "\nFotoğrafları bu mesajın ardından gönderiyorum.";
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

  // ikinci adres (teyit edilince ayarlar.js'ten)
  if (A.ikinciAdres) document.querySelectorAll("[data-ikinci-adres]").forEach(function (p) { p.textContent = A.ikinciAdres; p.hidden = false; });

  // harita: tıklayınca yükle (öncesinde Google'a istek gitmez)
  document.querySelectorAll("[data-harita]").forEach(function (kutu) {
    var b = kutu.querySelector("button");
    b.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = kutu.getAttribute("data-harita"); f.title = "Şeker Mobilya konumu, Google Haritalar";
      f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      kutu.appendChild(f); b.remove();
    });
  });

  // galeri süzgeci (#tür ile de çalışır)
  var galeri = document.querySelector("[data-galeri]");
  if (galeri) {
    var butonlar = document.querySelectorAll("[data-filtre]"), sayac = document.querySelector("[data-sayac]");
    var gecerli = Array.prototype.map.call(butonlar, function (b) { return b.getAttribute("data-filtre"); });
    function suz(t) {
      if (gecerli.indexOf(t) < 0) t = "hepsi";
      var n = 0;
      galeri.querySelectorAll(".kare").forEach(function (k) { var g = t === "hepsi" || k.getAttribute("data-tur") === t; k.hidden = !g; if (g) n++; });
      butonlar.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-filtre") === t ? "true" : "false"); });
      if (sayac) sayac.textContent = n + " kare";
    }
    butonlar.forEach(function (b) {
      b.addEventListener("click", function () {
        var t = b.getAttribute("data-filtre");
        history.replaceState(null, "", t === "hepsi" ? location.pathname : "#" + t);
        suz(t); olay("galeri_suz", { tur: t });
      });
    });
    window.addEventListener("hashchange", function () { suz(location.hash.slice(1)); });
    suz(location.hash.slice(1));
  }
})();
