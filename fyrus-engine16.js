/* FYRUS City — Phase 16 engine foundation layer (local engine copy).
 *
 * Loaded synchronously right after three.js and BEFORE the main bundle, so it can configure the renderer the
 * bundle creates. Everything else attaches to the live engine (window.__fyrusW) when it appears.
 *
 *  1. Quality profiles  window.__fyrusQuality : cinematic | balanced | mobile | lite (29.3) | vr  (shared world assets;
 *     only budgets differ). Choose with ?quality=<name> (remembered) — default: balanced on desktop,
 *     mobile on touch phones.
 *  2. Fog-aware distance culling: an object whose nearest point is so deep in the scene fog that it would be
 *     drawn as >= 99.5 % fog colour (balanced) is skipped by the frustum test. Fog-exempt materials (sky,
 *     distant mountains, rainbow, lightning) are never culled. The sky and background are the fog colour,
 *     so the image does not change; the GPU and CPU simply stop drawing what cannot be seen.
 *  3. Crowd LOD for the procedural citizens (NPCs, street bots, interior NPCs): face micro-parts (eyes, irises,
 *     pupils, brows, lips …, each a separate draw call) are hidden beyond the profile's face distance; avatar
 *     parts stop casting shadows beyond the shadow distance; citizens beyond the hide distance are not drawn.
 *  4. Shadows per profile (map size, filter, coverage, update rate).
 *  5. Engine frame timing (tick ms) for the CPU-aware resolution governor in fyrus-perf.js.
 *  6. Contribution culling: objects whose projected size is below the profile's minPx (balanced: 2 device pixels).
 * Kill switches (A/B testing): ?p16off=all | fogcull,sizecull,crowd,shadow,profile,vendor   API: window.__fyrusEngine16.stats()
 */
(function () {
  'use strict';
  if (window.__fyrusEngine16) return;
  var T = window.THREE; if (!T) return;
  var Q = new URLSearchParams(location.search);
  var OFF = (Q.get('p16off') || '').split(',').filter(Boolean);
  var off = function (k) { return OFF.indexOf('all') >= 0 || OFF.indexOf(k) >= 0; };
  // A/B switch for the bundled dependencies: ?p16off=vendor loads the original CDN Tailwind (in-browser JIT)
  // and Google Fonts again, exactly as the baseline does (external network for that variant only).
  if (off('vendor') && document.readyState === 'loading') {
    document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Bebas+Neue&family=Playfair+Display:ital,wght@1,700&family=Pacifico&family=JetBrains+Mono:wght@400;600;700&display=swap"><script src="https://cdn.tailwindcss.com/3.4.17"><\/script>');
  }
  var phone = (function () { try { return ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) { return false; } })();
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------------- 1. quality profiles ---------------- */
  var PROFILES = {
    cinematic: { label: 'Desktop Cinematic', pixelRatioMax: 2.0, pixelRatioMinFrac: 0.85, targetFps: 60, antialias: true,
      shadow: { size: 4096, type: 'pcfsoft', half: 80, every: 1 }, fogCull: 0.998, minPx: 1.0, crowd: { face: 20, shadow: 50, hide: 220 }, avatarLod: 0, texScale: 1 },
    balanced: { label: 'Desktop Balanced', pixelRatioMax: 1.5, pixelRatioMinFrac: 0.75, targetFps: 60, antialias: true,
      shadow: { size: 2048, type: 'pcfsoft', half: 70, every: 1 }, fogCull: 0.995, minPx: 2.0, crowd: { face: 14, shadow: 32, hide: 150 }, avatarLod: 1, texScale: 1 },
    mobile: { label: 'Mobile Optimized', pixelRatioMax: 1.25, pixelRatioMinFrac: 0.65, targetFps: 45, antialias: false,
      shadow: { size: 1024, type: 'pcf', half: 45, every: 2 }, fogCull: 0.99, minPx: 3.0, crowd: { face: 9, shadow: 18, hide: 90 }, avatarLod: 2, texScale: 0.5 },
    // 29.3: one step below mobile for weak phones (auto step-down target, or chosen in Settings > Graphics & audio)
    lite: { label: 'Phone Lite', pixelRatioMax: 1.0, pixelRatioMinFrac: 0.6, targetFps: 30, antialias: false,
      shadow: { size: 512, type: 'pcf', half: 30, every: 3 }, fogCull: 0.985, minPx: 4.0, crowd: { face: 6, shadow: 10, hide: 60 }, avatarLod: 2, texScale: 0.5 },
    vr: { label: 'Future VR (budget preview, not headset-tested)', pixelRatioMax: 1.0, pixelRatioMinFrac: 0.8, targetFps: 72, antialias: true,
      shadow: { size: 1024, type: 'pcf', half: 40, every: 1 }, fogCull: 0.99, minPx: 2.0, crowd: { face: 10, shadow: 20, hide: 100 }, avatarLod: 2, texScale: 0.75,
      budget: { drawCallsPerEye: 1000, trianglesPerEye: 750000, frameMs: 13.9 } }
  };
  var want = (Q.get('quality') || '').toLowerCase();
  if (want && PROFILES[want]) lsSet('fyrus.quality16', want);
  var name = PROFILES[want] ? want : (PROFILES[lsGet('fyrus.quality16')] ? lsGet('fyrus.quality16') : (phone ? 'mobile' : 'balanced'));
  if (off('profile')) name = 'legacy';
  var P = PROFILES[name] || null;
  window.__fyrusQuality = {
    name: name, params: P, profiles: PROFILES,
    set: function (n) { if (!PROFILES[n]) return false; lsSet('fyrus.quality16', n); location.search = (function () { var q = new URLSearchParams(location.search); q.set('quality', n); return q.toString(); })(); return true; }
  };
  // the avatar demo layer reads its default detail level from here (?lod= still wins)
  if (P && Q.get('lod') == null && (want || lsGet('fyrus.demo.lod') == null)) lsSet('fyrus.demo.lod', String(P.avatarLod));

  /* renderer construction: profile antialias (a WebGL context cannot change it later) */
  if (P) {
    var Orig = T.WebGLRenderer;
    var Wrapped = function (params) { params = Object.assign({}, params || {}); params.antialias = P.antialias; return new Orig(params); };
    Wrapped.prototype = Orig.prototype;
    try { T.WebGLRenderer = Wrapped; } catch (e) {}
  }

  var S = { profile: name, fogCulled: 0, fogCutoff: null, crowd: { faceHidden: 0, shadowOff: 0, hidden: 0, avatars: 0 }, tickMs: null, shadow: null, applied: false };
  var E = window.__fyrusEngine16 = { version: '16.0.0', tickMs: null, stats: function () { var o = JSON.parse(JSON.stringify(S)); o.tickMs = E.tickMs; o.autoQuality = E.autoQuality; return o; } };

  /* ---------------- 2. fog-aware distance culling ---------------- */
  var FOG = { on: !!P && !off('fogcull'), camPos: new T.Vector3(), cutoff: Infinity, culled: 0 };
  /* contribution culling: skip objects whose projected diameter is below the profile's minPx device pixels */
  var SIZE = { on: !!P && !off('sizecull'), k: 0, culled: 0 };
  var tmpV = new T.Vector3();
  function fogged(m) {
    if (!m) return false;
    if (Array.isArray(m)) { for (var i = 0; i < m.length; i++) if (!fogged(m[i])) return false; return m.length > 0; }
    if (m.isShaderMaterial || m.isRawShaderMaterial) return !!(m.uniforms && m.uniforms.uFogD && !m.userData.noFogCull);
    return m.fog === true && !m.userData.noFogCull;
  }
  var origIntersects = T.Frustum.prototype.intersectsObject;
  T.Frustum.prototype.intersectsObject = function (object) {
    if (!origIntersects.call(this, object)) return false;
    if ((!FOG.on && !SIZE.on) || object.isInstancedMesh || object.isSkinnedMesh || (object.userData && object.userData.noFogCull)) return true;
    var g = object.geometry; if (!g || !g.boundingSphere) return true;
    tmpV.copy(g.boundingSphere.center).applyMatrix4(object.matrixWorld);
    var r = g.boundingSphere.radius * object.matrixWorld.getMaxScaleOnAxis(), d = tmpV.distanceTo(FOG.camPos);
    if (FOG.on && FOG.cutoff !== Infinity && d - r > FOG.cutoff && fogged(object.material)) { FOG.culled++; return false; }
    if (SIZE.on && SIZE.k > 0 && d > r && (r / d) * SIZE.k < P.minPx && !(object.userData && object.userData.__fxBatch)) { SIZE.culled++; return false; }
    return true;
  };
  function fogCutoff(fog, thr) {
    if (!fog) return Infinity;
    if (fog.isFogExp2) return fog.density > 0 ? Math.sqrt(-Math.log(1 - thr)) / fog.density : Infinity;
    if (fog.isFog) return fog.near + thr * (fog.far - fog.near);
    return Infinity;
  }

  /* ---------------- 3. crowd LOD ---------------- */
  function crowdList(W) {
    var a = [];
    try { W.npcs.list.forEach(function (n) { if (n.av) a.push(n.av); }); } catch (e) {}
    try { (W.bots || []).forEach(function (b) { a.push(b); }); } catch (e) {}
    try { W.innerNpcs.list.forEach(function (n) { if (n.av) a.push(n.av); }); } catch (e) {}
    try { (W.dancers || []).forEach(function (d) { if (d && d.root && d.head) a.push(d); }); } catch (e) {}
    return a;
  }
  function prep(av) {
    if (av.__p16 && av.__p16.sig === av.shapeSig && av.__p16.head === av.head) return av.__p16;
    var face = [], casters = [];
    if (av.head) av.head.traverse(function (o) {
      if (!o.isMesh || o === av.head || !o.geometry) return;
      if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
      var s = o.scale, r = o.geometry.boundingSphere.radius * Math.max(Math.abs(s.x), Math.abs(s.y), Math.abs(s.z));
      if (r < 0.06) face.push(o);                      /* eyes, irises, pupils, brows, lashes, nose, lips, ears */
    });
    av.root.traverse(function (o) { if (o.isMesh && o.castShadow) casters.push(o); });
    av.__p16 = { sig: av.shapeSig, head: av.head, face: face, casters: casters, faceOn: true, castOn: true, shown: true };
    return av.__p16;
  }
  var camPos = new T.Vector3();
  function crowdLod(W) {
    if (!P || off('crowd')) return;
    var C = P.crowd, list = crowdList(W), fh = 0, so = 0, hd = 0;
    W.camera.getWorldPosition(camPos);
    for (var i = 0; i < list.length; i++) {
      var av = list[i]; if (!av || !av.root || !av.root.parent) continue;
      var st = prep(av);
      av.root.getWorldPosition(tmpV);
      var d = tmpV.distanceTo(camPos);
      var talking = false; try { var t = window.__fyrus.getState().talk; talking = !!(t && av.def && t.id === av.def.id); } catch (e) {}
      var faceOn = talking || d < (st.faceOn ? C.face * 1.1 : C.face);
      if (faceOn !== st.faceOn) { st.faceOn = faceOn; for (var k = 0; k < st.face.length; k++) st.face[k].visible = faceOn; }
      var castOn = d < (st.castOn ? C.shadow * 1.1 : C.shadow);
      if (castOn !== st.castOn) { st.castOn = castOn; for (k = 0; k < st.casters.length; k++) st.casters[k].castShadow = castOn; }
      var shown = talking || d < (st.shown ? C.hide * 1.05 : C.hide);
      if (shown !== st.shown) { st.shown = shown; if (av.body) av.body.visible = shown; if (av.label && !shown) av.label.visible = false; if (av.ring) av.ring.layers.mask = shown ? 1 : 0; }
      if (!faceOn) fh++; if (!castOn) so++; if (!shown) hd++;
    }
    S.crowd = { avatars: list.length, faceHidden: fh, shadowOff: so, hidden: hd, faceDist: C.face, shadowDist: C.shadow, hideDist: C.hide };
  }

  /* ---------------- 4. shadows ---------------- */
  function applyShadows(W) {
    if (!P || off('shadow')) return;
    var sun = W.env && W.env.sun, R = W.renderer; if (!sun || !R) return;
    var sp = P.shadow, cam = sun.shadow.camera;
    var want = { size: sp.size, half: sp.half, type: sp.type === 'pcf' ? T.PCFShadowMap : T.PCFSoftShadowMap };
    if (sun.shadow.mapSize.x !== want.size) { sun.shadow.mapSize.set(want.size, want.size); if (sun.shadow.map) { sun.shadow.map.dispose(); sun.shadow.map = null; } }
    if (cam.right !== want.half) { cam.left = cam.bottom = -want.half; cam.right = cam.top = want.half; cam.updateProjectionMatrix(); }
    if (R.shadowMap.type !== want.type) R.shadowMap.type = want.type;
    S.shadow = { size: want.size, half: want.half, type: sp.type, every: sp.every };
  }

  /* ---------------- 5. Phase 19.11: automatic quality step-down ----------------
     When nobody chose a profile (no ?quality=, no saved manual choice) and the machine sustains far less than the
     profile's target fps after warm-up, the NEXT visit starts one profile lower (cinematic -> balanced -> mobile).
     Never switches mid-session (no surprise reload); a manual choice always wins. Off: ?p16off=autoq */
  var AUTOQ = { enabled: !off('autoq') && !!P && (!want || Q.get('autoqtest') === '1') && lsGet('fyrus.quality16.manual') !== '1', state: 'warmup', medianFps: null, decision: null };
  (function autoQ() {
    if (!AUTOQ.enabled) { AUTOQ.state = 'off'; return; }
    var test = Q.get('autoqtest') === '1', warm = test ? 5000 : 25000, win = test ? 5000 : 15000, thr = test ? 1000 : P.targetFps * 0.66;
    var t0 = null, dts = [], last = 0, order = ['cinematic', 'balanced', 'mobile', 'lite'];   // 29.3: phones below 2/3 of 45 fps step to lite
    function f(now) {
      var W = window.__fyrusW;
      if (!W || W.active !== W.world || document.hidden) { last = 0; requestAnimationFrame(f); return; }
      if (t0 === null) t0 = now;
      if (last) { var dt = now - last; if (now - t0 > warm && dt < 1000) dts.push(dt); }
      last = now;
      if (now - t0 < warm + win) { requestAnimationFrame(f); return; }
      dts.sort(function (a, b) { return a - b; });
      var fps = 1000 / (dts[Math.floor(dts.length / 2)] || 16.7); AUTOQ.medianFps = Math.round(fps * 10) / 10;
      var i = order.indexOf(name);
      if (fps < thr && i >= 0 && i < order.length - 1) { AUTOQ.decision = order[i + 1]; lsSet('fyrus.quality16', order[i + 1]); lsSet('fyrus.quality16.auto', name + '->' + order[i + 1] + ' @' + AUTOQ.medianFps + 'fps'); AUTOQ.state = 'stepped-down-next-visit'; }
      else AUTOQ.state = 'ok';
    }
    requestAnimationFrame(f);
  })();
  E.autoQuality = AUTOQ;
  if (want && Q.get('autoqtest') !== '1') lsSet('fyrus.quality16.manual', '1');   // an explicit ?quality= choice is a manual choice

  /* ---------------- attach to the engine ---------------- */
  var attachedW = null, frame = 0;
  function attach(W) {
    attachedW = W;
    var R = W.renderer;
    // engine frame cost (EMA), used by the CPU-aware resolution governor
    var tick = W.tick;
    W.tick = function () { var t0 = performance.now(); var r = tick.apply(this, arguments); var d = performance.now() - t0; E.tickMs = E.tickMs == null ? d : E.tickMs * 0.9 + d * 0.1; return r; };
    // per-render bookkeeping: camera position + fog cutoff for the culling test, shadow update rate
    var render = R.render;
    R.render = function (scene, camera) {
      if ((FOG.on || SIZE.on) && scene && camera) {
        camera.getWorldPosition(FOG.camPos);
        FOG.cutoff = FOG.on && scene.fog ? fogCutoff(scene.fog, P.fogCull) : Infinity;
        FOG.culled = 0; SIZE.culled = 0;
        SIZE.k = camera.isPerspectiveCamera ? R.domElement.height / Math.tan(camera.fov * Math.PI / 360) : 0;
      }
      if (P && !off('shadow') && P.shadow.every > 1 && scene === W.active) {
        R.shadowMap.autoUpdate = false;
        if (frame % P.shadow.every === 0) R.shadowMap.needsUpdate = true;
      }
      var out = render.apply(this, arguments);
      if ((FOG.on || SIZE.on) && scene === W.active) { S.fogCulled = FOG.culled; S.sizeCulled = SIZE.culled; S.fogCutoff = FOG.cutoff === Infinity ? null : Math.round(FOG.cutoff); }
      return out;
    };
    applyShadows(W);
    S.applied = true;
  }
  /* dev-only graphics profile switch, added to the existing DEV panel when it is present */
  function addProfileRow() {
    if (typeof document === 'undefined') return true;
    var panel = document.getElementById('fyrus-avatar-demo-panel'); if (!panel || document.getElementById('fx16-q')) return !!panel;
    var row = document.createElement('div'); row.id = 'fx16-q'; row.style.cssText = 'margin:6px 0 0;color:#9fb0d0;font-size:11px';
    row.appendChild(document.createTextNode('Graphics (Phase 16): '));
    [['cinematic', 'Cinematic'], ['balanced', 'Balanced'], ['mobile', 'Mobile'], ['lite', 'Lite'], ['vr', 'VR budget']].forEach(function (q) {
      var b = document.createElement('button'); b.textContent = q[1];
      var on = q[0] === name;
      b.style.cssText = 'font:600 11px/1 system-ui,sans-serif;padding:4px 6px;margin:3px 3px 0 0;border-radius:7px;border:1px solid ' + (on ? '#7aa2ff' : '#3a4a66') + ';background:' + (on ? '#2c5bd8' : '#16203a') + ';color:#e8eefc;cursor:pointer';
      b.addEventListener('click', function (e) { e.stopPropagation(); window.__fyrusQuality.set(q[0]); });
      row.appendChild(b);
    });
    var body = panel.children[1] || panel; body.appendChild(row);
    return true;
  }
  var rowDone = false;
  function loop() {
    requestAnimationFrame(loop);
    if (!rowDone && frame % 30 === 0) rowDone = addProfileRow();
    var W = window.__fyrusW;
    if (!W || !W.renderer || !W.camera) return;
    if (W !== attachedW) attach(W);
    frame++;
    if (frame % 6 === 0) crowdLod(W);
    if (frame % 120 === 0) applyShadows(W);
  }
  requestAnimationFrame(loop);
})();
