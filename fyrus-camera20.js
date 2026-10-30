/* FYRUS 20.11 camera collision (city world). Chains window.__fyrusCamera(d, h), the engine's hook between the
 * desired third-person camera position d and the look point h. Every frame the segment h->d is tested in the ground
 * plane against the city colliders (the circles the player already collides with, inflated by 0.35 m). The camera is
 * pulled in to just before the first hit at once, and eased back out (8 %/frame) when the view clears, so it never
 * sits inside a home or landmark and does not pump. The engine still lerps toward d and keeps it above the ground.
 * Kill switch: ?p20off=camcol   Stats: window.__fyrusCam20.stats */
(function () {
  'use strict';
  var off = (new URLSearchParams(location.search).get('p20off') || '').split(',');
  if (off.indexOf('camcol') >= 0 || off.indexOf('all') >= 0) return;
  var PAD = 0.35, MIN = 0.12, EASE = 0.08, HMAX = 14;
  var cur = null, S = { frames: 0, pulled: 0, lastT: 1, colliders: 0, ms: 0 };
  var prev = window.__fyrusCamera;
  function hitT(hx, hz, dx, dz, C) {
    var a = dx * dx + dz * dz, t = 1;
    if (a < 1e-8) return 1;
    var minx = Math.min(hx, hx + dx), maxx = Math.max(hx, hx + dx), minz = Math.min(hz, hz + dz), maxz = Math.max(hz, hz + dz);
    for (var i = 0; i < C.length; i++) {
      var c = C[i], R = (c.r || 0) + PAD;
      if (c.x + R < minx || c.x - R > maxx || c.z + R < minz || c.z - R > maxz) continue;   // bbox reject
      var fx = hx - c.x, fz = hz - c.z, cc = fx * fx + fz * fz - R * R;
      if (cc < 0) continue;                                    // the look point itself is inside: do not trap the camera
      var b = 2 * (fx * dx + fz * dz), disc = b * b - 4 * a * cc;
      if (disc < 0) continue;
      var tt = (-b - Math.sqrt(disc)) / (2 * a);
      if (tt > 0 && tt < t) t = tt;
    }
    return t;
  }
  function hook(d, h) {
    if (prev) prev(d, h);
    var W = window.__fyrusW; if (!W) return;
    var t0 = performance.now(), C = W.colliders || [];
    S.colliders = C.length; S.frames++;
    var th = d.y - h.y > HMAX ? 1 : hitT(h.x, h.z, d.x - h.x, d.z - h.z, C), target = th >= 1 ? 1 : Math.max(MIN, th - 0.04);
    cur = cur === null || target < cur ? target : cur + (target - cur) * EASE;
    if (cur < 0.999) { d.set(h.x + (d.x - h.x) * cur, h.y + (d.y - h.y) * cur, h.z + (d.z - h.z) * cur); S.pulled++; }
    S.lastT = Math.round(cur * 1000) / 1000;
    S.ms = Math.round((S.ms * 0.95 + (performance.now() - t0) * 0.05) * 1000) / 1000;
  }
  window.__fyrusCamera = hook;
  window.__fyrusCam20 = { version: '20.11', stats: S, hitT: hitT };
})();
