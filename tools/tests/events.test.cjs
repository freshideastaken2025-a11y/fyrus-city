// 28.10 social events: one "starting soon" note per event (host + ticket holders), saved flag (restart-safe), not for
// people without a ticket; the existing "starting now" + news still work; AI lists real bookings; kill switch.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/media.mjs', 'shared/data/characters.mjs', 'ai27.mjs', 'halls.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
let cb = null;
const { createHalls, aiRoute, AI_CHARS } = new Function('setInterval', 'HOST_SHARE', 'own', code + '\nreturn { createHalls, aiRoute, AI_CHARS };')((f) => { cb = f; return 0; }, 0.9, (o, k) => (Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined));
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
delete process.env.P28_OFF;
const notes = [], news = [], live = (id) => ({ ws: id });
const now = Date.now(), db = { halls: { events: {} } };
db.halls.events.e1 = { id: 'e1', hall: 'grand', host: 'h', hostName: 'Host', title: 'Chai & Code meetup', desc: '', start: now + 5 * 6e4, end: now + 65 * 6e4, price: 0, tickets: ['t1', 't2'], status: 'scheduled' };
db.halls.events.e2 = { id: 'e2', hall: 'skyline', host: 'h2', hostName: 'Host2', title: 'Late lounge', desc: '', start: now + 3 * 36e5, end: now + 4 * 36e5, price: 20, tickets: [], status: 'scheduled' };
const d = { db, bank: { transfer() {} }, save() {}, send: (ws, m) => notes.push({ to: ws, ...m }), broadcast() {}, liveOf: live, clean: (x) => x, filter: (x) => x, rid: () => 'r', isAdmin: () => false, news: (k, t) => news.push(t) };
createHalls(d); cb();
const soon = notes.filter((n) => /starts in 5 min in the Grand Conference Hall/.test(n.text));
ok(soon.length === 3 && ['h', 't1', 't2'].every((id) => soon.some((n) => n.to === id)), 'starting-soon note to host + 2 ticket holders');
ok(!notes.some((n) => /Late lounge/.test(n.text)), 'event 3 h away gets no note yet');
ok(db.halls.events.e1.soon > 0, 'soon flag saved on the event');
cb(); ok(notes.filter((n) => /starts in/.test(n.text)).length === 3, 'not repeated on the next tick');
createHalls(d); cb(); ok(notes.filter((n) => /starts in/.test(n.text)).length === 3, 'restart does not repeat it');
db.halls.events.e1.start = Date.now() - 1000; cb();
ok(notes.some((n) => /is starting now/.test(n.text)) && news.some((t) => /Now live: "Chai & Code meetup"/.test(t)), 'existing "starting now" note + news unchanged');
process.env.P28_OFF = 'events'; db.halls.events.e2.start = Date.now() + 2 * 6e4; cb(); ok(!db.halls.events.e2.soon, 'P28_OFF=events: no starting-soon note'); delete process.env.P28_OFF;
// AI
const maya = AI_CHARS.find((c) => c.id === 'maya');
const evs = Object.values(db.halls.events).filter((e) => e.status === 'scheduled').sort((a, b) => a.start - b.start).map((e) => ({ title: e.title, start: e.start, end: e.end, price: e.price, hallName: e.hall === 'grand' ? 'Grand Conference Hall' : 'Skyline Lounge' }));
let r = aiRoute("what's on today?", maya, { events: evs });
ok(r.intent === 'events' && /"Chai & Code meetup" in the Grand Conference Hall \(live now, free\)/.test(r.answer) && /"Late lounge" in the Skyline Lounge \(in \d+ min, 20 FYC ticket\)/.test(r.answer), 'AI lists real bookings: ' + r.answer.slice(0, 120));
r = aiRoute('any events?', maya, { events: [] }); ok(r.intent === 'events' && /No events are booked/.test(r.answer), 'AI: none booked');
ok(aiRoute('where is the conference center?', maya, { events: evs, pos: { x: 0, z: 0 } }).intent === 'directions', 'directions to the halls unchanged');
ok(aiRoute('what can I do for fun?', maya, { events: evs }).intent === 'leisure', '28.9 leisure answer unchanged');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
