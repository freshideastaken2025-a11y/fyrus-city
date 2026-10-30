// 28.7 career pathways unit test (real services + bank + jobs code, fake host): levels from lifetime shifts + certificates,
// bonus inside the 35 % cap, promotion only on the server, kill switch P28_OFF=career, treasury invariant holds.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
process.env.JOB_MIN_TASK_MS = '0'; process.env.JOB_COOLDOWN_MS = '0'; process.env.JOB_DAILY = '1000'; process.env.MINT_CAP_FALLBACK = '1000000';
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
const yday = () => new Date(Date.now() - 864e5).toISOString().slice(0, 10);
host.certCount = () => 0; delete process.env.P28_OFF;
let me0 = (jobs.onMessage(L, { t: 'jobs_me' }), last('jobs_me'));
ok(me0.career && me0.career.level === 'trainee' && me0.career.next.name === 'Junior worker' && me0.career.next.needShifts === 5, 'new worker is a Trainee, 5 shifts to Junior');
let d, b0, promo = null;
for (let i = 0; i < 5; i++) { host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 }; b0 = bank.bal('w1'); d = shift(false); if (d.promoted) promo = { i, name: d.promoted, pct: d.careerPct, pay: d.pay }; }
ok(promo && promo.i === 4 && promo.name === 'Junior worker' && promo.pct === 0 && promo.pay === Math.round(base * 1.1), 'promoted to Junior on the 5th shift (bonus starts next shift)');
host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 }; b0 = bank.bal('w1'); d = shift(false);
ok(d.careerPct === 3 && d.pay === Math.round(base * 1.13) && bank.bal('w1') - b0 === d.pay, `Junior +3%: ${d.pay} paid ${bank.bal('w1') - b0}`);
for (let i = 0; i < 12; i++) { host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 }; shift(false); }
me0 = (jobs.onMessage(L, { t: 'jobs_me' }), last('jobs_me'));
ok(me0.career.shifts === 18 && me0.career.level === 'junior' && me0.career.next.needCerts === 1 && me0.career.next.needShifts === 0, '18 shifts but no certificate -> still Junior, needs 1 certificate');
host.certCount = () => 1; host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 }; d = shift(false);
ok(d.careerPct === 6 && d.career === 'Skilled worker' && d.pay === Math.round(base * 1.16), 'certificate earned -> Skilled +6%');
// cap: 6-day streak (+25) + clean (+10) = 35 -> no room for the career bonus; max per shift never rises
host.db.jobs.streak.w1 = { day: yday(), n: 5 }; d = shift(false);
ok(d.streakPct === 25 && d.cleanPct === 10 && d.careerPct === 0 && d.pay === Math.round(base * 1.35), 'career bonus stays inside the existing 35% cap: ' + d.pay);
host.db.jobs.streak.w1 = { day: yday(), n: 3 }; d = shift(false);
ok(d.streakPct === 15 && d.careerPct === 6 && d.pay === Math.round(base * 1.31), 'streak 15 + clean 10 + career 6 = 31%');
host.db.jobs.streak.w1 = { day: yday(), n: 4 }; d = shift(false);
ok(d.streakPct === 20 && d.careerPct === 5 && d.pay === Math.round(base * 1.35), 'career bonus trimmed to fit the cap (20+10+5)');
// client cannot inject a level or bonus
host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 };
jobs.onMessage(L, { t: 'job_start', svc: s.id, career: 'senior', careerPct: 90, pct: 90 });
for (let i = 0; i < 12; i++) { const m = last('jobs_me'); if (!m || !m.shift) break; jobs.onMessage(L, { t: 'job_task', station: m.shift.station, careerPct: 90, level: 'senior' }); }
d = last('job_done'); ok(d.careerPct === 6 && d.career === 'Skilled worker', 'client-sent level/bonus fields are ignored');
// kill switch
process.env.P28_OFF = 'career'; const n0 = host.db.jobs.career.w1.shifts; host.db.jobs.streak.w1 = { day: '2020-01-01', n: 1 }; d = shift(false);
me0 = (jobs.onMessage(L, { t: 'jobs_me' }), last('jobs_me'));
ok(d.careerPct === 0 && !d.career && host.db.jobs.career.w1.shifts === n0 && me0.career.off === true && d.pay === Math.round(base * 1.1), 'P28_OFF=career: plain 26.6 pay, nothing counted');
delete process.env.P28_OFF;
ok(bank.audit().drift === 0, 'bank invariant holds (no money created outside the mint path)');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
