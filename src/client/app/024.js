var Rt = P(ct(), 1);
function ry() {
  let e = Y().game,
    a = Tr(e.xp),
    r = Kc(a),
    o = Kc(a + 1),
    n = Math.round(((e.xp - r) / (o - r)) * 100),
    i = mM(),
    s = i.findIndex((h) => h.id === "me") + 1,
    l = (h, u) => {
      (_t()?.teleport({ x: h, z: u }), ca());
    },
    c = () => {
      let h = Math.floor(Math.random() * 30) - 15,
        u = Math.floor(Math.random() * 30) - 15,
        p = $c(h, u, Math.floor(Math.random() * 4));
      (Is(p), yo(p.id), ca());
    },
    d = [
      [3, 0],
      [-3, 2],
      [0, -4],
      [5, 5],
      [-6, -3],
      [9, -1],
    ].map(([h, u]) => {
      let p = h * 3 * sa,
        v = u * 3 * sa;
      return { x: p, z: v, d: Uc(p, v) };
    });
  return (0, Rt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, Rt.jsxs)("div", {
        className: "card holo-edge p-4",
        children: [
          (0, Rt.jsxs)("div", {
            className: "flex items-center gap-3",
            children: [
              (0, Rt.jsx)("div", {
                className:
                  "w-14 h-14 rounded-2xl grid place-items-center font-display text-2xl font-extrabold",
                style: {
                  background: "linear-gradient(135deg, var(--blue-hi), var(--blue))",
                  boxShadow: "0 0 24px rgba(77,163,255,.5)",
                },
                children: a,
              }),
              (0, Rt.jsxs)("div", {
                className: "flex-1 min-w-0",
                children: [
                  (0, Rt.jsxs)("div", {
                    className: "font-display font-bold",
                    children: ["Level ", a, " explorer"],
                  }),
                  (0, Rt.jsx)("div", {
                    className: "xp-bar mt-1.5",
                    children: (0, Rt.jsx)("div", { style: { width: `${n}%` } }),
                  }),
                  (0, Rt.jsxs)("div", {
                    className: "text-[11px] mt-1 tabular",
                    style: { color: "var(--ink-dim)" },
                    children: [e.xp - r, " / ", o - r, " XP to level ", a + 1],
                  }),
                ],
              }),
            ],
          }),
          (0, Rt.jsxs)("div", {
            className: "grid grid-cols-4 gap-2 mt-4",
            children: [
              (0, Rt.jsx)(Ra, { label: "Orbs", value: co(e.orbs), tone: "var(--sky)" }),
              (0, Rt.jsx)(Ra, { label: "Streak", value: `${e.streak}d`, tone: "var(--ember)" }),
              (0, Rt.jsx)(Ra, { label: "Districts", value: e.districts.length }),
              (0, Rt.jsx)(Ra, { label: "Rank", value: `#${s}`, tone: "var(--ember-hi)" }),
            ],
          }),
          e.lastDaily !== new Date().toISOString().slice(0, 10) &&
            (0, Rt.jsxs)("button", {
              className: "btn btn-ember w-full mt-3",
              onClick: () => C({ dailyOpen: !0 }),
              children: [(0, Rt.jsx)(ug, {}), " Claim today's reward"],
            }),
        ],
      }),
      (0, Rt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Rt.jsx)(Te, {
            kicker: "Resets at midnight",
            title: "Daily quests",
            right: (0, Rt.jsxs)("span", {
              className: "chip",
              children: [(0, Rt.jsx)(og, {}), " ", e.claimed.length, "/", Zc.length],
            }),
          }),
          (0, Rt.jsx)("div", {
            className: "space-y-2",
            children: Zc.map((h) => {
              let u = e.quests[h.id] || 0,
                p = u >= h.target,
                v = e.claimed.includes(h.id);
              return (0, Rt.jsxs)(
                "div",
                {
                  className: "rounded-xl p-3 flex items-center gap-3",
                  style: {
                    background: p && !v ? "rgba(255,154,60,.1)" : "rgba(255,255,255,.04)",
                    border: `1px solid ${p && !v ? "rgba(255,154,60,.45)" : "var(--line)"}`,
                  },
                  children: [
                    (0, Rt.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, Rt.jsxs)("div", {
                          className: "text-sm font-bold flex items-center gap-1.5",
                          children: [v && (0, Rt.jsx)(cE, { style: { color: "var(--mint)" } }), h.title],
                        }),
                        (0, Rt.jsx)("div", {
                          className: "text-[11px]",
                          style: { color: "var(--ink-dim)" },
                          children: h.hint,
                        }),
                        (0, Rt.jsx)("div", {
                          className: "xp-bar mt-1.5",
                          children: (0, Rt.jsx)("div", { style: { width: `${(u / h.target) * 100}%` } }),
                        }),
                      ],
                    }),
                    (0, Rt.jsxs)("div", {
                      className: "text-right shrink-0",
                      children: [
                        (0, Rt.jsxs)("div", {
                          className: "text-[11px] tabular",
                          style: { color: "var(--ink-dim)" },
                          children: [u, "/", h.target],
                        }),
                        v
                          ? (0, Rt.jsx)("span", {
                              className: "text-xs",
                              style: { color: "var(--mint)" },
                              children: "Claimed",
                            })
                          : (0, Rt.jsxs)("button", {
                              className: "btn btn-sm btn-ember mt-1",
                              disabled: !p,
                              onClick: () => cM(h.id),
                              children: ["+", h.xp, " XP"],
                            }),
                      ],
                    }),
                  ],
                },
                h.id,
              );
            }),
          }),
        ],
      }),
      (0, Rt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Rt.jsx)(Te, { kicker: "Fyrus City 2040", title: "City directory" }),
          (0, Rt.jsxs)("div", {
            className: "grid grid-cols-2 gap-2",
            children: [
              Oa.map((h) =>
                (0, Rt.jsxs)(
                  "div",
                  {
                    className: "card p-3 text-left",
                    children: [
                      (0, Rt.jsx)("div", { className: "text-sm font-bold", children: h.name }),
                      (0, Rt.jsx)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: h.desc,
                      }),
                      (0, Rt.jsxs)("div", {
                        className: "flex gap-1.5 mt-2",
                        children: [
                          (0, Rt.jsx)("button", {
                            className: "btn btn-primary btn-sm",
                            onClick: () => xa(to(h.id)),
                            children: "Go",
                          }),
                          (0, Rt.jsx)("button", {
                            className: "btn btn-ghost btn-sm",
                            onClick: () => ts({ ...to(h.id), name: h.name }),
                            children: "Route",
                          }),
                        ],
                      }),
                    ],
                  },
                  h.id,
                ),
              ),
              (0, Rt.jsxs)("button", {
                className: "card card-hover p-3 text-left",
                onClick: () => J2("car"),
                children: [
                  (0, Rt.jsx)("div", {
                    className: "text-sm font-bold",
                    style: { color: "var(--sky)" },
                    children: "Fly now",
                  }),
                  (0, Rt.jsx)("div", {
                    className: "text-[11px]",
                    style: { color: "var(--ink-dim)" },
                    children: "Rent a flying car from where you stand",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      (0, Rt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Rt.jsx)(Te, { kicker: "The city never ends", title: "Travel" }),
          (0, Rt.jsxs)("div", {
            className: "grid grid-cols-2 gap-2 mb-3",
            children: [
              (0, Rt.jsxs)("button", {
                className: "btn btn-primary",
                onClick: c,
                children: [(0, Rt.jsx)(V8, {}), " Surprise me"],
              }),
              (0, Rt.jsxs)("button", {
                className: "btn btn-ghost",
                onClick: () => {
                  (_t()?.teleport("home"), ca());
                },
                children: [(0, Rt.jsx)(Ma, {}), " My home"],
              }),
              (0, Rt.jsxs)("button", {
                className: "btn btn-ghost",
                onClick: () => {
                  (_t()?.teleport("stage"), ca());
                },
                children: [(0, Rt.jsx)(Qi, {}), " Live stage"],
              }),
              (0, Rt.jsxs)("button", {
                className: "btn btn-ghost",
                onClick: () => It("home"),
                children: [(0, Rt.jsx)(Ds, {}), " Find a plot"],
              }),
            ],
          }),
          (0, Rt.jsx)("div", {
            className: "space-y-1.5",
            children: d.map((h) => {
              let u = e.districts.includes(h.d.key);
              return (0, Rt.jsxs)(
                "button",
                {
                  onClick: () => l(h.x, h.z),
                  className: "w-full flex items-center gap-3 rounded-xl p-2.5 text-left card-hover",
                  style: { background: "rgba(255,255,255,.03)", border: "1px solid var(--line)" },
                  children: [
                    (0, Rt.jsx)(dr, { style: { color: u ? "var(--sky)" : "var(--ember)" } }),
                    (0, Rt.jsxs)("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        (0, Rt.jsx)("div", { className: "text-sm font-bold", children: h.d.name }),
                        (0, Rt.jsxs)("div", {
                          className: "text-[11px] tabular",
                          style: { color: "var(--ink-dim)" },
                          children: [
                            Math.round(Math.hypot(h.x, h.z)),
                            "m away \xB7 ",
                            u ? "visited" : "undiscovered, +30 XP",
                          ],
                        }),
                      ],
                    }),
                  ],
                },
                h.d.key,
              );
            }),
          }),
        ],
      }),
      (0, Rt.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, Rt.jsx)(Te, {
            kicker: "This week",
            title: "Leaderboard",
            right: (0, Rt.jsx)($l, { style: { color: "var(--ember-hi)" } }),
          }),
          (0, Rt.jsxs)("div", {
            className: "space-y-1",
            children: [
              i
                .slice(0, 10)
                .map((h, u) =>
                  (0, Rt.jsxs)(
                    "div",
                    {
                      className: "flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm",
                      style: h.id === "me" ? { background: "rgba(77,163,255,.14)" } : {},
                      children: [
                        (0, Rt.jsx)("div", {
                          className: "w-6 text-center font-display font-bold tabular",
                          style: { color: u < 3 ? "var(--ember-hi)" : "var(--ink-dim)" },
                          children: u + 1,
                        }),
                        (0, Rt.jsx)("span", {
                          className: "w-3 h-3 rounded-full",
                          style: { background: h.color },
                        }),
                        (0, Rt.jsxs)("div", {
                          className: "flex-1 truncate font-bold",
                          children: [h.name, h.id === "me" && " (you)"],
                        }),
                        (0, Rt.jsxs)("div", {
                          className: "tabular text-xs",
                          style: { color: "var(--ink-dim)" },
                          children: [h.xp.toLocaleString("en-US"), " XP"],
                        }),
                      ],
                    },
                    h.id,
                  ),
                ),
              s > 10 &&
                (0, Rt.jsxs)("div", {
                  className: "flex items-center gap-3 py-1.5 px-2 rounded-lg text-sm",
                  style: { background: "rgba(77,163,255,.14)" },
                  children: [
                    (0, Rt.jsx)("div", { className: "w-6 text-center font-display tabular", children: s }),
                    (0, Rt.jsx)("div", { className: "flex-1 font-bold", children: "You" }),
                    (0, Rt.jsxs)("div", { className: "tabular text-xs", children: [e.xp, " XP"] }),
                  ],
                }),
            ],
          }),
          (0, Rt.jsxs)("div", {
            className: "text-[11px] mt-2 flex items-center gap-1",
            style: { color: "var(--ink-dim)" },
            children: [
              (0, Rt.jsx)(l0, { style: { color: "var(--ember)" } }),
              " Collect orbs, finish quests and visit homes to climb.",
            ],
          }),
        ],
      }),
    ],
  });
}
var ar = P(Zt(), 1);
var rt = P(ct(), 1);
function $7({ v: t }) {
  let [e, a] = (0, ar.useState)(!1);
  return t.src
    ? (0, rt.jsx)("video", {
        src: t.src,
        controls: !0,
        playsInline: !0,
        className: "w-full rounded-xl aspect-video bg-black",
      })
    : (0, rt.jsxs)("button", {
        onClick: () => a((r) => !r),
        className: "relative w-full aspect-video rounded-xl overflow-hidden fake-video block text-left",
        style: { "--h": t.hue },
        "aria-label": e ? "Pause" : "Play",
        children: [
          (0, rt.jsx)("div", {
            className: "absolute inset-0",
            style: {
              background: "repeating-linear-gradient(0deg, rgba(0,0,0,.12) 0 2px, transparent 2px 4px)",
            },
          }),
          !e &&
            (0, rt.jsx)("div", {
              className: "absolute inset-0 grid place-items-center",
              children: (0, rt.jsx)("div", {
                className: "w-14 h-14 rounded-full glass grid place-items-center",
                children: (0, rt.jsx)(a0, { className: "text-2xl ml-1" }),
              }),
            }),
          e &&
            (0, rt.jsx)("div", {
              className: "absolute left-3 bottom-8 eq flex items-end h-6",
              children: Array.from({ length: 12 }).map((r, o) =>
                (0, rt.jsx)("span", { style: { animationDelay: `${o * 0.07}s` } }, o),
              ),
            }),
          (0, rt.jsx)("div", {
            className: "absolute left-0 right-0 bottom-0 h-1 bg-black/40",
            children: (0, rt.jsx)("div", {
              className: "h-full",
              style: {
                background: "var(--ember)",
                width: e ? "100%" : "0%",
                transition: e ? "width 30s linear" : "none",
              },
            }),
          }),
          t.duration &&
            (0, rt.jsx)("div", {
              className: "absolute right-2 top-2 chip",
              style: { background: "rgba(0,0,0,.5)" },
              children: t.duration,
            }),
          (0, rt.jsx)("div", {
            className: "absolute left-2 top-2 chip",
            style: { background: "rgba(0,0,0,.5)" },
            children: "AI video",
          }),
        ],
      });
}
function xR({ stories: t, start: e, onClose: a }) {
  let [r, o] = (0, ar.useState)(e),
    n = t[r];
  return (
    (0, ar.useEffect)(() => {
      let i = setTimeout(() => (r < t.length - 1 ? o(r + 1) : a()), 5e3);
      return () => clearTimeout(i);
    }, [r]),
    n
      ? (0, rt.jsx)("div", {
          className: "fixed inset-0 z-[70] grid place-items-center p-4",
          style: { background: "rgba(2,6,20,.82)" },
          onClick: a,
          children: (0, rt.jsxs)("div", {
            className:
              "relative w-full max-w-[380px] aspect-[9/16] rounded-3xl overflow-hidden fake-video pop-in",
            style: { "--h": n.hue },
            onClick: (i) => i.stopPropagation(),
            children: [
              (0, rt.jsx)("div", {
                className: "absolute top-3 left-3 right-3 flex gap-1",
                children: t.map((i, s) =>
                  (0, rt.jsx)(
                    "div",
                    {
                      className: "h-1 flex-1 rounded-full bg-white/25 overflow-hidden",
                      children: (0, rt.jsx)("div", {
                        className: "h-full bg-white",
                        style: {
                          width: s < r || s === r ? "100%" : "0%",
                          transition: s === r ? "width 5s linear" : "none",
                        },
                      }),
                    },
                    s,
                  ),
                ),
              }),
              (0, rt.jsxs)("div", {
                className: "absolute top-7 left-3 right-3 flex items-center gap-2",
                children: [
                  (0, rt.jsx)(Dr, { user: n.user, size: 32 }),
                  (0, rt.jsx)("div", { className: "text-sm font-bold", children: n.user.name }),
                  n.live &&
                    (0, rt.jsx)("span", {
                      className: "chip",
                      style: { background: "var(--rose)", color: "#fff" },
                      children: "LIVE",
                    }),
                  (0, rt.jsx)("button", {
                    className: "ml-auto",
                    onClick: a,
                    "aria-label": "Close",
                    children: (0, rt.jsx)(pe, { className: "text-xl" }),
                  }),
                ],
              }),
              (0, rt.jsxs)("div", {
                className: "absolute inset-x-0 bottom-0 p-5",
                style: { background: "linear-gradient(transparent, rgba(0,0,0,.75))" },
                children: [
                  (0, rt.jsx)("div", {
                    className: "font-display text-2xl font-bold leading-tight",
                    style: { textWrap: "balance" },
                    children: n.title,
                  }),
                  (0, rt.jsxs)("div", {
                    className: "flex gap-2 mt-4",
                    children: [
                      (0, rt.jsx)("button", {
                        className: "btn btn-ember btn-sm",
                        onClick: () => {
                          (n.live ? It("live") : (n.user.procedural && Is(n.user), yo(n.user.id), ca()), a());
                        },
                        children: n.live
                          ? "Join live"
                          : (0, rt.jsxs)(rt.Fragment, { children: [(0, rt.jsx)(Ma, {}), " Visit home"] }),
                      }),
                      (0, rt.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => o(Math.max(0, r - 1)),
                        children: "Prev",
                      }),
                      (0, rt.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => (r < t.length - 1 ? o(r + 1) : a()),
                        children: "Next",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        })
      : null
  );
}
function yR() {
  let t = Y(),
    [e, a] = (0, ar.useState)(null),
    [r, o] = (0, ar.useState)([]),
    n = (0, ar.useMemo)(() => {
      let i = t.lives
        .map((s) => ({ id: s.id, user: be(s.hostId), title: s.title, hue: 210, live: !0 }))
        .filter((s) => s.user);
      t.users
        .filter((s) => !s.procedural && s.id !== t.session?.userId)
        .forEach((s, l) =>
          i.push({
            id: "s-" + s.id,
            user: s,
            title: [
              `New drop from ${s.name.split(" ")[0]}: come see my 4D home`,
              "Behind the scenes of my latest agent",
              "Sunset run through Fyrus Central",
              "Hiring for a new AI project!",
            ][l % 4],
            hue: [210, 25, 195, 220][l % 4],
          }),
        );
      for (let s = 0; s < 6; s++) {
        let l = $c(s * 3 - 7, s * 5 - 9, s % 4);
        i.push({
          id: "s-" + l.id,
          user: l,
          title: [
            "Just reached a new level",
            "Look at my new dome",
            "Found a secret orb cluster",
            "My first agent sale!",
          ][s % 4],
          hue: 200 + s * 7,
        });
      }
      return i;
    }, [t.lives.length, t.users.length]);
  return (0, rt.jsxs)(rt.Fragment, {
    children: [
      (0, rt.jsx)("div", {
        className: "flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1",
        children: n.map((i, s) =>
          (0, rt.jsxs)(
            "button",
            {
              className: "flex flex-col items-center gap-1 w-16 shrink-0",
              onClick: () => {
                (a(s), o((l) => [...l, i.id]));
              },
              children: [
                (0, rt.jsx)("div", {
                  className: `story-ring ${r.includes(i.id) ? "seen" : ""}`,
                  children: (0, rt.jsx)("div", {
                    className: "rounded-full p-0.5",
                    style: { background: "var(--night)" },
                    children: (0, rt.jsx)(Dr, { user: i.user, size: 50 }),
                  }),
                }),
                (0, rt.jsx)("div", {
                  className: "text-[11px] truncate w-full text-center",
                  children: i.live
                    ? (0, rt.jsx)("b", { style: { color: "var(--rose)" }, children: "LIVE" })
                    : i.user.name.split(" ")[0],
                }),
              ],
            },
            i.id,
          ),
        ),
      }),
      e !== null && (0, rt.jsx)(xR, { stories: n, start: e, onClose: () => a(null) }),
    ],
  });
}
function kR() {
  let [t, e] = (0, ar.useState)("video"),
    [a, r] = (0, ar.useState)(""),
    [o, n] = (0, ar.useState)(""),
    [i, s] = (0, ar.useState)(null),
    l = (0, ar.useRef)(null);
  return (0, rt.jsxs)("form", {
    onSubmit: (h) => {
      (h.preventDefault(),
        a.trim() &&
          (t === "video"
            ? e8(a.trim(), i ? URL.createObjectURL(i) : void 0)
            : a8(t, a.trim(), o.trim() || a.trim()),
          r(""),
          n(""),
          s(null)));
    },
    className: "card p-4 space-y-3",
    children: [
      (0, rt.jsx)("div", {
        className: "flex gap-1.5 flex-wrap",
        children: [
          ["video", Ps, "AI Video"],
          ["article", gg, "Article"],
          ["question", lE, "Question"],
          ["portfolio", eE, "Portfolio"],
        ].map(([h, u, p]) =>
          (0, rt.jsxs)(
            "button",
            {
              type: "button",
              onClick: () => e(h),
              className: `chip ${t === h ? "chip-on" : ""}`,
              children: [(0, rt.jsx)(u, {}), " ", p],
            },
            h,
          ),
        ),
      }),
      (0, rt.jsx)("input", {
        id: "composer-title",
        className: "field",
        value: a,
        onChange: (h) => r(h.target.value),
        placeholder:
          t === "video"
            ? 'Title your AI video, e.g. "City flythrough at sunset"'
            : t === "question"
              ? "Ask the community anything about AI\u2026"
              : "Give it a title\u2026",
      }),
      t !== "video" &&
        (0, rt.jsx)("textarea", {
          id: "composer-body",
          className: "field",
          value: o,
          onChange: (h) => n(h.target.value),
          placeholder: t === "question" ? "Add some detail\u2026" : "Write your article or case study\u2026",
        }),
      (0, rt.jsxs)("div", {
        className: "flex items-center gap-2 flex-wrap",
        children: [
          t === "video" &&
            (0, rt.jsxs)(rt.Fragment, {
              children: [
                (0, rt.jsx)("input", {
                  ref: l,
                  type: "file",
                  accept: "video/*",
                  className: "hidden",
                  id: "composer-file",
                  onChange: (h) => s(h.target.files?.[0] || null),
                }),
                (0, rt.jsxs)("button", {
                  type: "button",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => l.current?.click(),
                  children: [
                    (0, rt.jsx)(eg, {}),
                    " ",
                    i ? i.name.slice(0, 22) : "Choose a video file (optional)",
                  ],
                }),
              ],
            }),
          (0, rt.jsx)("span", {
            className: "text-xs",
            style: { color: "var(--ink-dim)" },
            children: "+25 XP",
          }),
          (0, rt.jsxs)("button", {
            className: "btn btn-primary btn-sm ml-auto",
            disabled: !a.trim(),
            children: [(0, rt.jsx)(Da, {}), " Publish"],
          }),
        ],
      }),
    ],
  });
}
function bR({ a: t }) {
  let [e, a] = (0, ar.useState)(!1),
    [r, o] = (0, ar.useState)("");
  return (0, rt.jsxs)("div", {
    children: [
      (0, rt.jsx)("div", {
        className: "flex items-center gap-2 mb-1.5",
        children: (0, rt.jsx)("span", {
          className: "chip",
          style: {
            color:
              t.kind === "question"
                ? "var(--ember-hi)"
                : t.kind === "portfolio"
                  ? "var(--mint)"
                  : "var(--sky)",
          },
          children:
            t.kind === "question"
              ? "Q&A"
              : t.kind === "portfolio"
                ? "Portfolio"
                : `Article \xB7 ${t.readMins} min read`,
        }),
      }),
      (0, rt.jsx)("h4", {
        className: "font-display text-[15px] font-bold leading-snug",
        style: { textWrap: "balance" },
        children: t.title,
      }),
      (0, rt.jsx)("p", {
        className: "text-sm mt-1.5 whitespace-pre-line",
        style: { color: "var(--ink-dim)" },
        children: e ? t.body : t.excerpt,
      }),
      t.kind !== "question" &&
        (0, rt.jsx)("button", {
          className: "text-xs mt-1.5 font-bold",
          style: { color: "var(--sky)" },
          onClick: () => a((n) => !n),
          children: e ? "Show less" : "Read more",
        }),
      t.kind === "question" &&
        (0, rt.jsxs)("div", {
          className: "mt-3 space-y-2",
          children: [
            (t.answers || []).map((n, i) => {
              let s = be(n.userId);
              return (0, rt.jsxs)(
                "div",
                {
                  className: "flex gap-2 text-sm",
                  children: [
                    (0, rt.jsx)(Dr, { user: s, size: 24 }),
                    (0, rt.jsxs)("div", {
                      className: "rounded-xl px-3 py-2 flex-1",
                      style: {
                        background: "rgba(255,194,122,.07)",
                        border: "1px solid rgba(255,194,122,.2)",
                      },
                      children: [
                        (0, rt.jsx)("b", { children: s?.name }),
                        " ",
                        (0, rt.jsx)("span", {
                          className: "text-xs",
                          style: { color: "var(--ink-dim)" },
                          children: Ao(n.at),
                        }),
                        (0, rt.jsx)("div", { children: n.text }),
                      ],
                    }),
                  ],
                },
                i,
              );
            }),
            (0, rt.jsxs)("form", {
              className: "flex gap-2",
              onSubmit: (n) => {
                (n.preventDefault(), r8(t.id, r.trim()), o(""));
              },
              children: [
                (0, rt.jsx)("input", {
                  id: `ans-${t.id}`,
                  className: "field py-2",
                  value: r,
                  onChange: (n) => o(n.target.value),
                  placeholder: "Write an answer\u2026",
                }),
                (0, rt.jsx)("button", { className: "btn btn-sm btn-ghost", children: "Answer" }),
              ],
            }),
          ],
        }),
    ],
  });
}
function wR({ g: t }) {
  let e = Y(),
    a = Ah(t.id),
    r = a.likes.includes(e.session.userId);
  return (0, rt.jsxs)("article", {
    className: "card p-4 space-y-3",
    children: [
      (0, rt.jsxs)("div", {
        className: "flex items-center gap-2.5",
        children: [
          (0, rt.jsx)(Dr, { user: t.owner, size: 34 }),
          (0, rt.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [
              (0, rt.jsx)("div", { className: "text-sm font-bold truncate", children: t.owner.name }),
              (0, rt.jsxs)("div", {
                className: "text-xs truncate",
                style: { color: "var(--ink-dim)" },
                children: [t.owner.title, " \xB7 ", Ao(t.at)],
              }),
            ],
          }),
          (0, rt.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => {
              (Is(t.owner), yo(t.owner.id), ca());
            },
            children: [(0, rt.jsx)(Ma, {}), " Visit"],
          }),
        ],
      }),
      t.kind === "event"
        ? (0, rt.jsxs)("div", {
            className: "rounded-xl p-4 flex items-center gap-3",
            style: {
              background: "linear-gradient(120deg, rgba(77,163,255,.14), rgba(255,154,60,.12))",
              border: "1px solid var(--line)",
            },
            children: [
              (0, rt.jsx)(Ji, { className: "text-2xl shrink-0", style: { color: "var(--ember)" } }),
              (0, rt.jsxs)("div", {
                className: "font-bold",
                children: [t.owner.name.split(" ")[0], " ", t.title],
              }),
            ],
          })
        : (0, rt.jsxs)(rt.Fragment, {
            children: [
              (0, rt.jsxs)("div", {
                children: [
                  t.kind === "question" &&
                    (0, rt.jsx)("span", {
                      className: "chip mb-1.5",
                      style: { color: "var(--ember-hi)" },
                      children: "Q&A",
                    }),
                  t.kind === "article" &&
                    (0, rt.jsx)("span", {
                      className: "chip mb-1.5",
                      style: { color: "var(--sky)" },
                      children: "Article",
                    }),
                  (0, rt.jsx)("h4", {
                    className: "font-display text-[15px] font-bold leading-snug mt-1",
                    children: t.title,
                  }),
                  t.body &&
                    (0, rt.jsx)("p", {
                      className: "text-sm mt-1",
                      style: { color: "var(--ink-dim)" },
                      children: t.body,
                    }),
                ],
              }),
              t.kind === "video" &&
                (0, rt.jsxs)(rt.Fragment, {
                  children: [
                    (0, rt.jsx)($7, {
                      v: {
                        hue: t.hue,
                        duration: `${1 + (t.views % 9)}:${String(t.views % 60).padStart(2, "0")}`,
                      },
                    }),
                    (0, rt.jsxs)("div", {
                      className: "text-xs flex items-center gap-1",
                      style: { color: "var(--ink-dim)" },
                      children: [(0, rt.jsx)(si, {}), " ", co(t.views), " views"],
                    }),
                  ],
                }),
            ],
          }),
      (0, rt.jsxs)("div", {
        className: "flex gap-1",
        children: [
          (0, rt.jsxs)("button", {
            onClick: () => Pp(t.id),
            className: "btn btn-sm btn-ghost",
            style: r ? { color: "var(--rose)" } : {},
            children: [
              (0, rt.jsx)(dg, { style: { fill: r ? "var(--rose)" : "transparent" } }),
              " ",
              (0, rt.jsx)("span", { className: "tabular", children: co(t.likes + a.likes.length) }),
            ],
          }),
          (0, rt.jsxs)("button", {
            className: "btn btn-sm btn-ghost",
            children: [
              (0, rt.jsx)(Sn, {}),
              " ",
              (0, rt.jsx)("span", { className: "tabular", children: Math.floor(t.likes / 23) }),
            ],
          }),
          (0, rt.jsxs)("button", {
            onClick: () => Op(t.id),
            className: "btn btn-sm btn-ghost",
            children: [
              (0, rt.jsx)(ni, {}),
              " ",
              (0, rt.jsx)("span", { className: "tabular", children: a.shares + Math.floor(t.likes / 60) }),
            ],
          }),
        ],
      }),
    ],
  });
}
function oy() {
  let t = Y(),
    [e, a] = (0, ar.useState)("all"),
    [r, o] = (0, ar.useState)(12),
    n = (0, ar.useRef)(null);
  (0, ar.useEffect)(() => {
    let u = n.current;
    if (!u) return;
    let p = new IntersectionObserver(
      (v) => {
        v[0].isIntersecting && o((g) => g + 10);
      },
      { root: document.getElementById("hud-scroll"), rootMargin: "600px" },
    );
    return (p.observe(u), () => p.disconnect());
  }, [r, e]);
  let i = (0, ar.useMemo)(() => {
      let u = [];
      (t.videos.forEach((g) =>
        u.push({ kind: "video", id: g.id, at: g.createdAt, owner: g.ownerId, node: g }),
      ),
        t.articles.forEach((g) =>
          u.push({
            kind: g.kind === "question" ? "question" : "article",
            id: g.id,
            at: g.createdAt,
            owner: g.ownerId,
            node: g,
          }),
        ),
        t.agents.forEach((g) =>
          u.push({ kind: "agent", id: g.id, at: g.createdAt, owner: g.ownerId, node: g }),
        ),
        t.gigs.forEach((g) => u.push({ kind: "gig", id: g.id, at: g.createdAt, owner: g.ownerId, node: g })));
      let p = u.sort((g, m) => m.at - g.at);
      e !== "all" && (p = p.filter((g) => g.kind === e));
      let v = t.focus;
      if (v && (v.kind === "video" || v.kind === "article")) {
        let g = p.findIndex((m) => m.id === v.id);
        g > 0 && (p = [p[g], ...p.slice(0, g), ...p.slice(g + 1)]);
      }
      return p;
    }, [t.videos, t.articles, t.agents, t.gigs, e, t.focus]),
    s = (0, ar.useMemo)(
      () => Array.from({ length: r }, (u, p) => Fw(p)).filter((u) => e === "all" || u.kind === e),
      [r, e],
    ),
    l = [],
    c = 0,
    d = 0;
  for (; c < i.length || d < s.length; ) {
    c < i.length && l.push({ t: "real", v: i[c++] });
    for (let u = 0; u < (c <= 3 ? 1 : 2) && d < s.length; u++) l.push({ t: "gen", v: s[d++] });
  }
  return (0, rt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, rt.jsx)(yR, {}),
      (0, rt.jsx)(kR, {}),
      (0, rt.jsx)("div", {
        className: "flex gap-1.5 flex-wrap",
        children: [
          ["all", "For you"],
          ["video", "Videos"],
          ["article", "Articles"],
          ["question", "Q&A"],
          ["agent", "Agents"],
          ["gig", "Gigs"],
        ].map(([u, p]) =>
          (0, rt.jsx)(
            "button",
            { onClick: () => a(u), className: `chip ${e === u ? "chip-on" : ""}`, children: p },
            u,
          ),
        ),
      }),
      l.map((u) =>
        u.t === "gen"
          ? (0, rt.jsx)(wR, { g: u.v }, u.v.id)
          : (() => {
              let p = u.v;
              return (0, rt.jsxs)(
                "article",
                {
                  className: `card p-4 space-y-3 ${t.focus?.id === p.id ? "holo-edge" : ""}`,
                  children: [
                    (0, rt.jsx)(as, { userId: p.owner, at: p.at }),
                    p.kind === "video" &&
                      (0, rt.jsxs)(rt.Fragment, {
                        children: [
                          (0, rt.jsx)("h4", {
                            className: "font-display text-[15px] font-bold",
                            children: p.node.title,
                          }),
                          (0, rt.jsx)($7, { v: p.node }),
                          (0, rt.jsxs)("div", {
                            className: "text-xs flex items-center gap-1",
                            style: { color: "var(--ink-dim)" },
                            children: [
                              (0, rt.jsx)(si, {}),
                              " ",
                              p.node.views.toLocaleString("en-US"),
                              " views \xB7 also playing on the creator's home cinema screen",
                            ],
                          }),
                        ],
                      }),
                    (p.kind === "article" || p.kind === "question") && (0, rt.jsx)(bR, { a: p.node }),
                    p.kind === "agent" &&
                      (0, rt.jsxs)("button", {
                        className: "w-full text-left flex gap-3 items-center rounded-xl p-3",
                        style: {
                          background: "rgba(77,163,255,.07)",
                          border: "1px solid rgba(77,163,255,.25)",
                        },
                        onClick: () => {
                          (an("agent", p.id), It("market"));
                        },
                        children: [
                          (0, rt.jsx)("div", {
                            className: "w-12 h-12 rounded-xl grid place-items-center shrink-0",
                            style: { background: "linear-gradient(135deg, var(--blue-hi), var(--blue))" },
                            children: (0, rt.jsx)(Nr, { className: "text-2xl text-white" }),
                          }),
                          (0, rt.jsxs)("div", {
                            className: "min-w-0 flex-1",
                            children: [
                              (0, rt.jsxs)("div", {
                                className: "text-xs",
                                style: { color: "var(--sky)" },
                                children: ["New AI agent \xB7 ", p.node.category],
                              }),
                              (0, rt.jsx)("div", { className: "font-bold truncate", children: p.node.name }),
                              (0, rt.jsx)("div", {
                                className: "text-xs truncate",
                                style: { color: "var(--ink-dim)" },
                                children: p.node.tagline,
                              }),
                            ],
                          }),
                          (0, rt.jsx)("div", {
                            className: "font-display tabular",
                            children: q(p.node.price),
                          }),
                        ],
                      }),
                    p.kind === "gig" &&
                      (0, rt.jsxs)("button", {
                        className: "w-full text-left flex gap-3 items-center rounded-xl p-3",
                        style: {
                          background: "rgba(255,154,60,.07)",
                          border: "1px solid rgba(255,154,60,.25)",
                        },
                        onClick: () => {
                          (an("gig", p.id), It("gigs"));
                        },
                        children: [
                          (0, rt.jsx)("div", {
                            className: "w-12 h-12 rounded-xl grid place-items-center shrink-0",
                            style: { background: "linear-gradient(135deg, var(--ember-hi), var(--ember))" },
                            children: (0, rt.jsx)(hr, { className: "text-2xl text-[#2a1300]" }),
                          }),
                          (0, rt.jsxs)("div", {
                            className: "min-w-0 flex-1",
                            children: [
                              (0, rt.jsxs)("div", {
                                className: "text-xs",
                                style: { color: "var(--ember)" },
                                children: ["AI gig \xB7 ", p.node.category],
                              }),
                              (0, rt.jsx)("div", {
                                className: "font-bold text-sm leading-snug",
                                children: p.node.title,
                              }),
                            ],
                          }),
                          (0, rt.jsxs)("div", {
                            className: "text-right shrink-0",
                            children: [
                              (0, rt.jsx)("div", {
                                className: "text-[10px]",
                                style: { color: "var(--ink-dim)" },
                                children: "from",
                              }),
                              (0, rt.jsx)("div", {
                                className: "font-display tabular",
                                children: q(p.node.packages[0].price),
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, rt.jsx)(p0, { id: p.id, fallbackRating: p.node.rating || 0 }),
                  ],
                },
                p.id,
              );
            })(),
      ),
      (0, rt.jsxs)("div", {
        ref: n,
        className: "py-6 text-center text-xs",
        style: { color: "var(--ink-dim)" },
        children: [
          (0, rt.jsx)("span", {
            className: "eq inline-flex items-end h-5",
            children: [0, 1, 2, 3].map((u) =>
              (0, rt.jsx)("span", { style: { animationDelay: `${u * 0.1}s` } }, u),
            ),
          }),
          (0, rt.jsx)("div", { children: "Loading more from the city\u2026" }),
        ],
      }),
    ],
  });
}
var sn = P(Zt(), 1);
var gt = P(ct(), 1);
function MR({ a: t }) {
  let [e, a] = (0, sn.useState)([
      { me: !1, t: `Hi, I'm ${t.name}. ${t.tagline}. Give me something to try!` },
    ]),
    [r, o] = (0, sn.useState)(""),
    [n, i] = (0, sn.useState)(!1),
    s = (0, sn.useRef)(null);
  ((0, sn.useEffect)(() => {
    s.current?.scrollTo({ top: 1e6, behavior: "smooth" });
  }, [e, n]),
    (0, sn.useEffect)(() => {
      a([{ me: !1, t: `Hi, I'm ${t.name}. ${t.tagline}. Give me something to try!` }]);
    }, [t.id]));
  let l = {
      research: "Market size of AI startups in Europe",
      email: "Reply to a client asking to reschedule",
      voice: "I need a dentist appointment",
      prompt: "A prompt for a support bot",
      vision: "Shelf photo from aisle 4",
      story: "A robot lost in a neon city",
    },
    c = (d) => {
      !d.trim() ||
        n ||
        (a((h) => [...h, { me: !0, t: d }]),
        o(""),
        i(!0),
        setTimeout(
          () => {
            (a((h) => [...h, { me: !1, t: rd(t.persona, d) }]), i(!1));
          },
          900 + Math.random() * 700,
        ));
    };
  return (0, gt.jsxs)("div", {
    className: "rounded-2xl overflow-hidden",
    style: { border: "1px solid rgba(77,163,255,.35)", background: "rgba(2,8,26,.6)" },
    children: [
      (0, gt.jsxs)("div", {
        className: "px-3 py-2 text-xs flex items-center gap-2",
        style: { background: "rgba(77,163,255,.1)", color: "var(--sky)" },
        children: [(0, gt.jsx)(Ji, {}), " Live sandbox demo \xB7 free to try (scripted replies)"],
      }),
      (0, gt.jsxs)("div", {
        ref: s,
        className: "p-3 space-y-2 h-56 scroll-y",
        children: [
          e.map((d, h) =>
            (0, gt.jsx)(
              "div",
              {
                className: `flex ${d.me ? "justify-end" : ""}`,
                children: (0, gt.jsx)("div", {
                  className: "rounded-2xl px-3 py-2 text-sm max-w-[85%] whitespace-pre-line",
                  style: d.me
                    ? { background: "linear-gradient(120deg, var(--blue-hi), var(--blue))", color: "#fff" }
                    : { background: "rgba(255,255,255,.07)" },
                  children: d.t,
                }),
              },
              h,
            ),
          ),
          n &&
            (0, gt.jsxs)("div", {
              className: "text-xs",
              style: { color: "var(--ink-dim)" },
              children: [t.name, " is thinking\u2026"],
            }),
        ],
      }),
      (0, gt.jsx)("div", {
        className: "px-3 pb-2",
        children: (0, gt.jsxs)("button", {
          className: "chip",
          onClick: () => c(l[t.persona] || "Hello"),
          children: ['Try: "', l[t.persona] || "Hello", '"'],
        }),
      }),
      (0, gt.jsxs)("form", {
        className: "flex gap-2 p-3 pt-1",
        onSubmit: (d) => {
          (d.preventDefault(), c(r));
        },
        children: [
          (0, gt.jsx)("input", {
            id: "sandbox-input",
            className: "field py-2",
            value: r,
            onChange: (d) => o(d.target.value),
            placeholder: "Message the agent\u2026",
          }),
          (0, gt.jsx)("button", {
            className: "btn btn-primary btn-sm",
            "aria-label": "Send",
            children: (0, gt.jsx)(Da, {}),
          }),
        ],
      }),
    ],
  });
}
function ER({ a: t }) {
  let e = Y(),
    [a, r] = (0, sn.useState)(!1),
    o = K2(t.id),
    n = t.ownerId === e.session?.userId,
    i = e.scene.mode === "home" && e.scene.owner && e.scene.owner !== t.ownerId ? e.scene.owner : void 0,
    s = e.affLinks.some((l) => l.userId === e.session?.userId && l.itemId === t.id);
  return (0, gt.jsxs)("div", {
    className: "card holo-edge p-4 space-y-4 pop-in",
    children: [
      (0, gt.jsxs)("div", {
        className: "flex gap-3 items-start",
        children: [
          (0, gt.jsx)("div", {
            className: "w-14 h-14 rounded-2xl grid place-items-center shrink-0",
            style: { background: `linear-gradient(135deg, ${be(t.ownerId)?.color}, var(--blue))` },
            children: (0, gt.jsx)(Nr, { className: "text-3xl text-white" }),
          }),
          (0, gt.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [
              (0, gt.jsx)("div", {
                className: "text-xs font-mono uppercase tracking-widest",
                style: { color: "var(--sky)" },
                children: t.category,
              }),
              (0, gt.jsx)("h3", { className: "font-display text-xl font-bold", children: t.name }),
              (0, gt.jsx)("p", {
                className: "text-sm",
                style: { color: "var(--ink-dim)" },
                children: t.tagline,
              }),
              (0, gt.jsxs)("div", {
                className: "flex items-center gap-2 mt-1.5 text-xs",
                style: { color: "var(--ink-dim)" },
                children: [
                  (0, gt.jsx)(nx, { value: t.rating, size: 13 }),
                  " ",
                  t.rating || "new",
                  " \xB7 ",
                  t.reviews,
                  " reviews \xB7 ",
                  t.sales.toLocaleString(),
                  " sales",
                ],
              }),
            ],
          }),
        ],
      }),
      (0, gt.jsx)(as, { userId: t.ownerId }),
      (0, gt.jsx)("div", {
        className: "flex gap-1.5 flex-wrap",
        children: t.skills.map((l) => (0, gt.jsx)("span", { className: "chip", children: l }, l)),
      }),
      (0, gt.jsx)(MR, { a: t }),
      (0, gt.jsxs)("div", {
        className: "flex items-center gap-2 flex-wrap",
        children: [
          (0, gt.jsxs)("div", {
            className: "font-display text-2xl tabular mr-auto",
            children: [
              q(t.price),
              (0, gt.jsx)("span", {
                className: "text-xs ml-1",
                style: { color: "var(--ink-dim)" },
                children: "one-time",
              }),
            ],
          }),
          n
            ? (0, gt.jsx)("span", { className: "chip chip-on", children: "Your agent" })
            : o
              ? (0, gt.jsxs)("span", {
                  className: "chip chip-on",
                  children: [(0, gt.jsx)(_e, {}), " In your library"],
                })
              : (0, gt.jsxs)("button", {
                  className: "btn btn-primary",
                  onClick: () => Ph(t.id, i),
                  id: "buy-agent",
                  children: [(0, gt.jsx)(Yl, {}), " Buy now"],
                }),
        ],
      }),
      i &&
        !o &&
        (0, gt.jsxs)("div", {
          className: "text-xs",
          style: { color: "var(--ember-hi)" },
          children: [
            "You are buying from ",
            be(i)?.name,
            "'s home, so they earn a ",
            t.commission,
            "% affiliate commission.",
          ],
        }),
      (0, gt.jsxs)("div", {
        className: "rounded-xl p-3 space-y-2",
        style: { background: "rgba(255,154,60,.07)", border: "1px solid rgba(255,154,60,.28)" },
        children: [
          (0, gt.jsxs)("div", {
            className: "text-xs font-bold flex items-center gap-1.5",
            style: { color: "var(--ember-hi)" },
            children: [(0, gt.jsx)(ii, {}), " Affiliate \xB7 ", t.commission, "% commission on every sale"],
          }),
          s
            ? (0, gt.jsxs)("div", {
                className: "flex gap-2",
                children: [
                  (0, gt.jsx)("input", {
                    id: "aff-link",
                    readOnly: !0,
                    className: "field py-1.5 font-mono text-xs",
                    value: X2("agent", t.id),
                    onFocus: (l) => l.target.select(),
                  }),
                  (0, gt.jsx)("button", {
                    className: "btn btn-ghost btn-sm",
                    onClick: async () => {
                      (r(await Lg(X2("agent", t.id))), setTimeout(() => r(!1), 1500));
                    },
                    children: a ? (0, gt.jsx)(_e, {}) : (0, gt.jsx)(Kl, {}),
                  }),
                ],
              })
            : (0, gt.jsxs)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => Oh("agent", t.id),
                disabled: n,
                children: [(0, gt.jsx)(ii, {}), " Create affiliate link"],
              }),
        ],
      }),
      (0, gt.jsx)(p0, { id: t.id, fallbackRating: t.rating }),
    ],
  });
}
function LR({ onDone: t }) {
  let [e, a] = (0, sn.useState)({
      name: "",
      tagline: "",
      category: "Productivity",
      price: 29,
      commission: 25,
      persona: "research",
    }),
    r = (o, n) => a((i) => ({ ...i, [o]: n }));
  return (0, gt.jsxs)("form", {
    className: "card p-4 space-y-3 pop-in",
    onSubmit: (o) => {
      (o.preventDefault(),
        e.name.trim() && (UM({ ...e, price: Number(e.price), commission: Number(e.commission) }), t()));
    },
    children: [
      (0, gt.jsx)(Te, { kicker: "Creator \xB7 Sell once, earn forever", title: "Sell your AI agent" }),
      (0, gt.jsxs)("div", {
        children: [
          (0, gt.jsx)("label", { className: "label", htmlFor: "sa-name", children: "Agent name" }),
          (0, gt.jsx)("input", {
            id: "sa-name",
            className: "field",
            value: e.name,
            onChange: (o) => r("name", o.target.value),
            placeholder: "e.g. ContractLens",
          }),
        ],
      }),
      (0, gt.jsxs)("div", {
        children: [
          (0, gt.jsx)("label", {
            className: "label",
            htmlFor: "sa-tag",
            children: "What it does, in one line",
          }),
          (0, gt.jsx)("input", {
            id: "sa-tag",
            className: "field",
            value: e.tagline,
            onChange: (o) => r("tagline", o.target.value),
            placeholder: "Reads contracts and highlights risky clauses",
          }),
        ],
      }),
      (0, gt.jsxs)("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
          (0, gt.jsxs)("div", {
            children: [
              (0, gt.jsx)("label", { className: "label", htmlFor: "sa-cat", children: "Category" }),
              (0, gt.jsx)("select", {
                id: "sa-cat",
                className: "field",
                value: e.category,
                onChange: (o) => r("category", o.target.value),
                children: [
                  "Productivity",
                  "Research",
                  "Voice",
                  "Vision",
                  "Dev Tools",
                  "Creative",
                  "Sales",
                  "Legal",
                ].map((o) => (0, gt.jsx)("option", { children: o }, o)),
              }),
            ],
          }),
          (0, gt.jsxs)("div", {
            children: [
              (0, gt.jsx)("label", { className: "label", htmlFor: "sa-per", children: "Demo behaviour" }),
              (0, gt.jsx)("select", {
                id: "sa-per",
                className: "field",
                value: e.persona,
                onChange: (o) => r("persona", o.target.value),
                children: [
                  ["research", "Research"],
                  ["email", "Email"],
                  ["voice", "Voice"],
                  ["prompt", "Prompt"],
                  ["vision", "Vision"],
                  ["story", "Storyboard"],
                ].map(([o, n]) => (0, gt.jsx)("option", { value: o, children: n }, o)),
              }),
            ],
          }),
          (0, gt.jsxs)("div", {
            children: [
              (0, gt.jsx)("label", { className: "label", htmlFor: "sa-price", children: "Price ($)" }),
              (0, gt.jsx)("input", {
                id: "sa-price",
                type: "number",
                min: 1,
                className: "field",
                value: e.price,
                onChange: (o) => r("price", o.target.value),
              }),
            ],
          }),
          (0, gt.jsxs)("div", {
            children: [
              (0, gt.jsx)("label", { className: "label", htmlFor: "sa-com", children: "Affiliate %" }),
              (0, gt.jsx)("input", {
                id: "sa-com",
                type: "number",
                min: 0,
                max: 60,
                className: "field",
                value: e.commission,
                onChange: (o) => r("commission", o.target.value),
              }),
            ],
          }),
        ],
      }),
      (0, gt.jsx)("div", {
        className: "rounded-xl p-3 text-xs",
        style: { background: "rgba(255,255,255,.04)", color: "var(--ink-dim)" },
        children:
          "In production you upload your agent package or API spec here. Once published it appears on a hologram stand in your home.",
      }),
      (0, gt.jsxs)("div", {
        className: "flex gap-2 justify-end",
        children: [
          (0, gt.jsx)("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            onClick: t,
            children: "Cancel",
          }),
          (0, gt.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            children: [(0, gt.jsx)(Ti, {}), " Publish agent"],
          }),
        ],
      }),
    ],
  });
}
