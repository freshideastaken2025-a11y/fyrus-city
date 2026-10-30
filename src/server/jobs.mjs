// server/jobs.ts
var day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var DAILY = () => +(process.env.JOB_DAILY || JOB_RULES.dailyShifts);
var COOLDOWN = () => +(process.env.JOB_COOLDOWN_MS ?? JOB_RULES.cooldownMs);
var MIN_TASK = () => +(process.env.JOB_MIN_TASK_MS ?? JOB_RULES.minTaskMs);
// 28.7 career levels (shared with the AI citizens' answers)
var CAREER_LEVELS = [
  { id: "trainee", name: "Trainee", shifts: 0, certs: 0, pct: 0 },
  { id: "junior", name: "Junior worker", shifts: 5, certs: 0, pct: 3 },
  { id: "skilled", name: "Skilled worker", shifts: 15, certs: 1, pct: 6 },
  { id: "senior", name: "Senior worker", shifts: 40, certs: 2, pct: 10 }
];
function createJobs(d) {
  if (!d.db.jobs) {
    d.db.jobs = { bag: {}, day: {}, mail: {}, totals: { shifts: 0, paid: 0, sold: 0 } };
    d.save();
  }
  const J = d.db.jobs;
  const bank2 = d.bank;
  const shifts = /* @__PURE__ */ new Map();
  // 26.4 shop inventory: each shop item has limited stock that is delivered back over time (one unit per item every
  // RESTOCK_MS) and topped up when a citizen finishes a work shift at that shop. Computed lazily on access.
  const RESTOCK_MS = () => +(process.env.RESTOCK_MS || 12e4);
  const STOCK_MAX = { food: 40, item: 20, gadget: 5 };
  const maxOf = (id) => STOCK_MAX[ITEMS[id]?.kind] ?? 15;
  J.stock ||= {};
  // 26.5 receipts and refunds: every shop purchase gets a receipt; unused goods can be returned at the same shop within
  // REFUND_MS (default 10 min) for the full price; the units go back on the shelf
  J.receipts ||= {};
  J.streak ||= {};
  J.rseq ||= 1;
  // 28.7 career pathways: lifetime finished shifts + earned course certificates give a career level. Its bonus counts
  // inside the existing 35 % bonus cap (streak 25 + steady hands 10), so the most one shift can pay never rises and the
  // treasury mint caps (26.2) still apply. Promotions are computed on the server only. Kill switch P28_OFF=career.
  J.career ||= {};
  const CAREER = CAREER_LEVELS;
  const BONUS_CAP = 35;
  const CAREER_OFF = () => /(^|,)(career|all)(,|$)/.test(process.env.P28_OFF || "");
  function careerOf(id) {
    const c = J.career[id] || { shifts: 0 }, certs = d.certCount ? d.certCount(id) : 0;
    let i = 0;
    for (let k = CAREER.length - 1; k > 0; k--) if (c.shifts >= CAREER[k].shifts && certs >= CAREER[k].certs) { i = k; break; }
    const lv = CAREER[i], nx = CAREER[i + 1] || null;
    return { level: lv.id, name: lv.name, pct: CAREER_OFF() ? 0 : lv.pct, shifts: c.shifts, certs, off: CAREER_OFF(),
      next: nx ? { name: nx.name, pct: nx.pct, needShifts: Math.max(0, nx.shifts - c.shifts), needCerts: Math.max(0, nx.certs - certs) } : null };
  }
  const REFUND_MS = () => +(process.env.REFUND_MS || 6e5);
  function stockOf(svcId) {
    const s = svcById(svcId);
    if (!s) return null;
    const now = Date.now(), st = J.stock[svcId] ||= { items: {}, at: now };
    for (const id of s.items || []) if (st.items[id] == null) st.items[id] = maxOf(id);
    const units = Math.floor((now - st.at) / RESTOCK_MS());
    if (units > 0) {
      for (const id of s.items || []) st.items[id] = Math.min(maxOf(id), st.items[id] + units);
      st.at += units * RESTOCK_MS();
    }
    if ((s.items || []).every((id) => st.items[id] >= maxOf(id))) st.at = now;
    return st;
  }
  const stockMsg = (svcId) => {
    const st = stockOf(svcId);
    return { t: "shop_stock", svc: svcId, stock: st ? { ...st.items } : {}, max: Object.fromEntries((svcById(svcId)?.items || []).map((id) => [id, maxOf(id)])), nextIn: st ? Math.max(0, st.at + RESTOCK_MS() - Date.now()) : 0 };
  };
  const today = (id) => {
    const t = J.day[id];
    if (!t || t.day !== day()) J.day[id] = { day: day(), shifts: 0, earned: 0, last: t?.last || 0 };
    return J.day[id];
  };
  function atPlace(l, id) {
    const s = svcById(id);
    if (!s) return false;
    if (s.interior) return l.scene === "gov:svc:" + id;
    const p = doorOf(s, 0);
    return (l.scene || "plaza") === "plaza" && Math.hypot((l.x || 0) - p.x, (l.z || 0) - p.z) < 16;
  }
  const me = (id) => {
    const t = today(id);
    const sh = shifts.get(id);
    const rnow = Date.now();
    return { t: "jobs_me", career: careerOf(id), receipts: (J.receipts[id] || []).slice(-12).reverse().map((r) => ({ ...r, refundable: !r.refunded && rnow - r.at <= REFUND_MS() && (J.bag[id]?.[r.item] || 0) >= r.q, left: Math.max(0, r.at + REFUND_MS() - rnow) })), bag: J.bag[id] || {}, shifts: t.shifts, earned: t.earned, cap: DAILY(), next: Math.max(0, (t.last || 0) + COOLDOWN() - Date.now()), shift: sh ? { svc: sh.svc, step: sh.step, total: sh.order.length, station: sh.order[sh.step] } : null, mail: (J.mail[id] || []).slice(-30).reverse() };
  };
  const push = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, me(id));
  };
  // 26.2: wages come from the treasury; Central Bank fallback is capped per day, the rest is owed (paid late)
  const pay = (to, n, memo) => bank2.payFromTreasury(to, n, memo);
  function onMessage2(L, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("job_") || m.t.startsWith("shop_") || m.t === "jobs_me" || m.t.startsWith("post_"))) return false;
    const u = L.u;
    const reply = (x) => d.send(L.ws, x);
    const err = (text) => {
      reply({ t: "err", text });
      return true;
    };
    const ok = (text) => reply({ t: "ok", text });
    const banned = !!bank2.acct(u.id).banned;
    switch (m.t) {
      case "jobs_me":
        reply(me(u.id));
        return true;
      case "job_start": {
        const s = svcById(String(m.svc));
        if (!s?.job) return err("There is no job here.");
        if (banned) return err("This account is suspended.");
        if (!atPlace(L, s.id)) return err(s.interior ? `Go inside ${s.name} to start the shift.` : `Stand at ${s.name} to start the shift.`);
        const t = today(u.id);
        if (t.shifts >= DAILY()) return err(`You've done ${DAILY()} shifts today. Come back tomorrow!`);
        const wait = (t.last || 0) + COOLDOWN() - Date.now();
        if (wait > 0) return err(`Take a short break first \u2014 next shift in ${Math.ceil(wait / 1e3)} s.`);
        const n = Math.min(JOB_RULES.tasks, Math.max(3, s.job.stations.length));
        const order = [];
        let prev = -1;
        for (let i = 0; i < n; i++) {
          let k = Math.floor(Math.random() * s.job.stations.length);
          if (k === prev) k = (k + 1) % s.job.stations.length;
          order.push(k);
          prev = k;
        }
        shifts.set(u.id, { svc: s.id, order, step: 0, last: Date.now(), started: Date.now() });
        ok(`${s.job.title} started: ${s.job.stations[order[0]]}.`);
        push(u.id);
        return true;
      }
      case "job_task": {
        const sh = shifts.get(u.id);
        if (!sh) return err("You are not on a shift.");
        const s = svcById(sh.svc);
        if (!atPlace(L, s.id)) return err(`You left ${s.name}. Go back to finish the shift.`);
        if (+m.station !== sh.order[sh.step]) {
          sh.mistakes = (sh.mistakes || 0) + 1;
          return err(`That's not your task. Now: ${s.job.stations[sh.order[sh.step]]}.`);
        }
        if (Date.now() - sh.last < MIN_TASK()) return err("Take your time \u2014 do the task properly.");
        sh.step++;
        sh.last = Date.now();
        if (sh.step < sh.order.length) {
          reply({ t: "note", text: `Done (${sh.step}/${sh.order.length}). Next: ${s.job.stations[sh.order[sh.step]]}.` });
          push(u.id);
          return true;
        }
        shifts.delete(u.id);
        const t = today(u.id);
        // 26.6 rewards, all computed here: base wage + work-streak bonus (+5 % per consecutive day, max +25 %)
        // + steady-hands bonus (+10 % when no wrong-task mistakes in this shift). Paid from the treasury (26.2).
        const sk = J.streak[u.id] ||= { day: "", n: 0 };
        if (sk.day !== day()) {
          const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
          sk.n = sk.day === y ? sk.n + 1 : 1;
          sk.day = day();
        }
        const base = s.job.pay, streakPct = Math.min(25, (sk.n - 1) * 5), cleanPct = sh.mistakes ? 0 : 10;
        const car0 = careerOf(u.id), careerPct = Math.max(0, Math.min(car0.pct, BONUS_CAP - streakPct - cleanPct));
        const total = Math.round(base * (1 + (streakPct + cleanPct + careerPct) / 100));
        if (!CAREER_OFF()) { const cr = J.career[u.id] ||= { shifts: 0, byPlace: {} }; cr.shifts++; cr.byPlace[s.id] = (cr.byPlace[s.id] || 0) + 1; }
        const car1 = careerOf(u.id), promoted = car1.level !== car0.level ? car1.name : null;
        t.shifts++;
        t.earned += total;
        t.last = Date.now();
        J.totals.shifts++;
        J.totals.paid += total;
        const paid = pay(u.id, total, `${s.job.title} at ${s.name}${streakPct || cleanPct || careerPct ? ` (+${streakPct + cleanPct + careerPct}% bonus)` : ""}`);
        // 26.4: a finished shift restocks the shop (+5 of every item, up to the shelf size)
        const st5 = stockOf(s.id);
        if (st5) for (const id of s.items || []) st5.items[id] = Math.min(maxOf(id), st5.items[id] + 5);
        d.xp?.(u.id, 40);
        d.save();
        reply({ t: "job_done", svc: s.id, pay: total, base, streakDays: sk.n, streakPct, cleanPct, careerPct, career: car1.off ? null : car1.name, promoted, owed: paid?.owed || 0, title: s.job.title });
        push(u.id);
        return true;
      }
      case "job_quit": {
        if (shifts.delete(u.id)) ok("Shift cancelled. No pay for unfinished shifts.");
        push(u.id);
        return true;
      }
      case "shop_buy": {
        const s = svcById(String(m.svc));
        const id = String(m.item);
        const it = ITEMS[id];
        if (!s || !it || !(s.items || []).includes(id)) return err("That is not sold here.");
        if (!atPlace(L, s.id)) return err(`Visit ${s.name} to buy this.`);
        const q = Math.max(1, Math.min(10, Math.round(+m.qty || 1)));
        const st = stockOf(s.id);
        if (st.items[id] < q) {
          reply(stockMsg(s.id));
          return err(st.items[id] > 0 ? `Only ${st.items[id]} left.` : `${it.name} is sold out. Next delivery in about ${Math.max(1, Math.ceil((st.at + RESTOCK_MS() - Date.now()) / 6e4))} min.`);
        }
        if (!bank2.transfer(u.id, "treasury", it.price * q, `${s.name}: ${q} \xD7 ${it.name}`)) return err(`You need ${it.price * q} FYC.`);
        st.items[id] -= q;
        st.at = Math.min(st.at, Date.now());
        J.totals.units = (J.totals.units || 0) + q;
        const rl = J.receipts[u.id] ||= [];
        rl.push({ id: J.rseq++, svc: s.id, item: id, q, price: it.price * q, at: Date.now() });
        if (rl.length > 30) rl.splice(0, rl.length - 30);
        const bag = J.bag[u.id] ||= {};
        bag[id] = Math.min(999, (bag[id] || 0) + q);
        J.totals.sold += it.price * q;
        d.save();
        ok(it.kind === "food" ? `${it.icon} ${it.name} \u2014 in your bag. Eat it any time.` : `${it.icon} ${it.name} is yours.`);
        push(u.id);
        reply(stockMsg(s.id));
        return true;
      }
      case "shop_refund": {
        const rl = J.receipts[u.id] || [];
        const r = rl.find((x) => x.id === Math.round(+m.receipt));
        if (!r) return err("No such receipt.");
        if (r.refunded) return err("This purchase was already refunded.");
        if (Date.now() - r.at > REFUND_MS()) return err(`Returns are accepted within ${Math.max(1, Math.round(REFUND_MS() / 6e4))} minutes of purchase.`);
        const s = svcById(r.svc);
        if (!atPlace(L, r.svc)) return err(`Bring it back to ${s?.name || "the shop"}.`);
        const bag = J.bag[u.id] || {};
        if ((bag[r.item] || 0) < r.q) return err("You no longer have all of it (used or eaten items can't be returned).");
        const paid = bank2.transfer("treasury", u.id, r.price, `Refund: ${r.q} \xD7 ${ITEMS[r.item]?.name || r.item} at ${s?.name || r.svc}`) ? r.price : bank2.payFromTreasury(u.id, r.price, `Refund: ${r.q} \xD7 ${ITEMS[r.item]?.name || r.item}`).paid;
        bag[r.item] -= r.q;
        if (!bag[r.item]) delete bag[r.item];
        const st = stockOf(r.svc);
        if (st) st.items[r.item] = Math.min(maxOf(r.item), st.items[r.item] + r.q);
        r.refunded = Date.now();
        J.totals.refunded = (J.totals.refunded || 0) + r.price;
        d.save();
        ok(paid >= r.price ? `Refunded ${r.price} FYC.` : `Refund of ${r.price} FYC: ${paid} paid now, the rest as soon as the treasury can.`);
        push(u.id);
        reply(stockMsg(r.svc));
        return true;
      }
      case "shop_stock": {
        const s = svcById(String(m.svc));
        if (s) reply(stockMsg(s.id));
        return true;
      }
      case "shop_use": {
        const id = String(m.item);
        const it = ITEMS[id];
        const bag = J.bag[u.id] || {};
        if (!it || !bag[id]) return err("Not in your bag.");
        if (it.kind !== "food") return err(`${it.name} stays in your bag.`);
        bag[id]--;
        if (!bag[id]) delete bag[id];
        d.save();
        reply({ t: "ate", item: id });
        push(u.id);
        return true;
      }
      case "shop_service": {
        const s = svcById(String(m.svc));
        const k = String(m.kind);
        if (!s || !(s.actions || []).includes(k)) return err("Not offered here.");
        if (!atPlace(L, s.id)) return err(`Visit ${s.name} first.`);
        if (!bank2.transfer(u.id, "treasury", SERVICE_PRICES[k], `${s.name}: ${k}`)) return err(`A ${k} costs ${SERVICE_PRICES[k]} FYC.`);
        reply({ t: "service_ok", kind: k, svc: s.id });
        return true;
      }
      case "post_send": {
        if (!atPlace(L, "post")) return err("Postcards are sent from the Post Office.");
        const to = d.findByNumber(String(m.number || ""));
        if (!to) return err("No citizen with that +2040 number.");
        if (to.id === u.id) return err("Send it to someone else.");
        const text = d.filter(String(m.text || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 280));
        if (text.length < 2) return err("Write something on the postcard.");
        const gift = Math.max(0, Math.min(5e3, Math.round(+m.gift || 0)));
        if (!bank2.transfer(u.id, "treasury", SERVICE_PRICES.postcard, "Post Office: postcard stamp")) return err(`A stamp costs ${SERVICE_PRICES.postcard} FYC.`);
        let paid = 0;
        if (gift) {
          if (bank2.transfer(u.id, to.id, gift, `Gift by post from ${d.shown(u.id)}`)) paid = gift;
          else ok("Postcard sent, but the gift could not be paid (not enough FYC).");
        }
        const box = J.mail[to.id] ||= [];
        box.push({ from: u.id, fromName: d.shown(u.id), text, gift: paid, at: Date.now() });
        if (box.length > 60) box.splice(0, box.length - 60);
        d.save();
        const l = d.liveOf(to.id);
        if (l) {
          d.send(l.ws, { t: "note", text: `\u{1F4EC} A postcard from ${d.shown(u.id)}${paid ? ` with ${gift} FYC` : ""}. Open the Services \u2192 Mailbox.` });
          push(to.id);
        }
        ok(`Postcard on its way to ${d.shown(to.id)}.`);
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, atPlace, me, services: SERVICES.length, stockInfo: (svcId) => { const st = stockOf(svcId); return st ? { ...st.items } : null; } };
}

