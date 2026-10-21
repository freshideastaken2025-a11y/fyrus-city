/* Fyrus+ — add-on layer for Fyrus City (loads after the main bundle).
   Adds: mood/weather picker on entry, visa-free Citizen ID card from a photo,
   Museum of 2026, neon "free plot" construction sites, cinematic frame.
   Uses only the public hooks the app exposes: window.__fyrus (state) and
   window.__fyrusW (3D world). If those are missing it does nothing. */
(function () {
  'use strict';
  if (window.__fyrusPlus) return;
  window.__fyrusPlus = { version: '1.4.0' };

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('fyrusPlus.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fyrusPlus.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var F = function () { return window.__fyrus; };
  var Wd = function () { return window.__fyrusW; };
  var S = function () { try { return F().getState(); } catch (e) { return null; } };

  /* ---------- styles ---------- */
  var css = '' +
    '.fxp-ov{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;background:rgba(4,8,18,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px;font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#f2f3f5;animation:fxpIn .35s ease}' +
    '@keyframes fxpIn{from{opacity:0}to{opacity:1}}' +
    '.fxp-card{position:relative;width:min(560px,100%);max-height:calc(100vh - 32px);overflow:auto;background:linear-gradient(165deg,#111a2b 0%,#0a0f1a 60%,#0d1422 100%);border:1px solid rgba(201,169,110,.35);border-radius:20px;padding:26px;box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 1px 0 rgba(232,213,168,.12)}' +
    '.fxp-card.wide{width:min(980px,100%)}' +
    '.fxp-k{font:500 11px/1 "JetBrains Mono",monospace;letter-spacing:.34em;text-transform:uppercase;color:#c9a96e}' +
    '.fxp-h{font:400 clamp(36px,5vw,48px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;margin:10px 0 8px;background:linear-gradient(180deg,#f3e2b8,#c9a96e);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.fxp-p{color:#aab2c0;font-size:14px;line-height:1.6;margin:0 0 16px}' +
    '.fxp-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}' +
    '.fxp-mood{position:relative;border:1px solid rgba(201,169,110,.25);border-radius:14px;padding:14px 12px;text-align:left;cursor:pointer;color:#fff;font:600 14px Sora,sans-serif;min-height:92px;overflow:hidden;text-shadow:0 1px 3px rgba(0,0,0,.55);transition:transform .15s,border-color .15s}' +
    '.fxp-mood:hover,.fxp-mood:focus-visible{transform:translateY(-2px);border-color:#e8d5a8;outline:none;box-shadow:0 10px 30px rgba(201,169,110,.2)}' +
    '.fxp-mood .i{font-size:26px;display:block;margin-bottom:8px}' +
    '.fxp-mood small{display:block;font:500 11px "Plus Jakarta Sans",sans-serif;color:rgba(255,255,255,.75);margin-top:3px}' +
    '.fxp-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center}' +
    '.fxp-btn{border:0;border-radius:999px;padding:12px 20px;font:600 12px Sora,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;background:linear-gradient(180deg,#f0dfb4,#c9a96e);color:#1a1408}' +
    '.fxp-btn.ghost{background:transparent;color:#e8d5a8;border:1px solid rgba(201,169,110,.45)}' +
    '.fxp-btn:disabled{opacity:.5;cursor:default}' +
    '.fxp-in{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:10px 12px;color:#fff;font:500 14px "Plus Jakarta Sans",sans-serif}' +
    '.fxp-lab{font:600 12px Sora,sans-serif;color:#a3a9b3;margin:10px 0 6px;display:block}' +
    '.fxp-dock{position:fixed;right:10px;top:50%;transform:translateY(-50%);z-index:2147482000;display:flex;flex-direction:column;gap:8px}' +
    '.fxp-dock button{width:44px;height:44px;border-radius:12px;border:1px solid rgba(201,169,110,.3);background:rgba(10,15,26,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font-size:20px;cursor:pointer;display:grid;place-items:center;position:relative}' +
    '.fxp-dock button:hover{border-color:#e8d5a8}' +
    '.fxp-dock button span{position:absolute;right:52px;white-space:nowrap;background:rgba(10,12,16,.9);padding:5px 9px;border-radius:8px;font:600 12px Sora,sans-serif;opacity:0;pointer-events:none;transition:opacity .15s}' +
    '.fxp-dock button:hover span{opacity:1}' +
    '.fxp-vig{position:fixed;inset:0;pointer-events:none;z-index:5;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%)}' +
    '.fxp-bars:before,.fxp-bars:after{content:"";position:fixed;left:0;right:0;height:9vh;background:#000;z-index:6;pointer-events:none;transition:height .6s}' +
    '.fxp-bars:before{top:0}.fxp-bars:after{bottom:0}' +
    '.fxp-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 14px}' +
    '.fxp-tab{border:0;border-bottom:2px solid transparent;background:transparent;color:#9aa3b2;padding:9px 12px;font:600 12px Sora,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer}' +
    '.fxp-tab.on{color:#e8d5a8;border-bottom-color:#c9a96e}' +
    '.fxp-ex{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px}' +
    '.fxp-exc{border:1px solid rgba(201,169,110,.18);border-radius:14px;padding:16px;background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01))}' +
    '.fxp-exc .e{font-size:30px}.fxp-exc b{display:block;font:700 15px Sora,sans-serif;margin:8px 0 2px}' +
    '.fxp-exc i{font-style:normal;font:500 11px "JetBrains Mono",monospace;letter-spacing:.12em;color:#c9a96e}' +
    '.fxp-exc p{margin:6px 0 0;color:#a3a9b3;font-size:13px;line-height:1.45}' +
    '.fxp-x{position:absolute;top:16px;right:16px;background:none;border:1px solid rgba(201,169,110,.35);border-radius:999px;width:34px;height:34px;color:#e8d5a8;font-size:18px;cursor:pointer;line-height:1}' +
    '.fxp-idwrap{display:grid;place-items:center;margin:8px 0}' +
    '.fxp-idwrap canvas{width:100%;max-width:520px;height:auto;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5)}' +
    '.fxp-toast{position:fixed;left:50%;bottom:170px;transform:translateX(-50%);z-index:2147483001;background:rgba(10,15,26,.94);border:1px solid rgba(201,169,110,.4);color:#fff;padding:10px 16px;border-radius:12px;font:600 13px Sora,sans-serif}' +
    'body.fxp-easy .fxp-dock button{width:56px;height:56px;font-size:26px}body.fxp-easy .fxp-dock button span{opacity:1;font-size:14px}' +
    'body.fxp-easy .fxp-p,body.fxp-easy .fxp-exc p{font-size:17px}body.fxp-easy .fxp-btn{font-size:15px;padding:15px 24px}' +
    '.fxp-guide{display:grid;gap:10px;margin:6px 0 4px}.fxp-guide div{display:flex;gap:14px;align-items:center;border:1px solid rgba(201,169,110,.25);border-radius:14px;padding:14px 16px;font:500 17px/1.4 "Plus Jakarta Sans",sans-serif}' +
    '.fxp-guide b{font:400 30px/1 "Bebas Neue",Sora,sans-serif;color:#e8d5a8;min-width:44px;text-align:center}' +
    '@media (max-width:640px){.fxp-dock{top:auto;bottom:150px;transform:none;right:8px}.fxp-dock button{width:40px;height:40px;font-size:18px}.fxp-h{font-size:22px}.fxp-card{padding:16px}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'style') e.style.cssText = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function overlay(card, onClose) {
    var ov = el('div', { 'class': 'fxp-ov', role: 'dialog', 'aria-modal': 'true' }, [card]);
    function close() { ov.remove(); document.removeEventListener('keydown', esc, true); onClose && onClose(); }
    function esc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    // keep keys typed in our dialogs away from the 3D controls
    ov.addEventListener('keydown', function (e) { if (e.key !== 'Escape') e.stopPropagation(); });
    document.addEventListener('keydown', esc, true);
    document.body.appendChild(ov);
    return close;
  }
  function toast(t) {
    var d = el('div', { 'class': 'fxp-toast' }, [t]); document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 3200);
  }
  var anyOpen = function () { return !!document.querySelector('.fxp-ov'); };

  /* ---------- 1. Mood / weather picker ---------- */
  var MOODS = [
    { id: 'auto', name: 'Live time', sub: 'Follows the real clock', icon: '🕰️', set: { time: 'auto', weather: 'clear' }, bg: 'linear-gradient(135deg,#1e3a6b,#0b1630)' },
    { id: 'summer', name: 'Summer', sub: 'Bright and clear', icon: '☀️', set: { time: 'day', weather: 'clear', season: 'summer' }, bg: 'linear-gradient(135deg,#3b8ad9,#f6c453)' },
    { id: 'monsoon', name: 'Monsoon rain', sub: 'Cosy and calm', icon: '🌧️', set: { time: 'day', weather: 'rain', season: 'summer' }, bg: 'linear-gradient(135deg,#334155,#64748b)' },
    { id: 'winter', name: 'Winter snow', sub: 'Quiet white streets', icon: '❄️', set: { time: 'dawn', weather: 'snow', season: 'winter' }, bg: 'linear-gradient(135deg,#9fb8d6,#e6eef8)' },
    { id: 'spring', name: 'Spring blossom', sub: 'Fresh and happy', icon: '🌸', set: { time: 'day', weather: 'clear', season: 'spring' }, bg: 'linear-gradient(135deg,#f29fc5,#7cc6a4)' },
    { id: 'sunset', name: 'Golden sunset', sub: 'Romantic glow', icon: '🌅', set: { time: 'sunset', weather: 'clear', season: 'summer' }, bg: 'linear-gradient(135deg,#ff7a59,#ffc27a)' },
    { id: 'neon', name: 'Neon night', sub: 'Party and lights', icon: '🌃', set: { time: 'night', weather: 'clear', season: 'autumn', vibe: 'neon' }, bg: 'linear-gradient(135deg,#2a0b4a,#0b6e8f)' },
    { id: 'storm', name: 'Rainy night', sub: 'Cinematic and moody', icon: '⛈️', set: { time: 'night', weather: 'rain', season: 'autumn' }, bg: 'linear-gradient(135deg,#0b1220,#1f2a44)' }
  ];
  function applyMood(m) {
    var s = S(); if (!s) return;
    var next = Object.assign({}, s.settings, m.set);
    if (!m.set.vibe) delete next.vibe;
    F().setState({ settings: next });
    LS.set('mood', m.id);
  }
  function openMood(then) {
    var grid = el('div', { 'class': 'fxp-grid' });
    var close;
    MOODS.forEach(function (m) {
      grid.appendChild(el('button', {
        'class': 'fxp-mood', style: 'background:' + m.bg,
        onclick: function () { applyMood(m); close(); }
      }, [el('span', { 'class': 'i' }, [m.icon]), m.name, el('small', null, [m.sub])]));
    });
    var card = el('div', { 'class': 'fxp-card' }, [
      el('div', { 'class': 'fxp-k' }, ['Welcome to Fyrus']),
      el('div', { 'class': 'fxp-h' }, ['How do you feel today?']),
      el('p', { 'class': 'fxp-p' }, ['Pick the weather for your visit. You can change it any time from the cloud button on the right.']),
      grid,
      el('div', { 'class': 'fxp-row' }, [el('button', { 'class': 'fxp-btn ghost', onclick: function () { close(); } }, ['Keep it as it is'])])
    ]);
    close = overlay(card, then);
  }

  /* ---------- 2. Visa-free Citizen ID card ---------- */
  function hash(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function idNumber(seed) {
    var a = hash(seed), b = hash(seed + '#2040');
    return 'FYR-2040-' + String(a % 10000).padStart(4, '0') + '-' + String(b % 10000).padStart(4, '0');
  }
  function me() {
    var s = S(); if (!s || !s.session) return null;
    return (s.users || []).find(function (u) { return u.id === s.session.userId; }) || null;
  }
  function shrinkPhoto(file, cb) {
    var r = new FileReader();
    r.onload = function () {
      var img = new Image();
      img.onload = function () {
        var size = 360, c = document.createElement('canvas'); c.width = size; c.height = Math.round(size * 1.25);
        var g = c.getContext('2d'), ar = img.width / img.height, tw = c.width, th = c.height;
        var sw, sh, sx, sy;
        if (ar > tw / th) { sh = img.height; sw = sh * tw / th; sx = (img.width - sw) / 2; sy = 0; }
        else { sw = img.width; sh = sw * th / tw; sx = 0; sy = (img.height - sh) / 4; }
        g.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
        cb(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { cb(null); };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  }
  function drawCard(canvas, d, done) {
    var W = 1012, H = 638; canvas.width = W; canvas.height = H;
    var g = canvas.getContext('2d');
    function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
    rr(0, 0, W, H, 34); g.save(); g.clip();
    var bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0a1838'); bg.addColorStop(.55, '#0f2a5c'); bg.addColorStop(1, '#081633'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    // guilloche pattern
    g.strokeStyle = 'rgba(120,180,255,.10)'; g.lineWidth = 1;
    for (var k = 0; k < 26; k++) { g.beginPath(); for (var x = 0; x <= W; x += 8) { var y = H / 2 + Math.sin(x / 46 + k * .5) * (60 + k * 9) * Math.cos(x / 230 + k); x === 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    // holo ring + orb (Fyrus brand)
    var cx = W - 150, cy = 150;
    var orb = g.createRadialGradient(cx, cy, 6, cx, cy, 90); orb.addColorStop(0, 'rgba(160,215,255,.95)'); orb.addColorStop(.35, 'rgba(77,163,255,.55)'); orb.addColorStop(1, 'rgba(77,163,255,0)');
    g.fillStyle = orb; g.beginPath(); g.arc(cx, cy, 90, 0, 7); g.fill();
    g.strokeStyle = '#ff9a3c'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, 58, 0, 7); g.stroke();
    // header
    g.fillStyle = '#c9a96e'; g.fillRect(0, 0, W, 10);
    g.fillStyle = '#ffffff'; g.font = '800 40px Sora, sans-serif'; g.fillText('REPUBLIC OF FYRUS', 48, 74);
    g.fillStyle = '#a8d8ff'; g.font = '600 20px "JetBrains Mono", monospace'; g.fillText('CITIZEN IDENTITY CARD · VISA-FREE ENTRY', 50, 108);
    // photo
    var px = 48, py = 150, pw = 230, ph = 288;
    rr(px - 4, py - 4, pw + 8, ph + 8, 18); g.fillStyle = 'rgba(255,255,255,.9)'; g.fill();
    function rest() {
      g.fillStyle = '#7f8ea8'; g.font = '600 17px "JetBrains Mono", monospace';
      var L = 320;
      function row(label, value, y, big) { g.fillStyle = '#7fa7d9'; g.font = '600 16px "JetBrains Mono", monospace'; g.fillText(label, L, y); g.fillStyle = '#fff'; g.font = (big ? '800 38px' : '700 26px') + ' Sora, sans-serif'; g.fillText(value, L, y + (big ? 42 : 32)); }
      row('NAME', (d.name || 'Citizen').slice(0, 22), 172, true);
      row('ID NUMBER', d.id, 262);
      row('STATUS', 'Free Entry · Citizen of 2040', 334);
      row('ISSUED', d.issued, 406);
      g.fillStyle = '#7fa7d9'; g.font = '600 16px "JetBrains Mono", monospace'; g.fillText('HOME CITY', 680, 406);
      g.fillStyle = '#fff'; g.font = '700 26px Sora, sans-serif'; g.fillText(d.city || 'Fyrus Core', 680, 438);
      // chip
      rr(48, 470, 86, 64, 10); var chip = g.createLinearGradient(48, 470, 134, 534); chip.addColorStop(0, '#f6d58a'); chip.addColorStop(1, '#b8892f'); g.fillStyle = chip; g.fill();
      g.strokeStyle = 'rgba(80,50,0,.5)'; g.lineWidth = 2; g.strokeRect(70, 482, 42, 40);
      // MRZ
      g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '600 22px "JetBrains Mono", monospace';
      var nm = (d.name || 'CITIZEN').toUpperCase().replace(/[^A-Z0-9]/g, '<');
      var l1 = ('IDFYR' + d.id.replace(/-/g, '') + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44);
      var l2 = (nm + '<<FREE<ENTRY<2040<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44);
      g.fillText(l1, 170, 552); g.fillText(l2, 170, 584);
      g.fillStyle = 'rgba(201,169,110,.95)'; g.fillRect(0, H - 10, W, 10);
      g.restore();
      done && done();
    }
    if (d.photo) {
      var im = new Image(); im.onload = function () { g.save(); rr(px, py, pw, ph, 14); g.clip(); g.drawImage(im, px, py, pw, ph); g.restore(); rest(); }; im.onerror = rest; im.src = d.photo;
    } else {
      g.save(); rr(px, py, pw, ph, 14); g.clip();
      var ag = g.createLinearGradient(px, py, px, py + ph); ag.addColorStop(0, d.color || '#4da3ff'); ag.addColorStop(1, '#0b1630'); g.fillStyle = ag; g.fillRect(px, py, pw, ph);
      g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.arc(px + pw / 2, py + 112, 52, 0, 7); g.fill();
      g.beginPath(); g.ellipse(px + pw / 2, py + ph + 10, 100, 110, 0, Math.PI, 0); g.fill();
      g.restore(); rest();
    }
  }
  function openIdFlow() {
    var u = me() || {}; var saved = LS.get('id', null);
    var data = saved || { name: u.name || '', photo: null, color: u.color, id: idNumber((u.id || 'guest') + ':' + Date.now()), issued: (function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); })(new Date()), city: (S() && S().district || 'Fyrus Core').split('·')[0].trim() };
    var canvas = el('canvas', { 'aria-label': 'Your Fyrus citizen ID card' });
    var nameIn = el('input', { 'class': 'fxp-in', maxlength: '22', placeholder: 'Your name', value: data.name || '' });
    var file = el('input', { type: 'file', accept: 'image/*', capture: 'user', style: 'display:none' });
    var redraw = function () { data.name = nameIn.value.trim() || 'Citizen'; drawCard(canvas, data); };
    nameIn.addEventListener('input', redraw);
    file.addEventListener('change', function () { if (file.files && file.files[0]) shrinkPhoto(file.files[0], function (p) { if (p) { data.photo = p; redraw(); } else toast('That photo could not be read. Try another one.'); }); });
    var close;
    var card = el('div', { 'class': 'fxp-card' }, [
      el('button', { 'class': 'fxp-x', 'aria-label': 'Close', onclick: function () { close(); } }, ['×']),
      el('div', { 'class': 'fxp-k' }, ['Free entry visa']),
      el('div', { 'class': 'fxp-h' }, [saved ? 'Your Fyrus ID card' : 'Get your Fyrus ID card']),
      el('p', { 'class': 'fxp-p' }, ['Entry to Fyrus is visa-free. Add any picture you like — a selfie, your avatar or a logo — and your citizen card is ready. Your picture stays on this device.']),
      el('div', { 'class': 'fxp-idwrap' }, [canvas]),
      el('label', { 'class': 'fxp-lab' }, ['Name on card']), nameIn, file,
      el('div', { 'class': 'fxp-row' }, [
        el('button', { 'class': 'fxp-btn ghost', onclick: function () { file.click(); } }, ['📷 Add picture']),
        el('button', { 'class': 'fxp-btn', onclick: function () { redraw(); LS.set('id', data); toast('Welcome, citizen ' + data.name + '!'); close(); } }, [saved ? 'Save' : 'Issue my card']),
        el('button', { 'class': 'fxp-btn ghost', onclick: function () { redraw(); var a = document.createElement('a'); a.download = 'fyrus-id-' + data.id + '.png'; a.href = canvas.toDataURL('image/png'); a.click(); } }, ['⬇ Download']),
        el('button', { 'class': 'fxp-btn ghost', onclick: function () { close(); try { F().setState({ nationTab: 'passport', hud: { open: true, tab: 'nation' } }); } catch (e) {} } }, ['Full passport →'])
      ])
    ]);
    close = overlay(card, function () { if (!LS.get('id', null)) LS.set('idAsked', true); });
    redraw();
  }

  /* ---------- 3. Museum of 2026 ---------- */
  var HALLS = [
    { id: 'tech', name: 'Pocket tech', items: [
      ['📱', 'The smartphone', '2007 – 2030s', 'A glass slab people looked at about 4 hours a day. Most of life — bank, maps, friends — lived inside it.'],
      ['🔌', 'Charging cables', '1990s – 2030s', 'Every home had a drawer full of tangled wires. USB-C finally made one plug for everything in 2024.'],
      ['🔑', 'Passwords and OTP codes', '1960s – 2030s', 'People had to remember secret words and type 6-digit codes sent by SMS just to log in.'],
      ['🎧', 'Wireless earbuds', '2016 – ', 'Tiny speakers worn in the ear all day. Often lost one at a time.'],
      ['🤖', 'The first AI chat assistants', '2022 – ', 'People typed questions into a box and an AI wrote back. The beginning of the AI age — and of Fyrus.'],
      ['🔳', 'QR codes', '1994 – ', 'Black-and-white squares that restaurants used instead of menus after 2020.']
    ]},
    { id: 'life', name: 'Everyday life', items: [
      ['⛽', 'Petrol cars', '1886 – 2030s', 'Cars burned fuel, made noise and smoke, and needed a petrol station visit every week.'],
      ['💵', 'Paper money and coins', '7th century BC – ', 'People carried printed paper in wallets. Shops gave change by hand.'],
      ['💳', 'Plastic bank cards', '1950 – 2030s', 'A small plastic card with a chip that you tapped or swiped to pay.'],
      ['📶', 'SIM cards', '1991 – 2030s', 'A tiny chip you had to put inside your phone to get a number.'],
      ['🚦', 'Traffic jams', 'forever?', 'Millions of people sat in cars for hours every day, waiting for lights to turn green.'],
      ['💡', 'Power cuts', '— ', 'In many countries electricity went off for hours. Families kept candles, UPS boxes and generators.']
    ]},
    { id: 'net', name: 'Internet culture', items: [
      ['🎬', 'Short videos and reels', '2016 – ', '15-second videos people scrolled for hours. Dances, recipes, jokes and news all mixed together.'],
      ['😂', 'Memes', '1990s – ', 'Funny pictures with text that spread around the world in a day.'],
      ['🎙️', 'Voice notes', '2013 – ', 'Instead of calling, people recorded little audio messages — sometimes 7 minutes long.'],
      ['⭐', 'Influencers', '2010s – ', 'People who earned money by showing their life online to millions of followers.'],
      ['📺', 'Streaming binge', '2013 – ', 'Watching a whole season of a show in one weekend.'],
      ['🕹️', 'Battle royale games', '2017 – ', '100 players dropped onto an island and only one survived. Fyrus Play City keeps the tradition alive.']
    ]},
    { id: 'world', name: 'The world in 2026', items: [
      ['🏠', 'Work from home', '2020 – ', 'After 2020 many offices emptied and people worked from their bedroom on video calls.'],
      ['🌡️', 'Hot summers', '— ', 'Heatwaves were in the news every year. Cities planted trees and painted roofs white.'],
      ['✈️', 'Paper boarding passes', '1950s – 2030s', 'Travellers printed tickets or showed a code. Fyrus citizens just fly.'],
      ['🛒', 'Online shopping boxes', '1994 – ', 'Parcels arrived at the door every day, wrapped in cardboard and tape.'],
      ['📚', 'Paper books', '1450s – ', 'Still loved in 2026. The Fyrus Library keeps them safe for 2040 readers.'],
      ['🪪', 'Plastic ID cards', '— ', 'People carried their identity in a wallet. In Fyrus you only need a picture.']
    ]}
  ];
  function openMuseum() {
    var tabs = el('div', { 'class': 'fxp-tabs', role: 'tablist' }), box = el('div', { 'class': 'fxp-ex' });
    function show(h) {
      Array.prototype.forEach.call(tabs.children, function (b) { b.classList.toggle('on', b.dataset.id === h.id); });
      box.innerHTML = '';
      h.items.forEach(function (it) { box.appendChild(el('div', { 'class': 'fxp-exc' }, [el('div', { 'class': 'e' }, [it[0]]), el('b', null, [it[1]]), el('i', null, [it[2]]), el('p', null, [it[3]])])); });
    }
    HALLS.forEach(function (h) { tabs.appendChild(el('button', { 'class': 'fxp-tab', 'data-id': h.id, role: 'tab', onclick: function () { show(h); } }, [h.name])); });
    var close;
    var card = el('div', { 'class': 'fxp-card wide' }, [
      el('button', { 'class': 'fxp-x', 'aria-label': 'Close', onclick: function () { close(); } }, ['×']),
      el('div', { 'class': 'fxp-k' }, ['Fyrus Museum · Hall of the Old World']),
      el('div', { 'class': 'fxp-h' }, ['Life in 2026']),
      el('p', { 'class': 'fxp-p' }, ['Welcome, visitor from the future. These are the everyday things people used in 2026 — many of them are already disappearing.']),
      tabs, box
    ]);
    close = overlay(card);
    show(HALLS[0]);
  }

  /* ---------- 3D helpers ---------- */
  function textSprite(T, lines, opt) {
    opt = opt || {};
    var c = document.createElement('canvas'); c.width = opt.w || 512; c.height = opt.h || 128;
    var g = c.getContext('2d');
    if (opt.bg) { g.fillStyle = opt.bg; g.fillRect(0, 0, c.width, c.height); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach(function (l, i) {
      g.font = l.font; g.fillStyle = l.color; g.shadowColor = l.glow || 'transparent'; g.shadowBlur = l.glow ? 18 : 0;
      g.fillText(l.text, c.width / 2, (i + 0.5) * c.height / lines.length);
    });
    var tex = new T.CanvasTexture(c); tex.anisotropy = 4;
    if (T.sRGBEncoding) tex.encoding = T.sRGBEncoding;
    return tex;
  }
  // Pick a chunk centre (roads run between chunks) that is clear of every fixed
  // landmark the city itself keeps free (W.blocked) and of the ring road.
  function freeSpot(W, rad) {
    var st = S(), blocked = [];
    try { blocked = W.blocked(st) || []; } catch (e) { blocked = W.colliders || []; }
    var cands = [];
    for (var cx = -5; cx <= 5; cx++) for (var cz = -5; cz <= 5; cz++) cands.push({ x: cx * 64, z: cz * 64 });
    cands.sort(function (a, b) { return Math.hypot(a.x, a.z - 36) - Math.hypot(b.x, b.z - 36); });
    for (var i = 0; i < cands.length; i++) {
      var p = cands[i], d0 = Math.hypot(p.x, p.z);
      if (d0 < 90 || Math.abs(d0 - 175) < rad + 10 || p.z < -300) continue;
      var ok = blocked.every(function (b) { return b.x == null || Math.hypot(b.x - p.x, b.z - p.z) > (b.r || 4) + rad; });
      if (ok) return p;
    }
    return null;
  }
  // Tell the city's home generator to keep the museum lot empty.
  function reserve(W, zone) {
    if (W.__fxpBlocked) return;
    var orig = W.blocked.bind(W);
    W.blocked = function (st) { return [zone].concat(orig(st)); };
    W.__fxpBlocked = true;
    if (W.sigs) W.sigs.blocked = ''; W.lastChunk = '';
  }

  var museum = null;
  function buildMuseum(W, T) {
    var p = freeSpot(W, 20); if (!p) return;
    try { reserve(W, { x: p.x, z: p.z, r: 22 }); } catch (e) {}
    var g = new T.Group(); g.name = 'fyrus-plus-museum';
    // face the capital centre
    var face = Math.atan2(0 - p.x, 36 - p.z);
    g.position.set(p.x, 0, p.z); g.rotation.y = face;
    var marble = new T.MeshStandardMaterial({ color: 0xe9e4da, roughness: .55, metalness: .05 });
    var glass = new T.MeshStandardMaterial({ color: 0x6fb6ff, roughness: .1, metalness: .6, transparent: true, opacity: .55, emissive: 0x1a4c88, emissiveIntensity: .6 });
    var gold = new T.MeshStandardMaterial({ color: 0xffc27a, roughness: .3, metalness: .8, emissive: 0xff9a3c, emissiveIntensity: .35 });
    function box(w, h, d, m, x, y, z) { var b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = b.receiveShadow = true; g.add(b); return b; }
    // podium and steps
    box(34, 1.2, 26, marble, 0, .6, 0);
    for (var s = 0; s < 3; s++) { var sh = .9 - s * .3; box(22, sh, 1.2, marble, 0, sh / 2, 13.6 + s * 1.2); }
    // main hall
    box(28, 9, 16, marble, 0, 5.7, -3);
    box(20, 7, .3, glass, 0, 4.7, 5.1);
    // columns
    var colG = new T.CylinderGeometry(.55, .65, 9, 18);
    for (var c = 0; c < 8; c++) { var cm = new T.Mesh(colG, marble); cm.position.set(-12.25 + c * 3.5, 5.7, 8.2); cm.castShadow = true; g.add(cm); }
    box(30, 1.2, 4, marble, 0, 10.8, 7.4); // entablature
    var ped = new T.Mesh(new T.CylinderGeometry(0, 16.5, 3.2, 4, 1), marble); ped.rotation.y = Math.PI / 4; ped.scale.set(1, 1, .14); ped.position.set(0, 13, 7.4); g.add(ped);
    // dome with glowing ring
    var dome = new T.Mesh(new T.SphereGeometry(7.5, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), glass); dome.position.set(0, 10.2, -4); g.add(dome);
    var ring = new T.Mesh(new T.TorusGeometry(7.7, .32, 12, 64), gold); ring.rotation.x = Math.PI / 2; ring.position.set(0, 10.4, -4); g.add(ring);
    var orbMat = new T.MeshBasicMaterial({ color: 0x9fd4ff });
    var orb = new T.Mesh(new T.SphereGeometry(1.2, 24, 16), orbMat); orb.position.set(0, 18.8, -4); g.add(orb);
    // sign
    var signTex = textSprite(T, [
      { text: 'MUSEUM OF 2026', font: '800 70px Sora, sans-serif', color: '#1b2333' },
      { text: 'Memory of the Old World', font: '600 34px "Plus Jakarta Sans", sans-serif', color: '#8a5a1f' }
    ], { w: 1024, h: 200 });
    var sign = new T.Mesh(new T.PlaneGeometry(14, 2.7), new T.MeshBasicMaterial({ map: signTex, transparent: true }));
    sign.position.set(0, 10.8, 9.45); g.add(sign);
    // floating exhibits
    var holo = new T.MeshStandardMaterial({ color: 0x4da3ff, emissive: 0x2f6fe0, emissiveIntensity: .9, metalness: .4, roughness: .3, transparent: true, opacity: .9 });
    var exhibits = [
      new T.Mesh(new T.BoxGeometry(.9, 1.8, .12), holo), // phone
      new T.Mesh(new T.TorusKnotGeometry(.5, .14, 64, 8), holo), // cable knot
      new T.Mesh(new T.BoxGeometry(1.6, .1, 1), holo), // card
      new T.Mesh(new T.IcosahedronGeometry(.8, 0), holo)
    ];
    exhibits.forEach(function (m, i) { m.position.set(-9 + i * 6, 2.8, 11.5); g.add(m); });
    W.world.add(g);
    // colliders (world space)
    var cos = Math.cos(face), sin = Math.sin(face);
    function toWorld(lx, lz) { return { x: p.x + lx * cos + lz * sin, z: p.z - lx * sin + lz * cos }; }
    [[-9, -3], [0, -3], [9, -3]].forEach(function (q) { var w = toWorld(q[0], q[1]); W.colliders.push({ x: w.x, z: w.z, r: 6.5, fyrusPlus: 1 }); });
    var door = toWorld(0, 14.5);
    W.staticInteracts.push({ pos: new T.Vector3(door.x, 0, door.z), radius: 6, label: 'Enter the Museum of 2026', action: 'museum', use: openMuseum });
    museum = { group: g, exhibits: exhibits, orb: orb, door: door, ring: ring };
    window.__fyrusPlus.museumAt = { x: p.x, z: p.z, door: door };
  }

  /* ---------- 4. Neon free plots with a little life ---------- */
  var DIST = [
    { code: 'CP', x: -124, z: 2, cols: 2, rows: 3, gap: 22, size: 14, color: '#ffc27a', id: 'capital' },
    { code: 'MC', x: 232, z: -214, cols: 4, rows: 5, gap: 20, size: 15, color: '#ff9a3c' },
    { code: 'TC', x: -272, z: -30, cols: 4, rows: 5, gap: 20, size: 15, color: '#4da3ff' },
    { code: 'CC', x: -212, z: 212, cols: 4, rows: 5, gap: 20, size: 15, color: '#c792ea' },
    { code: 'PC', x: 216, z: 216, cols: 4, rows: 5, gap: 20, size: 15, color: '#45e0ae' },
    { code: 'LC', x: -222, z: -212, cols: 4, rows: 5, gap: 20, size: 15, color: '#7fd1ff' },
    { code: 'FD', x: 0, z: 268, cols: 4, rows: 5, gap: 20, size: 15, color: '#e6d3a3' }
  ];
  function allPlots() {
    var out = [];
    DIST.forEach(function (d) {
      var n = 0;
      for (var i = 0; i < d.rows; i++) for (var s = 0; s < d.cols; s++) {
        n++;
        out.push({ id: d.code + '-' + String(n).padStart(2, '0'), x: d.x + (s - (d.cols - 1) / 2) * d.gap, z: d.z + (i - (d.rows - 1) / 2) * d.gap, size: d.size, color: d.color });
      }
    });
    return out;
  }
  var plotsFx = [];
  function buildPlots(W, T) {
    var edgeG = new T.BoxGeometry(1, .14, .14);
    var postG = new T.CylinderGeometry(.08, .08, 2.4, 6);
    var capG = new T.SphereGeometry(.22, 10, 8);
    var wireG = new T.BoxGeometry(1, 1, 1);
    var bodyG = new T.CapsuleGeometry ? new T.CapsuleGeometry(.22, .5, 4, 8) : new T.CylinderGeometry(.22, .22, .9, 8);
    var headG = new T.SphereGeometry(.17, 10, 8);
    var hatM = new T.MeshStandardMaterial({ color: 0xffc400, roughness: .5 });
    var vestM = new T.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0x4a1d00, roughness: .6 });
    var mastM = new T.MeshStandardMaterial({ color: 0xffb020, roughness: .5, metalness: .4 });
    var signTex = textSprite(T, [
      { text: 'FREE PLOT', font: '800 64px Sora, sans-serif', color: '#ffffff', glow: '#4da3ff' },
      { text: 'Claim it · build your dream', font: '600 30px Sora, sans-serif', color: '#ffd59a', glow: '#ff9a3c' }
    ], { w: 512, h: 160 });
    var signM = new T.SpriteMaterial({ map: signTex, transparent: true, depthWrite: false });
    var mats = {};
    allPlots().forEach(function (p, idx) {
      var col = new T.Color(p.color);
      var nm = mats[p.color] || (mats[p.color] = new T.MeshBasicMaterial({ color: col, toneMapped: false }));
      var wm = mats[p.color + 'w'] || (mats[p.color + 'w'] = new T.MeshBasicMaterial({ color: col, wireframe: true, transparent: true, opacity: .35, toneMapped: false }));
      var g = new T.Group(); g.position.set(p.x, 0, p.z); g.name = 'fyrus-plus-plot-' + p.id;
      var h = p.size / 2;
      [[0, -h, p.size, 0], [0, h, p.size, 0], [-h, 0, p.size, 1], [h, 0, p.size, 1]].forEach(function (e) {
        var m = new T.Mesh(edgeG, nm); m.scale.x = e[2]; m.position.set(e[3] ? e[0] : 0, .12, e[3] ? 0 : e[1]); if (e[3]) { m.rotation.y = Math.PI / 2; m.position.x = e[0]; } else m.position.z = e[1]; g.add(m);
      });
      [[-h, -h], [h, -h], [-h, h], [h, h]].forEach(function (c) {
        var post = new T.Mesh(postG, mastM); post.position.set(c[0], 1.2, c[1]); g.add(post);
        var cap = new T.Mesh(capG, nm); cap.position.set(c[0], 2.5, c[1]); g.add(cap);
      });
      // hologram of the future building, slowly "rising"
      var holo = new T.Mesh(wireG, wm); holo.scale.set(p.size * .45, 1, p.size * .45); holo.position.y = .5; g.add(holo);
      // tiny crane on every second plot
      var crane = null;
      if (idx % 2 === 0) {
        crane = new T.Group();
        var mast = new T.Mesh(new T.BoxGeometry(.4, 9, .4), mastM); mast.position.y = 4.5; crane.add(mast);
        var jib = new T.Mesh(new T.BoxGeometry(7, .3, .3), mastM); jib.position.set(2.5, 9, 0); crane.add(jib);
        var hook = new T.Mesh(new T.BoxGeometry(.6, .6, .6), nm); hook.position.set(5, 6, 0); crane.add(hook);
        crane.position.set(-h + 1.2, 0, -h + 1.2); g.add(crane);
      }
      // two workers walking around the site
      var workers = [0, 1].map(function (k) {
        var w = new T.Group(); var b = new T.Mesh(bodyG, vestM); b.position.y = .6; w.add(b);
        var hd = new T.Mesh(headG, hatM); hd.position.y = 1.2; w.add(hd); g.add(w); return w;
      });
      var sign = new T.Sprite(signM); sign.scale.set(7, 2.2, 1); sign.position.set(0, 4.2, h + .5); g.add(sign);
      W.world.add(g);
      plotsFx.push({ p: p, g: g, holo: holo, crane: crane, workers: workers, phase: idx * 1.7, h: h });
    });
  }
  // A plot counts as taken when the server says it is owned, or when the city
  // already shows a building on it (malls, showrooms, landmarks).
  function refreshOwned() {
    var s = S(), W = Wd(); if (!s || !W || !W.world || !W.player) return;
    var owned = Object.assign({}, s.plots || {}, s.sharedPlots || {});
    var pp = W.player.root.position, v = new window.THREE.Vector3(), pts = [];
    (function walk(o) {
      if ((o.name && o.name.indexOf('fyrus-plus') === 0) || o === W.player.root) return;
      if (o.isMesh) { o.getWorldPosition(v); if (v.y > 3 && Math.abs(v.x - pp.x) < 230 && Math.abs(v.z - pp.z) < 230) pts.push(v.x, v.z); }
      for (var i = 0; i < o.children.length; i++) walk(o.children[i]);
    })(W.world);
    plotsFx.forEach(function (f) {
      var built = false;
      if (Math.hypot(f.p.x - pp.x, f.p.z - pp.z) < 220) {
        var n = 0, r = f.h - 1;
        for (var i = 0; i < pts.length; i += 2) if (Math.abs(pts[i] - f.p.x) < r && Math.abs(pts[i + 1] - f.p.z) < r) n++;
        built = n >= 3;
      } else built = !!f.built;
      f.built = built;
      f.owned = !!owned[f.p.id] || built; if (f.owned) f.g.visible = false;
    });
  }
  function nearestFreePlot(pos) {
    var best = null, bd = 1e9;
    plotsFx.forEach(function (f) { if (f.owned) return; var d = Math.hypot(f.p.x - pos.x, f.p.z - pos.z); if (d < bd) { bd = d; best = f; } });
    return best && bd < best.h + 4 ? best : null;
  }

  /* ---------- 5. Cinematic frame + dock ---------- */
  var vig = el('div', { 'class': 'fxp-vig', 'aria-hidden': 'true' });
  function setCine(on) { document.body.classList.toggle('fxp-bars', !!on); LS.set('cine', !!on); }
  function teleport(x, z, lookX, lookZ) {
    var W = Wd(); if (!W || !W.player) return;
    W.player.root.position.set(x, W.player.root.position.y, z);
    if (lookX != null) W.yaw = Math.atan2(lookX - x, lookZ - z) + Math.PI;
    if (W.player.vel && W.player.vel.set) W.player.vel.set(0, 0, 0);
    W.player.target = null;
  }
  /* Easy mode: bigger text and buttons, a simple guide — for elders and first-time visitors */
  function setEasy(on, quiet) {
    var s = S(); if (!s) return;
    document.body.classList.toggle('fxp-easy', !!on);
    var prev = LS.get('easyPrevScale', null);
    if (on) { if (prev == null) LS.set('easyPrevScale', s.settings.hudScale || 1); F().setState({ settings: Object.assign({}, s.settings, { hudScale: 1.3 }) }); }
    else if (prev != null) { F().setState({ settings: Object.assign({}, s.settings, { hudScale: prev }) }); LS.set('easyPrevScale', null); }
    LS.set('easy', !!on);
    var b = document.querySelector('[data-fxp-easy]'); if (b) b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on && !quiet) openEasyGuide();
    else if (!on && !quiet) toast('Easy mode off');
  }
  function openEasyGuide() {
    var close;
    var card = el('div', { 'class': 'fxp-card' }, [
      el('button', { 'class': 'fxp-x', 'aria-label': 'Close', onclick: function () { close(); } }, ['×']),
      el('div', { 'class': 'fxp-k' }, ['Easy mode is on']),
      el('div', { 'class': 'fxp-h' }, ['Fyrus in four steps']),
      el('div', { 'class': 'fxp-guide' }, [
        el('div', null, [el('b', null, ['1']), 'To walk, use the arrow keys — or touch and drag on your phone.']),
        el('div', null, [el('b', null, ['2']), 'To talk to someone or open a door, walk close and press E (or tap the button).']),
        el('div', null, [el('b', null, ['3']), 'To go anywhere, press the 🔍 search at the top and pick a place.']),
        el('div', null, [el('b', null, ['4']), 'Lost? Press the ☰ menu. Everything is there. Nothing here costs real money.'])
      ]),
      el('div', { 'class': 'fxp-row' }, [
        el('button', { 'class': 'fxp-btn', onclick: function () { close(); } }, ['I understand']),
        el('button', { 'class': 'fxp-btn ghost', onclick: function () { close(); setEasy(false); } }, ['Turn easy mode off'])
      ])
    ]);
    close = overlay(card);
  }
  function buildDock() {
    var dock = el('nav', { 'class': 'fxp-dock', 'aria-label': 'Fyrus extras' }, [
      el('button', { onclick: function () { openMood(); }, 'aria-label': 'Change weather' }, ['🌦️', el('span', null, ['Weather & mood'])]),
      el('button', { onclick: openIdFlow, 'aria-label': 'My ID card' }, ['🪪', el('span', null, ['My Fyrus ID'])]),
      el('button', { onclick: function () { var m = window.__fyrusPlus.museumAt; if (m) { teleport(m.door.x, m.door.z, m.x, m.z); toast('You are at the Museum of 2026 — press E to enter'); } else openMuseum(); }, 'aria-label': 'Go to the museum' }, ['🏛️', el('span', null, ['Museum of 2026'])]),
      el('button', { onclick: function () { setCine(!document.body.classList.contains('fxp-bars')); }, 'aria-label': 'Cinematic view' }, ['🎬', el('span', null, ['Cinematic view'])]),
      el('button', { onclick: function () { setEasy(!document.body.classList.contains('fxp-easy')); }, 'aria-label': 'Easy mode — bigger text and buttons', 'aria-pressed': 'false', 'data-fxp-easy': '1' }, ['🅰️', el('span', null, ['Easy mode'])])
    ]);
    document.body.appendChild(vig);
    document.body.appendChild(dock);
    setCine(LS.get('cine', false));
    if (LS.get('easy', false)) setTimeout(function () { setEasy(true, true); }, 1500);
    var hideDock = function () { var s = S(); dock.style.display = (!s || !s.session || s.intro || (s.hud && s.hud.open) || s.activeGame || anyOpen()) ? 'none' : 'flex'; };
    setInterval(hideDock, 400); hideDock();
  }

  /* ---------- main loop ---------- */
  var plotInteract = null;
  function tick(t) {
    var W = Wd();
    if (W && W.world && museum) {
      museum.exhibits.forEach(function (m, i) { m.rotation.y = t / 1000 + i; m.position.y = 2.8 + Math.sin(t / 700 + i) * .35; });
      museum.orb.scale.setScalar(1 + Math.sin(t / 400) * .08);
    }
    if (W && W.player && plotsFx.length) {
      var pp = W.player.root.position;
      plotsFx.forEach(function (f) {
        if (f.owned) return;
        var d = Math.hypot(f.p.x - pp.x, f.p.z - pp.z);
        f.g.visible = d < 190; // draw only sites near the player
        if (d > 160) return; // and only animate the closest ones
        var k = (t / 1000 + f.phase);
        var hgt = 1 + ((k * .2) % 1) * f.p.size * .7;
        f.holo.scale.y = hgt; f.holo.position.y = hgt / 2;
        if (f.crane) f.crane.rotation.y = Math.sin(k * .4) * 1.2;
        f.workers.forEach(function (w, i) {
          var a = k * .6 + i * Math.PI, r = f.h * .65;
          w.position.set(Math.cos(a) * r, Math.abs(Math.sin(k * 6 + i)) * .06, Math.sin(a) * r);
          w.rotation.y = -a;
        });
      });
      // E-key interaction on the nearest free plot
      var near = nearestFreePlot(pp);
      if (near && (!plotInteract || plotInteract.id !== near.p.id)) {
        if (plotInteract) { var ix = W.staticInteracts.indexOf(plotInteract.obj); if (ix >= 0) W.staticInteracts.splice(ix, 1); }
        var obj = { pos: new window.THREE.Vector3(near.p.x, 0, near.p.z), radius: near.h + 4, label: 'Free plot ' + near.p.id + ' — claim it', action: 'land', use: function () { try { F().setState({ nationTab: 'land', landFocus: near.p.id, hud: { open: true, tab: 'nation' } }); } catch (e) {} } };
        W.staticInteracts.push(obj); plotInteract = { id: near.p.id, obj: obj };
      } else if (!near && plotInteract) {
        var j = W.staticInteracts.indexOf(plotInteract.obj); if (j >= 0) W.staticInteracts.splice(j, 1); plotInteract = null;
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- boot ---------- */
  var built = false, worldRef = null, entered = false;
  function build() {
    var W = Wd(), T = window.THREE; if (!W || !W.world || !T) return false;
    if (worldRef === W) return true;
    worldRef = W; museum = null; plotsFx = []; plotInteract = null;
    try { buildMuseum(W, T); } catch (e) { console.warn('[Fyrus+] museum', e); }
    try { buildPlots(W, T); refreshOwned(); } catch (e) { console.warn('[Fyrus+] plots', e); }
    return true;
  }
  function boot() {
    if (!F() || !F().getState) return;
    if (!built) { buildDock(); requestAnimationFrame(tick); setInterval(refreshOwned, 5000); built = true; }
    build();
    var s = S();
    if (!entered && s && s.session && !s.intro && !s.goalOpen && !anyOpen()) {
      entered = true;
      setTimeout(function () {
        var next = function () { openMood(function () { if (!LS.get('id', null) && !LS.get('idAsked', false)) setTimeout(openIdFlow, 400); }); };
        var world = window.__fyrusWorld;
        if (world && world.firstVisit && world.firstVisit()) world.playIntro(next); else next();
      }, 600);
    }
  }
  setInterval(boot, 700);
  // extra layers that are loaded on demand (keeps index.html untouched)
  ['/fyrus-arena.js?v=1.0.1'].forEach(function (src) {
    var sc = document.createElement('script'); sc.src = src; sc.defer = true; document.head.appendChild(sc);
  });
})();
