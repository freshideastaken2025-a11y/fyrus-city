/* Fyrus — 3D Home Showroom (v1.0)
   See a home in 3D before you buy it: rotate it, change walls, roof, trim, fence and garden live,
   test the smart lock, and scrub the time of day (windows glow at night).
   Two modes:
     catalogue — Dream Life homes (City Studio … Desert Pyramid) with Buy / Move in (existing actions)
     exterior  — your society home's outside look; "Save" sends it through the existing home_ext call.
   API: window.__fyrusHome3D.open({ mode, start, ext, onSave }) */
(function () {
  'use strict';
  if (window.__fyrusHome3D) return;
  var API = window.__fyrusHome3D = { version: '1.1.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var D = function () { return window.__fyrusDream || {}; };
  var FALLBACK_HOMES = [
    { id: 'studio', name: 'City Studio', price: 0, style: 'tower', floors: 3, garden: 1, theme: '#a8d8ff', desc: 'Your starter flat.' },
    { id: 'villa', name: 'Garden Villa', price: 120000, style: 'villa', floors: 2, garden: 4, theme: '#e9d8b8', desc: 'Two floors, big garden, quiet street.' },
    { id: 'dome', name: 'Glass Dome House', price: 210000, style: 'dome', floors: 2, garden: 3, theme: '#cfe3d6', desc: 'Panoramic glass dome with a roof garden.' },
    { id: 'penthouse', name: 'Sky Penthouse', price: 480000, style: 'spire', floors: 9, garden: 2, theme: '#d6e2ef', desc: 'Top-floor penthouse with a city view.' },
    { id: 'mansion', name: 'Marina Mansion', price: 900000, style: 'stack', floors: 5, garden: 5, theme: '#f0dcc6', desc: 'Five floors, pool deck, cinema room.' },
    { id: 'pyramid', name: 'Desert Pyramid', price: 650000, style: 'pyramid', floors: 4, garden: 3, theme: '#f3e3a6', desc: 'A modern pyramid with a courtyard.' }
  ];
  var WALLS = ['#ffffff', '#efe9df', '#e8dcc8', '#d8cfbf', '#f3e0c9', '#e3c7a5', '#c96f4a', '#b55a4c', '#dfe6ee', '#a9b8c8', '#9fb08f', '#6b7a8a', '#3d4650', '#f2d16b'];
  var ROOFS = ['#5a3f35', '#6b4a3a', '#8b3a2e', '#3a3d42', '#2b2e33', '#4f5d6b', '#2f5d50', '#f2f2ee', '#b55a3c'];
  var TRIMS = ['#ffffff', '#2b2e33', '#5a3f35', '#3a5a7a', '#8b3a2e', '#2f5d50', '#d4a64a'];
  var FENCES = [['none', 'No fence'], ['hedge', 'Hedge'], ['picket', 'White picket'], ['iron', 'Black iron'], ['wall', 'Low wall']];
  var GARDENS = [['lawn', 'Lawn'], ['flowers', 'Flower beds'], ['stone', 'Stone patio'], ['trees', 'Fruit trees']];
  function fmt(n) { return n ? n.toLocaleString('en-US') + ' FYC' : 'Free'; }

  var css = '' +
    '.fx3h{position:fixed;inset:0;z-index:2147483060;background:#0a0f1a;color:' + IVORY + ';font-family:"Plus Jakarta Sans",system-ui,sans-serif;touch-action:none}' +
    '.fx3h canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fx3h-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:16px max(16px,env(safe-area-inset-left,0px));pointer-events:none}' +
    '.fx3h-k{font:500 11px "JetBrains Mono",monospace;letter-spacing:.32em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fx3h-t{font:400 clamp(30px,5vw,48px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.05em;margin-top:6px}' +
    '.fx3h-x{pointer-events:auto;border-radius:999px;border:1px solid rgba(201,169,110,.5);background:rgba(10,15,26,.7);color:' + GOLD_HI + ';font:600 11px Sora,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:10px 16px;cursor:pointer}' +
    '.fx3h-side{position:absolute;left:max(16px,env(safe-area-inset-left,0px));top:110px;width:250px;max-height:calc(100% - 260px);overflow:auto;background:rgba(10,15,26,.82);border:1px solid rgba(201,169,110,.3);border-radius:16px;padding:14px;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '.fx3h-side h4{margin:12px 0 6px;font:500 10px "JetBrains Mono",monospace;letter-spacing:.24em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fx3h-side h4:first-child{margin-top:0}' +
    '.fx3h-sw{display:flex;flex-wrap:wrap;gap:5px}' +
    '.fx3h-sw button{width:24px;height:24px;border-radius:7px;border:1px solid rgba(255,255,255,.25);cursor:pointer;padding:0}' +
    '.fx3h-sw button[aria-pressed="true"]{outline:2px solid ' + GOLD_HI + ';outline-offset:2px}' +
    '.fx3h-chips{display:flex;flex-wrap:wrap;gap:5px}' +
    '.fx3h-chips button{border-radius:999px;border:1px solid rgba(201,169,110,.35);background:transparent;color:' + IVORY + ';font:600 11px Sora,sans-serif;padding:6px 10px;cursor:pointer}' +
    '.fx3h-chips button[aria-pressed="true"]{background:' + GOLD + ';color:#1a1408;border-color:' + GOLD + '}' +
    '.fx3h-side input[type=range]{width:100%;accent-color:' + GOLD + '}' +
    '.fx3h-card{position:absolute;left:50%;bottom:max(18px,env(safe-area-inset-bottom,0px));transform:translateX(-50%);width:min(600px,calc(100% - 32px));background:rgba(10,15,26,.85);border:1px solid rgba(201,169,110,.35);border-radius:18px;padding:16px 18px;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}' +
    '.fx3h-card b{display:block;font:600 18px Sora,sans-serif}' +
    '.fx3h-card small{display:block;color:' + MUTED + ';font-size:12.5px;margin-top:3px}' +
    '.fx3h-card .pr{font:500 11px "JetBrains Mono",monospace;letter-spacing:.18em;color:' + GOLD_HI + ';margin-top:6px;text-transform:uppercase}' +
    '.fx3h-nav{display:flex;gap:6px}' +
    '.fx3h-nav button,.fx3h-act{border-radius:999px;border:1px solid rgba(201,169,110,.5);background:transparent;color:' + GOLD_HI + ';font:600 12px Sora,sans-serif;letter-spacing:.12em;cursor:pointer;padding:12px 14px;white-space:nowrap}' +
    '.fx3h-act.gold{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408;text-transform:uppercase}' +
    '.fx3h-act[disabled]{opacity:.55;cursor:default}' +
    '.fx3h-hint{position:absolute;right:max(16px,env(safe-area-inset-right,0px));top:110px;font:500 10px "JetBrains Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:' + MUTED + ';text-align:right;line-height:1.8;pointer-events:none}' +
    '@media (max-width:760px){.fx3h-side{top:auto;bottom:150px;left:16px;right:16px;width:auto;max-height:34vh}.fx3h-hint{display:none}.fx3h-card{grid-template-columns:1fr;text-align:center}.fx3h-nav{justify-content:center}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  var running = false;
  API.open = function (opts) {
    opts = opts || {};
    var T = window.THREE; if (!T || running) return; running = true;
    var exterior = opts.mode === 'exterior';
    var homes = exterior ? [{ id: 'mine', name: 'Your house', price: 0, style: 'villa', floors: 2, garden: 3, theme: '#efe9df', desc: 'Outside look · everyone in the city sees this.' }] : ((D().homes && D().homes.length) ? D().homes : FALLBACK_HOMES);
    var idx = Math.max(0, homes.findIndex(function (h) { return h.id === opts.start; }));
    var ext = Object.assign({ wall: '#ffffff', roof: '#5a3f35', trim: '#ffffff', fence: 'hedge', garden: 'lawn' }, opts.ext || {});
    if (!exterior && !opts.ext) ext.wall = homes[idx].theme || ext.wall;
    var locked = true, hour = 16.5;

    var root = el('div', { 'class': 'fx3h fxp-ov', role: 'dialog', 'aria-label': 'Home showroom' });
    var canvas = el('canvas'); root.appendChild(canvas);
    var closeBtn = el('button', { 'class': 'fx3h-x' }, ['Close · Esc']);
    root.appendChild(el('div', { 'class': 'fx3h-top' }, [el('div', null, [el('div', { 'class': 'fx3h-k' }, [exterior ? 'Homes & Keys · outside look' : 'Dream Life · Fyrus Realty']), el('div', { 'class': 'fx3h-t' }, [exterior ? 'Your house in 3D' : 'Home Showroom'])]), closeBtn]));
    root.appendChild(el('div', { 'class': 'fx3h-hint' }, ['Drag to turn', el('br'), 'Scroll or pinch to zoom']));
    var side = el('div', { 'class': 'fx3h-side' }); root.appendChild(side);
    var nameEl = el('b'), subEl = el('small'), prEl = el('div', { 'class': 'pr' });
    var prev = el('button', { 'aria-label': 'Previous home' }, ['‹']), next = el('button', { 'aria-label': 'Next home' }, ['›']);
    var act = el('button', { 'class': 'fx3h-act gold' }, ['Buy']);
    root.appendChild(el('div', { 'class': 'fx3h-card' }, [exterior ? el('span') : el('div', { 'class': 'fx3h-nav' }, [prev, next]), el('div', null, [nameEl, subEl, prEl]), act]));
    document.body.appendChild(root);

    var renderer = null;
    [{ antialias: true }, { antialias: false, powerPreference: 'low-power' }].some(function (o) { try { o.canvas = canvas; renderer = new T.WebGLRenderer(o); return true; } catch (e) { return false; } });
    if (!renderer) { root.remove(); running = false; return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    var scene = new T.Scene(); var camera = new T.PerspectiveCamera(40, 1, .1, 400);
    var hemi = new T.HemisphereLight(0xdbe8ff, 0x3a3226, .9); scene.add(hemi);
    var skyU = { top: { value: new T.Color(0x3a6fb0) }, bot: { value: new T.Color(0xf2c79a) } };
    var skyDome = new T.Mesh(new T.SphereGeometry(300, 32, 16), new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: skyU,
      vertexShader: 'varying float h; void main(){ h = normalize(position).y; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 top; uniform vec3 bot; varying float h; void main(){ gl_FragColor = vec4(mix(bot, top, smoothstep(-0.05, 0.55, h)), 1.0); }' }));
    scene.add(skyDome);
    /* scenery around the plinth: trees and a street lamp */
    (function () { var tm = new T.MeshStandardMaterial({ color: 0x6b4b2e }), lm = new T.MeshStandardMaterial({ color: 0x3f7a34, flatShading: true }), cm = new T.MeshStandardMaterial({ color: 0x2f5a2a, flatShading: true });
      for (var i = 0; i < 26; i++) { var a = i / 26 * Math.PI * 2 + (i % 3) * .1, r = 30 + (i % 4) * 7; var tr = new T.Mesh(new T.CylinderGeometry(.3, .45, 3, 6), tm); tr.position.set(Math.cos(a) * r, 1.5, Math.sin(a) * r); scene.add(tr); var cr = i % 2 ? new T.Mesh(new T.ConeGeometry(2, 6, 7), cm) : new T.Mesh(new T.IcosahedronGeometry(2.4, 0), lm); cr.position.set(Math.cos(a) * r, i % 2 ? 5.5 : 4.4, Math.sin(a) * r); cr.castShadow = true; scene.add(cr); } })();
    var sun = new T.DirectionalLight(0xffffff, 1.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -22, right: 22, top: 22, bottom: -22, near: 1, far: 120 }); scene.add(sun, sun.target);
    var ground = new T.Mesh(new T.CircleGeometry(90, 64), new T.MeshStandardMaterial({ color: 0x2c3a2a, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -.05; ground.receiveShadow = true; scene.add(ground);
    var plinth = new T.Mesh(new T.CylinderGeometry(19, 19.6, .5, 72), new T.MeshStandardMaterial({ color: 0x1b2333, roughness: .5, metalness: .4 })); plinth.position.y = -.25; plinth.receiveShadow = true; scene.add(plinth);
    var halo = new T.Mesh(new T.TorusGeometry(19.3, .06, 6, 140), new T.MeshBasicMaterial({ color: 0xc9a96e })); halo.rotation.x = Math.PI / 2; halo.position.y = .02; scene.add(halo);
    var homeG = new T.Group(); scene.add(homeG);
    var winMats = [], lockLamp = null, door = null;

    var M = function (c, o) { o = o || {}; o.color = c; return new T.MeshStandardMaterial(o); };
    function add(g, geo, mat, x, y, z, ry) { var m = new T.Mesh(geo, mat); m.position.set(x || 0, y || 0, z || 0); if (ry) m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true; g.add(m); return m; }
    function build() {
      homeG.clear(); winMats = [];
      var h = homes[idx], wall = M(ext.wall, { roughness: .6 }), roof = M(ext.roof, { roughness: .7 }), trim = M(ext.trim, { roughness: .5 });
      var glass = new T.MeshStandardMaterial({ color: 0x24405e, roughness: .1, metalness: .4, emissive: 0xffc98a, emissiveIntensity: 0 }); winMats.push(glass);
      var plot = 7 + (h.garden || 2) * 2.2;
      /* garden */
      var gcol = ext.garden === 'stone' ? 0xb9ae9c : 0x4f8f3a;
      add(homeG, new T.BoxGeometry(plot * 2, .2, plot * 2), M(gcol, { roughness: .95 }), 0, .1, 0);
      if (ext.garden === 'stone') { for (var i = -plot + 1; i < plot; i += 2) add(homeG, new T.BoxGeometry(plot * 2 - .4, .02, .05), M(0x8f8574), 0, .21, i); }
      if (ext.garden === 'flowers') { var cols = [0xff9a3c, 0xc792ea, 0xffc27a, 0xd9534f, 0xf4efe6]; for (var f = 0; f < 18; f++) { var a = f / 18 * Math.PI * 2, r = plot - 1.4; add(homeG, new T.SphereGeometry(.45, 8, 6), M(cols[f % 5], { roughness: .8 }), Math.cos(a) * r, .45, Math.sin(a) * r); } }
      if (ext.garden === 'trees') { for (var t2 = 0; t2 < 8; t2++) { var aa = t2 / 8 * Math.PI * 2 + .3, rr = plot - 1.6; add(homeG, new T.CylinderGeometry(.18, .26, 1.8, 6), M(0x6b4b2e), Math.cos(aa) * rr, 1.1, Math.sin(aa) * rr); add(homeG, new T.IcosahedronGeometry(1.2, 0), M(0x4e8a3a, { flatShading: true }), Math.cos(aa) * rr, 2.6, Math.sin(aa) * rr); add(homeG, new T.SphereGeometry(.16, 8, 6), M(0xff9a3c), Math.cos(aa) * rr + .5, 2.4, Math.sin(aa) * rr); } }
      /* fence */
      if (ext.fence !== 'none') {
        var fm = ext.fence === 'hedge' ? M(0x3f6b2e, { roughness: .9 }) : ext.fence === 'picket' ? M(0xf4f2ec) : ext.fence === 'iron' ? M(0x15161a, { metalness: .7, roughness: .35 }) : M(0xcfc4b2, { roughness: .8 });
        var fh = ext.fence === 'wall' ? .9 : ext.fence === 'hedge' ? 1.1 : 1.0;
        [[0, plot, plot * 2, 0], [0, -plot, plot * 2, 0], [plot, 0, plot * 2, Math.PI / 2], [-plot, 0, plot * 2, Math.PI / 2]].forEach(function (s, k) {
          if (ext.fence === 'hedge' || ext.fence === 'wall') { var seg = add(homeG, new T.BoxGeometry(s[2] - (k === 0 ? 3 : 0), fh, ext.fence === 'hedge' ? .7 : .35), fm, s[0] + (k === 0 ? 1.5 : 0), .2 + fh / 2, s[1], s[3]); }
          else { for (var p = -s[2] / 2; p <= s[2] / 2; p += .6) { if (k === 0 && Math.abs(p) < 1.5) continue; var lx = s[3] ? s[0] : s[0] + p, lz = s[3] ? s[1] + p : s[1]; add(homeG, new T.BoxGeometry(.08, fh, .08), fm, lx, .2 + fh / 2, lz); } var rail = add(homeG, new T.BoxGeometry(s[2], .06, .06), fm, s[0], .2 + fh * .8, s[1], s[3]); }
        });
      }
      /* the house by style */
      var fl = Math.max(1, h.floors || 2), FH = 3;
      function windows(w, d, y, frontOnly) {
        add(homeG, new T.BoxGeometry(w * .8, 1.3, .06), glass, 0, y, d / 2 + .03);
        for (var mx = -w * .4; mx <= w * .4 + .01; mx += w * .8 / Math.max(2, Math.round(w * .8 / 1.4))) add(homeG, new T.BoxGeometry(.08, 1.36, .1), trim, mx, y, d / 2 + .05);
        add(homeG, new T.BoxGeometry(w * .8 + .16, .1, .14), trim, 0, y - .7, d / 2 + .06);
        if (!frontOnly) { add(homeG, new T.BoxGeometry(w * .8, 1.3, .06), glass, 0, y, -d / 2 - .03); add(homeG, new T.BoxGeometry(.06, 1.3, d * .7), glass, w / 2 + .03, y, 0); add(homeG, new T.BoxGeometry(.06, 1.3, d * .7), glass, -w / 2 - .03, y, 0); }
      }
      var top = 0, doorZ = 4;
      if (h.style === 'villa') {
        for (var a1 = 0; a1 < fl; a1++) { add(homeG, new T.BoxGeometry(10, FH, 8), wall, 0, .2 + FH / 2 + a1 * FH, 0); windows(10, 8, .2 + FH * .55 + a1 * FH); add(homeG, new T.BoxGeometry(10.3, .2, 8.3), trim, 0, .2 + (a1 + 1) * FH, 0); }
        top = .2 + fl * FH; var roofG = new T.ConeGeometry(7.6, 3.4, 4, 1); roofG.rotateY(Math.PI / 4); roofG.scale(1, 1, .82); add(homeG, roofG, roof, 0, top + 1.7, 0);
        add(homeG, new T.BoxGeometry(4, .25, 2.4), trim, 0, 3, 5.2); [-1.8, 1.8].forEach(function (x) { add(homeG, new T.CylinderGeometry(.12, .12, 2.8, 8), trim, x, 1.6, 6.2); }); doorZ = 4.05;
      } else if (h.style === 'tower') {
        for (var a2 = 0; a2 < fl; a2++) { add(homeG, new T.BoxGeometry(6, FH, 6), wall, 0, .2 + FH / 2 + a2 * FH, 0); windows(6, 6, .2 + FH * .55 + a2 * FH); add(homeG, new T.BoxGeometry(6.8, .18, 1.2), trim, 0, .2 + (a2 + 1) * FH - .3, 3.4); }
        top = .2 + fl * FH; add(homeG, new T.BoxGeometry(6.4, .4, 6.4), roof, 0, top + .2, 0); doorZ = 3.05;
      } else if (h.style === 'dome') {
        add(homeG, new T.CylinderGeometry(6, 6.2, FH, 40), wall, 0, .2 + FH / 2, 0);
        var dm = new T.MeshStandardMaterial({ color: 0xbfe3ff, roughness: .05, metalness: .2, transparent: true, opacity: .35, emissive: 0xffc98a, emissiveIntensity: 0 }); winMats.push(dm);
        add(homeG, new T.SphereGeometry(6, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), dm, 0, .2 + FH, 0);
        add(homeG, new T.TorusGeometry(6.05, .12, 8, 60), trim, 0, .2 + FH, 0).rotation.x = Math.PI / 2;
        for (var r2 = 0; r2 < 6; r2++) { var ra = r2 / 6 * Math.PI * 2; add(homeG, new T.IcosahedronGeometry(.9, 0), M(0x4e8a3a, { flatShading: true }), Math.cos(ra) * 3, .2 + FH + 1, Math.sin(ra) * 3); }
        add(homeG, new T.BoxGeometry(9, .9, .06), glass, 0, 1.8, 6.05); top = .2 + FH + 6; doorZ = 6.1;
      } else if (h.style === 'spire') {
        for (var a3 = 0; a3 < fl; a3++) { add(homeG, new T.BoxGeometry(7, FH, 7), a3 % 2 ? wall : glass, 0, .2 + FH / 2 + a3 * FH, 0); add(homeG, new T.BoxGeometry(7.4, .16, 7.4), trim, 0, .2 + (a3 + 1) * FH, 0); }
        top = .2 + fl * FH; var ph = new T.MeshStandardMaterial({ color: 0x1a2534, roughness: .05, metalness: .7, emissive: 0xffc98a, emissiveIntensity: 0 }); winMats.push(ph);
        add(homeG, new T.BoxGeometry(6, FH, 6), ph, 0, top + FH / 2, 0); add(homeG, new T.BoxGeometry(7.6, .3, 7.6), roof, 0, top + FH + .15, 0);
        add(homeG, new T.ConeGeometry(.25, 5, 8), M(0xc9a96e, { metalness: 1, roughness: .3 }), 0, top + FH + 2.8, 0); top += FH + 5; doorZ = 3.55;
      } else if (h.style === 'stack') {
        for (var a4 = 0; a4 < fl; a4++) { var off = (a4 % 2 ? 1.5 : -1.5), w4 = 12 - a4 * 1.2; add(homeG, new T.BoxGeometry(w4, FH, 9 - a4 * .6), wall, off, .2 + FH / 2 + a4 * FH, 0); add(homeG, new T.BoxGeometry(w4 * .85, 1.4, .06), glass, off, .2 + FH * .55 + a4 * FH, (9 - a4 * .6) / 2 + .03); add(homeG, new T.BoxGeometry(w4 + .4, .18, 9.4 - a4 * .6), trim, off, .2 + (a4 + 1) * FH, 0); }
        top = .2 + fl * FH; add(homeG, new T.BoxGeometry(6, .3, 3.4), M(0x3cc4d6, { roughness: .05, emissive: 0x0c6a7a, emissiveIntensity: .4 }), 3, .35, 7); doorZ = 4.55;
      } else if (h.style === 'pyramid') {
        var pg = new T.ConeGeometry(8.5, 4.2 * fl * .7 + 4, 4, 1); pg.rotateY(Math.PI / 4);
        var pm = new T.MeshStandardMaterial({ color: ext.wall, roughness: .25, metalness: .5, emissive: 0xffc98a, emissiveIntensity: 0 }); winMats.push(pm);
        var pyr = add(homeG, pg, pm, 0, .2 + (4.2 * fl * .7 + 4) / 2, 0); top = .2 + 4.2 * fl * .7 + 4;
        add(homeG, new T.ConeGeometry(.9, 1.4, 4, 1), M(0xc9a96e, { metalness: 1, roughness: .2 }), 0, top + .4, 0).rotation.y = Math.PI / 4;
        add(homeG, new T.BoxGeometry(3, 2.6, 1.2), trim, 0, 1.5, 5.4); doorZ = 6.05;
      }
      /* stone path from the door to the gate */
      for (var sp = doorZ + 1; sp < plot - .4; sp += 1.1) add(homeG, new T.BoxGeometry(1.4, .06, .8), M(0xd8cfbe, { roughness: .9 }), 0, .23, sp);
      /* front door + smart lock */
      door = add(homeG, new T.BoxGeometry(1.3, 2.4, .12), M(ext.trim === '#ffffff' ? 0x5a3f35 : ext.trim, { roughness: .5 }), 0, 1.4, doorZ);
      lockLamp = add(homeG, new T.SphereGeometry(.13, 12, 10), new T.MeshBasicMaterial({ color: locked ? 0xff4d4d : 0x45e0ae }), .5, 1.6, doorZ + .1);
      fitCam(top);
      setHour(hour);
    }
    var dist = 34, yaw = .7, pitch = .32, targetY = 4;
    function fitCam(top) { targetY = Math.min(14, top * .42 + 1); dist = Math.max(26, top * 1.6 + 16) * Math.max(1, 1.15 / Math.max(.4, camera.aspect)); }

    function setHour(hh) {
      hour = hh; var t = (hh - 6) / 12 * Math.PI, el2 = Math.sin(t);
      var day = Math.max(0, el2);
      sun.position.set(Math.cos(t) * 40, Math.max(4, el2 * 50), 25); sun.intensity = .2 + day * 1.6;
      sun.color.setHSL(.09, .55 - day * .35, .55 + day * .2);
      hemi.intensity = .25 + day * .6;
      var top = new T.Color().setHSL(.6, .55, .05 + day * .42), bot = new T.Color().setHSL(.08, .55, .12 + day * .5);
      if (day < .4 && el2 > -.25) bot.lerp(new T.Color(0xf09a5a), .7 - day);
      skyU.top.value.copy(top); skyU.bot.value.copy(bot); scene.fog = new T.Fog(bot, 90, 260);
      var glow = Math.max(0, 1 - day * 2.6) * 1.3; winMats.forEach(function (m) { m.emissiveIntensity = glow; });
    }

    /* customisation panel */
    function swatches(list, key) {
      var box = el('div', { 'class': 'fx3h-sw' });
      list.forEach(function (c) { var b = el('button', { 'aria-label': key + ' ' + c, 'aria-pressed': String(ext[key] === c), style: 'background:' + c }); b.onclick = function () { ext[key] = c; renderSide(); build(); }; box.appendChild(b); });
      return box;
    }
    function chips(list, key) {
      var box = el('div', { 'class': 'fx3h-chips' });
      list.forEach(function (o) { var b = el('button', { 'aria-pressed': String(ext[key] === o[0]) }, [o[1]]); b.onclick = function () { ext[key] = o[0]; renderSide(); build(); }; box.appendChild(b); });
      return box;
    }
    function renderSide() {
      side.innerHTML = '';
      side.appendChild(el('h4', null, ['Walls'])); side.appendChild(swatches(WALLS, 'wall'));
      side.appendChild(el('h4', null, ['Roof'])); side.appendChild(swatches(ROOFS, 'roof'));
      side.appendChild(el('h4', null, ['Porch & trim'])); side.appendChild(swatches(TRIMS, 'trim'));
      side.appendChild(el('h4', null, ['Fence'])); side.appendChild(chips(FENCES, 'fence'));
      side.appendChild(el('h4', null, ['Garden'])); side.appendChild(chips(GARDENS, 'garden'));
      side.appendChild(el('h4', null, ['Smart lock']));
      var lk = el('div', { 'class': 'fx3h-chips' }, [el('button', { 'aria-pressed': String(locked) }, ['🔒 Locked']), el('button', { 'aria-pressed': String(!locked) }, ['🔓 Open'])]);
      lk.children[0].onclick = function () { locked = true; renderSide(); doorAnim = 0; build(); }; lk.children[1].onclick = function () { locked = false; renderSide(); doorAnim = 0; build(); };
      side.appendChild(lk);
      side.appendChild(el('h4', null, ['Time of day · ' + fmtHour(hour)]));
      var rg = el('input', { type: 'range', min: '5', max: '23.5', step: '.25', value: String(hour), 'aria-label': 'Time of day' }); rg.oninput = function () { setHour(+rg.value); side.querySelectorAll('h4')[6].textContent = 'Time of day · ' + fmtHour(hour); }; side.appendChild(rg);
      if (!exterior) side.appendChild(el('p', { style: 'margin:12px 0 0;color:' + MUTED + ';font-size:11.5px;line-height:1.5' }, ['Colours here are a preview. After you move in, set your outside look in Homes & Keys.']));
    }
    function fmtHour(h) { var H = Math.floor(h), m = Math.round((h - H) * 60); return (H < 10 ? '0' : '') + H + ':' + (m < 10 ? '0' : '') + m; }
    function renderCard() {
      var h = homes[idx], d = D(), dream = d.state ? d.state() : null, owned = dream && dream.homes && dream.homes.indexOf(h.id) >= 0, living = dream && dream.home === h.id;
      nameEl.textContent = h.name; subEl.textContent = (exterior ? '' : h.floors + ' floors · ') + h.desc; prEl.textContent = exterior ? 'Everyone in the city sees this' : (living ? 'Living here' : owned ? 'You own this' : fmt(h.price));
      if (exterior) { act.textContent = 'Save outside look'; act.disabled = false; }
      else if (living) { act.textContent = 'Living here'; act.disabled = true; }
      else if (owned) { act.textContent = 'Move in'; act.disabled = false; }
      else { act.textContent = h.price ? 'Buy · ' + fmt(h.price) : 'Get it free'; act.disabled = false; }
    }
    act.onclick = function () {
      var h = homes[idx], d = D();
      if (exterior) { try { opts.onSave && opts.onSave(Object.assign({}, ext)); } catch (e) {} finish(); return; }
      var dream = d.state ? d.state() : null, owned = dream && dream.homes && dream.homes.indexOf(h.id) >= 0;
      try { if (owned) d.moveIn && d.moveIn(h.id); else d.buy && d.buy(h.id); } catch (e) {}
      setTimeout(renderCard, 150);
    };
    function go(k) { idx = (idx + k + homes.length) % homes.length; if (!opts.ext) ext.wall = homes[idx].theme || ext.wall; renderSide(); renderCard(); build(); }
    prev.onclick = function () { go(-1); }; next.onclick = function () { go(1); };

    /* orbit controls (drag / wheel / pinch) */
    var drag = null, pinch = 0, auto = true, doorAnim = 1;
    canvas.addEventListener('pointerdown', function (e) { drag = { x: e.clientX, y: e.clientY, yaw: yaw, pitch: pitch }; auto = false; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', function (e) { if (!drag) return; yaw = drag.yaw - (e.clientX - drag.x) * .006; pitch = Math.max(.05, Math.min(1.25, drag.pitch + (e.clientY - drag.y) * .004)); });
    canvas.addEventListener('pointerup', function () { drag = null; });
    canvas.addEventListener('wheel', function (e) { e.preventDefault(); dist = Math.max(14, Math.min(90, dist * (1 + Math.sign(e.deltaY) * .08))); }, { passive: false });
    canvas.addEventListener('touchmove', function (e) { if (e.touches.length === 2) { var d2 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); if (pinch) dist = Math.max(14, Math.min(90, dist * pinch / d2)); pinch = d2; } }, { passive: true });
    canvas.addEventListener('touchend', function () { pinch = 0; });

    function size() { var w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
    var raf = 0, last = performance.now();
    function frame(now) {
      if (!running) return;
      var dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = Math.max(last, now);
      if (auto) yaw += dt * .18;
      camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, targetY + Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
      camera.lookAt(0, targetY, 0);
      if (door) { doorAnim = Math.min(1, doorAnim + dt * 1.5); var open = locked ? 0 : 1; door.rotation.y = (open ? -1.2 : 0) * doorAnim + (open ? 0 : 0); door.position.x = open ? -.6 * doorAnim : 0; }
      if (lockLamp) lockLamp.scale.setScalar(1 + Math.sin(now / 250) * .15);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    function finish() {
      if (!running) return; running = false; cancelAnimationFrame(raf);
      removeEventListener('resize', size); removeEventListener('keydown', onKey, true);
      try { scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
      root.remove();
    }
    API.close = finish;
    function onKey(e) {
      if (e.target && e.target.tagName === 'INPUT') return;
      var k = e.key; e.stopPropagation();
      if (k === 'Escape') { e.preventDefault(); finish(); } else if (!exterior && k === 'ArrowLeft') go(-1); else if (!exterior && k === 'ArrowRight') go(1);
    }
    closeBtn.onclick = finish;
    addEventListener('resize', size); addEventListener('keydown', onKey, true);
    size(); renderSide(); renderCard(); build(); raf = requestAnimationFrame(frame);
  };
})();
