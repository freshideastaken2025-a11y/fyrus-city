/* Fyrus — 4D atmosphere (v1.0)
   Adds time as a 4th dimension to the city sky:
   - smooth transitions: changing weather or time fades the sky, sun, fog and light over a few seconds
   - time machine: scrub the hour of the day, or watch 24 hours pass in one minute
   - storms: lightning bolts, sky flashes and rolling thunder (sound only after you have tapped the page)
   - rain splashes on the ground, wind that slants the rain, a rainbow when the rain stops in daylight
   - spring blossom petals and autumn leaves drifting through the streets
   Controls live inside the existing "Weather & mood" window. API: window.__fyrusAtmos */
(function () {
  'use strict';
  if (window.__fyrusAtmos) return;
  var API = window.__fyrusAtmos = { version: '1.0.1' };
  var T = null, W = null, env = null, U = null, origUpdate = null;
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var phone = (function () { try { return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } })();
  var LS = { get: function (k, d) { try { var v = localStorage.getItem('fyrusAtmos.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem('fyrusAtmos.' + k, JSON.stringify(v)); } catch (e) {} } };
  var opts = { storms: LS.get('storms', true), petals: LS.get('petals', true), splashes: LS.get('splashes', true) };

  /* ---------- time machine ---------- */
  var tm = { mode: 'off', hour: 12, t0: 0, from: 0 }; // mode: off | fixed | lapse
  var RealDate = window.Date;
  function hourNow() {
    if (tm.mode === 'fixed') return tm.hour;
    if (tm.mode === 'lapse') { var e = (performance.now() - tm.t0) / 1000; if (e >= 60) { tm.mode = 'off'; updateChip(); return null; } return (tm.from + e * 0.4) % 24; }
    return null;
  }
  function withHour(h, fn) {
    function FakeDate() {
      if (arguments.length) return new (Function.prototype.bind.apply(RealDate, [null].concat(Array.prototype.slice.call(arguments))))();
      var d = new RealDate(); d.setHours(Math.floor(h), Math.floor((h % 1) * 60), 0, 0); return d;
    }
    FakeDate.now = RealDate.now; FakeDate.UTC = RealDate.UTC; FakeDate.parse = RealDate.parse; FakeDate.prototype = RealDate.prototype;
    window.Date = FakeDate;
    try { fn(); } finally { window.Date = RealDate; }
  }

  /* ---------- smoothing of the sky state ---------- */
  var cur = null, first = true;
  function snap() {
    return {
      top: U.uSkyTop.value.clone(), hor: U.uSkyHor.value.clone(), amb: U.uAmb.value.clone(), sunCol: U.uSunCol.value.clone(),
      dir: U.uSunDir.value.clone(), fog: U.uFog.value.clone(), fogD: U.uFogD.value, cloud: U.uCloud.value, night: U.uNight.value,
      sunI: env.sun.intensity, sunC: env.sun.color.clone(), hemiI: env.hemi.intensity, hemiC: env.hemi.color.clone(), hemiG: env.hemi.groundColor.clone(),
      fillI: env.fill.intensity, exp: W.renderer.toneMappingExposure
    };
  }
  function lerpState(a, b, k) {
    a.top.lerp(b.top, k); a.hor.lerp(b.hor, k); a.amb.lerp(b.amb, k); a.sunCol.lerp(b.sunCol, k); a.fog.lerp(b.fog, k);
    a.dir.lerp(b.dir, k).normalize(); a.fogD += (b.fogD - a.fogD) * k; a.cloud += (b.cloud - a.cloud) * k; a.night += (b.night - a.night) * k;
    a.sunI += (b.sunI - a.sunI) * k; a.sunC.lerp(b.sunC, k); a.hemiI += (b.hemiI - a.hemiI) * k; a.hemiC.lerp(b.hemiC, k); a.hemiG.lerp(b.hemiG, k);
    a.fillI += (b.fillI - a.fillI) * k; a.exp += (b.exp - a.exp) * k;
  }
  function write(s, flash) {
    var f = flash || 0;
    U.uSkyTop.value.copy(s.top).lerp(FLASH, f * .8); U.uSkyHor.value.copy(s.hor).lerp(FLASH, f * .7);
    U.uAmb.value.copy(s.amb).lerp(FLASH, f * .6); U.uSunCol.value.copy(s.sunCol); U.uSunDir.value.copy(s.dir);
    U.uFog.value.copy(s.fog).lerp(FLASH, f * .5); U.uFogD.value = s.fogD; U.uCloud.value = s.cloud; U.uNight.value = s.night;
    env.sun.intensity = s.sunI; env.sun.color.copy(s.sunC);
    env.sun.position.copy(env.sun.target.position).addScaledVector(s.dir, 120);
    env.hemi.intensity = s.hemiI + f * 2.2; env.hemi.color.copy(s.hemiC).lerp(FLASH, f); env.hemi.groundColor.copy(s.hemiG);
    env.fill.intensity = s.fillI;
    W.world.fog.color.copy(U.uFog.value); W.world.fog.density = s.fogD;
    if (W.world.background && W.world.background.isColor) W.world.background.copy(U.uSkyHor.value);
    W.renderer.toneMappingExposure = s.exp + f * .5;
    env.night = s.night;
  }
  var FLASH = null;

  /* ---------- effects ---------- */
  var fx = null, wind = 0, rainAmt = 0, snowAmt = 0, wasRain = 0, rainbowT = -1, flash = 0, nextBolt = 0, bolt = null, boltT = 0;
  function makeFx() {
    var g = new T.Group(); g.name = 'fx-atmos'; g.userData.noBatch = true;
    /* splashes */
    var nS = phone ? 60 : 120;
    var sg = new T.RingGeometry(.018, .032, 12); sg.rotateX(-Math.PI / 2);
    var sm = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .55, depthWrite: false, blending: T.AdditiveBlending });
    var spl = new T.InstancedMesh(sg, sm, nS); spl.frustumCulled = false; spl.instanceMatrix.setUsage(T.DynamicDrawUsage);
    spl.instanceColor = new T.InstancedBufferAttribute(new Float32Array(nS * 3), 3);
    var sd = []; for (var i = 0; i < nS; i++) sd.push({ x: 0, z: 0, y: 0, life: Math.random(), dur: .35 + Math.random() * .25 });
    g.add(spl);
    /* petals / leaves */
    var nP = phone ? 110 : 260;
    var pg = new T.PlaneGeometry(.16, .1);
    var pm = new T.MeshLambertMaterial({ side: T.DoubleSide, transparent: true, opacity: .95 });
    var pet = new T.InstancedMesh(pg, pm, nP); pet.frustumCulled = false; pet.instanceMatrix.setUsage(T.DynamicDrawUsage);
    pet.instanceColor = new T.InstancedBufferAttribute(new Float32Array(nP * 3), 3);
    var pd = []; for (var j = 0; j < nP; j++) pd.push({ x: (Math.random() - .5) * 60, y: Math.random() * 18, z: (Math.random() - .5) * 60, rx: Math.random() * 6, ry: Math.random() * 6, sp: .4 + Math.random() * .5, ph: Math.random() * 6, c: Math.random() });
    g.add(pet);
    /* rainbow */
    var rg = new T.RingGeometry(380, 430, 96, 1, 0, Math.PI);
    var rm = new T.ShaderMaterial({
      transparent: true, depthWrite: false, fog: false, blending: T.AdditiveBlending,
      uniforms: { uA: { value: 0 } },
      vertexShader: 'varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
      fragmentShader: 'uniform float uA; varying vec2 vP; vec3 hue(float h){ return clamp(abs(mod(h*6.+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.); } void main(){ float r = (length(vP)-380.)/50.; float edge = smoothstep(0.,.15,r)*smoothstep(1.,.85,r); float fade = smoothstep(-40., 120., vP.y); gl_FragColor = vec4(hue(.8 - r*.8) * edge * fade * uA * .55, 1.); }'
    });
    var rb = new T.Mesh(rg, rm); rb.visible = false; rb.frustumCulled = false; rb.renderOrder = -1;
    g.add(rb);
    W.world.add(g);
    fx = { g: g, spl: spl, sd: sd, pet: pet, pd: pd, rb: rb, M: new T.Matrix4(), Q: new T.Quaternion(), E: new T.Euler(), V: new T.Vector3(), Sc: new T.Vector3(1, 1, 1), C: new T.Color() };
  }
  function ground(x, z) { try { var y = W.groundAt(x, z); return isFinite(y) ? Math.max(y, 0) : 0; } catch (e) { return 0; } }
  function updateSplashes(dt, p) {
    var on = opts.splashes && rainAmt > .2 && W.active === W.world;
    fx.spl.visible = on; if (!on) return;
    var M = fx.M, Sc = fx.Sc, V = fx.V, Q = fx.Q.identity(), col = fx.spl.instanceColor.array;
    for (var i = 0; i < fx.sd.length; i++) {
      var s = fx.sd[i]; s.life += dt / s.dur;
      if (s.life >= 1) { s.life = 0; var a = Math.random() * 6.283, r = 1.5 + Math.random() * 13; s.x = p.x + Math.cos(a) * r; s.z = p.z + Math.sin(a) * r; s.y = ground(s.x, s.z) + .03; }
      var k = 1 + s.life * 3; Sc.set(k, 1, k); V.set(s.x, s.y, s.z); M.compose(V, Q, Sc); fx.spl.setMatrixAt(i, M);
      var b = (1 - s.life) * rainAmt; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = b * .32;
    }
    fx.spl.instanceMatrix.needsUpdate = true; fx.spl.instanceColor.needsUpdate = true;
  }
  var PETAL = [[1, .72, .82], [.98, .82, .9], [1, .9, .94], [.95, .6, .75]], LEAF = [[.85, .45, .15], [.75, .3, .12], [.9, .62, .2], [.6, .35, .15]];
  function updatePetals(dt, t, p, st) {
    var season = st.season, wx = st.weather;
    var kind = !opts.petals || W.active !== W.world ? null : season === 'spring' && wx !== 'rain' && wx !== 'snow' ? PETAL : season === 'autumn' && wx !== 'snow' ? LEAF : null;
    fx.pet.visible = !!kind; if (!kind) return;
    var M = fx.M, Q = fx.Q, E = fx.E, V = fx.V, Sc = fx.Sc.set(1, 1, 1), col = fx.pet.instanceColor.array, fall = kind === LEAF ? 1.1 : .7;
    for (var i = 0; i < fx.pd.length; i++) {
      var d = fx.pd[i];
      d.y -= dt * d.sp * fall; d.x += dt * (wind * 2.2 + Math.sin(t * .9 + d.ph) * .6); d.z += dt * (wind * .8 + Math.cos(t * .7 + d.ph) * .5);
      d.rx += dt * (1.5 + d.sp * 2); d.ry += dt * (1 + d.sp);
      var dx = d.x - p.x, dz = d.z - p.z;
      if (d.y < ground(d.x, d.z) || Math.abs(dx) > 30 || Math.abs(dz) > 30) { d.x = p.x + (Math.random() - .5) * 60; d.z = p.z + (Math.random() - .5) * 60; d.y = 6 + Math.random() * 14; }
      E.set(d.rx, d.ry, 0); Q.setFromEuler(E); V.set(d.x, d.y, d.z); M.compose(V, Q, Sc); fx.pet.setMatrixAt(i, M);
      var c = kind[Math.floor(d.c * kind.length) % kind.length]; col[i * 3] = c[0]; col[i * 3 + 1] = c[1]; col[i * 3 + 2] = c[2];
    }
    fx.pet.instanceMatrix.needsUpdate = true; fx.pet.instanceColor.needsUpdate = true;
  }
  function updateRainbow(dt, p, st) {
    if (st.weather !== 'clear' && rainbowT >= 0 && rainAmt <= .3) { rainbowT = -1; fx.rb.visible = false; }
    if (wasRain > .5 && rainAmt < .05 && cur && cur.night < .3 && st.weather === 'clear') rainbowT = 0;
    if (rainAmt > .3) wasRain = 1; else if (rainAmt < .05) wasRain = Math.max(0, wasRain - dt * .02);
    if (rainbowT < 0) { fx.rb.visible = false; return; }
    rainbowT += dt;
    var a = Math.min(1, rainbowT / 6) * Math.min(1, Math.max(0, (75 - rainbowT) / 10)) * (cur ? 1 - cur.night : 1);
    if (rainbowT > 75 || rainAmt > .3) { rainbowT = -1; fx.rb.visible = false; return; }
    fx.rb.visible = true; fx.rb.material.uniforms.uA.value = a;
    var sd = cur ? cur.dir : new T.Vector3(0, 1, 0), ax = -sd.x, az = -sd.z, L = Math.hypot(ax, az) || 1;
    fx.rb.position.set(p.x + ax / L * 700, -60, p.z + az / L * 700);
    fx.rb.lookAt(p.x, -60, p.z);
  }
  /* ---------- storm ---------- */
  var ac = null;
  function audio() {
    if (ac) return ac;
    try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); } catch (e) { ac = null; }
    return ac;
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, function () { var a = audio(); if (a && a.state === 'suspended') a.resume(); }, { passive: true }); });
  function thunder(delay, power) {
    var a = ac; if (!a || a.state !== 'running') return;
    var st = S(), vol = st && st.settings ? (st.settings.volume == null ? .8 : st.settings.volume) : .8; if (!vol) return;
    var dur = 3.5 + power * 2, len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), ch = buf.getChannelData(0), last = 0;
    for (var i = 0; i < len; i++) { var w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; ch[i] = last * 3.2; }
    var src = a.createBufferSource(); src.buffer = buf;
    var lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180 + power * 260;
    var gn = a.createGain(), t0 = a.currentTime + delay;
    gn.gain.setValueAtTime(0, t0); gn.gain.linearRampToValueAtTime(.9 * vol * power, t0 + .08); gn.gain.exponentialRampToValueAtTime(.35 * vol * power, t0 + .6); gn.gain.exponentialRampToValueAtTime(.001, t0 + dur);
    src.connect(lp); lp.connect(gn); gn.connect(a.destination); src.start(t0); src.stop(t0 + dur + .1);
  }
  function strike(p) {
    var ang = Math.random() * 6.283, dist = 140 + Math.random() * 260, bx = p.x + Math.cos(ang) * dist, bz = p.z + Math.sin(ang) * dist;
    var pts = [], y = 260, x = bx, z = bz;
    while (y > 0) { pts.push(new T.Vector3(x, y, z)); y -= 14 + Math.random() * 22; x += (Math.random() - .5) * 26; z += (Math.random() - .5) * 26; }
    pts.push(new T.Vector3(x, 0, z));
    if (bolt) { fx.g.remove(bolt); bolt.geometry.dispose(); }
    bolt = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0xe8f0ff, transparent: true, opacity: 1, fog: false }));
    bolt.frustumCulled = false; fx.g.add(bolt); boltT = .22;
    flash = 1;
    thunder(Math.min(2.2, dist / 343), dist < 220 ? 1 : .7);
  }
  function updateStorm(dt, p) {
    if (bolt) { boltT -= dt; bolt.material.opacity = Math.max(0, boltT / .22) * (Math.random() > .3 ? 1 : .2); if (boltT <= 0) { fx.g.remove(bolt); bolt.geometry.dispose(); bolt.material.dispose(); bolt = null; } }
    flash = Math.max(0, flash - dt * 4.5);
    if (flash > .3 && Math.random() < .08) flash = .9;
    var stormy = opts.storms && rainAmt > .6 && W.active === W.world;
    var now = performance.now() / 1000;
    if (!stormy) { nextBolt = now + 6 + Math.random() * 8; return; }
    if (now > nextBolt) { strike(p); nextBolt = now + 9 + Math.random() * 18; }
  }

  /* the city stops moving rain/snow the moment the weather changes; keep it falling while it fades out */
  function fall(obj, dt, p, rain) {
    obj.position.set(p.x, 0, p.z);
    var a = obj.geometry.attributes.position, L = a.array, top = (p.y || 0);
    if (rain) {
      for (var E = 0; E < L.length; E += 6) { L[E + 1] -= dt * 34; L[E + 4] -= dt * 34; if (L[E + 4] < top - 25 || L[E + 4] < -1) { var y = top + 20 + Math.random() * 15; L[E + 1] = y; L[E + 4] = y - .9; } }
    } else {
      for (var i = 0; i < L.length; i += 3) { L[i + 1] -= dt * (1.4 + (i % 7) * .12); if (L[i + 1] < -.5) L[i + 1] = top + 15 + Math.random() * 10; }
    }
    a.needsUpdate = true;
  }

  /* ---------- main hook ---------- */
  function hook() {
    W = window.__fyrusW; T = window.THREE;
    if (!W || !W.env || !T || !W.env.sky || !W.env.sky.material || !W.env.sky.material.uniforms) return false;
    env = W.env; U = env.sky.material.uniforms; FLASH = new T.Color(0xc8d4ff);
    if (env.__fxAtmos) return true;
    env.__fxAtmos = true;
    origUpdate = env.update;
    var lastT = performance.now();
    env.update = function (dt, time, settings, cam, pos, ren) {
      var h = hourNow(), self = this, args = arguments;
      if (h != null) { var s2 = Object.assign({}, settings, { time: 'fx-4d' }); withHour(h, function () { origUpdate.call(self, dt, time, s2, cam, pos, ren); }); }
      else origUpdate.apply(this, args);
      try { after(dt, time, settings, pos); } catch (e) { if (window.console) console.warn('[fyrus-atmos]', e); }
    };
    makeFx();
    return true;
  }
  function after(dt, t, st, pos) {
    if (!U) return;
    var target = snap();
    if (first || !cur) { cur = target; first = false; }
    else lerpState(cur, target, tm.mode === 'lapse' ? 1 - Math.exp(-dt * 8) : 1 - Math.exp(-dt * 1.1));
    /* wind and precipitation fade */
    wind = .35 + Math.sin(t * .05) * .25 + Math.sin(t * .13 + 1) * .15 + (st.weather === 'rain' ? .3 : 0);
    rainAmt += ((st.weather === 'rain' ? 1 : 0) - rainAmt) * Math.min(1, dt * .5);
    snowAmt += ((st.weather === 'snow' ? 1 : 0) - snowAmt) * Math.min(1, dt * .5);
    var p = pos || W.player.root.position;
    if (env.rain) {
      env.rain.visible = rainAmt > .02; env.rain.material.opacity = .45 * rainAmt + flash * .2; env.rain.rotation.set(wind * .12, 0, -wind * .22);
      if (env.rain.visible && st.weather !== 'rain') fall(env.rain, dt, p, true);
    }
    if (env.snow) {
      env.snow.visible = snowAmt > .02; env.snow.material.opacity = .9 * snowAmt;
      if (env.snow.visible && st.weather !== 'snow') fall(env.snow, dt, p, false);
    }
    updateStorm(dt, p);
    write(cur, flash);
    updateSplashes(dt, p);
    updatePetals(dt, t, p, st);
    updateRainbow(dt, p, st);
    if (tm.mode !== 'off') updateChip();
  }

  /* ---------- UI: inside the Weather & mood window ---------- */
  var css = '' +
    '.fxs-box{margin-top:14px;border:1px solid rgba(201,169,110,.25);border-radius:14px;padding:12px 14px;background:rgba(10,15,26,.55);text-align:left}' +
    '.fxs-k{font:500 10px "JetBrains Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:#c9a96e}' +
    '.fxs-row{display:flex;align-items:center;gap:10px;margin-top:10px;flex-wrap:wrap}' +
    '.fxs-row input[type=range]{flex:1;min-width:140px;accent-color:#c9a96e}' +
    '.fxs-t{font:600 15px "JetBrains Mono",monospace;color:#f4efe6;min-width:54px}' +
    '.fxs-b{border:1px solid rgba(201,169,110,.45);background:rgba(201,169,110,.12);color:#e8d5a8;border-radius:999px;padding:7px 12px;font:600 12px Sora,sans-serif;cursor:pointer}' +
    '.fxs-b:hover{background:rgba(201,169,110,.25)}' +
    '.fxs-c{display:flex;align-items:center;gap:6px;font:500 12px "Plus Jakarta Sans",sans-serif;color:#cfd5df;cursor:pointer}' +
    '.fxs-c input{accent-color:#c9a96e}' +
    '.fxs-chip{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 112px);transform:translateX(-50%);z-index:60;display:none;align-items:center;gap:8px;padding:6px 8px 6px 14px;border-radius:999px;background:rgba(10,15,26,.82);border:1px solid rgba(201,169,110,.4);color:#f4efe6;font:600 12px "JetBrains Mono",monospace;letter-spacing:.06em;backdrop-filter:blur(8px)}' +
    '.fxs-chip button{border:0;border-radius:999px;background:rgba(201,169,110,.2);color:#e8d5a8;font:600 11px Sora,sans-serif;padding:4px 10px;cursor:pointer}';
  var styled = false;
  function style() { if (styled) return; styled = true; var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }
  function fmt(h) { var hh = Math.floor(h), mm = Math.floor((h - hh) * 60); return (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm; }
  function realHour() { var d = new RealDate(); return d.getHours() + d.getMinutes() / 60; }
  var chip = null;
  function updateChip() {
    style();
    if (!chip) {
      chip = document.createElement('div'); chip.className = 'fxs-chip';
      chip.innerHTML = '<span></span><button type="button">Exit</button>';
      chip.querySelector('button').onclick = function () { API.live(); };
      document.body.appendChild(chip);
    }
    if (tm.mode === 'off') { chip.style.display = 'none'; return; }
    var h = hourNow(); if (h == null) { chip.style.display = 'none'; return; }
    chip.style.display = 'flex';
    chip.firstChild.textContent = (tm.mode === 'lapse' ? '▶ 4D time-lapse  ' : '4D time  ') + fmt(h);
  }
  API.setHour = function (h) { tm.mode = 'fixed'; tm.hour = ((+h % 24) + 24) % 24; updateChip(); };
  API.timelapse = function () { tm.mode = 'lapse'; tm.t0 = performance.now(); tm.from = hourNow() != null ? hourNow() : realHour(); updateChip(); };
  API.live = function () { tm.mode = 'off'; updateChip(); };
  API.strike = function () { if (fx && W) strike(W.player.root.position); };
  API.state = function () { return { mode: tm.mode, hour: hourNow(), rain: rainAmt, wind: wind, rainbow: rainbowT, opts: opts }; };

  function panel() {
    style();
    var box = document.createElement('div'); box.className = 'fxs-box';
    var h0 = hourNow(); if (h0 == null) h0 = realHour();
    box.innerHTML = '<div class="fxs-k">4D sky · time machine</div>' +
      '<div class="fxs-row"><span class="fxs-t">' + fmt(h0) + '</span><input type="range" min="0" max="23.9" step="0.1" value="' + h0.toFixed(1) + '" aria-label="Hour of the day"></div>' +
      '<div class="fxs-row"><button type="button" class="fxs-b" data-a="lapse">▶ Watch 24 hours in 1 minute</button><button type="button" class="fxs-b" data-a="live">Back to normal sky</button></div>' +
      '<div class="fxs-row">' +
      '<label class="fxs-c"><input type="checkbox" data-o="storms"' + (opts.storms ? ' checked' : '') + '> Lightning & thunder</label>' +
      '<label class="fxs-c"><input type="checkbox" data-o="petals"' + (opts.petals ? ' checked' : '') + '> Petals & leaves</label>' +
      '<label class="fxs-c"><input type="checkbox" data-o="splashes"' + (opts.splashes ? ' checked' : '') + '> Rain splashes</label></div>';
    var rng = box.querySelector('input[type=range]'), lbl = box.querySelector('.fxs-t');
    rng.oninput = function () { API.setHour(+rng.value); lbl.textContent = fmt(+rng.value); };
    box.querySelector('[data-a=lapse]').onclick = function () { API.timelapse(); var c = box.closest('.fxp-ov'); var x = c && c.querySelector('.fxp-btn.ghost'); if (x) x.click(); };
    box.querySelector('[data-a=live]').onclick = function () { API.live(); var h = realHour(); rng.value = h.toFixed(1); lbl.textContent = fmt(h); };
    Array.prototype.forEach.call(box.querySelectorAll('[data-o]'), function (c) { c.onchange = function () { opts[c.dataset.o] = c.checked; LS.set(c.dataset.o, c.checked); }; });
    return box;
  }
  function decorate() {
    var cards = document.querySelectorAll('.fxp-ov .fxp-card');
    Array.prototype.forEach.call(cards, function (card) {
      if (card.__fxa || !card.querySelector('.fxp-mood')) return;
      card.__fxa = true;
      var grid = card.querySelector('.fxp-grid');
      if (grid && grid.parentNode) grid.parentNode.insertBefore(panel(), grid.nextSibling);
    });
  }
  var decoPending = false;
  new MutationObserver(function () { if (decoPending) return; decoPending = true; setTimeout(function () { decoPending = false; decorate(); }, 60); }).observe(document.documentElement, { childList: true, subtree: true });

  var tries = 0;
  (function wait() { if (hook()) return; if (++tries < 600) setTimeout(wait, 500); })();
  /* a new world instance (after a reload of the scene) needs the hook again */
  setInterval(function () { if (window.__fyrusW && window.__fyrusW.env && !window.__fyrusW.env.__fxAtmos) { first = true; fx = null; hook(); } }, 3000);
})();
