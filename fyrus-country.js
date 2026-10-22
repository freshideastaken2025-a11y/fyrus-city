/* Fyrus — Country layer (v1.0): Fyrus Transit
   Grand Central station, an elevated Skyline Rail loop and city buses in the world,
   plus the Transit desk (flights, train, bus) that links Fyrus Core with Vector Bay on the Azure Coast.
   Additive only: does not change any existing feature. Uses window.__fyrus (state) and window.__fyrusW (world). */
(function () {
  'use strict';
  if (window.__fyrusCountry) return;
  var API = window.__fyrusCountry = { version: '1.0.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('fyrusCountry.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fyrusCountry.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var S = function () { try { return window.__fyrus && window.__fyrus.getState(); } catch (e) { return null; } };

  var css = '' +
    '.fxc-ov{position:fixed;inset:0;z-index:2147483050;background:rgba(5,8,15,.72);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:grid;place-items:center;padding:16px;font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:' + IVORY + '}' +
    '.fxc-card{width:min(760px,100%);max-height:min(86vh,820px);overflow:auto;background:linear-gradient(180deg,#111a2b,#0a0f1a);border:1px solid rgba(201,169,110,.35);border-radius:20px;box-shadow:0 30px 90px rgba(0,0,0,.6);padding:26px}' +
    '.fxc-k{font:500 11px "JetBrains Mono",monospace;letter-spacing:.32em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fxc-h{font:400 clamp(38px,6vw,58px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.04em;margin:8px 0 6px}' +
    '.fxc-p{color:' + MUTED + ';font-size:14px;line-height:1.55;margin:0 0 18px;max-width:60ch}' +
    '.fxc-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}' +
    '.fxc-tabs button{border-radius:999px;border:1px solid rgba(201,169,110,.35);background:transparent;color:' + IVORY + ';font:600 11px Sora,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:9px 14px;cursor:pointer}' +
    '.fxc-tabs button[aria-pressed="true"]{background:' + GOLD + ';color:#1a1408;border-color:' + GOLD + '}' +
    '.fxc-list{display:grid;gap:10px}' +
    '.fxc-row{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:14px 16px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid rgba(201,169,110,.16)}' +
    '.fxc-row .ic{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;font-size:20px;background:rgba(201,169,110,.12)}' +
    '.fxc-row b{display:block;font:600 15px Sora,sans-serif}' +
    '.fxc-row small{display:block;color:' + MUTED + ';font-size:12.5px;margin-top:3px;line-height:1.4}' +
    '.fxc-row .tag{font:500 10px "JetBrains Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:' + GOLD_HI + '}' +
    '.fxc-btn{border-radius:999px;padding:11px 18px;font:600 11px Sora,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;border:1px solid rgba(201,169,110,.55);background:transparent;color:' + GOLD_HI + ';white-space:nowrap}' +
    '.fxc-btn.gold{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408}' +
    '.fxc-btn[disabled]{opacity:.45;cursor:default}' +
    '.fxc-foot{display:flex;justify-content:space-between;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center}' +
    '.fxc-fly{position:fixed;inset:0;z-index:2147483090;display:grid;place-items:center;overflow:hidden;background:linear-gradient(180deg,#1b2a4a 0%,#c98a5c 62%,#f2c38b 100%);color:' + IVORY + ';font-family:Sora,sans-serif}' +
    '.fxc-fly .cl{position:absolute;border-radius:50%;background:rgba(255,255,255,.55);filter:blur(18px)}' +
    '.fxc-pass{position:relative;width:min(520px,92vw);border-radius:18px;background:rgba(10,15,26,.82);border:1px solid rgba(232,213,168,.5);padding:22px 24px;box-shadow:0 30px 80px rgba(0,0,0,.45)}' +
    '.fxc-pass .r{display:flex;justify-content:space-between;align-items:flex-end;gap:12px}' +
    '.fxc-pass .city{font:400 54px/.9 "Bebas Neue",Sora,sans-serif;letter-spacing:.04em}' +
    '.fxc-pass .lab{font:500 10px "JetBrains Mono",monospace;letter-spacing:.24em;color:' + GOLD + ';text-transform:uppercase}' +
    '.fxc-pass .bar{height:2px;background:rgba(232,213,168,.25);margin:18px 0 0;overflow:hidden;border-radius:2px}' +
    '.fxc-pass .bar i{display:block;height:100%;width:0;background:' + GOLD_HI + ';transition:width 2.6s linear}' +
    '@media (max-width:560px){.fxc-row{grid-template-columns:auto 1fr}.fxc-row .fxc-btn{grid-column:1/-1}.fxc-card{padding:18px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'style') e.style.cssText = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c == null) return; e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function toast(t) {
    var d = el('div', { 'class': 'fxp-toast', style: 'position:fixed;left:50%;bottom:170px;transform:translateX(-50%);z-index:2147483091;background:rgba(10,15,26,.94);border:1px solid rgba(201,169,110,.4);color:#fff;padding:10px 16px;border-radius:12px;font:600 13px Sora,sans-serif' }, [t]);
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 2600);
  }
  API.el = el; API.toast = toast; API.LS = LS;
  /* a modal that also hides the Fyrus+ dock (it watches for .fxp-ov) */
  function modal(build) {
    var ov = el('div', { 'class': 'fxc-ov fxp-ov', role: 'dialog', 'aria-modal': 'true' });
    var card = el('div', { 'class': 'fxc-card' }); ov.appendChild(card);
    var close = function () { ov.remove(); document.removeEventListener('keydown', esc, true); };
    var esc = function (e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } };
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    document.addEventListener('keydown', esc, true);
    ['keydown', 'keyup'].forEach(function (t) { ov.addEventListener(t, function (e) { if (e.key !== 'Escape') e.stopPropagation(); }); });
    build(card, close); document.body.appendChild(ov); return close;
  }
  API.modal = modal;

  /* ---------------- destinations ---------------- */
  var STATIONS = [
    { id: 'core', name: 'Fyrus Core Plaza', x: 0, z: 30, note: 'Parliament, Central Bank, Citizen Center' },
    { id: 'market', name: 'Market Street', x: 170, z: -40, note: 'Shops, brands and the escrow market' },
    { id: 'tech', name: 'Tech City', x: -262, z: -30, note: 'AI agents, startups and labs' },
    { id: 'creator', name: 'Creator City', x: -200, z: 200, note: 'Studios, galleries and news channels' },
    { id: 'edu', name: 'Education Campus', x: -120, z: -196, note: 'Schools, college and the university' },
    { id: 'faith', name: 'Faith & Culture', x: 0, z: 256, note: 'Every faith, side by side' },
    { id: 'marina', name: 'Marina Skyline', x: 0, z: -258, note: 'Sea views and the marina towers' },
    { id: 'joyland', name: 'Fyrus Joyland', x: 130, z: -288, note: 'Rides, arcades and the night fair' },
    { id: 'airport', name: 'Fyrus International Airport', x: 378, z: 0, note: 'Flights to the provinces' },
    { id: 'commons', name: 'Starter Commons', x: 318, z: 250, note: 'Free studios for new citizens' }
  ];
  API.stations = STATIONS;
  var FLIGHTS = [
    { id: 'vector-bay', name: 'Vector Bay', province: 'The Azure Coast', house: 'House Maren', url: '/vector-bay.html', open: true, note: 'Marble promenade, marina, gilded towers and the old citadel.' }
  ];
  API.flights = FLIGHTS;
  function moreCities() {
    var out = [], seen = {};
    FLIGHTS.forEach(function (f) { seen[f.province] = 1; });
    var W = window.__fyrusWorld, P = (W && W.provinces) || [];
    P.forEach(function (p) { if (p.id === 'corona' || seen[p.name]) return; out.push({ name: p.seat || p.name, province: p.name, house: p.house }); });
    return out;
  }

  /* ---------------- travel actions ---------------- */
  function teleportTo(st, how) {
    var W = window.__fyrusW;
    if (!W || !W.teleport) { toast('Enter the city first.'); return; }
    var ov = el('div', { 'class': 'fxc-fly', style: 'background:linear-gradient(180deg,#0a0f1a,#111a2b)' }, [
      el('div', { 'class': 'fxc-pass' }, [
        el('div', { 'class': 'lab' }, [how === 'bus' ? 'Fyrus City Bus' : 'Skyline Rail']),
        el('div', { 'class': 'r', style: 'margin-top:8px' }, [el('div', { 'class': 'city', style: 'font-size:40px' }, [st.name]), el('div', { 'class': 'lab' }, [how === 'bus' ? 'Next stop' : 'Now arriving'])]),
        el('div', { 'class': 'bar' }, [el('i')])
      ])
    ]);
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.querySelector('.bar i').style.transition = 'width 1.4s linear'; ov.querySelector('.bar i').style.width = '100%'; });
    setTimeout(function () { try { W.teleport({ x: st.x, z: st.z }); } catch (e) {} }, 900);
    setTimeout(function () { ov.style.transition = 'opacity .5s'; ov.style.opacity = '0'; setTimeout(function () { ov.remove(); }, 520); }, 1500);
    var log = LS.get('trips', 0) + 1; LS.set('trips', log);
  }
  API.teleportTo = teleportTo;

  function fly(f) {
    var s = S(), name = (s && s.session && (s.session.name || s.session.displayName)) || 'Citizen';
    var ov = el('div', { 'class': 'fxc-fly' });
    for (var i = 0; i < 9; i++) {
      var c = el('div', { 'class': 'cl' }); var w = 160 + Math.random() * 260;
      c.style.cssText += ';width:' + w + 'px;height:' + (w * 0.4) + 'px;top:' + (10 + Math.random() * 70) + '%;left:' + (Math.random() * 100) + '%;transition:transform 3s linear';
      ov.appendChild(c);
    }
    var pass = el('div', { 'class': 'fxc-pass' }, [
      el('div', { 'class': 'r' }, [el('div', { 'class': 'lab' }, ['Fyrus Airlines · FY 2040']), el('div', { 'class': 'lab' }, ['Boarding pass'])]),
      el('div', { 'class': 'r', style: 'margin-top:14px' }, [
        el('div', null, [el('div', { 'class': 'lab' }, ['From']), el('div', { 'class': 'city' }, ['FYR'])]),
        el('div', { style: 'font-size:26px;color:' + GOLD_HI }, ['✈']),
        el('div', { style: 'text-align:right' }, [el('div', { 'class': 'lab' }, ['To']), el('div', { 'class': 'city' }, [f.name.toUpperCase()])])
      ]),
      el('div', { 'class': 'r', style: 'margin-top:12px;color:' + MUTED + ';font-size:12.5px' }, [el('span', null, ['Passenger: ' + name]), el('span', null, [f.province])]),
      el('div', { 'class': 'bar' }, [el('i')])
    ]);
    ov.appendChild(pass); document.body.appendChild(ov);
    requestAnimationFrame(function () { pass.querySelector('.bar i').style.width = '100%'; [].forEach.call(ov.querySelectorAll('.cl'), function (c) { c.style.transform = 'translateX(-60vw)'; }); });
    LS.set('lastFlight', { to: f.id, at: Date.now() });
    setTimeout(function () { location.href = f.url; }, 2800);
  }
  API.fly = fly;

  /* ---------------- Transit desk ---------------- */
  API.openTransit = function (tab) {
    tab = tab || 'fly';
    modal(function (card, close) {
      var body = el('div');
      var tabs = el('div', { 'class': 'fxc-tabs', role: 'tablist' });
      var defs = [['fly', '✈ Flights'], ['rail', '🚆 Skyline Rail'], ['bus', '🚌 Bus Adda']];
      function render() {
        body.innerHTML = '';
        [].forEach.call(tabs.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-t') === tab)); });
        var list = el('div', { 'class': 'fxc-list' });
        if (tab === 'fly') {
          FLIGHTS.forEach(function (f) {
            list.appendChild(el('div', { 'class': 'fxc-row' }, [
              el('div', { 'class': 'ic' }, ['🌅']),
              el('div', null, [el('span', { 'class': 'tag' }, [f.province + ' · ' + f.house]), el('b', null, [f.name]), el('small', null, [f.note])]),
              el('button', { 'class': 'fxc-btn gold', onclick: function () { close(); fly(f); } }, ['Fly now · free'])
            ]));
          });
          moreCities().forEach(function (c) {
            list.appendChild(el('div', { 'class': 'fxc-row' }, [
              el('div', { 'class': 'ic' }, ['🏛']),
              el('div', null, [el('span', { 'class': 'tag' }, [c.province + (c.house ? ' · ' + c.house : '')]), el('b', null, [c.name]), el('small', null, ['City scene under construction. Its district is open in Fyrus Core today.'])]),
              el('button', { 'class': 'fxc-btn', disabled: 'disabled' }, ['Opening soon'])
            ]));
          });
        } else {
          STATIONS.forEach(function (stn) {
            list.appendChild(el('div', { 'class': 'fxc-row' }, [
              el('div', { 'class': 'ic' }, [tab === 'bus' ? '🚌' : '🚆']),
              el('div', null, [el('b', null, [stn.name]), el('small', null, [stn.note])]),
              el('button', { 'class': 'fxc-btn', onclick: function () { close(); teleportTo(stn, tab); } }, [tab === 'bus' ? 'Ride' : 'Go'])
            ]));
          });
        }
        body.appendChild(list);
      }
      defs.forEach(function (d) { tabs.appendChild(el('button', { 'data-t': d[0], role: 'tab', onclick: function () { tab = d[0]; render(); } }, [d[1]])); });
      card.appendChild(el('div', { 'class': 'fxc-k' }, ['Fyrus Transit · Grand Central']));
      card.appendChild(el('h2', { 'class': 'fxc-h' }, ['Where to, citizen?']));
      card.appendChild(el('p', { 'class': 'fxc-p' }, ['Flights to the provinces, the Skyline Rail loop and the city buses. Every ride is free for citizens.']));
      card.appendChild(tabs); card.appendChild(body);
      card.appendChild(el('div', { 'class': 'fxc-foot' }, [el('span', { style: 'color:' + MUTED + ';font-size:12px' }, ['Trips taken: ' + LS.get('trips', 0)]), el('button', { 'class': 'fxc-btn', onclick: close }, ['Close'])]));
      render();
    });
  };

  /* ---------------- dock button ---------------- */
  function addDock() {
    var dock = document.querySelector('.fxp-dock'); if (!dock || dock.querySelector('[data-fxc-transit]')) return;
    var b = el('button', { 'aria-label': 'Fyrus Transit', 'data-fxc-transit': '1', onclick: function () { API.openTransit('fly'); } }, ['🧭', el('span', null, ['Transit · flights, rail, bus'])]);
    dock.appendChild(b);
  }

  /* ---------------- world: Grand Central, Skyline Rail, buses ---------------- */
  var built = null, trains = [], buses = [], loopR = 214, railY = 13;
  function free(W, x, z, r) {
    for (var k = 0; k < W.colliders.length; k++) { var c = W.colliders[k]; if (c.x != null && Math.hypot(c.x - x, c.z - z) < (c.r || 3) + r) return false; }
    return true;
  }
  function label(T, text, color) {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 160; var g = c.getContext('2d');
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 96px "Bebas Neue", Sora, sans-serif'; g.fillStyle = color || GOLD_HI; g.shadowColor = 'rgba(201,169,110,.8)'; g.shadowBlur = 18; g.fillText(text, 512, 84);
    var t = new T.CanvasTexture(c); var s = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.scale.set(18, 2.8, 1); return s;
  }
  function trainMesh(T, cars) {
    var g = new T.Group();
    var body = new T.MeshStandardMaterial({ color: 0xf2efe8, metalness: .35, roughness: .3 });
    var glass = new T.MeshStandardMaterial({ color: 0x0b1220, emissive: 0xffd49a, emissiveIntensity: .9, metalness: .6, roughness: .15 });
    var gold = new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: 1, roughness: .3 });
    for (var i = 0; i < cars; i++) {
      var car = new T.Group(); car.userData.idx = i;
      var b = new T.Mesh(new T.BoxGeometry(3.0, 3.0, 13), body); b.position.y = 1.5; car.add(b);
      var w = new T.Mesh(new T.BoxGeometry(3.06, 1.0, 11.4), glass); w.position.y = 2.0; car.add(w);
      var s = new T.Mesh(new T.BoxGeometry(3.08, .14, 13), gold); s.position.y = 1.2; car.add(s);
      if (i === 0) { var nose = new T.Mesh(new T.SphereGeometry(1.5, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), body); nose.rotation.x = Math.PI / 2; nose.scale.set(1, 1.6, 1); nose.position.set(0, 1.5, 6.5); car.add(nose); }
      g.add(car);
    }
    return g;
  }
  function busMesh(T) {
    var g = new T.Group();
    var body = new T.Mesh(new T.BoxGeometry(2.6, 3.0, 11), new T.MeshStandardMaterial({ color: 0x1b2a4a, metalness: .3, roughness: .35 })); body.position.y = 1.9; g.add(body);
    var win = new T.Mesh(new T.BoxGeometry(2.64, 1.0, 9.6), new T.MeshStandardMaterial({ color: 0x0a0f1a, emissive: 0xffd49a, emissiveIntensity: .7 })); win.position.y = 2.5; g.add(win);
    var band = new T.Mesh(new T.BoxGeometry(2.66, .2, 11), new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: 1, roughness: .3 })); band.position.y = 1.5; g.add(band);
    var wm = new T.MeshStandardMaterial({ color: 0x111111, roughness: .8 });
    [[-1.2, 3.6], [1.2, 3.6], [-1.2, -3.6], [1.2, -3.6]].forEach(function (p) { var w = new T.Mesh(new T.CylinderGeometry(.55, .55, .4, 14), wm); w.rotation.z = Math.PI / 2; w.position.set(p[0], .55, p[1]); g.add(w); });
    return g;
  }
  function buildWorld() {
    var W = window.__fyrusW, T = window.THREE; if (!W || !W.world || !T || built === W) return;
    built = W; trains = []; buses = [];
    var root = new T.Group(); root.name = 'fyrus-transit';
    /* Grand Central: find an open spot north-east of the plaza */
    var spot = null;
    for (var r = 60; r <= 140 && !spot; r += 8) for (var a = 0; a < 20 && !spot; a++) {
      var ang = -0.4 + a / 20 * Math.PI * 2, x = Math.cos(ang) * r, z = Math.sin(ang) * r;
      if (free(W, x, z, 16)) spot = { x: x, z: z };
    }
    if (spot) {
      var gc = new T.Group(); gc.position.set(spot.x, 0, spot.z); gc.rotation.y = Math.atan2(-spot.x, -spot.z);
      var stone = new T.MeshStandardMaterial({ color: 0xe9dfcf, roughness: .55 }), gold = new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: 1, roughness: .28 });
      var glass = new T.MeshStandardMaterial({ color: 0x0d1626, emissive: 0xffc98a, emissiveIntensity: .8, metalness: .6, roughness: .12 });
      var base = new T.Mesh(new T.BoxGeometry(22, 1, 14), stone); base.position.y = .5; gc.add(base);
      var hall = new T.Mesh(new T.BoxGeometry(18, 8, 10), glass); hall.position.y = 5; gc.add(hall);
      var vault = new T.Mesh(new T.CylinderGeometry(7, 7, 18, 32, 1, false, 0, Math.PI), stone); vault.rotation.z = Math.PI / 2; vault.position.y = 9; vault.scale.set(1, 1, .75); gc.add(vault);
      [-9, -3, 3, 9].forEach(function (px) { var c = new T.Mesh(new T.BoxGeometry(.8, 9, .8), gold); c.position.set(px, 5, 5.2); gc.add(c); });
      var lbl = label(T, 'GRAND CENTRAL'); lbl.position.set(0, 18, 0); gc.add(lbl);
      root.add(gc);
      W.colliders.push({ x: spot.x, z: spot.z, r: 8 });
      W.staticInteracts.push({ pos: new T.Vector3(spot.x, 0, spot.z), radius: 13, label: 'Fyrus Transit · flights, rail and buses', action: 'transit', use: function () { API.openTransit('fly'); } });
      API.grandCentral = spot;
    }
    /* Skyline Rail: an elevated loop with pylons where the ground is free */
    var pyl = new T.MeshStandardMaterial({ color: 0xd9cfbe, roughness: .5 }), beamM = new T.MeshStandardMaterial({ color: 0xece4d6, roughness: .45 }), glowM = new T.MeshBasicMaterial({ color: 0xffd9a0 });
    var beam = new T.Mesh(new T.TorusGeometry(loopR, 0.9, 6, 220), beamM); beam.rotation.x = Math.PI / 2; beam.position.y = railY - 0.9; root.add(beam);
    var lip = new T.Mesh(new T.TorusGeometry(loopR, 0.12, 4, 220), glowM); lip.rotation.x = Math.PI / 2; lip.position.y = railY - 1.9; root.add(lip);
    for (var i = 0; i < 64; i++) {
      var aa = i / 64 * Math.PI * 2, px2 = Math.cos(aa) * loopR, pz2 = Math.sin(aa) * loopR;
      if (!free(W, px2, pz2, 2.5)) continue;
      var p = new T.Mesh(new T.CylinderGeometry(.7, 1.0, railY - 1.8, 10), pyl); p.position.set(px2, (railY - 1.8) / 2, pz2); root.add(p);
      W.colliders.push({ x: px2, z: pz2, r: 1.1 });
    }
    for (var t = 0; t < 2; t++) { var tr = trainMesh(T, 4); root.add(tr); trains.push({ g: tr, a: t * Math.PI, dir: t ? -1 : 1, speed: 0.045 }); }
    for (var b = 0; b < 4; b++) { var bus = busMesh(T); root.add(bus); buses.push({ g: bus, a: b / 4 * Math.PI * 2, speed: 0.06 + b * 0.004, r: 172 + (b % 2) * 6 }); }
    W.world.add(root);
  }
  var last = performance.now();
  function tick(now) {
    var dt = Math.min(.1, Math.max(0, (now - last) / 1000)); last = Math.max(last, now);
    trains.forEach(function (t) {
      t.a += t.dir * t.speed * dt;
      t.g.children.forEach(function (car) {
        var a = t.a - t.dir * car.userData.idx * (13.6 / loopR);
        car.position.set(Math.cos(a) * loopR, railY, Math.sin(a) * loopR);
        car.rotation.y = -a + (t.dir > 0 ? 0 : Math.PI);
      });
    });
    buses.forEach(function (b) {
      b.a += b.speed * dt * 0.35;
      b.g.position.set(Math.cos(b.a) * b.r, 0, Math.sin(b.a) * b.r);
      b.g.rotation.y = -b.a;
    });
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  setInterval(function () { try { addDock(); buildWorld(); } catch (e) { if (window.console) console.warn('[fyrus-country]', e); } }, 1000);
})();
