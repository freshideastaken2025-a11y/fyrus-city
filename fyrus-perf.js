/* Fyrus — performance layer (v1.0)
   1) Static batching: meshes that stand still and share a material inside the same 64 m cell are merged
      into one mesh, so the GPU gets a few hundred draw calls instead of thousands. The original meshes stay
      in the scene (clicks, collisions and flying still use them); they only move to a hidden render layer.
      Anything that starts to move, hides or is removed is given back to the normal renderer and its batch
      is rebuilt, so behaviour does not change.
   2) Adaptive resolution: if the frame rate drops, the render resolution goes down a little; when there is
      headroom it goes back up. Phones stay smooth; PCs keep full sharpness when they can (up to 2x).
   3) Phones on "low": lighter rain/snow particle counts.
   API: window.__fyrusPerf.stats(), .disable(), .enable() */
(function () {
  'use strict';
  if (window.__fyrusPerf) return;
  var LAYER = 7, CELL = 64, MIN_GROUP = 2, VERT_BUDGET = 90000, MAX_VERTS = 400000;
  var on = true, W = null, T = null, ready = false, proto = null;
  var groups = new Map(), owner = new Map(), cand = new Map(), queue = [], volatile = new WeakSet();
  var stats = { groups: 0, merged: 0, scale: 1, fps: 0 };
  var API = window.__fyrusPerf = { version: '1.0.0' };
  API.stats = function () { var s = Object.assign({}, stats); try { s.calls = W.renderer.info.render.calls; s.tris = W.renderer.info.render.triangles; } catch (e) {} return s; };
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var phone = (function () { try { return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } })();

  function shown(o) { var p = o; while (p) { if (!p.visible) return false; if (p === W.world) return true; p = p.parent; } return false; }
  function same(a, b) { for (var i = 0; i < 16; i++) if (Math.abs(a[i] - b[i]) > 1e-5) return false; return true; }
  function sig(g) { var n = Object.keys(g.attributes).sort(); return n.map(function (k) { return k + g.attributes[k].itemSize; }).join(','); }
  function eligible(o) {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.geometry || !o.material || volatile.has(o)) return false;
    if (Array.isArray(o.material) || !o.geometry.isBufferGeometry) return false;
    var m = o.material, g = o.geometry;
    if (m.isShaderMaterial || m.isRawShaderMaterial || m.transparent || m.isMeshDepthMaterial || m.wireframe) return false;
    if (o.onBeforeRender !== proto || o.renderOrder) return false;
    if (o.morphTargetInfluences && o.morphTargetInfluences.length) return false;
    if (g.morphAttributes && Object.keys(g.morphAttributes).length) return false;
    if (!g.attributes.position || g.attributes.position.count > 30000) return false;
    if (g.groups && g.groups.length > 1) return false;
    return true;
  }
  function skipRoots() {
    var s = new Set();
    try { s.add(W.player.root); } catch (e) {}
    try { if (W.traffic && W.traffic.group) s.add(W.traffic.group); } catch (e) {}
    try { W.peers && W.peers.forEach(function (p) { if (p && p.root) s.add(p.root); }); } catch (e) {}
    try { (W.bots || []).forEach(function (b) { if (b && b.root) s.add(b.root); }); } catch (e) {}
    [W.npcs, W.innerNpcs].forEach(function (g) { try { (g && g.list || []).forEach(function (n) { var r = n && (n.av && n.av.root || n.root); if (r) s.add(r); }); } catch (e) {} });
    try { (W.dancers || []).forEach(function (d) { var r = d && (d.root || d.av && d.av.root || (d.isObject3D && d)); if (r) s.add(r); }); } catch (e) {}
    try { if (W.vehicle) s.add(W.vehicle.isObject3D ? W.vehicle : W.vehicle.root); } catch (e) {}
    try { if (W.clickMarker) s.add(W.clickMarker); if (W.waypointBeam) s.add(W.waypointBeam); } catch (e) {}
    try { if (W.env) { s.add(W.env.sky); s.add(W.env.rain); s.add(W.env.snow); } } catch (e) {}
    try { W.allInteracts().forEach(function (it) { if (it && it.obj) s.add(it.obj); }); } catch (e) {}
    return s;
  }

  /* ---------- scan: find meshes that have been still for 3 scans ---------- */
  function scan() {
    if (!on || !W || W.active !== W.world) return;
    var skip = skipRoots(), seen = new Set(), want = new Map();
    (function walk(o) {
      if (skip.has(o) || (o.userData && (o.userData.__fxBatch || o.userData.noBatch))) return;
      if (o.name && /^fyrus-|^fx-/.test(o.name)) return;
      if (o.isMesh && eligible(o)) {
        var m = o.matrixWorld.elements, c = cand.get(o);
        seen.add(o);
        if (!c) cand.set(o, c = { m: m.slice(), stable: 0 });
        else if (same(c.m, m)) c.stable++;
        else { c.m = m.slice(); c.stable = 0; }
        if (c.stable >= 2 && shown(o)) {
          var k = o.material.uuid + '|' + Math.floor(m[12] / CELL) + ',' + Math.floor(m[14] / CELL) + '|' + (o.castShadow ? 1 : 0) + (o.receiveShadow ? 1 : 0) + '|' + sig(o.geometry);
          var l = want.get(k); if (!l) want.set(k, l = []); l.push(o);
        }
      }
      for (var i = 0; i < o.children.length; i++) walk(o.children[i]);
    })(W.world);
    cand.forEach(function (v, o) { if (!seen.has(o)) cand.delete(o); });
    /* groups whose members disappeared (a city block was unloaded) */
    groups.forEach(function (g, k) {
      var keep = g.members.filter(function (o) { return seen.has(o); });
      if (keep.length !== g.members.length) enqueue(k, keep);
    });
    want.forEach(function (list, k) {
      var g = groups.get(k);
      if (!g && list.length < MIN_GROUP) return;
      if (g && list.length === g.members.length && list.every(function (o) { return owner.get(o) === g; })) return;
      enqueue(k, list);
    });
  }
  function enqueue(k, list) {
    for (var i = 0; i < queue.length; i++) if (queue[i].k === k) { queue[i].list = list; return; }
    queue.push({ k: k, list: list });
  }

  /* ---------- merge ---------- */
  var v3 = null, n3 = null, nm = null;
  function merge(list) {
    if (!v3) { v3 = new T.Vector3(); n3 = new T.Vector3(); nm = new T.Matrix3(); }
    var g0 = list[0].geometry, names = Object.keys(g0.attributes), vtot = 0, itot = 0;
    list.forEach(function (o) { var g = o.geometry, c = g.attributes.position.count; vtot += c; itot += g.index ? g.index.count : c; });
    if (vtot > MAX_VERTS) return null;
    var out = {}; names.forEach(function (n) { out[n] = new Float32Array(vtot * g0.attributes[n].itemSize); });
    var idx = vtot > 65535 ? new Uint32Array(itot) : new Uint16Array(itot), vo = 0, io = 0;
    list.forEach(function (o) {
      var g = o.geometry, mw = o.matrixWorld, c = g.attributes.position.count, flip = mw.determinant() < 0;
      nm.getNormalMatrix(mw);
      names.forEach(function (n) {
        var a = g.attributes[n], s = a.itemSize, dst = out[n], base = vo * s, i;
        if (n === 'position') { for (i = 0; i < c; i++) { v3.fromBufferAttribute(a, i).applyMatrix4(mw); dst[base + i * 3] = v3.x; dst[base + i * 3 + 1] = v3.y; dst[base + i * 3 + 2] = v3.z; } }
        else if (n === 'normal') { for (i = 0; i < c; i++) { n3.fromBufferAttribute(a, i).applyMatrix3(nm).normalize(); dst[base + i * 3] = n3.x; dst[base + i * 3 + 1] = n3.y; dst[base + i * 3 + 2] = n3.z; } }
        else { for (i = 0; i < c; i++) { dst[base + i * s] = a.getX(i); if (s > 1) dst[base + i * s + 1] = a.getY(i); if (s > 2) dst[base + i * s + 2] = a.getZ(i); if (s > 3) dst[base + i * s + 3] = a.getW(i); } }
      });
      var t;
      if (g.index) { var ia = g.index, ic = ia.count; for (t = 0; t + 2 < ic; t += 3) { var a0 = ia.getX(t), a1 = ia.getX(t + 1), a2 = ia.getX(t + 2); idx[io++] = vo + a0; idx[io++] = vo + (flip ? a2 : a1); idx[io++] = vo + (flip ? a1 : a2); } }
      else { for (t = 0; t + 2 < c; t += 3) { idx[io++] = vo + t; idx[io++] = vo + (flip ? t + 2 : t + 1); idx[io++] = vo + (flip ? t + 1 : t + 2); } }
      vo += c;
    });
    var geo = new T.BufferGeometry();
    names.forEach(function (n) { geo.setAttribute(n, new T.BufferAttribute(out[n], g0.attributes[n].itemSize, g0.attributes[n].normalized)); });
    geo.setIndex(new T.BufferAttribute(idx.subarray(0, io), 1));
    geo.computeBoundingSphere(); geo.computeBoundingBox();
    return { geo: geo, verts: vtot };
  }
  function restore(o) { var g = owner.get(o); if (!g) return; o.layers.mask = g.masks.get(o) || 1; owner.delete(o); }
  function drop(k) {
    var g = groups.get(k); if (!g) return;
    g.members.forEach(restore);
    if (g.mesh.parent) g.mesh.parent.remove(g.mesh);
    g.mesh.geometry.dispose();
    groups.delete(k);
  }
  function build(k, list) {
    var old = groups.get(k);
    list = list.filter(function (o) { return o.parent && shown(o) && !volatile.has(o) && (!owner.get(o) || owner.get(o) === old); });
    if (list.length < MIN_GROUP) { drop(k); return 0; }
    var r = merge(list);
    if (!r) { drop(k); return 0; }
    var src = list[0], mesh = new T.Mesh(r.geo, src.material);
    mesh.matrixAutoUpdate = false; mesh.name = 'fx-batch';
    mesh.userData.__fxBatch = true; mesh.userData.noBlock = true;
    mesh.castShadow = src.castShadow; mesh.receiveShadow = src.receiveShadow;
    mesh.raycast = function () {};
    var masks = old ? old.masks : new Map();
    if (old) { old.members.forEach(function (o) { if (list.indexOf(o) < 0) restore(o); }); if (old.mesh.parent) old.mesh.parent.remove(old.mesh); old.mesh.geometry.dispose(); }
    var g = { key: k, mesh: mesh, members: list, masks: masks, mats: list.map(function (o) { return o.matrixWorld.elements.slice(); }) };
    list.forEach(function (o) { if (!masks.has(o)) masks.set(o, o.layers.mask); owner.set(o, g); o.layers.set(LAYER); });
    groups.set(k, g);
    W.world.add(mesh);
    return r.verts;
  }
  function work() {
    var budget = VERT_BUDGET;
    while (queue.length && budget > 0) { var q = queue.shift(); budget -= Math.max(2000, build(q.k, q.list)); }
    stats.groups = groups.size; stats.merged = owner.size; stats.queue = queue.length;
  }
  /* members that moved or were hidden: hand them back and rebuild the batch */
  var checkIdx = 0;
  function check() {
    var list = Array.from(groups.values()); if (!list.length) return;
    var n = Math.max(1, Math.ceil(list.length / 8));
    for (var i = 0; i < n; i++) {
      var g = list[(checkIdx + i) % list.length], bad = [];
      if (!g) continue;
      g.members.forEach(function (o, j) { if (!shown(o) || !same(g.mats[j], o.matrixWorld.elements)) bad.push(o); });
      if (bad.length) {
        bad.forEach(function (o) { volatile.add(o); restore(o); cand.delete(o); });
        var keep = g.members.filter(function (o) { return bad.indexOf(o) < 0; });
        if (keep.length < MIN_GROUP) drop(g.key);
        else { g.members = keep; g.mats = keep.map(function (o) { return o.matrixWorld.elements.slice(); }); enqueue(g.key, keep); }
      }
    }
    checkIdx = (checkIdx + n) % list.length;
  }
  function releaseAll() { Array.from(groups.keys()).forEach(drop); cand.clear(); queue.length = 0; stats.groups = 0; stats.merged = 0; }
  API.disable = function () { on = false; releaseAll(); };
  API.enable = function () { on = true; };

  /* ---------- adaptive resolution ---------- */
  var frames = 0, acc = 0, lastT = 0, scale = 1, slowFor = 0, fastFor = 0;
  function caps() {
    var q = (S() && S().settings && S().settings.quality) || 'high';
    var dpr = window.devicePixelRatio || 1;
    var cap = q === 'low' ? 1 : q === 'medium' ? 1.35 : (phone ? 1.5 : 2);
    return { q: q, base: Math.min(dpr, cap), min: phone ? .6 : .75 };
  }
  function governor(dt) {
    if (document.hidden || !W || !W.renderer) return;
    frames++; acc += dt;
    if (acc < 1.5) return;
    var fps = frames / acc; frames = 0; acc = 0; stats.fps = Math.round(fps);
    var c = caps();
    if (fps < 40) { slowFor++; fastFor = 0; } else if (fps > 55) { fastFor++; slowFor = 0; } else { slowFor = 0; fastFor = 0; }
    if (slowFor >= 2) { scale = Math.max(c.min / c.base, scale - .1); slowFor = 0; }
    if (fastFor >= 4) { scale = Math.min(1, scale + .05); fastFor = 0; }
    var pr = Math.max(.5, Math.round(c.base * scale * 100) / 100);
    stats.scale = Math.round(scale * 100) / 100; stats.pixelRatio = pr;
    if (Math.abs(pr - W.renderer.getPixelRatio()) > .01) { W.renderer.setPixelRatio(pr); try { W.resize(); } catch (e) {} }
    lowExtras(c.q);
  }
  var lowSet = null;
  function lowExtras(q) {
    if (!W.env || lowSet === q) return; lowSet = q;
    try {
      var r = W.env.rain.geometry, s = W.env.snow.geometry, f = q === 'low' ? .4 : q === 'medium' ? .7 : 1;
      r.setDrawRange(0, Math.floor(r.attributes.position.count * f / 2) * 2);
      s.setDrawRange(0, Math.floor(s.attributes.position.count * f));
    } catch (e) {}
  }

  /* ---------- loop ---------- */
  var nextScan = 0, fc = 0;
  function init() {
    W = window.__fyrusW; T = window.THREE;
    if (!W || !W.renderer || !W.world || !T) return false;
    proto = T.Object3D.prototype.onBeforeRender;
    try { W.ray && W.ray.layers.enable(LAYER); W.raycaster && W.raycaster.layers.enable(LAYER); } catch (e) {}
    ready = true; nextScan = performance.now() + 2500;
    return true;
  }
  function step(hiddenTick) {
    if (!ready && !init()) return;
    if (window.__fyrusW !== W) { groups.clear(); owner.clear(); cand.clear(); queue.length = 0; ready = false; return; }
    fc++;
    if (!on) return;
    try {
      if (queue.length) work();
      if (hiddenTick || fc % 5 === 0) check();
      var now = performance.now();
      if (now > nextScan) { nextScan = now + 1700; scan(); }
    } catch (e) { if (window.console) console.warn('[fyrus-perf] batching off', e); API.err = String(e && e.message); API.disable(); }
  }
  function loop(now) {
    requestAnimationFrame(loop);
    var dt = lastT ? Math.min(.25, (now - lastT) / 1000) : 0; lastT = now;
    if (ready) governor(dt);
    step(false);
  }
  requestAnimationFrame(loop);
  /* a hidden tab gets no animation frames — keep batching alive at a slow pace */
  setInterval(function () { if (document.hidden) step(true); }, 2000);
})();
