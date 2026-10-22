/* Fyrus — 3D Arcade Hall (v3.0): walk your own avatar through a full neon room
   A walk-up neon hall on Game Street: every game is a glowing 3D cabinet with a live screen.
   Pick a cabinet (click / arrows / swipe) and press Play to start the real game.
   Additive: the games themselves are unchanged. Opened from Games ("Enter the 3D Arcade Hall"),
   from search ("Arcade Hall") or window.__fyrusHall.open(). */
(function () {
  'use strict';
  if (window.__fyrusHall) return;
  var API = window.__fyrusHall = { version: '3.0.0' };
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
    '.fxh-modes{display:flex;gap:6px;pointer-events:auto;margin-top:8px;justify-content:flex-end}' +
    '.fxh-modes button{border-radius:999px;border:1px solid rgba(201,169,110,.4);background:rgba(10,15,26,.7);color:' + IVORY + ';font:600 10.5px Sora,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:8px 12px;cursor:pointer}' +
    '.fxh-modes button[aria-pressed="true"]{background:' + GOLD + ';color:#1a1408;border-color:' + GOLD + '}' +
    '.fxh-hint{position:absolute;left:50%;top:84px;transform:translateX(-50%);font:500 10px "JetBrains Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:' + MUTED + ';pointer-events:none;text-align:center}' +
    '.fxh-stick{position:absolute;left:22px;bottom:150px;width:110px;height:110px;border-radius:50%;border:1px solid rgba(201,169,110,.4);background:rgba(10,15,26,.35);display:none;touch-action:none}' +
    '.fxh-stick i{position:absolute;left:32px;top:32px;width:46px;height:46px;border-radius:50%;background:rgba(232,213,168,.6)}' +
    '.fxh.walk.touch .fxh-stick{display:block}' +
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

  /* ---- room helpers ---- */
  function poster(T, title, color, sub) {
    var c = document.createElement('canvas'); c.width = 256; c.height = 384; var g = c.getContext('2d');
    var gr = g.createLinearGradient(0, 0, 0, 384); gr.addColorStop(0, color); gr.addColorStop(1, '#070b14'); g.fillStyle = gr; g.fillRect(0, 0, 256, 384);
    g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 4; g.strokeRect(10, 10, 236, 364);
    for (var i = 0; i < 9; i++) { g.fillStyle = 'rgba(255,255,255,' + (0.05 + i * .02) + ')'; g.beginPath(); g.arc(128, 150, 110 - i * 11, 0, 7); g.fill(); }
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '400 46px "Bebas Neue", Sora, sans-serif';
    var words = title.toUpperCase().split(' '), y = 290 - (words.length - 1) * 22; words.forEach(function (w) { g.fillText(w, 128, y); y += 44; });
    g.font = '500 14px "JetBrains Mono", monospace'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText(sub || 'FYRUS ARCADE', 128, 360);
    return new T.CanvasTexture(c);
  }
  function carpet(T) {
    var c = document.createElement('canvas'); c.width = c.height = 512; var g = c.getContext('2d');
    g.fillStyle = '#0a0b1a'; g.fillRect(0, 0, 512, 512);
    var cols = ['#4da3ff', '#ff4fa3', '#45e0ae', '#f1c40f', '#c792ea'];
    for (var i = 0; i < 70; i++) {
      g.strokeStyle = cols[i % 5]; g.globalAlpha = .55; g.lineWidth = 3; var x = (i * 97) % 512, y = (i * 211) % 512, s = 14 + (i % 4) * 8;
      g.save(); g.translate(x, y); g.rotate(i);
      if (i % 3 === 0) { g.beginPath(); g.arc(0, 0, s / 2, 0, 7); g.stroke(); } else if (i % 3 === 1) { g.strokeRect(-s / 2, -s / 2, s, s * .6); } else { g.beginPath(); g.moveTo(-s / 2, s / 2); g.lineTo(0, -s / 2); g.lineTo(s / 2, s / 2); g.closePath(); g.stroke(); }
      g.restore();
    }
    g.globalAlpha = 1; var t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; return t;
  }

  var running = false;
  API.open = function (startId) {
    var T = window.THREE; if (!T || running) return; running = true;
    var all = games(), list = all.filter(function (g) { return g.ready; }).concat(all.filter(function (g) { return !g.ready; })).slice(0, 14);
    var sel = Math.max(0, list.findIndex(function (g) { return g.id === startId; }));
    var touch = matchMedia('(pointer:coarse)').matches;
    var root = el('div', { 'class': 'fxh fxp-ov' + (touch ? ' touch' : ''), role: 'dialog', 'aria-label': 'Fyrus Arcade Hall' });
    var canvas = el('canvas'); root.appendChild(canvas);
    var closeBtn = el('button', { 'class': 'fxh-x' }, ['Close · Esc']);
    var bTour = el('button', { 'aria-pressed': 'true' }, ['Guided']), bWalk = el('button', { 'aria-pressed': 'false' }, ['Walk']);
    root.appendChild(el('div', { 'class': 'fxh-top' }, [el('div', null, [el('div', { 'class': 'fxh-k' }, ['Fyrus Arcade · Game Street']), el('div', { 'class': 'fxh-t' }, ['The Arcade Hall'])]), el('div', null, [closeBtn, el('div', { 'class': 'fxh-modes' }, [bTour, bWalk])])]));
    var hint = el('div', { 'class': 'fxh-hint' }, ['']); root.appendChild(hint);
    var stick = el('div', { 'class': 'fxh-stick' }, [el('i')]); root.appendChild(stick);
    var nameEl = el('b'), subEl = el('small'), bestEl = el('div', { 'class': 'best' });
    var prev = el('button', { 'aria-label': 'Previous game' }, ['‹']), next = el('button', { 'aria-label': 'Next game' }, ['›']), play = el('button', { 'class': 'fxh-play' }, ['Play']);
    root.appendChild(el('div', { 'class': 'fxh-card' }, [el('div', { 'class': 'fxh-nav' }, [prev, next]), el('div', null, [nameEl, subEl, bestEl]), play]));
    document.body.appendChild(root);

    var renderer = null;
    [{ antialias: true }, { antialias: false, powerPreference: 'low-power' }].some(function (o) { try { o.canvas = canvas; renderer = new T.WebGLRenderer(o); return true; } catch (e) { return false; } });
    if (!renderer) { root.remove(); running = false; try { window.__fyrus.setState({ hud: { open: true, tab: 'now' } }); } catch (e) {} return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, touch ? 1.25 : 1.75));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.2;
    var scene = new T.Scene(); scene.background = new T.Color(0x05060f); scene.fog = new T.Fog(0x05060f, 26, 60);
    var camera = new T.PerspectiveCamera(58, 1, .1, 120);
    scene.add(new T.HemisphereLight(0x6f8fd8, 0x1a0f22, .5));

    /* ---------- the room: 22 m wide, 40 m deep, 7.5 m high ---------- */
    var W = 11, Z0 = 16, Z1 = -24, H = 7.5;
    var cpt = carpet(T); cpt.repeat.set(4, 8);
    var floor = new T.Mesh(new T.PlaneGeometry(W * 2, Z0 - Z1), new T.MeshStandardMaterial({ map: cpt, roughness: .9, emissiveMap: cpt, emissive: 0xffffff, emissiveIntensity: .25 }));
    floor.rotation.x = -Math.PI / 2; floor.position.z = (Z0 + Z1) / 2; scene.add(floor);
    var aisle = new T.Mesh(new T.PlaneGeometry(4.2, Z0 - Z1 - 6), new T.MeshStandardMaterial({ color: 0x111827, roughness: .15, metalness: .7 }));
    aisle.rotation.x = -Math.PI / 2; aisle.position.set(0, .01, (Z0 + Z1) / 2 + 2); scene.add(aisle);
    var lane = [];
    [-2.2, 2.2].forEach(function (x) { var l = new T.Mesh(new T.PlaneGeometry(.08, Z0 - Z1 - 6), new T.MeshBasicMaterial({ color: 0xc9a96e })); l.rotation.x = -Math.PI / 2; l.position.set(x, .02, (Z0 + Z1) / 2 + 2); scene.add(l); lane.push(l); });
    var wallM = new T.MeshStandardMaterial({ color: 0x0d1428, roughness: .85 });
    var ceil = new T.Mesh(new T.PlaneGeometry(W * 2, Z0 - Z1), new T.MeshStandardMaterial({ color: 0x070a14, roughness: 1 })); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, (Z0 + Z1) / 2); scene.add(ceil);
    [[-W, Math.PI / 2], [W, -Math.PI / 2]].forEach(function (w) { var m = new T.Mesh(new T.PlaneGeometry(Z0 - Z1, H), wallM); m.position.set(w[0], H / 2, (Z0 + Z1) / 2); m.rotation.y = w[1]; scene.add(m); });
    var back = new T.Mesh(new T.PlaneGeometry(W * 2, H), wallM); back.position.set(0, H / 2, Z1); scene.add(back);
    var front = new T.Mesh(new T.PlaneGeometry(W * 2, H), wallM); front.position.set(0, H / 2, Z0); front.rotation.y = Math.PI; scene.add(front);
    /* entrance doors (glowing) */
    var doorGlow = new T.Mesh(new T.PlaneGeometry(4, 3.4), new T.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: .55 })); doorGlow.position.set(0, 1.7, Z0 - .02); doorGlow.rotation.y = Math.PI; scene.add(doorGlow);
    /* neon tubes on walls: vertical, colour-cycling */
    var tubes = [];
    for (var zt = Z0 - 3; zt > Z1 + 1; zt -= 4) [-1, 1].forEach(function (sd) { var tb = new T.Mesh(new T.CylinderGeometry(.05, .05, H - 1.2, 8), new T.MeshBasicMaterial({ color: 0x4da3ff })); tb.position.set(sd * (W - .08), H / 2, zt); scene.add(tb); tubes.push(tb); });
    var cornice = [];
    [-1, 1].forEach(function (sd) { var c = new T.Mesh(new T.BoxGeometry(.08, .08, Z0 - Z1), new T.MeshBasicMaterial({ color: 0xc9a96e })); c.position.set(sd * (W - .1), H - .3, (Z0 + Z1) / 2); scene.add(c); cornice.push(c); var c2 = c.clone(); c2.position.y = .25; scene.add(c2); });
    /* ceiling light grid */
    var panels = [];
    for (var pz = Z0 - 4; pz > Z1 + 2; pz -= 4) for (var px = -6; px <= 6; px += 6) { var pl = new T.Mesh(new T.PlaneGeometry(2.6, .5), new T.MeshBasicMaterial({ color: 0xf4efe6 })); pl.rotation.x = Math.PI / 2; pl.position.set(px, H - .02, pz); scene.add(pl); panels.push(pl); }
    /* big neon sign on the back wall */
    var sign = new T.Mesh(new T.PlaneGeometry(12, 3), new T.MeshBasicMaterial({ map: marquee(T, 'FYRUS ARCADE', '#c9a96e'), transparent: true })); sign.position.set(0, 5.4, Z1 + .05); scene.add(sign);
    /* posters above the cabinets */
    list.forEach(function (gm, i) { var side = i % 2 ? 1 : -1, row = Math.floor(i / 2); var pm = new T.Mesh(new T.PlaneGeometry(1.4, 2.1), new T.MeshBasicMaterial({ map: poster(T, gm.name, gm.color || '#4da3ff', gm.ready ? 'PLAY NOW' : 'COMING SOON') })); pm.position.set(side * (W - .04), 4.6, Z0 - 6 - row * 4.2); pm.rotation.y = -side * Math.PI / 2; scene.add(pm); });

    /* ---------- cabinets: two rows facing the aisle ---------- */
    var cabs = [];
    list.forEach(function (gm, i) {
      var side = i % 2 ? 1 : -1, row = Math.floor(i / 2), x = side * 6.2, z = Z0 - 6 - row * 4.2;
      var grp = new T.Group(); grp.position.set(x, 0, z); grp.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; scene.add(grp);
      var col = new T.Color(gm.color || '#4da3ff'), dim = !gm.ready;
      var body = new T.MeshStandardMaterial({ color: 0x18233c, roughness: .35, metalness: .55 });
      var trim = new T.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: dim ? .2 : 1.1, roughness: .4 });
      function bx(w, h, d, X, Y, Z, m, rx) { var mm = new T.Mesh(new T.BoxGeometry(w, h, d), m); mm.position.set(X, Y, Z); if (rx) mm.rotation.x = rx; grp.add(mm); return mm; }
      bx(1.2, 1.0, .95, 0, .5, 0, body); bx(1.2, 1.25, .7, 0, 1.62, -.12, body); bx(1.2, .12, .5, 0, 1.05, .28, body, -.35); bx(1.24, .36, .82, 0, 2.42, -.18, body);
      [-.61, .61].forEach(function (sx) { bx(.05, 2.3, .06, sx, 1.15, .46, trim); bx(.03, .06, .9, sx, 2.27, 0, trim); var art = new T.Mesh(new T.PlaneGeometry(.8, 1.6), new T.MeshBasicMaterial({ map: poster(T, gm.name, gm.color || '#4da3ff', dim ? 'SOON' : 'FYRUS ARCADE') })); art.position.set(sx * 1.01, 1.25, 0); art.rotation.y = sx > 0 ? Math.PI / 2 : -Math.PI / 2; grp.add(art); });
      bx(1.24, .04, .04, 0, .02, .48, trim); bx(1.24, .04, .04, 0, 2.62, .24, trim);
      var p = painter(gm.ready ? gm.id : 'soon', gm.color || '#4da3ff'); var stex = new T.CanvasTexture(p.canvas);
      var screen = new T.Mesh(new T.PlaneGeometry(.98, .74), new T.MeshBasicMaterial({ map: stex })); screen.position.set(0, 1.64, .235); screen.rotation.x = -.12; grp.add(screen);
      var mq = new T.Mesh(new T.PlaneGeometry(1.16, .29), new T.MeshBasicMaterial({ map: marquee(T, dim ? 'Coming soon' : gm.name, gm.color || '#4da3ff', dim) })); mq.position.set(0, 2.42, .24); grp.add(mq);
      var ball = new T.Mesh(new T.SphereGeometry(.05, 12, 8), trim); ball.position.set(-.25, 1.28, .3); grp.add(ball);
      [0, .14, .28].forEach(function (dx, k) { var c3 = [0xe53935, 0xf1c40f, 0x45e0ae][k]; var b3 = new T.Mesh(new T.CylinderGeometry(.04, .04, .03, 12), new T.MeshStandardMaterial({ color: c3, emissive: c3, emissiveIntensity: .6 })); b3.position.set(.1 + dx, 1.13, .32); b3.rotation.x = -.35; grp.add(b3); });
      var spill = new T.Mesh(new T.CircleGeometry(1.1, 24), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: dim ? .06 : .18, depthWrite: false, blending: T.AdditiveBlending })); spill.rotation.x = -Math.PI / 2; spill.position.set(0, .03, .9); grp.add(spill);
      grp.userData = { idx: i };
      var dir = new T.Vector3(-side, 0, 0);
      cabs.push({ g: grp, p: p, tex: stex, game: gm, pos: new T.Vector3(x, 0, z), dir: dir, side: side });
    });

    /* ---------- centre pieces: air-hockey table, claw machine, prize counter ---------- */
    var hk = new T.Group(); hk.position.set(0, 0, 4); scene.add(hk);
    var tableTop = new T.Mesh(new T.BoxGeometry(2.2, .12, 3.6), new T.MeshStandardMaterial({ color: 0x0a1630, emissive: 0x0b2a66, emissiveIntensity: .6, roughness: .2 })); tableTop.position.y = .9; hk.add(tableTop);
    var tableBase = new T.Mesh(new T.BoxGeometry(1.8, .85, 3.2), new T.MeshStandardMaterial({ color: 0x111827, roughness: .5 })); tableBase.position.y = .42; hk.add(tableBase);
    var rim = new T.Mesh(new T.BoxGeometry(2.3, .1, 3.7), new T.MeshBasicMaterial({ color: 0x4da3ff, wireframe: true })); rim.position.y = .97; hk.add(rim);
    var puck = new T.Mesh(new T.CylinderGeometry(.09, .09, .03, 16), new T.MeshBasicMaterial({ color: 0xffffff })); puck.position.y = .98; hk.add(puck);
    var mal1 = new T.Mesh(new T.CylinderGeometry(.14, .14, .08, 16), new T.MeshBasicMaterial({ color: 0x4da3ff })), mal2 = mal1.clone(); mal2.material = new T.MeshBasicMaterial({ color: 0xff4fa3 }); hk.add(mal1, mal2);
    var claw = new T.Group(); claw.position.set(-2.6, 0, -8); scene.add(claw);
    var glassM = new T.MeshStandardMaterial({ color: 0xbfe3ff, transparent: true, opacity: .18, roughness: .05, metalness: .2 });
    var cb = new T.Mesh(new T.BoxGeometry(1.4, 1.0, 1.4), new T.MeshStandardMaterial({ color: 0xff4fa3, emissive: 0xff4fa3, emissiveIntensity: .35 })); cb.position.y = .5; claw.add(cb);
    var cg = new T.Mesh(new T.BoxGeometry(1.4, 1.5, 1.4), glassM); cg.position.y = 1.75; claw.add(cg);
    var plush = [0xf1c40f, 0x45e0ae, 0x4da3ff, 0xff9a3c, 0xc792ea]; for (var pi = 0; pi < 10; pi++) { var pb = new T.Mesh(new T.SphereGeometry(.16, 12, 10), new T.MeshStandardMaterial({ color: plush[pi % 5], roughness: .8 })); pb.position.set(-.45 + (pi % 4) * .3, 1.18 + Math.floor(pi / 4) * .2, -.4 + ((pi * 7) % 4) * .27); claw.add(pb); }
    var clawHead = new T.Mesh(new T.ConeGeometry(.12, .25, 6), new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: 1, roughness: .3 })); clawHead.rotation.x = Math.PI; claw.add(clawHead);
    var counter = new T.Group(); counter.position.set(2.6, 0, -8); scene.add(counter);
    var ct = new T.Mesh(new T.BoxGeometry(1.8, 1.1, .9), new T.MeshStandardMaterial({ color: 0x1b2a4a, roughness: .4, metalness: .4 })); ct.position.y = .55; counter.add(ct);
    var cs = new T.Mesh(new T.PlaneGeometry(1.7, .5), new T.MeshBasicMaterial({ map: marquee(T, 'PRIZES', '#f1c40f') })); cs.position.set(0, 1.5, .46); counter.add(cs);
    /* holo stage at the back: shows the selected game in 4D (it spins, pulses and morphs with time) */
    var stage = new T.Group(); stage.position.set(0, 0, Z1 + 5); scene.add(stage);
    var disc = new T.Mesh(new T.CylinderGeometry(2.6, 2.8, .3, 48), new T.MeshStandardMaterial({ color: 0x0e1626, metalness: .7, roughness: .25 })); disc.position.y = .15; stage.add(disc);
    var rings = []; for (var r = 0; r < 3; r++) { var rg = new T.Mesh(new T.TorusGeometry(1.6 + r * .35, .02, 6, 80), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .7 })); rg.position.y = 1.6 + r * .5; rg.rotation.x = Math.PI / 2; stage.add(rg); rings.push(rg); }
    var holoMat = new T.MeshBasicMaterial({ color: 0x4da3ff, wireframe: true, transparent: true, opacity: .75 });
    var holo = new T.Mesh(new T.IcosahedronGeometry(1.1, 1), holoMat); holo.position.y = 2.6; stage.add(holo);
    var holoBase = holo.geometry.attributes.position.array.slice(0);
    var holoTitle = new T.Mesh(new T.PlaneGeometry(4, 1), new T.MeshBasicMaterial({ transparent: true, depthWrite: false })); holoTitle.position.y = 4.4; stage.add(holoTitle);
    var beamUp = new T.Mesh(new T.CylinderGeometry(1.2, 2.4, 4.4, 40, 1, true), new T.MeshBasicMaterial({ color: 0x4da3ff, transparent: true, opacity: .07, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); beamUp.position.y = 2.4; stage.add(beamUp);
    /* moving coloured spotlights (4 real lights) */
    var spots = [0x4da3ff, 0xff4fa3, 0x45e0ae, 0xf1c40f].map(function (c, k) { var l = new T.PointLight(c, 1.4, 16, 2); l.position.set(k % 2 ? 4 : -4, 5.5, Z0 - 6 - k * 8); scene.add(l); return l; });
    /* floating dust */
    var dg = new T.BufferGeometry(), dp = new Float32Array(900 * 3);
    for (var d = 0; d < 900; d++) { dp[d * 3] = (Math.random() - .5) * W * 2; dp[d * 3 + 1] = Math.random() * H; dp[d * 3 + 2] = Z1 + Math.random() * (Z0 - Z1); }
    dg.setAttribute('position', new T.BufferAttribute(dp, 3));
    var dust = new T.Points(dg, new T.PointsMaterial({ color: 0x9cc8ff, size: .04, transparent: true, opacity: .55, depthWrite: false })); scene.add(dust);
    /* selection ring */
    var ring = new T.Mesh(new T.RingGeometry(.85, 1.0, 64), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .8, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = .04; scene.add(ring);

    /* ---------- colliders (cabinets, centre pieces, stage) ---------- */
    var boxes = [];
    cabs.forEach(function (c) { boxes.push({ x0: c.pos.x - .65, x1: c.pos.x + .65, z0: c.pos.z - .75, z1: c.pos.z + .75 }); });
    boxes.push({ x0: -1.25, x1: 1.25, z0: 4 - 1.95, z1: 4 + 1.95 }, { x0: -3.4, x1: -1.8, z0: -8.8, z1: -7.2 }, { x0: 1.6, x1: 3.6, z0: -8.6, z1: -7.4 });
    var stageC = { x: 0, z: Z1 + 5, r: 3.1 };
    function blocked(x, z, r) {
      if (x < -W + .6 || x > W - .6 || z > Z0 - .6 || z < Z1 + .6) return true;
      if (Math.hypot(x - stageC.x, z - stageC.z) < stageC.r + r) return true;
      for (var i = 0; i < boxes.length; i++) { var b = boxes[i]; if (x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r) return true; }
      return false;
    }

    /* ---------- your avatar (a copy of your own citizen) ---------- */
    var me = { x: 0, z: Z0 - 2.5, yaw: Math.PI, moving: false, ph: 0 }, avatar, legs = [], arms = [];
    (function makeAvatar() {
      var Wd = window.__fyrusW, P = Wd && Wd.player;
      if (P && P.root) {
        try {
          var c = P.root.clone(true); c.position.set(0, 0, 0); c.rotation.set(0, 0, 0); c.scale.set(1, 1, 1); c.visible = true;
          var path = function (o) { var p = []; while (o && o !== P.root) { p.unshift(o.parent.children.indexOf(o)); o = o.parent; } return o === P.root ? p : null; };
          var get = function (p) { var o = c; for (var i = 0; i < p.length; i++) { o = o && o.children[p[i]]; } return o; };
          (P.legs || []).forEach(function (l) { var p = path(l); if (p) { var o = get(p); if (o) legs.push(o); } });
          (P.arms || []).forEach(function (l) { var p = path(l); if (p) { var o = get(p); if (o) arms.push(o); } });
          c.traverse(function (o) { o.userData.__shared = true; o.visible = o.visible !== false; });
          avatar = c;
        } catch (e) { avatar = null; }
      }
      if (!avatar) {
        avatar = new T.Group();
        var cl = new T.MeshStandardMaterial({ color: 0x1b2a4a }), sk = new T.MeshStandardMaterial({ color: 0xd6a77e });
        var bd = new T.Mesh(new T.CylinderGeometry(.22, .26, .8, 10), cl); bd.position.y = 1.25; avatar.add(bd);
        var hd = new T.Mesh(new T.SphereGeometry(.15, 12, 10), sk); hd.position.y = 1.82; avatar.add(hd);
        [-1, 1].forEach(function (sx) { var lg = new T.Group(); lg.position.set(sx * .11, .86, 0); var m = new T.Mesh(new T.CylinderGeometry(.07, .07, .84, 8), cl); m.position.y = -.42; lg.add(m); avatar.add(lg); legs.push(lg); var ar = new T.Group(); ar.position.set(sx * .3, 1.58, 0); var a2 = new T.Mesh(new T.CylinderGeometry(.055, .055, .62, 8), cl); a2.position.y = -.31; ar.add(a2); avatar.add(ar); arms.push(ar); });
      }
      scene.add(avatar);
    })();
    var you = new T.Mesh(new T.RingGeometry(.42, .5, 40), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .9, side: T.DoubleSide, depthWrite: false })); you.rotation.x = -Math.PI / 2; scene.add(you);

    /* ---------- AI visitors (clearly labelled) ---------- */
    function aiLabel() { var c = document.createElement('canvas'); c.width = 256; c.height = 64; var g = c.getContext('2d'); g.fillStyle = 'rgba(10,15,26,.75)'; g.fillRect(28, 12, 200, 40); g.fillStyle = '#9aa3b2'; g.font = '600 24px Sora, sans-serif'; g.textAlign = 'center'; g.fillText('AI visitor', 128, 41); var sp = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, depthWrite: false })); sp.scale.set(1, .25, 1); sp.position.y = 2.25; return sp; }
    var bots = [];
    var botCols = [[0x2a2f3a, 0xe8c4a0], [0x6b2f4a, 0x8d5a3b], [0x1f5f4a, 0xd6a77e], [0xc9a96e, 0xb9805a]];
    botCols.forEach(function (bc, k) {
      var g = new T.Group(), cl = new T.MeshStandardMaterial({ color: bc[0], roughness: .6 }), sk = new T.MeshStandardMaterial({ color: bc[1], roughness: .6 });
      var bd = new T.Mesh(new T.CylinderGeometry(.21, .25, .8, 10), cl); bd.position.y = 1.25; g.add(bd);
      var hd = new T.Mesh(new T.SphereGeometry(.145, 12, 10), sk); hd.position.y = 1.8; g.add(hd);
      var bl = [], ba = [];
      [-1, 1].forEach(function (sx) { var lg = new T.Group(); lg.position.set(sx * .1, .86, 0); var m = new T.Mesh(new T.CylinderGeometry(.065, .065, .84, 8), new T.MeshStandardMaterial({ color: 0x0a0f1a })); m.position.y = -.42; lg.add(m); g.add(lg); bl.push(lg); var ar = new T.Group(); ar.position.set(sx * .29, 1.56, 0); var a2 = new T.Mesh(new T.CylinderGeometry(.05, .05, .6, 8), cl); a2.position.y = -.3; ar.add(a2); g.add(ar); ba.push(ar); });
      g.add(aiLabel()); scene.add(g);
      var start = cabs[(k * 3 + 2) % cabs.length];
      bots.push({ g: g, legs: bl, arms: ba, x: (k % 2 ? 1 : -1) * 1.2, z: Z0 - 4 - k * 6, target: null, wait: 1 + k, ph: k, path: [] });
    });

    /* ---------- walking + paths ---------- */
    function standPoint(c) { return { x: c.pos.x + c.dir.x * 1.35, z: c.pos.z }; }
    function routeTo(fromX, fromZ, p) { var aisleX = Math.max(-1.1, Math.min(1.1, fromX)); return [{ x: Math.abs(fromX) > 3.6 ? fromX + (fromX > 0 ? -1.4 : 1.4) : fromX, z: fromZ }, { x: aisleX * .3, z: fromZ }, { x: p.x > 0 ? 2.6 : -2.6, z: p.z }, p]; }
    function stepTo(o, tx, tz, speed, dt, r) {
      var dx = tx - o.x, dz = tz - o.z, d = Math.hypot(dx, dz); if (d < .05) return true;
      var st = Math.min(d, speed * dt), nx = o.x + dx / d * st, nz = o.z + dz / d * st;
      if (!blocked(nx, nz, r)) { o.x = nx; o.z = nz; } else if (!blocked(nx, o.z, r)) o.x = nx; else if (!blocked(o.x, nz, r)) o.z = nz; else return true;
      o.face = Math.atan2(dx, dz); return d < .12;
    }
    function pose(L, A, ph, amp, playing) { var s = Math.sin(ph) * amp; if (L[0]) L[0].rotation.x = s; if (L[1]) L[1].rotation.x = -s; if (A[0]) A[0].rotation.x = playing ? -1.1 + Math.sin(ph * 2) * .15 : -s * .8; if (A[1]) A[1].rotation.x = playing ? -1.1 + Math.cos(ph * 2.3) * .15 : s * .8; }

    /* ---------- state, camera, input ---------- */
    var mode = 'walk', auto = null, keys = {}, stickV = { x: 0, y: 0 }, camYaw = 0, camPitch = .32, camDist = 4.6;
    var camPos = new T.Vector3(0, 3, Z0 - .2), camLook = new T.Vector3(0, 1.4, Z0 - 3), t0 = performance.now(), last = t0, raf = 0;
    function setHoloTitle(gm) { holoTitle.material.map && holoTitle.material.map.dispose(); holoTitle.material.map = marquee(T, gm.ready ? gm.name : 'Coming soon', gm.color || '#4da3ff', !gm.ready); holoTitle.material.needsUpdate = true; holoMat.color.set(gm.color || '#4da3ff'); beamUp.material.color.set(gm.color || '#4da3ff'); }
    function select(i, quiet) {
      sel = (i + cabs.length) % cabs.length; var gm = cabs[sel].game, s = S();
      nameEl.textContent = gm.name; subEl.textContent = (gm.tag || '') + (gm.players ? ' · ' + gm.players : '');
      var best = s && s.gameBest && s.gameBest[gm.id]; bestEl.textContent = gm.ready ? 'Your best: ' + (best == null ? '—' : best) : 'Coming soon' + (gm.votes ? ' · ' + gm.votes + ' votes' : '');
      play.disabled = !gm.ready; setHoloTitle(gm); updatePlay();
      if (!quiet) blip(520 + sel * 30);
    }
    function atCab() { var c = cabs[sel], p = standPoint(c); return Math.hypot(me.x - p.x, me.z - p.z) < 1.1; }
    function updatePlay() { var gm = cabs[sel].game; play.textContent = !gm.ready ? 'Soon' : (atCab() ? 'Play' : 'Walk there'); }
    function walkToSel() { var c = cabs[sel], p = standPoint(c); auto = { path: routeTo(me.x, me.z, p), face: c.side > 0 ? Math.PI / 2 : -Math.PI / 2, idx: 0 }; }
    var actx = null, music = null;
    function blip(f) { try { var s = S(); if (!s || !s.audioOn) return; actx = actx || new (window.AudioContext || window.webkitAudioContext)(); var o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.value = f; g.gain.value = .04; g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + .15); o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .16); } catch (e) {} }
    function startMusic() {
      try { var s = S(); if (!s || !s.audioOn || music) return; actx = actx || new (window.AudioContext || window.webkitAudioContext)();
        var master = actx.createGain(); master.gain.value = .03; master.connect(actx.destination);
        var notes = [220, 277.18, 329.63, 440, 329.63, 277.18, 246.94, 329.63], n = 0;
        var iv = setInterval(function () { var o = actx.createOscillator(), g = actx.createGain(); o.type = 'square'; o.frequency.value = notes[n % notes.length] * (n % 16 < 8 ? 1 : 1.122); g.gain.value = 1; g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + .22); o.connect(g); g.connect(master); o.start(); o.stop(actx.currentTime + .24); n++; }, 240);
        music = { iv: iv, master: master };
      } catch (e) {}
    }
    bTour.textContent = 'Auto-walk'; bWalk.textContent = 'Free walk';
    function setMode(m) { mode = m; bTour.setAttribute('aria-pressed', String(m === 'tour')); bWalk.setAttribute('aria-pressed', String(m === 'walk')); root.classList.add('walk'); if (m === 'tour') walkToSel(); else auto = null; }
    bTour.onclick = function () { setMode('tour'); }; bWalk.onclick = function () { setMode('walk'); };
    function size() { var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    function nearCab() { var best = -1, bd = 1.4; cabs.forEach(function (c, i) { var p = standPoint(c), d = Math.hypot(p.x - me.x, p.z - me.z); if (d < bd) { bd = d; best = i; } }); return best; }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = Math.max(last, now); var t = (now - t0) / 1000;
      /* your avatar */
      var fx = 0, fz = 0; if (keys.w || keys.arrowup) fz += 1; if (keys.s || keys.arrowdown) fz -= 1; if (keys.a || keys.arrowleft) fx -= 1; if (keys.d || keys.arrowright) fx += 1; fx += stickV.x; fz -= stickV.y;
      me.moving = false;
      if (Math.hypot(fx, fz) > .1) {
        auto = null; if (mode === 'tour') { mode = 'walk'; bTour.setAttribute('aria-pressed', 'false'); bWalk.setAttribute('aria-pressed', 'true'); }
        var sn = Math.sin(camYaw), cs = Math.cos(camYaw), vx = (-fz * sn + fx * cs), vz = (-fz * cs - fx * sn), L = Math.hypot(vx, vz) || 1;
        var tx = me.x + vx / L * 2, tz = me.z + vz / L * 2; stepTo(me, tx, tz, keys.shift ? 6 : 3.4, dt, .35); me.yaw = me.face; me.moving = true;
      } else if (auto) {
        var wp = auto.path[auto.idx];
        if (wp) { if (stepTo(me, wp.x, wp.z, 3.4, dt, .35)) auto.idx++; me.yaw = me.face; me.moving = true; }
        else { me.yaw += ((auto.face - me.yaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 6); }
      }
      if (me.moving) me.ph += dt * 9;
      avatar.position.set(me.x, 0, me.z);
      avatar.rotation.y += ((me.yaw - avatar.rotation.y + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 10);
      var standing = atCab();
      pose(legs, arms, me.ph, me.moving ? .5 : 0, !me.moving && standing && cabs[sel].game.ready);
      you.position.set(me.x, .03, me.z);
      var nc = nearCab(); if (nc >= 0 && nc !== sel) select(nc, true);
      updatePlay();
      hint.textContent = standing && cabs[sel].game.ready ? (touch ? 'Tap Play to start ' : 'Press E or Play to start ') + cabs[sel].game.name : (touch ? 'Joystick to walk · drag to turn · tap a machine to walk to it' : 'WASD to walk · drag to turn the camera · click a machine to walk to it');
      /* third-person camera behind your avatar */
      if (me.moving && !drag) camYaw += ((me.yaw + Math.PI - camYaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 1.6);
      if (standing && !me.moving && !drag) camYaw += ((me.yaw + Math.PI - .35 * cabs[sel].side - camYaw + Math.PI * 3) % (Math.PI * 2) - Math.PI) * Math.min(1, dt * 2);
      var want = new T.Vector3(me.x + Math.sin(camYaw) * camDist * Math.cos(camPitch), 1.4 + Math.sin(camPitch) * camDist + .6, me.z + Math.cos(camYaw) * camDist * Math.cos(camPitch));
      want.x = Math.max(-W + .4, Math.min(W - .4, want.x)); want.z = Math.max(Z1 + .4, Math.min(Z0 - .3, want.z)); want.y = Math.min(H - .5, want.y);
      camPos.lerp(want, Math.min(1, dt * 5)); camLook.lerp(new T.Vector3(me.x, 1.45, me.z), Math.min(1, dt * 8));
      camera.position.copy(camPos); camera.lookAt(camLook);
      /* AI visitors wander, stop at machines and play */
      bots.forEach(function (b, k) {
        if (b.wait > 0) { b.wait -= dt; pose(b.legs, b.arms, t * 3 + k, 0, b.playing); if (b.wait <= 0) { b.playing = false; var c = cabs[Math.floor(Math.random() * cabs.length)]; if (!c.game.ready) c = cabs[k % 6]; var p = standPoint(c); p.x += (Math.random() - .5) * .3; b.path = routeTo(b.x, b.z, p); b.pi = 0; b.faceEnd = c.side > 0 ? Math.PI / 2 : -Math.PI / 2; b.cab = c; } }
        else { var w2 = b.path[b.pi]; if (w2) { if (stepTo(b, w2.x, w2.z, 1.6, dt, .3)) b.pi++; b.g.rotation.y = b.face; b.ph += dt * 7; pose(b.legs, b.arms, b.ph, .45, false); } else { b.g.rotation.y = b.faceEnd; b.playing = true; b.wait = 6 + Math.random() * 8; } }
        if (Math.hypot(b.x - me.x, b.z - me.z) < .7) { b.x += (b.x - me.x) * .05; }
        b.g.position.set(b.x, 0, b.z);
      });
      var c = cabs[sel];
      ring.position.set(c.pos.x + c.dir.x * 1.1, .04, c.pos.z); ring.rotation.z = t * .6; ring.material.opacity = .55 + Math.sin(t * 3) * .25;
      cabs.forEach(function (cb, i) { if (Math.abs(cb.pos.z - camera.position.z) < 16) { cb.p.draw(t + i * .7, i === sel || bots.some(function (b) { return b.playing && b.cab === cb; })); cb.tex.needsUpdate = true; } });
      var beat = (Math.sin(t * Math.PI * 2 * 2.08) + 1) / 2;
      tubes.forEach(function (tb, k) { tb.material.color.setHSL(((t * .05) + k * .07) % 1, .85, .45 + beat * .15); });
      lane.forEach(function (l) { l.material.color.setHSL(.11, .55, .45 + beat * .2); });
      panels.forEach(function (p, k) { var v = .55 + .35 * Math.sin(t * 1.2 + k * .5); p.material.color.setRGB(v, v * .97, v * .92); });
      spots.forEach(function (l, k) { l.position.x = Math.sin(t * .7 + k * 1.7) * 7; l.position.z = Z0 - 6 - k * 8 + Math.cos(t * .5 + k) * 3; l.intensity = 1 + beat * .8; });
      holo.rotation.y = t * .8; holo.rotation.x = Math.sin(t * .5) * .3;
      var hp = holo.geometry.attributes.position, morph = (Math.sin(t * .9) + 1) / 2;
      for (var v = 0; v < hp.count; v++) { var bx2 = holoBase[v * 3], by = holoBase[v * 3 + 1], bz = holoBase[v * 3 + 2], n = 1 + morph * .35 * Math.sin(bx2 * 4 + t * 3) * Math.cos(bz * 4 + t * 2); hp.array[v * 3] = bx2 * n; hp.array[v * 3 + 1] = by * n; hp.array[v * 3 + 2] = bz * n; }
      hp.needsUpdate = true;
      rings.forEach(function (rg, k) { rg.rotation.z = t * (k % 2 ? -.6 : .8); rg.position.y = 1.6 + k * .5 + Math.sin(t * 2 + k) * .12; });
      holoTitle.lookAt(camera.position.x, holoTitle.getWorldPosition(new T.Vector3()).y, camera.position.z);
      var a = t * 1.7; puck.position.set(Math.sin(a) * .85, .98, Math.sin(a * 1.37) * 1.5); mal1.position.set(Math.sin(a * .9) * .6, .98, 1.5); mal2.position.set(Math.sin(a * 1.1 + 1) * .6, .98, -1.5);
      clawHead.position.set(Math.sin(t * .8) * .4, 2.3 + Math.sin(t * 1.6) * .2, Math.cos(t * .6) * .4);
      dust.rotation.y = t * .01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function finish(thenPlay) {
      if (!running) return; running = false; cancelAnimationFrame(raf);
      removeEventListener('resize', size); removeEventListener('keydown', onKey, true); removeEventListener('keyup', onKeyUp, true);
      try { if (music) { clearInterval(music.iv); music.master.disconnect(); } } catch (e) {}
      try { scene.remove(avatar); scene.traverse(function (o) { if (o.userData && o.userData.__shared) return; if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
      root.remove();
      if (thenPlay) { try { var s = S(); window.__fyrus.setState({ activeGame: thenPlay, hud: Object.assign({}, s && s.hud, { open: false }) }); } catch (e) {} }
    }
    API.close = function () { finish(null); };
    function tryPlay() { var gm = cabs[sel].game; if (!gm.ready) return; if (atCab()) finish(gm.id); else setMode('tour'); }
    function onKey(e) {
      var k = e.key.toLowerCase(); e.stopPropagation();
      if (k === 'escape') { e.preventDefault(); finish(null); return; }
      if (k === 'e' || k === 'enter') { e.preventDefault(); tryPlay(); return; }
      if (k === 'q' || k === 'pageup') { select(sel - 1); setMode('tour'); return; }
      if (k === 'pagedown') { select(sel + 1); setMode('tour'); return; }
      keys[k] = true; if (k.indexOf('arrow') === 0 || k === ' ') e.preventDefault();
    }
    function onKeyUp(e) { keys[e.key.toLowerCase()] = false; e.stopPropagation(); }
    prev.onclick = function () { select(sel - 1); setMode('tour'); }; next.onclick = function () { select(sel + 1); setMode('tour'); };
    play.onclick = tryPlay;
    closeBtn.onclick = function () { finish(null); };
    var ray = new T.Raycaster(), ndc = new T.Vector2(), down = null, drag = false;
    canvas.addEventListener('pointerdown', function (e) { down = { x: e.clientX, y: e.clientY, yaw: camYaw, pitch: camPitch }; startMusic(); });
    canvas.addEventListener('pointermove', function (e) { if (!down) return; var mx = e.clientX - down.x, my = e.clientY - down.y; if (Math.abs(mx) + Math.abs(my) > 6) drag = true; if (drag) { camYaw = down.yaw - mx * .006; camPitch = Math.max(.08, Math.min(1.1, down.pitch + my * .004)); } });
    canvas.addEventListener('pointerup', function (e) {
      var wasDrag = drag; drag = false; if (!down) return; down = null; if (wasDrag) return;
      var r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera);
      var hits = ray.intersectObjects(cabs.map(function (c) { return c.g; }), true);
      if (hits.length) { var o = hits[0].object; while (o && o.userData.idx == null) o = o.parent; if (o) { if (o.userData.idx === sel && atCab()) tryPlay(); else { select(o.userData.idx); setMode('tour'); } } return; }
      var fh = ray.intersectObject(floor); if (fh.length) { var p = fh[0].point; auto = { path: [{ x: p.x, z: p.z }], face: me.yaw, idx: 0 }; }
    });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); camDist = Math.max(2.5, Math.min(9, camDist * (1 + Math.sign(e.deltaY) * .1))); }, { passive: false });
    var sid = null, knob = stick.querySelector('i');
    stick.addEventListener('pointerdown', function (e) { sid = e.pointerId; stick.setPointerCapture(sid); e.stopPropagation(); });
    stick.addEventListener('pointermove', function (e) { if (e.pointerId !== sid) return; var r = stick.getBoundingClientRect(), dx = e.clientX - (r.left + 55), dy = e.clientY - (r.top + 55), L = Math.hypot(dx, dy); if (L > 42) { dx *= 42 / L; dy *= 42 / L; } knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)'; stickV = { x: dx / 42, y: dy / 42 }; });
    stick.addEventListener('pointerup', function () { sid = null; stickV = { x: 0, y: 0 }; knob.style.transform = ''; });
    addEventListener('resize', size); addEventListener('keydown', onKey, true); addEventListener('keyup', onKeyUp, true);
    size(); select(sel, true); setMode(startId ? 'tour' : 'walk'); raf = requestAnimationFrame(frame);
  };
})();
