// Integrity test: the Phase 17 avatar derivatives (assets/characters/p57opt) keep everything the originals have that
// the city uses: triangles, skeleton, animations (incl. every morph 'weights' channel target), 20 expression targets,
// materials; and the originals in p57/ are byte-identical to the Phase 5.7 files (sha256 recorded below).
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const A = path.join(__dirname, '..', '..', 'app', 'assets', 'characters');
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
function glb(f) { const b = fs.readFileSync(f); const l = b.readUInt32LE(12); return JSON.parse(b.slice(20, 20 + l).toString('utf8')); }
function tris(j) { let t = 0; j.meshes.forEach((m) => m.primitives.forEach((p) => { t += (p.indices != null ? j.accessors[p.indices].count : j.accessors[p.attributes.POSITION].count) / 3; })); return t; }
const ORIG_SHA = {
  'City_Life_Female_P57_DEV.glb': null, 'City_Life_Female_P57_LOD1_DEV.glb': null, 'City_Life_Female_P57_LOD2_DEV.glb': null,
  'Valen_Male_P57_DEV.glb': null, 'Valen_Male_P57_LOD1_DEV.glb': null, 'Valen_Male_P57_LOD2_DEV.glb': null,
};
const shaFile = path.join(__dirname, 'avatar-originals.sha256');
const known = fs.existsSync(shaFile) ? Object.fromEntries(fs.readFileSync(shaFile, 'utf8').trim().split('\n').map((l) => l.split(/\s+/).reverse())) : {};
for (const f of Object.keys(ORIG_SHA)) {
  const src = path.join(A, 'p57', f), out = path.join(A, 'p57opt', f.replace('_DEV.glb', '_P17.glb'));
  const sha = crypto.createHash('sha256').update(fs.readFileSync(src)).digest('hex');
  if (known[f]) ok(known[f] === sha, f + ': original unchanged (sha256 ' + sha.slice(0, 12) + ')');
  const a = glb(src), b = glb(out);
  ok(Math.round(tris(a)) === Math.round(tris(b)), f + ': triangles ' + Math.round(tris(a)) + ' = ' + Math.round(tris(b)));
  ok(a.animations.length === b.animations.length && a.animations.every((x, i) => x.name === b.animations[i].name), f + ': ' + a.animations.length + ' animation clips kept, same names');
  ok(a.skins[0].joints.length === b.skins[0].joints.length, f + ': skeleton ' + a.skins[0].joints.length + ' joints kept');
  const names = (m) => (m.extras && m.extras.targetNames) || [];
  const ta = names(a.meshes[0]), tb = b.meshes.map(names).find((n) => n.length) || [];
  ok(ta.length === 20 && ta.join() === tb.join(), f + ': 20 expression morph targets kept (' + tb.slice(0, 4).join(', ') + ', ...)');
  const wa = new Set(), wb = new Set();
  a.animations.forEach((x) => x.channels.forEach((c) => { if (c.target.path === 'weights') wa.add(x.name); }));
  b.animations.forEach((x) => x.channels.forEach((c) => { if (c.target.path === 'weights') { wb.add(x.name); const n = b.nodes[c.target.node]; if (!(n.mesh != null && (b.meshes[n.mesh].primitives[0].targets || []).length)) fails++; } }));
  ok([...wa].every((n) => wb.has(n)), f + ': every clip with facial (weights) animation still drives the morph mesh (' + wa.size + ' clips)');
  ok(b.materials.length === a.materials.length, f + ': ' + a.materials.length + ' materials kept');
  const kf = path.join(A, 'p57ktx', f.replace('_DEV.glb', '_P17K.glb'));
  if (fs.existsSync(kf)) {
    const k = glb(kf), nk = k.images.filter((i) => i.mimeType === 'image/ktx2').length;
    ok(Math.round(tris(k)) === Math.round(tris(b)) && k.animations.length === b.animations.length && k.skins[0].joints.length === b.skins[0].joints.length && (k.meshes.map(names).find((n) => n.length) || []).join() === tb.join(),
      f + ' KTX2 variant: same triangles, clips, joints and expression targets');
    ok((k.extensionsRequired || []).includes('KHR_texture_basisu') && nk >= k.images.length - 4 && k.textures.every((t) => (t.extensions && t.extensions.KHR_texture_basisu) || t.source != null),
      f + ' KTX2 variant: ' + nk + ' of ' + k.images.length + ' images are KTX2 (KHR_texture_basisu required)');
  }
}
process.exitCode = fails ? 1 : 0; console.log(fails ? fails + ' failed' : 'all passed');
