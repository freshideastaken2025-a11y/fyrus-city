/* FYRUS 22.6 interactive street stalls (shops and services). Kill switch: ?p22off=shops
 * Street vendors on the city pavements: coffee cart, flower stall, news kiosk, juice bar, plus a "City Info" service
 * point (directions: sets a waypoint to the nearest landmark of the Core). Placed mid-block on the pavement of about one
 * in three road segments within 170 m of the player (deterministic per segment), rebuilt after 48 m of movement.
 * Drawn with instanced meshes (counter, awning with per-stall colour, sign plate from a small canvas atlas).
 * Walk up and press the normal interact key (E) or tap the prompt: a small menu opens; buying uses the game's own demo
 * wallet path (window.__fyrusEconomy, added in 007.js): demo FYC credits only, non-redeemable, with the usual toast,
 * transaction record, shop stats and XP. The menu closes when you walk away or press Esc.
 * Stats: window.__fyrusShops22.stats. Test hook: window.__fyrusShops22.selfTest(). */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p22off') || '').split(',').some(function (k) { return k === 'shops' || k === 'all'; })) return;
  var KINDS = [
    { id: 'coffee', name: 'Corner Coffee Cart', col: 0x7a4a2a, items: [['Espresso', 3], ['Oat latte', 4.5], ['Croissant', 3.5]] },
    { id: 'flowers', name: 'Petal Stall', col: 0xd65b8a, items: [['Tulip bunch', 8], ['Single rose', 5], ['Sunflower', 6]] },
    { id: 'news', name: 'City News Kiosk', col: 0x2f5fa8, items: [['Fyrus Times', 2], ['Mint gum', 1], ['Water bottle', 1.5]] },
    { id: 'juice', name: 'Fresh Juice Bar', col: 0xe08a1e, items: [['Orange juice', 4], ['Berry smoothie', 6], ['Fruit cup', 5]] },
    { id: 'info', name: 'City Info Point', col: 0x2e8a5a, service: true, items: [] }
  ];
  var S = { stalls: 0, rebuilds: 0, opens: 0, purchases: 0, spent: 0, failed: 0, directions: 0, errors: 0, ms: 0 };
  var API = window.__fyrusShops22 = { version: '23.5', stats: S };
  var T, W, M = {}, stalls = [], center = null, panel = null, openStall = null, atlas = null;
  function hash(a, b) { var h = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return h - Math.floor(h); }
  function makeAtlas() {
    var c = document.createElement('canvas'); c.width = 512; c.height = 320; var g = c.getContext('2d');
    KINDS.forEach(function (k, i) {
      var y = i * 64; g.fillStyle = '#' + k.col.toString(16).padStart(6, '0'); g.fillRect(0, y, 512, 64);
      g.fillStyle = '#ffffff'; g.font = 'bold 34px Arial, Helvetica, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(k.name, 256, y + 33);
    });
    var t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return t;
  }
  function build() {
    atlas = makeAtlas();
    var wood = new T.MeshStandardMaterial({ color: 0xc9b79c, roughness: 0.8 });
    var cloth = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    var metal = new T.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.5, metalness: 0.5 });
    var signG = new T.PlaneGeometry(2.0, 0.25);
    var aOff = new T.InstancedBufferAttribute(new Float32Array(80 * 2), 2); signG.setAttribute('aOff', aOff);
    var sm = new T.MeshBasicMaterial({ map: atlas });
    sm.onBeforeCompile = function (sh) { sh.vertexShader = 'attribute vec2 aOff;\n' + sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_UV\n vUv = vec2(1.0, 0.2) * uv + aOff;\n#endif'); };
    sm.customProgramCacheKey = function () { return 'p22-stall-sign'; };
    function im(g, m, n, shadow) { var x = new T.InstancedMesh(g, m, n); x.count = 0; x.castShadow = !!shadow; x.receiveShadow = true; x.userData.noBatch = x.userData.noInstance = true; x.frustumCulled = false; x.name = 'p22-stall'; return x; }
    M.counter = im(new T.BoxGeometry(2.0, 1.0, 0.9).translate(0, 0.5, 0), wood, 40, true);
    M.awning = im(new T.BoxGeometry(2.3, 0.08, 1.4).translate(0, 2.35, -0.15), cloth, 40, true);
    M.posts = im(new T.CylinderGeometry(0.04, 0.04, 2.3, 6).translate(0, 1.15, 0), metal, 80, false);
    M.sign = im(signG, sm, 40, false);
    M.awning.setColorAt(0, new T.Color(1, 1, 1));
  }
  function free(x, z) { if (x * x + z * z < 62 * 62) return false; var g = W.groundAt ? W.groundAt(x, z) : 0; return g < 0.3; }
  function place() {
    var p = W.player.root.position, R = 170, m = new T.Matrix4(), q = new T.Quaternion(), up = new T.Vector3(0, 1, 0), one = new T.Vector3(1, 1, 1), v = new T.Vector3(), col = new T.Color();
    var n = 0, np = 0; stalls = [];
    var k0 = Math.floor((p.x - R) / 64), k1 = Math.ceil((p.x + R) / 64), j0 = Math.floor((p.z - R) / 64), j1 = Math.ceil((p.z + R) / 64);
    var aOff = M.sign.geometry.attributes.aOff;
    for (var i = k0; i <= k1; i++) for (var j = j0; j <= j1; j++) for (var axis = 0; axis < 2; axis++) {
      if (n >= 40) break;
      var h = hash(i * 2 + axis, j); if (h > 0.34) continue;
      var side = hash(j, i * 3 + axis) > 0.5 ? 1 : -1, kind = KINDS[Math.floor(hash(i + 7, j * 5 + axis) * KINDS.length)];
      var rx = i * 64 + 32, rz = j * 64 + 32, x, z, ang;
      // mid-block on the pavement, 5.3 m from the road centre, counter facing the pavement (away from the road)
      if (axis === 0) { x = rx + 32; z = rz + side * 5.3; ang = side > 0 ? 0 : Math.PI; }
      else { x = rx + side * 5.3; z = rz + 32; ang = side > 0 ? Math.PI / 2 : -Math.PI / 2; }
      if (Math.hypot(x - p.x, z - p.z) > R || !free(x, z) || !free(x + Math.sin(ang) * 1.6, z + Math.cos(ang) * 1.6)) continue;
      var y = W.groundAt ? W.groundAt(x, z) : 0;
      q.setFromAxisAngle(up, ang); m.compose(v.set(x, y, z), q, one);
      M.counter.setMatrixAt(n, m); M.awning.setMatrixAt(n, m); M.sign.setMatrixAt(n, m.clone().multiply(new T.Matrix4().makeTranslation(0, 2.55, 0.56)));
      M.awning.setColorAt(n, col.setHex(kind.col));
      aOff.setXY(n, 0, 1 - 0.2 - KINDS.indexOf(kind) * 0.2);
      [-1, 1].forEach(function (s) { var px = x + Math.cos(ang) * 1.05 * s, pz = z - Math.sin(ang) * 1.05 * s; m.compose(v.set(px, y, pz), q, one); M.posts.setMatrixAt(np++, m); });
      stalls.push({ kind: kind, pos: new T.Vector3(x + Math.sin(ang) * 1.3, y, z + Math.cos(ang) * 1.3), x: x, z: z, y: y, ang: ang });
      n++;
    }
    M.counter.count = M.awning.count = M.sign.count = n; M.posts.count = np;
    Object.keys(M).forEach(function (k) { M[k].instanceMatrix.needsUpdate = true; });
    M.awning.instanceColor.needsUpdate = true; aOff.needsUpdate = true;
    S.stalls = n; S.rebuilds++; center = p.clone();
  }
  // --- menu panel -------------------------------------------------------------------------------------------------
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function closePanel(why) { if (panel) { S.lastClose = why || 'other'; panel.remove(); panel = null; } openStall = null; }
  function nearestLandmark(p) {
    var best = null, bd = 1e9;
    try { (W.lmInteracts || []).concat(W.staticInteracts || []).forEach(function (it) { var d = Math.hypot(it.pos.x - p.x, it.pos.z - p.z); if (d > 20 && d < bd && it.label) { bd = d; best = it; } }); } catch (e) {}
    return best ? { name: best.label.replace(/^(Enter|Visit|Open|Go to)\s+/i, '').slice(0, 40), x: best.pos.x, z: best.pos.z, d: Math.round(bd) } : null;
  }
  function openPanel(st) {
    closePanel(); openStall = st; S.opens++;
    vendorEmote(st, 'Wave');
    var E = window.__fyrusEconomy, k = st.kind;
    panel = document.createElement('div'); panel.setAttribute('data-p22', 'stall'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', k.name);
    panel.style.cssText = 'position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:60;min-width:260px;max-width:min(92vw,360px);background:rgba(18,22,30,.92);color:#fff;border-radius:14px;padding:14px 16px;font:14px/1.35 system-ui,-apple-system,Segoe UI,Arial,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.35)';
    var html = '<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px"><b>' + esc(k.name) + '</b><button data-x style="background:none;border:0;color:#ccc;font-size:20px;cursor:pointer;min-width:36px;min-height:36px;border-radius:8px" aria-label="Close">×</button></div>';
    if (k.service) {
      var lm = nearestLandmark(W.player.root.position);
      html += '<div style="opacity:.85;margin-bottom:8px">Free city service. Ask for directions to the nearest landmark.</div>' +
        (lm ? '<button data-dir style="width:100%;padding:9px;border-radius:9px;border:0;background:#2e8a5a;color:#fff;cursor:pointer">Directions: ' + esc(lm.name) + ' (' + lm.d + ' m)</button>' : '<div>No landmark nearby.</div>');
      panel.innerHTML = html; document.body.appendChild(panel);
      var b = panel.querySelector('[data-dir]');
      if (b) b.onclick = function () { try { window.__fyrus.setState({ waypoint: { name: lm.name, x: lm.x, z: lm.z } }); if (E) E.toast('Waypoint set: ' + lm.name, 'info'); S.directions++; } catch (e) { S.errors++; } closePanel(); };
    } else {
      html += '<div style="opacity:.7;font-size:12px;margin-bottom:8px">Demo credits (FYC), not real money. Balance: ' + (E ? esc(E.fmt(E.balance())) : '-') + '</div>';
      k.items.forEach(function (it, i) { html += '<button data-i="' + i + '" style="display:flex;justify-content:space-between;width:100%;margin:4px 0;padding:9px 10px;border-radius:9px;border:0;background:#2a3140;color:#fff;cursor:pointer"><span>' + (i + 1) + '. ' + esc(it[0]) + '</span><span>' + (E ? esc(E.fmt(it[1])) : it[1]) + '</span></button>'; });
      panel.innerHTML = html; document.body.appendChild(panel);
      panel.querySelectorAll('[data-i]').forEach(function (b) { b.onclick = function () { buy(st, +b.getAttribute('data-i')); }; });
    }
    panel.querySelector('[data-x]').onclick = closePanel;
    // 23.11: keyboard users land on the first choice; Esc closes (handled below)
    var first = panel.querySelector('[data-i],[data-dir]'); if (first) { first.setAttribute('autofocus', ''); setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) {} }, 0); }
  }
  function buy(st, i) {
    var E = window.__fyrusEconomy, it = st.kind.items[i]; if (!E || !it) { S.failed++; return false; }
    var ok = E.buy('street-' + st.kind.id, it[0] + ' at ' + st.kind.name, it[1]);
    if (ok) { vendorEmote(st, st.kind.id === 'flowers' ? 'Bow' : 'Clap'); try { var D = window.__fyrusAvatarDemo; if (D && D.wave) D.wave(); } catch (e) {} S.purchases++; S.spent = Math.round((S.spent + it[1]) * 100) / 100; var C23 = window.__fyrusCarry23; if (C23) { try { C23.give(C23.kindFor(st.kind.id, it[0])); } catch (e) {} } } else S.failed++;
    closePanel(); return ok;
  }
  document.addEventListener('keydown', function (e) {
    if (!panel || !openStall) return;
    if (e.key === 'Escape') { closePanel('esc'); return; }
    var n = parseInt(e.key, 10); if (n >= 1 && n <= openStall.kind.items.length) { e.preventDefault(); buy(openStall, n - 1); }
  });
  window.__fyrusExtraInteracts = (function (prev) {
    return function () {
      var out = prev ? prev() : [];
      if (!W || W.active !== W.world) return out;
      for (var i = 0; i < stalls.length; i++) {
        (function (st) { out.push({ pos: st.pos, radius: 2.6, label: st.kind.service ? 'Ask at ' + st.kind.name : 'Browse ' + st.kind.name, action: 'shop', use: function () { openPanel(st); } }); })(stalls[i]);
      }
      return out;
    };
  })(window.__fyrusExtraInteracts);
  /* 23.5 vendors: a pool of 4 Phase 20 characters stands behind the counters of the 4 stalls nearest to the player
   * (within 45 m). They turn to face the player when they are within 6 m, wave when a menu opens, and clap / bow after a
   * purchase. Kill switch for the vendors only: ?p23off=vendors. */
  var VOFF = (Q.get('p23off') || '').split(',').some(function (k) { return k === 'vendors' || k === 'all'; });
  var VNAMES = ['fyrus20-male-formal', 'fyrus20-female-sport', 'fyrus20-base-male', 'fyrus20-female-formal'], vendors = [], vLoading = false, vAcc = 0, vLast = performance.now();
  S.vendors = 0; S.vendorEmotes = 0;
  function vload(src) { return new Promise(function (res) { var s2 = document.createElement('script'); s2.src = src; s2.onload = res; s2.onerror = res; document.head.appendChild(s2); }); }
  function vparse(u) { return fetch(u).then(function (r) { return r.arrayBuffer(); }).then(function (ab) { return new Promise(function (res, rej) { new T.GLTFLoader().parse(ab, '', res, rej); }); }); }
  async function loadVendors() {
    if (vLoading || VOFF) return; vLoading = true;
    try {
      if (!T.GLTFLoader) await vload('/fyrus-gltf-loader.js?v=1.0.0');
      if (!window.__fyrusLoco20) await vload('/fyrus-avatar20.js?v=20.16');
      for (var i = 0; i < VNAMES.length; i++) {
        var H32 = window.__fyrusHuman32;
        if (H32) {   // 32.1: procedural human vendors
          var lk = H32.lookFromOutfit({ gender: i % 2 ? 'f' : 'm' }, 'vendor' + i); lk.outfit = ['formal', 'sport', 'base', 'formal'][i % 4];
          var inst = await H32.create(lk).catch(function () { return null; });   // 32.11: fall back to fyrus20 if human32 fails
          if (inst) { inst.group.name = 'p23-vendor'; vendors.push({ grp: inst.group, lod: inst.lod, st: null, yaw: 0 }); S.vendors++; continue; }
        }
        var b = '/assets/characters/fyrus20/' + VNAMES[i], g = await Promise.all([vparse(b + '.glb'), vparse(b + '-a2.glb'), vparse(b + '-a3.glb')]);
        var grp = new T.Group(), tiers = { a1: g[0].scene, a2: g[1].scene, a3: g[2].scene }; grp.name = 'p23-vendor';
        Object.keys(tiers).forEach(function (k) { tiers[k].traverse(function (o) { if (o.isMesh) { o.castShadow = k === 'a1'; o.userData.noBatch = o.userData.noInstance = true; } }); grp.add(tiers[k]); });
        vendors.push({ grp: grp, lod: window.__fyrusLoco20.lodGroup(tiers, g[0].animations), st: null, yaw: 0 }); S.vendors++;
      }
    } catch (e) { S.errors++; S.lastError = 'vendors ' + (e && e.message || e); }
  }
  function vendorEmote(st, name) { var v = vendors.find(function (x) { return x.st === st; }); if (v && v.lod.emote(name)) S.vendorEmotes++; }
  function vendorTick() {
    var now = performance.now(), dt = Math.min(0.1, (now - vLast) / 1000); vLast = now; if (!vendors.length) return;
    var p = W.player.root.position, inWorld = W.active === W.world;
    if ((vAcc += dt) > 0.5) {                     // re-assign the pool to the nearest stalls twice a second
      vAcc = 0;
      var near = stalls.filter(function (s) { return Math.hypot(s.x - p.x, s.z - p.z) < 45; }).sort(function (a, b) { return Math.hypot(a.x - p.x, a.z - p.z) - Math.hypot(b.x - p.x, b.z - p.z); }).slice(0, vendors.length);
      vendors.forEach(function (v) { if (v.st && near.indexOf(v.st) < 0) v.st = null; });
      near.forEach(function (st) { if (vendors.some(function (v) { return v.st === st; })) return; var v = vendors.find(function (x) { return !x.st; }); if (v) { v.st = st; v.yaw = st.ang; } });
    }
    var cam = W.camera.getWorldPosition(new T.Vector3());
    vendors.forEach(function (v) {
      var show = inWorld && !!v.st;
      if (show && v.grp.parent !== W.world) W.world.add(v.grp); if (!show) { if (v.grp.parent) v.grp.parent.remove(v.grp); return; }
      var st = v.st, vx = st.x - Math.sin(st.ang) * 0.75, vz = st.z - Math.cos(st.ang) * 0.75;
      v.grp.position.set(vx, st.y, vz);
      var want = Math.hypot(p.x - vx, p.z - vz) < 6 ? Math.atan2(p.x - vx, p.z - vz) : st.ang, dy = ((want - v.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      v.yaw += dy * Math.min(1, dt * 4); v.grp.rotation.y = v.yaw;
      v.lod.update(dt, cam, 0, 0, 0);
    });
  }
  API.vendors = function () { return vendors.map(function (v) { return v.st ? { stall: v.st.kind.id, tier: v.lod.tier() } : null; }); };
  function tick() {
    if (!VOFF) { if (!vLoading && W && W.player) loadVendors(); try { vendorTick(); } catch (e) { S.errors++; S.lastError = 'vendorTick ' + (e && e.message || e); } }
    var t0 = performance.now();
    var inWorld = W.active === W.world;
    Object.keys(M).forEach(function (k) { var x = M[k]; if (inWorld && x.parent !== W.world) W.world.add(x); if (!inWorld && x.parent) x.parent.remove(x); });
    if (!inWorld) { closePanel('scene'); return; }
    var p = W.player.root.position;
    if (!center || center.distanceTo(p) > 48) place();
    if (openStall && openStall.pos.distanceTo(p) > 4.5) closePanel('distance ' + openStall.pos.distanceTo(p).toFixed(1));
    S.ms = Math.round((S.ms * 0.95 + (performance.now() - t0) * 0.05) * 1000) / 1000;
  }
  API.selfTest = function () {
    // dev/bench check: open the nearest stall's menu and buy its first item through the real wallet path
    var r = { stalls: stalls.length };
    var shop = stalls.filter(function (s) { return !s.kind.service; })[0]; if (!shop) return r;
    var E = window.__fyrusEconomy; r.before = E ? E.balance() : null;
    openPanel(shop); r.panel = !!document.querySelector('[data-p22=stall]');
    r.ok = buy(shop, 0); r.after = E ? E.balance() : null; r.item = shop.kind.items[0];
    var info = stalls.filter(function (s) { return s.kind.service; })[0];
    if (info) { openPanel(info); r.infoPanel = !!document.querySelector('[data-p22=stall]'); closePanel(); }
    r.interacts = window.__fyrusExtraInteracts().length;
    return r;
  };
  function start() {
    T = window.THREE; W = window.__fyrusW; build();
    var r = W.renderer, orig = r.render;
    r.render = function () { try { tick(); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); } return orig.apply(this, arguments); };
    S.hooked = true;
  }
  (function wait() { var w = window.__fyrusW; if (w && w.renderer && w.player && w.world && window.THREE) start(); else setTimeout(wait, 500); })();
})();
