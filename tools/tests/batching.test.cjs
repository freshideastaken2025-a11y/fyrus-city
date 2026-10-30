// Unit test: Phase 16 static batching in fyrus-perf.js (look-based grouping, Box/Cylinder groups, material watch).
// Runs the real layer file against the city's three.js r149 in Node with a fake engine object (no WebGL).
const fs = require('fs'), path = require('path');
const APP = path.join(__dirname, '..', '..', 'app');
const T = (() => { const m = { exports: {} }; new Function('exports', 'module', fs.readFileSync(path.join(APP, 'vendor', 'three', 'three-0.149.0.min.js'), 'utf8'))(m.exports, m); return m.exports; })();
let now = 0; const rafs = []; let fails = 0;
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
function boot(search) {
  global.window = { THREE: T, devicePixelRatio: 2, location: { search }, addEventListener() {}, __fyrus: { getState: () => ({ settings: { quality: 'high' } }) } };
  global.location = window.location; global.document = { hidden: false }; global.screen = { width: 1440, height: 900 };
  global.performance = { now: () => now }; global.requestAnimationFrame = (f) => rafs.push(f); global.setInterval = () => 0; global.URLSearchParams = URLSearchParams;
  rafs.length = 0; now = 0;
  eval(fs.readFileSync(path.join(APP, 'fyrus-perf.js'), 'utf8'));
}
function world() {
  const scene = new T.Scene(), player = { root: new T.Group() }; scene.add(player.root);
  // 12 boxes in one 64 m cell: 6 share one material object, 6 have their own identical-looking materials
  const shared = new T.MeshStandardMaterial({ color: '#aa3322', roughness: 0.8 });
  const boxes = [];
  for (let i = 0; i < 12; i++) {
    const m = new T.Mesh(new T.BoxGeometry(1, 2, 1), i < 6 ? shared : new T.MeshStandardMaterial({ color: '#aa3322', roughness: 0.8 }));
    m.position.set(5 + i * 3, 1, 5); scene.add(m); boxes.push(m);
  }
  const odd = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 2), new T.MeshStandardMaterial({ color: '#2244aa' })); odd.position.set(50, 1, 50); scene.add(odd);
  scene.updateMatrixWorld(true);
  const renderer = { info: { render: {}, memory: {} }, getPixelRatio: () => 1, setPixelRatio() {} };
  return { scene, W: { world: scene, active: scene, renderer, player, allInteracts: () => [] }, boxes, shared };
}
function run(seconds) { for (let t = 0; t < seconds * 60; t++) { now += 1000 / 60; const fs2 = rafs.splice(0); fs2.forEach((f) => f(now)); } }

// ---- Phase 16 on ----
boot('');
let w = world(); window.__fyrusW = w.W; run(12);
let batches = w.scene.children.filter((o) => o.name === 'fx-batch');
ok(w.boxes.every((b) => b.layers.mask === 128), 'all 12 boxes (BoxGeometry = 6 groups) moved to the hidden batch layer');
ok(batches.length === 1, 'identical-looking materials merged into ONE batch (got ' + batches.length + ')');
ok(batches[0] && batches[0].geometry.attributes.position.count === 12 * 24, 'batch holds all 12 boxes (288 verts)');
ok(batches[0] && batches[0].material.name === 'fx-canon' && batches[0].material !== w.shared, 'mixed group renders with a private clone, originals untouched');
// a game script changes ONE original material later -> that box must be handed back with its new look
w.boxes[9].material.color.set('#00ff00'); run(4);
ok(w.boxes[9].layers.mask !== 128, 'box whose material changed was handed back to the normal renderer');
ok(w.boxes.filter((b, i) => i !== 9).every((b) => b.layers.mask === 128), 'the other 11 stay batched');
// moving a member still un-batches it (original behaviour)
w.boxes[0].position.x += 1; w.boxes[0].updateMatrixWorld(true); run(4);
ok(w.boxes[0].layers.mask !== 128, 'moved box handed back');
ok(window.__fyrusPerf.stats().groups >= 1, 'stats report groups');
// ---- Phase 16 off: original rules (material identity + no geometry groups) ----
boot('?p16off=all');
w = world(); window.__fyrusW = w.W; run(12);
batches = w.scene.children.filter((o) => o.name === 'fx-batch');
ok(batches.length === 0 && w.boxes.every((b) => b.layers.mask === 1), 'with p16off=all, Box geometry is not batched (original v1.0 behaviour)');
process.exitCode = fails ? 1 : 0; console.log(fails ? fails + ' failed' : 'all passed');
