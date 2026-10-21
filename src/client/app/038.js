function yA() {
  let [t, e] = (0, nr.useState)([]);
  return (
    (0, nr.useEffect)(() => {
      let a = () => {
        let r = Date.now() + Math.random();
        (e((o) => [...o.slice(-5), r]), setTimeout(() => e((o) => o.filter((n) => n !== r)), 1400));
      };
      return (window.addEventListener("fyrus:orb", a), () => window.removeEventListener("fyrus:orb", a));
    }, []),
    (0, D.jsx)(D.Fragment, {
      children: t.map((a, r) =>
        (0, D.jsxs)(
          "div",
          {
            className:
              "float-up fixed z-30 left-1/2 bottom-[46%] flex items-center gap-1.5 font-bold text-white hud-text-shadow pointer-events-none",
            style: { marginLeft: ((r % 3) - 1) * 30 },
            children: [(0, D.jsx)("span", { className: "orb-icon" }), " +1"],
          },
          a,
        ),
      ),
    })
  );
}
function kA() {
  let t = Y(),
    [e, a] = (0, nr.useState)(!1);
  return t.vehicle === "car" || t.vehicle === "drive"
    ? (0, D.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, D.jsxs)("span", {
            className: "hud-box px-3 py-2 text-xs text-white/80",
            children: [
              (0, D.jsx)(d0, { className: "inline -mt-0.5" }),
              " W/S drive \xB7 A/D steer",
              t.vehicle === "car" ? " \xB7 Space up \xB7 C down" : " \xB7 Space brake",
              " \xB7 Shift boost",
            ],
          }),
          (0, D.jsx)("button", { className: "btn btn-primary btn-sm", onClick: _h, children: "Park (E)" }),
        ],
      })
    : t.vehicle === "rocket"
      ? (0, D.jsx)("div", {
          className: "hud-box px-3 py-2 text-sm font-bold text-white",
          children: "Launching\u2026",
        })
      : (0, D.jsxs)("div", {
          className: "flex items-end gap-1.5",
          children: [
            e &&
              (0, D.jsx)("div", {
                className: "hud-box p-1 flex gap-1 pop-in",
                children: [
                  ["\u{1F44B}", "Wave"],
                  ["\u{1F483}", "Dance"],
                  ["\u{1F938}", "Flip"],
                  ["\u{1F499}", "Hearts"],
                ].map(([o, n], i) =>
                  (0, D.jsx)(
                    "button",
                    {
                      className: "hud-icon",
                      title: `${n} (${i + 1})`,
                      "aria-label": n,
                      onClick: () => {
                        (_t()?.doEmote(["wave", "dance", "flip", "hearts"][i]), a(!1));
                      },
                      children: o,
                    },
                    n,
                  ),
                ),
              }),
            (0, D.jsx)("button", {
              className: "hud-icon",
              "aria-pressed": e,
              title: "Emotes (1-4)",
              "aria-label": "Emotes",
              onClick: () => a((o) => !o),
              children: (0, D.jsx)(Kv, {}),
            }),
            (0, D.jsx)("button", {
              className: "hud-icon",
              "aria-pressed": t.hover,
              title: "Hoverboard (H)",
              "aria-label": "Hoverboard",
              onClick: () => _t()?.toggleHover(),
              children: "\u{1F6F9}",
            }),
            (0, D.jsx)("button", {
              className: "hud-icon",
              title: "Jump (Space)",
              "aria-label": "Jump",
              onClick: () => _t()?.jump(),
              children: (0, D.jsx)(Ti, {}),
            }),
          ],
        });
}
function bA() {
  let t = Y(),
    e = dA[t.hud.tab] || Eu,
    a = h5.find((o) => o.id === t.hud.tab) || h5[1],
    r = be(t.session?.userId);
  return (0, D.jsxs)("div", {
    className: "fixed inset-0 z-40 flex",
    style: { background: "rgba(8,9,11,.72)", backdropFilter: "blur(6px)" },
    role: "dialog",
    "aria-label": "Menu",
    onClick: ca,
    children: [
      (0, D.jsxs)("nav", {
        className: "menu-nav w-[220px] shrink-0 h-full scroll-y py-4 px-2 hidden sm:block",
        style: { background: "rgba(10,11,13,.85)", borderRight: "1px solid var(--line)" },
        onClick: (o) => o.stopPropagation(),
        children: [
          (0, D.jsxs)("div", {
            className: "flex items-center gap-2 px-2 pb-3 mb-2",
            style: { borderBottom: "1px solid var(--line)" },
            children: [
              (0, D.jsx)(Dr, { user: r, size: 34 }),
              (0, D.jsxs)("div", {
                className: "min-w-0",
                children: [
                  (0, D.jsx)("div", { className: "text-sm font-bold truncate", children: r?.name }),
                  (0, D.jsxs)("div", {
                    className: "text-[11px]",
                    style: { color: "var(--ink-dim)" },
                    children: ["Level ", Tr(t.game.xp), " \xB7 ", q(t.wallets[t.session.userId] || 0)],
                  }),
                ],
              }),
            ],
          }),
          F9.map((o) =>
            (0, D.jsxs)(
              "div",
              {
                className: "mb-3",
                children: [
                  (0, D.jsx)("div", {
                    className: "text-[10px] font-bold tracking-[.25em] px-2 mb-1",
                    style: { color: "var(--ink-dim)" },
                    children: o.group.toUpperCase(),
                  }),
                  o.items.map((n) => {
                    let i = n.icon,
                      s = t.hud.tab === n.id;
                    return (0, D.jsxs)(
                      "button",
                      {
                        "aria-current": s ? "page" : void 0,
                        onClick: () => It(n.id),
                        className: "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-left",
                        style: { color: s ? "#fff" : "var(--ink-dim)" },
                        children: [(0, D.jsx)(i, {}), " ", n.label],
                      },
                      n.id,
                    );
                  }),
                ],
              },
              o.group,
            ),
          ),
        ],
      }),
      (0, D.jsxs)("section", {
        className: "flex-1 min-w-0 h-full flex flex-col",
        onClick: (o) => o.stopPropagation(),
        children: [
          (0, D.jsxs)("header", {
            className: "flex items-center gap-3 px-4 md:px-6 py-3",
            style: { borderBottom: "1px solid var(--line)" },
            children: [
              (0, D.jsx)("select", {
                className: "field sm:hidden w-auto py-1.5",
                value: t.hud.tab,
                onChange: (o) => It(o.target.value),
                "aria-label": "Section",
                children: h5.map((o) => (0, D.jsx)("option", { value: o.id, children: o.label }, o.id)),
              }),
              (0, D.jsx)("h2", {
                className: "hud-font text-2xl hidden sm:block",
                children: a.label.toUpperCase(),
              }),
              (0, D.jsx)("div", {
                className: "ml-auto flex rounded-md p-0.5",
                role: "radiogroup",
                "aria-label": "Mode",
                style: { background: "rgba(0,0,0,.35)", border: "1px solid var(--line)" },
                children: cA.map((o) => {
                  let n = t.role === o.id,
                    i = o.icon;
                  return (0, D.jsxs)(
                    "button",
                    {
                      role: "radio",
                      "aria-checked": n,
                      onClick: () => HM(o.id),
                      className: "px-2.5 py-1.5 rounded text-xs font-bold flex items-center gap-1.5",
                      style: n ? { background: "var(--accent)", color: "#fff" } : { color: "var(--ink-dim)" },
                      children: [
                        (0, D.jsx)(i, {}),
                        " ",
                        (0, D.jsx)("span", { className: "hidden md:inline", children: o.label }),
                      ],
                    },
                    o.id,
                  );
                }),
              }),
              (0, D.jsx)("button", {
                className: "hud-icon",
                onClick: ca,
                "aria-label": "Close menu (Esc)",
                children: (0, D.jsx)(pe, {}),
              }),
            ],
          }),
          (0, D.jsx)("div", {
            id: "hud-scroll",
            className: "flex-1 scroll-y min-h-0",
            children: (0, D.jsx)("div", {
              className: "max-w-[760px] mx-auto px-4 md:px-6 py-5",
              children: (0, D.jsx)(Go, { label: "This page", children: (0, D.jsx)(e, {}) }, t.hud.tab),
            }),
          }),
        ],
      }),
    ],
  });
}
function u5() {
  let t = Y(),
    e = be(t.session?.userId),
    [a, r] = (0, nr.useState)(1);
  ((0, nr.useEffect)(() => {
    (wE(), O.connect());
  }, []),
    (0, nr.useEffect)(() => {
      s8();
      let p = setInterval(() => {
        let v = _t();
        v && r(v.peerCount() + 1);
      }, 1e3);
      return () => clearInterval(p);
    }, []),
    (0, nr.useEffect)(() => {
      document.documentElement.style.setProperty("--accent", t.settings.accent);
    }, [t.settings.accent]),
    (0, nr.useEffect)(() => {
      let p = (v) => {
        let g = v.target?.tagName,
          m = ["INPUT", "TEXTAREA", "SELECT"].includes(g),
          f = ot();
        if (!f.intro) {
          if (
            (v.key === "Escape" &&
              (f.travelOpen
                ? C({ travelOpen: null })
                : f.showcase
                  ? C({ showcase: !1 })
                  : f.shopView
                    ? C({ shopView: null })
                    : f.hud.open
                      ? ca()
                      : f.scene.mode !== "plaza"
                        ? Jr()
                        : document.activeElement?.blur()),
            !m && (v.key === "/" || ((v.ctrlKey || v.metaKey) && v.key.toLowerCase() === "k")))
          ) {
            (v.preventDefault(), C({ searchOpen: !f.searchOpen }));
            return;
          }
          (v.key === "Tab" &&
            !m &&
            (v.preventDefault(), f.hud.open ? ca() : It(f.hud.tab === "map" ? "shops" : f.hud.tab)),
            !m &&
              !f.talk &&
              (v.key === "m" || v.key === "M") &&
              (f.hud.open && f.hud.tab === "map" ? ca() : It("map")));
        }
      };
      return (window.addEventListener("keydown", p), () => window.removeEventListener("keydown", p));
    }, []));
  let o = t.scene.mode === "home" ? be(t.scene.owner) : null,
    n = t.scene.mode === "shop" ? qa(t).find((p) => p.id === t.scene.owner)?.name : "",
    i =
      t.scene.mode === "home"
        ? `${o?.name}'s home`
        : t.scene.mode === "shop"
          ? n || "Shop"
          : t.scene.mode === "club"
            ? "Skyline Club"
            : t.scene.mode === "gov"
              ? {
                  parliament: "Parliament of Fyrus",
                  bank: "Central Bank of Fyrus",
                  passport: "Citizen Center",
                  "class:school": "Fyrus Schools",
                  "class:college": "Fyrus Colleges",
                  "class:university": "Fyrus Universities",
                  "class:institute": "Fyrus Institutes",
                }[t.scene.owner || ""] || "Republic"
              : t.district,
    s = t.scene.mode !== "plaza",
    l = Tr(t.game.xp),
    c = Kc(l),
    d = Kc(l + 1),
    h = { zoom: t.settings.hudScale },
    u = t.intro || t.showcase;
  return (0, D.jsxs)(D.Fragment, {
    children: [
      (0, D.jsx)(hA, {}),
      t.intro && (0, D.jsx)(wx, {}),
      t.showcase &&
        (0, D.jsxs)(D.Fragment, {
          children: [
            (0, D.jsx)("div", {
              className: "fixed inset-x-0 top-0 h-[9vh] z-[45] bg-black pointer-events-none",
            }),
            (0, D.jsx)("div", {
              className: "fixed inset-x-0 bottom-0 h-[9vh] z-[45] bg-black pointer-events-none",
            }),
            (0, D.jsxs)("div", {
              className: "fixed z-[46] left-1/2 -translate-x-1/2 bottom-[11vh] text-center",
              children: [
                (0, D.jsxs)("div", {
                  className: "hud-font text-3xl text-white",
                  children: [e?.name, "'s home"],
                }),
                (0, D.jsxs)("button", {
                  className: "btn btn-ghost btn-sm mt-2",
                  onClick: () => C({ showcase: !1 }),
                  children: [(0, D.jsx)(pe, {}), " Exit"],
                }),
              ],
            }),
          ],
        }),
      !u &&
        (0, D.jsxs)(D.Fragment, {
          children: [
            (0, D.jsxs)("div", {
              className: "fixed z-20 left-3 top-3",
              style: { ...h, paddingTop: "env(safe-area-inset-top, 0px)" },
              children: [
                t.settings.minimap
                  ? (0, D.jsx)(uA, { place: i, coords: s ? "" : `${t.coords.x}, ${t.coords.z}` })
                  : (0, D.jsx)("button", {
                      className: "hud-icon",
                      onClick: () => It("map"),
                      "aria-label": "Map",
                      children: (0, D.jsx)(Ds, {}),
                    }),
                (0, D.jsx)("div", { className: "mt-2 hidden sm:block", children: (0, D.jsx)(vA, {}) }),
              ],
            }),
            t.settings.compass &&
              !s &&
              (0, D.jsx)("div", {
                className: "fixed z-20 left-1/2 -translate-x-1/2 top-3 hidden sm:block pointer-events-none",
                style: h,
                children: (0, D.jsx)(gA, {}),
              }),
            (0, D.jsxs)("div", {
              className: "fixed z-30 right-3 top-3 flex items-center gap-1.5",
              style: { ...h, paddingTop: "env(safe-area-inset-top, 0px)" },
              children: [
                t.net.admin &&
                  (0, D.jsxs)("button", {
                    id: "admin-btn",
                    className:
                      "h-10 px-3 rounded-full flex items-center gap-1.5 text-sm font-bold hud-box text-white",
                    onClick: () => C({ hud: { open: !0, tab: "admin" } }),
                    "aria-label": "Admin desk",
                    title: "Admin desk",
                    children: [
                      "\u2696 ",
                      (0, D.jsx)("span", { className: "hidden sm:inline", children: "Admin" }),
                    ],
                  }),
                (0, D.jsxs)("button", {
                  id: "search-btn",
                  className:
                    "h-10 px-3 rounded-full flex items-center gap-1.5 text-sm font-bold hud-box text-white",
                  onClick: () => C({ searchOpen: !0 }),
                  "aria-label": "Search places (/)",
                  title: "Search places (/ or Ctrl+K)",
                  children: [
                    "\u{1F50D} ",
                    (0, D.jsx)("span", { className: "hidden md:inline", children: "Where to?" }),
                  ],
                }),
                (0, D.jsxs)("button", {
                  id: "now-btn",
                  className:
                    "h-10 px-3 rounded-full flex items-center gap-1.5 text-sm font-bold hud-box text-white",
                  onClick: () => C({ hud: { open: !0, tab: "now" } }),
                  "aria-label": "Happening now",
                  title: "Happening now",
                  children: [
                    (0, D.jsx)("span", {
                      className: "inline-block w-2 h-2 rounded-full",
                      style: { background: "#e5484d" },
                    }),
                    " ",
                    (0, D.jsx)("span", { className: "hidden sm:inline", children: "Now" }),
                  ],
                }),
                (0, D.jsxs)("button", {
                  id: "flex-status",
                  className:
                    "h-10 px-3 rounded-full flex items-center gap-1.5 text-sm font-bold text-black flex-glow",
                  onClick: () => C({ shareCard: { kind: "status", id: "me" } }),
                  "aria-label": "Flex my Fyrus status",
                  title: "Flex my Fyrus status",
                  children: [
                    (0, D.jsx)(yg, {}),
                    " ",
                    (0, D.jsx)("span", { className: "hidden sm:inline", children: "Flex" }),
                  ],
                }),
                (0, D.jsxs)("button", {
                  className: "hud-box h-10 px-3 flex items-center gap-2 text-sm font-bold text-white tabular",
                  onClick: () => It("wallet"),
                  "aria-label": "Wallet",
                  children: [(0, D.jsx)(ru, {}), " ", q(t.wallets[t.session.userId] || 0)],
                }),
                (0, D.jsxs)("button", {
                  className:
                    "hud-box h-10 px-3 hidden sm:flex items-center gap-2 text-sm font-bold text-white tabular",
                  onClick: () => It("shop"),
                  "aria-label": "Orbs",
                  children: [(0, D.jsx)("span", { className: "orb-icon" }), " ", co(t.game.orbs)],
                }),
                (0, D.jsxs)("button", {
                  className: "hud-box h-10 px-2.5 hidden md:flex items-center gap-2",
                  onClick: () => It("explore"),
                  "aria-label": `Level ${l}`,
                  children: [
                    (0, D.jsx)("span", {
                      className: "hud-font text-xl text-white leading-none",
                      children: l,
                    }),
                    (0, D.jsx)("span", {
                      className: "w-14 h-1 rounded-full bg-white/15 overflow-hidden",
                      children: (0, D.jsx)("span", {
                        className: "block h-full",
                        style: {
                          width: `${((t.game.xp - c) / (d - c)) * 100}%`,
                          background: "var(--accent)",
                        },
                      }),
                    }),
                  ],
                }),
                t.lives.length > 0 &&
                  (0, D.jsxs)("button", {
                    className:
                      "hud-box h-10 px-3 hidden md:flex items-center gap-2 text-xs font-bold text-white",
                    onClick: () => It("live"),
                    children: [(0, D.jsx)("span", { className: "live-dot" }), " LIVE"],
                  }),
                a > 1 &&
                  (0, D.jsxs)("span", {
                    className:
                      "hud-box h-10 px-3 hidden lg:flex items-center gap-2 text-xs font-bold text-white",
                    children: [(0, D.jsx)($e, {}), " ", a],
                  }),
                t.net.status === "online" &&
                  (0, D.jsxs)("span", {
                    className:
                      "hud-box h-10 px-3 hidden sm:flex items-center gap-1.5 text-xs font-bold text-white",
                    title: "Citizens online now",
                    children: [
                      (0, D.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#45e0ae]" }),
                      t.net.online,
                    ],
                  }),
                (0, D.jsx)("button", {
                  className: "hud-icon",
                  onClick: () => It("map"),
                  "aria-label": "Map (M)",
                  title: "Map (M)",
                  children: (0, D.jsx)(mg, {}),
                }),
                (0, D.jsx)("button", {
                  className: "hud-icon",
                  onClick: () => It("settings"),
                  "aria-label": "Settings",
                  title: "Settings",
                  children: (0, D.jsx)(Xv, {}),
                }),
                (0, D.jsx)("button", {
                  className: "hud-icon",
                  onClick: () => (t.hud.open ? ca() : It(t.hud.tab === "map" ? "shops" : t.hud.tab)),
                  "aria-label": "Menu (Tab)",
                  title: "Menu (Tab)",
                  children: (0, D.jsx)(X8, {}),
                }),
              ],
            }),
            s &&
              (0, D.jsx)("div", {
                className: "fixed z-30 left-1/2 -translate-x-1/2 top-16 sm:top-3",
                style: h,
                children: (0, D.jsxs)("button", {
                  id: "leave-place",
                  className:
                    "px-4 h-11 rounded-full flex items-center gap-2 text-sm font-bold text-white shadow-lg",
                  style: { background: "var(--accent)" },
                  onClick: Jr,
                  children: [
                    (0, D.jsx)(Wo, {}),
                    " Exit to street ",
                    (0, D.jsxs)("span", {
                      className: "hidden sm:inline opacity-80 font-semibold",
                      children: ["\xB7 ", i, " \xB7 Esc"],
                    }),
                  ],
                }),
              }),
            !s &&
              t.backTo &&
              (0, D.jsxs)("div", {
                className: "fixed z-30 left-1/2 -translate-x-1/2 top-16 sm:top-14 flex items-center gap-1",
                style: h,
                children: [
                  (0, D.jsxs)("button", {
                    id: "go-back",
                    className: "hud-box pl-3 pr-2 h-9 flex items-center gap-2 text-xs font-bold text-white",
                    onClick: () => {
                      let p = ot().backTo;
                      (xa(p), C({ backTo: null }));
                    },
                    children: [(0, D.jsx)(Qr, {}), " Back to ", t.backTo.name],
                  }),
                  (0, D.jsx)("button", {
                    className: "hud-icon",
                    style: { width: 28, height: 28 },
                    "aria-label": "Dismiss",
                    onClick: () => C({ backTo: null }),
                    children: (0, D.jsx)(pe, {}),
                  }),
                ],
              }),
            (0, D.jsx)("div", {
              className: "fixed z-20 left-3 bottom-[76px] xl:bottom-3 hidden sm:block",
              style: { ...h, paddingBottom: "env(safe-area-inset-bottom, 0px)" },
              children: (0, D.jsx)(Fy, {}),
            }),
            (0, D.jsx)("div", {
              className: "fixed z-20 right-3 bottom-[76px] xl:bottom-3",
              style: { ...h, paddingBottom: "env(safe-area-inset-bottom, 0px)" },
              children: (0, D.jsx)(kA, {}),
            }),
            (0, D.jsx)("div", {
              className: "fixed z-30 left-1/2 -translate-x-1/2 bottom-3",
              style: { ...h, paddingBottom: "env(safe-area-inset-bottom, 0px)" },
              children: (0, D.jsx)($y, {}),
            }),
            t.nearby &&
              !t.talk &&
              !t.shopView &&
              !t.inspect &&
              (0, D.jsxs)("button", {
                onClick: () => _t()?.useNearest(),
                className:
                  "fixed z-20 left-1/2 -translate-x-1/2 bottom-[18%] flex items-center gap-2.5 pop-in max-w-[90vw]",
                style: h,
                children: [
                  (0, D.jsx)("kbd", {
                    className: "font-mono text-sm w-8 h-8 grid place-items-center rounded font-bold",
                    style: { background: "#f2f3f5", color: "#111" },
                    children: "E",
                  }),
                  (0, D.jsx)("span", {
                    className: "text-[15px] font-bold text-white hud-text-shadow truncate",
                    children: t.nearby.label,
                  }),
                ],
              }),
            (t.vehicle === "drive" || t.vehicle === "car") &&
              (0, D.jsxs)("div", {
                className: "fixed z-20 right-3 bottom-16 hud-box px-4 py-2 text-white pointer-events-none",
                style: h,
                children: [
                  (0, D.jsx)("span", { className: "hud-font text-4xl tabular", children: t.speedKmh }),
                  " ",
                  (0, D.jsx)("span", { className: "text-xs", children: "km/h" }),
                  t.vehicle === "car" &&
                    (0, D.jsxs)("div", {
                      className: "text-[11px] text-white/70",
                      children: ["Altitude ", t.altitude, " m"],
                    }),
                ],
              }),
            t.swimming &&
              (0, D.jsx)("div", {
                className:
                  "fixed z-20 left-1/2 -translate-x-1/2 bottom-[26%] text-xs font-bold text-white/90 hud-text-shadow",
                children: "SWIMMING",
              }),
          ],
        }),
      t.hud.open && !t.intro && (0, D.jsx)(bA, {}),
      (0, D.jsx)(xA, {}),
      (0, D.jsx)(yA, {}),
      t.inspect &&
        !t.intro &&
        (0, D.jsx)(Go, {
          label: "The close-up",
          onReset: () => C({ inspect: null }),
          children: (0, D.jsx)(c5, {}),
        }),
      (0, D.jsx)(Go, {
        label: "The phone",
        onReset: () => C({ phoneOpen: !1 }),
        children: (0, D.jsx)(Dy, {}),
      }),
      (0, D.jsxs)(Go, {
        label: "Travel",
        onReset: () => C({ travelOpen: null }),
        children: [(0, D.jsx)(Uy, {}), (0, D.jsx)(E9, {}), (0, D.jsx)(M9, {})],
      }),
      t.call &&
        (0, D.jsx)(Go, { label: "The call", onReset: () => C({ call: null }), children: (0, D.jsx)(w9, {}) }),
      t.shareCard &&
        (0, D.jsx)(Go, {
          label: "Sharing",
          onReset: () => C({ shareCard: null }),
          children: (0, D.jsx)(Wy, {}),
        }),
      t.dm &&
        (0, D.jsx)(Go, {
          label: "The private chat",
          onReset: () => C({ dm: null }),
          children: (0, D.jsx)(d5, {}),
        }),
      (0, D.jsx)(D9, {}),
      t.talk &&
        (0, D.jsx)(Go, {
          label: "The conversation",
          onReset: () => C({ talk: null }),
          children: (0, D.jsx)(Ex, {}, t.talk.id),
        }),
      t.shopView &&
        (0, D.jsx)(Go, {
          label: "The shop page",
          onReset: () => C({ shopView: null }),
          children: (0, D.jsx)(Lx, {}),
        }),
      t.goalOpen && !t.intro && (0, D.jsx)(e5, {}),
      t.age18Ask && (0, D.jsx)(K7, {}),
      t.searchOpen && (0, D.jsx)(l5, {}),
      (0, D.jsx)(G9, {}),
      (0, D.jsx)(V9, {}),
      (0, D.jsx)(P9, {}),
      (0, D.jsx)(W9, {}),
      (0, D.jsx)(I9, {}),
      (0, D.jsx)(O9, {}),
      t.dailyOpen && !t.intro && !t.goalOpen && (0, D.jsx)(fA, {}),
      t.activeGame &&
        (0, D.jsx)(Go, {
          label: "The game",
          onReset: () => C({ activeGame: null }),
          children: (0, D.jsx)(yx, {}, t.activeGame),
        }),
      t.productView &&
        (0, D.jsx)(Go, {
          label: "The 3D viewer",
          onReset: () => C({ productView: null }),
          children: (0, D.jsx)(kx, {}),
        }),
      t.levelUp && (0, D.jsx)(mA, { level: t.levelUp }),
      (0, D.jsx)("div", {
        className: `fixed z-50 ${t.hud.open ? "bottom-4" : "top-[64px]"} left-1/2 -translate-x-1/2 flex flex-col gap-1.5 items-center w-[min(92vw,420px)] pointer-events-none`,
        "aria-live": "polite",
        children: (t.hud.open ? t.toasts.slice(-1) : t.toasts.slice(-3)).map((p) =>
          (0, D.jsxs)(
            "div",
            {
              className: "hud-box px-4 py-2 text-sm text-white pop-in w-full flex items-center gap-2",
              style: {
                borderLeft: `3px solid ${p.tone === "warn" ? "var(--rose)" : p.tone === "xp" ? "var(--ember)" : "var(--accent)"}`,
              },
              children: [
                p.tone === "xp" &&
                  (0, D.jsx)(Ji, { className: "shrink-0", style: { color: "var(--ember)" } }),
                p.text,
              ],
            },
            p.id,
          ),
        ),
      }),
    ],
  });
}
var p5 = P(ct(), 1);
function g5() {
  return Y().session ? (0, p5.jsx)(u5, {}) : (0, p5.jsx)(rx, {});
}
var $9 = P(ct(), 1);
(0, U9.createRoot)(document.getElementById("root")).render((0, $9.jsx)(g5, {}));
