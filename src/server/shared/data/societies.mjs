// src/data/societies.ts
var STREET = 10;
var rectH = (rows, sp) => 8 + rows * sp + Math.floor((rows - 1) / 2) * STREET + 8;
var SOCIETIES = [
  { id: "executive", code: "EX", tier: 2, name: "Executive Enclave", tagline: "Townhouses and villas for merchants, teachers and professionals", color: "#4da3ff", x0: -210, z0: 345, cols: 35, rows: 20, sp: 12, count: 700, empty: 140, base: 25e3, passport: false, gate: { x: 0, z: 333, face: { x: 0, z: 400 } } },
  { id: "marina", code: "MB", tier: 3, name: "Marina Bay Society", tagline: "Gated oceanfront mansions with private yacht docks", color: "#45e0ae", x0: 470, z0: -366, cols: 50, rows: 10, sp: 12, count: 500, empty: 100, base: 8e4, passport: false, gate: { x: 458, z: -300, face: { x: 520, z: -300 } } },
  { id: "royal", code: "RS", tier: 4, name: "Royal Sky Society", tagline: "Ultra-exclusive hillside mansions with AI security \u2014 passport holders and invited guests only", color: "#ffc27a", x0: -1010, z0: -150, cols: 25, rows: 17, sp: 16, count: 410, empty: 120, base: 25e4, passport: true, gate: { x: -584, z: 0, face: { x: -650, z: 0 } } }
];
var STARTER = { id: "starter", code: "SC", tier: 1, name: "Starter Commons", tagline: "Clean modern studio apartments \u2014 free for every visitor", color: "#a8d8ff", x: 330, z: 260, towers: 6, floors: 24, perFloor: 8 };
var societyRect = (s) => ({ x0: s.x0, z0: s.z0, x1: s.x0 + s.cols * s.sp + 16, z1: s.z0 + rectH(s.rows, s.sp) });
var STARTER_RECT = { x0: STARTER.x - 50, z0: STARTER.z - 60, x1: STARTER.x + 50, z1: STARTER.z + 60 };
var ESTATE_RECTS = [...SOCIETIES.map(societyRect), STARTER_RECT].map((r) => ({ x0: r.x0 - 10, z0: r.z0 - 10, x1: r.x1 + 10, z1: r.z1 + 10 }));
var h32 = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};
var FIRSTN = ["Ayesha", "Omar", "Lina", "Noah", "Sara", "Bilal", "Mei", "Arjun", "Zara", "Leo", "Hana", "Yusuf", "Ivy", "Kenji", "Amara", "Diego", "Nora", "Samir", "Elena", "Tariq", "Maya", "Ravi", "Chloe", "Imran", "Sofia", "Daniyal", "Aiko", "Hamza", "Lucia", "Farah"];
var LASTN = ["Khan", "Malik", "Chen", "Silva", "Haddad", "Patel", "Rossi", "Kim", "Okafor", "Novak", "Rahman", "Tanaka", "Garcia", "Iqbal", "Larsen", "Mensah", "Costa", "Sato", "Qureshi", "Moreau"];
var cache = {};
function plotsOf(s) {
  if (cache[s.id]) return cache[s.id];
  const ids = Array.from({ length: s.count }, (_, i) => `${s.code}-${String(i + 1).padStart(4, "0")}`);
  const empty = new Set([...ids].sort((a, b) => h32(a + "e") - h32(b + "e")).slice(0, s.empty));
  const out = ids.map((id, i) => {
    const col = i % s.cols, row = Math.floor(i / s.cols);
    const h = h32(id);
    const x = s.x0 + 8 + s.sp / 2 + col * s.sp;
    const z = s.z0 + 8 + s.sp / 2 + row * s.sp + Math.floor(row / 2) * STREET;
    const seaFront = s.id === "marina" && row <= 1;
    const price = Math.round(s.base * (seaFront ? 1.6 : 1) * (0.9 + h % 200 / 1e3) / 100) * 100;
    const isEmpty = empty.has(id);
    return { id, soc: s.id, n: i + 1, x, z, face: row % 2 === 0 ? -1 : 1, size: s.sp - 2, price, seaFront, empty: isEmpty, resident: isEmpty ? void 0 : `${FIRSTN[h % FIRSTN.length]} ${LASTN[(h >>> 8) % LASTN.length]}`, style: (h >>> 16) % 3 };
  });
  return cache[s.id] = out;
}
var estatePlotById = (id) => {
  const s = SOCIETIES.find((x) => id.startsWith(x.code + "-"));
  return s ? plotsOf(s)[+id.slice(3) - 1] : void 0;
};
var societyById = (id) => SOCIETIES.find((s) => s.id === id);
var RESIDENTS = SOCIETIES.reduce((a, s) => a + s.count - s.empty, 0);
var EMPTY_PLOTS = SOCIETIES.reduce((a, s) => a + s.empty, 0);
var STUDIOS = STARTER.towers * STARTER.floors * STARTER.perFloor;
var studioId = (k) => {
  const per = STARTER.floors * STARTER.perFloor;
  const t = Math.floor(k / per), r = k % per;
  return `SC-T${t + 1}-${String(Math.floor(r / STARTER.perFloor) + 1).padStart(2, "0")}${String.fromCharCode(65 + r % STARTER.perFloor)}`;
};

