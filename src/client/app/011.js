function PH({ initial: t }) {
  let e = Y(),
    a = e.adsNet,
    [r, o] = (0, Io.useState)(t),
    [n, i] = (0, Io.useState)(),
    s = (0, Io.useRef)(null),
    [l, c] = (0, Io.useState)({
      brand: e.users.find((m) => m.id === e.session?.userId)?.name || "",
      headline: "",
      color: "#ff9a3c",
      days: 7,
      category: "Brand",
    });
  if (
    ((0, Io.useEffect)(() => {
      (O.send({ t: "ads_state" }), O.send({ t: "ads_mine" }));
    }, []),
    !a)
  )
    return (0, ut.jsx)("div", {
      className: "card p-4 text-sm",
      style: { color: "var(--ink-dim)" },
      children: "Loading billboards\u2026",
    });
  let d = ki.find((m) => m.id === r) || ki[0],
    h = a.live.find((m) => m.spot === d.id),
    u = a.next[d.id] || Date.now(),
    p = ev(d.id, l.days),
    v = e.bank?.bal ?? 0,
    g = { color: "var(--ink-dim)" };
  return (0, ut.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, ut.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, ut.jsx)(Or, { style: { color: "var(--ember-hi)" } }),
          (0, ut.jsxs)("div", {
            className: "flex-1 text-xs",
            style: g,
            children: [
              (0, ut.jsx)("b", { style: { color: "var(--ink)" }, children: "Official Fyrus billboards." }),
              " Paid by the day; the money goes to the National Treasury. Billboard revenue so far: ",
              (0, ut.jsx)("b", {
                className: "tabular",
                style: { color: "var(--ink)" },
                children: q(a.revenue),
              }),
            ],
          }),
        ],
      }),
      (0, ut.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, ut.jsx)("div", { className: "text-sm font-bold mb-2", children: "1 \xB7 Pick a billboard" }),
          (0, ut.jsx)("div", {
            className: "grid grid-cols-2 gap-2",
            children: ki.map((m) => {
              let f = a.live.find((x) => x.spot === m.id),
                y = a.next[m.id];
              return (0, ut.jsxs)(
                "button",
                {
                  "data-spot": m.id,
                  className: `card p-2.5 text-left ${r === m.id ? "chip-on" : ""}`,
                  onClick: () => o(m.id),
                  children: [
                    (0, ut.jsxs)("div", {
                      className: "text-sm font-bold flex justify-between gap-1",
                      children: [
                        (0, ut.jsx)("span", { className: "truncate", children: m.name }),
                        (0, ut.jsxs)("span", {
                          className: "tabular text-[11px]",
                          style: { color: "var(--ember-hi)" },
                          children: [q(a.prices[m.id] || 0), "/day"],
                        }),
                      ],
                    }),
                    (0, ut.jsxs)("div", {
                      className: "text-[11px] flex items-center gap-1",
                      style: g,
                      children: [
                        (0, ut.jsx)(si, {}),
                        " ",
                        m.views,
                        f ? ` \xB7 ${f.brand}, free in ${Cg(y)}` : " \xB7 free now",
                      ],
                    }),
                  ],
                },
                m.id,
              );
            }),
          }),
          (0, ut.jsxs)("button", {
            className: "btn btn-ghost btn-sm mt-3",
            onClick: () => {
              (C({ scene: { mode: "plaza" } }),
                _t()?.teleport({ x: d.x + Math.sin(d.ry) * 16, z: d.z + Math.cos(d.ry) * 16 }),
                ca());
            },
            children: [(0, ut.jsx)(da, {}), " Look at this spot"],
          }),
        ],
      }),
      (0, ut.jsxs)("form", {
        className: "card p-4 space-y-3",
        onSubmit: (m) => {
          (m.preventDefault(),
            O.send({
              t: "ad_book",
              spot: d.id,
              brand: l.brand,
              headline: l.headline,
              color: l.color,
              category: l.category,
              days: l.days,
              image: n,
            }),
            i(void 0),
            c({ ...l, headline: "" }));
        },
        children: [
          (0, ut.jsxs)("div", { className: "text-sm font-bold", children: ["2 \xB7 Your ad on ", d.name] }),
          (0, ut.jsxs)("div", {
            children: [
              (0, ut.jsx)("div", { className: "label", children: "Category" }),
              (0, ut.jsx)("div", {
                className: "flex gap-1 flex-wrap",
                children: uv.map((m) =>
                  (0, ut.jsx)(
                    "button",
                    {
                      type: "button",
                      className: `chip ${l.category === m ? "chip-on" : ""}`,
                      onClick: () => c({ ...l, category: m }),
                      children: m,
                    },
                    m,
                  ),
                ),
              }),
            ],
          }),
          (0, ut.jsxs)("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              (0, ut.jsxs)("div", {
                children: [
                  (0, ut.jsx)("label", { className: "label", htmlFor: "ad-brand", children: "Name" }),
                  (0, ut.jsx)("input", {
                    id: "ad-brand",
                    className: "field",
                    maxLength: 30,
                    value: l.brand,
                    onChange: (m) => c({ ...l, brand: m.target.value }),
                    placeholder: "Brand, shop or your name",
                  }),
                ],
              }),
              (0, ut.jsxs)("div", {
                children: [
                  (0, ut.jsx)("label", { className: "label", htmlFor: "ad-days", children: "Days" }),
                  (0, ut.jsx)("select", {
                    id: "ad-days",
                    className: "field",
                    value: l.days,
                    onChange: (m) => c({ ...l, days: Number(m.target.value) }),
                    children: vw.map((m) =>
                      (0, ut.jsxs)(
                        "option",
                        { value: m, children: [m, " day", m > 1 ? "s" : "", " \xB7 ", q(ev(d.id, m))] },
                        m,
                      ),
                    ),
                  }),
                ],
              }),
            ],
          }),
          (0, ut.jsxs)("div", {
            children: [
              (0, ut.jsx)("label", {
                className: "label",
                htmlFor: "ad-head",
                children: "Headline (big, readable)",
              }),
              (0, ut.jsx)("input", {
                id: "ad-head",
                className: "field",
                maxLength: 26,
                value: l.headline,
                onChange: (m) => c({ ...l, headline: m.target.value }),
                placeholder: "Grand opening today",
              }),
            ],
          }),
          (0, ut.jsxs)("div", {
            children: [
              (0, ut.jsx)("div", { className: "label", children: "Colour" }),
              (0, ut.jsx)("div", {
                className: "flex gap-2",
                children: TE.map((m) =>
                  (0, ut.jsx)(
                    "button",
                    {
                      type: "button",
                      "aria-label": `Colour ${m}`,
                      onClick: () => c({ ...l, color: m }),
                      className: "w-8 h-8 rounded-md",
                      style: {
                        background: m,
                        outline: l.color === m ? "2px solid var(--accent)" : "none",
                        outlineOffset: 2,
                      },
                    },
                    m,
                  ),
                ),
              }),
            ],
          }),
          (0, ut.jsx)("input", {
            ref: s,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: (m) => {
              let f = m.target.files?.[0];
              f && VH(f, (y) => (y ? i(y) : alert("That image could not be used. Try a JPEG or PNG.")));
            },
          }),
          (0, ut.jsxs)("div", {
            className: "flex gap-2 flex-wrap",
            children: [
              (0, ut.jsxs)("button", {
                type: "button",
                className: "btn btn-ghost btn-sm",
                onClick: () => s.current?.click(),
                children: [(0, ut.jsx)(ex, {}), " ", n ? "Change poster" : "Poster image"],
              }),
              n &&
                (0, ut.jsx)("button", {
                  type: "button",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => i(void 0),
                  children: "Remove poster",
                }),
            ],
          }),
          (0, ut.jsxs)("div", {
            className: "rounded-md overflow-hidden relative aspect-video",
            style: { background: n ? `url(${n}) center/cover` : "#f4f1ea", border: "6px solid #1d1f22" },
            children: [
              (0, ut.jsx)("div", {
                className:
                  "absolute top-0 inset-x-0 h-5 flex items-center gap-1.5 px-2 text-[10px] font-bold text-white",
                style: { background: "#12355e" },
                children: "\u25CF FYRUS CITY",
              }),
              (0, ut.jsxs)("div", {
                className: "absolute inset-x-0 bottom-0 p-4",
                style: { background: n ? "linear-gradient(transparent, rgba(0,0,0,.7))" : "transparent" },
                children: [
                  (0, ut.jsx)("div", {
                    className: "text-xs font-bold uppercase",
                    style: { color: n ? "#fff" : l.color },
                    children: l.brand || "Your name",
                  }),
                  (0, ut.jsx)("div", {
                    className: "font-display text-2xl font-extrabold",
                    style: { color: n ? "#fff" : "#111" },
                    children: l.headline || "Your headline here",
                  }),
                  (0, ut.jsxs)("div", {
                    className: "text-[10px]",
                    style: { color: n ? "rgba(255,255,255,.7)" : "#666" },
                    children: [l.category, " \xB7 Sponsored"],
                  }),
                ],
              }),
            ],
          }),
          (0, ut.jsxs)("div", {
            className: "text-[11px] flex items-center gap-1.5",
            style: g,
            children: [
              (0, ut.jsx)(li, {}),
              " ",
              h
                ? `Now showing ${h.brand}. Yours starts in ${Cg(u)} (bookings queue up).`
                : "This billboard is free: your ad goes live right away.",
              " Video ads are not on the live city yet.",
            ],
          }),
          (0, ut.jsx)("button", {
            id: "ad-book",
            className: "btn btn-primary w-full",
            disabled: !l.brand.trim() || l.headline.trim().length < 3 || v < p,
            children: v < p ? `You need ${q(p)}` : `Book ${l.days} day${l.days > 1 ? "s" : ""} \xB7 ${q(p)}`,
          }),
        ],
      }),
      !!e.adsMine?.length &&
        (0, ut.jsxs)("div", {
          className: "card p-4 space-y-2",
          children: [
            (0, ut.jsx)("div", { className: "text-sm font-bold", children: "My bookings" }),
            e.adsMine.map((m) =>
              (0, ut.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 text-xs",
                  children: [
                    (0, ut.jsxs)("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        (0, ut.jsx)("b", { children: m.headline }),
                        " ",
                        (0, ut.jsxs)("span", {
                          style: g,
                          children: [
                            "\xB7 ",
                            ki.find((f) => f.id === m.spot)?.name,
                            " \xB7 ",
                            m.removed
                              ? m.removed
                              : m.end < Date.now()
                                ? "ended"
                                : m.start > Date.now()
                                  ? `starts in ${Cg(m.start)}`
                                  : `live, ends in ${Cg(m.end)}`,
                            " \xB7 ",
                            q(m.paid),
                          ],
                        }),
                      ],
                    }),
                    !m.removed &&
                      m.start > Date.now() &&
                      (0, ut.jsxs)("button", {
                        className: "btn btn-ghost btn-xs",
                        onClick: () => O.send({ t: "ad_cancel", id: m.id }),
                        children: [(0, ut.jsx)(pe, {}), " Cancel (refund)"],
                      }),
                  ],
                },
                m.id,
              ),
            ),
          ],
        }),
    ],
  });
}
var rc = P(Zt(), 1);
var kr = P(Zt(), 1);
var wo = P(ct(), 1),
  g0 = "#4da3ff",
  f0 = "#ff9a3c",
  OH = "#a8d8ff",
  cx = "#06102b";
function SE() {
  let t = (0, kr.useRef)(new Set());
  return (
    (0, kr.useEffect)(() => {
      let e = (r) => {
          r.key !== "Escape" &&
            (t.current.add(r.key.toLowerCase()),
            ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(r.key.toLowerCase()) &&
              r.preventDefault(),
            r.stopPropagation());
        },
        a = (r) => {
          (t.current.delete(r.key.toLowerCase()), r.stopPropagation());
        };
      return (
        window.addEventListener("keydown", e, !0),
        window.addEventListener("keyup", a, !0),
        () => {
          (window.removeEventListener("keydown", e, !0), window.removeEventListener("keyup", a, !0));
        }
      );
    }, []),
    t
  );
}
function HE(t) {
  let e = (0, kr.useRef)(t);
  ((e.current = t),
    (0, kr.useEffect)(() => {
      let a = 0,
        r = performance.now(),
        o = !0,
        n = (i) => {
          if (!o) return;
          let s = Math.min(0.033, (i - r) / 1e3);
          ((r = i), e.current(s) !== !1 && (a = requestAnimationFrame(n)));
        };
      return (
        (a = requestAnimationFrame(n)),
        () => {
          ((o = !1), cancelAnimationFrame(a));
        }
      );
    }, []));
}
var Tg = (t, e, a, r, o) => {
  ((t.shadowColor = o),
    (t.shadowBlur = 24),
    (t.fillStyle = o),
    t.beginPath(),
    t.arc(e, a, r, 0, Math.PI * 2),
    t.fill(),
    (t.shadowBlur = 0));
};
function NE({ mode: t, p1: e, p2: a, onEnd: r }) {
  let o = (0, kr.useRef)(null),
    n = SE(),
    i = 900,
    s = 520,
    l = 30,
    c = 16,
    d = 160,
    h = (0, kr.useRef)({
      a: { x: 140, y: s / 2, vx: 0, vy: 0 },
      b: { x: i - 140, y: s / 2, vx: 0, vy: 0 },
      ball: { x: i / 2, y: s / 2, vx: 260, vy: 120 },
      sa: 0,
      sb: 0,
      flash: 0,
      done: !1,
      mouse: null,
    });
  return (
    (0, kr.useEffect)(() => {
      let u = o.current,
        p = (v) => {
          let g = u.getBoundingClientRect();
          h.current.mouse = {
            x: ((v.clientX - g.left) / g.width) * i,
            y: ((v.clientY - g.top) / g.height) * s,
          };
        };
      return (u.addEventListener("pointermove", p), () => u.removeEventListener("pointermove", p));
    }, []),
    HE((u) => {
      let p = h.current,
        v = n.current,
        g = o.current?.getContext("2d");
      if (!g || p.done) return !1;
      let m = (x, k, b, w, L, E, T) => {
        let H = x.x,
          N = x.y;
        (v.has(k) && (x.y -= 520 * u),
          v.has(b) && (x.y += 520 * u),
          v.has(w) && (x.x -= 520 * u),
          v.has(L) && (x.x += 520 * u),
          (x.x = Math.max(E + l, Math.min(T - l, x.x))),
          (x.y = Math.max(l, Math.min(s - l, x.y))),
          (x.vx = (x.x - H) / u),
          (x.vy = (x.y - N) / u));
      };
      if (p.mouse && t === "ai") {
        let x = p.a.x,
          k = p.a.y;
        ((p.a.x += (Math.max(l, Math.min(i / 2 - l, p.mouse.x)) - p.a.x) * 0.35),
          (p.a.y += (Math.max(l, Math.min(s - l, p.mouse.y)) - p.a.y) * 0.35),
          (p.a.vx = (p.a.x - x) / u),
          (p.a.vy = (p.a.y - k) / u));
      }
      if ((m(p.a, "w", "s", "a", "d", 0, i / 2), t === "2p"))
        m(p.b, "arrowup", "arrowdown", "arrowleft", "arrowright", i / 2, i);
      else {
        let x = p.b.x,
          k = p.b.y,
          b = p.ball.x > i / 2 ? p.ball.x + 20 : i - 120,
          w = p.ball.y,
          L = 330 * u;
        ((p.b.x += Math.max(-L, Math.min(L, b - p.b.x))),
          (p.b.y += Math.max(-L, Math.min(L, w - p.b.y))),
          (p.b.x = Math.max(i / 2 + l, Math.min(i - l, p.b.x))),
          (p.b.y = Math.max(l, Math.min(s - l, p.b.y))),
          (p.b.vx = (p.b.x - x) / u),
          (p.b.vy = (p.b.y - k) / u));
      }
      let f = p.ball;
      ((f.x += f.vx * u),
        (f.y += f.vy * u),
        (f.vx *= 0.997),
        (f.vy *= 0.997),
        f.y < c && ((f.y = c), (f.vy = Math.abs(f.vy))),
        f.y > s - c && ((f.y = s - c), (f.vy = -Math.abs(f.vy))));
      let y = Math.abs(f.y - s / 2) < d / 2;
      if (
        (f.x < c && !y && ((f.x = c), (f.vx = Math.abs(f.vx))),
        f.x > i - c && !y && ((f.x = i - c), (f.vx = -Math.abs(f.vx))),
        [p.a, p.b].forEach((x) => {
          let k = f.x - x.x,
            b = f.y - x.y,
            w = Math.hypot(k, b);
          if (w < l + c && w > 0) {
            let L = k / w,
              E = b / w;
            ((f.x = x.x + L * (l + c)), (f.y = x.y + E * (l + c)));
            let T = (f.vx - x.vx) * L + (f.vy - x.vy) * E;
            (T < 0 && ((f.vx -= 1.9 * T * L), (f.vy -= 1.9 * T * E)),
              (f.vx += x.vx * 0.25),
              (f.vy += x.vy * 0.25));
            let S = Math.hypot(f.vx, f.vy);
            S > 1100 && ((f.vx *= 1100 / S), (f.vy *= 1100 / S));
          }
        }),
        (f.x < -c || f.x > i + c) &&
          (f.x < 0 ? p.sb++ : p.sa++,
          (p.flash = 1),
          Object.assign(f, {
            x: i / 2,
            y: s / 2,
            vx: (f.x < 0 ? -1 : 1) * 240,
            vy: (Math.random() - 0.5) * 240,
          }),
          p.sa >= 5 || p.sb >= 5))
      ) {
        p.done = !0;
        let x = p.sa > p.sb;
        setTimeout(() => r(p.sa * 10, x, `${e} ${p.sa} \u2013 ${p.sb} ${a}`), 400);
      }
      ((p.flash = Math.max(0, p.flash - u * 2)),
        (g.fillStyle = cx),
        g.fillRect(0, 0, i, s),
        (g.strokeStyle = "rgba(77,163,255,.35)"),
        (g.lineWidth = 3),
        g.strokeRect(4, 4, i - 8, s - 8),
        g.beginPath(),
        g.moveTo(i / 2, 0),
        g.lineTo(i / 2, s),
        g.stroke(),
        g.beginPath(),
        g.arc(i / 2, s / 2, 70, 0, Math.PI * 2),
        g.stroke(),
        (g.fillStyle = g0),
        g.fillRect(0, s / 2 - d / 2, 6, d),
        (g.fillStyle = f0),
        g.fillRect(i - 6, s / 2 - d / 2, 6, d),
        p.flash > 0 && ((g.fillStyle = `rgba(255,154,60,${p.flash * 0.25})`), g.fillRect(0, 0, i, s)),
        (g.font = "800 64px Sora, sans-serif"),
        (g.textAlign = "center"),
        (g.fillStyle = "rgba(77,163,255,.35)"),
        g.fillText(String(p.sa), i / 2 - 80, 80),
        (g.fillStyle = "rgba(255,154,60,.35)"),
        g.fillText(String(p.sb), i / 2 + 80, 80),
        Tg(g, p.a.x, p.a.y, l, g0),
        Tg(g, p.b.x, p.b.y, l, f0),
        Tg(g, f.x, f.y, c, "#ffffff"));
    }),
    (0, wo.jsx)("canvas", {
      ref: o,
      width: i,
      height: s,
      className: "w-full rounded-2xl",
      style: { aspectRatio: `${i}/${s}`, touchAction: "none", cursor: "none" },
    })
  );
}
function RE({ p1: t, onEnd: e }) {
  let a = (0, kr.useRef)(null),
    r = SE(),
    o = 900,
    n = 560,
    i = (0, kr.useRef)({
      x: o / 2,
      t: 60,
      score: 0,
      lives: 3,
      items: [],
      spawn: 0,
      done: !1,
      mouse: null,
      pops: [],
    });
  return (
    (0, kr.useEffect)(() => {
      let s = a.current,
        l = (c) => {
          let d = s.getBoundingClientRect();
          i.current.mouse = ((c.clientX - d.left) / d.width) * o;
        };
      return (s.addEventListener("pointermove", l), () => s.removeEventListener("pointermove", l));
    }, []),
    HE((s) => {
      let l = i.current,
        c = r.current,
        d = a.current?.getContext("2d");
      if (!d || l.done) return !1;
      ((l.t -= s),
        (c.has("a") || c.has("arrowleft")) && ((l.x -= 640 * s), (l.mouse = null)),
        (c.has("d") || c.has("arrowright")) && ((l.x += 640 * s), (l.mouse = null)),
        l.mouse !== null && (l.x += (l.mouse - l.x) * 0.3),
        (l.x = Math.max(60, Math.min(o - 60, l.x))),
        (l.spawn -= s));
      let h = 0.55 - (60 - l.t) * 0.005;
      if (l.spawn <= 0) {
        l.spawn = Math.max(0.18, h);
        let u = Math.random();
        l.items.push({
          x: 30 + Math.random() * (o - 60),
          y: -20,
          v: 160 + Math.random() * 120 + (60 - l.t) * 4,
          k: u < 0.12 ? "gold" : u < 0.32 ? "spike" : "orb",
        });
      }
      (l.items.forEach((u) => (u.y += u.v * s)),
        (l.items = l.items.filter((u) => {
          if (u.y > n - 50 && u.y < n - 20 && Math.abs(u.x - l.x) < 70) {
            if (u.k === "spike") (l.lives--, l.pops.push({ x: u.x, y: u.y, t: 1, txt: "\u22121 \u2665" }));
            else {
              let p = u.k === "gold" ? 5 : 1;
              ((l.score += p), l.pops.push({ x: u.x, y: u.y, t: 1, txt: `+${p}` }));
            }
            return !1;
          }
          return u.y < n + 30;
        })),
        l.pops.forEach((u) => {
          ((u.t -= s), (u.y -= 40 * s));
        }),
        (l.pops = l.pops.filter((u) => u.t > 0)),
        (l.t <= 0 || l.lives <= 0) &&
          ((l.done = !0), setTimeout(() => e(l.score, l.score >= 40, `${t} caught ${l.score} points`), 300)),
        (d.fillStyle = cx),
        d.fillRect(0, 0, o, n));
      for (let u = 0; u < 40; u++)
        ((d.fillStyle = "rgba(168,216,255,.15)"),
          d.fillRect((u * 97) % o, (u * 53 + performance.now() * 0.02 * (1 + (u % 3))) % n, 2, 2));
      (l.items.forEach((u) => {
        if (u.k === "spike") {
          ((d.fillStyle = "#ff5d7a"), d.beginPath());
          for (let p = 0; p < 8; p++) {
            let v = (p / 8) * Math.PI * 2,
              g = p % 2 ? 8 : 18;
            d.lineTo(u.x + Math.cos(v) * g, u.y + Math.sin(v) * g);
          }
          d.fill();
        } else
          (Tg(d, u.x, u.y, u.k === "gold" ? 13 : 10, u.k === "gold" ? "#ffc27a" : g0),
            (d.strokeStyle = f0),
            (d.lineWidth = 2),
            d.beginPath(),
            d.arc(u.x, u.y, u.k === "gold" ? 18 : 15, 0, Math.PI * 2),
            d.stroke());
      }),
        (d.shadowColor = g0),
        (d.shadowBlur = 20),
        (d.fillStyle = g0),
        d.fillRect(l.x - 70, n - 40, 140, 14),
        (d.fillStyle = f0),
        d.fillRect(l.x - 70, n - 26, 140, 4),
        (d.shadowBlur = 0),
        (d.font = "800 22px Sora, sans-serif"),
        (d.textAlign = "left"),
        (d.fillStyle = "#fff"),
        d.fillText(`Score ${l.score}`, 18, 34),
        (d.fillStyle = "#ff5d7a"),
        d.fillText("\u2665".repeat(Math.max(0, l.lives)), 18, 62),
        (d.textAlign = "right"),
        (d.fillStyle = OH),
        d.fillText(`${Math.max(0, l.t).toFixed(0)}s`, o - 18, 34),
        (d.textAlign = "center"),
        l.pops.forEach((u) => {
          ((d.globalAlpha = u.t),
            (d.fillStyle = u.txt.startsWith("+") ? "#ffc27a" : "#ff5d7a"),
            d.fillText(u.txt, u.x, u.y));
        }),
        (d.globalAlpha = 1));
    }),
    (0, wo.jsx)("canvas", {
      ref: a,
      width: o,
      height: n,
      className: "w-full rounded-2xl",
      style: { aspectRatio: `${o}/${n}`, touchAction: "none" },
    })
  );
}
function BE({ p1: t, p2: e, onEnd: a }) {
  let [r] = (0, kr.useState)(() => [...$w].sort(() => Math.random() - 0.5).slice(0, 10)),
    [o, n] = (0, kr.useState)(0),
    [i, s] = (0, kr.useState)(null),
    [l, c] = (0, kr.useState)(null),
    [d, h] = (0, kr.useState)([0, 0]),
    [u, p] = (0, kr.useState)(12),
    v = r[o];
  ((0, kr.useEffect)(() => {
    (p(12), s(null), c(null));
    let m = setTimeout(
        () => c(Math.random() < 0.7 ? v.c : (v.c + 1 + Math.floor(Math.random() * 3)) % 4),
        2500 + Math.random() * 5e3,
      ),
      f = setInterval(() => p((y) => y - 1), 1e3);
    return () => {
      (clearTimeout(m), clearInterval(f));
    };
  }, [o]),
    (0, kr.useEffect)(() => {
      u <= 0 && i === null && g(-1);
    }, [u]));
  let g = (m) => {
    if (i !== null) return;
    s(m);
    let f = l ?? (Math.random() < 0.6 ? v.c : (v.c + 1) % 4);
    c(f);
    let y = [
      d[0] + (m === v.c ? 10 + Math.max(0, u) : 0),
      d[1] + (f === v.c ? 10 + Math.floor(Math.random() * 6) : 0),
    ];
    (h(y),
      setTimeout(() => {
        o < r.length - 1 ? n(o + 1) : a(y[0], y[0] > y[1], `${t} ${y[0]} \u2013 ${y[1]} ${e}`);
      }, 1300));
  };
  return (0, wo.jsxs)("div", {
    className: "rounded-2xl p-5",
    style: { background: cx, minHeight: 380 },
    children: [
      (0, wo.jsxs)("div", {
        className: "flex items-center justify-between text-sm font-bold mb-4",
        children: [
          (0, wo.jsxs)("span", { style: { color: g0 }, children: [t, ": ", d[0]] }),
          (0, wo.jsxs)("span", {
            className: "font-display",
            style: { color: "var(--ink-dim)" },
            children: ["Q ", o + 1, "/10 \xB7 ", Math.max(0, u), "s"],
          }),
          (0, wo.jsxs)("span", {
            style: { color: f0 },
            children: [e, ": ", d[1], " ", l !== null && i === null ? "\u2713 answered" : ""],
          }),
        ],
      }),
      (0, wo.jsx)("div", {
        className: "xp-bar mb-5",
        children: (0, wo.jsx)("div", { style: { width: `${(Math.max(0, u) / 12) * 100}%` } }),
      }),
      (0, wo.jsx)("h3", {
        className: "font-display text-2xl font-bold mb-5",
        style: { textWrap: "balance" },
        children: v.q,
      }),
      (0, wo.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-3",
        children: v.a.map((m, f) => {
          let y = i !== null,
            x = f === v.c;
          return (0, wo.jsxs)(
            "button",
            {
              onClick: () => g(f),
              disabled: y,
              className: "rounded-xl p-4 text-left font-bold transition-all",
              style: {
                background: y
                  ? x
                    ? "rgba(69,224,174,.2)"
                    : f === i
                      ? "rgba(255,93,122,.2)"
                      : "rgba(255,255,255,.04)"
                  : "rgba(77,163,255,.1)",
                border: `1px solid ${y && x ? "#45e0ae" : "rgba(77,163,255,.3)"}`,
              },
              children: [
                (0, wo.jsx)("span", { className: "opacity-60 mr-2", children: "ABCD"[f] }),
                m,
                y &&
                  l === f &&
                  (0, wo.jsxs)("span", {
                    className: "ml-2 text-xs",
                    style: { color: f0 },
                    children: ["\u2190 ", e],
                  }),
              ],
            },
            f,
          );
        }),
      }),
    ],
  });
}
var x0 = P(Zt(), 1),
  jt = P(ea(), 1);
var re = P(ea(), 1),
  DH = {
    hatch: { L: 3.8, W: 1.75, H: 0.75, cabin: 0.62, cabinZ: -0.15, clear: 0.28, wheel: 0.33 },
    sedan: { L: 4.6, W: 1.85, H: 0.7, cabin: 0.6, cabinZ: -0.1, clear: 0.26, wheel: 0.34 },
    suv: { L: 4.8, W: 1.95, H: 0.95, cabin: 0.75, cabinZ: -0.2, clear: 0.38, wheel: 0.4 },
    pickup: { L: 5.3, W: 2, H: 0.9, cabin: 0.75, cabinZ: 0.6, clear: 0.42, wheel: 0.42 },
    sports: { L: 4.5, W: 1.95, H: 0.55, cabin: 0.45, cabinZ: -0.3, clear: 0.18, wheel: 0.34 },
    super: { L: 4.6, W: 2.05, H: 0.48, cabin: 0.4, cabinZ: -0.1, clear: 0.15, wheel: 0.35 },
  },
  AE = new re.MeshStandardMaterial({ color: "#10151c", metalness: 0.9, roughness: 0.08 }),
  zE = new re.MeshStandardMaterial({ color: "#141414", roughness: 0.9 }),
  jE = new re.MeshStandardMaterial({ color: "#b8bec5", metalness: 0.9, roughness: 0.25 }),
  m0 = new re.MeshStandardMaterial({ color: "#1d1f22", roughness: 0.6 }),
  WE = new re.MeshStandardMaterial({ color: "#ffffff", emissive: "#fff6d8", emissiveIntensity: 0.6 }),
  IE = new re.MeshStandardMaterial({ color: "#7a0a0a", emissive: "#ff1a1a", emissiveIntensity: 0.6 });
[AE, zE, jE, m0, WE, IE].forEach((t) => (t.userData.shared = !0));
var dx = new re.CylinderGeometry(1, 1, 1, 22);
dx.rotateZ(Math.PI / 2);
function Rr(t = "sedan", e = "#c0392b", a = !1) {
  let r = DH[t],
    o = new re.Group(),
    n = new re.MeshStandardMaterial({ color: e, metalness: 0.65, roughness: 0.3 }),
    i = r.clear + r.wheel * 0.4,
    s = new re.Mesh(new re.BoxGeometry(r.W, r.H, r.L), n);
  ((s.position.y = i + r.H / 2), (s.castShadow = !0), o.add(s));
  let l = new re.Mesh(new re.BoxGeometry(r.W * 0.98, r.H * 0.55, 0.6), n);
  (l.position.set(0, i + r.H * 0.3, r.L / 2 + 0.15), o.add(l));
  let c = new re.Mesh(new re.BoxGeometry(r.W, 0.18, 0.2), m0);
  (c.position.set(0, i + 0.08, r.L / 2 + 0.38), o.add(c));
  let d = c.clone();
  ((d.position.z = -r.L / 2 - 0.08), o.add(d));
  let h = t === "pickup" ? r.L * 0.34 : r.L * (t === "super" || t === "sports" ? 0.42 : 0.52),
    u = new re.Mesh(new re.BoxGeometry(r.W * 0.86, r.cabin, h), AE);
  (u.position.set(0, i + r.H + r.cabin / 2, r.cabinZ), (u.castShadow = !0), o.add(u));
  let p = new re.Mesh(new re.BoxGeometry(r.W * 0.84, 0.06, h * 0.86), n);
  (p.position.set(0, i + r.H + r.cabin + 0.02, r.cabinZ - h * 0.03), o.add(p));
  for (let f of [-1, 1]) {
    let y = new re.Mesh(new re.BoxGeometry(0.06, r.cabin, h * 0.9), n);
    (y.position.set(f * r.W * 0.43, i + r.H + r.cabin / 2, r.cabinZ), (y.scale.z = 0.08), o.add(y));
  }
  if (t === "pickup") {
    let f = new re.Mesh(new re.BoxGeometry(r.W * 0.95, 0.35, r.L * 0.38), m0);
    (f.position.set(0, i + r.H + 0.05, -r.L * 0.28), o.add(f));
  }
  if (t === "super" || t === "sports") {
    let f = new re.Mesh(new re.BoxGeometry(r.W * 0.9, 0.05, 0.35), m0);
    (f.position.set(0, i + r.H + 0.35, -r.L / 2 + 0.25), o.add(f));
    for (let y of [-0.6, 0.6]) {
      let x = new re.Mesh(new re.BoxGeometry(0.05, 0.3, 0.1), m0);
      (x.position.set(y, i + r.H + 0.18, -r.L / 2 + 0.25), o.add(x));
    }
  }
  for (let f of [-1, 1]) {
    let y = new re.Mesh(new re.BoxGeometry(0.42, 0.1, 0.05), WE);
    (y.position.set(f * r.W * 0.33, i + r.H * 0.55, r.L / 2 + 0.46), o.add(y));
    let x = new re.Mesh(new re.BoxGeometry(0.45, 0.1, 0.05), IE);
    (x.position.set(f * r.W * 0.34, i + r.H * 0.7, -r.L / 2 - 0.01), o.add(x));
    let k = new re.Mesh(new re.BoxGeometry(0.18, 0.1, 0.12), n);
    (k.position.set(f * (r.W / 2 + 0.06), i + r.H + 0.1, r.cabinZ + h / 2 - 0.1), o.add(k));
  }
  let v = new re.Mesh(new re.BoxGeometry(r.W * 0.5, 0.12, 0.04), m0);
  (v.position.set(0, i + r.H * 0.3, r.L / 2 + 0.46), o.add(v));
  let g = new re.Mesh(new re.PlaneGeometry(0.5, 0.12), new re.MeshStandardMaterial({ color: "#f2f2ee" }));
  (g.position.set(0, i + 0.25, -r.L / 2 - 0.19), (g.rotation.y = Math.PI), o.add(g));
  let m = [];
  for (let [f, y] of [
    [-1, 1],
    [1, 1],
    [-1, -1],
    [1, -1],
  ]) {
    let x = new re.Group();
    x.position.set(f * (r.W / 2 - 0.05), r.wheel, y * (r.L / 2 - 0.75));
    let k = new re.Mesh(dx, zE);
    (k.scale.set(0.26, r.wheel, r.wheel), (k.castShadow = !0));
    let b = new re.Mesh(dx, jE);
    (b.scale.set(0.27, r.wheel * 0.62, r.wheel * 0.62),
      x.add(k, b),
      (x.userData.wheel = !0),
      (x.userData.front = y > 0),
      o.add(x),
      m.push(x));
  }
  if (a)
    for (let [f, y] of [
      [-1, 1],
      [1, 1],
      [-1, -1],
      [1, -1],
    ]) {
      let x = new re.Mesh(
        new re.TorusGeometry(0.28, 0.05, 6, 20),
        new re.MeshStandardMaterial({ color: "#9fd6ff", emissive: "#9fd6ff", emissiveIntensity: 0.8 }),
      );
      ((x.rotation.x = Math.PI / 2),
        x.position.set(f * (r.W / 2 + 0.25), i + 0.3, y * (r.L / 2 - 0.75)),
        o.add(x));
    }
  return ((o.userData.wheels = m), (o.userData.radius = r.wheel), (o.userData.len = r.L), o);
}
var v0 = class {
  constructor(e = 28, a = 10) {
    this.top = e;
    this.accel = a;
    this.speed = 0;
    this.heading = 0;
    this.steer = 0;
  }
  step(e, a) {
    let r = this.top * (a.boost ? 1.25 : 1);
    (a.up > 0
      ? (this.speed += this.accel * e * (1 - Math.max(0, this.speed) / r))
      : a.up < 0
        ? (this.speed -= (this.speed > 0 ? 18 : 6) * e)
        : (this.speed *= 1 - Math.min(1, e * 0.6)),
      a.brake && (this.speed *= 1 - Math.min(1, e * 3)),
      (this.speed = Math.max(-8, Math.min(r, this.speed))),
      (this.steer += (a.turn * 0.6 - this.steer) * Math.min(1, e * 6)));
    let o = 1 / (1 + Math.abs(this.speed) * 0.03);
    return (
      (this.heading += this.steer * (this.speed / 6) * o * e * 1.6),
      { dx: Math.sin(this.heading) * this.speed * e, dz: Math.cos(this.heading) * this.speed * e }
    );
  }
};
function $s(t, e, a, r = 0) {
  let o = t.userData.radius || 0.34;
  (t.userData.wheels || []).forEach((n) => {
    (n.children.forEach((i) => (i.rotation.x += (e * a) / o)), n.userData.front && (n.rotation.y = r));
  });
}
var FH = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8),
  tc = class {
    constructor(e, a) {
      this.nr = null;
      this.mine = [];
      this.seen = new Map();
      this.state = {};
      ((this.name = e), (this.myName = a));
    }
    async join() {
      let e = window.claude,
        a = e?.use ? await e.use("room") : null;
      if (!a?.join) throw new Error("offline");
      return (
        (this.nr = await a.join(this.name)),
        this.nr.onPeers(
          (r) => {
            let o = (r.peers || []).filter((n) => !n.isMe);
            (this.onPeers?.(o.map((n) => String(n.presence?.n || "Friend").slice(0, 24))),
              o.forEach((n) => {
                let i = n.presence || {},
                  s = this.seen.get(n.peer) || 0;
                (Array.isArray(i.m) ? i.m : []).forEach((c) => {
                  c &&
                    c.at > s &&
                    typeof c.t == "string" &&
                    this.onMessage?.({
                      from: String(i.n || "Friend").slice(0, 24),
                      me: !1,
                      text: c.t.slice(0, 300),
                      at: c.at,
                    });
                });
                let l = Math.max(s, ...(Array.isArray(i.m) ? i.m.map((c) => c.at || 0) : [0]));
                (this.seen.set(n.peer, l), i.s && this.onState?.(i.s, String(i.n || "Friend")));
              }));
          },
          () => {},
        ),
        await this.push(),
        this
      );
    }
    push() {
      return this.nr?.presence({ n: this.myName, m: this.mine, s: this.state }).catch(() => {});
    }
    send(e) {
      let a = { t: e.slice(0, 300), at: Date.now() };
      return (
        (this.mine = [...this.mine, a].slice(-8)),
        this.onMessage?.({ from: this.myName, me: !0, text: a.t, at: a.at }),
        this.push()
      );
    }
    setState(e) {
      return ((this.state = { ...this.state, ...e }), this.push());
    }
    leave() {
      try {
        this.nr?.leave();
      } catch {}
      this.nr = null;
    }
  };
function hx(t, e, a, r, o = `p-${FH()}`) {
  return (t.setExtra({ inv: { to: e, room: o, kind: a, game: r || null, at: Date.now() } }), o);
}
var GE = (t) =>
    t
      .split(
        `\r
`,
      )
      .filter(
        (e) =>
          !/^a=(extmap|rtcp-fb|ssrc-group|msid-semantic)/.test(e) &&
          !(e.startsWith("a=ssrc") && !e.includes("cname")),
      ).join(`\r
`),
  VE = (t) => t.match(/[\s\S]{1,900}/g) || [],
  Sg = class {
    constructor(e, a) {
      this.pc = null;
      this.stream = null;
      this.audio = new Audio();
      this.done = !1;
      ((this.room = e), (this.caller = a), (this.audio.autoplay = !0));
    }
    async start() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: !0 });
      } catch {
        return (this.onStatus?.("no-mic"), !1);
      }
      let e = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      ((this.pc = e),
        this.stream.getTracks().forEach((r) => e.addTrack(r, this.stream)),
        (e.ontrack = (r) => {
          ((this.audio.srcObject = r.streams[0]),
            this.audio.play().catch(() => {}),
            this.onStatus?.("connected"));
        }),
        (e.onconnectionstatechange = () => {
          e.connectionState === "failed" && this.onStatus?.("failed");
        }));
      let a = () =>
        new Promise((r) => {
          if (e.iceGatheringState === "complete") return r();
          let o = setTimeout(r, 2500);
          e.onicegatheringstatechange = () => {
            e.iceGatheringState === "complete" && (clearTimeout(o), r());
          };
        });
      return (
        (this.room.onState = async (r) => {
          this.done ||
            !this.pc ||
            (!this.caller && r.offer && !e.remoteDescription
              ? (await e.setRemoteDescription({ type: "offer", sdp: r.offer.join("") }),
                await e.setLocalDescription(await e.createAnswer()),
                await a(),
                this.room.setState({ answer: VE(GE(e.localDescription.sdp)) }))
              : this.caller &&
                r.answer &&
                !e.remoteDescription &&
                (await e.setRemoteDescription({ type: "answer", sdp: r.answer.join("") })),
            r.hangup && this.stop());
        }),
        this.caller
          ? (await e.setLocalDescription(await e.createOffer()),
            await a(),
            this.room.setState({ offer: VE(GE(e.localDescription.sdp)) }),
            this.onStatus?.("ringing"))
          : this.onStatus?.("connecting"),
        !0
      );
    }
    setMuted(e) {
      this.stream?.getAudioTracks().forEach((a) => (a.enabled = !e));
    }
    stop() {
      this.done ||
        ((this.done = !0),
        this.room.setState({ hangup: Date.now() }),
        this.stream?.getTracks().forEach((e) => e.stop()),
        this.pc?.close(),
        (this.pc = null),
        this.onStatus?.("ended"));
    }
  };
var Si = P(ct(), 1),
  Hg = 3,
  rs = 14,
  pr = 600,
  UH = [
    [0, 0],
    [120, -10],
    [190, 40],
    [200, 130],
    [140, 190],
    [40, 170],
    [-20, 220],
    [-110, 200],
    [-150, 120],
    [-120, 40],
    [-70, 10],
  ];
