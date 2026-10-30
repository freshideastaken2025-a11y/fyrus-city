/* FYRUS 22.10 ambient city sound. Kill switch: ?p22off=sound. Mute only ambience: localStorage fyrus.ambience = "0".
 * All sound is synthesised with WebAudio (no audio files, no network): a few looping noise beds and short procedural
 * calls, mixed from what is around the player every 250 ms:
 *   city hum   - low rumble, louder in the dense city than in open areas
 *   traffic    - band-passed noise whose level follows the speed of cars within 45 m (louder when they are close)
 *   crowd      - murmur from pedestrians and NPCs within 20 m
 *   rain       - hiss from the 22.7 rain blend; wind - slow swept noise from cloud cover / storms
 *   birds      - short chirps by day near green areas (not in rain); crickets at night (not in rain or snow)
 * Master level = Settings volume x 0.5. Starts after the first click / key / touch (browser autoplay rule). Inside
 * homes and interiors the beds are muffled (low-pass) and quieter. Stats: window.__fyrusAmbience.stats (target levels,
 * measured output RMS, context state, CPU ms). */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p22off') || '').split(',').some(function (k) { return k === 'sound' || k === 'all'; })) return;
  var S = { state: 'idle', levels: {}, rms: 0, rmsMax: 0, chirps: 0, crickets: 0, ms: 0, errors: 0 };
  var API = window.__fyrusAmbience = { version: '22.10', stats: S };
  var ac = null, master = null, muff = null, an = null, beds = {}, W = null, started = false;
  function enabled() { try { return localStorage.getItem('fyrus.ambience') !== '0'; } catch (e) { return true; } }
  function st() { try { return window.__fyrus.getState().settings; } catch (e) { return {}; } }
  function noiseBuf(kind) {
    var len = ac.sampleRate * 4, b = ac.createBuffer(1, len, ac.sampleRate), d = b.getChannelData(0), last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (var i = 0; i < len; i++) {
      var w = Math.random() * 2 - 1;
      if (kind === 'brown') { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
      else if (kind === 'pink') { b0 = 0.99765 * b0 + w * 0.099; b1 = 0.963 * b1 + w * 0.2965; b2 = 0.57 * b2 + w * 1.0527; d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.12; }
      else d[i] = w * 0.5;
    }
    // crossfade the loop seam
    for (var j = 0; j < 2000; j++) { var k = j / 2000; d[len - 2000 + j] = d[len - 2000 + j] * (1 - k) + d[j] * k; }
    return b;
  }
  function bed(name, kind, type, freq, q) {
    var src = ac.createBufferSource(); src.buffer = noiseBuf(kind); src.loop = true;
    var f = ac.createBiquadFilter(); f.type = type; f.frequency.value = freq; if (q) f.Q.value = q;
    var g = ac.createGain(); g.gain.value = 0;
    src.connect(f); f.connect(g); g.connect(muff); src.start();
    beds[name] = { src: src, f: f, g: g };
  }
  function start() {
    if (started || !enabled()) return;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) { S.state = 'unsupported'; return; }
    try {
      ac = new AC(); master = ac.createGain(); master.gain.value = 0; muff = ac.createBiquadFilter(); muff.type = 'lowpass'; muff.frequency.value = 18000;
      an = ac.createAnalyser(); an.fftSize = 1024;
      muff.connect(master); master.connect(an); an.connect(ac.destination);
      bed('hum', 'brown', 'lowpass', 140);
      bed('traffic', 'brown', 'bandpass', 420, 0.7);
      bed('crowd', 'pink', 'bandpass', 900, 1.4);
      bed('rain', 'white', 'highpass', 1800);
      bed('wind', 'pink', 'bandpass', 500, 0.9);
      started = true; S.state = ac.state;
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) { window.addEventListener(ev, function () { start(); if (ac && ac.state === 'suspended') ac.resume(); }, { passive: true }); });
  if (Q.get('ambtest')) setTimeout(start, 3000);      // bench: the bench browser allows audio without a gesture
  function chirp(t0, base, vol, n) {
    for (var i = 0; i < n; i++) {
      var o = ac.createOscillator(), g = ac.createGain(), t = t0 + i * (0.09 + Math.random() * 0.05), f = base * (0.9 + Math.random() * 0.25);
      o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * (1.25 + Math.random() * 0.3), t + 0.06);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g); g.connect(muff); o.start(t); o.stop(t + 0.1);
    }
  }
  function cricket(t0, vol) {
    var o = ac.createOscillator(), g = ac.createGain(); o.type = 'square'; o.frequency.value = 4400 + Math.random() * 400;
    var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 4600; bp.Q.value = 6;
    g.gain.value = 0; for (var i = 0; i < 6; i++) { var t = t0 + i * 0.045; g.gain.setValueAtTime(vol, t); g.gain.setValueAtTime(0, t + 0.022); }
    o.connect(bp); bp.connect(g); g.connect(muff); o.start(t0); o.stop(t0 + 0.3);
  }
  function set(name, v, tc) { var b = beds[name]; if (!b) return; b.g.gain.setTargetAtTime(v, ac.currentTime, tc || 0.6); S.levels[name] = Math.round(v * 1000) / 1000; }
  var nextChirp = 0, nextCricket = 0, buf = null;
  function mix() {
    W = window.__fyrusW; if (!W || !W.player) return;
    if (!started) { S.state = 'waiting-for-gesture'; return; }
    var t0 = performance.now();
    try {
      var s = st(), vol = (s.volume == null ? 0.8 : s.volume) * 0.5 * (enabled() ? 1 : 0);
      master.gain.setTargetAtTime(vol, ac.currentTime, 0.4);
      var inWorld = W.active === W.world, p = W.player.root.position;
      muff.frequency.setTargetAtTime(inWorld ? 18000 : 650, ac.currentTime, 0.3);
      var wx = window.__fyrusWeather || {}, rain = wx.rain != null ? wx.rain : (s.weather === 'rain' ? 1 : 0), cloud = wx.cloud != null ? wx.cloud : 0.25;
      var night = 0; try { night = W.env && W.env.night != null ? W.env.night : 0; } catch (e) {}
      // traffic: sum of car speed / distance within 45 m
      var tr = 0; (W.traffic && W.traffic.cars || []).forEach(function (c) { var d = Math.hypot(c.x - p.x, c.z - p.z); if (d < 45) tr += (Math.abs(c.speed) / 12) * (1 - d / 45) * (1 - d / 45); });
      // crowd: walkers + NPCs within 20 m
      var cr = 0; (W.npcs && W.npcs.list || []).forEach(function (n) { var q = n.av.root.position; if (Math.hypot(q.x - p.x, q.z - p.z) < 20) cr++; });
      var pd = window.__fyrusPeds22 && window.__fyrusPeds22.stats; cr += pd && pd.near ? pd.near : 0;
      var dense = Math.min(1, Math.hypot(p.x, p.z) < 70 ? 1 : 0.6);
      var k = inWorld ? 1 : 0.35;
      set('hum', (0.10 + 0.08 * dense) * k);
      set('traffic', Math.min(0.5, tr * 0.35) * k, 0.3);
      set('crowd', Math.min(0.28, cr * 0.035) * k);
      set('rain', rain * 0.30 * (inWorld ? 1 : 0.5), 1.2);
      set('wind', (0.03 + 0.10 * Math.max(0, cloud - 0.3) + 0.08 * rain) * k, 1.5);
      if (beds.wind) beds.wind.f.frequency.setTargetAtTime(380 + 260 * Math.sin(ac.currentTime * 0.13), ac.currentTime, 2);
      var now = ac.currentTime;
      if (inWorld && night < 0.4 && rain < 0.2 && now > nextChirp) { chirp(now + Math.random() * 0.2, 2600 + Math.random() * 1600, 0.05 * (1 - night), 2 + Math.floor(Math.random() * 4)); S.chirps++; nextChirp = now + 2 + Math.random() * 6; }
      if (inWorld && night > 0.6 && rain < 0.1 && s.weather !== 'snow' && now > nextCricket) { cricket(now, 0.025); S.crickets++; nextCricket = now + 0.6 + Math.random() * 1.4; }
      // measured output level (proves sound is actually produced)
      buf = buf || new Float32Array(an.fftSize); an.getFloatTimeDomainData(buf);
      var sum = 0; for (var i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
      S.rms = Math.round(Math.sqrt(sum / buf.length) * 10000) / 10000; S.rmsMax = Math.max(S.rmsMax, S.rms); S.state = ac.state; S.inWorld = inWorld;
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
    S.ms = Math.round((S.ms * 0.9 + (performance.now() - t0) * 0.1) * 1000) / 1000;
  }
  setInterval(mix, 250);
  // Offline render check (no autoplay restriction): builds the same beds and calls into an OfflineAudioContext at the
  // levels the live mixer last chose (or defaults), renders 2 s and reports per-part RMS.
  API.selfTest = function () {
    var keep = { ac: ac, master: master, muff: muff, beds: beds };
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return Promise.resolve({ error: 'no OfflineAudioContext' });
    var off = new OAC(1, 44100 * 2, 44100); ac = off; beds = {};
    muff = off.createBiquadFilter(); muff.type = 'lowpass'; muff.frequency.value = 18000; master = off.createGain(); master.gain.value = 0.4; muff.connect(master); master.connect(off.destination);
    var lv = { hum: 0.16, traffic: 0.2, crowd: 0.1, rain: 0.3, wind: 0.08 };
    Object.keys(keep.beds).length && Object.keys(S.levels).forEach(function (k) { if (S.levels[k] > 0) lv[k] = S.levels[k]; });
    bed('hum', 'brown', 'lowpass', 140); bed('traffic', 'brown', 'bandpass', 420, 0.7); bed('crowd', 'pink', 'bandpass', 900, 1.4); bed('rain', 'white', 'highpass', 1800); bed('wind', 'pink', 'bandpass', 500, 0.9);
    Object.keys(beds).forEach(function (k) { beds[k].g.gain.value = lv[k] || 0; });
    chirp(0.5, 3000, 0.05, 3); cricket(1.2, 0.025);
    var restore = function () { ac = keep.ac; master = keep.master; muff = keep.muff; beds = keep.beds; };
    restore();
    return off.startRendering().then(function (b) {
      var d = b.getChannelData(0), sum = 0, peak = 0; for (var i = 0; i < d.length; i++) { sum += d[i] * d[i]; peak = Math.max(peak, Math.abs(d[i])); }
      return { rms: Math.round(Math.sqrt(sum / d.length) * 10000) / 10000, peak: Math.round(peak * 1000) / 1000, levels: lv, seconds: 2 };
    }).catch(function (e) { return { error: String(e) }; });
  };
  if (Q.get('ambtest')) setTimeout(function () { API.selfTest().then(function (r) { S.selfTest = r; }); }, 6000);
  API.setEnabled = function (on) { try { localStorage.setItem('fyrus.ambience', on ? '1' : '0'); } catch (e) {} if (on) start(); };
})();
