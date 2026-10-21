function rx() {
  let t = (0, ur.useRef)(null),
    e = (0, ur.useRef)(null),
    [a, r] = (0, ur.useState)("login"),
    [o, n] = (0, ur.useState)(""),
    [i, s] = (0, ur.useState)(""),
    [l, c] = (0, ur.useState)(""),
    [d, h] = (0, ur.useState)(""),
    [u, p] = (0, ur.useState)(null),
    [v, g] = (0, ur.useState)(""),
    [m, f] = (0, ur.useState)(""),
    [y, x] = (0, ur.useState)(!1),
    [k, b] = (0, ur.useState)(!1),
    w = O.enabled,
    [L, E] = (0, ur.useState)({ google: null, reset: !1 }),
    [T, S] = (0, ur.useState)(!1),
    H = (0, ur.useRef)(null),
    N = (0, ur.useRef)(!1);
  ((N.current = T),
    (0, ur.useEffect)(() => {
      w && bM().then(E);
    }, [w]),
    (0, ur.useEffect)(() => {
      if (!w || !L.google || !H.current) return;
      let _ = H.current,
        lt = () => {
          let vt = window.google?.accounts?.id;
          vt &&
            (vt.initialize({
              client_id: L.google,
              callback: (zt) => {
                if (!N.current) {
                  g('Tick "I am 13 or older" first, then press Google again.');
                  return;
                }
                B(() => EM(zt.credential, !0));
              },
            }),
            vt.renderButton(_, {
              theme: "filled_black",
              size: "large",
              width: _.clientWidth || 300,
              text: "continue_with",
            }));
        };
      if (window.google?.accounts?.id) lt();
      else {
        let vt = document.createElement("script");
        ((vt.src = "https://accounts.google.com/gsi/client"),
          (vt.async = !0),
          (vt.onload = lt),
          document.head.appendChild(vt));
      }
    }, [w, L.google]),
    (0, ur.useEffect)(() => {
      if (t.current) {
        try {
          e.current = new wg(t.current);
        } catch {
          e.current = null;
        }
        return () => e.current?.dispose();
      }
    }, []));
  let B = async (_) => {
      (g(""), x(!0));
      try {
        (e.current?.engage(), b(!0), await new Promise((lt) => setTimeout(lt, 650)), await _());
      } catch (lt) {
        (g(lt.message || "Something went wrong."), b(!1), e.current && (e.current.warp = 0));
      }
      x(!1);
    },
    X = (_) => {
      (_.preventDefault(), g(""), f(""));
      let lt = w ? 8 : 6;
      if (a === "login") return B(() => (w ? wM(i, l) : xM(i, l)));
      if (a === "signup")
        return o.trim().length < 2
          ? g("Your name needs at least 2 characters.")
          : /^\S+@\S+\.\S+$/.test(i)
            ? l.length < lt
              ? g(`Use at least ${lt} characters for your password.`)
              : w && !T
                ? g("Please confirm you are 13 or older.")
                : B(() => (w ? MM(o.trim(), i, l, !0) : vM(o.trim(), i, l)))
            : g("Enter a valid email, like you@example.com");
      if (w) {
        if (!L.reset)
          return g("Password reset by email is not switched on yet. Ask the Fyrus team for help.");
        if (!u) {
          (x(!0),
            LM(i)
              .then(() => {
                (p("sent"),
                  f("If that email has an account, a 6-digit code is on its way. It works for 15 minutes."));
              })
              .catch((vt) => g(vt.message))
              .finally(() => x(!1)));
          return;
        }
        return l.length < 8 ? g("Use at least 8 characters for your new password.") : B(() => CM(i, d, l));
      }
      if (!u) {
        try {
          let vt = yM(i);
          (p(vt), f(`Demo mode: your reset code is ${vt}. In production it would be emailed.`));
        } catch (vt) {
          g(vt.message);
        }
        return;
      }
      if (l.length < 6) return g("Use at least 6 characters for your new password.");
      kM(i, d, l)
        .then(() => {
          (f("Password updated. You can log in now."), r("login"), p(null), h(""));
        })
        .catch((vt) => g(vt.message));
    };
  return (0, Bt.jsxs)("div", {
    className: "fixed inset-0 overflow-hidden",
    children: [
      (0, Bt.jsx)("div", { ref: t, className: "absolute inset-0", "aria-hidden": "true" }),
      (0, Bt.jsx)("div", {
        className: "absolute inset-0 pointer-events-none",
        style: {
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(4,10,28,.2) 45%, rgba(4,10,28,.88) 100%)",
        },
      }),
      (0, Bt.jsx)("div", {
        className: `relative h-full w-full flex items-center justify-center scroll-y ${k ? "warp-out" : ""}`,
        style: {
          paddingLeft: "max(16px, env(safe-area-inset-left, 0px))",
          paddingRight: "max(16px, env(safe-area-inset-right, 0px))",
        },
        children: (0, Bt.jsxs)("div", {
          className: "grid lg:grid-cols-[1.1fr_420px] gap-12 items-center w-full max-w-6xl py-10",
          children: [
            (0, Bt.jsxs)("div", {
              className: "hidden lg:block",
              children: [
                (0, Bt.jsx)(u0, { height: 72 }),
                (0, Bt.jsxs)("h1", {
                  className: "font-display text-5xl font-extrabold leading-[1.05] mt-8",
                  style: { textWrap: "balance" },
                  children: [
                    "Fyrus City 2040.",
                    (0, Bt.jsx)("br", {}),
                    (0, Bt.jsx)("span", { className: "ember-text", children: "The future, open today." }),
                  ],
                }),
                (0, Bt.jsx)("p", {
                  className: "mt-5 text-lg max-w-lg",
                  style: { color: "var(--ink-dim)" },
                  children:
                    "A city from the year 2040 that never ends. Play arcade games with friends, rent a flying car, shop in 3D malls, build your own home and open your brand's store. Free during launch.",
                }),
                (0, Bt.jsx)("div", {
                  className: "mt-8 grid grid-cols-2 gap-3 max-w-xl",
                  children: [
                    { i: on, t: "Fyrus Arcade", d: "Games with friends, side by side" },
                    { i: ko, t: "3D shopping malls", d: "Spin every product in 4D, then buy" },
                    { i: e0, t: "Flying cars & rockets", d: "Rent free and cross the city" },
                    { i: Ma, t: "Your home, your store", d: "Build a 4D home or open a brand" },
                  ].map(({ i: _, t: lt, d: vt }) =>
                    (0, Bt.jsxs)(
                      "div",
                      {
                        className: "glass rounded-2xl p-4 flex gap-3",
                        children: [
                          (0, Bt.jsx)("div", {
                            className: "w-10 h-10 rounded-xl grid place-items-center shrink-0",
                            style: { background: "rgba(77,163,255,.15)", color: "var(--blue-hi)" },
                            children: (0, Bt.jsx)(_, { className: "text-xl" }),
                          }),
                          (0, Bt.jsxs)("div", {
                            children: [
                              (0, Bt.jsx)("div", {
                                className: "font-display font-bold text-sm",
                                children: lt,
                              }),
                              (0, Bt.jsx)("div", {
                                className: "text-xs mt-0.5",
                                style: { color: "var(--ink-dim)" },
                                children: vt,
                              }),
                            ],
                          }),
                        ],
                      },
                      lt,
                    ),
                  ),
                }),
              ],
            }),
            (0, Bt.jsxs)("div", {
              className: "glass holo-edge rounded-3xl p-7 pop-in w-full max-w-[420px] mx-auto",
              children: [
                (0, Bt.jsx)("div", {
                  className: "lg:hidden mb-5",
                  children: (0, Bt.jsx)(u0, { height: 44 }),
                }),
                (0, Bt.jsxs)("div", {
                  className: "mb-6",
                  children: [
                    (0, Bt.jsx)("div", {
                      className: "font-display text-2xl font-bold",
                      children:
                        a === "login"
                          ? "Enter Fyrus City"
                          : a === "signup"
                            ? "Become a resident"
                            : "Reset your password",
                    }),
                    (0, Bt.jsx)("div", {
                      className: "text-sm mt-1",
                      style: { color: "var(--ink-dim)" },
                      children:
                        a === "login"
                          ? "Your avatar, home and wallet are waiting."
                          : a === "signup"
                            ? "Get a home plot, 500 demo credits and 40 orbs."
                            : "We will send a code to your email.",
                    }),
                  ],
                }),
                (0, Bt.jsxs)("button", {
                  type: "button",
                  disabled: y,
                  onClick: () => B(() => Hv()),
                  className: "btn btn-ember w-full text-base py-3.5 mb-4",
                  id: "demo-login",
                  children: [(0, Bt.jsx)(H8, {}), " ", w ? "Enter as a guest" : "Enter the city now (demo)"],
                }),
                w
                  ? (0, Bt.jsxs)(Bt.Fragment, {
                      children: [
                        (a === "signup" || L.google) &&
                          (0, Bt.jsxs)("label", {
                            className: "flex items-center gap-2 text-sm mb-3 cursor-pointer",
                            children: [
                              (0, Bt.jsx)("input", {
                                id: "f-age13",
                                type: "checkbox",
                                checked: T,
                                onChange: (_) => S(_.target.checked),
                              }),
                              " I am 13 or older and accept the ",
                              (0, Bt.jsx)("a", {
                                href: "/terms",
                                target: "_blank",
                                rel: "noopener",
                                className: "underline",
                                children: "Terms",
                              }),
                              " and ",
                              (0, Bt.jsx)("a", {
                                href: "/privacy",
                                target: "_blank",
                                rel: "noopener",
                                className: "underline",
                                children: "Privacy",
                              }),
                            ],
                          }),
                        L.google &&
                          (0, Bt.jsx)("div", { ref: H, className: "mb-5 min-h-[44px]", id: "google-btn" }),
                      ],
                    })
                  : (0, Bt.jsxs)("div", {
                      className: "grid grid-cols-2 gap-2 mb-5",
                      children: [
                        (0, Bt.jsxs)("button", {
                          type: "button",
                          disabled: y,
                          className: "btn btn-ghost",
                          onClick: () => B(() => Nv("Google")),
                          children: [
                            (0, Bt.jsx)("span", {
                              className: "font-display text-sm font-bold",
                              children: "G",
                            }),
                            " Google",
                          ],
                        }),
                        (0, Bt.jsxs)("button", {
                          type: "button",
                          disabled: y,
                          className: "btn btn-ghost",
                          onClick: () => B(() => Nv("GitHub")),
                          children: [(0, Bt.jsx)(oE, {}), " GitHub"],
                        }),
                      ],
                    }),
                (0, Bt.jsxs)("div", {
                  className: "flex items-center gap-3 mb-5 text-xs",
                  style: { color: "var(--ink-dim)" },
                  children: [
                    (0, Bt.jsx)("div", { className: "h-px flex-1", style: { background: "var(--line)" } }),
                    "or use email",
                    (0, Bt.jsx)("div", { className: "h-px flex-1", style: { background: "var(--line)" } }),
                  ],
                }),
                (0, Bt.jsxs)("form", {
                  onSubmit: X,
                  className: "space-y-3",
                  noValidate: !0,
                  children: [
                    a === "signup" &&
                      (0, Bt.jsxs)("div", {
                        children: [
                          (0, Bt.jsx)("label", { className: "label", htmlFor: "f-name", children: "Name" }),
                          (0, Bt.jsxs)("div", {
                            className: "relative",
                            children: [
                              (0, Bt.jsx)(Ul, {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60",
                              }),
                              (0, Bt.jsx)("input", {
                                id: "f-name",
                                className: "field pl-9",
                                value: o,
                                onChange: (_) => n(_.target.value),
                                placeholder: "Alex Morgan",
                                autoComplete: "name",
                              }),
                            ],
                          }),
                        ],
                      }),
                    (0, Bt.jsxs)("div", {
                      children: [
                        (0, Bt.jsx)("label", { className: "label", htmlFor: "f-email", children: "Email" }),
                        (0, Bt.jsxs)("div", {
                          className: "relative",
                          children: [
                            (0, Bt.jsx)(ql, {
                              className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60",
                            }),
                            (0, Bt.jsx)("input", {
                              id: "f-email",
                              className: "field pl-9",
                              type: "email",
                              value: i,
                              onChange: (_) => s(_.target.value),
                              placeholder: "you@example.com",
                              autoComplete: "email",
                            }),
                          ],
                        }),
                      ],
                    }),
                    a === "reset" &&
                      u &&
                      (0, Bt.jsxs)("div", {
                        children: [
                          (0, Bt.jsx)("label", {
                            className: "label",
                            htmlFor: "f-code",
                            children: "Reset code",
                          }),
                          (0, Bt.jsxs)("div", {
                            className: "relative",
                            children: [
                              (0, Bt.jsx)(cg, {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60",
                              }),
                              (0, Bt.jsx)("input", {
                                id: "f-code",
                                className: "field pl-9 font-mono tracking-[.3em]",
                                value: d,
                                onChange: (_) => h(_.target.value),
                                placeholder: "123456",
                                inputMode: "numeric",
                              }),
                            ],
                          }),
                        ],
                      }),
                    (a !== "reset" || u) &&
                      (0, Bt.jsxs)("div", {
                        children: [
                          (0, Bt.jsx)("label", {
                            className: "label",
                            htmlFor: "f-pass",
                            children: a === "reset" ? "New password" : "Password",
                          }),
                          (0, Bt.jsxs)("div", {
                            className: "relative",
                            children: [
                              (0, Bt.jsx)(Pr, {
                                className: "absolute left-3 top-1/2 -translate-y-1/2 opacity-60",
                              }),
                              (0, Bt.jsx)("input", {
                                id: "f-pass",
                                className: "field pl-9",
                                type: "password",
                                value: l,
                                onChange: (_) => c(_.target.value),
                                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                                autoComplete: a === "login" ? "current-password" : "new-password",
                              }),
                            ],
                          }),
                        ],
                      }),
                    v &&
                      (0, Bt.jsx)("div", {
                        role: "alert",
                        className: "text-sm rounded-xl px-3 py-2",
                        style: {
                          background: "rgba(255,93,122,.12)",
                          color: "#ffb3c2",
                          border: "1px solid rgba(255,93,122,.35)",
                        },
                        children: v,
                      }),
                    m &&
                      (0, Bt.jsx)("div", {
                        className: "text-sm rounded-xl px-3 py-2",
                        style: {
                          background: "rgba(77,163,255,.1)",
                          color: "var(--sky)",
                          border: "1px solid rgba(77,163,255,.3)",
                        },
                        children: m,
                      }),
                    (0, Bt.jsx)("button", {
                      className: "btn btn-primary w-full py-3",
                      disabled: y,
                      type: "submit",
                      children:
                        a === "login"
                          ? "Log in"
                          : a === "signup"
                            ? "Create account"
                            : u
                              ? "Set new password"
                              : "Send reset code",
                    }),
                  ],
                }),
                (0, Bt.jsxs)("div", {
                  className: "flex justify-between mt-5 text-sm",
                  children: [
                    a !== "login"
                      ? (0, Bt.jsx)("button", {
                          className: "hover:underline underline-offset-4",
                          style: { color: "var(--sky)" },
                          onClick: () => {
                            (r("login"), g(""), p(null));
                          },
                          children: "Back to log in",
                        })
                      : (0, Bt.jsx)("button", {
                          className: "hover:underline underline-offset-4",
                          style: { color: "var(--sky)" },
                          onClick: () => {
                            (r("signup"), g(""), f(""));
                          },
                          children: "Create an account",
                        }),
                    a === "login" &&
                      (0, Bt.jsx)("button", {
                        className: "hover:underline underline-offset-4",
                        style: { color: "var(--ink-dim)" },
                        onClick: () => {
                          (r("reset"), g(""), f(""));
                        },
                        children: "Forgot password?",
                      }),
                  ],
                }),
                (0, Bt.jsx)("p", {
                  className: "text-[11px] mt-5 leading-relaxed",
                  style: { color: "var(--ink-dim)" },
                  children: w
                    ? (0, Bt.jsxs)(Bt.Fragment, {
                        children: [
                          "Guests stay on this device. Create an account to use Fyrus on any device and keep your progress. FYC is play money inside Fyrus only. ",
                          (0, Bt.jsx)("a", {
                            href: "/terms",
                            target: "_blank",
                            rel: "noopener",
                            className: "underline",
                            children: "Terms",
                          }),
                          " \xB7 ",
                          (0, Bt.jsx)("a", {
                            href: "/privacy",
                            target: "_blank",
                            rel: "noopener",
                            className: "underline",
                            children: "Privacy",
                          }),
                        ],
                      })
                    : "Demo build: accounts, wallet and progress are saved in this browser. The production version adds a real auth server, payments and database.",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
var nr = P(Zt(), 1);
var kE = null,
  ox = (t) => {
    kE = t;
    try {
      window.__fyrusW = t;
    } catch {}
  },
  _t = () => kE;
function to(t) {
  let e = Oa.find((o) => o.id === t);
  if (t === "core") return { x: 0, z: 36 };
  if (t === "market") return { x: 44, z: 0 };
  if (t === "club") return { x: 296, z: 0 };
  if (t === "pool") return { x: e.x + 26, z: e.z + 4 };
  if (t === "marina") return { x: 0, z: -212 };
  let a = Math.hypot(e.x, e.z) || 1,
    r = (a - e.r - 6) / a;
  return { x: Math.round(e.x * r), z: Math.round(e.z * r) };
}
function bo(t) {
  let e = qa(ot()).find((a) => a.id === t);
  return e
    ? { x: _c(e.slot), z: zl(e.row) + (O2(e.row) ? 1 : -1) * (Vr.depth / 2 + 3), name: `${e.name} (${e.no})` }
    : null;
}
function xa(t) {
  t && (_t()?.teleport(t), ca());
}
function ts(t) {
  t && (od(t), ca());
}
function es(t, e) {
  (C({ teleFlash: Date.now() }),
    ca(),
    setTimeout(() => {
      (_t()?.teleport(t), e && F(`Teleported to ${e}`, "ok"));
    }, 180));
}
var Eg = P(Zt(), 1);
var Qt = P(ct(), 1);
function Dr({ user: t, size: e = 36 }) {
  let a = (t?.name || "?")
    .split(" ")
    .map((r) => r[0])
    .slice(0, 2)
    .join("");
  return (0, Qt.jsx)("div", {
    className: "rounded-full grid place-items-center font-display font-bold shrink-0",
    title: t?.name,
    style: {
      width: e,
      height: e,
      fontSize: e * 0.36,
      color: "#ffffff",
      background: `radial-gradient(circle at 30% 25%, #fff 0%, ${t?.color || "#999"} 50%, ${t?.color || "#999"}aa 100%)`,
      boxShadow: `0 0 16px ${t?.color || "#999"}55`,
    },
    children: a,
  });
}
function as({ userId: t, at: e, extra: a }) {
  let r = Y(),
    o = be(t),
    n = r.session?.userId,
    i = (r.follows[n] || []).includes(t);
  return (0, Qt.jsxs)("div", {
    className: "flex items-center gap-2.5 min-w-0",
    children: [
      (0, Qt.jsx)("button", {
        onClick: () => {
          (an("user", t), It("profile"));
        },
        className: "shrink-0",
        children: (0, Qt.jsx)(Dr, { user: o, size: 34 }),
      }),
      (0, Qt.jsxs)("div", {
        className: "min-w-0 flex-1",
        children: [
          (0, Qt.jsxs)("div", {
            className: "flex items-center gap-1 text-sm font-bold truncate",
            children: [
              o?.name,
              o?.verified && (0, Qt.jsx)(Jl, { className: "text-[var(--blue-hi)] shrink-0" }),
            ],
          }),
          (0, Qt.jsxs)("div", {
            className: "text-xs truncate",
            style: { color: "var(--ink-dim)" },
            children: [o?.title, e ? ` \xB7 ${Ao(e)}` : "", a ? ` \xB7 ${a}` : ""],
          }),
        ],
      }),
      t !== n &&
        (0, Qt.jsx)("button", {
          onClick: () => t8(t),
          className: "btn btn-sm btn-ghost",
          style: i ? { color: "var(--sky)" } : {},
          children: i
            ? (0, Qt.jsxs)(Qt.Fragment, { children: [(0, Qt.jsx)(z8, {}), " Following"] })
            : (0, Qt.jsxs)(Qt.Fragment, { children: [(0, Qt.jsx)(Os, {}), " Follow"] }),
        }),
    ],
  });
}
function nx({ value: t, onRate: e, size: a = 16 }) {
  let [r, o] = (0, Eg.useState)(0);
  return (0, Qt.jsx)("div", {
    className: "inline-flex items-center",
    onMouseLeave: () => o(0),
    role: e ? "radiogroup" : void 0,
    "aria-label": "Rating",
    children: [1, 2, 3, 4, 5].map((n) => {
      let i = (r || t) >= n - 0.25;
      return (0, Qt.jsx)(
        "button",
        {
          type: "button",
          disabled: !e,
          onMouseEnter: () => e && o(n),
          onClick: () => e?.(n),
          "aria-label": `${n} star`,
          className: "p-0.5 disabled:cursor-default",
          style: { color: i ? "var(--ember-hi)" : "rgba(255,255,255,.22)" },
          children: (0, Qt.jsx)(ng, {
            style: { width: a, height: a, fill: i ? "var(--ember-hi)" : "transparent" },
          }),
        },
        n,
      );
    }),
  });
}
function p0({ id: t, fallbackRating: e = 0 }) {
  let a = Y(),
    r = Ah(t),
    o = a.session.userId,
    [n, i] = (0, Eg.useState)(!1),
    [s, l] = (0, Eg.useState)(""),
    c = r.likes.includes(o),
    d = r.ratings[o] || 0,
    h = sM(t, e);
  return (0, Qt.jsxs)("div", {
    children: [
      (0, Qt.jsxs)("div", {
        className: "flex items-center gap-1 flex-wrap text-sm",
        children: [
          (0, Qt.jsxs)("button", {
            onClick: () => Pp(t),
            className: "btn btn-sm btn-ghost",
            style: c ? { color: "var(--rose)", borderColor: "rgba(255,93,122,.5)" } : {},
            "aria-pressed": c,
            children: [
              (0, Qt.jsx)(dg, { style: { fill: c ? "var(--rose)" : "transparent" } }),
              " ",
              (0, Qt.jsx)("span", { className: "tabular", children: r.likes.length }),
            ],
          }),
          (0, Qt.jsxs)("button", {
            onClick: () => i((u) => !u),
            className: "btn btn-sm btn-ghost",
            "aria-expanded": n,
            children: [
              (0, Qt.jsx)(Sn, {}),
              " ",
              (0, Qt.jsx)("span", { className: "tabular", children: r.comments.length }),
            ],
          }),
          (0, Qt.jsxs)("button", {
            onClick: () => Op(t),
            className: "btn btn-sm btn-ghost",
            children: [
              (0, Qt.jsx)(ni, {}),
              " ",
              (0, Qt.jsx)("span", { className: "tabular", children: r.shares }),
            ],
          }),
          (0, Qt.jsxs)("div", {
            className: "ml-auto flex items-center gap-1.5",
            children: [
              (0, Qt.jsx)(nx, { value: d || h, onRate: (u) => QM(t, u), size: 15 }),
              (0, Qt.jsxs)("span", {
                className: "text-xs tabular",
                style: { color: "var(--ink-dim)" },
                children: [h ? h.toFixed(1) : "\u2014", " (", Object.keys(r.ratings).length, ")"],
              }),
            ],
          }),
        ],
      }),
      n &&
        (0, Qt.jsxs)("div", {
          className: "mt-3 space-y-2 pop-in",
          children: [
            r.comments.map((u) => {
              let p = be(u.userId);
              return (0, Qt.jsxs)(
                "div",
                {
                  className: "flex gap-2 text-sm",
                  children: [
                    (0, Qt.jsx)(Dr, { user: p, size: 26 }),
                    (0, Qt.jsxs)("div", {
                      className: "rounded-xl px-3 py-2 flex-1 min-w-0",
                      style: { background: "rgba(255,255,255,.05)" },
                      children: [
                        (0, Qt.jsx)("b", { className: "mr-1.5", children: p?.name }),
                        (0, Qt.jsx)("span", {
                          style: { color: "var(--ink-dim)" },
                          className: "text-xs",
                          children: Ao(u.at),
                        }),
                        (0, Qt.jsx)("div", { className: "break-words", children: u.text }),
                      ],
                    }),
                  ],
                },
                u.id,
              );
            }),
            (0, Qt.jsxs)("form", {
              className: "flex gap-2",
              onSubmit: (u) => {
                (u.preventDefault(), JM(t, s), l(""));
              },
              children: [
                (0, Qt.jsx)("input", {
                  id: `cmt-${t}`,
                  className: "field py-2",
                  value: s,
                  onChange: (u) => l(u.target.value),
                  placeholder: "Write a comment\u2026",
                }),
                (0, Qt.jsx)("button", {
                  className: "btn btn-primary btn-sm",
                  "aria-label": "Send comment",
                  children: (0, Qt.jsx)(Da, {}),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function Te({ kicker: t, title: e, right: a }) {
  return (0, Qt.jsxs)("div", {
    className: "flex items-end justify-between gap-3 mb-3",
    children: [
      (0, Qt.jsxs)("div", {
        className: "min-w-0",
        children: [
          t &&
            (0, Qt.jsx)("div", {
              className: "text-[10px] font-mono uppercase tracking-[.2em]",
              style: { color: "var(--sky)" },
              children: t,
            }),
          (0, Qt.jsx)("h3", {
            className: "font-display text-base font-bold",
            style: { textWrap: "balance" },
            children: e,
          }),
        ],
      }),
      a,
    ],
  });
}
function Ra({ label: t, value: e, tone: a = "var(--ink)" }) {
  return (0, Qt.jsxs)("div", {
    className: "card p-3 min-w-0",
    children: [
      (0, Qt.jsx)("div", {
        className: "text-[10px] uppercase tracking-[.14em] font-bold",
        style: { color: "var(--ink-dim)" },
        children: t,
      }),
      (0, Qt.jsx)("div", {
        className: "font-display text-xl mt-1 tabular truncate",
        style: { color: a },
        children: e,
      }),
    ],
  });
}
async function Lg(t) {
  try {
    return (await navigator.clipboard.writeText(t), !0);
  } catch {
    return !1;
  }
}
var qe = P(ct(), 1);
function ix() {
  let t = Y(),
    e = tn.filter((r) => r.ready),
    a = tn.filter((r) => !r.ready).sort((r, o) => (o.votes || 0) - (r.votes || 0));
  return (0, qe.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, qe.jsxs)("div", {
        className: "card holo-edge p-4 flex items-center gap-3",
        children: [
          (0, qe.jsx)("div", {
            className: "w-12 h-12 rounded-2xl grid place-items-center",
            style: { background: "linear-gradient(135deg, var(--blue-hi), var(--blue))" },
            children: (0, qe.jsx)(on, { className: "text-2xl" }),
          }),
          (0, qe.jsxs)("div", {
            className: "flex-1",
            children: [
              (0, qe.jsx)("div", { className: "font-display font-bold", children: "Game Street" }),
              (0, qe.jsx)("div", {
                className: "text-xs",
                style: { color: "var(--ink-dim)" },
                children: "Every game has its own shop in Fyrus Market. Free during launch.",
              }),
            ],
          }),
          (0, qe.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            onClick: () => xa(bo("game:race")),
            children: [(0, qe.jsx)(da, {}), " Go there"],
          }),
        ],
      }),
      (0, qe.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, qe.jsx)(Te, { kicker: "Play now", title: "Games" }),
          (0, qe.jsx)("div", {
            className: "grid grid-cols-2 gap-2",
            children: e.map((r) =>
              (0, qe.jsxs)(
                "button",
                {
                  className: "card card-hover p-3 text-left",
                  onClick: () => Uh(r.id),
                  children: [
                    (0, qe.jsx)("div", {
                      className: "aspect-video rounded-xl fake-video grid place-items-center mb-2",
                      style: { "--h": r.color === "#ff9a3c" ? 25 : 210 },
                      children: (0, qe.jsx)(a0, { className: "text-2xl" }),
                    }),
                    (0, qe.jsx)("div", { className: "font-bold text-sm", children: r.name }),
                    (0, qe.jsx)("div", {
                      className: "text-[11px]",
                      style: { color: "var(--ink-dim)" },
                      children: r.players,
                    }),
                    (0, qe.jsxs)("div", {
                      className: "text-[11px] mt-1",
                      style: { color: "var(--ember-hi)" },
                      children: ["Best: ", t.gameBest[r.id] ?? "\u2014"],
                    }),
                  ],
                },
                r.id,
              ),
            ),
          }),
        ],
      }),
      (0, qe.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, qe.jsx)(Te, { kicker: "Your votes decide", title: "Coming next" }),
          (0, qe.jsx)("div", {
            className: "space-y-1.5",
            children: a.map((r) => {
              let o = t.votes.includes(r.id);
              return (0, qe.jsxs)(
                "div",
                {
                  className: "flex items-center gap-3 rounded-xl p-2.5",
                  style: { background: "rgba(255,255,255,.03)", border: "1px solid var(--line)" },
                  children: [
                    (0, qe.jsx)("span", {
                      className: "w-3 h-3 rounded-full",
                      style: { background: r.color },
                    }),
                    (0, qe.jsxs)("div", {
                      className: "flex-1 min-w-0",
                      children: [
                        (0, qe.jsx)("div", { className: "text-sm font-bold", children: r.name }),
                        (0, qe.jsxs)("div", {
                          className: "text-[11px]",
                          style: { color: "var(--ink-dim)" },
                          children: [r.tag, " \xB7 ", r.players],
                        }),
                      ],
                    }),
                    (0, qe.jsx)("span", {
                      className: "text-xs tabular",
                      style: { color: "var(--ink-dim)" },
                      children: ((r.votes || 0) + (o ? 1 : 0)).toLocaleString("en-US"),
                    }),
                    (0, qe.jsxs)("button", {
                      className: `btn btn-sm ${o ? "btn-ghost" : "btn-ember"}`,
                      disabled: o,
                      onClick: () => $h(r.id),
                      children: [(0, qe.jsx)(rg, {}), " ", o ? "Voted" : "Vote"],
                    }),
                  ],
                },
                r.id,
              );
            }),
          }),
          (0, qe.jsx)("div", {
            className: "text-[11px] mt-3",
            style: { color: "var(--ink-dim)" },
            children:
              "Game developers will be able to publish their own games here, the way creators do on other game platforms.",
          }),
        ],
      }),
    ],
  });
}
var Io = P(Zt(), 1);
var Ql = null,
  lu = null,
  bE = !1,
  GH = (t) => JSON.parse(JSON.stringify(t));
async function wE() {
  if (bE) return;
  bE = !0;
  let t = window.claude;
  if (!t?.use) return;
  try {
    Ql = await t.use("db");
  } catch {
    Ql = null;
  }
  try {
    lu = await t.use("assets");
  } catch {
    lu = null;
  }
  if ((C({ cloud: { db: !!Ql, canWrite: !!Ql, assets: !!lu } }), !Ql)) return;
  let e = (a, r) => {
    try {
      Ql.collection(a)
        .orderBy("at", "desc")
        .limit(300)
        .onSnapshot(
          (o) => C({ [r]: o.docs.map((n) => ({ ...n.data(), _id: n.id })) }),
          () => {},
        );
    } catch {}
  };
  (e("shops", "sharedShops"), e("profiles", "sharedProfiles"), e("ads", "sharedAds"));
}
async function sx(t, e, a) {
  if (!Ql) return !1;
  try {
    return (
      await Ql.collection(t)
        .doc(e)
        .set(GH({ ...a, at: Date.now() })),
      !0
    );
  } catch (r) {
    return (
      C((o) => ({ cloud: { ...o.cloud, canWrite: !1 } })),
      r?.code !== "invalid_argument" &&
        F(
          "Saved on this device only. To publish for everyone, the owner can give you Contributor access.",
          "info",
        ),
      !1
    );
  }
}
function ME(t, e) {
  let a = ot().users.find((r) => r.id === ot().session?.userId);
  return sx("shops", t.replace(/[^a-zA-Z0-9_-]/g, "_"), { key: t, ...e, ownerName: a?.name || "" });
}
function EE(t) {
  return sx("profiles", t.id, t);
}
function LE(t) {
  return sx("ads", t.id, t);
}
async function CE(t) {
  if (!lu) return null;
  try {
    return (await lu.upload(t)).url;
  } catch (e) {
    return (
      F(
        e?.code === "not_granted"
          ? "Uploads need Contributor access on this page."
          : "Upload failed, using it on this device only.",
        "warn",
      ),
      null
    );
  }
}
var ut = P(ct(), 1),
  TE = ["#ff9a3c", "#4da3ff", "#f1c40f", "#4cc38a", "#e5484d", "#ffffff"];
function lx() {
  let t = Y(),
    [e, a] = (0, Io.useState)(() => window.__fyrusAdSpot || ki[0].id),
    [r, o] = (0, Io.useState)({
      brand: t.brands.find((y) => y.ownerId === t.session?.userId)?.name || "",
      headline: "",
      color: "#ff9a3c",
      days: 7,
      category: "Brand",
    }),
    [n, i] = (0, Io.useState)(),
    [s, l] = (0, Io.useState)(null),
    [c, d] = (0, Io.useState)(!1),
    h = (0, Io.useRef)(null),
    u = (0, Io.useRef)(null),
    p = [...t.ads, ...(t.sharedAds || [])],
    v = (y) => {
      let x = new Image(),
        k = URL.createObjectURL(y);
      ((x.onload = () => {
        let b = Math.min(1, 1280 / x.width),
          w = document.createElement("canvas");
        ((w.width = x.width * b),
          (w.height = x.height * b),
          w.getContext("2d").drawImage(x, 0, 0, w.width, w.height),
          i(w.toDataURL("image/jpeg", 0.82)),
          URL.revokeObjectURL(k));
      }),
        (x.src = k));
    };
  if (t.net.status === "online") return (0, ut.jsx)(PH, { initial: e });
  let g = ki.find((y) => y.id === e),
    m = p.find((y) => y.spotId === e),
    f = async () => {
      if (!r.brand.trim() || !r.headline.trim()) return;
      d(!0);
      let y,
        x = !1;
      if (s) {
        let b = await CE(s.file);
        ((y = b || s.url), (x = !!b));
      }
      c8({
        spotId: e,
        brand: r.brand.trim(),
        headline: r.headline.trim(),
        color: r.color,
        image: n,
        days: r.days,
        video: y,
        category: r.category,
      });
      let k = ot().ads.find((b) => b.spotId === e);
      (k &&
        (!s || x) &&
        LE({
          ...k,
          image: n && n.length < 2e5 ? n : void 0,
          ownerName: t.users.find((b) => b.id === t.session?.userId)?.name,
        }),
        d(!1));
    };
  return (0, ut.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, ut.jsxs)("div", {
        className: "card p-4",
        children: [
          (0, ut.jsx)("div", { className: "text-sm font-bold mb-2", children: "1 \xB7 Where in the city" }),
          (0, ut.jsx)("div", {
            className: "grid grid-cols-2 gap-2",
            children: ki.map((y) => {
              let x = p.find((k) => k.spotId === y.id);
              return (0, ut.jsxs)(
                "button",
                {
                  className: `card p-2.5 text-left ${e === y.id ? "chip-on" : ""}`,
                  onClick: () => a(y.id),
                  children: [
                    (0, ut.jsx)("div", { className: "text-sm font-bold", children: y.name }),
                    (0, ut.jsxs)("div", {
                      className: "text-[11px] flex items-center gap-1",
                      style: { color: "var(--ink-dim)" },
                      children: [
                        (0, ut.jsx)(si, {}),
                        " ",
                        y.views,
                        x ? ` \xB7 now: ${x.brand}` : " \xB7 free",
                      ],
                    }),
                  ],
                },
                y.id,
              );
            }),
          }),
          (0, ut.jsxs)("button", {
            className: "btn btn-ghost btn-sm mt-3",
            onClick: () => {
              (C({ scene: { mode: "plaza" } }),
                _t()?.teleport({ x: g.x + Math.sin(g.ry) * 16, z: g.z + Math.cos(g.ry) * 16 }),
                ca());
            },
            children: [(0, ut.jsx)(da, {}), " Look at this spot"],
          }),
        ],
      }),
      (0, ut.jsxs)("form", {
        className: "card p-4 space-y-3",
        onSubmit: (y) => {
          (y.preventDefault(), f());
        },
        children: [
          (0, ut.jsx)("div", { className: "text-sm font-bold", children: "2 \xB7 Your ad" }),
          (0, ut.jsxs)("div", {
            children: [
              (0, ut.jsx)("div", { className: "label", children: "Category" }),
              (0, ut.jsx)("div", {
                className: "flex gap-1 flex-wrap",
                children: uv.map((y) =>
                  (0, ut.jsx)(
                    "button",
                    {
                      type: "button",
                      className: `chip ${r.category === y ? "chip-on" : ""}`,
                      onClick: () => o({ ...r, category: y }),
                      children: y,
                    },
                    y,
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
                    value: r.brand,
                    onChange: (y) => o({ ...r, brand: y.target.value }),
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
                    value: r.days,
                    onChange: (y) => o({ ...r, days: Number(y.target.value) }),
                    children: [1, 7, 14, 30].map((y) =>
                      (0, ut.jsxs)("option", { value: y, children: [y, " days"] }, y),
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
                value: r.headline,
                onChange: (y) => o({ ...r, headline: y.target.value }),
                placeholder: "Grand opening today",
              }),
            ],
          }),
          (0, ut.jsxs)("div", {
            children: [
              (0, ut.jsx)("div", { className: "label", children: "Colour" }),
              (0, ut.jsx)("div", {
                className: "flex gap-2",
                children: TE.map((y) =>
                  (0, ut.jsx)(
                    "button",
                    {
                      type: "button",
                      "aria-label": `Colour ${y}`,
                      onClick: () => o({ ...r, color: y }),
                      className: "w-8 h-8 rounded-md",
                      style: {
                        background: y,
                        outline: r.color === y ? "2px solid var(--accent)" : "none",
                        outlineOffset: 2,
                      },
                    },
                    y,
                  ),
                ),
              }),
            ],
          }),
          (0, ut.jsx)("input", {
            ref: h,
            id: "ad-img",
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: (y) => {
              let x = y.target.files?.[0];
              x && v(x);
            },
          }),
          (0, ut.jsx)("input", {
            ref: u,
            id: "ad-vid",
            type: "file",
            accept: "video/mp4,video/webm,video/quicktime",
            className: "hidden",
            onChange: (y) => {
              let x = y.target.files?.[0];
              if (x) {
                if (x.size > 2e7) {
                  alert("Please use a video under 20 MB.");
                  return;
                }
                l({ url: URL.createObjectURL(x), file: x });
              }
            },
          }),
          (0, ut.jsxs)("div", {
            className: "flex gap-2 flex-wrap",
            children: [
              (0, ut.jsxs)("button", {
                type: "button",
                className: "btn btn-ghost btn-sm",
                onClick: () => h.current?.click(),
                children: [(0, ut.jsx)(ex, {}), " ", n ? "Change poster" : "Poster image"],
              }),
              (0, ut.jsxs)("button", {
                type: "button",
                className: "btn btn-ghost btn-sm",
                onClick: () => u.current?.click(),
                children: [(0, ut.jsx)(Ps, {}), " ", s ? "Change video" : "Video (with music)"],
              }),
              s &&
                (0, ut.jsx)("button", {
                  type: "button",
                  className: "btn btn-ghost btn-sm",
                  onClick: () => l(null),
                  children: "Remove video",
                }),
            ],
          }),
          (0, ut.jsxs)("div", {
            className: "rounded-md overflow-hidden relative aspect-video",
            style: { background: n ? `url(${n}) center/cover` : "#f4f1ea", border: "6px solid #1d1f22" },
            children: [
              s &&
                (0, ut.jsx)("video", {
                  src: s.url,
                  className: "absolute inset-0 w-full h-full object-cover",
                  autoPlay: !0,
                  loop: !0,
                  playsInline: !0,
                  controls: !0,
                }),
              (0, ut.jsx)("div", {
                className:
                  "absolute top-0 inset-x-0 h-5 flex items-center gap-1.5 px-2 text-[10px] font-bold text-white",
                style: { background: "#12355e" },
                children: "\u25CF FYRUS CITY",
              }),
              !s &&
                (0, ut.jsxs)("div", {
                  className: "absolute inset-x-0 bottom-0 p-4",
                  style: { background: n ? "linear-gradient(transparent, rgba(0,0,0,.7))" : "transparent" },
                  children: [
                    (0, ut.jsx)("div", {
                      className: "text-xs font-bold uppercase",
                      style: { color: n ? "#fff" : r.color },
                      children: r.brand || "Your name",
                    }),
                    (0, ut.jsx)("div", {
                      className: "font-display text-2xl font-extrabold",
                      style: { color: n ? "#fff" : "#111" },
                      children: r.headline || "Your headline here",
                    }),
                    (0, ut.jsxs)("div", {
                      className: "text-[10px]",
                      style: { color: n ? "rgba(255,255,255,.7)" : "#666" },
                      children: [r.category, " \xB7 Sponsored"],
                    }),
                  ],
                }),
            ],
          }),
          s &&
            (0, ut.jsxs)("div", {
              className: "text-[11px] flex items-center gap-1.5",
              style: { color: "var(--ink-dim)" },
              children: [
                (0, ut.jsx)(sg, {}),
                " The video's sound plays when people walk near the billboard (they can turn sound off in Settings).",
              ],
            }),
          m &&
            (0, ut.jsxs)("div", {
              className: "text-xs",
              style: { color: "var(--ember-hi)" },
              children: ["This spot now shows ", m.brand, ". Booking replaces it."],
            }),
          (0, ut.jsx)("button", {
            className: "btn btn-primary w-full",
            disabled: c,
            children: c ? "Uploading\u2026" : "Put it on the billboard \xB7 free during launch",
          }),
          !t.cloud.db &&
            (0, ut.jsx)("div", {
              className: "text-[11px]",
              style: { color: "var(--ink-dim)" },
              children:
                "Here your ad shows on your screen. On the published page it is shared with everyone (Contributors can publish).",
            }),
        ],
      }),
    ],
  });
}
function VH(t, e) {
  let a = new Image(),
    r = URL.createObjectURL(t);
  ((a.onload = () => {
    let o = document.createElement("canvas"),
      n = Math.min(800, a.width),
      i = null;
    for (let s = 0; s < 8 && !i; s++) {
      let l = n / a.width;
      ((o.width = Math.round(a.width * l)),
        (o.height = Math.round(a.height * l)),
        o.getContext("2d").drawImage(a, 0, 0, o.width, o.height));
      for (let c of [0.78, 0.6, 0.45]) {
        let d = o.toDataURL("image/jpeg", c);
        if (d.length <= xw) {
          i = d;
          break;
        }
      }
      n = Math.round(n * 0.75);
    }
    (URL.revokeObjectURL(r), e(i));
  }),
    (a.onerror = () => {
      (URL.revokeObjectURL(r), e(null));
    }),
    (a.src = r));
}
var Cg = (t) => {
  let e = t - Date.now();
  if (e <= 0) return "now";
  let a = Math.floor(e / 36e5);
  return a >= 24
    ? `${Math.floor(a / 24)}d ${a % 24}h`
    : a
      ? `${a}h ${Math.floor((e % 36e5) / 6e4)}m`
      : `${Math.max(1, Math.floor(e / 6e4))}m`;
};
