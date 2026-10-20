(function () {
  "use strict";
  var A = window.AYTAC || {};
  var wa = String(A.whatsapp || "").replace(/\D/g, "");
  var tel = String(A.telefon || "").trim();
  var igKullanici = A.instagram || "aytac_mobilya";
  var IG_DM = "https://ig.me/m/" + igKullanici;
  window.dataLayer = window.dataLayer || [];

  function olay(ad, veri) {
    var o = { event: ad };
    for (var k in veri || {}) o[k] = veri[k];
    window.dataLayer.push(o);
  }

  // ---- üst çubuk: girişin üstünde şeffaf, kaydırınca dolu
  var ust = document.querySelector(".ust");
  var menuDugme = document.querySelector(".menu-dugme");
  var menu = document.getElementById("menu");
  if (ust && ust.classList.contains("ust--seffaf")) {
    var boya = function () { ust.classList.toggle("dolu", window.scrollY > 40 || (menu && menu.classList.contains("acik"))); };
    window.addEventListener("scroll", boya, { passive: true });
    boya();
  }

  // ---- menü
  if (menuDugme && menu) {
    menuDugme.addEventListener("click", function () {
      var acik = menu.classList.toggle("acik");
      menuDugme.setAttribute("aria-expanded", acik ? "true" : "false");
      ust.classList.toggle("menu-acik", acik);
      if (ust.classList.contains("ust--seffaf")) ust.classList.toggle("dolu", acik || window.scrollY > 40);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { menu.classList.remove("acik"); ust.classList.remove("menu-acik"); menuDugme.setAttribute("aria-expanded", "false"); }
    });
  }

  // ---- telefon satırları yalnız numara varsa görünür
  if (tel) {
    var telHref = "tel:+" + (wa || tel.replace(/\D/g, "").replace(/^0/, "90"));
    document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = telHref; a.textContent = "Ara · " + tel; });
    document.querySelectorAll("[data-tel-satiri]").forEach(function (el) { el.hidden = false; });
  }

  // ---- tıklama olayları (GA4 eklenince dataLayer'dan okunur)
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-olay]");
    if (a && !a.hasAttribute("data-gonder")) olay(a.getAttribute("data-olay"), { sayfa: location.pathname });
  });

  // ---- mesaj hazırlayıcı
  var form = document.querySelector("[data-hazirlayici]");
  if (form) {
    var onizleme = form.querySelector("[data-onizleme]");
    var gonder = form.querySelector("[data-gonder]");
    var durum = form.querySelector("[data-durum]");
    var kanalAdi = form.querySelector("[data-kanal-adi]");
    gonder.textContent = wa ? "WhatsApp'tan gönder" : "Mesajı kopyala, Instagram'da gönder";
    if (kanalAdi) kanalAdi.textContent = wa ? "WhatsApp" : "Instagram";

    var metin = function () {
      var turler = [].map.call(form.querySelectorAll("input[name=tur]:checked"), function (i) { return i.value; });
      var semt = form.semt.value.trim();
      var not = form.not.value.trim();
      var s = "Merhaba Aytaç Mobilya, " + (turler.length ? turler.join(", ") + " için" : "özel ölçü bir iş için") + " bilgi almak istiyorum.";
      if (semt) s += "\nSemt: " + semt + ".";
      if (not) s += "\n" + not;
      s += "\nOdanın fotoğraflarını bu mesajın ardından gönderiyorum.";
      return s;
    };
    var yenile = function () {
      var m = metin();
      onizleme.textContent = m;
      gonder.href = wa ? "https://wa.me/" + wa + "?text=" + encodeURIComponent(m) : IG_DM;
    };
    form.addEventListener("input", yenile);
    form.addEventListener("change", yenile);
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    yenile();

    gonder.addEventListener("click", function () {
      var m = metin();
      var turler = [].map.call(form.querySelectorAll("input[name=tur]:checked"), function (i) { return i.value; }).join(", ");
      olay(wa ? "whatsapp_tikla" : "instagram_tikla", { kaynak: "mesaj_hazirla", is_turu: turler, sayfa: location.pathname });
      if (!wa) {
        // Instagram mesajı önceden doldurulamaz: metni panoya kopyala, sohbet açılınca yapıştırılsın.
        var bitti = function () { durum.textContent = "Mesaj kopyalandı — Instagram'da yapıştırın."; };
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(m).then(bitti, function () {});
        } catch (err) { /* kopyalanamazsa yalnız Instagram açılır */ }
      }
    });

    // "Yeni evim için yazın", "Bu iş için yazın" gibi bağlantılar mesajı önceden doldurur
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-not], a[data-tur]");
      if (!a) return;
      if (a.hasAttribute("data-not")) form.not.value = a.getAttribute("data-not");
      if (a.hasAttribute("data-tur")) {
        var v = a.getAttribute("data-tur");
        form.querySelectorAll("input[name=tur]").forEach(function (i) { if (i.value === v) i.checked = true; });
      }
      yenile();
      olay("mesaja_git", { kaynak: a.textContent.trim(), sayfa: location.pathname });
    });

    // galeriden "bu fotoğraftaki gibi" isteği
    window.aytacNotEkle = function (yazi) {
      form.not.value = yazi;
      yenile();
      document.getElementById("mesaj").scrollIntoView();
      form.not.focus({ preventScroll: true });
    };
  }

  // ---- mobil sabit düğme: sayfadaki ilk düğmeler kaydırılınca görünür, mesaj bölümünde gizlenir
  var yapiskan = document.querySelector(".yapiskan");
  var mesaj = document.getElementById("mesaj");
  var ilkEylem = document.querySelector(".eylemler");
  if (yapiskan && mesaj && "IntersectionObserver" in window) {
    new IntersectionObserver(function (g) {
      yapiskan.classList.toggle("gizli", g[0].isIntersecting);
    }, { rootMargin: "0px 0px -20% 0px" }).observe(mesaj);
    if (ilkEylem) {
      new IntersectionObserver(function (g) {
        yapiskan.classList.toggle("goster", !g[0].isIntersecting && g[0].boundingClientRect.top < 0);
      }).observe(ilkEylem);
    } else yapiskan.classList.add("goster");
  } else if (yapiskan) yapiskan.classList.add("goster");

  // ---- galeri: süzgeç + büyük görünüm
  var suzgec = document.querySelector(".suzgec");
  if (suzgec) {
    var ogeler = document.querySelectorAll(".izgara--galeri li");
    var sayi = document.querySelector("[data-sayi]");
    var suz = function (tur) {
      var n = 0;
      ogeler.forEach(function (li) {
        var gor = tur === "hepsi" || li.getAttribute("data-tur") === tur;
        li.hidden = !gor;
        if (gor) n++;
      });
      suzgec.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-suz") === tur ? "true" : "false"); });
      sayi.textContent = n + " fotoğraf";
    };
    suzgec.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-suz]");
      if (!b) return;
      var t = b.getAttribute("data-suz");
      suz(t);
      history.replaceState(null, "", t === "hepsi" ? location.pathname : "#" + t);
    });
    var hashSuz = function () {
      var t = location.hash.slice(1);
      if (t && suzgec.querySelector('[data-suz="' + t + '"]')) suz(t);
    };
    window.addEventListener("hashchange", hashSuz);
    hashSuz();

    var dlg = document.querySelector("[data-buyuk]");
    var dImg = dlg.querySelector("[data-buyuk-img]");
    var dAlt = dlg.querySelector("[data-buyuk-alt]");
    var secili = "";
    document.querySelector(".izgara--galeri").addEventListener("click", function (e) {
      var b = e.target.closest("[data-buyut]");
      if (!b) return;
      var im = b.querySelector("img");
      secili = b.getAttribute("data-buyut");
      dImg.src = im.currentSrc || im.src;
      dImg.alt = im.alt;
      dAlt.textContent = im.alt;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.querySelector("[data-benzeri]").addEventListener("click", function () {
      olay("galeri_benzerini_iste", { foto: secili });
      dlg.close();
      if (window.aytacNotEkle) window.aytacNotEkle("Sitenizdeki \"" + dAlt.textContent + "\" fotoğrafındaki gibi bir iş istiyorum (" + secili + ").");
    });
  }
})();
