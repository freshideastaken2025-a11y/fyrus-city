/* FYRUS 29.7 browser VR capability detection (client add-on). Read-only: finds out what this browser could do for VR,
   so later units (29.8 WebXR) only offer VR where it can work. Nothing is entered or rendered in VR here.
   Checks: secure context (WebXR needs https or localhost/127.0.0.1), navigator.xr, isSessionSupported for immersive-vr /
   immersive-ar / inline, WebGL2, and whether the city's WebGL context can be made XR-compatible.
   Result: window.__fyrusXR29 { state: 'checking'|'no-api'|'insecure'|'no-headset'|'vr-ready', vr, ar, inline, webgl2,
   xrCompatible, ms } and an event 'fyrus:xr29' when done. Shown in Settings > Graphics & audio (honest wording:
   "not headset-tested"). Kill switch ?p29off=xr */
(function () {
  var OFF = /(^|,)(xr|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var S = (window.__fyrusXR29 = { off: OFF, state: OFF ? 'off' : 'checking', vr: false, ar: false, inline: false, webgl2: false, xrCompatible: null, secure: !!window.isSecureContext, ms: null });
  if (OFF) return;
  var t0 = performance.now();
  function done(state) { S.state = state; S.ms = Math.round(performance.now() - t0); try { window.dispatchEvent(new CustomEvent('fyrus:xr29', { detail: S })); } catch (e) {} }
  function supported(mode) { try { return navigator.xr.isSessionSupported(mode).then(function (v) { return !!v; }, function () { return false; }); } catch (e) { return Promise.resolve(false); } }
  try { var c = document.createElement('canvas'); S.webgl2 = !!(c.getContext && c.getContext('webgl2')); } catch (e) {}
  if (!S.secure) return done('insecure');
  if (!navigator.xr || typeof navigator.xr.isSessionSupported !== 'function') return done('no-api');
  Promise.all([supported('immersive-vr'), supported('immersive-ar'), supported('inline')]).then(function (r) {
    S.vr = r[0]; S.ar = r[1]; S.inline = r[2];
    if (!S.vr) return done('no-headset');
    // can the city's own context be used for XR? (makeXRCompatible may wait for a device; do not block the game on it)
    var tries = 0, iv = setInterval(function () {
      var W = window.__fyrusW, gl = W && W.renderer && W.renderer.getContext && W.renderer.getContext();
      if (!gl && ++tries < 30) return;
      clearInterval(iv);
      if (!gl || typeof gl.makeXRCompatible !== 'function') { S.xrCompatible = false; return done('vr-ready'); }
      gl.makeXRCompatible().then(function () { S.xrCompatible = true; done('vr-ready'); }, function () { S.xrCompatible = false; done('vr-ready'); });
    }, 1000);
  });
})();
