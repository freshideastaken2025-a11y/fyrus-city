function ny() {
  let t = Y(),
    [e, a] = (0, sn.useState)(!1),
    [r, o] = (0, sn.useState)(""),
    [n, i] = (0, sn.useState)("All"),
    s = t.focus?.kind === "agent" ? t.focus.id : null,
    l = s ? t.agents.find((u) => u.id === s) : null,
    c = ["All", ...Array.from(new Set(t.agents.map((u) => u.category)))],
    d = t.agents.filter(
      (u) =>
        (n === "All" || u.category === n) && (u.name + u.tagline).toLowerCase().includes(r.toLowerCase()),
    ),
    h = t.orders
      .filter((u) => u.kind === "agent" && u.buyerId === t.session?.userId)
      .map((u) => t.agents.find((p) => p.id === u.itemId))
      .filter(Boolean);
  return (0, gt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, gt.jsxs)("div", {
        className: "flex gap-2 items-center",
        children: [
          (0, gt.jsxs)("div", {
            className: "relative flex-1",
            children: [
              (0, gt.jsx)(Mi, { className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60" }),
              (0, gt.jsx)("input", {
                id: "market-search",
                className: "field pl-9",
                value: r,
                onChange: (u) => o(u.target.value),
                placeholder: "Search AI agents\u2026",
              }),
            ],
          }),
          t.role === "freelancer" || e
            ? (0, gt.jsxs)("button", {
                className: "btn btn-primary",
                onClick: () => a((u) => !u),
                children: [(0, gt.jsx)(Na, {}), " Sell agent"],
              })
            : (0, gt.jsxs)("button", {
                className: "btn btn-ghost",
                onClick: () => a(!0),
                children: [(0, gt.jsx)(Na, {}), " Sell"],
              }),
        ],
      }),
      e && (0, gt.jsx)(LR, { onDone: () => a(!1) }),
      (0, gt.jsx)("div", {
        className: "flex gap-1.5 flex-wrap",
        children: c.map((u) =>
          (0, gt.jsx)(
            "button",
            { className: `chip ${n === u ? "chip-on" : ""}`, onClick: () => i(u), children: u },
            u,
          ),
        ),
      }),
      l && (0, gt.jsx)(ER, { a: l }),
      h.length > 0 &&
        t.role === "client" &&
        (0, gt.jsxs)("div", {
          className: "card p-3",
          children: [
            (0, gt.jsx)("div", { className: "label", children: "My agent library" }),
            (0, gt.jsx)("div", {
              className: "flex gap-1.5 flex-wrap",
              children: h.map((u) =>
                (0, gt.jsxs)(
                  "button",
                  {
                    className: "chip chip-on",
                    onClick: () => an("agent", u.id),
                    children: [(0, gt.jsx)(Nr, {}), " ", u.name],
                  },
                  u.id,
                ),
              ),
            }),
          ],
        }),
      (0, gt.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-3",
        children: d.map((u) => {
          let p = be(u.ownerId);
          return (0, gt.jsxs)(
            "button",
            {
              onClick: () => {
                (an("agent", u.id),
                  C({}),
                  document.getElementById("hud-scroll")?.scrollTo({ top: 0, behavior: "smooth" }));
              },
              className: `card card-hover p-4 text-left flex flex-col gap-2 ${s === u.id ? "chip-on" : ""}`,
              children: [
                (0, gt.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0, gt.jsx)("div", {
                      className: "w-9 h-9 rounded-xl grid place-items-center",
                      style: { background: `linear-gradient(135deg, ${p?.color}, var(--blue))` },
                      children: (0, gt.jsx)(Nr, { className: "text-lg text-white" }),
                    }),
                    (0, gt.jsxs)("div", {
                      className: "min-w-0",
                      children: [
                        (0, gt.jsx)("div", { className: "font-bold truncate", children: u.name }),
                        (0, gt.jsxs)("div", {
                          className: "text-[11px] truncate",
                          style: { color: "var(--ink-dim)" },
                          children: [p?.name, " \xB7 ", u.category],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, gt.jsx)("div", {
                  className: "text-sm leading-snug",
                  style: { color: "var(--ink-dim)" },
                  children: u.tagline,
                }),
                (0, gt.jsxs)("div", {
                  className: "flex items-center gap-2 mt-auto pt-1",
                  children: [
                    (0, gt.jsx)("span", { className: "font-display tabular", children: q(u.price) }),
                    (0, gt.jsxs)("span", {
                      className: "text-xs flex items-center gap-1",
                      style: { color: "var(--ember-hi)" },
                      children: ["\u2605 ", u.rating || "new"],
                    }),
                    (0, gt.jsxs)("span", {
                      className: "ml-auto chip",
                      style: { color: "var(--ember-hi)" },
                      children: [u.commission, "% aff"],
                    }),
                  ],
                }),
              ],
            },
            u.id,
          );
        }),
      }),
    ],
  });
}
var S0 = P(Zt(), 1);
var Dt = P(ct(), 1);
function CR({ g: t }) {
  let e = Y(),
    [a, r] = (0, S0.useState)("Standard"),
    o = t.packages.find((s) => s.tier === a),
    n = t.ownerId === e.session?.userId,
    i = e.scene.mode === "home" && e.scene.owner && e.scene.owner !== t.ownerId ? e.scene.owner : void 0;
  return (0, Dt.jsxs)("div", {
    className: "card holo-edge p-4 space-y-4 pop-in",
    children: [
      (0, Dt.jsx)("div", {
        className: "text-xs font-mono uppercase tracking-widest",
        style: { color: "var(--ember)" },
        children: t.category,
      }),
      (0, Dt.jsx)("h3", {
        className: "font-display text-lg font-bold leading-snug",
        style: { textWrap: "balance" },
        children: t.title,
      }),
      (0, Dt.jsx)(as, { userId: t.ownerId, extra: `${t.orders} orders` }),
      (0, Dt.jsx)("div", {
        role: "tablist",
        className: "grid grid-cols-3 rounded-xl overflow-hidden",
        style: { border: "1px solid var(--line)" },
        children: t.packages.map((s) =>
          (0, Dt.jsxs)(
            "button",
            {
              role: "tab",
              "aria-selected": a === s.tier,
              onClick: () => r(s.tier),
              className: "py-2.5 text-sm font-bold transition-colors",
              style:
                a === s.tier
                  ? { background: "rgba(255,154,60,.16)", color: "var(--ember)" }
                  : { color: "var(--ink-dim)" },
              children: [
                s.tier,
                (0, Dt.jsx)("div", {
                  className: "font-display text-base tabular",
                  style: { color: "var(--ink)" },
                  children: q(s.price),
                }),
              ],
            },
            s.tier,
          ),
        ),
      }),
      (0, Dt.jsxs)("ul", {
        className: "space-y-1.5 text-sm",
        children: [
          o.features.map((s) =>
            (0, Dt.jsxs)(
              "li",
              {
                className: "flex gap-2",
                children: [
                  (0, Dt.jsx)(_e, { className: "mt-0.5 shrink-0", style: { color: "var(--mint)" } }),
                  s,
                ],
              },
              s,
            ),
          ),
          (0, Dt.jsxs)("li", {
            className: "flex gap-2",
            style: { color: "var(--ink-dim)" },
            children: [(0, Dt.jsx)(li, { className: "mt-0.5" }), " ", o.days, "-day delivery"],
          }),
        ],
      }),
      (0, Dt.jsxs)("div", {
        className: "flex gap-2 flex-wrap",
        children: [
          !n &&
            (0, Dt.jsxs)("button", {
              className: "btn btn-ember",
              onClick: () => Gp(t.id, a, i),
              id: "order-gig",
              children: [(0, Dt.jsx)(Yl, {}), " Order ", a, " \xB7 ", q(o.price)],
            }),
          !n &&
            (0, Dt.jsxs)("button", {
              className: "btn btn-ghost",
              onClick: () => Oh("gig", t.id),
              children: [(0, Dt.jsx)(ii, {}), " Affiliate link (", t.commission, "%)"],
            }),
          n && (0, Dt.jsx)("span", { className: "chip chip-on", children: "Your gig" }),
        ],
      }),
      (0, Dt.jsx)("p", {
        className: "text-xs",
        style: { color: "var(--ink-dim)" },
        children: "Payment stays in escrow until you approve the delivery.",
      }),
      (0, Dt.jsx)(p0, { id: t.id, fallbackRating: t.rating }),
    ],
  });
}
function iy() {
  let t = Y(),
    [e, a] = (0, S0.useState)(!1),
    [r, o] = (0, S0.useState)(""),
    [n, i] = (0, S0.useState)("AI Agents"),
    [s, l] = (0, S0.useState)(80),
    c = t.focus?.kind === "gig" ? t.focus.id : null,
    d = c && t.gigs.find((p) => p.id === c),
    h = t.orders.filter((p) => p.kind === "gig" && p.buyerId === t.session?.userId),
    u = t.orders.filter((p) => p.kind === "gig" && p.sellerId === t.session?.userId);
  return (0, Dt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, Dt.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, Dt.jsx)("p", {
            className: "text-sm flex-1",
            style: { color: "var(--ink-dim)" },
            children: "AI-only gigs: agents, video, prompts, voice and vision.",
          }),
          (0, Dt.jsxs)("button", {
            className: `btn ${t.role === "freelancer" ? "btn-ember" : "btn-ghost"}`,
            onClick: () => a((p) => !p),
            children: [(0, Dt.jsx)(Na, {}), " Post a gig"],
          }),
        ],
      }),
      e &&
        (0, Dt.jsxs)("form", {
          className: "card p-4 space-y-3 pop-in",
          onSubmit: (p) => {
            (p.preventDefault(), !(r.trim().length < 8) && (_M(r.trim(), n, Number(s)), a(!1), o("")));
          },
          children: [
            (0, Dt.jsx)(Te, { kicker: "Creator \xB7 Packages", title: "New AI gig" }),
            (0, Dt.jsxs)("div", {
              children: [
                (0, Dt.jsx)("label", { className: "label", htmlFor: "gig-title", children: "Title" }),
                (0, Dt.jsx)("input", {
                  id: "gig-title",
                  className: "field",
                  value: r,
                  onChange: (p) => o(p.target.value),
                  placeholder: "I will build \u2026 with AI",
                }),
              ],
            }),
            (0, Dt.jsxs)("div", {
              className: "grid grid-cols-2 gap-3",
              children: [
                (0, Dt.jsxs)("div", {
                  children: [
                    (0, Dt.jsx)("label", { className: "label", htmlFor: "gig-cat", children: "Category" }),
                    (0, Dt.jsx)("select", {
                      id: "gig-cat",
                      className: "field",
                      value: n,
                      onChange: (p) => i(p.target.value),
                      children: [
                        "AI Agents",
                        "AI Video",
                        "Prompt Engineering",
                        "Voice AI",
                        "Computer Vision",
                        "AI Art",
                        "Automation",
                      ].map((p) => (0, Dt.jsx)("option", { children: p }, p)),
                    }),
                  ],
                }),
                (0, Dt.jsxs)("div", {
                  children: [
                    (0, Dt.jsx)("label", {
                      className: "label",
                      htmlFor: "gig-basic",
                      children: "Basic price ($)",
                    }),
                    (0, Dt.jsx)("input", {
                      id: "gig-basic",
                      type: "number",
                      min: 5,
                      className: "field",
                      value: s,
                      onChange: (p) => l(Number(p.target.value)),
                    }),
                  ],
                }),
              ],
            }),
            (0, Dt.jsxs)("p", {
              className: "text-xs",
              style: { color: "var(--ink-dim)" },
              children: [
                "Standard and Premium packages are created for you (",
                q(Math.round(s * 2.5)),
                " / ",
                q(s * 6),
                "). The gig also goes up on a board in your home.",
              ],
            }),
            (0, Dt.jsxs)("div", {
              className: "flex justify-end gap-2",
              children: [
                (0, Dt.jsx)("button", {
                  type: "button",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => a(!1),
                  children: "Cancel",
                }),
                (0, Dt.jsx)("button", { className: "btn btn-ember btn-sm", children: "Publish gig" }),
              ],
            }),
          ],
        }),
      d && (0, Dt.jsx)(CR, { g: d }),
      (h.length > 0 || u.length > 0) &&
        (0, Dt.jsxs)("div", {
          className: "card p-4 space-y-2",
          children: [
            (0, Dt.jsx)(Te, { kicker: "Orders", title: t.role === "freelancer" ? "My sales" : "My orders" }),
            (t.role === "freelancer" ? u : h).map((p) => {
              let v = t.gigs.find((g) => g.id === p.itemId);
              return (0, Dt.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 text-sm py-1.5",
                  style: { borderTop: "1px solid var(--line)" },
                  children: [
                    (0, Dt.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, Dt.jsx)("div", { className: "truncate font-bold", children: v?.title }),
                        (0, Dt.jsxs)("div", {
                          className: "text-xs",
                          style: { color: "var(--ink-dim)" },
                          children: [p.tier, " \xB7 ", q(p.amount), " \xB7 ", Ao(p.at), " ago"],
                        }),
                      ],
                    }),
                    (0, Dt.jsx)("span", {
                      className: "chip",
                      style: {
                        color:
                          p.status === "completed"
                            ? "var(--mint)"
                            : p.status === "delivered"
                              ? "var(--ember-hi)"
                              : "var(--sky)",
                      },
                      children:
                        p.status === "active"
                          ? "In progress"
                          : p.status === "delivered"
                            ? "Delivered"
                            : "Completed",
                    }),
                    p.status === "delivered" &&
                      p.buyerId === t.session?.userId &&
                      (0, Dt.jsx)("button", {
                        className: "btn btn-primary btn-sm",
                        onClick: () => $M(p.id),
                        children: "Approve",
                      }),
                  ],
                },
                p.id,
              );
            }),
          ],
        }),
      (0, Dt.jsx)("div", {
        className: "space-y-3",
        children: t.gigs.map((p) => {
          let v = be(p.ownerId);
          return (0, Dt.jsxs)(
            "button",
            {
              onClick: () => {
                (an("gig", p.id),
                  document.getElementById("hud-scroll")?.scrollTo({ top: 0, behavior: "smooth" }));
              },
              className: `card card-hover p-4 w-full text-left flex gap-3 ${c === p.id ? "chip-on" : ""}`,
              children: [
                (0, Dt.jsx)("div", {
                  className: "w-12 h-12 rounded-xl grid place-items-center shrink-0",
                  style: { background: `linear-gradient(135deg, ${v?.color}, var(--ember))` },
                  children: (0, Dt.jsx)(hr, { className: "text-xl text-[#2a1300]" }),
                }),
                (0, Dt.jsxs)("div", {
                  className: "min-w-0 flex-1",
                  children: [
                    (0, Dt.jsx)("div", { className: "font-bold text-sm leading-snug", children: p.title }),
                    (0, Dt.jsxs)("div", {
                      className: "text-xs mt-1",
                      style: { color: "var(--ink-dim)" },
                      children: [
                        v?.name,
                        " \xB7 \u2605 ",
                        p.rating || "new",
                        " \xB7 ",
                        p.orders,
                        " orders \xB7 ",
                        p.commission,
                        "% affiliate",
                      ],
                    }),
                  ],
                }),
                (0, Dt.jsxs)("div", {
                  className: "text-right shrink-0",
                  children: [
                    (0, Dt.jsx)("div", {
                      className: "text-[10px]",
                      style: { color: "var(--ink-dim)" },
                      children: "from",
                    }),
                    (0, Dt.jsx)("div", {
                      className: "font-display tabular",
                      children: q(p.packages[0].price),
                    }),
                  ],
                }),
              ],
            },
            p.id,
          );
        }),
      }),
    ],
  });
}
var kd = P(Zt(), 1);
var Nt = P(ct(), 1);
function TR({ j: t, onDone: e }) {
  let [a, r] = (0, kd.useState)(Math.round(t.budget * 0.95)),
    [o, n] = (0, kd.useState)(7),
    [i, s] = (0, kd.useState)(
      "Hi! I have done this exact kind of work before. I can ship a working demo in week one, then deliver in milestones.",
    );
  return (0, Nt.jsxs)("form", {
    className: "space-y-2 pop-in mt-3 p-3 rounded-xl",
    style: { background: "rgba(77,163,255,.06)", border: "1px solid rgba(77,163,255,.25)" },
    onSubmit: (l) => {
      (l.preventDefault(), qM(t.id, Number(a), Number(o), i), e());
    },
    children: [
      (0, Nt.jsxs)("div", {
        className: "grid grid-cols-2 gap-2",
        children: [
          (0, Nt.jsxs)("div", {
            children: [
              (0, Nt.jsxs)("label", {
                className: "label",
                htmlFor: `bid-${t.id}`,
                children: ["Bid (", t.type === "hourly" ? "$/hr" : "$", ")"],
              }),
              (0, Nt.jsx)("input", {
                id: `bid-${t.id}`,
                type: "number",
                className: "field py-2",
                value: a,
                onChange: (l) => r(Number(l.target.value)),
              }),
            ],
          }),
          (0, Nt.jsxs)("div", {
            children: [
              (0, Nt.jsx)("label", { className: "label", htmlFor: `days-${t.id}`, children: "Days" }),
              (0, Nt.jsx)("input", {
                id: `days-${t.id}`,
                type: "number",
                className: "field py-2",
                value: o,
                onChange: (l) => n(Number(l.target.value)),
              }),
            ],
          }),
        ],
      }),
      (0, Nt.jsxs)("div", {
        children: [
          (0, Nt.jsx)("label", { className: "label", htmlFor: `cov-${t.id}`, children: "Cover letter" }),
          (0, Nt.jsx)("textarea", {
            id: `cov-${t.id}`,
            className: "field",
            value: i,
            onChange: (l) => s(l.target.value),
          }),
        ],
      }),
      (0, Nt.jsxs)("div", {
        className: "flex justify-end gap-2",
        children: [
          (0, Nt.jsx)("button", {
            type: "button",
            className: "btn btn-ghost btn-sm",
            onClick: e,
            children: "Cancel",
          }),
          (0, Nt.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            children: [(0, Nt.jsx)(Da, {}), " Send proposal"],
          }),
        ],
      }),
    ],
  });
}
function _7({ j: t }) {
  let a = Y().session.userId,
    [r, o] = (0, kd.useState)(!1),
    n = t.clientId === a,
    i = t.proposals.find((s) => s.freelancerId === a);
  return (0, Nt.jsxs)("div", {
    className: "card p-4 space-y-3",
    children: [
      (0, Nt.jsx)(as, { userId: t.clientId, at: t.createdAt }),
      (0, Nt.jsxs)("div", {
        children: [
          (0, Nt.jsxs)("div", {
            className: "flex items-center gap-2 flex-wrap mb-1",
            children: [
              (0, Nt.jsx)("span", {
                className: "chip",
                style: {
                  color:
                    t.status === "open"
                      ? "var(--mint)"
                      : t.status === "in_progress"
                        ? "var(--ember-hi)"
                        : "var(--ink-dim)",
                },
                children:
                  t.status === "open"
                    ? "Open"
                    : t.status === "in_progress"
                      ? "In progress \xB7 escrow"
                      : "Completed",
              }),
              (0, Nt.jsx)("span", {
                className: "chip",
                children: t.type === "fixed" ? `Fixed ${q(t.budget)}` : `${q(t.budget)}/hr`,
              }),
              (0, Nt.jsxs)("span", {
                className: "chip",
                children: [(0, Nt.jsx)($e, {}), " ", t.proposals.length, " proposals"],
              }),
            ],
          }),
          (0, Nt.jsx)("h4", {
            className: "font-display text-[15px] font-bold leading-snug",
            children: t.title,
          }),
          (0, Nt.jsx)("p", {
            className: "text-sm mt-1",
            style: { color: "var(--ink-dim)" },
            children: t.description,
          }),
          (0, Nt.jsx)("div", {
            className: "flex gap-1.5 flex-wrap mt-2",
            children: t.skills.map((s) => (0, Nt.jsx)("span", { className: "chip", children: s }, s)),
          }),
        ],
      }),
      n &&
        t.proposals.length > 0 &&
        (0, Nt.jsxs)("div", {
          className: "space-y-2",
          children: [
            (0, Nt.jsx)("div", { className: "label", children: "Proposals" }),
            t.proposals.map((s) => {
              let l = be(s.freelancerId);
              return (0, Nt.jsxs)(
                "div",
                {
                  className: "rounded-xl p-3 flex gap-3",
                  style: { background: "rgba(255,255,255,.04)", border: "1px solid var(--line)" },
                  children: [
                    (0, Nt.jsx)(Dr, { user: l, size: 32 }),
                    (0, Nt.jsxs)("div", {
                      className: "min-w-0 flex-1 text-sm",
                      children: [
                        (0, Nt.jsxs)("div", {
                          className: "font-bold",
                          children: [
                            l?.name,
                            " ",
                            (0, Nt.jsxs)("span", {
                              className: "font-normal text-xs",
                              style: { color: "var(--ink-dim)" },
                              children: ["\xB7 ", q(s.bid), " \xB7 ", s.days, " days \xB7 ", Ao(s.at)],
                            }),
                          ],
                        }),
                        (0, Nt.jsx)("div", { style: { color: "var(--ink-dim)" }, children: s.cover }),
                      ],
                    }),
                    t.status === "open" &&
                      (0, Nt.jsx)("button", {
                        className: "btn btn-primary btn-sm self-start",
                        onClick: () => ZM(t.id, s.id),
                        children: "Hire",
                      }),
                    s.status === "accepted" &&
                      (0, Nt.jsxs)("span", {
                        className: "chip chip-on self-start",
                        children: [(0, Nt.jsx)(_e, {}), " Hired"],
                      }),
                  ],
                },
                s.id,
              );
            }),
            t.status === "in_progress" &&
              (0, Nt.jsxs)("button", {
                className: "btn btn-ember btn-sm",
                onClick: () => KM(t.id),
                children: ["Approve milestone \xB7 release ", q(t.escrow || 0)],
              }),
          ],
        }),
      n &&
        t.proposals.length === 0 &&
        (0, Nt.jsx)("div", {
          className: "text-xs",
          style: { color: "var(--ink-dim)" },
          children: "Waiting for proposals\u2026 demo freelancers will bid in a few seconds",
        }),
      !n &&
        (i
          ? (0, Nt.jsxs)("div", {
              className: "text-sm",
              style: { color: i.status === "accepted" ? "var(--mint)" : "var(--sky)" },
              children: [
                "Your proposal: ",
                q(i.bid),
                " \xB7 ",
                i.status === "accepted" ? "Accepted! Time to start." : "Under review",
              ],
            })
          : t.status === "open" &&
            (r
              ? (0, Nt.jsx)(TR, { j: t, onDone: () => o(!1) })
              : (0, Nt.jsxs)("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: () => o(!0),
                  children: [(0, Nt.jsx)(Da, {}), " Send proposal"],
                }))),
    ],
  });
}
function sy() {
  let t = Y(),
    [e, a] = (0, kd.useState)(!1),
    [r, o] = (0, kd.useState)({ title: "", description: "", budget: 500, type: "fixed", skills: "LLM, RAG" }),
    n = t.session.userId,
    i = t.jobs.filter((l) => l.clientId === n),
    s = t.jobs.filter((l) => l.clientId !== n);
  return (0, Nt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, Nt.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, Nt.jsx)("p", {
            className: "text-sm flex-1",
            style: { color: "var(--ink-dim)" },
            children:
              t.role === "client"
                ? "Client mode: post an AI project, review proposals and hire."
                : "Creator mode: send proposals to AI jobs.",
          }),
          (0, Nt.jsxs)("button", {
            className: `btn ${t.role === "client" ? "btn-primary" : "btn-ghost"}`,
            onClick: () => a((l) => !l),
            children: [(0, Nt.jsx)(Na, {}), " Job post"],
          }),
        ],
      }),
      e &&
        (0, Nt.jsxs)("form", {
          className: "card p-4 space-y-3 pop-in",
          onSubmit: (l) => {
            (l.preventDefault(),
              !(r.title.trim().length < 6) &&
                (YM({
                  title: r.title.trim(),
                  description: r.description.trim() || r.title,
                  budget: Number(r.budget),
                  type: r.type,
                  skills: r.skills
                    .split(",")
                    .map((c) => c.trim())
                    .filter(Boolean),
                }),
                a(!1),
                o({ ...r, title: "", description: "" })));
          },
          children: [
            (0, Nt.jsx)(Te, { kicker: "Client \xB7 Hire talent", title: "Post an AI job" }),
            (0, Nt.jsxs)("div", {
              children: [
                (0, Nt.jsx)("label", { className: "label", htmlFor: "job-title", children: "Title" }),
                (0, Nt.jsx)("input", {
                  id: "job-title",
                  className: "field",
                  value: r.title,
                  onChange: (l) => o({ ...r, title: l.target.value }),
                  placeholder: "e.g. AI sales agent for WhatsApp",
                }),
              ],
            }),
            (0, Nt.jsxs)("div", {
              children: [
                (0, Nt.jsx)("label", { className: "label", htmlFor: "job-desc", children: "Details" }),
                (0, Nt.jsx)("textarea", {
                  id: "job-desc",
                  className: "field",
                  value: r.description,
                  onChange: (l) => o({ ...r, description: l.target.value }),
                  placeholder: "What you need, where the data lives, deadline\u2026",
                }),
              ],
            }),
            (0, Nt.jsxs)("div", {
              className: "grid grid-cols-3 gap-2",
              children: [
                (0, Nt.jsxs)("div", {
                  children: [
                    (0, Nt.jsx)("label", { className: "label", htmlFor: "job-type", children: "Type" }),
                    (0, Nt.jsxs)("select", {
                      id: "job-type",
                      className: "field",
                      value: r.type,
                      onChange: (l) => o({ ...r, type: l.target.value }),
                      children: [
                        (0, Nt.jsx)("option", { value: "fixed", children: "Fixed" }),
                        (0, Nt.jsx)("option", { value: "hourly", children: "Hourly" }),
                      ],
                    }),
                  ],
                }),
                (0, Nt.jsxs)("div", {
                  children: [
                    (0, Nt.jsx)("label", {
                      className: "label",
                      htmlFor: "job-budget",
                      children: "Budget ($)",
                    }),
                    (0, Nt.jsx)("input", {
                      id: "job-budget",
                      type: "number",
                      className: "field",
                      value: r.budget,
                      onChange: (l) => o({ ...r, budget: Number(l.target.value) }),
                    }),
                  ],
                }),
                (0, Nt.jsxs)("div", {
                  children: [
                    (0, Nt.jsx)("label", { className: "label", htmlFor: "job-skills", children: "Skills" }),
                    (0, Nt.jsx)("input", {
                      id: "job-skills",
                      className: "field",
                      value: r.skills,
                      onChange: (l) => o({ ...r, skills: l.target.value }),
                    }),
                  ],
                }),
              ],
            }),
            (0, Nt.jsxs)("div", {
              className: "flex justify-end gap-2",
              children: [
                (0, Nt.jsx)("button", {
                  type: "button",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => a(!1),
                  children: "Cancel",
                }),
                (0, Nt.jsx)("button", { className: "btn btn-primary btn-sm", children: "Post job" }),
              ],
            }),
          ],
        }),
      i.length > 0 &&
        (0, Nt.jsxs)(Nt.Fragment, {
          children: [
            (0, Nt.jsx)(Te, { kicker: "Client", title: "My posted jobs" }),
            i.map((l) => (0, Nt.jsx)(_7, { j: l }, l.id)),
          ],
        }),
      (0, Nt.jsx)(Te, { kicker: "Marketplace", title: "Open AI jobs" }),
      s.map((l) => (0, Nt.jsx)(_7, { j: l }, l.id)),
    ],
  });
}
var Y7 = P(Zt(), 1);
var ve = P(ct(), 1);
function ly() {
  let t = Y(),
    e = t.session.userId,
    [a, r] = (0, Y7.useState)(""),
    o = t.affLinks.filter((c) => c.userId === e),
    n = o.reduce(
      (c, d) => ({ clicks: c.clicks + d.clicks, sales: c.sales + d.sales, earned: c.earned + d.earned }),
      { clicks: 0, sales: 0, earned: 0 },
    ),
    i = t.homeSlots[e] || [],
    s = (c, d) => {
      if (i.some((h) => h.itemId === d)) return F("This is already in your home.", "info");
      (Dh([...i, { kind: c, itemId: d }]),
        F("Affiliate stand added to your home. Anyone who buys from it earns you commission."));
    },
    l = [
      ...t.agents
        .filter((c) => c.ownerId !== e)
        .map((c) => ({
          kind: "agent",
          id: c.id,
          name: c.name,
          owner: c.ownerId,
          price: c.price,
          com: c.commission,
        })),
      ...t.gigs
        .filter((c) => c.ownerId !== e)
        .map((c) => ({
          kind: "gig",
          id: c.id,
          name: c.title,
          owner: c.ownerId,
          price: c.packages[0].price,
          com: c.commission,
        })),
    ].sort((c, d) => d.price * d.com - c.price * c.com);
  return (0, ve.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, ve.jsxs)("div", {
        className: "grid grid-cols-3 gap-2",
        children: [
          (0, ve.jsx)(Ra, { label: "Clicks", value: n.clicks.toLocaleString() }),
          (0, ve.jsx)(Ra, { label: "Sales", value: n.sales, tone: "var(--sky)" }),
          (0, ve.jsx)(Ra, {
            label: "Earned",
            value: q(Math.round(n.earned * 100) / 100),
            tone: "var(--ember-hi)",
          }),
        ],
      }),
      (0, ve.jsxs)("div", {
        className: "flex gap-2 flex-wrap",
        children: [
          (0, ve.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            onClick: XM,
            children: [(0, ve.jsx)(j8, {}), " Simulate traffic"],
          }),
          (0, ve.jsx)("span", {
            className: "text-xs self-center",
            style: { color: "var(--ink-dim)" },
            children: "Commission lands straight in your wallet.",
          }),
        ],
      }),
      (0, ve.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, ve.jsx)(Te, { kicker: "Affiliate", title: "My links" }),
          o.length === 0 &&
            (0, ve.jsx)("p", {
              className: "text-sm",
              style: { color: "var(--ink-dim)" },
              children: "No links yet. Create one from the catalog below.",
            }),
          (0, ve.jsx)("div", {
            className: "space-y-2",
            children: o.map((c) => {
              let d =
                  c.kind === "agent"
                    ? t.agents.find((u) => u.id === c.itemId)?.name
                    : t.gigs.find((u) => u.id === c.itemId)?.title,
                h = X2(c.kind, c.itemId);
              return (0, ve.jsxs)(
                "div",
                {
                  className: "rounded-xl p-3 space-y-2",
                  style: { background: "rgba(255,255,255,.04)", border: "1px solid var(--line)" },
                  children: [
                    (0, ve.jsxs)("div", {
                      className: "flex items-center gap-2 text-sm",
                      children: [
                        (0, ve.jsx)("span", { className: "font-bold truncate flex-1", children: d }),
                        (0, ve.jsxs)("span", {
                          className: "text-xs tabular",
                          style: { color: "var(--ink-dim)" },
                          children: [
                            c.clicks,
                            " clicks \xB7 ",
                            c.sales,
                            " sales \xB7 ",
                            (0, ve.jsx)("b", { style: { color: "var(--ember-hi)" }, children: q(c.earned) }),
                          ],
                        }),
                      ],
                    }),
                    (0, ve.jsxs)("div", {
                      className: "flex gap-2",
                      children: [
                        (0, ve.jsx)("input", {
                          id: `aff-${c.id}`,
                          readOnly: !0,
                          className: "field py-1.5 font-mono text-xs",
                          value: h,
                          onFocus: (u) => u.target.select(),
                        }),
                        (0, ve.jsx)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: async () => {
                            let u = await Lg(h);
                            (r(u ? c.id : ""),
                              u || F("Copy failed. Select the link and copy it yourself.", "warn"),
                              setTimeout(() => r(""), 1500));
                          },
                          children: a === c.id ? (0, ve.jsx)(_e, {}) : (0, ve.jsx)(Kl, {}),
                        }),
                        (0, ve.jsx)("button", {
                          className: "btn btn-ghost btn-sm",
                          title: "Add to my home",
                          onClick: () => s(c.kind, c.itemId),
                          children: (0, ve.jsx)(Ma, {}),
                        }),
                      ],
                    }),
                  ],
                },
                c.id,
              );
            }),
          }),
        ],
      }),
      (0, ve.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, ve.jsx)(Te, { kicker: "Catalog", title: "Items you can promote" }),
          (0, ve.jsx)("div", {
            className: "space-y-1",
            children: l.map((c) => {
              let d = o.some((h) => h.itemId === c.id);
              return (0, ve.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 py-2 text-sm",
                  style: { borderTop: "1px solid var(--line)" },
                  children: [
                    c.kind === "agent"
                      ? (0, ve.jsx)(Nr, { style: { color: "var(--sky)" } })
                      : (0, ve.jsx)(hr, { style: { color: "var(--ember)" } }),
                    (0, ve.jsxs)("div", {
                      className: "min-w-0 flex-1",
                      children: [
                        (0, ve.jsx)("div", { className: "truncate font-bold", children: c.name }),
                        (0, ve.jsxs)("div", {
                          className: "text-xs",
                          style: { color: "var(--ink-dim)" },
                          children: [
                            be(c.owner)?.name,
                            " \xB7 ",
                            q(c.price),
                            " \xB7 ",
                            (0, ve.jsxs)("b", {
                              style: { color: "var(--ember-hi)" },
                              children: [c.com, "% = ", q(Math.round(c.price * c.com) / 100), "/sale"],
                            }),
                          ],
                        }),
                      ],
                    }),
                    d
                      ? (0, ve.jsx)("span", { className: "chip chip-on", children: (0, ve.jsx)(_e, {}) })
                      : (0, ve.jsxs)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: () => Oh(c.kind, c.id),
                          children: [(0, ve.jsx)(ii, {}), " Link"],
                        }),
                  ],
                },
                c.id,
              );
            }),
          }),
        ],
      }),
    ],
  });
}
var hy = P(Zt(), 1);
var ra = P(Zt(), 1);
var A = P(ct(), 1),
  Me = { color: "var(--ink-dim)" },
  Kg = [
    {
      id: "school",
      label: "Schools",
      one: "School",
      icon: t0,
      desc: "K-12, kids coding, languages and the basics.",
    },
    {
      id: "college",
      label: "Colleges",
      one: "College",
      icon: Xl,
      desc: "Intermediate, diplomas and pre-professional programs.",
    },
    {
      id: "university",
      label: "Universities",
      one: "University",
      icon: Or,
      desc: "Advanced tracks, research labs and executive cohorts.",
    },
    {
      id: "institute",
      label: "Institutes",
      one: "Institute",
      icon: N8,
      desc: "Practical bootcamps: AI, design, trading, e-commerce, development.",
    },
  ],
  SR = (t) => `https://fyrus.io/verify/${t}`;
function dy() {
  let t = Y(),
    e = t.net.status === "online",
    [a, r] = (0, ra.useState)(t.eduFocus?.tab || "explore"),
    [o, n] = (0, ra.useState)(t.eduFocus?.course || null);
  return (
    (0, ra.useEffect)(() => {
      e && (O.send({ t: "edu_list" }), O.send({ t: "edu_mine" }));
    }, [e]),
    (0, ra.useEffect)(() => {
      t.eduFocus &&
        (t.eduFocus.tab && r(t.eduFocus.tab),
        t.eduFocus.course && n(t.eduFocus.course),
        C({ eduFocus: null }));
    }, [t.eduFocus]),
    e
      ? (0, A.jsxs)("div", {
          className: "space-y-3",
          children: [
            (0, A.jsxs)("div", {
              className: "card p-3",
              children: [
                (0, A.jsx)("div", {
                  className: "text-[10px] font-bold tracking-[.25em]",
                  style: { color: "var(--ember-hi)" },
                  children: "MINISTRY OF EDUCATION \xB7 LEARN CITY",
                }),
                (0, A.jsx)("div", {
                  className: "text-sm font-bold mt-0.5",
                  children:
                    "Study with registered schools, colleges, universities, institutes and independent teachers",
                }),
                (0, A.jsx)("div", {
                  className: "text-[12px] mt-1",
                  style: Me,
                  children:
                    "Fyrus does not hand out degrees. The teacher you studied with issues your certificate, signed with a code anyone can check.",
                }),
              ],
            }),
            !o &&
              (0, A.jsx)("div", {
                className: "flex gap-1 flex-wrap",
                children: [
                  ["explore", "Explore", Mi],
                  ["learning", "My learning", cd],
                  ["teach", "Teach", Xl],
                  ["register", "Register an institution", t0],
                  ["verify", "Verify a certificate", yr],
                ].map(([i, s, l]) =>
                  (0, A.jsxs)(
                    "button",
                    {
                      "data-edu-tab": i,
                      className: `chip ${a === i ? "chip-on" : ""}`,
                      onClick: () => r(i),
                      children: [(0, A.jsx)(l, {}), " ", s],
                    },
                    i,
                  ),
                ),
              }),
            o
              ? (0, A.jsx)(NR, { id: o, back: () => n(null) })
              : (0, A.jsxs)(A.Fragment, {
                  children: [
                    a === "explore" && (0, A.jsx)(HR, { open: n }),
                    a === "learning" && (0, A.jsx)(RR, { open: n }),
                    a === "teach" && (0, A.jsx)(BR, {}),
                    a === "register" && (0, A.jsx)(zR, {}),
                    a === "verify" && (0, A.jsx)(jR, {}),
                  ],
                }),
          ],
        })
      : (0, A.jsxs)("div", {
          className: "card p-4 text-sm",
          children: [
            (0, A.jsx)("b", { children: "Education City is live on fyrus.io." }),
            (0, A.jsx)("div", {
              className: "mt-1",
              style: Me,
              children:
                "Schools, teachers, courses and certificates are kept on the Fyrus server so every certificate can be checked by anyone. Connecting\u2026",
            }),
          ],
        })
  );
}
function HR({ open: t }) {
  let e = Y(),
    [a, r] = (0, ra.useState)("all"),
    [o, n] = (0, ra.useState)(""),
    i = e.edu;
  if (!i) return (0, A.jsx)("div", { className: "text-sm", style: Me, children: "Loading courses\u2026" });
  let s = (d) => i.inst.find((h) => h.id === d),
    l = i.inst.filter((d) => a === "all" || d.type === a),
    c = i.courses.filter(
      (d) =>
        (a === "all" || s(d.inst)?.type === a || (a === "independent" && !d.inst)) &&
        `${d.title} ${d.summary} ${d.skills.join(" ")} ${d.teacherName} ${d.instName || ""}`
          .toLowerCase()
          .includes(o.toLowerCase()),
    );
  return (0, A.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, A.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          ["all", "All"],
          ...Kg.map((d) => [d.id, d.label]),
          ["independent", "Independent teachers"],
        ].map(([d, h]) =>
          (0, A.jsx)(
            "button",
            { className: `chip ${a === d ? "chip-on" : ""}`, onClick: () => r(d), children: h },
            d,
          ),
        ),
      }),
      (0, A.jsx)("input", {
        className: "field py-1.5 text-sm",
        value: o,
        onChange: (d) => n(d.target.value),
        placeholder: "Search courses, skills or teachers",
        "aria-label": "Search courses",
      }),
      a !== "independent" &&
        l.length > 0 &&
        (0, A.jsxs)("div", {
          children: [
            (0, A.jsx)("div", {
              className: "text-[11px] font-bold tracking-wide mb-1",
              style: Me,
              children: "INSTITUTIONS",
            }),
            (0, A.jsx)("div", {
              className: "grid sm:grid-cols-2 gap-1.5",
              children: l.map((d) => {
                let h = Kg.find((p) => p.id === d.type),
                  u = i.courses.filter((p) => p.inst === d.id).length;
                return (0, A.jsxs)(
                  "div",
                  {
                    className: "rounded-lg p-2.5 flex gap-2",
                    style: { border: "1px solid var(--line)" },
                    children: [
                      (0, A.jsx)("span", {
                        className: "w-9 h-9 rounded-lg grid place-items-center text-white shrink-0",
                        style: { background: d.color },
                        children: (0, A.jsx)(h.icon, {}),
                      }),
                      (0, A.jsxs)("div", {
                        className: "min-w-0",
                        children: [
                          (0, A.jsx)("div", { className: "text-sm font-bold truncate", children: d.name }),
                          (0, A.jsxs)("div", {
                            className: "text-[11px]",
                            style: Me,
                            children: [
                              h.one,
                              " \xB7 ",
                              u,
                              " course",
                              u === 1 ? "" : "s",
                              " \xB7 ",
                              d.verified
                                ? (0, A.jsx)("span", {
                                    style: { color: "#45e0ae" },
                                    children: "Verified by the Ministry",
                                  })
                                : "Registered",
                            ],
                          }),
                          d.tagline &&
                            (0, A.jsx)("div", {
                              className: "text-[11px] truncate",
                              style: Me,
                              children: d.tagline,
                            }),
                        ],
                      }),
                    ],
                  },
                  d.id,
                );
              }),
            }),
          ],
        }),
      (0, A.jsxs)("div", {
        children: [
          (0, A.jsxs)("div", {
            className: "text-[11px] font-bold tracking-wide mb-1",
            style: Me,
            children: ["COURSES (", c.length, ")"],
          }),
          (0, A.jsxs)("div", {
            className: "space-y-1.5",
            children: [
              c.map((d) =>
                (0, A.jsxs)(
                  "button",
                  {
                    "data-course": d.id,
                    className: "w-full text-left rounded-lg p-2.5 card-hover",
                    style: { border: "1px solid var(--line)" },
                    onClick: () => t(d.id),
                    children: [
                      (0, A.jsxs)("div", {
                        className: "flex items-start gap-2",
                        children: [
                          (0, A.jsxs)("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              (0, A.jsx)("div", { className: "text-sm font-bold", children: d.title }),
                              (0, A.jsxs)("div", {
                                className: "text-[11px]",
                                style: Me,
                                children: [
                                  d.teacherName,
                                  d.instName ? ` \xB7 ${d.instName}` : " \xB7 independent",
                                  " \xB7 ",
                                  d.level,
                                  " \xB7 ",
                                  d.lessons.length,
                                  " lessons \xB7 ",
                                  d.students,
                                  " students",
                                ],
                              }),
                            ],
                          }),
                          (0, A.jsx)("span", {
                            className: "text-[12px] font-bold shrink-0",
                            style: { color: d.fee ? "var(--ember-hi)" : "#45e0ae" },
                            children: d.fee ? q(d.fee) : "Free",
                          }),
                        ],
                      }),
                      d.skills.length > 0 &&
                        (0, A.jsx)("div", {
                          className: "flex gap-1 flex-wrap mt-1",
                          children: d.skills.map((h) =>
                            (0, A.jsx)(
                              "span",
                              {
                                className: "text-[10px] px-1.5 py-0.5 rounded",
                                style: { background: "rgba(77,163,255,.14)" },
                                children: h,
                              },
                              h,
                            ),
                          ),
                        }),
                    ],
                  },
                  d.id,
                ),
              ),
              c.length === 0 &&
                (0, A.jsx)("div", {
                  className: "text-[12px]",
                  style: Me,
                  children: "No courses here yet. Teachers can publish one from the Teach tab.",
                }),
            ],
          }),
        ],
      }),
    ],
  });
}
