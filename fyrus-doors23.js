/* FYRUS 23.3 doors and elevators: transitions for interactions that change place. Kill switch: ?p23off=doors
 * The engine's doors, building entrances, interior exits and lifts teleport the player (a new scene loads). This layer
 * (via window.__fyrusTransition, called by the 23.1 interaction controller) turns that cut into a short transition:
 *   door / entrance / exit: a door "click + swing" sound, fade to black (220 ms), the engine action runs at full black,
 *     then the view fades back in once the new scene has drawn a frame (max 1.8 s).
 *   lift (label mentions lift / elevator): doors-closing chime, 1.2 s ride with a floor indicator and a soft hum, then the
 *     arrival chime and fade in.
 * prefers-reduced-motion: no fades, the action runs at once (sounds stay, they are short and quiet).
 * An aria-live region announces the destination for screen readers. Every wrapped action runs exactly once.
 * Stats: window.__fyrusDoors23.stats. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'doors' || k === 'all'; })) return;
  var S = { doors: 0, lifts: 0, runs: 0, skipped: 0, maxBlackMs: 0, errors: 0 };
  var API = window.__fyrusDoors23 = { version: '23.3', stats: S };
  var DOORISH = { door: 1, 'enter-home': 1, hall: 1, exit: 1, home: 1, club: 1, gov: 1, class: 1 };
  var reduce = false; try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var veil = null, live = null, busy = false, ac = null;
  function el() {
    if (veil) return;
    veil = document.createElement('div'); veil.setAttribute('aria-hidden', 'true');
    veil.style.cssText = 'position:fixed;inset:0;z-index:90;background:#05070a;opacity:0;pointer-events:none;transition:opacity 220ms ease;display:flex;align-items:center;justify-content:center;color:#e8ecf2;font:600 18px/1.3 system-ui,-apple-system,Segoe UI,Arial,sans-serif;letter-spacing:.04em';
    live = document.createElement('div'); live.setAttribute('aria-live', 'polite'); live.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
    document.body.appendChild(veil); document.body.appendChild(live);
  }
  function vol() { try { var v = window.__fyrus.getState().settings.volume; return v == null ? 0.8 : v; } catch (e) { return 0.8; } }
  function audio() {
    if (ac) return ac.state === 'running' ? ac : null;
    try { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ac = new AC(); if (ac.state !== 'running') ac.resume(); } catch (e) { ac = null; }
    return ac && ac.state === 'running' ? ac : null;
  }
  function tone(f, t, d, g) { var a = audio(); if (!a) return; var o = a.createOscillator(), G = a.createGain(); o.type = 'sine'; o.frequency.value = f; G.gain.setValueAtTime(0, a.currentTime + t); G.gain.linearRampToValueAtTime(g * vol(), a.currentTime + t + 0.01); G.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + t + d); o.connect(G); G.connect(a.destination); o.start(a.currentTime + t); o.stop(a.currentTime + t + d + 0.05); }
  function noise(t, d, f, g) { var a = audio(); if (!a) return; var n = Math.floor(a.sampleRate * d), b = a.createBuffer(1, n, a.sampleRate), c = b.getChannelData(0); for (var i = 0; i < n; i++) c[i] = (Math.random() * 2 - 1) * (1 - i / n); var s = a.createBufferSource(); s.buffer = b; var bp = a.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f; bp.Q.value = 1.2; var G = a.createGain(); G.gain.value = g * vol(); s.connect(bp); bp.connect(G); G.connect(a.destination); s.start(a.currentTime + t); }
  function doorSound() { noise(0, 0.06, 2400, 0.35); noise(0.05, 0.45, 380, 0.18); }
  function liftSound(arrive) { if (arrive) { tone(1046, 0, 0.5, 0.12); tone(784, 0.22, 0.7, 0.12); } else { tone(784, 0, 0.4, 0.1); noise(0.1, 1.2, 160, 0.08); } }
  function dest(it) { return String(it.label || '').replace(/\s*—\s*(enter|take the lift|go inside).*$/i, '').replace(/^(Door\s*·\s*)/, '').slice(0, 60); }
  function scene() { var W = window.__fyrusW; return W ? W.active : null; }
  function waitFrame(prev, maxMs) {
    return new Promise(function (res) {
      var t0 = performance.now();
      (function chk() { var W = window.__fyrusW; if ((W && W.active !== prev) || performance.now() - t0 > maxMs) requestAnimationFrame(function () { requestAnimationFrame(res); }); else setTimeout(chk, 50); })();
    });
  }
  // 23.11: create the live region up front (screen readers only announce changes to regions that already exist)
  if (document.body) el(); else document.addEventListener('DOMContentLoaded', el);
  if (Q.get('reducemotion')) reduce = true;   // dev/test switch
  window.__fyrusTransition = function (it, run) {
    var lift = /\blift\b|elevator/i.test(it.label || '');
    if (!lift && !DOORISH[it.action]) return run();
    if (busy) { S.skipped++; return; }
    el(); busy = true; var name = dest(it), ran = false;
    function go() { if (ran) return; ran = true; S.runs++; try { run(); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); } }
    live.textContent = (lift ? 'Taking the lift: ' : 'Entering: ') + name;
    if (lift) { S.lifts++; liftSound(false); } else { S.doors++; doorSound(); }
    if (reduce) { go(); busy = false; if (lift) setTimeout(function () { liftSound(true); }, 300); return; }
    var prev = scene(), t0 = performance.now();
    veil.textContent = lift ? '▲  ' + name : ''; veil.style.opacity = '1';
    setTimeout(function () {
      go();
      waitFrame(prev, lift ? 1800 : 1500).then(function () {
        var rest = lift ? Math.max(0, 1200 - (performance.now() - t0)) : 0;
        setTimeout(function () {
          if (lift) liftSound(true);
          S.maxBlackMs = Math.max(S.maxBlackMs, Math.round(performance.now() - t0));
          veil.style.opacity = '0'; veil.textContent = ''; busy = false;
        }, rest);
      });
    }, 230);
  };
  API.test = function (label, action) {   // dev/bench: run a fake interaction through the transition
    return new Promise(function (res) { var n = 0; window.__fyrusTransition({ label: label, action: action }, function () { n++; }); setTimeout(function () { res({ runs: n, busy: busy, veil: veil ? veil.style.opacity : null, live: live ? live.textContent : null }); }, 2600); });
  };
})();
