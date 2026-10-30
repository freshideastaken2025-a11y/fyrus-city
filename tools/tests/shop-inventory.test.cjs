// 26.4 shop inventory unit test: loads the real services data + jobs.mjs + bank.mjs with a fake host.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
process.env.RESTOCK_MS = '1000'; process.env.JOB_MIN_TASK_MS = '0'; process.env.JOB_COOLDOWN_MS = '0';
const code = ['shared/data/services.mjs', 'bank.mjs', 'jobs.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8').replace(/^import .*$/gm, '')).join('\n');
const { createBank, createJobs, svcById, doorOf, ITEMS } = new Function(code + '\nreturn { createBank, createJobs, svcById, doorOf, ITEMS };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const db = { users: {} }, out = [];
const host = { db, save() {}, send(ws, m) { out.push(m); }, liveOf: () => null, findByNumber: () => null, nameOf: (x) => x, clean: (s, n) => String(s || '').slice(0, n), shown: (x) => x, filter: (x) => x, xp() {} };
const bank = createBank(host); host.bank = bank;
const jobs = createJobs(host);
const shop = svcById('mobile'), door = doorOf(shop, 0);
const L = { u: { id: 'u1', name: 'Ana', joined: 0 }, ws: {}, scene: shop.interior ? 'gov:svc:mobile' : 'plaza', x: door.x, z: door.z };
host.liveOf = (id) => (id === 'u1' ? L : null);
bank.transfer('mint', 'u1', 100000, 'test funds');
const last = (t) => [...out].reverse().find((m) => m.t === t);
jobs.onMessage(L, { t: 'shop_stock', svc: 'mobile' });
const s0 = last('shop_stock');
ok(s0 && s0.stock.orbitx2 === 5 && s0.max.orbitx2 === 5, 'gadget shelf starts full at 5');
for (let i = 0; i < 5; i++) jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'orbitx2', qty: 1 });
const bal5 = bank.bal('u1');
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'orbitx2', qty: 1 });
const e6 = last('err');
ok(bank.bal('u1') === bal5 && /sold out/i.test(e6.text), 'sixth phone refused, not charged: "' + e6.text + '"');
ok(last('shop_stock').stock.orbitx2 === 0, 'stock message shows 0');
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'earbuds', qty: 10 });
ok(/Only 5 left/.test(last('err').text), 'asking for 10 earbuds with 5 on the shelf refused: "' + last('err').text + '"');
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'earbuds', qty: 5 });
ok(last('shop_stock').stock.earbuds === 0, 'earbuds: 5 of 5 sold in one go');
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'earbuds', qty: 1 }); const e7 = last('err').text;
ok(/sold out/i.test(e7), 'earbuds then sold out');
// restock over time: RESTOCK_MS = 1 s
const wait = (ms) => { const t = Date.now() + ms; while (Date.now() < t); };
wait(2100); jobs.onMessage(L, { t: 'shop_stock', svc: 'mobile' });
ok(last('shop_stock').stock.orbitx2 === 2, 'two deliveries after ~2 s: ' + last('shop_stock').stock.orbitx2);
// quantity larger than stock
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'orbitx2', qty: 3 });
ok(/Only 2 left/.test(last('err').text), 'asking for 3 with 2 on the shelf: "' + last('err').text + '"');
// not at the shop
jobs.onMessage({ ...L, scene: 'plaza', x: 0, z: 0 }, { t: 'shop_buy', svc: 'mobile', item: 'novapad', qty: 1 });
ok(/Visit/.test(last('err').text), 'buying away from the shop still refused');
// a finished work shift at the shop restocks +5 of every item (wage paid from the treasury, 26.2)
jobs.onMessage(L, { t: 'shop_stock', svc: 'mobile' }); const before = last('shop_stock').stock;
jobs.onMessage(L, { t: 'job_start', svc: 'mobile' });
for (let i = 0; i < 12; i++) { const me = [...out].reverse().find((m) => m.t === 'jobs_me' && m.shift); if (!me || !me.shift) break; const nx = me.shift.station; jobs.onMessage(L, { t: 'job_task', station: nx }); if (last('job_done')) break; }
jobs.onMessage(L, { t: 'shop_stock', svc: 'mobile' }); const after = last('shop_stock').stock;
ok(!!last('job_done') && after.orbitx2 === Math.min(5, before.orbitx2 + 5) && after.earbuds === Math.min(5, before.earbuds + 5), 'finished shift restocks the shop: phones ' + before.orbitx2 + ' -> ' + after.orbitx2 + ', earbuds ' + before.earbuds + ' -> ' + after.earbuds);
const A = bank.audit(); ok(A.drift === 0 && A.negative === 0, 'bank invariant holds');
process.exit(fails ? 1 : 0);
