function w9() {
  let e = Y().call,
    [a, r] = (0, Xe.useState)(!1),
    [, o] = (0, Xe.useState)(0);
  if (
    ((0, Xe.useEffect)(() => {
      let i = setInterval(() => o((s) => s + 1), 1e3);
      return () => clearInterval(i);
    }, []),
    (0, Xe.useEffect)(() => {
      if (e?.state === "calling") {
        let i = setTimeout(() => {
          ot().call?.state === "calling" && (B0(), F("No answer.", "info"));
        }, 35e3);
        return () => clearTimeout(i);
      }
    }, [e?.state]),
    !e)
  )
    return null;
  let n = Math.floor((Date.now() - e.at) / 1e3);
  return (0, K.jsxs)("div", {
    className:
      "fixed z-[85] left-1/2 -translate-x-1/2 top-20 hud-box p-4 w-[min(92vw,300px)] text-center text-white pop-in",
    role: "alertdialog",
    "aria-label": "Call",
    children: [
      (0, K.jsx)("div", {
        className: "w-14 h-14 rounded-full mx-auto grid place-items-center text-xl font-bold",
        style: { background: "var(--accent)" },
        children: e.name[0],
      }),
      (0, K.jsx)("div", { className: "font-bold mt-2", children: e.name }),
      (0, K.jsx)("div", { className: "text-[11px] text-white/60", children: e.number }),
      (0, K.jsx)("div", {
        className: "text-[12px] mt-1",
        children:
          e.state === "ringing-in"
            ? "Incoming Fyrus call\u2026"
            : e.state === "calling"
              ? "Calling\u2026"
              : `${Math.floor(n / 60)}:${String(n % 60).padStart(2, "0")}`,
      }),
      (0, K.jsxs)("div", {
        className: "flex gap-3 justify-center mt-3",
        children: [
          e.state === "ringing-in" &&
            (0, K.jsx)("button", {
              className: "w-12 h-12 rounded-full grid place-items-center",
              style: { background: "#2e7d32" },
              onClick: v9,
              "aria-label": "Answer",
              children: (0, K.jsx)(Ci, {}),
            }),
          e.state === "active" &&
            (0, K.jsx)("button", {
              className: "w-12 h-12 rounded-full grid place-items-center bg-white/15",
              onClick: () => {
                (x9(!a), r(!a));
              },
              "aria-label": a ? "Unmute" : "Mute",
              children: a ? (0, K.jsx)(o0, {}) : (0, K.jsx)(rn, {}),
            }),
          (0, K.jsx)("button", {
            className: "w-12 h-12 rounded-full grid place-items-center",
            style: { background: "#c62828" },
            onClick: () => B0(),
            "aria-label": "Hang up",
            children: (0, K.jsx)(ig, {}),
          }),
        ],
      }),
    ],
  });
}
var rr = P(ct(), 1);
function Fy() {
  let t = Y(),
    [e, a] = (0, jn.useState)(""),
    [r, o] = (0, jn.useState)("near"),
    [n, i] = (0, jn.useState)(!1),
    [s, l] = (0, jn.useState)({}),
    [c, d] = (0, jn.useState)(null),
    h = (0, jn.useRef)(null),
    u = (0, jn.useRef)(null),
    p = t.net.status === "online";
  ((0, jn.useEffect)(() => {
    let f = (y) => {
      let x = y.target?.tagName;
      y.key === "Enter" &&
        !["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(x) &&
        !ot().talk &&
        !ot().hud.open &&
        (y.preventDefault(), h.current?.focus(), i(!0));
    };
    return (window.addEventListener("keydown", f), () => window.removeEventListener("keydown", f));
  }, []),
    (0, jn.useEffect)(
      () =>
        O.on("msg", (f) => {
          (f.channel !== "near" && f.channel !== "city") ||
            C({ chatLog: [...ot().chatLog, { ...f, mine: f.from === O.meId }].slice(-120) });
        }),
      [],
    ),
    (0, jn.useEffect)(() => {
      u.current?.scrollTo({ top: 1e6 });
    }, [t.chatLog.length, n, r]));
  let v = () => {
      let f = e.trim();
      f &&
        (r === "near" && _t()?.say(f.slice(0, 140)),
        p
          ? O.send({ t: "say", channel: r, text: f })
          : C({
              chatLog: [
                ...ot().chatLog,
                {
                  id: String(Date.now()),
                  channel: r,
                  from: "me",
                  fromName: "You",
                  text: f,
                  at: Date.now(),
                  mine: !0,
                },
              ].slice(-120),
            }),
        a(""),
        h.current?.blur());
    },
    g = t.chatLog.filter((f) => f.channel === r).filter((f) => !t.net.blocks.includes(f.from)),
    m = n ? g.slice(-40) : g.slice(-3);
  return (0, rr.jsxs)("div", {
    className: "w-[300px] max-w-[80vw]",
    children: [
      (n || m.length > 0) &&
        (0, rr.jsxs)("div", {
          className: "hud-box mb-1 overflow-hidden",
          onClick: () => i(!0),
          children: [
            n &&
              (0, rr.jsxs)("div", {
                className: "flex items-center gap-1 px-2 pt-1.5 text-[11px]",
                children: [
                  ["near", "city"].map((f) =>
                    (0, rr.jsx)(
                      "button",
                      {
                        className: `chip ${r === f ? "chip-on" : ""}`,
                        onClick: (y) => {
                          (y.stopPropagation(), o(f));
                        },
                        children: f === "near" ? "Nearby" : "City",
                      },
                      f,
                    ),
                  ),
                  (0, rr.jsxs)("span", {
                    className: "ml-auto text-white/60 flex items-center gap-1",
                    title: "Messages are shown in your language",
                    children: [(0, rr.jsx)(s0, {}), " ", of(t.settings.lang || "en")],
                  }),
                  (0, rr.jsx)("button", {
                    className: "text-white/60 px-1",
                    onClick: (f) => {
                      (f.stopPropagation(), i(!1));
                    },
                    "aria-label": "Collapse chat",
                    children: "\u25BE",
                  }),
                ],
              }),
            (0, rr.jsxs)("div", {
              ref: u,
              className: "px-2.5 py-1.5 space-y-0.5 scroll-y",
              style: { maxHeight: n ? 220 : 72 },
              children: [
                m.length === 0 &&
                  (0, rr.jsx)("div", {
                    className: "text-[11px] text-white/50",
                    children: p
                      ? r === "near"
                        ? "People within 40 m see these messages above your head."
                        : "Everyone in Fyrus City sees these."
                      : "Live chat between people works on fyrus.io.",
                  }),
                m.map((f) =>
                  (0, rr.jsxs)(
                    "div",
                    {
                      className: "text-[12px] leading-snug text-white",
                      children: [
                        (0, rr.jsxs)("button", {
                          className: "font-bold mr-1 hover:underline",
                          style: { color: f.color || "#ffc27a" },
                          onClick: (y) => {
                            (y.stopPropagation(), f.mine || d(f));
                          },
                          children: [f.mine ? "You" : f.fromName, ":"],
                        }),
                        (0, rr.jsx)("span", { children: s[f.id] && f.orig ? f.orig : f.text }),
                        f.orig &&
                          (0, rr.jsx)("button", {
                            className: "ml-1 text-[10px] text-white/50 underline",
                            onClick: (y) => {
                              (y.stopPropagation(), l((x) => ({ ...x, [f.id]: !x[f.id] })));
                            },
                            children: s[f.id] ? "translation" : "original",
                          }),
                      ],
                    },
                    f.id,
                  ),
                ),
              ],
            }),
          ],
        }),
      (0, rr.jsxs)("form", {
        className: "flex gap-1",
        onSubmit: (f) => {
          (f.preventDefault(), v());
        },
        children: [
          (0, rr.jsx)("input", {
            ref: h,
            id: "plaza-say",
            className:
              "hud-box text-sm px-3 py-2 text-white placeholder-white/50 outline-none focus:border-[var(--accent)] flex-1 min-w-0",
            value: e,
            onChange: (f) => a(f.target.value),
            onFocus: () => i(!0),
            placeholder: r === "near" ? "Say something nearby (Enter)" : "Message the whole city",
            maxLength: 300,
          }),
          (0, rr.jsx)("button", {
            className: "hud-icon",
            "aria-label": "Send",
            children: (0, rr.jsx)(Da, {}),
          }),
          p &&
            (0, rr.jsx)("button", {
              type: "button",
              className: "hud-icon",
              "aria-label": t.voiceOn ? "Turn voice off" : "Talk with voice",
              title: "Proximity voice",
              onClick: () => y9(!t.voiceOn),
              style: t.voiceOn ? { background: "var(--accent)" } : {},
              children: t.voiceOn ? (0, rr.jsx)(rn, {}) : (0, rr.jsx)(o0, {}),
            }),
        ],
      }),
      c &&
        (0, rr.jsx)(Oy, {
          id: c.from,
          name: c.fromName,
          number: c.number || "",
          onClose: () => d(null),
          quote: c.orig || c.text,
        }),
    ],
  });
}
var A0 = P(Zt(), 1);
var wt = P(ct(), 1),
  nf = (t) => {
    let e = Ch(t);
    return { x: e.x, z: e.z + (t === "core" ? 12 : 9.5) };
  };
function Uy() {
  let t = Y(),
    e = t.travelOpen,
    [a, r] = (0, A0.useState)(e?.station ? "metro" : "taxi");
  if (
    ((0, A0.useEffect)(() => {
      e?.station ? r("metro") : e?.tab && r(e.tab);
    }, [e?.station, e?.tab, !!e]),
    !e)
  )
    return null;
  let o = _t(),
    n = { x: t.coords.x, z: t.coords.z },
    i = o?.nearestStation(),
    s = e.station || (i && i.dist < 14 ? i.station.id : void 0),
    l = () => C({ travelOpen: null }),
    c = [
      ...Hr.filter((d) => d.id !== "capital").map((d) => ({
        name: d.name,
        ...nf(ei.find((h) => h.id === d.id)?.id || "core"),
      })),
      { name: "Capital \xB7 Parliament", x: -58, z: -26 },
      ...Oa.filter((d) => d.kind !== "homes").map((d) => ({
        name: d.name,
        ...(d.id === "joyland" ? nf("joyland") : d.id === "airport" ? Cn : to(d.id)),
      })),
      ...w8().map((d) => ({ name: `My plot ${d.id}`, x: d.x, z: d.z + d.size / 2 + 3 })),
      ...Gr.map((d) => ({ name: `${d.name} gate`, x: d.gate.x, z: d.gate.z })),
      { name: "Starter Commons", x: Jt.x, z: Jt.z - 66 },
      ...(t.estateMine?.owned || []).concat(t.estateMine?.renting || []).map((d) => {
        let h = _i(d.id);
        return { name: `My home ${h.id}`, x: h.x, z: h.z + h.face * (h.size / 2 + 3) };
      }),
      ...(t.waypoint ? [{ name: `Map pin \xB7 ${t.waypoint.name}`, x: t.waypoint.x, z: t.waypoint.z }] : []),
    ].map((d) => ({ ...d, d: Math.hypot(d.x - n.x, d.z - n.z) }));
  return (0, wt.jsxs)("div", {
    className:
      "fixed z-[60] left-1/2 -translate-x-1/2 top-16 w-[min(94vw,440px)] max-h-[78vh] hud-box flex flex-col pop-in text-white",
    role: "dialog",
    "aria-label": "Travel",
    children: [
      (0, wt.jsxs)("div", {
        className: "flex items-center gap-2 px-3 pt-3",
        children: [
          (0, wt.jsx)("b", { className: "flex-1", children: "Travel around Fyrus" }),
          (0, wt.jsx)("button", { onClick: l, "aria-label": "Close", children: (0, wt.jsx)(pe, {}) }),
        ],
      }),
      (0, wt.jsx)("div", {
        className: "flex gap-1 px-3 py-2",
        children: [
          ["metro", "Metro", Zh],
          ["taxi", "Taxi", ci],
          ["fly", "Fly", Li],
          ["rides", "Joyland", dd],
        ].map(([d, h, u]) =>
          (0, wt.jsxs)(
            "button",
            {
              className: `chip ${a === d ? "chip-on" : ""}`,
              onClick: () => r(d),
              children: [(0, wt.jsx)(u, { className: "inline mr-1" }), h],
            },
            d,
          ),
        ),
      }),
      (0, wt.jsxs)("div", {
        className: "scroll-y px-3 pb-3 space-y-1.5 text-sm",
        children: [
          a === "metro" &&
            (0, wt.jsxs)(wt.Fragment, {
              children: [
                (0, wt.jsxs)("p", {
                  className: "text-[12px] text-white/70",
                  children: [
                    "Elevated trains link the capital with every city. ",
                    $2,
                    " FYC a trip, any distance.",
                  ],
                }),
                s
                  ? (0, wt.jsxs)(wt.Fragment, {
                      children: [
                        (0, wt.jsxs)("div", {
                          className: "text-[12px] font-bold",
                          children: ["You are at: ", Ch(s).name],
                        }),
                        ei
                          .filter((d) => d.id !== s)
                          .map((d) =>
                            (0, wt.jsxs)(
                              "button",
                              {
                                className:
                                  "w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left card-hover",
                                style: { border: "1px solid rgba(255,255,255,.15)" },
                                onClick: () => o?.startTrain(s, d.id),
                                children: [
                                  (0, wt.jsx)(Zh, {}),
                                  (0, wt.jsx)("span", { className: "flex-1", children: d.name }),
                                  (0, wt.jsxs)("span", {
                                    className: "text-[11px] text-white/60",
                                    children: [$2, " FYC"],
                                  }),
                                ],
                              },
                              d.id,
                            ),
                          ),
                      ],
                    })
                  : (0, wt.jsxs)(wt.Fragment, {
                      children: [
                        (0, wt.jsxs)("div", {
                          className: "text-[12px]",
                          children: [
                            "Walk to a station to board. Nearest: ",
                            (0, wt.jsx)("b", { children: i?.station.name }),
                            " (",
                            Math.round(i?.dist || 0),
                            " m).",
                          ],
                        }),
                        i &&
                          (0, wt.jsxs)("div", {
                            className: "flex gap-1.5",
                            children: [
                              (0, wt.jsx)("button", {
                                className: "btn-primary px-3 py-1.5 rounded-md text-[12px]",
                                onClick: () => {
                                  (C({
                                    waypoint: { ...nf(i.station.id), name: `Metro \xB7 ${i.station.name}` },
                                  }),
                                    l());
                                },
                                children: "Route me there",
                              }),
                              (0, wt.jsxs)("button", {
                                className: "chip",
                                onClick: () =>
                                  o?.startTaxi({ ...nf(i.station.id), name: `${i.station.name} station` }),
                                children: ["Taxi there \xB7 ", Th(i.dist), " FYC"],
                              }),
                            ],
                          }),
                      ],
                    }),
              ],
            }),
          a === "taxi" &&
            (0, wt.jsxs)(wt.Fragment, {
              children: [
                (0, wt.jsx)("p", {
                  className: "text-[12px] text-white/70",
                  children:
                    "Yellow Fyrus Taxis use the sky lane above the streets. Fare: 5 FYC + 4 FYC per 100 m.",
                }),
                c
                  .sort((d, h) => d.d - h.d)
                  .map((d) =>
                    (0, wt.jsxs)(
                      "button",
                      {
                        className:
                          "w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left card-hover",
                        style: { border: "1px solid rgba(255,255,255,.15)" },
                        disabled: d.d < 15,
                        onClick: () => o?.startTaxi(d),
                        children: [
                          (0, wt.jsx)(ci, {}),
                          (0, wt.jsx)("span", { className: "flex-1 truncate", children: d.name }),
                          (0, wt.jsxs)("span", {
                            className: "text-[11px] text-white/60",
                            children: [Math.round(d.d), " m \xB7 ", d.d < 15 ? "here" : `${Th(d.d)} FYC`],
                          }),
                        ],
                      },
                      d.name,
                    ),
                  ),
              ],
            }),
          a === "fly" &&
            (() => {
              let d = Math.hypot(n.x - Cn.x, n.z - Cn.z) < 45,
                h = Ki();
              return (0, wt.jsxs)(wt.Fragment, {
                children: [
                  (0, wt.jsxs)("p", {
                    className: "text-[12px] text-white/70",
                    children: [
                      "Fyrus Airlines flies from Fyrus International Airport, east of Skyline Club.",
                      d ? " You are at the airport \u2014 pick a flight." : "",
                    ],
                  }),
                  !d &&
                    (0, wt.jsx)("div", {
                      className: "flex gap-1.5",
                      children: (0, wt.jsxs)("button", {
                        className: "btn-primary px-3 py-1.5 rounded-md text-[12px]",
                        onClick: () => o?.startTaxi({ ...Cn, name: "Fyrus International Airport" }),
                        children: [
                          "Taxi to the airport \xB7 ",
                          Th(Math.hypot(n.x - Cn.x, n.z - Cn.z)),
                          " FYC",
                        ],
                      }),
                    }),
                  Lp.map((u) =>
                    (0, wt.jsxs)(
                      "button",
                      {
                        "data-flight": u.id,
                        className:
                          "w-full flex items-center gap-2 rounded-md px-2.5 py-2 text-left card-hover",
                        style: { border: "1px solid rgba(255,255,255,.15)", opacity: d ? 1 : 0.6 },
                        onClick: () => o?.startFlight(u.id),
                        children: [
                          (0, wt.jsx)(Li, {}),
                          (0, wt.jsxs)("div", {
                            className: "flex-1",
                            children: [
                              (0, wt.jsx)("div", { className: "font-bold", children: u.name }),
                              (0, wt.jsx)("div", {
                                className: "text-[11px] text-white/60",
                                children: u.desc,
                              }),
                            ],
                          }),
                          (0, wt.jsxs)("span", {
                            className: "text-[11px] text-white/70",
                            children: [u.fare, " FYC"],
                          }),
                        ],
                      },
                      u.id,
                    ),
                  ),
                  (0, wt.jsxs)("div", {
                    className: "text-[12px] font-bold pt-2",
                    children: ["Private helicopter ", h ? "" : "\xB7 passport holders"],
                  }),
                  (0, wt.jsx)("p", {
                    className: "text-[11px] text-white/60",
                    children:
                      "Picks you up where you stand and lands at your destination. 30 FYC + 12 FYC per 100 m.",
                  }),
                  c
                    .filter((u) => u.d >= 20)
                    .sort((u, p) => u.d - p.d)
                    .slice(0, 8)
                    .map((u) =>
                      (0, wt.jsxs)(
                        "button",
                        {
                          className:
                            "w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-left card-hover",
                          style: { border: "1px solid rgba(255,255,255,.12)", opacity: h ? 1 : 0.5 },
                          onClick: () => o?.startHeli(u, h),
                          children: [
                            (0, wt.jsx)(_8, {}),
                            (0, wt.jsx)("span", {
                              className: "flex-1 truncate text-[13px]",
                              children: u.name,
                            }),
                            (0, wt.jsxs)("span", {
                              className: "text-[11px] text-white/60",
                              children: [Cp(u.d), " FYC"],
                            }),
                          ],
                        },
                        "h" + u.name,
                      ),
                    ),
                ],
              });
            })(),
          a === "rides" &&
            (0, wt.jsxs)(wt.Fragment, {
              children: [
                (0, wt.jsx)("p", {
                  className: "text-[12px] text-white/70",
                  children:
                    "Fyrus Joyland is south-east of the Marina. Walk up to a ride and press E, or take the Metro to Joyland station.",
                }),
                qc.map((d) =>
                  (0, wt.jsxs)(
                    "div",
                    {
                      className: "flex items-center gap-2 rounded-md px-2.5 py-2",
                      style: { border: "1px solid rgba(255,255,255,.15)" },
                      children: [
                        (0, wt.jsx)(dd, {}),
                        (0, wt.jsxs)("div", {
                          className: "flex-1",
                          children: [
                            (0, wt.jsx)("div", { className: "font-bold", children: d.name }),
                            (0, wt.jsxs)("div", {
                              className: "text-[11px] text-white/60",
                              children: [d.desc, " \xB7 ", d.dur, "s"],
                            }),
                          ],
                        }),
                        (0, wt.jsx)("span", {
                          className: "text-[12px] font-bold",
                          style: { color: d.fee ? "#ffc27a" : "#45e0ae" },
                          children: d.fee ? `${d.fee} FYC` : "Free",
                        }),
                      ],
                    },
                    d.id,
                  ),
                ),
                (0, wt.jsx)("button", {
                  className: "btn-primary px-3 py-1.5 rounded-md text-[12px]",
                  onClick: () => o?.startTaxi({ x: lr.x - 40, z: lr.z + 62, name: "Fyrus Joyland" }),
                  children: "Taxi to Joyland",
                }),
              ],
            }),
        ],
      }),
    ],
  });
}
function M9() {
  let t = Y(),
    e = qc.find((n) => n.id === t.rideCard),
    [a, r] = (0, A0.useState)("outside");
  if (
    ((0, A0.useEffect)(() => {
      e && r(e.view || "rider");
    }, [e?.id]),
    !e)
  )
    return null;
  let o = () => C({ rideCard: null });
  return (0, wt.jsx)("div", {
    className: "fixed inset-0 z-[60] grid place-items-center p-4",
    style: { background: "rgba(0,0,0,.45)" },
    role: "dialog",
    "aria-label": e.name,
    onClick: o,
    children: (0, wt.jsxs)("div", {
      className: "glass rounded-xl p-5 w-full max-w-sm pop-in",
      onClick: (n) => n.stopPropagation(),
      children: [
        (0, wt.jsxs)("div", {
          className: "flex items-center gap-2",
          children: [
            (0, wt.jsx)(dd, { style: { color: "var(--ember)" } }),
            (0, wt.jsx)("div", {
              className: "text-[10px] font-bold tracking-[.25em]",
              style: { color: "var(--ember-hi)" },
              children: "FYRUS JOYLAND",
            }),
          ],
        }),
        (0, wt.jsx)("h2", { className: "hud-font text-2xl mt-1", children: e.name }),
        (0, wt.jsx)("div", { className: "text-sm", style: { color: "var(--ink-dim)" }, children: e.desc }),
        (0, wt.jsxs)("div", {
          className: "flex gap-3 text-sm mt-3",
          children: [
            (0, wt.jsx)("span", { className: "chip", children: e.fee ? `${e.fee} FYC` : "Free" }),
            (0, wt.jsxs)("span", { className: "chip", children: [e.dur, " seconds"] }),
          ],
        }),
        (0, wt.jsx)("div", { className: "label mt-3", children: "How do you want to see it?" }),
        (0, wt.jsx)("div", {
          className: "grid grid-cols-2 gap-2",
          children: [
            ["outside", "See myself on the ride"],
            ["rider", "Through my eyes"],
          ].map(([n, i]) =>
            (0, wt.jsx)(
              "button",
              {
                "data-ride-view": n,
                className: `card p-2 text-sm text-left ${a === n ? "chip-on" : ""}`,
                onClick: () => r(n),
                children: i,
              },
              n,
            ),
          ),
        }),
        (0, wt.jsx)("div", {
          className: "text-[11px] mt-2",
          style: { color: "var(--ink-dim)" },
          children: 'You can switch any time with V. "Get off" ends the ride.',
        }),
        (0, wt.jsxs)("div", {
          className: "flex gap-2 mt-4",
          children: [
            (0, wt.jsx)("button", { className: "btn btn-ghost flex-1", onClick: o, children: "Not now" }),
            (0, wt.jsxs)("button", {
              id: "ride-go",
              className: "btn btn-primary flex-1",
              onClick: () => {
                (o(), _t()?.startRide(e.id, a));
              },
              children: ["Sit & ride", e.fee ? ` \xB7 ${e.fee} FYC` : ""],
            }),
          ],
        }),
      ],
    }),
  });
}
function E9() {
  let t = Y();
  return t.trip
    ? (0, wt.jsxs)("div", {
        className:
          "fixed z-[55] left-1/2 -translate-x-1/2 bottom-24 hud-box px-3 py-2 flex items-center gap-3 text-white text-sm pop-in",
        role: "status",
        children: [
          t.trip.kind === "metro"
            ? (0, wt.jsx)(Zh, {})
            : t.trip.kind === "taxi"
              ? (0, wt.jsx)(ci, {})
              : t.trip.kind === "flight" || t.trip.kind === "heli"
                ? (0, wt.jsx)(Li, {})
                : t.trip.kind === "cruise"
                  ? (0, wt.jsx)(P8, {})
                  : (0, wt.jsx)(dd, {}),
          (0, wt.jsx)("span", { children: t.trip.label }),
          t.trip.kind === "ride" &&
            (0, wt.jsx)("button", {
              id: "ride-view",
              className: "chip",
              onClick: () => _t()?.toggleRideView(),
              title: "V",
              children: "Switch view (V)",
            }),
          (0, wt.jsxs)("button", {
            id: "trip-skip",
            className: "chip",
            onClick: () => _t()?.endTrip(),
            children: [
              (0, wt.jsx)(G8, { className: "inline mr-1" }),
              t.trip.kind === "ride" ? "Get off" : t.trip.kind === "tour" ? "End tour" : "Skip to arrival",
            ],
          }),
        ],
      })
    : null;
}
var lf = P(Zt(), 1);
var Ar = P(ct(), 1),
  sf = () => C({ dockHub: null }),
  L9 = [
    {
      id: "cities",
      label: "Cities & Transit",
      icon: s0,
      tiles: [
        {
          id: "now",
          label: "Happening now",
          sub: "Live events, people near you, auctions",
          icon: Qi,
          go: () => Bp(),
        },
        {
          id: "tour",
          label: "Drone tour",
          sub: "Fly over the most important places",
          icon: Li,
          go: () => _t()?.startTour(),
        },
        { id: "map", label: "Map", sub: "All cities, plots and places", icon: Ds, go: () => It("map") },
        {
          id: "metro",
          label: "Metro & Taxi",
          sub: "Trains between cities, taxis anywhere",
          icon: Zh,
          go: () => C({ travelOpen: {} }),
        },
        {
          id: "fly",
          label: "SkyPort flights",
          sub: "Fyrus Airlines and helicopters",
          icon: Li,
          go: () => C({ travelOpen: { tab: "fly" } }),
        },
        {
          id: "coast",
          label: "Sea View coast",
          sub: "Beach, boardwalk and yachts",
          icon: Qp,
          go: () => _t()?.startTaxi({ x: we.board.x, z: we.board.z, name: "Sea View boardwalk" }),
        },
        { id: "land", label: "City plots", sub: "Buy land in a city", icon: da, go: () => Fl("land") },
        {
          id: "services",
          label: "Everyday services",
          sub: "Hospital, police, fire, post, library, pharmacy",
          icon: da,
          go: () => ed(),
        },
        {
          id: "food",
          label: "Food Street",
          sub: "Biryani, chaat, BBQ, noodles, chai, ice cream",
          icon: da,
          go: () => es({ x: 106, z: -192 }, "Food Street"),
        },
        {
          id: "bazaarday",
          label: "Everyday Bazaar",
          sub: "Phones, Wi-Fi, snacks, bartan, barber, beauty, diner",
          icon: da,
          go: () => es({ x: 168, z: 64 }, "Everyday Bazaar"),
        },
        {
          id: "faith",
          label: "Faith District",
          sub: "Mosque, church, mandir, gurdwara, temple, synagogue",
          icon: da,
          go: () => es({ x: 0, z: 284 }, "Faith District"),
        },
        {
          id: "estates",
          label: "360 society plots",
          sub: "Buy, auction or rent in gated societies",
          icon: Ma,
          go: () => zo(),
        },
      ],
    },
    {
      id: "luxury",
      label: "Luxury Life",
      icon: Us,
      tiles: [
        {
          id: "societies",
          label: "Gated societies",
          sub: "Executive \xB7 Marina Bay \xB7 Royal Sky \xB7 free studios",
          icon: Us,
          go: () => zo(),
        },
        {
          id: "flex",
          label: "Flex my status",
          sub: "Boarding-pass card to share",
          icon: yg,
          go: () => C({ shareCard: { kind: "status", id: "me" } }),
        },
        {
          id: "dream",
          label: "Dream Life",
          sub: "Supercars, mansions, jets",
          icon: pg,
          go: () => It("dream"),
        },
        { id: "drive", label: "Drive", sub: "Take your car out", icon: d0, go: () => Vs() },
        {
          id: "lounges",
          label: "Lounges & Gaming Arena",
          sub: "Skyline Lounge, rooftop, arena \xB7 walk in or book",
          icon: Jh,
          go: () => xa(to("lounge")),
        },
        {
          id: "club",
          label: "Skyline Club",
          sub: "Music and a dance floor",
          icon: sg,
          go: () => xa(to("club")),
        },
        {
          id: "joy",
          label: "Joyland",
          sub: "Rides, some free",
          icon: dd,
          go: () => C({ travelOpen: { tab: "rides" } }),
        },
        {
          id: "games",
          label: "Gaming zone",
          sub: "Race, chess, air hockey",
          icon: on,
          go: () => It("games"),
        },
        {
          id: "homes",
          label: "Homes & keys",
          sub: "Go inside, decorate, lock, give keys",
          icon: Ma,
          go: () => Vl(),
        },
        { id: "home", label: "My showroom", sub: "Build your creator home", icon: Ma, go: () => It("home") },
        { id: "style", label: "Style", sub: "Outfits, trails, boards", icon: Qh, go: () => It("shop") },
        {
          id: "friends",
          label: "Friends & rooms",
          sub: "Private rooms and game invites",
          icon: $e,
          go: () => It("friends"),
        },
      ],
    },
    {
      id: "work",
      label: "Education, Jobs & Commerce",
      icon: cd,
      tiles: [
        {
          id: "edu",
          label: "Education City",
          sub: "Schools, colleges, universities, institutes",
          icon: t0,
          go: () => Vh(),
        },
        {
          id: "events",
          label: "Conference halls & events",
          sub: "Book a hall, sell tickets with escrow",
          icon: rn,
          go: () => En(),
        },
        {
          id: "bazaar",
          label: "Fyrus Market",
          sub: "Buy, sell and bid with escrow protection",
          icon: yr,
          go: () => ad(),
        },
        {
          id: "shops",
          label: "Shop street",
          sub: "Every shop on the market street",
          icon: jo,
          go: () => It("shops"),
        },
        {
          id: "openshop",
          label: "Open a shop",
          sub: "Sell skills, courses or products",
          icon: Na,
          go: () => It("openshop"),
        },
        { id: "agents", label: "AI agents", sub: "Try and buy agents", icon: Nr, go: () => It("market") },
        { id: "gigs", label: "Gigs", sub: "Hire skill sellers", icon: hg, go: () => It("gigs") },
        {
          id: "shifts",
          label: "Shift jobs",
          sub: "Nurse, police, fire crew, cook\u2026 paid in FYC",
          icon: hr,
          go: () => ed("jobs"),
        },
        { id: "jobs", label: "Jobs", sub: "Post jobs, send proposals", icon: hr, go: () => It("jobs") },
        {
          id: "people",
          label: "AI People",
          sub: "1,200 AI residents to meet",
          icon: A8,
          go: () => It("people"),
        },
        {
          id: "aff",
          label: "Affiliate",
          sub: "Share links, earn commission",
          icon: xg,
          go: () => It("affiliate"),
        },
      ],
    },
    {
      id: "republic",
      label: "Republic & Bank",
      icon: Or,
      tiles: [
        {
          id: "passport",
          label: "Visa & Passport",
          sub: "Your status in Fyrus",
          icon: i0,
          go: () => Fl("passport"),
        },
        {
          id: "parl",
          label: "Elections & parties",
          sub: "Vote for Mayor and Parliament, found a party",
          icon: Xi,
          go: () => ai(),
        },
        {
          id: "proposals",
          label: "Citizens' proposals",
          sub: "Yes/no questions for the whole country",
          icon: Xi,
          go: () => ai("proposals"),
        },
        { id: "bank", label: "Central Bank", sub: "FYC and the treasury", icon: pE, go: () => Fl("bank") },
        {
          id: "court",
          label: "Law & Court",
          sub: "Constitution and disputes",
          icon: Ei,
          go: () => Fl("law"),
        },
        { id: "news", label: "Fyrus News TV", sub: "24/7 national + world news", icon: ou, go: () => Gh() },
        {
          id: "ads",
          label: "Billboards",
          sub: "12 paid billboards \xB7 revenue to the treasury",
          icon: n0,
          go: () => It("ads"),
        },
        {
          id: "wallet",
          label: "Bank & FyrusPay",
          sub: "Balance, statement, send to a number",
          icon: ru,
          go: () => It("wallet"),
        },
      ],
    },
  ];
function $y() {
  let t = Y(),
    e = L9.find((o) => o.id === t.dockHub),
    [a, r] = (0, lf.useState)(null);
  return (
    (0, lf.useEffect)(() => {
      let o = (n) => {
        n.key === "Escape" && ot().dockHub && sf();
      };
      return (window.addEventListener("keydown", o), () => window.removeEventListener("keydown", o));
    }, []),
    (0, Ar.jsxs)("div", {
      className: "flex flex-col items-center gap-2",
      children: [
        e &&
          (0, Ar.jsxs)("div", {
            className: "hud-box p-3 w-[min(94vw,560px)] pop-in",
            role: "dialog",
            "aria-label": e.label,
            children: [
              (0, Ar.jsxs)("div", {
                className: "flex items-center mb-2",
                children: [
                  (0, Ar.jsx)("b", { className: "text-white text-sm flex-1", children: e.label }),
                  (0, Ar.jsx)("button", {
                    className: "text-white/70",
                    onClick: sf,
                    "aria-label": "Close",
                    children: (0, Ar.jsx)(pe, {}),
                  }),
                ],
              }),
              (0, Ar.jsx)("div", {
                className: "grid grid-cols-2 sm:grid-cols-3 gap-1.5",
                children: e.tiles.map((o) => {
                  let n = o.icon;
                  return (0, Ar.jsxs)(
                    "button",
                    {
                      "data-tile": o.id,
                      className:
                        "rounded-lg px-2.5 py-2 text-left text-white card-hover flex items-start gap-2",
                      style: {
                        border: "1px solid rgba(255,255,255,.14)",
                        background: "rgba(255,255,255,.04)",
                        opacity: o.soon ? 0.7 : 1,
                      },
                      onClick: () => {
                        (sf(), o.go());
                      },
                      children: [
                        (0, Ar.jsx)(n, { className: "mt-0.5 shrink-0 text-[var(--accent)]" }),
                        (0, Ar.jsxs)("span", {
                          className: "min-w-0",
                          children: [
                            (0, Ar.jsxs)("span", {
                              className: "block text-[13px] font-bold leading-tight",
                              children: [
                                o.label,
                                o.soon &&
                                  (0, Ar.jsx)("span", {
                                    className: "ml-1 text-[9px] font-semibold px-1 rounded bg-white/15",
                                    children: "SOON",
                                  }),
                              ],
                            }),
                            (0, Ar.jsx)("span", {
                              className: "block text-[11px] text-white/60 leading-snug",
                              children: o.sub,
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
        (0, Ar.jsx)("nav", {
          className: "hud-box p-1 flex gap-0.5",
          "aria-label": "Dock",
          children: [
            ...L9.map((o) => ({ id: o.id, label: o.label, icon: o.icon })),
            { id: "phone", label: "Fyrus Phone", icon: I8 },
          ].map((o) => {
            let n = o.icon,
              i = o.id === "phone" ? t.phoneOpen : t.dockHub === o.id;
            return (0, Ar.jsxs)(
              "button",
              {
                "aria-label": o.label,
                "aria-pressed": i,
                title: o.label,
                onMouseEnter: () => r(o.id),
                onMouseLeave: () => r(null),
                onClick: () => {
                  o.id === "phone"
                    ? (sf(), C({ phoneOpen: !ot().phoneOpen }))
                    : C({ dockHub: i ? null : o.id });
                },
                className:
                  "relative w-14 h-12 sm:w-16 rounded-lg grid place-items-center text-white/85 hover:bg-white/10 transition",
                style: i
                  ? {
                      background: "color-mix(in srgb, var(--accent) 38%, transparent)",
                      color: "#fff",
                      boxShadow: "0 0 18px color-mix(in srgb, var(--accent) 45%, transparent)",
                    }
                  : {},
                children: [
                  (0, Ar.jsx)(n, { className: "text-[20px]" }),
                  (0, Ar.jsx)("span", {
                    className: "text-[9px] font-semibold leading-none mt-0.5 hidden sm:block",
                    children:
                      o.id === "cities"
                        ? "Cities"
                        : o.id === "luxury"
                          ? "Luxury"
                          : o.id === "work"
                            ? "Learn & Work"
                            : o.id === "republic"
                              ? "Republic"
                              : "Phone",
                  }),
                  a === o.id &&
                    (0, Ar.jsx)("span", {
                      className:
                        "absolute -top-7 whitespace-nowrap text-[11px] px-2 py-0.5 rounded bg-black/80 text-white pointer-events-none",
                      children: o.label,
                    }),
                ],
              },
              o.id,
            );
          }),
        }),
      ],
    })
  );
}
var gr = P(Zt(), 1);
var I = P(ct(), 1),
  Ne = { color: "var(--ink-dim)" },
  cf = [
    {
      id: "skill",
      label: "Skills",
      one: "Skill / service",
      desc: "AI development, design, editing, consulting \u2014 milestone delivered by the seller.",
    },
    {
      id: "course",
      label: "Courses",
      one: "Course",
      desc: "Recorded courses, cohorts and study kits \u2014 unlocked instantly after payment.",
    },
    {
      id: "digital",
      label: "Digital",
      one: "Digital product",
      desc: "AI agents, tools, prompts, 3D assets, templates \u2014 unlocked instantly after payment.",
    },
    {
      id: "physical",
      label: "Physical",
      one: "Physical product",
      desc: "Clothes, sneakers, electronics, watches \u2014 shipped to the buyer with tracking.",
    },
    {
      id: "brand",
      label: "Brands",
      one: "Brand flagship",
      desc: "A brand store with stock and drops. Needs a 2,000 FYC bond.",
    },
  ],
  EB = [
    "\u25C6",
    "\u2605",
    "\u26A1",
    "\u{1F916}",
    "\u{1F3A8}",
    "\u{1F3AC}",
    "\u{1F4DA}",
    "\u{1F9E0}",
    "\u{1F45F}",
    "\u231A",
    "\u{1F3A7}",
    "\u{1F4F1}",
    "\u{1F455}",
    "\u{1F48E}",
    "\u{1F9F4}",
    "\u{1F3F7}\uFE0F",
  ],
  C9 = {
    paid: ["Paid \xB7 in escrow", "#ffc27a"],
    delivered: ["Delivered \xB7 inspection", "#7fd1ff"],
    disputed: ["Disputed \xB7 frozen", "#ff7a8a"],
    review: ["In court review", "#ff7a8a"],
    released: ["Completed", "#45e0ae"],
    refunded: ["Refunded", "#b9c0cc"],
  },
  Tu = (t) => {
    if (!t) return "";
    let e = t - Date.now();
    if (e <= 0) return "ending\u2026";
    let a = Math.floor(e / 36e5),
      r = Math.floor((e % 36e5) / 6e4),
      o = Math.floor((e % 6e4) / 1e3);
    return a >= 24 ? `${Math.floor(a / 24)}d ${a % 24}h` : a ? `${a}h ${r}m` : `${r}m ${o}s`;
  },
  T9 = ({ t }) =>
    t
      ? (0, I.jsxs)("span", {
          className: "text-[10px] px-1.5 py-0.5 rounded inline-flex items-center gap-0.5",
          style: {
            background: t.tier === "Warned" ? "rgba(255,122,138,.18)" : "rgba(69,224,174,.15)",
            color: t.tier === "Warned" ? "#ff7a8a" : "#45e0ae",
          },
          children: [
            (0, I.jsx)(Jl, {}),
            t.tier,
            " \xB7 ",
            t.sales,
            " sales",
            t.bond ? ` \xB7 bond ${t.bond.toLocaleString("en-US")}` : "",
          ],
        })
      : null;
function _y() {
  let t = Y(),
    e = t.net.status === "online",
    [a, r] = (0, gr.useState)("browse"),
    [o, n] = (0, gr.useState)(null),
    [, i] = (0, gr.useState)(0);
  if (
    ((0, gr.useEffect)(() => {
      e && (O.send({ t: "mk_list" }), O.send({ t: "mk_mine" }));
    }, [e]),
    (0, gr.useEffect)(() => {
      let c = setInterval(() => i((d) => d + 1), 1e3);
      return () => clearInterval(c);
    }, []),
    (0, gr.useEffect)(() => {
      t.mkFocus &&
        (t.mkFocus.tab && r(t.mkFocus.tab), t.mkFocus.listing && n(t.mkFocus.listing), C({ mkFocus: null }));
    }, [t.mkFocus]),
    !e)
  )
    return (0, I.jsxs)("div", {
      className: "card p-4 text-sm",
      children: [
        (0, I.jsx)("b", { children: "Fyrus Market runs on the live city at fyrus.io." }),
        (0, I.jsx)("div", {
          className: "mt-1",
          style: Ne,
          children:
            "Every payment is held by the Central Bank server until delivery, so it only works when you are connected. Connecting\u2026",
        }),
      ],
    });
  let s = t.mkMine,
    l = s?.court?.length || 0;
  return (0, I.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, I.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, I.jsx)("div", {
            className: "text-[10px] font-bold tracking-[.25em]",
            style: { color: "var(--ember-hi)" },
            children: "FYRUS MARKET \xB7 ZERO-SCAM ESCROW",
          }),
          (0, I.jsx)("div", {
            className: "text-sm font-bold mt-0.5",
            children: "Skills, courses, digital and physical products and brand stores \u2014 buy now or bid",
          }),
          (0, I.jsx)("div", {
            className: "flex gap-3 flex-wrap mt-1.5 text-[11px]",
            style: Ne,
            children: [
              "Money waits in Central Bank escrow",
              "Sellers post a bond for big items",
              "Sentinel screens every listing",
              "Inspection window + 1-click dispute",
              "Proven scammers are banned",
            ].map((c, d) =>
              (0, I.jsxs)(
                "span",
                {
                  className: "flex items-center gap-1",
                  children: [(0, I.jsx)(yr, { style: { color: "#45e0ae" } }), d + 1, ". ", c],
                },
                c,
              ),
            ),
          }),
          t.bank &&
            (0, I.jsxs)("div", {
              className: "text-[12px] mt-1.5",
              children: [
                "Bank balance ",
                (0, I.jsx)("b", { children: q(t.bank.bal) }),
                t.bank.held ? ` \xB7 ${q(t.bank.held)} held in bids` : "",
                t.bank.bond ? ` \xB7 bond ${q(t.bank.bond)}` : "",
                t.bank.banned
                  ? (0, I.jsx)("b", { style: { color: "var(--rose)" }, children: " \xB7 account banned" })
                  : "",
              ],
            }),
        ],
      }),
      !o &&
        (0, I.jsx)("div", {
          className: "flex gap-1 flex-wrap",
          children: [
            ["browse", "Browse", ko],
            ["sell", "Sell", jo],
            ["orders", `My orders${s?.bought.length ? ` (${s.bought.length})` : ""}`, Z8],
            ["sales", `My sales${s?.sold.length ? ` (${s.sold.length})` : ""}`, Xh],
            ...(s?.admin ? [["court", `Court${l ? ` (${l})` : ""}`, Ei]] : []),
          ].map(([c, d, h]) =>
            (0, I.jsxs)(
              "button",
              {
                "data-mk-tab": c,
                className: `chip ${a === c ? "chip-on" : ""}`,
                onClick: () => r(c),
                children: [(0, I.jsx)(h, {}), " ", d],
              },
              c,
            ),
          ),
        }),
      o
        ? (0, I.jsx)(CB, { id: o, back: () => n(null) })
        : (0, I.jsxs)(I.Fragment, {
            children: [
              a === "browse" && (0, I.jsx)(LB, { open: n }),
              a === "sell" && (0, I.jsx)(TB, {}),
              a === "orders" && (0, I.jsx)(SB, {}),
              a === "sales" && (0, I.jsx)(HB, {}),
              a === "court" && (0, I.jsx)(NB, {}),
            ],
          }),
    ],
  });
}
function LB({ open: t }) {
  let e = Y(),
    [a, r] = (0, gr.useState)("all"),
    [o, n] = (0, gr.useState)("all"),
    [i, s] = (0, gr.useState)("");
  if (!e.mk)
    return (0, I.jsx)("div", { className: "text-sm", style: Ne, children: "Loading the market\u2026" });
  let l = e.mk.listings.filter(
    (c) =>
      (a === "all" || c.type === a) &&
      (o === "all" || c.mode === o) &&
      `${c.title} ${c.desc} ${c.sellerName}`.toLowerCase().includes(i.toLowerCase()),
  );
  return (0, I.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, I.jsxs)("div", {
        className: "flex gap-1 flex-wrap",
        children: [
          [["all", "All"], ...cf.map((c) => [c.id, c.label])].map(([c, d]) =>
            (0, I.jsx)(
              "button",
              { className: `chip ${a === c ? "chip-on" : ""}`, onClick: () => r(c), children: d },
              c,
            ),
          ),
          (0, I.jsx)("span", { className: "mx-1" }),
          [
            ["all", "Any"],
            ["fixed", "Buy now"],
            ["auction", "Auctions"],
          ].map(([c, d]) =>
            (0, I.jsx)(
              "button",
              { className: `chip ${o === c ? "chip-on" : ""}`, onClick: () => n(c), children: d },
              c,
            ),
          ),
        ],
      }),
      (0, I.jsx)("input", {
        className: "field py-1.5 text-sm",
        value: i,
        onChange: (c) => s(c.target.value),
        placeholder: "Search the market",
        "aria-label": "Search the market",
      }),
      (0, I.jsx)("div", {
        className: "grid sm:grid-cols-2 gap-1.5",
        children: l.map((c) =>
          (0, I.jsxs)(
            "button",
            {
              "data-listing": c.id,
              className: "text-left rounded-lg p-2.5 flex gap-2.5 card-hover",
              style: { border: "1px solid var(--line)" },
              onClick: () => t(c.id),
              children: [
                (0, I.jsx)("span", {
                  className: "w-12 h-12 rounded-lg grid place-items-center text-xl shrink-0 text-white",
                  style: { background: c.color },
                  children: c.icon,
                }),
                (0, I.jsxs)("span", {
                  className: "min-w-0 flex-1",
                  children: [
                    (0, I.jsx)("span", { className: "block text-sm font-bold truncate", children: c.title }),
                    (0, I.jsxs)("span", {
                      className: "block text-[11px] truncate",
                      style: Ne,
                      children: [cf.find((d) => d.id === c.type)?.one, " \xB7 ", c.sellerName],
                    }),
                    (0, I.jsxs)("span", {
                      className: "flex items-center gap-1.5 mt-1",
                      children: [
                        (0, I.jsx)("b", {
                          className: "text-[13px]",
                          style: { color: "var(--ember-hi)" },
                          children: c.mode === "auction" ? q(c.topBid || c.price) : q(c.price),
                        }),
                        c.mode === "auction" &&
                          (0, I.jsxs)("span", {
                            className: "text-[10px] flex items-center gap-0.5",
                            style: Ne,
                            children: [
                              (0, I.jsx)(Zl, {}),
                              " ",
                              c.bids.length,
                              " bids \xB7 ",
                              (0, I.jsx)(li, {}),
                              " ",
                              Tu(c.endsAt),
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            c.id,
          ),
        ),
      }),
      l.length === 0 &&
        (0, I.jsx)("div", {
          className: "text-[12px]",
          style: Ne,
          children: "Nothing here yet. Be the first to sell from the Sell tab.",
        }),
    ],
  });
}
