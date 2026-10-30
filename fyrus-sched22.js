/* FYRUS 22.4 NPC daily schedules. Kill switch: ?p22off=sched   (test override: ?schedhour=0..24)
 * The named city NPCs (W.npcs, class ku in 019.js) keep their own wander/talk/greet logic; this layer only moves their
 * anchor (`home`) and wander radius over the day, so talking to them, greetings and interactions are unchanged.
 * Game hour = the same mapping the sky uses (dawn 6.6, day 13, sunset 18.2, night 22.5, auto = real clock).
 *   06-08 arrive (post, half wander)    08-12 work (post)          12-13.5 lunch (break spot)
 *   13.5-18 work (post)                 18-21 evening (social spot) 21-06 rest (post, standing still)
 * Night roles (club, DJ, bartender, promoter, musician) work 18-03 and rest 06-14. Elders keep half radius and never
 * travel more than 30 m. Each NPC is offset by up to +-30 min so they do not all move at once.
 * Break / social spots are walkable points checked with groundAt (pavement / plaza, not on buildings) at most 30 m
 * (break) or 60 m (social, plaza ring when the post is within 140 m of the centre) from the post.
 * Stats: window.__fyrusSchedule.stats { hour, phases, moves, npcs }. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p22off') || '').split(',').some(function (k) { return k === 'sched' || k === 'all'; })) return;
  var S = { hour: null, phases: {}, moves: 0, npcs: 0, spotsFailed: 0, errors: 0, ms: 0 };
  var API = window.__fyrusSchedule = { version: '22.4', stats: S, hour: function () { return S.hour; } };
  var W, T, st = new Map(), acc = 1;
  var NIGHT = /club|dj|bartender|promoter|musician/i;
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function gameHour() {
    var o = parseFloat(Q.get('schedhour')); if (!isNaN(o)) return ((o % 24) + 24) % 24;
    var t = 'auto'; try { t = window.__fyrus.getState().settings.time || 'auto'; } catch (e) {}
    if (t === 'dawn') return 6.6; if (t === 'day') return 13; if (t === 'sunset') return 18.2; if (t === 'night') return 22.5;
    var d = new Date(); return d.getHours() + d.getMinutes() / 60;
  }
  function phaseOf(h, night) {
    if (night) return h >= 18 || h < 3 ? 'work' : h < 6 ? 'evening' : h < 14 ? 'rest' : 'arrive';
    if (h >= 6 && h < 8) return 'arrive'; if (h >= 8 && h < 12) return 'work'; if (h >= 12 && h < 13.5) return 'lunch';
    if (h >= 13.5 && h < 18) return 'work'; if (h >= 18 && h < 21) return 'evening'; return 'rest';
  }
  function walkable(x, z) { var g = W.groundAt ? W.groundAt(x, z) : 0; return g < 0.3; }
  function lineOk(a, x, z) { for (var k = 1; k <= 6; k++) { var t = k / 6; if (!walkable(a.x + (x - a.x) * t, a.z + (z - a.z) * t)) return false; } return true; }
  function findSpot(post, seed, rmin, rmax, ring) {
    for (var t = 0; t < 24; t++) {
      var a = (seed + t * 0.137) * Math.PI * 2, x, z;
      if (ring) { var rr = 22 + 10 * ((seed * 7 + t * 0.31) % 1); x = Math.cos(a) * rr; z = Math.sin(a) * rr; if (Math.hypot(x - post.x, z - post.z) > rmax) continue; }
      else { var r = rmin + (rmax - rmin) * ((seed * 13 + t * 0.29) % 1); x = post.x + Math.cos(a) * r; z = post.z + Math.sin(a) * r; }
      if (walkable(x, z) && lineOk(post, x, z)) return new T.Vector3(x, 0, z);
    }
    S.spotsFailed++; return null;
  }
  function info(n) {
    var id = n.def.id || n.def.name, s = st.get(id);
    if (s) return s;
    var seed = hash(String(id)), post = n.home.clone(), elder = !!n.def.elder, night = NIGHT.test(n.def.role || '');
    var nearC = Math.hypot(post.x, post.z) < 140 && !elder;
    s = { post: post, wander: n.def.wander || 0, night: night, elder: elder, jitter: (seed - 0.5), phase: null,
      lunch: findSpot(post, seed, 8, elder ? 18 : 30, false) };
    s.social = nearC ? findSpot(post, seed, 0, 140, true) : null;
    if (!s.social) s.social = findSpot(post, (seed + 0.5) % 1, 6, elder ? 20 : 30, false) || s.lunch;
    st.set(id, s); return s;
  }
  function apply(n, s, ph) {
    var anchor = s.post, w = s.wander;
    if (ph === 'arrive') w = s.wander * 0.5;
    else if (ph === 'lunch' && s.lunch) { anchor = s.lunch; w = 2; }
    else if (ph === 'evening' && s.social) { anchor = s.social; w = 4; }
    else if (ph === 'rest') w = 0;
    if (s.elder) w *= 0.5;
    if (s.wander <= 0) { anchor = s.post; w = 0; }          // fixed NPCs (DJ booth, counters) never move
    if (!n.home.equals(anchor)) {
      n.home.copy(anchor); S.moves++;
      // walk there: give the NPC the anchor as its next target (ku clears it on arrival and resumes wandering)
      n.av.target = anchor.clone(); n.wait = 0;
    }
    n.def.wander = w;
  }
  function tick(dt) {
    acc += dt; if (acc < 1) return; acc = 0;
    var t0 = performance.now();
    try {
      var h = gameHour(); S.hour = Math.round(h * 100) / 100;
      var list = W.npcs && W.npcs.list || [], ph = {}, dsum = 0, dn = 0, away = 0;
      for (var i = 0; i < list.length; i++) {
        var n = list[i]; if (!n || !n.def || !n.home || !n.av) continue;
        var s = info(n), p = phaseOf((h + s.jitter + 24) % 24, s.night);
        s.phase = p; ph[p] = (ph[p] || 0) + 1;
        apply(n, s, p);
        var d = n.av.root.position.distanceTo(n.home); dsum += d; dn++; if (!n.home.equals(s.post)) away++;
      }
      S.avgDistToAnchor = dn ? Math.round(dsum / dn * 10) / 10 : null; S.awayFromPost = away;
      S.phases = ph; S.npcs = list.length;
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
    S.ms = Math.round((S.ms * 0.9 + (performance.now() - t0) * 0.1) * 1000) / 1000;
  }
  API.state = function () { var o = {}; st.forEach(function (s, id) { o[id] = s.phase; }); return o; };
  var last = performance.now();
  function start() {
    T = window.THREE; W = window.__fyrusW;
    var r = W.renderer, orig = r.render;
    r.render = function () { var now = performance.now(); tick(Math.min(1, (now - last) / 1000)); last = now; return orig.apply(this, arguments); };
    S.hooked = true;
  }
  (function wait() { var w = window.__fyrusW; if (w && w.renderer && w.npcs && w.world && window.THREE) start(); else setTimeout(wait, 500); })();
})();
