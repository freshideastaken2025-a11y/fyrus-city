/* FYRUS 22.3 ambient pedestrians. Kill switch: ?p22off=peds  (count override: ?peds=N, 0..60)
 * Pedestrians walk the pavements of the 64 m street grid around the player using the Phase 20 avatars (A1/A2/A3 LOD).
 * - Graph: every block has four pavement corners at 7 m from the road centre lines (32 + 64k). From a corner a walker
 *   either follows the pavement to the next corner of the same block, or crosses the road on the crossing to the
 *   facing block's corner. A crossing is only started when the cars on that road have red at the junction
 *   (window.__fyrusSignals, 22.1); without signals they wait for a gap of 6 s.
 * - Corners on buildings / private plots (groundAt > 0.3) and the central plaza (r < 62 m) are never used.
 * - Walkers keep 1.1 m from each other and step aside for the player; walkers more than 150 m away are recycled to a
 *   corner 45..120 m from the player. Only active in the city world (detached in interiors).
 * Stats: window.__fyrusPeds22.stats (walkers, crossings, waits, redViolations, ms). */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p22off') || '').split(',').some(function (k) { return k === 'peds' || k === 'all'; })) return;
  var NAMES = ['fyrus20-base-female', 'fyrus20-female-formal', 'fyrus20-female-sport', 'fyrus20-base-male', 'fyrus20-male-formal', 'fyrus20-male-sport'];
  var LANE = 7, G = 64, S = { walkers: 0, spawned: 0, crossings: 0, waits: 0, redViolations: 0, recycled: 0, turns: 0, ms: 0, errors: 0, tiers: {} };
  var AMB = !(Q.get('p22off') || '').split(',').some(function (k) { return k === 'ambient'; });
  S.ambient = { enabled: AMB, pauses: 0, shops: 0, chats: 0, waves: 0, emotes: 0, pigeons: 0, flights: 0 };
  window.__fyrusPeds22 = { version: '23.7', stats: S };
  // 23.7 social response: the nearest free walker within `r` m in front of the player stops, turns to the player and
  // plays an emote back. Returns true when someone responded.
  window.__fyrusPeds22.respond = function (p, yaw, emote, r) {
    var best = null, bd = r || 5;
    peds.forEach(function (w) {
      if (!w.live || w.crossing) return;
      var dx = w.pos.x - p.x, dz = w.pos.z - p.z, d = Math.hypot(dx, dz); if (d > bd || d < 0.3) return;
      if ((Math.sin(yaw) * dx + Math.cos(yaw) * dz) / d < 0.3) return;
      bd = d; best = w;
    });
    if (!best) return false;
    best.pause = 3; best.faceYaw = Math.atan2(p.x - best.pos.x, p.z - best.pos.z); best.pendingEmote = emote; best.pendingAt = 2.6; best.cool = 10;
    S.socialResponses = (S.socialResponses || 0) + 1; return true;
  };
  var T, W, peds = [], BUF = {}, group = null, hooked = false;
  function buf(u) { return BUF[u] || (BUF[u] = fetch(u).then(function (r) { if (!r.ok) throw new Error(u); return r.arrayBuffer(); })); }
  function parse(u) { return buf(u).then(function (ab) { return new Promise(function (res, rej) { new T.GLTFLoader().parse(ab, '', res, rej); }); }); }
  function load(src) { return new Promise(function (res) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }
  function count() {
    var n = parseInt(Q.get('peds'), 10); if (!isNaN(n)) return Math.max(0, Math.min(60, n));
    var q = window.__fyrusQuality && window.__fyrusQuality.name || '';
    return /low|lite/i.test(q) ? 8 : /mobile/i.test(q) ? 12 : /high|ultra/i.test(q) ? 32 : 20;   // 29.3: phone profiles (names are lite/mobile) get fewer pedestrians
  }
  // corner of block (bi, bj) quadrant (sx, sz): block spans road (32 + 64bi) .. (96 + 64bi)
  function corner(bi, bj, sx, sz) { return { bi: bi, bj: bj, sx: sx, sz: sz, x: 32 + G * bi + (sx > 0 ? G - LANE : LANE), z: 32 + G * bj + (sz > 0 ? G - LANE : LANE) }; }
  function free(x, z) { if (x * x + z * z < 62 * 62) return false; var g = W.groundAt ? W.groundAt(x, z) : 0; return g < 0.3; }
  function okCorner(c) { return free(c.x, c.z); }
  function okEdge(a, b) { for (var k = 1; k < 4; k++) { var t = k / 4; if (!free(a.x + (b.x - a.x) * t, a.z + (b.z - a.z) * t)) return false; } return true; }
  // neighbours of a corner: two along the block edge (same block) and two across the road (adjacent blocks)
  function options(c) {
    var o = [];
    o.push({ c: corner(c.bi, c.bj, -c.sx, c.sz), cross: null });
    o.push({ c: corner(c.bi, c.bj, c.sx, -c.sz), cross: null });
    // across the north-south road (x = const, cars move along z): to the block on the other side in x
    var jx = 32 + G * (c.bi + (c.sx > 0 ? 1 : 0)), jz = 32 + G * (c.bj + (c.sz > 0 ? 1 : 0));
    o.push({ c: corner(c.bi + c.sx, c.bj, -c.sx, c.sz), cross: { jx: jx, jz: jz, axis: 'z' } });
    o.push({ c: corner(c.bi, c.bj + c.sz, c.sx, -c.sz), cross: { jx: jx, jz: jz, axis: 'x' } });
    return o.filter(function (e) { return okCorner(e.c) && (e.cross || okEdge(c, e.c)); });
  }
  function sig(cr) { var s = window.__fyrusSignals; return s ? s.state(cr.jx, cr.jz, cr.axis) : null; }
  function spawnCorner(p, rmin, rmax) {
    for (var t = 0; t < 40; t++) {
      var a = Math.random() * Math.PI * 2, r = rmin + Math.random() * (rmax - rmin), x = p.x + Math.cos(a) * r, z = p.z + Math.sin(a) * r;
      var bi = Math.floor((x - 32) / G), bj = Math.floor((z - 32) / G), lx = x - 32 - G * bi, lz = z - 32 - G * bj;
      var c = corner(bi, bj, lx > G / 2 ? 1 : -1, lz > G / 2 ? 1 : -1);
      if (okCorner(c) && options(c).length) return c;
    }
    return null;
  }
  function pickNext(w) {
    var o = options(w.at); if (!o.length) { w.next = null; return; }
    var e = o[Math.floor(Math.random() * o.length)];
    if (o.length > 1 && w.prev && e.c.x === w.prev.x && e.c.z === w.prev.z) e = o[(o.indexOf(e) + 1) % o.length];   // avoid walking straight back
    w.next = e.c; w.cross = e.cross; w.waitT = 0; S.turns++;
  }
  function place(w, c) { w.at = c; w.prev = null; w.crossing = false; w.cross = null; w.hurried = false; w.pause = 0; w.pendingEmote = null; w.edgeFrom = null; w.pos.set(c.x + (Math.random() - 0.5), 0, c.z + (Math.random() - 0.5)); pickNext(w); }
  async function start() {
    T = window.THREE; W = window.__fyrusW;
    if (!T.GLTFLoader) await load('/fyrus-gltf-loader.js?v=1.0.0');
    if (!window.__fyrusLoco20) await load('/fyrus-avatar20.js?v=20.16');
    if (!T.GLTFLoader || !window.__fyrusLoco20) { S.errors++; S.lastError = 'loader'; return; }
    group = new T.Group(); group.name = 'p22-peds';
    if (AMB) { try { buildPigeons(); group.add(PG.mesh); } catch (e) { S.errors++; S.lastError = 'pigeons ' + (e && e.message); } }
    var N = count(); S.target = N;
    hook();
    for (var i = 0; i < N; i++) {
      var nm = NAMES[(i * 5 + 1) % NAMES.length], base = '/assets/characters/fyrus20/' + nm;
      try {
        var g = await Promise.all([parse(base + '.glb'), parse(base + '-a2.glb'), parse(base + '-a3.glb')]);
        var grp = new T.Group(), tiers = { a1: g[0].scene, a2: g[1].scene, a3: g[2].scene };
        Object.keys(tiers).forEach(function (k) { tiers[k].traverse(function (o) { if (o.isMesh) { o.castShadow = k === 'a1'; o.userData.noBatch = o.userData.noInstance = true; } }); grp.add(tiers[k]); });
        group.add(grp);
        var w = { grp: grp, lod: window.__fyrusLoco20.lodGroup(tiers, g[0].animations), pos: grp.position, v: 1.15 + Math.random() * 0.45, spd: 0, yaw: 0, at: null, next: null, cross: null, waitT: 0, live: false };
        peds.push(w); S.spawned++;
      } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
      await new Promise(function (r) { setTimeout(r, 30); });   // spread GLB parsing over frames
    }
  }
  /* 22.5 pigeons: a flock on the central plaza (1 instanced draw call). They peck and hop; when the player comes within
   * 4 m they take off, circle and land at another plaza spot ~8 s later. */
  var PG = null, PGN = 18;
  function buildPigeons() {
    var g = new T.SphereGeometry(0.11, 8, 6); g.scale(1, 0.85, 1.6);
    var head = new T.SphereGeometry(0.06, 6, 5); head.translate(0, 0.08, 0.15);
    var merged = mergeGeo([g, head]);
    var m = new T.MeshStandardMaterial({ color: 0x8a9099, roughness: 0.8 });
    PG = { mesh: new T.InstancedMesh(merged, m, PGN), birds: [] };
    PG.mesh.castShadow = false; PG.mesh.frustumCulled = false; PG.mesh.userData.noBatch = PG.mesh.userData.noInstance = true; PG.mesh.name = 'p22-pigeons';
    var cx = 0, cz = 30;
    for (var i = 0; i < PGN; i++) { var a = Math.random() * 6.283, r = 2 + Math.random() * 6; PG.birds.push({ x: cx + Math.cos(a) * r, z: cz + Math.sin(a) * r, y: 0, yaw: Math.random() * 6.283, st: 'ground', t: Math.random() * 3, tx: 0, tz: 0 }); }
    PG.flock = { x: cx, z: cz }; S.ambient.pigeons = PGN;
  }
  function mergeGeo(list) {
    var pos = [], nor = [], idx = [], off = 0;
    list.forEach(function (g) { g = g.index ? g : g; var p = g.attributes.position, n = g.attributes.normal; for (var i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); } var ix = g.index.array; for (var j = 0; j < ix.length; j++) idx.push(ix[j] + off); off += p.count; });
    var out = new T.BufferGeometry(); out.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); out.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); out.setIndex(idx); return out;
  }
  var pm4 = null, pq = null, pv = null, ps = null, pe = null;
  function pigeonTick(dt, p) {
    if (!pm4) { pm4 = new T.Matrix4(); pq = new T.Quaternion(); pv = new T.Vector3(); ps = new T.Vector3(1, 1, 1); pe = new T.Euler(); }
    var near = Math.hypot(p.x - PG.flock.x, p.z - PG.flock.z) < 60;
    PG.mesh.visible = near; if (!near) return;
    for (var i = 0; i < PG.birds.length; i++) {
      var b = PG.birds[i]; b.t -= dt;
      var g0 = W.groundAt ? W.groundAt(b.x, b.z) : 0;
      if (b.st === 'ground') {
        if (Math.hypot(p.x - b.x, p.z - b.z) < 4) {
          b.st = 'fly'; b.t = 7 + Math.random() * 3; S.ambient.flights++;
          var na = Math.random() * 6.283, nr = 3 + Math.random() * 8, fx = Math.random() < 0.5 ? 0 : 0; b.tx = fx + Math.cos(na) * nr + (b.x > 0 ? -10 : 10); b.tz = 30 + Math.sin(na) * nr;
        } else if (b.t < 0) { b.t = 0.6 + Math.random() * 2.5; b.yaw += (Math.random() - 0.5) * 2; b.hop = 0.25; }
        if (b.hop > 0) { b.hop -= dt; b.x += Math.sin(b.yaw) * dt * 0.8; b.z += Math.cos(b.yaw) * dt * 0.8; }
        var peck = Math.max(0, Math.sin(performance.now() / 180 + i * 1.7)) * 0.5;
        b.y = g0; pe.set(peck, b.yaw, 0);
      } else {
        var k = Math.max(0, b.t) / 9, dx = b.tx - b.x, dz = b.tz - b.z;
        b.yaw = Math.atan2(dx, dz); b.x += dx * Math.min(1, dt * 0.35); b.z += dz * Math.min(1, dt * 0.35);
        b.y = g0 + Math.sin(Math.min(1, 1 - k) * Math.PI) * 6 + 0.2;
        pe.set(-0.3, b.yaw, Math.sin(performance.now() / 60 + i) * 0.4);
        if (b.t < 0) { b.st = 'ground'; b.t = 1; }
      }
      pq.setFromEuler(pe); pm4.compose(pv.set(b.x, b.y + 0.1, b.z), pq, ps); PG.mesh.setMatrixAt(i, pm4);
    }
    PG.mesh.instanceMatrix.needsUpdate = true;
  }
  var tmp = null, limit = 999;
  function step(w, dt, p, idx) {
    // 22.11: only the first `limit` walkers are active (time of day / weather, window.__fyrusPopulation); extra walkers
    // are parked (hidden) when they are more than 40 m away, so nobody vanishes in front of the player
    if (idx >= limit && (!w.live || w.pos.distanceTo(p) > 40)) { if (w.live) S.parked = (S.parked || 0) + 1; w.live = false; w.grp.visible = false; return; }
    if (!w.live || w.pos.distanceTo(p) > 150) {
      var c = spawnCorner(p, w.live ? 45 : 12, 120); if (!c) { w.grp.visible = false; return; }
      if (w.live) S.recycled++; place(w, c); w.live = true; w.grp.visible = true;
    }
    if (!w.next) { pickNext(w); if (!w.next) { w.live = false; return; } }
    var want = w.v, A = S.ambient;
    w.cool = Math.max(0, (w.cool || 0) - dt); w.waveCool = Math.max(0, (w.waveCool || 0) - dt);
    // 22.5 ambient behaviours: pauses (look around / window-shopping / chatting) and waving at the player
    if (AMB && w.pause > 0) {
      w.pause -= dt; w.spd += (0 - w.spd) * Math.min(1, dt * 5);
      var dy0 = ((w.faceYaw - w.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; w.yaw += dy0 * Math.min(1, dt * 4);
      if (w.pendingEmote && w.pause < w.pendingAt) { if (w.lod.emote(w.pendingEmote)) A.emotes++; w.pendingEmote = null; }
      return;
    }
    if (AMB && !w.crossing && !w.cross && w.cool === 0) {
      // window-shopping: once per pavement edge, at a random point, face the block for 3-6 s
      if (w.shopAt != null && w.edgeT != null && w.edgeT > w.shopAt) {
        w.shopAt = null; w.pause = 3 + Math.random() * 3; w.cool = 6;
        var bx = 32 + G * w.at.bi + G / 2, bz = 32 + G * w.at.bj + G / 2; w.faceYaw = Math.atan2(bx - w.pos.x, bz - w.pos.z); A.shops++; return;
      }
      // chatting: two free walkers meeting within 1.6 m stop and face each other
      for (var ci = 0; ci < peds.length; ci++) {
        var o2 = peds[ci]; if (o2 === w || !o2.live || o2.pause > 0 || o2.crossing || o2.cross || (o2.cool || 0) > 0) continue;
        var cx = o2.pos.x - w.pos.x, cz = o2.pos.z - w.pos.z; if (cx * cx + cz * cz > 2.56 || Math.random() > 0.35) continue;
        var dur = 5 + Math.random() * 4;
        w.pause = o2.pause = dur; w.cool = o2.cool = dur + 20;
        w.faceYaw = Math.atan2(cx, cz); o2.faceYaw = Math.atan2(-cx, -cz);
        w.pendingEmote = 'Wave'; w.pendingAt = dur - 0.5; o2.pendingEmote = 'Laugh'; o2.pendingAt = dur - 1.5; A.chats++; return;
      }
    }
    if (AMB && w.waveCool === 0 && !w.crossing) {
      var qx = p.x - w.pos.x, qz = p.z - w.pos.z, qd = Math.hypot(qx, qz);
      if (qd < 5 && qd > 1.5 && (Math.sin(w.yaw) * qx + Math.cos(w.yaw) * qz) / qd > 0.4) {
        w.waveCool = 40; if (Math.random() < 0.5) { w.pause = 2.2; w.faceYaw = Math.atan2(qx, qz); w.pendingEmote = 'Wave'; w.pendingAt = 2.0; A.waves++; return; }
      }
    }
    // crossings: wait at the kerb until the cars on that road have red (or 6 s without a signal system)
    if (w.cross && !w.crossing) {
      var s = sig(w.cross);
      var SG = window.__fyrusSignals, need = 14 / (w.v * 1.4) + 4;
      var go = s ? (s === 'red' && (!SG.redLeft || SG.redLeft(w.cross.jx, w.cross.jz, w.cross.axis) > need)) : w.waitT > 6;
      if (!go) { if (w.waitT === 0) S.waits++; w.waitT += dt; want = 0; if (w.waitT > 40) { w.cross = null; pickNext(w); } }
      else { w.crossing = true; S.crossings++; w.cStart = performance.now(); w.cLeft = SG && SG.redLeft ? SG.redLeft(w.cross.jx, w.cross.jz, w.cross.axis) : null; w.cFrom = { x: w.pos.x, z: w.pos.z }; }
    }
    if (w.crossing) {
      want = w.v * 1.4;
      // hurry when the light is about to change (signal clock is wall time; the sim slows on long frames)
      var SG2 = window.__fyrusSignals;
      if (SG2 && SG2.redLeft && w.cross) { var rem = Math.hypot(w.next.x - w.pos.x, w.next.z - w.pos.z); if (SG2.redLeft(w.cross.jx, w.cross.jz, w.cross.axis) < rem / want + 1) { want = w.v * 2.3; if (!w.hurried) { w.hurried = true; S.hurries = (S.hurries || 0) + 1; } } }
    }
    if (w.crossing && w.cross && !w.cross.flagged && sig(w.cross) === 'green') { var dk = Math.abs(w.cross.axis === 'x' ? w.pos.z - w.cross.jz : w.pos.x - w.cross.jx); if (dk < 3.6) { S.redViolations++; w.cross.flagged = true; (S.viol = S.viol || []).length < 8 && S.viol.push({ left0: w.cLeft && Math.round(w.cLeft * 10) / 10, el: Math.round((performance.now() - w.cStart) / 100) / 10, from: [Math.round(w.cFrom.x), Math.round(w.cFrom.z)], at: [Math.round(w.pos.x), Math.round(w.pos.z)], to: [Math.round(w.next.x), Math.round(w.next.z)], j: [w.cross.jx, w.cross.jz, w.cross.axis], spd: Math.round(w.spd * 10) / 10 }); } }
    var dx = w.next.x - w.pos.x, dz = w.next.z - w.pos.z, d = Math.hypot(dx, dz);
    if (d < 0.5) {
      w.prev = w.at; w.at = w.next; w.crossing = false; w.hurried = false; w.cross = null; pickNext(w);
      if (AMB && Math.random() < 0.2) { w.pause = 2 + Math.random() * 4; w.faceYaw = w.yaw + (Math.random() - 0.5) * 2.4; S.ambient.pauses++; }
      return;
    }
    if (w.edgeFrom !== w.at) { w.edgeFrom = w.at; w.edgeLen = d; w.shopAt = (!w.cross && Math.random() < 0.25) ? 0.3 + Math.random() * 0.4 : null; }
    w.edgeT = w.edgeLen ? 1 - d / w.edgeLen : 0;
    var mx = dx / d, mz = dz / d;
    // separation from other walkers and the player
    var ax = 0, az = 0;
    var farW = Math.abs(w.pos.x - p.x) > 60 || Math.abs(w.pos.z - p.z) > 60;   // 22.12: no separation work for far walkers
    if (!farW) for (var i = 0; i < peds.length; i++) { var o = peds[i]; if (o === w || !o.live) continue; var ox = w.pos.x - o.pos.x, oz = w.pos.z - o.pos.z, od = ox * ox + oz * oz; if (od < 1.21 && od > 1e-4) { od = Math.sqrt(od); ax += ox / od * (1.1 - od); az += oz / od * (1.1 - od); } }
    var px = w.pos.x - p.x, pz = w.pos.z - p.z, pd = Math.hypot(px, pz);
    if (pd < 1.6 && pd > 1e-3) { ax += (-mz * Math.sign(mx * pz - mz * px || 1)) * (1.6 - pd); az += (mx * Math.sign(mx * pz - mz * px || 1)) * (1.6 - pd); want *= 0.6; }
    w.spd += (want - w.spd) * Math.min(1, dt * 3);
    w.pos.x += (mx * w.spd + ax * 1.5) * dt; w.pos.z += (mz * w.spd + az * 1.5) * dt;
    if (w.spd > 0.15) { var ty = Math.atan2(mx, mz), dy = ((ty - w.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI; w.yaw += dy * Math.min(1, dt * 6); }
  }
  var last = performance.now(), acc = 0;
  function tick() {
    var now = performance.now(); if (now - last < 4) return;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    var t0 = now;
    try {
      var inWorld = W.active === W.world;
      if (inWorld && group.parent !== W.world) W.world.add(group);
      if (!inWorld) { if (group.parent) group.parent.remove(group); return; }
      var PF = window.__fyrusPopulation; limit = Math.round(peds.length * (PF && PF.peds != null ? PF.peds : 1)); S.limit = limit;
      var p = W.player.root.position, cam = W.camera.getWorldPosition(tmp || (tmp = new T.Vector3())), tiers = {}, live = 0, near = 0;
      for (var i = 0; i < peds.length; i++) {
        var w = peds[i]; step(w, dt, p, i); if (!w.live) continue; live++;
        if (Math.abs(w.pos.x - p.x) < 20 && Math.abs(w.pos.z - p.z) < 20) near++;
        w.pos.y = W.groundAt ? W.groundAt(w.pos.x, w.pos.z) : 0; w.grp.rotation.y = w.yaw;
        w.lod.update(dt, cam, 0, w.spd, 0);
        var tr = w.lod.tier(); tiers[tr] = (tiers[tr] || 0) + 1;
      }
      if (PG) pigeonTick(dt, p);
      S.walkers = live; S.near = near; if ((acc += dt) > 1) { acc = 0; S.tiers = tiers; }
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
    S.ms = Math.round((S.ms * 0.95 + (performance.now() - t0) * 0.05) * 1000) / 1000;
  }
  function hook() {
    if (hooked) return; var r = W.renderer, orig = r.render;
    r.render = function () { tick(); return orig.apply(this, arguments); }; hooked = true; S.hooked = true;
  }
  (function wait() { var w = window.__fyrusW; if (w && w.renderer && w.player && w.world && window.THREE) start(); else setTimeout(wait, 500); })();
})();
