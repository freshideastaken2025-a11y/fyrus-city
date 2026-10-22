/* Fyrus — 3D Arcade Hall (v1.0)
   A walk-up neon hall on Game Street: every game is a glowing 3D cabinet with a live screen.
   Pick a cabinet (click / arrows / swipe) and press Play to start the real game.
   Additive: the games themselves are unchanged. Opened from Games ("Enter the 3D Arcade Hall"),
   from search ("Arcade Hall") or window.__fyrusHall.open(). */
(function () {
  'use strict';
  if (window.__fyrusHall) return;
  var API = window.__fyrusHall = { version: '1.0.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var FALLBACK = [
    { id: 'hockey', name: 'Neon Air Hockey', tag: 'First to 5 goals', players: '1P vs AI · 2P same keyboard', ready: true, color: '#4da3ff' },
    { id: 'race', name: 'Street Race', tag: '3 laps, real cars, 3D track', players: 'vs 3 AI drivers · online with a friend', ready: true, color: '#e53935' },
    { id: 'chess', name: 'Fyrus Chess', tag: 'Real chess with every rule', players: 'vs computer · same screen · online friend', ready: true, color: '#d6c29a' },
    { id: 'connect4', name: 'Four in a Row', tag: 'Drop discs, connect four', players: 'vs computer · same screen · online friend', ready: true, color: '#f1c40f' },
    { id: 'catcher', name: 'Orb Catcher', tag: '60 seconds, catch the orbs', players: '1P score attack', ready: true, color: '#7fd1ff' },
    { id: 'trivia', name: 'AI Trivia Duel', tag: '10 questions vs a rival', players: '1P vs AI', ready: true, color: '#45e0ae' }
  ];
  function games() { var g = window.__fyrusGames; return (Array.isArray(g) && g.length) ? g : FALLBACK; }
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };

  var css = '' +
    '.fxh{position:fixed;inset:0;z-index:2147483060;background:#03060c;color:' + IVORY + ';font-family:"Plus Jakarta Sans",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '.fxh canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fxh-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:16px max(16px,env(safe-area-inset-left,0px));pointer-events:none}' +
    '.fxh-k{font:500 11px "JetBrains Mono",monospace;letter-spacing:.32em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fxh-t{font:400 clamp(30px,5vw,48px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;margin-top:6px}' +
    '.fxh-x{pointer-events:auto;border-radius:999px;border:1px solid rgba(201,169,110,.5);background:rgba(10,15,26,.7);color:' + GOLD_HI + ';font:600 11px Sora,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:10px 16px;cursor:pointer}' +
    '.fxh-card{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(560px,calc(100% - 32px));background:rgba(10,15,26,.82);border:1px solid rgba(201,169,110,.35);border-radius:18px;padding:16px 18px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center}' +
    '.fxh-card b{display:block;font:600 18px Sora,sans-serif}' +
    '.fxh-card small{display:block;color:' + MUTED + ';font-size:12.5px;margin-top:3px;line-height:1.4}' +
    '.fxh-card .best{font:500 10px "JetBrains Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD_HI + ';margin-top:6px}' +
    '.fxh-nav{display:flex;gap:6px}' +
    '.fxh-nav button,.fxh-play{border-radius:999px;border:1px solid rgba(201,169,110,.5);background:transparent;color:' + GOLD_HI + ';font:600 12px Sora,sans-serif;letter-spacing:.14em;cursor:pointer;padding:12px 14px}' +
    '.fxh-play{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408;padding:13px 22px;text-transform:uppercase}' +
    '.fxh-play[disabled]{opacity:.5;cursor:default}' +
    '.fxh button:focus-visible{outline:2px solid ' + GOLD_HI + ';outline-offset:2px}' +
    '@media (max-width:560px){.fxh-card{grid-template-columns:1fr;text-align:center}.fxh-nav{justify-content:center}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  /* ---- live screen painters: each draws a small looping preview of its game ---- */
  function painter(id, color) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 384; var g = c.getContext('2d');
    var orbs = [], drops = [];
    return { canvas: c, draw: function (t, on) {
      g.fillStyle = '#050b16'; g.fillRect(0, 0, 512, 384);
      g.save();
      if (id === 'hockey') {
        g.strokeStyle = color; g.lineWidth = 4; g.strokeRect(24, 24, 464, 336); g.beginPath(); g.moveTo(256, 24); g.lineTo(256, 360); g.stroke();
        g.beginPath(); g.arc(256, 192, 50, 0, 7); g.stroke();
        var px = 256 + Math.sin(t * 2.1) * 200, py = 192 + Math.sin(t * 3.3) * 140;
        g.shadowColor = color; g.shadowBlur = 20; g.fillStyle = '#ffffff'; g.beginPath(); g.arc(px, py, 14, 0, 7); g.fill();
        g.fillStyle = color; g.beginPath(); g.arc(70, py * .7 + 58, 26, 0, 7); g.fill(); g.fillStyle = '#ff6b9a'; g.beginPath(); g.arc(442, 192 + Math.sin(t * 2.6) * 120, 26, 0, 7); g.fill();
      } else if (id === 'race') {
        var gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, '#1b0b20'); gr.addColorStop(.45, '#ff6a3c'); gr.addColorStop(.46, '#121722'); gr.addColorStop(1, '#0b0e14'); g.fillStyle = gr; g.fillRect(0, 0, 512, 384);
        g.fillStyle = '#20242e'; g.beginPath(); g.moveTo(236, 175); g.lineTo(276, 175); g.lineTo(470, 384); g.lineTo(42, 384); g.fill();
        g.fillStyle = '#ffd36b'; for (var i = 0; i < 8; i++) { var z = ((i / 8) + t * .9) % 1, y = 175 + z * z * 209, w = 2 + z * 10, h = 4 + z * 26; g.fillRect(256 - w / 2, y, w, h); }
        g.shadowColor = color; g.shadowBlur = 18; g.fillStyle = color; var cx = 256 + Math.sin(t * 1.4) * 60; g.fillRect(cx - 40, 300, 80, 44); g.fillStyle = '#fff'; g.fillRect(cx - 34, 336, 14, 6); g.fillRect(cx + 20, 336, 14, 6);
      } else if (id === 'chess') {
        for (var r = 0; r < 8; r++) for (var q = 0; q < 8; q++) { g.fillStyle = (r + q) % 2 ? '#3a2f22' : '#d6c29a'; g.fillRect(96 + q * 40, 32 + r * 40, 40, 40); }
        g.font = '34px serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        var k = Math.floor(t / 1.2) % 4, fx = [1, 2, 3, 2][k], fy = [7, 5, 3, 5][k];
        g.fillStyle = '#ffffff'; g.shadowColor = '#000'; g.shadowBlur = 6; g.fillText('♞', 96 + fx * 40 + 20, 32 + fy * 40 + 22); g.fillText('♔', 96 + 4 * 40 + 20, 32 + 7 * 40 + 22);
        g.fillStyle = '#111'; g.shadowColor = '#fff'; g.fillText('♚', 96 + 4 * 40 + 20, 32 + 22); g.fillText('♜', 96 + 0 * 40 + 20, 32 + 22);
      } else if (id === 'connect4') {
        g.fillStyle = '#1f4fbf'; g.fillRect(56, 40, 400, 320);
        if (!drops.length || drops[drops.length - 1].y > 300) { if (drops.length > 20) drops = []; drops.push({ c: Math.floor(Math.random() * 7), y: 0, col: drops.length % 2 ? '#f1c40f' : '#e53935' }); }
        var filled = {};
        drops.forEach(function (d, i) { var base = (filled[d.c] = (filled[d.c] || 0) + 1); var target = 340 - (base - 1) * 52; if (i === drops.length - 1) d.y = Math.min(target, d.y + 14); else d.y = target; d.t = target; });
        for (var cc = 0; cc < 7; cc++) for (var rr = 0; rr < 6; rr++) { g.fillStyle = '#050b16'; g.beginPath(); g.arc(88 + cc * 56, 80 + rr * 52, 21, 0, 7); g.fill(); }
        drops.forEach(function (d) { g.fillStyle = d.col; g.beginPath(); g.arc(88 + d.c * 56, d.y, 20, 0, 7); g.fill(); });
      } else if (id === 'catcher') {
        if (Math.random() < .12) orbs.push({ x: 40 + Math.random() * 432, y: -10, v: 2 + Math.random() * 3 });
        var bx = 256 + Math.sin(t * 1.8) * 190;
        orbs = orbs.filter(function (o) { o.y += o.v * 2; return o.y < 400 && !(o.y > 320 && Math.abs(o.x - bx) < 50); });
        g.shadowColor = color; g.shadowBlur = 16; g.fillStyle = color; orbs.forEach(function (o) { g.beginPath(); g.arc(o.x, o.y, 9, 0, 7); g.fill(); });
        g.fillStyle = GOLD_HI; g.fillRect(bx - 50, 330, 100, 16);
      } else if (id === 'trivia') {
        var Q = [['Capital of the Republic?', 'Fyrus Core'], ['Escrow protects…?', 'Both sides'], ['House of the Azure Coast?', 'Maren'], ['One citizen, one…?', 'Vote']];
        var qi = Math.floor(t / 3) % Q.length, phase = (t % 3) / 3;
        g.fillStyle = color; g.font = '600 26px Sora, sans-serif'; g.textAlign = 'center'; g.fillText(Q[qi][0], 256, 80);
        var opts = [Q[qi][1], 'Silica', 'Lumen', 'Arcadia'];
        opts.forEach(function (o, i) { var right = i === 0 && phase > .55; g.fillStyle = right ? 'rgba(69,224,174,.35)' : 'rgba(255,255,255,.06)'; g.fillRect(70, 120 + i * 58, 372, 44); g.fillStyle = right ? '#45e0ae' : '#d4d9e1'; g.font = '500 20px Sora, sans-serif'; g.fillText(o, 256, 149 + i * 58); });
      } else {
        g.fillStyle = color; g.font = '400 64px "Bebas Neue", Sora, sans-serif'; g.textAlign = 'center'; g.fillText('COMING SOON', 256, 200);
      }
      g.restore();
      /* scanlines + vignette */
      g.fillStyle = 'rgba(255,255,255,.035)'; for (var y2 = 0; y2 < 384; y2 += 4) g.fillRect(0, y2, 512, 1);
      if (!on) { g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, 0, 512, 384); }
    } };
  }
  function marquee(T, name, color, dim) {
    var c = document.createElement('canvas'); c.width = 512; c.height = 128; var g = c.getContext('2d');
    g.fillStyle = '#060a14'; g.fillRect(0, 0, 512, 128);
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 70px "Bebas Neue", Sora, sans-serif';
    g.shadowColor = color; g.shadowBlur = dim ? 6 : 24; g.fillStyle = dim ? '#5d6472' : '#ffffff'; g.fillText(name.toUpperCase(), 256, 68);
    var t = new T.CanvasTexture(c); return t;
  }

  var running = false;
  API.open = function (startId) {
    var T = window.THREE; if (!T || running) return; running = true;
    var list = games().filter(function (g) { return g.ready; }).concat(games().filter(function (g) { return !g.ready; }).slice(0, 2));
    var sel = Math.max(0, list.findIndex(function (g) { return g.id === startId; }));
    var root = el('div', { 'class': 'fxh fxp-ov', role: 'dialog', 'aria-label': 'Fyrus Arcade Hall' });
    var canvas = el('canvas'); root.appendChild(canvas);
    var closeBtn = el('button', { 'class': 'fxh-x' }, ['Close · Esc']);
    root.appendChild(el('div', { 'class': 'fxh-top' }, [el('div', null, [el('div', { 'class': 'fxh-k' }, ['Fyrus Arcade · Game Street']), el('div', { 'class': 'fxh-t' }, ['The Arcade Hall'])]), closeBtn]));
    var nameEl = el('b'), subEl = el('small'), bestEl = el('div', { 'class': 'best' });
    var prev = el('button', { 'aria-label': 'Previous game' }, ['‹']), next = el('button', { 'aria-label': 'Next game' }, ['›']), play = el('button', { 'class': 'fxh-play' }, ['Play']);
    root.appendChild(el('div', { 'class': 'fxh-card' }, [el('div', { 'class': 'fxh-nav' }, [prev, next]), el('div', null, [nameEl, subEl, bestEl]), play]));
    document.body.appendChild(root);

    var renderer = null;
    [{ antialias: true }, { antialias: false, powerPreference: 'low-power' }].some(function (o) { try { o.canvas = canvas; renderer = new T.WebGLRenderer(o); return true; } catch (e) { return false; } });
    if (!renderer) { root.remove(); running = false; window.__fyrusCountry && window.__fyrusCountry.toast && window.__fyrusCountry.toast('3D is not available on this device. Opening the games list.'); try { window.__fyrus.setState({ hud: { open: true, tab: 'now' } }); } catch (e) {} return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    var scene = new T.Scene(); scene.background = new T.Color(0x03060c); scene.fog = new T.Fog(0x03060c, 18, 40);
    var camera = new T.PerspectiveCamera(48, 1, .1, 120);
    scene.add(new T.HemisphereLight(0x8fb6ff, 0x120a18, .55));
    var key = new T.DirectionalLight(0xffe2b8, .6); key.position.set(4, 10, 6); scene.add(key);

    /* floor: glossy with a neon grid */
    var gc = document.createElement('canvas'); gc.width = gc.height = 512; var gx = gc.getContext('2d');
    gx.fillStyle = '#070b14'; gx.fillRect(0, 0, 512, 512); gx.strokeStyle = 'rgba(77,163,255,.35)'; gx.lineWidth = 2;
    for (var i = 0; i <= 512; i += 64) { gx.beginPath(); gx.moveTo(i, 0); gx.lineTo(i, 512); gx.stroke(); gx.beginPath(); gx.moveTo(0, i); gx.lineTo(512, i); gx.stroke(); }
    var gt = new T.CanvasTexture(gc); gt.wrapS = gt.wrapT = T.RepeatWrapping; gt.repeat.set(10, 10);
    var floor = new T.Mesh(new T.CircleGeometry(30, 64), new T.MeshStandardMaterial({ map: gt, emissiveMap: gt, emissive: 0xffffff, emissiveIntensity: .35, roughness: .25, metalness: .6 }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);
    /* back wall arc with light strips */
    var wall = new T.Mesh(new T.CylinderGeometry(16, 16, 9, 64, 1, true, Math.PI * .55, Math.PI * .9), new T.MeshStandardMaterial({ color: 0x0b1222, roughness: .8, side: T.BackSide }));
    wall.position.y = 4.5; scene.add(wall);
    var strips = [];
    [1.2, 4.6, 8.2].forEach(function (y, k) { var s = new T.Mesh(new T.TorusGeometry(15.8, .05, 6, 120, Math.PI * .9), new T.MeshBasicMaterial({ color: k === 1 ? 0xc9a96e : 0x4da3ff })); s.rotation.x = Math.PI / 2; s.rotation.z = Math.PI * 1.05; s.position.y = y; scene.add(s); strips.push(s); });
    for (var b = 0; b < 7; b++) { var bar = new T.Mesh(new T.BoxGeometry(.2, .06, 10), new T.MeshBasicMaterial({ color: 0xf4efe6 })); bar.position.set(-9 + b * 3, 8.6, -2); scene.add(bar); }
    var title = new T.Mesh(new T.PlaneGeometry(10, 2.5), new T.MeshBasicMaterial({ map: marquee(T, 'FYRUS ARCADE', '#c9a96e'), transparent: true }));
    title.position.set(0, 6.6, -13.6); scene.add(title);

    /* cabinets on an arc */
    var cabs = [], R = 9, span = Math.min(Math.PI * .85, list.length * .34);
    list.forEach(function (gm, i) {
      var a = -span / 2 + (list.length === 1 ? .5 : i / (list.length - 1)) * span;
      var x = Math.sin(a) * R, z = -Math.cos(a) * R + 2;
      var grp = new T.Group(); grp.position.set(x, 0, z); grp.rotation.y = -a; scene.add(grp);
      var col = new T.Color(gm.color || '#4da3ff'), dim = !gm.ready;
      var body = new T.MeshStandardMaterial({ color: 0x0e1626, roughness: .45, metalness: .5 });
      var trim = new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: dim ? .15 : .9, roughness: .4 });
      var base = new T.Mesh(new T.BoxGeometry(1.2, 1.0, .95), body); base.position.y = .5; grp.add(base);
      var upper = new T.Mesh(new T.BoxGeometry(1.2, 1.25, .7), body); upper.position.set(0, 1.62, -.12); grp.add(upper);
      var panel = new T.Mesh(new T.BoxGeometry(1.2, .12, .5), body); panel.position.set(0, 1.05, .28); panel.rotation.x = -.35; grp.add(panel);
      [-.62, .62].forEach(function (sx) { var e = new T.Mesh(new T.BoxGeometry(.04, 2.3, .98), trim); e.position.set(sx, 1.15, 0); grp.add(e); });
      var p = painter(gm.ready ? gm.id : 'soon', gm.color || '#4da3ff'); var stex = new T.CanvasTexture(p.canvas);
      var screen = new T.Mesh(new T.PlaneGeometry(.98, .74), new T.MeshBasicMaterial({ map: stex })); screen.position.set(0, 1.64, .235); screen.rotation.x = -.12; grp.add(screen);
      var mq = new T.Mesh(new T.PlaneGeometry(1.16, .29), new T.MeshBasicMaterial({ map: marquee(T, dim ? 'Coming soon' : gm.name, gm.color || '#4da3ff', dim) })); mq.position.set(0, 2.42, .24); grp.add(mq);
      var hood = new T.Mesh(new T.BoxGeometry(1.24, .36, .82), body); hood.position.set(0, 2.42, -.18); grp.add(hood);
      var stick = new T.Mesh(new T.CylinderGeometry(.025, .025, .18, 8), new T.MeshStandardMaterial({ color: 0x222 })); stick.position.set(-.25, 1.18, .3); grp.add(stick);
      var ball = new T.Mesh(new T.SphereGeometry(.05, 12, 8), trim); ball.position.set(-.25, 1.28, .3); grp.add(ball);
      [0, .14, .28].forEach(function (dx, k) { var btn = new T.Mesh(new T.CylinderGeometry(.04, .04, .03, 12), new T.MeshStandardMaterial({ color: [0xe53935, 0xf1c40f, 0x45e0ae][k], emissive: [0xe53935, 0xf1c40f, 0x45e0ae][k], emissiveIntensity: .5 })); btn.position.set(.1 + dx, 1.13, .32); btn.rotation.x = -.35; grp.add(btn); });
      var glow = new T.PointLight(col, dim ? .2 : .9, 4, 2); glow.position.set(0, 1.6, 1.0); grp.add(glow);
      grp.userData = { idx: i };
      cabs.push({ g: grp, p: p, tex: stex, game: gm, a: a, pos: new T.Vector3(x, 0, z), dir: new T.Vector3(-Math.sin(a), 0, Math.cos(a)) });
    });
    /* holo ring under the selected cabinet */
    var ring = new T.Mesh(new T.RingGeometry(.9, 1.05, 64), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .8, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .02; scene.add(ring);
    var beam = new T.Mesh(new T.CylinderGeometry(.9, 1.1, 5, 32, 1, true), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .06, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
    beam.position.y = 2.5; scene.add(beam);
    /* floating dust */
    var dg = new T.BufferGeometry(), dp = new Float32Array(600 * 3);
    for (var d = 0; d < 600; d++) { dp[d * 3] = (Math.random() - .5) * 30; dp[d * 3 + 1] = Math.random() * 8; dp[d * 3 + 2] = (Math.random() - .5) * 26; }
    dg.setAttribute('position', new T.BufferAttribute(dp, 3));
    var dust = new T.Points(dg, new T.PointsMaterial({ color: 0x9cc8ff, size: .05, transparent: true, opacity: .6, depthWrite: false }));
    scene.add(dust);

    var camPos = new T.Vector3(0, 2.4, 9), camLook = new T.Vector3(0, 1.4, -4), t0 = performance.now(), last = t0, raf = 0;
    function select(i, quiet) {
      sel = (i + cabs.length) % cabs.length; var gm = cabs[sel].game, s = S();
      nameEl.textContent = gm.name; subEl.textContent = (gm.tag || '') + (gm.players ? ' · ' + gm.players : '');
      var best = s && s.gameBest && s.gameBest[gm.id]; bestEl.textContent = gm.ready ? 'Your best: ' + (best == null ? '—' : best) : 'Coming soon' + (gm.votes ? ' · ' + gm.votes + ' votes' : '');
      play.disabled = !gm.ready; play.textContent = gm.ready ? 'Play' : 'Soon';
      if (!quiet) blip(520 + sel * 40);
    }
    var actx = null;
    function blip(f) { try { var s = S(); if (!s || !s.audioOn) return; actx = actx || new (window.AudioContext || window.webkitAudioContext)(); var o = actx.createOscillator(), g = actx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.value = .06; g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + .18); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .2); } catch (e) {} }
    function size() { var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = Math.max(last, now); var t = (now - t0) / 1000;
      var c = cabs[sel];
      var want = c.pos.clone().addScaledVector(c.dir, 3.3); want.y = 1.85; var look = c.pos.clone().add(new T.Vector3(0, 1.5, 0));
      camPos.lerp(want, Math.min(1, dt * 3)); camLook.lerp(look, Math.min(1, dt * 4));
      camera.position.copy(camPos).add(new T.Vector3(Math.sin(t * .4) * .08, Math.sin(t * .6) * .05, 0)); camera.lookAt(camLook);
      ring.position.x = c.pos.x; ring.position.z = c.pos.z; ring.rotation.z = t * .6; ring.material.opacity = .55 + Math.sin(t * 3) * .25;
      beam.position.x = c.pos.x; beam.position.z = c.pos.z;
      cabs.forEach(function (cb, i) { var on = i === sel || Math.abs(i - sel) <= 1; cb.p.draw(t + i * .7, i === sel); cb.tex.needsUpdate = true; cb.g.position.y = i === sel ? Math.sin(t * 2) * .02 : 0; });
      strips.forEach(function (s, k) { s.material.color.setHSL(k === 1 ? .11 : (.58 + Math.sin(t * .3 + k) * .03), .7, .6); });
      dust.rotation.y = t * .02;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function finish(thenPlay) {
      if (!running) return; running = false; cancelAnimationFrame(raf);
      removeEventListener('resize', size); removeEventListener('keydown', onKey, true);
      try { scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
      root.remove();
      if (thenPlay) { try { var s = S(); window.__fyrus.setState({ activeGame: thenPlay, hud: Object.assign({}, s && s.hud, { open: false }) }); } catch (e) {} }
    }
    API.close = function () { finish(null); };
    function onKey(e) {
      var k = e.key; if (['ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'a', 'd', ' '].indexOf(k) < 0) { e.stopPropagation(); return; }
      e.preventDefault(); e.stopPropagation();
      if (k === 'ArrowLeft' || k === 'a') select(sel - 1); else if (k === 'ArrowRight' || k === 'd') select(sel + 1); else if (k === 'Escape') finish(null); else if (cabs[sel].game.ready) finish(cabs[sel].game.id);
    }
    prev.onclick = function () { select(sel - 1); }; next.onclick = function () { select(sel + 1); };
    play.onclick = function () { if (cabs[sel].game.ready) finish(cabs[sel].game.id); };
    closeBtn.onclick = function () { finish(null); };
    /* click or tap a cabinet; swipe to change */
    var ray = new T.Raycaster(), ndc = new T.Vector2(), down = null;
    canvas.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY }; });
    canvas.addEventListener('pointerup', function (e) {
      if (!down) return; var dx = e.clientX - down.x; down = null;
      if (Math.abs(dx) > 40) { select(sel + (dx < 0 ? 1 : -1)); return; }
      var r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObjects(cabs.map(function (c) { return c.g; }), true);
      if (hits.length) { var o = hits[0].object; while (o && o.userData.idx == null) o = o.parent; if (o) { if (o.userData.idx === sel && cabs[sel].game.ready) finish(cabs[sel].game.id); else select(o.userData.idx); } }
    });
    addEventListener('resize', size); addEventListener('keydown', onKey, true);
    size(); select(sel, true); raf = requestAnimationFrame(frame);
  };
})();
