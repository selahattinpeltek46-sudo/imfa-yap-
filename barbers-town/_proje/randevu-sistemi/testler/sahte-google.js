// Code.gs'yi gerçek Google servislerinin sahteleriyle bir vm bağlamında çalıştırır.
const vm = require('vm');
const fs = require('fs');
const KOD = require('path').join(__dirname, '..', 'Code.gs');

function yukle() {
  const kayit = { epostalar: [], tetikleyiciler: [], log: [], kota: 100 };
  let sayac = 0;
  const kes = v => (typeof v === 'string' && v.startsWith("'")) ? v.slice(1) : v;

  class Etkinlik {
    constructor(takvim, baslik, bas, bit, aciklama, tumGun) {
      Object.assign(this, { takvim, baslik, bas: new Date(bas), bit: new Date(bit), aciklama: aciklama || '', tumGun: !!tumGun,
        etiket: {}, olusturma: new Date(), hatirlaticilar: [], id: 'ev' + (++sayac) + '@google.com' });
    }
    getId() { return this.id; }
    getTitle() { return this.baslik; }
    getDescription() { return this.aciklama; }
    getStartTime() { return new Date(this.bas); }
    getEndTime() { return new Date(this.bit); }
    isAllDayEvent() { return this.tumGun; }
    getTag(k) { return k in this.etiket ? this.etiket[k] : null; }
    setTag(k, v) { this.etiket[k] = String(v); return this; }
    deleteTag(k) { delete this.etiket[k]; return this; }
    setTime(b, e) { this.bas = new Date(b); this.bit = new Date(e); return this; }
    deleteEvent() { this.takvim.olaylar = this.takvim.olaylar.filter(x => x !== this); }
    getDateCreated() { return new Date(this.olusturma); }
    removeAllReminders() { this.hatirlaticilar = []; return this; }
    addPopupReminder(dk) { this.hatirlaticilar.push(dk); return this; }
  }
  class Takvim {
    constructor(ad) { this.ad = ad; this.olaylar = []; this.id = 'takvim' + (++sayac); }
    getId() { return this.id; }
    getEvents(b, e) {
      return this.olaylar.filter(x => x.bas < e && x.bit > b).sort((a, c) => a.bas - c.bas);
    }
    createEvent(t, b, e, o) { const x = new Etkinlik(this, t, b, e, o && o.description); this.olaylar.push(x); return x; }
    createAllDayEvent(t, gun) { const x = new Etkinlik(this, t, gun, new Date(+gun + 864e5), '', true); this.olaylar.push(x); return x; }
    getEventById(id) { return this.olaylar.find(x => x.id === id) || null; }
  }
  const takvimler = {};
  class Sayfa {
    constructor() { this.satirlar = []; }
    appendRow(a) { this.satirlar.push(a.map(kes)); }
    getLastRow() { return this.satirlar.length; }
    setFrozenRows() {}
    getRange(r, c, nr = 1, nc = 1) {
      const s = this;
      return {
        getValues() { const o = []; for (let i = 0; i < nr; i++) { const sat = []; for (let j = 0; j < nc; j++) sat.push((s.satirlar[r - 1 + i] || [])[c - 1 + j] ?? ''); o.push(sat); } return o; },
        setValue(v) { s.satirlar[r - 1][c - 1] = kes(v); }
      };
    }
  }
  const tablolar = {};
  const ozellikler = {};
  const onbellek = {};

  function formatDate(d, tz, bicim) {
    const t = new Date(d.getTime() + 3 * 36e5); // Europe/Istanbul = UTC+3
    const p = n => String(n).padStart(2, '0');
    return bicim.replace('yyyy', t.getUTCFullYear()).replace('MM', p(t.getUTCMonth() + 1)).replace('dd', p(t.getUTCDate()))
      .replace('HH', p(t.getUTCHours())).replace('mm', p(t.getUTCMinutes())).replace(/\bd\b/, t.getUTCDate());
  }

  const baglam = {
    console, Date, Math, JSON, String, Number, Object, RegExp, Infinity, encodeURIComponent,
    module: undefined,
    CalendarApp: {
      Color: { YELLOW: 'y' },
      createCalendar(ad) { const t = new Takvim(ad); takvimler[t.id] = t; return t; },
      getCalendarById(id) { return takvimler[id]; }
    },
    SpreadsheetApp: {
      create(ad) { const id = 'tablo' + (++sayac); const sayfa = new Sayfa(); tablolar[id] = { getSheets: () => [sayfa], getId: () => id, getSpreadsheetTimeZone: () => 'Europe/Istanbul', sayfa }; return tablolar[id]; },
      openById(id) { return tablolar[id]; }
    },
    PropertiesService: { getScriptProperties: () => ({ getProperty: k => ozellikler[k] ?? null, setProperty: (k, v) => { ozellikler[k] = v; } }) },
    CacheService: { getScriptCache: () => ({ get: k => onbellek[k] ?? null, put: (k, v) => { onbellek[k] = v; } }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    MailApp: { sendEmail: (kime, konu, govde) => { kayit.kota--; kayit.epostalar.push({ kime, konu, govde }); }, getRemainingDailyQuota: () => kayit.kota },
    Session: { getEffectiveUser: () => ({ getEmail: () => 'salon@example.com' }) },
    Utilities: { formatDate },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ s, setMimeType() { return this; } }) },
    Logger: { log: m => kayit.log.push(m) },
    ScriptApp: {
      getProjectTriggers: () => kayit.tetikleyiciler.map(t => ({ getHandlerFunction: () => t.ad, t })),
      deleteTrigger: x => { kayit.tetikleyiciler = kayit.tetikleyiciler.filter(t => t !== x.t); },
      newTrigger(ad) {
        const t = { ad, ayar: [] }; const z = {
          timeBased() { return z; }, everyMinutes(n) { t.ayar.push('her ' + n + ' dk'); return z; },
          everyDays(n) { t.ayar.push('her ' + n + ' gün'); return z; }, atHour(h) { t.ayar.push('saat ' + h); return z; },
          onMonthDay(g) { t.ayar.push('ayın ' + g); return z; }, create() { kayit.tetikleyiciler.push(t); return t; } };
        return z;
      }
    }
  };
  vm.createContext(baglam);
  vm.runInContext(fs.readFileSync(KOD, 'utf8'), baglam, { filename: 'Code.gs' });

  const api = {
    baglam, kayit, ozellikler,
    takvim: () => takvimler[ozellikler.TAKVIM_ID],
    sayfa: () => tablolar[ozellikler.TABLO_ID].sayfa,
    get: p => JSON.parse(baglam.doGet({ parameter: p }).s),
    post: b => JSON.parse(baglam.doPost({ postData: { contents: JSON.stringify(b) } }).s),
    panel: (eylem, ek) => api.post(Object.assign({ islem: 'panel', pin: ozellikler.PANEL_PIN, eylem }, ek)),
    onbellekTemizle: () => { for (const k in onbellek) delete onbellek[k]; }
  };
  return api;
}
module.exports = { yukle };
