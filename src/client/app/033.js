function CB({ id: t, back: e }) {
  let a = Y(),
    r = a.mk?.listings.find((u) => u.id === t) || a.mkMine?.listings.find((u) => u.id === t),
    [o, n] = (0, gr.useState)(""),
    [i, s] = (0, gr.useState)("");
  if (!r)
    return (0, I.jsxs)("div", {
      children: [
        (0, I.jsxs)("button", {
          className: "btn btn-ghost btn-sm",
          onClick: e,
          children: [(0, I.jsx)(Qr, {}), " Back"],
        }),
        (0, I.jsx)("div", {
          className: "text-sm mt-2",
          style: Ne,
          children: "This item is no longer listed.",
        }),
      ],
    });
  let l = r.seller === a.net.id,
    c = r.type === "physical" || r.type === "brand",
    d = r.topBid,
    h = d ? d + Math.max(1, Math.round(d * 0.05)) : r.price;
  return (0, I.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, I.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: e,
        children: [(0, I.jsx)(Qr, {}), " Market"],
      }),
      (0, I.jsxs)("div", {
        className: "card p-3 flex gap-3",
        children: [
          (0, I.jsx)("span", {
            className: "w-16 h-16 rounded-xl grid place-items-center text-3xl shrink-0 text-white",
            style: { background: r.color },
            children: r.icon,
          }),
          (0, I.jsxs)("div", {
            className: "min-w-0 flex-1",
            children: [
              (0, I.jsx)("div", { className: "text-base font-bold", children: r.title }),
              (0, I.jsxs)("div", {
                className: "text-[12px]",
                style: Ne,
                children: [cf.find((u) => u.id === r.type)?.one, " \xB7 sold by ", r.sellerName],
              }),
              (0, I.jsx)("div", { className: "mt-1", children: (0, I.jsx)(T9, { t: r.trust }) }),
              (0, I.jsxs)("div", {
                className: "text-xl font-bold mt-1",
                style: { color: "var(--ember-hi)" },
                children: [
                  q((r.mode === "auction" && d) || r.price),
                  r.mode === "auction" &&
                    (0, I.jsxs)("span", {
                      className: "text-[12px] font-normal ml-2",
                      style: Ne,
                      children: [d ? "top bid" : "starting bid", " \xB7 ends in ", Tu(r.endsAt)],
                    }),
                ],
              }),
            ],
          }),
        ],
      }),
      r.desc &&
        (0, I.jsx)("div", { className: "card p-3 text-[13px] whitespace-pre-wrap", children: r.desc }),
      (0, I.jsxs)("div", {
        className: "text-[12px] grid grid-cols-2 gap-1",
        style: Ne,
        children: [
          c &&
            (0, I.jsxs)("span", {
              children: [
                (0, I.jsx)(ag, { className: "inline" }),
                " Ships in ",
                r.shipDays,
                " days \xB7 ",
                r.stock,
                " in stock",
              ],
            }),
          r.type === "skill" &&
            (0, I.jsxs)("span", {
              children: [(0, I.jsx)(li, { className: "inline" }), " Delivered in ", r.skillDays, " days"],
            }),
          (r.type === "digital" || r.type === "course") &&
            (0, I.jsxs)("span", {
              children: [(0, I.jsx)(Pr, { className: "inline" }), " Unlocks right after payment"],
            }),
          (0, I.jsxs)("span", {
            children: [
              (0, I.jsx)(yr, { className: "inline" }),
              " 72-hour inspection, then the seller is paid",
            ],
          }),
        ],
      }),
      !l &&
        r.mode === "fixed" &&
        (0, I.jsxs)("div", {
          className: "card p-3 space-y-2",
          children: [
            c &&
              (0, I.jsx)("textarea", {
                className: "field py-1.5 text-sm",
                rows: 2,
                value: o,
                onChange: (u) => n(u.target.value),
                placeholder: "Delivery address (only the seller sees it)",
                "aria-label": "Delivery address",
              }),
            (0, I.jsxs)("button", {
              id: "mk-buy",
              className: "btn btn-primary btn-sm",
              onClick: () => O.send({ t: "mk_buy", id: r.id, address: o }),
              children: [(0, I.jsx)(Pr, {}), " Buy now \xB7 ", q(r.price), " into escrow"],
            }),
            (0, I.jsx)("div", {
              className: "text-[11px]",
              style: Ne,
              children:
                "Your FYC goes to Central Bank escrow, not to the seller. They are paid only after delivery and your inspection window.",
            }),
          ],
        }),
      !l &&
        r.mode === "auction" &&
        (0, I.jsxs)("div", {
          className: "card p-3 space-y-2",
          children: [
            (0, I.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, I.jsx)("input", {
                  className: "field py-1.5 text-sm",
                  type: "number",
                  value: i,
                  onChange: (u) => s(u.target.value),
                  placeholder: `${h} or more`,
                  "aria-label": "Your bid",
                }),
                (0, I.jsxs)("button", {
                  id: "mk-bid",
                  className: "btn btn-primary btn-sm",
                  onClick: () => O.send({ t: "mk_bid", id: r.id, amount: +i || h }),
                  children: [(0, I.jsx)(Zl, {}), " Bid"],
                }),
              ],
            }),
            (0, I.jsxs)("div", {
              className: "text-[11px]",
              style: Ne,
              children: [
                "Your bid is held in escrow. If someone outbids you, it comes straight back. Next bid at least ",
                q(h),
                ".",
              ],
            }),
            r.bids.length > 0 &&
              (0, I.jsx)("div", {
                className: "text-[12px] space-y-0.5",
                children: r.bids
                  .slice()
                  .reverse()
                  .map((u, p) =>
                    (0, I.jsxs)(
                      "div",
                      {
                        className: "flex",
                        children: [
                          (0, I.jsx)("span", { className: "flex-1", children: u.name }),
                          (0, I.jsx)("b", { children: q(u.amount) }),
                        ],
                      },
                      p,
                    ),
                  ),
              }),
          ],
        }),
      l &&
        (0, I.jsx)("div", {
          className: "text-[12px]",
          style: Ne,
          children: "This is your listing. Manage it in My sales.",
        }),
    ],
  });
}
function TB() {
  let e = Y().bank,
    [a, r] = (0, gr.useState)({
      type: "digital",
      title: "",
      desc: "",
      price: 100,
      mode: "fixed",
      hours: 24,
      reserve: "",
      stock: 1,
      shipDays: 5,
      skillDays: 5,
      delivery: "",
      icon: "\u25C6",
      color: "#2f6fe0",
    }),
    o = (l) => r((c) => ({ ...c, ...l })),
    [n, i] = (0, gr.useState)(1e3),
    s = Math.max(a.price > 1e3 ? Math.max(500, Math.round(a.price * 0.1)) : 0, a.type === "brand" ? 2e3 : 0);
  return (0, I.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, I.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, I.jsxs)("div", {
            className: "text-sm font-bold",
            children: ["Seller bond: ", q(e?.bond || 0)],
          }),
          (0, I.jsx)("div", {
            className: "text-[12px]",
            style: Ne,
            children:
              "Items above 1,000 FYC need a refundable bond of 10% of the price (at least 500); brand stores need 2,000. You get the bond back when you have no open orders. Proven scams forfeit it.",
          }),
          (0, I.jsxs)("div", {
            className: "flex gap-1.5 mt-2",
            children: [
              (0, I.jsx)("input", {
                className: "field py-1 text-sm w-28",
                type: "number",
                value: n,
                onChange: (l) => i(+l.target.value),
                "aria-label": "Bond amount",
              }),
              (0, I.jsxs)("button", {
                id: "mk-bond",
                className: "btn btn-ghost btn-sm",
                onClick: () => O.send({ t: "bond_stake", amount: n }),
                children: [(0, I.jsx)(Na, {}), " Stake"],
              }),
              (e?.bond || 0) > 0 &&
                (0, I.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => O.send({ t: "bond_withdraw" }),
                  children: "Withdraw",
                }),
            ],
          }),
        ],
      }),
      (0, I.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-1.5",
        children: cf.map((l) =>
          (0, I.jsxs)(
            "button",
            {
              "data-mk-type": l.id,
              className: "text-left rounded-lg p-2.5",
              style: {
                border: `1px solid ${a.type === l.id ? "var(--accent)" : "var(--line)"}`,
                background:
                  a.type === l.id ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
              },
              onClick: () => o({ type: l.id }),
              children: [
                (0, I.jsx)("div", { className: "text-sm font-bold", children: l.one }),
                (0, I.jsx)("div", { className: "text-[11px]", style: Ne, children: l.desc }),
              ],
            },
            l.id,
          ),
        ),
      }),
      (0, I.jsxs)("div", {
        className: "card p-3 space-y-2",
        id: "mk-form",
        children: [
          (0, I.jsx)("input", {
            className: "field py-1.5 text-sm",
            value: a.title,
            onChange: (l) => o({ title: l.target.value }),
            placeholder: "Title",
            maxLength: 80,
            "aria-label": "Listing title",
          }),
          (0, I.jsx)("textarea", {
            className: "field py-1.5 text-sm",
            rows: 3,
            value: a.desc,
            onChange: (l) => o({ desc: l.target.value }),
            placeholder: "Description: what it is, what the buyer gets, condition",
            maxLength: 2e3,
            "aria-label": "Listing description",
          }),
          (0, I.jsx)("div", {
            className: "flex gap-1",
            children: [
              ["fixed", "Buy now"],
              ["auction", "Live auction"],
            ].map(([l, c]) =>
              (0, I.jsx)(
                "button",
                {
                  className: `chip ${a.mode === l ? "chip-on" : ""}`,
                  onClick: () => o({ mode: l }),
                  children: c,
                },
                l,
              ),
            ),
          }),
          (0, I.jsxs)("div", {
            className: "grid grid-cols-2 sm:grid-cols-3 gap-1.5",
            children: [
              (0, I.jsxs)("label", {
                className: "text-[11px]",
                style: Ne,
                children: [
                  a.mode === "auction" ? "Starting bid (FYC)" : "Price (FYC)",
                  (0, I.jsx)("input", {
                    className: "field py-1 text-sm",
                    type: "number",
                    min: 1,
                    value: a.price,
                    onChange: (l) => o({ price: +l.target.value }),
                    "aria-label": "Price",
                  }),
                ],
              }),
              a.mode === "auction" &&
                (0, I.jsxs)(I.Fragment, {
                  children: [
                    (0, I.jsxs)("label", {
                      className: "text-[11px]",
                      style: Ne,
                      children: [
                        "Runs for (hours)",
                        (0, I.jsx)("input", {
                          className: "field py-1 text-sm",
                          type: "number",
                          min: 1,
                          max: 168,
                          value: a.hours,
                          onChange: (l) => o({ hours: +l.target.value }),
                        }),
                      ],
                    }),
                    (0, I.jsxs)("label", {
                      className: "text-[11px]",
                      style: Ne,
                      children: [
                        "Reserve (optional)",
                        (0, I.jsx)("input", {
                          className: "field py-1 text-sm",
                          type: "number",
                          value: a.reserve,
                          onChange: (l) => o({ reserve: l.target.value }),
                        }),
                      ],
                    }),
                  ],
                }),
              (a.type === "physical" || a.type === "brand") &&
                (0, I.jsxs)(I.Fragment, {
                  children: [
                    (0, I.jsxs)("label", {
                      className: "text-[11px]",
                      style: Ne,
                      children: [
                        "Stock",
                        (0, I.jsx)("input", {
                          className: "field py-1 text-sm",
                          type: "number",
                          min: 1,
                          value: a.stock,
                          onChange: (l) => o({ stock: +l.target.value }),
                        }),
                      ],
                    }),
                    (0, I.jsxs)("label", {
                      className: "text-[11px]",
                      style: Ne,
                      children: [
                        "Ships within (days)",
                        (0, I.jsx)("input", {
                          className: "field py-1 text-sm",
                          type: "number",
                          min: 1,
                          value: a.shipDays,
                          onChange: (l) => o({ shipDays: +l.target.value }),
                        }),
                      ],
                    }),
                  ],
                }),
              a.type === "skill" &&
                (0, I.jsxs)("label", {
                  className: "text-[11px]",
                  style: Ne,
                  children: [
                    "Delivery time (days)",
                    (0, I.jsx)("input", {
                      className: "field py-1 text-sm",
                      type: "number",
                      min: 1,
                      value: a.skillDays,
                      onChange: (l) => o({ skillDays: +l.target.value }),
                    }),
                  ],
                }),
            ],
          }),
          (a.type === "digital" || a.type === "course") &&
            (0, I.jsx)("textarea", {
              className: "field py-1.5 text-sm",
              rows: 2,
              value: a.delivery,
              onChange: (l) => o({ delivery: l.target.value }),
              placeholder:
                "What the buyer receives: https download link, licence key or the content. Hidden until they pay.",
              maxLength: 2e3,
              "aria-label": "Delivery content",
            }),
          (0, I.jsxs)("div", {
            className: "flex gap-1 flex-wrap items-center",
            children: [
              EB.map((l) =>
                (0, I.jsx)(
                  "button",
                  {
                    className: "w-8 h-8 rounded-md text-base",
                    style: { border: `1px solid ${a.icon === l ? "var(--accent)" : "var(--line)"}` },
                    onClick: () => o({ icon: l }),
                    children: l,
                  },
                  l,
                ),
              ),
              (0, I.jsx)("input", {
                type: "color",
                value: a.color,
                onChange: (l) => o({ color: l.target.value }),
                "aria-label": "Colour",
              }),
            ],
          }),
          s > (e?.bond || 0) &&
            (0, I.jsxs)("div", {
              className: "text-[12px] flex items-center gap-1",
              style: { color: "var(--ember-hi)" },
              children: [(0, I.jsx)(nu, {}), " This listing needs a bond of ", q(s), "."],
            }),
          (0, I.jsxs)("button", {
            id: "mk-publish",
            className: "btn btn-primary btn-sm",
            onClick: () => O.send({ t: "mk_create", ...a, reserve: +a.reserve || 0 }),
            children: [(0, I.jsx)(jo, {}), " Publish"],
          }),
          (0, I.jsx)("div", {
            className: "text-[11px]",
            style: Ne,
            children:
              "Sentinel checks every listing for prohibited goods, off-platform payment requests and unsafe links. The market keeps 5% of each completed sale for the national treasury.",
          }),
        ],
      }),
    ],
  });
}
function SB() {
  let e = Y().mkMine?.bought || [],
    [a, r] = (0, gr.useState)({}),
    [o, n] = (0, gr.useState)({});
  return (
    (0, gr.useEffect)(
      () => O.on("mk_delivery", (i) => r((s) => ({ ...s, [i.order]: i.content || "(empty)" }))),
      [],
    ),
    e.length
      ? (0, I.jsx)("div", {
          className: "space-y-2",
          children: e.map((i) => {
            let [s, l] = C9[i.status] || [i.status, "#fff"],
              c = o[i.id];
            return (0, I.jsxs)(
              "div",
              {
                "data-order": i.id,
                className: "rounded-lg p-2.5",
                style: { border: "1px solid var(--line)" },
                children: [
                  (0, I.jsxs)("div", {
                    className: "flex items-start gap-2",
                    children: [
                      (0, I.jsxs)("div", {
                        className: "flex-1 min-w-0",
                        children: [
                          (0, I.jsx)("div", { className: "text-sm font-bold truncate", children: i.title }),
                          (0, I.jsxs)("div", {
                            className: "text-[11px]",
                            style: Ne,
                            children: [
                              i.sellerName,
                              " \xB7 ",
                              q(i.amount),
                              i.tracking ? ` \xB7 tracking ${i.tracking}` : "",
                              i.inspectUntil && i.status === "delivered"
                                ? ` \xB7 auto-release in ${Tu(i.inspectUntil)}`
                                : "",
                            ],
                          }),
                        ],
                      }),
                      (0, I.jsx)("span", {
                        className: "text-[11px] font-bold",
                        style: { color: l },
                        children: s,
                      }),
                    ],
                  }),
                  i.note &&
                    (0, I.jsxs)("div", {
                      className: "text-[12px] mt-1 whitespace-pre-wrap rounded p-2",
                      style: { background: "rgba(255,255,255,.04)" },
                      children: ["Seller: ", i.note],
                    }),
                  a[i.id] &&
                    (0, I.jsxs)("div", {
                      className: "text-[12px] mt-1 whitespace-pre-wrap break-all rounded p-2",
                      style: { background: "rgba(69,224,174,.08)" },
                      "data-delivery": i.id,
                      children: [(0, I.jsx)(Pr, { className: "inline" }), " ", a[i.id]],
                    }),
                  i.dispute &&
                    (0, I.jsxs)("div", {
                      className: "text-[12px] mt-1",
                      style: Ne,
                      children: [
                        "Dispute: ",
                        i.dispute.reason,
                        i.dispute.sellerText ? ` \xB7 Seller: ${i.dispute.sellerText}` : "",
                        i.dispute.ruling ? ` \xB7 Ruling: ${i.dispute.ruling} (${i.dispute.ruledBy})` : "",
                      ],
                    }),
                  ["paid", "delivered"].includes(i.status) &&
                    (0, I.jsxs)("div", {
                      className: "flex gap-1.5 flex-wrap mt-2",
                      children: [
                        (i.type === "digital" || i.type === "course" || i.note) &&
                          (0, I.jsxs)("button", {
                            className: "btn btn-ghost btn-sm",
                            onClick: () => O.send({ t: "mk_open", order: i.id }),
                            children: [(0, I.jsx)(Pr, {}), " Open delivery"],
                          }),
                        i.status === "delivered" &&
                          (0, I.jsxs)("button", {
                            className: "btn btn-primary btn-sm",
                            "data-confirm": i.id,
                            onClick: () => O.send({ t: "mk_confirm", order: i.id }),
                            children: [(0, I.jsx)(_e, {}), " All good, release payment"],
                          }),
                        (0, I.jsxs)("button", {
                          className: "btn btn-ghost btn-sm",
                          "data-dispute": i.id,
                          onClick: () => n({ ...o, [i.id]: c ? void 0 : { reason: "", evidence: "" } }),
                          children: [(0, I.jsx)(nu, {}), " Problem"],
                        }),
                      ],
                    }),
                  c &&
                    (0, I.jsxs)("div", {
                      className: "mt-2 space-y-1.5",
                      children: [
                        (0, I.jsx)("textarea", {
                          className: "field py-1.5 text-sm",
                          rows: 2,
                          value: c.reason,
                          onChange: (d) => n({ ...o, [i.id]: { ...c, reason: d.target.value } }),
                          placeholder: "What went wrong?",
                          "aria-label": "Dispute reason",
                        }),
                        (0, I.jsx)("input", {
                          className: "field py-1 text-sm",
                          value: c.evidence,
                          onChange: (d) => n({ ...o, [i.id]: { ...c, evidence: d.target.value } }),
                          placeholder: "Evidence: screenshot or video link",
                        }),
                        (0, I.jsxs)("button", {
                          className: "btn btn-primary btn-sm",
                          "data-send-dispute": i.id,
                          onClick: () => {
                            (O.send({ t: "mk_dispute", order: i.id, ...c }), n({ ...o, [i.id]: void 0 }));
                          },
                          children: [(0, I.jsx)(Ei, {}), " Freeze payment and open a dispute"],
                        }),
                      ],
                    }),
                ],
              },
              i.id,
            );
          }),
        })
      : (0, I.jsx)("div", { className: "text-[12px]", style: Ne, children: "No orders yet." })
  );
}
function HB() {
  let e = Y().mkMine,
    [a, r] = (0, gr.useState)({}),
    [o, n] = (0, gr.useState)({});
  return e
    ? (0, I.jsxs)("div", {
        className: "space-y-3",
        children: [
          (0, I.jsxs)("div", {
            className: "flex items-center gap-2",
            children: [
              (0, I.jsx)("span", { className: "text-[12px]", style: Ne, children: "Your seller status:" }),
              (0, I.jsx)(T9, { t: e.trust }),
            ],
          }),
          (0, I.jsxs)("div", {
            children: [
              (0, I.jsxs)("div", {
                className: "text-[11px] font-bold tracking-wide mb-1",
                style: Ne,
                children: [
                  "MY LISTINGS (",
                  e.listings.filter((i) => i.status === "active").length,
                  " active)",
                ],
              }),
              e.listings.map((i) =>
                (0, I.jsxs)(
                  "div",
                  {
                    className: "rounded-lg px-2.5 py-2 mb-1 flex items-center gap-2 text-[13px]",
                    style: { border: "1px solid var(--line)" },
                    children: [
                      (0, I.jsx)("span", {
                        className: "w-7 h-7 rounded grid place-items-center text-white",
                        style: { background: i.color },
                        children: i.icon,
                      }),
                      (0, I.jsxs)("div", {
                        className: "flex-1 min-w-0",
                        children: [
                          (0, I.jsx)("b", { className: "truncate block", children: i.title }),
                          (0, I.jsxs)("span", {
                            className: "text-[11px]",
                            style: Ne,
                            children: [
                              i.status,
                              " \xB7 ",
                              i.sold,
                              " sold \xB7 ",
                              q((i.mode === "auction" && i.topBid) || i.price),
                              i.mode === "auction" && i.status === "active"
                                ? ` \xB7 ends in ${Tu(i.endsAt)}`
                                : "",
                            ],
                          }),
                        ],
                      }),
                      i.status === "active" &&
                        (0, I.jsx)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: () => O.send({ t: "mk_remove", id: i.id }),
                          children: "Remove",
                        }),
                    ],
                  },
                  i.id,
                ),
              ),
              e.listings.length === 0 &&
                (0, I.jsx)("div", { className: "text-[12px]", style: Ne, children: "No listings yet." }),
            ],
          }),
          (0, I.jsxs)("div", {
            children: [
              (0, I.jsx)("div", {
                className: "text-[11px] font-bold tracking-wide mb-1",
                style: Ne,
                children: "ORDERS TO FULFIL",
              }),
              e.sold.length === 0 &&
                (0, I.jsx)("div", { className: "text-[12px]", style: Ne, children: "No orders yet." }),
              e.sold.map((i) => {
                let [s, l] = C9[i.status] || [i.status, "#fff"],
                  c = a[i.id] || { note: "", tracking: "" },
                  d = i.type === "physical" || i.type === "brand";
                return (0, I.jsxs)(
                  "div",
                  {
                    "data-sale": i.id,
                    className: "rounded-lg p-2.5 mb-1.5",
                    style: { border: "1px solid var(--line)" },
                    children: [
                      (0, I.jsxs)("div", {
                        className: "flex",
                        children: [
                          (0, I.jsxs)("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              (0, I.jsx)("b", { className: "text-sm truncate block", children: i.title }),
                              (0, I.jsxs)("span", {
                                className: "text-[11px]",
                                style: Ne,
                                children: [
                                  (0, I.jsx)(Ul, { className: "inline" }),
                                  " ",
                                  i.buyerName,
                                  " \xB7 ",
                                  q(i.amount),
                                  " in escrow \xB7 deliver by ",
                                  new Date(i.dueBy).toLocaleDateString("en-GB"),
                                ],
                              }),
                            ],
                          }),
                          (0, I.jsx)("span", {
                            className: "text-[11px] font-bold",
                            style: { color: l },
                            children: s,
                          }),
                        ],
                      }),
                      i.address &&
                        (0, I.jsxs)("div", {
                          className: "text-[12px] mt-1 rounded p-2",
                          style: { background: "rgba(255,255,255,.04)" },
                          children: [(0, I.jsx)(ag, { className: "inline" }), " Ship to: ", i.address],
                        }),
                      i.status === "paid" &&
                        (0, I.jsxs)("div", {
                          className: "mt-2 space-y-1.5",
                          children: [
                            (0, I.jsx)("textarea", {
                              className: "field py-1.5 text-sm",
                              rows: 2,
                              value: c.note,
                              onChange: (h) => r({ ...a, [i.id]: { ...c, note: h.target.value } }),
                              placeholder: d
                                ? "Note for the buyer (courier, what is in the box)"
                                : "Your delivery: link to the files, message for the buyer",
                              "aria-label": "Delivery note",
                            }),
                            d &&
                              (0, I.jsx)("input", {
                                className: "field py-1 text-sm",
                                value: c.tracking,
                                onChange: (h) => r({ ...a, [i.id]: { ...c, tracking: h.target.value } }),
                                placeholder: "Tracking number",
                              }),
                            (0, I.jsxs)("button", {
                              className: "btn btn-primary btn-sm",
                              "data-deliver": i.id,
                              onClick: () => O.send({ t: "mk_deliver", order: i.id, ...c }),
                              children: [(0, I.jsx)(ag, {}), " ", d ? "Mark as shipped" : "Deliver"],
                            }),
                          ],
                        }),
                      i.status === "disputed" &&
                        i.dispute &&
                        (0, I.jsxs)("div", {
                          className: "mt-2 space-y-1.5",
                          children: [
                            (0, I.jsxs)("div", {
                              className: "text-[12px]",
                              style: { color: "var(--rose)" },
                              children: [
                                "Buyer: ",
                                i.dispute.reason,
                                i.dispute.evidence ? ` (${i.dispute.evidence})` : "",
                                " \xB7 answer in ",
                                Tu(i.dispute.respondBy),
                              ],
                            }),
                            (0, I.jsx)("textarea", {
                              className: "field py-1.5 text-sm",
                              rows: 2,
                              value: o[i.id] || "",
                              onChange: (h) => n({ ...o, [i.id]: h.target.value }),
                              placeholder: "Your side, with proof",
                              "aria-label": "Dispute answer",
                            }),
                            (0, I.jsxs)("div", {
                              className: "flex gap-1.5",
                              children: [
                                (0, I.jsx)("button", {
                                  className: "btn btn-ghost btn-sm",
                                  onClick: () => O.send({ t: "mk_respond", order: i.id, refund: !0 }),
                                  children: "Accept refund",
                                }),
                                (0, I.jsxs)("button", {
                                  className: "btn btn-primary btn-sm",
                                  "data-answer": i.id,
                                  onClick: () =>
                                    O.send({ t: "mk_respond", order: i.id, text: o[i.id] || "" }),
                                  children: [(0, I.jsx)(Ei, {}), " Send to the Court"],
                                }),
                              ],
                            }),
                          ],
                        }),
                      i.dispute?.ruling &&
                        (0, I.jsxs)("div", {
                          className: "text-[12px] mt-1",
                          style: Ne,
                          children: ["Ruling: ", i.dispute.ruling, " (", i.dispute.ruledBy, ")"],
                        }),
                    ],
                  },
                  i.id,
                );
              }),
            ],
          }),
        ],
      })
    : (0, I.jsx)("div", { className: "text-sm", style: Ne, children: "Loading\u2026" });
}
function NB() {
  let e = Y().mkMine?.court || [],
    [a, r] = (0, gr.useState)({}),
    [o, n] = (0, gr.useState)({});
  return e.length
    ? (0, I.jsx)("div", {
        className: "space-y-2",
        children: e.map((i) =>
          (0, I.jsxs)(
            "div",
            {
              "data-case": i.id,
              className: "rounded-lg p-2.5",
              style: { border: "1px solid var(--line)" },
              children: [
                (0, I.jsxs)("div", {
                  className: "text-sm font-bold",
                  children: [i.title, " \xB7 ", q(i.amount)],
                }),
                (0, I.jsxs)("div", {
                  className: "text-[11px]",
                  style: Ne,
                  children: ["Buyer ", i.buyerName, " vs seller ", i.sellerName, " \xB7 ", i.status],
                }),
                (0, I.jsxs)("div", {
                  className: "text-[12px] mt-1",
                  children: [
                    (0, I.jsx)("b", { children: "Buyer:" }),
                    " ",
                    i.dispute?.reason,
                    " ",
                    i.dispute?.evidence ? `(${i.dispute.evidence})` : "",
                  ],
                }),
                (0, I.jsxs)("div", {
                  className: "text-[12px]",
                  children: [
                    (0, I.jsx)("b", { children: "Seller:" }),
                    " ",
                    i.dispute?.sellerText || "no answer yet",
                  ],
                }),
                i.note &&
                  (0, I.jsxs)("div", {
                    className: "text-[12px]",
                    style: Ne,
                    children: ["Delivery note: ", i.note, i.tracking ? ` \xB7 tracking ${i.tracking}` : ""],
                  }),
                (0, I.jsx)("input", {
                  className: "field py-1 text-sm mt-1.5",
                  value: a[i.id] || "",
                  onChange: (s) => r({ ...a, [i.id]: s.target.value }),
                  placeholder: "Reason for the ruling",
                }),
                (0, I.jsxs)("label", {
                  className: "text-[12px] flex items-center gap-1 mt-1",
                  children: [
                    (0, I.jsx)("input", {
                      type: "checkbox",
                      checked: !!o[i.id],
                      onChange: (s) => n({ ...o, [i.id]: s.target.checked }),
                    }),
                    " Fraud proven: ban the seller permanently",
                  ],
                }),
                (0, I.jsxs)("div", {
                  className: "flex gap-1.5 mt-1.5",
                  children: [
                    (0, I.jsx)("button", {
                      className: "btn btn-primary btn-sm",
                      "data-rule-refund": i.id,
                      onClick: () =>
                        O.send({ t: "mk_rule", order: i.id, refund: !0, note: a[i.id], ban: !!o[i.id] }),
                      children: "Refund the buyer",
                    }),
                    (0, I.jsx)("button", {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => O.send({ t: "mk_rule", order: i.id, refund: !1, note: a[i.id] }),
                      children: "Pay the seller",
                    }),
                  ],
                }),
              ],
            },
            i.id,
          ),
        ),
      })
    : (0, I.jsx)("div", {
        className: "text-[12px]",
        style: Ne,
        children: "No open disputes. Cases appear here when a seller answers a dispute.",
      });
}
var $r = P(Zt(), 1);
var Q = P(ct(), 1),
  _r = { color: "var(--ink-dim)" },
  RB = { starter: h0, executive: Ma, marina: Qp, royal: Us },
  BB = ["Classic", "Wide modern", "Tall", "Grand"],
  H9 = (t) => {
    if (!t) return "";
    let e = t - Date.now();
    if (e <= 0) return "ending\u2026";
    let a = Math.floor(e / 36e5),
      r = Math.floor((e % 36e5) / 6e4),
      o = Math.floor((e % 6e4) / 1e3);
    return a >= 24 ? `${Math.floor(a / 24)}d ${a % 24}h` : a ? `${a}h ${r}m` : `${r}m ${o}s`;
  },
  S9 = (t) => ({ x: t.x, z: t.z + t.face * (t.size / 2 + 3), face: { x: t.x, z: t.z } });
function df(t, e, a) {
  return e
    ? e.auction
      ? { key: "auction", text: `Auction \xB7 ${q(e.auction.top || e.auction.start)}` }
      : e.sale
        ? { key: "sale", text: `For sale \xB7 ${q(e.sale)}` }
        : e.rent && !e.rent.tenant
          ? { key: "rent", text: `For rent \xB7 ${q(e.rent.price)}/month` }
          : e.owner === a
            ? { key: "mine", text: "Yours" }
            : {
                key: "owned",
                text: `Owned by ${e.ownerName}${e.rent?.tenant ? ` \xB7 rented to ${e.rent.tenantName}` : ""}`,
              }
    : t.empty
      ? { key: "land", text: `Land Office \xB7 ${q(t.price)}` }
      : { key: "resident", text: `Home of ${t.resident}` };
}
function Yy() {
  let t = Y(),
    e = t.net.status === "online",
    [a, r] = (0, $r.useState)(null),
    [o, n] = (0, $r.useState)(null),
    [i, s] = (0, $r.useState)("societies"),
    [, l] = (0, $r.useState)(0);
  if (
    ((0, $r.useEffect)(() => {
      e && O.send({ t: "est_state" });
    }, [e]),
    (0, $r.useEffect)(() => {
      let v = setInterval(() => l((g) => g + 1), 1e3);
      return () => clearInterval(v);
    }, []),
    (0, $r.useEffect)(() => {
      t.estateFocus &&
        (t.estateFocus.soc && r(t.estateFocus.soc),
        t.estateFocus.plot && n(t.estateFocus.plot),
        s("societies"),
        C({ estateFocus: null }));
    }, [t.estateFocus]),
    !e)
  )
    return (0, Q.jsxs)("div", {
      className: "card p-4 text-sm",
      children: [
        (0, Q.jsx)("b", { children: "The Land Office runs on the live city at fyrus.io." }),
        (0, Q.jsx)("div", {
          className: "mt-1",
          style: _r,
          children: "Titles, rent and auctions are kept by the Central Bank server. Connecting\u2026",
        }),
      ],
    });
  let c = t.estate?.plots || {},
    d = Object.values(c),
    h = d.length,
    u = d.filter((v) => v.sale || v.auction).length,
    p = d.filter((v) => v.rent && !v.rent.tenant).length;
  return (0, Q.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, Q.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, Q.jsx)("div", {
            className: "text-[10px] font-bold tracking-[.25em]",
            style: { color: "var(--ember-hi)" },
            children: "LAND OFFICE \xB7 GATED SOCIETIES",
          }),
          (0, Q.jsx)("div", {
            className: "text-sm font-bold mt-0.5",
            children: "Buy, auction or rent a plot in four societies \u2014 or claim a free studio",
          }),
          (0, Q.jsx)("div", {
            className: "grid grid-cols-4 gap-2 mt-2 text-center",
            children: [
              ["Residents", Gw.toLocaleString("en-US")],
              ["Empty plots", `${Math.max(0, dv - h)} / ${dv}`],
              ["Resale & auctions", String(u)],
              ["For rent", String(p)],
            ].map(([v, g]) =>
              (0, Q.jsxs)(
                "div",
                {
                  children: [
                    (0, Q.jsx)("div", { className: "font-bold tabular", children: g }),
                    (0, Q.jsx)("div", { className: "text-[10px]", style: _r, children: v }),
                  ],
                },
                v,
              ),
            ),
          }),
        ],
      }),
      !o &&
        !a &&
        (0, Q.jsx)("div", {
          className: "flex gap-1 flex-wrap",
          children: [
            ["societies", "Societies"],
            ["mine", "My properties"],
            ["passes", "Royal Sky passes"],
          ].map(([v, g]) =>
            (0, Q.jsx)(
              "button",
              {
                "data-est-tab": v,
                className: `chip ${i === v ? "chip-on" : ""}`,
                onClick: () => s(v),
                children: g,
              },
              v,
            ),
          ),
        }),
      o
        ? (0, Q.jsx)(jB, { id: o, back: () => n(null) })
        : a
          ? (0, Q.jsx)(zB, { soc: a, back: () => r(null), open: n })
          : (0, Q.jsxs)(Q.Fragment, {
              children: [
                i === "societies" && (0, Q.jsx)(AB, { open: r }),
                i === "mine" && (0, Q.jsx)(WB, { open: n }),
                i === "passes" && (0, Q.jsx)(IB, {}),
              ],
            }),
    ],
  });
}
function AB({ open: t }) {
  let e = Y(),
    a = e.estate?.plots || {},
    r = e.estateMine;
  return (0, Q.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, Q.jsxs)("div", {
        className: "rounded-lg p-3 flex gap-3",
        style: { border: "1px solid var(--line)" },
        "data-soc": "starter",
        children: [
          (0, Q.jsx)("span", {
            className: "w-10 h-10 rounded-lg grid place-items-center text-black shrink-0",
            style: { background: Jt.color },
            children: (0, Q.jsx)(h0, {}),
          }),
          (0, Q.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, Q.jsxs)("div", { className: "text-sm font-bold", children: ["Tier 1 \xB7 ", Jt.name] }),
              (0, Q.jsxs)("div", {
                className: "text-[12px]",
                style: _r,
                children: [
                  Jt.tagline,
                  " \xB7 ",
                  (e.estate?.studios || 0).toLocaleString("en-US"),
                  " of ",
                  Vw.toLocaleString("en-US"),
                  " studios taken",
                ],
              }),
              (0, Q.jsxs)("div", {
                className: "flex gap-1.5 mt-1.5 flex-wrap",
                children: [
                  r?.studio
                    ? (0, Q.jsxs)("span", {
                        className: "text-[12px] font-bold",
                        style: { color: "#45e0ae" },
                        children: [(0, Q.jsx)(ho, { className: "inline" }), " Your studio: ", r.studio],
                      })
                    : (0, Q.jsxs)("button", {
                        id: "claim-studio",
                        className: "btn btn-primary btn-sm",
                        onClick: () => O.send({ t: "est_studio" }),
                        children: [(0, Q.jsx)(ho, {}), " Claim my free studio"],
                      }),
                  (0, Q.jsxs)("button", {
                    className: "btn btn-ghost btn-sm",
                    onClick: () => xa({ x: Jt.x, z: Jt.z - 66, face: { x: Jt.x, z: Jt.z } }),
                    children: [(0, Q.jsx)(dr, {}), " Go"],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      Gr.map((o) => {
        let n = RB[o.id],
          i = Al(o),
          s = i.filter((u) => a[u.id]).length,
          l = i.filter((u) => u.empty && !a[u.id]),
          c = i.filter((u) => a[u.id]?.sale || a[u.id]?.auction).length,
          d = i.filter((u) => a[u.id]?.rent && !a[u.id].rent.tenant).length,
          h = Math.min(...l.map((u) => u.price), 1 / 0);
        return (0, Q.jsxs)(
          "div",
          {
            className: "rounded-lg p-3 flex gap-3",
            style: { border: "1px solid var(--line)" },
            "data-soc": o.id,
            children: [
              (0, Q.jsx)("span", {
                className: "w-10 h-10 rounded-lg grid place-items-center text-black shrink-0",
                style: { background: o.color },
                children: (0, Q.jsx)(n, {}),
              }),
              (0, Q.jsxs)("div", {
                className: "flex-1 min-w-0",
                children: [
                  (0, Q.jsxs)("div", {
                    className: "text-sm font-bold",
                    children: [
                      "Tier ",
                      o.tier,
                      " \xB7 ",
                      o.name,
                      " ",
                      o.passport &&
                        (0, Q.jsxs)("span", {
                          className: "text-[10px] font-semibold px-1.5 py-0.5 rounded",
                          style: { background: "rgba(255,194,122,.18)", color: "#ffc27a" },
                          children: [(0, Q.jsx)(yr, { className: "inline" }), " passport only"],
                        }),
                    ],
                  }),
                  (0, Q.jsx)("div", { className: "text-[12px]", style: _r, children: o.tagline }),
                  (0, Q.jsxs)("div", {
                    className: "text-[11px] mt-1",
                    style: _r,
                    children: [
                      (o.count - o.empty).toLocaleString("en-US"),
                      " residents \xB7 ",
                      l.length,
                      " from the Land Office",
                      isFinite(h) ? ` from ${q(h)}` : "",
                      " \xB7 ",
                      c,
                      " resale/auction \xB7 ",
                      d,
                      " for rent \xB7 ",
                      s,
                      " citizen-owned",
                    ],
                  }),
                  (0, Q.jsxs)("div", {
                    className: "flex gap-1.5 mt-1.5",
                    children: [
                      (0, Q.jsxs)("button", {
                        className: "btn btn-primary btn-sm",
                        "data-open-soc": o.id,
                        onClick: () => t(o.id),
                        children: [(0, Q.jsx)(Xh, {}), " See plots"],
                      }),
                      (0, Q.jsxs)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => xa({ ...o.gate, face: o.gate.face }),
                        children: [(0, Q.jsx)(dr, {}), " Go to the gate"],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          },
          o.id,
        );
      }),
    ],
  });
}
function zB({ soc: t, back: e, open: a }) {
  let r = Y(),
    o = Mh(t),
    [n, i] = (0, $r.useState)("available"),
    s = (0, $r.useMemo)(() => (o ? Al(o) : []), [t]);
  if (!o) return null;
  let l = r.estate?.plots || {},
    c = r.net.id,
    d = s.filter((v) => {
      let g = df(v, l[v.id], c).key;
      return n === "all" || (n === "available" ? ["land", "sale", "auction", "rent"].includes(g) : g === n);
    }),
    h = 10,
    u = o.cols * h,
    p = o.rows * h;
  return (0, Q.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, Q.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: e,
        children: [(0, Q.jsx)(Qr, {}), " Societies"],
      }),
      (0, Q.jsx)("div", { className: "text-sm font-bold", children: o.name }),
      (0, Q.jsx)("svg", {
        viewBox: `0 0 ${u} ${p}`,
        className: "w-full rounded-md",
        style: { background: "#2f3a2f" },
        role: "img",
        "aria-label": `Plots of ${o.name}`,
        children: s.map((v, g) => {
          let m = df(v, l[v.id], c).key,
            f = m === "resident" ? "#6b7280" : m === "owned" ? "#cbd5e1" : ic[m];
          return (0, Q.jsx)(
            "rect",
            {
              x: (g % o.cols) * h + 1,
              y: Math.floor(g / o.cols) * h + 1,
              width: h - 2,
              height: h - 2,
              fill: f,
              rx: 1.5,
              style: { cursor: "pointer" },
              onClick: () => a(v.id),
              children: (0, Q.jsx)("title", { children: v.id }),
            },
            v.id,
          );
        }),
      }),
      (0, Q.jsx)("div", {
        className: "flex gap-2 flex-wrap text-[11px]",
        style: _r,
        children: [
          ["Land Office", ic.land],
          ["Auction", ic.auction],
          ["For rent", ic.rent],
          ["Yours", ic.mine],
          ["Citizen-owned", "#cbd5e1"],
          ["Resident", "#6b7280"],
        ].map(([v, g]) =>
          (0, Q.jsxs)(
            "span",
            {
              className: "flex items-center gap-1",
              children: [
                (0, Q.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm", style: { background: g } }),
                v,
              ],
            },
            v,
          ),
        ),
      }),
      (0, Q.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          ["available", "Available"],
          ["land", "Land Office"],
          ["auction", "Auctions"],
          ["rent", "For rent"],
          ["all", "All"],
        ].map(([v, g]) =>
          (0, Q.jsx)(
            "button",
            { className: `chip ${n === v ? "chip-on" : ""}`, onClick: () => i(v), children: g },
            v,
          ),
        ),
      }),
      (0, Q.jsxs)("div", {
        className: "space-y-1",
        children: [
          d.slice(0, 60).map((v) => {
            let g = df(v, l[v.id], c);
            return (0, Q.jsxs)(
              "button",
              {
                "data-plot": v.id,
                className:
                  "w-full text-left rounded-md px-2.5 py-1.5 flex items-center gap-2 text-[13px] card-hover",
                style: { border: "1px solid var(--line)" },
                onClick: () => a(v.id),
                children: [
                  (0, Q.jsx)("b", { className: "font-mono", children: v.id }),
                  v.seaFront &&
                    (0, Q.jsx)("span", {
                      className: "text-[10px]",
                      style: { color: "#45e0ae" },
                      children: "sea-front",
                    }),
                  (0, Q.jsx)("span", {
                    className: "flex-1 truncate text-right",
                    style: _r,
                    children: g.text,
                  }),
                ],
              },
              v.id,
            );
          }),
          d.length > 60 &&
            (0, Q.jsxs)("div", {
              className: "text-[11px]",
              style: _r,
              children: ["Showing 60 of ", d.length, ". Tap the map to pick any plot."],
            }),
        ],
      }),
    ],
  });
}
