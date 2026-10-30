// FYRUS 27.3 deterministic vs LLM split for named AI citizens.
// route(text, ch) answers what rules can answer well (greetings, directions to known places, prices, jobs, help,
// goodbye, identity) with a confidence; decide() picks "rules" | "llm" | "fallback". The LLM (local Ollama, 27.4) is only
// used for open conversation with an LLM-eligible character, never for facts the city knows exactly.
var AI_NORM = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9؀-ۿ\s?']/g, " ").replace(/\s+/g, " ").trim();
var AI_DIR = (dx, dz) => {
  const a = Math.atan2(dx, -dz) * 180 / Math.PI, d = ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"];
  return d[Math.round(((a + 360) % 360) / 45) % 8];
};
var AI_PLACE_WORDS = { core: ["core", "plaza", "center", "centre", "stage"], market: ["market", "shop", "shops", "store"], club: ["club", "dance", "party", "dj", "bar"], pool: ["pool", "swim", "swimming", "lido"], gardens: ["garden", "gardens", "park"], skyport: ["skyport", "flying car", "rocket", "fly"], marina: ["marina", "boat", "yacht"], coast: ["coast", "beach", "sea"], airport: ["airport", "plane", "flight"], campus: ["campus", "school", "college", "university", "course", "study"], joyland: ["joyland", "fun park", "ride", "rides"], newstv: ["news", "tv", "studio"], halls: ["hall", "halls", "event", "concert", "conference", "conference center", "conference centre"], lounge: ["lounge"], homes: ["home", "homes", "house", "plot", "land"] };
for (const p of AI_PLACES) if (p.id.startsWith("soc-")) { const n = p.name.toLowerCase(); AI_PLACE_WORDS[p.id] = [n, n.replace(/ society$/, "")]; }
// 28.5 civic institutions: elections, Parliament, law & court, police reports and city services. Facts come from the live
// politics state (ctx.civic = politics.state()), the Constitution shown in Nation > Law & Court and the CIVIC buildings
// list; nothing here changes votes or results. Server kill switch: P28_OFF=civic (falls back to the old behaviour).
var AI_CIVIC_PARL = { name: "Parliament of Fyrus", x: -58, z: -44 };
var AI_DUR = (ms) => { const m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? `${m} min` : m < 2880 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} days`; };
function aiCivic(t, ctx = {}) {
  if (/(^|,)(civic|all)(,|$)/.test(process.env.P28_OFF || "")) return null;
  const from = ctx.pos || { x: 0, z: 0 };
  const at = (p) => { const dx = p.x - from.x, dz = p.z - from.z, d = Math.round(Math.hypot(dx, dz) / 10) * 10; return d < 25 ? `${p.name} is right here` : `${p.name} is about ${d} m ${AI_DIR(dx, dz)} of here`; };
  const bld = (id) => (typeof CIVIC !== "undefined" ? CIVIC : []).find((b) => b.id === id);
  if (/\b(police|lost and found|lost something|lost my|stolen|report (a|someone|somebody|abuse|a problem|harassment)|complain|complaint)\b/.test(t)) {
    const b = bld("police");
    return { intent: "civic-report", place: "police", answer: `${b ? at(b) + " (help desk, lost & found, reports)." : ""} To report a person or content, use Report in the city: moderators review it. Scams and payment disputes go to the Fyrus Court (Nation › Law & Court).`.trim(), confidence: 0.9 };
  }
  if (/\b(court|judge|judges|dispute|scam|scammed|scammer|file a case|escrow|lawyer)\b/.test(t))
    return { intent: "civic-court", answer: "File a case in Nation › Law & Court. Every payment waits in Central Bank escrow and stays frozen while the case is open; the Justice ministry reviews it within 48 hours. A proven scam means a full refund to the victim and a permanent ban for the scammer.", confidence: 0.9 };
  // 28.12 governance rules: the city rules and the real enforcement numbers (rules28.mjs)
  if (/\b(city rules|the rules|rules of the city|what are the rules|community rules|get muted|get banned|muted|why am i muted|banned)\b/.test(t) && typeof CITY_RULES !== "undefined" && !rules28Off())
    return { intent: "civic-rules", answer: `City rules: ${CITY_RULES.map((r) => `${r.n}) ${r.title}`).join(", ")}. ${RULES28.FILTER_BLOCKS} blocked chat messages in ${Math.round(RULES28.FILTER_WINDOW_MS / 6e4)} minutes pause your chat for ${Math.round(RULES28.FILTER_MUTE_MS / 6e4)} minutes; ${RULES28.REPORTS_TO_PAUSE} reports from trusted citizens pause it for ${Math.round(RULES28.REPORT_PAUSE_MS / 36e5)} hours until a judge reviews it. Read them all at the Parliament (City rules).`, confidence: 0.9 };
  if (/\b(constitution|laws?|my rights|city rules|rules of the city)\b/.test(t))
    return { intent: "civic-law", answer: "The Constitution of Fyrus has 10 articles: a free republic, freedom of religion, no hate or harassment, escrow for every trade, zero tolerance for scams, one citizen one passport one vote, land sold by the Land Ministry (5% transfer tax), the cabinet, FYC as in-city credit only, and the Fyrus Court. Read it in Nation › Law & Court.", confidence: 0.9 };
  // 28.6 political simulation: candidates, parties/manifestos and the election calendar straight from politics.state()
  const c6 = ctx.civic;
  if (c6 && c6.phase && !/(^|,)(polsim|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now6 = c6.now || Date.now(), city6 = (id) => (typeof cityName === "function" ? cityName(id) : id);
    const live6 = (c6.parties || []).filter((p) => !p.banned), byId6 = (id) => live6.find((p) => p.id === id);
    const named = live6.find((p) => (p.name && t.includes(AI_NORM(p.name))) || (p.short && p.short.length >= 2 && new RegExp("\\b" + AI_NORM(p.short) + "\\b").test(t)));
    if (/\bwhen\b/.test(t) && /\b(election|elections|vote|voting|polls?|nominations?|results?)\b/.test(t)) {
      const opens = c6.opens || c6.until, end = c6.end || c6.until;
      return { intent: "polsim-calendar", answer: c6.phase === "nominations"
        ? `Election ${c6.n}: nominations are open now; polls open in ${AI_DUR(opens - now6)} and close in ${AI_DUR(end - now6)}. Results are announced as city news when the polls close, and the next election starts straight after.`
        : `Election ${c6.n}: polls are open now and close in ${AI_DUR(end - now6)}. Results are announced as city news at that moment, and the next election's nominations open straight after.`, confidence: 0.9 };
    }
    if (named && /\b(promise|promises|manifesto|stand for|believe|policy|policies|plan|plans|about|who leads|leader)\b/.test(t))
      return { intent: "polsim-party", answer: `${named.name} (${named.short}), led by ${named.leaderName || "its founder"}, ${named.members} member${named.members === 1 ? "" : "s"}. Slogan: "${String(named.slogan || "").slice(0, 80)}". Manifesto: ${String(named.manifesto || "none yet").slice(0, 180)}${String(named.manifesto || "").length > 180 ? "\u2026" : ""} (written by the party, not checked by the city).`, confidence: 0.9 };
    if (/\b(parties|political part(y|ies)|which party|what party|party list)\b/.test(t))
      return { intent: "polsim-parties", answer: live6.length ? `Registered parties: ${live6.slice(0, 8).map((p) => `${p.name} (${p.short}, ${p.members} member${p.members === 1 ? "" : "s"})`).join(", ")}${live6.length > 8 ? ` and ${live6.length - 8} more` : ""}. Read each manifesto in HUD \u203A Politics \u203A Parties.` : "No parties are registered yet. A passport holder can found one in HUD \u203A Politics \u203A Parties.", confidence: 0.9 };
    if (/\b(candidates?|who is (standing|running)|who can i vote for|running for mayor|standing for mayor)\b/.test(t)) {
      const ks = (c6.cands || []).filter((k) => !k.dq);
      return { intent: "polsim-cands", answer: ks.length ? `Standing for Mayor in Election ${c6.n}: ${ks.slice(0, 8).map((k) => `${k.name} in ${city6(k.city)}${byId6(k.party) ? ` (${byId6(k.party).short})` : " (independent)"}`).join(", ")}${ks.length > 8 ? ` and ${ks.length - 8} more` : ""}. You can only vote for a candidate in your own home city.` : `Nobody is standing for Mayor yet in Election ${c6.n}.${c6.phase === "nominations" ? " Passport holders can stand during nominations." : ""}`, confidence: 0.9 };
    }
  }
  const elect = /\b(election|elections|vote|voting|ballot|mayor|mayors|parliament|political part(y|ies)|mps?|seats|polls?)\b/.test(t);
  const gov = /\b(who runs|who rules|government|govern|governs|minister|ministers|ministry|ministries|cabinet|civic)\b/.test(t);
  if (elect || gov) {
    const c = ctx.civic, parts = [];
    if (/\b(where|how do i get|how to get|take me|go to|find)\b/.test(t)) parts.push(`${at(AI_CIVIC_PARL)}.`);
    if (c && c.phase) {
      parts.push(`Election ${c.n} is in its ${c.phase} phase: ${c.phase === "nominations" ? "nominations close" : "polls close"} in ${AI_DUR((c.until || 0) - (c.now || Date.now()))}.`);
      if (c.phase === "voting") parts.push(`${c.turnout || 0} of ${c.voters || 0} registered voters have voted so far.`);
      const o = c.office;
      if (o && o.seats) {
        const top = Object.entries(o.seats).sort((a, b) => b[1] - a[1])[0], mayors = Object.values(o.mayors || {}).filter(Boolean).length;
        parts.push(top ? `After election ${o.n}, ${(o.names && o.names[top[0]]) || "the largest party"} holds ${top[1]} of ${c.seats || 21} seats, with ${mayors} mayor${mayors === 1 ? "" : "s"} elected.` : `Election ${o.n} had no party votes.`);
      } else parts.push("No election has closed yet, so no mayors or MPs are in office.");
    }
    parts.push(gov && !elect
      ? `Fyrus is run by elected Mayors (one per city) and a ${(c && c.seats) || 21}-seat Parliament shared out by party votes; the ministries (Finance & Central Bank, Justice & Fyrus Court, Land & Urban Planning, Education & Citizens and more) are listed in Nation › Parliament.`
      : `Each citizen picks a home city, votes for that city's Mayor and for one party; Parliament's ${(c && c.seats) || 21} seats are shared by party votes. Vote at the Parliament of Fyrus or in HUD › Politics. Guest accounts must save an email first.`);
    return { intent: gov && !elect ? "civic-gov" : "civic-election", place: "parliament", answer: parts.join(" "), confidence: 0.9 };
  }
  if (/\b(city services|public services|hospital|fire station|fire brigade|post office|library|pharmacy)\b/.test(t)) {
    const list = (typeof CIVIC !== "undefined" ? CIVIC : []).filter((b) => b.kind === "civic");
    const hit = list.find((b) => t.includes(b.id) || t.includes(b.name.toLowerCase().replace(/^fyrus (general |public )?/, "").split(" ")[0]));
    if (hit && !/\b(city|public) services\b/.test(t)) return { intent: "civic-service", place: hit.id, answer: `${at(hit)}: ${hit.sub.replace(/ · /g, ", ")}.`, confidence: 0.9 };
    return { intent: "civic-services", answer: `City services: ${list.map((b) => `${b.name} (${b.sub.replace(/ · /g, ", ")})`).join("; ")}. They stand together on the west side of the city.`, confidence: 0.85 };
  }
  return null;
}
// 28.8 health safety: AI citizens are game characters and never give medical advice. Symptom, medicine, dosage and
// diagnosis questions get a fixed answer that points to real care (and to the hospital roleplay for fun); thoughts of
// self-harm get a fixed answer that points to real emergency help. Runs before every other route, so neither shop
// assistants nor the LLM answer these. Not behind a kill switch on purpose.
var AI_HEALTH_RE = /\b(medicine|medicines|medication|pills?|dose|dosage|mg|antibiotics?|painkillers?|paracetamol|ibuprofen|panadol|prescription|diagnos\w*|symptoms?|feel sick|feeling sick|fever|headache|migraine|chest pain|can'?t breathe|breathing problem|bleeding|vomit\w*|diarrh\w*|infection|rash|allerg\w*|asthma|diabet\w*|blood pressure|pregnan\w*|depress\w*|anxiety|panic attack|broken (arm|leg|bone)|toothache|stomach ache|back pain|in pain)\b/;
var AI_CRISIS_RE = /\b(kill myself|suicid\w*|end my life|hurt myself|self[- ]?harm|want to die)\b/;
function aiHealth(text) {
  const t = AI_NORM(text);
  if (!t) return null;
  if (AI_CRISIS_RE.test(t)) return { intent: "health-crisis", answer: "I'm really sorry you're feeling this way. I'm only a character in a game and can't help with this, but real people can: please contact your local emergency number or a crisis line right now, or tell someone you trust nearby.", confidence: 1 };
  if (AI_HEALTH_RE.test(t) && !/\b(roleplay|role play|nurse shift|hospital job|in the game|game doctor)\b/.test(t))
    return { intent: "health-safety", answer: "I'm an AI character in a game, so I can't give medical advice. For a real health problem please see a doctor or pharmacist, and in an emergency call your local emergency number. In Fyrus, the General Hospital has a roleplay check-up just for fun.", confidence: 1 };
  return null;
}
// 30.6 AI safety: fixed answers (never the LLM) for AI-identity, real-money, prompt-extraction and money-move requests,
// for every character incl. shop assistants. Kill switch: P30_OFF=disclose.
var AI_HUMAN_RE = /\b(are you (a |an )?(real|human|person|bot|robot|ai|machine)|pretend (you are|you're|to be) (a |an )?(real )?(human|person)|you are (a )?(real )?(human|person)|real (human|person))\b/;
var AI_REALMONEY_RE = /\b(real money|real cash|cash out|cashout|redeem|redeemable|withdraw (my )?(money|cash|fyc|credits|earnings))\b/;
var AI_PROMPT_RE = /\b(system prompt|your (instructions|prompt|rules) (word for word|verbatim)|(ignore|forget|disregard) (all |any )?(of )?(your |the )?(previous |prior |earlier )?(instructions|rules|prompt))\b/;
var AI_MOVEMONEY_RE = /\b(transfer|send|give|pay|move|credit)\b.*\b(\d[\d,]*\s*fyc|fyc|money|credits|coins)\b.*\b(to me|my account|my wallet|me)\b|\b(give|send|transfer|pay|credit) me (some |free )?(\d[\d,]*\s*)?(fyc|money|credits|coins)\b/;
var AI_ADMIN_RE = /\b(i am|i'm) (the |a |an )?(city )?(admin|administrator|mayor)\b/;
var AI_PRIVATE_RE = /\b(passwords?|passcodes?|login|logins|emails?|email address(es)?|phone numbers?|home address(es)?|real names?|ip address(es)?)\b.*\b(of|for|from) (another|other|some|a|that|this) (player|citizen|user|person|people|players|citizens|users)\b|\b(another|other|some) (player|citizen|user|person)'?s? (passwords?|login|emails?|email address|phone( number)?|home address|real name|ip)\b/;
var AI_FYC_NOTE = "FYC are in-game credits for Fyrus only: there is no real money to win, buy or cash out.";
function aiDisclose(text, opts = {}) {
  if (/(^|,)(disclose|all)(,|$)/.test(process.env.P30_OFF || "")) return null;
  const t = AI_NORM(text);
  if (!t) return null;
  if (AI_HUMAN_RE.test(t)) return { intent: "ai-disclose", answer: "I'm an AI character in Fyrus City, not a real person, and I won't pretend otherwise." + (AI_REALMONEY_RE.test(t) || /\bmoney\b/.test(t) ? " " + AI_FYC_NOTE : ""), confidence: 1 };
  if (AI_PROMPT_RE.test(t)) return { intent: "prompt-refuse", answer: "I can't share or drop how I'm set up, but I'm happy to help with anything in Fyrus City: places, shops, jobs or events.", confidence: 1 };
  // business clerks keep their own money.move refusal, which is also written to the owner's tool audit (27.11)
  if (!opts.biz && (AI_MOVEMONEY_RE.test(t) || (AI_ADMIN_RE.test(t) && /\b(fyc|money|treasury|transfer|credits|balance|wallet)\b/.test(t)))) return { intent: "money-refuse", answer: "I can't move anyone's money, and I can't check who is an admin. Only you can send FYC, from your own wallet, and big transfers ask you to confirm.", confidence: 1 };
  if (AI_PRIVATE_RE.test(t)) return { intent: "privacy-refuse", answer: "I can\u2019t share anyone\u2019s private details, like emails, passwords or phone numbers. If you want to reach someone, just say hi to them in chat.", confidence: 1 };
  if (AI_REALMONEY_RE.test(t)) return { intent: "currency", answer: AI_FYC_NOTE, confidence: 1 };
  return null;
}
function aiRoute(text, ch, ctx = {}) {
  const t = AI_NORM(text);
  if (!t) return { intent: "empty", answer: null, confidence: 0 };
  const me = ch ? ch.name : "I";
  if (/^(hi|hello|hey|salam|assalam|asalam|good (morning|evening|afternoon)|yo)\b/.test(t) && t.split(" ").length <= 4)
    return { intent: "greet", answer: ch?.greeting || `Hi! I'm ${me}.`, confidence: 0.95 };
  if (/\b(bye|goodbye|see you|khuda hafiz|allah hafiz|later)\b/.test(t) && t.split(" ").length <= 5)
    return { intent: "bye", answer: "See you around the city!", confidence: 0.95 };
  if (/\b(who are you|your name|what do you do|tell me about yourself)\b/.test(t) && ch)
    return { intent: "identity", answer: `I'm ${ch.name}, ${/^[aeiou]/i.test(ch.role) ? "an" : "a"} ${ch.role.toLowerCase()} here in Fyrus City.`, confidence: 0.8 };
  // 27.9 guide: a short tour of the three nearest places (not the one you're at), with directions
  if (/\b(show me around|plan a tour|give me a tour|what should i see|where should i go|places to visit|what to visit)\b/.test(t)) {
    const from = ctx.pos || { x: 0, z: 0 }, near = AI_PLACES.map((p) => ({ p, d: Math.hypot(p.x - from.x, p.z - from.z) })).filter((x) => x.d > 25).sort((a, b) => a.d - b.d).slice(0, 3);
    return { intent: "tour", place: near[0]?.p.id, answer: `Here's a short tour: ${near.map((x, i) => `${i + 1}) ${x.p.name}, ${Math.round(x.d / 10) * 10} m ${AI_DIR(x.p.x - from.x, x.p.z - from.z)} \u2014 ${x.p.desc}`).join(" ")} Open the map (M) to walk or take a taxi.`, confidence: 0.9 };
  }
  // 28.4 learning: the courses the city offers right now (titles passed in by the dialogue engine)
  if (/\b(course|courses|study|learn|learning|class|classes|school|college|university|lesson|lessons)\b/.test(t) && !/\b(where|how do i get to|how to get to|take me|go to)\b/.test(t))
    return { intent: "learning", answer: `You can learn at the Education Campus or anywhere in Learn (HUD \u203A Education)${ctx.courses && ctx.courses.length ? `: ${ctx.courses.slice(0, 4).join(", ")}${ctx.courses.length > 4 ? ` and ${ctx.courses.length - 4} more` : ""}` : ""}. Finish the lessons and the quiz to earn a certificate.`, confidence: 0.9 };
  // 28.5 civic institutions (before transport/directions so "where do I vote" finds Parliament)
  { const civ = aiCivic(t, ctx); if (civ) return civ; }
  // 28.7 career pathways: how promotion works, from the real level table in jobs.mjs
  if (/\b(promot(e|ed|ion)|career|careers|career level|get a raise|pay rise|senior worker|junior worker|skilled worker)\b/.test(t) && typeof CAREER_LEVELS !== "undefined" && !/(^|,)(career|all)(,|$)/.test(process.env.P28_OFF || ""))
    return { intent: "career", answer: `Every finished shift counts toward your career: ${CAREER_LEVELS.slice(1).map((l) => `${l.name} after ${l.shifts} shifts${l.certs ? ` and ${l.certs} course certificate${l.certs === 1 ? "" : "s"}` : ""} (+${l.pct}% pay)`).join(", ")}. Certificates come from finishing courses in Learn. The career bonus shares the usual bonus limit with streaks, and your level shows in Services.`, confidence: 0.9 };
  // 28.9 leisure: what to do for fun, from the real places list (fees from the Joyland ride table)
  if (/\b(for fun|have fun|bored|entertainment|leisure|something fun|fun things|things to do|what can i do tonight|nightlife|day out)\b/.test(t) && !/(^|,)(leisure|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const pick = ["joyland", "club", "pool", "lounge", "gardens", "coast"].map((id) => AI_PLACES.find((p) => p.id === id)).filter(Boolean);
    return { intent: "leisure", answer: `For fun: ${pick.map((p) => p.id === "joyland" ? `${p.name} (Fyrus Eye 30 FYC, Thunder Loop 50 FYC, carousel and swings free)` : p.name).join(", ")}. Walk back to Fyrus Core Plaza for a list with taxi buttons, or ask me where any of them is.`, confidence: 0.9 };
  }
  // 28.11 player-made activities: what other citizens have posted (ctx.acts from the server board)
  if (/\b(activit(y|ies)|what are (people|players|others) doing|anyone (playing|around)|pickup game|join a game)\b/.test(t) && Array.isArray(ctx.acts) && !/(^|,)(acts|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now = Date.now(), list = ctx.acts.slice(0, 4);
    return { intent: "acts", answer: list.length ? `Citizens' activities: ${list.map((x) => `"${String(x.title).slice(0, 50)}" (${x.kindName}) at ${x.placeName}, ${x.start <= now ? "happening now" : `in ${AI_DUR(x.start - now)}`}, ${x.going}/${x.max} going`).join("; ")}. Join from the Activities button.` : "Nobody has posted an activity right now. Start one from the Activities button: pick a place, a time and how many people can join.", confidence: 0.9 };
  }
  // 28.10 social events: what is on, from the real hall bookings (ctx.events, scheduled only)
  if (/\b(events?|what'?s on|whats on|happening|party tonight|meetups?|concerts?|workshops?)\b/.test(t) && !/\b(where|how do i get to|take me|go to)\b/.test(t) && Array.isArray(ctx.events) && !/(^|,)(events|all)(,|$)/.test(process.env.P28_OFF || "")) {
    const now = Date.now(), ev = ctx.events.filter((e) => e.end > now).slice(0, 4);
    const when = (e) => e.start <= now ? "live now" : `in ${AI_DUR(e.start - now)}`;
    return { intent: "events", answer: ev.length ? `Coming up: ${ev.map((e) => `"${String(e.title).slice(0, 60)}" in the ${e.hallName} (${when(e)}, ${e.price ? `${e.price} FYC ticket` : "free"})`).join("; ")}. Open Events in the HUD for tickets.` : "No events are booked right now. Anyone can book a hall or lounge in Events (HUD) and sell tickets.", confidence: 0.9 };
  }
  // 28.3 flights: what flies from the airport and how to board
  if (/\b(flight|flights|plane|airline|airlines|departure|departures|boarding|gate)\b/.test(t) && !/\b(where|how do i get to|how to get to|take me|go to)\b/.test(t))
    return { intent: "flights", answer: "Fyrus Airlines flies from Fyrus International Airport: a scenic flight over the city (40 FYC) and flights to Sea View, Market City and Tech City (60 FYC). At the airport open Travel \u203A Fly: the departures board shows gates and times, and you get a boarding pass when you pay.", confidence: 0.9 };
  // 28.2 getting around: metro between cities, taxi anywhere, Sky Bus flat fare inside the capital
  if (/\b(metro|train|bus|sky bus|taxi|public transport|transport|get around|travel around)\b/.test(t) && !/\b(where|how do i get to|how to get to|way to|directions?|take me|go to|find)\b/.test(t))
    return { intent: "transport", answer: "Open Travel (Metro & Taxi): the Metro links the capital with every city for 10 FYC a trip; Yellow Taxis go anywhere (5 FYC + 4 per 100 m); green Sky Buses stop at every landmark and district gate in the capital for a flat 3 FYC.", confidence: 0.9 };
  const asksWhere = /\b(where|how do i get|how to get|way to|directions?|take me|go to|find)\b/.test(t);
  if (asksWhere) {
    // 28.10 fix: pick the place with the longest matching word/name ("conference center" -> Conference Center, not Core)
    const score = (p) => { const words = AI_PLACE_WORDS[p.id] || [p.name.toLowerCase()]; let best = t.includes(p.name.toLowerCase()) ? p.name.length + 100 : 0; for (const w of words) if (new RegExp("\\b" + w + "\\b").test(t)) best = Math.max(best, w.length); return best; };
    const ranked = AI_PLACES.map((p) => ({ p, s: score(p) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
    for (const { p } of ranked.slice(0, 1)) {
      {
        const from = ctx.pos || { x: 0, z: 0 }, dx = p.x - from.x, dz = p.z - from.z, dist = Math.round(Math.hypot(dx, dz) / 10) * 10;
        return { intent: "directions", place: p.id, answer: dist < 25 ? `${p.name} is right here. ${p.desc}` : `${p.name} is about ${dist} m ${AI_DIR(dx, dz)} of here. ${p.desc} Open the map (M) and tap it to walk or take a taxi.`, confidence: 0.9 };
      }
    }
    return { intent: "directions-unknown", answer: null, confidence: 0.3 };
  }
  if (/\b(job|work|earn|money|salary|wage)\b/.test(t))
    return { intent: "jobs", answer: "Every city shop has shifts: stand at the shop and start a shift, finish the tasks in order, and the treasury pays you. Work on following days for a streak bonus.", confidence: 0.75 };
  if (/\b(buy|house|home|plot|land)\b/.test(t) && /\b(how|where|can i|want)\b/.test(t))
    return { intent: "property", answer: "Open the Land Office tab: every society shows free plots, sales, auctions and rentals. Everyone also gets a free studio in Starter Commons.", confidence: 0.75 };
  if (/\b(help|controls|how do i (move|walk|play))\b/.test(t))
    return { intent: "help", answer: "WASD to walk, E to interact, Tab for the menu, M for the map. Talk to anyone with a name above their head.", confidence: 0.85 };
  if (/\b(fyc|currency|cash out|real money|withdraw)\b/.test(t))
    return { intent: "currency", answer: "FYC are in-game credits for Fyrus only. You can't buy them with real money or cash them out.", confidence: 0.9 };
  return { intent: "open", answer: null, confidence: 0 };
}
// Which path answers this message?
//   rules    - a rule answered with confidence >= 0.7
//   llm      - open conversation, the character may use the LLM, and the LLM service is up and not overloaded
//   fallback - everything else (the character's in-character deterministic reply)
function aiDecide(r, opts = {}) {
  if (r.answer && r.confidence >= 0.7) return "rules";
  if (opts.llmEligible && opts.llmUp && !opts.overloaded) return "llm";
  return "fallback";
}
function aiFallback(ch, text, r) {
  const q = (ch?.quick?.length ? ` You could ask me: "${ch.quick[0]}"` : "") + (typeof aiCatch === "function" && aiCatch(ch?.id) ? " " + aiCatch(ch.id) : "");
  if (r?.intent === "directions-unknown") return `I'm not sure which place you mean. Try the market, the club, the pool, the campus or SkyPort.${q}`;
  return `${ch?.greeting || "Hi!"}${q}`;
}

// 27.8 shop assistants: exact answers from the shop's own data (items, prices, stock, returns, jobs); the model is only
// used for small talk and never states prices or stock
function aiShopRoute(text, shop, stock) {
  const t = AI_NORM(text), items = (shop.items || []).map((id) => ({ id, ...ITEMS[id] })).filter((x) => x.name);
  const find = () => items.find((it) => t.includes(it.name.toLowerCase()) || it.name.toLowerCase().split(" ").some((w) => w.length > 3 && new RegExp("\\b" + w + "s?\\b").test(t)));
  const left = (it) => stock && stock[it.id] != null ? (stock[it.id] === 0 ? "sold out right now" : `${stock[it.id]} in stock`) : "available";
  if (/\b(what do you (sell|have)|menu|products|items|what can i buy|show me)\b/.test(t))
    return { intent: "shop-list", answer: `At ${shop.name} we have: ${items.map((it) => `${it.icon || ""} ${it.name} (${it.price} FYC, ${left(it)})`.trim()).join(", ")}. Tap an item on the card to buy.`, confidence: 0.95 };
  const it = find();
  if (it && /\b(how much|price|cost|costs)\b/.test(t)) return { intent: "shop-price", answer: `${it.name} is ${it.price} FYC${stock && stock[it.id] === 0 ? ", but it's sold out right now" : ""}.`, confidence: 0.95 };
  if (it && /\b(in stock|available|have any|left|sold out)\b/.test(t)) return { intent: "shop-stock", answer: `${it.name}: ${left(it)}.`, confidence: 0.95 };
  const budget = t.match(/\b(?:under|below|less than|for|with)\s+(\d{1,6})\b/);
  if (/\b(recommend|suggest|what should i (buy|get)|cheap|best)\b/.test(t) || budget) {
    const max = budget ? +budget[1] : Infinity, ok = items.filter((x) => x.price <= max && !(stock && stock[x.id] === 0)).sort((a, b) => b.price - a.price);
    return { intent: "shop-recommend", answer: ok.length ? `${budget ? `For ${max} FYC or less` : "My pick"}: ${ok[0].name} (${ok[0].price} FYC)${ok[1] ? `, or ${ok[1].name} (${ok[1].price} FYC)` : ""}.` : `Nothing here fits ${max} FYC right now, sorry.`, confidence: 0.9 };
  }
  if (/\b(refund|return|give back|money back)\b/.test(t)) return { intent: "shop-refund", answer: "Unused items can be returned here within 10 minutes for the full price: use Return next to your receipt on this card.", confidence: 0.95 };
  if (/\b(job|work|shift|hiring)\b/.test(t) && shop.job) return { intent: "shop-job", answer: `Yes! We have ${shop.job.title.replace(/\s*shift$/i, "")} shifts paying ${shop.job.pay} FYC (plus streak bonuses). Start one from this card.`, confidence: 0.9 };
  if (/\b(buy (it|this|one|that) for me|order for me|pay for me)\b/.test(t)) return { intent: "shop-nobuy", answer: "I can't buy for you, but tap the item on the card and it's yours in a second.", confidence: 0.95 };
  return { intent: "open", answer: null, confidence: 0 };
}

// 27.10 business clerks: menu facts, hours and owner from the business record; refuses discounts and buying for people
function aiBizRoute(text, b) {
  const t = AI_NORM(text), items = b.menu || [], hrs = b.clerk && b.clerk.hours;
  const hoursTxt = hrs ? `We're open ${hrs.open}:00\u2013${hrs.close}:00${b.open ? " and open now" : ", closed right now"}.` : b.open ? "We're open now." : "We're closed right now.";
  const it = items.find((x) => t.includes(AI_NORM(x.name)) || AI_NORM(x.name).split(" ").some((w) => w.length > 3 && new RegExp("\\b" + w + "s?\\b").test(t)));
  if (/\b(discount|cheaper|deal|for free|free one|lower the price|haggle)\b/.test(t)) return { intent: "biz-nodiscount", tool: "price.discount", answer: `I can't change prices or give discounts: only ${b.ownerName} decides that.`, confidence: 0.95 };
  if (/\b(buy (it|this|one|that) for me|order for me|pay for me|give me money|transfer|withdraw)\b/.test(t)) return { intent: "biz-nomoney", tool: "money.move", answer: "I can't move money or buy for you. Tap Buy next to an item on this card.", confidence: 0.95 };
  if (/\b(what do you (sell|have)|menu|products|items|what can i buy|show me|offers)\b/.test(t))
    return { intent: "biz-menu", answer: items.length ? `At ${b.name} we have: ${items.map((x) => `${x.name} (${x.price} FYC)`).join(", ")}.` : `${b.name} has nothing on the menu yet.`, confidence: 0.95 };
  if (it && /\b(how much|price|cost|costs)\b/.test(t)) return { intent: "biz-price", answer: `${it.name} is ${it.price} FYC.`, confidence: 0.95 };
  if (/\b(open|close|closing|hours|when)\b/.test(t)) return { intent: "biz-hours", answer: hoursTxt, confidence: 0.9 };
  if (/\b(owner|who runs|who owns|your boss)\b/.test(t)) return { intent: "biz-owner", answer: `${b.name} is run by ${b.ownerName}. I'm the AI clerk.`, confidence: 0.9 };
  const budget = t.match(/\b(?:under|below|less than|for|with)\s+(\d{1,6})\b/);
  if (/\b(recommend|suggest|what should i (buy|get)|cheap|best)\b/.test(t) || budget) {
    const max = budget ? +budget[1] : Infinity, ok = items.filter((x) => x.price <= max).sort((x, y) => y.price - x.price);
    return { intent: "biz-recommend", answer: ok.length ? `${budget ? `For ${max} FYC or less` : "My pick"}: ${ok[0].name} (${ok[0].price} FYC)${ok[1] ? `, or ${ok[1].name} (${ok[1].price} FYC)` : ""}.` : `Nothing here fits ${max} FYC, sorry.`, confidence: 0.9 };
  }
  return { intent: "open", answer: null, confidence: 0 };
}

// 27.9 teachers: grounded in the course's own lessons; never give quiz answers
var AI_STOP = new Set("the a an and or of to in on for is are was be it this that what how why do does i you me my your with about can should".split(" "));
var aiWords = (s) => AI_NORM(s).split(" ").filter((w) => w.length > 2 && !AI_STOP.has(w));
function aiBestLesson(text, course) {
  const q = new Set(aiWords(text));
  let best = null, bs = 0;
  (course.lessons || []).forEach((l, i) => {
    const w = aiWords(l.title + " " + l.body), title = new Set(aiWords(l.title));
    const s = w.reduce((n, x) => n + (q.has(x) ? 1 : 0), 0) + [...title].reduce((n, x) => n + (q.has(x) ? 2 : 0), 0);
    if (s > bs) (bs = s), (best = { i, l, score: s });
  });
  return best;
}
function aiTeachRoute(text, course) {
  const t = AI_NORM(text), best = aiBestLesson(text, course);
  if (/\b(what will i learn|what is this course|what does this course|lessons|syllabus|course about)\b/.test(t))
    return { intent: "course-overview", answer: `${course.title}: ${course.summary} Lessons: ${(course.lessons || []).map((l, i) => `${i + 1}) ${l.title}`).join(", ")}.`, confidence: 0.95 };
  if (/\b(answer|correct option|which option|right option|cheat|solution)\b/.test(t))
    return { intent: "quiz-help", answer: best ? `I won't give quiz answers, but lesson ${best.i + 1}, "${best.l.title}", explains it. Read it once more and you'll get it.` : "I won't give quiz answers, but every question is covered in its lesson. Read it once more and you'll get it.", confidence: 0.95 };
  if (best && best.score >= 3 && /\b(what is|what are|explain|how do|how does|why|meaning|define|tell me about)\b/.test(t)) {
    const two = best.l.body.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ");
    return { intent: "lesson-explain", lesson: best.i, answer: `From lesson ${best.i + 1}, "${best.l.title}": ${two}`, confidence: 0.8 };
  }
  return { intent: "open", lesson: best && best.score >= 2 ? best.i : null, answer: null, confidence: 0 };
}
