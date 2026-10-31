// server/bank.ts
// Rewards come from the client, so keep them small until the server computes them itself.
var OPENING_CAP = +(process.env.OPENING_CAP || 2500);
var DAILY_GAME_CAP = +(process.env.DAILY_REWARD_CAP || 15e3);
var MAX_REWARD_PER_OP = +(process.env.MAX_REWARD_PER_OP || 1500);
// Money the client may ask the bank to create. Everything else (sales, commissions, refunds) is either
// done by the server itself (land, market, jobs, courses) or was demo-only and is refused.
var WELCOME_GRANT = +(process.env.WELCOME_GRANT || 2500);
// 26.11: the economic simulation showed beta test credit dominating the economy (claimers 17x richer than workers,
// supply +3 %/day), so it is on by default only outside production
var BETA_TEST_CREDIT = String(process.env.BETA_TEST_CREDIT || (process.env.NODE_ENV === "production" ? "off" : "on")) !== "off";
var mintKind = (label) => /^Welcome grant/i.test(label) ? "welcome" : /demo checkout/i.test(label) ? "test" : "";
var SPECIAL = /* @__PURE__ */ new Set(["treasury", "escrow"]);
// 26.2 currency rules (see docs/phase26/26.2-currency-rules.md). FYC are non-redeemable in-game credits.
// Server-wide daily mint caps per source; "fallback" = wages / buy-backs when the treasury is empty.
var MINT_CAP = {
  beta: +(process.env.MINT_CAP_BETA || 25e4),
  fallback: +(process.env.MINT_CAP_FALLBACK || 1e5)
};
var r2 = (n) => Math.round(n * 100) / 100;
function createBank(d) {
  if (!d.db.bank) {
    d.db.bank = { acct: {}, ledger: [], seq: 1 };
    d.save();
  }
  const B = d.db.bank;
  // 26.1 money-supply counters: every FYC that exists was minted and not yet burned, so
  //   sum(all balances, incl. treasury and escrow) === minted - burned   (audit().drift must stay 0)
  // Older databases start counting from their current total.
  if (B.minted == null) {
    B.minted = r2(Object.values(B.acct).reduce((s, a) => s + (a.bal || 0), 0));
    B.burned = 0;
    B.auditFrom = Date.now();
  }
  const today = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  B.owed ||= [];
  const mintDay = () => {
    if (!B.mintDay || B.mintDay.day !== today()) B.mintDay = { day: today(), by: {} };
    return B.mintDay;
  };
  // capped mint for a source; returns the amount actually created (0..amount)
  function mint(kind, to, amount, memo) {
    const md = mintDay(), cap = MINT_CAP[kind] ?? Infinity, room = Math.max(0, cap - (md.by[kind] || 0)), n = r2(Math.min(room, amount));
    if (!(n > 0) || !transfer("mint", to, n, memo)) return 0;
    md.by[kind] = r2((md.by[kind] || 0) + n);
    return n;
  }
  // pay from the treasury; if it is short, mint within the daily fallback cap; anything left is owed and paid
  // first thing whenever money reaches the treasury
  function payFromTreasury(to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0)) return { paid: 0, owed: 0 };
    if (transfer("treasury", to, amount, memo)) return { paid: amount, owed: 0 };
    const t = Math.min(bal("treasury"), amount), fromT = t > 0 && transfer("treasury", to, t, memo) ? t : 0;
    const m = mint("fallback", to, r2(amount - fromT), memo + " (Central Bank)");
    const owed = r2(amount - fromT - m);
    if (owed > 0) B.owed.push({ to, amount: owed, memo, at: Date.now() });
    return { paid: r2(fromT + m), owed };
  }
  let settling = false;
  function settleOwed() {
    if (settling || !B.owed.length) return;
    settling = true;
    try {
      while (B.owed.length && bal("treasury") > 0) {
        const o = B.owed[0], n = r2(Math.min(o.amount, bal("treasury")));
        if (!transfer("treasury", o.to, n, o.memo + " (paid late)")) break;
        o.amount = r2(o.amount - n);
        if (o.amount <= 0) B.owed.shift();
      }
    } finally {
      settling = false;
    }
  }
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
  // 26.3 append-only, hash-chained ledger file (ledger.jsonl next to the DB). The DB keeps the latest 20 000 entries
  // for statements; the file keeps everything. Line 1 is a genesis entry with every balance at the moment the file
  // was started, so tools/net/ledger-verify.mjs can replay the file and must arrive at the DB's balances.
  const LF = d.ledgerFile && d.fs ? d.ledgerFile : null, LED = { file: LF, lines: 0, lastHash: "", errors: 0 };
  const hashOf = (prev, e) => d.crypto.createHash("sha256").update(prev + JSON.stringify(e)).digest("hex");
  function lfAppend(e) {
    if (!LF) return;
    try {
      const h = hashOf(LED.lastHash, e);
      d.fs.appendFileSync(LF, JSON.stringify({ ...e, prev: LED.lastHash, h }) + "\n");
      LED.lastHash = h;
      LED.lines++;
    } catch (x) {
      LED.errors++;
    }
  }
  if (LF) {
    try {
      if (d.fs.existsSync(LF)) {
        const txt = d.fs.readFileSync(LF, "utf8").trimEnd().split("\n");
        const last = JSON.parse(txt[txt.length - 1]);
        LED.lastHash = last.h;
        LED.lines = txt.length;
        // the file is written at once, the DB at most every 1.5 s: after a crash the file can hold transfers the DB
        // never saved (their effects elsewhere - a plot title, an order - were lost too, so they are NOT replayed).
        // Keep them for review and mark the point where the chain continues from the DB's balances.
        const lost = [];
        for (const ln of txt) {
          const o = JSON.parse(ln);
          if (o.id != null && o.id >= B.seq) lost.push(o);
        }
        if (lost.length) {
          d.fs.writeFileSync(LF.replace(/\.jsonl$/, "") + "-lost-" + Date.now() + ".jsonl", lost.map((o) => JSON.stringify(o)).join("\n") + "\n");
          LED.lostOnStart = lost.length;
          lfAppend({ kind: "resync", at: Date.now(), seq: B.seq, lost: lost.length, lostIds: [lost[0].id, lost[lost.length - 1].id], balances: Object.fromEntries(Object.entries(B.acct).map(([k, a]) => [k, a.bal || 0])), minted: B.minted, burned: B.burned });
        }
      } else lfAppend({ kind: "genesis", at: Date.now(), seq: B.seq, minted: B.minted ?? null, burned: B.burned ?? null, balances: Object.fromEntries(Object.entries(B.acct).map(([k, a]) => [k, a.bal || 0])) });
    } catch (x) {
      LED.errors++;
    }
  }
  function log(from, to, amount, memo) {
    const e = { id: B.seq++, at: Date.now(), from, to, amount: r2(amount), memo: memo.slice(0, 120) };
    B.ledger.push(e);
    if (B.ledger.length > 2e4) B.ledger.splice(0, B.ledger.length - 2e4);
    lfAppend(e);
  }
  function transfer(from, to, amount, memo) {
    amount = r2(amount);
    if (!(amount > 0) || from === to) return false;
    if (from !== "mint") {
      const a = acct(from);
      if (a.bal + 1e-9 < amount) return false;
      a.bal = r2(a.bal - amount);
    } else B.minted = r2(B.minted + amount);
    if (to !== "burn") {
      const b = acct(to);
      b.bal = r2(b.bal + amount);
    } else B.burned = r2(B.burned + amount);
    log(from, to, amount, memo);
    d.save(true);
    watch(from, to, amount);
    notify(from);
    notify(to);
    to === "treasury" && B.owed?.length && settleOwed();
    return true;
  }
  function history(id, n = 60, before = Infinity) {
    const out = [];
    for (let i = B.ledger.length - 1; i >= 0 && out.length < n; i--) {
      const t = B.ledger[i];
      if (t.id >= before) continue;
      if (t.from === id || t.to === id) out.push({ ...t, dir: t.to === id ? "in" : "out", other: t.to === id ? t.from : t.to, otherName: d.nameOf(t.to === id ? t.from : t.to) });
    }
    return out;
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("bank_") || m.t.startsWith("bond_") || m.t.startsWith("tx_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "bank_hello": {
        if (!has(u.id)) {
          acct(u.id);
          const open = Math.max(0, Math.min(OPENING_CAP, Math.round(+m.local || 0)));
          if (open > 0) {
            transfer("mint", u.id, open, "Opening balance moved from your beta wallet");
            acct(u.id).welcomed = true;
          } else d.save();
        }
        notify(u.id);
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "bank_air": {
        // 35.2 airline tickets: fares come from this table (never from the client); one booking per ticket id
        // (a retried or duplicated request is answered with the same ticket and is never charged twice); one active
        // ticket per citizen; status only moves forward.
        const AIR = { FY401: [60, 150, "FCI", "VBX", "A1"], FY402: [60, 150, "VBX", "FCI", "B2"], FY100: [40, 90, "FCI", "FCI", "A6"], FY200: [40, 90, "VBX", "VBX", "B1"] };
        const ACTIVE = new Set(["booked", "checked", "cleared", "inflight"]);
        const a = acct(u.id), air = (a.air ||= { cur: null, hist: [], ids: [] });
        const op = String(m.op || "get"), id = String(m.id || "");
        const send = (x) => reply({ t: "bank_air", op, id, ...x, ticket: air.cur });
        if (op === "get") return send({ ok: true }), true;
        if (op === "book") {
          if (!/^T[A-Z0-9]{6,24}$/.test(id)) return send({ ok: false, reason: "id" }), true;
          if (air.ids.includes(id)) return send({ ok: true, again: true }), true;
          if (air.cur && ACTIVE.has(air.cur.status)) return send({ ok: false, reason: "active" }), true;
          const r = AIR[String(m.route)];
          if (!r) return send({ ok: false, reason: "route" }), true;
          if (a.banned) return send({ ok: false, reason: "banned" }), true;
          const cls = m.cls === "business" ? "business" : "economy", fare = cls === "business" ? r[1] : r[0];
          if (!transfer(u.id, "treasury", fare, `Fyrus Airlines ${m.route} ${r[2]}-${r[3]} ticket ${id}`)) return send({ ok: false, reason: "funds" }), true;
          let h = 0;
          for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) | 0;
          h = Math.abs(h);
          const seat = cls === "business" ? 1 + (h % 3) + "ACDF"[h % 4] : 8 + (h % 22) + "ABCDEF"[h % 6];
          if (air.cur) air.hist = [...air.hist, air.cur].slice(-20);
          air.cur = { id, flight: String(m.route), route: String(m.route), from: r[2], to: r[3], cls, fare, gate: r[4], seat, status: "booked", bookedAt: Date.now(), srv: true };
          air.ids = [...air.ids, id].slice(-200);
          d.save(true);
          return send({ ok: true }), true;
        }
        if (op === "set") {
          const NEXT = { booked: ["checked", "cancelled"], checked: ["cleared", "inflight"], cleared: ["inflight"], inflight: ["arrived"], arrived: ["done"] };
          const c = air.cur, to = String(m.status || "");
          if (!c || c.id !== id) return send({ ok: false, reason: "none" }), true;
          if (!(NEXT[c.status] || []).includes(to)) return send({ ok: false, reason: "state" }), true;
          c.status = to;
          c[to + "At"] = Date.now();
          if (to === "done" || to === "cancelled") {
            air.hist = [...air.hist, c].slice(-20);
            air.cur = null;
          }
          d.save();
          return send({ ok: true }), true;
        }
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
        const kind = mintKind(label);
        if (kind === "welcome") {
          if (a.welcomed) {
            notify(u.id);
            return true;
          }
          a.welcomed = true;
          transfer("mint", u.id, Math.min(amt, WELCOME_GRANT), "Welcome grant from the Central Bank");
          return true;
        }
        if (kind !== "test" || !BETA_TEST_CREDIT) {
          notify(u.id); // resync the client: this kind of income is not created by the bank
          return true;
        }
        if (a.day !== today()) {
          a.day = today();
          a.dayIn = 0;
        }
        const room = Math.max(0, DAILY_GAME_CAP - a.dayIn);
        let ok = Math.min(room, amt, MAX_REWARD_PER_OP);
        if (ok > 0) {
          ok = mint("beta", u.id, ok, label);
          a.dayIn += ok;
        }
        if (ok < amt) {
          notify(u.id);
          reply({ t: "note", text: `Daily limit for beta test credit reached (${DAILY_GAME_CAP.toLocaleString("en-US")} FYC). It resets tomorrow.` });
        }
        return true;
      }
      case "bank_send":
      case "tx_approve": {
        // 26.9 authorization: transfers of TX_CONFIRM_MIN FYC or more need a second, explicit approval from the same
        // signed-in session within 60 s (tx_confirm -> tx_approve); one use, bound to the user and the connection
        let to, amt, note;
        if (m.t === "tx_approve") {
          const p = TXP.get(String(m.id || ""));
          if (!p || p.uid !== u.id || p.ws !== me.ws) return err("That confirmation is not valid."), true;
          TXP.delete(p.id);
          if (Date.now() > p.exp) return err("That confirmation expired. Send again."), true;
          to = d.findByNumber(p.to);
          amt = p.amt;
          note = p.note;
          TXS.approved++;
        } else {
          to = d.findByNumber(String(m.to || ""));
          amt = r2(+m.amount || 0);
          note = d.clean(m.note, 80);
        }
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
        // 24.9: accounts younger than a day can send at most NEW_ACCT_SEND_CAP FYC in total (stops farming the
        // opening / welcome grants with throw-away accounts)
        if (Date.now() - (u.joined || 0) < 864e5) {
          const a0 = acct(u.id), cap = +(process.env.NEW_ACCT_SEND_CAP || 500);
          if ((a0.newOut || 0) + amt > cap) {
            err(`New accounts can send up to ${cap} FYC in their first day.`);
            return true;
          }
        }
        // 26.9: daily outgoing limit for citizen-to-citizen transfers
        const a1 = acct(u.id);
        if (a1.outDay !== today()) (a1.outDay = today()), (a1.outToday = 0);
        if ((a1.outToday || 0) + amt > TX_DAILY_OUT()) {
          err(`Daily transfer limit is ${TX_DAILY_OUT().toLocaleString("en-US")} FYC (${Math.max(0, TX_DAILY_OUT() - (a1.outToday || 0)).toLocaleString("en-US")} left today).`);
          return true;
        }
        if (m.t === "bank_send" && amt >= TX_CONFIRM_MIN()) {
          if (a1.bal + 1e-9 < amt) return err("Not enough FYC."), true;
          for (const [k, p] of TXP) if (p.uid === u.id || Date.now() > p.exp) TXP.delete(k);
          const id = d.crypto ? d.crypto.randomBytes(9).toString("base64url") : String(Math.random()).slice(2);
          TXP.set(id, { id, uid: u.id, ws: me.ws, to: to.number, amt, note, exp: Date.now() + +(process.env.TX_CONFIRM_MS || 6e4) });
          TXS.asked++;
          reply({ t: "tx_confirm", id, kind: "send", amount: amt, toName: to.name, toNumber: to.number, note, expiresIn: +(process.env.TX_CONFIRM_MS || 6e4) });
          return true;
        }
        if (!transfer(u.id, to.id, amt, `FyrusPay ${note ? "\xB7 " + note : ""}`.trim())) {
          err("Not enough FYC.");
          return true;
        }
        a1.outToday = r2((a1.outToday || 0) + amt);
        Date.now() - (u.joined || 0) < 864e5 && (acct(u.id).newOut = (acct(u.id).newOut || 0) + amt);
        reply({ t: "ok", text: `Sent ${amt.toLocaleString("en-US")} FYC to ${to.name} (${to.number}).` });
        const l = d.liveOf(to.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} sent you ${amt.toLocaleString("en-US")} FYC${note ? `: "${note}"` : ""}.` });
        reply({ t: "bank_hist", list: history(u.id) });
        return true;
      }
      case "tx_cancel": {
        const p = TXP.get(String(m.id || ""));
        if (p && p.uid === u.id) TXP.delete(p.id);
        return true;
      }
      case "bank_hist": {
        // 26.3: paging - "before" = the oldest id the client already has
        const before = Math.round(+m.before) || Infinity, list = history(u.id, 60, before);
        reply({ t: "bank_hist", list, before: before === Infinity ? void 0 : before, more: list.length === 60 });
        return true;
      }
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
  // 26.10 farming watch: an account that receives transfers from 5+ different accounts that are less than a day old,
  // within 24 h, is flagged for the Fyrus Court (grant farming with throw-away accounts). Flags never move money.
  B.flags ||= {};
  const recv = /* @__PURE__ */ new Map();
  function watch(from, to, amount) {
    if (!d.isNew || SPECIAL.has(from) || SPECIAL.has(to) || from === "mint" || to === "burn" || String(to).startsWith("biz:")) return;
    if (!d.isNew(from)) return;
    const now = Date.now(), r = recv.get(to) || [];
    const keep = r.filter((x) => now - x.at < 864e5);
    keep.push({ from, at: now, amount });
    recv.set(to, keep);
    const senders = new Set(keep.map((x) => x.from));
    if (senders.size >= 5 && !B.flags[to]) {
      B.flags[to] = { at: now, why: `received from ${senders.size} new accounts in 24 h`, total: r2(keep.reduce((s, x) => s + x.amount, 0)), senders: [...senders].slice(0, 20) };
      d.save();
      d.onFlag?.(to, B.flags[to]);
    }
  }
  // 26.9 pending confirmations and limits
  const TXP = /* @__PURE__ */ new Map(), TXS = { asked: 0, approved: 0 };
  const TX_CONFIRM_MIN = () => +(process.env.TX_CONFIRM_MIN || 5e3), TX_DAILY_OUT = () => +(process.env.TX_DAILY_OUT || 1e5);
  function audit() {
    let total = 0, negative = 0, n = 0;
    for (const a of Object.values(B.acct)) {
      total += a.bal || 0;
      n++;
      if ((a.bal || 0) < -1e-9) negative++;
    }
    total = r2(total);
    const bySource = {};
    for (const t of B.ledger) if (t.from === "mint") {
      const k = String(t.memo).replace(/[:·(].*$/, "").trim().slice(0, 40);
      bySource[k] = r2((bySource[k] || 0) + t.amount);
    }
    return { flags: Object.keys(B.flags || {}).length, tx: { ...TXS, pending: TXP.size }, ledgerFile: { lines: LED.lines, errors: LED.errors, enabled: !!LF, lostOnStart: LED.lostOnStart || 0 }, accounts: n, total, minted: B.minted, burned: B.burned, drift: r2(total - (B.minted - B.burned)), negative, mintToday: mintDay(), mintCap: MINT_CAP, owed: r2(B.owed.reduce((s, o) => s + o.amount, 0)), owedCount: B.owed.length, treasury: bal("treasury"), escrow: bal("escrow"), ledger: B.ledger.length, mintedBySourceInLedger: bySource, auditFrom: B.auditFrom || null };
  }
  // dev / test hook (read-only); the demo server exposes it on loopback at /__bench/bank
  globalThis.__fyrusBankAudit = audit;
  return { onMessage: onMessage2, transfer, bal, acct, notify, history, audit, mint, payFromTreasury, setHeld: (f) => {
    heldFor = f;
  }, setBusy: (f) => {
    busy = f;
  } };
}

