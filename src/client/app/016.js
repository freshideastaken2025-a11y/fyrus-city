function yu(t, e, a) {
  let r = new Se.Group();
  (r.position.set(t, 0, e), (r.rotation.y = a));
  for (let o = 0; o < 3; o++) {
    let n = new Se.Mesh(new Se.BoxGeometry(1.8, 0.05, 0.12), BL);
    (n.position.set(0, 0.46, -0.15 + o * 0.15), r.add(n));
  }
  for (let o = 0; o < 2; o++) {
    let n = new Se.Mesh(new Se.BoxGeometry(1.8, 0.1, 0.04), BL);
    (n.position.set(0, 0.68 + o * 0.16, -0.27), (n.rotation.x = -0.12), r.add(n));
  }
  for (let o of [-0.8, 0.8]) {
    let n = new Se.Mesh(new Se.BoxGeometry(0.06, 0.46, 0.5), AL);
    (n.position.set(o, 0.23, -0.05), r.add(n));
  }
  return (r.add(os(1)), r);
}
function Wg(t, e) {
  let a = new Se.Group();
  a.position.set(t, 0, e);
  let r = new Se.Mesh(new Se.CylinderGeometry(0.26, 0.22, 0.85, 12), HN);
  ((r.position.y = 0.43), (r.castShadow = !0), a.add(r));
  let o = new Se.Mesh(new Se.CylinderGeometry(0.28, 0.28, 0.06, 12), AL);
  return ((o.position.y = 0.88), a.add(o), a.add(os(0.35)), a);
}
var pt = P(ea(), 1);
var Ta = (t, e = 0.7, a = 0) => new pt.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  ss = new pt.BoxGeometry(1, 1, 1).translate(0, 0.5, 0),
  NN = (() => {
    let t = new pt.Shape();
    (t.moveTo(-0.5, 0), t.lineTo(0.5, 0), t.lineTo(0, 1), t.closePath());
    let e = new pt.ExtrudeGeometry(t, { depth: 1, bevelEnabled: !1 });
    return (e.translate(0, 0, -0.5), e.rotateY(Math.PI / 2), e);
  })(),
  RN = new pt.ConeGeometry(Math.SQRT1_2, 1, 4, 1).rotateY(Math.PI / 4).translate(0, 0.5, 0),
  Gx = new pt.IcosahedronGeometry(1, 1),
  Vx = new pt.CylinderGeometry(0.12, 0.16, 1, 6).translate(0, 0.5, 0);
function BN() {
  let t = (e) => {
    let a = document.createElement("canvas");
    ((a.width = 256), (a.height = 256));
    let r = a.getContext("2d");
    if (((r.fillStyle = e ? "#000" : "#ffffff"), r.fillRect(0, 0, 256, 256), !e)) {
      r.fillStyle = "rgba(0,0,0,.06)";
      for (let i = 0; i < 256; i += 16) r.fillRect(0, i, 256, 1);
      ((r.fillStyle = "#b9b2a6"), r.fillRect(0, 248, 256, 8), r.fillRect(0, 126, 256, 5));
    }
    let o = (i, s, l, c) => {
      if (e) {
        ((r.fillStyle = "#ffd9a0"), r.fillRect(i, s, l, c));
        return;
      }
      ((r.fillStyle = "#f4f1ea"),
        r.fillRect(i - 4, s - 4, l + 8, c + 8),
        (r.fillStyle = "#34495e"),
        r.fillRect(i, s, l, c),
        (r.fillStyle = "rgba(255,255,255,.25)"),
        r.fillRect(i, s, l * 0.45, c),
        (r.fillStyle = "#f4f1ea"),
        r.fillRect(i + l / 2 - 2, s, 4, c),
        r.fillRect(i, s + c / 2 - 2, l, 4));
    };
    for (let i of [28, 106, 184]) o(i, 30, 44, 62);
    for (let i of [28, 184]) o(i, 150, 44, 62);
    e
      ? ((r.fillStyle = "#ffd9a0"), r.fillRect(110, 166, 36, 24))
      : ((r.fillStyle = "#5a3f35"),
        r.fillRect(104, 160, 48, 88),
        (r.fillStyle = "#d4a64a"),
        r.fillRect(142, 204, 5, 5));
    let n = new pt.CanvasTexture(a);
    return ((n.anisotropy = 4), n);
  };
  return { map: t(!1), glow: t(!0) };
}
var AN = {
    executive: [
      [0.62, 6.2, 0.6],
      [0.72, 4.2, 0.62],
      [0.55, 8.4, 0.55],
      [0.7, 7, 0.66],
    ],
    marina: [
      [0.75, 4.2, 0.62],
      [0.82, 3.6, 0.55],
      [0.66, 7.2, 0.6],
      [0.8, 6, 0.7],
    ],
    royal: [
      [0.7, 6, 0.6],
      [0.8, 5, 0.66],
      [0.62, 8.5, 0.58],
      [0.82, 7.5, 0.7],
    ],
  },
  IL = ["#e8e1d4", "#d8cfbf", "#c9d3dc", "#efe9df", "#d6c8b8", "#dfe6ee", "#cfc5b2", "#e4dccd"],
  ic = {
    land: "#45e0ae",
    sale: "#45e0ae",
    auction: "#ff9a3c",
    rent: "#4da3ff",
    owned: "#f2f2f2",
    mine: "#ffc27a",
  };
function GL() {
  let t = new pt.Group(),
    e = [],
    a = [],
    r = new pt.Matrix4(),
    o = new pt.Quaternion(),
    n = new pt.Vector3(0, 1, 0),
    i = new pt.Matrix4().makeScale(0, 0, 0),
    s = [],
    l = BN(),
    c = new pt.MeshStandardMaterial({
      color: "#ffffff",
      map: l.map,
      emissive: "#ffd9a0",
      emissiveMap: l.glow,
      emissiveIntensity: 0.05,
      roughness: 0.85,
    });
  Hn.push(c);
  let d = (() => {
      let x = document.createElement("canvas");
      ((x.width = 256), (x.height = 128));
      let k = x.getContext("2d");
      ((k.fillStyle = "#b9b4ab"), k.fillRect(0, 0, 256, 128), (k.fillStyle = "rgba(0,0,0,.12)"));
      for (let w = 0; w < 256; w += 16) (k.fillRect(w, 0, 1, 22), k.fillRect(w, 106, 1, 22));
      ((k.fillStyle = "#8f8a82"),
        k.fillRect(0, 22, 256, 3),
        k.fillRect(0, 103, 256, 3),
        (k.fillStyle = "#34373c"),
        k.fillRect(0, 25, 256, 78));
      for (let w = 0; w < 900; w++)
        ((k.fillStyle = `rgba(${Math.random() > 0.5 ? "255,255,255" : "0,0,0"},${Math.random() * 0.06})`),
          k.fillRect(Math.random() * 256, 25 + Math.random() * 78, 2, 2));
      ((k.fillStyle = "#e8e6e0"), k.fillRect(0, 30, 256, 2), k.fillRect(0, 96, 256, 2));
      for (let w = 0; w < 256; w += 64) k.fillRect(w + 8, 63, 36, 2);
      let b = new pt.CanvasTexture(x);
      return ((b.wrapS = pt.RepeatWrapping), (b.anisotropy = 4), b);
    })(),
    h = [];
  Gr.forEach((x) => {
    let k = As(x),
      b = k.x1 - k.x0,
      w = k.z1 - k.z0,
      L = (k.x0 + k.x1) / 2,
      E = (k.z0 + k.z1) / 2,
      T = new pt.Mesh(
        new pt.PlaneGeometry(b, w),
        Ta(x.id === "royal" ? "#557a3c" : x.id === "marina" ? "#6f8f52" : "#5e8443", 1),
      );
    ((T.rotation.x = -Math.PI / 2), T.position.set(L, 0.03, E), (T.receiveShadow = !0), t.add(T));
    let S = Al(x),
      H = (ie) => S[Math.min(S.length - 1, ie * x.cols)].z,
      N = [];
    for (let ie = k.x0 + 10; ie < k.x1 - 6; ie += 26) N.push(ie);
    for (let ie = 0; ie <= x.rows; ie += 2) {
      let jr = ie === 0 ? k.z0 + 4 : H(ie - 1) + x.sp / 2 + 10 / 2,
        dn = ie === 0 ? 7 : 9,
        Vn = d.clone();
      ((Vn.needsUpdate = !0), Vn.repeat.set((b - 4) / 16, 1));
      let hn = new pt.Mesh(
        new pt.PlaneGeometry(b - 4, dn),
        new pt.MeshStandardMaterial({ map: Vn, roughness: 0.92 }),
      );
      ((hn.rotation.x = -Math.PI / 2),
        hn.position.set(L, 0.05, jr),
        (hn.receiveShadow = !0),
        t.add(hn),
        N.forEach((Ht, it) =>
          h.push({ x: Ht, z: jr + (it % 2 ? 1 : -1) * (dn / 2 - 0.3), face: it % 2 ? -1 : 1 }),
        ));
    }
    let B = Ta(x.id === "royal" ? "#e9dfc9" : "#d8d2c6", 0.8),
      X = x.id === "royal" ? 3.2 : 2,
      M = (ie, jr, dn, Vn) => {
        let hn = new pt.Mesh(ss, B);
        (hn.scale.set(dn, X, Vn), hn.position.set(ie, 0, jr), (hn.castShadow = !0), t.add(hn));
      },
      _ = x.gate.x,
      lt = x.gate.z,
      vt = 14;
    if (Math.abs(_ - k.x0) < 20 || Math.abs(_ - k.x1) < 20) {
      let ie = Math.abs(_ - k.x0) < 20 ? k.x0 : k.x1;
      (M(L, k.z0, b, 0.5),
        M(L, k.z1, b, 0.5),
        M(k.x0 + k.x1 - ie, E, 0.5, w),
        M(ie, (k.z0 + lt - vt / 2) / 2, 0.5, lt - vt / 2 - k.z0),
        M(ie, (lt + vt / 2 + k.z1) / 2, 0.5, k.z1 - lt - vt / 2));
    } else {
      let ie = Math.abs(lt - k.z0) < 20 ? k.z0 : k.z1;
      (M(k.x0, E, 0.5, w),
        M(k.x1, E, 0.5, w),
        M(L, k.z0 + k.z1 - ie, b, 0.5),
        M((k.x0 + _ - vt / 2) / 2, ie, _ - vt / 2 - k.x0, 0.5),
        M((_ + vt / 2 + k.x1) / 2, ie, k.x1 - _ - vt / 2, 0.5));
    }
    let zt = new pt.Group();
    (zt.position.set(_, 0, lt), zt.lookAt(x.gate.face.x, 0, x.gate.face.z), t.add(zt));
    for (let ie of [-vt / 2, vt / 2]) {
      let jr = new pt.Mesh(ss, B);
      (jr.scale.set(1.4, X + 3, 1.4), jr.position.set(ie, 0, 0), zt.add(jr));
      let dn = new pt.Mesh(new pt.SphereGeometry(0.3, 12, 8), Xa);
      (dn.position.set(ie, X + 3.3, 0), zt.add(dn));
    }
    let Pe = new pt.Mesh(ss, Ta("#2b2e33", 0.4, 0.4));
    (Pe.scale.set(2.4, 2.8, 2.4), Pe.position.set(vt / 2 + 2.6, 0, -1), zt.add(Pe));
    let Je = new pt.Mesh(new pt.BoxGeometry(vt - 1.5, 0.15, 0.15), Ta("#d63a3a", 0.5));
    (Je.position.set(0, 1.1, -0.6), zt.add(Je));
    let Ua = new pt.Group(),
      Ja = new pt.Mesh(new pt.CapsuleGeometry(0.3, 0.8, 4, 8), Ta("#1b2433", 0.6));
    ((Ja.position.y = 1), Ua.add(Ja));
    let je = new pt.Mesh(new pt.SphereGeometry(0.2, 12, 10), Ta("#c68e65", 0.7));
    ((je.position.y = 1.75), Ua.add(je));
    let ye = new pt.Mesh(new pt.BoxGeometry(0.3, 0.07, 0.05), Ta("#4da3ff", 0.2, 0.6));
    (ye.position.set(0, 1.78, 0.18), Ua.add(ye), Ua.position.set(vt / 2 + 1.2, 0, 1.4), zt.add(Ua));
    let cn = De(
      x.name.toUpperCase(),
      x.passport ? "Passport holders and invited guests" : x.tagline.split("\u2014")[0].slice(0, 46),
      x.color,
      12,
    );
    (cn.position.set(0, X + 4.6, 0.8), zt.add(cn));
    let Uo = cn.clone();
    ((Uo.rotation.y = Math.PI), (Uo.position.z = -0.8), zt.add(Uo));
    let Gn = new pt.Vector3(0, 0, 6).applyQuaternion(zt.quaternion).add(zt.position);
    e.push({
      pos: Gn,
      radius: 5,
      label: `${x.name} \u2014 plots, prices and rent`,
      action: "estate",
      payload: x.id,
    });
    let We = x.count,
      zr = x.id === "executive" ? NN : x.id === "royal" ? RN : ss,
      wr = new pt.InstancedMesh(ss, c, We);
    ((wr.castShadow = !0), (wr.receiveShadow = !0));
    let fr = new pt.InstancedMesh(zr, Ta("#ffffff", 0.8), We);
    ((fr.castShadow = !0),
      (fr.defColor = x.id === "marina" ? "#f2f2ee" : x.id === "royal" ? "#6b4a3a" : "#5a3f35"));
    let So = new pt.InstancedMesh(ss, Ta("#ffffff", 0.5, 0.3), We),
      Lt = new pt.InstancedMesh(ss, Ta("#9fb87a", 1), We);
    Lt.receiveShadow = !0;
    let ae = new pt.InstancedMesh(ss, Ta("#2b2e33", 0.5, 0.3), We),
      ka = new pt.InstancedMesh(ss, Ta("#ffffff", 0.5), We),
      ja = new pt.InstancedMesh(Gx, Ta(x.id === "marina" ? "#5f8a3a" : "#4f7f35", 0.9), We);
    ja.castShadow = !0;
    let mr = new pt.InstancedMesh(Vx, Ta("#6b4a32", 0.9), We),
      fo = new pt.InstancedMesh(ss, Ta("#3f6b2c", 1), We);
    ([wr, fr, So, Lt, ae, ka, ja, mr, fo].forEach((ie) => {
      (ie.instanceMatrix.setUsage(pt.DynamicDrawUsage), t.add(ie));
    }),
      s.push({
        soc: x,
        plots: S,
        body: wr,
        roof: fr,
        win: So,
        pad: Lt,
        post: ae,
        flag: ka,
        crown: ja,
        trunk: mr,
        hedge: fo,
      }),
      S.forEach((ie) => {
        ie.empty || a.push({ x: ie.x, z: ie.z, r: ie.size * 0.33 });
      }));
  });
  {
    let x = new pt.InstancedMesh(
        new pt.CylinderGeometry(0.07, 0.1, 5, 6).translate(0, 2.5, 0),
        Ta("#2b2e33", 0.5, 0.5),
        h.length,
      ),
      k = new pt.InstancedMesh(
        new pt.BoxGeometry(0.08, 0.08, 1.2).translate(0, 0, 0.6),
        Ta("#2b2e33", 0.5, 0.5),
        h.length,
      ),
      b = new pt.InstancedMesh(new pt.BoxGeometry(0.34, 0.14, 0.5), Xa, h.length);
    (h.forEach((w, L) => {
      (o.setFromAxisAngle(n, w.face > 0 ? 0 : Math.PI),
        r.compose(new pt.Vector3(w.x, 0, w.z), o, new pt.Vector3(1, 1, 1)),
        x.setMatrixAt(L, r),
        r.compose(new pt.Vector3(w.x, 4.95, w.z), o, new pt.Vector3(1, 1, 1)),
        k.setMatrixAt(L, r),
        r.compose(new pt.Vector3(w.x, 4.88, w.z + w.face * 1.15), o, new pt.Vector3(1, 1, 1)),
        b.setMatrixAt(L, r));
    }),
      (x.castShadow = !0),
      t.add(x, k, b));
  }
  {
    let x = new pt.Group();
    (x.position.set(Jt.x, 0, Jt.z), t.add(x));
    let k = Rl.x1 - Rl.x0,
      b = Rl.z1 - Rl.z0,
      w = new pt.Mesh(new pt.PlaneGeometry(k, b), Ta("#c9c3b8", 0.9));
    ((w.rotation.x = -Math.PI / 2), (w.position.y = 0.04), x.add(w));
    for (let E = 0; E < Jt.towers; E++) {
      let T = ((E % 3) - 1) * 30,
        S = (Math.floor(E / 3) - 0.5) * 50,
        H = Jt.floors * 3.1,
        N = new pt.Mesh(
          new pt.BoxGeometry(16, H, 14),
          Ea({ base: "#eef2f6", tint: Jt.color, kind: 0, h: H, seed: 0.1 + E * 0.07 }),
        );
      (N.position.set(T, H / 2, S),
        (N.castShadow = !0),
        x.add(N),
        a.push({ x: Jt.x + T, z: Jt.z + S, r: 9.5 }));
      let B = De(`TOWER ${E + 1}`, "Free studios", Jt.color, 7);
      (B.position.set(T, 3.2, S + 7.05), x.add(B));
    }
    let L = De("STARTER COMMONS", "Free studio apartments for every visitor", Jt.color, 12);
    (L.position.set(0, 4.5, -b / 2 + 1),
      (L.rotation.y = Math.PI),
      x.add(L),
      e.push({
        pos: new pt.Vector3(Jt.x, 0, Jt.z - 14),
        radius: 6,
        label: "Starter Commons \u2014 claim your free studio",
        action: "estate",
        payload: "starter",
      }));
  }
  let u = new pt.Color(),
    p = new pt.Group();
  t.add(p);
  let v = {
      hedge: Ta("#3f6b2c", 1),
      picket: Ta("#f4f1ea", 0.6),
      iron: Ta("#1b1d22", 0.4, 0.6),
      wall: Ta("#d8d2c6", 0.85),
      stone: Ta("#a8a39a", 0.95),
      lawn: Ta("#7fa356", 1),
    },
    g = ["#e05a8a", "#ffd23f", "#ff9a3c", "#ffffff", "#b06ad9"].map((x) => Ta(x, 0.8)),
    m = new pt.BoxGeometry(1, 1, 1).translate(0, 0.5, 0);
  function f(x, k) {
    let b = new pt.Group();
    (b.position.set(x.x, 0, x.z), x.face < 0 && (b.rotation.y = Math.PI));
    let w = x.size / 2 - 0.25,
      L = (S, H, N, B, X, M, _) => {
        let lt = new pt.Mesh(m, S);
        return (lt.scale.set(H, N, B), lt.position.set(X, M, _), b.add(lt), lt);
      },
      E = (S, H, N, B) => {
        let X = Math.hypot(N - S, B - H),
          M = (S + N) / 2,
          _ = (H + B) / 2,
          lt = Math.abs(N - S) > Math.abs(B - H);
        if (k.fence === "hedge") L(v.hedge, lt ? X : 0.5, 0.9, lt ? 0.5 : X, M, 0, _);
        else if (k.fence === "wall") L(v.wall, lt ? X : 0.3, 0.8, lt ? 0.3 : X, M, 0, _);
        else if (k.fence === "picket" || k.fence === "iron") {
          let vt = k.fence === "iron" ? v.iron : v.picket,
            zt = k.fence === "iron" ? 0.05 : 0.09,
            Pe = k.fence === "iron" ? 1.2 : 0.95;
          for (let Ua of [0.3, Pe - 0.2]) L(vt, lt ? X : zt, 0.06, lt ? zt : X, M, Ua, _);
          let Je = Math.max(2, Math.round(X / (k.fence === "iron" ? 0.25 : 0.32)));
          for (let Ua = 0; Ua <= Je; Ua++) {
            let Ja = Ua / Je;
            L(vt, zt, Pe, zt, S + (N - S) * Ja, 0, H + (B - H) * Ja);
          }
        }
      };
    k.fence &&
      k.fence !== "none" &&
      (E(-w, -w, w, -w), E(-w, -w, -w, w), E(w, -w, w, w), E(-w, w, -1.5, w), E(1.5, w, w, w));
    let T = w - 1.6;
    if (k.garden === "flowers")
      for (let S = 0; S < 18; S++) {
        let H = -w + 0.8 + (S % 9) * ((2 * w - 1.6) / 8);
        Math.abs(H) < 1.6 ||
          L(g[S % g.length], 0.35, 0.35 + (S % 3) * 0.08, 0.35, H, 0, T + (S < 9 ? 0 : 0.6));
      }
    else if (k.garden === "stone") L(v.stone, 2 * w - 1, 0.06, 2.2, 0, 0, T + 0.2);
    else if (k.garden === "trees")
      for (let S of [-1, 1]) {
        let H = new pt.Mesh(Vx, Ta("#6b4a32", 0.9));
        (H.scale.set(1, 1.6, 1), H.position.set(S * (w - 1.6), 0, T), b.add(H));
        let N = new pt.Mesh(Gx, Ta("#5f8a3a", 0.9));
        (N.scale.setScalar(1.1), N.position.set(S * (w - 1.6), 2.3, T), (N.castShadow = !0), b.add(N));
        for (let B = 0; B < 4; B++) {
          let X = new pt.Mesh(new pt.SphereGeometry(0.11, 6, 5), g[2]);
          (X.position.set(
            S * (w - 1.6) + Math.cos(B * 1.7) * 0.9,
            2.1 + (B % 2) * 0.4,
            T + Math.sin(B * 1.7) * 0.9,
          ),
            b.add(X));
        }
      }
    else L(v.lawn, 2 * w - 1, 0.03, 2.4, 0, 0, T);
    (L(v.stone, 1.4, 0.05, 2.4, 0, 0, w - 1.2), p.add(b));
  }
  function y(x, k, b = {}) {
    p.children.slice().forEach((w) => {
      (p.remove(w),
        w.traverse((L) => {
          L.geometry && L.geometry !== m && L.geometry !== Vx && L.geometry !== Gx && L.geometry.dispose();
        }));
    });
    for (let w of s) {
      let L = AN[w.soc.id];
      (w.plots.forEach((E, T) => {
        let S = x[E.id],
          H = !E.empty || !!S,
          N = E.face < 0 ? Math.PI : 0;
        o.setFromAxisAngle(n, N);
        let B = E.size;
        if (H) {
          let M = L[S?.style ?? E.style] || L[0],
            _ = B * M[0],
            lt = M[1],
            vt = B * M[2];
          (r.compose(new pt.Vector3(E.x, 0, E.z), o, new pt.Vector3(_, lt, vt)), w.body.setMatrixAt(T, r));
          let zt = w.soc.id === "marina" ? 0.35 : B * 0.3;
          (r.compose(
            new pt.Vector3(E.x, lt, E.z),
            o,
            w.soc.id === "marina"
              ? new pt.Vector3(_ + 0.8, zt, vt + 0.8)
              : new pt.Vector3(_ * 1.08, zt, vt * 1.08),
          ),
            w.roof.setMatrixAt(T, r));
          let Pe = E.face * (vt / 2 + 0.6);
          (r.compose(
            new pt.Vector3(E.x, Math.min(2.6, lt * 0.42), E.z + Pe),
            o,
            new pt.Vector3(_ * 0.36, 0.14, 1.2),
          ),
            w.win.setMatrixAt(T, r));
          let Je = S ? b[E.id] : void 0;
          (w.body.setColorAt(
            T,
            u.set(Je ? Je.wall : S ? (S.owner === k ? "#ffe2b0" : "#ffffff") : IL[(E.n * 7) % IL.length]),
          ),
            w.roof.setColorAt(T, u.set(Je ? Je.roof : w.roof.defColor)),
            w.win.setColorAt(T, u.set(Je ? Je.trim : "#3a3f46")),
            Je && f(E, Je),
            w.pad.setMatrixAt(T, i));
          let Ua = -E.face * (B / 2 - 1.3),
            Ja = (E.n % 2 ? 1 : -1) * (B / 2 - 1.4),
            je = 1.1 + ((E.n * 13) % 7) / 10;
          (r.compose(new pt.Vector3(E.x + Ja, 0, E.z + Ua), o, new pt.Vector3(1, 2.2 * je, 1)),
            w.trunk.setMatrixAt(T, r),
            r.compose(
              new pt.Vector3(E.x + Ja, 2.2 * je + 0.9 * je, E.z + Ua),
              o,
              new pt.Vector3(1.4 * je, 1.5 * je, 1.4 * je),
            ),
            w.crown.setMatrixAt(T, r),
            Je
              ? w.hedge.setMatrixAt(T, i)
              : (r.compose(
                  new pt.Vector3(E.x - B * 0.22, 0, E.z + E.face * (B / 2 - 0.3)),
                  o,
                  new pt.Vector3(B * 0.5, 0.7, 0.45),
                ),
                w.hedge.setMatrixAt(T, r)));
        } else
          (w.roof.setColorAt(T, u.set(w.roof.defColor)),
            w.win.setColorAt(T, u.set("#3a3f46")),
            w.body.setMatrixAt(T, i),
            w.roof.setMatrixAt(T, i),
            w.win.setMatrixAt(T, i),
            w.trunk.setMatrixAt(T, i),
            w.crown.setMatrixAt(T, i),
            w.hedge.setMatrixAt(T, i),
            r.compose(new pt.Vector3(E.x, 0.02, E.z), o, new pt.Vector3(B, 0.08, B)),
            w.pad.setMatrixAt(T, r));
        let X = S
          ? S.auction
            ? "auction"
            : S.sale
              ? "sale"
              : S.rent && !S.rent.tenant
                ? "rent"
                : S.owner === k
                  ? "mine"
                  : ""
          : E.empty
            ? "land"
            : "";
        if (X) {
          let M = E.face * (B / 2 - 0.6);
          (r.compose(new pt.Vector3(E.x + B * 0.3, 0, E.z + M), o, new pt.Vector3(0.1, 1.8, 0.1)),
            w.post.setMatrixAt(T, r),
            r.compose(
              new pt.Vector3(E.x + B * 0.3, 1.5, E.z + M + E.face * 0.06),
              o,
              new pt.Vector3(1.6, 0.9, 0.05),
            ),
            w.flag.setMatrixAt(T, r),
            w.flag.setColorAt(T, u.set(ic[X])));
        } else (w.post.setMatrixAt(T, i), w.flag.setMatrixAt(T, i));
      }),
        [w.body, w.roof, w.win, w.pad, w.post, w.flag, w.crown, w.trunk, w.hedge].forEach((E) => {
          ((E.instanceMatrix.needsUpdate = !0), E.instanceColor && (E.instanceColor.needsUpdate = !0));
        }));
    }
  }
  return (y({}), { group: t, interacts: e, colliders: a, refresh: y });
}
var Ys = 64,
  Px = 32,
  zN = 4.2,
  VL = (t) => Ys / 2 - Math.abs(((((t + Px) % Ys) + Ys) % Ys) - Ys / 2),
  jN = Oa.filter((t) => t.kind !== "homes");
function WN(t, e) {
  return Math.min(VL(t), VL(e)) < zN;
}
function Hi(t, e) {
  return Bl(t, e)
    ? Pw(t, e)
    : e < -356 ||
        Math.hypot(t, e) < 34 ||
        (t > 40 && t < 320 && (Math.abs(e) < 12 || Math.abs(e + 96) < 12)) ||
        jN.some((a) => Math.hypot(a.x - t, a.z - e) < a.r)
      ? !1
      : WN(t, e);
}
function Ig(t, e, a = 70) {
  let r = (s) => {
      let l = Math.round((s - Px) / Ys) * Ys + Px;
      return [l, l - Ys, l + Ys];
    },
    o = null,
    n = a,
    i = (s, l, c) => {
      let d = Math.hypot(s - t, l - e);
      d < n && Hi(s, l) && ((n = d), (o = { x: s, z: l, heading: c }));
    };
  for (let s of r(t)) for (let l of [0, -6, 6, -14, 14, -24, 24]) i(s + 2, e + l, 0);
  for (let s of r(e)) for (let l of [0, -6, 6, -14, 14, -24, 24]) i(t + l, s - 2, Math.PI / 2);
  for (let s = -12; s <= 12; s += 2) i(t, e + s, Math.PI / 2);
  return o;
}
var nt = P(ea(), 1);
var Fr = (t, e = 0.6, a = 0) => new nt.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  Ge = {
    sand: Fr("#e3cf9e", 1),
    wood: Fr("#8a6446", 0.8),
    white: Fr("#f6f6f3", 0.35, 0.1),
    navy: Fr("#1b2a4a", 0.4, 0.2),
    glass: new nt.MeshStandardMaterial({ color: "#25384a", roughness: 0.05, metalness: 0.8 }),
    steel: Fr("#c9ced4", 0.3, 0.8),
    red: Fr("#c0392b", 0.5),
    dark: Fr("#2b2e33", 0.6, 0.4),
    asphalt: Fr("#3a3d42", 0.95),
    stripe: Fr("#f2f2f2", 0.8),
    teak: Fr("#a0764f", 0.7),
  };
function IN(t, e, a) {
  let r = document.createElement("canvas");
  ((r.width = 1024), (r.height = 256));
  let o = r.getContext("2d");
  return (
    eo(o, 6, 6, 1012, 244, 30),
    (o.fillStyle = "#10161d"),
    o.fill(),
    (o.lineWidth = 8),
    (o.strokeStyle = a),
    o.stroke(),
    (o.textAlign = "center"),
    (o.fillStyle = "#fff"),
    (o.font = "800 86px Sora, sans-serif"),
    o.fillText(t, 512, e ? 124 : 156),
    e &&
      ((o.fillStyle = "rgba(255,255,255,.78)"),
      (o.font = '600 40px "Plus Jakarta Sans", sans-serif'),
      o.fillText(e, 512, 200)),
    new nt.CanvasTexture(r)
  );
}
function Ox(t, e, a, r) {
  let o = new nt.MeshStandardMaterial({
    map: IN(t, e, a),
    emissive: "#fff",
    emissiveIntensity: 0.15,
    side: nt.DoubleSide,
  });
  return ((o.emissiveMap = o.map), Mo.push(o), new nt.Mesh(new nt.PlaneGeometry(r, r / 4), o));
}
function Dx(t, e = "#1b2a4a") {
  let a = new nt.Group(),
    r = t * 0.24,
    o = new nt.Mesh(new nt.BoxGeometry(r, t * 0.09, t * 0.78), Ge.white);
  (o.position.set(0, t * 0.03, -t * 0.06), a.add(o));
  let n = new nt.Mesh(new nt.ConeGeometry(r / 2, t * 0.3, 4, 1), Ge.white);
  ((n.rotation.x = Math.PI / 2),
    (n.rotation.y = Math.PI / 4),
    n.scale.set(1, 1, 0.5),
    n.position.set(0, t * 0.03, t * 0.47),
    a.add(n));
  let i = new nt.Mesh(new nt.BoxGeometry(r * 1.01, t * 0.018, t * 0.78), Fr(e, 0.4));
  (i.position.set(0, t * 0, -t * 0.06), a.add(i));
  let s = new nt.Mesh(new nt.BoxGeometry(r * 0.94, t * 0.01, t * 0.76), Ge.teak);
  (s.position.set(0, t * 0.078, -t * 0.06), a.add(s));
  let l = new nt.Mesh(new nt.BoxGeometry(r * 0.78, t * 0.07, t * 0.42), Ge.white);
  (l.position.set(0, t * 0.115, -t * 0.08), a.add(l));
  let c = new nt.Mesh(new nt.BoxGeometry(r * 0.8, t * 0.035, t * 0.4), Ge.glass);
  (c.position.set(0, t * 0.12, -t * 0.08), a.add(c));
  let d = new nt.Mesh(new nt.BoxGeometry(r * 0.6, t * 0.05, t * 0.22), Ge.white);
  (d.position.set(0, t * 0.17, -t * 0.12), a.add(d));
  let h = new nt.Mesh(new nt.BoxGeometry(r * 0.62, t * 0.025, t * 0.2), Ge.glass);
  (h.position.set(0, t * 0.175, -t * 0.12), a.add(h));
  let u = new nt.Mesh(new nt.CylinderGeometry(t * 0.004, t * 0.006, t * 0.12, 6), Ge.steel);
  return (
    u.position.set(0, t * 0.25, -t * 0.14),
    a.add(u),
    a.traverse((p) => {
      p.isMesh && (p.castShadow = !0);
    }),
    a
  );
}
function Fx() {
  let t = new nt.Group(),
    e = new nt.Mesh(new nt.CylinderGeometry(1.6, 1.6, 26, 20), Ge.white);
  ((e.rotation.x = Math.PI / 2), t.add(e));
  let a = new nt.Mesh(new nt.SphereGeometry(1.6, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), Ge.white);
  ((a.rotation.x = Math.PI / 2), (a.scale.y = 1.8), (a.position.z = 13), t.add(a));
  let r = new nt.Mesh(new nt.ConeGeometry(1.6, 6, 20), Ge.white);
  ((r.rotation.x = -Math.PI / 2), (r.position.z = -16), t.add(r));
  let o = new nt.Mesh(
    new nt.CylinderGeometry(1.62, 1.62, 26, 20, 1, !0, Math.PI * 0.35, Math.PI * 0.3),
    Fr("#2f6fe0", 0.4),
  );
  ((o.rotation.x = Math.PI / 2), t.add(o));
  let n = new nt.Mesh(new nt.BoxGeometry(30, 0.35, 4.6), Ge.steel);
  (n.position.set(0, -0.6, 0.5), t.add(n));
  let i = new nt.Mesh(new nt.BoxGeometry(10, 0.25, 2.4), Ge.steel);
  (i.position.set(0, 0.4, -16), t.add(i));
  let s = new nt.Mesh(new nt.BoxGeometry(0.3, 5, 3.4), Fr("#ff9a3c", 0.4));
  (s.position.set(0, 3, -16.5), t.add(s));
  for (let c of [-1, 1]) {
    let d = new nt.Mesh(new nt.CylinderGeometry(0.8, 0.9, 3.4, 14), Ge.dark);
    ((d.rotation.x = Math.PI / 2), d.position.set(c * 6, -1.5, 1.5), t.add(d));
  }
  let l = new nt.Mesh(new nt.BoxGeometry(3.25, 0.35, 18), Fr("#1a2633", 0.1, 0.8));
  return (
    l.position.set(0, 0.55, 0),
    t.add(l),
    t.traverse((c) => {
      c.isMesh && (c.castShadow = !0);
    }),
    t
  );
}
function Ux() {
  let t = new nt.Group(),
    e = new nt.Mesh(new nt.SphereGeometry(1.4, 20, 14), Fr("#111418", 0.25, 0.7));
  (e.scale.set(1, 0.9, 1.5), (e.position.y = 1.6), t.add(e));
  let a = new nt.Mesh(new nt.SphereGeometry(1.42, 20, 14, -Math.PI / 2, Math.PI, 0, Math.PI / 2), Ge.glass);
  (a.scale.set(1, 0.9, 1.5), (a.position.y = 1.62), (a.rotation.y = 0), t.add(a));
  let r = new nt.Mesh(new nt.CylinderGeometry(0.18, 0.3, 5, 10), Fr("#111418", 0.3, 0.6));
  ((r.rotation.x = Math.PI / 2), r.position.set(0, 1.9, -3.6), t.add(r));
  let o = new nt.Mesh(new nt.BoxGeometry(0.12, 1.2, 0.8), Fr("#ffc27a", 0.4, 0.4));
  (o.position.set(0, 2.4, -6), t.add(o));
  for (let s of [-1, 1]) {
    let l = new nt.Mesh(new nt.CylinderGeometry(0.07, 0.07, 3.6, 8), Ge.steel);
    ((l.rotation.x = Math.PI / 2), l.position.set(s * 0.9, 0.15, 0), t.add(l));
  }
  let n = new nt.Group();
  ((n.name = "rotor"), (n.position.y = 3.05), t.add(n));
  for (let s = 0; s < 4; s++) {
    let l = new nt.Mesh(new nt.BoxGeometry(0.25, 0.04, 9), Ge.dark);
    ((l.rotation.y = (s / 4) * Math.PI), n.add(l));
  }
  let i = new nt.Mesh(new nt.CylinderGeometry(0.15, 0.15, 0.6, 8), Ge.steel);
  return ((i.position.y = 2.75), t.add(i), t);
}
function PL() {
  let t = new nt.Group(),
    e = [],
    a = [],
    r = we.x1 - we.x0,
    o = (we.x0 + we.x1) / 2,
    n = new nt.Mesh(new nt.PlaneGeometry(r, we.beach - we.water + 6), Ge.sand);
  ((n.rotation.x = -Math.PI / 2),
    n.position.set(o, 0.035, (we.beach + we.water) / 2 - 3),
    (n.receiveShadow = !0),
    t.add(n));
  let i = new nt.Mesh(new nt.PlaneGeometry(r + 1400, 1400), mu("lagoon"));
  ((i.rotation.x = -Math.PI / 2), i.position.set(o, 0.05, we.water - 700), t.add(i));
  let s = new nt.Mesh(new nt.BoxGeometry(r - 40, 0.25, 7), Ge.wood);
  (s.position.set(o, 0.13, we.board.z - 4), (s.receiveShadow = !0), t.add(s));
  let l = new nt.Mesh(new nt.BoxGeometry(r - 40, 0.08, 0.08), Ge.steel);
  (l.position.set(o, 1.1, we.board.z - 7.4), t.add(l));
  for (let w = we.x0 + 30; w < we.x1 - 20; w += 14) {
    let L = new nt.Mesh(new nt.BoxGeometry(0.08, 1, 0.08), Ge.steel);
    if ((L.position.set(w, 0.6, we.board.z - 7.4), t.add(L), Math.round(w) % 28 === 0)) {
      let E = new nt.Group(),
        T = new nt.Mesh(new nt.CylinderGeometry(0.07, 0.1, 4.4, 8), Ge.dark);
      ((T.position.y = 2.2), E.add(T));
      let S = new nt.Mesh(new nt.SphereGeometry(0.24, 12, 8), Xa);
      ((S.position.y = 4.4), E.add(S), E.position.set(w, 0, we.board.z - 0.6), t.add(E));
    } else {
      let E = ya("#3f7d2e", 1.1);
      (E.position.set(w, 0, we.board.z + 1.6), t.add(E), a.push({ x: w, z: we.board.z + 1.6, r: 0.6 }));
    }
  }
  let c = ["#ff9a3c", "#2f6fe0", "#f6f6f3", "#45e0ae"];
  for (let w = 0; w < 26; w++) {
    let L = we.x0 + 50 + w * 30 + ((w * 7) % 9),
      E = we.beach - 9 - (w % 3) * 3,
      T = new nt.Group(),
      S = new nt.Mesh(new nt.CylinderGeometry(0.04, 0.04, 2.4, 6), Ge.white);
    ((S.position.y = 1.2), T.add(S));
    let H = new nt.Mesh(new nt.ConeGeometry(1.5, 0.5, 12), Fr(c[w % 4], 0.8));
    ((H.position.y = 2.4), T.add(H));
    for (let N of [-0.7, 0.7]) {
      let B = new nt.Mesh(new nt.BoxGeometry(0.6, 0.12, 1.7), Ge.white);
      (B.position.set(N, 0.3, 0.8), (B.rotation.x = -0.12), T.add(B));
    }
    (T.position.set(L, 0, E), t.add(T));
  }
  let d = Ox(
    "SEA VIEW \xB7 FYRUS COAST",
    "Beach \xB7 boardwalk \xB7 yachts \xB7 sunset cruises",
    "#7fd1ff",
    12,
  );
  (d.position.set(we.board.x, 4.2, we.board.z + 3.4), t.add(d));
  let h = d.clone();
  ((h.rotation.y = Math.PI), (h.position.z -= 0.05), t.add(h));
  for (let w of [-6, 6]) {
    let L = new nt.Mesh(new nt.CylinderGeometry(0.12, 0.12, 4.4, 8), Ge.dark);
    (L.position.set(we.board.x + w, 2.2, we.board.z + 3.4), t.add(L));
  }
  let u = we.pier,
    p = new nt.Mesh(new nt.BoxGeometry(6, 0.4, 70), Ge.wood);
  (p.position.set(u.x, 0.5, u.z - 30), t.add(p));
  for (let w = 0; w < 12; w++)
    for (let L of [-1, 1]) {
      let E = new nt.Mesh(new nt.CylinderGeometry(0.18, 0.18, 3, 8), Ge.dark);
      (E.position.set(u.x + L * 2.8, -0.6, u.z + 4 - w * 6), t.add(E));
    }
  let v = Ox("FYRUS MARINA PIER", "Private yachts \xB7 cruises 25 FYC", "#ffc27a", 7);
  (v.position.set(u.x, 3.2, u.z + 6), t.add(v));
  let g = {};
  (Sh.forEach((w, L) => {
    let E = Dx(w.len, ["#1b2a4a", "#2f6fe0", "#b8862b", "#45e0ae", "#111418"][L % 5]);
    (E.position.set(w.x, 0.1, w.z), (E.rotation.y = 0.3 + L * 0.7), t.add(E), (g[w.id] = E));
  }),
    e.push({
      pos: new nt.Vector3(u.x, 0, u.z + 3),
      radius: 4,
      label: "Fyrus Marina \u2014 sunset cruise on a yacht (25 FYC)",
      action: "cruise",
      payload: "y3",
    }));
  let m = new nt.Group();
  (m.position.set(we.x1 - 30, 0, we.water - 6), t.add(m));
  for (let w = 0; w < 6; w++) {
    let L = new nt.Mesh(
      new nt.CylinderGeometry(2.2 - w * 0.18, 2.4 - w * 0.18, 3, 20),
      w % 2 ? Ge.red : Ge.white,
    );
    ((L.position.y = 1.5 + w * 3), m.add(L));
  }
  let f = new nt.Mesh(
    new nt.CylinderGeometry(1.2, 1.2, 1.8, 16),
    new nt.MeshStandardMaterial({
      color: "#fff4dc",
      emissive: "#ffd27a",
      emissiveIntensity: 1.2,
      transparent: !0,
      opacity: 0.85,
    }),
  );
  ((f.position.y = 19), m.add(f));
  let y = new nt.Mesh(
    new nt.ConeGeometry(4, 40, 16, 1, !0),
    new nt.MeshBasicMaterial({
      color: "#fff3c4",
      transparent: !0,
      opacity: 0.07,
      side: nt.DoubleSide,
      depthWrite: !1,
    }),
  );
  ((y.rotation.z = Math.PI / 2), y.position.set(20, 19, 0));
  let x = new nt.Group();
  (x.add(y), m.add(x), a.push({ x: we.x1 - 30, z: we.water - 6, r: 2.6 }));
  let k = 0;
  return {
    group: t,
    interacts: e,
    colliders: a,
    tick: (w, L) => {
      ((k += w),
        (x.rotation.y = L * 0.6),
        Sh.forEach((E, T) => {
          let S = g[E.id];
          S.userData.busy ||
            ((S.position.y = 0.1 + Math.sin(L * 0.9 + T) * 0.12),
            (S.rotation.z = Math.sin(L * 0.7 + T) * 0.02));
        }));
    },
    yachts: g,
  };
}
function OL() {
  let t = new nt.Group(),
    e = [],
    a = [],
    r = Ep.runway;
  (t.position.set(r.x, 0, r.z), (t.rotation.y = r.ry));
  let o = (m, f) => {
      let y = new nt.Vector3(m, 0, f).applyAxisAngle(new nt.Vector3(0, 1, 0), r.ry);
      return new nt.Vector3(r.x + y.x, 0, r.z + y.z);
    },
    n = new nt.Mesh(new nt.BoxGeometry(r.len, 0.08, 16), Ge.asphalt);
  (n.position.set(0, 0.05, 0), (n.receiveShadow = !0), t.add(n));
  for (let m = -r.len / 2 + 8; m < r.len / 2 - 8; m += 12) {
    let f = new nt.Mesh(new nt.BoxGeometry(6, 0.02, 0.5), Ge.stripe);
    (f.position.set(m, 0.1, 0), t.add(f));
  }
  for (let m of [-1, 1]) {
    let f = new nt.Mesh(new nt.BoxGeometry(r.len, 0.02, 0.3), Ge.stripe);
    (f.position.set(0, 0.1, m * 7.5), t.add(f));
  }
  let i = Fx();
  (i.position.set(-r.len / 2 + 22, 3.2, 0), (i.rotation.y = Math.PI / 2), t.add(i));
  let s = new nt.Mesh(
    new nt.BoxGeometry(40, 7, 10),
    new nt.MeshStandardMaterial({ color: "#dfe6ee", roughness: 0.3, metalness: 0.3 }),
  );
  (s.position.set(0, 3.5, -22), (s.castShadow = !0), t.add(s));
  let l = new nt.Mesh(new nt.BoxGeometry(40.2, 4, 0.2), Ge.glass);
  (l.position.set(0, 3.8, -16.95), t.add(l));
  let c = Ox(
    "FYRUS INTERNATIONAL AIRPORT",
    "Fyrus Airlines \xB7 immigration \xB7 helicopters",
    "#4da3ff",
    18,
  );
  (c.position.set(0, 8.8, -16.8), t.add(c));
  let d = c.clone();
  ((d.rotation.y = Math.PI),
    (d.position.z = -27.2),
    t.add(d),
    [-12, 0, 12].forEach((m) => {
      let f = o(m, -22);
      a.push({ x: f.x, z: f.z, r: 6.5 });
    }));
  let h = o(0, -30);
  e.push({
    pos: h,
    radius: 4.5,
    label: "Fyrus Airlines check-in \u2014 flights and helicopters",
    action: "fly",
  });
  let u = { x: r.len / 2 + 12, z: -14 },
    p = new nt.Mesh(new nt.CircleGeometry(5, 32), Fr("#2b2e33", 0.9));
  ((p.rotation.x = -Math.PI / 2), p.position.set(u.x, 0.06, u.z), t.add(p));
  let v = new nt.Mesh(new nt.RingGeometry(3.6, 4.2, 32), Ge.stripe);
  ((v.rotation.x = -Math.PI / 2), v.position.set(u.x, 0.08, u.z), t.add(v));
  let g = Ux();
  return (
    g.position.set(u.x, 0.1, u.z),
    t.add(g),
    {
      group: t,
      interacts: e,
      colliders: a,
      plane: i,
      tick: (m, f) => {
        g.getObjectByName("rotor").rotation.y = f * 0.4;
      },
    }
  );
}
var z = P(ea(), 1);
var FL = (t, e) => t.applyAxisAngle(new z.Vector3(0, 1, 0), e),
  GN = (t, e) => Math.atan2(-t, -e),
  br = {
    concrete: new z.MeshStandardMaterial({ color: "#b9b4aa", roughness: 0.9 }),
    stone: new z.MeshStandardMaterial({ color: "#d6d0c4", roughness: 0.85 }),
    dark: new z.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.6, metalness: 0.4 }),
    steel: new z.MeshStandardMaterial({ color: "#9aa1a8", roughness: 0.35, metalness: 0.8 }),
    wood: new z.MeshStandardMaterial({ color: "#8a6446", roughness: 0.8 }),
    white: new z.MeshStandardMaterial({ color: "#f2f2ee", roughness: 0.6 }),
    tile: new z.MeshStandardMaterial({ color: "#e9eef0", roughness: 0.5 }),
    green: new z.MeshStandardMaterial({ color: "#0f6b3a", roughness: 0.6 }),
  };
function VN(t, e, a, r = 1024, o = 256) {
  let n = document.createElement("canvas");
  ((n.width = r), (n.height = o));
  let i = n.getContext("2d");
  (eo(i, 6, 6, r - 12, o - 12, 26),
    (i.fillStyle = "#1d2228"),
    i.fill(),
    (i.lineWidth = 6),
    (i.strokeStyle = a),
    i.stroke(),
    (i.textAlign = "center"),
    (i.fillStyle = "#fff"),
    (i.font = `800 ${Math.round(o * 0.36)}px Sora, sans-serif`),
    i.fillText(t, r / 2, e ? o * 0.52 : o * 0.62),
    e &&
      ((i.fillStyle = "rgba(255,255,255,.75)"),
      (i.font = `600 ${Math.round(o * 0.14)}px "Plus Jakarta Sans", sans-serif`),
      i.fillText(e, r / 2, o * 0.8)));
  let s = new z.CanvasTexture(n);
  return ((s.anisotropy = 4), s);
}
var UL = (t, e, a, r) => {
  let o = new z.MeshStandardMaterial({
    map: VN(t, e, a),
    roughness: 0.6,
    emissive: "#ffffff",
    emissiveIntensity: 0.15,
    side: z.DoubleSide,
  });
  return ((o.emissiveMap = o.map), Mo.push(o), new z.Mesh(new z.PlaneGeometry(r, r / 4), o));
};
function $x(t = "#c0392b", e = "#222") {
  let a = new z.Group(),
    r = new z.MeshStandardMaterial({ color: t, metalness: 0.75, roughness: 0.28 }),
    o = new z.MeshStandardMaterial({ color: "#141a22", metalness: 0.9, roughness: 0.08 }),
    n = new z.Mesh(new z.BoxGeometry(2, 0.55, 4.2), r);
  ((n.position.y = 0.75), (n.castShadow = !0));
  let i = new z.Mesh(new z.BoxGeometry(1.9, 0.3, 1), r);
  (i.position.set(0, 0.62, 2.3), (i.rotation.x = 0.25));
  let s = new z.Mesh(new z.BoxGeometry(1.7, 0.55, 2), o);
  s.position.set(0, 1.28, -0.2);
  let l = new z.Mesh(new z.BoxGeometry(1.6, 0.06, 1.6), r);
  (l.position.set(0, 1.58, -0.3), a.add(n, i, s, l));
  for (let [d, h] of [
    [-1.05, 1.35],
    [1.05, 1.35],
    [-1.05, -1.35],
    [1.05, -1.35],
  ]) {
    let u = new z.Mesh(new z.CylinderGeometry(0.42, 0.46, 0.22, 20), br.dark);
    (u.position.set(d, 0.42, h), a.add(u));
    let p = new z.Mesh(
      new z.CircleGeometry(0.34, 20),
      new z.MeshBasicMaterial({ color: "#9fd6ff", side: z.DoubleSide }),
    );
    ((p.rotation.x = Math.PI / 2), p.position.set(d, 0.3, h), a.add(p));
  }
  let c = new z.Mesh(new z.BoxGeometry(1.7, 0.1, 0.06), new z.MeshBasicMaterial({ color: "#d0102a" }));
  (c.position.set(0, 0.85, -2.12), a.add(c));
  for (let d of [-0.65, 0.65]) {
    let h = new z.Mesh(new z.BoxGeometry(0.45, 0.1, 0.06), new z.MeshBasicMaterial({ color: "#fffbe8" }));
    (h.position.set(d, 0.72, 2.8), a.add(h));
  }
  return a;
}
function _x() {
  let t = new z.Group(),
    e = new z.MeshStandardMaterial({ color: "#eceff1", metalness: 0.4, roughness: 0.35 }),
    a = new z.Mesh(new z.CylinderGeometry(1.2, 1.3, 9, 32), e);
  ((a.position.y = 5.5), (a.castShadow = !0));
  let r = new z.Mesh(
    new z.ConeGeometry(1.2, 3, 32),
    new z.MeshStandardMaterial({ color: "#2b2e33", metalness: 0.5, roughness: 0.4 }),
  );
  r.position.y = 11.5;
  let o = new z.Mesh(
    new z.CylinderGeometry(1.26, 1.26, 0.5, 32),
    new z.MeshStandardMaterial({ color: "#ff8a2a", roughness: 0.5 }),
  );
  o.position.y = 8;
  let n = new z.Mesh(
    new z.CircleGeometry(0.45, 24),
    new z.MeshStandardMaterial({ color: "#1a2633", metalness: 0.9, roughness: 0.1 }),
  );
  (n.position.set(0, 8.9, 1.27), t.add(a, r, o, n));
  for (let s = 0; s < 4; s++) {
    let l = new z.Mesh(new z.BoxGeometry(0.12, 2.2, 1.6), br.dark),
      c = (s * Math.PI) / 2;
    (l.position.set(Math.sin(c) * 1.4, 1.6, Math.cos(c) * 1.4), (l.rotation.y = c), t.add(l));
  }
  let i = new z.Mesh(
    new z.ConeGeometry(0.9, 4, 20, 1, !0),
    new z.MeshBasicMaterial({
      color: "#ffb15e",
      transparent: !0,
      opacity: 0.85,
      blending: z.AdditiveBlending,
      depthWrite: !1,
    }),
  );
  return ((i.rotation.x = Math.PI), (i.position.y = -1), (i.name = "flame"), (i.visible = !1), t.add(i), t);
}
function Ni(t, e, a = 4.8) {
  let r = new z.Group();
  r.position.set(t, 0, e);
  let o = new z.Mesh(new z.CylinderGeometry(0.07, 0.11, a, 8), br.dark);
  ((o.position.y = a / 2), r.add(o));
  let n = new z.Mesh(new z.SphereGeometry(0.22, 12, 8), Xa);
  return ((n.position.y = a + 0.1), r.add(n), r);
}
function $L() {
  let t = new z.Group(),
    e = [];
  for (let a = 0; a < 12; a++) {
    let r = (a / 12) * Math.PI * 2 + 0.26,
      o = 24,
      n = new z.Mesh(new z.CylinderGeometry(1.2, 1.3, 0.6, 16), br.stone);
    (n.position.set(Math.cos(r) * o, 0.3, Math.sin(r) * o), t.add(n));
    let i = ya("#4f7f35", 1.1);
    (i.position.set(n.position.x, 0.5, n.position.z),
      t.add(i),
      e.push({ x: n.position.x, z: n.position.z, r: 1.4 }),
      a % 2 === 0 && t.add(Ni(Math.cos(r + 0.26) * 27, Math.sin(r + 0.26) * 27)));
  }
  return { group: t, colliders: e, interacts: [] };
}
function DL(t) {
  let e = document.createElement("canvas");
  e.width = e.height = 256;
  let a = e.getContext("2d");
  return (
    (a.fillStyle = "#3a3f45"),
    a.fillRect(0, 0, 256, 256),
    (a.strokeStyle = "#f1c40f"),
    (a.lineWidth = 10),
    a.beginPath(),
    a.arc(128, 128, 110, 0, Math.PI * 2),
    a.stroke(),
    (a.fillStyle = "#f5f5f5"),
    (a.font = "800 150px Sora, sans-serif"),
    (a.textAlign = "center"),
    a.fillText(t, 128, 182),
    new z.CanvasTexture(e)
  );
}
function _L(t, e) {
  let a = new z.Group();
  a.position.set(t, 0, e);
  let r = GN(t, e);
  a.rotation.y = r;
  let o = new z.Mesh(new z.CylinderGeometry(20, 20.6, 0.6, 64), br.concrete);
  ((o.position.y = 0.3), (o.receiveShadow = !0), a.add(o));
  let n = new z.Mesh(
    new z.CircleGeometry(4, 40),
    new z.MeshStandardMaterial({ map: DL("C"), roughness: 0.9 }),
  );
  ((n.rotation.x = -Math.PI / 2), n.position.set(-8, 0.62, 6), a.add(n));
  let i = new z.Mesh(
    new z.CircleGeometry(4.4, 40),
    new z.MeshStandardMaterial({ map: DL("R"), roughness: 0.9 }),
  );
  ((i.rotation.x = -Math.PI / 2), i.position.set(9, 0.62, 2), a.add(i));
  let s = $x("#c0392b");
  (s.position.set(-8, 0.65, 6), (s.rotation.y = 0.6), a.add(s));
  let l = $x("#e8e8e8");
  (l.position.set(-13, 0.65, -3), (l.rotation.y = -0.4), a.add(l));
  let c = _x();
  (c.position.set(9, 0.6, 2), a.add(c));
  let d = new z.Mesh(new z.BoxGeometry(1.2, 16, 1.2), br.steel);
  (d.position.set(12.5, 8, 2), a.add(d));
  for (let g = 0; g < 4; g++) {
    let m = new z.Mesh(new z.BoxGeometry(2.4, 0.2, 0.3), br.steel);
    (m.position.set(11.2, 3 + g * 3.5, 2), a.add(m));
  }
  let h = new z.Mesh(
    new z.CylinderGeometry(1.8, 2.4, 12, 8),
    Ea({ base: "#d9d6cf", tint: "#5b7a99", kind: 1, h: 12, seed: 0.5 }),
  );
  (h.position.set(0, 6, -14), a.add(h));
  let u = new z.Mesh(
    new z.CylinderGeometry(4, 3, 2.4, 8),
    Ea({ base: "#9fb4c7", tint: "#4b6a88", kind: 0, h: 15, seed: 0.6 }),
  );
  (u.position.set(0, 13.2, -14), a.add(u));
  let p = UL("SKYPORT", "Flying cars & rockets", "#f1c40f", 8);
  (p.position.set(0, 2.6, -11.5), a.add(p), a.add(Ni(-17, 8), Ni(17, 8), Ni(-17, -8), Ni(17, -8)));
  let v = (g) => FL(g, r).add(a.position);
  return {
    group: a,
    colliders: [
      { x: v(new z.Vector3(0, 0, -14)).x, z: v(new z.Vector3(0, 0, -14)).z, r: 4.5 },
      { x: v(new z.Vector3(12.5, 0, 2)).x, z: v(new z.Vector3(12.5, 0, 2)).z, r: 1.5 },
    ],
    interacts: [
      {
        pos: v(new z.Vector3(-8, 0, 6)),
        radius: 4.2,
        label: "Rent a flying car",
        action: "rent-car",
        obj: s,
      },
      {
        pos: v(new z.Vector3(9, 0, 2)),
        radius: 4.5,
        label: "Launch a rocket",
        action: "rent-rocket",
        obj: c,
      },
    ],
    tick: (g, m) => {
      ((s.position.y = 0.65 + Math.sin(m * 2) * 0.12), (l.position.y = 0.65 + Math.sin(m * 2 + 1) * 0.12));
    },
  };
}
function YL(t, e) {
  let a = new z.Group();
  a.position.set(t, 0, e);
  let r = [
      { x: 0, z: 0, h: 30 },
      { x: 12, z: 6, h: 22 },
      { x: -11, z: 8, h: 24 },
      { x: 6, z: -13, h: 20 },
      { x: -8, z: -12, h: 26 },
      { x: 19, z: -8, h: 18 },
      { x: -19, z: -4, h: 19 },
    ],
    o = [],
    n = new z.MeshStandardMaterial({ color: "#5b4f63", roughness: 0.8, metalness: 0.2 }),
    i = new z.MeshStandardMaterial({ color: "#4f7f35", roughness: 0.9, wireframe: !0 }),
    s = [];
  r.forEach((c, d) => {
    let h = new z.Mesh(new z.CylinderGeometry(0.9, 2.2, c.h, 12), n);
    (h.position.set(c.x, c.h / 2, c.z), (h.castShadow = !0), a.add(h));
    let u = new z.Mesh(new z.CylinderGeometry(1, 2.3, c.h * 0.9, 12, 10, !0), i);
    (u.position.set(c.x, c.h * 0.45, c.z), a.add(u));
    let p = new z.MeshStandardMaterial({
      color: "#4a3f52",
      roughness: 0.6,
      emissive: d % 2 ? "#c05cff" : "#ff6fa8",
      emissiveIntensity: 0,
    });
    s.push(p);
    let v = new z.Mesh(new z.CylinderGeometry(c.h * 0.32, 1.2, 4, 20, 2, !0), p);
    ((v.material.side = z.DoubleSide),
      v.position.set(c.x, c.h + 1.6, c.z),
      a.add(v),
      o.push({ x: t + c.x, z: e + c.z, r: 2.6 }));
  });
  let l = new z.Mesh(new z.TorusGeometry(14, 0.6, 8, 96), br.steel);
  ((l.rotation.x = Math.PI / 2), (l.position.y = 14), a.add(l));
  for (let c = 0; c < 18; c++) {
    let d = ya("#4f7f35" + c, 0.8 + (c % 4) * 0.15),
      h = (c / 18) * Math.PI * 2;
    (d.position.set(Math.cos(h) * 27, 0, Math.sin(h) * 27), a.add(d));
  }
  for (let c = 0; c < 8; c++) {
    let d = (c / 8) * Math.PI * 2;
    a.add(Ni(Math.cos(d) * 31, Math.sin(d) * 31));
  }
  return {
    group: a,
    colliders: o,
    interacts: [],
    tick: () => {
      let c = Xa.emissiveIntensity / 2.2;
      s.forEach((d) => (d.emissiveIntensity = c * 1.4));
    },
  };
}
