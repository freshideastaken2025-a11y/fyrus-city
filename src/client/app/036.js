function XB() {
  let e = Y().politics,
    a = Object.fromEntries(e.parties.map((n) => [n.id, n])),
    r = e.partyVotes || {},
    o = Math.max(1, ...Object.values(r));
  return (0, R.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, R.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, R.jsxs)("div", {
            className: "text-xs font-bold mb-2",
            children: [
              "PARLIAMENT \xB7 ",
              e.seats,
              " SEATS ",
              e.phase === "voting" ? "\xB7 LIVE PROJECTION" : "",
            ],
          }),
          e.phase === "nominations"
            ? (0, R.jsxs)("div", {
                className: "text-[12px]",
                style: fe,
                children: [
                  "Party votes open with the polls. Parties: ",
                  e.parties.length
                    ? e.parties.map((n) => n.short).join(", ")
                    : "none yet \u2014 found the first one!",
                ],
              })
            : Object.keys(r).length
              ? (0, R.jsxs)(R.Fragment, {
                  children: [
                    (0, R.jsx)(z9, { seats: e.projected, parties: a, total: e.seats }),
                    Object.entries(r)
                      .sort((n, i) => i[1] - n[1])
                      .map(([n, i]) =>
                        (0, R.jsxs)(
                          "div",
                          {
                            className: "py-1 text-sm",
                            children: [
                              (0, R.jsxs)("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  (0, R.jsx)(fc, { p: a[n], size: 20 }),
                                  (0, R.jsx)("span", { className: "flex-1", children: a[n]?.name }),
                                  (0, R.jsx)("b", { className: "tabular", children: i }),
                                  (0, R.jsxs)("span", {
                                    className: "text-[11px] w-16 text-right",
                                    style: fe,
                                    children: [e.projected[n] || 0, " seats"],
                                  }),
                                ],
                              }),
                              (0, R.jsx)(A9, { v: i, max: o, color: a[n]?.color }),
                            ],
                          },
                          n,
                        ),
                      ),
                  ],
                })
              : (0, R.jsx)("div", {
                  className: "text-[12px]",
                  style: fe,
                  children: "No party votes yet. Be the first to vote.",
                }),
        ],
      }),
      (0, R.jsx)("div", {
        className: "text-[11px] font-bold tracking-wide",
        style: fe,
        children: "MAYOR RACES",
      }),
      (0, R.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-2",
        children: xd.map((n) => {
          let i = e.cands.filter((l) => l.city === n.id).sort((l, c) => c.votes - l.votes),
            s = Math.max(1, ...i.map((l) => l.votes));
          return (0, R.jsxs)(
            "div",
            {
              className: "card p-2.5",
              "data-race": n.id,
              children: [
                (0, R.jsxs)("div", {
                  className: "text-[12px] font-bold flex items-center gap-1.5",
                  children: [
                    (0, R.jsx)("span", {
                      className: "w-2.5 h-2.5 rounded-sm",
                      style: { background: n.color },
                    }),
                    n.name,
                  ],
                }),
                i.length
                  ? i.map((l) =>
                      (0, R.jsxs)(
                        "div",
                        {
                          className: "mt-1.5 text-[12px]",
                          style: { opacity: l.dq ? 0.5 : 1 },
                          children: [
                            (0, R.jsxs)("div", {
                              className: "flex items-center gap-1.5",
                              children: [
                                (0, R.jsx)(fc, {
                                  p: a[l.party] || { symbol: "I", color: "#6b7280" },
                                  size: 18,
                                }),
                                (0, R.jsxs)("span", {
                                  className: "flex-1 truncate",
                                  children: [
                                    l.name,
                                    " ",
                                    (0, R.jsxs)("span", {
                                      style: fe,
                                      children: ["\xB7 ", a[l.party]?.short || "Independent"],
                                    }),
                                    l.dq ? " \xB7 disqualified" : "",
                                  ],
                                }),
                                e.phase === "voting" &&
                                  (0, R.jsx)("b", { className: "tabular", children: l.votes }),
                              ],
                            }),
                            e.phase === "voting" &&
                              (0, R.jsx)(A9, { v: l.votes, max: s, color: a[l.party]?.color || "#9aa0a6" }),
                          ],
                        },
                        l.id,
                      ),
                    )
                  : (0, R.jsx)("div", {
                      className: "text-[11px] mt-1",
                      style: fe,
                      children:
                        e.phase === "nominations" ? "No candidates yet." : "Nobody is standing this time.",
                    }),
              ],
            },
            n.id,
          );
        }),
      }),
      (0, R.jsxs)("div", {
        className: "card p-3 flex flex-wrap gap-2 items-center text-[12px]",
        children: [
          (0, R.jsx)(rn, { style: { color: "var(--accent)" } }),
          (0, R.jsx)("span", {
            className: "flex-1",
            children:
              "Campaign: hold a rally or a debate in a conference hall, put your poster on a billboard, and get covered on Fyrus News TV.",
          }),
          (0, R.jsx)("button", {
            className: "btn btn-ghost btn-xs",
            onClick: () => En("book"),
            children: "Book a hall",
          }),
          (0, R.jsx)("button", {
            className: "btn btn-ghost btn-xs",
            onClick: () => It("ads"),
            children: "Billboards",
          }),
        ],
      }),
    ],
  });
}
function z9({ seats: t, parties: e, total: a }) {
  let r = Object.entries(t)
      .sort((i, s) => s[1] - i[1])
      .flatMap(([i, s]) => Array(s).fill(i)),
    o = 260,
    n = 140;
  return (0, R.jsxs)("svg", {
    viewBox: `0 0 ${o} ${n}`,
    className: "w-full max-w-xs mx-auto block mb-2",
    role: "img",
    "aria-label": "Parliament seats",
    children: [
      Array.from({ length: a }, (i, s) => {
        let l = s % 3,
          c = Math.floor(s / 3),
          d = Math.ceil(a / 3),
          h = Math.PI - ((c + 0.5) / d) * Math.PI,
          u = 60 + l * 22;
        return (0, R.jsx)(
          "circle",
          {
            cx: o / 2 + Math.cos(h) * u,
            cy: n - 8 - Math.sin(h) * u,
            r: 8,
            fill: r[s] ? e[r[s]]?.color || "#555" : "rgba(255,255,255,.12)",
          },
          s,
        );
      }),
      (0, R.jsxs)("text", {
        x: o / 2,
        y: n - 10,
        textAnchor: "middle",
        fontSize: "16",
        fontWeight: "700",
        fill: "currentColor",
        children: [r.length, "/", a],
      }),
    ],
  });
}
function JB() {
  let t = Y(),
    e = t.politics,
    a = t.polMe,
    [r, o] = (0, Yr.useState)(a.home || ""),
    [n, i] = (0, Yr.useState)(""),
    [s, l] = (0, Yr.useState)("");
  if (a.canVote)
    return (0, R.jsxs)("div", {
      className: "card p-3 text-sm space-y-2",
      "data-vote-blocked": !0,
      children: [
        (0, R.jsx)("div", { className: "font-bold", children: "You can't vote yet" }),
        (0, R.jsx)("div", { style: fe, children: a.canVote }),
        /Settings/.test(a.canVote) &&
          (0, R.jsx)("button", {
            className: "btn btn-primary btn-sm",
            onClick: () => It("settings"),
            children: "Save my account",
          }),
      ],
    });
  let c = e.cands.filter((d) => d.city === a.home && !d.dq);
  return (0, R.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, R.jsxs)("div", {
        className: "card p-3 space-y-2",
        children: [
          (0, R.jsxs)("div", {
            className: "text-xs font-bold",
            children: [
              "1 \xB7 YOUR HOME CITY ",
              a.home && (0, R.jsxs)("span", { style: fe, children: ["\xB7 ", C0(a.home)] }),
            ],
          }),
          a.home
            ? (0, R.jsxs)("div", {
                className: "text-[12px]",
                style: fe,
                children: [
                  "You vote for the Mayor of ",
                  C0(a.home),
                  ". You can pick another city next election.",
                ],
              })
            : (0, R.jsxs)(R.Fragment, {
                children: [
                  (0, R.jsx)("div", {
                    className: "flex gap-1 flex-wrap",
                    children: xd.map((d) =>
                      (0, R.jsx)(
                        "button",
                        {
                          "data-home-city": d.id,
                          className: `chip ${r === d.id ? "chip-on" : ""}`,
                          onClick: () => o(d.id),
                          children: d.name,
                        },
                        d.id,
                      ),
                    ),
                  }),
                  (0, R.jsx)("button", {
                    id: "pol-register",
                    className: "btn btn-primary btn-sm",
                    disabled: !r,
                    onClick: () => Tn({ t: "pol_home", city: r }),
                    children: "Register to vote here",
                  }),
                ],
              }),
        ],
      }),
      a.home &&
        e.phase === "nominations" &&
        (0, R.jsxs)("div", {
          className: "card p-3 text-[12px] flex items-center gap-2",
          children: [
            (0, R.jsx)(li, {}),
            " Ballots open in ",
            j0(e.until, e.skew),
            ". Meanwhile read the manifestos and candidates' statements.",
          ],
        }),
      a.home &&
        e.phase === "voting" &&
        (0, R.jsxs)(R.Fragment, {
          children: [
            (0, R.jsxs)("div", {
              className: "card p-3 space-y-2",
              children: [
                (0, R.jsxs)("div", {
                  className: "text-xs font-bold",
                  children: ["2 \xB7 MAYOR OF ", C0(a.home).toUpperCase()],
                }),
                a.voted?.mayor
                  ? (0, R.jsxs)("div", {
                      className: "text-[12px] flex items-center gap-1.5",
                      children: [
                        (0, R.jsx)(_e, { style: { color: "#45e0ae" } }),
                        " You voted for ",
                        e.cands.find((d) => d.id === a.voted.mayor)?.name || "a candidate",
                        ".",
                      ],
                    })
                  : c.length
                    ? (0, R.jsxs)(R.Fragment, {
                        children: [
                          c.map((d) => {
                            let h = e.parties.find((u) => u.id === d.party);
                            return (0, R.jsxs)(
                              "label",
                              {
                                className: "flex gap-2 items-start text-sm p-1.5 rounded-md cursor-pointer",
                                style: {
                                  border: `1px solid ${n === d.id ? "var(--accent)" : "var(--line)"}`,
                                },
                                children: [
                                  (0, R.jsx)("input", {
                                    type: "radio",
                                    name: "mayor",
                                    "data-ballot-mayor": d.id,
                                    checked: n === d.id,
                                    onChange: () => i(d.id),
                                    className: "mt-1",
                                  }),
                                  (0, R.jsx)(fc, { p: h || { symbol: "I", color: "#6b7280" }, size: 22 }),
                                  (0, R.jsxs)("span", {
                                    children: [
                                      (0, R.jsx)("b", { children: d.name }),
                                      " ",
                                      (0, R.jsxs)("span", {
                                        style: fe,
                                        children: ["\xB7 ", h?.name || "Independent"],
                                      }),
                                      (0, R.jsx)("span", {
                                        className: "block text-[12px]",
                                        style: fe,
                                        children: d.statement,
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              d.id,
                            );
                          }),
                          (0, R.jsx)("button", {
                            id: "vote-mayor",
                            className: "btn btn-primary btn-sm",
                            disabled: !n,
                            onClick: () => Tn({ t: "pol_vote", mayor: n }),
                            children: "Cast my vote for Mayor",
                          }),
                        ],
                      })
                    : (0, R.jsx)("div", {
                        className: "text-[12px]",
                        style: fe,
                        children: "Nobody is standing in your city this time.",
                      }),
              ],
            }),
            (0, R.jsxs)("div", {
              className: "card p-3 space-y-2",
              children: [
                (0, R.jsx)("div", {
                  className: "text-xs font-bold",
                  children: "3 \xB7 PARLIAMENT \u2014 ONE PARTY",
                }),
                a.voted?.party
                  ? (0, R.jsxs)("div", {
                      className: "text-[12px] flex items-center gap-1.5",
                      children: [
                        (0, R.jsx)(_e, { style: { color: "#45e0ae" } }),
                        " You voted for ",
                        e.parties.find((d) => d.id === a.voted.party)?.name,
                        ".",
                      ],
                    })
                  : e.parties.length
                    ? (0, R.jsxs)(R.Fragment, {
                        children: [
                          e.parties.map((d) =>
                            (0, R.jsxs)(
                              "label",
                              {
                                className: "flex gap-2 items-center text-sm p-1.5 rounded-md cursor-pointer",
                                style: {
                                  border: `1px solid ${s === d.id ? "var(--accent)" : "var(--line)"}`,
                                },
                                children: [
                                  (0, R.jsx)("input", {
                                    type: "radio",
                                    name: "party",
                                    "data-ballot-party": d.id,
                                    checked: s === d.id,
                                    onChange: () => l(d.id),
                                  }),
                                  (0, R.jsx)(fc, { p: d, size: 22 }),
                                  (0, R.jsxs)("span", {
                                    className: "flex-1",
                                    children: [
                                      (0, R.jsx)("b", { children: d.name }),
                                      " ",
                                      (0, R.jsxs)("span", { style: fe, children: ["\xB7 ", d.slogan] }),
                                    ],
                                  }),
                                ],
                              },
                              d.id,
                            ),
                          ),
                          (0, R.jsx)("button", {
                            id: "vote-party",
                            className: "btn btn-primary btn-sm",
                            disabled: !s,
                            onClick: () => Tn({ t: "pol_vote", party: s }),
                            children: "Cast my party vote",
                          }),
                        ],
                      })
                    : (0, R.jsx)("div", {
                        className: "text-[12px]",
                        style: fe,
                        children: "No parties registered yet.",
                      }),
              ],
            }),
            (0, R.jsx)("div", {
              className: "text-[11px]",
              style: fe,
              children:
                "Votes are final. One vote for Mayor and one for a party per election. Vote buying is a bannable offence.",
            }),
          ],
        }),
    ],
  });
}
function QB() {
  let t = Y(),
    e = t.politics,
    a = t.polMe,
    [r, o] = (0, Yr.useState)(t.polFocus?.party || null),
    [n, i] = (0, Yr.useState)(!1),
    s = r && e.parties.find((l) => l.id === r);
  return n
    ? (0, R.jsx)(tA, { done: () => i(!1) })
    : s
      ? (0, R.jsxs)("div", {
          className: "space-y-2",
          "data-party": s.id,
          children: [
            (0, R.jsx)("button", {
              className: "btn btn-ghost btn-xs",
              onClick: () => o(null),
              children: "\u2190 All parties",
            }),
            (0, R.jsxs)("div", {
              className: "card p-4 space-y-2",
              style: { borderColor: s.color },
              children: [
                (0, R.jsxs)("div", {
                  className: "flex items-center gap-3",
                  children: [
                    (0, R.jsx)(fc, { p: s, size: 48 }),
                    (0, R.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        (0, R.jsxs)("div", {
                          className: "text-lg font-bold",
                          children: [
                            s.name,
                            " ",
                            (0, R.jsxs)("span", {
                              className: "text-sm",
                              style: fe,
                              children: ["(", s.short, ")"],
                            }),
                          ],
                        }),
                        (0, R.jsxs)("div", {
                          className: "text-sm italic",
                          children: ["\u201C", s.slogan, "\u201D"],
                        }),
                        (0, R.jsxs)("div", {
                          className: "text-[11px]",
                          style: fe,
                          children: [
                            "Leader ",
                            s.leaderName,
                            " \xB7 ",
                            s.members,
                            " member",
                            s.members === 1 ? "" : "s",
                            " \xB7 since ",
                            new Date(s.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, R.jsx)("div", { className: "text-[11px] font-bold", style: fe, children: "MANIFESTO" }),
                (0, R.jsx)("div", { className: "text-[13px] whitespace-pre-wrap", children: s.manifesto }),
                (0, R.jsx)("div", { className: "text-[11px] font-bold", style: fe, children: "MEMBERS" }),
                (0, R.jsx)("div", {
                  className: "flex flex-wrap gap-1",
                  children: s.memberNames.map((l, c) =>
                    (0, R.jsx)("span", { className: "chip", children: l }, c),
                  ),
                }),
                (0, R.jsxs)("div", {
                  className: "flex gap-2 pt-1",
                  children: [
                    a.party === s.id
                      ? (0, R.jsx)("button", {
                          id: "party-leave",
                          className: "btn btn-ghost btn-sm",
                          onClick: () => Tn({ t: "pol_leave" }),
                          children: "Leave party",
                        })
                      : !a.party &&
                        (0, R.jsxs)("button", {
                          id: "party-join",
                          className: "btn btn-primary btn-sm",
                          disabled: !!a.canVote,
                          onClick: () => Tn({ t: "pol_join", party: s.id }),
                          children: [(0, R.jsx)($e, {}), " Join ", s.short],
                        }),
                    a.judge &&
                      (0, R.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => {
                          let l = prompt("Reason for deregistering this party");
                          l && Tn({ t: "pol_party_ban", id: s.id, reason: l });
                        },
                        children: "Deregister (judge)",
                      }),
                  ],
                }),
                a.canVote && (0, R.jsx)("div", { className: "text-[11px]", style: fe, children: a.canVote }),
              ],
            }),
          ],
        })
      : (0, R.jsxs)("div", {
          className: "space-y-2",
          children: [
            !a.party &&
              (0, R.jsxs)("div", {
                className: "card p-3 flex items-center gap-2 text-sm",
                children: [
                  (0, R.jsx)(Fs, { style: { color: "#b06ad9" } }),
                  (0, R.jsxs)("span", {
                    className: "flex-1",
                    children: [
                      "Start your own party \u2014 name, symbol, colours and manifesto. ",
                      q(Zs.party),
                      " to register, passport holders only.",
                    ],
                  }),
                  (0, R.jsx)("button", {
                    id: "party-new",
                    className: "btn btn-primary btn-sm",
                    onClick: () => i(!0),
                    children: "Found a party",
                  }),
                ],
              }),
            e.parties.length
              ? e.parties
                  .slice()
                  .sort((l, c) => c.members - l.members)
                  .map((l) =>
                    (0, R.jsxs)(
                      "button",
                      {
                        "data-party-row": l.id,
                        className: "w-full card p-2.5 flex items-center gap-2.5 text-left card-hover",
                        onClick: () => o(l.id),
                        children: [
                          (0, R.jsx)(fc, { p: l }),
                          (0, R.jsxs)("span", {
                            className: "flex-1 min-w-0",
                            children: [
                              (0, R.jsxs)("span", {
                                className: "block text-sm font-bold truncate",
                                children: [
                                  l.name,
                                  " ",
                                  (0, R.jsxs)("span", { style: fe, children: ["(", l.short, ")"] }),
                                  a.party === l.id ? " \xB7 your party" : "",
                                ],
                              }),
                              (0, R.jsx)("span", {
                                className: "block text-[11px] truncate",
                                style: fe,
                                children: l.slogan,
                              }),
                            ],
                          }),
                          (0, R.jsxs)("span", {
                            className: "text-[11px] tabular",
                            style: fe,
                            children: [l.members, " members"],
                          }),
                        ],
                      },
                      l.id,
                    ),
                  )
              : (0, R.jsx)("div", { className: "text-sm", style: fe, children: "No parties yet." }),
          ],
        });
}
function tA({ done: t }) {
  let a = Y().polMe,
    [r, o] = (0, Yr.useState)({
      name: "",
      short: "",
      symbol: Xx[0],
      color: Jx[0],
      color2: "#ffffff",
      slogan: "",
      manifesto: "",
    }),
    n = (i, s) => o({ ...r, [i]: s });
  return (
    (0, Yr.useEffect)(() => {
      a.party && t();
    }, [a.party]),
    (0, R.jsxs)("div", {
      className: "card p-3 space-y-2",
      "data-party-form": !0,
      children: [
        (0, R.jsxs)("div", {
          className: "flex items-center gap-3",
          children: [
            (0, R.jsx)(fc, { p: r, size: 44 }),
            (0, R.jsxs)("div", {
              className: "text-sm font-bold",
              children: [
                r.name || "Your party",
                " ",
                r.short && (0, R.jsxs)("span", { style: fe, children: ["(", r.short.toUpperCase(), ")"] }),
                (0, R.jsx)("div", { className: "text-[12px] italic font-normal", children: r.slogan }),
              ],
            }),
          ],
        }),
        a.canRun &&
          (0, R.jsx)("div", {
            className: "text-[12px]",
            style: { color: "var(--ember-hi)" },
            children: a.canRun,
          }),
        (0, R.jsx)("input", {
          id: "pf-name",
          className: "field",
          placeholder: "Party name (made up \u2014 no real-world parties)",
          maxLength: sc.name,
          value: r.name,
          onChange: (i) => n("name", i.target.value),
        }),
        (0, R.jsx)("input", {
          id: "pf-short",
          className: "field",
          placeholder: "Short code, e.g. FPP",
          maxLength: sc.short,
          value: r.short,
          onChange: (i) => n("short", i.target.value),
        }),
        (0, R.jsx)("div", {
          className: "flex gap-1 flex-wrap",
          children: Xx.map((i) =>
            (0, R.jsx)(
              "button",
              {
                "data-symbol": i,
                className: `w-8 h-8 rounded-md text-base ${r.symbol === i ? "chip-on" : ""}`,
                style: { border: "1px solid var(--line)" },
                onClick: () => n("symbol", i),
                children: i,
              },
              i,
            ),
          ),
        }),
        (0, R.jsxs)("div", {
          className: "flex gap-1 flex-wrap items-center",
          children: [
            (0, R.jsx)("span", { className: "text-[11px] mr-1", style: fe, children: "Colour" }),
            Jx.map((i) =>
              (0, R.jsx)(
                "button",
                {
                  "data-pcolor": i,
                  "aria-label": `Party colour ${i}`,
                  className: "w-6 h-6 rounded-md",
                  style: {
                    background: i,
                    outline: r.color === i ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,.3)",
                    outlineOffset: 1,
                  },
                  onClick: () => n("color", i),
                },
                i,
              ),
            ),
            (0, R.jsx)("span", { className: "text-[11px] mx-1", style: fe, children: "Symbol colour" }),
            ["#ffffff", "#1b1d22", "#ffd23f"].map((i) =>
              (0, R.jsx)(
                "button",
                {
                  "aria-label": `Symbol colour ${i}`,
                  className: "w-6 h-6 rounded-md",
                  style: {
                    background: i,
                    outline: r.color2 === i ? "2px solid var(--accent)" : "1px solid rgba(255,255,255,.3)",
                    outlineOffset: 1,
                  },
                  onClick: () => n("color2", i),
                },
                i,
              ),
            ),
          ],
        }),
        (0, R.jsx)("input", {
          id: "pf-slogan",
          className: "field",
          placeholder: "Slogan",
          maxLength: sc.slogan,
          value: r.slogan,
          onChange: (i) => n("slogan", i.target.value),
        }),
        (0, R.jsx)("textarea", {
          id: "pf-manifesto",
          className: "field min-h-[110px]",
          placeholder:
            "Manifesto: what will your party do for Fyrus? (cheaper metro, more parks, free courses\u2026)",
          maxLength: sc.manifesto,
          value: r.manifesto,
          onChange: (i) => n("manifesto", i.target.value),
        }),
        (0, R.jsxs)("div", {
          className: "flex gap-2",
          children: [
            (0, R.jsxs)("button", {
              id: "pf-create",
              className: "btn btn-primary btn-sm",
              disabled: !!a.canRun,
              onClick: () => Tn({ t: "pol_party_create", ...r }),
              children: ["Register party \xB7 ", q(Zs.party)],
            }),
            (0, R.jsx)("button", { className: "btn btn-ghost btn-sm", onClick: t, children: "Cancel" }),
          ],
        }),
      ],
    })
  );
}
function eA() {
  let t = Y(),
    e = t.politics,
    a = t.polMe,
    [r, o] = (0, Yr.useState)(""),
    [n, i] = (0, Yr.useState)(!a.party),
    s = e.parties.find((l) => l.id === a.party);
  return a.cand
    ? (0, R.jsxs)("div", {
        className: "card p-3 space-y-2 text-sm",
        "data-my-cand": !0,
        children: [
          (0, R.jsxs)("div", {
            className: "font-bold",
            children: [
              "You are standing for Mayor of ",
              C0(a.cand.city),
              a.cand.party ? ` for ${s?.name}` : " as an independent",
              ".",
            ],
          }),
          (0, R.jsxs)("div", { style: fe, children: ["\u201C", a.cand.statement, "\u201D"] }),
          (0, R.jsxs)("div", {
            className: "flex gap-2 flex-wrap",
            children: [
              (0, R.jsx)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => En("book"),
                children: "Book a rally hall",
              }),
              (0, R.jsx)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => It("ads"),
                children: "Billboard poster",
              }),
              e.phase === "nominations" &&
                (0, R.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => Tn({ t: "pol_withdraw" }),
                  children: "Withdraw",
                }),
            ],
          }),
        ],
      })
    : (0, R.jsxs)("div", {
        className: "card p-3 space-y-2",
        children: [
          (0, R.jsxs)("div", {
            className: "text-sm font-bold",
            children: ["Stand for Mayor", a.home ? ` of ${C0(a.home)}` : ""],
          }),
          (0, R.jsxs)("div", {
            className: "text-[12px]",
            style: fe,
            children: [
              "Passport holders stand in their home city during nominations. Fee ",
              q(Zs.nominate),
              " (not refunded). The candidate with the most votes in the city becomes Mayor until the next election.",
            ],
          }),
          a.canRun
            ? (0, R.jsx)("div", {
                className: "text-[12px]",
                style: { color: "var(--ember-hi)" },
                children: a.canRun,
              })
            : a.home
              ? e.phase !== "nominations"
                ? (0, R.jsxs)("div", {
                    className: "text-[12px]",
                    style: fe,
                    children: [
                      "Nominations are closed for this election. They open again in ",
                      j0(e.end, e.skew),
                      ".",
                    ],
                  })
                : (0, R.jsxs)(R.Fragment, {
                    children: [
                      (0, R.jsx)("textarea", {
                        id: "run-statement",
                        className: "field min-h-[80px]",
                        maxLength: sc.statement,
                        placeholder: "Your promise to voters (what will you do as Mayor?)",
                        value: r,
                        onChange: (l) => o(l.target.value),
                      }),
                      s &&
                        (0, R.jsxs)("label", {
                          className: "text-[12px] flex items-center gap-1.5",
                          children: [
                            (0, R.jsx)("input", {
                              type: "checkbox",
                              checked: n,
                              onChange: (l) => i(l.target.checked),
                            }),
                            " Stand as an independent (not for ",
                            s.short,
                            ")",
                          ],
                        }),
                      (0, R.jsxs)("button", {
                        id: "run-go",
                        className: "btn btn-primary btn-sm",
                        disabled: r.trim().length < 20,
                        onClick: () => Tn({ t: "pol_nominate", statement: r, independent: n || !s }),
                        children: ["Submit nomination \xB7 ", q(Zs.nominate)],
                      }),
                    ],
                  })
              : (0, R.jsxs)("div", {
                  className: "text-[12px]",
                  children: [
                    (0, R.jsx)("button", {
                      className: "underline",
                      onClick: () => ai("vote"),
                      children: "Register your home city first",
                    }),
                    ".",
                  ],
                }),
        ],
      });
}
function aA() {
  let t = Y(),
    e = t.politics,
    a = t.polMe,
    [r, o] = (0, Yr.useState)(""),
    [n, i] = (0, Yr.useState)(""),
    [s, l] = (0, Yr.useState)(!1),
    c = (0, Yr.useMemo)(() => e.proposals || [], [e.proposals]);
  return (0, R.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, R.jsxs)("div", {
        className: "card p-3 space-y-2",
        children: [
          (0, R.jsxs)("div", {
            className: "flex items-center gap-2 text-sm",
            children: [
              (0, R.jsx)(Jv, { style: { color: "#b06ad9" } }),
              (0, R.jsx)("span", {
                className: "flex-1",
                children:
                  "Citizens' proposals: ask the country a yes/no question (which zone to build next, a new park, metro prices\u2026). Advisory, 3 days.",
              }),
              !s &&
                (0, R.jsx)("button", {
                  id: "prop-new",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => l(!0),
                  children: "New proposal",
                }),
            ],
          }),
          s &&
            (0, R.jsxs)(R.Fragment, {
              children: [
                a.canRun &&
                  (0, R.jsx)("div", {
                    className: "text-[12px]",
                    style: { color: "var(--ember-hi)" },
                    children: a.canRun,
                  }),
                (0, R.jsx)("input", {
                  id: "prop-title",
                  className: "field",
                  maxLength: sc.proposal,
                  placeholder: "Question, e.g. Should the next new zone be a snow mountain?",
                  value: r,
                  onChange: (d) => o(d.target.value),
                }),
                (0, R.jsx)("textarea", {
                  id: "prop-body",
                  className: "field min-h-[70px]",
                  maxLength: sc.proposalBody,
                  placeholder: "Why? (optional)",
                  value: n,
                  onChange: (d) => i(d.target.value),
                }),
                (0, R.jsxs)("div", {
                  className: "flex gap-2",
                  children: [
                    (0, R.jsxs)("button", {
                      id: "prop-go",
                      className: "btn btn-primary btn-sm",
                      disabled: !!a.canRun || r.trim().length < 10,
                      onClick: () => {
                        Tn({ t: "pol_propose", title: r, body: n }) && (l(!1), o(""), i(""));
                      },
                      children: ["Publish \xB7 ", q(Zs.proposal)],
                    }),
                    (0, R.jsx)("button", {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => l(!1),
                      children: "Cancel",
                    }),
                  ],
                }),
              ],
            }),
        ],
      }),
      c.length
        ? c.map((d) => {
            let h = d.yes + d.no,
              u = a.pvotes?.[d.id];
            return (0, R.jsxs)(
              "div",
              {
                className: "card p-3 space-y-1.5",
                "data-proposal": d.id,
                children: [
                  (0, R.jsx)("div", { className: "text-sm font-bold", children: d.title }),
                  d.body && (0, R.jsx)("div", { className: "text-[12px]", style: fe, children: d.body }),
                  (0, R.jsxs)("div", {
                    className: "h-2 rounded-full overflow-hidden flex",
                    style: { background: "rgba(255,255,255,.08)" },
                    children: [
                      (0, R.jsx)("div", {
                        style: { width: `${h ? (d.yes / h) * 100 : 0}%`, background: "#45e0ae" },
                      }),
                      (0, R.jsx)("div", {
                        style: { width: `${h ? (d.no / h) * 100 : 0}%`, background: "#e5484d" },
                      }),
                    ],
                  }),
                  (0, R.jsxs)("div", {
                    className: "flex items-center gap-2 text-[12px]",
                    children: [
                      (0, R.jsxs)("span", {
                        style: fe,
                        children: [
                          d.yes,
                          " yes \xB7 ",
                          d.no,
                          " no \xB7 by ",
                          d.by,
                          " \xB7 ",
                          d.closed
                            ? d.yes > d.no
                              ? "PASSED"
                              : "not passed"
                            : `closes in ${j0(d.ends, t.politics.skew)}`,
                        ],
                      }),
                      (0, R.jsx)("span", { className: "flex-1" }),
                      !d.closed &&
                        !u &&
                        !a.canVote &&
                        (0, R.jsxs)(R.Fragment, {
                          children: [
                            (0, R.jsx)("button", {
                              className: "btn btn-primary btn-xs",
                              "data-pvote-yes": d.id,
                              onClick: () => Tn({ t: "pol_pvote", id: d.id, yes: !0 }),
                              children: "Yes",
                            }),
                            (0, R.jsx)("button", {
                              className: "btn btn-ghost btn-xs",
                              "data-pvote-no": d.id,
                              onClick: () => Tn({ t: "pol_pvote", id: d.id, yes: !1 }),
                              children: "No",
                            }),
                          ],
                        }),
                      u && (0, R.jsxs)("span", { children: ["You voted ", u] }),
                    ],
                  }),
                ],
              },
              d.id,
            );
          })
        : (0, R.jsx)("div", { className: "text-sm", style: fe, children: "No proposals yet." }),
    ],
  });
}
function rA() {
  let e = Y().politics,
    a = e.office,
    r = Object.fromEntries(e.parties.map((n) => [n.id, n]));
  if (!a)
    return (0, R.jsxs)("div", {
      className: "card p-3 text-sm",
      style: fe,
      children: [
        "The first election is under way. Mayors and Members of Parliament take office when the polls close in ",
        j0(e.end, e.skew),
        ".",
      ],
    });
  let o = (n) => r[n || ""]?.name || a.names?.[n || ""] || (n ? "Party" : "Independent");
  return (0, R.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, R.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, R.jsxs)("div", {
            className: "text-xs font-bold mb-2",
            children: ["MAYORS \xB7 ELECTION ", a.n, " \xB7 turnout ", a.turnout],
          }),
          xd.map((n) => {
            let i = a.mayors[n.id];
            return (0, R.jsxs)(
              "div",
              {
                className: "flex items-center gap-2 text-sm py-1",
                "data-mayor": n.id,
                children: [
                  (0, R.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm", style: { background: n.color } }),
                  (0, R.jsx)("span", { className: "w-44 truncate", style: fe, children: n.name }),
                  (0, R.jsx)("b", { className: "flex-1 truncate", children: i ? i.name : "\u2014 no mayor" }),
                  i &&
                    (0, R.jsxs)("span", {
                      className: "text-[11px]",
                      style: fe,
                      children: [o(i.party), " \xB7 ", i.votes, " votes"],
                    }),
                ],
              },
              n.id,
            );
          }),
        ],
      }),
      (0, R.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, R.jsxs)("div", {
            className: "text-xs font-bold mb-2",
            children: ["PARLIAMENT OF FYRUS \xB7 ", e.seats, " SEATS"],
          }),
          (0, R.jsx)(z9, { seats: a.seats, parties: r, total: e.seats }),
          Object.entries(a.seats)
            .sort((n, i) => i[1] - n[1])
            .map(([n, i]) =>
              (0, R.jsxs)(
                "div",
                {
                  className: "text-sm py-1",
                  children: [
                    (0, R.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0, R.jsx)(fc, { p: r[n] || { symbol: "\u2022", color: "#555" }, size: 20 }),
                        (0, R.jsx)("b", { className: "flex-1", children: o(n) }),
                        (0, R.jsxs)("span", {
                          className: "tabular",
                          children: [i, " seats \xB7 ", a.partyVotes[n], " votes"],
                        }),
                      ],
                    }),
                    (0, R.jsxs)("div", {
                      className: "text-[11px] pl-7",
                      style: fe,
                      children: ["MPs: ", (a.mps?.[n] || []).map((s) => s.name).join(", ")],
                    }),
                  ],
                },
                n,
              ),
            ),
          !Object.keys(a.seats).length &&
            (0, R.jsx)("div", { className: "text-[12px]", style: fe, children: "No party votes were cast." }),
        ],
      }),
      e.history.length > 1 &&
        (0, R.jsxs)("div", {
          className: "card p-3 text-[12px]",
          children: [
            (0, R.jsx)("div", { className: "text-xs font-bold mb-1", children: "PAST ELECTIONS" }),
            e.history.map((n) =>
              (0, R.jsxs)(
                "div",
                {
                  style: fe,
                  children: [
                    "Election ",
                    n.n,
                    " \xB7 ",
                    new Date(n.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
                    " \xB7 turnout ",
                    n.turnout,
                    " \xB7 ",
                    Object.keys(n.seats).length,
                    " parties in Parliament",
                  ],
                },
                n.n,
              ),
            ),
          ],
        }),
    ],
  });
}
var Su = P(Zt(), 1);
var ee = P(ct(), 1),
  tl = { color: "var(--ink-dim)" },
  oA = [
    ["places", "Places", h0],
    ["jobs", "Shift jobs", hr],
    ["bag", "My bag", ko],
    ["mail", "Mailbox", ql],
    ["books", "Library", Xl],
  ];
function i5() {
  let t = Y(),
    e = t.jobsMe,
    [a, r] = (0, Su.useState)(t.svcFocus?.tab || "places");
  ((0, Su.useEffect)(() => {
    t.svcFocus?.tab && r(t.svcFocus.tab);
  }, [t.svcFocus?.tab]),
    (0, Su.useEffect)(() => {
      t.net.status === "online" && O.send({ t: "jobs_me" });
    }, [t.net.status]));
  let o = (i, s, l) => es({ x: i, z: s }, l),
    n = (i, s, l) => _t()?.startTaxi({ x: i, z: s, name: l });
  return (0, ee.jsxs)("div", {
    className: "space-y-3",
    "data-services": !0,
    children: [
      (0, ee.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, ee.jsx)("div", {
            className: "w-10 h-10 rounded-md grid place-items-center",
            style: { background: "#45e0ae", color: "#04120c" },
            children: (0, ee.jsx)(h0, {}),
          }),
          (0, ee.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, ee.jsx)("div", { className: "text-sm font-bold", children: "Everyday Fyrus" }),
              (0, ee.jsxs)("div", {
                className: "text-[12px]",
                style: tl,
                children: [
                  "Hospital, police, fire, post, library, shops, Food Street and places of worship. Work shifts to earn FYC.",
                  e ? ` Today: ${e.shifts}/${e.cap} shifts \xB7 ${q(e.earned)}.` : "",
                ],
              }),
            ],
          }),
        ],
      }),
      (0, ee.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: oA.map(([i, s, l]) =>
          (0, ee.jsxs)(
            "button",
            {
              "data-svc-tab": i,
              className: `chip ${a === i ? "chip-on" : ""}`,
              onClick: () => r(i),
              children: [
                (0, ee.jsx)(l, {}),
                " ",
                s,
                i === "mail" && e?.mail?.length ? ` (${e.mail.length})` : "",
              ],
            },
            i,
          ),
        ),
      }),
      a === "places" &&
        yh.map((i) =>
          (0, ee.jsxs)(
            "div",
            {
              className: "card p-3 space-y-1.5",
              "data-zone": i.id,
              children: [
                (0, ee.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0, ee.jsx)(da, { style: { color: "var(--accent)" } }),
                    (0, ee.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        (0, ee.jsx)("div", { className: "text-sm font-bold", children: i.name }),
                        (0, ee.jsx)("div", { className: "text-[11px]", style: tl, children: i.sub }),
                      ],
                    }),
                    (0, ee.jsxs)("button", {
                      className: "btn btn-ghost btn-xs",
                      onClick: () => n(i.x, i.z, i.name),
                      children: [(0, ee.jsx)(ci, {}), " Taxi"],
                    }),
                    (0, ee.jsx)("button", {
                      className: "btn btn-primary btn-xs",
                      "data-zone-go": i.id,
                      onClick: () => o(i.x, i.z, i.name),
                      children: "Teleport",
                    }),
                  ],
                }),
                (0, ee.jsx)("div", {
                  className: "flex flex-wrap gap-1",
                  children: Di.filter(
                    (s) =>
                      (i.id === "civic" && s.kind === "civic") ||
                      (i.id === "bazaar" && s.kind === "shop") ||
                      (i.id === "food" && s.kind === "stall") ||
                      (i.id === "faith" && s.kind === "faith"),
                  ).map((s) => {
                    let l = Ic(s, 4);
                    return (0, ee.jsxs)(
                      "button",
                      {
                        "data-place-go": s.id,
                        className: "chip",
                        onClick: () => o(l.x, l.z, s.name),
                        children: [
                          (0, ee.jsx)("span", {
                            className: "inline-block w-2 h-2 rounded-full mr-1",
                            style: { background: s.color },
                          }),
                          s.name,
                        ],
                      },
                      s.id,
                    );
                  }),
                }),
              ],
            },
            i.id,
          ),
        ),
      a === "jobs" &&
        (0, ee.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            (0, ee.jsxs)("div", {
              className: "text-[12px]",
              style: tl,
              children: [
                "Go to a place, start a shift at the desk, and do the tasks the marker shows. Up to ",
                e?.cap || 6,
                " shifts a day, a short break between shifts. Pay comes from the National Treasury.",
              ],
            }),
            Di.filter((i) => i.job)
              .sort((i, s) => s.job.pay - i.job.pay)
              .map((i) => {
                let s = Ic(i, 4);
                return (0, ee.jsxs)(
                  "div",
                  {
                    className: "card p-2.5 flex items-center gap-2 text-sm",
                    children: [
                      (0, ee.jsx)("span", {
                        className: "w-2.5 h-2.5 rounded-full",
                        style: { background: i.color },
                      }),
                      (0, ee.jsxs)("span", {
                        className: "flex-1 min-w-0",
                        children: [
                          (0, ee.jsx)("b", { children: i.job.title }),
                          " ",
                          (0, ee.jsxs)("span", { style: tl, children: ["\xB7 ", i.name] }),
                        ],
                      }),
                      (0, ee.jsx)("b", { className: "tabular", children: q(i.job.pay) }),
                      (0, ee.jsx)("button", {
                        className: "btn btn-ghost btn-xs",
                        "data-job-go": i.id,
                        onClick: () => o(s.x, s.z, i.name),
                        children: "Go",
                      }),
                    ],
                  },
                  i.id,
                );
              }),
          ],
        }),
      a === "bag" &&
        (0, ee.jsx)("div", {
          className: "space-y-1.5",
          "data-bag": !0,
          children:
            !e || !Object.keys(e.bag).length
              ? (0, ee.jsx)("div", {
                  className: "text-sm",
                  style: tl,
                  children: "Your bag is empty. Buy food on Food Street or gadgets in the Everyday Bazaar.",
                })
              : Object.entries(e.bag).map(([i, s]) => {
                  let l = Fi[i];
                  return l
                    ? (0, ee.jsxs)(
                        "div",
                        {
                          className: "card p-2.5 flex items-center gap-2 text-sm",
                          children: [
                            (0, ee.jsx)("span", { className: "text-lg", children: l.icon }),
                            (0, ee.jsxs)("span", {
                              className: "flex-1",
                              children: [
                                l.name,
                                " ",
                                (0, ee.jsxs)("span", { style: tl, children: ["\xD7 ", s] }),
                              ],
                            }),
                            l.kind === "food" &&
                              (0, ee.jsx)("button", {
                                className: "btn btn-primary btn-xs",
                                "data-eat": i,
                                onClick: () => DM(i),
                                children: "Eat",
                              }),
                          ],
                        },
                        i,
                      )
                    : null;
                }),
        }),
      a === "mail" &&
        (0, ee.jsx)("div", {
          className: "space-y-1.5",
          "data-mailbox": !0,
          children: e?.mail?.length
            ? e.mail.map((i, s) =>
                (0, ee.jsxs)(
                  "div",
                  {
                    className: "card p-3 text-sm",
                    children: [
                      (0, ee.jsxs)("div", {
                        className: "text-[11px]",
                        style: tl,
                        children: [
                          "From ",
                          (0, ee.jsx)("b", { children: i.fromName }),
                          " \xB7 ",
                          new Date(i.at).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          i.gift ? ` \xB7 \u{1F381} ${q(i.gift)}` : "",
                        ],
                      }),
                      (0, ee.jsx)("div", { className: "mt-1 whitespace-pre-wrap", children: i.text }),
                    ],
                  },
                  s,
                ),
              )
            : (0, ee.jsx)("div", {
                className: "text-sm",
                style: tl,
                children: "No postcards yet. Send one from the Post Office in the Civic Quarter.",
              }),
        }),
      a === "books" &&
        (0, ee.jsxs)("div", {
          className: "space-y-1.5",
          children: [
            kh.map((i) =>
              (0, ee.jsxs)(
                "div",
                {
                  className: "card p-3 text-sm",
                  children: [
                    (0, ee.jsxs)("div", {
                      className: "font-bold",
                      children: [
                        i.t,
                        " ",
                        (0, ee.jsxs)("span", {
                          className: "font-normal",
                          style: tl,
                          children: ["\xB7 ", i.a, ", ", i.y < 0 ? `${-i.y} BC` : i.y],
                        }),
                      ],
                    }),
                    (0, ee.jsx)("div", { className: "text-[12px] mt-0.5", children: i.s }),
                    (0, ee.jsx)("a", {
                      className: "text-[12px] underline",
                      href: `https://www.gutenberg.org/ebooks/${i.g}`,
                      target: "_blank",
                      rel: "noreferrer",
                      children: "Read free on Project Gutenberg",
                    }),
                  ],
                },
                i.t,
              ),
            ),
            (0, ee.jsx)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => q2("library"),
              children: "Library desk",
            }),
          ],
        }),
    ],
  });
}
var pf = P(Zt(), 1);
var Ot = P(ct(), 1),
  Hu = { color: "var(--ink-dim)" },
  nA = (t) => `${Math.ceil(t / 1e3)} s`,
  j9 = {
    checkup: [
      "Drink water through the day.",
      "Sleep 7\u20139 hours.",
      "Walk 30 minutes a day.",
      "For real health problems, see a real doctor or call your local emergency number.",
    ],
    firstaid: [
      "Small burn: cool it under running water for 20 minutes.",
      "Bleeding: press firmly with a clean cloth.",
      "Someone not breathing: call your local emergency number straight away.",
    ],
    safety: [
      "Fit smoke alarms and test them monthly.",
      "Plan two ways out of every room.",
      "Never use a lift during a fire.",
    ],
    report: [
      "Report a player from their profile or the chat (\u22EF \u2192 Report).",
      'Never share your password, bank or card details \u2014 not even with "staff".',
      "Real emergencies: call your local emergency number.",
    ],
    lost: ["Lost something in Fyrus? Items you buy are kept in your bag (Services \u2192 Bag)."],
  };
