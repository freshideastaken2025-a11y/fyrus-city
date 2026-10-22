function ux({ p1: t, onEnd: e, online: a }) {
  let r = (0, x0.useRef)(null),
    [o, n] = (0, x0.useState)({ lap: 1, place: 1, speed: 0, time: 0, count: 3, msg: "" });
  return (
    (0, x0.useEffect)(() => {
      let i = r.current,
        s = i.clientWidth,
        l = Math.round(s * 0.56),
        c = new jt.WebGLRenderer({ antialias: !0 });
      (c.setPixelRatio(Math.min(devicePixelRatio, 1.5)),
        c.setSize(s, l),
        (c.outputEncoding = jt.sRGBEncoding),
        (c.toneMapping = jt.ACESFilmicToneMapping),
        (c.shadowMap.enabled = !0),
        i.appendChild(c.domElement));
      let d = new jt.Scene();
      ((d.background = new jt.Color("#9cc6ea")), (d.fog = new jt.Fog("#b9d6ef", 120, 420)));
      let h = new jt.PerspectiveCamera(62, s / l, 0.1, 1200);
      d.add(new jt.HemisphereLight("#dfefff", "#5b6b3a", 0.75));
      let u = new jt.DirectionalLight("#fff3dc", 1.6);
      (u.position.set(80, 140, 40), (u.castShadow = !0));
      let p = u.shadow.camera;
      ((p.left = p.bottom = -260),
        (p.right = p.top = 260),
        (p.far = 500),
        u.shadow.mapSize.set(2048, 2048),
        d.add(u));
      let v = new jt.Mesh(
        new jt.PlaneGeometry(1400, 1400),
        new jt.MeshStandardMaterial({ color: "#5b7f3a", roughness: 1 }),
      );
      ((v.rotation.x = -Math.PI / 2), (v.receiveShadow = !0), d.add(v));
      let g = new jt.CatmullRomCurve3(
          UH.map(([it, ft]) => new jt.Vector3(it, 0, ft)),
          !0,
          "centripetal",
        ),
        m = g.getSpacedPoints(pr);
      m.pop();
      let f = new jt.BufferGeometry(),
        y = [],
        x = [],
        k = [];
      for (let it = 0; it <= pr; it++) {
        let ft = m[it % pr],
          ke = m[(it + 1) % pr].clone().sub(ft).normalize(),
          na = new jt.Vector3(-ke.z, 0, ke.x),
          Wa = ft.clone().addScaledVector(na, rs / 2),
          ro = ft.clone().addScaledVector(na, -rs / 2);
        if ((y.push(Wa.x, 0.02, Wa.z, ro.x, 0.02, ro.z), x.push(0, it * 0.25, 1, it * 0.25), it < pr)) {
          let Pn = it * 2;
          k.push(Pn, Pn + 1, Pn + 2, Pn + 1, Pn + 3, Pn + 2);
        }
      }
      (f.setAttribute("position", new jt.Float32BufferAttribute(y, 3)),
        f.setAttribute("uv", new jt.Float32BufferAttribute(x, 2)),
        f.setIndex(k),
        f.computeVertexNormals());
      let b = document.createElement("canvas");
      ((b.width = 128), (b.height = 128));
      let w = b.getContext("2d");
      ((w.fillStyle = "#3a3c40"), w.fillRect(0, 0, 128, 128));
      for (let it = 0; it < 600; it++)
        ((w.fillStyle = `rgba(255,255,255,${Math.random() * 0.06})`),
          w.fillRect(Math.random() * 128, Math.random() * 128, 2, 2));
      ((w.fillStyle = "#c62828"),
        w.fillRect(0, 0, 6, 64),
        w.fillRect(122, 64, 6, 64),
        (w.fillStyle = "#f2f2f2"),
        w.fillRect(0, 64, 6, 64),
        w.fillRect(122, 0, 6, 64),
        (w.fillStyle = "#e8e8e8"),
        w.fillRect(62, 0, 4, 64));
      let L = new jt.CanvasTexture(b);
      ((L.wrapS = L.wrapT = jt.RepeatWrapping), (L.anisotropy = 8));
      let E = new jt.Mesh(f, new jt.MeshStandardMaterial({ map: L, roughness: 0.85 }));
      ((E.receiveShadow = !0), d.add(E));
      let T = m[0],
        S = m[1].clone().sub(T).normalize(),
        H = Math.atan2(S.x, S.z),
        N = document.createElement("canvas");
      ((N.width = 128), (N.height = 16));
      let B = N.getContext("2d");
      for (let it = 0; it < 16; it++)
        for (let ft = 0; ft < 2; ft++)
          ((B.fillStyle = (it + ft) % 2 ? "#111" : "#fff"), B.fillRect(it * 8, ft * 8, 8, 8));
      let X = new jt.Mesh(
        new jt.PlaneGeometry(rs, 1.6),
        new jt.MeshStandardMaterial({ map: new jt.CanvasTexture(N) }),
      );
      ((X.rotation.x = -Math.PI / 2), (X.rotation.z = -H), X.position.set(T.x, 0.03, T.z), d.add(X));
      let M = new jt.Group();
      (M.position.copy(T), (M.rotation.y = H), d.add(M));
      let _ = new jt.MeshStandardMaterial({ color: "#2b2e33", metalness: 0.6, roughness: 0.4 });
      for (let it of [-1, 1]) {
        let ft = new jt.Mesh(new jt.BoxGeometry(0.5, 7, 0.5), _);
        (ft.position.set(it * (rs / 2 + 1), 3.5, 0), M.add(ft));
      }
      let lt = document.createElement("canvas");
      ((lt.width = 512), (lt.height = 64));
      let vt = lt.getContext("2d");
      ((vt.fillStyle = "#12355e"),
        vt.fillRect(0, 0, 512, 64),
        (vt.fillStyle = "#fff"),
        (vt.font = "800 38px Sora, sans-serif"),
        (vt.textAlign = "center"),
        vt.fillText("FYRUS CITY GRAND PRIX", 256, 46));
      let zt = new jt.Mesh(new jt.BoxGeometry(rs + 3, 1.6, 0.3), [
        _,
        _,
        _,
        _,
        new jt.MeshStandardMaterial({ map: new jt.CanvasTexture(lt) }),
        new jt.MeshStandardMaterial({ map: new jt.CanvasTexture(lt) }),
      ]);
      ((zt.position.y = 7), M.add(zt));
      let Pe = new jt.MeshStandardMaterial({ color: "#1b1b1b", roughness: 0.9 }),
        Je = new jt.MeshStandardMaterial({ color: "#c62828" }),
        Ua = new jt.MeshStandardMaterial({ color: "#eeeeee" });
      for (let it = 0; it < pr; it += 6) {
        let ft = m[it],
          ke = m[(it + 1) % pr].clone().sub(ft).normalize(),
          na = new jt.Vector3(-ke.z, 0, ke.x);
        for (let Wa of [-1, 1]) {
          let ro = new jt.Mesh(new jt.BoxGeometry(0.5, 0.8, 4.4), (it / 6) % 2 ? Je : Ua);
          (ro.position.copy(ft).addScaledVector(na, Wa * (rs / 2 + 2.2)),
            (ro.position.y = 0.4),
            (ro.rotation.y = Math.atan2(ke.x, ke.z)),
            (ro.castShadow = !0),
            d.add(ro));
        }
        if (it % 30 === 0)
          for (let Wa of [-1, 1]) {
            let ro = ft.clone().addScaledVector(na, Wa * (rs / 2 + 14 + Math.random() * 30)),
              Pn = 10 + Math.random() * 40,
              us = new jt.Mesh(
                new jt.BoxGeometry(10 + Math.random() * 8, Pn, 10 + Math.random() * 8),
                new jt.MeshStandardMaterial({
                  color: ["#cfd6dc", "#d8d3c8", "#a9b8c6", "#e6e1d6"][Math.floor(Math.random() * 4)],
                  roughness: 0.8,
                }),
              );
            (us.position.set(ro.x, Pn / 2, ro.z), (us.castShadow = !0), d.add(us));
          }
      }
      let Ja = Xr.find((it) => it.id === ot().dream.car) || Xr[0],
        je = Rr(Ja.body === "hatch" ? "sports" : Ja.body, Ja.color === "#e8e8e8" ? "#c0392b" : Ja.color);
      d.add(je);
      let ye = new v0(Math.max(Ja.top, 42), Math.max(Ja.accel, 15));
      ye.heading = H;
      let cn = (it, ft) =>
          T.clone()
            .addScaledVector(new jt.Vector3(-S.z, 0, S.x), it * 3.4)
            .addScaledVector(S, -6 - ft * 7),
        Uo = cn(-1, 0);
      (je.position.copy(Uo), (je.rotation.y = H));
      let Gn = [
          ["#1f4e79", 0.93, 1, 0],
          ["#f1c40f", 0.97, -1, 1],
          ["#2e5e3e", 0.9, 1, 1],
        ].map(([it, ft, Re, ke]) => {
          let na = Rr("sports", it);
          d.add(na);
          let Wa = cn(Re, ke);
          return (
            na.position.copy(Wa),
            (na.rotation.y = H),
            {
              o: na,
              skill: ft,
              d: -(6 + ke * 7) / (g.getLength() / pr),
              lap: 0,
              speed: 0,
              offset: Re * 2.5,
              done: !1,
            }
          );
        }),
        We = a ? Rr("sports", "#7a4a8a") : null;
      We && (d.add(We), We.position.copy(cn(1, 0)), (We.rotation.y = H));
      let zr = null,
        wr = null;
      if (a) {
        let it = ot().users.find((ft) => ft.id === ot().session?.userId)?.name || t;
        ((zr = new tc(a.room, it)),
          (zr.onState = (ft) => {
            ft.car && (wr = ft.car);
          }),
          zr.join().catch(() => {}));
      }
      let fr = new Set(),
        So = (it) => {
          (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(it.key) && it.preventDefault(),
            fr.add(it.key.toLowerCase()));
        },
        Lt = (it) => fr.delete(it.key.toLowerCase());
      (window.addEventListener("keydown", So), window.addEventListener("keyup", Lt));
      let ae = (it, ft) => {
          let Re = ft,
            ke = 1e9;
          for (let na = -40; na <= 40; na++) {
            let Wa = (ft + na + pr) % pr,
              ro = m[Wa].distanceToSquared(it);
            ro < ke && ((ke = ro), (Re = Wa));
          }
          return { i: Re, d: Math.sqrt(ke) };
        },
        ka = 0,
        ja = 0,
        mr = 0,
        fo = 0,
        ie = 3.5,
        jr = !1,
        dn = 0,
        Vn = performance.now(),
        hn = 0,
        Ht = () => {
          let it = performance.now(),
            ft = Math.min(0.05, (it - Vn) / 1e3);
          ((Vn = it), ie > 0 ? (ie -= ft) : jr || (fo += ft));
          let ke =
              ie <= 0 && !jr
                ? (fr.has("w") || fr.has("arrowup") ? 1 : 0) - (fr.has("s") || fr.has("arrowdown") ? 1 : 0)
                : 0,
            na = (fr.has("a") || fr.has("arrowleft") ? 1 : 0) - (fr.has("d") || fr.has("arrowright") ? 1 : 0),
            Wa = ae(je.position, ka),
            ro = Wa.d > rs / 2 + 0.8;
          ro ? (ye.top = 14) : (ye.top = Math.max(Ja.top, 42));
          let Pn = ye.step(ft, { up: ke, turn: na, brake: fr.has(" ") });
          if (
            ((je.position.x += Pn.dx),
            (je.position.z += Pn.dz),
            (je.rotation.y = ye.heading),
            Wa.d > rs / 2 + 2.6)
          ) {
            let Ue = m[Wa.i].clone().sub(je.position).setY(0).normalize();
            (je.position.addScaledVector(Ue, Wa.d - (rs / 2 + 2.6)), (ye.speed *= 0.6));
          }
          $s(je, ye.speed, ft, ye.steer * 0.6);
          let us = (Wa.i - ka + pr) % pr;
          (us > 0 && us < pr / 2 ? (mr += us) : us >= pr / 2 && (mr -= pr - us), (ka = Wa.i));
          let gf = Math.floor(mr / pr);
          (gf > ja && gf > 0 && (ja = gf),
            ja >= Hg && !jr && (jr = !0),
            Gn.forEach((Ue) => {
              if (ie <= 0 && !Ue.done) {
                let ff = 34 * Ue.skill * (0.95 + 0.05 * Math.sin(fo * 0.7 + Ue.offset));
                ((Ue.speed += (ff - Ue.speed) * ft * 0.6), (Ue.d += (Ue.speed * ft) / (g.getLength() / pr)));
              }
              let v5 = ((Math.floor(Ue.d) % pr) + pr) % pr,
                _9 = Ue.d - Math.floor(Ue.d),
                x5 = m[v5],
                y5 = m[(v5 + 1) % pr],
                Y9 = x5.clone().lerp(y5, _9),
                Ru = y5.clone().sub(x5).normalize(),
                q9 = new jt.Vector3(-Ru.z, 0, Ru.x);
              (Ue.o.position.copy(Y9.addScaledVector(q9, Ue.offset * Math.cos(Ue.d * 0.02))),
                (Ue.o.rotation.y = Math.atan2(Ru.x, Ru.z)),
                $s(Ue.o, Ue.speed, ft),
                (Ue.lap = Math.floor(Ue.d / pr)),
                Ue.lap >= Hg && (Ue.done = !0));
              let k5 = Ue.o.position.distanceTo(je.position);
              if (k5 < 2.6) {
                let ff = je.position.clone().sub(Ue.o.position).setY(0).normalize();
                (je.position.addScaledVector(ff, 2.6 - k5), (ye.speed *= 0.9));
              }
            }),
            We &&
              wr &&
              (We.position.lerp(new jt.Vector3(wr.x, 0, wr.z), Math.min(1, ft * 8)), (We.rotation.y = wr.h)),
            zr &&
              it - hn > 150 &&
              ((hn = it),
              zr.setState({
                car: {
                  x: Math.round(je.position.x * 10) / 10,
                  z: Math.round(je.position.z * 10) / 10,
                  h: Math.round(ye.heading * 100) / 100,
                  p: mr,
                  done: jr ? fo : 0,
                },
              })));
          let f5 = new jt.Vector3(-Math.sin(ye.heading), 0, -Math.cos(ye.heading));
          (h.position.lerp(
            je.position
              .clone()
              .addScaledVector(f5, 8.5)
              .add(new jt.Vector3(0, 3.4, 0)),
            Math.min(1, ft * 6),
          ),
            h.lookAt(
              je.position
                .clone()
                .add(new jt.Vector3(0, 1.2, 0))
                .addScaledVector(f5, -6),
            ),
            u.position.set(je.position.x + 80, 140, je.position.z + 40),
            u.target.position.copy(je.position),
            u.target.updateMatrixWorld(),
            c.render(d, h));
          let m5 = jr
            ? Gn.filter((Ue) => Ue.done).length + (wr && wr.done ? 1 : 0)
            : Gn.filter((Ue) => Ue.d > mr).length + (wr && wr.p > mr ? 1 : 0);
          if (
            (n({
              lap: Math.min(Hg, ja + 1),
              place: m5 + 1,
              speed: Math.round(Math.abs(ye.speed) * 3.6),
              time: fo,
              count: Math.ceil(ie),
              msg: ro ? "Off track!" : "",
            }),
            jr)
          ) {
            let Ue = m5 + 1;
            setTimeout(
              () =>
                e(
                  Math.max(10, Math.round(1e3 - fo * 4)) * (Ue === 1 ? 2 : 1),
                  Ue === 1,
                  `Finished P${Ue} in ${fo.toFixed(1)}s`,
                ),
              600,
            );
            return;
          }
          dn = requestAnimationFrame(Ht);
        };
      return (
        (dn = requestAnimationFrame(Ht)),
        () => {
          (cancelAnimationFrame(dn),
            window.removeEventListener("keydown", So),
            window.removeEventListener("keyup", Lt),
            zr?.leave(),
            c.dispose(),
            c.forceContextLoss?.(),
            c.domElement.remove(),
            d.traverse((it) => {
              it.geometry?.dispose?.();
            }));
        }
      );
    }, []),
    (0, Si.jsxs)("div", {
      className: "relative w-full rounded-lg overflow-hidden",
      ref: r,
      style: { background: "#000" },
      children: [
        (0, Si.jsxs)("div", {
          className:
            "absolute left-3 top-3 hud-box px-3 py-2 text-white text-sm font-bold tabular pointer-events-none",
          children: ["LAP ", o.lap, "/", Hg, " \xB7 P", o.place, "/", a ? 2 : 4],
        }),
        (0, Si.jsxs)("div", {
          className:
            "absolute right-3 top-3 hud-box px-3 py-2 text-white text-sm font-mono tabular pointer-events-none",
          children: [o.time.toFixed(1), "s"],
        }),
        (0, Si.jsxs)("div", {
          className: "absolute right-3 bottom-3 hud-box px-4 py-2 text-white pointer-events-none",
          children: [
            (0, Si.jsx)("span", { className: "hud-font text-4xl tabular", children: o.speed }),
            " ",
            (0, Si.jsx)("span", { className: "text-xs", children: "km/h" }),
          ],
        }),
        o.count > 0 &&
          (0, Si.jsx)("div", {
            className: "absolute inset-0 grid place-items-center pointer-events-none",
            children: (0, Si.jsx)("div", {
              className: "hud-font text-white hud-text-shadow",
              style: { fontSize: 120 },
              children: o.count,
            }),
          }),
        o.msg &&
          (0, Si.jsx)("div", {
            className: "absolute left-1/2 -translate-x-1/2 top-12 text-sm font-bold hud-text-shadow",
            style: { color: "#ffb74d" },
            children: o.msg,
          }),
      ],
    })
  );
}
var uo = P(Zt(), 1);
var PE = {
    b: "rnbqkbnrpppppppp".split("").concat(Array(32).fill(""), "PPPPPPPPRNBQKBNR".split("")),
    turn: "w",
    castle: "KQkq",
    ep: -1,
  },
  px = (t) => t !== "" && t === t.toUpperCase(),
  cu = (t) => (t ? (px(t) ? "w" : "b") : null),
  vx = (t) => [Math.floor(t / 8), t % 8],
  ec = (t, e) => t >= 0 && t < 8 && e >= 0 && e < 8,
  OE = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ],
  DE = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ],
  gx = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ],
  fx = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
function ud(t, e, a) {
  let [r, o] = vx(e),
    n = a === "w" ? r + 1 : r - 1;
  for (let s of [-1, 1]) if (ec(n, o + s) && t[n * 8 + o + s] === (a === "w" ? "P" : "p")) return !0;
  for (let [s, l] of OE)
    if (ec(r + s, o + l) && t[(r + s) * 8 + o + l] === (a === "w" ? "N" : "n")) return !0;
  for (let [s, l] of DE)
    if (ec(r + s, o + l) && t[(r + s) * 8 + o + l] === (a === "w" ? "K" : "k")) return !0;
  let i = (s, l) => {
    for (let [c, d] of s) {
      let h = r + c,
        u = o + d;
      for (; ec(h, u); ) {
        let p = t[h * 8 + u];
        if (p) {
          if (cu(p) === a && l.includes(p.toLowerCase())) return !0;
          break;
        }
        ((h += c), (u += d));
      }
    }
    return !1;
  };
  return i(gx, "bq") || i(fx, "rq");
}
var FE = (t, e) => t.indexOf(e === "w" ? "K" : "k"),
  du = (t) => ud(t.b, FE(t.b, t.turn), t.turn === "w" ? "b" : "w");
function $H(t) {
  let e = [],
    a = t.turn,
    r = t.b;
  for (let o = 0; o < 64; o++) {
    let n = r[o];
    if (!n || cu(n) !== a) continue;
    let [i, s] = vx(o),
      l = n.toLowerCase();
    if (l === "p") {
      let c = a === "w" ? -1 : 1,
        d = a === "w" ? 6 : 1,
        h = a === "w" ? 0 : 7,
        u = (p, v = {}) => {
          Math.floor(p / 8) === h
            ? e.push({ f: o, t: p, promo: a === "w" ? "Q" : "q", ...v })
            : e.push({ f: o, t: p, ...v });
        };
      ec(i + c, s) &&
        !r[(i + c) * 8 + s] &&
        (u((i + c) * 8 + s), i === d && !r[(i + 2 * c) * 8 + s] && e.push({ f: o, t: (i + 2 * c) * 8 + s }));
      for (let p of [-1, 1])
        if (ec(i + c, s + p)) {
          let v = (i + c) * 8 + s + p;
          r[v] && cu(r[v]) !== a ? u(v) : v === t.ep && e.push({ f: o, t: v, ep: !0 });
        }
    } else if (l === "n" || l === "k") {
      for (let [c, d] of l === "n" ? OE : DE)
        if (ec(i + c, s + d)) {
          let h = (i + c) * 8 + s + d;
          (!r[h] || cu(r[h]) !== a) && e.push({ f: o, t: h });
        }
      if (l === "k") {
        let c = a === "w" ? "b" : "w",
          d = a === "w" ? 7 : 0;
        o === d * 8 + 4 &&
          !ud(r, o, c) &&
          (t.castle.includes(a === "w" ? "K" : "k") &&
            !r[d * 8 + 5] &&
            !r[d * 8 + 6] &&
            !ud(r, d * 8 + 5, c) &&
            !ud(r, d * 8 + 6, c) &&
            e.push({ f: o, t: d * 8 + 6, castle: "K" }),
          t.castle.includes(a === "w" ? "Q" : "q") &&
            !r[d * 8 + 3] &&
            !r[d * 8 + 2] &&
            !r[d * 8 + 1] &&
            !ud(r, d * 8 + 3, c) &&
            !ud(r, d * 8 + 2, c) &&
            e.push({ f: o, t: d * 8 + 2, castle: "Q" }));
      }
    } else {
      let c = l === "b" ? gx : l === "r" ? fx : [...gx, ...fx];
      for (let [d, h] of c) {
        let u = i + d,
          p = s + h;
        for (; ec(u, p); ) {
          let v = u * 8 + p;
          if (!r[v]) e.push({ f: o, t: v });
          else {
            cu(r[v]) !== a && e.push({ f: o, t: v });
            break;
          }
          ((u += d), (p += h));
        }
      }
    }
  }
  return e;
}
function hu(t, e) {
  let a = t.b.slice(),
    r = a[e.f];
  if (((a[e.t] = e.promo || r), (a[e.f] = ""), e.ep && (a[e.t + (t.turn === "w" ? 8 : -8)] = ""), e.castle)) {
    let s = t.turn === "w" ? 7 : 0;
    e.castle === "K"
      ? ((a[s * 8 + 5] = a[s * 8 + 7]), (a[s * 8 + 7] = ""))
      : ((a[s * 8 + 3] = a[s * 8]), (a[s * 8] = ""));
  }
  let o = t.castle;
  (r === "K" && (o = o.replace(/[KQ]/g, "")), r === "k" && (o = o.replace(/[kq]/g, "")));
  let n = (s, l) => {
    (e.f === s || e.t === s) && (o = o.replace(l, ""));
  };
  (n(63, "K"), n(56, "Q"), n(7, "k"), n(0, "q"));
  let i = r.toLowerCase() === "p" && Math.abs(e.t - e.f) === 16 ? (e.f + e.t) / 2 : -1;
  return { b: a, turn: t.turn === "w" ? "b" : "w", castle: o, ep: i };
}
function uu(t) {
  return $H(t).filter((e) => {
    let a = hu(t, e);
    return !ud(a.b, FE(a.b, t.turn), a.turn);
  });
}
function UE(t) {
  return uu(t).length ? "play" : du(t) ? "mate" : "stalemate";
}
var mx = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
function _H(t) {
  let e = 0;
  for (let a = 0; a < 64; a++) {
    let r = t.b[a];
    if (!r) continue;
    let [o, n] = vx(a),
      i = r.toLowerCase(),
      s = mx[i],
      l = 3.5 - Math.max(Math.abs(3.5 - o), Math.abs(3.5 - n));
    ((i === "n" || i === "b") && (s += l * 8),
      i === "p" && (s += (px(r) ? 6 - o : o - 1) * 6 + l * 3),
      i === "q" && (s += l * 2),
      (e += px(r) ? s : -s));
  }
  return e;
}
function $E(t, e, a, r) {
  let o = uu(t);
  if (!o.length) return du(t) ? -1e5 - e : 0;
  if (e === 0) return (t.turn === "w" ? 1 : -1) * _H(t);
  o.sort((n, i) => (t.b[i.t] ? mx[t.b[i.t].toLowerCase()] : 0) - (t.b[n.t] ? mx[t.b[n.t].toLowerCase()] : 0));
  for (let n of o) {
    let i = -$E(hu(t, n), e - 1, -r, -a);
    if (i >= r) return r;
    i > a && (a = i);
  }
  return a;
}
function _E(t, e = 3) {
  let a = uu(t);
  if (!a.length) return null;
  let r = a[0],
    o = -1 / 0;
  for (let n of a.sort(() => Math.random() - 0.5)) {
    let i = -$E(hu(t, n), e - 1, -1 / 0, 1 / 0);
    i > o && ((o = i), (r = n));
  }
  return r;
}
var xx = {
    K: "\u2654",
    Q: "\u2655",
    R: "\u2656",
    B: "\u2657",
    N: "\u2658",
    P: "\u2659",
    k: "\u265A",
    q: "\u265B",
    r: "\u265C",
    b: "\u265D",
    n: "\u265E",
    p: "\u265F",
  },
  Ng = (t) => "abcdefgh"[t % 8] + (8 - Math.floor(t / 8));
var tr = P(ct(), 1);
function YE(t, e, a) {
  let r = (0, uo.useRef)(null),
    [o, n] = (0, uo.useState)("");
  return (
    (0, uo.useEffect)(() => {
      if (!t) return;
      let i = ot().users.find((l) => l.id === ot().session?.userId)?.name || "Player",
        s = new tc(t.room, i);
      return (
        (r.current = s),
        (s.onPeers = (l) => n(l.join(", "))),
        (s.onState = (l) => {
          Array.isArray(l.mv) && a(l.mv);
        }),
        s.join().catch(() => n("offline")),
        () => s.leave()
      );
    }, [t?.room]),
    (0, uo.useEffect)(() => {
      r.current?.setState({ mv: e });
    }, [e.length]),
    o
  );
}
function qE({ mode: t, p1: e, p2: a, onEnd: r, online: o }) {
  let n = o ? "online" : t,
    [i, s] = (0, uo.useState)([]),
    [l, c] = (0, uo.useState)(null),
    [d, h] = (0, uo.useState)(!1),
    u = i.reduce((L, E) => hu(L, E), PE),
    p = UE(u),
    v = n === "online" ? (o.host ? "w" : "b") : "w",
    g = n === "online" && !o.host,
    m = YE(n === "online" ? o : null, i, (L) => s((E) => (L.length > E.length ? L : E))),
    f = (0, uo.useRef)(!1);
  ((0, uo.useEffect)(() => {
    if (p === "play" || f.current) return;
    f.current = !0;
    let L = p === "mate" ? (u.turn === "w" ? "b" : "w") : null,
      E = L === v;
    setTimeout(
      () =>
        r(
          E ? 100 : p === "stalemate" ? 50 : 10,
          E,
          p === "mate"
            ? `Checkmate \u2014 ${L === "w" ? "White" : "Black"} wins in ${Math.ceil(i.length / 2)} moves`
            : "Stalemate \u2014 a draw",
        ),
      900,
    );
  }, [p]),
    (0, uo.useEffect)(() => {
      if (n !== "ai" || u.turn !== "b" || p !== "play") return;
      h(!0);
      let L = setTimeout(() => {
        let E = _E(u, 3);
        (E && s((T) => [...T, E]), h(!1));
      }, 250);
      return () => clearTimeout(L);
    }, [i.length]));
  let y = p === "play" && (n === "2p" || u.turn === v),
    x = l !== null ? uu(u).filter((L) => L.f === l) : [],
    k = (L) => {
      if (!y) return;
      let E = x.find((S) => S.t === L);
      if (E) {
        (s((S) => [...S, E]), c(null));
        return;
      }
      let T = u.b[L];
      T && (T === T.toUpperCase() ? "w" : "b") === u.turn ? c(L) : c(null);
    },
    b = i[i.length - 1],
    w = Array.from({ length: 64 }, (L, E) => (g ? 63 - E : E));
  return (0, tr.jsxs)("div", {
    className: "grid md:grid-cols-[minmax(0,520px)_1fr] gap-4 items-start",
    children: [
      (0, tr.jsx)("div", {
        className:
          "aspect-square w-full max-w-[520px] grid grid-cols-8 rounded-md overflow-hidden select-none",
        style: { boxShadow: "0 10px 30px rgba(0,0,0,.4)", border: "8px solid #5b3a22" },
        role: "grid",
        "aria-label": "Chess board",
        children: w.map((L) => {
          let E = Math.floor(L / 8),
            T = L % 8,
            S = (E + T) % 2 === 0,
            H = u.b[L],
            N = x.some((M) => M.t === L),
            B = b && (b.f === L || b.t === L),
            X = H && H.toLowerCase() === "k" && (H === "K" ? "w" : "b") === u.turn && du(u);
          return (0, tr.jsxs)(
            "button",
            {
              onClick: () => k(L),
              "aria-label": `${Ng(L)} ${H ? xx[H] : "empty"}`,
              className: "relative grid place-items-center",
              style: {
                background: X
                  ? "#e57373"
                  : l === L
                    ? "#f6e27a"
                    : B
                      ? S
                        ? "#e9dc8e"
                        : "#c4b45a"
                      : S
                        ? "#eeddb8"
                        : "#a8794f",
                fontSize: "clamp(22px, 5.4vw, 46px)",
                lineHeight: 1,
                color: H && H === H.toUpperCase() ? "#fff" : "#1a1a1a",
                textShadow: H && H === H.toUpperCase() ? "0 0 2px #000, 0 1px 2px #000" : "none",
              },
              children: [
                H ? xx[H.toLowerCase() === H ? H : H.toLowerCase()] : "",
                N &&
                  (0, tr.jsx)("span", {
                    className: "absolute w-1/3 h-1/3 rounded-full",
                    style: {
                      background: H ? "transparent" : "rgba(0,0,0,.25)",
                      boxShadow: H ? "inset 0 0 0 4px rgba(0,0,0,.35)" : "none",
                      width: H ? "90%" : "30%",
                      height: H ? "90%" : "30%",
                    },
                  }),
              ],
            },
            L,
          );
        }),
      }),
      (0, tr.jsxs)("div", {
        className: "space-y-3",
        children: [
          (0, tr.jsxs)("div", {
            className: "card p-3 text-sm",
            children: [
              (0, tr.jsx)("div", {
                className: "font-bold",
                children:
                  p === "play"
                    ? `${u.turn === "w" ? "White" : "Black"} to move${du(u) ? " \u2014 check!" : ""}`
                    : p === "mate"
                      ? "Checkmate"
                      : "Stalemate",
              }),
              (0, tr.jsx)("div", {
                className: "text-xs mt-1",
                style: { color: "var(--ink-dim)" },
                children:
                  n === "ai"
                    ? `You are White vs ${a}${d ? " \xB7 thinking\u2026" : ""}`
                    : n === "2p"
                      ? "Two players on this screen"
                      : `Online vs ${o.friend} \xB7 you are ${v === "w" ? "White" : "Black"}${m ? "" : " \xB7 waiting for them to join\u2026"}`,
              }),
            ],
          }),
          (0, tr.jsx)("div", {
            className: "card p-3 text-xs font-mono max-h-48 scroll-y",
            style: { color: "var(--ink-dim)" },
            children: i.length
              ? i.map((L, E) =>
                  (0, tr.jsxs)(
                    "span",
                    {
                      children: [
                        E % 2 === 0 ? `${E / 2 + 1}. ` : "",
                        Ng(L.f),
                        "-",
                        Ng(L.t),
                        L.promo ? "=Q" : "",
                        " ",
                      ],
                    },
                    E,
                  ),
                )
              : "Tap a piece, then a square. All rules: castling, en passant, promotion.",
          }),
          (0, tr.jsx)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => r(5, !1, "You resigned"),
            children: "Resign",
          }),
          (0, tr.jsxs)("div", {
            className: "text-[11px]",
            style: { color: "var(--ink-dim)" },
            children: [e, " vs ", n === "online" ? o.friend : a],
          }),
        ],
      }),
    ],
  });
}
var nn = 7,
  ac = 6,
  Rg = (t, e, a) => {
    for (let r = ac - 1; r >= 0; r--)
      if (!t[r * nn + e]) {
        let o = t.slice();
        return ((o[r * nn + e] = a), o);
      }
    return null;
  };
function ZE(t) {
  let e = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let a = 0; a < ac; a++)
    for (let r = 0; r < nn; r++) {
      let o = t[a * nn + r];
      if (o)
        for (let [n, i] of e) {
          let s = 1;
          for (
            ;
            s < 4 &&
            a + n * s >= 0 &&
            a + n * s < ac &&
            r + i * s >= 0 &&
            r + i * s < nn &&
            t[(a + n * s) * nn + r + i * s] === o;
          )
            s++;
          if (s === 4) return o;
        }
    }
  return t.every(Boolean) ? 3 : 0;
}
function YH(t, e) {
  let a = 0;
  for (let o = 0; o < ac; o++) t[o * nn + 3] === e && (a += 3);
  let r = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ];
  for (let o = 0; o < ac; o++)
    for (let n = 0; n < nn; n++)
      for (let [i, s] of r) {
        let l = 0,
          c = 0,
          d = !0;
        for (let h = 0; h < 4; h++) {
          let u = o + i * h,
            p = n + s * h;
          if (u < 0 || u >= ac || p < 0 || p >= nn) {
            d = !1;
            break;
          }
          let v = t[u * nn + p];
          v === e ? l++ : v && c++;
        }
        d &&
          (l && !c && (a += l === 3 ? 12 : l === 2 ? 3 : 0),
          c && !l && (a -= c === 3 ? 14 : c === 2 ? 3 : 0));
      }
  return a;
}
function KE(t, e, a, r, o, n) {
  let i = ZE(t);
  if (i === r) return 1e4 + e;
  if (i && i !== 3) return -1e4 - e;
  if (i === 3 || e === 0) return YH(t, r);
  let s = a === r ? -1 / 0 : 1 / 0;
  for (let l of [3, 2, 4, 1, 5, 0, 6]) {
    let c = Rg(t, l, a);
    if (!c) continue;
    let d = KE(c, e - 1, 3 - a, r, o, n);
    if (
      (a === r ? ((s = Math.max(s, d)), (o = Math.max(o, d))) : ((s = Math.min(s, d)), (n = Math.min(n, d))),
      o >= n)
    )
      break;
  }
  return s;
}
function XE({ mode: t, p1: e, p2: a, onEnd: r, online: o }) {
  let n = o ? "online" : t,
    [i, s] = (0, uo.useState)([]),
    l = i.reduce((g, m, f) => Rg(g, m, (f % 2) + 1) || g, Array(nn * ac).fill(0)),
    c = (i.length % 2) + 1,
    d = ZE(l),
    h = n === "online" ? (o.host ? 1 : 2) : 1,
    u = YE(n === "online" ? o : null, i, (g) => s((m) => (g.length > m.length ? g : m))),
    p = (0, uo.useRef)(!1);
  ((0, uo.useEffect)(() => {
    if (!d || p.current) return;
    p.current = !0;
    let g = d === h;
    setTimeout(
      () =>
        r(
          g ? 100 : d === 3 ? 40 : 10,
          g,
          d === 3 ? "Board full \u2014 a draw" : `${d === 1 ? "Red" : "Yellow"} connects four!`,
        ),
      900,
    );
  }, [d]),
    (0, uo.useEffect)(() => {
      if (n !== "ai" || c !== 2 || d) return;
      let g = setTimeout(() => {
        let m = 3,
          f = -1 / 0;
        for (let y of [3, 2, 4, 1, 5, 0, 6]) {
          let x = Rg(l, y, 2);
          if (!x) continue;
          let k = KE(x, 5, 1, 2, -1 / 0, 1 / 0);
          k > f && ((f = k), (m = y));
        }
        s((y) => [...y, m]);
      }, 350);
      return () => clearTimeout(g);
    }, [i.length]));
  let v = !d && (n === "2p" || c === h);
  return (0, tr.jsxs)("div", {
    className: "grid md:grid-cols-[minmax(0,520px)_1fr] gap-4 items-start",
    children: [
      (0, tr.jsx)("div", {
        className: "w-full max-w-[520px] rounded-xl p-3 grid gap-2 select-none",
        style: { background: "#1f4fbf", gridTemplateColumns: `repeat(${nn}, 1fr)` },
        role: "grid",
        "aria-label": "Four in a row board",
        children: Array.from({ length: nn * ac }, (g, m) => {
          let f = l[m],
            y = m % nn;
          return (0, tr.jsx)(
            "button",
            {
              disabled: !v || !!l[y],
              onClick: () => v && Rg(l, y, c) && s((x) => [...x, y]),
              "aria-label": `Column ${y + 1}`,
              className: "aspect-square rounded-full",
              style: {
                background: f === 1 ? "#e53935" : f === 2 ? "#f1c40f" : "#0e1c44",
                boxShadow: "inset 0 4px 8px rgba(0,0,0,.45)",
              },
            },
            m,
          );
        }),
      }),
      (0, tr.jsxs)("div", {
        className: "space-y-3",
        children: [
          (0, tr.jsxs)("div", {
            className: "card p-3 text-sm",
            children: [
              (0, tr.jsx)("div", {
                className: "font-bold",
                children: d
                  ? d === 3
                    ? "Draw"
                    : `${d === 1 ? "Red" : "Yellow"} wins`
                  : `${c === 1 ? "Red" : "Yellow"} to play`,
              }),
              (0, tr.jsx)("div", {
                className: "text-xs mt-1",
                style: { color: "var(--ink-dim)" },
                children:
                  n === "ai"
                    ? `You are Red vs ${a}`
                    : n === "2p"
                      ? "Two players on this screen"
                      : `Online vs ${o.friend} \xB7 you are ${h === 1 ? "Red" : "Yellow"}${u ? "" : " \xB7 waiting for them\u2026"}`,
              }),
            ],
          }),
          (0, tr.jsx)("div", {
            className: "text-xs",
            style: { color: "var(--ink-dim)" },
            children:
              "Tap any hole in a column to drop a disc. Get four in a line: across, down or diagonal.",
          }),
          (0, tr.jsxs)("div", {
            className: "text-[11px]",
            style: { color: "var(--ink-dim)" },
            children: [e, " vs ", n === "online" ? o.friend : a],
          }),
        ],
      }),
    ],
  });
}
var Ut = P(ct(), 1),
  y0 = {
    hockey: {
      ai: "Mouse or WASD moves your blue paddle.",
      p2: "Player 1: WASD (blue) \xB7 Player 2: arrow keys (orange).",
    },
    race: {
      ai: "W / \u2191 accelerate \xB7 A D steer \xB7 S brake/reverse \xB7 Space handbrake. Stay on the road!",
      p2: "",
    },
    chess: {
      ai: "Tap a piece, then tap where to move.",
      p2: "Take turns on this screen: White, then Black.",
    },
    connect4: { ai: "Tap a column to drop your disc.", p2: "Take turns on this screen: Red, then Yellow." },
    catcher: { ai: "Mouse or A / D (arrows) to move. Catch blue and gold orbs, dodge red spikes.", p2: "" },
    trivia: { ai: "Click an answer. Faster correct answers score more.", p2: "" },
  },
  JE = ["Nova", "Kai", "Zara", "Leo", "Mia", "Theo"];
function yx() {
  let t = Y(),
    e = t.activeGame,
    a = tn.find((k) => k.id === e),
    r = be(t.session?.userId),
    [o, n] = (0, rc.useState)("ai"),
    [i, s] = (0, rc.useState)("lobby"),
    [l, c] = (0, rc.useState)(null),
    [d, h] = (0, rc.useState)(0),
    [u] = (0, rc.useState)(() => JE[Math.floor(Math.random() * JE.length)]),
    p = e === "hockey" || e === "chess" || e === "connect4",
    v = t.online && t.online.game === e ? t.online : null,
    g = r?.name.split(" ")[0] || "You",
    m = v ? v.friend : o === "2p" ? "Player 2" : u,
    f = () => C({ activeGame: null, online: null });
  (0, rc.useEffect)(() => {
    let k = (b) => {
      b.key === "Escape" && f();
    };
    return (window.addEventListener("keydown", k), () => window.removeEventListener("keydown", k));
  }, []);
  let x = {
    mode: o,
    p1: g,
    p2: m,
    onEnd: (k, b, w) => {
      (c({ score: k, won: b, summary: w }), s("end"), l8(e, k, b));
    },
    online: v,
  };
  return (0, Ut.jsx)("div", {
    className: "fixed inset-0 z-[80] grid place-items-center p-3",
    style: { background: "rgba(2,6,20,.86)" },
    children: (0, Ut.jsxs)("div", {
      className:
        "glass-strong rounded-3xl w-full max-w-[960px] max-h-[96vh] overflow-y-auto p-4 md:p-5 pop-in",
      children: [
        (0, Ut.jsxs)("div", {
          className: "flex items-center gap-3 mb-3",
          children: [
            (0, Ut.jsx)("div", {
              className: "w-10 h-10 rounded-xl grid place-items-center font-display font-bold",
              style: { background: a.color, color: "#06122e" },
              children: "\u25B6",
            }),
            (0, Ut.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, Ut.jsx)("div", { className: "font-display text-xl font-bold", children: a.name }),
                (0, Ut.jsxs)("div", {
                  className: "text-xs",
                  style: { color: "var(--ink-dim)" },
                  children: [a.tag, " \xB7 Fyrus Arcade"],
                }),
              ],
            }),
            (0, Ut.jsxs)("div", {
              className: "hidden sm:flex items-center gap-2 text-sm",
              children: [
                (0, Ut.jsx)(Dr, { user: r, size: 30 }),
                (0, Ut.jsx)("b", { children: g }),
                (0, Ut.jsx)("span", { style: { color: "var(--ink-dim)" }, children: "vs" }),
                (0, Ut.jsx)("b", { style: { color: "var(--ember)" }, children: i === "lobby" && !p ? u : m }),
                (0, Ut.jsx)("span", {
                  className:
                    "w-[30px] h-[30px] rounded-full grid place-items-center font-display text-xs font-bold",
                  style: { background: "var(--ember)", color: "#2a1300" },
                  children: (i === "lobby" && !p ? u : m)[0],
                }),
              ],
            }),
            (0, Ut.jsx)("button", {
              className: "btn btn-ghost btn-sm px-2",
              onClick: f,
              "aria-label": "Close game",
              children: (0, Ut.jsx)(pe, {}),
            }),
          ],
        }),
        i === "lobby" &&
          (0, Ut.jsxs)("div", {
            className: "grid md:grid-cols-[1fr_300px] gap-4",
            children: [
              (0, Ut.jsx)("div", {
                className: "rounded-2xl p-6 grid place-items-center text-center fake-video min-h-[260px]",
                style: { "--h": 215 },
                children: (0, Ut.jsxs)("div", {
                  children: [
                    (0, Ut.jsx)("div", {
                      className: "font-display text-4xl font-extrabold",
                      children: a.name,
                    }),
                    (0, Ut.jsx)("div", { className: "mt-2 text-sm opacity-90", children: a.tag }),
                    (0, Ut.jsx)("button", {
                      className: "btn btn-ember mt-6 px-8 py-3 text-base",
                      onClick: () => {
                        (s("play"), h((k) => k + 1));
                      },
                      id: "start-game",
                      children: "Start",
                    }),
                  ],
                }),
              }),
              (0, Ut.jsxs)("div", {
                className: "space-y-3",
                children: [
                  p &&
                    (0, Ut.jsxs)("div", {
                      className: "card p-3",
                      children: [
                        (0, Ut.jsx)("div", { className: "label", children: "Mode" }),
                        (0, Ut.jsxs)("div", {
                          className: "grid grid-cols-2 gap-2",
                          children: [
                            (0, Ut.jsxs)("button", {
                              className: `card p-3 text-left ${o === "ai" ? "chip-on" : ""}`,
                              onClick: () => n("ai"),
                              children: [
                                (0, Ut.jsx)(Nr, {}),
                                (0, Ut.jsxs)("div", {
                                  className: "text-sm font-bold mt-1",
                                  children: ["vs ", u],
                                }),
                                (0, Ut.jsx)("div", {
                                  className: "text-[11px]",
                                  style: { color: "var(--ink-dim)" },
                                  children: "AI rival",
                                }),
                              ],
                            }),
                            (0, Ut.jsxs)("button", {
                              className: `card p-3 text-left ${o === "2p" ? "chip-on" : ""}`,
                              onClick: () => n("2p"),
                              children: [
                                (0, Ut.jsx)($e, {}),
                                (0, Ut.jsx)("div", {
                                  className: "text-sm font-bold mt-1",
                                  children: "Same screen",
                                }),
                                (0, Ut.jsx)("div", {
                                  className: "text-[11px]",
                                  style: { color: "var(--ink-dim)" },
                                  children: "Same keyboard",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  (0, Ut.jsxs)("div", {
                    className: "card p-3 text-sm",
                    children: [
                      (0, Ut.jsx)("div", { className: "label", children: "Controls" }),
                      o === "2p" && y0[e].p2 ? y0[e].p2 : y0[e].ai,
                    ],
                  }),
                  (0, Ut.jsxs)("div", {
                    className: "card p-3 text-sm",
                    children: [
                      (0, Ut.jsx)("div", { className: "label", children: "Rewards" }),
                      "Win: +80 XP, +25 orbs \xB7 Play: +30 XP, +8 orbs",
                      (0, Ut.jsxs)("div", {
                        className: "mt-1 text-xs",
                        style: { color: "var(--ink-dim)" },
                        children: ["Your best: ", t.gameBest[e] ?? "\u2014"],
                      }),
                    ],
                  }),
                  ["chess", "connect4", "race"].includes(e) &&
                    (v
                      ? (0, Ut.jsxs)("div", {
                          className: "card p-3 text-sm",
                          children: [
                            "Online match with ",
                            (0, Ut.jsx)("b", { children: v.friend }),
                            ". Press Start when you are both ready.",
                          ],
                        })
                      : (0, Ut.jsxs)("button", {
                          className: "btn btn-ghost btn-sm w-full",
                          onClick: () => {
                            (C({ activeGame: null }), It("friends"));
                          },
                          children: [(0, Ut.jsx)(ii, {}), " Play with an online friend"],
                        })),
                ],
              }),
            ],
          }),
        i === "play" &&
          (0, Ut.jsxs)(
            "div",
            {
              children: [
                e === "hockey" && (0, Ut.jsx)(NE, { ...x }),
                e === "race" && (0, Ut.jsx)(ux, { ...x }),
                e === "chess" && (0, Ut.jsx)(qE, { ...x }),
                e === "connect4" && (0, Ut.jsx)(XE, { ...x }),
                e === "catcher" && (0, Ut.jsx)(RE, { ...x }),
                e === "trivia" && (0, Ut.jsx)(BE, { ...x }),
                (0, Ut.jsxs)("div", {
                  className: "text-xs mt-2",
                  style: { color: "var(--ink-dim)" },
                  children: [o === "2p" && y0[e].p2 ? y0[e].p2 : y0[e].ai, " \xB7 Esc to leave"],
                }),
              ],
            },
            d,
          ),
        i === "end" &&
          l &&
          (0, Ut.jsxs)("div", {
            className: "rounded-2xl p-8 text-center fake-video",
            style: { "--h": l.won ? 25 : 215 },
            children: [
              (0, Ut.jsx)($l, {
                className: "mx-auto text-5xl",
                style: { color: l.won ? "#ffc27a" : "#a8d8ff" },
              }),
              (0, Ut.jsx)("div", {
                className: "font-display text-4xl font-extrabold mt-2",
                children: l.won ? "You win!" : "Good game!",
              }),
              (0, Ut.jsx)("div", { className: "mt-2 text-lg", children: l.summary }),
              (0, Ut.jsx)("div", {
                className: "mt-1 text-sm opacity-90",
                children: l.won ? "+80 XP \xB7 +25 orbs" : "+30 XP \xB7 +8 orbs",
              }),
              (0, Ut.jsxs)("div", {
                className: "flex gap-2 justify-center mt-6",
                children: [
                  (0, Ut.jsxs)("button", {
                    className: "btn btn-ember",
                    onClick: () => {
                      (s("play"), h((k) => k + 1));
                    },
                    children: [(0, Ut.jsx)(U8, {}), " Play again"],
                  }),
                  (0, Ut.jsx)("button", {
                    className: "btn btn-ghost",
                    onClick: f,
                    children: "Back to the arcade",
                  }),
                ],
              }),
            ],
          }),
      ],
    }),
  });
}
var Bg = P(Zt(), 1),
  Oe = P(ea(), 1);
var Pt = P(ea(), 1);
function pd(t) {
  let e = new Pt.Group(),
    a = new Pt.MeshStandardMaterial({ color: t.color, roughness: 0.45, metalness: 0.15 }),
    r = new Pt.MeshStandardMaterial({
      color: t.accent,
      emissive: t.accent,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    }),
    o = new Pt.MeshStandardMaterial({ color: "#141c2e", roughness: 0.6 }),
    n = (i, s, l = 0, c = 0, d = 0, h = 0, u = 0, p = 0, v = 1, g = 1, m = 1) => {
      let f = new Pt.Mesh(i, s);
      return (
        f.position.set(l, c, d),
        f.rotation.set(h, u, p),
        f.scale.set(v, g, m),
        (f.castShadow = !0),
        e.add(f),
        f
      );
    };
  if (t.image) {
    let i = new Pt.TextureLoader().load(t.image);
    n(new Pt.BoxGeometry(1.1, 1.1, 0.06), o, 0, 0.65, 0);
    let s = new Pt.Mesh(new Pt.PlaneGeometry(1, 1), new Pt.MeshBasicMaterial({ map: i, toneMapped: !1 }));
    (s.position.set(0, 0.65, 0.035), e.add(s));
    let l = s.clone();
    return (
      (l.rotation.y = Math.PI),
      (l.position.z = -0.035),
      e.add(l),
      n(new Pt.TorusGeometry(0.62, 0.02, 6, 4), r, 0, 0.65, 0, 0, 0, Math.PI / 4),
      e
    );
  }
  switch (t.kind) {
    case "sneaker": {
      (n(new Pt.BoxGeometry(0.42, 0.12, 1.05), r, 0, 0.06, 0),
        n(
          Pt.CapsuleGeometry
            ? new Pt.CapsuleGeometry(0.2, 0.55, 6, 12)
            : new Pt.CylinderGeometry(0.2, 0.2, 0.8, 12),
          a,
          0,
          0.28,
          0.05,
          Math.PI / 2,
          0,
          0,
          1,
          1,
          0.9,
        ),
        n(new Pt.BoxGeometry(0.38, 0.38, 0.36), a, 0, 0.32, -0.3),
        n(new Pt.TorusGeometry(0.15, 0.025, 6, 20), r, 0, 0.5, -0.32, Math.PI / 2));
      for (let i = 0; i < 3; i++)
        n(new Pt.BoxGeometry(0.3, 0.02, 0.03), o, 0, 0.42 - i * 0.02, 0.05 + i * 0.12, 0.3);
      break;
    }
    case "chair": {
      (n(new Pt.BoxGeometry(0.8, 0.1, 0.75), a, 0, 0.45, 0),
        n(new Pt.BoxGeometry(0.8, 0.7, 0.1), a, 0, 0.82, -0.34, -0.15));
      for (let [i, s] of [
        [-0.34, -0.3],
        [0.34, -0.3],
        [-0.34, 0.3],
        [0.34, 0.3],
      ])
        n(new Pt.CylinderGeometry(0.03, 0.03, 0.45, 8), r, i, 0.22, s);
      break;
    }
    case "sofa": {
      (n(new Pt.BoxGeometry(1.6, 0.3, 0.75), a, 0, 0.3, 0),
        n(new Pt.BoxGeometry(1.6, 0.5, 0.2), a, 0, 0.6, -0.3),
        n(new Pt.BoxGeometry(0.18, 0.42, 0.75), a, -0.8, 0.45, 0),
        n(new Pt.BoxGeometry(0.18, 0.42, 0.75), a, 0.8, 0.45, 0),
        n(new Pt.BoxGeometry(1.62, 0.04, 0.77), r, 0, 0.13, 0),
        e.scale.setScalar(0.7));
      break;
    }
    case "headphones": {
      n(new Pt.TorusGeometry(0.42, 0.05, 10, 40, Math.PI), a, 0, 0.55, 0);
      for (let i of [-1, 1])
        (n(new Pt.CylinderGeometry(0.18, 0.18, 0.14, 24), a, 0.42 * i, 0.5, 0, 0, 0, Math.PI / 2),
          n(new Pt.CylinderGeometry(0.12, 0.12, 0.15, 24), r, 0.43 * i, 0.5, 0, 0, 0, Math.PI / 2));
      break;
    }
    case "watch": {
      (n(new Pt.CylinderGeometry(0.26, 0.26, 0.08, 32), a, 0, 0.6, 0, Math.PI / 2),
        n(new Pt.CircleGeometry(0.21, 32), r, 0, 0.6, 0.045),
        n(new Pt.BoxGeometry(0.18, 0.5, 0.04), o, 0, 0.92, 0),
        n(new Pt.BoxGeometry(0.18, 0.5, 0.04), o, 0, 0.28, 0),
        n(new Pt.BoxGeometry(0.008, 0.15, 0.01), new Pt.MeshBasicMaterial({ color: "#fff" }), 0, 0.66, 0.05));
      break;
    }
    case "lamp": {
      (n(new Pt.CylinderGeometry(0.25, 0.3, 0.06, 24), o, 0, 0.03, 0),
        n(new Pt.CylinderGeometry(0.02, 0.02, 0.6, 8), o, 0, 0.33, 0),
        n(
          new Pt.SphereGeometry(0.3, 24, 16),
          new Pt.MeshStandardMaterial({
            color: t.color,
            emissive: t.color,
            emissiveIntensity: 1.2,
            transparent: !0,
            opacity: 0.9,
          }),
          0,
          0.85,
          0,
        ),
        n(new Pt.TorusGeometry(0.4, 0.02, 6, 40), r, 0, 0.85, 0));
      break;
    }
    case "bottle": {
      (n(new Pt.CylinderGeometry(0.2, 0.2, 0.75, 24), a, 0, 0.4, 0),
        n(new Pt.CylinderGeometry(0.12, 0.2, 0.12, 24), a, 0, 0.84, 0),
        n(new Pt.CylinderGeometry(0.13, 0.13, 0.12, 24), r, 0, 0.96, 0),
        n(new Pt.TorusGeometry(0.205, 0.015, 6, 32), r, 0, 0.4, 0, Math.PI / 2));
      break;
    }
    case "bag": {
      (n(new Pt.BoxGeometry(0.75, 0.85, 0.35), a, 0, 0.45, 0),
        n(new Pt.BoxGeometry(0.55, 0.3, 0.06), r, 0, 0.3, 0.2),
        n(new Pt.TorusGeometry(0.2, 0.03, 6, 20, Math.PI), o, 0, 0.88, 0));
      break;
    }
    case "phone": {
      (n(new Pt.BoxGeometry(0.5, 0.98, 0.06), a, 0, 0.6, 0),
        n(
          new Pt.PlaneGeometry(0.44, 0.9),
          new Pt.MeshBasicMaterial({ color: t.accent, toneMapped: !1 }),
          0,
          0.6,
          0.032,
        ),
        n(new Pt.CylinderGeometry(0.05, 0.05, 0.02, 16), o, -0.13, 0.95, -0.035, Math.PI / 2));
      break;
    }
    case "helmet": {
      (n(new Pt.SphereGeometry(0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.8), a, 0, 0.35, 0),
        n(
          new Pt.SphereGeometry(0.425, 32, 8, -Math.PI * 0.35, Math.PI * 0.7, Math.PI * 0.32, Math.PI * 0.2),
          r,
          0,
          0.35,
          0,
          0,
          Math.PI / 2,
          0,
        ));
      break;
    }
  }
  return e;
}
var Ka = P(ct(), 1);
