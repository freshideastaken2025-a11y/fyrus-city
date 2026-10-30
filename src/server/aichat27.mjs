// FYRUS 27.4 local dialogue engine. Players talk to named AI citizens with "npc_say"; rules answer facts at once
// (27.3); open conversation goes to ONE shared queue in front of the local Ollama model (loopback only), with a
// timeout, an overload limit and per-player pacing; anything that fails gets the in-character fallback.
//   env: AI_LLM=off disables the model; OLLAMA_HOST (default http://127.0.0.1:11434, must be loopback; not *_URL, which the demo guard strips);
//        OLLAMA_MODEL (default: qwen3.5:4b if installed, else the smallest installed); OLLAMA_TIMEOUT_MS (15000);
//        AI_QUEUE_MAX (6 waiting); AI_PLAYER_GAP_MS (2500 between one player's LLM questions)
function createAiChat(d) {
  const URL0 = (process.env.OLLAMA_HOST && /^https?:/.test(process.env.OLLAMA_HOST) ? process.env.OLLAMA_HOST : "http://127.0.0.1:11434");
  const LOOP = /^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(URL0);
  const ON = String(process.env.AI_LLM || "on") !== "off" && LOOP;
  const TIMEOUT = () => +(process.env.OLLAMA_TIMEOUT_MS || 15e3), QMAX = () => +(process.env.AI_QUEUE_MAX || 6), GAP = () => +(process.env.AI_PLAYER_GAP_MS || 2500);
  // 27.4 measured on the Mac: the model on the GPU froze the game for 11.6 s while loading and dropped it to 34 fps
  // while answering (Ollama and the browser share the GPU). Default: model on the CPU (AI_GPU=on to change), kept
  // loaded for AI_KEEP (30m) and loaded once at start-up, before anyone talks, instead of during play.
  const GPU = () => String(process.env.AI_GPU || "off") === "on" ? {} : { num_gpu: 0 };
  const KEEP = () => process.env.AI_KEEP || "30m";
  // 27.12 answer length; context window only when AI_CTX is set (the model default otherwise). The preload MUST use the
  // same num_ctx as the questions, or Ollama reloads the model on the first question (measured on the Mac: 17 s preload,
  // a 15 s timeout and a 1.8 s frame when they differed); a 2048 window gave no measurable speed-up on the CPU.
  const CTXO = () => +process.env.AI_CTX > 0 ? { num_ctx: +process.env.AI_CTX } : {}, PREDICT = () => +(process.env.AI_PREDICT || 80);
  let preloaded = false;
  const ST = { promptChars: [], tokIn: [], tokOut: [], promptMs: [], genMs: [], cacheHits: 0, up: false, model: null, models: [], lastCheck: 0, asked: 0, rules: 0, llm: 0, fallback: 0, timeouts: 0, errors: 0, overloaded: 0, paced: 0, queueMax: 0, ms: [] };
  const queue = [];
  let busy = false;
  const lastAsk = /* @__PURE__ */ new Map(), mem = /* @__PURE__ */ new Map();
  // 27.5 short-term memory: per player x character, the last AI_STM_TURNS messages (default 8 = 4 exchanges), at most
  // AI_STM_CHARS characters go to the model (1 200), forgotten after AI_STM_TTL_MS idle (30 min) or on "npc_forget";
  // never written to disk. The last place asked about is kept so "is it far?" can be answered by rules.
  const STM_TURNS = () => +(process.env.AI_STM_TURNS || 8), STM_CHARS = () => +(process.env.AI_STM_CHARS || 1200), STM_TTL = () => +(process.env.AI_STM_TTL_MS || 18e5);
  const stmGet = (key) => {
    const e = mem.get(key);
    if (e && Date.now() - e.at > STM_TTL()) return mem.delete(key), null;
    return e;
  };
  const stmBudget = (turns) => {
    const out = [];
    let n = 0;
    for (let i = turns.length - 1; i >= 0; i--) {
      n += turns[i].content.length;
      if (n > STM_CHARS()) break;
      out.unshift(turns[i]);
    }
    if (out.length && out[0].role === "assistant") out.shift();
    return out;
  };
  setInterval(() => {
    const now = Date.now();
    for (const [k, e] of mem) if (now - e.at > STM_TTL()) mem.delete(k);
  }, 3e5).unref?.();
  // 27.6 controlled long-term memory, saved in the DB: per player x character a few facts the PLAYER stated (name,
  // likes, job, favourites), found by fixed patterns (never by the model), max 8 x 80 chars, nothing that looks like
  // contact details, secrets or numbers; visit count and first meeting. Players can list, delete or switch it off.
  const LTM = () => (d.db.aimem ||= { users: {}, optOut: {} });
  // 27.13 retention: what a citizen remembers about a player is deleted after AI_LTM_DAYS (90) without a visit;
  // short-term conversations already expire after AI_STM_TTL_MS. Checked at start-up and every hour.
  const KEEP_DAYS = () => +(process.env.AI_LTM_DAYS || 90);
  function ltmSweep() {
    const cut = Date.now() - KEEP_DAYS() * 864e5, U = LTM().users;
    let n = 0;
    for (const uid of Object.keys(U)) {
      for (const cid of Object.keys(U[uid])) if ((U[uid][cid].last || U[uid][cid].first || 0) < cut) delete U[uid][cid], n++;
      if (!Object.keys(U[uid]).length) delete U[uid];
    }
    if (n) d.save();
    ST.ltmExpired = (ST.ltmExpired || 0) + n;
    return n;
  }
  setTimeout(ltmSweep, 2e3);
  setInterval(ltmSweep, +(process.env.AI_LTM_SWEEP_MS || 36e5));
  const stmDropUser = (uid, chId) => { for (const k of [...mem.keys()]) if (k.startsWith(uid + "|") && (!chId || k === uid + "|" + chId)) mem.delete(k); };
  const LTM_MAX = 8;
  const BLOCK = /(@|https?:|www\.|\d{3,}|password|passcode|pin\b|address|street|road|phone|whatsapp|email|bank|card|cnic|passport|iban|my (son|daughter|kid)'?s? (age|school))/i;
  const PATTERNS = [
    [/\b(?:my name is|call me|i am called|i'm called)\s+([a-z][a-z' -]{1,20})/i, "name", (v) => v.replace(/\b\w/g, (c) => c.toUpperCase())],
    [/\bi (?:really )?(?:like|love|enjoy)\s+([a-z][a-z0-9' -]{2,40})/i, "likes", (v) => v],
    [/\bmy fav(?:ou?rite)? ([a-z]{3,15}) is\s+([a-z][a-z0-9' -]{1,30})/i, "favourite", (v, m) => `${m[1]}: ${m[2]}`],
    [/\bi (?:work as|am a|'m a)\s+([a-z][a-z' -]{2,30})/i, "job", (v) => v]
  ];
  function ltmLearn(uid, chId, text) {
    // a message that mentions contact details, links, secrets or long numbers teaches nothing at all
    if (LTM().optOut[uid] || BLOCK.test(text)) return 0;
    let n = 0;
    for (const [re, k, fmt] of PATTERNS) {
      const m = text.match(re);
      if (!m) continue;
      const raw = (m[2] && k !== "favourite" ? m[2] : m[1]).trim().replace(/[.!?,;:].*$/, "").replace(k === "name" ? /\s+(and|but|because|so|who|from|in|at)\b.*$/i : /\s+(and i|but|because)\b.*$/i, "").replace(/^(a|an|the)\s+/i, "").slice(0, 60);
      // 27.13 a name is at most 3 words ("my name is Tia and I like jazz" -> "Tia")
      if (k === "name" && raw.split(/\s+/).length > 3) continue;
      const v = d.filter(fmt(raw, m)).slice(0, 80);
      if (!v || v.length < 2 || BLOCK.test(v) || BLOCK.test(m[0])) continue;
      const rec = ((LTM().users[uid] ||= {})[chId] ||= { facts: [], visits: 0, first: Date.now() });
      const single = k === "name" || k === "job";
      rec.facts = rec.facts.filter((f) => !(f.k === k && (single || f.v.toLowerCase() === v.toLowerCase())));
      rec.facts.push({ k, v, at: Date.now() });
      while (rec.facts.length > LTM_MAX) rec.facts.shift();
      n++;
    }
    if (n) d.save();
    return n;
  }
  const ltmGet = (uid, chId) => LTM().optOut[uid] ? null : LTM().users[uid]?.[chId] || null;
  const ltmText = (rec) => !rec || !rec.facts.length ? "" : `\nWhat you remember about them (they told you): ${rec.facts.map((f) => f.k === "name" ? `they like to be called ${f.v}` : f.k === "likes" ? `they like ${f.v}` : f.k === "job" ? `they work as ${/^[aeiou]/i.test(f.v) ? "an" : "a"} ${f.v}` : `favourite ${f.v}`).join("; ")}. You have met ${rec.visits} time${rec.visits === 1 ? "" : "s"}.`;
  async function health() {
    if (!ON) return;
    ST.lastCheck = Date.now();
    try {
      const ac = new AbortController(), to = setTimeout(() => ac.abort(), 3e3);
      const r = await fetch(URL0 + "/api/tags", { signal: ac.signal }).then((x) => x.json());
      clearTimeout(to);
      ST.models = (r.models || []).map((m) => ({ name: m.name, size: m.size || 0 }));
      const want = process.env.OLLAMA_MODEL;
      ST.model = want && ST.models.some((m) => m.name === want) ? want : ST.models.find((m) => m.name === "qwen3.5:4b")?.name || ST.models.slice().sort((a, b) => a.size - b.size)[0]?.name || null;
      ST.up = !!ST.model;
      if (ST.up && !preloaded && String(process.env.AI_PRELOAD || "on") !== "off") {
        preloaded = true;
        const t0 = Date.now();
        fetch(URL0 + "/api/generate", { method: "POST", body: JSON.stringify({ model: ST.model, prompt: "", keep_alive: KEEP(), options: { ...CTXO(), ...GPU() } }) }).then((x) => x.json()).then(() => (ST.preloadMs = Date.now() - t0)).catch(() => (preloaded = false));
      }
    } catch {
      ST.up = false;
    }
  }
  health();
  setInterval(health, 6e4).unref?.();
  // 27.12 token budget: the static prefix (persona, short facts, rules) is identical for every question to the same
  // character, so Ollama can reuse its prompt cache; place descriptions are sent only for the 3 nearest places and any
  // place named in the question, at the end of the prompt (was all 15 descriptions: about 900 characters more per call)
  const FACTS = () => `Fyrus City facts: year 2040, a clean smart city. Places: ${AI_PLACES.map((p) => p.name).join(", ")}. FYC are in-game credits only: they cannot be bought with or exchanged for real money.`;
  const nearbyText = (pos, text) => {
    const t = AI_NORM(text), named = AI_PLACES.filter((p) => t.includes(AI_NORM(p.name)));
    const near = AI_PLACES.slice().sort((a, b) => Math.hypot(a.x - pos.x, a.z - pos.z) - Math.hypot(b.x - pos.x, b.z - pos.z)).slice(0, 3);
    const L = [...new Set([...named, ...near])].slice(0, 5);
    return `\nNearby / mentioned places: ${L.map((p) => `${p.name} (${p.desc})`).join("; ")}.`;
  };
  // 27.12 reply cache: a first question to a character, with no conversation, memory or lesson context, gets the same
  // answer for AI_CACHE_MS (10 min) instead of another model call
  const RC = new Map(), RC_MS = () => +(process.env.AI_CACHE_MS || 6e5);
  const rcKey = (ch, text) => ch.id + "|" + AI_NORM(text).slice(0, 160);
  const RULES = "Rules: stay in character; reply in 1-3 short sentences; be warm and natural; never give prices, phone numbers, links or real-world advice about money, health or law; never claim to be a real person outside the game; if asked about something you don't know, say so briefly and suggest asking another citizen.";
  function charOf(m) {
    const core = AI_CHARS.find((c) => c.id === String(m.npc || ""));
    if (core) return core;
    const sm = /^shop:([a-z0-9-]{1,30})$/.exec(String(m.npc || "")), shop = sm && typeof svcById === "function" ? svcById(sm[1]) : null;
    const tm = /^teacher:([a-z0-9-]{1,40})$/.exec(String(m.npc || "")), course = tm && d.db?.edu?.courses && own(d.db.edu.courses, tm[1]) ? d.db.edu.courses[tm[1]] : null;
    const bm = /^biz:([0-9]{1,8})$/.exec(String(m.npc || "")), bz = bm && d.bizInfo ? d.bizInfo(bm[1]) : null;
    if (bz) return bz.clerk ? { id: "biz:" + bz.id, biz: bz, name: `${bz.clerk.name} (${bz.name})`, role: "clerk", persona: `You are ${bz.clerk.name}, the AI clerk at ${bz.name}, a ${bz.kind} run by ${bz.ownerName} in Fyrus City (2040). You help customers choose from the menu only. Never state prices yourself, never promise discounts or free items, and never say you can move money: only the owner decides that.`, greeting: `Welcome to ${bz.name}! I'm ${bz.clerk.name}.`, quick: ["What do you have?"] } : { id: "biz:" + bz.id, biz: bz, noStaff: true, name: bz.name, role: "business" };
    if (course) return { id: "teacher:" + course.id, course, name: `${course.teacherName || "Fyrus Academy"} (${course.title})`, role: "teacher", persona: `You are a teacher from ${course.teacherName || "Fyrus Academy"}, teaching "${course.title}". You explain simply and kindly with one small example. You never give the answer to a quiz question; you point to the lesson instead.`, greeting: `Welcome to ${course.title}! Ask me about any lesson.`, quick: ["What will I learn?"] };
    if (shop) return { id: "shop:" + shop.id, shop, name: `${shop.name} assistant`, role: "shop assistant", persona: `You are the friendly assistant at ${shop.name} (${shop.sub || "a shop"}) in Fyrus City (2040). You help customers choose. Never state prices or stock yourself: say the card shows them.`, greeting: `Welcome to ${shop.name}! Ask me about anything we sell.`, quick: ["What do you sell?"] };
    // procedural / player-made citizens: the server builds the persona from a few short, cleaned fields only
    const c = m.char && typeof m.char === "object" ? m.char : {};
    const name = d.filter(d.clean(c.name, 24)) || "Citizen", role = d.filter(d.clean(c.role, 40)) || "resident", style = d.filter(d.clean(c.style, 60)), bio = d.filter(d.clean(c.bio, 200));
    return { noCache: true, id: "x:" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30), name, role, persona: `You are ${name}, a ${role} in Fyrus City (2040).${style ? ` Personality: ${style}.` : ""}${bio ? ` About you: ${bio}` : ""}`, greeting: `Hi, I'm ${name}!`, quick: [], custom: true };
  }
  function clean(text) {
    let t = String(text || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/<\/?[^>]{1,20}>/g, "").replace(/https?:\/\/\S+|www\.\S+/gi, "").replace(/\s+/g, " ").trim();
    if (t.length > 320) t = t.slice(0, 320);
    // a reply cut by the token limit ends at its last full sentence
    if (t && !/[.!?؟"')]$/.test(t)) {
      const cut = t.replace(/[^.!?؟]*$/, "");
      t = cut.length >= 20 ? cut : t + "…";
    }
    return d.filter(t);
  }
  async function callModel(ch, history, text, who, memText) {
    const ac = new AbortController(), to = setTimeout(() => ac.abort(), TIMEOUT());
    try {
      const r = await fetch(URL0 + "/api/chat", { method: "POST", signal: ac.signal, body: JSON.stringify({ model: ST.model, stream: false, think: false, keep_alive: KEEP(), options: { num_predict: PREDICT(), temperature: 0.7, ...CTXO(), ...GPU() }, messages: [{ role: "system", content: `${ch.persona}\n${FACTS()}\n${RULES}${who ? `\nYou are talking with ${who}.` : ""}${memText || ""}` }, ...history, { role: "user", content: text }] }) }).then((x) => x.json());
      ST.promptChars.push(JSON.stringify(history).length + text.length + ch.persona.length + (memText || "").length + 900);
      if (r?.prompt_eval_count) ST.tokIn.push(r.prompt_eval_count), ST.tokOut.push(r.eval_count || 0), ST.promptMs.push(Math.round((r.prompt_eval_duration || 0) / 1e6)), ST.genMs.push(Math.round((r.eval_duration || 0) / 1e6));
      for (const a of [ST.promptChars, ST.tokIn, ST.tokOut, ST.promptMs, ST.genMs]) if (a.length > 50) a.shift();
      return r?.message?.content || r?.response || "";
    } finally {
      clearTimeout(to);
    }
  }
  function pump() {
    if (busy || !queue.length) return;
    busy = true;
    const job = queue.shift(), t0 = Date.now();
    callModel(job.ch, job.history, job.text, job.who, job.mem).then((raw) => {
      const out = clean(raw);
      if (!out) throw new Error("empty");
      ST.llm++;
      ST.ms.push(Date.now() - t0);
      if (ST.ms.length > 50) ST.ms.shift();
      job.done(out, "llm");
    }).catch((e) => {
      e?.name === "AbortError" ? ST.timeouts++ : ST.errors++;
      if (e?.name !== "AbortError") ST.up = false, setTimeout(health, 5e3);
      ST.fallback++;
      job.done(aiFallback(job.ch, job.text, { intent: "open" }), e?.name === "AbortError" ? "fallback-timeout" : "fallback-error");
    }).finally(() => {
      busy = false;
      pump();
    });
  }
  function onMessage2(me, m) {
    if (m.t !== "npc_say" && m.t !== "ai_status" && m.t !== "npc_forget" && !String(m.t).startsWith("ai_mem")) return false;
    if (m.t === "ai_mem_list") {
      const all = LTM().users[me.u.id] || {};
      d.send(me.ws, { t: "ai_mem", optOut: !!LTM().optOut[me.u.id], chars: Object.entries(all).map(([id, r]) => ({ id, name: AI_CHARS.find((c) => c.id === id)?.name || id.replace(/^x:/, ""), facts: r.facts, visits: r.visits, first: r.first, last: r.last || r.first })), keepDays: KEEP_DAYS() });
      return true;
    }
    if (m.t === "ai_mem_forget") {
      const all = LTM().users[me.u.id];
      if (all && m.npc && Object.prototype.hasOwnProperty.call(all, String(m.npc))) delete all[String(m.npc)];
      else if (!m.npc) delete LTM().users[me.u.id];
      stmDropUser(me.u.id, m.npc ? String(m.npc) : null);
      d.save();
      d.send(me.ws, { t: "ok", text: m.npc ? "That citizen forgot what you told them." : "Every citizen forgot what you told them." });
      return true;
    }
    if (m.t === "ai_mem_opt") {
      if (m.on === false) (LTM().optOut[me.u.id] = Date.now()), delete LTM().users[me.u.id], stmDropUser(me.u.id);
      else delete LTM().optOut[me.u.id];
      d.save();
      d.send(me.ws, { t: "ok", text: m.on === false ? "Citizens won't remember anything about you, and what they knew is deleted." : "Citizens may remember what you tell them again." });
      return true;
    }
    if (m.t === "ai_mem") return true;
    if (m.t === "npc_forget") {
      const ch0 = charOf(m);
      mem.delete(me.u.id + "|" + ch0.id);
      d.send(me.ws, { t: "npc_forgot", npc: ch0.id });
      return true;
    }
    const u = me.u, reply = (x) => d.send(me.ws, x);
    if (m.t === "ai_status") return reply({ t: "ai_status", on: ON, up: ST.up, model: ST.model, queue: queue.length, busy, stats: { ...ST, ms: void 0, promptChars: void 0, tokIn: void 0, tokOut: void 0, promptMs: void 0, genMs: void 0, avg: Object.fromEntries(["promptChars", "tokIn", "tokOut", "promptMs", "genMs"].map((k) => [k, ST[k].length ? Math.round(ST[k].reduce((a, b) => a + b, 0) / ST[k].length) : null])), cache: RC.size, p50: ST.ms.length ? ST.ms.slice().sort((a, b) => a - b)[ST.ms.length >> 1] : null } }), true;
    const text = d.clean(m.text, 300), ch = charOf(m), rid = d.clean(m.rid, 40) || void 0;
    if (!text) return true;
    ST.asked++;
    const key = u.id + "|" + ch.id, fresh0 = !stmGet(key), ent = stmGet(key) || { turns: [], at: Date.now() }, hist = ent.turns;
    // 27.6: a new conversation counts as a visit; facts the player states are learned by fixed patterns
    if (fresh0 && !LTM().optOut[u.id]) {
      const rec = ((LTM().users[u.id] ||= {})[ch.id] ||= { facts: [], visits: 0, first: Date.now() });
      rec.visits++;
      rec.last = Date.now();
      rec.last = Date.now();
      d.save();
    }
    ltmLearn(u.id, ch.id, text);
    const lt = ltmGet(u.id, ch.id);
    const done = (out, source, place) => {
      hist.push({ role: "user", content: text }, { role: "assistant", content: out });
      while (hist.length > STM_TURNS()) hist.shift();
      ent.at = Date.now();
      if (place) ent.place = place;
      mem.delete(key);
      mem.set(key, ent);
      if (mem.size > 2e3) mem.delete(mem.keys().next().value);
      reply({ t: "npc_reply", npc: ch.id, rid, text: out, source, remembered: hist.length });
    };
    if (ch.noStaff) return reply({ t: "npc_reply", npc: ch.id, rid, text: `Nobody is staffing ${ch.name} right now. The menu on this card still works.`, source: "rules", remembered: 0 }), true;
    let r = aiHealth(text) || aiDisclose(text, { biz: !!ch.biz }) || (ch.biz ? aiBizRoute(text, ch.biz) : ch.shop ? aiShopRoute(text, ch.shop, d.stockInfo ? d.stockInfo(ch.shop.id) : null) : ch.course ? aiTeachRoute(text, ch.course) : { answer: null });
    const ground = ch.biz ? `\nMenu (the only things sold here): ${ch.biz.menu.map((x) => x.name).join(", ") || "nothing yet"}. ${ch.biz.open ? "Open now." : "Closed now."}` : ch.course && r.lesson != null ? `\nUse this lesson text as your source and do not contradict it ("${ch.course.lessons[r.lesson].title}"): ${ch.course.lessons[r.lesson].body.slice(0, 900)}` : "";
    if (ch.biz && r.tool && d.clerkDenied) d.clerkDenied(ch.biz.id, r.tool, "asked by a customer");
    if (!r.answer) r = aiRoute(text, ch, { pos: { x: me.x || 0, z: me.z || 0 }, courses: Object.values(d.db?.edu?.courses || {}).filter((c) => c && c.title && c.status !== "draft").map((c) => c.title), civic: typeof politics !== "undefined" && politics ? politics.state() : null, acts: typeof acts28 !== "undefined" && acts28 ? acts28.open() : null, events: Object.values(d.db?.halls?.events || {}).filter((e) => e && e.status === "scheduled").sort((a, b) => a.start - b.start).slice(0, 8).map((e) => ({ title: e.title, start: e.start, end: e.end, price: e.price, hallName: (typeof hallById === "function" && hallById(e.hall)?.name) || "hall" })) });
    // follow-up about the place talked about last ("is it far?", "how do I get there?")
    if (!r.answer && ent.place && /\b(is it far|how far|far from here|get there|go there|how long|is it close|is it near|how do i get there)\b/i.test(text) && text.length < 60) {
      const p = AI_PLACES.find((x) => x.id === ent.place);
      if (p) {
        const dist = Math.round(Math.hypot(p.x - (me.x || 0), p.z - (me.z || 0)) / 10) * 10;
        r = { intent: "followup", place: p.id, answer: dist < 25 ? `You're already at ${p.name}!` : `${p.name} is about ${dist} m away \u2014 roughly ${Math.max(1, Math.round(dist / 80))} min on foot, or take a taxi from the map.`, confidence: 0.8 };
      }
    }
    const eligible = ON && (m.llm !== false);
    const now = Date.now(), paced = now - (lastAsk.get(u.id) || 0) < GAP() || queue.some((j) => j.uid === u.id);
    // 27.14 crowd test: with a 2.5 s model and 6 waiting, the last player waited 17 s. A question that would wait longer
    // than AI_MAX_WAIT_MS (9 s, from the recent median answer time) gets the instant fallback instead.
    const med = ST.ms.length ? ST.ms.slice().sort((a, b) => a - b)[ST.ms.length >> 1] : 3e3;
    const estWait = (queue.length + (busy ? 1 : 0) + 1) * med;
    const overloaded = queue.length >= QMAX() || estWait > +(process.env.AI_MAX_WAIT_MS || 9e3);
    const path = aiDecide(r, { llmEligible: eligible && !paced, llmUp: ST.up, overloaded });
    // greeting a returning player by the name they gave
    if (r.intent === "greet" && lt && lt.visits > 1) {
      const nm = lt.facts.find((f) => f.k === "name");
      r = { ...r, answer: aiWelcomeBack(ch.id, nm && nm.v) };
    }
    if (path === "rules") return ST.rules++, done(r.answer, "rules", r.place), true;
    if (path === "llm") {
      lastAsk.set(u.id, now);
      const who = d.shown ? d.shown(u.id) : u.name, lmem = ltmText(lt);
      const personal = /\d|@|\b(my|mine|i am|i'm|call me)\b/i.test(text);
      const ck = hist.length === 0 && !lmem && !ground && !ch.biz && !ch.noCache && !personal ? rcKey(ch, text) : null, hit = ck && RC.get(ck);
      if (hit && Date.now() - hit.at < RC_MS()) return ST.cacheHits++, done(hit.text, "llm-cache"), true;
      const done2 = (out, source) => {
        if (ck && source === "llm" && !(who && out.toLowerCase().includes(String(who).toLowerCase()))) {
          RC.set(ck, { text: out, at: Date.now() });
          if (RC.size > 300) RC.delete(RC.keys().next().value);
        }
        done(out, source);
      };
      queue.push({ uid: u.id, ch, text, history: stmBudget(hist), who, mem: aiPersonaLines(ch.id, (/* @__PURE__ */ new Date()).getHours(), lt?.visits || 1, hist.length === 0) + lmem + ground + nearbyText({ x: me.x || 0, z: me.z || 0 }, text), done: done2 });
      ST.queueMax = Math.max(ST.queueMax, queue.length);
      reply({ t: "npc_typing", npc: ch.id, rid, position: queue.length });
      pump();
      return true;
    }
    if (overloaded) ST.overloaded++;
    if (paced && eligible) ST.paced++;
    ST.fallback++;
    done(aiFallback(ch, text, r), "fallback");
    return true;
  }
  return { onMessage: onMessage2, stats: ST, health };
}
