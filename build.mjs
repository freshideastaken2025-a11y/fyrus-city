#!/usr/bin/env node
// Fyrus build: joins src/ into the two files the server runs (index.html, server.mjs).
//   node build.mjs          -> writes ./index.html and ./server.mjs
//   node build.mjs --check  -> builds in memory and only reports
// No dependencies. Edit files in src/, never the generated index.html / server.mjs by hand.
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
const root = path.dirname(url.fileURLToPath(import.meta.url));
const rd = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const check = process.argv.includes('--check');

const cman = JSON.parse(rd('src/client/manifest.json'));
const app = rd('src/client/head.js') + cman.map((p) => rd('src/client/' + p)).join('\n') + rd('src/client/tail.js');
const tpl = rd('src/client/template.html');
if (!tpl.includes('/*__FYRUS_APP__*/')) throw new Error('template.html lost its /*__FYRUS_APP__*/ marker');
const html = tpl.replace('/*__FYRUS_APP__*/', () => app);

const sman = JSON.parse(rd('src/server/manifest.json'));
const server = sman.map((p) => rd('src/server/' + p)).join('');

if (check) {
  console.log(`index.html ${(html.length / 1024).toFixed(0)} KB from ${cman.length} client files`);
  console.log(`server.mjs ${(server.length / 1024).toFixed(0)} KB from ${sman.length} server files`);
} else {
  fs.writeFileSync(path.join(root, 'index.html'), html);
  fs.writeFileSync(path.join(root, 'server.mjs'), server);
  console.log('built index.html and server.mjs');
}
