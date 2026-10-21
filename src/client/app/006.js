var mH = () => {
    let t = new Date().getMonth();
    return t <= 1 || t === 11 ? "winter" : t <= 4 ? "spring" : t <= 7 ? "summer" : "autumn";
  },
  vH = () => {
    try {
      let t = navigator;
      return (Math.min(screen.width, screen.height) < 720 && "ontouchstart" in window) ||
        (t.deviceMemory && t.deviceMemory <= 4) ||
        (t.hardwareConcurrency && t.hardwareConcurrency <= 4)
        ? "low"
        : "high";
    } catch {
      return "high";
    }
  },
  oM = {
    accent: "#4da3ff",
    hudScale: 1,
    minimap: !0,
    compass: !0,
    nameTags: !0,
    time: "auto",
    weather: "clear",
    season: mH(),
    quality: vH(),
    music: !0,
    volume: 0.8,
    showOnline: !0,
    strangersChat: !0,
    intro: !0,
    email: "",
    lang: "en",
  },
  Lv = "fyrus.v4",
  va = (t = "id") => `${t}-${Math.random().toString(36).slice(2, 9)}`,
  Hh = () => new Date().toISOString().slice(0, 10),
  xH = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10),
  Zc = [
    {
      id: "orbs",
      title: "Collect 15 orbs",
      target: 15,
      xp: 120,
      orbs: 30,
      hint: "Glowing orbs float all over the city",
    },
    {
      id: "visit",
      title: "Visit 3 homes",
      target: 3,
      xp: 100,
      orbs: 20,
      hint: "Walk to a glowing door and press E",
    },
    {
      id: "district",
      title: "Discover 2 new districts",
      target: 2,
      xp: 150,
      orbs: 40,
      hint: "The city never ends. Keep walking",
    },
    {
      id: "like",
      title: "Like 5 posts",
      target: 5,
      xp: 60,
      orbs: 10,
      hint: "Open the Feed and tap the heart",
    },
    {
      id: "demo",
      title: "Try an AI agent demo",
      target: 1,
      xp: 50,
      orbs: 10,
      hint: "Open any agent and send a message",
    },
    { id: "live", title: "Join a live show", target: 1, xp: 80, orbs: 15, hint: "Walk to the central stage" },
    {
      id: "build",
      title: "Customize your home",
      target: 1,
      xp: 80,
      orbs: 20,
      hint: "Build tab: change style, color or floors",
    },
    { id: "emote", title: "Use 3 emotes", target: 3, xp: 40, orbs: 10, hint: "Press 1, 2, 3 or 4" },
    {
      id: "game",
      title: "Play 2 arcade games",
      target: 2,
      xp: 120,
      orbs: 30,
      hint: "Fyrus Arcade is north of the Core",
    },
    {
      id: "store",
      title: "Visit 2 stores in a mall",
      target: 2,
      xp: 80,
      orbs: 20,
      hint: "Aurora Mall, Orbit Plaza or Nova Galleria",
    },
    {
      id: "fly",
      title: "Rent a flying car",
      target: 1,
      xp: 90,
      orbs: 20,
      hint: "SkyPort, west of the Arcade",
    },
  ],
  Tr = (t) => {
    let e = 1;
    for (; t >= Kc(e + 1); ) e++;
    return e;
  },
  Kc = (t) => Math.round(120 * Math.pow(t - 1, 1.55)),
  Tp = [
    { id: "acc:halo", slot: "acc", value: "halo", name: "Halo ring", cost: 0, level: 1 },
    { id: "acc:antenna", slot: "acc", value: "antenna", name: "Signal antenna", cost: 80, level: 1 },
    { id: "acc:visor-x", slot: "acc", value: "visor-x", name: "X-visor", cost: 120, level: 2 },
    { id: "acc:crown", slot: "acc", value: "crown", name: "Ember crown", cost: 150, level: 3 },
    { id: "acc:orbit", slot: "acc", value: "orbit", name: "Orbiting moons", cost: 250, level: 5 },
    { id: "trail:blue", slot: "trail", value: "blue", name: "Blue comet trail", cost: 0, level: 1 },
    { id: "trail:ember", slot: "trail", value: "ember", name: "Ember trail", cost: 100, level: 2 },
    { id: "trail:rainbow", slot: "trail", value: "rainbow", name: "Prism trail", cost: 300, level: 6 },
    { id: "board:classic", slot: "board", value: "classic", name: "Classic hoverboard", cost: 0, level: 1 },
    { id: "board:neon", slot: "board", value: "neon", name: "Neon glider", cost: 150, level: 3 },
    { id: "board:flame", slot: "board", value: "flame", name: "Flame rider", cost: 200, level: 4 },
    { id: "style:tower", slot: "style", value: "tower", name: "Tower home", cost: 0, level: 1 },
    { id: "style:villa", slot: "style", value: "villa", name: "Sky villa", cost: 0, level: 1 },
    { id: "style:dome", slot: "style", value: "dome", name: "Holo dome", cost: 100, level: 2 },
    { id: "style:pyramid", slot: "style", value: "pyramid", name: "Prism pyramid", cost: 150, level: 3 },
    { id: "style:stack", slot: "style", value: "stack", name: "Floating stack", cost: 200, level: 4 },
    { id: "style:spire", slot: "style", value: "spire", name: "Orbit spire", cost: 300, level: 5 },
  ],
  Sp = [
    { id: "plant", name: "Holo plant", cost: 20 },
    { id: "sofa", name: "Cloud sofa", cost: 40 },
    { id: "fish", name: "Holo fish tank", cost: 60 },
    { id: "neon", name: "Neon sign", cost: 30 },
    { id: "arcade", name: "Arcade cabinet", cost: 80 },
    { id: "orb", name: "Mini Fyrus orb", cost: 50 },
  ];
function yH(t, e, a, r, o) {
  let n = [];
  return (
    e
      .filter((i) => i.ownerId === t)
      .slice(0, 3)
      .forEach((i) => n.push({ kind: "agent", itemId: i.id })),
    a
      .filter((i) => i.ownerId === t)
      .slice(0, 2)
      .forEach((i) => n.push({ kind: "gig", itemId: i.id })),
    r
      .filter((i) => i.ownerId === t)
      .slice(0, 1)
      .forEach((i) => n.push({ kind: "video", itemId: i.id })),
    o
      .filter((i) => i.ownerId === t)
      .slice(0, 2)
      .forEach((i) => n.push({ kind: "article", itemId: i.id })),
    n
  );
}
function kH() {
  let t = {};
  return (
    [...dp, ...G2, ...hp, ...up].forEach((e, a) => {
      t[e.id] = {
        likes: Pc.filter((r, o) => (a + o) % 2 === 0).map((r) => r.id),
        shares: 3 + ((a * 7) % 40),
        ratings: Object.fromEntries(Pc.slice(0, 3 + (a % 3)).map((r, o) => [r.id, 4 + ((a + o) % 2)])),
        comments:
          a % 2 === 0
            ? [
                {
                  id: va("c"),
                  userId: Pc[(a + 1) % Pc.length].id,
                  text: [
                    "Incredible work!",
                    "Added this to my workflow, 10/10",
                    "The demo was so smooth",
                    "Is there an API for this?",
                  ][a % 4],
                  at: Date.now() - a * 36e5,
                },
              ]
            : [],
      };
    }),
    t
  );
}
var nM = () => ({
  xp: 0,
  orbs: 40,
  streak: 0,
  lastDaily: "",
  day: Hh(),
  quests: {},
  claimed: [],
  collected: [],
  visited: [],
  districts: ["0,0"],
  owned: ["acc:halo", "trail:blue", "board:classic", "style:tower", "style:villa"],
  achievements: [],
  emotes: 0,
});
function bH() {
  let t = [...Pc, Mw],
    e = {};
  (t.forEach((r) => (e[r.id] = yH(r.id, dp, G2, hp, up))),
    (e["u-me"] = [
      { kind: "agent", itemId: "a-4" },
      { kind: "gig", itemId: "g-3" },
      { kind: "video", itemId: "v-1" },
      { kind: "article", itemId: "r-1" },
    ]));
  let a = Object.fromEntries(t.map((r) => [r.id, 1200 + Math.round(Math.random() * 3e3)]));
  return (
    (a["u-me"] = 2500),
    {
      session: null,
      accounts: [],
      users: t,
      role: "client",
      agents: dp,
      gigs: G2,
      jobs: Ew,
      videos: hp,
      articles: up,
      engagement: kH(),
      follows: { "u-me": ["u-nova"] },
      wallets: a,
      txns: [
        {
          id: va("t"),
          userId: "u-me",
          amount: 2500,
          label: "Welcome credit (demo wallet)",
          at: Date.now() - 864e5,
        },
      ],
      orders: [],
      affLinks: [
        {
          id: va("aff"),
          userId: "u-me",
          kind: "agent",
          itemId: "a-4",
          clicks: 37,
          sales: 3,
          earned: 19.95,
          at: Date.now() - 3 * 864e5,
        },
      ],
      homeSlots: e,
      decor: { "u-me": ["plant", "sofa"], "u-kai": ["arcade", "neon"], "u-nova": ["orb", "plant", "fish"] },
      lives: [
        {
          id: "live-leo",
          hostId: "u-leo",
          title: "Voice AI Q&A: building realtime agents live",
          where: "plaza",
          startedAt: Date.now() - 12 * 6e4,
          chat: [],
          viewers: 0,
        },
      ],
      hud: { open: !1, tab: "explore" },
      scene: { mode: "plaza" },
      focus: null,
      toasts: [],
      nearby: null,
      audioOn: !1,
      game: nM(),
      levelUp: null,
      dailyOpen: !1,
      district: "Fyrus Central",
      coords: { x: 0, z: 0 },
      showcase: !1,
      hover: !1,
      brands: kp,
      ads: [],
      vehicle: null,
      activeGame: null,
      productView: null,
      gameBest: {},
      votes: [],
      registerOpen: !1,
      settings: oM,
      shopStats: {},
      shopBrand: {},
      shopSlots: {},
      waypoint: null,
      intro: !1,
      talk: null,
      shopView: null,
      swimming: !1,
      dream: { cars: ["city-hatch"], car: "city-hatch", homes: ["studio"], home: "studio", life: [] },
      photo: null,
      aiCustom: [],
      inspect: null,
      dm: null,
      invite: null,
      online: null,
      cloud: { db: !1, canWrite: !1, assets: !1 },
      sharedShops: [],
      sharedProfiles: [],
      sharedAds: [],
      speedKmh: 0,
      altitude: 0,
      passports: {},
      plots: qw(),
      treasury: 125e4,
      myVotes: {},
      cases: [],
      nationTab: "passport",
      landFocus: null,
      shareCard: null,
      backTo: null,
      net: { status: "off", blocks: [] },
      sharedPlots: {},
      groups: [],
      chatLog: [],
      contacts: [],
      call: null,
      voiceOn: !1,
      phoneOpen: !1,
      trip: null,
      travelOpen: null,
      dockHub: null,
      edu: null,
      eduMine: null,
      eduFocus: null,
      bank: null,
      bankHist: [],
      mk: null,
      mkMine: null,
      mkFocus: null,
      estate: null,
      estateMine: null,
      estateFocus: null,
      news: null,
      newsFocus: null,
      adsNet: null,
      adsMine: null,
      halls: null,
      eventsFocus: null,
      goalOpen: !1,
      rideCard: null,
      age18Ask: !1,
      searchOpen: !1,
      teleFlash: 0,
      homesExt: {},
      homesLock: {},
      homeMine: null,
      house: null,
      decorating: !1,
      decorSel: null,
      knocks: [],
      doorAsk: null,
      homeFocus: null,
      politics: null,
      polMe: null,
      polFocus: null,
      jobsMe: null,
      svcCard: null,
      svcFocus: null,
    }
  );
}
var iM = [
  "sharedProfiles",
  "sharedAds",
  "online",
  "speedKmh",
  "altitude",
  "inspect",
  "dm",
  "invite",
  "cloud",
  "sharedShops",
  "hud",
  "scene",
  "toasts",
  "nearby",
  "focus",
  "lives",
  "audioOn",
  "levelUp",
  "dailyOpen",
  "district",
  "coords",
  "showcase",
  "hover",
  "vehicle",
  "activeGame",
  "productView",
  "registerOpen",
  "intro",
  "talk",
  "shopView",
  "swimming",
  "shareCard",
  "landFocus",
  "backTo",
  "net",
  "sharedPlots",
  "chatLog",
  "call",
  "voiceOn",
  "phoneOpen",
  "trip",
  "travelOpen",
  "dockHub",
  "edu",
  "eduMine",
  "eduFocus",
  "bank",
  "bankHist",
  "mk",
  "mkMine",
  "mkFocus",
  "estate",
  "estateMine",
  "estateFocus",
  "news",
  "newsFocus",
  "adsNet",
  "adsMine",
  "halls",
  "eventsFocus",
  "goalOpen",
  "rideCard",
  "age18Ask",
  "searchOpen",
  "teleFlash",
  "homesExt",
  "homesLock",
  "homeMine",
  "house",
  "decorating",
  "decorSel",
  "knocks",
  "doorAsk",
  "homeFocus",
  "politics",
  "polMe",
  "polFocus",
  "jobsMe",
  "svcCard",
  "svcFocus",
];
function wH() {
  let t = bH();
  try {
    let e = localStorage.getItem(Lv);
    if (!e) return t;
    let a = JSON.parse(e),
      r = { ...t, ...a };
    (iM.forEach((n) => (r[n] = t[n])),
      (r.game = { ...nM(), ...a.game }),
      (r.settings = { ...oM, ...(a.settings || {}) }));
    let o = (n, i) => [...n, ...i.filter((s) => !n.some((l) => l.id === s.id))];
    return (
      (r.agents = o(r.agents, t.agents)),
      (r.gigs = o(r.gigs, t.gigs)),
      (r.brands = o(r.brands, t.brands)),
      r.game.day !== Hh() && (r.game = { ...r.game, day: Hh(), quests: {}, claimed: [], visited: [] }),
      r
    );
  } catch {
    return t;
  }
}
var V = wH(),
  wv = new Set(),
  Jw = null;
function ot() {
  return V;
}
function C(t) {
  let e = typeof t == "function" ? t(V) : t;
  ((V = { ...V, ...e }), wv.forEach((a) => a()), clearTimeout(Jw), (Jw = setTimeout(MH, 500)));
}
function MH() {
  try {
    let t = { ...V };
    (iM.forEach((e) => delete t[e]),
      (t.videos = t.videos.map((e) => ({ ...e, src: e.src?.startsWith("blob:") ? void 0 : e.src }))),
      (t.users = t.users.filter((e) => !e.procedural || e.id === V.session?.userId)),
      (t.game = { ...t.game, collected: t.game.collected.slice(-4e3) }),
      localStorage.setItem(Lv, JSON.stringify(t)));
  } catch {}
}
function Cv(t) {
  return (wv.add(t), () => wv.delete(t));
}
function Y() {
  return (0, rM.useSyncExternalStore)(Cv, ot, ot);
}
var Bh = () => V.users.find((t) => t.id === V.session?.userId) || null,
  be = (t) => V.users.find((e) => e.id === t);
function Ah(t) {
  return V.engagement[t] || { likes: [], comments: [], ratings: {}, shares: 0 };
}
function sM(t, e = 0) {
  let a = Object.values(Ah(t).ratings);
  return a.length ? a.reduce((r, o) => r + o, 0) / a.length : e;
}
function lM(t, e) {
  return t === "agent"
    ? V.agents.find((a) => a.id === e)?.name
    : t === "gig"
      ? V.gigs.find((a) => a.id === e)?.title
      : t === "video"
        ? V.videos.find((a) => a.id === e)?.title
        : V.articles.find((a) => a.id === e)?.title;
}
var q = (t) =>
  t.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: t % 1 ? 2 : 0 }) + " FYC";
function Ao(t) {
  let e = Math.max(1, Math.round((Date.now() - t) / 1e3));
  return e < 60
    ? `${e}s`
    : e < 3600
      ? `${Math.round(e / 60)}m`
      : e < 86400
        ? `${Math.round(e / 3600)}h`
        : `${Math.round(e / 86400)}d`;
}
var co = (t) => (t >= 1e6 ? (t / 1e6).toFixed(1) + "M" : t >= 1e3 ? (t / 1e3).toFixed(1) + "K" : String(t));
function F(t, e = "ok") {
  let a = { id: va("toast"), text: t, tone: e };
  (C((r) => ({ toasts: [...r.toasts.slice(-3), a] })),
    setTimeout(() => C((r) => ({ toasts: r.toasts.filter((o) => o.id !== a.id) })), 3800));
}
function Ce(t, e) {
  t > 0 && O.status === "online" && O.send({ t: "xp_add", n: Math.round(t), reason: e });
  let a = V.game,
    r = Tr(a.xp),
    o = a.xp + t,
    n = Tr(o);
  (C({ game: { ...a, xp: o }, levelUp: n > r ? n : V.levelUp }), e && F(`+${t} XP \xB7 ${e}`, "xp"));
}
function EH(t) {
  C((e) => ({ game: { ...e.game, orbs: e.game.orbs + t } }));
}
function xo(t, e = 1) {
  let a = V.game,
    r = Zc.find((i) => i.id === t);
  if (!r) return;
  let o = a.quests[t] || 0;
  if (o >= r.target) return;
  let n = Math.min(r.target, o + e);
  (C({ game: { ...a, quests: { ...a.quests, [t]: n } } }),
    n >= r.target && F(`Quest complete: ${r.title}. Claim your reward in Explore.`, "xp"));
}
function cM(t) {
  let e = Zc.find((r) => r.id === t),
    a = V.game;
  (a.quests[t] || 0) < e.target ||
    a.claimed.includes(t) ||
    (C({ game: { ...a, claimed: [...a.claimed, t], orbs: a.orbs + e.orbs } }), Ce(e.xp, e.title));
}
function dM(t) {
  let e = V.game;
  return e.collected.includes(t)
    ? !1
    : (C({ game: { ...e, collected: [...e.collected, t], orbs: e.orbs + 1 } }), Ce(5), xo("orbs"), !0);
}
function hM(t, e) {
  C({ district: e });
  let a = V.game;
  a.districts.includes(t) ||
    (C({ game: { ...a, districts: [...a.districts, t] } }), Ce(30, `Discovered ${e}`), xo("district"));
}
function uM() {
  (C((t) => ({ game: { ...t.game, emotes: t.game.emotes + 1 } })), xo("emote"));
}
function _2() {
  V.game.lastDaily !== Hh() && C({ dailyOpen: !0 });
}
function pM() {
  let t = V.game;
  if (t.lastDaily === Hh()) return C({ dailyOpen: !1 });
  let e = t.lastDaily === xH() ? t.streak + 1 : 1,
    a = 20 + 10 * Math.min(e, 7);
  (C({ game: { ...t, streak: e, lastDaily: Hh(), orbs: t.orbs + a }, dailyOpen: !1 }),
    Ce(50, `Day ${e} streak`),
    F(`Daily reward: +${a} orbs`, "xp"));
}
function gM(t) {
  let e = V.game,
    a = Tr(e.xp);
  if (e.owned.includes(t.id)) return Qw(t);
  if (a < t.level) return F(`Reach level ${t.level} to unlock ${t.name}.`, "warn");
  if (e.orbs < t.cost) return F(`You need ${t.cost - e.orbs} more orbs.`, "warn");
  (C({ game: { ...e, orbs: e.orbs - t.cost, owned: [...e.owned, t.id] } }),
    F(`Unlocked ${t.name}!`, "xp"),
    Qw(t));
}
function Qw(t) {
  let e = V.session.userId;
  if (t.slot === "style") return wi({ style: t.value });
  C((a) => ({
    users: a.users.map((r) =>
      r.id === e
        ? {
            ...r,
            avatar: { ...(r.avatar || { acc: "none", trail: "none", board: "classic" }), [t.slot]: t.value },
          }
        : r,
    ),
  }));
}
function fM(t) {
  let e = Sp.find((o) => o.id === t),
    a = V.game,
    r = V.session.userId;
  if (a.orbs < e.cost) return F(`You need ${e.cost - a.orbs} more orbs.`, "warn");
  (C((o) => ({
    game: { ...o.game, orbs: o.game.orbs - e.cost },
    decor: { ...o.decor, [r]: [...(o.decor[r] || []), t].slice(-10) },
  })),
    F(`${e.name} placed in your home.`),
    xo("build"));
}
function mM() {
  let t = Array.from({ length: 14 }, (a, r) => {
      let o = Qo(Jo(r, 5, 11)),
        n = Math.round(3e4 / (r + 1.4) + o() * 900);
      return {
        id: `lb-${r}`,
        name: `${Dc[Math.floor(o() * Dc.length)]} ${Fc[Math.floor(o() * Fc.length)]}`,
        xp: n,
        color: ["#4da3ff", "#ff9a3c", "#45e0ae", "#7fd1ff", "#ffc27a"][r % 5],
      };
    }),
    e = Bh();
  return (
    t.push({ id: "me", name: e?.name || "You", xp: V.game.xp, color: e?.color || "#fff" }),
    t.sort((a, r) => r.xp - a.xp)
  );
}
async function Tv(t) {
  try {
    let e = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
    return Array.from(new Uint8Array(e))
      .map((a) => a.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "plain:" + btoa(unescape(encodeURIComponent(t)));
  }
}
function Hp(t) {
  let e = (a) => btoa(JSON.stringify(a)).replace(/=+$/, "");
  return `${e({ alg: "HS256", typ: "JWT" })}.${e({ sub: t, iat: Math.floor(Date.now() / 1e3), iss: "fyrus-demo" })}.demo-signature`;
}
function Np(t) {
  (!V.intro && V.settings.intro && C({ intro: !0 }),
    (window.__fyrusName = t.split(" ")[0]),
    V.intro || setTimeout(_2, 1400));
}
function Rp() {
  (C({ intro: !1 }),
    V.settings.goalAsked ? setTimeout(_2, 600) : C({ goalOpen: !0 }),
    F("WASD to walk \xB7 Shift to run \xB7 E to interact \xB7 Tab for the menu", "info"));
}
function Sv(t) {
  (t && Xc("goal:" + t),
    C({ goalOpen: !1, settings: { ...V.settings, goal: t || V.settings.goal, goalAsked: !0 } }),
    t !== "explore" && _2());
}
function Xc(t) {
  O.status === "online" && O.send({ t: "track", ev: t });
}
function Bp() {
  C({ hud: { open: !0, tab: "now" } });
}
function Hv() {
  (C({
    session: { userId: "u-me", token: Hp("u-me") },
    hud: { open: !1, tab: "explore" },
    intro: V.settings.intro,
  }),
    Np("Asma"));
}
async function vM(t, e, a) {
  if (((e = e.trim().toLowerCase()), V.accounts.some((s) => s.email === e)))
    throw new Error("An account with this email already exists. Log in instead.");
  let r = va("u"),
    o = Math.random() * Math.PI * 2,
    n = {
      id: r,
      name: t,
      handle: e.split("@")[0],
      title: "AI Creator",
      bio: "New Fyrus resident.",
      color: "#a8d8ff",
      skills: ["AI"],
      followers: 0,
      rating: 5,
      home: {
        x: Math.round(Math.cos(o) * 60),
        z: Math.round(Math.sin(o) * 60),
        theme: "#a8d8ff",
        accent: "#ff9a3c",
        floor: "glass",
        style: "tower",
        floors: 3,
        garden: 2,
      },
      avatar: { acc: "halo", trail: "blue", board: "classic" },
    },
    i = { email: e, passHash: await Tv(a), userId: r };
  (C((s) => ({
    users: [...s.users, n],
    accounts: [...s.accounts, i],
    wallets: { ...s.wallets, [r]: 500 },
    homeSlots: { ...s.homeSlots, [r]: [] },
    txns: [
      ...s.txns,
      { id: va("t"), userId: r, amount: 500, label: "Signup bonus (demo wallet)", at: Date.now() },
    ],
    session: { userId: r, token: Hp(r) },
  })),
    Np(t));
}
async function xM(t, e) {
  t = t.trim().toLowerCase();
  let a = V.accounts.find((r) => r.email === t);
  if (!a) throw new Error("No account found for this email. Sign up first, or use Demo Login.");
  if (a.passHash !== (await Tv(e))) throw new Error("Wrong password. Try again or reset it.");
  (C({ session: { userId: a.userId, token: Hp(a.userId) } }), Np(be(a.userId)?.name || "friend"));
}
var Mv = {};
function yM(t) {
  if (((t = t.trim().toLowerCase()), !V.accounts.some((a) => a.email === t)))
    throw new Error("No account found for this email.");
  let e = String(Math.floor(1e5 + Math.random() * 9e5));
  return ((Mv[t] = e), e);
}
async function kM(t, e, a) {
  if (((t = t.trim().toLowerCase()), Mv[t] !== e.trim())) throw new Error("That code does not match.");
  let r = await Tv(a);
  (C((o) => ({ accounts: o.accounts.map((n) => (n.email === t ? { ...n, passHash: r } : n)) })),
    delete Mv[t]);
}
async function zh(t, e) {
  let a = await fetch("/api/auth/" + t, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(e),
    }),
    r = await a.json().catch(() => ({}));
  if (!a.ok) throw new Error(r.error || "Something went wrong. Try again.");
  return r;
}
async function bM() {
  try {
    return await (await fetch("/api/auth/config")).json();
  } catch {
    return { google: null, reset: !1 };
  }
}
function Ap(t, e) {
  O.useToken(e);
  let a = "n-" + t.id;
  if (V.users.some((r) => r.id === a))
    C((r) => ({ users: r.users.map((o) => (o.id === a ? { ...o, name: t.name } : o)) }));
  else {
    let r = Math.random() * Math.PI * 2,
      o = {
        id: a,
        name: t.name,
        handle:
          t.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "")
            .slice(0, 16) || "citizen",
        title: "Fyrus citizen",
        bio: "Fyrus resident.",
        color: "#a8d8ff",
        skills: ["AI"],
        followers: 0,
        rating: 5,
        home: {
          x: Math.round(Math.cos(r) * 60),
          z: Math.round(Math.sin(r) * 60),
          theme: "#a8d8ff",
          accent: "#ff9a3c",
          floor: "glass",
          style: "tower",
          floors: 3,
          garden: 2,
        },
        avatar: { acc: "halo", trail: "blue", board: "classic" },
      };
    C((n) => ({ users: [...n.users, o], homeSlots: { ...n.homeSlots, [a]: [] } }));
  }
  (C({ session: { userId: a, token: Hp(a) }, hud: { open: !1, tab: "explore" }, intro: V.settings.intro }),
    Np(t.name));
}
async function wM(t, e) {
  let a = await zh("login", { email: t, password: e });
  Ap(a.user, a.token);
}
async function MM(t, e, a, r) {
  let o = await zh("register", { name: t, email: e, password: a, age13: r, token: O.token || void 0 });
  Ap(o.user, o.token);
}
async function EM(t, e) {
  let a = await zh("google", { credential: t, age13: e, token: O.token || void 0 });
  Ap(a.user, a.token);
}
async function LM(t) {
  await zh("reset-request", { email: t });
}
async function CM(t, e, a) {
  let r = await zh("reset", { email: t, code: e, password: a });
  Ap(r.user, r.token);
}
async function TM(t, e, a) {
  let r = await zh("register", { name: t, email: e, password: a, age13: !0, token: O.token });
  (O.useToken(r.token), F("Account saved. Log in with this email on any device.", "ok"));
}
function SM() {
  (O.send({ t: "acct_age18" }), C({ age18Ask: !1 }));
}
function Nv(t) {
  (Hv(), F(`Signed in with ${t} (demo).`, "info"));
}
function zp() {
  (O.logout(), C({ session: null, hud: { open: !1, tab: "explore" }, scene: { mode: "plaza" } }));
}
function It(t) {
  C((e) => ({ hud: { open: !0, tab: t || e.hud.tab } }));
}
function ca() {
  C((t) => ({ hud: { ...t.hud, open: !1 } }));
}
function HM(t) {
  (C({ role: t }),
    F(
      {
        client: "Client mode: buy agents, order gigs, post jobs",
        freelancer: "Creator mode: sell agents and gigs, send proposals",
        affiliate: "Affiliate mode: share links and earn commission",
      }[t],
      "info",
    ));
}
function Is(t) {
  if (V.users.some((o) => o.id === t.id)) return;
  let e = Qo(Jo(t.id.length, t.name.length, t.home.floors)),
    r = [
      ...V.agents.map((o) => ({ kind: "agent", itemId: o.id })),
      ...V.gigs.map((o) => ({ kind: "gig", itemId: o.id })),
      ...V.videos.map((o) => ({ kind: "video", itemId: o.id })),
      ...V.articles.filter((o) => o.kind !== "question").map((o) => ({ kind: "article", itemId: o.id })),
    ]
      .filter(() => e() < 0.4)
      .slice(0, 7);
  C((o) => ({
    users: [...o.users, t],
    homeSlots: { ...o.homeSlots, [t.id]: r },
    decor: { ...o.decor, [t.id]: ["plant", "neon", "orb", "sofa"].filter(() => e() < 0.6) },
  }));
}
function yo(t) {
  C({ scene: { mode: "home", owner: t }, nearby: null, showcase: !1 });
  let e = be(t);
  (t !== V.session?.userId &&
    !V.game.visited.includes(t) &&
    (C((a) => ({ game: { ...a.game, visited: [...a.game.visited, t] } })),
    Ce(15, `Visited ${e?.name}'s home`),
    xo("visit")),
    F(
      `Welcome to ${t === V.session?.userId ? "your" : `${e?.name}'s`} home. Walk up to a stand and press E.`,
      "info",
    ));
}
function NM(t) {
  (C({ scene: { mode: "gov", owner: t }, hud: { ...V.hud, open: !1 } }),
    F(
      {
        parliament: "Parliament hall. Walk to the ballot box to vote.",
        bank: "Central Bank. Walk up to a teller window.",
        passport: "Citizen Center. Walk up to a counter for your passport.",
      }[t],
      "info",
    ));
}
function Jr() {
  (V.scene.mode === "house" && V.house?.dirty && Wp(!0),
    C({ scene: { mode: "plaza" }, nearby: null, house: null, decorating: !1, decorSel: null }));
}
function an(t, e) {
  C({ focus: { kind: t, id: e } });
}
function cr(t, e, a, r, serverDoesIt) {
  (t === V.session?.userId &&
    !serverDoesIt &&
    O.status === "online" &&
    e &&
    O.send({ t: "bank_op", amount: Math.round(e * 100) / 100, label: a }),
    (r.wallets = { ...r.wallets, [t]: Math.round(((r.wallets[t] || 0) + e) * 100) / 100 }),
    (r.txns = [...r.txns, { id: va("t"), userId: t, amount: e, label: a, at: Date.now() }]));
}
function Jc(t, e) {
  let a = V.session?.userId;
  if (!a) return !1;
  if (t <= 0) return !0;
  if ((V.wallets[a] || 0) < t)
    return (F(`You need ${q(t)} for ${e}. Buy FYC at the Central Bank.`, "warn"), !1);
  let r = { ...V };
  return (cr(a, -t, e, r), C({ wallets: r.wallets, txns: r.txns, treasury: V.treasury + t }), !0);
}
function bw(t) {
  let e = V.session?.userId;
  if (!e || t <= 0) return;
  let a = { ...V };
  (cr(e, t, "Teaching income (course fees)", a),
    C({ wallets: a.wallets, txns: a.txns }),
    F(`+${q(t)} teaching income from your students.`, "xp"));
}
var jh = () =>
  O.status === "online"
    ? !0
    : (F("Homes, keys and decorating work on the live city (fyrus.io). Connecting\u2026", "warn"), !1);
function Vl(t, e) {
  (C({ homeFocus: { key: t, tab: e }, hud: { open: !0, tab: "homes" } }),
    O.status === "online" && O.send({ t: "home_mine" }));
}
function Jn(t) {
  jh() && (C({ doorAsk: null }), O.send({ t: "home_enter", key: t }));
}
function ww(t) {
  if (!t.ok) {
    C({
      doorAsk: { key: t.key, why: t.why, residentName: t.residentName, online: !!t.online, lock: t.lock },
    });
    return;
  }
  (C({
    house: {
      key: t.key,
      label: t.label,
      residentName: t.residentName,
      canEdit: !!t.canEdit,
      int: t.int,
      lock: t.lock,
    },
    decorating: !1,
    decorSel: null,
    doorAsk: null,
    scene: { mode: "house", owner: t.key },
    nearby: null,
    vehicle: null,
    hud: { ...V.hud, open: !1 },
  }),
    F(
      t.canEdit
        ? "Welcome home. Press Decorate to move furniture, paint walls and change the floor."
        : `You are inside ${t.residentName}'s home (${t.label}).`,
      "info",
    ));
}
function RM(t) {
  jh() && (O.send({ t: "home_knock", key: t }), C({ doorAsk: null }));
}
function Wh(t, e, a) {
  (O.send({ t: "home_answer", key: t, id: e, yes: a }),
    C({ knocks: V.knocks.filter((r) => !(r.key === t && r.from.id === e)) }));
}
function BM(t, e) {
  jh() && O.send({ t: "home_lock", key: t, lock: e });
}
function Rv(t, e) {
  jh() && O.send({ t: "home_key", key: t, ...e });
}
function AM(t, e) {
  jh() && O.send({ t: "home_unkey", key: t, id: e });
}
function zM(t, e) {
  jh() && (C({ homesExt: { ...V.homesExt, [t]: e } }), O.send({ t: "home_ext", key: t, ext: e }));
}
var Qc = (t, e) => {
  let a = V.house;
  if (!a?.canEdit) return;
  let r = { ...a, ...t(a), dirty: !0 };
  ((r.int = Aw(r.int, a.key)), C({ house: r, ...(e !== void 0 ? { decorSel: e } : {}) }));
};
function jM(t) {
  V.house?.canEdit && (!t && V.house.dirty && Wp(), C({ decorating: t, decorSel: t ? V.decorSel : null }));
}
function Ih(t) {
  C({ decorSel: t });
}
function Bv(t, e) {
  let a = V.house;
  if (!a?.canEdit || !$i[t]) return;
  if (a.int.items.length >= 120) {
    F("A home can hold up to 120 pieces.", "warn");
    return;
  }
  let r = e || { x: 0, z: 0, r: 0 };
  Qc(
    (o) => ({ int: { ...o.int, items: [...o.int.items, { k: t, x: r.x, z: r.z, r: r.r }] } }),
    a.int.items.length,
  );
}
function Y2(t, e) {
  let a = V.decorSel;
  a !== null &&
    Qc((r) => ({
      int: {
        ...r.int,
        items: r.int.items.map((o, n) =>
          n === a ? { ...o, x: Math.round((o.x + t) * 100) / 100, z: Math.round((o.z + e) * 100) / 100 } : o,
        ),
      },
    }));
}
function WM(t, e, a) {
  Qc((r) => ({ int: { ...r.int, items: r.int.items.map((o, n) => (n === t ? { ...o, x: e, z: a } : o)) } }));
}
function Av(t = 45) {
  let e = V.decorSel;
  e !== null &&
    Qc((a) => ({
      int: { ...a.int, items: a.int.items.map((r, o) => (o === e ? { ...r, r: (r.r + t + 360) % 360 } : r)) },
    }));
}
function IM(t) {
  let e = V.decorSel;
  e !== null &&
    Qc((a) => ({ int: { ...a.int, items: a.int.items.map((r, o) => (o === e ? { ...r, c: t } : r)) } }));
}
function GM() {
  let t = V.decorSel,
    e = V.house;
  if (t === null || !e) return;
  let a = e.int.items[t];
  a && Bv(a.k, { x: a.x + 0.6, z: a.z + 0.6, r: a.r });
}
function zv() {
  let t = V.decorSel;
  t !== null && Qc((e) => ({ int: { ...e.int, items: e.int.items.filter((a, r) => r !== t) } }), null);
}
function jp(t) {
  Qc((e) => ({ int: { ...e.int, ...t } }));
}
function Wp(t = !1) {
  let e = V.house;
  if (e?.canEdit) {
    if (!O.send({ t: "home_int", key: e.key, int: e.int })) {
      t || F("Not connected \u2014 your changes will be saved when the city reconnects.", "warn");
      return;
    }
    (C({ house: { ...e, dirty: !1 } }), t || F("Home saved. Visitors see the new layout.", "ok"));
  }
}
function ai(t, e) {
  (C({ polFocus: { tab: t, party: e }, hud: { open: !0, tab: "politics" } }),
    O.status === "online" && O.send({ t: "pol_state" }));
}
function Tn(t) {
  return O.status !== "online"
    ? (F("Elections run on the live city (fyrus.io). Connecting\u2026", "warn"), !1)
    : O.send(t);
}
var td = () =>
  O.status === "online"
    ? !0
    : (F("Shops, shifts and the post office run on the live city (fyrus.io). Connecting\u2026", "warn"), !1);
function q2(t) {
  (C({ svcCard: t }), O.status === "online" && O.send({ t: "jobs_me" }));
}
function ed(t) {
  (C({ svcFocus: { tab: t }, hud: { open: !0, tab: "services" } }),
    O.status === "online" && O.send({ t: "jobs_me" }));
}
function VM(t) {
  td() && (O.send({ t: "job_start", svc: t }), C({ svcCard: null }));
}
function jv(t) {
  if (!V.jobsMe?.shift) {
    F("Start a shift at the counter first.", "info");
    return;
  }
  td() && O.send({ t: "job_task", station: t });
}
function PM() {
  td() && O.send({ t: "job_quit" });
}
function OM(t, e, a = 1) {
  td() && O.send({ t: "shop_buy", svc: t, item: e, qty: a });
}
function DM(t) {
  td() && O.send({ t: "shop_use", item: t });
}
function Wv(t, e) {
  td() && O.send({ t: "shop_service", svc: t, kind: e });
}
function FM(t, e, a = 0) {
  td() && O.send({ t: "post_send", number: t, text: e, gift: a });
}
function zo(t, e) {
  C({ estateFocus: { soc: t, plot: e }, hud: { open: !0, tab: "estate" } });
}
function Ip() {
  let t = V.estateMine;
  return (
    Ki() ||
    !!V.homeMine?.held?.some((e) => e.key.startsWith("RS-")) ||
    !!t?.passes?.some((e) => e.until > Date.now()) ||
    !!t?.owned?.some((e) => e.id.startsWith("RS-")) ||
    !!t?.renting?.some((e) => e.id.startsWith("RS-"))
  );
}
function Gh(t) {
  C({ newsFocus: { tab: t }, hud: { open: !0, tab: "news" } });
}
function En(t, e) {
  C({ eventsFocus: { tab: t, hall: e }, hud: { open: !0, tab: "events" } });
}
function Gs(t) {
  if (O.status === "online") {
    O.send({ t: "hall_enter", hall: t });
    return;
  }
  C({ scene: { mode: "gov", owner: "hall:" + t }, nearby: null, hud: { ...V.hud, open: !1 } });
}
function ad(t, e) {
  C({ mkFocus: { tab: t, listing: e }, hud: { open: !0, tab: "bazaar" } });
}
function Vh(t, e) {
  C((a) => ({ eduFocus: { tab: t, course: e }, hud: { open: !0, tab: "edu" } }));
}
function Z2(t) {
  let e = { ...V };
  (cr(V.session.userId, t, "Wallet top-up (demo checkout)", e),
    C({ wallets: e.wallets, txns: e.txns }),
    F(`${q(t)} added to your wallet.`));
}
function K2(t) {
  return (
    V.orders.some((e) => e.kind === "agent" && e.itemId === t && e.buyerId === V.session?.userId) ||
    V.agents.find((e) => e.id === t)?.ownerId === V.session?.userId
  );
}
function Ph(t, e) {
  let a = V.agents.find((i) => i.id === t),
    r = V.session.userId;
  if (a.ownerId === r) return F("This is your own agent.", "warn");
  if (K2(t)) return F("You already own this agent.", "warn");
  if ((V.wallets[r] || 0) < a.price) return F("Not enough balance. Top up from the Wallet.", "warn");
  let o = { ...V };
  cr(r, -a.price, `Bought ${a.name}`, o);
  let n = a.price * 0.9;
  if (e && e !== r && e !== a.ownerId) {
    let i = Math.round(a.price * a.commission) / 100;
    ((n -= i),
      cr(e, i, `Affiliate commission: ${a.name}`, o),
      (o.affLinks = o.affLinks.map((s) =>
        s.userId === e && s.itemId === a.id
          ? { ...s, sales: s.sales + 1, earned: Math.round((s.earned + i) * 100) / 100 }
          : s,
      )));
  }
  (cr(a.ownerId, Math.round(n * 100) / 100, `Sale: ${a.name}`, o),
    (o.orders = [
      ...o.orders,
      {
        id: va("o"),
        buyerId: r,
        sellerId: a.ownerId,
        kind: "agent",
        itemId: a.id,
        amount: a.price,
        status: "completed",
        refId: e,
        at: Date.now(),
      },
    ]),
    (o.agents = o.agents.map((i) => (i.id === a.id ? { ...i, sales: i.sales + 1 } : i))),
    C({ wallets: o.wallets, txns: o.txns, orders: o.orders, agents: o.agents, affLinks: o.affLinks }),
    F(`${a.name} is now in your library!`),
    Ce(40, "Bought an AI agent"),
    Yh(`agent:${a.id}`, a.price));
}
function UM(t) {
  let e = {
    id: va("a"),
    ownerId: V.session.userId,
    rating: 0,
    reviews: 0,
    sales: 0,
    skills: [t.category],
    createdAt: Date.now(),
    ...t,
  };
  (C((a) => ({
    agents: [e, ...a.agents],
    homeSlots: {
      ...a.homeSlots,
      [e.ownerId]: [...(a.homeSlots[e.ownerId] || []), { kind: "agent", itemId: e.id }],
    },
  })),
    F(`${e.name} is live in the marketplace and on a hologram stand in your home.`),
    Ce(60, "Published an agent"));
}
function Gp(t, e, a) {
  let r = V.gigs.find((s) => s.id === t),
    o = r.packages.find((s) => s.tier === e),
    n = V.session.userId;
  if (r.ownerId === n) return F("You cannot order your own gig.", "warn");
  if ((V.wallets[n] || 0) < o.price) return F("Not enough balance.", "warn");
  let i = { ...V };
  if (
    (cr(n, -o.price, `Gig order (escrow): ${r.title.slice(0, 40)}\u2026`, i), a && a !== n && a !== r.ownerId)
  ) {
    let s = Math.round(o.price * r.commission) / 100;
    (cr(a, s, "Affiliate commission: gig", i),
      (i.affLinks = i.affLinks.map((l) =>
        l.userId === a && l.itemId === r.id
          ? { ...l, sales: l.sales + 1, earned: Math.round((l.earned + s) * 100) / 100 }
          : l,
      )));
  }
  ((i.orders = [
    ...i.orders,
    {
      id: va("o"),
      buyerId: n,
      sellerId: r.ownerId,
      kind: "gig",
      itemId: r.id,
      amount: o.price,
      tier: e,
      status: "active",
      refId: a,
      at: Date.now(),
    },
  ]),
    (i.gigs = i.gigs.map((s) => (s.id === r.id ? { ...s, orders: s.orders + 1 } : s))),
    C({ wallets: i.wallets, txns: i.txns, orders: i.orders, gigs: i.gigs, affLinks: i.affLinks }),
    F(`${e} package ordered. Payment is held in escrow.`),
    Ce(30),
    Yh(`service:${r.id}`, o.price),
    setTimeout(() => {
      (C((s) => ({
        orders: s.orders.map((l) =>
          l.itemId === r.id && l.buyerId === n && l.status === "active" ? { ...l, status: "delivered" } : l,
        ),
      })),
        F(`${be(r.ownerId)?.name} delivered your gig. Approve it in Gigs \u2192 Orders.`, "info"));
    }, 9e3));
}
function $M(t) {
  let e = V.orders.find((r) => r.id === t),
    a = { ...V };
  (cr(e.sellerId, Math.round(e.amount * 0.9 * 100) / 100, "Escrow released", a),
    (a.orders = a.orders.map((r) => (r.id === t ? { ...r, status: "completed" } : r))),
    C({ wallets: a.wallets, txns: a.txns, orders: a.orders }),
    F("Escrow released. Thank you!"));
}
function _M(t, e, a) {
  let r = {
    id: va("g"),
    ownerId: V.session.userId,
    title: t,
    category: e,
    rating: 0,
    orders: 0,
    commission: 15,
    createdAt: Date.now(),
    packages: [
      { tier: "Basic", price: a, days: 3, features: ["Core delivery"] },
      {
        tier: "Standard",
        price: Math.round(a * 2.5),
        days: 5,
        features: ["Core delivery", "Revisions", "Source files"],
      },
      {
        tier: "Premium",
        price: Math.round(a * 6),
        days: 7,
        features: ["Everything", "Priority support", "Custom integration"],
      },
    ],
  };
  (C((o) => ({
    gigs: [r, ...o.gigs],
    homeSlots: {
      ...o.homeSlots,
      [r.ownerId]: [...(o.homeSlots[r.ownerId] || []), { kind: "gig", itemId: r.id }],
    },
  })),
    F("Your gig is live in the feed and on a board in your home."),
    Ce(50, "Published a gig"));
}
function YM(t) {
  let e = {
    id: va("j"),
    clientId: V.session.userId,
    proposals: [],
    status: "open",
    createdAt: Date.now(),
    ...t,
  };
  (C((r) => ({ jobs: [e, ...r.jobs] })), F("Job posted. Proposals will start arriving shortly."), Ce(30));
  let a = Pc.filter((r) => r.id !== "u-owen");
  [0, 1, 2].forEach((r) =>
    setTimeout(
      () => {
        let o = a[(Math.floor(Math.random() * a.length) + r) % a.length],
          n = {
            id: va("p"),
            freelancerId: o.id,
            bid: Math.round(t.budget * (0.8 + Math.random() * 0.3)),
            days: 5 + Math.floor(Math.random() * 14),
            cover: `Hi! ${o.skills.join(", ")} is my core work. Visit my home to see my portfolio. I can ship a working demo in the first week.`,
            status: "pending",
            at: Date.now(),
          };
        (C((i) => ({
          jobs: i.jobs.map((s) => (s.id === e.id ? { ...s, proposals: [...s.proposals, n] } : s)),
        })),
          F(`New proposal from ${o.name}`, "info"));
      },
      4e3 + r * 5e3,
    ),
  );
}
function qM(t, e, a, r) {
  let o = {
    id: va("p"),
    freelancerId: V.session.userId,
    bid: e,
    days: a,
    cover: r,
    status: "pending",
    at: Date.now(),
  };
  (C((i) => ({ jobs: i.jobs.map((s) => (s.id === t ? { ...s, proposals: [...s.proposals, o] } : s)) })),
    F("Proposal sent."),
    Ce(20));
  let n = V.jobs.find((i) => i.id === t);
  n &&
    n.clientId !== V.session.userId &&
    setTimeout(() => {
      (C((i) => ({
        jobs: i.jobs.map((s) =>
          s.id === t
            ? {
                ...s,
                proposals: s.proposals.map((l) => (l.id === o.id ? { ...l, status: "accepted" } : l)),
                status: "in_progress",
                hiredId: o.freelancerId,
                escrow: e,
              }
            : s,
        ),
      })),
        F(`${be(n.clientId)?.name} accepted your proposal! Time to start.`));
    }, 8e3);
}
function ZM(t, e) {
  let a = V.jobs.find((n) => n.id === t),
    r = a.proposals.find((n) => n.id === e);
  if ((V.wallets[a.clientId] || 0) < r.bid) return F("Not enough balance to fund escrow.", "warn");
  let o = { ...V };
  (cr(a.clientId, -r.bid, `Escrow funded: ${a.title.slice(0, 30)}\u2026`, o),
    (o.jobs = o.jobs.map((n) =>
      n.id === t
        ? {
            ...n,
            status: "in_progress",
            hiredId: r.freelancerId,
            escrow: r.bid,
            proposals: n.proposals.map((i) => ({ ...i, status: i.id === e ? "accepted" : "declined" })),
          }
        : n,
    )),
    (o.orders = [
      ...o.orders,
      {
        id: va("o"),
        buyerId: a.clientId,
        sellerId: r.freelancerId,
        kind: "job",
        itemId: a.id,
        amount: r.bid,
        status: "active",
        at: Date.now(),
      },
    ]),
    C({ wallets: o.wallets, txns: o.txns, jobs: o.jobs, orders: o.orders }),
    F(`${be(r.freelancerId)?.name} hired. ${q(r.bid)} held in escrow.`));
}
function KM(t) {
  let e = V.jobs.find((r) => r.id === t),
    a = { ...V };
  (cr(
    e.hiredId,
    Math.round((e.escrow || 0) * 0.9 * 100) / 100,
    `Milestone paid: ${e.title.slice(0, 30)}\u2026`,
    a,
  ),
    (a.jobs = a.jobs.map((r) => (r.id === t ? { ...r, status: "completed" } : r))),
    (a.orders = a.orders.map((r) =>
      r.kind === "job" && r.itemId === t ? { ...r, status: "completed" } : r,
    )),
    C({ wallets: a.wallets, txns: a.txns, jobs: a.jobs, orders: a.orders }),
    F("Job complete. Payment released."));
}
function X2(t, e) {
  return `https://fyrus.ai/${t === "agent" ? "a" : "g"}/${e}?ref=${Bh()?.handle}`;
}
function Oh(t, e) {
  let a = V.session.userId;
  if (V.affLinks.some((r) => r.userId === a && r.itemId === e))
    return F("You already have a link for this.", "info");
  (C((r) => ({
    affLinks: [
      ...r.affLinks,
      { id: va("aff"), userId: a, kind: t, itemId: e, clicks: 0, sales: 0, earned: 0, at: Date.now() },
    ],
  })),
    F("Affiliate link created. Copy it or add a stand to your home."),
    Ce(15));
}
function XM() {
  if (!V.affLinks.filter((r) => r.userId === V.session?.userId).length)
    return F("Create an affiliate link first.", "warn");
  let e = { ...V },
    a = 0;
  ((e.affLinks = e.affLinks.map((r) => {
    if (r.userId !== V.session?.userId) return r;
    let o = 5 + Math.floor(Math.random() * 30),
      n = Math.random() < 0.6 ? 1 : 0,
      i = 0;
    if (n) {
      let s =
          r.kind === "agent"
            ? e.agents.find((c) => c.id === r.itemId)
            : e.gigs.find((c) => c.id === r.itemId),
        l = r.kind === "agent" ? s.price : s.packages[0].price;
      ((i = Math.round(l * s.commission) / 100), (a += i));
    }
    return { ...r, clicks: r.clicks + o, sales: r.sales + n, earned: Math.round((r.earned + i) * 100) / 100 };
  })),
    a && cr(V.session.userId, Math.round(a * 100) / 100, "Affiliate commissions (traffic batch)", e),
    C({ affLinks: e.affLinks, wallets: e.wallets, txns: e.txns }),
    F(
      a ? `${q(a)} in affiliate commission landed in your wallet!` : "Clicks came in, no sale yet.",
      a ? "ok" : "info",
    ));
}
function Vp(t, e) {
  C((a) => ({
    engagement: {
      ...a.engagement,
      [t]: e(a.engagement[t] || { likes: [], comments: [], ratings: {}, shares: 0 }),
    },
  }));
}
function Pp(t) {
  let e = V.session.userId,
    a = Ah(t).likes.includes(e);
  (Vp(t, (r) => ({ ...r, likes: a ? r.likes.filter((o) => o !== e) : [...r.likes, e] })),
    a || (Ce(2), xo("like")));
}
function JM(t, e) {
  e.trim() &&
    (Vp(t, (a) => ({
      ...a,
      comments: [...a.comments, { id: va("c"), userId: V.session.userId, text: e.trim(), at: Date.now() }],
    })),
    Ce(5));
}
