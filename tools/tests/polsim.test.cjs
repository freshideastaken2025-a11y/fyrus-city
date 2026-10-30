// 28.6 political simulation: election calendar events fire once per cycle (persisted, restart-safe), never touch votes;
// AI answers candidates / parties / manifestos / calendar from politics.state(); kill switch P28_OFF=polsim.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/politics.mjs', 'shared/data/services.mjs', 'shared/data/characters.mjs', 'ai27.mjs', 'politics.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const mk = new Function('setInterval', 'setTimeout', code + '\nreturn { createPolitics, aiRoute, AI_CHARS };');
const { createPolitics, aiRoute, AI_CHARS } = mk(() => 0, (f) => 0);
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const LEN = 7 * 24 * 36e5; process.env.ELECTION_MS = String(LEN); delete process.env.P28_OFF;
function world(db) {
  const out = { news: [], casts: [], saves: 0 };
  const d = { db, bank: { acct: () => ({}) }, save: () => out.saves++, send: () => {}, broadcast: (m) => out.casts.push(m), liveOf: () => null, clean: (x) => x, filter: (x) => x, rid: () => 'r' + Math.random(), isAdmin: () => false, shown: (id) => 'Citizen ' + id, news: (k, t) => out.news.push(t) };
  return { pol: createPolitics(d), out };
}
const t0 = Date.now(), db = { users: { a: { joined: 0, email: 'a@x' } } };
let w = world(db); db.politics.cycle.start = t0;
db.politics.parties.p1 = { id: 'p1', name: 'Green Lanes Party', short: 'GLP', symbol: '★', color: '#2f6fe0', color2: '#fff', slogan: 'More parks', manifesto: 'Free metro on Fridays and a new park in Learn City.', leader: 'a', members: ['a'], at: t0, banned: null };
db.politics.cands.push({ id: 'a', city: 'learn', party: 'p1', statement: 'Parks', at: t0, dq: null });
const nomEnd = t0 + Math.round(LEN * 3 / 7);
w.pol.tick(t0 + 1000); ok(!w.out.news.some((n) => /Polls are open/.test(n)), 'no polls-open news during nominations');
w.pol.tick(nomEnd + 1000); ok(w.out.news.filter((n) => /Polls are open for Election 1: 1 candidate for Mayor and 1 party/.test(n)).length === 1, 'polls-open news once at voting start');
ok(w.out.casts.some((m) => m.t === 'note' && /Polls are open/.test(m.text)), 'polls-open note broadcast');
w.pol.tick(nomEnd + 5000); ok(w.out.news.filter((n) => /Polls are open/.test(n)).length === 1, 'not repeated on later ticks');
ok(db.politics.cycle.opened > 0, 'opened flag persisted on the cycle');
// restart: a new server instance on the same db does not repeat it
let w2 = world(db); w2.pol.tick(nomEnd + 9000); ok(!w2.out.news.some((n) => /Polls are open/.test(n)), 'restart does not repeat polls-open');
const end = t0 + LEN; w2.pol.tick(end - 30 * 6e4); ok(w2.out.news.filter((n) => /Last call: Election 1 polls close in 30 min/.test(n)).length === 1, 'last-call reminder 1 h before close');
w2.pol.tick(end - 10 * 6e4); ok(w2.out.news.filter((n) => /Last call/.test(n)).length === 1, 'reminder only once');
ok(Object.keys(db.politics.votes).length === 0 && db.politics.cands.length === 1, 'events never change votes or candidates');
const st = w2.pol.state(); ok(st.opens === nomEnd && st.opened && st.reminded, 'state carries the calendar (opens/opened/reminded)');
w2.pol.tick(end + 1000); ok(db.politics.cycle.n === 2 && !db.politics.cycle.opened && db.politics.results.length === 1, 'election closes, new cycle starts clean');
// kill switch
const db3 = { users: {} }; process.env.P28_OFF = 'polsim'; const w3 = world(db3); w3.pol.tick(db3.politics.cycle.start + Math.round(LEN * 3 / 7) + 1000);
ok(!w3.out.news.length && !db3.politics.cycle.opened, 'P28_OFF=polsim disables calendar events');
delete process.env.P28_OFF;
// AI answers from live data
const maya = AI_CHARS.find((c) => c.id === 'maya'), civ = { ...st, phase: 'voting', now: nomEnd + 9000 };
const A = (q) => aiRoute(q, maya, { pos: { x: 0, z: 0 }, civic: civ });
let r = A('who is standing for mayor?'); ok(r.intent === 'polsim-cands' && /Citizen a in Learn City \(GLP\)/.test(r.answer), 'candidates: ' + r.answer.slice(0, 80));
r = A('which parties are there?'); ok(r.intent === 'polsim-parties' && /Green Lanes Party \(GLP, 1 member\)/.test(r.answer), 'parties list');
r = A('what does GLP promise?'); ok(r.intent === 'polsim-party' && /Free metro on Fridays/.test(r.answer) && /not checked by the city/.test(r.answer), 'party manifesto by short code');
r = A('when do the polls close?'); ok(r.intent === 'polsim-calendar' && /polls are open now and close in 4 days/.test(r.answer), 'calendar: ' + r.answer.slice(0, 70));
r = A('is there a party at the club tonight?'); ok(!/^polsim/.test(r.intent), 'club party is not politics (' + r.intent + ')');
r = A('how do I vote?'); ok(r.intent === 'civic-election', '28.5 vote answer unchanged');
process.env.P28_OFF = 'polsim'; r = A('which parties are there?'); ok(!/^polsim/.test(r.intent), 'kill switch also turns off AI answers'); delete process.env.P28_OFF;
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
