// src/data/services.ts
var E = Math.PI / 2;
var W = -Math.PI / 2;
var N = Math.PI;
var S = 0;
var CIVIC = [
  {
    id: "hospital",
    name: "Fyrus General Hospital",
    kind: "civic",
    x: -384,
    z: -192,
    face: E,
    color: "#e5484d",
    sub: "Emergency \xB7 clinics \xB7 first aid",
    w: 30,
    d: 22,
    interior: true,
    job: { title: "Nurse shift", pay: 110, stations: ["Check the patient in bed 1", "Check the patient in bed 2", "Bring the first-aid kit", "Update charts at reception", "Restock the medicine cart"] },
    actions: ["checkup", "firstaid"]
  },
  {
    id: "police",
    name: "Fyrus Police Station",
    kind: "civic",
    x: -384,
    z: -128,
    face: E,
    color: "#2f6fe0",
    sub: "Help desk \xB7 lost & found \xB7 reports",
    w: 26,
    d: 20,
    interior: true,
    job: { title: "Community officer shift", pay: 100, stations: ["Answer the help-desk phone", "Log a lost-and-found item", "Check the city camera wall", "Brief the patrol team", "File a visitor report"] },
    actions: ["report", "lost"]
  },
  {
    id: "fire",
    name: "Fyrus Fire Station",
    kind: "civic",
    x: -384,
    z: -64,
    face: E,
    color: "#ff5a2a",
    sub: "Fire & rescue \xB7 safety drills",
    w: 28,
    d: 22,
    interior: true,
    job: { title: "Fire crew drill", pay: 105, stations: ["Check the hoses", "Wash the fire engine", "Test the alarm panel", "Pack the rescue kit", "Slide down the pole"] },
    actions: ["safety"]
  },
  {
    id: "post",
    name: "Fyrus Post Office",
    kind: "civic",
    x: -384,
    z: 0,
    face: E,
    color: "#ffd23f",
    sub: "Postcards \xB7 parcels \xB7 mailboxes",
    w: 24,
    d: 18,
    interior: true,
    job: { title: "Mail sorting shift", pay: 80, stations: ["Sort letters A\u2013M", "Sort letters N\u2013Z", "Weigh a parcel", "Load the delivery van", "Stamp the outgoing mail"] },
    actions: ["postcard", "mailbox"]
  },
  {
    id: "library",
    name: "Fyrus Public Library",
    kind: "civic",
    x: -384,
    z: 64,
    face: E,
    color: "#8b5a2b",
    sub: "Classic books \xB7 quiet reading \xB7 study tables",
    w: 28,
    d: 22,
    interior: true,
    job: { title: "Librarian shift", pay: 75, stations: ["Shelve returned books", "Help a reader find a book", "Scan the returns", "Tidy the study tables", "Set up the story corner"] },
    actions: ["books"]
  },
  {
    id: "pharmacy",
    name: "Fyrus Pharmacy",
    kind: "civic",
    x: -384,
    z: 128,
    face: E,
    color: "#45e0ae",
    sub: "Health tips \xB7 vitamins \xB7 first-aid kits",
    w: 20,
    d: 16,
    interior: true,
    job: { title: "Pharmacy assistant shift", pay: 70, stations: ["Stock the vitamins shelf", "Help a customer at the counter", "Check expiry dates", "Pack a first-aid kit"] },
    items: ["vitamins", "firstaidkit", "sunscreen", "water"]
  }
];
var BZ = (i) => ({ x: 174 + i % 4 * 12, z: i < 4 ? 80 : 48, face: i < 4 ? N : S });
var BAZAAR = [
  { id: "mobile", name: "Orbit Mobiles & Laptops", sub: "Phones, laptops, tablets (Fyrus brands)", color: "#4da3ff", items: ["orbitx2", "novapad", "skybook", "earbuds"], job: { title: "Sales shift", pay: 70, stations: ["Demo a phone", "Set up a laptop", "Restock the cases", "Help at the till"] } },
  { id: "wifi", name: "Lumen Wi-Fi & Net Caf\xE9", sub: "Wi-Fi passes, gaming PCs, printing", color: "#7fd1ff", items: ["wifiday", "wifimonth", "print"], job: { title: "Caf\xE9 shift", pay: 60, stations: ["Reset a gaming PC", "Sell a Wi-Fi pass", "Fix the printer"] } },
  { id: "snacks", name: "Crunch Snack Corner", sub: "Chips, chocolate, juices", color: "#ff9a3c", items: ["chips", "choco", "juice", "candy"], job: { title: "Snack shop shift", pay: 55, stations: ["Stock the chip shelf", "Fill the drinks fridge", "Help at the till"] } },
  { id: "bartan", name: "Bartan House", sub: "Kitchenware, pots, tea sets", color: "#c0c6cc", items: ["teaset", "pot", "thermos"], job: { title: "Shop helper shift", pay: 55, stations: ["Polish the pots", "Pack a tea set", "Arrange the window"] } },
  { id: "barber", name: "Sharp Edge Barber", sub: "Haircuts, beard trims, styling", color: "#1b1d22", actions: ["haircut"], job: { title: "Barber shift", pay: 75, stations: ["Sweep the floor", "Prepare the chair", "Trim a beard", "Wash the tools"] } },
  { id: "parlour", name: "Glow Beauty Parlour", sub: "Hair, makeup, nails", color: "#e05a8a", actions: ["makeover"], job: { title: "Salon shift", pay: 75, stations: ["Set up the mirror station", "Mix a hair colour", "Paint nails", "Fold the towels"] } },
  { id: "diner", name: "Sky Diner", sub: "Restaurant: burgers, karahi, pasta", color: "#2f5d50", items: ["burger", "karahi", "pasta", "lemonade"], job: { title: "Waiter shift", pay: 80, stations: ["Take an order at table 1", "Take an order at table 2", "Serve from the kitchen", "Clear a table"] } },
  { id: "books", name: "Page Turner Books", sub: "New books, notebooks, pens", color: "#b06ad9", items: ["notebook", "pen", "novel"], job: { title: "Bookshop shift", pay: 55, stations: ["Shelve new books", "Wrap a gift", "Help at the till"] } }
].map((s, i) => ({ ...s, ...BZ(i), kind: "shop", w: 10, d: 9, interior: true }));
var FS = (i) => ({ x: 112 + i % 5 * 9, z: i < 5 ? -200 : -184, face: i < 5 ? S : N });
var FOOD = [
  { id: "biryani", name: "Biryani House", color: "#d4a64a", items: ["biryani", "raita"] },
  { id: "chaat", name: "Chaat Corner", color: "#ff9a3c", items: ["golgappa", "chaat"] },
  { id: "bbq", name: "BBQ Tikka", color: "#8b3a2e", items: ["tikka", "kebab"] },
  { id: "noodles", name: "Wok Noodles", color: "#e5484d", items: ["noodles", "dumplings"] },
  { id: "shawarma", name: "Shawarma Express", color: "#c96f4a", items: ["shawarma", "fries"] },
  { id: "chai", name: "Chai Dhaba", color: "#7a5a3c", items: ["chai", "paratha"] },
  { id: "icecream", name: "Frost Ice Cream", color: "#7fd1ff", items: ["cone", "kulfi"] },
  { id: "juice", name: "Fresh Juice Bar", color: "#45e0ae", items: ["mango", "sugarcane"] },
  { id: "pizza", name: "Slice Pizza", color: "#ffd23f", items: ["pizza", "garlicbread"] },
  { id: "halwa", name: "Halwa Puri Point", color: "#e6a23c", items: ["halwapuri", "lassi"] }
].map((s, i) => ({ ...s, ...FS(i), kind: "stall", sub: "Food Street stall", w: 7, d: 4, interior: false, job: { title: "Cook shift", pay: 50, stations: ["Prepare the food", "Serve a customer", "Clean the counter"] } }));
var FAITH = [
  { id: "mosque", name: "Fyrus Grand Mosque", x: -128, z: 256, face: E, color: "#2f6a4f", sub: "Masjid \xB7 open for prayer and visitors" },
  { id: "church", name: "St. Light Church", x: -64, z: 256, face: E, color: "#8a9bb0", sub: "Church \xB7 services and quiet prayer" },
  { id: "mandir", name: "Shanti Mandir", x: -64, z: 312, face: N, color: "#ff9a3c", sub: "Hindu temple \xB7 aarti and festivals" },
  { id: "gurdwara", name: "Gurdwara Sahib", x: 64, z: 312, face: N, color: "#d4a64a", sub: "Gurdwara \xB7 free langar for everyone" },
  { id: "temple", name: "Lotus Buddhist Temple", x: 64, z: 256, face: W, color: "#c0392b", sub: "Buddhist temple \xB7 meditation" },
  { id: "synagogue", name: "Beit Shalom Synagogue", x: 128, z: 256, face: W, color: "#3a5a7a", sub: "Synagogue \xB7 prayer and community" }
].map((s) => ({ ...s, kind: "faith", w: 22, d: 18, interior: true }));
var SERVICES = [...CIVIC, ...BAZAAR, ...FOOD, ...FAITH];
var svcById = (id) => SERVICES.find((s) => s.id === id);
var SERVICE_BLOCKS = [
  ...CIVIC.map((s) => ({ x: s.x, z: s.z, r: 26 })),
  { x: 192, z: 64, r: 34 },
  { x: 130, z: -192, r: 32 },
  ...FAITH.map((s) => ({ x: s.x, z: s.z, r: 18 }))
];
function doorOf(s, extra = 2) {
  const d = (s.d || 10) / 2 + extra;
  return { x: s.x + Math.sin(s.face) * d, z: s.z + Math.cos(s.face) * d };
}
var ITEMS = {
  vitamins: { name: "Vitamins", price: 8, kind: "item", icon: "\u{1F48A}" },
  firstaidkit: { name: "First-aid kit", price: 25, kind: "item", icon: "\u{1FA79}" },
  sunscreen: { name: "Sunscreen", price: 10, kind: "item", icon: "\u{1F9F4}" },
  water: { name: "Water bottle", price: 2, kind: "food", icon: "\u{1F4A7}" },
  orbitx2: { name: "Orbit X2 phone", price: 900, kind: "gadget", icon: "\u{1F4F1}" },
  novapad: { name: "Nova Pad tablet", price: 650, kind: "gadget", icon: "\u{1F4F2}" },
  skybook: { name: "SkyBook laptop", price: 1400, kind: "gadget", icon: "\u{1F4BB}" },
  earbuds: { name: "Pulse earbuds", price: 180, kind: "gadget", icon: "\u{1F3A7}" },
  wifiday: { name: "Wi-Fi day pass", price: 5, kind: "item", icon: "\u{1F4F6}" },
  wifimonth: { name: "Wi-Fi month pass", price: 60, kind: "item", icon: "\u{1F4E1}" },
  print: { name: "Printed poster", price: 3, kind: "item", icon: "\u{1F5A8}" },
  chips: { name: "Chips", price: 3, kind: "food", icon: "\u{1F954}" },
  choco: { name: "Chocolate", price: 4, kind: "food", icon: "\u{1F36B}" },
  juice: { name: "Juice box", price: 3, kind: "food", icon: "\u{1F9C3}" },
  candy: { name: "Candy", price: 2, kind: "food", icon: "\u{1F36C}" },
  teaset: { name: "Tea set", price: 120, kind: "item", icon: "\u{1FAD6}" },
  pot: { name: "Cooking pot", price: 70, kind: "item", icon: "\u{1F372}" },
  thermos: { name: "Thermos", price: 35, kind: "item", icon: "\u{1F964}" },
  burger: { name: "Sky burger", price: 18, kind: "food", icon: "\u{1F354}" },
  karahi: { name: "Chicken karahi", price: 28, kind: "food", icon: "\u{1F35B}" },
  pasta: { name: "Pasta", price: 20, kind: "food", icon: "\u{1F35D}" },
  lemonade: { name: "Mint lemonade", price: 6, kind: "food", icon: "\u{1F34B}" },
  notebook: { name: "Notebook", price: 6, kind: "item", icon: "\u{1F4D3}" },
  pen: { name: "Pen", price: 2, kind: "item", icon: "\u{1F58A}" },
  novel: { name: "Novel", price: 22, kind: "item", icon: "\u{1F4D5}" },
  biryani: { name: "Biryani", price: 14, kind: "food", icon: "\u{1F35B}" },
  raita: { name: "Raita", price: 3, kind: "food", icon: "\u{1F963}" },
  golgappa: { name: "Gol gappay", price: 6, kind: "food", icon: "\u{1F95F}" },
  chaat: { name: "Papri chaat", price: 7, kind: "food", icon: "\u{1F957}" },
  tikka: { name: "Chicken tikka", price: 15, kind: "food", icon: "\u{1F357}" },
  kebab: { name: "Seekh kebab", price: 12, kind: "food", icon: "\u{1F362}" },
  noodles: { name: "Wok noodles", price: 12, kind: "food", icon: "\u{1F35C}" },
  dumplings: { name: "Dumplings", price: 10, kind: "food", icon: "\u{1F95F}" },
  shawarma: { name: "Shawarma", price: 10, kind: "food", icon: "\u{1F32F}" },
  fries: { name: "Fries", price: 5, kind: "food", icon: "\u{1F35F}" },
  chai: { name: "Doodh patti chai", price: 3, kind: "food", icon: "\u2615" },
  paratha: { name: "Paratha", price: 5, kind: "food", icon: "\u{1FAD3}" },
  cone: { name: "Ice cream cone", price: 5, kind: "food", icon: "\u{1F366}" },
  kulfi: { name: "Kulfi", price: 5, kind: "food", icon: "\u{1F361}" },
  mango: { name: "Mango shake", price: 7, kind: "food", icon: "\u{1F96D}" },
  sugarcane: { name: "Sugarcane juice", price: 4, kind: "food", icon: "\u{1F964}" },
  pizza: { name: "Pizza slice", price: 8, kind: "food", icon: "\u{1F355}" },
  garlicbread: { name: "Garlic bread", price: 5, kind: "food", icon: "\u{1F956}" },
  halwapuri: { name: "Halwa puri", price: 9, kind: "food", icon: "\u{1F958}" },
  lassi: { name: "Lassi", price: 5, kind: "food", icon: "\u{1F95B}" }
};
var SERVICE_PRICES = { haircut: 20, makeover: 30, postcard: 5 };
var JOB_RULES = { tasks: 5, minTaskMs: 2500, dailyShifts: 6, cooldownMs: 9e4 };

