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
// 24.7 safe load: a missing file starts a fresh database, but an existing file that cannot be parsed is NEVER
// overwritten: it is kept as fyrus.json.corrupt-<time> and the newest readable backup (backups/) is loaded instead.
var BACKUP_DIR = path2.join(DATA_DIR, "backups"), PERSIST = { loadedFrom: null, corrupt: null, backups: 0 };
function readDb(f) {
  return JSON.parse(fs2.readFileSync(f, "utf8"));
}
fs2.mkdirSync(DATA_DIR, { recursive: true });
if (!fs2.existsSync(dbFile)) console.log("fresh database at", dbFile), PERSIST.loadedFrom = "fresh";
else
  try {
    db = { ...db, ...readDb(dbFile) };
    PERSIST.loadedFrom = "main";
    console.log("loaded", Object.keys(db.users).length, "users");
  } catch (e) {
    const keep = dbFile + ".corrupt-" + Date.now();
    try {
      fs2.renameSync(dbFile, keep);
    } catch {}
    PERSIST.corrupt = keep;
    console.error("DATABASE UNREADABLE, kept as", keep, String(e && e.message || e));
    let list = [];
    try {
      list = fs2.readdirSync(BACKUP_DIR).filter((n) => /^fyrus-\d+\.json$/.test(n)).sort().reverse();
    } catch {}
    for (const n of list)
      try {
        db = { ...db, ...readDb(path2.join(BACKUP_DIR, n)) };
        PERSIST.loadedFrom = "backup:" + n;
        console.error("restored from backup", n, Object.keys(db.users).length, "users");
        break;
      } catch {}
    if (!PERSIST.loadedFrom) {
      PERSIST.loadedFrom = "fresh-after-corrupt";
      console.error("no readable backup: starting empty; the corrupt file was kept");
    }
  }
// rolling backups: a copy of the saved database every BACKUP_EVERY_MS (default 10 min), the newest 36 are kept
var BACKUP_EVERY = Number(process.env.BACKUP_EVERY_MS || 6e5);
function backup() {
  try {
    if (!fs2.existsSync(dbFile)) return;
    fs2.mkdirSync(BACKUP_DIR, { recursive: true });
    fs2.copyFileSync(dbFile, path2.join(BACKUP_DIR, "fyrus-" + Date.now() + ".json"));
    PERSIST.backups++;
    const list = fs2.readdirSync(BACKUP_DIR).filter((n) => /^fyrus-\d+\.json$/.test(n)).sort();
    list.slice(0, Math.max(0, list.length - 36)).forEach((n) => fs2.unlinkSync(path2.join(BACKUP_DIR, n)));
  } catch (e) {
    console.error("backup failed", e);
  }
}
setInterval(backup, BACKUP_EVERY).unref?.();
var saveT = null, saveUrgent = false, SAVE = { saves: 0, urgent: 0, lastMs: 0 };
// 26.10: money moves ask for an urgent save (SAVE_URGENT_MS, default 200 ms) instead of the normal 1.5 s debounce, so a
// crash loses at most a fraction of a second of transfers (26.3 found 58 lost transfers in a 1.5 s window)
function save(urgent) {
  if (saveT && (!urgent || saveUrgent)) return;
  if (saveT) clearTimeout(saveT);
  saveUrgent = !!urgent;
  urgent && SAVE.urgent++;
  saveT = setTimeout(() => {
    saveT = null;
    saveUrgent = false;
    SAVE.saves++;
    const t0 = performance.now();
    try {
      fs2.writeFileSync(dbFile + ".tmp", JSON.stringify(db));
      fs2.renameSync(dbFile + ".tmp", dbFile);
      SAVE.lastMs = Math.round((performance.now() - t0) * 10) / 10;
    } catch (e) {
      console.error("save failed", e);
    }
  }, urgent ? +(process.env.SAVE_URGENT_MS || 200) : 1500);
}
function flush() {
  if (saveT) {
    clearTimeout(saveT);
    saveT = null;
  }
  try {
    fs2.writeFileSync(dbFile + ".tmp", JSON.stringify(db));
    fs2.renameSync(dbFile + ".tmp", dbFile);
  } catch (e) {
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
      fs2.writeFileSync(dbFile, JSON.stringify(db));
    } catch {
    }
  }
}
var alias = (u) => "Citizen #X" + String(parseInt(sha(u.id).slice(0, 6), 16) % 1e3).padStart(3, "0");
var shown = (u) => u.stealth ? alias(u) : u.name;
var clean = (s, n) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
// 24.8: lookups by a client-supplied key only see the object's own entries ("__proto__", "constructor", ... -> none)
function own(o, k) {
  return o && (typeof k === "string" || typeof k === "number") && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : void 0;
}
// ---- Phase 24.2: server-side validation of client-reported presence state ----------------------------------------
// Positions are clamped to the world, non-finite numbers are rejected, and the free-form objects that are relayed to
// every other player (o = outfit + small action fields, v = vehicle) are size- and shape-limited. On a bad value the
// previous accepted value is kept, so a client can never make the server broadcast more than a few hundred bytes.
var WORLD_XZ = 6e3, WORLD_Y_MIN = -60, WORLD_Y_MAX = 2500, O_MAX_BYTES = 1500, V_MAX_BYTES = 200;
var pnum = (v, lo, hi, dflt) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : dflt;
};
var plainObj = (o) => !!o && typeof o === "object" && !Array.isArray(o) && Object.getPrototypeOf(o) === Object.prototype;
function sanitizeShallow(o, maxKeys, maxStr, depth) {
  if (!plainObj(o)) return null;
  const out = {};
  let n = 0;
  for (const k of Object.keys(o)) {
    if (++n > maxKeys || !/^[A-Za-z0-9_]{1,24}$/.test(k)) continue;
    const v = o[k];
    if (typeof v === "string") out[k] = v.slice(0, maxStr);
    else if (typeof v === "number") Number.isFinite(v) && (out[k] = v);
    else if (typeof v === "boolean") out[k] = v;
    else if (v === null) out[k] = null;
    else if (Array.isArray(v) && depth > 0) out[k] = v.slice(0, 8).filter((x) => typeof x === "number" && Number.isFinite(x) || typeof x === "string" && x.length <= maxStr);
    else if (plainObj(v) && depth > 0) out[k] = sanitizeShallow(v, 12, maxStr, depth - 1);
  }
  return out;
}
function sanitizeAct(a) {
  if (!plainObj(a)) return void 0;
  const out = {};
  a.s && (out.s = 1);
  typeof a.c === "string" && /^[a-z]{1,16}$/.test(a.c) && (out.c = a.c);
  if (Array.isArray(a.p) && a.p.length >= 2) {
    const x = pnum(a.p[0], -WORLD_XZ, WORLD_XZ, NaN), z = pnum(a.p[1], -WORLD_XZ, WORLD_XZ, NaN), h = pnum(a.p[2], -10, 10, 0);
    Number.isFinite(x) && Number.isFinite(z) && (out.p = [x, z, h]);
  }
  return Object.keys(out).length ? out : void 0;
}
function sanitizeO(o, prev) {
  if (o == null) return prev ?? null;
  const out = sanitizeShallow(o, 40, 64, 2);
  if (!out) return prev ?? null;
  if ("act" in out || o.act) {
    const a = sanitizeAct(o.act);
    a ? out.act = a : delete out.act;
  }
  return JSON.stringify(out).length <= O_MAX_BYTES ? out : prev ?? null;
}
function sanitizeV(v) {
  if (v == null || v === false) return null;
  if (!plainObj(v)) return null;
  const out = { b: String(v.b ?? "").slice(0, 24), c: String(v.c ?? "").slice(0, 16), f: !!v.f };
  return JSON.stringify(out).length <= V_MAX_BYTES ? out : null;
}
var PRES = { posMsgs: 0, oRejected: 0, coordClamped: 0, nonFinite: 0, speedCapped: 0, teleports: 0, teleportBlocked: 0 };
// 24.5: tell a client where the server has it when its move was capped / blocked (max 2 per second)
var corr = (me2, why) => {
  const n = Date.now();
  if (n - (me2.corrAt || 0) < 500) return;
  me2.corrAt = n;
  PRES.corrections = (PRES.corrections || 0) + 1;
  send(me2.ws, { t: "corr", x: Math.round(me2.x * 100) / 100, z: Math.round(me2.z * 100) / 100, why });
};
var MOVE_MAX_FOOT = 26, MOVE_MAX_VEH = 95, TELEPORT_MIN = 300;
// ---- 24.10 chat moderation hooks --------------------------------------------------------------------------------
// Every chat message goes through a pipeline of hooks (fn(text, ctx) -> {action: "allow"|"mask"|"block", text?, why?,
// reason?}). Built in: repeat spam, links / contact details from accounts younger than a day, shouting (all caps), and
// the existing word filter. Blocks are logged (db.modlog, newest 2000) and 5 blocks in 10 minutes mute the sender for
// 15 minutes. registerModHook(fn) adds more hooks (e.g. a local classifier) without touching the chat code.
var MOD = { hooks: [], stats: { checked: 0, blocked: 0, masked: 0, autoMutes: 0, byReason: {} } };
function registerModHook(fn) {
  typeof fn === "function" && MOD.hooks.push(fn);
}
var normMsg = (t) => t.toLowerCase().replace(/[^a-z0-9\u0600-\u06ff\u0900-\u097f]+/g, "");
registerModHook((text, ctx) => {
  const now = Date.now(), k = normMsg(text), h = ctx.me.sayHist = (ctx.me.sayHist || []).filter((x) => now - x.at < 3e4);
  const n = h.filter((x) => x.k === k).length;
  h.push({ k, at: now });
  return k.length > 1 && n >= 2 ? { action: "block", reason: "repeat", why: "You already sent that. Please don't repeat messages." } : null;
});
registerModHook((text, ctx) => {
  const young = Date.now() - (ctx.u.joined || 0) < 864e5 && !ctx.u.email && !ctx.u.google;
  if (!young) return null;
  if (/(https?:\/\/|www\.|\b[a-z0-9-]{2,}\.(com|net|org|io|xyz|ru|cn|top|gg|me|link)\b)/i.test(text)) return { action: "block", reason: "link", why: "New accounts can't post links yet." };
  if (/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(text)) return { action: "block", reason: "contact", why: "New accounts can't share e-mail addresses yet." };
  return null;
});
registerModHook((text) => {
  const letters = text.replace(/[^A-Za-z]/g, "");
  return letters.length > 12 && letters.replace(/[^A-Z]/g, "").length / letters.length > 0.75 ? { action: "mask", reason: "caps", text: text.charAt(0) + text.slice(1).toLowerCase() } : null;
});
registerModHook((text) => {
  const f = filter(text);
  return f !== text ? { action: "mask", reason: "words", text: f } : null;
});
function moderate(u, text, ctx) {
  MOD.stats.checked++;
  let out = text;
  if (!out) return { action: "allow", text: out };
  for (const hook of MOD.hooks) {
    let r = null;
    try {
      r = hook(out, { ...ctx, u });
    } catch (e) {
      console.error("mod hook failed", e);
    }
    if (!r || r.action === "allow") continue;
    MOD.stats.byReason[r.reason || "other"] = (MOD.stats.byReason[r.reason || "other"] || 0) + 1;
    if (r.action === "mask") {
      MOD.stats.masked++;
      out = r.text ?? out;
      continue;
    }
    if (r.action === "block") {
      MOD.stats.blocked++;
      const now = Date.now();
      (db.modlog ||= []).push({ at: now, by: u.id, channel: ctx.channel, reason: r.reason, sample: text.slice(0, 120) });
      db.modlog.length > 2e3 && db.modlog.splice(0, db.modlog.length - 2e3);
      const recent = db.modlog.filter((x) => x.by === u.id && now - x.at < RULES28.FILTER_WINDOW_MS).length;   // 28.12: shared constants
      if (recent >= RULES28.FILTER_BLOCKS && !(u.muteUntil > now)) {
        u.muteUntil = now + RULES28.FILTER_MUTE_MS;
        u.autoMuted = now;
        MOD.stats.autoMutes++;
        save();
        return { action: "block", why: `Too many blocked messages: your chat is paused for ${Math.round(RULES28.FILTER_MUTE_MS / 6e4)} minutes.${rules28Off() ? "" : " See City rules 1, 2, 3 and 8."}` };
      }
      save();
      return { action: "block", why: r.why || "Message not sent." };
    }
  }
  return { action: "allow", text: out };
}
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
  // 24.8: only plain objects with a string type reach the modules (null / arrays / numbers used to throw inside them)
  if (!m || typeof m !== "object" || Array.isArray(m) || typeof m.t !== "string" || m.t.length > 40) return void (PRES.dropped = (PRES.dropped || 0) + 1);
  // 26.10 idempotency: a request carrying a request id ("rid") that this connection already sent in the last 10 min is
  // dropped (answered with "dup"), so a client retry after a timeout can never apply a payment twice
  if (typeof m.rid === "string" && m.rid.length <= 40) {
    const rs = me.rids ||= /* @__PURE__ */ new Map(), now = Date.now();
    if (rs.has(m.rid) && now - rs.get(m.rid) < 6e5) return void (PRES.dupDropped = (PRES.dupDropped || 0) + 1, send(me.ws, { t: "dup", rid: m.rid }));
    rs.set(m.rid, now);
    if (rs.size > 200) for (const [k, t] of rs) if (now - t > 6e5 || rs.size > 200) rs.delete(k);
  }
  const u = me.u;
  if (edu.onMessage(me, m) || bank.onMessage(me, m) || market.onMessage(me, m) || estate.onMessage(me, m) || news.onMessage(me, m) || ads.onMessage(me, m) || halls.onMessage(me, m) || acts28.onMessage(me, m) || rules28.onMessage(me, m) || homes.onMessage(me, m) || biz.onMessage(me, m) || aichat.onMessage(me, m) || politics.onMessage(me, m) || jobs.onMessage(me, m) || ops.onMessage(me, m)) return;
  switch (m.t) {
    case "pos": {
      PRES.posMsgs++;
      const nx = pnum(m.x, -WORLD_XZ, WORLD_XZ, NaN), nz = pnum(m.z, -WORLD_XZ, WORLD_XZ, NaN);
      if (!Number.isFinite(nx) || !Number.isFinite(nz)) {
        PRES.nonFinite++;
        return;
      }
      (Math.abs(+m.x) > WORLD_XZ || Math.abs(+m.z) > WORLD_XZ) && PRES.coordClamped++;
      // 24.3 movement validation: per-update displacement is limited to what the current mode allows (on foot / in a
      // vehicle). Bigger jumps are accepted as teleports (metro, rocket, waypoints, respawn), up to 3 per 10 s; scene
      // changes and vehicle changes reset the check. A capped move keeps the player moving at the allowed speed.
      const nowM = Date.now(), sceneNow = clean(m.scene, 40) || "plaza", inVeh = !!(m.v && plainObj(m.v));
      if (me.mv && me.mv.scene === sceneNow && me.mv.veh === inVeh) {
        const dtm = Math.min(1, Math.max(0.08, (nowM - me.mv.t) / 1e3)), dx = nx - me.x, dz = nz - me.z, d = Math.hypot(dx, dz);
        const vmax = inVeh ? MOVE_MAX_VEH : MOVE_MAX_FOOT, allow = vmax * dtm * 1.5 + 0.5;
        if (d > TELEPORT_MIN) {
          // token bucket: up to 3 teleports in any 10 s window (metro + waypoint + respawn in a row stay legal)
          const tps = (me.tps || []).filter((x) => nowM - x < 1e4);
          if (tps.length >= 3) {
            PRES.teleportBlocked++;
            me.mv.t = nowM;
            me.tps = tps;
            corr(me, "teleport");
            return;
          }
          tps.push(nowM);
          me.tps = tps;
          PRES.teleports++;
        } else if (d > allow) {
          const k = allow / d;
          PRES.speedCapped++;
          me.x += dx * k;
          me.z += dz * k;
          d - allow > 5 && corr(me, "speed");
          me.mv = { t: nowM, scene: sceneNow, veh: inVeh, tp: me.mv.tp };
          me.y = pnum(m.y, WORLD_Y_MIN, WORLD_Y_MAX, me.y || 0);
          me.ry = pnum(m.ry, -1e3, 1e3, me.ry || 0) % (Math.PI * 2);
          me.scene = sceneNow;
          me.o = sanitizeO(m.o, me.o);
          me.v = sanitizeV(m.v);
          return;
        }
      }
      me.mv = { t: nowM, scene: sceneNow, veh: inVeh, tp: me.mv ? me.mv.tp : 0 };
      me.x = nx;
      me.z = nz;
      me.y = pnum(m.y, WORLD_Y_MIN, WORLD_Y_MAX, me.y || 0);
      me.ry = pnum(m.ry, -1e3, 1e3, me.ry || 0) % (Math.PI * 2);
      me.scene = clean(m.scene, 40) || "plaza";
      const no = sanitizeO(m.o, me.o);
      no !== m.o && m.o && JSON.stringify(m.o).length > O_MAX_BYTES && PRES.oRejected++;
      me.o = no;
      // 24.7: the player's outfit is part of the profile on the server (action / emote fields stripped; written at most
      // once a minute when it changes)
      if (no) {
        const plain = Object.assign({}, no);
        (delete plain.act, delete plain.em, delete plain.emt);
        const sig = JSON.stringify(plain), nowO = Date.now();
        sig !== u.outfitSig && (nowO - (u.outfitAt || 0) > 6e4 || !u.outfit) && ((u.outfit = plain), (u.outfitSig = sig), (u.outfitAt = nowO), save());
      }
      me.v = sanitizeV(m.v);
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
      const mod = moderate(u, clean(m.text, MAX_TEXT), { channel: String(m.channel || ""), me });
      if (mod.action === "block") return send(me.ws, { t: "err", text: mod.why });
      const text = mod.text;
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
        const target = own(db.users, m.to) || findByNumber(String(m.to || ""));
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
        const g = own(db.groups, m.group);
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
      if (mine.length >= RULES28.REPORTS_PER_DAY) return send(me.ws, { t: "err", text: "You have sent many reports today. A judge will review them soon." });
      if (mine.some((r) => r.against === against)) return send(me.ws, { t: "ok", text: "You already reported this citizen today. A judge will review it." });
      db.reports.push({ by: u.id, against, reason: clean(m.reason, 400), msg: clean(m.msg, 600), at: now });
      if (db.reports.length > 5e3) db.reports.splice(0, db.reports.length - 5e3);
      const target = own(db.users, against);   // 24.10: own-key lookup (a "__proto__" report must not touch Object.prototype)
      if (target && !isAdmin(target.id)) {
        const trusted = (x) => !!x && (x.email || x.google || now - (x.joined || now) > DAY);
        const by = new Set(db.reports.filter((r) => r.against === against && now - r.at < DAY && trusted(db.users[r.by])).map((r) => r.by));
        if (by.size >= RULES28.REPORTS_TO_PAUSE && !(target.muteUntil > now)) {
          target.muteUntil = now + RULES28.REPORT_PAUSE_MS;
          target.autoMuted = now;
          const l = live.get(target.id);
          if (l) send(l.ws, { t: "err", text: `Several citizens reported your messages. Your chat is paused for ${Math.round(RULES28.REPORT_PAUSE_MS / 36e5)} hours while a judge reviews it.${rules28Off() ? "" : " See City rules (Parliament \u203A City rules)."}` });
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
      const g = own(db.groups, m.group);
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
          if (refund > 0) bank.payFromTreasury(u.id, refund, `Sold plot ${id} to the Land Bank (90% of value)`);
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
// 24.4 interest management: every 125 ms each client gets full entries for players in its own scene within
// IM_NEAR m; same-scene players farther away are included every 4th tick (2 Hz); players in other scenes only as a
// compact entry (no outfit / vehicle / photo) once per second, so "who is online" lists keep working. The client keeps
// a peer for 2.5 s after it was last listed (003.js), so the lower rates never make anyone blink out.
// IM_OFF=1 (env) restores the old all-to-all broadcast.
var IM_NEAR = 160, IM_OFF = process.env.IM_OFF === "1", imTick = 0, IMS = { ticks: 0, full: 0, farFull: 0, compact: 0 };
setInterval(() => {
  if (!live.size) return;
  const t = imTick++, withPhoto = Date.now() % 4e3 < 130;
  const all = [...live.values()].map((l) => ({ l, full: { id: l.u.id, name: shown(l.u), color: l.u.stealth ? "#8a8f98" : l.u.color, x: l.x, z: l.z, y: l.y, ry: l.ry, sc: l.scene, o: l.o, v: l.v, vc: l.voice, ph: l.u.stealth || !withPhoto ? void 0 : l.u.photo, mk: l.u.stealth ? 1 : void 0 } }));
  IMS.ticks++;
  live.forEach((me2) => {
    const list = [];
    for (const { l, full } of all) {
      if (l === me2) continue;
      if (IM_OFF) {
        list.push(full);
        continue;
      }
      if (l.scene === me2.scene) {
        const near = Math.hypot(l.x - me2.x, l.z - me2.z) < IM_NEAR;
        if (near || t % 4 === 0) (list.push(full), near ? IMS.full++ : IMS.farFull++);
      } else if (t % 8 === 0) (list.push({ id: full.id, name: full.name, color: full.color, x: full.x, z: full.z, sc: full.sc, mk: full.mk }), IMS.compact++);
    }
    if (list.length || t % 8 === 0) send(me2.ws, { t: "peers", list, partial: IM_OFF ? void 0 : 1 });
  });
}, 125);
var ADMINS = String(process.env.FYRUS_ADMINS || "").split(",").map((s) => s.trim()).filter(Boolean);
if (ADMINS.length) console.log("court judges:", ADMINS.length);
var isAdmin = (id) => {
  const u = db.users[id];
  return !!u && ADMINS.some((a) => a === id || digits(a).length >= 7 && digits(a).slice(-7) === digits(u.number).slice(-7));
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
var bank = createBank({ db, save, send, liveOf: (id) => live.get(id), findByNumber, nameOf, clean, fs: fs2, crypto: crypto3, isNew: (id) => !!db.users[id] && Date.now() - (db.users[id].joined || 0) < 864e5, onFlag: (id, f) => console.warn("[fraud-watch] flagged", id, f.why), ledgerFile: process.env.LEDGER_FILE === "off" ? null : path2.join(DATA_DIR, "ledger.jsonl") });
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
var rules28 = createRules({ send });
var acts28 = createActs({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), filter, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var homes = createHomes({ db, save, send, broadcast, liveOf: (id) => live.get(id), findByNumber, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", toScene: (scene, m) => live.forEach((l) => {
  if (l.scene === scene) send(l.ws, m);
}) });
var politics = createPolitics({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, rid, isAdmin, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen", news: report });
var aichat = createAiChat({ stockInfo: (id) => jobs.stockInfo(id), bizInfo: (id) => biz.bizInfo(id), clerkDenied: (id, tool, why) => biz.clerkDenied(id, tool, why), db, save, send, clean, filter, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var biz = createBusinesses({ db, bank, save, send, broadcast, liveOf: (id) => live.get(id), clean, filter, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var jobs = createJobs({ db, bank, save, send, liveOf: (id) => live.get(id), findByNumber, filter, certCount: (id) => Object.values(db.edu?.certs || {}).filter((c) => c && c.student === id).length, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
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
var ops = createOps({ db, dataDir: DATA_DIR, dbFile: () => dbFile, save, send, liveOf: (id) => live.get(id), liveCount: () => live.size, isAdmin, findByNumber, clean, shown: (id) => db.users[id] ? shown(db.users[id]) : "Citizen" });
var meOf = (u) => ({ ...pub(u), outfit: u.outfit || null, lang: u.lang, blocks: u.blocks, email: u.email || null, google: !!u.google, age18: !!u.age18, admin: isAdmin(u.id), guest: !u.email && !u.google });
var SEC = { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "SAMEORIGIN", "Strict-Transport-Security": "max-age=31536000; includeSubDomains", "Permissions-Policy": "camera=(self), microphone=(self), geolocation=()" };
var TYPES3 = { ".html": "text/html; charset=utf-8", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
var gzCache = /* @__PURE__ */ new Map();
// 30.8 security: the client IP used by every limit (login tries, new accounts, sockets, message flood, loopback
// exemption). x-forwarded-for was trusted from anyone, so a client could send "x-forwarded-for: 127.0.0.1" to skip
// all limits or rotate fake IPs. Now it is read only when the TCP peer is a proxy on this machine (loopback), and
// then the entry that proxy appended (the right-most; TRUST_PROXY_HOPS=n for a chain of n proxies) is used.
var PROXY_HOPS = Math.max(1, Number(process.env.TRUST_PROXY_HOPS || 1) | 0);
var clientIp = (req) => {
  const peer = String(req.socket?.remoteAddress || "");
  // deploy: inside Docker the reverse proxy (Coolify/Traefik) reaches the app from a private address, so a peer on
  // loopback or a private network (10/8, 172.16/12, 192.168/16, fc00::/7) counts as our proxy; a public peer never does
  if (!/^(127\.|::1$|::ffff:127\.|(::ffff:)?10\.|(::ffff:)?192\.168\.|(::ffff:)?172\.(1[6-9]|2\d|3[01])\.|f[cd][0-9a-f]{2}:)/i.test(peer)) return peer;
  const xs = String(req.headers["x-forwarded-for"] || "").split(",").map((x) => x.trim()).filter(Boolean);
  return xs.length ? xs[Math.max(0, xs.length - PROXY_HOPS)] : peer;
};
var server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", "http://x");
  if (url.pathname === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    return res.end(JSON.stringify({ ok: true, online: live.size, users: Object.keys(db.users).length, translate: !!AI_KEY, news: db.news?.items.length || 0 }));
  }
  const ip = clientIp(req);
  if (accounts.http(req, res, url.pathname, ip)) return;
  if (ops.http(req, res, url.pathname, ip, accounts.byToken)) return;
  if (url.pathname === "/terms" || url.pathname === "/privacy") {
    res.writeHead(200, { ...SEC, "content-type": "text/html; charset=utf-8" });
    return res.end(legalPage(url.pathname.slice(1)));
  }
  if (edu.http(url.pathname, res)) return;
  let p = path2.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
  // 30.8 security: never serve server source, build tooling, package metadata, docs or dot-files from the public dir
  // (the local demo serves app/ directly, which holds server.mjs and src/). Unknown paths still fall back to the app.
  if (/^[/\\](src|scripts|node_modules)([/\\]|$)/i.test(p) || /(^|[/\\])\./.test(p) || /(^|[/\\])(server\.mjs|build\.mjs|package\.json|pnpm-lock\.yaml|package-lock\.json|[^/\\]+\.md)$/i.test(p)) {
    res.writeHead(404, { ...SEC, "content-type": "text/plain" });
    return res.end("not found");
  }
  let file = path2.join(PUBLIC, p);
  if (!file.startsWith(PUBLIC) || !fs2.existsSync(file) || fs2.statSync(file).isDirectory()) file = path2.join(PUBLIC, "index.html");
  try {
    const st = fs2.statSync(file);
    let c = gzCache.get(file);
    if (!c || c.mtime !== st.mtimeMs) {
      const raw = fs2.readFileSync(file);
      c = { raw, gz: zlib2.gzipSync(raw, { level: 9 }), mtime: st.mtimeMs };
      gzCache.set(file, c);
    }
    const ext = path2.extname(file);
    const gz = /\bgzip\b/.test(String(req.headers["accept-encoding"] || "")) && /html|js|css|svg|json|xml|txt/.test(ext);
    res.writeHead(200, { ...SEC, "content-type": TYPES3[ext] || "application/octet-stream", "cache-control": ext === ".html" ? "no-cache" : "public, max-age=86400", ...gz ? { "content-encoding": "gzip", vary: "Accept-Encoding" } : {} });
    res.end(gz ? c.gz : c.raw);
  } catch {
    res.writeHead(404);
    res.end("not found");
  }
});
var RECON_GRACE = Number(process.env.RECON_GRACE_MS ?? 1e4), RECON = { ghosts: 0, resumed: 0, expired: 0 };
setInterval(() => {
  const now = Date.now();
  let gone = 0;
  live.forEach((l, id) => {
    if (l.ghostUntil && l.ghostUntil < now && l.ws.readyState !== import_websocket.default.OPEN) {
      live.delete(id);
      RECON.expired++;
      gone++;
      broadcast({ t: "left", id });
    }
  });
  if (gone) (save(), broadcast({ t: "online", n: live.size }));
}, 1e3);
// ---- 24.9 basic abuse prevention ------------------------------------------------------------------------------
// per-IP: at most ABUSE_CONN_PER_IP open sockets and ABUSE_NEW_PER_IP_HOUR new accounts per hour; per socket: a
// message token bucket (60/s, burst 120; excess is dropped, sustained flooding closes the socket); "new citizen"
// news at most once a minute. Loopback (local development / bench) is exempt unless ABUSE_TEST=1.
var ABUSE = { connRefused: 0, acctRefused: 0, dropped: 0, kicked: 0, newsSkipped: 0 };
var ABUSE_CONN = Number(process.env.ABUSE_CONN_PER_IP || 12), ABUSE_NEW = Number(process.env.ABUSE_NEW_PER_IP_HOUR || 6), ABUSE_TEST = process.env.ABUSE_TEST === "1";
var newByIp = /* @__PURE__ */ new Map(), lastCitizenNews = 0;
var exemptIp = (ip) => !ABUSE_TEST && /^(127\.|::1$|::ffff:127\.)/.test(ip);
var wss = new import_websocket_server.default({ server, path: "/ws", maxPayload: 64 * 1024 });
wss.on("connection", (ws, req) => {
  let me = null;
  const ip = clientIp(req);
  ws.ip = ip;
  if (!exemptIp(ip) && [...wss.clients].filter((c) => c.ip === ip).length > ABUSE_CONN) {
    ABUSE.connRefused++;
    ws.close(1008, "too many connections");
    return;
  }
  const hello = setTimeout(() => ws.close(), 1e4);
  const bucket = { tokens: 120, at: Date.now(), drops: [] };
  ws.on("message", (buf) => {
    const raw = buf.toString();
    if (raw.length > 64 * 1024) return;
    if (!exemptIp(ip)) {
      const nowB = Date.now();
      bucket.tokens = Math.min(120, bucket.tokens + (nowB - bucket.at) * 0.06);
      bucket.at = nowB;
      if (bucket.tokens < 1) {
        ABUSE.dropped++;
        bucket.drops.push(nowB);
        bucket.drops = bucket.drops.filter((x) => nowB - x < 1e4);
        if (bucket.drops.length > 600) {
          ABUSE.kicked++;
          me && (me.kicked = true);
          send(ws, { t: "err", text: "Too many messages. Please reconnect." });
          ws.close(1008, "flood");
        }
        return;
      }
      bucket.tokens -= 1;
    }
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
      if (!u && !exemptIp(ip)) {
        const nowA = Date.now(), list = (newByIp.get(ip) || []).filter((x) => nowA - x < 36e5);
        if (list.length >= ABUSE_NEW) {
          ABUSE.acctRefused++;
          send(ws, { t: "err", text: "Too many new accounts from this network. Please try again later." });
          ws.close(1008, "account limit");
          return;
        }
        list.push(nowA);
        newByIp.set(ip, list);
        newByIp.size > 5e4 && newByIp.clear();
      }
      if (!u) {
        const c = createUser(clean(m.name, 24) || "Citizen", m.lang);
        u = c.u;
        token = c.token;
        u.toks = [u.tok];
        u.color = clean(m.color, 9) || "#4da3ff";
        save();
        console.log("new citizen", u.number, ip);
        const pop = Object.keys(db.users).length;
        if ((pop <= 50 || pop % 25 === 0) && Date.now() - lastCitizenNews > 6e4) ((lastCitizenNews = Date.now()), report("nation", `A new citizen arrived in Fyrus. Population: ${pop.toLocaleString("en-US")}`));
        else ABUSE.newsSkipped++;
      }
      if (m.name) u.name = clean(m.name, 24) || u.name;
      if (m.lang && LANGS.some((l) => l.code === m.lang)) u.lang = m.lang;
      u.seen = Date.now();
      const old = live.get(u.id);
      // 24.6: a player who reconnects within the grace period continues where the server last had them (position,
      // scene, outfit, vehicle, movement-check state) and nobody saw them leave
      const resumed = old && old.ghostUntil ? old : null;
      if (old && !resumed) {
        send(old.ws, { t: "err", text: "You opened Fyrus in another tab." });
        old.ws.close();
      }
      me = { ws, u, x: 0, z: 36, y: 0, ry: 0, scene: "plaza", voice: false, rate: [] };
      if (resumed) (["x", "z", "y", "ry", "scene", "o", "v", "mv", "voice"].forEach((k) => resumed[k] !== void 0 && (me[k] = resumed[k])), RECON.resumed++);
      live.set(u.id, me);
      ops.bump("visits");
      send(ws, { t: "welcome", token, me: meOf(u), biz: biz.all(), plots: db.plots, groups: Object.values(db.groups).filter((g) => g.members.includes(u.id)), online: live.size, translate: !!AI_KEY });
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
      // 24.6: keep the player listed (frozen) for a short grace period so a network blip or a page reload does not
      // make them vanish for everyone; the sweeper below removes them if they do not come back
      me.u.seen = Date.now();
      if (RECON_GRACE > 0 && !me.kicked) {
        me.ghostUntil = Date.now() + RECON_GRACE;
        RECON.ghosts++;
        return;
      }
      live.delete(me.u.id);
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
