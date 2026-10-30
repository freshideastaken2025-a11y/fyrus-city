#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { execFileSync } from 'node:child_process';
import url from 'node:url';

const project = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const webDir = path.join(project, 'mobile-web');
const apk = process.argv[2] === '--apk' ? process.argv[3] : null;

function localPath(ref) {
  if (!ref || /^(?:[a-z]+:|\/\/|#|data:|blob:|javascript:)/i.test(ref)) return null;
  const clean = ref.split(/[?#]/, 1)[0].replace(/^\/+/, '');
  if (!clean || clean.startsWith('.') || clean.includes('..')) return null;
  return clean;
}

function filesUnder(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(full));
    else if (/\.(?:html?|js|css)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const refs = new Set();
for (const file of filesUnder(webDir)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/(?:src|href)\s*=\s*["']([^"']+)|["'](\/?fyrus-[\w-]+\.js(?:\?[^"']*)?|\/?assets\/[^"']+\.(?:glb|gltf|png|jpe?g|webp|woff2?|ttf)(?:\?[^"']*)?)["']/gi)) {
    const ref = localPath(match[1] || match[2]);
    if (ref) refs.add(ref);
  }
}

const missingWeb = [...refs].filter(ref => !fs.existsSync(path.join(webDir, ref)));
let missingApk = [];
let apkEntries = [];
if (apk) {
  apkEntries = execFileSync('unzip', ['-Z1', apk], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  const packaged = new Set(apkEntries.map(entry => entry.replace(/^assets\/public\//, '')));
  missingApk = [...refs].filter(ref => !packaged.has(ref));
}

const result = { webDir, references: [...refs].sort(), missingWeb, apk, missingApk };
console.log(JSON.stringify(result, null, 2));
if (missingWeb.length || missingApk.length) process.exitCode = 1;
