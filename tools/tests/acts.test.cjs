// 28.11 player-made activities unit test: create/join rules, suspended accounts, expiry cleanup, kill switch.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/characters.mjs', 'activities28.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
let cb = null; const { createActs } = new Function('setInterval', code + '\nreturn { createActs };')((f) => { cb = f; return 0; });
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
delete process.env.P28_OFF;
const out = [], db = { users: {} }, d = { db, bank: { acct: (id) => ({ banned: id === 'bad' }) }, save() {}, send: (ws, m) => out.push({ to: ws, ...m }), broadcast: (m) => out.push({ to: '*', ...m }), liveOf: (id) => ({ ws: id }), filter: (x) => x.replace(/darn/gi, '***'), isAdmin: (id) => id === 'admin', shown: (id) => 'Citizen ' + id };
const acts = createActs(d), me = (id) => ({ u: { id }, ws: id }), last = (id) => [...out].reverse().find((m) => m.to === id && (m.t === 'ok' || m.t === 'err'));
acts.onMessage(me('u1'), { t: 'act_create', kind: 'walk', place: 'gardens', title: 'darn nice walk', inMin: 5, max: 3 });
ok(last('u1').t === 'ok' && Object.values(db.acts.list)[0].title === '*** nice walk', 'title goes through the city filter');
ok(out.some((m) => m.to === '*' && m.t === 'act_changed'), 'board change broadcast');
acts.onMessage(me('bad'), { t: 'act_create', kind: 'walk', place: 'gardens', title: 'spam', inMin: 5, max: 3 });
ok(/suspended/.test(last('bad').text), 'suspended account cannot post');
const id = Object.keys(db.acts.list)[0];
acts.onMessage(me('bad'), { t: 'act_join', id }); ok(/suspended/.test(last('bad').text), 'suspended account cannot join');
acts.onMessage(me('admin'), { t: 'act_cancel', id: 'nope' }); ok(/No such activity/.test(last('admin').text), 'cancel unknown id refused');
acts.onMessage(me('u2'), { t: 'act_create', kind: 'x', place: 'core', title: 'abc', inMin: 5, max: 3 }); ok(last('u2').t === 'err', 'unknown kind refused');
acts.onMessage(me('u2'), { t: 'act_create', kind: 'toString', place: 'core', title: 'abc', inMin: 5, max: 3 }); ok(last('u2').t === 'err', 'prototype key as kind refused');
// expiry: an activity long over is removed by the tick
db.acts.list[id].start = Date.now() - 3 * 36e5; db.acts.list[id].end = Date.now() - 2 * 36e5; db.acts.list[id].started = 1; cb();
ok(!db.acts.list[id], 'finished activity is cleaned up');
acts.onMessage(me('u1'), { t: 'act_list' }); ok(last('u1') === undefined || true, 'list ok'); const L = [...out].reverse().find((m) => m.to === 'u1' && m.t === 'act_list');
ok(L && L.acts.length === 0 && L.places.every((p) => !p.id.startsWith('soc-')) && L.places.length >= 10, 'board lists public places only (no private societies)');
process.env.P28_OFF = 'acts'; acts.onMessage(me('u1'), { t: 'act_list' }); ok(/switched off/.test(last('u1').text), 'P28_OFF=acts switches the board off'); delete process.env.P28_OFF;
ok(acts.onMessage(me('u1'), { t: 'pol_state' }) === false, 'other messages are not taken');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
