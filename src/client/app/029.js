function Eu() {
  let t = Y(),
    [e, a] = (0, Ey.useState)("all"),
    [r, o] = (0, Ey.useState)(""),
    n = qa(t)
      .filter(
        (s) =>
          s.kind !== "vacant" &&
          (e === "all" || s.kind === e) &&
          (!r || (s.name + s.tagline).toLowerCase().includes(r.toLowerCase())),
      )
      .sort((s, l) => (s.row + s.slot < l.row + l.slot ? -1 : 1)),
    i = qa(t).filter((s) => s.kind === "vacant").length;
  return (0, pa.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, pa.jsxs)("button", {
        className: "w-full card card-hover p-3 flex items-center gap-3 text-left",
        onClick: () => It("openshop"),
        children: [
          (0, pa.jsx)(jo, { className: "text-xl", style: { color: "var(--accent)" } }),
          (0, pa.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, pa.jsx)("div", { className: "font-bold text-sm", children: "Open your own shop" }),
              (0, pa.jsxs)("div", {
                className: "text-[11px]",
                style: { color: "var(--ink-dim)" },
                children: [i, " units free on the street \xB7 your sign, your colours"],
              }),
            ],
          }),
        ],
      }),
      (0, pa.jsx)("input", {
        className: "field",
        value: r,
        onChange: (s) => o(s.target.value),
        placeholder: "Search shops\u2026",
        "aria-label": "Search shops",
      }),
      (0, pa.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: QR.map(([s, l]) =>
          (0, pa.jsx)(
            "button",
            { className: `chip ${e === s ? "chip-on" : ""}`, onClick: () => a(s), children: l },
            s,
          ),
        ),
      }),
      (0, pa.jsxs)("div", {
        className: "space-y-2",
        children: [
          n.map((s) => {
            let l = ri(s.id),
              c = l.history[l.history.length - 1] || 0;
            return (0, pa.jsxs)(
              "div",
              {
                className: "rounded-lg overflow-hidden flex",
                style: { border: "1px solid var(--line)" },
                children: [
                  (0, pa.jsx)("button", {
                    className: "w-24 shrink-0 grid place-items-center p-2 text-center",
                    style: { background: s.primary, color: s.secondary },
                    onClick: () => Pl(s.id),
                    "aria-label": `Open ${s.name}`,
                    children: (0, pa.jsx)("span", {
                      className: "leading-none break-words",
                      style: { font: Md(s.font, s.font === "display" ? 22 : 14) },
                      children: s.name.length > 18 ? s.name.slice(0, 17) + "\u2026" : s.name,
                    }),
                  }),
                  (0, pa.jsxs)("div", {
                    className: "flex-1 min-w-0 p-2.5",
                    children: [
                      (0, pa.jsx)("div", { className: "text-sm font-bold truncate", children: s.name }),
                      (0, pa.jsx)("div", {
                        className: "text-[11px] truncate",
                        style: { color: "var(--ink-dim)" },
                        children: s.tagline,
                      }),
                      (0, pa.jsxs)("div", {
                        className: "flex items-center gap-3 text-[11px] mt-1 tabular",
                        style: { color: "var(--ink-dim)" },
                        children: [
                          (0, pa.jsxs)("span", {
                            children: [
                              (0, pa.jsx)(si, { className: "inline -mt-0.5" }),
                              " ",
                              co(c),
                              " today",
                            ],
                          }),
                          (0, pa.jsxs)("span", {
                            children: [
                              (0, pa.jsx)(ko, { className: "inline -mt-0.5" }),
                              " ",
                              co(l.purchases),
                              " ",
                              s.kind === "game" ? "plays" : "sold",
                            ],
                          }),
                          (0, pa.jsxs)("span", { children: ["Unit ", s.row, s.slot + 1] }),
                        ],
                      }),
                    ],
                  }),
                  (0, pa.jsxs)("div", {
                    className: "flex flex-col justify-center gap-1 pr-2",
                    children: [
                      (0, pa.jsxs)("button", {
                        className: "btn btn-primary btn-sm",
                        onClick: () => xa(bo(s.id)),
                        children: [(0, pa.jsx)(da, {}), " Go"],
                      }),
                      (0, pa.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => ts(bo(s.id)),
                        children: (0, pa.jsx)(dr, {}),
                      }),
                    ],
                  }),
                ],
              },
              s.id,
            );
          }),
          !n.length &&
            (0, pa.jsx)("div", {
              className: "text-sm text-center py-6",
              style: { color: "var(--ink-dim)" },
              children: "No shops match.",
            }),
        ],
      }),
    ],
  });
}
var Yt = P(ct(), 1),
  tB = [
    ["geo", "Modern"],
    ["display", "Bold"],
    ["sans", "Clean"],
    ["serif", "Classic"],
    ["script", "Script"],
    ["mono", "Tech"],
  ];
function Ly() {
  let t = Y(),
    e = t.session.userId,
    a = qa(t).filter((r) => r.ownerId === e && r.kind !== "vacant");
  return a.length
    ? (0, Yt.jsxs)("div", {
        className: "space-y-4",
        children: [
          a.map((r) => {
            let o = ri(r.id),
              n = o.visits ? (o.purchases / o.visits) * 100 : 0,
              i = Math.max(...o.history, 1);
            return (0, Yt.jsxs)(
              "div",
              {
                className: "card overflow-hidden",
                children: [
                  (0, Yt.jsxs)("div", {
                    className: "p-4 flex items-center gap-3",
                    style: { background: r.primary },
                    children: [
                      (0, Yt.jsxs)("div", {
                        className: "flex-1 min-w-0",
                        children: [
                          (0, Yt.jsx)("div", {
                            className: "truncate leading-none",
                            style: { font: Md(r.font, r.font === "display" ? 34 : 22), color: r.secondary },
                            children: r.name,
                          }),
                          (0, Yt.jsxs)("div", {
                            className: "text-xs mt-1 truncate",
                            style: { color: r.secondary, opacity: 0.8 },
                            children: ["Unit ", r.row, r.slot + 1, " \xB7 ", r.kind],
                          }),
                        ],
                      }),
                      (0, Yt.jsx)("button", {
                        className: "btn btn-sm",
                        style: { background: "rgba(0,0,0,.25)", color: "#fff" },
                        onClick: () => Pl(r.id),
                        children: "Shop page",
                      }),
                      (0, Yt.jsx)("button", {
                        className: "btn btn-sm",
                        style: { background: "rgba(0,0,0,.25)", color: "#fff" },
                        onClick: () => xa(bo(r.id)),
                        children: (0, Yt.jsx)(da, {}),
                      }),
                    ],
                  }),
                  (0, Yt.jsxs)("div", {
                    className: "p-4 space-y-4",
                    children: [
                      (0, Yt.jsxs)("div", {
                        className: "grid grid-cols-4 gap-2",
                        children: [
                          (0, Yt.jsx)(Ra, { label: "Visits", value: co(o.visits) }),
                          (0, Yt.jsx)(Ra, { label: "Purchases", value: co(o.purchases) }),
                          (0, Yt.jsx)(Ra, { label: "Revenue", value: q(o.revenue) }),
                          (0, Yt.jsx)(Ra, { label: "Buy rate", value: `${n.toFixed(1)}%` }),
                        ],
                      }),
                      (0, Yt.jsxs)("div", {
                        children: [
                          (0, Yt.jsxs)("div", {
                            className: "text-[11px] font-bold uppercase tracking-wider mb-1.5",
                            style: { color: "var(--ink-dim)" },
                            children: [
                              (0, Yt.jsx)(si, { className: "inline -mt-0.5" }),
                              " Visitors \xB7 last 7 days",
                            ],
                          }),
                          (0, Yt.jsx)("div", {
                            className: "flex items-end gap-1 h-16",
                            children: o.history.map((s, l) =>
                              (0, Yt.jsx)(
                                "div",
                                {
                                  className: "flex-1 rounded-sm",
                                  title: `${s}`,
                                  style: {
                                    height: `${Math.max(6, (s / i) * 100)}%`,
                                    background:
                                      l === o.history.length - 1 ? "var(--accent)" : "rgba(255,255,255,.18)",
                                  },
                                },
                                l,
                              ),
                            ),
                          }),
                        ],
                      }),
                      (0, Yt.jsxs)("details", {
                        children: [
                          (0, Yt.jsx)("summary", {
                            className: "text-sm font-bold cursor-pointer",
                            children: "Edit branding",
                          }),
                          (0, Yt.jsxs)("div", {
                            className: "grid grid-cols-2 gap-3 mt-3",
                            children: [
                              (0, Yt.jsxs)("div", {
                                className: "col-span-2",
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Shop name" }),
                                  (0, Yt.jsx)("input", {
                                    className: "field",
                                    defaultValue: r.name,
                                    onBlur: (s) =>
                                      s.target.value.trim() && nd(r.id, { name: s.target.value.trim() }),
                                  }),
                                ],
                              }),
                              (0, Yt.jsxs)("div", {
                                className: "col-span-2",
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Tagline" }),
                                  (0, Yt.jsx)("input", {
                                    className: "field",
                                    defaultValue: r.tagline,
                                    onBlur: (s) => nd(r.id, { tagline: s.target.value.trim() }),
                                  }),
                                ],
                              }),
                              (0, Yt.jsxs)("div", {
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Sign colour" }),
                                  (0, Yt.jsx)("input", {
                                    type: "color",
                                    className: "w-full h-9 rounded",
                                    value: r.primary,
                                    onChange: (s) => nd(r.id, { primary: s.target.value }),
                                  }),
                                ],
                              }),
                              (0, Yt.jsxs)("div", {
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Text colour" }),
                                  (0, Yt.jsx)("input", {
                                    type: "color",
                                    className: "w-full h-9 rounded",
                                    value: r.secondary,
                                    onChange: (s) => nd(r.id, { secondary: s.target.value }),
                                  }),
                                ],
                              }),
                              (0, Yt.jsxs)("div", {
                                className: "col-span-2",
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Building colour" }),
                                  (0, Yt.jsx)("div", {
                                    className: "flex gap-1.5 flex-wrap",
                                    children: bi.map((s) =>
                                      (0, Yt.jsx)(
                                        "button",
                                        {
                                          "aria-label": s,
                                          onClick: () => nd(r.id, { facade: s }),
                                          className: "w-7 h-7 rounded",
                                          style: {
                                            background: s,
                                            boxShadow: r.facade === s ? "0 0 0 2px var(--accent)" : "none",
                                          },
                                        },
                                        s,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                              (0, Yt.jsxs)("div", {
                                className: "col-span-2",
                                children: [
                                  (0, Yt.jsx)("label", { className: "label", children: "Sign font" }),
                                  (0, Yt.jsx)("div", {
                                    className: "flex gap-1.5 flex-wrap",
                                    children: tB.map(([s, l]) =>
                                      (0, Yt.jsx)(
                                        "button",
                                        {
                                          className: `chip ${r.font === s ? "chip-on" : ""}`,
                                          style: { font: Md(s, 14) },
                                          onClick: () => nd(r.id, { font: s }),
                                          children: l,
                                        },
                                        s,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              },
              r.id,
            );
          }),
          (0, Yt.jsxs)("button", {
            className: "btn btn-ghost w-full",
            onClick: () => It("openshop"),
            children: [(0, Yt.jsx)(jo, {}), " Open another shop"],
          }),
          (0, Yt.jsxs)("div", {
            className: "text-[11px] flex gap-3",
            style: { color: "var(--ink-dim)" },
            children: [
              (0, Yt.jsxs)("span", {
                children: [(0, Yt.jsx)(ko, { className: "inline" }), " Sales go to your wallet"],
              }),
              (0, Yt.jsxs)("span", {
                children: [(0, Yt.jsx)(nE, { className: "inline" }), " Free to open during launch"],
              }),
              (0, Yt.jsxs)("span", {
                children: [(0, Yt.jsx)(Y8, { className: "inline" }), " Affiliates can promote you"],
              }),
            ],
          }),
        ],
      })
    : (0, Yt.jsxs)("div", {
        className: "card p-6 text-center space-y-3",
        children: [
          (0, Yt.jsx)(jo, { className: "mx-auto text-3xl", style: { color: "var(--accent)" } }),
          (0, Yt.jsx)("div", { className: "font-bold", children: "You don't have a shop yet" }),
          (0, Yt.jsx)("div", {
            className: "text-sm",
            style: { color: "var(--ink-dim)" },
            children:
              "Open one for your AI agent, your service or your products. You choose the sign, colours and font. Every visit and sale shows up here.",
          }),
          (0, Yt.jsx)("button", {
            className: "btn btn-primary",
            onClick: () => It("openshop"),
            children: "Open a shop",
          }),
        ],
      });
}
var An = P(Zt(), 1);
var qt = P(ct(), 1),
  i9 = [
    ["geo", "Modern"],
    ["display", "Bold"],
    ["sans", "Clean"],
    ["serif", "Classic"],
    ["script", "Script"],
    ["mono", "Tech"],
  ],
  eB = [
    ["agent", "AI agent", Nr, "Sell an AI agent with a free live demo"],
    ["service", "AI service", hr, "Offer packages, like a freelance studio"],
    ["brand", "Products", ko, "Sell products on 3D shelves"],
  ],
  aB = ["Research", "Productivity", "Voice", "Prompting", "Vision", "Video", "Coding", "Marketing"],
  s9 = null,
  rB = () =>
    s9 || (s9 = window.claude?.use ? window.claude.use("sample").catch(() => null) : Promise.resolve(null));
function Cy() {
  Y();
  let [t, e] = (0, An.useState)("agent"),
    [a, r] = (0, An.useState)(""),
    [o, n] = (0, An.useState)(""),
    [i, s] = (0, An.useState)("Research"),
    [l, c] = (0, An.useState)(29),
    [d, h] = (0, An.useState)(zs[0][0]),
    [u, p] = (0, An.useState)(zs[0][1]),
    [v, g] = (0, An.useState)(bi[0]),
    [m, f] = (0, An.useState)("geo"),
    [y, x] = (0, An.useState)(""),
    [k, b] = (0, An.useState)(!1),
    [w, L] = (0, An.useState)(),
    E = Gv(),
    T = t === "brand" ? gv : aB,
    S = async () => {
      b(!0);
      let N = await rB();
      try {
        if (!N) throw new Error("offline");
        let B = await N.json(
          `Design shop branding for a shop on a realistic city market street. Shop type: ${t}. Name: ${a || "(invent one)"}. Idea: ${y || o || i}. Return JSON: {"name": string (max 18 chars), "tagline": string (max 50 chars), "primary": hex sign background, "secondary": hex sign text colour with strong contrast, "facade": hex light building paint, "font": one of "geo","display","sans","serif","script","mono"}.`,
          { modelTier: "quick" },
        );
        (B?.name && !a && r(String(B.name).slice(0, 24)),
          B?.tagline && n(String(B.tagline).slice(0, 60)),
          /^#[0-9a-f]{6}$/i.test(B?.primary) && h(B.primary),
          /^#[0-9a-f]{6}$/i.test(B?.secondary) && p(B.secondary),
          /^#[0-9a-f]{6}$/i.test(B?.facade) && g(B.facade),
          i9.some(([X]) => X === B?.font) && f(B.font));
      } catch {
        let B = fv(y + " " + i),
          X = zs[Math.floor(Math.random() * zs.length)];
        (h(B.style === "minimal" ? X[0] : B.color),
          p(B.style === "minimal" ? X[1] : "#111111"),
          g(bi[Math.floor(Math.random() * bi.length)]),
          f(
            B.style === "luxury"
              ? "serif"
              : B.style === "neon"
                ? "display"
                : B.style === "nature"
                  ? "script"
                  : "geo",
          ));
      }
      b(!1);
    },
    H = () => {
      if (!a.trim() || !o.trim()) return F("Add a name and a tagline.", "warn");
      let N = u8({
        kind: t,
        name: a.trim(),
        tagline: o.trim(),
        category: i,
        price: Math.max(1, l),
        primary: d,
        secondary: u,
        facade: v,
        font: m,
        image: w,
      });
      if (N) {
        let B = ot(),
          X = qa(B).find((_) => _.id === N),
          M =
            t === "agent"
              ? B.agents.find((_) => `agent:${_.id}` === N)
              : t === "service"
                ? B.gigs.find((_) => `service:${_.id}` === N)
                : B.brands.find((_) => `brand:${_.id}` === N);
        (X &&
          ME(N, {
            kind: X.kind,
            refId: X.refId,
            row: X.row,
            slot: X.slot,
            name: X.name,
            tagline: X.tagline,
            primary: X.primary,
            secondary: X.secondary,
            facade: X.facade,
            font: X.font,
            ownerId: B.session.userId,
            item: M ? { ...M, products: M.products?.map((_) => ({ ..._, image: void 0 })) } : null,
          }),
          It("myshops"));
      }
    };
  return (0, qt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, qt.jsx)("div", {
        className: "text-sm",
        style: { color: "var(--ink-dim)" },
        children: E
          ? (0, qt.jsxs)(qt.Fragment, {
              children: [
                "Next free unit: ",
                (0, qt.jsxs)("b", { style: { color: "var(--ink)" }, children: [E.row, E.slot + 1] }),
                " on Fyrus Market. Free during launch.",
              ],
            })
          : "The street is full right now.",
      }),
      (0, qt.jsx)("div", {
        className: "grid grid-cols-3 gap-2",
        children: eB.map(([N, B, X, M]) =>
          (0, qt.jsxs)(
            "button",
            {
              onClick: () => {
                (e(N), s(N === "brand" ? gv[0] : "Research"));
              },
              className: "rounded-lg p-3 text-left",
              style: {
                border: `1px solid ${t === N ? "var(--accent)" : "var(--line)"}`,
                background: t === N ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "transparent",
              },
              children: [
                (0, qt.jsx)(X, { className: "text-lg mb-1" }),
                (0, qt.jsx)("div", { className: "text-sm font-bold", children: B }),
                (0, qt.jsx)("div", {
                  className: "text-[10px]",
                  style: { color: "var(--ink-dim)" },
                  children: M,
                }),
              ],
            },
            N,
          ),
        ),
      }),
      (0, qt.jsxs)("div", {
        className: "rounded-lg overflow-hidden",
        style: { background: v, padding: 14 },
        children: [
          (0, qt.jsxs)("div", {
            className: "rounded-md px-4 py-3 flex items-center gap-3",
            style: { background: d },
            children: [
              (0, qt.jsx)("div", {
                className: "w-10 h-10 rounded-full grid place-items-center font-bold shrink-0",
                style: { background: u, color: d },
                children: (a || "S")[0],
              }),
              (0, qt.jsxs)("div", {
                className: "min-w-0",
                children: [
                  (0, qt.jsx)("div", {
                    className: "truncate leading-none",
                    style: { font: Md(m, m === "display" ? 34 : 22), color: u },
                    children: a || "Your shop",
                  }),
                  (0, qt.jsx)("div", {
                    className: "text-[11px] truncate mt-1",
                    style: { color: u, opacity: 0.8 },
                    children: o || "Your tagline",
                  }),
                ],
              }),
            ],
          }),
          (0, qt.jsx)("div", {
            className: "h-10 mt-2 rounded-sm",
            style: { background: "linear-gradient(#2a3a48aa, #2a3a4866)" },
          }),
        ],
      }),
      (0, qt.jsxs)("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
          (0, qt.jsxs)("div", {
            className: "col-span-2",
            children: [
              (0, qt.jsx)("label", { className: "label", htmlFor: "os-name", children: "Shop name" }),
              (0, qt.jsx)("input", {
                id: "os-name",
                className: "field",
                value: a,
                onChange: (N) => r(N.target.value),
                maxLength: 24,
                placeholder:
                  t === "agent"
                    ? "e.g. PitchPilot"
                    : t === "service"
                      ? "e.g. Mira's Video Lab"
                      : "e.g. Kova Home",
              }),
            ],
          }),
          (0, qt.jsxs)("div", {
            className: "col-span-2",
            children: [
              (0, qt.jsx)("label", { className: "label", htmlFor: "os-tag", children: "Tagline" }),
              (0, qt.jsx)("input", {
                id: "os-tag",
                className: "field",
                value: o,
                onChange: (N) => n(N.target.value),
                maxLength: 60,
                placeholder:
                  t === "service"
                    ? "I will edit your product video with AI"
                    : "What do you sell, in one line?",
              }),
            ],
          }),
          (0, qt.jsxs)("div", {
            children: [
              (0, qt.jsx)("label", { className: "label", htmlFor: "os-cat", children: "Category" }),
              (0, qt.jsx)("select", {
                id: "os-cat",
                className: "field",
                value: i,
                onChange: (N) => s(N.target.value),
                children: T.map((N) => (0, qt.jsx)("option", { children: N }, N)),
              }),
            ],
          }),
          (0, qt.jsxs)("div", {
            children: [
              (0, qt.jsx)("label", {
                className: "label",
                htmlFor: "os-price",
                children:
                  t === "service" ? "Basic package ($)" : t === "brand" ? "Featured price ($)" : "Price ($)",
              }),
              (0, qt.jsx)("input", {
                id: "os-price",
                type: "number",
                min: 1,
                className: "field",
                value: l,
                onChange: (N) => c(Number(N.target.value)),
              }),
            ],
          }),
        ],
      }),
      (0, qt.jsxs)("div", {
        className: "card p-3 space-y-2",
        children: [
          (0, qt.jsx)("div", { className: "text-sm font-bold", children: "Branding" }),
          (0, qt.jsxs)("div", {
            className: "flex gap-2",
            children: [
              (0, qt.jsx)("input", {
                className: "field py-2 text-sm",
                value: y,
                onChange: (N) => x(N.target.value),
                placeholder: "Describe the vibe: calm wooden cafe, bold sports, luxury gold\u2026",
              }),
              (0, qt.jsxs)("button", {
                className: "btn btn-ghost btn-sm shrink-0",
                disabled: k,
                onClick: S,
                children: [(0, qt.jsx)(R8, {}), " ", k ? "Designing\u2026" : "Suggest"],
              }),
            ],
          }),
          (0, qt.jsxs)("div", {
            className: "grid grid-cols-3 gap-2",
            children: [
              (0, qt.jsxs)("div", {
                children: [
                  (0, qt.jsx)("label", { className: "label", children: "Sign" }),
                  (0, qt.jsx)("input", {
                    type: "color",
                    className: "w-full h-9 rounded",
                    value: d,
                    onChange: (N) => h(N.target.value),
                  }),
                ],
              }),
              (0, qt.jsxs)("div", {
                children: [
                  (0, qt.jsx)("label", { className: "label", children: "Text" }),
                  (0, qt.jsx)("input", {
                    type: "color",
                    className: "w-full h-9 rounded",
                    value: u,
                    onChange: (N) => p(N.target.value),
                  }),
                ],
              }),
              (0, qt.jsxs)("div", {
                children: [
                  (0, qt.jsx)("label", { className: "label", children: "Building" }),
                  (0, qt.jsx)("input", {
                    type: "color",
                    className: "w-full h-9 rounded",
                    value: v,
                    onChange: (N) => g(N.target.value),
                  }),
                ],
              }),
            ],
          }),
          (0, qt.jsx)("div", {
            className: "flex gap-1.5 flex-wrap",
            children: zs.map(([N, B]) =>
              (0, qt.jsx)(
                "button",
                {
                  "aria-label": `Sign ${N}`,
                  className: "w-8 h-6 rounded-sm",
                  style: {
                    background: `linear-gradient(90deg, ${N} 60%, ${B} 60%)`,
                    boxShadow: d === N ? "0 0 0 2px var(--accent)" : "none",
                  },
                  onClick: () => {
                    (h(N), p(B));
                  },
                },
                N + B,
              ),
            ),
          }),
          (0, qt.jsx)("div", {
            className: "flex gap-1.5 flex-wrap",
            children: i9.map(([N, B]) =>
              (0, qt.jsx)(
                "button",
                {
                  className: `chip ${m === N ? "chip-on" : ""}`,
                  style: { font: Md(N, 14) },
                  onClick: () => f(N),
                  children: B,
                },
                N,
              ),
            ),
          }),
          t === "brand" &&
            (0, qt.jsxs)("label", {
              className: "btn btn-ghost btn-sm w-fit cursor-pointer",
              children: [
                (0, qt.jsx)(eg, {}),
                " ",
                w ? "Photo added" : "Add a product photo",
                (0, qt.jsx)("input", {
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: (N) => {
                    let B = N.target.files?.[0];
                    if (!B) return;
                    let X = new FileReader();
                    ((X.onload = () => L(String(X.result))), X.readAsDataURL(B));
                  },
                }),
              ],
            }),
        ],
      }),
      (0, qt.jsx)("button", {
        className: "btn btn-primary w-full py-3",
        disabled: !E,
        onClick: H,
        children: "Open my shop",
      }),
    ],
  });
}
var Lu = P(Zt(), 1);
var Qs = null,
  Js = null,
  oB = () => {
    let t = ot();
    return t.users.find((e) => e.id === t.session?.userId)?.name || "Guest";
  },
  nB = (t) => C((e) => (e.dm ? { dm: { ...e.dm, msgs: [...e.dm.msgs, t].slice(-80) } } : {}));
async function tf(t, e) {
  if (Qs && Qs.name === t) {
    C((r) => ({ dm: r.dm || { room: t, withName: e, msgs: [], invited: [] } }));
    return;
  }
  (Ty(!0), C({ dm: { room: t, withName: e, msgs: [], invited: [] } }));
  let a = new tc(t, oB());
  ((a.onMessage = nB),
    (a.onPeers = (r) =>
      C((o) => (o.dm ? { dm: { ...o.dm, withName: r.join(", ") || o.dm.withName } } : {}))));
  try {
    (await a.join(), (Qs = a));
  } catch {
    F("Private chat works on the published page with friends who have it open.", "warn");
  }
}
function l9(t) {
  if (!Qs) return F("Not connected yet.", "warn");
  Qs.send(t);
}
function Ty(t = !1) {
  (Js?.stop(), (Js = null), Qs?.leave(), (Qs = null), t || C({ dm: null }));
}
function Sy(t, e, a = "chat") {
  let r = _t();
  if (!r) return;
  let o = ot().dm?.room,
    n = hx(r.presence, t, a, void 0, o || void 0);
  (o ? C((i) => (i.dm ? { dm: { ...i.dm, invited: [...i.dm.invited, e] } } : {})) : tf(n, e),
    F(`Invite sent to ${e}. Only people you invite can join.`, "info"),
    a === "call" && setTimeout(() => ef(!0), 600));
}
async function ef(t) {
  if (!Qs) return F("Open a private chat first.", "warn");
  (Js?.stop(),
    (Js = new Sg(Qs, t)),
    (Js.onStatus = (e) => {
      (C((a) => (a.dm ? { dm: { ...a.dm, call: e } } : {})),
        e === "no-mic" &&
          F(
            "Your browser did not give this page the microphone, so voice is off here. Text chat still works.",
            "warn",
          ));
    }),
    await Js.start());
}
function c9() {
  (Js?.stop(), (Js = null));
}
function d9(t) {
  Js?.setMuted(t);
}
function h9() {
  let t = ot().invite;
  if (t) {
    if ((C({ invite: null }), t.kind === "game" && t.game)) {
      C({ online: { game: t.game, room: t.room, host: !1, friend: t.fromName }, activeGame: t.game });
      return;
    }
    tf(t.room, t.fromName).then(() => {
      t.kind === "call" && ef(!1);
    });
  }
}
function u9(t, e, a) {
  let r = _t();
  if (!r) return;
  let o = hx(r.presence, t, "game", a);
  (C({ online: { game: a, room: o, host: !0, friend: e }, activeGame: a, hud: { ...ot().hud, open: !1 } }),
    F(`Invited ${e} to play. Waiting for them to accept\u2026`, "info"));
}
function Hy() {
  let t = _t();
  if (!t) return [];
  let e = [];
  return (
    t.presence.peers.forEach((a) =>
      e.push({
        peer: a.peer || a.id,
        name: a.name,
        color: a.color,
        real: !!a.real,
        photo: a.photo,
        scene: a.scene,
      }),
    ),
    e
  );
}
var ze = P(ct(), 1);
function Ny() {
  let t = Y(),
    [e, a] = (0, Lu.useState)(Hy()),
    [r, o] = (0, Lu.useState)("");
  return (
    (0, Lu.useEffect)(() => {
      let n = setInterval(() => a(Hy()), 1e3);
      return () => clearInterval(n);
    }, []),
    (0, ze.jsxs)("div", {
      className: "space-y-4",
      children: [
        (0, ze.jsxs)("div", {
          className: "card p-3 text-sm flex gap-2",
          style: { color: "var(--ink-dim)" },
          children: [
            (0, ze.jsx)(Pr, { className: "shrink-0 mt-0.5" }),
            " Private chats and calls happen in a room only you and the people you invite can join. Nobody else sees them.",
          ],
        }),
        (0, ze.jsxs)("div", {
          children: [
            (0, ze.jsxs)("div", {
              className: "text-[11px] font-bold uppercase tracking-wider mb-2",
              style: { color: "var(--ink-dim)" },
              children: [(0, ze.jsx)($e, { className: "inline -mt-0.5" }), " Online now \xB7 ", e.length],
            }),
            !e.length &&
              (0, ze.jsx)("div", {
                className: "card p-4 text-sm",
                style: { color: "var(--ink-dim)" },
                children:
                  "No one else is online right now. When friends open Fyrus City, they appear here and walking in the city. Share the page with them from the Share menu.",
              }),
            (0, ze.jsx)("div", {
              className: "space-y-2",
              children: e.map((n) =>
                (0, ze.jsxs)(
                  "div",
                  {
                    className: "rounded-lg p-2.5 flex items-center gap-3",
                    style: { border: "1px solid var(--line)" },
                    children: [
                      n.photo
                        ? (0, ze.jsx)("img", {
                            src: n.photo,
                            alt: "",
                            className: "w-10 h-10 rounded-full object-cover",
                          })
                        : (0, ze.jsx)("div", {
                            className: "w-10 h-10 rounded-full grid place-items-center font-bold",
                            style: { background: n.color, color: "#111" },
                            children: n.name[0],
                          }),
                      (0, ze.jsxs)("div", {
                        className: "flex-1 min-w-0",
                        children: [
                          (0, ze.jsx)("div", { className: "text-sm font-bold truncate", children: n.name }),
                          (0, ze.jsxs)("div", {
                            className: "text-[11px]",
                            style: { color: "var(--ink-dim)" },
                            children: [
                              n.scene === "plaza" ? "In the city" : "Inside a building",
                              n.real ? "" : " \xB7 another tab",
                            ],
                          }),
                        ],
                      }),
                      (0, ze.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => Sy(n.peer, n.name),
                        "aria-label": `Chat with ${n.name}`,
                        children: (0, ze.jsx)(Sn, {}),
                      }),
                      (0, ze.jsx)("button", {
                        className: "btn btn-ghost btn-sm",
                        onClick: () => Sy(n.peer, n.name, "call"),
                        "aria-label": `Call ${n.name}`,
                        children: (0, ze.jsx)(Ci, {}),
                      }),
                      (0, ze.jsxs)("select", {
                        className: "field w-auto py-1.5 text-xs",
                        defaultValue: "",
                        onChange: (i) => {
                          (i.target.value && u9(n.peer, n.name, i.target.value), (i.target.value = ""));
                        },
                        "aria-label": `Play with ${n.name}`,
                        children: [
                          (0, ze.jsx)("option", { value: "", children: "Play\u2026" }),
                          (0, ze.jsx)("option", { value: "chess", children: "Chess" }),
                          (0, ze.jsx)("option", { value: "connect4", children: "Four in a Row" }),
                          (0, ze.jsx)("option", { value: "race", children: "Street Race" }),
                        ],
                      }),
                    ],
                  },
                  n.peer,
                ),
              ),
            }),
          ],
        }),
        (0, ze.jsxs)("div", {
          className: "card p-3 space-y-2",
          children: [
            (0, ze.jsxs)("div", {
              className: "text-sm font-bold flex items-center gap-2",
              children: [(0, ze.jsx)(cg, {}), " Join with a private code"],
            }),
            (0, ze.jsx)("div", {
              className: "text-[11px]",
              style: { color: "var(--ink-dim)" },
              children: "A friend can share their chat code with you. Only people with the code can join.",
            }),
            (0, ze.jsxs)("div", {
              className: "flex gap-2",
              children: [
                (0, ze.jsx)("input", {
                  className: "field py-2 text-sm",
                  value: r,
                  onChange: (n) => o(n.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, "")),
                  placeholder: "p-xxxxxxxx",
                }),
                (0, ze.jsx)("button", {
                  className: "btn btn-primary btn-sm",
                  disabled: r.length < 6,
                  onClick: () => tf(r, "Friends"),
                  children: "Join",
                }),
              ],
            }),
            t.dm &&
              (0, ze.jsxs)("div", {
                className: "text-[11px]",
                style: { color: "var(--ink-dim)" },
                children: [
                  "Your current chat code: ",
                  (0, ze.jsx)("b", {
                    className: "font-mono",
                    style: { color: "var(--ink)" },
                    children: t.dm.room,
                  }),
                ],
              }),
          ],
        }),
        (0, ze.jsxs)("div", {
          className: "text-[11px] flex items-center gap-1.5",
          style: { color: "var(--ink-dim)" },
          children: [(0, ze.jsx)(on, {}), " Games with friends: Chess, Four in a Row and Street Race."],
        }),
      ],
    })
  );
}
var pc = P(Zt(), 1);
var Ve = P(ct(), 1);
function iB(t) {
  Q2({
    id: t.id,
    name: t.name,
    role: t.role,
    x: 0,
    z: 0,
    wander: 0,
    outfit: {
      skin: t.skin,
      hair: t.hair,
      hairColor: "#2a1a12",
      top: t.top,
      bottom: "#2b303a",
      shoes: "#efefef",
    },
    persona: t.custom
      ? `You are ${t.name}, a ${t.role} in Fyrus City (2040). Personality: ${t.style}. About you: ${t.bio}. Chat like a real person, short and natural.`
      : xp(t),
    greeting: t.greeting,
    quick: ["Tell me about yourself", "What do you do all day?", "Any advice for me?"],
  });
}
function Ry() {
  let t = Y(),
    [e, a] = (0, pc.useState)("all"),
    [r, o] = (0, pc.useState)(""),
    [n, i] = (0, pc.useState)(30),
    [s, l] = (0, pc.useState)(!1),
    c = (0, pc.useMemo)(
      () => [...t.aiCustom, ...(ot().sharedProfiles || []), ...Array.from({ length: mp }, (v, g) => vp(g))],
      [t.aiCustom, t.sharedProfiles],
    ),
    d = c.filter(
      (v) =>
        (e === "all" || v.category === e) &&
        (!r || `${v.name} ${v.role} ${v.city}`.toLowerCase().includes(r.toLowerCase())),
    ),
    [h, u] = (0, pc.useState)({
      name: "",
      category: "friends",
      role: "",
      style: "warm and funny",
      bio: "",
      greeting: "",
    }),
    p = () => {
      if (!h.name.trim() || !h.role.trim()) return;
      let v = {
        id: "aic-" + Date.now().toString(36),
        name: h.name.trim(),
        category: h.category,
        role: h.role.trim(),
        city: "Fyrus City",
        age: 25,
        bio: h.bio.trim() || `${h.role} in Fyrus City.`,
        style: h.style,
        greeting: h.greeting.trim() || `Hi, I'm ${h.name.trim()}!`,
        skin: "#c68e65",
        top: "#2f4f6f",
        hair: "short",
        custom: !0,
        ownerName: t.users.find((g) => g.id === t.session?.userId)?.name,
      };
      (g8(v), EE(v), l(!1), u({ ...h, name: "", role: "", bio: "", greeting: "" }));
    };
  return (0, Ve.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, Ve.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, Ve.jsxs)("div", {
            className: "flex-1 text-sm",
            style: { color: "var(--ink-dim)" },
            children: [
              (0, Ve.jsx)("b", {
                style: { color: "var(--ink)" },
                children: c.length.toLocaleString("en-US"),
              }),
              " AI people live in Fyrus City. Talk to anyone.",
            ],
          }),
          (0, Ve.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            onClick: () => l((v) => !v),
            children: [(0, Ve.jsx)(Na, {}), " Create one"],
          }),
        ],
      }),
      s &&
        (0, Ve.jsxs)("div", {
          className: "card p-3 space-y-2",
          children: [
            (0, Ve.jsxs)("div", {
              className: "text-sm font-bold flex items-center gap-1.5",
              children: [(0, Ve.jsx)(Ji, {}), " Create your own AI person"],
            }),
            (0, Ve.jsxs)("div", {
              className: "grid grid-cols-2 gap-2",
              children: [
                (0, Ve.jsx)("input", {
                  className: "field",
                  placeholder: "Name",
                  value: h.name,
                  onChange: (v) => u({ ...h, name: v.target.value }),
                  maxLength: 28,
                }),
                (0, Ve.jsx)("select", {
                  className: "field",
                  value: h.category,
                  onChange: (v) => u({ ...h, category: v.target.value }),
                  children: P2.map((v) => (0, Ve.jsx)("option", { value: v.id, children: v.label }, v.id)),
                }),
                (0, Ve.jsx)("input", {
                  className: "field",
                  placeholder: "What they do (e.g. Football coach)",
                  value: h.role,
                  onChange: (v) => u({ ...h, role: v.target.value }),
                  maxLength: 40,
                }),
                (0, Ve.jsx)("input", {
                  className: "field",
                  placeholder: "Personality (e.g. calm and funny)",
                  value: h.style,
                  onChange: (v) => u({ ...h, style: v.target.value }),
                  maxLength: 40,
                }),
                (0, Ve.jsx)("textarea", {
                  className: "field col-span-2",
                  placeholder: "About them",
                  value: h.bio,
                  onChange: (v) => u({ ...h, bio: v.target.value }),
                  maxLength: 240,
                }),
                (0, Ve.jsx)("input", {
                  className: "field col-span-2",
                  placeholder: "First thing they say",
                  value: h.greeting,
                  onChange: (v) => u({ ...h, greeting: v.target.value }),
                  maxLength: 120,
                }),
              ],
            }),
            (0, Ve.jsx)("button", {
              className: "btn btn-primary w-full",
              onClick: p,
              disabled: !h.name.trim() || !h.role.trim(),
              children: "Bring them to life",
            }),
          ],
        }),
      (0, Ve.jsxs)("div", {
        className: "relative",
        children: [
          (0, Ve.jsx)(Mi, { className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60" }),
          (0, Ve.jsx)("input", {
            className: "field pl-9",
            value: r,
            onChange: (v) => {
              (o(v.target.value), i(30));
            },
            placeholder: "Search by name, job or area\u2026",
            "aria-label": "Search AI people",
          }),
        ],
      }),
      (0, Ve.jsxs)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          (0, Ve.jsx)("button", {
            className: `chip ${e === "all" ? "chip-on" : ""}`,
            onClick: () => a("all"),
            children: "All",
          }),
          P2.map((v) =>
            (0, Ve.jsx)(
              "button",
              {
                className: `chip ${e === v.id ? "chip-on" : ""}`,
                onClick: () => {
                  (a(v.id), i(30));
                },
                children: v.label,
              },
              v.id,
            ),
          ),
        ],
      }),
      (0, Ve.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-2",
        children: d
          .slice(0, n)
          .map((v) =>
            (0, Ve.jsxs)(
              "button",
              {
                className: "rounded-lg p-2.5 flex items-center gap-3 text-left card-hover",
                style: { border: "1px solid var(--line)" },
                onClick: () => iB(v),
                children: [
                  (0, Ve.jsx)("div", {
                    className: "w-10 h-10 rounded-full grid place-items-center font-bold shrink-0",
                    style: { background: v.top, color: "#fff", boxShadow: `inset 0 0 0 3px ${v.skin}` },
                    children: v.name[0],
                  }),
                  (0, Ve.jsxs)("div", {
                    className: "flex-1 min-w-0",
                    children: [
                      (0, Ve.jsxs)("div", {
                        className: "text-sm font-bold truncate",
                        children: [v.name, v.custom ? " \u2726" : ""],
                      }),
                      (0, Ve.jsxs)("div", {
                        className: "text-[11px] truncate",
                        style: { color: "var(--ink-dim)" },
                        children: [v.role, " \xB7 ", v.city],
                      }),
                    ],
                  }),
                  (0, Ve.jsx)(Sn, { className: "shrink-0 opacity-70" }),
                ],
              },
              v.id,
            ),
          ),
      }),
      d.length > n &&
        (0, Ve.jsxs)("button", {
          className: "btn btn-ghost w-full",
          onClick: () => i((v) => v + 60),
          children: ["Show more (", (d.length - n).toLocaleString("en-US"), " left)"],
        }),
    ],
  });
}
var p9 = P(Zt(), 1);
var $t = P(ct(), 1);
function By() {
  let t = Y(),
    [e, a] = (0, p9.useState)("cars"),
    r = t.wallets[t.session.userId] || 0;
  return (0, $t.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, $t.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, $t.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, $t.jsx)("div", { className: "text-sm font-bold", children: "Live the life you want" }),
              (0, $t.jsxs)("div", {
                className: "text-[11px]",
                style: { color: "var(--ink-dim)" },
                children: [
                  "Everything here uses Fyrus Coin (FYC), the in-city credit. Balance: ",
                  (0, $t.jsx)("b", { style: { color: "var(--ink)" }, children: q(r) }),
                ],
              }),
            ],
          }),
          (0, $t.jsx)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => Z2(5e4),
            children: "+ 50,000 FYC (demo)",
          }),
        ],
      }),
      (0, $t.jsx)("div", {
        className: "flex gap-1",
        children: [
          ["cars", "Cars", d0],
          ["homes", "Homes", Ma],
          ["life", "Lifestyle", pg],
        ].map(([o, n, i]) =>
          (0, $t.jsxs)(
            "button",
            {
              className: `chip ${e === o ? "chip-on" : ""}`,
              onClick: () => a(o),
              children: [(0, $t.jsx)(i, {}), " ", n],
            },
            o,
          ),
        ),
      }),
      e === "cars" &&
        (0, $t.jsxs)($t.Fragment, {
          children: [
            (0, $t.jsxs)("div", {
              className: "flex gap-2",
              children: [
                (0, $t.jsxs)("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: Vs,
                  children: [(0, $t.jsx)(ho, {}), " Drive my car (F)"],
                }),
                (0, $t.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => xa(bo("dream:motors")),
                  children: "Visit Fyrus Motors",
                }),
              ],
            }),
            (0, $t.jsx)("div", {
              className: "grid sm:grid-cols-2 gap-2",
              children: Xr.map((o) => {
                let n = t.dream.cars.includes(o.id),
                  i = t.dream.car === o.id;
                return (0, $t.jsxs)(
                  "div",
                  {
                    className: "rounded-lg p-3",
                    style: { border: `1px solid ${i ? "var(--accent)" : "var(--line)"}` },
                    children: [
                      (0, $t.jsxs)("div", {
                        className: "h-16 rounded-md mb-2 relative overflow-hidden",
                        style: { background: "linear-gradient(#3a3f46,#1d2024)" },
                        children: [
                          (0, $t.jsx)("div", {
                            className:
                              "absolute left-1/2 -translate-x-1/2 bottom-3 rounded-[40%_40%_12px_12px]",
                            style: {
                              width: o.body === "super" || o.body === "sports" ? 120 : 104,
                              height: o.body === "suv" || o.body === "pickup" ? 34 : 24,
                              background: o.color,
                              boxShadow: "inset 0 -6px 0 rgba(0,0,0,.25)",
                            },
                          }),
                          (0, $t.jsx)("div", {
                            className:
                              "absolute bottom-1.5 left-[calc(50%-40px)] w-4 h-4 rounded-full bg-black",
                          }),
                          (0, $t.jsx)("div", {
                            className:
                              "absolute bottom-1.5 left-[calc(50%+24px)] w-4 h-4 rounded-full bg-black",
                          }),
                          o.fly &&
                            (0, $t.jsx)("span", {
                              className: "absolute top-1 right-1 chip",
                              children: "Flies",
                            }),
                        ],
                      }),
                      (0, $t.jsx)("div", { className: "text-sm font-bold", children: o.name }),
                      (0, $t.jsxs)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: [o.maker, " \xB7 ", Math.round(o.top * 3.6), " km/h \xB7 ", o.desc],
                      }),
                      (0, $t.jsxs)("div", {
                        className: "flex items-center gap-2 mt-2",
                        children: [
                          (0, $t.jsx)("span", {
                            className: "text-sm font-bold tabular flex-1",
                            children: o.price ? q(o.price) : "Free",
                          }),
                          n
                            ? i
                              ? (0, $t.jsxs)("span", {
                                  className: "chip chip-on",
                                  children: [(0, $t.jsx)(_e, {}), " Driving"],
                                })
                              : (0, $t.jsx)("button", {
                                  className: "btn btn-ghost btn-sm",
                                  onClick: () => tu(o.id),
                                  children: "Use",
                                })
                            : (0, $t.jsxs)($t.Fragment, {
                                children: [
                                  (0, $t.jsx)("button", {
                                    className: "btn btn-ghost btn-sm",
                                    onClick: () => _p(o.id),
                                    children: "Test drive",
                                  }),
                                  (0, $t.jsx)("button", {
                                    className: "btn btn-primary btn-sm",
                                    onClick: () => id("car", o.id),
                                    children: "Buy",
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
            }),
          ],
        }),
      e === "homes" &&
        (0, $t.jsx)("div", {
          className: "grid sm:grid-cols-2 gap-2",
          children: Qn.map((o) => {
            let n = t.dream.homes.includes(o.id),
              i = t.dream.home === o.id;
            return (0, $t.jsxs)(
              "div",
              {
                className: "rounded-lg p-3",
                style: { border: `1px solid ${i ? "var(--accent)" : "var(--line)"}` },
                children: [
                  (0, $t.jsx)("div", {
                    className: "h-16 rounded-md mb-2 grid place-items-end justify-center pb-2",
                    role: "button",
                    title: "View in 3D",
                    onClick: () => window.__fyrusHome3D?.open({ mode: "catalogue", start: o.id }),
                    style: { background: "linear-gradient(#9cc3e6,#d9e8f2)", cursor: "pointer" },
                    children: (0, $t.jsx)("div", {
                      style: {
                        width: 70,
                        height: 14 + o.floors * 5,
                        background: o.theme,
                        boxShadow: "inset 0 -4px 0 rgba(0,0,0,.15)",
                      },
                    }),
                  }),
                  (0, $t.jsx)("div", { className: "text-sm font-bold", children: o.name }),
                  (0, $t.jsxs)("div", {
                    className: "text-[11px]",
                    style: { color: "var(--ink-dim)" },
                    children: [o.floors, " floors \xB7 ", o.desc],
                  }),
                  (0, $t.jsxs)("div", {
                    className: "flex items-center gap-2 mt-2",
                    children: [
                      (0, $t.jsx)("span", {
                        className: "text-sm font-bold tabular flex-1",
                        children: o.price ? q(o.price) : "Free",
                      }),
                      window.__fyrusHome3D &&
                        (0, $t.jsx)("button", {
                          className: "btn btn-ghost btn-sm",
                          "data-home3d": o.id,
                          onClick: () => window.__fyrusHome3D.open({ mode: "catalogue", start: o.id }),
                          children: "3D",
                        }),
                      n
                        ? i
                          ? (0, $t.jsxs)("span", {
                              className: "chip chip-on",
                              children: [(0, $t.jsx)(_e, {}), " Living here"],
                            })
                          : (0, $t.jsx)("button", {
                              className: "btn btn-ghost btn-sm",
                              onClick: () => eu(o.id),
                              children: "Move in",
                            })
                        : (0, $t.jsx)("button", {
                            className: "btn btn-primary btn-sm",
                            onClick: () => id("home", o.id),
                            children: "Buy",
                          }),
                    ],
                  }),
                ],
              },
              o.id,
            );
          }),
        }),
      e === "life" &&
        (0, $t.jsx)("div", {
          className: "grid sm:grid-cols-2 gap-2",
          children: fp.map((o) => {
            let n = t.dream.life.includes(o.id);
            return (0, $t.jsxs)(
              "div",
              {
                className: "rounded-lg p-3 flex gap-3",
                style: { border: "1px solid var(--line)" },
                children: [
                  (0, $t.jsx)("div", { className: "text-3xl", children: o.icon }),
                  (0, $t.jsxs)("div", {
                    className: "flex-1",
                    children: [
                      (0, $t.jsx)("div", { className: "text-sm font-bold", children: o.name }),
                      (0, $t.jsx)("div", {
                        className: "text-[11px]",
                        style: { color: "var(--ink-dim)" },
                        children: o.desc,
                      }),
                      (0, $t.jsxs)("div", {
                        className: "flex items-center gap-2 mt-2",
                        children: [
                          (0, $t.jsx)("span", {
                            className: "text-sm font-bold tabular flex-1",
                            children: q(o.price),
                          }),
                          n
                            ? (0, $t.jsxs)("span", {
                                className: "chip chip-on",
                                children: [(0, $t.jsx)(_e, {}), " Owned"],
                              })
                            : (0, $t.jsx)("button", {
                                className: "btn btn-primary btn-sm",
                                onClick: () => id("life", o.id),
                                children: "Buy",
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
        }),
    ],
  });
}
var go = P(Zt(), 1);
var Ai = P(Zt(), 1);
var za = P(ct(), 1),
  sB = "https://fyrus.io",
  zy = (t) => {
    let e = t.users.find((a) => a.id === t.session?.userId);
    return `${sB}/?ref=${encodeURIComponent(e?.handle || e?.id || "fyrus")}`;
  },
  Ay = null,
  g9 = (t) => {
    let e = t.session ? t.passports[t.session.userId] : void 0;
    return oi(e) ? "CITIZEN" : e ? "OFFICIAL VISITOR" : "VISITOR";
  };
