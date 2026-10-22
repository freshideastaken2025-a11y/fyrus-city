/* Fyrus — Arcadia Battle Arena (v1.0)
   A short PUBG-style battle royale for sport: you + 11 AI rivals, a shrinking storm, cover and med kits.
   Charter of Fyrus: "Battles exist only as games in Arcadia" — nobody is hurt, no FYC is at stake, you earn XP.
   Self-contained: own renderer and overlay. Entry: the ⚔️ dock button or the arena gate near Play City (press E). */
(function () {
  'use strict';
  if (window.__fyrusArena) return;
  var API = window.__fyrusArena = { version: '1.1.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6';
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('fyrusArena.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fyrusArena.' + k, JSON.stringify(v)); } catch (e) {} }
  };

  var css = '' +
    '.fxa{position:fixed;inset:0;z-index:2147483080;background:#05080f;color:' + IVORY + ';font-family:"Plus Jakarta Sans",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}' +
    '.fxa canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fxa-top{position:absolute;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:flex-start;padding:14px 16px;pointer-events:none;gap:10px}' +
    '.fxa-chip{background:rgba(10,15,26,.78);border:1px solid rgba(201,169,110,.35);border-radius:12px;padding:8px 12px;font:600 12px Sora,sans-serif;letter-spacing:.08em;text-transform:uppercase}' +
    '.fxa-chip b{font:400 22px/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;color:' + GOLD_HI + ';margin-right:6px}' +
    '.fxa-hp{position:absolute;left:50%;bottom:24px;transform:translateX(-50%);width:min(360px,70vw);pointer-events:none}' +
    '.fxa-hp .bar{height:10px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;border:1px solid rgba(201,169,110,.35)}' +
    '.fxa-hp .fill{height:100%;background:linear-gradient(90deg,#e8d5a8,#c9a96e);transition:width .15s}' +
    '.fxa-hp .lbl{display:flex;justify-content:space-between;font:500 11px "JetBrains Mono",monospace;letter-spacing:.2em;color:#aab2c0;margin-bottom:6px}' +
    '.fxa-feed{position:absolute;right:16px;top:70px;display:flex;flex-direction:column;gap:6px;align-items:flex-end;pointer-events:none}' +
    '.fxa-feed div{background:rgba(10,15,26,.7);border-left:2px solid ' + GOLD + ';padding:5px 10px;font:500 12px Sora,sans-serif;border-radius:4px}' +
    '.fxa-warn{position:absolute;left:50%;top:22%;transform:translateX(-50%);font:400 clamp(26px,5vw,44px)/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.12em;color:#ff9a6a;text-shadow:0 4px 30px rgba(0,0,0,.6);pointer-events:none;opacity:0;transition:opacity .4s}' +
    '.fxa-card{position:absolute;inset:0;display:grid;place-items:center;background:radial-gradient(ellipse at center,rgba(5,8,15,.82),rgba(5,8,15,.94));text-align:center;padding:16px}' +
    '.fxa-card .k{font:500 11px "JetBrains Mono",monospace;letter-spacing:.4em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fxa-card .h{font:400 clamp(52px,10vw,110px)/.9 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;margin:12px 0;background:linear-gradient(180deg,#fbf1d6,' + GOLD + ');-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.fxa-card p{color:#aab2c0;max-width:46ch;margin:0 auto 22px;line-height:1.6;font-size:14px}' +
    '.fxa-card ul{list-style:none;padding:0;margin:0 auto 24px;display:grid;gap:6px;font:500 13px Sora,sans-serif;color:#d4d9e1}' +
    '.fxa-btns{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}' +
    '.fxa-btn{border-radius:999px;padding:14px 26px;font:600 13px Sora,sans-serif;letter-spacing:.18em;text-transform:uppercase;cursor:pointer;border:1px solid rgba(201,169,110,.55);background:transparent;color:' + GOLD_HI + '}' +
    '.fxa-btn.gold{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408}' +
    '.fxa-x{position:absolute;right:16px;bottom:16px;pointer-events:auto}' +
    '.fxa-stick{position:absolute;left:22px;bottom:70px;width:120px;height:120px;border-radius:50%;border:1px solid rgba(201,169,110,.4);background:rgba(10,15,26,.35);display:none}' +
    '.fxa-stick i{position:absolute;left:35px;top:35px;width:50px;height:50px;border-radius:50%;background:rgba(232,213,168,.6)}' +
    '.fxa-fire{position:absolute;right:26px;bottom:80px;width:86px;height:86px;border-radius:50%;border:0;background:radial-gradient(circle,#f0dfb4,#c9a96e);color:#1a1408;font:700 12px Sora,sans-serif;letter-spacing:.14em;display:none}' +
    '.fxa.touch .fxa-stick,.fxa.touch .fxa-fire{display:block}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, cls, kids) { var e = document.createElement(tag); if (cls) e.className = cls; (kids || []).forEach(function (k) { e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); }); return e; }

  var NAMES = ['Nova', 'Kai', 'Amara', 'Leo', 'Zara', 'Omar', 'Mei', 'Ravi', 'Sofia', 'Bilal', 'Ines', 'Theo', 'Ayesha', 'Jun'];
  var running = false;

  API.play = function () {
    var T = window.THREE; if (!T || running) return;
    running = true;
    var touch = matchMedia('(pointer: coarse)').matches;
    var root = el('div', 'fxa' + (touch ? ' touch' : '')); root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Arcadia Battle Arena');
    var canvas = el('canvas'); root.appendChild(canvas);
    var aliveChip = el('div', 'fxa-chip'), killChip = el('div', 'fxa-chip'), zoneChip = el('div', 'fxa-chip');
    root.appendChild(el('div', 'fxa-top', [el('div', null, [aliveChip]), zoneChip, el('div', null, [killChip])]));
    var feed = el('div', 'fxa-feed'); root.appendChild(feed);
    var warn = el('div', 'fxa-warn', ['Outside the zone']); root.appendChild(warn);
    var hpFill = el('div', 'fill'), hpNum = el('span');
    root.appendChild(el('div', 'fxa-hp', [el('div', 'lbl', [el('span', null, ['Health']), hpNum]), el('div', 'bar', [hpFill])]));
    var stick = el('div', 'fxa-stick', [el('i')]), fireBtn = el('button', 'fxa-fire', ['FIRE']);
    root.appendChild(stick); root.appendChild(fireBtn);
    var quit = el('button', 'fxa-btn fxa-x', ['Leave']); root.appendChild(quit);
    document.body.appendChild(root);

    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { root.remove(); running = false; return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = !touch;
    var scene = new T.Scene(); scene.background = new T.Color('#070b14'); scene.fog = new T.Fog('#070b14', 90, 220);
    var cam = new T.PerspectiveCamera(50, 1, .5, 600);
    scene.add(new T.HemisphereLight(0xbfd2ff, 0x101820, .7));
    var sun = new T.DirectionalLight(0xffe2b0, 1.5); sun.position.set(-60, 120, 40); sun.castShadow = !touch;
    sun.shadow.mapSize.set(1024, 1024); var sc = sun.shadow.camera; sc.left = sc.bottom = -120; sc.right = sc.top = 120; scene.add(sun);
    // ground with a gold survey grid
    var gc = document.createElement('canvas'); gc.width = gc.height = 512; var g = gc.getContext('2d');
    g.fillStyle = '#121a28'; g.fillRect(0, 0, 512, 512); g.strokeStyle = 'rgba(201,169,110,.18)'; g.lineWidth = 2;
    for (var i = 0; i <= 512; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 512); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(512, i); g.stroke(); }
    var gt = new T.CanvasTexture(gc); gt.wrapS = gt.wrapT = T.RepeatWrapping; gt.repeat.set(10, 10); if (T.sRGBEncoding) gt.encoding = T.sRGBEncoding;
    var ground = new T.Mesh(new T.PlaneGeometry(320, 320), new T.MeshStandardMaterial({ map: gt, roughness: .9 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

    var R = 110; // arena radius
    // cover: crates and walls, kept out of the very centre
    var covers = [], crateM = new T.MeshStandardMaterial({ color: 0x2a3446, roughness: .6, metalness: .3 }), trimM = new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: .9, roughness: .3 });
    var rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(Date.now() % 100000 + 7);
    for (i = 0; i < 46; i++) {
      var a = rnd() * Math.PI * 2, r = 14 + rnd() * (R - 18), w = 3 + rnd() * 7, d = 2 + rnd() * 3, h = 2 + rnd() * 3;
      if (rnd() < .5) { var t = w; w = d; d = t; }
      var m = new T.Mesh(new T.BoxGeometry(w, h, d), crateM); m.position.set(Math.cos(a) * r, h / 2, Math.sin(a) * r); m.castShadow = m.receiveShadow = true; scene.add(m);
      var tr = new T.Mesh(new T.BoxGeometry(w + .1, .18, d + .1), trimM); tr.position.set(m.position.x, h, m.position.z); scene.add(tr);
      covers.push({ x: m.position.x, z: m.position.z, hw: w / 2 + .6, hd: d / 2 + .6 });
    }
    // neon pylons on the rim
    for (i = 0; i < 16; i++) { var pa = i / 16 * Math.PI * 2, p = new T.Mesh(new T.CylinderGeometry(.5, .7, 14, 10), new T.MeshStandardMaterial({ color: 0x000000, emissive: i % 2 ? 0x45e0ae : 0xc9a96e, emissiveIntensity: 1.6 })); p.position.set(Math.cos(pa) * (R + 6), 7, Math.sin(pa) * (R + 6)); scene.add(p); }
    // storm wall
    var storm = new T.Mesh(new T.CylinderGeometry(1, 1, 40, 96, 1, true), new T.MeshBasicMaterial({ color: 0xff7a3c, transparent: true, opacity: .22, side: T.DoubleSide, depthWrite: false }));
    storm.position.y = 20; scene.add(storm);
    var stormRing = new T.Mesh(new T.TorusGeometry(1, .12, 6, 128), new T.MeshBasicMaterial({ color: 0xffb27a })); stormRing.rotation.x = Math.PI / 2; stormRing.position.y = .2; scene.add(stormRing);

    function blockedAt(x, z, rad) {
      if (Math.hypot(x, z) > R + 4) return true;
      for (var k = 0; k < covers.length; k++) { var c = covers[k]; if (Math.abs(x - c.x) < c.hw + (rad || 0) - .6 && Math.abs(z - c.z) < c.hd + (rad || 0) - .6) return true; }
      return false;
    }
    function spawnPoint() { for (var tries = 0; tries < 60; tries++) { var a = rnd() * Math.PI * 2, r = 25 + rnd() * (R - 32), x = Math.cos(a) * r, z = Math.sin(a) * r; if (!blockedAt(x, z, 1.4)) return { x: x, z: z }; } return { x: 0, z: 0 }; }

    function makeFighter(color, name, isPlayer) {
      var grp = new T.Group();
      var body = new T.Mesh(T.CapsuleGeometry ? new T.CapsuleGeometry(.75, 1.2, 4, 10) : new T.CylinderGeometry(.75, .75, 2.2, 10), new T.MeshStandardMaterial({ color: color, metalness: .3, roughness: .45, emissive: isPlayer ? 0x3a2a08 : 0x000000 }));
      body.position.y = 1.4; body.castShadow = true; grp.add(body);
      var AV = window.__fyrusAvatarClass, av = null;
      if (AV) try {
        var hx = '#' + ('000000' + color.toString(16)).slice(-6), k = (name || '').length;
        var me = isPlayer && window.__fyrusW && window.__fyrusW.player && window.__fyrusW.player.outfit;
        var of = me ? Object.assign({}, me, { top: hx, topStyle: 'hoodie' }) : { gender: k % 2 ? 'f' : 'm', hair: ['short', 'ponytail', 'curly', 'bun', 'mohawk', 'long'][k % 6], hairColor: ['#1a1410', '#3a2a1e', '#c9a46a', '#2a2420'][k % 4], skin: ['#e8c4a0', '#b9805a', '#8d5a3b', '#d6a77e', '#f0d2b4'][k % 5], top: hx, topStyle: 'hoodie', bottom: '#1a2232', bottomStyle: 'trousers', shoes: '#efefef' };
        av = new AV('', '#ffffff', '', false, { acc: 'none', trail: 'none', board: 'classic', outfit: of }, of);
        av.label.visible = false; av.ring.visible = false; av.root.scale.setScalar(1.55);
        grp.remove(body); grp.add(av.root);
      } catch (e) { av = null; }
      var gun = new T.Mesh(new T.BoxGeometry(.3, .3, 1.6), new T.MeshStandardMaterial({ color: 0x1a2232, metalness: .8, roughness: .3 })); gun.position.set(.55, 1.6, .9); grp.add(gun);
      var ring = new T.Mesh(new T.RingGeometry(1, 1.25, 32), new T.MeshBasicMaterial({ color: isPlayer ? 0xe8d5a8 : 0x4da3ff, transparent: true, opacity: .7 })); ring.rotation.x = -Math.PI / 2; ring.position.y = .06; grp.add(ring);
      scene.add(grp);
      var sp = spawnPoint(); grp.position.set(sp.x, 0, sp.z);
      return { g: grp, body: body, av: av, lx: grp.position.x, lz: grp.position.z, name: name, hp: 100, alive: true, player: !!isPlayer, cd: 0, yaw: 0, kills: 0, target: null, think: 0, wander: null };
    }
    var player = makeFighter(0xd4b06a, 'You', true);
    var fighters = [player];
    var pool = NAMES.slice().sort(function () { return rnd() - .5; });
    for (i = 0; i < 11; i++) fighters.push(makeFighter([0x4da3ff, 0x45e0ae, 0xc792ea, 0x7fd1ff][i % 4], pool[i], false));
    // med kits
    var kits = [], kitM = new T.MeshStandardMaterial({ color: 0xffffff, emissive: 0x45e0ae, emissiveIntensity: .9 });
    for (i = 0; i < 14; i++) { var kp = spawnPoint(), km = new T.Mesh(new T.BoxGeometry(1.1, .6, 1.1), kitM); km.position.set(kp.x, .6, kp.z); scene.add(km); kits.push(km); }

    var bullets = [], bulletG = new T.SphereGeometry(.22, 8, 6), bulletPM = new T.MeshBasicMaterial({ color: 0xffe2a8 }), bulletBM = new T.MeshBasicMaterial({ color: 0x9fd4ff });
    function shoot(f, dirX, dirZ, spread) {
      var a = Math.atan2(dirX, dirZ) + (rnd() - .5) * spread;
      var b = new T.Mesh(bulletG, f.player ? bulletPM : bulletBM);
      b.position.set(f.g.position.x + Math.sin(a) * 1.4, 1.6, f.g.position.z + Math.cos(a) * 1.4); scene.add(b);
      bullets.push({ m: b, vx: Math.sin(a) * 85, vz: Math.cos(a) * 85, owner: f, life: .9, dmg: f.player ? 20 : 11 });
    }
    function say(text) { var d = el('div', null, [text]); feed.prepend(d); while (feed.children.length > 5) feed.lastChild.remove(); setTimeout(function () { d.remove(); }, 4500); }

    // input
    var keys = {}, aim = { x: 0, z: 1 }, firing = false, stickV = { x: 0, z: 0 };
    var ray = new T.Raycaster(), ndc = new T.Vector2(), plane = new T.Plane(new T.Vector3(0, 1, 0), -1.6), hit = new T.Vector3();
    function onKey(e) { if (e.key === 'Escape') { finish(true); return; } keys[e.key.toLowerCase()] = e.type === 'keydown'; if (e.key === ' ') { firing = e.type === 'keydown'; e.preventDefault(); } e.stopPropagation(); }
    window.addEventListener('keydown', onKey, true); window.addEventListener('keyup', onKey, true);
    canvas.addEventListener('pointermove', function (e) { if (e.pointerType === 'touch') return; ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, cam); if (ray.ray.intersectPlane(plane, hit)) { aim.x = hit.x - player.g.position.x; aim.z = hit.z - player.g.position.z; } });
    canvas.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'touch') firing = true; });
    window.addEventListener('pointerup', function (e) { if (e.pointerType !== 'touch') firing = false; });
    var stickId = null, stickC = null;
    stick.addEventListener('pointerdown', function (e) { stickId = e.pointerId; var r = stick.getBoundingClientRect(); stickC = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; stick.setPointerCapture(e.pointerId); });
    stick.addEventListener('pointermove', function (e) { if (e.pointerId !== stickId) return; var dx = e.clientX - stickC.x, dy = e.clientY - stickC.y, l = Math.min(1, Math.hypot(dx, dy) / 50); var a = Math.atan2(dy, dx); stickV.x = Math.cos(a) * l; stickV.z = Math.sin(a) * l; stick.firstChild.style.transform = 'translate(' + stickV.x * 35 + 'px,' + stickV.z * 35 + 'px)'; });
    stick.addEventListener('pointerup', function () { stickId = null; stickV.x = stickV.z = 0; stick.firstChild.style.transform = ''; });
    fireBtn.addEventListener('pointerdown', function (e) { firing = true; e.preventDefault(); }); fireBtn.addEventListener('pointerup', function () { firing = false; });
    quit.onclick = function () { finish(true); };

    function size() { renderer.setSize(innerWidth, innerHeight, false); cam.aspect = innerWidth / innerHeight; cam.updateProjectionMatrix(); }
    size(); window.addEventListener('resize', size);

    // storm phases: [hold seconds, shrink seconds, target radius]
    var phases = [[20, 25, 72], [15, 20, 44], [12, 18, 22], [10, 15, 8]], phase = 0, phaseT = 0, zoneR = R + 8, zoneFrom = zoneR, zoneC = { x: 0, z: 0 }, zoneNextC = { x: 0, z: 0 };
    var started = false, over = false, last = performance.now(), place = 0;

    function aliveList() { return fighters.filter(function (f) { return f.alive; }); }
    function eliminate(f, by) {
      f.alive = false; f.g.visible = false;
      if (by) { by.kills++; say((by.player ? 'You' : by.name) + ' tagged out ' + (f.player ? 'you' : f.name)); }
      else say((f.player ? 'You were' : f.name + ' was') + ' caught by the storm');
      if (f.player) { place = aliveList().length + 1; setTimeout(function () { end(false); }, 900); }
      else if (aliveList().length === 1 && player.alive) { place = 1; setTimeout(function () { end(true); }, 700); }
    }
    function step(dt) {
      // storm
      var ph = phases[Math.min(phase, phases.length - 1)];
      if (phase < phases.length) {
        phaseT += dt;
        if (phaseT > ph[0]) { var k = Math.min(1, (phaseT - ph[0]) / ph[1]); zoneR = zoneFrom + (ph[2] - zoneFrom) * k; zoneC.x += (zoneNextC.x - zoneC.x) * k * .05; zoneC.z += (zoneNextC.z - zoneC.z) * k * .05; }
        if (phaseT > ph[0] + ph[1]) { phase++; phaseT = 0; zoneFrom = zoneR; var na = rnd() * Math.PI * 2, nr = rnd() * zoneR * .3; zoneNextC = { x: zoneC.x + Math.cos(na) * nr, z: zoneC.z + Math.sin(na) * nr }; }
        var left = Math.max(0, Math.ceil(ph[0] - phaseT));
        zoneChip.innerHTML = ''; zoneChip.appendChild(el('b', null, [left > 0 ? left + 's' : 'NOW'])); zoneChip.appendChild(document.createTextNode(left > 0 ? 'until the zone closes' : 'zone closing'));
      }
      storm.scale.set(zoneR, 1, zoneR); storm.position.x = zoneC.x; storm.position.z = zoneC.z;
      stormRing.scale.set(zoneR, zoneR, 1); stormRing.position.x = zoneC.x; stormRing.position.z = zoneC.z;
      // player
      if (player.alive) {
        var mx = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0) + stickV.x, mz = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0) + stickV.z;
        var ml = Math.hypot(mx, mz); if (ml > 1) { mx /= ml; mz /= ml; }
        move(player, mx * 13 * dt, mz * 13 * dt);
        if (touch) { var tgt = nearestEnemy(player, 45); if (tgt) { aim.x = tgt.g.position.x - player.g.position.x; aim.z = tgt.g.position.z - player.g.position.z; } else if (ml > .1) { aim.x = mx; aim.z = mz; } }
        player.g.rotation.y = Math.atan2(aim.x, aim.z);
        player.cd -= dt; if (firing && player.cd <= 0) { player.cd = .16; shoot(player, aim.x, aim.z, touch ? .08 : .04); }
      }
      // bots
      fighters.forEach(function (f) {
        if (f.player || !f.alive) return;
        f.think -= dt;
        if (f.think <= 0) { f.think = .4 + rnd() * .5; f.target = nearestEnemy(f, 38); if (!f.wander || rnd() < .3) { var a = rnd() * Math.PI * 2, r = rnd() * Math.max(6, zoneR * .6); f.wander = { x: zoneC.x + Math.cos(a) * r, z: zoneC.z + Math.sin(a) * r }; } }
        var dx, dz, sp = 9;
        var outside = Math.hypot(f.g.position.x - zoneC.x, f.g.position.z - zoneC.z) > zoneR - 4;
        if (f.target && f.target.alive && !outside) {
          dx = f.target.g.position.x - f.g.position.x; dz = f.target.g.position.z - f.g.position.z;
          var dist = Math.hypot(dx, dz); f.g.rotation.y = Math.atan2(dx, dz);
          var strafe = Math.sin(performance.now() / 600 + f.name.length) * .8;
          if (dist > 16) move(f, dx / dist * sp * dt, dz / dist * sp * dt); else move(f, -dz / dist * strafe * sp * dt, dx / dist * strafe * sp * dt);
          f.cd -= dt; if (f.cd <= 0 && dist < 34) { f.cd = .55 + rnd() * .5; shoot(f, dx, dz, .22); }
        } else {
          var to = outside || !f.wander ? zoneC : f.wander; dx = to.x - f.g.position.x; dz = to.z - f.g.position.z; var dl = Math.hypot(dx, dz) || 1;
          if (dl > 2) { move(f, dx / dl * sp * dt, dz / dl * sp * dt); f.g.rotation.y = Math.atan2(dx, dz); }
        }
      });
      // storm damage + med kits
      fighters.forEach(function (f) {
        if (!f.alive) return;
        var out = Math.hypot(f.g.position.x - zoneC.x, f.g.position.z - zoneC.z) > zoneR;
        if (out) { f.hp -= (6 + phase * 2) * dt; if (f.hp <= 0) eliminate(f, null); }
        if (f.player) warn.style.opacity = out ? '1' : '0';
        for (var k = kits.length - 1; k >= 0; k--) if (Math.hypot(kits[k].position.x - f.g.position.x, kits[k].position.z - f.g.position.z) < 1.6 && f.hp < 100) { f.hp = Math.min(100, f.hp + 40); scene.remove(kits[k]); kits.splice(k, 1); if (f.player) say('Med kit +40'); }
      });
      // bullets
      for (var b = bullets.length - 1; b >= 0; b--) {
        var bu = bullets[b]; bu.life -= dt; bu.m.position.x += bu.vx * dt; bu.m.position.z += bu.vz * dt;
        var gone = bu.life <= 0 || blockedAt(bu.m.position.x, bu.m.position.z, 0);
        if (!gone) for (var q = 0; q < fighters.length; q++) { var f = fighters[q]; if (!f.alive || f === bu.owner) continue; if (Math.hypot(f.g.position.x - bu.m.position.x, f.g.position.z - bu.m.position.z) < 1.1) { f.hp -= bu.dmg; f.body.material.emissive.setHex(0x7a2a10); setTimeout((function (ff) { return function () { ff.body.material.emissive.setHex(ff.player ? 0x3a2a08 : 0); }; })(f), 90); if (f.hp <= 0) eliminate(f, bu.owner); gone = true; break; } }
        if (gone) { scene.remove(bu.m); bullets.splice(b, 1); }
      }
      kits.forEach(function (k) { k.rotation.y += dt * 1.5; });
      // HUD
      var alive = aliveList().length;
      aliveChip.innerHTML = ''; aliveChip.appendChild(el('b', null, [String(alive)])); aliveChip.appendChild(document.createTextNode('alive'));
      killChip.innerHTML = ''; killChip.appendChild(el('b', null, [String(player.kills)])); killChip.appendChild(document.createTextNode('tags'));
      var hp = Math.max(0, Math.round(player.hp)); hpFill.style.width = hp + '%'; hpNum.textContent = hp;
    }
    function move(f, dx, dz) {
      var p = f.g.position, nx = p.x + dx, nz = p.z + dz;
      if (!blockedAt(nx, p.z, 1)) p.x = nx;
      if (!blockedAt(p.x, nz, 1)) p.z = nz;
    }
    function nearestEnemy(f, range) {
      var best = null, bd = range;
      fighters.forEach(function (o) { if (o === f || !o.alive) return; var d = Math.hypot(o.g.position.x - f.g.position.x, o.g.position.z - f.g.position.z); if (d < bd) { bd = d; best = o; } });
      return best;
    }
    function frame(now) {
      if (!running) return;
      var dt = Math.max(0, Math.min(.05, (now - last) / 1000)); last = Math.max(last, now);
      if (started && !over) step(dt);
      fighters.forEach(function (f) {
        if (!f.av) return;
        var mv = Math.hypot(f.g.position.x - f.lx, f.g.position.z - f.lz) / Math.max(dt, 1e-3); f.lx = f.g.position.x; f.lz = f.g.position.z;
        f.av.speed += (Math.min(6, mv / 1.55) - f.av.speed) * Math.min(1, dt * 8);
        try { f.av.update(dt, now / 1000); } catch (e) {}
      });
      var p = player.alive ? player.g.position : (aliveList()[0] || player).g.position;
      cam.position.lerp(new T.Vector3(p.x, touch ? 46 : 40, p.z + (touch ? 26 : 24)), .12); cam.lookAt(p.x, 0, p.z - 2);
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    var card = null;
    function showCard(kids) { if (card) card.remove(); card = el('div', 'fxa-card', [el('div', null, kids)]); root.appendChild(card); }
    function intro() {
      var go = el('button', 'fxa-btn gold', ['Drop in']), back = el('button', 'fxa-btn', ['Back to Fyrus']);
      go.onclick = function () { card.remove(); card = null; started = true; last = performance.now(); say('12 contenders. Last one standing wins.'); };
      back.onclick = function () { finish(true); };
      var best = LS.get('best', null);
      showCard([el('div', 'k', ['Arcadia · Battle Arena']), el('div', 'h', ['Last One Standing']),
        el('p', null, ['A sport, not a crime: in Fyrus, battles only happen here, and nobody gets hurt. Outplay 11 rivals while the storm closes in.' + (best ? ' Your best: #' + best + '.' : '')]),
        el('ul', null, touch ? [el('li', null, ['Left stick to move · FIRE aims at the nearest rival']), el('li', null, ['Green boxes heal +40 · stay inside the ring'])] : [el('li', null, ['WASD to move · mouse to aim · click or Space to fire']), el('li', null, ['Green boxes heal +40 · stay inside the ring · Esc to leave'])]),
        el('div', 'fxa-btns', [go, back])]);
      go.focus();
    }
    function end(won) {
      if (over) return; over = true;
      var xp = Math.max(10, (13 - place) * 12) + player.kills * 15 + (won ? 120 : 0);
      var best = LS.get('best', null); if (!best || place < best) LS.set('best', place);
      LS.set('played', LS.get('played', 0) + 1); if (won) LS.set('wins', LS.get('wins', 0) + 1);
      try { var s = window.__fyrus.getState(); window.__fyrus.setState({ game: Object.assign({}, s.game, { xp: (s.game.xp || 0) + xp }) }); } catch (e) {}
      var again = el('button', 'fxa-btn gold', ['Play again']), back = el('button', 'fxa-btn', ['Back to Fyrus']);
      again.onclick = function () { finish(true); setTimeout(API.play, 350); };
      back.onclick = function () { finish(true); };
      showCard([el('div', 'k', [won ? 'Champion of Arcadia' : 'Good game']), el('div', 'h', [won ? 'Winner' : '#' + place + ' of 12']),
        el('p', null, [player.kills + ' tag' + (player.kills === 1 ? '' : 's') + ' · +' + xp + ' XP. ' + (won ? 'House Jade salutes you.' : 'The storm waits for no one — try again.')]),
        el('div', 'fxa-btns', [again, back])]);
      again.focus();
    }
    function finish() {
      if (!running) return; running = false;
      window.removeEventListener('keydown', onKey, true); window.removeEventListener('keyup', onKey, true); window.removeEventListener('resize', size);
      try { scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.dispose) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
      root.remove();
    }
    intro();
    requestAnimationFrame(frame);
  };

  /* ---- entry points: dock button + a gate near Play City ---- */
  var gate = null, gateFor = null;
  function addDock() {
    var dock = document.querySelector('.fxp-dock'); if (!dock || dock.querySelector('[data-fxa]')) return;
    var b = el('button', null, ['⚔️', el('span', null, ['Battle Arena'])]); b.setAttribute('aria-label', 'Battle Arena'); b.setAttribute('data-fxa', '1'); b.onclick = API.play;
    dock.appendChild(b);
  }
  function buildGate() {
    var W = window.__fyrusW, T = window.THREE; if (!W || !W.world || !T || gateFor === W) return;
    gateFor = W;
    var spot = null;
    for (var r = 80; r <= 120 && !spot; r += 10) for (var a = 0; a < 16 && !spot; a++) {
      var x = 216 + Math.cos(a / 16 * Math.PI * 2) * r, z = 216 + Math.sin(a / 16 * Math.PI * 2) * r, ok = true;
      for (var k = 0; k < W.colliders.length; k++) { var c = W.colliders[k]; if (c.x != null && Math.hypot(c.x - x, c.z - z) < (c.r || 3) + 8) { ok = false; break; } }
      if (ok) spot = { x: x, z: z };
    }
    if (!spot) return;
    var g = new T.Group(); g.name = 'fyrus-arena-gate'; g.position.set(spot.x, 0, spot.z); g.rotation.y = Math.atan2(216 - spot.x, 216 - spot.z);
    var pillarM = new T.MeshStandardMaterial({ color: 0x1a2232, metalness: .7, roughness: .3 }), glowM = new T.MeshStandardMaterial({ color: 0x000000, emissive: 0x45e0ae, emissiveIntensity: 1.8 });
    [-4, 4].forEach(function (px) { var p = new T.Mesh(new T.BoxGeometry(1.2, 9, 1.2), pillarM); p.position.set(px, 4.5, 0); g.add(p); });
    var arch = new T.Mesh(new T.TorusGeometry(4, .35, 10, 40, Math.PI), glowM); arch.position.y = 9; g.add(arch);
    var c2 = document.createElement('canvas'); c2.width = 512; c2.height = 128; var x2 = c2.getContext('2d'); x2.textAlign = 'center'; x2.textBaseline = 'middle';
    x2.font = '400 72px "Bebas Neue", Sora, sans-serif'; x2.fillStyle = '#e8d5a8'; x2.shadowColor = '#45e0ae'; x2.shadowBlur = 16; x2.fillText('BATTLE ARENA', 256, 64);
    var tex = new T.CanvasTexture(c2); var sign = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); sign.scale.set(9, 2.25, 1); sign.position.y = 14.5; g.add(sign);
    W.world.add(g);
    W.colliders.push({ x: spot.x - Math.cos(g.rotation.y) * 4, z: spot.z + Math.sin(g.rotation.y) * 4, r: .9 }, { x: spot.x + Math.cos(g.rotation.y) * 4, z: spot.z - Math.sin(g.rotation.y) * 4, r: .9 });
    W.staticInteracts.push({ pos: new T.Vector3(spot.x, 0, spot.z), radius: 5, label: 'Enter the Arcadia Battle Arena', action: 'arena', use: API.play });
    gate = g; API.gateAt = spot;
  }
  setInterval(function () { try { addDock(); buildGate(); } catch (e) {} }, 1000);
})();
