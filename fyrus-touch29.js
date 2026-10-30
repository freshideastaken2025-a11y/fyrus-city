/* FYRUS 29.2 touch input (client add-on, touch phones/tablets only). Adds what touch players were missing:
   - a virtual thumb-stick (bottom-left) that drives the same movement keys as WASD; pushing it to the edge runs (Shift);
   - two-finger pinch to zoom the camera (same 3.5-40 m range as the mouse wheel); the game now ignores the second
     finger for camera drag (023.js isPrimary check), so a pinch never spins the view.
   Tap-to-walk and drag-to-look keep working. Kill switch ?p29off=touch   Debug: window.__fyrusTouch29 { on, stick, pinch, dist } */
(function () {
  var OFF = /(^|,)(touch|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var touch = false; try { touch = ('ontouchstart' in window) && matchMedia('(pointer: coarse)').matches; } catch (e) {}
  var S = (window.__fyrusTouch29 = { off: OFF, on: false, stick: 0, pinch: 0, dist: null, dir: '' });
  if (OFF || !touch) return;
  var R = 52, base = null, knob = null, sid = null, cx = 0, cy = 0;
  var KEYS = ['w', 'a', 's', 'd', 'shift'];
  function W() { return window.__fyrusW; }
  function setKeys(list) { var w = W(); if (!w || !w.keys) return; KEYS.forEach(function (k) { if (list.indexOf(k) >= 0) w.keys.add(k); else w.keys.delete(k); }); S.dir = list.join(''); }
  function release() { sid = null; setKeys([]); if (knob) knob.style.transform = 'translate(-50%,-50%)'; }
  function move(x, y) {
    var dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy), k = d > R ? R / d : 1;
    knob.style.transform = 'translate(calc(-50% + ' + Math.round(dx * k) + 'px),calc(-50% + ' + Math.round(dy * k) + 'px))';
    if (d < 10) return setKeys([]);
    var a = Math.atan2(dy, dx), list = [], s = Math.sin(a), c = Math.cos(a);
    if (s < -0.38) list.push('w'); if (s > 0.38) list.push('s'); if (c > 0.38) list.push('d'); if (c < -0.38) list.push('a');
    if (d > R * 0.92) list.push('shift');
    setKeys(list);
  }
  function mount() {
    if (base || !document.body || !W()) return;
    base = document.createElement('div'); base.setAttribute('data-touch-stick', ''); base.setAttribute('aria-label', 'Move');
    base.style.cssText = 'position:fixed;left:18px;bottom:110px;width:' + R * 2 + 'px;height:' + R * 2 + 'px;border-radius:50%;background:rgba(10,14,22,.28);border:1px solid rgba(255,255,255,.28);z-index:58;touch-action:none;-webkit-user-select:none;user-select:none';
    knob = document.createElement('div'); knob.style.cssText = 'position:absolute;left:50%;top:50%;width:46px;height:46px;border-radius:50%;background:rgba(255,255,255,.55);transform:translate(-50%,-50%);pointer-events:none';
    base.appendChild(knob); document.body.appendChild(base);
    base.addEventListener('pointerdown', function (e) { e.preventDefault(); e.stopPropagation(); sid = e.pointerId; var r = base.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; try { base.setPointerCapture(e.pointerId); } catch (x) {} S.stick++; move(e.clientX, e.clientY); });
    base.addEventListener('pointermove', function (e) { if (e.pointerId === sid) { e.preventDefault(); move(e.clientX, e.clientY); } });
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (t) { base.addEventListener(t, function (e) { if (e.pointerId === sid) release(); }); });
    // pinch zoom on the 3D canvas
    var cv = W().renderer && W().renderer.domElement, d0 = 0, z0 = 0;
    if (cv) {
      cv.addEventListener('touchstart', function (e) { if (e.touches.length === 2) { d0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); z0 = W().dist; } }, { passive: true });
      cv.addEventListener('touchmove', function (e) { if (e.touches.length === 2 && d0 > 0) { var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); var w = W(); w.dist = Math.min(40, Math.max(3.5, z0 * d0 / Math.max(20, d))); S.pinch++; S.dist = w.dist; } }, { passive: true });
      cv.addEventListener('touchend', function (e) { if (e.touches.length < 2) d0 = 0; }, { passive: true });
    }
    window.addEventListener('blur', release);
    S.on = true;
  }
  var iv = setInterval(function () { mount(); if (base) clearInterval(iv); }, 800);
})();
