function I7(t) {
  if (t.startsWith("class:")) return sR(t.slice(6));
  if (t.startsWith("hall:")) return H7(t.slice(5));
  if (t.startsWith("svc:")) return B7(t.slice(4));
  let e = new le.Group(),
    a = [],
    r = [],
    o = [],
    n = 30,
    i = 26,
    s = 9,
    l = (c, d) => {};
  if (t === "parliament") {
    ((n = 34),
      (i = 30),
      (s = 11),
      er(e, n, i, s, "#e9e2d4", "#8a6a4a", "wood", 1.1),
      st(e, 10, 0.8, 4, 0, 0.4, -i / 2 + 3, A7),
      st(e, 4, 1.3, 1.2, 0, 1.45, -i / 2 + 3.6, z7),
      r.push({ x: 0, z: -i / 2 + 3, hx: 5, hz: 2 }));
    let c = Eo(et("#7a2a2a", 0.6));
    (c.scale.setScalar(1.4), c.position.set(0, 0.8, -i / 2 + 2.2), e.add(c));
    let d = Gl(),
      h = ot().politics,
      u,
      p;
    if (h) {
      let m = (k) => h.parties.find((b) => b.id === k)?.short || (k ? h.office?.names?.[k] || "" : "Ind."),
        f = xd.map((k) => {
          let b = h.office?.mayors?.[k.id];
          return [k.name.replace(" & Culture District", ""), b ? `${b.name} (${m(b.party)})` : "\u2014"];
        });
      u = ua(
        Ba(
          h.office ? `MAYORS \xB7 ELECTION ${h.office.n}` : "MAYORS \xB7 FIRST ELECTION",
          f,
          "#14202f",
          "#ffc27a",
        ),
        6,
        6.4,
      );
      let y = Object.entries(h.partyVotes || {})
          .sort((k, b) => b[1] - k[1])
          .slice(0, 6)
          .map(([k, b]) => [`${m(k)} \xB7 ${(h.projected || {})[k] || 0} seats`, `${b} votes`]),
        x =
          h.phase === "voting"
            ? y.length
              ? y
              : [
                  ["Polls are open", ""],
                  ["Walk to the ballot box", ""],
                ]
            : [
                ["Nominations open", ""],
                [`${h.parties.length} parties registered`, ""],
                [`${h.cands.length} candidates so far`, ""],
              ];
      ((p = ua(
        Ba(`ELECTION ${h.n} \xB7 ${h.phase === "voting" ? "LIVE" : "NOMINATIONS"}`, x, "#14202f", "#b06ad9"),
        6,
        0.9 + x.length * 0.6 + 1.1,
      )),
        h.parties.slice(0, 8).forEach((k, b) => {
          let w = document.createElement("canvas");
          ((w.width = 256), (w.height = 384));
          let L = w.getContext("2d");
          ((L.fillStyle = k.color),
            L.fillRect(0, 0, 256, 384),
            (L.fillStyle = k.color2),
            (L.font = "140px sans-serif"),
            (L.textAlign = "center"),
            L.fillText(k.symbol, 128, 190),
            (L.font = "700 44px Sora, sans-serif"),
            L.fillText(k.short, 128, 290),
            (L.font = '600 20px "Plus Jakarta Sans", sans-serif'),
            L.fillText(k.name.slice(0, 22), 128, 340));
          let E = b % 2 ? 1 : -1,
            T = -8 + Math.floor(b / 2) * 5,
            S = new le.Mesh(
              new le.PlaneGeometry(1.8, 2.7),
              new le.MeshStandardMaterial({
                map: new le.CanvasTexture(w),
                roughness: 0.8,
                side: le.DoubleSide,
              }),
            );
          (S.position.set(E * (n / 2 - 0.08), 5.5, T),
            (S.rotation.y = (-E * Math.PI) / 2),
            e.add(S),
            a.push({
              pos: new le.Vector3(E * (n / 2 - 2), 0, T),
              radius: 2.2,
              label: `${k.name} \u2014 read the manifesto`,
              action: "politics",
              payload: "parties:" + k.id,
              obj: S,
            }));
        }));
    } else {
      let m = Kp(),
        f = au(d).slice(0, 6);
      ((u = ua(
        Ba(
          "CABINET OF FYRUS",
          m.slice(0, 7).map((y) => [y.ministry?.name || "", y.name]),
          "#14202f",
          "#ffc27a",
        ),
        6,
        6.2,
      )),
        (p = ua(
          Ba(
            `ELECTION \xB7 WEEK ${d}`,
            f.map((y, x) => [`${x + 1}. ${y.name}`, `${y.votes} votes`]),
            "#14202f",
            "#4da3ff",
          ),
          6,
          5.6,
        )));
    }
    (u.position.set(-8, 5.2, -i / 2 + 0.05), e.add(u), p.position.set(8, 5.2, -i / 2 + 0.05), e.add(p));
    for (let m of [-3.4, 3.4]) {
      let f = new le.Mesh(new le.CylinderGeometry(0.05, 0.05, 4, 8), T0);
      (f.position.set(m, 2.8, -i / 2 + 1.2),
        e.add(f),
        st(e, 1.4, 0.9, 0.02, m + 0.72, 4.2, -i / 2 + 1.2, et(m < 0 ? "#2f6fe0" : "#ff9a3c", 0.8)));
    }
    for (let m = 0; m < 3; m++) {
      let f = 7 + m * 2.6;
      for (let y = 0; y < 9 + m * 2; y++) {
        let x = -1.1 + (y / (8 + m * 2)) * 2.2,
          k = Math.sin(x) * f,
          b = -i / 2 + 4 + Math.cos(x) * f,
          w = st(e, 1.3, 0.8, 0.5, k, 0.4 + m * 0.35, b - 0.45, z7);
        w.rotation.y = x + Math.PI;
        let L = Eo(ey);
        (L.position.set(k + Math.sin(x) * 0.4, m * 0.35, b + Math.cos(x) * 0.4 - 0.45),
          (L.rotation.y = x + Math.PI),
          e.add(L),
          m > 0 && st(e, 1.6, m * 0.35, 1.6, k, m * 0.175, b, et("#8a6a4a", 0.8)));
      }
    }
    let v = new le.Mesh(
      new le.CircleGeometry(5, 40),
      new le.MeshStandardMaterial({ color: "#fff", emissive: "#e8f2ff", emissiveIntensity: 1 }),
    );
    ((v.rotation.x = Math.PI / 2), v.position.set(0, s - 0.05, -2), e.add(v));
    let g = new le.Group();
    (st(g, 1.2, 1.1, 0.8, 0, 0.55, 0, j7),
      st(g, 1.26, 0.08, 0.86, 0, 1.12, 0, T0),
      g.position.set(6, 0, 7),
      e.add(g),
      r.push({ x: 6, z: 7, hx: 0.7, hz: 0.5 }),
      a.push({
        pos: new le.Vector3(6, 0, 8.4),
        radius: 2.2,
        label: "Ballot box \u2014 cast your vote",
        action: h ? "politics" : "nation",
        payload: h ? "vote" : "parliament",
        obj: g,
      }),
      a.push({
        pos: new le.Vector3(-8, 0, -i / 2 + 2.6),
        radius: 2.6,
        label: h ? "Mayors board \u2014 who runs each city" : "Cabinet board \u2014 see the ministers",
        action: h ? "politics" : "nation",
        payload: h ? "results" : "parliament",
      }),
      h &&
        a.push({
          pos: new le.Vector3(8, 0, -i / 2 + 2.6),
          radius: 2.6,
          label: "Election board \u2014 live results",
          action: "politics",
          payload: "election",
        }),
      o.push(
        Ug(
          "speaker",
          "Speaker Amina",
          "Speaker of Parliament",
          0,
          -i / 2 + 2.6,
          "#14202f",
          "You are Amina, Speaker of the Parliament of Fyrus. Explain the elections: citizens found parties (passport holders), stand for Mayor of their home city during nominations, then every verified citizen (email or Google account, a day old, no ban) votes once for Mayor of their home city and once for a party. The 21 seats of Parliament are shared out by party votes. Citizens can also publish yes/no proposals. No real-world parties or politicians; vote buying means disqualification. Open Elections & parties from the Republic menu.",
          "Welcome to Parliament. Citizens vote here every week.",
          ["How do elections work?", "Who are the ministers?"],
        ),
      ));
    for (let m = 0; m < 4; m++) {
      let f = ls();
      (f.position.set(m < 2 ? -n / 2 + 1.2 : n / 2 - 1.2, 0, m % 2 ? 6 : -4), e.add(f));
    }
  } else if (t === "bank") {
    ((n = 28),
      (i = 24),
      (s = 9),
      er(e, n, i, s, "#efe9dc", "#e2ddd3", "tile", 1.1),
      st(e, 18, 1.15, 1.2, 0, 0.58, -4, A7),
      st(e, 18.2, 0.08, 1.4, 0, 1.18, -4, T0),
      r.push({ x: 0, z: -4, hx: 9.2, hz: 0.8 }),
      st(e, 18, 1.4, 0.04, 0, 1.95, -4.2, j7));
    for (let g = 0; g < 4; g++) {
      let m = -6.75 + g * 4.5,
        f = qs();
      (f.position.set(m, 1.22, -4.3), (f.rotation.y = Math.PI), e.add(f));
      let y = ua(
        Ba(
          `WINDOW ${g + 1}`,
          [[["Buy FYC", "Balance", "Transfers", "Land loans"][g], "Open"]],
          "#14202f",
          "#d4a64a",
        ),
        1.6,
        0.66,
      );
      (y.position.set(m, 3, -4.18),
        e.add(y),
        a.push({
          pos: new le.Vector3(m, 0, -2.6),
          radius: 1.6,
          label: `Teller window ${g + 1} \u2014 FYC services`,
          action: "nation",
          payload: "bank",
        }));
    }
    let c = new le.Group();
    (c.position.set(0, 3, -i / 2 + 0.2), e.add(c));
    let d = new le.Mesh(new le.CylinderGeometry(2.6, 2.6, 0.5, 40), et("#9aa3ad", 0.25, 0.9));
    ((d.rotation.x = Math.PI / 2), c.add(d));
    let h = new le.Group();
    ((h.position.z = 0.35), c.add(h));
    for (let g = 0; g < 3; g++) {
      let m = new le.Mesh(new le.BoxGeometry(2.4, 0.14, 0.14), T0);
      ((m.rotation.z = (g / 3) * Math.PI), h.add(m));
    }
    for (let g = 0; g < 14; g++) {
      let m = new le.Mesh(new le.CylinderGeometry(0.35, 0.35, 0.08 + (g % 4) * 0.12, 20), T0);
      (m.position.set(-5 + (g % 7) * 1.6, 0.05 + ((g % 4) * 0.12) / 2, -i / 2 + 2 + Math.floor(g / 7)),
        e.add(m));
    }
    let u = ot(),
      p = ua(
        Ba(
          "FYRUS COIN \xB7 TODAY",
          [
            ["Treasury", q(u.treasury)],
            ["Transfer tax", "5%"],
            ["Bank packs", "Free in beta"],
            ["1 FYC", "In-city credit"],
          ],
          "#14202f",
          "#d4a64a",
        ),
        5.6,
        4.4,
      );
    (p.position.set(-n / 2 + 0.05, 4.2, 4), (p.rotation.y = Math.PI / 2), e.add(p));
    for (let g = 0; g < 2; g++) {
      let m = new le.Group();
      (st(m, 4, 0.45, 0.8, 0, 0.32, 0, ey),
        st(m, 4, 0.6, 0.15, 0, 0.75, -0.35, ey),
        m.position.set(n / 2 - 3.2, 0, 2 + g * 4),
        (m.rotation.y = -Math.PI / 2),
        e.add(m),
        r.push({ x: n / 2 - 3.2, z: 2 + g * 4, hx: 0.5, hz: 2 }));
    }
    let v = [0, 1, 2, 3, 4].map((g) => {
      let m = new le.Mesh(new le.CylinderGeometry(0.05, 0.08, 1, 8), T0);
      return (m.position.set(-4 + g * 2, 0.5, 2), e.add(m), m);
    });
    for (let g = 0; g < 4; g++)
      o.push(
        Ug(
          `teller${g}`,
          ["Omar", "Lina", "Yuki", "Theo"][g],
          "Bank teller",
          -6.75 + g * 4.5,
          -5.4,
          "#14202f",
          "You are a teller at the Central Bank of Fyrus. FYC (Fyrus Coin) is the in-city credit: earn it by selling, playing and quests; test packs are free in beta; plots pay a 5% transfer tax to the treasury. Never ask for card numbers or passwords.",
          "Good day! How can the Central Bank help?",
          ["How do I get FYC?", "What is the transfer tax?"],
        ),
      );
    l = (g) => {
      h.rotation.z += g * 0.3;
    };
  } else {
    ((n = 22), (i = 20), (s = 6), er(e, n, i, s, "#eef3f7", "#d9dde2", "tile", 1.2));
    for (let p = 0; p < 3; p++) {
      let v = -6 + p * 6;
      (st(e, 3.6, 1.05, 1, v, 0.53, -5, et("#ffffff", 0.4)),
        st(e, 3.7, 0.06, 1.1, v, 1.08, -5, et("#4da3ff", 0.4)));
      let g = qs();
      (g.position.set(v, 1.12, -5.2),
        (g.rotation.y = Math.PI),
        e.add(g),
        r.push({ x: v, z: -5, hx: 1.9, hz: 0.6 }),
        a.push({
          pos: new le.Vector3(v, 0, -3.6),
          radius: 1.6,
          label: `Counter ${p + 1} \u2014 passport and citizenship`,
          action: "nation",
          payload: "passport",
        }),
        o.push(
          Ug(
            `officer${p}`,
            ["Nina", "Sami", "Iris"][p],
            "Citizenship officer",
            v,
            -6.2,
            "#2f6fe0",
            "You are a citizenship officer at the Fyrus Citizen Center. Every visitor gets a free visa, a 2,500 FYC welcome grant and a home city chosen by interest (AI, commerce, creative, games, education or faith). The Fyrus passport is earned: reach two of level 5, owning land, or selling something, with a clean record. Passport holders vote, pay no transfer tax and can buy Capital Quarter land.",
            "Welcome to Fyrus! Visa or passport today?",
            ["How do I earn a passport?", "Which city is mine?"],
          ),
        ));
    }
    let c = new le.Group();
    (st(c, 1.8, 2.4, 1.6, 0, 1.2, 0, et("#2f6fe0", 0.5)),
      c.position.set(n / 2 - 1.6, 0, 3),
      e.add(c),
      r.push({ x: n / 2 - 1.6, z: 3, hx: 1, hz: 0.9 }),
      a.push({
        pos: new le.Vector3(n / 2 - 3.2, 0, 3),
        radius: 1.6,
        label: "Photo booth \u2014 passport photo",
        action: "nation",
        payload: "passport",
        obj: c,
      }));
    let d = ua(
      Ba(
        "VISA & PASSPORT",
        [
          ["Visitor visa", "Free"],
          ["Welcome grant", "2,500 FYC"],
          ["Passport", "Earned"],
          ["Passport perks", "Vote \xB7 0% tax"],
        ],
        "#0d1a2b",
        "#4da3ff",
      ),
      5,
      4,
    );
    (d.position.set(-n / 2 + 0.05, 3, 2), (d.rotation.y = Math.PI / 2), e.add(d));
    for (let p = 0; p < 6; p++) {
      let v = Eo(et("#4da3ff", 0.6));
      (v.position.set(-3 + (p % 3) * 1.2, 0, 3 + Math.floor(p / 3) * 1.4),
        (v.rotation.y = Math.PI),
        e.add(v));
    }
    let h = Ri(et("#ffffff", 0.4));
    (h.position.set(4, 0, 4), e.add(h));
    let u = ls();
    (u.position.set(-n / 2 + 1, 0, -i / 2 + 1), e.add(u));
  }
  return {
    group: e,
    interacts: a,
    bounds: { hx: n / 2 - 0.6, hz: i / 2 - 0.4 },
    spawn: new le.Vector3(0, 0, i / 2 - 2),
    npcs: o,
    dancers: [],
    blocks: r,
    tick: l,
  };
}
var Co = P(ea(), 1);
var lR = new Set(["rug", "rugr", "prayer", "art", "mirror"]);
function G7(t, e, a, r, o) {
  let n = new Co.Group(),
    i = iv(t),
    s = [],
    l = wh.find((f) => f.id === e.floor) || wh[0],
    c =
      e.floor === "tile" || e.floor === "marble"
        ? "tile"
        : e.floor === "carpet" || e.floor === "concrete"
          ? "concrete"
          : "wood";
  er(n, i.w, i.d, i.h, e.wall, l.color, c, 1.05);
  let d = new Co.Mesh(new Co.PlaneGeometry(i.w, i.h), et(e.accent || e.wall, 0.9));
  (d.position.set(0, i.h / 2, -i.d / 2 + 0.015), n.add(d));
  let h = new Co.MeshBasicMaterial({ color: "#cfe6f7" }),
    u = et("#f4f1ea", 0.6);
  for (let f of [-1, 1])
    for (let y = 0; y < (Oc(t) === "studio" ? 1 : 2); y++) {
      let x = Oc(t) === "studio" ? -0.5 : -i.d / 4 + y * (i.d / 2.2),
        k = new Co.Mesh(new Co.PlaneGeometry(1.8, 1.4), h);
      (k.position.set(f * (i.w / 2 - 0.02), 1.75, x),
        (k.rotation.y = (-f * Math.PI) / 2),
        n.add(k),
        st(n, 0.08, 0.08, 1.96, f * (i.w / 2 - 0.04), 1, x, u),
        st(n, 0.08, 0.08, 1.96, f * (i.w / 2 - 0.04), 2.5, x, u),
        st(n, 0.06, 1.5, 0.06, f * (i.w / 2 - 0.04), 1.75, x, u));
    }
  let p = ua(Ba(a.toUpperCase(), [[r, ""]], "#1b1d22", "#ffc27a"), 1.4, 0.5);
  (p.position.set(2.6, 2.2, i.d / 2 - 0.03), (p.rotation.y = Math.PI), n.add(p));
  let v = [];
  e.items.forEach((f, y) => {
    let x = $i[f.k];
    if (!x) return;
    let k = pi(f.k, f.c);
    if (
      (k.position.set(f.x, 0, f.z),
      (k.rotation.y = (f.r * Math.PI) / 180),
      (k.userData.idx = y),
      n.add(k),
      v.push(k),
      !lR.has(f.k))
    ) {
      let b = Math.abs(Math.sin((f.r * Math.PI) / 180)) > 0.5;
      s.push({ x: f.x, z: f.z, hx: (b ? x.d : x.w) / 2 + 0.1, hz: (b ? x.w : x.d) / 2 + 0.1 });
    }
  });
  let g = new Co.Mesh(
    new Co.RingGeometry(0.9, 1.05, 40),
    new Co.MeshBasicMaterial({ color: "#ffc27a", transparent: !0, opacity: 0.9, depthWrite: !1 }),
  );
  ((g.rotation.x = -Math.PI / 2),
    (g.position.y = 0.03),
    (g.visible = !1),
    (g.userData.noBlock = !0),
    n.add(g));
  let m = (f) => {
    let y = f === null ? void 0 : v.find((x) => x.userData.idx === f);
    if (((g.visible = !!y), y)) {
      let x = $i[y.userData.furn],
        k = Math.max(x.w, x.d) * 0.62 + 0.2;
      (g.scale.setScalar(k), g.position.set(y.position.x, 0.03, y.position.z));
    }
  };
  return (
    m(o),
    {
      group: n,
      interacts: [],
      bounds: { hx: i.w / 2 - 0.5, hz: i.d / 2 - 0.4 },
      spawn: new Co.Vector3(0, 0, i.d / 2 - 1.4),
      npcs: [],
      dancers: [],
      blocks: s,
      items: v,
      ring: g,
      select: m,
      house: !0,
      tick: (f, y) => {
        (R7(n, y), (g.rotation.z = y * 0.8));
      },
    }
  );
}
var Et = P(ea(), 1);
var ce = (t, e = 0.7, a = 0) => new Et.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  me = (t, e, a, r, o, n, i, s) => {
    let l = new Et.Mesh(new Et.BoxGeometry(e, a, r), s);
    return (l.position.set(o, n, i), (l.castShadow = !0), (l.receiveShadow = !0), t.add(l), l);
  },
  po = (t, e, a, r, o, n, i, s, l = 20) => {
    let c = new Et.Mesh(new Et.CylinderGeometry(e, a, r, l), s);
    return (c.position.set(o, n, i), (c.castShadow = !0), t.add(c), c);
  },
  bu = new Et.MeshStandardMaterial({
    color: "#2d3d4c",
    metalness: 0.6,
    roughness: 0.12,
    emissive: "#ffd9a0",
    emissiveIntensity: 0.05,
  });
Hn.push(bu);
var cR = ce("#f4f1ea", 0.6);
function ay(t) {
  let e = document.createElement("canvas");
  ((e.width = 128), (e.height = 32));
  let a = e.getContext("2d");
  for (let o = 0; o < 8; o++) ((a.fillStyle = o % 2 ? "#ffffff" : t), a.fillRect(o * 16, 0, 16, 32));
  return new Et.CanvasTexture(e);
}
function V7(t, e, a, r, o) {
  let n = new Et.MeshStandardMaterial({ color: e, emissive: e, emissiveIntensity: 0.5 });
  (me(t, a, a * 0.32, 0.25, 0, r, o, n), me(t, a * 0.32, a, 0.25, 0, r, o, n));
}
function dR(t) {
  let e = new Et.Group(),
    a = t.w || 24,
    r = t.d || 18,
    o = t.id === "pharmacy" ? 6 : t.id === "hospital" ? 14 : 10,
    n = new Et.Mesh(
      new Et.BoxGeometry(a, o, r),
      Ea({
        base: t.id === "library" ? "#e6dccb" : "#eceae4",
        tint: t.color,
        kind: t.id === "hospital" ? 1 : 2,
        h: o,
        seed: t.x * 0.01 + t.z * 0.003,
      }),
    );
  ((n.position.y = o / 2),
    (n.castShadow = !0),
    e.add(n),
    me(e, a + 0.6, 0.5, r + 0.6, 0, o + 0.25, 0, ce("#d8d2c6", 0.8)),
    me(e, 8, 0.3, 3.2, 0, 3.4, r / 2 + 1.6, ce(t.color, 0.5)));
  for (let s of [-3.7, 3.7]) po(e, 0.12, 0.12, 3.4, s, 1.7, r / 2 + 3, Kt.dark, 10);
  (me(e, 3.2, 2.8, 0.1, 0, 1.4, r / 2 + 0.06, bu), me(e, 10, 0.3, 4, 0, 0.15, r / 2 + 2, Kt.stone));
  let i = De(t.name.replace("Fyrus ", "").toUpperCase(), t.sub, t.color, Math.min(14, a - 4));
  if ((i.position.set(0, Math.min(o - 1.6, 6.2), r / 2 + 0.08), e.add(i), t.id === "hospital")) {
    V7(e, "#e5484d", 3, o + 2.2, r / 2 - 1);
    let s = new Et.Group();
    (me(s, 2.3, 2.4, 5.6, 0, 1.6, 0, cR),
      me(s, 2.34, 0.4, 5.64, 0, 1.6, 0, ce("#e5484d", 0.5)),
      me(s, 2.1, 0.9, 1.4, 0, 2.3, 2.3, bu),
      me(
        s,
        1.2,
        0.2,
        0.3,
        0,
        2.9,
        2.6,
        new Et.MeshStandardMaterial({ color: "#4da3ff", emissive: "#4da3ff", emissiveIntensity: 0.8 }),
      ));
    for (let [l, c] of [
      [-1.1, -1.8],
      [1.1, -1.8],
      [-1.1, 1.8],
      [1.1, 1.8],
    ]) {
      let d = po(s, 0.42, 0.42, 0.3, l, 0.42, c, ce("#1d1f22", 0.8), 14);
      d.rotation.z = Math.PI / 2;
    }
    (s.position.set(a / 2 - 3, 0, r / 2 + 5), e.add(s));
  }
  if (t.id === "police") {
    let s = Rr("sedan", "#f2f2ee");
    (s.position.set(-a / 2 + 3, 0, r / 2 + 5),
      e.add(s),
      me(
        e,
        1.2,
        0.2,
        0.3,
        -a / 2 + 3,
        1.75,
        r / 2 + 5,
        new Et.MeshStandardMaterial({ color: "#2f6fe0", emissive: "#2f6fe0", emissiveIntensity: 0.9 }),
      ),
      me(
        e,
        4,
        0.6,
        0.6,
        0,
        o + 0.8,
        r / 2 - 1,
        new Et.MeshStandardMaterial({ color: "#2f6fe0", emissive: "#2f6fe0", emissiveIntensity: 0.4 }),
      ));
  }
  if (t.id === "fire") {
    for (let c of [-7, 0, 7])
      if (c !== 0) {
        me(e, 5, 4.4, 0.15, c, 2.2, r / 2 + 0.1, ce("#c0392b", 0.5));
        for (let d = 0; d < 6; d++) me(e, 5, 0.06, 0.18, c, 0.5 + d * 0.7, r / 2 + 0.12, ce("#8b2a20", 0.6));
      }
    let s = new Et.Mesh(
      new Et.BoxGeometry(3, o + 6, 3),
      Ea({ base: "#c96f4a", tint: "#ff5a2a", kind: 2, h: o + 6, seed: 0.7 }),
    );
    (s.position.set(-a / 2 + 1.5, (o + 6) / 2, -r / 2 + 1.5), e.add(s));
    let l = new Et.Group();
    (me(l, 2.6, 2.6, 7.5, 0, 1.7, 0, ce("#d63a2a", 0.45, 0.2)),
      me(l, 2.4, 1, 1.8, 0, 2.5, 3.2, bu),
      me(l, 0.5, 0.3, 6.5, 0, 3.2, -0.6, ce("#c0c6cc", 0.4, 0.8)));
    for (let [c, d] of [
      [-1.2, -2.6],
      [1.2, -2.6],
      [-1.2, 2.4],
      [1.2, 2.4],
    ]) {
      let h = po(l, 0.55, 0.55, 0.35, c, 0.55, d, ce("#1d1f22", 0.8), 14);
      h.rotation.z = Math.PI / 2;
    }
    (l.position.set(7, 0, r / 2 + 5.5), e.add(l));
  }
  if (t.id === "post") {
    let s = new Et.Group();
    po(s, 0.45, 0.5, 1.6, 0, 0.8, 0, ce("#c0392b", 0.5));
    let l = new Et.Mesh(
      new Et.SphereGeometry(0.46, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      ce("#c0392b", 0.5),
    );
    ((l.position.y = 1.6),
      s.add(l),
      me(s, 0.5, 0.06, 0.1, 0, 1.25, 0.45, Kt.dark),
      s.position.set(5, 0, r / 2 + 3.5),
      e.add(s),
      me(e, a + 0.2, 0.6, 0.2, 0, o - 0.6, r / 2 + 0.05, ce("#ffd23f", 0.5)));
  }
  if (t.id === "library") {
    (me(e, 16, 0.4, 3, 0, 0.2, r / 2 + 3.4, Kt.stone), w0(e, 6, 13, r / 2 + 2.6, o - 1.4, 0.4));
    let s = new Et.Mesh(new Et.CylinderGeometry(0.01, 9, 2, 3), Kt.marble);
    ((s.rotation.z = Math.PI / 2),
      (s.rotation.y = Math.PI / 2),
      s.scale.set(1, 1, 0.3),
      s.position.set(0, o + 1, r / 2 + 2.4),
      e.add(s));
  }
  t.id === "pharmacy" && V7(e, "#45e0ae", 2.2, o + 1.6, r / 2 - 0.5);
  for (let s of [-a / 2 + 1.5, a / 2 - 1.5]) {
    let l = ya("#4f7f35", 0.9, t.x + s);
    (l.position.set(s, 0, r / 2 + 7), e.add(l));
    let c = os(1.8);
    (c.position.set(s, 0.035, r / 2 + 7), e.add(c));
  }
  return e;
}
function hR(t) {
  let e = new Et.Group(),
    a = t.w || 10,
    r = t.d || 9,
    o = 6.5;
  (me(
    e,
    a,
    o,
    r,
    0,
    o / 2,
    0,
    ce(["#e8dcc8", "#d8cfbf", "#efe9df", "#c9d3dc"][Math.abs(Math.round(t.x)) % 4], 0.85),
  ),
    me(e, a - 1.6, 2.6, 0.1, -0.6, 1.9, r / 2 + 0.05, bu),
    me(e, 1.6, 2.6, 0.12, a / 2 - 1.4, 1.4, r / 2 + 0.06, ce(t.color, 0.5)));
  let n = new Et.Mesh(
    new Et.BoxGeometry(a, 0.15, 2),
    new Et.MeshStandardMaterial({ map: ay(t.color), roughness: 0.8 }),
  );
  (n.position.set(0, 3.6, r / 2 + 1), (n.rotation.x = 0.25), e.add(n));
  let i = De(t.name.toUpperCase(), t.sub.split(",")[0], t.color, a - 1, 200);
  if ((i.position.set(0, 5, r / 2 + 0.08), e.add(i), t.id === "barber")) {
    let s = po(
      e,
      0.15,
      0.15,
      1.6,
      -a / 2 + 0.5,
      2.4,
      r / 2 + 0.3,
      new Et.MeshStandardMaterial({ map: ay("#e5484d"), roughness: 0.5 }),
      16,
    );
    s.userData.spin = !0;
  }
  return e;
}
function uR(t) {
  let e = new Et.Group(),
    a = t.w || 7;
  (me(e, a, 1.1, 1.6, 0, 0.55, 0.8, ce(t.color, 0.6)),
    me(e, a + 0.2, 0.08, 1.8, 0, 1.14, 0.8, ce("#e9e4da", 0.4)),
    me(e, a, 2.6, 0.2, 0, 1.3, -1.6, ce("#d8cfbf", 0.8)));
  for (let s of [-a / 2 + 0.1, a / 2 - 0.1]) me(e, 0.12, 3, 0.12, s, 1.5, 1.6, Kt.dark);
  let r = new Et.Mesh(
    new Et.BoxGeometry(a + 0.8, 0.12, 3.8),
    new Et.MeshStandardMaterial({ map: ay(t.color), roughness: 0.8 }),
  );
  (r.position.set(0, 3.05, 0), (r.rotation.x = -0.12), (r.castShadow = !0), e.add(r));
  let o = me(e, 1.6, 0.25, 0.9, -a / 4, 1.3, 0.6, ce("#2b2e33", 0.4, 0.6)),
    n = new Et.Mesh(
      new Et.SphereGeometry(0.25, 8, 6),
      new Et.MeshBasicMaterial({ color: "#ffffff", transparent: !0, opacity: 0.35, depthWrite: !1 }),
    );
  (n.position.set(-a / 4, 1.7, 0.6), (n.name = "steam"), e.add(n));
  let i = De(t.name.toUpperCase(), "", t.color, a - 0.6, 160);
  (i.position.set(0, 2.55, 1.85), e.add(i));
  for (let s = 0; s < 3; s++) {
    let l = po(e, 0.22, 0.22, 0.06, -a / 3 + s * (a / 3), 0.72, 2.2, ce("#c0392b", 0.5), 12);
    po(e, 0.04, 0.04, 0.7, -a / 3 + s * (a / 3), 0.35, 2.2, Kt.dark, 6);
  }
  return e;
}
function pR(t) {
  let e = new Et.Group(),
    a = t.w || 22,
    r = t.d || 18,
    o = ce("#f4f1ea", 0.75),
    n = Kt.gold,
    i = (d, h = o) => me(e, a, d, r, 0, d / 2, 0, h),
    s = (d) => {
      let h = new Et.Mesh(new Et.CylinderGeometry(1.6, 1.6, 0.2, 20, 1, !1, 0, Math.PI), ce(d, 0.6));
      ((h.rotation.x = Math.PI / 2),
        (h.rotation.z = Math.PI / 2),
        h.position.set(0, 3, r / 2 + 0.06),
        e.add(h),
        me(e, 3.2, 3, 0.2, 0, 1.5, r / 2 + 0.06, ce(d, 0.6)));
    },
    l = (d, h, u, p, v) => {
      let g = new Et.Mesh(new Et.SphereGeometry(d, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), v);
      return (g.position.set(h, u, p), (g.castShadow = !0), e.add(g), g);
    };
  if (t.id === "mosque") {
    (i(8), l(6, 0, 8, 0, ce("#e9e2d4", 0.5)), po(e, 0.08, 0.08, 1.6, 0, 14.6, 0, n, 8));
    let d = new Et.Mesh(new Et.TorusGeometry(0.45, 0.08, 8, 20, Math.PI * 1.4), n);
    (d.position.set(0, 15.6, 0), e.add(d));
    for (let h of [-a / 2 - 1, a / 2 + 1]) {
      (po(e, 0.8, 1, 18, h, 9, r / 2 - 1, o, 12), me(e, 2.2, 0.4, 2.2, h, 14, r / 2 - 1, ce("#2f6a4f", 0.6)));
      let u = new Et.Mesh(new Et.ConeGeometry(1, 2.6, 12), ce("#2f6a4f", 0.5));
      (u.position.set(h, 19.3, r / 2 - 1), e.add(u));
    }
    s("#2f6a4f");
  }
  if (t.id === "church") {
    i(9, ce("#d8cfbf", 0.85));
    let d = new Et.Mesh(new Et.CylinderGeometry(0.01, r * 0.62, a, 3, 1), ce("#5a3f35", 0.7));
    ((d.rotation.z = Math.PI / 2),
      d.scale.set(1, 1, 0.75),
      (d.position.y = 11.5),
      e.add(d),
      me(e, 4.4, 20, 4.4, 0, 10, r / 2 - 1, ce("#d8cfbf", 0.85)));
    let h = new Et.Mesh(new Et.ConeGeometry(3.1, 7, 4), ce("#5a3f35", 0.7));
    ((h.rotation.y = Math.PI / 4),
      h.position.set(0, 23.5, r / 2 - 1),
      e.add(h),
      me(e, 0.25, 2.4, 0.25, 0, 28, r / 2 - 1, n),
      me(e, 1.3, 0.25, 0.25, 0, 28.4, r / 2 - 1, n));
    let u = new Et.Mesh(
      new Et.CircleGeometry(1.4, 24),
      new Et.MeshStandardMaterial({ color: "#4da3ff", emissive: "#7f5af0", emissiveIntensity: 0.35 }),
    );
    (u.position.set(0, 13, r / 2 + 1.25), e.add(u), s("#5a3f35"));
  }
  if (t.id === "mandir") {
    i(7, ce("#f3e0c9", 0.8));
    for (let h = 0; h < 5; h++) {
      let u = new Et.Mesh(
        new Et.CylinderGeometry(3.8 - h * 0.7, 4.3 - h * 0.7, 2.6, 8),
        ce(h % 2 ? "#ff9a3c" : "#f3e0c9", 0.7),
      );
      (u.position.set(0, 8.3 + h * 2.4, -1), (u.castShadow = !0), e.add(u));
    }
    let d = new Et.Mesh(new Et.SphereGeometry(0.6, 12, 8), n);
    (d.position.set(0, 20.6, -1),
      e.add(d),
      me(e, 0.06, 1.6, 0.06, 0, 21.8, -1, Kt.dark),
      me(e, 1.1, 0.7, 0.03, 0.55, 22.2, -1, ce("#ff9a3c", 0.8)));
    for (let h of [-5, 5]) {
      let u = new Et.Mesh(new Et.CylinderGeometry(1.4, 1.8, 2, 8), ce("#ff9a3c", 0.7));
      (u.position.set(h, 8, r / 2 - 2), e.add(u));
    }
    s("#ff9a3c");
  }
  if (t.id === "gurdwara") {
    (i(8, o), l(5, 0, 8, 0, n));
    for (let [d, h] of [
      [-a / 2 + 1.5, r / 2 - 1.5],
      [a / 2 - 1.5, r / 2 - 1.5],
      [-a / 2 + 1.5, -r / 2 + 1.5],
      [a / 2 - 1.5, -r / 2 + 1.5],
    ])
      (me(e, 2, 3, 2, d, 9.5, h, o), l(1.1, d, 11, h, n));
    (po(e, 0.1, 0.1, 16, a / 2 + 4, 8, r / 2 + 2, ce("#c0c6cc", 0.4, 0.8), 8),
      me(e, 2.4, 1.6, 0.04, a / 2 + 2.8, 15, r / 2 + 2, ce("#ff9a3c", 0.8)),
      s("#d4a64a"));
  }
  if (t.id === "temple") {
    i(6, ce("#f3e0c9", 0.8));
    for (let d = 0; d < 4; d++) {
      let h = new Et.Mesh(new Et.BoxGeometry(a + 3 - d * 4, 0.5, r + 3 - d * 4), ce("#c0392b", 0.6));
      ((h.position.y = 6.5 + d * 2.6),
        (h.castShadow = !0),
        e.add(h),
        d < 3 && me(e, a - 4 - d * 4, 2.2, r - 4 - d * 4, 0, 7.8 + d * 2.6, 0, ce("#f3e0c9", 0.8)));
    }
    (po(e, 0.1, 0.5, 3, 0, 16.6, 0, n, 10), s("#c0392b"));
  }
  if (t.id === "synagogue") {
    (i(10, ce("#e6dccb", 0.85)), me(e, a + 0.6, 0.6, r + 0.6, 0, 10.3, 0, ce("#3a5a7a", 0.6)));
    let d = new Et.Group();
    for (let h of [0, Math.PI]) {
      let u = new Et.Mesh(new Et.TorusGeometry(1.2, 0.12, 6, 3), ce("#3a5a7a", 0.4));
      ((u.rotation.z = h + Math.PI / 2), d.add(u));
    }
    (d.position.set(0, 7.4, r / 2 + 0.2), e.add(d));
    for (let h of [-6, -3, 3, 6])
      me(
        e,
        1.2,
        4,
        0.1,
        h,
        4.5,
        r / 2 + 0.06,
        new Et.MeshStandardMaterial({ color: "#7fa6c4", emissive: "#ffd9a0", emissiveIntensity: 0.1 }),
      );
    s("#3a5a7a");
  }
  let c = De(t.name.toUpperCase(), t.sub, t.color, 10);
  (c.position.set(-6, 2.2, r / 2 + 6), e.add(c));
  for (let d of [-10.6, -1.4]) po(e, 0.08, 0.08, 2.2, d, 1.1, r / 2 + 5.95, Kt.dark, 8);
  for (let d of [-a / 2 + 2, a / 2 - 2]) {
    let h = ya("#4f7f35", 1, t.x + d * 3);
    (h.position.set(d, 0, r / 2 + 4), e.add(h));
  }
  return e;
}
function P7() {
  let t = new Et.Group(),
    e = [],
    a = [],
    r = [],
    o = [],
    n = new Map(),
    i = (s, l, c, d, h) => {
      let u = new Et.Mesh(new Et.PlaneGeometry(c, d), h);
      ((u.rotation.x = -Math.PI / 2), u.position.set(s, 0.045, l), (u.receiveShadow = !0), t.add(u));
    };
  (i(192, 64, 46, 46, Kt.paving), i(130, -192, 46, 30, ce("#a39a8c", 0.95)));
  for (let s of Di) {
    let l = s.kind === "civic" ? dR(s) : s.kind === "shop" ? hR(s) : s.kind === "stall" ? uR(s) : pR(s);
    (l.position.set(s.x, 0, s.z),
      (l.rotation.y = s.face),
      t.add(l),
      l.traverse((u) => {
        (u.userData.spin && r.push(u), u.name === "steam" && o.push(u));
      }));
    let c = Math.max(s.w || 8, s.d || 8) * (s.kind === "stall" ? 0.42 : 0.55);
    (a.push({ x: s.x, z: s.z, r: c }),
      s.kind === "civic" &&
        i(
          s.x + Math.sin(s.face) * ((s.d || 18) / 2 + 6),
          s.z + Math.cos(s.face) * ((s.d || 18) / 2 + 6),
          10,
          10,
          Kt.stone,
        ));
    let d = Ic(s, s.kind === "stall" ? 2.6 : 2.5),
      h =
        s.kind === "stall"
          ? `${s.name} \u2014 menu \xB7 cook a shift`
          : s.kind === "faith"
            ? `${s.name} \u2014 go inside`
            : `${s.name} \u2014 go inside`;
    if (
      (e.push({
        pos: new Et.Vector3(d.x, 0, d.z),
        radius: s.kind === "stall" ? 2.6 : 3.6,
        label: h,
        action: "svc",
        payload: s.id,
      }),
      s.kind === "stall")
    ) {
      let u = new Et.Vector3(Math.sin(s.face), 0, Math.cos(s.face)),
        p = new Et.Vector3(u.z, 0, -u.x),
        v = new Et.Vector3(s.x, 0, s.z);
      n.set(s.id, [
        v.clone().addScaledVector(u, -2.4).addScaledVector(p, -1.6),
        v.clone().addScaledVector(u, 2.6).addScaledVector(p, 1.6),
        v.clone().addScaledVector(u, -2.4).addScaledVector(p, 1.6),
      ]);
    }
  }
  for (let s = 0; s < 6; s++) {
    let l = 110 + s * 8;
    for (let c = 0; c < 6; c++) {
      let d = new Et.Mesh(new Et.SphereGeometry(0.12, 8, 6), Xa);
      (d.position.set(l, 4.2 - Math.sin((c / 5) * Math.PI) * 0.6, -197 + c * 2.6), t.add(d));
    }
  }
  for (let s = 0; s < 4; s++) {
    let l = new Et.Group();
    (po(l, 0.8, 0.8, 0.06, 0, 0.75, 0, ce("#e9e4da", 0.5), 18),
      po(l, 0.06, 0.06, 0.75, 0, 0.37, 0, Kt.dark, 8));
    for (let c of [0, 2.1, 4.2])
      po(l, 0.22, 0.22, 0.05, Math.cos(c) * 1.2, 0.46, Math.sin(c) * 1.2, ce("#ff9a3c", 0.6), 10);
    (l.position.set(116 + s * 10, 0, -192), t.add(l), a.push({ x: 116 + s * 10, z: -192, r: 1 }));
  }
  {
    let s = De(
      "FOOD STREET",
      "Biryani \xB7 chaat \xB7 BBQ \xB7 noodles \xB7 chai \xB7 ice cream",
      "#ff9a3c",
      12,
    );
    (s.position.set(106, 4.6, -192), (s.rotation.y = -Math.PI / 2), t.add(s));
    for (let l of [-198.5, -185.5]) po(t, 0.15, 0.15, 5, 106, 2.5, l, Kt.dark, 8);
  }
  {
    let s = De(
      "EVERYDAY BAZAAR",
      "Phones \xB7 Wi-Fi \xB7 snacks \xB7 bartan \xB7 barber \xB7 beauty \xB7 diner \xB7 books",
      "#4da3ff",
      14,
    );
    (s.position.set(170, 5, 64), (s.rotation.y = -Math.PI / 2), t.add(s));
    for (let l of [56.5, 71.5]) po(t, 0.15, 0.15, 5.6, 170, 2.8, l, Kt.dark, 8);
  }
  {
    let s = De(
      "CIVIC QUARTER",
      "Hospital \xB7 police \xB7 fire \xB7 post \xB7 library \xB7 pharmacy",
      "#ffc27a",
      12,
    );
    (s.position.set(-350, 4.5, 32), (s.rotation.y = Math.PI / 2), t.add(s));
  }
  for (let s = -200; s <= 140; s += 32) (t.add(yu(-366, s + 10, -Math.PI / 2)), t.add(Wg(-366, s + 13)));
  for (let s of [178, 190, 202]) t.add(yu(s, 64, 0));
  return {
    group: t,
    interacts: e,
    colliders: a,
    stations: (s) => n.get(s) || [],
    tick: (s, l) => {
      (r.forEach((c) => (c.rotation.y += s * 2)),
        o.forEach((c, d) => {
          let h = (l * 0.6 + d * 0.37) % 1;
          ((c.position.y = 1.5 + h * 1.2), c.scale.setScalar(0.6 + h), (c.material.opacity = 0.35 * (1 - h)));
        }));
    },
  };
}
var cc = (t, e, a, r, o, n, i, s, l, c, d) => ({
    id: "res-" + t,
    name: e,
    role: a + " \xB7 AI",
    x: r,
    z: o,
    wander: l,
    outfit: {
      skin: la[(t.length * 7) % la.length],
      hair: s ? (t.length % 2 ? "short" : "bun") : "short",
      hairColor: i,
      top: n,
      bottom: s ? "#5a5a5a" : "#2b3a55",
      shoes: "#2b2b2b",
      ...(s
        ? {
            topStyle: t.length % 2 ? "kurta" : "shirt",
            bottomStyle: t.length % 2 ? "shalwar" : "trousers",
            beard: t.length % 3 === 0 ? "full" : "none",
            glasses: "round",
          }
        : {}),
    },
    persona: c + " You are an AI resident of Fyrus, a virtual city game. Keep answers short and warm.",
    greeting: d,
    quick: ["How long have you lived here?", "Any advice?"],
    elder: s,
  }),
  O7 = [
    cc(
      "nana",
      "Nana Karim",
      "Retired teacher",
      -366,
      -150,
      "#e9e2d4",
      "#e8e8e8",
      !0,
      10,
      "You are Nana Karim, 78, a retired school teacher who walks every morning on the Civic Avenue. You love telling short stories about how Fyrus used to be.",
      "Assalam-o-alaikum, beta! Lovely morning for a walk.",
    ),
    cc(
      "amma",
      "Amma Rukhsana",
      "Grandmother",
      -366,
      40,
      "#b06ad9",
      "#dcdcdc",
      !0,
      8,
      "You are Amma Rukhsana, 74, who visits the library every day for poetry books.",
      "Have you read Gitanjali? Beautiful poems.",
    ),
    cc(
      "george",
      "Uncle George",
      "Retired engineer",
      190,
      60,
      "#8a9bb0",
      "#d0d0d0",
      !0,
      9,
      "You are Uncle George, 81, a retired engineer who fixes old radios and likes the Everyday Bazaar.",
      "They don\u2019t make radios like they used to!",
    ),
    cc(
      "dadi",
      "Dadi Shamim",
      "Grandmother",
      130,
      -190,
      "#e05a8a",
      "#efefef",
      !0,
      8,
      "You are Dadi Shamim, 76, who knows the best food at every stall on Food Street. Your favourite is the halwa puri.",
      "Try the halwa puri, it reminds me of home.",
    ),
    cc(
      "baba",
      "Baba Gurpreet",
      "Retired driver",
      40,
      290,
      "#ff9a3c",
      "#e0e0e0",
      !0,
      10,
      "You are Baba Gurpreet, 80, a retired bus driver who volunteers at the langar in the Gurdwara and welcomes people of every faith.",
      "Everyone is welcome at the langar, come eat!",
    ),
    cc(
      "maria",
      "Grandma Maria",
      "Retired nurse",
      -40,
      270,
      "#4da3ff",
      "#f0f0f0",
      !0,
      8,
      "You are Grandma Maria, 79, a retired nurse who sings in the church choir and is friends with everyone in the Faith District.",
      "Bless you, dear. Lovely to see young people here.",
    ),
    cc(
      "kid1",
      "Rayan",
      "Student",
      120,
      -186,
      "#45e0ae",
      "#2a1a12",
      !1,
      12,
      "You are Rayan, a cheerful university student who works shifts at Food Street.",
      "The chai here is the best in Fyrus!",
    ),
    cc(
      "kid2",
      "Sofia",
      "Nurse in training",
      -362,
      -182,
      "#9fd3c7",
      "#7a4a24",
      !1,
      8,
      "You are Sofia, training as a nurse at Fyrus General Hospital (in the game).",
      "Try a nurse shift \u2014 it\u2019s fun and pays well.",
    ),
  ];
var $g = class {
  constructor() {
    this.id = "tab-" + Math.random().toString(36).slice(2, 8);
    this.peers = new Map();
    this.ch = null;
    this.room = null;
    this.lastRoom = 0;
    this.lastPhoto = "";
    this.myPeer = "";
    this.extra = {};
    this.extraDirty = !1;
    this.lastInv = new Map();
    this.mySay = "";
    this.mySayAt = 0;
    this.seenSay = new Map();
    try {
      ((this.ch = new BroadcastChannel("fyrus-presence")),
        (this.ch.onmessage = (e) => {
          let a = e.data;
          !a ||
            a.id === this.id ||
            (a.t === "bye"
              ? this.peers.delete(a.id)
              : a.t === "chat"
                ? this.onChat?.(a)
                : this.peers.set(a.id, a));
        }),
        window.addEventListener("beforeunload", () => this.send({ t: "bye" })));
    } catch {
      this.ch = null;
    }
    this.connectRoom();
  }
  setExtra(e) {
    ((this.extra = { ...this.extra, ...e }), (this.extraDirty = !0));
  }
  async connectRoom() {
    try {
      let e = window.claude;
      if (!e?.use) return;
      let a = await e.use("room");
      if (!a) return;
      ((this.room = a),
        a.onPeers(
          (r) => {
            r.left?.forEach((n) => this.peers.delete("room-" + n.peer));
            let o = (r.peers || []).find((n) => n.isMe);
            (o && (this.myPeer = o.peer),
              (r.peers || []).forEach((n) => {
                if (n.isMe) {
                  this.myPeer = n.peer;
                  return;
                }
                if (n.sameTab) return;
                let i = n.presence || {};
                if (
                  (i.inv &&
                    i.inv.to === this.myPeer &&
                    i.inv.at &&
                    this.lastInv.get(n.peer) !== i.inv.at &&
                    (this.lastInv.set(n.peer, i.inv.at),
                    this.onInvite?.({
                      fromPeer: n.peer,
                      fromName: String(i.n || "A player").slice(0, 24),
                      room: String(i.inv.room),
                      kind: String(i.inv.kind),
                      game: i.inv.game,
                    })),
                  typeof i.x != "number")
                )
                  return;
                let s = "room-" + n.peer,
                  l = Array.isArray(i.p) ? i.p.join("") : void 0;
                (this.peers.set(s, {
                  t: "pos",
                  id: s,
                  name: String(i.n || "Guest").slice(0, 24),
                  color: String(i.c || "#ffffff"),
                  x: i.x,
                  z: i.z,
                  ry: i.ry || 0,
                  scene: String(i.sc || "plaza"),
                  at: Date.now(),
                  o: i.o,
                  real: !0,
                  photo: l && l.startsWith("data:image/") ? l : void 0,
                  v: i.v || null,
                  y: i.y || 0,
                  peer: n.peer,
                }),
                  i.say &&
                    i.sayAt &&
                    this.seenSay.get(s) !== i.sayAt &&
                    (this.seenSay.set(s, i.sayAt),
                    this.onChat?.({
                      t: "chat",
                      id: s,
                      name: i.n,
                      color: i.c,
                      text: String(i.say).slice(0, 140),
                      x: 0,
                      z: 0,
                      ry: 0,
                      scene: "",
                      at: Date.now(),
                    })));
              }));
          },
          () => {},
        ));
    } catch {
      this.room = null;
    }
  }
  send(e) {
    e.t === "pos" &&
      O.status === "online" &&
      O.pos({ x: e.x, z: e.z, y: e.y || 0, ry: e.ry, scene: e.scene, o: e.o, v: e.v, photo: e.photo });
    try {
      this.ch?.postMessage({ ...e, id: this.id, at: Date.now() });
    } catch {}
    if (
      this.room &&
      (e.t === "chat" && e.text && ((this.mySay = e.text), (this.mySayAt = Date.now())), e.t === "pos")
    ) {
      let a = Date.now();
      if (a - this.lastRoom < 120) return;
      this.lastRoom = a;
      let r = e.photo && e.photo.length < 2700 ? e.photo : "",
        o = this.extraDirty ? { ...this.extra } : {};
      ((this.extraDirty = !1),
        r !== this.lastPhoto && ((this.lastPhoto = r), (o.p = r ? r.match(/.{1,900}/g) : null)),
        this.room
          .presence({
            ...o,
            x: Math.round(e.x * 10) / 10,
            z: Math.round(e.z * 10) / 10,
            y: e.y || 0,
            ry: Math.round(e.ry * 100) / 100,
            sc: e.scene,
            n: e.name,
            c: e.color,
            o: e.o || null,
            say: this.mySay || null,
            sayAt: this.mySayAt || null,
            v: e.v || null,
          })
          .catch(() => {}));
    }
  }
  prune() {
    let e = Date.now();
    this.peers.forEach((r, o) => {
      !r.real && e - r.at > 4e3 && this.peers.delete(o);
    });
    let a = new Set();
    (O.peers.forEach((r) => {
      let o = "net-" + r.id;
      (a.add(o),
        this.peers.set(o, {
          t: "pos",
          id: o,
          name: r.name,
          color: r.color,
          x: r.x,
          z: r.z,
          ry: r.ry,
          scene: r.sc,
          at: e,
          o: r.o,
          real: !0,
          photo: r.ph,
          v: r.v || null,
          y: r.y || 0,
          peer: r.id,
          mk: r.mk,
        }));
    }),
      this.peers.forEach((r, o) => {
        o.startsWith("net-") && !a.has(o) && this.peers.delete(o);
      }));
  }
  online() {
    return this.peers.size;
  }
  close() {
    (this.send({ t: "bye" }), this.ch?.close());
  }
};
var _g = class {
  constructor() {
    this.ctx = null;
    this.panner = null;
    this.master = null;
    this.voiceGain = null;
    this.formants = [];
    this.enabled = !1;
    this.timer = null;
    this.lastKey = "";
  }
  setEnabled(e) {
    e !== this.enabled && ((this.enabled = e), e ? this.start() : this.stop());
  }
  start() {
    try {
      let e = window.AudioContext || window.webkitAudioContext;
      if (!e) return;
      let a = this.ctx || new e();
      if (((this.ctx = a), a.resume?.(), this.panner)) {
        this.master.gain.setTargetAtTime(1, a.currentTime, 0.2);
        return;
      }
      let r = a.createGain();
      ((r.gain.value = 1), r.connect(a.destination), (this.master = r));
      let o = a.createPanner();
      ((o.panningModel = "HRTF"),
        (o.distanceModel = "inverse"),
        (o.refDistance = 3),
        (o.rolloffFactor = 1.6),
        (o.maxDistance = 200),
        o.connect(r),
        (this.panner = o));
      let n = a.createGain();
      ((n.gain.value = 0), n.connect(o), (this.live = n));
      let i = a.createBiquadFilter();
      ((i.type = "lowpass"), (i.frequency.value = 900), (i.Q.value = 2), i.connect(n));
      let s = a.createOscillator();
      s.frequency.value = 0.12;
      let l = a.createGain();
      ((l.gain.value = 500),
        s.connect(l),
        l.connect(i.frequency),
        s.start(),
        [110, 164.8, 220, 261.6, 329.6].forEach((v, g) => {
          let m = a.createOscillator();
          ((m.type = g % 2 ? "sawtooth" : "triangle"),
            (m.frequency.value = v),
            (m.detune.value = (g - 2) * 6));
          let f = a.createGain();
          ((f.gain.value = 0.05), m.connect(f), f.connect(i), m.start());
        }));
      let c = a.createGain();
      ((c.gain.value = 0), c.connect(n));
      let d = a.createOscillator();
      ((d.frequency.value = 55), d.connect(c), d.start(), (this.beat = c));
      let h = a.createOscillator();
      ((h.type = "sawtooth"), (h.frequency.value = 135));
      let u = a.createGain();
      ((u.gain.value = 0),
        (this.voiceGain = u),
        [700, 1200, 2600].forEach((v) => {
          let g = a.createBiquadFilter();
          ((g.type = "bandpass"),
            (g.frequency.value = v),
            (g.Q.value = 9),
            h.connect(g),
            g.connect(u),
            this.formants.push(g));
        }),
        u.connect(n),
        h.start(),
        (this.voice = h));
      let p = 0;
      this.timer = setInterval(() => {
        if (!this.ctx) return;
        let v = this.ctx.currentTime;
        p++;
        let g = Math.random() < 0.75;
        (u.gain.setTargetAtTime(g ? 0.5 + Math.random() * 0.4 : 0, v, 0.03),
          h.frequency.setTargetAtTime(110 + Math.random() * 60, v, 0.05));
        let m = [
          [730, 1090, 2440],
          [270, 2290, 3010],
          [530, 1840, 2480],
          [300, 870, 2240],
          [660, 1720, 2410],
        ][Math.floor(Math.random() * 5)];
        (this.formants.forEach((f, y) => f.frequency.setTargetAtTime(m[y], v, 0.04)),
          p % 4 === 0 &&
            (c.gain.cancelScheduledValues(v),
            c.gain.setValueAtTime(0.5, v),
            c.gain.exponentialRampToValueAtTime(0.001, v + 0.25)));
      }, 140);
    } catch {}
  }
  stop() {
    this.ctx && this.master && this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
  }
  update(e, a, r, o) {
    let n = this.ctx;
    if (!n || !this.panner || !this.enabled) return;
    let i = this.live,
      s = n.currentTime;
    (i.gain.setTargetAtTime(a ? 0.9 : 0, s, 0.3), a && gR(this.panner, a.x, a.y, a.z, s));
    let l = n.listener;
    (l.positionX
      ? (l.positionX.setTargetAtTime(r.x, s, 0.05),
        l.positionY.setTargetAtTime(r.y + 1.7, s, 0.05),
        l.positionZ.setTargetAtTime(r.z, s, 0.05),
        l.forwardX.setTargetAtTime(o.x, s, 0.05),
        l.forwardY.setTargetAtTime(0, s, 0.05),
        l.forwardZ.setTargetAtTime(o.z, s, 0.05),
        (l.upX.value = 0),
        (l.upY.value = 1),
        (l.upZ.value = 0))
      : (l.setPosition?.(r.x, r.y + 1.7, r.z), l.setOrientation?.(o.x, 0, o.z, 0, 1, 0)),
      (this.lastKey = e));
  }
  loudness(e, a) {
    if (!e) return 0;
    let r = e.distanceTo(a);
    return Math.min(1, 3 / (3 + 1.6 * Math.max(0, r - 3)));
  }
  dispose() {
    clearInterval(this.timer);
    try {
      this.ctx?.close();
    } catch {}
    ((this.ctx = null), (this.panner = null));
  }
};
function gR(t, e, a, r, o) {
  let n = t;
  n.positionX
    ? (n.positionX.setTargetAtTime(e, o, 0.05),
      n.positionY.setTargetAtTime(a, o, 0.05),
      n.positionZ.setTargetAtTime(r, o, 0.05))
    : n.setPosition(e, a, r);
}
