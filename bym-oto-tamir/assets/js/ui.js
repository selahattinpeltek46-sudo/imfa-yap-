// Arayüz davranışları: header, mobil menü, reveal, timeline, parallax, lightbox, harita.
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

export function initParallax() {
  const el = document.querySelector("[data-parallax]");
  if (!el || reduce) return;
  const update = () => {
    const y = scrollY;
    if (y > innerHeight) return;
    el.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
  };
  addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  // Hareket azaltma tercihinde hero videosunu durdur
  const v = document.querySelector("[data-hero-video]");
  if (v && reduce) v.pause();
}

export function initCardGlow() {
  document.querySelectorAll(".svc").forEach((c) => {
    c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", `${e.clientX - r.left}px`);
      c.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

export function initLightbox() {
  const dataEl = document.getElementById("gallery-data");
  if (!dataEl) return;
  const items = JSON.parse(dataEl.textContent);
  let i = 0;
  let lastFocus = null;
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Fotoğraf galerisi");
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
  const show = (n) => {
    i = (n + items.length) % items.length;
    img.src = items[i].src;
    img.alt = items[i].alt;
    cap.textContent = `${String(i + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")} · ${items[i].etiket}`;
  };
  const open = (n) => {
    lastFocus = document.activeElement;
    show(n);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lb.querySelector("[data-lb-close]").focus();
  };
  const close = () => {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    lastFocus?.focus();
  };
  document.querySelectorAll("[data-lightbox]").forEach((b) => b.addEventListener("click", () => open(Number(b.dataset.lightbox))));
  lb.querySelector("[data-lb-close]").addEventListener("click", close);
  lb.querySelector("[data-lb-prev]").addEventListener("click", () => show(i - 1));
  lb.querySelector("[data-lb-next]").addEventListener("click", () => show(i + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb__stage")) close(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(i - 1);
    if (e.key === "ArrowRight") show(i + 1);
    if (e.key === "Tab") {
      const f = [...lb.querySelectorAll("button")];
      const idx = f.indexOf(document.activeElement);
      if (e.shiftKey && idx <= 0) { e.preventDefault(); f.at(-1).focus(); }
      else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }
  });
  // Mobilde kaydırma
  let x0 = null;
  lb.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

// Harita yalnızca kullanıcı isteyince yüklenir (performans + gizlilik)
export function initMap() {
  document.querySelectorAll("[data-map]").forEach((box) => {
    box.querySelector("[data-map-load]")?.addEventListener("click", () => {
      const f = document.createElement("iframe");
      f.src = box.dataset.src;
      f.title = "BYM Automotive konumu – Google Haritalar";
      f.loading = "lazy";
      f.referrerPolicy = "no-referrer-when-downgrade";
      box.replaceChildren(f);
    });
  });
}
