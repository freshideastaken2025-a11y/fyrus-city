/* FYRUS 29.10 VR teleport locomotion (client add-on on top of 29.8/29.9). While in VR, push the right thumbstick forward
   to aim: a ring marker appears on the ground ahead of you (2-6 m, further the harder you push); let go to jump there
   instantly (no smooth motion, the comfortable way to travel). The landing spot goes through the game's own collision
   (w.collide), so you never land inside a building, and stays within the server's normal movement limits.
   Kill switch ?p29off=vrteleport   Debug: window.__fyrusVRTeleport29 { aims, jumps, last } */
(function () {
  var OFF = /(^|,)(vrteleport|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var S = (window.__fyrusVRTeleport29 = { off: OFF, aims: 0, jumps: 0, last: null, aiming: false });
  if (OFF) return;
  var T = window.THREE, ring = null, target = null, dist = 0;
  function marker(w) {
    if (ring) return ring;
    ring = new T.Mesh(new T.RingGeometry(0.35, 0.5, 32), new T.MeshBasicMaterial({ color: 0x7fd1ff, transparent: true, opacity: 0.85, depthTest: false, side: T.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.renderOrder = 999; ring.name = 'fyrus-vr-teleport-ring'; ring.visible = false;
    return ring;
  }
  function stick(session) { var srcs = session.inputSources || []; for (var i = 0; i < srcs.length; i++) { var s = srcs[i], g = s.gamepad; if (s.handedness === 'right' && g && g.axes) return g.axes.length >= 4 ? g.axes[3] : g.axes[1]; } return 0; }
  function frame(w, session, rig) {
    if (!session || !w.player) return;
    var y = stick(session) || 0, p = w.player.root.position, m = marker(w);
    if (m.parent !== w.active) (w.active || w.world).add(m);
    if (y < -0.6) {
      if (!S.aiming) S.aims++;
      S.aiming = true;
      dist = 2 + Math.min(1, (-y - 0.6) / 0.4) * 4;                    // 2 m at the threshold .. 6 m fully pushed
      var a = (rig ? rig.rotation.y : (w.yaw || 0));                      // rig forward = game forward (-sin a, 0, -cos a)
      target = new T.Vector3(p.x - Math.sin(a) * dist, p.y, p.z - Math.cos(a) * dist);
      try { w.collide && w.collide(target); } catch (e) {}
      m.position.set(target.x, (p.y || 0) + 0.03, target.z); m.visible = true;
    } else if (S.aiming && Math.abs(y) < 0.3) {
      S.aiming = false; m.visible = false;
      if (target) { p.x = target.x; p.z = target.z; if (w.player.vel) w.player.vel.set(0, 0, 0); w.player.target = null; S.jumps++; S.last = { x: Math.round(target.x * 10) / 10, z: Math.round(target.z * 10) / 10, d: Math.round(dist * 10) / 10 }; }
      target = null;
    }
  }
  function exit() { if (ring) { ring.visible = false; if (ring.parent) ring.parent.remove(ring); } S.aiming = false; target = null; }
  var iv = setInterval(function () { var X = window.__fyrusWebXR29; if (X && X.onFrame && !X.off) { X.onFrame.push(frame); X.onExit.push(exit); clearInterval(iv); S.ready = true; } }, 500);
})();
