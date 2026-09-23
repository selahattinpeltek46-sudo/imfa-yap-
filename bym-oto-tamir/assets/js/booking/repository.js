// Randevu depolama katmanı.
// Sihirbaz ve yönetim paneli yalnızca bu arayüzü kullanır; backend'e geçmek
// için site.json → randevu.mod = "api" ve api_url ayarlamak yeterlidir.
//
// Arayüz:
//   list({ from?, to?, status? })        → Promise<Appointment[]>
//   bookedSlots(date)                    → Promise<string[]>   ("HH:MM")
//   create(appointment)                  → Promise<Appointment>
//   updateStatus(id, status)             → Promise<Appointment>

const KEY = "bym.appointments.v1";

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* gizli sekme / kota — demo modunda sessizce yoksay */
  }
}

export class LocalRepository {
  async list({ from, to, status } = {}) {
    return read()
      .filter((a) => (!from || a.date >= from) && (!to || a.date <= to) && (!status || a.status === status))
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  }

  async bookedSlots(date) {
    return read()
      .filter((a) => a.date === date && a.status !== "cancelled")
      .map((a) => a.time);
  }

  async create(appt) {
    const list = read();
    if (list.some((a) => a.date === appt.date && a.time === appt.time && a.status !== "cancelled")) {
      throw new SlotTakenError();
    }
    list.push(appt);
    write(list);
    return appt;
  }

  async updateStatus(id, status) {
    const list = read();
    const a = list.find((x) => x.id === id);
    if (!a) throw new Error("Randevu bulunamadı");
    a.status = status;
    write(list);
    return a;
  }
}

export class HttpRepository {
  constructor(baseUrl) {
    this.base = baseUrl.replace(/\/$/, "");
  }

  async #req(path, opts = {}) {
    const res = await fetch(this.base + path, {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      ...opts,
    });
    if (res.status === 409) throw new SlotTakenError();
    if (!res.ok) throw new Error(`API hatası: ${res.status}`);
    return res.status === 204 ? null : res.json();
  }

  list(params = {}) {
    const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
    return this.#req(`/appointments?${q}`);
  }

  async bookedSlots(date) {
    const r = await this.#req(`/availability?date=${encodeURIComponent(date)}`);
    return r.booked || [];
  }

  create(appt) {
    return this.#req("/appointments", { method: "POST", body: JSON.stringify(appt) });
  }

  updateStatus(id, status) {
    return this.#req(`/appointments/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ status }) });
  }
}

export class SlotTakenError extends Error {
  constructor() {
    super("Seçilen saat artık müsait değil.");
    this.name = "SlotTakenError";
  }
}

export function createRepository(config) {
  if (config.mod === "api" && config.apiUrl) return new HttpRepository(config.apiUrl);
  return new LocalRepository();
}
