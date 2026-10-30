// Guard (25.7): the server bundle joins every module into ONE scope (app/build.mjs), so two top-level declarations
// with the same name silently replace each other. 24.2 added a presence `num(v, lo, hi, dflt)` that replaced
// furniture's `num(v, lim)` and every saved interior lost its x/z. This test fails on any duplicate top-level name.
const fs = require('fs'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', '..', 'app', 'server.mjs'), 'utf8');
const seen = {}, re = /^(?:var|let|const|function|async function|class)\s+([A-Za-z_$][\w$]*)/gm;
let m; while ((m = re.exec(s))) (seen[m[1]] = seen[m[1]] || []).push(s.slice(0, m.index).split('\n').length);
const dup = Object.entries(seen).filter(([, v]) => v.length > 1);
console.log((dup.length ? 'FAIL ' : 'PASS ') + 'server.mjs top-level names unique (' + Object.keys(seen).length + ' names)' + (dup.length ? ': ' + JSON.stringify(dup) : ''));
process.exit(dup.length ? 1 : 0);
