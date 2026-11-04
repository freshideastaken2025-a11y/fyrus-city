/* FYRUS · SKYLINE PLAZA (v1.0.0)
 * The SKYLINE ONE concept tower (a CITE BIRD showcase — a fictional building, not a real development) as a
 * landmark plaza in Fyrus. The tower is the SKYLINE ONE exterior geometry and materials, exported from the
 * SKYLINE ONE app (assets/skyline/skyline-one-tower.glb, merged per material, ~39k triangles). Walk to the marked
 * entrance and press E to step inside: the full SKYLINE ONE interior (lobby, residences, lift, rooftop) opens in
 * an overlay (assets/skyline-one/index.html?embed=fyrus); "Back to SKYLINE PLAZA" returns you to the door.
 *
 * Site: centre (295, 462), entrance facing north (towards Fyrus Core). Kept clear of the airport: ~230 m west of the
 * FCI runway centreline (x ~527), outside the FCI footprint and its blocked zones, and away from taxiways, gates,
 * jet bridges and aircraft paths. Nothing here touches airports, aircraft, users, balances or the server.
 *
 * Built only within 650 m of the player or the camera (so the drone tour sees it), disposed beyond 950 m.
 * Hooks are chained (never replaced): __fyrusCollide, __fyrusSolid, __fyrusNoProps, __fyrusRegion, __fyrusMinimap,
 * __fyrusExtraInteracts, __fyrusPlaces (entry re-added if the list is rebuilt), W.blocked and W.traffic.blocked.
 * Kill switch: ?skyline=off.  Debug: window.__fyrusSkyline.stats()
 */
(function () {
  'use strict';
  if (window.__fyrusSkyline) return;
  var Q = new URLSearchParams(location.search);
  if (Q.get('skyline') === 'off') return;
  var VERSION = '1.0.0';
  var SP = { x: 295, z: 462, ry: Math.PI, key: 'skyline-plaza', name: 'SKYLINE PLAZA' };
  var GLB = '/assets/skyline/skyline-one-tower.glb?v=' + VERSION;
  var INTERIOR = '/assets/skyline-one/index.html?embed=fyrus';
  // local frame: +z is the entrance side. Tower footprint (from the GLB bounds) and the plaza slab around it.
  var TOWER = { x0: -17.2, x1: 17.2, z0: -13.4, z1: 18.9 };
  var PLAZA = { x0: -36, x1: 36, z0: -22, z1: 60 };
  var DOOR = { x: 0, z: 21 };
  var S = { version: VERSION, built: false, building: false, glb: false, errors: 0, lastError: '', opens: 0, tris: 0, drawCalls: 0, loadMs: 0, open: false };
  var API = window.__fyrusSkyline = { spec: SP, stats: function () { return JSON.parse(JSON.stringify(S)); } };
  var T = null, W = null, installedFor = null, root = null, fixtures = [], zones = [];
  var cs = Math.cos(SP.ry), sn = Math.sin(SP.ry);
  function toWorld(lx, lz) { return { x: SP.x + lx * cs + lz * sn, z: SP.z - lx * sn + lz * cs }; }
  function toLocal(X, Z) { var dx = X - SP.x, dz = Z - SP.z; return { x: dx * cs - dz * sn, z: dx * sn + dz * cs }; }
  function inRect(r, X, Z, m) { var p = toLocal(X, Z); m = m || 0; return p.x > r.x0 - m && p.x < r.x1 + m && p.z > r.z0 - m && p.z < r.z1 + m ? p : null; }
  API.toWorld = toWorld; API.toLocal = toLocal;
  API.door = function () { return toWorld(DOOR.x, DOOR.z); };

  /* ---------------- geometry ---------------- */
  function keepLook(o) { o.traverse(function (m) { var ms = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : []; ms.forEach(function (mt) { mt.userData = mt.userData || {}; if (!mt.userData.c18) mt.userData.c18 = 'sky'; }); }); }
  function canvasTex(w, h, draw) { var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); var t = new T.CanvasTexture(c); if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  function std(color, rough, metal, extra) { var m = new T.MeshStandardMaterial({ color: color, roughness: rough == null ? 0.8 : rough, metalness: metal || 0 }); if (extra) Object.assign(m, extra); return m; }
  function at(o, lx, y, lz, rot) { var p = toWorld(lx, lz); o.position.set(p.x, y, p.z); o.rotation.y = SP.ry + (rot || 0); return o; }

  function buildPlaza(g) {
    var w = PLAZA.x1 - PLAZA.x0, d = PLAZA.z1 - PLAZA.z0;
    var paveTex = canvasTex(512, 512, function (c, W2, H2) {
      c.fillStyle = '#bdb5a8'; c.fillRect(0, 0, W2, H2);
      for (var y = 0; y < 8; y++) for (var x = 0; x < 8; x++) { var v = 178 + ((x * 7 + y * 13) % 9) * 3; c.fillStyle = 'rgb(' + v + ',' + (v - 7) + ',' + (v - 17) + ')'; c.fillRect(x * 64 + 1, y * 64 + 1, 62, 62); }
    });
    paveTex.wrapS = paveTex.wrapT = T.RepeatWrapping; paveTex.repeat.set(w / 8, d / 8);
    var pave = new T.Mesh(new T.PlaneGeometry(w, d), std(0xffffff, 0.86, 0, { map: paveTex, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    pave.rotation.x = -Math.PI / 2; var c0 = toWorld((PLAZA.x0 + PLAZA.x1) / 2, (PLAZA.z0 + PLAZA.z1) / 2); pave.position.set(c0.x, 0.03, c0.z); pave.rotation.z = SP.ry; pave.receiveShadow = true; g.add(pave);
    // gold inlay path from the plaza edge to the door
    var path = new T.Mesh(new T.PlaneGeometry(4.2, PLAZA.z1 - DOOR.z), std(0xd5bd8b, 0.35, 0.6, { polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 }));
    path.rotation.x = -Math.PI / 2; var pc = toWorld(0, (PLAZA.z1 + DOOR.z) / 2); path.position.set(pc.x, 0.045, pc.z); path.rotation.z = SP.ry; g.add(path);
    // entrance marker: glowing ring on the ground at the door
    var ring = new T.Mesh(new T.RingGeometry(1.5, 2.0, 48), new T.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.85, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; var dp = toWorld(DOOR.x, DOOR.z); ring.position.set(dp.x, 0.07, dp.z); g.add(ring); API._ring = ring;
    var beacon = new T.Mesh(new T.CylinderGeometry(1.75, 1.75, 3.2, 40, 1, true), new T.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.16, side: T.DoubleSide, depthWrite: false }));
    beacon.position.set(dp.x, 1.6, dp.z); g.add(beacon); API._beacon = beacon;
    // label over the door
    var lab = canvasTex(1024, 256, function (c) { c.fillStyle = 'rgba(7,12,22,0.82)'; c.fillRect(0, 0, 1024, 256); c.strokeStyle = '#d5bd8b'; c.lineWidth = 6; c.strokeRect(6, 6, 1012, 244); c.fillStyle = '#f3e3bf'; c.font = '600 92px Arial'; c.textAlign = 'center'; c.fillText('ENTER SKYLINE ONE', 512, 120); c.fillStyle = '#c8d2e6'; c.font = '44px Arial'; c.fillText('Walk to the gold ring · press E', 512, 200); });
    var sprite = new T.Sprite(new T.SpriteMaterial({ map: lab, transparent: true, depthWrite: false })); sprite.scale.set(6.4, 1.6, 1); sprite.position.set(dp.x, 4.6, dp.z); g.add(sprite);
    // fountain on the forecourt axis
    var fz = 40, basin = new T.Mesh(new T.CylinderGeometry(6, 6.3, 0.7, 48), std(0xe9e3d6, 0.5)); at(basin, 0, 0.35, fz); g.add(basin);
    var water = new T.Mesh(new T.CircleGeometry(5.6, 48), new T.MeshStandardMaterial({ color: 0x3fa7d6, roughness: 0.08, metalness: 0.1, emissive: 0x0b3550, emissiveIntensity: 0.6 }));
    water.rotation.x = -Math.PI / 2; at(water, 0, 0.62, fz); water.rotation.set(-Math.PI / 2, 0, 0); g.add(water);
    var jet = new T.Mesh(new T.CylinderGeometry(0.12, 0.5, 3.4, 12, 1, true), new T.MeshBasicMaterial({ color: 0xcfefff, transparent: true, opacity: 0.55, depthWrite: false })); at(jet, 0, 2.3, fz); g.add(jet); API._jet = jet;
    fixtures.push({ x: 0, z: fz, r: 6.6 });
    // monolith sign at the plaza edge, facing the approach
    var signTex = canvasTex(512, 1024, function (c) { var gr = c.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#0d1626'); gr.addColorStop(1, '#05080f'); c.fillStyle = gr; c.fillRect(0, 0, 512, 1024); c.strokeStyle = '#d5bd8b'; c.lineWidth = 8; c.strokeRect(24, 24, 464, 976); c.fillStyle = '#d5bd8b'; c.textAlign = 'center'; c.font = '600 64px Arial'; c.fillText('SKYLINE', 256, 300); c.fillText('PLAZA', 256, 380); c.fillStyle = '#f1f4f2'; c.font = '34px Arial'; c.fillText('SKYLINE ONE', 256, 520); c.fillText('Interactive Luxury', 256, 570); c.fillText('Residences', 256, 615); c.fillStyle = '#9ba8b6'; c.font = '26px Arial'; c.fillText('A CITE BIRD concept', 256, 760); c.fillText('demonstration', 256, 796); c.fillText('Fictional building', 256, 860); c.fillText('Nothing here is for sale', 256, 896); });
    var sign = new T.Mesh(new T.BoxGeometry(3, 6, 0.6), [std(0x111826, 0.4, 0.3), std(0x111826, 0.4, 0.3), std(0x111826, 0.4, 0.3), std(0x111826, 0.4, 0.3), new T.MeshStandardMaterial({ map: signTex, emissive: 0xffffff, emissiveMap: signTex, emissiveIntensity: 0.55, roughness: 0.5 }), std(0x111826, 0.4, 0.3)]);
    at(sign, 9, 3, 56); g.add(sign); fixtures.push({ x: 9, z: 56, r: 2.2 });
    // palms and lamps lining the forecourt
    var trunkM = std(0x7a5a3a, 0.9), leafM = std(0x2f6b34, 0.75, 0, { side: T.DoubleSide }), poleM = std(0x2a2f38, 0.5, 0.6), headM = new T.MeshStandardMaterial({ color: 0xfff2d0, emissive: 0xffd9a0, emissiveIntensity: 1.4 });
    var trunkG = new T.CylinderGeometry(0.22, 0.34, 7, 8), leafG = new T.ConeGeometry(0.9, 4.2, 5, 1, true), poleG = new T.CylinderGeometry(0.09, 0.12, 5, 8), headG = new T.SphereGeometry(0.32, 12, 8);
    // instanced: 8 palms (trunk + 6 fronds) and 6 lamps (pole + head) = 4 draw calls
    var PALMS = [[-24, 26], [24, 26], [-24, 40], [24, 40], [-24, 54], [24, 54], [-30, 4], [30, 4]], LAMPS = [[-12, 30], [12, 30], [-12, 48], [12, 48], [-12, 24], [12, 24]];
    var trunks = new T.InstancedMesh(trunkG, trunkM, PALMS.length), leaves = new T.InstancedMesh(leafG, leafM, PALMS.length * 6), poles = new T.InstancedMesh(poleG, poleM, LAMPS.length), heads = new T.InstancedMesh(headG, headM, LAMPS.length);
    var M4 = new T.Matrix4(), Qn = new T.Quaternion(), E3 = new T.Euler(), V = new T.Vector3(), ONE = new T.Vector3(1, 1, 1);
    PALMS.forEach(function (q, k) {
      var w = toWorld(q[0], q[1]); M4.makeTranslation(w.x, 3.5, w.z); trunks.setMatrixAt(k, M4);
      for (var i = 0; i < 6; i++) { var a = i * Math.PI / 3 + k; E3.set(0, a, 1.25, 'YXZ'); Qn.setFromEuler(E3); V.set(w.x + Math.cos(a) * 1.6, 7, w.z - Math.sin(a) * 1.6); M4.compose(V, Qn, ONE); leaves.setMatrixAt(k * 6 + i, M4); }
      fixtures.push({ x: q[0], z: q[1], r: 0.7 });
    });
    LAMPS.forEach(function (q, k) { var w = toWorld(q[0], q[1]); M4.makeTranslation(w.x, 2.5, w.z); poles.setMatrixAt(k, M4); M4.makeTranslation(w.x, 5.1, w.z); heads.setMatrixAt(k, M4); fixtures.push({ x: q[0], z: q[1], r: 0.35 }); });
    trunks.castShadow = true; [trunks, leaves, poles, heads].forEach(function (m) { m.instanceMatrix.needsUpdate = true; m.frustumCulled = false; g.add(m); });
    // two warm forecourt lights (no shadows) so the entrance reads at night
    var l1 = new T.PointLight(0xffd6a0, 1.2, 38, 2); var lp = toWorld(0, 26); l1.position.set(lp.x, 6, lp.z); g.add(l1);
  }

  function prepTower(scene) {
    var tris = 0, calls = 0;
    scene.traverse(function (o) {
      if (!o.isMesh) return; calls++;
      var g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
      o.castShadow = true; o.receiveShadow = false; o.matrixAutoUpdate = false; o.updateMatrix();
      var m = o.material, u = m.userData || {};
      // the r149-era loader ignores KHR_materials_emissive_strength: the exporter stored it as extras.es
      if (u.es != null && m.emissive) m.emissiveIntensity = u.es;
      // no transmission pass in the city: glazing becomes ordinary transparent glass
      if (m.transmission) { m.transmission = 0; m.transparent = true; m.opacity = Math.min(m.opacity == null ? 0.5 : m.opacity, 0.55); }
      // the city has no environment map, so fully metallic trims would render black: keep them satin
      if (m.metalness > 0.4 && !m.envMap) { m.metalness = 0.3; m.roughness = Math.max(m.roughness, 0.45); }
      if (m.transparent) { m.depthWrite = false; o.castShadow = false; }
      if (m.map && W && W.renderer) m.map.anisotropy = Math.min(4, W.renderer.capabilities.getMaxAnisotropy());
    });
    S.tris = Math.round(tris); S.drawCalls = calls;
  }

  var cached = null;
  function loadTower(cb) {
    if (cached) return cb(cached);
    if (!T.GLTFLoader) { S.errors++; S.lastError = 'GLTFLoader missing'; return; }
    var t0 = performance.now();
    fetch(GLB).then(function (r) { if (!r.ok) throw new Error('GLB ' + r.status); return r.arrayBuffer(); })
      .then(function (ab) { return new Promise(function (res, rej) { new T.GLTFLoader().parse(ab, '', res, rej); }); })
      .then(function (gl) { S.loadMs = Math.round(performance.now() - t0); S.glb = true; cached = gl.scene; cb(cached); })
      .catch(function (e) { S.errors++; S.lastError = String(e && e.message || e); });
  }

  function build(Wd) {
    if (S.built || S.building) return; S.building = true;
    root = new T.Group(); root.name = 'skyline-plaza'; fixtures.length = 0;
    try { buildPlaza(root); } catch (e) { S.errors++; S.lastError = 'plaza ' + (e && e.message); }
    var pc = 0; root.traverse(function (o) { if (o.isMesh || o.isSprite) pc += Array.isArray(o.material) ? o.material.length : 1; }); S.plazaDrawCalls = pc;
    keepLook(root); Wd.world.add(root); S.built = true; S.building = false;
    loadTower(function (scene) {
      if (!root || root.parent !== Wd.world) return;
      var t = scene; t.position.set(SP.x, 0, SP.z); t.rotation.y = SP.ry; t.updateMatrix();
      prepTower(t); keepLook(t); root.add(t); root.updateMatrixWorld(true); API._tower = t;
    });
  }
  function dispose() {
    if (!root) return;
    if (root.parent) root.parent.remove(root);
    root.traverse(function (o) {
      if (o === cached || (cached && isChildOf(o, cached))) return;
      if (o.geometry) o.geometry.dispose();
      var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      ms.forEach(function (m) { if (m.map) m.map.dispose(); if (m.emissiveMap && m.emissiveMap !== m.map) m.emissiveMap.dispose(); m.dispose(); });
    });
    // the tower's GPU buffers are released too; its parsed scene stays cached in memory (~3 MB) for a quick return
    if (cached) cached.traverse(function (o) { if (o.geometry) o.geometry.dispose(); var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(function (m) { ['map', 'emissiveMap', 'normalMap', 'roughnessMap', 'metalnessMap'].forEach(function (k) { if (m[k]) m[k].dispose(); }); m.dispose(); }); });
    root = null; S.built = false; API._tower = null;
  }
  function isChildOf(o, p) { for (var q = o; q; q = q.parent) if (q === p) return true; return false; }

  /* ---------------- interior overlay ---------------- */
  var ov = null, pausedLoop = false;
  function openInterior() {
    if (ov) return; S.opens++; S.open = true;
    ov = document.createElement('div'); ov.id = 'skylineOverlay';
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-label', 'SKYLINE ONE interior');
    ov.style.cssText = 'position:fixed;inset:0;z-index:2147483600;background:#05080f;color:#f1f4f2;font-family:system-ui,Arial,sans-serif';
    ov.innerHTML = '<div style="position:absolute;inset:0;display:grid;place-items:center;font-size:14px;letter-spacing:.12em;color:#d5bd8b">OPENING SKYLINE ONE…</div>' +
      '<iframe title="SKYLINE ONE — interactive luxury residences (CITE BIRD concept)" src="' + INTERIOR + '" allow="fullscreen" style="position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent"></iframe>' +
      '<button type="button" aria-label="Close and return to SKYLINE PLAZA" style="position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:2;width:34px;height:34px;border-radius:50%;border:1px solid #d5bd8b;background:rgba(5,8,15,.75);color:#f3e3bf;font-size:20px;cursor:pointer">×</button>';
    document.body.appendChild(ov);
    ov.querySelector('button').onclick = closeInterior;
    // the embedded app has its own "Back to SKYLINE PLAZA"; this × is only a fallback if it fails to load
    var xb = ov.querySelector('button'), fr = ov.querySelector('iframe'), loaded = false; xb.style.display = 'none';
    var xbT = setTimeout(function () { if (!loaded && ov) xb.style.display = ''; }, 12000);
    fr.addEventListener('load', function () { loaded = true; clearTimeout(xbT); try { fr.contentWindow.focus(); } catch (e) {} setTimeout(function () { try { if (ov && !(fr.contentWindow.document.getElementById('embedExit') || fr.contentWindow.document.getElementById('btnExit'))) xb.style.display = ''; } catch (e) { if (ov) xb.style.display = ''; } }, 8000); });
    try { if (document.pointerLockElement) document.exitPointerLock(); } catch (e) {}
    // the city does not need to render behind a full-screen interior: pause its loop (restored on close)
    if (Q.get('skypause') !== '0' && W && W.renderer && typeof W.tick === 'function') { try { W.renderer.setAnimationLoop(null); pausedLoop = true; } catch (e) {} }
  }
  function closeInterior() {
    if (!ov) return; ov.remove(); ov = null; S.open = false;
    if (pausedLoop && W && W.renderer && !W.disposed) { var Wd = W; try { if (Wd.clock) Wd.clock.getDelta(); Wd.renderer.setAnimationLoop(function () { Wd.tick(); }); } catch (e) {} }
    pausedLoop = false;
    try { window.focus(); } catch (e) {}
  }
  API.open = openInterior; API.close = closeInterior;
  window.addEventListener('message', function (e) { if (e.origin === location.origin && e.data && e.data.type === 'skyline-one:exit') closeInterior(); });
  window.addEventListener('keydown', function (e) { if (ov && e.key === 'Escape') closeInterior(); });

  /* ---------------- hooks ---------------- */
  function placeEntry() { var d = toWorld(DOOR.x, PLAZA.z1 - 4); return { id: SP.key, name: 'SKYLINE PLAZA', sub: 'SKYLINE ONE · walk-in luxury residences (CITE BIRD concept)', kind: 'Place', icon: '🏙', x: d.x, z: d.z, face: { x: SP.x, z: SP.z } }; }
  // fyrus-country.js rebuilds window.__fyrusPlaces by assignment; keep our entry in whatever list is current
  var placesList = window.__fyrusPlaces, placeObj = null, placesHooked = false;
  function withEntry(L) { placeObj = placeObj || placeEntry(); if (!Array.isArray(L)) return [placeObj]; for (var i = 0; i < L.length; i++) if (L[i] && L[i].id === SP.key) return L; L.push(placeObj); return L; }
  function ensurePlace() {
    if (!placesHooked) {
      try { Object.defineProperty(window, '__fyrusPlaces', { configurable: true, enumerable: true, get: function () { return placesList; }, set: function (v) { placesList = withEntry(v); } }); placesHooked = true; } catch (e) {}
    }
    placesList = withEntry(placesHooked ? placesList : window.__fyrusPlaces);
    if (!placesHooked) window.__fyrusPlaces = placesList;
  }
  function install(Wd) {
    installedFor = Wd;
    zones = [];
    for (var x = PLAZA.x0 + 12; x < PLAZA.x1; x += 24) for (var z = PLAZA.z0 + 12; z < PLAZA.z1; z += 24) { var p = toWorld(x, z); zones.push({ x: p.x, z: p.z, r: 19, sky: 1 }); }
    API.zones = zones;
    try { var orig = Wd.blocked.bind(Wd); Wd.blocked = function (s) { return zones.concat(orig(s)); }; if (Wd.sigs) Wd.sigs.blocked = ''; Wd.lastChunk = ''; } catch (e) { S.errors++; S.lastError = 'blocked ' + e.message; }
    try { if (Wd.traffic && typeof Wd.traffic.blocked === 'function' && !Wd.traffic.__sky) { var tb = Wd.traffic.blocked; Wd.traffic.blocked = function () { return zones.concat(tb()); }; Wd.traffic.__sky = 1; } } catch (e) {}
    var prevC = window.__fyrusCollide, prevS = window.__fyrusSolid, prevP = window.__fyrusNoProps, prevR = window.__fyrusRegion, prevM = window.__fyrusMinimap, prevX = window.__fyrusExtraInteracts;
    window.__fyrusCollide = function (e) {
      var p = inRect(TOWER, e.x, e.z, 0.45);
      if (p) {   // push out through the nearest face of the tower box
        var m = 0.45, dx0 = p.x - (TOWER.x0 - m), dx1 = (TOWER.x1 + m) - p.x, dz0 = p.z - (TOWER.z0 - m), dz1 = (TOWER.z1 + m) - p.z, k = Math.min(dx0, dx1, dz0, dz1);
        if (k === dx0) p.x = TOWER.x0 - m; else if (k === dx1) p.x = TOWER.x1 + m; else if (k === dz0) p.z = TOWER.z0 - m; else p.z = TOWER.z1 + m;
        var w = toWorld(p.x, p.z); e.x = w.x; e.z = w.z;
      } else if (inRect(PLAZA, e.x, e.z, 1)) {
        var l = toLocal(e.x, e.z);
        for (var i = 0; i < fixtures.length; i++) { var f = fixtures[i], ddx = l.x - f.x, ddz = l.z - f.z, dd = Math.sqrt(ddx * ddx + ddz * ddz), r = f.r + 0.35; if (dd < r && dd > 0.001) { var q = toWorld(f.x + ddx / dd * r, f.z + ddz / dd * r); e.x = q.x; e.z = q.z; l = toLocal(e.x, e.z); } }
      }
      if (prevC) prevC(e);
    };
    window.__fyrusSolid = function (X, Z) { if (inRect(TOWER, X, Z, 2)) return true; return prevS ? prevS(X, Z) : false; };
    window.__fyrusNoProps = function (X, Z) { if (inRect(PLAZA, X, Z, 3)) return true; return prevP ? prevP(X, Z) : false; };
    window.__fyrusRegion = function (X, Z) { if (inRect(PLAZA, X, Z, 2)) return { key: SP.key, name: SP.name }; return prevR ? prevR(X, Z) : null; };
    window.__fyrusMinimap = function (r, s, pl) {
      try {
        var c = [[PLAZA.x0, PLAZA.z0], [PLAZA.x1, PLAZA.z0], [PLAZA.x1, PLAZA.z1], [PLAZA.x0, PLAZA.z1]].map(function (q) { return toWorld(q[0], q[1]); });
        r.fillStyle = 'rgba(213,189,139,0.55)'; r.beginPath(); c.forEach(function (q, i) { i ? r.lineTo(q.x * s, q.z * s) : r.moveTo(q.x * s, q.z * s); }); r.closePath(); r.fill();
        var t = [[TOWER.x0, TOWER.z0], [TOWER.x1, TOWER.z0], [TOWER.x1, TOWER.z1], [TOWER.x0, TOWER.z1]].map(function (q) { return toWorld(q[0], q[1]); });
        r.fillStyle = '#d5bd8b'; r.beginPath(); t.forEach(function (q, i) { i ? r.lineTo(q.x * s, q.z * s) : r.moveTo(q.x * s, q.z * s); }); r.closePath(); r.fill();
      } catch (e) {}
      if (prevM) prevM(r, s, pl);
    };
    // third-person camera: never inside the tower (the camera module only knows circle colliders)
    var prevCam = window.__fyrusCamera;
    window.__fyrusCamera = function (d, h) {
      try {
        if (S.built && d.y < 66) {
          var a = toLocal(h.x, h.z), b = toLocal(d.x, d.z), P = 0.6, x0 = TOWER.x0 - P, x1 = TOWER.x1 + P, z0 = TOWER.z0 - P, z1 = TOWER.z1 + P;
          var dx = b.x - a.x, dz = b.z - a.z, tmin = 0, tmax = 1, ok = true;
          [[a.x, dx, x0, x1], [a.z, dz, z0, z1]].forEach(function (q) { if (!ok) return; if (Math.abs(q[1]) < 1e-9) { if (q[0] < q[2] || q[0] > q[3]) ok = false; return; } var t1 = (q[2] - q[0]) / q[1], t2 = (q[3] - q[0]) / q[1]; if (t1 > t2) { var tt = t1; t1 = t2; t2 = tt; } tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2); if (tmin > tmax) ok = false; });
          if (ok && tmax >= tmin && tmin <= 1) { var k = Math.max(0.12, tmin - 0.02); d.x = h.x + (d.x - h.x) * k; d.z = h.z + (d.z - h.z) * k; S.camPulls = (S.camPulls || 0) + 1; }
        }
      } catch (e) {}
      if (prevCam) prevCam(d, h);
    };
    var doorPos = null;
    API.interacts = function () {
      var pl = Wd.player && Wd.player.root.position; if (!pl || Wd.active !== Wd.world || !S.built) return [];
      if (Math.hypot(pl.x - SP.x, pl.z - SP.z) > 60) return [];
      if (!doorPos) { var d = toWorld(DOOR.x, DOOR.z); doorPos = new T.Vector3(d.x, 0, d.z); }
      return [{ pos: doorPos, radius: 3.4, label: 'Enter SKYLINE ONE — explore the residences', action: 'skyline', use: openInterior }];
    };
    window.__fyrusExtraInteracts = function () { var a = API.interacts(); return prevX ? a.concat(prevX() || []) : a; };
    ensurePlace();
  }

  /* ---------------- per-frame ---------------- */
  var camV = null, last = 0, placeT = 0;
  function frame(now) {
    requestAnimationFrame(frame);
    var Wd = window.__fyrusW; if (!Wd || !Wd.player || !Wd.world || !window.THREE) return;
    T = window.THREE; W = Wd;
    if (installedFor !== Wd) { if (root) { root = null; S.built = false; } install(Wd); }
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0; last = now;
    if ((placeT -= dt) <= 0) { placeT = 3; ensurePlace(); }
    if (Wd.active !== Wd.world) { if (root) root.visible = false; return; }
    var p = Wd.player.root.position; camV = camV || new T.Vector3(); if (Wd.camera) Wd.camera.getWorldPosition(camV); else camV.copy(p);
    var d = Math.min(Math.hypot(p.x - SP.x, p.z - SP.z), Math.hypot(camV.x - SP.x, camV.z - SP.z));
    if (!root && d < 650) { try { build(Wd); } catch (e) { S.errors++; S.lastError = 'build ' + (e && e.message); } }
    else if (root && d > 950) dispose();
    if (!root) return;
    root.visible = true;
    var t = now / 1000;
    if (API._ring) { var k = 0.75 + 0.25 * Math.sin(t * 3); API._ring.material.opacity = k; API._beacon.material.opacity = 0.1 + 0.08 * Math.sin(t * 3); }
    if (API._jet) API._jet.scale.y = 0.9 + 0.12 * Math.sin(t * 5);
  }
  requestAnimationFrame(frame);
})();
