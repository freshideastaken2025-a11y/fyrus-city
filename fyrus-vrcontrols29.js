/* FYRUS 29.9 VR camera and controls (client add-on on top of 29.8). While in VR:
   - left controller thumbstick drives the same W/A/S/D movement as the keyboard/touch stick (push to the edge = run);
   - right thumbstick left/right = snap turn 30 degrees (one turn per flick, the stick must return to centre first);
   - trigger ("select") on either controller = interact (same as E / tap on the prompt);
   - movement is body-relative: forward is the way the rig faces (snap turns change it), not where the head glances.
   Uses the standard WebXR gamepad mapping (axes 2/3 = thumbstick). Keys are cleared on exit.
   Kill switch ?p29off=vrcontrols   Debug: window.__fyrusVRControls29 { moves, turns, selects, keys } */
(function () {
  var OFF = /(^|,)(vrcontrols|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var S = (window.__fyrusVRControls29 = { off: OFF, moves: 0, turns: 0, selects: 0, keys: '' });
  if (OFF) return;
  var KEYS = ['w', 'a', 's', 'd', 'shift'], turnArmed = true, hooked = null, T = window.THREE, q = null, e3 = null;
  function setKeys(w, list) { KEYS.forEach(function (k) { if (list.indexOf(k) >= 0) w.keys.add(k); else w.keys.delete(k); }); S.keys = list.join(''); }
  function axes(src) { var g = src && src.gamepad; if (!g || !g.axes) return null; var x = g.axes.length >= 4 ? g.axes[2] : g.axes[0], y = g.axes.length >= 4 ? g.axes[3] : g.axes[1]; return { x: x || 0, y: y || 0 }; }
  function onSelect() { var w = window.__fyrusW; S.selects++; try { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' })); setTimeout(function () { window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' })); }, 80); } catch (x) {} }
  function frame(w, session) {
    if (!session) return;
    if (hooked !== session) { hooked = session; session.addEventListener('select', onSelect); }
    var list = [], srcs = session.inputSources || [];
    for (var i = 0; i < srcs.length; i++) {
      var s = srcs[i], a = axes(s); if (!a) continue;
      if (s.handedness === 'right') {
        if (Math.abs(a.x) < 0.3) turnArmed = true;
        else if (turnArmed && Math.abs(a.x) > 0.7) { turnArmed = false; var C = window.__fyrusVRComfort29, deg = C && !C.off && C.opts.snapDeg === 45 ? 45 : 30; w.yaw = (w.yaw || 0) + (a.x > 0 ? -1 : 1) * deg * Math.PI / 180; S.turns++; }
      } else {
        var C2 = window.__fyrusVRComfort29; if (C2 && !C2.off && C2.opts.teleportOnly) continue;   // 29.11 comfort: no smooth walking
        var d = Math.hypot(a.x, a.y); if (d < 0.2) continue;
        if (a.y < -0.38) list.push('w'); if (a.y > 0.38) list.push('s'); if (a.x > 0.38) list.push('d'); if (a.x < -0.38) list.push('a');
        if (d > 0.92) list.push('shift');
      }
    }
    if (list.length) S.moves++;
    setKeys(w, list);
  }
  function exit(w) { if (w && w.keys) setKeys(w, []); hooked = null; turnArmed = true; }
  var iv = setInterval(function () { var X = window.__fyrusWebXR29; if (X && X.onFrame && !X.off) { X.onFrame.push(frame); X.onExit.push(exit); clearInterval(iv); S.ready = true; } }, 500);
})();
