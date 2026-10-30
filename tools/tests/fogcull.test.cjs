// Unit test: Phase 16 fog-aware culling decisions (runs fyrus-engine16.js against three r149 in Node, no WebGL).
const fs = require('fs'); const path = require('path'); const APP = path.join(__dirname, '..', '..', 'app');
// the exact three.js build the city serves (UMD; loaded via Function because app/package.json is type=module)
const T = (() => { const m = { exports: {} }; new Function('exports', 'module', fs.readFileSync(path.join(APP, 'vendor', 'three', 'three-0.149.0.min.js'), 'utf8'))(m.exports, m); return m.exports; })();
global.window = { THREE: T, location: { search: '?quality=balanced' }, localStorage: null, addEventListener() {} };
global.location = window.location; global.screen = { width: 1440, height: 900 }; const cbs = []; global.requestAnimationFrame = (f) => cbs.push(f);
global.URLSearchParams = URLSearchParams; global.performance = { now: () => Date.now() };
const store = {}; global.localStorage = { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); } };
eval(fs.readFileSync(path.join(APP, 'fyrus-engine16.js'), 'utf8'));
const E = window.__fyrusEngine16; let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(window.__fyrusQuality.name === 'balanced', 'profile balanced selected');
// fake engine with a renderer whose render() runs frustum tests like WebGLRenderer would
const scene = new T.Scene(); scene.fog = new T.FogExp2(0xbcd7ee, 0.0036);
const cam = new T.PerspectiveCamera(58, 1.6, 0.1, 1800); cam.position.set(0, 2, 0); cam.lookAt(0, 2, -1); cam.updateMatrixWorld();
const mk = (z, mat) => { const m = new T.Mesh(new T.BoxGeometry(10, 10, 10), mat); m.position.set(0, 2, -z); m.updateMatrixWorld(); scene.add(m); return m; };
const near = mk(100, new T.MeshStandardMaterial()), mid = mk(600, new T.MeshStandardMaterial()), far = mk(900, new T.MeshStandardMaterial());
const mountain = mk(900, new T.MeshLambertMaterial({ fog: false }));
const shaderFog = mk(900, new T.ShaderMaterial({ uniforms: { uFogD: { value: 0.0036 } } }));
const shaderNoFog = mk(900, new T.ShaderMaterial({ uniforms: {} }));
const inst = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial(), 4); inst.position.set(0, 2, -900); inst.updateMatrixWorld(); scene.add(inst);
const frustum = new T.Frustum(); frustum.setFromProjectionMatrix(new T.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));
const R = { render(s, c) { this.vis = s.children.map((o) => frustum.intersectsObject(o)); }, shadowMap: {}, info: {}, getPixelRatio: () => 1, domElement: { height: 1600 } };
const W = { renderer: R, camera: cam, world: scene, active: scene, tick() {}, env: null };
// attach the same way the loop does
window.__fyrusW = W; cbs.shift()(0);
R.render(scene, cam);
const [vNear, vMid, vFar, vMountain, vShaderFog, vShaderNoFog, vInst] = R.vis;
const cutoff = E.stats().fogCutoff;
ok(cutoff > 600 && cutoff < 700, 'balanced cutoff for density 0.0036 is ~639 m (got ' + cutoff + ')');
ok(vNear === true, 'object at 100 m drawn');
ok(vMid === true, 'object at 600 m (nearest face 595 m) drawn');
ok(vFar === false, 'fogged object at 900 m culled');
ok(vMountain === true, 'fog:false mountain at 900 m kept');
ok(vShaderFog === false, 'custom-fog shader (uFogD) at 900 m culled');
ok(vShaderNoFog === true, 'shader without fog uniforms kept');
ok(vInst === true, 'InstancedMesh never fog-culled');
scene.fog = null; R.render(scene, cam); ok(R.vis[2] === true, 'no fog -> nothing culled');
// contribution culling (balanced: 2 device px; k = 1600 / tan(29 deg) = 2886)
const tiny = new T.Mesh(new T.SphereGeometry(0.05), new T.MeshStandardMaterial()); tiny.position.set(0, 2, -100); tiny.updateMatrixWorld(); scene.add(tiny);   // 1.4 px
const small = new T.Mesh(new T.SphereGeometry(0.2), new T.MeshStandardMaterial()); small.position.set(0, 2, -100); small.updateMatrixWorld(); scene.add(small); // 5.8 px
R.render(scene, cam); const vt = R.vis[R.vis.length - 2], vs = R.vis[R.vis.length - 1];
ok(vt === false, 'object projecting to ~1.4 px is skipped'); ok(vs === true, 'object projecting to ~5.8 px is drawn');
ok(E.stats().sizeCulled >= 1, 'size-culled counter reported');
process.exitCode = fails ? 1 : 0; console.log(fails ? fails + ' failed' : 'all passed');
