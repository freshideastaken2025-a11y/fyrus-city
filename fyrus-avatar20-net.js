/* FYRUS 20.15 multiplayer avatar sync for the Phase 20 avatars (feature flag, default OFF).
 * Enable: ?f20net=1 (or localStorage fyrus.f20.net=1). Choose: ?f20av=<name> or localStorage fyrus.f20.avatar.
 * Kill switch: ?p20off=net.
 * - Outgoing: wraps W.presence.send and adds { f20: <avatar>, em: <emote>, emt: <ms> } to the `o` object of every
 *   "pos" message. The server already relays `o` unchanged, so no protocol or server change is needed.
 * - Incoming: for every remote peer whose `o.f20` names a whitelisted Phase 20 avatar, the procedural body is hidden
 *   and the A1/A2/A3 LOD group is attached to the peer root; it is driven by the peer's measured speed (the engine
 *   already computes l.speed from interpolated positions), and emotes are replayed when `emt` changes.
 * - Vehicles: when the peer drives, the Phase 20 body is hidden (the engine shows the car).
 * Local player keeps its current avatar; this layer only changes how OTHER players are drawn. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  var off = (Q.get('p20off') || '').split(',');
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  if (off.indexOf('net') >= 0 || off.indexOf('all') >= 0) return;
  if (!(Q.get('f20net') === '1' || ls('fyrus.f20.net') === '1')) return;
  var NAMES = ['fyrus20-base-female', 'fyrus20-female-formal', 'fyrus20-female-sport', 'fyrus20-base-male', 'fyrus20-male-formal', 'fyrus20-male-sport'];
  var EMOTES = ['Wave', 'Cheer', 'Clap', 'Bow', 'Point', 'Laugh'];
  var mine = Q.get('f20av') || ls('fyrus.f20.avatar') || NAMES[0];
  if (NAMES.indexOf(mine) < 0) mine = NAMES[0];
  var myEmote = null, myEmoteAt = 0;
  var S = { wrapped: false, sent: 0, attached: 0, peersSeen: 0, remote: {}, emotesPlayed: 0, errors: 0, loads: 0 };
  var BUF = {}, CLIPS = {}, base = '/assets/characters/fyrus20/';
  function need(cb) {
    if (window.THREE && window.THREE.GLTFLoader && window.__fyrusLoco20) return cb();
    var todo = [];
    if (!(window.THREE && window.THREE.GLTFLoader)) todo.push('/fyrus-gltf-loader.js?v=1.0.0');
    if (!window.__fyrusLoco20) todo.push('/fyrus-avatar20.js?v=20.15');
    var n = todo.length;
    todo.forEach(function (src) { var s = document.createElement('script'); s.src = src; s.onload = function () { if (--n === 0) cb(); }; document.head.appendChild(s); });
  }
  function buf(url) {
    if (!BUF[url]) BUF[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); S.loads++; return r.arrayBuffer(); });
    return BUF[url];
  }
  function parse(url) {
    return buf(url).then(function (ab) { return new Promise(function (res, rej) { new THREE.GLTFLoader().parse(ab, '', res, rej); }); });
  }
  function makeAvatar(name) {
    return Promise.all([parse(base + name + '.glb'), parse(base + name + '-a2.glb'), parse(base + name + '-a3.glb')]).then(function (g) {
      var grp = new THREE.Group(); grp.name = 'f20-' + name;
      var tiers = { a1: g[0].scene, a2: g[1].scene, a3: g[2].scene };
      Object.keys(tiers).forEach(function (k) { tiers[k].traverse(function (o) { if (o.isMesh) { o.castShadow = k === 'a1'; o.frustumCulled = false; } }); grp.add(tiers[k]); });
      CLIPS[name] = CLIPS[name] || g[0].animations;
      return { grp: grp, tiers: tiers, clips: g[0].animations };
    });
  }
  function isIn(o, g) { while (o) { if (o === g) return true; o = o.parent; } return false; }
  function wrap(W) {
    if (S.wrapped || !W.presence || !W.presence.send) return;
    var orig = W.presence.send;
    W.presence.send = function (m) {
      if (m && m.t === 'pos') {
        var o = Object.assign({}, m.o || {}, { f20: mine });
        if (myEmote && Date.now() - myEmoteAt < 4000) { o.em = myEmote; o.emt = myEmoteAt; }
        m = Object.assign({}, m, { o: o }); S.sent++;
      }
      return orig.call(this, m);
    };
    S.wrapped = true;
  }
  function frame(W, dt) {
    var cam = W.camera, camPos = cam ? cam.getWorldPosition(new THREE.Vector3()) : new THREE.Vector3();
    S.peersSeen = W.peers ? W.peers.size : 0;
    if (!W.peers) return;
    W.peers.forEach(function (l, id) {
      var o = null;
      try { o = l.oSig ? JSON.parse(l.oSig) : null; } catch (e) { o = null; }
      var want = o && NAMES.indexOf(o.f20) >= 0 ? o.f20 : null;
      if (l.f20 && l.f20.name !== want) { l.root.remove(l.f20.av.grp); l.f20 = null; if (l.body) l.body.visible = true; }
      if (!want) return;
      if (!l.f20) {
        if (l.f20pending) return;
        l.f20pending = true;
        makeAvatar(want).then(function (av) {
          l.f20pending = false;
          l.f20 = { name: want, av: av, lod: window.__fyrusLoco20.lodGroup(av.tiers, av.clips), lastEmt: 0 };
          l.root.add(av.grp); S.attached++;
        }).catch(function () { l.f20pending = false; S.errors++; });
        return;
      }
      var driving = !!l.car;
      if (l.body) l.body.visible = false;
      l.f20.av.grp.visible = !driving;
      if (o.emt && o.emt !== l.f20.lastEmt && EMOTES.indexOf(o.em) >= 0) {
        l.f20.lastEmt = o.emt;
        l.f20.lod.update(0, camPos, 0, 0, 0);
        if (l.f20.lod.emote(o.em)) S.emotesPlayed++;
      }
      l.f20.lod.update(dt, camPos, 0, Math.min(6, l.speed || 0), 0);
      S.remote[id] = { avatar: want, tier: l.f20.lod.tier(), speed: Math.round((l.speed || 0) * 100) / 100 };
    });
  }
  // Runs right before the engine draws (wrapped renderer.render, once per frame), i.e. after the engine's own peer
  // update: hiding the procedural body and posing the skeleton then take effect in the same frame.
  var last = performance.now(), hooked = false;
  function tick() {
    var now = performance.now(); if (now - last < 4) return;
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    var W = window.__fyrusW;
    try { wrap(W); frame(W, dt); } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }
  function hook() {
    var W = window.__fyrusW;
    if (!hooked && W && W.renderer && window.THREE && THREE.GLTFLoader && window.__fyrusLoco20) {
      var r = W.renderer, orig = r.render;
      r.render = function () { tick(); return orig.apply(this, arguments); };
      hooked = true; S.hooked = true; return;
    }
    if (!hooked) setTimeout(hook, 500);
  }
  need(hook);
  window.__fyrusAvatar20Net = {
    version: '20.15', stats: S, avatar: function () { return mine; },
    setAvatar: function (n) { if (NAMES.indexOf(n) >= 0) { mine = n; ls('fyrus.f20.avatar', n); return true; } return false; },
    emote: function (n) { if (EMOTES.indexOf(n) < 0) return false; myEmote = n; myEmoteAt = Date.now(); S.myEmotes = (S.myEmotes || 0) + 1; return true; },
    names: NAMES, emotes: EMOTES
  };
  if (Q.get('f20emoteloop')) { var ek = 0; setInterval(function () { window.__fyrusAvatar20Net.emote(EMOTES[ek++ % EMOTES.length]); }, 5000); }   // test driver
})();
