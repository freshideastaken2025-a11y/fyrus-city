function H7(t) {
  let e = Ui(t) || Bo[0],
    a = new oe.Group(),
    r = [],
    o = [],
    n = [],
    i = 30,
    s = 26,
    l = 8,
    c = (u, p) => {},
    d = nR(e.id),
    h = (u, p, v) => {
      let g = new oe.MeshStandardMaterial({
          map: d,
          emissiveMap: d,
          emissive: "#ffffff",
          emissiveIntensity: 0.85,
        }),
        m = new oe.Mesh(new oe.PlaneGeometry(u, u * 0.5625), g);
      return (m.position.set(0, p, v), a.add(m), m);
    };
  if (e.kind === "conference") {
    let u = e.id === "grand";
    if (
      ((i = u ? 36 : e.id === "summit" ? 24 : 20),
      (s = u ? 32 : e.id === "summit" ? 20 : 18),
      (l = u ? 10 : 6.5),
      er(
        a,
        i,
        s,
        l,
        u ? "#1d2230" : "#ece8df",
        u ? "#3a2f28" : "#8f8b84",
        u ? "dark" : "wood",
        u ? 0.9 : 1.15,
      ),
      e.id === "summit")
    ) {
      (st(a, 12, 0.08, 3.6, 0, 0.78, 0, et("#5b4030", 0.4)),
        st(a, 11, 0.74, 2.6, 0, 0.37, 0, et("#2b2b2b", 0.6)),
        o.push({ x: 0, z: 0, hx: 6.2, hz: 2 }));
      for (let p = 0; p < 6; p++)
        for (let v of [-1, 1]) {
          let g = Eo(et("#2f4d7a", 0.6));
          (g.position.set(-5 + p * 2, 0, v * 2.4), (g.rotation.y = v > 0 ? Math.PI : 0), a.add(g));
          let m = qs();
          (m.position.set(-5 + p * 2, 0.82, v * 1.2), (m.rotation.y = v > 0 ? Math.PI : 0), a.add(m));
        }
      h(8, 3.3, -s / 2 + 0.06);
    } else if (e.id === "studio") {
      let p = new oe.Mesh(new oe.PlaneGeometry(14, 3.2), et("#fbfbf8", 0.3));
      (p.position.set(0, 2.4, -s / 2 + 0.05), a.add(p), (h(4.2, 2.6, -s / 2 + 0.08).position.x = -5));
      for (let v = 0; v < 6; v++) {
        let g = -6 + (v % 3) * 6,
          m = -1 + Math.floor(v / 3) * 5,
          f = Ri(et("#d8cfbf", 0.5), 0.75, 1);
        (f.position.set(g, 0, m), a.add(f), o.push({ x: g, z: m, hx: 1, hz: 1 }));
        for (let y = 0; y < 4; y++) {
          let x = (y / 4) * Math.PI * 2,
            k = Eo(et(e.color, 0.6));
          (k.position.set(g + Math.cos(x) * 1.5, 0, m + Math.sin(x) * 1.5),
            (k.rotation.y = -x - Math.PI / 2),
            a.add(k));
        }
      }
    } else {
      (st(a, 18, 0.9, 6, 0, 0.45, -s / 2 + 3.5, et("#2a2d35", 0.5)),
        o.push({ x: 0, z: -s / 2 + 3.5, hx: 9, hz: 3 }),
        st(a, 1.6, 1.3, 0.8, 4, 1.55, -s / 2 + 5, et("#c9ccd2", 0.3, 0.6)),
        h(16, 5.6, -s / 2 + 0.08));
      for (let v of [-10, 10]) {
        let g = new oe.Mesh(new oe.BoxGeometry(1.4, 3, 1.2), et("#111", 0.5));
        (g.position.set(v, 2.4, -s / 2 + 2), a.add(g));
      }
      for (let v = 0; v < 7; v++)
        for (let g = 0; g < 12; g++) {
          if (g === 6) continue;
          let m = -14 + g * 2.4 + (g > 6, 0),
            f = -2 + v * 2.2,
            y = Eo(et(e.color, 0.6));
          (y.position.set(m, 0, f), (y.rotation.y = Math.PI), a.add(y));
        }
      for (let v = 0; v < 7; v++)
        (o.push({ x: -7.6, z: -2 + v * 2.2, hx: 7, hz: 0.35 }),
          o.push({ x: 8.4, z: -2 + v * 2.2, hx: 6.2, hz: 0.35 }));
      let p = new oe.Mesh(
        new oe.CircleGeometry(3, 32),
        new oe.MeshStandardMaterial({
          color: "#fff",
          emissive: "#ffe9c4",
          emissiveIntensity: 0.6,
          transparent: !0,
          opacity: 0.35,
        }),
      );
      ((p.rotation.x = -Math.PI / 2), p.position.set(0, 0.92, -s / 2 + 3.5), a.add(p));
    }
    (r.push({
      pos: new oe.Vector3(0, 0, e.id === "grand" ? -s / 2 + 7.5 : -s / 2 + 3),
      radius: 3,
      label: "Stage \u2014 go live to the room",
      action: "stage",
    }),
      n.push(
        Qx(
          "usher-" + e.id,
          e.id === "grand" ? "Usher Rami" : "Host Lea",
          "Event host",
          i / 2 - 3,
          s / 2 - 3,
          "#14202f",
          `You are the host at the ${e.name} in the Fyrus Conference Center. Anyone can book this hall by the hour (${e.hourly} FYC/h) in Events, sell tickets (money is held in Central Bank escrow and released to the host after the event, 90%) or run a free event. Everyone in the room hears each other with proximity voice when their mic is on.`,
          `Welcome to the ${e.name}!`,
          ["How do I book this hall?", "How do tickets work?"],
        ),
      ));
  } else if (e.kind === "lounge") {
    let u = e.id === "rooftop";
    if (
      ((i = u ? 24 : 28),
      (s = u ? 20 : 22),
      (l = u ? 4 : 5.5),
      er(
        a,
        i,
        s,
        l,
        u ? "#0e1424" : "#231a2e",
        u ? "#6b5a4a" : "#2e2433",
        u ? "wood" : "dark",
        u ? 0.85 : 0.75,
      ),
      u)
    ) {
      let m = new oe.Mesh(new oe.PlaneGeometry(i, s), new oe.MeshBasicMaterial({ color: "#0b1a3a" }));
      ((m.rotation.x = Math.PI / 2), (m.position.y = l - 0.02), a.add(m));
      for (let f = 0; f < 40; f++) {
        let y = new oe.Mesh(
          new oe.SphereGeometry(0.04, 4, 4),
          new oe.MeshBasicMaterial({ color: "#ffffff" }),
        );
        (y.position.set((Math.random() - 0.5) * i, l - 0.05, (Math.random() - 0.5) * s), a.add(y));
      }
    }
    (st(a, 9, 1.1, 1.1, 0, 0.55, -s / 2 + 2, et("#3a2a20", 0.5)),
      st(a, 9.2, 0.08, 1.3, 0, 1.12, -s / 2 + 2, et("#d4a64a", 0.3, 0.8)),
      o.push({ x: 0, z: -s / 2 + 2, hx: 4.6, hz: 0.7 }));
    let p = new oe.Mesh(
      new oe.BoxGeometry(9, 0.06, 0.06),
      new oe.MeshStandardMaterial({ color: e.color, emissive: e.color, emissiveIntensity: 1.2 }),
    );
    (p.position.set(0, 0.2, -s / 2 + 2.6), a.add(p));
    let v = ua(
      Ba(
        e.name.toUpperCase(),
        [
          ["Orbit mocktail", "12 FYC"],
          ["Blue hour spritz (0%)", "14 FYC"],
          ["Fyrus cold brew", "9 FYC"],
          ["Mango lassi", "8 FYC"],
        ],
        "#120d1a",
        e.color,
      ),
      5,
      3.4,
    );
    (v.position.set(0, 2.9, -s / 2 + 0.05), a.add(v));
    for (let m = 0; m < 4; m++) {
      let f = m % 2 ? 6 : -6,
        y = m < 2 ? 0 : 6,
        x = new oe.Group();
      (st(x, 3.6, 0.5, 1, 0, 0.3, 0, et(e.color, 0.85)),
        st(x, 3.6, 0.7, 0.25, 0, 0.75, -0.45, et(e.color, 0.85)),
        x.position.set(f, 0, y - 1.3),
        a.add(x));
      let k = x.clone();
      (k.position.set(f, 0, y + 1.3), (k.rotation.y = Math.PI), a.add(k));
      let b = Ri(et("#1a1a1a", 0.3, 0.4), 0.4, 0.7);
      if ((b.position.set(f, 0, y), a.add(b), o.push({ x: f, z: y, hx: 1.9, hz: 1.9 }), u)) {
        let w = new oe.Mesh(
          new oe.ConeGeometry(0.25, 0.5, 8),
          new oe.MeshStandardMaterial({ color: "#ff9a3c", emissive: "#ff7a1a", emissiveIntensity: 1.5 }),
        );
        (w.position.set(f, 0.7, y), a.add(w));
      }
    }
    for (let m of [-i / 2 + 1.2, i / 2 - 1.2]) {
      let f = ls();
      (f.position.set(m, 0, s / 2 - 2), a.add(f));
    }
    let g = [];
    for (let m = 0; m < 6; m++) {
      let f = new oe.Mesh(
        new oe.SphereGeometry(0.25, 12, 8),
        new oe.MeshStandardMaterial({ color: "#ffe0b0", emissive: "#ffb66b", emissiveIntensity: 1 }),
      );
      (f.position.set(-10 + m * 4, l - 0.8, -2), a.add(f), g.push(f));
    }
    ((c = (m, f) => g.forEach((y, x) => (y.material.emissiveIntensity = 0.8 + Math.sin(f * 1.5 + x) * 0.2))),
      r.push({
        pos: new oe.Vector3(0, 0, -s / 2 + 3.4),
        radius: 2.4,
        label: "Bar \u2014 events in this lounge",
        action: "events",
        payload: "upcoming",
      }),
      n.push(
        Qx(
          "bar-" + e.id,
          u ? "Kai" : "Noor",
          "Bartender",
          1.5,
          -s / 2 + 1.2,
          "#1b1424",
          `You run the bar at the ${e.name}. Drinks here are alcohol-free mocktails. Citizens hang out, network and host listening parties; anyone can book the lounge in Events (${e.hourly} FYC/h).`,
          "Welcome in! Mocktail?",
          ["What is on tonight?", "Can I book this lounge?"],
        ),
      ));
  } else {
    ((i = 34),
      (s = 28),
      (l = 9),
      er(a, i, s, l, "#101219", "#1d1f26", "dark", 0.8),
      h(18, 5.2, -s / 2 + 0.08));
    for (let g = 0; g < 2; g++) {
      let m = g ? 5 : -5;
      st(a, 4, 0.8, 2, m, 0.4, -s / 2 + 4, et("#22252e", 0.5));
      let f = Eo(et(e.color, 0.5));
      (f.position.set(m, 0.8, -s / 2 + 4.6),
        (f.rotation.y = Math.PI),
        a.add(f),
        o.push({ x: m, z: -s / 2 + 4, hx: 2, hz: 1 }));
      let y = st(
        a,
        1.8,
        1,
        0.08,
        m,
        1.5,
        -s / 2 + 3.3,
        new oe.MeshStandardMaterial({ color: "#111", emissive: "#4da3ff", emissiveIntensity: 0.7 }),
      );
    }
    let u = [];
    for (let g = 0; g < 3; g++)
      for (let m = 0; m < 8; m++) {
        let f = -12.6 + m * 3.6,
          y = 0 + g * 3;
        st(a, 1.6, 0.06, 0.8, f, 0.75, y, et("#2b2e36", 0.5));
        let x = st(
          a,
          1.2,
          0.7,
          0.05,
          f,
          1.2,
          y - 0.3,
          new oe.MeshStandardMaterial({ color: "#111", emissive: e.color, emissiveIntensity: 0.5 }),
        );
        u.push(x);
        let k = Eo(et(g % 2 ? "#e5484d" : "#2f6fe0", 0.5));
        (k.position.set(f, 0, y + 0.7),
          (k.rotation.y = Math.PI),
          a.add(k),
          o.push({ x: f, z: y, hx: 0.9, hz: 0.5 }));
      }
    let p = i / 2 - 5;
    for (let g of [-1, 1]) {
      let m = g * (i / 4 + 1.25);
      for (let f = 0; f < 3; f++)
        st(a, p, 0.45 * (f + 1), 1.6, m, 0.225 * (f + 1), s / 2 - 5.6 + f * 1.6, et("#2a2d35", 0.7));
      o.push({ x: m, z: s / 2 - 4, hx: p / 2, hz: 2.6 });
    }
    let v = [];
    for (let g of [-s / 2 + 0.2, s / 2 - 0.2]) {
      let m = new oe.MeshStandardMaterial({ color: e.color, emissive: e.color, emissiveIntensity: 1 });
      v.push(m);
      let f = new oe.Mesh(new oe.BoxGeometry(i - 1, 0.12, 0.05), m);
      (f.position.set(0, l - 0.5, g), a.add(f));
    }
    ((c = (g, m) => {
      (u.forEach((f, y) => (f.material.emissiveIntensity = 0.35 + 0.3 * Math.abs(Math.sin(m * 2 + y * 0.7)))),
        v.forEach((f) => f.emissive.setHSL((m * 0.05) % 1, 0.8, 0.5)));
    }),
      r.push({
        pos: new oe.Vector3(0, 0, -s / 2 + 6.8),
        radius: 3,
        label: "Arena stage \u2014 play a game",
        action: "games",
      }),
      r.push({
        pos: new oe.Vector3(-12.6, 0, 1.6),
        radius: 2.2,
        label: "Gaming rig \u2014 play",
        action: "games",
      }),
      n.push(
        Qx(
          "caster",
          "Caster Zed",
          "Arena host",
          i / 2 - 3,
          -s / 2 + 3,
          "#1b1424",
          `You host the Fyrus Gaming Arena. Citizens play Street Race, Fyrus Chess, Four in a Row and more; anyone can book the arena in Events for a watch party or a skill tournament (${e.hourly} FYC/h). Fyrus has no gambling: prizes come from skill, never chance.`,
          "Welcome to the Arena! Ready to play?",
          ["How do tournaments work?", "What can I play here?"],
        ),
      ));
  }
  return (
    r.push({
      pos: new oe.Vector3(-i / 2 + 2.5, 0, s / 2 - 2.5),
      radius: 2,
      label: "Hall info \u2014 book this hall",
      action: "events",
      payload: "book:" + e.id,
    }),
    {
      group: a,
      interacts: r,
      bounds: { hx: i / 2 - 0.6, hz: s / 2 - 0.4 },
      spawn: new oe.Vector3(0, 0, s / 2 - 2),
      npcs: n,
      dancers: [],
      blocks: o,
      tick: c,
    }
  );
}
var se = P(ea(), 1);
var ge = P(ea(), 1);
var N7 = new Map(),
  La = (t, e = 0.75, a = 0) => {
    let r = t + e + a,
      o = N7.get(r);
    return (
      o || ((o = new ge.MeshStandardMaterial({ color: t, roughness: e, metalness: a })), N7.set(r, o)),
      o
    );
  },
  Dg = (t, e) => "#" + new ge.Color(t).multiplyScalar(e).getHexString();
function Vt(t, e, a, r, o, n, i, s) {
  let l = new ge.Mesh(new ge.BoxGeometry(e, a, r), s);
  return (l.position.set(o, n, i), (l.castShadow = !0), (l.receiveShadow = !0), t.add(l), l);
}
function Po(t, e, a, r, o, n, i, s, l = 16) {
  let c = new ge.Mesh(new ge.CylinderGeometry(e, a, r, l), s);
  return (c.position.set(o, n, i), (c.castShadow = !0), t.add(c), c);
}
var Fg = (t, e, a, r, o, n = 0.05) => {
  for (let i of [-1, 1]) for (let s of [-1, 1]) Vt(t, n, r, n, i * (e / 2 - n), r / 2, s * (a / 2 - n), o);
};
function pi(t, e) {
  let a = $i[t],
    r = new ge.Group(),
    o = e || a?.color || "#cccccc",
    n = La(o, 0.85),
    i = La(Dg(o, 0.6), 0.8),
    s = La("#7a5a3c", 0.7),
    l = La("#9aa0a6", 0.35, 0.7);
  switch (t) {
    case "sofa":
      (Vt(r, 2.4, 0.42, 0.9, 0, 0.3, 0, n), Vt(r, 2.4, 0.55, 0.22, 0, 0.75, -0.34, n));
      for (let c of [-1, 1]) Vt(r, 0.2, 0.62, 0.9, c * 1.1, 0.4, 0, i);
      for (let c of [-0.58, 0.58]) Vt(r, 1.05, 0.12, 0.62, c, 0.56, 0.06, La(Dg(o, 1.1), 0.9));
      break;
    case "lsofa":
      (Vt(r, 2.8, 0.42, 0.9, 0, 0.3, -0.65, n),
        Vt(r, 2.8, 0.55, 0.22, 0, 0.75, -1, n),
        Vt(r, 0.9, 0.42, 1.3, 0.95, 0.3, 0.45, n),
        Vt(r, 0.22, 0.55, 2.2, 1.29, 0.75, 0, n),
        Vt(r, 0.2, 0.62, 0.9, -1.3, 0.4, -0.65, i));
      break;
    case "armchair":
      (Vt(r, 0.9, 0.4, 0.85, 0, 0.3, 0, n), Vt(r, 0.9, 0.6, 0.2, 0, 0.75, -0.33, n));
      for (let c of [-1, 1]) Vt(r, 0.15, 0.55, 0.85, c * 0.4, 0.42, 0, i);
      break;
    case "coffee":
      (Vt(r, 1.2, 0.06, 0.7, 0, 0.42, 0, n), Fg(r, 1.2, 0.7, 0.4, i), Vt(r, 1.05, 0.03, 0.55, 0, 0.14, 0, i));
      break;
    case "tv":
      Vt(r, 2, 0.45, 0.45, 0, 0.23, 0, La("#2b2b2b", 0.6));
      {
        let c = Vt(
          r,
          1.7,
          0.98,
          0.05,
          0,
          1,
          -0.08,
          new ge.MeshStandardMaterial({
            color: "#0b0d12",
            emissive: "#3b5b8a",
            emissiveIntensity: 0.35,
            roughness: 0.2,
          }),
        );
        c.name = "screen";
      }
      Vt(r, 0.3, 0.05, 0.2, 0, 0.48, -0.08, l);
      break;
    case "rug": {
      let c = Vt(r, 3, 0.015, 2, 0, 0.008, 0, n);
      ((c.castShadow = !1), (Vt(r, 2.6, 0.017, 1.6, 0, 0.009, 0, La(Dg(o, 1.25), 1)).castShadow = !1));
      break;
    }
    case "rugr": {
      let c = Po(r, 1.1, 1.1, 0.015, 0, 0.008, 0, n, 32);
      ((c.castShadow = !1), (Po(r, 0.8, 0.8, 0.017, 0, 0.009, 0, La(Dg(o, 1.3), 1), 32).castShadow = !1));
      break;
    }
    case "fireplace":
      (Vt(r, 1.8, 1.2, 0.5, 0, 0.6, -0.05, n),
        Vt(r, 2, 0.1, 0.6, 0, 1.25, -0.03, i),
        Vt(r, 0.9, 0.6, 0.3, 0, 0.42, 0.06, La("#1b1b1b", 0.9)));
      {
        let c = new ge.Mesh(
          new ge.ConeGeometry(0.18, 0.4, 8),
          new ge.MeshBasicMaterial({ color: "#ff9a3c" }),
        );
        (c.position.set(0, 0.32, 0.12), (c.name = "fire"), r.add(c));
        let d = new ge.PointLight("#ff9a3c", 0.6, 5, 2);
        (d.position.set(0, 0.6, 0.6), r.add(d));
      }
      break;
    case "bed2":
    case "bed1": {
      let c = t === "bed2" ? 1.8 : 1.1;
      (Vt(r, c, 0.35, 2.1, 0, 0.2, 0, s),
        Vt(r, c - 0.08, 0.22, 2, 0, 0.48, 0.02, La("#f4f1ea", 0.95)),
        Vt(r, c - 0.1, 0.08, 1.3, 0, 0.62, 0.35, n),
        Vt(r, c, 0.9, 0.1, 0, 0.6, -1.03, s));
      for (let d = 0; d < (t === "bed2" ? 2 : 1); d++)
        Vt(r, 0.6, 0.14, 0.38, t === "bed2" ? (d ? 0.42 : -0.42) : 0, 0.66, -0.75, La("#ffffff", 0.95));
      break;
    }
    case "wardrobe":
      (Vt(r, 1.6, 2.1, 0.6, 0, 1.05, 0, n), Vt(r, 0.02, 1.9, 0.01, 0, 1.05, 0.305, i));
      for (let c of [-0.08, 0.08]) Vt(r, 0.03, 0.3, 0.04, c, 1.1, 0.32, l);
      break;
    case "nightstand":
      (Vt(r, 0.5, 0.5, 0.45, 0, 0.25, 0, n),
        Vt(r, 0.44, 0.02, 0.01, 0, 0.32, 0.23, i),
        Po(r, 0.08, 0.1, 0.06, 0, 0.53, 0, l),
        Po(r, 0.02, 0.02, 0.25, 0, 0.68, 0, l));
      {
        let c = Po(
          r,
          0.1,
          0.14,
          0.16,
          0,
          0.85,
          0,
          new ge.MeshStandardMaterial({ color: "#fff4e0", emissive: "#ffd9a0", emissiveIntensity: 0.5 }),
        );
        c.castShadow = !1;
      }
      break;
    case "mirror": {
      Vt(r, 0.8, 1.7, 0.05, 0, 1.25, 0, n);
      let c = Vt(r, 0.68, 1.56, 0.02, 0, 1.25, 0.03, La("#cfe3f2", 0.05, 0.9));
      c.castShadow = !1;
      break;
    }
    case "dining":
      (Vt(r, 1.8, 0.06, 1, 0, 0.75, 0, n), Fg(r, 1.8, 1, 0.72, i, 0.07));
      break;
    case "chair":
      (Vt(r, 0.46, 0.06, 0.46, 0, 0.46, 0, n),
        Vt(r, 0.46, 0.48, 0.05, 0, 0.72, -0.2, n),
        Fg(r, 0.46, 0.46, 0.44, i, 0.035));
      break;
    case "counter":
      (Vt(r, 2.4, 0.88, 0.62, 0, 0.44, 0, n),
        Vt(r, 2.46, 0.05, 0.66, 0, 0.9, 0, La("#3a3d42", 0.3)),
        Vt(r, 0.5, 0.02, 0.36, -0.6, 0.93, 0, l),
        Po(r, 0.02, 0.02, 0.3, -0.6, 1.07, -0.2, l));
      for (let c of [0.4, 0.75]) Po(r, 0.11, 0.11, 0.02, c, 0.93, 0, La("#1b1b1b", 0.5));
      for (let c = 0; c < 4; c++) Vt(r, 0.55, 0.7, 0.01, -0.9 + c * 0.6, 0.44, 0.315, i);
      break;
    case "fridge":
      (Vt(r, 0.78, 1.9, 0.68, 0, 0.95, 0, n),
        Vt(r, 0.76, 0.01, 0.01, 0, 1.25, 0.345, i),
        Vt(r, 0.03, 0.4, 0.04, 0.3, 1.5, 0.36, l),
        Vt(r, 0.03, 0.3, 0.04, 0.3, 0.9, 0.36, l));
      break;
    case "desk": {
      (Vt(r, 1.4, 0.05, 0.7, 0, 0.74, 0, n),
        Fg(r, 1.4, 0.7, 0.72, La("#2b2e33", 0.5, 0.4), 0.04),
        Vt(r, 0.45, 0.02, 0.32, 0, 0.775, 0.05, l));
      let c = Vt(
        r,
        0.45,
        0.3,
        0.015,
        0,
        0.93,
        -0.11,
        new ge.MeshStandardMaterial({ color: "#111", emissive: "#7fb3ff", emissiveIntensity: 0.5 }),
      );
      c.rotation.x = -0.25;
      break;
    }
    case "office":
      (Po(r, 0.3, 0.3, 0.05, 0, 0.06, 0, La("#1b1b1b", 0.6)),
        Po(r, 0.03, 0.03, 0.4, 0, 0.28, 0, l),
        Vt(r, 0.5, 0.08, 0.5, 0, 0.5, 0, n),
        Vt(r, 0.48, 0.6, 0.07, 0, 0.88, -0.23, n));
      break;
    case "shelf": {
      Vt(r, 1.2, 1.9, 0.35, 0, 0.95, 0, n);
      let c = ["#a34a3c", "#3f6f8f", "#d4a64a", "#2f5d50", "#e9e4da", "#5a3f35"];
      for (let d = 0; d < 4; d++) {
        Vt(r, 1.12, 0.03, 0.3, 0, 0.12 + d * 0.46, 0.02, i);
        for (let h = 0; h < 7; h++)
          (h * 7 + d * 3) % 5 !== 0 &&
            Vt(
              r,
              0.12,
              0.3 + ((h + d) % 3) * 0.04,
              0.24,
              -0.45 + h * 0.15,
              0.3 + d * 0.46,
              0.04,
              La(c[(h + d) % c.length], 0.8),
            );
      }
      break;
    }
    case "plant":
    case "plants": {
      let c = t === "plant" ? 1 : 0.5;
      Po(r, 0.26 * c, 0.2 * c, 0.45 * c, 0, 0.22 * c, 0, La("#d8d2c6", 0.8));
      let d = ya(o, 0.42 * c);
      ((d.position.y = 0.32 * c), r.add(d));
      break;
    }
    case "lamp":
      (Po(r, 0.18, 0.2, 0.04, 0, 0.02, 0, l), Po(r, 0.015, 0.015, 1.5, 0, 0.77, 0, l));
      {
        let c = Po(
          r,
          0.15,
          0.24,
          0.3,
          0,
          1.55,
          0,
          new ge.MeshStandardMaterial({
            color: o,
            emissive: "#ffd9a0",
            emissiveIntensity: 0.6,
            roughness: 0.9,
          }),
        );
        c.castShadow = !1;
        let d = new ge.PointLight("#ffe2b8", 0.5, 6, 2);
        ((d.position.y = 1.5), r.add(d));
      }
      break;
    case "art": {
      Vt(r, 1.4, 1, 0.05, 0, 1.6, 0, La("#2b2b2b", 0.5));
      let c = document.createElement("canvas");
      ((c.width = 128), (c.height = 96));
      let d = c.getContext("2d"),
        h = d.createLinearGradient(0, 0, 128, 96);
      (h.addColorStop(0, o),
        h.addColorStop(1, "#2f6fe0"),
        (d.fillStyle = h),
        d.fillRect(0, 0, 128, 96),
        (d.fillStyle = "rgba(255,255,255,.7)"),
        d.beginPath(),
        d.arc(84, 34, 14, 0, 7),
        d.fill(),
        (d.fillStyle = "rgba(0,0,0,.35)"),
        d.beginPath(),
        d.moveTo(0, 96),
        d.lineTo(46, 46),
        d.lineTo(80, 80),
        d.lineTo(104, 58),
        d.lineTo(128, 96),
        d.fill());
      let u = new ge.Mesh(
        new ge.PlaneGeometry(1.28, 0.88),
        new ge.MeshStandardMaterial({ map: new ge.CanvasTexture(c), roughness: 0.7 }),
      );
      (u.position.set(0, 1.6, 0.03), r.add(u));
      break;
    }
    case "aquarium": {
      Vt(r, 1.6, 0.7, 0.6, 0, 0.35, 0, La("#2b2b2b", 0.6));
      let c = new ge.Mesh(
        new ge.BoxGeometry(1.56, 0.7, 0.56),
        new ge.MeshStandardMaterial({ color: o, transparent: !0, opacity: 0.45, roughness: 0.05 }),
      );
      ((c.position.y = 1.06), r.add(c));
      for (let d = 0; d < 5; d++) {
        let h = new ge.Mesh(
          new ge.SphereGeometry(0.05, 8, 6),
          La(["#ff9a3c", "#ffd23f", "#e05a8a"][d % 3], 0.5),
        );
        (h.scale.set(1.6, 1, 0.6),
          h.position.set(-0.6 + d * 0.3, 0.9 + (d % 2) * 0.2, 0),
          (h.name = "fish"),
          r.add(h));
      }
      break;
    }
    case "vase":
      Po(r, 0.1, 0.14, 0.4, 0, 0.2, 0, La("#e9e4da", 0.4));
      for (let c = 0; c < 6; c++) {
        let d = new ge.Mesh(new ge.SphereGeometry(0.07, 8, 6), La(c % 2 ? o : "#ffd23f", 0.7));
        (d.position.set(Math.cos(c) * 0.1, 0.55 + (c % 3) * 0.05, Math.sin(c) * 0.1), r.add(d));
      }
      break;
    case "piano":
      (Vt(r, 1.5, 1.25, 0.55, 0, 0.62, -0.05, n), Vt(r, 1.4, 0.06, 0.25, 0, 0.75, 0.3, La("#f4f1ea", 0.4)));
      for (let c = 0; c < 20; c++) Vt(r, 0.03, 0.03, 0.14, -0.66 + c * 0.07, 0.8, 0.26, La("#111", 0.4));
      Vt(r, 0.8, 0.06, 0.35, 0, 0.48, 0.75, n);
      break;
    case "arcade":
      Vt(r, 0.75, 1.75, 0.7, 0, 0.88, 0, n);
      {
        let c = Vt(
          r,
          0.6,
          0.45,
          0.02,
          0,
          1.35,
          0.33,
          new ge.MeshStandardMaterial({ color: "#111", emissive: "#ff9a3c", emissiveIntensity: 0.6 }),
        );
        c.rotation.x = -0.2;
      }
      (Vt(r, 0.7, 0.08, 0.3, 0, 1, 0.42, La("#1b1b1b", 0.6)),
        Po(r, 0.04, 0.04, 0.05, -0.15, 1.06, 0.42, La("#e53935", 0.4)));
      break;
    case "beanbag": {
      let c = new ge.Mesh(new ge.SphereGeometry(0.48, 16, 12), n);
      (c.scale.set(1, 0.6, 1), (c.position.y = 0.3), (c.castShadow = !0), r.add(c));
      break;
    }
    case "prayer": {
      let c = Vt(r, 0.7, 0.012, 1.2, 0, 0.007, 0, n);
      ((c.castShadow = !1), (Vt(r, 0.5, 0.014, 0.25, 0, 0.008, -0.42, La("#d4a64a", 0.9)).castShadow = !1));
      break;
    }
    default:
      Vt(r, a?.w || 0.6, 0.6, a?.d || 0.6, 0, 0.3, 0, n);
  }
  return ((r.userData.furn = t), r);
}
function R7(t, e) {
  t.traverse((a) => {
    a.name === "fire"
      ? a.scale.set(1, 0.85 + Math.sin(e * 13 + a.id) * 0.15, 1)
      : a.name === "fish" && (a.position.x = Math.sin(e * 0.6 + a.id) * 0.62);
  });
}
var de = (t, e) => new se.Vector3(t, 0, e),
  lc = (t, e, a, r, o, n, i, s, l) => ({
    id: "svc-" + t,
    name: e,
    role: a + " \xB7 AI",
    x: r,
    z: o,
    wander: 0.4,
    outfit: {
      skin: la[(t.length * 5) % la.length],
      hair: ["short", "bun", "long", "buzz"][t.length % 4],
      hairColor: "#2a1a12",
      top: n,
      bottom: "#2b2e33",
      shoes: "#1b1d22",
    },
    persona: i,
    greeting: s,
    quick: l,
  });
function ty(t, e, a, r, o, n = "#4da3ff") {
  for (let i = 0; i < e; i++)
    st(
      t,
      1.6,
      0.95,
      0.06,
      a + i * 1.75,
      r,
      o,
      new se.MeshStandardMaterial({ color: "#0b0d12", emissive: n, emissiveIntensity: 0.35 + (i % 3) * 0.1 }),
    );
}
function Ks(t, e, a, r, o = ["#a34a3c", "#3f6f8f", "#d4a64a", "#2f5d50"], n = 2.4) {
  let i = new se.Group();
  st(i, n, 2, 0.5, 0, 1, 0, et("#efe9df", 0.7));
  for (let s = 0; s < 3; s++)
    for (let l = 0; l < 6; l++)
      st(
        i,
        n / 7,
        0.34,
        0.32,
        -n / 2 + (l + 0.8) * (n / 7),
        0.35 + s * 0.6,
        0.06,
        et(o[(l + s) % o.length], 0.7),
      );
  return (i.position.set(e, 0, a), (i.rotation.y = r), t.add(i), i);
}
function iR(t, e, a) {
  let r = pi("bed1", "#dfe6ee");
  (r.position.set(e, 0, a), t.add(r));
  let o = new se.Mesh(
    new se.PlaneGeometry(2.4, 2.2),
    new se.MeshStandardMaterial({ color: "#9fd3c7", side: se.DoubleSide, transparent: !0, opacity: 0.85 }),
  );
  (o.position.set(e + 1.2, 1.4, a), (o.rotation.y = Math.PI / 2), t.add(o));
}
function B7(t) {
  let e = Nl(t),
    a = new se.Group(),
    r = [],
    o = [],
    n = [],
    i = 22,
    s = 16,
    l = 5,
    c = [],
    d = de(0, 3),
    h = e.job?.stations || [],
    u = (f, y, x = 4, k = "#e9e4da") => {
      (st(a, x, 1.05, 0.9, f, 0.52, y, et(k, 0.5)),
        st(a, x + 0.1, 0.06, 1, f, 1.07, y, et("#3a3d42", 0.4)),
        o.push({ x: f, z: y, hx: x / 2, hz: 0.5 }));
    },
    p = (f, y, x, k, b, w, L = 0, E = e.color) => {
      let T = ua(Ba(f, y, "#14202f", E), w, 0.5 + y.length * (w / 10) + w / 8);
      return (T.position.set(x, k, b), (T.rotation.y = L), a.add(T), T);
    };
  if (e.kind === "civic") {
    if (
      (t === "hospital" &&
        ((i = 26),
        (s = 20),
        er(a, i, s, l, "#eef3f4", "#dfe6ea", "tile", 1.15),
        [-6, -1, 4].forEach((f) => iR(a, f, -7)),
        u(-8, 4, 5, "#ffffff"),
        st(a, 1.2, 1.8, 0.6, 9, 0.9, -9, et("#e5484d", 0.5)),
        st(a, 1, 0.9, 0.6, 6, 0.45, -2, et("#c0c6cc", 0.4, 0.6)),
        p(
          "FYRUS GENERAL HOSPITAL",
          [
            ["Emergency", "24/7"],
            ["Clinics", "9\u20135"],
            ["First aid", "free"],
          ],
          0,
          3.4,
          -s / 2 + 0.05,
          6,
        ),
        (c = [de(-6, -5), de(-1, -5), de(9, -7.6), de(-8, 5.4), de(6, -0.8)]),
        n.push(
          lc(
            "doctor",
            "Dr. Sana",
            "Doctor",
            2,
            -3,
            "#ffffff",
            "You are Dr. Sana, an AI doctor in Fyrus General Hospital (a virtual city game). Give simple, general first-aid and healthy-living tips only, and always say that for real health problems people should see a real doctor or call their local emergency number. Never diagnose.",
            "Hello! I can share first-aid tips. For real medical problems, please see a real doctor.",
            ["First aid for a burn?", "How to stay healthy?"],
          ),
        ),
        n.push(
          lc(
            "nurse",
            "Nurse Bilal",
            "Nurse",
            -7,
            2.6,
            "#9fd3c7",
            "You are Bilal, an AI nurse at the hospital reception in Fyrus (a game). Explain the nurse shift job: start it at the reception, then follow the glowing marker to each task.",
            "Want to help out? Start a nurse shift at reception.",
            ["How do shifts work?"],
          ),
        )),
      t === "police")
    ) {
      ((i = 24),
        (s = 18),
        er(a, i, s, l, "#e6ebf2", "#8f949a", "concrete", 1.1),
        u(-6, 4, 5, "#2f6fe0"),
        ty(a, 5, -4, 2.6, -s / 2 + 0.06),
        ty(a, 5, -4, 1.55, -s / 2 + 0.06, "#45e0ae"),
        Ks(a, 10, 1, -Math.PI / 2, ["#c0c6cc", "#7a5a3c", "#ffd23f"]),
        st(a, 3, 2, 0.1, -9, 1.6, -7, et("#ffffff", 0.6)));
      for (let f of [2, 6]) {
        let y = Ri(et("#e9e4da", 0.5));
        (y.position.set(f, 0, -3), a.add(y));
        let x = qs();
        (x.position.set(f, 0.78, -3), a.add(x));
      }
      (p(
        "FYRUS POLICE \xB7 HELP DESK",
        [
          ["Lost & found", "desk"],
          ["Report a problem", "Report button"],
          ["Emergency (real life)", "call local 112/911"],
        ],
        4,
        3.4,
        -s / 2 + 0.05,
        6,
      ),
        (c = [de(-6, 5.4), de(8.6, 1), de(0, -6.5), de(-9, -5.6), de(5, -2)]),
        n.push(
          lc(
            "officer",
            "Officer Ayesha",
            "Community officer",
            -3,
            2.4,
            "#1b2433",
            "You are Officer Ayesha, a friendly AI community officer in Fyrus (a game). Help with: reporting a player (use the Report button on their profile or chat), lost and found, staying safe online (never share passwords or bank details). Say that real emergencies need the real local emergency number.",
            "Hello! Need help, or want to file a report?",
            ["How do I report someone?", "Online safety tips"],
          ),
        ));
    }
    if (t === "fire") {
      ((i = 26), (s = 20), er(a, i, s, l + 2, "#efe6dc", "#7d7f84", "concrete", 1.1));
      let f = new se.Group();
      (st(f, 2.6, 2.6, 7.5, 0, 1.7, 0, et("#d63a2a", 0.45, 0.2)),
        st(f, 0.5, 0.3, 6.5, 0, 3.2, -0.6, et("#c0c6cc", 0.4, 0.8)),
        f.position.set(0, 0, -1),
        a.add(f),
        o.push({ x: 0, z: -1, hx: 1.5, hz: 4 }));
      for (let x = 0; x < 3; x++) st(a, 0.9, 0.9, 0.3, -10 + x * 1.1, 1.4, -s / 2 + 0.3, et("#c0392b", 0.5));
      (st(
        a,
        1.4,
        1,
        0.1,
        10,
        1.8,
        -s / 2 + 0.06,
        new se.MeshStandardMaterial({ color: "#111", emissive: "#e5484d", emissiveIntensity: 0.5 }),
      ),
        Ks(a, 11, 4, -Math.PI / 2, ["#ffd23f", "#e5484d", "#2b2e33"]));
      let y = new se.Mesh(new se.CylinderGeometry(0.08, 0.08, l + 2, 10), et("#d4a64a", 0.3, 0.9));
      (y.position.set(-9, (l + 2) / 2, 4),
        a.add(y),
        u(-4, 6, 3.5, "#c0392b"),
        (c = [de(-10, -7), de(2.4, -1), de(10, -7.2), de(9.8, 4), de(-9, 5)]),
        n.push(
          lc(
            "chief",
            "Chief Omar",
            "Fire chief",
            4,
            5,
            "#c0392b",
            "You are Chief Omar, an AI fire chief in Fyrus (a game). Share simple fire safety tips (smoke alarms, escape plans, never use lifts in a fire) and say real emergencies need the real local emergency number. Explain the fire crew drill shift.",
            "Safety first! Want to join a fire drill shift?",
            ["Fire safety tips", "How do drills work?"],
          ),
        ));
    }
    if (t === "post") {
      ((i = 22),
        (s = 16),
        er(a, i, s, l, "#f3ead9", "#b5a68f", "wood", 1.1),
        u(0, 3, 6, "#ffd23f"),
        Ks(a, -7, -7, 0, ["#e9e4da", "#d8cfbf", "#c96f4a"]),
        Ks(a, -2, -7, 0, ["#e9e4da", "#d8cfbf", "#c96f4a"]),
        st(a, 1, 0.9, 0.8, 5, 0.45, 1.4, et("#c0c6cc", 0.4, 0.6)),
        st(a, 3, 2.6, 0.1, 9, 1.3, -s / 2 + 0.06, et("#8a9bb0", 0.6)),
        st(a, 1.6, 0.8, 0.8, 3, 0.4, -5, et("#7a5a3c", 0.6)));
      for (let f = 0; f < 4; f++)
        for (let y = 0; y < 8; y++)
          st(
            a,
            0.5,
            0.4,
            0.05,
            -10.4 + 0.05,
            1 + f * 0.45,
            -4 + y * 0.55,
            et("#d4a64a", 0.4, 0.7),
          ).rotation.y = Math.PI / 2;
      (p(
        "FYRUS POST",
        [
          ["Postcard", "5 FYC"],
          ["Gift by post", "any amount"],
          ["Your mailbox", "Services"],
        ],
        0,
        3.3,
        -s / 2 + 0.05,
        5,
        0,
        "#ffd23f",
      ),
        (c = [de(-7, -5.8), de(-2, -5.8), de(5, 2.6), de(9, -6.6), de(3, -3.8)]),
        n.push(
          lc(
            "postmaster",
            "Postmaster Lina",
            "Postmaster",
            0,
            1.8,
            "#ffd23f",
            "You are Lina, the AI postmaster of Fyrus Post (a game). Explain: send a postcard to any +2040 number for 5 FYC, add an FYC gift if you like; received postcards appear in Services \u2192 Mailbox.",
            "Send a postcard to a friend? Only 5 FYC.",
            ["How do postcards work?"],
          ),
        ));
    }
    if (t === "library") {
      ((i = 26), (s = 20), er(a, i, s, l + 1, "#efe6d6", "#8a6a4a", "wood", 1));
      for (let x = 0; x < 4; x++)
        Ks(a, -9 + x * 3, -7.5, 0, ["#a34a3c", "#3f6f8f", "#d4a64a", "#2f5d50", "#5a3f35"], 2.6);
      for (let x of [-2, 2]) {
        let k = pi("dining", "#9a7450");
        (k.position.set(2, 0, x), a.add(k), o.push({ x: 2, z: x, hx: 1, hz: 0.6 }));
        for (let b of [1.4, 2.6]) {
          let w = Eo(et("#2f5d50", 0.6));
          (w.position.set(b, 0, x + 0.8), (w.rotation.y = Math.PI), a.add(w));
        }
      }
      (u(-6, 5, 4, "#8b5a2b"), st(a, 0.8, 1.2, 0.6, 7, 0.6, 5, et("#2b2e33", 0.4, 0.5)));
      let f = pi("rugr", "#c96f4a");
      (f.position.set(9, 0, -5), a.add(f));
      let y = pi("beanbag", "#ffc27a");
      (y.position.set(9.6, 0, -4),
        a.add(y),
        p(
          "READING LIST",
          kh.slice(0, 6).map((x) => [x.t, x.a]),
          9,
          3.4,
          -s / 2 + 0.05,
          6,
          0,
          "#ffc27a",
        ),
        (c = [de(-6, -6.2), de(-6, 6.4), de(7, 6.2), de(3.4, 0), de(9, -3.5)]),
        n.push(
          lc(
            "librarian",
            "Mr. Tariq",
            "Librarian",
            -4,
            3,
            "#8b5a2b",
            "You are Mr. Tariq, the AI librarian of Fyrus Public Library (a game). Recommend classic public-domain books (Pride and Prejudice, Sherlock Holmes, The Jungle Book, Gitanjali, Arabian Nights) and explain they can be read free on Project Gutenberg.",
            "Welcome! Looking for a good book?",
            ["Recommend a book", "Something short"],
          ),
        ));
    }
    if (t === "pharmacy") {
      ((i = 18),
        (s = 14),
        er(a, i, s, l, "#eef6f2", "#e2ddd3", "tile", 1.15),
        Ks(a, -5, -6, 0, ["#45e0ae", "#ffffff", "#4da3ff", "#ffd23f"]),
        Ks(a, 5, -6, 0, ["#e5484d", "#ffffff", "#45e0ae"]),
        u(0, 2, 5, "#45e0ae"));
      let f = Ri(et("#e9e4da", 0.5));
      (f.position.set(5, 0, 1),
        a.add(f),
        p(
          "PHARMACY",
          [
            ["Vitamins", "8 FYC"],
            ["First-aid kit", "25 FYC"],
            ["Sunscreen", "10 FYC"],
          ],
          0,
          3.3,
          -s / 2 + 0.05,
          4.5,
          0,
          "#45e0ae",
        ),
        (c = [de(-5, -4.8), de(0, 3.2), de(5, -4.8), de(5, 2.2)]),
        n.push(
          lc(
            "pharmacist",
            "Pharmacist Nida",
            "Pharmacist",
            -1,
            0.6,
            "#45e0ae",
            "You are Nida, an AI pharmacist in Fyrus (a game). Items here are game items only. Give general wellbeing tips (water, sleep, sunscreen) and say real medicines need a real doctor or pharmacist.",
            "Hi! Everything here is for your character. For real medicine, ask a real pharmacist.",
            ["Healthy habits?"],
          ),
        ));
    }
    d.copy(
      t === "hospital"
        ? de(-8, 5.4)
        : t === "police"
          ? de(-6, 5.4)
          : t === "fire"
            ? de(-4, 7.2)
            : t === "library"
              ? de(-6, 6.4)
              : de(0, t === "pharmacy" ? 3.2 : 4.2),
    );
  } else if (e.kind === "shop") {
    ((i = 14),
      (s = 12),
      (l = 4.2),
      er(
        a,
        i,
        s,
        l,
        "#f1ede6",
        t === "diner" ? "#7a5a3c" : "#d8d2c6",
        t === "diner" || t === "books" ? "wood" : "tile",
        1.2,
      ));
    let f = new se.Mesh(new se.PlaneGeometry(i, l), et(e.color, 0.85));
    if ((f.position.set(0, l / 2, -s / 2 + 0.02), a.add(f), t === "mobile")) {
      for (let x of [-3, 3]) {
        let k = pi("desk", "#ffffff");
        (k.position.set(x, 0, -1), a.add(k), o.push({ x, z: -1, hx: 0.8, hz: 0.4 }));
        for (let b = 0; b < 4; b++)
          st(
            a,
            0.18,
            0.02,
            0.36,
            x - 0.5 + b * 0.32,
            0.78,
            -0.9,
            new se.MeshStandardMaterial({ color: "#111", emissive: "#4da3ff", emissiveIntensity: 0.4 }),
          );
      }
      ty(a, 4, -2.6, 2.4, -s / 2 + 0.06);
    }
    if (t === "wifi") {
      for (let x = 0; x < 4; x++) {
        let k = pi("desk", "#2b2e33");
        (k.position.set(-4.5 + x * 3, 0, -3.5), a.add(k));
        let b = pi("office");
        (b.position.set(-4.5 + x * 3, 0, -2.6), (b.rotation.y = Math.PI), a.add(b));
      }
      o.push({ x: 0, z: -3.5, hx: 6, hz: 0.5 });
    }
    if (t === "snacks" || t === "bartan" || t === "books") {
      let x =
        t === "snacks"
          ? ["#ff9a3c", "#e5484d", "#ffd23f", "#45e0ae"]
          : t === "bartan"
            ? ["#c0c6cc", "#9aa0a6", "#d4a64a"]
            : ["#a34a3c", "#3f6f8f", "#d4a64a", "#b06ad9"];
      for (let k of [-4, 0, 4]) Ks(a, k, -5.2, 0, x);
      Ks(a, -6.2, -1, Math.PI / 2, x);
    }
    if (t === "barber" || t === "parlour") {
      for (let x of [-4, 0, 4]) {
        let k = pi("office", t === "barber" ? "#1b1d22" : "#e05a8a");
        (k.position.set(x, 0, -4), (k.rotation.y = Math.PI), a.add(k));
        let b = pi("mirror", "#d4a64a");
        (b.position.set(x, 0, -s / 2 + 0.1), a.add(b));
      }
      o.push({ x: 0, z: -4, hx: 5, hz: 0.5 });
    }
    if (t === "diner") {
      for (let [x, k] of [
        [-4, -2],
        [0, -2],
        [4, -2],
        [-4, 1.5],
      ]) {
        let b = Ri(et("#e9e4da", 0.5));
        (b.position.set(x, 0, k), a.add(b), o.push({ x, z: k, hx: 0.55, hz: 0.55 }));
        for (let w of [0, Math.PI]) {
          let L = Eo(et("#2f5d50", 0.6));
          (L.position.set(x + Math.sin(w) * 0.9, 0, k + Math.cos(w) * 0.9),
            (L.rotation.y = w + Math.PI),
            a.add(L));
        }
      }
      st(a, 4, 1.2, 0.6, 3, 0.6, -5.4, et("#c0c6cc", 0.3, 0.7));
    }
    (u(t === "diner" ? 4 : 3, 3, 3.4, e.color), d.copy(de(t === "diner" ? 4 : 3, 4.2)));
    let y = (e.items || []).map((x) => [`${Fi[x].icon} ${Fi[x].name}`, `${Fi[x].price} FYC`]);
    (p(
      e.name.toUpperCase(),
      y.length
        ? y
        : (e.actions || []).map((x) => [
            x === "haircut" ? "Haircut & beard" : "Hair & makeover",
            x === "haircut" ? "20 FYC" : "30 FYC",
          ]),
      -3.5,
      2.6,
      -s / 2 + 0.06,
      4.2,
    ),
      (c = [de(-4, -3), de(4, -3), de(0, 0.4), de(5.2, 1.6)]),
      n.push(
        lc(
          t,
          ["Ali", "Mira", "Sam", "Hina", "Jamal", "Zara", "Leo", "Iqra"][t.length % 8],
          "Shopkeeper",
          t === "diner" ? 4 : 3,
          1.8,
          e.color,
          `You are the AI shopkeeper of ${e.name} in Fyrus (a game). Items are game items paid in FYC. Be warm and brief. You can explain the shift job here.`,
          `Welcome to ${e.name}!`,
          ["What do you sell?", "Can I work here?"],
        ),
      ));
  } else {
    if (
      ((i = 22),
      (s = 18),
      (l = 7),
      er(
        a,
        i,
        s,
        l,
        "#f4f1ea",
        t === "church" || t === "synagogue" ? "#8a6a4a" : "#7a2a2a",
        t === "church" || t === "synagogue" ? "wood" : "dark",
        0.95,
      ),
      t === "mosque" || t === "gurdwara" || t === "temple")
    )
      for (let y = 0; y < 5; y++)
        st(a, i - 3, 0.02, 1.2, 0, 0.012, -5 + y * 1.6, et(y % 2 ? "#2f6a4f" : "#3d7a5c", 1));
    if (t === "mosque") {
      let y = new se.Mesh(
        new se.CylinderGeometry(1.4, 1.4, 0.3, 24, 1, !1, 0, Math.PI),
        et("#d4a64a", 0.4, 0.6),
      );
      ((y.rotation.x = Math.PI / 2),
        (y.rotation.z = Math.PI / 2),
        y.position.set(0, 3.2, -s / 2 + 0.2),
        a.add(y),
        st(a, 2.8, 3.2, 0.3, 0, 1.6, -s / 2 + 0.2, et("#2f6a4f", 0.6)),
        p(
          "PLEASE REMOVE SHOES",
          [
            ["Prayer times", "Fajr \xB7 Zuhr \xB7 Asr \xB7 Maghrib \xB7 Isha"],
            ["Visitors", "welcome"],
          ],
          7,
          2.8,
          -s / 2 + 0.05,
          4.4,
          0,
          "#45e0ae",
        ));
    }
    if (t === "church" || t === "synagogue") {
      for (let y = 0; y < 5; y++)
        for (let x of [-4.5, 4.5])
          (st(a, 6, 0.5, 0.8, x, 0.45, -3 + y * 1.8, et("#6b4a32", 0.6)),
            st(a, 6, 0.8, 0.12, x, 0.9, -2.6 + y * 1.8, et("#6b4a32", 0.6)),
            o.push({ x, z: -3 + y * 1.8, hx: 3, hz: 0.5 }));
      if (t === "church") {
        (st(a, 4, 1.1, 1.4, 0, 0.55, -s / 2 + 2, et("#e9e2d4", 0.5)),
          st(a, 0.2, 2.6, 0.2, 0, 3.4, -s / 2 + 0.3, et("#d4a64a", 0.3, 0.8)),
          st(a, 1.4, 0.2, 0.2, 0, 4, -s / 2 + 0.3, et("#d4a64a", 0.3, 0.8)));
        for (let y of [-7, 7])
          st(
            a,
            1.6,
            3.4,
            0.05,
            y,
            3.6,
            -s / 2 + 0.05,
            new se.MeshStandardMaterial({ color: "#4da3ff", emissive: "#b06ad9", emissiveIntensity: 0.4 }),
          );
      } else
        (st(a, 3, 3.4, 0.6, 0, 1.7, -s / 2 + 0.3, et("#3a5a7a", 0.6)),
          st(a, 2.4, 2.6, 0.05, 0, 1.9, -s / 2 + 0.62, et("#8a2a2a", 0.8)),
          st(a, 3, 1, 2, 0, 0.5, -1, et("#6b4a32", 0.6)));
    }
    if (t === "mandir") {
      (st(a, 4, 0.8, 2.4, 0, 0.4, -s / 2 + 1.6, et("#d4a64a", 0.4, 0.6)),
        st(a, 3, 3, 0.3, 0, 2.3, -s / 2 + 0.4, et("#ff9a3c", 0.6)));
      for (let y = 0; y < 9; y++) {
        let x = new se.Mesh(
          new se.SphereGeometry(0.12, 8, 6),
          new se.MeshStandardMaterial({ color: "#ffd23f", emissive: "#ff9a3c", emissiveIntensity: 0.9 }),
        );
        (x.position.set(-1.6 + y * 0.4, 0.92, -s / 2 + 2.6), a.add(x));
      }
      st(a, 0.08, 1.4, 0.08, 3, 4.6, -s / 2 + 1.5, et("#d4a64a", 0.3, 0.8));
    }
    if (t === "gurdwara") {
      let y = new se.Group();
      for (let [x, k] of [
        [-1.4, -1],
        [1.4, -1],
        [-1.4, 1],
        [1.4, 1],
      ])
        st(y, 0.12, 2.6, 0.12, x, 1.3, k, et("#d4a64a", 0.3, 0.8));
      (st(y, 3.2, 0.3, 2.4, 0, 2.7, 0, et("#ff9a3c", 0.6)),
        st(y, 2.4, 0.6, 1.6, 0, 0.3, 0, et("#f4f1ea", 0.6)),
        y.position.set(0, 0, -s / 2 + 2.6),
        a.add(y),
        o.push({ x: 0, z: -s / 2 + 2.6, hx: 1.6, hz: 1.2 }));
      for (let x = 0; x < 2; x++) st(a, 8, 0.3, 0.9, -5 + x * 10, 0.15, 5, et("#e9e4da", 0.8));
      r.push({
        pos: de(0, 5.6),
        radius: 3,
        label: "Langar \u2014 a free meal for everyone",
        action: "langar",
        payload: t,
      });
    }
    if (t === "temple") {
      let y = new se.Group();
      for (let x = 0; x < 8; x++) {
        let k = new se.Mesh(new se.SphereGeometry(0.5, 10, 8), et("#f3b6c8", 0.6));
        (k.scale.set(0.5, 0.3, 1),
          k.position.set(Math.cos(x * 0.785) * 0.6, 1.4, Math.sin(x * 0.785) * 0.6),
          (k.rotation.y = -x * 0.785),
          y.add(k));
      }
      (st(y, 2, 1.1, 2, 0, 0.55, 0, et("#d4a64a", 0.4, 0.6)), y.position.set(0, 0, -s / 2 + 2.4), a.add(y));
      for (let x = 0; x < 6; x++) {
        let k = new se.Mesh(new se.CylinderGeometry(0.4, 0.45, 0.2, 14), et("#c0392b", 0.8));
        (k.position.set(-5 + x * 2, 0.1, 1), a.add(k));
      }
    }
    for (let y of [-i / 2 + 1.2, i / 2 - 1.2]) {
      let x = ls();
      (x.position.set(y, 0, -s / 2 + 1.2), a.add(x));
    }
    (r.push({ pos: de(0, 0), radius: 3.2, label: "Sit quietly for a moment", action: "pray", payload: t }),
      d.copy(de(-6, s / 2 - 3)),
      (h = []));
  }
  (r.push({
    pos: d.clone(),
    radius: 2.4,
    label:
      e.kind === "faith"
        ? `${e.name} \u2014 about`
        : e.job
          ? `${e.kind === "shop" ? "Counter" : "Desk"} \u2014 ${e.items?.length ? "buy \xB7 " : ""}${e.actions?.length ? "services \xB7 " : ""}start a ${e.job.title.toLowerCase()}`
          : "Counter",
    action: "svc",
    payload: t,
  }),
    c.forEach((f, y) => {
      h[y] && r.push({ pos: f, radius: 1.8, label: h[y], action: "jobtask", payload: String(y) });
    }));
  let v = new se.Group(),
    g = new se.Mesh(
      new se.RingGeometry(0.6, 0.8, 32),
      new se.MeshBasicMaterial({
        color: "#ffc27a",
        transparent: !0,
        opacity: 0.9,
        depthWrite: !1,
        side: se.DoubleSide,
      }),
    );
  ((g.rotation.x = -Math.PI / 2), (g.position.y = 0.04), v.add(g));
  let m = new se.Mesh(new se.ConeGeometry(0.25, 0.5, 4), new se.MeshBasicMaterial({ color: "#ffc27a" }));
  return (
    (m.rotation.x = Math.PI),
    (m.position.y = 2.4),
    v.add(m),
    (v.visible = !1),
    (v.userData.noBlock = !0),
    a.add(v),
    {
      group: a,
      interacts: r,
      bounds: { hx: i / 2 - 0.5, hz: s / 2 - 0.4 },
      spawn: de(0, s / 2 - 1.6),
      npcs: n,
      dancers: [],
      blocks: o,
      tick: (f, y) => {
        let x = ot().jobsMe?.shift,
          k = x && x.svc === t && c[x.station];
        ((v.visible = !!k),
          k &&
            (v.position.copy(c[x.station]),
            (m.position.y = 2.4 + Math.sin(y * 4) * 0.15),
            (g.rotation.z = y)));
      },
    }
  );
}
var A7 = et("#ece7dc", 0.35, 0.05),
  z7 = et("#6b4a32", 0.6),
  T0 = et("#d4a64a", 0.3, 0.9),
  ey = et("#2f4d7a", 0.7),
  j7 = new le.MeshStandardMaterial({
    color: "#9fc2da",
    roughness: 0.05,
    metalness: 0.5,
    transparent: !0,
    opacity: 0.35,
  }),
  Ug = (t, e, a, r, o, n, i, s, l) => ({
    id: t,
    name: e,
    role: a,
    x: r,
    z: o,
    wander: 0.3,
    outfit: {
      skin: la[(t.length * 3) % la.length],
      hair: t.length % 2 ? "short" : "long",
      hairColor: "#2a1a12",
      top: n,
      bottom: "#222831",
      shoes: "#111111",
    },
    persona: i,
    greeting: s,
    quick: l,
  }),
  W7 = {
    school: { title: "FYRUS SCHOOLS", wall: "#f3ead9", floor: "#a7774f", accent: "#ff9a3c" },
    college: { title: "FYRUS COLLEGES", wall: "#e8efec", floor: "#8f8b84", accent: "#45e0ae" },
    university: { title: "FYRUS UNIVERSITIES", wall: "#ece5d6", floor: "#6b4a32", accent: "#4da3ff" },
    institute: { title: "FYRUS INSTITUTES", wall: "#e6ebf2", floor: "#55595f", accent: "#2f6fe0" },
  };
function sR(t) {
  let e = W7[t] || W7.school,
    a = new le.Group(),
    r = [],
    o = [],
    n = 22,
    i = 18;
  er(a, n, i, 6, e.wall, e.floor, t === "institute" || t === "college" ? "concrete" : "wood", 1.15);
  let c = ot().edu,
    d = new Set((c?.inst || []).filter((f) => f.type === t).map((f) => f.id)),
    h = (c?.courses || []).filter((f) => d.has(f.inst)).slice(0, 6),
    u = h.length
      ? h.map((f) => [f.title, f.fee ? `${f.fee} FYC` : "Free"])
      : [
          ["No courses here yet", ""],
          ["Register in the Ministry", ""],
          ["and publish the first one", ""],
        ],
    p = ua(Ba(e.title + " \xB7 COURSES", u, "#16302a", "#f2f2ea"), 9, 0.5 + u.length * 0.62 + 1.2);
  (p.position.set(0, 3.1, -i / 2 + 0.06),
    a.add(p),
    st(a, 3.2, 0.9, 1.2, 0, 0.45, -i / 2 + 2.6, et("#6b4a32", 0.6)),
    o.push({ x: 0, z: -i / 2 + 2.6, hx: 1.6, hz: 0.6 }));
  let v = qs();
  (v.position.set(0.6, 0.92, -i / 2 + 2.6), a.add(v));
  let g = !1;
  for (let f = 0; f < 4; f++)
    for (let y = 0; y < 5; y++) {
      let x = -7 + y * 3.5,
        k = -2 + f * 2.4,
        b = g ? f * 0.3 : 0;
      g && y === 0 && st(a, n - 2, b, 2.4, 0, b / 2, k + 0.3, et(e.floor, 0.85));
      let w = st(a, 2.2, 0.06, 0.8, x, b + 0.75, k, et("#d8cfbf", 0.5));
      (st(a, 0.06, 0.75, 0.7, x - 1, b + 0.37, k, et("#2b2b2b", 0.5, 0.5)),
        st(a, 0.06, 0.75, 0.7, x + 1, b + 0.37, k, et("#2b2b2b", 0.5, 0.5)));
      for (let L of [-0.5, 0.5]) {
        let E = Eo(et(e.accent, 0.6));
        (E.position.set(x + L, b, k + 0.75), (E.rotation.y = Math.PI), a.add(E));
      }
      o.push({ x, z: k + 0.3, hx: 1.2, hz: 0.7 });
    }
  for (let f of [-n / 2 + 1, n / 2 - 1]) {
    let y = ls();
    (y.position.set(f, 0, -i / 2 + 1), a.add(y));
  }
  r.push({
    pos: new le.Vector3(0, 0, -i / 2 + 4.2),
    radius: 2.6,
    label: "Course board \u2014 open Education City",
    action: "edu",
    payload: "explore",
    obj: p,
  });
  let m = [
    Ug(
      "prof-" + t,
      t === "school"
        ? "Ms. Hina"
        : t === "college"
          ? "Mr. Omar"
          : t === "university"
            ? "Prof. Lina"
            : "Coach Theo",
      t === "school" ? "Teacher" : t === "university" ? "Professor" : "Instructor",
      1.8,
      -i / 2 + 3,
      "#1b2a4a",
      `You are a ${t} teacher in Fyrus Education City. Explain how learning works here: registered institutions and independent teachers publish courses with lessons and quick checks; students enrol (some courses are free), finish every lesson, and the teacher issues a signed certificate that anyone can verify at fyrus.io/verify. Fyrus does not issue degrees itself.`,
      "Welcome to class! The board shows the courses taught here.",
      ["How do certificates work?", "How do I start teaching?"],
    ),
  ];
  return {
    group: a,
    interacts: r,
    bounds: { hx: n / 2 - 0.6, hz: i / 2 - 0.4 },
    spawn: new le.Vector3(0, 0, i / 2 - 2),
    npcs: m,
    dancers: [],
    blocks: o,
    tick: () => {},
  };
}
