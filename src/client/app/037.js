function W9() {
  let t = Y(),
    e = t.svcCard ? Nl(t.svcCard) : null,
    a = t.jobsMe,
    [r, o] = (0, pf.useState)(""),
    [n, i] = (0, pf.useState)(""),
    [s, l] = (0, pf.useState)(0);
  if (!e) return null;
  let c = () => C({ svcCard: null }),
    d = a?.shift?.svc === e.id,
    h = !!a && a.shifts >= a.cap,
    u = a?.next || 0;
  return (0, Ot.jsx)("div", {
    className: "fixed inset-0 z-[62] grid place-items-center p-4",
    style: { background: "rgba(0,0,0,.4)" },
    role: "dialog",
    "aria-label": e.name,
    "data-svc-card": e.id,
    children: (0, Ot.jsxs)("div", {
      className: "glass rounded-xl p-4 w-full max-w-md pop-in space-y-3 max-h-[86vh] overflow-y-auto",
      children: [
        (0, Ot.jsxs)("div", {
          className: "flex items-start gap-3",
          children: [
            (0, Ot.jsx)("div", {
              className: "w-10 h-10 rounded-md shrink-0",
              style: { background: e.color },
            }),
            (0, Ot.jsxs)("div", {
              className: "flex-1",
              children: [
                (0, Ot.jsx)("div", { className: "text-lg font-bold leading-tight", children: e.name }),
                (0, Ot.jsx)("div", { className: "text-[12px]", style: Hu, children: e.sub }),
              ],
            }),
            (0, Ot.jsx)("button", { "aria-label": "Close", onClick: c, children: (0, Ot.jsx)(pe, {}) }),
          ],
        }),
        e.items?.length
          ? (0, Ot.jsxs)("div", {
              children: [
                (0, Ot.jsxs)("div", {
                  className: "text-[11px] font-bold mb-1 flex items-center gap-1",
                  style: Hu,
                  children: [(0, Ot.jsx)(ko, {}), " ", e.kind === "stall" ? "MENU" : "FOR SALE"],
                }),
                (0, Ot.jsx)("div", {
                  className: "grid grid-cols-2 gap-1.5",
                  children: e.items.map((p) => {
                    let v = Fi[p];
                    return (0, Ot.jsxs)(
                      "button",
                      {
                        "data-buy": p,
                        className: "card p-2 text-left card-hover",
                        onClick: () => OM(e.id, p),
                        children: [
                          (0, Ot.jsxs)("div", {
                            className: "text-sm",
                            children: [(0, Ot.jsx)("span", { className: "mr-1", children: v.icon }), v.name],
                          }),
                          (0, Ot.jsxs)("div", {
                            className: "text-[11px] tabular",
                            style: Hu,
                            children: [q(v.price), a?.bag?.[p] ? ` \xB7 you have ${a.bag[p]}` : ""],
                          }),
                        ],
                      },
                      p,
                    );
                  }),
                }),
              ],
            })
          : null,
        e.actions?.includes("haircut") &&
          (0, Ot.jsxs)("button", {
            id: "svc-haircut",
            className: "btn btn-primary btn-sm w-full",
            onClick: () => Wv(e.id, "haircut"),
            children: [(0, Ot.jsx)(Qv, {}), " Haircut & beard \xB7 ", q(cp.haircut)],
          }),
        e.actions?.includes("makeover") &&
          (0, Ot.jsxs)("button", {
            id: "svc-makeover",
            className: "btn btn-primary btn-sm w-full",
            onClick: () => Wv(e.id, "makeover"),
            children: [(0, Ot.jsx)(Qv, {}), " Hair & makeover \xB7 ", q(cp.makeover)],
          }),
        (e.actions || [])
          .filter((p) => j9[p])
          .map((p) =>
            (0, Ot.jsxs)(
              "div",
              {
                className: "card p-2.5 text-[12px] space-y-1",
                children: [
                  (0, Ot.jsxs)("div", {
                    className: "font-bold flex items-center gap-1.5",
                    children: [
                      p === "safety"
                        ? (0, Ot.jsx)(l0, {})
                        : p === "report" || p === "lost"
                          ? (0, Ot.jsx)(yr, {})
                          : (0, Ot.jsx)(aE, {}),
                      {
                        checkup: "Free check-up tips",
                        firstaid: "First aid basics",
                        safety: "Fire safety",
                        report: "Report & stay safe",
                        lost: "Lost & found",
                      }[p],
                    ],
                  }),
                  j9[p].map((v, g) => (0, Ot.jsxs)("div", { children: ["\u2022 ", v] }, g)),
                  p === "report" &&
                    (0, Ot.jsx)("button", {
                      className: "btn btn-ghost btn-xs mt-1",
                      onClick: () => {
                        (c(), C({ nationTab: "law", hud: { open: !0, tab: "nation" } }));
                      },
                      children: "Law & Court",
                    }),
                ],
              },
              p,
            ),
          ),
        e.actions?.includes("postcard") &&
          (0, Ot.jsxs)("div", {
            className: "card p-2.5 space-y-1.5",
            "data-postcard": !0,
            children: [
              (0, Ot.jsxs)("div", {
                className: "text-[12px] font-bold flex items-center gap-1.5",
                children: [(0, Ot.jsx)(ql, {}), " Send a postcard \xB7 ", q(cp.postcard)],
              }),
              (0, Ot.jsx)("input", {
                id: "pc-number",
                className: "field py-1 text-sm",
                placeholder: "Their +2040 number",
                value: r,
                onChange: (p) => o(p.target.value),
              }),
              (0, Ot.jsx)("textarea", {
                id: "pc-text",
                className: "field text-sm min-h-[60px]",
                maxLength: 280,
                placeholder: "Greetings from Fyrus!",
                value: n,
                onChange: (p) => i(p.target.value),
              }),
              (0, Ot.jsxs)("div", {
                className: "flex items-center gap-2 text-[12px]",
                children: [
                  (0, Ot.jsx)(vg, {}),
                  " Gift ",
                  (0, Ot.jsx)("input", {
                    id: "pc-gift",
                    type: "number",
                    min: 0,
                    max: 5e3,
                    className: "field py-1 w-24 text-sm",
                    value: s,
                    onChange: (p) => l(Math.max(0, +p.target.value || 0)),
                  }),
                  " FYC ",
                  (0, Ot.jsx)("span", { className: "flex-1" }),
                  (0, Ot.jsx)("button", {
                    id: "pc-send",
                    className: "btn btn-primary btn-xs",
                    disabled: r.replace(/\D/g, "").length < 7 || n.trim().length < 2,
                    onClick: () => {
                      (FM(r, n, s), i(""), l(0));
                    },
                    children: "Send",
                  }),
                ],
              }),
              (0, Ot.jsxs)("button", {
                className: "btn btn-ghost btn-xs",
                onClick: () => {
                  (c(), ed("mail"));
                },
                children: ["My mailbox (", a?.mail?.length || 0, ")"],
              }),
            ],
          }),
        e.actions?.includes("books") &&
          (0, Ot.jsxs)("div", {
            className: "card p-2.5 space-y-1",
            children: [
              (0, Ot.jsxs)("div", {
                className: "text-[12px] font-bold flex items-center gap-1.5",
                children: [(0, Ot.jsx)(Xl, {}), " Free classics"],
              }),
              kh
                .slice(0, 5)
                .map((p) =>
                  (0, Ot.jsxs)(
                    "a",
                    {
                      href: `https://www.gutenberg.org/ebooks/${p.g}`,
                      target: "_blank",
                      rel: "noreferrer",
                      className: "block text-[12px] underline",
                      children: [p.t, " \u2014 ", p.a],
                    },
                    p.t,
                  ),
                ),
              (0, Ot.jsx)("button", {
                className: "btn btn-ghost btn-xs",
                onClick: () => {
                  (c(), ed("books"));
                },
                children: "All books",
              }),
            ],
          }),
        e.kind === "faith" &&
          (0, Ot.jsxs)("div", {
            className: "text-[13px] space-y-1",
            children: [
              (0, Ot.jsx)("div", {
                children: "Open to everyone, every day. Please be quiet and respectful inside.",
              }),
              e.id === "gurdwara" &&
                (0, Ot.jsx)("div", { children: "Free langar (community meal) is served to all visitors." }),
              (0, Ot.jsx)("div", {
                style: Hu,
                children: "Religious events can be booked in a conference hall from Events.",
              }),
            ],
          }),
        e.job &&
          (0, Ot.jsxs)("div", {
            className: "card p-3 space-y-1.5",
            "data-shift-desk": !0,
            children: [
              (0, Ot.jsxs)("div", {
                className: "text-sm font-bold flex items-center gap-1.5",
                children: [(0, Ot.jsx)(hr, {}), " ", e.job.title, " \xB7 ", q(e.job.pay)],
              }),
              (0, Ot.jsxs)("div", {
                className: "text-[12px]",
                style: Hu,
                children: [
                  e.job.stations.length,
                  " kinds of tasks. Follow the glowing marker, press E at each spot. Paid by the National Treasury when you finish. ",
                  a ? `${a.shifts}/${a.cap} shifts today \xB7 earned ${q(a.earned)}.` : "",
                ],
              }),
              d
                ? (0, Ot.jsxs)("div", {
                    className: "text-[12px]",
                    children: [
                      "On shift: task ",
                      a.shift.step + 1,
                      " of ",
                      a.shift.total,
                      " \u2014 ",
                      (0, Ot.jsx)("b", { children: e.job.stations[a.shift.station] }),
                    ],
                  })
                : (0, Ot.jsx)("button", {
                    id: "shift-start",
                    className: "btn btn-primary btn-sm",
                    disabled: h || u > 0 || !!a?.shift,
                    onClick: () => VM(e.id),
                    children: h
                      ? "Shift limit reached today"
                      : u > 0
                        ? `Break \xB7 ${nA(u)}`
                        : a?.shift
                          ? "Finish your other shift first"
                          : "Start shift",
                  }),
            ],
          }),
      ],
    }),
  });
}
function I9() {
  let e = Y().jobsMe?.shift;
  if (!e) return null;
  let a = Nl(e.svc);
  return a?.job
    ? (0, Ot.jsxs)("div", {
        className:
          "fixed top-28 left-1/2 -translate-x-1/2 z-[44] glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm",
        "data-shift-bar": !0,
        children: [
          (0, Ot.jsx)(hr, { style: { color: "var(--ember)" } }),
          (0, Ot.jsxs)("span", {
            children: [
              (0, Ot.jsx)("b", { children: a.job.title }),
              " \xB7 ",
              e.step + 1,
              "/",
              e.total,
              ": ",
              a.job.stations[e.station],
            ],
          }),
          (0, Ot.jsx)("span", {
            className: "flex gap-0.5",
            children: Array.from({ length: e.total }, (r, o) =>
              (0, Ot.jsx)(
                "span",
                {
                  className: "w-2 h-2 rounded-full",
                  style: { background: o < e.step ? "#45e0ae" : "rgba(255,255,255,.25)" },
                },
                o,
              ),
            ),
          }),
          (0, Ot.jsx)("button", { className: "btn btn-ghost btn-xs", onClick: () => PM(), children: "Quit" }),
        ],
      })
    : null;
}
var Nu = P(Zt(), 1);
var St = P(ct(), 1),
  Cd = { color: "var(--ink-dim)" },
  iA = ["Living", "Bedroom", "Kitchen", "Work", "Decor", "Fun"],
  sA = [
    "#8a9bb0",
    "#c8bfae",
    "#b36b4a",
    "#2b2e33",
    "#efe9df",
    "#7a5a3c",
    "#3f6f8f",
    "#a34a3c",
    "#2f5d50",
    "#d4a64a",
    "#e05a8a",
    "#ffc27a",
    "#4da3ff",
    "#ffffff",
  ],
  s5 = ({ list: t, value: e, onPick: a, name: r }) =>
    (0, St.jsx)("div", {
      className: "flex gap-1 flex-wrap",
      "data-swatches": r,
      children: t.map((o) =>
        (0, St.jsx)(
          "button",
          {
            "data-color": o,
            "aria-label": `${r} ${o}`,
            className: "w-5 h-5 rounded",
            onClick: () => a(o),
            style: {
              background: o,
              outline: e === o ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,.3)",
              outlineOffset: 1,
            },
          },
          o,
        ),
      ),
    });
function G9() {
  let t = Y(),
    e = t.house,
    [a, r] = (0, Nu.useState)("Living"),
    [o, n] = (0, Nu.useState)("add");
  if (
    ((0, Nu.useEffect)(() => {
      if (!t.decorating) return;
      let l = (c) => {
        let d = c.target;
        if (d && (d.tagName === "INPUT" || d.tagName === "TEXTAREA")) return;
        let h = c.key.toLowerCase();
        h === "r"
          ? Av(45)
          : (h === "delete" || h === "backspace") && lA()
            ? (zv(), c.preventDefault())
            : h === "escape" && Ih(null);
      };
      return (window.addEventListener("keydown", l), () => window.removeEventListener("keydown", l));
    }, [t.decorating]),
    t.scene.mode !== "house" || !e)
  )
    return null;
  let i = t.decorSel !== null ? e.int.items[t.decorSel] : void 0,
    s = i && $i[i.k];
  return (0, St.jsxs)(St.Fragment, {
    children: [
      (0, St.jsxs)("div", {
        className:
          "fixed top-16 left-1/2 -translate-x-1/2 z-[45] glass rounded-full px-3 py-1.5 flex items-center gap-2 text-sm",
        "data-house-bar": !0,
        children: [
          (0, St.jsx)(Wo, { style: { color: "var(--accent)" } }),
          (0, St.jsx)("b", { children: e.canEdit ? "Your home" : `${e.residentName}'s home` }),
          (0, St.jsxs)("span", { className: "hidden sm:inline", style: Cd, children: ["\xB7 ", e.label] }),
          e.canEdit &&
            (0, St.jsx)("button", {
              id: "decor-toggle",
              className: `btn btn-xs ${t.decorating ? "btn-primary" : "btn-ghost"}`,
              onClick: () => jM(!t.decorating),
              children: t.decorating
                ? (0, St.jsxs)(St.Fragment, { children: [(0, St.jsx)(_e, {}), " Done"] })
                : (0, St.jsxs)(St.Fragment, { children: [(0, St.jsx)(iu, {}), " Decorate"] }),
            }),
          e.canEdit &&
            e.dirty &&
            (0, St.jsxs)("button", {
              id: "decor-save",
              className: "btn btn-ghost btn-xs",
              onClick: () => Wp(),
              children: [(0, St.jsx)(D8, {}), " Save"],
            }),
          e.canEdit &&
            (0, St.jsxs)("button", {
              className: "btn btn-ghost btn-xs",
              onClick: () => Vl(e.key),
              children: [(0, St.jsx)(ho, {}), " Keys"],
            }),
          (0, St.jsx)("button", {
            id: "house-exit",
            className: "btn btn-ghost btn-xs",
            onClick: () => Jr(),
            children: "Exit",
          }),
        ],
      }),
      t.decorating &&
        e.canEdit &&
        (0, St.jsxs)("div", {
          className:
            "fixed bottom-20 left-1/2 -translate-x-1/2 z-[45] glass rounded-xl p-3 w-[min(680px,calc(100vw-24px))] space-y-2",
          "data-decor": !0,
          children: [
            i && s
              ? (0, St.jsxs)("div", {
                  className: "flex items-center gap-2 flex-wrap",
                  "data-decor-sel": i.k,
                  children: [
                    (0, St.jsx)("b", { className: "text-sm", children: s.name }),
                    (0, St.jsx)("button", {
                      className: "btn btn-ghost btn-xs",
                      "aria-label": "Move left",
                      "data-nudge": "l",
                      onClick: () => Y2(-0.25, 0),
                      children: (0, St.jsx)(Qr, {}),
                    }),
                    (0, St.jsx)("button", {
                      className: "btn btn-ghost btn-xs",
                      "aria-label": "Move back",
                      "data-nudge": "u",
                      onClick: () => Y2(0, -0.25),
                      children: (0, St.jsx)(Ti, {}),
                    }),
                    (0, St.jsx)("button", {
                      className: "btn btn-ghost btn-xs",
                      "aria-label": "Move forward",
                      "data-nudge": "d",
                      onClick: () => Y2(0, 0.25),
                      children: (0, St.jsx)(hd, {}),
                    }),
                    (0, St.jsx)("button", {
                      className: "btn btn-ghost btn-xs",
                      "aria-label": "Move right",
                      "data-nudge": "r",
                      onClick: () => Y2(0.25, 0),
                      children: (0, St.jsx)(fE, {}),
                    }),
                    (0, St.jsxs)("button", {
                      id: "decor-rotate",
                      className: "btn btn-ghost btn-xs",
                      onClick: () => Av(45),
                      children: [(0, St.jsx)(F8, {}), " Turn"],
                    }),
                    (0, St.jsxs)("button", {
                      className: "btn btn-ghost btn-xs",
                      onClick: () => GM(),
                      children: [(0, St.jsx)(Kl, {}), " Copy"],
                    }),
                    (0, St.jsxs)("button", {
                      id: "decor-delete",
                      className: "btn btn-ghost btn-xs",
                      onClick: () => zv(),
                      children: [(0, St.jsx)(_l, {}), " Remove"],
                    }),
                    (0, St.jsx)("button", {
                      className: "btn btn-ghost btn-xs ml-auto",
                      onClick: () => Ih(null),
                      children: (0, St.jsx)(pe, {}),
                    }),
                    (0, St.jsx)("div", {
                      className: "w-full",
                      children: (0, St.jsx)(s5, {
                        name: "item",
                        list: sA,
                        value: i.c || s.color,
                        onPick: IM,
                      }),
                    }),
                  ],
                })
              : (0, St.jsxs)("div", {
                  className: "text-[12px]",
                  style: Cd,
                  children: [
                    "Drag a piece to move it \xB7 tap it to turn, recolour or remove \xB7 R turns, Delete removes. ",
                    e.int.items.length,
                    "/120 pieces.",
                  ],
                }),
            (0, St.jsxs)("div", {
              className: "flex gap-1 flex-wrap",
              children: [
                ["add", "room"].map((l) =>
                  (0, St.jsx)(
                    "button",
                    {
                      "data-decor-tab": l,
                      className: `chip ${o === l ? "chip-on" : ""}`,
                      onClick: () => n(l),
                      children: l === "add" ? "Add furniture" : "Walls & floor",
                    },
                    l,
                  ),
                ),
                o === "add" && (0, St.jsx)("span", { className: "mx-1" }),
                o === "add" &&
                  iA.map((l) =>
                    (0, St.jsx)(
                      "button",
                      {
                        "data-decor-cat": l,
                        className: `chip ${a === l ? "chip-on" : ""}`,
                        onClick: () => r(l),
                        children: l,
                      },
                      l,
                    ),
                  ),
              ],
            }),
            o === "add"
              ? (0, St.jsx)("div", {
                  className: "grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-36 overflow-y-auto",
                  children: ov
                    .filter((l) => l.cat === a)
                    .map((l) =>
                      (0, St.jsxs)(
                        "button",
                        {
                          "data-furn": l.id,
                          className:
                            "rounded-md px-2 py-1.5 text-left text-[12px] card-hover flex items-center gap-1.5",
                          style: { border: "1px solid var(--line)" },
                          onClick: () => Bv(l.id, _t()?.frontSpot()),
                          children: [
                            (0, St.jsx)("span", {
                              className: "w-3 h-3 rounded-sm shrink-0",
                              style: { background: l.color },
                            }),
                            l.name,
                          ],
                        },
                        l.id,
                      ),
                    ),
                })
              : (0, St.jsxs)("div", {
                  className: "space-y-1.5 text-[12px]",
                  children: [
                    (0, St.jsxs)("div", {
                      children: [
                        (0, St.jsx)("span", { style: Cd, children: "Wall paint" }),
                        (0, St.jsx)(s5, {
                          name: "wall",
                          list: nv,
                          value: e.int.wall,
                          onPick: (l) => jp({ wall: l }),
                        }),
                      ],
                    }),
                    (0, St.jsxs)("div", {
                      children: [
                        (0, St.jsx)("span", { style: Cd, children: "Feature wall" }),
                        (0, St.jsx)(s5, {
                          name: "accent",
                          list: [...nv, ...pp.slice(6, 12)],
                          value: e.int.accent,
                          onPick: (l) => jp({ accent: l }),
                        }),
                      ],
                    }),
                    (0, St.jsxs)("div", {
                      className: "flex gap-1 flex-wrap items-center",
                      children: [
                        (0, St.jsx)("span", { style: Cd, className: "mr-1", children: "Floor" }),
                        wh.map((l) =>
                          (0, St.jsxs)(
                            "button",
                            {
                              "data-floor": l.id,
                              className: `chip ${e.int.floor === l.id ? "chip-on" : ""}`,
                              onClick: () => jp({ floor: l.id }),
                              children: [
                                (0, St.jsx)("span", {
                                  className: "inline-block w-2.5 h-2.5 rounded-sm mr-1",
                                  style: { background: l.color },
                                }),
                                l.name,
                              ],
                            },
                            l.id,
                          ),
                        ),
                      ],
                    }),
                  ],
                }),
          ],
        }),
    ],
  });
}
var lA = () => ot().decorSel !== null;
function V9() {
  let e = Y().doorAsk;
  return e
    ? (0, St.jsx)("div", {
        className: "fixed inset-0 z-[66] grid place-items-center p-4",
        style: { background: "rgba(0,0,0,.45)" },
        role: "dialog",
        "aria-label": "Locked door",
        "data-door": !0,
        children: (0, St.jsxs)("div", {
          className: "glass rounded-xl p-5 w-full max-w-sm pop-in space-y-3 text-center",
          children: [
            (0, St.jsx)("div", {
              className: "w-12 h-12 rounded-full grid place-items-center mx-auto",
              style: { background: "var(--accent)", color: "#fff" },
              children: (0, St.jsx)(Pr, {}),
            }),
            (0, St.jsxs)("div", {
              children: [
                (0, St.jsxs)("div", {
                  className: "text-lg font-bold",
                  children: [e.residentName, "'s home"],
                }),
                (0, St.jsx)("div", { className: "text-sm", style: Cd, children: e.why }),
              ],
            }),
            (0, St.jsxs)("div", {
              className: "flex gap-2 justify-center",
              children: [
                (0, St.jsxs)("button", {
                  id: "door-knock",
                  className: "btn btn-primary btn-sm",
                  onClick: () => RM(e.key),
                  children: [(0, St.jsx)(su, {}), " Knock", e.online ? "" : " (not home)"],
                }),
                (0, St.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => C({ doorAsk: null }),
                  children: "Leave",
                }),
              ],
            }),
            (0, St.jsxs)("div", {
              className: "text-[11px]",
              style: Cd,
              children: [
                "If ",
                e.residentName,
                " lets you in you can stay for 2 hours. Friends with a key walk straight in.",
              ],
            }),
          ],
        }),
      })
    : null;
}
function P9() {
  let t = Y();
  if (!t.knocks.length || t.hud.open) return null;
  let e = t.knocks[t.knocks.length - 1];
  return (0, St.jsxs)("div", {
    className: "fixed top-28 right-3 z-[64] glass rounded-xl p-3 w-72 pop-in space-y-2",
    "data-knock": !0,
    children: [
      (0, St.jsxs)("div", {
        className: "text-sm flex items-center gap-2",
        children: [
          (0, St.jsx)(su, { style: { color: "var(--ember)" } }),
          (0, St.jsxs)("span", {
            children: [(0, St.jsx)("b", { children: e.from.name }), " is knocking at ", e.label],
          }),
        ],
      }),
      (0, St.jsxs)("div", {
        className: "flex gap-2",
        children: [
          (0, St.jsx)("button", {
            id: "knock-yes",
            className: "btn btn-primary btn-xs",
            onClick: () => Wh(e.key, e.from.id, !0),
            children: "Let in (2 h)",
          }),
          (0, St.jsx)("button", {
            id: "knock-no",
            className: "btn btn-ghost btn-xs",
            onClick: () => Wh(e.key, e.from.id, !1),
            children: "Not now",
          }),
        ],
      }),
    ],
  });
}
var zi = P(Zt(), 1);
var oa = P(ct(), 1);
function l5() {
  let t = Y(),
    [e, a] = (0, zi.useState)(""),
    [r, o] = (0, zi.useState)(0),
    n = (0, zi.useRef)(null);
  (0, zi.useEffect)(() => {
    setTimeout(() => n.current?.focus(), 30);
  }, []);
  let i = (0, zi.useMemo)(() => {
      if (e.trim()) return Qg(e, 16);
      let g = wy(),
        m = new Map(g.map((b) => [b.id, b])),
        f = (t.settings.recentPlaces || []).map((b) => m.get(b)).filter(Boolean),
        y = g.filter((b) => b.kind === "Mine").slice(0, 4),
        x = o9.map((b) => m.get(b)).filter(Boolean),
        k = new Set();
      return [...f, ...y, ...x].filter((b) => !k.has(b.id) && k.add(b.id)).slice(0, 14);
    }, [e, t.settings.recentPlaces, t.estateMine]),
    s = t.coords,
    l = (g) => {
      let m = Math.hypot(g.x - s.x, g.z - s.z);
      return m >= 1e3 ? `${(m / 1e3).toFixed(1)} km` : `${Math.round(m / 10) * 10} m`;
    },
    c = () => C({ searchOpen: !1 }),
    d = (g) =>
      Up({
        recentPlaces: [g.id, ...(ot().settings.recentPlaces || []).filter((m) => m !== g.id)].slice(0, 6),
      }),
    h = (g) => {
      if (typeof g.run == "function") {
        (d(g), c(), g.run());
        return;
      }
      if (g.url) {
        (d(g), c(), window.__fyrusCountry?.fly ? window.__fyrusCountry.fly(g.flight || { name: g.name, province: g.sub || "", url: g.url, id: g.id }) : (location.href = g.url));
        return;
      }
      if ((d(g), c(), g.hall)) {
        Gs(g.hall);
        return;
      }
      es(g, g.name);
    },
    u = (g) => {
      if (g.url || typeof g.run == "function") return h(g);
      (d(g), c(), ts({ x: g.x, z: g.z, name: g.name }));
    },
    p = (g) => {
      (d(g), c(), _t()?.startTaxi({ x: g.x, z: g.z, name: g.name }));
    };
  return (0, oa.jsx)("div", {
    className: "fixed inset-0 z-[68] flex justify-center items-start pt-[8vh] px-3",
    style: { background: "rgba(0,0,0,.5)" },
    onClick: c,
    role: "dialog",
    "aria-label": "Search places",
    children: (0, oa.jsxs)("div", {
      className: "glass rounded-xl w-full max-w-xl pop-in overflow-hidden",
      onClick: (g) => g.stopPropagation(),
      children: [
        (0, oa.jsxs)("div", {
          className: "flex items-center gap-2 px-3 py-2.5",
          style: { borderBottom: "1px solid var(--line)" },
          children: [
            (0, oa.jsx)(Mi, { className: "opacity-70" }),
            (0, oa.jsx)("input", {
              ref: n,
              id: "qs-input",
              className: "flex-1 bg-transparent outline-none text-base",
              value: e,
              onChange: (g) => {
                (a(g.target.value), o(0));
              },
              onKeyDown: (g) => {
                (g.key === "ArrowDown" && (g.preventDefault(), o((m) => Math.min(i.length - 1, m + 1))),
                  g.key === "ArrowUp" && (g.preventDefault(), o((m) => Math.max(0, m - 1))),
                  g.key === "Enter" && i[r] && h(i[r]),
                  g.key === "Escape" && c());
              },
              placeholder: "Where to? A place, city, plot (EX-0042), shop, hall or person",
              "aria-label": "Search places",
            }),
            (0, oa.jsx)("button", {
              className: "hud-icon",
              onClick: c,
              "aria-label": "Close",
              children: (0, oa.jsx)(pe, {}),
            }),
          ],
        }),
        !e &&
          (0, oa.jsxs)("div", {
            className: "px-3 pt-2 text-[10px] font-bold tracking-[.2em]",
            style: { color: "var(--ink-dim)" },
            children: [(0, oa.jsx)(li, { className: "inline mr-1" }), "RECENT, YOURS AND POPULAR"],
          }),
        (0, oa.jsxs)("div", {
          className: "max-h-[60vh] overflow-y-auto p-1.5",
          children: [
            !i.length &&
              (0, oa.jsx)("div", {
                className: "p-4 text-sm",
                style: { color: "var(--ink-dim)" },
                children: "Nothing found. Try a city name, a shop number like FM-N07, or a plot like TC-07.",
              }),
            i.map((g, m) =>
              (0, oa.jsxs)(
                "div",
                {
                  "data-place": g.id,
                  className: `flex items-center gap-2 rounded-md px-2 py-1.5 ${m === r ? "chip-on" : ""}`,
                  onMouseEnter: () => o(m),
                  children: [
                    (0, oa.jsx)("span", { className: "w-6 text-center", children: g.icon }),
                    (0, oa.jsxs)("button", {
                      className: "flex-1 min-w-0 text-left",
                      onClick: () => h(g),
                      children: [
                        (0, oa.jsx)("div", { className: "text-sm font-bold truncate", children: g.name }),
                        (0, oa.jsxs)("div", {
                          className: "text-[11px] truncate",
                          style: { color: "var(--ink-dim)" },
                          children: [g.kind, " \xB7 ", g.sub],
                        }),
                      ],
                    }),
                    (0, oa.jsx)("span", {
                      className: "text-[11px] tabular w-14 text-right",
                      style: { color: "var(--ink-dim)" },
                      children: l(g),
                    }),
                    (0, oa.jsx)("button", {
                      className: "hud-icon",
                      title: "Route",
                      "aria-label": `Route to ${g.name}`,
                      onClick: () => u(g),
                      children: (0, oa.jsx)(dr, {}),
                    }),
                    (0, oa.jsx)("button", {
                      className: "hud-icon",
                      title: "Taxi",
                      "aria-label": `Taxi to ${g.name}`,
                      onClick: () => p(g),
                      children: (0, oa.jsx)(ci, {}),
                    }),
                    (0, oa.jsxs)("button", {
                      className: "btn btn-primary btn-xs",
                      "data-teleport": g.id,
                      onClick: () => h(g),
                      children: [(0, oa.jsx)(da, {}), " Teleport"],
                    }),
                  ],
                },
                g.id,
              ),
            ),
          ],
        }),
        (0, oa.jsxs)("div", {
          className: "px-3 py-2 text-[11px] flex gap-3",
          style: { borderTop: "1px solid var(--line)", color: "var(--ink-dim)" },
          children: [
            (0, oa.jsx)("span", { children: "\u2191\u2193 choose" }),
            (0, oa.jsx)("span", { children: "Enter teleport" }),
            (0, oa.jsx)("span", { children: "Esc close" }),
            (0, oa.jsx)("span", {
              className: "ml-auto",
              children: "Teleport is free \xB7 taxi shows the way",
            }),
          ],
        }),
      ],
    }),
  });
}
function O9() {
  let t = Y(),
    [e, a] = (0, zi.useState)(!1);
  return (
    (0, zi.useEffect)(() => {
      if (!t.teleFlash) return;
      a(!0);
      let r = setTimeout(() => a(!1), 520);
      return () => clearTimeout(r);
    }, [t.teleFlash]),
    e
      ? (0, oa.jsx)("div", {
          className: "fixed inset-0 z-[80] pointer-events-none tele-flash",
          "aria-hidden": "true",
        })
      : null
  );
}
var fi = P(ct(), 1);
function c5() {
  let t = Y(),
    e = t.inspect,
    a = (r, o = "") => {
      switch (r) {
        case "demo":
          (Ol(), Pl(o || t.scene.owner || ""));
          break;
        case "buyAgent":
          Ph(o);
          break;
        case "view3d": {
          let [n, i] = o.split("|");
          Dp(n, i);
          break;
        }
        case "buyProduct": {
          let [n, i] = o.split("|");
          Fh(n, i);
          break;
        }
        case "play":
          (Ol(), Uh(o));
          break;
        case "vote":
          $h(o);
          break;
        case "buyCar":
          (id("car", o), Ol());
          break;
        case "useCar":
          (tu(o), Ol(), C({ scene: { mode: "plaza" } }), setTimeout(Vs, 50));
          break;
        case "testDrive":
          _p(o);
          break;
        case "buyHome":
          (id("home", o), Ol());
          break;
        case "moveIn":
          (eu(o), Ol());
          break;
        case "order": {
          let [n, i, s] = o.split("|");
          $p(n, i, Number(s));
          break;
        }
      }
    };
  return (0, fi.jsxs)("div", {
    className: "fixed z-[57] right-3 bottom-20 w-[min(92vw,340px)] hud-box p-4 pop-in",
    role: "dialog",
    "aria-label": e.title,
    children: [
      (0, fi.jsx)("button", {
        className: "absolute right-2 top-2 hud-icon",
        style: { width: 30, height: 30 },
        onClick: Ol,
        "aria-label": "Close",
        children: (0, fi.jsx)(pe, {}),
      }),
      (0, fi.jsx)("div", { className: "text-lg font-bold text-white pr-8", children: e.title }),
      e.sub && (0, fi.jsx)("div", { className: "text-xs text-white/70", children: e.sub }),
      (0, fi.jsx)("ul", {
        className: "mt-2 space-y-1",
        children: e.lines.map((r, o) =>
          (0, fi.jsxs)(
            "li",
            {
              className: "text-sm text-white/90 flex gap-2",
              children: [(0, fi.jsx)("span", { style: { color: "var(--accent)" }, children: "\u2022" }), r],
            },
            o,
          ),
        ),
      }),
      (0, fi.jsx)("div", {
        className: "flex gap-2 flex-wrap mt-3",
        children: e.actions.map((r) =>
          (0, fi.jsx)(
            "button",
            {
              className: `btn btn-sm ${r.primary ? "btn-primary" : "btn-ghost"}`,
              onClick: () => a(r.act, r.payload),
              children: r.label,
            },
            r.label,
          ),
        ),
      }),
    ],
  });
}
var mc = P(Zt(), 1);
var xe = P(ct(), 1);
function D9() {
  let e = Y().invite;
  if (!e) return null;
  let a =
    e.kind === "game"
      ? `play ${e.game === "connect4" ? "Four in a Row" : e.game === "race" ? "Street Race" : "Chess"}`
      : e.kind === "call"
        ? "a voice call"
        : "a private chat";
  return (0, xe.jsxs)("div", {
    className: "fixed z-[75] right-3 top-16 hud-box p-3 w-[280px] pop-in",
    role: "alertdialog",
    "aria-label": "Invite",
    children: [
      (0, xe.jsxs)("div", {
        className: "text-sm text-white",
        children: [(0, xe.jsx)("b", { children: e.fromName }), " invited you to ", a, "."],
      }),
      (0, xe.jsxs)("div", {
        className: "flex gap-2 mt-2",
        children: [
          (0, xe.jsx)("button", {
            className: "btn btn-primary btn-sm flex-1",
            onClick: h9,
            children: "Accept",
          }),
          (0, xe.jsx)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => C({ invite: null }),
            children: "Not now",
          }),
        ],
      }),
    ],
  });
}
function d5() {
  let e = Y().dm,
    [a, r] = (0, mc.useState)(""),
    [o, n] = (0, mc.useState)(!1),
    [i, s] = (0, mc.useState)(!1),
    l = (0, mc.useRef)(null);
  (0, mc.useEffect)(() => {
    l.current?.scrollTo({ top: 1e6 });
  }, [e.msgs.length, o]);
  let c = e.call && !["ended", "no-mic", "failed"].includes(e.call);
  return (0, xe.jsxs)("div", {
    className: "fixed z-[58] left-3 bottom-16 w-[min(92vw,320px)] hud-box overflow-hidden pop-in",
    role: "dialog",
    "aria-label": "Private chat",
    children: [
      (0, xe.jsxs)("div", {
        className: "flex items-center gap-2 px-3 py-2",
        style: { borderBottom: "1px solid var(--line)" },
        children: [
          (0, xe.jsx)(Pr, { className: "text-white/70 shrink-0" }),
          (0, xe.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, xe.jsx)("div", {
                className: "text-sm font-bold text-white truncate",
                children: e.withName,
              }),
              (0, xe.jsxs)("div", {
                className: "text-[10px] text-white/60",
                children: ["Private \xB7 invite only", e.call ? ` \xB7 call ${e.call}` : ""],
              }),
            ],
          }),
          c
            ? (0, xe.jsxs)(xe.Fragment, {
                children: [
                  (0, xe.jsx)("button", {
                    className: "hud-icon",
                    style: { width: 30, height: 30 },
                    onClick: () => {
                      (d9(!i), s(!i));
                    },
                    "aria-label": i ? "Unmute" : "Mute",
                    children: i ? (0, xe.jsx)(o0, {}) : (0, xe.jsx)(rn, {}),
                  }),
                  (0, xe.jsx)("button", {
                    className: "hud-icon",
                    style: { width: 30, height: 30, background: "#c62828" },
                    onClick: c9,
                    "aria-label": "Hang up",
                    children: (0, xe.jsx)(ig, {}),
                  }),
                ],
              })
            : (0, xe.jsx)("button", {
                className: "hud-icon",
                style: { width: 30, height: 30 },
                onClick: () => ef(!0),
                "aria-label": "Voice call",
                children: (0, xe.jsx)(Ci, {}),
              }),
          (0, xe.jsx)("button", {
            className: "hud-icon",
            style: { width: 30, height: 30 },
            onClick: () => It("friends"),
            "aria-label": "Invite someone",
            children: (0, xe.jsx)(Os, {}),
          }),
          (0, xe.jsx)("button", {
            className: "hud-icon",
            style: { width: 30, height: 30 },
            onClick: () => n((d) => !d),
            "aria-label": "Minimise",
            children: (0, xe.jsx)(lg, {}),
          }),
          (0, xe.jsx)("button", {
            className: "hud-icon",
            style: { width: 30, height: 30 },
            onClick: () => Ty(),
            "aria-label": "Leave chat",
            children: (0, xe.jsx)(pe, {}),
          }),
        ],
      }),
      !o &&
        (0, xe.jsxs)(xe.Fragment, {
          children: [
            (0, xe.jsxs)("div", {
              ref: l,
              className: "scroll-y px-3 py-2 space-y-1.5",
              style: { maxHeight: 220, minHeight: 80 },
              children: [
                !e.msgs.length &&
                  (0, xe.jsx)("div", {
                    className: "text-xs text-white/60",
                    children: "Say hi. Messages here are only seen by people in this chat.",
                  }),
                e.msgs.map((d, h) =>
                  (0, xe.jsxs)(
                    "div",
                    {
                      className: `text-sm rounded-md px-2.5 py-1.5 max-w-[85%] text-white ${d.me ? "ml-auto" : ""}`,
                      style: {
                        background: d.me
                          ? "color-mix(in srgb, var(--accent) 40%, transparent)"
                          : "rgba(255,255,255,.08)",
                      },
                      children: [
                        !d.me &&
                          (0, xe.jsx)("div", { className: "text-[10px] opacity-70", children: d.from }),
                        d.text,
                      ],
                    },
                    h,
                  ),
                ),
              ],
            }),
            (0, xe.jsxs)("form", {
              className: "flex gap-1.5 p-2",
              onSubmit: (d) => {
                (d.preventDefault(), a.trim() && (l9(a.trim()), r("")));
              },
              children: [
                (0, xe.jsx)("input", {
                  className: "field py-2 text-sm",
                  value: a,
                  onChange: (d) => r(d.target.value),
                  placeholder: "Private message\u2026",
                  maxLength: 300,
                }),
                (0, xe.jsx)("button", {
                  className: "btn btn-primary btn-sm",
                  "aria-label": "Send",
                  children: (0, xe.jsx)(Da, {}),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
var D = P(ct(), 1),
  F9 = [
    {
      group: "Republic",
      items: [
        { id: "nation", label: "Republic of Fyrus", icon: Or },
        { id: "edu", label: "Education City", icon: Or },
        { id: "bazaar", label: "Fyrus Market (escrow)", icon: Or },
        { id: "politics", label: "Elections & parties", icon: Or },
        { id: "estate", label: "Land Office & societies", icon: Or },
        { id: "now", label: "Happening now", icon: Or },
        { id: "news", label: "Fyrus News TV", icon: Or },
        { id: "events", label: "Events & halls", icon: Or },
      ],
    },
    {
      group: "City",
      items: [
        { id: "map", label: "Map", icon: Ds },
        { id: "services", label: "Everyday services", icon: jo },
        { id: "shops", label: "Market", icon: jo },
        { id: "games", label: "Games", icon: on },
        { id: "people", label: "AI People", icon: $e },
        { id: "dream", label: "Dream Life", icon: Ji },
        { id: "friends", label: "Friends", icon: Kv },
        { id: "explore", label: "Quests", icon: og },
        { id: "live", label: "Live", icon: Qi },
      ],
    },
    {
      group: "Business",
      items: [
        { id: "market", label: "AI agents", icon: Nr },
        { id: "gigs", label: "Services", icon: hr },
        { id: "jobs", label: "Jobs", icon: $e },
        { id: "affiliate", label: "Affiliate", icon: ii },
        { id: "myshops", label: "My shops", icon: xg },
        { id: "openshop", label: "Open a shop", icon: Na },
        { id: "ads", label: "Ads", icon: n0 },
      ],
    },
    {
      group: "Social",
      items: [
        { id: "feed", label: "Feed", icon: r0 },
        { id: "profile", label: "Profile", icon: Ul },
      ],
    },
    {
      group: "Me",
      items: [
        { id: "homes", label: "Homes & keys", icon: ho },
        { id: "home", label: "My home", icon: ld },
        { id: "shop", label: "Style", icon: Qh },
        { id: "wallet", label: "Wallet", icon: ru },
        { id: "settings", label: "Settings", icon: Xv },
      ],
    },
  ],
  h5 = F9.flatMap((t) => t.items),
  cA = [
    { id: "client", label: "Buyer", icon: Yl },
    { id: "freelancer", label: "Creator", icon: Ji },
    { id: "affiliate", label: "Affiliate", icon: ii },
  ],
  dA = {
    explore: ry,
    feed: oy,
    market: ny,
    gigs: iy,
    jobs: sy,
    affiliate: ly,
    profile: uy,
    home: gy,
    live: fy,
    wallet: my,
    shop: vy,
    games: ix,
    ads: lx,
    settings: ky,
    map: My,
    shops: Eu,
    myshops: Ly,
    openshop: Cy,
    malls: Eu,
    friends: Ny,
    people: Ry,
    dream: By,
    nation: Iy,
    edu: dy,
    bazaar: _y,
    estate: Yy,
    news: qy,
    events: Xy,
    now: t5,
    admin: a5,
    homes: o5,
    politics: n5,
    services: i5,
  };
function hA() {
  let t = (0, nr.useRef)(null),
    [e, a] = (0, nr.useState)("");
  return (
    (0, nr.useEffect)(() => {
      if (!t.current) return;
      let r = null;
      try {
        ((r = new Zg(t.current)), ox(r));
      } catch (o) {
        (console.error("[World]", o?.stack || o), a(o?.message || "WebGL could not start."));
      }
      return () => {
        (r?.dispose(), ox(null));
      };
    }, []),
    (0, D.jsx)("div", {
      ref: t,
      className: "fixed inset-0",
      "aria-label": "Fyrus 3D city",
      children:
        e &&
        (0, D.jsx)("div", {
          className: "absolute inset-0 grid place-items-center p-6 text-center",
          children: (0, D.jsxs)("div", {
            className: "glass rounded-xl p-6 max-w-sm",
            children: [
              "The 3D city could not load: ",
              e,
              ". Everything else still works from the menu (Tab).",
            ],
          }),
        }),
    })
  );
}
function uA({ place: t, coords: e }) {
  let a = (0, nr.useRef)(null);
  return (
    (0, nr.useEffect)(() => {
      let r = setInterval(() => {
        let o = _t();
        o && a.current && o.minimap !== a.current && (o.minimap = a.current);
      }, 300);
      return () => clearInterval(r);
    }, []),
    (0, D.jsxs)("button", {
      className: "block text-left",
      onClick: () => It("map"),
      "aria-label": "Open map",
      children: [
        (0, D.jsx)("canvas", {
          ref: a,
          width: 340,
          height: 340,
          className: "block hud-box",
          style: { width: 170, height: 170, padding: 0 },
        }),
        (0, D.jsxs)("div", {
          className:
            "mt-1 flex items-center justify-between text-[11px] font-bold text-white hud-text-shadow",
          style: { width: 170 },
          children: [
            (0, D.jsx)("span", { className: "truncate", children: t }),
            (0, D.jsx)("span", { className: "tabular opacity-75 font-mono", children: e }),
          ],
        }),
      ],
    })
  );
}
var pA = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
function gA() {
  let t = Y(),
    [e, a] = (0, nr.useState)(0),
    [r, o] = (0, nr.useState)(null);
  (0, nr.useEffect)(() => {
    let l = setInterval(() => {
      let c = _t();
      if (!c) return;
      let d = ((((-c.yaw * 180) / Math.PI) % 360) + 360) % 360;
      a(d);
      let h = c.player.root.position,
        u = ot().waypoint;
      if (u && c.active === c.world) {
        let p = ((Math.atan2(u.x - h.x, -(u.z - h.z)) * 180) / Math.PI + 360) % 360;
        o({ b: p, d: Math.hypot(u.x - h.x, u.z - h.z) });
      } else o(null);
    }, 60);
    return () => clearInterval(l);
  }, []);
  let n = 3,
    i = [];
  for (let l = Math.floor((e - 70) / 15) * 15; l <= e + 70; l += 15) {
    let c = ((l % 360) + 360) % 360,
      d = (l - e) * n;
    i.push(
      (0, D.jsxs)(
        "div",
        {
          className: "absolute top-0 -translate-x-1/2 text-center",
          style: { left: `calc(50% + ${d}px)` },
          children: [
            (0, D.jsx)("div", {
              className: "mx-auto",
              style: { width: 1, height: c % 45 === 0 ? 9 : 5, background: "rgba(255,255,255,.8)" },
            }),
            (0, D.jsx)("div", {
              className: `font-mono ${c % 45 === 0 ? "text-[12px] font-bold text-white" : "text-[9px] text-white/70"}`,
              children: c % 45 === 0 ? pA[c / 45] : c,
            }),
          ],
        },
        l,
      ),
    );
  }
  let s = null;
  if (r) {
    let l = r.b - e;
    ((l = ((l + 540) % 360) - 180), (s = Math.max(-70, Math.min(70, l)) * n));
  }
  return (0, D.jsxs)("div", {
    className: "relative mx-auto",
    style: { width: 420, maxWidth: "60vw" },
    children: [
      (0, D.jsxs)("div", {
        className: "relative h-8 overflow-hidden compass-strip hud-text-shadow",
        children: [
          i,
          s !== null &&
            (0, D.jsx)("div", {
              className: "absolute top-0 -translate-x-1/2",
              style: { left: `calc(50% + ${s}px)` },
              children: (0, D.jsx)("div", {
                className: "w-0 h-0 mx-auto",
                style: {
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "9px solid #ffc27a",
                },
              }),
            }),
        ],
      }),
      (0, D.jsxs)("div", {
        className:
          "absolute left-1/2 -translate-x-1/2 -bottom-4 text-[11px] font-mono font-bold text-white hud-text-shadow tabular",
        children: [Math.round(e), "\xB0"],
      }),
      r &&
        t.waypoint &&
        (0, D.jsxs)("div", {
          className:
            "absolute left-1/2 -translate-x-1/2 top-12 text-[11px] font-bold hud-text-shadow whitespace-nowrap",
          style: { color: "#ffc27a" },
          children: [
            t.waypoint.name,
            " \xB7 ",
            r.d >= 1e3 ? (r.d / 1e3).toFixed(1) + " km" : Math.round(r.d) + " m",
          ],
        }),
    ],
  });
}
function fA() {
  let e = Y().game,
    a = e.lastDaily === new Date(Date.now() - 864e5).toISOString().slice(0, 10) ? e.streak + 1 : 1;
  return (0, D.jsx)("div", {
    className: "fixed inset-0 z-[65] grid place-items-center p-4",
    style: { background: "rgba(0,0,0,.55)" },
    children: (0, D.jsxs)("div", {
      className: "glass rounded-xl p-6 w-full max-w-md pop-in text-center",
      children: [
        (0, D.jsx)(ug, { className: "mx-auto text-4xl", style: { color: "var(--ember)" } }),
        (0, D.jsx)("h2", { className: "hud-font text-3xl mt-2", children: "DAILY REWARD" }),
        (0, D.jsx)("div", {
          className: "grid grid-cols-7 gap-1.5 mt-4",
          children: Array.from({ length: 7 }).map((r, o) => {
            let n = o + 1,
              i = n === Math.min(a, 7),
              s = n < Math.min(a, 7);
            return (0, D.jsxs)(
              "div",
              {
                className: "rounded-md py-2 text-center",
                style: {
                  background: i ? "var(--accent)" : s ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.04)",
                  border: "1px solid var(--line)",
                },
                children: [
                  (0, D.jsxs)("div", { className: "text-[10px] font-bold", children: ["Day ", n] }),
                  (0, D.jsx)("div", { className: "font-bold text-sm tabular", children: 20 + 10 * n }),
                ],
              },
              o,
            );
          }),
        }),
        (0, D.jsxs)("button", {
          className: "btn btn-primary w-full mt-5 py-3",
          onClick: pM,
          id: "claim-daily",
          children: ["Claim ", 20 + 10 * Math.min(a, 7), " orbs"],
        }),
      ],
    }),
  });
}
function mA({ level: t }) {
  return (
    (0, nr.useEffect)(() => {
      let e = setTimeout(() => C({ levelUp: null }), 3200);
      return () => clearTimeout(e);
    }, [t]),
    (0, D.jsxs)("div", {
      className:
        "fixed z-[66] left-1/2 -translate-x-1/2 top-[18%] text-center pointer-events-none district-banner",
      children: [
        (0, D.jsx)("div", {
          className: "text-[11px] tracking-[.4em] text-white/80 hud-text-shadow",
          children: "LEVEL UP",
        }),
        (0, D.jsx)("div", {
          className: "hud-font text-white hud-text-shadow",
          style: { fontSize: 72, lineHeight: 1 },
          children: t,
        }),
      ],
    })
  );
}
function vA() {
  let t = Y(),
    e = Zc.find((r) => !t.game.claimed.includes(r.id));
  if (!e) return null;
  let a = t.game.quests[e.id] || 0;
  return (0, D.jsxs)("button", {
    className: "hud-box px-3 py-2 text-left w-[170px]",
    onClick: () => It("explore"),
    children: [
      (0, D.jsx)("div", {
        className: "text-[10px] font-bold tracking-widest text-white/60",
        children: "QUEST",
      }),
      (0, D.jsxs)("div", {
        className: "text-xs font-bold text-white truncate",
        children: [a >= e.target ? "\u2713 " : "", e.title],
      }),
      (0, D.jsx)("div", {
        className: "h-1 rounded-full mt-1.5 bg-white/15 overflow-hidden",
        children: (0, D.jsx)("div", {
          className: "h-full",
          style: { width: `${Math.min(100, (a / e.target) * 100)}%`, background: "var(--accent)" },
        }),
      }),
    ],
  });
}
function xA() {
  let t = Y(),
    [e, a] = (0, nr.useState)(null),
    r = (0, nr.useRef)(!0);
  return (
    (0, nr.useEffect)(() => {
      if (r.current) {
        r.current = !1;
        return;
      }
      a({ k: Date.now(), name: t.district });
      let o = setTimeout(() => a(null), 3300);
      return () => clearTimeout(o);
    }, [t.district]),
    !e || t.intro
      ? null
      : (0, D.jsx)(
          "div",
          {
            className: "district-banner fixed z-20 left-1/2 top-[20%] text-center pointer-events-none",
            children: (0, D.jsx)("div", {
              className: "hud-font text-white hud-text-shadow text-4xl md:text-5xl whitespace-nowrap",
              children: e.name.toUpperCase(),
            }),
          },
          e.k,
        )
  );
}
