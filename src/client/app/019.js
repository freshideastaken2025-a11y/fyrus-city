var c7 = (t, e) => {
    let a = new U.Color(t);
    return (a.multiplyScalar(e), "#" + a.getHexString());
  },
  Nn = class {
    constructor(e, a, r = "", o = !1, n, i) {
      this.root = new U.Group();
      this.body = new U.Group();
      this.hips = new U.Group();
      this.head = new U.Group();
      this.mask = null;
      this.maskOn = !1;
      this.legs = [];
      this.arms = [];
      this.acc = new U.Group();
      this.board = new U.Group();
      this.bubble = null;
      this.bubbleUntil = 0;
      this.vel = new U.Vector3();
      this.vy = 0;
      this.grounded = !0;
      this.target = null;
      this.phase = Math.random() * 10;
      this.speed = 0;
      this.emote = null;
      this.emoteT = 0;
      this.hovering = !1;
      this.swimming = !1;
      this.sitting = !1;
      this.trail = [];
      this.trailIdx = 0;
      this.trailAcc = 0;
      this.trailColors = [];
      this.mats = {};
      this.shapeSig = "";
      this.hairGroup = new U.Group();
      this.blinkT = 2 + Math.random() * 3;
      this.face = null;
      this.photoUrl = null;
      ((this.name = e),
        (this.color = a),
        (this.style = n || { acc: "none", trail: "none", board: "classic" }),
        (this.outfit = Vg({ ...(i || this.style.outfit || {}) })));
      let s = (l, c = 0.8) => new U.MeshStandardMaterial({ color: l, roughness: c, metalness: 0.02 });
      ((this.mats = {
        skin: s(this.outfit.skin, 0.55),
        top: s(this.outfit.top),
        top2: s(c7(this.outfit.top, 0.7)),
        bottom: s(this.outfit.bottom),
        shoes: s(this.outfit.shoes, 0.6),
        hair: s(this.outfit.hairColor, 0.7),
        eye: s("#ffffff", 0.25),
        iris: s(this.outfit.eyes, 0.3),
        pupil: s("#0a0a0a", 0.2),
        lips: s(this.outfit.lips, 0.5),
        white: s("#f4f2ee", 0.6),
        tie: s("#a8323a", 0.5),
        glass: new U.MeshStandardMaterial({ color: "#111", metalness: 0.6, roughness: 0.25 }),
        lens: new U.MeshStandardMaterial({
          color: "#203040",
          metalness: 0.9,
          roughness: 0.05,
          transparent: !0,
          opacity: 0.55,
        }),
      }),
        this.body.add(this.hips),
        this.buildBody(),
        (this.ring = new U.Mesh(
          QN,
          new U.MeshBasicMaterial({
            color: o ? a : "#000000",
            transparent: !0,
            opacity: o ? 0.35 : 0.18,
            depthWrite: !1,
          }),
        )),
        (this.ring.rotation.x = -Math.PI / 2),
        (this.ring.position.y = 0.02),
        this.body.add(this.board),
        (this.board.visible = !1),
        (this.label = fu(e, r, a, 0.55)),
        (this.label.position.y = 2.25),
        this.root.add(this.body, this.ring, this.label),
        this.applyStyle(this.style));
    }
    setMask(e) {
      if (((this.maskOn = e), e && !this.mask)) {
        let a = new U.Mesh(
          new U.SphereGeometry(0.135, 20, 14, -Math.PI * 0.55, Math.PI * 1.1, 0.35, 1.7),
          new U.MeshStandardMaterial({
            color: "#15181d",
            metalness: 0.9,
            roughness: 0.18,
            emissive: "#4da3ff",
            emissiveIntensity: 0.12,
          }),
        );
        (a.scale.set(0.98, 1.14, 1.04), a.position.set(0, 0, 0.01), this.head.add(a), (this.mask = a));
      }
      this.mask && (this.mask.visible = e);
    }
    buildBody() {
      let e = this.outfit,
        a = this.mats,
        r = e.gender === "f";
      (this.hips.clear(),
        (this.legs = []),
        (this.arms = []),
        (this.head = new U.Group()),
        (this.mask = null),
        (this.face = null),
        (this.shapeSig = [
          e.gender,
          e.topStyle,
          e.bottomStyle,
          e.hair,
          e.face,
          e.brows,
          e.beard,
          e.glasses,
          e.height,
        ].join("|")));
      let o = r ? 0.88 : 1,
        n = r ? 1.08 : 1;
      ((this.hips.position.y = 0.95), this.body.scale.setScalar((r ? 0.95 : 1) * (e.height || 1)));
      let i = e.bottomStyle === "shorts" || e.bottomStyle === "skirt" || e.topStyle === "dress",
        s = e.bottomStyle === "shalwar",
        l = new U.Mesh(ZN, a.bottom);
      (l.scale.set(n, 1, n), (l.castShadow = !0), this.hips.add(l));
      for (let x of [-1, 1]) {
        let k = new U.Group();
        k.position.set((r ? 0.095 : 0.1) * x, -0.02, 0);
        let b = new U.Mesh(d7, i ? a.skin : a.bottom);
        ((b.castShadow = !0), s && b.scale.set(1.35, 1, 1.35));
        let w = new U.Mesh(u7, a.shoes);
        if (((w.castShadow = !0), k.add(b, w), e.bottomStyle === "shorts")) {
          let L = new U.Mesh(h7, a.bottom);
          k.add(L);
        }
        (this.legs.push(k), this.hips.add(k));
      }
      if (e.bottomStyle === "skirt" && e.topStyle !== "dress") {
        let x = new U.Mesh(new U.CylinderGeometry(0.2 * n, 0.3, 0.42, 16, 1, !0), a.bottom);
        ((x.material.side = U.DoubleSide), (x.position.y = -0.17), this.hips.add(x));
      }
      let c = new U.Mesh(qN, a.top);
      if (((c.position.y = 0.4), c.scale.set(o, 1, 0.62), (c.castShadow = !0), this.hips.add(c), r))
        for (let x of [-1, 1]) {
          let k = new U.Mesh(new U.SphereGeometry(0.07, 12, 8), a.top);
          (k.position.set(0.075 * x, 0.5, 0.085), k.scale.set(1, 0.85, 0.75), this.hips.add(k));
        }
      let d = new U.Mesh(new U.SphereGeometry(0.22, 14, 8), a.top);
      (d.scale.set(o, 0.4, 0.6), (d.position.y = 0.68), this.hips.add(d));
      let h = e.topStyle;
      if (h === "hoodie") {
        let x = new U.Mesh(new U.SphereGeometry(0.15, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2), a.top);
        ((x.rotation.x = -1.9), x.position.set(0, 0.74, -0.07), this.hips.add(x));
        let k = new U.Mesh(new U.BoxGeometry(0.22, 0.09, 0.02), a.top2);
        (k.position.set(0, 0.2, 0.115), this.hips.add(k));
        for (let b of [-1, 1]) {
          let w = new U.Mesh(new U.CylinderGeometry(0.005, 0.005, 0.14, 4), a.white);
          (w.position.set(0.035 * b, 0.6, 0.13), this.hips.add(w));
        }
      }
      if (h === "jacket" || h === "suit") {
        for (let k of [-1, 1]) {
          let b = new U.Mesh(new U.BoxGeometry(0.1, 0.5, 0.02), a.top2);
          (b.position.set(0.075 * k, 0.42, 0.125), (b.rotation.z = -0.1 * k), this.hips.add(b));
        }
        let x = new U.Mesh(new U.BoxGeometry(0.07, 0.48, 0.015), a.white);
        if ((x.position.set(0, 0.44, 0.122), this.hips.add(x), h === "suit")) {
          let k = new U.Mesh(new U.BoxGeometry(0.035, 0.32, 0.012), a.tie);
          (k.position.set(0, 0.5, 0.132), this.hips.add(k));
        }
      }
      if (h === "shirt") {
        for (let x of [-1, 1]) {
          let k = new U.Mesh(new U.BoxGeometry(0.08, 0.04, 0.02), a.top2);
          (k.position.set(0.04 * x, 0.7, 0.11), (k.rotation.z = 0.5 * x), this.hips.add(k));
        }
        for (let x = 0; x < 4; x++) {
          let k = new U.Mesh(new U.SphereGeometry(0.008, 6, 4), a.white);
          (k.position.set(0, 0.62 - x * 0.12, 0.13), this.hips.add(k));
        }
      }
      if (h === "kurta" || h === "dress") {
        let x = h === "dress" ? 0.62 : 0.5,
          k = new U.Mesh(new U.CylinderGeometry(0.2 * o, h === "dress" ? 0.34 : 0.25, x, 16, 1, !0), a.top);
        if (
          ((k.material = a.top),
          (k.material.side = U.DoubleSide),
          (k.position.y = 0.12 - x / 2 + 0.1),
          this.hips.add(k),
          h === "kurta")
        ) {
          let b = new U.Mesh(new U.BoxGeometry(0.04, 0.22, 0.012), a.top2);
          (b.position.set(0, 0.6, 0.12), this.hips.add(b));
        }
      }
      h === "tank" && c.scale.set(o * 0.97, 1, 0.6);
      for (let x of [-1, 1]) {
        let k = new U.Group();
        k.position.set(0.25 * x * o, 0.66, 0);
        let b = new U.Mesh(p7, h === "tank" ? a.skin : a.top),
          w = h === "hoodie" || h === "jacket" || h === "suit" || h === "shirt" || h === "kurta",
          L = new U.Mesh(w ? f7 : g7, w ? a.top : a.skin),
          E = new U.Mesh(m7, a.skin);
        ((b.castShadow = L.castShadow = !0),
          k.add(b, L, E),
          (k.rotation.z = 0.08 * x),
          this.arms.push(k),
          this.hips.add(k));
      }
      let u = new U.Mesh(XN, e.hair === "hijab" ? a.hair : a.skin);
      ((u.position.y = 0.76), this.hips.add(u), (this.head.position.y = 0.92), this.hips.add(this.head));
      let p = {
          oval: [0.95, 1.12, 1],
          round: [1.02, 1.04, 1.02],
          long: [0.9, 1.2, 0.98],
          square: [1.02, 1.08, 1],
        }[e.face] || [0.95, 1.12, 1],
        v = new U.Mesh(KN, a.skin);
      if ((v.scale.set(p[0], p[1], p[2]), (v.castShadow = !0), this.head.add(v), e.face === "square")) {
        let x = new U.Mesh(new U.BoxGeometry(0.17, 0.07, 0.16), a.skin);
        (x.position.set(0, -0.085, 0.01), this.head.add(x));
      }
      for (let x of [-1, 1]) {
        for (let S of [0]);
        let k = new U.Mesh(new U.SphereGeometry(0.025, 8, 6), a.skin);
        (k.scale.set(0.5, 1, 0.8), k.position.set(0.118 * p[0] * x, 0, 0), this.head.add(k));
        let b = new U.Mesh(Kx, a.eye);
        (b.scale.set(1, 0.75, 0.55), b.position.set(0.042 * x, 0.022, 0.108), this.head.add(b));
        let w = new U.Mesh(s7, a.iris);
        (w.position.set(0.042 * x, 0.022, 0.118), this.head.add(w));
        let L = new U.Mesh(l7, a.pupil);
        (L.position.set(0.042 * x, 0.022, 0.1255), this.head.add(L));
        let E = e.brows === "thick" ? 0.012 : e.brows === "thin" ? 0.005 : 0.008,
          T = new U.Mesh(new U.BoxGeometry(0.04, E, 0.01), a.hair);
        if ((T.position.set(0.043 * x, 0.052, 0.116), (T.rotation.z = -0.12 * x), this.head.add(T), r)) {
          let S = new U.Mesh(new U.BoxGeometry(0.03, 0.004, 0.008), a.pupil);
          (S.position.set(0.045 * x, 0.034, 0.12), this.head.add(S));
        }
      }
      let g = new U.Mesh(new U.ConeGeometry(0.016, 0.045, 6), a.skin);
      ((g.rotation.x = Math.PI / 2 - 0.25), g.position.set(0, -0.005, 0.128), this.head.add(g));
      let m = new U.Mesh(new U.BoxGeometry(r ? 0.042 : 0.038, r ? 0.011 : 0.008, 0.01), a.lips);
      (m.position.set(0, -0.052, 0.114), this.head.add(m));
      let f = e.beard;
      if (f === "stubble") {
        let x = new U.Mesh(
          new U.SphereGeometry(0.128, 18, 10, -Math.PI * 0.45, Math.PI * 0.9, Math.PI * 0.55, Math.PI * 0.3),
          new U.MeshStandardMaterial({
            color: this.outfit.hairColor,
            transparent: !0,
            opacity: 0.35,
            roughness: 1,
          }),
        );
        (x.scale.set(p[0], p[1], p[2]), this.head.add(x));
      }
      if (f === "short" || f === "full") {
        let x = new U.Mesh(
          new U.SphereGeometry(
            0.13,
            18,
            10,
            -Math.PI * 0.45,
            Math.PI * 0.9,
            Math.PI * 0.56,
            f === "full" ? Math.PI * 0.42 : Math.PI * 0.3,
          ),
          a.hair,
        );
        (x.scale.set(p[0] * 1.02, p[1] * (f === "full" ? 1.08 : 1.02), p[2] * 1.04), this.head.add(x));
      }
      if (f === "moustache" || f === "short" || f === "full") {
        let x = new U.Mesh(new U.BoxGeometry(0.05, 0.012, 0.012), a.hair);
        (x.position.set(0, -0.036, 0.122), this.head.add(x));
      }
      let y = e.glasses;
      if (y !== "none") {
        for (let k of [-1, 1]) {
          if (y === "round") {
            let w = new U.Mesh(new U.TorusGeometry(0.022, 0.003, 6, 16), a.glass);
            (w.position.set(0.043 * k, 0.022, 0.128), this.head.add(w));
          } else {
            let w = new U.Mesh(new U.BoxGeometry(0.05, 0.034, 0.006), y === "shades" ? a.glass : a.lens);
            if ((w.position.set(0.043 * k, 0.022, 0.129), this.head.add(w), y === "square")) {
              let L = new U.Mesh(new U.BoxGeometry(0.054, 0.004, 0.007), a.glass);
              (L.position.set(0.043 * k, 0.04, 0.129), this.head.add(L));
            }
          }
          let b = new U.Mesh(new U.BoxGeometry(0.004, 0.004, 0.11), a.glass);
          (b.position.set(0.11 * k, 0.025, 0.07), this.head.add(b));
        }
        let x = new U.Mesh(new U.BoxGeometry(0.02, 0.004, 0.004), a.glass);
        (x.position.set(0, 0.03, 0.13), this.head.add(x));
      }
      (this.head.add(this.acc),
        this.buildHair(),
        this.maskOn && this.setMask(!0),
        this.photoUrl && this.setPhoto(this.photoUrl));
    }
    buildHair() {
      (this.head.remove(this.hairGroup), (this.hairGroup = new U.Group()));
      let e = this.outfit,
        a = this.mats.hair,
        r = (i) => this.hairGroup.add(i),
        o = e.hair,
        n = (i = 1, s = 1.1, l = 1.05) => {
          let c = new U.Mesh(JN, a);
          return ((c.position.y = 0.02), c.scale.set(i, s, l), r(c), c);
        };
      if (o === "hijab") {
        let i = new U.Mesh(new U.SphereGeometry(0.145, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.78), a);
        (i.scale.set(1, 1.12, 1.08), i.position.set(0, 0.005, -0.01), r(i));
        let s = new U.Mesh(new U.CylinderGeometry(0.12, 0.2, 0.2, 18, 1, !0), a);
        ((s.material.side = U.DoubleSide), s.position.set(0, -0.16, -0.01), r(s));
        let l = new U.Mesh(new U.TorusGeometry(0.118, 0.012, 6, 24, Math.PI), a);
        (l.position.set(0, -0.005, 0.03), l.rotation.set(-0.15, 0, 0), l.scale.set(1, 1.15, 1), r(l));
      } else
        o === "buzz"
          ? n(1, 1.02, 1).scale.multiplyScalar(0.97)
          : o !== "bald" && n(1, o === "afro" ? 1 : 1.1, 1.05);
      if (o === "long" || o === "braids") {
        let i = new U.Mesh(new U.BoxGeometry(0.24, o === "braids" ? 0.42 : 0.34, 0.08), a);
        (i.position.set(0, -0.13, -0.09), r(i));
        for (let s of [-1, 1]) {
          let l = new U.Mesh(new U.BoxGeometry(0.05, 0.22, 0.09), a);
          (l.position.set(0.115 * s, -0.06, -0.02), r(l));
        }
        if (o === "braids")
          for (let s = 0; s < 5; s++) {
            let l = new U.Mesh(new U.SphereGeometry(0.025, 8, 6), a);
            (l.position.set(-0.08 + s * 0.04, -0.36, -0.1), r(l));
          }
      }
      if (o === "bun") {
        let i = new U.Mesh(new U.SphereGeometry(0.07, 10, 8), a);
        (i.position.set(0, 0.12, -0.1), r(i));
      }
      if (o === "ponytail") {
        let i = new U.Mesh(new U.SphereGeometry(0.04, 8, 6), a);
        (i.position.set(0, 0.06, -0.135), r(i));
        let s = new U.Mesh(new U.CylinderGeometry(0.035, 0.015, 0.28, 8), a);
        (s.position.set(0, -0.08, -0.16), (s.rotation.x = 0.25), r(s));
      }
      if (o === "curly")
        for (let i = 0; i < 18; i++) {
          let s = (i / 18) * Math.PI * 2,
            l = new U.Mesh(new U.SphereGeometry(0.035, 8, 6), a);
          (l.position.set(Math.cos(s) * 0.12, 0.08 + (i % 3) * 0.02, Math.sin(s) * 0.12 - 0.01),
            l.position.z < 0.08 && r(l));
        }
      if (o === "afro") {
        let i = new U.Mesh(new U.IcosahedronGeometry(0.2, 2), a);
        (i.position.set(0, 0.08, -0.03), i.scale.set(1, 0.85, 0.95), r(i));
      }
      if (o === "mohawk") {
        for (let i = 0; i < 6; i++) {
          let s = new U.Mesh(new U.ConeGeometry(0.025, 0.1, 6), a);
          (s.position.set(0, 0.15 - Math.abs(i - 2.5) * 0.008, 0.08 - i * 0.04),
            (s.rotation.x = -0.3 + i * 0.12),
            r(s));
        }
        this.hairGroup.children[0] && this.hairGroup.children[0].scale.set(0.9, 0.95, 1);
      }
      if (o === "side") {
        let i = new U.Mesh(new U.BoxGeometry(0.14, 0.05, 0.12), a);
        (i.position.set(0.04, 0.11, 0.06), (i.rotation.z = -0.35), r(i));
      }
      if (o === "cap") {
        let i = new U.Mesh(
          new U.SphereGeometry(0.14, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.5),
          this.mats.top,
        );
        i.position.y = 0.03;
        let s = new U.Mesh(new U.BoxGeometry(0.2, 0.015, 0.14), this.mats.top);
        (s.position.set(0, 0.04, 0.15), r(i), r(s));
      }
      this.head.add(this.hairGroup);
    }
    setOutfit(e) {
      this.outfit = Vg({ ...this.outfit, ...e });
      let a = this.outfit,
        r = this.mats;
      (r.skin.color.set(a.skin),
        r.top.color.set(a.top),
        r.top2.color.set(c7(a.top, 0.7)),
        r.bottom.color.set(a.bottom),
        r.shoes.color.set(a.shoes),
        r.hair.color.set(a.hairColor),
        r.iris.color.set(a.eyes),
        r.lips.color.set(a.lips),
        [a.gender, a.topStyle, a.bottomStyle, a.hair, a.face, a.brows, a.beard, a.glasses, a.height].join(
          "|",
        ) !== this.shapeSig && this.buildBody());
    }
    applyStyle(e) {
      ((this.style = e), e.outfit && this.setOutfit(e.outfit), this.acc.clear());
      let a = new U.MeshStandardMaterial({ color: "#d9a441", metalness: 0.9, roughness: 0.3 }),
        r = new U.MeshStandardMaterial({ color: "#4da3ff", emissive: "#4da3ff", emissiveIntensity: 1.2 });
      if (e.acc === "halo") {
        let l = new U.Mesh(
          new U.TorusGeometry(0.14, 0.012, 6, 32),
          new U.MeshStandardMaterial({ color: "#ffc27a", emissive: "#ff9a3c", emissiveIntensity: 1 }),
        );
        ((l.position.y = 0.26), (l.rotation.x = Math.PI / 2), this.acc.add(l));
      }
      if (e.acc === "crown")
        for (let l = 0; l < 7; l++) {
          let c = (l / 7) * Math.PI * 2,
            d = new U.Mesh(new U.ConeGeometry(0.022, 0.07, 5), a);
          (d.position.set(Math.cos(c) * 0.1, 0.19, Math.sin(c) * 0.1), this.acc.add(d));
        }
      if (e.acc === "antenna") {
        let l = new U.Mesh(new U.SphereGeometry(0.025, 8, 6), r);
        l.position.set(0.06, 0.28, 0);
        let c = new U.Mesh(new U.CylinderGeometry(0.006, 0.006, 0.14, 4), a);
        (c.position.set(0.06, 0.2, 0), this.acc.add(c, l));
      }
      if (e.acc === "visor-x") {
        let l = new U.Mesh(
          new U.BoxGeometry(0.22, 0.05, 0.03),
          new U.MeshStandardMaterial({ color: "#111", metalness: 0.9, roughness: 0.1 }),
        );
        (l.position.set(0, 0.02, 0.12), this.acc.add(l));
      }
      if (e.acc === "orbit") {
        let l = new U.Group();
        l.userData.spin = 2;
        for (let c = 0; c < 2; c++) {
          let d = new U.Mesh(new U.SphereGeometry(0.025, 8, 6), r);
          (d.position.set(c ? 0.22 : -0.22, 0.1, 0), l.add(d));
        }
        this.acc.add(l);
      }
      this.board.clear();
      let o = e.board === "flame" ? "#3a1a08" : e.board === "neon" ? "#0b1838" : "#1d2433",
        n = e.board === "flame" ? "#ff9a3c" : "#4da3ff",
        i = new U.Mesh(tR, new U.MeshStandardMaterial({ color: o, metalness: 0.7, roughness: 0.3 }));
      i.castShadow = !0;
      let s = new U.Mesh(new U.PlaneGeometry(0.5, 1.4), new U.MeshBasicMaterial({ color: n }));
      ((s.rotation.x = Math.PI / 2),
        (s.position.y = -0.04),
        this.board.add(i, s),
        (this.trailColors = aR[e.trail] || []));
    }
    ensureTrail(e) {
      if (!this.trailColors.length) {
        this.trail.forEach((a) => (a.visible = !1));
        return;
      }
      if (this.trail.length) {
        this.trail[0].parent !== e && this.trail.forEach((a) => e.add(a));
        return;
      }
      for (let a = 0; a < 24; a++) {
        let r = new U.Mesh(
          eR,
          new U.MeshBasicMaterial({
            color: "#fff",
            transparent: !0,
            opacity: 0,
            depthWrite: !1,
            blending: U.AdditiveBlending,
          }),
        );
        ((r.visible = !1), this.trail.push(r), e.add(r));
      }
    }
    say(e, a) {
      (this.bubble && (this.root.remove(this.bubble), this.bubble.material.map.dispose()),
        (this.bubble = oL(e, this.color)),
        (this.bubble.position.y = 2.75),
        this.bubble.scale.multiplyScalar(0.7),
        this.root.add(this.bubble),
        (this.bubbleUntil = a + 5));
    }
    doEmote(e, a) {
      ((this.emote = e),
        (this.emoteT = 0),
        e === "wave" && this.say("\u{1F44B} Hi!", a),
        e === "hearts" && this.say("\u{1F499}\u{1F9E1}", a),
        e === "flip" && this.grounded && !this.swimming && ((this.vy = 7), (this.grounded = !1)));
    }
    update(e, a) {
      let r = Math.min(1.6, this.speed / 5);
      this.phase += e * (1.5 + this.speed * 1.35);
      let o = this.hovering || this.swimming ? 0 : Math.min(1, this.speed / 3) * (0.55 + r * 0.2),
        n = Math.sin(this.phase * 2);
      ((this.legs[0].rotation.x = n * o),
        (this.legs[1].rotation.x = -n * o),
        (this.arms[0].rotation.x = -n * o * 0.9),
        (this.arms[1].rotation.x = n * o * 0.9),
        (this.arms[0].rotation.z = -0.08),
        (this.arms[1].rotation.z = 0.08),
        this.hips.rotation.set(r * 0.12, 0, 0),
        this.body.rotation.set(0, 0, 0));
      let i =
        Math.abs(Math.sin(this.phase * 2)) * 0.05 * Math.min(1, this.speed / 2) +
        Math.sin(a * 1.8 + this.phase) * 0.006;
      if (
        (this.hovering &&
          ((i = 0.45 + Math.sin(a * 3) * 0.05),
          (this.arms[0].rotation.z = -0.6),
          (this.arms[1].rotation.z = 0.6),
          (this.legs[0].rotation.x = 0.15),
          (this.legs[1].rotation.x = -0.15)),
        this.swimming)
      ) {
        ((this.hips.rotation.x = 1.25), (i = -0.75 + Math.sin(a * 2) * 0.04));
        let l = a * (2 + this.speed * 0.6);
        ((this.arms[0].rotation.x = Math.sin(l) * 2.6),
          (this.arms[1].rotation.x = Math.sin(l + Math.PI) * 2.6),
          (this.legs[0].rotation.x = Math.sin(l * 2) * 0.35),
          (this.legs[1].rotation.x = -Math.sin(l * 2) * 0.35));
      }
      if (
        (this.sitting && ((this.legs[0].rotation.x = this.legs[1].rotation.x = -1.4), (i = -0.42)),
        this.emote)
      ) {
        this.emoteT += e;
        let l = this.emoteT;
        (this.emote === "wave" &&
          ((this.arms[1].rotation.z = 2.7),
          (this.arms[1].rotation.x = Math.sin(l * 12) * 0.25),
          l > 1.8 && (this.emote = null)),
          this.emote === "dance" &&
            ((this.body.rotation.y = Math.sin(l * 4) * 0.8),
            (i += Math.abs(Math.sin(l * 8)) * 0.12),
            (this.arms[0].rotation.z = -1.8 + Math.sin(l * 8) * 0.5),
            (this.arms[1].rotation.z = 1.8 - Math.sin(l * 8) * 0.5),
            (this.legs[0].rotation.x = Math.sin(l * 8) * 0.4),
            (this.legs[1].rotation.x = -Math.sin(l * 8) * 0.4),
            l > 3 && (this.emote = null)),
          this.emote === "flip" &&
            ((this.body.rotation.x = -Math.min(1, l / 0.9) * Math.PI * 2), l > 0.95 && (this.emote = null)),
          this.emote === "hearts" &&
            ((this.arms[0].rotation.x = this.arms[1].rotation.x = -1.6),
            (this.arms[0].rotation.z = 0.5),
            (this.arms[1].rotation.z = -0.5),
            l > 1.6 && (this.emote = null)),
          this.emote === null && this.loopDance && ((this.emote = "dance"), (this.emoteT = Math.random())));
      }
      this.blinkT -= e;
      let s = this.blinkT < 0.12;
      if (
        (this.blinkT < 0 && (this.blinkT = 2.5 + Math.random() * 3.5),
        this.head.children.forEach((l) => {
          let c = l.geometry;
          (c === Kx || c === s7 || c === l7) && (l.scale.y = s ? 0.1 : c === Kx ? 0.75 : 1);
        }),
        (this.body.position.y = i),
        (this.board.visible = this.hovering),
        (this.board.position.y = 0.32 - i + i),
        this.acc.traverse((l) => {
          l.userData.spin && (l.rotation.y += e * l.userData.spin);
        }),
        (this.ring.position.y = 0.02 - this.root.position.y + (this.root.userData.groundY || 0)),
        (this.ring.visible = !this.swimming),
        this.bubble && a > this.bubbleUntil && (this.root.remove(this.bubble), (this.bubble = null)),
        this.trail.length && this.trailColors.length)
      ) {
        if (((this.trailAcc += e * (this.speed > 1 ? 1 : 0)), this.trailAcc > 0.035)) {
          this.trailAcc = 0;
          let l = this.trail[this.trailIdx++ % this.trail.length];
          ((l.visible = !0),
            l.position
              .copy(this.root.position)
              .add(
                new U.Vector3(
                  (Math.random() - 0.5) * 0.3,
                  (this.hovering ? 0.4 : 0.8) + Math.random() * 0.3,
                  (Math.random() - 0.5) * 0.3,
                ),
              ),
            l.material.color.set(this.trailColors[Math.floor(Math.random() * this.trailColors.length)]),
            (l.material.opacity = 0.8),
            l.scale.setScalar(1));
        }
        this.trail.forEach((l) => {
          if (!l.visible) return;
          let c = l.material;
          ((c.opacity -= e * 1.5),
            l.scale.multiplyScalar(1 - e * 1.2),
            (l.position.y += e * 0.3),
            c.opacity <= 0 && (l.visible = !1));
        });
      }
    }
    setPhoto(e) {
      if (
        ((this.photoUrl = e),
        this.face && (this.head.remove(this.face), this.face.material.map?.dispose(), (this.face = null)),
        !e)
      ) {
        this.hairGroup.visible = !0;
        return;
      }
      let a = new Image(),
        r = this.head;
      ((a.onload = () => {
        if (this.head !== r || this.photoUrl !== e) return;
        let o = document.createElement("canvas");
        o.width = o.height = 128;
        let n = o.getContext("2d");
        (n.beginPath(), n.arc(64, 64, 62, 0, Math.PI * 2), n.clip());
        let i = Math.max(128 / a.width, 128 / a.height);
        n.drawImage(a, (128 - a.width * i) / 2, (128 - a.height * i) / 2, a.width * i, a.height * i);
        let s = new U.CanvasTexture(o);
        s.encoding = U.sRGBEncoding;
        let l = new U.Mesh(
          new U.CircleGeometry(0.125, 24),
          new U.MeshBasicMaterial({ map: s, transparent: !0 }),
        );
        (l.position.set(0, 0.01, 0.135), this.head.add(l), (this.face = l));
      }),
        (a.src = e));
    }
    dispose() {
      (this.trail.forEach((e) => e.parent?.remove(e)),
        this.root.traverse((e) => {
          e.material?.map && e.material.map.dispose();
        }));
    }
  };
var v7 = (t, e, a) => {
    let r = ((e - t + Math.PI) % (Math.PI * 2)) - Math.PI;
    return (r < -Math.PI && (r += Math.PI * 2), t + r * a);
  },
  x7 = [
    "#2f4f6f",
    "#a83b3b",
    "#f2efe8",
    "#3d5a3d",
    "#c7a46a",
    "#222831",
    "#7a4a8a",
    "#e3e3e3",
    "#1f3a5f",
    "#8a5a3c",
    "#d35400",
    "#566573",
  ],
  y7 = ["#222831", "#2b303a", "#3a4a6b", "#4a3b2a", "#1f1f1f", "#6b6b6b", "#c8b89a"],
  k7 = ["#111111", "#2a1a12", "#5a3a1a", "#7a4a24", "#c9a46a", "#8a8a8a"];
function b7(t) {
  let e = (n) => Math.floor(Math.abs(Math.sin(t * 9.17 + n * 3.31)) * 1e3),
    a = e(7) % 2 === 0,
    r = a
      ? ["long", "ponytail", "bun", "braids", "hijab", "curly", "long"][e(2) % 7]
      : ["short", "buzz", "side", "curly", "bald", "cap", "short", "afro"][e(2) % 8],
    o = (
      a
        ? ["tee", "shirt", "kurta", "dress", "jacket", "hoodie"]
        : ["tee", "shirt", "hoodie", "jacket", "suit", "kurta", "tank"]
    )[e(8) % (a ? 6 : 7)];
  return {
    gender: a ? "f" : "m",
    skin: la[e(1) % la.length],
    hair: r,
    hairColor: k7[e(3) % k7.length],
    top: x7[e(4) % x7.length],
    bottom: y7[e(5) % y7.length],
    shoes: ["#efefef", "#222", "#8a5a3c", "#c0392b"][e(6) % 4],
    topStyle: o,
    bottomStyle:
      o === "kurta"
        ? "shalwar"
        : a && e(9) % 3 === 0
          ? "skirt"
          : ["jeans", "trousers", "jeans", "shorts"][e(9) % 4],
    beard: a ? "none" : ["none", "stubble", "short", "full", "moustache", "none"][e(10) % 6],
    glasses: ["none", "none", "none", "round", "square", "shades"][e(11) % 6],
    face: ["oval", "round", "long", "square"][e(12) % 4],
    height: [0.96, 1, 1.03][e(13) % 3],
  };
}
var ku = class {
  constructor() {
    this.list = [];
  }
  spawn(e, a) {
    e.forEach((r) => {
      let o = new Nn(r.name, "#ffffff", r.role, !1, void 0, r.outfit);
      if (
        (o.root.position.set(r.x, 0, r.z),
        (o.root.rotation.y = Math.PI * (r.z > 0 ? 1 : 0)),
        a.add(o.root),
        r.elder)
      ) {
        let n = new ui.Mesh(
          new ui.CylinderGeometry(0.025, 0.03, 1.05, 8),
          new ui.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.7 }),
        );
        (n.position.set(0.42, 0.52, 0.18), (n.rotation.x = 0.12), o.root.add(n));
        let i = new ui.Mesh(new ui.TorusGeometry(0.06, 0.02, 6, 10, Math.PI), n.material);
        (i.position.set(0.42, 1.05, 0.22), o.root.add(i), (o.body.rotation.x = 0.12));
      }
      this.list.push({
        def: r,
        av: o,
        home: new ui.Vector3(r.x, 0, r.z),
        wait: Math.random() * 4,
        greeted: -99,
      });
    });
  }
  clear() {
    (this.list.forEach((e) => {
      (e.av.root.parent?.remove(e.av.root), e.av.dispose());
    }),
      (this.list = []));
  }
  update(e, a, r, o, n) {
    for (let i of this.list) {
      let s = i.av,
        l = s.root.position,
        c = Math.hypot(r.x - l.x, r.z - l.z);
      if (o === i.def.id || c < 3.2)
        ((s.target = null),
          s.vel.multiplyScalar(0.8),
          (s.root.rotation.y = v7(s.root.rotation.y, Math.atan2(r.x - l.x, r.z - l.z), Math.min(1, e * 6))),
          c < 3.2 &&
            a - i.greeted > 40 &&
            o !== i.def.id &&
            ((i.greeted = a),
            s.say(i.def.greeting.length > 46 ? i.def.greeting.slice(0, 44) + "\u2026" : i.def.greeting, a)));
      else if (i.def.wander > 0) {
        if (!s.target && ((i.wait -= e), i.wait <= 0)) {
          let h = Math.random() * Math.PI * 2,
            u = Math.random() * i.def.wander;
          s.target = i.home.clone().add(new ui.Vector3(Math.cos(h) * u, 0, Math.sin(h) * u));
        }
        if (s.target) {
          let h = s.target.clone().sub(l).setY(0);
          h.length() < 0.4
            ? ((s.target = null), (i.wait = 3 + Math.random() * 6))
            : s.vel.lerp(h.normalize().multiplyScalar(i.def.elder ? 0.55 : 1.3), Math.min(1, e * 4));
        } else s.vel.multiplyScalar(0.85);
        s.vel.length() > 0.2 &&
          (s.root.rotation.y = v7(s.root.rotation.y, Math.atan2(s.vel.x, s.vel.z), Math.min(1, e * 6)));
      }
      (l.addScaledVector(s.vel, e),
        (s.speed = s.vel.length()),
        (s.label.visible = n && c < 22),
        s.update(e, a));
    }
  }
};
var Ae = P(ea(), 1);
var Lo = (t) => new Ae.Color(t),
  Bi = {
    dayTop: Lo("#3b7bd4"),
    dayHor: Lo("#bcd7ee"),
    goldTop: Lo("#4b67a8"),
    goldHor: Lo("#f2a35e"),
    nightTop: Lo("#04081a"),
    nightHor: Lo("#16244a"),
    sunDay: Lo("#fff2df"),
    sunGold: Lo("#ffb067"),
    moon: Lo("#8fa6d6"),
    ambDay: Lo("#a7c3e0"),
    ambNight: Lo("#22345e"),
  },
  w7 = {
    clear: { tint: Lo("#ffffff"), mix: 0, sun: 1, fog: 0.0036, cloud: 0.25 },
    cloudy: { tint: Lo("#9aa3ad"), mix: 0.55, sun: 0.5, fog: 0.0052, cloud: 0.85 },
    rain: { tint: Lo("#5d6874"), mix: 0.75, sun: 0.28, fog: 0.0085, cloud: 1 },
    snow: { tint: Lo("#c7d0da"), mix: 0.65, sun: 0.45, fog: 0.0075, cloud: 0.9 },
    heat: { tint: Lo("#e8d2a8"), mix: 0.25, sun: 1.15, fog: 0.0048, cloud: 0.1 },
  };
function oR(t) {
  if (t.time === "dawn") return 6.6;
  if (t.time === "day") return 13;
  if (t.time === "sunset") return 18.2;
  if (t.time === "night") return 22.5;
  let e = new Date();
  return e.getHours() + e.getMinutes() / 60;
}
var Pg = class {
  constructor(e) {
    this.night = 0;
    this.lastSeason = "";
    this.lastSnow = -1;
    ((this.scene = e),
      (e.background = new Ae.Color("#bcd7ee")),
      (e.fog = new Ae.FogExp2(12376046, 0.0036)),
      (this.sky = new Ae.Mesh(new Ae.SphereGeometry(950, 32, 16), cL())),
      (this.sky.frustumCulled = !1),
      e.add(this.sky),
      (this.hemi = new Ae.HemisphereLight("#bcd7ee", "#6b5a48", 0.6)),
      e.add(this.hemi),
      (this.sun = new Ae.DirectionalLight("#fff2df", 2.2)),
      (this.sun.castShadow = !0),
      this.sun.shadow.mapSize.set(2048, 2048));
    let a = this.sun.shadow.camera;
    ((a.left = a.bottom = -70),
      (a.right = a.top = 70),
      (a.near = 1),
      (a.far = 260),
      (this.sun.shadow.bias = -4e-4),
      e.add(this.sun, this.sun.target),
      (this.fill = new Ae.DirectionalLight("#9ab8e0", 0.35)),
      e.add(this.fill));
    let r = 3500,
      o = new Float32Array(r * 6);
    for (let c = 0; c < r; c++) {
      let d = (Math.random() - 0.5) * 90,
        h = Math.random() * 45,
        u = (Math.random() - 0.5) * 90;
      o.set([d, h, u, d + 0.08, h - 0.9, u + 0.04], c * 6);
    }
    let n = new Ae.BufferGeometry();
    (n.setAttribute("position", new Ae.BufferAttribute(o, 3)),
      (this.rain = new Ae.LineSegments(
        n,
        new Ae.LineBasicMaterial({ color: "#b8c6d4", transparent: !0, opacity: 0.45, depthWrite: !1 }),
      )),
      (this.rain.frustumCulled = !1),
      (this.rain.visible = !1),
      e.add(this.rain));
    let i = 2600,
      s = new Float32Array(i * 3);
    for (let c = 0; c < i; c++)
      s.set([(Math.random() - 0.5) * 90, Math.random() * 40, (Math.random() - 0.5) * 90], c * 3);
    let l = new Ae.BufferGeometry();
    (l.setAttribute("position", new Ae.BufferAttribute(s, 3)),
      (this.snow = new Ae.Points(
        l,
        new Ae.PointsMaterial({
          color: "#ffffff",
          size: 0.16,
          transparent: !0,
          opacity: 0.9,
          depthWrite: !1,
        }),
      )),
      (this.snow.frustumCulled = !1),
      (this.snow.visible = !1),
      e.add(this.snow));
  }
  update(e, a, r, o, n, i) {
    ha.uTime.value = a;
    let s = oR(r),
      l = Math.sin(((s - 6) / 24) * Math.PI * 2),
      c = (s / 24) * Math.PI * 2,
      d = Math.max(-0.35, l) * 1.2,
      h = new Ae.Vector3(Math.sin(c) * Math.cos(d), Math.sin(d), -Math.cos(c) * Math.cos(d)).normalize(),
      u = w7[r.weather] || w7.clear,
      p = Ae.MathUtils.smoothstep(l, -0.12, 0.08),
      v = 1 - Ae.MathUtils.smoothstep(l, 0.05, 0.4);
    this.night = 1 - p;
    let g = Bi.nightTop.clone().lerp(Bi.goldTop.clone().lerp(Bi.dayTop, 1 - v), p),
      m = Bi.nightHor.clone().lerp(Bi.goldHor.clone().lerp(Bi.dayHor, 1 - v), p);
    (g.lerp(u.tint.clone().multiplyScalar(0.55 + 0.45 * p), u.mix),
      m.lerp(u.tint.clone().multiplyScalar(0.5 + 0.5 * p), u.mix));
    let f = p > 0.02 ? Bi.sunGold.clone().lerp(Bi.sunDay, 1 - v) : Bi.moon.clone(),
      y = p > 0.02 ? (0.4 + 2 * Math.max(0, l)) * u.sun : 0.22,
      x = Bi.ambNight
        .clone()
        .lerp(Bi.ambDay, p)
        .lerp(u.tint, u.mix * 0.4)
        .multiplyScalar(0.55 + 0.25 * p),
      k = p > 0.02 ? h : new Ae.Vector3(-h.x, Math.abs(h.y) + 0.35, -h.z).normalize();
    (ha.uSunDir.value.copy(k),
      ha.uSunCol.value.copy(f).multiplyScalar(y * 0.55),
      ha.uAmb.value.copy(x),
      ha.uSkyTop.value.copy(g),
      ha.uSkyHor.value.copy(m),
      (ha.uNight.value = this.night),
      r.vibe === "neon" &&
        this.night > 0.3 &&
        (g.lerp(new Ae.Color("#2a0f4a"), 0.6),
        m.lerp(new Ae.Color("#5a1f7a"), 0.55),
        ha.uSkyTop.value.copy(g),
        ha.uSkyHor.value.copy(m)),
      ha.uFog.value.copy(m),
      (ha.uFogD.value = u.fog * (1 + this.night * 0.15)),
      (ha.uCloud.value = u.cloud));
    let b = r.weather === "snow" ? 1 : r.season === "winter" && r.weather !== "heat" ? 0.25 : 0;
    if (
      ((ha.uSnow.value += (b - ha.uSnow.value) * Math.min(1, e * 0.5)),
      (ha.uWet.value += ((r.weather === "rain" ? 1 : 0) - ha.uWet.value) * Math.min(1, e * 0.4)),
      (r.season !== this.lastSeason || Math.abs(ha.uSnow.value - this.lastSnow) > 0.05) &&
        ((this.lastSeason = r.season), (this.lastSnow = ha.uSnow.value), dL(r.season, ha.uSnow.value)),
      this.sun.color.copy(f),
      (this.sun.intensity = y),
      this.sun.position.copy(n).addScaledVector(k, 120),
      this.sun.target.position.copy(n),
      this.hemi.color.copy(g.clone().lerp(m, 0.5)),
      this.hemi.groundColor.set(this.night > 0.5 ? "#1a1d26" : "#6b5a48"),
      (this.hemi.intensity = 0.35 + 0.4 * p),
      (this.fill.intensity = 0.15 + 0.25 * p),
      this.scene.fog.color.copy(m),
      (this.scene.fog.density = ha.uFogD.value),
      this.scene.background.copy(m),
      (i.toneMappingExposure = 0.95 + this.night * 0.35),
      hL(this.night, r.vibe === "neon"),
      this.sky.position.copy(o.position),
      (this.rain.visible = r.weather === "rain"),
      (this.snow.visible = r.weather === "snow"),
      this.rain.visible)
    ) {
      this.rain.position.set(o.position.x, 0, o.position.z);
      let w = this.rain.geometry.attributes.position,
        L = w.array;
      for (let E = 0; E < L.length; E += 6)
        if (((L[E + 1] -= e * 34), (L[E + 4] -= e * 34), L[E + 4] < o.position.y - 25 || L[E + 4] < -1)) {
          let T = o.position.y + 20 + Math.random() * 15;
          ((L[E + 1] = T), (L[E + 4] = T - 0.9));
        }
      w.needsUpdate = !0;
    }
    if (this.snow.visible) {
      this.snow.position.set(o.position.x, 0, o.position.z);
      let w = this.snow.geometry.attributes.position,
        L = w.array;
      for (let E = 0; E < L.length; E += 3)
        ((L[E + 1] -= e * (1.4 + (E % 7) * 0.12)),
          (L[E] += Math.sin(a + E) * e * 0.4),
          L[E + 1] < -0.5 && (L[E + 1] = o.position.y + 15 + Math.random() * 10));
      w.needsUpdate = !0;
    }
  }
};
var L0 = P(ea(), 1);
var cs = 64,
  M7 = 32,
  E7 = 2.4,
  L7 = ["#e8e8e8", "#1c1c1c", "#9aa1a8", "#c0392b", "#1f4e79", "#2e5e3e", "#f1c40f", "#6b4f3a", "#f2f2ee"],
  C7 = ["hatch", "sedan", "sedan", "suv", "pickup", "sports"],
  T7 = (t) => Math.round((t - M7) / cs) * cs + M7,
  Og = class {
    constructor(e, a = 14) {
      this.blocked = e;
      this.count = a;
      this.group = new L0.Group();
      this.cars = [];
    }
    segFree(e, a, r, o) {
      let n = this.blocked();
      for (let i = 0; i <= 1; i += 0.125) {
        let s = e + (r - e) * i,
          l = a + (o - a) * i;
        if (l < -350 || Bl(s, l) || n.some((c) => Math.hypot(c.x - s, c.z - l) < c.r)) return !1;
      }
      return !0;
    }
    spawn(e, a) {
      for (let r = 0; r < 12; r++) {
        let o = T7(e + (Math.random() - 0.5) * 220),
          n = T7(a + (Math.random() - 0.5) * 220),
          i = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].filter(([h, u]) => this.segFree(o, n, o + h * cs, n + u * cs));
        if (!i.length || Math.hypot(o - e, n - a) < 30) continue;
        let [s, l] = i[Math.floor(Math.random() * i.length)],
          c = Rr(C7[Math.floor(Math.random() * C7.length)], L7[Math.floor(Math.random() * L7.length)]);
        this.group.add(c);
        let d = {
          obj: c,
          x: o,
          z: n,
          dx: s,
          dz: l,
          speed: 0,
          target: 9 + Math.random() * 5,
          next: { x: o + s * cs, z: n + l * cs },
        };
        this.cars.push(d);
        return;
      }
    }
    update(e, a, r) {
      for (; this.cars.length < this.count; ) {
        let o = this.cars.length;
        if ((this.spawn(a.x, a.z), this.cars.length === o)) break;
      }
      for (let o = this.cars.length - 1; o >= 0; o--) {
        let n = this.cars[o];
        if (Math.hypot(n.x - a.x, n.z - a.z) > 200) {
          (this.group.remove(n.obj), this.cars.splice(o, 1));
          continue;
        }
        let i = new L0.Vector3(n.x + n.dx * 7, 0, n.z + n.dz * 7),
          s = -n.dz * E7,
          l = n.dx * E7,
          c =
            r.some((u) => Math.hypot(u.x - (i.x + s), u.z - (i.z + l)) < 4.5) ||
            this.cars.some(
              (u) => u !== n && u.dx === n.dx && u.dz === n.dz && Math.hypot(u.x - i.x, u.z - i.z) < 5,
            ),
          d = c ? 0 : n.target;
        if (
          ((n.speed += (d - n.speed) * Math.min(1, e * (c ? 4 : 1))),
          (n.x += n.dx * n.speed * e),
          (n.z += n.dz * n.speed * e),
          (n.next.x - n.x) * n.dx + (n.next.z - n.z) * n.dz <= 0)
        ) {
          ((n.x = n.next.x), (n.z = n.next.z));
          let u = [
              [n.dx, n.dz],
              [n.dz, -n.dx],
              [-n.dz, n.dx],
            ].filter(([g, m]) => this.segFree(n.x, n.z, n.x + g * cs, n.z + m * cs)),
            [p, v] = u.length ? u[Math.floor(Math.random() * u.length)] : [-n.dx, -n.dz];
          ((n.dx = p), (n.dz = v), (n.next = { x: n.x + p * cs, z: n.z + v * cs }));
        }
        (n.obj.position.set(n.x + s, 0, n.z + l),
          (n.obj.rotation.y = L0.MathUtils.lerp(n.obj.rotation.y, Math.atan2(n.dx, n.dz), 1)),
          $s(n.obj, n.speed, e));
      }
    }
    colliders() {
      return this.cars.map((e) => ({ x: e.obj.position.x, z: e.obj.position.z, r: 2 }));
    }
  };
var le = P(ea(), 1);
var xd = [
    { id: "capital", name: "Capital Quarter", color: "#ffc27a" },
    { id: "market", name: "Market City", color: "#ff9a3c" },
    { id: "tech", name: "Tech City", color: "#4da3ff" },
    { id: "creator", name: "Creator City", color: "#c792ea" },
    { id: "play", name: "Play City", color: "#45e0ae" },
    { id: "learn", name: "Learn City", color: "#7fd1ff" },
    { id: "faith", name: "Faith & Culture District", color: "#e6d3a3" },
  ],
  C0 = (t) => xd.find((e) => e.id === t)?.name || t;
var Xx = [
    "\u2605",
    "\u25C6",
    "\u25CF",
    "\u25B2",
    "\u2726",
    "\u2600",
    "\u263E",
    "\u26A1",
    "\u273F",
    "\u2756",
    "\u2B22",
    "\u265E",
    "\u2693",
    "\u{1F33F}",
    "\u{1F985}",
    "\u{1F981}",
    "\u{1F54A}",
    "\u{1F525}",
    "\u{1F4A1}",
    "\u{1F30A}",
    "\u{1F680}",
    "\u{1F4D8}",
    "\u2699",
    "\u{1F333}",
  ],
  Jx = [
    "#2f6fe0",
    "#ff9a3c",
    "#45e0ae",
    "#c792ea",
    "#e5484d",
    "#ffd23f",
    "#7fd1ff",
    "#2f5d50",
    "#b06ad9",
    "#e05a8a",
    "#8b5a2b",
    "#1b1d22",
  ],
  Zs = { party: 5e3, nominate: 1e3, proposal: 500 },
  sc = {
    name: 32,
    short: 6,
    slogan: 80,
    manifesto: 1500,
    statement: 400,
    proposal: 120,
    proposalBody: 800,
    parties: 60,
    openProposals: 3,
  };
var S7 = [
  "One verified citizen = one vote. Verified means an account with an email or Google sign-in, at least one day old, with no ban.",
  "Each citizen votes for the Mayor of their home city and for one party for Parliament. You choose your home city once per election.",
  "Parties and candidates must be Fyrus passport holders. One party per citizen.",
  "No real-world parties, politicians or slogans. No hate, threats or lies about other citizens.",
  "Buying or selling votes, or making extra accounts to vote, means disqualification and a ban.",
  "Elections choose Mayors and Members of Parliament. Courts and payment disputes stay with Fyrus judges, not votes.",
  "Proposals are advisory: they show the Ministries what citizens want. Taxes stay within the Constitution.",
];
var oe = P(ea(), 1);
var Qx = (t, e, a, r, o, n, i, s, l) => ({
  id: t,
  name: e,
  role: a,
  x: r,
  z: o,
  wander: 0.3,
  outfit: {
    skin: la[(t.length * 5) % la.length],
    hair: t.length % 2 ? "short" : "long",
    hairColor: "#2a1a12",
    top: n,
    bottom: "#222831",
    shoes: "#111111",
  },
  persona: i,
  greeting: s,
  quick: l,
});
function nR(t) {
  let e = Ui(t),
    a = document.createElement("canvas");
  ((a.width = 1280), (a.height = 720));
  let r = a.getContext("2d"),
    o = Date.now(),
    i = (ot().halls?.events || [])
      .filter((d) => d.hall === t && d.end > o)
      .sort((d, h) => d.start - h.start)[0],
    s = i && i.start <= o,
    l = r.createLinearGradient(0, 0, 1280, 720);
  if (
    (l.addColorStop(0, "#0b1730"),
    l.addColorStop(1, "#1b1033"),
    (r.fillStyle = l),
    r.fillRect(0, 0, 1280, 720),
    (r.fillStyle = e.color),
    r.fillRect(0, 0, 1280, 12),
    (r.font = "800 40px Sora, sans-serif"),
    r.fillText(e.name.toUpperCase(), 60, 90),
    (r.fillStyle = "#fff"),
    i)
  ) {
    ((r.fillStyle = s ? "#e5484d" : "rgba(255,255,255,.6)"),
      (r.font = '800 34px "Plus Jakarta Sans", sans-serif'),
      r.fillText(
        s ? "\u25CF LIVE NOW" : "NEXT \xB7 " + new Date(i.start).toUTCString().slice(5, 22) + " UTC",
        60,
        200,
      ),
      (r.fillStyle = "#fff"),
      (r.font = "800 84px Sora, sans-serif"));
    let d = i.title.length > 24 ? i.title.slice(0, 23) + "\u2026" : i.title;
    (r.fillText(d, 60, 320),
      (r.fillStyle = "rgba(255,255,255,.75)"),
      (r.font = '600 38px "Plus Jakarta Sans", sans-serif'),
      r.fillText(
        `Hosted by ${i.hostName} \xB7 ${i.price ? q(i.price) : "free entry"} \xB7 ${i.going} going`,
        60,
        400,
      ),
      i.desc && r.fillText(i.desc.length > 60 ? i.desc.slice(0, 59) + "\u2026" : i.desc, 60, 470));
  } else
    ((r.font = "800 76px Sora, sans-serif"),
      r.fillText("Open hall", 60, 300),
      (r.fillStyle = "rgba(255,255,255,.75)"),
      (r.font = '600 40px "Plus Jakarta Sans", sans-serif'),
      r.fillText("Walk in, meet people, talk with voice.", 60, 380),
      r.fillText(`Book it for your event: ${q(e.hourly)} an hour.`, 60, 440));
  return new oe.CanvasTexture(a);
}
