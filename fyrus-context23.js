/* FYRUS 23.8 context-aware animation for the local player's avatar. Kill switch: ?p23off=context
 * Small additive bone adjustments applied right after the avatar's AnimationMixer update (the mixer's update is
 * wrapped per avatar), all eased in and out so clips never pop:
 *   look-at   - the head turns (up to 55 degrees) toward the nearest person in front within 6 m (NPC, walker, player,
 *               vendor), or the open stall / talk partner; while idle for 6 s with nobody near, it slowly looks around;
 *   carrying  - with an item in hand (23.4) the right forearm comes up and the wrist turns so the item stays upright;
 *   rain      - walking or running in rain (22.7 blend) leans the upper body slightly forward with the head down.
 * Rotations are applied about world axes (player right / world up) converted into each bone's parent space, so they
 * work for any rig orientation. Sitting, driving and emotes switch the adjustments off.
 * Stats: window.__fyrusContext23.stats. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'context' || k === 'all'; })) return;
  var S = { wrapped: 0, frames: 0, look: 0, carry: 0, rain: 0, idleLook: 0, bones: null, errors: 0, target: null };
  var API = window.__fyrusContext23 = { version: '23.8', stats: S };
  var pedsGrp = null, tgAcc = 1, tgCache = null;
  var T = null, bones = null, model = null, w = { look: 0, carry: 0, rain: 0 }, lookYaw = 0, idleT = 0;
  var q1, q2, v1, v2, UP;
  function find(m) {
    var b = {};
    m.traverse(function (o) {
      if (!o.isBone) return; var n = o.name.toLowerCase().replace(/^mixamorig:?/, '');
      if (!b.head && /^head$/.test(n)) b.head = o;
      if (!b.neck && /^neck$/.test(n)) b.neck = o;
      if (!b.spine && /^spine2$/.test(n)) b.spine = o;
      if (!b.fore && /(rightforearm|forearm_r|forearm\.r)$/.test(n)) b.fore = o;
      if (!b.hand && /(righthand|hand_r|hand\.r)$/.test(n)) b.hand = o;
    });
    if (!b.spine) m.traverse(function (o) { if (!b.spine && o.isBone && /spine1$/i.test(o.name)) b.spine = o; });
    S.bones = Object.keys(b).map(function (k) { return k + ':' + b[k].name; }).join(' ');
    return b;
  }
  // rotate bone by `ang` about a WORLD axis
  function rotWorld(bone, axis, ang) {
    if (!bone || !bone.parent || Math.abs(ang) < 1e-4) return;
    bone.parent.getWorldQuaternion(q1);
    q2.setFromAxisAngle(axis, ang);
    var inv = q1.clone().invert();
    bone.quaternion.premultiply(inv.multiply(q2).multiply(q1));
  }
  function ease(cur, want, dt, k) { return cur + (want - cur) * Math.min(1, dt * (k || 5)); }
  function lookTarget(W, p, yaw) {
    var best = null, bd = 6;
    function test(q) { var dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz); if (d < 0.6 || d > bd) return; var a = Math.atan2(dx, dz) - yaw; a = Math.atan2(Math.sin(a), Math.cos(a)); if (Math.abs(a) > 1.6) return; bd = d; best = { a: a, d: d }; }
    (W.npcs && W.npcs.list || []).forEach(function (n) { test(n.av.root.position); });
    if (W.peers) W.peers.forEach(function (l) { if (l.root) test(l.root.position); });
    if (!pedsGrp || pedsGrp.parent !== W.world) pedsGrp = W.world ? W.world.children.find(function (c) { return c.name === 'p22-peds'; }) || null : null;
    if (pedsGrp) pedsGrp.children.forEach(function (c) { if (c.visible && c.name !== 'p22-pigeons') test(c.position); });
    W.world && W.world.children.forEach(function (c) { if (c.name === 'p23-vendor') test(c.position); });
    return best;
  }
  function post(dt) {
    var W = window.__fyrusW, D = window.__fyrusAvatarDemo; if (!W || !W.player || !D || !D.model) return;
    if (D.model !== model) { model = D.model; bones = find(model); }
    if (!bones) return;
    S.frames++;
    var P = W.player, p = P.root.position, yaw = P.root.rotation.y, busy = P.sitting || W.vehicle || (D.state && /emote|action|air/.test(D.state));
    var right = v1.set(Math.cos(yaw), 0, -Math.sin(yaw));
    // look-at
    // target search at ~10 Hz (scene scans are not free); the angle is refreshed every frame from the cached distance
    if ((tgAcc += dt) > 0.1) { tgAcc = 0; tgCache = busy ? null : lookTarget(W, p, yaw); }
    var tg = busy ? null : tgCache, wantYaw = 0, wantLook = 0;
    var moving = (P.speed || 0) > 0.4;
    if (tg) { wantYaw = Math.max(-0.95, Math.min(0.95, tg.a)); wantLook = 1; idleT = 0; S.target = Math.round(tg.d * 10) / 10; }
    else if (!busy && !moving) { idleT += dt; if (idleT > 6) { wantYaw = Math.sin(idleT * 0.35) * 0.55; wantLook = 0.8; if (idleT < 6 + dt * 2) S.idleLook++; } }
    else { idleT = 0; S.target = null; }
    lookYaw = ease(lookYaw, wantYaw, dt, 3); w.look = ease(w.look, wantLook, dt, 3);
    if (w.look > 0.01) { rotWorld(bones.neck, UP, lookYaw * w.look * 0.35); rotWorld(bones.head, UP, lookYaw * w.look * 0.65); if (tg) S.look++; }
    // carrying
    var holding = !busy && window.__fyrusCarry23 && window.__fyrusCarry23.held();
    w.carry = ease(w.carry, holding ? 1 : 0, dt, 6);
    if (w.carry > 0.01) { rotWorld(bones.fore, right, -1.05 * w.carry); rotWorld(bones.hand, right, 0.35 * w.carry); S.carry++; }
    // keep a held prop upright (yaw follows the player) whatever the hand pose
    var held = bones.hand && bones.hand.children.find(function (c) { return c.name && c.name.indexOf('carry-') === 0; });
    if (held) {
      var hb = bones.hand; hb.updateWorldMatrix(true, false); hb.getWorldQuaternion(q1); q2.setFromAxisAngle(UP, yaw); held.quaternion.copy(q1.clone().invert().multiply(q2));
      // place the cup's middle in the palm: 8 cm along the fingers, then half the cup height down (world space)
      hb.getWorldPosition(v2); var fd = new T.Vector3(0, 1, 0).applyQuaternion(q1); v2.addScaledVector(fd, 0.08); v2.y -= 0.07;
      held.position.copy(hb.worldToLocal(v2));
    }
    // rain lean
    var wx = window.__fyrusWeather, rain = W.active === W.world && wx && wx.rain ? wx.rain : 0;
    w.rain = ease(w.rain, !busy && moving ? rain : 0, dt, 2);
    if (w.rain > 0.01) { rotWorld(bones.spine, right, 0.12 * w.rain); rotWorld(bones.head, right, 0.15 * w.rain); S.rain++; }
  }
  function wrap(m) {
    if (!m || m.__ctx23) return; m.__ctx23 = true; var orig = m.update;
    m.update = function (dt) { var r = orig.apply(this, arguments); try { post(dt); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); } return r; };
    S.wrapped++;
  }
  (function loop() {
    var D = window.__fyrusAvatarDemo;
    if (!T && window.THREE) { T = window.THREE; q1 = new T.Quaternion(); q2 = new T.Quaternion(); v1 = new T.Vector3(); v2 = new T.Vector3(); UP = new T.Vector3(0, 1, 0); }
    if (T && D && D.mixer) wrap(D.mixer);
    setTimeout(loop, 500);
  })();
})();
