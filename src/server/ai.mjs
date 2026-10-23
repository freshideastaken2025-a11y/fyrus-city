
// --- AI gateway (v48): smarter AI residents + chat translation through any Claude-compatible API. ---
// Env (Coolify): AI_BASE_URL (e.g. https://api.mwapi.dev), AI_API_KEY, optional AI_MODEL (default claude-haiku-4-5),
// AI_FORMAT = auto | anthropic | openai, AI_USER_DAILY (replies per citizen per day, default 40),
// AI_DAILY_LIMIT (all replies per day, default 4000). Falls back to ANTHROPIC_API_KEY on api.anthropic.com.
// The Fyrus Brain answers first in the browser for free; only questions it is unsure about come here.
function createAI(d) {
  const env = process.env;
  const base = String(env.AI_BASE_URL || (env.ANTHROPIC_API_KEY ? "https://api.anthropic.com" : "")).replace(/\/+$/, "");
  const key = env.AI_API_KEY || env.ANTHROPIC_API_KEY || "";
  const model = env.AI_MODEL || env.ANTHROPIC_MODEL || "claude-haiku-4-5";
  let format = String(env.AI_FORMAT || "auto").toLowerCase();
  const USER_DAY = +(env.AI_USER_DAILY || 40), ALL_DAY = +(env.AI_DAILY_LIMIT || 4e3);
  const on = () => !!(base && key);
  d.db.aiStats ||= {};
  const S = d.db.aiStats;
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const day = () => {
    const t = today();
    const x = S[t] ||= { calls: 0, talk: 0, translate: 0, inTok: 0, outTok: 0, fail: 0, users: {} };
    const ks = Object.keys(S).sort();
    ks.slice(0, Math.max(0, ks.length - 30)).forEach((k) => delete S[k]);
    return x;
  };
  let lastErr = "";
  const v = (b) => b.replace(/\/v1$/, "");
  async function callAnthropic(system, messages, maxTokens) {
    const r = await fetch(v(base) + "/v1/messages", { method: "POST", headers: { "content-type": "application/json", "x-api-key": key, authorization: `Bearer ${key}`, "anthropic-version": "2023-06-01" }, body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }) });
    if (!r.ok) {
      const t = (await r.text()).slice(0, 200);
      const e = new Error(`anthropic ${r.status} ${t}`);
      e.status = r.status;
      throw e;
    }
    const j = await r.json();
    return { text: (j.content || []).map((c) => c.text || "").join("").trim(), inTok: j.usage?.input_tokens || 0, outTok: j.usage?.output_tokens || 0 };
  }
  async function callOpenAI(system, messages, maxTokens) {
    const r = await fetch(v(base) + "/v1/chat/completions", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` }, body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "system", content: system }, ...messages] }) });
    if (!r.ok) {
      const t = (await r.text()).slice(0, 200);
      const e = new Error(`openai ${r.status} ${t}`);
      e.status = r.status;
      throw e;
    }
    const j = await r.json();
    return { text: String(j.choices?.[0]?.message?.content || "").trim(), inTok: j.usage?.prompt_tokens || 0, outTok: j.usage?.completion_tokens || 0 };
  }
  async function complete(system, messages, maxTokens, kind) {
    if (!on()) return null;
    const t = day();
    if (t.calls >= ALL_DAY) return null;
    t.calls++;
    t[kind] = (t[kind] || 0) + 1;
    try {
      let out;
      if (format === "openai") out = await callOpenAI(system, messages, maxTokens);
      else if (format === "anthropic") out = await callAnthropic(system, messages, maxTokens);
      else {
        try {
          out = await callAnthropic(system, messages, maxTokens);
          format = "anthropic";
        } catch (e) {
          if (![400, 404, 405, 415].includes(e.status)) throw e;
          out = await callOpenAI(system, messages, maxTokens);
          format = "openai";
        }
      }
      t.inTok += out.inTok;
      t.outTok += out.outTok;
      d.save();
      return out.text || null;
    } catch (e) {
      t.fail++;
      lastErr = String(e.message || e).replace(key, "***").slice(0, 200);
      console.error("ai", lastErr);
      return null;
    }
  }
  const FACTS = "Fyrus is a free virtual country in the year 2040 at fyrus.io: walk a 3D city, get a passport, own homes and land, open a shop on the escrow market, take free courses with certificates, shift jobs, 13 arcade games and a battle arena (XP only), elections (one citizen one vote), a daily programme (09:00 parade, 11:00 storytime, 13:00 open mic, 16:00 market hour, 18:00 changing of the guard, 20:00 sunset concert, 22:00 night set), Vector Bay city across the sea (fly via More > Transit), SkyPort with free flying cars. FYC is play money only: it cannot be cashed out. Safety: block/report people, Help & feedback under the More button, Kids mode with a parent PIN, 13+ to use, voice chat and Skyline Club 18+. Never ask for or give personal data, money outside Fyrus, or contact details.";
  const clean = (s, n) => String(s ?? "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n);
  const hits = /* @__PURE__ */ new Map();
  function http2(req, res, p, ip, auth) {
    const json = (code, o) => {
      res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(o));
    };
    if (p === "/api/ai/status") return json(200, { on: on() }), true;
    if (p === "/api/ai/talk" && req.method === "POST") {
      let raw = "";
      req.on("data", (c) => {
        raw += c;
        if (raw.length > 12e3) req.destroy();
      });
      req.on("end", async () => {
        let b = {};
        try {
          b = JSON.parse(raw || "{}");
        } catch {}
        const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
        if (!u) return json(401, { error: "enter first" });
        if (!on()) return json(503, { error: "off" });
        if (u.muteUntil && u.muteUntil > Date.now()) return json(429, { error: "muted" });
        const t = day();
        const n = t.users[u.id] || 0;
        if (n >= USER_DAY) return json(429, { error: "limit" });
        const now = Date.now(), h = (hits.get(u.id) || []).filter((x) => now - x < 6e4);
        if (h.length >= 8) return json(429, { error: "slow down" });
        h.push(now);
        hits.set(u.id, h);
        if (hits.size > 2e4) hits.clear();
        t.users[u.id] = n + 1;
        const npc = b.npc || {};
        const hist = (Array.isArray(b.history) ? b.history : []).slice(-6).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: clean(m.content, 500) })).filter((m) => m.content);
        const text = clean(b.text, 600);
        if (!text) return json(400, { error: "empty" });
        while (hist.length && hist[0].role !== "user") hist.shift();
        const msgs = [...hist, { role: "user", content: text }];
        for (let i = msgs.length - 1; i > 0; i--) if (msgs[i].role === msgs[i - 1].role) msgs.splice(i - 1, 1);
        const hints = (Array.isArray(b.hints) ? b.hints : []).slice(0, 3).map((x) => clean(x, 600)).filter(Boolean);
        const system = `You are ${clean(npc.name, 40) || "Maya"}, ${clean(npc.role, 60) || "a resident"} in Fyrus. ${clean(npc.persona, 600)}
You are an AI resident (if asked directly, say so honestly). Talk face to face with a visitor in the 3D city. Reply in the visitor's language and script (Roman Urdu stays Roman Urdu), in 1-3 short, warm, natural sentences. Use only these facts about Fyrus; if you are not sure, say so and suggest "Where to?" at the top or More > Help & feedback.
FACTS: ${FACTS}${hints.length ? "\nMOST RELEVANT FACTS FOR THIS QUESTION:\n- " + hints.join("\n- ") : ""}
Never give medical, legal or financial advice beyond general information; never share or ask for personal contact details; keep it friendly for ages 13+.`;
        const out = await complete(system, msgs, 300, "talk");
        if (!out) return json(502, { error: "unavailable" });
        json(200, { text: out.slice(0, 900) });
      });
      return true;
    }
    if (p === "/api/admin/ai") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      if (!u || !d.isAdmin(u.id)) return json(403, { error: "Judges only" }), true;
      const days = Object.entries(S).sort((a, b2) => b2[0].localeCompare(a[0])).slice(0, 14).map(([k, x]) => ({ day: k, calls: x.calls, talk: x.talk || 0, translate: x.translate || 0, inTok: x.inTok, outTok: x.outTok, fail: x.fail, people: Object.keys(x.users || {}).length }));
      if (new URL(req.url || "/", "http://x").searchParams.get("test") === "1" && on()) {
        complete("Reply with exactly: OK, then the name of the model you are.", [{ role: "user", content: "Who are you?" }], 40, "test").then((t) => json(200, { on: on(), base: base.replace(/^https?:\/\//, ""), model, format, test: t, lastErr, days }));
        return true;
      }
      return json(200, { on: on(), base: base.replace(/^https?:\/\//, ""), model, format, lastErr, limits: { perCitizenDay: USER_DAY, perDay: ALL_DAY }, days }), true;
    }
    return false;
  }
  return { http: http2, on, complete };
}
