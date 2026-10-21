// server/jobs.ts
var day = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var DAILY = () => +(process.env.JOB_DAILY || JOB_RULES.dailyShifts);
var COOLDOWN = () => +(process.env.JOB_COOLDOWN_MS ?? JOB_RULES.cooldownMs);
var MIN_TASK = () => +(process.env.JOB_MIN_TASK_MS ?? JOB_RULES.minTaskMs);
function createJobs(d) {
  if (!d.db.jobs) {
    d.db.jobs = { bag: {}, day: {}, mail: {}, totals: { shifts: 0, paid: 0, sold: 0 } };
    d.save();
  }
  const J = d.db.jobs;
  const bank2 = d.bank;
  const shifts = /* @__PURE__ */ new Map();
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
    return { t: "jobs_me", bag: J.bag[id] || {}, shifts: t.shifts, earned: t.earned, cap: DAILY(), next: Math.max(0, (t.last || 0) + COOLDOWN() - Date.now()), shift: sh ? { svc: sh.svc, step: sh.step, total: sh.order.length, station: sh.order[sh.step] } : null, mail: (J.mail[id] || []).slice(-30).reverse() };
  };
  const push = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, me(id));
  };
  const pay = (to, n, memo) => bank2.transfer("treasury", to, n, memo) || bank2.transfer("mint", to, n, memo);
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
        if (+m.station !== sh.order[sh.step]) return err(`That's not your task. Now: ${s.job.stations[sh.order[sh.step]]}.`);
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
        t.shifts++;
        t.earned += s.job.pay;
        t.last = Date.now();
        J.totals.shifts++;
        J.totals.paid += s.job.pay;
        pay(u.id, s.job.pay, `${s.job.title} at ${s.name}`);
        d.xp?.(u.id, 40);
        d.save();
        reply({ t: "job_done", svc: s.id, pay: s.job.pay, title: s.job.title });
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
        if (!bank2.transfer(u.id, "treasury", it.price * q, `${s.name}: ${q} \xD7 ${it.name}`)) return err(`You need ${it.price * q} FYC.`);
        const bag = J.bag[u.id] ||= {};
        bag[id] = Math.min(999, (bag[id] || 0) + q);
        J.totals.sold += it.price * q;
        d.save();
        ok(it.kind === "food" ? `${it.icon} ${it.name} \u2014 in your bag. Eat it any time.` : `${it.icon} ${it.name} is yours.`);
        push(u.id);
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
  return { onMessage: onMessage2, atPlace, me, services: SERVICES.length };
}

