function kx() {
  let t = Y(),
    e = t.productView,
    a = t.brands.find((i) => i.id === e.brandId),
    r = a?.products.find((i) => i.id === e.productId),
    o = (0, Bg.useRef)(null);
  if (
    ((0, Bg.useEffect)(() => {
      if (!o.current || !r) return;
      let i = o.current,
        s;
      try {
        s = new Oe.WebGLRenderer({ antialias: !0, alpha: !0 });
      } catch {
        return;
      }
      (s.setPixelRatio(Math.min(devicePixelRatio, 2)),
        (s.outputEncoding = Oe.sRGBEncoding),
        (s.toneMapping = Oe.ACESFilmicToneMapping),
        i.appendChild(s.domElement),
        (s.domElement.style.width = "100%"),
        (s.domElement.style.height = "100%"));
      let l = new Oe.Scene(),
        c = new Oe.PerspectiveCamera(40, 1, 0.1, 50);
      l.add(new Oe.HemisphereLight("#bcd8ff", "#0a1430", 1.1));
      let d = new Oe.DirectionalLight("#ffd2a8", 1.6);
      (d.position.set(3, 4, 3), l.add(d));
      let h = new Oe.DirectionalLight("#4da3ff", 1.4);
      (h.position.set(-3, 2, -3), l.add(h));
      let u = pd(r),
        p = new Oe.Box3().setFromObject(u),
        v = p.getSize(new Oe.Vector3()),
        g = p.getCenter(new Oe.Vector3());
      u.position.sub(g);
      let m = new Oe.Group();
      (m.add(u), l.add(m));
      let f = new Oe.Mesh(
        new Oe.CylinderGeometry(1.1, 1.2, 0.08, 64),
        new Oe.MeshStandardMaterial({ color: "#13254a", metalness: 0.8, roughness: 0.3 }),
      );
      ((f.position.y = -v.y / 2 - 0.06), l.add(f));
      let y = new Oe.Mesh(
        new Oe.TorusGeometry(1.15, 0.02, 8, 80),
        new Oe.MeshBasicMaterial({ color: a.color }),
      );
      ((y.rotation.x = Math.PI / 2), (y.position.y = f.position.y + 0.05), l.add(y));
      let x = Math.max(v.x, v.y, v.z) * 2.4 + 0.8,
        k = 0.6,
        b = 0.25,
        w = !1,
        L = 0,
        E = 0,
        T = !0,
        S = () => {
          let zt = i.clientWidth || 1,
            Pe = i.clientHeight || 1;
          (s.setSize(zt, Pe, !1), (c.aspect = zt / Pe), c.updateProjectionMatrix());
        },
        H = new ResizeObserver(S);
      (H.observe(i), S());
      let N = (zt) => {
          ((w = !0), (T = !1), (L = zt.clientX), (E = zt.clientY));
        },
        B = (zt) => {
          w &&
            ((k -= (zt.clientX - L) * 0.01),
            (b = Math.max(-0.6, Math.min(1.1, b + (zt.clientY - E) * 0.008))),
            (L = zt.clientX),
            (E = zt.clientY));
        },
        X = () => (w = !1),
        M = (zt) => {
          (zt.preventDefault(), (x = Math.max(1.2, Math.min(8, x + zt.deltaY * 0.004))));
        };
      (s.domElement.addEventListener("pointerdown", N),
        window.addEventListener("pointermove", B),
        window.addEventListener("pointerup", X),
        s.domElement.addEventListener("wheel", M, { passive: !1 }));
      let _ = 0,
        lt = performance.now(),
        vt = () => {
          let zt = (performance.now() - lt) / 1e3;
          (T && (k += 0.008),
            (m.position.y = Math.sin(zt * 1.4) * 0.04),
            c.position.set(Math.sin(k) * Math.cos(b) * x, Math.sin(b) * x, Math.cos(k) * Math.cos(b) * x),
            c.lookAt(0, 0, 0),
            s.render(l, c),
            (_ = requestAnimationFrame(vt)));
        };
      return (
        vt(),
        () => {
          (cancelAnimationFrame(_),
            H.disconnect(),
            window.removeEventListener("pointermove", B),
            window.removeEventListener("pointerup", X),
            s.dispose(),
            s.forceContextLoss?.(),
            s.domElement.remove());
        }
      );
    }, [e.productId]),
    !a || !r)
  )
    return null;
  let n = () => C({ productView: null });
  return (0, Ka.jsx)("div", {
    className: "fixed inset-0 z-[75] grid place-items-center p-3",
    style: { background: "rgba(2,6,20,.82)" },
    onClick: n,
    children: (0, Ka.jsxs)("div", {
      className:
        "glass-strong rounded-3xl w-full max-w-[860px] grid md:grid-cols-[1.2fr_1fr] overflow-hidden pop-in",
      onClick: (i) => i.stopPropagation(),
      children: [
        (0, Ka.jsxs)("div", {
          className: "relative min-h-[320px] md:min-h-[460px]",
          style: { background: `radial-gradient(circle at 50% 40%, ${a.color}33, transparent 60%), #06102b` },
          children: [
            (0, Ka.jsx)("div", {
              ref: o,
              className: "absolute inset-0",
              style: { cursor: "grab", touchAction: "none" },
            }),
            (0, Ka.jsxs)("div", {
              className: "absolute left-3 top-3 chip",
              style: { background: "rgba(0,0,0,.45)" },
              children: [(0, Ka.jsx)($8, {}), " Drag to rotate \xB7 scroll to zoom"],
            }),
          ],
        }),
        (0, Ka.jsxs)("div", {
          className: "p-5 flex flex-col",
          children: [
            (0, Ka.jsxs)("div", {
              className: "flex items-center gap-2",
              children: [
                (0, Ka.jsx)("div", {
                  className: "text-xs font-bold uppercase tracking-widest",
                  style: { color: a.color },
                  children: a.name,
                }),
                a.verified && (0, Ka.jsx)(Jl, { style: { color: "var(--blue-hi)" } }),
                a.founding &&
                  (0, Ka.jsx)("span", {
                    className: "chip",
                    style: { color: "var(--ember-hi)" },
                    children: "\u2605 Founding Partner",
                  }),
                (0, Ka.jsx)("button", {
                  className: "ml-auto btn btn-ghost btn-sm px-2",
                  onClick: n,
                  "aria-label": "Close",
                  children: (0, Ka.jsx)(pe, {}),
                }),
              ],
            }),
            (0, Ka.jsx)("h2", { className: "font-display text-2xl font-bold mt-2", children: r.name }),
            (0, Ka.jsx)("p", {
              className: "text-sm mt-2",
              style: { color: "var(--ink-dim)" },
              children: r.desc,
            }),
            (0, Ka.jsx)("div", { className: "font-display text-3xl tabular mt-4", children: q(r.price) }),
            (0, Ka.jsxs)("div", {
              className: "text-xs mt-1",
              style: { color: "var(--ink-dim)" },
              children: ["Free shipping in the demo \xB7 30-day returns from ", a.name],
            }),
            (0, Ka.jsx)("div", {
              className: "flex gap-2 mt-auto pt-6",
              children: (0, Ka.jsxs)("button", {
                className: "btn btn-ember flex-1 py-3",
                onClick: () => {
                  (Fh(a.id, r.id), n());
                },
                id: "buy-product",
                children: [(0, Ka.jsx)(Yl, {}), " Buy now"],
              }),
            }),
            (0, Ka.jsx)("div", {
              className: "flex gap-1.5 flex-wrap mt-4",
              children: a.products
                .filter((i) => i.id !== r.id)
                .map((i) =>
                  (0, Ka.jsxs)(
                    "button",
                    {
                      className: "chip",
                      onClick: () => C({ productView: { brandId: a.id, productId: i.id } }),
                      children: [i.name, " \xB7 ", q(i.price)],
                    },
                    i.id,
                  ),
                ),
            }),
          ],
        }),
      ],
    }),
  });
}
var QE = P(Zt(), 1),
  k0 = P(ct(), 1),
  Go = class extends QE.Component {
    constructor() {
      super(...arguments);
      this.state = { err: null };
    }
    static getDerivedStateFromError(a) {
      return { err: String(a?.message || a) };
    }
    componentDidCatch(a) {
      console.error("[Fyrus]", a);
    }
    render() {
      return this.state.err
        ? (0, k0.jsxs)("div", {
            className: "glass rounded-2xl p-4 text-sm m-2",
            children: [
              (0, k0.jsxs)("b", { children: [this.props.label || "This part", " hit a problem."] }),
              (0, k0.jsx)("div", {
                className: "text-xs mt-1",
                style: { color: "var(--ink-dim)" },
                children: this.state.err,
              }),
              (0, k0.jsx)("button", {
                className: "btn btn-ghost btn-sm mt-2",
                onClick: () => {
                  (this.setState({ err: null }), this.props.onReset?.());
                },
                children: "Close",
              }),
            ],
          })
        : this.props.children;
    }
  };
var pu = P(Zt(), 1);
var Vo = P(ct(), 1),
  bx = ["Marina Skyline", "Fyrus Core Plaza", "Fyrus Market", "Skyline Club", "Your street"];
function wx() {
  let t = Y(),
    e = t.users.find((n) => n.id === t.session?.userId),
    [a, r] = (0, pu.useState)(0);
  ((0, pu.useEffect)(() => {
    let n = performance.now(),
      i = setInterval(() => {
        let s = (performance.now() - n) / 1e3;
        (r(s), s > 14.5 && Rp());
      }, 100);
    return () => clearInterval(i);
  }, []),
    (0, pu.useEffect)(() => {
      let n = (i) => {
        (i.key === "Escape" || i.key === " " || i.key === "Enter") && (i.preventDefault(), Rp());
      };
      return (window.addEventListener("keydown", n), () => window.removeEventListener("keydown", n));
    }, []));
  let o = bx[Math.min(bx.length - 1, Math.floor((a / 14) * bx.length))];
  return (0, Vo.jsxs)("div", {
    className: "fixed inset-0 z-[70] pointer-events-none",
    children: [
      (0, Vo.jsx)("div", { className: "absolute inset-x-0 top-0 h-[10vh] bg-black" }),
      (0, Vo.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-[10vh] bg-black" }),
      (0, Vo.jsx)("div", {
        className: "absolute inset-0 grid place-items-center text-center",
        children:
          a < 6.5 &&
          (0, Vo.jsxs)("div", {
            className: "intro-title",
            children: [
              (0, Vo.jsx)("div", {
                className: "flex justify-center mb-3",
                style: { filter: "drop-shadow(0 2px 8px rgba(0,0,0,.6))" },
                children: (0, Vo.jsx)(u0, { height: 44, tm: !1 }),
              }),
              (0, Vo.jsx)("div", {
                className: "hud-font text-white hud-text-shadow",
                style: { fontSize: "clamp(40px, 8vw, 96px)", lineHeight: 0.95 },
                children: "WELCOME TO FYRUS CITY",
              }),
              (0, Vo.jsxs)("div", {
                className: "text-white/85 hud-text-shadow mt-3 text-sm md:text-base",
                children: [e ? `${e.name.split(" ")[0]}, ` : "", "the city of AI creators \xB7 2040"],
              }),
            ],
          }),
      }),
      a >= 6.5 &&
        (0, Vo.jsxs)(
          "div",
          {
            className: "absolute left-[6vw] bottom-[14vh] intro-title",
            children: [
              (0, Vo.jsx)("div", {
                className: "text-[11px] tracking-[.4em] text-white/70 hud-text-shadow",
                children: "NOW PASSING",
              }),
              (0, Vo.jsx)("div", {
                className: "hud-font text-white hud-text-shadow text-4xl md:text-5xl",
                children: o.toUpperCase(),
              }),
            ],
          },
          o,
        ),
      (0, Vo.jsx)("button", {
        className:
          "absolute right-[4vw] bottom-[3.5vh] pointer-events-auto text-white/90 text-sm font-bold hud-box px-4 py-2",
        onClick: Rp,
        id: "skip-intro",
        children: "Skip \u203A",
      }),
    ],
  });
}
var di = P(Zt(), 1);
var Br = P(ct(), 1),
  Mx = null;
function tL() {
  if (!Mx) {
    let t = window.claude;
    Mx = t?.use ? t.use("sample").catch(() => null) : Promise.resolve(null);
  }
  return Mx;
}
var eL = !1,
  qH = `Fyrus City facts: year 2040, a clean Singapore-like smart city. Places: ${Oa.map((t) => `${t.name} (${t.desc})`).join("; ")}. The market street runs east from the Core: AI agent shops, AI service shops, brand stores, Orbit Coffee, Game Street (Air Hockey, Hover Race, Orb Catcher, AI Trivia) and Skyline Club at the end. Everything is free during launch. Controls: WASD to walk, E to interact, Tab for the menu.`;
function aL(t, e) {
  let a = e.toLowerCase();
  return /market|shop|buy/.test(a)
    ? "Fyrus Market is just east of the Core plaza. Every shop has its own sign, and the board outside shows how many people visited today."
    : /club|bar|dance|music/.test(a)
      ? "Skyline Club is at the far end of the market street. DJ Lumen plays every night and Sam runs the bar."
      : /pool|swim/.test(a)
        ? "Lido Pool is north-west of the Core. Walk straight into the water to swim."
        : /game|play/.test(a)
          ? "Game Street is in the second half of the market. The red race car outside is Hover Race, give it a try!"
          : /fly|car|rocket/.test(a)
            ? "Head to SkyPort in the south-east. Flying cars and rockets are free right now."
            : /price|cost|worth/.test(a)
              ? rd("sales", e)
              : `${t.greeting} Ask me about the market, the club, the pool or the games.`;
}
function Ex() {
  let e = Y().talk,
    [a, r] = (0, di.useState)([{ role: "assistant", content: e.greeting }]),
    [o, n] = (0, di.useState)(""),
    [i, s] = (0, di.useState)(!1),
    [l, c] = (0, di.useState)(null),
    d = (0, di.useRef)(null),
    h = (0, di.useRef)(null);
  ((0, di.useEffect)(() => {
    tL().then((p) => c(!!p && !eL));
  }, []),
    (0, di.useEffect)(() => {
      h.current?.scrollTo({ top: 1e6, behavior: "smooth" });
    }, [a]),
    (0, di.useEffect)(() => {
      let p = (v) => {
        v.key === "Escape" && (d.current?.abort(), Pv());
      };
      return (
        window.addEventListener("keydown", p),
        () => {
          (window.removeEventListener("keydown", p), d.current?.abort());
        }
      );
    }, []));
  let u = async (p) => {
    if (((p = p.trim()), !p || i)) return;
    let v = [...a, { role: "user", content: p }];
    (r([...v, { role: "assistant", content: "\u2026" }]), n(""), s(!0));
    let g = (f) =>
        r((y) => {
          let x = y.slice();
          return ((x[x.length - 1] = { role: "assistant", content: f }), x);
        }),
      m = l ? await tL() : null;
    if (m) {
      let f = ot().users.find((k) => k.id === ot().session?.userId),
        x = [
          {
            role: "user",
            content: `[Scene setup \u2014 not from the visitor]
${`${e.persona}
${qH}
You are talking face to face with ${f?.name || "a visitor"} in the 3D city. Stay in character as ${e.name}. Reply in 1-3 short sentences, natural and warm. If they write in Roman Urdu or Hindi, reply in the same style. Never mention being an AI model unless asked directly.`}

The visitor walks up to you.`,
          },
          ...v.slice(0).map((k) => k),
        ];
      d.current = new AbortController();
      try {
        let k = await m(x, {
          onText: ({ text: b }) => g(b),
          signal: d.current.signal,
          modelTier: "quick",
          cache: !1,
        });
        g(k.text || "\u2026");
      } catch (k) {
        (k?.code === "not_granted" && ((eL = !0), c(!1)), k?.name !== "AbortError" && g(aL(e, p)));
      }
    } else (await new Promise((f) => setTimeout(f, 450)), g(aL(e, p)));
    s(!1);
  };
  return (0, Br.jsxs)("div", {
    className: "fixed z-[62] left-1/2 -translate-x-1/2 bottom-4 w-[min(94vw,560px)] glass rounded-xl pop-in",
    role: "dialog",
    "aria-label": `Talking to ${e.name}`,
    children: [
      (0, Br.jsxs)("div", {
        className: "flex items-center gap-3 px-4 py-3",
        style: { borderBottom: "1px solid var(--line)" },
        children: [
          (0, Br.jsx)("div", {
            className: "w-9 h-9 rounded-full grid place-items-center font-bold",
            style: { background: e.outfit.top, color: "#fff", boxShadow: `inset 0 0 0 2px ${e.outfit.skin}` },
            children: e.name[0],
          }),
          (0, Br.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, Br.jsx)("div", { className: "font-bold text-sm", children: e.name }),
              (0, Br.jsxs)("div", {
                className: "text-[11px] truncate",
                style: { color: "var(--ink-dim)" },
                children: [e.role, l ? " \xB7 AI resident" : ""],
              }),
            ],
          }),
          (0, Br.jsx)("button", {
            className: "hud-icon",
            style: { width: 32, height: 32 },
            onClick: () => {
              (d.current?.abort(), Pv());
            },
            "aria-label": "Close",
            children: (0, Br.jsx)(pe, {}),
          }),
        ],
      }),
      (0, Br.jsx)("div", {
        ref: h,
        className: "scroll-y px-4 py-3 space-y-2",
        style: { maxHeight: 240 },
        children: a.map((p, v) =>
          (0, Br.jsx)(
            "div",
            {
              className: `text-sm rounded-lg px-3 py-2 max-w-[85%] ${p.role === "user" ? "ml-auto" : ""}`,
              style: {
                background:
                  p.role === "user"
                    ? "color-mix(in srgb, var(--accent) 35%, transparent)"
                    : "rgba(255,255,255,.07)",
              },
              children: p.content,
            },
            v,
          ),
        ),
      }),
      (0, Br.jsxs)("div", {
        className: "px-3 pb-3",
        children: [
          (0, Br.jsx)("div", {
            className: "flex gap-1.5 flex-wrap mb-2",
            children: e.quick.map((p) =>
              (0, Br.jsx)("button", { className: "chip", disabled: i, onClick: () => u(p), children: p }, p),
            ),
          }),
          (0, Br.jsxs)("form", {
            className: "flex gap-2",
            onSubmit: (p) => {
              (p.preventDefault(), u(o));
            },
            children: [
              (0, Br.jsx)("input", {
                autoFocus: !0,
                className: "field py-2 text-sm",
                value: o,
                onChange: (p) => n(p.target.value),
                placeholder: `Say something to ${e.name}\u2026`,
              }),
              (0, Br.jsx)("button", {
                className: "btn btn-primary btn-sm",
                disabled: i || !o.trim(),
                "aria-label": "Send",
                children: (0, Br.jsx)(Da, {}),
              }),
            ],
          }),
          l === !1 &&
            (0, Br.jsx)("div", {
              className: "text-[10px] mt-1.5",
              style: { color: "var(--ink-dim)" },
              children: "Offline replies. Live AI conversations work on the published page.",
            }),
        ],
      }),
    ],
  });
}
var _s = P(Zt(), 1);
var Ct = P(ct(), 1),
  ZH = (t, e) => Eh[t].replace("{px}", String(e)),
  rL = null,
  KH = () =>
    rL || (rL = window.claude?.use ? window.claude.use("sample").catch(() => null) : Promise.resolve(null));
function XH({ agentId: t, color: e }) {
  let r = Y().agents.find((u) => u.id === t),
    [o, n] = (0, _s.useState)([]),
    [i, s] = (0, _s.useState)(""),
    [l, c] = (0, _s.useState)(!1),
    d = (0, _s.useRef)(null);
  (0, _s.useEffect)(() => () => d.current?.abort(), []);
  let h = async () => {
    let u = i.trim();
    if (!u || l) return;
    (s(""), c(!0), n((g) => [...g, { me: !0, t: u }, { me: !1, t: "\u2026" }]));
    let p = (g) =>
        n((m) => {
          let f = m.slice();
          return ((f[f.length - 1] = { me: !1, t: g }), f);
        }),
      v = await KH();
    if (v) {
      d.current = new AbortController();
      try {
        let g = await v(
          `You are "${r.name}", an AI agent sold in Fyrus Market. What you do: ${r.tagline}. Skills: ${r.skills.join(", ")}. This is a short free demo for a shopper. Do a compact, useful demo of your job for this request (max 90 words), then one line on what the full version adds.

Shopper request: ${u}`,
          { onText: ({ text: m }) => p(m), signal: d.current.signal, modelTier: "quick", cache: !1 },
        );
        p(g.text);
      } catch (g) {
        g?.name !== "AbortError" && p(rd(r.persona, u));
      }
    } else p(rd(r.persona, u));
    c(!1);
  };
  return (0, Ct.jsxs)("div", {
    className: "rounded-lg p-3",
    style: { background: "rgba(0,0,0,.25)", border: "1px solid var(--line)" },
    children: [
      (0, Ct.jsx)("div", {
        className: "text-xs font-bold mb-2",
        style: { color: e },
        children: "Free live demo",
      }),
      (0, Ct.jsx)("div", {
        className: "space-y-1.5 max-h-48 scroll-y mb-2",
        children: o.length
          ? o.map((u, p) =>
              (0, Ct.jsx)(
                "div",
                {
                  className: `text-sm whitespace-pre-wrap rounded-md px-2.5 py-1.5 ${u.me ? "ml-8" : "mr-8"}`,
                  style: { background: u.me ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.04)" },
                  children: u.t,
                },
                p,
              ),
            )
          : (0, Ct.jsxs)("div", {
              className: "text-xs",
              style: { color: "var(--ink-dim)" },
              children: [
                "Ask ",
                r.name,
                " to do something. Example: \u201C",
                r.category === "Research"
                  ? "Summarise the market for e-bikes"
                  : r.tagline.split(" ").slice(0, 5).join(" "),
                "\u201D.",
              ],
            }),
      }),
      (0, Ct.jsxs)("form", {
        className: "flex gap-2",
        onSubmit: (u) => {
          (u.preventDefault(), h());
        },
        children: [
          (0, Ct.jsx)("input", {
            className: "field py-2 text-sm",
            value: i,
            onChange: (u) => s(u.target.value),
            placeholder: "Type a task\u2026",
          }),
          (0, Ct.jsx)("button", {
            className: "btn btn-primary btn-sm",
            disabled: l || !i.trim(),
            "aria-label": "Run demo",
            children: (0, Ct.jsx)(Da, {}),
          }),
        ],
      }),
    ],
  });
}
function Lx() {
  let t = Y(),
    e = t.shopView,
    a = qa(t).find((v) => v.id === e);
  if (
    ((0, _s.useEffect)(() => {
      let v = (g) => {
        g.key === "Escape" && C({ shopView: null });
      };
      return (window.addEventListener("keydown", v), () => window.removeEventListener("keydown", v));
    }, []),
    !a)
  )
    return null;
  let r = ri(e),
    o = r.history[r.history.length - 1] || 0,
    n = r.visits ? (r.purchases / r.visits) * 100 : 0,
    i = t.scene.mode === "shop" && t.scene.owner === e,
    s = be(a.ownerId),
    l = () => C({ shopView: null }),
    c = a.kind === "agent" ? t.agents.find((v) => v.id === a.refId) || a.item : null,
    d = a.kind === "service" ? t.gigs.find((v) => v.id === a.refId) || a.item : null,
    h = a.kind === "brand" ? t.brands.find((v) => v.id === a.refId) || a.item : null,
    u = a.kind === "game" ? tn.find((v) => v.id === a.refId) : null,
    p = a.secondary;
  return (0, Ct.jsx)("div", {
    className: "fixed inset-0 z-[60] grid place-items-center p-3",
    style: { background: "rgba(0,0,0,.55)" },
    onClick: l,
    children: (0, Ct.jsxs)("div", {
      className: "w-full max-w-[640px] max-h-[92vh] rounded-xl overflow-hidden flex flex-col pop-in",
      style: { background: "#121418", border: "1px solid var(--line)" },
      onClick: (v) => v.stopPropagation(),
      role: "dialog",
      "aria-label": a.name,
      children: [
        (0, Ct.jsxs)("div", {
          className: "relative px-5 pt-5 pb-4",
          style: { background: a.primary },
          children: [
            (0, Ct.jsx)("button", {
              className: "absolute top-3 right-3 w-8 h-8 rounded-md grid place-items-center",
              style: { background: "rgba(0,0,0,.25)", color: "#fff" },
              onClick: l,
              "aria-label": "Close",
              children: (0, Ct.jsx)(pe, {}),
            }),
            (0, Ct.jsxs)("div", {
              className: "flex items-center gap-3",
              children: [
                (0, Ct.jsx)("div", {
                  className: "w-14 h-14 rounded-full grid place-items-center text-2xl shrink-0",
                  style: { background: p, color: a.primary, fontFamily: "Sora", fontWeight: 800 },
                  children: a.glyph || a.name[0],
                }),
                (0, Ct.jsxs)("div", {
                  className: "min-w-0",
                  children: [
                    (0, Ct.jsx)("div", {
                      className: "truncate leading-none",
                      style: { font: ZH(a.font, a.font === "display" ? 44 : 30), color: p },
                      children: a.name,
                    }),
                    (0, Ct.jsx)("div", {
                      className: "text-sm mt-1.5 truncate",
                      style: { color: p, opacity: 0.8 },
                      children: a.tagline,
                    }),
                  ],
                }),
              ],
            }),
            (0, Ct.jsxs)("div", {
              className: "flex gap-2 mt-4 text-xs",
              style: { color: p },
              children: [
                (0, Ct.jsxs)("span", {
                  className: "px-2 py-1 rounded",
                  style: { background: "rgba(0,0,0,.2)" },
                  children: [
                    (0, Ct.jsx)(si, { className: "inline -mt-0.5" }),
                    " ",
                    co(o),
                    " today \xB7 ",
                    co(r.visits),
                    " total",
                  ],
                }),
                (0, Ct.jsxs)("span", {
                  className: "px-2 py-1 rounded",
                  style: { background: "rgba(0,0,0,.2)" },
                  children: [
                    (0, Ct.jsx)(ko, { className: "inline -mt-0.5" }),
                    " ",
                    co(r.purchases),
                    " ",
                    a.kind === "game" ? "plays" : "purchases",
                  ],
                }),
                (0, Ct.jsx)("span", {
                  className: "px-2 py-1 rounded hidden sm:inline",
                  style: { background: "rgba(0,0,0,.2)" },
                  children: a.kind === "game" ? "free to play" : `${n.toFixed(1)}% buy`,
                }),
              ],
            }),
          ],
        }),
        (0, Ct.jsxs)("div", {
          className: "p-5 scroll-y space-y-4 flex-1 min-h-0",
          children: [
            s &&
              (0, Ct.jsxs)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children: [
                  "Run by ",
                  (0, Ct.jsx)("b", { style: { color: "var(--ink)" }, children: s.name }),
                  " \xB7 ",
                  s.title,
                ],
              }),
            c &&
              (0, Ct.jsxs)(Ct.Fragment, {
                children: [
                  (0, Ct.jsxs)("div", {
                    className: "flex items-center justify-between gap-3",
                    children: [
                      (0, Ct.jsxs)("div", {
                        children: [
                          (0, Ct.jsx)("div", {
                            className: "text-2xl font-bold tabular",
                            children: q(c.price),
                          }),
                          (0, Ct.jsxs)("div", {
                            className: "text-xs",
                            style: { color: "var(--ink-dim)" },
                            children: [
                              (0, Ct.jsx)(ng, { className: "inline -mt-0.5" }),
                              " ",
                              c.sample ? "Sample" : c.rating || "new",
                              " \xB7 ",
                              c.reviews,
                              " reviews \xB7 ",
                              c.sales.toLocaleString("en-US"),
                              " sold",
                            ],
                          }),
                        ],
                      }),
                      K2(c.id)
                        ? (0, Ct.jsx)("span", { className: "chip chip-on", children: "In your library" })
                        : (0, Ct.jsx)("button", {
                            className: "btn btn-primary",
                            onClick: () => Ph(c.id),
                            children: "Buy agent",
                          }),
                    ],
                  }),
                  (0, Ct.jsx)("div", {
                    className: "flex gap-1.5 flex-wrap",
                    children: c.skills.map((v) => (0, Ct.jsx)("span", { className: "chip", children: v }, v)),
                  }),
                  (0, Ct.jsx)(XH, { agentId: c.id, color: p }),
                ],
              }),
            d &&
              (0, Ct.jsx)("div", {
                className: "grid sm:grid-cols-3 gap-2",
                children: d.packages.map((v) =>
                  (0, Ct.jsxs)(
                    "div",
                    {
                      className: "rounded-lg p-3 flex flex-col",
                      style: { border: "1px solid var(--line)", background: "rgba(255,255,255,.03)" },
                      children: [
                        (0, Ct.jsx)("div", {
                          className: "text-xs font-bold",
                          style: { color: p },
                          children: v.tier,
                        }),
                        (0, Ct.jsx)("div", { className: "text-xl font-bold tabular", children: q(v.price) }),
                        (0, Ct.jsxs)("div", {
                          className: "text-[11px] mb-2",
                          style: { color: "var(--ink-dim)" },
                          children: [v.days, " days"],
                        }),
                        (0, Ct.jsx)("ul", {
                          className: "text-[11px] space-y-0.5 flex-1",
                          style: { color: "var(--ink-dim)" },
                          children: v.features.map((g) =>
                            (0, Ct.jsxs)("li", { children: ["\u2713 ", g] }, g),
                          ),
                        }),
                        (0, Ct.jsx)("button", {
                          className: "btn btn-primary btn-sm mt-2",
                          onClick: () => Gp(d.id, v.tier),
                          children: "Order",
                        }),
                      ],
                    },
                    v.tier,
                  ),
                ),
              }),
            h &&
              (0, Ct.jsx)("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 gap-2",
                children: h.products.map((v) =>
                  (0, Ct.jsxs)(
                    "div",
                    {
                      className: "rounded-lg p-2.5",
                      style: { border: "1px solid var(--line)", background: "rgba(255,255,255,.03)" },
                      children: [
                        (0, Ct.jsx)("button", {
                          className: "block w-full aspect-square rounded-md mb-2 overflow-hidden",
                          style: {
                            background: `radial-gradient(circle at 40% 35%, ${v.color}, ${v.accent} 120%)`,
                          },
                          onClick: () => Dp(h.id, v.id),
                          "aria-label": `View ${v.name} in 3D`,
                          children: v.image
                            ? (0, Ct.jsx)("img", {
                                src: v.image,
                                alt: "",
                                className: "w-full h-full object-cover",
                              })
                            : (0, Ct.jsx)("span", {
                                className: "text-[11px] font-bold text-white/90",
                                children: "View in 3D",
                              }),
                        }),
                        (0, Ct.jsx)("div", { className: "text-sm font-bold truncate", children: v.name }),
                        (0, Ct.jsxs)("div", {
                          className: "flex items-center justify-between mt-1",
                          children: [
                            (0, Ct.jsx)("span", { className: "text-sm tabular", children: q(v.price) }),
                            (0, Ct.jsx)("button", {
                              className: "btn btn-primary btn-sm",
                              onClick: () => Fh(h.id, v.id),
                              children: "Buy",
                            }),
                          ],
                        }),
                      ],
                    },
                    v.id,
                  ),
                ),
              }),
            u &&
              (0, Ct.jsxs)("div", {
                className: "flex items-center gap-3 rounded-lg p-3",
                style: { border: "1px solid var(--line)" },
                children: [
                  (0, Ct.jsxs)("div", {
                    className: "flex-1",
                    children: [
                      (0, Ct.jsx)("div", { className: "font-bold", children: u.name }),
                      (0, Ct.jsxs)("div", {
                        className: "text-xs",
                        style: { color: "var(--ink-dim)" },
                        children: [u.tag, " \xB7 ", u.players],
                      }),
                      u.ready &&
                        (0, Ct.jsxs)("div", {
                          className: "text-xs mt-1",
                          style: { color: p },
                          children: ["Your best: ", t.gameBest[u.id] ?? "\u2014"],
                        }),
                    ],
                  }),
                  u.ready
                    ? (0, Ct.jsxs)("button", {
                        className: "btn btn-primary",
                        onClick: () => {
                          (C({ shopView: null }), Uh(u.id));
                        },
                        children: [(0, Ct.jsx)(a0, {}), " Play free"],
                      })
                    : (0, Ct.jsxs)("button", {
                        className: "btn btn-ghost",
                        disabled: t.votes.includes(u.id),
                        onClick: () => $h(u.id),
                        children: [(0, Ct.jsx)(rg, {}), " ", t.votes.includes(u.id) ? "Voted" : "Vote"],
                      }),
                ],
              }),
            a.kind === "cafe" &&
              (0, Ct.jsx)("div", {
                className: "space-y-1.5",
                children: [
                  ["Orbit Latte", 4],
                  ["Ember Cold Brew", 5],
                  ["Marina Matcha", 5],
                  ["Croissant", 3],
                  ["Banana bread", 3],
                ].map(([v, g]) =>
                  (0, Ct.jsxs)(
                    "div",
                    {
                      className: "flex items-center gap-3 rounded-lg px-3 py-2",
                      style: { border: "1px solid var(--line)" },
                      children: [
                        (0, Ct.jsx)("span", { className: "flex-1 text-sm font-bold", children: v }),
                        (0, Ct.jsx)("span", { className: "tabular text-sm", children: q(g) }),
                        (0, Ct.jsx)("button", {
                          className: "btn btn-primary btn-sm",
                          onClick: () => $p(e, v, g),
                          children: "Order",
                        }),
                      ],
                    },
                    v,
                  ),
                ),
              }),
            (0, Ct.jsxs)("div", {
              children: [
                (0, Ct.jsx)("div", {
                  className: "text-[11px] font-bold uppercase tracking-wider mb-1.5",
                  style: { color: "var(--ink-dim)" },
                  children: "Visitors \xB7 last 7 days",
                }),
                (0, Ct.jsx)("div", {
                  className: "flex items-end gap-1 h-14",
                  children: r.history.map((v, g) => {
                    let m = Math.max(...r.history, 1);
                    return (0, Ct.jsx)(
                      "div",
                      {
                        className: "flex-1 rounded-sm",
                        title: `${v} visitors`,
                        style: {
                          height: `${Math.max(6, (v / m) * 100)}%`,
                          background: g === r.history.length - 1 ? "var(--accent)" : "rgba(255,255,255,.18)",
                        },
                      },
                      g,
                    );
                  }),
                }),
              ],
            }),
          ],
        }),
        (0, Ct.jsxs)("div", {
          className: "px-5 py-3 flex gap-2 justify-end",
          style: { borderTop: "1px solid var(--line)" },
          children: [
            !i &&
              t.scene.mode === "plaza" &&
              (0, Ct.jsxs)("button", {
                className: "btn btn-ghost btn-sm",
                onClick: () => {
                  let v = bo(e);
                  (v && ts(v), l());
                },
                children: [(0, Ct.jsx)(da, {}), " Route"],
              }),
            !i &&
              (0, Ct.jsxs)("button", {
                className: "btn btn-primary btn-sm",
                onClick: () => Fp(e),
                children: [(0, Ct.jsx)(Wo, {}), " Walk in"],
              }),
          ],
        }),
      ],
    }),
  });
}
var W = P(ea(), 1);
var dt = P(ea(), 1);
var J = P(ea(), 1);
var hi = P(ea(), 1);
function eo(t, e, a, r, o, n) {
  (t.beginPath(),
    t.moveTo(e + n, a),
    t.arcTo(e + r, a, e + r, a + o, n),
    t.arcTo(e + r, a + o, e, a + o, n),
    t.arcTo(e, a + o, e, a, n),
    t.arcTo(e, a, e + r, a, n),
    t.closePath());
}
function gu(t, e, a) {
  let r = e.split(/\s+/),
    o = [],
    n = "";
  for (let i of r) {
    let s = n ? n + " " + i : i;
    t.measureText(s).width > a && n ? (o.push(n), (n = i)) : (n = s);
  }
  return (n && o.push(n), o);
}
function fu(t, e = "", a = "#4da3ff", r = 1) {
  let o = document.createElement("canvas");
  ((o.width = 512), (o.height = 160));
  let n = o.getContext("2d");
  ((n.textAlign = "center"),
    (n.lineJoin = "round"),
    (n.font = '700 44px "Plus Jakarta Sans", system-ui, sans-serif'),
    (n.lineWidth = 8),
    (n.strokeStyle = "rgba(0,0,0,0.75)"),
    n.strokeText(t.slice(0, 24), 256, 70),
    (n.fillStyle = "#ffffff"),
    n.fillText(t.slice(0, 24), 256, 70),
    e &&
      ((n.font = '600 28px "Plus Jakarta Sans", system-ui, sans-serif'),
      (n.lineWidth = 6),
      n.strokeText(e.slice(0, 32), 256, 114),
      (n.fillStyle = "rgba(235,238,242,0.9)"),
      n.fillText(e.slice(0, 32), 256, 114)));
  let i = new hi.CanvasTexture(o);
  i.anisotropy = 4;
  let s = new hi.SpriteMaterial({ map: i, transparent: !0, depthWrite: !1 }),
    l = new hi.Sprite(s);
  return (l.scale.set(3.2 * r, 1 * r, 1), (l.renderOrder = 10), l);
}
function oL(t, e = "#ffffff") {
  let a = document.createElement("canvas");
  ((a.width = 512), (a.height = 192));
  let r = a.getContext("2d");
  r.font = '600 32px "Plus Jakarta Sans", system-ui, sans-serif';
  let o = gu(r, t, 440).slice(0, 3),
    n = 30 + o.length * 40;
  (eo(r, 16, 8, 480, n, 24),
    (r.fillStyle = "rgba(255,255,255,0.94)"),
    r.fill(),
    (r.fillStyle = e),
    r.fillRect(16, 8, 8, n),
    (r.fillStyle = "#111418"),
    o.forEach((l, c) => r.fillText(l, 40, 48 + c * 40)));
  let i = new hi.CanvasTexture(a),
    s = new hi.Sprite(new hi.SpriteMaterial({ map: i, transparent: !0, depthWrite: !1 }));
  return (s.scale.set(3.4, 1.27, 1), (s.renderOrder = 11), s);
}
function b0(t) {
  let e = t.w || 768,
    a = t.h || 1024,
    r = e / 768,
    o = document.createElement("canvas");
  ((o.width = e), (o.height = a));
  let n = o.getContext("2d");
  ((n.fillStyle = "#1c2026"), n.fillRect(0, 0, e, a), (n.fillStyle = t.color), n.fillRect(0, 0, e, 14 * r));
  let i = (d) => Math.round(d * r);
  ((n.fillStyle = t.color),
    (n.font = `700 ${i(28)}px "Plus Jakarta Sans", sans-serif`),
    n.fillText(t.kicker.toUpperCase(), i(44), i(84)),
    (n.fillStyle = "#ffffff"),
    (n.font = `800 ${i(56)}px "Plus Jakarta Sans", system-ui, sans-serif`));
  let s = gu(n, t.title, e - i(88)).slice(0, 3);
  (s.forEach((d, h) => n.fillText(d, i(44), i(160) + h * i(64))),
    (n.fillStyle = "rgba(225,229,235,0.82)"),
    (n.font = `500 ${i(34)}px "Plus Jakarta Sans", system-ui, sans-serif`));
  let l = i(184) + s.length * i(64);
  (t.body
    .split(
      `
`,
    )
    .forEach((d) => {
      (gu(n, d, e - i(88)).forEach((h) => {
        l < a - i(120) && (n.fillText(h, i(44), l), (l += i(46)));
      }),
        (l += i(10)));
    }),
    t.footer &&
      ((n.fillStyle = "#ffffff"),
      (n.font = `800 ${i(40)}px "Plus Jakarta Sans", system-ui, sans-serif`),
      n.fillText(t.footer, i(44), a - i(56))));
  let c = new hi.CanvasTexture(o);
  return ((c.anisotropy = 4), c);
}
var aa = P(ea(), 1),
  ha = {
    uTime: { value: 0 },
    uSunDir: { value: new aa.Vector3(0.4, 0.8, -0.4).normalize() },
    uSunCol: { value: new aa.Color(1, 0.95, 0.88) },
    uAmb: { value: new aa.Color(0.45, 0.5, 0.58) },
    uSkyTop: { value: new aa.Color("#3b7bd4") },
    uSkyHor: { value: new aa.Color("#b9d6ef") },
    uNight: { value: 0 },
    uSnow: { value: 0 },
    uWet: { value: 0 },
    uFog: { value: new aa.Color("#b9d6ef") },
    uFogD: { value: 0.0042 },
    uGrass: { value: new aa.Color("#5b8a3c") },
    uCloud: { value: 0.25 },
  },
  Ag = `
uniform float uTime; uniform vec3 uSunDir; uniform vec3 uSunCol; uniform vec3 uAmb; uniform vec3 uSkyTop; uniform vec3 uSkyHor;
uniform float uNight; uniform float uSnow; uniform float uWet; uniform vec3 uFog; uniform float uFogD;
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
vec3 applyFog(vec3 col, float d){ return mix(col, uFog, 1.0 - exp(-uFogD * uFogD * d * d)); }
`,
  JH = `varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vV;
void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vL = position; vN = normalize(mat3(modelMatrix) * normal); vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
  QH =
    Ag +
    `
uniform vec3 uBase; uniform vec3 uTint; uniform float uKind; uniform float uBuild; uniform float uH; uniform float uSeed; uniform vec2 uCell;
varying vec3 vW; varying vec3 vN; varying vec3 vL; varying vec3 vV;
void main(){
  if (vW.y > uBuild * (uH + 2.0) + 0.01) discard;
  vec3 N = normalize(vN); vec3 V = normalize(vV);
  float roof = step(0.6, N.y);
  float side = abs(N.x) > abs(N.z) ? vL.z : vL.x;
  vec2 wp = vec2(side, vW.y - 1.2);
  vec2 cs = uCell; vec2 c = fract(wp / cs); vec2 id = floor(wp / cs);
  float win;
  if (uKind < 0.5) { win = step(0.06, c.x) * step(c.x, 0.94) * step(0.05, c.y) * step(c.y, 0.95); }           // glass curtain wall
  else if (uKind < 1.5) { win = step(0.18, c.x) * step(c.x, 0.82) * step(0.25, c.y) * step(c.y, 0.8); }          // concrete + windows
  else { win = step(0.25, c.x) * step(c.x, 0.75) * step(0.2, c.y) * step(c.y, 0.85) * step(1.0, id.y); }        // plaster shophouse
  win *= step(0.0, wp.y) * (1.0 - roof);
  float diff = max(dot(N, uSunDir), 0.0);
  vec3 light = uAmb + uSunCol * diff;
  float grime = 0.92 + 0.08 * vnoise(vW.xz * 0.3 + vW.y * 0.2);
  vec3 wall = uBase * light * grime;
  vec3 R = reflect(-V, N);
  vec3 sky = mix(uSkyHor, uSkyTop, clamp(R.y * 1.6, 0.0, 1.0));
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  float spec = pow(max(dot(R, uSunDir), 0.0), 80.0);
  vec3 glass = mix(uTint * 0.18 + vec3(0.03, 0.05, 0.08), sky * 0.85, 0.35 + 0.5 * fres) + uSunCol * spec * 1.2;
  float rnd = h21(id + uSeed * 17.0);
  float on = step(0.48, rnd) * uNight;
  vec3 warm = mix(vec3(1.0, 0.78, 0.48), vec3(0.85, 0.92, 1.0), step(0.85, rnd));
  glass = mix(glass, warm * (0.55 + 0.45 * rnd), on);
  vec3 col = mix(wall, glass, win);
  vec3 roofCol = uBase * 0.55 * light;
  col = mix(col, roofCol, roof);
  col = mix(col, vec3(0.92, 0.95, 1.0) * (uAmb + uSunCol * 0.8), uSnow * roof);
  col *= 1.0 - uWet * 0.15 * (1.0 - win);
  float edge = smoothstep(uBuild * (uH + 2.0) - 0.5, uBuild * (uH + 2.0), vW.y) * step(uBuild, 0.999);
  col += vec3(1.0, 0.6, 0.25) * edge * 1.5;
  gl_FragColor = vec4(applyFog(col, length(vV)), 1.0);
}`;
function Ea(t) {
  return new aa.ShaderMaterial({
    vertexShader: JH,
    fragmentShader: QH,
    uniforms: {
      ...ha,
      uBase: { value: new aa.Color(t.base) },
      uTint: { value: new aa.Color(t.tint || "#6b8fb3") },
      uKind: { value: t.kind ?? 1 },
      uBuild: { value: 1 },
      uH: { value: t.h },
      uSeed: { value: t.seed ?? Math.random() },
      uCell: {
        value: new aa.Vector2(
          ...(t.cell || (t.kind === 0 ? [1.6, 3.2] : t.kind === 2 ? [3, 3.4] : [2.4, 3.2])),
        ),
      },
    },
  });
}
