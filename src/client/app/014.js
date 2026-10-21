var tN =
    "varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
  eN =
    Ag +
    `
uniform vec3 uCam; uniform vec3 uGrass; uniform float uPlaza; uniform vec2 uMarket;
varying vec3 vW;
void main(){
  vec2 p = vW.xz; float d0 = length(p);
  float ex = 32.0 - abs(mod(p.x + 32.0, 64.0) - 32.0);
  float ez = 32.0 - abs(mod(p.y + 32.0, 64.0) - 32.0);
  float e = min(ex, ez);
  bool alongZ = ex < ez; float along = alongZ ? p.y : p.x;
  float n = vnoise(p * 0.6) * 0.5 + vnoise(p * 2.3) * 0.3 + vnoise(p * 9.0) * 0.2;
  // block interior: grass with variation
  vec3 grass = uGrass * (0.75 + 0.35 * n);
  // sidewalks
  vec2 tile = abs(fract(p / 1.5) - 0.5);
  float joints = 1.0 - smoothstep(0.46, 0.5, max(tile.x, tile.y)) * 0.18;
  vec3 walk = vec3(0.72, 0.70, 0.66) * (0.9 + 0.12 * n) * joints;
  float kerb = (1.0 - smoothstep(0.0, 0.12, abs(e - 4.0)));
  // asphalt
  vec3 asph = vec3(0.17, 0.18, 0.2) * (0.85 + 0.25 * n);
  float centre = (1.0 - smoothstep(0.06, 0.14, e)) * step(0.45, fract(along / 6.0));
  float laneEdge = 1.0 - smoothstep(0.05, 0.12, abs(e - 3.5));
  float dj = abs(mod(along + 32.0, 64.0) - 32.0); // distance along the road from the junction centre
  float zebra = step(0.5, fract((alongZ ? p.x : p.y) * 1.25)) * step(5.2, dj) * (1.0 - step(8.4, dj)) * step(e, 3.6) * step(4.0, max(ex, ez));
  float stopLine = step(8.8, dj) * (1.0 - step(9.25, dj)) * step(e, 3.6) * step(4.0, max(ex, ez));
  // worn wheel tracks in each lane, patched asphalt and manhole covers
  float tracks = (1.0 - smoothstep(0.0, 0.35, abs(e - 1.15))) + (1.0 - smoothstep(0.0, 0.35, abs(e - 2.55)));
  asph *= 1.0 - 0.1 * tracks * step(e, 3.6);
  float patchN = vnoise(p * 0.08 + 17.0); asph *= 1.0 - 0.12 * smoothstep(0.62, 0.66, patchN);
  float mh = length(vec2(e - 1.8, mod(along + 20.0, 64.0) - 32.0)); asph = mix(asph, vec3(0.11), (1.0 - smoothstep(0.42, 0.46, mh)) * step(e, 3.6)); asph = mix(asph, vec3(0.26), (1.0 - smoothstep(0.02, 0.05, abs(mh - 0.36))) * step(e, 3.6));
  // near a junction the dashed centre line turns into a solid double yellow line
  float nearJ = step(9.3, dj) * (1.0 - step(22.0, dj)) * step(4.0, max(ex, ez));
  float dbl = ((1.0 - smoothstep(0.04, 0.09, abs(e - 0.14))) ) * nearJ;
  centre *= 1.0 - nearJ;
  asph = mix(asph, vec3(0.92), max(centre * 0.9, laneEdge * 0.8));
  asph = mix(asph, vec3(0.95, 0.76, 0.2), dbl * 0.9);
  asph = mix(asph, vec3(0.9), max(zebra * 0.85, stopLine * 0.9));
  // turn arrows painted in each lane before the stop line
  { float ax = abs(e - 1.75); float ay = 13.0 - dj; float shaft = step(ax, 0.12) * step(-1.6, ay) * step(ay, 0.4); float head = step(0.0, ay - 0.4) * step(ay - 0.4, 0.9) * step(ax, 0.5 * (1.0 - (ay - 0.4) / 0.9)); asph = mix(asph, vec3(0.88), max(shaft, head) * 0.85 * step(4.0, max(ex, ez))); }
  vec3 col = e < 4.0 ? asph : (e < 8.0 ? walk : grass);
  col = mix(col, vec3(0.6, 0.6, 0.58), kerb);
  // gutter at the road edge and a grass verge with tree pits between pavement and block
  col = mix(col, vec3(0.1, 0.1, 0.11), (1.0 - smoothstep(0.0, 0.18, abs(e - 3.75))) * 0.55);
  float verge = step(6.6, e) * (1.0 - step(8.0, e));
  col = mix(col, uGrass * (0.7 + 0.3 * n), verge * 0.85);
  col = mix(col, vec3(0.62, 0.6, 0.56), (1.0 - smoothstep(0.0, 0.08, abs(e - 6.6))) * 0.8);
  // central plaza paving
  float inPlaza = 1.0 - smoothstep(uPlaza - 0.4, uPlaza, d0);
  vec2 pr = vec2(d0, atan(p.y, p.x) * d0 / 6.2831 * 0.5);
  vec2 pt = abs(fract(vec2(d0 * 0.5, atan(p.y, p.x) * 8.0)) - 0.5);
  vec3 paving = mix(vec3(0.82, 0.79, 0.74), vec3(0.66, 0.63, 0.58), step(0.5, fract(floor(d0 * 0.5) * 0.5))) * (0.93 + 0.08 * n);
  paving *= 1.0 - smoothstep(0.44, 0.5, max(pt.x, pt.y)) * 0.15;
  col = mix(col, paving, inPlaza);
  // market street paving
  float inMarket = step(uMarket.x, p.x) * step(p.x, uMarket.y) * max(step(abs(p.y), 11.0), step(abs(p.y + 96.0), 11.0));
  float my = abs(p.y) < 20.0 ? p.y : p.y + 96.0;
  vec2 bt = abs(fract(vec2(p.x * 0.5 + step(0.5, fract(my * 0.25)) * 0.5, my * 0.25)) - 0.5);
  vec3 brick = vec3(0.62, 0.5, 0.42) * (0.9 + 0.15 * n) * (1.0 - smoothstep(0.44, 0.5, max(bt.x, bt.y)) * 0.25);
  brick = mix(brick, vec3(0.78, 0.76, 0.7), step(abs(my), 1.2));
  col = mix(col, brick, inMarket);
  // lighting
  vec3 light = uAmb + uSunCol * max(uSunDir.y, 0.0);
  col *= light;
  // wet roads reflect the sky
  float wetMask = uWet * (0.6 + 0.4 * vnoise(p * 0.35));
  col = mix(col, col * 0.55 + mix(uSkyHor, uSkyTop, 0.3) * 0.25, wetMask * 0.8);
  // snow cover (less on roads)
  float snowAmt = uSnow * (e < 4.0 ? 0.35 : 0.95) * (0.8 + 0.2 * n);
  col = mix(col, vec3(0.93, 0.95, 1.0) * (uAmb + uSunCol * 0.7), snowAmt);
  // street-lamp light pools at night
  float lampD = length(vec2(e - 5.5, mod(along, 16.0) - 8.0 + 8.0 - 8.0));
  float pool = (1.0 - smoothstep(0.0, 7.5, length(vec2(e - 5.5, mod(along + 8.0, 16.0) - 8.0)))) * step(36.0, d0);
  col += vec3(1.0, 0.75, 0.45) * pool * uNight * 0.55;
  col += vec3(1.0, 0.8, 0.55) * inMarket * uNight * 0.18 + vec3(0.9, 0.85, 0.75) * inPlaza * uNight * 0.12;
  gl_FragColor = vec4(applyFog(col, length(vW - uCam)), 1.0);
}`;
function lL() {
  return new aa.ShaderMaterial({
    vertexShader: tN,
    fragmentShader: eN,
    extensions: { derivatives: !0 },
    uniforms: {
      ...ha,
      uCam: { value: new aa.Vector3() },
      uPlaza: { value: 30 },
      uMarket: { value: new aa.Vector2(40, 306) },
    },
  });
}
var aN =
    "varying vec3 vW; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vV = cameraPosition - w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
  rN =
    Ag +
    `
uniform vec3 uDeep; uniform vec3 uShallow; uniform float uCaustic;
varying vec3 vW; varying vec3 vV;
void main(){
  vec2 p = vW.xz;
  float w1 = vnoise(p * 0.35 + vec2(uTime * 0.25, uTime * 0.12)); float w2 = vnoise(p * 1.4 - vec2(uTime * 0.4, -uTime * 0.3));
  vec3 Nn = normalize(vec3((w1 - 0.5) * 0.35 + (w2 - 0.5) * 0.2, 1.0, (w2 - 0.5) * 0.35));
  vec3 V = normalize(vV);
  float fres = pow(1.0 - max(dot(Nn, V), 0.0), 4.0);
  vec3 R = reflect(-V, Nn);
  vec3 sky = mix(uSkyHor, uSkyTop, clamp(R.y, 0.0, 1.0));
  vec3 body = mix(uDeep, uShallow, 0.4 + 0.3 * w1) * (uAmb + uSunCol * 0.6);
  float caust = pow(abs(sin((p.x + sin(p.y * 1.3 + uTime) * 0.8) * 2.2) * sin((p.y + sin(p.x * 1.1 - uTime) * 0.8) * 2.2)), 6.0) * uCaustic;
  vec3 col = mix(body + caust * 0.35, sky, 0.25 + 0.6 * fres);
  col += uSunCol * pow(max(dot(R, uSunDir), 0.0), 120.0) * 2.0;
  col += vec3(0.2, 0.55, 0.8) * uNight * uCaustic * 0.6;
  col = mix(col, vec3(0.85, 0.9, 0.95), uSnow * 0.15);
  gl_FragColor = vec4(applyFog(col, length(vV)), 1.0);
}`;
function mu(t) {
  return new aa.ShaderMaterial({
    vertexShader: aN,
    fragmentShader: rN,
    uniforms: {
      ...ha,
      uDeep: { value: new aa.Color(t === "pool" ? "#0e6e8c" : "#0b3b55") },
      uShallow: { value: new aa.Color(t === "pool" ? "#3cc6d8" : "#2a7d8f") },
      uCaustic: { value: t === "pool" ? 1 : 0.15 },
    },
  });
}
var oN =
    "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
  nN =
    Ag +
    `
uniform float uCloud; varying vec3 vD;
void main(){
  vec3 d = normalize(vD); float h = d.y;
  vec3 col = mix(uSkyHor, uSkyTop, pow(clamp(h, 0.0, 1.0), 0.55));
  col = mix(col, uSkyHor * 0.7, 1.0 - smoothstep(-0.25, 0.0, h));
  float s = max(dot(d, uSunDir), 0.0);
  float day = 1.0 - uNight;
  col += uSunCol * (pow(s, 6.0) * 0.25 + pow(s, 900.0) * 18.0) * day;
  // moon
  vec3 md = normalize(vec3(-uSunDir.x, abs(uSunDir.y) + 0.25, -uSunDir.z));
  col += vec3(0.85, 0.9, 1.0) * pow(max(dot(d, md), 0.0), 2200.0) * 6.0 * uNight;
  // clouds
  vec2 cp = d.xz / max(h, 0.06) * 0.7 + vec2(uTime * 0.006, uTime * 0.002);
  float cl = vnoise(cp * 1.2) * 0.55 + vnoise(cp * 2.7) * 0.3 + vnoise(cp * 6.0) * 0.15;
  cl = smoothstep(0.62 - uCloud * 0.45, 0.95, cl) * smoothstep(0.0, 0.18, h);
  vec3 cloudCol = mix(vec3(0.12, 0.14, 0.2), mix(vec3(1.0), uSkyHor, 0.35) * (0.6 + 0.6 * day), day) * (uAmb * 0.8 + uSunCol * 0.5);
  col = mix(col, cloudCol, cl * (0.55 + uCloud * 0.4));
  // stars
  vec2 sp = floor(d.xz / (h + 0.02) * 120.0);
  float star = step(0.9965, h21(sp)) * smoothstep(0.1, 0.4, h) * uNight * (1.0 - cl);
  col += vec3(star) * 0.9;
  gl_FragColor = vec4(col, 1.0);
}`;
function cL() {
  return new aa.ShaderMaterial({
    vertexShader: oN,
    fragmentShader: nN,
    side: aa.BackSide,
    depthWrite: !1,
    fog: !1,
    uniforms: { ...ha },
  });
}
var gd = [
    new aa.MeshStandardMaterial({ color: "#4f7f35", roughness: 0.85, flatShading: !0 }),
    new aa.MeshStandardMaterial({ color: "#3f6f2e", roughness: 0.85, flatShading: !0 }),
    new aa.MeshStandardMaterial({ color: "#6a9a3e", roughness: 0.85, flatShading: !0 }),
  ],
  vu = new aa.MeshStandardMaterial({ color: "#5a4636", roughness: 0.95 }),
  nL = {
    spring: ["#f0b3c8", "#8cc46a", "#e8a7c0"],
    summer: ["#3f7d2e", "#2f6b25", "#4d8c34"],
    autumn: ["#c8762e", "#b8522a", "#d9a03f"],
    winter: ["#6f7d74", "#7b8780", "#8a948e"],
  },
  iL = { spring: "#5f9a3e", summer: "#4f8a32", autumn: "#7d8a3a", winter: "#6b7a62" };
function dL(t, e) {
  let a = nL[t] || nL.summer;
  (gd.forEach((r, o) => {
    r.color.set(a[o]).lerp(new aa.Color("#f2f5f8"), e * 0.7);
  }),
    ha.uGrass.value.set(iL[t] || iL.summer));
}
var Xa = new aa.MeshStandardMaterial({ color: "#fff4dc", emissive: "#ffcf8a", emissiveIntensity: 0 }),
  Mo = [],
  Hn = [],
  sL = !1;
function hL(t, e = !1) {
  (e !== sL && ((sL = e), Xa.emissive.set(e ? "#ff3cac" : "#ffcf8a")),
    (Xa.emissiveIntensity = t * (e ? 3.2 : 2.2)),
    Mo.forEach((a) => (a.emissiveIntensity = 0.15 + t * (e ? 1.9 : 0.9))),
    Hn.forEach((a) => (a.emissiveIntensity = 0.03 + t * 0.85)));
}
var Dj = ha.uTime,
  Fj = { color: ha.uFog, density: ha.uFogD },
  iN = new J.Color("#d8d3c8");
var Cx = new J.CylinderGeometry(0.14, 0.22, 2.2, 7),
  Uj = new J.IcosahedronGeometry(1, 1),
  sN = new J.SphereGeometry(1, 24, 16),
  lN = new J.TorusGeometry(1.6, 0.09, 8, 64);
function zg(t = 1) {
  let e = new J.Group(),
    a = new J.Mesh(
      sN,
      new J.MeshStandardMaterial({
        color: "#4da3ff",
        emissive: "#4da3ff",
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.3,
      }),
    ),
    r = new J.Mesh(
      lN,
      new J.MeshStandardMaterial({
        color: "#ff9a3c",
        emissive: "#ff7a1a",
        emissiveIntensity: 0.6,
        metalness: 0.6,
        roughness: 0.3,
      }),
    );
  return (e.add(a, r), (r.userData.ring = !0), e.scale.setScalar(t), e);
}
var uL = [0, 1, 2].map((t) => {
    let e = new J.IcosahedronGeometry(1, 2),
      a = e.attributes.position,
      r = new Map();
    for (let o = 0; o < a.count; o++) {
      let n = `${a.getX(o).toFixed(3)},${a.getY(o).toFixed(3)},${a.getZ(o).toFixed(3)}`,
        i = r.get(n);
      (i === void 0 &&
        ((i = 0.82 + (Math.abs(Math.sin(o * 12.9898 + t * 78.233) * 43758.5453) % 1) * 0.32), r.set(n, i)),
        a.setXYZ(o, a.getX(o) * i, a.getY(o) * i, a.getZ(o) * i));
    }
    return (e.computeVertexNormals(), e);
  }),
  cN = new J.ConeGeometry(1, 1.6, 9),
  fL = new J.CylinderGeometry(0.05, 0.08, 1.2, 5);
fL.translate(0, 0.6, 0);
var mL = new J.CircleGeometry(1, 20);
mL.rotateX(-Math.PI / 2);
var dN = new J.MeshBasicMaterial({ color: "#000000", transparent: !0, opacity: 0.22, depthWrite: !1 });
function os(t) {
  let e = new J.Mesh(mL, dN);
  return (e.scale.setScalar(t), (e.position.y = 0.035), (e.renderOrder = -1), (e.userData.noBlock = !0), e);
}
var hN = 0;
function ya(t, e = 1, a) {
  let r = a ?? ++hN,
    o = new J.Group(),
    n = Math.abs(t.charCodeAt(2) + t.charCodeAt(4) + r) % 3,
    i = r % 10 < 7 ? "broad" : r % 10 < 9 ? "pine" : "round",
    s = gd[n];
  if (i === "pine") {
    let l = new J.Mesh(Cx, vu);
    ((l.position.y = 1.1), l.scale.set(0.8, 1.2, 0.8), (l.castShadow = !0), o.add(l));
    for (let c = 0; c < 4; c++) {
      let d = new J.Mesh(cN, gd[1]),
        h = 1.5 - c * 0.3;
      (d.scale.set(h, 1, h), (d.position.y = 2.2 + c * 0.95), (d.castShadow = !0), o.add(d));
    }
    o.add(os(1.4));
  } else if (i === "round") {
    let l = new J.Mesh(Cx, vu);
    ((l.position.y = 1.1), (l.castShadow = !0), o.add(l));
    let c = new J.Mesh(uL[n], s);
    ((c.position.y = 3), c.scale.setScalar(1.35), (c.castShadow = !0), o.add(c), o.add(os(1.5)));
  } else {
    let l = new J.Mesh(Cx, vu);
    ((l.position.y = 1.1), (l.castShadow = !0), o.add(l));
    for (let [c, d] of [
      [0, 0.7],
      [2.2, 0.6],
      [4.1, 0.75],
    ]) {
      let h = new J.Mesh(fL, vu);
      ((h.position.y = 1.9), h.rotation.set(0, c, d), o.add(h));
    }
    ([
      [0, 3, 0, 1.3],
      [0.75, 2.6, 0.25, 0.95],
      [-0.7, 2.7, -0.3, 1],
      [0.15, 3.75, -0.1, 0.9],
      [-0.3, 2.4, 0.7, 0.8],
      [0.4, 2.5, -0.75, 0.85],
    ].forEach(([c, d, h, u], p) => {
      let v = new J.Mesh(uL[(n + p) % 3], s);
      (v.position.set(c, d, h),
        v.scale.set(u, u * 0.88, u),
        (v.rotation.y = p),
        (v.castShadow = !0),
        o.add(v));
    }),
      o.add(os(1.8)));
  }
  return (o.scale.setScalar(e * (0.9 + (r % 5) * 0.05)), (o.rotation.y = r * 1.7), o);
}
var oc = new J.MeshStandardMaterial({ color: "#5d5a55", roughness: 0.9 }),
  uN = new J.MeshStandardMaterial({ color: "#6b4a32", roughness: 0.7 }),
  fd = new J.MeshStandardMaterial({ color: "#9aa3ad", metalness: 0.8, roughness: 0.35 }),
  pN = new J.MeshStandardMaterial({ color: "#4a3a2a", roughness: 1 }),
  gN = new J.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.6 }),
  fN = new J.MeshStandardMaterial({ color: "#1b2a44", metalness: 0.6, roughness: 0.2 }),
  pL = ["#e5484d", "#f4c20d", "#f2f2ee", "#c792ea", "#ff9a3c"].map(
    (t) => new J.MeshStandardMaterial({ color: t, roughness: 0.7 }),
  ),
  Tx = new J.MeshStandardMaterial({
    color: "#7f9bb5",
    metalness: 0.9,
    roughness: 0.08,
    transparent: !0,
    opacity: 0.55,
  }),
  mN = gd[1],
  md = new J.MeshStandardMaterial({ color: "#f1efe9", roughness: 0.6 }),
  vL = new J.MeshStandardMaterial({
    color: "#33475a",
    metalness: 0.7,
    roughness: 0.12,
    emissive: "#ffcf8a",
    emissiveIntensity: 0.05,
  }),
  gL = new J.MeshStandardMaterial({ color: "#5a3f35", roughness: 0.85 }),
  vN = new J.MeshStandardMaterial({ color: "#8c4a3a", roughness: 0.9 }),
  xN = new J.MeshStandardMaterial({ color: "#d9d6cf", roughness: 0.5, metalness: 0.3 }),
  yN = new J.MeshStandardMaterial({ color: "#2f6fe0", roughness: 0.5 }),
  kN = new J.MeshStandardMaterial({ color: "#8e8a83", roughness: 0.95 });
Hn.push(vL);
function Sx(t, e, a, r = Math.random()) {
  let o = new J.Group(),
    n = [],
    i = [],
    s = Math.max(1, Math.min(12, t.floors || 3)),
    l = (H, N) => {
      let B = iN.clone().lerp(new J.Color(t.theme), 0.25),
        X = Ea({ base: "#" + B.getHexString(), tint: t.theme, kind: N ?? 1, h: H, seed: r });
      return (n.push(X), X);
    },
    c = s * 2.8,
    d = new J.Mesh(new J.BoxGeometry(11, 0.3, 11), oc);
  ((d.position.y = 0.15), (d.receiveShadow = !0), o.add(d));
  let h = (H, N, B, X = 1.3, M = 1.4, _ = 0) => {
      let lt = new J.Group();
      (lt.position.set(H, N, B), (lt.rotation.y = _));
      let vt = new J.Mesh(new J.BoxGeometry(X + 0.18, M + 0.18, 0.08), md);
      lt.add(vt);
      let zt = new J.Mesh(new J.BoxGeometry(X, M, 0.1), vL);
      ((zt.position.z = 0.02), lt.add(zt));
      let Pe = new J.Mesh(new J.BoxGeometry(0.06, M, 0.12), md);
      ((Pe.position.z = 0.03), lt.add(Pe));
      let Je = new J.Mesh(new J.BoxGeometry(X + 0.3, 0.08, 0.22), md);
      (Je.position.set(0, -M / 2 - 0.1, 0.08), lt.add(Je), o.add(lt));
    },
    u = (H, N, B, X) => {
      let M = new J.Mesh(new J.BoxGeometry(X, 0.18, 1.3), oc);
      (M.position.set(H, N, B + 0.65), (M.castShadow = !0), o.add(M));
      let _ = new J.Mesh(new J.BoxGeometry(X, 0.95, 0.05), Tx);
      (_.position.set(H, N + 0.55, B + 1.28), o.add(_));
      let lt = new J.Mesh(new J.BoxGeometry(X, 0.05, 0.08), fd);
      (lt.position.set(H, N + 1.05, B + 1.28), o.add(lt));
    },
    p = (H, N, B, X, M, _ = 0, lt = 0) => {
      let vt = new J.Mesh(new J.CylinderGeometry(1, 1, H, 3, 1), M);
      return (
        (vt.rotation.z = Math.PI / 2),
        (vt.rotation.x = -Math.PI / 2),
        vt.scale.set(N / 1.732, 1, B / 1.5),
        vt.position.set(_, X + B / 3, lt),
        (vt.castShadow = !0),
        o.add(vt),
        vt
      );
    },
    v = () => {
      for (let H of [-1, 1]) {
        let N = H < 0 ? 2.6 : 1.1,
          B = H < 0 ? -2.6 : 1.55,
          X = new J.Mesh(new J.BoxGeometry(N, 0.35, 0.9), pN);
        (X.position.set(B, 0.45, 4.2), o.add(X));
        let M = H < 0 ? 5 : 2;
        for (let lt = 0; lt < M; lt++) {
          let vt = new J.Mesh(new J.SphereGeometry(0.16, 6, 5), pL[(lt + (H > 0 ? 2 : 0)) % pL.length]);
          (vt.position.set(B - N / 2 + 0.3 + lt * 0.5, 0.72, 4.2 + (lt % 2 ? 0.18 : -0.18)), o.add(vt));
        }
        let _ = new J.Mesh(new J.BoxGeometry(0.5, 0.7, 5), gd[1]);
        (_.position.set(H * 4.9, 0.65, 1), o.add(_));
      }
    },
    g = (H, N) => {
      let B = new J.Mesh(new J.CylinderGeometry(0.7, 0.7, 1.4, 14), gN);
      (B.position.set(-1.6, H + 1.2, N - 1.5), o.add(B));
      for (let X of [-1.6, -0.9, -2.3]) {
        let M = new J.Mesh(new J.BoxGeometry(0.08, 0.5, 0.08), fd);
        (M.position.set(X, H + 0.25, N - 1.5 + (X === -1.6 ? 0.55 : -0.3)), o.add(M));
      }
      for (let X of [0.8, 2.1]) {
        let M = new J.Mesh(new J.BoxGeometry(1, 0.7, 0.8), fd);
        (M.position.set(X, H + 0.35, N - 1.8), o.add(M));
        let _ = new J.Mesh(new J.CylinderGeometry(0.28, 0.28, 0.04, 12), md);
        (_.position.set(X, H + 0.72, N - 1.8), o.add(_));
      }
    },
    m = 4.02;
  switch (t.style) {
    case "dome": {
      c = 5.8;
      let H = 9,
        N = 7,
        B = new J.Mesh(new J.BoxGeometry(H, c, N), l(c, 1));
      (B.position.set(0, c / 2 + 0.3, -0.5),
        (B.castShadow = !0),
        (B.receiveShadow = !0),
        o.add(B),
        p(H + 0.6, N + 0.9, 2.6, c + 0.3, gL, 0, -0.5),
        (c += 2.9));
      let X = new J.Mesh(new J.BoxGeometry(0.8, 2.4, 0.8), vN);
      (X.position.set(2.6, 7.6, -1.6),
        (X.castShadow = !0),
        o.add(X),
        v(),
        (m = 3 + 0.04),
        h(-2.6, 1.9, 3.03, 1.6, 1.3),
        h(2.6, 1.9, 3.03, 1.6, 1.3),
        h(-2.6, 4.7, 3.03, 1.3, 1.2),
        h(0, 4.7, 3.03, 1, 1.2),
        h(2.6, 4.7, 3.03, 1.3, 1.2),
        h(4.53, 1.9, -0.5, 1.4, 1.3, Math.PI / 2),
        h(-4.53, 4.7, -0.5, 1.4, 1.2, -Math.PI / 2));
      break;
    }
    case "pyramid": {
      c = 3.3;
      let H = 10,
        N = 7.2,
        B = new J.Mesh(new J.BoxGeometry(H, c, N), l(c, 1));
      (B.position.set(0, c / 2 + 0.3, -0.6), (B.castShadow = !0), (B.receiveShadow = !0), o.add(B));
      let X = new J.Mesh(new J.ConeGeometry(1, 1, 4, 1).rotateY(Math.PI / 4), gL);
      (X.scale.set((H + 1.2) / 1.414, 2.4, (N + 1.2) / 1.414),
        X.position.set(0, c + 0.3 + 1.2, -0.6),
        (X.castShadow = !0),
        o.add(X),
        (c += 2.7));
      for (let _ of [-2.2, 2.2]) {
        let lt = new J.Mesh(new J.BoxGeometry(0.2, 2.6, 0.2), md);
        (lt.position.set(_, 1.6, 4.2), o.add(lt));
      }
      let M = new J.Mesh(new J.BoxGeometry(5, 0.2, 1.4), oc);
      (M.position.set(0, 0.4, 3.7),
        o.add(M),
        v(),
        (m = 3.04),
        h(-3.3, 1.8, 3.03, 1.8, 1.3),
        h(3.3, 1.8, 3.03, 1.8, 1.3),
        h(5.03, 1.8, -0.6, 1.6, 1.3, Math.PI / 2),
        h(-5.03, 1.8, -0.6, 1.6, 1.3, -Math.PI / 2));
      break;
    }
    case "stack": {
      c = Math.max(3, Math.min(s, 5)) * 3;
      let B = new J.Mesh(new J.BoxGeometry(6.6, c, 7.4), l(c, 0));
      (B.position.set(0, c / 2 + 0.3, -0.7), (B.castShadow = !0), (B.receiveShadow = !0), o.add(B));
      let X = new J.Mesh(new J.BoxGeometry(6.6 + 0.2, 0.6, 7.4 + 0.2), oc);
      (X.position.set(0, c + 0.6, -0.7), o.add(X));
      for (let _ = 1; _ * 3 < c; _++)
        (u(0, _ * 3 + 0.3, 3, 6.6 * 0.8),
          h(-1.4, _ * 3 + 1.6, 3.03, 1.4, 1.9),
          h(1.4, _ * 3 + 1.6, 3.03, 1.4, 1.9));
      h(-1.9, 1.8, 3.03, 1.3, 1.4);
      let M = new J.Mesh(new J.BoxGeometry(2, 0.5, 1.2), oc);
      (M.position.set(0.6, 0.55, 3.6), o.add(M), g(c + 0.9, -0.7), (m = 3.04), (c += 0.9));
      break;
    }
    case "villa": {
      c = 3.4 + Math.min(s, 4) * 1.4;
      let H = new J.Mesh(new J.BoxGeometry(11, 3.2, 7.5), l(c, 1));
      ((H.position.y = 1.9), (H.castShadow = !0), (H.receiveShadow = !0), o.add(H));
      let N = new J.Mesh(new J.BoxGeometry(7.5, c - 3.2, 8.8), l(c, 0));
      (N.position.set(-1.6, 3.5 + (c - 3.2) / 2, -0.6), (N.castShadow = !0), o.add(N));
      let B = new J.Mesh(new J.BoxGeometry(8.2, 0.35, 9.6), oc);
      (B.position.set(-1.6, c + 0.5, -0.6), o.add(B));
      let X = new J.Mesh(new J.BoxGeometry(5.6, 2.4, 0.08), Tx);
      (X.position.set(-2.2, 1.7, 3.8), o.add(X), u(-1.6, 3.6, 3.8, 6));
      let M = new J.Mesh(
        new J.BoxGeometry(4.2, 0.1, 2.6),
        new J.MeshStandardMaterial({ color: "#3cc6d8", roughness: 0.05, metalness: 0.1 }),
      );
      (M.position.set(3.4, 0.33, -5.2), o.add(M));
      let _ = new J.Mesh(new J.BoxGeometry(3.6, 2.8, 5), l(c, 1));
      (_.position.set(6.6, 1.7, 0.6), (_.castShadow = !0), o.add(_));
      let lt = new J.Mesh(new J.BoxGeometry(2.8, 2.2, 0.08), xN);
      (lt.position.set(6.6, 1.4, 3.14), o.add(lt));
      for (let vt = 0; vt < 6; vt++) {
        let zt = new J.Mesh(new J.BoxGeometry(1.5, 0.06, 1), fN);
        (zt.position.set(-4.4 + (vt % 3) * 1.8, c + 0.85, -2.6 + Math.floor(vt / 3) * 1.3),
          (zt.rotation.x = -0.25),
          o.add(zt));
      }
      m = 3.8;
      break;
    }
    case "spire": {
      c = 6 + s * 3.1;
      let H = 7.2,
        N = new J.Mesh(new J.BoxGeometry(H, c, H), l(c, 0));
      ((N.position.y = c / 2 + 0.3), (N.castShadow = !0), o.add(N));
      let B = new J.Mesh(new J.BoxGeometry(H + 0.25, c - 0.6, H + 0.25), Tx);
      ((B.position.y = c / 2), o.add(B));
      for (let _ = 3.1; _ < c; _ += 3.1) {
        let lt = new J.Mesh(new J.BoxGeometry(H + 0.4, 0.22, H + 0.4), md);
        ((lt.position.y = _ + 0.3), o.add(lt));
      }
      let X = new J.Mesh(new J.BoxGeometry(H - 1.6, 1.6, H - 1.6), fd);
      ((X.position.y = c + 1.1), o.add(X));
      let M = new J.Mesh(new J.CylinderGeometry(0.06, 0.12, 4, 6), fd);
      ((M.position.y = c + 3.8), o.add(M), (c += 2), (m = H / 2 + 0.2));
      break;
    }
    default: {
      let H = new J.Mesh(new J.BoxGeometry(8, c, 8), l(c, 1));
      ((H.position.y = c / 2 + 0.3), (H.castShadow = !0), (H.receiveShadow = !0), o.add(H));
      let N = new J.Mesh(new J.BoxGeometry(8.6, 0.35, 8.6), oc);
      ((N.position.y = c + 0.45), o.add(N));
      for (let B = 1; B < s; B++) (u(-2, B * 2.8 + 0.3, 4, 3.2), u(2, B * 2.8 + 0.3, 4, 3.2));
      (g(c + 0.6, 0), (m = 4.02));
    }
  }
  let f = new J.Group(),
    y = new J.Mesh(new J.BoxGeometry(0.1, 1, 0.1), fd);
  ((y.position.y = 0.8), f.add(y));
  let x = new J.Mesh(new J.BoxGeometry(0.4, 0.32, 0.55), yN);
  ((x.position.y = 1.4), f.add(x), f.position.set(1.6, 0, 5.6), o.add(f));
  let k = new J.Mesh(new J.BoxGeometry(3, 0.03, 4), kN);
  (k.position.set(t.style === "villa" ? 6.6 : 3.8, 0.32, 5), (k.receiveShadow = !0), o.add(k));
  for (let H of [-1, 1])
    for (let N = 0; N < 6; N++) {
      let B = new J.Mesh(new J.BoxGeometry(0.08, 0.8, 0.08), md);
      (B.position.set(H * 5.3, 0.7, -4.8 + N * 1.9), o.add(B));
    }
  n.forEach((H) => (H.uniforms.uH.value = c));
  let b = new J.Mesh(new J.BoxGeometry(1.5, 2.5, 0.12), uN);
  (b.position.set(0, 1.55, m), o.add(b));
  let w = new J.Mesh(new J.BoxGeometry(0.05, 0.4, 0.06), fd);
  (w.position.set(0.55, 1.5, m + 0.08), o.add(w));
  let L = new J.Mesh(new J.BoxGeometry(2.6, 0.12, 1.4), oc);
  (L.position.set(0, 3.05, m + 0.6), (L.castShadow = !0), o.add(L));
  let E = new J.Mesh(new J.BoxGeometry(0.18, 0.28, 0.12), Xa);
  (E.position.set(1.05, 2.4, m + 0.08), o.add(E));
  let T = new J.Mesh(
    new J.BoxGeometry(1.6, 0.04, 3.2),
    new J.MeshStandardMaterial({ color: "#bdb6aa", roughness: 0.9 }),
  );
  (T.position.set(0, 0.32, m + 2), (T.receiveShadow = !0), o.add(T));
  for (let H of [-1, 1]) {
    let N = new J.Mesh(new J.BoxGeometry(3.4, 0.7, 0.6), mN);
    (N.position.set(H * 3.4, 0.65, 5.6), (N.castShadow = !0), o.add(N));
  }
  for (let H = 0; H < (t.garden ?? 2); H++) {
    let N = Math.PI + (H / Math.max(1, (t.garden || 1) - 1)) * Math.PI,
      B = ya(H % 2 ? "#a1b2c3" : "#c3d4e5", 0.8 + (H % 3) * 0.12);
    (B.position.set(Math.cos(N) * 7.2, 0.3, Math.sin(N) * 6.2 - 0.5), o.add(B));
  }
  let S = fu(e, a, t.theme, 0.9);
  if (((S.position.y = c + 2.6), o.add(S), t.sign)) {
    let H = fu(t.sign, "", t.accent || "#ff9a3c", 0.6);
    (H.position.set(0, 3.6, m + 1.2), o.add(H));
  }
  return { group: o, door: b, height: c, mats: n, label: S, spinners: i };
}
function Hx(t, e, a) {
  t.spinners.forEach((r) => {
    r.userData.layer !== void 0 &&
      (r.rotation.y = r.userData.layer * 0.25 + Math.sin(a * 0.3 + r.userData.layer) * 0.12);
  });
}
var Nx = (t, e) => Math.atan2(-t, -e),
  jg = (t, e) => t.applyAxisAngle(new dt.Vector3(0, 1, 0), e),
  Kt = {
    marble: new dt.MeshStandardMaterial({ color: "#ece7dc", roughness: 0.55 }),
    stone: new dt.MeshStandardMaterial({ color: "#cfc8ba", roughness: 0.85 }),
    paving: new dt.MeshStandardMaterial({ color: "#8f8b84", roughness: 0.95 }),
    copper: new dt.MeshStandardMaterial({ color: "#4f8f7a", roughness: 0.45, metalness: 0.55 }),
    gold: new dt.MeshStandardMaterial({ color: "#d4a64a", roughness: 0.3, metalness: 0.85 }),
    glass: new dt.MeshStandardMaterial({
      color: "#7fa6c4",
      roughness: 0.08,
      metalness: 0.6,
      transparent: !0,
      opacity: 0.8,
    }),
    dark: new dt.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.6, metalness: 0.4 }),
    grass: new dt.MeshStandardMaterial({ color: "#4a6b36", roughness: 1 }),
  };
function bN(t, e, a, r = 1024, o = 256, n = "#1d2228") {
  let i = document.createElement("canvas");
  ((i.width = r), (i.height = o));
  let s = i.getContext("2d");
  (eo(s, 6, 6, r - 12, o - 12, Math.round(o * 0.1)),
    (s.fillStyle = n),
    s.fill(),
    (s.lineWidth = Math.max(4, o * 0.025)),
    (s.strokeStyle = a),
    s.stroke(),
    (s.textAlign = "center"),
    (s.fillStyle = "#fff"));
  let l = Math.round(o * (e ? 0.34 : 0.42));
  for (s.font = `800 ${l}px Sora, sans-serif`; s.measureText(t).width > r - 60 && l > 12; )
    ((l -= 2), (s.font = `800 ${l}px Sora, sans-serif`));
  (s.fillText(t, r / 2, e ? o * 0.5 : o * 0.62),
    e &&
      ((s.fillStyle = "rgba(255,255,255,.78)"),
      (s.font = `600 ${Math.round(o * 0.16)}px "Plus Jakarta Sans", sans-serif`),
      s.fillText(e, r / 2, o * 0.8)));
  let c = new dt.CanvasTexture(i);
  return ((c.anisotropy = 4), c);
}
function De(t, e, a, r, o = 256) {
  let n = new dt.MeshStandardMaterial({
    map: bN(t, e, a, 1024, o),
    roughness: 0.6,
    emissive: "#ffffff",
    emissiveIntensity: 0.15,
    side: dt.DoubleSide,
  });
  return ((n.emissiveMap = n.map), Mo.push(n), new dt.Mesh(new dt.PlaneGeometry(r, (r * o) / 1024), n));
}
function w0(t, e, a, r, o, n = 0.55) {
  for (let i = 0; i < e; i++) {
    let s = new dt.Mesh(new dt.CylinderGeometry(n, n * 1.1, o, 16), Kt.marble);
    (s.position.set(-a / 2 + (a * i) / (e - 1), o / 2 + 1.2, r), (s.castShadow = !0), t.add(s));
  }
}
function wN(t) {
  let e = new dt.Group(),
    a = new dt.Mesh(new dt.CylinderGeometry(0.08, 0.1, 8, 8), Kt.dark);
  ((a.position.y = 4), e.add(a));
  let r = document.createElement("canvas");
  ((r.width = 192), (r.height = 128));
  let o = r.getContext("2d");
  ((o.fillStyle = "#0b1d3f"),
    o.fillRect(0, 0, 192, 128),
    (o.fillStyle = t),
    o.fillRect(0, 50, 192, 28),
    (o.fillStyle = "#2f6fe0"),
    o.beginPath(),
    o.arc(96, 64, 22, 0, Math.PI * 2),
    o.fill(),
    (o.strokeStyle = "#ff9a3c"),
    (o.lineWidth = 6),
    o.beginPath(),
    o.ellipse(96, 64, 36, 14, -0.35, 0, Math.PI * 2),
    o.stroke());
  let n = new dt.Mesh(
    new dt.PlaneGeometry(2.4, 1.6, 8, 1),
    new dt.MeshStandardMaterial({ map: new dt.CanvasTexture(r), side: dt.DoubleSide, roughness: 0.8 }),
  );
  return (n.position.set(1.25, 7.1, 0), (n.name = "cloth"), e.add(n), e);
}
function kL() {
  let t = new dt.Group(),
    e = [],
    a = [],
    r = [],
    o = (i, s, l) => (
      i.position.set(s, 0, l),
      (i.rotation.y = Nx(s, l)),
      t.add(i),
      (c) => jg(c.clone(), i.rotation.y).add(i.position)
    );
  {
    let i = new dt.Group(),
      s = Ha.parliament,
      l = new dt.Mesh(new dt.BoxGeometry(34, 1.2, 24), Kt.stone);
    ((l.position.y = 0.6), (l.receiveShadow = !0), i.add(l));
    for (let m = 0; m < 3; m++) {
      let f = new dt.Mesh(new dt.BoxGeometry(14, 0.4, 1.2), Kt.stone);
      (f.position.set(0, 0.2 + m * 0.4, 12.6 + (2 - m) * 1.1), i.add(f));
    }
    let c = new dt.Mesh(
      new dt.BoxGeometry(30, 9, 16),
      Ea({ base: "#ece7dc", tint: "#8a9bb0", kind: 2, h: 9, seed: 0.31 }),
    );
    (c.position.set(0, 5.7, -2), (c.castShadow = !0), i.add(c), w0(i, 8, 22, 8.2, 8));
    let d = new dt.Mesh(new dt.CylinderGeometry(0.01, 13.5, 2.6, 3, 1), Kt.marble);
    ((d.rotation.z = Math.PI / 2),
      (d.rotation.y = Math.PI / 2),
      d.scale.set(1, 1, 0.35),
      d.position.set(0, 10.6, 8.2),
      i.add(d));
    let h = new dt.Mesh(new dt.CylinderGeometry(6, 6, 3, 32), Kt.marble);
    (h.position.set(0, 11.7, -2), i.add(h));
    let u = new dt.Mesh(new dt.SphereGeometry(6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), Kt.copper);
    (u.position.set(0, 13.2, -2), (u.castShadow = !0), i.add(u));
    let p = new dt.Mesh(new dt.SphereGeometry(0.6, 16, 10), Kt.gold);
    (p.position.set(0, 19.4, -2), i.add(p));
    let v = De("PARLIAMENT OF FYRUS", "Vote for the cabinet \xB7 weekly elections", "#ffc27a", 14);
    (v.position.set(0, 2.6, 13.2), i.add(v));
    for (let m of [-15, 15]) {
      let f = wN("#ffc27a");
      (f.position.set(m, 1.2, 11), i.add(f), r.push(f.getObjectByName("cloth")));
    }
    let g = o(i, s.x, s.z);
    (e.push({
      pos: g(new dt.Vector3(0, 0, 14.5)),
      radius: 4.5,
      label: "Enter Parliament \u2014 vote for the cabinet",
      action: "gov",
      payload: "parliament",
    }),
      a.push({ x: s.x, z: s.z, r: 14 }));
  }
  {
    let i = new dt.Group(),
      s = Ha.bank,
      l = new dt.Mesh(new dt.BoxGeometry(26, 1.2, 18), Kt.stone);
    ((l.position.y = 0.6), i.add(l));
    let c = new dt.Mesh(
      new dt.BoxGeometry(22, 10, 12),
      Ea({ base: "#e3ddd0", tint: "#6f7f90", kind: 2, h: 10, seed: 0.62 }),
    );
    (c.position.set(0, 6.2, -1.5), (c.castShadow = !0), i.add(c), w0(i, 6, 16, 5.6, 8.4, 0.5));
    let d = new dt.Mesh(new dt.BoxGeometry(19, 1.2, 2), Kt.marble);
    (d.position.set(0, 10.2, 5.6), i.add(d));
    let h = new dt.Mesh(new dt.CylinderGeometry(2.2, 2.2, 0.4, 40), Kt.gold);
    ((h.rotation.x = Math.PI / 2), h.position.set(0, 14, -1.5), (h.name = "coin"), i.add(h));
    let u = De("CENTRAL BANK OF FYRUS", "Fyrus Coin (FYC) \xB7 treasury", "#d4a64a", 12);
    (u.position.set(0, 2.6, 9.2), i.add(u));
    let p = o(i, s.x, s.z);
    (e.push({
      pos: p(new dt.Vector3(0, 0, 10.5)),
      radius: 4.2,
      label: "Enter the Central Bank \u2014 FYC services",
      action: "gov",
      payload: "bank",
      obj: h,
    }),
      a.push({ x: s.x, z: s.z, r: 12 }),
      (t.__coin = h));
  }
  {
    let i = new dt.Group(),
      s = Ha.citizens,
      l = new dt.Mesh(new dt.CylinderGeometry(7, 7.4, 0.6, 32), Kt.stone);
    ((l.position.y = 0.3), i.add(l));
    let c = new dt.Mesh(new dt.CylinderGeometry(5, 5, 4.5, 24, 1, !0), Kt.glass);
    ((c.position.y = 2.85), i.add(c));
    let d = new dt.Mesh(new dt.CylinderGeometry(6.2, 6.2, 0.5, 32), Kt.marble);
    ((d.position.y = 5.3), i.add(d));
    let h = De("CITIZEN CENTER", "Free visas for visitors \xB7 passports for citizens", "#4da3ff", 8);
    (h.position.set(0, 6.6, 0), i.add(h));
    let u = o(i, s.x, s.z);
    (e.push({
      pos: u(new dt.Vector3(0, 0, 7.5)),
      radius: 3.8,
      label: "Enter the Citizen Center \u2014 get your passport",
      action: "gov",
      payload: "passport",
    }),
      a.push({ x: s.x, z: s.z, r: 6 }));
  }
  let n = t.__coin;
  return {
    group: t,
    interacts: e,
    colliders: a,
    tick: (i, s) => {
      ((n.rotation.z = s * 0.8), r.forEach((l, c) => (l.rotation.y = Math.sin(s * 1.8 + c) * 0.25)));
    },
  };
}
var bL = new dt.MeshStandardMaterial({
  color: "#2d3d4c",
  metalness: 0.7,
  roughness: 0.1,
  emissive: "#ffd9a0",
  emissiveIntensity: 0.05,
});
Hn.push(bL);
var xL = new dt.MeshStandardMaterial({ color: "#8a6446", roughness: 0.8 }),
  xu = new dt.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.5, metalness: 0.6 });
function yL() {
  let t = new dt.Group(),
    e = new dt.Mesh(new dt.CylinderGeometry(0.07, 0.11, 4.4, 8), xu);
  ((e.position.y = 2.2), t.add(e));
  let a = new dt.Mesh(new dt.BoxGeometry(0.08, 0.08, 0.9), xu);
  (a.position.set(0, 4.35, 0.4), t.add(a));
  let r = new dt.Mesh(new dt.BoxGeometry(0.4, 0.14, 0.6), Xa);
  return (r.position.set(0, 4.28, 0.8), t.add(r), t);
}
function MN() {
  let t = new dt.Group(),
    e = new dt.Mesh(new dt.BoxGeometry(1.8, 0.08, 0.5), xL);
  ((e.position.y = 0.46), t.add(e));
  let a = new dt.Mesh(new dt.BoxGeometry(1.8, 0.4, 0.06), xL);
  (a.position.set(0, 0.75, -0.24), t.add(a));
  for (let r of [-0.75, 0.75]) {
    let o = new dt.Mesh(new dt.BoxGeometry(0.06, 0.46, 0.46), xu);
    (o.position.set(r, 0.23, 0), t.add(o));
  }
  return t;
}
function EN(t, e, a, r) {
  let o = new dt.Group(),
    n = t * 0.72,
    i = new dt.Mesh(
      new dt.BoxGeometry(n, e, n),
      Ea({ base: "#e6e1d8", tint: a, kind: Math.floor(r * 3), h: e, seed: r }),
    );
  ((i.position.y = e / 2 + 0.16), (i.castShadow = !0), (i.receiveShadow = !0), o.add(i));
  let s = new dt.Mesh(new dt.BoxGeometry(n * 0.86, 2.6, 0.1), bL);
  (s.position.set(0, 1.5, n / 2 + 0.03), o.add(s));
  let l = new dt.Mesh(new dt.BoxGeometry(1.4, 2.3, 0.12), xu);
  (l.position.set(0, 1.32, n / 2 + 0.06), o.add(l));
  let c = new dt.Mesh(
    new dt.BoxGeometry(n * 0.9, 0.12, 1.4),
    new dt.MeshStandardMaterial({ color: a, roughness: 0.7 }),
  );
  (c.position.set(0, 3.05, n / 2 + 0.7), (c.rotation.x = 0.12), (c.castShadow = !0), o.add(c));
  let d = new dt.Mesh(
    new dt.BoxGeometry(n + 0.3, 0.6, n + 0.3),
    new dt.MeshStandardMaterial({ color: "#cfc9bd", roughness: 0.85 }),
  );
  ((d.position.y = e + 0.46), o.add(d));
  let h = new dt.Mesh(new dt.BoxGeometry(1.4, 0.9, 1), xu);
  (h.position.set(n * 0.2, e + 0.6, -n * 0.2), o.add(h));
  for (let u of [-n / 2 + 0.6, n / 2 - 0.6]) {
    let p = new dt.Mesh(
      new dt.BoxGeometry(0.8, 0.6, 0.8),
      new dt.MeshStandardMaterial({ color: "#b9b4aa", roughness: 0.9 }),
    );
    (p.position.set(u, 0.46, n / 2 + 1.6), o.add(p));
    let v = ya("#4f7f35", 0.35);
    (v.position.set(u, 0.76, n / 2 + 1.6), o.add(v));
  }
  return o;
}
var LN = { prime: "#c9b27a", central: "#a8a39a", standard: "#8c8f86" };
function wL(t, e, a) {
  let r = new dt.Group(),
    o = [],
    n = [];
  return (
    Hr.forEach((i) => {
      let s = i.cols * i.gap + 14,
        l = i.rows * i.gap + 14,
        c = Nx(i.x, i.z),
        d = new dt.Mesh(new dt.BoxGeometry(s, 0.1, l), Kt.paving);
      (d.position.set(i.x, 0.05, i.z), (d.rotation.y = 0), (d.receiveShadow = !0), r.add(d));
      let h = new dt.Group(),
        u = Math.hypot(i.x, i.z),
        p = Math.max(s, l) / 2 + 6;
      (h.position.set(i.x - (i.x / u) * p, 0, i.z - (i.z / u) * p), (h.rotation.y = c));
      for (let f of [-7, 7]) {
        let y = new dt.Mesh(new dt.BoxGeometry(1.2, 8, 1.2), Kt.marble);
        (y.position.set(f, 4, 0), h.add(y));
      }
      let v = new dt.Mesh(new dt.BoxGeometry(16, 1.2, 1.4), Kt.marble);
      (v.position.set(0, 8.4, 0), h.add(v));
      let g = De(i.name.toUpperCase(), i.tagline, i.color, 12);
      (g.position.set(0, 6.2, 0.75), h.add(g));
      let m = g.clone();
      ((m.position.z = -0.75),
        (m.rotation.y = Math.PI),
        h.add(m),
        r.add(h),
        n.push(
          { x: h.position.x + Math.cos(c) * 7, z: h.position.z - Math.sin(c) * 7, r: 1 },
          { x: h.position.x - Math.cos(c) * 7, z: h.position.z + Math.sin(c) * 7, r: 1 },
        ));
      for (let [f, y] of [
        [-s / 2 + 3, -l / 2 + 3],
        [s / 2 - 3, -l / 2 + 3],
        [-s / 2 + 3, l / 2 - 3],
        [s / 2 - 3, l / 2 - 3],
      ]) {
        let x = ya("#4f7f35", 1);
        (x.position.set(i.x + f, 0, i.z + y), r.add(x));
      }
      for (let f = 0; f <= i.cols; f++)
        for (let y of [-1, 1]) {
          let x = i.x - (i.cols * i.gap) / 2 + f * i.gap,
            k = i.z + y * (l / 2 - 1.2),
            b = yL();
          if (
            (b.position.set(x, 0, k),
            (b.rotation.y = y > 0 ? Math.PI : 0),
            r.add(b),
            f < i.cols && f % 2 === 0)
          ) {
            let w = MN();
            (w.position.set(x + i.gap / 2, 0, k), (w.rotation.y = y > 0 ? Math.PI : 0), r.add(w));
          }
        }
      for (let f = 0; f <= i.rows; f++)
        for (let y of [-1, 1]) {
          let x = yL();
          (x.position.set(i.x + y * (s / 2 - 1.2), 0, i.z - (i.rows * i.gap) / 2 + f * i.gap),
            (x.rotation.y = y > 0 ? -Math.PI / 2 : Math.PI / 2),
            r.add(x));
        }
    }),
    Ya.forEach((i) => {
      let s = Hr.find((u) => u.id === i.district),
        l = t[i.id],
        c = Nx(i.x, i.z),
        d = new dt.Mesh(
          new dt.BoxGeometry(i.size, 0.16, i.size),
          new dt.MeshStandardMaterial({ color: l ? "#6f6a62" : LN[i.tier], roughness: 0.9 }),
        );
      (d.position.set(i.x, 0.08, i.z), (d.receiveShadow = !0), r.add(d));
      let h = new dt.Vector3(0, 0, i.size / 2 + 1.6);
      if ((jg(h, c), h.add(new dt.Vector3(i.x, 0, i.z)), l)) {
        let p = l.owner === e ? "#ff9a3c" : a(l.owner),
          v = ((i.n * 37 + i.id.charCodeAt(0)) % 100) / 100,
          g = l.use ? 5 + v * 9 + (i.tier === "prime" ? 5 : 0) : 0;
        if (g) {
          let m = EN(i.size, g, p, v);
          (m.position.set(i.x, 0, i.z),
            (m.rotation.y = c),
            r.add(m),
            n.push({ x: i.x, z: i.z, r: i.size * 0.42 }));
          let f = De(
              (l.sign || l.use || "").toUpperCase().slice(0, 26),
              `${i.id} \xB7 ${l.ownerName}`,
              p,
              i.size * 0.66,
              220,
            ),
            y = new dt.Vector3(0, 0, i.size * 0.36 + 0.06);
          (jg(y, c), f.position.set(i.x + y.x, 3.2, i.z + y.z), (f.rotation.y = c), r.add(f));
        } else {
          let m = De(`${i.id} \xB7 SOLD`, l.ownerName, p, 3.4, 256);
          (m.position.set(h.x, 1.6, h.z), (m.rotation.y = c), r.add(m));
        }
        if (l.forSale) {
          let m = De("FOR SALE", `${l.forSale.toLocaleString("en-US")} FYC`, "#45e0ae", 3.2, 256),
            f = new dt.Vector3(2.6, 0, i.size / 2 + 0.8);
          (jg(f, c), m.position.set(i.x + f.x, 1.4, i.z + f.z), (m.rotation.y = c), r.add(m));
        }
      } else {
        let u = new dt.Mesh(new dt.CylinderGeometry(0.06, 0.06, 1.6, 6), Kt.dark);
        (u.position.set(h.x, 0.8, h.z), r.add(u));
        let p = De(
          `${i.id} \xB7 ${js[i.tier].label.toUpperCase()}`,
          `For sale \xB7 ${i.price.toLocaleString("en-US")} FYC`,
          s.color,
          3.2,
          256,
        );
        (p.position.set(h.x, 1.9, h.z), (p.rotation.y = c), r.add(p));
      }
      o.push({
        pos: h,
        radius: 3.4,
        label: l
          ? `Plot ${i.id} \xB7 ${l.use || "empty"} \xB7 ${l.ownerName}${l.forSale ? " \xB7 for sale" : ""}`
          : `Plot ${i.id} \xB7 ${js[i.tier].label} \xB7 ${i.price.toLocaleString("en-US")} FYC`,
        action: "plot",
        payload: i.id,
      });
    }),
    { group: r, interacts: o, colliders: n }
  );
}
var Z = P(ea(), 1);
var ao = (t, e = 0.6, a = 0) => new Z.MeshStandardMaterial({ color: t, roughness: e, metalness: a }),
  Fe = {
    steel: ao("#c9ced4", 0.35, 0.8),
    white: ao("#f4f4f2", 0.5),
    red: ao("#d63a3a", 0.45),
    blue: ao("#2f6fe0", 0.45),
    yellow: ao("#f4c20d", 0.45),
    dark: ao("#2b2e33", 0.6, 0.4),
    wood: ao("#8a6446", 0.8),
    concrete: ao("#b9b4aa", 0.9),
    glass: new Z.MeshStandardMaterial({
      color: "#8fb3cf",
      roughness: 0.1,
      metalness: 0.6,
      transparent: !0,
      opacity: 0.6,
    }),
  };
function CN(t, e, a) {
  let r = document.createElement("canvas");
  ((r.width = 1024), (r.height = 256));
  let o = r.getContext("2d");
  (eo(o, 6, 6, 1012, 244, 30),
    (o.fillStyle = "#1d2228"),
    o.fill(),
    (o.lineWidth = 8),
    (o.strokeStyle = a),
    o.stroke(),
    (o.textAlign = "center"),
    (o.fillStyle = "#fff"));
  let n = 92;
  for (o.font = `800 ${n}px Sora, sans-serif`; o.measureText(t).width > 960 && n > 20; )
    ((n -= 4), (o.font = `800 ${n}px Sora, sans-serif`));
  return (
    o.fillText(t, 512, e ? 128 : 158),
    e &&
      ((o.fillStyle = "rgba(255,255,255,.78)"),
      (o.font = '600 40px "Plus Jakarta Sans", sans-serif'),
      o.fillText(e, 512, 205)),
    new Z.CanvasTexture(r)
  );
}
