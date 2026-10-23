function t5() {
  let t = Y(),
    e = t.net.status === "online",
    [, a] = (0, z0.useState)(0);
  ((0, z0.useEffect)(() => {
    Xc("now_open");
  }, []),
    (0, z0.useEffect)(() => {
      e &&
        (O.send({ t: "pol_state" }),
        O.send({ t: "hall_list" }),
        O.send({ t: "mk_list" }),
        O.send({ t: "news_state" }));
    }, [e]),
    (0, z0.useEffect)(() => {
      let p = setInterval(() => a((v) => v + 1), 5e3);
      return () => clearInterval(p);
    }, []));
  let r = Date.now(),
    o = t.halls?.events || [],
    n = o.filter((p) => p.start <= r && p.end > r),
    i = o.filter((p) => p.start > r && p.start < r + 24 * 36e5).slice(0, 4),
    s = _t()?.player.root.position,
    l = [...O.peers.values()],
    c = s ? l.filter((p) => p.sc === "plaza" && Math.hypot(p.x - s.x, p.z - s.z) < 80) : [],
    d = [
      ...(t.mk?.listings || [])
        .filter((p) => p.mode === "auction" && p.endsAt > r)
        .map((p) => ({
          id: p.id,
          title: p.title,
          price: p.topBid || p.price,
          ends: p.endsAt,
          open: () => ad("browse", p.id),
        })),
      ...Object.values(t.estate?.plots || {})
        .filter((p) => p.auction && p.auction.endsAt > r)
        .map((p) => ({
          id: p.id,
          title: `Plot ${p.id}`,
          price: p.auction.top || p.auction.start,
          ends: p.auction.endsAt,
          open: () => zo(void 0, p.id),
        })),
    ]
      .sort((p, v) => p.ends - v.ends)
      .slice(0, 5),
    h = (t.news?.fyrus || []).slice(0, 4),
    u = ({ icon: p, title: v, children: g }) =>
      (0, Ft.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, Ft.jsxs)("div", {
            className: "text-xs font-bold flex items-center gap-1.5 mb-2",
            children: [(0, Ft.jsx)(p, { style: { color: "var(--accent)" } }), " ", v],
          }),
          g,
        ],
      });
  return (0, Ft.jsxs)("div", {
    className: "space-y-3",
    "data-now": !0,
    children: [
      (0, Ft.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, Ft.jsx)("div", {
            className: "w-10 h-10 rounded-md grid place-items-center",
            style: { background: "#e5484d", color: "#fff" },
            children: (0, Ft.jsx)(Qi, {}),
          }),
          (0, Ft.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, Ft.jsx)("div", {
                className: "text-[10px] font-bold tracking-[.25em]",
                style: { color: "#e5484d" },
                children: "HAPPENING NOW",
              }),
              (0, Ft.jsx)("div", {
                className: "text-sm font-bold",
                children: e
                  ? `${t.net.online || 1} citizens online \xB7 ${c.length} near you \xB7 ${n.length} live event${n.length === 1 ? "" : "s"}`
                  : "Connecting to the live city\u2026",
              }),
            ],
          }),
        ],
      }),
      (0, Ft.jsxs)("div", {
        className: "grid grid-cols-3 gap-2",
        children: [
          (0, Ft.jsxs)("button", {
            className: "card p-2.5 text-left card-hover",
            onClick: () => _t()?.startTour(),
            children: [
              (0, Ft.jsx)(Li, { style: { color: "var(--accent)" } }),
              (0, Ft.jsx)("div", { className: "text-sm font-bold mt-1", children: "Drone tour" }),
              (0, Ft.jsx)("div", { className: "text-[11px]", style: In, children: "See the best places" }),
            ],
          }),
          (0, Ft.jsxs)("button", {
            className: "card p-2.5 text-left card-hover",
            onClick: () => It("map"),
            children: [
              (0, Ft.jsx)(Ds, { style: { color: "var(--accent)" } }),
              (0, Ft.jsx)("div", { className: "text-sm font-bold mt-1", children: "Map" }),
              (0, Ft.jsx)("div", { className: "text-[11px]", style: In, children: "Go anywhere" }),
            ],
          }),
          (0, Ft.jsxs)("button", {
            className: "card p-2.5 text-left card-hover",
            onClick: () => zo(),
            children: [
              (0, Ft.jsx)(Ma, { style: { color: "var(--accent)" } }),
              (0, Ft.jsx)("div", { className: "text-sm font-bold mt-1", children: "Free studio" }),
              (0, Ft.jsx)("div", { className: "text-[11px]", style: In, children: "Your first home" }),
            ],
          }),
        ],
      }),
      t.politics &&
        (0, Ft.jsxs)("button", {
          "data-now-election": !0,
          className: "card p-3 w-full text-left card-hover flex items-center gap-3",
          onClick: () => ai(t.politics.phase === "voting" ? "vote" : "election"),
          children: [
            (0, Ft.jsx)(Xi, { style: { color: "#b06ad9" } }),
            (0, Ft.jsxs)("span", {
              className: "flex-1 text-sm",
              children: [
                (0, Ft.jsxs)("b", { children: ["Election ", t.politics.n] }),
                " \xB7 ",
                t.politics.phase === "voting"
                  ? `voting open \xB7 ${t.politics.turnout} voted`
                  : `nominations open \xB7 ${t.politics.parties.length} parties`,
              ],
            }),
            (0, Ft.jsx)("span", { className: "text-[11px]", style: In, children: Qy(t.politics.until) }),
          ],
        }),
      (0, Ft.jsxs)(u, {
        icon: kg,
        title: "Events",
        children: [
          !n.length &&
            !i.length &&
            (0, Ft.jsxs)("div", {
              className: "text-xs",
              style: In,
              children: [
                "Nothing booked right now. Halls are open to walk in \u2014 or ",
                (0, Ft.jsx)("button", {
                  className: "underline",
                  onClick: () => En("book"),
                  children: "host the first event",
                }),
                ".",
              ],
            }),
          n.map((p) =>
            (0, Ft.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-sm py-1",
                children: [
                  (0, Ft.jsx)("span", {
                    className: "text-[10px] font-bold px-1.5 rounded text-white",
                    style: { background: "#e5484d" },
                    children: "LIVE",
                  }),
                  (0, Ft.jsxs)("span", {
                    className: "flex-1 truncate",
                    children: [
                      (0, Ft.jsx)("b", { children: p.title }),
                      " ",
                      (0, Ft.jsxs)("span", {
                        style: In,
                        children: ["\xB7 ", Ui(p.hall)?.name, " \xB7 ", p.going, " going"],
                      }),
                    ],
                  }),
                  (0, Ft.jsxs)("button", {
                    className: "btn btn-primary btn-xs",
                    onClick: () => Gs(p.hall),
                    children: [(0, Ft.jsx)(Wo, {}), " Go in"],
                  }),
                ],
              },
              p.id,
            ),
          ),
          i.map((p) =>
            (0, Ft.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-sm py-1",
                children: [
                  (0, Ft.jsxs)("span", {
                    className: "text-[11px] tabular w-14",
                    style: In,
                    children: ["in ", Qy(p.start)],
                  }),
                  (0, Ft.jsxs)("span", {
                    className: "flex-1 truncate",
                    children: [
                      p.title,
                      " ",
                      (0, Ft.jsxs)("span", { style: In, children: ["\xB7 ", p.price ? q(p.price) : "free"] }),
                    ],
                  }),
                  (0, Ft.jsx)("button", {
                    className: "btn btn-ghost btn-xs",
                    onClick: () => En("upcoming"),
                    children: "Details",
                  }),
                ],
              },
              p.id,
            ),
          ),
        ],
      }),
      (0, Ft.jsxs)(u, {
        icon: $e,
        title: `People near you (${c.length})`,
        children: [
          c.length
            ? (0, Ft.jsx)("div", {
                className: "flex flex-wrap gap-1.5",
                children: c
                  .slice(0, 16)
                  .map((p) =>
                    (0, Ft.jsxs)(
                      "span",
                      {
                        className: "chip",
                        children: [
                          (0, Ft.jsx)("span", {
                            className: "inline-block w-2 h-2 rounded-full mr-1",
                            style: { background: p.color },
                          }),
                          p.name,
                          p.vc ? " \u{1F399}" : "",
                        ],
                      },
                      p.id,
                    ),
                  ),
              })
            : (0, Ft.jsx)("div", {
                className: "text-xs",
                style: In,
                children: "Nobody within 80 m. The Core Plaza and Market street are the busiest places.",
              }),
          !!c.length &&
            (0, Ft.jsx)("div", {
              className: "text-[11px] mt-2",
              style: In,
              children: "Say hi in Nearby chat, or turn on your mic to talk.",
            }),
        ],
      }),
      (0, Ft.jsx)(u, {
        icon: Zl,
        title: "Auctions ending soon",
        children: d.length
          ? d.map((p) =>
              (0, Ft.jsxs)(
                "button",
                {
                  className: "w-full flex items-center gap-2 text-sm py-1 text-left",
                  onClick: p.open,
                  children: [
                    (0, Ft.jsx)("span", { className: "flex-1 truncate", children: p.title }),
                    (0, Ft.jsx)("span", { className: "tabular font-bold", children: q(p.price) }),
                    (0, Ft.jsx)("span", {
                      className: "text-[11px] tabular w-14 text-right",
                      style: In,
                      children: Qy(p.ends),
                    }),
                  ],
                },
                p.id,
              ),
            )
          : (0, Ft.jsxs)("div", {
              className: "text-xs",
              style: In,
              children: [
                "No live auctions. ",
                (0, Ft.jsx)("button", {
                  className: "underline",
                  onClick: () => ad("sell"),
                  children: "Start one",
                }),
                ".",
              ],
            }),
      }),
      (0, Ft.jsxs)(u, {
        icon: r0,
        title: "Latest from Fyrus News",
        children: [
          h.length
            ? h.map((p) =>
                (0, Ft.jsxs)(
                  "div",
                  {
                    className: "text-sm py-0.5",
                    children: [
                      (0, Ft.jsx)("b", {
                        style: { color: Mn[p.cat]?.color },
                        className: "text-[10px] tracking-[.15em]",
                        children: (Mn[p.cat]?.label || "").toUpperCase(),
                      }),
                      " ",
                      p.title,
                    ],
                  },
                  p.id,
                ),
              )
            : (0, Ft.jsx)("div", { className: "text-xs", style: In, children: "No stories yet today." }),
          (0, Ft.jsx)("button", {
            className: "btn btn-ghost btn-xs mt-2",
            onClick: () => Gh("tv"),
            children: "Watch Fyrus News TV",
          }),
        ],
      }),
    ],
  });
}
var Do = P(ct(), 1),
  qB = [
    {
      id: "explore",
      label: "Explore the city",
      sub: "Drone tour of the best places",
      icon: Li,
      go: () => _t()?.startTour(),
    },
    { id: "job", label: "Find a job", sub: "Open jobs and proposals", icon: hr, go: () => It("jobs") },
    { id: "hire", label: "Hire someone", sub: "Skill sellers and gigs", icon: hg, go: () => It("gigs") },
    {
      id: "sell",
      label: "Sell something",
      sub: "List it safely with escrow",
      icon: jo,
      go: () => ad("sell"),
    },
    { id: "agent", label: "Buy an AI agent", sub: "Try before you buy", icon: Nr, go: () => It("market") },
    { id: "play", label: "Play games", sub: "Race, chess, air hockey", icon: on, go: () => It("games") },
    { id: "learn", label: "Learn a skill", sub: "Courses and certificates", icon: cd, go: () => Vh() },
    { id: "meet", label: "Meet people", sub: "See what's happening now", icon: $e, go: () => Bp() },
    { id: "home", label: "Get a home", sub: "Free studio or a society plot", icon: Ma, go: () => zo() },
    {
      id: "business",
      label: "Start a business",
      sub: "Open your own shop",
      icon: e0,
      go: () => It("openshop"),
    },
  ];
function e5() {
  return (0, Do.jsx)("div", {
    className: "fixed inset-0 z-[66] grid place-items-center p-4",
    style: { background: "rgba(0,0,0,.55)" },
    role: "dialog",
    "aria-label": "What do you want to do in Fyrus?",
    children: (0, Do.jsxs)("div", {
      className: "glass rounded-xl p-5 w-full max-w-lg pop-in",
      children: [
        (0, Do.jsxs)("div", {
          className: "flex items-center gap-2",
          children: [
            (0, Do.jsx)(mg, { style: { color: "var(--ember)" } }),
            (0, Do.jsx)("h2", { className: "hud-font text-2xl", children: "WELCOME TO FYRUS" }),
          ],
        }),
        (0, Do.jsx)("div", {
          className: "text-sm mt-1",
          style: { color: "var(--ink-dim)" },
          children: "What do you want to do first? We'll take you there.",
        }),
        (0, Do.jsx)("div", {
          className: "grid grid-cols-2 gap-2 mt-4",
          children: qB.map((t) => {
            let e = t.icon;
            return (0, Do.jsxs)(
              "button",
              {
                "data-goal": t.id,
                className: "card p-2.5 text-left card-hover flex gap-2.5 items-start",
                onClick: () => {
                  (Sv(t.id), t.go());
                },
                children: [
                  (0, Do.jsx)(e, { className: "mt-0.5 shrink-0", style: { color: "var(--accent)" } }),
                  (0, Do.jsxs)("span", {
                    children: [
                      (0, Do.jsx)("span", { className: "block text-sm font-bold", children: t.label }),
                      (0, Do.jsx)("span", {
                        className: "block text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: t.sub,
                      }),
                    ],
                  }),
                ],
              },
              t.id,
            );
          }),
        }),
        (0, Do.jsx)("button", {
          id: "goal-skip",
          className: "btn btn-ghost btn-sm w-full mt-3",
          onClick: () => Sv(null),
          children: "I'll look around myself",
        }),
      ],
    }),
  });
}
var hs = P(Zt(), 1);
var xt = P(ct(), 1),
  Fo = { color: "var(--ink-dim)" },
  uf = (t) =>
    t
      ? new Date(t).toLocaleString(void 0, {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "\u2014";
function a5() {
  let t = Y(),
    [e, a] = (0, hs.useState)("stats"),
    [r, o] = (0, hs.useState)(null),
    [n, i] = (0, hs.useState)([]),
    [s, l] = (0, hs.useState)([]),
    [c, d] = (0, hs.useState)([]),
    [h, u] = (0, hs.useState)("");
  if (
    ((0, hs.useEffect)(() => {
      let g = [
        O.on("admin_stats", (m) => o(m)),
        O.on("admin_reports", (m) => i(m.list)),
        O.on("admin_users", (m) =>
          l((f) => {
            let y = new Set(m.list.map((x) => x.id));
            return [...m.list, ...f.filter((x) => !y.has(x.id))].slice(0, 30);
          }),
        ),
        O.on("admin_errors", (m) => d(m.list)),
        O.on("admin_stats_backups", (m) => o((f) => f && { ...f, backups: m.backups })),
      ];
      return (O.send({ t: "admin_stats" }), O.send({ t: "admin_reports" }), () => g.forEach((m) => m()));
    }, []),
    (0, hs.useEffect)(() => {
      (e === "errors" && O.send({ t: "admin_errors" }),
        e === "reports" && O.send({ t: "admin_reports" }),
        e === "stats" && O.send({ t: "admin_stats" }));
    }, [e]),
    !t.net.admin)
  )
    return (0, xt.jsxs)("div", {
      className: "card p-4 text-sm",
      children: [
        (0, xt.jsx)("b", { children: "Admins only." }),
        (0, xt.jsx)("div", {
          style: Fo,
          children: "Add your +2040 number to FYRUS_ADMINS in the server settings to become a Fyrus judge.",
        }),
      ],
    });
  let p = async () => {
      let g = await fetch("/api/admin/backup", { headers: { authorization: "Bearer " + (O.token || "") } });
      if (!g.ok) return alert("Download failed.");
      let m = await g.blob(),
        f = document.createElement("a");
      ((f.href = URL.createObjectURL(m)),
        (f.download =
          (g.headers.get("content-disposition") || "").match(/filename="([^"]+)"/)?.[1] ||
          "fyrus-backup.json.gz"),
        f.click(),
        setTimeout(() => URL.revokeObjectURL(f.href), 2e3));
    },
    v = ({ u: g }) =>
      (0, xt.jsxs)("div", {
        className: "card p-3",
        "data-admin-user": g.id,
        children: [
          (0, xt.jsxs)("div", {
            className: "flex items-center gap-2 text-sm",
            children: [
              (0, xt.jsx)("span", {
                className: `w-2 h-2 rounded-full ${g.online ? "" : "opacity-30"}`,
                style: { background: "#45e0ae" },
              }),
              (0, xt.jsx)("b", { children: g.name }),
              (0, xt.jsx)("span", { style: Fo, children: g.number }),
              g.email && (0, xt.jsxs)("span", { style: Fo, children: ["\xB7 ", g.email] }),
              g.banned &&
                (0, xt.jsx)("span", { className: "chip", style: { color: "#ffb3c2" }, children: "banned" }),
              g.muteUntil > Date.now() && (0, xt.jsx)("span", { className: "chip", children: "muted" }),
            ],
          }),
          (0, xt.jsxs)("div", {
            className: "text-[11px] mt-1",
            style: Fo,
            children: [
              "Joined ",
              uf(g.joined),
              " \xB7 last seen ",
              uf(g.seen),
              " \xB7 ",
              g.bal !== null ? q(g.bal) : "no bank account",
              " \xB7 ",
              g.xp,
              " XP \xB7 ",
              g.reports,
              " report",
              g.reports === 1 ? "" : "s",
              " against",
            ],
          }),
          (0, xt.jsxs)("div", {
            className: "flex gap-1.5 mt-2 flex-wrap",
            children: [
              g.muteUntil > Date.now()
                ? (0, xt.jsx)("button", {
                    className: "btn btn-ghost btn-xs",
                    onClick: () => O.send({ t: "admin_unmute", id: g.id }),
                    children: "Unmute",
                  })
                : (0, xt.jsxs)("button", {
                    className: "btn btn-ghost btn-xs",
                    onClick: () => O.send({ t: "admin_mute", id: g.id, hours: 24 }),
                    children: [(0, xt.jsx)(sd, {}), " Mute 24 h"],
                  }),
              g.banned
                ? (0, xt.jsx)("button", {
                    className: "btn btn-ghost btn-xs",
                    onClick: () => O.send({ t: "admin_unban", id: g.id }),
                    children: "Lift ban",
                  })
                : (0, xt.jsxs)(xt.Fragment, {
                    children: [
                      (0, xt.jsxs)("button", {
                        className: "btn btn-ghost btn-xs",
                        onClick: () => {
                          let m = prompt("Reason for a 7-day suspension?");
                          m && O.send({ t: "admin_ban", id: g.id, hours: 168, reason: m });
                        },
                        children: [(0, xt.jsx)(bg, {}), " Suspend 7 days"],
                      }),
                      (0, xt.jsx)("button", {
                        className: "btn btn-ghost btn-xs",
                        style: { color: "#ffb3c2" },
                        onClick: () => {
                          let m = prompt("Reason for a permanent ban?");
                          m && O.send({ t: "admin_ban", id: g.id, hours: 0, reason: m });
                        },
                        children: "Ban",
                      }),
                    ],
                  }),
            ],
          }),
        ],
      });
  return (0, xt.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, xt.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, xt.jsx)(O8, { style: { color: "#e5484d" } }),
          (0, xt.jsxs)("div", {
            children: [
              (0, xt.jsx)("div", {
                className: "text-[10px] font-bold tracking-[.25em]",
                style: { color: "#e5484d" },
                children: "FYRUS ADMIN DESK",
              }),
              (0, xt.jsx)("div", {
                className: "text-sm font-bold",
                children: "Moderation, numbers and backups",
              }),
            ],
          }),
        ],
      }),
      (0, xt.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          ["stats", "Overview", ax],
          ["reports", `Reports${r ? ` (${r.openReports})` : ""}`, Fs],
          ["users", "Users", $e],
          ["errors", "Errors", uE],
          ["growth", "Growth", ax],
          ["support", "Help desk", Fs],
          ["pay", "Payments", ax],
          ["ai", "AI", ax],
          ["brain", "Brain", ax],
        ].map(([g, m, f]) =>
          (0, xt.jsxs)(
            "button",
            {
              "data-admin-tab": g,
              className: `chip ${e === g ? "chip-on" : ""}`,
              onClick: () => a(g),
              children: [(0, xt.jsx)(f, { className: "inline" }), " ", m],
            },
            g,
          ),
        ),
      }),
      e === "brain" &&
        (0, xt.jsx)("div", {
          className: "card p-3",
          ref: (g) => {
            g && window.__fyrusBrain && window.__fyrusBrain.mountSheet && window.__fyrusBrain.mountSheet(g);
          },
        }),
      e === "ai" &&
        (0, xt.jsx)("div", {
          className: "card p-3",
          ref: (g) => {
            g && window.__fyrusBrain && window.__fyrusBrain.mountAdmin && window.__fyrusBrain.mountAdmin(g);
          },
        }),
      e === "pay" &&
        (0, xt.jsx)("div", {
          className: "card p-3",
          ref: (g) => {
            g && window.__fyrusPay && window.__fyrusPay.mountAdmin(g);
          },
        }),
      e === "support" &&
        (0, xt.jsx)("div", {
          className: "card p-3",
          ref: (g) => {
            g && window.__fyrusHelp && window.__fyrusHelp.mountAdmin(g);
          },
        }),
      e === "growth" &&
        (0, xt.jsx)("div", {
          className: "card p-3",
          ref: (g) => {
            g && window.__fyrusGrowth && window.__fyrusGrowth.mount(g);
          },
        }),
      e === "stats" &&
        (r
          ? (0, xt.jsxs)(xt.Fragment, {
              children: [
                (0, xt.jsx)("div", {
                  className: "grid grid-cols-3 gap-2",
                  children: [
                    ["Citizens", r.users],
                    ["With email/Google", r.withEmail],
                    ["Online now", r.online],
                    ["Treasury", q(r.treasury)],
                    ["Billboard revenue", q(r.adRevenue)],
                    ["Banned", r.banned],
                  ].map(([g, m]) =>
                    (0, xt.jsxs)(
                      "div",
                      {
                        className: "card p-2.5",
                        children: [
                          (0, xt.jsx)("div", { className: "font-bold tabular", children: m }),
                          (0, xt.jsx)("div", { className: "text-[10px]", style: Fo, children: g }),
                        ],
                      },
                      g,
                    ),
                  ),
                }),
                (0, xt.jsxs)("div", {
                  className: "card p-3",
                  children: [
                    (0, xt.jsx)("div", { className: "text-xs font-bold mb-1", children: "Last 14 days" }),
                    (0, xt.jsxs)("table", {
                      className: "w-full text-[12px] tabular",
                      children: [
                        (0, xt.jsx)("thead", {
                          children: (0, xt.jsxs)("tr", {
                            style: Fo,
                            children: [
                              (0, xt.jsx)("th", { className: "text-left font-normal", children: "Day" }),
                              (0, xt.jsx)("th", { className: "text-right font-normal", children: "Visits" }),
                              (0, xt.jsx)("th", { className: "text-right font-normal", children: "New" }),
                              (0, xt.jsx)("th", {
                                className: "text-right font-normal",
                                children: "Accounts",
                              }),
                              (0, xt.jsx)("th", {
                                className: "text-right font-normal",
                                children: "Peak online",
                              }),
                            ],
                          }),
                        }),
                        (0, xt.jsx)("tbody", {
                          children: r.days.map((g) =>
                            (0, xt.jsxs)(
                              "tr",
                              {
                                children: [
                                  (0, xt.jsx)("td", { children: g.day.slice(5) }),
                                  (0, xt.jsx)("td", { className: "text-right", children: g.visits }),
                                  (0, xt.jsx)("td", { className: "text-right", children: g.newUsers }),
                                  (0, xt.jsx)("td", { className: "text-right", children: g.signups }),
                                  (0, xt.jsx)("td", { className: "text-right", children: g.peak }),
                                ],
                              },
                              g.day,
                            ),
                          ),
                        }),
                      ],
                    }),
                    r.days[0] &&
                      Object.keys(r.days[0].events || {}).length > 0 &&
                      (0, xt.jsxs)("div", {
                        className: "text-[11px] mt-2",
                        style: Fo,
                        children: [
                          "Today: ",
                          Object.entries(r.days[0].events)
                            .map(([g, m]) => `${g} ${m}`)
                            .join(" \xB7 "),
                        ],
                      }),
                  ],
                }),
                (0, xt.jsxs)("div", {
                  className: "card p-3",
                  children: [
                    (0, xt.jsxs)("div", {
                      className: "text-xs font-bold mb-1 flex items-center gap-1.5",
                      children: [(0, xt.jsx)(ax, {}), " Backups (hourly for 48 h, daily for 14 days)"],
                    }),
                    r.storage &&
                      (0, xt.jsxs)("div", {
                        className: "text-[11px] mb-1.5",
                        style: Fo,
                        children: [
                          "Loaded from ",
                          r.storage.loadedFrom || "new database",
                          " \xB7 last save ",
                          r.storage.savedAt ? new Date(r.storage.savedAt).toLocaleTimeString() : "\u2014",
                          " \xB7 hourly copies ",
                          r.storage.hourly || 0,
                          r.storage.saveErrors ? ` \xB7 save errors ${r.storage.saveErrors}` : "",
                          r.storage.guarded ? ` \xB7 SAVE GUARD tripped ${r.storage.guarded}x (check fyrus.suspect.json)` : "",
                          " \xB7 off-site: ",
                          r.storage.offsiteTo
                            ? r.storage.offsite && r.storage.offsite.day
                              ? `e-mailed ${r.storage.offsite.day} to ${r.storage.offsiteTo}`
                              : `to ${r.storage.offsiteTo}, not sent yet${r.storage.offsite && r.storage.offsite.lastError ? " (" + r.storage.offsite.lastError + ")" : ""}`
                            : "not set (add BACKUP_EMAIL in Coolify)",
                        ],
                      }),
                    r.backups
                      .slice(0, 5)
                      .map((g) =>
                        (0, xt.jsxs)(
                          "div",
                          {
                            className: "text-[12px] flex justify-between",
                            children: [
                              (0, xt.jsx)("span", { children: g.file }),
                              (0, xt.jsxs)("span", {
                                style: Fo,
                                children: [Math.round(g.size / 1024), " KB"],
                              }),
                            ],
                          },
                          g.file,
                        ),
                      ),
                    (0, xt.jsxs)("div", {
                      className: "flex gap-2 mt-2",
                      children: [
                        (0, xt.jsx)("button", {
                          className: "btn btn-ghost btn-xs",
                          onClick: () => O.send({ t: "admin_backup" }),
                          children: "Back up now",
                        }),
                        (0, xt.jsxs)("button", {
                          id: "admin-download",
                          className: "btn btn-primary btn-xs",
                          onClick: p,
                          children: [(0, xt.jsx)(c0, {}), " Download newest"],
                        }),
                      ],
                    }),
                    (0, xt.jsx)("div", {
                      className: "text-[11px] mt-1.5",
                      style: Fo,
                      children: "Set BACKUP_EMAIL in Coolify to get a copy by e-mail every day. You can also download one here.",
                    }),
                    r.modlog &&
                      r.modlog.length > 0 &&
                      (0, xt.jsxs)("div", {
                        className: "text-[11px] mt-2",
                        style: Fo,
                        children: [
                          (0, xt.jsx)("b", { children: "Recent moderation" }),
                          r.modlog.map((g, i) =>
                            (0, xt.jsx)(
                              "div",
                              { children: `${new Date(g.at).toLocaleString()} \xB7 ${g.byName} (${g.role}) \xB7 ${g.act} ${g.target}${g.hours ? " \xB7 " + g.hours + " h" : ""}${g.note ? " \xB7 " + g.note : ""}` },
                              i,
                            ),
                          ),
                        ],
                      }),
                  ],
                }),
              ],
            })
          : (0, xt.jsx)("div", { className: "card p-4 text-sm", style: Fo, children: "Loading\u2026" })),
      e === "reports" &&
        (0, xt.jsxs)("div", {
          className: "space-y-2",
          children: [
            !n.length &&
              (0, xt.jsx)("div", { className: "card p-4 text-sm", style: Fo, children: "No open reports." }),
            n.map((g) =>
              (0, xt.jsxs)(
                "div",
                {
                  className: "card p-3",
                  "data-report": g.i,
                  children: [
                    (0, xt.jsxs)("div", {
                      className: "text-sm",
                      children: [
                        (0, xt.jsx)("b", { children: g.againstName }),
                        " ",
                        (0, xt.jsxs)("span", {
                          style: Fo,
                          children: ["(", g.againstNumber, ") reported by ", g.byName, " \xB7 ", uf(g.at)],
                        }),
                      ],
                    }),
                    g.reason &&
                      (0, xt.jsxs)("div", {
                        className: "text-xs mt-1",
                        children: ["\u201C", g.reason, "\u201D"],
                      }),
                    g.msg &&
                      (0, xt.jsx)("div", {
                        className: "text-xs mt-1 rounded p-2",
                        style: { background: "rgba(255,255,255,.04)" },
                        children: g.msg,
                      }),
                    (0, xt.jsxs)("div", {
                      className: "flex gap-1.5 mt-2 flex-wrap",
                      children: [
                        (0, xt.jsxs)("button", {
                          className: "btn btn-ghost btn-xs",
                          onClick: () => {
                            (O.send({ t: "admin_find", q: g.against }), a("users"));
                          },
                          children: [(0, xt.jsx)(Mi, {}), " Open user"],
                        }),
                        (0, xt.jsxs)("button", {
                          className: "btn btn-ghost btn-xs",
                          onClick: () => {
                            (O.send({ t: "admin_report_done", i: g.i, note: "no action" }),
                              i((m) => m.filter((f) => f.i !== g.i)));
                          },
                          children: [(0, xt.jsx)(_e, {}), " No action"],
                        }),
                        (0, xt.jsxs)("button", {
                          className: "btn btn-ghost btn-xs",
                          onClick: () => {
                            (O.send({ t: "admin_mute", id: g.against, hours: 24 }),
                              O.send({ t: "admin_report_done", i: g.i, note: "muted 24h" }),
                              i((m) => m.filter((f) => f.i !== g.i)));
                          },
                          children: [(0, xt.jsx)(sd, {}), " Mute 24 h + close"],
                        }),
                      ],
                    }),
                  ],
                },
                g.i,
              ),
            ),
          ],
        }),
      e === "users" &&
        (0, xt.jsxs)("div", {
          className: "space-y-2",
          children: [
            (0, xt.jsxs)("form", {
              className: "flex gap-2",
              onSubmit: (g) => {
                (g.preventDefault(), h.trim() && O.send({ t: "admin_find", q: h.trim() }));
              },
              children: [
                (0, xt.jsx)("input", {
                  id: "admin-q",
                  className: "field",
                  value: h,
                  onChange: (g) => u(g.target.value),
                  placeholder: "+2040 number, name or email",
                }),
                (0, xt.jsxs)("button", {
                  className: "btn btn-primary btn-sm",
                  children: [(0, xt.jsx)(Mi, {}), " Find"],
                }),
              ],
            }),
            s.map((g) => (0, xt.jsx)(v, { u: g }, g.id)),
          ],
        }),
      e === "errors" &&
        (0, xt.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            !c.length &&
              (0, xt.jsx)("div", {
                className: "card p-4 text-sm",
                style: Fo,
                children: "No errors reported. \u{1F389}",
              }),
            c.map((g, m) =>
              (0, xt.jsxs)(
                "details",
                {
                  className: "card p-2.5 text-[12px]",
                  children: [
                    (0, xt.jsxs)("summary", {
                      className: "cursor-pointer",
                      children: [
                        (0, xt.jsx)("b", { children: g.msg }),
                        " ",
                        (0, xt.jsxs)("span", { style: Fo, children: ["\xB7 ", uf(g.at), " \xB7 ", g.url] }),
                      ],
                    }),
                    (0, xt.jsxs)("pre", {
                      className: "whitespace-pre-wrap mt-1 text-[11px]",
                      style: Fo,
                      children: [
                        g.stack,
                        `
`,
                        g.ua,
                      ],
                    }),
                  ],
                },
                m,
              ),
            ),
          ],
        }),
    ],
  });
}
var gc = P(Zt(), 1);
var kt = P(ct(), 1),
  or = { color: "var(--ink-dim)" },
  B9 = (t) => {
    let e = Math.max(0, Math.round((t - Date.now()) / 6e4));
    return e >= 60 ? `${Math.floor(e / 60)}h ${e % 60}m` : `${e}m`;
  };
function r5({ list: t, value: e, onPick: a, name: r }) {
  return (0, kt.jsx)("div", {
    className: "flex gap-1 flex-wrap",
    "data-swatches": r,
    children: t.map((o) =>
      (0, kt.jsx)(
        "button",
        {
          "data-color": o,
          "aria-label": `${r} ${o}`,
          onClick: () => a(o),
          className: "w-6 h-6 rounded-md",
          style: {
            background: o,
            outline: e === o ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,.25)",
            outlineOffset: 1,
          },
        },
        o,
      ),
    ),
  });
}
function o5() {
  let t = Y(),
    e = t.net.status === "online",
    a = t.homeMine,
    [r, o] = (0, gc.useState)(t.homeFocus?.key || null);
  return (
    (0, gc.useEffect)(() => {
      e && (O.send({ t: "home_mine" }), O.send({ t: "est_mine" }));
    }, [e]),
    (0, gc.useEffect)(() => {
      t.homeFocus?.key && o(t.homeFocus.key);
    }, [t.homeFocus?.key]),
    e
      ? (0, kt.jsxs)("div", {
          className: "space-y-3",
          "data-homes": !0,
          children: [
            (0, kt.jsxs)("div", {
              className: "card p-3 flex items-center gap-3",
              children: [
                (0, kt.jsx)("div", {
                  className: "w-10 h-10 rounded-md grid place-items-center",
                  style: { background: "var(--accent)", color: "#fff" },
                  children: (0, kt.jsx)(Ma, {}),
                }),
                (0, kt.jsxs)("div", {
                  className: "flex-1",
                  children: [
                    (0, kt.jsx)("div", { className: "text-sm font-bold", children: "Homes & keys" }),
                    (0, kt.jsx)("div", {
                      className: "text-[12px]",
                      style: or,
                      children:
                        "Your home is private until you give someone a key. Visitors can knock; you decide who comes in.",
                    }),
                  ],
                }),
              ],
            }),
            t.knocks.length > 0 &&
              (0, kt.jsxs)("div", {
                className: "card p-3 space-y-1.5",
                style: { borderColor: "var(--ember)" },
                children: [
                  (0, kt.jsxs)("div", {
                    className: "text-xs font-bold flex items-center gap-1.5",
                    children: [(0, kt.jsx)(su, { style: { color: "var(--ember)" } }), " At your door"],
                  }),
                  t.knocks.map((n) =>
                    (0, kt.jsxs)(
                      "div",
                      {
                        className: "flex items-center gap-2 text-sm",
                        children: [
                          (0, kt.jsxs)("span", {
                            className: "flex-1",
                            children: [
                              (0, kt.jsx)("b", { children: n.from.name }),
                              " ",
                              (0, kt.jsxs)("span", { style: or, children: ["at ", n.label] }),
                            ],
                          }),
                          (0, kt.jsx)("button", {
                            className: "btn btn-primary btn-xs",
                            "data-letin": n.from.id,
                            onClick: () => Wh(n.key, n.from.id, !0),
                            children: "Let in (2 h)",
                          }),
                          (0, kt.jsx)("button", {
                            className: "btn btn-ghost btn-xs",
                            onClick: () => Wh(n.key, n.from.id, !1),
                            children: "Not now",
                          }),
                        ],
                      },
                      n.key + n.from.id,
                    ),
                  ),
                ],
              }),
            (0, kt.jsxs)("div", {
              className: "text-[11px] font-bold tracking-wide",
              style: or,
              children: ["MY HOMES (", a?.homes.length || 0, ")"],
            }),
            a
              ? a.homes.length
                ? a.homes.map((n) =>
                    (0, kt.jsx)(
                      ZB,
                      { h: n, open: r === n.key, toggle: () => o(r === n.key ? null : n.key) },
                      n.key,
                    ),
                  )
                : (0, kt.jsxs)("div", {
                    className: "card p-3 text-sm space-y-2",
                    children: [
                      (0, kt.jsx)("div", {
                        children:
                          "You don't have a home yet. Claim a free studio in Starter Commons, or buy or rent a house in a gated society.",
                      }),
                      (0, kt.jsxs)("div", {
                        className: "flex gap-2",
                        children: [
                          (0, kt.jsx)("button", {
                            className: "btn btn-primary btn-sm",
                            onClick: () => zo("starter"),
                            children: "Free studio",
                          }),
                          (0, kt.jsx)("button", {
                            className: "btn btn-ghost btn-sm",
                            onClick: () => zo(),
                            children: "Society houses",
                          }),
                        ],
                      }),
                    ],
                  })
              : (0, kt.jsx)("div", { className: "text-sm", style: or, children: "Loading\u2026" }),
            (0, kt.jsxs)("div", {
              className: "text-[11px] font-bold tracking-wide pt-1",
              style: or,
              children: ["HOMES I CAN VISIT (", a?.held.length || 0, ")"],
            }),
            a?.held.length
              ? a.held.map((n) =>
                  (0, kt.jsxs)(
                    "div",
                    {
                      className: "card p-2.5 flex items-center gap-2 text-sm",
                      "data-held": n.key,
                      children: [
                        (0, kt.jsx)(ho, { style: { color: "var(--ember)" } }),
                        (0, kt.jsxs)("span", {
                          className: "flex-1",
                          children: [
                            (0, kt.jsx)("b", { children: n.residentName }),
                            " ",
                            (0, kt.jsxs)("span", {
                              style: or,
                              children: [
                                "\xB7 ",
                                n.label,
                                " \xB7 ",
                                n.kind === "key" ? "you have a key" : `let in \xB7 ${B9(n.until)} left`,
                              ],
                            }),
                          ],
                        }),
                        (0, kt.jsxs)("button", {
                          className: "btn btn-primary btn-xs",
                          "data-visit": n.key,
                          onClick: () => Jn(n.key),
                          children: [(0, kt.jsx)(Wo, {}), " Go in"],
                        }),
                      ],
                    },
                    n.key,
                  ),
                )
              : (0, kt.jsx)("div", {
                  className: "text-[12px]",
                  style: or,
                  children: "When a friend gives you a key or lets you in, their home shows up here.",
                }),
          ],
        })
      : (0, kt.jsx)("div", {
          className: "card p-4 text-sm",
          style: or,
          children: "Homes, locks and keys are part of the live city on fyrus.io. Connecting\u2026",
        })
  );
}
function ZB({ h: t, open: e, toggle: a }) {
  let r = Y(),
    [o, n] = (0, gc.useState)(""),
    [i, s] = (0, gc.useState)(t.ext || sv),
    l = Oc(t.key) === "house";
  (0, gc.useEffect)(() => {
    s(t.ext || sv);
  }, [JSON.stringify(t.ext)]);
  let c = [...O.peers.values()].filter((h) => !t.keys.some((u) => u.id === h.id) && !h.mk).slice(0, 8),
    d = gp.find((h) => h.id === t.lock) || gp[0];
  return (0, kt.jsxs)("div", {
    className: "card p-3 space-y-2.5",
    "data-home": t.key,
    children: [
      (0, kt.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, kt.jsx)(Ma, { style: { color: "var(--accent)" } }),
          (0, kt.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, kt.jsx)("div", { className: "text-sm font-bold", children: t.label }),
              (0, kt.jsxs)("div", {
                className: "text-[11px]",
                style: or,
                children: [
                  t.lock === "open"
                    ? (0, kt.jsx)(Q8, { className: "inline" })
                    : (0, kt.jsx)(Pr, { className: "inline" }),
                  " ",
                  d.name,
                  " \xB7 ",
                  t.keys.length,
                  " key",
                  t.keys.length === 1 ? "" : "s",
                  t.owner ? "" : " \xB7 renting",
                ],
              }),
            ],
          }),
          (0, kt.jsxs)("button", {
            className: "btn btn-primary btn-xs",
            "data-go-in": t.key,
            onClick: () => Jn(t.key),
            children: [(0, kt.jsx)(Wo, {}), " Go inside"],
          }),
          (0, kt.jsx)("button", {
            className: "btn btn-ghost btn-xs",
            "data-manage": t.key,
            onClick: a,
            children: e ? "Close" : "Manage",
          }),
        ],
      }),
      e &&
        (0, kt.jsxs)(kt.Fragment, {
          children: [
            (0, kt.jsxs)("div", {
              children: [
                (0, kt.jsx)("div", {
                  className: "text-[11px] font-bold mb-1",
                  style: or,
                  children: "SMART LOCK",
                }),
                (0, kt.jsx)("div", {
                  className: "grid grid-cols-3 gap-1.5",
                  children: gp.map((h) =>
                    (0, kt.jsxs)(
                      "button",
                      {
                        "data-lock": h.id,
                        className: `rounded-md p-2 text-left text-[12px] ${t.lock === h.id ? "chip-on" : ""}`,
                        style: { border: "1px solid var(--line)" },
                        onClick: () => BM(t.key, h.id),
                        children: [
                          (0, kt.jsx)("b", { className: "block", children: h.name }),
                          (0, kt.jsx)("span", { style: or, children: h.sub }),
                        ],
                      },
                      h.id,
                    ),
                  ),
                }),
              ],
            }),
            (0, kt.jsxs)("div", {
              children: [
                (0, kt.jsxs)("div", {
                  className: "text-[11px] font-bold mb-1 flex items-center gap-1",
                  style: or,
                  children: [(0, kt.jsx)(ho, {}), " KEYS"],
                }),
                t.keys.length
                  ? (0, kt.jsx)("div", {
                      className: "flex flex-wrap gap-1.5",
                      children: t.keys.map((h) =>
                        (0, kt.jsxs)(
                          "span",
                          {
                            className: "chip",
                            "data-key-holder": h.id,
                            children: [
                              h.name,
                              (0, kt.jsx)("button", {
                                className: "ml-1",
                                "aria-label": `Take back ${h.name}'s key`,
                                "data-unkey": h.id,
                                onClick: () => AM(t.key, h.id),
                                children: (0, kt.jsx)(pe, {}),
                              }),
                            ],
                          },
                          h.id,
                        ),
                      ),
                    })
                  : (0, kt.jsx)("div", {
                      className: "text-[12px]",
                      style: or,
                      children: "Nobody has a key yet.",
                    }),
                (0, kt.jsxs)("div", {
                  className: "flex gap-1.5 mt-1.5",
                  children: [
                    (0, kt.jsx)("input", {
                      id: "key-number",
                      className: "field py-1 text-sm flex-1",
                      placeholder: "Their +2040 number",
                      value: o,
                      onChange: (h) => n(h.target.value),
                    }),
                    (0, kt.jsxs)("button", {
                      id: "key-give",
                      className: "btn btn-ghost btn-sm",
                      disabled: o.replace(/\D/g, "").length < 7,
                      onClick: () => {
                        (Rv(t.key, { number: o }), n(""));
                      },
                      children: [(0, kt.jsx)(Os, {}), " Give key"],
                    }),
                  ],
                }),
                c.length > 0 &&
                  (0, kt.jsxs)("div", {
                    className: "flex flex-wrap gap-1 mt-1.5 items-center",
                    children: [
                      (0, kt.jsx)($e, { style: or }),
                      (0, kt.jsx)("span", { className: "text-[11px]", style: or, children: "Online now:" }),
                      c.map((h) =>
                        (0, kt.jsxs)(
                          "button",
                          {
                            className: "chip",
                            "data-key-peer": h.id,
                            onClick: () => Rv(t.key, { id: h.id }),
                            children: ["+ ", h.name],
                          },
                          h.id,
                        ),
                      ),
                    ],
                  }),
                t.passes?.length > 0 &&
                  (0, kt.jsxs)("div", {
                    className: "text-[11px] mt-1.5",
                    style: or,
                    children: [
                      "Let in for now: ",
                      t.passes.map((h) => `${h.name} (${B9(h.until)})`).join(", "),
                    ],
                  }),
              ],
            }),
            l &&
              (0, kt.jsxs)("div", {
                children: [
                  (0, kt.jsxs)("div", {
                    className: "text-[11px] font-bold mb-1 flex items-center gap-1",
                    style: or,
                    children: [(0, kt.jsx)(iu, {}), " OUTSIDE \xB7 EVERYONE SEES THIS"],
                  }),
                  (0, kt.jsxs)("div", {
                    className: "space-y-1.5 text-[12px]",
                    children: [
                      (0, kt.jsxs)("div", {
                        children: [
                          (0, kt.jsx)("span", { style: or, children: "Walls" }),
                          (0, kt.jsx)(r5, {
                            name: "wall",
                            list: pp,
                            value: i.wall,
                            onPick: (h) => s({ ...i, wall: h }),
                          }),
                        ],
                      }),
                      (0, kt.jsxs)("div", {
                        children: [
                          (0, kt.jsx)("span", { style: or, children: "Roof" }),
                          (0, kt.jsx)(r5, {
                            name: "roof",
                            list: Sw,
                            value: i.roof,
                            onPick: (h) => s({ ...i, roof: h }),
                          }),
                        ],
                      }),
                      (0, kt.jsxs)("div", {
                        children: [
                          (0, kt.jsx)("span", { style: or, children: "Porch & trim" }),
                          (0, kt.jsx)(r5, {
                            name: "trim",
                            list: Hw,
                            value: i.trim,
                            onPick: (h) => s({ ...i, trim: h }),
                          }),
                        ],
                      }),
                      (0, kt.jsxs)("div", {
                        className: "flex gap-1 flex-wrap items-center",
                        children: [
                          (0, kt.jsx)("span", { style: or, className: "mr-1", children: "Fence" }),
                          Nw.map((h) =>
                            (0, kt.jsx)(
                              "button",
                              {
                                "data-fence": h.id,
                                className: `chip ${i.fence === h.id ? "chip-on" : ""}`,
                                onClick: () => s({ ...i, fence: h.id }),
                                children: h.name,
                              },
                              h.id,
                            ),
                          ),
                        ],
                      }),
                      (0, kt.jsxs)("div", {
                        className: "flex gap-1 flex-wrap items-center",
                        children: [
                          (0, kt.jsx)("span", { style: or, className: "mr-1", children: "Garden" }),
                          Rw.map((h) =>
                            (0, kt.jsx)(
                              "button",
                              {
                                "data-garden": h.id,
                                className: `chip ${i.garden === h.id ? "chip-on" : ""}`,
                                onClick: () => s({ ...i, garden: h.id }),
                                children: h.name,
                              },
                              h.id,
                            ),
                          ),
                        ],
                      }),
                      window.__fyrusHome3D &&
                        (0, kt.jsx)("button", {
                          id: "ext-3d",
                          className: "btn btn-ghost btn-sm mr-2",
                          onClick: () =>
                            window.__fyrusHome3D.open({
                              mode: "exterior",
                              ext: i,
                              onSave: (x) => {
                                (s(x), zM(t.key, x));
                              },
                            }),
                          children: "Preview in 3D",
                        }),
                      (0, kt.jsxs)("button", {
                        id: "ext-save",
                        className: "btn btn-primary btn-sm",
                        onClick: () => zM(t.key, i),
                        children: [(0, kt.jsx)(iu, {}), " Paint my house"],
                      }),
                    ],
                  }),
                ],
              }),
            (0, kt.jsx)("div", {
              className: "text-[11px]",
              style: or,
              children:
                r.house?.key === t.key
                  ? "You are inside \u2014 press Decorate at the top."
                  : "Go inside and press Decorate to move furniture, paint the walls and change the floor.",
            }),
          ],
        }),
    ],
  });
}
var Yr = P(Zt(), 1);
var R = P(ct(), 1),
  fe = { color: "var(--ink-dim)" },
  j0 = (t, e = 0) => {
    let a = t - (Date.now() - e);
    if (a <= 0) return "now";
    let r = Math.floor(a / 864e5),
      o = Math.floor(a / 36e5) % 24,
      n = Math.floor(a / 6e4) % 60;
    return r ? `${r}d ${o}h` : o ? `${o}h ${n}m` : `${Math.max(1, n)}m`;
  },
  KB = [
    ["election", "Election", Xi],
    ["vote", "Vote", _e],
    ["parties", "Parties", Fs],
    ["run", "Stand for Mayor", n0],
    ["proposals", "Proposals", Jv],
    ["results", "Mayors & Parliament", $l],
    ["rules", "Rules", Ei],
  ],
  fc = ({ p: t, size: e = 28 }) =>
    (0, R.jsx)("span", {
      className: "rounded-md grid place-items-center font-bold shrink-0",
      style: {
        width: e,
        height: e,
        background: t?.color || "#555",
        color: t?.color2 || "#fff",
        fontSize: e * 0.5,
      },
      children: t?.symbol || "\u2022",
    }),
  A9 = ({ v: t, max: e, color: a }) =>
    (0, R.jsx)("div", {
      className: "h-1.5 rounded-full mt-1",
      style: { background: "rgba(255,255,255,.08)" },
      children: (0, R.jsx)("div", {
        className: "h-1.5 rounded-full",
        style: { width: `${e ? (t / e) * 100 : 0}%`, background: a },
      }),
    });
function n5() {
  let t = Y(),
    e = t.politics,
    a = t.polMe,
    r = t.net.status === "online",
    [o, n] = (0, Yr.useState)(t.polFocus?.tab || "election");
  return (
    (0, Yr.useEffect)(() => {
      t.polFocus?.tab && n(t.polFocus.tab);
    }, [t.polFocus?.tab, t.polFocus?.party]),
    (0, Yr.useEffect)(() => {
      r && O.send({ t: "pol_state" });
    }, [r]),
    r
      ? !e || !a
        ? (0, R.jsx)("div", { className: "text-sm", style: fe, children: "Loading the election\u2026" })
        : (0, R.jsxs)("div", {
            className: "space-y-3",
            "data-politics": !0,
            children: [
              (0, R.jsxs)("div", {
                className: "card p-3 flex items-center gap-3",
                children: [
                  (0, R.jsx)("div", {
                    className: "w-10 h-10 rounded-md grid place-items-center",
                    style: { background: "#b06ad9", color: "#fff" },
                    children: (0, R.jsx)(Xi, {}),
                  }),
                  (0, R.jsxs)("div", {
                    className: "flex-1 min-w-0",
                    children: [
                      (0, R.jsxs)("div", {
                        className: "text-[10px] font-bold tracking-[.25em]",
                        style: { color: "#b06ad9" },
                        children: [
                          "ELECTION ",
                          e.n,
                          " \xB7 ",
                          e.phase === "nominations" ? "NOMINATIONS OPEN" : "VOTING OPEN",
                        ],
                      }),
                      (0, R.jsxs)("div", {
                        className: "text-sm font-bold",
                        children: [
                          e.phase === "nominations"
                            ? `Voting opens in ${j0(e.until, e.skew)}`
                            : `Polls close in ${j0(e.until, e.skew)}`,
                          " \xB7 ",
                          e.turnout,
                          " voted \xB7 ",
                          e.parties.length,
                          " parties \xB7 ",
                          e.cands.filter((i) => !i.dq).length,
                          " candidates",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, R.jsx)("div", {
                className: "flex gap-1 flex-wrap",
                children: KB.map(([i, s, l]) =>
                  (0, R.jsxs)(
                    "button",
                    {
                      "data-pol-tab": i,
                      className: `chip ${o === i ? "chip-on" : ""}`,
                      onClick: () => n(i),
                      children: [(0, R.jsx)(l, {}), " ", s],
                    },
                    i,
                  ),
                ),
              }),
              o === "election" && (0, R.jsx)(XB, {}),
              o === "vote" && (0, R.jsx)(JB, {}),
              o === "parties" && (0, R.jsx)(QB, {}),
              o === "run" && (0, R.jsx)(eA, {}),
              o === "proposals" && (0, R.jsx)(aA, {}),
              o === "results" && (0, R.jsx)(rA, {}),
              o === "rules" &&
                (0, R.jsxs)("div", {
                  className: "card p-3 space-y-1.5 text-[13px]",
                  children: [
                    S7.map((i, s) =>
                      (0, R.jsxs)(
                        "div",
                        {
                          className: "flex gap-2",
                          children: [
                            (0, R.jsxs)("span", {
                              className: "font-bold",
                              style: { color: "#b06ad9" },
                              children: [s + 1, "."],
                            }),
                            (0, R.jsx)("span", { children: i }),
                          ],
                        },
                        s,
                      ),
                    ),
                    (0, R.jsxs)("div", {
                      className: "text-[11px] pt-1",
                      style: fe,
                      children: [
                        "Fees go to the National Treasury: party ",
                        q(Zs.party),
                        " \xB7 nomination ",
                        q(Zs.nominate),
                        " \xB7 proposal ",
                        q(Zs.proposal),
                        ". Report vote buying with Report on the person.",
                      ],
                    }),
                  ],
                }),
            ],
          })
      : (0, R.jsx)("div", {
          className: "card p-4 text-sm",
          style: fe,
          children: "Elections run on the live city at fyrus.io. Connecting\u2026",
        })
  );
}
