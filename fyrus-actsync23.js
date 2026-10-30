/* FYRUS 23.9 multiplayer action sync. Kill switch: ?p23off=sync
 * Sends the player's current action state with every presence "pos" message, inside the `o` object the server already
 * relays (no protocol or server change; the engine no longer rebuilds outfits when only these fields change):
 *   o.act = { s: 1 while sitting (23.2), c: '<item>' while carrying (23.4), p: [x, z, heading] while a car is parked
 *            (23.6) }   - omitted when there is nothing to send. Emotes are already broadcast by the engine (23.7).
 * Remote players then: sit (the engine's procedural body sitting pose), carry the item in their right hand (a 23.4
 * prop on the arm), and leave their car parked where they got out (handled in 023.js updatePeers).
 * Dev driver for two-window tests: ?actdriver=1 makes this client cycle carry -> sit -> drive -> park.
 * Stats: window.__fyrusActSync.stats. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'sync' || k === 'all'; })) return;
  var S = { sent: 0, sentWithAct: 0, peers: 0, remoteSitting: 0, remoteCarrying: 0, remoteParked: 0, maxSit: 0, maxCarry: 0, maxParked: 0, errors: 0 };
  var API = window.__fyrusActSync = { version: '23.9', stats: S };
  function act(W) {
    var a = {}, any = false;
    if (W.player && W.player.sitting) { a.s = 1; any = true; }
    var C = window.__fyrusCarry23; if (C && C.held && C.held()) { a.c = C.held(); any = true; }
    if (W.parked && W.parked.obj && !W.vehicle) { var p = W.parked.obj.position; a.p = [Math.round(p.x * 10) / 10, Math.round(p.z * 10) / 10, Math.round(W.parked.heading * 100) / 100]; any = true; }
    return any ? a : null;
  }
  function wrap(W) {
    if (W.__actsync || !W.presence || !W.presence.send) return; W.__actsync = true;
    var orig = W.presence.send;
    W.presence.send = function (m) {
      try {
        if (m && m.t === 'pos') {
          var a = act(W); S.sent++;
          if (a || (m.o && m.o.act)) { var o = Object.assign({}, m.o || {}); if (a) { o.act = a; S.sentWithAct++; } else delete o.act; m = Object.assign({}, m, { o: o }); }
        }
      } catch (e) { S.errors++; }
      return orig.call(this, m);
    };
  }
  var cache = new WeakMap();
  function remote(W) {
    var sit = 0, car = 0, park = 0;
    if (W.peers) W.peers.forEach(function (l) {
      var c = cache.get(l); if (!c) { c = { sig: null, act: null, prop: null, kind: null }; cache.set(l, c); }
      if (l.oSig !== c.sig) { c.sig = l.oSig; try { var o = l.oSig ? JSON.parse(l.oSig) : null; c.act = o && o.act || null; } catch (e) { c.act = null; } }
      var a = c.act || {};
      l.sitting = !!a.s; if (a.s) sit++;
      if (a.p) park++;
      var want = a.c || null;
      if (c.kind !== want) {
        if (c.prop && c.prop.parent) c.prop.parent.remove(c.prop); c.prop = null; c.kind = want;
        var C = window.__fyrusCarry23, arm = l.arms && l.arms[1];
        if (want && C && C.build && arm) { c.prop = C.build(want); c.prop.position.set(0.02, -0.62, 0.1); arm.add(c.prop); }
      }
      if (want) car++;
    });
    S.peers = W.peers ? W.peers.size : 0; S.remoteSitting = sit; S.remoteCarrying = car; S.remoteParked = park;
    S.maxSit = Math.max(S.maxSit, sit); S.maxCarry = Math.max(S.maxCarry, car); S.maxParked = Math.max(S.maxParked, park);
  }
  setInterval(function () { var W = window.__fyrusW; if (!W || !W.player) return; try { wrap(W); remote(W); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); } }, 200);

  // ---- dev driver (two-window test) ------------------------------------------------------------------------------
  if (Q.get('actdriver')) {
    var step = 0;
    setTimeout(function cycle() {
      var W = window.__fyrusW; if (!W || !W.player) { setTimeout(cycle, 1000); return; }
      try {
        var C = window.__fyrusCarry23, Sit = window.__fyrusSit23, k = step++ % 4;
        if (C && !C.held()) C.give('flowers');
        if (k === 0 && Sit) { var sl = (window.__fyrusCity21 && window.__fyrusCity21.seats()) || []; if (sl[0]) { W.player.root.position.set(sl[0].x - Math.sin(sl[0].ang), W.player.root.position.y, sl[0].z - Math.cos(sl[0].ang)); Sit.sitNearest(); } }
        if (k === 1 && Sit) Sit.stand();
        if (k === 2) { window.__fyrus.setState({ vehicle: 'drive' }); setTimeout(function () { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e' })); window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e' })); }, 2500); }
        API.driverStep = k;
      } catch (e) { S.errors++; }
      setTimeout(cycle, 9000);
    }, 9000);
  }
})();
