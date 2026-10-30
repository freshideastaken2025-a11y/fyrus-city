/* FYRUS 23.4 object pickup and placement. Kill switch: ?p23off=carry
 * Things bought at the 22.6 street stalls are handed to the player (a small procedural prop: coffee cup, bouquet,
 * newspaper, juice cup, water bottle, ...). The prop is held in the avatar's right hand (hand bone of the local GLB
 * avatar; a hip-height fallback when no bone is found). Through the 23.1 interaction controller:
 *   "Put down <item>"  - places it on the bench seat in reach (on the board) or on the ground 0.7 m in front;
 *   "Pick up <item>"   - takes a placed item back (only with empty hands; "Hands full" otherwise).
 * Up to 24 placed items in the scene they were put down in (oldest is cleared first); items are local to this browser
 * session. The prop is hidden while driving. Stats / test hooks: window.__fyrusCarry23 { stats, give(kind), held() }. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'carry' || k === 'all'; })) return;
  var S = { given: 0, placed: 0, picked: 0, onBench: 0, holding: null, handBone: null, errors: 0 };
  var API = window.__fyrusCarry23 = { version: '23.4', stats: S };
  var T = null, W = null, held = null, placed = [], hand = null, MAXP = 24;
  var NAMES = { coffee: 'coffee', flowers: 'flowers', news: 'newspaper', juice: 'juice', water: 'water bottle', gum: 'gum', snack: 'pastry' };
  function mat(c, r) { return new T.MeshStandardMaterial({ color: c, roughness: r == null ? 0.6 : r }); }
  function build(kind) {
    var g = new T.Group(); g.name = 'carry-' + kind;
    if (kind === 'coffee' || kind === 'juice') {
      var cup = new T.Mesh(new T.CylinderGeometry(0.045, 0.035, 0.13, 14), mat(kind === 'coffee' ? 0xf2efe8 : 0xffb347)); cup.position.y = 0.065; g.add(cup);
      var lid = new T.Mesh(new T.CylinderGeometry(0.048, 0.048, 0.015, 14), mat(kind === 'coffee' ? 0x3b2a20 : 0xffffff)); lid.position.y = 0.137; g.add(lid);
      if (kind === 'juice') { var st = new T.Mesh(new T.CylinderGeometry(0.004, 0.004, 0.09, 6), mat(0x2e8a5a)); st.position.set(0.01, 0.18, 0); g.add(st); }
    } else if (kind === 'flowers') {
      var stem = new T.Mesh(new T.ConeGeometry(0.05, 0.24, 10).rotateX(Math.PI), mat(0x3f7a35)); stem.position.y = 0.12; g.add(stem);
      [0xd65b8a, 0xf5c242, 0xffffff, 0xe05050, 0xb07ad6].forEach(function (c, i) { var b = new T.Mesh(new T.SphereGeometry(0.04, 8, 6), mat(c, 0.8)); var a = i * 1.26; b.position.set(Math.cos(a) * 0.045, 0.27 + (i % 2) * 0.02, Math.sin(a) * 0.045); g.add(b); });
    } else if (kind === 'news') {
      var p = new T.Mesh(new T.BoxGeometry(0.2, 0.012, 0.28), mat(0xe9e6dc, 0.9)); p.position.y = 0.006; g.add(p);
    } else if (kind === 'water') {
      var bt = new T.Mesh(new T.CylinderGeometry(0.032, 0.032, 0.2, 12), new T.MeshStandardMaterial({ color: 0x9fd3ff, roughness: 0.15, transparent: true, opacity: 0.7 })); bt.position.y = 0.1; g.add(bt);
      var cp = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 0.02, 10), mat(0x2f5fa8)); cp.position.y = 0.21; g.add(cp);
    } else {
      var bx = new T.Mesh(new T.BoxGeometry(0.1, 0.05, 0.08), mat(kind === 'gum' ? 0x52c3a1 : 0xd9a35c)); bx.position.y = 0.025; g.add(bx);
    }
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.userData.noBatch = o.userData.noInstance = true; } });
    g.userData.kind = kind; return g;
  }
  // stall item -> prop kind (22.6 stalls)
  API.kindFor = function (stallId, itemName) {
    var n = String(itemName || '').toLowerCase();
    if (/water/.test(n)) return 'water'; if (/gum/.test(n)) return 'gum'; if (/croissant|fruit cup/.test(n)) return 'snack';
    if (/times|news/.test(n)) return 'news'; if (stallId === 'flowers' || /rose|tulip|sunflower/.test(n)) return 'flowers';
    if (stallId === 'juice' || /juice|smoothie/.test(n)) return 'juice'; return 'coffee';
  };
  function findHand() {
    var D = window.__fyrusAvatarDemo, m = D && D.model; if (!m) return null;
    var best = null;
    m.traverse(function (o) { if (best || !o.isBone) return; var n = o.name.toLowerCase(); if (/(right|_r\b|\.r\b|r_)?hand/.test(n) && /right|_r\b|\.r\b|^r_|r_hand|righthand/.test(n) && !/thumb|index|middle|ring|pinky/.test(n)) best = o; });
    S.handBone = best ? best.name : null; return best;
  }
  function attach() {
    if (!held) return;
    var h = findHand(); hand = h;
    if (h) {
      if (held.obj.parent !== h) { h.add(held.obj); var ws = new T.Vector3(); h.getWorldScale(ws); var k = 1 / (ws.x || 1); held.obj.scale.setScalar(k); held.obj.position.set(0, 0.14 * k, 0.035 * k); held.obj.rotation.set(Math.PI, 0, 0); /* hand +Y runs along the fingers: flip so the top points to the wrist */ }
    } else if (W && W.player && held.obj.parent !== W.player.root) { W.player.root.add(held.obj); held.obj.scale.setScalar(1); held.obj.position.set(0.28, 0.92, 0.12); }
  }
  API.give = function (kind) {
    if (!T) T = window.THREE; W = window.__fyrusW; if (!T || !W) return false;
    if (held) dropAt(held, groundSpot());             // hands full: the old item is put down first
    held = { kind: kind, obj: build(kind) }; S.given++; S.holding = kind; attach(); return true;
  };
  API.held = function () { return held ? held.kind : null; };
  API.build = function (kind) { if (!T) T = window.THREE; return T ? build(kind) : null; };   // 23.9 remote players' props
  function groundSpot() {
    var p = W.player.root.position, y = W.player.root.rotation.y, x = p.x + Math.sin(y) * 0.7, z = p.z + Math.cos(y) * 0.7;
    var b = nearBench(p);
    if (b) { S.onBench++; return { x: b.x, y: b.y + 0.485, z: b.z, scene: W.active }; }
    var gy = W.active === W.world && W.groundAt ? W.groundAt(x, z) : p.y; return { x: x, y: gy, z: z, scene: W.active };
  }
  function nearBench(p) {
    if (W.active !== W.world) return null;
    var seats = (window.__fyrusCity21 && window.__fyrusCity21.seats && window.__fyrusCity21.seats()) || [], best = null, bd = 1.5;
    seats.forEach(function (b) {
      // a free spot on the board next to the player: offset along the bench toward the player
      var rx = Math.cos(b.ang), rz = -Math.sin(b.ang), t = Math.max(-0.75, Math.min(0.75, (p.x - b.x) * rx + (p.z - b.z) * rz));
      var x = b.x + rx * t, z = b.z + rz * t, d = Math.hypot(x - p.x, z - p.z);
      if (d < bd && !placed.some(function (q) { return Math.hypot(q.spot.x - x, q.spot.z - z) < 0.25; })) { bd = d; best = { x: x, y: b.y, z: z }; }
    });
    return best;
  }
  function dropAt(h, spot) {
    var o = h.obj; if (o.parent) o.parent.remove(o);
    o.scale.setScalar(1); o.position.set(spot.x, spot.y, spot.z); o.rotation.set(0, Math.random() * 6.28, 0);
    if (h.kind === 'news') o.rotation.y = W.player.root.rotation.y;
    spot.scene.add(o);
    placed.push({ kind: h.kind, obj: o, spot: spot });
    while (placed.length > MAXP) { var old = placed.shift(); if (old.obj.parent) old.obj.parent.remove(old.obj); dispose(old.obj); }
    S.placed++;
  }
  function dispose(o) { o.traverse(function (m) { if (m.isMesh) { m.geometry.dispose(); m.material.dispose(); } }); }
  function putDown() { if (!held) return; var h = held; held = null; S.holding = null; dropAt(h, groundSpot()); }
  function pickUp(it) {
    if (held) { if (window.__fyrusEconomy) window.__fyrusEconomy.toast('Hands full: put the ' + (NAMES[held.kind] || held.kind) + ' down first.', 'warn'); return; }
    var i = placed.indexOf(it); if (i < 0) return; placed.splice(i, 1);
    held = { kind: it.kind, obj: it.obj }; if (it.obj.parent) it.obj.parent.remove(it.obj); S.picked++; S.holding = it.kind; attach();
  }
  API.putDown = putDown; API.placed = function () { return placed.map(function (q) { return { kind: q.kind, x: Math.round(q.spot.x * 100) / 100, y: Math.round(q.spot.y * 100) / 100, z: Math.round(q.spot.z * 100) / 100 }; }); };
  API.pickNearest = function () { var p = W.player.root.position, b = null, bd = 9; placed.forEach(function (q) { var d = q.obj.position.distanceTo(p); if (d < bd) { bd = d; b = q; } }); if (b) pickUp(b); return !!b; };
  window.__fyrusExtraInteracts = (function (prev) {
    return function () {
      var out = prev ? prev() : [];
      W = window.__fyrusW; if (!W || !W.player) return out;
      var p = W.player.root.position;
      if (held && !W.vehicle) out.push({ pos: p.clone(), radius: 2.5, label: 'Put down ' + (NAMES[held.kind] || held.kind), action: 'place', prio: 0.8, use: putDown });   // nearby real targets win; R cycles to it
      placed.forEach(function (q) {
        if (q.spot.scene !== W.active || Math.abs(q.spot.x - p.x) > 3 || Math.abs(q.spot.z - p.z) > 3) return;
        out.push({ pos: q.obj.position, radius: 1.5, label: (held ? 'Hands full · ' : 'Pick up ') + (NAMES[q.kind] || q.kind), action: 'pickup', use: function () { pickUp(q); } });
      });
      return out;
    };
  })(window.__fyrusExtraInteracts);
  setInterval(function () {
    W = window.__fyrusW; if (!W || !held) return;
    try { T = window.THREE; held.obj.visible = !W.vehicle; if (!hand || !hand.parent || held.obj.parent == null) attach(); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }, 250);
})();
