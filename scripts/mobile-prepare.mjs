#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const root = path.dirname(url.fileURLToPath(import.meta.url));
const project = path.dirname(root);
const web = path.join(project, 'mobile-web');
fs.mkdirSync(web, { recursive: true });
fs.copyFileSync(path.join(project, 'index.html'), path.join(web, 'index.html'));
// Keep the mobile bundle explicit and reviewable. The validator below also
// scans the copied HTML/JS, so a newly referenced local asset cannot silently
// disappear from the Capacitor package.
const assets = [
  'fyrus-plus.js', 'fyrus-world.js', 'fyrus-intro.js', 'fyrus-country.js',
  'fyrus-hall.js', 'fyrus-home3d.js', 'fyrus-mall3d.js', 'fyrus-perf.js',
  'fyrus-atmos.js', 'fyrus-hud.js', 'fyrus-vectorbay.js', 'fyrus-arena.js'
];
for (const file of assets) fs.copyFileSync(path.join(project, file), path.join(web, file));
const avatarSource = path.join(project, 'assets', 'characters', 'glb');
const avatarWeb = path.join(web, 'assets', 'characters', 'glb');
fs.mkdirSync(avatarWeb, { recursive: true });
for (const file of fs.readdirSync(avatarSource).filter((f) => f.endsWith('.glb'))) fs.copyFileSync(path.join(avatarSource, file), path.join(avatarWeb, file));
fs.copyFileSync(path.join(project, 'fyrus-avatar.js'), path.join(web, 'fyrus-avatar.js'));
fs.copyFileSync(path.join(project, 'fyrus-gltf-loader.js'), path.join(web, 'fyrus-gltf-loader.js'));
fs.copyFileSync(path.join(project, 'fyrus-avatar-creator.js'), path.join(web, 'fyrus-avatar-creator.js'));
console.log(`prepared mobile web bundle: index.html + ${assets.length} gameplay scripts`);
