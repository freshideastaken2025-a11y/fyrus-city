// 26.2 currency rules unit test: loads app/src/server/bank.mjs with a fake host and checks the capped mint, the
// treasury-first payouts, owed wages paid when the treasury refills, and the money-supply invariant.
const fs = require('fs'), path = require('path');
process.env.MINT_CAP_BETA = '5000'; process.env.MINT_CAP_FALLBACK = '1000';
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'app', 'src', 'server', 'bank.mjs'), 'utf8');
const createBank = new Function(src + '\nreturn createBank;')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const db = {}, sent = [];
const bank = createBank({ db, save() {}, send(ws, m) { sent.push(m); }, liveOf: () => null, findByNumber: () => null, nameOf: (x) => x, clean: (s, n) => String(s || '').slice(0, n) });
const me = (id) => ({ u: { id, name: id, joined: 0 }, ws: {} });
for (const id of ['a', 'b', 'c', 'd']) bank.onMessage(me(id), { t: 'bank_hello', local: 0 });
for (let i = 0; i < 10; i++) for (const id of ['a', 'b', 'c', 'd']) bank.onMessage(me(id), { t: 'bank_op', amount: 1500, label: 'Shop demo checkout' });
const A1 = bank.audit();
ok(A1.mintToday.by.beta === 5000, 'beta test credit capped server-wide per day: ' + A1.mintToday.by.beta + ' / 5000');
ok(['a', 'b', 'c', 'd'].reduce((s, id) => s + bank.bal(id), 0) === 5000, 'balances equal the capped beta mint');
// treasury empty: wages 800 -> minted (fallback cap 1000), then 800 more -> 200 minted, 600 owed
let r = bank.payFromTreasury('a', 800, 'Wage'); ok(r.paid === 800 && r.owed === 0, 'empty treasury: wage minted within the fallback cap');
r = bank.payFromTreasury('b', 800, 'Wage'); ok(r.paid === 200 && r.owed === 600, 'fallback cap reached: 200 paid, 600 owed');
const b0 = bank.bal('b');
bank.transfer('c', 'treasury', 1000, 'Shop purchase');
ok(bank.bal('b') === b0 + 600 && bank.bal('treasury') === 400 && bank.audit().owed === 0, 'owed wages paid first when money reaches the treasury');
bank.transfer('d', 'treasury', 500, 'Fee'); r = bank.payFromTreasury('d', 300, 'Wage');
ok(r.paid === 300 && bank.audit().mintToday.by.fallback === 1000, 'treasury with money pays without minting');
const A = bank.audit();
ok(A.drift === 0 && A.negative === 0, 'invariant: total ' + A.total + ' = minted ' + A.minted + ' - burned ' + A.burned + ', no negative balances');
bank.onMessage(me('a'), { t: 'bank_op', amount: 1e9, label: 'Sold my car' });
ok(bank.audit().minted === A.minted, 'client-claimed income still refused');
process.exit(fails ? 1 : 0);
