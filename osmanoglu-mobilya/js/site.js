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

  // etiketler fotoğraftaki noktaya bağlı: object-fit: cover kırpmasını hesaba kat
  function etiketYerlestir() {
    document.querySelectorAll(".slayt").forEach(function (sl) {
      var im = sl.querySelector("img"), W = sl.clientWidth, H = sl.clientHeight;
      var iw = +im.getAttribute("width"), ih = +im.getAttribute("height");
      if (!W || !H) return;
      var o = Math.max(W / iw, H / ih), ox = (W - iw * o) / 2, oy = (H - ih * o) / 2;
      sl.querySelectorAll(".etiket").forEach(function (et) {
        var x = ox + et.getAttribute("data-x") / 100 * iw * o, y = oy + et.getAttribute("data-y") / 100 * ih * o;
        et.style.left = x + "px"; et.style.top = y + "px";
        et.classList.toggle("disarida", x < 12 || x > W - 12 || y < 40 || y > H - 96);
      });
    });
  }
  etiketYerlestir();
  window.addEventListener("resize", etiketYerlestir);

  // hero sahnesi: fotoğraf çekmece gibi açılır, etiketler sırayla gelir; karartma / bulanıklık yok
  document.querySelectorAll("[data-sahne]").forEach(function (sahne) {
    var slaytlar = [].slice.call(sahne.querySelectorAll(".slayt"));
    var dugmeler = [].slice.call(sahne.querySelectorAll("[data-git]"));
    var dur = sahne.querySelector("[data-dur]"), ad = sahne.querySelector("[data-ad]");
    var SURE = 7000, simdi = 0, zaman = null, durdu = azHareket || !sahne.hasAttribute("data-oto");
    sahne.style.setProperty("--sure", SURE + "ms");

    function goster(i) {
      if (i === simdi) return;
      var eski = slaytlar[simdi], yeni = slaytlar[i];
      var im = yeni.querySelector("img");
      if (im.loading === "lazy") im.loading = "eager";
      eski.classList.remove("aktif"); eski.classList.add("onceki"); eski.setAttribute("aria-hidden", "true");
      yeni.classList.add("aktif"); yeni.removeAttribute("aria-hidden");
      setTimeout(function () { eski.classList.remove("onceki"); }, 1300);
      dugmeler.forEach(function (d, j) { d.classList.toggle("aktif", j === i); });
      ad.textContent = yeni.getAttribute("data-baslik");
      simdi = i;
      kur();
    }
    function kur() {
      clearTimeout(zaman);
      // ilerleme çubuğunu baştan başlat
      dugmeler.forEach(function (d) { d.classList.remove("akiyor"); });
      if (durdu) return;
      void sahne.offsetWidth;
      dugmeler[simdi].classList.add("akiyor");
      zaman = setTimeout(function () { goster((simdi + 1) % slaytlar.length); }, SURE);
    }
    dugmeler.forEach(function (d) {
      d.addEventListener("click", function () { goster(+d.getAttribute("data-git")); });
    });
    dur.addEventListener("click", function () {
      durdu = !durdu;
      dur.setAttribute("aria-pressed", durdu ? "true" : "false");
      dur.textContent = durdu ? "Oynat" : "Durdur";
      sahne.classList.toggle("durdu", durdu);
      kur();
    });
    if (durdu) { dur.setAttribute("aria-pressed", "true"); dur.textContent = "Oynat"; sahne.classList.add("durdu"); }
    // sekme görünmezken zamanlayıcı boşa dönmesin
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearTimeout(zaman); else kur(); });
    kur();
  });

  // ekrana girince beliren bölümler
  var gozcu = "IntersectionObserver" in window && !azHareket ? new IntersectionObserver(function (girdiler) {
    girdiler.forEach(function (g) { if (g.isIntersecting) { g.target.classList.add("gorundu"); gozcu.unobserve(g.target); } });
  }, { rootMargin: "0px 0px -12% 0px" }) : null;
  document.querySelectorAll(".is, .detay, .yorum, .adim-liste li, .karavan").forEach(function (el) {
    if (gozcu) { el.classList.add("beklet"); gozcu.observe(el); }
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
