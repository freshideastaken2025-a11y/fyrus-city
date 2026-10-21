// src/data/furniture.ts
var FURNITURE = [
  { id: "sofa", name: "Sofa", cat: "Living", w: 2.4, d: 0.95, color: "#8a9bb0" },
  { id: "lsofa", name: "Corner sofa", cat: "Living", w: 2.8, d: 2.2, color: "#c8bfae" },
  { id: "armchair", name: "Armchair", cat: "Living", w: 0.95, d: 0.95, color: "#b36b4a" },
  { id: "coffee", name: "Coffee table", cat: "Living", w: 1.2, d: 0.7, color: "#7a5a3c" },
  { id: "tv", name: "TV + stand", cat: "Living", w: 2, d: 0.5, color: "#2b2b2b" },
  { id: "rug", name: "Rug", cat: "Living", w: 3, d: 2, color: "#a34a3c" },
  { id: "rugr", name: "Round rug", cat: "Living", w: 2.2, d: 2.2, color: "#3f6f8f" },
  { id: "fireplace", name: "Fireplace", cat: "Living", w: 1.8, d: 0.5, color: "#d8d2c6", wall: true },
  { id: "bed2", name: "Double bed", cat: "Bedroom", w: 1.8, d: 2.2, color: "#e9e4da" },
  { id: "bed1", name: "Single bed", cat: "Bedroom", w: 1.1, d: 2.1, color: "#c9d6e3" },
  { id: "wardrobe", name: "Wardrobe", cat: "Bedroom", w: 1.6, d: 0.6, color: "#efe9df", wall: true },
  { id: "nightstand", name: "Bedside table", cat: "Bedroom", w: 0.5, d: 0.45, color: "#7a5a3c" },
  { id: "mirror", name: "Mirror", cat: "Bedroom", w: 0.8, d: 0.1, color: "#d4a64a", wall: true },
  { id: "dining", name: "Dining table", cat: "Kitchen", w: 1.8, d: 1, color: "#9a7450" },
  { id: "chair", name: "Chair", cat: "Kitchen", w: 0.5, d: 0.5, color: "#2b2e33" },
  { id: "counter", name: "Kitchen counter", cat: "Kitchen", w: 2.4, d: 0.65, color: "#f2f2ee", wall: true },
  { id: "fridge", name: "Fridge", cat: "Kitchen", w: 0.8, d: 0.7, color: "#dfe3e8", wall: true },
  { id: "desk", name: "Desk + laptop", cat: "Work", w: 1.4, d: 0.7, color: "#efe9df" },
  { id: "office", name: "Office chair", cat: "Work", w: 0.6, d: 0.6, color: "#1b1d22" },
  { id: "shelf", name: "Bookshelf", cat: "Work", w: 1.2, d: 0.35, color: "#7a5a3c", wall: true },
  { id: "plant", name: "Big plant", cat: "Decor", w: 0.7, d: 0.7, color: "#4f7f35" },
  { id: "plants", name: "Small plant", cat: "Decor", w: 0.4, d: 0.4, color: "#5f8f45" },
  { id: "lamp", name: "Floor lamp", cat: "Decor", w: 0.4, d: 0.4, color: "#f2e6c9" },
  { id: "art", name: "Painting", cat: "Decor", w: 1.4, d: 0.06, color: "#ff9a3c", wall: true },
  { id: "aquarium", name: "Aquarium", cat: "Decor", w: 1.6, d: 0.6, color: "#6fb7d9" },
  { id: "vase", name: "Flower vase", cat: "Decor", w: 0.35, d: 0.35, color: "#e05a8a" },
  { id: "piano", name: "Piano", cat: "Fun", w: 1.5, d: 0.6, color: "#111111", wall: true },
  { id: "arcade", name: "Arcade cabinet", cat: "Fun", w: 0.8, d: 0.8, color: "#4da3ff" },
  { id: "beanbag", name: "Bean bag", cat: "Fun", w: 0.9, d: 0.9, color: "#ffc27a" },
  { id: "prayer", name: "Prayer mat", cat: "Decor", w: 0.7, d: 1.2, color: "#2f6a4f" }
];
var FURN = Object.fromEntries(FURNITURE.map((f) => [f.id, f]));
var FLOORS = [
  { id: "oak", name: "Oak wood", color: "#a7835e" },
  { id: "walnut", name: "Walnut", color: "#6b4a32" },
  { id: "tile", name: "White tile", color: "#e9e6e0" },
  { id: "marble", name: "Marble", color: "#f1eee9" },
  { id: "carpet", name: "Carpet", color: "#8a8f99" },
  { id: "concrete", name: "Concrete", color: "#b5b1aa" }
];
var FENCES = [{ id: "none", name: "No fence" }, { id: "hedge", name: "Hedge" }, { id: "picket", name: "White picket" }, { id: "iron", name: "Black iron" }, { id: "wall", name: "Low wall" }];
var GARDENS = [{ id: "lawn", name: "Lawn" }, { id: "flowers", name: "Flower beds" }, { id: "stone", name: "Stone patio" }, { id: "trees", name: "Fruit trees" }];
var MAX_ITEMS = 120;
var PASS_MS = 2 * 36e5;
var homeKind = (key) => /^(EX|MB|RS)-\d{4}$/.test(key) ? "house" : key.startsWith("studio:") ? "studio" : key.startsWith("home:") ? "home" : "";
var roomSize = (key) => homeKind(key) === "studio" ? { w: 11, d: 10, h: 3.2 } : homeKind(key) === "home" ? { w: 16, d: 14, h: 3.6 } : { w: 18, d: 15, h: 3.6 };
var HEX = /^#[0-9a-f]{6}$/i;
var hex = (v, d) => typeof v === "string" && HEX.test(v) ? v.toLowerCase() : d;
var pick = (v, list, d) => list.some((x) => x.id === v) ? String(v) : d;
var num = (v, lim) => {
  const n = Math.round((+v || 0) * 100) / 100;
  return Math.max(-lim, Math.min(lim, n));
};
var DEFAULT_EXT = { wall: "#ffffff", roof: "#5a3f35", trim: "#ffffff", fence: "hedge", garden: "lawn" };
function cleanExt(e) {
  e = e || {};
  return { wall: hex(e.wall, DEFAULT_EXT.wall), roof: hex(e.roof, DEFAULT_EXT.roof), trim: hex(e.trim, DEFAULT_EXT.trim), fence: pick(e.fence, FENCES, "hedge"), garden: pick(e.garden, GARDENS, "lawn") };
}
function cleanInt(v, key) {
  v = v || {};
  const r = roomSize(key);
  const hx = r.w / 2 - 0.2, hz = r.d / 2 - 0.2;
  const items = (Array.isArray(v.items) ? v.items : []).slice(0, MAX_ITEMS).filter((i) => i && FURN[i.k]).map((i) => ({ k: String(i.k), x: num(i.x, hx), z: num(i.z, hz), r: Math.round(((+i.r || 0) % 360 + 360) % 360), ...i.c && HEX.test(i.c) ? { c: String(i.c).toLowerCase() } : {} }));
  return { wall: hex(v.wall, "#f1ede6"), floor: pick(v.floor, FLOORS, "oak"), accent: hex(v.accent, "#c9d3dc"), items };
}
function defaultInt(key) {
  const k = homeKind(key);
  if (k === "studio") return { wall: "#f1ede6", floor: "oak", accent: "#dfe6ee", items: [
    { k: "bed1", x: -3.6, z: -3, r: 0 },
    { k: "nightstand", x: -2.4, z: -4.2, r: 0 },
    { k: "sofa", x: 2.6, z: 0.6, r: 180 },
    { k: "tv", x: 2.6, z: -4.4, r: 0 },
    { k: "rug", x: 2.6, z: -1.8, r: 0 },
    { k: "counter", x: -3.8, z: 2.6, r: 90 },
    { k: "plant", x: 4.6, z: 3.6, r: 0 },
    { k: "desk", x: -0.6, z: -4.3, r: 0 },
    { k: "office", x: -0.6, z: -3.5, r: 180 }
  ] };
  return { wall: "#f1ede6", floor: "oak", accent: "#c9d3dc", items: [
    { k: "lsofa", x: -4.5, z: -1.5, r: 0 },
    { k: "coffee", x: -4.2, z: 0.2, r: 0 },
    { k: "rug", x: -4.2, z: 0, r: 0 },
    { k: "tv", x: -4.2, z: 3.6, r: 180 },
    { k: "dining", x: 3.8, z: 2.4, r: 0 },
    { k: "chair", x: 3.2, z: 1.6, r: 0 },
    { k: "chair", x: 4.4, z: 1.6, r: 0 },
    { k: "chair", x: 3.2, z: 3.2, r: 180 },
    { k: "chair", x: 4.4, z: 3.2, r: 180 },
    { k: "counter", x: 6.5, z: -4.8, r: 0 },
    { k: "fridge", x: 8.2, z: -6.6, r: 0 },
    { k: "bed2", x: -6.6, z: -5.2, r: 0 },
    { k: "wardrobe", x: -3.6, z: -7, r: 0 },
    { k: "plant", x: 0, z: -6.6, r: 0 },
    { k: "lamp", x: -8.2, z: 1.8, r: 0 },
    { k: "art", x: 0, z: -7.4, r: 0 }
  ] };
}

