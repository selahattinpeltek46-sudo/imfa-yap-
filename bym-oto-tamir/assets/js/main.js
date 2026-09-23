// Giriş noktası — her sayfada yüklenir.
import { CONFIG } from "./config.js";
import { initHeader, initMenu, initReveal, initTimeline, initParallax, initCardGlow, initLightbox, initMap } from "./ui.js";
import { createRepository } from "./booking/repository.js";
import { Availability } from "./booking/availability.js";

const siteRoot = document.documentElement.dataset.root || "";

initHeader();
initMenu();
initReveal();
initTimeline();
initParallax();
initCardGlow();
initLightbox();
initMap();

const repo = createRepository(CONFIG.randevu);

// Randevu sihirbazı (yalnızca ilgili sayfalarda yüklenir)
const mounts = document.querySelectorAll("[data-booking]");
if (mounts.length) {
  const { BookingWizard } = await import("./booking/wizard.js");
  const availability = new Availability(CONFIG.randevu, repo);
  mounts.forEach((el) => new BookingWizard(el, { repo, availability, mode: CONFIG.randevu.mod, siteRoot }));
}

// Yönetim paneli (demo)
const admin = document.querySelector("[data-admin]");
if (admin) {
  const { AdminPanel } = await import("./admin.js");
  new AdminPanel(admin, repo);
}
