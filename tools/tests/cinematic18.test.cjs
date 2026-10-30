// Phase 18: static checks of the cinematic layer (no browser): load order, kill switch, local-only assets, tiers.
const fs = require('fs'), path = require('path'), assert = require('assert');
const app = path.join(__dirname, '..', '..', 'app');
const src = fs.readFileSync(path.join(app, 'fyrus-cinematic18.js'), 'utf8');
const idx = fs.readFileSync(path.join(app, 'index.html'), 'utf8');
const i17 = idx.indexOf('/fyrus-engine17.js'), i18 = idx.indexOf('/fyrus-cinematic18.js');
assert(i17 > 0 && i18 > i17, 'cinematic18 must load after engine17');
assert(/off\('all'\)/.test(src), 'c18off=all kill switch');
['lighting', 'ibl', 'materials', 'windows', 'ground', 'trees', 'water', 'props', 'interior', 'facades'].forEach((k) => assert(src.includes("off('" + k + "')"), 'kill switch ' + k));
assert(!/https?:\/\//.test(src.replace(/\/\/.*$/gm, '')), 'no external URLs in code');
const tex = [...src.matchAll(/tex\('([a-z0-9_]+)'\)/g)].map((m) => m[1]);
const dyn = ['concrete', 'plaster', 'brick', 'pavers', 'asphalt', 'roof', 'metal', 'wood', 'grass'].flatMap((n) => [n + '_d', n + '_n']);
[...new Set(tex.concat(dyn, ['leaves_d']))].forEach((n) => assert(fs.existsSync(path.join(app, 'assets', 'cine18', n + '.png')), 'missing texture ' + n));
['cinematic', 'balanced', 'mobile', 'vr'].forEach((p) => assert(new RegExp(p + ':\\s*\\{').test(src), 'tier ' + p));
console.log('cinematic18 static checks ok (' + new Set(tex).size + ' textures referenced)');
