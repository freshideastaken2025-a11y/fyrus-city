// server/estate.ts
var H2 = 36e5;
var RENT_PERIOD_MS = +(process.env.RENT_PERIOD_MS || 30 * 24 * H2);
var TAX = 0.05;
function createEstate(d) {
  if (!d.db.estate) {
    d.db.estate = { plots: {}, studios: {}, passes: {} };
    d.save();
  }
  const E2 = d.db.estate;
  const bank2 = d.bank;
  const isPassport = (id) => {
    const p = d.db.users[id]?.passport;
    return !!p && p.kind !== "visa";
  };
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pub2 = (id, p) => ({ id, owner: p.owner, ownerName: p.ownerName, style: p.style, sign: p.sign, sale: p.sale, rent: p.rent ? { price: p.rent.price, tenantName: p.rent.tenantName, tenant: p.rent.tenant, paidUntil: p.rent.paidUntil, ending: p.rent.ending } : void 0, auction: p.auction ? { endsAt: p.auction.endsAt, start: p.auction.start, reserve: !!p.auction.reserve, top: p.auction.bids.at(-1)?.amount, topName: p.auction.bids.at(-1)?.name, bids: p.auction.bids.length } : void 0 });
  const state = () => ({ t: "est_state", plots: Object.fromEntries(Object.entries(E2.plots).map(([k, v]) => [k, pub2(k, v)])), studios: Object.keys(E2.studios).length, now: Date.now() });
  const changed = (ids) => {
    d.save();
    d.broadcast({ t: "est_update", plots: Object.fromEntries(ids.map((k) => [k, E2.plots[k] ? pub2(k, E2.plots[k]) : null])) });
  };
  const mine = (uid) => ({ t: "est_mine", owned: Object.entries(E2.plots).filter(([, p]) => p.owner === uid).map(([k, p]) => pub2(k, p)), renting: Object.entries(E2.plots).filter(([, p]) => p.rent?.tenant === uid).map(([k, p]) => pub2(k, p)), studio: E2.studios[uid] || null, passes: (E2.passes[uid] || []).filter((p) => p.until > Date.now()), passport: isPassport(uid) });
  const pushMine = (uid) => {
    const l = d.liveOf(uid);
    if (l) d.send(l.ws, mine(uid));
  };
  const canEnterRoyal = (uid) => isPassport(uid) || (E2.passes[uid] || []).some((p) => p.until > Date.now()) || Object.entries(E2.plots).some(([k, p]) => k.startsWith("RS-") && (p.owner === uid || p.rent?.tenant === uid));
  function transferPlot(id, to, paid) {
    const p = E2.plots[id];
    const prevOwner = p?.owner;
    const tenant = p?.rent?.tenant ? p.rent : void 0;
    E2.plots[id] = { owner: to.id, ownerName: to.name, boughtAt: Date.now(), paid, style: p?.style, rent: tenant ? { ...tenant, ending: true } : void 0 };
    if (prevOwner && prevOwner !== to.id) pushMine(prevOwner);
    pushMine(to.id);
  }
  function finishAuction(id) {
    const p = E2.plots[id];
    const a = p?.auction;
    if (!p || !a) return;
    const top = a.bids.at(-1);
    p.auction = void 0;
    if (!top || a.reserve && top.amount < a.reserve) {
      if (top) {
        bank2.transfer("escrow", top.user, top.amount, `Bid returned: plot ${id}`);
        note(top.user, `Auction for plot ${id} ended below the reserve. Your bid is back.`);
      }
      note(p.owner, `Your auction for plot ${id} ended without a sale.`);
      changed([id]);
      return;
    }
    const tax = isPassport(p.owner) ? 0 : Math.round(top.amount * TAX);
    const seller = p.owner;
    bank2.transfer("escrow", seller, top.amount - tax, `Plot ${id} sold at auction`);
    if (tax) bank2.transfer("escrow", "treasury", tax, `Land transfer tax 5%: ${id}`);
    transferPlot(id, { id: top.user, name: top.name }, top.amount);
    note(top.user, `You won plot ${id} for ${top.amount.toLocaleString("en-US")} FYC. The title is yours.`);
    note(seller, `Plot ${id} sold at auction for ${top.amount.toLocaleString("en-US")} FYC.`);
    changed([id]);
    d.news?.("property", `Auction: plot ${id} sold for ${top.amount.toLocaleString("en-US")} FYC`);
  }
  function collectRent(id) {
    const p = E2.plots[id];
    const r = p?.rent;
    if (!p || !r?.tenant || !r.paidUntil || Date.now() < r.paidUntil) return;
    if (r.ending || !bank2.transfer(r.tenant, p.owner, r.price, `Rent: plot ${id}`)) {
      const t = r.tenant;
      note(t, r.ending ? `Your lease on plot ${id} has ended.` : `Your lease on plot ${id} ended: not enough FYC for this month's rent.`);
      note(p.owner, `The lease on plot ${id} ended. It is free to rent again.`);
      p.rent = r.ending ? void 0 : { price: r.price };
      pushMine(t);
      pushMine(p.owner);
      changed([id]);
      return;
    }
    r.paidUntil += RENT_PERIOD_MS;
    note(p.owner, `Rent received for plot ${id}: ${r.price.toLocaleString("en-US")} FYC.`);
    d.save();
    pushMine(p.owner);
    pushMine(r.tenant);
  }
  setInterval(() => {
    const now = Date.now();
    for (const [id, p] of Object.entries(E2.plots)) {
      if (p.auction && now >= p.auction.endsAt) finishAuction(id);
      if (p.rent?.tenant && p.rent.paidUntil && now >= p.rent.paidUntil) collectRent(id);
    }
  }, +(process.env.ESTATE_TICK_MS || 15e3));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("est_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const plot = m.plot ? estatePlotById(String(m.plot)) : void 0;
    const rec = plot ? E2.plots[plot.id] : void 0;
    const soc = plot ? societyById(plot.soc) : void 0;
    const banned = bank2.acct(u.id).banned;
    switch (m.t) {
      case "est_state":
        reply(state());
        reply(mine(u.id));
        return true;
      case "est_mine":
        reply(mine(u.id));
        return true;
      case "est_buy": {
        if (!plot || !soc) {
          err("No such plot.");
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        if (soc.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (!rec) {
          if (!plot.empty) {
            err("A resident lives here. It is not for sale.");
            return true;
          }
          if (!bank2.transfer(u.id, "treasury", plot.price, `Plot ${plot.id} in ${soc.name} (Land Office)`)) {
            err(`You need ${plot.price.toLocaleString("en-US")} FYC.`);
            return true;
          }
          transferPlot(plot.id, u, plot.price);
          changed([plot.id]);
          reply({ t: "ok", text: `Plot ${plot.id} in ${soc.name} is yours.` });
          d.news?.("property", `Land Office sold plot ${plot.id} in ${soc.name} for ${plot.price.toLocaleString("en-US")} FYC`);
          return true;
        }
        if (rec.owner === u.id) {
          err("You already own this plot.");
          return true;
        }
        if (!rec.sale) {
          err("The owner is not selling this plot.");
          return true;
        }
        const price = rec.sale;
        const tax = isPassport(u.id) ? 0 : Math.round(price * TAX);
        const seller = rec.owner;
        if (!bank2.transfer(u.id, seller, price, `Plot ${plot.id} bought from ${rec.ownerName}`)) {
          err(`You need ${price.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (tax && !bank2.transfer(u.id, "treasury", tax, `Land transfer tax 5%: ${plot.id}`)) {
        }
        transferPlot(plot.id, u, price);
        note(seller, `Plot ${plot.id} sold to ${u.name} for ${price.toLocaleString("en-US")} FYC.`);
        changed([plot.id]);
        d.news?.("property", `Plot ${plot.id} in ${soc.name} changed hands for ${price.toLocaleString("en-US")} FYC`);
        reply({ t: "ok", text: `Plot ${plot.id} is yours.` });
        return true;
      }
      case "est_list": {
        if (!plot || !rec || rec.owner !== u.id) {
          err("That is not your plot.");
          return true;
        }
        if (rec.auction?.bids.length) {
          err("This plot has bids. Wait for the auction to end.");
          return true;
        }
        const mode = String(m.mode);
        const price = Math.round(+m.price || 0);
        if (mode === "none") {
          if (rec.auction) rec.auction = void 0;
          rec.sale = void 0;
          if (rec.rent && !rec.rent.tenant) rec.rent = void 0;
          changed([plot.id]);
          reply(mine(u.id));
          return true;
        }
        if (!(price >= 1 && price <= 5e7)) {
          err("Enter a price between 1 and 50,000,000 FYC.");
          return true;
        }
        if (mode === "sale") {
          rec.sale = price;
          rec.auction = void 0;
        } else if (mode === "auction") {
          const hours = Math.max(+(process.env.MIN_AUCTION_MS || H2) / H2, Math.min(168, +m.hours || 24));
          rec.sale = void 0;
          rec.auction = { start: price, reserve: Math.max(0, Math.round(+m.reserve || 0)) || void 0, endsAt: Date.now() + hours * H2, bids: [] };
        } else if (mode === "rent") {
          if (rec.rent?.tenant) {
            err("It is already rented. End the lease first.");
            return true;
          }
          rec.rent = { price };
        } else {
          err("Pick sale, auction or rent.");
          return true;
        }
        changed([plot.id]);
        reply(mine(u.id));
        reply({ t: "ok", text: mode === "rent" ? `Plot ${plot.id} is up for rent at ${price.toLocaleString("en-US")} FYC a month.` : mode === "auction" ? `Auction for plot ${plot.id} is live.` : `Plot ${plot.id} is for sale.` });
        return true;
      }
      case "est_bid": {
        const a = rec?.auction;
        const amount = Math.round(+m.amount || 0);
        if (!plot || !rec || !a) {
          err("This plot is not at auction.");
          return true;
        }
        if (rec.owner === u.id) {
          err("You cannot bid on your own plot.");
          return true;
        }
        if (soc?.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        const top = a.bids.at(-1);
        const min = top ? top.amount + Math.max(1, Math.round(top.amount * 0.05)) : a.start;
        if (amount < min) {
          err(`The lowest bid now is ${min.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (top?.user === u.id) {
          if (!bank2.transfer(u.id, "escrow", amount - top.amount, `Bid raised: plot ${plot.id}`)) {
            err("Not enough FYC.");
            return true;
          }
        } else {
          if (!bank2.transfer(u.id, "escrow", amount, `Bid held: plot ${plot.id}`)) {
            err("Not enough FYC.");
            return true;
          }
          if (top) {
            bank2.transfer("escrow", top.user, top.amount, `Outbid, bid returned: plot ${plot.id}`);
            note(top.user, `You were outbid on plot ${plot.id}. Your FYC is back.`);
          }
        }
        a.bids.push({ user: u.id, name: u.name, amount, at: Date.now() });
        const snipe = +(process.env.SNIPE_MS ?? 12e4);
        if (snipe && a.endsAt - Date.now() < snipe) a.endsAt += snipe;
        changed([plot.id]);
        reply({ t: "ok", text: `You lead with ${amount.toLocaleString("en-US")} FYC.` });
        return true;
      }
      case "est_rent": {
        const r = rec?.rent;
        if (!plot || !rec || !r || r.tenant) {
          err("This plot is not available to rent.");
          return true;
        }
        if (rec.owner === u.id) {
          err("This is your own plot.");
          return true;
        }
        if (soc?.passport && !isPassport(u.id)) {
          err(`${soc.name} is for Fyrus passport holders.`);
          return true;
        }
        if (banned) {
          err("This account is suspended.");
          return true;
        }
        if (!bank2.transfer(u.id, rec.owner, r.price, `Rent (first month): plot ${plot.id}`)) {
          err(`You need ${r.price.toLocaleString("en-US")} FYC for the first month.`);
          return true;
        }
        rec.rent = { price: r.price, tenant: u.id, tenantName: u.name, since: Date.now(), paidUntil: Date.now() + RENT_PERIOD_MS };
        note(rec.owner, `${u.name} rented plot ${plot.id} for ${r.price.toLocaleString("en-US")} FYC a month.`);
        pushMine(rec.owner);
        changed([plot.id]);
        reply(mine(u.id));
        reply({ t: "ok", text: `You rent plot ${plot.id}. Rent is paid automatically each month.` });
        return true;
      }
      case "est_endlease": {
        const r = rec?.rent;
        if (!plot || !rec || !r?.tenant || r.tenant !== u.id && rec.owner !== u.id) return true;
        r.ending = true;
        note(r.tenant === u.id ? rec.owner : r.tenant, `The lease on plot ${plot.id} will end on ${new Date(r.paidUntil).toUTCString().slice(5, 16)}.`);
        changed([plot.id]);
        reply(mine(u.id));
        return true;
      }
      case "est_build": {
        if (!plot || !rec || rec.owner !== u.id && rec.rent?.tenant !== u.id) {
          err("Only the owner or tenant can build.");
          return true;
        }
        rec.style = Math.max(0, Math.min(3, Math.round(+m.style || 0)));
        rec.sign = d.clean(m.sign, 24) || void 0;
        changed([plot.id]);
        reply(mine(u.id));
        return true;
      }
      case "est_studio": {
        if (E2.studios[u.id]) {
          reply(mine(u.id));
          return true;
        }
        const used = new Set(Object.values(E2.studios));
        let k = 0;
        while (k < STUDIOS && used.has(studioId(k))) k++;
        if (k >= STUDIOS) {
          err("All studios are taken. New towers are coming.");
          return true;
        }
        E2.studios[u.id] = studioId(k);
        d.save();
        reply(mine(u.id));
        reply({ t: "ok", text: `Studio ${studioId(k)} in Starter Commons is yours, free.` });
        return true;
      }
      case "est_pass": {
        if (!canEnterRoyal(u.id)) {
          err("Only Royal Sky residents and passport holders can invite guests.");
          return true;
        }
        const g = d.findByNumber(String(m.number || ""));
        if (!g) {
          err("No citizen has that number.");
          return true;
        }
        E2.passes[g.id] = [...(E2.passes[g.id] || []).filter((p) => p.until > Date.now()), { by: u.id, byName: u.name, until: Date.now() + 24 * H2 }];
        d.save();
        note(g.id, `${u.name} invited you to Royal Sky Society. Your gate pass is valid for 24 hours.`);
        pushMine(g.id);
        reply({ t: "ok", text: `${g.name} can enter Royal Sky for 24 hours.` });
        return true;
      }
    }
    return true;
  }
  void SOCIETIES;
  return { onMessage: onMessage2, canEnterRoyal };
}

