function nc(t, e, a, r) {
  let o = new Z.MeshStandardMaterial({
    map: CN(t, e, a),
    emissive: "#fff",
    emissiveIntensity: 0.15,
    side: Z.DoubleSide,
  });
  return ((o.emissiveMap = o.map), Mo.push(o), new Z.Mesh(new Z.PlaneGeometry(r, r / 4), o));
}
function TN(t, e) {
  let a = new Z.Group();
  a.position.set(t, 0, e);
  let r = new Z.Mesh(new Z.CylinderGeometry(0.07, 0.1, 4.2, 8), Fe.dark);
  ((r.position.y = 2.1), a.add(r));
  let o = new Z.Mesh(new Z.SphereGeometry(0.22, 12, 8), Xa);
  return ((o.position.y = 4.3), a.add(o), a);
}
function ML() {
  let t = new Z.Group(),
    e = new Z.Vector3(lr.x, 0, lr.z);
  t.position.copy(e);
  let a = [],
    r = [],
    o = (Ht, it, ft = 0) => new Z.Vector3(e.x + Ht, ft, e.z + it),
    n = new Z.Mesh(new Z.CircleGeometry(lr.r, 64), ao("#7b9a5a", 1));
  ((n.rotation.x = -Math.PI / 2), (n.position.y = 0.04), (n.receiveShadow = !0), t.add(n));
  let i = new Z.Mesh(new Z.RingGeometry(20, 26, 64), ao("#d8cfbf", 0.95));
  ((i.rotation.x = -Math.PI / 2), (i.position.y = 0.06), t.add(i));
  for (let Ht = 0; Ht < 72; Ht++) {
    let it = (Ht / 72) * Math.PI * 2;
    if (Math.abs(it - Math.PI * 0.75) < 0.12) continue;
    let ft = new Z.Mesh(new Z.BoxGeometry(0.15, 1.2, 0.15), Fe.white);
    (ft.position.set(Math.cos(it) * lr.r, 0.6, Math.sin(it) * lr.r), t.add(ft));
  }
  let s = Math.PI * 0.75,
    l = Math.cos(s) * lr.r,
    c = Math.sin(s) * lr.r,
    d = new Z.Group();
  (d.position.set(l, 0, c), (d.rotation.y = Math.atan2(-l, -c)));
  for (let Ht of [-5, 5]) {
    let it = new Z.Mesh(new Z.CylinderGeometry(0.5, 0.6, 7, 12), Fe.red);
    (it.position.set(Ht, 3.5, 0), d.add(it));
    let ft = new Z.Mesh(new Z.SphereGeometry(0.8, 16, 12), Fe.yellow);
    (ft.position.set(Ht, 7.4, 0), d.add(ft));
  }
  let h = nc("FYRUS JOYLAND", "Rides \xB7 games \xB7 snacks", "#ff9a3c", 10);
  (h.position.set(0, 6, 0.4), d.add(h));
  let u = h.clone();
  ((u.rotation.y = Math.PI), (u.position.z = -0.4), d.add(u), t.add(d));
  for (let Ht = 0; Ht < 10; Ht++) {
    let it = (Ht / 10) * Math.PI * 2 + 0.2;
    t.add(TN(Math.cos(it) * 27, Math.sin(it) * 27));
    let ft = ya(Ht % 2 ? "#4f7f35" : "#5d8a3f", 1);
    (ft.position.set(Math.cos(it) * 40, 0, Math.sin(it) * 40), t.add(ft));
  }
  let p = new Z.Vector3(-18, 16, -8),
    v = 13,
    g = 12,
    m = new Z.Group();
  (m.position.copy(p), t.add(m));
  let f = new Z.Mesh(new Z.TorusGeometry(v, 0.25, 8, 64), Fe.steel);
  ((f.rotation.y = Math.PI / 2), m.add(f));
  let y = f.clone();
  ((y.position.x = 1.2), m.add(y));
  for (let Ht = 0; Ht < g; Ht++) {
    let it = (Ht / g) * Math.PI * 2,
      ft = new Z.Mesh(new Z.BoxGeometry(0.12, v * 2, 0.12), Fe.steel);
    ((ft.rotation.x = it), (ft.position.x = 0.6), m.add(ft));
  }
  let x = new Z.Mesh(new Z.CylinderGeometry(1, 1, 2, 16), Fe.dark);
  ((x.rotation.z = Math.PI / 2), (x.position.x = 0.6), m.add(x));
  for (let Ht of [-1, 1]) {
    let it = new Z.Mesh(new Z.BoxGeometry(0.5, 17, 0.5), Fe.white);
    (it.position.set(p.x + 0.6 + Ht * 2.2, 8, p.z - 5),
      (it.rotation.x = 0.33),
      (it.rotation.z = Ht * -0.1),
      t.add(it));
    let ft = it.clone();
    ((ft.position.z = p.z + 5), (ft.rotation.x = -0.33), t.add(ft));
  }
  let k = [],
    b = ["#d63a3a", "#2f6fe0", "#f4c20d", "#45e0ae"];
  for (let Ht = 0; Ht < g; Ht++) {
    let it = new Z.Group(),
      ft = new Z.Mesh(new Z.CylinderGeometry(1, 1, 1.6, 12), ao(b[Ht % 4], 0.4));
    ((ft.position.y = -1.3), it.add(ft));
    let Re = new Z.Mesh(new Z.ConeGeometry(1.1, 0.6, 12), Fe.white);
    ((Re.position.y = -0.2), it.add(Re), t.add(it), k.push(it));
  }
  let w = (Ht) => {
    let it = m.rotation.x + (Ht / g) * Math.PI * 2;
    return new Z.Vector3(p.x + 0.6, p.y - Math.cos(it) * v, p.z + Math.sin(it) * v);
  };
  (a.push({
    pos: o(-18, 2),
    radius: 3.5,
    label: "Fyrus Eye \u2014 30 FYC ride",
    action: "ride",
    payload: "wheel",
  }),
    r.push({ x: e.x - 17.4, z: e.z - 8, r: 4 }));
  let L = nc("FYRUS EYE", "30 FYC \xB7 40 seconds", "#ffc27a", 5);
  (L.position.set(-18, 2.4, 3), t.add(L));
  let E = new Z.Vector3(16, 0, -14),
    T = new Z.Group();
  (T.position.copy(E), t.add(T));
  let S = new Z.Mesh(new Z.CylinderGeometry(6.5, 6.8, 0.6, 32), ao("#e9d8b8", 0.6));
  ((S.position.y = 0.3), t.add(S), S.position.set(E.x, 0.3, E.z));
  let H = new Z.Mesh(new Z.CylinderGeometry(6.2, 6.2, 0.2, 32), Fe.red);
  ((H.position.y = 0.7), T.add(H));
  let N = new Z.Mesh(new Z.CylinderGeometry(0.6, 0.6, 5, 16), ao("#ffc27a", 0.3, 0.6));
  ((N.position.y = 3.2), T.add(N));
  let B = new Z.Mesh(
    new Z.ConeGeometry(7, 2.6, 24),
    new Z.MeshStandardMaterial({ color: "#f4f4f2", roughness: 0.6 }),
  );
  ((B.position.y = 6.6), T.add(B));
  let X = [];
  for (let Ht = 0; Ht < 12; Ht++) {
    let it = (Ht / 12) * Math.PI * 2,
      ft = new Z.Group();
    (ft.position.set(Math.cos(it) * 4.6, 0, Math.sin(it) * 4.6), (ft.rotation.y = -it));
    let Re = new Z.Mesh(new Z.CylinderGeometry(0.05, 0.05, 5, 6), Fe.steel);
    ((Re.position.y = 3), ft.add(Re));
    let ke = new Z.Mesh(new Z.BoxGeometry(0.5, 0.6, 1.4), ao(Ht % 2 ? "#ffffff" : "#c9a36a", 0.5));
    ((ke.position.y = 1.8), (ke.name = "b"), ft.add(ke));
    let na = new Z.Mesh(new Z.BoxGeometry(0.35, 0.6, 0.4), ke.material);
    (na.position.set(0, 2.3, 0.7), (na.name = "hd"), ft.add(na), T.add(ft), X.push(ft));
  }
  a.push({
    pos: o(16, -6.5),
    radius: 3.5,
    label: "Carousel \u2014 sit on a horse (free)",
    action: "ride",
    payload: "carousel",
  });
  {
    let Ht = nc("CAROUSEL", "Free \xB7 press E to sit", "#d63a3a", 4);
    (Ht.position.set(16, 2.2, -6.6), t.add(Ht));
  }
  r.push({ x: e.x + 16, z: e.z - 14, r: 6.8 });
  let M = new Z.Vector3(18, 0, 16),
    _ = new Z.Mesh(new Z.CylinderGeometry(0.6, 0.9, 13, 16), Fe.blue);
  (_.position.set(M.x, 6.5, M.z), t.add(_));
  let lt = new Z.Group();
  (lt.position.set(M.x, 12, M.z), t.add(lt));
  let vt = new Z.Mesh(new Z.CylinderGeometry(3.4, 3.4, 0.6, 24), Fe.yellow);
  lt.add(vt);
  let zt = [];
  for (let Ht = 0; Ht < 12; Ht++) {
    let it = new Z.Group();
    ((it.rotation.y = (Ht / 12) * Math.PI * 2), lt.add(it));
    let ft = new Z.Group();
    ((ft.position.x = 3.2), it.add(ft));
    let Re = new Z.Mesh(new Z.CylinderGeometry(0.03, 0.03, 6, 4), Fe.steel);
    ((Re.position.y = -3), ft.add(Re));
    let ke = new Z.Mesh(new Z.BoxGeometry(0.8, 0.12, 0.7), Fe.red);
    ((ke.position.y = -6), ft.add(ke));
    let na = new Z.Mesh(new Z.BoxGeometry(0.8, 0.7, 0.08), Fe.red);
    (na.position.set(0, -5.65, -0.33), ft.add(na), zt.push({ arm: ft, seat: ke }));
  }
  a.push({
    pos: o(18, 25),
    radius: 3.5,
    label: "Sky Swings \u2014 take a seat (free)",
    action: "ride",
    payload: "swings",
  });
  {
    let Ht = nc("SKY SWINGS", "Free \xB7 press E to sit", "#2f6fe0", 4);
    (Ht.position.set(18, 2.2, 25.2), t.add(Ht));
    let it = new Z.Mesh(new Z.CylinderGeometry(2.2, 2.2, 0.3, 20), Fe.wood);
    (it.position.set(18, 0.15, 24), t.add(it));
  }
  r.push({ x: e.x + 18, z: e.z + 16, r: 1.2 });
  let Pe = new Z.Vector3(2, 0, -14),
    Je = new Z.Group();
  (Je.position.copy(Pe), t.add(Je));
  for (let Ht of [-4.6, 4.6])
    for (let it of [-1.2, 1.2]) {
      let ft = new Z.Mesh(new Z.CylinderGeometry(0.1, 0.12, 4.6, 8), Fe.blue);
      (ft.position.set(Ht, 2.2, it * 0.6), (ft.rotation.x = it > 0 ? -0.26 : 0.26), Je.add(ft));
    }
  let Ua = new Z.Mesh(new Z.CylinderGeometry(0.12, 0.12, 9.4, 10), Fe.yellow);
  ((Ua.rotation.z = Math.PI / 2), (Ua.position.y = 4.4), Je.add(Ua));
  let Ja = [];
  for (let Ht = 0; Ht < 4; Ht++) {
    let it = new Z.Group();
    (it.position.set(-3.3 + Ht * 2.2, 4.4, 0), Je.add(it));
    for (let Re of [-0.35, 0.35]) {
      let ke = new Z.Mesh(new Z.CylinderGeometry(0.02, 0.02, 3.6, 4), Fe.steel);
      (ke.position.set(Re, -1.8, 0), it.add(ke));
    }
    let ft = new Z.Mesh(new Z.BoxGeometry(0.9, 0.08, 0.45), Fe.wood);
    ((ft.position.y = -3.6), it.add(ft), Ja.push(it));
  }
  (r.push({ x: e.x + Pe.x - 4.6, z: e.z + Pe.z, r: 0.6 }, { x: e.x + Pe.x + 4.6, z: e.z + Pe.z, r: 0.6 }),
    a.push({
      pos: o(Pe.x, Pe.z + 2.6),
      radius: 3.2,
      label: "Garden swings \u2014 sit and swing (free)",
      action: "ride",
      payload: "jhoola",
    }));
  {
    let Ht = nc("GARDEN SWINGS", "Free \xB7 press E to sit", "#45e0ae", 4);
    (Ht.position.set(Pe.x, 5.6, Pe.z), t.add(Ht));
  }
  let je = [
      [-30, 2, 10],
      [-22, 12, 30],
      [-8, 16, 36],
      [6, 6, 34],
      [12, 3, 26],
      [4, 9, 16],
      [-8, 4, 14],
      [-16, 7, 20],
      [-20, 3, 8],
      [-26, 1.6, 6],
    ].map(([Ht, it, ft]) => new Z.Vector3(Ht, it, ft)),
    ye = new Z.CatmullRomCurve3(je, !0, "catmullrom", 0.5),
    cn = new Z.Mesh(new Z.TubeGeometry(ye, 300, 0.35, 8, !0), Fe.red);
  ((cn.castShadow = !0), t.add(cn));
  for (let Ht = 0; Ht < 60; Ht++) {
    let it = ye.getPointAt(Ht / 60);
    if (it.y < 1.5) continue;
    let ft = new Z.Mesh(new Z.CylinderGeometry(0.12, 0.16, it.y, 6), Fe.white);
    (ft.position.set(it.x, it.y / 2, it.z), t.add(ft));
  }
  let Uo = new Z.Group(),
    Gn = new Z.Mesh(new Z.BoxGeometry(1.6, 0.7, 3), Fe.yellow);
  ((Gn.position.y = 0.6), Uo.add(Gn));
  let We = new Z.Mesh(new Z.BoxGeometry(1.4, 0.6, 0.2), Fe.dark);
  (We.position.set(0, 1.1, -0.4), Uo.add(We), t.add(Uo));
  let zr = ye.getPointAt(0),
    wr = new Z.Mesh(new Z.BoxGeometry(5, 1.4, 6), ao("#efe6d6", 0.8));
  (wr.position.set(zr.x - 3, 0.7, zr.z + 1),
    t.add(wr),
    a.push({
      pos: o(zr.x - 3, zr.z + 5),
      radius: 3.5,
      label: "Thunder Loop \u2014 50 FYC ride",
      action: "ride",
      payload: "coaster",
    }));
  let fr = nc("THUNDER LOOP", "50 FYC \xB7 2 laps", "#d63a3a", 5);
  (fr.position.set(zr.x - 3, 3.2, zr.z + 4.2), t.add(fr));
  let So = new Z.Group();
  (So.position.set(0, 0, -28), t.add(So));
  let Lt = new Z.Mesh(new Z.BoxGeometry(4, 2.2, 2.4), ao("#f4f4f2", 0.6));
  ((Lt.position.y = 1.1), So.add(Lt));
  let ae = new Z.Mesh(new Z.BoxGeometry(4.6, 0.12, 3.2), Fe.red);
  (ae.position.set(0, 2.6, 0.4), So.add(ae));
  let ka = nc("POPCORN & SODA", "Free during launch", "#f4c20d", 4);
  (ka.position.set(0, 3.4, 1.3), So.add(ka), r.push({ x: e.x, z: e.z - 28, r: 2.4 }));
  let ja = 0,
    mr = 0,
    fo = 0,
    ie = 0,
    jr = 0,
    dn = (Ht, it) => {
      ((ja += Ht * ((Math.PI * 2) / 40)),
        (m.rotation.x = ja),
        k.forEach((ke, na) => {
          let Wa = w(na);
          ke.position.set(Wa.x - e.x, Wa.y, Wa.z - e.z);
        }),
        (mr += Ht * 0.5),
        (T.rotation.y = mr),
        X.forEach((ke, na) => {
          let Wa = Math.sin(it * 2 + na) * 0.35;
          ((ke.getObjectByName("b").position.y = 1.8 + Wa), (ke.getObjectByName("hd").position.y = 2.3 + Wa));
        }),
        (fo += Ht * 1.1),
        (lt.rotation.y = fo),
        zt.forEach((ke) => (ke.arm.rotation.z = 0.6)),
        (jr += Ht),
        Ja.forEach((ke, na) => (ke.rotation.x = Math.sin(jr * 1.9 + na * 1.3) * (na === 1 ? 0.75 : 0.25))),
        (ie = (ie + Ht / 15) % 1));
      let ft = ye.getPointAt(ie),
        Re = ye.getPointAt((ie + 0.01) % 1);
      (Uo.position.copy(ft), Uo.lookAt(Re.x, Re.y, Re.z));
    },
    Vn = (Ht) => (t.updateMatrixWorld(!0), Ht.getWorldPosition(new Z.Vector3()));
  return {
    group: t,
    interacts: a,
    colliders: r,
    tick: dn,
    rides: {
      jhoola: () => {
        let Ht = Ja[1],
          it = Vn(Ht.children[2]);
        return {
          pos: new Z.Vector3(e.x + Pe.x + 7, 2.6, e.z + Pe.z + 6),
          look: it.clone().add(new Z.Vector3(0, 0.4, 0)),
          seat: it.add(new Z.Vector3(0, 0.05, 0)),
          face: 0,
        };
      },
      wheel: (Ht) => {
        let ft = ja + (0 / g) * Math.PI * 2,
          Re = new Z.Vector3(p.x + 0.6 + e.x, p.y - Math.cos(ft) * v - 1.2, p.z + Math.sin(ft) * v + e.z);
        return {
          pos: Re.clone().add(new Z.Vector3(1.6, 0.4, 0)),
          look: Re.clone().add(new Z.Vector3(30, -6, -12)),
          seat: Re.clone().add(new Z.Vector3(0, -0.9, 0)),
        };
      },
      carousel: (Ht) => {
        let it = mr + 0,
          ft = new Z.Vector3(Math.cos(it) * 4.6, 0, -Math.sin(it) * 4.6),
          Re = new Z.Vector3(E.x + e.x + ft.x, 2.9, E.z + e.z + ft.z),
          ke = new Z.Vector3(-Math.sin(it), 0, -Math.cos(it)).multiplyScalar(6);
        return {
          pos: Re,
          look: Re.clone()
            .add(ke)
            .add(new Z.Vector3(0, -0.5, 0)),
          seat: Vn(X[0].getObjectByName("b")).add(new Z.Vector3(0, 0.25, 0)),
          face: -it,
        };
      },
      swings: () => {
        let Ht = fo,
          it = 3.2 + Math.sin(0.6) * 6,
          ft = new Z.Vector3(
            M.x + e.x + Math.cos(Ht) * it,
            12 - Math.cos(0.6) * 6 + 0.6,
            M.z + e.z - Math.sin(Ht) * it,
          ),
          Re = new Z.Vector3(-Math.sin(Ht), 0, -Math.cos(Ht)).multiplyScalar(8);
        return {
          pos: ft,
          look: ft
            .clone()
            .add(Re)
            .add(new Z.Vector3(0, -2, 0)),
          seat: Vn(zt[0].seat).add(new Z.Vector3(0, 0.06, 0)),
          face: -fo,
        };
      },
      coaster: (Ht) => {
        let it = (Ht / 15) % 1,
          ft = ye
            .getPointAt(it)
            .add(e)
            .add(new Z.Vector3(0, 1.8, 0)),
          Re = ye
            .getPointAt((it + 0.015) % 1)
            .add(e)
            .add(new Z.Vector3(0, 1.4, 0));
        return {
          pos: ft,
          look: Re,
          seat: ft.clone().add(new Z.Vector3(0, -1, 0)),
          face: Math.atan2(Re.x - ft.x, Re.z - ft.z),
        };
      },
    },
  };
}
function EL() {
  let t = new Z.Group(),
    e = [],
    a = [],
    r = ao("#cfc8ba", 0.8),
    o = Fe.steel,
    n = (s, l, c, d) => {
      let h = Math.hypot(c - s, d - l),
        u = Math.atan2(c - s, d - l),
        p = (s + c) / 2,
        v = (l + d) / 2,
        g = new Z.Mesh(new Z.BoxGeometry(3.4, 0.6, h), r);
      (g.position.set(p, Ln, v), (g.rotation.y = u), (g.castShadow = !0), t.add(g));
      for (let f of [-0.75, 0.75]) {
        let y = new Z.Mesh(new Z.BoxGeometry(0.12, 0.14, h), o),
          x = new Z.Vector3(f, 0, 0).applyAxisAngle(new Z.Vector3(0, 1, 0), u);
        (y.position.set(p + x.x, Ln + 0.37, v + x.z), (y.rotation.y = u), t.add(y));
      }
      let m = Math.floor(h / 22);
      for (let f = 1; f < m; f++) {
        let y = f / m,
          x = s + (c - s) * y,
          k = l + (d - l) * y,
          b = new Z.Mesh(new Z.CylinderGeometry(0.5, 0.6, Ln, 10), Fe.concrete);
        (b.position.set(x, Ln / 2, k), t.add(b), a.push({ x, z: k, r: 0.8 }));
      }
    };
  ei.forEach((s) => {
    s.id !== ti.id && n(ti.x, ti.z, s.x, s.z);
    let l = new Z.Group();
    (l.position.set(s.x, 0, s.z), t.add(l));
    let c = s.id === ti.id,
      d = new Z.Mesh(new Z.BoxGeometry(c ? 14 : 9, 0.8, c ? 14 : 9), r);
    ((d.position.y = Ln), l.add(d));
    for (let [g, m] of [
      [-3.5, -3.5],
      [3.5, -3.5],
      [-3.5, 3.5],
      [3.5, 3.5],
    ]) {
      let f = new Z.Mesh(new Z.BoxGeometry(0.6, Ln, 0.6), Fe.concrete);
      (f.position.set(g * (c ? 1.6 : 1), Ln / 2, m * (c ? 1.6 : 1)), l.add(f));
    }
    let h = new Z.Mesh(new Z.BoxGeometry(c ? 16 : 10, 0.3, c ? 16 : 10), Fe.glass);
    ((h.position.y = Ln + 4), l.add(h));
    let u = new Z.Mesh(new Z.BoxGeometry(2.6, Ln + 1, 2.6), Fe.glass);
    (u.position.set(0, (Ln + 1) / 2, c ? 8 : 5.5), l.add(u));
    let p = nc(
      `METRO \xB7 ${s.name.toUpperCase()}`,
      c ? "All lines \xB7 10 FYC" : "To the capital and every city \xB7 10 FYC",
      "#4da3ff",
      7,
    );
    (p.position.set(0, 3.2, c ? 9.6 : 7.1), l.add(p));
    let v = p.clone();
    ((v.rotation.y = Math.PI),
      (v.position.z = -(c ? 9.6 : 7.1) + 2),
      l.add(v),
      e.push({
        pos: new Z.Vector3(s.x, 0, s.z + (c ? 9.5 : 7)),
        radius: 3,
        label: `Metro station \xB7 ${s.name} \u2014 ride the train`,
        action: "metro",
        payload: s.id,
      }),
      a.push({ x: s.x, z: s.z + (c ? 8 : 5.5), r: 1.6 }));
  });
  let i = new Z.Group();
  for (let s = 0; s < 3; s++) {
    let l = new Z.Group(),
      c = new Z.Mesh(new Z.BoxGeometry(2.6, 2.6, 9.4), Fe.white);
    ((c.position.y = 1.5), l.add(c));
    let d = new Z.Mesh(new Z.BoxGeometry(2.64, 0.4, 9.42), Fe.blue);
    ((d.position.y = 1.3), l.add(d));
    let h = new Z.Mesh(new Z.BoxGeometry(2.66, 0.8, 8.6), ao("#1a2633", 0.1, 0.8));
    ((h.position.y = 2.1), l.add(h), (l.position.z = -s * 10), i.add(l));
  }
  return ((i.visible = !1), t.add(i), { group: t, interacts: e, colliders: a, train: i });
}
var Wt = P(ea(), 1);
var ns = (t, e = 0.7, a = 0) => new Wt.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  CL = new Wt.MeshStandardMaterial({
    color: "#2d3d4c",
    metalness: 0.6,
    roughness: 0.12,
    emissive: "#ffd9a0",
    emissiveIntensity: 0.05,
  });
Hn.push(CL);
function LL(t, e, a, r, o, n, i = 1.6) {
  for (let s = 0; s < o; s++)
    for (let l = 0; l < n; l++) {
      let c = new Wt.Mesh(new Wt.BoxGeometry(1.1, 1.5, 0.1), CL);
      (c.position.set(-e / 2 + (e / n) * (l + 0.5), i + s * (a / o), r), t.add(c));
    }
}
function TL() {
  let t = new Wt.Group();
  t.position.set(en.x, 0, en.z);
  let e = [],
    a = [],
    r = (h, u) => new Wt.Vector3(en.x + h, 0, en.z + u),
    o = new Wt.Mesh(new Wt.CircleGeometry(en.r, 64), Kt.grass);
  ((o.rotation.x = -Math.PI / 2), (o.position.y = 0.04), (o.receiveShadow = !0), t.add(o));
  for (let [h, u] of [
    [4, en.r * 2 - 4],
    [en.r * 2 - 4, 4],
  ]) {
    let p = new Wt.Mesh(new Wt.BoxGeometry(h, 0.05, u), Kt.stone);
    ((p.position.y = 0.06), t.add(p));
  }
  let n = new Wt.Mesh(new Wt.RingGeometry(6, 9, 48), Kt.stone);
  ((n.rotation.x = -Math.PI / 2), (n.position.y = 0.065), t.add(n));
  let i = new Wt.Mesh(new Wt.CylinderGeometry(1.6, 1.9, 1.4, 24), Kt.marble);
  ((i.position.y = 0.7), t.add(i));
  let s = new Wt.Mesh(new Wt.BoxGeometry(2.4, 0.4, 1.7), Kt.gold);
  ((s.position.y = 1.7), (s.rotation.y = 0.4), t.add(s));
  let l = new Wt.Mesh(new Wt.SphereGeometry(0.55, 20, 14), ns("#4da3ff", 0.2, 0.3));
  ((l.position.y = 2.6), t.add(l), a.push({ x: en.x, z: en.z, r: 2.2 }));
  let c = (h, u, p, v, g) => {
      (h.position.set(u, 0, p), (h.rotation.y = v), t.add(h), a.push({ x: en.x + u, z: en.z + p, r: g }));
    },
    d = (h, u, p, v) => {
      let g = new Wt.Vector3(0, 0, v).applyAxisAngle(new Wt.Vector3(0, 1, 0), p);
      return r(h + g.x, u + g.z);
    };
  {
    let h = new Wt.Group(),
      u = new Wt.Mesh(
        new Wt.BoxGeometry(18, 8, 9),
        Ea({ base: "#ece7dc", tint: "#8a9bb0", kind: 2, h: 8, seed: 0.41 }),
      );
    (u.position.set(0, 4.6, -1.5), (u.castShadow = !0), h.add(u));
    let p = new Wt.Mesh(new Wt.BoxGeometry(14, 0.6, 3), Kt.stone);
    (p.position.set(0, 0.3, 4.4), h.add(p), w0(h, 6, 13, 3.6, 6.4, 0.42));
    let v = new Wt.Mesh(new Wt.CylinderGeometry(0.01, 9.6, 2.2, 3, 1), Kt.marble);
    ((v.rotation.z = Math.PI / 2),
      (v.rotation.y = Math.PI / 2),
      v.scale.set(1, 1, 0.3),
      v.position.set(0, 9.6, 3.2),
      h.add(v));
    let g = De(
      "MINISTRY OF EDUCATION",
      "Register schools \xB7 teachers \xB7 verify certificates",
      "#ffc27a",
      11,
    );
    (g.position.set(0, 2.2, 5.95),
      h.add(g),
      c(h, 0, -24, 0, 9),
      e.push({
        pos: d(0, -24, 0, 7.5),
        radius: 4,
        label: "Ministry of Education \u2014 register, teach, verify",
        action: "edu",
        payload: "register",
      }));
  }
  {
    let h = new Wt.Group(),
      u = new Wt.Mesh(new Wt.BoxGeometry(14, 7, 8), ns("#b5583b", 0.9));
    ((u.position.y = 3.5), (u.castShadow = !0), h.add(u), LL(h, 14, 6, 4.05, 2, 5));
    let p = new Wt.Mesh(new Wt.BoxGeometry(14.6, 0.5, 8.6), ns("#e9e2d4", 0.8));
    ((p.position.y = 7.2), h.add(p));
    let v = new Wt.Mesh(new Wt.BoxGeometry(3, 3, 3), ns("#b5583b", 0.9));
    (v.position.set(0, 8.9, 0), h.add(v));
    let g = new Wt.Mesh(new Wt.CircleGeometry(1.1, 32), ns("#fbf8f1", 0.5));
    (g.position.set(0, 9, 1.52), h.add(g));
    let m = De("FYRUS SCHOOLS", "K-12 \xB7 kids coding \xB7 languages", "#ff9a3c", 7);
    (m.position.set(0, 2.4, 4.1),
      h.add(m),
      c(h, -24, 0, Math.PI / 2, 7.5),
      e.push({
        pos: d(-24, 0, Math.PI / 2, 6),
        radius: 3.5,
        label: "School classrooms \u2014 enter",
        action: "class",
        payload: "school",
      }));
  }
  {
    let h = new Wt.Group(),
      u = new Wt.Mesh(new Wt.BoxGeometry(14, 9, 9), ns("#d8cfbf", 0.85));
    ((u.position.y = 4.5), (u.castShadow = !0), h.add(u), LL(h, 14, 8, 4.55, 2, 5, 2));
    for (let v of [-7.4, 7.4]) {
      let g = new Wt.Mesh(new Wt.CylinderGeometry(1.3, 1.4, 12, 12), ns("#cfc5b2", 0.85));
      (g.position.set(v, 6, 4), h.add(g));
      let m = new Wt.Mesh(new Wt.ConeGeometry(1.6, 3, 12), ns("#3b4a5c", 0.6));
      (m.position.set(v, 13.5, 4), h.add(m));
    }
    let p = De("FYRUS UNIVERSITIES", "Degrees \xB7 research labs \xB7 executive cohorts", "#4da3ff", 8);
    (p.position.set(0, 2.6, 4.6),
      h.add(p),
      c(h, 24, 0, -Math.PI / 2, 8.5),
      e.push({
        pos: d(24, 0, -Math.PI / 2, 7),
        radius: 3.5,
        label: "University lecture hall \u2014 enter",
        action: "class",
        payload: "university",
      }));
  }
  {
    let h = new Wt.Group(),
      u = new Wt.Mesh(
        new Wt.BoxGeometry(11, 8, 8),
        Ea({ base: "#e8e4dc", tint: "#45e0ae", kind: 1, h: 8, seed: 0.22 }),
      );
    ((u.position.y = 4), (u.castShadow = !0), h.add(u));
    let p = De("FYRUS COLLEGES", "Diplomas \xB7 intermediate \xB7 pre-professional", "#45e0ae", 7);
    (p.position.set(0, 2.4, 4.05),
      h.add(p),
      c(h, -15, 23, Math.PI, 7),
      e.push({
        pos: d(-15, 23, Math.PI, 6),
        radius: 3.5,
        label: "College classrooms \u2014 enter",
        action: "class",
        payload: "college",
      }));
  }
  {
    let h = new Wt.Group(),
      u = new Wt.Mesh(
        new Wt.BoxGeometry(11, 10, 8),
        Ea({ base: "#cfd8e2", tint: "#2f6fe0", kind: 0, h: 10, seed: 0.66 }),
      );
    ((u.position.y = 5), (u.castShadow = !0), h.add(u));
    let p = new Wt.Mesh(new Wt.BoxGeometry(11.3, 9.4, 8.3), Kt.glass);
    ((p.position.y = 5), h.add(p));
    let v = De("FYRUS INSTITUTES", "AI \xB7 design \xB7 trading \xB7 e-commerce bootcamps", "#2f6fe0", 7);
    (v.position.set(0, 2.4, 4.2),
      h.add(v),
      c(h, 15, 23, Math.PI, 7),
      e.push({
        pos: d(15, 23, Math.PI, 6),
        radius: 3.5,
        label: "Institute bootcamp rooms \u2014 enter",
        action: "class",
        payload: "institute",
      }));
  }
  for (let h = 0; h < 12; h++) {
    let u = (h / 12) * Math.PI * 2 + 0.26,
      p = ya(h % 2 ? "#4f7f35" : "#5d8a3f", 1);
    (p.position.set(Math.cos(u) * 14, 0, Math.sin(u) * 14),
      t.add(p),
      a.push({ x: en.x + Math.cos(u) * 14, z: en.z + Math.sin(u) * 14, r: 0.6 }));
  }
  for (let h = 0; h < 8; h++) {
    let u = (h / 8) * Math.PI * 2,
      p = new Wt.Group(),
      v = new Wt.Mesh(new Wt.CylinderGeometry(0.07, 0.1, 4, 8), Kt.dark);
    ((v.position.y = 2), p.add(v));
    let g = new Wt.Mesh(new Wt.SphereGeometry(0.22, 12, 8), Xa);
    ((g.position.y = 4.1), p.add(g), p.position.set(Math.cos(u) * 9.6, 0, Math.sin(u) * 9.6), t.add(p));
    let m = new Wt.Group(),
      f = new Wt.Mesh(new Wt.BoxGeometry(1.8, 0.08, 0.5), ns("#8a6446", 0.8));
    ((f.position.y = 0.46), m.add(f));
    let y = new Wt.Mesh(new Wt.BoxGeometry(1.8, 0.4, 0.06), ns("#8a6446", 0.8));
    (y.position.set(0, 0.75, -0.24),
      m.add(y),
      m.position.set(Math.cos(u + 0.4) * 10.5, 0, Math.sin(u + 0.4) * 10.5),
      m.lookAt(0, 0, 0),
      t.add(m));
  }
  return {
    group: t,
    interacts: e,
    colliders: a,
    tick: (h, u) => {
      ((l.position.y = 2.6 + Math.sin(u * 1.5) * 0.15), (l.rotation.y = u));
    },
  };
}
var mt = P(ea(), 1);
var is = (t, e = 0.7, a = 0) => new mt.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  Bx = new mt.MeshStandardMaterial({
    color: "#22303d",
    metalness: 0.7,
    roughness: 0.1,
    emissive: "#ffd9a0",
    emissiveIntensity: 0.05,
  });
Hn.push(Bx);
var Rx = (t) => {
  let e = new mt.MeshStandardMaterial({ color: t, emissive: t, emissiveIntensity: 0.6, roughness: 0.4 });
  return (Mo.push(e), e);
};
function Ax(t) {
  let e = Math.atan2(-t.x, -t.z),
    a = new mt.Group();
  (a.position.set(t.x, 0, t.z), (a.rotation.y = e));
  let r = (c, d) => {
      let h = new mt.Vector3(c, 0, d).applyAxisAngle(new mt.Vector3(0, 1, 0), e);
      return new mt.Vector3(t.x + h.x, 0, t.z + h.z);
    },
    o = [],
    n = [],
    i = (c, d, h) => {
      let u = r(c, d);
      o.push({ x: u.x, z: u.z, r: h });
    },
    s = (c, d, h, u) => {
      let p = u / 2,
        v = Math.max(1, Math.ceil(h / u));
      for (let g = 0; g < v; g++)
        i(c - h / 2 + p + (v > 1 ? ((h - u) * g) / (v - 1) : h / 2 - p), d, p + 0.3);
    },
    l = new mt.Mesh(new mt.CircleGeometry(t.r, 64), Kt.paving);
  return (
    (l.rotation.x = -Math.PI / 2),
    (l.position.y = 0.05),
    (l.receiveShadow = !0),
    a.add(l),
    { group: a, W: r, col: i, foot: s, colliders: o, interacts: n, ry: e }
  );
}
function zx(t, e, a, r, o = 0.3, n = Math.PI - 0.3) {
  for (let i = 0; i < a; i++) {
    let s = o + ((n - o) * i) / Math.max(1, a - 1),
      l = Math.cos(s) * e,
      c = Math.sin(s) * e,
      d = new mt.Group(),
      h = new mt.Mesh(new mt.CylinderGeometry(0.07, 0.1, 4.2, 8), Kt.dark);
    ((h.position.y = 2.1), d.add(h));
    let u = new mt.Mesh(new mt.SphereGeometry(0.22, 12, 8), Xa);
    ((u.position.y = 4.3), d.add(u), d.position.set(l, 0, c), t.add(d), r(l, c, 0.3));
  }
}
function SN(t, e, a) {
  let r = e.split(" "),
    o = [],
    n = "";
  for (let i of r) {
    let s = n ? n + " " + i : i;
    t.measureText(s).width > a && n ? (o.push(n), (n = i)) : (n = s);
  }
  return (n && o.push(n), o);
}
function SL() {
  let t = wn.newstv,
    e = Ax(t),
    a = e.group,
    r = new mt.Mesh(
      new mt.BoxGeometry(18, 28, 11),
      Ea({ base: "#1d2733", tint: "#2f6fe0", kind: 0, h: 28, seed: 0.13 }),
    );
  (r.position.set(0, 14, -9), (r.castShadow = !0), a.add(r), e.foot(0, -9, 18, 11));
  let o = new mt.Mesh(new mt.BoxGeometry(18.3, 27.6, 11.3), Kt.glass);
  (o.position.set(0, 14, -9), a.add(o));
  let n = new mt.Mesh(new mt.BoxGeometry(22, 5, 6), is("#e9edf2", 0.5));
  (n.position.set(0, 2.5, -1.2), (n.castShadow = !0), a.add(n), e.foot(0, -1.2, 22, 6));
  let i = new mt.Mesh(new mt.BoxGeometry(4, 3.2, 0.2), Bx);
  (i.position.set(0, 1.6, 1.85), a.add(i));
  let s = De(
    "FYRUS NEWS TV",
    "24/7 \xB7 national news from real city events \xB7 world headlines",
    "#e5484d",
    12,
  );
  (s.position.set(0, 4.1, 1.86), a.add(s));
  let l = 1280,
    c = 720,
    d = document.createElement("canvas");
  ((d.width = l), (d.height = c));
  let h = d.getContext("2d"),
    u = new mt.CanvasTexture(d),
    p = new mt.MeshStandardMaterial({
      map: u,
      emissiveMap: u,
      emissive: "#ffffff",
      emissiveIntensity: 0.9,
      roughness: 0.4,
    }),
    v = new mt.Mesh(new mt.PlaneGeometry(15, 8.44), p);
  (v.position.set(0, 13.5, -3.38), a.add(v));
  let g = new mt.Mesh(new mt.BoxGeometry(15.6, 9, 0.3), Kt.dark);
  (g.position.set(0, 13.5, -3.6), a.add(g));
  let m = document.createElement("canvas");
  ((m.width = 4096), (m.height = 96));
  let f = m.getContext("2d"),
    y = new mt.CanvasTexture(m);
  ((y.wrapS = mt.RepeatWrapping), y.repeat.set(0.45, 1));
  let x = new mt.Mesh(
    new mt.PlaneGeometry(18.2, 1.1),
    new mt.MeshStandardMaterial({ map: y, emissiveMap: y, emissive: "#ffffff", emissiveIntensity: 0.9 }),
  );
  (x.position.set(0, 8.1, -3.3), a.add(x));
  let k = 0,
    b = -99,
    w = "",
    L = () => {
      let H = ot().news,
        N = (H?.fyrus || [])
          .slice(0, 12)
          .map((M) => ({
            cat: Mn[M.cat]?.label || "Fyrus",
            color: Mn[M.cat]?.color || "#ffc27a",
            title: M.title,
            src: M.kind === "citizen" ? `Citizen report \xB7 ${M.byName || ""}` : "Fyrus News",
          })),
        B = (H?.world || [])
          .slice(0, 10)
          .map((M) => ({ cat: "World", color: "#a8d8ff", title: M.title, src: M.source })),
        X = [];
      for (let M = 0; M < Math.max(N.length, B.length); M++) (N[M] && X.push(N[M]), B[M] && X.push(B[M]));
      return X;
    };
  function E() {
    let H = L(),
      N = H.length
        ? H[k++ % H.length]
        : {
            cat: "Fyrus News",
            color: "#ffc27a",
            title: "Fyrus News TV is on air. National news appears here as it happens in the city.",
            src: "Fyrus News",
          },
      B = h.createLinearGradient(0, 0, l, c);
    (B.addColorStop(0, "#0b1730"),
      B.addColorStop(1, "#13284f"),
      (h.fillStyle = B),
      h.fillRect(0, 0, l, c),
      (h.fillStyle = "#e5484d"),
      h.fillRect(0, 0, l, 86),
      (h.fillStyle = "#fff"),
      (h.font = "800 46px Sora, sans-serif"),
      h.fillText("FYRUS NEWS", 40, 60),
      (h.textAlign = "right"),
      (h.font = '700 34px "Plus Jakarta Sans", sans-serif'),
      h.fillText("\u25CF LIVE  " + new Date().toUTCString().slice(17, 22) + " UTC", l - 40, 58),
      (h.textAlign = "left"),
      (h.fillStyle = N.color),
      h.fillRect(40, 140, 12, 300),
      (h.font = '800 40px "Plus Jakarta Sans", sans-serif'),
      h.fillText(String(N.cat).toUpperCase(), 76, 176),
      (h.fillStyle = "#fff"),
      (h.font = "800 66px Sora, sans-serif"),
      SN(h, N.title, l - 130)
        .slice(0, 4)
        .forEach((M, _) => h.fillText(M, 76, 262 + _ * 82)),
      (h.fillStyle = "rgba(255,255,255,.7)"),
      (h.font = '600 32px "Plus Jakarta Sans", sans-serif'),
      h.fillText(N.src, 76, c - 60),
      (u.needsUpdate = !0));
    let X = H.map((M) => M.title).join("|");
    if (X !== w) {
      ((w = X),
        (f.fillStyle = "#10151d"),
        f.fillRect(0, 0, m.width, m.height),
        (f.font = '700 46px "Plus Jakarta Sans", sans-serif'));
      let M = 20,
        _ = H.length ? H : [{ title: "Welcome to Fyrus News TV", cat: "Fyrus", color: "#ffc27a" }];
      for (let lt = 0; M < m.width - 20; lt++) {
        let vt = _[lt % _.length];
        ((f.fillStyle = vt.color),
          f.fillText("\u25A0 " + vt.cat.toUpperCase() + " ", M, 64),
          (M += f.measureText("\u25A0 " + vt.cat.toUpperCase() + " ").width),
          (f.fillStyle = "#fff"));
        let zt = vt.title + "     ";
        if ((f.fillText(zt, M, 64), (M += f.measureText(zt).width), lt > 60)) break;
      }
      y.needsUpdate = !0;
    }
  }
  E();
  for (let [H, N, B] of [
    [-5, -11, 1.4],
    [4, -7, 1.1],
    [6, -12, 0.9],
  ]) {
    let X = new mt.Mesh(
      new mt.SphereGeometry(B, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2.6),
      is("#f2f4f7", 0.4, 0.2),
    );
    (X.position.set(H, 28.4, N), (X.rotation.x = -0.8), a.add(X));
  }
  let T = new mt.Mesh(new mt.CylinderGeometry(0.12, 0.3, 10, 8), Kt.dark);
  (T.position.set(0, 33, -10), a.add(T));
  let S = new mt.Mesh(
    new mt.SphereGeometry(0.35, 12, 8),
    new mt.MeshStandardMaterial({ color: "#ff3b30", emissive: "#ff3b30", emissiveIntensity: 1 }),
  );
  (S.position.set(0, 38.2, -10), a.add(S));
  for (let H = 0; H < 4; H++) {
    let N = -9 + H * 6,
      B = new mt.Group(),
      X = new mt.Mesh(new mt.BoxGeometry(3, 0.1, 0.6), is("#8a6446", 0.8));
    ((X.position.y = 0.46), B.add(X));
    let M = new mt.Mesh(new mt.BoxGeometry(2.8, 0.45, 0.4), is("#cfc8ba", 0.9));
    ((M.position.y = 0.22), B.add(M), B.position.set(N, 0, 12), a.add(B), e.col(N, 12, 1));
  }
  for (let H of [-16, 16]) {
    let N = ya("#4f7f35", 1);
    (N.position.set(H, 0, 8), a.add(N), e.col(H, 8, 0.6));
  }
  return (
    zx(a, t.r - 3, 5, e.col),
    e.interacts.push({
      pos: e.W(0, 4.5),
      radius: 4,
      label: "Fyrus News TV \u2014 watch 24/7 news",
      action: "news",
      payload: "tv",
    }),
    e.interacts.push({
      pos: e.W(0, 11),
      radius: 4,
      label: "News screen \u2014 open the newsroom",
      action: "news",
      payload: "fyrus",
      obj: v,
    }),
    {
      group: a,
      interacts: e.interacts,
      colliders: e.colliders,
      tick: (H, N) => {
        ((y.offset.x = (y.offset.x + H * 0.035) % 1),
          (S.material.emissiveIntensity = Math.sin(N * 3) > 0.6 ? 1.6 : 0.1),
          N - b > 7 && ((b = N), E()));
      },
    }
  );
}
function HL() {
  let t = wn.halls,
    e = Ax(t),
    a = e.group,
    r = (f) => Bo.find((y) => y.id === f),
    o = new mt.Mesh(
      new mt.BoxGeometry(30, 13, 14),
      Ea({ base: "#e8e4dc", tint: "#4da3ff", kind: 1, h: 13, seed: 0.52 }),
    );
  (o.position.set(0, 6.5, -12), (o.castShadow = !0), a.add(o), e.foot(0, -12, 30, 14));
  let n = new mt.Mesh(new mt.BoxGeometry(30.2, 11, 0.3), Kt.glass);
  (n.position.set(0, 5.5, -4.9), a.add(n));
  let i = new mt.Mesh(new mt.BoxGeometry(36, 0.8, 22), is("#f4f5f7", 0.5));
  (i.position.set(0, 13.4, -9), (i.castShadow = !0), a.add(i));
  for (let f of [-16, -8, 8, 16]) {
    let y = new mt.Mesh(new mt.CylinderGeometry(0.35, 0.35, 13, 12), is("#f4f5f7", 0.5));
    (y.position.set(f, 6.5, -0.5), a.add(y), e.col(f, -0.5, 0.5));
  }
  let s = De("FYRUS CONFERENCE CENTER", "Book a hall \xB7 host summits, classes and launches", "#4da3ff", 14);
  (s.position.set(0, 11.6, -4.7), a.add(s));
  let l = De(r("grand").name.toUpperCase(), `${r("grand").cap} seats \xB7 main stage`, r("grand").color, 6);
  (l.position.set(0, 4.3, -4.7),
    a.add(l),
    e.interacts.push({
      pos: e.W(0, -2.5),
      radius: 3.5,
      label: `${r("grand").name} \u2014 enter`,
      action: "hall",
      payload: "grand",
    }));
  for (let [f, y, x] of [
    ["summit", -19, "#efe6d6"],
    ["studio", 19, "#e2efe9"],
  ]) {
    let k = r(f),
      b = new mt.Mesh(
        new mt.BoxGeometry(10, 7, 10),
        Ea({ base: x, tint: k.color, kind: 2, h: 7, seed: y > 0 ? 0.31 : 0.77 }),
      );
    (b.position.set(y, 3.5, 4), (b.castShadow = !0), a.add(b), e.foot(y, 4, 10, 10));
    let w = De(k.name.toUpperCase(), `${k.cap} seats`, k.color, 6.5);
    (w.position.set(y, 2.6, 9.06),
      a.add(w),
      e.interacts.push({
        pos: e.W(y, 11.5),
        radius: 3,
        label: `${k.name} \u2014 enter`,
        action: "hall",
        payload: f,
      }));
  }
  let c = document.createElement("canvas");
  ((c.width = 768), (c.height = 1024));
  let d = c.getContext("2d"),
    h = new mt.CanvasTexture(c),
    u = new mt.Mesh(
      new mt.PlaneGeometry(2.4, 3.2),
      new mt.MeshStandardMaterial({ map: h, emissiveMap: h, emissive: "#ffffff", emissiveIntensity: 0.5 }),
    );
  (u.position.set(0, 2.2, 14.06), a.add(u));
  let p = new mt.Mesh(new mt.BoxGeometry(2.7, 3.8, 0.3), Kt.dark);
  (p.position.set(0, 2, 13.88), a.add(p), e.col(0, 13.9, 1.4));
  let v = "",
    g = () => {
      let f = (ot().halls?.events || [])
          .filter((x) => Bo.some((k) => k.id === x.hall && k.site === "halls"))
          .slice(0, 6),
        y = JSON.stringify(f.map((x) => x.id + x.going));
      y !== v &&
        ((v = y),
        (d.fillStyle = "#0d1a2b"),
        d.fillRect(0, 0, 768, 1024),
        (d.fillStyle = "#4da3ff"),
        d.fillRect(0, 0, 768, 110),
        (d.fillStyle = "#fff"),
        (d.font = "800 48px Sora, sans-serif"),
        d.fillText("WHAT'S ON", 36, 74),
        f.length ||
          ((d.font = '600 36px "Plus Jakarta Sans", sans-serif'),
          (d.fillStyle = "rgba(255,255,255,.8)"),
          ["No events booked yet.", "Halls are open \u2014 walk in.", "Book one in Events."].forEach((x, k) =>
            d.fillText(x, 36, 210 + k * 60),
          )),
        f.forEach((x, k) => {
          let b = 180 + k * 140;
          ((d.fillStyle = Bo.find((w) => w.id === x.hall)?.color || "#fff"),
            (d.font = '700 28px "Plus Jakarta Sans", sans-serif'),
            d.fillText(
              `${new Date(x.start).toUTCString().slice(5, 22)} \xB7 ${Bo.find((w) => w.id === x.hall)?.name || ""}`,
              36,
              b,
            ),
            (d.fillStyle = "#fff"),
            (d.font = "800 38px Sora, sans-serif"),
            d.fillText(x.title.length > 26 ? x.title.slice(0, 25) + "\u2026" : x.title, 36, b + 48),
            (d.fillStyle = "rgba(255,255,255,.7)"),
            (d.font = '600 26px "Plus Jakarta Sans", sans-serif'),
            d.fillText(
              `${x.price ? x.price.toLocaleString("en-US") + " FYC" : "Free"} \xB7 ${x.going} going`,
              36,
              b + 88,
            ));
        }),
        (h.needsUpdate = !0));
    };
  (g(),
    e.interacts.push({
      pos: e.W(0, 16),
      radius: 2.6,
      label: "What's on \u2014 events and tickets",
      action: "events",
      payload: "upcoming",
      obj: u,
    }));
  for (let f = 0; f < 6; f++) {
    let y = -22 + f * 8.8,
      x = ya(f % 2 ? "#4f7f35" : "#5d8a3f", 1);
    (x.position.set(y, 0, 19), a.add(x), e.col(y, 19, 0.6));
  }
  zx(a, t.r - 3, 6, e.col, 0.15, Math.PI - 0.15);
  let m = 0;
  return {
    group: a,
    interacts: e.interacts,
    colliders: e.colliders,
    tick: (f) => {
      ((m += f), m > 3 && ((m = 0), g()));
    },
  };
}
function NL() {
  let t = wn.lounge,
    e = Ax(t),
    a = e.group,
    r = (b) => Bo.find((w) => w.id === b),
    o = r("skyline"),
    n = r("rooftop"),
    i = r("arena"),
    s = new mt.Mesh(
      new mt.BoxGeometry(14, 10, 12),
      Ea({ base: "#1c1a26", tint: o.color, kind: 0, h: 10, seed: 0.9 }),
    );
  (s.position.set(-11, 5, -8), (s.castShadow = !0), a.add(s), e.foot(-11, -8, 14, 12));
  let l = new mt.Mesh(new mt.BoxGeometry(14.2, 0.4, 12.2), Rx(o.color));
  (l.position.set(-11, 3.6, -8), a.add(l));
  let c = new mt.Mesh(
    new mt.BoxGeometry(14, 1, 12),
    new mt.MeshStandardMaterial({ color: "#cfe3ff", transparent: !0, opacity: 0.25, roughness: 0.1 }),
  );
  (c.position.set(-11, 10.5, -8), a.add(c));
  for (let [b, w] of [
    [-14, -10],
    [-8, -6],
    [-13, -5],
  ]) {
    let L = new mt.Mesh(new mt.CylinderGeometry(0.7, 0.7, 0.5, 16), is("#3a3a3a", 0.6));
    (L.position.set(b, 10.25, w), a.add(L));
    let E = new mt.Mesh(new mt.ConeGeometry(0.35, 0.8, 10), Rx("#ff9a3c"));
    (E.position.set(b, 10.9, w), a.add(E));
  }
  let d = De(o.name.toUpperCase(), "Mocktails \xB7 music \xB7 networking", o.color, 8);
  (d.position.set(-11, 2.4, -1.94),
    a.add(d),
    e.interacts.push({
      pos: e.W(-13, 0.5),
      radius: 3,
      label: `${o.name} \u2014 enter`,
      action: "hall",
      payload: "skyline",
    }));
  let h = new mt.Mesh(new mt.BoxGeometry(2.4, 10.6, 2.4), Kt.glass);
  (h.position.set(-3, 5.3, -3.5), a.add(h), e.col(-3, -3.5, 1.4));
  let u = De("ROOFTOP", n.name, n.color, 2.4);
  (u.position.set(-3, 2.8, -2.28),
    a.add(u),
    e.interacts.push({
      pos: e.W(-3, -1),
      radius: 2.4,
      label: `${n.name} \u2014 take the lift`,
      action: "hall",
      payload: "rooftop",
    }));
  let p = new mt.Mesh(new mt.BoxGeometry(16, 12, 14), is("#16181d", 0.5, 0.3));
  (p.position.set(11, 6, -9), (p.castShadow = !0), a.add(p), e.foot(11, -9, 16, 14));
  for (let b of [2.2, 11.4]) {
    let w = new mt.Mesh(new mt.BoxGeometry(16.2, 0.3, 14.2), Rx(i.color));
    (w.position.set(11, b, -9), a.add(w));
  }
  let v = document.createElement("canvas");
  ((v.width = 1024), (v.height = 512));
  let g = v.getContext("2d"),
    m = new mt.CanvasTexture(v),
    f = (b) => {
      let w = g.createLinearGradient(0, 0, 1024, 512);
      (w.addColorStop(0, "#2a0b12"),
        w.addColorStop(1, "#0b1730"),
        (g.fillStyle = w),
        g.fillRect(0, 0, 1024, 512),
        (g.fillStyle = i.color),
        (g.font = "800 92px Sora, sans-serif"),
        g.fillText("GAMING ARENA", 50, 150),
        (g.fillStyle = "#fff"),
        (g.font = '700 44px "Plus Jakarta Sans", sans-serif'));
      let L = (ot().halls?.events || []).find((E) => E.hall === "arena");
      (g.fillText(L ? L.title.slice(0, 32) : "Skill tournaments \xB7 watch parties", 50, 260),
        (g.fillStyle = "rgba(255,255,255,.7)"),
        (g.font = '600 36px "Plus Jakarta Sans", sans-serif'),
        g.fillText(
          L
            ? new Date(L.start).toUTCString().slice(5, 22) + " UTC"
            : "Walk in any time \xB7 book it in Events",
          50,
          330,
        ));
      for (let E = 0; E < 16; E++)
        ((g.fillStyle = `hsla(${(E * 22 + b * 60) % 360},90%,60%,.85)`),
          g.fillRect(50 + E * 58, 420, 44, 30 + 20 * Math.abs(Math.sin(b * 2 + E))));
      m.needsUpdate = !0;
    };
  f(0);
  let y = new mt.Mesh(
    new mt.PlaneGeometry(12, 6),
    new mt.MeshStandardMaterial({ map: m, emissiveMap: m, emissive: "#ffffff", emissiveIntensity: 0.9 }),
  );
  (y.position.set(11, 7, -1.94), a.add(y));
  let x = new mt.Mesh(new mt.BoxGeometry(4, 3, 0.2), Bx);
  (x.position.set(11, 1.5, -1.9),
    a.add(x),
    e.interacts.push({
      pos: e.W(11, 0.5),
      radius: 3.2,
      label: `${i.name} \u2014 enter`,
      action: "hall",
      payload: "arena",
    }));
  for (let b = 0; b < 5; b++) {
    let w = -12 + b * 6,
      L = new mt.Group(),
      E = new mt.Mesh(new mt.CylinderGeometry(0.7, 0.7, 0.06, 18), is("#f2f2ee", 0.4));
    ((E.position.y = 0.75), L.add(E));
    let T = new mt.Mesh(new mt.CylinderGeometry(0.06, 0.06, 0.75, 8), Kt.dark);
    ((T.position.y = 0.37), L.add(T));
    let S = new mt.Mesh(new mt.ConeGeometry(1.8, 0.7, 16), is(b % 2 ? "#c792ea" : "#e5484d", 0.8));
    ((S.position.y = 2.6), L.add(S));
    let H = new mt.Mesh(new mt.CylinderGeometry(0.04, 0.04, 2.3, 6), Kt.dark);
    ((H.position.y = 1.4), L.add(H), L.position.set(w, 0, 10), a.add(L), e.col(w, 10, 0.8));
  }
  for (let b of [-20, 20]) {
    let w = ya("#4f7f35", 1);
    (w.position.set(b, 0, 6), a.add(w), e.col(b, 6, 0.6));
  }
  zx(a, t.r - 3, 5, e.col);
  let k = 0;
  return {
    group: a,
    interacts: e.interacts,
    colliders: e.colliders,
    tick: (b, w) => {
      ((k += b), k > 0.5 && ((k = 0), f(w)));
    },
  };
}
var Se = P(ea(), 1);
var RL = new Se.MeshStandardMaterial({ color: "#2f3338", roughness: 0.5, metalness: 0.6 }),
  jx = new Se.MeshStandardMaterial({ color: "#16181b", roughness: 0.6 }),
  Wx = (t) => new Se.MeshStandardMaterial({ color: t, emissive: t, emissiveIntensity: 0.05, roughness: 0.3 }),
  Ix = { red: Wx("#ff3b30"), amber: Wx("#ffb020"), green: Wx("#30d158") },
  BL = new Se.MeshStandardMaterial({ color: "#8a6446", roughness: 0.8 }),
  AL = new Se.MeshStandardMaterial({ color: "#30353b", roughness: 0.5, metalness: 0.6 }),
  HN = new Se.MeshStandardMaterial({ color: "#3d6b4a", roughness: 0.7 });
function zL(t, e, a) {
  let r = new Se.Group();
  (r.position.set(t, 0, e), (r.rotation.y = a), (r.userData.noBlock = !1));
  let o = new Se.Mesh(new Se.CylinderGeometry(0.09, 0.11, 4.6, 8), RL);
  ((o.position.y = 2.3), (o.castShadow = !0), r.add(o));
  let n = new Se.Mesh(new Se.CylinderGeometry(0.06, 0.06, 3, 6), RL);
  ((n.rotation.z = Math.PI / 2), n.position.set(1.4, 4.45, 0), r.add(n));
  let i = new Se.Mesh(new Se.BoxGeometry(0.42, 1.2, 0.32), jx);
  (i.position.set(2.6, 3.9, 0),
    r.add(i),
    [
      ["red", 0.36],
      ["amber", 0],
      ["green", -0.36],
    ].forEach(([l, c]) => {
      let d = new Se.Mesh(new Se.CircleGeometry(0.13, 14), Ix[l]);
      (d.position.set(2.6, 3.9 + c, 0.165), r.add(d));
      let h = new Se.Mesh(new Se.CylinderGeometry(0.15, 0.15, 0.14, 12, 1, !0, 0, Math.PI), jx);
      (h.rotation.set(Math.PI / 2, 0, 0), h.position.set(2.6, 3.9 + c + 0.04, 0.22), r.add(h));
    }));
  let s = new Se.Mesh(new Se.BoxGeometry(0.28, 0.5, 0.22), jx);
  return (s.position.set(0, 2.6, 0.18), r.add(s), r);
}
function jL(t) {
  let e = t % 20,
    a = e < 9 ? "green" : e < 11 ? "amber" : "red";
  Object.keys(Ix).forEach((r) => (Ix[r].emissiveIntensity = r === a ? 2.2 : 0.05));
}
