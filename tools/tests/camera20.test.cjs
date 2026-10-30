// node tools/tests/camera20.test.cjs  - unit test for app/fyrus-camera20.js (no browser)
const fs = require('fs'), path = require('path'), assert = require('assert');
const src = fs.readFileSync(path.join(__dirname, '../../app/fyrus-camera20.js'), 'utf8');
function V(x, y, z) { return { x, y, z, set(a, b, c) { this.x = a; this.y = b; this.z = c; return this; } }; }
function load(search) {
  const w = { location: { search: search || '' } };
  global.window = w; global.location = w.location; global.performance = { now: () => 0 }; global.URLSearchParams = URLSearchParams;
  eval(src); return w;
}
let w = load('');
w.__fyrusW = { colliders: [{ x: 0, z: -4, r: 2 }] };                // a home 4 m behind the player
let h = V(0, 1.5, 0), d = V(0, 3, -8);                                 // camera wants to sit 8 m behind, through the home
w.__fyrusCamera(d, h);
assert(Math.hypot(d.x, d.z) < 2.0, 'camera pulled in before the home: ' + JSON.stringify(d));
const pulledZ = d.z;
// clear view: camera eases back out, not instantly
w.__fyrusW.colliders = [];
let d2 = V(0, 3, -8); w.__fyrusCamera(d2, h);
assert(d2.z < pulledZ && d2.z > -8, 'eases out gradually: ' + d2.z);
for (let i = 0; i < 120; i++) { d2 = V(0, 3, -8); w.__fyrusCamera(d2, h); }
assert(Math.abs(d2.z + 8) < 0.05, 'fully restored after clearing: ' + d2.z);
// look point inside a collider is ignored (no trap)
w.__fyrusW.colliders = [{ x: 0, z: 0, r: 3 }]; let d3 = V(0, 3, -8); w.__fyrusCamera(d3, h);
assert(Math.abs(d3.z + 8) < 0.05, 'inside-collider look point ignored');
// side collider not on the segment: no effect
w.__fyrusW.colliders = [{ x: 6, z: -4, r: 2 }]; let d4 = V(0, 3, -8); w.__fyrusCamera(d4, h);
assert(Math.abs(d4.z + 8) < 0.05, 'off-segment collider ignored');
// chaining: an earlier hook still runs first
w = load(''); let ran = 0; w.__fyrusCamera = () => { ran++; }; eval(src); w.__fyrusW = { colliders: [] }; w.__fyrusCamera(V(0, 3, -8), h);
assert(ran === 1, 'previous hook chained');
// kill switch
w = load('?p20off=camcol'); assert(!w.__fyrusCam20, 'kill switch');
console.log('camera20: all passed');
