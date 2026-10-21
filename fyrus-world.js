/* Fyrus World — the "country" layer: cinematic Map of Fyrus intro, the Book of
   Fyrus (provinces, Great Houses, laws, calendar), province banners in the city,
   a mountain range around the land and a film colour grade.
   Loads after the main bundle and fyrus-plus.js; uses window.__fyrus / __fyrusW. */
(function () {
  'use strict';
  if (window.__fyrusWorld) return;
  var API = window.__fyrusWorld = { version: '1.0.0' };

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
  var css = '' +
    '.fxw-ov{position:fixed;inset:0;z-index:2147483100;background:#05070c;color:#f3ead7;font-family:"Plus Jakarta Sans",system-ui,sans-serif}' +
    '.fxw-ov canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fxw-title{position:absolute;left:0;right:0;bottom:8vh;text-align:center;pointer-events:none;padding:60px 16px 4vh;transition:opacity .6s;background:radial-gradient(ellipse at 50% 70%,rgba(8,5,2,.72),rgba(8,5,2,0) 70%)}' +
    '.fxw-title .k{font:600 12px/1 "JetBrains Mono",monospace;letter-spacing:.32em;color:#ffc27a;text-transform:uppercase}' +
    '.fxw-title .n{font:italic 700 clamp(34px,7vw,72px)/1.05 "Playfair Display",Georgia,serif;margin:10px 0 8px;text-shadow:0 4px 30px rgba(0,0,0,.8)}' +
    '.fxw-title .m{font:500 clamp(13px,2vw,17px)/1.4 "Plus Jakarta Sans",sans-serif;color:#d9cdb3;letter-spacing:.04em}' +
    '.fxw-skip{position:absolute;right:16px;bottom:16px;z-index:2;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:999px;padding:10px 16px;font:600 13px Sora,sans-serif;cursor:pointer}' +
    '.fxw-bars:before,.fxw-bars:after{content:"";position:absolute;left:0;right:0;height:8vh;background:#000;z-index:1;pointer-events:none}.fxw-bars:before{top:0}.fxw-bars:after{bottom:0}' +
    '.fxw-book{position:fixed;inset:0;z-index:2147483050;display:grid;place-items:center;background:rgba(4,6,10,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);padding:16px}' +
    '.fxw-page{width:min(1000px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:18px;padding:26px;color:#2b2113;background:linear-gradient(180deg,#f6ecd6,#eadbb8);box-shadow:0 30px 90px rgba(0,0,0,.55),inset 0 0 80px rgba(120,80,20,.25);font-family:"Plus Jakarta Sans",sans-serif}' +
    '.fxw-page h2{font:italic 700 40px/1.1 "Playfair Display",Georgia,serif;margin:4px 0 2px;color:#3a2610}' +
    '.fxw-page .sub{font:600 11px "JetBrains Mono",monospace;letter-spacing:.28em;text-transform:uppercase;color:#9a6a26}' +
    '.fxw-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:16px 0}' +
    '.fxw-tab{border:1px solid #b89a63;background:transparent;color:#5a3f17;border-radius:999px;padding:7px 13px;font:700 12px Sora,sans-serif;cursor:pointer}' +
    '.fxw-tab.on{background:#3a2610;color:#f6ecd6;border-color:#3a2610}' +
    '.fxw-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:14px}' +
    '.fxw-card{background:rgba(255,255,255,.45);border:1px solid rgba(120,80,20,.25);border-radius:14px;padding:14px;display:flex;gap:12px;align-items:flex-start}' +
    '.fxw-card img{width:84px;height:56px;border-radius:6px;box-shadow:0 3px 10px rgba(0,0,0,.25);flex:none}' +
    '.fxw-card b{font:700 16px Sora,sans-serif;display:block;color:#2b1d0b}.fxw-card i{font:italic 600 13px "Playfair Display",serif;color:#7a5320;display:block;margin:2px 0 6px}' +
    '.fxw-card p{margin:0;font-size:13px;line-height:1.5;color:#4a3a22}' +
    '.fxw-row{display:grid;grid-template-columns:90px 1fr;gap:12px;padding:12px 0;border-bottom:1px dashed rgba(120,80,20,.35)}' +
    '.fxw-row .y{font:italic 700 22px "Playfair Display",serif;color:#9a6a26}.fxw-row b{font:700 15px Sora,sans-serif}.fxw-row p{margin:4px 0 0;font-size:14px;line-height:1.5;color:#4a3a22}' +
    '.fxw-x{float:right;background:none;border:0;font-size:26px;color:#7a5320;cursor:pointer;line-height:1}' +
    '.fxw-btn{border:0;border-radius:12px;padding:10px 15px;font:700 13px Sora,sans-serif;cursor:pointer;background:#3a2610;color:#f6ecd6}' +
    '@media (max-width:640px){.fxw-page{padding:18px}.fxw-page h2{font-size:30px}.fxw-row{grid-template-columns:64px 1fr}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]); else if (k === 'style') e.style.cssText = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }

  /* ---------------- music for the intro (original, synthesised) ---------------- */
  function makeMusic() {
    var s = S(), set = (s && s.settings) || {};
    if (set.music === false) return null;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ctx; try { ctx = new AC(); } catch (e) { return null; }
    var vol = Math.max(0, Math.min(1, set.volume == null ? .8 : set.volume));
    var master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(.22 * vol, ctx.currentTime + 2.5);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.connect(master);
    // drone: D and A
    [73.42, 110, 146.83].forEach(function (f, i) {
      var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = (i - 1) * 7;
      g.gain.value = i === 2 ? .05 : .09; o.connect(g); g.connect(lp); o.start();
    });
    // slow original motif on a soft string-like voice (D minor)
    var notes = [293.66, 349.23, 440, 392, 349.23, 329.63, 293.66, 261.63, 293.66, 440, 466.16, 440];
    var t0 = ctx.currentTime + 1.2;
    notes.forEach(function (f, i) {
      var t = t0 + i * 1.25, o = ctx.createOscillator(), g = ctx.createGain(), f2 = ctx.createBiquadFilter();
      o.type = 'triangle'; o.frequency.value = f; f2.type = 'lowpass'; f2.frequency.value = 1800;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .25); g.gain.exponentialRampToValueAtTime(.001, t + 1.2);
      o.connect(f2); f2.connect(g); g.connect(master); o.start(t); o.stop(t + 1.3);
    });
    return {
      hit: function () { // timpani-like hit
        var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(48, t + .5);
        g.gain.setValueAtTime(.55 * vol, t); g.gain.exponentialRampToValueAtTime(.001, t + .9);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 1);
      },
      stop: function () { try { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + .8); setTimeout(function () { ctx.close(); }, 1000); } catch (e) {} }
    };
  }

  /* ---------------- Map of Fyrus (cinematic intro) ---------------- */
  var MAPW = 1500; // world units covered by the map (-750..750)
  // canvas top = north (+z); canvas left = +x, so the map reads upright from the south (-z) where the camera stands
  function toMap(x, z, size) { return [(MAPW / 2 - x) / MAPW * size, (MAPW / 2 - z) / MAPW * size]; }
  function mapTexture(T) {
    var N = 2048, c = document.createElement('canvas'); c.width = c.height = N; var g = c.getContext('2d');
    // parchment
    var bg = g.createRadialGradient(N / 2, N / 2, N * .1, N / 2, N / 2, N * .75); bg.addColorStop(0, '#e9d9b0'); bg.addColorStop(1, '#a98b55'); g.fillStyle = bg; g.fillRect(0, 0, N, N);
    for (var i = 0; i < 9000; i++) { g.fillStyle = 'rgba(80,50,10,' + (Math.random() * .05) + ')'; g.fillRect(Math.random() * N, Math.random() * N, 2, 2); }
    // sea in the south
    var seaY = toMap(0, -357, N)[1];
    g.fillStyle = 'rgba(46,110,140,.55)'; g.beginPath(); g.moveTo(0, seaY);
    for (var x = 0; x <= N; x += 32) g.lineTo(x, seaY + Math.sin(x / 90) * 14 + Math.sin(x / 31) * 5);
    g.lineTo(N, N); g.lineTo(0, N); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(30,70,90,.45)'; g.lineWidth = 2;
    for (var r = 1; r < 6; r++) { g.beginPath(); for (x = 0; x <= N; x += 32) { var yy = seaY + r * 26 + Math.sin(x / 70 + r) * 8; x === 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    // mountains (north and sides)
    g.fillStyle = '#7d6a4a'; g.strokeStyle = '#4a3a22'; g.lineWidth = 3;
    for (var a = 0; a < 70; a++) {
      var t = a / 70 * Math.PI * 2, rad = 640 + (a % 3) * 50, mx = Math.cos(t) * rad, mz = Math.sin(t) * rad;
      if (mz < -300) continue;
      var p = toMap(mx, mz, N), s = 34 + (a * 37 % 22);
      g.beginPath(); g.moveTo(p[0] - s, p[1] + s * .7); g.lineTo(p[0], p[1] - s); g.lineTo(p[0] + s, p[1] + s * .7); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#f4efe3'; g.beginPath(); g.moveTo(p[0] - s * .3, p[1] - s * .4); g.lineTo(p[0], p[1] - s); g.lineTo(p[0] + s * .3, p[1] - s * .4); g.closePath(); g.fill(); g.fillStyle = '#7d6a4a';
    }
    // ring road
    var c0 = toMap(0, 0, N); g.strokeStyle = 'rgba(90,60,20,.55)'; g.setLineDash([14, 10]); g.lineWidth = 5; g.beginPath(); g.arc(c0[0], c0[1], 175 / MAPW * N, 0, 7); g.stroke(); g.setLineDash([]);
    // provinces
    PROVINCES.forEach(function (p) {
      if (p.id === 'frostspine') return;
      var q = toMap(p.x, p.z, N), rr = (p.id === 'corona' ? 120 : 105) / MAPW * N;
      var gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr); gr.addColorStop(0, hexA(p.color, .45)); gr.addColorStop(1, hexA(p.color, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], rr, 0, 7); g.fill();
      g.strokeStyle = 'rgba(70,45,15,.6)'; g.setLineDash([6, 8]); g.lineWidth = 3; g.beginPath(); g.arc(q[0], q[1], rr * .82, 0, 7); g.stroke(); g.setLineDash([]);
    });
    // labels
    g.textAlign = 'center'; g.textBaseline = 'middle';
    PROVINCES.forEach(function (p) {
      var q = toMap(p.x, p.z, N), y = q[1] + (p.id === 'frostspine' ? -10 : 150);
      g.font = 'italic 700 58px "Playfair Display", Georgia, serif'; g.fillStyle = '#3a2610'; g.fillText(p.name, q[0], y);
      g.font = '600 24px "JetBrains Mono", monospace'; g.fillStyle = '#7a5320'; g.fillText(p.house.toUpperCase(), q[0], y + 44);
    });
    g.font = 'italic 700 120px "Playfair Display", Georgia, serif'; g.fillStyle = 'rgba(58,38,16,.85)'; g.fillText('Republic of Fyrus', N / 2, 110);
    // compass
    var cp = [N - 170, N - 230]; g.strokeStyle = '#3a2610'; g.lineWidth = 4; g.beginPath(); g.arc(cp[0], cp[1], 70, 0, 7); g.stroke();
    g.fillStyle = '#3a2610'; g.beginPath(); g.moveTo(cp[0], cp[1] - 95); g.lineTo(cp[0] + 18, cp[1]); g.lineTo(cp[0], cp[1] + 95); g.lineTo(cp[0] - 18, cp[1]); g.closePath(); g.fill();
    g.font = '700 36px "Playfair Display", serif'; g.fillText('N', cp[0], cp[1] - 125);
    // vignette
    var v = g.createRadialGradient(N / 2, N / 2, N * .35, N / 2, N / 2, N * .72); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,20,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, N, N);
    var tex = new T.CanvasTexture(c); tex.anisotropy = 8; if (T.sRGBEncoding) tex.encoding = T.sRGBEncoding; return tex;
  }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }

  function buildClockwork(T, p, brass, steel) {
    var g = new T.Group(), gears = [], towers = [];
    var gear = new T.Mesh(new T.CylinderGeometry(26, 26, 3, 32), brass); gear.position.y = 1.5; g.add(gear); gears.push(gear);
    for (var k = 0; k < 16; k++) { var tooth = new T.Mesh(new T.BoxGeometry(5, 3, 5), brass); var a = k / 16 * Math.PI * 2; tooth.position.set(Math.cos(a) * 27, 0, Math.sin(a) * 27); tooth.rotation.y = -a; gear.add(tooth); }
    var n = p.id === 'corona' ? 9 : 6, seed = p.name.length * 13;
    for (var i = 0; i < n; i++) {
      var r = i === 0 ? 0 : 9 + (i * 7 % 11), a2 = i * 2.4 + seed;
      var h = (i === 0 ? 46 : 18 + ((i * seed) % 24)) * (p.id === 'corona' ? 1.2 : 1);
      var w = i === 0 ? 7 : 4 + (i % 3);
      var geo = i % 3 === 1 ? new T.CylinderGeometry(w * .7, w, h, 10) : new T.BoxGeometry(w, h, w);
      var m = new T.Mesh(geo, i % 2 ? steel : brass);
      m.geometry.translate(0, h / 2, 0); m.position.set(Math.cos(a2) * r, 3, Math.sin(a2) * r); m.scale.y = .001; g.add(m); towers.push(m);
      var cap = new T.Mesh(new T.ConeGeometry(w * .8, h * .18, 8), brass); cap.position.y = h + h * .09; m.add(cap);
    }
    var small = new T.Mesh(new T.TorusGeometry(10, 1.2, 8, 24), steel); small.rotation.x = Math.PI / 2; small.position.set(30, 4, 14); g.add(small); gears.push(small);
    // banner sigil on a pole
    var flagTex = new T.CanvasTexture(flagCanvas(p, 256, 160)); if (T.sRGBEncoding) flagTex.encoding = T.sRGBEncoding;
    var pole = new T.Mesh(new T.CylinderGeometry(.5, .5, 30, 6), steel); pole.position.set(-20, 15, -12); g.add(pole);
    var flag = new T.Mesh(new T.PlaneGeometry(16, 10), new T.MeshBasicMaterial({ map: flagTex, side: T.DoubleSide })); flag.position.set(-12, 25, -12); g.add(flag);
    g.position.set(p.x, 0, p.z); g.scale.setScalar(p.id === 'frostspine' ? .001 : 1);
    return { group: g, gears: gears, towers: towers, flag: flag };
  }

  var playing = false;
  API.playIntro = function (done) {
    var T = window.THREE; if (!T || playing) { done && done(); return; }
    playing = true;
    var ov = el('div', { 'class': 'fxw-ov fxw-bars', role: 'dialog', 'aria-label': 'Map of Fyrus' });
    var canvas = el('canvas'); ov.appendChild(canvas);
    var title = el('div', { 'class': 'fxw-title', style: 'opacity:0' }, [el('div', { 'class': 'k' }), el('div', { 'class': 'n' }), el('div', { 'class': 'm' })]);
    var finished = false;
    var skip = el('button', { 'class': 'fxw-skip', onclick: function () { end(); } }, ['Skip ›']);
    ov.appendChild(title); ov.appendChild(skip); document.body.appendChild(ov);
    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true }); } catch (e) { ov.remove(); playing = false; done && done(); return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    var scene = new T.Scene(); scene.background = new T.Color('#0b0806'); scene.fog = new T.Fog('#0b0806', 900, 2200);
    var cam = new T.PerspectiveCamera(42, 1, 1, 4000);
    scene.add(new T.HemisphereLight(0xffe7c0, 0x2a1a08, .9));
    var sun = new T.DirectionalLight(0xffd9a0, 1.4); sun.position.set(-400, 600, 300); scene.add(sun);
    var map = new T.Mesh(new T.PlaneGeometry(MAPW, MAPW), new T.MeshStandardMaterial({ map: mapTexture(T), roughness: .95, metalness: 0 }));
    map.rotation.set(-Math.PI / 2, 0, Math.PI); scene.add(map);
    var brass = new T.MeshStandardMaterial({ color: 0xc8963e, metalness: .85, roughness: .32, emissive: 0x2a1600 });
    var steel = new T.MeshStandardMaterial({ color: 0x8ea2b8, metalness: .9, roughness: .28 });
    var cities = PROVINCES.map(function (p) { var c = buildClockwork(T, p, brass, steel); scene.add(c.group); return c; });
    // the Fyrus orb above Corona
    var orb = new T.Mesh(new T.SphereGeometry(9, 32, 20), new T.MeshBasicMaterial({ color: 0x9fd4ff })); orb.position.set(0, 80, 20); scene.add(orb);
    var ring = new T.Mesh(new T.TorusGeometry(15, 1.4, 12, 48), new T.MeshBasicMaterial({ color: 0xff9a3c })); ring.position.copy(orb.position); scene.add(ring);
    function size() { var w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }
    size(); window.addEventListener('resize', size);
    var music = makeMusic();
    // shot list: overview, each province, back out
    var order = ['corona', 'meridian', 'silica', 'lumen', 'arcadia', 'sage', 'harmony', 'azure', 'frostspine'];
    var shots = [{ pos: [0, 1300, -900], look: [0, 0, 60], dur: 3.2, title: null }];
    order.forEach(function (id) {
      var p = PROVINCES.filter(function (q) { return q.id === id; })[0];
      var far = p.id === 'frostspine';
      shots.push({ pos: [p.x + 45, far ? 300 : 130, p.z - (far ? 330 : 165)], look: [p.x, 10, p.z], dur: 2.6, p: p });
    });
    shots.push({ pos: [0, 1500, -1100], look: [0, 0, 40], dur: 3.2, title: 'end' });
    var total = shots.reduce(function (a, s) { return a + s.dur; }, 0);
    var t0 = performance.now(), lastShot = -1;
    var cur = new T.Vector3(), tgt = new T.Vector3();
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function showTitle(k, n, m) { title.children[0].textContent = k; title.children[1].textContent = n; title.children[2].textContent = m; title.style.opacity = '1'; }
    function frame(now) {
      if (finished) return;
      var t = (now - t0) / 1000;
      if (t >= total) { end(); return; }
      var acc = 0, i = 0; while (i < shots.length - 1 && acc + shots[i].dur <= t) { acc += shots[i].dur; i++; }
      var s = shots[i], prev = shots[Math.max(0, i - 1)], k = ease(Math.min(1, (t - acc) / Math.min(1.6, s.dur)));
      cur.set(prev.pos[0] + (s.pos[0] - prev.pos[0]) * k, prev.pos[1] + (s.pos[1] - prev.pos[1]) * k, prev.pos[2] + (s.pos[2] - prev.pos[2]) * k);
      tgt.set(prev.look[0] + (s.look[0] - prev.look[0]) * k, prev.look[1] + (s.look[1] - prev.look[1]) * k, prev.look[2] + (s.look[2] - prev.look[2]) * k);
      cam.position.copy(cur); cam.lookAt(tgt);
      if (i !== lastShot) {
        lastShot = i;
        if (s.p) { showTitle(s.p.title, s.p.name, s.p.house + ' · “' + s.p.motto + '”'); music && music.hit(); }
        else if (s.title === 'end') showTitle('Welcome, traveller', 'The Republic of Fyrus', 'Nine provinces. One open gate. Your story starts in Corona.');
        else showTitle('The year is 2040', 'Map of Fyrus', 'A country with no visa and no walls');
      }
      // cities rise when the camera reaches them
      cities.forEach(function (c, ci) {
        var id = PROVINCES[ci].id, idx = order.indexOf(id), start = 3.2 + idx * 2.6 - .4, rise = Math.max(0, Math.min(1, (t - start) / 1.6));
        if (id === 'frostspine') return;
        c.towers.forEach(function (m, mi) { var r = Math.max(.001, Math.min(1, rise * 1.4 - mi * .06)); m.scale.y = r; });
        c.gears.forEach(function (gm, gi) { gm.rotation.y += (gi ? -.03 : .012) * (rise > 0 && rise < 1 ? 3 : 1); });
        c.flag.rotation.y = Math.sin(t * 2 + ci) * .15;
      });
      ring.rotation.x = t * .6; ring.rotation.y = t * .4; orb.scale.setScalar(1 + Math.sin(t * 3) * .05);
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    function end() {
      if (finished) return; finished = true; playing = false;
      music && music.stop(); window.removeEventListener('resize', size);
      ov.style.transition = 'opacity .7s'; ov.style.opacity = '0';
      setTimeout(function () {
        try { scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { if (o.material.map) o.material.map.dispose(); o.material.dispose(); } }); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
        ov.remove(); LS.set('introSeen', true); done && done();
      }, 700);
    }
    ov.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') end(); });
    skip.focus();
    requestAnimationFrame(frame);
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
      tabs, body,
      el('div', { style: 'margin-top:18px' }, [el('button', { 'class': 'fxw-btn', onclick: function () { close(); API.playIntro(); } }, ['▶ Watch the Map of Fyrus'])])
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
    btn('🗺️', 'Map of Fyrus', function () { API.playIntro(); });
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
