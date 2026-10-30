/* FYRUS 29.11 VR motion-sickness mitigation (client add-on on top of 29.8-29.10).
   - Comfort vignette: while you glide with the stick (or right after a snap turn) the edges of the view darken, which
     reduces vection (the main cause of VR sickness); it fades out when you stand still or teleport.
   - Comfort options (saved on this device; set them before entering VR, Settings > Graphics & audio):
     vignette on/off (default on), teleport only = no smooth stick walking (default off), snap turn 30 or 45 degrees.
   Kill switch ?p29off=vrcomfort   Debug: window.__fyrusVRComfort29 { opts, level, peak, set(k, v) } */
(function () {
  var OFF = /(^|,)(vrcomfort|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var KEY = 'fyrus.vrcomfort29', opts = { vignette: true, teleportOnly: false, snapDeg: 30 };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) for (var k in opts) if (k in saved) opts[k] = saved[k]; } catch (e) {}
  var S = (window.__fyrusVRComfort29 = { off: OFF, opts: opts, level: 0, peak: 0, frames: 0 });
  S.set = function (k, v) { if (!(k in opts)) return false; opts[k] = v; try { localStorage.setItem(KEY, JSON.stringify(opts)); } catch (e) {} return true; };
  if (OFF) return;
  var T = window.THREE, vig = null, lastYaw = null, turnBoost = 0;
  function makeVig() {
    var c = document.createElement('canvas'); c.width = c.height = 256; var x = c.getContext('2d');
    var g = x.createRadialGradient(128, 128, 40, 128, 128, 128); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.55, 'rgba(0,0,0,0.15)'); g.addColorStop(1, 'rgba(0,0,0,1)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    var m = new T.Mesh(new T.PlaneGeometry(0.9, 0.9), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c), transparent: true, opacity: 0, depthTest: false, depthWrite: false }));
    m.position.set(0, 0, -0.25); m.renderOrder = 10000; m.name = 'fyrus-vr-vignette'; m.frustumCulled = false; return m;
  }
  function frame(w) {
    if (!vig) vig = makeVig();
    if (vig.parent !== w.camera) w.camera.add(vig);
    var sp = w.player && w.player.speed || 0;
    if (lastYaw !== null && Math.abs((w.yaw || 0) - lastYaw) > 0.2) turnBoost = 1;      // snap turn just happened
    lastYaw = w.yaw || 0; turnBoost = Math.max(0, turnBoost - 0.12);
    var target = opts.vignette ? Math.min(0.85, Math.max(Math.min(1, sp / 4.6) * 0.85, turnBoost * 0.85)) : 0;
    S.level = S.level + (target - S.level) * 0.35; if (S.level < 0.01) S.level = 0;
    vig.material.opacity = S.level; vig.visible = S.level > 0;
    S.peak = Math.max(S.peak, S.level); S.frames++;
  }
  function exit(w) { if (vig && vig.parent) vig.parent.remove(vig); S.level = 0; lastYaw = null; }
  var iv = setInterval(function () { var X = window.__fyrusWebXR29; if (X && X.onFrame && !X.off) { X.onFrame.push(frame); X.onExit.push(exit); clearInterval(iv); S.ready = true; } }, 500);
})();
