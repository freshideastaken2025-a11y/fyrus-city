function dc({ on: t, onChange: e, label: a }) {
  return (0, tt.jsx)("button", {
    role: "switch",
    "aria-checked": t,
    "aria-label": a,
    onClick: () => e(!t),
    className: "w-11 h-6 rounded-full relative transition-colors",
    style: { background: t ? "var(--accent)" : "rgba(255,255,255,.18)" },
    children: (0, tt.jsx)("span", {
      className: "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all",
      style: { left: t ? 22 : 2 },
    }),
  });
}
function Xs({ value: t, list: e, onChange: a, label: r }) {
  return (0, tt.jsx)("div", {
    className: "flex gap-1.5 flex-wrap justify-end",
    role: "radiogroup",
    "aria-label": r,
    children: e.map((o) =>
      (0, tt.jsx)(
        "button",
        {
          role: "radio",
          "aria-checked": t === o,
          "aria-label": o,
          onClick: () => a(o),
          className: "w-6 h-6 rounded-full",
          style: {
            background: o,
            boxShadow:
              t === o
                ? "0 0 0 2px #121418, 0 0 0 4px var(--accent)"
                : "inset 0 0 0 1px rgba(255,255,255,.25)",
          },
        },
        o,
      ),
    ),
  });
}
var YR = ["Profile", "Avatar", "HUD", "World", "Graphics & audio", "Privacy", "Account"];
function ky() {
  let t = Y(),
    e = t.settings,
    a = t.users.find((g) => g.id === t.session?.userId),
    r = { ...Vv, ...(a.avatar?.outfit || {}) },
    [o, n] = (0, wd.useState)(ot().avatarSection ? "Avatar" : "Profile"),
    [i, s] = (0, wd.useState)(a.name),
    [l, c] = (0, wd.useState)(a.title),
    [d, h] = (0, wd.useState)(a.bio),
    [u, p] = (0, wd.useState)(a.skills.join(", ")),
    v = (g) => Up(g);
  return (0, tt.jsxs)("div", {
    className: "space-y-4",
    children: [
      (0, tt.jsx)("div", {
        className: "flex gap-1 flex-wrap",
        children: YR.map((g) =>
          (0, tt.jsx)(
            "button",
            { className: `chip ${o === g ? "chip-on" : ""}`, onClick: () => n(g), children: g },
            g,
          ),
        ),
      }),
      o === "Profile" &&
        (0, tt.jsxs)("div", {
          className: "card p-4 space-y-3",
          children: [
            (0, tt.jsxs)("div", {
              children: [
                (0, tt.jsx)("label", { className: "label", htmlFor: "pf-name", children: "Display name" }),
                (0, tt.jsx)("input", {
                  id: "pf-name",
                  className: "field",
                  value: i,
                  onChange: (g) => s(g.target.value),
                  maxLength: 32,
                }),
              ],
            }),
            (0, tt.jsxs)("div", {
              children: [
                (0, tt.jsx)("label", { className: "label", htmlFor: "pf-title", children: "Title" }),
                (0, tt.jsx)("input", {
                  id: "pf-title",
                  className: "field",
                  value: l,
                  onChange: (g) => c(g.target.value),
                  maxLength: 48,
                  placeholder: "AI agent builder",
                }),
              ],
            }),
            (0, tt.jsxs)("div", {
              children: [
                (0, tt.jsx)("label", { className: "label", htmlFor: "pf-bio", children: "Bio" }),
                (0, tt.jsx)("textarea", {
                  id: "pf-bio",
                  className: "field",
                  value: d,
                  onChange: (g) => h(g.target.value),
                  maxLength: 240,
                }),
              ],
            }),
            (0, tt.jsxs)("div", {
              children: [
                (0, tt.jsx)("label", {
                  className: "label",
                  htmlFor: "pf-skills",
                  children: "Skills (comma separated)",
                }),
                (0, tt.jsx)("input", {
                  id: "pf-skills",
                  className: "field",
                  value: u,
                  onChange: (g) => p(g.target.value),
                }),
              ],
            }),
            (0, tt.jsxs)("div", {
              children: [
                (0, tt.jsx)("label", {
                  className: "label",
                  htmlFor: "pf-email",
                  children: "Email for receipts",
                }),
                (0, tt.jsx)("input", {
                  id: "pf-email",
                  type: "email",
                  className: "field",
                  value: e.email,
                  onChange: (g) => v({ email: g.target.value }),
                  placeholder: "you@example.com",
                }),
              ],
            }),
            (0, tt.jsx)(Ke, {
              label: "Name tag colour",
              children: (0, tt.jsx)(Xs, {
                label: "Name colour",
                value: a.color,
                list: J7,
                onChange: (g) => Ov({ color: g }),
              }),
            }),
            (0, tt.jsx)("button", {
              className: "btn btn-primary w-full",
              disabled: !i.trim(),
              onClick: () => {
                (Ov({
                  name: i.trim(),
                  title: l.trim() || "AI Creator",
                  bio: d.trim(),
                  skills: u
                    .split(",")
                    .map((g) => g.trim())
                    .filter(Boolean)
                    .slice(0, 8),
                }),
                  C((g) => ({
                    toasts: [...g.toasts, { id: "pf" + Date.now(), text: "Profile saved", tone: "ok" }],
                  })));
              },
              children: "Save profile",
            }),
          ],
        }),
      o === "Avatar" &&
        (0, tt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, tt.jsxs)("div", {
              className: "flex items-center gap-3 pb-3",
              style: { borderBottom: "1px solid var(--line)" },
              children: [
                t.photo
                  ? (0, tt.jsx)("img", {
                      src: t.photo,
                      alt: "Your photo",
                      className: "w-14 h-14 rounded-full object-cover",
                    })
                  : (0, tt.jsx)("div", {
                      className: "w-14 h-14 rounded-full grid place-items-center text-xs",
                      style: { background: "rgba(255,255,255,.08)" },
                      children: "No photo",
                    }),
                (0, tt.jsxs)("div", {
                  className: "flex-1",
                  children: [
                    (0, tt.jsx)("div", {
                      className: "text-sm font-bold",
                      children: "Walk with your real face",
                    }),
                    (0, tt.jsx)("div", {
                      className: "text-[11px]",
                      style: { color: "var(--ink-dim)" },
                      children: "Your photo shows on your character's face. Other players see it too.",
                    }),
                  ],
                }),
                (0, tt.jsxs)("label", {
                  className: "btn btn-primary btn-sm cursor-pointer",
                  children: [
                    t.photo ? "Change" : "Add photo",
                    (0, tt.jsx)("input", {
                      type: "file",
                      accept: "image/*",
                      capture: "user",
                      className: "hidden",
                      onChange: (g) => {
                        let m = g.target.files?.[0];
                        m && UR(m);
                      },
                    }),
                  ],
                }),
                t.photo &&
                  (0, tt.jsx)("button", {
                    className: "btn btn-ghost btn-sm",
                    onClick: () => Dv(null),
                    children: "Remove",
                  }),
              ],
            }),
            (0, tt.jsx)(KR, { o: r, photo: t.photo }),
            (0, tt.jsx)("div", {
              className: "text-[11px] mt-2",
              style: { color: "var(--ink-dim)" },
              children:
                "Changes show on your character right away. Accessories and hoverboards are in Style.",
            }),
          ],
        }),
      o === "HUD" &&
        (0, tt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, tt.jsx)(Ke, {
              label: "HUD colour",
              hint: "Buttons, highlights, map marker",
              children: (0, tt.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, tt.jsx)(Xs, {
                    label: "HUD colour",
                    value: e.accent,
                    list: J7,
                    onChange: (g) => v({ accent: g }),
                  }),
                  (0, tt.jsx)("input", {
                    type: "color",
                    "aria-label": "Custom HUD colour",
                    value: e.accent,
                    onChange: (g) => v({ accent: g.target.value }),
                    className: "w-7 h-7 rounded bg-transparent",
                  }),
                ],
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "HUD size",
              children: (0, tt.jsx)(Bn, {
                value: String(e.hudScale),
                options: ["0.9", "1", "1.15"],
                labels: { "0.9": "Small", 1: "Normal", "1.15": "Large" },
                onChange: (g) => v({ hudScale: Number(g) }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Minimap",
              children: (0, tt.jsx)(dc, {
                label: "Minimap",
                on: e.minimap,
                onChange: (g) => v({ minimap: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Compass",
              children: (0, tt.jsx)(dc, {
                label: "Compass",
                on: e.compass,
                onChange: (g) => v({ compass: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Name tags",
              hint: "Names above nearby people",
              children: (0, tt.jsx)(dc, {
                label: "Name tags",
                on: e.nameTags,
                onChange: (g) => v({ nameTags: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Welcome intro on start",
              children: (0, tt.jsx)(dc, { label: "Intro", on: e.intro, onChange: (g) => v({ intro: g }) }),
            }),
          ],
        }),
      o === "World" &&
        (0, tt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, tt.jsx)(Ke, {
              label: "Time of day",
              hint: "Auto follows your real clock",
              children: (0, tt.jsx)(Bn, {
                value: e.time,
                options: ["auto", "dawn", "day", "sunset", "night"],
                onChange: (g) => v({ time: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Weather",
              children: (0, tt.jsx)(Bn, {
                value: e.weather,
                options: ["clear", "cloudy", "rain", "snow", "heat"],
                onChange: (g) => v({ weather: g }),
                labels: { heat: "Heatwave" },
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Season",
              hint: "Trees and grass change colour",
              children: (0, tt.jsx)(Bn, {
                value: e.season,
                options: ["spring", "summer", "autumn", "winter"],
                onChange: (g) => v({ season: g }),
              }),
            }),
            (0, tt.jsx)("div", {
              className: "grid grid-cols-2 gap-2 mt-3",
              children: [
                ["Rainy night", { time: "night", weather: "rain", season: "autumn" }],
                ["Winter morning", { time: "dawn", weather: "snow", season: "winter" }],
                ["Summer heat", { time: "day", weather: "heat", season: "summer" }],
                ["Golden hour", { time: "sunset", weather: "clear", season: "spring" }],
              ].map(([g, m]) =>
                (0, tt.jsx)(
                  "button",
                  {
                    className: "card card-hover p-3 text-left text-sm font-bold",
                    onClick: () => v(m),
                    children: g,
                  },
                  g,
                ),
              ),
            }),
          ],
        }),
      o === "Graphics & audio" &&
        (0, tt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, tt.jsx)(Ke, {
              label: "Graphics quality",
              hint: "Low = Lite mode: no shadows, fewer city blocks \u2014 best for phones",
              children: (0, tt.jsx)(Bn, {
                value: e.quality,
                options: ["low", "medium", "high"],
                onChange: (g) => v({ quality: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Live stage audio",
              hint: "Spatial sound from live shows",
              children: (0, tt.jsx)(dc, {
                label: "Live audio",
                on: t.audioOn,
                onChange: (g) => C({ audioOn: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Club music",
              children: (0, tt.jsx)(dc, {
                label: "Club music",
                on: e.music,
                onChange: (g) => v({ music: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Volume",
              children: (0, tt.jsx)("input", {
                type: "range",
                min: 0,
                max: 1,
                step: 0.05,
                value: e.volume,
                onChange: (g) => v({ volume: Number(g.target.value) }),
                "aria-label": "Volume",
              }),
            }),
          ],
        }),
      o === "Privacy" &&
        (0, tt.jsxs)("div", {
          className: "card p-4",
          children: [
            (0, tt.jsx)(Ke, {
              label: "Show me to other players",
              hint: "Others see your character walking",
              children: (0, tt.jsx)(dc, {
                label: "Show online",
                on: e.showOnline,
                onChange: (g) => v({ showOnline: g }),
              }),
            }),
            (0, tt.jsx)(Ke, {
              label: "Chat bubbles from strangers",
              children: (0, tt.jsx)(dc, {
                label: "Stranger chat",
                on: e.strangersChat,
                onChange: (g) => v({ strangersChat: g }),
              }),
            }),
          ],
        }),
      o === "Account" &&
        (0, tt.jsxs)("div", {
          className: "card p-4 space-y-2",
          children: [
            (0, tt.jsx)(xy, {}),
            (0, tt.jsx)(Ke, {
              label: "Signed in as",
              hint: a.handle,
              children: (0, tt.jsx)("span", { className: "chip", children: t.role }),
            }),
            (0, tt.jsx)("button", {
              className: "btn btn-ghost w-full",
              onClick: () => C({ intro: !0, hud: { ...t.hud, open: !1 } }),
              children: "Replay welcome tour",
            }),
            (0, tt.jsx)("button", { className: "btn btn-ghost w-full", onClick: zp, children: "Log out" }),
            (0, tt.jsx)("button", {
              className: "btn btn-ghost w-full",
              style: { color: "var(--rose)" },
              onClick: () => {
                confirm(
                  "Reset all data saved in this browser? Your live-city account stays on the server.",
                ) && p8();
              },
              children: "Reset this browser's data",
            }),
          ],
        }),
    ],
  });
}
var qR = [
    "short",
    "buzz",
    "side",
    "curly",
    "mohawk",
    "afro",
    "long",
    "ponytail",
    "bun",
    "braids",
    "hijab",
    "cap",
    "bald",
  ],
  hc = {
    m: "Male",
    f: "Female",
    tee: "T-shirt",
    hoodie: "Hoodie",
    jacket: "Jacket",
    shirt: "Shirt",
    kurta: "Kurta",
    dress: "Dress",
    suit: "Suit",
    tank: "Tank top",
    jeans: "Jeans",
    trousers: "Trousers",
    shorts: "Shorts",
    skirt: "Skirt",
    shalwar: "Shalwar",
    none: "None",
    stubble: "Stubble",
    short: "Short",
    full: "Full",
    moustache: "Moustache",
    round: "Round",
    square: "Square",
    shades: "Sunglasses",
    oval: "Oval",
    long: "Long",
    thin: "Thin",
    normal: "Normal",
    thick: "Thick",
    "0.94": "Short",
    1: "Average",
    "1.06": "Tall",
  },
  ZR = [
    {
      name: "Casual",
      o: {
        topStyle: "tee",
        bottomStyle: "jeans",
        top: "#2f6fe0",
        bottom: "#2b303a",
        shoes: "#f2f2f2",
        glasses: "none",
      },
    },
    {
      name: "Business",
      o: { topStyle: "suit", bottomStyle: "trousers", top: "#1f1f1f", bottom: "#1f1f1f", shoes: "#1f1f1f" },
    },
    {
      name: "Desi",
      o: { topStyle: "kurta", bottomStyle: "shalwar", top: "#f2efe8", bottom: "#f2efe8", shoes: "#8a5a3c" },
    },
    {
      name: "Street",
      o: {
        topStyle: "hoodie",
        bottomStyle: "jeans",
        top: "#566573",
        bottom: "#1f1f1f",
        shoes: "#c0392b",
        hair: "cap",
      },
    },
    {
      name: "Sporty",
      o: { topStyle: "tank", bottomStyle: "shorts", top: "#f4c20d", bottom: "#1f1f1f", shoes: "#2f6fe0" },
    },
    {
      name: "Party",
      o: { topStyle: "dress", bottomStyle: "skirt", top: "#7a2a3a", shoes: "#1f1f1f", gender: "f" },
    },
  ];
function KR({ o: t, photo: e }) {
  let a = Vg(t),
    [r, o] = (0, wd.useState)(() => {
      let s = ot().avatarSection;
      return (s && setTimeout(() => C({ avatarSection: null }), 0), s || "body");
    }),
    n = (s) => s[Math.floor(Math.random() * s.length)];
  return (0, tt.jsx)("div", {
    className: "pt-3",
    "data-avatar-editor": !0,
    children: (0, tt.jsxs)("div", {
      className: "grid sm:grid-cols-[220px_1fr] gap-3",
      children: [
        (0, tt.jsxs)("div", {
          children: [
            (0, tt.jsx)(yy, { outfit: t, photo: e, height: 300 }),
            (0, tt.jsx)("div", {
              className: "flex gap-1.5 mt-2",
              children: (0, tt.jsx)("button", {
                id: "av-random",
                className: "btn btn-ghost btn-sm flex-1",
                onClick: () => {
                  let s = n(["m", "f"]);
                  Qa({
                    gender: s,
                    skin: n(la),
                    hair: n(
                      s === "f"
                        ? ["long", "ponytail", "bun", "braids", "hijab", "curly"]
                        : ["short", "buzz", "side", "curly", "mohawk", "afro"],
                    ),
                    hairColor: n(e9),
                    topStyle: n(["tee", "hoodie", "jacket", "shirt", "kurta"]),
                    bottomStyle: n(["jeans", "trousers", "shorts"]),
                    top: n(Q7),
                    bottom: n(t9),
                    shoes: n(r9),
                    beard: s === "m" ? n(["none", "stubble", "short", "full", "moustache"]) : "none",
                    glasses: n(["none", "none", "round", "square", "shades"]),
                    eyes: n(a9),
                    face: n(["oval", "round", "long", "square"]),
                  });
                },
                children: "\u{1F3B2} Surprise me",
              }),
            }),
          ],
        }),
        (0, tt.jsxs)("div", {
          children: [
            (0, tt.jsx)("div", {
              className: "flex gap-1 flex-wrap mb-2",
              children: ZR.map((s) =>
                (0, tt.jsx)(
                  "button",
                  { "data-preset": s.name, className: "chip", onClick: () => Qa(s.o), children: s.name },
                  s.name,
                ),
              ),
            }),
            (0, tt.jsx)("div", {
              className: "flex gap-1 mb-1",
              children: ["body", "face", "hair", "clothes"].map((s) =>
                (0, tt.jsx)(
                  "button",
                  {
                    "data-av-sec": s,
                    className: `chip ${r === s ? "chip-on" : ""}`,
                    onClick: () => o(s),
                    children: s[0].toUpperCase() + s.slice(1),
                  },
                  s,
                ),
              ),
            }),
            r === "body" &&
              (0, tt.jsxs)(tt.Fragment, {
                children: [
                  (0, tt.jsx)(Ke, {
                    label: "Gender",
                    children: (0, tt.jsx)(Bn, {
                      value: a.gender,
                      options: ["m", "f"],
                      labels: hc,
                      onChange: (s) =>
                        Qa({ gender: s, ...(s === "f" && a.beard !== "none" ? { beard: "none" } : {}) }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Height",
                    children: (0, tt.jsx)(Bn, {
                      value: String(a.height),
                      options: ["0.94", "1", "1.06"],
                      labels: hc,
                      onChange: (s) => Qa({ height: Number(s) }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Skin tone",
                    children: (0, tt.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0, tt.jsx)(Xs, {
                          label: "Skin",
                          value: a.skin,
                          list: la,
                          onChange: (s) => Qa({ skin: s }),
                        }),
                        (0, tt.jsx)("input", {
                          type: "color",
                          "aria-label": "Custom skin tone",
                          value: a.skin,
                          onChange: (s) => Qa({ skin: s.target.value }),
                          className: "w-7 h-7 rounded bg-transparent",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            r === "face" &&
              (0, tt.jsxs)(tt.Fragment, {
                children: [
                  (0, tt.jsx)(Ke, {
                    label: "Face shape",
                    children: (0, tt.jsx)(Bn, {
                      value: a.face,
                      options: ["oval", "round", "long", "square"],
                      labels: hc,
                      onChange: (s) => Qa({ face: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Eye colour",
                    children: (0, tt.jsx)(Xs, {
                      label: "Eyes",
                      value: a.eyes,
                      list: a9,
                      onChange: (s) => Qa({ eyes: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Eyebrows",
                    children: (0, tt.jsx)(Bn, {
                      value: a.brows,
                      options: ["thin", "normal", "thick"],
                      labels: hc,
                      onChange: (s) => Qa({ brows: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Beard",
                    children: (0, tt.jsx)(Bn, {
                      value: a.beard,
                      options: ["none", "stubble", "moustache", "short", "full"],
                      labels: hc,
                      onChange: (s) => Qa({ beard: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Glasses",
                    children: (0, tt.jsx)(Bn, {
                      value: a.glasses,
                      options: ["none", "round", "square", "shades"],
                      labels: hc,
                      onChange: (s) => Qa({ glasses: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Lips",
                    children: (0, tt.jsx)(Xs, {
                      label: "Lips",
                      value: a.lips,
                      list: _R,
                      onChange: (s) => Qa({ lips: s }),
                    }),
                  }),
                ],
              }),
            r === "hair" &&
              (0, tt.jsxs)(tt.Fragment, {
                children: [
                  (0, tt.jsx)("div", {
                    className: "flex flex-wrap gap-1 py-2",
                    role: "radiogroup",
                    "aria-label": "Hair style",
                    children: qR.map((s) =>
                      (0, tt.jsx)(
                        "button",
                        {
                          "data-hair": s,
                          className: `chip ${a.hair === s ? "chip-on" : ""}`,
                          "aria-pressed": a.hair === s,
                          onClick: () => Qa({ hair: s }),
                          children:
                            s === "hijab" ? "Hijab" : s === "cap" ? "Cap" : s[0].toUpperCase() + s.slice(1),
                        },
                        s,
                      ),
                    ),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: a.hair === "hijab" ? "Hijab colour" : "Hair colour",
                    children: (0, tt.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0, tt.jsx)(Xs, {
                          label: "Hair colour",
                          value: a.hairColor,
                          list: a.hair === "hijab" ? $R : e9,
                          onChange: (s) => Qa({ hairColor: s }),
                        }),
                        (0, tt.jsx)("input", {
                          type: "color",
                          "aria-label": "Custom hair colour",
                          value: a.hairColor,
                          onChange: (s) => Qa({ hairColor: s.target.value }),
                          className: "w-7 h-7 rounded bg-transparent",
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            r === "clothes" &&
              (0, tt.jsxs)(tt.Fragment, {
                children: [
                  (0, tt.jsx)(Ke, {
                    label: "Top",
                    children: (0, tt.jsx)(Bn, {
                      value: a.topStyle,
                      options: ["tee", "shirt", "hoodie", "jacket", "suit", "kurta", "dress", "tank"],
                      labels: hc,
                      onChange: (s) => Qa({ topStyle: s }),
                    }),
                  }),
                  (0, tt.jsx)(Ke, {
                    label: "Top colour",
                    children: (0, tt.jsxs)("div", {
                      className: "flex items-center gap-2",
                      children: [
                        (0, tt.jsx)(Xs, {
                          label: "Top",
                          value: a.top,
                          list: Q7,
                          onChange: (s) => Qa({ top: s }),
                        }),
                        (0, tt.jsx)("input", {
                          type: "color",
                          "aria-label": "Custom top colour",
                          value: a.top,
                          onChange: (s) => Qa({ top: s.target.value }),
                          className: "w-7 h-7 rounded bg-transparent",
                        }),
                      ],
                    }),
                  }),
                  a.topStyle !== "dress" &&
                    (0, tt.jsx)(Ke, {
                      label: "Bottom",
                      children: (0, tt.jsx)(Bn, {
                        value: a.bottomStyle,
                        options: ["jeans", "trousers", "shalwar", "shorts", "skirt"],
                        labels: hc,
                        onChange: (s) => Qa({ bottomStyle: s }),
                      }),
                    }),
                  a.topStyle !== "dress" &&
                    (0, tt.jsx)(Ke, {
                      label: "Bottom colour",
                      children: (0, tt.jsxs)("div", {
                        className: "flex items-center gap-2",
                        children: [
                          (0, tt.jsx)(Xs, {
                            label: "Bottom",
                            value: a.bottom,
                            list: t9,
                            onChange: (s) => Qa({ bottom: s }),
                          }),
                          (0, tt.jsx)("input", {
                            type: "color",
                            "aria-label": "Custom bottom colour",
                            value: a.bottom,
                            onChange: (s) => Qa({ bottom: s.target.value }),
                            className: "w-7 h-7 rounded bg-transparent",
                          }),
                        ],
                      }),
                    }),
                  (0, tt.jsx)(Ke, {
                    label: "Shoes",
                    children: (0, tt.jsx)(Xs, {
                      label: "Shoes",
                      value: a.shoes,
                      list: r9,
                      onChange: (s) => Qa({ shoes: s }),
                    }),
                  }),
                ],
              }),
          ],
        }),
      ],
    }),
  });
}
var uc = P(Zt(), 1);
var Jg = (t, e, a) => {
  let r = Math.hypot(t, e) || 1,
    o = (r - a) / r;
  return { x: Math.round(t * o), z: Math.round(e * o) };
};
function wy() {
  let t = ot(),
    e = [],
    a = t.session?.userId;
  (Oa.forEach((n) =>
    e.push({
      id: "lm:" + n.id,
      name: n.name,
      sub: n.desc,
      kind: "Place",
      icon: "\u{1F4CD}",
      ...(n.id === "airport" ? Cn : n.id === "coast" ? we.board : to(n.id)),
      face: { x: n.x, z: n.z },
    }),
  ),
    Hr.forEach((n) =>
      e.push({
        id: "d:" + n.id,
        name: n.name,
        sub: n.tagline,
        kind: "City",
        icon: "\u{1F3D9}",
        ...Jg(n.x, n.z, Math.hypot(n.cols * n.gap, n.rows * n.gap) / 2 + 6),
        face: { x: n.x, z: n.z },
      }),
    ),
    Object.values(Ha).forEach((n) =>
      e.push({
        id: "g:" + n.name,
        name: n.name,
        sub: "Government building",
        kind: "Republic",
        icon: "\u{1F3DB}",
        ...Jg(n.x, n.z, -16),
        face: { x: n.x, z: n.z },
      }),
    ),
    Gr.forEach((n) =>
      e.push({
        id: "s:" + n.id,
        name: n.name,
        sub: n.tagline,
        kind: "Society",
        icon: "\u{1F3D8}",
        x: n.gate.face.x,
        z: n.gate.face.z,
        face: { x: n.gate.x, z: n.gate.z },
      }),
    ),
    e.push({
      id: "s:starter",
      name: Jt.name,
      sub: Jt.tagline,
      kind: "Society",
      icon: "\u{1F3E2}",
      x: Jt.x,
      z: Jt.z - 66,
      face: { x: Jt.x, z: Jt.z },
    }),
    ei.forEach((n) =>
      e.push({
        id: "st:" + n.id,
        name: `Metro \xB7 ${n.name}`,
        sub: "Metro station",
        kind: "Transit",
        icon: "\u{1F687}",
        x: n.x,
        z: n.z + 10,
        face: { x: n.x, z: n.z },
      }),
    ),
    Bo.forEach((n) => {
      let i = wn[n.site];
      e.push({
        id: "h:" + n.id,
        name: n.name,
        sub: n.desc,
        kind: "Hall",
        icon: n.kind === "gaming" ? "\u{1F3AE}" : n.kind === "lounge" ? "\u{1F6CB}" : "\u{1F3A4}",
        ...Jg(i.x, i.z, i.r + 4),
        face: { x: i.x, z: i.z },
        hall: n.id,
      });
    }),
    yh.forEach((n) =>
      e.push({
        id: "z:" + n.id,
        name: n.name,
        sub: n.sub,
        kind: "Services",
        icon: n.id === "food" ? "\u{1F362}" : n.id === "faith" ? "\u{1F54A}" : "\u{1F3E2}",
        x: n.x,
        z: n.z,
      }),
    ),
    Di.forEach((n) => {
      let i = Ic(n, 4);
      e.push({
        id: "sv:" + n.id,
        name: n.name,
        sub: n.sub + (n.job ? ` \xB7 ${n.job.title} ${n.job.pay} FYC` : ""),
        kind: n.kind === "faith" ? "Worship" : n.kind === "stall" ? "Food" : "Services",
        icon:
          n.kind === "faith"
            ? "\u{1F54A}"
            : n.kind === "stall"
              ? "\u{1F362}"
              : n.id === "hospital"
                ? "\u{1F3E5}"
                : n.id === "police"
                  ? "\u{1F693}"
                  : n.id === "fire"
                    ? "\u{1F692}"
                    : n.id === "post"
                      ? "\u{1F4EE}"
                      : n.id === "library"
                        ? "\u{1F4DA}"
                        : "\u{1F3EA}",
        x: i.x,
        z: i.z,
        face: { x: n.x, z: n.z },
      });
    }),
    qc.forEach((n) =>
      e.push({
        id: "r:" + n.id,
        name: n.name,
        sub: `Joyland ride \xB7 ${n.fee ? n.fee + " FYC" : "free"}`,
        kind: "Ride",
        icon: "\u{1F3A1}",
        ...Jg(lr.x, lr.z, lr.r - 18),
        face: { x: lr.x, z: lr.z },
      }),
    ),
    qa(t).forEach((n) => {
      let i = bo(n.id);
      i &&
        e.push({
          id: "sh:" + n.id,
          name: `${n.no} \xB7 ${n.name}`,
          sub: n.kind === "vacant" ? "Free unit" : n.tagline,
          kind: "Shop",
          icon: "\u{1F6CD}",
          x: i.x,
          z: i.z,
        });
    }));
  let r = Za(t);
  (Ya.forEach((n) => {
    let i = r[n.id],
      s = (Math.hypot(n.x, n.z) - n.size / 2 - 4) / Math.hypot(n.x, n.z);
    e.push({
      id: "p:" + n.id,
      name: `Plot ${n.id}`,
      sub: i
        ? `${i.ownerName}${i.use ? " \xB7 " + i.use : ""}`
        : `For sale \xB7 ${n.price.toLocaleString("en-US")} FYC`,
      kind: i?.owner === a ? "Mine" : "Plot",
      icon: i?.owner === a ? "\u2B50" : "\u{1F7E9}",
      x: Math.round(n.x * s),
      z: Math.round(n.z * s),
      face: { x: n.x, z: n.z },
    });
  }),
    (t.estateMine?.owned || []).concat(t.estateMine?.renting || []).forEach((n) => {
      let i = _i(n.id);
      i &&
        e.push({
          id: "my:" + i.id,
          name: `My home ${i.id}`,
          sub: "Your society plot",
          kind: "Mine",
          icon: "\u2B50",
          x: i.x,
          z: i.z + i.face * (i.size / 2 + 2),
          face: { x: i.x, z: i.z },
        });
    }),
    t.estateMine?.studio &&
      e.push({
        id: "my:studio",
        name: `My studio ${t.estateMine.studio}`,
        sub: "Starter Commons",
        kind: "Mine",
        icon: "\u2B50",
        x: Jt.x,
        z: Jt.z - 66,
      }));
  let o = t.users.find((n) => n.id === a);
  return (
    o &&
      e.push({
        id: "my:home",
        name: "My home",
        sub: "Your house in the city",
        kind: "Mine",
        icon: "\u2B50",
        x: o.home.x,
        z: o.home.z + 11,
        face: { x: o.home.x, z: o.home.z },
      }),
    O.peers.forEach((n) => {
      n.sc === "plaza" &&
        e.push({
          id: "pp:" + n.id,
          name: n.name,
          sub: "Online now",
          kind: "Citizen",
          icon: "\u{1F7E2}",
          x: n.x + 2,
          z: n.z + 2,
          face: { x: n.x, z: n.z },
        });
    }),
    e
  );
}
var by = (t) =>
  t
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
function Qg(t, e = 14) {
  let a = by(t);
  if (!a) return [];
  let r = /^(ex|mb|rs)\s?\d{1,4}$/.test(a)
      ? _i(
          a
            .replace(/\s/, "-")
            .toUpperCase()
            .replace(/-(\d+)$/, (s, l) => "-" + l.padStart(4, "0")),
        )
      : void 0,
    o = r
      ? [
          {
            id: "ep:" + r.id,
            name: `Plot ${r.id}`,
            sub: r.empty ? `For sale \xB7 ${r.price.toLocaleString("en-US")} FYC` : `Home of ${r.resident}`,
            kind: "Society plot",
            icon: "\u{1F3E0}",
            x: r.x,
            z: r.z + r.face * (r.size / 2 + 2),
            face: { x: r.x, z: r.z },
          },
        ]
      : [],
    n = a.split(" "),
    i = wy()
      .map((s) => {
        let l = by(s.name + " " + s.sub + " " + s.kind),
          c = by(s.name),
          d = 0;
        if ((c === a && (d += 100), c.startsWith(a) && (d += 50), n.every((h) => l.includes(h))))
          d += 20 + n.filter((h) => c.split(" ").some((u) => u.startsWith(h))).length * 8;
        else return null;
        return (
          s.kind === "Mine" && (d += 6),
          (s.kind === "Place" || s.kind === "City") && (d += 4),
          { p: s, s: d }
        );
      })
      .filter(Boolean);
  return [...o, ...i.sort((s, l) => l.s - s.s).map((s) => s.p)].slice(0, e);
}
var o9 = [
  "lm:core",
  "lm:market",
  "lm:joyland",
  "lm:coast",
  "lm:airport",
  "lm:newstv",
  "lm:campus",
  "s:executive",
  "g:Parliament of Fyrus",
  "lm:lounge",
];
var Tt = P(ct(), 1),
  XR = { X0: -340, X1: 440, Z0: -440, Z1: 330 },
  JR = { X0: -1040, X1: 1110, Z0: -440, Z1: 710 },
  n9 = {
    core: "\u2605",
    market: "\u{1F6CD}",
    club: "\u266B",
    pool: "\u2248",
    gardens: "\u2663",
    skyport: "\u2708",
    marina: "\u2693",
    homes: "\u2302",
    joyland: "\u25CE",
    coast: "\u224B",
    airport: "\u2708",
    campus: "\u270E",
    newstv: "\u{1F4FA}",
    halls: "\u{1F3A4}",
    lounge: "\u{1F3AE}",
  };
function My() {
  let t = Y(),
    e = qa(t),
    [a, r] = (0, uc.useState)(null),
    [o, n] = (0, uc.useState)(""),
    [i, s] = (0, uc.useState)(!1),
    l = i ? JR : XR,
    [c, d] = (0, uc.useState)(null),
    h = c || { cx: (l.X0 + l.X1) / 2, cz: (l.Z0 + l.Z1) / 2, k: 1 },
    u = (l.X1 - l.X0) / h.k,
    p = (l.Z1 - l.Z0) / h.k,
    v = h.cx - u / 2,
    g = h.cx + u / 2,
    m = h.cz - p / 2,
    f = h.cz + p / 2,
    y = (0, uc.useRef)(null),
    x = (0, uc.useRef)(null),
    k = (M, _) => {
      let lt = y.current.getBoundingClientRect();
      return { x: v + ((M - lt.left) / lt.width) * u, z: m + ((_ - lt.top) / lt.height) * p };
    },
    b = (M, _) => {
      let lt = Math.max(1, Math.min(14, h.k * M)),
        vt = _ || { x: h.cx, z: h.cz };
      d({ k: lt, cx: vt.x + (h.cx - vt.x) * (h.k / lt), cz: vt.z + (h.cz - vt.z) * (h.k / lt) });
    },
    w = (M, _) => {
      let lt = Hi(M, _) || Bl(M, _) ? null : Ig(M, _, 18),
        vt = lt ? { x: lt.x, z: lt.z } : { x: Math.round(M), z: Math.round(_) };
      r({
        name: "Dropped pin",
        desc: `x ${Math.round(M)}, z ${Math.round(_)} \xB7 teleport lands at the nearest open spot`,
        x: M,
        z: _,
        spot: vt,
      });
    },
    L = o.trim().toLowerCase(),
    E = /^(ex|mb|rs)-\d{1,4}$/.test(L)
      ? _i(L.toUpperCase().replace(/-(\d+)$/, (M, _) => "-" + _.padStart(4, "0")))
      : void 0,
    T =
      L.length < 2
        ? []
        : Qg(L, 12).map((M) => ({
            name: M.name,
            desc: `${M.icon} ${M.kind} \xB7 ${M.sub}`,
            x: M.x,
            z: M.z,
            face: M.face,
          })),
    S = [],
    H =
      L.length < 2
        ? []
        : [
            ...(E
              ? [
                  {
                    name: `Plot ${E.id}`,
                    desc: E.empty
                      ? `For sale \xB7 ${E.price.toLocaleString("en-US")} FYC`
                      : `Home of ${E.resident}`,
                    x: E.x,
                    z: E.z + E.face * (E.size / 2 + 2),
                  },
                ]
              : []),
            ...[...Gr, { ...Jt, gate: { x: Jt.x, z: Jt.z - 66 } }]
              .filter((M) => M.name.toLowerCase().includes(L))
              .map((M) => ({ name: M.name, desc: M.tagline, x: M.gate.x, z: M.gate.z })),
            ...e
              .filter((M) => `${M.no} ${M.name} ${M.tagline}`.toLowerCase().includes(L))
              .slice(0, 8)
              .map((M) => ({
                name: `${M.no} \xB7 ${M.name}`,
                desc: M.kind === "vacant" ? "Free unit, open your shop here" : M.tagline,
                ...bo(M.id),
              })),
            ...Oa.filter((M) => M.name.toLowerCase().includes(L)).map((M) => ({
              name: M.name,
              desc: M.desc,
              ...to(M.id),
            })),
            ...Hr.filter((M) => M.name.toLowerCase().includes(L)).map((M) => ({
              name: M.name,
              desc: M.tagline,
              x: Math.round(M.x * 0.82),
              z: Math.round(M.z * 0.82),
            })),
            ...Ya.filter((M) => M.id.toLowerCase().includes(L))
              .slice(0, 6)
              .map((M) => {
                let _ = Za(t)[M.id],
                  lt = (Math.hypot(M.x, M.z) - M.size / 2 - 4) / Math.hypot(M.x, M.z);
                return {
                  name: `Plot ${M.id}`,
                  desc: _
                    ? `${_.ownerName}${_.use ? " \xB7 " + _.use : ""}`
                    : `For sale \xB7 ${M.price.toLocaleString("en-US")} FYC`,
                  x: Math.round(M.x * lt),
                  z: Math.round(M.z * lt),
                };
              }),
          ],
    N = t.coords,
    B = t.users.find((M) => M.id === t.session?.userId),
    X = (M, _) => {
      let lt = Math.hypot(M - N.x, _ - N.z);
      return lt >= 1e3 ? `${(lt / 1e3).toFixed(1)} km` : `${Math.round(lt / 10) * 10} m`;
    };
  return (0, Tt.jsxs)("div", {
    className: "space-y-3",
    children: [
      (0, Tt.jsxs)("div", {
        children: [
          (0, Tt.jsx)("input", {
            id: "map-search",
            className: "field",
            value: o,
            onChange: (M) => n(M.target.value),
            placeholder: "Search a place, city, plot (TC-07, EX-0042), shop, hall or online citizen",
            "aria-label": "Search the map",
          }),
          T.length > 0 &&
            (0, Tt.jsx)("div", {
              className: "mt-1 rounded-md overflow-hidden max-h-64 overflow-y-auto",
              style: { border: "1px solid var(--line)" },
              children: T.map((M) =>
                (0, Tt.jsxs)(
                  "button",
                  {
                    className: "w-full text-left px-3 py-2 text-sm card-hover flex gap-2",
                    onClick: () => {
                      (r({
                        name: M.name,
                        desc: M.desc,
                        x: M.x,
                        z: M.z,
                        spot: { x: M.x, z: M.z, ...(M.face ? { face: M.face } : {}) },
                      }),
                        n(""),
                        d({ cx: M.x, cz: M.z, k: i ? 5 : 3 }));
                    },
                    children: [
                      (0, Tt.jsx)("b", { className: "truncate", children: M.name }),
                      (0, Tt.jsx)("span", {
                        className: "truncate text-xs mt-0.5",
                        style: { color: "var(--ink-dim)" },
                        children: M.desc,
                      }),
                    ],
                  },
                  M.name + M.x,
                ),
              ),
            }),
        ],
      }),
      (0, Tt.jsxs)("div", {
        className: "flex gap-1 items-center",
        children: [
          [
            ["City", !1],
            ["Whole country", !0],
          ].map(([M, _]) =>
            (0, Tt.jsx)(
              "button",
              {
                className: `chip ${i === _ ? "chip-on" : ""}`,
                onClick: () => {
                  (s(_), d(null));
                },
                children: M,
              },
              String(M),
            ),
          ),
          (0, Tt.jsxs)("span", {
            className: "ml-auto flex gap-1",
            children: [
              (0, Tt.jsx)("button", {
                className: "hud-icon",
                "aria-label": "Zoom in",
                onClick: () => b(1.6),
                children: (0, Tt.jsx)(Na, {}),
              }),
              (0, Tt.jsx)("button", {
                className: "hud-icon",
                "aria-label": "Zoom out",
                onClick: () => b(1 / 1.6),
                children: (0, Tt.jsx)(lg, {}),
              }),
              (0, Tt.jsx)("button", {
                className: "hud-icon",
                "aria-label": "Centre on me",
                title: "Centre on me",
                onClick: () => d({ cx: N.x, cz: N.z, k: Math.max(3, h.k) }),
                children: (0, Tt.jsx)(tE, {}),
              }),
            ],
          }),
        ],
      }),
      (0, Tt.jsx)("div", {
        className: "text-[11px]",
        style: { color: "var(--ink-dim)" },
        children:
          "Drag to move \xB7 scroll or +/\u2212 to zoom \xB7 tap anywhere to drop a pin and teleport there",
      }),
      (0, Tt.jsxs)("div", {
        className: "relative rounded-lg overflow-hidden",
        style: { background: "#2f3a2f", border: "1px solid var(--line)" },
        children: [
          (0, Tt.jsxs)("svg", {
            ref: y,
            viewBox: `${v} ${m} ${g - v} ${f - m}`,
            className: "w-full block touch-none select-none",
            style: { cursor: x.current ? "grabbing" : "crosshair" },
            role: "img",
            "aria-label": "Map of Fyrus City",
            onWheel: (M) => {
              let _ = k(M.clientX, M.clientY);
              b(M.deltaY < 0 ? 1.25 : 0.8, _);
            },
            onPointerDown: (M) => {
              x.current = { x: M.clientX, y: M.clientY, moved: !1, cx: h.cx, cz: h.cz };
            },
            onPointerMove: (M) => {
              let _ = x.current;
              if (!_) return;
              let lt = M.clientX - _.x,
                vt = M.clientY - _.y;
              if ((Math.hypot(lt, vt) > 5 && (_.moved = !0), _.moved && h.k > 1)) {
                let zt = y.current.getBoundingClientRect();
                d({ k: h.k, cx: _.cx - (lt / zt.width) * u, cz: _.cz - (vt / zt.height) * p });
              }
            },
            onPointerUp: (M) => {
              let _ = x.current;
              x.current = null;
              let vt = !!M.target.closest('[style*="cursor: pointer"]');
              if (_ && !_.moved && !vt) {
                let zt = k(M.clientX, M.clientY);
                w(zt.x, zt.z);
              }
            },
            children: [
              (0, Tt.jsx)("rect", {
                "data-ground": "1",
                x: -3e3,
                y: -3e3,
                width: 6e3,
                height: 6e3,
                fill: "#2f3a2f",
              }),
              Array.from({ length: 13 }, (M, _) => v + 10 + _ * 64).map((M) =>
                (0, Tt.jsx)(
                  "line",
                  {
                    x1: Math.round(M / 64) * 64 + 32,
                    y1: m,
                    x2: Math.round(M / 64) * 64 + 32,
                    y2: f,
                    stroke: "#5d6166",
                    strokeWidth: 7,
                  },
                  "v" + M,
                ),
              ),
              Array.from({ length: 12 }, (M, _) => m + 10 + _ * 64)
                .filter((M) => M > -360)
                .map((M) =>
                  (0, Tt.jsx)(
                    "line",
                    {
                      x1: v,
                      y1: Math.round(M / 64) * 64 + 32,
                      x2: g,
                      y2: Math.round(M / 64) * 64 + 32,
                      stroke: "#5d6166",
                      strokeWidth: 7,
                    },
                    "h" + M,
                  ),
                ),
              (0, Tt.jsx)("rect", { x: -3e3, y: -3e3, width: 6e3, height: 2608, fill: "#2a6f93" }),
              (0, Tt.jsx)("rect", { x: -3e3, y: -392, width: 6e3, height: 20, fill: "#e3cf9e" }),
              (0, Tt.jsx)("rect", { x: 382, y: -75, width: 16, height: 150, fill: "#3a3d42", rx: 3 }),
              (0, Tt.jsx)("rect", { x: 363, y: -20, width: 10, height: 40, fill: "#dfe6ee", rx: 2 }),
              [
                ...Gr.map((M) => ({ r: As(M), name: M.name, color: M.color, desc: M.tagline, gate: M.gate })),
                { r: Rl, name: Jt.name, color: Jt.color, desc: Jt.tagline, gate: { x: Jt.x, z: Jt.z - 66 } },
              ].map((M) =>
                (0, Tt.jsxs)(
                  "g",
                  {
                    style: { cursor: "pointer" },
                    onClick: () =>
                      r({
                        name: M.name,
                        desc: M.desc,
                        x: M.gate.x,
                        z: M.gate.z,
                        spot: { x: M.gate.x, z: M.gate.z },
                      }),
                    children: [
                      (0, Tt.jsx)("rect", {
                        x: M.r.x0,
                        y: M.r.z0,
                        width: M.r.x1 - M.r.x0,
                        height: M.r.z1 - M.r.z0,
                        fill: M.color,
                        fillOpacity: 0.28,
                        stroke: M.color,
                        strokeWidth: 4,
                      }),
                      (0, Tt.jsx)("text", {
                        x: (M.r.x0 + M.r.x1) / 2,
                        y: (M.r.z0 + M.r.z1) / 2,
                        textAnchor: "middle",
                        fontSize: i ? 30 : 14,
                        fill: "#fff",
                        fontWeight: 700,
                        children: M.name,
                      }),
                    ],
                  },
                  M.name,
                ),
              ),
              (0, Tt.jsx)("circle", { cx: 0, cy: -270, r: 46, fill: "#2c6f8f" }),
              (0, Tt.jsx)("circle", { cx: 40, cy: 152, r: 30, fill: "#4f7a3a" }),
              (0, Tt.jsx)("rect", {
                x: Ze.x - Ze.w / 2,
                y: Ze.z - Ze.d / 2,
                width: Ze.w,
                height: Ze.d,
                fill: "#4aa8c9",
                stroke: "#e8e1d2",
                strokeWidth: 6,
              }),
              (0, Tt.jsx)("rect", { x: 40, y: -11, width: 270, height: 22, fill: "#b9a98f" }),
              (0, Tt.jsx)("rect", { x: 40, y: -107, width: 270, height: 22, fill: "#b9a98f" }),
              e.map((M) =>
                (0, Tt.jsx)(
                  "rect",
                  {
                    x: _c(M.slot) - 5.6,
                    y: zl(M.row) - 6,
                    width: 11.2,
                    height: 12,
                    fill: M.kind === "vacant" ? "#8a857c" : M.primary,
                    stroke: "#000",
                    strokeOpacity: 0.3,
                    onClick: () => {
                      let _ = bo(M.id);
                      r({ name: `${M.no} \xB7 ${M.name}`, desc: M.tagline, x: _.x, z: _.z, spot: _ });
                    },
                    style: { cursor: "pointer" },
                    children: (0, Tt.jsx)("title", { children: `${M.no} \xB7 ${M.name}` }),
                  },
                  M.id,
                ),
              ),
              (0, Tt.jsx)("rect", { x: 303, y: -13, width: 26, height: 26, fill: "#2a2d34" }),
              (0, Tt.jsx)("circle", { cx: 0, cy: 0, r: 30, fill: "#c8c2b6" }),
              Hr.map((M) =>
                (0, Tt.jsxs)(
                  "g",
                  {
                    children: [
                      (0, Tt.jsx)("rect", {
                        x: M.x - (M.cols * M.gap + 14) / 2,
                        y: M.z - (M.rows * M.gap + 14) / 2,
                        width: M.cols * M.gap + 14,
                        height: M.rows * M.gap + 14,
                        fill: "#8f8b84",
                        stroke: M.color,
                        strokeWidth: 3,
                      }),
                      Ya.filter((_) => _.district === M.id).map((_) =>
                        (0, Tt.jsx)(
                          "rect",
                          {
                            x: _.x - _.size / 2,
                            y: _.z - _.size / 2,
                            width: _.size,
                            height: _.size,
                            fill:
                              Za(t)[_.id]?.owner === t.session?.userId
                                ? "#ff9a3c"
                                : Za(t)[_.id]
                                  ? "#6f6a62"
                                  : M.color,
                            fillOpacity: Za(t)[_.id] ? 1 : 0.55,
                            onClick: () => {
                              let lt = Za(t)[_.id],
                                vt = (Math.hypot(_.x, _.z) - _.size / 2 - 4) / Math.hypot(_.x, _.z);
                              r({
                                name: `Plot ${_.id}`,
                                desc: lt
                                  ? lt.ownerName
                                  : `For sale \xB7 ${_.price.toLocaleString("en-US")} FYC`,
                                x: _.x,
                                z: _.z,
                                spot: { x: _.x * vt, z: _.z * vt },
                              });
                            },
                            style: { cursor: "pointer" },
                            children: (0, Tt.jsx)("title", { children: _.id }),
                          },
                          _.id,
                        ),
                      ),
                      (0, Tt.jsx)("text", {
                        x: M.x,
                        y: M.z - (M.rows * M.gap + 14) / 2 - 8,
                        textAnchor: "middle",
                        fontSize: 13,
                        fontWeight: 700,
                        fill: "#fff",
                        stroke: "#000",
                        strokeWidth: 3,
                        paintOrder: "stroke",
                        children: M.name,
                      }),
                    ],
                  },
                  M.id,
                ),
              ),
              [Ha.parliament, Ha.bank, Ha.citizens].map((M) =>
                (0, Tt.jsxs)(
                  "g",
                  {
                    children: [
                      (0, Tt.jsx)("rect", {
                        x: M.x - 9,
                        y: M.z - 7,
                        width: 18,
                        height: 14,
                        fill: "#ece7dc",
                        stroke: "#000",
                        strokeOpacity: 0.4,
                      }),
                      (0, Tt.jsx)("text", {
                        x: M.x,
                        y: M.z + 22,
                        textAnchor: "middle",
                        fontSize: 10,
                        fontWeight: 700,
                        fill: "#fff",
                        stroke: "#000",
                        strokeWidth: 3,
                        paintOrder: "stroke",
                        children: M.name.replace(" of Fyrus", ""),
                      }),
                    ],
                  },
                  M.name,
                ),
              ),
              t.users
                .filter((M) => !M.procedural)
                .map((M) =>
                  (0, Tt.jsx)(
                    "rect",
                    {
                      x: M.home.x - 5,
                      y: M.home.z - 5,
                      width: 10,
                      height: 10,
                      fill: M.id === B?.id ? "#ff9a3c" : "#a39c90",
                    },
                    M.id,
                  ),
                ),
              Di.filter((M) => M.kind !== "stall" && M.kind !== "shop").map((M) =>
                (0, Tt.jsx)(
                  "rect",
                  {
                    x: M.x - 6,
                    y: M.z - 6,
                    width: 12,
                    height: 12,
                    rx: 2,
                    fill: M.color,
                    stroke: "#000",
                    strokeOpacity: 0.5,
                  },
                  M.id,
                ),
              ),
              yh.map((M) =>
                (0, Tt.jsxs)(
                  "g",
                  {
                    onClick: () => r({ name: M.name, desc: M.sub, x: M.x, z: M.z, spot: { x: M.x, z: M.z } }),
                    style: { cursor: "pointer" },
                    children: [
                      (0, Tt.jsx)("circle", {
                        cx: M.x,
                        cy: M.z,
                        r: 9,
                        fill: "#45e0ae",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }),
                      (0, Tt.jsx)("text", {
                        x: M.x,
                        y: M.z + 22,
                        textAnchor: "middle",
                        fontSize: 11,
                        fontWeight: 700,
                        fill: "#fff",
                        stroke: "#000",
                        strokeWidth: 3,
                        paintOrder: "stroke",
                        children: M.name,
                      }),
                    ],
                  },
                  M.id,
                ),
              ),
              Oa.map((M) =>
                (0, Tt.jsxs)(
                  "g",
                  {
                    onClick: () => r({ name: M.name, desc: M.desc, x: M.x, z: M.z, spot: to(M.id) }),
                    style: { cursor: "pointer" },
                    children: [
                      (0, Tt.jsx)("circle", {
                        cx: M.x,
                        cy: M.z,
                        r: 11,
                        fill: "#111",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }),
                      (0, Tt.jsx)("text", {
                        x: M.x,
                        y: M.z + 5,
                        textAnchor: "middle",
                        fontSize: 13,
                        fill: "#fff",
                        children: n9[M.kind] || "\u2022",
                      }),
                      (0, Tt.jsx)("text", {
                        x: M.x,
                        y: M.id === "market" ? M.z - 18 : M.z + 26,
                        textAnchor: "middle",
                        fontSize: 11,
                        fontWeight: 700,
                        fill: "#fff",
                        stroke: "#000",
                        strokeWidth: 3,
                        paintOrder: "stroke",
                        children: M.name,
                      }),
                    ],
                  },
                  M.id,
                ),
              ),
              a &&
                (0, Tt.jsx)("circle", {
                  cx: a.x,
                  cy: a.z,
                  r: 14,
                  fill: "none",
                  stroke: "#ffc27a",
                  strokeWidth: 3,
                  children: (0, Tt.jsx)("animate", {
                    attributeName: "r",
                    values: "10;18;10",
                    dur: "1.4s",
                    repeatCount: "indefinite",
                  }),
                }),
              t.waypoint &&
                (0, Tt.jsx)("circle", {
                  cx: t.waypoint.x,
                  cy: t.waypoint.z,
                  r: 7,
                  fill: "#ffc27a",
                  stroke: "#000",
                  strokeWidth: 2,
                }),
              (0, Tt.jsx)("circle", {
                cx: N.x,
                cy: N.z,
                r: 6,
                fill: "var(--accent)",
                stroke: "#fff",
                strokeWidth: 2.5,
              }),
            ],
          }),
          a &&
            (0, Tt.jsxs)("div", {
              className: "absolute left-2 right-2 bottom-2 hud-box p-3 flex items-center gap-3",
              children: [
                (0, Tt.jsxs)("div", {
                  className: "flex-1 min-w-0",
                  children: [
                    (0, Tt.jsxs)("div", {
                      className: "font-bold text-sm truncate",
                      children: [
                        a.name,
                        " ",
                        (0, Tt.jsxs)("span", {
                          className: "font-normal text-xs",
                          style: { color: "var(--ink-dim)" },
                          children: ["\xB7 ", X(a.x, a.z)],
                        }),
                      ],
                    }),
                    (0, Tt.jsx)("div", {
                      className: "text-[11px] truncate",
                      style: { color: "var(--ink-dim)" },
                      children: a.desc,
                    }),
                  ],
                }),
                (0, Tt.jsxs)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => ts({ ...a.spot, name: a.name }),
                  children: [(0, Tt.jsx)(dr, {}), " Route"],
                }),
                (0, Tt.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  title: "Taxi",
                  onClick: () => _t()?.startTaxi({ x: a.spot.x, z: a.spot.z, name: a.name }),
                  children: (0, Tt.jsx)(ci, {}),
                }),
                (0, Tt.jsxs)("button", {
                  id: "map-teleport",
                  className: "btn btn-primary btn-sm",
                  onClick: () => es(a.spot, a.name),
                  children: [(0, Tt.jsx)(da, {}), " Teleport"],
                }),
                (0, Tt.jsx)("button", {
                  className: "btn btn-ghost btn-sm px-2",
                  onClick: () => r(null),
                  "aria-label": "Close",
                  children: (0, Tt.jsx)(pe, {}),
                }),
              ],
            }),
        ],
      }),
      t.waypoint &&
        (0, Tt.jsxs)("div", {
          className: "flex items-center gap-2 text-sm",
          children: [
            (0, Tt.jsx)("span", { className: "w-3 h-3 rounded-full", style: { background: "#ffc27a" } }),
            " Route to ",
            (0, Tt.jsx)("b", { children: t.waypoint.name }),
            " \xB7 ",
            X(t.waypoint.x, t.waypoint.z),
            (0, Tt.jsx)("button", {
              className: "btn btn-ghost btn-sm ml-auto",
              onClick: () => od(null),
              children: "Clear route",
            }),
          ],
        }),
      (0, Tt.jsx)("div", {
        className: "grid grid-cols-2 gap-1.5",
        children: Oa.map((M) =>
          (0, Tt.jsxs)(
            "button",
            {
              className: "flex items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm card-hover",
              style: { border: "1px solid var(--line)" },
              onClick: () => r({ name: M.name, desc: M.desc, x: M.x, z: M.z, spot: to(M.id) }),
              children: [
                (0, Tt.jsx)("span", { className: "w-5 text-center", children: n9[M.kind] }),
                (0, Tt.jsx)("span", { className: "flex-1 truncate font-bold", children: M.name }),
                (0, Tt.jsx)("span", {
                  className: "text-[11px] tabular",
                  style: { color: "var(--ink-dim)" },
                  children: X(M.x, M.z),
                }),
              ],
            },
            M.id,
          ),
        ),
      }),
    ],
  });
}
var Ey = P(Zt(), 1);
var pa = P(ct(), 1),
  QR = [
    ["all", "All"],
    ["agent", "AI agents"],
    ["service", "Services"],
    ["brand", "Brands"],
    ["game", "Games"],
    ["cafe", "Food"],
  ],
  Md = (t, e) => Eh[t].replace("{px}", String(e));
