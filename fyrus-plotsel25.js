/* FYRUS 25.2 plot selection in the world. Kill switch: ?p25off=plotsel
 * When a plot is open in the Land Office panel (picked from the society map, the list or the plot sign in the world),
 * the plot is outlined on the ground in its status colour (Land Office / for sale / auction / rent / yours / owned) with
 * corner posts and a tall light beacon visible from far away. The highlight stays for 2 minutes after the panel closes
 * (so "Walk there" / "Taxi" lead to a visible target); it goes away 6 s after the player arrives inside the plot or when
 * another plot is picked. One small group of 9 meshes, updated at 20 Hz only while shown.
 * Stats / test hook: window.__fyrusPlotSel25 { stats, select(p|null), state() } */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p25off') || '').split(',').some(function (k) { return k === 'plotsel' || k === 'all'; })) return;
  var S = { selects: 0, releases: 0, arrivals: 0, expiries: 0, shown: false, id: null, errors: 0 };
  var API = window.__fyrusPlotSel25 = { version: '25.2', stats: S };
  var COL = { land: 0x3ddc84, sale: 0xffd166, auction: 0xff8c42, rent: 0x4da3ff, mine: 0xc084fc, owned: 0xe2e8f0, resident: 0x9ca3af };
  var T = null, W = null, grp = null, edges = [], posts = [], beam = null, mEdge = null, mBeam = null;
  var sel = null, until = 0, inside = 0, last = 0;
  function build() {
    grp = new T.Group(); grp.name = 'plotsel25'; grp.renderOrder = 5;
    mEdge = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false });
    mBeam = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, toneMapped: false });
    var eg = new T.BoxGeometry(1, 0.12, 0.22), pg = new T.BoxGeometry(0.22, 1.6, 0.22);
    for (var i = 0; i < 4; i++) { var e = new T.Mesh(eg, mEdge); edges.push(e); grp.add(e); var p = new T.Mesh(pg, mEdge); posts.push(p); grp.add(p); }
    beam = new T.Mesh(new T.CylinderGeometry(0.45, 0.45, 60, 12, 1, true), mBeam); beam.position.y = 30; grp.add(beam);
    grp.traverse(function (o) { o.frustumCulled = true; o.castShadow = false; o.receiveShadow = false; o.raycast = function () {}; });
    grp.visible = false; W.world.add(grp);
  }
  function ready() { if (!T) T = window.THREE; W = window.__fyrusW; if (!T || !W || !W.world) return false; if (!grp) build(); else if (grp.parent !== W.world) W.world.add(grp); return true; }
  function place(p) {
    var L = (p.size || 10) + 2, h = L / 2;
    grp.position.set(p.x, 0.06, p.z);
    edges[0].scale.x = edges[1].scale.x = L; edges[0].position.set(0, 0, -h); edges[1].position.set(0, 0, h);
    edges[2].scale.x = edges[3].scale.x = L; edges[2].rotation.y = edges[3].rotation.y = Math.PI / 2; edges[2].position.set(-h, 0, 0); edges[3].position.set(h, 0, 0);
    posts[0].position.set(-h, 0.8, -h); posts[1].position.set(h, 0.8, -h); posts[2].position.set(-h, 0.8, h); posts[3].position.set(h, 0.8, h);
    var c = COL[p.key] != null ? COL[p.key] : 0xffffff; mEdge.color.setHex(c); mBeam.color.setHex(c);
    grp.visible = true; S.shown = true; S.id = p.id;
  }
  function hide(why) { if (grp) grp.visible = false; sel = null; S.shown = false; S.id = null; if (why) S[why]++; }
  API.select = function (p) {
    try {
      if (p && typeof p.x === 'number') {
        if (!ready()) return;
        if (!sel || sel.id !== p.id) inside = 0;
        sel = p; until = Infinity; S.selects++; place(p);
      } else if (sel && until === Infinity) { until = performance.now() + 120000; S.releases++; }
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  };
  API.state = function () { return { id: S.id, shown: S.shown, inside: Math.round(inside * 10) / 10, until: until === Infinity ? 'panel' : Math.max(0, Math.round((until - performance.now()) / 1000)) }; };
  setInterval(function () {
    if (!sel || !grp) return;
    try {
      var now = performance.now(), dt = last ? Math.min(0.2, (now - last) / 1000) : 0.05; last = now;
      if (now > until) { hide('expiries'); return; }
      var t = now / 1000, pl = W.player && W.player.root, h = ((sel.size || 10) + 2) / 2 + 0.5;
      mEdge.opacity = 0.65 + 0.3 * Math.sin(t * 4);
      var d = pl ? Math.hypot(pl.position.x - sel.x, pl.position.z - sel.z) : 1e9;
      mBeam.opacity = d < 30 ? 0.08 + 0.004 * d : 0.3;
      if (pl && Math.abs(pl.position.x - sel.x) < h && Math.abs(pl.position.z - sel.z) < h) inside += dt; else inside = 0;
      if (inside > 6 && until !== Infinity) hide('arrivals');
    } catch (e) { S.errors++; S.lastError = String(e && e.message || e); }
  }, 50);
})();
