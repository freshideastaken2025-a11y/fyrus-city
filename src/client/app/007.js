function QM(t, e) {
  (Vp(t, (a) => ({ ...a, ratings: { ...a.ratings, [V.session.userId]: e } })), F(`You rated it ${e}\u2605`));
}
function Op(t) {
  Vp(t, (e) => ({ ...e, shares: e.shares + 1 }));
  try {
    navigator.clipboard.writeText(`https://fyrus.ai/i/${t}`).catch(() => {});
  } catch {}
  (F("Link copied and reposted to your feed."), Ce(5));
}
function t8(t) {
  let e = V.session.userId,
    a = V.follows[e] || [],
    r = a.includes(t);
  C((o) => ({
    follows: { ...o.follows, [e]: r ? a.filter((n) => n !== t) : [...a, t] },
    users: o.users.map((n) => (n.id === t ? { ...n, followers: n.followers + (r ? -1 : 1) } : n)),
  }));
}
function e8(t, e) {
  let a = {
    id: va("v"),
    ownerId: V.session.userId,
    title: t,
    duration: e ? "upload" : "0:30",
    views: 0,
    hue: 205 + Math.floor(Math.random() * 30),
    src: e,
    createdAt: Date.now(),
  };
  (C((r) => ({
    videos: [a, ...r.videos],
    homeSlots: {
      ...r.homeSlots,
      [a.ownerId]: [
        ...(r.homeSlots[a.ownerId] || []).filter((o) => o.kind !== "video"),
        { kind: "video", itemId: a.id },
      ],
    },
  })),
    F("Video published to the feed and playing on your home cinema screen."),
    Ce(25, "Posted a video"));
}
function a8(t, e, a) {
  let r = {
    id: va("r"),
    ownerId: V.session.userId,
    kind: t,
    title: e,
    body: a,
    excerpt: a.slice(0, 120),
    readMins: Math.max(1, Math.round(a.split(/\s+/).length / 200)),
    createdAt: Date.now(),
    answers: t === "question" ? [] : void 0,
  };
  (C((o) => ({
    articles: [r, ...o.articles],
    homeSlots:
      t === "question"
        ? o.homeSlots
        : {
            ...o.homeSlots,
            [r.ownerId]: [...(o.homeSlots[r.ownerId] || []), { kind: "article", itemId: r.id }],
          },
  })),
    F(t === "question" ? "Question posted. The community will answer." : "Article published."),
    Ce(25),
    t === "question" &&
      setTimeout(() => {
        (C((o) => ({
          articles: o.articles.map((n) =>
            n.id === r.id
              ? {
                  ...n,
                  answers: [
                    ...(n.answers || []),
                    {
                      userId: "u-zara",
                      text: "Great question! Start with a small eval set, then let the data decide.",
                      at: Date.now(),
                    },
                  ],
                }
              : n,
          ),
        })),
          F("Zara Mitchell answered your question.", "info"));
      }, 7e3));
}
function r8(t, e) {
  e.trim() &&
    (C((a) => ({
      articles: a.articles.map((r) =>
        r.id === t
          ? { ...r, answers: [...(r.answers || []), { userId: a.session.userId, text: e, at: Date.now() }] }
          : r,
      ),
    })),
    Ce(10));
}
function wi(t) {
  let e = V.session.userId;
  (C((a) => ({ users: a.users.map((r) => (r.id === e ? { ...r, home: { ...r.home, ...t } } : r)) })),
    xo("build"));
}
function o8(t, e) {
  (wi({ x: t, z: e }),
    F("Plot claimed! Your home was built here. Open Build to style it.", "xp"),
    Ce(60, "Claimed a plot"));
}
function Dh(t) {
  let e = V.session.userId;
  (C((a) => ({ homeSlots: { ...a.homeSlots, [e]: t } })), xo("build"));
}
function n8(t, e) {
  let a = V.session.userId;
  if (V.lives.some((o) => o.hostId === a)) return;
  let r = { id: va("live"), hostId: a, title: t, where: e, startedAt: Date.now(), chat: [], viewers: 0 };
  (C((o) => ({ lives: [...o.lives.filter((n) => !(e === "plaza" && n.where === "plaza")), r] })),
    F(
      e === "plaza"
        ? "You are LIVE on the central stage! A crowd is gathering."
        : "You are LIVE from your home!",
    ),
    Ce(40, "Went live"));
}
function i8() {
  let t = V.session.userId;
  (C((e) => {
    let a = e.lives.filter((r) => r.hostId !== t);
    return (
      a.some((r) => r.where === "plaza") ||
        a.push({
          id: "live-leo",
          hostId: "u-leo",
          title: "Voice AI Q&A: building realtime agents live",
          where: "plaza",
          startedAt: Date.now(),
          chat: [],
          viewers: 9,
        }),
      { lives: a }
    );
  }),
    F("Live session ended.", "info"));
}
function Iv(t, e, a) {
  if (!e.trim()) return;
  let r = Bh(),
    o = {
      id: va("m"),
      name: a?.name || r?.name || "You",
      color: a?.color || r?.color || "#fff",
      text: e,
      at: Date.now(),
    };
  C((n) => ({ lives: n.lives.map((i) => (i.id === t ? { ...i, chat: [...i.chat.slice(-60), o] } : i)) }));
}
var tM = !1;
function s8() {
  if (tM) return;
  tM = !0;
  let t = ["#4da3ff", "#ff9a3c", "#ffc27a", "#7fd1ff", "#45e0ae", "#a8d8ff"];
  (setInterval(() => {
    V.session &&
      V.lives.forEach((e) => {
        if (e.hostId === V.session?.userId) return;
        let a = V2[Math.floor(Math.random() * V2.length)],
          r = e.hostId === V.session?.userId,
          o = r
            ? [
                "Hi! Audio is crystal clear",
                "Can you demo your agent?",
                "What does it cost?",
                "Wow, so good!",
                "Drop the link please",
                "Which model did you use?",
                "\u{1F525}\u{1F525}",
                "Love your avatar!",
              ]
            : Lw;
        (Math.random() < 0.7 &&
          Iv(e.id, o[Math.floor(Math.random() * o.length)], {
            name: a,
            color: t[Math.floor(Math.random() * t.length)],
          }),
          C((n) => ({
            lives: n.lives.map((i) =>
              i.id === e.id
                ? {
                    ...i,
                    viewers: Math.max(
                      1,
                      Math.min(240, i.viewers + Math.round((Math.random() - 0.3) * 4) + (r ? 1 : 0)),
                    ),
                  }
                : i,
            ),
          })));
      });
  }, 3200),
    setInterval(() => {
      return;
      if (!V.session) return;
      let e = V.affLinks.filter((i) => i.userId === V.session.userId);
      if (!e.length || Math.random() < 0.5) return;
      let a = e[Math.floor(Math.random() * e.length)],
        r =
          a.kind === "agent"
            ? V.agents.find((i) => i.id === a.itemId)
            : V.gigs.find((i) => i.id === a.itemId);
      if (!r) return;
      let o = Math.round((a.kind === "agent" ? r.price : r.packages[0].price) * r.commission) / 100,
        n = { ...V };
      (cr(n.session.userId, o, `Affiliate commission: ${r.name || "gig"}`, n),
        (n.affLinks = n.affLinks.map((i) =>
          i.id === a.id
            ? {
                ...i,
                clicks: i.clicks + 4,
                sales: i.sales + 1,
                earned: Math.round((i.earned + o) * 100) / 100,
              }
            : i,
        )),
        C({ wallets: n.wallets, txns: n.txns, affLinks: n.affLinks }),
        F(`${V2[Math.floor(Math.random() * V2.length)]} bought through your link: +${q(o)}`));
    }, 45e3));
}
function rd(t, e) {
  let a = e.trim(),
    r = a.length > 60 ? a.slice(0, 60) + "\u2026" : a;
  switch ((xo("demo"), t)) {
    case "research":
      return `Research brief: "${r}"
\u2022 3 key findings ready (demo)
\u2022 Sources: 5 papers, 2 industry reports
\u2022 Confidence: 82%
The full report arrives as a PDF after purchase.`;
    case "email":
      return `Inbox scan (demo): 14 new emails.
\u2022 3 urgent \u2192 replies drafted
\u2022 6 newsletters \u2192 archived
\u2022 Draft for you: "Thanks! I'll get back to you on ${r} by tomorrow."`;
    case "voice":
      return `\u{1F4DE} VoiceDesk (demo call): "Good afternoon, Fyrus Clinic. ${r}? Of course \u2014 we have a 3 PM slot tomorrow. Shall I book it?"`;
    case "prompt":
      return `Rewritten system prompt (demo):
"You are an expert assistant. Task: ${r}. Answer in 3 steps, state assumptions, ask one clarifying question if needed."
Eval score: 61% \u2192 88% (demo set of 50).`;
    case "vision":
      return `Shelf scan (demo image): 128 products detected.
\u2022 Stock-outs: 4 slots
\u2022 Price tag mismatches: 2
\u2022 Planogram compliance: 93%`;
    case "story":
      return `Storyboard (demo) for "${r}":
Shot 1 \u2014 Wide, neon city in the rain, 24mm
Shot 2 \u2014 Close-up, a glowing chip in the hero's hand
Shot 3 \u2014 Drone pull-back to the title card
Prompts ready for every shot.`;
    default:
      return `Agent reply (demo): finished working on "${r}". The real agent API unlocks after purchase.`;
  }
}
var eM = new Set();
function Dp(t, e) {
  (C({ productView: { brandId: t, productId: e } }), eM.has(t) || (eM.add(t), xo("store")));
}
function Fh(t, e) {
  let a = V.brands.find((i) => i.id === t),
    r = a.products.find((i) => i.id === e),
    o = V.session.userId;
  if ((V.wallets[o] || 0) < r.price) return F("Not enough balance. Top up from the Wallet.", "warn");
  let n = { ...V };
  (cr(o, -r.price, `Bought ${r.name} from ${a.name}`, n),
    (n.orders = [
      ...n.orders,
      {
        id: va("o"),
        buyerId: o,
        sellerId: a.ownerId || a.id,
        kind: "gig",
        itemId: r.id,
        amount: r.price,
        tier: "product",
        status: "active",
        at: Date.now(),
      },
    ]),
    a.ownerId && cr(a.ownerId, Math.round(r.price * 0.95 * 100) / 100, `Store sale: ${r.name}`, n),
    C({ wallets: n.wallets, txns: n.txns, orders: n.orders }),
    F(`Order placed: ${r.name}. ${a.name} will ship it (demo).`),
    Ce(30, "Shopping in Fyrus City"),
    Yh(`brand:${a.id}`, r.price));
}
function Uh(t) {
  C({ activeGame: t });
}
function l8(t, e, a) {
  let r = V.gameBest[t] || 0;
  (C((n) => ({ gameBest: { ...n.gameBest, [t]: Math.max(r, e) } })),
    EH(a ? 25 : 8),
    Ce(a ? 80 : 30, a ? "Arcade win!" : "Played an arcade game"),
    xo("game"),
    Yh(`game:${t}`, 0),
    e > r && r > 0 && F(`New personal best: ${e}!`, "xp"));
}
function $h(t) {
  V.votes.includes(t) ||
    (C((e) => ({ votes: [...e.votes, t] })), F("Vote counted. The most-voted games get built next."), Ce(5));
}
function J2(t) {
  (V.scene.mode !== "plaza" && Jr(),
    C({ vehicle: t, hud: { ...V.hud, open: !1 } }),
    t === "car"
      ? (F(
          "Flying car rented (free during launch). WASD to fly, Space up, C down, E to land and return it.",
          "info",
        ),
        xo("fly"),
        Ce(20))
      : F("Rocket launching! Hold on\u2026", "info"));
}
function _h() {
  (LH(), C({ vehicle: null }));
}
function LH() {
  try {
    Fv = "";
  } catch {}
}
function c8(t) {
  let e = { id: va("ad"), ...t, at: Date.now(), ownerId: V.session.userId };
  (C((a) => ({ ads: [...a.ads.filter((r) => r.spotId !== t.spotId), e] })),
    F("Your ad is live on the billboard. Free during launch!"),
    Ce(40, "Booked an ad"));
}
var Ev = (t) => {
    let e = 2166136261;
    for (let a = 0; a < t.length; a++) ((e ^= t.charCodeAt(a)), (e = Math.imul(e, 16777619)));
    return e >>> 0;
  },
  aM = ["geo", "display", "sans", "mono", "serif", "script"];
function CH(t) {
  let e = Qo(Ev(t)),
    a = Math.round(300 + e() * 18e3),
    r = Math.round(a * (0.02 + e() * 0.06));
  return {
    visits: a,
    purchases: r,
    revenue: Math.round(r * (20 + e() * 180)),
    history: Array.from({ length: 7 }, () => Math.round((a / 60) * (0.5 + e()))),
  };
}
function ri(t) {
  return V.shopStats[t] || CH(t);
}
function d8(t, e) {
  let a = ri(t),
    r = [...a.history];
  ((r[r.length - 1] += e.visits || 0),
    C((o) => ({
      shopStats: {
        ...o.shopStats,
        [t]: {
          visits: a.visits + (e.visits || 0),
          purchases: a.purchases + (e.purchases || 0),
          revenue: a.revenue + (e.revenue || 0),
          history: r,
        },
      },
    })));
}
function qa(t = V) {
  let e = [],
    a = (n) => t.shopSlots[n] || _w[n],
    r = (n, i) => {
      let s = Ev(n),
        l = zs[s % zs.length];
      return {
        ...{
          id: n,
          kind: "vacant",
          refId: "",
          row: "N",
          slot: 0,
          name: "",
          tagline: "",
          primary: l[0],
          secondary: l[1],
          facade: bi[(s >>> 3) % bi.length],
          font: aM[(s >>> 5) % aM.length],
          glyph: "",
          ...i,
        },
        ...(t.shopBrand[n] || {}),
      };
    },
    o = (n, i) => {
      let s = a(n);
      s && e.push(r(n, { ...i, row: s.row, slot: s.slot }));
    };
  (t.agents.forEach((n) =>
    o(`agent:${n.id}`, {
      kind: "agent",
      refId: n.id,
      name: n.name,
      tagline: n.tagline,
      glyph: n.name[0],
      ownerId: n.ownerId,
    }),
  ),
    t.gigs.forEach((n) => {
      let i = t.users.find((s) => s.id === n.ownerId);
      o(`service:${n.id}`, {
        kind: "service",
        refId: n.id,
        name: `${i?.name.split(" ")[0] || "Creator"}'s ${n.category}`,
        tagline: n.title.replace(/^I will /, "").replace(/^\w/, (s) => s.toUpperCase()),
        glyph: (i?.name || "S")[0],
        ownerId: n.ownerId,
      });
    }),
    t.brands.forEach((n) =>
      o(`brand:${n.id}`, {
        kind: "brand",
        refId: n.id,
        name: n.name,
        tagline: n.tagline,
        primary: n.color,
        secondary: n.accent,
        facade: n.facade || bi[Ev(n.id) % bi.length],
        font: n.font || "sans",
        glyph: n.name[0],
        ownerId: n.ownerId,
      }),
    ),
    tn.forEach((n) =>
      o(`game:${n.id}`, {
        kind: "game",
        refId: n.id,
        name: n.name,
        tagline: n.ready ? n.tag : "Coming soon \xB7 vote inside",
        primary: "#111827",
        secondary: n.color,
        font: "display",
        glyph: "\u25B6",
        ready: n.ready,
      }),
    ),
    o("cafe:orbit", {
      kind: "cafe",
      refId: "orbit",
      name: "Orbit Coffee",
      tagline: "Specialty coffee since 2031",
      primary: "#3b2a1e",
      secondary: "#f3e3c3",
      facade: "#e9d8b8",
      font: "script",
      glyph: "\u2615",
    }),
    o("cafe:noodle", {
      kind: "cafe",
      refId: "noodle",
      name: "Marina Noodle Bar",
      tagline: "Hand-pulled noodles \xB7 open late",
      primary: "#8b1e1e",
      secondary: "#f7e7c6",
      facade: "#f2c9b8",
      font: "display",
      glyph: "\u9EBA",
    }),
    o("dream:motors", {
      kind: "dream",
      refId: "motors",
      name: "Fyrus Motors",
      tagline: "Cars and flying cars \xB7 test drive today",
      primary: "#111111",
      secondary: "#e53935",
      facade: "#dfe3ea",
      font: "geo",
      glyph: "F",
    }),
    o("dream:realty", {
      kind: "dream",
      refId: "realty",
      name: "Skyline Realty",
      tagline: "Villas, penthouses and mansions",
      primary: "#0f2a4a",
      secondary: "#d6c29a",
      facade: "#efe6d6",
      font: "serif",
      glyph: "S",
    }),
    (t.sharedShops || []).forEach((n) => {
      let i = n.key;
      e.some((s) => s.id === i) ||
        !n.row ||
        e.push({
          id: i,
          kind: n.kind,
          refId: n.refId || i,
          row: n.row,
          slot: n.slot,
          name: n.name,
          tagline: n.tagline,
          primary: n.primary,
          secondary: n.secondary,
          facade: n.facade,
          font: n.font,
          glyph: (n.name || "S")[0],
          ownerId: n.ownerId,
          ownerName: n.ownerName,
          shared: !0,
          item: n.item,
        });
    }));
  for (let n of ["N", "S", "A", "B"])
    for (let i = 0; i < Vr.slots; i++)
      e.some((s) => s.row === n && s.slot === i) ||
        e.push(
          r(`vacant:${n}${i}`, {
            kind: "vacant",
            refId: `${n}${i}`,
            row: n,
            slot: i,
            name: "For rent",
            tagline: "Open your shop here",
            primary: "#ffffff",
            secondary: "#c0392b",
            facade: "#ece7dc",
            font: "sans",
            glyph: "+",
          }),
        );
  return (e.forEach((n) => (n.no = pv(n.row, n.slot))), e);
}
function Gv() {
  let t = qa().find((e) => e.kind === "vacant");
  return t ? { row: t.row, slot: t.slot } : null;
}
function Fp(t) {
  (C({
    scene: { mode: "shop", owner: t },
    nearby: null,
    vehicle: null,
    shopView: null,
    hud: { ...V.hud, open: !1 },
  }),
    d8(t, { visits: 1 }),
    xo("store"),
    Ce(5));
}
function Pl(t) {
  C({ shopView: t });
}
function h8() {
  (C({ scene: { mode: "club" }, nearby: null, vehicle: null }),
    F("Welcome to Skyline Club. Talk to DJ Lumen or Sam at the bar.", "info"),
    Ce(15, "Night out"));
}
function Yh(t, e) {
  d8(t, { purchases: 1, revenue: e });
}
function od(t) {
  (C({ waypoint: t }), t && F(`Waypoint set: ${t.name}`, "info"));
}
function Up(t) {
  C((e) => ({ settings: { ...e.settings, ...t } }));
}
function Qa(t) {
  let e = V.session.userId;
  C((a) => ({
    users: a.users.map((r) =>
      r.id === e
        ? {
            ...r,
            avatar: {
              ...(r.avatar || { acc: "none", trail: "none", board: "classic" }),
              outfit: { ...Vv, ...(r.avatar?.outfit || {}), ...t },
            },
          }
        : r,
    ),
  }));
}
var Vv = {
  skin: "#e0b593",
  hair: "long",
  hairColor: "#2a1a12",
  top: "#2f6fe0",
  bottom: "#2b303a",
  shoes: "#f2f2f2",
};
function Q2(t) {
  C({ talk: t });
}
function Pv() {
  C({ talk: null });
}
function nd(t, e) {
  C((a) => ({ shopBrand: { ...a.shopBrand, [t]: { ...(a.shopBrand[t] || {}), ...e } } }));
}
function u8(t) {
  let e = Gv();
  if (!e) return (F("The market is full right now. A new street opens soon!", "warn"), null);
  let a = V.session.userId,
    r = "";
  if (t.kind === "agent") {
    let o = {
      id: va("a"),
      ownerId: a,
      name: t.name,
      tagline: t.tagline,
      category: t.category,
      price: t.price,
      rating: 0,
      reviews: 0,
      sales: 0,
      commission: 25,
      persona: "research",
      skills: [t.category],
      createdAt: Date.now(),
    };
    (C((n) => ({ agents: [o, ...n.agents] })), (r = `agent:${o.id}`));
  } else if (t.kind === "service") {
    let o = {
      id: va("g"),
      ownerId: a,
      title: t.tagline.startsWith("I will")
        ? t.tagline
        : `I will ${t.tagline.charAt(0).toLowerCase()}${t.tagline.slice(1)}`,
      category: t.category,
      rating: 0,
      orders: 0,
      commission: 15,
      createdAt: Date.now(),
      packages: [
        { tier: "Basic", price: t.price, days: 3, features: ["Core delivery"] },
        {
          tier: "Standard",
          price: Math.round(t.price * 2.5),
          days: 5,
          features: ["Core delivery", "Revisions", "Source files"],
        },
        {
          tier: "Premium",
          price: Math.round(t.price * 6),
          days: 7,
          features: ["Everything", "Priority support"],
        },
      ],
    };
    (C((n) => ({ gigs: [o, ...n.gigs] })), (r = `service:${o.id}`));
  } else {
    let o = (bp[t.category] || bp.Fashion).map((i) => ({
      ...i,
      id: va("p"),
      color: t.secondary,
      accent: t.primary,
    }));
    t.image &&
      o.unshift({
        id: va("p"),
        name: "Featured product",
        price: t.price,
        kind: "bag",
        color: t.secondary,
        accent: t.primary,
        desc: "Uploaded by the brand.",
        image: t.image,
      });
    let n = {
      id: va("b"),
      name: t.name,
      tagline: t.tagline,
      category: t.category,
      color: t.primary,
      accent: t.secondary,
      style: "minimal",
      mallId: "",
      slot: 0,
      products: o,
      founding: V.brands.filter((i) => i.founding).length < 100,
      ownerId: a,
      rating: 5,
      visits: 0,
      createdAt: Date.now(),
      font: t.font,
      facade: t.facade,
    };
    (C((i) => ({ brands: [...i.brands, n] })), (r = `brand:${n.id}`));
  }
  return (
    C((o) => ({
      shopSlots: { ...o.shopSlots, [r]: e },
      shopBrand: {
        ...o.shopBrand,
        [r]: {
          name: t.name,
          tagline: t.tagline,
          primary: t.primary,
          secondary: t.secondary,
          facade: t.facade,
          font: t.font,
        },
      },
      shopStats: {
        ...o.shopStats,
        [r]: { visits: 0, purchases: 0, revenue: 0, history: [0, 0, 0, 0, 0, 0, 0] },
      },
    })),
    F(`${t.name} is open on Fyrus Market, shop ${pv(e.row, e.slot)}!`, "xp"),
    Ce(100, "Opened a shop"),
    r
  );
}
function $p(t, e, a) {
  let r = V.session.userId;
  if ((V.wallets[r] || 0) < a) return F("Not enough balance. Top up from the Wallet.", "warn");
  let o = { ...V };
  (cr(r, -a, `${e}`, o),
    C({ wallets: o.wallets, txns: o.txns }),
    Yh(t, a),
    F(`${e} \u2014 enjoy!`),
    Ce(10, "Treat yourself"));
}
function Ov(t) {
  let e = V.session.userId;
  C((a) => ({ users: a.users.map((r) => (r.id === e ? { ...r, ...t } : r)) }));
}
function p8() {
  try {
    localStorage.removeItem(Lv);
  } catch {}
  location.reload();
}
try {
  window.__fyrus = {
    getState: ot,
    setState: C,
    goInside: Jn,
    exitHome: Jr,
    openHomes: Vl,
    openPolitics: ai,
    openSvc: q2,
    openServices: ed,
  };
} catch {}
function id(t, e) {
  let a =
    t === "car"
      ? Xr.find((l) => l.id === e)
      : t === "home"
        ? Qn.find((l) => l.id === e)
        : fp.find((l) => l.id === e);
  if (!a) return;
  let r = V.dream;
  if ((t === "car" ? r.cars : t === "home" ? r.homes : r.life).includes(e))
    return F("You already own this.", "info");
  let n = V.session.userId;
  if ((V.wallets[n] || 0) < a.price)
    return F(
      `You need ${q(a.price)}. Earn more by selling, playing and quests, or top up the demo wallet.`,
      "warn",
    );
  let i = { ...V };
  cr(n, -a.price, `Dream Life: ${a.name}`, i);
  let s = {
    ...r,
    cars: t === "car" ? [...r.cars, e] : r.cars,
    homes: t === "home" ? [...r.homes, e] : r.homes,
    life: t === "life" ? [...r.life, e] : r.life,
  };
  (C({ wallets: i.wallets, txns: i.txns, dream: s }),
    t === "car" && tu(e),
    t === "home" && eu(e),
    Yh(t === "home" ? "dream:realty" : "dream:motors", a.price),
    F(`${a.name} is yours!`, "xp"),
    Ce(150, "Dream Life"));
}
function tu(t) {
  V.dream.cars.includes(t) && C((e) => ({ dream: { ...e.dream, car: t } }));
}
function eu(t) {
  let e = Qn.find((a) => a.id === t);
  !e ||
    !V.dream.homes.includes(t) ||
    (C((a) => ({ dream: { ...a.dream, home: t } })),
    wi({ style: e.style, floors: e.floors, garden: e.garden, theme: e.theme }));
}
function Vs() {
  V.scene.mode !== "plaza" && Jr();
  let t = Xr.find((e) => e.id === V.dream.car) || Xr[0];
  (C({ vehicle: t.fly ? "car" : "drive", hud: { ...V.hud, open: !1 } }),
    Xc(t.fly ? "fly" : "drive"),
    F(
      t.fly
        ? `${t.name}: W/S drive, A/D steer, Space to fly up, C down, E to park.`
        : `${t.name}: W/S drive, A/D steer, Space brake, E to park.`,
      "info",
    ));
}
function Dv(t) {
  C({ photo: t });
}
function g8(t) {
  (C((e) => ({ aiCustom: [t, ...e.aiCustom] })), F(`${t.name} is now living in Fyrus City.`, "xp"), Ce(40));
}
function f8(t) {
  C({ inspect: t });
}
function Ol() {
  C({ inspect: null });
}
var Fv = "";
function _p(t) {
  ((Fv = t), C({ inspect: null, scene: { mode: "plaza" } }), setTimeout(Vs, 50));
}
function m8() {
  return Fv;
}
var Zi = () => (V.session ? V.passports[V.session.userId] : void 0),
  oi = (t) => !!t && t.kind !== "visa",
  Ki = () => oi(Zi()),
  Yp = 1e4,
  Nh = () => U2 + Object.values(V.passports).filter(oi).length;
function Uv() {
  let t = V.session?.userId || "",
    e = Tr(V.game.xp),
    a = Ya.some((i) => Za()[i.id]?.owner === t),
    r =
      V.agents.some((i) => i.ownerId === t) ||
      V.gigs.some((i) => i.ownerId === t) ||
      V.videos.some((i) => i.ownerId === t) ||
      !!V.eduMine?.teaching?.length,
    o = [
      {
        id: "level",
        label: "Reach level 5",
        done: e >= 5,
        hint: `You are level ${e}. Quests, orbs, games and sales give XP.`,
      },
      { id: "land", label: "Own land in Fyrus", done: a, hint: "Buy a plot in your home city." },
      {
        id: "creator",
        label: "Sell something",
        done: r,
        hint: "Open a shop, list an AI agent or a gig, post a video, or publish a course.",
      },
    ],
    n = !V.cases.some((i) => i.against === t && i.status !== "Resolved");
  return {
    items: o,
    clean: n,
    count: o.filter((i) => i.done).length,
    ready: !!Zi() && n && o.filter((i) => i.done).length >= 2 && Nh() < Yp,
  };
}
var Dl = (t) => (oi(t) ? qp(t.passportNo ?? t.no) : `FV-${String(t.no).padStart(6, "0")}`),
  qp = (t) => `FY-${String(t).padStart(6, "0")}`;
function Fl(t, e) {
  C((a) => ({ nationTab: t, landFocus: e ?? a.landFocus, hud: { open: !0, tab: "nation" } }));
}
function v8(t) {
  let e = V.session?.userId;
  if (!e) return;
  if (V.passports[e]) return F("You already hold a Fyrus visa.", "info");
  let a = 1e4 + Object.keys(V.passports).length + 1,
    r = Bh()?.name || "Citizen",
    o = { ...V };
  (cr(e, 2500, "Welcome grant from the Central Bank", o),
    C({
      passports: { ...V.passports, [e]: { no: a, interest: t, issuedAt: Date.now(), name: r, kind: "visa" } },
      wallets: o.wallets,
      txns: o.txns,
      shareCard: { kind: "passport", id: e },
    }),
    F(`Welcome to Fyrus! Visa FV-${String(a).padStart(6, "0")} issued and 2,500 FYC added.`, "ok"),
    O.send({ t: "profile", passport: { no: a, interest: t, kind: "visa" } }),
    Ce(100, "Arrived in Fyrus"));
}
function x8() {
  let t = V.session?.userId,
    e = Zi();
  if (!t || !e) return F("Get your free visa first.", "warn");
  if (oi(e)) return F("You already hold a Fyrus passport.", "info");
  if (!Uv().ready)
    return F(
      Nh() >= Yp
        ? "All passports for this year are issued. You are on the waiting list."
        : "Complete two milestones with a clean record to qualify.",
      "warn",
    );
  let r = Nh() + 1;
  (C({
    passports: { ...V.passports, [t]: { ...e, kind: "passport", passportNo: r, passportAt: Date.now() } },
    shareCard: { kind: "passport", id: t },
  }),
    F(`Congratulations! Fyrus passport ${qp(r)} granted. You can vote and you pay no transfer tax.`, "ok"),
    O.send({
      t: "profile",
      passport: { no: r, interest: e.interest, kind: "passport", level: Tr(V.game.xp) },
    }),
    Ce(250, "Fyrus passport"));
}
function Rh(t, e = V.plots) {
  let a = Ya.filter((r) => r.district === t.district && e[r.id]).length;
  return Math.round((t.price * (1 + 0.04 * a)) / 100) * 100;
}
function Zp(t) {
  let e = Zi();
  if (!e) return { ok: !1, why: "Get your free visa first." };
  let a = qi(t);
  return a.interest === "all"
    ? oi(e)
      ? { ok: !0, why: "" }
      : { ok: !1, why: "Capital Quarter land is for Fyrus passport holders." }
    : a.interest === e.interest
      ? { ok: !0, why: "" }
      : {
          ok: !1,
          why: `Plots here are for ${Wl.find((r) => r.id === a.interest).label} citizens. Your city is ${Il(e.interest).name}.`,
        };
}
function y8(t) {
  let e = V.session?.userId,
    a = Ws(t);
  if (!e || !a) return;
  let r = Zp(a.district);
  if (!r.ok) return F(r.why, "warn");
  let o = Za()[a.id];
  if (o?.owner === e) return F("You already own this plot.", "info");
  let n = o ? o.forSale : a.price;
  if (n == null) return F("This plot is not for sale.", "warn");
  let i = Ki() ? 0 : Math.round(n * Yc),
    s = n + i;
  if ((V.wallets[e] || 0) < s)
    return F(
      `You need ${q(s)} (price + transfer tax, passport holders pay none). Buy FYC at the Central Bank.`,
      "warn",
    );
  let l = { ...V };
  (cr(e, -s, `Plot ${a.id} in ${qi(a.district).name} (incl. ${q(i)} tax)`, l),
    o && l.wallets[o.owner] != null && cr(o.owner, n, `Sold plot ${a.id}`, l));
  let c = {
    ...V.plots,
    [a.id]: {
      owner: e,
      ownerName: Bh()?.name || "You",
      boughtAt: Date.now(),
      paid: n,
      use: void 0,
      sign: void 0,
      forSale: void 0,
    },
  };
  (C({
    wallets: l.wallets,
    txns: l.txns,
    plots: c,
    treasury: V.treasury + i,
    shareCard: { kind: "plot", id: a.id },
  }),
    O.send({ t: "plot", id: a.id, buy: !!o?.forSale }),
    F(`Plot ${a.id} is yours. The deed is in your passport.`, "ok"),
    Ce(150, "Land owner"));
}
function k8(t, e, a) {
  let r = V.plots[t];
  if (!r || r.owner !== V.session?.userId) return;
  let o = { ...r, use: e, sign: a.trim().slice(0, 28) || e };
  (C({ plots: { ...V.plots, [t]: o } }),
    F(`${e} built on ${t}.`, "ok"),
    O.send({ t: "plot", id: t, use: o.use, sign: o.sign, forSale: o.forSale }));
}
function $v(t, e) {
  let a = V.plots[t];
  if (!a || a.owner !== V.session?.userId) return;
  let r = { ...a, forSale: e && e > 0 ? Math.round(e) : void 0 };
  (C({ plots: { ...V.plots, [t]: r } }),
    O.send({ t: "plot", id: t, use: r.use, sign: r.sign, forSale: r.forSale }),
    F(e ? `Plot ${t} listed for ${q(Math.round(e))}.` : `Plot ${t} taken off the market.`, "info"));
}
function b8(t) {
  let e = V.session?.userId,
    a = Ws(t),
    r = V.plots[t];
  if (!e || !a || r?.owner !== e) return;
  let o = Math.round(Rh(a) * 0.9),
    n = { ...V };
  cr(e, o, `Sold plot ${a.id} to the Land Bank (90% of value)`, n);
  let i = { ...V.plots };
  (delete i[t],
    C({ wallets: n.wallets, txns: n.txns, plots: i }),
    F(`Land Bank paid ${q(o)} for ${a.id}.`, "ok"),
    O.send({ t: "plot", id: t, release: !0 }));
}
var w8 = () => Ya.filter((t) => V.plots[t.id]?.owner === V.session?.userId);
function _v() {
  let t = (n) => Ya.filter((i) => V.plots[i.id]?.owner === n),
    e = Lh.map((n) => {
      let i = t(n.id),
        s = i.reduce((l, c) => l + Rh(c), 0);
      return {
        id: n.id,
        name: n.name,
        color: n.color,
        fyc: n.fyc,
        land: s,
        worth: n.fyc + s,
        plots: i.length,
        isMe: !1,
        passport: n.passport,
      };
    }),
    a = Zi(),
    r = V.session?.userId;
  if (a && oi(a) && r) {
    let n = t(r),
      i = n.reduce((l, c) => l + Rh(c), 0),
      s = V.wallets[r] || 0;
    e.push({
      id: r,
      name: a.name,
      color: Bh()?.color || "#4da3ff",
      fyc: s,
      land: i,
      worth: s + i,
      plots: n.length,
      isMe: !0,
      passport: a.passportNo ?? a.no,
    });
  }
  let o = new Set(V.cases.filter((n) => n.status === "Resolved").map((n) => n.against));
  return e
    .filter((n) => !o.has(n.id))
    .sort((n, i) => i.worth - n.worth)
    .slice(0, 10);
}
function au(t = Gl()) {
  let e = _v(),
    a = V.myVotes[t];
  return e
    .map((r, o) => ({ ...r, votes: Kw(t, r.id, o) + (a === r.id ? 1 : 0) }))
    .sort((r, o) => o.votes - r.votes)
    .map((r, o) => ({ ...r, ministry: Zw[o] }));
}
function Kp() {
  return au(Gl() - 1);
}
function M8(t) {
  if (!Ki()) return F("Only Fyrus passport holders can vote. Visa holders can earn a passport.", "warn");
  let e = Gl();
  if (V.myVotes[e]) return F("You already voted this week. One citizen, one vote.", "info");
  (C({ myVotes: { ...V.myVotes, [e]: t } }),
    F("Vote cast. Results update live until the term ends.", "ok"),
    Ce(40, "Voted"));
}
function E8(t, e, a) {
  if (!Zi()) return F("Only citizens can file a case.", "warn");
  if (e.trim().length < 10) return F("Please describe what happened (at least 10 characters).", "warn");
  (C({
    cases: [
      {
        id: va("case"),
        against: t.trim() || "Unknown",
        reason: e.trim().slice(0, 400),
        orderId: a,
        status: "Under review",
        at: Date.now(),
      },
      ...V.cases,
    ],
  }),
    F("Case filed. The Justice ministry reviews it within 48 hours. Escrow stays frozen until then.", "ok"));
}
function L8(t) {
  let e = { ...V };
  (cr(V.session.userId, t, "Bought FYC (demo checkout, no real payment)", e),
    C({ wallets: e.wallets, txns: e.txns }),
    F(`${q(t)} added by the Central Bank.`, "ok"));
}
var C8 = () => ({
  citizens: Nh(),
  owned: Ya.filter((t) => Za()[t.id]).length,
  plots: Ya.length,
  districts: Hr.length,
});
function Za(t = V) {
  let e = { ...t.plots },
    a = t.net.id;
  return (
    Object.entries(t.sharedPlots || {}).forEach(([r, o]) => {
      if (o.owner === a) {
        e[r] && (e[r] = { ...e[r], use: o.use ?? e[r].use, sign: o.sign ?? e[r].sign });
        return;
      }
      e[r] = {
        owner: "net:" + o.owner,
        ownerName: o.ownerName,
        boughtAt: o.at,
        paid: 0,
        use: o.use,
        sign: o.sign,
        forSale: o.forSale,
      };
    }),
    e
  );
}
var ur = P(Zt(), 1);
var qh = P(Zt(), 1);
var Yv = P(Zt(), 1),
  qv = { color: void 0, size: void 0, className: void 0, style: void 0, attr: void 0 },
  Zv = Yv.default.createContext && Yv.default.createContext(qv);
var TH = ["attr", "size", "title"];
function SH(t, e) {
  if (t == null) return {};
  var a,
    r,
    o = HH(t, e);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(t);
    for (r = 0; r < n.length; r++)
      ((a = n[r]), e.indexOf(a) === -1 && {}.propertyIsEnumerable.call(t, a) && (o[a] = t[a]));
  }
  return o;
}
function HH(t, e) {
  if (t == null) return {};
  var a = {};
  for (var r in t)
    if ({}.hasOwnProperty.call(t, r)) {
      if (e.indexOf(r) !== -1) continue;
      a[r] = t[r];
    }
  return a;
}
function Xp() {
  return (
    (Xp = Object.assign
      ? Object.assign.bind()
      : function (t) {
          for (var e = 1; e < arguments.length; e++) {
            var a = arguments[e];
            for (var r in a) ({}).hasOwnProperty.call(a, r) && (t[r] = a[r]);
          }
          return t;
        }),
    Xp.apply(null, arguments)
  );
}
function T8(t, e) {
  var a = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    (e &&
      (r = r.filter(function (o) {
        return Object.getOwnPropertyDescriptor(t, o).enumerable;
      })),
      a.push.apply(a, r));
  }
  return a;
}
function Jp(t) {
  for (var e = 1; e < arguments.length; e++) {
    var a = arguments[e] != null ? arguments[e] : {};
    e % 2
      ? T8(Object(a), !0).forEach(function (r) {
          NH(t, r, a[r]);
        })
      : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(a))
        : T8(Object(a)).forEach(function (r) {
            Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(a, r));
          });
  }
  return t;
}
function NH(t, e, a) {
  return (
    (e = RH(e)) in t
      ? Object.defineProperty(t, e, { value: a, enumerable: !0, configurable: !0, writable: !0 })
      : (t[e] = a),
    t
  );
}
function RH(t) {
  var e = BH(t, "string");
  return typeof e == "symbol" ? e : e + "";
}
function BH(t, e) {
  if (typeof t != "object" || !t) return t;
  var a = t[Symbol.toPrimitive];
  if (a !== void 0) {
    var r = a.call(t, e || "default");
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function S8(t) {
  return t && t.map((e, a) => qh.default.createElement(e.tag, Jp({ key: a }, e.attr), S8(e.child)));
}
function at(t) {
  return (e) => qh.default.createElement(AH, Xp({ attr: Jp({}, t.attr) }, e), S8(t.child));
}
function AH(t) {
  var e = (a) => {
    var r = t.attr,
      o = t.size,
      n = t.title,
      i = SH(t, TH),
      s = o || a.size || "1em",
      l;
    return (
      a.className && (l = a.className),
      t.className && (l = (l ? l + " " : "") + t.className),
      qh.default.createElement(
        "svg",
        Xp({ stroke: "currentColor", fill: "currentColor", strokeWidth: "0" }, a.attr, r, i, {
          className: l,
          style: Jp(Jp({ color: t.color || a.color }, a.style), t.style),
          height: s,
          width: s,
          xmlns: "http://www.w3.org/2000/svg",
        }),
        n && qh.default.createElement("title", null, n),
        t.children,
      )
    );
  };
  return Zv !== void 0 ? qh.default.createElement(Zv.Consumer, null, (a) => e(a)) : e(qv);
}
function H8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        },
        child: [],
      },
    ],
  })(t);
}
function pe(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M18 6 6 18" }, child: [] },
      { tag: "path", attr: { d: "m6 6 12 12" }, child: [] },
    ],
  })(t);
}
function N8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
        },
        child: [],
      },
    ],
  })(t);
}
function Qp(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: { d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
        child: [],
      },
      {
        tag: "path",
        attr: {
          d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1",
        },
        child: [],
      },
    ],
  })(t);
}
function R8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",
        },
        child: [],
      },
      { tag: "path", attr: { d: "m14 7 3 3" }, child: [] },
      { tag: "path", attr: { d: "M5 6v4" }, child: [] },
      { tag: "path", attr: { d: "M19 14v4" }, child: [] },
      { tag: "path", attr: { d: "M10 2v2" }, child: [] },
      { tag: "path", attr: { d: "M7 8H3" }, child: [] },
      { tag: "path", attr: { d: "M21 16h-4" }, child: [] },
      { tag: "path", attr: { d: "M11 3H9" }, child: [] },
    ],
  })(t);
}
function ru(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
        },
        child: [],
      },
      { tag: "path", attr: { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }, child: [] },
    ],
  })(t);
}
function Xi(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "m9 12 2 2 4-4" }, child: [] },
      { tag: "path", attr: { d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" }, child: [] },
      { tag: "path", attr: { d: "M22 19H2" }, child: [] },
    ],
  })(t);
}
function sd(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
        child: [],
      },
      { tag: "line", attr: { x1: "22", x2: "16", y1: "9", y2: "15" }, child: [] },
      { tag: "line", attr: { x1: "16", x2: "22", y1: "9", y2: "15" }, child: [] },
    ],
  })(t);
}
function tg(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: {
          d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
        },
        child: [],
      },
      { tag: "path", attr: { d: "M16 9a5 5 0 0 1 0 6" }, child: [] },
      { tag: "path", attr: { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }, child: [] },
    ],
  })(t);
}
function Ps(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      {
        tag: "path",
        attr: { d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" },
        child: [],
      },
      { tag: "rect", attr: { x: "2", y: "6", width: "14", height: "12", rx: "2" }, child: [] },
    ],
  })(t);
}
function B8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M18 11c-1.5 0-2.5.5-3 2" }, child: [] },
      {
        tag: "path",
        attr: {
          d: "M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z",
        },
        child: [],
      },
      { tag: "path", attr: { d: "M6 11c1.5 0 2.5.5 3 2" }, child: [] },
    ],
  })(t);
}
function $e(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, child: [] },
      { tag: "circle", attr: { cx: "9", cy: "7", r: "4" }, child: [] },
      { tag: "path", attr: { d: "M22 21v-2a4 4 0 0 0-3-3.87" }, child: [] },
      { tag: "path", attr: { d: "M16 3.13a4 4 0 0 1 0 7.75" }, child: [] },
    ],
  })(t);
}
function Ul(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }, child: [] },
      { tag: "circle", attr: { cx: "12", cy: "7", r: "4" }, child: [] },
    ],
  })(t);
}
function A8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "circle", attr: { cx: "12", cy: "8", r: "5" }, child: [] },
      { tag: "path", attr: { d: "M20 21a8 8 0 0 0-16 0" }, child: [] },
    ],
  })(t);
}
function Os(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, child: [] },
      { tag: "circle", attr: { cx: "9", cy: "7", r: "4" }, child: [] },
      { tag: "line", attr: { x1: "19", x2: "19", y1: "8", y2: "14" }, child: [] },
      { tag: "line", attr: { x1: "22", x2: "16", y1: "11", y2: "11" }, child: [] },
    ],
  })(t);
}
function z8(t) {
  return at({
    tag: "svg",
    attr: {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    child: [
      { tag: "path", attr: { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, child: [] },
      { tag: "circle", attr: { cx: "9", cy: "7", r: "4" }, child: [] },
      { tag: "polyline", attr: { points: "16 11 18 13 22 9" }, child: [] },
    ],
  })(t);
}
