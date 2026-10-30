/* FYRUS Phase 20 locomotion blender (DEV, not wired into the game yet).
 * window.__fyrusLoco20.create(root, clips) -> controller with
 *   update(dt, vLeft, vFwd, turnRate)  velocity in the avatar's local frame (m/s; +vLeft = character's left),
 *                                      turnRate in rad/s (+ = turning left)
 *   weights()                          current effective weights by clip name (sum = 1)
 * Blending: speed picks Idle/Walk/Jog/Run (piecewise linear), direction splits the moving share between
 * forward / WalkBack / StrafeL / StrafeR (cosine weights), standing still while turning uses TurnL/TurnR.
 * All locomotion clips share one gait phase, so feet stay in step while weights change; the phase rate follows
 * the blended natural cycle so the feet do not slide at the clip's natural speed. */
(function () {
  'use strict';
  var NAT = { Walk: 1.3, Jog: 2.6, Run: 4.0, WalkBack: 1.1, StrafeL: 1.1, StrafeR: 1.1 };   // m/s at timeScale 1

  /* 20.10 foot placement: per frame, after the mixer. groundY(x, z) -> ground height (world). For each foot the
   * ankle is moved to (ground + rest ankle height) with an analytic two-bone IK (thigh/shin, knee bends in its own
   * plane), and the hips drop by the lowest foot's deficit so the higher foot does not over-stretch. */
  function footIK(root, groundY, opt) {
    var T = window.THREE; opt = opt || {};
    var bones = {}; root.traverse(function (o) { if (o.isBone) bones[o.name] = o; });
    var LEGS = [['thighL', 'shinL', 'footL'], ['thighR', 'shinR', 'footR']], hips = bones.hips;
    var restH = null, maxDrop = opt.maxDrop || 0.35, v = new T.Vector3(), w = new T.Vector3();
    function wp(b, out) { return out.setFromMatrixPosition(b.matrixWorld); }
    function rotWorld(b, qW) {   // apply a world-space rotation to bone b
      var pq = new T.Quaternion(); b.parent.getWorldQuaternion(pq);
      var pqi = pq.clone().invert(); b.quaternion.premultiply(pqi.multiply(qW).multiply(pq)); b.updateMatrixWorld(true);
    }
    function solve(th, sh, ft, target) {
      var a = wp(th, new T.Vector3()), b = wp(sh, new T.Vector3()), c = wp(ft, new T.Vector3());
      var l1 = a.distanceTo(b), l2 = b.distanceTo(c), d = Math.min(Math.max(a.distanceTo(target), Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
      // knee: set interior angle for distance d
      var ba = a.clone().sub(b).normalize(), bc = c.clone().sub(b).normalize();
      var cur = Math.acos(Math.min(1, Math.max(-1, ba.dot(bc)))), want = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + l2 * l2 - d * d) / (2 * l1 * l2))));
      var axis = new T.Vector3().crossVectors(bc, ba);
      if (axis.lengthSq() < 1e-10) { axis.set(1, 0, 0).applyQuaternion(th.getWorldQuaternion(new T.Quaternion())); }
      axis.normalize();
      rotWorld(sh, new T.Quaternion().setFromAxisAngle(axis, cur - want));
      // hip: swing the ankle onto the target
      c = wp(ft, new T.Vector3());
      rotWorld(th, new T.Quaternion().setFromUnitVectors(c.sub(a).normalize(), target.clone().sub(a).normalize()));
    }
    return {
      calibrate: function () { root.updateMatrixWorld(true); restH = LEGS.map(function (L) { return wp(bones[L[2]], v).y - wp(root, w).y; }); return restH; },
      apply: function () {
        root.updateMatrixWorld(true);
        if (restH === null) restH = LEGS.map(function (L) { return wp(bones[L[2]], v).y - wp(root, w).y; });
        var need = LEGS.map(function (L, i) { var p = wp(bones[L[2]], new T.Vector3()); return { p: p, g: groundY(p.x, p.z) + restH[i] }; });
        var drop = Math.min(maxDrop, Math.max(0, Math.max.apply(null, need.map(function (n) { return n.p.y - n.g; }))));
        if (drop > 0 && hips) {   // lower the hips in world space
          var hp = wp(hips, new T.Vector3()), lp = hips.parent.worldToLocal(hp.clone().add(new T.Vector3(0, -drop, 0))), l0 = hips.parent.worldToLocal(hp.clone());
          hips.position.add(lp.sub(l0)); root.updateMatrixWorld(true);
        }
        var out = [];
        LEGS.forEach(function (L, i) {
          var p = wp(bones[L[2]], new T.Vector3()), tgt = new T.Vector3(p.x, need[i].g, p.z);
          solve(bones[L[0]], bones[L[1]], bones[L[2]], tgt);
          out.push(Math.round((wp(bones[L[2]], new T.Vector3()).y - need[i].g) * 1000) / 1000);
        });
        return { hipDrop: Math.round(drop * 1000) / 1000, ankleErrorM: out };
      }
    };
  }

  /* 20.12 face: automatic blinks (every 2-5 s, 150 ms), eye look-at (eye bones, clamped), talking mouth flap,
   * and named expressions (Smile, Sad, BrowsUp) eased toward a target. Works on the morph targets
   * Blink/Smile/MouthOpen/BrowsUp/Sad and the bones eyeL/eyeR of the Phase 20 GLBs. */
  function face(root, opt) {
    var T = window.THREE; opt = opt || {};
    var meshes = [], eyes = [], rnd = opt.random || Math.random;
    root.traverse(function (o) { if (o.isMesh && o.morphTargetDictionary && o.morphTargetDictionary.Blink != null) meshes.push(o); if (o.isBone && (o.name === 'eyeL' || o.name === 'eyeR')) eyes.push(o); });
    var rest = eyes.map(function (e) { return e.quaternion.clone(); });
    var t = 0, nextBlink = 1 + rnd() * 3, blinkT = -1, talk = false, target = {}, cur = { Smile: 0, Sad: 0, BrowsUp: 0 }, look = null;
    var MAXY = 0.35, MAXX = 0.2, S = { blinks: 0, maxBlink: 0 };
    function setK(name, v) { meshes.forEach(function (m) { var i = m.morphTargetDictionary[name]; if (i != null) m.morphTargetInfluences[i] = v; }); }
    return {
      stats: S,
      setTalking: function (b) { talk = !!b; },
      setExpression: function (name, v) { target = {}; if (name) target[name] = v == null ? 1 : v; },
      lookAt: function (worldPoint) { look = worldPoint ? worldPoint.clone() : null; },
      update: function (dt) {
        t += dt;
        if (blinkT < 0 && t >= nextBlink) { blinkT = 0; S.blinks++; }
        var b = 0;
        if (blinkT >= 0) { blinkT += dt; b = blinkT < 0.075 ? blinkT / 0.075 : Math.max(0, 1 - (blinkT - 0.075) / 0.075); if (blinkT > 0.15) { blinkT = -1; nextBlink = t + 2 + rnd() * 3; } }
        setK('Blink', b); S.maxBlink = Math.max(S.maxBlink, b);
        setK('MouthOpen', talk ? 0.35 + 0.35 * Math.abs(Math.sin(t * 11)) * (0.6 + 0.4 * Math.sin(t * 3.1)) : 0);
        Object.keys(cur).forEach(function (k) { var g = target[k] || 0; cur[k] += (g - cur[k]) * Math.min(1, dt * 6); setK(k, cur[k]); });
        eyes.forEach(function (e, i) {
          e.quaternion.copy(rest[i]);
          if (!look) return;
          e.updateMatrixWorld(true);
          var p = new T.Vector3().setFromMatrixPosition(e.matrixWorld), dirW = look.clone().sub(p).normalize();
          var inv = new T.Quaternion(); e.getWorldQuaternion(inv); inv.invert();
          var d = dirW.applyQuaternion(inv);                    // in the eye's local frame; bone forward is +Y
          var yaw = Math.max(-MAXY, Math.min(MAXY, Math.atan2(d.x, d.y))), pitch = Math.max(-MAXX, Math.min(MAXX, Math.atan2(d.z, d.y)));
          e.quaternion.multiply(new T.Quaternion().setFromEuler(new T.Euler(pitch, 0, -yaw)));
          S.lastYaw = Math.round(yaw * 1000) / 1000;
        });
      }
    };
  }

  /* 20.14 distance LOD: tiers = { a1: root, a2: root, a3: root } (same skeleton/bone names; clips come from A1).
   * Shows one tier by camera distance (A1 < 15 m <= A2 < 50 m <= A3, 10 % hysteresis) and animates only that tier:
   * A1 every frame, A2 every 2nd frame, A3 every 4th frame (accumulated dt, so speed is unchanged). */
  function lodGroup(tiers, clips, opt) {
    opt = opt || {};
    var near = opt.near || 15, far = opt.far || 50, cur = null, n = 0, acc = 0, ctl = {}, S = { switches: 0 };
    var EVERY = { a1: 1, a2: 2, a3: 4 };
    // hidden tiers are detached from the scene graph (not just invisible): three would otherwise still update the
    // world matrices of their 43-bone skeletons every frame
    var host = null;
    Object.keys(tiers).forEach(function (k) { tiers[k].visible = true; });
    function pick(d) {
      var h = cur === null ? 0 : 0.1;
      if (cur === 'a1') return d > near * (1 + h) ? (d > far ? 'a3' : 'a2') : 'a1';
      if (cur === 'a2') return d < near * (1 - h) ? 'a1' : (d > far * (1 + h) ? 'a3' : 'a2');
      if (cur === 'a3') return d < far * (1 - h) ? (d < near ? 'a1' : 'a2') : 'a3';
      return d < near ? 'a1' : (d < far ? 'a2' : 'a3');
    }
    return {
      stats: S,
      tier: function () { return cur; },
      emote: function (name) { if (!cur) return false; if (!ctl[cur]) ctl[cur] = create(tiers[cur], clips); return ctl[cur].emote(name); },
      update: function (dt, camPos, vL, vF, turn) {
        if (!host) { host = tiers.a1.parent || tiers.a2.parent || tiers.a3.parent; if (host) Object.keys(tiers).forEach(function (k) { host.remove(tiers[k]); }); }
        var wp = host ? host.getWorldPosition(new window.THREE.Vector3()) : tiers.a1.position;
        var t = pick(wp.distanceTo(camPos));
        if (t !== cur) { if (host) { if (cur) host.remove(tiers[cur]); host.add(tiers[t]); } cur = t; S.switches++; acc = 0; }
        if (!ctl[t]) ctl[t] = create(tiers[t], clips);
        n++; acc += dt;
        if (n % EVERY[t] === 0) { ctl[t].update(acc, vL || 0, vF || 0, turn || 0); acc = 0; }
      }
    };
  }

  function create(root, clips) {
    var T = window.THREE, mixer = new T.AnimationMixer(root), A = {}, phase = 0, idleT = 0, W = {}, EM = null;
    clips.forEach(function (c) { var a = mixer.clipAction(c); a.play(); a.setEffectiveWeight(0); a.timeScale = 0; A[c.name] = a; });
    function set(name, w) { if (A[name]) { W[name] = (W[name] || 0) + w; } }
    function update(dt, vL, vF, turn) {
      W = {};
      var s = Math.hypot(vL, vF), move = Math.min(1, s / 0.9);
      // direction split of the moving share
      var th = Math.atan2(vL, vF), wf = Math.max(0, Math.cos(th)), wb = Math.max(0, -Math.cos(th)), wl = Math.max(0, Math.sin(th)), wr = Math.max(0, -Math.sin(th));
      var sum = wf + wb + wl + wr || 1; wf /= sum; wb /= sum; wl /= sum; wr /= sum;
      // forward pool by speed
      var fw = s <= 1.3 ? { Walk: 1 } : s <= 2.6 ? { Walk: (2.6 - s) / 1.3, Jog: (s - 1.3) / 1.3 } : s <= 4.0 ? { Jog: (4.0 - s) / 1.4, Run: (s - 2.6) / 1.4 } : { Run: 1 };
      Object.keys(fw).forEach(function (k) { set(k, move * wf * fw[k]); });
      set('WalkBack', move * wb); set('StrafeL', move * wl); set('StrafeR', move * wr);
      var still = 1 - move, tw = Math.min(1, Math.abs(turn || 0) / 1.2) * still;
      if (tw > 0) set(turn > 0 ? 'TurnL' : 'TurnR', tw);
      set('Idle', still - tw);
      // shared gait phase: blended cycle period of the moving clips at the current speed
      var per = 0, pw = 0;
      Object.keys(W).forEach(function (k) {
        if (k === 'Idle' || !A[k] || W[k] <= 0) return;
        var d = A[k].getClip().duration, rate = NAT[k] ? Math.max(0.5, s / NAT[k]) : 1;
        per += W[k] * d / rate; pw += W[k];
      });
      if (pw > 0) phase = (phase + dt / (per / pw)) % 1;
      // 20.13 emote layer: one-shot full-body clip faded in/out over 0.2 s on top of the locomotion blend
      var ew = 0;
      if (EM) {
        EM.t += dt; var dur = A[EM.name].getClip().duration;
        ew = Math.min(1, EM.t / 0.2, Math.max(0, (dur - EM.t) / 0.2));
        if (EM.t >= dur || (move > 0.5 && EM.t > 0.2 && !EM.whileMoving)) { EM = null; ew = 0; }
        else { Object.keys(W).forEach(function (k) { W[k] *= (1 - ew); }); W[EM.name] = (W[EM.name] || 0) + ew; }
      }
      idleT += dt;
      Object.keys(A).forEach(function (k) {
        var a = A[k], w = W[k] || 0; a.setEffectiveWeight(w);
        a.time = k === 'Idle' ? idleT % a.getClip().duration : (EM && k === EM.name ? EM.t : phase * a.getClip().duration);
      });
      mixer.update(0);
    }
    return { mixer: mixer, update: update, weights: function () { return Object.assign({}, W); }, phase: function () { return phase; },
      emote: function (name, whileMoving) { if (!A[name]) return false; EM = { name: name, t: 0, whileMoving: !!whileMoving }; return true; },
      emoting: function () { return EM ? EM.name : null; } };
  }
  window.__fyrusLoco20 = { version: '20.16', create: create, lodGroup: lodGroup, natural: NAT, footIK: footIK, face: face };
})();
