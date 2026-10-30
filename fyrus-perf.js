/* Fyrus — performance layer (v1.0)
   1) Static batching: meshes that stand still and share a material inside the same 64 m cell are merged
      into one mesh, so the GPU gets a few hundred draw calls instead of thousands. The original meshes stay
      in the scene (clicks, collisions and flying still use them); they only move to a hidden render layer.
      Anything that starts to move, hides or is removed is given back to the normal renderer and its batch
      is rebuilt, so behaviour does not change.
   2) Adaptive resolution: if the frame rate drops, the render resolution goes down a little; when there is
      headroom it goes back up. Phones stay smooth; PCs keep full sharpness when they can (up to 2x).
   3) Phones on "low": lighter rain/snow particle counts.
   API: window.__fyrusPerf.stats(), .disable(), .enable()
   Phase 16 (local engine copy): batches now group meshes by material LOOK, not material object, so the many
   identical-looking material instances the builders create merge together; mixed groups render with a private
   clone and every member's material is watched (any change hands that member back, like movement does).
   The resolution governor is CPU-aware (it no longer blurs the image when the CPU, not the GPU, is the limit)
   and takes its limits from the Phase 16 quality profile (window.__fyrusQuality). Phase 16 also merges single-material meshes whose geometry has groups (Box/Cylinder).
   Disable: ?p16off=batchlook / batchgroups / batchfar / governor */
(function () {
  'use strict';
  if (window.__fyrusPerf) return;
  var LAYER = 7, CELL = 64, MIN_GROUP = 2, VERT_BUDGET = 90000, MAX_VERTS = 400000;
  var CHUNK_VERTS = 360000;
  /* Phase 19.14: batched members are hidden (layer 7) static scenery, so three does not need to recompute their world
     matrices every frame. Leaf members (no children) get matrixWorldAutoUpdate=false while batched; check() watches
     their LOCAL pose instead and hands a moved member back (it then updates normally). Off: ?p16off=staticmw */
  var STATICMW = (function () { try { return (new URLSearchParams(location.search).get('p16off') || '').split(',').indexOf('staticmw') < 0; } catch (e) { return true; } })();
  function pose(o) { var p = o.position, q = o.quaternion, s = o.scale; return [p.x, p.y, p.z, q.x, q.y, q.z, q.w, s.x, s.y, s.z]; }
  /* ancestors of batched members (chunk / home groups, and the scene root) are static too: stop recomposing them, so
     three no longer force-updates every descendant each frame. Their pose is watched EVERY frame (a few hundred
     objects): one that moves or leaves the world gets matrixAutoUpdate back immediately, so nothing ever lags. */
  var SANC = new Map();
  function markAncestors(o) {
    for (var p = o.parent; p; p = p.parent) {
      if (SANC.has(p)) break;
      if (!p.matrixAutoUpdate) { if (p === W.world) break; continue; }
      p.updateMatrix(); p.matrixAutoUpdate = false; SANC.set(p, pose(p));
      if (p === W.world) break;
    }
  }
  function watchAncestors() {
    if (!SANC.size) return;
    // 19.14b: every 30 frames also drop ancestors no longer connected to W.world (a removed chunk's inner groups
    // still have a parent, so the direct `!o.parent` test missed them and SANC kept whole detached subtrees alive).
    var full = (++ancTick % 30) === 0;
    SANC.forEach(function (ps, o) {
      var gone = o !== W.world && (!o.parent || (full && !inWorld(o)));
      if (gone || !samePose(ps, o)) { o.matrixAutoUpdate = true; o.matrixWorldNeedsUpdate = true; SANC.delete(o); if (gone) stats.ancDetached = (stats.ancDetached || 0) + 1; else stats.ancMoved = (stats.ancMoved || 0) + 1; }
    });
    stats.staticAncestors = SANC.size;
  }
  var ancTick = 0;
  function inWorld(o) { for (var p = o; p; p = p.parent) if (p === W.world) return true; return false; }
  function releaseAncestors() { SANC.forEach(function (ps, o) { o.matrixAutoUpdate = true; o.matrixWorldNeedsUpdate = true; }); SANC.clear(); }
  function samePose(a, o) { var p = o.position, q = o.quaternion, s = o.scale; return a[0] === p.x && a[1] === p.y && a[2] === p.z && a[3] === q.x && a[4] === q.y && a[5] === q.z && a[6] === q.w && a[7] === s.x && a[8] === s.y && a[9] === s.z; }   /* Phase 18.1: oversized groups are split into chunks of this many vertices */
  var on = true, W = null, T = null, ready = false, proto = null;
  if (P16OFF_EARLY()) on = false;   /* 18.2 diagnostics: ?p16off=batch turns static batching off */
  function P16OFF_EARLY() { try { return (new URLSearchParams(location.search).get('p16off') || '').split(',').indexOf('batch') >= 0; } catch (e) { return false; } }
  var groups = new Map(), owner = new Map(), cand = new Map(), queue = [], volatile = new WeakSet();
  var metricsOn = /(?:^|[?&])devmetrics=1(?:&|$)/.test(location.search), frameTimes = [], lastFrame = 0, metricsStamp = 0;
  var stats = { groups: 0, merged: 0, scale: 1, fps: 0, scanMs: 0, metricsEnabled: metricsOn, avgFrameMs: 0, frameP99Ms: 0, heapUsedMb: null, heapLimitMb: null, loadMs: null, errors: 0 };
  var API = window.__fyrusPerf = { version: '1.1.0-p16' };
  var P16OFF = (function () { try { return (new URLSearchParams(location.search).get('p16off') || '').split(','); } catch (e) { return []; } })();
  var LOOK = P16OFF.indexOf('all') < 0 && P16OFF.indexOf('batchlook') < 0;
  var GOV16 = P16OFF.indexOf('all') < 0 && P16OFF.indexOf('governor') < 0;
  var GROUPS16 = P16OFF.indexOf('all') < 0 && P16OFF.indexOf('batchgroups') < 0;
  /* Phase 16 cell size for batches (metres): 128 m (measured best of 64 / 96 / 128 on the M4 Pro; 64 m = original).
     A/B with ?p16cell=<32..256> */
  if (LOOK) CELL = 256;   // 21.13: 128 -> 256 measured +4-6 % fps, -7 % draws (CPU-bound stops)
  (function () { try { var c = +new URLSearchParams(location.search).get('p16cell'); if (c >= 32 && c <= 256) CELL = c; } catch (e) {} })();
  API.holders = function (o) { var h = []; if (cand.has(o)) h.push('cand'); if (owner.has(o)) h.push('owner'); if (volatile.has(o)) h.push('volatile');
    groups.forEach(function (g, k) { if (g.mesh === o) h.push('groupMesh'); if (g.members.indexOf(o) >= 0) h.push('groupMember'); if (g.masks.has(o)) h.push('masks'); });
    queue.forEach(function (q) { if (q.list.indexOf(o) >= 0) h.push('queue'); }); return h; };
  API.debug = function () { var det = 0, mem = 0, detMem = 0; groups.forEach(function (g) { mem += g.members.length; if (!g.mesh.parent) det++; g.members.forEach(function (o) { if (!shown(o)) detMem++; }); }); return { groups: groups.size, detachedBatchMeshes: det, members: mem, membersNotShown: detMem, owner: owner.size, cand: cand.size, queue: queue.length, canon: canon.size }; };
  API.stats = function () { var s = Object.assign({}, stats); try { s.calls = W.renderer.info.render.calls; s.tris = W.renderer.info.render.triangles; s.geometries = W.renderer.info.memory.geometries; s.textures = W.renderer.info.memory.textures; } catch (e) {} try { if (performance.memory) { s.heapUsedMb = Math.round(performance.memory.usedJSHeapSize / 104857.6) / 10; s.heapLimitMb = Math.round(performance.memory.jsHeapSizeLimit / 104857.6) / 10; } } catch (e) {} return s; };
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var phone = (function () { try { return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } })();
  function metricFrame(now) { if (!metricsOn) return; if (lastFrame) { var d = Math.min(250, now - lastFrame); frameTimes.push(d); if (frameTimes.length > 180) frameTimes.shift(); } lastFrame = now; if (now - metricsStamp > 500) { metricsStamp = now; var a = frameTimes.slice().sort(function (x, y) { return x - y; }); if (a.length) { var sum = frameTimes.reduce(function (x, y) { return x + y; }, 0); stats.avgFrameMs = Math.round(sum / a.length * 100) / 100; stats.frameP99Ms = Math.round(a[Math.min(a.length - 1, Math.floor(a.length * .99))] * 100) / 100; stats.fps = Math.round(1000 / stats.avgFrameMs); } } }
  if (metricsOn) { stats.loadMs = Math.round(performance.now() * 100) / 100; function reportError(kind, message, stack) { stats.errors++; try { fetch('/api/dev/errors', { method: 'POST', headers: { 'content-type': 'application/json', 'x-fyrus-dev-metrics': '1' }, body: JSON.stringify({ kind: kind, message: String(message || ''), stack: String(stack || ''), url: location.pathname }) }); } catch (e) {} } addEventListener('error', function (e) { reportError('error', e.message, e.error && e.error.stack); }); addEventListener('unhandledrejection', function (e) { var r = e.reason || {}; reportError('unhandledrejection', r.message || r, r.stack); }); setInterval(function () { try { fetch('/api/dev/telemetry', { method: 'POST', headers: { 'content-type': 'application/json', 'x-fyrus-dev-metrics': '1' }, body: JSON.stringify({ scene: (W && W.active === W.world) ? 'core' : 'unknown', metrics: API.stats(), loadMs: stats.loadMs, errors: stats.errors, }) }); } catch (e) {} }, 2000); }

  function shown(o) { var p = o; while (p) { if (!p.visible) return false; if (p === W.world) return true; p = p.parent; } return false; }
  function same(a, b) { for (var i = 0; i < 16; i++) if (Math.abs(a[i] - b[i]) > 1e-5) return false; return true; }
  /* material "look": two materials with the same look render identically, so their meshes can share a batch */
  var lookCache = new WeakMap(), lookIds = new Map(), lookN = 0;
  var TEX = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap', 'bumpMap', 'lightMap', 'envMap', 'specularMap', 'displacementMap'];
  var NUM = ['roughness', 'metalness', 'emissiveIntensity', 'opacity', 'alphaTest', 'side', 'flatShading', 'vertexColors', 'fog', 'toneMapped', 'depthTest', 'depthWrite', 'colorWrite', 'polygonOffset', 'polygonOffsetFactor', 'polygonOffsetUnits', 'blending', 'shininess', 'reflectivity', 'envMapIntensity', 'aoMapIntensity', 'bumpScale', 'lightMapIntensity', 'wireframe', 'dithering', 'premultipliedAlpha', 'visible', 'normalMapType'];
  function snap(m) {
    var a = [m.type, m.color ? m.color.r : -1, m.color ? m.color.g : -1, m.color ? m.color.b : -1, m.emissive ? m.emissive.r : -1, m.emissive ? m.emissive.g : -1, m.emissive ? m.emissive.b : -1, m.specular ? m.specular.getHex() : -1];
    for (var i = 0; i < NUM.length; i++) a.push(m[NUM[i]]);
    for (i = 0; i < TEX.length; i++) a.push(m[TEX[i]] ? m[TEX[i]].uuid : 0);
    if (m.normalScale) a.push(m.normalScale.x, m.normalScale.y);
    a.push(m.onBeforeCompile === proto16 ? 0 : m.uuid, m.customProgramCacheKey === pck16 ? 0 : m.uuid, m.defines ? JSON.stringify(m.defines) : 0, m.clippingPlanes ? m.uuid : 0, m.userData && m.userData.noBatchLook ? m.uuid : 0);
    return a.join('|');
  }
  var proto16 = null, pck16 = null, scanNo = 0;
  function look(m) {
    if (!LOOK) return m.uuid;
    var c = lookCache.get(m);
    if (c && scanNo - c.at < 5) return c.id;           /* re-check each material's look every 5th scan; batched members of mixed groups are watched by check() */
    var s = snap(m);
    if (c && c.s === s) { c.at = scanNo; return c.id; }
    var id = lookIds.get(s); if (!id) { id = 'L' + (++lookN); lookIds.set(s, id); }
    lookCache.set(m, { s: s, id: id, at: scanNo });
    return id;
  }
  function NORAY() {}                /* shared no-op raycast for batch meshes (module scope: retains nothing) */
  var canon = new Map();            /* look id -> private clone used by mixed batches */
  function canonFor(id, m) { var c = canon.get(id); if (!c) { c = m.clone(); c.name = 'fx-canon'; c.userData = { fxCanon: true }; canon.set(id, c); } return c; }
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
    /* Phase 16: geometry "groups" only matter for multi-material meshes (arrays are excluded above). With one
       material three.js draws the whole geometry in a single call and ignores groups, so Box/Cylinder geometry
       (6 / 3 groups each — most of the city's props) can be merged like anything else. A limited drawRange still
       blocks merging, because merging would draw the hidden part. */
    if (g.drawRange && (g.drawRange.start !== 0 || g.drawRange.count !== Infinity)) return false;
    if (g.groups && g.groups.length > 1 && !GROUPS16) return false;
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
    /* interactable objects (shops, doors, signs, products): Phase 16 lets the ones further than 25 m from the
       player batch too — anything within reach is handed back to the normal renderer before you can use it */
    var FARI = LOOK && P16OFF.indexOf('batchfar') < 0, pp = null; try { pp = W.player.root.position; } catch (e) {}
    try { W.allInteracts().forEach(function (it) { if (!it || !it.obj) return; if (FARI && pp && it.pos && Math.hypot(it.pos.x - pp.x, it.pos.z - pp.z) > 25) return; s.add(it.obj); }); } catch (e) {}
    return s;
  }

  /* ---------- scan: find meshes that have been still for 3 scans ---------- */
  function scan() {
    if (!on || !W || W.active !== W.world) return;
    var scanStart = performance.now(); scanNo++;
    var skip = skipRoots(), seen = new Set(), want = new Map();
    (function walk(o) {
      if (!o || !o.children) return;
      if (skip.has(o) || (o.userData && (o.userData.__fxBatch || o.userData.noBatch))) return;
      if (o.name && /^fyrus-|^fx-/.test(o.name)) return;
      if (o.isMesh && eligible(o)) {
        var m = o.matrixWorld.elements, c = cand.get(o);
        seen.add(o);
        if (!c) cand.set(o, c = { m: m.slice(), stable: 0 });
        else if (same(c.m, m)) c.stable++;
        else { c.m = m.slice(); c.stable = 0; }
        if (c.stable >= 2 && shown(o)) {
          var k = look(o.material) + '|' + Math.floor(m[12] / CELL) + ',' + Math.floor(m[14] / CELL) + '|' + (o.castShadow ? 1 : 0) + (o.receiveShadow ? 1 : 0) + '|' + sig(o.geometry);
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
    /* Phase 18.1: a (look, cell) group bigger than MAX_VERTS used to fail merge() and stay as N separate draws
       (dense leaf-card tree crowns in Fyrus Core hit this). Split it into spatially sorted chunks instead. */
    var split = [];
    want.forEach(function (list, k) {
      var vt = 0; list.forEach(function (o) { vt += o.geometry.attributes.position.count; });
      if (vt <= CHUNK_VERTS) return;
      list.sort(function (a, b) { var ma = a.matrixWorld.elements, mb = b.matrixWorld.elements; return (ma[12] - mb[12]) || (ma[14] - mb[14]); });
      var part = [], acc = 0, ci = 0;
      list.forEach(function (o) { var c = o.geometry.attributes.position.count; if (part.length && acc + c > CHUNK_VERTS) { split.push([k + '#' + (ci++), part]); part = []; acc = 0; } part.push(o); acc += c; });
      if (part.length) split.push([k + '#' + ci, part]);
      if (groups.has(k)) drop(k);
      want.delete(k); stats.splitGroups = (stats.splitGroups || 0) + 1;
    });
    split.forEach(function (e) { want.set(e[0], e[1]); });
    want.forEach(function (list, k) {
      var g = groups.get(k);
      if (!g && list.length < MIN_GROUP) return;
      if (g && list.length === g.members.length && list.every(function (o) { return owner.get(o) === g; })) return;
      enqueue(k, list);
    });
    stats.scanMs = Math.round((performance.now() - scanStart) * 100) / 100;
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
  function restore(o) { var g = owner.get(o); if (!g) return; o.layers.mask = g.masks.get(o) || 1; owner.delete(o); if (o.matrixWorldAutoUpdate === false && o.userData.__fxMW) { o.matrixWorldAutoUpdate = true; delete o.userData.__fxMW; o.matrixWorldNeedsUpdate = true; } }
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
    var src = list[0], mixed = false;
    for (var mi = 1; mi < list.length; mi++) if (list[mi].material !== src.material) { mixed = true; break; }
    var bmat = mixed ? canonFor(look(src.material), src.material) : src.material;
    var mesh = new T.Mesh(r.geo, bmat);
    mesh.matrixAutoUpdate = false; mesh.name = 'fx-batch';
    mesh.userData.__fxBatch = true; mesh.userData.noBlock = true;
    mesh.castShadow = src.castShadow; mesh.receiveShadow = src.receiveShadow;
    mesh.raycast = NORAY;   /* 18.2: was `function () {}` here, which captured build()'s scope (old group -> its mesh -> its closure ...): every previous batch version and its members stayed alive */
    var masks = old ? old.masks : new Map();
    if (old) { old.members.forEach(function (o) { if (list.indexOf(o) < 0) restore(o); }); if (old.mesh.parent) old.mesh.parent.remove(old.mesh); old.mesh.geometry.dispose(); }
    var g = { key: k, mesh: mesh, members: list, masks: masks, mats: list.map(function (o) { return o.matrixWorld.elements.slice(); }), mixed: mixed, looks: mixed ? list.map(function (o) { return snap(o.material); }) : null };
    list.forEach(function (o) { if (!masks.has(o)) masks.set(o, o.layers.mask); owner.set(o, g); o.layers.set(LAYER);
      if (STATICMW && !o.children.length && o.matrixWorldAutoUpdate !== false) { o.matrixWorldAutoUpdate = false; o.userData.__fxMW = true; markAncestors(o); } });
    if (STATICMW) g.poses = list.map(pose);
    /* 18.1: forget the saved layer masks of ex-members (streamed-out meshes were kept alive by this map) */
    if (masks.size > list.length) { var ls = new Set(list); masks.forEach(function (v, o) { if (!ls.has(o)) masks.delete(o); }); }
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
      g.members.forEach(function (o, j) { if (!shown(o) || !same(g.mats[j], o.matrixWorld.elements) || (g.poses && !samePose(g.poses[j], o)) || (g.mixed && snap(o.material) !== g.looks[j])) bad.push(o); });
      if (bad.length) {
        bad.forEach(function (o) { volatile.add(o); restore(o); cand.delete(o); });
        var keep = g.members.filter(function (o) { return bad.indexOf(o) < 0; });
        if (keep.length < MIN_GROUP) drop(g.key);
        else { g.members = keep; g.mats = keep.map(function (o) { return o.matrixWorld.elements.slice(); }); if (g.poses) g.poses = keep.map(pose); if (g.mixed) g.looks = keep.map(function (o) { return snap(o.material); }); enqueue(g.key, keep); }
      }
    }
    checkIdx = (checkIdx + n) % list.length;
  }
  function releaseAll() { releaseAncestors(); Array.from(groups.keys()).forEach(drop); cand.clear(); queue.length = 0; stats.groups = 0; stats.merged = 0; }
  /* Phase 18: a layer that intentionally changes a static mesh's material/geometry (fyrus-cinematic18.js) hands it
     back here instead of letting check() mark it volatile forever; it is re-batched under its new look by a later scan */
  API.changed = function (o) {
    if (!o) return;
    var g = owner.get(o);
    if (g) {
      restore(o);
      var keep = g.members.filter(function (x) { return x !== o; });
      if (keep.length < MIN_GROUP) drop(g.key);
      else { g.members = keep; g.mats = keep.map(function (x) { return x.matrixWorld.elements.slice(); }); if (g.poses) g.poses = keep.map(pose); if (g.mixed) g.looks = keep.map(function (x) { return snap(x.material); }); enqueue(g.key, keep); }
    }
    cand.delete(o); volatile.delete(o);
  };
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
    var QP = GOV16 && window.__fyrusQuality && window.__fyrusQuality.params;
    if (QP) {
      /* Phase 16: limits from the quality profile; only lower resolution when the GPU is the bottleneck.
         When the engine's own JS frame (tick) already takes most of the frame, a smaller image cannot help. */
      c = { q: c.q, base: Math.min(window.devicePixelRatio || 1, QP.pixelRatioMax), min: QP.pixelRatioMinFrac * Math.min(window.devicePixelRatio || 1, QP.pixelRatioMax) };
      var tick = window.__fyrusEngine16 && window.__fyrusEngine16.tickMs, frameMs = 1000 / Math.max(1, fps);
      var cpuBound = tick != null && tick > 0.7 * frameMs;
      stats.cpuBound = cpuBound; stats.tickMs = tick != null ? Math.round(tick * 10) / 10 : null;
      var lowFps = QP.targetFps * 0.72, highFps = QP.targetFps * 0.92;
      if (fps < lowFps && !cpuBound) { slowFor++; fastFor = 0; }
      else if (fps > highFps || cpuBound) { fastFor++; slowFor = 0; }
      else { slowFor = 0; fastFor = 0; }
      if (slowFor >= 2) { scale = Math.max(c.min / c.base, scale - .1); slowFor = 0; }
      if (fastFor >= (cpuBound ? 2 : 4)) { scale = Math.min(1, scale + .05); fastFor = 0; }
    } else {
      if (fps < 40) { slowFor++; fastFor = 0; } else if (fps > 55) { fastFor++; slowFor = 0; } else { slowFor = 0; fastFor = 0; }
      if (slowFor >= 2) { scale = Math.max(c.min / c.base, scale - .1); slowFor = 0; }
      if (fastFor >= 4) { scale = Math.min(1, scale + .05); fastFor = 0; }
    }
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
    proto = T.Object3D.prototype.onBeforeRender; proto16 = T.Material.prototype.onBeforeCompile; pck16 = T.Material.prototype.customProgramCacheKey;
    try { W.ray && W.ray.layers.enable(LAYER); W.raycaster && W.raycaster.layers.enable(LAYER); } catch (e) {}
    ready = true; nextScan = performance.now() + (phone ? 3000 : 2500);
    return true;
  }
  function step(hiddenTick) {
    if (!ready && !init()) return;
    if (window.__fyrusW !== W) { groups.clear(); owner.clear(); cand.clear(); queue.length = 0; ready = false; return; }
    fc++;
    if (!on) return;
    try {
      if (STATICMW) watchAncestors();
      if (queue.length) work();
      if (hiddenTick || fc % 5 === 0) check();
      var now = performance.now();
      if (now > nextScan) { nextScan = now + (phone ? 2200 : 1700); scan(); }
    } catch (e) { if (window.console) console.warn('[fyrus-perf] batching off', e); API.err = String(e && e.message); API.disable(); }
  }
  function loop(now) {
    requestAnimationFrame(loop);
    metricFrame(now);
    var dt = lastT ? Math.min(.25, (now - lastT) / 1000) : 0; lastT = now;
    if (ready) governor(dt);
    step(false);
  }
  requestAnimationFrame(loop);
  /* a hidden tab gets no animation frames — keep batching alive at a slow pace */
  setInterval(function () { if (document.hidden) step(true); }, 2000);
})();
