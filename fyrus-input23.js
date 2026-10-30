/* FYRUS 23.10 desktop / mobile / gamepad input adaptation. Kill switch: ?p23off=input
 * - Input mode follows the last device used: keyboard/mouse ('kb'), touch ('touch') or gamepad ('pad'). It is published
 *   as window.__fyrusInputMode and in the app store (inputMode), so prompts show the right hint: E / R on keyboard,
 *   "Tap" on touch (and a larger tap target), the A / B buttons on a gamepad.
 * - Gamepad (standard mapping, any browser with the Gamepad API): left stick moves (mapped onto the game's own W/A/S/D
 *   so every movement rule still applies), right stick turns / tilts the camera, A = interact / leave vehicle (the E
 *   key path, with its 250 ms debounce), B = next target (R), X = jump, Y = wave, LB = dance, RB held = run.
 *   Only keys this layer pressed are released by it, so a keyboard used at the same time is never cut off.
 * Test hook: ?padtest=1 feeds a scripted virtual gamepad (forward 1.2 s, then A). Stats: window.__fyrusInput23.stats. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'input' || k === 'all'; })) return;
  var S = { mode: 'kb', pads: 0, padFrames: 0, padButtons: 0, modeChanges: 0, errors: 0 };
  var API = window.__fyrusInput23 = { version: '23.10', stats: S };
  function setMode(m) {
    if (S.mode === m) return; S.mode = m; S.modeChanges++; window.__fyrusInputMode = m;
    try { window.__fyrus.setState({ inputMode: m }); } catch (e) {}
    document.documentElement.setAttribute('data-input', m);
  }
  window.__fyrusInputMode = 'kb';
  window.addEventListener('keydown', function (e) { if (e.isTrusted) setMode('kb'); }, true);
  window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') setMode('touch'); else if (e.pointerType === 'mouse' && e.isTrusted) setMode('kb'); }, true);
  // larger tap targets for the interaction prompt on touch screens
  var st = document.createElement('style');
  st.textContent = 'html[data-input=touch] button.pop-in{min-height:52px;padding:6px 14px;border-radius:14px;background:rgba(0,0,0,.28)}' +
    'html[data-input=touch] button.pop-in [role=button]{min-height:40px;min-width:56px;display:inline-flex;align-items:center;justify-content:center}';
  document.head.appendChild(st);
  if (('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820) setMode('touch');

  // ---- gamepad ------------------------------------------------------------------------------------------------------
  var held = {}, prevB = [], last = performance.now(), fake = null;
  function key(k, down) {
    var W = window.__fyrusW; if (!W || !W.keys) return;
    if (down && !W.keys.has(k)) { W.keys.add(k); held[k] = true; }
    if (!down && held[k]) { W.keys.delete(k); delete held[k]; }
  }
  function tap(k) { window.dispatchEvent(new KeyboardEvent('keydown', { key: k })); window.dispatchEvent(new KeyboardEvent('keyup', { key: k })); }
  function pads() {
    if (fake) return [fake()];
    try { return Array.prototype.filter.call(navigator.getGamepads ? navigator.getGamepads() : [], Boolean); } catch (e) { return []; }
  }
  function poll() {
    var now = performance.now(), dt = Math.min(0.1, (now - last) / 1000); last = now;
    var list = pads(); S.pads = list.length;
    if (!list.length) { setTimeout(poll, 500); return; }
    requestAnimationFrame(poll);
    var g = list[0], W = window.__fyrusW; if (!g || !W) return;
    try {
      var ax = g.axes || [], lx = ax[0] || 0, ly = ax[1] || 0, rx = ax[2] || 0, ry = ax[3] || 0, dz = 0.35;
      var b = (g.buttons || []).map(function (x) { return !!(x && (x.pressed || x.value > 0.5)); });
      var any = Math.abs(lx) > dz || Math.abs(ly) > dz || Math.abs(rx) > dz || Math.abs(ry) > dz || b.some(Boolean);
      if (any) setMode('pad');
      key('w', ly < -dz); key('s', ly > dz); key('a', lx < -dz); key('d', lx > dz); key('shift', !!b[5]);
      if (Math.abs(rx) > 0.15 && W.yaw != null) W.yaw -= rx * dt * 2.6;
      if (Math.abs(ry) > 0.15 && W.pitch != null) W.pitch = Math.min(1.25, Math.max(0.05, W.pitch + ry * dt * 1.4));
      var edge = function (i) { return b[i] && !prevB[i]; };
      if (edge(0)) { tap('e'); S.padButtons++; }
      if (edge(1)) { tap('r'); S.padButtons++; }
      if (edge(2)) { tap(' '); S.padButtons++; }
      if (edge(3)) { tap('1'); S.padButtons++; }
      if (edge(4)) { tap('2'); S.padButtons++; }
      prevB = b; S.padFrames++;
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }
  window.addEventListener('gamepadconnected', function () { S.connected = (S.connected || 0) + 1; });
  setTimeout(poll, 1000);
  if (Q.get('padtest')) {
    var t0 = 0;
    API.startPadTest = function () {
      t0 = performance.now();
      fake = function () {
        var t = (performance.now() - t0) / 1000, btn = function (on) { return { pressed: on, value: on ? 1 : 0 }; };
        var bs = []; for (var i = 0; i < 16; i++) bs.push(btn(false));
        if (t > 1.6 && t < 1.8) bs[0] = btn(true);
        if (t > 3) { fake = null; Object.keys(held).forEach(function (k) { key(k, false); }); }
        return { axes: [0, t < 1.2 ? -1 : 0, t < 1.2 ? 0.6 : 0, 0], buttons: bs, mapping: 'standard', id: 'virtual-test-pad' };
      };
    };
  }
})();
