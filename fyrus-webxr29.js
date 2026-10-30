/* FYRUS 29.8 WebXR experimental support (client add-on). When 29.7 detection says a VR headset is available
   (__fyrusXR29.state === 'vr-ready'), an "Enter VR (experimental)" button appears. Entering starts an immersive-vr
   session on the city's own renderer (three r149 renderer.xr, the engine already drives frames with setAnimationLoop),
   puts the camera on a rig at the player's position (headset height comes from the 'local-floor' space), and hides the
   player's own avatar so you are not inside it. Leaving (button, headset menu, or session end) restores the normal camera.
   Not tested on a real headset (29.12 needs owner approval + a headset). Kill switch ?p29off=webxr
   Debug: window.__fyrusWebXR29 { shown, inVR, sessions, frames, last, error, enter(), exit() } */
(function () {
  var OFF = /(^|,)(webxr|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var S = (window.__fyrusWebXR29 = { off: OFF, shown: false, inVR: false, sessions: 0, frames: 0, last: null, error: null, onFrame: [], onEnter: [], onExit: [] });
  if (OFF) return;
  var T = window.THREE, btn = null, rig = null, session = null, origTick = null, prevParent = null, prevVisible = true;
  function W() { return window.__fyrusW; }
  function note(t) { var n = document.createElement('div'); n.textContent = t; n.setAttribute('data-webxr-note', ''); n.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%);z-index:90;background:rgba(10,14,22,.92);color:#fff;padding:8px 12px;border-radius:10px;font:13px system-ui,sans-serif;max-width:calc(100vw - 32px)'; document.body.appendChild(n); setTimeout(function () { n.remove(); }, 5000); }
  function label() { if (btn) btn.textContent = S.inVR ? 'Exit VR' : 'Enter VR (experimental)'; }
  function frameHook() {
    var w = W(); if (!w || origTick) return;
    origTick = w.tick;
    w.tick = function () {
      if (S.inVR && rig) {
        var p = w.player && w.player.root && w.player.root.position, sc = w.active;
        if (sc && rig.parent !== sc) sc.add(rig);
        if (p) rig.position.set(p.x, p.y, p.z);
        rig.rotation.y = w.yaw || 0;   // 29.10 fix: face the game's forward (-sin yaw, 0, -cos yaw) — 29.8 had the rig turned 180 degrees
        S.frames++;
        for (var i = 0; i < S.onFrame.length; i++) { try { S.onFrame[i](w, session, rig); } catch (e) { S.error = 'frame hook: ' + e; } }   // 29.9+ (controls, teleport, comfort)
      }
      return origTick.apply(this, arguments);
    };
  }
  function exit() {
    var w = W(); if (!w) return;
    var s = session; session = null;
    if (s) { try { s.removeEventListener('end', exit); s.end().catch(function () {}); } catch (e) {} }
    if (rig) { w.camera.position.set(0, 0, 0); if (rig.parent) rig.parent.remove(rig); rig.remove(w.camera); if (prevParent) prevParent.add(w.camera); rig = null; }
    try { w.renderer.xr.enabled = false; } catch (e) {}
    if (w.player && w.player.root) w.player.root.visible = prevVisible;
    S.inVR = false; S.last = 'exit'; label();
    S.onExit.forEach(function (f) { try { f(w); } catch (e) {} });
    try { w.resize && w.resize(); } catch (e) {}
  }
  function enter() {
    var w = W(); if (!w || S.inVR || !navigator.xr) return;
    S.error = null;
    navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] }).then(function (s) {
      session = s; S.sessions++;
      var R = w.renderer; R.xr.enabled = true;
      try { R.xr.setReferenceSpaceType('local-floor'); } catch (e) {}
      return R.xr.setSession(s).then(function () {
        frameHook();
        rig = new T.Group(); rig.name = 'fyrus-vr-rig';
        prevParent = w.camera.parent; rig.add(w.camera); w.camera.position.set(0, 0, 0); w.camera.rotation.set(0, 0, 0);
        (w.active || w.world).add(rig);
        if (w.player && w.player.root) { prevVisible = w.player.root.visible; w.player.root.visible = false; }
        S.inVR = true; S.last = 'enter'; label();
        S.onEnter.forEach(function (f) { try { f(w, s, rig); } catch (e) {} });
        s.addEventListener('end', exit);
      });
    }).catch(function (e) {
      S.error = String(e && e.message || e); S.last = 'failed';
      try { w.renderer.xr.enabled = false; } catch (x) {}
      note('VR could not start: ' + S.error);
    });
  }
  S.enter = enter; S.exit = exit;
  function show() {
    var x = window.__fyrusXR29; if (btn || !x || x.state !== 'vr-ready' || !document.body) return;
    btn = document.createElement('button'); btn.setAttribute('data-webxr-button', '');
    btn.style.cssText = 'position:fixed;right:16px;bottom:206px;z-index:59;background:rgba(10,14,22,.85);color:#c792ea;border:1px solid rgba(199,146,234,.5);border-radius:999px;padding:9px 14px;min-height:40px;cursor:pointer;font:700 12px system-ui,sans-serif';
    btn.onclick = function () { S.inVR ? exit() : enter(); };
    label(); document.body.appendChild(btn); S.shown = true;
  }
  window.addEventListener('fyrus:xr29', show);
  var iv = setInterval(function () { show(); if (btn || (window.__fyrusXR29 && /^(no-api|insecure|no-headset|off)$/.test(window.__fyrusXR29.state))) clearInterval(iv); }, 1000);
})();
