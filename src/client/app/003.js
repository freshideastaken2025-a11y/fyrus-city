var hw = mi((NA, dw) => {
  "use strict";
  function cw() {
    if (
      !(
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
      )
    )
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cw);
      } catch (t) {
        console.error(t);
      }
  }
  (cw(), (dw.exports = lw()));
});
var ea = mi((fz, mE) => {
  mE.exports = window.THREE;
});
var xE = mi((Mg) => {
  "use strict";
  var WH = Symbol.for("react.transitional.element"),
    IH = Symbol.for("react.fragment");
  function vE(t, e, a) {
    var r = null;
    if ((a !== void 0 && (r = "" + a), e.key !== void 0 && (r = "" + e.key), "key" in e)) {
      a = {};
      for (var o in e) o !== "key" && (a[o] = e[o]);
    } else a = e;
    return ((e = a.ref), { $$typeof: WH, type: t, key: r, ref: e !== void 0 ? e : null, props: a });
  }
  Mg.Fragment = IH;
  Mg.jsx = vE;
  Mg.jsxs = vE;
});
var ct = mi((xz, yE) => {
  "use strict";
  yE.exports = xE();
});
var U9 = P(hw(), 1);
var rM = P(Zt(), 1);
var Hl = Math.PI / 2,
  uw = -Math.PI / 2,
  lp = Math.PI,
  pw = 0,
  gw = [
    {
      id: "hospital",
      name: "Fyrus General Hospital",
      kind: "civic",
      x: -384,
      z: -192,
      face: Hl,
      color: "#e5484d",
      sub: "Emergency \xB7 clinics \xB7 first aid",
      w: 30,
      d: 22,
      interior: !0,
      job: {
        title: "Nurse shift",
        pay: 110,
        stations: [
          "Check the patient in bed 1",
          "Check the patient in bed 2",
          "Bring the first-aid kit",
          "Update charts at reception",
          "Restock the medicine cart",
        ],
      },
      actions: ["checkup", "firstaid"],
    },
    {
      id: "police",
      name: "Fyrus Police Station",
      kind: "civic",
      x: -384,
      z: -128,
      face: Hl,
      color: "#2f6fe0",
      sub: "Help desk \xB7 lost & found \xB7 reports",
      w: 26,
      d: 20,
      interior: !0,
      job: {
        title: "Community officer shift",
        pay: 100,
        stations: [
          "Answer the help-desk phone",
          "Log a lost-and-found item",
          "Check the city camera wall",
          "Brief the patrol team",
          "File a visitor report",
        ],
      },
      actions: ["report", "lost"],
    },
    {
      id: "fire",
      name: "Fyrus Fire Station",
      kind: "civic",
      x: -384,
      z: -64,
      face: Hl,
      color: "#ff5a2a",
      sub: "Fire & rescue \xB7 safety drills",
      w: 28,
      d: 22,
      interior: !0,
      job: {
        title: "Fire crew drill",
        pay: 105,
        stations: [
          "Check the hoses",
          "Wash the fire engine",
          "Test the alarm panel",
          "Pack the rescue kit",
          "Slide down the pole",
        ],
      },
      actions: ["safety"],
    },
    {
      id: "post",
      name: "Fyrus Post Office",
      kind: "civic",
      x: -384,
      z: 0,
      face: Hl,
      color: "#ffd23f",
      sub: "Postcards \xB7 parcels \xB7 mailboxes",
      w: 24,
      d: 18,
      interior: !0,
      job: {
        title: "Mail sorting shift",
        pay: 80,
        stations: [
          "Sort letters A\u2013M",
          "Sort letters N\u2013Z",
          "Weigh a parcel",
          "Load the delivery van",
          "Stamp the outgoing mail",
        ],
      },
      actions: ["postcard", "mailbox"],
    },
    {
      id: "library",
      name: "Fyrus Public Library",
      kind: "civic",
      x: -384,
      z: 64,
      face: Hl,
      color: "#8b5a2b",
      sub: "Classic books \xB7 quiet reading \xB7 study tables",
      w: 28,
      d: 22,
      interior: !0,
      job: {
        title: "Librarian shift",
        pay: 75,
        stations: [
          "Shelve returned books",
          "Help a reader find a book",
          "Scan the returns",
          "Tidy the study tables",
          "Set up the story corner",
        ],
      },
      actions: ["books"],
    },
    {
      id: "pharmacy",
      name: "Fyrus Pharmacy",
      kind: "civic",
      x: -384,
      z: 128,
      face: Hl,
      color: "#45e0ae",
      sub: "Health tips \xB7 vitamins \xB7 first-aid kits",
      w: 20,
      d: 16,
      interior: !0,
      job: {
        title: "Pharmacy assistant shift",
        pay: 70,
        stations: [
          "Stock the vitamins shelf",
          "Help a customer at the counter",
          "Check expiry dates",
          "Pack a first-aid kit",
        ],
      },
      items: ["vitamins", "firstaidkit", "sunscreen", "water"],
    },
  ],
  _S = (t) => ({ x: 174 + (t % 4) * 12, z: t < 4 ? 80 : 48, face: t < 4 ? lp : pw }),
  YS = [
    {
      id: "mobile",
      name: "Orbit Mobiles & Laptops",
      sub: "Phones, laptops, tablets (Fyrus brands)",
      color: "#4da3ff",
      items: ["orbitx2", "novapad", "skybook", "earbuds"],
      job: {
        title: "Sales shift",
        pay: 70,
        stations: ["Demo a phone", "Set up a laptop", "Restock the cases", "Help at the till"],
      },
    },
    {
      id: "wifi",
      name: "Lumen Wi-Fi & Net Caf\xE9",
      sub: "Wi-Fi passes, gaming PCs, printing",
      color: "#7fd1ff",
      items: ["wifiday", "wifimonth", "print"],
      job: {
        title: "Caf\xE9 shift",
        pay: 60,
        stations: ["Reset a gaming PC", "Sell a Wi-Fi pass", "Fix the printer"],
      },
    },
    {
      id: "snacks",
      name: "Crunch Snack Corner",
      sub: "Chips, chocolate, juices",
      color: "#ff9a3c",
      items: ["chips", "choco", "juice", "candy"],
      job: {
        title: "Snack shop shift",
        pay: 55,
        stations: ["Stock the chip shelf", "Fill the drinks fridge", "Help at the till"],
      },
    },
    {
      id: "bartan",
      name: "Bartan House",
      sub: "Kitchenware, pots, tea sets",
      color: "#c0c6cc",
      items: ["teaset", "pot", "thermos"],
      job: {
        title: "Shop helper shift",
        pay: 55,
        stations: ["Polish the pots", "Pack a tea set", "Arrange the window"],
      },
    },
    {
      id: "barber",
      name: "Sharp Edge Barber",
      sub: "Haircuts, beard trims, styling",
      color: "#1b1d22",
      actions: ["haircut"],
      job: {
        title: "Barber shift",
        pay: 75,
        stations: ["Sweep the floor", "Prepare the chair", "Trim a beard", "Wash the tools"],
      },
    },
    {
      id: "parlour",
      name: "Glow Beauty Parlour",
      sub: "Hair, makeup, nails",
      color: "#e05a8a",
      actions: ["makeover"],
      job: {
        title: "Salon shift",
        pay: 75,
        stations: ["Set up the mirror station", "Mix a hair colour", "Paint nails", "Fold the towels"],
      },
    },
    {
      id: "diner",
      name: "Sky Diner",
      sub: "Restaurant: burgers, karahi, pasta",
      color: "#2f5d50",
      items: ["burger", "karahi", "pasta", "lemonade"],
      job: {
        title: "Waiter shift",
        pay: 80,
        stations: [
          "Take an order at table 1",
          "Take an order at table 2",
          "Serve from the kitchen",
          "Clear a table",
        ],
      },
    },
    {
      id: "books",
      name: "Page Turner Books",
      sub: "New books, notebooks, pens",
      color: "#b06ad9",
      items: ["notebook", "pen", "novel"],
      job: {
        title: "Bookshop shift",
        pay: 55,
        stations: ["Shelve new books", "Wrap a gift", "Help at the till"],
      },
    },
  ].map((t, e) => ({ ...t, ..._S(e), kind: "shop", w: 10, d: 9, interior: !0 })),
  qS = (t) => ({ x: 112 + (t % 5) * 9, z: t < 5 ? -200 : -184, face: t < 5 ? pw : lp }),
  ZS = [
    { id: "biryani", name: "Biryani House", color: "#d4a64a", items: ["biryani", "raita"] },
    { id: "chaat", name: "Chaat Corner", color: "#ff9a3c", items: ["golgappa", "chaat"] },
    { id: "bbq", name: "BBQ Tikka", color: "#8b3a2e", items: ["tikka", "kebab"] },
    { id: "noodles", name: "Wok Noodles", color: "#e5484d", items: ["noodles", "dumplings"] },
    { id: "shawarma", name: "Shawarma Express", color: "#c96f4a", items: ["shawarma", "fries"] },
    { id: "chai", name: "Chai Dhaba", color: "#7a5a3c", items: ["chai", "paratha"] },
    { id: "icecream", name: "Frost Ice Cream", color: "#7fd1ff", items: ["cone", "kulfi"] },
    { id: "juice", name: "Fresh Juice Bar", color: "#45e0ae", items: ["mango", "sugarcane"] },
    { id: "pizza", name: "Slice Pizza", color: "#ffd23f", items: ["pizza", "garlicbread"] },
    { id: "halwa", name: "Halwa Puri Point", color: "#e6a23c", items: ["halwapuri", "lassi"] },
  ].map((t, e) => ({
    ...t,
    ...qS(e),
    kind: "stall",
    sub: "Food Street stall",
    w: 7,
    d: 4,
    interior: !1,
    job: {
      title: "Cook shift",
      pay: 50,
      stations: ["Prepare the food", "Serve a customer", "Clean the counter"],
    },
  })),
  fw = [
    {
      id: "mosque",
      name: "Fyrus Grand Mosque",
      x: -128,
      z: 256,
      face: Hl,
      color: "#2f6a4f",
      sub: "Masjid \xB7 open for prayer and visitors",
    },
    {
      id: "church",
      name: "St. Light Church",
      x: -64,
      z: 256,
      face: Hl,
      color: "#8a9bb0",
      sub: "Church \xB7 services and quiet prayer",
    },
    {
      id: "mandir",
      name: "Shanti Mandir",
      x: -64,
      z: 312,
      face: lp,
      color: "#ff9a3c",
      sub: "Hindu temple \xB7 aarti and festivals",
    },
    {
      id: "gurdwara",
      name: "Gurdwara Sahib",
      x: 64,
      z: 312,
      face: lp,
      color: "#d4a64a",
      sub: "Gurdwara \xB7 free langar for everyone",
    },
    {
      id: "temple",
      name: "Lotus Buddhist Temple",
      x: 64,
      z: 256,
      face: uw,
      color: "#c0392b",
      sub: "Buddhist temple \xB7 meditation",
    },
    {
      id: "synagogue",
      name: "Beit Shalom Synagogue",
      x: 128,
      z: 256,
      face: uw,
      color: "#3a5a7a",
      sub: "Synagogue \xB7 prayer and community",
    },
  ].map((t) => ({ ...t, kind: "faith", w: 22, d: 18, interior: !0 })),
  Di = [...gw, ...YS, ...ZS, ...fw],
  Nl = (t) => Di.find((e) => e.id === t),
  yh = [
    {
      id: "civic",
      name: "Civic Quarter",
      x: -384,
      z: -32,
      sub: "Hospital, police, fire, post office, library, pharmacy",
    },
    {
      id: "bazaar",
      name: "Everyday Bazaar",
      x: 192,
      z: 64,
      sub: "Phones, Wi-Fi, snacks, bartan, barber, beauty parlour, diner, books",
    },
    {
      id: "food",
      name: "Food Street",
      x: 130,
      z: -192,
      sub: "Biryani, chaat, BBQ, noodles, chai, ice cream\u2026",
    },
    {
      id: "faith",
      name: "Faith District",
      x: 0,
      z: 284,
      sub: "Mosque, church, mandir, gurdwara, temple, synagogue",
    },
  ],
  mw = [
    ...gw.map((t) => ({ x: t.x, z: t.z, r: 26 })),
    { x: 192, z: 64, r: 34 },
    { x: 130, z: -192, r: 32 },
    ...fw.map((t) => ({ x: t.x, z: t.z, r: 18 })),
  ];
function Ic(t, e = 2) {
  let a = (t.d || 10) / 2 + e;
  return { x: t.x + Math.sin(t.face) * a, z: t.z + Math.cos(t.face) * a };
}
var Fi = {
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
    lassi: { name: "Lassi", price: 5, kind: "food", icon: "\u{1F95B}" },
  },
  cp = { haircut: 20, makeover: 30, postcard: 5 };
var kh = [
  {
    t: "Pride and Prejudice",
    a: "Jane Austen",
    y: 1813,
    s: "Elizabeth Bennet and Mr Darcy misjudge each other, then slowly learn better. Sharp, funny and kind.",
    g: 1342,
  },
  {
    t: "Alice's Adventures in Wonderland",
    a: "Lewis Carroll",
    y: 1865,
    s: "Alice falls down a rabbit hole into a world of riddles, tea parties and a very cross queen.",
    g: 11,
  },
  {
    t: "The Adventures of Sherlock Holmes",
    a: "Arthur Conan Doyle",
    y: 1892,
    s: "Twelve short mysteries solved by the world's most famous detective and his friend Dr Watson.",
    g: 1661,
  },
  {
    t: "Frankenstein",
    a: "Mary Shelley",
    y: 1818,
    s: "A young scientist builds a living being and runs from what he made. The first science-fiction novel.",
    g: 84,
  },
  {
    t: "The Time Machine",
    a: "H. G. Wells",
    y: 1895,
    s: "An inventor travels 800,000 years into the future and finds humanity split in two.",
    g: 35,
  },
  {
    t: "Treasure Island",
    a: "R. L. Stevenson",
    y: 1883,
    s: "Young Jim Hawkins, a treasure map and the pirate Long John Silver.",
    g: 120,
  },
  {
    t: "The Jungle Book",
    a: "Rudyard Kipling",
    y: 1894,
    s: "Mowgli, raised by wolves, learns the law of the jungle from Baloo and Bagheera.",
    g: 236,
  },
  {
    t: "Gitanjali",
    a: "Rabindranath Tagore",
    y: 1912,
    s: "Song offerings: short poems of devotion and wonder that won the Nobel Prize.",
    g: 7164,
  },
  {
    t: "The Arabian Nights",
    a: "Traditional",
    y: 1706,
    s: "Scheherazade tells a story every night: Aladdin, Ali Baba, Sinbad the sailor.",
    g: 128,
  },
  {
    t: "Little Women",
    a: "Louisa May Alcott",
    y: 1868,
    s: "Four sisters grow up during hard times, each chasing her own dream.",
    g: 514,
  },
  {
    t: "Around the World in Eighty Days",
    a: "Jules Verne",
    y: 1872,
    s: "Phileas Fogg bets he can circle the globe in 80 days \u2014 by train, ship and elephant.",
    g: 103,
  },
  {
    t: "The Art of War",
    a: "Sun Tzu",
    y: -500,
    s: "Short, old lessons on strategy that people still use in business and games.",
    g: 132,
  },
];
var wn = {
    newstv: { x: -40, z: -120, r: 22 },
    halls: { x: -200, z: -320, r: 28 },
    lounge: { x: 300, z: 120, r: 26 },
  },
  KS = {
    "ad-core-n": 900,
    "ad-core-w": 650,
    "ad-market-n": 800,
    "ad-market-s": 760,
    "ad-club": 450,
    "ad-pool": 360,
    "ad-gardens": 380,
    "ad-marina": 500,
    "ad-avenue-w": 580,
    "ad-avenue-e": 420,
    "ad-skyport": 340,
    "ad-homes": 280,
  },
  vw = [1, 7, 14, 30],
  ev = (t, e) => Math.round((KS[t] || 0) * e * (e >= 30 ? 0.75 : e >= 14 ? 0.85 : e >= 7 ? 0.9 : 1)),
  xw = 6e4,
  Bo = [
    {
      id: "grand",
      name: "Grand Conference Hall",
      kind: "conference",
      site: "halls",
      cap: 200,
      hourly: 600,
      color: "#4da3ff",
      desc: "Main stage, giant screen and 200 seats. Product launches, summits, graduations.",
    },
    {
      id: "summit",
      name: "Summit Room",
      kind: "conference",
      site: "halls",
      cap: 60,
      hourly: 250,
      color: "#ffc27a",
      desc: "Boardroom-style room for meetups, panels and investor pitches.",
    },
    {
      id: "studio",
      name: "Workshop Studio",
      kind: "conference",
      site: "halls",
      cap: 30,
      hourly: 120,
      color: "#45e0ae",
      desc: "Small room with a whiteboard wall for classes and hands-on workshops.",
    },
    {
      id: "skyline",
      name: "Skyline Lounge",
      kind: "lounge",
      site: "lounge",
      cap: 80,
      hourly: 300,
      color: "#c792ea",
      desc: "Sofas, a mocktail bar and city views. Networking nights and listening parties.",
    },
    {
      id: "rooftop",
      name: "Rooftop Chill Lounge",
      kind: "lounge",
      site: "lounge",
      cap: 40,
      hourly: 150,
      color: "#ff9a3c",
      desc: "Open-air rooftop with fire tables for small, relaxed hangouts.",
    },
    {
      id: "arena",
      name: "Gaming Arena",
      kind: "gaming",
      site: "lounge",
      cap: 120,
      hourly: 400,
      color: "#e5484d",
      desc: "Gaming rigs, an arena screen and stands. Watch parties and skill tournaments.",
    },
  ],
  Ui = (t) => Bo.find((e) => e.id === t),
  yw = 6,
  av = 5e3;
var Mn = {
  nation: { label: "Nation", color: "#ffc27a" },
  economy: { label: "Economy", color: "#45e0ae" },
  property: { label: "Property", color: "#4da3ff" },
  market: { label: "Market", color: "#ff9a3c" },
  education: { label: "Education", color: "#7fd1ff" },
  events: { label: "Events", color: "#c792ea" },
  court: { label: "Court", color: "#e5484d" },
  politics: { label: "Politics", color: "#b06ad9" },
  ads: { label: "Billboards", color: "#f1c40f" },
  citizen: { label: "Citizen report", color: "#a8d8ff" },
};
var bh = "fyrus.net.token",
  I2 = {
    get: (t) => {
      try {
        return localStorage.getItem(t);
      } catch {
        return null;
      }
    },
    set: (t, e) => {
      try {
        localStorage.setItem(t, e);
      } catch {}
    },
  },
  rv = class {
    constructor() {
      this.ws = null;
      this.status = "off";
      this.tries = 0;
      this.peers = new Map();
      this.meId = "";
      this.handlers = new Map();
      this.lastPos = 0;
      this.lastPhoto = "";
      this.bannedText = "";
      this.manual = !1;
    }
    get token() {
      return I2.get(bh);
    }
    useToken(e) {
      (I2.set(bh, e),
        (this.bannedText = ""),
        this.ws ? ((this.manual = !0), this.ws.close()) : this.connect());
    }
    logout() {
      let e = I2.get(bh);
      e &&
        this.enabled &&
        fetch("/api/auth/logout", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token: e }),
        }).catch(() => {});
      try {
        localStorage.removeItem(bh);
      } catch {}
      this.ws &&
        ((this.manual = !1), (this.bannedText = "signed out"), this.ws.close(), (this.bannedText = ""));
    }
    get enabled() {
      let e = location.hostname;
      return (
        location.protocol.startsWith("http") &&
        (e === "fyrus.io" ||
          e === "www.fyrus.io" ||
          e === "localhost" ||
          e === "127.0.0.1" ||
          window.__fyrusNet === !0)
      );
    }
    on(e, a) {
      return (
        this.handlers.has(e) || this.handlers.set(e, new Set()),
        this.handlers.get(e).add(a),
        () => this.handlers.get(e).delete(a)
      );
    }
    emit(e, a) {
      this.handlers.get(e)?.forEach((r) => {
        try {
          r(a);
        } catch (o) {
          console.error(o);
        }
      });
    }
    connect() {
      if (!this.enabled || this.ws) return;
      let e = ot();
      if (!e.session) return;
      ((this.status = "connecting"), C({ net: { ...ot().net, status: "connecting" } }));
      let a =
          window.__fyrusNetUrl || `${location.protocol === "https:" ? "wss" : "ws"}://${location.host}/ws`,
        r = new WebSocket(a);
      ((this.ws = r),
        (r.onopen = () => {
          let o = e.users.find((n) => n.id === e.session?.userId);
          r.send(
            JSON.stringify({
              t: "hello",
              token: I2.get(bh),
              name: o?.name,
              color: o?.color,
              lang: ot().settings.lang || "en",
            }),
          );
        }),
        (r.onmessage = (o) => {
          let n;
          try {
            n = JSON.parse(o.data);
          } catch {
            return;
          }
          this.handle(n);
        }),
        (r.onclose = () => {
          if (
            ((this.ws = null),
            (this.status = "off"),
            this.peers.clear(),
            C({ net: { ...ot().net, status: "off" } }),
            this.bannedText || this.manual)
          ) {
            ((this.manual = !1), this.bannedText || this.connect());
            return;
          }
          let o = Math.min(3e4, 1e3 * 2 ** this.tries++);
          setTimeout(() => this.connect(), o);
        }),
        (r.onerror = () => {}));
    }
    handle(e) {
      switch (e.t) {
        case "welcome": {
          ((this.tries = 0),
            (this.status = "online"),
            (this.meId = e.me.id),
            e.token && I2.set(bh, e.token),
            C({
              net: {
                status: "online",
                id: e.me.id,
                number: e.me.number,
                online: e.online,
                translate: !!e.translate,
                ...kw(e.me),
              },
              sharedPlots: e.plots || {},
              groups: e.groups || [],
            }));
          let a = ot(),
            r = a.session && a.passports[a.session.userId];
          (r && this.send({ t: "profile", passport: { ...r, level: Tr(a.game.xp) } }),
            a.settings.stealth && this.send({ t: "profile", stealth: !0 }));
          {
            let o = a.session?.userId;
            this.send({ t: "bank_hello", local: o ? Math.round(a.wallets[o] || 0) : 0 });
          }
          (this.send({ t: "xp_hello", local: Math.round(a.game.xp || 0) }),
            this.send({ t: "edu_mine" }),
            this.send({ t: "est_state" }),
            this.send({ t: "news_state" }),
            this.send({ t: "ads_state" }),
            this.send({ t: "hall_list" }),
            this.send({ t: "home_state" }),
            this.send({ t: "jobs_me" }),
            Object.entries(a.plots).forEach(([o, n]) => {
              n.owner === a.session?.userId &&
                !(e.plots || {})[o] &&
                this.send({ t: "plot", id: o, use: n.use, sign: n.sign, forSale: n.forSale });
            }));
          break;
        }
        case "me":
          C({ net: { ...ot().net, number: e.me.number, ...kw(e.me) } });
          break;
        case "xp": {
          let a = ot().game;
          e.xp !== a.xp && C({ game: { ...a, xp: e.xp } });
          break;
        }
        case "need_age18":
          C({ age18Ask: !0, voiceOn: !1 });
          break;
        case "banned":
          ((this.bannedText = e.text),
            C({ net: { ...ot().net, status: "off", banned: e.text } }),
            F(e.text, "warn"));
          break;
        case "online":
          C({ net: { ...ot().net, online: e.n } });
          break;
        case "peers": {
          let a = new Set();
          (e.list.forEach((r) => {
            a.add(r.id);
            let o = this.peers.get(r.id);
            this.peers.set(r.id, { ...r, ph: r.ph ?? o?.ph });
          }),
            this.peers.forEach((r, o) => {
              a.has(o) || this.peers.delete(o);
            }));
          break;
        }
        case "left":
          this.peers.delete(e.id);
          break;
        case "plots": {
          let a = { ...ot().sharedPlots };
          (Object.entries(e.plots).forEach(([r, o]) => {
            o ? (a[r] = o) : delete a[r];
          }),
            C({ sharedPlots: a }));
          break;
        }
        case "plot_taken":
          F(`Plot ${e.id} was just taken by ${e.owner?.ownerName || "another citizen"}.`, "warn");
          break;
        case "group": {
          let a = ot().groups.filter((r) => r.id !== e.group.id);
          C({ groups: [...a, e.group] });
          break;
        }
        case "err":
          F(e.text, "warn");
          break;
        case "passport_denied": {
          let a = ot(),
            r = a.session?.userId,
            o = r && a.passports[r];
          (o &&
            o.kind !== "visa" &&
            C({
              passports: {
                ...a.passports,
                [r]: { ...o, kind: "visa", passportNo: void 0, passportAt: void 0 },
              },
            }),
            F(e.text, "warn"));
          break;
        }
        case "ok":
          F(e.text, "ok");
          break;
        case "note":
          F(e.text, "info");
          break;
        case "edu_list":
          C({ edu: { inst: e.inst, teachers: e.teachers, courses: e.courses } });
          break;
        case "edu_mine": {
          let { t: a, earn: r, ...o } = e;
          (C({ eduMine: o }), r > 0 && bw(r));
          break;
        }
        case "bank": {
          let a = ot(),
            r = a.session?.userId;
          C({
            bank: {
              bal: e.bal,
              bond: e.bond,
              held: e.held,
              strikes: e.strikes,
              banned: e.banned,
              sales: e.sales,
            },
            ...(r ? { wallets: { ...a.wallets, [r]: e.bal } } : {}),
          });
          break;
        }
        case "bank_hist":
          C({ bankHist: e.list });
          break;
        case "est_state":
          C({ estate: { plots: e.plots, studios: e.studios } });
          break;
        case "est_update": {
          let a = { ...(ot().estate?.plots || {}) };
          (Object.entries(e.plots).forEach(([r, o]) => {
            o ? (a[r] = o) : delete a[r];
          }),
            C({ estate: { plots: a, studios: ot().estate?.studios || 0 } }));
          break;
        }
        case "est_mine": {
          let { t: a, ...r } = e;
          C({ estateMine: r });
          break;
        }
        case "news_state": {
          let { t: a, ...r } = e;
          C({ news: r });
          break;
        }
        case "news_new": {
          let a = ot().news;
          a &&
            C({ news: { ...a, fyrus: [e.item, ...a.fyrus.filter((r) => r.id !== e.item.id)].slice(0, 80) } });
          break;
        }
        case "news_world": {
          let a = ot().news;
          a && C({ news: { ...a, world: e.world, worldAt: e.worldAt, worldErr: "" } });
          break;
        }
        case "news_gone": {
          let a = ot().news;
          a && C({ news: { ...a, fyrus: a.fyrus.filter((r) => r.id !== e.id) } });
          break;
        }
        case "ads_state": {
          let { t: a, ...r } = e;
          C({ adsNet: r });
          break;
        }
        case "ads_mine":
          C({ adsMine: e.list });
          break;
        case "hall_list":
          C({ halls: { events: e.events, now: e.now } });
          break;
        case "hall_changed":
          this.send({ t: "hall_list" });
          break;
        case "hall_access": {
          let a = Ui(e.hall);
          if (!a) break;
          e.ok
            ? (C({
                scene: { mode: "gov", owner: "hall:" + a.id },
                nearby: null,
                hud: { ...ot().hud, open: !1 },
              }),
              F(
                e.event
                  ? `${a.name}: "${e.event.title}" is on. Turn on your mic to talk with people near you.`
                  : `${a.name} is open. Walk in and meet people.`,
                "info",
              ))
            : (F(`"${e.event?.title}" is on in the ${a.name}. Get a ticket to go in.`, "warn"),
              En("upcoming"));
          break;
        }
        case "jobs_me": {
          let { t: a, ...r } = e;
          C({ jobsMe: r });
          break;
        }
        case "job_done": {
          (F(`Shift done: ${e.title} \u2014 +${e.pay} FYC paid by the Treasury. Great work!`, "xp"),
            Ce(40, e.title));
          break;
        }
        case "ate": {
          let a = Fi[e.item];
          (F(`${a?.icon || "\u{1F37D}"} Yum! You enjoyed the ${a?.name || "food"}.`, "ok"),
            window.__fyrusW?.say?.(`${a?.icon || ""} yum!`));
          break;
        }
        case "service_ok": {
          (F(
            e.kind === "haircut"
              ? "Take a seat \u2014 pick your new haircut and beard."
              : "Makeover time \u2014 choose your hair and look.",
            "ok",
          ),
            C({
              svcCard: null,
              hud: { open: !0, tab: "settings" },
              avatarSection: e.kind === "haircut" ? "hair" : "face",
            }));
          break;
        }
        case "pol_state": {
          let { t: a, ...r } = e;
          C({ politics: { ...r, skew: Date.now() - e.now } });
          break;
        }
        case "pol_me": {
          let { t: a, ...r } = e;
          C({ polMe: r });
          break;
        }
        case "home_ext":
          C({ homesExt: { ...ot().homesExt, ...e.ext }, ...(e.locks ? { homesLock: e.locks } : {}) });
          break;
        case "home_lock":
          C({ homesLock: { ...ot().homesLock, [e.key]: e.lock } });
          break;
        case "home_mine":
          C({ homeMine: { homes: e.homes, held: e.held } });
          break;
        case "home_access":
          ww(e);
          break;
        case "home_knock": {
          let a = ot();
          (C({
            knocks: [
              ...a.knocks.filter((r) => !(r.key === e.key && r.from.id === e.from.id)),
              { key: e.key, label: e.label, from: e.from, at: Date.now() },
            ].slice(-6),
          }),
            F(`${e.from.name} is knocking at ${e.label}.`, "info"));
          break;
        }
        case "home_let_in":
          (F(`${e.by} opened the door of ${e.label}. Going in\u2026`, "ok"), Jn(e.key));
          break;
        case "home_int": {
          let a = ot().house;
          a && a.key === e.key && !a.canEdit && C({ house: { ...a, int: e.int } });
          break;
        }
        case "home_saved": {
          let a = ot().house;
          a && a.key === e.key && C({ house: { ...a, int: e.int, dirty: !1 } });
          break;
        }
        case "mk_list":
          C({ mk: { listings: e.listings, now: e.now } });
          break;
        case "mk_mine": {
          let { t: a, ...r } = e;
          C({ mkMine: r });
          break;
        }
        case "mk_changed":
          ot().mk && (this.send({ t: "mk_list" }), this.send({ t: "mk_mine" }));
          break;
        case "edu_changed":
          ot().edu && this.send({ t: "edu_list" });
          break;
        case "edu_certified":
          (F(`Certificate earned: ${e.cert.courseTitle} (${e.cert.code}).`, "xp"),
            this.send({ t: "edu_mine" }));
          break;
      }
      this.emit(e.t, e);
    }
    send(e) {
      return this.ws?.readyState === 1 ? (this.ws.send(JSON.stringify(e)), !0) : !1;
    }
    pos(e) {
      let a = Date.now();
      if (a - this.lastPos < 120) return;
      this.lastPos = a;
      let r = e.photo && e.photo !== this.lastPhoto ? e.photo : void 0;
      (r && (this.lastPhoto = r),
        this.send({
          t: "pos",
          x: Math.round(e.x * 10) / 10,
          z: Math.round(e.z * 10) / 10,
          y: e.y,
          ry: Math.round(e.ry * 100) / 100,
          scene: e.scene,
          o: e.o,
          v: e.v,
          photo: r,
        }));
    }
  },
  kw = (t) => ({
    blocks: t.blocks || [],
    email: t.email ?? null,
    google: !!t.google,
    guest: !!t.guest,
    admin: !!t.admin,
    age18: !!t.age18,
  }),
  O = new rv();
if (typeof window < "u") {
  let t = [],
    e = (a, r) => {
      if (!O.enabled) return;
      let o = Date.now();
      if (((t = t.filter((n) => o - n < 6e4)), !(t.length >= 5))) {
        t.push(o);
        try {
          fetch("/api/err", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              msg: String(a).slice(0, 300),
              stack: String(r || "").slice(0, 1200),
              url: location.pathname,
            }),
            keepalive: !0,
          }).catch(() => {});
        } catch {}
      }
    };
  (window.addEventListener("error", (a) => e(a.message, a.error?.stack)),
    window.addEventListener("unhandledrejection", (a) =>
      e("Unhandled: " + (a.reason?.message || a.reason), a.reason?.stack),
    ));
}
window.__fyrusNetObj = O;
var XS = Date.now(),
  ia = (t) => XS - t * 36e5,
  Gc = (t, e, a, r, o, n, i = "glass") => ({
    x: t,
    z: e,
    theme: a,
    accent: r,
    style: o,
    floors: n,
    floor: i,
    garden: 3,
  }),
  Pc = [
    {
      id: "u-nova",
      name: "Nova Reed",
      handle: "nova",
      title: "Agent Architect",
      bio: "I build multi-agent systems and RAG pipelines. 40+ agents shipped.",
      color: "#4da3ff",
      skills: ["LangGraph", "RAG", "Tool use"],
      followers: 0,
      rating: 0,
      verified: !0,
      home: Gc(-48, 58, "#4da3ff", "#ff9a3c", "spire", 7),
      avatar: { acc: "halo", trail: "blue", board: "neon" },
    },
    {
      id: "u-kai",
      name: "Kai Bennett",
      handle: "kai",
      title: "AI Film Director",
      bio: "Generative film, motion LoRAs and AI music videos.",
      color: "#ff9a3c",
      skills: ["Video diffusion", "ComfyUI", "Runway"],
      followers: 0,
      rating: 0,
      verified: !0,
      home: Gc(-96, 48, "#ff9a3c", "#4da3ff", "dome", 4, "marble"),
      avatar: { acc: "visor-x", trail: "ember", board: "flame" },
    },
    {
      id: "u-zara",
      name: "Zara Mitchell",
      handle: "zara",
      title: "Prompt Engineer & Writer",
      bio: "Eval suites, prompt systems and long-form writing about AI.",
      color: "#ffc27a",
      skills: ["Evals", "Prompting", "Docs"],
      followers: 0,
      rating: 0,
      home: Gc(-58, 104, "#ffc27a", "#2f6fe0", "villa", 3, "grid"),
      avatar: { acc: "crown", trail: "none", board: "classic" },
    },
    {
      id: "u-leo",
      name: "Leo Carter",
      handle: "leo",
      title: "Voice AI Engineer",
      bio: "Realtime voice agents, call-center bots and custom TTS.",
      color: "#7fd1ff",
      skills: ["Realtime voice", "TTS", "Telephony"],
      followers: 0,
      rating: 0,
      home: Gc(-112, 96, "#7fd1ff", "#ff9a3c", "tower", 6),
      avatar: { acc: "antenna", trail: "blue", board: "neon" },
    },
    {
      id: "u-amara",
      name: "Amara Hayes",
      handle: "amara",
      title: "Computer Vision Lead",
      bio: "Vision agents for retail, OCR and medical imaging.",
      color: "#45e0ae",
      skills: ["YOLO", "OCR", "VLMs"],
      followers: 0,
      rating: 0,
      home: Gc(-24, 88, "#45e0ae", "#ffc27a", "pyramid", 5, "marble"),
      avatar: { acc: "orbit", trail: "rainbow", board: "neon" },
    },
    {
      id: "u-owen",
      name: "Owen Brooks",
      handle: "owen",
      title: "AI Startup Founder",
      bio: "I hire talent for AI products. Three startups and counting.",
      color: "#ff7a59",
      skills: ["Product", "Hiring"],
      followers: 0,
      rating: 0,
      home: Gc(-86, 132, "#ff7a59", "#4da3ff", "stack", 5, "grid"),
      avatar: { acc: "none", trail: "ember", board: "flame" },
    },
  ],
  Mw = {
    id: "u-me",
    name: "Asma",
    handle: "asma",
    title: "AI Creator",
    bio: "My corner of Fyrus. Agents, gigs and videos, all in one place.",
    color: "#a8d8ff",
    skills: ["AI Agents", "Automation", "Content"],
    followers: 0,
    rating: 0,
    home: Gc(-136, 66, "#a8d8ff", "#ff9a3c", "tower", 4),
    avatar: { acc: "halo", trail: "blue", board: "classic" },
  },
  dp = [
    {
      id: "a-1",
      sample: !0,
      ownerId: "u-nova",
      name: "ResearchPilot",
      tagline: "A sourced research brief on any topic in two minutes",
      category: "Research",
      price: 49,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 30,
      persona: "research",
      skills: ["Web search", "Citations", "Summaries"],
      createdAt: ia(300),
    },
    {
      id: "a-2",
      sample: !0,
      ownerId: "u-nova",
      name: "InboxZero",
      tagline: "Triage email, draft replies and chase follow-ups automatically",
      category: "Productivity",
      price: 29,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 25,
      persona: "email",
      skills: ["Gmail", "Drafting", "Scheduling"],
      createdAt: ia(220),
    },
    {
      id: "a-3",
      sample: !0,
      ownerId: "u-leo",
      name: "VoiceDesk",
      tagline: "A realtime phone receptionist that books appointments",
      category: "Voice",
      price: 89,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 20,
      persona: "voice",
      skills: ["Telephony", "Booking", "Multilingual"],
      createdAt: ia(160),
    },
    {
      id: "a-4",
      sample: !0,
      ownerId: "u-zara",
      name: "PromptSmith",
      tagline: "Turns your rough prompt into an eval-tested system prompt",
      category: "Dev Tools",
      price: 19,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 35,
      persona: "prompt",
      skills: ["Evals", "Rewrites", "A/B tests"],
      createdAt: ia(120),
    },
    {
      id: "a-5",
      sample: !0,
      ownerId: "u-amara",
      name: "ShelfSight",
      tagline: "Spots stock-outs and price errors from a single shelf photo",
      category: "Vision",
      price: 129,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 15,
      persona: "vision",
      skills: ["Detection", "OCR", "Reports"],
      createdAt: ia(90),
    },
    {
      id: "a-7",
      sample: !0,
      ownerId: "u-amara",
      name: "TripPilot",
      tagline: "Plans a full trip with bookings, budget and a day-by-day map",
      category: "Travel",
      price: 25,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 30,
      persona: "travel",
      skills: ["Itineraries", "Budgets", "Maps"],
      createdAt: ia(30),
    },
    {
      id: "a-8",
      sample: !0,
      ownerId: "u-zara",
      name: "TutorMate",
      tagline: "A patient tutor for maths, science and languages",
      category: "Education",
      price: 15,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 30,
      persona: "tutor",
      skills: ["Step-by-step", "Quizzes", "Urdu + English"],
      createdAt: ia(25),
    },
    {
      id: "a-9",
      sample: !0,
      ownerId: "u-owen",
      name: "AdCopy Pro",
      tagline: "Writes ads, captions and product pages that sell",
      category: "Marketing",
      price: 35,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 35,
      persona: "copy",
      skills: ["Ads", "SEO", "Brand voice"],
      createdAt: ia(20),
    },
    {
      id: "a-6",
      sample: !0,
      ownerId: "u-kai",
      name: "StoryboardGPT",
      tagline: "Script in, shot-by-shot AI storyboard and prompts out",
      category: "Creative",
      price: 39,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 30,
      persona: "story",
      skills: ["Shot lists", "Video prompts", "Mood boards"],
      createdAt: ia(40),
    },
  ],
  Vc = (t, e, a, r, o, n) => [
    { tier: "Basic", price: t, days: 3, features: r },
    { tier: "Standard", price: e, days: 5, features: o },
    { tier: "Premium", price: a, days: 7, features: n },
  ],
  G2 = [
    {
      id: "g-1",
      sample: !0,
      ownerId: "u-nova",
      title: "I will build a custom RAG chatbot for your business",
      category: "AI Agents",
      packages: Vc(
        150,
        420,
        990,
        ["1 data source", "Web widget"],
        ["5 sources", "Widget + Slack", "Eval report"],
        ["Unlimited sources", "Multi-agent", "Analytics", "30 days support"],
      ),
      rating: 0,
      orders: 0,
      commission: 15,
      createdAt: ia(500),
    },
    {
      id: "g-2",
      sample: !0,
      ownerId: "u-kai",
      title: "I will create a 60-second cinematic AI brand film",
      category: "AI Video",
      packages: Vc(
        90,
        240,
        600,
        ["15s clip", "1 revision"],
        ["30s", "Music", "2 revisions"],
        ["60s", "Voiceover", "4K", "Unlimited revisions"],
      ),
      rating: 0,
      orders: 0,
      commission: 20,
      createdAt: ia(380),
    },
    {
      id: "g-3",
      sample: !0,
      ownerId: "u-zara",
      title: "I will write prompts and an eval suite for your LLM app",
      category: "Prompt Engineering",
      packages: Vc(
        60,
        180,
        450,
        ["5 prompts"],
        ["15 prompts", "Eval set (50)"],
        ["Full system", "Eval set (300)", "CI integration"],
      ),
      rating: 0,
      orders: 0,
      commission: 15,
      createdAt: ia(260),
    },
    {
      id: "g-4",
      sample: !0,
      ownerId: "u-leo",
      title: "I will set up a realtime AI voice agent (Twilio + LLM)",
      category: "Voice AI",
      packages: Vc(
        200,
        550,
        1300,
        ["1 call flow", "English"],
        ["3 flows", "Multilingual"],
        ["Custom voice", "CRM sync", "Monitoring"],
      ),
      rating: 0,
      orders: 0,
      commission: 12,
      createdAt: ia(140),
    },
    {
      id: "g-5",
      sample: !0,
      ownerId: "u-amara",
      title: "I will build an AI OCR and extraction pipeline for documents",
      category: "Computer Vision",
      packages: Vc(
        120,
        340,
        800,
        ["1 document type"],
        ["4 document types", "API"],
        ["Unlimited", "Human review UI", "Dashboard"],
      ),
      rating: 0,
      orders: 0,
      commission: 15,
      createdAt: ia(70),
    },
  ];
G2.push(
  {
    id: "g-6",
    ownerId: "u-kai",
    title: "I will design an AI logo and full brand kit",
    category: "AI Design",
    packages: Vc(
      80,
      220,
      520,
      ["3 logo ideas"],
      ["Logo + colours + fonts", "Social kit"],
      ["Full brand book", "Sign + shop branding", "Motion logo"],
    ),
    rating: 0,
    orders: 0,
    commission: 15,
    createdAt: ia(60),
  },
  {
    id: "g-7",
    ownerId: "u-leo",
    title: "I will compose an AI music jingle for your ad or shop",
    category: "AI Music",
    packages: Vc(
      50,
      140,
      380,
      ["15s jingle"],
      ["30s jingle", "2 versions"],
      ["60s track", "Stems", "Voice tag"],
    ),
    rating: 0,
    orders: 0,
    commission: 15,
    createdAt: ia(45),
  },
);
