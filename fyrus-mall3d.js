/* Fyrus — 3D Store (v1.0)
   Walk your own avatar into a brand's store in Fyrus Market. Every product stands on a holographic
   pedestal; the 4D slider plays its assembly over time (assembled ⟷ exploded view).
   "View & buy" opens the existing product page, so prices, escrow and checkout are unchanged.
   API: window.__fyrusMall3D.open({ brandId }) */
(function () {
  'use strict';
  if (window.__fyrusMall3D) return;
  var API = window.__fyrusMall3D = { version: '1.0.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var css = '' +
    '.fxm{position:fixed;inset:0;z-index:2147483060;background:#05070d;color:' + IVORY + ';font-family:"Plus Jakarta Sans",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '.fxm canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fxm-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:16px max(16px,env(safe-area-inset-left,0px));pointer-events:none}' +
    '.fxm-k{font:500 11px "JetBrains Mono",monospace;letter-spacing:.32em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fxm-t{font:400 clamp(28px,5vw,46px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.05em;margin-top:6px}' +
    '.fxm-r{display:flex;flex-direction:column;align-items:flex-end;gap:8px;pointer-events:auto}' +
    '.fxm-b{border-radius:999px;border:1px solid rgba(201,169,110,.5);background:rgba(10,15,26,.7);color:' + GOLD_HI + ';font:600 11px Sora,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:9px 14px;cursor:pointer}' +
    '.fxm-hint{position:absolute;left:50%;top:84px;transform:translateX(-50%);font:500 10px "JetBrains Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:' + MUTED + ';pointer-events:none;text-align:center;width:90%}' +
    '.fxm-card{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(620px,calc(100% - 32px));background:rgba(10,15,26,.86);border:1px solid rgba(201,169,110,.35);border-radius:18px;padding:14px 16px;display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '.fxm-card b{display:block;font:600 17px Sora,sans-serif}.fxm-card small{display:block;color:' + MUTED + ';font-size:12.5px;margin-top:2px}' +
    '.fxm-card .pr{font:500 11px "JetBrains Mono",monospace;letter-spacing:.18em;color:' + GOLD_HI + ';margin-top:5px}' +
    '.fxm-card label{display:flex;align-items:center;gap:8px;font:500 10px "JetBrains Mono",monospace;letter-spacing:.16em;color:' + MUTED + ';margin-top:8px;text-transform:uppercase}' +
    '.fxm-card input{flex:1;accent-color:' + GOLD + '}' +
    '.fxm-nav{display:flex;gap:6px}.fxm-nav button,.fxm-act{border-radius:999px;border:1px solid rgba(201,169,110,.5);background:transparent;color:' + GOLD_HI + ';font:600 12px Sora,sans-serif;letter-spacing:.12em;cursor:pointer;padding:11px 13px;white-space:nowrap}' +
    '.fxm-act{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408;text-transform:uppercase}' +
    '.fxm-stick{position:absolute;left:22px;bottom:170px;width:110px;height:110px;border-radius:50%;border:1px solid rgba(201,169,110,.4);background:rgba(10,15,26,.35);display:none;touch-action:none}' +
    '.fxm-stick i{position:absolute;left:32px;top:32px;width:46px;height:46px;border-radius:50%;background:rgba(232,213,168,.6)}.fxm.touch .fxm-stick{display:block}' +
    '@media (max-width:560px){.fxm-card{grid-template-columns:1fr;text-align:center}.fxm-nav{justify-content:center}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) { var e = document.createElement(tag); if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); } (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }); return e; }
  function sign(T, text, color, w) { var c = document.createElement('canvas'); c.width = 1024; c.height = 192; var g = c.getContext('2d'); g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 120px "Bebas Neue", Sora, sans-serif'; g.shadowColor = color; g.shadowBlur = 26; g.fillStyle = '#ffffff'; g.fillText(text.toUpperCase(), 512, 100); return new T.Mesh(new T.PlaneGeometry(w, w * .1875), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false })); }
  function plaque(T, name, price) { var c = document.createElement('canvas'); c.width = 512; c.height = 160; var g = c.getContext('2d'); g.fillStyle = 'rgba(10,15,26,.85)'; g.fillRect(0, 0, 512, 160); g.strokeStyle = GOLD; g.lineWidth = 4; g.strokeRect(4, 4, 504, 152); g.fillStyle = '#fff'; g.font = '600 40px Sora, sans-serif'; g.textAlign = 'center'; g.fillText(name.length > 22 ? name.slice(0, 21) + '…' : name, 256, 70); g.fillStyle = GOLD_HI; g.font = '500 30px "JetBrains Mono", monospace'; g.fillText(price, 256, 122); return new T.CanvasTexture(c); }
  function brands() { var s = S(); return ((s && s.brands) || []).filter(function (b) { return b && b.products && b.products.length; }); }
  function fyc(n) { return (Math.round(n * 100) / 100).toLocaleString('en-US') + ' FYC'; }

  var running = false;
  API.open = function (opts) {
    opts = opts || {}; var T = window.THREE; var list = brands(); if (!T || running || !list.length) return; running = true;
    var bi = Math.max(0, list.findIndex(function (b) { return b.id === opts.brandId; }));
    var touch = matchMedia('(pointer:coarse)').matches;
    var root = el('div', { 'class': 'fxm fxp-ov' + (touch ? ' touch' : ''), role: 'dialog', 'aria-label': '3D store' });
    var canvas = el('canvas'); root.appendChild(canvas);
    var kEl = el('div', { 'class': 'fxm-k' }), tEl = el('div', { 'class': 'fxm-t' });
    var closeB = el('button', { 'class': 'fxm-b' }, ['Close · Esc']), prevS = el('button', { 'class': 'fxm-b' }, ['‹ Store']), nextS = el('button', { 'class': 'fxm-b' }, ['Store ›']);
    root.appendChild(el('div', { 'class': 'fxm-top' }, [el('div', null, [kEl, tEl]), el('div', { 'class': 'fxm-r' }, [closeB, el('div', { style: 'display:flex;gap:6px' }, [prevS, nextS])])]));
    var hint = el('div', { 'class': 'fxm-hint' }); root.appendChild(hint);
    var stick = el('div', { 'class': 'fxm-stick' }, [el('i')]); root.appendChild(stick);
    var nameEl = el('b'), subEl = el('small'), prEl = el('div', { 'class': 'pr' }), slider = el('input', { type: 'range', min: '0', max: '1', step: '.01', value: '0', 'aria-label': '4D assembly' });
    var prevP = el('button', { 'aria-label': 'Previous product' }, ['‹']), nextP = el('button', { 'aria-label': 'Next product' }, ['›']), act = el('button', { 'class': 'fxm-act' }, ['View & buy']);
    root.appendChild(el('div', { 'class': 'fxm-card' }, [el('div', { 'class': 'fxm-nav' }, [prevP, nextP]), el('div', null, [nameEl, subEl, prEl, el('label', null, ['4D · assembled', slider, 'exploded'])]), act]));
    document.body.appendChild(root);

    var renderer = null;
    [{ antialias: true }, { antialias: false, powerPreference: 'low-power' }].some(function (o) { try { o.canvas = canvas; renderer = new T.WebGLRenderer(o); return true; } catch (e) { return false; } });
    if (!renderer) { root.remove(); running = false; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.25 : 1.75)); if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    var camera = new T.PerspectiveCamera(56, 1, .1, 120);
    var scene, room, peds = [], boxes = [], sel = 0, explode = 0, autoExplode = true;
    var W = 9, Z0 = 12, Z1 = -14, H = 6.5;
    var me = { x: 0, z: Z0 - 2, yaw: Math.PI, ph: 0, moving: false }, avatar, legs = [], arms = [], auto = null, keys = {}, stickV = { x: 0, y: 0 }, camYaw = 0, camPitch = .34, camDist = 4.8;
    var camPos = new T.Vector3(0, 3, Z0), camLook = new T.Vector3(0, 1.4, 0), t0 = performance.now(), last = t0, raf = 0, ray = new T.Raycaster(), ndc = new T.Vector2();

    function makeAvatar() {
      var Wd = window.__fyrusW, P = Wd && Wd.player;
      if (P && P.root) { try {
        var c = P.root.clone(true); c.position.set(0, 0, 0); c.rotation.set(0, 0, 0); c.visible = true;
        var path = function (o) { var p = []; while (o && o !== P.root) { p.unshift(o.parent.children.indexOf(o)); o = o.parent; } return o === P.root ? p : null; };
        var get = function (p) { var o = c; for (var i = 0; i < p.length; i++) o = o && o.children[p[i]]; return o; };
        (P.legs || []).forEach(function (l) { var p = path(l); if (p && get(p)) legs.push(get(p)); }); (P.arms || []).forEach(function (l) { var p = path(l); if (p && get(p)) arms.push(get(p)); });
        c.traverse(function (o) { o.userData.__shared = true; }); return c; } catch (e) {} }
      var g = new T.Group(), cl = new T.MeshStandardMaterial({ color: 0x1b2a4a }); var b = new T.Mesh(new T.CylinderGeometry(.22, .26, .8, 10), cl); b.position.y = 1.25; g.add(b); var h = new T.Mesh(new T.SphereGeometry(.15, 12, 10), new T.MeshStandardMaterial({ color: 0xd6a77e })); h.position.y = 1.82; g.add(h);
      [-1, 1].forEach(function (sx) { var lg = new T.Group(); lg.position.set(sx * .11, .86, 0); var m = new T.Mesh(new T.CylinderGeometry(.07, .07, .84, 8), cl); m.position.y = -.42; lg.add(m); g.add(lg); legs.push(lg); var ar = new T.Group(); ar.position.set(sx * .3, 1.58, 0); var a2 = new T.Mesh(new T.CylinderGeometry(.055, .055, .62, 8), cl); a2.position.y = -.31; ar.add(a2); g.add(ar); arms.push(ar); });
      return g;
    }
    function buildStore() {
      if (scene) scene.traverse(function (o) { if (o.userData && o.userData.__shared) return; if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose && o.material.dispose(); } });
      var b = list[bi], col = new T.Color(b.color || '#4da3ff'), facade = new T.Color(b.facade || '#e8dcc5');
      scene = new T.Scene(); scene.background = new T.Color(0x05070d); scene.fog = new T.Fog(0x05070d, 22, 50);
      scene.add(new T.HemisphereLight(0xfff2e0, 0x1a1420, .8));
      var key = new T.DirectionalLight(0xffffff, .5); key.position.set(3, 8, 6); scene.add(key);
      peds = []; boxes = [];
      kEl.textContent = 'Fyrus Market · ' + (b.category || 'Store') + (b.sample ? ' · Sample store' : '');
      tEl.textContent = b.name;
      var floor = new T.Mesh(new T.PlaneGeometry(W * 2, Z0 - Z1), new T.MeshStandardMaterial({ color: 0xece6dc, roughness: .18, metalness: .1 })); floor.rotation.x = -Math.PI / 2; floor.position.z = (Z0 + Z1) / 2; scene.add(floor); room = floor;
      var inlay = new T.Mesh(new T.PlaneGeometry(2.4, Z0 - Z1 - 4), new T.MeshStandardMaterial({ color: col, roughness: .3, metalness: .3, emissive: col, emissiveIntensity: .12 })); inlay.rotation.x = -Math.PI / 2; inlay.position.set(0, .01, (Z0 + Z1) / 2); scene.add(inlay);
      var wallM = new T.MeshStandardMaterial({ color: facade, roughness: .8 });
      [[-W, Math.PI / 2], [W, -Math.PI / 2]].forEach(function (w) { var m = new T.Mesh(new T.PlaneGeometry(Z0 - Z1, H), wallM); m.position.set(w[0], H / 2, (Z0 + Z1) / 2); m.rotation.y = w[1]; scene.add(m); });
      var back = new T.Mesh(new T.PlaneGeometry(W * 2, H), new T.MeshStandardMaterial({ color: 0x0f1626, roughness: .7 })); back.position.set(0, H / 2, Z1); scene.add(back);
      var front = new T.Mesh(new T.PlaneGeometry(W * 2, H), wallM); front.position.set(0, H / 2, Z0); front.rotation.y = Math.PI; scene.add(front);
      var ceil = new T.Mesh(new T.PlaneGeometry(W * 2, Z0 - Z1), new T.MeshStandardMaterial({ color: 0xf4efe6, roughness: 1 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, (Z0 + Z1) / 2); scene.add(ceil);
      for (var z = Z0 - 3; z > Z1 + 1; z -= 3.5) { var lp = new T.Mesh(new T.CylinderGeometry(.5, .5, .05, 24), new T.MeshBasicMaterial({ color: 0xfff6e6 })); lp.position.set(0, H - .03, z); scene.add(lp); }
      [-1, 1].forEach(function (sd) { var strip = new T.Mesh(new T.BoxGeometry(.06, .06, Z0 - Z1), new T.MeshBasicMaterial({ color: col })); strip.position.set(sd * (W - .05), .3, (Z0 + Z1) / 2); scene.add(strip); var s2 = strip.clone(); s2.position.y = H - .3; scene.add(s2); });
      var sg = sign(T, b.name, '#' + col.getHexString(), 9); sg.position.set(0, 4.4, Z1 + .05); scene.add(sg);
      var tag = sign(T, b.tagline || '', '#ffffff', 7); tag.scale.setScalar(.5); tag.position.set(0, 3.3, Z1 + .05); scene.add(tag);
      var spot = new T.PointLight(col, 1.2, 18, 2); spot.position.set(0, 4, Z1 + 4); scene.add(spot);
      /* product pedestals: alternating left and right of the central inlay */
      var model = window.__fyrusProductModel;
      b.products.slice(0, 10).forEach(function (pr, i) {
        var side = i % 2 ? 1 : -1, row = Math.floor(i / 2), x = side * 4.6, z = Z0 - 5 - row * 4;
        var g = new T.Group(); g.position.set(x, 0, z); scene.add(g);
        var pedU = { t: { value: 0 }, c: { value: col.clone() } };
        var ped = new T.Mesh(new T.CylinderGeometry(1.0, 1.15, .9, 48), new T.MeshStandardMaterial({ color: 0x141c2e, metalness: .7, roughness: .25 })); ped.position.y = .45; g.add(ped);
        var holo = new T.Mesh(new T.CircleGeometry(.98, 48), new T.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: pedU, vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }', fragmentShader: 'uniform float t; uniform vec3 c; varying vec2 vUv; void main(){ float d = length(vUv-.5); float rings = sin(d*48. - t*4.)*.5+.5; float a = smoothstep(.5,.1,d)*(.25+.6*rings); gl_FragColor = vec4(c, a); }' }));
        holo.rotation.x = -Math.PI / 2; holo.position.y = .91; g.add(holo);
        var cone = new T.Mesh(new T.CylinderGeometry(.3, 1, 2.2, 32, 1, true), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: .07, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); cone.position.y = 2; g.add(cone);
        var obj = null;
        try { obj = model ? model(pr) : null; } catch (e) { obj = null; }
        if (!obj) { obj = new T.Mesh(new T.BoxGeometry(.6, .6, .6), new T.MeshStandardMaterial({ color: pr.color || '#ffffff' })); }
        var bb = new T.Box3().setFromObject(obj), sz = bb.getSize(new T.Vector3()), ctr = bb.getCenter(new T.Vector3());
        var scale = 1.1 / Math.max(sz.x, sz.y, sz.z, .01); var holder = new T.Group(); obj.position.sub(ctr); holder.add(obj); holder.scale.setScalar(scale); holder.position.y = 1.55; g.add(holder);
        var parts = []; obj.traverse(function (o) { if (o.isMesh) { var wc = new T.Box3().setFromObject(o).getCenter(new T.Vector3()); var dir = wc.sub(ctr); if (dir.lengthSq() < 1e-6) dir.set(Math.random() - .5, .5, Math.random() - .5); parts.push({ m: o, base: o.position.clone(), dir: dir.normalize() }); } });
        var pl = new T.Mesh(new T.PlaneGeometry(1.6, .5), new T.MeshBasicMaterial({ map: plaque(T, pr.name, fyc(pr.price)), transparent: true })); pl.position.set(-side * 1.02, .55, 0); pl.rotation.y = -side * Math.PI / 2; g.add(pl);
        g.userData = { idx: i };
        boxes.push({ x0: x - 1.2, x1: x + 1.2, z0: z - 1.2, z1: z + 1.2 });
        peds.push({ g: g, pr: pr, holder: holder, parts: parts, u: pedU, pos: new T.Vector3(x, 0, z), side: side });
      });
      boxes.push({ x0: -2.2, x1: 2.2, z0: Z1 + .5, z1: Z1 + 2.5 });
      var counter = new T.Mesh(new T.BoxGeometry(4, 1.1, 1), new T.MeshStandardMaterial({ color: 0x141c2e, metalness: .5, roughness: .3 })); counter.position.set(0, .55, Z1 + 1.5); scene.add(counter);
      var ctop = new T.Mesh(new T.BoxGeometry(4.1, .06, 1.05), new T.MeshBasicMaterial({ color: col })); ctop.position.set(0, 1.13, Z1 + 1.5); scene.add(ctop);
      if (!avatar) avatar = makeAvatar(); scene.add(avatar);
      var you = new T.Mesh(new T.RingGeometry(.42, .5, 40), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .9, side: T.DoubleSide, depthWrite: false })); you.rotation.x = -Math.PI / 2; you.position.y = .03; scene.add(you); scene.userData.you = you;
      me.x = 0; me.z = Z0 - 2; me.yaw = Math.PI; camYaw = 0; auto = null; sel = 0;
      select(0, true);
    }
    function blocked(x, z, r) { if (x < -W + .5 || x > W - .5 || z > Z0 - .5 || z < Z1 + .5) return true; for (var i = 0; i < boxes.length; i++) { var b = boxes[i]; if (x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r) return true; } return false; }
    function standPoint(p) { return { x: p.pos.x - p.side * 1.75, z: p.pos.z }; }
    function stepTo(o, tx, tz, sp, dt, r) { var dx = tx - o.x, dz = tz - o.z, d = Math.hypot(dx, dz); if (d < .05) return true; var s2 = Math.min(d, sp * dt), nx = o.x + dx / d * s2, nz = o.z + dz / d * s2; if (!blocked(nx, nz, r)) { o.x = nx; o.z = nz; } else if (!blocked(nx, o.z, r)) o.x = nx; else if (!blocked(o.x, nz, r)) o.z = nz; else return true; o.face = Math.atan2(dx, dz); return d < .12; }
    function select(i, quiet) {
      if (!peds.length) return; sel = (i + peds.length) % peds.length; var p = peds[sel].pr, b = list[bi];
      nameEl.textContent = p.name; subEl.textContent = p.desc || ''; prEl.textContent = fyc(p.price) + (b.sample ? ' · sample listing' : '');
      updateAct();
    }
    function atPed() { var p = standPoint(peds[sel]); return Math.hypot(me.x - p.x, me.z - p.z) < 1.1; }
    function updateAct() { act.textContent = atPed() ? 'View & buy' : 'Walk there'; }
    function walkToSel() { var p = standPoint(peds[sel]); auto = { path: [{ x: me.x * .2, z: me.z }, { x: p.x * .5, z: p.z }, p], idx: 0, face: peds[sel].side > 0 ? Math.PI / 2 : -Math.PI / 2 }; }
    function pose(ph, amp) { var s = Math.sin(ph) * amp; if (legs[0]) legs[0].rotation.x = s; if (legs[1]) legs[1].rotation.x = -s; if (arms[0]) arms[0].rotation.x = -s * .8; if (arms[1]) arms[1].rotation.x = s * .8; }
    function size() { var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    var drag = false, down = null;
    function frame(now) {
      if (!running) return;
      var dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = Math.max(last, now); var t = (now - t0) / 1000;
      var fx = 0, fz = 0; if (keys.w || keys.arrowup) fz += 1; if (keys.s || keys.arrowdown) fz -= 1; if (keys.a || keys.arrowleft) fx -= 1; if (keys.d || keys.arrowright) fx += 1; fx += stickV.x; fz -= stickV.y;
      me.moving = false;
      if (Math.hypot(fx, fz) > .1) { auto = null; var sn = Math.sin(camYaw), cs = Math.cos(camYaw), vx = -fz * sn + fx * cs, vz = -fz * cs - fx * sn, L = Math.hypot(vx, vz) || 1; stepTo(me, me.x + vx / L * 2, me.z + vz / L * 2, keys.shift ? 6 : 3.2, dt, .35); me.yaw = me.face; me.moving = true; }
      else if (auto) { var wp = auto.path[auto.idx]; if (wp) { if (stepTo(me, wp.x, wp.z, 3.2, dt, .35)) auto.idx++; me.yaw = me.face; me.moving = true; } else me.yaw += ((auto.face - me.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 6); }
      if (me.moving) me.ph += dt * 9; pose(me.ph, me.moving ? .5 : 0);
      avatar.position.set(me.x, 0, me.z); avatar.rotation.y += ((me.yaw - avatar.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 10);
      scene.userData.you.position.set(me.x, .03, me.z);
      var near = -1, nd = 1.4; peds.forEach(function (p, i) { var s = standPoint(p), d = Math.hypot(s.x - me.x, s.z - me.z); if (d < nd) { nd = d; near = i; } }); if (near >= 0 && near !== sel) select(near, true);
      var standing = atPed(); updateAct();
      hint.textContent = standing ? (touch ? 'Tap View & buy · slide 4D to see how it is made' : 'Press E to view & buy · move the 4D slider to see how it is made') : (touch ? 'Joystick to walk · tap a product to walk to it' : 'WASD to walk · drag to turn · click a product to walk to it');
      if (me.moving && !drag) camYaw += ((me.yaw + Math.PI - camYaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 1.6);
      if (standing && !me.moving && !drag) camYaw += ((me.yaw + Math.PI - .4 * peds[sel].side - camYaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 2);
      var want = new T.Vector3(me.x + Math.sin(camYaw) * camDist * Math.cos(camPitch), 2 + Math.sin(camPitch) * camDist, me.z + Math.cos(camYaw) * camDist * Math.cos(camPitch));
      want.x = Math.max(-W + .4, Math.min(W - .4, want.x)); want.z = Math.max(Z1 + .4, Math.min(Z0 - .3, want.z)); want.y = Math.min(H - .4, want.y);
      camPos.lerp(want, Math.min(1, dt * 5)); camLook.lerp(new T.Vector3(me.x, 1.45, me.z), Math.min(1, dt * 8)); camera.position.copy(camPos); camera.lookAt(camLook);
      /* products: rotate, float; 4D = explode/assemble over time */
      if (autoExplode) explode = (Math.sin(t * .6) + 1) / 2 * .55; else explode = +slider.value;
      peds.forEach(function (p, i) {
        p.u.t.value = t; p.holder.rotation.y = t * .5 + i; p.holder.position.y = 1.55 + Math.sin(t * 1.5 + i) * .05;
        var e = i === sel ? explode : 0;
        p.parts.forEach(function (q) { q.m.position.copy(q.base).addScaledVector(q.dir, e * .9); });
      });
      if (autoExplode) slider.value = String(explode);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function dispose() { try { scene.remove(avatar); scene.traverse(function (o) { if (o.userData && o.userData.__shared) return; if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose && o.material.dispose(); } }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {} }
    function finish(view) {
      if (!running) return; running = false; cancelAnimationFrame(raf);
      removeEventListener('resize', size); removeEventListener('keydown', onKey, true); removeEventListener('keyup', onKeyUp, true);
      dispose(); root.remove();
      if (view) { try { window.__fyrus.setState({ productView: view }); } catch (e) {} }
    }
    API.close = function () { finish(null); };
    function tryView() { if (!peds.length) return; if (atPed()) finish({ brandId: list[bi].id, productId: peds[sel].pr.id }); else walkToSel(); }
    function onKey(e) { var k = e.key.toLowerCase(); e.stopPropagation(); if (k === 'escape') { e.preventDefault(); finish(null); return; } if (k === 'e' || k === 'enter') { e.preventDefault(); tryView(); return; } keys[k] = true; if (k.indexOf('arrow') === 0 || k === ' ') e.preventDefault(); }
    function onKeyUp(e) { keys[e.key.toLowerCase()] = false; e.stopPropagation(); }
    prevP.onclick = function () { select(sel - 1); walkToSel(); }; nextP.onclick = function () { select(sel + 1); walkToSel(); };
    act.onclick = tryView; closeB.onclick = function () { finish(null); };
    prevS.onclick = function () { bi = (bi - 1 + list.length) % list.length; buildStore(); }; nextS.onclick = function () { bi = (bi + 1) % list.length; buildStore(); };
    slider.addEventListener('input', function () { autoExplode = false; }); slider.addEventListener('pointerdown', function (e) { e.stopPropagation(); });
    canvas.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY, yaw: camYaw, pitch: camPitch }; });
    canvas.addEventListener('pointermove', function (e) { if (!down) return; var mx = e.clientX - down.x, my = e.clientY - down.y; if (Math.abs(mx) + Math.abs(my) > 6) drag = true; if (drag) { camYaw = down.yaw - mx * .006; camPitch = Math.max(.08, Math.min(1.1, down.pitch + my * .004)); } });
    canvas.addEventListener('pointerup', function (e) {
      var wasDrag = drag; drag = false; if (!down) return; down = null; if (wasDrag) return;
      var r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObjects(peds.map(function (p) { return p.g; }), true);
      if (hits.length) { var o = hits[0].object; while (o && o.userData.idx == null) o = o.parent; if (o) { if (o.userData.idx === sel && atPed()) tryView(); else { select(o.userData.idx); walkToSel(); } } return; }
      var fh = ray.intersectObject(room); if (fh.length) auto = { path: [{ x: fh[0].point.x, z: fh[0].point.z }], idx: 0, face: me.yaw };
    });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); camDist = Math.max(2.5, Math.min(9, camDist * (1 + Math.sign(e.deltaY) * .1))); }, { passive: false });
    var sid = null, knob = stick.querySelector('i');
    stick.addEventListener('pointerdown', function (e) { sid = e.pointerId; stick.setPointerCapture(sid); e.stopPropagation(); });
    stick.addEventListener('pointermove', function (e) { if (e.pointerId !== sid) return; var r = stick.getBoundingClientRect(), dx = e.clientX - (r.left + 55), dy = e.clientY - (r.top + 55), L = Math.hypot(dx, dy); if (L > 42) { dx *= 42 / L; dy *= 42 / L; } knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; stickV = { x: dx / 42, y: dy / 42 }; });
    stick.addEventListener('pointerup', function () { sid = null; stickV = { x: 0, y: 0 }; knob.style.transform = ''; });
    addEventListener('resize', size); addEventListener('keydown', onKey, true); addEventListener('keyup', onKeyUp, true);
    size(); buildStore(); raf = requestAnimationFrame(frame);
  };
})();
