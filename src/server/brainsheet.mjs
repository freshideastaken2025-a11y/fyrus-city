
// --- Brain sheet (v52): every question asked to an AI resident is saved (no name, no number), and the team answers
// them in Admin desk > Brain. Answers go live at once for every resident (GET /api/brain/custom). CSV export/import.
// db.brain = { q: { key: {q, lang, intent, score, n, first, last, npc} }, custom: [{ id, q: [..], a: {lang: text}, at, by }], fix: { key: intentId } }
function createBrainSheet(d) {
  d.db.brain ||= { q: {}, custom: [], fix: {} };
  const B = d.db.brain;
  B.q ||= {};
  B.custom ||= [];
  B.fix ||= {};
  const MAXQ = 2e4;
  const hits = /* @__PURE__ */ new Map();
  const keyOf = (s) => String(s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 200);
  const clean = (s, n) => String(s ?? "").replace(/[\u0000-\u0009\u000b-\u001f]/g, " ").trim().slice(0, n);
  const json = (res, code, o) => {
    res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(o));
  };
  let customCache = null;
  const customOut = () => customCache ||= JSON.stringify({ v: B.custom.length + ":" + (B.custom[B.custom.length - 1]?.at || 0) + ":" + Object.keys(B.fix).length, custom: B.custom.map((c) => ({ id: c.id, q: c.q, a: c.a })), fix: B.fix });
  const changed = () => {
    customCache = null;
    d.save();
  };
  function trim() {
    const ks = Object.keys(B.q);
    if (ks.length <= MAXQ) return;
    ks.sort((a, b) => (B.q[a].n - B.q[b].n) || (B.q[a].last - B.q[b].last)).slice(0, ks.length - MAXQ).forEach((k) => delete B.q[k]);
  }
  let saveT = null;
  const saveSoon = () => {
    if (saveT) return;
    saveT = setTimeout(() => {
      saveT = null;
      d.save();
    }, 15e3);
  };
  const readBody = (req, max, cb) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > max) req.destroy();
    });
    req.on("end", () => cb(raw));
  };
  const csvCell = (v) => '"' + String(v ?? "").replace(/"/g, '""') + '"';
  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') {
          cell += '"';
          i++;
        } else if (c === '"') q = false;
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") {
        row.push(cell);
        cell = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(cell);
        rows.push(row);
        row = [];
        cell = "";
      } else cell += c;
    }
    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }
    return rows.filter((r) => r.some((x) => x.trim()));
  }
  function http2(req, res, p, ip, auth) {
    if (!p.startsWith("/api/brain") && !p.startsWith("/api/admin/brain")) return false;
    if (p === "/api/brain/custom") {
      res.writeHead(200, { "content-type": "application/json", "cache-control": "public, max-age=60" });
      res.end(customOut());
      return true;
    }
    if (p === "/api/brain/log" && req.method === "POST") {
      readBody(req, 2048, (raw) => {
        const now = Date.now();
        const h = (hits.get(ip) || []).filter((t) => now - t < 6e4);
        if (h.length < 40) {
          h.push(now);
          hits.set(ip, h);
          if (hits.size > 2e4) hits.clear();
          let b = {};
          try {
            b = JSON.parse(raw || "{}");
          } catch {}
          const q = clean(b.q, 300), k = keyOf(q);
          if (k.length >= 2) {
            const e = B.q[k] ||= { q, lang: clean(b.lang, 6), first: now, n: 0 };
            e.n++;
            e.last = now;
            e.intent = clean(b.intent, 60) || "";
            e.score = Math.round((+b.score || 0) * 100) / 100;
            e.lang = clean(b.lang, 6) || e.lang;
            e.npc = clean(b.npc, 40);
            trim();
            saveSoon();
          }
        }
        res.writeHead(204);
        res.end();
      });
      return true;
    }
    // admin (judges and moderators)
    const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
    if (!u || !(d.isAdmin(u.id) || (d.isMod && d.isMod(u.id)))) return json(res, 403, { error: "Judges and moderators only" }), true;
    if (p === "/api/admin/brain" && req.method !== "POST") {
      const all = Object.entries(B.q).map(([k, e]) => ({ k, ...e, answered: !!(e.intent && e.score >= 0.45) || B.custom.some((c) => c.q.some((x) => keyOf(x) === k)) || !!B.fix[k] }));
      const open = all.filter((e) => !e.answered).sort((a, b) => b.n - a.n || b.last - a.last).slice(0, 300);
      const top = all.filter((e) => e.answered).sort((a, b) => b.n - a.n).slice(0, 100);
      return json(res, 200, { total: all.length, asks: all.reduce((s, e) => s + e.n, 0), unanswered: all.filter((e) => !e.answered).length, open, top, custom: B.custom.slice().reverse().slice(0, 300), fixes: Object.keys(B.fix).length }), true;
    }
    if (p === "/api/admin/brain" && req.method === "POST") {
      readBody(req, 2e4, (raw) => {
        let b = {};
        try {
          b = JSON.parse(raw || "{}");
        } catch {}
        const k = keyOf(b.k || b.q);
        if (b.act === "answer") {
          const a = {};
          ["en", "rur", "ur", "hi", "ar"].forEach((l) => {
            const t = clean(b.a && b.a[l], 1200);
            if (t) a[l] = t;
          });
          if (!Object.keys(a).length) return json(res, 400, { error: "Write the answer first." });
          const qs = [clean(b.q, 300), ...(Array.isArray(b.more) ? b.more : String(b.more || "").split("\n")).map((x) => clean(x, 300))].filter((x) => x.length >= 2);
          let c = b.id ? B.custom.find((x) => x.id === b.id) : null;
          if (c) {
            c.a = { ...c.a, ...a };
            qs.forEach((x) => c.q.includes(x) || c.q.push(x));
          } else {
            c = { id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), q: qs, a, at: Date.now(), by: d.shown(u.id) };
            B.custom.push(c);
          }
          if (B.custom.length > 5e3) B.custom.splice(0, B.custom.length - 5e3);
          changed();
          return json(res, 200, { ok: true, id: c.id });
        }
        if (b.act === "fix") {
          const intent = clean(b.intent, 60);
          if (!k || !intent) return json(res, 400, { error: "Pick the right topic." });
          B.fix[k] = intent;
          changed();
          return json(res, 200, { ok: true });
        }
        if (b.act === "dismiss") {
          delete B.q[k];
          changed();
          return json(res, 200, { ok: true });
        }
        if (b.act === "delcustom") {
          B.custom = B.custom.filter((x) => x.id !== b.id);
          changed();
          return json(res, 200, { ok: true });
        }
        if (b.act === "import") {
          const rows = parseCSV(String(b.csv || ""));
          const head = (rows[0] || []).map((x) => x.trim().toLowerCase());
          const qi = head.indexOf("question"), ai = head.indexOf("answer"), li = head.indexOf("language");
          if (qi < 0 || ai < 0) return json(res, 400, { error: 'The first row must have the columns "question" and "answer" (and optionally "language": en, rur, ur, hi, ar).' });
          let added = 0;
          rows.slice(1).forEach((r) => {
            const q = clean(r[qi], 300), a = clean(r[ai], 1200), l = (li >= 0 ? String(r[li] || "").trim().toLowerCase() : "") || "en";
            if (q.length < 2 || !a || !["en", "rur", "ur", "hi", "ar"].includes(l)) return;
            const ex = B.custom.find((c) => c.q.some((x) => keyOf(x) === keyOf(q)));
            if (ex) ex.a[l] = a;
            else B.custom.push({ id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), q: [q], a: { [l]: a }, at: Date.now(), by: d.shown(u.id) + " (CSV)" });
            added++;
          });
          changed();
          return json(res, 200, { ok: true, added });
        }
        json(res, 400, { error: "Unknown action" });
      });
      return true;
    }
    if (p === "/api/admin/brain.csv") {
      const lines = [["question", "language", "times asked", "matched topic", "score", "answer", "answer language"].map(csvCell).join(",")];
      Object.values(B.q).sort((a, b) => b.n - a.n).forEach((e) => {
        const c = B.custom.find((x) => x.q.some((y) => keyOf(y) === keyOf(e.q)));
        const al = c ? Object.keys(c.a)[0] : "";
        lines.push([e.q, e.lang, e.n, e.intent, e.score, c ? c.a[al] : "", al].map(csvCell).join(","));
      });
      B.custom.forEach((c) => c.q.forEach((q) => {
        if (B.q[keyOf(q)]) return;
        Object.entries(c.a).forEach(([l, a]) => lines.push([q, l, 0, "custom", "", a, l].map(csvCell).join(",")));
      }));
      res.writeHead(200, { "content-type": "text/csv; charset=utf-8", "content-disposition": 'attachment; filename="fyrus-brain-questions.csv"', "cache-control": "no-store" });
      res.end("﻿" + lines.join("\n"));
      return true;
    }
    return json(res, 404, { error: "Not found" }), true;
  }
  return { http: http2 };
}
