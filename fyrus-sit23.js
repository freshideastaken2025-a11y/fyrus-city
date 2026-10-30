/* FYRUS 23.2 sitting and standing. Kill switch: ?p23off=sit
 * Street benches (22/21 furniture, window.__fyrusCity21.seats()) become sittable through the 23.1 interaction
 * controller: "Sit on bench" (E / tap) walks nothing - it seats the player on the nearest free half of the bench, facing
 * away from the backrest, and sets W.player.sitting (the avatar layer plays its Sit clip). "Stand up" (E), or simply
 * moving away (any movement input moves the root), stands the player up a step in front of the bench.
 * A seat taken by the player is not offered to others in this client; remote players' sitting is synced in 23.9.
 * Stats / test hook: window.__fyrusSit23 { stats, sitNearest(), stand() }. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'sit' || k === 'all'; })) return;
  var S = { sits: 0, stands: 0, autoStands: 0, seated: false, errors: 0 };
  var API = window.__fyrusSit23 = { version: '23.2', stats: S };
  var W = null, cur = null, seatPos = null, standPos = null;
  // the Sit clip is authored for a seat at root height: lift the root to the bench seat (0.45 m board, minus a little sink)
  var SEAT_Y = parseFloat(Q.get('seaty')) || 0.42;
  function seats() { try { return (window.__fyrusCity21 && window.__fyrusCity21.seats && window.__fyrusCity21.seats()) || []; } catch (e) { return []; } }
  // two places per 1.8 m bench, 0.45 m either side of the centre, 0.05 m forward of the seat centre
  function places(b) {
    var fx = -Math.sin(b.ang), fz = -Math.cos(b.ang), rx = Math.cos(b.ang), rz = -Math.sin(b.ang);
    return [-0.45, 0.45].map(function (o, i) { return { b: b, i: i, x: b.x + rx * o + fx * 0.05, z: b.z + rz * o + fz * 0.05, y: b.y, face: b.ang + Math.PI, fx: fx, fz: fz }; });
  }
  function sit(pl) {
    var p = W.player;
    if (!p || W.vehicle || W.trip) return false;
    cur = pl; S.sits++; S.seated = true;
    standPos = { x: pl.x + pl.fx * 0.9, z: pl.z + pl.fz * 0.9 };
    p.root.position.set(pl.x, pl.y + SEAT_Y, pl.z); p.root.rotation.y = pl.face;
    if (p.vel) p.vel.set(0, 0, 0); p.target = null;
    p.sitting = true; seatPos = p.root.position.clone();
    return true;
  }
  function stand(auto) {
    var p = W && W.player; if (!cur || !p) return;
    p.sitting = false;
    if (!auto && standPos) p.root.position.set(standPos.x, p.root.position.y, standPos.z);
    cur = null; seatPos = null; S.seated = false; S.stands++; if (auto) S.autoStands++;
  }
  API.stand = function () { stand(false); };
  API.sitNearest = function () {
    var p = W.player.root.position, best = null, bd = 1e9;
    seats().forEach(function (b) { places(b).forEach(function (pl) { var d = Math.hypot(pl.x - p.x, pl.z - p.z); if (d < bd) { bd = d; best = pl; } }); });
    return best ? { ok: sit(best), d: Math.round(bd * 10) / 10 } : { ok: false };
  };
  window.__fyrusExtraInteracts = (function (prev) {
    return function () {
      var out = prev ? prev() : [];
      if (!W || W.active !== W.world || !W.player) return out;
      var p = W.player.root.position;
      if (cur) { out.push({ pos: p.clone(), radius: 3, label: 'Stand up', action: 'stand', use: function () { stand(false); } }); return out; }
      var list = seats();
      for (var i = 0; i < list.length; i++) {
        var b = list[i]; if (Math.abs(b.x - p.x) > 4 || Math.abs(b.z - p.z) > 4) continue;
        places(b).forEach(function (pl) { out.push({ pos: new window.THREE.Vector3(pl.x, pl.y, pl.z), radius: 1.6, label: 'Sit on bench', action: 'sit', use: function () { sit(pl); } }); });
      }
      return out;
    };
  })(window.__fyrusExtraInteracts);
  setInterval(function () {
    W = window.__fyrusW; if (!W || !W.player || !cur) return;
    try {
      var p = W.player;
      if (W.active !== W.world || W.vehicle || W.trip) { stand(true); return; }
      // movement input moved the root away from the seat: the player stood up by walking off
      if (seatPos && Math.hypot(p.root.position.x - seatPos.x, p.root.position.z - seatPos.z) > 0.25) { stand(true); return; }
      p.sitting = true;
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }, 100);
  (function wait() { W = window.__fyrusW; if (!W) setTimeout(wait, 500); })();
})();
