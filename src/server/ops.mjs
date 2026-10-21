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
  setTimeout(() => {
    if (!backups().some((b) => b.file.includes(day2()))) backupNow();
  }, 2e4);
  setInterval(() => {
    if (!backups().some((b) => b.file.includes(day2()))) backupNow();
  }, 60 * 6e4);
  if (O.stats) {
    const keys = Object.keys(O.stats).sort();
    keys.slice(0, Math.max(0, keys.length - 90)).forEach((k) => delete O.stats[k]);
  }
  const errHits = /* @__PURE__ */ new Map();
  function http2(req, res, p, ip, auth) {
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
    if (!d.isAdmin(u.id)) {
      reply({ t: "err", text: "Admins only." });
      return true;
    }
    const target = m.id ? d.db.users[String(m.id)] : void 0;
    switch (m.t) {
      case "admin_stats": {
        const days = Object.entries(O.stats).sort(([a], [b]) => b.localeCompare(a)).slice(0, 14).map(([k, v]) => ({ day: k, ...v }));
        const users = Object.values(d.db.users);
        reply({ t: "admin_stats", users: users.length, withEmail: users.filter((x) => x.email || x.google).length, online: d.liveCount(), days, treasury: d.db.bank?.acct?.treasury?.bal ?? 0, adRevenue: d.db.ads?.revenue ?? 0, openReports: d.db.reports.filter((r) => !r.done).length, errors: O.errors.length, backups: backups(), banned: users.filter((x) => x.banned && x.banned.until > Date.now()).length });
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
        if (!target) return true;
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
        if (!target || d.isAdmin(target.id)) return true;
        const h = +m.hours || 0;
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
      case "admin_errors":
        reply({ t: "admin_errors", list: O.errors.slice(-60).reverse() });
        return true;
      case "admin_backup": {
        const f = backupNow();
        reply({ t: "ok", text: f ? `Backup saved: ${path.basename(f)}` : "Backup failed \u2014 check the server log." });
        reply({ t: "admin_stats_backups", backups: backups() });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, http: http2, bump, track, backupNow, xpMsg };
}

