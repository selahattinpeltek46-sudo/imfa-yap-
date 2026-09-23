// Giriş noktası — her sayfada yüklenir.
import { CONFIG } from "./config.js";
import { initHeader, initMenu, initReveal, initTimeline, initHeroVideo, initSymptoms, initGallery, initMap } from "./ui.js";

const siteRoot = document.documentElement.dataset.root || "";

initHeader();
initMenu();
initReveal();
initTimeline();
initHeroVideo();
initSymptoms();
initGallery();
initMap();

// Randevu sihirbazı (yalnızca ilgili sayfalarda yüklenir)
const mounts = document.querySelectorAll("[data-booking]");
if (mounts.length) {
  const [{ BookingWizard }, { createRepository }, { Availability }] = await Promise.all([
    import("./booking/wizard.js"),
    import("./booking/repository.js"),
    import("./booking/availability.js"),
  ]);
  const repo = createRepository(CONFIG.randevu);
  const availability = new Availability(CONFIG.randevu, repo);
  mounts.forEach((el) => new BookingWizard(el, { repo, availability, siteRoot }));
}
