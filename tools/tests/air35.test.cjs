// Phase 35 airport tests: ticket booking is charged once, state transitions, recovery, wiring of the game patches.
// Run: node tools/tests/air35.test.cjs   (from the project root)
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..', '..'), APP = fs.existsSync(path.join(ROOT, 'app', 'fyrus-airport35.js')) ? path.join(ROOT, 'app') : ROOT;   // project copy or release repo
let pass = 0, fail = 0;
function ok(c, m) { if (c) { pass++; } else { fail++; console.log('FAIL', m); } }

function sandbox(opts) {
  opts = opts || {};
  const store = opts.store || {};
  const state = { session: { userId: 'u1' }, wallets: { u1: opts.balance == null ? 500 : opts.balance }, txns: [] };
  const calls = [];
  const win = {
    __fyrus: { getState: () => state },
    __fyrusPay: opts.noPay ? undefined : function (amt, label) {
      calls.push([amt, label]);
      if (opts.payThrows) throw new Error('boom');
      if (state.wallets.u1 < amt) return false;
      state.wallets.u1 -= amt; state.txns.push({ id: 't' + calls.length, userId: 'u1', amount: -amt, label: label, at: Date.now() }); return true;
    }
  };
  const ctx = {
    window: win, console: { log() {}, warn() {} }, location: { search: opts.search || '' }, URLSearchParams,
    localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    document: { getElementById: () => null, createElement: () => ({ style: {}, appendChild() {}, setAttribute() {}, addEventListener() {} }), head: { appendChild() {} }, body: { appendChild() {} }, addEventListener() {}, removeEventListener() {}, querySelector: () => null },
    requestAnimationFrame: () => 0, performance: { now: () => 0 }, setTimeout: () => 0, Date, Math, JSON
  };
  win.window = win; ctx.self = win;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(APP, 'fyrus-airport35.js'), 'utf8'), ctx, { filename: 'fyrus-airport35.js' });
  return { API: win.__fyrusAir35, state, calls, store, win };
}

// --- kill switch ---
{ const s = sandbox({ search: '?a35off=1' }); ok(!s.API, 'kill switch ?a35off=1 leaves no API'); ok(!s.win.__fyrusAirCurb, 'kill switch: no curb override'); }

// --- routes: only real cities ---
{ const { API } = sandbox();
  const codes = API.SPECS.map((s) => s.code).sort().join(',');
  ok(codes === 'FCI,VBX', 'exactly two airports: Fyrus Core + Vector Bay (' + codes + ')');
  ok(API.ROUTES.every((r) => API.SPECS.some((s) => s.code === r.from) && API.SPECS.some((s) => s.code === r.to)), 'every route connects two real airports');
  ok(API.ROUTES.some((r) => r.from === 'FCI' && r.to === 'VBX') && API.ROUTES.some((r) => r.from === 'VBX' && r.to === 'FCI'), 'FCI <-> VBX both directions');
}

// --- booking charges once ---
{ const s = sandbox(); const API = s.API;
  const r1 = API.book('FY401', 'economy');
  ok(r1.ok && r1.ticket && r1.ticket.status === 'booked', 'first booking succeeds');
  ok(s.calls.length === 1 && s.calls[0][0] === 60, 'charged 60 FYC once');
  const r2 = API.book('FY401', 'economy'), r3 = API.book('FY100', 'business');
  ok(!r2.ok && r2.reason === 'active' && !r3.ok, 'second booking refused while a ticket is active');
  ok(s.calls.length === 1 && s.state.wallets.u1 === 440, 'still exactly one charge (balance 440)');
  ok(r1.ticket.seat && r1.ticket.gate === 'A1' && r1.ticket.from === 'FCI' && r1.ticket.to === 'VBX', 'ticket has seat, gate, route');
  // state machine
  ok(API.cancel.length === 0, 'cancel api');
  const t = API.ticket(); t.status = 'checked'; s.store['fyrus.air35.u1.ticket'] = JSON.stringify(t);
  ok(!API.cancel(), 'checked-in ticket cannot be cancelled');
}

// --- busy lock (re-entrant click while paying) ---
{ const s = sandbox(); const API = s.API; let inner = null;
  s.win.__fyrusPay = function (amt, label) { inner = API.book('FY401', 'economy'); s.state.wallets.u1 -= amt; s.state.txns.push({ label, amount: -amt }); return true; };
  const r = API.book('FY401', 'economy');
  ok(r.ok && inner && !inner.ok && (inner.reason === 'busy' || inner.reason === 'pending'), 're-entrant booking during payment is refused (' + (inner && inner.reason) + ')');
  ok(s.state.txns.length === 1, 'one wallet transaction');
}

// --- failed / refused payment leaves no ticket and no pending marker ---
{ const s = sandbox({ balance: 10 }); const r = s.API.book('FY401');
  ok(!r.ok && r.reason === 'payment' && !s.API.ticket(), 'insufficient funds: no ticket');
  ok(!JSON.parse(s.store['fyrus.air35.u1.pending'] || 'null'), 'no pending marker left');
}
{ const s = sandbox({ payThrows: true }); let threw = false; try { s.API.book('FY401'); } catch (e) { threw = true; }
  ok(!s.API.ticket() && !s.API._busy, 'payment exception: no ticket, lock released (threw=' + threw + ')'); }
{ const s = sandbox({ noPay: true }); const r = s.API.book('FY401'); ok(!r.ok && !s.API.ticket(), 'no payment function: booking refused'); }

// --- crash between charge and ticket write: recovered from the wallet line, never charged twice ---
{ const store = {};
  const s1 = sandbox({ store });
  // simulate: pending written + charged, but the tab died before the ticket was saved
  const label = 'Fyrus Airlines FY401 FCI-VBX ticket TCRASH1';
  store['fyrus.air35.u1.pending'] = JSON.stringify({ id: 'TCRASH1', route: 'FY401', cls: 'economy', fare: 60, label, ts: Date.now() });
  s1.state.txns.push({ label, amount: -60 }); s1.state.wallets.u1 -= 60;
  s1.API.recover();
  const t = s1.API.ticket();
  ok(t && t.id === 'TCRASH1' && t.status === 'booked', 'pending purchase with a wallet line becomes the ticket');
  ok(s1.calls.length === 0, 'recovery does not charge again');
}
{ const store = {}; const s = sandbox({ store });
  store['fyrus.air35.u1.pending'] = JSON.stringify({ id: 'TX', route: 'FY401', cls: 'economy', fare: 60, label: 'Fyrus Airlines FY401 FCI-VBX ticket TX', ts: Date.now() });
  const r = s.API.book('FY401');
  ok(!r.ok && r.reason === 'pending' && s.calls.length === 0, 'fresh pending purchase blocks a second charge');
}
// --- a ticket left in flight by a closed tab is consumed, not reusable ---
{ const store = {}; const s = sandbox({ store });
  store['fyrus.air35.u1.ticket'] = JSON.stringify({ id: 'T1', flight: 'FY401', route: 'FY401', from: 'FCI', to: 'VBX', cls: 'economy', gate: 'A1', seat: '9A', status: 'inflight' });
  s.API.recover(); const t = s.API.ticket();
  ok(t.status === 'arrived', 'inflight ticket after reload becomes arrived (consumed)');
  const r = s.API.book('FY402'); ok(r.ok, 'arrived ticket does not block a new booking'); ok(s.calls.length === 1, 'new booking charged once');
}
// --- per-user storage ---
{ const store = {}; const s = sandbox({ store }); s.API.book('FY401');
  ok(Object.keys(store).some((k) => k.indexOf('fyrus.air35.u1.') === 0), 'tickets are stored per user id'); }

// --- schedule is honest about other cities ---
{ const { API } = sandbox(); const rows = API.schedule({ code: 'FCI' });
  ok(rows.some((r) => /Other cities/.test(r.place) && /soon/i.test(r.status)), 'board lists other cities as coming soon');
  ok(rows.filter((r) => !r.arr && r.flight !== '—').every((r) => API.ROUTES.some((x) => x.id === r.flight)), 'departures only real routes'); }

// --- 35.2 server tickets: the real bank code behind a fake connection ---
{
  const SD = path.join(APP, 'src', 'server');
  const code = ['bank.mjs'].map((f) => fs.readFileSync(path.join(SD, f), 'utf8').replace(/^import .*$/gm, '')).join('\n');
  const { createBank } = new Function(code + '\nreturn { createBank };')();
  const out = [], host = { db: { users: {} }, save() {}, send(ws, m) { out.push([ws, m]); }, findByNumber: () => null, nameOf: (x) => x, clean: (s2, n) => String(s2 || '').slice(0, n), shown: (x) => x, filter: (x) => x, xp() {} };
  const bank = createBank(host);
  const ws1 = { id: 'tab1' }, me = { u: { id: 'u1', name: 'Ana' }, ws: ws1 };
  host.liveOf = (id) => (id === 'u1' ? me : null);
  bank.transfer('mint', 'u1', 500, 'funds');
  const client = (store) => {
    const sb = sandbox({ store });
    const deliver = () => { while (out.length) { const [w, m] = out.shift(); if (m.t === 'bank_air' && sb.win.__fyrusAirNet) sb.win.__fyrusAirNet(m); } };
    sb.win.__fyrusNetObj = { status: 'online', ws: {}, send(m) { bank.onMessage(me, m); deliver(); } };
    sb.deliver = deliver; return sb;
  };
  const c1 = client({}), A1 = c1.API, t0 = bank.bal('treasury');
  const r1 = A1.book('FY401', 'economy');
  ok(r1.ok && r1.pending, 'online booking goes to the server');
  const tk = A1.ticket();
  ok(tk && tk.srv && tk.status === 'booked' && tk.gate === 'A1' && tk.fare === 60, 'server ticket adopted (gate A1, 60 FYC)');
  ok(bank.bal('u1') === 440 && bank.bal('treasury') === t0 + 60, 'server charged 60 FYC once (bank balance 440)');
  ok(c1.calls.length === 0, 'no client-side wallet debit when the server handles the ticket');
  // a duplicated / retried request with the same id is answered without a second charge
  bank.onMessage(me, { t: 'bank_air', op: 'book', id: tk.id, route: 'FY401', cls: 'economy' }); c1.deliver();
  ok(bank.bal('u1') === 440, 'same ticket id again: no second charge');
  const r2 = A1.book('FY402', 'economy'); ok(!r2.ok && r2.reason === 'active' && bank.bal('u1') === 440, 'second ticket refused while one is active');
  bank.onMessage(me, { t: 'bank_air', op: 'book', id: 'TOTHER12345', route: 'FY402', cls: 'economy' }); c1.deliver();
  ok(bank.bal('u1') === 440, 'server refuses a second active ticket even if the client asks directly');
  // the fare is the server's, not the client's
  const ledgerHas = (txt) => JSON.stringify(bank.history('u1', 100)).indexOf(txt) >= 0;
  ok(ledgerHas('ticket ' + tk.id), 'bank ledger line names the ticket');
  // status flow is synced and only moves forward
  const step = (st2) => { const t = A1.ticket(); t.status = st2; c1.store['fyrus.air35.u1.ticket'] = JSON.stringify(t); A1._tk = t; };
  A1.checkIn({ code: 'FCI', spec: { name: 'FCI', city: 'Fyrus Core' } });
  const srvCur = () => { let x = null; bank.onMessage(me, { t: 'bank_air', op: 'get' }); const m = out.find((q) => q[1].t === 'bank_air'); out.length = 0; return m && m[1].ticket; };
  ok(srvCur().status === 'checked', 'check-in recorded on the server');
  bank.onMessage(me, { t: 'bank_air', op: 'set', id: tk.id, status: 'booked' }); c1.deliver();
  ok(srvCur().status === 'checked', 'status cannot go backwards');
  ['cleared', 'inflight', 'arrived'].forEach((st2) => bank.onMessage(me, { t: 'bank_air', op: 'set', id: tk.id, status: st2 })); out.length = 0;
  ok(srvCur().status === 'arrived', 'cleared -> inflight -> arrived accepted');
  // another device (empty storage) sees the same ticket from the server
  const c2 = client({}); c2.API.recover();
  ok(c2.API.ticket() && c2.API.ticket().id === tk.id && c2.API.ticket().status === 'arrived', 'second device adopts the server ticket');
  bank.onMessage(me, { t: 'bank_air', op: 'set', id: tk.id, status: 'done' }); out.length = 0;
  ok(srvCur() === null, 'done: the ticket leaves the active slot');
  // client-supplied fare / unknown route / no funds
  bank.onMessage(me, { t: 'bank_air', op: 'book', id: 'TFARE1234567', route: 'FY100', cls: 'economy', fare: 1, amount: 1 }); out.length = 0;
  ok(bank.bal('u1') === 400, 'fare comes from the server table (40), not the client');
  bank.onMessage(me, { t: 'bank_air', op: 'set', id: 'TFARE1234567', status: 'cancelled' }); out.length = 0;
  bank.onMessage(me, { t: 'bank_air', op: 'book', id: 'TBADROUTE123', route: 'FY999' }); out.length = 0;
  ok(bank.bal('u1') === 400 && srvCur() === null, 'unknown route refused, nothing charged');
  bank.onMessage(me, { t: 'bank_air', op: 'book', id: 'bad id', route: 'FY401' }); out.length = 0; ok(bank.bal('u1') === 400, 'malformed ticket id refused');
  bank.transfer('u1', 'treasury', 390, 'spend'); bank.onMessage(me, { t: 'bank_air', op: 'book', id: 'TPOOR1234567', route: 'FY401' }); out.length = 0;
  ok(bank.bal('u1') === 10 && srvCur() === null, 'not enough FYC: no ticket, no charge');
  // a pending server booking survives a reload and is re-sent with the same id
  const store3 = {}; const c3 = client(store3); bank.transfer('mint', 'u1', 200, 'funds');
  c3.win.__fyrusNetObj.send = function () {};   // the reply is lost
  const r3 = c3.API.book('FY401'); const pid = r3.id;
  const c4 = client(store3); c4.API.recover();
  ok(c4.API.ticket() && c4.API.ticket().id === pid && bank.bal('u1') === 150, 'lost reply: reload re-sends the same id, charged once (balance 150)');
  c4.API.recover(); ok(bank.bal('u1') === 150, 'another recover does not charge again');
  const AU = bank.audit(); ok(AU.drift === 0 && AU.negative === 0, 'bank invariant holds');
}

// --- wiring in the game and the build ---
{ const tpl = fs.readFileSync(path.join(APP, 'src/client/template.html'), 'utf8');
  ok(/fyrus-airport35\.js\?v=/.test(tpl), 'template loads fyrus-airport35.js');
  ok(tpl.indexOf('fyrus-airport35.js') > tpl.indexOf('fyrus-vectorbay.js'), 'airport loads after Vector Bay (hook chain order)');
  const idx = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  ok(/fyrus-airport35\.js/.test(idx), 'built index.html includes the airport');
  ok(/window\.__fyrusPay = \(t, e\) => Jc\(t, e\)/.test(idx), 'wallet debit exposed as __fyrusPay');
  ok(/window\.__fyrusAirRunway \|\| Ep\.runway/.test(idx), 'legacy tours use the new runway');
  ok(/window\.__fyrusAirCurb \|\| Cn/.test(idx), 'legacy tours board at the new curb');
  const c21 = fs.readFileSync(path.join(APP, 'fyrus-city21.js'), 'utf8'); ok((c21.match(/__fyrusNoProps/g) || []).length >= 3, 'street furniture/signals/signs skip airports');
  const vb = fs.readFileSync(path.join(APP, 'fyrus-vectorbay.js'), 'utf8'); ok(/__fyrusNoProps/.test(vb), 'Vector Bay trees skip the airport platform');
  const src = fs.readFileSync(path.join(APP, 'fyrus-airport35.js'), 'utf8');
  ok(!/blender/i.test(src.replace(/no Blender/gi, '')), 'no Blender dependency');
  ok(!/https?:\/\//.test(src), 'no external URLs / paid assets');
}

console.log('air35 tests: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
