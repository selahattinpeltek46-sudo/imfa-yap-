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

// Randevu sihirbazı (yalnızca ilgili sayfalarda yüklenir).
// Yüklenemezse (ağ hatası, çok eski tarayıcı) boş kutu yerine telefon/WhatsApp yedeği gösterilir.
const mounts = document.querySelectorAll("[data-booking]");
if (mounts.length) {
  const showFallback = () => mounts.forEach((el) => el.classList.add("is-failed"));
  const deps = [import("./booking/wizard.js"), import("./booking/availability.js")];
  // Backend yalnızca site.json → randevu.mod = "api" iken yüklenir; aksi halde veri hiçbir yere kaydedilmez.
  if (CONFIG.randevu.mod === "api" && CONFIG.randevu.apiUrl) deps.push(import("./booking/repository.js"));
  Promise.all(deps)
    .then(([{ BookingWizard }, { Availability }, repoMod]) => {
      const repo = repoMod ? repoMod.createRepository(CONFIG.randevu) : null;
      const availability = new Availability(CONFIG.randevu, repo);
      mounts.forEach((el) => {
        try {
          new BookingWizard(el, { repo, availability, siteRoot });
          el.classList.add("is-ready");
        } catch (err) {
          console.warn("Randevu formu başlatılamadı:", err);
          el.classList.add("is-failed");
        }
      });
    })
    .catch((err) => {
      console.warn("Randevu formu yüklenemedi:", err);
      showFallback();
    });
}
