/* Fyrus — Country layer (v1.0): Fyrus Transit
   Grand Central station, the Bus Adda and city buses in the world,
   plus the Transit desk (flights, train, bus) that links Fyrus Core with Vector Bay on the Azure Coast.
   Additive only: does not change any existing feature. Uses window.__fyrus (state) and window.__fyrusW (world). */
(function () {
  'use strict';
  if (window.__fyrusCountry) return;
  var API = window.__fyrusCountry = { version: '1.4.0' };
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
    { id: 'vector-bay', name: 'Vector Bay', province: 'The Azure Coast', house: 'House Maren', open: true, note: 'Across the bay: marble promenade, marina, gilded towers and the old citadel. Same world, your own avatar.' },
    { id: 'core', name: 'Fyrus Core', province: 'The Capital', house: 'Parliament of Fyrus', open: true, home: true, note: 'Fly home to the capital.' }
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
  /* a small gold-and-ivory sky pod used for in-city rides */
  var pod = null;
  function podMesh(T, kind) {
    var g = new T.Group();
    var body = new T.Mesh(new T.CapsuleGeometry ? new T.CapsuleGeometry(1.3, 4.2, 6, 16) : new T.CylinderGeometry(1.3, 1.3, 6, 16), new T.MeshStandardMaterial({ color: kind === 'bus' ? 0x1b2a4a : 0xf2efe8, metalness: .35, roughness: .3 }));
    body.rotation.x = Math.PI / 2; g.add(body);
    var win = new T.Mesh(new T.BoxGeometry(2.7, .7, 4.2), new T.MeshStandardMaterial({ color: 0x0a0f1a, emissive: 0xffd49a, emissiveIntensity: .9 })); win.position.y = .45; g.add(win);
    var band = new T.Mesh(new T.TorusGeometry(1.32, .08, 6, 24), new T.MeshStandardMaterial({ color: 0xc9a96e, metalness: 1, roughness: .3 })); g.add(band);
    var glow = new T.Mesh(new T.CircleGeometry(1.1, 20), new T.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: .8 })); glow.rotation.x = Math.PI / 2; glow.position.y = -1.4; g.add(glow);
    return g;
  }
  /* camera fly-through along a spline (uses the city's own trip system, so controls and HUD behave) */
  function flyThrough(dest, how, onEnd) {
    var W = window.__fyrusW, T = window.THREE;
    if (!W || !T || !W.beginTrip || W.trip || W.vehicle || !W.player) return false;
    var a = W.player.root.position.clone(), b = new T.Vector3(dest.x, 0, dest.z);
    var dist = a.distanceTo(b), alt = how === 'flight' ? 170 : how === 'bus' ? 26 : 34;
    var mid = a.clone().lerp(b, .5); mid.y = alt + Math.min(60, dist * .08);
    var curve = new T.CatmullRomCurve3([a.clone().setY(2), a.clone().lerp(mid, .35).setY(alt * .8), mid, b.clone().lerp(mid, .3).setY(alt * .7), b.clone().setY(3)], false, 'centripetal');
    var dur = how === 'flight' ? 4.2 : Math.max(3, Math.min(8, dist / 70));
    var obj = podMesh(T, how);
    try {
      W.beginTrip('transit', (how === 'bus' ? 'City bus' : how === 'flight' ? 'Fyrus Airlines' : 'Metro') + ' · ' + dest.name, dur, function (t) {
        var u = Math.max(0, Math.min(.999, t / dur)); u = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        var p = curve.getPointAt(u), q = curve.getPointAt(Math.min(.999, u + .02));
        obj.position.copy(p); obj.lookAt(q);
        var back = p.clone().sub(q).setY(0).normalize().multiplyScalar(18);
        return { pos: p.clone().add(back).add(new T.Vector3(0, 6, 0)), look: q.clone().add(new T.Vector3(0, 1, 0)), body: p.clone().setY(Math.max(0, p.y - 1.5)) };
      }, function () { try { if (onEnd) onEnd(); } catch (e) {} }, obj);
      return true;
    } catch (e) { return false; }
  }
  API.flyThrough = flyThrough;
  function teleportTo(st, how) {
    var W = window.__fyrusW;
    if (!W || !W.teleport) { toast('Enter the city first.'); return; }
    if (how !== 'instant' && flyThrough(st, how === 'bus' ? 'bus' : 'metro', function () { try { W.teleport({ x: st.x, z: st.z }); } catch (e) {} })) { LS.set('trips', LS.get('trips', 0) + 1); return; }
    var ov = el('div', { 'class': 'fxc-fly', style: 'background:linear-gradient(180deg,#0a0f1a,#111a2b)' }, [
      el('div', { 'class': 'fxc-pass' }, [
        el('div', { 'class': 'lab' }, [how === 'bus' ? 'Fyrus City Bus' : 'Fyrus Metro']),
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
    if (f.id === 'vector-bay' && window.__fyrusVB) { window.__fyrusVB.go(); return; }
    if (f.home) { var Wh = window.__fyrusW; if (!flyThrough({ name: f.name, x: 0, z: 36 }, 'flight', function () { try { Wh.teleport({ x: 0, z: 36 }); } catch (e) {} })) { try { Wh.teleport({ x: 0, z: 36 }); } catch (e) {} } return; }
    if (!f.__lifted && flyThrough({ name: f.name, x: 120, z: -700 }, 'flight', function () { f.__lifted = true; fly(f); })) return;
    f.__lifted = false;
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
    setTimeout(function () { location.href = f.url || ('/?go=' + f.id); }, 2800);
  }
  API.fly = fly;

  /* ---------------- Transit desk ---------------- */
  API.openTransit = function (tab) {
    tab = tab || 'fly';
    modal(function (card, close) {
      var body = el('div');
      var tabs = el('div', { 'class': 'fxc-tabs', role: 'tablist' });
      var defs = [['fly', '✈ Flights'], ['rail', '🚇 Metro'], ['bus', '🚌 Bus Adda']];
      function render() {
        body.innerHTML = '';
        [].forEach.call(tabs.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-t') === tab)); });
        var list = el('div', { 'class': 'fxc-list' });
        if (tab === 'fly') {
          var inVB = !!(window.__fyrusVB && window.__fyrusVB.inside());
          FLIGHTS.forEach(function (f) {
            if (f.home ? !inVB : (f.id === 'vector-bay' && inVB)) return;
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
              el('div', { 'class': 'ic' }, [tab === 'bus' ? '🚌' : '🚇']),
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
      card.appendChild(el('p', { 'class': 'fxc-p' }, ['Flights to the provinces, the Metro and the city buses. Every ride is free for citizens.']));
      card.appendChild(tabs); card.appendChild(body);
      card.appendChild(el('div', { 'class': 'fxc-foot' }, [el('span', { style: 'color:' + MUTED + ';font-size:12px' }, ['Trips taken: ' + LS.get('trips', 0)]), el('button', { 'class': 'fxc-btn', onclick: close }, ['Close'])]));
      render();
    });
  };


  /* =====================================================================
     v1.1 — The Country: Grand Central & Bus Adda, Fyrus Guard parade ground,
     Peace Office, Sunset Amphitheater, Family Park (kids safe zone),
     Today in Fyrus, friend finder, education ladder, publish & rent desk.
     ===================================================================== */
  var RES = []; /* lots this layer keeps free of procedural homes */
  var SITES = {};
  API.sites = SITES;
  function reserveHook(W) {
    if (W.__fxcReserved) return;
    var orig = W.blocked.bind(W);
    W.blocked = function (st) { return RES.concat(orig(st)); };
    W.__fxcReserved = true;
  }
  function refreshChunks(W) { if (W.sigs) W.sigs.blocked = ''; W.lastChunk = ''; }
  function pickSite(W, rad, rMin, rMax, a0) {
    var st = S(), blocked = [];
    try { blocked = W.blocked(st) || []; } catch (e) { blocked = []; }
    for (var r = rMin; r <= rMax; r += 12) for (var k = 0; k < 48; k++) {
      var ang = (a0 || 0) + k / 48 * Math.PI * 2, x = Math.round(Math.cos(ang) * r), z = Math.round(Math.sin(ang) * r);
      if (Math.abs(Math.hypot(x, z) - 175) < rad + 10) continue;
      if (Math.abs(x) > 500 - rad || Math.abs(z) > 500 - rad || z < -330) continue;
      var ok = blocked.every(function (b) { return b.x == null || Math.hypot(b.x - x, b.z - z) > (b.r || 4) + rad + 4; });
      if (ok) return { x: x, z: z };
    }
    return null;
  }
  function claim(W, key, rad, rMin, rMax, a0) {
    var saved = LS.get('site.' + key, null), p = saved;
    if (p) {
      var st = S(), bl = []; try { bl = W.blocked(st) || []; } catch (e) {}
      var clash = bl.some(function (b) { return b.x != null && RES.indexOf(b) < 0 && Math.hypot(b.x - p.x, b.z - p.z) < (b.r || 4) + rad; });
      if (clash) p = null;
    }
    if (!p) p = pickSite(W, rad, rMin, rMax, a0);
    if (!p) return null;
    LS.set('site.' + key, p);
    RES.push({ x: p.x, z: p.z, r: rad });
    SITES[key] = { x: p.x, z: p.z, r: rad };
    return p;
  }
  function M(T, c, o) { o = o || {}; o.color = c; if (o.metal) { o.metalness = o.metal; delete o.metal; } return new T.MeshStandardMaterial(o); }
  function box(T, g, mat, w, h, d, x, y, z, ry) { var m = new T.Mesh(new T.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); if (ry) m.rotation.y = ry; m.castShadow = true; m.receiveShadow = true; g.add(m); return m; }
  function cyl(T, g, mat, rt, rb, h, x, y, z, seg) { var m = new T.Mesh(new T.CylinderGeometry(rt, rb, h, seg || 16), mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m; }
  function face(g, p) { g.rotation.y = Math.atan2(-p.x, -p.z); }
  /* a simple citizen-sized figure; parts: body, head, legL, legR, armL, armR */
  function figure(T, opt) {
    var AV = window.__fyrusAvatarClass;
    if (AV) try {
      var hx = function (n, d) { return n == null ? d : typeof n === 'string' ? n : '#' + ('000000' + n.toString(16)).slice(-6); };
      var of = { gender: opt.gender || 'm', hair: opt.hair || (opt.hat ? 'buzz' : 'short'), hairColor: opt.hairColor || '#1a1410', skin: hx(opt.skin, '#d6a77e'), top: hx(opt.cloth, '#1b2a4a'), bottom: hx(opt.legs, '#0a0f1a'), shoes: opt.hat === 'shako' ? '#0a0a0a' : '#1a1a1a', topStyle: opt.top || 'jacket', bottomStyle: 'trousers' };
      var av = new AV('', '#ffffff', '', false, { acc: 'none', trail: 'none', board: 'classic', outfit: of }, of);
      av.label.visible = false; av.ring.visible = false;
      var g2 = av.root, trim2 = M(T, 0xc9a96e, { metal: 1, roughness: .3 });
      if (opt.hat === 'shako') { cyl(T, av.head, M(T, 0x0a0f1a), .12, .115, .28, 0, .2, 0, 14); cyl(T, av.head, trim2, .125, .125, .04, 0, .08, 0, 14); cyl(T, av.head, trim2, .02, .02, .08, 0, .37, .0, 6); }
      if (opt.hat === 'cap') { cyl(T, av.head, M(T, 0x1b2a4a), .14, .135, .08, 0, .12, 0, 14); }
      if (opt.prop === 'guitar') { var gb = box(T, g2, M(T, 0x8a4b22, { roughness: .4 }), .34, .46, .1, .05, 1.1, .2); gb.rotation.z = .5; }
      if (opt.prop === 'mic') { cyl(T, g2, M(T, 0x111111, { metal: .6 }), .02, .02, 1.4, 0, .7, .45, 6); }
      g2.userData = { legs: av.legs, arms: av.arms, knees: av.knees, phase: Math.random() * 6, av: av };
      return g2;
    } catch (e) {}
    var g = new T.Group(), cloth = M(T, opt.cloth || 0x1b2a4a, { roughness: .6 }), skin = M(T, opt.skin || 0xd6a77e, { roughness: .6 }), trim = M(T, 0xc9a96e, { metal: 1, roughness: .3 });
    var body = cyl(T, g, cloth, .22, .26, .8, 0, 1.25, 0, 10); var head = new T.Mesh(new T.SphereGeometry(.15, 12, 10), skin); head.position.y = 1.82; g.add(head);
    var legs = [], arms = [];
    [-1, 1].forEach(function (s) {
      var lp = new T.Group(); lp.position.set(s * .11, .86, 0); var l = cyl(T, lp, M(T, opt.legs || 0x0a0f1a), .07, .07, .84, 0, -.42, 0, 8); g.add(lp); legs.push(lp);
      var ap = new T.Group(); ap.position.set(s * .3, 1.58, 0); cyl(T, ap, cloth, .055, .055, .62, 0, -.31, 0, 8); g.add(ap); arms.push(ap);
    });
    var belt = cyl(T, g, trim, .265, .265, .07, 0, .9, 0, 12);
    if (opt.hat === 'shako') { cyl(T, g, M(T, 0x0a0f1a), .14, .13, .32, 0, 2.06, 0, 12); cyl(T, g, trim, .145, .145, .05, 0, 1.95, 0, 12); }
    if (opt.hat === 'cap') { cyl(T, g, M(T, 0x1b2a4a), .17, .15, .1, 0, 1.97, 0, 12); }
    if (opt.prop === 'guitar') { var gb = box(T, g, M(T, 0x8a4b22, { roughness: .4 }), .38, .5, .1, .05, 1.15, .22); gb.rotation.z = .5; }
    if (opt.prop === 'mic') { cyl(T, g, M(T, 0x111111, { metal: .6 }), .02, .02, 1.4, 0, .7, .45, 6); }
    g.userData = { legs: legs, arms: arms, phase: Math.random() * 6 };
    return g;
  }
  function walkPose(f, t, amp) { var u = f.userData, s = Math.sin(t) * amp; u.legs[0].rotation.x = s; u.legs[1].rotation.x = -s; u.arms[0].rotation.x = -s * .8; u.arms[1].rotation.x = s * .8; if (u.knees) { u.knees[0].rotation.x = .05 + Math.max(0, -s) * 1.2; u.knees[1].rotation.x = .05 + Math.max(0, s) * 1.2; } }
  function screen(T, w, h) {
    var c = document.createElement('canvas'); c.width = 1024; c.height = Math.round(1024 * h / w);
    var tex = new T.CanvasTexture(c); var mat = new T.MeshBasicMaterial({ map: tex });
    var mesh = new T.Mesh(new T.PlaneGeometry(w, h), mat);
    mesh.userData.draw = function (lines, accent) {
      var g = c.getContext('2d'); var gr = g.createLinearGradient(0, 0, 0, c.height); gr.addColorStop(0, '#111a2b'); gr.addColorStop(1, '#0a0f1a'); g.fillStyle = gr; g.fillRect(0, 0, c.width, c.height);
      g.strokeStyle = '#c9a96e'; g.lineWidth = 6; g.strokeRect(14, 14, c.width - 28, c.height - 28);
      g.textAlign = 'center'; g.fillStyle = accent || '#e8d5a8'; g.font = '500 34px "JetBrains Mono", monospace'; g.fillText(lines[0] || '', c.width / 2, c.height * .26);
      g.fillStyle = '#f4efe6'; g.font = '400 ' + Math.round(c.height * .26) + 'px "Bebas Neue", Sora, sans-serif'; g.fillText(lines[1] || '', c.width / 2, c.height * .6);
      g.fillStyle = '#9aa3b2'; g.font = '600 30px Sora, sans-serif'; g.fillText(lines[2] || '', c.width / 2, c.height * .84);
      tex.needsUpdate = true;
    };
    return mesh;
  }

  /* ---------------- Today in Fyrus: the daily programme ---------------- */
  var PROGRAMME = [
    { h: 9, site: 'parade', kind: 'guard', title: 'Morning Parade', desc: 'The Fyrus Guard raises the provincial flags.' },
    { h: 11, site: 'park', kind: 'family', title: 'Storytime & Games', desc: 'Stories, races and the carousel in Family Park.' },
    { h: 13, site: 'amph', kind: 'stage', title: 'Open Mic: Poetry', desc: 'Read your poem or just listen.' },
    { h: 16, site: 'market', kind: 'meet', title: 'Market Hour', desc: 'Sellers and buyers meet on Market Street.' },
    { h: 18, site: 'parade', kind: 'guard', title: 'Changing of the Guard', desc: 'The evening ceremony at the parade ground.' },
    { h: 20, site: 'amph', kind: 'concert', title: 'Sunset Concert', desc: 'The Fyrus Ensemble (AI performers) plays live music.' },
    { h: 22, site: 'amph', kind: 'concert', title: 'Night Set', desc: 'Late music under the stage lights.' }
  ];
  API.programme = PROGRAMME;
  function eventStatus(ev, now) {
    now = now || new Date();
    var start = new Date(now); start.setHours(ev.h, 0, 0, 0);
    var end = new Date(start.getTime() + 60 * 60000);
    if (now >= start && now < end) return { live: true, mins: Math.round((end - now) / 60000) };
    if (now < start) return { live: false, mins: Math.round((start - now) / 60000) };
    var t = new Date(start.getTime() + 24 * 3600000); return { live: false, mins: Math.round((t - now) / 60000), tomorrow: true };
  }
  function liveAt(site) { var n = new Date(); for (var i = 0; i < PROGRAMME.length; i++) if (PROGRAMME[i].site === site && eventStatus(PROGRAMME[i], n).live) return PROGRAMME[i]; return null; }
  function nextAt(site) { var n = new Date(), best = null, bm = 1e9; PROGRAMME.forEach(function (e) { if (e.site !== site) return; var s = eventStatus(e, n); if (!s.live && s.mins < bm) { bm = s.mins; best = e; } }); return best; }
  function fmtMins(m) { if (m < 60) return m + ' min'; var h = Math.floor(m / 60); return h + 'h ' + (m % 60) + 'm'; }
  function siteXZ(key) {
    if (key === 'market') return { x: 170, z: -40 };
    var s = SITES[key]; if (!s) return null;
    var L = Math.hypot(s.x, s.z) || 1, k = s.r + 3;
    return { x: s.x - s.x / L * k, z: s.z - s.z / L * k };
  }
  function goSite(key, name) {
    var p = siteXZ(key); if (!p) { toast('This place is still being built. Try again in a moment.'); return; }
    teleportTo({ name: name || 'Destination', x: p.x, z: p.z }, 'rail');
  }
  API.goSite = goSite;

  /* ---------------- Fyrus Guard & Peace Service (ceremonial ranks) ---------------- */
  var RANKS = [['Recruit', 0], ['Cadet', 40], ['Sentinel', 120], ['Lieutenant', 260], ['Captain', 450], ['Marshal', 800]];
  function duty() { return LS.get('duty', { pts: 0, track: 'guard', checkin: '', patrol: null, patrolDone: '', ceremonies: [] }); }
  function saveDuty(d) { LS.set('duty', d); }
  function rankOf(p) { var r = RANKS[0]; RANKS.forEach(function (x) { if (p >= x[1]) r = x; }); return r; }
  function nextRank(p) { for (var i = 0; i < RANKS.length; i++) if (RANKS[i][1] > p) return RANKS[i]; return null; }
  function award(n, why) {
    var d = duty(), before = rankOf(d.pts)[0]; d.pts += n; saveDuty(d);
    var after = rankOf(d.pts)[0];
    toast('+' + n + ' duty · ' + why + (after !== before ? ' · Promoted to ' + after + '!' : ''));
    if (after !== before) ceremonyBanner(after, d.track);
  }
  function ceremonyBanner(rank, track) {
    var ov = el('div', { 'class': 'fxc-fly', style: 'background:radial-gradient(ellipse at center,rgba(17,26,43,.92),rgba(5,8,15,.96))' }, [
      el('div', { style: 'text-align:center;padding:16px' }, [
        el('div', { 'class': 'fxc-k' }, [track === 'peace' ? 'Peace Service of Fyrus' : 'The Fyrus Guard']),
        el('div', { 'class': 'fxc-h', style: 'font-size:clamp(56px,10vw,104px);background:linear-gradient(180deg,#fbf1d6,#c9a96e);-webkit-background-clip:text;background-clip:text;color:transparent' }, [rank.toUpperCase()]),
        el('p', { 'class': 'fxc-p', style: 'margin:0 auto' }, ['Promoted for faithful service. Ranks are ceremonial: they carry honour, never power over other citizens.'])
      ])
    ]);
    document.body.appendChild(ov); ov.onclick = function () { ov.remove(); }; setTimeout(function () { ov.remove(); }, 3800);
  }
  function startPatrol() {
    var d = duty(), today = new Date().toDateString();
    if (d.patrolDone === today) { toast('Patrol done for today. Come back tomorrow.'); return; }
    var pool = STATIONS.filter(function (s) { return s.id !== 'airport'; }).slice();
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    d.patrol = { pts: pool.slice(0, 3).map(function (s) { return { name: s.name, x: s.x, z: s.z, done: false }; }), at: Date.now() };
    saveDuty(d); toast('Patrol started: visit ' + d.patrol.pts.map(function (p) { return p.name; }).join(', ') + '. Gold beacons mark the way.');
  }

  /* ---------------- Kids mode (Family Park safe zone) ---------------- */
  function kidsOn() { return !!LS.get('kids', null); }
  function applyKids() {
    var on = kidsOn(); document.body.classList.toggle('fxc-kids', on);
    var inp = document.querySelector('input[placeholder^="Say something"]');
    if (inp) { var row = inp.parentElement; if (row) row.style.display = on ? 'none' : ''; }
    var A = window.__fyrusArena;
    if (A && A.play && !A.__fxcWrapped) { var orig = A.play; A.play = function () { if (kidsOn()) { toast('Kids mode is on. The Battle Arena is closed.'); return; } return orig.apply(this, arguments); }; A.__fxcWrapped = true; }
  }
  API.kids = { on: kidsOn, apply: applyKids };
  var kidsCss = document.createElement('style');
  kidsCss.textContent = 'body.fxc-kids [data-fxa]{display:none!important}' +
    '.fxc-kidsbar{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:2147482500;background:rgba(69,179,138,.92);color:#06150f;font:700 11px Sora,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:7px 14px;border-radius:999px;display:none;pointer-events:none}' +
    'body.fxc-kids .fxc-kidsbar{display:block}';
  document.head.appendChild(kidsCss);
  var kidsBar = el('div', { 'class': 'fxc-kidsbar' }, ['Kids mode · safe zone']); document.body.appendChild(kidsBar);
  function kidsToggle(rerender) {
    if (!kidsOn()) {
      modal(function (card, close) {
        var pin = el('input', { type: 'password', inputmode: 'numeric', maxlength: '4', placeholder: '4-digit parent PIN', style: 'width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(201,169,110,.4);background:#0a0f1a;color:#fff;font:600 16px Sora,sans-serif;letter-spacing:.3em' });
        card.appendChild(el('div', { 'class': 'fxc-k' }, ['Family Park']));
        card.appendChild(el('h2', { 'class': 'fxc-h' }, ['Turn on Kids mode']));
        card.appendChild(el('p', { 'class': 'fxc-p' }, ['Kids mode hides chat with strangers and closes the Battle Arena on this device. A parent PIN is needed to turn it off. The PIN stays on this device only.']));
        card.appendChild(pin);
        card.appendChild(el('div', { 'class': 'fxc-foot' }, [el('button', { 'class': 'fxc-btn', onclick: close }, ['Cancel']), el('button', { 'class': 'fxc-btn gold', onclick: function () { if (!/^\d{4}$/.test(pin.value)) { toast('Choose a 4-digit PIN.'); return; } LS.set('kids', { pin: pin.value, at: Date.now() }); applyKids(); close(); toast('Kids mode is on.'); rerender && rerender(); } }, ['Turn on'])]));
        setTimeout(function () { pin.focus(); }, 50);
      });
    } else {
      modal(function (card, close) {
        var pin = el('input', { type: 'password', inputmode: 'numeric', maxlength: '4', placeholder: 'Parent PIN', style: 'width:100%;padding:12px 14px;border-radius:12px;border:1px solid rgba(201,169,110,.4);background:#0a0f1a;color:#fff;font:600 16px Sora,sans-serif;letter-spacing:.3em' });
        card.appendChild(el('div', { 'class': 'fxc-k' }, ['Family Park']));
        card.appendChild(el('h2', { 'class': 'fxc-h' }, ['Turn off Kids mode']));
        card.appendChild(pin);
        card.appendChild(el('div', { 'class': 'fxc-foot' }, [el('button', { 'class': 'fxc-btn', onclick: close }, ['Cancel']), el('button', { 'class': 'fxc-btn gold', onclick: function () { var k = LS.get('kids', null); if (!k || pin.value !== k.pin) { toast('That PIN is not right.'); return; } LS.set('kids', null); applyKids(); close(); toast('Kids mode is off.'); rerender && rerender(); } }, ['Turn off'])]));
        setTimeout(function () { pin.focus(); }, 50);
      });
    }
  }

  /* ---------------- Education ladder (courses live in Education City) ---------------- */
  var LADDER = [
    { step: 'School', inst: 'Fyrus Public School', courses: [['school-digital', 'Digital Citizen Basics'], ['school-money', 'Money and Saving'], ['school-english', 'Speak and Write Clearly']] },
    { step: 'College', inst: 'Fyrus College', courses: [['college-business', 'Business Foundations'], ['college-code', 'Coding Foundations'], ['college-design', 'Design Foundations']] },
    { step: 'University', inst: 'University of Fyrus', courses: [['uni-ai', 'Applied AI'], ['uni-venture', 'Entrepreneurship'], ['uni-trade', 'Global Trade and E-commerce']] }
  ];
  function certOf(courseId) {
    var s = S(); var m = s && s.eduMine; if (!m) return null;
    var lists = [m.certs, m.certificates, m.enrolled, m.enr, m.courses];
    for (var i = 0; i < lists.length; i++) { var L = lists[i]; if (!L) continue; var arr = Array.isArray(L) ? L : Object.keys(L).map(function (k) { return L[k]; });
      for (var j = 0; j < arr.length; j++) { var c = arr[j]; if (c && (c.course === courseId || c.id === courseId) && (c.code || c.cert)) return c.code || c.cert; } }
    return null;
  }
  function openCourse(id) { try { window.__fyrus.setState({ eduFocus: { tab: null, course: id }, hud: { open: true, tab: 'edu' } }); } catch (e) { toast('Open Learn & Work, then Education City.'); } }

  /* ---------------- Country hub ---------------- */
  API.openHub = function (tab) {
    tab = tab || 'today';
    modal(function (card, close) {
      var body = el('div'), tabs = el('div', { 'class': 'fxc-tabs', role: 'tablist' });
      var defs = [['today', 'Today'], ['friends', 'Friends'], ['guard', 'Guard & Peace'], ['learn', 'Learn'], ['civic', 'Publish & Rent'], ['family', 'Family']];
      function row(ic, tag, title, sub, btn) { return el('div', { 'class': 'fxc-row' }, [el('div', { 'class': 'ic' }, [ic]), el('div', null, [tag ? el('span', { 'class': 'tag' }, [tag]) : null, el('b', null, [title]), sub ? el('small', null, [sub]) : null]), btn || el('span')]); }
      function render() {
        body.innerHTML = '';
        [].forEach.call(tabs.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-t') === tab)); });
        var list = el('div', { 'class': 'fxc-list' });
        if (tab === 'today') {
          var n = new Date();
          PROGRAMME.slice().sort(function (a, b) { return eventStatus(a, n).mins - eventStatus(b, n).mins; }).sort(function (a, b) { return (eventStatus(b, n).live ? 1 : 0) - (eventStatus(a, n).live ? 1 : 0); }).forEach(function (ev) {
            var s = eventStatus(ev, n), hh = (ev.h < 10 ? '0' : '') + ev.h + ':00';
            list.appendChild(row(ev.kind === 'guard' ? '🎖' : ev.kind === 'family' ? '🎠' : ev.kind === 'meet' ? '🛍' : '🎶', s.live ? '● Live now · ' + fmtMins(s.mins) + ' left' : hh + ' · in ' + fmtMins(s.mins), ev.title, ev.desc,
              el('button', { 'class': 'fxc-btn' + (s.live ? ' gold' : ''), onclick: function () { close(); goSite(ev.site, ev.title); } }, [s.live ? 'Join' : 'Go'])));
          });
          list.appendChild(row('🏛', 'Conference Center', 'Citizen-hosted events', 'Talks, launches and meetups that citizens organise.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); try { window.__fyrus.setState({ hud: { open: true, tab: 'events' } }); } catch (e) {} } }, ['Open'])));
        } else if (tab === 'friends') {
          var W = window.__fyrusW, me = W && W.player && W.player.root.position, rows = [];
          if (W && W.peers && W.peers.forEach) W.peers.forEach(function (p, id) { if (!p || !p.root || String(id).indexOf('net-') !== 0) return; var d = me ? Math.round(Math.hypot(p.root.position.x - me.x, p.root.position.z - me.z)) : 0; rows.push({ name: p.name || 'Citizen', d: d, x: p.root.position.x, z: p.root.position.z }); });
          rows.sort(function (a, b) { return a.d - b.d; });
          if (!rows.length) list.appendChild(row('🫂', null, 'No other citizens are online near you right now', 'Invite a friend: send them fyrus.io. Everyone you meet in the city appears here.', el('button', { 'class': 'fxc-btn', onclick: function () { try { navigator.clipboard.writeText('https://fyrus.io'); toast('Link copied.'); } catch (e) { toast('fyrus.io'); } } }, ['Copy link'])));
          rows.slice(0, 30).forEach(function (r) { list.appendChild(row('🙂', r.d + ' m away', r.name, null, el('button', { 'class': 'fxc-btn', onclick: function () { close(); teleportTo({ name: 'Near ' + r.name, x: r.x + 4, z: r.z + 4 }, 'rail'); } }, ['Go to']))); });
        } else if (tab === 'guard') {
          var d = duty(), rk = rankOf(d.pts), nx = nextRank(d.pts);
          list.appendChild(el('div', { 'class': 'fxc-row', style: 'grid-template-columns:1fr auto' }, [
            el('div', null, [el('span', { 'class': 'tag' }, [d.track === 'peace' ? 'Peace Service' : 'Fyrus Guard']), el('b', { style: 'font:400 40px/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.04em' }, [rk[0]]), el('small', null, [d.pts + ' duty points' + (nx ? ' · ' + (nx[1] - d.pts) + ' to ' + nx[0] : ' · highest rank')])]),
            el('button', { 'class': 'fxc-btn', onclick: function () { var x = duty(); x.track = x.track === 'peace' ? 'guard' : 'peace'; saveDuty(x); render(); } }, ['Switch to ' + (d.track === 'peace' ? 'Guard' : 'Peace')])
          ]));
          var today = new Date().toDateString();
          list.appendChild(row('🎖', '+10 · once a day', 'Report for duty', 'Check in at the parade ground.', el('button', { 'class': 'fxc-btn' + (d.checkin === today ? '' : ' gold'), onclick: function () {
            var x = duty(); if (x.checkin === today) { toast('Already checked in today.'); return; }
            var W2 = window.__fyrusW, s = SITES.parade, pp = W2 && W2.player && W2.player.root.position;
            if (!s || !pp || Math.hypot(pp.x - s.x, pp.z - s.z) > s.r + 12) { close(); goSite('parade', 'Parade Ground'); toast('Walk onto the parade ground, then press Report again.'); return; }
            x.checkin = today; saveDuty(x); award(10, 'reported for duty'); render(); } }, [d.checkin === today ? 'Done today' : 'Report'])));
          var pt = d.patrol, prog = pt ? pt.pts.filter(function (p) { return p.done; }).length : 0;
          list.appendChild(row('🧭', '+30 · once a day', 'Patrol the city', pt ? 'Progress ' + prog + '/3: ' + pt.pts.map(function (p) { return (p.done ? '✓ ' : '') + p.name; }).join(' · ') : 'Visit three districts and keep the peace. Gold beacons mark the way.',
            el('button', { 'class': 'fxc-btn', onclick: function () { if (!pt) { startPatrol(); render(); } else { var nxp = pt.pts.filter(function (p) { return !p.done; })[0]; if (nxp) { close(); teleportTo({ name: nxp.name, x: nxp.x, z: nxp.z }, 'rail'); } } } }, [pt ? 'Next stop' : 'Start'])));
          list.appendChild(row('🎺', '+25 per ceremony', 'Attend a ceremony', 'Be on the parade ground during the Morning Parade (09:00) or the Changing of the Guard (18:00).', el('button', { 'class': 'fxc-btn', onclick: function () { close(); goSite('parade', 'Parade Ground'); } }, ['Go'])));
          list.appendChild(row('🕊', 'Peace Office', 'Real crime in Fyrus: 0', 'Battles exist only as games in Arcadia. Trades go through escrow. If someone bothers you, use Report on their profile or chat message: three trusted reports mute them for a day while a judge reviews.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); goSite('parade', 'Peace Office'); } }, ['Visit'])));
        } else if (tab === 'learn') {
          LADDER.forEach(function (L, i) {
            list.appendChild(el('div', { 'class': 'fxc-k', style: 'margin-top:' + (i ? '10px' : '0') }, ['Step ' + (i + 1) + ' · ' + L.step + ' · ' + L.inst]));
            L.courses.forEach(function (c) { var cert = certOf(c[0]);
              list.appendChild(row(i === 0 ? '📘' : i === 1 ? '📗' : '🎓', cert ? 'Certified · ' + cert : 'Free · certificate on completion', c[1], null, el('button', { 'class': 'fxc-btn' + (cert ? '' : ' gold'), onclick: function () { close(); openCourse(c[0]); } }, [cert ? 'View' : 'Start']))); });
          });
          list.appendChild(el('p', { 'class': 'fxc-p', style: 'margin:8px 0 0' }, ['Certificates are signed by Education City and anyone can verify the code. Teachers can also open their own school or college there.']));
        } else if (tab === 'civic') {
          list.appendChild(row('📰', 'Fyrus News', 'Publish a citizen report', 'Passport holders can publish 3 reports a day. Reports are labelled as citizen reports and readers can flag them.', el('button', { 'class': 'fxc-btn gold', onclick: function () { close(); try { window.__fyrus.setState({ newsFocus: { tab: 'report' }, hud: { open: true, tab: 'news' } }); } catch (e) {} } }, ['Write'])));
          list.appendChild(row('🏠', 'Real estate', 'Rent a home or rent yours out', 'List a plot or studio for rent, or rent one by the week. Payments go through the Central Bank.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); try { window.__fyrus.setState({ hud: { open: true, tab: 'estate' } }); } catch (e) {} } }, ['Open'])));
          list.appendChild(row('🎤', 'Conference Center', 'Host an event', 'Book a hall for a talk, a launch or a meetup and sell tickets.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); try { window.__fyrus.setState({ hud: { open: true, tab: 'events' } }); } catch (e) {} } }, ['Open'])));
        } else if (tab === 'family') {
          var on = kidsOn();
          list.appendChild(row('🛡', on ? 'On' : 'Off', 'Kids mode', 'Hides chat with strangers and closes the Battle Arena on this device. Needs a parent PIN to turn off.', el('button', { 'class': 'fxc-btn' + (on ? '' : ' gold'), onclick: function () { kidsToggle(render); } }, [on ? 'Turn off' : 'Turn on'])));
          list.appendChild(row('🎠', 'Family Park', 'The kids safe zone', 'Carousel, swings, a slide and Storytime every day at 11:00.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); goSite('park', 'Family Park'); } }, ['Go'])));
          list.appendChild(row('📘', 'Fyrus Public School', 'Digital Citizen Basics', 'A free first course about staying safe online.', el('button', { 'class': 'fxc-btn', onclick: function () { close(); openCourse('school-digital'); } }, ['Start'])));
        }
        body.appendChild(list);
      }
      defs.forEach(function (d) { tabs.appendChild(el('button', { 'data-t': d[0], role: 'tab', onclick: function () { tab = d[0]; render(); } }, [d[1]])); });
      card.appendChild(el('div', { 'class': 'fxc-k' }, ['The Republic of Fyrus']));
      card.appendChild(el('h2', { 'class': 'fxc-h' }, ['Life in the country']));
      card.appendChild(tabs); card.appendChild(body);
      card.appendChild(el('div', { 'class': 'fxc-foot' }, [el('button', { 'class': 'fxc-btn', onclick: function () { close(); API.openTransit('fly'); } }, ['🧭 Transit']), el('button', { 'class': 'fxc-btn', onclick: close }, ['Close'])]));
      render();
    });
  };

  /* ---------------- search: register new places in "Where to?" ---------------- */
  function registerPlaces() {
    var VBL = window.__fyrusVB ? window.__fyrusVB.landing : { x: 330, z: -960 };
    var list = [{ id: 'vector-bay', name: 'Vector Bay', sub: 'The Azure Coast · a city across the bay', kind: 'City', icon: '🌅', x: VBL.x, z: VBL.z, run: function () { if (window.__fyrusVB) window.__fyrusVB.go(); } },
      { id: 'transit', name: 'Fyrus Transit', sub: 'Flights, metro and buses', kind: 'Place', icon: '🧭', x: 0, z: 30 }];
    var names = { central: ['Grand Central & Bus Adda', 'Fyrus Transit station', '🚉'], parade: ['Fyrus Guard Parade Ground', 'The Country · army and Peace Office', '🎖'], amph: ['Sunset Amphitheater', 'Concerts and events every day', '🎶'], park: ['Family Park', 'Kids safe zone', '🎠'] };
    Object.keys(SITES).forEach(function (k) { var p = siteXZ(k), n = names[k]; if (p && n) list.push({ id: 'site-' + k, name: n[0], sub: n[1], kind: 'Place', icon: n[2], x: p.x, z: p.z, face: { x: SITES[k].x, z: SITES[k].z } }); });
    if (SITES.parade) { var pp = siteXZ('parade'); list.push({ id: 'site-peace', name: 'Peace Office', sub: 'Police · Real crime: 0', kind: 'Place', icon: '🕊', x: pp.x, z: pp.z, face: { x: SITES.parade.x, z: SITES.parade.z } }); list.push({ id: 'the-country', name: 'The Country', sub: 'Guard, concerts, family park', kind: 'Place', icon: '🏛', x: pp.x, z: pp.z, face: { x: SITES.parade.x, z: SITES.parade.z } }); }
    if (window.__fyrusHall) list.push({ id: 'arcade-hall', name: 'Arcade Hall (3D)', sub: 'Fyrus Arcade · every game as a glowing 3D cabinet', kind: 'Place', icon: '🕹', x: 0, z: 30, run: function () { window.__fyrusHall.open(); } });
    if (window.__fyrusHome3D) list.push({ id: 'home-showroom', name: 'Home Showroom (3D)', sub: 'See every Dream Life home in 3D before you buy', kind: 'Place', icon: '🏡', x: 0, z: 30, run: function () { window.__fyrusHome3D.open({ mode: 'catalogue' }); } });
    if (window.__fyrusMall3D) list.push({ id: 'mall-3d', name: '3D Stores (Fyrus Market)', sub: 'Walk into a brand store and see products in 4D', kind: 'Place', icon: '🛍', x: 170, z: -40, run: function () { window.__fyrusMall3D.open({}); } });
    var A = window.__fyrusArena; if (A && A.gateAt) list.push({ id: 'arena', name: 'Arcadia Battle Arena', sub: 'Battle royale vs AI (game only)', kind: 'Place', icon: '⚔️', x: A.gateAt.x, z: A.gateAt.z + 8 });
    window.__fyrusPlaces = list;
  }
  API.registerPlaces = registerPlaces;

  /* ---------------- dock buttons ---------------- */
  function addDock() {
    var dock = document.querySelector('.fxp-dock'); if (!dock) return;
    if (!dock.querySelector('[data-fxc-transit]')) dock.appendChild(el('button', { 'aria-label': 'Fyrus Transit', 'data-fxc-transit': '1', onclick: function () { API.openTransit('fly'); } }, ['🧭', el('span', null, ['Transit · flights, metro, bus'])]));
    if (!dock.querySelector('[data-fxc-hub]')) dock.appendChild(el('button', { 'aria-label': 'Life in the country', 'data-fxc-hub': '1', onclick: function () { API.openHub('today'); } }, ['🏛', el('span', null, ['Today · friends · guard · learn · family'])]));
  }

  /* ---------------- world builders ---------------- */
  var built = null, anim = { buses: [], guards: [], performers: [], carousel: null, swings: [], lights: [], beacons: [], screens: {} };
  function label(T, text, color, w) {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 160; var g = c.getContext('2d');
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 96px "Bebas Neue", Sora, sans-serif'; g.fillStyle = color || GOLD_HI; g.shadowColor = 'rgba(201,169,110,.8)'; g.shadowBlur = 18; g.fillText(text, 512, 84);
    var t = new T.CanvasTexture(c); var s = new T.Sprite(new T.SpriteMaterial({ map: t, transparent: true, depthWrite: false })); s.scale.set(w || 18, (w || 18) * .156, 1); return s;
  }
  function busMesh(T) {
    var g = new T.Group();
    box(T, g, M(T, 0x1b2a4a, { metal: .3, roughness: .35 }), 2.6, 3.0, 11, 0, 1.9, 0);
    box(T, g, M(T, 0x0a0f1a, { emissive: 0xffd49a, emissiveIntensity: .7 }), 2.64, 1.0, 9.6, 0, 2.5, 0);
    box(T, g, M(T, 0xc9a96e, { metal: 1, roughness: .3 }), 2.66, .2, 11, 0, 1.5, 0);
    var wm = M(T, 0x111111, { roughness: .8 });
    [[-1.2, 3.6], [1.2, 3.6], [-1.2, -3.6], [1.2, -3.6]].forEach(function (p) { var w = cyl(T, g, wm, .55, .55, .4, p[0], .55, p[1], 14); w.rotation.z = Math.PI / 2; });
    return g;
  }
  function buildCentral(W, T, root) {
    var p = claim(W, 'central', 26, 110, 240, 2.2); if (!p) return;
    var g = new T.Group(); g.position.set(p.x, 0, p.z); face(g, p);
    var stone = M(T, 0xe9dfcf, { roughness: .55 }), gold = M(T, 0xc9a96e, { metal: 1, roughness: .28 }), glass = M(T, 0x0d1626, { emissive: 0xffc98a, emissiveIntensity: .8, metal: .6, roughness: .12 });
    box(T, g, stone, 26, 1, 16, 0, .5, -4);
    box(T, g, glass, 20, 8, 10, 0, 5, -6);
    var vault = new T.Mesh(new T.CylinderGeometry(7, 7, 20, 32, 1, false, 0, Math.PI), stone); vault.rotation.z = Math.PI / 2; vault.position.set(0, 9, -6); vault.scale.set(1, 1, .75); g.add(vault);
    [-10, -3.3, 3.3, 10].forEach(function (px) { box(T, g, gold, .8, 9, .8, px, 5, -.6); });
    var lb = label(T, 'GRAND CENTRAL', GOLD_HI, 30); lb.position.set(0, 21, -6); g.add(lb);
    /* Bus Adda: canopy and bays in front of the station */
    box(T, g, stone, 24, .4, 9, 0, .2, 9);
    var canopy = box(T, g, M(T, 0xf4efe6, { roughness: .4 }), 24, .3, 6, 0, 4.6, 9); canopy.castShadow = true;
    [-11, -4, 4, 11].forEach(function (px) { box(T, g, gold, .3, 4.4, .3, px, 2.3, 11.6); });
    var lb2 = label(T, 'BUS ADDA', '#f4efe6', 10); lb2.position.set(0, 6.4, 9); g.add(lb2);
    for (var i = 0; i < 3; i++) { var b = busMesh(T); b.position.set(-8 + i * 8, 0, 15); b.rotation.y = 0; g.add(b); }
    root.add(g);
    var wp = new T.Vector3(); g.localToWorld(wp.set(0, 0, 9));
    W.colliders.push({ x: p.x, z: p.z, r: 9 });
    W.staticInteracts.push({ pos: new T.Vector3(wp.x, 0, wp.z), radius: 14, label: 'Fyrus Transit · flights, metro and buses', action: 'transit', use: function () { API.openTransit('fly'); } });
    for (var k = 0; k < 4; k++) { var bus = busMesh(T); root.add(bus); anim.buses.push({ g: bus, a: k / 4 * Math.PI * 2, speed: .055 + k * .004, r: 172 + (k % 2) * 6 }); }
  }
  function buildParade(W, T, root) {
    var p = claim(W, 'parade', 34, 210, 380, 0.6); if (!p) return;
    var g = new T.Group(); g.position.set(p.x, 0, p.z); face(g, p);
    var stone = M(T, 0xa89c88, { roughness: .8 }), dark = M(T, 0x1b2a4a, { roughness: .5 }), gold = M(T, 0xc9a96e, { metal: 1, roughness: .3 });
    box(T, g, stone, 46, .3, 46, 0, .15, 0); box(T, g, M(T, 0x7d725f, { roughness: .9 }), 47, .26, 47, 0, .12, 0);
    box(T, g, M(T, 0xc9a96e, { metal: .6, roughness: .5 }), 40, .32, .4, 0, .16, 0); box(T, g, M(T, 0xc9a96e, { metal: .6, roughness: .5 }), .4, .32, 40, 0, .16, 0);
    /* reviewing stand */
    box(T, g, M(T, 0xe9dfcf, { roughness: .6 }), 18, 2, 6, 0, 1, -20); box(T, g, dark, 18, .4, 6.4, 0, 5.4, -20);
    [-8, -3, 3, 8].forEach(function (x) { box(T, g, gold, .4, 3.4, .4, x, 3.7, -17.4); });
    /* province flags */
    var WD = window.__fyrusWorld, P = (WD && WD.provinces) || [];
    P.forEach(function (pr, i) {
      var a = Math.PI + (i + .5) / P.length * Math.PI, fx = Math.cos(a) * 25, fz = Math.sin(a) * 25 * -1;
      cyl(T, g, M(T, 0xe8e2d6, { metal: .4, roughness: .3 }), .1, .14, 12, fx, 6, fz, 8);
      var cv = null; try { cv = WD.flagCanvas(pr, 256, 160); } catch (e) {}
      if (cv) { var fm = new T.Mesh(new T.PlaneGeometry(3.6, 2.25, 8, 2), new T.MeshStandardMaterial({ map: new T.CanvasTexture(cv), side: T.DoubleSide, roughness: .8 })); fm.position.set(fx + 1.85, 10.6, fz); g.add(fm); anim.lights.push({ flag: fm, base: fm.geometry.attributes.position.array.slice(0) }); }
    });
    var lb = label(T, 'THE FYRUS GUARD', GOLD_HI, 22); lb.position.set(0, 9.5, -20); g.add(lb);
    /* honour guard: 16 AI figures */
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var f = figure(T, { cloth: 0x15213d, legs: 0xf4efe6, hat: 'shako', skin: [0xe8c4a0, 0xb9805a, 0x8d5a3b, 0xd6a77e][(r + c) % 4] });
      f.userData.slot = { x: -4.5 + c * 3, z: -4.5 + r * 3 }; f.position.set(f.userData.slot.x, .3, f.userData.slot.z); g.add(f); anim.guards.push(f);
    }
    var tag = label(T, 'HONOUR GUARD · AI', '#9aa3b2', 7); tag.position.set(0, 3.6, 0); g.add(tag);
    anim.paradeGroup = g;
    /* Peace Office beside the ground */
    var po = new T.Group(); po.position.set(28, 0, -6);
    box(T, po, M(T, 0xf4efe6, { roughness: .5 }), 10, 6, 8, 0, 3, 0); box(T, po, dark, 10.4, .6, 8.4, 0, 6.2, 0);
    box(T, po, M(T, 0x0d1626, { emissive: 0x9cc8ff, emissiveIntensity: .7 }), 6, 2.4, .1, 0, 3, 4.05);
    var scr = screen(T, 7, 3.2); scr.position.set(0, 9.6, 2); po.add(scr); scr.userData.draw(['PEACE OFFICE', 'REAL CRIME: 0', 'Battles exist only as games in Arcadia']); anim.screens.peace = scr;
    var lb3 = label(T, 'PEACE OFFICE', '#cfe3ff', 9); lb3.position.set(0, 13.2, 0); po.add(lb3);
    g.add(po);
    root.add(g);
    W.colliders.push({ x: p.x, z: p.z, r: 3 });
    W.staticInteracts.push({ pos: new T.Vector3(p.x, 0, p.z), radius: 30, label: 'The Fyrus Guard · report for duty', action: 'guard', use: function () { API.openHub('guard'); } });
  }
  function buildAmph(W, T, root) {
    var p = claim(W, 'amph', 34, 210, 400, 3.4); if (!p) return;
    var g = new T.Group(); g.position.set(p.x, 0, p.z); face(g, p);
    var stone = M(T, 0xb7a990, { roughness: .8, flatShading: true }), dark = M(T, 0x0a0f1a, { roughness: .6 }), gold = M(T, 0xc9a96e, { metal: 1, roughness: .3 });
    var plaza = new T.Mesh(new T.CircleGeometry(36, 48), M(T, 0x8f8574, { roughness: .9 })); plaza.rotation.x = -Math.PI / 2; plaza.position.y = .08; plaza.receiveShadow = true; g.add(plaza);
    var prof = [new T.Vector2(13.9, 0)]; for (var i = 0; i < 7; i++) { var rr = 14 + i * 2.6, hh = .6 + i * .6; prof.push(new T.Vector2(rr, hh), new T.Vector2(rr + 2.6, hh)); } prof.push(new T.Vector2(14 + 7 * 2.6, 0));
    var tiers = new T.Mesh(new T.LatheGeometry(prof, 20, -Math.PI / 2, Math.PI), stone); tiers.position.set(0, 0, 6); tiers.material.side = T.DoubleSide; tiers.castShadow = true; tiers.receiveShadow = true; g.add(tiers);
    for (var e = 0; e < 7; e++) { var edge = new T.Mesh(new T.TorusGeometry(14 + e * 2.6, .06, 4, 40, Math.PI), M(T, 0xc9a96e, { metal: .8, roughness: .4 })); edge.rotation.x = -Math.PI / 2; edge.rotation.z = Math.PI; edge.position.set(0, .62 + e * .6, 6); g.add(edge); }
    box(T, g, dark, 22, 1.4, 10, 0, .7, -6);
    box(T, g, gold, 22.4, .2, .3, 0, 1.45, -1.1);
    var scr = screen(T, 18, 7.5); scr.position.set(0, 8, -10.8); g.add(scr); anim.screens.amph = scr;
    [-10.5, 10.5].forEach(function (x) { box(T, g, M(T, 0x111827, { metal: .7, roughness: .3 }), .6, 13, .6, x, 6.5, -10.5); });
    box(T, g, M(T, 0x111827, { metal: .7, roughness: .3 }), 22, .6, .6, 0, 13, -10.5);
    for (var k = 0; k < 4; k++) {
      var cone = new T.Mesh(new T.ConeGeometry(2.6, 12, 18, 1, true), new T.MeshBasicMaterial({ color: k % 2 ? 0xffd49a : 0x9cc8ff, transparent: true, opacity: .14, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide }));
      cone.position.set(-7.5 + k * 5, 7, -8); cone.rotation.x = .25; cone.visible = false; g.add(cone); anim.lights.push({ cone: cone, k: k });
    }
    var cast = [{ prop: 'mic', cloth: 0xc9a96e }, { prop: 'guitar', cloth: 0x2a2f3a }, { prop: 'guitar', cloth: 0x6b2f4a }];
    cast.forEach(function (o, i) { var f = figure(T, { cloth: o.cloth, legs: 0x0a0f1a, prop: o.prop, skin: [0xd6a77e, 0x8d5a3b, 0xe8c4a0][i], gender: i === 1 ? 'f' : 'm', hair: ['side', 'long', 'curly'][i], top: i === 1 ? 'dress' : 'shirt' }); f.position.set(-5 + i * 5, 1.4, -6); f.rotation.y = 0; f.visible = false; g.add(f); anim.performers.push(f); });
    var tag = label(T, 'FYRUS ENSEMBLE · AI', '#9aa3b2', 8); tag.position.set(0, 4.6, -6); tag.visible = false; g.add(tag); anim.ensembleTag = tag;
    var lb = label(T, 'SUNSET AMPHITHEATER', GOLD_HI, 18); lb.position.set(0, 17, -10.8); g.add(lb);
    anim.amphGroup = g;
    root.add(g);
    W.colliders.push({ x: p.x, z: p.z, r: 3 });
    W.staticInteracts.push({ pos: new T.Vector3(p.x, 0, p.z), radius: 30, label: 'Sunset Amphitheater · today\'s programme', action: 'amph', use: function () { API.openHub('today'); } });
  }
  function buildPark(W, T, root) {
    var p = claim(W, 'park', 28, 140, 330, 4.6); if (!p) return;
    var g = new T.Group(); g.position.set(p.x, 0, p.z); face(g, p);
    var lawn = new T.Mesh(new T.CircleGeometry(26, 48), M(T, 0x3f8a34, { roughness: .95 })); lawn.rotation.x = -Math.PI / 2; lawn.position.y = .12; lawn.receiveShadow = true; g.add(lawn);
    var path = new T.Mesh(new T.RingGeometry(15, 17.5, 48), M(T, 0xe6dccb, { roughness: .8 })); path.rotation.x = -Math.PI / 2; path.position.y = .14; g.add(path);
    var fnt = new T.Group(); cyl(T, fnt, M(T, 0xe9dfcf), 3.2, 3.4, .7, 0, .35, 0, 24); var wtr = cyl(T, fnt, M(T, 0x4da3ff, { roughness: .1, metal: .2, emissive: 0x0b3a66, emissiveIntensity: .4 }), 2.9, 2.9, .1, 0, .72, 0, 24); cyl(T, fnt, M(T, 0xc9a96e, { metal: 1, roughness: .3 }), .3, .4, 2.2, 0, 1.6, 0, 10); g.add(fnt);
    var leafM = M(T, 0x4e8a3a, { roughness: .9, flatShading: true }), trunkM = M(T, 0x6b4b2e);
    for (var tt = 0; tt < 10; tt++) { var ta = tt / 10 * Math.PI * 2 + .3; var tx = Math.cos(ta) * 21.5, tz = Math.sin(ta) * 21.5; cyl(T, g, trunkM, .25, .35, 2.4, tx, 1.2, tz, 6); var crown = new T.Mesh(new T.IcosahedronGeometry(2.2, 0), leafM); crown.position.set(tx, 3.6, tz); crown.castShadow = true; g.add(crown); }
    var bloom = [0xff9a3c, 0xc792ea, 0xffc27a, 0xd9534f];
    for (var fb = 0; fb < 8; fb++) { var fa = fb / 8 * Math.PI * 2; var bxp = Math.cos(fa) * 12.5, bzp = Math.sin(fa) * 12.5; if (Math.hypot(bxp + 8, bzp + 5) < 7.5 || Math.hypot(bxp - 8, bzp + 6) < 5 || Math.hypot(bxp - 7, bzp - 7) < 5.5) continue; var bed = new T.Mesh(new T.CylinderGeometry(1.4, 1.4, .3, 12), M(T, bloom[fb % 4], { roughness: .8 })); bed.position.set(Math.cos(fa) * 12.5, .25, Math.sin(fa) * 12.5); g.add(bed); }
    for (var bn = 0; bn < 6; bn++) { var ba = bn / 6 * Math.PI * 2 + .5; var bench = box(T, g, M(T, 0x8a6440), 2.4, .2, .7, Math.cos(ba) * 18.8, .6, Math.sin(ba) * 18.8, -ba + Math.PI / 2); }
    var fenceM = M(T, 0xf4efe6, { roughness: .5 });
    for (var i = 0; i < 56; i++) { var a = i / 56 * Math.PI * 2; if (Math.abs(Math.sin(a / 2)) < .08) continue; box(T, g, fenceM, .2, 1.1, .2, Math.cos(a) * 26, .55, Math.sin(a) * 26); }
    var rail = new T.Mesh(new T.TorusGeometry(26, .07, 4, 96), fenceM); rail.rotation.x = Math.PI / 2; rail.position.y = 1.05; g.add(rail);
    /* carousel */
    var car = new T.Group(); car.position.set(-8, .1, -5);
    cyl(T, car, M(T, 0xf4efe6), 5, 5, .4, 0, .2, 0, 32); cyl(T, car, M(T, 0xc9a96e, { metal: 1, roughness: .3 }), .25, .25, 5, 0, 2.7, 0, 12);
    var top = new T.Mesh(new T.ConeGeometry(5.6, 2.2, 32), M(T, 0xd9534f, { roughness: .6 })); top.position.y = 6.1; car.add(top);
    var cols = [0xffc27a, 0x9cc8ff, 0xc792ea, 0x45b38a, 0xff9a3c, 0xf4efe6];
    for (var h = 0; h < 6; h++) { var aa = h / 6 * Math.PI * 2; cyl(T, car, M(T, 0xc9a96e, { metal: 1 }), .06, .06, 4.2, Math.cos(aa) * 3.8, 2.6, Math.sin(aa) * 3.8, 6); box(T, car, M(T, cols[h], { roughness: .5 }), .5, .8, 1.4, Math.cos(aa) * 3.8, 1.6, Math.sin(aa) * 3.8, -aa); }
    g.add(car); anim.carousel = car;
    /* swings */
    var sw = new T.Group(); sw.position.set(8, 0, -6);
    [-3, 3].forEach(function (x) { var leg = cyl(T, sw, M(T, 0x1b2a4a), .12, .12, 4.4, x, 2.2, 0, 8); });
    var bar = cyl(T, sw, M(T, 0x1b2a4a), .1, .1, 6.4, 0, 4.4, 0, 8); bar.rotation.z = Math.PI / 2;
    [-1.4, 1.4].forEach(function (x, i) { var piv = new T.Group(); piv.position.set(x, 4.4, 0); cyl(T, piv, M(T, 0x9aa3b2), .02, .02, 3, -.3, -1.5, 0, 4); cyl(T, piv, M(T, 0x9aa3b2), .02, .02, 3, .3, -1.5, 0, 4); box(T, piv, M(T, 0xff9a3c), .8, .1, .4, 0, -3, 0); sw.add(piv); anim.swings.push({ p: piv, ph: i * 1.3 }); });
    g.add(sw);
    /* slide */
    var sl = new T.Group(); sl.position.set(7, 0, 7);
    box(T, sl, M(T, 0x1b2a4a), 2, 3, 2, 0, 1.5, -2); var chute = box(T, sl, M(T, 0x45b38a, { roughness: .4 }), 1.4, .2, 6, 0, 1.6, 1.4); chute.rotation.x = -.5;
    g.add(sl);
    var lb = label(T, 'FAMILY PARK · KIDS SAFE ZONE', '#bff0d8', 26); lb.position.set(0, 11, 0); g.add(lb);
    root.add(g);
    W.staticInteracts.push({ pos: new T.Vector3(p.x, 0, p.z), radius: 26, label: 'Family Park · Kids mode and Storytime', action: 'park', use: function () { API.openHub('family'); } });
  }
  function buildWorld() {
    var W = window.__fyrusW, T = window.THREE; if (!W || !W.world || !T || !W.blocked || built === W) return;
    var s = S(); if (!s || !s.session) return;
    built = W; anim = { buses: [], guards: [], performers: [], carousel: null, swings: [], lights: [], beacons: [], screens: {} };
    RES.length = 0; reserveHook(W);
    var root = new T.Group(); root.name = 'fyrus-country';
    [buildCentral, buildParade, buildAmph, buildPark].forEach(function (fn) { try { fn(W, T, root); } catch (e) { if (window.console) console.warn('[fyrus-country]', fn.name, e); } });
    W.world.add(root);
    refreshChunks(W);
    applyKids();
  }

  /* ---------------- patrol beacons ---------------- */
  function syncBeacons(T, W) {
    var d = duty(), want = d.patrol ? d.patrol.pts.filter(function (p) { return !p.done; }) : [];
    var key = want.map(function (p) { return p.name; }).join('|');
    if (anim.beaconKey === key) return; anim.beaconKey = key;
    anim.beacons.forEach(function (b) { W.world.remove(b); }); anim.beacons = [];
    want.forEach(function (p) { var b = new T.Mesh(new T.CylinderGeometry(1.4, 1.4, 60, 16, 1, true), new T.MeshBasicMaterial({ color: 0xe8d5a8, transparent: true, opacity: .22, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); b.position.set(p.x, 30, p.z); W.world.add(b); anim.beacons.push(b); });
  }

  /* ---------------- concert audio (only when sound is on and you are near) ---------------- */
  var audio = null;
  function music(on, gain) {
    try {
      if (on && !audio) {
        var C = window.AudioContext || window.webkitAudioContext; if (!C) return; var ctx = new C(); var master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
        var chords = [[220, 277.18, 329.63], [196, 246.94, 293.66], [174.61, 220, 261.63], [196, 246.94, 329.63]], oscs = [];
        for (var i = 0; i < 3; i++) { var o = ctx.createOscillator(); o.type = 'triangle'; var g = ctx.createGain(); g.gain.value = .05; o.connect(g); g.connect(master); o.start(); oscs.push(o); }
        var bass = ctx.createOscillator(); bass.type = 'sine'; var bg = ctx.createGain(); bg.gain.value = .12; bass.connect(bg); bg.connect(master); bass.start();
        var step = 0; var iv = setInterval(function () { var ch = chords[step % 4]; oscs.forEach(function (o, k) { o.frequency.setTargetAtTime(ch[k], ctx.currentTime, .08); }); bass.frequency.setTargetAtTime(ch[0] / 2, ctx.currentTime, .05); step++; }, 2000);
        audio = { ctx: ctx, master: master, iv: iv };
      }
      if (audio) audio.master.gain.setTargetAtTime(on ? gain : 0, audio.ctx.currentTime, .4);
    } catch (e) {}
  }

  /* ---------------- animation ---------------- */
  var lastT = performance.now(), slow = 0;
  function tick(now) {
    var dt = Math.min(.1, Math.max(0, (now - lastT) / 1000)); lastT = Math.max(lastT, now);
    var T = window.THREE, W = window.__fyrusW, t = now / 1000;
    anim.buses.forEach(function (b) { b.a += b.speed * dt * .35; b.g.position.set(Math.cos(b.a) * b.r, 0, Math.sin(b.a) * b.r); b.g.rotation.y = -b.a; });
    if (anim.carousel) anim.carousel.rotation.y += dt * .6;
    anim.swings.forEach(function (s) { s.p.rotation.x = Math.sin(t * 1.6 + s.ph) * .55; });
    anim.lights.forEach(function (l) {
      if (l.flag) { var pos = l.flag.geometry.attributes.position, b = l.base; for (var i = 0; i < pos.count; i++) { var x = b[i * 3]; pos.array[i * 3 + 2] = Math.sin(t * 3 + x * 1.6) * .18 * ((x + 1.8) / 3.6); } pos.needsUpdate = true; }
    });
    var guardLive = liveAt('parade'), stageLive = liveAt('amph');
    anim.guards.forEach(function (f, i) {
      var s = f.userData.slot;
      if (guardLive) { var a = t * .18, rx = Math.cos(a) * 9, rz = Math.sin(a) * 9; f.position.set(s.x + rx, .3, s.z + rz); f.rotation.y = -a; walkPose(f, t * 5, .55); }
      else { f.position.set(s.x, .3, s.z); f.rotation.y = 0; walkPose(f, 0, 0); }
    });
    var concert = stageLive && (stageLive.kind === 'concert' || stageLive.kind === 'stage');
    anim.performers.forEach(function (f, i) { f.visible = !!concert; if (concert) { f.position.y = 1.4 + Math.abs(Math.sin(t * 4 + i)) * .08; f.rotation.y = Math.sin(t * .8 + i) * .3; walkPose(f, t * 2 + i, .12); } });
    if (anim.ensembleTag) anim.ensembleTag.visible = !!concert;
    anim.lights.forEach(function (l) { if (l.cone) { l.cone.visible = !!concert; if (concert) { l.cone.rotation.z = Math.sin(t * .9 + l.k * 1.7) * .5; } } });
    slow += dt;
    if (slow > 2 && T && W && built === W) {
      slow = 0;
      if (anim.screens.amph) { var key = stageLive ? 'L' + stageLive.title : 'N' + ((nextAt('amph') || {}).title || '') + new Date().getHours(); if (anim.screens.amph.userData.k !== key) { anim.screens.amph.userData.k = key; if (stageLive) anim.screens.amph.userData.draw(['● LIVE NOW', stageLive.title.toUpperCase(), stageLive.desc]); else { var nx = nextAt('amph'), st = nx && eventStatus(nx); anim.screens.amph.userData.draw(['NEXT · ' + (nx ? ((nx.h < 10 ? '0' : '') + nx.h + ':00') : ''), nx ? nx.title.toUpperCase() : 'SUNSET AMPHITHEATER', nx ? 'Starts in ' + fmtMins(st.mins) : '']); } } }
      /* patrol progress + ceremonies */
      var d = duty(), pp = W.player && W.player.root.position;
      if (d.patrol && pp) {
        var ch = false; d.patrol.pts.forEach(function (q) { if (!q.done && Math.hypot(q.x - pp.x, q.z - pp.z) < 18) { q.done = true; ch = true; toast('Patrol checkpoint: ' + q.name); } });
        if (ch) { if (d.patrol.pts.every(function (q) { return q.done; })) { d.patrol = null; d.patrolDone = new Date().toDateString(); saveDuty(d); award(30, 'patrol complete'); } else saveDuty(d); }
      }
      if (guardLive && pp && SITES.parade && Math.hypot(pp.x - SITES.parade.x, pp.z - SITES.parade.z) < SITES.parade.r + 8) {
        var id = new Date().toDateString() + guardLive.h; var d2 = duty(); if ((d2.ceremonies || []).indexOf(id) < 0) { d2.ceremonies = (d2.ceremonies || []).slice(-20).concat([id]); saveDuty(d2); award(25, 'attended ' + guardLive.title); }
      }
      syncBeacons(T, W);
      applyKids();
      registerPlaces();
    }
    /* concert music only when the citizen turned sound on and stands near the stage */
    try {
      var st2 = S(), p2 = W && W.player && W.player.root.position, A = SITES.amph;
      if (st2 && st2.audioOn && concert && p2 && A) { var dd = Math.hypot(p2.x - A.x, p2.z - A.z); music(dd < 90, Math.max(0, 1 - dd / 90) * .5 * ((st2.settings && st2.settings.volume) || .8)); } else if (audio) music(false, 0);
    } catch (e) {}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  setInterval(function () { try { addDock(); buildWorld(); if (built) registerPlaces(); } catch (e) { if (window.console) console.warn('[fyrus-country]', e); } }, 1000);
})();
