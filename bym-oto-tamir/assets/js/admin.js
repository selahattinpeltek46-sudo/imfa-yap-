// Yönetim paneli önizlemesi — randevu listesi ve durum yönetimi.
// Gerçek panel; müşteriler, araçlar, hizmetler, çalışma saatleri, blog, galeri
// ve yorum modülleriyle aynı repository arayüzü üzerine genişletilecektir.
import { STATUS, STATUS_LABEL, formatDateTR, formatPlate } from "./booking/appointment.js";
import { serviceById } from "./booking/catalog.js";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export class AdminPanel {
  constructor(root, repo) {
    this.root = root;
    this.repo = repo;
    this.filter = "";
    root.addEventListener("click", (e) => {
      const f = e.target.closest("[data-filter]");
      if (f) { this.filter = f.dataset.filter; this.render(); }
    });
    root.addEventListener("change", async (e) => {
      const s = e.target.closest("[data-status]");
      if (s) { await this.repo.updateStatus(s.dataset.status, s.value); this.render(); }
    });
    this.render();
  }

  async render() {
    const list = await this.repo.list({ status: this.filter || undefined });
    const chips = [["", "Tümü"], ...Object.values(STATUS).map((s) => [s, STATUS_LABEL[s]])]
      .map(([v, l]) => `<button type="button" class="chip" data-filter="${v}" aria-pressed="${this.filter === v}">${l}</button>`).join("");
    const rows = list.map((a) => {
      const phone = a.phone.replace(/\D/g, "");
      const opts = Object.values(STATUS).map((s) => `<option value="${s}" ${a.status === s ? "selected" : ""}>${STATUS_LABEL[s]}</option>`).join("");
      return `<tr>
        <td><strong>${esc(formatDateTR(a.date, { day: "numeric", month: "short", weekday: "short" }))}</strong><br>${esc(a.time)}</td>
        <td>${esc(a.name)}<br><a href="tel:${esc(a.phone)}" class="muted">${esc(a.phone)}</a></td>
        <td>${esc(a.brand)} ${esc(a.model)}<br><span class="mono muted">${esc(formatPlate(a.plate))}</span></td>
        <td>${esc(serviceById(a.service)?.name || a.service)}${a.note ? `<br><span class="muted small">${esc(a.note)}</span>` : ""}</td>
        <td><span class="badge badge--${a.status}">${STATUS_LABEL[a.status]}</span><br>
          <label class="sr-only" for="st-${a.id}">Durum</label>
          <select id="st-${a.id}" class="input" data-status="${esc(a.id)}" style="margin-top:8px">${opts}</select></td>
        <td><a class="link-arrow" href="https://wa.me/${phone}" target="_blank" rel="noopener">WhatsApp</a><br><span class="mono muted small">${esc(a.id)}</span></td>
      </tr>`;
    }).join("");
    this.root.innerHTML = `
      <div class="admin__filters" role="group" aria-label="Duruma göre filtrele">${chips}</div>
      ${list.length ? `<div class="admin__wrap"><table class="admin__table">
        <thead><tr><th>Tarih</th><th>Müşteri</th><th>Araç</th><th>Hizmet</th><th>Durum</th><th>İletişim</th></tr></thead>
        <tbody>${rows}</tbody></table></div>`
      : `<div class="admin__empty">Henüz randevu yok. <a class="link-arrow" href="../randevu/">Bir test randevusu oluşturun</a></div>`}`;
  }
}
