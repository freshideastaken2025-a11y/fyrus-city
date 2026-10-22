/* Fyrus — Vector Bay, a real city inside the Fyrus world (v1.0)
   Vector Bay used to be a separate web page. Now it is built into the same world as Fyrus Core:
   it lies across the water, south of the Sea View coast (centre about x 400, z -1000).
   - you arrive with your own avatar (flight from Transit, search "Vector Bay", or /?go=vector-bay)
   - the Fyrus HUD, chat, wallet, map, weather and 4D sky all keep working
   - other citizens who are here are visible (same world, same multiplayer)
   - marble promenade, arcaded residences, gilded twin towers, hillside villas, marina with yachts,
     the old citadel of House Maren with waving banners and torches, galleons in the bay
   - walking: promenade, quays and pontoons are solid; buildings block you; the sea lets you swim
   - the people strolling here are AI residents (said on arrival)
   - boutiques open the 3D stores, the marina office starts an evening cruise, the terminal flies you home
   The engine hooks used: window.__fyrusGround / __fyrusWet / __fyrusCollide / __fyrusSolid / __fyrusRegion.
   API: window.__fyrusVB.go(), .landing, .inside(), .state() */
(function () {
  'use strict';
  if (window.__fyrusVB) return;
  var API = window.__fyrusVB = { version: '1.1.0' };
  var OX = 400, OZ = -810;                         /* local (0,0) of the bay in world coordinates */
  var LAND = { lx: -70, lz: -150 };                /* arrival point on the promenade */
  API.landing = { x: OX + LAND.lx, z: OZ + LAND.lz, face: { x: OX + 60, z: OZ + LAND.lz + 10 } };
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var phone = (function () { try { return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } })();
  function low() { var s = S(); return phone || (s && s.settings && s.settings.quality === 'low'); }

  /* ---------- random + noise (same seed as the original Vector Bay) ---------- */
  var seed = 20402040;
  function rnd() { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  function R(a, b) { return a + (b - a) * rnd(); }
  function hash(x, y) { var h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967296; }
  function vnoise(x, y) { var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi; var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf); var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
  function fbm(x, y, o) { o = o || 4; var s = 0, a = .5, f = 1, n = 0; for (var i = 0; i < o; i++) { s += a * vnoise(x * f, y * f); n += a; a *= .5; f *= 2.03; } return s / n; }
  function ridged(x, y, o) { o = o || 5; var s = 0, a = .5, f = 1, n = 0; for (var i = 0; i < o; i++) { var v = 1 - Math.abs(vnoise(x * f, y * f) * 2 - 1); s += a * v * v; n += a; a *= .5; f *= 2.1; } return s / n; }
  function sstep(a, b, x) { var t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); }

  /* ---------- geography (local coordinates) ---------- */
  function shoreX(z) { return -60 - Math.max(0, z - 150) * .7; }
  function isQuay(x, z) { return (z > -446 && z < 152 && x < -30 && x > -140) || (z < -420 && z > -470 && x > -75 && x < 72); }
  function landSD(x, z) {
    var dL = shoreX(z) - x, dB = Math.min(-440 - z, 380 - x);
    var ex = (x - 235) / 165, ez = (z + 330) / 125, dP = (1 - Math.hypot(ex, ez)) * 125;
    var dF = -1500 - z, ix = (x - 950) / 170, iz = (z + 700) / 85, dI = (1 - Math.hypot(ix, iz)) * 85;
    var d = Math.max(dL, dB, dP, dF, dI);
    if (dI < d) d = Math.min(d, 250 - z, x + 820);   /* the bay is an island: sea to the north (towards Fyrus Core) and west */
    return { d: d, dP: dP, dI: dI };
  }
  function terrainH(x, z) {
    var L = landSD(x, z), d = L.d, q = isQuay(x, z);
    if (!q) d += (fbm(x * .009, z * .009, 3) - .5) * 46;
    if (d < 0) return q ? -7 : Math.max(-16, d * .12);
    var h = q ? 2.4 : 2.4 * sstep(0, 34, d), inland = d - 140;
    if (inland > 0) h += inland * .14 * sstep(0, 160, inland) + fbm(x * .006, z * .006, 4) * 60 * sstep(0, 300, inland);
    if (d > 560) h += ridged(x * .0014 + 7, z * .0014 + 3, 5) * 420 * sstep(560, 1500, d);
    if (L.dP > 0) h += 27 * sstep(8, 60, L.dP) + fbm(x * .05, z * .05, 2) * 3 * sstep(8, 40, L.dP);
    if (L.dI > 0) h += 40 * sstep(0, 70, L.dI) * (.6 + .6 * fbm(x * .02, z * .02, 3));
    return h;
  }
  /* walkable decks */
  var DECKS = [{ x0: -81, x1: -60, z0: -445, z1: 155, y: 2.62 }, { x0: -78, x1: 72, z0: -461, z1: -440, y: 2.62 }];
  for (var pz = -400; pz < 140; pz += 30) DECKS.push({ x0: -60, x1: -26, z0: pz - 1.3, z1: pz + 1.3, y: .8 });
  function groundL(x, z) {
    for (var i = 0; i < DECKS.length; i++) { var k = DECKS[i]; if (x >= k.x0 && x <= k.x1 && z >= k.z0 && z <= k.z1) return k.y; }
    return terrainH(x, z);
  }
  function inBox(x, z) { return x > -830 && x < 1160 && z > -1010 && z < 262; }

  /* ---------- solid footprints (oriented rectangles, local) on a 40 m grid ---------- */
  var RECTS = [], GRID = new Map(), CELL = 40;
  function addRect(cx, cz, w, d, ry) {
    var r = { cx: cx, cz: cz, hx: w / 2, hz: d / 2, c: Math.cos(ry || 0), s: Math.sin(ry || 0) };
    RECTS.push(r);
    var rad = Math.hypot(r.hx, r.hz) + 1;
    for (var gx = Math.floor((cx - rad) / CELL); gx <= Math.floor((cx + rad) / CELL); gx++)
      for (var gz = Math.floor((cz - rad) / CELL); gz <= Math.floor((cz + rad) / CELL); gz++) {
        var key = gx + ',' + gz, l = GRID.get(key); if (!l) GRID.set(key, l = []); l.push(r);
      }
  }
  function rectsAt(x, z) { return GRID.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || null; }
  function pushOut(p, x, z, pad) {
    var l = rectsAt(x, z); if (!l) return false;
    var hit = false;
    for (var i = 0; i < l.length; i++) {
      var r = l[i], dx = x - r.cx, dz = z - r.cz;
      var ux = dx * r.c - dz * r.s, uz = dx * r.s + dz * r.c;      /* into rect frame */
      var ox = r.hx + pad - Math.abs(ux), oz = r.hz + pad - Math.abs(uz);
      if (ox > 0 && oz > 0) {
        hit = true; if (!p) return true;
        if (ox < oz) ux += (ux >= 0 ? 1 : -1) * ox; else uz += (uz >= 0 ? 1 : -1) * oz;
        var nx = ux * r.c + uz * r.s, nz = -ux * r.s + uz * r.c;     /* back to local */
        x = r.cx + nx; z = r.cz + nz;
      }
    }
    if (p && hit) { p.x = x + OX; p.z = z + OZ; }
    return hit;
  }

  /* ---------- engine hooks (only inside the bay; everywhere else the city behaves as before) ---------- */
  var prevG = window.__fyrusGround, prevW = window.__fyrusWet, prevC = window.__fyrusCollide, prevS = window.__fyrusSolid, prevR = window.__fyrusRegion;
  window.__fyrusGround = function (X, Z) { var x = X - OX, z = Z - OZ; if (inBox(x, z)) { var g = groundL(x, z); return g < .05 ? -.55 : g; } return prevG ? prevG(X, Z) : null; };
  window.__fyrusWet = function (X, Z) { var x = X - OX, z = Z - OZ; if (inBox(x, z)) return groundL(x, z) < .05; return prevW ? prevW(X, Z) : null; };
  window.__fyrusCollide = function (p) { var x = p.x - OX, z = p.z - OZ; if (inBox(x, z)) pushOut(p, x, z, .35); if (prevC) prevC(p); };
  window.__fyrusSolid = function (X, Z) { var x = X - OX, z = Z - OZ; if (inBox(x, z)) return pushOut(null, x, z, 1); return prevS ? prevS(X, Z) : false; };
  var greeted = false;
  window.__fyrusRegion = function (X, Z) {
    var x = X - OX, z = Z - OZ;
    if (inBox(x, z)) {
      if (groundL(x, z) <= .05) return { key: 'city:vector-bay', name: 'Vector Bay · the bay' };
      if (!greeted) { greeted = true; setTimeout(function () { toast('Welcome to Vector Bay · the people strolling here are AI residents. Citizens you meet are real.'); }, 600); }
      return { key: 'city:vector-bay', name: 'Vector Bay · The Azure Coast' };
    }
    return prevR ? prevR(X, Z) : null;
  };
  API.inside = function () { var W = window.__fyrusW; if (!W || !W.player) return false; var p = W.player.root.position; return inBox(p.x - OX, p.z - OZ); };

  function toast(msg) {
    try { if (window.__fyrusPlus && window.__fyrusPlus.toast) return window.__fyrusPlus.toast(msg); } catch (e) {}
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 76px);transform:translateX(-50%);z-index:2147482500;max-width:min(92vw,520px);padding:10px 16px;border-radius:14px;background:rgba(10,15,26,.9);border:1px solid rgba(201,169,110,.45);color:#f4efe6;font:600 13px Sora,sans-serif;text-align:center;box-shadow:0 12px 40px rgba(0,0,0,.4);transition:opacity .4s';
    document.body.appendChild(t); setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 450); }, 4200);
  }

  /* =====================================================================================
     BUILD (runs in small steps so the game never freezes)
     ===================================================================================== */
  var T = null, W = null, root = null, built = false, building = false, MAT = null, FX = null;
  function cnv(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
  function tex(c, rep) { var t = new T.CanvasTexture(c); if (rep !== false) t.wrapS = t.wrapT = T.RepeatWrapping; if (T.sRGBEncoding) t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t; }
  function marbleTex(N) {
    var a = cnv(N, N), c = a[0], g = a[1]; var img = g.createImageData(N, N), D = img.data, k = 1024 / N;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var X = x * k, Y = y * k, n = fbm(X / 140, Y / 140, 4), v = Math.abs(Math.sin((X + Y * .6) / 70 + n * 9));
      var vein = Math.pow(1 - v, 14) * .55 + Math.pow(1 - Math.abs(Math.sin((X * .3 - Y) / 41 + n * 6)), 30) * .3, i = (y * N + x) * 4, s = (vnoise(X / 9, Y / 9) - .5) * 12;
      D[i] = 236 + s - vein * 70; D[i + 1] = 228 + s - vein * 66; D[i + 2] = 214 + s - vein * 50; D[i + 3] = 255;
    }
    g.putImageData(img, 0, 0); g.strokeStyle = 'rgba(120,105,85,.35)'; g.lineWidth = 2 / k;
    for (var i2 = 0; i2 <= N; i2 += N / 4) { g.beginPath(); g.moveTo(i2, 0); g.lineTo(i2, N); g.stroke(); g.beginPath(); g.moveTo(0, i2); g.lineTo(N, i2); g.stroke(); }
    return tex(c);
  }
  function travTex(N) {
    var a = cnv(N, N), c = a[0], g = a[1], img = g.createImageData(N, N), D = img.data, k = 512 / N;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) { var X = x * k, Y = y * k, band = fbm(X / 160, Y / 6, 3), pore = vnoise(X / 2.2, Y / 1.4) > .93 ? -26 : 0, i = (y * N + x) * 4, b = (band - .5) * 22 + pore; D[i] = 228 + b; D[i + 1] = 214 + b; D[i + 2] = 192 + b * .8; D[i + 3] = 255; }
    g.putImageData(img, 0, 0); g.strokeStyle = 'rgba(110,92,70,.28)'; g.lineWidth = 1.5 / k; var q = N / 4;
    for (var yy = 0; yy <= N; yy += q) { g.beginPath(); g.moveTo(0, yy); g.lineTo(N, yy); g.stroke(); }
    for (var y2 = 0; y2 < N; y2 += q) for (var x2 = (y2 / q) % 2 ? 0 : q; x2 <= N; x2 += 2 * q) { g.beginPath(); g.moveTo(x2, y2); g.lineTo(x2, y2 + q); g.stroke(); }
    return tex(c);
  }
  function glazingTex(N) {
    var a = cnv(N, N), c = a[0], g = a[1], b = cnv(N, N), e = b[0], ge = b[1]; ge.fillStyle = '#000'; ge.fillRect(0, 0, N, N);
    var bw = N / 8, fh = N / 8, k = N / 1024;
    for (var fy = 0; fy < 8; fy++) for (var bx = 0; bx < 8; bx++) {
      var x = bx * bw, y = fy * fh, gr = g.createLinearGradient(0, y, 0, y + fh); gr.addColorStop(0, '#3a3f46'); gr.addColorStop(1, '#22262c'); g.fillStyle = gr; g.fillRect(x, y, bw, fh);
      var lit = rnd(); if (lit < .62) {
        var warm = lit < .5, al = R(.35, 1), lg = ge.createLinearGradient(0, y + 10 * k, 0, y + fh);
        lg.addColorStop(0, warm ? 'rgba(255,214,150,' + al + ')' : 'rgba(255,236,205,' + al * .7 + ')'); lg.addColorStop(1, warm ? 'rgba(255,170,90,' + al * .75 + ')' : 'rgba(240,210,170,' + al * .5 + ')');
        ge.fillStyle = lg; ge.fillRect(x + 6 * k, y + 8 * k, bw - 12 * k, fh - 14 * k);
        ge.fillStyle = 'rgba(0,0,0,.55)'; if (rnd() < .6) ge.fillRect(x + (6 + R(0, 60)) * k, y + 8 * k, R(18, 50) * k, fh - 14 * k);
        g.fillStyle = 'rgba(120,95,60,.45)'; g.fillRect(x + 6 * k, y + 8 * k, bw - 12 * k, fh - 14 * k);
      }
      g.fillStyle = '#8c7350'; g.fillRect(x, y, 5 * k, fh); g.fillRect(x, y, bw, 7 * k); g.fillRect(x + bw / 2 - 1, y, 2 * k, fh);
    }
    return [tex(c), tex(e)];
  }
  function arcadeTex(trav) {
    var a = cnv(1024, 512), c = a[0], g = a[1], b = cnv(1024, 512), e = b[0], ge = b[1]; ge.fillStyle = '#000'; ge.fillRect(0, 0, 1024, 512);
    g.drawImage(trav.image, 0, 0, 1024, 512);
    for (var i = 0; i < 4; i++) {
      var x = i * 256 + 40, w = 176, top = 70, bot = 512;
      var path = function (ctx) { ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x, top + w / 2); ctx.arc(x + w / 2, top + w / 2, w / 2, Math.PI, 0); ctx.lineTo(x + w, bot); ctx.closePath(); };
      path(g); g.fillStyle = '#2a2018'; g.fill(); g.lineWidth = 10; g.strokeStyle = '#c9b48f'; g.stroke();
      path(ge); var gr = ge.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, '#ffcf8a'); gr.addColorStop(.6, '#ffb768'); gr.addColorStop(1, '#ff9e48'); ge.fillStyle = gr; ge.fill();
      ge.fillStyle = 'rgba(0,0,0,.6)'; for (var k = 0; k < 3; k++) ge.fillRect(x + 20 + k * 52, 330, 26, 120);
      g.fillStyle = 'rgba(40,30,20,.35)'; for (var k2 = 0; k2 < 3; k2++) g.fillRect(x + 20 + k2 * 52, 330, 26, 120);
    }
    return [tex(c), tex(e)];
  }
  function bannerTex() {
    var a = cnv(256, 640), c = a[0], g = a[1];
    g.fillStyle = '#16244a'; g.fillRect(0, 0, 256, 600);
    var gr = g.createLinearGradient(0, 0, 256, 0); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(.5, 'rgba(255,255,255,.04)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(0, 0, 256, 600);
    g.strokeStyle = '#d4b06a'; g.lineWidth = 7; g.strokeRect(14, 10, 228, 570); g.fillStyle = '#d4b06a';
    for (var x = 6; x < 256; x += 12) g.fillRect(x, 600, 5, 34);
    var cx = 128, cy = 270; g.beginPath(); g.arc(cx, cy, 44, Math.PI, 0); g.fill();
    for (var i = 0; i <= 10; i++) { var an = Math.PI + i * Math.PI / 10; g.save(); g.translate(cx + Math.cos(an) * 54, cy + Math.sin(an) * 54); g.rotate(an + Math.PI / 2); g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.lineTo(0, -26); g.fill(); g.restore(); }
    g.lineWidth = 9; g.strokeStyle = '#d4b06a';
    for (var k = 0; k < 3; k++) { g.beginPath(); for (var xx = 50; xx <= 206; xx += 2) { var yy = cy + 22 + k * 24 + Math.sin((xx - 50) / 156 * Math.PI * 3) * 7; if (xx === 50) g.moveTo(xx, yy); else g.lineTo(xx, yy); } g.stroke(); }
    return tex(c, false);
  }
  function sailTex() {
    var a = cnv(256, 256), c = a[0], g = a[1]; g.fillStyle = '#1b2850'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#d4b06a'; g.beginPath(); g.arc(128, 120, 34, Math.PI, 0); g.fill(); g.lineWidth = 7; g.strokeStyle = '#d4b06a';
    for (var k = 0; k < 3; k++) { g.beginPath(); for (var x = 74; x <= 182; x += 2) { var y = 140 + k * 18 + Math.sin((x - 74) / 108 * Math.PI * 3) * 5; if (x === 74) g.moveTo(x, y); else g.lineTo(x, y); } g.stroke(); }
    return tex(c, false);
  }
  function frondTex() {
    var a = cnv(128, 512), c = a[0], g = a[1];
    for (var i = 0; i < 62; i++) { var y = 6 + i * 8.1, len = 60 * Math.sin(Math.PI * (.1 + .9 * i / 62)) + 6; g.strokeStyle = 'rgb(' + (52 + R(0, 25) | 0) + ',' + (92 + R(0, 30) | 0) + ',' + (38 + R(0, 15) | 0) + ')'; g.lineWidth = 7;
      g.beginPath(); g.moveTo(64, y); g.quadraticCurveTo(64 - len * .6, y + 6, 64 - len, y + 22); g.stroke(); g.beginPath(); g.moveTo(64, y); g.quadraticCurveTo(64 + len * .6, y + 6, 64 + len, y + 22); g.stroke(); }
    g.strokeStyle = '#5c5a2e'; g.lineWidth = 4; g.beginPath(); g.moveTo(64, 0); g.lineTo(64, 512); g.stroke();
    return tex(c, false);
  }
  function radialTex(stops) { var a = cnv(128, 128), c = a[0], g = a[1], gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); stops.forEach(function (s) { gr.addColorStop(s[0], s[1]); }); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return tex(c, false); }
  function envMap() {
    try {
      var sc = new T.Scene(), geo = new T.SphereGeometry(10, 32, 16);
      var m = new T.ShaderMaterial({ side: T.BackSide, vertexShader: 'varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader: 'varying vec3 vP; void main(){ float h = normalize(vP).y; vec3 sky = mix(vec3(1.0,.82,.62), vec3(.35,.55,.85), smoothstep(0.,.6,h)); vec3 gr = vec3(.22,.2,.18); vec3 c = h > 0. ? sky : mix(vec3(.9,.75,.6), gr, smoothstep(0.,-.3,h)); float sun = pow(max(dot(normalize(vP), normalize(vec3(.6,.25,-.5))),0.), 60.); gl_FragColor = vec4(c + vec3(1.,.8,.55)*sun*4., 1.); }' });
      sc.add(new T.Mesh(geo, m));
      var pm = new T.PMREMGenerator(W.renderer), rt = pm.fromScene(sc, .02); pm.dispose(); geo.dispose(); m.dispose();
      return rt.texture;
    } catch (e) { return null; }
  }

  /* geometry lists, merged by material and by 160 m cell (so the camera and shadows can skip far parts) */
  var lists = {};
  function prep(g) {
    var n = g.index ? g.toNonIndexed() : g;
    Object.keys(n.attributes).forEach(function (k) { if (k !== 'position' && k !== 'normal' && k !== 'uv') n.deleteAttribute(k); });
    if (!n.attributes.normal) n.computeVertexNormals();
    if (!n.attributes.uv) n.setAttribute('uv', new T.BufferAttribute(new Float32Array(n.attributes.position.count * 2), 2));
    return n;
  }
  function push(key, g) {
    g = prep(g); g.computeBoundingSphere(); var c = g.boundingSphere.center;
    var k = key + '|' + Math.floor(c.x / 160) + ',' + Math.floor(c.z / 160);
    (lists[k] || (lists[k] = [])).push(g);
  }
  function merge(arr) {
    var n = 0; arr.forEach(function (g) { n += g.attributes.position.count; });
    var P = new Float32Array(n * 3), N = new Float32Array(n * 3), U = new Float32Array(n * 2), o = 0;
    arr.forEach(function (g) { var c = g.attributes.position.count; P.set(g.attributes.position.array, o * 3); N.set(g.attributes.normal.array, o * 3); U.set(g.attributes.uv.array, o * 2); o += c; g.dispose(); });
    var out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(P, 3)); out.setAttribute('normal', new T.BufferAttribute(N, 3)); out.setAttribute('uv', new T.BufferAttribute(U, 2));
    out.computeBoundingSphere(); return out;
  }
  var _m, _q, _s, _p, _e;
  function boxUV(g, w, h, d, tu, tv) { var uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]]; for (var f = 0; f < 6; f++) for (var k = 0; k < 4; k++) { var i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / tu, uv.getY(i) * dims[f][1] / tv); } return g; }
  function box(key, w, h, d, x, y, z, ry, tu, tv, M) {
    var g = new T.BoxGeometry(w, h, d); if (tu) boxUV(g, w, h, d, tu, tv);
    _m.compose(_p.set(x, y, z), _q.setFromEuler(_e.set(0, ry || 0, 0)), _s.set(1, 1, 1)); g.applyMatrix4(_m); if (M) g.applyMatrix4(M); push(key, g);
  }
  function scaleUV(g, su, sv) { var uv = g.attributes.uv; for (var i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); return g; }
  function inst(geo, mat, list, opts) {
    opts = opts || {}; if (!list.length) return null;
    var im = new T.InstancedMesh(geo, mat, list.length), o = new T.Object3D();
    list.forEach(function (t, i) { o.position.set(t[0], t[1], t[2]); o.rotation.set(0, t[3] || 0, 0); var s = t[4] || 1; o.scale.set(s * (t[5] || 1), s * (t[6] || 1), s * (t[5] || 1)); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
    im.castShadow = opts.cast !== false && !low(); im.receiveShadow = true; im.computeBoundingSphere && im.computeBoundingSphere(); root.add(im); return im;
  }

  var cafeSpots = [], shopFronts = [], towerSpots = [], torches = [], banners = [], galleons = [], people = [], seated = [];
  var bannerMat = null, flagT = { value: 0 };
  var FLOOR = 3.4;
  function buildBlock(ox, oz, ry, len, depth, floors, opt) {
    opt = opt || {};
    var M = new T.Matrix4().compose(new T.Vector3(ox, 2.6, oz), new T.Quaternion().setFromEuler(new T.Euler(0, ry, 0)), new T.Vector3(1, 1, 1));
    var B = function (key, w, h, d, x, y, z, tu, tv) { box(key, w, h, d, x, y, z, 0, tu, tv, M); };
    var gh = 5.2, y = 0;
    B(opt.arcade ? 'arcade' : 'glaze', depth - 1, gh, len - 1, -depth / 2 - .5, gh / 2, 0, opt.arcade ? 24 : 32, opt.arcade ? 7 : 27.2 * gh / 3.6);
    if (!opt.arcade) B('gold', 2.6, .18, len - 2, 1.0, gh - .4, 0);
    B('stone', depth, .8, len, -depth / 2, gh + .4, 0, 4, 4); y = gh + .8;
    for (var i = 1; i < floors; i++) {
      var sb = i >= floors - 2 && floors > 4 ? (i - (floors - 3)) * 3 : 0, balc = 2.2;
      B('glaze', depth - 1.2 - sb, FLOOR - .5, len - 1.2, -depth / 2 - .6 - sb / 2, y + (FLOOR - .5) / 2, 0, 32, 27.2);
      B('stone', depth + balc - sb, .5, len, -depth / 2 + balc / 2 - sb / 2, y + FLOOR - .25, 0, 4, 4);
      B('gold', .12, .14, len, balc - sb + .02, y + FLOOR - .28, 0);
      B('glass', .06, 1.05, len - .4, balc - sb - .1, y + FLOOR + .5, 0);
      for (var k = -len / 2; k <= len / 2 + .01; k += len / Math.max(2, Math.round(len / 9))) B('stone', depth + .4 - sb, FLOOR - .5, .7, -depth / 2 + .2 - sb / 2, y + (FLOOR - .5) / 2, k);
      if (rnd() < .35) { var kk = R(-len / 2 + 2, len / 2 - 2); B('vine', .5, R(1.5, 3), R(2, 5), balc - sb - .2, y + FLOOR - 1.4, kk); }
      if (rnd() < .5) B('hedge', .9, .8, len * .6, balc - sb - .7, y + FLOOR + .4, R(-2, 2));
      y += FLOOR;
    }
    B('stone', depth - 4, 1.0, len - 4, -depth / 2 - 2, y + .5, 0, 4, 4);
    for (var q = 0; q < 4; q++) B('green', R(2, 4), R(1.5, 3), R(2, 4), -R(4, depth - 4), y + 1.5, R(-len / 2 + 3, len / 2 - 3));
    /* footprint: block frame x in [-depth, -0.3], z in [-len/2, len/2] */
    var c = new T.Vector3(-depth / 2 - .15, 0, 0).applyMatrix4(M);
    addRect(c.x, c.z, depth - .3, len, ry);
  }
  function tower(x, z, r, H) {
    var y0 = terrainH(x, z) - 1;
    var core = new T.CylinderGeometry(r, r, H, low() ? 24 : 40, 1, true); scaleUV(core, 2 * Math.PI * r / 32, H / 27.2); core.translate(x, y0 + H / 2, z); push('tower', core);
    for (var y = 10.2; y < H; y += 10.2) { var s = new T.CylinderGeometry(r + .7, r + .7, .55, low() ? 24 : 40); s.translate(x, y0 + y, z); push('stone', s); }
    var fins = low() ? 12 : 22; for (var i = 0; i < fins; i++) { var a = i / fins * Math.PI * 2; box('gold', 1.3, H - 2, .35, x + Math.cos(a) * (r + .45), y0 + H / 2, z + Math.sin(a) * (r + .45), -a); }
    var crown = new T.CylinderGeometry(r + 1, r + .7, 9, 40, 1, true); crown.translate(x, y0 + H + 3, z); push('gold', crown);
    var lid = new T.CylinderGeometry(r, r, .6, 32); lid.translate(x, y0 + H - .5, z); push('stone', lid);
    for (var k = 0; k < 6; k++) { var aa = rnd() * 6.28, rr = R(0, r * .6), t = new T.IcosahedronGeometry(R(1.8, 3.2), 1); t.scale(1, 1.3, 1); t.translate(x + Math.cos(aa) * rr, y0 + H + R(1, 3.5), z + Math.sin(aa) * rr); push('green', t); }
    var pod = new T.BoxGeometry(r * 3.2, 12, r * 3.2); boxUV(pod, r * 3.2, 12, r * 3.2, 4, 4); pod.translate(x, y0 + 6, z); push('stone', pod);
    addRect(x, z, r * 3.2, r * 3.2, 0);
  }
  function twin(x, z, h1, h2, r) { r = r || 12; tower(x, z, r, h1); tower(x + r * 2.3, z - r * .8, r * .9, h2); var b = new T.BoxGeometry(r * 1.6, 6, 5); b.translate(x + r * 1.15, terrainH(x, z) + h2 * .62, z - r * .4); push('glaze', b); towerSpots.push([x, z, h1]); }

  function terrainMesh(w, h, sx, sz, cx, cz) {
    var g = new T.PlaneGeometry(w, h, sx, sz); g.rotateX(-Math.PI / 2);
    var p = g.attributes.position, col = new Float32Array(p.count * 3);
    for (var i = 0; i < p.count; i++) {
      var x = p.getX(i) + cx, z = p.getZ(i) + cz, y = terrainH(x, z); if (y < -3) y = -3;
      p.setXYZ(i, x, y, z);
      var L = landSD(x, z), n = fbm(x * .02, z * .02, 3), r, gg, b;
      if (y < .6) { r = .62; gg = .56; b = .46; }
      else if (isQuay(x, z)) { r = .60 + n * .08; gg = .56 + n * .07; b = .50 + n * .05; }
      else if (L.d < 30 && y < 4) { r = .84 + n * .06; gg = .75 + n * .05; b = .58 + n * .04; }
      else { var dry = fbm(x * .004 + 9, z * .004, 3); r = .16 + dry * .26; gg = .24 + dry * .16; b = .10 + dry * .10;
        var rock = sstep(120, 320, y); r = r * (1 - rock) + (.46 + n * .1) * rock; gg = gg * (1 - rock) + (.43 + n * .08) * rock; b = b * (1 - rock) + (.42 + n * .08) * rock;
        var snow = sstep(300, 420, y + n * 50); r = r * (1 - snow) + .92 * snow; gg = gg * (1 - snow) + .92 * snow; b = b * (1 - snow) + .95 * snow; }
      col[i * 3] = r; col[i * 3 + 1] = gg; col[i * 3 + 2] = b;
    }
    g.setAttribute('color', new T.BufferAttribute(col, 3)); g.computeVertexNormals();
    var m = new T.Mesh(g, new T.MeshStandardMaterial({ vertexColors: true, roughness: .95, metalness: 0 }));
    m.receiveShadow = true; m.name = 'vb-terrain'; return m;
  }

  var STEPS = [
    function textures() {
      _m = new T.Matrix4(); _q = new T.Quaternion(); _s = new T.Vector3(); _p = new T.Vector3(); _e = new T.Euler();
      root = new T.Group(); root.name = 'fx-vectorbay'; root.position.set(OX, 0, OZ); root.userData.noBatch = true;
      var lq = low(), env = envMap();
      var marble = marbleTex(lq ? 256 : 512), trav = travTex(lq ? 256 : 512), gz = glazingTex(lq ? 512 : 1024), ar = arcadeTex(trav);
      marble.repeat.set(1 / 8, 1 / 8);
      function std(o) { var m = new T.MeshStandardMaterial(o); if (env && (o.metalness || 0) > .2) { m.envMap = env; m.envMapIntensity = o.envMapIntensity || 1; } return m; }
      MAT = {
        stone: std({ map: trav, roughness: .62 }),
        stoneDark: std({ map: trav, color: 0xb9a68a, roughness: .8 }),
        citadel: std({ map: trav, color: 0xf2dcc0, roughness: .75 }),
        glaze: std({ map: gz[0], emissiveMap: gz[1], emissive: 0xffc68a, emissiveIntensity: .3, roughness: .18, metalness: .5, envMapIntensity: 1 }),
        tower: std({ map: gz[0], emissiveMap: gz[1], emissive: 0xffc68a, emissiveIntensity: .3, color: 0xd8cbb5, roughness: .12, metalness: .65, envMapIntensity: 1.2 }),
        arcade: std({ map: ar[0], emissiveMap: ar[1], emissive: 0xffbb70, emissiveIntensity: .6, roughness: .6 }),
        gold: std({ color: 0xc9a96e, roughness: .3, metalness: .9, envMapIntensity: 1.3 }),
        glass: new T.MeshStandardMaterial({ color: 0xcfe3e6, roughness: .05, metalness: .2, transparent: true, opacity: .32, depthWrite: false }),
        green: std({ color: 0x3f5a2c, roughness: .9 }),
        hedge: std({ color: 0x4a6a32, roughness: .85 }),
        roof: std({ color: 0xb5674b, roughness: .8 }),
        pool: std({ color: 0x3cc4d6, roughness: .04, metalness: .1, emissive: 0x0c6a7a, emissiveIntensity: .35 }),
        teak: std({ color: 0x8a6440, roughness: .7 }),
        black: std({ color: 0x15161a, roughness: .45, metalness: .6 }),
        marble: std({ map: marble, roughness: .12, metalness: .25, envMapIntensity: .9 }),
        lamp: new T.MeshBasicMaterial({ color: new T.Color(1, .78, .5) }),
        vine: std({ color: 0x4f6e33, roughness: .9 })
      };
      bannerMat = new T.MeshStandardMaterial({ map: bannerTex(), side: T.DoubleSide, roughness: .8, alphaTest: .02 });
      bannerMat.onBeforeCompile = function (sh) { sh.uniforms.uT = flagT; sh.vertexShader = 'uniform float uT;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n float wv = (1.0 - uv.y); transformed.z += sin(uT*2.1 + position.y*0.9 + position.x*0.7) * 0.35 * wv + sin(uT*3.3 + position.x*2.0)*0.08*wv;'); };
      FX = { marble: marble };
    },
    function land() {
      var lq = low(), st = lq ? 9 : 6;
      root.add(terrainMesh(1300, 1280, Math.round(1300 / st), Math.round(1280 / st), -170, -370));   /* x -820..480, z -1010..270 */
      root.add(terrainMesh(420, 240, Math.round(420 / (st + 2)), Math.round(240 / (st + 2)), 950, -700)); /* the island */
    },
    function promenade() {
      var pg = new T.BoxGeometry(21, .4, 600); boxUV(pg, 21, .4, 600, 1, 1); pg.translate(-70.5, 2.42, -145);
      var pg2 = new T.BoxGeometry(150, .4, 21); boxUV(pg2, 150, .4, 21, 1, 1); pg2.translate(-3, 2.42, -450.5);
      var prom = new T.Mesh(merge([prep(pg), prep(pg2)]), MAT.marble); prom.receiveShadow = true; root.add(prom);
      box('stoneDark', 3, 10, 600, -61.5, -2.6, -145, 0, 4, 4);
      box('stoneDark', 136, 10, 3, 5, -2.6, -441.5, 0, 4, 4);
      box('gold', .25, .18, 600, -60.1, 2.66, -145);
      box('gold', 132, .18, .25, 6, 2.66, -440.1);
      for (var z = -400; z < 140; z += 30) box('teak', 2.6, .5, 34, -43, .55, z, Math.PI / 2);
      for (var zz = 132; zz > -425;) {
        var len = R(26, 40), cz = zz - len / 2; if (cz - len / 2 < -428) break;
        buildBlock(-80, cz, 0, len, R(26, 38), Math.floor(R(5, 9)), { arcade: rnd() < .3 });
        for (var k = 0; k < 3; k++) cafeSpots.push([-77.2, cz - len / 2 + 5 + k * (len - 10) / 2]);
        shopFronts.push({ x: -81, z: cz, len: len });
        buildBlock(-130, cz + R(-4, 4), 0, len * R(.7, 1), R(22, 30), Math.floor(R(7, 12)), {});
        zz -= len + R(9, 13);
      }
      for (var x = -62; x < 62;) { var l2 = R(30, 40); buildBlock(x + l2 / 2, -460, -Math.PI / 2, l2, 28, Math.floor(R(5, 8)), { arcade: true }); for (var k2 = 0; k2 < 3; k2++) cafeSpots.push([x + 5 + k2 * (l2 - 10) / 2, -457.2, 1]); x += l2 + 10; }
    },
    function towers() {
      twin(-30, -560, 168, 138); twin(95, -600, 186, 150); twin(-175, -520, 140, 112, 11); twin(-300, -180, 150, 122, 11); twin(-250, 40, 132, 110, 10); twin(205, -720, 160, 128); twin(-110, -690, 150, 118);
    },
    function villas() {
      var placed = 0, tries = 0, N = low() ? 70 : 150;
      while (placed < N && tries < 6000) {
        tries++;
        var x = R(-560, 420), z = R(-900, 230), L = landSD(x, z); if (L.d < 150 || L.d > 420 || L.dP > 0) continue; if (fbm(x * .012 + 3, z * .012, 2) < .5) continue;
        if (Math.abs(x + 80) < 120 && z > -440) continue;
        var y = terrainH(x, z); if (y > 260) continue; var sl = Math.abs(terrainH(x + 6, z) - y) + Math.abs(terrainH(x, z + 6) - y); if (sl > 7) continue;
        if (towerSpots.some(function (t) { return Math.hypot(t[0] - x, t[1] - z) < 45; })) continue;
        var ry = Math.round(Math.atan2(x - 40, z + 200) / (Math.PI / 4)) * (Math.PI / 4) + Math.PI;
        var M = new T.Matrix4().compose(new T.Vector3(x, y - 1.5, z), new T.Quaternion().setFromEuler(new T.Euler(0, ry, 0)), new T.Vector3(1, 1, 1));
        var w = R(11, 20), d = R(9, 15), floors = 1 + Math.floor(rnd() * 3), yy = 3;
        box('stone', w + 2, 3, d + 2, 0, 1.5, 0, 0, 4, 4, M);
        for (var f = 0; f < floors; f++) { var sh = f * 2.2; box('glaze', w - 1 - sh, 2.8, d - 1 - sh, 0, yy + 1.4, -sh / 2, 0, 32, 27.2 * 2.8 / 3.4, M); box('stone', w - sh + .8, .5, d - sh + 1.8, 0, yy + 3.05, -sh / 2 + .6, 0, 4, 4, M); yy += 3.3; }
        if (rnd() < .35) box('pool', w * .6, .3, 3.2, 0, 3.1, d / 2 + 2.4, 0, 0, 0, M);
        addRect(x, z, w + 2, d + 2, ry);
        placed++;
      }
    },
    function citadel() {
      var cx = 235, cz = -330, rx = 132, rz = 100, SEG = 28, pts = [];
      for (var i = 0; i < SEG; i++) { var t = i / SEG * Math.PI * 2; pts.push([cx + Math.cos(t) * rx, cz + Math.sin(t) * rz]); }
      for (var j = 0; j < SEG; j++) {
        var a1 = pts[j], a2 = pts[(j + 1) % SEG], mx = (a1[0] + a2[0]) / 2, mz = (a1[1] + a2[1]) / 2, len = Math.hypot(a2[0] - a1[0], a2[1] - a1[1]), an = Math.atan2(a2[1] - a1[1], a2[0] - a1[0]);
        var by = Math.min(terrainH(a1[0], a1[1]), terrainH(a2[0], a2[1]), terrainH(mx, mz)) - 6, top = Math.max(terrainH(mx, mz), 26) + 11, h = top - by;
        var gate = j === 20 || j === 21;           /* the south-west gate faces the back quay */
        if (!gate) { box('citadel', len + 1, h, 3.2, mx, by + h / 2, mz, -an, 4, 4); addRect(mx, mz, len + 1, 3.6, -an); }
        for (var s = -len / 2 + 1; s < len / 2; s += 2.6) if (!gate) box('citadel', 1.3, 1.4, 3.4, mx + Math.cos(an) * s, top + .7, mz + Math.sin(an) * s, -an);
        var nx = Math.cos((j + .5) / SEG * Math.PI * 2) / rx, nz = Math.sin((j + .5) / SEG * Math.PI * 2) / rz, nl = Math.hypot(nx, nz), ox = nx / nl, oz = nz / nl;
        if (!gate && j % 2 === 0 && oz > -.3) { var bm = new T.Mesh(new T.PlaneGeometry(3.2, 8.5, 3, 10), bannerMat); bm.position.set(mx + ox * 1.75, top - 4.6, mz + oz * 1.75); bm.lookAt(mx + ox * 10 + OX, top - 4.6, mz + oz * 10 + OZ); root.add(bm); banners.push(bm); }
        if (j % 3 === 0) { var tx = a1[0], tz = a1[1], tb = Math.min(terrainH(tx, tz), 20) - 6, th = top - tb + 8, c = new T.CylinderGeometry(6, 6.6, th, 20); scaleUV(c, 10, th / 4); c.translate(tx, tb + th / 2, tz); push('citadel', c); addRect(tx, tz, 12, 12, 0);
          for (var k = 0; k < 10; k++) { var aa = k / 10 * Math.PI * 2; box('citadel', 1.6, 1.6, 1.4, tx + Math.cos(aa) * 6, tb + th + .8, tz + Math.sin(aa) * 6, -aa); }
          torches.push(new T.Vector3(tx, tb + th + 2.2, tz)); }
        if (j % 3 === 1 && !gate) torches.push(new T.Vector3(mx, top + 2, mz));
      }
      var ky = terrainH(cx, cz);
      box('citadel', 54, 26, 36, cx + 10, ky + 13, cz - 10, 0, 4, 4); addRect(cx + 10, cz - 10, 54, 36, 0);
      box('citadel', 40, 12, 26, cx + 10, ky + 32, cz - 10, 0, 4, 4);
      var dome = new T.SphereGeometry(13, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); dome.translate(cx + 10, ky + 38, cz - 10); push('citadel', dome);
      var lan = new T.CylinderGeometry(2.4, 2.4, 6, 12); lan.translate(cx + 10, ky + 53, cz - 10); push('gold', lan);
      [[-22, 10, 58], [40, 4, 50], [-14, -34, 46], [36, -32, 54]].forEach(function (q) {
        var dx = q[0], dz = q[1], hh = q[2];
        box('citadel', 8, hh, 8, cx + dx, ky + hh / 2, cz + dz, 0, 4, 4); addRect(cx + dx, cz + dz, 8, 8, 0);
        var cap = new T.SphereGeometry(4.6, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2); cap.translate(cx + dx, ky + hh, cz + dz); push('citadel', cap);
        var sp = new T.ConeGeometry(.6, 6, 6); sp.translate(cx + dx, ky + hh + 7, cz + dz); push('gold', sp);
        var b1 = new T.Mesh(new T.PlaneGeometry(4.2, 12, 3, 10), bannerMat); b1.position.set(cx + dx, ky + hh - 14, cz + dz + 4.15); root.add(b1); banners.push(b1);
        var b2 = b1.clone(); b2.position.set(cx + dx - 4.15, ky + hh - 14, cz + dz); b2.rotation.y = -Math.PI / 2; root.add(b2); banners.push(b2);
      });
      for (var b = 0; b < 6; b++) { var bm2 = new T.Mesh(new T.PlaneGeometry(5, 14, 3, 10), bannerMat); bm2.position.set(cx - 18 + b * 7, ky + 20, cz + 8.2); root.add(bm2); banners.push(bm2); }
      var n = 0, tries = 0, NN = low() ? 60 : 110;
      while (n < NN && tries < 3000) {
        tries++; var t2 = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * .92, x = cx + Math.cos(t2) * rx * rr, z = cz + Math.sin(t2) * rz * rr;
        if (Math.abs(x - cx - 10) < 36 && Math.abs(z - cz + 10) < 26) continue;
        if (Math.hypot(x - 150, z + 395) < 40) continue;   /* keep the street behind the gate free */
        var y = terrainH(x, z), w = R(6, 11), d = R(6, 10), h2 = R(6, 14), ry = R(-.3, .3) + (rnd() < .5 ? 0 : Math.PI / 2);
        box('citadel', w, h2 + 4, d, x, y - 4 + (h2 + 4) / 2, z, ry, 4, 4); addRect(x, z, w, d, ry);
        var roof = new T.ConeGeometry(Math.hypot(w, d) / 2 * 1.02, R(2.5, 4), 4, 1); roof.rotateY(Math.PI / 4); roof.scale(w / Math.hypot(w, d) * 1.414, 1, d / Math.hypot(w, d) * 1.414); roof.rotateY(ry); roof.translate(x, y + h2 + 1.4, z); push('roof', roof);
        n++;
      }
      box('citadel', 60, 5, 8, 120, .5, -205, .5, 4, 4); box('citadel', 8, 5, 70, 300, .5, -175, .2, 4, 4);
    },
    function mergeAll() {
      Object.keys(lists).forEach(function (k) {
        var key = k.split('|')[0], arr = lists[k];
        for (var i = 0; i < arr.length; i += 500) {
          var m = new T.Mesh(merge(arr.slice(i, i + 500)), MAT[key]);
          m.castShadow = !low() && key !== 'glass' && key !== 'pool'; m.receiveShadow = true; root.add(m);
        }
      });
      lists = {};
    },
    function trees() {
      var bark = new T.MeshStandardMaterial({ color: 0x8b7358, roughness: .95 }), frond = new T.MeshStandardMaterial({ map: frondTex(), color: 0xc8d6a8, side: T.DoubleSide, alphaTest: .3, roughness: .8 });
      var curve = new T.CatmullRomCurve3([new T.Vector3(0, 0, 0), new T.Vector3(.3, 4, 0), new T.Vector3(.9, 8, 0), new T.Vector3(1.6, 11.5, 0)]);
      var trunk = new T.TubeGeometry(curve, 12, .3, 7, false), top = curve.getPointAt(1), fr = [];
      for (var f = 0; f < 15; f++) {
        var a = f / 15 * Math.PI * 2 + (f % 2) * .2, L = R(4.2, 5.6), lift = f % 3 === 0 ? 1.2 : .4, Sg = 8, pos = [], uv = [], idx = [];
        for (var s = 0; s <= Sg; s++) { var t = s / Sg, r = t * L, y = Math.sin(t * Math.PI * .55) * lift * 1.6 - t * t * 3, w = 1.35 * Math.sin(Math.PI * Math.min(1, t * 1.05 + .05)) + .1, cx = top.x + Math.cos(a) * r, cz = top.z + Math.sin(a) * r, cy = top.y + y, px = -Math.sin(a), pz = Math.cos(a);
          pos.push(cx + px * w, cy - .25 * w, cz + pz * w, cx - px * w, cy - .25 * w, cz - pz * w); uv.push(1, 1 - t, 0, 1 - t); if (s < Sg) { var b = s * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); } }
        var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); fr.push(prep(g));
      }
      var frondG = merge(fr), palms = [];
      for (var z = 140; z > -432; z -= 16) palms.push([-63.5, 2.6, z + R(-1, 1), R(0, 6.28), R(.85, 1.2)]);
      for (var x = -55; x < 64; x += 16) palms.push([x, 2.6, -451, R(0, 6.28), R(.85, 1.2)]);
      for (var i = 0; i < 40; i++) { var xi = R(880, 1020), zi = R(-740, -660); if (landSD(xi, zi).dI > 10) palms.push([xi, terrainH(xi, zi), zi, R(0, 6.28), R(.9, 1.3)]); }
      inst(trunk, bark, palms); inst(frondG, frond, palms);
      var pts = []; for (var k = 0; k <= 10; k++) { var tt = k / 10; pts.push(new T.Vector2(Math.max(.02, Math.pow(Math.sin(Math.PI * Math.pow(tt, .75)), .9) * (1 - tt * .25)), tt * 9)); }
      var cyG = new T.LatheGeometry(pts, 8), cyM = new T.MeshStandardMaterial({ color: 0x23402a, roughness: .92 });
      var olParts = []; for (var q = 0; q < 3; q++) { var gq = new T.IcosahedronGeometry(R(1.4, 2), 1); gq.translate(R(-1.2, 1.2), 3.2 + R(-.4, .8), R(-1.2, 1.2)); olParts.push(prep(gq)); } var tr = new T.CylinderGeometry(.18, .28, 3.2, 6); tr.translate(0, 1.6, 0); olParts.push(prep(tr));
      var olG = merge(olParts), olM = new T.MeshStandardMaterial({ color: 0x5f7240, roughness: .9 }), cyp = [], ol = [], N = low() ? 500 : 1400, tries = 0;
      while (cyp.length + ol.length < N && tries < 30000) {
        tries++; var x2 = R(-800, 470), z2 = R(-1000, 240), L2 = landSD(x2, z2); if (L2.d < 10) continue; var y2 = terrainH(x2, z2); if (y2 > 300 || y2 < .5) continue;
        if (isQuay(x2, z2) || (x2 > -200 && x2 < 60 && z2 > -480 && z2 < 160)) continue;
        if (L2.dP > 0 && Math.hypot(x2 - 235, z2 + 330) < 120 && rnd() < .8) continue;
        if (fbm(x2 * .01 + 11, z2 * .01, 2) < .47 && L2.d > 60) continue;
        if (rectsAt(x2, z2) && pushOut(null, x2, z2, 1)) continue;
        if (rnd() < .45) cyp.push([x2, y2 - .3, z2, 0, R(1, 1.8), 1, R(1, 1.5)]); else ol.push([x2, y2 - .3, z2, R(0, 6.28), R(1.2, 2.4)]);
      }
      for (var zc = 120; zc > -420; zc -= 9) cyp.push([-122 + R(-2, 2), 2.6, zc, 0, R(.9, 1.1), 1, R(1.1, 1.4)]);
      inst(cyG, cyM, cyp); inst(olG, olM, ol);
      FX.olG = olG; FX.olM = olM;
    },
    function furniture() {
      var pole = new T.CylinderGeometry(.09, .13, 6.4, 8); pole.translate(0, 3.2, 0);
      var head = new T.CylinderGeometry(.22, .22, .95, 12); head.translate(0, 6.95, 0);
      var boll = new T.CylinderGeometry(.16, .18, .95, 10); boll.translate(0, .47, 0);
      var bollT = new T.CylinderGeometry(.17, .17, .18, 10); bollT.translate(0, .85, 0);
      var lamps = [], bolls = [];
      for (var z = 136; z > -436; z -= 14) lamps.push([-61.8, 2.62, z]);
      for (var x = -52; x < 66; x += 14) lamps.push([x, 2.62, -442]);
      for (var z2 = 140; z2 > -436; z2 -= 7) bolls.push([-60.7, 2.62, z2]);
      inst(pole, MAT.black, lamps); inst(head, MAT.lamp, lamps, { cast: false }); inst(boll, MAT.black, bolls); inst(bollT, MAT.lamp, bolls, { cast: false });
      var poolMat = new T.MeshBasicMaterial({ map: radialTex([[0, 'rgba(255,200,130,0.85)'], [.35, 'rgba(255,170,90,0.25)'], [1, 'rgba(255,150,80,0)']]), transparent: true, depthWrite: false, blending: T.AdditiveBlending, opacity: 0 });
      var pg = new T.PlaneGeometry(1, 1); pg.rotateX(-Math.PI / 2);
      inst(pg, poolMat, lamps.map(function (l) { return [l[0], 2.66, l[2], 0, 7]; }), { cast: false });
      FX.poolMat = poolMat;
      var plG = new T.BoxGeometry(1.6, 1.1, 1.6); plG.translate(0, .55, 0); var plL = [], bxL = [], so = [];
      for (var z3 = 132; z3 > -430; z3 -= 21) { plL.push([-71.5, 2.62, z3]); if (rnd() < .5) bxL.push([-71.5, 3.95, z3, 0, .7]); else so.push([-71.5, 3.2, z3, R(0, 6), .55]); }
      inst(plG, MAT.gold, plL); inst(new T.IcosahedronGeometry(1.1, 2), MAT.hedge, bxL); inst(FX.olG, FX.olM, so);
      plL.forEach(function (p) { addRect(p[0], p[2], 1.6, 1.6, 0); });
      var tTop = new T.CylinderGeometry(.42, .42, .05, 16); tTop.translate(0, .76, 0);
      var tLeg = new T.CylinderGeometry(.04, .2, .75, 8); tLeg.translate(0, .37, 0);
      var chS = new T.BoxGeometry(.5, .42, .5); chS.translate(0, .25, 0); var chB = new T.BoxGeometry(.5, .5, .08); chB.translate(0, .7, -.22); var chair = merge([prep(chS), prep(chB)]);
      var umb = new T.ConeGeometry(1.7, .7, 12, 1, true); umb.translate(0, 2.6, 0);
      var umbP = new T.CylinderGeometry(.04, .04, 2.6, 6); umbP.translate(0, 1.3, 0);
      var lant = new T.CylinderGeometry(.07, .07, .18, 8); lant.translate(0, .88, 0);
      var tabs = [], chairs = [], umbs = [], lants = [];
      cafeSpots.forEach(function (c) {
        var x = c[0], z = c[1], back = c[2];
        for (var k = 0; k < 2; k++) {
          var tx = back ? x + (k - .5) * 3.2 : x, tz = back ? z : z + (k - .5) * 3.2;
          tabs.push([tx, 2.62, tz]); lants.push([tx, 2.62, tz]);
          for (var s = 0; s < 2; s++) { var sx = tx + (s ? .75 : -.75), face = (s ? -1 : 1) * Math.PI / 2; chairs.push([sx, 2.62, tz, face]); if (rnd() < .7) seated.push([sx, 2.62, tz, face + Math.PI]); }
        }
        umbs.push([x + (back ? 0 : -.5), 2.62, z + (back ? -.4 : 0)]);
      });
      var top = new T.MeshStandardMaterial({ color: 0xf2ece2, roughness: .2 }), fabric = new T.MeshStandardMaterial({ color: 0xf1e8d8, roughness: .9, side: T.DoubleSide }), rattan = new T.MeshStandardMaterial({ color: 0x5b4632, roughness: .8 });
      inst(tTop, top, tabs); inst(tLeg, MAT.gold, tabs); inst(chair, rattan, chairs); inst(umb, fabric, umbs); inst(umbP, MAT.gold, umbs); inst(lant, MAT.lamp, lants, { cast: false });
    },
    function boats() {
      var white = new T.MeshStandardMaterial({ color: 0xf7f5f0, roughness: .25, metalness: .05 }), navy = new T.MeshStandardMaterial({ color: 0x1a2236, roughness: .3, metalness: .2 }), tint = new T.MeshStandardMaterial({ color: 0x15191f, roughness: .1, metalness: .6, envMap: MAT.gold.envMap || null }), glow = new T.MeshBasicMaterial({ color: new T.Color(1, .8, .55) });
      function hull(L, Wd, k) { k = k || 1; var s = new T.Shape(); s.moveTo(-L / 2, -Wd / 2 * .92); s.lineTo(L * .12, -Wd / 2); s.quadraticCurveTo(L * .42 * k, -Wd * .44, L / 2, 0); s.quadraticCurveTo(L * .42 * k, Wd * .44, L * .12, Wd / 2); s.lineTo(-L / 2, Wd / 2 * .92); s.closePath(); return s; }
      function ext(shape, depth, y) { var g = new T.ExtrudeGeometry(shape, { depth: depth, bevelEnabled: true, bevelThickness: .15, bevelSize: .15, bevelSegments: 1, curveSegments: 8 }); g.rotateX(-Math.PI / 2); g.translate(0, y, 0); return g; }
      function yacht(L) {
        var Wd = L * .19, H = L * .085, out = { white: [], navy: [], tint: [], glow: [] };
        out.navy.push(prep(ext(hull(L, Wd), H * .75, -H * .55))); out.white.push(prep(ext(hull(L * .995, Wd * 1.01), H * .55, H * .2)));
        var decks = L > 40 ? 3 : L > 22 ? 2 : 1;
        for (var d = 0; d < decks; d++) {
          var dl = L * (.62 - d * .14), dw = Wd * (.82 - d * .08), off = -L * (.08 + d * .04), y = H * .75 + d * 2.5;
          var g1 = ext(hull(dl * .98, dw * .96, .9), 1.8, y); g1.translate(off, 0, 0); out.tint.push(prep(g1));
          var g2 = ext(hull(dl * 1.04, dw * 1.02, .9), .45, y + 1.9); g2.translate(off - dl * .03, 0, 0); out.white.push(prep(g2));
          var gl = new T.BoxGeometry(dl * .8, .08, .08); gl.translate(off, y + .15, dw / 2 * .97); out.glow.push(prep(gl)); var gl2 = gl.clone(); gl2.translate(0, 0, -dw * .97); out.glow.push(prep(gl2));
        }
        var r = {}; Object.keys(out).forEach(function (k) { r[k] = merge(out[k]); }); return r;
      }
      var YV = [16, 24, 32, 54].map(yacht), mats = { white: white, navy: navy, tint: tint, glow: glow }, yl = [[], [], [], []];
      for (var z = -400; z < 140; z += 30) [-1, 1].forEach(function (side) { for (var k = 0; k < 2; k++) { var v = rnd() < .45 ? 1 : rnd() < .7 ? 0 : 2, L = [16, 24, 32][v]; if (rnd() < .15) continue; yl[v].push([-58 + L / 2 + 1.5, .15, z + side * (4.5 + k * 6.8), 0]); } });
      [-30, 30].forEach(function (x) { yl[3].push([x, .2, -428, 0]); });
      yl[3].push([30, .2, -260, Math.PI / 2 + .2]); yl[3].push([120, .2, 60, 1.2]); yl[2].push([95, .15, -40, .4]); yl[1].push([170, .15, 30, .9]);
      YV.forEach(function (v, i) { if (!yl[i].length) return; Object.keys(v).forEach(function (k) { inst(v[k], mats[k], yl[i], { cast: k !== 'glow' }); }); });
      var sb = merge([prep(ext(hull(12, 3.6), 1.2, -.5)), prep(new T.CylinderGeometry(.07, .09, 16, 6).translate(.8, 8, 0)), prep(new T.CylinderGeometry(.05, .05, 5, 6).rotateZ(Math.PI / 2).translate(-1.5, 2.6, 0))]), sbl = [];
      for (var z2 = -190; z2 < 130; z2 += 13) [36, 52].forEach(function (x) { if (rnd() < .8) sbl.push([x + R(-1, 1), .1, z2, Math.PI / 2 + R(-.05, .05)]); });
      for (var i = 0; i < 12; i++) sbl.push([R(420, 900), .1, R(-500, 200), R(0, 6.28)]);
      inst(sb, white, sbl);
      /* galleons of House Maren */
      var sail = new T.MeshStandardMaterial({ map: sailTex(), side: T.DoubleSide, roughness: .85 }), wood = new T.MeshStandardMaterial({ color: 0x5a3b24, roughness: .75 });
      function galleon(x, z, ry, s) {
        var gr = new T.Group(), L = 34, Wd = 9;
        var hl = ext(hull(L, Wd, .8), 5.5, -2.5), castle = new T.BoxGeometry(8, 3.5, Wd * .85).translate(-L / 2 + 4, 4.6, 0), fc = new T.BoxGeometry(5, 2, Wd * .6).translate(L / 2 - 6, 3.8, 0);
        gr.add(new T.Mesh(merge([prep(hl), prep(castle), prep(fc)]), wood));
        gr.add(new T.Mesh(new T.BoxGeometry(L * .9, .35, Wd * 1.02).translate(-1, 2.6, 0), MAT.gold));
        [[-8, 24], [3, 30], [12, 22]].forEach(function (q) {
          var mx = q[0], mh = q[1], m = new T.Mesh(new T.CylinderGeometry(.28, .4, mh, 8), wood); m.position.set(mx, mh / 2 + 3, 0); gr.add(m);
          [[mh * .45, 11], [mh * .8, 8]].forEach(function (y) {
            var pg = new T.PlaneGeometry(y[1], mh * .3, 8, 6), p = pg.attributes.position; for (var i = 0; i < p.count; i++) { var u = p.getX(i) / (y[1] / 2); p.setZ(i, (1 - u * u) * 1.6); } pg.computeVertexNormals();
            var sl = new T.Mesh(pg, sail); sl.position.set(mx + .6, y[0] + 3, 0); sl.rotation.y = Math.PI / 2; gr.add(sl);
          });
          var fl = new T.Mesh(new T.PlaneGeometry(2.4, 5, 2, 6), bannerMat); fl.position.set(mx, mh + 1, 1.25); fl.rotation.y = Math.PI / 2; gr.add(fl); banners.push(fl);
        });
        gr.position.set(x, 0, z); gr.rotation.y = ry; gr.scale.setScalar(s || 1); gr.userData.ry = ry; gr.userData.ph = rnd() * 6; root.add(gr); galleons.push(gr);
      }
      galleon(150, -170, .3); galleon(205, -150, -.4, .9); galleon(290, -140, .9); galleon(360, -190, 2.4, .85); galleon(560, -260, 1.8, 1.1);
      var hero = new T.Group(); Object.keys(YV[2]).forEach(function (k) { hero.add(new T.Mesh(YV[2][k], mats[k])); }); root.add(hero); FX.hero = hero; FX.YV = YV; FX.ymats = mats;
      /* torches */
      var flameMat = new T.SpriteMaterial({ map: radialTex([[0, 'rgba(255,240,200,1)'], [.25, 'rgba(255,170,60,0.9)'], [.6, 'rgba(255,90,20,0.35)'], [1, 'rgba(255,60,10,0)']]), blending: T.AdditiveBlending, depthWrite: false, color: new T.Color(1.6, 1.3, 1.0) });
      FX.flames = torches.map(function (p) { var s = new T.Sprite(flameMat); s.position.copy(p); s.scale.setScalar(3.2); root.add(s); return s; });
    },
    function folks() {
      /* AI residents in the same stylised look as Fyrus avatars (v2), drawn as instanced parts so 260 people stay cheap */
      var lathe = function (pts, seg, ps, pl) { if (pts[0][1] > pts[pts.length - 1][1]) pts = pts.slice().reverse(); return new T.LatheGeometry(pts.map(function (q) { return new T.Vector2(Math.max(.0005, q[0]), q[1]); }), seg, ps, pl); };
      var limb = function (len, r0, r1) { return lathe([[.001, r0 * .6], [r0 * .7, r0 * .45], [r0, 0], [(r0 + r1) / 2 + .004, -len * .45], [r1, -len], [r1 * .7, -len - r1 * .45], [.001, -len - r1 * .6]], 10); };
      var HS = 1.14;
      var head = new T.SphereGeometry(.118 * HS, 20, 14), hp = head.attributes.position;
      for (var q = 0; q < hp.count; q++) { var y = hp.getY(q); if (y < 0) { var k = 1 - .22 * Math.pow(-y / (.118 * HS), 1.4); hp.setX(q, hp.getX(q) * k); } }
      head.scale(.95, 1.1, 1); head.computeVertexNormals();
      var capA = new T.SphereGeometry(.128 * HS, 18, 6, 0, Math.PI * 2, 0, Math.PI * .36), capB = new T.SphereGeometry(.128 * HS, 18, 8, Math.PI / 2 + 1.2, Math.PI * 2 - 2.4, Math.PI * .36, Math.PI * .26);
      capA.scale(.97, 1.08, 1.02); capB.scale(.97, 1.08, 1.02);
      var longBack = lathe([[.1, .02], [.13, -.05], [.13, -.18], [.115, -.3], [.09, -.33]], 14, Math.PI / 2 + .25, Math.PI - .5); longBack.scale(HS, 1, HS * .85);
      var P = {
        pelvis: (function () { var g = new T.SphereGeometry(.16, 14, 8); g.scale(1.05, .62, .72); return g; })(),
        torso: (function () { var g = lathe([[.001, -.02], [.152, -.01], [.15, .1], [.152, .2], [.17, .32], [.182, .42], [.175, .49], [.12, .545], [.055, .57], [.001, .575]], 16); g.scale(1, 1, .68); return g; })(),
        neck: limb(.09, .05, .055),
        head: head,
        hair: mergeG([capA, capB]),
        hairLong: mergeG([capA.clone(), capB.clone(), longBack]),
        leg: limb(.86, .085, .046),
        shoe: (function () { var g = new T.SphereGeometry(.06, 10, 8); g.scale(.95, .75, 2.05); g.translate(0, -.9, .045); return g; })(),
        arm: limb(.5, .052, .036),
        hand: (function () { var g = new T.SphereGeometry(.04, 8, 6); g.scale(.9, 1.2, .55); g.translate(0, -.56, 0); return g; })(),
        dress: lathe([[.14, 0], [.2, -.2], [.29, -.5], [.285, -.52]], 16),
        face: new T.PlaneGeometry(.21, .21)
      };
      function mergeG(list) {
        var n = 0, arr = list.map(function (g) { return g.index ? g.toNonIndexed() : g; });
        arr.forEach(function (g) { n += g.attributes.position.count; });
        var Pp = new Float32Array(n * 3), Nn = new Float32Array(n * 3), o = 0;
        arr.forEach(function (g) { if (!g.attributes.normal) g.computeVertexNormals(); Pp.set(g.attributes.position.array, o * 3); Nn.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; });
        var out = new T.BufferGeometry(); out.setAttribute('position', new T.BufferAttribute(Pp, 3)); out.setAttribute('normal', new T.BufferAttribute(Nn, 3)); return out;
      }
      /* a painted face (eyes with sparkle, lashes, brows, nose shade, smile) on a transparent card in front of the head */
      var fc = cnv(128, 128), fg = fc[1];
      [-1, 1].forEach(function (s) {
        var ex = 64 + s * 22, ey = 62;
        fg.fillStyle = '#ffffff'; fg.beginPath(); fg.ellipse(ex, ey, 11, 12, 0, 0, Math.PI * 2); fg.fill();
        fg.fillStyle = '#5a3a24'; fg.beginPath(); fg.arc(ex, ey + 1, 7.5, 0, Math.PI * 2); fg.fill();
        fg.fillStyle = '#0c0a08'; fg.beginPath(); fg.arc(ex, ey + 1, 3.8, 0, Math.PI * 2); fg.fill();
        fg.fillStyle = '#ffffff'; fg.beginPath(); fg.arc(ex + 2.5 * s, ey - 2.5, 1.8, 0, Math.PI * 2); fg.fill();
        fg.strokeStyle = '#1a1210'; fg.lineWidth = 2.4; fg.beginPath(); fg.ellipse(ex, ey, 11.5, 12.5, 0, Math.PI * 1.1, Math.PI * 1.9); fg.stroke();
        fg.strokeStyle = 'rgba(40,26,18,.9)'; fg.lineWidth = 3.2; fg.beginPath(); fg.ellipse(ex, ey - 6, 13, 9, 0, Math.PI * 1.2, Math.PI * 1.8); fg.stroke();
      });
      fg.fillStyle = 'rgba(120,70,50,.25)'; fg.beginPath(); fg.ellipse(64, 80, 5, 4, 0, 0, Math.PI * 2); fg.fill();
      fg.strokeStyle = '#a24f50'; fg.lineWidth = 3; fg.lineCap = 'round'; fg.beginPath(); fg.arc(64, 86, 10, Math.PI * .2, Math.PI * .8); fg.stroke();
      var faceTex = new T.CanvasTexture(fc[0]); if (T.sRGBEncoding) faceTex.encoding = T.sRGBEncoding;
      var faceMat = new T.MeshBasicMaterial({ map: faceTex, transparent: true, depthWrite: false, alphaTest: .05 });
      var outfits = ['#f4efe6', '#efe6d4', '#e9dcc4', '#1b1d22', '#20283a', '#c8b48e', '#f7f3ec', '#2d2a28', '#d7c7ab', '#8a6b4a', '#3b5b8a', '#b5525a', '#45e0ae'], skins = ['#e8c4a0', '#d6a77e', '#b9805a', '#8d5a3b', '#f0d2b4', '#c58f68', '#6e4630'], hairs = ['#1a1410', '#3a2a1e', '#5a3d26', '#c9a46a', '#2a2420', '#0f0d0c'], shoes = ['#1a1a1a', '#efefef', '#5b4632', '#c9a96e'];
      function pick(a) { return a[Math.floor(rnd() * a.length)]; }
      function add(x, z, dir, lane, sy) { var woman = rnd() < .5, o = new T.Color(pick(outfits)), sk = new T.Color(pick(skins)); people.push({ x: x, z: z, dir: dir, lane: lane, speed: R(1, 1.5), ph: rnd() * 6.28, s: R(.94, 1.06) * (woman ? .95 : 1), woman: woman, longHair: woman && rnd() < .75, o: o, sk: sk, hair: new T.Color(pick(hairs)), pants: woman && rnd() < .5 ? new T.Color(pick(outfits)) : new T.Color(pick(['#20283a', '#2b303a', '#1b1d22', '#3b5b8a', '#c8b48e'])), sleeve: rnd() < .45, shoe: new T.Color(pick(shoes)), seated: sy != null, yaw: sy != null ? sy : (dir > 0 ? 0 : Math.PI), y: 2.62, pause: 0, axis: lane === 'back' ? 'x' : 'z' }); }
      var n = low() ? 70 : 140;
      for (var i = 0; i < n; i++) { if (i % 6 === 0) add(R(-55, 65), R(-452, -444), rnd() < .5 ? 1 : -1, 'back'); else add(R(-74, -64), R(-430, 136), rnd() < .5 ? 1 : -1, 'left'); }
      seated.slice(0, low() ? 40 : 120).forEach(function (st) { add(st[0], st[2], 0, 'seat', st[3]); });
      var PN = people.length, parts = {}, cloth = new T.MeshStandardMaterial({ roughness: .75 }), skin = new T.MeshStandardMaterial({ roughness: .6 });
      var defs = [['pelvis', P.pelvis, cloth, function (p) { return p.pants; }], ['torso', P.torso, cloth, function (p) { return p.o; }], ['neck', P.neck, skin, function (p) { return p.sk; }], ['head', P.head, skin, function (p) { return p.sk; }],
        ['face', P.face, faceMat, null], ['hair', P.hair, skin, function (p) { return p.hair; }], ['hairLong', P.hairLong, skin, function (p) { return p.hair; }],
        ['legL', P.leg, cloth, function (p) { return p.woman && !p.seated && p.dressOn ? p.sk : p.pants; }], ['legR', P.leg, cloth, function (p) { return p.pants; }], ['shoeL', P.shoe, cloth, function (p) { return p.shoe; }], ['shoeR', P.shoe, cloth, function (p) { return p.shoe; }],
        ['armL', P.arm, cloth, function (p) { return p.sleeve ? p.o : p.sk; }], ['armR', P.arm, cloth, function (p) { return p.sleeve ? p.o : p.sk; }], ['handL', P.hand, skin, function (p) { return p.sk; }], ['handR', P.hand, skin, function (p) { return p.sk; }], ['dress', P.dress, cloth, function (p) { return p.o; }]];
      people.forEach(function (p) { p.dressOn = p.woman && rnd() < .45; if (p.dressOn) p.pants = p.sk.clone(); });
      defs.forEach(function (d) {
        var im = new T.InstancedMesh(d[1], d[2], PN); im.castShadow = !low() && d[0] !== 'face'; im.frustumCulled = false; im.instanceMatrix.setUsage(T.DynamicDrawUsage);
        if (d[3]) people.forEach(function (p, k2) { im.setColorAt(k2, d[3](p)); });
        root.add(im); parts[d[0]] = im;
      });
      FX.parts = parts; FX.A = new T.Matrix4(); FX.B = new T.Matrix4(); FX.C = new T.Matrix4(); FX.ry = new T.Matrix4(); FX.sc = new T.Matrix4(); FX.rx = new T.Matrix4(); FX.tr = new T.Matrix4(); FX.ZERO = new T.Matrix4().makeScale(0, 0, 0);
    },
    function mapMask() {
      var X0 = -830, Z0 = -1010, STEP = 8, NW = Math.ceil((1160 - X0) / STEP), NH = Math.ceil((262 - Z0) / STEP), a = cnv(NW, NH), c = a[0], g = a[1], img = g.createImageData(NW, NH), D = img.data;
      for (var j = 0; j < NH; j++) for (var i = 0; i < NW; i++) {
        var x = X0 + i * STEP + STEP / 2, z = Z0 + j * STEP + STEP / 2, h = groundL(x, z), k = (j * NW + i) * 4, col;
        if (h < .05) col = [44, 111, 143, 255];
        else if (h > 2.5 && h < 2.7) col = [216, 203, 181, 255];
        else if (h > 120) col = [120, 118, 110, 255];
        else col = [70 + Math.min(40, h * .3) | 0, 92, 62, 255];
        if (h >= .05 && rectsAt(x, z) && pushOut(null, x, z, 0)) col = [155, 148, 136, 255];
        D[k] = col[0]; D[k + 1] = col[1]; D[k + 2] = col[2]; D[k + 3] = col[3];
      }
      g.putImageData(img, 0, 0); FX.map = { c: c, x0: X0, z0: Z0, w: NW * STEP, h: NH * STEP };
    },
    function finish() {
      W.world.add(root);
      addInteracts();
      built = true; building = false;
      if (pendingArrive) { var f = pendingArrive; pendingArrive = null; f(); }
    }
  ];
  function setPart(k, i, base, px, py, pz, rx, hidden) { var P = FX.parts[k]; if (hidden) { P.setMatrixAt(i, FX.ZERO); return; } FX.tr.makeTranslation(px, py, pz); FX.rx.makeRotationX(rx); FX.C.multiplyMatrices(base, FX.tr).multiply(FX.rx); P.setMatrixAt(i, FX.C); }
  function updatePeople(dt) {
    for (var i = 0; i < people.length; i++) {
      var p = people[i], swing = 0, bob = 0;
      if (!p.seated) {
        if (p.pause > 0) p.pause -= dt; else { p.ph += dt * p.speed * 4.4; if (p.axis === 'z') { p.z += p.dir * p.speed * dt; if (p.z > 138) p.z = -432; if (p.z < -432) p.z = 138; } else { p.x += p.dir * p.speed * dt; if (p.x > 66) p.x = -58; if (p.x < -58) p.x = 66; } if (Math.random() < .0008) p.pause = 2 + Math.random() * 4; }
        swing = p.pause > 0 ? 0 : Math.sin(p.ph) * .42; bob = p.pause > 0 ? 0 : Math.abs(Math.cos(p.ph)) * .03;
        p.yaw = p.axis === 'z' ? (p.dir > 0 ? 0 : Math.PI) : (p.dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      }
      FX.A.makeTranslation(p.x, p.y + bob, p.z); FX.ry.makeRotationY(p.yaw); FX.sc.makeScale(p.s, p.s, p.s); FX.B.multiplyMatrices(FX.A, FX.ry).multiply(FX.sc);
      var sy = p.seated ? -.42 : 0, lx = p.woman ? .088 : .092, ax = p.woman ? .18 : .205;
      setPart('pelvis', i, FX.B, 0, .97 + sy, 0, 0);
      setPart('torso', i, FX.B, 0, .99 + sy, 0, p.seated ? -.05 : 0);
      setPart('neck', i, FX.B, 0, 1.64 + sy, -.005, 0);
      setPart('head', i, FX.B, 0, 1.78 + sy, 0, 0);
      setPart('face', i, FX.B, 0, 1.775 + sy, .142, 0);
      setPart('hair', i, FX.B, 0, 1.795 + sy, -.004, 0, p.longHair);
      setPart('hairLong', i, FX.B, 0, 1.795 + sy, -.004, 0, !p.longHair);
      var la = p.seated ? -1.45 : swing, ra = p.seated ? -1.35 : -swing;
      setPart('legL', i, FX.B, -lx, .93 + sy, 0, la); setPart('shoeL', i, FX.B, -lx, .93 + sy, 0, la);
      setPart('legR', i, FX.B, lx, .93 + sy, 0, ra); setPart('shoeR', i, FX.B, lx, .93 + sy, 0, ra);
      var al = p.seated ? -.9 : -swing * .7, ar = p.seated ? -.8 : swing * .7;
      setPart('armL', i, FX.B, -ax, 1.45 + sy, 0, al); setPart('handL', i, FX.B, -ax, 1.45 + sy, 0, al);
      setPart('armR', i, FX.B, ax, 1.45 + sy, 0, ar); setPart('handR', i, FX.B, ax, 1.45 + sy, 0, ar);
      setPart('dress', i, FX.B, 0, 1.03 + sy, 0, 0, !p.dressOn || p.seated);
    }
    for (var k in FX.parts) FX.parts[k].instanceMatrix.needsUpdate = true;
  }

  /* ---------- places you can use (press E / tap) ---------- */
  function wv(x, z) { return new T.Vector3(x + OX, 0, z + OZ); }
  function addInteracts() {
    var I = W.staticInteracts; if (!I) return;
    I.push({ pos: wv(-66, -168), radius: 6, label: 'Vector Bay terminal · Fyrus Airlines flight home to Fyrus Core', action: 'vb-terminal', use: function () { flyTo({ name: 'Fyrus Core', x: 0, z: 36 }); } });
    I.push({ pos: wv(-58, -100), radius: 6, label: 'Marina office · evening cruise around the bay (free)', action: 'vb-cruise', use: cruise });
    shopFronts.forEach(function (f, i) {
      I.push({ pos: wv(f.x + 1.5, f.z), radius: 4.5, label: 'Boutique on the promenade · walk into the 3D store', action: 'vb-shop', use: function () {
        var st = S(), bl = (st && st.brands) || [];
        if (window.__fyrusMall3D && bl.length) window.__fyrusMall3D.open({ brandId: bl[i % bl.length].id }); else toast('The boutiques open with Fyrus Market brands.');
      } });
    });
    I.push({ pos: wv(150, -398), radius: 10, label: 'Citadel of House Maren · the old harbour', action: 'vb-citadel', use: function () { toast('House Maren has guarded the Azure Coast since the founding. Walk through the gate and up to the keep.'); } });
  }
  function cruise() {
    if (!W.beginTrip || W.trip) return;
    var pts = [[-45, -115], [40, 40], [220, 110], [430, 40], [470, -170], [330, -170], [60, -160], [-45, -115]].map(function (p) { return wv(p[0], p[1]).setY(.2); });
    var curve = new T.CatmullRomCurve3(pts, false, 'centripetal'), boat = new T.Group();
    Object.keys(FX.YV[1]).forEach(function (k) { boat.add(new T.Mesh(FX.YV[1][k], FX.ymats[k])); });
    W.beginTrip('cruise', 'Evening cruise · Vector Bay', 34, function (t) {
      var u = Math.min(.999, t / 34), p = curve.getPointAt(u), q = curve.getPointAt(Math.min(.999, u + .01));
      boat.position.copy(p); boat.lookAt(q); boat.rotateY(-Math.PI / 2); boat.position.y = .15 + Math.sin(t * 1.3) * .08;
      var dir = q.clone().sub(p).setY(0).normalize(), body = p.clone().addScaledVector(dir, -3).setY(2.2);
      return { pos: body.clone().addScaledVector(dir, -16).add(new T.Vector3(0, 7, 0)), look: body.clone().addScaledVector(dir, 10).setY(3), body: body };
    }, function () { try { W.teleport({ x: OX - 60, z: OZ - 100 }); } catch (e) {} }, boat, true);
  }

  /* ---------- getting here ---------- */
  var pendingArrive = null;
  function ensure(cb) {
    if (built) { if (cb) cb(); return; }
    if (cb) pendingArrive = cb;
    start();
  }
  function start() {
    if (built || building) return;
    W = window.__fyrusW; T = window.THREE; if (!W || !W.world || !T) return;
    building = true; var i = 0;
    (function next() {
      if (i >= STEPS.length) return;
      try { STEPS[i++](); } catch (e) { if (window.console) console.warn('[vector-bay] build step failed', e); }
      setTimeout(next, 16);
    })();
  }
  function flyTo(dest, onEnd) {
    var C = window.__fyrusCountry, done = function () { try { W.teleport(dest.face ? { x: dest.x, z: dest.z, face: dest.face } : { x: dest.x, z: dest.z }); } catch (e) {} if (onEnd) onEnd(); };
    if (C && C.flyThrough && C.flyThrough(dest, 'flight', done)) return;
    done();
  }
  API.go = function () {
    W = window.__fyrusW; T = window.THREE;
    if (!W || !W.teleport) { toast('Enter the city first.'); return; }
    var d = { name: 'Vector Bay', x: API.landing.x, z: API.landing.z, face: API.landing.face };
    if (built) { flyTo(d, arrived); return; }
    toast('Fyrus Airlines · boarding for Vector Bay…');
    start();
    var waited = 0;
    (function wait() { if (built) return flyTo(d, arrived); if ((waited += 200) > 15000) return flyTo(d, arrived); setTimeout(wait, 200); })();
  };
  function arrived() { greeted = false; try { window.__fyrus.setState({ backTo: null }); } catch (e) {} }
  API.state = function () { return { built: built, building: building, inside: API.inside(), rects: RECTS.length, people: people.length }; };

  /* ---------- camera: never inside a building or a hill ---------- */
  var prevCam = window.__fyrusCamera;
  window.__fyrusCamera = function (d, h) {
    var hx = h.x - OX, hz = h.z - OZ;
    if (inBox(hx, hz) || inBox(d.x - OX, d.z - OZ)) {
      var dx = d.x - h.x, dy = d.y - h.y, dz = d.z - h.z, L = Math.hypot(dx, dy, dz), n = Math.max(2, Math.ceil(L / .7));
      for (var i = 1; i <= n; i++) {
        var t = i / n, x = hx + dx * t, y = h.y + dy * t, z = hz + dz * t;
        if ((rectsAt(x, z) && pushOut(null, x, z, .4)) || groundL(x, z) + .4 > y) {
          var k = Math.max(.12, (i - 1.5) / n); d.set(h.x + dx * k, h.y + dy * k, h.z + dz * k); break;
        }
      }
    }
    if (prevCam) prevCam(d, h);
  };

  /* ---------- minimap: the sea is sea, and the bay has its own streets ---------- */
  var prevM = window.__fyrusMinimap;
  window.__fyrusMinimap = function (r, s, p) {
    try {
      if (p.z < -300) { r.fillStyle = '#2c6f8f'; r.fillRect(-6000 * s, -6000 * s, 12000 * s, (6000 - 392) * s); }
      if (FX && FX.map && p.z < -400) { r.imageSmoothingEnabled = true; r.drawImage(FX.map.c, (OX + FX.map.x0) * s, (OZ + FX.map.z0) * s, FX.map.w * s, FX.map.h * s); }
    } catch (e) {}
    if (prevM) prevM(r, s, p);
  };

  /* ---------- per-frame life ---------- */
  var lastT = 0, t0 = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    var Wn = window.__fyrusW; if (!Wn || !Wn.player) { lastT = now; return; }
    if (Wn !== W && built) { built = false; building = false; root = null; people.length = 0; }   /* a new world instance */
    W = Wn; T = window.THREE;
    var dt = lastT ? Math.min(.1, (now - lastT) / 1000) : 0; lastT = now; var t = (now - t0) / 1000;
    var p = W.player.root.position, dx = p.x - (OX + 60), dz = p.z - (OZ - 220), dist = Math.hypot(dx, dz);
    if (!built && !building && dist < 950 && W.active === W.world) start();
    if (!built || !root) return;
    var show = dist < 1450 && W.active === W.world; root.visible = show; if (!show) return;
    var night = (W.env && W.env.night) || 0;
    MAT.glaze.emissiveIntensity = .25 + 1.3 * night; MAT.tower.emissiveIntensity = .2 + 1.1 * night; MAT.arcade.emissiveIntensity = .5 + 1.7 * night;
    MAT.lamp.color.setRGB(1, .78, .5).multiplyScalar(1 + 1.6 * night); if (FX.poolMat) FX.poolMat.opacity = night * .9;
    flagT.value = t;
    if (FX.flames) FX.flames.forEach(function (s, i) { s.scale.setScalar((2.6 + Math.sin(t * 11 + i) * .25 + Math.sin(t * 23 + i * 3) * .15) * (.6 + .6 * night)); });
    galleons.forEach(function (g) { g.position.y = Math.sin(t * .6 + g.userData.ph) * .25; g.rotation.z = Math.sin(t * .5 + g.userData.ph) * .02; });
    if (FX.hero) { var u = (t % 80) / 80, hz = 240 - u * 600, hx = 10 + Math.sin(u * 3) * 8; FX.hero.position.set(hx, .1, hz); FX.hero.rotation.y = Math.PI / 2; }
    var lx = p.x - OX, lz = p.z - OZ;
    if (people.length && lx > -320 && lx < 320 && lz > -700 && lz < 380) updatePeople(dt);
  }
  requestAnimationFrame(frame);

  /* ---------- /?go=vector-bay (old links to the separate page land here) ---------- */
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.get('go') === 'vector-bay') {
      qs.delete('go'); var rest = qs.toString(); history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
      var tries = 0;
      (function waitWorld() {
        var Wd = window.__fyrusW, st = S();
        var ready = Wd && Wd.teleport && Wd.active === Wd.world && st && !st.intro && !document.querySelector('.fxi,.fxp-ov');
        if (ready) { API.go(); return; }
        if (++tries < 400) setTimeout(waitWorld, 500);
      })();
    }
  } catch (e) {}
})();
