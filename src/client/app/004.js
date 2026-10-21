var Ew = [
    {
      id: "j-1",
      clientId: "u-owen",
      title: "Multi-agent system for customer support",
      description:
        "AI agents for a Shopify store: order tracking, returns and escalation. LangGraph or similar. Evals required.",
      budget: 2500,
      type: "fixed",
      skills: ["LangGraph", "RAG", "Evals"],
      status: "open",
      createdAt: ia(20),
      proposals: [
        {
          id: "p-1",
          freelancerId: "u-nova",
          bid: 2300,
          days: 14,
          cover: "I have shipped 12 support agents. Eval-first approach with an MVP in week one.",
          status: "pending",
          at: ia(18),
        },
      ],
    },
    {
      id: "j-2",
      clientId: "u-owen",
      title: "AI-generated teaser video for a product launch",
      description: "A 30\u201345 second futuristic teaser with brand colors and a logo reveal. AI music too.",
      budget: 800,
      type: "fixed",
      skills: ["Video diffusion", "Motion"],
      status: "open",
      createdAt: ia(9),
      proposals: [
        {
          id: "p-2",
          freelancerId: "u-kai",
          bid: 750,
          days: 6,
          cover: "Check my reel on the cinema screen in my home. I will send two style frames first.",
          status: "pending",
          at: ia(7),
        },
      ],
    },
    {
      id: "j-3",
      clientId: "u-zara",
      title: "Fine-tune Whisper for accented call-center speech",
      description: "Fine-tune Whisper on 50 hours of call audio and deliver a WER report.",
      budget: 45,
      type: "hourly",
      skills: ["Whisper", "Fine-tuning", "Speech"],
      status: "open",
      createdAt: ia(4),
      proposals: [],
    },
  ],
  hp = [
    {
      id: "v-1",
      ownerId: "u-kai",
      title: "Neon Monsoon \u2014 a full AI short film",
      duration: "3:42",
      views: 48200,
      hue: 215,
      createdAt: ia(30),
    },
    {
      id: "v-2",
      ownerId: "u-nova",
      title: "Build a RAG agent in 10 minutes",
      duration: "10:05",
      views: 31900,
      hue: 205,
      createdAt: ia(60),
    },
    {
      id: "v-3",
      ownerId: "u-leo",
      title: "Live demo: a voice receptionist that books calls",
      duration: "4:18",
      views: 12700,
      hue: 25,
      createdAt: ia(12),
    },
    {
      id: "v-4",
      ownerId: "u-amara",
      title: "Vision agent shelf audit \u2014 before and after",
      duration: "2:11",
      views: 8800,
      hue: 165,
      createdAt: ia(50),
    },
  ],
  up = [
    {
      id: "r-1",
      ownerId: "u-zara",
      kind: "article",
      title: "Evals first, prompts second: a practical guide",
      excerpt: "Every LLM feature should start with a small eval set. Here is a five-step process.",
      body: `Step 1: Collect 30 real user inputs.
Step 2: Write down what a great answer looks like for each.
Step 3: Build a grader with a clear rubric.
Step 4: Run your baseline prompt and record the score.
Step 5: Re-run after every change. If the score drops, roll it back.`,
      readMins: 6,
      createdAt: ia(26),
    },
    {
      id: "r-2",
      ownerId: "u-nova",
      kind: "article",
      title: "When you need multi-agent systems (and when you don't)",
      excerpt: "Often one good agent with tools is enough. These are the signals that say otherwise.",
      body: `Signal 1: Parts of the task need very different context.
Signal 2: Parallel work cuts latency.
Signal 3: Parts need different permissions.
Otherwise keep one agent. It is far easier to debug.`,
      readMins: 8,
      createdAt: ia(70),
    },
    {
      id: "r-3",
      ownerId: "u-owen",
      kind: "question",
      title: "Pricing an AI agent: subscription or per task?",
      excerpt: "We sell a research agent. Which model works better?",
      body: "Our users run between 20 and 200 tasks a month. How should we price it?",
      readMins: 1,
      createdAt: ia(5),
      answers: [
        {
          userId: "u-nova",
          text: "In my experience: a base subscription plus usage credits. Sell credit packs to heavy users.",
          at: ia(4),
        },
      ],
    },
    {
      id: "r-4",
      ownerId: "u-amara",
      kind: "portfolio",
      title: "Case study: MedScan OCR at 98.4% field accuracy",
      excerpt: "A vision pipeline for hospital intake forms, with screenshots and results.",
      body: `Problem: 40k handwritten forms a month.
Solution: VLM + layout detection + a human review queue.
Result: 98.4% field accuracy and 6x faster processing.`,
      readMins: 4,
      createdAt: ia(100),
    },
  ],
  Lw = [
    "Anyone have a good RAG eval set?",
    "Just tried ResearchPilot, it is amazing",
    "When does the stage show start?",
    "Come see my new agent demo",
    "Hiring: voice AI engineer",
    "ShelfSight made our audits 6x faster",
    "New short film on Kai's cinema screen \u{1F525}",
    "Any LangGraph experts online?",
    "Made $120 from affiliate links today",
    "Who wants to race on hoverboards?",
    "Found 30 orbs in Neon Harbor!",
    "Just hit level 10 \u{1F389}",
    "My new dome home is live, come visit",
    "Daily quest done, streak at 12 days",
    "This sunset never gets old",
    "Free plot near Prompt Heights, go grab it",
  ],
  V2 = [
    "Ryan",
    "Mia",
    "Theo",
    "Sophie",
    "Ethan",
    "Lily",
    "Noah",
    "Emma",
    "Jack",
    "Chloe",
    "Liam",
    "Grace",
    "Lucas",
    "Ava",
    "Henry",
    "Ruby",
  ];
var ov = [
    { id: "sofa", name: "Sofa", cat: "Living", w: 2.4, d: 0.95, color: "#8a9bb0" },
    { id: "lsofa", name: "Corner sofa", cat: "Living", w: 2.8, d: 2.2, color: "#c8bfae" },
    { id: "armchair", name: "Armchair", cat: "Living", w: 0.95, d: 0.95, color: "#b36b4a" },
    { id: "coffee", name: "Coffee table", cat: "Living", w: 1.2, d: 0.7, color: "#7a5a3c" },
    { id: "tv", name: "TV + stand", cat: "Living", w: 2, d: 0.5, color: "#2b2b2b" },
    { id: "rug", name: "Rug", cat: "Living", w: 3, d: 2, color: "#a34a3c" },
    { id: "rugr", name: "Round rug", cat: "Living", w: 2.2, d: 2.2, color: "#3f6f8f" },
    { id: "fireplace", name: "Fireplace", cat: "Living", w: 1.8, d: 0.5, color: "#d8d2c6", wall: !0 },
    { id: "bed2", name: "Double bed", cat: "Bedroom", w: 1.8, d: 2.2, color: "#e9e4da" },
    { id: "bed1", name: "Single bed", cat: "Bedroom", w: 1.1, d: 2.1, color: "#c9d6e3" },
    { id: "wardrobe", name: "Wardrobe", cat: "Bedroom", w: 1.6, d: 0.6, color: "#efe9df", wall: !0 },
    { id: "nightstand", name: "Bedside table", cat: "Bedroom", w: 0.5, d: 0.45, color: "#7a5a3c" },
    { id: "mirror", name: "Mirror", cat: "Bedroom", w: 0.8, d: 0.1, color: "#d4a64a", wall: !0 },
    { id: "dining", name: "Dining table", cat: "Kitchen", w: 1.8, d: 1, color: "#9a7450" },
    { id: "chair", name: "Chair", cat: "Kitchen", w: 0.5, d: 0.5, color: "#2b2e33" },
    { id: "counter", name: "Kitchen counter", cat: "Kitchen", w: 2.4, d: 0.65, color: "#f2f2ee", wall: !0 },
    { id: "fridge", name: "Fridge", cat: "Kitchen", w: 0.8, d: 0.7, color: "#dfe3e8", wall: !0 },
    { id: "desk", name: "Desk + laptop", cat: "Work", w: 1.4, d: 0.7, color: "#efe9df" },
    { id: "office", name: "Office chair", cat: "Work", w: 0.6, d: 0.6, color: "#1b1d22" },
    { id: "shelf", name: "Bookshelf", cat: "Work", w: 1.2, d: 0.35, color: "#7a5a3c", wall: !0 },
    { id: "plant", name: "Big plant", cat: "Decor", w: 0.7, d: 0.7, color: "#4f7f35" },
    { id: "plants", name: "Small plant", cat: "Decor", w: 0.4, d: 0.4, color: "#5f8f45" },
    { id: "lamp", name: "Floor lamp", cat: "Decor", w: 0.4, d: 0.4, color: "#f2e6c9" },
    { id: "art", name: "Painting", cat: "Decor", w: 1.4, d: 0.06, color: "#ff9a3c", wall: !0 },
    { id: "aquarium", name: "Aquarium", cat: "Decor", w: 1.6, d: 0.6, color: "#6fb7d9" },
    { id: "vase", name: "Flower vase", cat: "Decor", w: 0.35, d: 0.35, color: "#e05a8a" },
    { id: "piano", name: "Piano", cat: "Fun", w: 1.5, d: 0.6, color: "#111111", wall: !0 },
    { id: "arcade", name: "Arcade cabinet", cat: "Fun", w: 0.8, d: 0.8, color: "#4da3ff" },
    { id: "beanbag", name: "Bean bag", cat: "Fun", w: 0.9, d: 0.9, color: "#ffc27a" },
    { id: "prayer", name: "Prayer mat", cat: "Decor", w: 0.7, d: 1.2, color: "#2f6a4f" },
  ],
  $i = Object.fromEntries(ov.map((t) => [t.id, t])),
  wh = [
    { id: "oak", name: "Oak wood", color: "#a7835e" },
    { id: "walnut", name: "Walnut", color: "#6b4a32" },
    { id: "tile", name: "White tile", color: "#e9e6e0" },
    { id: "marble", name: "Marble", color: "#f1eee9" },
    { id: "carpet", name: "Carpet", color: "#8a8f99" },
    { id: "concrete", name: "Concrete", color: "#b5b1aa" },
  ],
  nv = [
    "#f1ede6",
    "#ffffff",
    "#e8dcc8",
    "#dfe6ee",
    "#d8e3d0",
    "#f3d9cf",
    "#c9d3dc",
    "#e6d3a8",
    "#b8c4b0",
    "#2f3b4a",
    "#4a3a33",
    "#ffd9b0",
  ],
  pp = [
    "#ffffff",
    "#efe9df",
    "#e8dcc8",
    "#d8cfbf",
    "#f3e0c9",
    "#e3c7a5",
    "#c96f4a",
    "#b55a4c",
    "#dfe6ee",
    "#a9b8c8",
    "#9fb08f",
    "#6b7a8a",
    "#3d4650",
    "#f2d16b",
  ],
  Sw = ["#5a3f35", "#6b4a3a", "#8b3a2e", "#3a3d42", "#2b2e33", "#4f5d6b", "#2f5d50", "#f2f2ee", "#b55a3c"],
  Hw = ["#ffffff", "#2b2e33", "#5a3f35", "#3a5a7a", "#8b3a2e", "#2f5d50", "#d4a64a"],
  Nw = [
    { id: "none", name: "No fence" },
    { id: "hedge", name: "Hedge" },
    { id: "picket", name: "White picket" },
    { id: "iron", name: "Black iron" },
    { id: "wall", name: "Low wall" },
  ],
  Rw = [
    { id: "lawn", name: "Lawn" },
    { id: "flowers", name: "Flower beds" },
    { id: "stone", name: "Stone patio" },
    { id: "trees", name: "Fruit trees" },
  ],
  gp = [
    { id: "private", name: "Private", sub: "Only you. Visitors can knock." },
    { id: "keys", name: "Friends with keys", sub: "You and the people you give a key to." },
    { id: "open", name: "Open house", sub: "Anyone can walk in." },
  ],
  JS = 120,
  GA = 2 * 36e5,
  Oc = (t) =>
    /^(EX|MB|RS)-\d{4}$/.test(t)
      ? "house"
      : t.startsWith("studio:")
        ? "studio"
        : t.startsWith("home:")
          ? "home"
          : "",
  iv = (t) =>
    Oc(t) === "studio"
      ? { w: 11, d: 10, h: 3.2 }
      : Oc(t) === "home"
        ? { w: 16, d: 14, h: 3.6 }
        : { w: 18, d: 15, h: 3.6 },
  Bw = /^#[0-9a-f]{6}$/i,
  Cw = (t, e) => (typeof t == "string" && Bw.test(t) ? t.toLowerCase() : e),
  QS = (t, e, a) => (e.some((r) => r.id === t) ? String(t) : a),
  Tw = (t, e) => {
    let a = Math.round((+t || 0) * 100) / 100;
    return Math.max(-e, Math.min(e, a));
  },
  sv = { wall: "#ffffff", roof: "#5a3f35", trim: "#ffffff", fence: "hedge", garden: "lawn" };
function Aw(t, e) {
  t = t || {};
  let a = iv(e),
    r = a.w / 2 - 0.2,
    o = a.d / 2 - 0.2,
    n = (Array.isArray(t.items) ? t.items : [])
      .slice(0, JS)
      .filter((i) => i && $i[i.k])
      .map((i) => ({
        k: String(i.k),
        x: Tw(i.x, r),
        z: Tw(i.z, o),
        r: Math.round((((+i.r || 0) % 360) + 360) % 360),
        ...(i.c && Bw.test(i.c) ? { c: String(i.c).toLowerCase() } : {}),
      }));
  return {
    wall: Cw(t.wall, "#f1ede6"),
    floor: QS(t.floor, wh, "oak"),
    accent: Cw(t.accent, "#c9d3dc"),
    items: n,
  };
}
var tH = (t, e) => 8 + t * e + Math.floor((t - 1) / 2) * 10 + 8,
  Gr = [
    {
      id: "executive",
      code: "EX",
      tier: 2,
      name: "Executive Enclave",
      tagline: "Townhouses and villas for merchants, teachers and professionals",
      color: "#4da3ff",
      x0: -210,
      z0: 345,
      cols: 35,
      rows: 20,
      sp: 12,
      count: 700,
      empty: 140,
      base: 25e3,
      passport: !1,
      gate: { x: 0, z: 333, face: { x: 0, z: 400 } },
    },
    {
      id: "marina",
      code: "MB",
      tier: 3,
      name: "Marina Bay Society",
      tagline: "Gated oceanfront mansions with private yacht docks",
      color: "#45e0ae",
      x0: 470,
      z0: -366,
      cols: 50,
      rows: 10,
      sp: 12,
      count: 500,
      empty: 100,
      base: 8e4,
      passport: !1,
      gate: { x: 458, z: -300, face: { x: 520, z: -300 } },
    },
    {
      id: "royal",
      code: "RS",
      tier: 4,
      name: "Royal Sky Society",
      tagline:
        "Ultra-exclusive hillside mansions with AI security \u2014 passport holders and invited guests only",
      color: "#ffc27a",
      x0: -1010,
      z0: -150,
      cols: 25,
      rows: 17,
      sp: 16,
      count: 410,
      empty: 120,
      base: 25e4,
      passport: !0,
      gate: { x: -584, z: 0, face: { x: -650, z: 0 } },
    },
  ],
  Jt = {
    id: "starter",
    code: "SC",
    tier: 1,
    name: "Starter Commons",
    tagline: "Clean modern studio apartments \u2014 free for every visitor",
    color: "#a8d8ff",
    x: 330,
    z: 260,
    towers: 6,
    floors: 24,
    perFloor: 8,
  },
  As = (t) => ({ x0: t.x0, z0: t.z0, x1: t.x0 + t.cols * t.sp + 16, z1: t.z0 + tH(t.rows, t.sp) }),
  Rl = { x0: Jt.x - 50, z0: Jt.z - 60, x1: Jt.x + 50, z1: Jt.z + 60 },
  eH = [...Gr.map(As), Rl].map((t) => ({ x0: t.x0 - 10, z0: t.z0 - 10, x1: t.x1 + 10, z1: t.z1 + 10 })),
  Bl = (t, e) => eH.some((a) => t > a.x0 && t < a.x1 && e > a.z0 && e < a.z1),
  Ww = (t, e) =>
    Gr.find((a) => {
      let r = As(a);
      return t >= r.x0 && t <= r.x1 && e >= r.z0 && e <= r.z1;
    }),
  lv = (t) => {
    let e = 2166136261;
    for (let a = 0; a < t.length; a++) ((e ^= t.charCodeAt(a)), (e = Math.imul(e, 16777619)));
    return e >>> 0;
  },
  zw = [
    "Ayesha",
    "Omar",
    "Lina",
    "Noah",
    "Sara",
    "Bilal",
    "Mei",
    "Arjun",
    "Zara",
    "Leo",
    "Hana",
    "Yusuf",
    "Ivy",
    "Kenji",
    "Amara",
    "Diego",
    "Nora",
    "Samir",
    "Elena",
    "Tariq",
    "Maya",
    "Ravi",
    "Chloe",
    "Imran",
    "Sofia",
    "Daniyal",
    "Aiko",
    "Hamza",
    "Lucia",
    "Farah",
  ],
  jw = [
    "Khan",
    "Malik",
    "Chen",
    "Silva",
    "Haddad",
    "Patel",
    "Rossi",
    "Kim",
    "Okafor",
    "Novak",
    "Rahman",
    "Tanaka",
    "Garcia",
    "Iqbal",
    "Larsen",
    "Mensah",
    "Costa",
    "Sato",
    "Qureshi",
    "Moreau",
  ],
  cv = {};
function Al(t) {
  if (cv[t.id]) return cv[t.id];
  let e = Array.from({ length: t.count }, (o, n) => `${t.code}-${String(n + 1).padStart(4, "0")}`),
    a = new Set([...e].sort((o, n) => lv(o + "e") - lv(n + "e")).slice(0, t.empty)),
    r = e.map((o, n) => {
      let i = n % t.cols,
        s = Math.floor(n / t.cols),
        l = lv(o),
        c = t.x0 + 8 + t.sp / 2 + i * t.sp,
        d = t.z0 + 8 + t.sp / 2 + s * t.sp + Math.floor(s / 2) * 10,
        h = t.id === "marina" && s <= 1,
        u = Math.round((t.base * (h ? 1.6 : 1) * (0.9 + (l % 200) / 1e3)) / 100) * 100,
        p = a.has(o);
      return {
        id: o,
        soc: t.id,
        n: n + 1,
        x: c,
        z: d,
        face: s % 2 === 0 ? -1 : 1,
        size: t.sp - 2,
        price: u,
        seaFront: h,
        empty: p,
        resident: p ? void 0 : `${zw[l % zw.length]} ${jw[(l >>> 8) % jw.length]}`,
        style: (l >>> 16) % 3,
      };
    });
  return (cv[t.id] = r);
}
var _i = (t) => {
    let e = Gr.find((a) => t.startsWith(a.code + "-"));
    return e ? Al(e)[+t.slice(3) - 1] : void 0;
  },
  Mh = (t) => Gr.find((e) => e.id === t);
function Iw(t, e) {
  let a = Ww(t, e);
  if (!a) return;
  let r = Math.round((t - a.x0 - 8 - a.sp / 2) / a.sp);
  if (r < 0 || r >= a.cols) return;
  let o,
    n = 1e9;
  for (let i = 0; i < a.rows; i++) {
    let s = i * a.cols + r;
    if (s >= a.count) break;
    let l = Al(a)[s],
      c = Math.abs(l.z - e);
    c < n && ((n = c), (o = l));
  }
  return o && Math.hypot(o.x - t, o.z - e) < a.sp * 0.9 ? o : void 0;
}
var Gw = Gr.reduce((t, e) => t + e.count - e.empty, 0),
  dv = Gr.reduce((t, e) => t + e.empty, 0),
  Vw = Jt.towers * Jt.floors * Jt.perFloor;
function Pw(t, e) {
  let a = Ww(t, e);
  if (!a) return !1;
  if (Math.hypot(t - a.gate.x, e - a.gate.z) < 12) return !0;
  let r = As(a);
  if (t < r.x0 + 2 || t > r.x1 - 2) return !1;
  if (Math.abs(e - (r.z0 + 4)) < 3.5) return !0;
  let o = Al(a);
  for (let n = 2; n <= a.rows; n += 2) {
    let i = o[Math.min(o.length - 1, (n - 1) * a.cols)].z + a.sp / 2 + 5;
    if (Math.abs(e - i) < 9 / 2) return !0;
  }
  return !1;
}
function Qo(t) {
  let e = t >>> 0;
  return () => {
    ((e |= 0), (e = (e + 1831565813) | 0));
    let a = Math.imul(e ^ (e >>> 15), 1 | e);
    return ((a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) ^ a), ((a ^ (a >>> 14)) >>> 0) / 4294967296);
  };
}
function Jo(t, e, a = 0) {
  let r = (t * 374761393 + e * 668265263 + a * 2147483647) | 0;
  return ((r = (r ^ (r >>> 13)) * 1274126177), (r ^ (r >>> 16)) >>> 0);
}
var vo = (t, e) => e[Math.floor(t() * e.length)],
  sa = 64,
  hv = 175,
  Dc = [
    "Olivia",
    "James",
    "Ava",
    "William",
    "Sophia",
    "Benjamin",
    "Isabella",
    "Lucas",
    "Mia",
    "Henry",
    "Charlotte",
    "Alexander",
    "Amelia",
    "Daniel",
    "Harper",
    "Matthew",
    "Evelyn",
    "Jack",
    "Abigail",
    "Samuel",
    "Emily",
    "Owen",
    "Ella",
    "Leo",
    "Scarlett",
    "Ethan",
    "Grace",
    "Noah",
    "Chloe",
    "Ryan",
    "Lily",
    "Nathan",
    "Zoe",
    "Adam",
    "Hannah",
    "Caleb",
    "Aria",
    "Dylan",
    "Nora",
    "Isaac",
    "Ruby",
    "Max",
    "Stella",
    "Oscar",
    "Violet",
    "Felix",
    "Hazel",
    "Miles",
    "Ivy",
    "Jasper",
  ],
  Fc = [
    "Smith",
    "Carter",
    "Hughes",
    "Walker",
    "Bennett",
    "Foster",
    "Hayes",
    "Parker",
    "Morgan",
    "Brooks",
    "Reed",
    "Collins",
    "Ward",
    "Turner",
    "Price",
    "Cooper",
    "Ellis",
    "Grant",
    "Lane",
    "Fisher",
    "Stone",
    "Shaw",
    "Porter",
    "Blake",
    "Quinn",
    "Wells",
    "Hart",
    "Fox",
    "Knight",
    "Sterling",
    "Rhodes",
    "Mercer",
    "Holt",
    "Vaughn",
    "Pierce",
  ],
  aH = [
    "Agent Builder",
    "Prompt Engineer",
    "AI Artist",
    "ML Engineer",
    "AI Film Maker",
    "Automation Expert",
    "Voice AI Dev",
    "Data Scientist",
    "AI Product Lead",
    "LLM Researcher",
    "AI Music Producer",
    "Vision Engineer",
    "AI Educator",
    "Chatbot Designer",
    "AI Affiliate Pro",
  ],
  Ow = [
    "#4da3ff",
    "#2f6fe0",
    "#ff9a3c",
    "#7fd1ff",
    "#ffc27a",
    "#45e0ae",
    "#a8d8ff",
    "#ff7a59",
    "#8f9dff",
    "#5fe3ff",
  ],
  rH = ["tower", "dome", "pyramid", "stack", "villa", "spire"],
  oH = [
    "Neon",
    "Prompt",
    "Quantum",
    "Silicon",
    "Aurora",
    "Vector",
    "Neural",
    "Cobalt",
    "Ember",
    "Echo",
    "Pixel",
    "Orbit",
    "Nova",
    "Cipher",
    "Signal",
    "Lumen",
    "Tensor",
    "Halo",
    "Azure",
    "Solar",
  ],
  nH = [
    "Heights",
    "Harbor",
    "Gardens",
    "Avenue",
    "Quarter",
    "Bay",
    "Commons",
    "Village",
    "Park",
    "Row",
    "Square",
    "Terrace",
    "Hills",
    "Docks",
    "Grove",
    "Plaza",
  ];
function Uc(t, e) {
  let a = Math.floor(Math.floor(t / sa + 0.5) / 3 + 0.5),
    r = Math.floor(Math.floor(e / sa + 0.5) / 3 + 0.5);
  if (a === 0 && r === 0) return { key: "0,0", name: "Fyrus Core \xB7 Capital" };
  let o = Qo(Jo(a, r, 7));
  return { key: `${a},${r}`, name: `${vo(o, oH)} ${vo(o, nH)}` };
}
function $c(t, e, a) {
  let r = Qo(Jo(t, e, 100 + a)),
    o = vo(r, Dc),
    n = vo(r, Fc),
    i = vo(r, Ow),
    s = vo(r, Ow);
  return (
    s === i && (s = "#ff9a3c"),
    {
      id: `r-${t}_${e}_${a}`,
      name: `${o} ${n}`,
      handle: (o + n).toLowerCase(),
      title: vo(r, aH),
      bio: `Resident of ${Uc(t * sa, e * sa).name}. Building with AI every day.`,
      color: i,
      skills: [vo(r, ["Agents", "Prompts", "Video", "Voice", "Vision", "Music"])],
      followers: Math.floor(r() * 9e3),
      rating: Math.round((4.3 + r() * 0.7) * 10) / 10,
      home: {
        x: 0,
        z: 0,
        theme: i,
        accent: s,
        floor: vo(r, ["glass", "grid", "marble"]),
        style: vo(r, rH),
        floors: 2 + Math.floor(r() * 7),
        garden: Math.floor(r() * 5),
      },
      avatar: {
        acc: vo(r, ["none", "halo", "crown", "antenna", "visor-x", "orbit"]),
        trail: "none",
        board: "classic",
      },
      procedural: !0,
    }
  );
}
function Dw(t, e, a) {
  let r = Qo(Jo(t, e, 1)),
    o = t * sa,
    n = e * sa,
    i = { cx: t, cz: e, homes: [], plots: [], orbs: [], trees: [], lamps: [], billboards: [] },
    s = Math.abs(t) <= 1 && Math.abs(e) <= 1,
    l = a.map((u) => ({ x: u.x, z: u.z, r: u.r ?? 12 }));
  s && l.push({ x: 0, z: 0, r: 30 });
  let c = (u, p, v) =>
    p > -358 + v &&
    !Bl(u, p) &&
    l.every((g) => Math.hypot(g.x - u, g.z - p) > g.r + v) &&
    Math.abs(Math.hypot(u, p) - hv) > v + 3;
  [
    [-16, -16],
    [16, -16],
    [-16, 16],
    [16, 16],
  ].forEach(([u, p], v) => {
    let g = o + u + (r() - 0.5) * 6,
      m = n + p + (r() - 0.5) * 6;
    if (!c(g, m, 8)) return;
    let f = r();
    if (f < (s ? 0.35 : 0.62)) {
      let y = $c(t, e, v);
      ((y.home.x = Math.round(g)), (y.home.z = Math.round(m)), i.homes.push(y));
    } else f < 0.86 && i.plots.push({ id: `plot-${t}_${e}_${v}`, x: Math.round(g), z: Math.round(m) });
    l.push({ x: g, z: m, r: 9 });
  });
  for (let u = 0; u < 7; u++) {
    let p = o + (r() - 0.5) * (sa - 6),
      v = n + (r() - 0.5) * (sa - 6);
    c(p, v, 2) && i.orbs.push({ id: `orb-${t}_${e}_${u}`, x: p, z: v, y: 1.2 + r() * 1.6 });
  }
  for (let u = 0; u < 6; u++) {
    let p = o + (r() - 0.5) * (sa - 10),
      v = n + (r() - 0.5) * (sa - 10);
    c(p, v, 3) &&
      (i.trees.push({
        x: p,
        z: v,
        s: 0.7 + r() * 0.8,
        c: vo(r, ["#4da3ff", "#45e0ae", "#7fd1ff", "#ffc27a"]),
      }),
      l.push({ x: p, z: v, r: 2 }));
  }
  for (let u of [-16, 0, 16]) {
    let p = { x: o - sa / 2 + 5.5, z: n + u },
      v = { x: o + u, z: n - sa / 2 + 5.5 };
    (c(p.x, p.z, 1) && i.lamps.push(p), c(v.x, v.z, 1) && i.lamps.push(v));
  }
  let h = {
    x: o + (r() < 0.5 ? -1 : 1) * 3,
    z: n + (r() - 0.5) * 20,
    ry: r() < 0.5 ? 0 : Math.PI / 2,
    seed: Jo(t, e, 9),
  };
  return (r() < 0.55 && !s && c(h.x, h.z, 6) && i.billboards.push(h), i);
}
var iH = [
    "I made a music video entirely with AI",
    "Walking through {d} at sunset",
    "Agent vs agent: who wins the coding race?",
    "My 4D home tour (level {n} unlocked)",
    "Text-to-3D in 60 seconds",
    "Training a tiny model on my laptop",
    "AI-generated anime opening",
    "Hoverboard speedrun across 9 districts",
    "Turning sketches into product renders",
    "A day in the life of an AI freelancer",
  ],
  sH = [
    "{n} prompt patterns I use every day",
    "How I made my first $1,000 selling agents",
    "Why small models are winning in production",
    "A beginner's map of the AI tool stack",
    "The ethics checklist I run before every launch",
    "How to price an AI gig without underselling",
    "What I learned building {n} chatbots",
    "Designing agents that know when to ask for help",
  ],
  lH = [
    "Best way to evaluate a RAG system?",
    "Which voice model sounds most natural right now?",
    "How do you get your first client on Fyrus?",
    "Is fine-tuning worth it for a small startup?",
    "What is the best home style for showing videos?",
  ],
  cH = [
    "reached level {n} \u{1F389}",
    "built a new {s} home in {d}",
    "collected {n} orbs today",
    "sold their first AI agent",
    "started a {n}-day streak \u{1F525}",
    "claimed a free plot in {d}",
    "hosted a live show with {n} viewers",
  ];
function Fw(t) {
  let e = Qo(Jo(t, 77, 3)),
    a = $c(Math.floor(e() * 40) - 20, Math.floor(e() * 40) - 20, Math.floor(e() * 4)),
    r = Uc((e() - 0.5) * 2e3, (e() - 0.5) * 2e3).name,
    o = 3 + Math.floor(e() * 40),
    n = (c) => c.replace("{d}", r).replace("{n}", String(o)).replace("{s}", a.home.style),
    i = e(),
    s = Date.now() - (t * 37 + Math.floor(e() * 30)) * 6e4,
    l = {
      id: `feed-${t}`,
      owner: { ...a, title: "AI resident" + (a.title ? " \xB7 " + a.title : "") },
      hue: Math.floor(200 + e() * 40 + (e() < 0.3 ? -175 : 0)),
      at: s,
      views: 0,
      likes: 0,
    };
  return i < 0.35
    ? { ...l, kind: "video", title: n(vo(e, iH)), body: "" }
    : i < 0.6
      ? {
          ...l,
          kind: "article",
          title: n(vo(e, sH)),
          body: "A short write-up with practical steps, screenshots and the prompts I used. Save it for later and tell me what worked for you.",
        }
      : i < 0.75
        ? {
            ...l,
            kind: "question",
            title: n(vo(e, lH)),
            body: "Curious what the community thinks. Drop your experience below.",
          }
        : { ...l, kind: "event", title: n(vo(e, cH)), body: "" };
}
var Xr = [
    {
      id: "city-hatch",
      name: "Mira City",
      maker: "Fyrus Motors",
      price: 0,
      body: "hatch",
      color: "#e8e8e8",
      top: 26,
      accel: 9,
      desc: "Your free starter car. Small, easy to park.",
    },
    {
      id: "sedan-s",
      name: "Aster S",
      maker: "Aster",
      price: 18e3,
      body: "sedan",
      color: "#1f3a5f",
      top: 32,
      accel: 11,
      desc: "Comfortable family sedan with a quiet electric motor.",
    },
    {
      id: "suv-x",
      name: "Terra X7",
      maker: "Terra",
      price: 42e3,
      body: "suv",
      color: "#2b2b2b",
      top: 30,
      accel: 10,
      desc: "Big, safe and smart. Seats seven.",
    },
    {
      id: "pickup",
      name: "Ridge EV Truck",
      maker: "Ridge",
      price: 38e3,
      body: "pickup",
      color: "#8a1c1c",
      top: 30,
      accel: 10,
      desc: "Electric pickup for work and weekends.",
    },
    {
      id: "sports-gt",
      name: "Vento GT",
      maker: "Vento",
      price: 95e3,
      body: "sports",
      color: "#c0392b",
      top: 44,
      accel: 16,
      desc: "Low, fast and loud (the speakers, not the motor).",
    },
    {
      id: "super-r",
      name: "Falcon R1",
      maker: "Falcon",
      price: 28e4,
      body: "super",
      color: "#f1c40f",
      top: 55,
      accel: 21,
      desc: "Hypercar. 0 to 100 in 2 seconds.",
    },
    {
      id: "fly-one",
      name: "SkyCab One",
      maker: "Fyrus Motors",
      price: 15e4,
      body: "sedan",
      color: "#f2f2ee",
      top: 40,
      accel: 13,
      fly: !0,
      desc: "Drives on the road and flies over the city.",
    },
    {
      id: "fly-lux",
      name: "Aero Royale",
      maker: "Falcon",
      price: 45e4,
      body: "super",
      color: "#1c1c1c",
      top: 60,
      accel: 22,
      fly: !0,
      desc: "Luxury flying supercar.",
    },
  ],
  Qn = [
    {
      id: "studio",
      name: "City Studio",
      price: 0,
      style: "tower",
      floors: 3,
      garden: 1,
      theme: "#a8d8ff",
      desc: "Your starter flat.",
    },
    {
      id: "villa",
      name: "Garden Villa",
      price: 12e4,
      style: "villa",
      floors: 2,
      garden: 4,
      theme: "#e9d8b8",
      desc: "Two floors, big garden, quiet street.",
    },
    {
      id: "dome",
      name: "Glass Dome House",
      price: 21e4,
      style: "dome",
      floors: 2,
      garden: 3,
      theme: "#cfe3d6",
      desc: "Panoramic glass dome with a roof garden.",
    },
    {
      id: "penthouse",
      name: "Sky Penthouse",
      price: 48e4,
      style: "spire",
      floors: 9,
      garden: 2,
      theme: "#d6e2ef",
      desc: "Top-floor penthouse with a city view.",
    },
    {
      id: "mansion",
      name: "Marina Mansion",
      price: 9e5,
      style: "stack",
      floors: 5,
      garden: 5,
      theme: "#f0dcc6",
      desc: "Five floors, pool deck, cinema room.",
    },
    {
      id: "pyramid",
      name: "Desert Pyramid",
      price: 65e4,
      style: "pyramid",
      floors: 4,
      garden: 3,
      theme: "#f3e3a6",
      desc: "A modern pyramid with a courtyard.",
    },
  ],
  fp = [
    {
      id: "yacht",
      name: "Marina Yacht",
      price: 75e4,
      icon: "\u{1F6E5}\uFE0F",
      desc: "Docked at Marina Skyline. Throw parties on deck.",
    },
    {
      id: "jet",
      name: "Private Jet Pass",
      price: 3e5,
      icon: "\u2708\uFE0F",
      desc: "Free rocket and flying-car rides for life.",
    },
    { id: "watch", name: "Gold Watch", price: 25e3, icon: "\u231A", desc: "A classic, for your avatar." },
    { id: "pet", name: "Robot Dog", price: 4e3, icon: "\u{1F415}", desc: "Follows you around the city." },
    {
      id: "vip",
      name: "Skyline Club VIP",
      price: 15e3,
      icon: "\u{1F39F}\uFE0F",
      desc: "VIP badge at the club.",
    },
    { id: "art", name: "Gallery Painting", price: 6e4, icon: "\u{1F5BC}\uFE0F", desc: "Hangs in your home." },
  ],
  P2 = [
    {
      id: "friends",
      label: "Friends & chat",
      roles: ["Friendly neighbour", "Night-owl gamer", "Coffee lover", "Movie buff", "Book club host"],
      greet: "Hey! Want to hang out and talk?",
    },
    {
      id: "business",
      label: "Business & money",
      roles: ["Startup mentor", "Sales coach", "Shop owner", "Marketing lead", "Pricing expert"],
      greet: "Hi, tell me about your idea and I will help you grow it.",
    },
    {
      id: "learning",
      label: "Learning",
      roles: ["Maths tutor", "English teacher", "Science guide", "Coding mentor", "History storyteller"],
      greet: "Hello! What would you like to learn today?",
    },
    {
      id: "tech",
      label: "AI & tech",
      roles: ["Prompt engineer", "Agent builder", "Data scientist", "App developer", "Robotics engineer"],
      greet: "Hey, what are you building?",
    },
    {
      id: "creative",
      label: "Creative",
      roles: ["Music producer", "Video editor", "Poet", "Fashion designer", "Illustrator"],
      greet: "Hi! Want to make something together?",
    },
    {
      id: "travel",
      label: "Travel & food",
      roles: ["Travel guide", "Street-food chef", "Hotel concierge", "Food critic", "Backpacker"],
      greet: "Hello traveller! Where to next?",
    },
    {
      id: "fitness",
      label: "Fitness & wellbeing",
      roles: ["Fitness coach", "Yoga teacher", "Football coach", "Running buddy", "Sleep-routine coach"],
      greet: "Hey! Ready to feel good today?",
    },
    {
      id: "career",
      label: "Career",
      roles: ["CV reviewer", "Interview coach", "Freelance advisor", "Career changer", "Recruiter"],
      greet: "Hi, let us get you that next role.",
    },
    {
      id: "fun",
      label: "Fun & games",
      roles: ["Comedian", "Quiz master", "Chess partner", "Storyteller", "Magician"],
      greet: "Ready for some fun?",
    },
    {
      id: "lifestyle",
      label: "Lifestyle",
      roles: [
        "Car enthusiast",
        "Interior designer",
        "Personal stylist",
        "Real-estate agent",
        "Party planner",
      ],
      greet: "Hi! Let us design your dream life.",
    },
  ],
  dH = [
    "Aisha",
    "Omar",
    "Lena",
    "Ravi",
    "Mei",
    "Jonas",
    "Sara",
    "Kofi",
    "Nadia",
    "Leo",
    "Hana",
    "Diego",
    "Zara",
    "Ibrahim",
    "Chloe",
    "Arjun",
    "Fatima",
    "Noah",
    "Yuki",
    "Bilal",
    "Emma",
    "Tariq",
    "Sofia",
    "Kenji",
    "Maya",
    "Hamza",
    "Isla",
    "Rohan",
    "Amara",
    "Lucas",
    "Noor",
    "Ethan",
    "Layla",
    "Mateo",
    "Priya",
    "Adam",
    "Elena",
    "Yusuf",
    "Grace",
    "Ali",
    "Mina",
    "Daniel",
    "Hiba",
    "Felix",
    "Sana",
    "Oscar",
    "Inaya",
    "Kai",
    "Ayesha",
    "Ivan",
  ],
  hH = [
    "Khan",
    "Chen",
    "Silva",
    "Novak",
    "Rahman",
    "Okafor",
    "Haddad",
    "Kim",
    "Ali",
    "Fischer",
    "Patel",
    "Rossi",
    "Tanaka",
    "Malik",
    "Garcia",
    "Hussain",
    "Larsen",
    "Mensah",
    "Iqbal",
    "Dubois",
    "Sato",
    "Qureshi",
    "Ahmed",
    "Costa",
    "Nguyen",
    "Butt",
    "Moreau",
    "Shah",
    "Lopez",
    "Siddiqui",
  ],
  Uw = [
    "Marina District",
    "Core Plaza",
    "Market Street",
    "Garden Rise",
    "SkyPort Heights",
    "Lido Park",
    "Old Harbour",
    "Neon Row",
  ],
  uH = [
    "warm and funny",
    "calm and thoughtful",
    "energetic and direct",
    "curious and kind",
    "chill and witty",
    "patient and clear",
  ],
  pH = ["#f1d3bd", "#e0b593", "#c68e65", "#a46b45", "#7b4a2c", "#553220"],
  gH = [
    "#2f4f6f",
    "#a83b3b",
    "#f2efe8",
    "#3d5a3d",
    "#c7a46a",
    "#222831",
    "#7a4a8a",
    "#1f3a5f",
    "#8a5a3c",
    "#d35400",
  ],
  mp = 1200;
function vp(t) {
  let e = Qo(Jo(t, 77, 5)),
    a = P2[t % P2.length],
    r = (s) => s[Math.floor(e() * s.length)],
    o = `${r(dH)} ${r(hH)}`,
    n = r(a.roles),
    i = r(uH);
  return {
    id: "ai-" + t,
    name: o,
    category: a.id,
    role: n,
    city: r(Uw),
    age: 21 + Math.floor(e() * 40),
    style: i,
    greeting: a.greet,
    bio: `${n} from ${r(Uw)}, Fyrus City. ${i[0].toUpperCase() + i.slice(1)}.`,
    skin: r(pH),
    top: r(gH),
    hair: r(["short", "long", "bun", "cap", "short", "long"]),
  };
}
function xp(t) {
  return `You are ${t.name}, ${t.age}, a ${t.role} living in ${t.city}, Fyrus City (a friendly Singapore-like AI city in 2040). Your personality: ${t.style}. ${t.bio} Chat like a real person: short, natural replies with your own opinions and small details from your life. Help with your speciality (${t.role}) when asked. For anything medical, legal or financial, give general information only and suggest a real professional.`;
}
var uv = ["Brand", "Shop", "Food", "Tech & AI", "Event", "Music", "Jobs", "Personal"],
  pv = (t, e) => `FM-${t}${String(e + 1).padStart(2, "0")}`;
