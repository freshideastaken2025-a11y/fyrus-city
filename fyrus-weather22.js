/* FYRUS 22.7 weather controller. Kill switch: ?p22off=weather (then "Live" weather stays clear).
 * Used when Settings > World > Weather is "Live" (settings.weather === 'auto'); a manual choice is never overridden.
 * Weather changes every slot (default 6 min of real time) following a season-aware Markov chain. The chain is seeded by
 * the slot number only, so every client computes the same weather at the same time without any server traffic.
 * The sky / fog / sun / rain blend over ~15 s in the engine (019.js weatherBlend).
 * API: window.__fyrusWeather = { current, next, changeIn, slot, forecast(n), effective/rain/snow (set by the engine) }.
 * Dev/test: ?wxslot=<seconds> slot length, ?wxforce=<name> pin a state. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var OFF = (Q.get('p22off') || '').split(',').some(function (k) { return k === 'weather' || k === 'all'; });
  var SLOT = Math.max(10, parseFloat(Q.get('wxslot')) || 360), FORCE = Q.get('wxforce');
  var NAMES = ['clear', 'cloudy', 'rain', 'snow', 'heat'];
  var W = window.__fyrusWeather = { version: '22.7', current: 'clear', next: 'clear', changeIn: 0, slot: 0, slotSec: SLOT, off: OFF, changes: 0 };
  if (OFF) return;
  function rnd(n) { var h = Math.sin(n * 12.9898 + 4.1414) * 43758.5453; return h - Math.floor(h); }
  function season() { try { return window.__fyrus.getState().settings.season || 'summer'; } catch (e) { return 'summer'; } }
  function step(prev, r, sea) {
    var wet = sea === 'winter' ? 'snow' : 'rain', hot = sea === 'summer' ? 'heat' : 'clear';
    var T = {
      clear: [['clear', 0.55], ['cloudy', 0.35], [hot, 0.10]],
      cloudy: [['clear', 0.35], ['cloudy', 0.30], [wet, 0.30], ['clear', 0.05]],
      rain: [['rain', 0.35], ['cloudy', 0.50], ['clear', 0.15]],
      snow: [['snow', 0.45], ['cloudy', 0.45], ['clear', 0.10]],
      heat: [['heat', 0.40], ['clear', 0.60]]
    }[prev] || [['clear', 1]];
    var acc = 0;
    for (var i = 0; i < T.length; i++) { acc += T[i][1]; if (r < acc) return T[i][0]; }
    return T[T.length - 1][0];
  }
  function at(slot, sea) {
    // walk the chain from a fixed anchor 12 slots back so the result depends only on the slot number
    var w = 'clear';
    for (var s = slot - 12; s <= slot; s++) w = step(w, rnd(s), sea);
    if (sea !== 'winter' && w === 'snow') w = 'rain';
    return w;
  }
  W.forecast = function (n) { var sea = season(), s0 = Math.floor(Date.now() / 1000 / SLOT), out = []; for (var i = 0; i < (n || 4); i++) out.push(at(s0 + i, sea)); return out; };
  function tick() {
    var now = Date.now() / 1000, slot = Math.floor(now / SLOT), sea = season();
    var cur = FORCE && NAMES.indexOf(FORCE) >= 0 ? FORCE : at(slot, sea);
    if (cur !== W.current) { W.changes++; (W.log = W.log || []).length < 50 && W.log.push({ t: Math.round(now), from: W.current, to: cur }); }
    W._n = (W._n || 0) + 1;
    if (W._n % 5 === 0 && W.effective != null) { (W.samples = W.samples || []).length < 80 && W.samples.push([W._n, W.current, W.effective, Math.round((W.rain || 0) * 100) / 100, Math.round((W.cloud || 0) * 100) / 100]); }
    W.current = cur; W.next = FORCE ? FORCE : at(slot + 1, sea); W.slot = slot; W.changeIn = Math.round((slot + 1) * SLOT - now); W.season = sea;
  }
  tick(); setInterval(tick, 1000);
})();
