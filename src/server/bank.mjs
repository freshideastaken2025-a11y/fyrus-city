// server/bank.ts
// Rewards come from the client, so keep them small until the server computes them itself.
var OPENING_CAP = +(process.env.OPENING_CAP || 2500);
var DAILY_GAME_CAP = +(process.env.DAILY_REWARD_CAP || 15e3);
var MAX_REWARD_PER_OP = +(process.env.MAX_REWARD_PER_OP || 1500);
var SPECIAL = /* @__PURE__ */ new Set(["treasury", "escrow"]);
var r2 = (n) => Math.round(n * 100) / 100;
function createBank(d) {
  if (!d.db.bank) {
    d.db.bank = { acct: {}, ledger: [], seq: 1 };
    d.save();
  }
  const B = d.db.bank;
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const acct = (id) => B.acct[id] ||= { bal: 0, opened: Date.now(), day: today(), dayIn: 0, bond: 0, strikes: 0, sales: 0, bought: 0 };
  const has = (id) => !!B.acct[id];
  const bal = (id) => B.acct[id] ? B.acct[id].bal : 0;
  const notify = (id) => {
    if (SPECIAL.has(id)) return;
    const l = d.liveOf(id);
    const a = B.acct[id];
    if (l && a) d.send(l.ws, { t: "bank", bal: a.bal, bond: a.bond, held: heldFor(id), strikes: a.strikes, banned: !!a.banned, sales: a.sales });
  };
  let heldFor = () => 0;
  function log(from, to, amount, memo) {
    B.ledger.push({ id: B.seq++, at: Date.now(), from, to, amount: r2(amount), memo: memo.slice(0, 120) });
    if (B.ledger.length > 2e4) B.ledger.splice(0, B.ledger.length - 2e4);
  }
  function transfer(from, to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0) || from === to) return false;
    if (from !== "mint") {
      const a = acct(from);
      if (a.bal + 1e-9 < amount) return false;
      a.bal = r2(a.bal - amount);
    }
    if (to !== "burn") {
      const b = acct(to);
      b.bal = r2(b.bal + amount);
    }
    log(from, to, amount, memo);
    d.save();
    notify(from);
    notify(to);
    return true;
  }
  function history(id, n = 60) {
    const out = [];
    for (let i = B.ledger.length - 1; i >= 0 && out.length < n; i--) {
      const t = B.ledger[i];
      if (t.from === id || t.to === id) out.push({ ...t, dir: t.to === id ? "in" : "out", other: t.to === id ? t.from : t.to, otherName: d.nameOf(t.to === id ? t.from : t.to) });
    }
    return out;
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("bank_") || m.t.startsWith("bond_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "bank_hello": {
        if (!has(u.id)) {
          acct(u.id);
          const open = Math.max(0, Math.min(OPENING_CAP, Math.round(+m.local || 0)));
          if (open > 0) transfer("mint", u.id, open, "Opening balance moved from your beta wallet");
          else d.save();
        }
        notify(u.id);
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "bank_op": {
        const amt = r2(+m.amount || 0);
        const label = d.clean(m.label, 100) || "City payment";
        if (!amt) return true;
        const a = acct(u.id);
        if (a.banned && amt > 0) {
          notify(u.id);
          return true;
        }
        if (amt < 0) {
          if (!transfer(u.id, "treasury", -amt, label)) {
            notify(u.id);
            reply({ t: "note", text: "Not enough FYC in your bank account for that." });
          }
          return true;
        }
        if (a.day !== today()) {
          a.day = today();
          a.dayIn = 0;
        }
        const room = Math.max(0, DAILY_GAME_CAP - a.dayIn);
        const ok = Math.min(room, amt, MAX_REWARD_PER_OP);
        if (ok > 0) {
          a.dayIn += ok;
          transfer("mint", u.id, ok, label);
        }
        if (ok < amt) {
          notify(u.id);
          reply({ t: "note", text: `Daily limit for rewards and test packs reached (${DAILY_GAME_CAP.toLocaleString("en-US")} FYC). It resets tomorrow.` });
        }
        return true;
      }
      case "bank_send": {
        const to = d.findByNumber(String(m.to || ""));
        const amt = r2(+m.amount || 0);
        const note = d.clean(m.note, 80);
        if (!to) {
          err("No citizen has that number.");
          return true;
        }
        if (to.id === u.id) {
          err("That is your own number.");
          return true;
        }
        if (!(amt >= 1) || amt > 1e6) {
          err("Enter an amount between 1 and 1,000,000 FYC.");
          return true;
        }
        if (acct(u.id).banned) {
          err("This account is suspended by the Fyrus Court.");
          return true;
        }
        if (!transfer(u.id, to.id, amt, `FyrusPay ${note ? "\xB7 " + note : ""}`.trim())) {
          err("Not enough FYC.");
          return true;
        }
        reply({ t: "ok", text: `Sent ${amt.toLocaleString("en-US")} FYC to ${to.name} (${to.number}).` });
        const l = d.liveOf(to.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} sent you ${amt.toLocaleString("en-US")} FYC${note ? `: "${note}"` : ""}.` });
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "bank_hist":
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      case "bond_stake": {
        const amt = Math.round(+m.amount || 0);
        if (amt < 100) {
          err("The smallest bond is 100 FYC.");
          return true;
        }
        if (!transfer(u.id, "escrow", amt, "Seller security bond")) {
          err("Not enough FYC for the bond.");
          return true;
        }
        acct(u.id).bond += amt;
        d.save();
        notify(u.id);
        reply({ t: "ok", text: `Bond is now ${acct(u.id).bond.toLocaleString("en-US")} FYC.` });
        return true;
      }
      case "bond_withdraw": {
        const a = acct(u.id);
        if (!a.bond) return true;
        if (busy(u.id)) {
          err("Finish or settle your open orders first.");
          return true;
        }
        const amt = a.bond;
        a.bond = 0;
        transfer("escrow", u.id, amt, "Seller bond returned");
        reply({ t: "ok", text: "Bond returned to your account." });
        return true;
      }
    }
    return true;
  }
  let busy = () => false;
  return { onMessage: onMessage2, transfer, bal, acct, notify, history, setHeld: (f) => {
    heldFor = f;
  }, setBusy: (f) => {
    busy = f;
  } };
}

