// Randevu sihirbazı katalogu: markalar → modeller, hizmetler.
// Backend bağlandığında bu veriler API'den (GET /catalog) de alınabilir.

export const OTHER = "Diğer";

export const MODELS = {
  "BMW": ["1 Serisi", "2 Serisi", "3 Serisi", "4 Serisi", "5 Serisi", "X1", "X3", "X5"],
  "Mercedes-Benz": ["A Serisi", "B Serisi", "C Serisi", "E Serisi", "CLA", "GLA", "GLC", "Vito", "Sprinter"],
  "Audi": ["A1", "A3", "A4", "A5", "A6", "Q2", "Q3", "Q5", "Q7"],
  "Volkswagen": ["Polo", "Golf", "Jetta", "Passat", "T-Roc", "Tiguan", "Caddy", "Transporter", "Amarok"],
  "Toyota": ["Yaris", "Corolla", "Auris", "C-HR", "RAV4", "Hilux", "Proace City"],
  "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Courier", "Connect", "Custom", "Ranger"],
  "Fiat": ["Egea", "Linea", "Punto", "500", "Doblo", "Fiorino"],
  "Renault": ["Clio", "Symbol", "Taliant", "Megane", "Fluence", "Captur", "Kadjar", "Austral"],
  "Peugeot": ["208", "2008", "301", "308", "3008", "5008", "Partner", "Rifter"],
  "Opel": ["Corsa", "Astra", "Insignia", "Mokka", "Crossland", "Grandland", "Combo"],
  "Hyundai": ["i10", "i20", "Accent", "Elantra", "Bayon", "Kona", "Tucson"],
  "Kia": ["Picanto", "Rio", "Ceed", "Stonic", "Sportage", "Sorento"],
};

export const BRANDS = [...Object.keys(MODELS), OTHER];

// Sitedeki 8 hizmetle birebir aynı. id: URL parametresi (?hizmet=...)
export const SERVICES = [
  { id: "periyodik-bakim", name: "Periyodik Bakım", icon: "i-wrench" },
  { id: "ariza-tespiti", name: "Bilgisayarlı Arıza Tespiti", icon: "i-scan" },
  { id: "motor-mekanik", name: "Motor & Mekanik", icon: "i-engine" },
  { id: "oto-elektrik", name: "Oto Elektrik", icon: "i-bolt" },
  { id: "fren-sistemi", name: "Fren & Süspansiyon", icon: "i-disc" },
  { id: "klima", name: "Klima", icon: "i-snow" },
  { id: "sanziman", name: "Şanzıman", icon: "i-gear" },
  { id: "ariza-kontrolu", name: "Genel Araç Kontrolü", icon: "i-check" },
];

export const serviceById = (id) => SERVICES.find((s) => s.id === id);
