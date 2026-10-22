/* Fyrus avatars v2 (v44) — stylised full-body characters.
   Built from smooth shapes (lathe, capsules, deformed spheres): proper proportions, knees and elbows, hands with
   fingers, a sculpted head with big expressive eyes, lashes, brows, nose, smile and ears, hair with volume, and
   clothes that read clearly (sleeves, collars, lapels, hoods, skirts, shoes with soles).
   Every option of the avatar editor still works: gender, height, face shape, eye colour, brows, beard, glasses,
   lips, 13 hairstyles, hair colour, top/bottom styles and all colours. Geometries are shared between avatars. */
var AV2 = (() => {
  const G = {};
  const once = (k, f) => G[k] || (G[k] = f());
  /* LatheGeometry wants the profile from bottom to top, otherwise its faces point inwards */
  const lathe = (pts, seg = 20) => {
    const q = pts[0][1] > pts[pts.length - 1][1] ? pts.slice().reverse() : pts;
    return new U.LatheGeometry(q.map(([r, y]) => new U.Vector2(Math.max(0.0005, r), y)), seg);
  };
  const latheArc = (pts, seg, ps, pl) => {
    const q = pts[0][1] > pts[pts.length - 1][1] ? pts.slice().reverse() : pts;
    const g = new U.LatheGeometry(q.map(([r, y]) => new U.Vector2(Math.max(0.0005, r), y)), seg, ps, pl);
    return g;
  };
  /* a capsule-like limb from y=0 down to y=-len, radius r0 at the top and r1 at the bottom */
  const limb = (len, r0, r1, seg = 12) =>
    lathe(
      [
        [0.001, 0.0 + r0 * 0.6],
        [r0 * 0.7, r0 * 0.45],
        [r0, 0],
        [(r0 + r1) / 2 + 0.004, -len * 0.45],
        [r1, -len],
        [r1 * 0.7, -len - r1 * 0.45],
        [0.001, -len - r1 * 0.6],
      ],
      seg,
    );
  const head = () =>
    once("head", () => {
      const g = new U.SphereGeometry(0.118, 32, 24),
        p = g.attributes.position;
      for (let i = 0; i < p.count; i++) {
        let x = p.getX(i),
          y = p.getY(i),
          z = p.getZ(i);
        if (y < 0) {
          const k = 1 - 0.22 * Math.pow(-y / 0.118, 1.4);
          x *= k;
          z *= 0.92 + 0.08 * k;
        }
        if (z > 0) z *= 1.04;
        p.setXYZ(i, x, y, z);
      }
      g.computeVertexNormals();
      return g;
    });
  const hand = (side) =>
    once("hand" + side, () => {
      const parts = [];
      const palm = new U.SphereGeometry(0.04, 12, 10);
      palm.scale(0.95, 1.15, 0.5);
      palm.translate(0, -0.035, 0);
      parts.push(palm);
      for (let f = 0; f < 4; f++) {
        const c = new U.CapsuleGeometry(0.0095, f === 0 || f === 3 ? 0.04 : 0.05, 3, 6);
        c.translate((-0.026 + f * 0.0175) * side, -0.105 + (f === 0 || f === 3 ? 0.006 : 0), 0.002);
        parts.push(c);
      }
      const th = new U.CapsuleGeometry(0.011, 0.035, 3, 6);
      th.rotateZ(0.7 * side);
      th.translate(0.038 * side, -0.045, 0.012);
      parts.push(th);
      return merge(parts);
    });
  const shoe = () =>
    once("shoe", () => {
      const g = new U.SphereGeometry(0.06, 16, 10);
      g.scale(0.95, 0.75, 2.05);
      g.translate(0, 0.0, 0.045);
      const p = g.attributes.position;
      for (let i = 0; i < p.count; i++) if (p.getY(i) < -0.012) p.setY(i, -0.012);
      g.computeVertexNormals();
      return g;
    });
  const sole = () =>
    once("sole", () => {
      const g = new U.CylinderGeometry(0.06, 0.06, 0.022, 16);
      g.scale(0.98, 1, 2.1);
      g.translate(0, -0.02, 0.045);
      return g;
    });
  function merge(list) {
    let n = 0;
    const arr = list.map((g) => (g.index ? g.toNonIndexed() : g));
    arr.forEach((g) => (n += g.attributes.position.count));
    const P = new Float32Array(n * 3),
      N = new Float32Array(n * 3);
    let o = 0;
    arr.forEach((g) => {
      if (!g.attributes.normal) g.computeVertexNormals();
      P.set(g.attributes.position.array, o * 3);
      N.set(g.attributes.normal.array, o * 3);
      o += g.attributes.position.count;
    });
    const out = new U.BufferGeometry();
    out.setAttribute("position", new U.BufferAttribute(P, 3));
    out.setAttribute("normal", new U.BufferAttribute(N, 3));
    return out;
  }
  const torso = (f) =>
    once("torso" + f, () =>
      lathe(
        f
          ? [[0.001, -0.02], [0.15, -0.01], [0.14, 0.1], [0.128, 0.17], [0.145, 0.27], [0.158, 0.36], [0.155, 0.44], [0.142, 0.5], [0.1, 0.545], [0.05, 0.565], [0.001, 0.57]]
          : [[0.001, -0.02], [0.155, -0.01], [0.152, 0.1], [0.152, 0.2], [0.17, 0.32], [0.185, 0.42], [0.18, 0.49], [0.13, 0.545], [0.06, 0.57], [0.001, 0.575]],
        24,
      ),
    );
  const pelvis = (f) =>
    once("pelvis" + f, () => {
      const g = new U.SphereGeometry(0.16, 20, 12);
      g.scale(f ? 1.1 : 1, 0.62, 0.72);
      return g;
    });
  const flare = (top, bot, len, k) =>
    once("flare" + [top, bot, len, k].join(","), () =>
      lathe([[top, 0], [top + (bot - top) * 0.35, -len * 0.4], [bot, -len], [bot - 0.004, -len - 0.012]], 24),
    );
  const torusArc = (r, t, arc, k) => once("arc" + [r, t, arc].join(","), () => new U.TorusGeometry(r, t, 6, 14, arc));

  /* ------------------------------------------------------------------------------------------------ */
  function build(av) {
    const e = av.outfit,
      a = av.mats,
      f = e.gender === "f",
      add = (parent, geo, mat, x = 0, y = 0, z = 0, cast = true) => {
        const m = new U.Mesh(geo, mat);
        m.position.set(x, y, z);
        m.castShadow = cast;
        parent.add(m);
        return m;
      };
    av.hips.clear();
    av.legs = [];
    av.arms = [];
    av.knees = [];
    av.elbows = [];
    av.eyes = [];
    av.head = new U.Group();
    av.mask = null;
    av.face = null;
    av.shapeSig = [e.gender, e.topStyle, e.bottomStyle, e.hair, e.face, e.brows, e.beard, e.glasses, e.height].join("|");
    av.hips.position.y = 0.95;
    av.body.scale.setScalar((f ? 0.95 : 1) * (e.height || 1));
    const top = e.topStyle,
      bot = e.bottomStyle,
      longSleeve = top === "hoodie" || top === "jacket" || top === "suit" || top === "shirt" || top === "kurta",
      bareLegs = bot === "shorts" || bot === "skirt" || top === "dress",
      sh = f ? 0.88 : 1;

    /* pelvis + torso */
    const pv = add(av.hips, pelvis(f ? 1 : 0), top === "dress" ? a.top : a.bottom, 0, 0.02, 0);
    const to = add(av.hips, torso(f ? 1 : 0), a.top, 0, 0.04, 0);
    to.scale.set(sh, 1, 0.68);
    if (f)
      for (const s of [-1, 1]) {
        const b = add(av.hips, once("bust", () => new U.SphereGeometry(0.046, 14, 10)), a.top, 0.056 * s, 0.36, 0.064);
        b.scale.set(1.15, 0.8, 0.5);
      }
    /* belt line */
    if (top !== "dress" && top !== "kurta") {
      const belt = add(av.hips, once("belt", () => new U.TorusGeometry(0.15, 0.012, 6, 24)), bot === "skirt" ? a.bottom : a.top2, 0, 0.05, 0, false);
      belt.rotation.x = Math.PI / 2;
      belt.scale.set(f ? 1 : 1.02, 0.68, 1);
    }
    /* neck */
    add(av.hips, once("neck", () => limb(0.09, 0.05, 0.056, 10)), a.skin, 0, 0.69, -0.005);
    if (top === "tee" || top === "tank" || top === "dress") {
      const nl = add(av.hips, once("neckline", () => new U.TorusGeometry(0.06, 0.008, 6, 20)), a.top2, 0, 0.6, 0.01, false);
      nl.rotation.x = Math.PI / 2 - 0.25;
      nl.scale.set(sh * 1.1, 1, 0.9);
    }
    /* top details */
    if (top === "hoodie") {
      const hood = add(av.hips, once("hood", () => new U.TorusGeometry(0.1, 0.045, 8, 20, Math.PI)), a.top, 0, 0.6, -0.04);
      hood.rotation.set(-0.35, 0, Math.PI);
      const pk = add(av.hips, once("pocket", () => new U.BoxGeometry(0.2, 0.09, 0.02)), a.top2, 0, 0.18, 0.105);
      pk.scale.x = sh;
      for (const s of [-1, 1]) add(av.hips, once("string", () => new U.CylinderGeometry(0.004, 0.004, 0.13, 4)), a.white, 0.03 * s, 0.5, 0.115, false);
    }
    if (top === "jacket" || top === "suit") {
      add(av.hips, once("shirtfront", () => new U.BoxGeometry(0.085, 0.42, 0.02)), a.white, 0, 0.38, 0.1, false);
      for (const s of [-1, 1]) {
        const l = add(av.hips, once("lapel", () => new U.BoxGeometry(0.075, 0.46, 0.022)), a.top2, 0.068 * s * sh, 0.36, 0.108, false);
        l.rotation.z = -0.13 * s;
        l.rotation.y = 0.12 * s;
      }
      if (top === "suit") {
        const t = add(av.hips, once("tie", () => { const g = new U.CylinderGeometry(0.018, 0.026, 0.3, 4); g.rotateY(Math.PI / 4); g.scale(1, 1, 0.35); return g; }), a.tie, 0, 0.4, 0.118, false);
        add(av.hips, once("knot", () => new U.SphereGeometry(0.016, 8, 6)), a.tie, 0, 0.55, 0.115, false);
        t.position.y = 0.4;
      }
    }
    if (top === "shirt" || top === "suit" || top === "kurta")
      for (const s of [-1, 1]) {
        const c = add(av.hips, once("collar", () => new U.BoxGeometry(0.06, 0.035, 0.012)), top === "suit" ? a.white : a.top2, 0.035 * s, 0.6, 0.075, false);
        c.rotation.set(-0.5, 0.5 * s, 0.55 * s);
      }
    if (top === "shirt" || top === "kurta") {
      add(av.hips, once("placket", () => new U.BoxGeometry(0.018, top === "kurta" ? 0.24 : 0.46, 0.008)), a.top2, 0, top === "kurta" ? 0.48 : 0.36, 0.112, false);
      for (let i = 0; i < (top === "kurta" ? 3 : 5); i++) add(av.hips, once("button", () => new U.SphereGeometry(0.006, 6, 4)), a.white, 0, 0.56 - i * 0.09, 0.118, false);
    }
    if (top === "kurta") {
      const k = add(av.hips, flare(0.155, 0.2, 0.5, 1), a.top, 0, 0.0, 0);
      k.scale.set(sh, 1, 0.75);
    }
    if (top === "dress") {
      const d = add(av.hips, flare(0.14, 0.3, 0.52, 2), a.top, 0, 0.06, 0);
      d.scale.set(1, 1, 0.82);
    }
    if (bot === "skirt" && top !== "dress") {
      const s = add(av.hips, flare(0.155, 0.27, 0.4, 3), a.bottom, 0, 0.06, 0);
      s.scale.set(1, 1, 0.82);
    }

    /* legs: hip joint -> knee -> foot */
    for (const s of [-1, 1]) {
      const g = new U.Group();
      g.position.set((f ? 0.088 : 0.092) * s, -0.04, 0);
      const wide = bot === "shalwar";
      const thighMat = bareLegs && bot !== "shorts" ? a.skin : a.bottom;
      add(g, once("thigh" + (wide ? "w" : f ? "f" : "m"), () => limb(0.43, wide ? 0.1 : f ? 0.082 : 0.085, wide ? 0.088 : 0.062, 12)), thighMat);
      if (bot === "shorts") {
        const c = add(g, once("shortcuff", () => new U.CylinderGeometry(0.083, 0.08, 0.04, 12)), a.bottom, 0, -0.25, 0, false);
        c.scale.set(1.05, 1, 1.05);
      }
      const knee = new U.Group();
      knee.position.y = -0.43;
      const shinMat = bareLegs ? a.skin : a.bottom;
      add(knee, once("shin" + (wide ? "w" : "n"), () => limb(0.41, wide ? 0.088 : 0.062, wide ? 0.07 : 0.043, 12)), shinMat);
      if (wide) add(knee, once("cuff", () => new U.CylinderGeometry(0.052, 0.056, 0.05, 12)), a.top2, 0, -0.39, 0, false);
      if (bot === "jeans") {
        const h = add(knee, once("hem", () => new U.CylinderGeometry(0.05, 0.052, 0.03, 12)), a.top2, 0, -0.395, 0, false);
        h.material = a.bottom;
      }
      const foot = new U.Group();
      foot.position.y = -0.44;
      add(foot, shoe(), a.shoes);
      add(foot, sole(), a.white, 0, 0, 0, false);
      knee.add(foot);
      g.add(knee);
      av.legs.push(g);
      av.knees.push(knee);
      av.hips.add(g);
    }

    /* arms: shoulder -> elbow -> hand */
    for (const s of [-1, 1]) {
      const g = new U.Group();
      g.position.set((f ? 0.16 : 0.19) * s, 0.5, 0);
      const sleeveMat = top === "tank" || top === "dress" ? a.skin : a.top;
      add(g, once("shoulder" + (f ? "f" : "m"), () => { const q = new U.SphereGeometry(f ? 0.047 : 0.056, 14, 10); q.scale(1, 0.9, 1); return q; }), top === "tank" || top === "dress" ? a.skin : a.top, 0, -0.005, 0);
      add(g, once("upperarm" + (f ? "f" : "m"), () => limb(0.27, f ? 0.046 : 0.053, f ? 0.038 : 0.044, 10)), longSleeve ? a.top : a.skin);
      if (top === "tee") add(g, once("teesleeve", () => limb(0.12, 0.058, 0.054, 12)), a.top, 0, 0, 0);
      const el = new U.Group();
      el.position.y = -0.27;
      add(el, once("forearm" + (f ? "f" : "m"), () => limb(0.24, f ? 0.038 : 0.044, f ? 0.03 : 0.034, 10)), longSleeve ? a.top : a.skin);
      if (top === "jacket" || top === "suit") add(el, once("wcuff", () => new U.CylinderGeometry(0.037, 0.037, 0.03, 10)), a.white, 0, -0.235, 0, false);
      if (top === "hoodie") add(el, once("rib", () => new U.CylinderGeometry(0.036, 0.034, 0.035, 10)), a.top2, 0, -0.23, 0, false);
      const hd = add(el, hand(-s), a.skin, 0, -0.255, 0);
      hd.rotation.y = -s * 0.35;
      g.add(el);
      av.arms.push(g);
      av.elbows.push(el);
      av.hips.add(g);
      void sleeveMat;
    }

    /* head */
    const hijab = e.hair === "hijab";
    av.head.position.y = 0.83;
    av.head.scale.setScalar(1.14);
    av.hips.add(av.head);
    const p = { oval: [0.95, 1.12, 1], round: [1.02, 1.04, 1.02], long: [0.9, 1.2, 0.98], square: [1.02, 1.08, 1] }[e.face] || [0.95, 1.12, 1];
    const hm = add(av.head, head(), a.skin);
    hm.scale.set(p[0], p[1], p[2]);
    if (e.face === "square") {
      const j = add(av.head, once("jaw", () => { const g = new U.SphereGeometry(0.075, 14, 8); g.scale(1.25, 0.6, 1); return g; }), a.skin, 0, -0.075, 0.025);
      j.castShadow = false;
    }
    /* ears */
    for (const s of [-1, 1]) {
      const ear = add(av.head, once("ear", () => { const g = new U.SphereGeometry(0.028, 10, 8); g.scale(0.42, 1, 0.75); return g; }), a.skin, 0.112 * p[0] * s, -0.005, -0.005, false);
      ear.rotation.y = 0.3 * s;
      ear.visible = !hijab;
    }
    /* eyes: sclera, iris, pupil, sparkle, lash line */
    const fz = 0.104 * p[2];
    for (const s of [-1, 1]) {
      const eye = new U.Group();
      eye.position.set(0.041 * s * p[0], 0.012, fz);
      const sc = add(eye, once("sclera", () => { const g = new U.SphereGeometry(0.027, 16, 12); g.scale(1, f ? 1.12 : 1.02, 0.5); return g; }), a.eye, 0, 0, 0, false);
      sc.scale.y = f ? 1.06 : 1;
      add(eye, once("iris", () => { const g = new U.SphereGeometry(0.0175, 14, 10); g.scale(1, 1.05, 0.35); return g; }), a.iris, 0, -0.002, 0.009, false);
      add(eye, once("pupil", () => { const g = new U.SphereGeometry(0.0085, 10, 8); g.scale(1, 1.05, 0.3); return g; }), a.pupil, 0, -0.002, 0.0135, false);
      add(eye, once("spark", () => new U.SphereGeometry(0.0038, 6, 4)), a.spark || (a.spark = new U.MeshBasicMaterial({ color: "#ffffff" })), 0.006 * s, 0.006, 0.0158, false);
      const lash = add(eye, torusArc(0.026, f ? 0.0042 : 0.0028, Math.PI * 0.9), a.pupil, 0, 0.002, 0.004, false);
      lash.rotation.z = Math.PI * 0.05;
      lash.scale.set(1, f ? 1.12 : 1.02, 1);
      if (f) {
        const flick = add(eye, once("flick", () => new U.ConeGeometry(0.004, 0.014, 4)), a.pupil, 0.026 * s, 0.012, 0.004, false);
        flick.rotation.z = -1.2 * s;
      }
      av.head.add(eye);
      av.eyes.push(eye);
      /* eyebrow */
      const bt = e.brows === "thick" ? 0.0068 : e.brows === "thin" ? 0.0032 : 0.0048;
      const br = add(av.head, torusArc(0.03, bt, Math.PI * 0.55), a.hair, 0.043 * s * p[0], 0.026 + (f ? 0.024 : 0.02), fz + 0.004, false);
      br.rotation.z = Math.PI / 2 - Math.PI * 0.275 + (f ? -0.08 : 0.06) * s;
    }
    /* nose, mouth */
    const nose = add(av.head, once("nose", () => { const g = new U.SphereGeometry(0.016, 10, 8); g.scale(0.85, 1, 1.15); return g; }), a.skin, 0, -0.022, fz + 0.016, false);
    nose.castShadow = false;
    const smile = add(av.head, torusArc(0.022, f ? 0.0058 : 0.0048, Math.PI * 0.62), a.lips, 0, -0.045, fz - 0.002, false);
    smile.rotation.z = Math.PI + Math.PI * 0.19;
    if (f) {
      const lower = add(av.head, once("lowerlip", () => { const g = new U.SphereGeometry(0.014, 10, 8); g.scale(1.2, 0.5, 0.6); return g; }), a.lips, 0, -0.07, fz - 0.004, false);
      lower.castShadow = false;
    }
    /* beard */
    const bd = e.beard;
    if (bd === "stubble") {
      const x = add(av.head, once("stubble", () => new U.SphereGeometry(0.122, 20, 12, Math.PI * 0.05, Math.PI * 0.9, Math.PI * 0.55, Math.PI * 0.32)), a.stub || (a.stub = new U.MeshStandardMaterial({ color: e.hairColor, transparent: !0, opacity: 0.32, roughness: 1 })), 0, 0, 0, false);
      x.scale.set(p[0], p[1], p[2]);
      a.stub.color.set(e.hairColor);
    }
    if (bd === "short" || bd === "full") {
      const x = add(av.head, once("beard" + bd, () => new U.SphereGeometry(0.124, 20, 12, Math.PI * 0.05, Math.PI * 0.9, Math.PI * 0.6, bd === "full" ? Math.PI * 0.4 : Math.PI * 0.28)), a.hair, 0, 0, 0, false);
      x.scale.set(p[0] * 1.02, p[1] * (bd === "full" ? 1.1 : 1.03), p[2] * 1.05);
    }
    if (bd === "moustache" || bd === "short" || bd === "full") {
      const m = add(av.head, torusArc(0.022, 0.006, Math.PI * 0.6), a.hair, 0, -0.033, fz + 0.006, false);
      m.rotation.z = Math.PI * 0.2;
    }
    /* glasses */
    const gl = e.glasses;
    if (gl && gl !== "none") {
      for (const s of [-1, 1]) {
        if (gl === "round") add(av.head, once("gring", () => new U.TorusGeometry(0.03, 0.0035, 6, 20)), a.glass, 0.041 * s * p[0], 0.012, fz + 0.022, false);
        else {
          const w = add(av.head, once("glens", () => new U.BoxGeometry(0.064, 0.042, 0.006)), gl === "shades" ? a.glass : a.lens, 0.041 * s * p[0], 0.012, fz + 0.022, false);
          void w;
          if (gl === "square") add(av.head, once("gbar", () => new U.BoxGeometry(0.068, 0.005, 0.007)), a.glass, 0.041 * s * p[0], 0.034, fz + 0.022, false);
        }
        add(av.head, once("gtemple", () => new U.BoxGeometry(0.004, 0.004, 0.12)), a.glass, 0.108 * s * p[0], 0.016, 0.04, false);
      }
      add(av.head, once("gbridge", () => new U.BoxGeometry(0.02, 0.004, 0.004)), a.glass, 0, 0.018, fz + 0.022, false);
    }
    av.head.add(av.acc);
    hair(av, p);
    av.maskOn && av.setMask(!0);
    av.photoUrl && av.setPhoto(av.photoUrl);
  }

  /* ------------------------------------------------------------------------------------------------ */
  function hair(av, p) {
    p = p || [0.95, 1.12, 1];
    av.head.remove(av.hairGroup);
    av.hairGroup = new U.Group();
    const e = av.outfit,
      a = av.mats.hair,
      H = av.hairGroup,
      o = e.hair,
      put = (geo, mat, x, y, z, sx = 1, sy = 1, sz = 1, rx = 0, ry = 0, rz = 0) => {
        const m = new U.Mesh(geo, mat || a);
        m.position.set(x, y, z);
        m.scale.set(sx, sy, sz);
        m.rotation.set(rx, ry, rz);
        m.castShadow = true;
        H.add(m);
        return m;
      };
    /* a cap of hair that hugs the skull and leaves the face open:
       a dome above the hairline + a band round the sides and back with a window for the face (+z = front) */
    const capGeo = (low, gap) =>
      once("cap" + low + "," + gap, () => merge([
        new U.SphereGeometry(0.124, 28, 8, 0, Math.PI * 2, 0, Math.PI * 0.36),
        new U.SphereGeometry(0.124, 28, 10, Math.PI / 2 + gap / 2, Math.PI * 2 - gap, Math.PI * 0.36, Math.PI * (low - 0.36)),
      ]));
    const cap = (k = 1.06, low = 0.62) => put(capGeo(low, 2.35), a, 0, 0.012, -0.004, p[0] * k, p[1] * k, p[2] * k);
    /* extra volume at the back of the head */
    const back = (len = 0.06) =>
      put(once("hback" + len, () => new U.SphereGeometry(0.126, 22, 14, Math.PI * 1.05, Math.PI * 0.9, Math.PI * 0.3, Math.PI * 0.45 + len)), a, 0, 0, -0.004, p[0] * 1.04, p[1] * 1.02, p[2] * 1.04);
    const fringe = (side = 0) => {
      const f = put(once("fringe", () => { const g = new U.SphereGeometry(0.06, 14, 10); g.scale(1.7, 0.55, 0.9); return g; }), a, 0.012 + side * 0.03, 0.09, 0.06, 1, 1, 1, -0.5, 0, -0.28 - side * 0.25);
      return f;
    };
    if (o === "bald") {
      av.head.add(H);
      return;
    }
    if (o === "hijab") {
      const hj = av.mats.top;
      put(once("hijabhead", () => merge([new U.SphereGeometry(0.136, 26, 8, 0, Math.PI * 2, 0, Math.PI * 0.4), new U.SphereGeometry(0.136, 26, 12, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5, Math.PI * 0.4, Math.PI * 0.42)])), hj, 0, 0.004, -0.006, p[0], p[1] * 1.06, p[2] * 1.05);
      put(once("hijabframe", () => new U.TorusGeometry(0.118, 0.016, 8, 30, Math.PI * 1.25)), hj, 0, -0.005, 0.04, p[0], p[1] * 1.08, 1, -0.12, 0, -Math.PI * 0.125);
      put(once("hijabdrape", () => lathe([[0.1, 0], [0.12, -0.07], [0.16, -0.17], [0.19, -0.23]], 22)), hj, 0, -0.1, -0.01, 1, 1, 0.9);
      av.head.add(H);
      return;
    }
    if (o === "buzz") {
      put(once("buzz", () => new U.SphereGeometry(0.121, 26, 16, 0, Math.PI * 2, 0, Math.PI * 0.56)), a, 0, 0.008, -0.003, p[0] * 1.02, p[1] * 1.02, p[2] * 1.02);
      av.head.add(H);
      return;
    }
    if (o === "cap") {
      cap(1.04, 0.5);
      back(0.0);
      const t = av.mats.top;
      put(once("capdome", () => new U.SphereGeometry(0.132, 26, 14, 0, Math.PI * 2, 0, Math.PI * 0.48)), t, 0, 0.022, -0.006, p[0], p[1] * 0.98, p[2]);
      put(once("capbill", () => { const g = new U.CylinderGeometry(0.1, 0.1, 0.012, 20, 1, false, -Math.PI / 2, Math.PI); g.scale(1, 1, 0.85); return g; }), t, 0, 0.045, 0.06, 1, 1, 1, 0.12, 0, 0);
      put(once("capbutton", () => new U.SphereGeometry(0.012, 8, 6)), t, 0, 0.152, -0.004);
      av.head.add(H);
      return;
    }
    if (o === "afro") {
      put(once("afro", () => { const g = new U.IcosahedronGeometry(0.2, 3); const q = g.attributes.position; for (let i = 0; i < q.count; i++) { const n = 1 + 0.035 * Math.sin(q.getX(i) * 80) * Math.cos(q.getY(i) * 70) * Math.sin(q.getZ(i) * 60); q.setXYZ(i, q.getX(i) * n, q.getY(i) * n, q.getZ(i) * n); } g.computeVertexNormals(); return g; }), a, 0, 0.09, -0.07, 1, 0.84, 0.82);
      av.head.add(H);
      return;
    }
    if (o === "mohawk") {
      put(once("buzz", () => new U.SphereGeometry(0.121, 26, 16, 0, Math.PI * 2, 0, Math.PI * 0.56)), a, 0, 0.008, -0.003, p[0] * 1.02, p[1] * 1.02, p[2] * 1.02);
      for (let i = 0; i < 6; i++) put(once("spike", () => { const g = new U.SphereGeometry(0.04, 10, 8); g.scale(0.45, 1.3, 0.9); return g; }), a, 0, 0.13 + Math.sin((i / 5) * Math.PI) * 0.02, 0.085 - i * 0.04, 1, 1, 1, -0.4 + i * 0.18);
      av.head.add(H);
      return;
    }
    /* the rest start from a full cap */
    cap(o === "curly" ? 1.08 : 1.06, o === "long" || o === "braids" || o === "ponytail" || o === "bun" ? 0.66 : 0.6);
    if (o === "short") {
      back(0.02);
      fringe(0);
      put(once("tuft", () => { const g = new U.SphereGeometry(0.05, 12, 8); g.scale(1.2, 0.6, 1); return g; }), a, -0.04, 0.12, 0.02, 1, 1, 1, -0.2, 0, 0.3);
    }
    if (o === "side") {
      back(0.02);
      put(once("sideswoop", () => { const g = new U.SphereGeometry(0.075, 16, 10); g.scale(1.6, 0.55, 1.05); return g; }), a, 0.025, 0.105, 0.04, 1, 1, 1, -0.35, 0.1, -0.42);
      put(once("sidepart", () => { const g = new U.SphereGeometry(0.05, 12, 8); g.scale(1.1, 0.5, 1.4); return g; }), a, -0.07, 0.1, -0.01, 1, 1, 1, 0, 0, 0.5);
    }
    if (o === "curly") {
      back(0.03);
      for (let i = 0; i < 26; i++) {
        const t = (i / 26) * Math.PI * 2,
          ring = i % 2,
          r = ring ? 0.1 : 0.122,
          x = Math.cos(t) * r * p[0],
          z = Math.sin(t) * r * p[2] - 0.01;
        if (z > 0.08 && Math.abs(x) < 0.06) continue;
        put(once("curl", () => new U.IcosahedronGeometry(0.032, 1)), a, x, 0.065 + ring * 0.05 + (i % 3) * 0.008, z, 1, 1, 1, i, i * 2, 0);
      }
    }
    if (o === "long" || o === "braids") {
      back(0.1);
      if (o === "long") {
        put(once("longback", () => latheArc([[0.1, 0.02], [0.128, -0.05], [0.13, -0.18], [0.12, -0.3], [0.1, -0.34]], 18, Math.PI / 2 + 0.25, Math.PI - 0.5)), a, 0, -0.02, -0.01, p[0] * 1.02, 1, 0.85);
        for (const s of [-1, 1]) put(once("lock", () => limb(0.24, 0.032, 0.022, 10)), a, 0.098 * s * p[0], 0.06, 0.04, 1, 1, 0.75, 0.05, 0, 0.06 * s);
      } else {
        for (const s of [-1, 1]) {
          for (let k = 0; k < 7; k++) put(once("plait", () => { const g = new U.SphereGeometry(0.025, 10, 8); g.scale(1, 1.25, 1); return g; }), a, 0.085 * s * p[0], -0.06 - k * 0.042, 0.035 - k * 0.002, 1 - k * 0.05, 1, 1 - k * 0.05);
          put(once("tie", () => new U.SphereGeometry(0.012, 8, 6)), av.mats.top, 0.085 * s * p[0], -0.36, 0.022);
        }
      }
      fringe(-0.6);
    }
    if (o === "ponytail") {
      back(0.04);
      fringe(0.5);
      put(once("ptie", () => new U.TorusGeometry(0.022, 0.008, 6, 12)), av.mats.top, 0, 0.07, -0.13, 1, 1, 1, 0.5, 0, 0);
      put(once("tail", () => limb(0.28, 0.04, 0.016, 10)), a, 0, 0.07, -0.145, 1, 1, 1, 0.35, 0, 0);
    }
    if (o === "bun") {
      back(0.04);
      fringe(-0.4);
      put(once("bunball", () => new U.SphereGeometry(0.06, 16, 12)), a, 0, 0.14, -0.08);
      put(once("buntie", () => new U.TorusGeometry(0.035, 0.007, 6, 14)), av.mats.top, 0, 0.115, -0.07, 1, 1, 1, -0.9, 0, 0);
    }
    av.head.add(H);
  }
  return { build, hair };
})();
