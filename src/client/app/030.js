function lB(t, e, a, r) {
  let o = r ? 1080 : 1200,
    n = r ? 1920 : 630;
  ((e.width = o), (e.height = n));
  let i = e.getContext("2d"),
    s = t.users.find((N) => N.id === t.session?.userId),
    c = !!t.settings.stealth ? "Anonymous Citizen" : s?.name || "Guest",
    d = t.session ? t.passports[t.session.userId] : void 0,
    h = g9(t),
    u = Xr.find((N) => N.id === t.dream.car),
    p = Qn.find((N) => N.id === t.dream.home),
    v = Tr(t.game.xp),
    g = Object.values(Za(t)).filter((N) => N.owner === t.session?.userId).length,
    m = i.createLinearGradient(0, 0, o, n);
  (m.addColorStop(0, "#0a0f1a"),
    m.addColorStop(0.55, "#111a2e"),
    m.addColorStop(1, "#1d1407"),
    (i.fillStyle = m),
    i.fillRect(0, 0, o, n));
  let f = i.createLinearGradient(0, 0, o, 0);
  (f.addColorStop(0, "#b8862b"), f.addColorStop(0.5, "#ffe2a3"), f.addColorStop(1, "#b8862b"));
  let y = r ? 60 : 760,
    x = r ? 300 : 60,
    k = r ? o - 120 : 380,
    b = r ? 900 : 510;
  (i.save(),
    i.beginPath(),
    i.roundRect?.(y, x, k, b, 26),
    i.clip(),
    (i.fillStyle = "#1b2a4a"),
    i.fillRect(y, x, k, b));
  let w = () => {
    (i.restore(),
      (i.strokeStyle = f),
      (i.lineWidth = 3),
      i.beginPath(),
      i.roundRect?.(y, x, k, b, 26),
      i.stroke(),
      r ||
        (i.setLineDash([6, 10]),
        (i.strokeStyle = "rgba(255,226,163,.45)"),
        i.beginPath(),
        i.moveTo(730, 40),
        i.lineTo(730, n - 40),
        i.stroke(),
        i.setLineDash([])));
  };
  if (a) {
    let N = new Image();
    ((N.onload = () => {
      let B = Math.max(k / N.width, b / N.height);
      i.drawImage(
        N,
        y + k / 2 - (N.width * B) / 2,
        x + b / 2 - (N.height * B) / 2,
        N.width * B,
        N.height * B,
      );
      let X = i.createLinearGradient(0, x + b * 0.55, 0, x + b);
      (X.addColorStop(0, "rgba(0,0,0,0)"),
        X.addColorStop(1, "rgba(0,0,0,.65)"),
        (i.fillStyle = X),
        i.fillRect(y, x, k, b),
        (i.fillStyle = "#fff"),
        (i.font = `700 ${r ? 40 : 22}px Sora, sans-serif`),
        i.fillText(c, y + 24, x + b - 26),
        w());
    }),
      (N.src = a));
  } else
    ((i.fillStyle = "rgba(255,255,255,.85)"),
      (i.font = "800 160px Sora, sans-serif"),
      (i.textAlign = "center"),
      i.fillText((c[0] || "F").toUpperCase(), y + k / 2, x + b / 2 + 50),
      (i.textAlign = "left"),
      w());
  let L = 60,
    E = r ? 120 : 92;
  ((i.fillStyle = "#2f6fe0"),
    i.beginPath(),
    i.arc(L + 28, E - 12, 24, 0, Math.PI * 2),
    i.fill(),
    (i.strokeStyle = "#ff9a3c"),
    (i.lineWidth = 5),
    i.beginPath(),
    i.ellipse(L + 28, E - 12, 40, 16, -0.35, 0, Math.PI * 2),
    i.stroke(),
    (i.fillStyle = f),
    (i.font = `800 ${r ? 44 : 30}px Sora, sans-serif`),
    i.fillText("FYRUS AIRLINES \xB7 BOARDING PASS", L + 86, E),
    (i.fillStyle = "rgba(255,255,255,.6)"),
    (i.font = `600 ${r ? 26 : 18}px "JetBrains Mono", monospace`),
    i.fillText("REPUBLIC OF FYRUS \xB7 COUNTRY 2040", L + 86, E + (r ? 40 : 28)),
    (E = r ? 1290 : 190),
    (i.fillStyle = "#fff"),
    (i.font = `800 ${r ? 96 : 64}px Sora, sans-serif`),
    i.fillText("EARTH", L, E + (r ? 60 : 40)),
    (i.fillStyle = f),
    i.fillText("\u2192", L + (r ? 330 : 230), E + (r ? 60 : 40)),
    (i.fillStyle = "#fff"),
    i.fillText("FYRUS", L + (r ? 450 : 310), E + (r ? 60 : 40)));
  let T = (N, B, X, M) => {
      ((i.fillStyle = "rgba(255,255,255,.5)"),
        (i.font = `600 ${r ? 24 : 16}px "Plus Jakarta Sans", sans-serif`),
        i.fillText(N, X, M),
        (i.fillStyle = "#fff"),
        (i.font = `700 ${r ? 38 : 26}px "Plus Jakarta Sans", sans-serif`),
        i.fillText(B.length > 22 ? B.slice(0, 21) + "\u2026" : B, X, M + (r ? 46 : 32)));
    },
    S = E + (r ? 130 : 90),
    H = r ? 330 : 220;
  (T("PASSENGER", c, L, S),
    T("STATUS", h, L + H * 1.4, S),
    T("DOCUMENT", d ? Dl(d) : "Visa on arrival", L, S + (r ? 110 : 80)),
    T("LEVEL", String(v), L + H * 1.4, S + (r ? 110 : 80)),
    T("RIDES IN", u?.name || "Mira City", L, S + (r ? 220 : 160)),
    T(
      g ? "LAND" : "LIVES IN",
      g ? `${g} plot${g > 1 ? "s" : ""}` : p?.name || "Studio",
      L + H * 1.4,
      S + (r ? 220 : 160),
    ),
    i.save(),
    i.translate(r ? o - 250 : 600, r ? 1300 : 470),
    i.rotate(-0.22),
    (i.strokeStyle = h === "CITIZEN" ? "#ffd27a" : "#7fd1ff"),
    (i.lineWidth = 5),
    i.beginPath(),
    i.roundRect?.(-110, -46, 220, 92, 14),
    i.stroke(),
    (i.fillStyle = i.strokeStyle),
    (i.font = "800 22px Sora, sans-serif"),
    (i.textAlign = "center"),
    i.fillText(h === "CITIZEN" ? "CITIZEN" : "ADMITTED", 0, -6),
    (i.font = '600 14px "JetBrains Mono", monospace'),
    i.fillText("FYRUS IMMIGRATION", 0, 22),
    i.restore(),
    (i.textAlign = "left"),
    (i.fillStyle = f),
    i.fillRect(L, n - (r ? 170 : 92), r ? o - 120 : 640, 2),
    (i.fillStyle = "rgba(255,255,255,.85)"),
    (i.font = `700 ${r ? 34 : 22}px "Plus Jakarta Sans", sans-serif`),
    i.fillText(
      `Official ${h === "CITIZEN" ? "Citizen" : "Visitor"} of Fyrus Country 2040`,
      L,
      n - (r ? 110 : 56),
    ),
    (i.fillStyle = "#ffc27a"),
    (i.font = `700 ${r ? 32 : 20}px "JetBrains Mono", monospace`),
    i.fillText(zy(t).replace("https://", ""), L, n - (r ? 60 : 26)));
}
function jy(t, e, a, r, o = null, n = !1) {
  if (e === "status") return lB(t, r, o, n);
  let i = 1200,
    s = 630;
  ((r.width = i), (r.height = s));
  let l = r.getContext("2d"),
    c = l.createLinearGradient(0, 0, i, s);
  (c.addColorStop(0, "#0b1d3f"),
    c.addColorStop(1, "#040a1c"),
    (l.fillStyle = c),
    l.fillRect(0, 0, i, s),
    (l.strokeStyle = "rgba(255,194,122,.55)"),
    (l.lineWidth = 3),
    l.strokeRect(24, 24, i - 48, s - 48));
  for (let h = 0; h < 14; h++)
    ((l.strokeStyle = `rgba(77,163,255,${0.05 + (h % 3) * 0.02})`),
      l.beginPath(),
      l.arc(i - 120, 120, 40 + h * 26, 0, Math.PI * 2),
      l.stroke());
  ((l.fillStyle = "#2f6fe0"),
    l.beginPath(),
    l.arc(110, 104, 34, 0, Math.PI * 2),
    l.fill(),
    (l.strokeStyle = "#ff9a3c"),
    (l.lineWidth = 7),
    l.beginPath(),
    l.ellipse(110, 104, 54, 22, -0.35, 0, Math.PI * 2),
    l.stroke(),
    (l.fillStyle = "#ffc27a"),
    (l.font = '700 22px "JetBrains Mono", monospace'),
    l.fillText("REPUBLIC OF FYRUS", 184, 92),
    (l.fillStyle = "#fff"),
    (l.font = "800 46px Sora, sans-serif"));
  let d = t.users.find((h) => h.id === t.session?.userId);
  if (e === "passport") {
    let h = t.passports[a];
    if (!h) return;
    let u = oi(h);
    if (
      (l.fillText(u ? "PASSPORT" : "VISITOR VISA", 184, 140),
      l.save(),
      l.beginPath(),
      l.roundRect?.(70, 200, 230, 280, 18),
      l.clip(),
      (l.fillStyle = d?.color || "#4da3ff"),
      l.fillRect(70, 200, 230, 280),
      (l.fillStyle = "rgba(255,255,255,.9)"),
      (l.font = "800 110px Sora, sans-serif"),
      (l.textAlign = "center"),
      l.fillText((h.name[0] || "F").toUpperCase(), 185, 380),
      (l.textAlign = "left"),
      l.restore(),
      t.photo)
    ) {
      let v = new Image();
      ((v.onload = () => {
        (l.save(), l.beginPath(), l.roundRect?.(70, 200, 230, 280, 18), l.clip());
        let g = Math.max(230 / v.width, 280 / v.height);
        (l.drawImage(v, 185 - (v.width * g) / 2, 340 - (v.height * g) / 2, v.width * g, v.height * g),
          l.restore());
      }),
        (v.src = t.photo));
    }
    let p = (v, g, m) => {
      ((l.fillStyle = "rgba(255,255,255,.55)"),
        (l.font = '600 20px "Plus Jakarta Sans", sans-serif'),
        l.fillText(v, 350, m),
        (l.fillStyle = "#fff"),
        (l.font = '700 34px "Plus Jakarta Sans", sans-serif'),
        l.fillText(g, 350, m + 40));
    };
    (p("NAME", h.name, 220),
      p(u ? "PASSPORT NO." : "VISA NO.", Dl(h), 310),
      p("HOME CITY", Il(h.interest).name, 400),
      p(
        u ? "CITIZEN SINCE" : "ARRIVED",
        new Date(h.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        490,
      ),
      u &&
        (h.passportNo ?? h.no) <= 1e3 &&
        ((l.fillStyle = "#ff9a3c"),
        l.beginPath(),
        l.roundRect?.(820, 470, 300, 56, 28),
        l.fill(),
        (l.fillStyle = "#1a0f05"),
        (l.font = "800 24px Sora, sans-serif"),
        l.fillText("FOUNDING CITIZEN", 846, 507)),
      (l.fillStyle = "rgba(255,255,255,.35)"),
      (l.font = '600 22px "JetBrains Mono", monospace'),
      l.fillText(
        `P<FYR${h.name
          .toUpperCase()
          .replace(/[^A-Z]/g, "<")
          .slice(0, 24)
          .padEnd(24, "<")}<<${Dl(h).replace("-", "")}<<<`,
        70,
        585,
      ));
  } else {
    let h = Ws(a),
      u = Za(t)[a];
    if (!h || !u) return;
    let p = qi(h.district);
    l.fillText("LAND TITLE DEED", 184, 140);
    let v = (T, S, H) => {
      ((l.fillStyle = "rgba(255,255,255,.55)"),
        (l.font = '600 20px "Plus Jakarta Sans", sans-serif'),
        l.fillText(T, 70, H),
        (l.fillStyle = "#fff"),
        (l.font = '700 34px "Plus Jakarta Sans", sans-serif'),
        l.fillText(S, 70, H + 40));
    };
    (v("PLOT", h.id, 220),
      v("CITY", p.name, 310),
      v("LOCATION", `${js[h.tier].label} \xB7 ${h.size} x ${h.size} m`, 400),
      v("OWNER", u.ownerName, 490));
    let g = Ya.filter((T) => T.district === h.district),
      m = g.map((T) => T.x),
      f = g.map((T) => T.z),
      y = Math.min(...m),
      x = Math.max(...m),
      k = Math.min(...f),
      b = Math.max(...f),
      w = 46,
      L = 820 - (((x - y) / p.gap) * w) / 2,
      E = 330 - (((b - k) / p.gap) * w) / 2;
    (g.forEach((T) => {
      let S = L + ((T.x - y) / p.gap) * w,
        H = E + ((T.z - k) / p.gap) * w;
      ((l.fillStyle =
        T.id === h.id ? "#ff9a3c" : Za(t)[T.id] ? "rgba(255,255,255,.28)" : "rgba(255,255,255,.1)"),
        l.fillRect(S - 18, H - 18, 36, 36));
    }),
      (l.fillStyle = "rgba(255,255,255,.55)"),
      (l.font = '600 18px "Plus Jakarta Sans", sans-serif'),
      (l.textAlign = "center"),
      l.fillText("Your plot in orange", 820, 520),
      (l.textAlign = "left"));
  }
  ((l.fillStyle = "#ffc27a"),
    (l.font = '700 24px "Plus Jakarta Sans", sans-serif'),
    (l.textAlign = "right"),
    l.fillText("fyrus.io", i - 60, s - 52),
    (l.textAlign = "left"));
}
function cB(t, e, a) {
  if (e === "status")
    return g9(t) === "CITIZEN"
      ? "I am an official citizen of Fyrus Country 2040. Come visit me:"
      : "I just landed in Fyrus Country 2040 \u2014 a whole 3D country you can visit. Join me:";
  if (e === "passport") {
    let o = t.passports[a];
    return o && !oi(o)
      ? `I just got my visa for the Republic of Fyrus (${Dl(o)}). Come explore Fyrus Country 2040:`
      : `I am now a passport holder of the Republic of Fyrus: ${o ? Dl(o) : ""}${o && (o.passportNo ?? o.no) <= 1e3 ? " (Founding Citizen)" : ""}. Join me in Fyrus:`;
  }
  let r = Ws(a);
  return `I just bought plot ${a} in ${r ? qi(r.district).name : "the City of Fyrus"}, City of Fyrus. Come visit:`;
}
function Wy() {
  let t = Y(),
    e = t.shareCard,
    a = (0, Ai.useRef)(null),
    [r, o] = (0, Ai.useState)(""),
    [n, i] = (0, Ai.useState)(!1),
    [s, l] = (0, Ai.useState)(null),
    [c, d] = (0, Ai.useState)(Ay),
    [h, u] = (0, Ai.useState)(!1);
  if (
    ((0, Ai.useEffect)(() => {
      e?.kind === "status" && l(_t()?.snapshot(900) || null);
    }, [e?.kind]),
    (0, Ai.useEffect)(() => {
      if (!e || !a.current) return;
      jy(t, e.kind, e.id, a.current, s, n);
      let k = setTimeout(() => {
        try {
          o(a.current.toDataURL("image/png"));
        } catch {}
      }, 500);
      return () => clearTimeout(k);
    }, [e?.kind, e?.id, s, n]),
    !e)
  )
    return null;
  let p = cB(t, e.kind, e.id),
    v = encodeURIComponent,
    g = (e.kind === "status", zy(t)),
    m =
      e.kind === "passport"
        ? "fyrus-passport.png"
        : e.kind === "status"
          ? `fyrus-status${n ? "-story" : ""}.png`
          : `fyrus-plot-${e.id}.png`,
    f = () => {
      let k = _t();
      k &&
        (u(!0),
        C({ shareCard: null }),
        F("Recording a 15-second clip of you\u2026", "info"),
        k.recordClip(15, (b) => {
          if ((u(!1), !b))
            return (
              C({ shareCard: { kind: "status", id: "me" } }),
              F("This browser cannot record clips. Try Chrome on a computer.", "warn")
            );
          if (!b) return F("This browser cannot record clips. Try Chrome on a computer.", "warn");
          ((Ay = URL.createObjectURL(b)),
            d(Ay),
            C({ shareCard: { kind: "status", id: "me" } }),
            F("Your clip is ready. Download it and post it to your story.", "ok"));
        }));
    },
    y = [
      { n: "WhatsApp", href: `https://wa.me/?text=${v(`${p} ${g}`)}` },
      { n: "X", href: `https://twitter.com/intent/tweet?text=${v(p)}&url=${v(g)}` },
      { n: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${v(g)}&quote=${v(p)}` },
      { n: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${v(g)}` },
    ],
    x = async () => {
      try {
        let k = await new Promise((L) => a.current.toBlob((E) => L(E), "image/png")),
          b = k ? new File([k], m, { type: "image/png" }) : null,
          w = navigator;
        b && w.canShare?.({ files: [b] })
          ? await w.share({ files: [b], text: p, url: g })
          : w.share
            ? await w.share({ text: p, url: g })
            : (await navigator.clipboard.writeText(`${p} ${g}`),
              F("Text copied. Paste it anywhere.", "info"));
      } catch {}
    };
  return (0, za.jsx)("div", {
    className: "fixed inset-0 z-[80] grid place-items-center p-3",
    style: { background: "rgba(0,0,0,.6)" },
    role: "dialog",
    "aria-label": "Share",
    onClick: () => C({ shareCard: null }),
    children: (0, za.jsxs)("div", {
      className: "hud-box p-3 w-[min(96vw,560px)] pop-in",
      onClick: (k) => k.stopPropagation(),
      children: [
        (0, za.jsxs)("div", {
          className: "flex items-center mb-2",
          children: [
            (0, za.jsx)("div", {
              className: "flex-1 font-bold text-white",
              children:
                e.kind === "status"
                  ? "Flex my Fyrus status"
                  : e.kind === "passport"
                    ? "Your Fyrus document"
                    : `Deed for plot ${e.id}`,
            }),
            e.kind === "status" &&
              (0, za.jsxs)("div", {
                className: "flex gap-1 mr-2",
                children: [
                  (0, za.jsx)("button", {
                    className: `chip ${n ? "" : "chip-on"}`,
                    onClick: () => i(!1),
                    children: "Post",
                  }),
                  (0, za.jsx)("button", {
                    className: `chip ${n ? "chip-on" : ""}`,
                    onClick: () => i(!0),
                    children: "Story",
                  }),
                ],
              }),
            (0, za.jsx)("button", {
              className: "hud-icon",
              style: { width: 30, height: 30 },
              onClick: () => C({ shareCard: null }),
              "aria-label": "Close",
              children: (0, za.jsx)(pe, {}),
            }),
          ],
        }),
        (0, za.jsx)("canvas", {
          ref: a,
          className: "rounded-lg block mx-auto",
          style: n
            ? { height: "min(60vh, 520px)", aspectRatio: "1080 / 1920" }
            : { width: "100%", aspectRatio: "1200 / 630" },
        }),
        c &&
          (0, za.jsx)("video", {
            src: c,
            controls: !0,
            autoPlay: !0,
            loop: !0,
            muted: !0,
            className: "w-full rounded-lg mt-2",
          }),
        (0, za.jsxs)("p", {
          className: "text-[12px] mt-2",
          style: { color: "var(--ink-dim)" },
          children: ["Tell everyone: ", p, " ", g],
        }),
        (0, za.jsxs)("div", {
          className: "flex flex-wrap gap-1.5 mt-2",
          children: [
            (0, za.jsxs)("button", {
              className: "btn btn-primary btn-sm",
              onClick: x,
              children: [(0, za.jsx)(ni, {}), " Share"],
            }),
            y.map((k) =>
              (0, za.jsx)(
                "a",
                {
                  className: "btn btn-ghost btn-sm",
                  href: k.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: k.n,
                },
                k.n,
              ),
            ),
            r &&
              (0, za.jsxs)("a", {
                className: "btn btn-ghost btn-sm",
                href: r,
                download: m,
                children: [(0, za.jsx)(c0, {}), " Image"],
              }),
            e.kind === "status" &&
              (c
                ? (0, za.jsxs)("a", {
                    className: "btn btn-ghost btn-sm",
                    href: c,
                    download: "fyrus-status-clip.webm",
                    children: [(0, za.jsx)(Ps, {}), " Download clip"],
                  })
                : (0, za.jsxs)("button", {
                    className: "btn btn-ghost btn-sm",
                    disabled: h,
                    onClick: f,
                    children: [(0, za.jsx)(Ps, {}), " ", h ? "Recording\u2026" : "15s video"],
                  })),
            (0, za.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => {
                navigator.clipboard
                  ?.writeText(`${p} ${g}`)
                  .then(() => F("Copied.", "info"))
                  .catch(() => {});
              },
              children: [(0, za.jsx)(Kl, {}), " Copy"],
            }),
          ],
        }),
      ],
    }),
  });
}
var G = P(ct(), 1),
  ga = { color: "var(--ink-dim)" },
  dB = [
    { id: "passport", label: "Passport", icon: i0 },
    { id: "land", label: "Land", icon: da },
    { id: "parliament", label: "Parliament", icon: Xi },
    { id: "bank", label: "Central Bank", icon: Or },
    { id: "law", label: "Law & Court", icon: Ei },
  ];
function Iy() {
  let t = Y(),
    e = C8();
  return (0, G.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, G.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, G.jsx)("div", {
            className: "text-[10px] font-bold tracking-[.25em]",
            style: { color: "var(--ember-hi)" },
            children: "REPUBLIC OF FYRUS",
          }),
          (0, G.jsx)("div", {
            className: "text-sm font-bold mt-0.5",
            children: "A free digital city with its own capital, coin, cities, parliament and law",
          }),
          (0, G.jsx)("div", {
            className: "grid grid-cols-4 gap-2 mt-2 text-center",
            children: [
              ["Citizens", e.citizens.toLocaleString()],
              ["Cities", String(e.districts)],
              ["Plots sold", `${e.owned}/${e.plots}`],
              ["Treasury", q(t.treasury)],
            ].map(([a, r]) =>
              (0, G.jsxs)(
                "div",
                {
                  className: "rounded-md py-1.5",
                  style: { background: "rgba(255,255,255,.04)" },
                  children: [
                    (0, G.jsx)("div", {
                      className: "text-[13px] font-bold tabular truncate px-1",
                      children: r,
                    }),
                    (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: a }),
                  ],
                },
                a,
              ),
            ),
          }),
        ],
      }),
      (0, G.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: dB.map((a) => {
          let r = a.icon;
          return (0, G.jsxs)(
            "button",
            {
              className: `chip ${t.nationTab === a.id ? "chip-on" : ""}`,
              onClick: () => C({ nationTab: a.id }),
              children: [(0, G.jsx)(r, {}), " ", a.label],
            },
            a.id,
          );
        }),
      }),
      t.nationTab === "passport" && (0, G.jsx)(hB, {}),
      t.nationTab === "land" && (0, G.jsx)(uB, {}),
      t.nationTab === "parliament" && (0, G.jsx)(gB, {}),
      t.nationTab === "bank" && (0, G.jsx)(mB, {}),
      t.nationTab === "law" && (0, G.jsx)(vB, {}),
    ],
  });
}
function f9({ kind: t, id: e }) {
  let a = Y(),
    r = (0, go.useRef)(null);
  return (
    (0, go.useEffect)(() => {
      r.current && jy(a, t, e, r.current);
    }, [t, e, a.photo, Za(a)[e]?.ownerName]),
    (0, G.jsx)("canvas", {
      ref: r,
      className: "w-full rounded-lg block",
      style: { aspectRatio: "1200 / 630" },
      "aria-label": t === "passport" ? "Your passport" : `Deed for ${e}`,
    })
  );
}
function hB() {
  let t = Y(),
    e = Zi(),
    [a, r] = (0, go.useState)("ai");
  if (!e)
    return (0, G.jsxs)("div", {
      className: "space-y-2",
      children: [
        (0, G.jsxs)("div", {
          className: "card p-3",
          children: [
            (0, G.jsx)("div", { className: "font-bold text-sm", children: "Visitor visa (free, instant)" }),
            (0, G.jsx)("div", {
              className: "text-[12px] mt-1",
              style: ga,
              children:
                "Everyone can enter Fyrus. Your visa gives you a home city, the right to buy land there, shop, study and work, and a 2,500 FYC welcome grant. The Fyrus passport is earned later: it adds voting, zero transfer tax, Capital Quarter land and the golden badge.",
            }),
          ],
        }),
        (0, G.jsx)("div", {
          className: "text-[12px] font-bold",
          children: "What are you into? Your home city follows your interest.",
        }),
        (0, G.jsx)("div", {
          className: "grid sm:grid-cols-2 gap-1.5",
          children: Wl.map((l) =>
            (0, G.jsxs)(
              "button",
              {
                onClick: () => r(l.id),
                className: "text-left rounded-lg p-2.5",
                style: {
                  border: `1px solid ${a === l.id ? "var(--accent)" : "var(--line)"}`,
                  background:
                    a === l.id ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "transparent",
                },
                children: [
                  (0, G.jsx)("div", { className: "text-sm font-bold", children: l.label }),
                  (0, G.jsxs)("div", {
                    className: "text-[11px]",
                    style: ga,
                    children: [Il(l.id).name, " \xB7 ", l.desc],
                  }),
                ],
              },
              l.id,
            ),
          ),
        }),
        (0, G.jsxs)("button", {
          className: "btn btn-primary w-full",
          onClick: () => v8(a),
          children: [(0, G.jsx)(i0, {}), " Get my visa"],
        }),
      ],
    });
  let o = Ya.filter((l) => Za(t)[l.id]?.owner === t.session?.userId),
    n = Il(e.interest),
    i = oi(e),
    s = Uv();
  return (0, G.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, G.jsx)(f9, { kind: "passport", id: t.session.userId }),
      !i &&
        (0, G.jsxs)("div", {
          className: "card p-3",
          id: "passport-apply",
          children: [
            (0, G.jsxs)("div", {
              className: "flex items-center",
              children: [
                (0, G.jsx)("div", {
                  className: "font-bold text-sm flex-1",
                  children: "Earn the Fyrus passport",
                }),
                (0, G.jsxs)("span", {
                  className: "text-[11px]",
                  style: ga,
                  children: [Nh().toLocaleString("en-US"), " / ", Yp.toLocaleString("en-US"), " issued"],
                }),
              ],
            }),
            (0, G.jsx)("div", {
              className: "text-[12px] mt-1",
              style: ga,
              children:
                "Complete any two milestones with a clean record. Passport holders vote, pay no transfer tax and can buy Capital Quarter land.",
            }),
            (0, G.jsxs)("div", {
              className: "mt-2 space-y-1",
              children: [
                s.items.map((l) =>
                  (0, G.jsxs)(
                    "div",
                    {
                      className: "flex items-start gap-2 text-[13px]",
                      children: [
                        (0, G.jsx)("span", {
                          style: { color: l.done ? "#45e0ae" : "var(--ink-dim)" },
                          children: l.done ? "\u2713" : "\u25CB",
                        }),
                        (0, G.jsxs)("div", {
                          children: [
                            (0, G.jsx)("b", { children: l.label }),
                            (0, G.jsx)("div", { className: "text-[11px]", style: ga, children: l.hint }),
                          ],
                        }),
                      ],
                    },
                    l.id,
                  ),
                ),
                (0, G.jsxs)("div", {
                  className: "flex items-start gap-2 text-[13px]",
                  children: [
                    (0, G.jsx)("span", {
                      style: { color: s.clean ? "#45e0ae" : "var(--rose)" },
                      children: s.clean ? "\u2713" : "\u2715",
                    }),
                    (0, G.jsx)("b", { children: "Clean record" }),
                  ],
                }),
              ],
            }),
            (0, G.jsxs)("button", {
              className: "btn btn-primary btn-sm mt-2",
              disabled: !s.ready,
              onClick: x8,
              children: [
                (0, G.jsx)(i0, {}),
                " ",
                s.ready ? "Apply for my passport" : `${s.count} of 2 milestones`,
              ],
            }),
          ],
        }),
      (0, G.jsxs)("div", {
        className: "flex gap-1.5 flex-wrap",
        children: [
          (0, G.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            onClick: () => C({ shareCard: { kind: "passport", id: t.session.userId } }),
            children: [(0, G.jsx)(ni, {}), " ", i ? "Share my passport" : "Share my visa"],
          }),
          (0, G.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => C({ nationTab: "land" }),
            children: [(0, G.jsx)(da, {}), " Buy land in ", n.name],
          }),
          (0, G.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => xa({ x: Ha.citizens.x, z: Ha.citizens.z - 14, face: Ha.citizens }),
            children: [(0, G.jsx)(dr, {}), " Citizen Center"],
          }),
        ],
      }),
      (0, G.jsxs)("div", {
        className: "text-[12px]",
        style: ga,
        children: [
          i ? "Passport" : "Visa",
          " ",
          Dl(e),
          " \xB7 ",
          i && (e.passportNo ?? e.no) <= 1e3 ? "Founding Citizen \xB7 " : "",
          "Home city ",
          n.name,
          " \xB7 Tip: add your real photo in Settings \u2192 Avatar and it appears on your passport.",
        ],
      }),
      (0, G.jsxs)("div", { className: "font-bold text-sm pt-1", children: ["My land (", o.length, ")"] }),
      o.length === 0
        ? (0, G.jsx)("div", {
            className: "text-[12px]",
            style: ga,
            children: "No plots yet. Land in your home city and the Capital Quarter is open to you.",
          })
        : (0, G.jsx)("div", {
            className: "grid sm:grid-cols-2 gap-2",
            children: o.map((l) =>
              (0, G.jsxs)(
                "div",
                {
                  className: "space-y-1",
                  children: [
                    (0, G.jsx)(f9, { kind: "plot", id: l.id }),
                    (0, G.jsxs)("div", {
                      className: "flex gap-1",
                      children: [
                        (0, G.jsx)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: () => C({ nationTab: "land", landFocus: l.id }),
                          children: "Manage",
                        }),
                        (0, G.jsxs)("button", {
                          className: "btn btn-ghost btn-sm",
                          onClick: () => C({ shareCard: { kind: "plot", id: l.id } }),
                          children: [(0, G.jsx)(ni, {}), " Share"],
                        }),
                      ],
                    }),
                  ],
                },
                l.id,
              ),
            ),
          }),
    ],
  });
}
function uB() {
  let t = Y(),
    e = Zi(),
    a = t.landFocus ? Ws(t.landFocus) : null,
    [r, o] = (0, go.useState)(a?.district || (e ? Il(e.interest).id : "tech"));
  (0, go.useEffect)(() => {
    a && o(a.district);
  }, [a?.id]);
  let n = qi(r),
    i = Ya.filter((m) => m.district === r),
    s = a && a.district === r ? a : null,
    l = i.map((m) => m.x),
    c = i.map((m) => m.z),
    d = Math.min(...l),
    h = Math.min(...c),
    u = n.cols,
    p = n.rows,
    v = 46,
    g = Zp(r);
  return (0, G.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, G.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: Hr.map((m) => {
          let f = Ya.filter((x) => x.district === m.id && Za(t)[x.id]).length,
            y = Ya.filter((x) => x.district === m.id).length;
          return (0, G.jsxs)(
            "button",
            {
              className: `chip ${r === m.id ? "chip-on" : ""}`,
              onClick: () => {
                (o(m.id), C({ landFocus: null }));
              },
              children: [
                (0, G.jsx)("span", { className: "w-2 h-2 rounded-full", style: { background: m.color } }),
                m.name,
                " ",
                (0, G.jsxs)("span", { className: "opacity-70", children: [f, "/", y] }),
              ],
            },
            m.id,
          );
        }),
      }),
      (0, G.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, G.jsxs)("div", {
            className: "flex items-start gap-2",
            children: [
              (0, G.jsxs)("div", {
                className: "flex-1",
                children: [
                  (0, G.jsx)("div", { className: "font-bold text-sm", children: n.name }),
                  (0, G.jsxs)("div", {
                    className: "text-[11px]",
                    style: ga,
                    children: [
                      n.tagline,
                      " \xB7 from ",
                      q(n.base),
                      " \xB7 ",
                      n.interest === "all"
                        ? "open to every citizen"
                        : `for ${Wl.find((m) => m.id === n.interest).label} citizens`,
                    ],
                  }),
                ],
              }),
              (0, G.jsxs)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => xa({ x: n.x * 0.82, z: n.z * 0.82, face: { x: n.x, z: n.z } }),
                children: [(0, G.jsx)(dr, {}), " Go there"],
              }),
            ],
          }),
          !g.ok &&
            (0, G.jsx)("div", {
              className: "text-[11px] mt-2 rounded-md px-2 py-1.5",
              style: { background: "rgba(255,154,60,.12)", color: "var(--ember-hi)" },
              children: g.why,
            }),
          (0, G.jsxs)("svg", {
            viewBox: `0 0 ${u * v + 20} ${p * v + 34}`,
            className: "w-full max-w-[360px] mx-auto block mt-2",
            role: "img",
            "aria-label": `Map of ${n.name}`,
            children: [
              (0, G.jsx)("text", {
                x: (u * v + 20) / 2,
                y: "12",
                textAnchor: "middle",
                fontSize: "9",
                fill: "rgba(255,255,255,.5)",
                children: "toward the capital \u25B2",
              }),
              i.map((m) => {
                let f = Za(t)[m.id],
                  y = f?.owner === t.session?.userId,
                  x = 10 + ((m.x - d) / n.gap) * v,
                  k = 20 + ((m.z - h) / n.gap) * v,
                  b = y
                    ? "#ff9a3c"
                    : f
                      ? f.forSale
                        ? "#3e6b4f"
                        : "rgba(255,255,255,.18)"
                      : m.tier === "prime"
                        ? "#2f6fe0"
                        : m.tier === "central"
                          ? "#24508f"
                          : "#1d3a63";
                return (0, G.jsxs)(
                  "g",
                  {
                    onClick: () => C({ landFocus: m.id }),
                    style: { cursor: "pointer" },
                    children: [
                      (0, G.jsx)("rect", {
                        x: x + 3,
                        y: k + 3,
                        width: v - 6,
                        height: v - 6,
                        rx: "5",
                        fill: b,
                        stroke: s?.id === m.id ? "#fff" : "transparent",
                        strokeWidth: "2",
                      }),
                      (0, G.jsx)("text", {
                        x: x + v / 2,
                        y: k + v / 2 + 3,
                        textAnchor: "middle",
                        fontSize: "9",
                        fontWeight: "700",
                        fill: "#fff",
                        children: m.n,
                      }),
                    ],
                  },
                  m.id,
                );
              }),
            ],
          }),
          (0, G.jsx)("div", {
            className: "flex flex-wrap gap-2 justify-center text-[10px] mt-1",
            style: ga,
            children: [
              ["#2f6fe0", "Prime"],
              ["#24508f", "Central"],
              ["#1d3a63", "Standard"],
              ["#3e6b4f", "Resale"],
              ["rgba(255,255,255,.3)", "Owned"],
              ["#ff9a3c", "Yours"],
            ].map(([m, f]) =>
              (0, G.jsxs)(
                "span",
                {
                  className: "inline-flex items-center gap-1",
                  children: [
                    (0, G.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm", style: { background: m } }),
                    f,
                  ],
                },
                f,
              ),
            ),
          }),
        ],
      }),
      s
        ? (0, G.jsx)(pB, { id: s.id })
        : (0, G.jsx)("div", {
            className: "text-[12px] text-center",
            style: ga,
            children:
              "Tap a plot on the map to see its price and owner. The front row (closest to the capital) costs the most.",
          }),
    ],
  });
}
function pB({ id: t }) {
  let e = Y(),
    a = Ws(t),
    r = Za(e)[t],
    o = r?.owner === e.session?.userId,
    n = Zp(a.district),
    i = Rh(a),
    s = r ? r.forSale : a.price,
    [l, c] = (0, go.useState)(r?.use || Mp[a.district][0]),
    [d, h] = (0, go.useState)(r?.sign || ""),
    [u, p] = (0, go.useState)(String(Math.round(i * 1.2))),
    v = () => {
      let g = (Math.hypot(a.x, a.z) - a.size / 2 - 4) / Math.hypot(a.x, a.z);
      xa({ x: a.x * g, z: a.z * g, face: { x: a.x, z: a.z } });
    };
  return (0, G.jsxs)("div", {
    className: "card p-3 space-y-2",
    children: [
      (0, G.jsxs)("div", {
        className: "flex items-start gap-2",
        children: [
          (0, G.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, G.jsxs)("div", {
                className: "font-bold",
                children: [
                  "Plot ",
                  a.id,
                  " ",
                  (0, G.jsx)("span", { className: "chip ml-1", children: js[a.tier].label }),
                ],
              }),
              (0, G.jsxs)("div", {
                className: "text-[11px]",
                style: ga,
                children: [qi(a.district).name, " \xB7 ", a.size, " x ", a.size, " m \xB7 ", js[a.tier].desc],
              }),
            ],
          }),
          (0, G.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: v,
            children: [(0, G.jsx)(dr, {}), " Visit"],
          }),
        ],
      }),
      (0, G.jsx)("div", {
        className: "grid grid-cols-3 gap-2 text-center",
        children: [
          ["List price", q(a.price)],
          ["Market value", q(i)],
          [r ? "Owner" : "Status", r ? r.ownerName : "For sale"],
        ].map(([g, m]) =>
          (0, G.jsxs)(
            "div",
            {
              className: "rounded-md py-1.5",
              style: { background: "rgba(255,255,255,.04)" },
              children: [
                (0, G.jsx)("div", { className: "text-[12px] font-bold truncate px-1", children: m }),
                (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: g }),
              ],
            },
            g,
          ),
        ),
      }),
      r?.use &&
        (0, G.jsxs)("div", {
          className: "text-[12px]",
          children: [(0, G.jsx)(ld, { className: "inline" }), " ", r.use, r.sign ? ` \xB7 "${r.sign}"` : ""],
        }),
      !o &&
        s != null &&
        (0, G.jsxs)(G.Fragment, {
          children: [
            (0, G.jsxs)("div", {
              className: "text-[11px]",
              style: ga,
              children: [
                "Price ",
                q(s),
                " + ",
                Math.round(Yc * 100),
                "% transfer tax ",
                q(Math.round(s * Yc)),
                " = ",
                (0, G.jsx)("b", { style: { color: "var(--ink)" }, children: q(s + Math.round(s * Yc)) }),
                ". Paid through escrow; the deed is yours at once.",
              ],
            }),
            (0, G.jsx)("button", {
              className: "btn btn-primary w-full",
              disabled: !n.ok,
              onClick: () => y8(a.id),
              children: n.ok ? (r ? `Buy from ${r.ownerName}` : "Buy this plot") : n.why,
            }),
          ],
        }),
      !o &&
        s == null &&
        (0, G.jsx)("div", {
          className: "text-[12px]",
          style: ga,
          children: "Owned and not for sale right now.",
        }),
      o &&
        (0, G.jsxs)("div", {
          className: "space-y-2",
          children: [
            (0, G.jsx)("div", { className: "text-[12px] font-bold", children: "Build on your plot" }),
            (0, G.jsxs)("div", {
              className: "flex gap-1.5",
              children: [
                (0, G.jsx)("select", {
                  className: "field py-2 text-sm",
                  value: l,
                  onChange: (g) => c(g.target.value),
                  children: [...Mp[a.district], "Home"].map((g) => (0, G.jsx)("option", { children: g }, g)),
                }),
                (0, G.jsx)("input", {
                  className: "field py-2 text-sm",
                  value: d,
                  onChange: (g) => h(g.target.value),
                  placeholder: "Sign on the building",
                  maxLength: 28,
                }),
              ],
            }),
            (0, G.jsxs)("button", {
              className: "btn btn-primary btn-sm",
              onClick: () => k8(a.id, l, d),
              children: [(0, G.jsx)(ld, {}), " Build"],
            }),
            (0, G.jsx)("div", { className: "text-[12px] font-bold pt-1", children: "Sell" }),
            (0, G.jsxs)("div", {
              className: "flex gap-1.5 items-center",
              children: [
                (0, G.jsx)("input", {
                  className: "field py-2 text-sm",
                  inputMode: "numeric",
                  value: u,
                  onChange: (g) => p(g.target.value.replace(/\D/g, "")),
                  "aria-label": "Asking price in FYC",
                }),
                r?.forSale
                  ? (0, G.jsx)("button", {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => $v(a.id, null),
                      children: "Unlist",
                    })
                  : (0, G.jsxs)("button", {
                      className: "btn btn-ghost btn-sm",
                      onClick: () => $v(a.id, Number(u)),
                      children: [(0, G.jsx)(Xh, {}), " List"],
                    }),
                (0, G.jsx)("button", {
                  className: "btn btn-ghost btn-sm whitespace-nowrap",
                  onClick: () => b8(a.id),
                  children: "Land Bank 90%",
                }),
              ],
            }),
            (0, G.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => C({ shareCard: { kind: "plot", id: a.id } }),
              children: [(0, G.jsx)(ni, {}), " Share my deed"],
            }),
          ],
        }),
    ],
  });
}
function gB() {
  return Y().net.status === "online"
    ? (0, G.jsxs)("div", {
        className: "card p-4 space-y-2 text-sm",
        "data-parl-live": !0,
        children: [
          (0, G.jsx)("div", { className: "font-bold", children: "Parliament is elected by the citizens" }),
          (0, G.jsx)("div", {
            style: { color: "var(--ink-dim)" },
            children:
              "Found a party, stand for Mayor of your city, and vote for one party \u2014 the 21 seats of Parliament are shared out by party votes.",
          }),
          (0, G.jsx)("button", {
            id: "parl-open",
            className: "btn btn-primary btn-sm",
            onClick: () => ai(),
            children: "Open Elections & parties",
          }),
        ],
      })
    : (0, G.jsx)(fB, {});
}
function fB() {
  let t = Y(),
    e = Zi(),
    a = Gl(),
    r = (0, go.useMemo)(() => au(a), [t.myVotes, t.plots, t.wallets, t.passports]),
    o = (0, go.useMemo)(() => Kp(), [t.plots, t.passports]),
    n = t.myVotes[a],
    i = Math.max(1, ...r.map((v) => v.votes)),
    s = Math.max(0, yv(a) - Date.now()),
    l = Math.floor(s / 864e5),
    c = Math.floor(s / 36e5) % 24,
    d = _v(),
    h = d[d.length - 1],
    u = d.some((v) => v.isMe),
    p =
      (t.wallets[t.session.userId] || 0) +
      Ya.filter((v) => Za(t)[v.id]?.owner === t.session?.userId).reduce((v, g) => v + Rh(g), 0);
  return (0, G.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, G.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, G.jsxs)("div", {
            className: "font-bold text-sm",
            children: ["Election week ", a, " \xB7 closes in ", l, "d ", c, "h"],
          }),
          (0, G.jsx)("div", {
            className: "text-[11px] mt-1",
            style: ga,
            children:
              "The 10 citizens with the most FYC (cash + land value) and a clean record are this week's candidates. Every citizen has one vote. The winner becomes Prime Minister; the rest lead the ministries in vote order.",
          }),
          !u &&
            e &&
            h &&
            (0, G.jsxs)("div", {
              className: "text-[11px] mt-1.5",
              style: { color: "var(--ember-hi)" },
              children: [
                "To stand for election you need ",
                q(Math.max(0, h.worth - p + 1)),
                " more worth than now (10th place has ",
                q(h.worth),
                ").",
              ],
            }),
        ],
      }),
      (0, G.jsx)("div", {
        className: "space-y-1.5",
        children: r.map((v, g) =>
          (0, G.jsxs)(
            "div",
            {
              className: "rounded-lg p-2",
              style: { border: `1px solid ${n === v.id ? "var(--accent)" : "var(--line)"}` },
              children: [
                (0, G.jsxs)("div", {
                  className: "flex items-center gap-2",
                  children: [
                    (0, G.jsx)("span", {
                      className: "w-6 text-center font-bold tabular",
                      style: ga,
                      children: g + 1,
                    }),
                    (0, G.jsx)("span", {
                      className: "w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold",
                      style: { background: v.color },
                      children: v.name[0],
                    }),
                    (0, G.jsxs)("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        (0, G.jsxs)("div", {
                          className: "text-sm font-bold truncate",
                          children: [
                            v.name,
                            v.isMe ? " (you)" : "",
                            " ",
                            (0, G.jsx)(yr, {
                              className: "inline text-[12px]",
                              style: { color: "#45e0ae" },
                              "aria-label": "Clean record",
                            }),
                          ],
                        }),
                        (0, G.jsxs)("div", {
                          className: "text-[10px] truncate",
                          style: ga,
                          children: [
                            qp(v.passport),
                            " \xB7 worth ",
                            q(v.worth),
                            " \xB7 ",
                            v.plots,
                            " plots \xB7 would lead ",
                            v.ministry.name,
                          ],
                        }),
                      ],
                    }),
                    e &&
                      !n &&
                      (0, G.jsx)("button", {
                        className: "btn btn-primary btn-sm",
                        onClick: () => M8(v.id),
                        children: "Vote",
                      }),
                    n === v.id &&
                      (0, G.jsxs)("span", {
                        className: "chip chip-on",
                        children: [(0, G.jsx)(_e, {}), " Your vote"],
                      }),
                  ],
                }),
                (0, G.jsx)("div", {
                  className: "h-1.5 rounded-full mt-1.5 ml-8",
                  style: { background: "rgba(255,255,255,.06)" },
                  children: (0, G.jsx)("div", {
                    className: "h-full rounded-full",
                    style: {
                      width: `${(v.votes / i) * 100}%`,
                      background: g === 0 ? "var(--ember)" : "var(--accent)",
                    },
                  }),
                }),
                (0, G.jsxs)("div", {
                  className: "text-[10px] ml-8 mt-0.5 tabular",
                  style: ga,
                  children: [v.votes.toLocaleString(), " votes"],
                }),
              ],
            },
            v.id,
          ),
        ),
      }),
      !e &&
        (0, G.jsx)("div", { className: "text-[12px]", style: ga, children: "Get your passport to vote." }),
      (0, G.jsxs)("div", {
        className: "font-bold text-sm pt-2",
        children: [(0, G.jsx)(Us, { className: "inline" }), " Cabinet elected last week"],
      }),
      (0, G.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-1.5",
        children: o.map((v) =>
          (0, G.jsxs)(
            "div",
            {
              className: "rounded-lg p-2",
              style: { border: "1px solid var(--line)" },
              children: [
                (0, G.jsx)("div", {
                  className: "text-[10px] font-bold tracking-wide",
                  style: { color: "var(--ember-hi)" },
                  children: v.ministry.name.toUpperCase(),
                }),
                (0, G.jsx)("div", { className: "text-sm font-bold", children: v.name }),
                (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: v.ministry.duty }),
              ],
            },
            v.id,
          ),
        ),
      }),
      (0, G.jsxs)("button", {
        className: "btn btn-ghost btn-sm",
        onClick: () => xa({ x: Ha.parliament.x + 12, z: Ha.parliament.z + 26, face: Ha.parliament }),
        children: [(0, G.jsx)(dr, {}), " Visit Parliament"],
      }),
    ],
  });
}
function mB() {
  let t = Y(),
    e = t.session.userId,
    a = t.wallets[e] || 0,
    r = t.txns
      .filter((o) => o.userId === e)
      .slice(-8)
      .reverse();
  return (0, G.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, G.jsxs)("div", {
        className: "card p-3 flex items-center gap-3",
        children: [
          (0, G.jsx)(vg, { className: "text-2xl", style: { color: "var(--ember)" } }),
          (0, G.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, G.jsx)("div", { className: "text-[11px]", style: ga, children: "Your balance" }),
              (0, G.jsx)("div", { className: "text-xl font-bold tabular", children: q(a) }),
            ],
          }),
          (0, G.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => xa({ x: Ha.bank.x + 14, z: Ha.bank.z - 18, face: Ha.bank }),
            children: [(0, G.jsx)(dr, {}), " Visit the bank"],
          }),
        ],
      }),
      (0, G.jsx)("div", {
        className: "text-[12px]",
        style: ga,
        children:
          "Fyrus Coin (FYC) is the in-city credit of the republic: you buy land, products and services with it, and sellers earn it. It is not a cryptocurrency. Real checkout opens with the payment gateway; during the beta the packs below are free test coins.",
      }),
      (0, G.jsx)("div", {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-1.5",
        children: [1e3, 5e3, 25e3, 1e5].map((o) =>
          (0, G.jsxs)(
            "button",
            {
              className: "rounded-lg p-2.5 text-center",
              style: { border: "1px solid var(--line)" },
              onClick: () => L8(o),
              children: [
                (0, G.jsx)("div", { className: "font-bold tabular", children: o.toLocaleString() }),
                (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: "FYC \xB7 test pack" }),
              ],
            },
            o,
          ),
        ),
      }),
      (0, G.jsxs)("div", {
        className: "card p-3 grid grid-cols-2 gap-2 text-center",
        children: [
          (0, G.jsxs)("div", {
            children: [
              (0, G.jsx)("div", { className: "font-bold tabular", children: q(t.treasury) }),
              (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: "National treasury" }),
            ],
          }),
          (0, G.jsxs)("div", {
            children: [
              (0, G.jsxs)("div", { className: "font-bold", children: [Math.round(Yc * 100), "%"] }),
              (0, G.jsx)("div", { className: "text-[10px]", style: ga, children: "Transfer tax on land" }),
            ],
          }),
        ],
      }),
      (0, G.jsx)("div", { className: "font-bold text-sm", children: "Recent transactions" }),
      (0, G.jsx)("div", {
        className: "space-y-1",
        children: r.length
          ? r.map((o) =>
              (0, G.jsxs)(
                "div",
                {
                  className: "flex text-[12px] gap-2",
                  children: [
                    (0, G.jsx)("span", { className: "flex-1 truncate", children: o.label }),
                    (0, G.jsxs)("span", {
                      className: "tabular font-bold",
                      style: { color: o.amount < 0 ? "#ff8a80" : "#45e0ae" },
                      children: [o.amount > 0 ? "+" : "", q(o.amount)],
                    }),
                  ],
                },
                o.id,
              ),
            )
          : (0, G.jsx)("div", { className: "text-[12px]", style: ga, children: "No transactions yet." }),
      }),
    ],
  });
}
