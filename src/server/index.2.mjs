// server/index.ts
var PORT = Number(process.env.PORT || 80);
var PUBLIC = process.env.PUBLIC_DIR || path2.join(process.cwd(), "public");
var DATA_DIR = process.env.DATA_DIR || "/data";
var AI_KEY = process.env.ANTHROPIC_API_KEY || "";
var AI_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5";
var NEAR = 40;
var MAX_TEXT = 500;
var db = { users: {}, threads: {}, groups: {}, plots: {}, reports: [] };
var dbFile = path2.join(DATA_DIR, "fyrus.json");
/* ---- safe storage (v42) ----
   - every save: write a temp file, fsync it, rename it over fyrus.json, fsync the folder (no half-written file after a crash or power cut)
   - start-up: if fyrus.json is missing or damaged, never start empty; recover from fyrus.json.tmp, then the newest hourly
     snapshot, then the newest daily backup, and keep the damaged file aside as fyrus.json.damaged-<time>
   - a save that would suddenly lose more than half of the citizens is written to a side file instead (protects against bugs) */
var DB_INFO = { loadedFrom: "", users: 0, savedAt: 0, saveErrors: 0, guarded: 0 };
function readDbFile(f) {
  let raw = fs2.readFileSync(f);
  if (f.endsWith(".gz")) raw = zlib.gunzipSync(raw);
  const v = JSON.parse(raw.toString("utf8"));
  if (!v || typeof v !== "object" || !v.users || typeof v.users !== "object") throw new Error("not a Fyrus database");
  return v;
}
function listBackups(dir) {
  try { return fs2.readdirSync(dir).filter((x) => x.startsWith("fyrus-") && x.endsWith(".json.gz")).sort().reverse().map((x) => path2.join(dir, x)); } catch { return []; }
}
{
  fs2.mkdirSync(DATA_DIR, { recursive: true });
  const exists = fs2.existsSync(dbFile);
  const tries = [dbFile, dbFile + ".tmp", ...listBackups(path2.join(DATA_DIR, "backups", "hourly")), ...listBackups(path2.join(DATA_DIR, "backups"))];
  let ok = false;
  for (const f of tries) {
    if (!fs2.existsSync(f)) continue;
    try {
      const v = readDbFile(f);
      db = { ...db, ...v };
      DB_INFO.loadedFrom = path2.basename(f);
      ok = true;
      if (f !== dbFile) {
        console.error("DATABASE RECOVERED from", f);
        if (exists) try { fs2.renameSync(dbFile, dbFile + ".damaged-" + Date.now()); } catch {}
      }
      break;
    } catch (e) {
      console.error("could not read", f, String(e && e.message || e));
    }
  }
  if (ok) console.log("loaded", Object.keys(db.users).length, "users from", DB_INFO.loadedFrom);
  else if (exists) {
    console.error("DATABASE DAMAGED and no backup could be read; keeping the damaged file aside and starting fresh");
    try { fs2.renameSync(dbFile, dbFile + ".damaged-" + Date.now()); } catch {}
  } else console.log("fresh database at", dbFile);
  DB_INFO.users = Object.keys(db.users).length;
  if (ok && DB_INFO.loadedFrom !== path2.basename(dbFile)) try { writeDb(); } catch (e) { console.error("could not write the recovered database", e); }
}
function writeDb() {
  const n = Object.keys(db.users || {}).length;
  const body = JSON.stringify(db);
  let target = dbFile;
  if (DB_INFO.users > 20 && n < DB_INFO.users * 0.5) {
    DB_INFO.guarded++;
    target = path2.join(DATA_DIR, "fyrus.suspect.json");
    console.error("SAVE GUARD: citizens dropped from", DB_INFO.users, "to", n, "- writing", target, "instead");
  }
  const tmp = target + ".tmp";
  const fd = fs2.openSync(tmp, "w");
  try { fs2.writeSync(fd, body); fs2.fsyncSync(fd); } finally { fs2.closeSync(fd); }
  fs2.renameSync(tmp, target);
  try { const dfd = fs2.openSync(DATA_DIR, "r"); try { fs2.fsyncSync(dfd); } finally { fs2.closeSync(dfd); } } catch {}
  if (target === dbFile) { DB_INFO.users = n; DB_INFO.savedAt = Date.now(); }
}
var saveT = null;
function save() {
  if (saveT) return;
  saveT = setTimeout(() => {
    saveT = null;
    try {
      writeDb();
    } catch (e) {
      DB_INFO.saveErrors++;
      console.error("save failed", e);
    }
  }, 1500);
}
function flush() {
  if (saveT) {
    clearTimeout(saveT);
    saveT = null;
  }
  try {
    writeDb();
  } catch (e) {
    DB_INFO.saveErrors++;
    console.error("flush failed", e);
  }
}
for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => {
  flush();
  process.exit(0);
});
var sha = (s) => crypto3.createHash("sha256").update(s).digest("hex");
var rid = (n = 12) => crypto3.randomBytes(n).toString("base64url");
function newNumber() {
  for (; ; ) {
    const n = `+2040-${crypto3.randomInt(200, 1e3)}-${String(crypto3.randomInt(0, 1e4)).padStart(4, "0")}`;
    if (!Object.values(db.users).some((u) => u.number === n)) return n;
  }
}
var digits = (s) => String(s || "").replace(/\D/g, "");
var findByNumber = (n) => {
  const d = digits(n);
  if (d.length < 7) return void 0;
  return Object.values(db.users).find((u) => {
    const ud = digits(u.number);
    return ud === d || ud.slice(-7) === d.slice(-7);
  });
};
{
  let moved = 0;
  for (const u of Object.values(db.users)) if (!u.number.startsWith("+2040")) {
    const d = digits(u.number).slice(-7);
    const n = `+2040-${d.slice(0, 3)}-${d.slice(3)}`;
    u.number = Object.values(db.users).some((x) => x.number === n) ? newNumber() : n;
    moved++;
  }
  if (moved) {
    console.log("moved", moved, "numbers to +2040");
    try {
      writeDb();
    } catch {
    }
  }
}
var alias = (u) => "Citizen #X" + String(parseInt(sha(u.id).slice(0, 6), 16) % 1e3).padStart(3, "0");
var shown = (u) => u.stealth ? alias(u) : u.name;
var clean = (s, n) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
var BAD = ["fuck", "shit", "bitch", "bastard", "cunt", "dick", "asshole", "slut", "whore", "nigger", "faggot", "retard", "madarchod", "behenchod", "bhenchod", "chutiya", "chutia", "harami", "haramzada", "kutta", "kutiya", "gandu", "randi", "bhosdi", "lund", "kanjar"];
var badRe = new RegExp(`\\b(${BAD.join("|")})\\w*`, "gi");
var filter = (t) => t.replace(badRe, (m) => "*".repeat(m.length));
var tcache = /* @__PURE__ */ new Map();
async function translate(text, lang) {
  if (!AI_KEY || !text.trim()) return null;
  const key = lang + "|" + text;
  const hit = tcache.get(key);
  if (hit !== void 0) return hit;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": AI_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: AI_MODEL, max_tokens: 600, system: `You translate chat messages in a game city. Translate the user's message into ${langName(lang)}. If it is already in ${langName(lang)}, return it unchanged. Romanized Urdu/Hindi counts as Urdu/Hindi. Keep names, emojis and numbers. Output only the translated message, nothing else.`, messages: [{ role: "user", content: text }] })
    });
    if (!r.ok) {
      console.error("translate", r.status, (await r.text()).slice(0, 200));
      return null;
    }
    const j = await r.json();
    const out = String(j?.content?.[0]?.text || "").trim();
    if (tcache.size > 5e3) tcache.clear();
    tcache.set(key, out);
    return out;
  } catch (e) {
    console.error("translate failed", e);
    return null;
  }
}
var live = /* @__PURE__ */ new Map();
var send = (ws, m) => {
  if (ws.readyState === import_websocket.default.OPEN) ws.send(JSON.stringify(m));
};
var pub = (u) => ({ id: u.id, name: shown(u), color: u.stealth ? "#8a8f98" : u.color, number: u.number, stealth: !!u.stealth });
var blocked = (a, b) => a.blocks.includes(b.id) || b.blocks.includes(a.id);
var threadId = (a, b) => "dm:" + [a, b].sort().join(":");
async function deliver(from, to, m) {
  const byLang = /* @__PURE__ */ new Map();
  to.forEach((l) => {
    if (blocked(from, l.u)) return;
    const k = l.u.lang || "en";
    byLang.set(k, [...byLang.get(k) || [], l]);
  });
  await Promise.all([...byLang].map(async ([lang, ls]) => {
    const tr = await translate(m.text, lang);
    ls.forEach((l) => send(l.ws, { t: "msg", ...m, from: from.id, fromName: shown(from), color: from.stealth ? "#8a8f98" : from.color, number: from.number, text: tr && tr !== m.text ? tr : m.text, orig: tr && tr !== m.text ? m.text : void 0, lang }));
  }));
}
function onMessage(me, raw) {
  let m;
  try {
    m = JSON.parse(raw);
  } catch {
    return;
  }
  const u = me.u;
  if (edu.onMessage(me, m) || bank.onMessage(me, m) || market.onMessage(me, m) || estate.onMessage(me, m) || news.onMessage(me, m) || ads.onMessage(me, m) || halls.onMessage(me, m) || homes.onMessage(me, m) || politics.onMessage(me, m) || jobs.onMessage(me, m) || ops.onMessage(me, m)) return;
  switch (m.t) {
    case "pos": {
      me.x = +m.x || 0;
      me.z = +m.z || 0;
      me.y = +m.y || 0;
      me.ry = +m.ry || 0;
      me.scene = clean(m.scene, 40) || "plaza";
      me.o = m.o;
      me.v = m.v ?? null;
      if (typeof m.photo === "string" && m.photo.startsWith("data:image/") && m.photo.length < 4e3 && m.photo !== u.photo) {
        u.photo = m.photo;
        save();
      }
      return;
    }
    case "say": {
      const now = Date.now();
      me.rate = me.rate.filter((t) => now - t < 5e3);
      if (me.rate.length >= 8) return send(me.ws, { t: "err", text: "Slow down a little." });
      me.rate.push(now);
      if (u.muteUntil && u.muteUntil > now) return send(me.ws, { t: "err", text: `You are muted until ${new Date(u.muteUntil).toUTCString().slice(17, 22)} UTC.` });
      const text = filter(clean(m.text, MAX_TEXT));
      if (!text) return;
      const id = rid(8);
      if (m.channel === "near") {
        const to = [...live.values()].filter((l) => l !== me && l.scene === me.scene && Math.hypot(l.x - me.x, l.z - me.z) < NEAR);
        deliver(u, [me, ...to], { channel: "near", text, id, at: now });
        return;
      }
      if (m.channel === "city") {
        deliver(u, [...live.values()], { channel: "city", text, id, at: now });
        return;
      }
      if (m.channel === "dm") {
        const target = db.users[m.to] || findByNumber(String(m.to || ""));
        if (!target) return send(me.ws, { t: "err", text: "No citizen has that number." });
        if (blocked(u, target)) return send(me.ws, { t: "err", text: "You cannot message this person." });
        const th = threadId(u.id, target.id);
        const rec = { id, from: u.id, fromName: shown(u), text, at: now };
        db.threads[th] = [...db.threads[th] || [], rec].slice(-200);
        save();
        const tl = live.get(target.id);
        deliver(u, [me, ...tl ? [tl] : []], { channel: "dm", text, thread: th, id, at: now });
        return;
      }
      if (m.channel === "group") {
        const g = db.groups[m.group];
        if (!g || !g.members.includes(u.id)) return;
        const th = "group:" + g.id;
        db.threads[th] = [...db.threads[th] || [], { id, from: u.id, fromName: shown(u), text, at: now }].slice(-300);
        save();
        deliver(u, g.members.map((id2) => live.get(id2)).filter(Boolean), { channel: "group", group: g.id, thread: th, text, id, at: now });
        return;
      }
      return;
    }
    case "history": {
      const th = clean(m.thread, 120);
      if (!th.includes(u.id) && !(th.startsWith("group:") && db.groups[th.slice(6)]?.members.includes(u.id))) return;
      send(me.ws, { t: "history", thread: th, msgs: (db.threads[th] || []).filter((x) => {
        const f = db.users[x.from];
        return !f || !blocked(u, f);
      }) });
      return;
    }
    case "threads": {
      const mine = Object.keys(db.threads).filter((k) => k.startsWith("dm:") && k.split(":").includes(u.id) || k.startsWith("group:") && db.groups[k.slice(6)]?.members.includes(u.id));
      send(me.ws, { t: "threads", list: mine.map((k) => {
        const last = db.threads[k].at(-1);
        const other = k.startsWith("dm:") ? db.users[k.split(":").slice(1).find((x) => x !== u.id) || ""] : null;
        return { thread: k, last, with: other ? pub(other) : null, group: k.startsWith("group:") ? db.groups[k.slice(6)] : null };
      }) });
      return;
    }
    case "lookup": {
      const n = clean(m.number, 24);
      const x = findByNumber(n);
      send(me.ws, { t: "lookup", number: n, user: x ? { ...pub(x), online: live.has(x.id) } : null });
      return;
    }
    case "profile": {
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.color) u.color = clean(m.color, 9);
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      if (typeof m.stealth === "boolean") u.stealth = m.stealth;
      if (m.passport) {
        const want = m.passport.kind === "visa" ? "visa" : "passport";
        const had = u.passport?.kind === "passport";
        let kind = want;
        if (want === "passport" && !had) {
          const v = passportCheck(u.id, +m.passport.level || 0);
          if (!v.ok) {
            kind = "visa";
            send(me.ws, { t: "passport_denied", text: v.why });
          }
        }
        u.passport = { no: +m.passport.no || 0, interest: clean(m.passport.interest, 20), kind, verified: kind === "passport" ? true : void 0, at: u.passport?.at || Date.now() };
      }
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "block": {
      const id = clean(m.id, 40);
      if (!u.blocks.includes(id) && db.users[id]) u.blocks.push(id);
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "unblock": {
      u.blocks = u.blocks.filter((b) => b !== m.id);
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "report": {
      // Safety: limit report spam, and pause chat for someone several trusted citizens report,
      // until a judge reviews it in the admin desk.
      const now = Date.now(), DAY = 864e5, against = clean(m.id, 40);
      const mine = db.reports.filter((r) => r.by === u.id && now - r.at < DAY);
      if (mine.length >= 15) return send(me.ws, { t: "err", text: "You have sent many reports today. A judge will review them soon." });
      if (mine.some((r) => r.against === against)) return send(me.ws, { t: "ok", text: "You already reported this citizen today. A judge will review it." });
      db.reports.push({ by: u.id, against, reason: clean(m.reason, 400), msg: clean(m.msg, 600), at: now });
      if (db.reports.length > 5e3) db.reports.splice(0, db.reports.length - 5e3);
      const target = db.users[against];
      if (target && !isAdmin(target.id)) {
        const trusted = (x) => !!x && (x.email || x.google || now - (x.joined || now) > DAY);
        const by = new Set(db.reports.filter((r) => r.against === against && now - r.at < DAY && trusted(db.users[r.by])).map((r) => r.by));
        if (by.size >= 3 && !(target.muteUntil > now)) {
          target.muteUntil = now + DAY;
          target.autoMuted = now;
          const l = live.get(target.id);
          if (l) send(l.ws, { t: "err", text: "Several citizens reported your messages. Your chat is paused for 24 hours while a judge reviews it." });
          console.log("auto-mute", target.number, by.size, "reports");
        }
      }
      save();
      send(me.ws, { t: "ok", text: "Report sent to the Justice ministry." });
      return;
    }
    case "group_create": {
      const members = [u.id, ...(m.numbers || []).map((n) => findByNumber(String(n))?.id).filter(Boolean)];
      const g = { id: rid(6), name: clean(m.name, 40) || "Group", owner: u.id, members: [...new Set(members)], at: Date.now() };
      db.groups[g.id] = g;
      save();
      g.members.forEach((id) => {
        const l = live.get(id);
        if (l) send(l.ws, { t: "group", group: g });
      });
      return;
    }
    case "group_add": {
      const g = db.groups[m.group];
      if (!g || !g.members.includes(u.id)) return;
      const x = findByNumber(String(m.number));
      if (x && !g.members.includes(x.id)) {
        g.members.push(x.id);
        save();
      }
      g.members.forEach((id) => {
        const l = live.get(id);
        if (l) send(l.ws, { t: "group", group: g });
      });
      return;
    }
    case "voice": {
      if (m.on && !u.age18) {
        me.voice = false;
        return send(me.ws, { t: "need_age18" });
      }
      me.voice = !!m.on;
      return;
    }
    case "acct_age18": {
      u.age18 = true;
      save();
      send(me.ws, { t: "me", me: meOf(u) });
      return;
    }
    case "rtc": {
      const to = live.get(clean(m.to, 40));
      if (!to || blocked(u, to.u)) return;
      send(to.ws, { t: "rtc", from: u.id, fromName: shown(u), number: u.number, kind: clean(m.kind, 20), data: m.data });
      return;
    }
    case "plot": {
      // Land is paid for on the server: price, 5% transfer tax (none for passport holders),
      // the seller is paid directly, and the Land Bank buys back at 90% of value.
      const id = clean(m.id, 12);
      const cur = db.plots[id];
      const land = LAND[id];
      const note = (text) => send(me.ws, { t: "note", text });
      if (m.release) {
        if (cur?.owner === u.id) {
          const refund = land ? Math.round(landValue(id) * 0.9) : 0;
          delete db.plots[id];
          if (refund > 0) bank.transfer("treasury", u.id, refund, `Sold plot ${id} to the Land Bank (90% of value)`) || bank.transfer("mint", u.id, refund, `Sold plot ${id} to the Land Bank (90% of value)`);
          bank.notify(u.id);
          save();
          broadcast({ t: "plots", plots: { [id]: null } });
        }
        return;
      }
      if (cur && cur.owner === u.id) { // owner edits: use, sign, listing price
        db.plots[id] = { ...cur, ownerName: shown(u), use: clean(m.use, 30) || void 0, sign: clean(m.sign, 28) || void 0, forSale: m.forSale ? Math.max(1, Math.round(+m.forSale)) : void 0, at: Date.now() };
        save();
        broadcast({ t: "plots", plots: { [id]: db.plots[id] } });
        return;
      }
      if (cur && !(cur.forSale && m.buy)) return send(me.ws, { t: "plot_taken", id, owner: cur });
      if (!land) return send(me.ws, { t: "plot_taken", id, owner: cur || null });
      const price = cur ? cur.forSale : land.price; // same as the price shown on the map
      const tax = u.passport?.kind === "passport" ? 0 : Math.round(price * 0.05);
      if (bank.bal(u.id) + 1e-9 < price + tax) {
        bank.notify(u.id);
        note(`You need ${(price + tax).toLocaleString("en-US")} FYC for plot ${id}.`);
        return send(me.ws, { t: "plot_taken", id, owner: cur || null });
      }
      if (cur) {
        if (!bank.transfer(u.id, cur.owner, price, `Bought plot ${id}`)) return bank.notify(u.id);
        bank.notify(cur.owner);
      } else if (!bank.transfer(u.id, "treasury", price, `Plot ${id}`)) return bank.notify(u.id);
      if (tax > 0) bank.transfer(u.id, "treasury", tax, `Transfer tax on plot ${id}`);
      bank.notify(u.id);
      db.plots[id] = { owner: u.id, ownerName: shown(u), paid: price, at: Date.now() };
      save();
      broadcast({ t: "plots", plots: { [id]: db.plots[id] } });
      return;
    }
  }
}
var broadcast = (m) => live.forEach((l) => send(l.ws, m));
// Land plots of the Republic (same layout and prices as the city map in the client).
var LAND = (() => {
  const districts = [
    { code: "CP", capital: true, x: -124, z: 2, base: 4e4, cols: 2, rows: 3, gap: 22 },
    { code: "MC", x: 232, z: -214, base: 15e3, cols: 4, rows: 5, gap: 20 },
    { code: "TC", x: -272, z: -30, base: 12e3, cols: 4, rows: 5, gap: 20 },
    { code: "CC", x: -212, z: 212, base: 9e3, cols: 4, rows: 5, gap: 20 },
    { code: "PC", x: 216, z: 216, base: 8e3, cols: 4, rows: 5, gap: 20 },
    { code: "LC", x: -222, z: -212, base: 6e3, cols: 4, rows: 5, gap: 20 },
    { code: "FD", x: 0, z: 268, base: 2500, cols: 4, rows: 5, gap: 20 }
  ];
  const mult = { prime: 2.5, central: 1.6, standard: 1 };
  const out = {};
  for (const d of districts) {
    const pts = [];
    for (let i = 0; i < d.rows; i++) for (let s = 0; s < d.cols; s++) pts.push({ x: d.x + (s - (d.cols - 1) / 2) * d.gap, z: d.z + (i - (d.rows - 1) / 2) * d.gap });
    const r = pts.map((p) => Math.hypot(p.x, p.z)), lo = Math.min(...r), hi = Math.max(...r);
    pts.forEach((p, k) => {
      const l = hi > lo ? (r[k] - lo) / (hi - lo) : 0;
      const tier = d.capital ? (l < 0.5 ? "prime" : "central") : l < 0.34 ? "prime" : l < 0.67 ? "central" : "standard";
      out[`${d.code}-${String(k + 1).padStart(2, "0")}`] = { code: d.code, price: Math.round(d.base * mult[tier] / 100) * 100 };
    });
  }
  return out;
})();
var landValue = (id) => {
  const p = LAND[id];
  if (!p) return 0;
  const owned = Object.keys(db.plots).filter((k) => LAND[k]?.code === p.code && db.plots[k]).length;
  return Math.round(p.price * (1 + 0.04 * owned) / 100) * 100;
};
setInterval(() => {
  if (!live.size) return;
  const list = [...live.values()].map((l) => ({ id: l.u.id, name: shown(l.u), color: l.u.stealth ? "#8a8f98" : l.u.color, x: l.x, z: l.z, y: l.y, ry: l.ry, sc: l.scene, o: l.o, v: l.v, vc: l.voice, ph: l.u.stealth ? void 0 : l.u.photo, mk: l.u.stealth ? 1 : void 0 }));
  const withPhoto = Date.now() % 4e3 < 130;
  live.forEach((l) => send(l.ws, { t: "peers", list: list.filter((p) => p.id !== l.u.id).map((p) => withPhoto ? p : { ...p, ph: void 0 }) }));
}, 125);
var ADMINS = String(process.env.FYRUS_ADMINS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (ADMINS.length) console.log("court judges:", ADMINS.length);
var isAdmin = (id) => {
  const u = db.users[id];
  return !!u && ADMINS.some((a) => a === id || digits(a).length >= 7 && digits(a).slice(-7) === digits(u.number).slice(-7));
};
/* moderators (v42): FYRUS_MODS = comma-separated +2040 numbers. They review reports, mute and give temporary bans
   (up to 72 hours); judges (FYRUS_ADMINS) can do everything, including permanent bans and backups. */
var MODS = String(process.env.FYRUS_MODS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (MODS.length) console.log("moderators:", MODS.length);
var isMod = (id) => {
  if (isAdmin(id)) return true;
  const u = db.users[id];
  return !!u && MODS.some((a) => a === id || digits(a).length >= 7 && digits(a).slice(-7) === digits(u.number).slice(-7));
};
var nameOf = (id) => ({ mint: "Central Bank of Fyrus", treasury: "National Treasury", escrow: "Central Bank escrow", burn: "Central Bank" })[id] || (db.users[id] ? shown(db.users[id]) : "Citizen");
var news = createNews({ db, save, send, broadcast, clean, filter, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var report = news.report;
function passportCheck(id, level) {
  const land = Object.values(db.plots).some((p) => p.owner === id) || Object.values(db.estate?.plots || {}).some((p) => p.owner === id);
  const seller = Object.values(db.market?.listings || {}).some((l) => l.seller === id) || Object.values(db.edu?.courses || {}).some((c) => c.teacher === id) || (db.bank?.acct?.[id]?.sales || 0) > 0;
  const banned = !!db.bank?.acct?.[id]?.banned;
  const issued = Object.values(db.users).filter((x) => x.passport?.kind === "passport").length;
  if (banned) return { ok: false, why: "Passport refused: this account has a court ban." };
  if (issued >= 1e4) return { ok: false, why: "All 10,000 passports for this year are issued. You are on the waiting list." };
  const n = (land ? 1 : 0) + (seller ? 1 : 0) + (level >= 5 ? 1 : 0);
  if (n >= 2 && (land || seller)) return { ok: true, why: "" };
  return { ok: false, why: `The Citizen Center could not verify two milestones yet (${land ? "land \u2713" : "no land"}, ${seller ? "selling \u2713" : "nothing listed in Fyrus Market or Education City"}). Own land or list something on the live city, then apply again.` };
}
var bank = createBank({ db, save, send, liveOf: (id) => live.get(id), findByNumber, nameOf, clean });
var market = createMarket({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, rid, isAdmin, nameOf, news: report });
var estate = createEstate({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, findByNumber, news: report });
var edu = createEdu({ db, save, send, broadcast, clean, rid, findByNumber, liveOf: (id) => live.get(id), pay: bank.transfer, news: report });
try {
  seedLadder({ db, save });
} catch (e) {
  console.error("ladder seed", e);
}
var ads = createAds({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
var halls = createHalls({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, news: report });
var homes = createHomes({ db, save, send, broadcast, liveOf: (id) => live.get(id), findByNumber, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", toScene: (scene, m) => live.forEach((l) => {
  if (l.scene === scene) send(l.ws, m);
}) });
var politics = createPolitics({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", news: report });
var jobs = createJobs({ db, bank, save, send, liveOf: (id) => live.get(id), findByNumber, filter, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
function createUser(name, lang) {
  const token = rid(24);
  const u = { id: "u" + rid(8), tok: sha(token), name: clean(name, 24) || "Citizen", color: "#4da3ff", number: newNumber(), lang: LANGS.some((l) => l.code === lang) ? lang : "en", blocks: [], joined: Date.now(), seen: Date.now() };
  db.users[u.id] = u;
  save();
  ops.bump("newUsers");
  return { u, token };
}
var accounts = createAccounts({ db, save, sha, rid, clean, createUser: (n, l) => {
  const c = createUser(n, l);
  ops.bump("signups");
  return c;
} });
var ops = createOps({ db, dataDir: DATA_DIR, dbFile: () => dbFile, dbInfo: () => DB_INFO, save, send, liveOf: (id) => live.get(id), liveCount: () => live.size, isAdmin, isMod, findByNumber, clean, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var meOf = (u) => ({ ...pub(u), lang: u.lang, blocks: u.blocks, email: u.email || null, google: !!u.google, age18: !!u.age18, admin: isMod(u.id), role: isAdmin(u.id) ? "judge" : isMod(u.id) ? "moderator" : "", guest: !u.email && !u.google });
var SEC = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Permissions-Policy": "camera=(self), microphone=(self), geolocation=()" };
var TYPES3 = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
var gzCache = /* @__PURE__ */ new Map();
var server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, online: live.size, users: Object.keys(db.users).length, translate: !!AI_KEY, news: db.news?.items.length || 0 }));
  }
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0].trim();
  if (accounts.http(req, res, url.pathname, ip)) return;
  if (ops.http(req, res, url.pathname, ip, accounts.byToken)) return;
  if (url.pathname === "/terms" || url.pathname === "/privacy") {
    res.writeHead(200, { ...SEC, "content-type": "text/html; charset=utf-8" });
    return res.end(legalPage(url.pathname.slice(1)));
  }
  if (edu.http(url.pathname, res)) return;
  let p = path2.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = path2.join(PUBLIC, p);
  if (!file.startsWith(PUBLIC) || !fs2.existsSync(file) || fs2.statSync(file).isDirectory()) file = path2.join(PUBLIC, "index.html");
  try {
    const st = fs2.statSync(file);
    let c = gzCache.get(file);
    if (!c || c.mtime !== st.mtimeMs) {
      const raw = fs2.readFileSync(file);
      const ext0 = path2.extname(file), squeeze = /html|js|css|svg|json|xml|txt/.test(ext0);
      c = { raw, gz: squeeze ? zlib2.gzipSync(raw, { level: 9 }) : null, br: squeeze ? zlib2.brotliCompressSync(raw, { params: { [zlib2.constants.BROTLI_PARAM_QUALITY]: 9, [zlib2.constants.BROTLI_PARAM_SIZE_HINT]: raw.length } }) : null, mtime: st.mtimeMs };
      gzCache.set(file, c);
    }
    const ext = path2.extname(file);
    const ae = String(req.headers["accept-encoding"] || "");
    const enc = c.br && /\bbr\b/.test(ae) ? "br" : c.gz && /\bgzip\b/.test(ae) ? "gzip" : "";
    /* files asked for with ?v= never change under that name, so phones can keep them for a year */
    const cache = ext === ".html" ? "no-cache" : url.searchParams.has("v") || p.startsWith("/vendor/") ? "public, max-age=31536000, immutable" : "public, max-age=86400";
    res.writeHead(200, { ...SEC, "content-type": TYPES3[ext] || "application/octet-stream", "cache-control": cache, ...enc ? { "content-encoding": enc, vary: "Accept-Encoding" } : {} });
    res.end(enc === "br" ? c.br : enc === "gzip" ? c.gz : c.raw);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
var wss = new import_websocket_server.default({ server, path: "/ws", maxPayload: 64 * 1024 });
wss.on("connection", (ws, req) => {
  let me = null;
  const ip = String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "").split(",")[0];
  const hello = setTimeout(() => ws.close(), 1e4);
  ws.on("message", (buf) => {
    const raw = buf.toString();
    if (raw.length > 64 * 1024) return;
    if (!me) {
      let m;
      try {
        m = JSON.parse(raw);
      } catch {
        return;
      }
      if (m.t !== "hello") return;
      clearTimeout(hello);
      let u = m.token ? accounts.byToken(String(m.token)) : void 0;
      let token = m.token;
      if (u && accounts.banText(u)) {
        send(ws, { t: "banned", text: accounts.banText(u) });
        ws.close();
        return;
      }
      if (!u) {
        const c = createUser(clean(m.name, 24) || "Citizen", m.lang);
        u = c.u;
        token = c.token;
        ops.joinedVia(u, clean(m.ref, 24));
        u.toks = [u.tok];
        u.color = clean(m.color, 9) || "#4da3ff";
        save();
        console.log("new citizen", u.number, ip);
        const pop = Object.keys(db.users).length;
        if (pop <= 50 || pop % 25 === 0) report("nation", `A new citizen arrived in Fyrus. Population: ${pop.toLocaleString("en-US")}`);
      }
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      u.seen = Date.now();
      const old = live.get(u.id);
      if (old) {
        send(old.ws, { t: "err", text: "You opened Fyrus in another tab." });
        old.ws.close();
      }
      me = { ws, u, x: 0, z: 36, y: 0, ry: 0, scene: "plaza", voice: false, rate: [], since: Date.now() };
      live.set(u.id, me);
      ops.bump("visits");
      ops.seen(u);
      send(ws, { t: "welcome", token, me: meOf(u), plots: db.plots, groups: Object.values(db.groups).filter((g) => g.members.includes(u.id)), online: live.size, translate: !!AI_KEY });
      broadcast({ t: "online", n: live.size });
      return;
    }
    try {
      onMessage(me, raw);
    } catch (e) {
      console.error("message failed", e);
    }
  });
  ws.on("close", () => {
    clearTimeout(hello);
    if (me && live.get(me.u.id) === me) {
      live.delete(me.u.id);
      try { ops.left(me.u, Date.now() - (me.since || Date.now())); } catch {}
      me.u.seen = Date.now();
      save();
      broadcast({ t: "left", id: me.u.id });
      broadcast({ t: "online", n: live.size });
    }
  });
  ws.on("error", () => {
  });
});
setInterval(() => wss.clients.forEach((c) => {
  if (c.isAlive === false) return c.terminate();
  c.isAlive = false;
  c.ping();
}), 3e4);
wss.on("connection", (c) => {
  c.isAlive = true;
  c.on("pong", () => c.isAlive = true);
});
server.listen(PORT, () => console.log(`Fyrus server on :${PORT} \xB7 translate ${AI_KEY ? "on (" + AI_MODEL + ")" : "off (set ANTHROPIC_API_KEY)"}`));
