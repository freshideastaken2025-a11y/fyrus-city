// 26.5 purchase / refund workflow unit test (real services + bank + jobs code, fake host)
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
process.env.REFUND_MS = '1500'; process.env.RESTOCK_MS = '600000';
const code = ['shared/data/services.mjs', 'bank.mjs', 'jobs.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8').replace(/^import .*$/gm, '')).join('\n');
const { createBank, createJobs, svcById, doorOf } = new Function(code + '\nreturn { createBank, createJobs, svcById, doorOf };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const out = [], host = { db: { users: {} }, save() {}, send(ws, m) { out.push(m); }, findByNumber: () => null, nameOf: (x) => x, clean: (s, n) => String(s || '').slice(0, n), shown: (x) => x, filter: (x) => x, xp() {} };
const bank = createBank(host); host.bank = bank; const jobs = createJobs(host);
const shop = svcById('mobile'), snack = svcById('snacks');
const at = (s) => ({ u: { id: 'u1', name: 'Ana', joined: 0 }, ws: {}, scene: s.interior ? 'gov:svc:' + s.id : 'plaza', x: doorOf(s, 0).x, z: doorOf(s, 0).z });
let L = at(shop); host.liveOf = (id) => (id === 'u1' ? L : null);
bank.transfer('mint', 'u1', 5000, 'funds');
const last = (t) => [...out].reverse().find((m) => m.t === t), me = () => last('jobs_me');
const b0 = bank.bal('u1'), t0 = bank.bal('treasury');
jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'novapad', qty: 2 });
const rc = me().receipts[0];
ok(rc && rc.q === 2 && rc.price === 1300 && rc.refundable && bank.bal('u1') === b0 - 1300, 'purchase gives a refundable receipt: #' + (rc || {}).id + ' 2 x Nova Pad 1300');
ok(last('shop_stock').stock.novapad === 3, 'shelf 5 -> 3');
jobs.onMessage({ ...L, scene: 'plaza', x: 0, z: 0 }, { t: 'shop_refund', receipt: rc.id });
ok(/Bring it back/.test(last('err').text) && bank.bal('u1') === b0 - 1300, 'return away from the shop refused');
jobs.onMessage(L, { t: 'shop_refund', receipt: rc.id });
ok(bank.bal('u1') === b0 && bank.bal('treasury') === t0 && last('shop_stock').stock.novapad === 5 && !(me().bag.novapad), 'return at the shop: money back, shelf back to 5, items leave the bag');
jobs.onMessage(L, { t: 'shop_refund', receipt: rc.id });
ok(/already refunded/.test(last('err').text) && bank.bal('u1') === b0, 'second refund of the same receipt refused');
jobs.onMessage(L, { t: 'shop_refund', receipt: 99999 }); ok(/No such receipt/.test(last('err').text), 'unknown receipt refused');
jobs.onMessage(L, { t: 'shop_refund', receipt: '__proto__' }); ok(/No such receipt/.test(last('err').text), '__proto__ receipt refused');
// eaten food cannot be returned
L = at(snack); jobs.onMessage(L, { t: 'shop_buy', svc: 'snacks', item: 'chips', qty: 2 }); const rc2 = me().receipts[0];
jobs.onMessage(L, { t: 'shop_use', item: 'chips' }); jobs.onMessage(L, { t: 'shop_refund', receipt: rc2.id });
ok(/no longer have all/.test(last('err').text), 'eaten food: refund refused');
ok(me().receipts[0].refundable === false, 'receipt marked final in the list');
// window expiry
L = at(shop); jobs.onMessage(L, { t: 'shop_buy', svc: 'mobile', item: 'earbuds', qty: 1 }); const rc3 = me().receipts[0];
const end = Date.now() + 1700; while (Date.now() < end);
jobs.onMessage(L, { t: 'shop_refund', receipt: rc3.id });
ok(/within/.test(last('err').text), 'after the return window: refused ("' + last('err').text + '")');
// someone else's receipt id
jobs.onMessage({ ...L, u: { id: 'u2', name: 'Bo', joined: 0 } }, { t: 'shop_refund', receipt: rc3.id });
ok(/No such receipt/.test(last('err').text), "another citizen's receipt is not theirs");
const A = bank.audit(); ok(A.drift === 0 && A.negative === 0, 'bank invariant holds');
process.exit(fails ? 1 : 0);
