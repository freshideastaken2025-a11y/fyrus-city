// server/ops.ts
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
var XP_DAILY = +(process.env.XP_DAILY_CAP || 3e3);
var XP_IMPORT_CAP = 2e4;
var KEEP_BACKUPS = 14;
var day2 = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var EVENTS = /^(goal:[a-z]+|tour|now_open|ride:[a-z]+|drive|fly|signup_prompt|lite_on)$/;
function createOps(d) {
  if (!d.db.ops) {
    d.db.ops = { errors: [], stats: {} };
    d.save();
  }
  const O = d.db.ops;
  const today = () => O.stats[day2()] ||= { visits: 0, newUsers: 0, signups: 0, peak: 0, events: {} };
  const bump = (k) => {
    today()[k]++;
    const t = today();
    t.peak = Math.max(t.peak, d.liveCount());
    d.save();
  };
  const track = (ev) => {
    if (!EVENTS.test(ev)) return;
    const t = today();
    t.events[ev] = (t.events[ev] || 0) + 1;
    d.save();
  };
  const bdir = path.join(d.dataDir, "backups");
  function backupNow() {
    try {
      fs.mkdirSync(bdir, { recursive: true });
      const f = path.join(bdir, `fyrus-${day2()}.json.gz`);
      fs.writeFileSync(f, zlib.gzipSync(fs.readFileSync(d.dbFile())));
      const all = fs.readdirSync(bdir).filter((x) => x.startsWith("fyrus-")).sort();
      all.slice(0, Math.max(0, all.length - KEEP_BACKUPS)).forEach((x) => fs.unlinkSync(path.join(bdir, x)));
      return f;
    } catch (e) {
      console.error("backup failed", e);
      return null;
    }
  }
  const backups = () => {
    try {
      return fs.readdirSync(bdir).filter((x) => x.startsWith("fyrus-")).sort().reverse().map((f) => ({ file: f, size: fs.statSync(path.join(bdir, f)).size }));
    } catch {
      return [];
    }
  };
  /* hourly snapshots (last 48 hours) so a bad hour never costs more than one hour of the city */
  const hdir = path.join(bdir, "hourly");
  const hour = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 13);
  function snapshotNow() {
    try {
      fs.mkdirSync(hdir, { recursive: true });
      const f = path.join(hdir, `fyrus-${hour()}.json.gz`);
      if (fs.existsSync(f)) return f;
      fs.writeFileSync(f, zlib.gzipSync(fs.readFileSync(d.dbFile())));
      const all = fs.readdirSync(hdir).filter((x) => x.startsWith("fyrus-")).sort();
      all.slice(0, Math.max(0, all.length - 48)).forEach((x) => fs.unlinkSync(path.join(hdir, x)));
      return f;
    } catch (e) {
      console.error("snapshot failed", e);
      return null;
    }
  }
  /* off-site copy: once a day the newest backup is e-mailed to BACKUP_EMAIL (uses the same Resend account as password reset) */
  const OFF = { to: String(process.env.BACKUP_EMAIL || "").trim(), key: process.env.RESEND_API_KEY || "", from: process.env.MAIL_FROM || "" };
  async function offsiteNow(force) {
    if (!OFF.to || !OFF.key || !OFF.from) return { ok: false, why: "BACKUP_EMAIL, RESEND_API_KEY or MAIL_FROM not set" };
    O.offsite ||= {};
    if (!force && O.offsite.day === day2()) return { ok: true, skipped: true };
    const b = backups()[0];
    if (!b) return { ok: false, why: "no backup yet" };
    const f = path.join(bdir, b.file), size = fs.statSync(f).size;
    if (size > 30 * 1024 * 1024) return { ok: false, why: "backup too large for e-mail (" + Math.round(size / 1048576) + " MB)" };
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${OFF.key}`, "content-type": "application/json" }, body: JSON.stringify({ from: OFF.from, to: [OFF.to], subject: `Fyrus backup ${day2()}`, text: `Daily Fyrus city backup (${Math.round(size / 1024)} KB, gzip JSON). Keep this e-mail; to restore, put the unzipped file at /data/fyrus.json and restart the app.`, attachments: [{ filename: b.file, content: fs.readFileSync(f).toString("base64") }] }) });
      if (!r.ok) throw new Error("resend " + r.status);
      O.offsite = { day: day2(), at: Date.now(), file: b.file, size };
      d.save();
      return { ok: true };
    } catch (e) {
      O.offsite.lastError = String(e && e.message || e).slice(0, 200);
      console.error("offsite backup failed", e);
      return { ok: false, why: O.offsite.lastError };
    }
  }
  const tick = () => {
    if (!backups().some((b) => b.file.includes(day2()))) backupNow();
    snapshotNow();
    offsiteNow(false).catch(() => {});
  };
  setTimeout(tick, 2e4);
  setInterval(tick, 10 * 6e4);
  if (O.stats) {
    const keys = Object.keys(O.stats).sort();
    keys.slice(0, Math.max(0, keys.length - 90)).forEach((k) => delete O.stats[k]);
  }
  const errHits = /* @__PURE__ */ new Map();
  let http2 = function (req, res, p, ip, auth) {
    if (p === "/api/err" && req.method === "POST") {
      const now = Date.now();
      const a = (errHits.get(ip) || []).filter((t) => now - t < 6e4);
      a.push(now);
      errHits.set(ip, a);
      if (errHits.size > 5e3) errHits.clear();
      let raw = "";
      req.on("data", (c) => {
        raw += c;
        if (raw.length > 8192) req.destroy();
      });
      req.on("end", () => {
        if (a.length <= 20) {
          try {
            const b = JSON.parse(raw || "{}");
            O.errors.push({ at: now, msg: d.clean(b.msg, 300), stack: d.clean(b.stack, 1200), url: d.clean(b.url, 120), ua: d.clean(req.headers["user-agent"], 160) });
            if (O.errors.length > 300) O.errors.splice(0, O.errors.length - 300);
            d.save();
          } catch {
          }
        }
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    if (p.startsWith("/api/admin/backup")) {
      const tok = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      const u = auth(tok);
      if (!u || !d.isAdmin(u.id)) {
        res.writeHead(403);
        res.end("Forbidden");
        return true;
      }
      const f = backupNow() || backups()[0] && path.join(bdir, backups()[0].file);
      if (!f) {
        res.writeHead(500);
        res.end("No backup");
        return true;
      }
      res.writeHead(200, { "content-type": "application/gzip", "content-disposition": `attachment; filename="${path.basename(f)}"`, "cache-control": "no-store" });
      fs.createReadStream(f).pipe(res);
      return true;
    }
    return false;
  }
  function xpMsg(u) {
    return { t: "xp", xp: u.xp || 0, today: u.xpDay === day2() ? u.xpToday || 0 : 0, cap: XP_DAILY };
  }
  const userInfo = (u) => ({ id: u.id, name: u.name, number: u.number, email: u.email || null, google: !!u.google, joined: u.joined, seen: u.seen, online: !!d.liveOf(u.id), bal: d.db.bank?.acct?.[u.id]?.bal ?? null, xp: u.xp || 0, muteUntil: u.muteUntil || 0, banned: u.banned && u.banned.until > Date.now() ? u.banned : null, reports: d.db.reports.filter((r) => r.against === u.id).length });
  function kick(u, text) {
    const l = d.liveOf(u.id);
    if (l) {
      d.send(l.ws, { t: "err", text });
      try {
        l.ws.close();
      } catch {
      }
    }
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string") return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    if (m.t === "xp_hello") {
      if (u.xp === void 0) {
        u.xp = Math.max(0, Math.min(XP_IMPORT_CAP, Math.round(+m.local || 0)));
        d.save();
      }
      reply(xpMsg(u));
      return true;
    }
    if (m.t === "xp_add") {
      const n = Math.max(0, Math.min(250, Math.round(+m.n || 0)));
      if (u.xpDay !== day2()) {
        u.xpDay = day2();
        u.xpToday = 0;
      }
      const ok = Math.min(n, XP_DAILY - (u.xpToday || 0));
      if (ok > 0) {
        u.xp = (u.xp || 0) + ok;
        u.xpToday = (u.xpToday || 0) + ok;
        d.save();
      }
      reply(xpMsg(u));
      return true;
    }
    if (m.t === "track") {
      track(String(m.ev || ""));
      return true;
    }
    if (!m.t.startsWith("admin_")) return false;
    const judge = d.isAdmin(u.id), mod = judge || (d.isMod && d.isMod(u.id));
    const MOD_OK = /^admin_(stats|reports|report_done|find|mute|unmute|ban|modlog)$/;
    if (!judge && !(mod && MOD_OK.test(m.t))) {
      reply({ t: "err", text: mod ? "Judges only. Moderators can review reports, mute and give bans up to 72 hours." : "Admins only." });
      return true;
    }
    const target = m.id ? d.db.users[String(m.id)] : void 0;
    if (/^admin_(report_done|mute|unmute|ban|unban)$/.test(m.t)) {
      O.modlog ||= [];
      O.modlog.push({ at: Date.now(), by: u.id, byName: d.shown(u.id), role: judge ? "judge" : "moderator", act: m.t.slice(6), target: target ? target.number : m.i != null ? "report #" + m.i : "", hours: +m.hours || 0, note: d.clean(m.reason || m.note || "", 80) });
      if (O.modlog.length > 500) O.modlog.splice(0, O.modlog.length - 500);
      d.save();
    }
    switch (m.t) {
      case "admin_stats": {
        const days = Object.entries(O.stats).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14).map(([k, v]) => ({ day: k, ...v }));
        const users = Object.values(d.db.users);
        reply({ t: "admin_stats", users: users.length, withEmail: users.filter((x) => x.email || x.google).length, online: d.liveCount(), days, treasury: judge ? d.db.bank?.acct?.treasury?.bal ?? 0 : 0, adRevenue: judge ? d.db.ads?.revenue ?? 0 : 0, role: judge ? "judge" : "moderator", modlog: judge ? (O.modlog || []).slice(-8).reverse() : [], openReports: d.db.reports.filter((r) => !r.done).length, errors: O.errors.length, backups: backups(), storage: !judge ? null : Object.assign({}, d.dbInfo ? d.dbInfo() : {}, { hourly: (() => { try { return fs.readdirSync(hdir).length; } catch { return 0; } })(), offsite: O.offsite || null, offsiteTo: OFF.to ? OFF.to.replace(/^(.).*(@.*)$/, "$1***$2") : "" }), banned: users.filter((x) => x.banned && x.banned.until > Date.now()).length });
        return true;
      }
      case "admin_reports":
        reply({ t: "admin_reports", list: d.db.reports.map((r, i) => ({ i, ...r, byName: d.shown(r.by), againstName: d.shown(r.against), againstNumber: d.db.users[r.against]?.number })).filter((r) => !r.done).slice(-100).reverse() });
        return true;
      case "admin_report_done": {
        const r = d.db.reports[+m.i];
        if (r) {
          r.done = d.clean(m.note, 80) || "reviewed";
          r.doneBy = u.id;
          r.doneAt = Date.now();
          d.save();
        }
        reply({ t: "ok", text: "Report closed." });
        return true;
      }
      case "admin_find": {
        const q = d.clean(m.q, 60).toLowerCase();
        const byNum = d.findByNumber(q);
        const list = byNum ? [byNum] : Object.values(d.db.users).filter((x) => x.name.toLowerCase().includes(q) || (x.email || "").includes(q) || x.id === q).slice(0, 20);
        reply({ t: "admin_users", list: list.map(userInfo) });
        return true;
      }
      case "admin_mute": {
        if (!target || (!judge && d.isMod && d.isMod(target.id))) return true;
        const h = Math.max(1, Math.min(24 * 30, +m.hours || 24));
        target.muteUntil = Date.now() + h * 36e5;
        d.save();
        const l = d.liveOf(target.id);
        if (l) d.send(l.ws, { t: "note", text: `You are muted in chat for ${h} hour${h > 1 ? "s" : ""} by a moderator.` });
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_unmute": {
        if (!target) return true;
        target.muteUntil = 0;
        d.save();
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_ban": {
        if (!target || d.isAdmin(target.id) || (!judge && d.isMod && d.isMod(target.id))) return true;
        let h = +m.hours || 0;
        if (!judge && (h <= 0 || h > 72)) {
          h = 72;
          reply({ t: "ok", text: "Moderators can ban for up to 72 hours. A judge can make it longer." });
        }
        target.banned = { until: h > 0 ? Date.now() + h * 36e5 : 9e15, reason: d.clean(m.reason, 200) || "Breaking the Fyrus rules" };
        d.save();
        kick(target, `This account is suspended: ${target.banned.reason}`);
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_unban": {
        if (!target) return true;
        target.banned = void 0;
        d.save();
        reply({ t: "admin_users", list: [userInfo(target)] });
        return true;
      }
      case "admin_modlog":
        reply({ t: "admin_modlog", list: (O.modlog || []).slice(-100).reverse() });
        return true;
      case "admin_errors":
        reply({ t: "admin_errors", list: O.errors.slice(-60).reverse() });
        return true;
      case "admin_backup": {
        const f = backupNow();
        snapshotNow();
        offsiteNow(true).then((r) => reply({ t: "ok", text: r.ok ? "Off-site copy e-mailed." : "Off-site copy not sent: " + r.why })).catch(() => {});
        reply({ t: "ok", text: f ? `Backup saved: ${path.basename(f)}` : "Backup failed \u2014 check the server log." });
        reply({ t: "admin_stats_backups", backups: backups() });
        return true;
      }
    }
    return true;
  }
  /* ---------------- growth analytics + invite links (v43) ----------------
     First-party only, no third-party trackers. Per citizen we keep the days they came (last 120) and the invite
     code they arrived with; per day we keep minutes spent per area, where sessions ended, and session lengths. */
  O.an ||= { days: {} };
  O.invites ||= {};
  const DAY_MS = 864e5;
  const dayOf = (t) => new Date(t).toISOString().slice(0, 10);
  const addDays = (d, n) => dayOf(Date.parse(d + "T00:00:00Z") + n * DAY_MS);
  const anDay = (d) => {
    const x = O.an.days[d || day2()] ||= { time: {}, exits: {}, sess: { m1: 0, m5: 0, m15: 0, m60: 0, more: 0 }, opens: {} };
    return x;
  };
  function trimAn() {
    const keys = Object.keys(O.an.days).sort();
    keys.slice(0, Math.max(0, keys.length - 60)).forEach((k) => delete O.an.days[k]);
  }
  function seen(u) {
    const today = day2();
    u.days ||= [];
    if (u.days[u.days.length - 1] !== today) {
      u.days.push(today);
      if (u.days.length > 120) u.days.splice(0, u.days.length - 120);
      trimAn();
    }
  }
  function joinedVia(u, code) {
    const c = String(code || "").toLowerCase();
    if (c && O.invites[c]) u.ref = c;
  }
  const areaKey = (a) => String(a || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 48) || "Unknown";
  function left(u, ms) {
    const t = anDay();
    const a = u.anArea ? areaKey(u.anArea) : "Left in the first minute";
    u.anArea = "";
    if (Object.keys(t.exits).length < 200 || t.exits[a]) t.exits[a] = (t.exits[a] || 0) + 1;
    const m = ms / 6e4;
    t.sess[m < 1 ? "m1" : m < 5 ? "m5" : m < 15 ? "m15" : m < 60 ? "m60" : "more"]++;
    d.save();
  }
  function readJson(req, max, cb) {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > max) req.destroy();
    });
    req.on("end", () => {
      let v = null;
      try {
        v = JSON.parse(raw || "{}");
      } catch {
      }
      cb(v || {});
    });
  }
  const json = (res, code, v) => {
    res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(v));
  };
  function analytics() {
    const users = Object.values(d.db.users);
    const today = day2();
    const days = [];
    for (let i = 13; i >= 0; i--) days.push(addDays(today, -i));
    const joinDay = (u) => dayOf(u.joined || 0);
    const daily = days.map((dd) => {
      const st = O.stats[dd] || {};
      return { day: dd, newCitizens: users.filter((u) => joinDay(u) === dd).length, active: users.filter((u) => (u.days || []).includes(dd)).length, visits: st.visits || 0, peak: st.peak || 0 };
    });
    const cohorts = days.map((dd) => {
      const c = users.filter((u) => joinDay(u) === dd);
      const next = addDays(dd, 1);
      const nextDay = next <= today ? c.filter((u) => (u.days || []).includes(next)).length : null;
      const week = next <= today ? c.filter((u) => (u.days || []).some((x) => x > dd && x <= addDays(dd, 7))).length : null;
      return { day: dd, joined: c.length, nextDay, week, partial: dd < (Object.keys(O.an.days).sort()[0] || today) };
    }).filter((c) => c.joined > 0);
    const last7 = days.slice(-7);
    const sum = (k) => {
      const out = {};
      last7.forEach((dd) => {
        const t = O.an.days[dd];
        if (t) Object.entries(t[k] || {}).forEach(([a, n]) => out[a] = (out[a] || 0) + n);
      });
      return Object.entries(out).sort((a, b) => b[1] - a[1]);
    };
    const sess = { m1: 0, m5: 0, m15: 0, m60: 0, more: 0 };
    last7.forEach((dd) => {
      const t = O.an.days[dd];
      if (t) Object.keys(sess).forEach((k) => sess[k] += t.sess[k] || 0);
    });
    const invites = Object.values(O.invites).sort((a, b) => b.at - a.at).map((iv) => {
      const j = users.filter((u) => u.ref === iv.code);
      let opens = 0;
      Object.values(O.an.days).forEach((t) => opens += t.opens?.[iv.code] || 0);
      return { code: iv.code, label: iv.label, at: iv.at, opens, joined: j.length, nextDay: j.filter((u) => (u.days || []).includes(addDays(joinDay(u), 1))).length, active7: j.filter((u) => (u.days || []).some((x) => last7.includes(x))).length };
    });
    const noRef = users.filter((u) => !u.ref);
    const who = {};
    last7.forEach((dd) => {
      const t = O.an.days[dd];
      if (t && t.who) Object.entries(t.who).forEach(([k, m]) => {
        const o = who[k] ||= {};
        Object.entries(m).forEach(([v, n]) => o[v] = (o[v] || 0) + n);
      });
    });
    Object.keys(who).forEach((k) => who[k] = Object.entries(who[k]).sort((a, b) => b[1] - a[1]).slice(0, 10));
    return { who, today, totalCitizens: users.length, daily, cohorts, areas: sum("time").slice(0, 20), exits: sum("exits").slice(0, 15), sess, invites, direct: { joined: noRef.length, active7: noRef.filter((u) => (u.days || []).some((x) => last7.includes(x))).length }, trackingSince: Object.keys(O.an.days).sort()[0] || today };
  }
  const prevHttp = http2;
  http2 = function (req, res, p, ip, auth) {
    if (p === "/api/an" && req.method === "POST") {
      readJson(req, 2048, (b) => {
        const u = auth(String(b.tok || ""));
        if (u && !(u.anLast > Date.now() - 5e4)) {
          u.anLast = Date.now();
          const a = areaKey(b.a);
          const t = anDay();
          if (Object.keys(t.time).length < 200 || t.time[a]) t.time[a] = (t.time[a] || 0) + 1;
          u.anArea = a;
          seen(u);
          d.save();
        } else if (u) u.anArea = areaKey(b.a);
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    if (p === "/api/an/visit" && req.method === "POST") {
      readJson(req, 2048, (b) => {
        const u = auth(String(b.tok || ""));
        const today = day2();
        if (u && u.anVisitDay !== today) {
          u.anVisitDay = today;
          const t = anDay();
          t.who ||= {};
          const bump2 = (k, v) => {
            v = areaKey(v).slice(0, 40);
            const m = t.who[k] ||= {};
            if (Object.keys(m).length < 80 || m[v]) m[v] = (m[v] || 0) + 1;
          };
          bump2("device", b.dev);
          bump2("os", b.os);
          bump2("browser", b.br);
          bump2("region", b.tz);
          bump2("language", b.lang);
          bump2("source", b.src);
          bump2("quality", b.q);
          const f = +b.fps || 0;
          bump2("smoothness", !f ? "Unknown" : f < 20 ? "Slow (under 20 FPS)" : f < 30 ? "OK (20-30 FPS)" : f < 45 ? "Good (30-45 FPS)" : "Smooth (45+ FPS)");
          d.save();
        }
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    if (p === "/api/ref" && req.method === "POST") {
      readJson(req, 512, (b) => {
        const c = String(b.c || "").toLowerCase().slice(0, 24);
        if (O.invites[c]) {
          const t = anDay();
          t.opens[c] = (t.opens[c] || 0) + 1;
          d.save();
        }
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    if (p === "/api/admin/analytics" || p === "/api/admin/invites") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      if (!u || !d.isAdmin(u.id)) return json(res, 403, { error: "Judges only" }), true;
      if (p === "/api/admin/analytics") return json(res, 200, analytics()), true;
      if (req.method !== "POST") return json(res, 405, { error: "POST" }), true;
      readJson(req, 2048, (b) => {
        if (b.del) {
          delete O.invites[String(b.del).toLowerCase()];
          d.save();
          return json(res, 200, { ok: true });
        }
        const label = d.clean(b.label, 40);
        if (!label) return json(res, 400, { error: "Give the invite a name, for example: Ali's friends" });
        if (Object.keys(O.invites).length >= 300) return json(res, 400, { error: "Too many invite links" });
        const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 14) || "invite";
        let code;
        do code = slug + "-" + Math.random().toString(36).slice(2, 6); while (O.invites[code]);
        O.invites[code] = { code, label, at: Date.now(), by: u.id };
        d.save();
        json(res, 200, { ok: true, code });
      });
      return true;
    }
    return prevHttp(req, res, p, ip, auth);
  };
  /* ---------------- help desk (v46): problems, ideas, questions from citizens ----------------
     Tickets live in O.support (last 2,000). Judges and moderators answer them in Admin desk > Help desk;
     the answer reaches the citizen in the city (live note) and by e-mail when they left one.
     New tickets are e-mailed to SUPPORT_EMAIL (or BACKUP_EMAIL) when Resend is configured. */
  O.support ||= [];
  const SUP = { to: String(process.env.SUPPORT_EMAIL || process.env.BACKUP_EMAIL || "").trim() };
  const KINDS = { problem: "Something is broken", idea: "Idea", question: "Question", safety: "Safety / someone is bothering me", payment: "Payment", other: "Other" };
  const supHits = /* @__PURE__ */ new Map();
  async function mail(to, subject, text) {
    if (!to || !OFF.key || !OFF.from) return false;
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${OFF.key}`, "content-type": "application/json" }, body: JSON.stringify({ from: OFF.from, to: [to], subject, text }) });
      return r.ok;
    } catch {
      return false;
    }
  }
  const longText = (v, n) => String(v ?? "").replace(/\r/g, "").replace(/[\u0000-\u0009\u000b-\u001f]/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, n);
  const okEmail = (e) => /^[^\s@]{1,64}@[^\s@]{1,120}\.[a-z]{2,}$/i.test(e);
  const ticketOut = (t, staff) => ({ id: t.id, at: t.at, kind: t.kind, kindLabel: KINDS[t.kind] || t.kind, text: t.text, status: t.status, replies: t.replies || [], ...(staff ? { name: t.name, number: t.number, email: t.email ? t.email.replace(/^(.).*(@.*)$/, "$1***$2") : "", area: t.area, device: t.device, lang: t.lang } : {}) });
  const prevHttp2 = http2;
  http2 = function (req, res, p, ip, auth) {
    if (p === "/api/support" && req.method === "POST") {
      readJson(req, 6144, (b) => {
        const now = Date.now();
        const hits = (supHits.get(ip) || []).filter((t) => now - t < 36e5);
        if (supHits.size > 5e3) supHits.clear();
        const u = b.tok ? auth(String(b.tok)) : null;
        const text = longText(b.text, 2000);
        const email = d.clean(b.email, 160).toLowerCase();
        const kind = KINDS[b.kind] ? b.kind : "other";
        if (text.length < 5) return json(res, 400, { error: "Please write a few words about it." });
        if (!u && !okEmail(email)) return json(res, 400, { error: "Please add an e-mail so we can answer you." });
        if (email && !okEmail(email)) return json(res, 400, { error: "That e-mail does not look right." });
        if (hits.length >= 8) return json(res, 429, { error: "Too many messages from this connection. Please try again in an hour." });
        if (u) {
          const mine = O.support.filter((t) => t.uid === u.id && now - t.at < 864e5).length;
          if (mine >= 6) return json(res, 429, { error: "You have sent 6 messages today. We will answer them first." });
        }
        hits.push(now);
        supHits.set(ip, hits);
        let id;
        do id = "T" + Math.random().toString(36).slice(2, 8).toUpperCase(); while (O.support.some((t) => t.id === id));
        const t = { id, at: now, kind, text, status: "open", uid: u ? u.id : "", name: u ? d.shown(u.id) : "Visitor", number: u ? u.number : "", email: email || (u && u.email) || "", area: d.clean(b.area, 60), device: d.clean(b.device, 120), lang: d.clean(b.lang, 20), replies: [] };
        O.support.push(t);
        if (O.support.length > 2e3) O.support.splice(0, O.support.length - 2e3);
        d.save();
        mail(SUP.to, `Fyrus help desk ${id}: ${KINDS[kind]}`, `${t.name}${t.number ? " (" + t.number + ")" : ""}${t.email ? " <" + t.email + ">" : ""}\nWhere: ${t.area || "-"}\nDevice: ${t.device || "-"}\n\n${text}\n\nAnswer it in fyrus.io > Admin desk > Help desk.`);
        json(res, 200, { ok: true, id });
      });
      return true;
    }
    if (p === "/api/support/mine") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      if (!u) return json(res, 200, { list: [], unread: 0 }), true;
      const list = O.support.filter((t) => t.uid === u.id).slice(-20).reverse().map((t) => ticketOut(t, false));
      let changed = false;
      if (/[?&]peek=1/.test(req.url || "")) return json(res, 200, { unread: O.support.filter((t) => t.uid === u.id && t.unread).length }), true;
      O.support.forEach((t) => {
        if (t.uid === u.id && t.unread) {
          t.unread = false;
          changed = true;
        }
      });
      if (changed) d.save();
      return json(res, 200, { list }), true;
    }
    if (p === "/api/admin/support") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      const judge = u && d.isAdmin(u.id), mod = u && (judge || (d.isMod && d.isMod(u.id)));
      if (!mod) return json(res, 403, { error: "Judges and moderators only" }), true;
      if (req.method !== "POST") {
        const open = O.support.filter((t) => t.status !== "closed");
        const closed = O.support.filter((t) => t.status === "closed").slice(-40);
        const vis = (t) => judge || t.kind !== "payment";
        return json(res, 200, { open: open.filter(vis).reverse().slice(0, 200).map((t) => ticketOut(t, true)), closed: closed.filter(vis).reverse().map((t) => ticketOut(t, true)), counts: Object.fromEntries(Object.keys(KINDS).map((k) => [k, open.filter((t) => t.kind === k).length])), mailTo: SUP.to ? SUP.to.replace(/^(.).*(@.*)$/, "$1***$2") : "" }), true;
      }
      readJson(req, 4096, (b) => {
        const t = O.support.find((x) => x.id === String(b.id || ""));
        if (!t) return json(res, 404, { error: "Not found" });
        if (t.kind === "payment" && !judge) return json(res, 403, { error: "Payment questions are answered by a judge." });
        const reply = longText(b.reply, 2000);
        if (reply) {
          t.replies ||= [];
          t.replies.push({ at: Date.now(), by: d.shown(u.id), text: reply });
          t.unread = true;
          if (t.uid) {
            const l = d.liveOf(t.uid);
            if (l) d.send(l.ws, { t: "note", text: `Fyrus help desk answered your message ${t.id}: ${reply.slice(0, 160)}${reply.length > 160 ? "\u2026" : ""}` });
          }
          if (t.email) mail(t.email, `Fyrus help desk: answer to ${t.id}`, `Hello ${t.name},\n\nYou wrote: "${t.text.slice(0, 300)}"\n\nOur answer:\n${reply}\n\n— Fyrus help desk (https://fyrus.io)`);
        }
        if (b.status === "closed" || b.status === "open") t.status = b.status;
        else if (reply) t.status = "answered";
        O.modlog ||= [];
        O.modlog.push({ at: Date.now(), by: u.id, byName: d.shown(u.id), role: judge ? "judge" : "moderator", act: "help " + (reply ? "answer" : t.status), target: t.id, hours: 0, note: reply.slice(0, 80) });
        d.save();
        json(res, 200, { ok: true, ticket: ticketOut(t, true) });
      });
      return true;
    }
    return prevHttp2(req, res, p, ip, auth);
  };
  return { onMessage: onMessage2, http: http2, bump, track, backupNow, xpMsg, seen, joinedVia, left };
}

