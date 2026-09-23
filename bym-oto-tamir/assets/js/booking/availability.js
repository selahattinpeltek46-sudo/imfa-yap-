// Müsaitlik kuralları: kapalı günler, tatiller, geçmiş saatler (ve backend varsa dolu saatler).
// Saatler ve kapalı günler _build/site.json → randevu (saatler, kapali_gunler, tatiller) alanından gelir.
import { toISODate, fromISODate } from "./appointment.js";

export class Availability {
  constructor(config, repo) {
    this.slots = config.saatler;
    this.closedDays = new Set(config.kapaliGunler);
    this.holidays = new Set(config.tatiller || []);
    this.maxDays = config.ileriGunLimiti || 45;
    this.repo = repo;
    // Aynı gün randevularında en az bu kadar dakika sonrası seçilebilir
    this.leadMinutes = 60;
  }

  today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  lastDay() {
    const d = this.today();
    d.setDate(d.getDate() + this.maxDays);
    return d;
  }

  isDateOpen(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (d < this.today() || d > this.lastDay()) return false;
    if (this.closedDays.has(d.getDay())) return false;
    if (this.holidays.has(toISODate(d))) return false;
    // Bugün için hiç uygun saat kalmadıysa kapat
    if (+d === +this.today()) return this._futureSlots(toISODate(d)).length > 0;
    return true;
  }

  _futureSlots(iso) {
    const now = new Date();
    const isToday = iso === toISODate(now);
    if (!isToday) return this.slots;
    const limit = now.getHours() * 60 + now.getMinutes() + this.leadMinutes;
    return this.slots.filter((t) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m >= limit;
    });
  }

  /** @returns {Promise<{time:string, available:boolean}[]>} */
  async slotsFor(iso) {
    if (!this.isDateOpen(fromISODate(iso))) return this.slots.map((time) => ({ time, available: false }));
    const future = new Set(this._futureSlots(iso));
    let booked = [];
    if (this.repo) {
      try {
        booked = await this.repo.bookedSlots(iso);
      } catch (e) {
        booked = [];
      }
    }
    const taken = new Set(booked);
    return this.slots.map((time) => ({ time, available: future.has(time) && !taken.has(time) }));
  }
}
