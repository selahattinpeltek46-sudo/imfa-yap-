// Arayüz davranışları: header, mobil menü, reveal, timeline, belirti rehberi, galeri, harita.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

export function initHeader() {
  const hdr = document.querySelector("[data-header]");
  const bar = document.querySelector(".actionbar");
  if (!hdr) return;
  let ticking = false;
  const update = () => {
    const y = scrollY;
    hdr.classList.toggle("is-scrolled", y > 24);
    // Mobil aksiyon çubuğu: aşağı kaydırırken görünür, sayfa sonunda footer'ı kapatmasın
    if (bar) {
      const nearEnd = innerHeight + y > document.documentElement.scrollHeight - 40;
      bar.classList.toggle("is-hidden", nearEnd);
    }
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  update();
  // Randevu formu ekrandayken alt çubuğu gizle (form butonlarını örtmesin)
  const booking = document.querySelector("[data-booking]");
  if (bar && booking && "IntersectionObserver" in window) {
    new IntersectionObserver(([en]) => bar.classList.toggle("is-busy", en.isIntersecting), { threshold: 0.15 }).observe(booking);
  }
}

export function initMenu() {
  const btn = document.querySelector("[data-menu-btn]");
  const nav = document.querySelector("[data-nav]");
  if (!btn || !nav) return;
  const set = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    if (open) {
      const hdr = document.querySelector("[data-header]");
      nav.style.setProperty("--nav-top", `${Math.max(0, hdr.getBoundingClientRect().bottom) + 16}px`);
    }
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    if (open) nav.querySelector("a")?.focus({ preventScroll: true });
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { set(false); btn.focus(); }
  });
  matchMedia("(min-width: 1024px)").addEventListener("change", () => set(false));
}

export function initReveal() {
  const els = document.querySelectorAll(".reveal, .step, .g-item");
  if (!("IntersectionObserver" in window) || reduce) {
    document.documentElement.classList.add("no-io");
    els.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}

export function initTimeline() {
  const tl = document.querySelector("[data-timeline]");
  if (!tl) return;
  const update = () => {
    const r = tl.getBoundingClientRect();
    const vh = innerHeight;
    const horizontal = matchMedia("(min-width: 1024px)").matches;
    const p = horizontal
      ? Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.5)))
      : Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
    tl.style.setProperty("--p", p.toFixed(3));
  };
  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  update();
}

// Hareket azaltma tercihinde hero videosunu durdur
export function initHeroVideo() {
  const v = document.querySelector("[data-hero-video]");
  if (v && reduce) v.pause();
}

// "Aracınızda ne var?" — desktop'ta sekme, mobilde akordeon gibi davranır
export function initSymptoms() {
  const root = document.querySelector("[data-sym]");
  if (!root) return;
  const tabs = [...root.querySelectorAll("[data-sym-tab]")];
  const desktop = matchMedia("(min-width: 1024px)");
  // HTML'de tüm paneller açık gelir (JS'siz ortamlar için); JS yalnızca seçili olanı açık bırakır
  tabs.forEach((t) => { document.getElementById(t.getAttribute("aria-controls")).hidden = t.getAttribute("aria-expanded") !== "true"; });
  const open = (tab, focus = false) => {
    const isOpen = tab.getAttribute("aria-expanded") === "true";
    // Mobilde açık olana tekrar dokunmak kapatır; desktop'ta her zaman bir panel açık kalır
    if (isOpen && !desktop.matches) {
      tab.setAttribute("aria-expanded", "false");
      document.getElementById(tab.getAttribute("aria-controls")).hidden = true;
      return;
    }
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-expanded", String(on));
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    if (!desktop.matches) {
      const top = tab.getBoundingClientRect().top;
      const hdr = (document.querySelector("[data-header]")?.offsetHeight || 64) + 8;
      if (top < hdr) scrollTo({ top: scrollY + top - hdr, behavior: reduce ? "auto" : "smooth" });
    }
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => open(tab));
    tab.addEventListener("keydown", (e) => {
      const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!k || !desktop.matches) return;
      e.preventDefault();
      open(tabs[(i + k + tabs.length) % tabs.length], true);
    });
  });
  // Desktop'a geçildiğinde hiçbir panel açık değilse ilkini aç
  desktop.addEventListener("change", () => {
    if (desktop.matches && !tabs.some((t) => t.getAttribute("aria-expanded") === "true")) open(tabs[0]);
  });
}

// BYM Garage: kategori filtresi + lightbox (filtreye göre gezinir)
export function initGallery() {
  const dataEl = document.getElementById("gallery-data");
  if (!dataEl) return;
  const items = JSON.parse(dataEl.textContent);
  const figures = [...document.querySelectorAll("[data-gallery] .g-item")];
  let visible = items.map((_, i) => i);

  document.querySelectorAll("[data-filter]").forEach((chip, _, chips) => {
    chip.addEventListener("click", () => {
      const cat = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      visible = [];
      figures.forEach((f, i) => {
        const show = !cat || f.dataset.cat === cat;
        f.hidden = !show;
        if (show) { visible.push(i); f.classList.add("is-in"); }
      });
    });
  });

  let pos = 0;
  let lastFocus = null;
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Fotoğraf galerisi");
  lb.hidden = true;
  lb.innerHTML = `
    <div class="lb__top"><span data-lb-cap></span>
      <button type="button" class="icon-btn" data-lb-close aria-label="Kapat"><svg class="ic" aria-hidden="true"><use href="#i-x"></use></svg></button></div>
    <div class="lb__stage"><img alt="" data-lb-img></div>
    <div class="lb__nav">
      <button type="button" class="icon-btn" data-lb-prev aria-label="Önceki fotoğraf"><svg class="ic" aria-hidden="true"><use href="#i-chev-l"></use></svg></button>
      <button type="button" class="icon-btn" data-lb-next aria-label="Sonraki fotoğraf"><svg class="ic" aria-hidden="true"><use href="#i-chev-r"></use></svg></button>
    </div>`;
  document.body.append(lb);
  const img = lb.querySelector("[data-lb-img]");
  const cap = lb.querySelector("[data-lb-cap]");
  const show = (p) => {
    pos = (p + visible.length) % visible.length;
    const it = items[visible[pos]];
    img.src = it.src;
    img.alt = it.alt;
    cap.textContent = `${String(pos + 1).padStart(2, "0")} / ${String(visible.length).padStart(2, "0")} · ${it.etiket}`;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    show(Math.max(0, visible.indexOf(i)));
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    lb.querySelector("[data-lb-close]").focus();
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, 300);
    lastFocus?.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.lightbox))));
  lb.querySelector("[data-lb-close]").addEventListener("click", close);
  lb.querySelector("[data-lb-prev]").addEventListener("click", () => show(pos - 1));
  lb.querySelector("[data-lb-next]").addEventListener("click", () => show(pos + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb__stage")) close(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(pos - 1);
    if (e.key === "ArrowRight") show(pos + 1);
    if (e.key === "Tab") {
      const f = [...lb.querySelectorAll("button")];
      const idx = f.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  // Mobilde kaydırarak gezinme
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// Harita yalnızca kullanıcı isteyince yüklenir (performans + gizlilik)
export function initMap() {
  document.querySelectorAll("[data-map]").forEach((box) => {
    box.querySelector("[data-map-load]")?.addEventListener("click", (e) => {
      e.preventDefault();
      const f = document.createElement("iframe");
      f.src = box.dataset.src;
      f.title = "BYM Automotive konumu – Google Haritalar";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.replaceChildren(f);
    });
  });
}
