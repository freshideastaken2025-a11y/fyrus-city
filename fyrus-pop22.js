/* FYRUS 22.11 time-based traffic and population. Kill switch: ?p22off=pop (densities stay at 100 %).
 * Publishes window.__fyrusPopulation = { hour, traffic, peds, weather } once per second. The traffic system (019.js)
 * scales its car count by `traffic` and the 22.3 pedestrian layer its active walkers by `peds`; both add and retire
 * agents only away from the player, so changes are gradual. Hour = 22.4 schedule hour (game clock / ?schedhour=).
 *   traffic: rush hours 07-09:30 and 16:30-19 = 100 %, daytime 75 %, evening 60 %, late night 30 %
 *   people:  lunch 12-14 and 17-20 = 100 %, day 80-90 %, evening 60 %, late night 15 %
 *   weather: rain halves the walkers (cars +10 %), snow 60 % walkers / 80 % cars, heatwave 70 % walkers at midday */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var OFF = (Q.get('p22off') || '').split(',').some(function (k) { return k === 'pop' || k === 'all'; });
  var P = window.__fyrusPopulation = { version: '22.12', budget: 1, fps: null, govSteps: 0, hour: null, traffic: 1, peds: 1, weather: null, off: OFF };
  if (OFF) return;
  var TR = [[0, .3], [5, .3], [7, .6], [7.5, 1], [9.5, 1], [10.5, .75], [16, .75], [16.5, 1], [19, 1], [20, .6], [22, .6], [23, .4], [24, .3]];
  var PE = [[0, .15], [5, .15], [7, .4], [8, .9], [9.5, .9], [10.5, .8], [12, 1], [14, 1], [15, .8], [17, 1], [20, 1], [21, .6], [22, .45], [23, .3], [24, .15]];
  function curve(c, h) { for (var i = 1; i < c.length; i++) if (h <= c[i][0]) { var a = c[i - 1], b = c[i], t = (h - a[0]) / (b[0] - a[0] || 1); return a[1] + (b[1] - a[1]) * t; } return c[c.length - 1][1]; }
  function hour() {
    var sc = window.__fyrusSchedule; if (sc && sc.hour && sc.hour() != null) return sc.hour();
    var t = 'auto'; try { t = window.__fyrus.getState().settings.time || 'auto'; } catch (e) {}
    if (t === 'dawn') return 6.6; if (t === 'day') return 13; if (t === 'sunset') return 18.2; if (t === 'night') return 22.5;
    var d = new Date(); return d.getHours() + d.getMinutes() / 60;
  }
  function weather() {
    var s = 'clear'; try { s = window.__fyrus.getState().settings.weather; } catch (e) {}
    if (s === 'auto') { var w = window.__fyrusWeather; s = (w && w.effective) || 'clear'; }
    return s;
  }
  /* 22.12 performance governor: the measured frame rate (rAF, 3 s window) scales the simulation budget. Below 45 fps for
   * 3 s in a row the budget drops by 0.15 (floor 0.4); above 58 fps for 6 s it recovers by 0.1 (max 1). The budget
   * multiplies both car and walker density, so a slow device sheds agents (never the player's own systems).
   * Test: ?simfps=<n> feeds a fixed fps to the governor. Kill switch for the governor only: ?p22off=gov */
  var GOV = !(Q.get('p22off') || '').split(',').some(function (k) { return k === 'gov'; }), SIMFPS = parseFloat(Q.get('simfps')) || 0;
  var frames = 0, lastT = performance.now(), low = 0, high = 0;
  (function raf() { frames++; requestAnimationFrame(raf); })();
  function govern() {
    var now = performance.now(), dt = (now - lastT) / 1000; if (dt < 1) return; 
    var fps = SIMFPS || frames / dt; frames = 0; lastT = now; P.fps = Math.round(fps * 10) / 10;
    if (!GOV || document.hidden) return;
    if (fps < 45) { low += dt; high = 0; } else if (fps > 58) { high += dt; low = 0; } else { low = 0; high = 0; }
    if (low >= 3 && P.budget > 0.4) { P.budget = Math.max(0.4, Math.round((P.budget - 0.15) * 100) / 100); low = 0; P.govSteps++; }
    if (high >= 6 && P.budget < 1) { P.budget = Math.min(1, Math.round((P.budget + 0.1) * 100) / 100); high = 0; P.govSteps++; }
  }
  function tick() {
    govern();
    var h = hour(), wx = weather(), tr = curve(TR, h), pe = curve(PE, h);
    if (wx === 'rain') { pe *= 0.5; tr = Math.min(1, tr * 1.1); }
    else if (wx === 'snow') { pe *= 0.6; tr *= 0.8; }
    else if (wx === 'heat' && h > 11 && h < 16) pe *= 0.7;
    tr *= P.budget; pe *= P.budget;
    P.hour = Math.round(h * 100) / 100; P.weather = wx; P.traffic = Math.round(tr * 100) / 100; P.peds = Math.round(pe * 100) / 100;
    try { var W = window.__fyrusW; if (W && W.traffic) { P.cars = W.traffic.cars.length; P.carsWanted = W.traffic.want; P.carsRetired = W.traffic.retired || 0; } } catch (e) {}
    try { var ps = window.__fyrusPeds22 && window.__fyrusPeds22.stats; if (ps) { P.walkers = ps.walkers; P.walkerLimit = ps.limit; } } catch (e) {}
  }
  tick(); setInterval(tick, 1000);
})();
