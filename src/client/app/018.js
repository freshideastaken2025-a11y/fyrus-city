function er(t, e, a, r, o, n, i, s = 1) {
  let l = YN(n, i);
  l.repeat.set(e / 4, a / 4);
  let c = new $.Mesh(
    new $.PlaneGeometry(e, a),
    new $.MeshStandardMaterial({ map: l, roughness: i === "tile" ? 0.35 : 0.7 }),
  );
  ((c.rotation.x = -Math.PI / 2), (c.receiveShadow = !0), (c.name = "ground"), t.add(c));
  let d = et(o, 0.9),
    h = new $.Mesh(new $.PlaneGeometry(e, r), d);
  (h.position.set(0, r / 2, -a / 2), t.add(h));
  let u = new $.Mesh(new $.PlaneGeometry(a, r), d);
  (u.position.set(-e / 2, r / 2, 0), (u.rotation.y = Math.PI / 2), t.add(u));
  let p = new $.Mesh(new $.PlaneGeometry(a, r), d);
  (p.position.set(e / 2, r / 2, 0), (p.rotation.y = -Math.PI / 2), t.add(p));
  let v = 3.2;
  for (let w of [-1, 1]) {
    let L = new $.Mesh(new $.PlaneGeometry((e - v) / 2, r), d);
    (L.position.set(w * (v / 2 + (e - v) / 4), r / 2, a / 2), (L.rotation.y = Math.PI), t.add(L));
  }
  let g = new $.Mesh(new $.PlaneGeometry(v, r - 2.8), d);
  (g.position.set(0, 2.8 + (r - 2.8) / 2, a / 2), (g.rotation.y = Math.PI), t.add(g));
  let m = new $.Mesh(new $.PlaneGeometry(v, 2.8), new $.MeshBasicMaterial({ color: "#dfe8ef" }));
  (m.position.set(0, 1.4, a / 2 + 0.05), (m.rotation.y = Math.PI), t.add(m));
  let f = new $.Mesh(new $.PlaneGeometry(e, a), et("#f4f1ea", 0.95));
  ((f.rotation.x = Math.PI / 2), (f.position.y = r), t.add(f));
  let y = et("#3a3a3a", 0.6);
  ([
    [e, 0, -a / 2 + 0.03, 0],
    [a, -e / 2 + 0.03, 0, Math.PI / 2],
    [a, e / 2 - 0.03, 0, -Math.PI / 2],
  ].forEach(([w, L, E, T]) => {
    let S = new $.Mesh(new $.BoxGeometry(w, 0.14, 0.04), y);
    (S.position.set(L, 0.07, E), (S.rotation.y = T), t.add(S));
  }),
    t.add(new $.HemisphereLight("#fff6ea", "#5a4a3a", 0.55 * s)));
  let x = new $.DirectionalLight("#fff1dd", 0.55 * s);
  (x.position.set(3, r + 4, 6), t.add(x, x.target));
  let k = new $.MeshStandardMaterial({ color: "#ffffff", emissive: "#fff4e0", emissiveIntensity: 1 });
  for (let w = -e / 2 + e / 4; w < e / 2; w += e / 2)
    for (let L = -a / 2 + a / 4; L < a / 2; L += a / 2) {
      let E = new $.Mesh(new $.BoxGeometry(1.4, 0.05, 1.4), k);
      (E.position.set(w, r - 0.03, L), t.add(E));
      let T = new $.PointLight("#fff1dc", 0.55 * s, 14, 2);
      (T.position.set(w, r - 0.4, L), t.add(T));
    }
  let b = new $.Mesh(new $.PlaneGeometry(2.6, 1.4), et("#3b3b3b", 1));
  ((b.rotation.x = -Math.PI / 2), b.position.set(0, 0.01, a / 2 - 0.8), t.add(b));
}
function st(t, e, a, r, o, n, i, s) {
  let l = new $.Mesh(new $.BoxGeometry(e, a, r), s);
  return (l.position.set(o, n, i), (l.castShadow = !0), (l.receiveShadow = !0), t.add(l), l);
}
function Eo(t) {
  let e = new $.Group();
  (st(e, 0.5, 0.06, 0.5, 0, 0.46, 0, t), st(e, 0.5, 0.5, 0.06, 0, 0.72, -0.22, t));
  for (let [a, r] of [
    [-0.2, -0.2],
    [0.2, -0.2],
    [-0.2, 0.2],
    [0.2, 0.2],
  ])
    st(e, 0.04, 0.46, 0.04, a, 0.23, r, t);
  return e;
}
function Ri(t, e = 0.75, a = 0.5) {
  let r = new $.Group(),
    o = new $.Mesh(new $.CylinderGeometry(a, a, 0.05, 20), t);
  ((o.position.y = e), r.add(o));
  let n = new $.Mesh(new $.CylinderGeometry(0.05, 0.05, e, 8), et("#2b2b2b", 0.5, 0.5));
  ((n.position.y = e / 2), r.add(n));
  let i = new $.Mesh(new $.CylinderGeometry(0.28, 0.3, 0.04, 16), et("#2b2b2b", 0.5, 0.5));
  return ((i.position.y = 0.02), r.add(i), r);
}
function qs() {
  let t = new $.Group();
  st(t, 0.5, 0.02, 0.34, 0, 0.01, 0, et("#9aa0a6", 0.4, 0.7));
  let e = st(
    t,
    0.5,
    0.32,
    0.015,
    0,
    0.17,
    -0.17,
    new $.MeshStandardMaterial({ color: "#111", emissive: "#7fb3ff", emissiveIntensity: 0.5 }),
  );
  return ((e.rotation.x = -0.25), t);
}
function ls() {
  let t = new $.Group(),
    e = new $.Mesh(new $.CylinderGeometry(0.3, 0.24, 0.5, 14), et("#d8d2c6", 0.8));
  ((e.position.y = 0.25), t.add(e));
  let a = ya("#4f7f35", 0.45);
  return ((a.position.y = 0.35), t.add(a), t);
}
function ua(t, e, a) {
  let r = new $.MeshStandardMaterial({
    map: t,
    roughness: 0.6,
    emissive: "#ffffff",
    emissiveIntensity: 0.12,
  });
  return ((r.emissiveMap = t), new $.Mesh(new $.PlaneGeometry(e, a), r));
}
function Ba(t, e, a, r) {
  let o = document.createElement("canvas");
  ((o.width = 768), (o.height = 96 + e.length * 74 + 40));
  let n = o.getContext("2d");
  return (
    (n.fillStyle = a),
    n.fillRect(0, 0, o.width, o.height),
    (n.strokeStyle = r),
    (n.globalAlpha = 0.4),
    (n.lineWidth = 6),
    n.strokeRect(14, 14, o.width - 28, o.height - 28),
    (n.globalAlpha = 1),
    (n.fillStyle = r),
    (n.font = '400 64px "Bebas Neue", Impact, sans-serif'),
    n.fillText(t, 44, 86),
    (n.font = '600 32px "Plus Jakarta Sans", sans-serif'),
    e.forEach(([i, s], l) => {
      let c = 160 + l * 74;
      ((n.fillStyle = r),
        n.fillText(i.length > 30 ? i.slice(0, 29) + "\u2026" : i, 44, c),
        (n.textAlign = "right"),
        n.fillText(s, o.width - 44, c),
        (n.textAlign = "left"),
        (n.globalAlpha = 0.25),
        n.fillRect(44, c + 20, o.width - 88, 2),
        (n.globalAlpha = 1));
    }),
    new $.CanvasTexture(o)
  );
}
var r7 = ["Ella", "Noah", "Lina", "Omar", "Yuki", "Leo", "Nina", "Sami", "Iris", "Theo"];
function o7(t, e, a) {
  let r = new $.Group(),
    o = [],
    n = [],
    i = [],
    s = 16,
    l = 14,
    c = 4.8,
    d =
      t.kind === "game"
        ? "dark"
        : t.kind === "cafe"
          ? "wood"
          : t.kind === "brand"
            ? "tile"
            : t.kind === "vacant"
              ? "concrete"
              : t.font === "serif" || t.font === "script"
                ? "wood"
                : "tile",
    h =
      t.kind === "game"
        ? "#2a2d34"
        : t.kind === "vacant"
          ? "#d9d5cc"
          : "#" + new $.Color(t.facade || "#ece7dc").lerp(new $.Color("#ffffff"), 0.35).getHexString();
  if (
    (er(
      r,
      s,
      l,
      c,
      h,
      d === "wood" ? "#a07850" : d === "dark" ? "#1d2027" : d === "concrete" ? "#b5b0a6" : "#e8e4dc",
      d,
      t.kind === "game" ? 0.7 : 1,
    ),
    t.kind !== "vacant")
  ) {
    let b = new $.Mesh(new $.PlaneGeometry(s, 2.2), et(t.primary, 0.7));
    (b.position.set(0, c - 1.6, -l / 2 + 0.02), r.add(b));
    let w = ua(M0(t), 8.4, 1.45);
    (w.position.set(0, c - 1.6, -l / 2 + 0.04), r.add(w));
    let L = new $.Mesh(new $.PlaneGeometry(s, 0.12), et(t.secondary, 0.6));
    (L.position.set(0, c - 2.78, -l / 2 + 0.03), r.add(L));
  }
  let p = t.id,
    v = r7[(t.slot * 3 + (t.row === "N" ? 1 : 0)) % r7.length],
    g = et(t.kind === "cafe" ? "#5a3f2a" : "#2f3237", 0.5, 0.2),
    m = et(t.kind === "cafe" ? "#d8cdb8" : "#efefef", 0.3, 0.1);
  if (t.kind !== "vacant") {
    (st(r, 4.2, 1, 0.9, -4.6, 0.5, -4.4, g),
      st(r, 4.4, 0.06, 1, -4.6, 1.03, -4.4, m),
      n.push({ x: -4.6, z: -4.6, hx: 2.3, hz: 1.4 }));
    let b = st(r, 0.5, 0.35, 0.4, -5.6, 1.24, -4.4, et("#1d1d1d", 0.4, 0.4)),
      w = ua(M0({ ...t, tagline: "" }), 3.6, 0.62);
    (w.position.set(-4.6, 0.55, -3.93), (w.rotation.y = 0), r.add(w));
  }
  let f = new $.MeshStandardMaterial({ map: E0(t, a), roughness: 0.85 }),
    y = new $.Mesh(new $.PlaneGeometry(1.6, 2), f);
  if (
    (y.position.set(s / 2 - 0.03, 1.7, 4.4),
    (y.rotation.y = -Math.PI / 2),
    r.add(y),
    o.push({
      pos: new $.Vector3(s / 2 - 1.4, 0, 4.4),
      radius: 1.8,
      label: "Shop stats",
      action: "shopview",
      payload: p,
      obj: y,
    }),
    [
      [-s / 2 + 0.8, l / 2 - 1],
      [s / 2 - 0.8, -l / 2 + 1],
    ].forEach(([b, w]) => {
      let L = ls();
      (L.position.set(b, 0, w), r.add(L));
    }),
    t.kind === "agent")
  ) {
    let b = e.agents.find((T) => T.id === t.refId) || t.item,
      w = e.agents.filter((T) => T.ownerId === b?.ownerId && T.id !== b?.id).slice(0, 2);
    [b, ...w].filter(Boolean).forEach((T, S) => {
      let H = S === 0 ? 2 : S === 1 ? 5.4 : -1.4,
        N = S === 0 ? -1 : 1.5,
        B = new $.Group();
      (B.position.set(H, 0, N), r.add(B), st(B, 0.9, 1, 0.7, 0, 0.5, 0, et("#2b2e33", 0.5, 0.3)));
      let X = b0({
          kicker: "AI Agent",
          title: T.name,
          body: T.tagline,
          color: t.secondary,
          footer: `$${T.price} \xB7 free demo`,
          w: 512,
          h: 640,
        }),
        M = new $.Mesh(
          new $.PlaneGeometry(0.9, 1.15),
          new $.MeshStandardMaterial({ map: X, emissive: "#ffffff", emissiveMap: X, emissiveIntensity: 0.6 }),
        );
      (M.position.set(0, 1.62, 0.12),
        (M.rotation.x = -0.2),
        B.add(M),
        (st(B, 1, 1.25, 0.1, 0, 1.62, 0.05, et("#1a1a1a", 0.4, 0.5)).rotation.x = -0.2),
        n.push({ x: H, z: N, hx: 0.6, hz: 0.5 }),
        o.push({
          pos: new $.Vector3(H, 0, N + 1.2),
          radius: 1.6,
          label: S === 0 ? `Try ${T.name} \u2014 live demo` : `Try ${T.name}`,
          action: "agent",
          payload: T.id,
          obj: M,
        }));
    });
    let L = ua(
      Ba(
        "WHAT IT DOES",
        (b?.skills || ["Fast", "Accurate", "Always on"])
          .slice(0, 4)
          .map((T) => [T, "\u2713"])
          .concat([["Price", `$${b?.price ?? 0}`]]),
        t.primary,
        t.secondary,
      ),
      2.6,
      2.4,
    );
    (L.position.set(-s / 2 + 0.04, 2.2, 1.8), (L.rotation.y = Math.PI / 2), r.add(L));
    let E = new $.Group();
    (st(E, 2.4, 0.45, 0.9, 0, 0.3, 0, et(t.secondary, 0.9)),
      st(E, 2.4, 0.6, 0.2, 0, 0.75, -0.35, et(t.secondary, 0.9)),
      E.position.set(-5.8, 0, 3.6),
      (E.rotation.y = Math.PI / 2),
      r.add(E),
      n.push({ x: -5.8, z: 3.6, hx: 0.6, hz: 1.3 }));
  } else if (t.kind === "service") {
    let b = e.gigs.find((E) => E.id === t.refId) || t.item,
      w = ua(
        Ba(
          "PACKAGES",
          (b?.packages || []).map((E) => [`${E.tier} \xB7 ${E.days} days`, `$${E.price}`]),
          t.primary,
          t.secondary,
        ),
        3.4,
        2.2,
      );
    (w.position.set(4.2, 2.2, -l / 2 + 0.05),
      r.add(w),
      o.push({
        pos: new $.Vector3(4.2, 0, -4.6),
        radius: 1.9,
        label: "See packages & order",
        action: "shopview",
        payload: p,
        obj: w,
      }));
    for (let [E, T] of [
      [2, 1.2],
      [5.2, 1.2],
    ]) {
      let S = new $.Group();
      (S.position.set(E, 0, T), st(S, 1.8, 0.05, 0.9, 0, 0.76, 0, et("#e8e2d6", 0.6)));
      for (let B of [-0.8, 0.8]) st(S, 0.05, 0.76, 0.8, B, 0.38, 0, et("#2b2b2b", 0.5, 0.5));
      let H = qs();
      (H.position.set(0, 0.79, 0), S.add(H));
      let N = Eo(et("#2b2b2b", 0.7));
      (N.position.set(0, 0, 0.8),
        (N.rotation.y = Math.PI),
        S.add(N),
        r.add(S),
        n.push({ x: E, z: T, hx: 1, hz: 0.5 }));
    }
    let L = ua(
      b0({
        kicker: "Recent work",
        title: b?.title.replace(/^I will /, "") || "Portfolio",
        body: b ? `${b.orders} orders \xB7 \u2605 ${b.rating}` : "",
        color: t.secondary,
        w: 768,
        h: 512,
      }),
      3,
      2,
    );
    (L.position.set(-s / 2 + 0.04, 2.2, 2), (L.rotation.y = Math.PI / 2), r.add(L));
  } else if (t.kind === "brand") {
    let b = e.brands.find((H) => H.id === t.refId) || t.item,
      w = et("#efefef", 0.5),
      L = et("#8a6446", 0.7);
    for (let H of [-1, 1]) {
      let N = H * (s / 2 - 0.5);
      for (let B = 0; B < 3; B++) st(r, 0.8, 0.05, 6, N, 0.8 + B * 0.9, 1.2, w);
      (st(r, 0.05, 3, 6, H * (s / 2 - 0.05), 1.5, 1.2, L), n.push({ x: N, z: 1.2, hx: 0.5, hz: 3 }));
    }
    let E = b?.products || [];
    E.slice(0, 6).forEach((H, N) => {
      let B = N % 2 ? 1 : -1,
        X = -0.6 + Math.floor(N / 2) * 1.8,
        M = pd(H);
      (M.scale.setScalar(0.55), M.position.set(B * (s / 2 - 0.55), 1.7, X), r.add(M));
      let _ = ua(
        Ba(H.name.toUpperCase().slice(0, 16), [["Price", `$${H.price}`]], "#ffffff", "#111111"),
        0.7,
        0.32,
      );
      (_.position.set(B * (s / 2 - 0.95), 1.2, X),
        (_.rotation.y = (-B * Math.PI) / 2),
        r.add(_),
        o.push({
          pos: new $.Vector3(B * (s / 2 - 1.8), 0, X),
          radius: 1.3,
          label: `${H.name} \xB7 $${H.price}`,
          action: "product",
          payload: `${b.id}|${H.id}`,
          obj: M,
        }));
    });
    let T = new $.Group();
    (T.position.set(2.2, 0, 0.6),
      st(T, 2.6, 0.9, 1.4, 0, 0.45, 0, L),
      r.add(T),
      n.push({ x: 2.2, z: 0.6, hx: 1.5, hz: 0.9 }),
      E.slice(0, 2).forEach((H, N) => {
        let B = pd(H);
        (B.scale.setScalar(0.7),
          B.position.set(1.6 + N * 1.2, 1.05, 0.6),
          (B.userData.turn = !0),
          r.add(B),
          i.push(B),
          o.push({
            pos: new $.Vector3(1.6 + N * 1.2, 0, 1.8),
            radius: 1.2,
            label: `${H.name} \xB7 $${H.price}`,
            action: "product",
            payload: `${b.id}|${H.id}`,
            obj: B,
          }));
      }));
    let S = new $.Mesh(
      new $.PlaneGeometry(1.2, 2.2),
      new $.MeshStandardMaterial({ color: "#cfd8df", metalness: 1, roughness: 0.05 }),
    );
    (S.position.set(5.5, 1.3, -l / 2 + 0.05), r.add(S));
  } else if (t.kind === "game") {
    let b = tn.find((S) => S.id === t.refId),
      w = b?.ready ? "play" : "vote",
      L = b?.ready ? `Play ${b.name}` : `${b?.name} \u2014 vote to build it next`;
    if (t.refId === "race" || t.refId === "kart") {
      let S = Rr("sports", t.refId === "kart" ? "#f1c40f" : "#c0392b");
      (S.position.set(2.5, 0, 0.5),
        (S.rotation.y = -0.6),
        r.add(S),
        n.push({ x: 2.5, z: 0.5, hx: 1.6, hz: 1.6 }),
        o.push({
          pos: new $.Vector3(2.5, 0, 2.6),
          radius: 2,
          label: L,
          action: w,
          payload: t.refId,
          obj: S,
        }));
      for (let H = 0; H < 2; H++) {
        let N = new $.Group();
        (N.position.set(-1 + H * 1.8 - 1, 0, -4.4),
          st(N, 0.7, 0.5, 1.1, 0, 0.25, 0.2, et("#111", 0.5)),
          st(N, 0.7, 0.8, 0.15, 0, 0.8, 0.7, et("#c0392b", 0.6)));
        let B = st(
          N,
          1.4,
          0.85,
          0.06,
          0,
          1.4,
          -0.5,
          new $.MeshStandardMaterial({ color: "#000", emissive: "#4da3ff", emissiveIntensity: 0.6 }),
        );
        (N.add(B), r.add(N));
      }
    } else if (t.refId === "hockey") {
      let S = Zx();
      (S.position.set(2, 0, 0.4),
        S.scale.setScalar(1.2),
        r.add(S),
        n.push({ x: 2, z: 0.4, hx: 1.4, hz: 2.2 }),
        o.push({
          pos: new $.Vector3(2, 0, 3.2),
          radius: 1.8,
          label: L,
          action: w,
          payload: t.refId,
          obj: S,
        }));
    } else {
      let S = new $.Group();
      (S.position.set(2, 0, 0.4), st(S, 1.8, 0.8, 1.8, 0, 0.4, 0, et("#5a3f2a", 0.6)));
      let H = st(S, 1.9, 0.05, 1.9, 0, 0.83, 0, et(t.secondary, 0.5));
      (r.add(S),
        n.push({ x: 2, z: 0.4, hx: 1.1, hz: 1.1 }),
        o.push({
          pos: new $.Vector3(2, 0, 2.2),
          radius: 1.8,
          label: L,
          action: w,
          payload: t.refId,
          obj: S,
        }));
    }
    for (let S = 0; S < 3; S++) {
      let H = Gg(["#4da3ff", "#ff9a3c", "#45e0ae"][S]);
      (H.position.set(s / 2 - 0.8, 0, -3.6 + S * 1.6),
        (H.rotation.y = -Math.PI / 2),
        r.add(H),
        n.push({ x: s / 2 - 0.8, z: -3.6 + S * 1.6, hx: 0.6, hz: 0.6 }),
        b?.ready &&
          o.push({
            pos: new $.Vector3(s / 2 - 2, 0, -3.6 + S * 1.6),
            radius: 1,
            label: L,
            action: "play",
            payload: t.refId,
            obj: H,
          }));
    }
    let E = ua(
      Ba(
        "TOP SCORES",
        [
          ["You", String(e.gameBest[t.refId] ?? "\u2014")],
          ["Kai B.", "1,240"],
          ["Zara M.", "1,105"],
          ["Leo C.", "980"],
        ],
        "#111827",
        t.secondary,
      ),
      2.6,
      2.1,
    );
    (E.position.set(-s / 2 + 0.04, 2.3, 1.6), (E.rotation.y = Math.PI / 2), r.add(E));
    let T = new $.PointLight(t.secondary, 0.9, 14);
    (T.position.set(0, 3, 0), r.add(T));
  } else if (t.kind === "cafe") {
    let b = jl[t.refId] || jl.orbit,
      w = ua(
        Ba(
          "MENU",
          b.map(([T, S]) => [T, "$" + S]),
          t.primary,
          t.secondary,
        ),
        3,
        2.6,
      );
    (w.position.set(-4.6, 2.6, -l / 2 + 0.05),
      r.add(w),
      o.push({
        pos: new $.Vector3(-4.6, 0, -3),
        radius: 1.8,
        label: "See the menu and order",
        action: "menu",
        payload: p,
        obj: w,
      }));
    let L = st(r, 0.8, 0.6, 0.5, -3.6, 1.36, -4.5, et("#9aa0a6", 0.3, 0.8)),
      E = et("#8a6446", 0.6);
    for (let [T, S] of [
      [1.5, -1.5],
      [4.5, -1.5],
      [1.5, 2],
      [4.5, 2],
      [-3, 2.6],
    ]) {
      let H = Ri(E);
      (H.position.set(T, 0, S), r.add(H));
      for (let N of [0, Math.PI]) {
        let B = Eo(E);
        (B.position.set(T + Math.sin(N) * 0.8, 0, S + Math.cos(N) * 0.8),
          (B.rotation.y = N + Math.PI),
          r.add(B));
      }
      n.push({ x: T, z: S, hx: 0.6, hz: 1.1 });
    }
  } else if (t.kind === "dream" && t.refId === "motors")
    Xr.filter((w) => w.price > 0)
      .slice(0, 6)
      .forEach((w, L) => {
        let E = -5 + (L % 3) * 5,
          T = L < 3 ? -2.6 : 2.2,
          S = new $.Mesh(new $.CylinderGeometry(2.4, 2.4, 0.12, 40), et("#2b2e33", 0.3, 0.6));
        (S.position.set(E, 0.06, T), r.add(S));
        let H = Rr(w.body, w.color, !!w.fly);
        (H.scale.setScalar(0.82), H.position.set(E, 0.12, T), (H.rotation.y = 0.6 + L), r.add(H), i.push(H));
        let N = ua(
          Ba(
            w.name.toUpperCase(),
            [
              ["Price", "$" + w.price.toLocaleString("en-US")],
              ["Top speed", Math.round(w.top * 3.6) + " km/h"],
            ],
            "#111",
            "#ffffff",
          ),
          1.3,
          0.62,
        );
        (N.position.set(E, 0.75, T + 2.45),
          r.add(N),
          n.push({ x: E, z: T, hx: 2.1, hz: 2.1 }),
          o.push({
            pos: new $.Vector3(E, 0, T + 2.9),
            radius: 1.5,
            label: `${w.name} \xB7 $${w.price.toLocaleString("en-US")}`,
            action: "car",
            payload: w.id,
            obj: H,
          }));
      });
  else if (t.kind === "dream")
    Qn.filter((b) => b.price > 0)
      .slice(0, 5)
      .forEach((b, w) => {
        let L = -5.2 + (w % 3) * 5.2,
          E = w < 3 ? -2.4 : 2.4,
          T = st(r, 2.4, 0.9, 2.4, L, 0.45, E, et("#efefef", 0.5)),
          S = new $.Group(),
          H = 0.3 + b.floors * 0.18,
          N = st(S, 1.3, H, 1.1, 0, H / 2, 0, et(b.theme, 0.7));
        if (b.style === "dome") {
          let M = new $.Mesh(
            new $.SphereGeometry(0.7, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
            et("#a9c4d6", 0.1, 0.6),
          );
          ((M.position.y = H), S.add(M));
        } else if (b.style === "pyramid") {
          let M = new $.Mesh(new $.ConeGeometry(0.95, 0.9, 4), et(b.theme, 0.6));
          ((M.position.y = H + 0.45), (M.rotation.y = Math.PI / 4), S.add(M));
        } else {
          let M = st(S, 1.4, 0.06, 1.2, 0, H + 0.03, 0, et("#5a4636", 0.8));
        }
        let B = st(S, 2.2, 0.03, 2.2, 0, 0.015, 0, et("#5f8a3e", 1));
        (S.position.set(L, 0.9, E), r.add(S), i.push(S));
        let X = ua(
          Ba(
            b.name.toUpperCase(),
            [
              ["Price", "$" + b.price.toLocaleString("en-US")],
              ["Floors", String(b.floors)],
            ],
            t.primary,
            t.secondary,
          ),
          1.4,
          0.65,
        );
        (X.position.set(L, 0.6, E + 1.23),
          r.add(X),
          n.push({ x: L, z: E, hx: 1.3, hz: 1.3 }),
          o.push({
            pos: new $.Vector3(L, 0, E + 2),
            radius: 1.4,
            label: `${b.name} \xB7 $${b.price.toLocaleString("en-US")}`,
            action: "home",
            payload: b.id,
            obj: S,
          }));
      });
  else {
    let b = ua(
      Ba(
        "FOR RENT",
        [
          ["Size", "12 \xD7 12 m"],
          ["Rent", "Free at launch"],
          ["Includes", "Sign + stats board"],
        ],
        "#ffffff",
        "#c0392b",
      ),
      3.4,
      2.1,
    );
    (b.position.set(0, 2.2, -l / 2 + 0.05),
      r.add(b),
      o.push({
        pos: new $.Vector3(0, 0, -3.4),
        radius: 2.2,
        label: "Open your shop here",
        action: "openshop",
        payload: p,
        obj: b,
      }));
    for (let w = 0; w < 4; w++)
      st(r, 0.6, 0.6, 0.6, -5 + w * 0.7, 0.3 + (w % 2) * 0.6, -5.5, et("#b08a5a", 0.9));
  }
  let k = [];
  if (t.kind !== "vacant") {
    let b = t.kind === "agent" ? e.agents.find((S) => S.id === t.refId) : null,
      w = t.kind === "service" ? e.gigs.find((S) => S.id === t.refId) : null,
      L = t.kind === "brand" ? e.brands.find((S) => S.id === t.refId) : null,
      E = b
        ? `The shop sells the AI agent "${b.name}" ($${b.price}): ${b.tagline}. Visitors can try a free live demo at the kiosk and buy it with their Fyrus wallet.`
        : w
          ? `The shop offers the AI service "${w.title}" with packages ${w.packages.map((S) => `${S.tier} $${S.price} in ${S.days} days`).join(", ")}.`
          : L
            ? `The shop sells: ${L.products.map((S) => `${S.name} $${S.price}`).join(", ")}. ${L.tagline}.`
            : t.kind === "game"
              ? `This is the ${t.name} game room. ${tn.find((S) => S.id === t.refId)?.ready ? "The game is free to play: walk to the machine and press E." : "The game is coming soon; visitors can vote for it."}`
              : t.kind === "dream" && t.refId === "motors"
                ? `This is Fyrus Motors, a car showroom. Cars (paid in Fyrus Coin, FYC): ${Xr.filter(
                    (S) => S.price,
                  )
                    .map((S) => `${S.name} ${S.price} FYC${S.fly ? " (flies)" : ""}`)
                    .join(", ")}. Customers can take a free test drive.`
                : t.kind === "dream"
                  ? `This is Skyline Realty. Homes for sale (paid in Fyrus Coin, FYC): ${Qn.filter(
                      (S) => S.price,
                    )
                      .map((S) => `${S.name} ${S.price} FYC`)
                      .join(", ")}. Buying one rebuilds the customer's home in the city.`
                  : `This is ${t.name}, a food shop. Menu: ${(jl[t.refId] || jl.orbit).map(([S, H]) => `${S} $${H}`).join(", ")}.`,
      T = (t.slot * 7 + t.name.length) % 6;
    k.push({
      id: `keeper:${p}`,
      name: v,
      role: `${t.name} \xB7 shop assistant`,
      x: -4.6,
      z: -5.4,
      wander: 0,
      outfit: {
        skin: la[T],
        hair: ["short", "long", "bun", "cap", "short", "long"][T],
        hairColor: ["#2a1a12", "#111", "#6b4423", "#c9a46a", "#3a2a1a", "#1a1a1a"][T],
        top: t.primary,
        bottom: "#2b2f36",
        shoes: "#efefef",
      },
      persona: `You are ${v}, the shop assistant at "${t.name}" in Fyrus Market, Fyrus City (2040). ${E} Be warm, brief and helpful, like a real shop assistant. Suggest what to try or buy.`,
      greeting:
        t.kind === "cafe"
          ? `Welcome to ${t.name}! What can I get you?`
          : t.kind === "game"
            ? "Hey! Ready to play?"
            : `Hi, welcome to ${t.name}! Looking for anything special?`,
      quick:
        t.kind === "agent"
          ? ["What does it do?", "Can I try it?", "Is it worth the price?"]
          : t.kind === "service"
            ? ["Which package fits me?", "How fast is delivery?", "Can I see examples?"]
            : t.kind === "brand"
              ? ["What is popular?", "Any deals today?", "Tell me about the brand"]
              : t.kind === "game"
                ? ["How do I play?", "Any tips?", "What is the high score?"]
                : ["What do you recommend?", "Anything sweet?", "Best seat?"],
    });
  }
  return {
    group: r,
    interacts: o,
    bounds: { hx: s / 2 - 0.5, hz: l / 2 - 0.4 },
    spawn: new $.Vector3(0, 0, l / 2 - 1.6),
    npcs: k,
    dancers: [],
    blocks: n,
    stat: { mat: f, sig: "" },
    tick: (b) => i.forEach((w) => (w.rotation.y += b * 0.6)),
  };
}
function n7() {
  let t = new $.Group(),
    e = [],
    a = [],
    r = 36,
    o = 30,
    n = 9;
  er(t, r, o, n, "#15161b", "#0e0f13", "dark", 0.22);
  let i = [],
    s = 8,
    l = 1.5;
  for (let E = 0; E < s; E++)
    for (let T = 0; T < s; T++) {
      let S = new $.MeshStandardMaterial({
        color: "#0a0a0a",
        emissive: "#ff3cac",
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      i.push(S);
      let H = new $.Mesh(new $.BoxGeometry(l - 0.06, 0.06, l - 0.06), S);
      (H.position.set((E - s / 2 + 0.5) * l, 0.03, (T - s / 2 + 0.5) * l + 1), t.add(H));
    }
  let c = new $.Group();
  (c.position.set(0, 0, -10), t.add(c), st(c, 5, 1.2, 1.4, 0, 0.6, 0, et("#1c1c22", 0.4, 0.5)));
  let d = new $.MeshStandardMaterial({ color: "#000", emissive: "#4da3ff", emissiveIntensity: 1.2 });
  st(c, 5.02, 0.08, 1.42, 0, 0.9, 0, d);
  for (let E of [-1.2, 1.2]) {
    let T = new $.Mesh(new $.CylinderGeometry(0.35, 0.35, 0.04, 24), et("#333", 0.3, 0.6));
    (T.position.set(E, 1.23, 0), c.add(T));
  }
  (st(t, 6, 0.4, 3, 0, 0.2, -11, et("#222", 0.6)), a.push({ x: 0, z: -10.5, hx: 3, hz: 1.5 }));
  let h = new $.Mesh(
    new $.PlaneGeometry(14, 5),
    new $.MeshStandardMaterial({ color: "#000", emissive: "#ffffff", emissiveIntensity: 1 }),
  );
  (h.position.set(0, 5.4, -o / 2 + 0.06), t.add(h));
  let u = document.createElement("canvas");
  ((u.width = 1024), (u.height = 366));
  let p = u.getContext("2d"),
    v = new $.CanvasTexture(u);
  ((h.material.emissiveMap = v), (h.material.map = v));
  for (let E of [-6, 6]) {
    let T = new $.Group();
    st(T, 1.4, 2.6, 1.2, 0, 1.3, 0, et("#111", 0.6));
    for (let S of [0.7, 1.9]) {
      let H = new $.Mesh(new $.CircleGeometry(0.42, 20), et("#2b2b2b", 0.4));
      (H.position.set(0, S, 0.61), T.add(H));
    }
    (T.position.set(E, 0, -11), t.add(T), a.push({ x: E, z: -11, hx: 0.8, hz: 0.7 }));
  }
  e.push({
    pos: new $.Vector3(0, 0, -7.6),
    radius: 2.2,
    label: "Dance floor \u2014 press 2 to dance",
    action: "dance",
    obj: c,
  });
  let g = new $.Group();
  (g.position.set(-13.6, 0, 3),
    t.add(g),
    st(g, 1.2, 1.1, 10, 0, 0.55, 0, et("#2a1d14", 0.5, 0.2)),
    st(g, 1.4, 0.06, 10.2, 0, 1.13, 0, et("#d9d4cc", 0.2, 0.2)),
    st(
      g,
      1.22,
      0.06,
      10,
      0.02,
      0.15,
      0,
      new $.MeshStandardMaterial({ color: "#000", emissive: "#ff9a3c", emissiveIntensity: 0.9 }),
    ),
    a.push({ x: -13.6, z: 3, hx: 1.1, hz: 5.2 }));
  let m = st(t, 0.4, 2.4, 9, -r / 2 + 0.25, 2.2, 3, et("#1b1b1f", 0.6));
  for (let E = 0; E < 18; E++) {
    let T = new $.Mesh(
      new $.CylinderGeometry(0.07, 0.08, 0.36, 8),
      new $.MeshStandardMaterial({
        color: ["#2e7d32", "#6d4c41", "#b0bec5", "#c62828", "#f9a825"][E % 5],
        roughness: 0.1,
        metalness: 0.2,
        transparent: !0,
        opacity: 0.85,
      }),
    );
    (T.position.set(-r / 2 + 0.35, 1.4 + Math.floor(E / 9) * 0.9 + 0.18, -1 + (E % 9) * 0.95), t.add(T));
  }
  for (let E = 0; E < 6; E++) {
    let T = new $.Group(),
      S = new $.Mesh(new $.CylinderGeometry(0.28, 0.28, 0.08, 16), et("#8b1e3f", 0.6));
    S.position.y = 0.8;
    let H = new $.Mesh(new $.CylinderGeometry(0.04, 0.04, 0.8, 8), et("#aaa", 0.3, 0.8));
    ((H.position.y = 0.4), T.add(S, H), T.position.set(-12.2, 0, -0.8 + E * 1.5), t.add(T));
  }
  let f = ua(
    Ba(
      "BAR",
      [
        ["Blue Orbit", "$9"],
        ["Ember Spritz", "$8"],
        ["Marina Fizz", "$8"],
        ["Zero-proof", "$6"],
      ],
      "#0d0d12",
      "#ff9a3c",
    ),
    3,
    2.4,
  );
  (f.position.set(-r / 2 + 0.5, 5.4, 3), (f.rotation.y = Math.PI / 2), t.add(f));
  for (let E = 0; E < 3; E++) {
    let T = new $.Group();
    (st(T, 3, 0.45, 1, 0, 0.3, 0, et("#3d2a5c", 0.9)),
      st(T, 3, 0.7, 0.25, 0, 0.8, -0.4, et("#3d2a5c", 0.9)),
      T.position.set(r / 2 - 1.4, 0, -6 + E * 6),
      (T.rotation.y = -Math.PI / 2),
      t.add(T));
    let S = Ri(et("#111", 0.3, 0.6), 0.45, 0.45);
    (S.position.set(r / 2 - 3, 0, -6 + E * 6),
      t.add(S),
      a.push({ x: r / 2 - 1.6, z: -6 + E * 6, hx: 0.8, hz: 1.6 }));
  }
  let y = [],
    x = [];
  ["#ff3cac", "#4da3ff", "#45e0ae", "#ffc27a"].forEach((E, T) => {
    let S = new $.SpotLight(E, 3, 30, 0.35, 0.5, 1.2);
    (S.position.set(-7 + T * 4.6, n - 0.4, -4),
      S.target.position.set(0, 0, 1),
      t.add(S, S.target),
      y.push(S));
    let H = new $.Mesh(
      new $.ConeGeometry(1.6, n - 0.5, 20, 1, !0),
      new $.MeshBasicMaterial({
        color: E,
        transparent: !0,
        opacity: 0.08,
        blending: $.AdditiveBlending,
        depthWrite: !1,
        side: $.DoubleSide,
      }),
    );
    (H.position.copy(S.position), t.add(H), x.push(H));
  });
  let k = new $.Mesh(
    new $.IcosahedronGeometry(0.6, 2),
    new $.MeshStandardMaterial({ color: "#ddd", metalness: 1, roughness: 0.1, flatShading: !0 }),
  );
  (k.position.set(0, n - 1.2, 1), t.add(k));
  let b = wp
      .filter((E) => E.scene === "club")
      .map((E) => (E.id === "lumen" ? { ...E, x: 0, z: -11.2 } : { ...E, x: -15, z: 3 })),
    w = [];
  for (let E = 0; E < 16; E++) {
    let T = E * 2.4;
    w.push({ x: Math.cos(T) * (1.5 + (E % 4) * 1.2), z: 1 + Math.sin(T) * (1.5 + (E % 3) * 1.3) });
  }
  for (let E = 0; E < 4; E++) w.push({ x: -12.2 + 0.6, z: -0.8 + E * 3 });
  let L = 0;
  return {
    group: t,
    interacts: e,
    bounds: { hx: r / 2 - 0.6, hz: o / 2 - 0.4 },
    spawn: new $.Vector3(0, 0, o / 2 - 2),
    npcs: b,
    dancers: w,
    blocks: a,
    tick: (E, T) => {
      let S = T * 2.07;
      if (
        (i.forEach((H, N) => {
          let B = Math.floor(N / s),
            X = N % s,
            M = Math.sin(B * 0.9 + S * 3.1) * Math.cos(X * 0.8 - S * 2.3);
          (H.emissive.setHSL(((B + X) * 0.05 + T * 0.06) % 1, 0.9, 0.5),
            (H.emissiveIntensity = 0.25 + Math.max(0, M) * 1.2));
        }),
        y.forEach((H, N) => {
          let B = T * (0.6 + N * 0.15) + N;
          (H.target.position.set(Math.sin(B) * 6, 0, 1 + Math.cos(B * 1.3) * 5),
            x[N].lookAt(H.target.position),
            x[N].rotateX(-Math.PI / 2),
            x[N].position.copy(H.position).lerp(H.target.position, 0.5));
        }),
        (k.rotation.y += E * 0.8),
        d.emissive.setHSL((T * 0.1) % 1, 0.9, 0.55),
        T - L > 0.06)
      ) {
        L = T;
        let H = p;
        ((H.fillStyle = "#05050a"), H.fillRect(0, 0, 1024, 366));
        for (let N = 0; N < 48; N++) {
          let B = 30 + Math.abs(Math.sin(T * 5 + N * 0.5) * Math.cos(T * 3 + N * 0.13)) * 260;
          ((H.fillStyle = `hsl(${(N * 7 + T * 40) % 360},90%,55%)`), H.fillRect(16 + N * 21, 350 - B, 15, B));
        }
        ((H.fillStyle = "#fff"),
          (H.font = '400 120px "Bebas Neue", Impact, sans-serif'),
          (H.textAlign = "center"),
          H.fillText("SKYLINE CLUB", 512, 150),
          (H.font = '600 34px "Plus Jakarta Sans", sans-serif'),
          H.fillText("DJ LUMEN \xB7 LIVE", 512, 200),
          (H.textAlign = "left"),
          (v.needsUpdate = !0));
      }
    },
  };
}
function i7(t, e) {
  let a = new $.Group(),
    r = [],
    o = [],
    n = t.users.find((S) => S.id === e),
    i = n.home,
    s = 22,
    l = 20,
    c = 5.2,
    d = i.floor === "marble" ? "tile" : i.floor === "grid" ? "concrete" : "wood";
  er(a, s, l, c, "#f1ede6", d === "wood" ? "#9a7450" : d === "tile" ? "#e9e6e0" : "#bdb8ae", d, 1);
  let h = new $.Mesh(new $.PlaneGeometry(s, c), et(i.theme, 0.9));
  (h.position.set(0, c / 2, -l / 2 + 0.02), a.add(h));
  let u = Ba(
      n.name.toUpperCase(),
      [
        [n.title, ""],
        [`${n.followers.toLocaleString("en-US")} followers`, `\u2605 ${n.rating}`],
      ],
      "#ffffff",
      "#111111",
    ),
    p = ua(u, 3.2, 1.6);
  (p.position.set(-s / 2 + 0.04, 2.4, -5), (p.rotation.y = Math.PI / 2), a.add(p));
  let v = t.homeSlots[e] || [],
    g = v.find((S) => S.kind === "video"),
    m = g && t.videos.find((S) => S.id === g.itemId),
    f,
    y,
    x;
  if (m?.src)
    ((f = document.createElement("video")),
      (f.src = m.src),
      (f.loop = !0),
      (f.muted = !0),
      (f.playsInline = !0),
      f.play().catch(() => {}),
      (x = new $.MeshBasicMaterial({ map: new $.VideoTexture(f) })));
  else {
    let S = document.createElement("canvas");
    ((S.width = 640), (S.height = 360));
    let H = new $.CanvasTexture(S);
    ((y = { ctx: S.getContext("2d"), tex: H, title: m?.title || "No video yet", hue: m?.hue ?? 210 }),
      (x = new $.MeshBasicMaterial({ map: H })));
  }
  let k = new $.Mesh(new $.PlaneGeometry(6.4, 3.6), x);
  (k.position.set(0, 2.7, -l / 2 + 0.08),
    a.add(k),
    st(a, 6.7, 3.9, 0.08, 0, 2.7, -l / 2 + 0.04, et("#111", 0.4, 0.5)),
    st(a, 5, 0.5, 0.6, 0, 0.25, -l / 2 + 0.5, et("#3a3a3a", 0.6)),
    o.push({ x: 0, z: -l / 2 + 0.5, hx: 2.6, hz: 0.5 }),
    m &&
      r.push({
        pos: new $.Vector3(0, 0, -l / 2 + 2.4),
        radius: 2.2,
        label: `Watch: ${m.title}`,
        action: "video",
        payload: m.id,
        obj: k,
      }));
  let b = new $.Group();
  (st(b, 3.4, 0.45, 1, 0, 0.3, 0, et("#d9d2c5", 0.9)),
    st(b, 3.4, 0.7, 0.25, 0, 0.8, 0.4, et("#d9d2c5", 0.9)),
    b.position.set(0, 0, -3.5),
    a.add(b),
    o.push({ x: 0, z: -3.5, hx: 1.8, hz: 0.6 }),
    v
      .filter((S) => S.kind === "agent")
      .slice(0, 4)
      .forEach((S, H) => {
        let N = t.agents.find((vt) => vt.id === S.itemId);
        if (!N) return;
        let B = -s / 2 + 2.4 + H * 2.6,
          X = 3.2,
          M = new $.Group();
        (M.position.set(B, 0, X),
          (M.rotation.y = 0),
          a.add(M),
          st(M, 0.9, 1, 0.7, 0, 0.5, 0, et("#2b2e33", 0.5, 0.3)));
        let _ = b0({
            kicker: N.ownerId === e ? "AI Agent" : "Affiliate pick",
            title: N.name,
            body: N.tagline,
            color: i.theme,
            footer: `$${N.price}`,
            w: 512,
            h: 640,
          }),
          lt = new $.Mesh(
            new $.PlaneGeometry(0.9, 1.15),
            new $.MeshStandardMaterial({
              map: _,
              emissive: "#ffffff",
              emissiveMap: _,
              emissiveIntensity: 0.6,
            }),
          );
        (lt.position.set(0, 1.62, 0.1),
          (lt.rotation.x = -0.2),
          M.add(lt),
          o.push({ x: B, z: X, hx: 0.55, hz: 0.45 }),
          r.push({
            pos: new $.Vector3(B, 0, X + 1.2),
            radius: 1.4,
            label: `${N.name} \u2014 demo or buy`,
            action: "agent",
            payload: N.id,
            obj: lt,
          }));
      }),
    [
      ...v.filter((S) => S.kind === "gig").slice(0, 3),
      ...v.filter((S) => S.kind === "article").slice(0, 3),
    ].forEach((S, H) => {
      let N = S.kind === "gig",
        B = N ? t.gigs.find((zt) => zt.id === S.itemId) : t.articles.find((zt) => zt.id === S.itemId);
      if (!B) return;
      let X = b0(
          N
            ? {
                kicker: `Service \xB7 ${B.category}`,
                title: B.title,
                body: B.packages.map((zt) => `${zt.tier}: $${zt.price}`).join(`
`),
                color: i.theme,
                w: 512,
                h: 640,
              }
            : {
                kicker: B.kind === "question" ? "Q&A" : "Article",
                title: B.title,
                body: B.body,
                color: "#c0392b",
                w: 512,
                h: 640,
              },
        ),
        M = H < 3 ? 1 : -1,
        _ = -4 + (H % 3) * 3.2,
        lt = M * (s / 2 - 0.05),
        vt = ua(X, 1.8, 2.25);
      (vt.position.set(lt - M * 0.03, 2.3, _),
        (vt.rotation.y = (-M * Math.PI) / 2),
        a.add(vt),
        st(a, 0.04, 2.45, 2, lt, 2.3, _, et("#2b2b2b", 0.5)),
        r.push({
          pos: new $.Vector3(lt - M * 1.4, 0, _),
          radius: 1.4,
          label: N ? `Service: ${B.title.slice(0, 34)}` : `Read: ${B.title.slice(0, 34)}`,
          action: N ? "gig" : "article",
          payload: B.id,
          obj: vt,
        }));
    }));
  let L = [
    [-8.5, -8],
    [8.5, -8],
    [-8.5, 7.5],
    [8.5, 7.5],
    [-4, 7.6],
    [4, 7.6],
  ];
  (t.decor[e] || []).forEach((S, H) => {
    let [N, B] = L[H % L.length],
      X;
    if (S === "sofa") {
      let M = new $.Group();
      (st(M, 2.4, 0.45, 0.9, 0, 0.3, 0, et(i.theme, 0.9)),
        st(M, 2.4, 0.6, 0.22, 0, 0.75, -0.35, et(i.theme, 0.9)),
        (X = M));
    } else if (S === "arcade") X = Gg(i.accent || "#ff9a3c");
    else if (S === "fish") {
      let M = new $.Group();
      st(M, 1.8, 0.8, 0.7, 0, 0.4, 0, et("#2b2b2b", 0.6));
      let _ = new $.Mesh(
        new $.BoxGeometry(1.8, 1, 0.7),
        new $.MeshStandardMaterial({ color: "#6fb7d9", transparent: !0, opacity: 0.45, roughness: 0.05 }),
      );
      ((_.position.y = 1.3), M.add(_), (X = M));
    } else if (S === "neon") {
      let M = ua(Ba(n.name.split(" ")[0].toUpperCase(), [], "#111", i.accent || "#ff9a3c"), 1.6, 0.4);
      ((M.position.y = 2.6), (X = new $.Group()), X.add(M));
    } else X = ls();
    (X.position.set(N, 0, B),
      B < 0 ? (X.rotation.y = 0) : (X.rotation.y = Math.PI),
      a.add(X),
      o.push({ x: N, z: B, hx: 0.9, hz: 0.6 }));
  });
  let E = new $.Mesh(new $.CylinderGeometry(1.6, 1.7, 0.2, 32), et("#2b2b2b", 0.5));
  (E.position.set(7.5, 0.1, -1), a.add(E));
  let T = new $.Mesh(new $.CylinderGeometry(0.02, 0.02, 1.5, 6), et("#888", 0.3, 0.8));
  return (
    T.position.set(7.5, 0.95, -0.4),
    a.add(T),
    r.push({
      pos: new $.Vector3(7.5, 0, -1),
      radius: 1.8,
      label: e === t.session?.userId ? "Go live from home" : "Live corner",
      action: "stage",
      obj: E,
    }),
    {
      group: a,
      interacts: r,
      bounds: { hx: s / 2 - 0.5, hz: l / 2 - 0.4 },
      spawn: new $.Vector3(0, 0, l / 2 - 1.6),
      npcs: [],
      dancers: [],
      blocks: o,
      video: f,
      tv: y,
      tick: (S, H) => {
        if (y) {
          let N = y.ctx,
            B = N.createLinearGradient(0, 0, 640, 360);
          (B.addColorStop(0, `hsl(${y.hue},45%,${22 + Math.sin(H) * 4}%)`),
            B.addColorStop(1, `hsl(${(y.hue + 40) % 360},50%,12%)`),
            (N.fillStyle = B),
            N.fillRect(0, 0, 640, 360),
            (N.fillStyle = "rgba(255,255,255,.9)"),
            (N.font = "700 34px Sora, sans-serif"),
            N.fillText(y.title.slice(0, 30), 30, 300),
            (N.fillStyle = "rgba(255,255,255,.6)"),
            N.fillRect(30, 320, 580, 4),
            (N.fillStyle = "#ff9a3c"),
            N.fillRect(30, 320, (H * 20) % 580, 4),
            (y.tex.needsUpdate = !0));
        }
      },
    }
  );
}
var ui = P(ea(), 1);
var U = P(ea(), 1);
var d7 = new U.CylinderGeometry(0.105, 0.085, 0.88, 10);
d7.translate(0, -0.44, 0);
var h7 = new U.CylinderGeometry(0.112, 0.1, 0.36, 10);
h7.translate(0, -0.18, 0);
var u7 = new U.BoxGeometry(0.15, 0.09, 0.28);
u7.translate(0, -0.9, 0.05);
var qN = new U.CylinderGeometry(0.21, 0.17, 0.62, 14),
  ZN = new U.CylinderGeometry(0.18, 0.2, 0.18, 14),
  p7 = new U.CylinderGeometry(0.07, 0.06, 0.32, 8);
p7.translate(0, -0.16, 0);
var g7 = new U.CylinderGeometry(0.055, 0.045, 0.3, 8);
g7.translate(0, -0.47, 0);
var f7 = new U.CylinderGeometry(0.06, 0.05, 0.3, 8);
f7.translate(0, -0.47, 0);
var m7 = new U.SphereGeometry(0.05, 8, 6);
m7.translate(0, -0.65, 0);
var KN = new U.SphereGeometry(0.125, 24, 18),
  XN = new U.CylinderGeometry(0.05, 0.06, 0.1, 8),
  JN = new U.SphereGeometry(0.135, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
  Kx = new U.SphereGeometry(0.019, 10, 8),
  s7 = new U.SphereGeometry(0.011, 8, 6),
  l7 = new U.SphereGeometry(0.0055, 6, 4),
  QN = new U.CircleGeometry(0.42, 24),
  tR = new U.BoxGeometry(0.62, 0.07, 1.6),
  eR = new U.SphereGeometry(0.1, 6, 4),
  aR = {
    blue: ["#4da3ff", "#a8d8ff"],
    ember: ["#ff9a3c", "#ffc27a"],
    rainbow: ["#4da3ff", "#45e0ae", "#ffc27a", "#ff9a3c", "#ff5d7a"],
  },
  rR = {
    skin: "#e0b593",
    hair: "short",
    hairColor: "#2a1a12",
    top: "#3b5b8a",
    bottom: "#2b303a",
    shoes: "#efefef",
  };
function Vg(t) {
  let e =
    t.gender ||
    (t.hair === "long" ||
    t.hair === "bun" ||
    t.hair === "ponytail" ||
    t.hair === "braids" ||
    t.hair === "hijab"
      ? "f"
      : "m");
  return {
    ...rR,
    gender: e,
    topStyle: "tee",
    bottomStyle: e === "f" && t.topStyle === "dress" ? "skirt" : "jeans",
    face: "oval",
    eyes: "#4a3222",
    brows: "normal",
    beard: "none",
    glasses: "none",
    lips: e === "f" ? "#b5525a" : "#9a5a50",
    height: 1,
    ...t,
  };
}
