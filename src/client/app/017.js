function qL(t, e) {
  let a = new z.Group();
  a.position.set(t, 0, e);
  let r = new z.Mesh(new z.CircleGeometry(46, 96), mu("lagoon"));
  ((r.rotation.x = -Math.PI / 2), (r.position.y = 0.06), a.add(r));
  let o = new z.Mesh(
    new z.RingGeometry(46, 52, 96),
    new z.MeshStandardMaterial({ color: "#cfc8ba", roughness: 0.9, side: z.DoubleSide }),
  );
  ((o.rotation.x = -Math.PI / 2), (o.position.y = 0.1), a.add(o));
  let n = new z.Mesh(new z.TorusGeometry(46.2, 0.05, 6, 160), br.steel);
  ((n.rotation.x = Math.PI / 2), (n.position.y = 1.05), a.add(n));
  let i = [],
    s = ["#5b7a99", "#6d8aa3", "#4f6f86", "#7593a8"];
  for (let h = 0; h < 12; h++) {
    let u = Math.PI * 0.15 + (h / 12) * Math.PI * 1.7 + Math.PI * 0.5,
      p = 62 + (h % 3) * 8,
      v = 50 + ((h * 37) % 60),
      g = Math.cos(u) * p,
      m = Math.sin(u) * p,
      f = h % 3,
      y =
        f === 0
          ? new z.BoxGeometry(10, v, 10)
          : f === 1
            ? new z.CylinderGeometry(4, 6, v, 8)
            : new z.CylinderGeometry(5.5, 5.5, v, 24),
      x = new z.Mesh(
        y,
        Ea({
          base: f === 1 ? "#d8d3c8" : "#a9b8c6",
          tint: s[h % 4],
          kind: f === 1 ? 1 : 0,
          h: v,
          seed: h * 0.13,
        }),
      );
    (x.position.set(g, v / 2, m), (x.castShadow = !0), a.add(x), i.push({ x: t + g, z: e + m, r: 7 }));
  }
  let l = new z.Group();
  (l.position.set(0, 0, -64), a.add(l));
  for (let h of [-1, 0, 1]) {
    let u = new z.Mesh(
      new z.BoxGeometry(8, 64, 12),
      Ea({ base: "#cfd6dc", tint: "#5b7a99", kind: 0, h: 64, seed: 0.3 + h }),
    );
    (u.position.set(h * 14, 32, 0),
      (u.rotation.y = h * 0.06),
      (u.castShadow = !0),
      l.add(u),
      i.push({ x: t + h * 14, z: e - 64, r: 7 }));
  }
  let c = new z.Mesh(new z.BoxGeometry(46, 2.4, 10), br.white);
  (c.position.set(3, 65.2, 0), l.add(c));
  let d = new z.Mesh(
    new z.BoxGeometry(44, 0.3, 8),
    new z.MeshStandardMaterial({ color: "#4f7f35", roughness: 0.9 }),
  );
  (d.position.set(3, 66.5, 0), l.add(d));
  for (let h = 0; h < 16; h++) {
    let u = (h / 16) * Math.PI * 2;
    a.add(Ni(Math.cos(u) * 49, Math.sin(u) * 49));
  }
  return { group: a, colliders: i, interacts: [] };
}
function ZL(t, e) {
  let a = new z.Group(),
    r = 17,
    o = new z.Mesh(new z.TorusGeometry(t, 0.7, 8, 360), br.concrete);
  ((o.rotation.x = Math.PI / 2), (o.position.y = r), a.add(o));
  let n = [];
  for (let h = 0; h < 64; h++) {
    let u = (h / 64) * Math.PI * 2,
      p = Math.cos(u) * t,
      v = Math.sin(u) * t;
    if (e.some((m) => Math.hypot(m.x - p, m.z - v) < m.r + 4)) continue;
    let g = new z.Mesh(new z.CylinderGeometry(0.6, 0.8, r, 10), br.concrete);
    (g.position.set(p, r / 2, v), a.add(g), n.push({ x: p, z: v, r: 1.2 }));
  }
  let i = new z.Group(),
    s = new z.MeshStandardMaterial({ color: "#f2f2ee", metalness: 0.4, roughness: 0.3 }),
    l = new z.MeshStandardMaterial({ color: "#1a2633", metalness: 0.9, roughness: 0.1 }),
    c = new z.MeshStandardMaterial({ color: "#c0392b" });
  for (let h = 0; h < 3; h++) {
    let u = new z.Mesh(new z.BoxGeometry(2.6, 2.6, 7.4), s);
    ((u.position.z = (h - 1) * 7.8), i.add(u));
    let p = new z.Mesh(new z.BoxGeometry(2.64, 0.9, 6.6), l);
    (p.position.set(0, 0.4, u.position.z), i.add(p));
    let v = new z.Mesh(new z.BoxGeometry(2.66, 0.18, 7.2), c);
    (v.position.set(0, -0.6, u.position.z), i.add(v));
  }
  a.add(i);
  let d = 0;
  return {
    group: a,
    colliders: n,
    interacts: [],
    tick: (h) => {
      ((d += h * (16 / t)), i.position.set(Math.cos(d) * t, r + 2, Math.sin(d) * t), (i.rotation.y = -d));
    },
  };
}
function KL(t = 30) {
  let e = new z.Group(),
    a = [],
    r = ["#e8e8e8", "#1c1c1c", "#9aa1a8", "#c0392b", "#1f4e79", "#f1c40f", "#2e5e3e"];
  for (let o = 0; o < t; o++) {
    let n = $x(r[o % r.length]);
    (n.scale.setScalar(0.9),
      e.add(n),
      a.push({
        o: n,
        r: 60 + (o % 9) * 30,
        y: 34 + (o % 4) * 8,
        a: Math.random() * Math.PI * 2,
        s: (0.05 + Math.random() * 0.05) * (o % 2 ? 1 : -1),
      }));
  }
  return {
    group: e,
    colliders: [],
    interacts: [],
    tick: (o) =>
      a.forEach((n) => {
        ((n.a += n.s * o),
          n.o.position.set(Math.cos(n.a) * n.r, n.y, Math.sin(n.a) * n.r),
          (n.o.rotation.y = -n.a + (n.s > 0 ? Math.PI : 0)));
      }),
  };
}
var Ze = { x: -118, z: -92, w: 34, d: 18, deck: 0.6 };
function vd(t, e) {
  return Math.abs(t - Ze.x) < Ze.w / 2 - 0.4 && Math.abs(e - Ze.z) < Ze.d / 2 - 0.4;
}
function XL(t, e) {
  return Math.abs(t - Ze.x) < Ze.w / 2 + 8 && Math.abs(e - Ze.z) < Ze.d / 2 + 8;
}
function JL() {
  let t = new z.Group();
  t.position.set(Ze.x, 0, Ze.z);
  let e = Ze.w,
    a = Ze.d,
    r = Ze.deck,
    o = new z.MeshStandardMaterial({ color: "#e8e1d2", roughness: 0.85 }),
    n = (g, m, f, y) => {
      let x = new z.Mesh(new z.BoxGeometry(g, r, m), o);
      (x.position.set(f, r / 2, y), (x.receiveShadow = !0), t.add(x));
    };
  (n(e + 16, 8, 0, -(a / 2 + 4)),
    n(e + 16, 8, 0, a / 2 + 4),
    n(8, a, -(e / 2 + 4), 0),
    n(8, a, e / 2 + 4, 0));
  let i = new z.Mesh(new z.BoxGeometry(e, 1.6, a), br.tile);
  ((i.position.y = -0.8 + r - 0.9), t.add(i));
  let s = new z.Mesh(new z.PlaneGeometry(e, a), mu("pool"));
  ((s.rotation.x = -Math.PI / 2), (s.position.y = r - 0.15), t.add(s));
  let l = new z.MeshStandardMaterial({ color: "#f7f4ee", roughness: 0.6 });
  for (let [g, m, f, y] of [
    [e + 0.8, 0.4, 0, -a / 2 - 0.2],
    [e + 0.8, 0.4, 0, a / 2 + 0.2],
    [0.4, a, -e / 2 - 0.2, 0],
    [0.4, a, e / 2 + 0.2, 0],
  ]) {
    let x = new z.Mesh(new z.BoxGeometry(g, 0.12, m), l);
    (x.position.set(f, r + 0.06, y), t.add(x));
  }
  for (let g = 1; g < 4; g++) {
    let m = new z.Mesh(
      new z.CylinderGeometry(0.06, 0.06, e, 6),
      new z.MeshStandardMaterial({ color: g % 2 ? "#e74c3c" : "#2980b9" }),
    );
    ((m.rotation.z = Math.PI / 2), m.position.set(0, r - 0.1, -a / 2 + (g * a) / 4), t.add(m));
  }
  for (let g of [-e / 2 + 2, e / 2 - 2])
    for (let m of [-0.35, 0.35]) {
      let f = new z.Mesh(new z.TorusGeometry(0.4, 0.04, 6, 12, Math.PI), br.steel);
      (f.position.set(g + m, r + 0.35, -a / 2 + 0.1), (f.rotation.y = Math.PI / 2), t.add(f));
    }
  let c = new z.MeshStandardMaterial({ color: "#f2f2ee", roughness: 0.8 }),
    d = [
      new z.MeshStandardMaterial({ color: "#e8eef2", roughness: 0.7, side: z.DoubleSide }),
      new z.MeshStandardMaterial({ color: "#1f4e79", roughness: 0.7, side: z.DoubleSide }),
    ];
  for (let g = 0; g < 7; g++) {
    let m = -e / 2 + 2.5 + g * 5,
      f = new z.Group();
    f.position.set(m, r, a / 2 + 4.5);
    let y = new z.Mesh(new z.BoxGeometry(0.8, 0.3, 2), br.wood);
    y.position.y = 0.3;
    let x = new z.Mesh(new z.BoxGeometry(0.8, 0.1, 0.9), c);
    (x.position.set(0, 0.7, -0.75), (x.rotation.x = -0.7));
    let k = new z.Mesh(new z.BoxGeometry(0.78, 0.08, 1.4), c);
    if ((k.position.set(0, 0.49, 0.25), f.add(y, x, k), t.add(f), g % 2 === 0)) {
      let b = new z.Group();
      b.position.set(m + 1.6, r, a / 2 + 5);
      let w = new z.Mesh(new z.CylinderGeometry(0.04, 0.04, 2.6, 6), br.steel);
      w.position.y = 1.3;
      let L = new z.Mesh(new z.ConeGeometry(1.6, 0.6, 12, 1, !0), d[(g / 2) % 2]);
      ((L.position.y = 2.6), b.add(w, L), t.add(b));
    }
  }
  let h = new z.Group();
  h.position.set(e / 2 + 3, r, 0);
  for (let [g, m] of [
    [-0.5, -0.5],
    [0.5, -0.5],
    [-0.5, 0.5],
    [0.5, 0.5],
  ]) {
    let f = new z.Mesh(new z.BoxGeometry(0.1, 2.4, 0.1), br.white);
    (f.position.set(g, 1.2, m), h.add(f));
  }
  let u = new z.Mesh(new z.BoxGeometry(1.2, 0.1, 1.2), br.white);
  u.position.y = 2.4;
  let p = new z.Mesh(
    new z.PlaneGeometry(0.8, 0.5),
    new z.MeshStandardMaterial({ color: "#e74c3c", side: z.DoubleSide }),
  );
  (p.position.set(0, 3.4, 0), h.add(u, p), t.add(h));
  for (let [g, m] of [
    [-e / 2 - 6, -a / 2 - 6],
    [e / 2 + 6, -a / 2 - 6],
    [-e / 2 - 6, a / 2 + 6],
    [e / 2 + 6, a / 2 + 6],
  ]) {
    let f = ya("#3f6f2e", 1.3);
    (f.position.set(g, r, m), t.add(f));
  }
  let v = UL("LIDO POOL", "Walk in to swim", "#2980b9", 6);
  return (
    v.position.set(0, 2.2, -a / 2 - 8.1),
    t.add(v),
    t.add(Ni(-e / 2 - 7, 0), Ni(e / 2 + 7, -6)),
    {
      group: t,
      colliders: [],
      interacts: [],
      tick: (g, m) => {
        p.rotation.y = Math.sin(m * 2) * 0.3;
      },
    }
  );
}
function PN(t) {
  let e = document.createElement("canvas");
  ((e.width = 512), (e.height = 96 * t.length + 56));
  let a = e.getContext("2d");
  (eo(a, 6, 4, 500, 44, 10),
    (a.fillStyle = "#12355e"),
    a.fill(),
    (a.fillStyle = "#ff9a3c"),
    a.beginPath(),
    a.arc(30, 26, 11, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#4da3ff"),
    a.beginPath(),
    a.arc(30, 26, 6, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#fff"),
    (a.font = "800 24px Sora, sans-serif"),
    a.fillText("FYRUS CITY", 50, 35),
    t.forEach((o, n) => {
      let i = 52 + n * 96;
      (eo(a, 6, i, 500, 88, 12),
        (a.fillStyle = "#0f6b3a"),
        a.fill(),
        (a.lineWidth = 4),
        (a.strokeStyle = "#ffffff"),
        a.stroke(),
        (a.fillStyle = "#fff"),
        (a.font = "800 46px Sora, sans-serif"),
        a.fillText(o.arrow, 22, i + 62),
        (a.font = '700 34px "Plus Jakarta Sans", sans-serif'),
        a.fillText(o.name.length > 16 ? o.name.slice(0, 15) + "\u2026" : o.name, 82, i + 56),
        (a.textAlign = "right"),
        (a.font = '700 30px "JetBrains Mono", monospace'),
        a.fillText(
          o.m >= 1e3 ? (o.m / 1e3).toFixed(1) + " km" : Math.round(o.m / 10) * 10 + " m",
          490,
          i + 56,
        ),
        (a.textAlign = "left"));
    }));
  let r = new z.CanvasTexture(e);
  return ((r.anisotropy = 4), r);
}
function QL(t, e) {
  let a = new z.Group(),
    r = [],
    o = [],
    n = new Map();
  return (
    t.forEach((i, s) => {
      let l = e
          .filter((m) => Math.hypot(m.x - i.x, m.z - i.z) > 25)
          .map((m) => ({ t: m, d: Math.hypot(m.x - i.x, m.z - i.z) }))
          .sort((m, f) => m.d - f.d)
          .slice(0, 3),
        c = l.map(({ t: m, d: f }) => {
          let x =
              ((((Math.atan2(m.x - i.x, m.z - i.z) - i.ry) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) -
              Math.PI,
            k =
              Math.abs(x) < Math.PI / 4
                ? "\u25B2"
                : Math.abs(x) > Math.PI * 0.75
                  ? "\u25BC"
                  : x > 0
                    ? "\u25C0"
                    : "\u25B6";
          return { name: m.name, arrow: k, m: f };
        }),
        d = new z.Group();
      (d.position.set(i.x, 0, i.z), (d.rotation.y = i.ry));
      let h = new z.Mesh(new z.CylinderGeometry(0.08, 0.1, 4.6, 8), br.steel);
      ((h.position.y = 2.3), d.add(h));
      let u = 0.42 * c.length + 0.25,
        p = new z.MeshStandardMaterial({
          map: PN(c),
          roughness: 0.6,
          emissive: "#ffffff",
          emissiveIntensity: 0.15,
        });
      ((p.emissiveMap = p.map), Mo.push(p));
      let v = new z.Mesh(new z.PlaneGeometry(2.3, u), p);
      (v.position.set(0, 4.6 - u / 2, 0.06), d.add(v));
      let g = new z.Mesh(new z.PlaneGeometry(2.3, u), p);
      (g.position.set(0, 4.6 - u / 2, -0.06),
        (g.rotation.y = Math.PI),
        d.add(g),
        a.add(d),
        o.push({ x: i.x, z: i.z, r: 0.4 }),
        l[0] &&
          (r.push({
            pos: new z.Vector3(i.x, 0, i.z),
            radius: 2.6,
            label: `Set route: ${l[0].t.name}`,
            action: "waypoint",
            payload: l[0].t.id,
            obj: v,
          }),
          n.set(v, l[0].t)));
    }),
    { group: a, colliders: o, interacts: r, waypoints: n }
  );
}
function ON(t, e, a) {
  let n = document.createElement("canvas");
  ((n.width = 1280), (n.height = 720));
  let i = n.getContext("2d"),
    s = (l) => {
      let c = t?.color || "#ff9a3c";
      if (((i.fillStyle = "#f4f1ea"), i.fillRect(0, 0, 1280, 720), l)) {
        let h = Math.max(1280 / l.width, 720 / l.height);
        i.drawImage(l, (1280 - l.width * h) / 2, (720 - l.height * h) / 2, l.width * h, l.height * h);
        let u = i.createLinearGradient(0, 720 * 0.45, 0, 720);
        (u.addColorStop(0, "rgba(0,0,0,0)"),
          u.addColorStop(1, "rgba(0,0,0,0.7)"),
          (i.fillStyle = u),
          i.fillRect(0, 0, 1280, 720));
      }
      t
        ? ((i.fillStyle = l ? "#fff" : c),
          (i.font = '800 44px "Plus Jakarta Sans", sans-serif'),
          i.fillText(t.brand.toUpperCase(), 60, 530),
          (i.fillStyle = l ? "#fff" : "#111"),
          (i.font = "800 84px Sora, sans-serif"),
          i.fillText(t.headline.slice(0, 26), 60, 630),
          (i.fillStyle = l ? "rgba(255,255,255,.7)" : "#666"),
          (i.font = '600 28px "Plus Jakarta Sans", sans-serif'),
          i.fillText("Sponsored", 60, 680))
        : ((i.fillStyle = "#111"),
          i.fillRect(0, 0, 1280, 120),
          (i.fillStyle = "#ff9a3c"),
          (i.font = "800 54px Sora, sans-serif"),
          i.fillText("YOUR AD HERE", 60, 82),
          (i.fillStyle = "#111"),
          (i.font = "800 100px Sora, sans-serif"),
          i.fillText("Advertise in", 60, 330),
          i.fillText("Fyrus City", 60, 450),
          (i.fillStyle = "#555"),
          (i.font = '600 40px "Plus Jakarta Sans", sans-serif'),
          i.fillText(`${e.views} views`, 60, 560));
      let d = new z.CanvasTexture(n);
      ((d.anisotropy = 4), a(d));
    };
  if (t?.image) {
    let l = new Image();
    ((l.onload = () => s(l)), (l.onerror = () => s()), (l.src = t.image));
  } else s();
}
function DN(t) {
  let e = document.createElement("canvas");
  ((e.width = 1024), (e.height = 64));
  let a = e.getContext("2d");
  ((a.fillStyle = "#12355e"),
    a.fillRect(0, 0, 1024, 64),
    (a.fillStyle = "#ff9a3c"),
    a.beginPath(),
    a.arc(34, 32, 16, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#4da3ff"),
    a.beginPath(),
    a.arc(34, 32, 9, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#fff"),
    (a.font = "800 30px Sora, sans-serif"),
    a.fillText("FYRUS CITY", 62, 43),
    (a.textAlign = "right"),
    (a.font = '600 22px "Plus Jakarta Sans", sans-serif'),
    (a.fillStyle = "rgba(255,255,255,.75)"),
    a.fillText("Official billboard \xB7 book yours in the Ads menu", 1e3, 41));
  let r = new z.CanvasTexture(e);
  return new z.Mesh(new z.PlaneGeometry(t, t / 16), new z.MeshStandardMaterial({ map: r, roughness: 0.6 }));
}
function t7(t, e) {
  let a = new z.Group(),
    r = [],
    o = [];
  t.forEach((i) => {
    let s = new z.Group();
    (s.position.set(i.x, 0, i.z), (s.rotation.y = i.ry));
    for (let p of [-1, 1]) {
      let v = new z.Mesh(new z.CylinderGeometry(0.25, 0.3, 8, 8), br.dark);
      (v.position.set(p * 5.5, 4, 0), s.add(v));
    }
    let l = new z.MeshStandardMaterial({
      color: "#ffffff",
      roughness: 0.7,
      emissive: "#ffffff",
      emissiveIntensity: 0.15,
      side: z.DoubleSide,
    });
    Mo.push(l);
    let c = new z.Mesh(new z.PlaneGeometry(13, 7.3), l);
    ((c.position.y = 10), s.add(c));
    let d = new z.Mesh(new z.BoxGeometry(13.6, 8.6, 0.3), br.dark);
    (d.position.set(0, 10.35, -0.2), s.add(d));
    let h = DN(13.6);
    (h.position.set(0, 14.25, -0.03), s.add(h));
    let u = e.find((p) => p.spotId === i.id);
    if (u?.video) {
      let p = document.createElement("video");
      ((p.src = u.video),
        (p.loop = !0),
        (p.muted = !0),
        (p.playsInline = !0),
        (p.crossOrigin = "anonymous"),
        p.play().catch(() => {}));
      let v = new z.VideoTexture(p);
      ((v.encoding = z.sRGBEncoding),
        (l.map = v),
        (l.emissiveMap = v),
        (l.emissiveIntensity = 0.85),
        (l.needsUpdate = !0),
        o.push({ el: p, pos: new z.Vector3(i.x, 10, i.z) }));
    } else
      ON(u, i, (p) => {
        ((l.map = p), (l.emissiveMap = p), (l.needsUpdate = !0));
      });
    (a.add(s),
      r.push({
        pos: new z.Vector3(i.x, 0, i.z),
        radius: 5.5,
        label: u ? `${u.brand} \xB7 ad` : "Book this billboard",
        action: "ad",
        payload: i.id,
        obj: c,
      }));
  });
  let n = [];
  return (
    t.forEach((i) =>
      [-1, 1].forEach((s) => {
        let l = FL(new z.Vector3(s * 5.5, 0, 0), i.ry);
        n.push({ x: i.x + l.x, z: i.z + l.z, r: 0.8 });
      }),
    ),
    { group: a, colliders: n, interacts: r, videos: o }
  );
}
var j = P(ea(), 1);
var Yx = (t) => {
    let e = new j.Color(t);
    return 0.2126 * e.r + 0.7152 * e.g + 0.0722 * e.b;
  },
  FN = (t, e) => (Math.abs(Yx(t) - Yx(e)) < 0.35 ? (Yx(t) > 0.5 ? "#141414" : "#ffffff") : e),
  qx = (t, e) => Eh[t].replace("{px}", String(e));
function M0(t) {
  let r = document.createElement("canvas");
  ((r.width = 1024), (r.height = 176));
  let o = r.getContext("2d"),
    n = o.createLinearGradient(0, 0, 0, 176),
    i = new j.Color(t.primary);
  (n.addColorStop(0, "#" + i.clone().offsetHSL(0, 0, 0.05).getHexString()),
    n.addColorStop(1, "#" + i.clone().offsetHSL(0, 0, -0.06).getHexString()),
    (o.fillStyle = n),
    o.fillRect(0, 0, 1024, 176));
  let s = FN(t.primary, t.secondary);
  ((o.strokeStyle = s),
    (o.globalAlpha = 0.35),
    (o.lineWidth = 4),
    o.strokeRect(10, 10, 1004, 156),
    (o.globalAlpha = 1),
    (o.fillStyle = s),
    o.beginPath(),
    o.arc(96, 176 / 2, 58, 0, Math.PI * 2),
    o.fill(),
    (o.fillStyle = t.primary),
    (o.textAlign = "center"),
    (o.font = qx(t.font === "script" ? "serif" : t.font, 64)),
    o.fillText(t.glyph || t.name[0], 96, 176 / 2 + 22),
    (o.textAlign = "left"),
    (o.fillStyle = s));
  let l = t.font === "display" ? 108 : t.font === "script" ? 70 : 76;
  for (o.font = qx(t.font, l); o.measureText(t.name).width > 794 && l > 30; )
    ((l -= 4), (o.font = qx(t.font, l)));
  if (
    (o.fillText(t.name, 182, t.tagline ? 176 / 2 + (t.font === "display" ? 18 : 10) : 176 / 2 + l * 0.35),
    t.tagline)
  ) {
    ((o.globalAlpha = 0.8), (o.font = '600 24px "Plus Jakarta Sans", sans-serif'));
    let d = t.tagline.length > 62 ? t.tagline.slice(0, 60) + "\u2026" : t.tagline;
    (o.fillText(d, 184, 150), (o.globalAlpha = 1));
  }
  let c = new j.CanvasTexture(r);
  return ((c.anisotropy = 8), c);
}
function UN(t) {
  let e = document.createElement("canvas");
  ((e.width = 256), (e.height = 96));
  let a = e.getContext("2d");
  return (
    eo(a, 2, 2, 252, 92, 10),
    (a.fillStyle = "#12355e"),
    a.fill(),
    (a.strokeStyle = "#ffffff"),
    (a.lineWidth = 4),
    a.stroke(),
    (a.fillStyle = "#ff9a3c"),
    a.beginPath(),
    a.arc(34, 48, 16, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#4da3ff"),
    a.beginPath(),
    a.arc(34, 48, 9, 0, Math.PI * 2),
    a.fill(),
    (a.fillStyle = "#ffffff"),
    (a.font = '700 15px "Plus Jakarta Sans", sans-serif'),
    a.fillText("FYRUS CITY", 62, 34),
    (a.font = '700 34px "JetBrains Mono", monospace'),
    a.fillText(t, 60, 74),
    new j.CanvasTexture(e)
  );
}
function $N(t, e) {
  let a = document.createElement("canvas");
  ((a.width = 256), (a.height = 64));
  let r = a.getContext("2d");
  for (let n = 0; n < 8; n++) ((r.fillStyle = n % 2 ? t : e), r.fillRect(n * 32, 0, 32, 64));
  return ((r.fillStyle = "rgba(0,0,0,0.15)"), r.fillRect(0, 52, 256, 12), new j.CanvasTexture(a));
}
function E0(t, e) {
  let a = document.createElement("canvas");
  ((a.width = 512), (a.height = 640));
  let r = a.getContext("2d");
  if (
    ((r.fillStyle = "#1f2a22"),
    r.fillRect(0, 0, 512, 640),
    (r.strokeStyle = "#8a6a44"),
    (r.lineWidth = 22),
    r.strokeRect(11, 11, 490, 618),
    (r.fillStyle = "#12355e"),
    r.fillRect(22, 22, 468, 44),
    (r.fillStyle = "#ff9a3c"),
    r.beginPath(),
    r.arc(48, 44, 11, 0, Math.PI * 2),
    r.fill(),
    (r.fillStyle = "#4da3ff"),
    r.beginPath(),
    r.arc(48, 44, 6, 0, Math.PI * 2),
    r.fill(),
    (r.fillStyle = "#fff"),
    (r.font = "800 22px Sora, sans-serif"),
    r.fillText("FYRUS CITY \xB7 " + (t.no || ""), 68, 52),
    (r.fillStyle = "#f4f1e8"),
    (r.textAlign = "center"),
    (r.font = '400 60px "Bebas Neue", Impact, sans-serif'),
    r.fillText(t.kind === "vacant" ? "FOR RENT" : "TODAY AT", 256, 122),
    t.kind !== "vacant" &&
      ((r.font = '700 40px "Plus Jakarta Sans", sans-serif'), r.fillText(t.name.slice(0, 18), 256, 170)),
    (r.font = '600 34px "Plus Jakarta Sans", sans-serif'),
    (r.fillStyle = "#d8e8d0"),
    t.kind === "vacant")
  )
    ["Open your shop", "in Fyrus City", "Free during launch", "Press E inside"].forEach((n, i) =>
      r.fillText(n, 256, 260 + i * 70),
    );
  else {
    let n = e.history[e.history.length - 1] || 0;
    (r.fillText(`${n.toLocaleString("en-US")} visitors today`, 256, 260),
      r.fillText(`${e.visits.toLocaleString("en-US")} visits all time`, 256, 330),
      r.fillText(
        `${e.purchases.toLocaleString("en-US")} ${t.kind === "game" ? "plays" : "purchases"}`,
        256,
        400,
      ),
      (r.fillStyle = "#ffd59a"),
      (r.font = '400 54px "Bebas Neue", Impact, sans-serif'),
      r.fillText(
        t.kind === "game" ? "PLAY FREE" : t.kind === "cafe" ? "ORBIT LATTE $4" : "WALK IN",
        256,
        520,
      ));
  }
  return new j.CanvasTexture(a);
}
function e7(t, e, a, r) {
  let o = document.createElement("canvas");
  ((o.width = 512), (o.height = 320));
  let n = o.getContext("2d"),
    i = n.createLinearGradient(0, 0, 512, 320);
  return (
    i.addColorStop(0, a),
    i.addColorStop(1, "#0a0f1a"),
    (n.fillStyle = i),
    n.fillRect(0, 0, 512, 320),
    (n.fillStyle = r),
    (n.font = "800 54px Sora, sans-serif"),
    n.fillText(t.slice(0, 14), 32, 140),
    (n.fillStyle = "#ffffff"),
    (n.font = '600 26px "Plus Jakarta Sans", sans-serif'),
    n.fillText(e, 32, 200),
    (n.fillStyle = r),
    eo(n, 32, 236, 220, 52, 26),
    n.fill(),
    (n.fillStyle = "#0a0f1a"),
    (n.font = '800 24px "Plus Jakarta Sans", sans-serif'),
    n.fillText("TRY LIVE DEMO", 52, 270),
    new j.CanvasTexture(o)
  );
}
var Xt = {
  pilaster: new j.MeshStandardMaterial({ color: "#efe9de", roughness: 0.8 }),
  glass: new j.MeshStandardMaterial({
    color: "#2a3a48",
    metalness: 0.6,
    roughness: 0.08,
    transparent: !0,
    opacity: 0.38,
  }),
  interior: new j.MeshStandardMaterial({
    color: "#f3ead9",
    roughness: 0.9,
    emissive: "#fff2d8",
    emissiveIntensity: 0.25,
  }),
  wood: new j.MeshStandardMaterial({ color: "#7a5636", roughness: 0.7 }),
  dark: new j.MeshStandardMaterial({ color: "#2b2f36", roughness: 0.6, metalness: 0.3 }),
  roof: new j.MeshStandardMaterial({ color: "#a8533a", roughness: 0.85 }),
  stone: new j.MeshStandardMaterial({ color: "#c9c2b6", roughness: 0.9 }),
  steel: new j.MeshStandardMaterial({ color: "#8e979f", metalness: 0.8, roughness: 0.35 }),
  white: new j.MeshStandardMaterial({ color: "#f4f4f2", roughness: 0.5 }),
  shutter: new j.MeshStandardMaterial({ color: "#9aa0a6", metalness: 0.5, roughness: 0.5 }),
  lantern: new j.MeshStandardMaterial({
    color: "#c0392b",
    emissive: "#ff5a3c",
    emissiveIntensity: 0.4,
    roughness: 0.6,
  }),
};
function _N(t = "#c0392b") {
  let e = new j.Group(),
    a = new j.MeshStandardMaterial({ color: t, metalness: 0.6, roughness: 0.25 }),
    r = new j.Mesh(new j.BoxGeometry(1.9, 0.45, 4.4), a);
  ((r.position.y = 0.55), (r.castShadow = !0));
  let o = new j.Mesh(new j.BoxGeometry(1.7, 0.3, 1.2), a);
  o.position.set(0, 0.45, 2.5);
  let n = new j.Mesh(new j.SphereGeometry(0.75, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), Xt.glass);
  (n.scale.set(1, 0.7, 1.6), n.position.set(0, 0.75, -0.2));
  let i = new j.Mesh(new j.BoxGeometry(2.2, 0.08, 0.5), Xt.dark);
  i.position.set(0, 1.15, -2);
  for (let l of [-0.8, 0.8]) {
    let c = new j.Mesh(new j.BoxGeometry(0.08, 0.4, 0.3), Xt.dark);
    (c.position.set(l, 0.95, -2), e.add(c));
  }
  e.add(r, o, n, i);
  for (let [l, c] of [
    [-1, 1.4],
    [1, 1.4],
    [-1, -1.4],
    [1, -1.4],
  ]) {
    let d = new j.Mesh(new j.CylinderGeometry(0.36, 0.36, 0.3, 18), Xt.dark);
    ((d.rotation.z = Math.PI / 2), d.position.set(l, 0.36, c), (d.castShadow = !0), e.add(d));
  }
  let s = new j.Mesh(new j.BoxGeometry(0.4, 0.46, 4.42), Xt.white);
  return ((s.position.y = 0.551), e.add(s), e);
}
function Zx() {
  let t = new j.Group(),
    e = new j.Mesh(new j.BoxGeometry(1.4, 0.12, 2.4), Xt.white);
  ((e.position.y = 0.85), (e.castShadow = !0));
  let a = new j.Mesh(
    new j.BoxGeometry(1.5, 0.08, 2.5),
    new j.MeshStandardMaterial({ color: "#2f6fe0", roughness: 0.4 }),
  );
  ((a.position.y = 0.8), t.add(e, a));
  for (let [o, n] of [
    [-0.6, -1.1],
    [0.6, -1.1],
    [-0.6, 1.1],
    [0.6, 1.1],
  ]) {
    let i = new j.Mesh(new j.BoxGeometry(0.1, 0.8, 0.1), Xt.dark);
    (i.position.set(o, 0.4, n), t.add(i));
  }
  for (let [o, n] of [
    [-0.8, "#2f6fe0"],
    [0.8, "#e67e22"],
  ]) {
    let i = new j.Mesh(
      new j.CylinderGeometry(0.12, 0.12, 0.08, 16),
      new j.MeshStandardMaterial({ color: n }),
    );
    (i.position.set(0, 0.95, o), t.add(i));
  }
  let r = new j.Mesh(new j.CylinderGeometry(0.06, 0.06, 0.03, 12), Xt.dark);
  return (r.position.set(0.2, 0.93, 0.1), t.add(r), t);
}
function Gg(t) {
  let e = new j.Group(),
    a = new j.Mesh(
      new j.BoxGeometry(0.9, 1.9, 0.8),
      new j.MeshStandardMaterial({ color: "#1c1f26", roughness: 0.5 }),
    );
  ((a.position.y = 0.95), (a.castShadow = !0));
  let r = new j.Mesh(
    new j.PlaneGeometry(0.7, 0.55),
    new j.MeshStandardMaterial({ color: "#0a0f1a", emissive: t, emissiveIntensity: 0.6 }),
  );
  (r.position.set(0, 1.35, 0.41), (r.rotation.x = -0.12));
  let o = new j.Mesh(
    new j.BoxGeometry(0.92, 0.22, 0.82),
    new j.MeshStandardMaterial({ color: t, emissive: t, emissiveIntensity: 0.5 }),
  );
  return ((o.position.y = 1.85), e.add(a, r, o), e);
}
function a7(t, e, a) {
  let r = new j.Group(),
    o = [],
    n = [],
    i = new Map(),
    s = [],
    l = [],
    c = Vr.step - 0.2,
    d = Vr.depth,
    h = 8.6;
  t.forEach((x, k) => {
    let b = new j.Group(),
      w = _c(x.slot),
      L = zl(x.row),
      E = O2(x.row) ? 0 : Math.PI;
    (b.position.set(w, 0, L), (b.rotation.y = E), r.add(b));
    let T = d / 2,
      S = new j.Mesh(
        new j.BoxGeometry(c, h, d),
        Ea({ base: x.facade, tint: "#6b7f8f", kind: 2, h, seed: k * 0.37 + 0.11, cell: [2.8, 4.2] }),
      );
    ((S.position.y = h / 2), (S.castShadow = !0), (S.receiveShadow = !0), b.add(S));
    let H = new j.Mesh(new j.BoxGeometry(c + 0.3, 0.35, 0.5), Xt.pilaster);
    (H.position.set(0, h - 0.2, T + 0.1), b.add(H));
    let N = new j.Mesh(new j.CylinderGeometry(d / 1.7, d / 1.7, c, 3, 1), Xt.roof);
    ((N.rotation.z = Math.PI / 2),
      (N.rotation.y = 0),
      N.scale.set(1, 1, 0.45),
      N.position.set(0, h + 1.1, 0),
      (N.castShadow = !0),
      b.add(N));
    let B = new j.Mesh(new j.BoxGeometry(c - 1.2, 3.6, 0.2), x.kind === "vacant" ? Xt.stone : Xt.interior);
    (B.position.set(0, 1.8, T - 2.4), b.add(B));
    let X = new j.Mesh(new j.BoxGeometry(c - 1.2, 0.1, 2.4), Xt.wood);
    (X.position.set(0, 0.05, T - 1.2), b.add(X));
    for (let Lt of [-c / 2 + 0.3, c / 2 - 0.3]) {
      let ae = new j.Mesh(new j.BoxGeometry(0.6, 3.9, 0.6), Xt.pilaster);
      (ae.position.set(Lt, 1.95, T - 0.2), (ae.castShadow = !0), b.add(ae));
    }
    let M = new j.Mesh(new j.BoxGeometry(c, 0.5, 0.6), Xt.pilaster);
    (M.position.set(0, 3.85, T - 0.2), b.add(M));
    let _ = new j.Mesh(new j.PlaneGeometry(c - 3.4, 3.2), Xt.glass);
    (_.position.set(-1.1, 1.75, T - 0.1), b.add(_));
    let lt = c / 2 - 1.9,
      vt = new j.Mesh(
        new j.BoxGeometry(1.6, 3, 0.08),
        x.kind === "vacant"
          ? Xt.shutter
          : new j.MeshStandardMaterial({
              color: new j.Color(x.primary).multiplyScalar(0.8),
              roughness: 0.5,
              metalness: 0.2,
            }),
      );
    (vt.position.set(lt, 1.5, T - 0.12), b.add(vt));
    let zt = new j.Mesh(new j.PlaneGeometry(1, 1.8), Xt.glass);
    (zt.position.set(lt, 1.8, T - 0.07), b.add(zt));
    let Pe = new j.Mesh(
      new j.BoxGeometry(c - 0.6, 0.06, 2.2),
      new j.MeshStandardMaterial({
        map: $N(x.kind === "vacant" ? "#d6d2c8" : x.primary, x.kind === "vacant" ? "#ece7dc" : "#f4f1ea"),
        roughness: 0.85,
      }),
    );
    (Pe.position.set(0, 4.25, T + 0.9), (Pe.rotation.x = 0.28), (Pe.castShadow = !0), b.add(Pe));
    let Je = new j.MeshStandardMaterial({
      map: M0(x),
      emissiveMap: null,
      emissive: "#ffffff",
      emissiveIntensity: 0.15,
      roughness: 0.6,
    });
    ((Je.emissiveMap = Je.map), Mo.push(Je));
    let Ua = new j.Mesh(new j.BoxGeometry(c - 1.4, 1.55, 0.14), [
      Xt.dark,
      Xt.dark,
      Xt.dark,
      Xt.dark,
      Je,
      Xt.dark,
    ]);
    (Ua.position.set(0, 5.6, T + 0.12), b.add(Ua));
    let Ja = new j.Mesh(
      new j.BoxGeometry(0.12, 1.6, 0.9),
      new j.MeshStandardMaterial({ color: x.primary, roughness: 0.6 }),
    );
    (Ja.position.set(c / 2 - 0.4, 6.6, T + 0.6), b.add(Ja));
    let je = new j.Mesh(new j.BoxGeometry(c - 1.4, 0.06, 0.06), Xt.dark);
    (je.position.set(0, 5 + 1.6, T + 0.35), b.add(je));
    let ye = new j.Group();
    if ((ye.position.set(-1.1, 0, T - 1.4), b.add(ye), x.kind === "brand"))
      (a.find((ae) => ae.id === x.refId)?.products || []).slice(0, 3).forEach((ae, ka) => {
        let ja = new j.Mesh(new j.CylinderGeometry(0.45, 0.5, 0.9, 20), Xt.white);
        (ja.position.set((ka - 1) * 2.1, 0.45, 0), ye.add(ja));
        let mr = pd(ae);
        (mr.position.set((ka - 1) * 2.1, 0.92, 0), mr.scale.setScalar(0.9), ye.add(mr), s.push(mr));
      });
    else if (x.kind === "agent") {
      let Lt = new j.Mesh(
        new j.BoxGeometry(2.6, 1.6, 0.1),
        new j.MeshStandardMaterial({
          map: e7(x.name, "AI agent \xB7 live demo", x.primary, x.secondary),
          emissive: "#ffffff",
          emissiveIntensity: 0.5,
          roughness: 0.3,
        }),
      );
      ((Lt.material.emissiveMap = Lt.material.map), Lt.position.set(0, 1.8, 0.2), ye.add(Lt));
      let ae = new j.Mesh(new j.BoxGeometry(0.12, 1, 0.12), Xt.steel);
      (ae.position.set(0, 0.5, 0.2), ye.add(ae));
    } else if (x.kind === "service") {
      let Lt = new j.Mesh(
        new j.BoxGeometry(2.4, 1.8, 0.06),
        new j.MeshStandardMaterial({
          map: e7(x.name.split("'")[0], "Services \xB7 from studio", x.primary, x.secondary),
          roughness: 0.6,
        }),
      );
      (Lt.position.set(0, 1.6, 0.2), (Lt.rotation.x = -0.08), ye.add(Lt));
      let ae = new j.Mesh(new j.BoxGeometry(2.6, 0.8, 1), Xt.wood);
      (ae.position.set(0, 0.4, -0.4), ye.add(ae));
    } else if (x.kind === "game") {
      let Lt = Gg(x.secondary);
      (Lt.position.set(0, 0, 0), ye.add(Lt));
    } else if (x.kind === "cafe") {
      let Lt = new j.Mesh(new j.BoxGeometry(4, 1.1, 0.8), Xt.wood);
      (Lt.position.set(0, 0.55, -0.2), ye.add(Lt));
      let ae = new j.Mesh(new j.BoxGeometry(0.8, 0.6, 0.5), Xt.steel);
      (ae.position.set(-1, 1.4, -0.3), ye.add(ae));
    } else {
      let Lt = new j.Mesh(new j.BoxGeometry(c - 3.4, 2.2, 0.05), Xt.shutter);
      (Lt.position.set(0, 2.25, 1.25), ye.add(Lt));
    }
    let cn = new j.Mesh(
      new j.PlaneGeometry(1.1, 0.42),
      new j.MeshStandardMaterial({ map: UN(x.no || ""), roughness: 0.5 }),
    );
    if ((cn.position.set(c / 2 - 0.62, 3.2, T + 0.32), b.add(cn), x.kind === "dream"))
      if (x.refId === "motors") {
        let Lt = Rr("sports", "#c0392b");
        (Lt.position.set(0, 0, 0.1), (Lt.rotation.y = 0.9), ye.add(Lt));
      } else {
        let Lt = new j.Group(),
          ae = new j.Mesh(new j.BoxGeometry(1.6, 0.9, 1.1), Xt.white);
        ae.position.y = 1.35;
        let ka = new j.Mesh(new j.ConeGeometry(1.2, 0.6, 4), Xt.roof);
        ((ka.position.y = 2.1), (ka.rotation.y = Math.PI / 4));
        let ja = new j.Mesh(new j.BoxGeometry(2.4, 0.9, 1.6), Xt.wood);
        ((ja.position.y = 0.45), Lt.add(ja, ae, ka), ye.add(Lt));
      }
    let Uo = new j.MeshStandardMaterial({ map: E0(x, e(x.id)), roughness: 0.8 }),
      Gn = new j.Mesh(new j.BoxGeometry(0.9, 1.15, 0.05), [Xt.wood, Xt.wood, Xt.wood, Xt.wood, Uo, Xt.wood]);
    (Gn.position.set(-c / 2 + 1.3, 0.62, T + 1.4),
      (Gn.rotation.x = -0.18),
      b.add(Gn),
      i.set(x.id, { mat: Uo, sig: "" }));
    let We = new j.Group();
    if ((We.position.set(-1.5, 0, T + 4.2), b.add(We), x.kind === "cafe"))
      for (let Lt of [-2.2, 1.6]) {
        let ae = new j.Mesh(new j.CylinderGeometry(0.45, 0.45, 0.05, 16), Xt.white);
        ae.position.set(Lt, 0.75, 0);
        let ka = new j.Mesh(new j.CylinderGeometry(0.04, 0.04, 0.75, 6), Xt.dark);
        ka.position.set(Lt, 0.37, 0);
        let ja = new j.Mesh(
          new j.ConeGeometry(1.3, 0.5, 8, 1, !0),
          new j.MeshStandardMaterial({ color: "#3b2a1e", side: j.DoubleSide }),
        );
        ja.position.set(Lt, 2.4, 0);
        let mr = new j.Mesh(new j.CylinderGeometry(0.03, 0.03, 2.2, 6), Xt.steel);
        (mr.position.set(Lt, 1.2, 0), We.add(ae, ka, ja, mr));
        for (let fo of [-0.7, 0.7]) {
          let ie = new j.Mesh(new j.BoxGeometry(0.45, 0.45, 0.45), Xt.wood);
          (ie.position.set(Lt + fo, 0.25, 0), We.add(ie));
        }
      }
    if (
      (x.kind === "dream" &&
        x.refId === "motors" &&
        [
          ["super", "#f1c40f", -2.6],
          ["suv", "#2b2b2b", 2.6],
        ].forEach(([Lt, ae, ka]) => {
          let ja = Rr(Lt, ae);
          (ja.position.set(ka, 0, 1.2), (ja.rotation.y = Math.PI / 2), We.add(ja));
        }),
      x.kind === "game")
    ) {
      if (x.refId === "race") {
        let Lt = Rr("sports", "#c0392b");
        (Lt.position.set(0.5, 0, 0.6), (Lt.rotation.y = 1.2), We.add(Lt));
      } else if (x.refId === "hockey") {
        let Lt = Zx();
        (Lt.position.set(0.5, 0, 0), (Lt.rotation.y = Math.PI / 2), We.add(Lt));
      } else if (x.refId === "catcher") {
        let Lt = new j.Mesh(new j.CylinderGeometry(0.8, 1, 1, 20), Xt.stone);
        Lt.position.set(0.5, 0.5, 0);
        let ae = zg(0.55);
        (ae.position.set(0.5, 2, 0), (ae.userData.float = 2), We.add(Lt, ae), s.push(ae));
      } else if (x.refId === "trivia") {
        let Lt = new j.Mesh(
          new j.TorusGeometry(0.6, 0.18, 10, 24, Math.PI * 1.4),
          new j.MeshStandardMaterial({ color: "#45e0ae", roughness: 0.4 }),
        );
        (Lt.position.set(0.5, 2.4, 0), (Lt.rotation.z = -0.6));
        let ae = new j.Mesh(new j.SphereGeometry(0.2, 12, 8), Lt.material);
        ae.position.set(0.5, 1.1, 0);
        let ka = new j.Mesh(new j.BoxGeometry(0.2, 1.3, 0.2), Lt.material);
        (ka.position.set(0.55, 1.65, 0), We.add(Lt, ae, ka));
      } else if (x.refId === "connect4") {
        let Lt = new j.Mesh(
          new j.BoxGeometry(1.6, 1.4, 0.2),
          new j.MeshStandardMaterial({ color: "#1f4fbf", roughness: 0.5 }),
        );
        (Lt.position.set(0.5, 1, 0), We.add(Lt));
        for (let ae = 0; ae < 6; ae++) {
          let ka = new j.Mesh(
            new j.CylinderGeometry(0.1, 0.1, 0.22, 14),
            new j.MeshStandardMaterial({ color: ae % 2 ? "#f1c40f" : "#e53935" }),
          );
          ((ka.rotation.x = Math.PI / 2),
            ka.position.set(-0.1 + (ae % 3) * 0.3 + 0.3, 0.55 + Math.floor(ae / 3) * 0.25, 0.02),
            We.add(ka));
        }
      } else if (x.refId === "kart") {
        let Lt = _N("#2980b9");
        (Lt.scale.setScalar(0.6), Lt.position.set(0.5, 0, 0), (Lt.rotation.y = -0.8), We.add(Lt));
      } else if (x.refId === "chess")
        for (let Lt = 0; Lt < 3; Lt++) {
          let ae = new j.Mesh(
            new j.CylinderGeometry(0.25, 0.4, 1.2 + Lt * 0.3, 12),
            Lt % 2 ? Xt.dark : Xt.white,
          );
          (ae.position.set(-0.4 + Lt * 0.8, (1.2 + Lt * 0.3) / 2, 0), We.add(ae));
        }
      else if (x.refId === "carrom" || x.refId === "ludo") {
        let Lt = new j.Mesh(
          new j.BoxGeometry(1.6, 0.1, 1.6),
          new j.MeshStandardMaterial({ color: x.refId === "ludo" ? "#f1c40f" : "#e2c89a", roughness: 0.6 }),
        );
        Lt.position.set(0.5, 0.9, 0);
        let ae = new j.Mesh(new j.BoxGeometry(0.2, 0.85, 0.2), Xt.wood);
        (ae.position.set(0.5, 0.43, 0), We.add(Lt, ae));
      }
      if (!x.ready) {
        let Lt = new j.Mesh(
          new j.PlaneGeometry(c - 3.6, 0.7),
          new j.MeshStandardMaterial({ color: "#f1c40f", roughness: 0.7 }),
        );
        (Lt.position.set(-1.1, 2.8, T - 0.05), b.add(Lt));
      }
    }
    b.updateMatrixWorld(!0);
    let zr = new j.Vector3(lt, 0, T + 1.6);
    (b.localToWorld(zr), (zr.y = 0));
    let wr = x.kind === "vacant" ? "vacant" : "shop",
      fr =
        x.kind === "vacant"
          ? "Empty unit \u2014 open your shop here"
          : x.kind === "game"
            ? x.ready
              ? `Play ${x.name}`
              : `${x.name} \u2014 coming soon`
            : `Enter ${x.name}`;
    o.push({ pos: zr, radius: 2.4, label: fr, action: wr, payload: x.id, obj: vt });
    let So = new j.Vector3(-1.1, 0, T + 2.4);
    (b.localToWorld(So),
      (So.y = 0),
      o.push({
        pos: So,
        radius: 2.6,
        label: x.kind === "vacant" ? "Unit for rent" : `${x.name} \u2014 shop info`,
        action: wr === "vacant" ? "vacant" : "shopview",
        payload: x.id,
        obj: Ua,
      }),
      n.push({ x: w, z: O2(x.row) ? L - 1.2 : L + 1.2, r: 6.6 }));
  });
  for (let x of [0, Vr.z2])
    for (let k = Vr.x0 + 6; k < _c(Vr.slots - 1); k += 24) {
      let b = new j.Mesh(new j.CylinderGeometry(1.3, 1.4, 0.7, 16), Xt.stone);
      (b.position.set(k, 0.35, x), (b.castShadow = !0), r.add(b));
      let w = ya("#a1b2c3", 1);
      (w.position.set(k, 0.6, x), r.add(w), n.push({ x: k, z: x, r: 1.6 }));
      for (let E of [-4.2, 4.2]) {
        let T = new j.Group(),
          S = new j.Mesh(new j.BoxGeometry(2.4, 0.1, 0.6), Xt.wood);
        S.position.y = 0.48;
        let H = new j.Mesh(new j.BoxGeometry(2.4, 0.5, 0.08), Xt.wood);
        H.position.set(0, 0.78, E > 0 ? 0.28 : -0.28);
        for (let N of [-1, 1]) {
          let B = new j.Mesh(new j.BoxGeometry(0.08, 0.48, 0.5), Xt.dark);
          (B.position.set(N, 0.24, 0), T.add(B));
        }
        (T.add(S, H), T.position.set(k + 12, 0, E + x), r.add(T));
      }
      for (let E of [-9.6, 9.6]) {
        let T = new j.Mesh(new j.CylinderGeometry(0.07, 0.1, 4.6, 8), Xt.dark);
        (T.position.set(k + 12, 2.3, E + x), r.add(T));
        let S = new j.Mesh(new j.SphereGeometry(0.22, 12, 8), Xa);
        (S.position.set(k + 12, 4.7, E + x), r.add(S));
      }
      let L = [];
      for (let E = 0; E <= 12; E++) {
        let T = E / 12;
        L.push(new j.Vector3(k + 12, 7.2 - Math.sin(T * Math.PI) * 1.1, -10.8 + T * 21.6 + x));
      }
      r.add(
        new j.Line(new j.BufferGeometry().setFromPoints(L), new j.LineBasicMaterial({ color: "#2b2b2b" })),
      );
      for (let E = 1; E < 12; E += 2) {
        let T = new j.Mesh(new j.SphereGeometry(0.28, 10, 8), Xt.lantern);
        ((T.scale.y = 1.25), T.position.copy(L[E]).add(new j.Vector3(0, -0.35, 0)), r.add(T), l.push(T));
      }
    }
  for (let [x, k] of [
    [0, "FYRUS MARKET"],
    [Vr.z2, "MARKET AVENUE"],
  ]) {
    let b = new j.Group();
    b.position.set(40, 0, x);
    for (let S of [-10.5, 10.5]) {
      let H = new j.Mesh(new j.BoxGeometry(1.4, 9, 1.4), Xt.pilaster);
      (H.position.set(0, 4.5, S), (H.castShadow = !0), b.add(H), n.push({ x: 40, z: S + x, r: 1.1 }));
    }
    let w = new j.Mesh(new j.BoxGeometry(1.2, 1.6, 22.4), Xt.roof);
    ((w.position.y = 9.4), b.add(w));
    let L = new j.MeshStandardMaterial({
      map: M0({
        id: "gate",
        kind: "cafe",
        refId: "",
        row: "N",
        slot: 0,
        name: k,
        tagline: "AI agents \xB7 Services \xB7 Brands \xB7 Games \xB7 Club",
        primary: "#0f2a4a",
        secondary: "#f3c14b",
        facade: "",
        font: "display",
        glyph: "F",
      }),
      emissive: "#ffffff",
      emissiveIntensity: 0.2,
    });
    ((L.emissiveMap = L.map), Mo.push(L));
    let E = new j.Mesh(new j.PlaneGeometry(14, 2.4), L);
    (E.position.set(-0.62, 9.4, 0), (E.rotation.y = -Math.PI / 2), b.add(E));
    let T = E.clone();
    ((T.position.x = 0.62), (T.rotation.y = Math.PI / 2), b.add(T), r.add(b));
  }
  let u = new j.Group();
  (u.position.set(318, 0, 0), (u.rotation.y = -Math.PI / 2));
  let p = new j.Mesh(
    new j.BoxGeometry(30, 13, 26),
    Ea({ base: "#2a2d34", tint: "#5a2a6a", kind: 0, h: 13, seed: 0.77, cell: [1.4, 13] }),
  );
  ((p.position.y = 6.5), (p.castShadow = !0), u.add(p));
  let v = [];
  for (let x = 0; x < 6; x++) {
    let k = new j.Mesh(
      new j.BoxGeometry(30.2, 0.12, 0.12),
      new j.MeshStandardMaterial({ color: "#000", emissive: "#ff3cac", emissiveIntensity: 1.5 }),
    );
    (k.position.set(0, 2 + x * 1.9, 13.06), u.add(k), v.push(k));
  }
  let g = new j.MeshStandardMaterial({
    map: M0({
      id: "club",
      kind: "cafe",
      refId: "",
      row: "N",
      slot: 0,
      name: "SKYLINE CLUB",
      tagline: "Live DJ every night \xB7 rooftop bar",
      primary: "#0d0d12",
      secondary: "#ff3cac",
      facade: "",
      font: "display",
      glyph: "\u2605",
    }),
    emissive: "#ffffff",
    emissiveIntensity: 0.6,
  });
  g.emissiveMap = g.map;
  let m = new j.Mesh(new j.PlaneGeometry(16, 2.75), g);
  (m.position.set(0, 10.8, 13.1), u.add(m));
  let f = new j.Mesh(
    new j.BoxGeometry(4, 3.4, 0.2),
    new j.MeshStandardMaterial({ color: "#111", metalness: 0.6, roughness: 0.3 }),
  );
  (f.position.set(0, 1.7, 13.05), u.add(f));
  for (let x = 0; x < 4; x++) {
    let k = new j.Mesh(new j.CylinderGeometry(0.06, 0.08, 1, 8), Xt.steel);
    (k.position.set(-3 + x * 2, 0.5, 15.5), u.add(k));
  }
  let y = new j.Mesh(new j.BoxGeometry(6, 0.06, 0.06), new j.MeshStandardMaterial({ color: "#8b0000" }));
  return (
    y.position.set(0, 0.9, 15.5),
    u.add(y),
    r.add(u),
    n.push({ x: 318, z: 0, r: 15.5 }),
    o.push({
      pos: new j.Vector3(301, 0, 0),
      radius: 3.4,
      label: "Enter Skyline Club",
      action: "club",
      obj: f,
    }),
    {
      group: r,
      interacts: o,
      colliders: n,
      statBoards: i,
      tick: (x, k) => {
        (s.forEach((b) => {
          ((b.rotation.y += x * 0.6),
            b.userData.float && (b.position.y = b.userData.float + Math.sin(k * 1.5) * 0.15));
        }),
          v.forEach((b, w) => b.material.emissive.setHSL((k * 0.08 + w * 0.12) % 1, 0.9, 0.55)),
          l.forEach((b, w) => (b.rotation.z = Math.sin(k * 1.2 + w) * 0.08)));
      },
    }
  );
}
var $ = P(ea(), 1);
function YN(t, e) {
  let a = document.createElement("canvas");
  a.width = a.height = 512;
  let r = a.getContext("2d"),
    o = new $.Color(t);
  if (((r.fillStyle = "#" + o.getHexString()), r.fillRect(0, 0, 512, 512), e === "wood")) {
    for (let i = 0; i < 512; i += 32) {
      let s = (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.12;
      ((r.fillStyle = `rgba(0,0,0,${0.04 + s})`),
        r.fillRect(0, i, 512, 32),
        (r.fillStyle = "rgba(0,0,0,0.25)"),
        r.fillRect(0, i, 512, 2));
      let l = (i * 37) % 512;
      r.fillRect(l, i, 2, 32);
    }
    for (let i = 0; i < 300; i++)
      ((r.fillStyle = `rgba(60,30,10,${Math.random() * 0.06})`),
        r.fillRect(Math.random() * 512, Math.random() * 512, 40 + Math.random() * 80, 1));
  } else if (e === "tile")
    for (let i = 0; i < 512; i += 64)
      for (let s = 0; s < 512; s += 64)
        ((r.fillStyle = `rgba(0,0,0,${((s + i) / 64) % 2 ? 0.05 : 0})`),
          r.fillRect(s, i, 64, 64),
          (r.strokeStyle = "rgba(0,0,0,0.18)"),
          (r.lineWidth = 2),
          r.strokeRect(s, i, 64, 64));
  else
    for (let i = 0; i < 2e3; i++)
      ((r.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "0,0,0"},${Math.random() * 0.05})`),
        r.fillRect(Math.random() * 512, Math.random() * 512, 3, 3));
  let n = new $.CanvasTexture(a);
  return ((n.wrapS = n.wrapT = $.RepeatWrapping), n);
}
var et = (t, e = 0.8, a = 0) => new $.MeshStandardMaterial({ color: t, roughness: e, metalness: a });
