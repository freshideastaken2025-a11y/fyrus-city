// Unit test: Phase 17 actor instancing + chunk time-slicing in fyrus-engine17.js (three r149 in Node, no WebGL).
const fs = require('fs'); const path = require('path'); const APP = path.join(__dirname, '..', '..', 'app');
const T = (() => { const m = { exports: {} }; new Function('exports', 'module', fs.readFileSync(path.join(APP, 'vendor', 'three', 'three-0.149.0.min.js'), 'utf8'))(m.exports, m); return m.exports; })();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const cbs = []; let now = 0;
global.window = { THREE: T, location: { search: '' }, addEventListener() {}, __fyrusQuality: { params: { fogCull: 0.995, texScale: 1 } } };
global.location = window.location; global.URLSearchParams = URLSearchParams; global.performance = { now: () => now };
global.requestAnimationFrame = (f) => cbs.push(f); global.document = { createElement: () => null };
eval(fs.readFileSync(path.join(APP, 'fyrus-engine17.js'), 'utf8'));
const E = window.__fyrusEngine17;
function frame() { now += 16.7; const l = cbs.splice(0); l.forEach((f) => f(now)); W.renderer.render(W.world, W.camera); }

const scene = new T.Scene(); scene.fog = new T.FogExp2(0xbcd7ee, 0.0036);
const cam = new T.PerspectiveCamera(58, 1.6, 0.1, 1800); cam.position.set(0, 2, 10); scene.add(cam);
// 6 citizens built like the procedural Nn avatar: groups + one Box/Sphere geometry PER mesh (identical parameters)
function citizen(x, shirt) {
  const root = new T.Group(), body = new T.Group(), head = new T.Group(); root.add(body); body.add(head);
  const torso = new T.Mesh(new T.BoxGeometry(0.5, 0.7, 0.3), new T.MeshStandardMaterial({ color: shirt, roughness: 0.8 })); torso.castShadow = true; body.add(torso);
  const skull = new T.Mesh(new T.SphereGeometry(0.2, 12, 8), new T.MeshStandardMaterial({ color: '#c68e65', roughness: 0.8 })); head.add(skull);
  const eye = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), new T.MeshStandardMaterial({ color: '#111111', roughness: 0.8 })); head.add(eye);
  const label = new T.Sprite(new T.SpriteMaterial()); root.add(label);
  const glass = new T.Mesh(new T.BoxGeometry(0.1, 0.1, 0.1), new T.MeshStandardMaterial({ transparent: true, opacity: 0.5 })); head.add(glass);
  root.position.set(x, 0, 0); scene.add(root);
  return { root, body, head, torso, skull, eye, glass, ring: null };
}
const cs = [0, 1, 2, 3, 4, 5].map((i) => citizen(i * 2 - 5, i % 2 ? '#2f6fe0' : '#e04f2f'));
// a car whose wheel spins (transform animated every frame)
const car = new T.Group(); const chassis = new T.Mesh(new T.BoxGeometry(4, 1, 2), new T.MeshStandardMaterial({ color: '#888888' })); car.add(chassis);
const wheel = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.3, 12), new T.MeshStandardMaterial({ color: '#111111' })); wheel.position.set(1.4, 0.4, 1); car.add(wheel);
const traffic = new T.Group(); traffic.add(car); scene.add(traffic); car.position.set(0, 0, -20);
const R = { render(s, c) { s.updateMatrixWorld(); if (s.isScene) s.onBeforeRender(this, s, c); }, getContext: () => null, info: { render: {} } };
// chunk builder: records how many build in a frame
let builtThisFrame = 0, maxPerFrame = 0;
const chunks = new Map();
const player = { root: new T.Group() }; scene.add(player.root);
const W = { renderer: R, camera: cam, world: scene, active: scene, tick() {}, player, npcs: { list: cs.map((a) => ({ av: a })) }, bots: [], traffic: { group: traffic }, chunks,
  buildChunk(cx, cz) { builtThisFrame++; const g = new T.Group(); this.world.add(g); return { key: cx + ',' + cz, cx, cz, group: g, plan: {}, homes: [1], orbs: [], interacts: [], labels: [] }; },
  rebuildColliders() {} };
window.__fyrusW = W;
for (let i = 0; i < 30; i++) frame();
const st = E.stats().instancing;
ok(st.members === 6 * 3 + 2, 'all opaque untextured meshes joined (18 citizen parts + chassis + wheel), got ' + st.members);
ok(cs.every((c) => c.torso.layers.mask === 128 && c.glass.layers.mask === 1), 'originals moved to layer 7; transparent part left as a normal mesh');
for (let i = 0; i < 2; i++) frame();
const ims = scene.children.filter((o) => o.isInstancedMesh);
const torsoIM = ims.find((o) => o.geometry === cs[0].torso.geometry || o.geometry.parameters && o.geometry.parameters.width === 0.5 && o.count > 0);
ok(st.groups === 5, 'identical geometry + look share one group regardless of shirt colour: 5 groups (torso, skull, eye, chassis, wheel), got ' + st.groups);
ok(torsoIM && torsoIM.count === 6 && torsoIM.castShadow === true, 'one cast-shadow InstancedMesh draws all 6 torsos');
// colour comes through per instance
const ci = torsoIM.instanceColor.array; const blue = new T.Color('#2f6fe0');
ok(Math.abs(ci[3] - blue.r) < 1e-6 && Math.abs(ci[5] - blue.b) < 1e-6, 'per-instance colour copied from the original material');
// game code moves / animates the originals -> instances follow in the SAME frame
cs[2].root.position.x = 40; wheel.rotation.x = 1.3; frame();
const idx = 2 * 16; ok(Math.abs(torsoIM.instanceMatrix.array[idx + 12] - 40) < 1e-6, 'moved citizen: instance matrix updated in the same frame');
// hide a face part (Phase 16 crowd LOD does this) -> not drawn
const eyeIM = ims.find((o) => o.geometry === cs[0].eye.geometry);
cs.forEach((c) => { c.eye.visible = false; }); frame(); ok(eyeIM.count === 0, 'hidden originals are not drawn');
cs.forEach((c) => { c.eye.visible = true; }); frame(); ok(eyeIM.count === 6 && eyeIM.castShadow === false, 'shown again; never-casting face parts stay shadowless');
// shadow flag toggled by crowd LOD -> the part is still drawn (one shared draw per group, the group keeps casting)
cs[0].torso.castShadow = false; frame();
ok(torsoIM.count === 6 && torsoIM.castShadow === true && scene.children.filter((o) => o.isInstancedMesh && o.geometry === torsoIM.geometry).length === 1, 'castShadow toggle: still one InstancedMesh, all 6 torsos drawn');
// unchanged frames do not re-upload instance buffers
const v0 = torsoIM.instanceMatrix.version; frame(); frame();
ok(torsoIM.instanceMatrix.version === v0, 'no instance-buffer upload when nothing moved');
// material becomes transparent (fade) -> handed back on the next membership pass
cs[1].torso.material.transparent = true; for (let i = 0; i < 25; i++) frame();
ok(cs[1].torso.layers.mask === 1, 'part whose material became transparent is handed back to the normal renderer');
// citizen removed from the game -> its meshes are released
scene.remove(cs[5].root); W.npcs.list.pop(); for (let i = 0; i < 25; i++) frame();
ok(E.stats().instancing.members === 6 * 3 + 2 - 1 - 3, 'removed citizen released (members ' + E.stats().instancing.members + ')');
// instanced meshes never intercept the game's raycasts
const rc = new T.Raycaster(new T.Vector3(-5, 0.35, 10), new T.Vector3(0, 0, -1)); rc.layers.enable(7); rc.camera = cam;
const hits = rc.intersectObjects(scene.children, true);
ok(hits.length > 0 && hits.every((h) => !h.object.isInstancedMesh), 'raycasts hit the original meshes (layer 7), never the instanced copies');
// kill switch: everything back
E.setInstancing(false); ok(cs[0].torso.layers.mask === 1 && scene.children.filter((o) => o.isInstancedMesh).length === 0, 'setInstancing(false) restores every original');
E.setInstancing(true);

// chunk time-slicing: a row of 5 chunks 2 away is built one per frame; the 3x3 around the player at once
builtThisFrame = 0; const res = [];
for (let d = -2; d <= 2; d++) res.push(W.buildChunk(d, 2));      // far row (distance 2)
const nearRes = []; for (let d = -1; d <= 1; d++) nearRes.push(W.buildChunk(d, 1));   // near row
ok(builtThisFrame === 1 + 3, 'same frame: 1 far chunk + all 3 near chunks built, 4 far deferred (built ' + builtThisFrame + ')');
ok(res.filter((r) => r.fx17deferred).length === 4 && res[1].homes.length === 0 && Array.isArray(res[1].interacts), 'deferred chunks are placeholders with the same fields');
res.forEach((r) => chunks.set(r.key, r));
for (let i = 0; i < 6; i++) { builtThisFrame = 0; frame(); maxPerFrame = Math.max(maxPerFrame, builtThisFrame); }
ok([...chunks.values()].every((c) => !c.fx17deferred) && maxPerFrame === 1, 'placeholders replaced by real chunks, at most 1 per frame');
process.exitCode = fails ? 1 : 0; console.log(fails ? fails + ' failed' : 'all passed');
