function gy() {
  let t = Y(),
    e = t.session.userId,
    a = be(e),
    r = t.homeSlots[e] || [],
    [o, n] = (0, py.useState)("agent"),
    [i, s] = (0, py.useState)(a.home.sign || ""),
    l = Tr(t.game.xp),
    d = (
      o === "agent"
        ? t.agents.map((m) => ({ id: m.id, t: m.name, mine: m.ownerId === e }))
        : o === "gig"
          ? t.gigs.map((m) => ({ id: m.id, t: m.title, mine: m.ownerId === e }))
          : o === "video"
            ? t.videos.map((m) => ({ id: m.id, t: m.title, mine: m.ownerId === e }))
            : t.articles
                .filter((m) => m.kind !== "question")
                .map((m) => ({ id: m.id, t: m.title, mine: m.ownerId === e }))
    )
      .filter((m) => !r.some((f) => f.itemId === m.id))
      .sort((m, f) => Number(f.mine) - Number(m.mine)),
    h = (m, f) => {
      let y = [...r],
        x = m + f;
      x < 0 || x >= y.length || (([y[m], y[x]] = [y[x], y[m]]), Dh(y));
    },
    u = (m) =>
      Dh(
        o === "video"
          ? [...r.filter((f) => f.kind !== "video"), { kind: o, itemId: m }]
          : [...r, { kind: o, itemId: m }],
      ),
    p = t.scene.mode === "home" && t.scene.owner === e,
    v = Tp.filter((m) => m.slot === "style"),
    g = () => {
      (t.scene.mode !== "plaza" && C({ scene: { mode: "plaza" } }),
        _t()?.teleport("home"),
        ca(),
        setTimeout(() => C({ showcase: !0 }), 60));
    };
  return (0, Mt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, Mt.jsxs)("div", {
        className: "card holo-edge p-4 flex items-center gap-3 flex-wrap",
        children: [
          (0, Mt.jsx)("div", {
            className: "w-12 h-12 rounded-2xl grid place-items-center text-2xl font-display",
            style: { background: a.home.theme, color: "#06122e" },
            children: Z7[a.home.style],
          }),
          (0, Mt.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, Mt.jsx)("div", { className: "font-display font-bold", children: "My 4D home" }),
              (0, Mt.jsxs)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children: [
                  "Plot at ",
                  a.home.x,
                  ", ",
                  a.home.z,
                  " \xB7 ",
                  a.home.style,
                  " \xB7 ",
                  a.home.floors,
                  " floors",
                ],
              }),
            ],
          }),
          (0, Mt.jsxs)("button", {
            className: "btn btn-ember btn-sm",
            onClick: g,
            children: [(0, Mt.jsx)(iE, {}), " 4D showcase"],
          }),
          !p &&
            (0, Mt.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => {
                (yo(e), ca());
              },
              children: [(0, Mt.jsx)(Wo, {}), " Go inside"],
            }),
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "rounded-xl p-3 text-xs flex gap-2",
        style: {
          background: "rgba(255,154,60,.08)",
          border: "1px solid rgba(255,154,60,.25)",
          color: "var(--ember-hi)",
        },
        children: [
          (0, Mt.jsx)(da, { className: "shrink-0 mt-0.5" }),
          ' Want a new location? Find an orange "Free plot" anywhere in the endless city, stand on it and press E to move your home there.',
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "card p-4 space-y-4",
        children: [
          (0, Mt.jsx)(Te, { kicker: "Exterior", title: "Architecture" }),
          (0, Mt.jsx)("div", {
            className: "grid grid-cols-3 gap-2",
            children: v.map((m) => {
              let f = t.game.owned.includes(m.id),
                y = a.home.style === m.value,
                x = !f;
              return (0, Mt.jsxs)(
                "button",
                {
                  onClick: () => (f ? wi({ style: m.value }) : C({ hud: { open: !0, tab: "shop" } })),
                  className: `card p-3 text-left relative ${y ? "chip-on" : ""}`,
                  style: x ? { opacity: 0.65 } : {},
                  children: [
                    (0, Mt.jsx)("div", { className: "font-display text-2xl", children: Z7[m.value] }),
                    (0, Mt.jsx)("div", { className: "text-xs font-bold mt-1", children: m.name }),
                    x &&
                      (0, Mt.jsxs)("div", {
                        className: "text-[10px] flex items-center gap-1 mt-0.5",
                        style: { color: "var(--ember-hi)" },
                        children: [
                          (0, Mt.jsx)(Pr, {}),
                          " ",
                          l < m.level ? `Level ${m.level}` : `${m.cost} orbs`,
                        ],
                      }),
                  ],
                },
                m.id,
              );
            }),
          }),
          (0, Mt.jsxs)("div", {
            children: [
              (0, Mt.jsxs)("label", {
                className: "label",
                htmlFor: "b-floors",
                children: ["Floors \xB7 ", a.home.floors],
              }),
              (0, Mt.jsx)("input", {
                id: "b-floors",
                type: "range",
                min: 1,
                max: Math.min(12, 3 + l),
                value: a.home.floors,
                onChange: (m) => wi({ floors: Number(m.target.value) }),
                className: "w-full accent-[#4da3ff]",
              }),
              (0, Mt.jsx)("div", {
                className: "text-[11px]",
                style: { color: "var(--ink-dim)" },
                children: "Each level unlocks another floor (max 12).",
              }),
            ],
          }),
          (0, Mt.jsxs)("div", {
            children: [
              (0, Mt.jsx)("div", { className: "label", children: "Main light" }),
              (0, Mt.jsx)("div", {
                className: "flex gap-2 flex-wrap",
                children: q7.map((m) =>
                  (0, Mt.jsx)(
                    "button",
                    {
                      "aria-label": `Main color ${m}`,
                      onClick: () => wi({ theme: m }),
                      className: "w-9 h-9 rounded-xl",
                      style: {
                        background: m,
                        outline: a.home.theme === m ? "2px solid #fff" : "none",
                        outlineOffset: 2,
                        boxShadow: `0 0 18px ${m}66`,
                      },
                    },
                    m,
                  ),
                ),
              }),
            ],
          }),
          (0, Mt.jsxs)("div", {
            children: [
              (0, Mt.jsx)("div", { className: "label", children: "Accent light" }),
              (0, Mt.jsx)("div", {
                className: "flex gap-2 flex-wrap",
                children: q7.map((m) =>
                  (0, Mt.jsx)(
                    "button",
                    {
                      "aria-label": `Accent color ${m}`,
                      onClick: () => wi({ accent: m }),
                      className: "w-7 h-7 rounded-lg",
                      style: {
                        background: m,
                        outline: a.home.accent === m ? "2px solid #fff" : "none",
                        outlineOffset: 2,
                      },
                    },
                    m,
                  ),
                ),
              }),
            ],
          }),
          (0, Mt.jsxs)("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              (0, Mt.jsxs)("div", {
                children: [
                  (0, Mt.jsxs)("label", {
                    className: "label",
                    htmlFor: "b-garden",
                    children: ["Garden \xB7 ", a.home.garden, " trees"],
                  }),
                  (0, Mt.jsx)("input", {
                    id: "b-garden",
                    type: "range",
                    min: 0,
                    max: 6,
                    value: a.home.garden,
                    onChange: (m) => wi({ garden: Number(m.target.value) }),
                    className: "w-full accent-[#ff9a3c]",
                  }),
                ],
              }),
              (0, Mt.jsxs)("div", {
                children: [
                  (0, Mt.jsx)("label", { className: "label", htmlFor: "b-sign", children: "Door sign" }),
                  (0, Mt.jsxs)("form", {
                    className: "flex gap-1.5",
                    onSubmit: (m) => {
                      (m.preventDefault(), wi({ sign: i.slice(0, 22) }));
                    },
                    children: [
                      (0, Mt.jsx)("input", {
                        id: "b-sign",
                        className: "field py-1.5 text-sm",
                        value: i,
                        maxLength: 22,
                        onChange: (m) => s(m.target.value),
                        placeholder: "Open studio",
                      }),
                      (0, Mt.jsx)("button", { className: "btn btn-ghost btn-sm", children: "Set" }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "card p-4 space-y-3",
        children: [
          (0, Mt.jsx)(Te, { kicker: "Interior", title: "Floor and decor" }),
          (0, Mt.jsx)("div", {
            className: "flex gap-2",
            children: ["glass", "grid", "marble"].map((m) =>
              (0, Mt.jsx)(
                "button",
                {
                  onClick: () => wi({ floor: m }),
                  className: `chip ${a.home.floor === m ? "chip-on" : ""}`,
                  children: m === "glass" ? "Mirror glass" : m === "grid" ? "Holo grid" : "Neon marble",
                },
                m,
              ),
            ),
          }),
          (0, Mt.jsx)("div", {
            className: "grid grid-cols-3 gap-2",
            children: Sp.map((m) =>
              (0, Mt.jsxs)(
                "button",
                {
                  className: "card card-hover p-2.5 text-left",
                  onClick: () => fM(m.id),
                  children: [
                    (0, Mt.jsx)(Jh, { style: { color: "var(--sky)" } }),
                    (0, Mt.jsx)("div", { className: "text-xs font-bold mt-1", children: m.name }),
                    (0, Mt.jsxs)("div", {
                      className: "text-[11px] flex items-center gap-1",
                      style: { color: "var(--ink-dim)" },
                      children: [
                        (0, Mt.jsx)("span", { className: "orb-icon", style: { width: 10, height: 10 } }),
                        " ",
                        m.cost,
                      ],
                    }),
                  ],
                },
                m.id,
              ),
            ),
          }),
          (0, Mt.jsxs)("div", {
            className: "text-xs",
            style: { color: "var(--ink-dim)" },
            children: [
              "Placed: ",
              (t.decor[e] || []).map((m) => Sp.find((f) => f.id === m)?.name).join(", ") || "nothing yet",
            ],
          }),
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Mt.jsx)(Te, { kicker: `${r.length} items`, title: "On display inside" }),
          (0, Mt.jsx)("div", {
            className: "space-y-1.5",
            children: r.map((m, f) => {
              let y = GR[m.kind],
                x =
                  m.kind === "agent"
                    ? t.agents.find((b) => b.id === m.itemId)
                    : m.kind === "gig"
                      ? t.gigs.find((b) => b.id === m.itemId)
                      : null,
                k = x && x.ownerId !== e;
              return (0, Mt.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 rounded-xl p-2 text-sm",
                  style: { background: "rgba(255,255,255,.04)" },
                  children: [
                    (0, Mt.jsx)(y, { className: "shrink-0", style: { color: "var(--sky)" } }),
                    (0, Mt.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, Mt.jsx)("div", {
                          className: "truncate font-bold",
                          children: lM(m.kind, m.itemId),
                        }),
                        (0, Mt.jsxs)("div", {
                          className: "text-[11px]",
                          style: { color: "var(--ink-dim)" },
                          children: [VR[m.kind], k ? " \xB7 affiliate pick" : ""],
                        }),
                      ],
                    }),
                    (0, Mt.jsx)("button", {
                      className: "btn btn-ghost btn-sm px-2",
                      onClick: () => h(f, -1),
                      "aria-label": "Move up",
                      children: (0, Mt.jsx)(Ti, {}),
                    }),
                    (0, Mt.jsx)("button", {
                      className: "btn btn-ghost btn-sm px-2",
                      onClick: () => h(f, 1),
                      "aria-label": "Move down",
                      children: (0, Mt.jsx)(hd, {}),
                    }),
                    (0, Mt.jsx)("button", {
                      className: "btn btn-ghost btn-sm px-2",
                      onClick: () => Dh(r.filter((b, w) => w !== f)),
                      "aria-label": "Remove",
                      children: (0, Mt.jsx)(_l, {}),
                    }),
                  ],
                },
                m.itemId,
              );
            }),
          }),
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Mt.jsx)(Te, { kicker: "Add", title: "Put something on display" }),
          (0, Mt.jsx)("div", {
            className: "flex gap-1.5 flex-wrap mb-3",
            children: ["agent", "gig", "video", "article"].map((m) =>
              (0, Mt.jsx)(
                "button",
                {
                  className: `chip ${o === m ? "chip-on" : ""}`,
                  onClick: () => n(m),
                  children:
                    m === "agent"
                      ? "AI agents"
                      : m === "gig"
                        ? "Gigs"
                        : m === "video"
                          ? "Videos"
                          : "Articles",
                },
                m,
              ),
            ),
          }),
          (0, Mt.jsxs)("div", {
            className: "space-y-1 max-h-60 scroll-y",
            children: [
              d.map((m) =>
                (0, Mt.jsxs)(
                  "div",
                  {
                    className: "flex items-center gap-2 py-1.5 text-sm",
                    style: { borderTop: "1px solid var(--line)" },
                    children: [
                      (0, Mt.jsx)("div", { className: "truncate flex-1", children: m.t }),
                      (0, Mt.jsx)("span", {
                        className: "chip",
                        style: { color: m.mine ? "var(--sky)" : "var(--ember-hi)" },
                        children: m.mine ? "mine" : "affiliate",
                      }),
                      (0, Mt.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => u(m.id),
                        "aria-label": "Add",
                        children: (0, Mt.jsx)(Na, {}),
                      }),
                    ],
                  },
                  m.id,
                ),
              ),
              d.length === 0 &&
                (0, Mt.jsx)("p", {
                  className: "text-sm",
                  style: { color: "var(--ink-dim)" },
                  children: "Everything in this category is already on display.",
                }),
            ],
          }),
        ],
      }),
      (0, Mt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Mt.jsx)(Te, { kicker: "Neighbours", title: "Visit other homes" }),
          (0, Mt.jsx)("div", {
            className: "grid grid-cols-2 gap-2",
            children: t.users
              .filter((m) => m.id !== e && !m.procedural)
              .map((m) =>
                (0, Mt.jsxs)(
                  "button",
                  {
                    className: "card card-hover p-2.5 flex items-center gap-2 text-left",
                    onClick: () => {
                      (yo(m.id), ca());
                    },
                    children: [
                      (0, Mt.jsx)(Dr, { user: m, size: 28 }),
                      (0, Mt.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                          (0, Mt.jsx)("div", { className: "text-sm font-bold truncate", children: m.name }),
                          (0, Mt.jsxs)("div", {
                            className: "text-[11px] truncate",
                            style: { color: "var(--ink-dim)" },
                            children: [m.home.style, " \xB7 ", (t.homeSlots[m.id] || []).length, " items"],
                          }),
                        ],
                      }),
                    ],
                  },
                  m.id,
                ),
              ),
          }),
        ],
      }),
    ],
  });
}
var To = P(Zt(), 1);
var At = P(ct(), 1);
function PR({ name: t, color: e }) {
  let a = (0, To.useRef)(null),
    [r, o] = (0, To.useState)("off"),
    n = (0, To.useRef)(null),
    i = async () => {
      try {
        let s = await navigator.mediaDevices.getUserMedia({ video: !0, audio: !0 });
        ((n.current = s),
          a.current && ((a.current.srcObject = s), a.current.play().catch(() => {})),
          o("on"));
      } catch {
        o("denied");
      }
    };
  return (
    (0, To.useEffect)(() => () => n.current?.getTracks().forEach((s) => s.stop()), []),
    (0, At.jsxs)("div", {
      className: "relative rounded-2xl overflow-hidden aspect-video fake-video",
      style: { "--h": 300 },
      children: [
        (0, At.jsx)("video", {
          ref: a,
          muted: !0,
          playsInline: !0,
          className: `absolute inset-0 w-full h-full object-cover ${r === "on" ? "" : "hidden"}`,
        }),
        r !== "on" &&
          (0, At.jsx)("div", {
            className: "absolute inset-0 grid place-items-center",
            children: (0, At.jsxs)("div", {
              className: "text-center",
              children: [
                (0, At.jsx)("div", {
                  className: "mx-auto w-20 h-20 rounded-full grid place-items-center font-display text-2xl",
                  style: { background: e, color: "#06122e", boxShadow: `0 0 40px ${e}` },
                  children: t[0],
                }),
                (0, At.jsx)("div", {
                  className: "eq flex items-end justify-center h-6 mt-3",
                  children: Array.from({ length: 10 }).map((s, l) =>
                    (0, At.jsx)("span", { style: { animationDelay: `${l * 0.08}s` } }, l),
                  ),
                }),
              ],
            }),
          }),
        (0, At.jsxs)("div", {
          className: "absolute left-2 top-2 chip",
          style: { background: "rgba(255,45,85,.85)", color: "#fff" },
          children: [(0, At.jsx)("span", { className: "live-dot", style: { background: "#fff" } }), " LIVE"],
        }),
        (0, At.jsx)("div", {
          className: "absolute right-2 bottom-2 flex gap-1.5",
          children:
            r !== "on" &&
            (0, At.jsxs)("button", {
              className: "btn btn-sm btn-ghost",
              style: { background: "rgba(0,0,0,.5)" },
              onClick: i,
              children: [(0, At.jsx)(rn, {}), " Camera/Mic"],
            }),
        }),
        r === "denied" &&
          (0, At.jsx)("div", {
            className: "absolute left-2 bottom-2 text-[11px] max-w-[60%] rounded-lg px-2 py-1",
            style: { background: "rgba(0,0,0,.6)" },
            children:
              "The camera is blocked in this preview, so you are live with your avatar cam. The camera works in the local app (npm run dev).",
          }),
      ],
    })
  );
}
function fy() {
  let t = Y(),
    e = t.session.userId,
    a = be(e),
    r = t.lives.find((f) => f.hostId === e),
    [o, n] = (0, To.useState)("AI agent live build + Q&A"),
    [i, s] = (0, To.useState)("plaza"),
    [l, c] = (0, To.useState)(""),
    [d, h] = (0, To.useState)(null),
    u =
      r ||
      t.lives.find((f) => f.id === d) ||
      (t.scene.mode === "home"
        ? t.lives.find((f) => f.hostId === t.scene.owner)
        : t.lives.find((f) => f.where === "plaza")),
    p = (0, To.useRef)(null);
  ((0, To.useEffect)(() => {
    t.lives.some((f) => f.hostId !== e) && xo("live");
  }, []),
    (0, To.useEffect)(() => {
      p.current?.scrollTo({ top: 1e6 });
    }, [u?.chat.length]));
  let [v, g] = (0, To.useState)(0);
  (0, To.useEffect)(() => {
    let f = setInterval(() => {
      let y = _t();
      if (!y || !u) return g(0);
      let x = u.where === "plaza" ? { x: 0, z: -3 } : { x: 0, z: -12 },
        k = y.player.root.position,
        b = u.where === "plaza" ? t.scene.mode === "plaza" : t.scene.owner === u.hostId,
        w = Math.hypot(k.x - x.x, k.z - x.z);
      g(b ? Math.min(1, 3 / (3 + 1.6 * Math.max(0, w - 3))) : 0);
    }, 250);
    return () => clearInterval(f);
  }, [u?.id, t.scene]);
  let m = (f) => {
    (h(f.id),
      xo("live"),
      f.where === "plaza"
        ? (t.scene.mode !== "plaza" && Jr(), setTimeout(() => _t()?.teleport("stage"), 50))
        : yo(f.hostId));
  };
  return (0, At.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, At.jsxs)("div", {
        className: "card p-4 flex items-center gap-3",
        children: [
          (0, At.jsxs)("button", {
            onClick: () => C({ audioOn: !t.audioOn }),
            className: `btn ${t.audioOn ? "btn-primary" : "btn-ghost"}`,
            id: "spatial-toggle",
            children: [
              t.audioOn ? (0, At.jsx)(tg, {}) : (0, At.jsx)(sd, {}),
              " Spatial audio ",
              t.audioOn ? "ON" : "OFF",
            ],
          }),
          (0, At.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, At.jsx)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children:
                  "The closer you stand to the speaker, the clearer and more directional the sound. Headphones recommended.",
              }),
              (0, At.jsx)("div", {
                className: "h-2 rounded-full mt-1.5 overflow-hidden",
                style: { background: "rgba(255,255,255,.08)" },
                children: (0, At.jsx)("div", {
                  className: "h-full rounded-full transition-all duration-200",
                  style: {
                    width: `${Math.round(v * 100)}%`,
                    background: "linear-gradient(90deg, var(--sky), var(--ember))",
                  },
                }),
              }),
            ],
          }),
        ],
      }),
      r
        ? (0, At.jsxs)("div", {
            className: "card holo-edge p-4 space-y-3",
            children: [
              (0, At.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, At.jsx)("span", { className: "live-dot" }),
                  (0, At.jsx)("div", {
                    className: "font-display font-bold flex-1 truncate",
                    children: r.title,
                  }),
                  (0, At.jsxs)("span", {
                    className: "chip tabular",
                    children: [(0, At.jsx)($e, {}), " ", r.viewers],
                  }),
                ],
              }),
              (0, At.jsx)(PR, { name: a.name, color: a.color }),
              (0, At.jsxs)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children: [
                  r.where === "plaza"
                    ? "You are on the central stage. Avatars are gathering in front of you."
                    : "You are live from your home stage.",
                  " Started ",
                  Ao(r.startedAt),
                  " ago.",
                ],
              }),
              (0, At.jsxs)("button", {
                className: "btn btn-ember btn-sm",
                onClick: i8,
                children: [(0, At.jsx)(pe, {}), " End live"],
              }),
            ],
          })
        : (0, At.jsxs)("form", {
            className: "card p-4 space-y-3",
            onSubmit: (f) => {
              (f.preventDefault(),
                n8(o.trim() || "Live", i),
                i === "home" ? yo(e) : t.scene.mode !== "plaza" && Jr(),
                t.audioOn || C({ audioOn: !0 }));
            },
            children: [
              (0, At.jsx)(Te, { kicker: "Go Live", title: "Audio, video and screen share" }),
              (0, At.jsxs)("div", {
                children: [
                  (0, At.jsx)("label", {
                    className: "label",
                    htmlFor: "live-title",
                    children: "Session title",
                  }),
                  (0, At.jsx)("input", {
                    id: "live-title",
                    className: "field",
                    value: o,
                    onChange: (f) => n(f.target.value),
                  }),
                ],
              }),
              (0, At.jsxs)("div", {
                className: "grid grid-cols-2 gap-2",
                children: [
                  (0, At.jsxs)("button", {
                    type: "button",
                    onClick: () => s("plaza"),
                    className: `card p-3 text-left ${i === "plaza" ? "chip-on" : ""}`,
                    children: [
                      (0, At.jsx)(Qi, {}),
                      (0, At.jsx)("div", { className: "font-bold text-sm mt-1", children: "Central stage" }),
                      (0, At.jsx)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: "Everyone online can see it",
                      }),
                    ],
                  }),
                  (0, At.jsxs)("button", {
                    type: "button",
                    onClick: () => s("home"),
                    className: `card p-3 text-left ${i === "home" ? "chip-on" : ""}`,
                    children: [
                      (0, At.jsx)(K8, {}),
                      (0, At.jsx)("div", { className: "font-bold text-sm mt-1", children: "My home" }),
                      (0, At.jsx)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: "Your showroom stage",
                      }),
                    ],
                  }),
                ],
              }),
              (0, At.jsxs)("button", {
                className: "btn btn-ember w-full",
                id: "go-live",
                children: [
                  (0, At.jsx)("span", { className: "live-dot", style: { background: "#fff" } }),
                  " Go Live",
                ],
              }),
            ],
          }),
      u &&
        (0, At.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, At.jsx)(Te, {
              kicker: "Live chat",
              title: u.title,
              right: (0, At.jsxs)("span", {
                className: "chip tabular",
                children: [(0, At.jsx)($e, {}), " ", u.viewers],
              }),
            }),
            (0, At.jsxs)("div", {
              ref: p,
              className: "h-52 scroll-y space-y-1.5 text-sm pr-1",
              children: [
                u.chat.length === 0 &&
                  (0, At.jsx)("div", {
                    className: "text-xs",
                    style: { color: "var(--ink-dim)" },
                    children: "The chat is quiet. Ask the first question!",
                  }),
                u.chat.map((f) =>
                  (0, At.jsxs)(
                    "div",
                    {
                      className: "pop-in",
                      children: [
                        (0, At.jsx)("b", { style: { color: f.color }, children: f.name }),
                        " ",
                        (0, At.jsx)("span", { children: f.text }),
                      ],
                    },
                    f.id,
                  ),
                ),
              ],
            }),
            (0, At.jsxs)("form", {
              className: "flex gap-2 mt-2",
              onSubmit: (f) => {
                (f.preventDefault(), Iv(u.id, l), _t()?.say(l), c(""));
              },
              children: [
                (0, At.jsx)("input", {
                  id: "live-chat",
                  className: "field py-2",
                  value: l,
                  onChange: (f) => c(f.target.value),
                  placeholder: "Say something in the live chat\u2026",
                }),
                (0, At.jsx)("button", {
                  className: "btn btn-primary btn-sm",
                  "aria-label": "Send",
                  children: (0, At.jsx)(Da, {}),
                }),
              ],
            }),
          ],
        }),
      (0, At.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, At.jsx)(Te, { kicker: "Live now", title: "Live sessions" }),
          t.lives.map((f) => {
            let y = be(f.hostId);
            return (0, At.jsxs)(
              "div",
              {
                className: "flex items-center gap-3 py-2",
                style: { borderTop: "1px solid var(--line)" },
                children: [
                  (0, At.jsx)(Dr, { user: y, size: 34 }),
                  (0, At.jsxs)("div", {
                    className: "min-w-0 flex-1",
                    children: [
                      (0, At.jsx)("div", { className: "text-sm font-bold truncate", children: f.title }),
                      (0, At.jsxs)("div", {
                        className: "text-xs flex items-center gap-1",
                        style: { color: "var(--ink-dim)" },
                        children: [
                          (0, At.jsx)(da, {}),
                          " ",
                          f.where === "plaza" ? "Central stage" : `${y?.name}'s home`,
                          " \xB7 ",
                          f.viewers,
                          " viewers",
                        ],
                      }),
                    ],
                  }),
                  f.hostId !== e &&
                    (0, At.jsx)("button", {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => {
                        (m(f), ca());
                      },
                      children: "Join",
                    }),
                ],
              },
              f.id,
            );
          }),
        ],
      }),
    ],
  });
}
var H0 = P(Zt(), 1);
var te = P(ct(), 1);
function my() {
  let t = Y(),
    e = t.session.userId,
    a = t.txns
      .filter((i) => i.userId === e)
      .slice()
      .reverse(),
    r = a.filter((i) => i.amount > 0).reduce((i, s) => i + s.amount, 0),
    o = a.filter((i) => i.amount < 0).reduce((i, s) => i - s.amount, 0),
    n = t.orders.filter((i) => i.buyerId === e && i.status !== "completed").reduce((i, s) => i + s.amount, 0);
  return t.bank && t.net.status === "online"
    ? (0, te.jsx)(OR, {})
    : (0, te.jsxs)("div", {
        className: "space-y-4",
        children: [
          (0, te.jsxs)("div", {
            className: "card holo-edge p-5",
            children: [
              (0, te.jsx)("div", { className: "label", children: "Fyrus Wallet (demo)" }),
              (0, te.jsx)("div", {
                className: "font-display text-4xl tabular",
                children: q(t.wallets[e] || 0),
              }),
              (0, te.jsx)("div", {
                className: "flex gap-2 mt-4 flex-wrap",
                children: [50, 200, 500].map((i) =>
                  (0, te.jsxs)(
                    "button",
                    {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => Z2(i),
                      children: [(0, te.jsx)(Na, {}), " ", q(i)],
                    },
                    i,
                  ),
                ),
              }),
              (0, te.jsx)("p", {
                className: "text-[11px] mt-3",
                style: { color: "var(--ink-dim)" },
                children: "Top-ups are demo only. Production opens a Stripe or Paystack checkout here.",
              }),
            ],
          }),
          (0, te.jsxs)("div", {
            className: "grid grid-cols-3 gap-2",
            children: [
              (0, te.jsx)(Ra, { label: "In", value: q(Math.round(r * 100) / 100), tone: "var(--mint)" }),
              (0, te.jsx)(Ra, { label: "Out", value: q(Math.round(o * 100) / 100), tone: "var(--ember)" }),
              (0, te.jsx)(Ra, { label: "Escrow", value: q(n), tone: "var(--ember-hi)" }),
            ],
          }),
          (0, te.jsxs)("div", {
            className: "card p-4",
            children: [
              (0, te.jsx)(Te, { kicker: "History", title: "Transactions" }),
              a.map((i) =>
                (0, te.jsxs)(
                  "div",
                  {
                    className: "flex items-center gap-2 py-2 text-sm",
                    style: { borderTop: "1px solid var(--line)" },
                    children: [
                      i.amount >= 0
                        ? (0, te.jsx)(hd, { style: { color: "var(--mint)" } })
                        : (0, te.jsx)(Ti, { style: { color: "var(--rose)" } }),
                      (0, te.jsxs)("div", {
                        className: "min-w-0 flex-1",
                        children: [
                          (0, te.jsx)("div", { className: "truncate", children: i.label }),
                          (0, te.jsxs)("div", {
                            className: "text-[11px]",
                            style: { color: "var(--ink-dim)" },
                            children: [Ao(i.at), " ago"],
                          }),
                        ],
                      }),
                      (0, te.jsxs)("div", {
                        className: "font-mono tabular",
                        style: { color: i.amount >= 0 ? "var(--mint)" : "var(--rose)" },
                        children: [i.amount >= 0 ? "+" : "\u2212", q(Math.abs(i.amount))],
                      }),
                    ],
                  },
                  i.id,
                ),
              ),
            ],
          }),
        ],
      });
}
function OR() {
  let t = Y(),
    e = t.bank,
    [a, r] = (0, H0.useState)("+2040-"),
    [o, n] = (0, H0.useState)(""),
    [i, s] = (0, H0.useState)("");
  return (
    (0, H0.useEffect)(() => {
      O.send({ t: "bank_hist" });
    }, [e.bal]),
    (0, te.jsxs)("div", {
      className: "space-y-4",
      children: [
        (0, te.jsxs)("div", {
          className: "card holo-edge p-5",
          children: [
            (0, te.jsxs)("div", {
              className: "label flex items-center gap-1",
              children: [(0, te.jsx)(Or, {}), " Central Bank of Fyrus \xB7 my account"],
            }),
            (0, te.jsx)("div", { className: "font-display text-4xl tabular", children: q(e.bal) }),
            (0, te.jsxs)("div", {
              className: "text-[12px] mt-1",
              style: { color: "var(--ink-dim)" },
              children: [
                e.held ? `${q(e.held)} held for your leading bids \xB7 ` : "",
                e.bond ? `seller bond ${q(e.bond)} \xB7 ` : "",
                e.sales,
                " completed sales",
                e.banned ? " \xB7 account banned" : "",
              ],
            }),
            (0, te.jsx)("div", {
              className: "flex gap-2 mt-3 flex-wrap",
              children: [1e3, 5e3].map((l) =>
                (0, te.jsxs)(
                  "button",
                  {
                    className: "btn btn-ghost btn-sm",
                    onClick: () => Z2(l),
                    children: [(0, te.jsx)(Na, {}), " ", q(l), " test FYC"],
                  },
                  l,
                ),
              ),
            }),
            (0, te.jsx)("p", {
              className: "text-[11px] mt-2",
              style: { color: "var(--ink-dim)" },
              children:
                "Your balance is kept on the Fyrus server, so payments to other citizens are real and safe. FYC is in-city credit (no real money during beta).",
            }),
          ],
        }),
        (0, te.jsxs)("div", {
          className: "card p-4 space-y-2",
          id: "fyruspay",
          children: [
            (0, te.jsxs)("div", {
              className: "font-bold text-sm flex items-center gap-1",
              children: [(0, te.jsx)(Da, {}), " FyrusPay \xB7 send to a +2040 number"],
            }),
            (0, te.jsx)("input", {
              className: "field py-1.5 text-sm font-mono",
              value: a,
              onChange: (l) => r(l.target.value),
              "aria-label": "Recipient number",
            }),
            (0, te.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, te.jsx)("input", {
                  className: "field py-1.5 text-sm",
                  type: "number",
                  min: 1,
                  value: o,
                  onChange: (l) => n(l.target.value),
                  placeholder: "Amount (FYC)",
                  "aria-label": "Amount",
                }),
                (0, te.jsx)("input", {
                  className: "field py-1.5 text-sm",
                  value: i,
                  onChange: (l) => s(l.target.value),
                  placeholder: "Note (optional)",
                  maxLength: 80,
                }),
              ],
            }),
            (0, te.jsxs)("button", {
              className: "btn btn-primary btn-sm",
              onClick: () => {
                (O.send({ t: "bank_send", to: a, amount: +o, note: i }), n(""), s(""));
              },
              children: [(0, te.jsx)(Da, {}), " Send"],
            }),
          ],
        }),
        (0, te.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, te.jsx)(Te, { kicker: "Ledger", title: "Bank statement" }),
            t.bankHist.length === 0 &&
              (0, te.jsx)("div", {
                className: "text-[12px]",
                style: { color: "var(--ink-dim)" },
                children: "No transactions yet.",
              }),
            t.bankHist.map((l) =>
              (0, te.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 py-2 text-sm",
                  style: { borderTop: "1px solid var(--line)" },
                  children: [
                    l.dir === "in"
                      ? (0, te.jsx)(hd, { style: { color: "var(--mint)" } })
                      : (0, te.jsx)(Ti, { style: { color: "var(--rose)" } }),
                    (0, te.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, te.jsx)("div", { className: "truncate", children: l.memo }),
                        (0, te.jsxs)("div", {
                          className: "text-[11px]",
                          style: { color: "var(--ink-dim)" },
                          children: [
                            l.dir === "in" ? "from" : "to",
                            " ",
                            l.otherName,
                            " \xB7 ",
                            Ao(l.at),
                            " ago",
                          ],
                        }),
                      ],
                    }),
                    (0, te.jsxs)("div", {
                      className: "font-mono tabular",
                      style: { color: l.dir === "in" ? "var(--mint)" : "var(--rose)" },
                      children: [l.dir === "in" ? "+" : "\u2212", q(l.amount)],
                    }),
                  ],
                },
                l.id,
              ),
            ),
          ],
        }),
      ],
    })
  );
}
var Aa = P(ct(), 1),
  DR = [
    { slot: "acc", title: "Avatar accessories", icon: Qh },
    { slot: "trail", title: "Movement trails", icon: W8 },
    { slot: "board", title: "Hoverboards (press H)", icon: e0 },
    { slot: "style", title: "Home styles", icon: Ma },
  ],
  FR = {
    halo: "\u25EF",
    antenna: "\u2301",
    "visor-x": "\u2715",
    crown: "\u265B",
    orbit: "\u229A",
    blue: "\u2604",
    ember: "\u{1F525}",
    rainbow: "\u25C8",
    classic: "\u25AD",
    neon: "\u25B0",
    flame: "\u27B6",
    tower: "\u25AE",
    villa: "\u25AC",
    dome: "\u25D7",
    pyramid: "\u25B2",
    stack: "\u2261",
    spire: "\u27C1",
  };
function vy() {
  let t = Y(),
    e = t.game,
    a = Tr(e.xp),
    r = be(t.session.userId),
    o = (n, i) => (n === "style" ? r.home.style === i : r.avatar?.[n] === i);
  return (0, Aa.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, Aa.jsxs)("div", {
        className: "card holo-edge p-4 flex items-center gap-3",
        children: [
          (0, Aa.jsx)("span", { className: "orb-icon", style: { width: 28, height: 28 } }),
          (0, Aa.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, Aa.jsxs)("div", {
                className: "font-display text-2xl tabular",
                children: [e.orbs.toLocaleString("en-US"), " orbs"],
              }),
              (0, Aa.jsx)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children:
                  "Earn orbs by exploring, quests and daily rewards. Cosmetics never cost real money.",
              }),
            ],
          }),
        ],
      }),
      DR.map((n) =>
        (0, Aa.jsxs)(
          "div",
          {
            className: "card p-4",
            children: [
              (0, Aa.jsx)(Te, {
                kicker: "Shop",
                title: n.title,
                right: (0, Aa.jsx)(n.icon, { style: { color: "var(--sky)" } }),
              }),
              (0, Aa.jsx)("div", {
                className: "grid grid-cols-3 gap-2",
                children: Tp.filter((i) => i.slot === n.slot).map((i) => {
                  let s = e.owned.includes(i.id),
                    l = o(i.slot, i.value),
                    c = a < i.level;
                  return (0, Aa.jsxs)(
                    "button",
                    {
                      onClick: () => gM(i),
                      className: `card card-hover p-3 text-left ${l ? "chip-on" : ""}`,
                      children: [
                        (0, Aa.jsx)("div", {
                          className: "text-2xl h-8",
                          style: { color: l ? "var(--ember)" : "var(--sky)" },
                          children: FR[i.value],
                        }),
                        (0, Aa.jsx)("div", {
                          className: "text-xs font-bold mt-1 leading-tight",
                          children: i.name,
                        }),
                        (0, Aa.jsx)("div", {
                          className: "text-[11px] mt-1 flex items-center gap-1",
                          style: { color: l ? "var(--mint)" : c ? "var(--ember-hi)" : "var(--ink-dim)" },
                          children: l
                            ? (0, Aa.jsxs)(Aa.Fragment, { children: [(0, Aa.jsx)(_e, {}), " Equipped"] })
                            : s
                              ? "Owned \xB7 tap to use"
                              : c
                                ? (0, Aa.jsxs)(Aa.Fragment, {
                                    children: [(0, Aa.jsx)(Pr, {}), " Level ", i.level],
                                  })
                                : (0, Aa.jsxs)(Aa.Fragment, {
                                    children: [
                                      (0, Aa.jsx)("span", {
                                        className: "orb-icon",
                                        style: { width: 10, height: 10 },
                                      }),
                                      " ",
                                      i.cost,
                                    ],
                                  }),
                        }),
                      ],
                    },
                    i.id,
                  );
                }),
              }),
            ],
          },
          n.slot,
        ),
      ),
    ],
  });
}
var wd = P(Zt(), 1);
var Xg = P(Zt(), 1);
var He = P(ct(), 1);
function xy() {
  let t = Y(),
    e = t.net,
    [a, r] = (0, Xg.useState)({ name: "", email: "", pass: "" }),
    [o, n] = (0, Xg.useState)(""),
    [i, s] = (0, Xg.useState)(!1);
  return e.status !== "online"
    ? (0, He.jsx)("div", {
        className: "text-xs",
        style: { color: "var(--ink-dim)" },
        children: "Account options appear when you are connected to the live city at fyrus.io.",
      })
    : (0, He.jsxs)("div", {
        className: "space-y-2",
        "data-account": !0,
        children: [
          e.guest
            ? (0, He.jsxs)("div", {
                className: "rounded-md p-3",
                style: { background: "rgba(255,154,60,.08)", border: "1px solid rgba(255,154,60,.35)" },
                children: [
                  (0, He.jsxs)("div", {
                    className: "text-sm font-bold flex items-center gap-1.5",
                    children: [
                      (0, He.jsx)(nu, { style: { color: "var(--ember)" } }),
                      " Guest account \u2014 only on this device",
                    ],
                  }),
                  (0, He.jsx)("div", {
                    className: "text-xs mt-0.5",
                    style: { color: "var(--ink-dim)" },
                    children:
                      "Add an email and password to keep your FYC, homes and progress and log in from any device. Nothing is lost.",
                  }),
                  (0, He.jsxs)("form", {
                    className: "grid gap-2 mt-2",
                    onSubmit: async (l) => {
                      if ((l.preventDefault(), n(""), a.pass.length < 8))
                        return n("Use at least 8 characters.");
                      s(!0);
                      try {
                        await TM(
                          a.name || t.users.find((c) => c.id === t.session?.userId)?.name || "",
                          a.email,
                          a.pass,
                        );
                      } catch (c) {
                        n(c.message);
                      }
                      s(!1);
                    },
                    children: [
                      (0, He.jsx)("input", {
                        id: "acc-email",
                        className: "field",
                        type: "email",
                        placeholder: "you@example.com",
                        value: a.email,
                        onChange: (l) => r({ ...a, email: l.target.value }),
                        autoComplete: "email",
                      }),
                      (0, He.jsx)("input", {
                        id: "acc-pass",
                        className: "field",
                        type: "password",
                        placeholder: "Password (8+ characters)",
                        value: a.pass,
                        onChange: (l) => r({ ...a, pass: l.target.value }),
                        autoComplete: "new-password",
                      }),
                      (0, He.jsxs)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: [
                          "By saving you confirm you are 13 or older and accept the ",
                          (0, He.jsx)("a", {
                            className: "underline",
                            href: "/terms",
                            target: "_blank",
                            rel: "noopener",
                            children: "Terms",
                          }),
                          " and ",
                          (0, He.jsx)("a", {
                            className: "underline",
                            href: "/privacy",
                            target: "_blank",
                            rel: "noopener",
                            children: "Privacy Policy",
                          }),
                          ".",
                        ],
                      }),
                      o &&
                        (0, He.jsx)("div", {
                          role: "alert",
                          className: "text-xs",
                          style: { color: "#ffb3c2" },
                          children: o,
                        }),
                      (0, He.jsx)("button", {
                        id: "acc-save",
                        className: "btn btn-primary btn-sm",
                        disabled: i || !a.email,
                        children: i ? "Saving\u2026" : "Save my account",
                      }),
                    ],
                  }),
                ],
              })
            : (0, He.jsxs)("div", {
                className: "text-sm flex items-center gap-2",
                children: [
                  (0, He.jsx)(yr, { style: { color: "#45e0ae" } }),
                  " Signed in",
                  e.email
                    ? (0, He.jsxs)(He.Fragment, {
                        children: [" as ", (0, He.jsx)("b", { className: "ml-1", children: e.email })],
                      })
                    : "",
                  e.google ? " \xB7 Google" : "",
                  " ",
                  (0, He.jsx)(ql, { className: "opacity-0" }),
                ],
              }),
          (0, He.jsxs)("div", {
            className: "text-xs flex items-center justify-between gap-2",
            style: { color: "var(--ink-dim)" },
            children: [
              (0, He.jsxs)("span", { children: ["Fyrus number ", e.number] }),
              (0, He.jsxs)("span", {
                children: [
                  "Voice chat: ",
                  e.age18
                    ? "18+ confirmed"
                    : (0, He.jsx)("button", {
                        className: "underline",
                        onClick: () => C({ age18Ask: !0 }),
                        children: "confirm 18+",
                      }),
                ],
              }),
            ],
          }),
          (0, He.jsxs)("div", {
            className: "text-[11px]",
            style: { color: "var(--ink-dim)" },
            children: [
              (0, He.jsx)("a", {
                className: "underline",
                href: "/terms",
                target: "_blank",
                rel: "noopener",
                children: "Terms of Use",
              }),
              " \xB7 ",
              (0, He.jsx)("a", {
                className: "underline",
                href: "/privacy",
                target: "_blank",
                rel: "noopener",
                children: "Privacy Policy",
              }),
            ],
          }),
        ],
      });
}
function K7() {
  return (0, He.jsx)("div", {
    className: "fixed inset-0 z-[70] grid place-items-center p-4",
    style: { background: "rgba(0,0,0,.55)" },
    role: "dialog",
    "aria-label": "Voice chat is 18+",
    children: (0, He.jsxs)("div", {
      className: "glass rounded-xl p-5 w-full max-w-sm pop-in",
      children: [
        (0, He.jsx)("h2", { className: "hud-font text-2xl", children: "VOICE CHAT IS 18+" }),
        (0, He.jsx)("p", {
          className: "text-sm mt-1",
          style: { color: "var(--ink-dim)" },
          children:
            "People near you will hear you, and you will hear them. Be kind; report anyone who isn't. Text chat stays open for everyone 13+.",
        }),
        (0, He.jsxs)("div", {
          className: "flex gap-2 mt-4",
          children: [
            (0, He.jsx)("button", {
              className: "btn btn-ghost flex-1",
              onClick: () => C({ age18Ask: !1 }),
              children: "I'm under 18",
            }),
            (0, He.jsx)("button", {
              id: "age18-yes",
              className: "btn btn-primary flex-1",
              onClick: SM,
              children: "I am 18 or older",
            }),
          ],
        }),
      ],
    }),
  });
}
var bd = P(Zt(), 1),
  Ur = P(ea(), 1);
var X7 = P(ct(), 1);
function yy({ outfit: t, photo: e, height: a = 300 }) {
  let r = (0, bd.useRef)(null),
    o = (0, bd.useRef)(null);
  return (
    (0, bd.useEffect)(() => {
      let n = r.current;
      if (!n) return;
      let i;
      try {
        i = new Ur.WebGLRenderer({ antialias: !0, alpha: !0 });
      } catch {
        return;
      }
      let s = n.clientWidth || 240;
      (i.setPixelRatio(Math.min(2, window.devicePixelRatio)),
        i.setSize(s, a),
        (i.outputEncoding = Ur.sRGBEncoding),
        n.appendChild(i.domElement));
      let l = new Ur.Scene(),
        c = new Ur.PerspectiveCamera(30, s / a, 0.1, 50);
      (c.position.set(0, 1.35, 4.2),
        c.lookAt(0, 1.05, 0),
        l.add(new Ur.HemisphereLight("#dfe9ff", "#3a3020", 0.9)));
      let d = new Ur.DirectionalLight("#fff4e0", 1.1);
      (d.position.set(2, 4, 3), l.add(d));
      let h = new Ur.DirectionalLight("#4da3ff", 0.5);
      (h.position.set(-3, 2, -2), l.add(h));
      let u = new Ur.Mesh(
        new Ur.CircleGeometry(0.9, 32),
        new Ur.MeshStandardMaterial({ color: "#1a2236", roughness: 0.9 }),
      );
      ((u.rotation.x = -Math.PI / 2), l.add(u));
      let p = new Nn("", "#ffffff", "", !1, void 0, t);
      ((p.label.visible = !1), (p.ring.visible = !1), l.add(p.root), (o.current = p));
      let v = 0.35,
        g = !1,
        m = 0,
        f = 0,
        y = performance.now(),
        x = !0,
        k = (E) => {
          ((g = !0), (x = !1), (m = E.clientX));
        },
        b = (E) => {
          g && ((v += (E.clientX - m) * 0.012), (m = E.clientX));
        },
        w = () => (g = !1);
      (i.domElement.addEventListener("pointerdown", k),
        window.addEventListener("pointermove", b),
        window.addEventListener("pointerup", w));
      let L = () => {
        let E = performance.now(),
          T = Math.min(0.05, (E - y) / 1e3);
        ((y = E),
          x && (v += T * 0.5),
          (p.root.rotation.y = v),
          p.update(T, E / 1e3),
          i.render(l, c),
          (f = requestAnimationFrame(L)));
      };
      return (
        L(),
        () => {
          (cancelAnimationFrame(f),
            i.domElement.removeEventListener("pointerdown", k),
            window.removeEventListener("pointermove", b),
            window.removeEventListener("pointerup", w),
            p.dispose(),
            i.dispose(),
            i.forceContextLoss?.(),
            n.removeChild(i.domElement),
            (o.current = null));
        }
      );
    }, [a]),
    (0, bd.useEffect)(() => {
      o.current?.setOutfit(t);
    }, [JSON.stringify(t)]),
    (0, bd.useEffect)(() => {
      o.current?.setPhoto(e || null);
    }, [e]),
    (0, X7.jsx)("div", {
      ref: r,
      className: "w-full rounded-xl overflow-hidden cursor-grab",
      style: { height: a, background: "radial-gradient(circle at 50% 40%, #1e2c4d, #0b1222)" },
      "aria-label": "Your character, drag to turn",
    })
  );
}
var tt = P(ct(), 1);
function UR(t) {
  let e = URL.createObjectURL(t),
    a = new Image();
  ((a.onload = () => {
    let r = document.createElement("canvas");
    r.width = r.height = 56;
    let o = r.getContext("2d"),
      n = Math.max(56 / a.width, 56 / a.height);
    o.drawImage(a, (56 - a.width * n) / 2, (56 - a.height * n) / 2, a.width * n, a.height * n);
    let i = 0.7,
      s = r.toDataURL("image/jpeg", i);
    for (; s.length > 2600 && i > 0.2; ) ((i -= 0.1), (s = r.toDataURL("image/jpeg", i)));
    (Dv(s), URL.revokeObjectURL(e));
  }),
    (a.src = e));
}
var J7 = ["#4da3ff", "#ff9a3c", "#4cc38a", "#e5484d", "#f5d90a", "#a78bfa", "#ffffff", "#00c2c7"],
  Q7 = [
    "#2f6fe0",
    "#1f1f1f",
    "#f2efe8",
    "#a83b3b",
    "#3d5a3d",
    "#c7a46a",
    "#7a4a8a",
    "#566573",
    "#e8a0b4",
    "#f4c20d",
    "#0f766e",
    "#ffffff",
  ],
  t9 = ["#2b303a", "#1f1f1f", "#3a4a6b", "#4a3b2a", "#6b6b6b", "#c8b89a", "#f2efe8", "#7a2a3a"],
  e9 = ["#111111", "#2a1a12", "#5a3a1a", "#7a4a24", "#c9a46a", "#8a8a8a", "#b03a2e", "#e8e0d0"],
  $R = ["#1f1f1f", "#f2efe8", "#2f4d7a", "#7a2a3a", "#c7a46a", "#3d5a3d", "#e8a0b4", "#566573"],
  a9 = ["#4a3222", "#2a1a10", "#3b6ea5", "#4f7a3a", "#8a6a3a", "#6b6b6b"],
  _R = ["#9a5a50", "#b5525a", "#c8384f", "#8a3a4a", "#d98a80", "#6b3a32"],
  r9 = ["#f2f2f2", "#1f1f1f", "#8a5a3c", "#c0392b", "#2f6fe0"];
function Ke({ label: t, hint: e, children: a }) {
  return (0, tt.jsxs)("div", {
    className: "flex items-center gap-3 py-2.5",
    style: { borderBottom: "1px solid var(--line)" },
    children: [
      (0, tt.jsxs)("div", {
        className: "flex-1 min-w-0",
        children: [
          (0, tt.jsx)("div", { className: "text-sm font-bold", children: t }),
          e &&
            (0, tt.jsx)("div", { className: "text-[11px]", style: { color: "var(--ink-dim)" }, children: e }),
        ],
      }),
      (0, tt.jsx)("div", { className: "shrink-0", children: a }),
    ],
  });
}
function Bn({ value: t, options: e, onChange: a, labels: r }) {
  return (0, tt.jsx)("div", {
    className: "flex flex-wrap gap-1 justify-end",
    children: e.map((o) =>
      (0, tt.jsx)(
        "button",
        {
          className: `chip ${t === o ? "chip-on" : ""}`,
          "aria-pressed": t === o,
          onClick: () => a(o),
          children: r?.[o] || o[0].toUpperCase() + o.slice(1),
        },
        o,
      ),
    ),
  });
}
