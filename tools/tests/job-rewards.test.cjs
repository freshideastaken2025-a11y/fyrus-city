// 26.6 job rewards unit test (real services + bank + jobs code, fake host)
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
process.env.JOB_MIN_TASK_MS = '0'; process.env.JOB_COOLDOWN_MS = '0'; process.env.JOB_DAILY = '4'; process.env.MINT_CAP_FALLBACK = '1000000';
const code = ['shared/data/services.mjs', 'bank.mjs', 'jobs.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8').replace(/^import .*$/gm, '')).join('\n');
const { createBank, createJobs, svcById, doorOf } = new Function(code + '\nreturn { createBank, createJobs, svcById, doorOf };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const out = [], host = { db: { users: {} }, save() {}, send(ws, m) { out.push(m); }, findByNumber: () => null, nameOf: (x) => x, clean: (s, n) => String(s || '').slice(0, n), shown: (x) => x, filter: (x) => x, xp() {} };
const bank = createBank(host); host.bank = bank; const jobs = createJobs(host);
const s = svcById('snacks'), L = { u: { id: 'w1', name: 'Wes', joined: 0 }, ws: {}, scene: s.interior ? 'gov:svc:' + s.id : 'plaza', x: doorOf(s, 0).x, z: doorOf(s, 0).z };
host.liveOf = (id) => (id === 'w1' ? L : null);
const last = (t) => [...out].reverse().find((m) => m.t === t);
function shift(mistake) {
  const n0 = out.filter((m) => m.t === 'job_done').length;
  jobs.onMessage(L, { t: 'job_start', svc: s.id });
  if (last('err') && out[out.length - 1].t === 'err') return null;
  for (let i = 0; i < 12; i++) {
    const me = last('jobs_me'); if (!me || !me.shift) break;
    if (mistake && i === 0) jobs.onMessage(L, { t: 'job_task', station: (me.shift.station + 1) % s.job.stations.length });
    jobs.onMessage(L, { t: 'job_task', station: me.shift.station });
    if (out.filter((m) => m.t === 'job_done').length > n0) break;
  }
  return out.filter((m) => m.t === 'job_done').length > n0 ? last('job_done') : null;
}
const base = s.job.pay;
let b0 = bank.bal('w1'), d = shift(false);
ok(d && d.pay === Math.round(base * 1.1) && d.cleanPct === 10 && d.streakDays === 1 && bank.bal('w1') - b0 === d.pay, `clean first shift: ${base} + 10% = ${d && d.pay}, paid ${bank.bal('w1') - b0}`);
b0 = bank.bal('w1'); d = shift(true);
ok(d && d.pay === base && d.cleanPct === 0, `shift with a wrong task: plain wage ${d && d.pay}`);
// worked 3 days in a row before today -> 4-day streak today
host.db.jobs.streak.w1 = { day: new Date(Date.now() - 864e5).toISOString().slice(0, 10), n: 3 };
d = shift(false);
ok(d && d.streakDays === 4 && d.streakPct === 15 && d.pay === Math.round(base * 1.25), `4-day streak: +15% streak +10% clean = ${d && d.pay}`);
host.db.jobs.streak.w1 = { day: new Date(Date.now() - 864e5).toISOString().slice(0, 10), n: 20 };
host.db.jobs.day.w1.shifts = 0; d = shift(false);
ok(d && d.streakPct === 25, 'streak bonus capped at +25%');
for (let i = 0; i < 6; i++) shift(false);
ok(/shifts today/.test(last('err').text), 'daily shift cap still applies: "' + last('err').text + '"');
// a gap resets the streak
host.db.jobs.streak.w1 = { day: '2020-01-01', n: 9 }; host.db.jobs.day.w1.shifts = 0; d = shift(false);
ok(d && d.streakDays === 1 && d.streakPct === 0, 'a missed day resets the streak');
ok(bank.audit().mintToday.by.fallback > 0 && bank.audit().drift === 0, 'wages came from the Central Bank fallback (empty treasury) within the cap; invariant holds');
process.exit(fails ? 1 : 0);
