/* FYRUS City — Phase 17 engine layer (DEV-ONLY, local copy fyrus-city-phase17-engine). Loaded after fyrus-engine16.js.
 *
 * 1. Actor instancing. Citizens (procedural Nn avatars: NPCs, street bots, interior NPCs, dancers) and traffic cars
 *    are built from ~1,800 small meshes that are drawn one by one (~37 draw calls per citizen, ~24 per car).
 *    They share ~90 distinct (geometry, material look) combinations. Each combination is drawn as ONE
 *    THREE.InstancedMesh per frame, with every source mesh's current world matrix, colour, visibility and
 *    shadow flag copied in. Game code keeps animating, moving, recolouring, hiding and removing the ORIGINAL
 *    meshes exactly as before. The originals are only moved to layer 7 (not drawn by the camera, still hit by
 *    the city's raycasters, which enable layer 7 for the Phase 16 batches). Anything unusual (textured,
 *    transparent, custom shader, skinned, morphs, mirrored, custom layers or render order) stays a normal mesh.
 * 2. Canvas-texture de-duplication. Static canvas textures with byte-identical pixels (the same label or sign
 *    drawn several times) share one GPU texture. A shared one is handed back if its original is ever redrawn.
 * 3. Frame-spike attribution. Per-frame accounting of WebGL texture uploads, shader compiles/links, buffer uploads,
 *    JS heap drops (GC) and engine sub-steps, so a long frame can be attributed (window.__fyrusEngine17.spikes()).
 *
 * Kill switches: ?p17off=all | instancing,cars,citizens,texdedupe,texscale,chunkdefer,spikeprof   API: window.__fyrusEngine17.stats()
 */
(function () {
  'use strict';
  if (window.__fyrusEngine17) return;
  var T = window.THREE; if (!T) return;
  var OFF = (function () { try { var v = new URLSearchParams(location.search).get('p17off'); return v ? v.split(',') : []; } catch (e) { return []; } })();
  function off(k) { return OFF.indexOf('all') >= 0 || OFF.indexOf(k) >= 0; }
  var HIDDEN = 1 << 7;                                   // layer 7: hidden from the camera, visible to raycasters
  var S = { instancing: { groups: 0, members: 0, drawn: 0, skipped: {}, rebuilds: 0, updateMs: 0 }, dedupe: { scanned: 0, shared: 0, savedMB: 0, restored: 0, pending: 0 }, frame: 0 };
  var E = window.__fyrusEngine17 = { version: '17.0.0', stats: function () { var o = JSON.parse(JSON.stringify(S, function (k, v) { return typeof v === 'function' ? undefined : typeof v === 'number' && !Number.isInteger(v) ? Math.round(v * 100) / 100 : v; })); o.instancing.updateMs = Math.round(S.instancing.updateMs * 100) / 100; return o; } };

  /* Phase 17 note: a "skip unchanged local matrices" replacement for Object3D.updateMatrixWorld was implemented, unit
     tested (identical matrices) and benchmarked on the Mac. It was SLOWER (scene matrix update 3.6 -> 4.4 ms, -4..-7 FPS)
     because the per-object cost is already only ~0.24 us; it was removed. See docs/phase17/PHASE17-REPORT.md, Task 4. */

  /* ------------------------------------------------------------ 1. actor instancing */
  var groups = new Map();      // key -> {key, geo, mat, im: InstancedMesh, cast, members: []}
  var members = new Map();     // mesh -> {mesh, group, root, radius, colorRef}
  var geoKeys = new WeakMap(), matKeys = new WeakMap();
  var rootsCache = [];
  var tmpColor = new T.Color(), tmpM = new T.Matrix4(), camPos = new T.Vector3();
  var WHITE = new T.Color(1, 1, 1);

  function hashArr(a) {          // FNV-1a over the raw bytes of a typed array (exact content identity)
    if (!a) return 'n';
    var u = new Uint32Array(a.buffer, a.byteOffset, a.byteLength >> 2), h = 2166136261 >>> 0;
    for (var i = 0; i < u.length; i++) { h ^= u[i]; h = Math.imul(h, 16777619) >>> 0; }
    return a.length + ':' + h.toString(36);
  }
  function geoKey(g) {
    var k = geoKeys.get(g); if (k) return k;
    var a = g.attributes, parts = [];
    Object.keys(a).sort().forEach(function (n) { var at = a[n]; if (at.isInterleavedBufferAttribute) { parts.push('IL'); return; } parts.push(n + at.itemSize + (at.normalized ? 'n' : '') + hashArr(at.array)); });
    parts.push(g.index ? 'i' + hashArr(g.index.array) : 'ni');
    if (g.groups && g.groups.length > 1) parts.push('g' + JSON.stringify(g.groups));
    if (g.drawRange.start !== 0 || g.drawRange.count !== Infinity) parts.push('dr' + g.drawRange.start + ',' + g.drawRange.count);
    if (g.morphAttributes && Object.keys(g.morphAttributes).length) parts.push('M');
    k = parts.join('/'); geoKeys.set(g, k); return k;
  }
  var OK_MATS = { MeshStandardMaterial: 1, MeshLambertMaterial: 1, MeshPhongMaterial: 1 };
  var MAP_KEYS = ['map', 'lightMap', 'aoMap', 'emissiveMap', 'bumpMap', 'normalMap', 'displacementMap', 'roughnessMap', 'metalnessMap', 'alphaMap', 'envMap', 'specularMap'];
  function matReject(m) {
    if (!m || Array.isArray(m)) return 'multi-material';
    if (!OK_MATS[m.type]) return m.type;
    if (m.transparent || m.opacity < 1) return 'transparent';
    for (var i = 0; i < MAP_KEYS.length; i++) if (m[MAP_KEYS[i]]) return 'textured';
    if (m.onBeforeCompile && m.onBeforeCompile !== T.Material.prototype.onBeforeCompile) return 'custom shader';
    if (m.vertexColors || m.wireframe || m.clippingPlanes) return 'special material';
    return null;
  }
  function matKey(m) {           // every property that changes the shader or the look, EXCEPT the base colour
    return [m.type, m.emissive ? m.emissive.getHex() : -1, m.emissiveIntensity, m.roughness, m.metalness, m.shininess, m.specular ? m.specular.getHex() : -1,
      m.side, m.flatShading, m.alphaTest, m.fog, m.toneMapped, m.depthTest, m.depthWrite, m.colorWrite, m.polygonOffset, m.polygonOffsetFactor, m.polygonOffsetUnits,
      m.dithering, m.blending, m.visible, m.envMapIntensity, m.refractionRatio, m.reflectivity, m.defines ? JSON.stringify(m.defines) : '', m.customProgramCacheKey !== T.Material.prototype.customProgramCacheKey ? m.uuid : ''].join('|');
  }
  function meshReject(o) {
    if (o.isInstancedMesh) return 'instanced';
    if (o.isSkinnedMesh) return 'skinned';
    if (o.morphTargetInfluences && o.morphTargetInfluences.length) return 'morph';
    if (o.layers.mask !== 1) return 'custom layers';
    if (o.renderOrder) return 'renderOrder';
    if (o.onBeforeRender !== T.Object3D.prototype.onBeforeRender || o.onAfterRender !== T.Object3D.prototype.onAfterRender) return 'custom onBeforeRender';
    if (!o.geometry || !o.geometry.isBufferGeometry || !o.geometry.attributes.position) return 'no geometry';
    if (o.geometry.attributes.position.count > 5000) return 'large geometry';
    if (o.matrixWorld.determinant() < 0) return 'mirrored';
    if (o.userData && (o.userData.noInstance || o.userData.noBatch)) return 'opt-out';
    return matReject(o.material);
  }
  function actorRoots(W) {
    var r = [];
    if (!off('citizens')) {
      try { W.npcs.list.forEach(function (n) { if (n.av && n.av.root) r.push({ root: n.av.root, av: n.av }); }); } catch (e) {}
      try { (W.bots || []).forEach(function (b) { if (b && b.root) r.push({ root: b.root, av: b }); }); } catch (e) {}
      try { W.innerNpcs.list.forEach(function (n) { if (n.av && n.av.root) r.push({ root: n.av.root, av: n.av }); }); } catch (e) {}
      try { (W.dancers || []).forEach(function (d) { if (d && d.root) r.push({ root: d.root, av: d }); }); } catch (e) {}
    }
    if (!off('cars')) { try { W.traffic.group.children.forEach(function (c) { r.push({ root: c, car: true }); }); } catch (e) {} }
    return r;
  }
  function newIM(geo, mat, cap, cast, recv) {
    var im = new T.InstancedMesh(geo, mat, cap);
    im.count = 0; im.frustumCulled = false; im.castShadow = cast; im.receiveShadow = recv;
    im.instanceMatrix.setUsage(T.DynamicDrawUsage);
    im.setColorAt(0, WHITE); im.instanceColor.setUsage(T.DynamicDrawUsage);
    im.name = 'fx17-instanced'; im.userData.noFogCull = true; im.userData.noBatch = true;
    im.raycast = function () {};                       // game raycasts keep hitting the original meshes (layer 7)
    return im;
  }
  function ensureCap(g, n) {
    if (g.cap >= n) return;
    var cap = Math.max(8, Math.ceil(n * 1.5));
    if (g.im) { g.im.parent && g.im.parent.remove(g.im); g.im.dispose(); }
    g.im = newIM(g.geo, g.mat, cap, g.cast, g.recv);
    g.cap = cap; g.attached = false;
  }
  function dropGroup(g) { if (g.im) { g.im.parent && g.im.parent.remove(g.im); g.im.dispose(); } g.mat.dispose(); }
  function release(o, st) {     // hand a mesh back to the normal renderer
    if (o.layers.mask === HIDDEN) o.layers.mask = 1;
    var g = st.group, i = g.members.indexOf(st); if (i >= 0) g.members.splice(i, 1);
    members.delete(o);
  }
  // Membership is refreshed incrementally: a few actors per frame, a full pass about every 20 frames, so the cost
  // never lands on one frame (a one-shot pass over ~1,800 meshes measured 7-20 ms in the container).
  var cyc = null, rootSet = new Set(), rootsDirty = true;
  function addMember(o, R, skipped) {
    var why = meshReject(o); if (why) { skipped[why] = (skipped[why] || 0) + 1; return; }
    var mk = matKey(o.material), key = geoKey(o.geometry) + '#' + mk;
    var g = groups.get(key);
    if (!g) {
      var mat = o.material.clone(); mat.color && mat.color.copy(WHITE); mat.name = 'fx17-instanced';
      g = { key: key, geo: o.geometry, mat: mat, members: [], cap: 0, recv: o.receiveShadow, cast: false, attached: false, im: null };
      groups.set(key, g);
    }
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    var st = { mesh: o, group: g, mat: o.material, mk: mk, geo: o.geometry, r: o.geometry.boundingSphere.radius, root: R.root };
    g.members.push(st); members.set(o, st); ensureCap(g, g.members.length);
    if (o.castShadow && !g.cast) { g.cast = true; if (g.im) g.im.castShadow = true; }
    if (!rootSet.has(R.root)) { rootSet.add(R.root); rootsDirty = true; }
    o.layers.mask = HIDDEN;
  }
  function inScene(o, sc) { while (o) { if (o === sc) return true; o = o.parent; } return false; }
  function rebuildStep(W, steps) {
    var t0 = performance.now();
    if (!cyc) cyc = { roots: actorRoots(W), i: 0, seen: new Set(), skipped: {} };
    var per = Math.max(1, Math.ceil(cyc.roots.length / steps));
    for (var n = 0; n < per && cyc.i < cyc.roots.length; n++, cyc.i++) {
      var R = cyc.roots[cyc.i]; if (!inScene(R.root, W.world)) continue;   // interior NPCs (W.home) stay normal meshes
      R.root.traverse(function (o) {
        if (!o.isMesh) return;
        if (R.av && R.av.ring === o) { cyc.skipped.ring = (cyc.skipped.ring || 0) + 1; return; }
        cyc.seen.add(o);
        var st = members.get(o);
        if (st) {                                       // still eligible with the same look?
          if (o.layers.mask !== HIDDEN || o.material !== st.mat || matReject(o.material) || matKey(o.material) !== st.mk || o.geometry !== st.geo) release(o, st);
          else return;
        }
        addMember(o, R, cyc.skipped);
      });
    }
    if (cyc.i >= cyc.roots.length) {                    // end of a full pass: drop meshes that left the actors
      var seen = cyc.seen;
      members.forEach(function (st, o) { if (!seen.has(o)) release(o, st); });
      groups.forEach(function (g, k) {
        if (!g.members.length && g.cap) { dropGroup(g); groups.delete(k); }
      });
      var live = new Set(); members.forEach(function (st) { live.add(st.root); }); rootSet = live; rootsDirty = true;
      S.instancing.groups = groups.size; S.instancing.members = members.size; S.instancing.skipped = cyc.skipped; S.instancing.rebuilds++;
      cyc = null;
    }
    var d = performance.now() - t0; S.instancing.rebuildStepMaxMs = Math.max(S.instancing.rebuildStepMaxMs || 0, Math.round(d * 100) / 100);
  }
  function fogCutoff(scene) {       // same rule as the Phase 16 fog culling: distance where fog reaches the profile threshold
    var f = scene.fog, q = window.__fyrusQuality && window.__fyrusQuality.params, thr = q && q.fogCull;
    if (!f || !thr || OFF16('fogcull')) return Infinity;
    if (f.isFogExp2) return f.density > 0 ? Math.sqrt(-Math.log(1 - thr)) / f.density : Infinity;
    return f.near + thr * (f.far - f.near);
  }
  function OFF16(k) { try { var v = new URLSearchParams(location.search).get('p16off') || ''; return v === 'all' || v.split(',').indexOf(k) >= 0; } catch (e) { return false; } }
  function effectiveVisible(o, scene) {
    var p = o; while (p) { if (!p.visible) return false; if (p === scene) return true; p = p.parent; } return false;
  }
  // Runs from scene.onBeforeRender: three has just updated every world matrix and has not yet built the render list,
  // so the instances are exact for this frame and nothing is computed twice. One InstancedMesh per (geometry, look);
  // a group casts shadows if any of its parts ever does (parts the Phase 16 crowd LOD switched off keep casting via
  // the shared draw: one shadow draw per group instead of one per part). Buffers are uploaded only when they changed.
  function update(W, scene) {
    var t0 = performance.now();
    W.camera.getWorldPosition(camPos);
    var cut = fogCutoff(scene), drawn = 0, uploads = 0;
    groups.forEach(function (g) {
      if (!g.cap) return;
      var im = g.im;
      if (!g.attached || im.parent !== scene) { scene.add(im); g.attached = true; }
      var n = 0, ms = g.members, M = im.instanceMatrix.array, C = im.instanceColor.array, dm = false, dc = false;
      for (var j = 0; j < ms.length; j++) {
        var st = ms[j], o = st.mesh;
        if (o.layers.mask !== HIDDEN) continue;          // someone else changed its layers: rebuildStep() hands it back
        if (!o.material.visible || !effectiveVisible(o, scene)) continue;
        var e = o.matrixWorld.elements, dx = e[12] - camPos.x, dy = e[13] - camPos.y, dz = e[14] - camPos.z;
        if (Math.sqrt(dx * dx + dy * dy + dz * dz) - st.r * 3 > cut) continue;   // fogged out (Phase 16 fog-cull rule)
        if (n >= g.cap) break;
        var b = n * 16;
        for (var k = 0; k < 16; k++) { if (M[b + k] !== e[k]) { M[b + k] = e[k]; dm = true; } }
        var c = o.material.color, b3 = n * 3;
        if (c && (C[b3] !== c.r || C[b3 + 1] !== c.g || C[b3 + 2] !== c.b)) { C[b3] = c.r; C[b3 + 1] = c.g; C[b3 + 2] = c.b; dc = true; }
        n++;
      }
      if (n !== im.count) { im.count = n; dm = dc = true; }
      if (dm && n) { im.instanceMatrix.updateRange.offset = 0; im.instanceMatrix.updateRange.count = n * 16; im.instanceMatrix.needsUpdate = true; uploads++; }
      if (dc && n) { im.instanceColor.updateRange.offset = 0; im.instanceColor.updateRange.count = n * 3; im.instanceColor.needsUpdate = true; uploads++; }
      im.visible = n > 0; drawn += n;
    });
    S.instancing.drawn = drawn; S.instancing.uploads = uploads;
    var dt = performance.now() - t0; S.instancing.updateMs = S.instancing.updateMs * 0.95 + dt * 0.05;
  }
  function releaseAll() { members.forEach(function (st, o) { release(o, st); }); rootSet = new Set(); rootsDirty = true; cyc = null; groups.forEach(dropGroup); groups.clear(); }
  E.releaseInstancing = releaseAll;
  E.setInstancing = function (on) {  // A/B in the same frame: false = hand every mesh back, true = rebuild
    var i = OFF.indexOf('instancing');
    if (on) { if (i >= 0) OFF.splice(i, 1); var W = window.__fyrusW; if (W) { cyc = null; rebuildStep(W, 1); } }
    else { if (i < 0) OFF.push('instancing'); releaseAll(); }
  };

  /* ------------------------------------------------------------ 2. canvas texture de-duplication */
  var DD = { byTex: new Map(), canon: new Map(), shared: new Map(), queue: [], scanAt: 0 };
  // DD.byTex: tex -> {hash, stableSince, version}; DD.shared: dupTex -> {canon, mats:[{m,k}]}
  function texBytes(t) { var im = t.image || {}; return (im.width || 0) * (im.height || 0) * 4 * (t.generateMipmaps !== false ? 4 / 3 : 1); }
  // Exact content identity, computed OFF the main thread: the canvas is snapshotted with createImageBitmap (a GPU-side
  // copy) and transferred to a worker, which reads the pixels on an OffscreenCanvas and returns an FNV-1a hash.
  // (Phase 17 measured the synchronous getImageData variant at 1-2 ms per sign and up to 158 ms frames.)
  var HW = (function () {
    if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap === 'undefined' || typeof Blob === 'undefined') return null;
    try {
      var src = 'onmessage=function(e){var b=e.data.bmp,w=b.width,h=b.height,r;try{var c=new OffscreenCanvas(w,h),x=c.getContext("2d",{willReadFrequently:true});x.drawImage(b,0,0);var d=x.getImageData(0,0,w,h).data,u=new Uint32Array(d.buffer,d.byteOffset,d.byteLength>>2),k=2166136261>>>0;for(var i=0;i<u.length;i++){k^=u[i];k=Math.imul(k,16777619)>>>0}r=w+"x"+h+":"+u.length+":"+k.toString(36)}catch(err){r=null}b.close&&b.close();postMessage({id:e.data.id,h:r})}';
      var w = new Worker(URL.createObjectURL(new Blob([src], { type: 'application/javascript' })));
      var cb = new Map(), seq = 0;
      w.onmessage = function (e) { var f = cb.get(e.data.id); cb.delete(e.data.id); if (f) f(e.data.h); };
      return { busy: function () { return cb.size; }, hash: function (canvas, done) {
        var id = ++seq; cb.set(id, done);
        createImageBitmap(canvas).then(function (bmp) { w.postMessage({ id: id, bmp: bmp }, [bmp]); }, function () { cb.delete(id); done(null); });
      } };
    } catch (e) { return null; }
  })();
  function texSig(t) { return [t.wrapS, t.wrapT, t.magFilter, t.minFilter, t.anisotropy, t.flipY, t.generateMipmaps, t.encoding, t.premultiplyAlpha, t.offset.x, t.offset.y, t.repeat.x, t.repeat.y, t.rotation, t.center.x, t.center.y, t.matrixAutoUpdate].join('|'); }
  function dedupeScan(W) {
    var now = performance.now(), found = new Map();
    [W.world, W.home].forEach(function (sc) {
      if (!sc) return;
      sc.traverse(function (o) {
        var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        for (var i = 0; i < ms.length; i++) { var m = ms[i]; if (!m) continue; for (var k = 0; k < MAP_KEYS.length; k++) { var t = m[MAP_KEYS[k]]; if (t && t.isCanvasTexture) { var l = found.get(t); if (!l) found.set(t, l = []); l.push({ m: m, k: MAP_KEYS[k] }); } } }
      });
    });
    found.forEach(function (uses, t) {
      if (DD.shared.has(t)) return;
      var e = DD.byTex.get(t);
      if (!e) { DD.byTex.set(t, { version: t.version, since: now, hash: null, uses: uses }); if (!off('texscalenow')) scaleTex(t); return; }   // 29.4: phone profiles downscale on discovery (no wait for the hash pass)
      e.uses = uses;
      if (e.version !== t.version) { e.version = t.version; e.since = now; e.hash = null; return; }     // being redrawn: dynamic
      if (!e.hash && now - e.since > 8000 && DD.queue.indexOf(t) < 0) DD.queue.push(t);          // static for 8 s
    });
    // a shared duplicate whose original canvas was redrawn by the game: give the original texture back
    DD.shared.forEach(function (s, dup) {
      if (dup.version !== s.version) { s.mats.forEach(function (u) { if (u.m[u.k] === s.canon) u.m[u.k] = dup; }); DD.shared.delete(dup); DD.byTex.delete(dup); S.dedupe.restored++; S.dedupe.savedMB -= s.mb; }
    });
    // 18.2: forget textures/materials that left the world (byTex/shared/canon only ever grew, retaining every sign of
    // every unloaded chunk). A texture that comes back is simply hashed again.
    var fm = new Set(); found.forEach(function (uses) { uses.forEach(function (u) { fm.add(u.m); }); });
    DD.shared.forEach(function (s, dup) { if (!s.mats.some(function (u) { return fm.has(u.m); })) { DD.shared.delete(dup); DD.byTex.delete(dup); } });
    var live = new Set(); DD.shared.forEach(function (s) { live.add(s.canon); });
    DD.byTex.forEach(function (e, t) { if (!found.has(t) && !DD.shared.has(t) && !live.has(t) && e.hash !== 'pending' && DD.queue.indexOf(t) < 0) DD.byTex.delete(t); });
    DD.canon.forEach(function (t, h) { if (!found.has(t) && !live.has(t)) DD.canon.delete(h); });
    S.dedupe.tracked = DD.byTex.size;
    S.dedupe.pending = DD.queue.length;
  }
  function dedupeWork() {
    if (!HW) { S.dedupe.unsupported = true; DD.queue.length = 0; return; }
    while (DD.queue.length && HW.busy() < 3) {
      (function (t) {
        var e = DD.byTex.get(t); if (!e || e.version !== t.version || !t.image) return;
        var v = t.version; e.hash = 'pending';
        HW.hash(t.image, function (h) {
          S.dedupe.scanned++;
          if (!h || t.version !== v || DD.byTex.get(t) !== e) { e.hash = null; return; }      // redrawn meanwhile: retry later
          e.hash = h + '#' + texSig(t);
          var c = DD.canon.get(e.hash), ce = c && DD.byTex.get(c);
          if (!c || c === t || !ce || ce.version !== c.version || DD.shared.has(c)) { DD.canon.set(e.hash, t); scaleTex(t); e.version = t.version; return; }
          // share: point every material slot that used t at the canonical texture, free t's GPU copy
          var mb = texBytes(t) / 1048576;
          e.uses.forEach(function (u) { if (u.m[u.k] === t) u.m[u.k] = c; });
          DD.shared.set(t, { canon: c, mats: e.uses, version: t.version, mb: mb });
          t.dispose(); S.dedupe.shared++; S.dedupe.savedMB += mb;
        });
      })(DD.queue.shift());
    }
    S.dedupe.pending = DD.queue.length;
  }

  // Mobile / VR budget: static sign textures are re-uploaded at texScale (mobile 0.5, VR 0.75; desktop 1 = untouched).
  // The original canvas is kept; if the game redraws it (needsUpdate), the reduced copy is redrawn from it first.
  function scaleTex(t) {
    var q = window.__fyrusQuality && window.__fyrusQuality.params, k = q && q.texScale;
    if (!k || k >= 1 || off('texscale') || t.__fx17small) return;
    var src = t.image; if (!src || !src.width || src.width < 256 || !document.createElement) return;
    var sm = document.createElement('canvas'); sm.width = Math.max(1, Math.round(src.width * k)); sm.height = Math.max(1, Math.round(src.height * k));
    var cx = sm.getContext('2d'); cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
    var orig = src;
    function redraw() { if (t.image !== sm) { orig = t.image; } cx.clearRect(0, 0, sm.width, sm.height); cx.drawImage(orig, 0, 0, sm.width, sm.height); t.image = sm; }
    redraw();
    Object.defineProperty(t, 'needsUpdate', { configurable: true, set: function (v) { if (v) { try { redraw(); } catch (e) {} this.version++; } } });
    t.__fx17small = { k: k, from: [src.width, src.height] };
    var before = src.width * src.height * 4 * 4 / 3 / 1048576, after = sm.width * sm.height * 4 * 4 / 3 / 1048576;
    S.dedupe.scaled = (S.dedupe.scaled || 0) + 1; S.dedupe.scaledSavedMB = (S.dedupe.scaledSavedMB || 0) + before - after;
    t.version++;
  }

  /* ------------------------------------------------------------ 3. frame-spike attribution */
  var SP = { cur: null, frames: [], max: 600, gc: 0, lastHeap: 0 };
  function newFrame() { return { t: performance.now(), texN: 0, texMs: 0, texPx: 0, shN: 0, shMs: 0, bufN: 0, bufMs: 0, bufKB: 0, renderMs: 0, tickMs: 0, heapDropMB: 0, chunk: 0, batchScan: 0 }; }
  function wrapGL(gl) {
    if (!gl || gl.__fx17) return; gl.__fx17 = true;
    function wrap(name, kind) {
      var f = gl[name]; if (typeof f !== 'function') return;
      gl[name] = function () {
        var t0 = performance.now(), r = f.apply(gl, arguments), d = performance.now() - t0, c = SP.cur;
        if (c) {
          if (kind === 'tex') { c.texN++; c.texMs += d; var a = arguments; if (a.length >= 9 && typeof a[3] === 'number' && typeof a[4] === 'number') c.texPx += a[3] * a[4]; else if (a[a.length - 1] && a[a.length - 1].width) c.texPx += a[a.length - 1].width * a[a.length - 1].height; }
          else if (kind === 'sh') { c.shN++; c.shMs += d; }
          else { c.bufN++; c.bufMs += d; var b = arguments[1]; if (b && b.byteLength) c.bufKB += b.byteLength / 1024; }
        }
        return r;
      };
    }
    ['texImage2D', 'texSubImage2D', 'texStorage2D', 'texImage3D', 'texSubImage3D', 'generateMipmap', 'compressedTexImage2D'].forEach(function (n) { wrap(n, 'tex'); });
    ['compileShader', 'linkProgram', 'getProgramParameter', 'getShaderParameter'].forEach(function (n) { wrap(n, 'sh'); });
    ['bufferData', 'bufferSubData'].forEach(function (n) { wrap(n, 'buf'); });
  }
  function spikeFrameEnd(dtMs) {
    var c = SP.cur; if (!c) return;
    c.dt = dtMs;
    try { var h = performance.memory.usedJSHeapSize / 1048576; if (SP.lastHeap && h < SP.lastHeap - 2) { c.heapDropMB = SP.lastHeap - h; SP.gc++; } SP.lastHeap = h; } catch (e) {}
    SP.frames.push(c); if (SP.frames.length > SP.max) SP.frames.shift();
  }
  E.spikes = function (thresholdMs) {   // attribution of every recent frame slower than thresholdMs
    var th = thresholdMs || 20, fr = SP.frames, out = [], n = fr.length;
    var all = { frames: n, gcFrames: 0 }; var hist = {};
    for (var i = 0; i < n; i++) {
      var f = fr[i]; var b = Math.round(f.dt / 8.333); hist[b] = (hist[b] || 0) + 1;
      if (f.heapDropMB) all.gcFrames++;
      if (f.dt < th) continue;
      var why = [];
      if (f.shN) why.push('shader x' + f.shN + ' ' + f.shMs.toFixed(1) + 'ms');
      if (f.texN) why.push('texture upload x' + f.texN + ' ' + f.texMs.toFixed(1) + 'ms ' + (f.texPx / 1e6).toFixed(2) + 'Mpx');
      if (f.bufKB > 64) why.push('buffer upload ' + Math.round(f.bufKB) + 'KB ' + f.bufMs.toFixed(1) + 'ms');
      if (f.heapDropMB) why.push('GC -' + f.heapDropMB.toFixed(1) + 'MB');
      if (f.chunk) why.push('chunk build x' + f.chunk + ' ' + (f.chunkMs || 0).toFixed(1) + 'ms');
      if (f.batchScan) why.push('batch scan');
      var js = f.tickMs || 0;
      if (!why.length) why.push(js > f.dt * 0.6 ? 'engine JS (render submit) ' + js.toFixed(1) + 'ms' : 'outside JS (GPU / compositor / vsync) js=' + js.toFixed(1) + 'ms');
      out.push({ dt: Math.round(f.dt * 10) / 10, js: Math.round(js * 10) / 10, render: Math.round(f.renderMs * 10) / 10, why: why.join('; ') });
    }
    all.histogramVsyncIntervals = hist;   // frame duration in 120 Hz vsync intervals (1 = 8.3 ms, 2 = 16.7 ms, 3 = 25 ms)
    all.slow = out.slice(-60); all.slowCount = out.length;
    return all;
  };
  E.resetSpikes = function () { SP.frames = []; SP.gc = 0; };

  /* ------------------------------------------------------------ attach */
  var attachedW = null, lastRaf = 0, CH = S.chunks = { built: 0, deferred: 0, deferredBuilt: 0, maxMs: 0, totalMs: 0, flush: null };
  function attach(W) {
    attachedW = W;
    var R = W.renderer;
    if (!off('spikeprof')) wrapGL(R.getContext());
    var tick = W.tick;
    W.tick = function () {
      var t0 = performance.now(); var r = tick.apply(this, arguments);
      if (SP.cur) SP.cur.tickMs += performance.now() - t0;
      return r;
    };
    var sc = W.world, obr = sc.onBeforeRender;
    // profiler: share of the frame spent in three's whole-scene matrix update (called inside renderer.render)
    var umw = sc.updateMatrixWorld;
    sc.updateMatrixWorld = function () { var t0 = performance.now(), r = umw.apply(this, arguments); var d = performance.now() - t0; S.matrixMs = S.matrixMs == null ? d : S.matrixMs * 0.95 + d * 0.05; return r; };
    sc.onBeforeRender = function (r, scene, camera) {
      obr.apply(this, arguments);
      if (scene === W.world && camera === W.camera && !off('instancing') && groups.size) { try { update(W, scene); } catch (e) { console.warn('[FYRUS engine17] instancing disabled after error', e); OFF.push('instancing'); releaseAll(); } }
    };
    var render = R.render;
    R.render = function (scene, camera) {
      var t0 = performance.now(), out = render.apply(this, arguments), rd = performance.now() - t0;
      if (SP.cur) SP.cur.renderMs += rd;
      if (scene === W.world) S.renderMs = S.renderMs == null ? rd : S.renderMs * 0.95 + rd * 0.05;
      return out;
    };
    // World chunks: measured (spike attribution) and time-sliced. When the player crosses a chunk boundary the engine
    // builds a whole new row of up to 5 chunks (homes, plots, trees, lamps) synchronously in one frame. Here at most
    // ONE chunk is built per frame; the others get an empty placeholder with the same fields and are built on the
    // following frames (the new row is 2 chunks = ~128 m away, beyond reach). Colliders are rebuilt after each.
    try {
      if (W.chunks && typeof W.buildChunk === 'function') {
        var bc = W.buildChunk, builtFrame = -1, deferred = [];
        CH.flush = function () {
          if (!deferred.length || builtFrame === S.frame) return;
          builtFrame = S.frame;
          var d = deferred.shift(), cur = W.chunks.get(d.key);
          if (cur !== d.ph) return CH.flush();                  // moved away meanwhile: nothing to build
          var t0 = performance.now(), real = bc.apply(W, d.args);
          W.world.remove(d.ph.group); W.chunks.set(d.key, real);
          try { W.rebuildColliders(); } catch (e) {}
          var dt = performance.now() - t0; CH.built++; CH.deferredBuilt++; CH.maxMs = Math.max(CH.maxMs, dt); if (SP.cur) { SP.cur.chunk++; SP.cur.chunkMs = (SP.cur.chunkMs || 0) + dt; }
        };
        W.buildChunk = function (cx, cz) {
          var pp = W.player && W.player.root.position, near = true;
          if (pp) { var px = Math.floor(pp.x / 64 + 0.5), pz = Math.floor(pp.z / 64 + 0.5); near = Math.max(Math.abs(cx - px), Math.abs(cz - pz)) < 2; }
          if (!off('chunkdefer') && builtFrame === S.frame && !near) {   // the 3x3 around the player is always built at once
            var ph = { key: cx + ',' + cz, cx: cx, cz: cz, group: new T.Group(), plan: null, homes: [], orbs: [], interacts: [], labels: [], fx17deferred: true };
            W.world.add(ph.group); deferred.push({ key: ph.key, ph: ph, args: Array.prototype.slice.call(arguments) }); CH.deferred++;
            return ph;
          }
          builtFrame = S.frame;
          var t0 = performance.now(), r = bc.apply(this, arguments), dt = performance.now() - t0;
          CH.built++; CH.maxMs = Math.max(CH.maxMs, dt); CH.totalMs += dt;
          if (SP.cur) { SP.cur.chunk++; SP.cur.chunkMs = (SP.cur.chunkMs || 0) + dt; }
          return r;
        };
      }
    } catch (e) {}
  }
  function loop(now) {
    requestAnimationFrame(loop);
    if (lastRaf) spikeFrameEnd(now - lastRaf);
    lastRaf = now; SP.cur = off('spikeprof') ? null : newFrame();
    var W = window.__fyrusW;
    if (!W || !W.renderer || !W.camera || !W.world) return;
    if (W !== attachedW) attach(W);
    S.frame++;
    if (CH.flush && S.frame % 1 === 0) CH.flush();
    if (!off('instancing')) { try { rebuildStep(W, 20); } catch (e) { console.warn('[FYRUS engine17] instancing rebuild failed', e); OFF.push('instancing'); releaseAll(); } }
    if (!DD.startAt) DD.startAt = now + 12000;          // let start-up (world build, avatar load) finish first
    if (!off('texdedupe') && now > DD.startAt) { if (now - DD.scanAt > 1500) { DD.scanAt = now; dedupeScan(W); } if (DD.queue.length) dedupeWork(); }
  }
  requestAnimationFrame(loop);
})();
