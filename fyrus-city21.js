/* FYRUS Phase 21 city layer (street furniture & signage). Kill switch: ?p21off=all|signs
 * 21.3 street-name signs: one pole + two crossed name plates at a corner of every 64 m road junction within 190 m of
 * the player (city world only, not the central plaza). Original street names, drawn once into a 512x512 canvas
 * atlas; 3 draw calls total (poles, plates, caps) via InstancedMesh, with a per-instance atlas offset for the plates.
 * Rebuilt when the player moves more than 48 m. Stats: window.__fyrusCity21.stats */
(function () {
  'use strict';
  var off = (new URLSearchParams(location.search).get('p21off') || '').split(',');
  if (off.indexOf('all') >= 0) return;
  var S = { signs: 0, rebuilds: 0, ms: 0 };
  var SEATS = [];
  var API = window.__fyrusCity21 = { version: '23.2', stats: S, seats: function () { return SEATS; } };
  var EW = ['Cedar St', 'Harbor St', 'Lumen St', 'Orchard St', 'Quarry St', 'Willow St', 'Copper St', 'Beacon St'];
  var NS = ['Atlas Ave', 'Meridian Ave', 'Juniper Ave', 'Signal Ave', 'Granite Ave', 'Aurora Ave', 'Harvest Ave', 'Pioneer Ave'];
  var GRID = 64, RAD = 190, MAXN = 64;
  var T, W, poles, plates, caps, atlas, center = null;
  function makeAtlas() {
    var c = document.createElement('canvas'); c.width = 512; c.height = 512; var g = c.getContext('2d');
    var all = EW.concat(NS);
    for (var i = 0; i < 16; i++) {
      var x = (i % 2) * 256, y = Math.floor(i / 2) * 64;
      g.fillStyle = '#1f5a3a'; g.fillRect(x, y, 256, 64);
      g.strokeStyle = '#e8efe9'; g.lineWidth = 4; g.strokeRect(x + 5, y + 5, 246, 54);
      g.fillStyle = '#f4f7f5'; g.font = 'bold 30px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(all[i], x + 128, y + 33);
    }
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function build() {
    atlas = makeAtlas();
    var pm = new T.MeshStandardMaterial({ color: 0x3b4046, roughness: 0.55, metalness: 0.6 });
    poles = new T.InstancedMesh(new T.CylinderGeometry(0.045, 0.055, 3.0, 8).translate(0, 1.5, 0), pm, MAXN);
    caps = new T.InstancedMesh(new T.SphereGeometry(0.07, 8, 6).translate(0, 3.02, 0), pm, MAXN);
    var pg = new T.BoxGeometry(0.9, 0.22, 0.025);
    var off2 = new T.InstancedBufferAttribute(new Float32Array(MAXN * 2 * 2), 2); pg.setAttribute('aOff', off2);
    var plm = new T.MeshStandardMaterial({ map: atlas, roughness: 0.6, metalness: 0.1 });
    plm.onBeforeCompile = function (sh) {
      sh.vertexShader = 'attribute vec2 aOff;\n' + sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_UV\n vUv = vec2(0.5, 0.125) * uv + aOff;\n#endif');
    };
    plm.customProgramCacheKey = function () { return 'c21-plate'; };
    plates = new T.InstancedMesh(pg, plm, MAXN * 2);
    [poles, plates, caps].forEach(function (m) { m.castShadow = true; m.receiveShadow = true; m.userData.noBatch = true; m.userData.noInstance = true; m.frustumCulled = false; m.name = 'c21-signs'; });
  }

  /* 21.4 residential detail: for every home within 160 m (W.fixed.homes + chunk homes) the largest box-shaped body
   * mesh is found and, in its own frame, gets a dark stone plinth band, light corner trims and two downpipes with
   * shoes. All homes share 3 InstancedMeshes (plinth / trims / pipes). Kill switch: ?p21off=homes */
  var H = null, HS = { homes: 0, plinths: 0, trims: 0, pipes: 0, scans: 0 };
  S.homes = HS;
  function homeGroups() {
    var out = [];
    try { W.fixed.homes.forEach(function (h) { if (h.group) out.push(h.group); }); } catch (e) {}
    try { W.chunks.forEach(function (c) { c.homes.forEach(function (h) { if (h.mesh && h.mesh.group) out.push(h.mesh.group); }); }); } catch (e) {}
    return out;
  }
  function bodyOf(g) {
    var best = null, bv = 0, bb = new T.Box3();
    g.updateMatrixWorld(true);
    var inv = new T.Matrix4().copy(g.matrixWorld).invert();
    g.traverse(function (o) {
      if (!o.isMesh || !o.geometry || o.geometry.type !== 'BoxGeometry') return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      bb.copy(o.geometry.boundingBox).applyMatrix4(new T.Matrix4().multiplyMatrices(inv, o.matrixWorld));
      var sz = bb.getSize(new T.Vector3()), v = sz.x * sz.y * sz.z;
      // the ground-floor body: a large box that starts near the plot level (upper floors / roofs are skipped)
      if (sz.y > 2 && sz.x > 3 && sz.z > 3 && bb.min.y < 1.2 && v > bv) { bv = v; best = bb.clone(); }
    });
    return best;
  }
  function buildHomes() {
    var stone = new T.MeshStandardMaterial({ color: 0x5d5a55, roughness: 0.9 });
    var trim = new T.MeshStandardMaterial({ color: 0xe9e4da, roughness: 0.7 });
    var pipe = new T.MeshStandardMaterial({ color: 0x55595e, roughness: 0.45, metalness: 0.5 });
    H = {
      plinth: new T.InstancedMesh(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), stone, 400),
      trim: new T.InstancedMesh(new T.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), trim, 1600),
      pipe: new T.InstancedMesh(new T.CylinderGeometry(0.05, 0.05, 1, 8).translate(0, 0.5, 0), pipe, 800)
    };
    Object.keys(H).forEach(function (k) { var m = H[k]; m.count = 0; m.castShadow = k !== 'plinth'; m.receiveShadow = true; m.userData.noBatch = m.userData.noInstance = true; m.frustumCulled = false; m.name = 'c21-home-' + k; });
  }
  var lastScan = 0;
  function scanHomes() {
    var p = W.player.root.position, M4 = new T.Matrix4(), L = new T.Matrix4(), np = 0, nt = 0, nq = 0, nh = 0;
    homeGroups().forEach(function (g) {
      if (!g.parent) return;
      var wp = g.getWorldPosition(new T.Vector3()); if (wp.distanceTo(p) > 160) return;
      var b = g.userData.c21body; if (b === undefined) b = g.userData.c21body = bodyOf(g);
      if (!b) return;
      nh++;
      if (nh <= 4) { (HS.sample = HS.sample || [])[nh - 1] = { at: [Math.round(wp.x), Math.round(wp.z)], body: b.getSize(new T.Vector3()).toArray().map(function (x) { return Math.round(x * 10) / 10; }), min: b.min.toArray().map(function (x) { return Math.round(x * 10) / 10; }), kids: g.children.length, types: g.children.slice(0, 8).map(function (c) { return c.isMesh ? c.geometry.type : c.type; }) }; }
      var sz = b.getSize(new T.Vector3()), c = b.getCenter(new T.Vector3()), y0 = b.min.y;
      function put(im, i, x, y, z, sx, sy, sz2) { L.compose(new T.Vector3(x, y, z), new T.Quaternion(), new T.Vector3(sx, sy, sz2)); M4.multiplyMatrices(g.matrixWorld, L); im.setMatrixAt(i, M4); }
      if (np < 400) put(H.plinth, np++, c.x, y0, c.z, sz.x + 0.12, Math.min(0.45, sz.y * 0.12), sz.z + 0.12);
      [[b.min.x, b.min.z], [b.max.x, b.min.z], [b.min.x, b.max.z], [b.max.x, b.max.z]].forEach(function (q) {
        if (nt < 1600) put(H.trim, nt++, q[0], y0 + 0.4, q[1], 0.16, sz.y - 0.4, 0.16);
      });
      [[b.max.x + 0.08, b.max.z - 0.35], [b.min.x - 0.08, b.min.z + 0.35]].forEach(function (q) {
        if (nq < 800) { put(H.pipe, nq++, q[0], y0, q[1], 1, sz.y, 1); }
      });
    });
    H.plinth.count = np; H.trim.count = nt; H.pipe.count = nq;
    Object.keys(H).forEach(function (k) { H[k].instanceMatrix.needsUpdate = true; });
    HS.homes = nh; HS.plinths = np; HS.trims = nt; HS.pipes = nq; HS.scans++;
  }


  /* 21.7 street furniture: benches (seat + back + 2 legs), planters (box + shrub) and bollards, on the pavements of
   * every road segment within 170 m of the player. Benches mid-block at x|z = 64k + 16 / 48 (alternating sides), planters
   * next to them, 3 bollards at each crossing corner. Pure decoration (no collision yet). 6 instanced draw calls.
   * Kill switch: ?p21off=furniture */
  var F = null, FS = { benches: 0, planters: 0, bollards: 0, rebuilds: 0 }, fCenter = null;
  S.furniture = FS;
  function buildFurniture() {
    var wood = new T.MeshStandardMaterial({ color: 0x8a5a33, roughness: 0.75 }), iron = new T.MeshStandardMaterial({ color: 0x2c2f33, roughness: 0.45, metalness: 0.6 });
    var conc = new T.MeshStandardMaterial({ color: 0x9a968e, roughness: 0.9 }), leaf = new T.MeshStandardMaterial({ color: 0x3f6b2a, roughness: 0.85 });
    function im(g, m, n) { var x = new T.InstancedMesh(g, m, n); x.count = 0; x.castShadow = true; x.receiveShadow = true; x.userData.noBatch = x.userData.noInstance = true; x.frustumCulled = false; x.name = 'c21-furn'; return x; }
    F = {
      seat: im(new T.BoxGeometry(1.8, 0.07, 0.45).translate(0, 0.45, 0), wood, 300),
      back: im(new T.BoxGeometry(1.8, 0.4, 0.06).translate(0, 0.72, 0.2), wood, 300),
      legs: im(new T.BoxGeometry(0.06, 0.45, 0.42).translate(0, 0.225, 0), iron, 600),
      pbox: im(new T.BoxGeometry(1.1, 0.5, 1.1).translate(0, 0.25, 0), conc, 300),
      shrub: im(new T.IcosahedronGeometry(0.55, 1).translate(0, 0.85, 0), leaf, 300),
      boll: im(new T.CylinderGeometry(0.09, 0.11, 0.9, 10).translate(0, 0.45, 0), iron, 900)
    };
  }
  function placeFurniture() {
    var p = W.player.root.position, R = 170, m = new T.Matrix4(), q = new T.Quaternion(), up = new T.Vector3(0, 1, 0), one = new T.Vector3(1, 1, 1), v = new T.Vector3();
    var n = { seat: 0, back: 0, legs: 0, pbox: 0, shrub: 0, boll: 0 }; SEATS.length = 0;
    function put(k, x, y, z, ang) { if (n[k] >= F[k].instanceMatrix.count) return; q.setFromAxisAngle(up, ang); m.compose(v.set(x, y, z), q, one); F[k].setMatrixAt(n[k]++, m); }
    function ok(x, z) { if (x * x + z * z < 62 * 62) return false; if (window.__fyrusNoProps && window.__fyrusNoProps(x, z)) return false;   // 35: airports keep their apron clear
      var g = W.groundAt ? W.groundAt(x, z) : 0; return g < 0.3; }
    function bench(x, z, ang) {
      var y = W.groundAt ? W.groundAt(x, z) : 0; put('seat', x, y, z, ang); put('back', x, y, z, ang);
      SEATS.push({ x: x, y: y, z: z, ang: ang, id: Math.round(x * 10) + ':' + Math.round(z * 10) });   // 23.2 sittable
      var c = Math.cos(ang), s = Math.sin(ang); put('legs', x + c * 0.75, y, z - s * 0.75, ang); put('legs', x - c * 0.75, y, z + s * 0.75, ang);
    }
    var k0 = Math.floor((p.x - R) / 64), k1 = Math.ceil((p.x + R) / 64), j0 = Math.floor((p.z - R) / 64), j1 = Math.ceil((p.z + R) / 64);
    for (var i = k0; i <= k1; i++) for (var j = j0; j <= j1; j++) {
      var rx = i * 64 + 32, rz = j * 64 + 32;                       // a junction; its east and north road segments
      [16, 48].forEach(function (o, oi) {
        var side = ((i + j + oi) & 1) ? 1 : -1;
        // east-west road along z = rz: pavement at z = rz +- 5.8, bench faces the road
        var x1 = rx + o, z1 = rz + side * 5.8;
        if (Math.hypot(x1 - p.x, z1 - p.z) < R && ok(x1, z1)) { bench(x1, z1, side > 0 ? Math.PI : 0); put('pbox', x1 + 2.2, W.groundAt(x1 + 2.2, z1), z1, 0); put('shrub', x1 + 2.2, W.groundAt(x1 + 2.2, z1), z1, 0); }
        // north-south road along x = rx
        var x2 = rx + side * 5.8, z2 = rz + o;
        if (Math.hypot(x2 - p.x, z2 - p.z) < R && ok(x2, z2)) { bench(x2, z2, side > 0 ? -Math.PI / 2 : Math.PI / 2); put('pbox', x2, W.groundAt(x2, z2 + 2.2), z2 + 2.2, 0); put('shrub', x2, W.groundAt(x2, z2 + 2.2), z2 + 2.2, 0); }
      });
      // bollards at the 4 corners of the junction (kerb side, where the crossings meet the pavement)
      if (Math.hypot(rx - p.x, rz - p.z) < R && (rx * rx + rz * rz) > 62 * 62)
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (c) { for (var b = 0; b < 3; b++) { var bx = rx + c[0] * 4.35, bz = rz + c[1] * (8.7 + b * 0.9); if (ok(bx, bz)) put('boll', bx, W.groundAt(bx, bz), bz, 0); } });
    }
    Object.keys(F).forEach(function (k2) { F[k2].count = n[k2]; F[k2].instanceMatrix.needsUpdate = true; });
    FS.benches = n.seat; FS.planters = n.pbox; FS.bollards = n.boll; FS.rebuilds++; fCenter = p.clone();
  }


  /* 21.9 interior furnishing for home interiors (W.active === W.home, scene mode "home"): a dining set on a rug,
   * a reading corner (2 armchairs, side table, floor lamp, bookshelf with books), plants and framed wall art, laid out
   * from the room bounds and kept clear of the entrance aisle and the centre. Built once per interior, removed on
   * exit. About 10 merged meshes. Kill switch: ?p21off=interior */
  var itick = 0, IG = null, IFor = null, IS = { built: 0, parts: 0 };
  S.interior = IS;
  function furnish(W) {
    var b = W.interior && W.interior.bounds; if (!b) return null;
    var X = b.hx, Z = b.hz, g = new T.Group(); g.name = 'c21-interior';
    var M_ = function (c, r, me) { return new T.MeshStandardMaterial({ color: c, roughness: r == null ? 0.7 : r, metalness: me || 0 }); };
    var wood = M_(0x6e4a2e, 0.6), dark = M_(0x2b2d31, 0.4, 0.5), fab1 = M_(0x5d7a8c, 0.9), fab2 = M_(0xb2633d, 0.9), rugM = M_(0xc9b8a0, 0.95), leaf = M_(0x3d6b2d, 0.8), pot = M_(0xe8e2d6, 0.6);
    var parts = 0;
    function box(w, h, d, m, x, y, z, ry) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y + h / 2, z); o.rotation.y = ry || 0; o.castShadow = o.receiveShadow = true; g.add(o); parts++; return o; }
    function cyl(r1, r2, h, m, x, y, z) { var o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, 14), m); o.position.set(x, y + h / 2, z); o.castShadow = o.receiveShadow = true; g.add(o); parts++; return o; }
    // dining set on a rug (left half, middle depth)
    var dx = -X * 0.62, dz = -Z * 0.05;
    box(3.4, 0.02, 2.6, rugM, dx, 0.005, dz);
    box(1.8, 0.06, 0.95, wood, dx, 0.72, dz); [[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]].forEach(function (q) { box(0.06, 0.72, 0.06, wood, dx + q[0], 0, dz + q[1]); });
    [[-0.45, -0.75, 0], [0.45, -0.75, 0], [-0.45, 0.75, Math.PI], [0.45, 0.75, Math.PI]].forEach(function (q) {
      var cx = dx + q[0], cz = dz + q[1]; box(0.44, 0.05, 0.44, wood, cx, 0.44, cz); box(0.44, 0.5, 0.05, wood, cx, 0.49, cz + (q[2] ? 0.2 : -0.2));
      [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].forEach(function (l) { box(0.04, 0.44, 0.04, wood, cx + l[0], 0, cz + l[1]); });
    });
    cyl(0.12, 0.09, 0.22, pot, dx, 0.78, dz); cyl(0.0, 0.16, 0.3, leaf, dx, 1.0, dz);
    // reading corner (right back): armchairs facing each other, side table, floor lamp, bookshelf on the right wall
    var rx = X * 0.62, rz = Z * 0.4;                 // right-front corner (the right-back corner has the room's own sofa)
    [[-0.75, 0, fab1, Math.PI / 2], [0.75, 0, fab2, -Math.PI / 2]].forEach(function (a) {
      var ax = rx + a[0]; box(0.85, 0.42, 0.85, a[2], ax, 0, rz); box(0.85, 0.5, 0.18, a[2], ax + (a[0] < 0 ? -0.34 : 0.34), 0.42, rz, Math.PI / 2);
      box(0.15, 0.22, 0.85, a[2], ax, 0.42, rz - 0.35); box(0.15, 0.22, 0.85, a[2], ax, 0.42, rz + 0.35);
    });
    cyl(0.28, 0.28, 0.04, wood, rx, 0.52, rz); cyl(0.03, 0.03, 0.52, dark, rx, 0, rz);
    cyl(0.02, 0.02, 1.55, dark, rx + 1.4, 0, rz - 0.7); cyl(0.18, 0.24, 0.28, M_(0xf3e6c8, 0.9), rx + 1.4, 1.5, rz - 0.7);
    var sx = X - 0.22, sz = Z * 0.05; box(0.36, 2.0, 1.8, wood, sx, 0, sz);
    for (var sh = 0; sh < 4; sh++) {
      box(0.3, 0.03, 1.7, dark, sx - 0.02, 0.35 + sh * 0.45, sz);
      for (var bk = 0; bk < 7; bk++) box(0.22, 0.26 + 0.06 * ((bk * 7 + sh) % 3), 0.07, M_([0x8c2f2f, 0x2f4f8c, 0x4f7a3a, 0xc9a24a, 0x5a3e6e][(bk + sh) % 5], 0.8), sx - 0.04, 0.39 + sh * 0.45, sz - 0.7 + bk * 0.2);
    }
    // plants along the left wall, framed art on the left and right walls
    [[-X + 0.6, Z * 0.45], [-X + 0.6, -Z * 0.6]].forEach(function (q) { cyl(0.22, 0.17, 0.45, pot, q[0], 0, q[1]); cyl(0.0, 0.42, 1.1, leaf, q[0], 0.45, q[1]); });
    [[-X + 0.04, -Z * 0.3, Math.PI / 2, 0x7a9cc0], [-X + 0.04, Z * 0.15, Math.PI / 2, 0xd08a4c], [X - 0.04, -Z * 0.25, -Math.PI / 2, 0x6c8f5a]].forEach(function (a) {
      box(1.1, 0.8, 0.04, dark, a[0], 1.35, a[1], a[2]); box(0.96, 0.66, 0.05, M_(a[3], 0.6), a[0] + (a[2] > 0 ? 0.01 : -0.01), 1.42, a[1], a[2]);
    });
    IS.parts = parts; IS.built++;
    return g;
  }
  function interiorTick(W) {
    var inHome = W.active === W.home && W.interior && W.interior.bounds && W.home;
    var mode = null; try { mode = window.__fyrus.getState().scene.mode; } catch (e) {}
    if (inHome && mode === 'home') {
      if (IFor !== W.interior) { if (IG && IG.parent) IG.parent.remove(IG); IG = furnish(W); IFor = W.interior; if (IG) W.home.add(IG); }
    } else if (IG) { if (IG.parent) IG.parent.remove(IG); IG.traverse(function (o) { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } }); IG = null; IFor = null; }
  }


  /* 21.10 scene transitions: when the engine switches scene (city <-> interior), the new scene appears behind a short
   * fade from black (0.45 s) instead of a hard cut, hiding the first frames while it builds. Also logs the switch.
   * Kill switch: ?p21off=fade */
  var FD = { el: null, last: null, t: 0, n: 0 };
  S.fade = { switches: 0 };
  function fadeTick(W, dt) {
    if (!FD.el) { var d = document.createElement('div'); d.style.cssText = 'position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;z-index:50;transition:none'; document.body.appendChild(d); FD.el = d; FD.last = W.active; }
    if (W.active !== FD.last) { FD.last = W.active; FD.t = 0.45; S.fade.switches++; }
    if (FD.t > 0) { FD.t = Math.max(0, FD.t - dt); FD.el.style.opacity = String(Math.min(1, FD.t / 0.3)); } else if (FD.el.style.opacity !== '0') FD.el.style.opacity = '0';
  }


  /* 21.13 draw-call reduction: the city builds many props/buildings as BoxGeometry with an ARRAY of 6 plain
   * MeshStandardMaterials (one per face, colours only). three draws each face group separately and the Phase 16
   * batcher cannot merge multi-material meshes - measured 1,908 draw calls of this kind at the outer stop. Such a mesh
   * is converted to ONE vertex-coloured material (face colours baked per vertex, geometry cached by geometry+colours)
   * and handed to the batcher, which can then merge it with its neighbours. Only plain materials qualify (no maps,
   * opaque, equal roughness/metalness/emissive). Time-sliced (<= 1.5 ms per frame). Kill switch: ?p21off=mm */
  var MM = { stack: null, idle: 0, conv: 0, skipped: 0, ms: 0 }, MMGEO = new Map(), MMMAT = new Map();
  S.mm = MM;
  function why(r) { MM.why = MM.why || {}; MM.why[r] = (MM.why[r] || 0) + 1; return false; }
  function mmOk(arr) {
    if (!Array.isArray(arr) || arr.length < 2) return why('short');
    var a = arr[0];
    for (var i = 0; i < arr.length; i++) {
      var m = arr[i];
      if (!m || !m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) return why('type');
      if (m.map || m.emissiveMap || m.normalMap || m.alphaMap) return why('maps');
      if (m.transparent || m.opacity < 1 || m.vertexColors || m.wireframe) return why('blend');
      if (m.roughness !== a.roughness || m.metalness !== a.metalness || m.side !== a.side || m.flatShading !== a.flatShading) return why('rough');
      if (m.emissive && a.emissive && m.emissive.getHex() !== a.emissive.getHex()) return why('emissive');
      if (m.onBeforeCompile !== a.onBeforeCompile || m.customProgramCacheKey !== a.customProgramCacheKey) return why('patch');   // a shared engine patch is fine
    }
    return true;
  }
  function mmConvert(o) {
    var arr = o.material, g = o.geometry;
    if (!g.groups || !g.groups.length || g.morphAttributes && Object.keys(g.morphAttributes).length) return false;
    var key = g.uuid + '|' + arr.map(function (m) { return m.color.getHexString(); }).join(',');
    var ng = MMGEO.get(key);
    if (!ng) {
      ng = g.clone(); var n = ng.attributes.position.count, col = new Float32Array(n * 3), idx = ng.index;
      ng.groups.forEach(function (gr) {
        var c = arr[gr.materialIndex] ? arr[gr.materialIndex].color : arr[0].color;
        for (var i = gr.start; i < gr.start + gr.count; i++) { var v = idx ? idx.getX(i) : i; col[v * 3] = c.r; col[v * 3 + 1] = c.g; col[v * 3 + 2] = c.b; }
      });
      ng.setAttribute('color', new T.BufferAttribute(col, 3)); ng.clearGroups(); ng.userData.c21mm = true;
      MMGEO.set(key, ng);
      ng.addEventListener('dispose', function () { MMGEO.delete(key); });   // the city disposes unloaded chunks: no cache leak
      g.addEventListener('dispose', function () { MMGEO.delete(key); });
    }
    var a = arr[0], mk = (a.onBeforeCompile === T.Material.prototype.onBeforeCompile ? 'p' : a.onBeforeCompile.toString().length) + '|' + a.roughness + '|' + a.metalness + '|' + (a.emissive ? a.emissive.getHex() : 0) + '|' + a.side + '|' + a.flatShading;
    var nm = MMMAT.get(mk);
    if (!nm) { nm = new T.MeshStandardMaterial({ color: 0xffffff, vertexColors: true, roughness: a.roughness, metalness: a.metalness, side: a.side, flatShading: a.flatShading }); if (a.emissive) nm.emissive.copy(a.emissive); nm.name = 'c21-mm'; if (a.onBeforeCompile !== T.Material.prototype.onBeforeCompile) { nm.onBeforeCompile = a.onBeforeCompile; nm.customProgramCacheKey = a.customProgramCacheKey; } MMMAT.set(mk, nm); }
    o.geometry = ng; o.material = nm; o.userData.c21mm = true;
    try { if (window.__fyrusPerf && window.__fyrusPerf.changed) window.__fyrusPerf.changed(o); } catch (e) {}
    return true;
  }

  // multi-material meshes WITH textures cannot be colour-baked; but their 6 face groups usually reference only 2-3
  // distinct materials (e.g. the same window texture on 4 sides). Re-ordering the index so faces of the same material
  // are contiguous gives one group (= one draw) per distinct material. Materials are untouched.
  var RGGEO = new Map();
  function regroup(o) {
    var arr = o.material, g = o.geometry; if (!g.index || !g.groups || g.groups.length < 2) return false;
    var firstIdx = {}, order = [];
    g.groups.forEach(function (gr) { var m = arr[gr.materialIndex]; if (!m) return; if (firstIdx[m.uuid] == null) { firstIdx[m.uuid] = gr.materialIndex; order.push(m.uuid); } });
    if (order.length >= g.groups.length) return false;                         // nothing shared: no gain
    var key = g.uuid + '|' + g.groups.map(function (gr) { return arr[gr.materialIndex] ? order.indexOf(arr[gr.materialIndex].uuid) : -1; }).join(',');
    var ng = RGGEO.get(key);
    if (!ng) {
      ng = g.clone(); var src = g.index.array, out = new (src.constructor)(src.length), w = 0, groups = [];
      order.forEach(function (u) {
        var st = w;
        g.groups.forEach(function (gr) { var m = arr[gr.materialIndex]; if (m && m.uuid === u) { out.set(src.subarray(gr.start, gr.start + gr.count), w); w += gr.count; } });
        groups.push({ start: st, count: w - st, materialIndex: firstIdx[u] });
      });
      ng.setIndex(new T.BufferAttribute(out.subarray(0, w), 1)); ng.clearGroups(); groups.forEach(function (gr) { ng.addGroup(gr.start, gr.count, gr.materialIndex); });
      ng.userData.c21rg = true; RGGEO.set(key, ng);
      ng.addEventListener('dispose', function () { RGGEO.delete(key); }); g.addEventListener('dispose', function () { RGGEO.delete(key); });
    }
    MM.saved = (MM.saved || 0) + (g.groups.length - order.length);
    o.geometry = ng; o.userData.c21mm = 'rg';
    return true;
  }

  function mmPass(W) {
    var t0 = performance.now();
    if (!MM.stack) { if (t0 < MM.idle) return; MM.stack = [W.world]; MM.found = 0; }
    var skip = W.player && W.player.root;
    while (MM.stack.length && performance.now() - t0 < 1.5) {
      var o = MM.stack.pop();
      if (o === skip || o.isSkinnedMesh || o.isInstancedMesh) continue;
      for (var i = 0; i < o.children.length; i++) MM.stack.push(o.children[i]);
      if (!o.isMesh || o.userData.c21mm || !Array.isArray(o.material)) continue;
      if (mmOk(o.material) && mmConvert(o)) { MM.conv++; MM.found++; } else if (regroup(o)) { MM.regrouped = (MM.regrouped || 0) + 1; MM.found++; } else { MM.skipped++; o.userData.c21mm = 'no'; }
    }
    if (!MM.stack.length) { MM.stack = null; MM.idle = performance.now() + (MM.found ? 500 : 3000); MM.passes = (MM.passes || 0) + 1; }
    MM.ms = Math.round((MM.ms * 0.95 + (performance.now() - t0) * 0.05) * 1000) / 1000;
  }


  /* 22.1 junction traffic signals. A shared clock (24 s cycle per junction: x green 10 s, x amber 2 s, z green 10 s,
   * z amber 2 s, with a per-junction offset) is published as window.__fyrusSignals.state(jx, jz, axis); the traffic
   * system (019.js) stops cars on red / late amber. Visible heads: at every junction within 170 m, two poles on opposite
   * corners, each with a lamp head per axis (instanced; lamp colours updated 4x per second). Kill switch ?p22off=signals */
  var SIGOFF = (new URLSearchParams(location.search).get('p22off') || '').split(',').indexOf('signals') >= 0;
  var SG = null, SGS = { heads: 0, stops: 0 }, sgCenter = null, sgAcc = 0, SGJ = [];
  S.signals = SGS;
  function sgOffset(jx, jz) { var h = Math.sin(jx * 12.9898 + jz * 78.233) * 43758.5453; return (h - Math.floor(h)) * 24; }
  function sgState(jx, jz, axis) {
    var t = (performance.now() / 1000 + sgOffset(jx, jz)) % 24;
    var xs = t < 10 ? 'green' : t < 12 ? 'amber' : 'red', zs = t < 12 ? 'red' : t < 22 ? 'green' : 'amber';
    return axis === 'x' ? xs : zs;
  }
  // seconds until the cars on `axis` get a non-red light (0 when not red); used by pedestrians (22.3)
  function sgRedLeft(jx, jz, axis) {
    var t = (performance.now() / 1000 + sgOffset(jx, jz)) % 24;
    if (axis === 'x') return t >= 12 ? 24 - t : 0;
    return t < 12 ? 12 - t : 0;
  }
  if (!SIGOFF) window.__fyrusSignals = { version: '22.3', state: sgState, redLeft: sgRedLeft, cycle: 24 };
  function buildSignals() {
    var pm = new T.MeshStandardMaterial({ color: 0x24272b, roughness: 0.5, metalness: 0.6 });
    var lm = new T.MeshBasicMaterial({ color: 0xffffff });
    function im(g, m, n) { var x = new T.InstancedMesh(g, m, n); x.count = 0; x.castShadow = m === pm; x.userData.noBatch = x.userData.noInstance = true; x.frustumCulled = false; x.name = 'c22-signal'; return x; }
    SG = { pole: im(new T.CylinderGeometry(0.07, 0.08, 3.4, 8).translate(0, 1.7, 0), pm, 300), box: im(new T.BoxGeometry(0.32, 0.9, 0.3).translate(0, 3.0, 0), pm, 600), lamp: im(new T.SphereGeometry(0.11, 10, 8), lm, 600) };
    SG.lamp.setColorAt(0, new T.Color(0, 0, 0)); SG.lamp.instanceColor.setUsage(T.DynamicDrawUsage);
  }
  var LC = { red: [1, 0.08, 0.05], amber: [1, 0.6, 0.05], green: [0.1, 1, 0.35] };
  function placeSignals() {
    var p = W.player.root.position, R = 170, m = new T.Matrix4(), q = new T.Quaternion(), up = new T.Vector3(0, 1, 0), one = new T.Vector3(1, 1, 1), v = new T.Vector3();
    var np = 0, nb = 0; SGJ = [];
    var k0 = Math.floor((p.x - R) / 64), k1 = Math.ceil((p.x + R) / 64), j0 = Math.floor((p.z - R) / 64), j1 = Math.ceil((p.z + R) / 64);
    for (var i = k0; i <= k1; i++) for (var j = j0; j <= j1; j++) {
      var jx = i * 64 + 32, jz = j * 64 + 32;
      if (Math.hypot(jx - p.x, jz - p.z) > R || jx * jx + jz * jz < 62 * 62 || np >= 298) continue;
      [[1, 1], [-1, -1]].forEach(function (c) {
        var x = jx + c[0] * 4.6, z = jz + c[1] * 4.6, y = W.groundAt ? W.groundAt(x, z) : 0; if (y > 0.3 || (window.__fyrusNoProps && window.__fyrusNoProps(x, z))) return;
        m.compose(v.set(x, y, z), q.identity(), one); SG.pole.setMatrixAt(np++, m);
        // one head facing traffic along x (for the x axis) and one facing along z
        [['x', Math.PI / 2], ['z', 0]].forEach(function (h) {
          var ang = h[1] + (c[0] > 0 ? Math.PI : 0); q.setFromAxisAngle(up, ang);
          var ox = h[0] === 'x' ? 0 : 0.25 * c[0], oz = h[0] === 'z' ? 0 : 0.25 * c[1];
          m.compose(v.set(x + ox, y, z + oz), q, one); SG.box.setMatrixAt(nb, m);
          var fx = Math.sin(ang) * 0.16, fz = Math.cos(ang) * 0.16;
          m.compose(v.set(x + ox + fx, y + 3.0, z + oz + fz), q.identity(), one); SG.lamp.setMatrixAt(nb, m);
          SGJ.push({ jx: jx, jz: jz, axis: h[0], i: nb }); nb++;
        });
      });
    }
    SG.pole.count = np; SG.box.count = SG.lamp.count = nb;
    [SG.pole, SG.box, SG.lamp].forEach(function (x) { x.instanceMatrix.needsUpdate = true; });
    SGS.heads = nb; sgCenter = p.clone(); sgAcc = 1;
  }
  function signalTick(W, dt, inWorld) {
    Object.keys(SG).forEach(function (k) { var x = SG[k]; if (inWorld && x.parent !== W.world) W.world.add(x); if (!inWorld && x.parent) x.parent.remove(x); });
    if (!inWorld) return;
    if (!sgCenter || sgCenter.distanceTo(W.player.root.position) > 48) placeSignals();
    sgAcc += dt; if (sgAcc < 0.25) return; sgAcc = 0;
    var col = new T.Color();
    SGJ.forEach(function (h) { var c = LC[sgState(h.jx, h.jz, h.axis)]; SG.lamp.setColorAt(h.i, col.setRGB(c[0], c[1], c[2])); });
    SG.lamp.instanceColor.needsUpdate = true;
    try { var stopped = 0; (W.traffic && W.traffic.cars || []).forEach(function (cr) { if (cr.waiting > 0) stopped++; }); SGS.stops = stopped; SGS.cars = W.traffic ? W.traffic.cars.length : 0; } catch (e) {}
  }

  var M = null, Q = null, P = null, V = null, Sc = null;
  function place() {
    var p = W.player.root.position, n = 0, k = 0;
    var gx0 = Math.round((p.x - RAD) / GRID), gx1 = Math.round((p.x + RAD) / GRID), gz0 = Math.round((p.z - RAD) / GRID), gz1 = Math.round((p.z + RAD) / GRID);
    var offA = plates.geometry.attributes.aOff;
    for (var gx = gx0; gx <= gx1 && n < MAXN; gx++) for (var gz = gz0; gz <= gz1 && n < MAXN; gz++) {
      var jx = gx * GRID + GRID / 2, jz = gz * GRID + GRID / 2, dx = jx - p.x, dz = jz - p.z;   // road centre lines run at 32 + 64k (ground shader)
      if (dx * dx + dz * dz > RAD * RAD) continue;
      if (jx * jx + jz * jz < 60 * 60) continue;                        // the central plaza has its own furniture
      var sx = ((gx + gz) & 1) ? 1 : -1, sz = (gx & 1) ? 1 : -1;      // vary the corner per junction
      var x = jx + sx * 5.0, z = jz + sz * 5.0, y = W.groundAt ? W.groundAt(x, z) : 0;
      if (y > 0.5) continue;                                            // something built here (not plain pavement)
      if (window.__fyrusNoProps && window.__fyrusNoProps(x, z)) continue;   // 35: no street signs on an airport
      M.makeTranslation(x, y, z); poles.setMatrixAt(n, M); caps.setMatrixAt(n, M);
      var ew = ((gz % 8) + 8) % 8, ns = 8 + ((gx % 8) + 8) % 8;
      // plate along x (names the east-west street at z = jz) and plate along z (north-south street at x = jx)
      Q.setFromAxisAngle(V.set(0, 1, 0), 0); P.set(x + sx * 0.0, y + 2.72, z); M.compose(P, Q, Sc); plates.setMatrixAt(k, M);
      offA.setXY(k, (ew % 2) * 0.5, 1 - 0.125 - Math.floor(ew / 2) * 0.125); k++;
      Q.setFromAxisAngle(V.set(0, 1, 0), Math.PI / 2); P.set(x, y + 2.48, z); M.compose(P, Q, Sc); plates.setMatrixAt(k, M);
      offA.setXY(k, (ns % 2) * 0.5, 1 - 0.125 - Math.floor(ns / 2) * 0.125); k++;
      n++;
    }
    poles.count = caps.count = n; plates.count = k;
    [poles, caps, plates].forEach(function (m) { m.instanceMatrix.needsUpdate = true; });
    offA.needsUpdate = true;
    S.signs = n; S.rebuilds++; center = p.clone();
  }
  var lastT = performance.now();
  function tick() {
    var t0 = performance.now(), fdt = Math.min(0.1, (t0 - lastT) / 1000); lastT = t0;
    if (off.indexOf('fade') < 0) fadeTick(W, fdt);
    var scn = W.active || W.world, inWorld = W.active === W.world;
    if (poles) [poles, plates, caps].forEach(function (m) { if (inWorld && m.parent !== W.world) W.world.add(m); if (!inWorld && m.parent) m.parent.remove(m); });
    if (poles && inWorld && (!center || center.distanceTo(W.player.root.position) > 48)) place();
    if (off.indexOf('interior') < 0 && (++itick % 10) === 0) interiorTick(W);
    if (off.indexOf('mm') < 0 && inWorld) mmPass(W);
    if (SG) signalTick(W, fdt, inWorld);
    if (F) {
      Object.keys(F).forEach(function (k) { var m = F[k]; if (inWorld && m.parent !== W.world) W.world.add(m); if (!inWorld && m.parent) m.parent.remove(m); });
      if (inWorld && (!fCenter || fCenter.distanceTo(W.player.root.position) > 48)) placeFurniture();
    }
    if (H) {
      Object.keys(H).forEach(function (k) { var m = H[k]; if (inWorld && m.parent !== W.world) W.world.add(m); if (!inWorld && m.parent) m.parent.remove(m); });
      var now = performance.now(); if (inWorld && now - lastScan > 2000) { lastScan = now; scanHomes(); }
    }
    S.ms = Math.round((S.ms * 0.95 + (performance.now() - t0) * 0.05) * 1000) / 1000;
  }
  function start() {
    T = window.THREE; W = window.__fyrusW;
    M = new T.Matrix4(); Q = new T.Quaternion(); P = new T.Vector3(); V = new T.Vector3(); Sc = new T.Vector3(1, 1, 1);
    if (off.indexOf('signs') < 0) build();
    if (off.indexOf('homes') < 0) buildHomes();
    if (off.indexOf('furniture') < 0) buildFurniture();
    if (!SIGOFF) buildSignals();
    var r = W.renderer, orig = r.render;
    r.render = function () { try { if (poles || H || F || SG) tick(); } catch (e) { S.error = String(e && e.message || e); } return orig.apply(this, arguments); };
    S.started = true;
  }
  (function wait() { var w = window.__fyrusW; if (w && w.renderer && w.player && w.world && window.THREE) start(); else setTimeout(wait, 500); })();
})();
