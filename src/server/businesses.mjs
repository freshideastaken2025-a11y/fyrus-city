// FYRUS 26.7 business ownership. A citizen who owns or rents a society plot can register one business there
// (registration fee to the treasury). The business has its own bank account ("biz:<id>"): customers standing at the
// plot buy from its menu (up to 8 offers, price 1..5 000 FYC), 5% sales tax goes to the treasury, the rest to the
// business; the owner moves money between the business and their own account. Max 3 businesses per citizen.
// A business closes (and pays its balance out to the owner) when the owner loses the plot.
// 27.10 AI workforce: the owner can staff a business with one AI clerk (no wage, no money of its own). The clerk answers
// customers from the menu (rules first, then the shared local-model queue), can keep opening hours (server clock), and
// writes the owner a sales report (deterministic, no model). The clerk never moves money or changes prices.
// 27.11 tool permissions: every clerk action goes through one table. "auto" runs at once, "approve" only creates a
// proposal that the owner approves or rejects, "deny" never runs (money, discounts) whatever anyone asks.
var AI_TOOLS = { "menu.read": "auto", "hours.keep": "auto", "report.write": "auto", "price.suggest": "approve", "money.move": "deny", "price.discount": "deny", "menu.delete": "deny" };
var aiToolLevel = (tool) => Object.prototype.hasOwnProperty.call(AI_TOOLS, tool) ? AI_TOOLS[tool] : "deny";
var BIZ_CLERKS_MAX = +(process.env.BIZ_CLERKS_MAX || 40);
var BIZ_FEE = 500, BIZ_TAX = 0.05, BIZ_MAX = 3, BIZ_KINDS = ["cafe", "shop", "studio", "services", "food", "crafts"];
function createBusinesses(d) {
  if (!d.db.biz) {
    d.db.biz = { list: {}, seq: 1 };
    d.save();
  }
  const Z = d.db.biz, bank2 = d.bank;
  const acctId = (b) => "biz:" + b.id;
  const plotRec = (id) => d.db.estate?.plots?.[id];
  const holderOf = (plotId) => {
    const p = plotRec(plotId);
    return p ? p.rent?.tenant || p.owner : null;
  };
  const hourNow = () => process.env.BIZ_HOUR != null ? +process.env.BIZ_HOUR : (/* @__PURE__ */ new Date()).getHours();
  const inHours = (hs, h) => !hs || (hs.open < hs.close ? h >= hs.open && h < hs.close : h >= hs.open || h < hs.close);
  const openNow = (b) => b.open !== false && !(b.clerk?.on && !inHours(b.clerk.hours, hourNow()));
  const clerkPub = (b) => b.clerk?.on ? { name: b.clerk.name, hours: b.clerk.hours || null } : null;
  const audit = (b, tool, result, detail) => { const a = (b.clerk.audit ||= []); a.push({ at: Date.now(), tool, level: aiToolLevel(tool), result, detail: String(detail || "").slice(0, 120) }); if (a.length > 20) a.splice(0, a.length - 20); };
  // 27.11 the clerk wants to use a tool: denied tools are logged and refused; "approve" tools become pending proposals
  function clerkTool(b, tool, args) {
    const lv = aiToolLevel(tool);
    if (lv === "deny") return audit(b, tool, "denied", args?.why), { ok: false, denied: true };
    if (lv === "approve") {
      const P = (b.clerk.pending ||= []).filter((x) => x.at > Date.now() - 864e5);
      b.clerk.pending = P;
      if (P.length >= 5 || P.some((x) => x.tool === tool && x.item === args.item)) return { ok: false, dup: true };
      const pr = { pid: String((b.clerk.pseq = (b.clerk.pseq || 0) + 1)), tool, ...args, at: Date.now() };
      P.push(pr);
      audit(b, tool, "proposed", `${args.name}: ${args.from} -> ${args.to} FYC`);
      return { ok: true, proposal: pr };
    }
    audit(b, tool, "done", args?.why);
    return { ok: true };
  }
  // price ideas from this report's sales: a clear best-seller may go up 10%, an unsold item (when others sell) down 10%
  function priceIdeas(b, rec, n) {
    if (n < 3 || b.clerk.perms?.prices === "off") return;
    const cnt = rec.reduce((o, x) => ((o[x.item] = (o[x.item] || 0) + 1), o), {});
    const top = b.menu.filter((x) => (cnt[x.name] || 0) >= 3 && cnt[x.name] / n >= 0.5).sort((x, y) => cnt[y.name] - cnt[x.name])[0];
    if (top) { const to = Math.min(5e3, Math.max(top.price + 1, Math.round(top.price * 1.1))); clerkTool(b, "price.suggest", { item: top.i, name: top.name, from: top.price, to, why: `${cnt[top.name]} of ${n} sales` }); }
    const flop = b.menu.filter((x) => !cnt[x.name] && x.price > 1).sort((x, y) => y.price - x.price)[0];
    if (flop) { const to = Math.max(1, Math.min(flop.price - 1, Math.round(flop.price * 0.9))); clerkTool(b, "price.suggest", { item: flop.i, name: flop.name, from: flop.price, to, why: `no sales while ${n} other sales` }); }
  }
  const pub = (b, full) => ({ id: b.id, name: b.name, kind: b.kind, plot: b.plot, owner: b.owner, ownerName: d.shown(b.owner), menu: b.menu, open: openNow(b), clerk: clerkPub(b), ...(full ? { reports: (b.clerk?.reports || []).slice(-5).reverse(), pending: (b.clerk?.pending || []).filter((x) => x.at > Date.now() - 864e5), audit: (b.clerk?.audit || []).slice(-8).reverse(), perms: { prices: b.clerk?.perms?.prices || "approve" } } : {}), ...(full ? { balance: bank2.bal(acctId(b)), sales: b.sales, revenue: b.revenue, recent: (b.recent || []).slice(-20).reverse() } : {}) });
  const byPlot = (plotId) => Object.values(Z.list).find((b) => b.plot === plotId && !b.closed);
  const mine = (uid) => Object.values(Z.list).filter((b) => b.owner === uid && !b.closed);
  const near = (me, plotId) => {
    const p = estatePlotById(String(plotId));
    return !!p && (me.scene || "plaza") === "plaza" && Math.hypot((me.x || 0) - p.x, (me.z || 0) - p.z) < 16;
  };
  function close(b, why) {
    const bal = bank2.bal(acctId(b));
    if (bal > 0) bank2.transfer(acctId(b), b.owner, bal, `Business ${b.name} closed: balance paid out`);
    b.closed = Date.now();
    b.closedWhy = why;
    d.save();
    d.broadcast({ t: "biz_update", biz: { [b.plot]: null } });
  }
  // the plot changed hands or the lease ended: the business goes with the holder
  function sweep() {
    for (const b of Object.values(Z.list)) if (!b.closed && holderOf(b.plot) !== b.owner) close(b, "plot no longer held");
  }
  setInterval(sweep, +(process.env.BIZ_SWEEP_MS || 3e4));
  // 27.10 clerk sales report since the last one: counts and top item from the business's own sales log
  function report(b) {
    const c = b.clerk, since = c.lastAt || c.hiredAt || 0, rec = (b.recent || []).filter((x) => x.at > since);
    const n = b.sales - (c.lastSales || 0), rev = Math.round((b.revenue - (c.lastRev || 0)) * 100) / 100;
    const top = Object.entries(rec.reduce((o, x) => ((o[x.item] = (o[x.item] || 0) + 1), o), {})).sort((x, y) => y[1] - x[1])[0];
    const text = n > 0 ? `${c.name} at ${b.name}: ${n} sale${n > 1 ? "s" : ""} since the last report, +${rev} FYC to the business${top ? `; most popular: ${top[0]} (${top[1]})` : ""}.` : `${c.name} at ${b.name}: no sales since the last report.${b.menu.length ? "" : " The menu is empty: add offers so customers can buy."}`;
    Object.assign(c, { lastAt: Date.now(), lastSales: b.sales, lastRev: b.revenue });
    clerkTool(b, "report.write", { why: `${n} sales` });
    priceIdeas(b, rec, n);
    (c.reports ||= []).push({ at: Date.now(), text, sales: n, revenue: rev });
    if (c.reports.length > 10) c.reports.splice(0, c.reports.length - 10);
    d.save();
    const l = d.liveOf(b.owner);
    if (l) d.send(l.ws, { t: "note", text });
    return text;
  }
  setInterval(() => { for (const b of Object.values(Z.list)) if (!b.closed && b.clerk?.on) report(b); }, +(process.env.BIZ_REPORT_MS || 18e5));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("biz_")) return false;
    const u = me.u, reply = (x) => d.send(me.ws, x), err = (text) => reply({ t: "err", text });
    const b = m.id != null ? own(Z.list, String(m.id)) && Z.list[String(m.id)] : null;
    const isOwner = b && !b.closed && b.owner === u.id;
    switch (m.t) {
      case "biz_state": {
        sweep();
        const pl = m.plot ? byPlot(String(m.plot)) : null;
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pl ? pub(pl, pl.owner === u.id) : null, plot: m.plot ? String(m.plot) : null });
        return true;
      }
      case "biz_register": {
        const plotId = String(m.plot || "");
        if (!estatePlotById(plotId) || holderOf(plotId) !== u.id) return err("Register a business on a plot you own or rent."), true;
        if (byPlot(plotId)) return err("This plot already has a business."), true;
        if (mine(u.id).length >= BIZ_MAX) return err(`A citizen can run up to ${BIZ_MAX} businesses.`), true;
        if (bank2.acct(u.id).banned) return err("This account is suspended."), true;
        const name = d.filter(d.clean(m.name, 32));
        if (name.length < 3) return err("Give the business a name (3-32 letters)."), true;
        const kind = BIZ_KINDS.includes(m.kind) ? m.kind : "shop";
        if (!bank2.transfer(u.id, "treasury", BIZ_FEE, `Business registration: ${name}`)) return err(`Registration costs ${BIZ_FEE} FYC.`), true;
        const id = String(Z.seq++);
        Z.list[id] = { id, name, kind, plot: plotId, owner: u.id, menu: [], open: true, sales: 0, revenue: 0, recent: [], at: Date.now() };
        d.save();
        reply({ t: "ok", text: `${name} is registered on plot ${plotId}.` });
        d.broadcast({ t: "biz_update", biz: { [plotId]: pub(Z.list[id]) } });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(Z.list[id], true), plot: plotId });
        return true;
      }
      case "biz_menu": {
        if (!isOwner) return err("Only the owner can change the menu."), true;
        const items = (Array.isArray(m.menu) ? m.menu : []).slice(0, 8).map((x) => ({ name: d.filter(d.clean(x && x.name, 40)), price: Math.round(+(x && x.price) || 0) })).filter((x) => x.name.length >= 2 && x.price >= 1 && x.price <= 5e3);
        b.menu = items.map((x, i) => ({ i, ...x }));
        b.open = m.open !== false;
        d.save();
        d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
        reply({ t: "ok", text: "Menu saved." });
        return true;
      }
      case "biz_staff": {
        if (!isOwner) return err("Only the owner can staff the business."), true;
        if (m.on === false) {
          if (b.clerk) b.clerk.on = false;
        } else {
          const staffed = Object.values(Z.list).filter((x) => !x.closed && x.clerk?.on && x.id !== b.id).length;
          if (!b.clerk?.on && staffed >= BIZ_CLERKS_MAX) return err("The city has no AI clerks free right now. Try later."), true;
          const name = d.filter(d.clean(m.name, 20)) || b.clerk?.name || "Clerk";
          const hr = (v) => Number.isInteger(+v) && +v >= 0 && +v <= 23 ? +v : null;
          const hours = m.hours && hr(m.hours.open) != null && hr(m.hours.close) != null && +m.hours.open !== +m.hours.close ? { open: +m.hours.open, close: +m.hours.close } : null;
          b.clerk = { ...(b.clerk || { hiredAt: Date.now(), lastSales: b.sales, lastRev: b.revenue, lastAt: Date.now() }), name: name.length >= 2 ? name : "Clerk", on: true, hours, perms: { prices: m.prices === "off" ? "off" : "approve" } };
          if (m.prices === "off") b.clerk.pending = [];
        }
        d.save();
        d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
        reply({ t: "ok", text: b.clerk?.on ? `${b.clerk.name} now staffs ${b.name}${b.clerk.hours ? ` (${b.clerk.hours.open}:00\u2013${b.clerk.hours.close}:00)` : ""}.` : `${b.name} has no AI clerk now.` });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_report": {
        if (!isOwner) return err("Only the owner can ask for the report."), true;
        if (!b.clerk?.on) return err("Staff the business with an AI clerk first."), true;
        report(b);
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_approve": {
        if (!isOwner) return err("Only the owner can approve the clerk's proposals."), true;
        const P = b.clerk?.pending || [], k = P.findIndex((x) => x.pid === String(m.pid));
        if (k < 0) return err("That proposal is gone (expired or already decided)."), true;
        const pr = P.splice(k, 1)[0], it = b.menu.find((x) => x.i === pr.item && x.name === pr.name);
        if (m.ok === true && it && it.price === pr.from && pr.to >= 1 && pr.to <= 5e3) {
          it.price = pr.to;
          audit(b, pr.tool, "approved", `${pr.name}: ${pr.from} -> ${pr.to} FYC`);
          d.broadcast({ t: "biz_update", biz: { [b.plot]: pub(b) } });
          reply({ t: "ok", text: `${pr.name} now costs ${pr.to} FYC.` });
        } else {
          audit(b, pr.tool, m.ok === true ? "stale" : "rejected", `${pr.name}: ${pr.from} -> ${pr.to} FYC`);
          reply({ t: "ok", text: m.ok === true ? "The menu changed since the proposal; nothing was changed." : "Proposal rejected." });
        }
        d.save();
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_buy": {
        if (!b || b.closed || !openNow(b)) return err(b?.clerk?.on && b.clerk.hours ? `${b.name} is open ${b.clerk.hours.open}:00\u2013${b.clerk.hours.close}:00.` : "This business is closed."), true;
        if (b.owner === u.id) return err("You can't buy from your own business."), true;
        if (!near(me, b.plot)) return err(`Visit ${b.name} at plot ${b.plot} to buy.`), true;
        const it = b.menu.find((x) => x.i === Math.round(+m.item));
        if (!it) return err("That is not on the menu."), true;
        if (m.price != null && +m.price !== it.price) return reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b), plot: b.plot }), err("The price changed. Check and buy again."), true;
        const tax = Math.round(it.price * BIZ_TAX * 100) / 100;
        if ((bank2.acct(u.id).bal || 0) < it.price) return err(`You need ${it.price} FYC.`), true;
        if (!bank2.transfer(u.id, acctId(b), it.price - tax, `${b.name}: ${it.name}`)) return err(`You need ${it.price} FYC.`), true;
        if (tax > 0) bank2.transfer(u.id, "treasury", tax, `Sales tax 5%: ${b.name}`);
        b.sales++;
        b.revenue = Math.round((b.revenue + it.price - tax) * 100) / 100;
        (b.recent ||= []).push({ item: it.name, price: it.price, buyer: d.shown(u.id), at: Date.now() });
        if (b.recent.length > 50) b.recent.splice(0, b.recent.length - 50);
        d.save();
        reply({ t: "ok", text: `${it.name} from ${b.name}: ${it.price} FYC.` });
        const l = d.liveOf(b.owner);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} bought ${it.name} at ${b.name} (+${Math.round((it.price - tax) * 100) / 100} FYC to the business).` });
        return true;
      }
      case "biz_withdraw":
      case "biz_deposit": {
        if (!isOwner) return err("Only the owner can move business money."), true;
        const amt = Math.round((+m.amount || 0) * 100) / 100;
        if (!(amt > 0) || amt > 1e7) return err("Enter an amount."), true;
        const ok2 = m.t === "biz_withdraw" ? bank2.transfer(acctId(b), u.id, amt, `Withdrawal from ${b.name}`) : bank2.transfer(u.id, acctId(b), amt, `Deposit to ${b.name}`);
        if (!ok2) return err(m.t === "biz_withdraw" ? "The business doesn't have that much." : "Not enough FYC."), true;
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: pub(b, true), plot: b.plot });
        return true;
      }
      case "biz_close": {
        if (!isOwner) return err("Only the owner can close the business."), true;
        close(b, "closed by the owner");
        reply({ t: "ok", text: `${b.name} is closed. Its balance was paid to you.` });
        reply({ t: "biz_state", mine: mine(u.id).map((x) => pub(x, true)), here: null, plot: b.plot });
        return true;
      }
    }
    return true;
  }
  const all = () => Object.fromEntries(Object.values(Z.list).filter((b) => !b.closed).map((b) => [b.plot, pub(b)]));
  const bizInfo = (id) => { const b = own(Z.list, String(id)) && Z.list[String(id)]; return b && !b.closed ? { ...pub(b), hoursNow: hourNow() } : null; };
  // a customer asked the clerk for something it may never do (27.11): logged against the business
  const clerkDenied = (id, tool, why) => { const b = own(Z.list, String(id)) && Z.list[String(id)]; if (b && !b.closed && b.clerk?.on) clerkTool(b, tool, { why }), d.save(); };
  return { onMessage: onMessage2, all, sweep, bizInfo, clerkDenied };
}
