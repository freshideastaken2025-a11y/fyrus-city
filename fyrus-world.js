/* Fyrus World — the "country" layer: cinematic Map of Fyrus intro, the Book of
   Fyrus (provinces, Great Houses, laws, calendar), province banners in the city,
   a mountain range around the land and a film colour grade.
   Loads after the main bundle and fyrus-plus.js; uses window.__fyrus / __fyrusW. */
(function () {
  'use strict';
  if (window.__fyrusWorld) return;
  var API = window.__fyrusWorld = { version: '2.0.0' };

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('fyrusWorld.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('fyrusWorld.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  var F = function () { return window.__fyrus; };
  var Wd = function () { return window.__fyrusW; };
  var S = function () { try { return F().getState(); } catch (e) { return null; } };

  /* ---------------- lore ---------------- */
  var PROVINCES = [
    { id: 'corona', name: 'Corona', title: 'The Crown Province', x: 0, z: 20, color: '#ffc27a', color2: '#2f6fe0', house: 'House Aurel', sigil: 'orb', motto: 'One Light, Many Voices',
      seat: 'Fyrus Core', role: 'Seat of Parliament, the Central Bank and the Citizen Center. Every visitor arrives here first.',
      story: 'Corona was the first square of light switched on in 2026. Founders raised the glowing orb above the plaza so that anyone, from anywhere, could find the way in.' },
    { id: 'meridian', name: 'Meridian', title: 'Province of Trade', x: 232, z: -214, color: '#ff9a3c', color2: '#1b2333', house: 'House Sable', sigil: 'scales', motto: 'Fair Trade, Open Gates',
      seat: 'Market City', role: 'Shops, brands, malls and the escrow market. Sellers from every country open stalls here.',
      story: 'Meridian grew from a single night market on the old harbour road. House Sable wrote the rule every trader still swears by: the buyer is protected until the goods arrive.' },
    { id: 'silica', name: 'Silica', title: 'Province of Makers', x: -272, z: -30, color: '#4da3ff', color2: '#0b1630', house: 'House Volt', sigil: 'bolt', motto: 'We Build Tomorrow',
      seat: 'Tech City', role: 'AI agents, startups, tools and labs. The engine room of the Republic.',
      story: 'Silica was built by the first AI engineers who came to Fyrus. Its towers never sleep; its windows glow blue through the night.' },
    { id: 'lumen', name: 'Lumen', title: 'Province of Creators', x: -212, z: 212, color: '#c792ea', color2: '#2a0b4a', house: 'House Iris', sigil: 'prism', motto: 'Make Something True',
      seat: 'Creator City', role: 'Studios, galleries, film sets, music halls and news channels.',
      story: 'Lumen is where Fyrus tells its stories. House Iris keeps the great gallery, where every citizen may hang one work for free.' },
    { id: 'arcadia', name: 'Arcadia', title: 'Province of Play', x: 216, z: 216, color: '#45e0ae', color2: '#06281d', house: 'House Jade', sigil: 'star', motto: 'Play Fair, Play Free',
      seat: 'Play City', role: 'Arcades, arenas, racing tracks, clubs and tournaments.',
      story: 'Arcadia hosts the Games of Fyrus every season. Here, and only here, battles are allowed — for sport, with no one truly hurt.' },
    { id: 'sage', name: 'Sage', title: 'Province of Learning', x: -222, z: -212, color: '#7fd1ff', color2: '#0b2a44', house: 'House Orrin', sigil: 'book', motto: 'Knowledge for All',
      seat: 'Learn City', role: 'Schools, colleges, the University of Fyrus, the Great Library and the Academy.',
      story: 'House Orrin promised that no child of Fyrus would ever pay to learn to read. The Great Library has kept that promise since the founding.' },
    { id: 'harmony', name: 'Harmony', title: 'Province of Faiths', x: 0, z: 268, color: '#e6d3a3', color2: '#3a2c12', house: 'House Calder', sigil: 'rings', motto: 'Every Faith Is Free Here',
      seat: 'Faith & Culture District', role: 'Mosques, churches, temples, gurdwaras and halls for every belief, side by side.',
      story: 'Harmony was laid out so that every house of worship faces the same garden. Festivals of all faiths are public holidays in Fyrus.' },
    { id: 'azure', name: 'The Azure Coast', title: 'Province of the Sea', x: 60, z: -330, color: '#2ec4c9', color2: '#03343a', house: 'House Maren', sigil: 'wave', motto: 'The Sea Remembers',
      seat: 'Vector Bay & the Marina', role: 'Beaches, the marina, yachts, the airport and the sea gate to the world.',
      story: 'Ships and planes from every country land on the Azure Coast. House Maren keeps the lighthouse that welcomes them home.' },
    { id: 'frostspine', name: 'The Frostspine', title: 'The Northern Mountains', x: 0, z: 640, color: '#e8f1ff', color2: '#22324d', house: 'House Varn', sigil: 'peak', motto: 'Hold the Heights',
      seat: 'The mountain passes', role: 'Snow peaks around the land: hiking, skiing, observatories and the old watchtowers.',
      story: 'The Frostspine ring the Republic like a crown of ice. Legend says the first founder climbed the tallest peak to choose where Corona would shine.' }
  ];
  var HISTORY = [
    ['2026', 'The First Light', 'The founders switch on a single plaza and a glowing orb. Anyone may enter, no visa, no fee. The Republic of Fyrus is born.'],
    ['2028', 'The Open Gates', 'Meridian opens the first escrow market. Traders from 40 countries sell in one place for the first time.'],
    ['2031', 'The Charter of Fyrus', 'Citizens vote on the Charter: free entry, free faith, free learning, and zero real crime.'],
    ['2034', 'The Seven Provinces', 'Corona, Meridian, Silica, Lumen, Arcadia, Sage and Harmony join as one nation. The Azure Coast and the Frostspine follow.'],
    ['2037', 'The Great Houses', 'Each province elects a Great House to care for it. Houses are chosen by vote every season — never by birth.'],
    ['2040', 'Today', 'You arrive. The Republic is still being built — and you can build a part of it.']
  ];
  var LAWS = [
    ['Free entry', 'Anyone may visit with only a picture for their ID card. No visa, no fee.'],
    ['Free faith', 'Every religion may build, pray and celebrate here. No one may mock another\'s faith.'],
    ['Free learning', 'Basic schooling, the library and the Academy are free for every citizen.'],
    ['Zero real crime', 'Theft, scams and harassment are banned. Battles and heists exist only as games in Arcadia.'],
    ['Fair trade', 'Money is held in escrow until the buyer receives what they paid for.'],
    ['One citizen, one vote', 'Every citizen votes for their Great House, the mayor and Parliament.'],
    ['Kindness to children and elders', 'Spaces for children are protected. Elders are guided and never rushed.']
  ];
  var CALENDAR = [
    ['1 Jan', 'Founders\' Light', 'The orb is relit at midnight; fireworks over Corona.'],
    ['Spring', 'Festival of Faiths', 'Every house of worship in Harmony opens its doors.'],
    ['Summer', 'The Games of Fyrus', 'Arcadia hosts races, arenas and the great tournament.'],
    ['Autumn', 'Market Moon', 'Meridian\'s biggest sale; stalls stay open all night.'],
    ['Winter', 'Frost Watch', 'Lanterns are carried up the Frostspine passes.'],
    ['Every season', 'House Elections', 'Citizens choose the Great House of each province.']
  ];

  /* ---------------- flags ---------------- */
  var flagCache = {};
  function drawSigil(g, kind, cx, cy, s, col) {
    g.save(); g.fillStyle = col; g.strokeStyle = col; g.lineWidth = s * .09; g.lineCap = 'round'; g.lineJoin = 'round';
    switch (kind) {
      case 'orb': g.beginPath(); g.arc(cx, cy, s * .32, 0, 7); g.fill(); g.lineWidth = s * .08; g.beginPath(); g.arc(cx, cy, s * .52, 0, 7); g.stroke(); break;
      case 'scales': g.beginPath(); g.moveTo(cx, cy - s * .55); g.lineTo(cx, cy + s * .5); g.moveTo(cx - s * .55, cy - s * .3); g.lineTo(cx + s * .55, cy - s * .3); g.moveTo(cx - s * .4, cy + s * .5); g.lineTo(cx + s * .4, cy + s * .5); g.stroke();
        [-1, 1].forEach(function (k) { g.beginPath(); g.arc(cx + k * s * .48, cy + s * .02, s * .2, 0, Math.PI); g.fill(); }); break;
      case 'bolt': g.beginPath(); g.moveTo(cx + s * .1, cy - s * .6); g.lineTo(cx - s * .35, cy + s * .08); g.lineTo(cx - s * .02, cy + s * .08); g.lineTo(cx - s * .12, cy + s * .6); g.lineTo(cx + s * .35, cy - s * .1); g.lineTo(cx + s * .02, cy - s * .1); g.closePath(); g.fill(); break;
      case 'prism': g.beginPath(); g.moveTo(cx, cy - s * .55); g.lineTo(cx + s * .5, cy + s * .4); g.lineTo(cx - s * .5, cy + s * .4); g.closePath(); g.stroke();
        g.globalAlpha = .9; ['#ff5f5f', '#ffd25f', '#5fd38a', '#5fb8ff'].forEach(function (c, i) { g.strokeStyle = c; g.lineWidth = s * .05; g.beginPath(); g.moveTo(cx + s * .15, cy); g.lineTo(cx + s * .7, cy - s * .15 + i * s * .1); g.stroke(); }); break;
      case 'star': g.beginPath(); for (var i = 0; i < 10; i++) { var r = i % 2 ? s * .24 : s * .58, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.fill(); break;
      case 'book': g.beginPath(); g.moveTo(cx, cy - s * .3); g.quadraticCurveTo(cx - s * .3, cy - s * .45, cx - s * .6, cy - s * .3); g.lineTo(cx - s * .6, cy + s * .4); g.quadraticCurveTo(cx - s * .3, cy + s * .25, cx, cy + s * .4); g.quadraticCurveTo(cx + s * .3, cy + s * .25, cx + s * .6, cy + s * .4); g.lineTo(cx + s * .6, cy - s * .3); g.quadraticCurveTo(cx + s * .3, cy - s * .45, cx, cy - s * .3); g.fill();
        g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(cx - s * .02, cy - s * .3, s * .04, s * .7); break;
      case 'rings': [-1, 0, 1].forEach(function (k) { g.beginPath(); g.arc(cx + k * s * .32, cy + (k === 0 ? -s * .18 : s * .12), s * .26, 0, 7); g.stroke(); }); break;
      case 'wave': for (var w = 0; w < 3; w++) { g.beginPath(); for (var x = -.6; x <= .6; x += .05) { var y = Math.sin(x * 9 + w) * .08 + (w - 1) * .26; x === -.6 ? g.moveTo(cx + x * s, cy + y * s) : g.lineTo(cx + x * s, cy + y * s); } g.stroke(); } break;
      case 'peak': g.beginPath(); g.moveTo(cx - s * .65, cy + s * .45); g.lineTo(cx - s * .15, cy - s * .45); g.lineTo(cx + s * .1, cy - s * .05); g.lineTo(cx + s * .3, cy - s * .3); g.lineTo(cx + s * .65, cy + s * .45); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.moveTo(cx - s * .15, cy - s * .45); g.lineTo(cx - s * .3, cy - s * .15); g.lineTo(cx - s * .05, cy - s * .2); g.closePath(); g.fill(); break;
    }
    g.restore();
  }
  function flagCanvas(p, w, h) {
    var key = p.id + w + 'x' + h; if (flagCache[key]) return flagCache[key];
    var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d');
    g.fillStyle = p.color2; g.fillRect(0, 0, w, h);
    g.fillStyle = p.color; g.fillRect(0, 0, w, h * .12); g.fillRect(0, h * .88, w, h * .12);
    var grd = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, h * .6); grd.addColorStop(0, 'rgba(255,255,255,.12)'); grd.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = grd; g.fillRect(0, 0, w, h);
    drawSigil(g, p.sigil, w / 2, h / 2, h * .55, p.color);
    flagCache[key] = c; return c;
  }

  /* ---------------- shared UI ---------------- */
  // Fyrus luxury system: midnight navy, champagne gold, ivory; site fonts only.
  var css = '' +
    '.fxw-book{position:fixed;inset:0;z-index:2147483050;display:grid;place-items:center;background:rgba(5,8,14,.72);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:16px;animation:fxwIn .4s ease}' +
    '@keyframes fxwIn{from{opacity:0}to{opacity:1}}' +
    '.fxw-page{position:relative;width:min(1040px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:20px;padding:34px 34px 28px;color:#f4efe6;background:linear-gradient(165deg,#111a2b 0%,#0a0f1a 60%,#0d1422 100%);border:1px solid rgba(201,169,110,.35);box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 1px 0 rgba(232,213,168,.12);font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
    '.fxw-page:before{content:"";position:absolute;inset:10px;border:1px solid rgba(201,169,110,.14);border-radius:14px;pointer-events:none}' +
    '.fxw-page h2{font:400 clamp(44px,6vw,68px)/.95 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;margin:10px 0 4px;background:linear-gradient(180deg,#f3e2b8,#c9a96e);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.fxw-page .sub{font:500 11px "JetBrains Mono",monospace;letter-spacing:.34em;text-transform:uppercase;color:#c9a96e}' +
    '.fxw-page .lead{color:#9aa3b2;font-size:14px;margin:0;max-width:60ch;line-height:1.6}' +
    '.fxw-tabs{display:flex;flex-wrap:wrap;gap:4px;margin:22px 0 18px;border-bottom:1px solid rgba(201,169,110,.2)}' +
    '.fxw-tab{border:0;border-bottom:2px solid transparent;background:transparent;color:#9aa3b2;padding:10px 14px;font:600 12px Sora,sans-serif;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;margin-bottom:-1px}' +
    '.fxw-tab:hover{color:#f4efe6}.fxw-tab.on{color:#e8d5a8;border-bottom-color:#c9a96e}' +
    '.fxw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}' +
    '.fxw-card{background:linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.01));border:1px solid rgba(201,169,110,.18);border-radius:14px;padding:16px;display:flex;gap:14px;align-items:flex-start;transition:border-color .2s}' +
    '.fxw-card:hover{border-color:rgba(201,169,110,.5)}' +
    '.fxw-card img{width:84px;height:56px;border-radius:4px;outline:1px solid rgba(201,169,110,.6);outline-offset:3px;flex:none}' +
    '.fxw-card b{font:600 16px Sora,sans-serif;display:block;color:#f4efe6;letter-spacing:.01em}' +
    '.fxw-card i{font:500 11px "JetBrains Mono",monospace;letter-spacing:.14em;text-transform:uppercase;font-style:normal;color:#c9a96e;display:block;margin:4px 0 8px}' +
    '.fxw-card p{margin:0;font-size:13px;line-height:1.6;color:#aab2c0}' +
    '.fxw-row{display:grid;grid-template-columns:96px 1fr;gap:16px;padding:14px 0;border-bottom:1px solid rgba(201,169,110,.12)}' +
    '.fxw-row .y{font:400 30px/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;color:#c9a96e}.fxw-row b{font:600 15px Sora,sans-serif;color:#f4efe6}.fxw-row p{margin:5px 0 0;font-size:14px;line-height:1.6;color:#aab2c0}' +
    '.fxw-x{position:absolute;top:18px;right:20px;background:none;border:1px solid rgba(201,169,110,.35);border-radius:999px;width:36px;height:36px;font-size:18px;color:#e8d5a8;cursor:pointer;line-height:1}' +
    '.fxw-btn{border:0;border-radius:999px;padding:12px 20px;font:600 12px Sora,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;background:linear-gradient(180deg,#e8d5a8,#c9a96e);color:#1a1408}' +
    '@media (max-width:640px){.fxw-page{padding:24px 18px}.fxw-row{grid-template-columns:64px 1fr}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else if (k === 'style') e.style.cssText = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  /* The opening film lives in fyrus-intro.js; this keeps the old entry point. */
  API.provinces = PROVINCES;
  API.flagCanvas = function (p, w, h) { return flagCanvas(p, w, h); };
  API.playIntro = function (done) {
    if (window.__fyrusIntro && window.__fyrusIntro.play) return window.__fyrusIntro.play(function (r) { LS.set('introSeen', true); done && done(r); });
    done && done();
  };
  API.firstVisit = function () { return !LS.get('introSeen', false); };

  /* ---------------- Book of Fyrus ---------------- */
  function flagImg(p) { var i = new Image(); i.src = flagCanvas(p, 168, 112).toDataURL(); i.alt = p.house + ' flag'; return i; }
  API.openBook = function (tab) {
    var tabs = el('div', { 'class': 'fxw-tabs', role: 'tablist' }), body = el('div');
    var views = {
      history: function () { HISTORY.forEach(function (h) { body.appendChild(el('div', { 'class': 'fxw-row' }, [el('div', { 'class': 'y' }, [h[0]]), el('div', null, [el('b', null, [h[1]]), el('p', null, [h[2]])])])); }); },
      provinces: function () { var gr = el('div', { 'class': 'fxw-grid' }); PROVINCES.forEach(function (p) { gr.appendChild(el('div', { 'class': 'fxw-card' }, [flagImg(p), el('div', null, [el('b', null, [p.name]), el('i', null, [p.title + ' · ' + p.seat]), el('p', null, [p.role])])])); }); body.appendChild(gr); },
      houses: function () { var gr = el('div', { 'class': 'fxw-grid' }); PROVINCES.forEach(function (p) { gr.appendChild(el('div', { 'class': 'fxw-card' }, [flagImg(p), el('div', null, [el('b', null, [p.house]), el('i', null, ['“' + p.motto + '” — ' + p.name]), el('p', null, [p.story])])])); }); body.appendChild(gr); },
      laws: function () { LAWS.forEach(function (l, i) { body.appendChild(el('div', { 'class': 'fxw-row' }, [el('div', { 'class': 'y' }, ['§' + (i + 1)]), el('div', null, [el('b', null, [l[0]]), el('p', null, [l[1]])])])); }); },
      calendar: function () { CALENDAR.forEach(function (c) { body.appendChild(el('div', { 'class': 'fxw-row' }, [el('div', { 'class': 'y', style: 'font-size:16px' }, [c[0]]), el('div', null, [el('b', null, [c[1]]), el('p', null, [c[2]])])])); }); }
    };
    var names = { history: 'History', provinces: 'Provinces', houses: 'Great Houses', laws: 'The Charter', calendar: 'Calendar' };
    function show(k) { Array.prototype.forEach.call(tabs.children, function (b) { b.classList.toggle('on', b.dataset.k === k); }); body.innerHTML = ''; views[k](); }
    Object.keys(names).forEach(function (k) { tabs.appendChild(el('button', { 'class': 'fxw-tab', 'data-k': k, role: 'tab', onclick: function () { show(k); } }, [names[k]])); });
    var wrap = el('div', { 'class': 'fxw-book', role: 'dialog', 'aria-modal': 'true' });
    function close() { wrap.remove(); document.removeEventListener('keydown', esc, true); }
    function esc(e) { if (e.key === 'Escape') { e.stopPropagation(); close(); } }
    var page = el('div', { 'class': 'fxw-page' }, [
      el('button', { 'class': 'fxw-x', 'aria-label': 'Close', onclick: close }, ['×']),
      el('div', { 'class': 'sub' }, ['Republic of Fyrus · Year 2040']),
      el('h2', null, ['The Book of Fyrus']),
      el('p', { 'class': 'lead' }, ['The history, provinces, Great Houses and laws of the Republic — everything a new citizen should know.']),
      tabs, body,
      el('div', { style: 'margin-top:18px' }, [el('button', { 'class': 'fxw-btn', onclick: function () { close(); API.playIntro(); } }, ['▶  Watch the opening film'])])
    ]);
    wrap.appendChild(page);
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    wrap.addEventListener('keydown', function (e) { if (e.key !== 'Escape') e.stopPropagation(); });
    document.addEventListener('keydown', esc, true);
    document.body.appendChild(wrap);
    show(tab || 'history');
  };

  /* ---------------- in-world: banners, mountains ---------------- */
  var flags = [], mountains = null, builtFor = null;
  function bannerSpots() {
    var spots = [];
    var grid = { meridian: [4, 5, 20], silica: [4, 5, 20], lumen: [4, 5, 20], arcadia: [4, 5, 20], sage: [4, 5, 20], harmony: [4, 5, 20] };
    PROVINCES.forEach(function (p) {
      if (p.id === 'frostspine') return;
      if (p.id === 'corona') { spots.push({ p: p, x: -16, z: 48 }, { p: p, x: 16, z: 48 }); return; }
      if (p.id === 'azure') { spots.push({ p: p, x: 40, z: -200 }, { p: p, x: -40, z: -200 }); return; }
      var gr = grid[p.id], half = gr[1] / 2 * gr[2] + 8;
      // gateway pair on the side of the district that faces the capital
      var side = p.z > 0 ? -1 : 1;
      spots.push({ p: p, x: p.x - 12, z: p.z + side * half }, { p: p, x: p.x + 12, z: p.z + side * half });
    });
    return spots;
  }
  function clearOf(W, x, z, r) {
    for (var i = 0; i < W.colliders.length; i++) { var c = W.colliders[i]; if (c.x != null && Math.hypot(c.x - x, c.z - z) < (c.r || 3) + r) return false; }
    return true;
  }
  function buildBanners(W, T) {
    var poleM = new T.MeshStandardMaterial({ color: 0x2a2f38, metalness: .8, roughness: .35 });
    var goldM = new T.MeshStandardMaterial({ color: 0xffc27a, metalness: .9, roughness: .25, emissive: 0x3a2000 });
    bannerSpots().forEach(function (sp) {
      var x = sp.x, z = sp.z, tries = 0;
      while (!clearOf(W, x, z, 1.5) && tries < 8) { x += (tries % 2 ? -1 : 1) * 4 * (tries + 1); tries++; }
      if (!clearOf(W, x, z, 1.5)) return;
      var g = new T.Group(); g.name = 'fyrus-world-banner'; g.position.set(x, 0, z);
      var pole = new T.Mesh(new T.CylinderGeometry(.22, .3, 14, 8), poleM); pole.position.y = 7; pole.castShadow = true; g.add(pole);
      var knob = new T.Mesh(new T.SphereGeometry(.45, 12, 8), goldM); knob.position.y = 14.3; g.add(knob);
      var tex = new T.CanvasTexture(flagCanvas(sp.p, 256, 384)); if (T.sRGBEncoding) tex.encoding = T.sRGBEncoding;
      var geo = new T.PlaneGeometry(3.2, 4.8, 12, 4);
      var cloth = new T.Mesh(geo, new T.MeshStandardMaterial({ map: tex, side: T.DoubleSide, roughness: .8 }));
      cloth.position.set(1.75, 10.9, 0); g.add(cloth);
      geo.userData.base = geo.attributes.position.array.slice();
      g.rotation.y = Math.atan2(-x, -z) + Math.PI / 2;
      W.world.add(g);
      W.colliders.push({ x: x, z: z, r: .6, fyrusWorld: 1 });
      flags.push({ cloth: cloth, phase: Math.random() * 6 });
    });
  }
  function buildMountains(W, T) {
    var group = new T.Group(); group.name = 'fyrus-world-mountains';
    var mat = new T.MeshLambertMaterial({ vertexColors: true, fog: false, flatShading: true });
    var count = 30;
    for (var i = 0; i < count; i++) {
      var a = i / count * Math.PI * 2, rad = 780 + (i * 53 % 110);
      var x = Math.cos(a) * rad, z = Math.sin(a) * rad;
      if (z < -330) continue; // leave the southern sea open
      var h = 110 + (i * 97 % 140), r = 150 + (i * 31 % 80);
      var geo = new T.ConeGeometry(r, h, 18, 6, true);
      var pos = geo.attributes.position, col = new Float32Array(pos.count * 3), v = new T.Vector3();
      for (var k = 0; k < pos.count; k++) {
        v.fromBufferAttribute(pos, k);
        var yN = (v.y + h / 2) / h; // 0 bottom .. 1 top
        var n = Math.sin(v.x * .05 + i) * Math.cos(v.z * .045 + i * 2) * .18 + Math.sin(v.x * .13 - v.z * .11) * .07;
        if (yN < .98) { v.x *= 1 + n; v.z *= 1 + n; v.y += n * h * .25 * (1 - yN); }
        pos.setXYZ(k, v.x, v.y, v.z);
        var snow = yN > .62 + n * .4, c = snow ? [.93, .95, 1] : yN < .25 ? [.30, .36, .30] : [.42 + n * .3, .45 + n * .3, .52 + n * .3];
        col[k * 3] = c[0]; col[k * 3 + 1] = c[1]; col[k * 3 + 2] = c[2];
      }
      geo.setAttribute('color', new T.BufferAttribute(col, 3)); geo.computeVertexNormals();
      var m = new T.Mesh(geo, mat); m.position.set(x, h / 2 - 12, z); m.rotation.y = i; group.add(m);
    }
    W.world.add(group);
    mountains = { group: group, mat: mat };
  }
  function hazeMountains(W) {
    if (!mountains) return;
    var fogC = (W.world.fog && W.world.fog.color) || (W.world.background && W.world.background.isColor && W.world.background);
    if (!fogC) return;
    var h = .42;
    mountains.mat.color.setRGB(1 - h, 1 - h, 1 - h);
    mountains.mat.emissive.setRGB(fogC.r * h, fogC.g * h, fogC.b * h);
  }

  /* ---------------- dock buttons + loop ---------------- */
  function addDock() {
    var dock = document.querySelector('.fxp-dock'); if (!dock || dock.querySelector('[data-fxw]')) return !!dock;
    function btn(icon, label, fn) { var b = el('button', { 'aria-label': label, 'data-fxw': '1', onclick: fn }, [icon, el('span', null, [label])]); dock.insertBefore(b, dock.firstChild); }
    btn('📖', 'Book of Fyrus', function () { API.openBook(); });
    btn('🎬', 'Opening film', function () { API.playIntro(); });
    return true;
  }
  function tick(t) {
    var W = Wd();
    if (W && W.world && flags.length) {
      var pp = W.player && W.player.root.position;
      flags.forEach(function (f) {
        if (pp && Math.hypot(f.cloth.parent.position.x - pp.x, f.cloth.parent.position.z - pp.z) > 160) return;
        var a = f.cloth.geometry.attributes.position, base = f.cloth.geometry.userData.base;
        for (var i = 0; i < a.count; i++) { var x = base[i * 3] + 1.6, y = base[i * 3 + 1]; a.array[i * 3 + 2] = Math.sin(x * 1.6 - t / 260 + f.phase) * .22 * (x / 3.2) + Math.cos(y * 2 + t / 400) * .05 * (x / 3.2); }
        a.needsUpdate = true;
      });
    }
    requestAnimationFrame(tick);
  }
  function build() {
    var W = Wd(), T = window.THREE; if (!W || !W.world || !T || builtFor === W) return;
    builtFor = W; flags = []; mountains = null;
    try { buildMountains(W, T); } catch (e) { console.warn('[Fyrus World] mountains', e); }
    try { buildBanners(W, T); } catch (e) { console.warn('[Fyrus World] banners', e); }
    hazeMountains(W);
  }
  var started = false;
  function boot() {
    if (!F() || !F().getState) return;
    build(); addDock();
    var W = Wd(); if (W) hazeMountains(W);
    if (!started) { started = true; requestAnimationFrame(tick); }
    // film colour grade while the cinematic view is on
    var cv = W && W.renderer && W.renderer.domElement;
    if (cv) { var want = document.body.classList.contains('fxp-bars') ? 'contrast(1.07) saturate(1.14) brightness(1.02)' : ''; if (cv.style.filter !== want) cv.style.filter = want; }
  }
  setInterval(boot, 800);
})();
