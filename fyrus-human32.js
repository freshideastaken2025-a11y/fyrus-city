/* FYRUS 32 — procedural human characters (code-generated meshes, no Blender).
 * Meshes: /assets/characters/human32/human32-<male|female>-<base|formal|sport>[-a2|-a3].glb are built by
 * tools/human32/build.js from signed-distance anatomy + garments (surface nets + QEM LODs). They reuse the fyrus20
 * skeleton and its 15 clips, so the existing locomotion blender (window.__fyrusLoco20) drives them unchanged.
 * Hair: hair32-<sex>-<style>[-a2|-a3].glb (head-bone space), attached to the head bone of every LOD tier.
 * Look: one material per character; colours come from uniforms, skin/eye/cloth detail is procedural in the shader.
 * API: window.__fyrusHuman32.create(look) -> Promise<{ group, tiers, clips, lod, setLook(look), dispose() }>
 *      .lookFromOutfit(outfit, seed) maps the game's avatar outfit (Nn.outfit) to a look.
 * Kill switch: ?h32off=1 (the old avatars come back). Player only: ?h32=player. Dev: ?h32dbg=1 logs. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if (Q.get('h32off') === '1') return;
  // distances follow the graphics profile (window.__fyrusQuality: cinematic | balanced | mobile | lite)
  var QP = (window.__fyrusQuality && window.__fyrusQuality.params) || null, QN = (window.__fyrusQuality && window.__fyrusQuality.name) || 'balanced';
  var CROWD = (QP && QP.crowd) || { face: 14, hide: 150 }, LOW = QN === 'mobile' || QN === 'lite';
  var HIDE = +(Q.get('h32hide') || Math.min(120, CROWD.hide * 0.6)), NEAR = +(Q.get('h32near') || Math.max(3.5, CROWD.face * 0.6));
  var BASE = '/assets/characters/human32/', VER = '?v=33.5';
  var T = null, cache = {}, S = { created: 0, failed: 0, attached: 0, lastError: null, loads: 0 };
  var API = window.__fyrusHuman32 = { version: '32.1', stats: S };
  // claim the avatar factory slot so the older premium layer (glb/female-primary, box-like) never loads
  if (!window.__fyrusAvatarFactory) window.__fyrusAvatarFactory = { version: 'human32', loaded: true, active: true, spawn: function () { return Promise.resolve(true); } };

  function three() { T = T || window.THREE; return T; }
  function loadScript(src) { return new Promise(function (res, rej) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function need() {
    var p = Promise.resolve();
    if (!three().GLTFLoader) p = p.then(function () { return loadScript('/fyrus-gltf-loader.js?v=1.0.0'); });
    if (!window.__fyrusLoco20) p = p.then(function () { return loadScript('/fyrus-avatar20.js?v=20.16'); });
    return p;
  }
  function parse(url) {
    if (!cache[url]) cache[url] = fetch(url).then(function (r) { if (!r.ok) throw new Error(url + ' ' + r.status); return r.arrayBuffer(); })
      .then(function (buf) { S.loads++; return new Promise(function (res, rej) { new T.GLTFLoader().parse(buf, '', res, rej); }); });
    return cache[url];
  }
  // clone a skinned scene so every character has its own skeleton but shares geometry
  function cloneSkinned(src) {
    var clone = src.clone(true), sm = new Map(), cm = new Map();
    (function par(a, b) { sm.set(b, a); cm.set(a, b); for (var i = 0; i < a.children.length; i++) par(a.children[i], b.children[i]); })(src, clone);
    clone.traverse(function (n) {
      if (!n.isSkinnedMesh) return; var s = sm.get(n);
      n.bind(new T.Skeleton(s.skeleton.bones.map(function (b) { return cm.get(b); }), s.skeleton.boneInverses), s.bindMatrix);
      if (s.morphTargetInfluences) n.morphTargetInfluences = s.morphTargetInfluences.slice();
    });
    return clone;
  }

  // ---------------- materials ----------------
  var NOISE = [
    'float h32h(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }',
    'float h32n(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(mix(h32h(i), h32h(i + vec3(1,0,0)), f.x), mix(h32h(i + vec3(0,1,0)), h32h(i + vec3(1,1,0)), f.x), f.y),',
    '             mix(mix(h32h(i + vec3(0,0,1)), h32h(i + vec3(1,0,1)), f.x), mix(h32h(i + vec3(0,1,1)), h32h(i + vec3(1,1,1)), f.x), f.y), f.z); }',
    'float h32f(vec3 x){ return 0.5 * h32n(x) + 0.25 * h32n(x * 2.03) + 0.125 * h32n(x * 4.01); }',
    // bump from a procedural height (surface gradient, no tangents needed)
    'vec3 h32bump(vec3 n, vec3 vpos, float h, float k){ vec3 dpx = dFdx(vpos), dpy = dFdy(vpos); float dhx = dFdx(h), dhy = dFdy(h);',
    '  vec3 r1 = cross(dpy, n), r2 = cross(n, dpx); float det = dot(dpx, r1); vec3 g = sign(det) * (dhx * r1 + dhy * r2);',
    '  return normalize(abs(det) * n - g * k); }'
  ].join('\n');
  // region ids written by the generator
  var R = { skin: 0, top: 1, top2: 2, bottom: 3, shoes: 4, sole: 5, lips: 6, eye: 7, nails: 8, belt: 9, mouth: 10, hair: 11, tie: 12 };
  // palette colours are authored in sRGB; with legacy colour management three would treat them as linear (washed out)
  function col(c) { var k = new T.Color(c); return (T.ColorManagement && T.ColorManagement.legacyMode === false) ? k : k.convertSRGBToLinear(); }
  function bodyMaterial(look) {
    var u = {
      uPal: { value: [] }, uIris: { value: col(look.eyes || '#5a3b24') }, uHairC: { value: col(look.hairColor || '#2a1b12') },
      uBeard: { value: look.beard || 0 }, uDetail: { value: look.detail === undefined ? (LOW && !look.player ? 0 : 1) : look.detail }
    };
    setPalette(u, look);
    var m = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, metalness: 0 });
    m.userData.h32 = u; m.name = 'h32-body';
    m.customProgramCacheKey = function () { return 'h32body-1'; };
    m.onBeforeCompile = function (sh) {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float _rid; attribute vec4 _fx; uniform vec3 uPal[13];\nvarying float vRid; varying vec4 vFx; varying vec3 vBind; varying vec2 vEyeUv; varying vec3 vPal;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRid = _rid; vFx = _fx; vBind = position; vEyeUv = uv; vPal = uPal[int(_rid + 0.5)];');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nuniform vec3 uIris; uniform vec3 uHairC; uniform float uBeard; uniform float uDetail;\nvarying float vRid; varying vec4 vFx; varying vec3 vBind; varying vec2 vEyeUv; varying vec3 vPal;\n' + NOISE)
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );', [
          'int rid = int(vRid + 0.5); vec3 c = vPal; float ao = mix(1.0, vFx.w, 0.85);',
          'float n1 = h32f(vBind * 55.0), n2 = h32n(vBind * 900.0);',
          'if (rid == 0 || rid == 8) {',
          '  c *= 0.93 + 0.1 * n1;',                                                   // mottling
          '  float blush = min(vFx.z, 0.49) * 2.0, lash = clamp((vFx.z - 0.5) * 2.0, 0.0, 1.0);',
          '  c = mix(c, c * vec3(1.1, 0.83, 0.8), clamp(blush * 0.45 + (1.0 - vFx.w) * 0.35, 0.0, 1.0));',   // blush, warm creases
          '  float brow = vFx.x * smoothstep(0.25, 0.75, h32n(vBind * vec3(300.0, 1500.0, 700.0)) + vFx.x * 0.35);',
          '  c = mix(c, uHairC * 0.85, clamp(brow, 0.0, 1.0));',
          '  c = mix(c, uHairC * 0.7, uBeard * vFx.y * (0.35 + 0.65 * n2));',
          '  c = mix(c, uHairC * 0.25, lash * 0.92);',
          '  if (rid == 8) c = mix(c, vec3(0.93, 0.78, 0.74), 0.55);',
          '} else if (rid == 7) {',
          '  vec2 q = (vEyeUv - 0.5) * 2.0; float r = length(q), a = atan(q.y, q.x);',
          '  vec3 sclera = vec3(0.86, 0.83, 0.8) * (0.92 + 0.08 * n1); sclera = mix(sclera, vec3(0.85, 0.55, 0.5), smoothstep(0.75, 1.0, r) * 0.25);',
          '  float st = 0.65 + 0.35 * h32n(vec3(a * 9.0, r * 14.0, 0.0));',
          '  vec3 iris = uIris * st * (1.15 - 0.4 * r); iris = mix(iris, uIris * 0.25, smoothstep(0.38, 0.47, r));',
          '  c = mix(iris, sclera, smoothstep(0.455, 0.49, r)); c = mix(vec3(0.015), c, smoothstep(0.17, 0.2, r));',
          '} else if (rid == 6) { c *= 0.88 + 0.16 * h32n(vBind * vec3(300.0, 1600.0, 300.0)); }',
          '  else if (rid == 10) { c = vec3(0.16, 0.05, 0.05); }',
          '  else { c *= 0.94 + 0.08 * n1;',
          '    if ((rid == 1 || rid == 2 || rid == 3 || rid == 9 || rid == 12) && vFx.x > 0.5) { float dash = step(0.45, fract((vBind.x + vBind.z) * 260.0 + vBind.y * 260.0)); c = mix(c, c * 0.55 + 0.04, dash * 0.8); } }',
          'vec4 diffuseColor = vec4(c * ao, opacity);'].join('\n'))
        .replace('float roughnessFactor = roughness;', [
          'float roughnessFactor = roughness;',
          'if (rid == 0) roughnessFactor = 0.47 + 0.18 * n1 + 0.1 * n2; else if (rid == 6) roughnessFactor = 0.33; else if (rid == 7) roughnessFactor = 0.06;',
          'else if (rid == 8) roughnessFactor = 0.28; else if (rid == 4) roughnessFactor = 0.42; else if (rid == 5) roughnessFactor = 0.9; else if (rid == 10) roughnessFactor = 0.7; else roughnessFactor = 0.83 + 0.08 * n1;'].join('\n'))
        .replace('#include <normal_fragment_maps>', [
          '#include <normal_fragment_maps>',
          'if (uDetail > 0.5) {',
          '  if (rid == 0) normal = h32bump(normal, -vViewPosition, h32n(vBind * 1300.0) * 0.7 + h32n(vBind * 380.0) * 0.3, 0.00009);',
          '  else if (rid == 1 || rid == 2 || rid == 3 || rid == 9 || rid == 12) normal = h32bump(normal, -vViewPosition, h32n(vBind * vec3(900.0, 2200.0, 900.0)) * 0.35 + h32n(vBind * 140.0) * 0.65, 0.00016);',
          '}'].join('\n'))
        .replace('#include <lights_physical_pars_fragment>', [
          '#include <lights_physical_pars_fragment>',
          // 33.2 skin: wrapped diffuse with red bleed at the light terminator (cheap subsurface approximation)
          'void RE_Direct_H32(const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {',
          '  RE_Direct_Physical(directLight, geometry, material, reflectedLight);',
          '  float sk = float(abs(vRid) < 0.5 || abs(vRid - 6.0) < 0.5 || abs(vRid - 8.0) < 0.5);',
          '  if (sk > 0.0) { float ndl = dot(geometry.normal, directLight.direction); float w = 0.45;',
          '    float wrap = clamp((ndl + w) / (1.0 + w), 0.0, 1.0) - clamp(ndl, 0.0, 1.0);',
          '    reflectedLight.directDiffuse += sk * max(wrap, 0.0) * directLight.color * material.diffuseColor * vec3(0.95, 0.38, 0.26) * 0.55; }',
          '}',
          '#undef RE_Direct',
          '#define RE_Direct RE_Direct_H32'].join('\n'))
        .replace('#include <emissivemap_fragment>', [
          '#include <emissivemap_fragment>',
          'if (rid == 0 || rid == 6) { float fr = pow(1.0 - clamp(dot(normal, normalize(vViewPosition)), 0.0, 1.0), 3.0); totalEmissiveRadiance += diffuseColor.rgb * (vec3(0.05, 0.016, 0.011) + fr * vec3(0.06, 0.035, 0.03)); }'].join('\n'));
    };
    return m;
  }
  function setPalette(u, look) {
    var skin = col(look.skin || '#c68e6a'), top = col(look.top || '#3a6f8f'), bottom = col(look.bottom || '#2d3646');
    var top2 = col(look.top2 || '#ece9e2'), shoes = col(look.shoes || '#e9e7e2'), lips = col(look.lips || '#a8605a');
    var p = [skin, top, top2, bottom, shoes, col(look.sole || '#3a3a3a'), lips, col('#ffffff'), skin, col(look.belt || '#2a211b'), col('#2a0c0c'), col(look.hairColor || '#2a1b12'), col(look.tie || '#6d1f2a')];
    u.uPal.value = p;
  }
  function hairMaterial(look) {
    var u = { uHairC: { value: col(look.hairColor || '#2a1b12') }, uSkinC: { value: col(look.skin || '#c68e6a') }, uCloth: { value: look.hairStyle === 'hijab' ? 1 : 0 } };
    var m = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.45, metalness: 0 });
    m.userData.h32 = u; m.name = 'h32-hair'; m.customProgramCacheKey = function () { return 'h32hair-1'; };
    m.onBeforeCompile = function (sh) {
      Object.assign(sh.uniforms, u);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec4 _fx; attribute float _edge; varying vec4 vFx; varying vec3 vBind; varying float vEdge;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFx = _fx; vBind = position; vEdge = _edge;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uHairC; uniform vec3 uSkinC; uniform float uCloth; varying vec4 vFx; varying vec3 vBind; varying float vEdge;\n' + NOISE)
        .replace('vec4 diffuseColor = vec4( diffuse, opacity );', [
          'vec3 fl = normalize(vFx.xyz * 2.0 - 1.0); vec3 q = vBind - fl * dot(vBind, fl) * 0.92;',
          'float s1 = h32n(q * 1500.0), s2 = h32n(q * 380.0), s = mix(s1, s2, 0.45);',
          'float ao = mix(1.0, vFx.w, 0.9);',
          'vec3 c = uCloth > 0.5 ? uHairC * (0.92 + 0.08 * h32n(vBind * 200.0)) : uHairC * (0.62 + 0.62 * s);',
          'if (uCloth < 0.5) { float keep = step(1.0 - vEdge, s1 * 0.6 + s2 * 0.4 + 0.05); c = mix(uSkinC * 0.82, c, mix(keep, 1.0, smoothstep(0.55, 0.85, vEdge))); }',
          'vec4 diffuseColor = vec4(c * ao, opacity);'].join('\n'))
        .replace('float roughnessFactor = roughness;', 'float roughnessFactor = uCloth > 0.5 ? 0.85 : 0.38 + 0.25 * (1.0 - s);')
        .replace('#include <normal_fragment_maps>', '#include <normal_fragment_maps>\nif (uCloth < 0.5) normal = h32bump(normal, -vViewPosition, s, 0.0012);');
    };
    return m;
  }

  var strandTex = null;
  function strands() {
    if (strandTex) return strandTex;
    var c = document.createElement('canvas'); c.width = 128; c.height = 256; var g = c.getContext('2d'); g.clearRect(0, 0, 128, 256);
    for (var i = 0; i < 90; i++) {
      var x = Math.random() * 128, w = 0.6 + Math.random() * 1.6, len = 150 + Math.random() * 106, sh = 0.55 + Math.random() * 0.45, a = 0.55 + Math.random() * 0.45;
      var gr = g.createLinearGradient(0, 0, 0, len); gr.addColorStop(0, 'rgba(' + [255 * sh, 255 * sh, 255 * sh].map(Math.round).join(',') + ',' + a + ')'); gr.addColorStop(0.75, 'rgba(255,255,255,' + a * 0.8 + ')'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.strokeStyle = gr; g.lineWidth = w; g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (Math.random() - 0.5) * 6, len * 0.4, x + (Math.random() - 0.5) * 10, len * 0.7, x + (Math.random() - 0.5) * 12, len); g.stroke();
    }
    strandTex = new T.CanvasTexture(c); strandTex.encoding = T.sRGBEncoding; strandTex.anisotropy = 4; return strandTex;
  }
  function cardMaterial(look) {
    var m = new T.MeshStandardMaterial({ map: strands(), color: col(look.hairColor || '#2a1b12'), roughness: 0.5, metalness: 0, alphaTest: 0.38, side: T.DoubleSide });
    m.name = 'h32-hair-cards'; return m;
  }
  // ---------------- looks ----------------
  var SKINS = ['#f1c9a8', '#e5b48f', '#d49a72', '#c68e6a', '#ad7351', '#8d5a3b', '#6e432a', '#57331f'];
  var HAIRC = ['#1b130e', '#2a1b12', '#3b2516', '#5a3a22', '#7a5230', '#a07a4c', '#c9a46a', '#8a8580', '#141414'];
  var IRIS = ['#3b2516', '#5a3b24', '#6b4a2a', '#4f6a7a', '#5d7a52', '#2e2016'];
  var TOPS = ['#2f4f6f', '#a83b3b', '#f2efe8', '#3d5a3d', '#c7a46a', '#222831', '#7a4a8a', '#d9822b', '#5b7c99', '#8c8c8c', '#1f3b57', '#b85c7a', '#e4d6b5', '#46505a', '#6d8f6a', '#c94f4f'];
  var BOTTOMS = ['#2d3646', '#1f2328', '#4a3b2e', '#6b6f75', '#2c3e50', '#7a6a55', '#11151a', '#384b6b', '#5e5348', '#3b4a3b'];
  var JACKETS = ['#1f2533', '#2c2c2c', '#3a3f4a', '#4a3b30', '#1d3b4f', '#5a5f66', '#3b2f2a'];
  var SHOES = ['#e9e7e2', '#222222', '#5a3b28', '#2b2f36', '#b5b0a8', '#7a2e2e'];
  var pick = function (r, a) { return a[Math.floor(r() * a.length)]; };
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return (s >>> 0) / 4294967296; }; }
  function hash(str) { var h = 2166136261; str = String(str || ''); for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  // clothes must never read as bare skin: a top/bottom colour too close to the skin tone is replaced (stable per seed)
  function nearSkin(c, sk) { if (!c || !sk) return false; var a = new (three().Color)(c), b = new (three().Color)(sk); return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 0.32; }
  API.lookFromOutfit = function (o, seed) { var L0 = lookFromOutfit0(o, seed), r2 = rng(hash(seed) ^ 0x7f4a7c15);
    if (nearSkin(L0.top, L0.skin)) { var c; do { c = pick(r2, L0.outfit === 'formal' ? JACKETS : TOPS); } while (nearSkin(c, L0.skin)); L0.top = c; }
    if (nearSkin(L0.bottom, L0.skin)) { var d; do { d = pick(r2, BOTTOMS); } while (nearSkin(d, L0.skin)); L0.bottom = d; }
    return L0; };
  function lookFromOutfit0(o, seed) {
    o = o || {}; var r = rng(hash(seed) ^ 0x9e3779b9), f = o.gender === 'f';
    var hs = String(o.hair || '');
    var style = f ? ({ long: 'long', bun: 'bun', ponytail: 'ponytail', braids: 'long', hijab: 'hijab', curly: 'bob', short: 'bob', buzz: 'bob', cap: 'ponytail' }[hs] || ['long', 'bun', 'ponytail', 'bob'][Math.floor(r() * 4)])
      : ({ short: 'short', buzz: 'buzz', curly: 'curly', cap: 'short', long: 'curly', bun: 'short', hijab: 'short' }[hs] || ['short', 'short', 'buzz', 'curly'][Math.floor(r() * 4)]);
    var ts = String(o.topStyle || ''), outfit = /suit|blazer|jacket|formal|coat/.test(ts) ? 'formal' : /hood|sport|tank|track/.test(ts) ? 'sport' : (ts === 'tee' ? (r() < 0.62 ? 'base' : r() < 0.5 ? 'formal' : 'sport') : 'base');
    return { sex: f ? 'f' : 'm', outfit: outfit, hairStyle: style, skin: o.skin || SKINS[Math.floor(r() * SKINS.length)], top: o.top || pick(r, outfit === 'formal' ? JACKETS : TOPS), top2: o.top2 || (outfit === 'formal' ? pick(r, ['#eeeeea', '#dfe6ee', '#f2ece0', '#cfd8e3']) : undefined),
      bottom: o.bottom || pick(r, BOTTOMS), shoes: o.shoes || (outfit === 'formal' ? pick(r, ['#1a1a1a', '#3b2416', '#2a1c14']) : pick(r, SHOES)), tie: pick(r, ['#6d1f2a', '#1f2f5a', '#2f4a2f', '#5a4a1f']), hairColor: o.hairColor || HAIRC[Math.floor(r() * HAIRC.length)], eyes: o.eyes || IRIS[Math.floor(r() * IRIS.length)], lips: o.lips,
      beard: f ? 0 : (o.beard && o.beard !== 'none' ? 0.9 : (r() < 0.35 ? 0.35 + r() * 0.4 : 0)), height: (o.height || 1) * (0.95 + r() * 0.1), seed: hash(seed) };
  };

  // ---------------- assembly ----------------
  API.create = function (look) {
    look = look || {}; if (Q.get('h32fail') === '1') { S.failed++; return Promise.reject(new Error('h32fail test switch')); } X = X || new (three().Vector3)(1, 0, 0);
    return need().then(function () {
      var sex = look.sex === 'f' ? 'female' : 'male', of = look.outfit || 'base', hst = look.hairStyle || (sex === 'female' ? 'long' : 'short');
      var b = BASE + 'human32-' + sex + '-' + of, hb = BASE + 'hair32-' + sex + '-' + hst;
      return Promise.all([parse(b + '.glb' + VER), parse(b + '-a2.glb' + VER), parse(b + '-a3.glb' + VER), parse(hb + '.glb' + VER), parse(hb + '-a2.glb' + VER), parse(hb + '-a3.glb' + VER)]).then(function (g) {
        var bm = bodyMaterial(look), hm = hairMaterial(look), cm = cardMaterial(look), group = new T.Group(), tiers = {};
        group.name = 'h32-' + sex + '-' + of;
        ['a1', 'a2', 'a3'].forEach(function (k, i) {
          var sc = cloneSkinned(g[i].scene); sc.name = 'h32-' + k;
          sc.traverse(function (o) { if (o.isMesh) { o.material = bm; o.castShadow = i === 0 && look.shadow !== false; o.receiveShadow = i === 0; o.frustumCulled = false; o.userData.noBatch = o.userData.noInstance = true; } });
          var head = null; sc.traverse(function (o) { if (o.isBone) { o.userData.bq = o.quaternion.clone(); if (o.name === 'head') head = o; } });
          if (head) g[3 + i].scene.children.forEach(function (src, ci) { if (ci && (i > 0 || (LOW && !look.player))) return;   // strand cards only on the near tier (player only on mobile/lite)
            var hair = src.clone(); hair.material = ci ? cm : hm; hair.castShadow = i === 0 && !ci; hair.frustumCulled = false; hair.userData.noBatch = hair.userData.noInstance = true; hair.name = ci ? 'h32-hair-cards' : 'h32-hair'; head.add(hair); });
          tiers[k] = sc; group.add(sc);
        });
        group.scale.setScalar(look.height || 1);
        var clips = g[0].animations, lod0 = window.__fyrusLoco20.lodGroup(tiers, clips, { near: look.near || NEAR, far: look.far || 38 });
        // 32.4 cost control: hidden beyond HIDE m, animated at a low rate when off-screen, a3 skin updates every 3rd call
        var acc = 0, n = 0, wp = new T.Vector3(), sph = new T.Sphere(wp, 1.3), fr = new T.Frustum(), pm = new T.Matrix4();
        var lod = { stats: lod0.stats, tier: lod0.tier, emote: lod0.emote, update: function (dt, camPos, vL, vF, turn) {
          group.getWorldPosition(wp); var d = wp.distanceTo(camPos), W = window.__fyrusW, cam = W && W.camera;
          if (!look.noCull && d > (look.hide || HIDE)) { if (group.visible) group.visible = false; acc += dt; return; }
          if (!group.visible) group.visible = true;
          var every = d > 45 ? 3 : 1;
          if (cam && d > 6 && !look.noCull) { pm.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse); fr.setFromProjectionMatrix(pm); if (!fr.intersectsSphere(sph)) every = 8; }
          lod.updated = false; acc += dt; if (++n % every) return; restorePose(inst); lod0.update(acc, camPos, vL, vF, turn); acc = 0; lod.updated = true;
        } };
        // 33.7 stable face/body variation: seeded influences on the generated shape morphs
        var r = rng((look.seed || hash(JSON.stringify([look.sex, look.skin, look.hairColor]))) ^ 0x51ed27), shp = look.shape || {
          F_Jaw: -0.5 + (r() - 0.5) * 0.9, F_Nose: -0.3 + (r() - 0.5) * 0.9, F_Cheek: (look.sex === 'f' ? -0.6 : -0.9) + (r() - 0.5) * 0.6, F_Lips: (look.sex === 'f' ? 0.1 : -0.25) + (r() - 0.5) * 0.8, F_Chin: 0.3 + (r() - 0.5) * 1.0, F_Brow: (look.sex === 'f' ? -0.5 : 0.2) + (r() - 0.5) * 0.8, F_Asym: r() * 2 - 1, B_Heavy: Math.max(-0.4, r() * r() * 1.3 - 0.25) };
        look.shape = shp;
        Object.keys(tiers).forEach(function (k) { tiers[k].traverse(function (o) { var d = o.morphTargetDictionary; if (!d) return; for (var n in shp) if (d[n] !== undefined) o.morphTargetInfluences[d[n]] = shp[n]; }); });
        S.created++;
        var inst = { group: group, tiers: tiers, clips: clips, lod: lod, look: look, material: bm, hairMaterial: hm,
          setLook: function (l2) { Object.assign(look, l2); setPalette(bm.userData.h32, look); bm.userData.h32.uIris.value.copy(col(look.eyes || '#5a3b24')); bm.userData.h32.uHairC.value.copy(col(look.hairColor || '#2a1b12')); bm.userData.h32.uBeard.value = look.beard || 0; hm.userData.h32.uHairC.value.copy(col(look.hairColor || '#2a1b12')); hm.userData.h32.uSkinC.value.copy(col(look.skin || '#c68e6a')); cm.color.copy(col(look.hairColor || '#2a1b12')); },
          face: function (name, w) { Object.keys(tiers).forEach(function (k) { tiers[k].traverse(function (o) { if (o.morphTargetDictionary && o.morphTargetDictionary[name] !== undefined) o.morphTargetInfluences[o.morphTargetDictionary[name]] = w; }); }); },
          dispose: function () { if (inst.disposed) return; inst.disposed = true; bm.dispose(); hm.dispose(); cm.dispose(); if (group.parent) group.parent.remove(group); Object.keys(tiers).forEach(function (k) { if (tiers[k].parent) tiers[k].parent.remove(tiers[k]); tiers[k].traverse(function (o) { if (o.isSkinnedMesh && o.skeleton) o.skeleton.dispose(); }); }); S.disposed = (S.disposed || 0) + 1; }
        };
        return inst;
      });
    }).catch(function (e) { S.failed++; S.lastError = String(e && e.message || e); if (Q.get('h32dbg')) console.warn('[human32]', e); throw e; });
  };

  // ---------------- game avatars (Nn) ----------------
  // fyrus-city's avatar class calls window.__fyrusAvatarHook(avatar, isPlayer) from its constructor; we replace its
  // primitive body with a human once loaded and drive the locomotion from the avatar's own speed / emote state.
  var EM = { wave: 'Wave', dance: 'Cheer', hearts: 'Clap', clap: 'Clap', cheer: 'Cheer', laugh: 'Laugh', bow: 'Bow', point: 'Point' };
  var live = new Set(), playerOnly = Q.get('h32') === 'player', MAXH = +(Q.get('h32max') || 240);
  var v3 = null, v4 = null;
  API.live = function () { return live.size; };
  function seedOf(nn, o) { return (nn.name || '') + '|' + (nn.role || '') + '|' + (o && o.skin); }
  // an avatar outside the city scene (wardrobe preview, mini scenes) is drawn with its own camera: no LOD/hide/cull
  function standalone(nn) { var W = window.__fyrusW, o = nn.root; while (o.parent) o = o.parent; return !W || (o !== W.world && o !== W.home && o !== W.active); }
  API.attach = function (nn, isPlayer) {
    if (!nn || nn.h32 || (playerOnly && !isPlayer)) return;
    if (!isPlayer && live.size >= MAXH) { S.capped = (S.capped || 0) + 1; return; }
    var st = { inst: null, yaw: null, blink: 2 + Math.random() * 3, emote: null, isPlayer: !!isPlayer, gen: 0, chk: 0, solo: false };
    nn.h32 = st; live.add(nn);
    function lookNow(o) { var L = API.lookFromOutfit(o, seedOf(nn, o)); if (isPlayer) { L.hide = 1e9; L.near = 30; L.player = true; } return L; }
    function build(look) {
      var gen = ++st.gen;
      API.create(look).then(function (inst) {
        if (!live.has(nn) || gen !== st.gen) { inst.dispose(); return; }
        if (st.inst) st.inst.dispose();
        st.inst = inst; st.ik = null; st.ikCal = false; nn.root.add(inst.group); nn.body.visible = false; S.attached++;
      }).catch(function () { if (gen !== st.gen) return; S.fallbacks = (S.fallbacks || 0) + 1; if (!st.inst) { nn.body.visible = true; nn.h32 = null; live.delete(nn); } });   // keeps the original body
    }
    st.update = function (dt) {
      var inst = st.inst; if (!inst) return;
      v3 = v3 || new T.Vector3(); v4 = v4 || new T.Vector3();
      if ((st.chk -= dt) <= 0) { st.chk = 1; st.solo = standalone(nn); }
      var W = window.__fyrusW, cam = st.solo ? nn.root.getWorldPosition(v4).add(v3.set(0, 1.4, 3)) : (W && W.camera ? W.camera.getWorldPosition(v3) : nn.root.position);
      nn.body.visible = false;
      var y = nn.root.rotation.y, turn = 0; if (st.yaw !== null) { var d = y - st.yaw; d = Math.atan2(Math.sin(d), Math.cos(d)); turn = dt > 0 ? d / dt : 0; } st.yaw = y;
      var spd = nn.sitting || nn.hovering ? 0 : Math.max(0, nn.speed || 0);
      if (nn.emote && nn.emote !== st.emote && EM[nn.emote]) inst.lod.emote(EM[nn.emote]);
      if (nn.emote && nn.emote !== st.emote && /wave|dance|cheer|laugh|hearts|clap/.test(nn.emote)) st.smileT = 2.6;
      var sm = (st.smileT = Math.max(0, (st.smileT || 0) - dt)) > 0 ? Math.min(1, st.smileT * 2) * 0.75 : 0; if (Math.abs(sm - (st.lastSm || 0)) > 0.05 || (sm === 0 && st.lastSm)) { inst.face('Smile', sm); st.lastSm = sm; }
      st.emote = nn.emote;
      inst.look.noCull = st.solo;
      st.v = st.v === undefined ? spd : st.v + (spd - st.v) * Math.min(1, dt * (spd > st.v ? 5 : 7));   // 33.6 smooth start/stop
      inst.lod.update(dt, cam, 0, st.v < 0.05 ? 0 : st.v, st.solo ? 0 : turn);
      if (inst.lod.updated) life(st, inst, dt, st.v);
      if (nn.swimming) inst.group.visible = false;
      if (nn.sitting) { if (inst.lod.updated) sitPose(inst); } else inst.group.position.y = 0;
      // 32.4 foot planting on slopes/steps while standing (player only, near tier): two-bone IK from fyrus20 (20.10)
      if (inst.lod.updated && st.isPlayer && !st.solo && !nn.sitting && spd < 0.2 && nn.grounded !== false && W && W.groundAt && inst.lod.tier() === 'a1' && Q.get('h32ik') !== '0' && Math.abs(W.groundAt(nn.root.position.x, nn.root.position.z) - nn.root.position.y) < 0.05) {
        try { st.ik = st.ik || window.__fyrusLoco20.footIK(inst.tiers.a1, function (x, z) { return W.groundAt(x, z); }, { maxDrop: 0.18 }); if (!st.ikCal) { st.ik.calibrate(); st.ikCal = true; } inst.tiers.a1.traverse(function (o) { if (o.isBone && /^(hips|thigh|shin)/.test(o.name)) savePose(inst, o, o.name === 'hips'); }); st.ik.apply(); } catch (e) { st.ik = null; }
      }
      st.blink -= dt; var b = st.blink < 0.12 ? 1 : 0; if (st.blink < 0) st.blink = 2.5 + Math.random() * 3.5;
      if (b !== st.lastB) { inst.face('Blink', b); st.lastB = b; }
    };
    // outfit edits: colours update in place; body type / outfit cut / hairstyle changes rebuild the human
    st.restyle = function (o) {
      var L = lookNow(o), cur = st.inst && st.inst.look;
      if (cur && cur.sex === L.sex && cur.outfit === L.outfit && cur.hairStyle === L.hairStyle) st.inst.setLook(L); else build(L);
    };
    st.dispose = function () { live.delete(nn); st.gen++; if (st.inst) st.inst.dispose(); st.inst = null; };
    build(lookNow(nn.outfit));
  };
  // 33.6 secondary motion on the near tiers: breathing, idle look-around, head follows turns (applied after the mixer)
  // P0 posture fix: three's PropertyMixer does not rewrite a bone whose blended value is unchanged since the last frame,
  // so any rotation added after the mixer (breathing, gaze, sit pose, foot IK) would compound frame after frame and fold
  // the neck/spine. Every post-mixer edit first records the bone's clean pose; it is put back before the next update.
  function savePose(inst, bone, withPos) { var L = inst._pose || (inst._pose = []); for (var i = 0; i < L.length; i++) if (L[i][0] === bone) return; L.push([bone, bone.quaternion.clone(), withPos ? bone.position.clone() : null]); }
  function restorePose(inst) { var L = inst._pose; if (!L || !L.length) return; for (var i = 0; i < L.length; i++) { L[i][0].quaternion.copy(L[i][1]); if (L[i][2]) L[i][0].position.copy(L[i][2]); } L.length = 0; }
  API._posture = { save: savePose, restore: restorePose };
  var qa = null, eu = null;
  function life(st, inst, dt, spd) {
    var t = inst.lod.tier(); if (t !== 'a1' && t !== 'a2') return;
    var B = inst.bones && inst.bones[t]; if (!B) { inst.bones = inst.bones || {}; B = inst.bones[t] = {}; inst.tiers[t].traverse(function (o) { if (o.isBone) B[o.name] = o; }); }
    qa = qa || new T.Quaternion(); eu = eu || new T.Euler();
    st.lt = (st.lt || Math.random() * 10) + dt;
    var now = st.lt, idle = spd < 0.3;
    if (B.chest) { savePose(inst, B.chest); qa.setFromEuler(eu.set(Math.sin(now * (idle ? 1.5 : 2.6)) * (idle ? 0.018 : 0.008), 0, 0)); B.chest.quaternion.multiply(qa); }
    if (B.upper_chest) { savePose(inst, B.upper_chest); qa.setFromEuler(eu.set(Math.sin(now * (idle ? 1.5 : 2.6) - 0.6) * 0.01, 0, 0)); B.upper_chest.quaternion.multiply(qa); }
    if ((st.gazeT = (st.gazeT || 0) - dt) < 0) { st.gazeT = 2.5 + Math.random() * 4; st.gaze = idle && !st.isPlayer ? (Math.random() - 0.5) * 1.0 : (Math.random() - 0.5) * 0.25; st.gazeP = (Math.random() - 0.5) * 0.18; }
    st.gy = (st.gy || 0) + ((st.gaze || 0) - (st.gy || 0)) * Math.min(1, dt * 2.2); st.gp = (st.gp || 0) + ((st.gazeP || 0) - (st.gp || 0)) * Math.min(1, dt * 2.2);
    if (B.neck) { savePose(inst, B.neck); qa.setFromEuler(eu.set(st.gp * 0.4, st.gy * 0.4, 0)); B.neck.quaternion.multiply(qa); }
    if (B.head) { savePose(inst, B.head); qa.setFromEuler(eu.set(st.gp * 0.6, st.gy * 0.6, 0)); B.head.quaternion.multiply(qa); }
  }
  var qx = null;
  function sitPose(inst) {
    var t = inst.lod.tier(); if (!t) return; var root = inst.tiers[t]; qx = qx || new T.Quaternion();
    root.traverse(function (o) { if (!o.isBone) return; var bq = o.userData.bq; if (!bq) return;
      if (/^(thigh|shin)/.test(o.name)) savePose(inst, o);
      if (/^thigh/.test(o.name)) o.quaternion.copy(bq).multiply(qx.setFromAxisAngle(X, -1.45));
      else if (/^shin/.test(o.name)) o.quaternion.copy(bq).multiply(qx.setFromAxisAngle(X, 1.5)); });
    inst.group.position.y = -0.42;
  }
  var X = null;
  window.__fyrusAvatarHook = function (nn, isPlayer) { try { API.attach(nn, isPlayer); } catch (e) { S.failed++; S.lastError = String(e); } };
  // avatars created before this file loaded
  var pend = window.__fyrusAvatarQ; window.__fyrusAvatarQ = { push: function () {} };
  if (pend && pend.forEach) pend.forEach(function (x) { window.__fyrusAvatarHook(x[0], x[1]); });
})();
