/* FYRUS 35 — International airports (code-generated, no Blender, no external assets).
 * One reusable generator builds a whole airport from a spec: landside roads/parking/taxis/bus, a two-level terminal you
 * can walk through (check-in hall on the ground floor, security, escalators up to the airside pier with gates, jet
 * bridges, duty free, cafe, VIP lounge; arrivals with immigration, baggage claim and customs), apron, taxiways, runway
 * with lights, control tower, hangar, cargo terminal, service vehicles, an aircraft fleet and Human32 staff/passengers.
 * Flights: ticket (FYC, charged once) -> check-in (boarding pass, gate) -> security -> (immigration) -> gate -> boarding
 * (cabin view, pushback, takeoff) -> flight -> landing at the destination airport -> arrivals hall.
 * Only the airport near the player is built; the other one stays unloaded. Kill switch: ?a35off=1.
 * API: window.__fyrusAir35 { airports, stats, ticket(), book(routeId), consume(flightId), go(code) } */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if (Q.get('a35off') === '1') return;
  var T = null, W = null;
  var S = { built: 0, disposed: 0, aircraft: 0, people: 0, flights: 0, errors: 0, lastError: null, buildMs: 0 };
  var API = window.__fyrusAir35 = { version: '35.6', stats: S };
  // the city's legacy air tours (startFlight) board at the FCI curb and use runway 18/36 (read by the patched game code)
  window.__fyrusAirCurb = { x: 408, z: 40 }; window.__fyrusAirRunway = { x: 526, z: 80, len: 420, ry: -Math.PI / 2 };
  function st() { try { return window.__fyrus.getState(); } catch (e) { return null; } }
  function toast(m, k) { try { if (window.__fyrusToast) return window.__fyrusToast(m, k); if (window.__fyrusCountry && window.__fyrusCountry.toast) return window.__fyrusCountry.toast(m); } catch (e) {} console.log('[air35]', m); }
  function uid() { var s = st(); return (s && s.session && s.session.userId) || 'guest'; }
  var LSK = function (k) { return 'fyrus.air35.' + uid() + '.' + k; };
  function lsGet(k, d) { try { var v = localStorage.getItem(LSK(k)); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(LSK(k), JSON.stringify(v)); } catch (e) {} }

  /* ======================================================================================================
   * shared materials and textures
   * ====================================================================================================== */
  var M = null;
  function canvasTex(w, h, draw, rep) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    t.userData = { canvas: c }; return t;
  }
  function mats() {
    if (M) return M;
    var std = function (o) { return new T.MeshStandardMaterial(o); };
    // 35.2 polished marble: large 1.2 m slabs, soft grey veining, thin gold inlay between slab rows
    var tile = canvasTex(512, 512, function (g, w) {
      g.fillStyle = '#ece8e1'; g.fillRect(0, 0, w, w);
      for (var k = 0; k < 2200; k++) { g.fillStyle = 'rgba(' + (200 + Math.random() * 40 | 0) + ',' + (195 + Math.random() * 40 | 0) + ',' + (188 + Math.random() * 40 | 0) + ',0.18)'; g.fillRect(Math.random() * w, Math.random() * w, 3, 3); }
      for (var v = 0; v < 9; v++) { g.strokeStyle = 'rgba(120,118,124,' + (0.12 + Math.random() * 0.2) + ')'; g.lineWidth = 0.6 + Math.random() * 1.6; g.beginPath(); var x = Math.random() * w, y = 0; g.moveTo(x, y); while (y < w) { x += (Math.random() - 0.5) * 40; y += 12 + Math.random() * 30; g.lineTo(x, y); } g.stroke(); }
      g.strokeStyle = 'rgba(150,145,140,0.55)'; g.lineWidth = 2; g.strokeRect(0, 0, w / 2, w / 2); g.strokeRect(w / 2, 0, w / 2, w / 2); g.strokeRect(0, w / 2, w / 2, w / 2); g.strokeRect(w / 2, w / 2, w / 2, w / 2);
      g.fillStyle = 'rgba(201,169,110,0.8)'; g.fillRect(0, 0, w, 2);
    }, [1, 1]);
    var concrete = canvasTex(256, 256, function (g, w) { g.fillStyle = '#a9a8a3'; g.fillRect(0, 0, w, w); for (var k = 0; k < 3000; k++) { var v = 140 + Math.random() * 50 | 0; g.fillStyle = 'rgba(' + v + ',' + v + ',' + (v - 4) + ',0.25)'; g.fillRect(Math.random() * w, Math.random() * w, 2, 2); } g.strokeStyle = 'rgba(60,60,60,.35)'; g.lineWidth = 2; g.strokeRect(0, 0, w, w); }, [1, 1]);
    var asphalt = canvasTex(256, 256, function (g, w) { g.fillStyle = '#3a3c40'; g.fillRect(0, 0, w, w); for (var k = 0; k < 4000; k++) { var v = 40 + Math.random() * 40 | 0; g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',0.5)'; g.fillRect(Math.random() * w, Math.random() * w, 2, 2); } }, [1, 1]);
    M = {
      tile: tile, concreteTex: concrete, asphaltTex: asphalt,
      floor: std({ map: tile, roughness: 0.18, metalness: 0.08 }),
      concrete: std({ map: concrete, roughness: 0.9 }),
      asphalt: std({ map: asphalt, roughness: 0.95 }),
      white: std({ color: 0xf1f2f4, roughness: 0.45, metalness: 0.1 }),
      panel: std({ color: 0xdfe4ea, roughness: 0.35, metalness: 0.35 }),
      steel: std({ color: 0x8d969f, roughness: 0.3, metalness: 0.85 }),
      dark: std({ color: 0x23272d, roughness: 0.6, metalness: 0.2 }),
      glass: new T.MeshStandardMaterial({ color: 0x9fc3dd, roughness: 0.06, metalness: 0.9, transparent: true, opacity: 0.32, depthWrite: false, side: T.DoubleSide }),
      glassDark: std({ color: 0x223646, roughness: 0.1, metalness: 0.8 }),
      wood: std({ color: 0x9a6b44, roughness: 0.6 }),
      red: std({ color: 0xb8323a, roughness: 0.5 }),
      gold: std({ color: 0xc9a96e, roughness: 0.35, metalness: 0.8 }),
      yellow: std({ color: 0xf2c230, roughness: 0.6 }),
      paint: new T.MeshBasicMaterial({ color: 0xf2f2ec }),
      paintY: new T.MeshBasicMaterial({ color: 0xf0c020 }),
      seat: std({ color: 0x2f4d6b, roughness: 0.55 }),
      rubber: std({ color: 0x1c1c1e, roughness: 0.9 }),
      grass: std({ color: 0x5f8f4e, roughness: 1 }),
      light: new T.MeshBasicMaterial({ color: 0xfff3d6 }),
      lightB: new T.MeshBasicMaterial({ color: 0x5aa8ff }),
      lightG: new T.MeshBasicMaterial({ color: 0x4dff88 }),
      lightR: new T.MeshBasicMaterial({ color: 0xff4d4d }),
      screen: new T.MeshBasicMaterial({ color: 0x0b1a2e })
    };
    return M;
  }
  var MARB = {};
  function marble(w, d) { var k = Math.round(w) + 'x' + Math.round(d); if (MARB[k]) return MARB[k]; var M0 = mats(), t = M0.tile.clone(); t.needsUpdate = true; t.repeat.set(w / 2.4, d / 2.4); t.wrapS = t.wrapT = T.RepeatWrapping; var m2 = M0.floor.clone(); m2.map = t; return (MARB[k] = m2); }
  function box(w, h, d, m, x, y, z, parent, ry) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (ry) o.rotation.y = ry; if (parent) parent.add(o); return o; }
  function cyl(r1, r2, h, seg, m, x, y, z, parent) { var o = new T.Mesh(new T.CylinderGeometry(r1, r2, h, seg || 16), m); o.position.set(x, y, z); if (parent) parent.add(o); return o; }
  function sign(text, sub, w, h, bg, fg) {
    var tex = canvasTex(1024, Math.round(1024 * h / w), function (g, cw, ch) {
      g.fillStyle = bg || '#10233d'; g.fillRect(0, 0, cw, ch);
      g.fillStyle = fg || '#f4efe6'; g.textAlign = 'center'; g.textBaseline = 'middle';
      var fs = Math.min(ch * (sub ? 0.46 : 0.62), 1024 / Math.max(6, text.length) * 1.6); g.font = 'bold ' + fs + 'px Arial, Helvetica, sans-serif';
      g.fillText(text, cw / 2, sub ? ch * 0.38 : ch / 2);
      if (sub) { g.globalAlpha = 0.8; g.font = (fs * 0.42) + 'px Arial, Helvetica, sans-serif'; g.fillText(sub, cw / 2, ch * 0.78); g.globalAlpha = 1; }
    });
    var m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, toneMapped: false })); m.userData.own = true; return m;
  }

  /* static merge: meshes that share a material become one draw call (doors, beacons, propellers, cabins, aircraft and
   * vehicles are kept apart: userData.dyn / userData.noMerge). Done before the group joins the scene. */
  function mergeStatic(root) {
    root.updateMatrixWorld(true);
    var inv = new T.Matrix4().copy(root.matrixWorld).invert(), buckets = new Map(), mats4 = new T.Matrix4(), nm = new T.Matrix3();
    (function walk(o) {
      for (var i = 0; i < o.children.length; i++) {
        var c = o.children[i];
        if (c.userData.noMerge || c.userData.dyn || c.isInstancedMesh || c.isSkinnedMesh || c.isSprite || c.isLight) continue;
        if (c.isMesh && c.geometry && c.geometry.isBufferGeometry && !Array.isArray(c.material) && c.geometry.attributes.position && c.geometry.attributes.normal && c.visible) {
          var g = c.geometry, key = c.material.uuid + '|' + (g.attributes.uv ? 'u' : '') + (g.index ? 'i' : 'n');
          var b = buckets.get(key); if (!b) buckets.set(key, b = []); b.push(c);
        }
        if (c.children.length) walk(c);
      }
    })(root);
    var merged = 0;
    buckets.forEach(function (list) {
      if (list.length < 2) return;
      var nv = 0, ni = 0, hasUV = !!list[0].geometry.attributes.uv;
      list.forEach(function (c) { var g = c.geometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; });
      var pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), uv = hasUV ? new Float32Array(nv * 2) : null, idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      var vo = 0, io = 0, v = new T.Vector3(), cast = false, recv = false;
      list.forEach(function (c) {
        var g = c.geometry, P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv;
        mats4.multiplyMatrices(inv, c.matrixWorld); nm.getNormalMatrix(mats4);
        for (var k = 0; k < P.count; k++) {
          v.fromBufferAttribute(P, k).applyMatrix4(mats4); pos[(vo + k) * 3] = v.x; pos[(vo + k) * 3 + 1] = v.y; pos[(vo + k) * 3 + 2] = v.z;
          v.fromBufferAttribute(N, k).applyMatrix3(nm).normalize(); nor[(vo + k) * 3] = v.x; nor[(vo + k) * 3 + 1] = v.y; nor[(vo + k) * 3 + 2] = v.z;
          if (uv) { uv[(vo + k) * 2] = U ? U.getX(k) : 0; uv[(vo + k) * 2 + 1] = U ? U.getY(k) : 0; }
        }
        var flip = mats4.determinant() < 0, cnt = g.index ? g.index.count : P.count;   // mirrored parts: keep the winding (front faces) right
        for (var j = 0; j < cnt; j += 3) { var i0 = g.index ? g.index.getX(j) : j, i1 = g.index ? g.index.getX(j + 1) : j + 1, i2 = g.index ? g.index.getX(j + 2) : j + 2; idx[io + j] = i0 + vo; idx[io + j + 1] = (flip ? i2 : i1) + vo; idx[io + j + 2] = (flip ? i1 : i2) + vo; }
        io += g.index ? g.index.count : P.count; vo += P.count; cast = cast || c.castShadow; recv = recv || c.receiveShadow;
        c.parent.remove(c);
      });
      var mg = new T.BufferGeometry(); mg.setAttribute('position', new T.BufferAttribute(pos, 3)); mg.setAttribute('normal', new T.BufferAttribute(nor, 3)); if (uv) mg.setAttribute('uv', new T.BufferAttribute(uv, 2)); mg.setIndex(new T.BufferAttribute(idx, 1)); mg.computeBoundingSphere();
      var me = new T.Mesh(mg, list[0].material); me.castShadow = cast; me.receiveShadow = recv; me.name = 'a35-merged'; root.add(me); merged += list.length;
    });
    S.merged = (S.merged || 0) + merged;
    return merged;
  }
  API.mergeStatic = mergeStatic;

  /* ======================================================================================================
   * aircraft generator: lathe fuselage with painted windows/doors, swept tapered wings, engines, tail, gear, lights
   * ====================================================================================================== */
  var TYPES = {
    turboprop: { name: 'FY-ATR regional turboprop', len: 27, r: 1.35, span: 27, wingX: 0.47, high: true, eng: 'prop', engines: 2, tTail: true, seats: 70 },
    narrow: { name: 'FY-320 narrow-body jet', len: 37.6, r: 1.98, span: 35.8, wingX: 0.42, eng: 'fan', engR: 1.05, engines: 2, seats: 180 },
    wide: { name: 'FY-787 wide-body jet', len: 57, r: 2.9, span: 60, wingX: 0.43, eng: 'fan', engR: 1.6, engines: 2, seats: 290 },
    cargo: { name: 'FY-777F freighter', len: 63, r: 3.1, span: 64, wingX: 0.43, eng: 'fan', engR: 1.75, engines: 2, cargo: true },
    bizjet: { name: 'FY-650 private jet', len: 22, r: 1.15, span: 19, wingX: 0.52, eng: 'rear', engR: 0.55, engines: 2, tTail: true, seats: 12 }
  };
  var GEO = {}, LIV = {};
  function livery(type, cargo) {
    var key = type + (cargo ? 'c' : ''); if (LIV[key]) return LIV[key];
    var tx = canvasTex(2048, 768, function (g, w, h) {
      // u (canvas x) runs along the body from the nose; around the body the right side is the upper half of the canvas
      // (theta degrees from the top -> y = h(0.5 - th/360)) and the left side the lower half (y = h(0.5 + th/360)).
      // The right side is seen rotated 180 deg, so its lettering is drawn rotated.
      var yR = function (th) { return h * (0.5 - th / 360); }, yL = function (th) { return h * (0.5 + th / 360); };
      var grd = g.createLinearGradient(0, 0, 0, h); grd.addColorStop(0, '#1b2f52'); grd.addColorStop(0.19, '#1b2f52'); grd.addColorStop(0.195, '#c9a96e'); grd.addColorStop(0.207, '#c9a96e'); grd.addColorStop(0.21, '#f4f5f7'); grd.addColorStop(0.79, '#f4f5f7'); grd.addColorStop(0.793, '#c9a96e'); grd.addColorStop(0.805, '#c9a96e'); grd.addColorStop(0.81, '#1b2f52'); grd.addColorStop(1, '#1b2f52');
      g.fillStyle = grd; g.fillRect(0, 0, w, h);
      var rect = function (u0, u1, th0, th1, side) { var a = side > 0 ? yR(th1) : yL(th0), b = side > 0 ? yR(th0) : yL(th1); g.fillRect(w * u0, a, w * (u1 - u0), b - a); };
      var srect = function (u0, u1, th0, th1, side) { var a = side > 0 ? yR(th1) : yL(th0), b = side > 0 ? yR(th0) : yL(th1); g.strokeRect(w * u0, a, w * (u1 - u0), b - a); };
      [1, -1].forEach(function (side) {
        g.fillStyle = '#0d1520'; rect(0.03, 0.062, 60, 74, side);   // cockpit glazing
        if (!cargo) { g.fillStyle = '#16202c'; for (var u = 0.13; u < 0.8; u += 0.0105) rect(u, u + 0.0055, 70, 79, side); }
        g.strokeStyle = '#8f99a4'; g.lineWidth = 3; [0.095, 0.83].forEach(function (u) { srect(u, u + 0.014, 64, 100, side); });
        if (cargo && side < 0) srect(0.6, 0.665, 66, 108, side);
        // lettering, centred on theta 57
        var label = cargo ? 'FYRUS AIR CARGO' : 'FYRUS AIRLINES', cy = side > 0 ? yR(57) : yL(57), fs = h * 0.05;
        g.save(); g.translate(w * 0.36, cy); if (side > 0) g.rotate(Math.PI);
        g.fillStyle = '#1b2f52'; g.font = 'bold ' + fs + 'px Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 0, 0); g.restore();
      });
    });
    LIV[key] = new T.MeshStandardMaterial({ map: tx, roughness: 0.32, metalness: 0.25 });
    return LIV[key];
  }
  function wingGeo(span, rootC, tipC, sweep, thick, dihedral) {
    // a tapered, swept wing panel from the root (x=0) to the tip (x=span); airfoil approximated by a lens section
    var segs = 8, prof = [], N = 10;
    for (var i = 0; i <= N; i++) { var t = i / N, x = t, yy = 0.5 * Math.sin(Math.PI * Math.pow(t, 0.8)) * (1 - 0.15 * t); prof.push([x, yy]); }
    var pos = [], idx = [];
    for (var s = 0; s <= segs; s++) {
      var u = s / segs, c = rootC + (tipC - rootC) * u, z0 = u * span, xo = sweep * u, yo = dihedral * u, th = thick * (1 - 0.55 * u);
      for (var k = 0; k <= N; k++) pos.push(xo + prof[k][0] * c, yo + prof[k][1] * th * c / rootC, z0);
      for (var k2 = N; k2 >= 0; k2--) pos.push(xo + prof[k2][0] * c, yo - prof[k2][1] * th * 0.45 * c / rootC, z0);
    }
    var ring = (N + 1) * 2;
    for (var s2 = 0; s2 < segs; s2++) for (var j = 0; j < ring - 1; j++) { var a = s2 * ring + j, b = a + ring; idx.push(a, b, a + 1, a + 1, b, b + 1); }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  function buildGeo(type) {
    if (GEO[type]) return GEO[type];
    var P = TYPES[type], L = P.len, R = P.r, pts = [];
    // fuselage profile (y = length axis from tail 0 to nose L), radius rises from the tail cone, constant, rounded nose
    var n = 46; for (var i = 0; i <= n; i++) {
      var t = i / n, y = t * L, rr;
      if (t < 0.22) rr = R * (0.12 + 0.88 * Math.pow(Math.sin(t / 0.22 * Math.PI / 2), 0.9));
      else if (t > 0.9) rr = R * Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.9) / 0.1, 2.2)));
      else rr = R;
      pts.push(new T.Vector2(Math.max(0.001, rr), y));
    }
    var fus = new T.LatheGeometry(pts, 28);
    // UVs: u along the body (nose = 0), v around (top = 0.5)
    var uv = fus.attributes.uv, ps = fus.attributes.position;
    for (var k = 0; k < uv.count; k++) { var yy = ps.getY(k), ang = Math.atan2(ps.getX(k), ps.getZ(k)); uv.setXY(k, 1 - yy / L, ((ang / (2 * Math.PI)) + 1.5) % 1); }
    fus.rotateX(-Math.PI / 2); fus.translate(0, 0, L / 2);   // nose at z = -L/2, tail at z = +L/2 (aircraft faces -z)
    var g = { fus: fus };
    var semi = P.span / 2 - R * 0.6, rootC = L * (P.cargo || type === 'wide' ? 0.17 : 0.18), tipC = rootC * (P.eng === 'prop' ? 0.65 : 0.26);
    // panels are built chord = x, span = z; baked so span points to -x (left side) and chord runs backwards (+z)
    g.wing = wingGeo(semi, rootC, tipC, P.eng === 'prop' ? rootC * 0.08 : semi * 0.52, 0.11, P.high ? -semi * 0.02 : semi * 0.085); g.wing.rotateY(-Math.PI / 2);
    g.hstab = wingGeo(P.span * 0.17, L * 0.085, L * 0.035, P.span * 0.1, 0.1, 0.4); g.hstab.rotateY(-Math.PI / 2);
    g.fin = wingGeo(R * (P.tTail ? 2.9 : 3.3), L * 0.14, L * 0.055, R * 2.2, 0.1, 0); g.fin.rotateY(-Math.PI / 2); g.fin.rotateZ(-Math.PI / 2);
    g.nacelle = new T.CylinderGeometry((P.engR || 0.6), (P.engR || 0.6) * 0.82, (P.engR || 0.6) * (P.eng === 'rear' ? 4 : 3.2), 20, 1, true); g.nacelle.rotateX(Math.PI / 2);
    g.fan = new T.CircleGeometry((P.engR || 0.6) * 0.92, 20);
    g.prop = new T.BoxGeometry(0.22, 3.9, 0.05);
    g.wheel = new T.CylinderGeometry(R * 0.28, R * 0.28, R * 0.18, 14); g.wheel.rotateZ(Math.PI / 2);
    g.strut = new T.CylinderGeometry(R * 0.05, R * 0.05, R * 1.1, 8);
    GEO[type] = g; return g;
  }
  var ACM = null;
  function acMats() {
    if (ACM) return ACM;
    var m = mats();
    ACM = { wing: new T.MeshStandardMaterial({ color: 0xd8dde3, roughness: 0.35, metalness: 0.45, side: T.DoubleSide }), tail: new T.MeshStandardMaterial({ color: 0x1b2f52, roughness: 0.35, metalness: 0.3, side: T.DoubleSide }),
      nacelle: new T.MeshStandardMaterial({ color: 0xe8eaee, roughness: 0.3, metalness: 0.5, side: T.DoubleSide }), fan: new T.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.4, metalness: 0.8 }),
      gear: m.steel, tyre: m.rubber, navR: m.lightR, navG: m.lightG, strobe: new T.MeshBasicMaterial({ color: 0xffffff }), beacon: new T.MeshBasicMaterial({ color: 0xff2020 }) };
    return ACM;
  }
  function aircraft(type, opt) {
    opt = opt || {}; var P = TYPES[type], g = buildGeo(type), m = acMats(), L = P.len, R = P.r;
    var root = new T.Group(); root.name = 'a35-' + type; root.userData.type = type;
    var body = new T.Mesh(g.fus, livery(type, P.cargo)); body.castShadow = true; root.add(body);
    // body runs along z: nose at z = -L/2, tail at z = +L/2 (aircraft faces -z)
    var wz = -L / 2 + L * P.wingX, wy = P.high ? R * 0.85 : -R * 0.45;
    [1, -1].forEach(function (s) {
      var w = new T.Mesh(g.wing, m.wing); w.castShadow = true;
      // wing geometry: x = chord, z = span; place so span goes outwards along ±x, chord along +z (backwards)
      w.scale.x = -s; w.position.set(s * R * 0.6, wy, wz); root.add(w);
      var hs = new T.Mesh(g.hstab, m.wing); hs.scale.x = -s;
      hs.position.set(s * R * 0.25, P.tTail ? R * 3.4 : R * 0.25, L / 2 - L * 0.13); root.add(hs);
      // engines
      if (P.eng === 'fan' || P.eng === 'prop') {
        var ex = s * P.span * (P.eng === 'prop' ? 0.17 : 0.2), ez = wz - (P.engR || 0.6) * (P.eng === 'prop' ? 1.2 : 1.6), ey = P.high ? R * 0.55 : -R * 0.95;
        var nac = new T.Mesh(g.nacelle, m.nacelle); nac.position.set(ex, ey, ez); nac.castShadow = true; root.add(nac);
        var fan = new T.Mesh(g.fan, m.fan); fan.position.set(ex, ey, ez - (P.engR || 0.6) * 1.55); fan.rotation.y = Math.PI; root.add(fan);
        if (P.eng === 'prop') { var pr = new T.Mesh(g.prop, m.fan); pr.position.set(ex, ey, ez - (P.engR || 0.6) * 1.75); pr.userData.spin = 1; root.add(pr); var pr2 = pr.clone(); pr2.rotation.z = Math.PI / 2; pr2.userData.spin = 1; root.add(pr2); }
        var py = box(0.25, Math.abs(ey - wy) + 0.4, (P.engR || 0.6) * 2, m.wing, ex, (ey + wy) / 2, ez + 0.6, root);
      } else if (P.eng === 'rear') {
        var rn = new T.Mesh(g.nacelle, m.nacelle); rn.position.set(s * (R + (P.engR || 0.5) * 1.1), R * 0.45, L / 2 - L * 0.27); root.add(rn);
      }
      // nav lights
      var nl = new T.Mesh(new T.SphereGeometry(0.18, 8, 6), s > 0 ? m.navG : m.navR); nl.position.set(s * P.span / 2, wy + (P.high ? 0 : P.span * 0.04), wz + L * 0.1); root.add(nl);
    });
    var fin = new T.Mesh(g.fin, m.tail); fin.position.set(0, R * 0.7, L / 2 - L * 0.18); fin.castShadow = true; root.add(fin);
    // landing gear (nose + 2 mains)
    var gy = -R - R * 0.75;
    [[0, -L / 2 + L * 0.1], [R * 0.8, wz + L * 0.04], [-R * 0.8, wz + L * 0.04]].forEach(function (p, i) {
      var s2 = new T.Mesh(g.strut, m.gear); s2.position.set(p[0], -R - R * 0.35, p[1]); root.add(s2);
      var nW = i === 0 ? 1 : (type === 'wide' || type === 'cargo' ? 3 : 2);
      for (var k = 0; k < nW; k++) { var wh = new T.Mesh(g.wheel, m.tyre); wh.position.set(p[0] + (i === 0 ? 0 : (k % 2 ? 0.35 : -0.35) * R), gy, p[1] + (k > 1 ? R * 0.7 : 0)); root.add(wh); }
    });
    var bc = new T.Mesh(new T.SphereGeometry(0.22, 8, 6), m.beacon); bc.position.set(0, R + 0.15, -L * 0.05); bc.userData.beacon = 1; root.add(bc);
    root.userData.gearH = -gy + R * 0.28;   // root height above ground so wheels touch
    root.userData.len = L; root.userData.span = P.span; root.userData.doorZ = -L / 2 + L * 0.1; root.userData.doorH = R * 0.35;
    if (opt.cabin) addCabin(root, type);
    root.children.forEach(function (c) { if (c.userData.spin || c.userData.beacon) c.userData.dyn = 1; if (c.name === 'cabin') c.userData.noMerge = 1; });
    mergeStatic(root); root.userData.noMerge = 1;
    S.aircraft++;
    return root;
  }
  // passenger cabin seen from inside: inner wall (back faces), floor, seat rows, overhead bins, window glow
  function addCabin(root, type) {
    var P = TYPES[type], L = P.len, R = P.r, cab = new T.Group(); cab.name = 'cabin'; cab.visible = false;
    var fy = -R * 0.45, z0 = -L * 0.33, z1 = L * 0.3, len = z1 - z0, zc = (z0 + z1) / 2;
    var nWin = Math.floor(len / 0.62);
    // inner wall: u runs around the cylinder (0 = floor side after the rotation), v along the cabin; two window rows
    var wallTex = canvasTex(256, 1024, function (g, w, h) {
      g.fillStyle = '#ece8e0'; g.fillRect(0, 0, w, h); g.fillStyle = '#d9d3c6'; g.fillRect(0, 0, w * 0.18, h); g.fillRect(w * 0.82, 0, w * 0.18, h);
      for (var k = 0; k < nWin; k++) { var y = (k + 0.5) / nWin * h; [0.285, 0.715].forEach(function (u) { g.fillStyle = '#c9c2b4'; g.fillRect(u * w - 9, y - 11, 18, 22); g.clearRect(u * w - 6, y - 8, 12, 16); }); }
    });
    var wall = new T.Mesh(new T.CylinderGeometry(R * 0.93, R * 0.93, len, 28, 1, true), new T.MeshStandardMaterial({ map: wallTex, side: T.BackSide, roughness: 0.75, emissive: 0x2a2826, alphaTest: 0.5 })   /* window cut-outs: the sky and the wing show through */);
    wall.rotation.x = Math.PI / 2; wall.position.set(0, 0, zc); cab.add(wall);
    var floorW = 2 * Math.sqrt(Math.max(0.1, 0.93 * 0.93 - 0.45 * 0.45)) * R;
    box(floorW, 0.05, len, new T.MeshStandardMaterial({ color: 0x3c4552, roughness: 0.9 }), 0, fy, zc, cab);
    box(0.5, 0.02, len, new T.MeshStandardMaterial({ color: 0x1b2f52, roughness: 1 }), 0, fy + 0.03, zc, cab);   // aisle carpet
    var layout = type === 'wide' ? [-2.05, -1.59, -0.69, -0.23, 0.23, 0.69, 1.59, 2.05] : type === 'turboprop' ? [-0.95, -0.49, 0.49, 0.95] : type === 'bizjet' ? [-0.55, 0.55] : [-1.43, -0.97, -0.51, 0.51, 0.97, 1.43];
    var pitch = type === 'bizjet' ? 1.6 : 0.82, rows = Math.floor((len - 1.5) / pitch), n = rows * layout.length;
    var cushion = new T.InstancedMesh(new T.BoxGeometry(0.44, 0.13, 0.46), new T.MeshStandardMaterial({ color: 0x24406a, roughness: 0.8 }), n);
    var back = new T.InstancedMesh(new T.BoxGeometry(0.44, 0.66, 0.1), new T.MeshStandardMaterial({ color: 0x1f3758, roughness: 0.8 }), n);
    var head = new T.InstancedMesh(new T.BoxGeometry(0.3, 0.16, 0.11), new T.MeshStandardMaterial({ color: 0xf1efe8, roughness: 0.9 }), n), mm = new T.Matrix4(), k = 0;
    for (var r = 0; r < rows; r++) layout.forEach(function (x) {
      var z = z0 + 1.2 + r * pitch;
      mm.makeTranslation(x, fy + 0.45, z); cushion.setMatrixAt(k, mm); mm.makeTranslation(x, fy + 0.8, z + 0.24); back.setMatrixAt(k, mm); mm.makeTranslation(x, fy + 1.06, z + 0.25); head.setMatrixAt(k, mm); k++;
    });
    cab.add(cushion); cab.add(back); cab.add(head);
    var binM = new T.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.6 });
    [1, -1].forEach(function (sd) { box(0.6, 0.42, len, binM, sd * R * 0.6, R * 0.5, zc, cab); });
    box(0.25, 0.04, len, new T.MeshBasicMaterial({ color: 0xfff1d6 }), 0, R * 0.86, zc, cab);   // ceiling light
    root.add(cab); root.userData.cabin = cab; root.userData.cabinFloor = fy; root.userData.cabinZ = [z0, z1];
  }
  API.aircraft = aircraft; API.TYPES = TYPES;

  /* ======================================================================================================
   * airport generator. Local frame: X towards the airside/runway, Z along the terminal; y = 0 ground.
   * Spec: { code, name, city, x, z, ry, base, size: 'intl'|'regional', arch: 'wave'|'arch', color }
   * ====================================================================================================== */
  var PH = 5.0;   // airside (departures) floor height = jet-bridge sill height
  function Airport(spec) {
    var A = this; A.spec = spec; A.code = spec.code; A.group = new T.Group(); A.group.name = 'a35-' + spec.code;
    A.walls = []; A.floors = []; A.interacts = []; A.updaters = []; A.people = []; A.aircraft = []; A.gates = []; A.disposables = [];
    var c = Math.cos(spec.ry || 0), s = Math.sin(spec.ry || 0), base = spec.base || 0;
    A.toWorld = function (x, y, z) { return new T.Vector3(spec.x + x * c + z * s, base + y, spec.z - x * s + z * c); };
    A.toLocal = function (X, Z) { var dx = X - spec.x, dz = Z - spec.z; return { x: dx * c - dz * s, z: dx * s + dz * c }; };
    A.group.position.set(spec.x, base, spec.z); A.group.rotation.y = spec.ry || 0;
    A.big = spec.size !== 'regional';
    // 35.2 layout: gates are listed with their aircraft type; spacing = half spans + clearance, wide-bodies park nose-in closer
    A.L = A.big ? { hallZ: 70, pierZ: 150, gates: [{ z: -120, t: 'narrow' }, { z: -66, t: 'wide' }, { z: -12, t: 'narrow' }, { z: 42, t: 'wide' }, { z: 96, t: 'narrow' }, { z: 134, t: 'turboprop' }],
                    remote: [[52.5, -176, 'wide'], [52.5, 285, 'cargo']], rwyX: 122, rwyZ0: -200, rwyZ1: 330, rwyW: 30, twyX: 100, L2: true }
                : { hallZ: 46, pierZ: 72, gates: [{ z: -64, t: 'turboprop' }, { z: -26, t: 'narrow' }, { z: 16, t: 'narrow' }, { z: 53, t: 'turboprop' }],
                    remote: [[52, -118, 'turboprop']], rwyX: 106, rwyZ0: -170, rwyZ1: 230, rwyW: 24, twyX: 86, L2: false };
    A.L.gatesZ = A.L.gates.map(function (g) { return g.z; });
  }
  // ---- collision + floor levels (local coordinates) ----
  Airport.prototype.wall = function (x0, x1, z0, z1, y0, y1, cond) { this.walls.push({ x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1), y0: y0 === undefined ? -1 : y0, y1: y1 === undefined ? 99 : y1, cond: cond }); };
  Airport.prototype.floor = function (x0, x1, z0, z1, h) { this.floors.push({ x0: x0, x1: x1, z0: z0, z1: z1, h: h }); };
  // several floors can overlap in plan (pier + Sky Gallery, bridges): the level is chosen from the walker's height
  Airport.prototype.levelAt = function (x, z, y) {
    var best = null, low = null;
    for (var i = 0; i < this.floors.length; i++) {
      var f = this.floors[i]; if (x < f.x0 || x > f.x1 || z < f.z0 || z > f.z1) continue;
      var h = typeof f.h === 'function' ? f.h(x, z) : f.h;
      if (low === null || h < low) low = h;
      if (y != null && h <= y + 1.4 && (best === null || h > best)) best = h;
    }
    return best !== null ? best : low;
  };
  Airport.prototype.ground = function (X, Z, y) {
    var p = this.toLocal(X, Z), h = this.levelAt(p.x, p.z, y == null ? null : y - (this.spec.base || 0));
    return h === null ? null : (this.spec.base || 0) + h;
  };
  Airport.prototype.collide = function (e) {
    var p = this.toLocal(e.x, e.z), y = (e.y || 0) - (this.spec.base || 0), moved = false, pad = 0.35;
    for (var i = 0; i < this.walls.length; i++) {
      var w = this.walls[i]; if (y < w.y0 - 0.5 || y > w.y1) continue;
      if (p.x < w.x0 - pad || p.x > w.x1 + pad || p.z < w.z0 - pad || p.z > w.z1 + pad) continue;
      if (w.cond && !w.cond(p)) continue;
      var dl = p.x - (w.x0 - pad), dr = (w.x1 + pad) - p.x, db = p.z - (w.z0 - pad), df = (w.z1 + pad) - p.z, m = Math.min(dl, dr, db, df);
      if (m === dl) p.x = w.x0 - pad; else if (m === dr) p.x = w.x1 + pad; else if (m === db) p.z = w.z0 - pad; else p.z = w.z1 + pad;
      moved = true;
    }
    if (moved) { var q = this.toWorld(p.x, 0, p.z); e.x = q.x; e.z = q.z; }
    return moved;
  };
  Airport.prototype.inside = function (X, Z, pad) { var p = this.toLocal(X, Z), L = this.L; pad = pad || 0; return p.x > -70 - pad && p.x < L.rwyX + 30 + pad && p.z > L.rwyZ0 - 20 - pad && p.z < L.rwyZ1 + 20 + pad; };
  Airport.prototype.interact = function (x, y, z, r, label, action, use) { var p = this.toWorld(x, y, z); this.interacts.push({ pos: p, radius: r, label: label, action: 'a35-' + action, use: use, a35: this.code }); };
  Airport.prototype.add = function (o) { this.group.add(o); return o; };

  Airport.prototype.build = function () {
    var A = this, m = mats(), g = A.group, L = A.L, sp = A.spec, hz = L.hallZ, pz = L.pierZ;
    // ---------------- groundworks: apron, taxiway, runway, landside road, parking ----------------
    if (!sp.platform) {   // one grass cover over the whole footprint: hides the city street grid underneath the airport
      // (the landside strip stops short of Starter Commons, a city landmark just north-west of the airport)
      var zA = L.rwyZ0 - 30, zB = L.rwyZ1 + 30, zC = 170;
      var cover = box(L.rwyX + 28 + 54, 0.04, zC - zA, m.grass, (L.rwyX + 28 - 54) / 2, 0.025, (zA + zC) / 2, g); cover.receiveShadow = true;
      var cover2 = box(L.rwyX + 28 + 30, 0.04, zB - zC, m.grass, (L.rwyX + 28 - 30) / 2, 0.025, (zC + zB) / 2, g); cover2.receiveShadow = true;
    }
    if (sp.platform) {   // reclaimed-land platform (the island coast is too narrow for a runway): slab + rock revetment
      var px0 = -78, px1 = L.rwyX + 34, pz0 = L.rwyZ0 - 34, pz1 = L.rwyZ1 + 34;
      var slab = box(px1 - px0, 14, pz1 - pz0, new T.MeshStandardMaterial({ color: 0x8f8a7e, roughness: 1 }), (px0 + px1) / 2, -7.02, (pz0 + pz1) / 2, g); slab.receiveShadow = true;
      var grassTop = box(px1 - px0 - 2, 0.04, pz1 - pz0 - 2, m.grass, (px0 + px1) / 2, 0.0, (pz0 + pz1) / 2, g); grassTop.receiveShadow = true;
      A.floor(px0, px1, pz0, pz1, 0.02);
    }
    var apron = box(L.twyX - 9 + 9, 0.06, L.rwyZ1 - L.rwyZ0 - 10, m.concrete, (L.twyX - 9 - 9) / 2, 0.03, (L.rwyZ0 + L.rwyZ1) / 2, g);
    m.concreteTex.repeat.set(10, 36); apron.receiveShadow = true;
    var twy = box(18, 0.07, L.rwyZ1 - L.rwyZ0 + 30, m.asphalt, L.twyX, 0.035, (L.rwyZ0 + L.rwyZ1) / 2, g); twy.receiveShadow = true;
    var rwyTex = canvasTex(256, 2048, function (g2, w, h) {
      g2.fillStyle = '#2f3135'; g2.fillRect(0, 0, w, h); for (var k = 0; k < 9000; k++) { var v = 35 + Math.random() * 30 | 0; g2.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',.6)'; g2.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g2.fillStyle = '#eceae2'; g2.fillRect(8, 0, 5, h); g2.fillRect(w - 13, 0, 5, h);                  // edge lines
      for (var y = 260; y < h - 260; y += 70) g2.fillRect(w / 2 - 3, y, 6, 36);                         // centre line
      for (var p2 = 0; p2 < 8; p2++) { g2.fillRect(22 + p2 * 27, 20, 14, 120); g2.fillRect(22 + p2 * 27, h - 140, 14, 120); }   // thresholds
      g2.font = 'bold 64px Arial'; g2.textAlign = 'center'; g2.save(); g2.translate(w / 2, 200); g2.rotate(Math.PI); g2.fillText('36', 0, 0); g2.restore(); g2.save(); g2.translate(w / 2, h - 180); g2.fillText('18', 0, 0); g2.restore();
      [420, 560, h - 560, h - 420].forEach(function (y) { g2.fillRect(50, y, 22, 60); g2.fillRect(w - 72, y, 22, 60); });   // touchdown zone
    });
    var rwy = new T.Mesh(new T.PlaneGeometry(L.rwyW, L.rwyZ1 - L.rwyZ0), new T.MeshStandardMaterial({ map: rwyTex, roughness: 0.9 }));
    rwy.rotation.x = -Math.PI / 2; rwy.position.set(L.rwyX, 0.08, (L.rwyZ0 + L.rwyZ1) / 2); rwy.receiveShadow = true; g.add(rwy);
    // taxiway centre lines + stand lead-in lines (yellow)
    box(0.35, 0.02, L.rwyZ1 - L.rwyZ0 + 20, m.paintY, L.twyX, 0.075, (L.rwyZ0 + L.rwyZ1) / 2, g);
    L.gatesZ.forEach(function (gz) { box(L.twyX - 34, 0.02, 0.35, m.paintY, (34 + L.twyX) / 2, 0.075, gz, g); });
    [L.rwyZ0 + 20, L.rwyZ1 - 20, (L.rwyZ0 + L.rwyZ1) / 2].forEach(function (zz) { box(L.rwyX - L.twyX, 0.02, 0.35, m.paintY, (L.rwyX + L.twyX) / 2, 0.075, zz, g); box(L.rwyX - L.twyX, 0.06, 16, m.asphalt, (L.rwyX + L.twyX) / 2, 0.03, zz, g); });
    // runway / taxiway lights (instanced)
    var lg = new T.SphereGeometry(0.18, 6, 4), pts = [], ptsB = [], ptsG = [];
    for (var z = L.rwyZ0; z <= L.rwyZ1; z += 12) { pts.push([L.rwyX - L.rwyW / 2 - 0.6, z], [L.rwyX + L.rwyW / 2 + 0.6, z]); ptsB.push([L.twyX - 9.3, z], [L.twyX + 9.3, z]); }
    for (var x2 = L.rwyX - L.rwyW / 2; x2 <= L.rwyX + L.rwyW / 2; x2 += 2) { ptsG.push([x2, L.rwyZ0 - 0.5], [x2, L.rwyZ1 + 0.5]); }
    for (var a = 1; a <= 8; a++) for (var b = -2; b <= 2; b++) ptsG.push([L.rwyX + b * 3, L.rwyZ0 - a * 12]);   // approach lights
    [[pts, m.light], [ptsB, m.lightB], [ptsG, m.lightG]].forEach(function (pp) {
      var im = new T.InstancedMesh(lg, pp[1], pp[0].length), mm = new T.Matrix4(); pp[0].forEach(function (q, i) { mm.makeTranslation(q[0], 0.2, q[1]); im.setMatrixAt(i, mm); }); g.add(im);
    });
    // landside road, curb, parking, taxi rank, bus stop
    box(14, 0.07, 2 * hz + 60, m.asphalt, -21, 0.035, 0, g);
    for (var lz = -hz - 26; lz < hz + 26; lz += 8) box(0.25, 0.02, 3.6, m.paint, -21, 0.075, lz, g);
    box(4, 0.25, 2 * hz + 40, m.concrete, -12, 0.125, 0, g);   // curb / sidewalk
    A.floor(-14, -10, -hz - 20, hz + 20, 0.25);
    var pkX = -46, pkZ0 = hz + 14, pk = box(32, 0.06, 56, m.asphalt, pkX, 0.03, pkZ0 + 28, g);
    var carG = new T.BoxGeometry(1.9, 1.35, 4.4), carCol = [0xb8323a, 0x2f4f6f, 0xe9e7e2, 0x222831, 0x8c8c8c, 0x3d5a3d, 0xc7a46a], cars = new T.InstancedMesh(carG, new T.MeshStandardMaterial({ roughness: 0.35, metalness: 0.6 }), 36), cm4 = new T.Matrix4(), ci = 0;
    for (var r = 0; r < 4; r++) for (var k2 = 0; k2 < 9; k2++) { box(0.15, 0.02, 4.6, m.paint, pkX - 13 + k2 * 3.2 - 1.6, 0.075, pkZ0 + 8 + r * 12, g); if ((r * 9 + k2) % 4 !== 1) { cm4.makeTranslation(pkX - 13 + k2 * 3.2, 0.75, pkZ0 + 8 + r * 12); cars.setMatrixAt(ci, cm4); cars.setColorAt(ci, new T.Color(carCol[(r * 9 + k2) % carCol.length])); ci++; } }
    cars.count = ci; cars.castShadow = true; g.add(cars);
    var parkSign = sign('P  ' + sp.code + ' PARKING', 'Short stay · 2 FYC / hour', 8, 2.4, '#1b4f9c'); parkSign.position.set(pkX, 3.4, pkZ0 - 2); parkSign.rotation.y = -Math.PI / 2; g.add(parkSign); cyl(0.12, 0.12, 3, 8, m.steel, pkX, 1.5, pkZ0 - 2, g);
    // taxi rank + bus shelter on the curb
    var taxiS = sign('TAXI', 'Fyrus Taxi · city centre', 3.2, 1.4, '#f2c230', '#111'); taxiS.position.set(-12.5, 3, hz - 6); taxiS.rotation.y = -Math.PI / 2; g.add(taxiS); cyl(0.08, 0.08, 2.4, 8, m.steel, -12.5, 1.2, hz - 6, g);
    for (var tx = 0; tx < 3; tx++) { var taxi = box(1.9, 1.4, 4.5, new T.MeshStandardMaterial({ color: 0xf2c230, roughness: 0.4, metalness: 0.4 }), -16, 0.8, hz - 12 - tx * 6, g); box(1.7, 0.5, 2.2, m.glassDark, -16, 1.65, hz - 12.4 - tx * 6, g); }
    var busS = box(2.4, 0.15, 7, m.glass, -11.5, 2.6, -hz + 4, g); box(0.1, 2.6, 7, m.glass, -10.4, 1.3, -hz + 4, g); var busSign = sign('BUS', 'Airport Express · Grand Central', 3.2, 1.4, '#2e7d4f'); busSign.position.set(-12.6, 3.3, -hz + 4); busSign.rotation.y = -Math.PI / 2; g.add(busSign);
    A.interact(-12.5, 0, hz - 8, 3.5, 'Taxi rank · ride into ' + sp.city, 'taxi', function () { var Wd = window.__fyrusW; try { if (sp.code === 'FCI' && Wd.startTaxi) Wd.startTaxi({ x: 0, z: 36, name: 'Fyrus Core Plaza' }); else toast('Taxis here drive into ' + sp.city + ' — walk out of the terminal and use the street.'); } catch (e) { toast('Taxi unavailable right now.'); } });
    A.interact(-12, 0, -hz + 4, 3.5, sp.code === 'VBX' ? 'Airport Express bus · Vector Bay promenade' : 'Airport Express bus · Grand Central', 'bus', function () { var C = window.__fyrusCountry; if (C && C.stations && C.teleportTo && sp.code === 'FCI') { var gc = C.stations.find(function (x) { return /central/i.test(x.name); }) || C.stations[0]; C.teleportTo(gc, 'bus'); } else if (sp.code === 'VBX' && window.__fyrusVB && window.__fyrusVB.landing) { var Ld = window.__fyrusVB.landing, Cc = window.__fyrusCountry, Wv = window.__fyrusW, done = function () { try { Wv.teleport({ x: Ld.x, z: Ld.z, face: Ld.face }); } catch (e) {} }; if (!(Cc && Cc.flyThrough && Cc.flyThrough({ name: 'Vector Bay promenade', x: Ld.x, z: Ld.z }, 'bus', done))) done(); } else toast('The Airport Express serves ' + sp.city + ' centre.'); });
    A.buildTerminal();
    A.buildAirside();
    A.buildPerimeter();
    A.decor();
    A.luxury();
  };

  // ---------------- terminal: landside hall (ground), security, escalators, airside pier (PH), arrivals ----------------
  Airport.prototype.buildTerminal = function () {
    var A = this, m = mats(), g = A.group, L = A.L, sp = A.spec, hz = L.hallZ, pz = L.pierZ, big = A.big;
    var T0 = new T.Group(); T0.name = 'terminal'; g.add(T0); A.terminal = T0;
    var accent = new T.MeshStandardMaterial({ color: sp.color || 0x1b2f52, roughness: 0.4, metalness: 0.3 });
    // floors
    var hallFloor = box(26, 0.1, 2 * hz, marble(26, 2 * hz), 3, 0.05, 0, T0); hallFloor.receiveShadow = true;
    A.floor(-10, 16, -hz, hz, 0.02);
    var pierFloor = box(14, 0.4, 2 * pz, marble(14, 2 * pz), 23, PH - 0.2, 0, T0); pierFloor.receiveShadow = true;
    box(2, 0.4, 23, m.floor, 15, PH - 0.2, 0, T0);   // escalator landing
    A.floor(16, 30, -pz, pz, PH); A.floor(14, 16, -11.5, 11.5, PH);
    // escalator ramps (X 2 -> 14 rising 0 -> PH) on both sides of a central void
    var stepTex = canvasTex(64, 256, function (g2, w, h) { g2.fillStyle = '#4a4f57'; g2.fillRect(0, 0, w, h); g2.fillStyle = '#2a2d33'; for (var y = 0; y < h; y += 16) g2.fillRect(0, y, w, 6); g2.fillStyle = '#f2c230'; g2.fillRect(0, 0, 3, h); g2.fillRect(w - 3, 0, 3, h); }, [1, 6]);
    A.stepTex = stepTex;
    [-1, 1].forEach(function (s) {
      var len = Math.hypot(12, PH), ramp = new T.Mesh(new T.PlaneGeometry(6.4, len), new T.MeshStandardMaterial({ map: stepTex, roughness: 0.6, metalness: 0.4 }));
      ramp.rotation.order = 'YXZ'; ramp.rotation.y = Math.PI / 2; ramp.rotation.x = -Math.PI / 2 + Math.atan2(PH, 12); ramp.position.set(8, PH / 2 + 0.05, s * 7.5); T0.add(ramp);
      // side balustrades (glass + steel handrail)
      [4.1, 10.9].forEach(function (zz) { var bal = new T.Mesh(new T.PlaneGeometry(len, 1.1), m.glass); bal.rotation.order = 'YXZ'; bal.rotation.y = 0; bal.rotation.z = Math.atan2(PH, 12); bal.position.set(8, PH / 2 + 0.6, s * zz); T0.add(bal); });
      A.floor(2, 14, s > 0 ? 4 : -11, s > 0 ? 11 : -4, function (x) { return Math.max(0.02, Math.min(PH, (x - 2) / 12 * PH)); });
      var esc = sign(s > 0 ? 'GATES  A' : 'GATES  A  ·  LOUNGES', 'Departures level', 5, 1, '#10233d'); esc.position.set(1.4, 3.6, s * 7.5); esc.rotation.y = -Math.PI / 2; T0.add(esc);
    });
    box(12, PH, 8, new T.MeshStandardMaterial({ color: 0x5f8f4e, roughness: 1 }), 8, PH / 2 - 0.2, 0, T0);   // planted void between the escalators
    A.wall(2, 14, -4, 4, -1, PH + 1.2);
    A.wall(1, 16, 11.4, 11.6, -1, PH + 1.2); A.wall(1, 16, -11.6, -11.4, -1, PH + 1.2);
    // ---------------- security (ground floor, X = 1) ----------------
    var canPass = function () { var t = API.cur(); return !!(t && (t.status === 'checked' || t.status === 'cleared') && t.from === sp.code); };
    A.wall(0.6, 1.4, -hz, -11.4); A.wall(0.6, 1.4, 11.4, hz - 9); A.wall(0.6, 1.4, hz - 5, hz); A.wall(0.6, 1.4, -3.9, 3.9);
    var lane = function (q) { return q.x < 1.0 && !canPass(); };   // blocks entry from the landside only; leaving the airside is always possible
    A.wall(0.6, 1.4, -11.4, -4, -1, 3, lane); A.wall(0.6, 1.4, 4, 11.4, -1, 3, lane);
    var secM = new T.MeshStandardMaterial({ color: 0xc9ced6, roughness: 0.4, metalness: 0.5 });
    [-7.7, 7.7].forEach(function (zc) {
      [-2, 2].forEach(function (o) {   // two walk-through scanners per side + x-ray belts
        var z = zc + o, arch = new T.Group(); box(0.25, 2.3, 0.25, secM, 0, 1.15, -0.55, arch); box(0.25, 2.3, 0.25, secM, 0, 1.15, 0.55, arch); box(0.3, 0.25, 1.35, secM, 0, 2.35, 0, arch);
        arch.position.set(1, 0, z); T0.add(arch);
        box(3.2, 0.9, 0.9, m.dark, -1.2, 0.45, z - 1.2, T0); box(1.2, 1.1, 1.1, secM, -1.2, 1.2, z - 1.2, T0);
      });
      box(0.2, 1.1, 7.4, m.glass, 1, 0.55, zc, T0);   // gate glass (opens with a boarding pass: collision only)
    });
    var secSign = sign('SECURITY  ·  BOARDING PASS REQUIRED', 'All departures · liquids max 100 ml', 9, 1.2, '#7a1f2a'); secSign.position.set(0.4, 4.4, 0); secSign.rotation.y = -Math.PI / 2; T0.add(secSign);
    // ---------------- façade, end walls, doors ----------------
    var doorsZ = big ? [-24, 0, 24] : [-12, 12];
    var segs = [-hz].concat([].concat.apply([], doorsZ.map(function (d) { return [d - 2, d + 2]; }))).concat([hz]);
    for (var i = 0; i < segs.length; i += 2) {
      var z0 = segs[i], z1 = segs[i + 1]; A.wall(-10.2, -9.8, z0, z1, -1, 18);
      var gl = new T.Mesh(new T.PlaneGeometry(z1 - z0, 16), m.glass); gl.rotation.y = -Math.PI / 2; gl.position.set(-10, 8, (z0 + z1) / 2); T0.add(gl);
    }
    var mull = new T.InstancedMesh(new T.BoxGeometry(0.22, 16, 0.22), m.steel, Math.ceil(2 * hz / 3) + 2), mm = new T.Matrix4(), mi = 0;
    for (var mz = -hz; mz <= hz; mz += 3) { mm.makeTranslation(-10, 8, mz); mull.setMatrixAt(mi++, mm); } mull.count = mi; T0.add(mull);
    for (var hy = 3; hy < 16; hy += 3.2) box(0.15, 0.12, 2 * hz, m.steel, -10, hy, 0, T0);
    A.doors = [];
    doorsZ.forEach(function (dz) {
      var l = box(0.1, 2.6, 2, m.glass, -10, 1.3, dz - 1, T0), r = box(0.1, 2.6, 2, m.glass, -10, 1.3, dz + 1, T0);
      box(0.4, 0.5, 4.4, m.dark, -10, 2.85, dz, T0);
      var ds = sign(dz === doorsZ[doorsZ.length - 1] && big ? 'ARRIVALS  ·  EXIT' : 'DEPARTURES', null, 4.2, 0.7, '#10233d'); ds.position.set(-10.3, 3.5, dz); ds.rotation.y = -Math.PI / 2; T0.add(ds);
      l.userData.dyn = r.userData.dyn = 1; A.doors.push({ l: l, r: r, z: dz, open: 0 });
    });
    [-hz, hz].forEach(function (zz) { A.wall(-10, 16, zz - 0.2, zz + 0.2, -1, 18); var ew = box(26, 18, 0.3, m.panel, 3, 9, zz, T0); ew.castShadow = true; });
    A.wall(15.8, 16.2, -hz, hz, -1, PH - 0.4);   // back wall of the hall (ground level only)
    box(0.3, PH, 2 * hz, m.panel, 16, PH / 2, 0, T0);
    // roof: a long wave of white steel with a skylight spine
    var rw = 46, rd = 2 * pz + 10, rg = new T.PlaneGeometry(rw, rd, 24, 40), rp = rg.attributes.position;
    for (var k = 0; k < rp.count; k++) { var x = rp.getX(k), y = rp.getY(k); rp.setZ(k, 1.6 * Math.sin(y * 0.05) + 2.2 * Math.cos(x / rw * Math.PI)); }
    rg.computeVertexNormals(); var roof = new T.Mesh(rg, new T.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.35, metalness: 0.25, side: T.DoubleSide }));
    roof.rotation.x = -Math.PI / 2; roof.position.set(9, 17.5, 0); T0.add(roof); roof.material.emissive = new T.Color(0x3b3d40);   // daylight terminal: the roof casts no shadow inside
    var lp = new T.InstancedMesh(new T.BoxGeometry(0.5, 0.12, 4), m.light, 120), li = 0;
    for (var lx = -7; lx <= 13; lx += 5) for (var lz = -hz + 4; lz <= hz - 4 && li < 120; lz += 8) { mm.makeTranslation(lx, 14.6, lz); lp.setMatrixAt(li++, mm); }
    for (var lz2 = -pz + 4; lz2 <= pz - 4 && li < 120; lz2 += 8) { mm.makeTranslation(23, PH + 6.6, lz2); lp.setMatrixAt(li++, mm); }
    lp.count = li; T0.add(lp);
    var sky = new T.Mesh(new T.PlaneGeometry(3, rd - 6), m.glass); sky.rotation.x = -Math.PI / 2; sky.position.set(3, 19.9, 0); T0.add(sky);
    var colG = new T.CylinderGeometry(0.45, 0.6, 17.5, 16), cols = new T.InstancedMesh(colG, m.white, 60), ck = 0;
    for (var cz = -hz + 8; cz <= hz - 8; cz += 16) [-4, 22].forEach(function (cx) { if (ck < 60) { mm.makeTranslation(cx, 8.75, cz); cols.setMatrixAt(ck++, mm); } }); cols.count = ck; T0.add(cols);
    cols.userData.cols = true;
    for (var c2 = 0; c2 < ck; c2++) { cols.getMatrixAt(c2, mm); var p = new T.Vector3().setFromMatrixPosition(mm); if (p.x < 16) A.wall(p.x - 0.45, p.x + 0.45, p.z - 0.45, p.z + 0.45, -1, 14); else A.wall(p.x - 0.45, p.x + 0.45, p.z - 0.45, p.z + 0.45, PH - 1, 14); }
    var name = sign(sp.name.toUpperCase(), sp.code + ' · ' + sp.city, 30, 3.2, '#0f1d33', '#e8d5a8'); name.position.set(-10.6, 15.6, 0); name.rotation.y = -Math.PI / 2; T0.add(name);
    // ---------------- landside interior ----------------
    var counterG = new T.BoxGeometry(1.4, 1.05, 1.9), counters = new T.InstancedMesh(counterG, m.wood, 80), screens = new T.InstancedMesh(new T.BoxGeometry(0.06, 0.45, 0.7), m.screen, 80), cn = 0;
    var islands = big ? [[-52, -32], [-26, -12], [12, 26], [32, 48]] : [[-24, -12], [12, 24]];
    islands.forEach(function (isl, ii) {
      for (var z = isl[0]; z < isl[1]; z += 2.1) { mm.makeTranslation(-4.5, 0.53, z + 1); counters.setMatrixAt(cn, mm); mm.makeTranslation(-4.5, 1.35, z + 1); screens.setMatrixAt(cn, mm); cn++; }
      box(0.7, 0.5, isl[1] - isl[0], m.dark, -2.85, 0.5, (isl[0] + isl[1]) / 2, T0);   // bag belt (agents stand between counter and belt)
      box(0.8, 2.6, isl[1] - isl[0], m.panel, -1.6, 1.3, (isl[0] + isl[1]) / 2, T0);
      A.wall(-5.3, -1.2, isl[0], isl[1]);
      var cs = sign('FYRUS AIRLINES  ·  CHECK-IN  ' + (ii * 10 + 1) + '–' + (ii * 10 + 10), 'Bag drop · boarding passes', 9, 1.5, '#1b2f52', '#e8d5a8'); cs.position.set(-4.6, 4.2, (isl[0] + isl[1]) / 2); cs.rotation.y = -Math.PI / 2; T0.add(cs);
      A.interact(-6.2, 0, (isl[0] + isl[1]) / 2, 6, 'Check-in counter · bag drop and boarding pass', 'checkin', function () { API.checkIn(A); });
    });
    counters.count = screens.count = cn; T0.add(counters); T0.add(screens);
    // self-service kiosks + info desk + ticket office
    for (var kz = -4; kz <= 4; kz += 2.6) { var kio = box(0.6, 1.5, 0.7, m.white, -8.2, 0.75, kz + (kz === 0 ? 0 : 0), T0); box(0.05, 0.5, 0.5, m.screen, -8.52, 1.35, kz, T0); }
    A.interact(-8.6, 0, 0, 3.5, 'Self-service kiosk · tickets and check-in', 'kiosk', function () { API.openDesk(A); });
    var info = cyl(1.6, 1.6, 1.05, 24, m.white, -3.5, 0.53, 0, T0); var infoS = sign('i  INFORMATION', null, 3.4, 0.8, '#1f6f4a'); infoS.position.set(-3.5, 3.2, 0); infoS.rotation.y = -Math.PI / 2; T0.add(infoS); A.wall(-5.1, -1.9, -1.6, 1.6);
    A.interact(-5.8, 0, 0, 3.5, 'Information desk · flights, gates and the airport guide', 'info', function () { API.openDesk(A, 'info'); });
    var tk = box(2.2, 1.1, 6, m.wood, -7.6, 0.55, -hz + 8, T0); var tkS = sign('TICKET OFFICE', 'Fyrus Airlines · all routes', 6, 1.3, '#1b2f52', '#e8d5a8'); tkS.position.set(-7.6, 3.4, -hz + 8); tkS.rotation.y = -Math.PI / 2; T0.add(tkS); A.wall(-8.7, -6.5, -hz + 5, -hz + 11);
    A.interact(-9.2, 0, -hz + 8, 4, 'Fyrus Airlines ticket office · buy a ticket', 'tickets', function () { API.openDesk(A); });
    // landside cafe + shop + seating + trolleys + restrooms
    A.shop(-6, hz - 8, 'CAFÉ AURORA', 'Coffee · pastries', 'cafe', 4);
    A.shop(-6, -hz + 17, 'FYRUS MART', 'Snacks · travel goods', 'mart', 3);
    A.seats(-7, -1.5, big ? 53 : 24, big ? 57 : 30, 0, T0);
    var trolG = new T.BoxGeometry(0.6, 0.9, 1.1), trol = new T.InstancedMesh(trolG, m.steel, 14); for (var tr = 0; tr < 14; tr++) { mm.makeTranslation(-9.2 + (tr % 2) * 0.7, 0.45, -hz + 22 + tr * 0.5); trol.setMatrixAt(tr, mm); } T0.add(trol);
    var wc = sign('RESTROOMS  ·  PRAYER ROOM', '← this way', 6, 1, '#2b3342'); wc.position.set(-1, 3, -hz + 0.25); T0.add(wc);
    A.interact(-1, 0, -hz + 1.2, 3, 'Restrooms and prayer room', 'wc', function () { toast('Restrooms and the prayer room are open 24 h.'); });
    // administration block (X 1..16, Z < -11.6): staff only
    A.wall(1.4, 15.8, -hz, -11.6); var adm = box(14.2, 4.5, hz - 11.8, new T.MeshStandardMaterial({ color: 0xbfc8d2, roughness: 0.25, metalness: 0.4 }), 8.6, 2.25, (-hz - 11.6) / 2, T0);
    var admS = sign('AIRPORT ADMINISTRATION', 'Staff only · lost & found', 7, 1.2, '#2b3342'); admS.position.set(1.2, 3.2, (-hz - 11.6) / 2); admS.rotation.y = -Math.PI / 2; T0.add(admS);
    A.interact(0, 0, (-hz - 11.6) / 2, 3.5, 'Airport administration · lost & found', 'admin', function () { toast(sp.name + ' administration: lost & found is open. Staff areas are closed to passengers.'); });
    // ---------------- arrivals hall (X 1..16, Z 11.6..hz): immigration, baggage claim, customs, exit ----------------
    var az0 = 11.6, az1 = hz;
    for (var bx = 3; bx <= 13; bx += 3.3) { box(1.1, 1.2, 1.4, m.white, bx, 0.6, az0 + 3, T0); box(0.05, 0.7, 1.2, m.glass, bx + 0.6, 1.6, az0 + 3, T0); A.wall(bx - 0.55, bx + 0.55, az0 + 2.3, az0 + 3.7); }
    var imS = sign('IMMIGRATION  ·  PASSPORT CONTROL', 'All passengers', 8, 1, '#123a5c'); imS.position.set(8, 3.6, az0 + 0.3); T0.add(imS);
    var carZ = (az0 + 5 + az1 - 6) / 2, carouselR = Math.min(3, (az1 - az0 - 12) / 2);
    var belt = new T.Mesh(new T.TorusGeometry(Math.max(1.6, carouselR), 0.45, 8, 32), m.dark); belt.rotation.x = Math.PI / 2; belt.position.set(8, 0.55, carZ); T0.add(belt);
    A.wall(8 - carouselR - 0.5, 8 + carouselR + 0.5, carZ - carouselR - 0.5, carZ + carouselR + 0.5);
    var bagG = new T.BoxGeometry(0.55, 0.35, 0.8), bags = new T.InstancedMesh(bagG, new T.MeshStandardMaterial({ roughness: 0.5 }), 12), bagCols = [0x2f4f6f, 0xb8323a, 0x222831, 0xc7a46a, 0x3d5a3d, 0x7a4a8a];
    for (var bg = 0; bg < 12; bg++) bags.setColorAt(bg, new T.Color(bagCols[bg % bagCols.length])); T0.add(bags);
    A.updaters.push(function (dt, now) { var R = Math.max(1.6, carouselR); for (var i2 = 0; i2 < 12; i2++) { var a2 = now * 0.25 + i2 / 12 * Math.PI * 2; mm.makeRotationY(-a2); mm.setPosition(8 + Math.cos(a2) * R, 0.95, carZ + Math.sin(a2) * R); bags.setMatrixAt(i2, mm); } bags.instanceMatrix.needsUpdate = true; });
    var bcS = sign('BAGGAGE CLAIM  1', 'Belt 1 · all flights', 5, 1, '#1b2f52'); bcS.position.set(8, 3.4, az1 - 0.3); bcS.rotation.y = Math.PI; T0.add(bcS);
    A.interact(8 - carouselR - 1.2, 0, carZ, 4, 'Baggage claim · collect your bag', 'bags', function () { API.collectBag(A); });
    box(3, 1.05, 1, m.white, 3.5, 0.53, az1 - 9, T0); var cuS = sign('CUSTOMS', 'Nothing to declare ↗', 3.4, 0.9, '#1f6f4a'); cuS.position.set(3.5, 3, az1 - 9.6); cuS.rotation.y = Math.PI; T0.add(cuS);
    A.interact(3.5, 0, az1 - 10.5, 3, 'Customs · nothing to declare', 'customs', function () { toast('Customs: green channel — welcome to ' + sp.city + '.'); });
    A.arrivalSpawn = { x: 14, z: az0 + 1.6, face: { x: 8, z: az1 } };
    // ---------------- airside pier (PH): duty free, cafe, VIP lounge, gates, immigration (outbound) ----------------
    A.wall(15.8, 16.2, -pz, -11.4, PH - 0.5, 18); A.wall(15.8, 16.2, 11.4, pz, PH - 0.5, 18); A.wall(13.8, 14.2, -4, 4, PH - 0.5, PH + 7);
    [-pz, pz].forEach(function (zz) { A.wall(16, 30, zz - 0.2, zz + 0.2, PH - 0.5, 18); box(14, 17.5 - PH, 0.3, m.panel, 23, (17.5 + PH) / 2, zz, T0); });
    box(0.3, 1.1, 2 * pz, m.glass, 16, PH + 0.55, 0, T0);   // balustrade overlooking the hall
    // east glass wall with jet-bridge doors
    var gz = L.gatesZ, openings = gz.map(function (z) { return [z + 1.2, z + 4.0]; }), last = -pz;
    openings.forEach(function (o) { A.wall(29.8, 30.2, last, o[0], PH - 0.5, 18); var gl2 = new T.Mesh(new T.PlaneGeometry(o[0] - last, 17.5 - PH), m.glass); gl2.rotation.y = Math.PI / 2; gl2.position.set(30, (17.5 + PH) / 2, (last + o[0]) / 2); T0.add(gl2); last = o[1]; });
    A.wall(29.8, 30.2, last, pz, PH - 0.5, 18); var gl3 = new T.Mesh(new T.PlaneGeometry(pz - last, 17.5 - PH), m.glass); gl3.rotation.y = Math.PI / 2; gl3.position.set(30, (17.5 + PH) / 2, (last + pz) / 2); T0.add(gl3);
    box(14, PH - 0.4, 2 * pz, new T.MeshStandardMaterial({ color: 0x9aa4ae, roughness: 0.6 }), 23, (PH - 0.4) / 2, 0, T0);   // ground floor under the pier: baggage hall (closed)
    A.wall(16.2, 29.8, -pz, pz, -1, PH - 0.6);
    // outbound immigration booths just after the escalators
    for (var ib = -3; ib <= 3; ib += 3) { box(0.9, 1.2, 1.2, m.white, 17.4, PH + 0.6, ib, T0); }
    var obS = sign('PASSPORT CONTROL  ·  INTERNATIONAL', null, 6, 0.8, '#123a5c'); obS.position.set(16.4, PH + 3, 0); obS.rotation.y = -Math.PI / 2; T0.add(obS);
    A.interact(18.6, PH, 0, 4, 'Passport control · international departures', 'immig', function () { API.immigration(A); });
    // duty free (walk-through) + cafe + VIP lounge
    A.shop(21, -8, 'DUTY FREE', 'Fragrance · chocolate · Fyrus souvenirs', 'dutyfree', 3, PH);
    A.shop(21, 18, 'SKY CAFÉ', 'Espresso · Fyrus dates · snacks', 'skycafe', 3, PH);
    var vz0 = -pz + 0.2, vz1 = -pz + (big ? 14 : 10);
    A.wall(18, 18.3, vz0, vz1 - 3, PH - 0.5, PH + 7); A.wall(18, 29.8, vz1 - 0.15, vz1 + 0.15, PH - 0.5, PH + 7);
    var vg = new T.Mesh(new T.PlaneGeometry(vz1 - vz0, 3), new T.MeshStandardMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.35, metalness: 0.6, roughness: 0.2, side: T.DoubleSide })); vg.rotation.y = Math.PI / 2; vg.position.set(18.15, PH + 1.5, (vz0 + vz1) / 2); T0.add(vg);
    var vl = sign('FYRUS PRESTIGE LOUNGE', 'VIP · business & passport holders', 6, 1, '#1a1408', '#e8d5a8'); vl.position.set(17.9, PH + 3.2, (vz0 + vz1) / 2); vl.rotation.y = -Math.PI / 2; T0.add(vl);
    for (var sx = 20; sx < 29; sx += 2.4) for (var sz = vz0 + 1.5; sz < vz1 - 1; sz += 2.6) { box(1, 0.45, 1, new T.MeshStandardMaterial({ color: 0x4a3b30, roughness: 0.7 }), sx, PH + 0.22, sz, T0); }
    A.interact(19.5, PH, vz1 - 1.5, 3.2, 'Prestige lounge · quiet seating, coffee, runway view', 'vip', function () { toast('Welcome to the Prestige Lounge. Free coffee and the best runway view in ' + sp.city + '.'); });
    // gates
    gz.forEach(function (z, gi) { A.buildGate(gi, z); });
    // FIDS boards: departures (hall, above security) + pier + arrivals hall
    A.fids = [];
    [[0.5, 6.4, 0, -Math.PI / 2, 'dep'], [23, PH + 4.2, -pz + 0.3, 0, 'dep'], [8, 4.4, az0 + 0.25, 0, 'arr']].forEach(function (f) {
      var tex = canvasTex(1024, 512, function () {}), board = new T.Mesh(new T.PlaneGeometry(6.4, 3.2), new T.MeshBasicMaterial({ map: tex, toneMapped: false }));
      board.position.set(f[0], f[1], f[2]); board.rotation.y = f[3]; T0.add(board); A.fids.push({ tex: tex, kind: f[4] });
    });
    A.drawFids();
  };
  Airport.prototype.shop = function (x, z, title, sub, id, w, y) {
    var A = this, m = mats(), T0 = A.terminal; y = y || 0;
    box(w, 1.05, 1.2, m.wood, x, y + 0.53, z, T0); box(0.4, 2.4, w + 1, m.white, x + 1.4, y + 1.2, z, T0);
    for (var i = 0; i < 3; i++) box(0.5, 0.4, 0.5, new T.MeshStandardMaterial({ color: [0xb8323a, 0xc9a96e, 0x2f4f6f][i], roughness: 0.5 }), x + 1.1, y + 1.4 + i * 0.5, z - w / 3 + i * w / 3, T0);
    var sg = sign(title, sub, Math.max(4, title.length * 0.4), 1, '#1a1408', '#e8d5a8'); sg.position.set(x + 1.1, y + 3, z); sg.rotation.y = -Math.PI / 2; T0.add(sg);
    A.wall(x - w / 2 + 0.2, x + 1.6, z - 0.7, z + 0.7, y - 1, y + 3);
    A.interact(x - 1.2, y, z, 3, title + ' · ' + sub, 'shop-' + id, function () { API.shopBuy(A, id, title); });
  };
  Airport.prototype.seats = function (x0, x1, z0, z1, y, parent) { this.armchairs(x0, x1, z0, z1, y, parent, 0x24406a); };

  // ---------------- interior finish: pier glazing frame, hanging signs, planters, gate carpets, welcome sign ----------------
  Airport.prototype.decor = function () {
    var A = this, m = mats(), T0 = A.terminal, L = A.L, hz = L.hallZ, pz = L.pierZ, sp = A.spec, mm = new T.Matrix4();
    var mul = new T.InstancedMesh(new T.BoxGeometry(0.2, 17.5 - PH, 0.2), m.steel, Math.ceil(2 * pz / 3) + 2), k = 0;
    for (var z = -pz; z <= pz; z += 3) { if (L.gatesZ.some(function (g) { return z > g + 1.0 && z < g + 4.2; })) continue; mm.makeTranslation(30, (17.5 + PH) / 2, z); mul.setMatrixAt(k++, mm); }
    mul.count = k; T0.add(mul); box(0.2, 0.16, 2 * pz, m.steel, 30, PH + 3.4, 0, T0); box(0.3, 0.3, 2 * pz, m.steel, 30, PH + 7, 0, T0); box(0.3, 0.3, 2 * pz, m.steel, 30, 17.3, 0, T0);
    // gate carpets under the seating
    var carpet = new T.MeshStandardMaterial({ color: 0x24324a, roughness: 1 });
    L.gatesZ.forEach(function (gz) { box(7, 0.03, 14, carpet, 22, PH + 0.015, gz, T0); });
    // hanging direction signs on the pier and in the hall
    var gn = L.gatesZ.map(function (g, i) { return (A.big ? 'A' : 'B') + (i + 1); });
    [[23, PH + 5.2, -pz / 2, '←  GATES ' + gn[0] + (gn.length > 2 ? ' · ' + gn[1] : '') + '   ·   LOUNGE'], [23, PH + 5.2, pz / 2, 'GATES ' + gn[gn.length - 1] + '  →   ·   SKY CAFÉ']].forEach(function (h) {
      var sg = sign(h[3], null, 9, 0.9, '#10233d', '#f2c230'); sg.position.set(h[0], h[1], h[2]); sg.rotation.y = -Math.PI / 2; T0.add(sg); var b2 = sg.clone(); b2.rotation.y = Math.PI / 2; b2.position.x += 0.02; T0.add(b2);
      cyl(0.03, 0.03, 13 - h[1], 4, m.steel, h[0], (13 + h[1]) / 2 + 0.4, h[2] - 3, T0); cyl(0.03, 0.03, 13 - h[1], 4, m.steel, h[0], (13 + h[1]) / 2 + 0.4, h[2] + 3, T0);
    });
    var wl = sign('WELCOME TO ' + sp.city.toUpperCase(), 'Baggage claim · customs · taxis and buses →', 10, 1.6, '#0f1d33', '#e8d5a8'); wl.position.set(15.7, 3.6, (11.6 + hz) / 2); wl.rotation.y = -Math.PI / 2; T0.add(wl);
    var ex = sign('EXIT  ·  TAXI  ·  BUS', null, 3.6, 0.7, '#1f6f4a'); ex.position.set(1.1, 3.2, hz - 7); ex.rotation.y = Math.PI / 2; T0.add(ex);
    // planters (box + low-poly crown), hall + pier
    var pot = new T.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 0.6 }), leaf = new T.MeshStandardMaterial({ color: 0x3f6b35, roughness: 0.9 });
    [[-1, 0, -hz + 3], [-1, 0, hz - 3], [28.8, PH, -pz + 20], [28.8, PH, 0.5], [28.8, PH, pz - 4]].forEach(function (q) {
      box(1.1, 0.8, 1.1, pot, q[0], q[1] + 0.4, q[2], T0); var cr = new T.Mesh(new T.IcosahedronGeometry(0.9, 1), leaf); cr.position.set(q[0], q[1] + 1.7, q[2]); cr.scale.y = 1.3; T0.add(cr);
      A.wall(q[0] - 0.6, q[0] + 0.6, q[2] - 0.6, q[2] + 0.6, q[1] - 1, q[1] + 3);
    });
  };

  // ---------------- 35.2 premium finish: Sky Gallery level, elevators, luxury shopping gallery, palms, water, canopy ----------------
  var L2H = 10.5;   // Sky Gallery floor (restaurants, first-class lounge, panorama deck)
  function palm(parent, x, y, z, s) {
    var g = new T.Group(); g.position.set(x, y, z); g.scale.setScalar(s || 1); parent.add(g);
    var bark = PALM.bark || (PALM.bark = new T.MeshStandardMaterial({ color: 0x8b7358, roughness: 0.95 })), leaf = PALM.leaf || (PALM.leaf = new T.MeshStandardMaterial({ color: 0x3f7a3a, roughness: 0.8, side: T.DoubleSide }));
    var tr = cyl(0.16, 0.24, 5, 8, bark, 0, 2.5, 0, g);
    for (var i = 0; i < 9; i++) { var f = new T.Mesh(PALM.frond || (PALM.frond = (function () { var c = new T.ConeGeometry(0.45, 3.2, 4, 1, true); c.translate(0, 1.6, 0); c.rotateX(Math.PI / 2.3); c.scale(1, 0.25, 1); return c; })()), leaf); f.position.y = 5; f.rotation.y = i / 9 * Math.PI * 2; g.add(f); }
    return g;
  }
  var PALM = {};
  Airport.prototype.luxury = function () {
    var A = this, m = mats(), T0 = A.terminal, L = A.L, hz = L.hallZ, pz = L.pierZ, sp = A.spec, mm = new T.Matrix4(), big = A.big;
    var gold = m.gold, low = API.lowSpec();
    // ---- grand entrance canopy over the curb with a lit name band and twin columns
    var can = new T.Mesh(new T.PlaneGeometry(16, 2 * hz + 20, 4, 8), new T.MeshStandardMaterial({ color: 0xf4f5f7, roughness: 0.3, metalness: 0.4, side: T.DoubleSide, emissive: 0x2a2a2a }));
    can.rotation.x = -Math.PI / 2; can.rotation.y = 0; can.position.set(-17, 9.5, 0); T0.add(can);
    box(0.4, 0.6, 2 * hz + 20, gold, -25, 9.4, 0, T0);
    for (var cz = -hz; cz <= hz; cz += 20) { cyl(0.35, 0.35, 9.5, 12, m.white, -24, 4.75, cz, T0); A.wall(-24.5, -23.5, cz - 0.5, cz + 0.5); }
    var band = sign(sp.name.toUpperCase(), null, 36, 1.6, '#0f1d33', '#f2d9a0'); band.position.set(-25.25, 10.6, 0); band.rotation.y = -Math.PI / 2; T0.add(band);
    // ---- landside water feature (low pool + jets) between the road and the parking
    if (!low) {
      var pool = new T.Mesh(new T.CylinderGeometry(7, 7, 0.5, 40), m.white); pool.position.set(-46, 0.25, -hz + 2); T0.add(pool);
      var water = new T.Mesh(new T.CircleGeometry(6.6, 40), new T.MeshStandardMaterial({ color: 0x3f8fb5, roughness: 0.05, metalness: 0.6, transparent: true, opacity: 0.85 })); water.rotation.x = -Math.PI / 2; water.position.set(-46, 0.52, -hz + 2); T0.add(water);
      var jets = new T.InstancedMesh(new T.CylinderGeometry(0.05, 0.12, 1, 6), new T.MeshBasicMaterial({ color: 0xdff4ff, transparent: true, opacity: 0.7 }), 12); jets.userData.dyn = 1; T0.add(jets); A.wall(-53, -39, -hz - 5, -hz + 9);
      A.updaters.push(function (dt, now) { for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2, h = 1.6 + Math.sin(now * 2 + i) * 0.5; mm.compose(new T.Vector3(-46 + Math.cos(a) * 4, 0.5 + h / 2, -hz + 2 + Math.sin(a) * 4), new T.Quaternion(), new T.Vector3(1, h, 1)); jets.setMatrixAt(i, mm); } jets.instanceMatrix.needsUpdate = true; });
    }
    // ---- slatted timber ceiling over the check-in hall (one instanced mesh)
    if (!low) {
      var slats = new T.InstancedMesh(new T.BoxGeometry(0.12, 0.35, 2 * hz - 4), new T.MeshStandardMaterial({ color: 0xb08350, roughness: 0.6 }), 100), si = 0;
      for (var sx = -8.5; sx <= 14.5; sx += 0.55) { mm.makeTranslation(sx, 15.6, 0); slats.setMatrixAt(si++, mm); } slats.count = si; T0.add(slats);
    }
    // ---- palms in stone planters: hall, pier, curb
    var pots = [[-7, 0, -hz + 30], [-7, 0, hz - 30], [-1.5, 0, -18], [-1.5, 0, 18], [-16, 0.25, -30], [-16, 0.25, 30]];
    for (var gi2 = 0; gi2 < L.gatesZ.length - 1; gi2++) { var mz = (L.gatesZ[gi2] + L.gatesZ[gi2 + 1]) / 2 + 1.3; if (Math.abs(mz) > 14 && !(L.L2 && Math.abs(mz) < 49)) pots.push([21, PH, mz]); }
    pots.forEach(function (q) { box(1.6, 0.9, 1.6, new T.MeshStandardMaterial({ color: 0xd8d0c2, roughness: 0.5 }), q[0], q[1] + 0.45, q[2], T0); if (!low) palm(T0, q[0], q[1] + 0.9, q[2], 0.9); A.wall(q[0] - 0.85, q[0] + 0.85, q[2] - 0.85, q[2] + 0.85, q[1] - 1, q[1] + 4); });
    // ---- green wall on the hall end walls
    var gw = canvasTex(256, 256, function (g, w) { g.fillStyle = '#2f5a2c'; g.fillRect(0, 0, w, w); for (var k = 0; k < 900; k++) { g.fillStyle = ['#3f7a3a', '#4f8f45', '#2a4f27', '#6aa35a'][k % 4]; g.beginPath(); g.arc(Math.random() * w, Math.random() * w, 3 + Math.random() * 6, 0, 7); g.fill(); } }, [6, 3]);
    [-hz + 0.25, hz - 0.25].forEach(function (zz) { var p2 = new T.Mesh(new T.PlaneGeometry(20, 9), new T.MeshStandardMaterial({ map: gw, roughness: 0.9 })); p2.position.set(4, 7.5, zz); if (zz > 0) p2.rotation.y = Math.PI; T0.add(p2); });
    // ---- executive waiting area (leather armchairs) by the information desk
    A.armchairs(-6.6, -4.8, 5.6, 9.9, 0, T0, 0x3b2a20); A.armchairs(-6.6, -4.8, -9.9, -5.6, 0, T0, 0x3b2a20);
    // ---- luxury shopping gallery along the pier's west wall (glass shopfronts, lit name boards)
    var brands = [['AURUM', 'Fine jewellery'], ['MAISON FYRUS', 'Couture & leather'], ['NOVA TECH', 'Electronics'], ['SAHARA', 'Perfumes & oud'], ['CHRONOS', 'Swiss-style watches'], ['PAGES', 'Books & press'], ['COCOA HOUSE', 'Chocolatier'], ['ATELIER', 'Fashion'], ['ORBIT TOYS', 'Kids'], ['SILK ROUTE', 'Tea & spices'], ['LUXE OPTIC', 'Eyewear'], ['FYRUS GIFTS', 'Souvenirs']];
    var fronts = [], fz = -pz + 22, bi = 0;
    while (fz < pz - 20 && bi < brands.length * 2) {
      if (Math.abs(fz) > 13 && !(L.L2 && Math.abs(Math.abs(fz) - 28) < 6)) fronts.push([fz, brands[bi % brands.length]]);
      fz += 11; bi++;
    }
    var shopBody = new T.MeshStandardMaterial({ color: 0xf6f1e6, roughness: 0.4, emissive: 0x332c20 });
    fronts.forEach(function (f, i) {
      var z = f[0], b = f[1];
      box(2.2, 4.2, 9.4, shopBody, 17.2, PH + 2.1, z, T0);
      var gl = new T.Mesh(new T.PlaneGeometry(9.2, 3.6), m.glass); gl.rotation.y = Math.PI / 2; gl.position.set(18.35, PH + 1.8, z); T0.add(gl);
      box(0.12, 0.12, 9.4, gold, 18.35, PH + 3.7, z, T0);
      var sg = sign(b[0], b[1], 6, 0.9, '#14110b', '#f2d9a0'); sg.position.set(18.38, PH + 4.25, z); sg.rotation.y = Math.PI / 2; T0.add(sg);
      for (var k = 0; k < 3; k++) box(0.5, 0.6, 0.5, new T.MeshStandardMaterial({ color: [0xb8323a, 0xc9a96e, 0x2f4f6f, 0x6b3fa0, 0x2e7d4f][(i + k) % 5], roughness: 0.4, emissive: 0x151515 }), 17.6, PH + 1.1, z - 3 + k * 3, T0);
      A.wall(16, 18.4, z - 4.8, z + 4.8, PH - 0.5, PH + 4.5);
      if (i % 3 === 0) A.interact(19.4, PH, z, 3, b[0] + ' · ' + b[1], 'gal' + i, function () { API.shopBuy(A, 'gallery', b[0]); });
    });
    // ---- Sky Gallery (level 2): restaurants, first-class lounge, panorama deck over the gates
    if (L.L2) {
      var z0 = -47, z1 = 47, x1 = 22.6;
      box(x1 - 16, 0.5, z1 - z0, marble(7, 94), (16 + x1) / 2, L2H - 0.25, 0, T0);
      A.floor(16, x1, z0, z1, L2H);
      box(0.12, 1.1, z1 - z0, m.glass, x1, L2H + 0.55, 0, T0); box(0.16, 0.08, z1 - z0, gold, x1, L2H + 1.12, 0, T0);
      A.wall(x1 - 0.1, x1 + 0.3, z0, z1, L2H - 0.4, L2H + 3); A.wall(16, x1, z0 - 0.3, z0, L2H - 0.4, L2H + 3); A.wall(16, x1, z1, z1 + 0.3, L2H - 0.4, L2H + 3);
      // restaurants: three counters with boards + dining tables (instanced)
      [['SKY GRILL', 'Steaks · seafood', -42], ['SAKURA', 'Sushi · ramen', -16], ['FYRUS ROASTERS', 'Specialty coffee', 4]].forEach(function (r) {
        box(1.0, 1.1, 6, m.wood, 16.8, L2H + 0.55, r[2], T0); var rs = sign(r[0], r[1], 5, 0.9, '#1a1408', '#f2d9a0'); rs.position.set(16.25, L2H + 3, r[2]); rs.rotation.y = Math.PI / 2; T0.add(rs); A.wall(16, 17.4, r[2] - 3, r[2] + 3, L2H - 0.4, L2H + 3);
        A.interact(18.6, L2H, r[2], 3, r[0] + ' · ' + r[1], 'rest' + r[2], function () { API.shopBuy(A, 'restaurant', r[0]); });
      });
      var tb = new T.InstancedMesh(new T.CylinderGeometry(0.5, 0.5, 0.06, 16), m.white, 24), tl = new T.InstancedMesh(new T.CylinderGeometry(0.06, 0.08, 0.74, 6), gold, 24), ti = 0;
      for (var tz = -44; tz <= 12 && ti < 24; tz += 3.5) for (var tx2 = 19.6; tx2 <= 21.6; tx2 += 2.0) { if (Math.abs(tz + 28) < 2.6) continue; mm.makeTranslation(tx2, L2H + 0.75, tz); tb.setMatrixAt(ti, mm); mm.makeTranslation(tx2, L2H + 0.37, tz); tl.setMatrixAt(ti, mm); ti++; }
      tb.count = tl.count = ti; T0.add(tb); T0.add(tl);
      // first-class lounge (north part): loungers, bar, gold glass screen
      var fz0 = 31, fz1 = 46;
      var lg = new T.Mesh(new T.PlaneGeometry(x1 - 16, 3), new T.MeshStandardMaterial({ color: 0xc9a96e, transparent: true, opacity: 0.35, metalness: 0.7, roughness: 0.2, side: T.DoubleSide })); lg.position.set((16 + x1) / 2, L2H + 1.5, fz0); T0.add(lg);
      A.wall(16, x1 - 2.2, fz0 - 0.1, fz0 + 0.1, L2H - 0.4, L2H + 3);
      box(0.9, 1.1, 4, m.dark, 16.7, L2H + 0.55, 43, T0); box(1, 0.06, 4.2, gold, 16.7, L2H + 1.13, 43, T0); A.wall(16, 17.3, 41, 45, L2H - 0.4, L2H + 3);
      A.armchairs(19, 21, fz0 + 2.5, fz1 - 6, L2H, T0, 0xe9dfcc);
      var fl = sign('FIRST CLASS LOUNGE', 'Fyrus Airlines · First & Prestige', 5.6, 1, '#1a1408', '#f2d9a0'); fl.position.set(19.3, L2H + 2.6, fz0 - 0.05); fl.rotation.y = Math.PI; T0.add(fl);
      A.interact(19.5, L2H, fz0 + 3, 3.2, 'First Class Lounge · champagne bar and runway views', 'first', function () { toast('First Class Lounge: quiet suites, a champagne-free bar and the best runway view in ' + sp.city + '.'); });
      var pd = sign('PANORAMA DECK', 'Watch the aircraft at the gates', 5, 0.9, '#0f1d33', '#e8d5a8'); pd.position.set(x1 - 0.1, L2H + 2.8, -6); pd.rotation.y = -Math.PI / 2; T0.add(pd);
      // elevators: glass cabins between the gate level and the Sky Gallery
      [-28, 28].forEach(function (ez) {
        var shaft = new T.Mesh(new T.CylinderGeometry(1.5, 1.5, L2H + 3 - PH, 16, 1, true), m.glass); shaft.position.set(17.8, (L2H + 3 + PH) / 2, ez); T0.add(shaft);
        cyl(1.55, 1.55, 0.15, 16, gold, 17.8, L2H + 3, ez, T0); A.wall(16.2, 19.3, ez - 1.5, ez + 1.5, PH - 0.5, L2H + 3);
        var es = sign('ELEVATOR', 'Level 1 gates · Level 2 Sky Gallery', 3, 0.8, '#0f1d33'); es.position.set(19.4, PH + 3.2, ez); es.rotation.y = Math.PI / 2; T0.add(es);
        var es2 = es.clone(); es2.position.y = L2H + 2.2; T0.add(es2);
        A.interact(20, PH, ez, 2.6, 'Elevator · up to the Sky Gallery (restaurants, First Class Lounge)', 'lift-up' + ez, function () { API.lift(A, 20.3, L2H, ez > 0 ? ez - 3.5 : ez + 3.5); });
        A.interact(20, L2H, ez > 0 ? ez - 3 : ez + 3, 2.6, 'Elevator · down to the gates', 'lift-dn' + ez, function () { API.lift(A, 20.6, PH, ez); });
      });
    }
  };
  // premium armchairs: seat, back and arms as instanced meshes, in a block facing +x
  Airport.prototype.armchairs = function (x0, x1, z0, z1, y, parent, color) {
    var mt = new T.MeshStandardMaterial({ color: color || 0x2f4d6b, roughness: 0.55 }), list = [], mm = new T.Matrix4();
    for (var x = x0; x <= x1; x += 1.8) for (var z = z0; z <= z1; z += 1.1) list.push([x, z]);
    var seat = new T.InstancedMesh(new T.BoxGeometry(0.8, 0.4, 0.9), mt, list.length), back = new T.InstancedMesh(new T.BoxGeometry(0.2, 0.75, 0.9), mt, list.length), arm = new T.InstancedMesh(new T.BoxGeometry(0.8, 0.25, 0.12), mt, list.length * 2);
    list.forEach(function (p, i) { mm.makeTranslation(p[0], y + 0.42, p[1]); seat.setMatrixAt(i, mm); mm.makeTranslation(p[0] - 0.4, y + 0.8, p[1]); back.setMatrixAt(i, mm); mm.makeTranslation(p[0], y + 0.7, p[1] - 0.45); arm.setMatrixAt(2 * i, mm); mm.makeTranslation(p[0], y + 0.7, p[1] + 0.45); arm.setMatrixAt(2 * i + 1, mm); });
    parent.add(seat); parent.add(back); parent.add(arm);
    this.wall(x0 - 0.6, x1 + 0.5, z0 - 0.6, z1 + 0.6, y - 1, y + 2);
  };

  // ---------------- gate: desk + seats on the pier, walkable jet bridge sloping down to the aircraft door ----------------
  Airport.prototype.buildGate = function (gi, z) {
    var A = this, m = mats(), T0 = A.terminal, sp = A.spec, L = A.L;
    var type = A.L.gates[gi].t, P = TYPES[type];
    var name = (A.big ? 'A' : 'B') + (gi + 1), Zb = z + 2.6, nose = type === 'wide' ? 33.5 : 37;
    // the parked aircraft: nose towards the terminal (faces -X), left side (doors) towards +Z = the bridge
    var ac = aircraft(type, { cabin: true }), R = P.r, Ln = P.len;
    var Zac = Zb - R - 2.2, Xac = nose + Ln / 2;
    ac.rotation.y = Math.PI / 2; ac.position.set(Xac, ac.userData.gearH, Zac); A.group.add(ac); A.aircraft.push(ac);
    var doorX = Xac + ac.userData.doorZ, sill = ac.userData.gearH - R * 0.45;
    // jet bridge: rotunda at the pier, sloped tunnel to the cab, cab turns towards the door
    var x0 = 30, x1 = doorX + 1.3, run = Math.max(2, x1 - 1.3 - x0 - 1.2);
    var hAt = function (x) { return PH + (sill - PH) * Math.max(0, Math.min(1, (x - x0) / run)); };
    A.floor(x0 - 0.3, x1, Zb - 2.25, Zb + 1.45, function (x) { return hAt(x); });
    A.wall(x0, x1, Zb + 1.45, Zb + 1.75, sill - 0.6, PH + 3); A.wall(x1, x1 + 0.3, Zb - 2.4, Zb + 1.7, sill - 0.6, PH + 3);
    A.wall(x0, doorX - 1.2, Zb - 1.75, Zb - 1.45, sill - 0.6, PH + 3); A.wall(doorX - 1.2, x1, Zb - 2.6, Zb - 2.3, sill - 0.6, PH + 3);
    // gate door in the pier glass: open only for passengers of this flight once boarding has started
    A.wall(29.8, 30.2, z + 1.2, z + 4.0, PH - 0.5, PH + 7, function (q) { var t = API.cur(); return q.x < 30 && !(t && t.from === sp.code && t.gate === name && (t.status === 'cleared' || t.status === 'checked')); });
    var bm = new T.MeshStandardMaterial({ color: 0xc8ccd2, roughness: 0.45, metalness: 0.55 }), bg = new T.Group();
    var len = Math.hypot(run, PH - sill), pitch = Math.atan2(PH - sill, run);
    var tun = new T.Group(); tun.position.set(x0 + run / 2 + 0.6, (PH + sill) / 2 + 1.25, Zb - 0.15); tun.rotation.z = -pitch; bg.add(tun);
    box(len + 1.2, 0.18, 3.2, m.dark, 0, -1.33, 0, tun); box(len + 1.2, 0.2, 3.2, bm, 0, 1.35, 0, tun);
    box(len + 1.2, 1.0, 0.12, bm, 0, -0.75, 1.6, tun); box(len + 1.2, 1.0, 0.12, bm, 0, -0.75, -1.6, tun);
    var gw = new T.Mesh(new T.PlaneGeometry(len + 1.2, 1.6), m.glass); gw.position.set(0, 0.45, 1.6); tun.add(gw); var gw2 = gw.clone(); gw2.position.z = -1.6; tun.add(gw2);
    var cab = box(2.8, 2.6, 3.6, bm, x1 - 1.3, sill + 1.3, Zb - 0.4, bg); box(2.6, 0.12, 3.4, m.dark, x1 - 1.3, sill + 0.06, Zb - 0.4, bg);
    var rot = cyl(1.9, 1.9, 2.8, 16, bm, x0 + 0.8, PH + 1.4, Zb - 0.15, bg);
    cyl(0.35, 0.45, PH - 0.2, 10, m.steel, x0 + 0.8, (PH - 0.2) / 2, Zb - 0.15, bg);
    cyl(0.18, 0.18, sill, 8, m.steel, x1 - 2.2, sill / 2, Zb - 0.15, bg); box(1.6, 0.6, 0.8, m.dark, x1 - 2.2, 0.35, Zb - 0.15, bg);
    [-0.6, 0.6].forEach(function (o) { var wh = new T.Mesh(buildGeo('bizjet').wheel, m.rubber); wh.position.set(x1 - 2.2, 0.32, Zb - 0.15 + o); bg.add(wh); });
    cab.material = bm; T0.add(bg);
    // gate area: desk, gate sign, seats facing the apron
    box(0.8, 1.05, 2.4, m.wood, 27.4, PH + 0.53, z - 1.2, T0); box(0.05, 0.4, 0.6, m.screen, 27.0, PH + 1.35, z - 1.2, T0); A.wall(27, 27.8, z - 2.4, z);
    var gs = sign('GATE ' + name, '', 3, 1.1, '#f2c230', '#111'); gs.position.set(27.6, PH + 3.2, z - 1.2); gs.rotation.y = -Math.PI / 2; T0.add(gs);
    var fsign = sign('GATE ' + name + '  ·  —', '', 5, 0.8, '#10233d'); fsign.position.set(29.7, PH + 3.4, z + 2.6); fsign.rotation.y = -Math.PI / 2; T0.add(fsign);
    A.seats(19.5, 24, z - 6, z + 6, PH, T0);
    A.interact(26.2, PH, z - 1.2, 3.2, 'Gate ' + name + ' · boarding desk', 'gate' + gi, function () { API.gateDesk(A, name); });
    A.interact(doorX, sill, Zb - 1.5, 2.6, 'Board the aircraft · ' + P.name, 'board' + gi, function () { API.board(A, name); });
    A.gates.push({ name: name, i: gi, z: z, Zb: Zb, ac: ac, type: type, doorX: doorX, sill: sill, Xac: Xac, Zac: Zac, sign: fsign });
    // ground support at the stand: belt loader + baggage cart train + catering truck on the right side
    A.vehicle('belt', Xac + Ln * 0.25, 0, Zac - R - 1.6, 0);
    A.vehicle('carts', Xac + Ln * 0.25 + 6, 0, Zac - R - 6, Math.PI / 2);
    if (type !== 'turboprop') A.vehicle('catering', Xac + Ln * 0.38, 0, Zac - R - 2.4, 0);
    A.vehicle('fuel', Xac - Ln * 0.05, 0, Zac - R - P.span * 0.32, Math.PI / 2);
  };

  // ---------------- ground service vehicles (simple boxes, shared materials) ----------------
  var VM = null;
  function vMats() {
    if (VM) return VM; var s = function (c, r, mt) { return new T.MeshStandardMaterial({ color: c, roughness: r || 0.5, metalness: mt || 0.2 }); };
    VM = { yellow: s(0xf2c230, 0.5, 0.3), white: s(0xeeeeea, 0.4, 0.3), blue: s(0x1b2f52, 0.4, 0.3), red: s(0xc0262d, 0.4, 0.3), grey: s(0x6b7178, 0.6, 0.5), glass: s(0x203040, 0.1, 0.8), tank: s(0xd9dce0, 0.3, 0.8), hivis: s(0xd8f02a, 0.6, 0.0) };
    return VM;
  }
  function wheels(g, xs, zs, r) { var mt = mats().rubber; xs.forEach(function (x) { zs.forEach(function (z) { var w = cyl(r, r, 0.3, 10, mt, x, r, z, g); w.rotation.z = Math.PI / 2; }); }); }
  function vehicle(kind) {
    var v = vMats(), g = new T.Group(); g.name = 'a35-veh-' + kind;
    if (kind === 'tug') { box(2.2, 1.0, 4.2, v.yellow, 0, 0.8, 0, g); box(1.6, 0.9, 1.2, v.glass, 0, 1.7, 0.9, g); wheels(g, [-1.0, 1.0], [-1.3, 1.3], 0.45); }
    else if (kind === 'belt') { box(1.8, 0.8, 4, v.white, 0, 0.7, 0, g); var b = box(0.9, 0.15, 7, v.grey, 0, 2.2, -1.5, g); b.rotation.x = 0.38; wheels(g, [-0.9, 0.9], [-1.3, 1.3], 0.4); }
    else if (kind === 'carts') { for (var i = 0; i < 4; i++) { box(1.5, 0.9, 2.4, v.grey, 0, 0.75, i * 3, g); box(1.4, 0.7, 2.2, [v.blue, v.red, v.white, v.yellow][i], 0, 1.4, i * 3, g); } box(1.6, 1.1, 2.2, v.yellow, 0, 0.9, -3, g); wheels(g, [-0.7, 0.7], [-3.5, -2.5], 0.35); }
    else if (kind === 'catering') { box(2.4, 1.6, 3, v.white, 0, 1.2, -2.5, g); box(2.4, 2.6, 5, v.white, 0, 3.6, 1.2, g); var lg = box(2.2, 2.0, 4.6, v.grey, 0, 1.6, 1.2, g); wheels(g, [-1.1, 1.1], [-2.6, 2.6], 0.5); var lbl = sign('FYRUS CATERING', null, 4.6, 0.6, '#ffffff', '#1b2f52'); lbl.position.set(1.22, 4.2, 1.2); lbl.rotation.y = Math.PI / 2; g.add(lbl); }
    else if (kind === 'fuel') { box(2.5, 1.8, 2.6, v.white, 0, 1.4, -4, g); var tk = cyl(1.25, 1.25, 7, 16, v.tank, 0, 1.9, 1, g); tk.rotation.x = Math.PI / 2; wheels(g, [-1.15, 1.15], [-4, 1.5, 3.4], 0.55); var fl = sign('JET A-1', null, 2.2, 0.5, '#c0262d'); fl.position.set(1.27, 2, 1); fl.rotation.y = Math.PI / 2; g.add(fl); }
    else if (kind === 'bus') { box(2.8, 2.7, 12, v.blue, 0, 1.75, 0, g); box(2.85, 1.0, 11, v.glass, 0, 2.3, 0, g); wheels(g, [-1.3, 1.3], [-4, 4], 0.5); }
    else if (kind === 'stairs') { box(2, 1, 4, v.white, 0, 0.8, 0, g); var st2 = box(1.4, 0.3, 6.2, v.grey, 0, 2.6, 0.6, g); st2.rotation.x = -0.6; wheels(g, [-0.9, 0.9], [-1.4, 1.4], 0.4); }
    else if (kind === 'fire') { box(2.8, 2.8, 9, v.red, 0, 1.9, 0, g); box(2.85, 1.0, 2.4, v.glass, 0, 2.6, -3.4, g); cyl(0.12, 0.12, 2, 6, v.white, 0, 3.6, 2, g).rotation.x = Math.PI / 2.4; wheels(g, [-1.3, 1.3], [-3, 0, 3], 0.6); }
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    mergeStatic(g); g.userData.noMerge = 1;
    return g;
  }
  API.vehicle = vehicle;
  Airport.prototype.vehicle = function (kind, x, y, z, ry) { var v = vehicle(kind); v.position.set(x, y || 0, z); v.rotation.y = ry || 0; this.group.add(v); return v; };

  // ---------------- airside: tower, hangar, cargo, fire station, fuel farm, remote stands, moving traffic ----------------
  Airport.prototype.buildAirside = function () {
    var A = this, m = mats(), g = A.group, L = A.L, sp = A.spec, hz = L.hallZ, pz = L.pierZ, gz = L.gatesZ;
    // control tower (landside, next to the terminal so it reads from the entrance)
    var tx = -42, tz = -hz - 26, th = A.big ? 34 : 24, tw = new T.Group(); tw.position.set(tx, 0, tz); g.add(tw);
    var shaft = cyl(2.6, 3.4, th, 20, m.white, 0, th / 2, 0, tw); shaft.castShadow = true;
    cyl(5.4, 4.2, 1.2, 8, m.panel, 0, th + 0.6, 0, tw);
    var cabG = new T.Mesh(new T.CylinderGeometry(5.6, 5, 3.6, 8, 1, true), new T.MeshStandardMaterial({ color: 0x5aa0c8, roughness: 0.05, metalness: 0.9, transparent: true, opacity: 0.55, side: T.DoubleSide })); cabG.position.set(0, th + 3, 0); tw.add(cabG);
    cyl(6.2, 5.8, 0.6, 8, m.dark, 0, th + 5.1, 0, tw); cyl(0.1, 0.1, 6, 6, m.steel, 1.5, th + 8, 0, tw); var tb = new T.Mesh(new T.SphereGeometry(0.3, 8, 6), m.lightR); tb.position.set(1.5, th + 11.1, 0); tb.userData.beacon = 1; tw.add(tb);
    var radar = box(4, 0.8, 0.4, m.steel, 0, th + 6.2, 0, tw); radar.userData.spin = 0.6; radar.userData.dyn = 1; A.radar = radar;
    box(10, 6, 10, m.panel, 0, 3, 0, tw).castShadow = true;
    var tws = sign(sp.code + ' TOWER', 'Air traffic control', 6, 1.4, '#10233d'); tws.position.set(5.2, 5, 0); tws.rotation.y = Math.PI / 2; tw.add(tws);
    A.wall(tx - 5.2, tx + 5.2, tz - 5.2, tz + 5.2);
    A.interact(tx + 7, 0, tz, 4, sp.code + ' control tower · watch the runway', 'tower', function () { toast(sp.code + ' Tower: runway ' + (A.rwyBusy ? 'in use' : 'clear') + ' · traffic: ' + (A.opsList || []).map(function (o) { return TYPES[o.type].name.split(' ')[0] + ' ' + o.phase; }).join(', ') + '.'); });
    // hangar with an open front towards the taxiway and a private jet inside
    var hz0 = gz[gz.length - 1] + (A.big ? 44 : 40), hw = A.big ? 46 : 38, hd = 44, hx = 50, hg = new T.Group(); hg.position.set(hx, 0, hz0 + hw / 2); g.add(hg);
    var arc = new T.Mesh(new T.CylinderGeometry(hw / 2, hw / 2, hd, 24, 1, true, 0, Math.PI), new T.MeshStandardMaterial({ color: 0xb9c2cb, roughness: 0.5, metalness: 0.6, side: T.DoubleSide }));
    arc.rotation.z = Math.PI / 2; arc.scale.set(0.62, 1, 1); arc.position.y = 0; hg.add(arc);
    var back = new T.Mesh(new T.CircleGeometry(hw / 2, 24, 0, Math.PI), new T.MeshStandardMaterial({ color: 0xa3adb7, roughness: 0.6, side: T.DoubleSide })); back.scale.y = 0.62; back.rotation.y = Math.PI / 2; back.position.x = -hd / 2; hg.add(back);
    box(hd, 0.08, hw, m.concrete, 0, 0.07, 0, hg);
    var hs = sign('FYRUS AEROTECH · MAINTENANCE', null, 18, 1.6, '#1b2f52', '#e8d5a8'); hs.position.set(hd / 2 + 0.2, hw / 2 * 0.62 - 2, 0); hs.rotation.y = Math.PI / 2; hg.add(hs);
    var bj = aircraft('bizjet'); bj.rotation.y = -Math.PI / 2; bj.position.set(hx - 2, bj.userData.gearH, hz0 + hw / 2); g.add(bj); A.aircraft.push(bj);
    A.vehicle('stairs', hx - 2 - 6, 0, hz0 + hw / 2 + 3.5, Math.PI / 2); A.vehicle('tug', hx + 9, 0, hz0 + hw / 2, Math.PI / 2);
    A.wall(hx - hd / 2, hx + hd / 2, hz0 - 0.4, hz0 + 0.4); A.wall(hx - hd / 2, hx + hd / 2, hz0 + hw - 0.4, hz0 + hw + 0.4); A.wall(hx - hd / 2 - 0.4, hx - hd / 2 + 0.4, hz0, hz0 + hw);
    // fuel farm + fire station next to the hangar
    var ff = new T.Group(); ff.position.set(21, 0, hz0 + hw / 2); g.add(ff);
    for (var i = 0; i < 3; i++) { var tk = cyl(4, 4, 7, 20, vMats().tank, 0, 3.5, (i - 1) * 10, ff); tk.castShadow = true; A.wall(17, 25, hz0 + hw / 2 + (i - 1) * 10 - 4, hz0 + hw / 2 + (i - 1) * 10 + 4); }
    var fs = new T.Group(); fs.position.set(27, 0, hz0 + hw + 14); g.add(fs);
    box(18, 7, 12, m.panel, 0, 3.5, 0, fs).castShadow = true; for (var d2 = -1; d2 <= 1; d2++) box(0.1, 5, 4.6, vMats().red, 9.05, 2.5, d2 * 4.2, fs);
    var fss = sign('AIRPORT FIRE & RESCUE', null, 12, 1.2, '#c0262d'); fss.position.set(9.1, 6.2, 0); fss.rotation.y = Math.PI / 2; fs.add(fss);
    A.vehicle('fire', 41, 0, hz0 + hw + 10, Math.PI / 2); A.wall(18, 36, hz0 + hw + 8, hz0 + hw + 20);
    // remote stands: wide-body / freighter / turboprop, with a bus and stairs; cargo terminal + ULD containers for the freighter
    (L.remote || []).forEach(function (r) {
      var ty = r[2], P = TYPES[ty], ac = aircraft(ty, { cabin: ty !== 'cargo' }); ac.rotation.y = Math.PI / 2; ac.position.set(r[0], ac.userData.gearH, r[1]); g.add(ac); A.aircraft.push(ac);
      A.vehicle('stairs', r[0] + ac.userData.doorZ, 0, r[1] + P.r + 2.4, Math.PI); A.vehicle(ty === 'cargo' ? 'tug' : 'bus', r[0] - P.len * 0.2, 0, r[1] + P.r + 12, Math.PI / 2);
      if (ty === 'cargo') {
        var ct = new T.Group(); ct.position.set(4, 0, r[1]); g.add(ct);
        box(26, 11, 40, new T.MeshStandardMaterial({ color: 0x8e99a6, roughness: 0.5, metalness: 0.5 }), 0, 5.5, 0, ct).castShadow = true;
        for (var dd = -2; dd <= 2; dd++) box(0.1, 6, 5, m.dark, 13.05, 3, dd * 7.5, ct);
        var cs = sign('FYRUS AIR CARGO', 'Cargo terminal', 14, 2, '#1b2f52', '#e8d5a8'); cs.position.set(13.1, 9, 0); cs.rotation.y = Math.PI / 2; ct.add(cs);
        A.wall(-9, 17, r[1] - 20, r[1] + 20);
        var ug = new T.BoxGeometry(1.6, 1.6, 2.2), ulds = new T.InstancedMesh(ug, new T.MeshStandardMaterial({ color: 0xa9b2bb, roughness: 0.4, metalness: 0.7 }), 24), mm = new T.Matrix4();
        for (var u = 0; u < 24; u++) { mm.makeTranslation(22 + (u % 4) * 2.2, 0.95, r[1] - 18 + Math.floor(u / 4) * 2.8); ulds.setMatrixAt(u, mm); } g.add(ulds);
      }
    });
    // moving airside traffic: a few service vehicles driving the apron service road
    A.movers = [];
    var road = L.twyX - 13, zA = gz[0] - 30, zB = gz[gz.length - 1] + 30;
    ['tug', 'fuel', 'bus', 'carts'].slice(0, A.big ? 4 : 2).forEach(function (k, i) { var v = A.vehicle(k, road, 0, 0, 0); A.movers.push({ v: v, u: i / 4, sp: 7 + i, x: road + (i % 2 ? 4 : 0) }); });
    A.updaters.push(function (dt) {
      var fa = API.flying && API.flying.ac ? A.toLocal(API.flying.ac.position.x, API.flying.ac.position.z) : null;
      A.movers.forEach(function (mv) {
        if (fa && Math.hypot(fa.x - mv.v.position.x, fa.z - mv.v.position.z) < 45) return;   // hold while a departing aircraft passes
        mv.u = (mv.u + dt * mv.sp / (2 * (zB - zA))) % 1; var f = mv.u < 0.5 ? mv.u * 2 : 2 - mv.u * 2, dir = mv.u < 0.5 ? 1 : -1;
        mv.v.position.set(mv.x + (dir < 0 ? 3.5 : 0), 0, zA + (zB - zA) * f); mv.v.rotation.y = dir > 0 ? Math.PI : 0;
      });
    });
    A.buildOps(A.big ? 'narrow' : 'turboprop', 30, 'ops1'); A.buildOps(A.big ? 'wide' : 'narrow', 0, 'ops2');
  };

  // ---------------- runway operations: one AI aircraft cycles approach -> landing -> taxi -> takeoff; runway is single-occupancy ----------------
  Airport.prototype.buildOps = function (type, startT, id) {
    var A = this, L = A.L, ac = aircraft(type); ac.visible = false; A.group.add(ac); A.aircraft.push(ac);
    var x = L.rwyX, tx = L.twyX, z0 = L.rwyZ0, z1 = L.rwyZ1, zm = (z0 + z1) / 2, gh = ac.userData.gearH, V = function (a, b, c) { return new T.Vector3(a, b, c); };
    // legs: [from, to, seconds, phase, runway?]
    var legs = [
      [V(x, 70, z0 - 900), V(x, gh, z0 + 40), 34, 'final approach', true],
      [V(x, gh, z0 + 40), V(x, gh, zm), 14, 'landing roll', true],
      [V(x, gh, zm), V(tx, gh, zm), 6, 'vacating', true],
      [V(tx, gh, zm), V(tx, gh, z0 + 20), 22, 'taxi', false],
      [V(tx, gh, z0 + 20), V(tx, gh, z0 + 20), 10, 'holding short', false],
      [V(tx, gh, z0 + 20), V(x, gh, z0 + 20), 7, 'line up', true],
      [V(x, gh, z0 + 20), V(x, gh, zm + 30), 13, 'takeoff roll', true],
      [V(x, gh, zm + 30), V(x, 160, z1 + 1100), 26, 'climb out', true],
      [V(x, 160, z1 + 1100), V(x, 160, z1 + 1100), 40, 'quiet', false]
    ];
    var o = { ac: ac, legs: legs, i: 8, t: startT || 0, phase: 'quiet', id: id, type: type }; (A.opsList = A.opsList || []).push(o); A.ops = A.opsList[0];
    A.updaters.push(function (dt) {
      var lg = o.legs[o.i];
      o.t += dt;
      if (o.t >= lg[2]) {
        var ni = (o.i + 1) % o.legs.length, nl = o.legs[ni];
        // a leg that needs the runway waits while somebody else (the player's flight) holds it
        if (nl[4] && !o.legs[o.i][4] && A.rwyBusy && A.rwyBusy !== o.id) { o.t = lg[2]; return; }
        o.i = ni; o.t = 0; lg = nl; o.phase = lg[3];
        if (lg[4]) A.rwyBusy = o.id; else if (A.rwyBusy === o.id) A.rwyBusy = null;
      }
      var u = Math.min(1, o.t / lg[2]), e = lg[3] === 'landing roll' ? 1 - Math.pow(1 - u, 2) : lg[3] === 'takeoff roll' ? u * u : u;
      var p = lg[0].clone().lerp(lg[1], e), q = lg[1].clone().sub(lg[0]);
      ac.visible = lg[3] !== 'quiet'; ac.position.copy(p);
      if (q.lengthSq() > 0.01) ac.rotation.set(lg[3] === 'climb out' ? 0.14 : lg[3] === 'final approach' ? 0.04 : 0, Math.atan2(-q.x, -q.z), 0, 'YXZ');
    });
  };

  // ---------------- perimeter: security fence around the airside (no walking onto the apron or runway) ----------------
  Airport.prototype.buildPerimeter = function () {
    var A = this, L = A.L, pz = L.pierZ, xE = L.rwyX + 28, zS = L.rwyZ0 - 30, zN = L.rwyZ1 + 30, fx = 18;
    var segs = [[fx, pz, fx, zN], [fx, -pz, fx, zS], [fx, zN, xE, zN], [fx, zS, xE, zS], [xE, zS, xE, zN]];
    var posts = [], pg = new T.CylinderGeometry(0.07, 0.07, 3, 6), mm = new T.Matrix4();
    var fenceTex = canvasTex(64, 64, function (g2, w) { g2.clearRect(0, 0, w, w); g2.strokeStyle = 'rgba(160,170,180,0.9)'; g2.lineWidth = 2; for (var k = -w; k < w * 2; k += 10) { g2.beginPath(); g2.moveTo(k, 0); g2.lineTo(k + w, w); g2.stroke(); g2.beginPath(); g2.moveTo(k + w, 0); g2.lineTo(k, w); g2.stroke(); } });
    fenceTex.wrapS = fenceTex.wrapT = T.RepeatWrapping;
    segs.forEach(function (s2) {
      var dx = s2[2] - s2[0], dz = s2[3] - s2[1], len = Math.hypot(dx, dz), t = fenceTex.clone(); t.needsUpdate = true; t.repeat.set(len / 1.2, 2.5);
      var mesh = new T.Mesh(new T.PlaneGeometry(len, 3), new T.MeshBasicMaterial({ map: t, transparent: true, side: T.DoubleSide, depthWrite: false }));
      mesh.position.set((s2[0] + s2[2]) / 2, 1.5, (s2[1] + s2[3]) / 2); mesh.rotation.y = -Math.atan2(dz, dx); A.group.add(mesh);
      for (var u = 0; u <= len; u += 4) posts.push([s2[0] + dx * u / len, s2[1] + dz * u / len]);
      A.wall(Math.min(s2[0], s2[2]) - 0.15, Math.max(s2[0], s2[2]) + 0.15, Math.min(s2[1], s2[3]) - 0.15, Math.max(s2[1], s2[3]) + 0.15, -5, 40);
    });
    var im = new T.InstancedMesh(pg, mats().steel, posts.length); posts.forEach(function (p, i) { mm.makeTranslation(p[0], 1.5, p[1]); im.setMatrixAt(i, mm); }); A.group.add(im);
    if (A.spec.platform) {   // sea-side edges of the platform: low sea wall the player cannot step off
      var px0 = -78, px1 = L.rwyX + 34, pz0 = L.rwyZ0 - 34, pz1 = L.rwyZ1 + 34;
      [[px0, pz0, px1, pz0 + 0.6], [px0, pz1 - 0.6, px1, pz1], [px1 - 0.6, pz0, px1, pz1]].forEach(function (w) { A.wall(w[0], w[2], w[1], w[3], -5, 40); box(w[2] - w[0], 1.1, w[3] - w[1], mats().concrete, (w[0] + w[2]) / 2, 0.55, (w[1] + w[3]) / 2, A.group); });
    }
  };

  // ---------------- flight information boards ----------------
  Airport.prototype.drawFids = function () {
    var A = this, rows = API.schedule(A);
    (A.fids || []).forEach(function (f) {
      var c = f.tex.userData.canvas, g = c.getContext('2d'), w = c.width, h = c.height;
      g.fillStyle = '#071425'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#f2c230'; g.font = 'bold 40px Arial'; g.textBaseline = 'middle';
      g.fillText(f.kind === 'arr' ? 'ARRIVALS' : 'DEPARTURES', 24, 36); g.fillStyle = '#9fb3c8'; g.font = '24px Arial'; g.fillText(A.spec.name + ' · ' + A.spec.code, 340, 38);
      g.fillStyle = '#9fb3c8'; g.font = 'bold 24px Arial'; ['TIME', 'FLIGHT', f.kind === 'arr' ? 'FROM' : 'TO', 'GATE', 'STATUS'].forEach(function (hd, i) { g.fillText(hd, [24, 150, 320, 700, 800][i], 92); });
      var list = rows.filter(function (r) { return f.kind === 'arr' ? r.arr : !r.arr; }).slice(0, 7);
      if (!list.length) { g.fillStyle = '#e8e6e1'; g.font = '28px Arial'; g.fillText('No scheduled flights', 24, 150); }
      list.forEach(function (r, i) {
        var y = 140 + i * 50; g.fillStyle = i % 2 ? '#0b1d33' : '#0d2340'; g.fillRect(12, y - 22, w - 24, 46);
        g.font = '28px Arial'; g.fillStyle = '#ffffff'; g.fillText(r.time, 24, y); g.fillStyle = '#f2c230'; g.fillText(r.flight, 150, y); g.fillStyle = '#ffffff'; g.fillText(r.place, 320, y); g.fillText(r.gate || '—', 700, y);
        g.fillStyle = /boarding|landed|on time/i.test(r.status) ? '#4dff88' : /n\/a|soon/i.test(r.status) ? '#ff9f6b' : '#e8e6e1'; g.fillText(r.status, 800, y);
      });
      f.tex.needsUpdate = true;
    });
    (A.gates || []).forEach(function (gt) {
      var r = rows.find(function (x) { return !x.arr && x.gate === gt.name; }), c = gt.sign.material.map.userData.canvas, g = c.getContext('2d');
      g.fillStyle = '#10233d'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#f4efe6'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 72px Arial';
      g.fillText('GATE ' + gt.name + (r ? '  ·  ' + r.flight + '  ' + r.place.toUpperCase() : '  ·  NO DEPARTURE'), c.width / 2, c.height / 2); gt.sign.material.map.needsUpdate = true;
    });
  };

  // ---------------- per-frame: doors, escalators, beacons, propellers, boards ----------------
  Airport.prototype.tick = function (dt, now, player) {
    var A = this, i;
    if (A.stepTex) A.stepTex.offset.y = (A.stepTex.offset.y - dt * 0.35) % 1;
    var pl = player ? A.toLocal(player.x, player.z) : null;
    (A.doors || []).forEach(function (d) {
      var want = pl && Math.abs(pl.x + 10) < 5 && Math.abs(pl.z - d.z) < 4 ? 1 : 0; d.open += (want - d.open) * Math.min(1, dt * 5);
      d.l.position.z = d.z - 1 - d.open * 1.9; d.r.position.z = d.z + 1 + d.open * 1.9;
    });
    var blink = (now % 1.2) < 0.12;
    A.aircraft.forEach(function (ac) { ac.children.forEach(function (o) { if (o.userData.beacon) o.visible = blink; else if (o.userData.spin) o.rotation.z += dt * 40; }); });
    if (A.radar) A.radar.rotation.y += dt * 1.2;
    for (i = 0; i < A.updaters.length; i++) { try { A.updaters[i](dt, now); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); } }
    if ((A.fidsT = (A.fidsT || 0) - dt) <= 0) { A.fidsT = 5; A.drawFids(); }
  };
  Airport.prototype.dispose = function () {
    var A = this; A.people.forEach(function (p) { try { p.inst && p.inst.dispose(); } catch (e) {} }); A.people.length = 0;
    if (A.group.parent) A.group.parent.remove(A.group);
    var shared = {}; [M, ACM, VM].forEach(function (o) { if (o) Object.keys(o).forEach(function (k) { if (o[k] && o[k].isMaterial) shared[o[k].uuid] = 1; }); });
    Object.keys(LIV).forEach(function (k) { shared[LIV[k].uuid] = 1; }); Object.keys(MARB).forEach(function (k) { shared[MARB[k].uuid] = 1; });
    var geos = {}; Object.keys(GEO).forEach(function (k) { Object.keys(GEO[k]).forEach(function (n) { geos[GEO[k][n].uuid] = 1; }); });
    A.group.traverse(function (o) {
      if (o.geometry && !geos[o.geometry.uuid]) o.geometry.dispose();
      var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      ms.forEach(function (mt) { if (shared[mt.uuid] || (mt.userData && mt.userData.keep)) return; if (mt.map && mt.map !== (M && M.tile) && mt.map !== (M && M.concreteTex) && mt.map !== (M && M.asphaltTex)) mt.map.dispose(); mt.dispose(); });
    });
    S.disposed++;
  };

  /* ======================================================================================================
   * airports, routes, tickets. Only real, playable cities get an airport (Fyrus Core + Vector Bay).
   * ====================================================================================================== */
  var SPECS = [
    { code: 'FCI', name: 'Fyrus Core International', city: 'Fyrus Core', x: 414, z: 40, ry: 0, base: 0, size: 'intl', color: 0x1b2f52 },
    { code: 'VBX', name: 'Vector Bay Airport', city: 'Vector Bay', x: -360, z: -870, ry: Math.PI, base: 4.2, size: 'regional', platform: true, color: 0x1f6f8b }
  ];
  var ROUTES = [
    { id: 'FY401', from: 'FCI', to: 'VBX', gate: 'A1', fare: 60, biz: 150, every: 20, off: 5, note: 'Across the Azure Coast to Vector Bay' },
    { id: 'FY402', from: 'VBX', to: 'FCI', gate: 'B2', fare: 60, biz: 150, every: 20, off: 15, note: 'Back to the capital' },
    { id: 'FY100', from: 'FCI', to: 'FCI', gate: 'A6', fare: 40, biz: 90, every: 15, off: 10, scenic: true, note: 'Scenic loop over the capital, lands back here' },
    { id: 'FY200', from: 'VBX', to: 'VBX', gate: 'B1', fare: 40, biz: 90, every: 15, off: 2, scenic: true, note: 'Scenic loop over the Azure Coast, lands back here' }
  ];
  API.SPECS = SPECS; API.ROUTES = ROUTES; API.airports = {};
  function spec(code) { return SPECS.find(function (s) { return s.code === code; }); }
  function route(id) { return ROUTES.find(function (r) { return r.id === id; }); }
  var ACTIVE = { booked: 1, checked: 1, cleared: 1, inflight: 1 };
  API.ticket = function () { var t = lsGet('ticket', null); return t && t.status ? t : null; };
  // 35.2: when the city server is online, tickets live on the server (bank.mjs 'bank_air'): fares, the single charge per
  // ticket id and the status are decided there; the browser keeps a copy for the frame loop and offline play.
  function net() { var O = window.__fyrusNetObj; return O && O.status === 'online' && O.ws && typeof O.send === 'function' ? O : null; }
  API.net = function () { return !!net(); };
  function netSend(x) { var O = net(); if (!O) return false; try { O.send(x); return true; } catch (e) { return false; } }
  function saveTicket(t, noSync) {
    var prev = lsGet('ticket', null); lsSet('ticket', t); API._tk = t;
    if (!noSync && t && t.srv && (!prev || prev.id !== t.id || prev.status !== t.status)) netSend({ t: 'bank_air', op: 'set', id: t.id, status: t.status });
    if (API.onChange) try { API.onChange(t); } catch (e) {}
  }
  window.__fyrusAirNet = function (e) {
    var pend = lsGet('pending', null);
    if (e.op === 'book' && pend && e.id === pend.id) {
      API._busy = false; lsSet('pending', null);
      if (e.ok && e.ticket && e.ticket.id === pend.id) { saveTicket(e.ticket, true); S.tickets = (S.tickets || 0) + 1; toast('Ticket ' + e.ticket.flight + ' ' + spec(e.ticket.from).city + ' → ' + spec(e.ticket.to).city + ' · ' + e.ticket.fare + ' FYC paid once (bank receipt). Check in at the counters.', 'xp'); }
      else if (!e.ok) toast(e.reason === 'funds' ? 'Not enough FYC in your bank account for this ticket.' : e.reason === 'active' ? 'You already hold an active ticket.' : 'The ticket could not be booked (' + e.reason + ').', 'warn');
    }
    if (e.op === 'get' || e.op === 'set' || (e.op === 'book' && !e.ok)) {
      var loc = lsGet('ticket', null), srv = e.ticket || null;
      if (srv && (!loc || loc.id !== srv.id || loc.status !== srv.status)) {
        // keep a local step that is ahead of the server only while its 'set' is on the way
        var ORDER = ['booked', 'checked', 'cleared', 'inflight', 'arrived', 'done'];
        if (loc && loc.id === srv.id && ORDER.indexOf(loc.status) > ORDER.indexOf(srv.status) && e.op !== 'set') netSend({ t: 'bank_air', op: 'set', id: loc.id, status: loc.status === 'cleared' && srv.status === 'booked' ? 'checked' : loc.status });
        else saveTicket(srv, true);
      } else if (!srv && loc && loc.srv && ACTIVE[loc.status] && e.op === 'get') { lsSet('ticket', null); API._tk = null; }
    }
    if (API.onChange) try { API.onChange(API.ticket()); } catch (x) {}
    if (API._deskOpen) try { API._deskOpen(); } catch (x) {}
  };
  function archive(t) { if (t && t.srv) netSend({ t: 'bank_air', op: 'set', id: t.id, status: t.status === 'cancelled' ? 'cancelled' : 'done' }); var h = lsGet('history', []); h.push(t); lsSet('history', h.slice(-20)); lsSet('ticket', null); API._tk = null; }
  API.cur = function () { return API._tk === undefined ? (API._tk = API.ticket()) : API._tk; };
  function pay(amount, label) {
    if (typeof window.__fyrusPay !== 'function') { toast('Payments are not available in this build.', 'warn'); return false; }
    try { return window.__fyrusPay(amount, label) === true; } catch (e) { return false; }
  }
  function charged(label) { try { var s = st(), tx = (s && s.txns) || []; return tx.some(function (x) { return x && (x.label === label || x.note === label || x.desc === label || x.reason === label || (JSON.stringify(x).indexOf(label) >= 0)); }); } catch (e) { return false; } }
  function seatFor(t) { var h = 0; String(t.id).split('').forEach(function (c) { h = (h * 31 + c.charCodeAt(0)) | 0; }); h = Math.abs(h); return t.cls === 'business' ? (1 + h % 3) + 'ACDF'[h % 4] : (8 + h % 22) + 'ABCDEF'[h % 6]; }
  // book: one active ticket per citizen; a pending marker + the wallet transaction label make a retry or a second tab safe
  API.book = function (routeId, cls) {
    var r = route(routeId); if (!r) return { ok: false, reason: 'route' };
    if (!st() || !st().session || !st().session.userId) { toast('Enter the city first.', 'warn'); return { ok: false, reason: 'session' }; }
    if (API._busy) return { ok: false, reason: 'busy' };
    var cur = API.ticket(); if (cur && ACTIVE[cur.status]) { toast('You already hold ticket ' + cur.flight + ' (' + cur.status + '). One active ticket at a time.', 'warn'); return { ok: false, reason: 'active', ticket: cur }; }
    var pend = lsGet('pending', null);
    if (pend && pend.srv) {   // an unanswered server booking: ask again with the same id (charged at most once)
      if (net()) { API._busy = true; setTimeout(function () { API._busy = false; }, 15000); netSend({ t: 'bank_air', op: 'book', id: pend.id, route: pend.route, cls: pend.cls }); return { ok: true, pending: true, id: pend.id, retry: true }; }
      return { ok: false, reason: 'pending' };
    }
    if (pend && Date.now() - pend.ts < 60000) {
      if (charged(pend.label)) { finish(pend); return { ok: true, recovered: true, ticket: API.ticket() }; }
      return { ok: false, reason: 'pending' };
    }
    cls = cls === 'business' ? 'business' : 'economy';
    if (net()) {
      var nid = 'T' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase();
      var np = { id: nid, route: r.id, cls: cls, fare: cls === 'business' ? r.biz : r.fare, ts: Date.now(), srv: true, label: 'Fyrus Airlines ' + r.id + ' ' + r.from + '-' + r.to + ' ticket ' + nid };
      lsSet('pending', np); API._busy = true; setTimeout(function () { API._busy = false; }, 15000);
      netSend({ t: 'bank_air', op: 'book', id: nid, route: r.id, cls: cls });
      return { ok: true, pending: true, id: nid };
    }
    var id = 'T' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase(), fare = cls === 'business' ? r.biz : r.fare;
    var label = 'Fyrus Airlines ' + r.id + ' ' + r.from + '-' + r.to + ' ticket ' + id;
    pend = { id: id, route: r.id, cls: cls, fare: fare, label: label, ts: Date.now() };
    API._busy = true; lsSet('pending', pend);
    var ok = false; try { ok = pay(fare, label); } finally { API._busy = false; }
    if (!ok) { lsSet('pending', null); return { ok: false, reason: 'payment' }; }
    finish(pend); S.tickets = (S.tickets || 0) + 1;
    return { ok: true, ticket: API.ticket() };
  };
  function finish(p) {
    var r = route(p.route), t = { id: p.id, flight: r.id, route: r.id, from: r.from, to: r.to, cls: p.cls, fare: p.fare, gate: r.gate, status: 'booked', bookedAt: Date.now(), payLabel: p.label };
    t.seat = seatFor(t); saveTicket(t); lsSet('pending', null);
    toast('Ticket ' + r.id + ' ' + spec(r.from).city + ' → ' + spec(r.to).city + ' · ' + p.fare + ' FYC paid once. Check in at the counters.', 'xp');
  }
  // recovery after a reload: a pending purchase with a matching wallet line becomes the ticket (never charged twice);
  // a ticket left "inflight" by a closed tab is marked arrived (the flight is used, no second flight on it)
  API.recover = function () {
    var p = lsGet('pending', null);
    if (p && p.srv) { if (net()) netSend({ t: 'bank_air', op: 'book', id: p.id, route: p.route, cls: p.cls }); }
    else if (net()) netSend({ t: 'bank_air', op: 'get' });
    if (p && !p.srv) { if (charged(p.label)) finish(p); else if (Date.now() - p.ts > 60000) lsSet('pending', null); }
    var t = API.ticket();
    if (t && t.status === 'inflight' && !API.flying) { t.status = 'arrived'; t.arrivedAt = Date.now(); t.note = 'landed while you were away'; saveTicket(t); }
  };
  API.cancel = function () {
    var t = API.ticket(); if (!t) return false;
    if (t.status !== 'booked') { toast('Only a ticket that is not checked in yet can be cancelled.', 'warn'); return false; }
    t.status = 'cancelled'; archive(t); toast('Ticket ' + t.flight + ' cancelled (fares are non-refundable).'); return true;
  };
  API.schedule = function (A) {
    var now = new Date(), mins = now.getHours() * 60 + now.getMinutes(), rows = [], t = API.ticket();
    var fmt = function (m) { m = ((m % 1440) + 1440) % 1440; return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); };
    ROUTES.forEach(function (r) {
      var next = Math.ceil((mins - r.off + 1) / r.every) * r.every + r.off, left = next - mins;
      var mine = t && t.flight === r.id && ACTIVE[t.status];
      if (r.from === A.code) rows.push({ time: fmt(next), flight: r.id, place: r.scenic ? 'Scenic loop' : spec(r.to).city, gate: r.gate, status: mine && t.status !== 'booked' ? 'Boarding' : left <= 6 ? 'Boarding' : 'On time', arr: false });
      if (r.to === A.code && !r.scenic) rows.push({ time: fmt(next + 6), flight: r.id, place: spec(r.from).city, gate: '', status: left > 14 ? 'Landed' : 'Expected', arr: true });
    });
    rows.push({ time: '—', flight: '—', place: 'Other cities', gate: '', status: 'Coming soon', arr: false });
    return rows.sort(function (a, b) { return a.time < b.time ? -1 : 1; });
  };

  /* ---------------- desks: tickets / info overlay, check-in, passport, shops, baggage ---------------- */
  function css() {
    if (document.getElementById('a35-css')) return;
    var s = document.createElement('style'); s.id = 'a35-css';
    s.textContent = '.a35-ov{position:fixed;inset:0;z-index:9000;background:rgba(5,10,20,.55);display:flex;align-items:center;justify-content:center;font:14px system-ui,-apple-system,Segoe UI,sans-serif;color:#eef1f5}' +
      '.a35-card{width:min(560px,94vw);max-height:86vh;overflow:auto;background:#0f1a2e;border:1px solid #2a3b57;border-radius:14px;padding:18px 18px 14px;box-shadow:0 18px 60px rgba(0,0,0,.5)}' +
      '.a35-card h2{margin:0 0 2px;font-size:19px;color:#e8d5a8}.a35-card h3{margin:16px 0 6px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#9fb3c8}.a35-sub{color:#9fb3c8;font-size:12.5px}' +
      '.a35-row{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:9px;background:#14223b;margin:6px 0}.a35-row b{color:#fff}.a35-row .g{flex:1;min-width:0}.a35-row i{font-style:normal;color:#9fb3c8;font-size:12px;display:block}' +
      '.a35-btn{background:#c9a96e;color:#111;border:0;border-radius:8px;padding:7px 11px;font-weight:600;cursor:pointer;font-size:13px;white-space:nowrap}.a35-btn.alt{background:#2b3a55;color:#e8eef6}.a35-btn[disabled]{opacity:.45;cursor:not-allowed}' +
      '.a35-x{float:right;background:none;border:0;color:#9fb3c8;font-size:22px;cursor:pointer;line-height:1}.a35-pass{background:linear-gradient(135deg,#f6f2e8,#e9e2d0);color:#1b2f52;border-radius:12px;padding:14px 16px;margin-top:8px;font-weight:600}' +
      '.a35-pass .big{font-size:30px;font-weight:800;letter-spacing:.04em}.a35-pass .k{font-size:10.5px;color:#6b7280;text-transform:uppercase;letter-spacing:.08em}.a35-pass .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}' +
      '.a35-skip{position:fixed;right:18px;bottom:96px;z-index:8000;background:rgba(15,26,46,.88);color:#e8d5a8;border:1px solid #c9a96e;border-radius:10px;padding:9px 14px;font:600 13px system-ui;cursor:pointer}' +
      '.a35-phase{position:fixed;left:50%;top:84px;transform:translateX(-50%);z-index:8000;background:rgba(15,26,46,.8);color:#eef1f5;border-radius:10px;padding:7px 14px;font:600 13px system-ui;pointer-events:none}';
    document.head.appendChild(s);
  }
  function el(tag, attrs, kids) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'onclick') e.onclick = attrs[k]; else if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }); (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }); return e; }
  function modal(build) {
    css(); var ov = el('div', { 'class': 'a35-ov fxp-ov', role: 'dialog', 'aria-modal': 'true' }), card = el('div', { 'class': 'a35-card' }); ov.appendChild(card);
    var close = function () { ov.remove(); document.removeEventListener('keydown', esc, true); API._modal = null; API._deskOpen = null; };
    var esc = function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); }); document.addEventListener('keydown', esc, true);
    ['keydown', 'keyup'].forEach(function (k) { ov.addEventListener(k, function (e) { if (e.key !== 'Escape') e.stopPropagation(); }); });
    if (API._modal) API._modal(); API._modal = close;
    card.appendChild(el('button', { 'class': 'a35-x', 'aria-label': 'Close', onclick: close, text: '×' }));
    build(card, close); document.body.appendChild(ov); return close;
  }
  function wallet() { try { var s = st(); return (s.wallets || {})[s.session.userId] || 0; } catch (e) { return 0; } }
  function passCard(t) {
    var f = spec(t.from), to = spec(t.to);
    return el('div', { 'class': 'a35-pass' }, [
      el('div', { style: 'display:flex;justify-content:space-between' }, [el('span', { text: 'FYRUS AIRLINES · BOARDING PASS' }), el('span', { text: t.cls.toUpperCase() })]),
      el('div', { style: 'display:flex;align-items:center;gap:14px;margin-top:8px' }, [el('span', { 'class': 'big', text: f.code }), el('span', { text: '✈' }), el('span', { 'class': 'big', text: to.code }), el('span', { style: 'margin-left:auto;font-size:12px', text: route(t.route).scenic ? 'Scenic loop' : f.city + ' → ' + to.city })]),
      el('div', { 'class': 'grid' }, [['Flight', t.flight], ['Gate', t.gate], ['Seat', t.seat], ['Status', t.status]].map(function (kv) { return el('div', null, [el('div', { 'class': 'k', text: kv[0] }), el('div', { text: kv[1] })]); }))
    ]);
  }
  API.openDesk = function (A, tab) {
    modal(function (card, close) {
      var t = API.ticket();
      card.appendChild(el('h2', { text: A.spec.name + ' · ' + A.code }));
      card.appendChild(el('div', { 'class': 'a35-sub', text: 'Fyrus Airlines ticket desk · wallet ' + wallet() + ' FYC · fares are charged once, non-refundable' }));
      if (tab === 'info') {
        card.appendChild(el('h3', { text: 'How to fly' }));
        ['1 · Buy a ticket here, at a kiosk or the ticket office.', '2 · Check in at the Fyrus Airlines counters: you get a boarding pass, seat and gate.', '3 · Security: the lanes open with a checked-in boarding pass.', '4 · Escalators up to the gates · duty free, Sky Café and the Prestige Lounge.', '5 · At your gate walk through the jet bridge and board the aircraft.', '6 · On arrival: arrivals hall, baggage belt 1, customs, taxi or bus.'].forEach(function (x) { card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g', text: x })])); });
      }
      API._deskOpen = function () { close(); API.openDesk(A, tab); };
      card.appendChild(el('h3', { text: 'Your ticket' }));
      var pd = lsGet('pending', null);
      if (pd && pd.srv && !t) card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g', text: 'Payment in progress at the Central Bank… (' + pd.route + ', ' + pd.fare + ' FYC)' })]));
      if (t) {
        card.appendChild(passCard(t));
        var acts = el('div', { style: 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap' });
        if (t.status === 'booked') acts.appendChild(el('button', { 'class': 'a35-btn alt', text: 'Cancel ticket (no refund)', onclick: function () { if (API.cancel()) { close(); API.openDesk(A, tab); } } }));
        if (t.status === 'arrived' || t.status === 'done') acts.appendChild(el('button', { 'class': 'a35-btn alt', text: 'Archive this trip', onclick: function () { t.status = 'done'; archive(t); close(); API.openDesk(A, tab); } }));
        card.appendChild(acts);
      } else card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g', text: 'No ticket yet.' })]));
      card.appendChild(el('h3', { text: 'Departures from ' + A.code }));
      var holds = (t && ACTIVE[t.status]) || (pd && pd.srv);
      ROUTES.filter(function (r) { return r.from === A.code; }).forEach(function (r) {
        var row = el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g' }, [el('b', { text: r.id + ' · ' + (r.scenic ? 'Scenic loop' : spec(r.from).city + ' → ' + spec(r.to).city) }), el('i', { text: r.note + ' · gate ' + r.gate + ' · every ' + r.every + ' min' })])]);
        [['economy', r.fare], ['business', r.biz]].forEach(function (c) {
          var b = el('button', { 'class': 'a35-btn' + (c[0] === 'business' ? ' alt' : ''), text: (c[0] === 'business' ? 'Business ' : 'Economy ') + c[1] + ' FYC' });
          if (holds) b.disabled = true;
          b.onclick = function () { if (b.disabled) return; b.disabled = true; var res = API.book(r.id, c[0]); if (res.ok) { close(); API.openDesk(A, tab); } else b.disabled = false; };
          row.appendChild(b);
        });
        card.appendChild(row);
      });
      if (A.code === 'FCI') {
        card.appendChild(el('h3', { text: 'Air tours to city districts' }));
        card.appendChild(el('div', { 'class': 'a35-sub', text: 'Short hops that land at a district (there is no airport there). Paid at boarding.' }));
        [['coast', 'Sea View coast', 60], ['market', 'Market City', 60], ['tech', 'Tech City', 60]].forEach(function (x) {
          card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g' }, [el('b', { text: 'Fyrus Air Tours · ' + x[1] }), el('i', { text: 'takes off from runway 18/36' })]), el('button', { 'class': 'a35-btn alt', text: x[2] + ' FYC · fly now', onclick: function () { close(); var Wd = window.__fyrusW; if (Wd && Wd.startFlight) Wd.startFlight(x[0]); } })]));
        });
      }
      card.appendChild(el('h3', { text: 'Other cities' }));
      card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g' }, [el('b', { text: 'More Fyrus cities' }), el('i', { text: 'Not built yet — no airport and no route until a city opens.' })]), el('button', { 'class': 'a35-btn', disabled: 'disabled', text: 'Not available' })]));
    });
  };
  API.checkIn = function (A) {
    var t = API.ticket();
    if (!t || !ACTIVE[t.status]) { toast('No ticket yet — buy one at the ticket office or a kiosk.'); return API.openDesk(A); }
    if (t.from !== A.code) { toast('Your flight ' + t.flight + ' departs from ' + spec(t.from).name + ', not here.', 'warn'); return; }
    if (t.status === 'booked') { t.status = 'checked'; t.checkedAt = Date.now(); saveTicket(t); toast('Checked in · ' + t.flight + ' · gate ' + t.gate + ' · seat ' + t.seat + '. Security is straight ahead.', 'xp'); }
    modal(function (card) { card.appendChild(el('h2', { text: 'Boarding pass' })); card.appendChild(passCard(t)); card.appendChild(el('div', { 'class': 'a35-sub', style: 'margin-top:10px', text: 'Security lanes open with this pass. Gates are upstairs (escalators behind security).' })); });
  };
  API.gateDesk = function (A, name) {
    var t = API.ticket(), r = ROUTES.find(function (x) { return x.from === A.code && x.gate === name; });
    if (t && t.from === A.code && t.gate === name && ACTIVE[t.status]) toast('Gate ' + name + ': ' + t.flight + ' is boarding. Walk down the jet bridge to the aircraft door.', 'xp');
    else toast('Gate ' + name + (r ? ' · ' + r.id + ' to ' + (r.scenic ? 'scenic loop' : spec(r.to).city) : '') + '. Only passengers with a boarding pass for this flight may board.');
  };
  API.immigration = function (A) { toast('Passport control · flights between Fyrus cities are domestic — no passport check. International counters open with the first foreign route.'); };
  API.lowSpec = function () { try { var s2 = st(), q = s2 && s2.settings && s2.settings.quality; if (q === 'low' || q === 'mobile') return true; return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } };
  API.lift = function (A, x, y, z) {
    var Wd = window.__fyrusW; if (!Wd || Wd.trip) return;
    var p = A.toWorld(x, 0, z); Wd.teleport({ x: p.x, z: p.z }); Wd.player.root.position.y = (A.spec.base || 0) + y; Wd.player.vel.set(0, 0, 0);
    toast(y > PH + 1 ? 'Sky Gallery · restaurants, First Class Lounge and the panorama deck' : 'Level 1 · gates and shopping gallery');
  };
  var SHOP = { cafe: [['Flat white', 4], ['Croissant', 3], ['Fyrus date cake', 5]], mart: [['Water', 2], ['Travel pillow', 8], ['Phone charger', 9]], dutyfree: [['Fyrus perfume', 25], ['Chocolate box', 7], ['Souvenir orb', 12]], skycafe: [['Espresso', 3], ['Fyrus dates', 4], ['Sandwich', 6]], gallery: [['Gift card', 10], ['Silk scarf', 35], ['Signature item', 60]], restaurant: [['Chef\'s set menu', 18], ['Main course', 12], ['Dessert & coffee', 6]] };
  API.shopBuy = function (A, id, title) {
    var items = SHOP[id] || [];
    modal(function (card, close) {
      card.appendChild(el('h2', { text: title })); card.appendChild(el('div', { 'class': 'a35-sub', text: 'Wallet ' + wallet() + ' FYC' }));
      items.forEach(function (it) { var b = el('button', { 'class': 'a35-btn', text: it[1] + ' FYC' }); b.onclick = function () { if (b.disabled) return; b.disabled = true; if (pay(it[1], title + ' · ' + it[0] + ' (' + A.code + ')')) { toast('Enjoy your ' + it[0].toLowerCase() + '!', 'xp'); close(); } else b.disabled = false; };
        card.appendChild(el('div', { 'class': 'a35-row' }, [el('div', { 'class': 'g' }, [el('b', { text: it[0] })]), b])); });
    });
  };
  API.collectBag = function (A) {
    var t = API.ticket();
    if (t && t.status === 'arrived' && t.to === A.code) { t.status = 'done'; t.bagAt = Date.now(); archive(t); toast('Bag collected from belt 1. Welcome to ' + A.spec.city + '!', 'xp'); }
    else toast('No bag for you on belt 1 right now.');
  };

  /* ---------------- boarding + flight: cabin -> pushback -> taxi -> takeoff -> cruise -> approach -> landing -> arrivals ---------------- */
  API.board = function (A, name) {
    var t = API.ticket(), Wd = window.__fyrusW;
    if (!t || !ACTIVE[t.status] || t.status === 'inflight') { toast('You need a checked-in boarding pass for this gate.', 'warn'); return; }
    if (t.from !== A.code || t.gate !== name) { toast('This is gate ' + name + '. Your flight ' + t.flight + ' boards at gate ' + t.gate + (t.from !== A.code ? ' in ' + spec(t.from).city : '') + '.', 'warn'); return; }
    if (t.status === 'booked') { toast('Check in first (Fyrus Airlines counters).', 'warn'); return; }
    if (API.flying || !Wd || Wd.trip || Wd.vehicle) { toast('Boarding is not possible right now.', 'warn'); return; }
    API.fly(A, t);
  };
  function V3(x, y, z) { return new T.Vector3(x, y, z); }
  API.fly = function (A, t) {
    var Wd = window.__fyrusW, r = route(t.route), B = ensureBuilt(spec(r.to));
    if (!B) { toast('The destination airport could not be prepared.', 'warn'); return; }
    var gate = A.gates.find(function (g) { return g.name === t.gate; }) || A.gates[0], type = gate.type, P = TYPES[type];
    t.status = 'inflight'; t.boardedAt = Date.now(); saveTicket(t);
    var ac = aircraft(type, { cabin: true }), gh = ac.userData.gearH, cab = ac.userData.cabin; keepLook(ac); Wd.world.add(ac); gate.ac.visible = false;
    API.flying = { A: A, B: B, t: t, ac: ac };
    var LA = A.L, LB = B.L;
    // waypoints in each airport's local frame, converted to world; each leg: [toPoint, seconds, phase, ease, cam]
    var w = function (Ap, x, y, z) { return Ap.toWorld(x, y, z); };
    var zmA = (LA.rwyZ0 + LA.rwyZ1) / 2, zmB = (LB.rwyZ0 + LB.rwyZ1) / 2;
    var start = w(A, gate.Xac, gh, gate.Zac), legs = [];
    var add = function (p, sec, phase, ease, cam) { legs.push({ p: p, sec: sec, phase: phase, ease: ease || 'lin', cam: cam || 'chase' }); };
    add(start.clone(), 7, 'Boarding · welcome aboard ' + t.flight, 'lin', 'cabin');
    add(w(A, gate.Xac + 14, gh, gate.Zac), 6, 'Pushback', 'io', 'chase', true);
    add(w(A, LA.twyX, gh, gate.Zac), 5, 'Taxi', 'io');
    add(w(A, LA.twyX, gh, LA.rwyZ0 + 20), Math.max(6, Math.abs(gate.Zac - LA.rwyZ0 - 20) / 16), 'Taxi to runway 36', 'lin');
    add(w(A, LA.rwyX, gh, LA.rwyZ0 + 20), 5, 'Line up runway 36', 'io');
    add(w(A, LA.rwyX, gh, zmA + 40), 9, 'Takeoff roll', 'in');
    add(w(A, LA.rwyX, 70, LA.rwyZ1 + 260), 9, 'Climb', 'lin', 'wing');
    if (r.scenic) {
      var c = A.toWorld(LA.rwyX - 300, 0, zmA), rr = 420;
      [0.5, 1.2, 1.9, 2.6].forEach(function (a) { add(V3(c.x + Math.cos(a + (A.spec.ry || 0)) * rr, 150, c.z + Math.sin(a + (A.spec.ry || 0)) * rr), 7, 'Scenic flight over ' + A.spec.city, 'lin', a > 1.5 ? 'wing' : 'cabinwin'); });
    } else {
      var a0 = w(A, LA.rwyX, 150, LA.rwyZ1 + 600), b0 = w(B, LB.rwyX, 150, LB.rwyZ0 - 900);
      add(a0, 5, 'Cruise · ' + spec(r.to).city, 'lin', 'cabinwin');
      var dist = a0.distanceTo(b0); add(b0.clone().lerp(a0, 0.5).setY(180), Math.max(5, dist / 2 / 90), 'Cruise · ' + spec(r.to).city, 'lin', 'cabinwin');
      add(b0, Math.max(5, dist / 2 / 90), 'Descent', 'lin', 'wing');
    }
    add(w(B, LB.rwyX, 60, LB.rwyZ0 - 600), 6, 'Final approach · ' + B.code, 'lin', 'chase');
    add(w(B, LB.rwyX, gh, LB.rwyZ0 + 40), 12, 'Final approach · ' + B.code, 'lin', 'chase');
    add(w(B, LB.rwyX, gh, zmB), 11, 'Landing · welcome to ' + B.spec.city, 'out', 'chase');
    add(w(B, LB.twyX, gh, zmB), 6, 'Taxi to the terminal', 'io', 'chase');
    // timing
    var tot = 0, prev = start; legs.forEach(function (l) { l.a = prev; l.t0 = tot; tot += l.sec; l.t1 = tot; prev = l.p; });
    var ease = function (k, u) { return k === 'io' ? u * u * (3 - 2 * u) : k === 'in' ? u * u : k === 'out' ? 1 - (1 - u) * (1 - u) : u; };
    var posAt = function (tt) { for (var i = 0; i < legs.length; i++) { var l = legs[i]; if (tt <= l.t1 || i === legs.length - 1) { var u = Math.max(0, Math.min(1, (tt - l.t0) / l.sec)); return { p: l.a.clone().lerp(l.p, ease(l.ease, u)), l: l, i: i }; } } };
    var fwd = new T.Vector3(), q0 = new T.Vector3(), last = start.clone(), lastDir = A.toWorld(-1, 0, 0).sub(A.toWorld(0, 0, 0)), camP = new T.Vector3(), camL = new T.Vector3();
    var yaw = null, holdA = false, holdB = false, phaseEl = null, skipEl = null, mult = 1, tt = 0, lastT = 0;
    css(); phaseEl = el('div', { 'class': 'a35-phase' }); document.body.appendChild(phaseEl);
    skipEl = el('button', { 'class': 'a35-skip', text: 'Speed up ×4', onclick: function () { mult = mult === 1 ? 4 : 1; skipEl.textContent = mult === 1 ? 'Speed up ×4' : 'Normal speed'; } }); document.body.appendChild(skipEl);
    var proxy = new T.Group();   // the city's trip system disposes its object; our aircraft shares geometry, so hand it an empty proxy
    Wd.beginTrip('flight', 'Fyrus Airlines ' + t.flight + ' · ' + A.code + ' → ' + B.code, tot / 1, function (tReal) {
      var dt = Math.max(0, tReal - lastT); tt = Math.min(tot, tt + dt * mult); if (Wd.trip) Wd.trip.t = tt; lastT = tt;
      var s = posAt(tt), p = s.p, l = s.l;
      // runway holds: departure runway from line-up to climb, arrival runway from final approach to vacating
      var onA = s.i >= 4 && s.i <= 6, onB = /Final approach|Landing/.test(l.phase);
      if (onA && !holdA) { holdA = true; A.rwyBusy = 'player'; } if (!onA && holdA && s.i > 6) { holdA = false; if (A.rwyBusy === 'player') A.rwyBusy = null; }
      if (onB && !holdB) { holdB = true; B.rwyBusy = 'player'; }
      var nx = posAt(Math.min(tot, tt + 0.6)).p; fwd.copy(nx).sub(p);
      if (s.i <= 1) fwd.copy(lastDir);                                       // boarding + pushback: nose keeps pointing at the terminal
      if (fwd.lengthSq() > 0.0004) { lastDir.copy(fwd).normalize(); }
      var want = Math.atan2(-lastDir.x, -lastDir.z), pitch = Math.atan2(lastDir.y, Math.hypot(lastDir.x, lastDir.z));
      if (yaw === null) yaw = want; else { var dy = Math.atan2(Math.sin(want - yaw), Math.cos(want - yaw)), lim = dt * mult * (p.y > gh + 2 ? 0.7 : 1.0); yaw += Math.max(-lim, Math.min(lim, dy)); }
      var bank = 0; if (s.i > 0) { q0.copy(posAt(Math.min(tot, tt + 2)).p).sub(nx); var cr = lastDir.x * q0.z - lastDir.z * q0.x; bank = Math.max(-0.4, Math.min(0.4, cr * 0.004)); }
      ac.position.copy(p); ac.rotation.set(Math.max(-0.12, Math.min(0.2, pitch)), yaw, -bank, 'YXZ'); last.copy(p);
      if (phaseEl.textContent !== l.phase) phaseEl.textContent = l.phase;
      var R = P.r, Ln = P.len;
      cab.visible = l.cam === 'cabin' || l.cam === 'cabinwin';
      var cf = ac.userData.cabinFloor, cz = ac.userData.cabinZ;
      if (l.cam === 'cabin') { var uw = Math.max(0, Math.min(1, (tt - l.t0) / l.sec)); camP.set(0, cf + 1.6, cz[0] + 0.6 + uw * (cz[1] - cz[0]) * 0.35); camL.set(0, cf + 1.0, cz[1]); }
      else if (l.cam === 'cabinwin') { var wz2 = -Ln / 2 + Ln * P.wingX + Ln * 0.06; camP.set(-R * 0.45, R * 0.2, wz2); camL.set(-R * 4, -R * 0.4, wz2 - R * 1.2); }
      else if (l.cam === 'wing') { camP.set(-P.span * 0.55, R * 1.4, Ln * 0.2); camL.set(0, 0, -Ln * 0.2); }
      else { camP.set(0, R * 3 + 6, Ln * 0.5 + 34); camL.set(0, R, -Ln * 0.3); }
      ac.updateMatrixWorld(true); camP.applyMatrix4(ac.matrixWorld); camL.applyMatrix4(ac.matrixWorld);
      if (l.cam === 'cabin' || l.cam === 'cabinwin') Wd.camera.position.copy(camP);   // the city camera eases towards the trip camera; inside the cabin it must sit exactly in the seat
      return { pos: camP.clone(), look: camL.clone(), body: p.clone().setY(Math.max(0, p.y - 1)) };
    }, function () {
      try { ac.parent && ac.parent.remove(ac); } catch (e) {}
      gate.ac.visible = true; if (A.rwyBusy === 'player') A.rwyBusy = null; if (B.rwyBusy === 'player') B.rwyBusy = null;
      phaseEl.remove(); skipEl.remove();
      var tk = API.ticket(); if (tk && tk.id === t.id) { tk.status = 'arrived'; tk.arrivedAt = Date.now(); saveTicket(tk); }
      API.flying = null; S.flights++;
      var sp2 = B.arrivalSpawn, pw = B.toWorld(sp2.x, 0, sp2.z), fw = B.toWorld(sp2.face.x, 0, sp2.face.z);
      try { Wd.teleport({ x: pw.x, z: pw.z, face: { x: fw.x, z: fw.z } }); Wd.player.target = null; Wd.player.vel.set(0, 0, 0); Wd.player.root.position.y = B.ground(pw.x, pw.z) || 0; } catch (e) {}
      toast('Welcome to ' + B.spec.name + '. Passport control is open; collect your bag at belt 1.', 'xp');
    }, proxy);
  };

  /* ---------------- Human32 staff and passengers (limited count, LOD + culling from the human runtime) ---------------- */
  Airport.prototype.floorH = function (x, z, y) { var h = this.levelAt(x, z, y == null ? null : y); return h === null ? 0 : h; };
  Airport.prototype.spawnPeople = function () {
    var A = this, H = window.__fyrusHuman32, L = A.L, hz = L.hallZ, pz = L.pierZ, big = A.big, az0 = 11.6, az1 = hz;
    if (!H || !H.create || Q.get('h32off') === '1' || Q.get('a35people') === '0') return;
    var list = [], n = 0;
    var staff = function (x, z, face, role) { list.push({ x: x, z: z, face: face, role: role }); };
    var walker = function (pts, role, sp) { list.push({ pts: pts, role: role, sp: sp || 1.25 }); };
    var isl = big ? [[-52, -32], [-26, -12], [12, 26], [32, 48]] : [[-24, -12], [12, 24]];
    isl.forEach(function (s) { staff(-3.55, s[0] + 3, -Math.PI / 2, 'agent'); staff(-3.55, s[1] - 3, -Math.PI / 2, 'agent'); });
    staff(2.3, -7.7, -Math.PI / 2, 'security'); staff(2.3, 7.7, -Math.PI / 2, 'security');
    staff(-3.5, 0.3, -Math.PI / 2, 'agent');
    staff(-5.1, hz - 8, -Math.PI / 2, 'shop'); staff(21.8, 18, -Math.PI / 2, 'shop');
    staff(4.0, az0 + 3.1, Math.PI, 'officer'); staff(10.6, az0 + 3.1, Math.PI, 'officer');
    A.gates.forEach(function (g) { staff(28.15, g.z - 1.2, -Math.PI / 2, 'agent'); staff(g.Xac + 6, g.Zac - TYPES[g.type].r - 4, Math.PI / 2, 'ramp'); });
    walker([[-9, -hz + 16], [-9, hz - 6]], 'pax'); walker([[-7.6, 28], [-7.6, -28]], 'pax', 1.1); walker([[-9.3, hz - 10], [-9.3, -hz + 20]], 'pax', 1.35);
    walker([[25.5, -pz + 16], [25.5, pz - 8]], 'pax'); walker([[25.6, pz - 12], [25.6, -pz + 20]], 'crew', 1.3); walker([[25.4, pz - 6], [25.4, -pz + 24]], 'crew', 1.3);
    if (big) { walker([[14, az0 + 2], [14, az1 - 2]], 'pax', 1.0); walker([[24.8, -60], [24.8, 60]], 'pax', 1.15); }
    // passengers boarding through the jet bridges (one way: they enter the aircraft and the next one starts at the gate)
    A.gates.slice(0, big ? 3 : 2).forEach(function (gt, k) { for (var n2 = 0; n2 < 2; n2++) { walker([[25.5, gt.z - 7 - n2 * 2], [28.6, gt.Zb], [gt.doorX - 1.0, gt.Zb - 0.3], [gt.doorX, gt.Zb - 1.7]], 'pax', 1.05 + n2 * 0.15); list[list.length - 1].board = true; list[list.length - 1].lvl = PH; } });
    if (A.L.L2) { walker([[20.5, -44], [20.5, 22]], 'pax', 1.0); list[list.length - 1].lvl = L2H; walker([[21.8, 26], [21.8, -40]], 'pax', 1.2); list[list.length - 1].lvl = L2H; }
    if (API.lowSpec()) list = list.filter(function (d, i) { return i % 2 === 0; });   // phones / low quality: half the people
    var uni = { agent: { outfit: 'formal', top: '#1b2f52', bottom: '#1b2333', top2: '#eeeeea' }, security: { outfit: 'formal', top: '#2b2f36', bottom: '#22252b', top2: '#dfe6ee' }, officer: { outfit: 'formal', top: '#123a5c', bottom: '#1b2333', top2: '#eeeeea' },
      shop: { outfit: 'base', top: '#7a1f2a', bottom: '#2d3646' }, ramp: { outfit: 'sport', top: '#d8f02a', bottom: '#2d3646' }, crew: { outfit: 'formal', top: '#0f1a2e', bottom: '#0f1a2e', top2: '#ffffff' }, pax: null };
    list.forEach(function (d, i) {
      var look = H.lookFromOutfit({ gender: (i * 7 + A.code.length) % 3 === 0 ? 'f' : 'm' }, 'a35-' + A.code + '-' + i), u = uni[d.role];
      if (u) { Object.keys(u).forEach(function (k) { look[k] = u[k]; }); if (d.role !== 'pax') look.hairStyle = look.sex === 'f' ? 'bun' : 'short'; } else look.outfit = ['base', 'sport', 'formal'][i % 3];
      look.near = 9; look.far = 40; look.hide = 70;
      var rec = { d: d, inst: null, i: 0, x: d.pts ? d.pts[0][0] : d.x, z: d.pts ? d.pts[0][1] : d.z, wait: 0 }; rec.y = d.lvl != null ? d.lvl : (rec.x > 16.1 ? PH : 0);
      A.people.push(rec);
      setTimeout(function () {
        if (A.disposedFlag) return;
        H.create(look).then(function (inst) {
          if (A.disposedFlag) { inst.dispose(); return; }
          rec.inst = inst; rec.y = A.floorH(rec.x, rec.z, rec.y); inst.group.position.set(rec.x, rec.y, rec.z); inst.group.rotation.y = d.face || 0; A.group.add(inst.group); S.people++;
        }).catch(function () { S.peopleFailed = (S.peopleFailed || 0) + 1; });
      }, 120 * i);
    });
  };
  Airport.prototype.tickPeople = function (dt, camPos) {
    var A = this;
    A.people.forEach(function (r) {
      var inst = r.inst; if (!inst) return; var sp = 0, d = r.d;
      if (d.pts) {
        if (r.wait > 0) r.wait -= dt;
        else {
          var tg = d.pts[(r.i + 1) % d.pts.length], dx = tg[0] - r.x, dz = tg[1] - r.z, dl = Math.hypot(dx, dz);
          if (dl < 0.3) { r.i = (r.i + 1) % d.pts.length; r.wait = 1.5 + Math.random() * 3; if (d.board && r.i === d.pts.length - 1) { r.i = 0; r.x = d.pts[0][0]; r.z = d.pts[0][1]; r.y = PH; r.wait = 3 + Math.random() * 6; } }
          else { sp = d.sp; r.x += dx / dl * sp * dt; r.z += dz / dl * sp * dt; var yaw = Math.atan2(dx, dz), cy = inst.group.rotation.y; inst.group.rotation.y = cy + Math.atan2(Math.sin(yaw - cy), Math.cos(yaw - cy)) * Math.min(1, dt * 6); }
          r.y = A.floorH(r.x, r.z, r.y); inst.group.position.set(r.x, r.y, r.z);
        }
      }
      try { inst.lod.update(dt, camPos, 0, sp, 0); } catch (e) {}
    });
  };

  /* ======================================================================================================
   * manager: lazy build/dispose by distance, engine hooks, old airport retired
   * ====================================================================================================== */
  function footprint(sp) { var big = sp.size !== 'regional', L = big ? { x0: -80, x1: 160, z0: -235, z1: 365 } : { x0: -80, x1: 145, z0: -210, z1: 270 }; return L; }
  function inFoot(sp, X, Z, pad) { var c = Math.cos(sp.ry || 0), s = Math.sin(sp.ry || 0), dx = X - sp.x, dz = Z - sp.z, x = dx * c - dz * s, z = dx * s + dz * c, f = footprint(sp); pad = pad || 0; return x > f.x0 - pad && x < f.x1 + pad && z > f.z0 - pad && z < f.z1 + pad ? { x: x, z: z } : null; }
  API.inFoot = inFoot;
  // the city's cinematic pass would repaint plain standard materials as building facades (procedural windows):
  // airport materials keep their own look
  function keepLook(root) { root.traverse(function (o) { var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; ms.forEach(function (mt) { mt.userData = mt.userData || {}; if (!mt.userData.c18) mt.userData.c18 = 'a35'; }); }); }
  API.keepLook = keepLook;
  function ensureBuilt(sp) {
    if (!sp) return null; if (API.airports[sp.code]) return API.airports[sp.code];
    var Wd = window.__fyrusW; T = window.THREE; if (!Wd || !Wd.world || !T) return null;
    var t0 = performance.now(), A = new Airport(sp);
    try { A.build(); } catch (e) { S.errors++; S.lastError = 'build ' + sp.code + ': ' + (e && e.message); console.warn('[air35] build failed', e); return null; }
    try { mergeStatic(A.group); } catch (e) { S.errors++; S.lastError = 'merge: ' + (e && e.message); }
    keepLook(A.group); Wd.world.add(A.group); API.airports[sp.code] = A;
    A.spawnPeople(); A.drawFids();
    S.built++; S.buildMs = Math.round(performance.now() - t0); S.lastBuilt = sp.code;
    return A;
  }
  function disposeAirport(code) {
    var A = API.airports[code], Wd = window.__fyrusW; if (!A) return;
    A.disposedFlag = true;
    A.dispose(); delete API.airports[code];
  }
  API.build = ensureBuilt; API.dispose = disposeAirport;
  API.go = function (code) { var sp = spec(code), A = ensureBuilt(sp), Wd = window.__fyrusW; if (!A || !Wd) return false; var p = A.toWorld(-14, 0, 6), f = A.toWorld(0, 0, 6); Wd.teleport({ x: p.x, z: p.z, face: { x: f.x, z: f.z } }); return true; };

  var installedFor = null;
  function install(Wd) {
    installedFor = Wd;
    // retire the old 150 m airstrip: hidden, its colliders and check-in interact removed (its flights now leave from FCI)
    try { if (Wd.runway) { Wd.runway.group.visible = false; Wd.runway.colliders.length = 0; Wd.runway.interacts.length = 0; Wd.refreshLmInteracts && Wd.refreshLmInteracts(); } } catch (e) {}
    // keep procedural blocks and traffic out of the airport footprints
    var zones = [];
    // 40 m cells with r = 29 circles; the landside edge stops at local X -50 so the ring road (r = 350) keeps its traffic
    SPECS.forEach(function (sp) { if (sp.platform) return; var f = footprint(sp); for (var x = -30; x < f.x1 + 20; x += 40) for (var z = f.z0 + 30; z < f.z1 + 10; z += 40) { var p = { x: sp.x + x * Math.cos(sp.ry || 0) + z * Math.sin(sp.ry || 0), z: sp.z - x * Math.sin(sp.ry || 0) + z * Math.cos(sp.ry || 0) }; zones.push({ x: p.x, z: p.z, r: 29, a35: sp.code }); } });
    API.zones = zones;
    try { var orig = Wd.blocked.bind(Wd); Wd.blocked = function (s) { return zones.concat(orig(s)); }; if (Wd.sigs) Wd.sigs.blocked = ''; Wd.lastChunk = ''; } catch (e) {}
    var prevG = window.__fyrusGround, prevC = window.__fyrusCollide, prevS = window.__fyrusSolid, prevW = window.__fyrusWet, prevR = window.__fyrusRegion;
    window.__fyrusGround = function (X, Z) {
      var pl = window.__fyrusW && window.__fyrusW.player && window.__fyrusW.player.root.position, py = pl && Math.abs(pl.x - X) < 0.01 && Math.abs(pl.z - Z) < 0.01 ? pl.y : (API._yHint != null ? API._yHint : null);
      for (var k in API.airports) { var A = API.airports[k]; if (inFoot(A.spec, X, Z)) { var g = A.ground(X, Z, py); if (g != null) return g; } }
      for (var i = 0; i < SPECS.length; i++) if (SPECS[i].platform && inFoot(SPECS[i], X, Z, -4)) return SPECS[i].base;
      return prevG ? prevG(X, Z) : null;
    };
    window.__fyrusCollide = function (e) { for (var k in API.airports) { var A = API.airports[k]; if (inFoot(A.spec, e.x, e.z, 2)) A.collide(e); } if (prevC) prevC(e); };
    window.__fyrusSolid = function (X, Z) { for (var i = 0; i < SPECS.length; i++) { var p = inFoot(SPECS[i], X, Z, 4); if (p && p.x > -14) return true; } return prevS ? prevS(X, Z) : false; };
    window.__fyrusWet = function (X, Z) { for (var i = 0; i < SPECS.length; i++) if (SPECS[i].platform && inFoot(SPECS[i], X, Z, -4)) return false; return prevW ? prevW(X, Z) : null; };
    // interactions are offered per floor (the engine measures them in plan only): only those on the player's level
    var prevX = window.__fyrusExtraInteracts;
    API.interacts = function () { var out = [], pl = Wd.player && Wd.player.root.position; for (var k in API.airports) { var A = API.airports[k]; if (!pl || !inFoot(A.spec, pl.x, pl.z, 10)) continue; A.interacts.forEach(function (it) { if (Math.abs(it.pos.y - pl.y) < 2.6) out.push(it); }); } return out; };
    window.__fyrusExtraInteracts = function () { var a = API.interacts(); return prevX ? a.concat(prevX() || []) : a; };
    var prevP = window.__fyrusNoProps;
    window.__fyrusNoProps = function (X, Z) { for (var i = 0; i < SPECS.length; i++) { var q = inFoot(SPECS[i], X, Z, 2); if (q && q.x > -56) return true; } return prevP ? prevP(X, Z) : false; };
    window.__fyrusRegion = function (X, Z) { for (var i = 0; i < SPECS.length; i++) if (inFoot(SPECS[i], X, Z)) return { key: 'airport:' + SPECS[i].code, name: SPECS[i].name }; return prevR ? prevR(X, Z) : null; };
    API.recover();
  }
  var lastNow = 0, camV = null, plV = null;
  function frame(now) {
    requestAnimationFrame(frame);
    var Wd = window.__fyrusW; if (!Wd || !Wd.player || !window.THREE) { lastNow = now; return; }
    T = window.THREE; W = Wd;
    if (installedFor !== Wd) { Object.keys(API.airports).forEach(function (k) { delete API.airports[k]; }); install(Wd); }
    var dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0; lastNow = now;
    if (Wd.active !== Wd.world) return;
    var p = Wd.player.root.position;
    camV = camV || new T.Vector3(); if (Wd.camera) Wd.camera.getWorldPosition(camV); else camV.copy(p);
    SPECS.forEach(function (sp) {
      var c = sp.x + 30 * Math.cos(sp.ry || 0), cz = sp.z - 30 * Math.sin(sp.ry || 0), d = Math.hypot(p.x - c, p.z - cz), A = API.airports[sp.code];
      var flyingHere = API.flying && (API.flying.A.code === sp.code || API.flying.B.code === sp.code);
      if (!A && d < 650) A = ensureBuilt(sp);
      else if (A && d > 950 && !flyingHere) { disposeAirport(sp.code); A = null; }
      if (!A) return;
      A.group.visible = d < 2400 || flyingHere;
      try { A.tick(dt, now / 1000, p); A.tickPeople(dt, camV); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
      // security: a checked-in passenger who reaches the airside level is cleared
      var t = API.cur();
      if (t && t.status === 'checked' && t.from === sp.code) { var lp = A.toLocal(p.x, p.z); if (lp.x > 16.2 && p.y > (sp.base || 0) + PH - 1) { t.status = 'cleared'; t.clearedAt = Date.now(); saveTicket(t); toast('Security cleared · gate ' + t.gate + ' · follow the signs.', 'xp'); } }
    });
    if ((API._tkT = (API._tkT || 0) - dt) <= 0) { API._tkT = 2; API._tk = API.ticket(); var on = API.net(); if (on && !API._wasOn) API.recover(); API._wasOn = on; }
  }
  requestAnimationFrame(frame);
})();
