/* FYRUS City — Phase 18 cinematic layer (DEV-ONLY, local copy fyrus-city-phase18-cinematic). Loaded after
 * fyrus-engine17.js, before the city bundle. Changes how the REAL city looks in three upgraded areas — Fyrus Core,
 * one residential block and Vector Bay — without changing gameplay objects, positions, collisions or interactions.
 *
 *  1. Lighting preset per quality profile: physically plausible sun/sky balance (less flat ambient, warmer key light,
 *     exposure that no longer clips white paving), image-based lighting from the city's own sky (PMREM, refreshed
 *     when the time of day changes) for upgraded materials only.
 *  2. PBR surface pipeline: every opaque standard material inside an upgraded area gets a cached material instance
 *     with world-space (triplanar) detail textures — albedo variation, roughness, normal and cavity — chosen by
 *     surface class (wall / ground / roof / metal / wood / brick / glass), ground-contact occlusion, and on large
 *     building walls a procedural window grid (reflective glass by day, lit rooms at night).
 *  3. Ground: the city's ground shader is extended inside the upgraded areas with texture-based asphalt, pavers,
 *     concrete kerbs, real grass detail and normal-mapped sun lighting.
 *  4. Trees: low-poly blob crowns in upgraded areas become layered leaf-card crowns (alpha-tested, shared geometry).
 *  5. Water (Vector Bay): multi-octave normal waves, Fresnel sky reflection, sun glitter, depth tint, shore foam.
 *  6. Residential block: gardens, hedges, fences, driveways, path lights and planting around the existing homes
 *     (pure decoration, no colliders, no interacts — doors and home IDs are untouched).
 *  7. Interiors: the player's own home interior gets wood floor, plaster walls and the same lighting pipeline.
 *
 * Kill switches: ?c18off=all | lighting,ibl,materials,windows,ground,trees,water,props,interior
 * Profiles (window.__fyrusQuality): cinematic = everything + normal detail on all classes; balanced = same set,
 * fewer tree leaves; mobile = albedo detail only (no normal maps, no IBL, no props); vr = balanced minus windows.
 * API: window.__fyrusCinematic18.stats()
 */
(function () {
  'use strict';
  if (window.__fyrusCinematic18) return;
  var T = window.THREE; if (!T) return;
  var Q = new URLSearchParams(location.search);
  var OFF = (Q.get('c18off') || '').split(',');
  var ON = (new URLSearchParams(location.search).get('c18on') || '').split(',');
  function on(k) { return ON.indexOf(k) >= 0; }
  function off(k) { return OFF.indexOf('all') >= 0 || OFF.indexOf(k) >= 0; }
  var PROFILE = (window.__fyrusQuality && window.__fyrusQuality.name) || 'balanced';
  var TIER = {
    cinematic: { xshadow: true, normals: true, ibl: true, windows: true, leaves: 640, props: true, aniso: 8, water: 2, groundN: true, lightK: 1 },
    balanced: { normals: true, ibl: true, windows: true, leaves: 320, props: true, aniso: 2, water: 2, groundN: true, lightK: 1 },
    mobile: { normals: false, ibl: false, windows: true, leaves: 200, props: false, aniso: 2, water: 1, groundN: false, lightK: 1 },
    vr: { normals: true, ibl: true, windows: false, leaves: 300, props: true, aniso: 4, water: 1, groundN: true, lightK: 1 },
    lite: null   // 29.3 Phone Lite: no cinematic upgrade layer
  }[PROFILE] || null;
  var S = { profile: PROFILE, upgraded: 0, materials: 0, classes: {}, trees: 0, props: 0, groundPatched: false, waterPatched: 0, iblBuilds: 0, rebatches: 0, interior: 0, ms: 0 };
  var E = window.__fyrusCinematic18 = { version: '18.0.0', stats: function () { return JSON.parse(JSON.stringify(S)); } };
  if (!TIER || off('all')) { S.disabled = true; return; }

  /* ------------------------------------------------------------ upgraded areas */
  // centre + radius (m). Fyrus Core: plaza, landmarks, market, ring roads. Residential: the block set below.
  // Vector Bay: the whole waterfront city ~1 km south. Edges blend over 'edge' metres in the ground shader.
  var AREAS = [
    { id: 'res', x: -42, z: 98, r: 52, edge: 15 },      // residential block north-west of the plaza (checked first)
    { id: 'core', x: 0, z: 0, r: 165, edge: 25 },
    { id: 'vb', x: 400, z: -1000, r: 460, edge: 40 }
  ];
  E.areas = AREAS;
  function areaAt(x, z) { for (var i = 0; i < AREAS.length; i++) { var a = AREAS[i]; if (a.r > 0) { var dx = x - a.x, dz = z - a.z; if (dx * dx + dz * dz < a.r * a.r) return a.id; } } return null; }

  /* ------------------------------------------------------------ texture library (assets/cine18, generated) */
  var TL = new T.TextureLoader(), TEX = {};
  function tex(name) {
    if (TEX[name]) return TEX[name];
    // 19.10: textures load on first use (streaming); mobile/VR load half-resolution maps (1/4 the GPU memory)
    var half = (PROFILE === 'mobile' || PROFILE === 'vr') && !off('tex512');
    var t = TL.load('/assets/cine18/' + (half ? '512/' : '') + name + '.png?v=18');
    t.wrapS = t.wrapT = T.RepeatWrapping; t.anisotropy = TIER.aniso; t.encoding = T.LinearEncoding;
    t.minFilter = T.LinearMipmapLinearFilter; t.magFilter = T.LinearFilter;
    TEX[name] = t; return t;
  }

  /* ------------------------------------------------------------ 1. lighting preset + IBL */
  var NIGHT = null, NIGHTU = { value: 0 };   // NIGHTU: our own copy, valid even before the city's uniform is found      // the city's shared uNight uniform object (found on its ShaderMaterials)
  var envRT = null, envTex = null, envKey = '', envAt = -1e9, pmrem = null, skyScene = null, skyMat = null;
  function buildEnv(W, R) {
    if (!TIER.ibl || off('ibl')) return;
    var now = performance.now();
    var top = W.env && W.env.hemi ? W.env.hemi.color : null; if (!top) return;
    var bg = W.world.background && W.world.background.isColor ? W.world.background : new T.Color('#bcd7ee');
    var sunDir = W.env.sun ? W.env.sun.position.clone().sub(W.env.sun.target.position).normalize() : new T.Vector3(0, 1, 0);
    var key = [top.getHexString(), bg.getHexString(), Math.round(sunDir.x * 20), Math.round(sunDir.y * 20), Math.round(sunDir.z * 20)].join('/');
    if (envTex && (key === envKey || now - envAt < 8000)) return;
    envKey = key; envAt = now;
    if (!pmrem) { pmrem = new T.PMREMGenerator(R); }
    if (!skyScene) {
      skyScene = new T.Scene();
      skyMat = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: { uTop: { value: new T.Color() }, uHor: { value: new T.Color() }, uGround: { value: new T.Color() }, uSun: { value: new T.Vector3() }, uSunCol: { value: new T.Color() }, uNightE: { value: 0 } },
        vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: 'uniform vec3 uTop,uHor,uGround,uSunCol; uniform vec3 uSun; uniform float uNightE; varying vec3 vD; void main(){ float h = vD.y; vec3 c = h > 0.0 ? mix(uHor, uTop, pow(h, 0.6)) : mix(uHor, uGround, smoothstep(0.0, -0.25, h)); float s = max(dot(normalize(vD), uSun), 0.0); c += uSunCol * (pow(s, 64.0) * 6.0 + pow(s, 6.0) * 0.25);' + (off('envcity') ? '' : ' float az = atan(vD.z, vD.x); float sk = 0.035 + 0.09 * (0.5 + 0.5 * sin(az * 23.0) * sin(az * 7.0 + 1.3)) * step(0.35, fract(az * 6.3)); float bld = step(-0.02, h) * step(h, sk); vec3 bc = mix(uGround * 0.55 + uHor * 0.25, uHor * 0.5, 0.3); float win = step(0.6, fract(az * 140.0)) * step(0.5, fract(h * 160.0)) * step(0.75, fract(sin(floor(az * 140.0) * 12.9898 + floor(h * 160.0) * 78.233) * 43758.5453)); bc += vec3(1.0, 0.62, 0.3) * win * uNightE * 0.6; c = mix(c, bc, bld * 0.85);') + ' gl_FragColor = vec4(c, 1.0); }' });
      skyScene.add(new T.Mesh(new T.SphereGeometry(10, 32, 16), skyMat));
    }
    var sunCol = W.env.sun ? W.env.sun.color.clone().multiplyScalar(W.env.sun.intensity * 0.6) : new T.Color(1, 1, 1);
    skyMat.uniforms.uTop.value.copy(top).multiplyScalar(1.05); skyMat.uniforms.uHor.value.copy(bg);
    skyMat.uniforms.uGround.value.set('#5c5a52').multiplyScalar(0.6 + 0.4 * (1 - (NIGHT ? NIGHT.value : 0)));
    skyMat.uniforms.uNightE.value = NIGHT ? NIGHT.value : 0; skyMat.uniforms.uSun.value.copy(sunDir); skyMat.uniforms.uSunCol.value.copy(sunCol);
    var t0 = performance.now();
    var rt = pmrem.fromScene(skyScene, 0, 0.1, 100);
    if (envRT) envRT.dispose();
    envRT = rt; envTex = rt.texture; S.iblBuilds++; S.iblMs = Math.round((performance.now() - t0) * 10) / 10;
    FAC.forEach(function (m) { if (m.envMap !== envTex && m.userData.c18env) { var had = !!m.envMap; m.envMap = envTex; if (!had) m.needsUpdate = true; } });
    MATS.forEach(function (m) { if (m.envMap !== envTex && m.userData.c18env) { var had = !!m.envMap; m.envMap = envTex; if (!had) m.needsUpdate = true; } });   // same texture type: no recompile
  }
  function lighting(W) {
    if (off('lighting') || !W.env) return;
    var env = W.env, R = W.renderer, n = NIGHT ? NIGHT.value : 0;
    // the engine sets these every frame from the time of day; this re-balances them (key light vs. ambient)
    if (env.hemi) env.hemi.intensity *= (0.62 - 0.12 * n);       // less flat fill: shadows get form and depth
    if (env.sun) env.sun.intensity *= 1.12;                     // brighter, warmer key light
    if (env.fill) env.fill.intensity *= 0.8;
    R.toneMappingExposure *= (0.86 + 0.1 * n);                  // stop clipping the light paving to white
    if (W.world.fog && W.world.fog.isFogExp2) W.world.fog.density *= 0.92;   // a little more distance, aerial depth kept
    if (!off('sunwarm')) sunCoherence(env, R, n);
    if (!off('shadowsnap')) shadowSnap(env);
  }
  // 19.4: stable, cleaner sun shadows. The engine re-centres the shadow camera on the player every frame, so shadow
  // edges swim and crawl while walking. Snapping the light's position to whole shadow-map texels (in light space) keeps
  // every edge fixed in the world. normalBias trims acne on gently sloped ground without peter-panning.
  var SX = null, SY = null, SZ = null, SV = null;
  function shadowSnap(env) {
    var sun = env.sun; if (!sun || !sun.castShadow || !sun.target) return;
    var cam = sun.shadow.camera, size = sun.shadow.mapSize.x || 2048, texel = (cam.right - cam.left) / size;
    if (!SX) { SX = new T.Vector3(); SY = new T.Vector3(); SZ = new T.Vector3(); SV = new T.Vector3(); }
    SZ.subVectors(sun.position, sun.target.position).normalize();                      // light direction
    SX.set(0, 1, 0).cross(SZ); if (SX.lengthSq() < 1e-6) SX.set(1, 0, 0); SX.normalize(); SY.crossVectors(SZ, SX);
    var t = sun.target.position, u = t.dot(SX), v = t.dot(SY);
    var du = Math.round(u / texel) * texel - u, dv = Math.round(v / texel) * texel - v;
    SV.copy(SX).multiplyScalar(du).addScaledVector(SY, dv);
    t.add(SV); sun.position.add(SV); sun.target.updateMatrixWorld();
    if (sun.shadow.normalBias === 0) sun.shadow.normalBias = 0.6 * texel;
  }
  // 19.3: physically coherent sun. Low sun light travels through more atmosphere: warmer and dimmer key light, a warm
  // bounce from the ground, and a cooler, relatively stronger sky fill, so dawn/sunset no longer look like midday with
  // a coloured sky. Exposure follows the key light a little (bounded) so the low-sun frames are not underexposed.
  var tmpC = null, WARM = null, COOL = null;
  function sunCoherence(env, R, n) {
    if (!env.sun || !env.sun.target) return;
    if (!tmpC) { tmpC = new T.Color(); WARM = new T.Color(1.0, 0.62, 0.36); COOL = new T.Color(0.62, 0.72, 1.0); }
    var p = env.sun.position, q = env.sun.target.position, dx = p.x - q.x, dy = p.y - q.y, dz = p.z - q.z;
    var elev = dy / Math.max(1e-3, Math.sqrt(dx * dx + dy * dy + dz * dz));      // sin(elevation)
    var low = Math.max(0, Math.min(1, (0.45 - elev) / 0.4)) * (1 - n);              // 0 at noon .. 1 near the horizon (day only)
    if (low <= 0) return;
    env.sun.color.lerp(WARM, 0.55 * low);
    env.sun.intensity *= 1 - 0.25 * low;
    if (env.hemi) { env.hemi.color.lerp(COOL, 0.25 * low); if (env.hemi.groundColor) env.hemi.groundColor.lerp(WARM, 0.3 * low); env.hemi.intensity *= 1 + 0.15 * low; }
    R.toneMappingExposure *= 1 + 0.12 * low;
  }

  /* ------------------------------------------------------------ 2. PBR surface pipeline */
  var MATS = new Map();      // cache key -> upgraded material instance
  var HEAD = [
    'uniform sampler2D c18WD; uniform sampler2D c18WN; uniform sampler2D c18TD; uniform sampler2D c18TN;',
    'uniform vec4 c18A; uniform vec4 c18B; uniform float c18Night;',
    'vec4 c18tri(sampler2D sw, sampler2D st, vec3 p, vec3 w, float sw0, float st0) {',
    '#ifdef C18_FAST',
    '  if (w.y >= w.x && w.y >= w.z) return texture2D(st, p.xz / st0); return w.x > w.z ? texture2D(sw, p.zy / sw0) : texture2D(sw, p.xy / sw0);',
    '#endif',
    '  vec4 c = vec4(0.0);',
    '  if (w.x > 0.01) c += texture2D(sw, p.zy / sw0) * w.x;',
    '  if (w.z > 0.01) c += texture2D(sw, p.xy / sw0) * w.z;',
    '  if (w.y > 0.01) c += texture2D(st, p.xz / st0) * w.y;',
    '  return c; }',
    'float c18h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }'
  ].join('\n');
  // fragment after <map_fragment>: world position/normal, detail albedo, cavity, ground contact, window grid
  var FRAG_MAP = [
    '#include <map_fragment>',
    'vec3 c18P = (vec4(-vViewPosition, 0.0) * viewMatrix).xyz + cameraPosition;',
    'vec3 c18G = normalize((vec4(normalize(cross(dFdx(vViewPosition), dFdy(vViewPosition))), 0.0) * viewMatrix).xyz);',
    'vec3 c18W = pow(abs(c18G), vec3(6.0)); c18W /= (c18W.x + c18W.y + c18W.z);',
    'if (c18G.y < 0.0) { c18W.x += c18W.y; c18W.y = 0.0; }',             // undersides use the wall set
    'vec4 c18D = c18tri(c18WD, c18TD, c18P, c18W, c18A.x, c18A.y);',
    'vec4 c18N = c18tri(c18WN, c18TN, c18P, c18W, c18A.x, c18A.y);',
    'diffuseColor.rgb *= mix(vec3(1.0), c18D.rgb * 2.0, c18A.z) * mix(1.0, c18N.a, 0.55 * c18A.z);',
    // ground-contact occlusion on walls (the bottom 0.8 m of every vertical surface standing on the street)
    'float c18gc = mix(1.0, smoothstep(c18B.z - 0.05, c18B.z + 0.85, c18P.y), (1.0 - c18W.y) * c18B.w);',
    'diffuseColor.rgb *= mix(0.62, 1.0, c18gc);',
    // procedural windows on large building walls: floors 3.4 m, bays 2.6 m, glass 72% x 58% of the cell
    'float c18win = 0.0; vec2 c18cell = vec2(0.0);',
    '#ifdef C18_WINDOWS',
    '{ vec2 q = vec2(c18W.x > c18W.z ? c18P.z : c18P.x, c18P.y - c18B.z - 1.2); vec2 cs = vec2(2.6, 3.4); vec2 f = fract(q / cs); c18cell = floor(q / cs);',
    '  float inWin = step(0.14, f.x) * step(f.x, 0.86) * step(0.22, f.y) * step(f.y, 0.80) * step(0.0, q.y) * step(q.y, c18A.w) * (1.0 - c18W.y);',
    '  float frame = inWin * (1.0 - step(0.17, f.x) * step(f.x, 0.83) * step(0.25, f.y) * step(f.y, 0.77));',
    '  c18win = inWin - frame;',
    '  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.17, 0.18), frame * 0.85);',
    '  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.035, 0.045, 0.06), c18win); }',
    '#endif'
  ].join('\n');
  var FRAG_ROUGH = [
    '#include <roughnessmap_fragment>',
    'roughnessFactor = clamp(mix(roughnessFactor, c18D.a, c18B.x) , 0.04, 1.0);',
    'roughnessFactor = mix(roughnessFactor, 0.06, c18win);'
  ].join('\n');
  var FRAG_METAL = ['#include <metalnessmap_fragment>', 'metalnessFactor = mix(metalnessFactor, 0.85, c18win);'].join('\n');
  // triplanar normal blend (whiteout) in world space, then back to view space
  var FRAG_NORMAL = [
    '#include <normal_fragment_maps>',
    '#ifdef C18_NORMALS',
    '{ vec3 nw = normalize((vec4(normal, 0.0) * viewMatrix).xyz); vec3 w = pow(abs(nw), vec3(6.0)); w /= (w.x + w.y + w.z);',
    '  if (nw.y < 0.0) { w.x += w.y; w.y = 0.0; }',
    '  float k = c18B.y * (1.0 - c18win);',
    '#ifdef C18_FAST',
    '  if (w.y >= w.x && w.y >= w.z) w = vec3(0.0, 1.0, 0.0); else if (w.x > w.z) w = vec3(1.0, 0.0, 0.0); else w = vec3(0.0, 0.0, 1.0);',
    '  vec3 tx = w.x > 0.5 ? texture2D(c18WN, c18P.zy / c18A.x).xyz * 2.0 - 1.0 : vec3(0.0, 0.0, 1.0); vec3 tz = w.z > 0.5 ? texture2D(c18WN, c18P.xy / c18A.x).xyz * 2.0 - 1.0 : vec3(0.0, 0.0, 1.0); vec3 ty = w.y > 0.5 ? texture2D(c18TN, c18P.xz / c18A.y).xyz * 2.0 - 1.0 : vec3(0.0, 0.0, 1.0);',
    '#else',
    '  vec3 tx = texture2D(c18WN, c18P.zy / c18A.x).xyz * 2.0 - 1.0; vec3 tz = texture2D(c18WN, c18P.xy / c18A.x).xyz * 2.0 - 1.0; vec3 ty = texture2D(c18TN, c18P.xz / c18A.y).xyz * 2.0 - 1.0;',
    '#endif',
    '  tx.xy *= k; ty.xy *= k; tz.xy *= k;',
    '  vec3 nx = vec3(tx.xy + nw.zy, abs(tx.z) * nw.x).zyx; vec3 ny = vec3(ty.xy + nw.xz, abs(ty.z) * nw.y).xzy; vec3 nz = vec3(tz.xy + nw.xy, abs(tz.z) * nw.z);',
    '  vec3 nn = normalize(nx * w.x + ny * w.y + nz * w.z);',
    '  normal = normalize((viewMatrix * vec4(nn, 0.0)).xyz); }',
    '#endif'
  ].join('\n');
  var FRAG_EMIS = [
    '#include <emissivemap_fragment>',
    '#ifdef C18_WINDOWS',
    '{ float lit = step(0.42, c18h(c18cell + floor(c18P.xz / 40.0) * 7.0)); float warm = c18h(c18cell * 1.7 + 3.0);',
    '  vec3 room = mix(vec3(1.0, 0.72, 0.42), vec3(0.85, 0.9, 1.0), step(0.75, warm)) * (0.7 + 0.6 * warm);',
    '  totalEmissiveRadiance += room * c18win * lit * smoothstep(0.25, 0.75, c18Night) * 1.6; }',
    '#endif'
  ].join('\n');

  // surface classes: wall set (vertical) + top set (horizontal), texture sizes (m), detail strength, normal strength
  var CLS = {
    concrete: { w: 'concrete', t: 'concrete', ws: 3.0, ts: 3.0, k: 0.75, n: 0.9, rough: 0.5, env: 0.35 },
    plaster: { w: 'plaster', t: 'concrete', ws: 2.6, ts: 3.0, k: 0.7, n: 0.7, rough: 0.45, env: 0.3 },
    building: { w: 'plaster', t: 'concrete', ws: 2.6, ts: 3.0, k: 0.7, n: 0.7, rough: 0.45, env: 0.45, win: true },
    brick: { w: 'brick', t: 'roof', ws: 2.4, ts: 2.6, k: 0.9, n: 1.0, rough: 0.6, env: 0.25 },
    ground: { w: 'concrete', t: 'pavers', ws: 2.0, ts: 3.2, k: 0.8, n: 1.0, rough: 0.55, env: 0.3 },
    asphalt: { w: 'concrete', t: 'asphalt', ws: 2.0, ts: 4.0, k: 0.85, n: 0.8, rough: 0.7, env: 0.2 },
    roof: { w: 'concrete', t: 'roof', ws: 3.0, ts: 2.4, k: 0.8, n: 1.0, rough: 0.55, env: 0.25 },
    metal: { w: 'metal', t: 'metal', ws: 1.2, ts: 1.2, k: 0.5, n: 0.5, rough: 0.6, env: 1.0 },
    wood: { w: 'wood', t: 'wood', ws: 2.4, ts: 2.4, k: 0.9, n: 0.8, rough: 0.6, env: 0.2 },
    bark: { w: 'wood', t: 'wood', ws: 0.9, ts: 0.9, k: 0.8, n: 1.2, rough: 0.7, env: 0.1 },
    lawn: { w: 'grass', t: 'grass', ws: 2.2, ts: 2.2, k: 0.9, n: 0.8, rough: 0.9, env: 0.05 },
    // Vector Bay's own textured marble / travertine: keep its map, add fine detail, normals, cavity and sky reflections
    vbstone: { w: 'concrete', t: 'concrete', ws: 1.6, ts: 1.6, k: 0.28, n: 0.7, rough: 0.15, env: 0.55 }
  };
  function lum(c) { return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b; }
  function classify(o, m, area) {
    var c = m.color || new T.Color(1, 1, 1), L = lum(c), hsl = {}; c.getHSL(hsl);
    var g = o.geometry; if (!g.boundingBox) g.computeBoundingBox();
    var s = new T.Vector3(); g.boundingBox.getSize(s); s.multiply(o.getWorldScale(new T.Vector3()));
    var tall = Math.max(s.y, 0), wide = Math.max(s.x, s.z);
    if (m.map) return 'vbstone';
    if (m.metalness >= 0.5) return 'metal';
    if (hsl.h > 0.17 && hsl.h < 0.45 && hsl.s > 0.22 && L < 0.6) return 'lawn';
    if (g.type === 'CylinderGeometry' && Math.abs(hsl.h - 0.07) < 0.06 && hsl.s < 0.35 && L < 0.25 && tall < 6) return 'bark';
    if (Math.abs(hsl.h - 0.07) < 0.05 && hsl.s > 0.25 && hsl.s < 0.7 && L < 0.32 && L > 0.08) return area === 'res' ? 'wood' : 'wood';
    if (hsl.h < 0.06 || hsl.h > 0.96) { if (hsl.s > 0.35 && L > 0.08 && L < 0.45 && area === 'res') return tall > 2 ? 'brick' : 'roof'; }
    if (tall >= 7 && wide >= 5 && g.type === 'BoxGeometry' && L > 0.25) return 'building';
    if (L < 0.06) return 'asphalt';
    if (s.y < 0.6 && wide > 3) return L < 0.2 ? 'asphalt' : 'ground';
    if (L > 0.55) return 'plaster';
    return 'concrete';
  }
  function matLook(m) {
    return [m.type, m.color ? m.color.getHexString() : '-', m.emissive ? m.emissive.getHexString() : '-', m.emissiveIntensity, m.roughness, m.metalness, m.flatShading, m.vertexColors,
      m.side, m.alphaTest, m.opacity, m.transparent, m.map ? m.map.uuid : 0, m.normalMap ? m.normalMap.uuid : 0, m.emissiveMap ? m.emissiveMap.uuid : 0, m.envMap ? m.envMap.uuid : 0, m.fog, m.toneMapped].join('|');
  }
  function upgradeMaterial(m, cls, area) {
    // one upgraded instance per source LOOK (+ class): source materials that render identically keep sharing one
    // material, so the Phase 16 static batcher still merges their meshes (a per-uuid clone split ~150 batches)
    var key = matLook(m) + (TIER.xshadow ? '|' + cls : '');
    var u = MATS.get(key); if (u) return u;
    var C = CLS[cls];
    u = m.clone(); u.name = (m.name || '') + ' c18-' + cls;
    u.userData = Object.assign({}, m.userData, { c18: cls, c18src: m.uuid, c18env: TIER.ibl && !off('ibl') });
    if (u.color) {   // procedural colours were picked for unlit-looking, flat surfaces: pull extreme whites/blacks into PBR range
      var hsl = {}; u.color.getHSL(hsl);
      if (hsl.l > 0.8) u.color.setHSL(hsl.h, hsl.s, 0.8);
      if (cls === 'lawn') { u.color.getHSL(hsl); u.color.setHSL(hsl.h * 0.92 + 0.02, Math.min(hsl.s, 0.45), Math.min(hsl.l, 0.32)); }
      if (cls === 'plaster' || cls === 'building' || cls === 'ground') { u.color.multiplyScalar(0.9); u.color.getHSL(hsl); if (hsl.l > 0.62) u.color.setHSL(hsl.h, Math.max(hsl.s, 0.06), 0.62); }
    }
    if (u.roughness != null && cls !== 'metal') u.roughness = Math.max(u.roughness, 0.35);
    if (envTex && u.userData.c18env) u.envMap = envTex;
    u.envMapIntensity = C.env;
    var uni = { c18WD: { value: tex(C.w + '_d') }, c18WN: { value: tex(C.w + '_n') }, c18TD: { value: tex(C.t + '_d') }, c18TN: { value: tex(C.t + '_n') },
      c18A: { value: new T.Vector4(C.ws, C.ts, C.k, 60) }, c18B: { value: new T.Vector4(C.rough, C.n, area === 'vb' ? 0 : 0, cls === 'building' || cls === 'plaster' || cls === 'concrete' || cls === 'brick' ? 1 : 0) },
      c18Night: NIGHTU };
    var defs = '';
    if (TIER.normals) defs += '#define C18_NORMALS\n';
    if (!TIER.xshadow) defs += '#define C18_FAST\n';
    if (C.win && TIER.windows && !off('windows')) defs += '#define C18_WINDOWS\n';
    u.onBeforeCompile = function (sh) {
      Object.assign(sh.uniforms, uni);
      sh.fragmentShader = defs + sh.fragmentShader.replace('#include <common>', '#include <common>\n' + HEAD)
        .replace('#include <map_fragment>', FRAG_MAP).replace('#include <roughnessmap_fragment>', FRAG_ROUGH)
        .replace('#include <metalnessmap_fragment>', FRAG_METAL).replace('#include <normal_fragment_maps>', FRAG_NORMAL)
        .replace('#include <emissivemap_fragment>', FRAG_EMIS);
    };
    // 19.2: every surface class runs the same shader source (class data lives in uniforms), so they share ONE program
    // per flag set (was one per class: +12 programs and more state switches). ?c18off=progmerge restores per-class keys.
    var pk = 'c18-' + (off('progmerge') ? cls : 'surf') + '-' + (TIER.normals ? 'n' : '') + (defs.indexOf('WINDOWS') >= 0 ? 'w' : '') + (defs.indexOf('FAST') >= 0 ? 'f' : '');
    u.customProgramCacheKey = function () { return pk; };
    u.userData.c18uni = uni;
    MATS.set(key, u); S.materials = MATS.size; S.classes[cls] = (S.classes[cls] || 0) + 1;
    return u;
  }


  /* ------------------------------------------------------------ 2b. building facades (the city's facade ShaderMaterial -> PBR) */
  // The city draws every building/home wall with one unlit-style ShaderMaterial (procedural window grid, no shadows,
  // no reflections). Inside the upgraded areas each of those materials is replaced by a MeshStandardMaterial that
  // keeps the SAME window grid, kinds, seed, night lights and construction animation (it shares the original
  // uniform objects), and adds: received sun shadows, PBR glass with sky reflections, window frames, sills and
  // reveals, interior-mapped rooms behind the glass (depth, floor, ceiling, back wall, lit at night), facade
  // texture detail with normals, and a darker, textured roof.
  var FAC = new Map();
  var FAC_VERT_HEAD = 'varying vec3 c18L; varying vec3 c18LN;';
  var FAC_VERT = '#include <begin_vertex>\n c18L = position; c18LN = normal;';
  var FAC_HEAD = [
    'uniform vec3 uBase; uniform vec3 uTint; uniform float uKind; uniform float uBuild; uniform float uH; uniform float uSeed; uniform vec2 uCell; uniform float c18Night;',
    'uniform sampler2D c18FD; uniform sampler2D c18FN; uniform sampler2D c18RD; uniform sampler2D c18RN; uniform vec4 c18F;',
    'varying vec3 c18L; varying vec3 c18LN;',
    'float c18h21(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }'
  ].join('\n');
  var FAC_MAP = [
    '#include <map_fragment>',
    'vec3 fP = (vec4(-vViewPosition, 0.0) * viewMatrix).xyz + cameraPosition;',
    'if (fP.y > uBuild * (uH + 2.0) + 0.01) discard;',
    'vec3 fNL = normalize(c18LN); float fRoof = step(0.6, fNL.y); bool fX = abs(fNL.x) > abs(fNL.z);',
    'float fSide = fX ? c18L.z * sign(fNL.x) : -c18L.x * sign(fNL.z);',
    'vec2 fWp = vec2(fSide, fP.y - 1.2); vec2 fCs = uCell; vec2 fC = fract(fWp / fCs); vec2 fId = floor(fWp / fCs);',
    'vec2 fLo, fHi;',
    'if (uKind < 0.5) { fLo = vec2(0.06, 0.05); fHi = vec2(0.94, 0.95); } else if (uKind < 1.5) { fLo = vec2(0.18, 0.25); fHi = vec2(0.82, 0.8); } else { fLo = vec2(0.25, 0.2); fHi = vec2(0.75, 0.85); }',
    'float fWin = step(fLo.x, fC.x) * step(fC.x, fHi.x) * step(fLo.y, fC.y) * step(fC.y, fHi.y) * step(0.0, fWp.y) * (1.0 - fRoof);',
    'if (uKind > 1.5) fWin *= step(1.0, fId.y);',
    // frame (6 cm), sill below each window, mullion for wide windows, reveal shading on the inner edges
    'vec2 fFr = vec2(0.06) / fCs; vec2 fIn = (fC - fLo) / (fHi - fLo);',
    'float fFrame = fWin * (1.0 - step(fLo.x + fFr.x, fC.x) * step(fC.x, fHi.x - fFr.x) * step(fLo.y + fFr.y, fC.y) * step(fC.y, fHi.y - fFr.y));',
    'float fMull = fWin * step(abs(fIn.x - 0.5) * (fHi.x - fLo.x) * fCs.x, 0.03) * step(1.6, (fHi.x - fLo.x) * fCs.x);',
    'fFrame = max(fFrame, fMull);',
    'float fSill = (1.0 - fRoof) * step(fLo.x - 0.03, fC.x) * step(fC.x, fHi.x + 0.03) * step(fLo.y - 0.07 / fCs.y, fC.y) * step(fC.y, fLo.y) * step(0.0, fWp.y) * step(0.5, uKind);',
    'float fGlass = fWin * (1.0 - fFrame);',
    // facade detail: plaster for shophouses, concrete for kind 1, fine for curtain walls
    'vec3 fWw = pow(abs(fNL), vec3(6.0)); fWw /= (fWw.x + fWw.y + fWw.z);',
    'vec2 fUv = vec2(fSide, fP.y) / c18F.x; vec2 fUr = fP.xz / c18F.y;',
    'vec4 fD = mix(texture2D(c18FD, fUv), texture2D(c18RD, fUr), fRoof); vec4 fN4 = mix(texture2D(c18FN, fUv), texture2D(c18RN, fUr), fRoof);',
    'vec3 fBase = pow(uBase, vec3(2.2)); fBase = max(mix(vec3(dot(fBase, vec3(0.2126, 0.7152, 0.0722))), fBase, 1.45), 0.0); vec3 fWall = fBase * 0.8 * mix(vec3(1.0), fD.rgb * 2.0, c18F.z) * mix(1.0, fN4.a, 0.5);',
    // 19.7: weathering on walls (kill switch ?c18off=weather): rain streaks under each window, a darker band at every
    // floor slab, grime along the roofline and a +-5 % per-building tone so identical blocks stop looking cloned
    (off('weather') ? '' : '{ float fMeters = (fLo.y - fC.y) * fCs.y; float fCol = step(fLo.x + 0.04, fC.x) * step(fC.x, fHi.x - 0.04); float fStr = fCol * step(0.0, fMeters) * (1.0 - smoothstep(0.0, 1.4, fMeters)) * (0.45 + 0.55 * c18h21(vec2(floor(fC.x * 9.0), fId.x) + fId.y * 3.1)) * step(0.5, uKind) * (1.0 - fRoof) * step(0.0, fWp.y);' +
      ' float fSlab = (1.0 - smoothstep(0.0, 0.14, fC.y * fCs.y)) * step(0.5, uKind) * (1.0 - fRoof) * step(0.0, fWp.y);' +
      ' float fTop = smoothstep(uH - 1.6, uH, fP.y) * (1.0 - fRoof);' +
      ' fWall *= (1.0 - 0.34 * fStr) * (1.0 - 0.1 * fSlab) * (1.0 - 0.18 * fTop) * (0.95 + 0.1 * fract(uSeed * 7.13)); }'),
    'float fGround = smoothstep(-0.1, 1.0, fP.y - 0.3); fWall *= mix(0.65, 1.0, fGround) * mix(1.0, 0.55, c18Night);',            // ground contact grime
    'fWall *= 1.0 - 0.18 * (1.0 - smoothstep(0.0, 0.18, fIn.y)) * fWin * 0.0;',
    'vec3 fRoofC = fBase * 0.38 * fD.rgb * 2.0;',
    'vec3 fFrameC = mix(vec3(0.12, 0.13, 0.14), vec3(0.86, 0.85, 0.82), step(1.5, uKind));',
    'vec3 fAlb = mix(fWall, fRoofC, fRoof); fAlb = mix(fAlb, fFrameC, fFrame); fAlb = mix(fAlb, min(fBase * 1.15, vec3(0.8)), fSill);',
    'fAlb = mix(fAlb, mix(vec3(0.20, 0.24, 0.28), pow(uTint, vec3(2.2)), 0.35) * 0.75, fGlass);',
    // 21.5 commercial ground floor (kill switch ?c18off=shops21): office/tower walls (kind 0/1) get a 4.3 m storefront -
    // glazed bays every 2.6 m with dark mullions, a kick plate and a coloured fascia sign band; lit warm at night.
    'float fShopG = 0.0;',
    (off('shops21') ? '' : '{ float gy = fP.y; float shop = (1.0 - fRoof) * step(uKind, 1.5) * step(gy, 4.3) * step(0.02, gy);' +
      ' float band = step(3.55, gy); float kick = step(gy, 0.45); float bay = fract(fSide / 2.6); float mull = step(min(bay, 1.0 - bay) * 2.6, 0.06);' +
      ' float h = c18h21(vec2(uSeed * 3.1, floor(fSide / 15.6) + uSeed)); vec3 signC = h < 0.25 ? vec3(0.55, 0.08, 0.07) : (h < 0.5 ? vec3(0.06, 0.2, 0.42) : (h < 0.75 ? vec3(0.08, 0.3, 0.16) : vec3(0.12, 0.12, 0.13)));' +
      ' fShopG = shop * (1.0 - band) * (1.0 - kick) * (1.0 - mull);' +
      ' fAlb = mix(fAlb, signC, shop * band); fAlb = mix(fAlb, vec3(0.07, 0.075, 0.08), shop * (1.0 - band) * max(kick, mull));' +
      ' fAlb = mix(fAlb, vec3(0.16, 0.19, 0.21), fShopG); fGlass = max(fGlass * (1.0 - shop), fShopG); fWin *= 1.0 - shop; fFrame *= 1.0 - shop; }'),
    'diffuseColor.rgb = fAlb;'
  ].join('\n');
  var FAC_ROUGH = ['#include <roughnessmap_fragment>', 'roughnessFactor = mix(mix(0.82, fD.a, 0.6), 0.55, fFrame); roughnessFactor = mix(roughnessFactor, 0.06, fGlass); roughnessFactor = mix(roughnessFactor, 0.7, fRoof);'].join('\n');
  var FAC_METAL = ['#include <metalnessmap_fragment>', 'metalnessFactor = mix(0.0, 0.6, fFrame * step(fFrameC.r, 0.5)); metalnessFactor = mix(metalnessFactor, 1.0, fGlass);', '#ifdef C18_NOENV', 'metalnessFactor = mix(metalnessFactor, 0.0, fGlass);   // 19.13: no environment map (mobile): a fully metallic pane would render black', '#endif'].join('\n');
  var FAC_NORMAL = [
    '#include <normal_fragment_maps>',
    '#ifdef C18_NORMALS',
    '{ vec3 nw = normalize((vec4(normal, 0.0) * viewMatrix).xyz); vec3 tn = fN4.xyz * 2.0 - 1.0; tn.xy *= c18F.w * (1.0 - fGlass) * (1.0 - fFrame);',
    '  vec3 nn; if (fRoof > 0.5) nn = normalize(vec3(tn.x, tn.z, -tn.y)); else if (fX) nn = normalize(vec3(sign(nw.x) * tn.z, tn.y, -sign(nw.x) * tn.x)); else nn = normalize(vec3(sign(nw.z) * tn.x, tn.y, sign(nw.z) * tn.z));',
    '  normal = normalize((viewMatrix * vec4(nn, 0.0)).xyz); }',
    '#endif'
  ].join('\n');
  // interior mapping: a room box behind every window (depth 4 m), seen through the glass
  var FAC_EMIS = [
    '#include <emissivemap_fragment>',
    // 21.12 night skyline (kill switch ?c18off=night21): tall buildings (> 24 m) get a cool architectural crown-light strip
    // under the roof line and red aviation lights every 12 m along the top edge
    (off('night21') ? '' : '{ float crown = (1.0 - fRoof) * step(24.0, uH) * smoothstep(uH - 2.2, uH - 1.8, fP.y) * (1.0 - smoothstep(uH - 0.4, uH - 0.1, fP.y));' +
      ' float av = (1.0 - fRoof) * step(24.0, uH) * step(abs(fract(fSide / 12.0) - 0.5), 0.035) * step(uH - 0.5, fP.y);' +
      ' totalEmissiveRadiance += c18Night * (vec3(0.55, 0.75, 1.0) * crown * 2.6 + vec3(3.0, 0.2, 0.12) * av); }'),
    '{ if (fGlass > 0.5) {',
    '  vec3 Vw = normalize(fP - cameraPosition);',
    '  vec3 Nw = fX ? vec3(sign(fNL.x), 0.0, 0.0) : vec3(0.0, 0.0, sign(fNL.z)); vec3 Tw = fX ? vec3(0.0, 0.0, -sign(fNL.x)) : vec3(sign(fNL.z), 0.0, 0.0);',
    '  vec3 rd = vec3(dot(Vw, Tw), dot(Vw, vec3(0.0, 1.0, 0.0)), -dot(Vw, Nw));',
    '  vec2 rs = (fHi - fLo) * fCs; vec3 ro = vec3(fIn.x * rs.x, (fIn.y * (fHi.y - fLo.y) + fLo.y) * fCs.y, 0.0); vec3 room = vec3(rs.x, fCs.y, 4.0);',
    '  vec3 tB = (step(0.0, rd) * room - ro) / rd; float tmin = min(min(tB.x, tB.y), tB.z); vec3 hit = ro + rd * tmin;',
    '  float rnd = c18h21(fId + uSeed * 17.0); float on = step(uKind > 1.5 ? 0.3 : 0.4, rnd) * c18Night;',   // homes/shophouses: ~70% of rooms lit at night
    '  vec3 wallC = mix(vec3(0.42, 0.38, 0.33), vec3(0.3, 0.33, 0.36), step(0.5, fract(rnd * 7.0)));',
    '  vec3 rc = tmin == tB.y ? (rd.y < 0.0 ? vec3(0.2, 0.15, 0.11) : vec3(0.55, 0.54, 0.52)) : (tmin == tB.z ? wallC * 0.9 : wallC * 0.7);',
    '  rc *= 0.35 + 0.65 * (1.0 - hit.z / 4.0);',
    '  float day = 1.0 - c18Night; vec3 amb = vec3(0.5, 0.5, 0.52) * day;',
    '  vec3 lampC = mix(vec3(1.0, 0.38, 0.1), vec3(0.85, 0.92, 1.0), step(uKind > 1.5 ? 0.95 : 0.88, rnd)) * (0.75 + 0.25 * rnd);',   // saturated tungsten: stays amber after ACES   // warm tungsten, few cool rooms
    '  vec3 inside = rc * (amb + lampC * on * 2.0) * (1.0 - smoothstep(0.0, 1.0, (fId.x * 0.37 + rnd) * 0.0));',
    '  float blind = step(0.78, fract(rnd * 13.0)) * step(1.0 - 0.45 * fract(rnd * 29.0), fIn.y);',      // some blinds half down
    '  inside = mix(inside, vec3(0.62, 0.6, 0.55) * (amb * 1.6 + lampC * on * 1.2), blind);',
    '  float fres = pow(1.0 - max(dot(-Vw, Nw), 0.0), 4.0);',
    '  float glowK = uKind > 1.5 ? 1.6 : (uKind < 0.5 ? 1.1 : 1.35);',   // ACES maps this to Phase 17-like amber (tuned from matched night captures)
    '  totalEmissiveRadiance += inside * (1.0 - fres) * (uKind < 0.5 ? 0.45 : 0.8) + lampC * on * (1.0 - blind * 0.35) * glowK * (1.0 - fres * 0.5);',
    '  totalEmissiveRadiance += vec3(1.0, 0.62, 0.3) * fShopG * c18Night * 1.4;',   // 21.5 lit shop windows
    '} }',
    'float fEdge = smoothstep(uBuild * (uH + 2.0) - 0.5, uBuild * (uH + 2.0), fP.y) * step(uBuild, 0.999); totalEmissiveRadiance += vec3(1.0, 0.6, 0.25) * fEdge * 1.5;'
  ].join('\n');
  function facadeMaterial(src) {
    var f = FAC.get(src.uuid); if (f) return f;
    var U = src.uniforms, k = U.uKind.value;
    S.facH = S.facH || { n: 0, tall: 0, maxH: 0 }; S.facH.n++; if (U.uH && U.uH.value > 24) S.facH.tall++; if (U.uH) S.facH.maxH = Math.max(S.facH.maxH, Math.round(U.uH.value));
    f = new T.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8, metalness: 0 });
    f.name = 'c18-facade'; f.userData = { c18: 'facade', c18env: TIER.ibl && !off('ibl'), c18src: src.uuid };
    if (envTex && f.userData.c18env) f.envMap = envTex;
    f.envMapIntensity = 1.25;
    var wall = k < 0.5 ? 'concrete' : (k < 1.5 ? 'concrete' : 'plaster');
    var uni = { uBase: U.uBase, uTint: U.uTint, uKind: U.uKind, uBuild: U.uBuild, uH: U.uH, uSeed: U.uSeed, uCell: U.uCell, c18Night: U.uNight || NIGHTU,
      c18FD: { value: tex(wall + '_d') }, c18FN: { value: tex(wall + '_n') }, c18RD: { value: tex('concrete_d') }, c18RN: { value: tex('concrete_n') },
      c18F: { value: new T.Vector4(wall === 'plaster' ? 2.6 : 3.2, 3.0, k < 0.5 ? 0.35 : 0.75, 0.8) } };
    var defs = (TIER.normals ? '#define C18_NORMALS\n' : '') + (f.userData.c18env ? '' : '#define C18_NOENV\n');
    f.onBeforeCompile = function (sh) {
      Object.assign(sh.uniforms, uni);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\n' + FAC_VERT_HEAD).replace('#include <begin_vertex>', FAC_VERT);
      sh.fragmentShader = defs + sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FAC_HEAD)
        .replace('#include <map_fragment>', FAC_MAP).replace('#include <roughnessmap_fragment>', FAC_ROUGH).replace('#include <metalnessmap_fragment>', FAC_METAL)
        .replace('#include <normal_fragment_maps>', FAC_NORMAL).replace('#include <emissivemap_fragment>', FAC_EMIS);
    };
    var pk = 'c18-facade-' + (TIER.normals ? 'n' : '') + (f.userData.c18env ? '' : 'x');
    f.customProgramCacheKey = function () { return pk; };
    FAC.set(src.uuid, f); S.classes.facade = (S.classes.facade || 0) + 1;
    return f;
  }
  function isFacade(m) { return m && m.isShaderMaterial && m.uniforms && m.uniforms.uCell && m.uniforms.uKind && m.uniforms.uBuild; }

  /* ------------------------------------------------------------ 4. trees */
  var LEAF = [], LEAFGEO = null, CROWNMAT = new Map();
  function leafGeometry(count) {
    var pos = [], nor = [], uv = [], idx = [], col = [], rnd = (function (s) { return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; })(4711);
    for (var i = 0; i < count; i++) {
      var th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1), r = 0.72 + Math.pow(rnd(), 0.6) * 0.42;
      var c = new T.Vector3(Math.sin(ph) * Math.cos(th), Math.cos(ph) * 0.92, Math.sin(ph) * Math.sin(th)).multiplyScalar(r);
      var nrm = c.clone().normalize();
      var size = 0.2 + rnd() * 0.16;
      var t1 = new T.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(nrm).normalize(), t2 = nrm.clone().cross(t1).normalize();
      var tilt = new T.Vector3().addScaledVector(nrm, 0.35 * (rnd() - 0.5));
      var u0 = Math.floor(rnd() * 2) * 0.5, v0 = Math.floor(rnd() * 2) * 0.5, b = pos.length / 3;
      var tint = 0.7 + rnd() * 0.45, shade = 0.55 + 0.45 * Math.max(0, (c.y + 1) / 2);   // darker lower/inner leaves
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) {
        var p = c.clone().addScaledVector(t1, q[0] * size).addScaledVector(t2, q[1] * size).add(tilt);
        pos.push(p.x, p.y, p.z); nor.push(nrm.x, nrm.y, nrm.z); uv.push(u0 + (q[0] + 1) * 0.25, v0 + (q[1] + 1) * 0.25);
        col.push(tint * shade, tint * shade * (0.96 + rnd() * 0.08), tint * shade * 0.9);
      });
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3));
    g.setIndex(idx); g.computeBoundingSphere(); g.computeBoundingBox(); return g;
  }
  function isFoliage(o) {
    var m = o.material; if (!m || Array.isArray(m) || !m.isMeshStandardMaterial || !m.flatShading) return false;
    var t = o.geometry.type; if (!((t === 'IcosahedronGeometry' || t === 'BufferGeometry' || t === 'PolyhedronGeometry') && Math.abs(m.roughness - 0.85) < 0.01 && !m.map)) return false;
    // 18.1: crown-sized only. Large flat-shaded hills/rocks matched too and were "smoothed" into leaf material
    var g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere(); var sc = Math.max(o.scale.x, o.scale.y, o.scale.z);
    return g.boundingSphere && g.boundingSphere.radius * sc <= 9 && g.attributes.position.count <= 2000;
  }
  function crownMaterials(src) {
    // 18.1: ONE leaf material for every crown (the crown colour is baked into the vertex colours), so the static
    // batcher merges all crowns of a cell into one draw instead of one per crown colour/source material
    var e = CROWNMAT.get('all'); if (e) return e;
    var inner = src.clone(); inner.flatShading = false; inner.color = src.color; inner.roughness = 0.95; inner.name = 'c18-crown-inner';
    inner.onBeforeCompile = function (sh) { sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb *= 0.5;'); };
    inner.customProgramCacheKey = function () { return 'c18-crown-inner'; };
    var leaf = new T.MeshStandardMaterial({ color: '#ffffff', map: tex('leaves_d'), alphaTest: 0.5, side: T.DoubleSide, roughness: 0.75, metalness: 0, vertexColors: true });
    leaf.map.encoding = T.sRGBEncoding; leaf.name = 'c18-leaves';
    leaf.onBeforeCompile = function (sh) {   // soft wrap lighting + darker toward the crown core = light passing through foliage
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n diffuseColor.rgb *= 1.5;');
    };
    leaf.customProgramCacheKey = function () { return 'c18-leaves'; };
    e = { inner: inner, leaf: leaf }; CROWNMAT.set('all', e); return e;
  }
  function upgradeTree(o) {
    if (o.userData.c18tree || off('trees')) return false;
    if (!LEAFGEO) LEAFGEO = leafGeometry(TIER.leaves);
    var mats = crownMaterials(o.material);
    // one mesh, one draw (as before): the smoothed crown volume and its leaf cards are merged into a single geometry
    // drawn with the alpha-tested leaf material (the volume samples an opaque texel of the leaf atlas)
    // 21.8: species-like colour variety - 4 tints picked by a hash of the tree position (cache stays bounded: 4 per shape)
    var tint = o.material.color;
    if (!off('treevar')) {
      var twp = o.getWorldPosition(new T.Vector3()), th = Math.abs(Math.sin(twp.x * 12.9898 + twp.z * 78.233) * 43758.5453) % 1;
      var TV = th < 0.4 ? [1, 1, 1] : th < 0.65 ? [1.12, 1.1, 0.78] : th < 0.9 ? [0.78, 0.9, 0.95] : [1.55, 0.95, 0.5];
      tint = tint.clone(); tint.r = Math.min(1, tint.r * TV[0]); tint.g = Math.min(1, tint.g * TV[1]); tint.b = Math.min(1, tint.b * TV[2]);
      S.treeVar = (S.treeVar || 0) + 1;
    }
    o.geometry = crownGeometry(o.geometry, tint); o.material = mats.leaf;
    if (TIER.xshadow) o.customDepthMaterial = leafDepth();    // Cinematic: leaf-shaped shadows (a custom depth material splits the shadow batches)
    o.userData.c18tree = true; S.trees++;
    return true;
  }
  var CROWNGEO = new Map(), LEAFDEPTH = null;
  function leafDepth() {
    if (!LEAFDEPTH) { LEAFDEPTH = new T.MeshDepthMaterial({ depthPacking: T.RGBADepthPacking, map: tex('leaves_d'), alphaTest: 0.5, side: T.DoubleSide }); }
    return LEAFDEPTH;
  }
  function crownGeometry(g, tint) {
    // 18.1: keyed by SHAPE + colour, not uuid — streamed chunks rebuild their crown geometries, and a uuid key kept every
    // generation's crown (+ its smoothed clone) alive forever (the main Phase 18 heap growth). Indexed leaf cards: 4 verts/card.
    var gk = shapeKey(g) + '|' + tint.getHexString(), e = CROWNGEO.get(gk); if (e) return e;
    var inner = smoothed(g), n = inner.attributes.position.count;
    var leaf = LEAFGEO.clone();
    // 18.1: fit the unit leaf shell to the crown's own bounds. Some crowns are BufferGeometry with the offset baked
    // into the vertices (mesh at the chunk origin): their leaves used to float at the origin, stretching every
    // batch's bounding sphere out to (0,0,0) so no leaf batch could ever be frustum-culled.
    if (!inner.boundingBox) inner.computeBoundingBox();
    var cbx = inner.boundingBox, cc = cbx.getCenter(new T.Vector3()), cs = cbx.getSize(new T.Vector3()).multiplyScalar(0.5 * 1.12 * (g.type === 'BufferGeometry' ? 1 : 1 / 0.8507));   // icosahedra: bbox half-size = 0.85 r
    leaf.applyMatrix4(new T.Matrix4().makeTranslation(cc.x, cc.y, cc.z).multiply(new T.Matrix4().makeScale(cs.x, cs.y, cs.z)).multiply(new T.Matrix4().makeRotationY((CROWNGEO.size % 7) * 0.9)));
    var m = leaf.attributes.position.count, pos = new Float32Array((n + m) * 3), nor = new Float32Array((n + m) * 3), uv = new Float32Array((n + m) * 2), col = new Float32Array((n + m) * 3);
    pos.set(inner.attributes.position.array, 0); nor.set(inner.attributes.normal.array, 0);
    for (var i = 0; i < n; i++) { uv[i * 2] = 0.074; uv[i * 2 + 1] = 0.988; col[i * 3] = 0.3; col[i * 3 + 1] = 0.31; col[i * 3 + 2] = 0.27; }
    pos.set(leaf.attributes.position.array, n * 3); nor.set(leaf.attributes.normal.array, n * 3); uv.set(leaf.attributes.uv.array, n * 2); col.set(leaf.attributes.color.array, n * 3);
    for (i = 0; i < n + m; i++) { col[i * 3] *= tint.r; col[i * 3 + 1] *= tint.g; col[i * 3 + 2] *= tint.b; }   // the crown colour, baked
    var li = leaf.index.array, idx = new Uint16Array(n + li.length);
    for (i = 0; i < n; i++) idx[i] = i;
    for (i = 0; i < li.length; i++) idx[n + i] = li[i] + n;
    e = new T.BufferGeometry();
    e.setAttribute('position', new T.BufferAttribute(pos, 3)); e.setAttribute('normal', new T.BufferAttribute(nor, 3)); e.setAttribute('uv', new T.BufferAttribute(uv, 2)); e.setAttribute('color', new T.BufferAttribute(col, 3));
    e.setIndex(new T.BufferAttribute(idx, 1));
    e.computeBoundingBox(); e.computeBoundingSphere(); CROWNGEO.set(gk, e); leaf.dispose(); return e;
  }
  var SMOOTH = new Map();
  function shapeKey(g) {
    if (!g.boundingBox) g.computeBoundingBox(); var b = g.boundingBox, r = function (v) { return Math.round(v * 100); };
    return g.type + JSON.stringify(g.parameters || {}) + '|' + g.attributes.position.count + '|' + [r(b.min.x), r(b.min.y), r(b.min.z), r(b.max.x), r(b.max.y), r(b.max.z)].join(',');
  }
  // 18.1: facade / crown materials are per source material; sources of streamed-out chunks are dropped here
  function pruneCaches(W) {
    var used = new Set(), usedG = new Set(); W.world.traverse(function (o) { if (o.material) used.add(o.material); if (o.geometry) usedG.add(o.geometry); });
    CROWNGEO.forEach(function (g, k) { if (!usedG.has(g)) { CROWNGEO.delete(k); g.dispose(); S.pruned = (S.pruned || 0) + 1; } });
    FAC.forEach(function (f, k) { if (!used.has(f)) { FAC.delete(k); f.dispose(); S.pruned = (S.pruned || 0) + 1; } });
    // (the crown leaf material is a single shared instance now: nothing to prune)
  }
  function smoothed(g) {
    var s;   // 18.1: not cached (only crownGeometry uses it, and that result is cached)
    s = g.clone(); if (s.index) s = s.toNonIndexed();
    // merge by position so normals become smooth (the city's crowns are faceted icosahedra)
    var p = s.attributes.position, map = new Map(), acc = [];
    for (var i = 0; i < p.count; i++) { var k = p.getX(i).toFixed(3) + ',' + p.getY(i).toFixed(3) + ',' + p.getZ(i).toFixed(3); if (!map.has(k)) map.set(k, new T.Vector3()); }
    var n = s.attributes.normal; if (!n) { s.computeVertexNormals(); n = s.attributes.normal; }
    for (i = 0; i < p.count; i++) { k = p.getX(i).toFixed(3) + ',' + p.getY(i).toFixed(3) + ',' + p.getZ(i).toFixed(3); map.get(k).add(new T.Vector3(n.getX(i), n.getY(i), n.getZ(i))); }
    for (i = 0; i < p.count; i++) { k = p.getX(i).toFixed(3) + ',' + p.getY(i).toFixed(3) + ',' + p.getZ(i).toFixed(3); var v = map.get(k).clone().normalize(); n.setXYZ(i, v.x, v.y, v.z); }
    n.needsUpdate = true; return s;
  }

  /* ------------------------------------------------------------ scene pass: classify + upgrade inside the areas */
  var seen = new WeakSet(), wp = new T.Vector3(), actorSet = new Set(), actorSrc = new Map();
  function actorRoots(W) {
    actorSet.clear(); actorSize.clear();
    function A(r, src) { if (r) { actorSet.add(r); actorSrc.set(r, src); } }
    try { W.npcs.list.forEach(function (n) { if (n.av) A(n.av.root, 'npc'); }); } catch (e) {}
    try { (W.bots || []).forEach(function (b) { if (b) A(b.root, 'bot'); }); } catch (e) {}
    try { A(W.traffic.group, 'traffic'); } catch (e) {}
    try { A(W.player.root, 'player'); } catch (e) {}
    try { W.peers.forEach(function (p) { A(p.root, 'peer'); }); } catch (e) {}
    // a whole district must never count as an actor (Vector Bay's root was reached through an actor reference)
    actorSet.forEach(function (r) {
      if (!r || r === W.world || r.isScene || r.name === 'fx-vectorbay') { actorSet.delete(r); return; }
      if (W.traffic && r === W.traffic.group) return; var n = 0; r.traverse(function (o) { if (o.isMesh) n++; }); if (n > 300) actorSet.delete(r);
    });
  }
  var actorSize = new Map();   // per sweep: an 'actor' root that holds a whole district (Vector Bay hangs under one) is not an actor
  function underActor(o) {
    var p = o.parent;
    while (p) {
      if (actorSet.has(p)) {
        var n = actorSize.get(p);
        if (n == null) { n = 0; p.traverse(function (q) { if (q.isMesh) n++; }); actorSize.set(p, n); }
        return n <= 300 || actorSrc.get(p) === 'traffic';
      }
      p = p.parent;
    }
    return false;
  }
  function eligible(o) {
    if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.name === 'fx-batch' || o.name === 'fx17-instanced' || o.name === 'c18-leaves') return false;
    var m = o.material; if (!m || Array.isArray(m) || !m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) return false;
    if (m.userData && m.userData.c18) return false;
    if (m.map || m.transparent || m.opacity < 1 || m.vertexColors || m.wireframe) return false;
    if (m.onBeforeCompile && m.onBeforeCompile !== T.Material.prototype.onBeforeCompile) return false;
    if (m.emissiveIntensity > 0.3 && m.emissive && lum(m.emissive) > 0.05) return false;      // glowing signs/lamps keep their look
    return true;
  }
  E.why = function (o) {   // dev: why a mesh was left untouched
    if (!o.isMesh) return 'not-mesh';
    o.getWorldPosition(wp); var ar = areaAt(wp.x, wp.z);
    var r = [ar ? 'area:' + ar : 'no-area'];
    if (seen.has(o)) r.push('seen');
    if (o.isInstancedMesh) r.push('instanced');
    if (underActor(o)) { var pa = o.parent; while (pa && !actorSet.has(pa)) pa = pa.parent; r.push('actor:' + (actorSrc.get(pa) || '?') + ':' + (pa && (pa.name || pa.type))); }
    var m = o.material;
    if (!m || Array.isArray(m)) r.push('multi-mat'); else {
      if (m.userData && m.userData.c18) r.push('upgraded');
      if (m.map) r.push('map'); if (m.transparent) r.push('transparent'); if (m.vertexColors) r.push('vcol');
      if (m.onBeforeCompile && m.onBeforeCompile !== T.Material.prototype.onBeforeCompile) r.push('obc');
      if (m.emissiveIntensity > 0.3 && m.emissive && lum(m.emissive) > 0.05) r.push('emissive');
      if (!m.isMeshStandardMaterial) r.push(m.type); else if (m.isMeshPhysicalMaterial) r.push('physical');
    }
    return r.join(',');
  };
  function vbStone(o) {   // Vector Bay's mapped stone/marble (not glazing, banners, sails or anything glowing/transparent)
    var m = o.material; if (!o.isMesh || o.isInstancedMesh || !m || Array.isArray(m) || !m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) return false;
    if (!m.map || m.emissiveMap || m.transparent || m.alphaTest > 0 || m.side === T.DoubleSide || (m.userData && m.userData.c18)) return false;
    if (m.onBeforeCompile && m.onBeforeCompile !== T.Material.prototype.onBeforeCompile) return false;
    return m.metalness < 0.3;
  }
  var pendingRebatch = false;
  function perfChanged(o) { try { if (window.__fyrusPerf && window.__fyrusPerf.changed) window.__fyrusPerf.changed(o); else if (o.layers.mask === 128) pendingRebatch = true; } catch (e) {} }
  // time-sliced sweep over the world: at most budgetMs per frame; after a sweep that found nothing new, pause 2 s
  var SWEEP = { stack: null, touched: 0, idleUntil: 0 };
  function pass(W, budgetMs) {
    var t0 = performance.now(), touched = 0;
    if (!SWEEP.stack || !SWEEP.stack.length) {
      if (t0 < SWEEP.idleUntil) return 0;
      actorRoots(W); SWEEP.stack = [W.world]; SWEEP.touched = 0;
    }
    var stack = SWEEP.stack;
    while (stack.length && performance.now() - t0 < budgetMs) {
      var o = stack.pop();
      for (var i = 0; i < o.children.length; i++) stack.push(o.children[i]);
      if (!o.isMesh || seen.has(o)) continue;
      if (o.userData.__fxBatch || o.name === 'fx17-instanced') continue;
      // 18.2.10: the city's home-window glow (emissive #ffd9a0 through a window mask) read cream-white after ACES tone
      // mapping. A saturated tungsten emissive keeps it amber, like the facade windows. Colour only, so no shader recompile.
      if (!off('windows') && o.material && o.material.emissiveMap && !o.material.userData.c18warm && o.material.emissive && o.material.emissive.getHexString() === 'ffd9a0') {
        o.material.emissive.set('#ff8a2a'); o.material.userData.c18warm = true; S.warmWindows = (S.warmWindows || 0) + 1;
      }   // 18.2: never upgrade a static batch / instanced mesh itself (members are upgraded and re-batched); the tree path used to swap a batch's geometry, orphaning it un-disposed
      if (underActor(o)) continue;          // not marked seen: re-checked next sweep (actor membership can change)
      seen.add(o);
      o.getWorldPosition(wp);
      var area = areaAt(wp.x, wp.z);
      // 21.6: outside the three upgraded areas, facades / glass / PBR surface materials are upgraded city-wide too
      // (trees keep the original look there - the leaf-card crowns cost more). Kill switch ?c18off=citywide
      if (!area) { if (off('citywide')) continue; area = 'city'; }
      if (area === 'city' && isFoliage(o) && !on('treesall')) continue;   // 21.8: city-wide tree upgrade is OPT-IN (?c18on=treesall): +25-50 % tris and +300 MB heap measured
      if (!off('facades') && isFacade(o.material)) { if (o.material.uniforms.uH && o.material.uniforms.uH.value > 24) { S.tallAt = S.tallAt || []; if (S.tallAt.length < 6) S.tallAt.push([Math.round(wp.x), Math.round(wp.z), Math.round(o.material.uniforms.uH.value)]); } o.material = facadeMaterial(o.material); if (TIER.xshadow) o.castShadow = true; o.receiveShadow = true; perfChanged(o); touched++; S.facades = (S.facades || 0) + 1; continue; }
      if (!off('trees') && isFoliage(o)) { if (upgradeTree(o)) { touched++; perfChanged(o); } continue; }
      var m = o.material;
      if (m && m.transparent && m.isMeshStandardMaterial && m.roughness < 0.25 && !m.map && TIER.ibl && !off('ibl') && !off('materials')) {   // glass: environment reflections
        var gk = m.uuid + '|glass', gm = MATS.get(gk);
        if (!gm) { gm = m.clone(); gm.userData = Object.assign({}, m.userData, { c18: 'glass', c18env: true }); gm.envMap = envTex; gm.envMapIntensity = 1.0; gm.metalness = Math.max(gm.metalness, 0.6); gm.roughness = Math.min(gm.roughness, 0.06); MATS.set(gk, gm); S.classes.glass = (S.classes.glass || 0) + 1; }
        o.material = gm; perfChanged(o); touched++; continue;
      }
      if (off('materials')) continue;
      if (!eligible(o)) {
        if (!(area === 'vb' && vbStone(o))) continue;
      }
      var cls = classify(o, m, area);
      o.material = upgradeMaterial(m, cls, area); touched++; S.upgraded++;
      perfChanged(o);                                      // already merged by the Phase 16 batcher: hand it back, it re-batches under the new look
    }
    SWEEP.touched += touched;
    if (!stack.length) { if (!SWEEP.touched) SWEEP.idleUntil = performance.now() + 2000; S.sweeps = (S.sweeps || 0) + 1; }
    if (!stack.length && pendingRebatch && window.__fyrusPerf && window.__fyrusPerf.disable) { window.__fyrusPerf.disable(); window.__fyrusPerf.enable(); pendingRebatch = false; S.rebatches++; }
    S.ms += performance.now() - t0;
    return touched;
  }

  /* ------------------------------------------------------------ 3. ground shader (the city's own ShaderMaterial) */
  var GROUND_HEAD = [
    'uniform sampler2D c18GA; uniform sampler2D c18GAN; uniform sampler2D c18GP; uniform sampler2D c18GPN; uniform sampler2D c18GG; uniform sampler2D c18GGN; uniform sampler2D c18GC;',
    'uniform vec4 c18Areas[3]; uniform float c18GK;'
  ].join('\n');
  function patchGround(m) {
    if (m.userData.c18ground) return;
    var fs = m.fragmentShader;
    if (fs.indexOf('central plaza paving') < 0) return;
    // 1) after the city's colour is composed and BEFORE its lighting: swap in texture-based materials inside the areas
    var hook = '  // lighting\n  vec3 light = uAmb + uSunCol * max(uSunDir.y, 0.0);\n  col *= light;';
    if (fs.indexOf(hook) < 0) { S.groundError = 'hook not found'; return; }
    var rep = [
      '  // ---- Phase 18 cinematic ground (inside the upgraded areas only)',
      '  float c18w = 0.0;',
      '  for (int i = 0; i < 3; i++) { vec4 a = c18Areas[i]; if (a.z > 0.0) c18w = max(c18w, 1.0 - smoothstep(a.z - a.w, a.z, length(p - a.xy))); }',
      '  c18w *= c18GK;',
      '  vec3 c18n = vec3(0.0, 1.0, 0.0); float c18ao = 1.0;',
      '  if (c18w > 0.001) {',
      '    vec4 dA = texture2D(c18GA, p / 4.0); vec4 dP = texture2D(c18GP, p / 2.2); dP.rgb = mix(vec3(0.5), dP.rgb, 0.55); vec4 dG = texture2D(c18GG, p / 2.2) * 0.6 + texture2D(c18GG, p / 9.0) * 0.4;',
      '    vec4 nA = texture2D(c18GAN, p / 4.0); vec4 nP = texture2D(c18GPN, p / 2.2); vec4 nG = texture2D(c18GGN, p / 2.2);',
      '    float isRoad = e < 4.0 ? 1.0 : 0.0; float isWalk = (e >= 4.0 && e < 8.0) ? 1.0 : 0.0; float isPlaza = inPlaza; float isGrass = (1.0 - isRoad) * (1.0 - isWalk) * (1.0 - isPlaza) * (1.0 - inMarket);',
      '    isGrass = max(isGrass, verge * (1.0 - isPlaza));',
      '    vec3 nc = col;',
      // asphalt keeps the painted markings of the city (they are already in col) but gets real aggregate and darker base
      '    float paint = clamp((lum3(col) - 0.35) * 3.0, 0.0, 1.0);',
      '    vec3 asphNew = mix(vec3(0.105, 0.108, 0.115) * (dA.rgb * 2.0) * (0.9 + 0.2 * vnoise(p * 0.12)), col * 0.9, paint);',
      // 19.6: worn asphalt: darker, smoother tyre tracks in each lane, repaired patches, and grime toward the gutter
      (off('roadwear') ? '' : '    { float tr = exp(-pow((e - 1.15) / 0.38, 2.0)) + exp(-pow((e - 2.75) / 0.38, 2.0)); float rp = smoothstep(0.62, 0.66, vnoise(floor(p * 0.25) * 0.37 + 3.1)) * step(0.5, vnoise(p * 0.05 + 7.0)); float gut = smoothstep(3.0, 3.9, e); float oil = exp(-pow((e - 1.95) / 0.22, 2.0)) * (0.6 + 0.4 * vnoise(p * 0.6)); float np = 1.0 - paint; asphNew *= (1.0 + 0.38 * tr * np) * (1.0 - 0.3 * oil * np) * mix(1.0, 1.32, rp * np) * (1.0 - 0.25 * gut * np); }'),
      // 19.8: road detailing: worn paint (chipped markings), manhole covers / drain grates on a jittered 17 m grid
      (off('roaddetail') ? '' : '    { float chip = smoothstep(0.55, 0.75, vnoise(p * 1.7) * 0.6 + vnoise(p * 6.0) * 0.4); asphNew = mix(asphNew, asphNew * 0.55 + vec3(0.06), paint * chip * 0.7);' +
        ' vec2 gc = floor(p / 17.0); vec2 jit = vec2(c18hh(gc), c18hh(gc + 5.3)) * 11.0 + 3.0; vec2 mc = gc * 17.0 + jit; float md = length(p - mc);' +
        ' float hasM = step(0.45, c18hh(gc + 9.7)) * (1.0 - paint);' +
        ' float disc = 1.0 - smoothstep(0.34, 0.37, md); float rim = smoothstep(0.30, 0.33, md) * disc; float grid = step(0.5, fract((p.x - mc.x) * 6.0 + (p.y - mc.y) * 6.0));' +
        ' vec3 iron = vec3(0.09, 0.085, 0.08) * (0.8 + 0.4 * grid * (1.0 - rim)) + vec3(0.05) * rim;' +
        ' asphNew = mix(asphNew, iron, disc * hasM); }'),
      // 21.11: asphalt cracks (thin dark ridge lines of a warped noise field, sparse) and sealed-crack tar lines
      (off('decals21') ? '' : '    { vec2 wq = p * 0.35 + vec2(vnoise(p * 0.11), vnoise(p * 0.11 + 4.0)) * 3.0; float rdg = abs(vnoise(wq) - 0.5); float crk = (1.0 - smoothstep(0.0, 0.018, rdg)) * smoothstep(0.55, 0.75, vnoise(p * 0.045 + 2.0)) * (1.0 - paint);' +
        ' asphNew = mix(asphNew, asphNew * 0.45, crk); float tar = (1.0 - smoothstep(0.0, 0.03, abs(vnoise(p * 0.09 + 9.0) - 0.5))) * step(0.7, vnoise(p * 0.02 + 5.0)) * (1.0 - paint); asphNew = mix(asphNew, vec3(0.05, 0.05, 0.055), tar * 0.8); }'),
      '    nc = mix(nc, asphNew, isRoad * (1.0 - kerb));',
      '    vec3 walkNew = vec3(0.40, 0.39, 0.37) * dP.rgb * 2.0 * mix(1.0, nP.a, 0.6);',
      (off('roadwear') ? '' : '    walkNew *= 1.0 - 0.14 * (1.0 - smoothstep(4.0, 4.9, e)) - 0.08 * smoothstep(0.55, 0.9, vnoise(p * 0.45 + 11.0));'),   // 19.6: kerb-side grime + scattered stains
      // 21.2: pavement slabs (0.6 m grid, grout lines, per-slab tint, occasional replaced slab) and a kerb-top bevel highlight
      (off('street21') ? '' : '    { vec2 sq = p / 0.6; vec2 sf = fract(sq); vec2 sid = floor(sq); float gr = 1.0 - smoothstep(0.0, 0.035, min(min(sf.x, 1.0 - sf.x), min(sf.y, 1.0 - sf.y)));' +
        ' float st = c18hh(sid); walkNew *= (0.94 + 0.12 * st) * (1.0 - 0.22 * gr); walkNew = mix(walkNew, walkNew * vec3(0.86, 0.88, 0.92), step(0.965, c18hh(sid + 3.7)));' +
        ' walkNew *= 1.0 - 0.05 * smoothstep(0.3, 0.7, vnoise(sid * 0.21)); }'),
      // 21.3: tactile (dimpled, yellow) paving pads where the zebra crossings meet the pavement
      (off('markings21') ? '' : '    { float tac = step(4.08, e) * (1.0 - step(4.75, e)) * step(5.4, dj) * (1.0 - step(8.2, dj)) * step(4.0, max(ex, ez));' +
        ' vec2 dq = fract(p / 0.09) - 0.5; float dot2 = 1.0 - smoothstep(0.18, 0.28, length(dq));' +
        ' walkNew = mix(walkNew, vec3(0.78, 0.62, 0.16) * (0.88 + 0.18 * dot2), tac); }'),
      // 21.11: fallen leaves and gum/stain spots scattered on the pavement (cell-jittered dots)
      (off('decals21') ? '' : '    { vec2 lc = floor(p / 0.7); vec2 lj = vec2(c18hh(lc), c18hh(lc + 2.3)) * 0.7; float ld = length(p - lc * 0.7 - lj); float hasL = step(0.86, c18hh(lc + 7.1));' +
        ' vec3 lcol = mix(vec3(0.55, 0.33, 0.1), vec3(0.62, 0.5, 0.14), c18hh(lc + 1.9)); walkNew = mix(walkNew, lcol, (1.0 - smoothstep(0.05, 0.09, ld)) * hasL);' +
        ' float hasG = step(0.95, c18hh(lc + 3.3)); walkNew = mix(walkNew, walkNew * 0.7, (1.0 - smoothstep(0.02, 0.04, ld)) * hasG * (1.0 - hasL)); }'),
      '    nc = mix(nc, walkNew, isWalk * (1.0 - kerb) * (1.0 - verge));',
      '    nc = mix(nc, col * 0.62 * dP.rgb * 2.0 * mix(1.0, nP.a, 0.6), isPlaza);',
      '    nc = mix(nc, col * 0.78 * dP.rgb * 2.0, inMarket * (1.0 - isPlaza));',
      '    float patchy = vnoise(p * 0.07) * 0.6 + vnoise(p * 0.31) * 0.4;',
      '    float gBig = vnoise(p * 0.021); vec3 gA = vec3(0.13, 0.21, 0.07), gB = vec3(0.25, 0.31, 0.11), gDry = vec3(0.34, 0.31, 0.16); vec3 grassNew = mix(gA, gB, smoothstep(0.25, 0.8, patchy * 0.7 + gBig * 0.3)); grassNew = mix(grassNew, gDry, smoothstep(0.66, 0.86, gBig * 0.6 + patchy * 0.4) * 0.7); grassNew = mix(grassNew, uGrass * 0.5, 0.18) * (dG.rgb * 2.0) * mix(0.8, 1.1, vnoise(p * 1.3));',
      '    nc = mix(nc, grassNew, isGrass);',
      '    nc = mix(nc, vec3(0.5, 0.49, 0.47) * texture2D(c18GC, p / 2.0).rgb * 2.0, kerb);',
      (off('street21') ? '' : '    nc *= 1.0 + 0.16 * kerb * exp(-pow((e - 4.02) / 0.07, 2.0)) - 0.10 * kerb * exp(-pow((e - 3.86) / 0.06, 2.0));'),   // 21.2 kerb bevel: lit top edge, shaded face
      '    col = mix(col, nc, c18w);',
      '    vec3 tn = (isRoad > 0.5 ? nA.xyz : (isGrass > 0.5 ? nG.xyz : nP.xyz)) * 2.0 - 1.0;',
      '    c18n = normalize(mix(vec3(0.0, 1.0, 0.0), normalize(vec3(tn.x * 1.6, tn.z, -tn.y * 1.6)), c18w));',
      '    c18ao = mix(1.0, (isRoad > 0.5 ? nA.a : (isGrass > 0.5 ? nG.a : nP.a)), 0.7 * c18w);',
      '    // kerb gives the pavement a raised edge: shade the gutter side',
      '    col *= mix(1.0, 0.72 + 0.28 * smoothstep(3.6, 4.0, e), (1.0 - step(4.2, e)) * step(3.0, e) * c18w);',
      '  }',
      '  // lighting (normal-mapped sun inside the areas)',
      '  vec3 light = uAmb * c18ao + uSunCol * max(mix(uSunDir.y, dot(c18n, uSunDir), c18w), 0.0);',
      '  col *= light;'
    ].join('\n');
    fs = fs.replace(hook, rep);
    fs = fs.replace('varying vec3 vW;\nvoid main(){', 'varying vec3 vW;\n' + GROUND_HEAD + '\nfloat lum3(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }\nfloat c18hh(vec2 q){ q = fract(q * vec2(123.34, 456.21)); q += dot(q, q + 45.32); return fract(q.x * q.y); }\nvoid main(){');
    if (fs.indexOf('c18Areas') < 0) { S.groundError = 'head not inserted'; return; }
    m.fragmentShader = fs;
    var areas = AREAS.map(function (a) { return new T.Vector4(a.x, a.z, a.r, a.edge); });
    Object.assign(m.uniforms, {
      c18GA: { value: tex('asphalt_d') }, c18GAN: { value: tex('asphalt_n') }, c18GP: { value: tex('pavers_d') }, c18GPN: { value: tex('pavers_n') },
      c18GG: { value: tex('grass_d') }, c18GGN: { value: tex('grass_n') }, c18GC: { value: tex('concrete_d') },
      c18Areas: { value: areas }, c18GK: { value: 1 }
    });
    m.userData.c18ground = true; m.userData.c18areas = areas; m.needsUpdate = true; S.groundPatched = true;
  }
  E.syncAreas = function () { MATS.forEach(function () {}); GROUNDS.forEach(function (m) { if (m.userData.c18areas) AREAS.forEach(function (a, i) { m.userData.c18areas[i].set(a.x, a.z, a.r, a.edge); }); }); };

  /* ------------------------------------------------------------ 5. water */
  function patchWater(m) {
    if (m.userData.c18water || off('water')) return;
    var fs = m.fragmentShader; if (fs.indexOf('uDeep') < 0 || fs.indexOf('fres') < 0) return;
    var a = fs.indexOf('void main(){'); if (a < 0) return;
    var body = [
      'void main(){',
      '  vec2 p = vW.xz; float t = uTime;',
      '  vec2 d1 = vec2(0.8, 0.35), d2 = vec2(-0.45, 0.9), d3 = vec2(0.2, -1.0);',
      '  float h1 = sin(dot(p, d1) * 0.55 + t * 1.1), h2 = sin(dot(p, d2) * 0.9 + t * 1.5), h3 = sin(dot(p, d3) * 1.7 + t * 2.1);',
      '  vec2 g = d1 * cos(dot(p, d1) * 0.55 + t * 1.1) * 0.55 * 0.5 + d2 * cos(dot(p, d2) * 0.9 + t * 1.5) * 0.9 * 0.3 + d3 * cos(dot(p, d3) * 1.7 + t * 2.1) * 1.7 * 0.12;',
      '  float w1 = vnoise(p * 0.35 + vec2(t * 0.25, t * 0.12)); float w2 = vnoise(p * 1.4 - vec2(t * 0.4, -t * 0.3)); float w3 = vnoise(p * 4.2 + vec2(t * 0.9, t * 0.6));',
      '  vec3 Nn = normalize(vec3(-g.x * 0.18 + (w2 - 0.5) * 0.22 + (w3 - 0.5) * 0.12, 1.0, -g.y * 0.18 + (w1 - 0.5) * 0.22 + (w3 - 0.5) * 0.12));',
      '  vec3 V = normalize(vV);',
      '  float fres = 0.02 + 0.98 * pow(1.0 - max(dot(Nn, V), 0.0), 5.0);',
      '  vec3 R = reflect(-V, Nn);',
      '  vec3 sky = mix(uSkyHor, uSkyTop, pow(clamp(R.y, 0.0, 1.0), 0.6));',
      '  float distK = clamp(length(vV) / 220.0, 0.0, 1.0);',
      '  vec3 deep = mix(uDeep * 0.75, uShallow, 0.25 + 0.25 * w1 + 0.15 * h1) * (uAmb * 0.9 + uSunCol * 0.45);',
      '  float caust = pow(abs(sin((p.x + sin(p.y * 1.3 + t) * 0.8) * 2.2) * sin((p.y + sin(p.x * 1.1 - t) * 0.8) * 2.2)), 6.0) * uCaustic;',
      '  vec3 col = mix(deep + caust * 0.3, sky, clamp(fres + distK * 0.25, 0.0, 1.0));',
      '  float spec = pow(max(dot(R, uSunDir), 0.0), 380.0) * 6.0 + pow(max(dot(R, uSunDir), 0.0), 40.0) * 0.25;',
      '  col += uSunCol * spec * (1.0 - uNight);',
      '  float crest = smoothstep(0.55, 0.95, h1 * 0.5 + h2 * 0.35 + w3 * 0.4) * 0.12;',
      '  col += vec3(0.9, 0.95, 1.0) * crest * (uAmb + uSunCol * 0.5);',
      '  col += vec3(0.2, 0.55, 0.8) * uNight * uCaustic * 0.6;',
      '  col = mix(col, vec3(0.85, 0.9, 0.95), uSnow * 0.15);',
      '  gl_FragColor = vec4(applyFog(col, length(vV)), 1.0);',
      '}'].join('\n');
    m.fragmentShader = fs.slice(0, a) + body;
    m.userData.c18water = true; m.needsUpdate = true; S.waterPatched++;
  }

  /* ------------------------------------------------------------ 6. residential block (decoration only) */
  // Every home inside the residential area (fixed and streamed chunk homes alike) gets a garden: driveway on the
  // parking spot the engine already uses, a stone path to the door, leafy hedges, a picket fence, planted beds,
  // shrubs, path lights and a mailbox. Decoration only: no colliders, no interacts; the home group, its door,
  // its ID and its enter-home interaction are untouched. The garden follows the home (and is removed with it).
  var GARDEN = { geo: null, mats: null, list: [] };
  function cardShell(w, h, d, count, seed, sz0, szr, tilt) {   // leaf cards on the surface of a box: a hedge / shrub volume
    var pos = [], nor = [], uv = [], col = [], idx = [], rnd = (function (s0) { return function () { s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647; }; })(seed);
    for (var i = 0; i < count; i++) {
      var face = Math.floor(rnd() * 5), u = rnd() - 0.5, v = rnd() - 0.5, c, n;
      if (face === 0) { c = new T.Vector3(u * w, h, v * d);   // 18.1: top cards sit ON the top (were buried at mid-height inside the core)
      n = new T.Vector3(0, 1, 0); }
      else if (face === 1) { c = new T.Vector3(w * 0.5, (v + 0.5) * h, u * d); n = new T.Vector3(1, 0, 0); }
      else if (face === 2) { c = new T.Vector3(-w * 0.5, (v + 0.5) * h, u * d); n = new T.Vector3(-1, 0, 0); }
      else if (face === 3) { c = new T.Vector3(u * w, (v + 0.5) * h, d * 0.5); n = new T.Vector3(0, 0, 1); }
      else { c = new T.Vector3(u * w, (v + 0.5) * h, -d * 0.5); n = new T.Vector3(0, 0, -1); }
      c.addScaledVector(n, (rnd() - 0.15) * 0.07); var n0 = n.clone(); n = n.clone().add(new T.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(tilt || 0.9)).normalize();
      var sz = (sz0 || 0.07) + rnd() * (szr || 0.06), t1 = new T.Vector3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).cross(n).normalize(), t2 = n.clone().cross(t1).normalize();
      var u0 = Math.floor(rnd() * 2) * 0.5, v0 = Math.floor(rnd() * 2) * 0.5, base = pos.length / 3, tint = 0.8 + rnd() * 0.35, sh = 0.75 + 0.25 * (c.y / h);
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { var p = c.clone().addScaledVector(t1, q[0] * sz).addScaledVector(t2, q[1] * sz); pos.push(p.x, p.y, p.z); nor.push(n0.x * 0.8 + n.x * 0.2, n0.y * 0.8 + n.y * 0.2 + 0.25, n0.z * 0.8 + n.z * 0.2); uv.push(u0 + (q[0] + 1) * 0.25, v0 + (q[1] + 1) * 0.25); col.push(tint * sh, tint * sh, tint * sh * 0.92); });
      idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeBoundingSphere(); return g;
  }
  var HEDGEGEO = new Map();   // hedge leaf shells are built at their real size (scaling a unit shell stretched the cards into slivers)
  function hedgeGeo(w, h, d) {
    var k = w.toFixed(2) + 'x' + h.toFixed(2) + 'x' + d.toFixed(2), g = HEDGEGEO.get(k); if (g) return g;
    var area = 2 * (w * h + d * h) + w * d, n = Math.min(2600, Math.round(area * (TIER.leaves >= 460 ? 190 : 90)));
    g = cardShell(w, h, d, n, 91 + HEDGEGEO.size * 13, 0.08, 0.06, 0.55);   // flatter cards: a trimmed face, not a bristle of slivers, in close-up
    HEDGEGEO.set(k, g); return g;
  }
  function gardenAssets() {
    if (GARDEN.geo) return;
    var leafMap = tex('leaves_d'); leafMap.encoding = T.sRGBEncoding;
    var hedgeLeaf = new T.MeshStandardMaterial({ color: '#93b866', map: leafMap, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.8, vertexColors: true }); hedgeLeaf.name = 'c18-hedge';
    var hedgeCore = new T.MeshStandardMaterial({ color: '#5f8540', roughness: 1 });   // lighter core: gaps between cards no longer read as black holes
    GARDEN.mats = {
      hedgeLeaf: hedgeLeaf, hedgeCore: hedgeCore,
      shrubLeaf: (function () { var m = hedgeLeaf.clone(); m.color.set('#6c8a3e'); return m; })(),
      fence: upgradeMaterial(new T.MeshStandardMaterial({ color: '#e9e4da', roughness: 0.55 }), 'wood', 'res'),
      drive: upgradeMaterial(new T.MeshStandardMaterial({ color: '#7d7870', roughness: 0.8 }), 'ground', 'res'),
      stone: upgradeMaterial(new T.MeshStandardMaterial({ color: '#b5aea2', roughness: 0.8 }), 'concrete', 'res'),
      edge: upgradeMaterial(new T.MeshStandardMaterial({ color: '#8f8a80', roughness: 0.85 }), 'concrete', 'res'),
      soil: upgradeMaterial(new T.MeshStandardMaterial({ color: '#3a2c1e', roughness: 1 }), 'concrete', 'res'),
      metal: upgradeMaterial(new T.MeshStandardMaterial({ color: '#25272b', metalness: 0.75, roughness: 0.4 }), 'metal', 'res'),
      glow: new T.MeshStandardMaterial({ color: '#fff3d6', emissive: '#ffcf8a', emissiveIntensity: 0 }),
      flowers: ['#e8b04a', '#d8586a', '#f4f1ea', '#9a6ad8', '#e07a3c'].map(function (c) { return new T.MeshStandardMaterial({ color: c, roughness: 0.65 }); })
    };
    GARDEN.geo = {
      box: new T.BoxGeometry(1, 1, 1), cyl: new T.CylinderGeometry(0.5, 0.5, 1, 12), sph: new T.SphereGeometry(0.5, 10, 8),
      hedge: cardShell(1, 1, 1, 1100, 91), shrub: (function () { var g = cardShell(1, 1, 1, 520, 57); return g; })(),
      bloom: new T.IcosahedronGeometry(0.5, 0)
    };
  }
  function addGarden(home, W) {
    gardenAssets();
    var g = new T.Group(); g.name = 'c18-garden'; g.userData.c18home = home;
    var G = GARDEN.geo, M = GARDEN.mats;
    function add(geo, mat, x, y, z, sx, sy, sz, ry, cast) { var m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); m.rotation.y = ry || 0; m.castShadow = cast !== false && (!!TIER.xshadow || mat === GARDEN.mats.hedgeCore); m.receiveShadow = true; m.userData.noBlock = true; m.userData.c18prop = true; g.add(m); S.props++; return m; }
    function hedge(x, z, w, d, h) { add(G.box, M.hedgeCore, x, h * 0.45, z, w * 0.92, h * 0.92, d * 0.92, 0); add(hedgeGeo(w, h, d), M.hedgeLeaf, x, 0, z, 1, 1, 1, 0); }
    // driveway on the engine's parking spot (car at local 5.6, 6.2), stone path + steps to the door (door faces +z)
    add(G.box, M.drive, 5.6, 0.035, 8.4, 3.1, 0.07, 8.8, 0, false);
    add(G.box, M.edge, 4.0, 0.06, 8.4, 0.12, 0.12, 8.8, 0, false); add(G.box, M.edge, 7.2, 0.06, 8.4, 0.12, 0.12, 8.8, 0, false);
    for (var st = 0; st < 6; st++) add(G.box, M.stone, (st % 2 ? 0.08 : -0.08), 0.04, 6.3 + st * 1.05, 1.1, 0.08, 0.8, (st % 3 - 1) * 0.05, false);
    // front lawn edge: hedges either side of the path, picket fence along the plot sides
    hedge(-3.6, 12.2, 5.2, 0.8, 0.95); hedge(2.2, 12.2, 2.4, 0.8, 0.95);
    [-7.6].forEach(function (sx) {
      for (var f = 0; f < 17; f++) add(G.box, M.fence, sx, 0.5, -6.2 + f * 1.1, 0.07, 1.0 + (f % 2) * 0.06, 0.09, 0);
      add(G.box, M.fence, sx, 0.32, 2.6, 0.04, 0.07, 18.0, 0); add(G.box, M.fence, sx, 0.78, 2.6, 0.04, 0.07, 18.0, 0);
    });
    hedge(8.6, 0.0, 0.8, 11.0, 1.4);
    // planted beds along the front wall with stone edging and flowers
    [[-3.4, 5.9, 3.2], [2.4, 5.9, 1.6]].forEach(function (b, bi) {
      add(G.box, M.edge, b[0], 0.08, b[1], b[2] + 0.2, 0.16, 1.1, 0, false); add(G.box, M.soil, b[0], 0.12, b[1], b[2], 0.1, 0.9, 0, false);
      var n = Math.round(b[2] * 4);
      for (var i = 0; i < n; i++) { var fx = b[0] - b[2] / 2 + 0.15 + i * (b[2] - 0.3) / Math.max(1, n - 1), fz = b[1] + (((i * 37) % 5) - 2) * 0.09; add(G.cyl, M.hedgeCore, fx, 0.25, fz, 0.02, 0.3, 0.02, 0, false); add(G.bloom, M.flowers[(i + bi * 2) % 5], fx, 0.43, fz, 0.16, 0.12, 0.16, i, false); add(G.shrub, M.shrubLeaf, fx, 0.1, fz, 0.3, 0.25, 0.3, i, false); }
    });
    // shrubs and a small ornamental tree
    add(G.shrub, M.shrubLeaf, -6.4, 0, 9.6, 1.3, 1.1, 1.3, 0.4); add(G.sph, M.hedgeCore, -6.4, 0.45, 9.6, 1.0, 0.8, 1.0, 0);
    add(G.shrub, M.shrubLeaf, 7.9, 0, 11.4, 1.0, 0.9, 1.0, 1.1);
    // path lights + mailbox
    [-0.95, 0.95].forEach(function (px) { [8.0, 11.0].forEach(function (pz) { add(G.cyl, M.metal, px, 0.3, pz, 0.07, 0.6, 0.07, 0); var gl = add(G.sph, M.glow, px, 0.64, pz, 0.13, 0.1, 0.13, 0, false); gl.userData.c18glow = true; }); });
    add(G.box, M.metal, 3.4, 0.55, 12.6, 0.1, 1.1, 0.1, 0); add(G.box, M.fence, 3.4, 1.16, 12.6, 0.44, 0.3, 0.55, 0);
    home.updateMatrixWorld(true); g.matrixAutoUpdate = false; g.matrix.copy(home.matrixWorld); g.matrixWorld.copy(home.matrixWorld);
    W.world.add(g); GARDEN.list.push(g); home.userData.c18garden = g;
  }
  function gardens(W) {
    if (!TIER.props || off('props') || !AREAS[0].r) return;
    var homes = [];
    try { W.fixed.homes.forEach(function (h) { homes.push(h.group); }); } catch (e) {}
    try { W.chunks.forEach(function (c) { c.homes.forEach(function (h) { if (h.mesh && h.mesh.group) homes.push(h.mesh.group); }); }); } catch (e) {}
    homes.forEach(function (gp) {
      if (!gp || gp.userData.c18garden || !gp.parent) return;
      gp.getWorldPosition(wp); if (areaAt(wp.x, wp.z) !== 'res') return;
      addGarden(gp, W);
    });
    // gardens whose home left the world (chunk streamed out, home rebuilt) are removed with it
    GARDEN.list = GARDEN.list.filter(function (g) { var h = g.userData.c18home, live = h && h.parent && inWorld(h, W.world); if (!live) { W.world.remove(g); } else { h.updateMatrixWorld(); g.matrix.copy(h.matrixWorld); g.matrixWorld.copy(h.matrixWorld); } return live; });
    S.gardens = GARDEN.list.length;
  }
  function inWorld(o, sc) { while (o) { if (o === sc) return true; o = o.parent; } return false; }

  /* ------------------------------------------------------------ 7. interior (own home) */
  function interiorPass(W) {
    if (off('interior') || !W.home || W.active !== W.home) return;
    var n = 0;
    W.home.traverse(function (o) {
      if (seen.has(o) || !o.isMesh) return; seen.add(o);
      if (underActor(o) || !eligible(o)) return;
      var m = o.material, g = o.geometry; if (!g.boundingBox) g.computeBoundingBox();
      var s = new T.Vector3(); g.boundingBox.getSize(s); s.multiply(o.getWorldScale(new T.Vector3()));
      var c = m.color || new T.Color(1, 1, 1), hsl = {}; c.getHSL(hsl);
      var cls = s.y < 0.4 && Math.max(s.x, s.z) > 4 ? 'wood' : (s.y > 2.2 && Math.max(s.x, s.z) > 3 ? 'plaster' : (m.metalness > 0.5 ? 'metal' : (Math.abs(hsl.h - 0.08) < 0.06 && hsl.s > 0.2 ? 'wood' : 'plaster')));
      o.material = upgradeMaterial(m, cls, 'res'); n++;
    });
    S.interior += n;
    dressInterior(W);
  }
  // Interior dressing (visual only, no colliders): daylight windows on the side walls, crown moulding, skirting,
  // rug, corner plants, floor lamps with warm pools, contact shadows; floor gets a wood normal map + soft reflections.
  var INT = { mats: null };
  function dressInterior(W) {
    var it = W.interior; if (!it || !it.group || it.group.userData.c18dressed) return;
    var g0 = it.group; g0.userData.c18dressed = true;
    var b = it.bounds || { hx: 10, hz: 9 }, hx = b.hx + 0.5, hz = b.hz + 0.4, H = 5.2;
    g0.traverse(function (o) { if (o.isMesh && o.rotation.x > 1.5 && o.position.y > 2.5) H = o.position.y; });
    if (!INT.mats) {
      var leafMap = tex('leaves_d'); leafMap.encoding = T.sRGBEncoding;
      INT.mats = {
        win: new T.MeshBasicMaterial({ color: '#dfeaf3' }), sky: new T.MeshBasicMaterial({ color: '#9fc3e6' }),
        frame: upgradeMaterial(new T.MeshStandardMaterial({ color: '#2a2c30', metalness: 0.7, roughness: 0.35 }), 'metal', 'res'),
        trim: upgradeMaterial(new T.MeshStandardMaterial({ color: '#efebe4', roughness: 0.5 }), 'plaster', 'res'),
        rug: upgradeMaterial(new T.MeshStandardMaterial({ color: '#6d5a4a', roughness: 1 }), 'concrete', 'res'),
        rugEdge: upgradeMaterial(new T.MeshStandardMaterial({ color: '#c9b79c', roughness: 1 }), 'concrete', 'res'),
        pot: upgradeMaterial(new T.MeshStandardMaterial({ color: '#d9d2c7', roughness: 0.6 }), 'concrete', 'res'),
        leaf: new T.MeshStandardMaterial({ color: '#6e9a4e', map: leafMap, alphaTest: 0.5, side: T.DoubleSide, roughness: 0.7, vertexColors: true }),
        lampM: upgradeMaterial(new T.MeshStandardMaterial({ color: '#1e1f22', metalness: 0.8, roughness: 0.3 }), 'metal', 'res'),
        shade: new T.MeshStandardMaterial({ color: '#f3e6cf', emissive: '#ffd9a0', emissiveIntensity: 0.9, roughness: 0.9, side: T.DoubleSide }),
        shadow: new T.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0.28, depthWrite: false, map: radial() }),
        pool: new T.MeshBasicMaterial({ color: '#ffb766', transparent: true, opacity: 0.22, depthWrite: false, blending: T.AdditiveBlending, map: radial() })
      };
    }
    var M = INT.mats, G = new T.Group(); G.name = 'c18-interior';
    function box(m, x, y, z, w, h, d, ry) { var o = new T.Mesh(new T.BoxGeometry(w, h, d), m); o.position.set(x, y, z); if (ry) o.rotation.y = ry; o.receiveShadow = true; G.add(o); return o; }
    function flat(m, x, y, z, w, d) { var o = new T.Mesh(new T.PlaneGeometry(w, d), m); o.rotation.x = -Math.PI / 2; o.position.set(x, y, z); G.add(o); return o; }
    // windows: 3 per side wall, 2.2 x 2.6 m, sill at 0.9 m, with frame, mullion and a daylight sky gradient
    [-1, 1].forEach(function (sx) {
      for (var k = -1; k <= 1; k++) {
        var z = k * hz * 0.55, x = sx * (hx - 0.02), wy = 0.9 + 1.3;
        var pane = new T.Mesh(new T.PlaneGeometry(2.2, 2.6), M.win); pane.position.set(x, wy, z); pane.rotation.y = -sx * Math.PI / 2; G.add(pane);
        var sky = new T.Mesh(new T.PlaneGeometry(2.2, 1.1), M.sky); sky.position.set(x - sx * 0.005, wy + 0.75, z); sky.rotation.y = -sx * Math.PI / 2; G.add(sky);
        box(M.frame, x - sx * 0.03, wy + 1.33, z, 0.08, 0.08, 2.36); box(M.frame, x - sx * 0.03, wy - 1.33, z, 0.08, 0.08, 2.36);
        box(M.frame, x - sx * 0.03, wy, z - 1.14, 0.08, 2.7, 0.08); box(M.frame, x - sx * 0.03, wy, z + 1.14, 0.08, 2.7, 0.08); box(M.frame, x - sx * 0.03, wy, z, 0.05, 2.6, 0.05);
        box(M.trim, x - sx * 0.09, 0.86, z, 0.2, 0.06, 2.5);                        // sill
        var sun = flat(M.pool, x - sx * 2.3, 0.012, z + 0.6, 2.4, 3.2); sun.material = M.pool;   // daylight patch on the floor
      }
    });
    // crown moulding + skirting (white) on the three solid walls
    box(M.trim, 0, H - 0.09, -hz + 0.07, hx * 2, 0.18, 0.14); box(M.trim, -hx + 0.07, H - 0.09, 0, 0.14, 0.18, hz * 2); box(M.trim, hx - 0.07, H - 0.09, 0, 0.14, 0.18, hz * 2);
    box(M.trim, -hx + 0.05, 0.09, 0, 0.06, 0.18, hz * 2 - 0.1); box(M.trim, hx - 0.05, 0.09, 0, 0.06, 0.18, hz * 2 - 0.1);
    // rug under the seating area (the sofa group sits at z -3.5)
    flat(M.rugEdge, 0, 0.008, -2.6, 5.4, 3.6); flat(M.rug, 0, 0.011, -2.6, 5.0, 3.2);
    // corner plants + floor lamps with contact shadows and warm light pools
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c, i) {
      var x = c[0] * (hx - 0.9), z = c[1] * (hz - 0.9);
      var pot = new T.Mesh(new T.CylinderGeometry(0.32, 0.24, 0.55, 16), M.pot); pot.position.set(x, 0.275, z); G.add(pot);
      var pl = new T.Mesh(INT.plant || (INT.plant = cardShell(0.9, 1.3, 0.9, 700, 333, 0.09, 0.07)), M.leaf); pl.position.set(x, 0.5, z); G.add(pl);
      flat(M.shadow, x, 0.006, z, 1.3, 1.3);
      var lx = x - c[0] * 1.4, lz = z;
      var pole = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 1.55, 8), M.lampM); pole.position.set(lx, 0.8, lz); G.add(pole);
      var base = new T.Mesh(new T.CylinderGeometry(0.16, 0.18, 0.03, 16), M.lampM); base.position.set(lx, 0.015, lz); G.add(base);
      var sh = new T.Mesh(new T.CylinderGeometry(0.18, 0.26, 0.32, 20, 1, true), M.shade); sh.position.set(lx, 1.62, lz); G.add(sh);
      flat(M.pool, lx, 0.013, lz, 2.6, 2.6);
    });
    g0.add(G); S.interiorDressed = (S.interiorDressed || 0) + 1;
    // floor: wood normal map + low-strength environment reflection on the existing textured floor
    g0.traverse(function (o) {
      if (!o.isMesh || o.name !== 'ground' || !o.material || !o.material.map || o.material.userData.c18floor) return;
      var m = o.material.clone(); m.userData = { c18floor: true, c18: 'floor' };
      var n0 = tex('wood_n'); if (!n0.image) return; var n = n0.clone(); n.needsUpdate = true; n.wrapS = n.wrapT = T.RepeatWrapping; n.repeat.copy(o.material.map.repeat).multiplyScalar(2);
      m.normalMap = n; m.normalScale = new T.Vector2(0.35, 0.35); m.roughness = Math.min(m.roughness, 0.5);
      if (envTex) { m.envMap = envTex; m.envMapIntensity = 0.35; }
      o.material = m;
    });
  }
  var RADIAL = null;
  function radial() {
    if (RADIAL) return RADIAL;
    var c = document.createElement('canvas'); c.width = c.height = 128; var x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.6, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
    RADIAL = new T.CanvasTexture(c); return RADIAL;
  }

  /* ------------------------------------------------------------ attach to the engine */
  var GROUNDS = [], attachedW = null, frame = 0;
  // 19.5: sky refinement (one draw, negligible cost): a bright horizon haze band, a warm Mie halo around a low sun, and
  // sun-lit cloud edges ("silver lining"). Same uniforms as the city's sky; ?c18off=sky restores it.
  function patchSky(m) {
    var f = m.fragmentShader;
    var a1 = '  col += uSunCol * (pow(s, 6.0) * 0.25 + pow(s, 900.0) * 18.0) * day;';
    var a2 = '  col = mix(col, cloudCol, cl * (0.55 + uCloud * 0.4));';
    if (f.indexOf(a1) < 0 || f.indexOf(a2) < 0) { S.skySkipped = true; return; }
    f = f.replace(a1, a1 + '\n  float lowSun = clamp((0.35 - uSunDir.y) / 0.35, 0.0, 1.0) * day;' +
      '\n  col = mix(col, uSkyHor * 1.06 + vec3(0.06, 0.03, 0.0) * lowSun, (1.0 - smoothstep(0.0, 0.09, abs(h))) * 0.55 * day);' +
      '\n  col += mix(uSunCol, vec3(1.0, 0.55, 0.25), lowSun) * pow(s, 24.0) * (0.12 + 0.35 * lowSun) * day;');
    f = f.replace(a2, '  cloudCol *= 1.0 + 0.7 * pow(s, 8.0) * day;\n' + a2);
    m.fragmentShader = f; m.userData.c18sky = true; m.needsUpdate = true; S.sky = true;
  }
  function findShaderMats(W) {
    W.world.traverse(function (o) {
      var m = o.material; if (!m || Array.isArray(m) || !m.isShaderMaterial) return;
      if (!NIGHT && m.uniforms && m.uniforms.uNight) NIGHT = m.uniforms.uNight;
      if (!off('sky') && m.fragmentShader && !m.userData.c18sky && m.fragmentShader.indexOf('uniform float uCloud; varying vec3 vD;') >= 0) patchSky(m);
      if (!off('ground') && m.fragmentShader && m.fragmentShader.indexOf('central plaza paving') >= 0 && !m.userData.c18ground) { patchGround(m); GROUNDS.push(m); }
      if (!off('water') && m.uniforms && m.uniforms.uDeep && !m.userData.c18water) { o.getWorldPosition(wp); if (areaAt(wp.x, wp.z)) patchWater(m); else S.waterOutside = (S.waterOutside || 0) + 1; }
    });
  }
  function attach(W) {
    attachedW = W;
    var upd = W.env && W.env.update;
    if (upd) W.env.update = function () { var r = upd.apply(this, arguments); try { lighting(W); } catch (e) {} return r; };
  }
  function loop() {
    requestAnimationFrame(loop);
    var W = window.__fyrusW; if (!W || !W.world || !W.renderer || !W.env) return;
    if (W !== attachedW) attach(W);
    frame++;
    if (frame % 15 === 1) {
      findShaderMats(W);
      gardens(W);
      if (TIER.ibl && !off('ibl') && !envTex) buildEnv(W, W.renderer);   // materials are created with their envMap (no recompiles later)
      interiorPass(W);
    }
    if (!(TIER.ibl && !off('ibl') && !envTex)) pass(W, PROFILE === 'mobile' ? 1.5 : 2.5);
    if (frame % 60 === 2) buildEnv(W, W.renderer);
    if (frame % 1800 === 900) { try { pruneCaches(W); } catch (e) {} }
    if (NIGHT) NIGHTU.value = NIGHT.value;
    if (GARDEN.mats && NIGHT) GARDEN.mats.glow.emissiveIntensity = NIGHT.value * 2.4;
    if (frame % 15 === 3) {   // sky reflections fade with the daylight (the PMREM sky is dim at night but hemi + env stacked up)
      var ek = 1 - 0.75 * NIGHTU.value;
      FAC.forEach(function (m) { if (m.userData.c18eb == null) m.userData.c18eb = m.envMapIntensity; m.envMapIntensity = m.userData.c18eb * ek; });
      MATS.forEach(function (m) { if (m.userData.c18eb == null) m.userData.c18eb = m.envMapIntensity; m.envMapIntensity = m.userData.c18eb * ek; });
    }
  }
  requestAnimationFrame(loop);
})();
