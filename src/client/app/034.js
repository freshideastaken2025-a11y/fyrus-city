function jB({ id: t, back: e }) {
  let a = Y(),
    r = _i(t),
    o = a.estate?.plots[t],
    n = a.net.id,
    [i, s] = (0, $r.useState)("sale"),
    [l, c] = (0, $r.useState)(""),
    [d, h] = (0, $r.useState)("24"),
    [u, p] = (0, $r.useState)(""),
    [v, g] = (0, $r.useState)(o?.style ?? 0),
    [m, f] = (0, $r.useState)(o?.sign || "");
  if (!r)
    return (0, Q.jsx)("div", {
      children: (0, Q.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: e,
        children: [(0, Q.jsx)(Qr, {}), " Back"],
      }),
    });
  let y = Mh(r.soc),
    x = df(r, o, n),
    k = o?.owner === n,
    b = o?.rent?.tenant === n,
    w = y.passport && !Ki(),
    L = o?.auction?.top,
    E = L ? L + Math.max(1, Math.round(L * 0.05)) : o?.auction?.start;
  return (0, Q.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, Q.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: e,
        children: [(0, Q.jsx)(Qr, {}), " ", y.name],
      }),
      (0, Q.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, Q.jsxs)("div", {
            className: "flex items-start gap-2",
            children: [
              (0, Q.jsxs)("div", {
                className: "flex-1",
                children: [
                  (0, Q.jsxs)("div", {
                    className: "text-base font-bold font-mono",
                    children: ["Plot ", r.id],
                  }),
                  (0, Q.jsxs)("div", {
                    className: "text-[12px]",
                    style: _r,
                    children: [
                      y.name,
                      " \xB7 tier ",
                      y.tier,
                      " \xB7 ",
                      r.size + 2,
                      " x ",
                      r.size + 2,
                      " m",
                      r.seaFront ? " \xB7 sea-front" : "",
                    ],
                  }),
                ],
              }),
              (0, Q.jsx)("span", {
                className: "text-[12px] font-bold",
                style: { color: x.key === "resident" ? "var(--ink-dim)" : ic[x.key] || "#fff" },
                children: x.text,
              }),
            ],
          }),
          o?.rent?.tenant &&
            (0, Q.jsxs)("div", {
              className: "text-[12px] mt-1",
              style: _r,
              children: [
                "Rented to ",
                o.rent.tenantName,
                " \xB7 ",
                q(o.rent.price),
                "/month \xB7 paid until ",
                new Date(o.rent.paidUntil).toLocaleDateString("en-GB"),
                o.rent.ending ? " \xB7 lease ending" : "",
              ],
            }),
          w &&
            (0, Q.jsxs)("div", {
              className: "text-[12px] mt-1",
              style: { color: "var(--ember-hi)" },
              children: [
                (0, Q.jsx)(yr, { className: "inline" }),
                " ",
                y.name,
                " is for Fyrus passport holders. Earn your passport in the Republic tab.",
              ],
            }),
          (0, Q.jsxs)("div", {
            className: "flex gap-1.5 mt-2 flex-wrap",
            children: [
              (0, Q.jsxs)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => xa(S9(r)),
                children: [(0, Q.jsx)(dr, {}), " Walk there"],
              }),
              (0, Q.jsxs)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => _t()?.startTaxi({ ...S9(r), name: `Plot ${r.id}` }),
                children: [(0, Q.jsx)(ci, {}), " Taxi"],
              }),
            ],
          }),
        ],
      }),
      !k &&
        !o &&
        r.empty &&
        (0, Q.jsxs)("button", {
          id: "est-buy",
          className: "btn btn-primary btn-sm",
          disabled: w,
          onClick: () => O.send({ t: "est_buy", plot: r.id }),
          children: [(0, Q.jsx)(ho, {}), " Buy from the Land Office \xB7 ", q(r.price)],
        }),
      !k &&
        o?.sale &&
        (0, Q.jsxs)("button", {
          id: "est-buy",
          className: "btn btn-primary btn-sm",
          disabled: w,
          onClick: () => O.send({ t: "est_buy", plot: r.id }),
          children: [
            (0, Q.jsx)(ho, {}),
            " Buy from ",
            o.ownerName,
            " \xB7 ",
            q(o.sale),
            Ki() ? "" : " + 5% tax",
          ],
        }),
      !k &&
        o?.auction &&
        (0, Q.jsxs)("div", {
          className: "card p-3 space-y-1.5",
          children: [
            (0, Q.jsxs)("div", {
              className: "text-[12px]",
              children: [
                (0, Q.jsx)(Zl, { className: "inline" }),
                " ",
                o.auction.bids,
                " bids \xB7 top ",
                L ? `${q(L)} by ${o.auction.topName}` : "none yet",
                " \xB7 ends in ",
                H9(o.auction.endsAt),
                o.auction.reserve ? " \xB7 has a reserve" : "",
              ],
            }),
            (0, Q.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, Q.jsx)("input", {
                  className: "field py-1 text-sm",
                  type: "number",
                  value: u,
                  onChange: (T) => p(T.target.value),
                  placeholder: `${E} or more`,
                  "aria-label": "Your bid",
                }),
                (0, Q.jsxs)("button", {
                  id: "est-bid",
                  className: "btn btn-primary btn-sm",
                  disabled: w,
                  onClick: () => O.send({ t: "est_bid", plot: r.id, amount: +u || E }),
                  children: [(0, Q.jsx)(Zl, {}), " Bid"],
                }),
              ],
            }),
            (0, Q.jsx)("div", {
              className: "text-[11px]",
              style: _r,
              children: "Your bid waits in Central Bank escrow and comes back if you are outbid.",
            }),
          ],
        }),
      !k &&
        o?.rent &&
        !o.rent.tenant &&
        (0, Q.jsxs)("button", {
          id: "est-rent",
          className: "btn btn-primary btn-sm",
          disabled: w,
          onClick: () => O.send({ t: "est_rent", plot: r.id }),
          children: [(0, Q.jsx)(ho, {}), " Rent \xB7 ", q(o.rent.price), " per month (paid automatically)"],
        }),
      b &&
        !o.rent.ending &&
        (0, Q.jsx)("button", {
          className: "btn btn-ghost btn-sm",
          onClick: () => O.send({ t: "est_endlease", plot: r.id }),
          children: "End my lease at the end of this month",
        }),
      ((k && !o?.rent?.tenant) || b) &&
        (0, Q.jsxs)("div", {
          className: "flex gap-1.5 flex-wrap",
          children: [
            (0, Q.jsxs)("button", {
              id: "est-home-in",
              className: "btn btn-primary btn-sm",
              onClick: () => Jn(r.id),
              children: [(0, Q.jsx)(ho, {}), " Go inside"],
            }),
            (0, Q.jsx)("button", {
              id: "est-home-manage",
              className: "btn btn-ghost btn-sm",
              onClick: () => Vl(r.id),
              children: "Lock, keys & paint",
            }),
          ],
        }),
      k &&
        (0, Q.jsxs)("div", {
          className: "card p-3 space-y-2",
          id: "est-manage",
          children: [
            (0, Q.jsx)("div", { className: "text-sm font-bold", children: "Manage your plot" }),
            (0, Q.jsx)("div", {
              className: "flex gap-1",
              children: [
                ["sale", "Sell"],
                ["auction", "Auction"],
                ["rent", "Rent out"],
              ].map(([T, S]) =>
                (0, Q.jsx)(
                  "button",
                  { className: `chip ${i === T ? "chip-on" : ""}`, onClick: () => s(T), children: S },
                  T,
                ),
              ),
            }),
            (0, Q.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, Q.jsx)("input", {
                  className: "field py-1 text-sm",
                  type: "number",
                  value: l,
                  onChange: (T) => c(T.target.value),
                  placeholder:
                    i === "rent"
                      ? "Rent per month (FYC)"
                      : i === "auction"
                        ? "Starting bid (FYC)"
                        : "Price (FYC)",
                  "aria-label": "Plot price",
                }),
                i === "auction" &&
                  (0, Q.jsx)("input", {
                    className: "field py-1 text-sm w-24",
                    type: "number",
                    value: d,
                    onChange: (T) => h(T.target.value),
                    "aria-label": "Hours",
                    title: "Hours",
                  }),
                (0, Q.jsx)("button", {
                  id: "est-list",
                  className: "btn btn-primary btn-sm",
                  onClick: () => O.send({ t: "est_list", plot: r.id, mode: i, price: +l, hours: +d }),
                  children: "Publish",
                }),
              ],
            }),
            (o.sale || o.auction || (o.rent && !o.rent.tenant)) &&
              (0, Q.jsx)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => O.send({ t: "est_list", plot: r.id, mode: "none" }),
                children: "Take it off the market",
              }),
            o.rent?.tenant &&
              !o.rent.ending &&
              (0, Q.jsx)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => O.send({ t: "est_endlease", plot: r.id }),
                children: "End the lease at the end of this month",
              }),
            (0, Q.jsxs)("div", {
              className: "text-[12px] font-bold pt-1",
              children: [(0, Q.jsx)(ld, { className: "inline" }), " Build"],
            }),
            (0, Q.jsx)("div", {
              className: "flex gap-1 flex-wrap",
              children: BB.map((T, S) =>
                (0, Q.jsx)(
                  "button",
                  { className: `chip ${v === S ? "chip-on" : ""}`, onClick: () => g(S), children: T },
                  T,
                ),
              ),
            }),
            (0, Q.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, Q.jsx)("input", {
                  className: "field py-1 text-sm",
                  value: m,
                  onChange: (T) => f(T.target.value),
                  placeholder: "Name on the gate (optional)",
                  maxLength: 24,
                }),
                (0, Q.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => O.send({ t: "est_build", plot: r.id, style: v, sign: m }),
                  children: "Save",
                }),
              ],
            }),
            (0, Q.jsx)("div", {
              className: "text-[11px]",
              style: _r,
              children:
                "Sales pay a 5% land transfer tax to the treasury (none for passport holders). Rent is collected from the tenant every month and paid straight to you.",
            }),
          ],
        }),
    ],
  });
}
function WB({ open: t }) {
  let a = Y().estateMine;
  if (!a) return (0, Q.jsx)("div", { className: "text-sm", style: _r, children: "Loading\u2026" });
  let r = a.owned.filter((n) => n.rent?.tenant).reduce((n, i) => n + i.rent.price, 0),
    o = a.renting.reduce((n, i) => n + i.rent.price, 0);
  return (0, Q.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, Q.jsx)("div", {
        className: "grid grid-cols-3 gap-2 text-center",
        children: [
          ["Plots owned", String(a.owned.length)],
          ["Rent coming in", `${q(r)}/mo`],
          ["Rent you pay", `${q(o)}/mo`],
        ].map(([n, i]) =>
          (0, Q.jsxs)(
            "div",
            {
              className: "card p-2",
              children: [
                (0, Q.jsx)("div", { className: "font-bold tabular text-sm", children: i }),
                (0, Q.jsx)("div", { className: "text-[10px]", style: _r, children: n }),
              ],
            },
            n,
          ),
        ),
      }),
      a.studio &&
        (0, Q.jsxs)("div", {
          className: "text-[13px] flex items-center gap-2 flex-wrap",
          children: [
            (0, Q.jsxs)("span", {
              children: [
                (0, Q.jsx)(ho, { className: "inline" }),
                " Free studio ",
                (0, Q.jsx)("b", { children: a.studio }),
                " in Starter Commons",
              ],
            }),
            (0, Q.jsx)("button", {
              id: "est-studio-in",
              className: "btn btn-ghost btn-xs",
              onClick: () => Jn("studio:" + a.studio),
              children: "Go inside",
            }),
            (0, Q.jsx)("button", {
              className: "btn btn-ghost btn-xs",
              onClick: () => Vl("studio:" + a.studio),
              children: "Lock & keys",
            }),
          ],
        }),
      [
        ["OWNED", a.owned],
        ["RENTING", a.renting],
      ].map(([n, i]) =>
        (0, Q.jsxs)(
          "div",
          {
            children: [
              (0, Q.jsxs)("div", {
                className: "text-[11px] font-bold tracking-wide mb-1",
                style: _r,
                children: [n, " (", i.length, ")"],
              }),
              i.length === 0
                ? (0, Q.jsx)("div", { className: "text-[12px]", style: _r, children: "Nothing yet." })
                : i.map((s) => {
                    let l = _i(s.id);
                    return (0, Q.jsxs)(
                      "button",
                      {
                        className:
                          "w-full text-left rounded-md px-2.5 py-1.5 mb-1 flex gap-2 text-[13px] card-hover",
                        style: { border: "1px solid var(--line)" },
                        onClick: () => t(s.id),
                        children: [
                          (0, Q.jsx)("b", { className: "font-mono", children: s.id }),
                          (0, Q.jsx)("span", { style: _r, children: Mh(l.soc)?.name }),
                          (0, Q.jsx)("span", {
                            className: "flex-1 text-right",
                            style: _r,
                            children: s.rent?.tenant
                              ? `rented ${q(s.rent.price)}/mo`
                              : s.sale
                                ? `for sale ${q(s.sale)}`
                                : s.auction
                                  ? "at auction"
                                  : "",
                          }),
                        ],
                      },
                      s.id,
                    );
                  }),
            ],
          },
          n,
        ),
      ),
    ],
  });
}
function IB() {
  let t = Y(),
    [e, a] = (0, $r.useState)("+2040-"),
    r = Ip(),
    o = t.estateMine;
  return (0, Q.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, Q.jsx)("div", {
        className: "text-[12px]",
        style: _r,
        children:
          "Royal Sky Society has AI security at the gate. Passport holders, Royal Sky owners and tenants enter freely and can invite a guest for 24 hours.",
      }),
      (0, Q.jsxs)("div", {
        className: "text-[13px]",
        children: [
          "Your access: ",
          (0, Q.jsx)("b", {
            style: { color: r ? "#45e0ae" : "var(--rose)" },
            children: r ? "allowed" : "not allowed",
          }),
        ],
      }),
      (o?.passes || []).map((n, i) =>
        (0, Q.jsxs)(
          "div",
          {
            className: "text-[12px]",
            children: [
              (0, Q.jsx)(Kh, { className: "inline" }),
              " Guest pass from ",
              n.byName,
              " \xB7 valid ",
              H9(n.until),
            ],
          },
          i,
        ),
      ),
      r &&
        (0, Q.jsxs)("div", {
          className: "flex gap-1.5",
          children: [
            (0, Q.jsx)("input", {
              className: "field py-1.5 text-sm font-mono",
              value: e,
              onChange: (n) => a(n.target.value),
              "aria-label": "Guest number",
            }),
            (0, Q.jsxs)("button", {
              id: "est-pass",
              className: "btn btn-primary btn-sm",
              onClick: () => O.send({ t: "est_pass", number: e }),
              children: [(0, Q.jsx)(Kh, {}), " Invite guest"],
            }),
          ],
        }),
    ],
  });
}
var ln = P(Zt(), 1);
var bt = P(ct(), 1),
  Wn = { color: "var(--ink-dim)" },
  hf = (t) => {
    let e = Math.max(1, Math.round((Date.now() - t) / 1e3));
    return e < 60
      ? `${e}s ago`
      : e < 3600
        ? `${Math.round(e / 60)}m ago`
        : e < 86400
          ? `${Math.round(e / 3600)}h ago`
          : `${Math.round(e / 86400)}d ago`;
  };
function qy() {
  let t = Y(),
    e = t.net.status === "online",
    [a, r] = (0, ln.useState)("tv");
  if (
    ((0, ln.useEffect)(() => {
      e && O.send({ t: "news_state" });
    }, [e]),
    (0, ln.useEffect)(() => {
      t.newsFocus &&
        (t.newsFocus.tab &&
          ["tv", "fyrus", "world", "report"].includes(t.newsFocus.tab) &&
          r(t.newsFocus.tab),
        C({ newsFocus: null }));
    }, [t.newsFocus]),
    !e)
  )
    return (0, bt.jsxs)("div", {
      className: "card p-4 text-sm",
      children: [
        (0, bt.jsx)("b", { children: "Fyrus News runs on the live city at fyrus.io." }),
        (0, bt.jsx)("div", {
          className: "mt-1",
          style: Wn,
          children:
            "National news is written from real events on the server, and world headlines come from public news feeds. Connecting\u2026",
        }),
      ],
    });
  let o = t.news;
  return (0, bt.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, bt.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, bt.jsx)("div", {
            className: "w-10 h-10 rounded-md grid place-items-center text-white font-extrabold",
            style: { background: "#e5484d" },
            children: (0, bt.jsx)(ou, {}),
          }),
          (0, bt.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, bt.jsx)("div", {
                className: "text-[10px] font-bold tracking-[.25em]",
                style: { color: "#e5484d" },
                children: "FYRUS NEWS \xB7 24/7",
              }),
              (0, bt.jsx)("div", {
                className: "text-sm font-bold",
                children: "National news from real city events, world headlines and citizen reports",
              }),
            ],
          }),
          (0, bt.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => xa(to("newstv")),
            children: [(0, bt.jsx)(dr, {}), " TV HQ"],
          }),
        ],
      }),
      (0, bt.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          ["tv", "Watch TV", ou],
          ["fyrus", "Fyrus", r0],
          ["world", "World", s0],
          ["report", "Citizen report", tx],
        ].map(([n, i, s]) =>
          (0, bt.jsxs)(
            "button",
            {
              "data-news-tab": n,
              className: `chip ${a === n ? "chip-on" : ""}`,
              onClick: () => r(n),
              children: [(0, bt.jsx)(s, { className: "inline" }), " ", i],
            },
            n,
          ),
        ),
      }),
      o
        ? (0, bt.jsxs)(bt.Fragment, {
            children: [
              a === "tv" && (0, bt.jsx)(VB, {}),
              a === "fyrus" && (0, bt.jsx)(PB, {}),
              a === "world" && (0, bt.jsx)(OB, {}),
              a === "report" && (0, bt.jsx)(DB, { done: () => r("fyrus") }),
            ],
          })
        : (0, bt.jsx)("div", { className: "card p-4 text-sm", style: Wn, children: "Tuning in\u2026" }),
    ],
  });
}
function GB() {
  let e = Y().news;
  return (0, ln.useMemo)(() => {
    let a = (e?.fyrus || [])
        .slice(0, 20)
        .map((n) => ({
          cat: n.cat,
          label: Mn[n.cat]?.label || "Fyrus",
          color: Mn[n.cat]?.color || "#ffc27a",
          title: n.title,
          body: n.body,
          src: n.kind === "citizen" ? `Citizen report \xB7 ${n.byName}` : "Fyrus News desk",
          at: n.at,
        })),
      r = (e?.world || [])
        .slice(0, 15)
        .map((n) => ({
          cat: "world",
          label: "World",
          color: "#a8d8ff",
          title: n.title,
          src: n.source,
          at: n.at,
          link: n.link,
        })),
      o = [];
    for (let n = 0; n < Math.max(a.length, r.length); n++) (a[n] && o.push(a[n]), r[n] && o.push(r[n]));
    return o;
  }, [e]);
}
function VB() {
  let t = GB(),
    [e, a] = (0, ln.useState)(0),
    [r, o] = (0, ln.useState)(!1),
    n = typeof window < "u" && "speechSynthesis" in window,
    i = t.length ? t[e % t.length] : null;
  return (
    (0, ln.useEffect)(() => {
      let s = setInterval(() => a((l) => l + 1), r ? 14e3 : 8e3);
      return () => clearInterval(s);
    }, [r, t.length]),
    (0, ln.useEffect)(() => {
      if (!(!r || !i || !n))
        try {
          speechSynthesis.cancel();
          let s = new SpeechSynthesisUtterance(`${i.label}. ${i.title}`);
          ((s.lang = "en-US"), (s.rate = 1), speechSynthesis.speak(s));
        } catch {}
    }, [r, i?.title]),
    (0, ln.useEffect)(
      () => () => {
        try {
          n && speechSynthesis.cancel();
        } catch {}
      },
      [],
    ),
    (0, bt.jsxs)("div", {
      className: "space-y-2",
      children: [
        (0, bt.jsxs)("div", {
          className: "rounded-lg overflow-hidden relative aspect-video",
          style: { background: "linear-gradient(135deg,#0b1730,#13284f)", border: "1px solid var(--line)" },
          "aria-live": "polite",
          children: [
            (0, bt.jsxs)("div", {
              className:
                "absolute top-0 inset-x-0 h-9 flex items-center px-3 gap-2 text-white text-sm font-extrabold",
              style: { background: "#e5484d" },
              children: [
                "FYRUS NEWS",
                (0, bt.jsx)("span", { className: "ml-auto text-[11px] font-bold", children: "\u25CF LIVE" }),
              ],
            }),
            i
              ? (0, bt.jsxs)("div", {
                  className: "absolute inset-0 pt-12 px-5 pb-10 flex flex-col",
                  children: [
                    (0, bt.jsx)("div", {
                      className: "text-[11px] font-extrabold tracking-[.2em]",
                      style: { color: i.color },
                      children: i.label.toUpperCase(),
                    }),
                    (0, bt.jsx)("div", {
                      className:
                        "font-display text-xl md:text-2xl font-extrabold text-white mt-1 leading-tight",
                      children: i.title,
                    }),
                    i.body &&
                      (0, bt.jsx)("div", {
                        className: "text-xs mt-2 line-clamp-3",
                        style: { color: "rgba(255,255,255,.8)" },
                        children: i.body,
                      }),
                    (0, bt.jsxs)("div", {
                      className: "mt-auto text-[11px]",
                      style: { color: "rgba(255,255,255,.7)" },
                      children: [
                        i.src,
                        " \xB7 ",
                        hf(i.at),
                        i.link &&
                          (0, bt.jsxs)(bt.Fragment, {
                            children: [
                              " \xB7 ",
                              (0, bt.jsx)("a", {
                                className: "underline",
                                href: i.link,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: "read at the source",
                              }),
                            ],
                          }),
                      ],
                    }),
                  ],
                })
              : (0, bt.jsx)("div", {
                  className:
                    "absolute inset-0 grid place-items-center text-white/80 text-sm px-6 text-center",
                  children: "On air. Stories appear as things happen in Fyrus.",
                }),
            (0, bt.jsx)("div", {
              className:
                "absolute bottom-0 inset-x-0 h-7 overflow-hidden text-[11px] text-white flex items-center",
              style: { background: "#10151d" },
              children: (0, bt.jsx)("div", {
                className: "whitespace-nowrap ticker-run px-2",
                children: t
                  .slice(0, 12)
                  .map((s, l) =>
                    (0, bt.jsxs)(
                      "span",
                      {
                        className: "mr-6",
                        children: [
                          (0, bt.jsxs)("b", {
                            style: { color: s.color },
                            children: ["\u25A0 ", s.label.toUpperCase()],
                          }),
                          " ",
                          s.title,
                        ],
                      },
                      l,
                    ),
                  ),
              }),
            }),
          ],
        }),
        (0, bt.jsxs)("div", {
          className: "flex gap-2 items-center",
          children: [
            (0, bt.jsx)("button", {
              className: "btn btn-ghost btn-sm",
              "aria-label": "Previous story",
              onClick: () => a((s) => (s - 1 + Math.max(1, t.length)) % Math.max(1, t.length)),
              children: (0, bt.jsx)(hE, {}),
            }),
            (0, bt.jsx)("button", {
              className: "btn btn-ghost btn-sm",
              "aria-label": "Next story",
              onClick: () => a((s) => s + 1),
              children: (0, bt.jsx)(dE, {}),
            }),
            n &&
              (0, bt.jsxs)("button", {
                id: "news-voice",
                className: `btn btn-sm ${r ? "btn-primary" : "btn-ghost"}`,
                onClick: () => o((s) => !s),
                children: [
                  r ? (0, bt.jsx)(tg, {}) : (0, bt.jsx)(sd, {}),
                  " ",
                  r ? "Anchor voice on" : "Read aloud",
                ],
              }),
            (0, bt.jsxs)("span", {
              className: "text-[11px] ml-auto",
              style: Wn,
              children: [t.length, " stories on rotation"],
            }),
          ],
        }),
      ],
    })
  );
}
function PB() {
  let t = Y(),
    [e, a] = (0, ln.useState)("all"),
    r = (t.news?.fyrus || []).filter((n) => e === "all" || n.cat === e),
    o = ["all", ...Object.keys(Mn)];
  return (0, bt.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, bt.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: o.map((n) =>
          (0, bt.jsx)(
            "button",
            {
              className: `chip ${e === n ? "chip-on" : ""}`,
              onClick: () => a(n),
              children: n === "all" ? "All" : Mn[n].label,
            },
            n,
          ),
        ),
      }),
      !r.length &&
        (0, bt.jsx)("div", {
          className: "card p-4 text-sm",
          style: Wn,
          children:
            "No stories here yet. They are written automatically when things happen: sales, auctions, new courses, events, court rulings.",
        }),
      r.map((n) => {
        let i = Mn[n.cat] || Mn.nation,
          s = n.byName && t.users.find((l) => l.id === t.session?.userId)?.name === n.byName;
        return (0, bt.jsxs)(
          "div",
          {
            className: "card p-3",
            "data-news-item": n.kind,
            children: [
              (0, bt.jsxs)("div", {
                className: "flex items-center gap-2 text-[10px] font-bold tracking-[.15em]",
                children: [
                  (0, bt.jsx)("span", { style: { color: i.color }, children: i.label.toUpperCase() }),
                  (0, bt.jsxs)("span", { style: Wn, children: ["\xB7 ", hf(n.at)] }),
                  n.kind === "citizen" &&
                    (0, bt.jsx)("span", {
                      className: "ml-auto px-1.5 py-0.5 rounded",
                      style: { background: "rgba(168,216,255,.12)", color: "#a8d8ff" },
                      children: "CITIZEN REPORT \xB7 NOT VERIFIED",
                    }),
                ],
              }),
              (0, bt.jsx)("div", { className: "text-sm font-bold mt-1", children: n.title }),
              n.body &&
                (0, bt.jsx)("div", {
                  className: "text-xs mt-1 whitespace-pre-wrap",
                  style: Wn,
                  children: n.body,
                }),
              n.kind === "citizen" &&
                (0, bt.jsxs)("div", {
                  className: "flex items-center gap-2 mt-2 text-[11px]",
                  style: Wn,
                  children: [
                    "By ",
                    n.byName,
                    !s &&
                      (0, bt.jsxs)("button", {
                        className: "btn btn-ghost btn-xs ml-auto",
                        onClick: () => O.send({ t: "news_flag", id: n.id }),
                        children: [(0, bt.jsx)(Fs, {}), " Flag"],
                      }),
                    s &&
                      (0, bt.jsxs)("button", {
                        className: "btn btn-ghost btn-xs ml-auto",
                        onClick: () => O.send({ t: "news_remove", id: n.id }),
                        children: [(0, bt.jsx)(_l, {}), " Remove"],
                      }),
                  ],
                }),
            ],
          },
          n.id,
        );
      }),
    ],
  });
}
function OB() {
  let e = Y().news;
  return (0, bt.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, bt.jsxs)("div", {
        className: "text-[11px]",
        style: Wn,
        children: [
          "Real headlines from ",
          e.sources.length ? e.sources.join(", ") : "public news feeds",
          e.worldAt ? ` \xB7 updated ${hf(e.worldAt)}` : "",
          ". Fyrus shows the headline and links to the publisher; it never rewrites or invents world news.",
        ],
      }),
      !e.world.length &&
        (0, bt.jsxs)("div", {
          className: "card p-4 text-sm",
          style: Wn,
          children: [
            e.sources.length
              ? "Fetching world headlines\u2026"
              : "World headlines are switched off on this server.",
            e.worldErr ? ` (${e.worldErr})` : "",
          ],
        }),
      e.world.map((a) =>
        (0, bt.jsxs)(
          "a",
          {
            href: a.link,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "card p-3 flex gap-3 items-start card-hover",
            "data-world-item": !0,
            children: [
              (0, bt.jsxs)("div", {
                className: "flex-1 min-w-0",
                children: [
                  (0, bt.jsxs)("div", {
                    className: "text-[10px] font-bold tracking-[.15em]",
                    style: { color: "#a8d8ff" },
                    children: [
                      a.source.toUpperCase(),
                      " ",
                      (0, bt.jsxs)("span", { style: Wn, children: ["\xB7 ", hf(a.at)] }),
                    ],
                  }),
                  (0, bt.jsx)("div", { className: "text-sm font-bold mt-0.5", children: a.title }),
                ],
              }),
              (0, bt.jsx)(fg, { className: "shrink-0 mt-1", style: Wn }),
            ],
          },
          a.link,
        ),
      ),
    ],
  });
}
function DB({ done: t }) {
  let [e, a] = (0, ln.useState)({ title: "", body: "" });
  return Ki()
    ? (0, bt.jsxs)("form", {
        className: "card p-4 space-y-3",
        onSubmit: (r) => {
          (r.preventDefault(),
            O.send({ t: "news_submit", title: e.title, body: e.body }),
            a({ title: "", body: "" }),
            t());
        },
        children: [
          (0, bt.jsx)("div", {
            className: "text-sm font-bold",
            children: "Report what is happening in Fyrus",
          }),
          (0, bt.jsxs)("div", {
            children: [
              (0, bt.jsx)("label", { className: "label", htmlFor: "news-title", children: "Headline" }),
              (0, bt.jsx)("input", {
                id: "news-title",
                className: "field",
                maxLength: 120,
                value: e.title,
                onChange: (r) => a({ ...e, title: r.target.value }),
                placeholder: "Marina Bay boardwalk packed for the sunset cruise",
              }),
            ],
          }),
          (0, bt.jsxs)("div", {
            children: [
              (0, bt.jsx)("label", { className: "label", htmlFor: "news-body", children: "Story" }),
              (0, bt.jsx)("textarea", {
                id: "news-body",
                className: "field",
                rows: 5,
                maxLength: 1200,
                value: e.body,
                onChange: (r) => a({ ...e, body: r.target.value }),
                placeholder: "What happened, where, when. Stick to what you saw.",
              }),
            ],
          }),
          (0, bt.jsxs)("ul", {
            className: "text-[11px] list-disc pl-4 space-y-0.5",
            style: Wn,
            children: [
              (0, bt.jsx)("li", {
                children:
                  "Only things that happened in Fyrus. Your name is shown and the story is labelled as a citizen report.",
              }),
              (0, bt.jsx)("li", {
                children: "No ads, no outside contacts or payments, no hate. Sentinel screens every report.",
              }),
              (0, bt.jsx)("li", {
                children: "3 reports a day. Three flags from citizens take a report off air.",
              }),
            ],
          }),
          (0, bt.jsxs)("button", {
            className: "btn btn-primary w-full",
            disabled: e.title.trim().length < 10 || e.body.trim().length < 40,
            children: [(0, bt.jsx)(tx, {}), " Publish on Fyrus News"],
          }),
        ],
      })
    : (0, bt.jsxs)("div", {
        className: "card p-4 text-sm",
        children: [
          (0, bt.jsx)("b", { children: "Citizen reports are for Fyrus passport holders." }),
          (0, bt.jsx)("div", {
            className: "mt-1",
            style: Wn,
            children:
              "Earn your passport in Republic \u2192 Visa & Passport, then report what you see in the city.",
          }),
        ],
      });
}
var Ld = P(Zt(), 1);
var yt = P(ct(), 1),
  gi = { color: "var(--ink-dim)" },
  Ky = { conference: rn, lounge: Jh, gaming: on },
  N9 = (t) =>
    new Date(t).toLocaleString(void 0, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
  FB = (t) => t.start <= Date.now() && t.end > Date.now(),
  UB = (t) => new Date(t - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16),
  R9 = (t) => xa(to(t.site));
function Xy() {
  let t = Y(),
    e = t.net.status === "online",
    [a, r] = (0, Ld.useState)("upcoming"),
    [o, n] = (0, Ld.useState)("grand");
  return (
    (0, Ld.useEffect)(() => {
      e && O.send({ t: "hall_list" });
    }, [e]),
    (0, Ld.useEffect)(() => {
      if (t.eventsFocus) {
        let i = t.eventsFocus;
        ((i.tab === "book" || i.tab === "mine" || i.tab === "upcoming") && r(i.tab),
          i.hall && n(i.hall),
          C({ eventsFocus: null }));
      }
    }, [t.eventsFocus]),
    (0, yt.jsxs)("div", {
      className: "space-y-3",
      children: [
        (0, yt.jsxs)("div", {
          className: "card p-3",
          children: [
            (0, yt.jsx)("div", {
              className: "text-[10px] font-bold tracking-[.25em]",
              style: { color: "var(--ember-hi)" },
              children: "CONFERENCE HALLS \xB7 LOUNGES \xB7 GAMING ARENA",
            }),
            (0, yt.jsx)("div", {
              className: "text-sm font-bold mt-0.5",
              children: "Walk in any time, or book a hall and host your own event",
            }),
            (0, yt.jsxs)("div", {
              className: "text-[11px] mt-1 flex items-center gap-1.5",
              style: gi,
              children: [
                (0, yt.jsx)(yr, {}),
                " Ticket money waits in Central Bank escrow and goes to the host after the event (90%). Cancelled events are refunded.",
              ],
            }),
          ],
        }),
        (0, yt.jsx)("div", {
          className: "flex gap-1 flex-wrap",
          children: [
            ["upcoming", "Upcoming"],
            ["book", "Halls & booking"],
            ["mine", "My events & tickets"],
          ].map(([i, s]) =>
            (0, yt.jsx)(
              "button",
              {
                "data-ev-tab": i,
                className: `chip ${a === i ? "chip-on" : ""}`,
                onClick: () => r(i),
                children: s,
              },
              i,
            ),
          ),
        }),
        a === "upcoming" && (0, yt.jsx)($B, { live: e }),
        a === "book" && (0, yt.jsx)(_B, { live: e, hall: o, setHall: n, done: () => r("mine") }),
        a === "mine" && (0, yt.jsx)(YB, { live: e }),
      ],
    })
  );
}
function Zy({ e: t, me: e }) {
  let a = Ui(t.hall),
    r = Ky[a?.kind || "conference"],
    o = t.host === e,
    n = FB(t);
  return (0, yt.jsxs)("div", {
    className: "card p-3",
    "data-event": t.id,
    children: [
      (0, yt.jsxs)("div", {
        className: "flex items-center gap-2 text-[10px] font-bold tracking-[.12em]",
        children: [
          (0, yt.jsx)(r, { style: { color: a?.color } }),
          (0, yt.jsx)("span", { style: { color: a?.color }, children: a?.name.toUpperCase() }),
          n &&
            (0, yt.jsx)("span", {
              className: "ml-auto px-1.5 py-0.5 rounded text-white",
              style: { background: "#e5484d" },
              children: "LIVE NOW",
            }),
        ],
      }),
      (0, yt.jsx)("div", { className: "text-sm font-bold mt-1", children: t.title }),
      t.desc && (0, yt.jsx)("div", { className: "text-xs mt-0.5", style: gi, children: t.desc }),
      (0, yt.jsxs)("div", {
        className: "text-[11px] mt-1 flex flex-wrap gap-x-3",
        style: gi,
        children: [
          (0, yt.jsxs)("span", {
            children: [
              (0, yt.jsx)(kg, { className: "inline" }),
              " ",
              N9(t.start),
              " \u2013 ",
              new Date(t.end).toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" }),
            ],
          }),
          (0, yt.jsxs)("span", { children: ["Host: ", t.hostName] }),
          (0, yt.jsxs)("span", {
            children: [(0, yt.jsx)($e, { className: "inline" }), " ", t.going, "/", t.cap],
          }),
          (0, yt.jsx)("span", { children: t.price ? q(t.price) : "Free" }),
        ],
      }),
      (0, yt.jsxs)("div", {
        className: "flex gap-1.5 mt-2 flex-wrap",
        children: [
          o
            ? (0, yt.jsxs)(yt.Fragment, {
                children: [
                  (0, yt.jsx)("span", {
                    className: "text-[11px] font-bold",
                    style: { color: "#45e0ae" },
                    children: "You host this",
                  }),
                  (0, yt.jsxs)("button", {
                    className: "btn btn-ghost btn-xs",
                    onClick: () => O.send({ t: "hall_cancel", event: t.id }),
                    children: [(0, yt.jsx)(pe, {}), " Cancel event"],
                  }),
                ],
              })
            : t.mine
              ? (0, yt.jsxs)(yt.Fragment, {
                  children: [
                    (0, yt.jsxs)("span", {
                      className: "text-[11px] font-bold",
                      style: { color: "#45e0ae" },
                      children: [
                        (0, yt.jsx)(Kh, { className: "inline" }),
                        " ",
                        t.price ? "Ticket bought" : "On the guest list",
                      ],
                    }),
                    !n &&
                      (0, yt.jsxs)("button", {
                        className: "btn btn-ghost btn-xs",
                        onClick: () => O.send({ t: "hall_leave", event: t.id }),
                        children: ["Give back", t.price ? " (refund)" : ""],
                      }),
                  ],
                })
              : (0, yt.jsxs)("button", {
                  "data-ticket": t.id,
                  className: "btn btn-primary btn-xs",
                  disabled: t.going >= t.cap,
                  onClick: () => O.send({ t: "hall_ticket", event: t.id }),
                  children: [
                    (0, yt.jsx)(Kh, {}),
                    " ",
                    t.going >= t.cap ? "Sold out" : t.price ? `Ticket \xB7 ${q(t.price)}` : "RSVP free",
                  ],
                }),
          n &&
            (0, yt.jsxs)("button", {
              className: "btn btn-primary btn-xs",
              onClick: () => Gs(t.hall),
              children: [(0, yt.jsx)(Wo, {}), " Go in"],
            }),
          a &&
            (0, yt.jsxs)("button", {
              className: "btn btn-ghost btn-xs",
              onClick: () => R9(a),
              children: [(0, yt.jsx)(dr, {}), " Walk there"],
            }),
        ],
      }),
    ],
  });
}
function $B({ live: t }) {
  let e = Y(),
    a = e.halls?.events || [];
  return t
    ? (0, yt.jsxs)("div", {
        className: "space-y-2",
        children: [
          !a.length &&
            (0, yt.jsx)("div", {
              className: "card p-4 text-sm",
              style: gi,
              children:
                "No events booked yet. Every hall is open \u2014 walk in and meet people, or book one for your launch, class or watch party.",
            }),
          a.map((r) => (0, yt.jsx)(Zy, { e: r, me: e.net.id }, r.id)),
          (0, yt.jsx)("div", {
            className: "grid grid-cols-2 gap-2",
            children: Bo.map((r) => {
              let o = Ky[r.kind];
              return (0, yt.jsxs)(
                "button",
                {
                  "data-hall": r.id,
                  className: "card p-2.5 text-left card-hover",
                  onClick: () => Gs(r.id),
                  children: [
                    (0, yt.jsxs)("div", {
                      className: "text-sm font-bold flex items-center gap-1.5",
                      children: [(0, yt.jsx)(o, { style: { color: r.color } }), " ", r.name],
                    }),
                    (0, yt.jsxs)("div", {
                      className: "text-[11px]",
                      style: gi,
                      children: ["Walk in now \xB7 ", r.cap, " people"],
                    }),
                  ],
                },
                r.id,
              );
            }),
          }),
        ],
      })
    : (0, yt.jsx)(Jy, {});
}
function _B({ live: t, hall: e, setHall: a, done: r }) {
  let o = Y(),
    n = Ui(e) || Bo[0],
    [i, s] = (0, Ld.useState)(() => ({
      title: "",
      desc: "",
      start: UB(Date.now() + 36e5 - (Date.now() % 36e5)),
      hours: 1,
      price: 0,
    })),
    l = (o.halls?.events || []).filter((h) => h.hall === n.id),
    c = n.hourly * i.hours,
    d = o.bank?.bal ?? 0;
  return (0, yt.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, yt.jsx)("div", {
        className: "grid grid-cols-2 gap-2",
        children: Bo.map((h) => {
          let u = Ky[h.kind];
          return (0, yt.jsxs)(
            "button",
            {
              "data-book-hall": h.id,
              className: `card p-2.5 text-left ${h.id === n.id ? "chip-on" : ""}`,
              onClick: () => a(h.id),
              children: [
                (0, yt.jsxs)("div", {
                  className: "text-sm font-bold flex items-center gap-1.5",
                  children: [(0, yt.jsx)(u, { style: { color: h.color } }), " ", h.name],
                }),
                (0, yt.jsxs)("div", {
                  className: "text-[11px]",
                  style: gi,
                  children: [h.cap, " people \xB7 ", q(h.hourly), "/hour"],
                }),
              ],
            },
            h.id,
          );
        }),
      }),
      (0, yt.jsxs)("div", {
        className: "card p-3 text-xs",
        style: gi,
        children: [
          (0, yt.jsxs)("b", { style: { color: "var(--ink)" }, children: [n.name, "."] }),
          " ",
          n.desc,
          " ",
          (0, yt.jsx)("button", {
            className: "underline ml-1",
            onClick: () => R9(n),
            children: "Walk there",
          }),
        ],
      }),
      t
        ? (0, yt.jsxs)("form", {
            className: "card p-4 space-y-3",
            onSubmit: (h) => {
              (h.preventDefault(),
                O.send({
                  t: "hall_book",
                  hall: n.id,
                  title: i.title,
                  desc: i.desc,
                  start: new Date(i.start).getTime(),
                  hours: i.hours,
                  price: i.price,
                }),
                r());
            },
            children: [
              (0, yt.jsxs)("div", { className: "text-sm font-bold", children: ["Book the ", n.name] }),
              (0, yt.jsxs)("div", {
                children: [
                  (0, yt.jsx)("label", { className: "label", htmlFor: "ev-title", children: "Event title" }),
                  (0, yt.jsx)("input", {
                    id: "ev-title",
                    className: "field",
                    maxLength: 80,
                    value: i.title,
                    onChange: (h) => s({ ...i, title: h.target.value }),
                    placeholder: "AI Agents launch night",
                  }),
                ],
              }),
              (0, yt.jsxs)("div", {
                children: [
                  (0, yt.jsx)("label", {
                    className: "label",
                    htmlFor: "ev-desc",
                    children: "What happens (optional)",
                  }),
                  (0, yt.jsx)("textarea", {
                    id: "ev-desc",
                    className: "field",
                    rows: 2,
                    maxLength: 800,
                    value: i.desc,
                    onChange: (h) => s({ ...i, desc: h.target.value }),
                    placeholder: "Demo, Q&A and networking",
                  }),
                ],
              }),
              (0, yt.jsxs)("div", {
                className: "grid grid-cols-3 gap-2",
                children: [
                  (0, yt.jsxs)("div", {
                    className: "col-span-3 sm:col-span-1",
                    children: [
                      (0, yt.jsx)("label", { className: "label", htmlFor: "ev-start", children: "Starts" }),
                      (0, yt.jsx)("input", {
                        id: "ev-start",
                        type: "datetime-local",
                        className: "field",
                        value: i.start,
                        onChange: (h) => s({ ...i, start: h.target.value }),
                      }),
                    ],
                  }),
                  (0, yt.jsxs)("div", {
                    children: [
                      (0, yt.jsx)("label", { className: "label", htmlFor: "ev-hours", children: "Hours" }),
                      (0, yt.jsx)("select", {
                        id: "ev-hours",
                        className: "field",
                        value: i.hours,
                        onChange: (h) => s({ ...i, hours: +h.target.value }),
                        children: Array.from({ length: yw }, (h, u) => u + 1).map((h) =>
                          (0, yt.jsxs)("option", { value: h, children: [h, " h"] }, h),
                        ),
                      }),
                    ],
                  }),
                  (0, yt.jsxs)("div", {
                    children: [
                      (0, yt.jsx)("label", {
                        className: "label",
                        htmlFor: "ev-price",
                        children: "Ticket (FYC)",
                      }),
                      (0, yt.jsx)("input", {
                        id: "ev-price",
                        type: "number",
                        min: 0,
                        max: av,
                        className: "field",
                        value: i.price,
                        onChange: (h) => s({ ...i, price: Math.max(0, Math.min(av, +h.target.value || 0)) }),
                      }),
                    ],
                  }),
                ],
              }),
              l.length > 0 &&
                (0, yt.jsxs)("div", {
                  className: "text-[11px]",
                  style: gi,
                  children: [
                    "Already booked: ",
                    l.map((h) => `${N9(h.start)} (${Math.round((h.end - h.start) / 36e5)} h)`).join(" \xB7 "),
                  ],
                }),
              (0, yt.jsxs)("div", {
                className: "text-[11px]",
                style: gi,
                children: [
                  "Booking fee ",
                  q(c),
                  " goes to the National Treasury (refunded if you cancel more than an hour before). ",
                  i.price
                    ? `Tickets: you receive 90% (${q(Math.round(i.price * 0.9))} each) after the event.`
                    : "Free event: anyone can walk in.",
                ],
              }),
              (0, yt.jsx)("button", {
                id: "ev-book",
                className: "btn btn-primary w-full",
                disabled: i.title.trim().length < 4 || d < c,
                children: d < c ? `You need ${q(c)}` : `Book for ${q(c)}`,
              }),
            ],
          })
        : (0, yt.jsx)(Jy, {}),
    ],
  });
}
function YB({ live: t }) {
  let e = Y();
  if (!t) return (0, yt.jsx)(Jy, {});
  let a = e.halls?.events || [],
    r = e.net.id,
    o = a.filter((i) => i.host === r),
    n = a.filter((i) => i.mine);
  return (0, yt.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, yt.jsxs)("div", { className: "text-xs font-bold", children: ["Hosting (", o.length, ")"] }),
      !o.length &&
        (0, yt.jsx)("div", {
          className: "card p-3 text-xs",
          style: gi,
          children: "You are not hosting anything yet.",
        }),
      o.map((i) => (0, yt.jsx)(Zy, { e: i, me: r }, i.id)),
      (0, yt.jsxs)("div", { className: "text-xs font-bold pt-1", children: ["Tickets (", n.length, ")"] }),
      !n.length &&
        (0, yt.jsx)("div", {
          className: "card p-3 text-xs",
          style: gi,
          children: "No tickets yet. See Upcoming.",
        }),
      n.map((i) => (0, yt.jsx)(Zy, { e: i, me: r }, i.id)),
    ],
  });
}
var Jy = () =>
  (0, yt.jsxs)("div", {
    className: "card p-4 text-sm",
    children: [
      (0, yt.jsx)("b", { children: "Bookings and tickets run on the live city at fyrus.io." }),
      (0, yt.jsx)("div", {
        className: "mt-1",
        style: gi,
        children: "You can still walk into any hall here. Connecting\u2026",
      }),
    ],
  });
var z0 = P(Zt(), 1);
var Ft = P(ct(), 1),
  In = { color: "var(--ink-dim)" },
  Qy = (t) => {
    let e = t - Date.now();
    if (e <= 0) return "now";
    let a = Math.floor(e / 36e5),
      r = Math.floor((e % 36e5) / 6e4);
    return a >= 24 ? `${Math.floor(a / 24)}d` : a ? `${a}h ${r}m` : `${Math.max(1, r)}m`;
  };
