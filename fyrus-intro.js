/* Fyrus — opening film ("the hook").
   0s   darkness, a heartbeat, one point of light
   3s   the light bursts and draws the map of the Republic in gold
   6s   FYRUS title
   9s   nine provinces, each with its own architecture, assembling as the camera glides past
   end  the whole country lit up + "Population: You." with Enter / Read the Book
   Design system: midnight navy, champagne gold, ivory, Fyrus blue accent;
   fonts are the site's own (Bebas Neue, Sora, Plus Jakarta Sans, JetBrains Mono). */
(function () {
  'use strict';
  if (window.__fyrusIntro) return;
  var INTRO = window.__fyrusIntro = { version: '2.0.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8', IVORY = '#f4efe6', NAVY = '#0a0f1a';

  var css = '' +
    '.fxi{position:fixed;inset:0;z-index:2147483100;background:#05080f;color:' + IVORY + ';font-family:"Plus Jakarta Sans",system-ui,sans-serif;overflow:hidden}' +
    '.fxi canvas{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.fxi-grain{position:absolute;inset:0;pointer-events:none;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27160%27 height=%27160%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%27.9%27 numOctaves=%272%27/></filter><rect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/></svg>")}' +
    '.fxi-vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(2,4,8,.75) 100%)}' +
    '.fxi-bar{position:absolute;left:0;right:0;height:0;background:#000;z-index:3;transition:height 1.2s cubic-bezier(.7,0,.2,1)}.fxi-bar.t{top:0}.fxi-bar.b{bottom:0}' +
    '.fxi.letterbox .fxi-bar{height:7.5vh}' +
    '.fxi-center{position:absolute;inset:0;display:grid;place-items:center;text-align:center;pointer-events:none;z-index:4;padding:0 16px;background:radial-gradient(ellipse 65% 40% at 50% 50%,rgba(5,8,15,.78),rgba(5,8,15,0) 100%)}' +
    '.fxi-kicker{font:500 11px "JetBrains Mono",monospace;letter-spacing:.5em;text-transform:uppercase;color:' + GOLD + ';opacity:0;transition:opacity 1.2s}' +
    '.fxi-logo{font:400 clamp(72px,17vw,220px)/.85 "Bebas Neue",Sora,sans-serif;letter-spacing:.9em;margin-right:-.9em;opacity:0;background:linear-gradient(180deg,#fbf1d6 0%,' + GOLD_HI + ' 40%,' + GOLD + ' 75%,#8a6a35 100%);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 40px rgba(201,169,110,.25));transition:letter-spacing 3.2s cubic-bezier(.16,1,.3,1),margin 3.2s cubic-bezier(.16,1,.3,1),opacity 1.4s}' +
    '.fxi-logo.on{letter-spacing:.14em;margin-right:-.14em;opacity:1}' +
    '.fxi-line{width:0;height:1px;margin:18px auto;background:linear-gradient(90deg,transparent,' + GOLD + ',transparent);transition:width 2.4s cubic-bezier(.16,1,.3,1)}' +
    '.fxi-line.on{width:min(420px,70vw)}' +
    '.fxi-tag{font:300 clamp(14px,2vw,19px)/1.5 Sora,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:' + IVORY + ';opacity:0;transition:opacity 1.6s .6s}' +
    '.fxi-lower{position:absolute;left:clamp(20px,6vw,90px);bottom:calc(7.5vh + clamp(24px,6vh,70px));z-index:4;pointer-events:none;max-width:min(640px,86vw)}' +
    '.fxi-shade{position:absolute;left:0;right:0;bottom:0;height:55%;z-index:3;pointer-events:none;background:linear-gradient(0deg,rgba(5,8,15,.85),rgba(5,8,15,0))}' +
    '.fxi-lower .rule{width:56px;height:1px;background:' + GOLD + ';margin-bottom:16px;transform-origin:left;transform:scaleX(0);transition:transform .9s cubic-bezier(.16,1,.3,1)}' +
    '.fxi-lower .num{font:500 11px "JetBrains Mono",monospace;letter-spacing:.42em;text-transform:uppercase;color:' + GOLD + '}' +
    '.fxi-lower .name{font:400 clamp(56px,10vw,128px)/.9 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;margin:8px 0 6px;color:' + IVORY + ';text-shadow:0 6px 40px rgba(0,0,0,.6)}' +
    '.fxi-lower .house{font:600 13px Sora,sans-serif;letter-spacing:.24em;text-transform:uppercase;color:' + GOLD_HI + '}' +
    '.fxi-lower .motto{font:300 clamp(14px,1.8vw,18px)/1.5 Sora,sans-serif;color:#c3c9d4;margin-top:6px}' +
    '.fxi-lower .w{display:inline-block;white-space:pre;opacity:0;transform:translateY(14px);transition:opacity .7s,transform .9s cubic-bezier(.16,1,.3,1)}' +
    '.fxi-lower.on .rule{transform:scaleX(1)}.fxi-lower.on .w{opacity:1;transform:none}' +
    '.fxi-end{position:absolute;inset:0;z-index:5;display:grid;place-items:center;text-align:center;padding:0 16px;opacity:0;pointer-events:none;transition:opacity 1.4s;background:radial-gradient(ellipse 70% 55% at 50% 50%,rgba(5,8,15,.92) 0%,rgba(5,8,15,.7) 55%,rgba(5,8,15,.15) 100%)}' +
    '.fxi-end.on{opacity:1;pointer-events:auto}' +
    '.fxi-end .big{font:400 clamp(60px,12vw,150px)/.9 "Bebas Neue",Sora,sans-serif;letter-spacing:.08em;background:linear-gradient(180deg,#fbf1d6,' + GOLD + ');-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.fxi-end .small{font:300 clamp(14px,2vw,18px)/1.6 Sora,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#c3c9d4;margin:14px 0 30px}' +
    '.fxi-cta{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}' +
    '.fxi-btn{border-radius:999px;padding:15px 30px;font:600 13px Sora,sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;transition:transform .2s,box-shadow .2s}' +
    '.fxi-btn.gold{border:0;background:linear-gradient(180deg,#f0dfb4,' + GOLD + ');color:#1a1408;box-shadow:0 10px 40px rgba(201,169,110,.35)}' +
    '.fxi-btn.gold:hover{transform:translateY(-2px);box-shadow:0 16px 50px rgba(201,169,110,.5)}' +
    '.fxi-btn.ghost{background:rgba(10,15,26,.4);border:1px solid rgba(201,169,110,.55);color:' + GOLD_HI + '}' +
    '.fxi-skip{position:absolute;right:18px;top:calc(7.5vh + 14px);z-index:6;background:rgba(5,8,15,.4);border:1px solid rgba(201,169,110,.4);color:' + GOLD_HI + ';border-radius:999px;padding:9px 16px;font:600 11px Sora,sans-serif;letter-spacing:.2em;text-transform:uppercase;cursor:pointer}' +
    '.fxi-sound{position:absolute;left:18px;top:calc(7.5vh + 14px);z-index:6;background:none;border:0;color:#9aa3b2;font:500 10px "JetBrains Mono",monospace;letter-spacing:.3em;text-transform:uppercase;cursor:pointer}' +
    '@media (prefers-reduced-motion:reduce){.fxi-logo,.fxi-line,.fxi-lower .w,.fxi-lower .rule{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, cls, kids) { var e = document.createElement(tag); if (cls) e.className = cls; (kids || []).forEach(function (k) { e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k); }); return e; }
  function words(text) { var f = document.createDocumentFragment(); text.split(' ').forEach(function (w, i) { var s = el('span', 'w', [w + ' ']); s.style.transitionDelay = (i * 60) + 'ms'; f.appendChild(s); }); return f; }

  /* ------------------------------------------------------------ score */
  function Score(enabled, vol) {
    var AC = window.AudioContext || window.webkitAudioContext, ctx = null;
    if (enabled && AC) try { ctx = new AC(); } catch (e) { ctx = null; }
    var self = { on: !!ctx };
    if (!ctx) { self.at = self.hit = self.boom = self.stop = function () {}; return self; }
    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    var out = ctx.createGain(); out.gain.value = .9 * vol; out.connect(ctx.destination);
    var comp = ctx.createDynamicsCompressor(); comp.connect(out);
    // simple stereo-ish reverb from decaying noise
    var rev = ctx.createConvolver(), len = ctx.sampleRate * 3.2, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    rev.buffer = ir; var revG = ctx.createGain(); revG.gain.value = .55; rev.connect(revG); revG.connect(comp);
    function bus(dry) { var g = ctx.createGain(); g.gain.value = 1; g.connect(comp); var s = ctx.createGain(); s.gain.value = dry; g.connect(s); s.connect(rev); return g; }
    var T0 = ctx.currentTime + .1;
    function thump(t, f, v) { var o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .45, t + .35); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0008, t + .6); o.connect(g); g.connect(bus(.2)); o.start(t); o.stop(t + .7); }
    function noise(t, dur, from, to, v, q) {
      var b = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate), dd = b.getChannelData(0); for (var k = 0; k < dd.length; k++) dd[k] = Math.random() * 2 - 1;
      var s = ctx.createBufferSource(); s.buffer = b; var f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = q || 2; f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
      var g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + dur * .85); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      s.connect(f); f.connect(g); g.connect(bus(.5)); s.start(t); s.stop(t + dur);
    }
    function pad(t, freqs, dur, v) {
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(380, t); f.frequency.linearRampToValueAtTime(1500, t + dur * .6); f.Q.value = .7;
      var g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(v, t + 1.2); g.gain.setValueAtTime(v, t + dur - 1); g.gain.linearRampToValueAtTime(.0001, t + dur + .8);
      f.connect(g); g.connect(bus(.7));
      freqs.forEach(function (fr) { [-6, 6].forEach(function (dt) { var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = fr; o.detune.value = dt; o.connect(f); o.start(t); o.stop(t + dur + 1); }); });
    }
    function pluck(t, fr, v) { var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = fr; g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0005, t + .9); o.connect(g); g.connect(bus(.6)); o.start(t); o.stop(t + 1); }
    // heartbeat in the dark
    [.3, .62, 1.8, 2.12].forEach(function (x, i) { thump(T0 + x, i % 2 ? 48 : 58, .55); });
    noise(T0 + .6, 2.4, 300, 6000, .16, 1.5); // riser into the light
    // progression (original): Dm – Bb – F – C – Dm – Gm – Bb – A
    var chords = [[146.83, 220, 293.66, 349.23], [116.54, 233.08, 293.66, 349.23], [174.61, 220, 261.63, 349.23], [130.81, 196, 261.63, 329.63], [146.83, 220, 293.66, 349.23], [196, 233.08, 293.66, 392], [116.54, 233.08, 293.66, 349.23], [110, 220, 277.18, 329.63]];
    chords.forEach(function (c, i) {
      var t = T0 + 3 + i * 3.2; pad(t, c, 3.2, .028);
      for (var k = 0; k < 8; k++) pluck(t + k * .4, c[(k * 2 + i) % 4] * 2, k % 4 === 0 ? .05 : .03);
    });
    self.boom = function () { var t = ctx.currentTime; thump(t, 62, .9); noise(t, 1.6, 4000, 200, .2, .8); };
    self.hit = function () { var t = ctx.currentTime; thump(t, 92, .45); noise(t, .5, 2500, 900, .05, 4); };
    self.stop = function () { try { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setValueAtTime(out.gain.value, ctx.currentTime); out.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.4); setTimeout(function () { ctx.close(); }, 1600); } catch (e) {} };
    self.mute = function (m) { out.gain.setTargetAtTime(m ? 0 : .9 * vol, ctx.currentTime, .1); };
    return self;
  }

  /* ------------------------------------------------------------ map */
  var MAPW = 1500;
  function toMap(x, z, N) { return [(MAPW / 2 - x) / MAPW * N, (MAPW / 2 - z) / MAPW * N]; }
  function rgba(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function mapCanvas(provs) {
    var N = 2048, c = document.createElement('canvas'); c.width = c.height = N; var g = c.getContext('2d');
    g.fillStyle = '#0b1322'; g.fillRect(0, 0, N, N);
    // fine survey grid
    g.strokeStyle = 'rgba(201,169,110,.06)'; g.lineWidth = 1;
    for (var x = 0; x <= N; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, N); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(N, x); g.stroke(); }
    g.strokeStyle = 'rgba(201,169,110,.12)';
    for (x = 0; x <= N; x += 256) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, N); g.stroke(); g.beginPath(); g.moveTo(0, x); g.lineTo(N, x); g.stroke(); }
    // sea (south) as dot field, coastline as glowing line
    var seaY = toMap(0, -357, N)[1];
    g.fillStyle = 'rgba(77,163,255,.18)';
    for (var yy = seaY + 18; yy < N; yy += 14) for (var xx = (yy / 14 % 2) * 7; xx < N; xx += 14) g.fillRect(xx, yy, 2, 2);
    g.shadowColor = 'rgba(77,163,255,.9)'; g.shadowBlur = 14; g.strokeStyle = 'rgba(140,200,255,.85)'; g.lineWidth = 3;
    g.beginPath(); for (x = 0; x <= N; x += 16) { var y = seaY + Math.sin(x / 120) * 18 + Math.sin(x / 37) * 6; x === 0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    g.shadowBlur = 0;
    // mountain hatching (north + sides)
    g.strokeStyle = 'rgba(232,213,168,.55)'; g.lineWidth = 2;
    for (var a = 0; a < 90; a++) {
      var t = a / 90 * Math.PI * 2, rad = 660 + (a % 4) * 28, mx = Math.cos(t) * rad, mz = Math.sin(t) * rad;
      if (mz < -300) continue;
      var p = toMap(mx, mz, N), s = 22 + (a * 37 % 16);
      g.beginPath(); g.moveTo(p[0] - s, p[1] + s * .6); g.lineTo(p[0], p[1] - s * .7); g.lineTo(p[0] + s, p[1] + s * .6); g.stroke();
      g.beginPath(); g.moveTo(p[0] - s * .2, p[1] - s * .3); g.lineTo(p[0], p[1] - s * .7); g.stroke();
    }
    // ring road + avenues
    var c0 = toMap(0, 0, N);
    g.strokeStyle = 'rgba(201,169,110,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(c0[0], c0[1], 175 / MAPW * N, 0, 7); g.stroke();
    g.lineWidth = 1.5; g.strokeStyle = 'rgba(201,169,110,.3)';
    provs.forEach(function (pv) { if (pv.id === 'corona' || pv.id === 'frostspine') return; var q = toMap(pv.x, pv.z, N); g.beginPath(); g.moveTo(c0[0], c0[1]); g.lineTo(q[0], q[1]); g.stroke(); });
    // provinces: gold hairline rings + soft colour wash + label
    g.textAlign = 'center'; g.textBaseline = 'middle';
    provs.forEach(function (pv, i) {
      if (pv.id === 'frostspine') return;
      var q = toMap(pv.x, pv.z, N), rr = (pv.id === 'corona' ? 118 : 100) / MAPW * N;
      var gr = g.createRadialGradient(q[0], q[1], 0, q[0], q[1], rr); gr.addColorStop(0, rgba(pv.color, .22)); gr.addColorStop(1, rgba(pv.color, 0));
      g.fillStyle = gr; g.beginPath(); g.arc(q[0], q[1], rr, 0, 7); g.fill();
      g.strokeStyle = 'rgba(232,213,168,.7)'; g.lineWidth = 2; g.beginPath(); g.arc(q[0], q[1], rr * .8, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(232,213,168,.25)'; g.lineWidth = 1; g.beginPath(); g.arc(q[0], q[1], rr * .86, 0, 7); g.stroke();
      for (var k = 0; k < 24; k++) { var ang = k / 24 * Math.PI * 2, r1 = rr * .8, r2 = rr * (k % 6 ? .83 : .88); g.beginPath(); g.moveTo(q[0] + Math.cos(ang) * r1, q[1] + Math.sin(ang) * r1); g.lineTo(q[0] + Math.cos(ang) * r2, q[1] + Math.sin(ang) * r2); g.stroke(); }
      var ly = q[1] + rr * .8 + 46;
      g.font = '400 58px "Bebas Neue", Sora, sans-serif'; g.fillStyle = '#f4efe6'; g.fillText(pv.name.toUpperCase().split('').join(String.fromCharCode(8202)), q[0], ly);
      g.font = '500 18px "JetBrains Mono", monospace'; g.fillStyle = GOLD; g.fillText(pv.house.toUpperCase(), q[0], ly + 38);
    });
    var fq = toMap(0, 640, N); g.font = '400 52px "Bebas Neue", Sora, sans-serif'; g.fillStyle = '#e8d5a8'; g.fillText('THE FROSTSPINE', fq[0], fq[1] + 70);
    var sq = toMap(0, -520, N); g.font = '400 44px "Bebas Neue", Sora, sans-serif'; g.fillStyle = 'rgba(160,210,255,.8)'; g.fillText('THE  AZURE  SEA', sq[0], sq[1]);
    // cartouche + compass
    g.strokeStyle = 'rgba(201,169,110,.5)'; g.lineWidth = 2; g.strokeRect(40, 40, N - 80, N - 80); g.strokeRect(52, 52, N - 104, N - 104);
    var cp = [N - 190, 230]; g.strokeStyle = GOLD; g.lineWidth = 2; g.beginPath(); g.arc(cp[0], cp[1], 70, 0, 7); g.stroke(); g.beginPath(); g.arc(cp[0], cp[1], 58, 0, 7); g.stroke();
    g.fillStyle = GOLD; g.beginPath(); g.moveTo(cp[0], cp[1] - 100); g.lineTo(cp[0] + 12, cp[1]); g.lineTo(cp[0], cp[1] + 100); g.lineTo(cp[0] - 12, cp[1]); g.closePath(); g.fill();
    g.font = '400 40px "Bebas Neue", sans-serif'; g.fillText('N', cp[0], cp[1] - 128);
    return c;
  }
  function revealMaterial(T, tex) {
    return new T.ShaderMaterial({
      uniforms: { map: { value: tex }, reveal: { value: 0 }, time: { value: 0 }, center: { value: new T.Vector2(0, 20) } },
      vertexShader: 'varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }',
      fragmentShader: [
        'uniform sampler2D map; uniform float reveal; uniform float time; uniform vec2 center; varying vec2 vUv; varying vec3 vW;',
        'void main(){',
        '  vec3 c = texture2D(map, vUv).rgb; c = pow(c, vec3(2.2));',
        '  float d = length(vW.xz - center);',
        '  float inside = smoothstep(reveal, reveal - 90.0, d);',
        '  float edge = exp(-pow((d - reveal) / 18.0, 2.0));',
        '  float lum = max(max(c.r, c.g), c.b);',
        '  vec3 col = c * inside + vec3(1.0, .78, .42) * edge * (.25 + lum * 2.2);',
        '  col += vec3(.02, .035, .06) * (1.0 - inside);',
        '  gl_FragColor = linearToOutputTexel(vec4(col, 1.0));',
        '}'].join('\n'),
      toneMapped: false
    });
  }

  /* ------------------------------------------------------------ architecture */
  function Kit(T) {
    var M = {
      gold: new T.MeshStandardMaterial({ color: 0xd4b06a, metalness: 1, roughness: .28 }),
      ivory: new T.MeshStandardMaterial({ color: 0xece4d4, metalness: 0, roughness: .55 }),
      stone: new T.MeshStandardMaterial({ color: 0x9aa3b2, metalness: .1, roughness: .7 }),
      dark: new T.MeshStandardMaterial({ color: 0x1a2232, metalness: .6, roughness: .35 }),
      glass: new T.MeshStandardMaterial({ color: 0x0a1a30, metalness: .95, roughness: .12, emissive: 0x2f6fe0, emissiveIntensity: .0, envMapIntensity: .6 }),
      snow: new T.MeshStandardMaterial({ color: 0xf4f7ff, roughness: .9 }),
      rock: new T.MeshStandardMaterial({ color: 0x4a5568, roughness: .95, flatShading: true })
    };
    function glow(hex, k) { return new T.MeshStandardMaterial({ color: 0x000000, emissive: new T.Color(hex), emissiveIntensity: k == null ? 1.6 : k, roughness: .4 }); }
    function add(group, parts, mesh, delay) { mesh.castShadow = true; group.add(mesh); parts.push({ m: mesh, to: mesh.position.clone(), s: mesh.scale.clone(), rot: mesh.rotation.y, d: delay || 0 }); return mesh; }
    function box(w, h, d, m) { var g = new T.BoxGeometry(w, h, d); g.translate(0, h / 2, 0); return new T.Mesh(g, m); }
    function cyl(r1, r2, h, m, seg) { var g = new T.CylinderGeometry(r1, r2, h, seg || 24); g.translate(0, h / 2, 0); return new T.Mesh(g, m); }
    function dome(r, m) { return new T.Mesh(new T.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), m); }
    function cone(r, h, m, seg) { var g = new T.ConeGeometry(r, h, seg || 24); g.translate(0, h / 2, 0); return new T.Mesh(g, m); }
    function at(mesh, x, y, z) { mesh.position.set(x, y, z); return mesh; }
    function plinth(G, P, r, m) { add(G, P, at(cyl(r, r + 2, 2, m || M.dark, 48), 0, 0, 0), 0); add(G, P, at(new T.Mesh(new T.TorusGeometry(r + 1.2, .35, 8, 64), M.gold), 0, 2, 0), .05).rotation.x = Math.PI / 2; }

    var B = {
      corona: function (G, P, pv) { // the Crown: tiered rotunda, colonnade, spire, orb with orange ring
        plinth(G, P, 30);
        add(G, P, at(cyl(20, 22, 8, M.ivory, 48), 0, 2, 0), .1);
        for (var i = 0; i < 20; i++) { var a = i / 20 * Math.PI * 2; add(G, P, at(cyl(.8, .8, 12, M.ivory, 10), Math.cos(a) * 18, 10, Math.sin(a) * 18), .15 + i * .01); }
        add(G, P, at(cyl(19, 19, 1.6, M.gold, 48), 0, 22, 0), .4);
        add(G, P, at(cyl(13, 14, 10, M.ivory, 40), 0, 23.6, 0), .45);
        add(G, P, at(dome(12.5, M.gold), 0, 33.6, 0), .55);
        add(G, P, at(cone(1.6, 22, M.gold, 12), 0, 44, 0), .65);
        add(G, P, at(new T.Mesh(new T.SphereGeometry(4.2, 32, 20), glow('#9fd4ff', 2.4)), 0, 72, 0), .8);
        var ring = add(G, P, at(new T.Mesh(new T.TorusGeometry(7.5, .7, 12, 64), glow('#ff9a3c', 2.2)), 0, 72, 0), .85); ring.userData.spin = 1;
        [[-26, -26], [26, -26], [-26, 26], [26, 26]].forEach(function (q, k) { add(G, P, at(cyl(2.6, 3, 20, M.ivory, 16), q[0], 2, q[1]), .3 + k * .05); add(G, P, at(cone(3.2, 8, M.gold, 16), q[0], 22, q[1]), .5 + k * .05); });
      },
      meridian: function (G, P, pv) { // the Grand Bazaar: domes on cubes, arcade, clock tower, canopies
        plinth(G, P, 30);
        var spots = [[0, 0, 10, 14], [-16, 6, 7, 9], [15, 8, 7, 10], [-6, -16, 6, 8], [14, -12, 6, 7]];
        spots.forEach(function (q, k) { add(G, P, at(box(q[2] * 2, q[3], q[2] * 2, M.ivory), q[0], 2, q[1]), .1 + k * .06); add(G, P, at(dome(q[2] * .95, k === 0 ? M.gold : M.stone), q[0], 2 + q[3], q[1]), .3 + k * .06); });
        for (var i = 0; i < 9; i++) { var arch = new T.Mesh(new T.TorusGeometry(2.2, .5, 8, 16, Math.PI), M.gold); add(G, P, at(arch, -20 + i * 5, 6, 24), .45 + i * .02); add(G, P, at(cyl(.5, .5, 4, M.ivory, 8), -22.2 + i * 5, 2, 24), .4 + i * .02); }
        add(G, P, at(box(5, 34, 5, M.ivory), 24, 2, -22), .5); add(G, P, at(cyl(3, 3, .6, glow('#ffd9a0', 1.8)), 24, 30, -19.5), .7).rotation.x = Math.PI / 2; add(G, P, at(cone(4.2, 9, M.gold, 4), 24, 36, -22), .75);
        [[-22, -6], [-24, 14], [6, 20], [-12, 22]].forEach(function (q, k) { add(G, P, at(cone(4, 3, new T.MeshStandardMaterial({ color: k % 2 ? 0xff9a3c : 0xc9a96e, roughness: .6 }), 6), q[0], 5, q[1]), .6 + k * .04); add(G, P, at(cyl(.3, .3, 5, M.dark, 6), q[0], 2, q[1]), .55); });
      },
      silica: function (G, P, pv) { // glass megatowers, a twisted tower, sky bridge, antennas
        plinth(G, P, 30);
        var towers = [[0, 0, 9, 70], [-15, 8, 7, 48], [14, 10, 6, 56], [-10, -15, 6, 40], [15, -13, 7, 36]];
        towers.forEach(function (q, k) {
          add(G, P, at(box(q[2], q[3], q[2], M.glass), q[0], 2, q[1]), .1 + k * .08);
          for (var b = 6; b < q[3]; b += 7) add(G, P, at(box(q[2] + .3, .5, q[2] + .3, glow('#4da3ff', 1.4)), q[0], 2 + b, q[1]), .3 + k * .08 + b * .002);
          add(G, P, at(cyl(.25, .25, 10, M.gold, 6), q[0], 2 + q[3], q[1]), .6 + k * .05);
        });
        for (var i = 0; i < 12; i++) { var s = add(G, P, at(box(6, 4, 6, i % 3 ? M.glass : M.gold), 26, 2 + i * 4, 18), .2 + i * .03); s.rotation.y = i * .18; }
        add(G, P, at(box(16, 1.4, 2.4, glow('#9fd4ff', 1.2)), -7, 30, 4), .7).rotation.y = -.4;
      },
      lumen: function (G, P, pv) { // creators: glass prism pyramid, cinema dome, leaning sculptures, light beams
        plinth(G, P, 30);
        var prism = add(G, P, at(new T.Mesh(new T.ConeGeometry(16, 30, 4), new T.MeshStandardMaterial({ color: 0x2a0b4a, metalness: .9, roughness: .05, emissive: 0x7b3fe4, emissiveIntensity: .35, transparent: true, opacity: .92 })), 0, 17, 0), .15); prism.rotation.y = Math.PI / 4;
        add(G, P, at(dome(9, M.ivory), -19, 2, 12), .3); add(G, P, at(new T.Mesh(new T.TorusGeometry(9.2, .5, 8, 48), glow('#c792ea', 1.8)), -19, 2.5, 12), .4).rotation.x = Math.PI / 2;
        [[18, 10, .25], [22, -8, -.3], [12, -20, .18]].forEach(function (q, k) { var t = add(G, P, at(box(4, 26 + k * 6, 4, k % 2 ? M.gold : M.ivory), q[0], 2, q[1]), .35 + k * .08); t.rotation.z = q[2]; });
        ['#ff5f7a', '#ffd25f', '#5fd38a', '#5fb8ff', '#c792ea'].forEach(function (c, k) { var b = add(G, P, at(box(.5, 60, .5, glow(c, 2.4)), -6 + k * 3, 32, 0), .7 + k * .04); b.rotation.z = (k - 2) * .14; });
      },
      arcadia: function (G, P, pv) { // play: stadium bowl, ferris wheel, coaster loop, neon pylons
        plinth(G, P, 30);
        for (var r = 0; r < 4; r++) add(G, P, at(new T.Mesh(new T.TorusGeometry(13 + r * 1.6, 1.4, 8, 48), r % 2 ? M.ivory : M.dark), -6, 3 + r * 2.2, -4), .1 + r * .06).rotation.x = Math.PI / 2;
        add(G, P, at(new T.Mesh(new T.CircleGeometry(12, 32), glow('#45e0ae', .5)), -6, 2.2, -4), .05).rotation.x = -Math.PI / 2;
        var wheel = new T.Group(); wheel.add(new T.Mesh(new T.TorusGeometry(12, .45, 8, 64), M.gold));
        for (var k = 0; k < 12; k++) { var sp = new T.Mesh(new T.BoxGeometry(.25, 24, .25), M.ivory); sp.rotation.z = k / 12 * Math.PI; wheel.add(sp); var cab = new T.Mesh(new T.BoxGeometry(1.6, 1.6, 1.6), glow(k % 2 ? '#45e0ae' : '#ff9a3c', 1.4)); cab.position.set(Math.cos(k / 12 * Math.PI * 2) * 12, Math.sin(k / 12 * Math.PI * 2) * 12, 0); wheel.add(cab); }
        wheel.position.set(18, 17, 14); wheel.userData.spinZ = 1; add(G, P, wheel, .4);
        add(G, P, at(cyl(.6, .9, 15, M.dark, 8), 18, 2, 14), .3);
        add(G, P, at(new T.Mesh(new T.TorusGeometry(7, .5, 8, 48), glow('#ff5fa2', 1.6)), -20, 12, 18), .5);
        [[24, -18], [-24, -20], [4, 24]].forEach(function (q, k) { add(G, P, at(box(2, 22 + k * 4, 2, glow('#45e0ae', 1.2)), q[0], 2, q[1]), .6 + k * .05); });
      },
      sage: function (G, P, pv) { // learning: columned library, observatory dome, bell tower, stacked books
        plinth(G, P, 30);
        add(G, P, at(box(34, 3, 16, M.ivory), 0, 2, 4), .1);
        for (var i = 0; i < 10; i++) add(G, P, at(cyl(.8, .9, 12, M.ivory, 12), -14.4 + i * 3.2, 5, 11), .2 + i * .02);
        add(G, P, at(box(34, 14, 12, M.stone), 0, 5, 2), .25);
        add(G, P, at(box(36, 2, 18, M.ivory), 0, 17, 4), .35);
        var ped = add(G, P, at(new T.Mesh(new T.CylinderGeometry(0, 19, 6, 4, 1), M.gold), 0, 22, 4), .45); ped.rotation.y = Math.PI / 4; ped.scale.set(1, 1, .45);
        add(G, P, at(cyl(7, 7, 8, M.ivory, 32), -18, 2, -16), .4); var obs = add(G, P, at(dome(7, M.gold), -18, 10, -16), .55);
        add(G, P, at(box(1.6, 8, 14, glow('#7fd1ff', 1.4)), -18, 10, -16), .6);
        add(G, P, at(box(5, 30, 5, M.ivory), 20, 2, -16), .45); add(G, P, at(cone(3.8, 8, M.gold, 4), 20, 32, -16), .7);
        ['#7fd1ff', '#e8d5a8', '#4da3ff', '#c9a96e'].forEach(function (c, k) { add(G, P, at(box(9, 1.6, 6, new T.MeshStandardMaterial({ color: new T.Color(c), roughness: .6 })), 18, 2 + k * 1.7, 14), .5 + k * .05).rotation.y = k * .12; });
      },
      harmony: function (G, P, pv) { // faiths side by side around one garden
        plinth(G, P, 30);
        add(G, P, at(new T.Mesh(new T.CircleGeometry(10, 40), new T.MeshStandardMaterial({ color: 0x2e6b4f, roughness: .9 })), 0, 2.2, 0), .05).rotation.x = -Math.PI / 2;
        add(G, P, at(cyl(3, 3, .6, glow('#9fd4ff', 1.2)), 0, 2.2, 0), .1);
        // domed hall with crescent finial + minaret
        add(G, P, at(box(14, 10, 14, M.ivory), -18, 2, -12), .15); add(G, P, at(dome(7, M.gold), -18, 12, -12), .3); add(G, P, at(new T.Mesh(new T.TorusGeometry(1.2, .25, 8, 24, Math.PI * 1.4), M.gold), -18, 21, -12), .5);
        add(G, P, at(cyl(1.4, 1.6, 30, M.ivory, 16), -27, 2, -3), .25); add(G, P, at(cone(1.8, 5, M.gold, 16), -27, 32, -3), .5);
        // gothic spire
        add(G, P, at(box(10, 14, 16, M.stone), 18, 2, -10), .2); add(G, P, at(box(5, 14, 5, M.stone), 18, 16, -16), .35); add(G, P, at(cone(3.6, 16, M.gold, 4), 18, 30, -16), .5);
        // pagoda
        for (var k = 0; k < 5; k++) { var w = 12 - k * 2; add(G, P, at(box(w * .7, 3, w * .7, M.ivory), 16, 2 + k * 4.4, 16), .2 + k * .07); add(G, P, at(cone(w * .62, 1.6, M.gold, 4), 16, 5 + k * 4.4, 16), .25 + k * .07).rotation.y = Math.PI / 4; }
        // temple with shikhara + small gurdwara-style dome
        add(G, P, at(box(9, 6, 9, M.ivory), -16, 2, 16), .2); add(G, P, at(cone(5, 16, new T.MeshStandardMaterial({ color: 0xe0b878, roughness: .5 }), 8), -16, 8, 16), .35);
        add(G, P, at(cyl(4, 4, 6, M.ivory, 24), 2, 2, 22), .3); add(G, P, at(dome(4.2, M.gold), 2, 8, 22), .45);
      },
      azure: function (G, P, pv) { // the coast: lighthouse with sweeping beam, harbour, sails
        add(G, P, at(cyl(30, 32, 1.6, new T.MeshStandardMaterial({ color: 0x0d3550, metalness: .3, roughness: .2 }), 48), 0, 0, 0), 0);
        for (var i = 0; i < 6; i++) add(G, P, at(cyl(3.4 - i * .25, 3.6 - i * .25, 5, i % 2 ? M.ivory : new T.MeshStandardMaterial({ color: 0xb33a3a, roughness: .5 }), 24), 0, 1.6 + i * 5, 0), .1 + i * .05);
        add(G, P, at(cyl(2.4, 2.4, 3, glow('#fff1c9', 3)), 0, 31.6, 0), .45); add(G, P, at(cone(2.8, 4, M.gold, 16), 0, 34.6, 0), .5);
        var beam = new T.Mesh(new T.ConeGeometry(6, 70, 24, 1, true), new T.MeshBasicMaterial({ color: 0xfff1c9, transparent: true, opacity: .14, depthWrite: false, side: T.DoubleSide }));
        beam.geometry.translate(0, -35, 0); beam.rotation.z = Math.PI / 2; var pivot = new T.Group(); pivot.position.set(0, 33, 0); pivot.add(beam); pivot.userData.spin = 1; add(G, P, pivot, .6);
        [[-18, 10], [18, 6], [-10, -18], [14, -16]].forEach(function (q, k) {
          add(G, P, at(box(5, 1.4, 12, M.ivory), q[0], 1.6, q[1]), .3 + k * .05).rotation.y = k;
          var sail = new T.Mesh(new T.ConeGeometry(3, 9, 3), M.ivory); sail.scale.z = .15; add(G, P, at(sail, q[0], 7.5, q[1]), .45 + k * .05).rotation.y = k;
        });
        add(G, P, at(box(28, 2, 4, M.stone), 0, 1.6, 24), .2);
      },
      frostspine: function (G, P, pv) { // snow peaks with an old watchtower
        [[0, 0, 26, 70], [-30, 10, 20, 50], [30, 6, 22, 56], [-12, -20, 16, 40], [16, -22, 18, 44]].forEach(function (q, k) {
          add(G, P, at(cone(q[2], q[3], M.rock, 7), q[0], 0, q[1]), .05 + k * .08);
          add(G, P, at(cone(q[2] * .38, q[3] * .38, M.snow, 7), q[0], q[3] * .62, q[1]), .3 + k * .08);
        });
        add(G, P, at(cyl(2.4, 3, 14, M.stone, 8), 8, 40, 6), .6); add(G, P, at(cyl(3, 3, .8, glow('#ffd9a0', 1.6), 8), 8, 54, 6), .7);
      }
    };
    return { M: M, build: function (pv) { var G = new T.Group(), P = []; (B[pv.id] || B.corona)(G, P, pv); G.position.set(pv.x, 0, pv.z); P.forEach(function (p) { p.to = p.m.position.clone(); p.s = p.m.scale.clone(); p.m.scale.set(.0001, .0001, .0001); }); return { group: G, parts: P }; } };
  }
  function envMap(T, renderer) {
    var pm = new T.PMREMGenerator(renderer), sc = new T.Scene();
    var geo = new T.SphereGeometry(50, 32, 16), col = [], pos = geo.attributes.position, v = new T.Vector3();
    for (var i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); var k = (v.y / 50 + 1) / 2; var c = new T.Color('#05080f').lerp(new T.Color('#c9a96e'), Math.pow(1 - Math.abs(k - .52) * 2, 6) * .9).lerp(new T.Color('#1b2a44'), k > .6 ? (k - .6) : 0); col.push(c.r, c.g, c.b); }
    geo.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    sc.add(new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, side: T.BackSide })));
    var lamp = new T.Mesh(new T.PlaneGeometry(30, 8), new T.MeshBasicMaterial({ color: 0xfff3dc })); lamp.position.set(0, 30, -30); lamp.lookAt(0, 0, 0); sc.add(lamp);
    var lamp2 = new T.Mesh(new T.PlaneGeometry(20, 20), new T.MeshBasicMaterial({ color: 0x6fa8ff })); lamp2.position.set(-40, 10, 20); lamp2.lookAt(0, 0, 0); sc.add(lamp2);
    var rt = pm.fromScene(sc, .02); pm.dispose(); return rt.texture;
  }

  /* ------------------------------------------------------------ film */
  var playing = false;
  INTRO.play = function (done) {
    var T = window.THREE, W = window.__fyrusWorld, provs = W && W.provinces;
    if (!T || !provs || playing) { done && done(); return; }
    playing = true;
    var st0 = (function () { try { return window.__fyrus.getState().settings || {}; } catch (e) { return {}; } })();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var root = el('div', 'fxi'); root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Fyrus opening film');
    var canvas = el('canvas'); root.appendChild(canvas);
    root.appendChild(el('div', 'fxi-vig')); root.appendChild(el('div', 'fxi-grain')); var shade = el('div', 'fxi-shade'); shade.style.opacity = '0'; shade.style.transition = 'opacity 1s'; root.appendChild(shade);
    root.appendChild(el('div', 'fxi-bar t')); root.appendChild(el('div', 'fxi-bar b'));
    var kicker = el('div', 'fxi-kicker', ['Republic of Fyrus · 2040']);
    var logo = el('div', 'fxi-logo', ['FYRUS']), line = el('div', 'fxi-line'), tag = el('div', 'fxi-tag', ['A country with no borders']);
    var center = el('div', 'fxi-center', [el('div', null, [kicker, logo, line, tag])]); root.appendChild(center);
    var lower = el('div', 'fxi-lower'); root.appendChild(lower);
    var endCard = el('div', 'fxi-end'); root.appendChild(endCard);
    var skip = el('button', 'fxi-skip', ['Skip  ›']); root.appendChild(skip);
    var soundBtn = el('button', 'fxi-sound', ['Sound on']); root.appendChild(soundBtn);
    document.body.appendChild(root);

    var renderer;
    try { renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' }); } catch (e) { root.remove(); playing = false; done && done(); return; }
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    if (T.sRGBEncoding) renderer.outputEncoding = T.sRGBEncoding;
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    var scene = new T.Scene(); scene.background = new T.Color('#05080f'); scene.fog = new T.FogExp2('#05080f', .0007);
    scene.environment = envMap(T, renderer);
    var cam = new T.PerspectiveCamera(38, 1, 1, 5000);
    scene.add(new T.HemisphereLight(0x9fb8e0, 0x0a0f1a, .35));
    var key = new T.DirectionalLight(0xffe2b0, 2.2); key.position.set(-300, 420, -260); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); var sc = key.shadow.camera; sc.left = sc.bottom = -800; sc.right = sc.top = 800; sc.near = 10; sc.far = 1600; key.shadow.bias = -.0005; scene.add(key);
    var rim = new T.DirectionalLight(0x6fa8ff, .9); rim.position.set(300, 200, 400); scene.add(rim);

    var mapTex = new T.CanvasTexture(mapCanvas(provs)); mapTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var mapMat = revealMaterial(T, mapTex);
    var map = new T.Mesh(new T.PlaneGeometry(MAPW, MAPW), mapMat); map.rotation.set(-Math.PI / 2, 0, Math.PI); scene.add(map);
    var shadowFloor = new T.Mesh(new T.PlaneGeometry(MAPW, MAPW), new T.ShadowMaterial({ opacity: .45 })); shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.position.y = .2; shadowFloor.receiveShadow = true; scene.add(shadowFloor);
    // the first light
    var spark = new T.Mesh(new T.SphereGeometry(3, 24, 16), new T.MeshBasicMaterial({ color: 0xfff3dc })); spark.position.set(0, 4, 20); scene.add(spark);
    var halo = new T.Sprite(new T.SpriteMaterial({ map: (function () { var c = document.createElement('canvas'); c.width = c.height = 128; var g = c.getContext('2d'); var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,240,210,1)'); gr.addColorStop(.25, 'rgba(232,213,168,.45)'); gr.addColorStop(1, 'rgba(201,169,110,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); })(), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    halo.position.copy(spark.position); halo.scale.set(40, 40, 1); scene.add(halo);
    // dust motes for depth
    var dustG = new T.BufferGeometry(), dp = new Float32Array(1500 * 3); for (var i = 0; i < 1500; i++) { dp[i * 3] = (Math.random() - .5) * 1400; dp[i * 3 + 1] = Math.random() * 260; dp[i * 3 + 2] = (Math.random() - .5) * 1400; }
    dustG.setAttribute('position', new T.BufferAttribute(dp, 3));
    var dot = (function () { var c = document.createElement('canvas'); c.width = c.height = 32; var g = c.getContext('2d'); var gr = g.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, 'rgba(255,245,220,1)'); gr.addColorStop(1, 'rgba(255,245,220,0)'); g.fillStyle = gr; g.fillRect(0, 0, 32, 32); return new T.CanvasTexture(c); })();
    var dust = new T.Points(dustG, new T.PointsMaterial({ color: 0xe8d5a8, map: dot, size: 2.4, transparent: true, opacity: .5, depthWrite: false, blending: T.AdditiveBlending })); scene.add(dust);

    var kit = Kit(T);
    var order = ['corona', 'meridian', 'silica', 'lumen', 'arcadia', 'sage', 'harmony', 'azure', 'frostspine'];
    var cities = order.map(function (id) { var pv = provs.filter(function (p) { return p.id === id; })[0]; var c = kit.build(pv); c.pv = pv; scene.add(c.group); c.group.traverse(function (o) { if (o.isMesh) o.receiveShadow = true; }); return c; });

    function size() { var w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < h ? 52 : 38; cam.updateProjectionMatrix(); }
    size(); window.addEventListener('resize', size);
    var score = Score(st0.music !== false, Math.max(0, Math.min(1, st0.volume == null ? .8 : st0.volume)));
    if (!score.on) soundBtn.style.display = 'none';
    var muted = false; soundBtn.onclick = function () { muted = !muted; score.mute && score.mute(muted); soundBtn.textContent = muted ? 'Sound off' : 'Sound on'; };

    // timeline
    var PER = reduce ? 1.6 : 2.35, T_REVEAL = 2.6, T_LOGO = 4.4, T_TOUR = 8.6, T_END = T_TOUR + order.length * PER;
    var ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    function orbit(c, u) { // u: 0..1 within a province shot
      var far = c.pv.id === 'frostspine', big = c.pv.id === 'corona' ? 1.3 : 1, r = (far ? 190 : 145 - u * 30) * big, h = (far ? 110 : 66 - u * 20) * big, a = -2.2 + (order.indexOf(c.pv.id) % 2 ? -1 : 1) * (.5 - u) * .9;
      return { pos: new T.Vector3(c.pv.x + Math.cos(a) * r, h, c.pv.z + Math.sin(a) * r), look: new T.Vector3(c.pv.x, far ? 30 : 16 * big, c.pv.z) };
    }
    var overview = { pos: new T.Vector3(0, 1250, -760), look: new T.Vector3(0, 0, 60) };
    var opening = { pos: new T.Vector3(0, 60, -120), look: new T.Vector3(0, 4, 20) };
    var finale = { pos: new T.Vector3(40, 980, -980), look: new T.Vector3(0, 0, 80) };
    var curPos = opening.pos.clone(), curLook = opening.look.clone();
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function easeOutBack(t) { var c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
    var shown = -1, boomed = false, ended = false, finished = false, t0 = performance.now();

    function showProvince(i) {
      var pv = cities[i].pv; lower.classList.remove('on');
      setTimeout(function () {
        lower.innerHTML = '';
        lower.appendChild(el('div', 'rule'));
        var num = el('div', 'num'); num.appendChild(words('Province ' + ROMAN[i] + ' · ' + pv.title)); lower.appendChild(num);
        var name = el('div', 'name'); name.appendChild(words(pv.name)); lower.appendChild(name);
        var house = el('div', 'house'); house.appendChild(words(pv.house)); lower.appendChild(house);
        var motto = el('div', 'motto'); motto.appendChild(words('“' + pv.motto + '”')); lower.appendChild(motto);
        void lower.offsetWidth; lower.classList.add('on');
      }, 220);
    }
    function showEnd() {
      lower.classList.remove('on');
      endCard.innerHTML = '';
      var enter = el('button', 'fxi-btn gold', ['Enter Fyrus']), book = el('button', 'fxi-btn ghost', ['Read the Book']);
      enter.onclick = function () { finish('enter'); };
      book.onclick = function () { finish('book'); };
      endCard.appendChild(el('div', null, [
        el('div', 'fxi-kicker', ['Nine provinces · One open gate']),
        el('div', 'big', ['Population: You']),
        el('div', 'small', ['No visa. No walls. Your passport is waiting.']),
        el('div', 'fxi-cta', [enter, book])
      ]));
      endCard.firstChild.firstChild.style.opacity = '1';
      endCard.classList.add('on'); skip.style.display = 'none'; enter.focus();
    }

    function frame(now) {
      if (finished) return;
      var t = (now - t0) / 1000;
      // ---- opening: darkness, heartbeat, the first light
      if (t < T_REVEAL) {
        var k = t / T_REVEAL, beat = Math.max(Math.exp(-Math.pow((t - .35) * 9, 2)), Math.exp(-Math.pow((t - 1.85) * 9, 2)));
        spark.scale.setScalar(.6 + beat * .9 + k * .6); halo.scale.setScalar(30 + beat * 50 + k * 60);
        curPos.copy(opening.pos).lerp(new T.Vector3(0, 90, -170), ease(k)); curLook.copy(opening.look);
        mapMat.uniforms.reveal.value = 0;
      } else if (t < T_TOUR) {
        if (!boomed) { boomed = true; score.boom(); root.classList.add('letterbox'); }
        var k2 = (t - T_REVEAL) / (T_TOUR - T_REVEAL);
        mapMat.uniforms.reveal.value = 40 + ease(Math.min(1, k2 * 1.25)) * 1200;
        curPos.copy(new T.Vector3(0, 90, -170)).lerp(overview.pos, ease(Math.min(1, k2 * 1.1))); curLook.copy(opening.look).lerp(overview.look, ease(Math.min(1, k2 * 1.1)));
        halo.scale.setScalar(110 * (1 - k2) + 20); spark.scale.setScalar(1.2 * (1 - k2) + .2);
        if (t > T_LOGO && !logo.classList.contains('on')) { kicker.style.opacity = '1'; logo.classList.add('on'); line.classList.add('on'); tag.style.opacity = '1'; }
        if (t > T_TOUR - 1.1) center.style.transition = 'opacity 1s', center.style.opacity = '0';
      } else if (t < T_END) {
        mapMat.uniforms.reveal.value = 1400;
        var idx = Math.min(order.length - 1, Math.floor((t - T_TOUR) / PER)), u = ((t - T_TOUR) - idx * PER) / PER;
        if (idx !== shown) { shown = idx; showProvince(idx); score.hit(); }
        shade.style.opacity = '1';
        var o = orbit(cities[idx], u), blend = Math.min(1, u * PER / .9);
        curPos.lerp(o.pos, idx === 0 && u < .4 ? .06 : .08 + blend * .1); curLook.lerp(o.look, .12);
      } else {
        if (!ended) { ended = true; showEnd(); shade.style.opacity = '0'; }
        var k3 = Math.min(1, (t - T_END) / 3);
        curPos.lerp(finale.pos, .03 + k3 * .02); curLook.lerp(finale.look, .05);
      }
      cam.position.copy(curPos); cam.lookAt(curLook);
      // cities assemble when the reveal wave reaches them, and finish when the camera arrives
      cities.forEach(function (c, ci) {
        var dist = Math.hypot(c.pv.x, c.pv.z - 20), waveT = T_REVEAL + Math.max(0, (dist - 40) / 1200) * (T_TOUR - T_REVEAL) / 1.25;
        var tourT = T_TOUR + ci * PER - .3;
        c.parts.forEach(function (p) {
          var a = Math.max(0, Math.min(1, (t - waveT - p.d * .9) / .9)) * .25 + Math.max(0, Math.min(1, (t - tourT - p.d * 1.1) / 1.0)) * .75;
          if (t > T_END) a = 1;
          var e = a <= 0 ? 0 : easeOutBack(a);
          p.m.scale.set(p.s.x * Math.max(.0001, e), p.s.y * Math.max(.0001, e), p.s.z * Math.max(.0001, e));
          p.m.position.y = p.to.y - (1 - Math.min(1, e)) * 18;
          if (p.m.userData.spin) p.m.rotation.y = t * 1.2;
          if (p.m.userData.spinZ) p.m.rotation.z = t * .35;
        });
      });
      kit.M.glass.emissiveIntensity = Math.min(.16, Math.max(0, (t - T_TOUR) * .08));
      dust.rotation.y = t * .01;
      renderer.render(scene, cam);
      requestAnimationFrame(frame);
    }
    function finish(result) {
      if (finished) return; finished = true; playing = false;
      score.stop(); window.removeEventListener('resize', size);
      root.style.transition = 'opacity .9s'; root.style.opacity = '0';
      setTimeout(function () {
        try { scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); } }); mapTex.dispose(); scene.environment && scene.environment.dispose(); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); } catch (e) {}
        root.remove();
        if (result === 'book' && W.openBook) W.openBook('provinces');
        done && done(result);
      }, 900);
    }
    skip.onclick = function () { if (!ended) { t0 = performance.now() - T_END * 1000; } else finish('enter'); };
    root.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') finish('enter'); });
    skip.focus();
    requestAnimationFrame(frame);
  };
})();
