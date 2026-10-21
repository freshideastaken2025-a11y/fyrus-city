// server/market.ts
var TYPES2 = ["skill", "course", "digital", "physical", "brand"];
var H = 36e5;
var INSPECT_MS = +(process.env.INSPECT_MS || 72 * H);
var RESPOND_MS = +(process.env.RESPOND_MS || 48 * H);
var MIN_AUCTION_MS = +(process.env.MIN_AUCTION_MS || H);
var SNIPE_MS = +(process.env.SNIPE_MS ?? 12e4);
var FEE = 0.05;
var BOND_LIMIT = 1e3;
var bondNeeded = (price) => price > BOND_LIMIT ? Math.max(500, Math.round(price * 0.1)) : 0;
var BANNED_GOODS = /\b(gun|guns|pistol|rifle|ammo|ammunition|explosive|grenade|cocaine|heroin|meth|weed|cannabis|marijuana|opioid|fentanyl|steroid|counterfeit|replica|fake id|fake passport|stolen|hacked account|credit card dump|cvv|malware|ransomware|keylogger|botnet|ddos|escort|adult content|porn)\b/i;
var SCAM_WORDS = /\b(pay outside|outside fyrus|whatsapp me|telegram me|western union|gift ?card|bitcoin|crypto wallet|usdt|send your password|verify your account|seed phrase|private key|guaranteed profit|double your money)\b/i;
var BAD_LINK = /(https?:\/\/)?(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|cutt\.ly|rb\.gy|grabify|iplogger)\b|http:\/\/|\.(exe|scr|bat|cmd|msi|apk|jar|vbs|ps1)(\?|\b)/i;
function sentinel(text, price, type) {
  if (BANNED_GOODS.test(text)) return "Sentinel blocked this listing: prohibited goods or services.";
  if (SCAM_WORDS.test(text)) return "Sentinel blocked this listing: it asks for payment or contact outside Fyrus, or for secrets.";
  if (BAD_LINK.test(text)) return "Sentinel blocked a link: use https links to normal sites, no link shorteners or program files.";
  if (!(price >= 1) || price > 1e6) return "Sentinel: price must be between 1 and 1,000,000 FYC.";
  if (type === "digital" && price > 5e4) return "Sentinel: digital items above 50,000 FYC need a manual review. Lower the price.";
  return null;
}
function createMarket(d) {
  if (!d.db.market) {
    d.db.market = { listings: {}, orders: {} };
    d.save();
  }
  const K = d.db.market;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pushMine = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, mine(id));
  };
  const changed = () => {
    d.save();
    d.broadcast({ t: "mk_changed" });
  };
  const pub2 = (l) => ({ ...l, delivery: void 0, hasDelivery: !!l.delivery, bids: (l.bids || []).slice(-10).map((b) => ({ name: b.name, amount: b.amount, at: b.at })), topBid: l.bids?.length ? l.bids[l.bids.length - 1].amount : void 0, trust: trustOf(l.seller) });
  const trustOf = (id) => {
    const a = bank2.acct(id);
    return { sales: a.sales, bond: a.bond, strikes: a.strikes, tier: a.strikes ? "Warned" : a.sales >= 25 && a.bond >= 2e3 ? "Gold" : a.sales >= 5 ? "Trusted" : a.bond >= 500 ? "Bonded" : "New" };
  };
  bank2.setHeld((id) => Object.values(K.listings).reduce((s, l) => s + (l.status === "active" && l.bids?.length && l.bids[l.bids.length - 1].user === id ? l.bids[l.bids.length - 1].amount : 0), 0));
  bank2.setBusy((id) => Object.values(K.orders).some((o) => o.seller === id && !["released", "refunded"].includes(o.status)) || Object.values(K.listings).some((l) => l.seller === id && l.status === "active" && l.price > BOND_LIMIT));
  function mine(id) {
    const os = Object.values(K.orders);
    return {
      t: "mk_mine",
      listings: Object.values(K.listings).filter((l) => l.seller === id && l.status !== "removed").map((l) => ({ ...pub2(l), delivery: l.delivery })),
      bought: os.filter((o) => o.buyer === id).map((o) => ({ ...o, address: o.address })).sort((a, b) => b.at - a.at),
      sold: os.filter((o) => o.seller === id).sort((a, b) => b.at - a.at),
      court: d.isAdmin(id) ? os.filter((o) => o.status === "review" || o.status === "disputed") : void 0,
      admin: d.isAdmin(id),
      trust: trustOf(id)
    };
  }
  function makeOrder(l, buyer, amount, address) {
    const days = l.type === "physical" ? (l.shipDays || 7) + 2 : l.type === "skill" ? (l.skillDays || 5) + 2 : 1;
    const o = { id: "o" + d.rid(7), listing: l.id, title: l.title, type: l.type, buyer: buyer.id, buyerName: buyer.name, seller: l.seller, sellerName: l.sellerName, amount, status: "paid", at: Date.now(), dueBy: Date.now() + days * 24 * H, address };
    if ((l.type === "digital" || l.type === "course") && l.delivery) {
      o.status = "delivered";
      o.deliveredAt = Date.now();
      o.inspectUntil = Date.now() + INSPECT_MS;
    }
    K.orders[o.id] = o;
    l.sold++;
    if (l.type === "physical" || l.type === "brand") l.stock = Math.max(0, l.stock - 1);
    if (l.mode === "fixed" && l.stock <= 0 && (l.type === "physical" || l.type === "brand")) l.status = "sold";
    bank2.acct(buyer.id).bought++;
    d.save();
    note(l.seller, `New order: ${l.title} (${amount.toLocaleString("en-US")} FYC held in escrow).`);
    pushMine(l.seller);
    return o;
  }
  function release(o, why) {
    if (!["paid", "delivered"].includes(o.status)) return;
    const fee = Math.round(o.amount * FEE * 100) / 100;
    bank2.transfer("escrow", o.seller, o.amount - fee, `Sale released: ${o.title}`);
    if (fee > 0) bank2.transfer("escrow", "treasury", fee, `Market fee 5%: ${o.title}`);
    o.status = "released";
    o.closedAt = Date.now();
    bank2.acct(o.seller).sales++;
    d.save();
    note(o.seller, `Payment released for "${o.title}" (${why}).`);
    d.news?.("market", `Sold on Fyrus Market: "${o.title}" for ${o.amount.toLocaleString("en-US")} FYC`);
    pushMine(o.seller);
    pushMine(o.buyer);
  }
  function refund(o, why, strike) {
    if (["released", "refunded"].includes(o.status)) return;
    bank2.transfer("escrow", o.buyer, o.amount, `Refund: ${o.title}`);
    o.status = "refunded";
    o.closedAt = Date.now();
    const l = K.listings[o.listing];
    if (l && (l.type === "physical" || l.type === "brand")) l.stock++;
    if (strike) {
      const a = bank2.acct(o.seller);
      a.strikes++;
      if (a.strikes >= 3) ban(o.seller, "three court rulings against this seller");
    }
    d.save();
    note(o.buyer, `Refunded ${o.amount.toLocaleString("en-US")} FYC for "${o.title}" (${why}).`);
    note(o.seller, `Order "${o.title}" was refunded to the buyer (${why}).`);
    pushMine(o.buyer);
    pushMine(o.seller);
    bank2.notify(o.seller);
  }
  function ban(id, why) {
    const a = bank2.acct(id);
    if (a.banned) return;
    a.banned = true;
    Object.values(K.listings).filter((l) => l.seller === id && l.status === "active").forEach((l) => {
      refundBids(l);
      l.status = "removed";
    });
    Object.values(K.orders).filter((o) => o.seller === id && ["paid", "delivered", "disputed", "review"].includes(o.status)).forEach((o) => refund(o, "seller banned", false));
    if (a.bond) {
      bank2.transfer("escrow", "treasury", a.bond, "Bond forfeited (seller banned)");
      a.bond = 0;
    }
    d.save();
    note(id, `Your seller account is permanently banned by the Fyrus Court: ${why}.`);
    changed();
  }
  function refundBids(l) {
    const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
    if (top) bank2.transfer("escrow", top.user, top.amount, `Bid returned: ${l.title}`);
  }
  function finishAuction(l) {
    if (l.status !== "active" || l.mode !== "auction") return;
    const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
    if (!top || l.reserve && top.amount < l.reserve) {
      if (top) refundBids(l);
      l.status = "ended";
      note(l.seller, `Auction ended without a sale: ${l.title}${top ? " (reserve not met)" : ""}.`);
      if (top) note(top.user, `Auction "${l.title}" ended below the reserve. Your bid is back.`);
      changed();
      return;
    }
    l.status = "sold";
    makeOrder(l, { id: top.user, name: top.name }, top.amount);
    note(top.user, `You won "${l.title}" for ${top.amount.toLocaleString("en-US")} FYC. It is safe in escrow.`);
    pushMine(top.user);
    changed();
  }
  setInterval(() => {
    const now = Date.now();
    Object.values(K.listings).forEach((l) => {
      if (l.status === "active" && l.mode === "auction" && l.endsAt && now >= l.endsAt) finishAuction(l);
    });
    Object.values(K.orders).forEach((o) => {
      if (o.status === "delivered" && o.inspectUntil && now >= o.inspectUntil) release(o, "inspection window ended");
      else if (o.status === "disputed" && o.dispute && now >= o.dispute.respondBy && !o.dispute.sellerText) {
        o.dispute.ruling = "Seller did not answer in time: refunded automatically.";
        o.dispute.ruledBy = "Fyrus Court (automatic)";
        o.dispute.ruledAt = now;
        refund(o, "seller did not answer the dispute", true);
      }
    });
  }, +(process.env.MARKET_TICK_MS || 15e3));
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("mk_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const a = bank2.acct(u.id);
    const myOrder = (id, as) => {
      const o = K.orders[String(id)];
      return o && o[as] === u.id ? o : void 0;
    };
    switch (m.t) {
      case "mk_list":
        reply({ t: "mk_list", listings: Object.values(K.listings).filter((l) => l.status === "active").map(pub2).sort((x, y) => y.at - x.at), now: Date.now() });
        return true;
      case "mk_mine":
        reply(mine(u.id));
        return true;
      case "mk_create": {
        if (a.banned) {
          err("This account is banned from selling.");
          return true;
        }
        const type = TYPES2.includes(m.type) ? m.type : null;
        const title = d.clean(m.title, 80);
        const desc = String(m.desc || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").slice(0, 2e3);
        const price = Math.round(+m.price || 0);
        const mode = m.mode === "auction" ? "auction" : "fixed";
        const delivery = String(m.delivery || "").slice(0, 2e3);
        if (!type || title.length < 4) {
          err("Pick a seller type and a title of at least 4 letters.");
          return true;
        }
        const bad = sentinel(`${title} ${desc} ${delivery}`, price, type);
        if (bad) {
          err(bad);
          return true;
        }
        if ((type === "digital" || type === "course") && !delivery.trim()) {
          err("Add what the buyer receives (a download link, licence key or the content itself). It stays hidden until they pay.");
          return true;
        }
        const need = Math.max(bondNeeded(price), type === "brand" ? 2e3 : 0);
        if (a.bond < need) {
          err(`This listing needs a seller bond of ${need.toLocaleString("en-US")} FYC (you have ${a.bond.toLocaleString("en-US")}). Stake it in the Sell tab; you get it back when you stop selling.`);
          return true;
        }
        if (Object.values(K.listings).filter((l2) => l2.seller === u.id && l2.status === "active").length >= 30) {
          err("You can have up to 30 active listings.");
          return true;
        }
        const hours = Math.max(MIN_AUCTION_MS / H, Math.min(168, +m.hours || 24));
        const l = {
          id: "l" + d.rid(7),
          seller: u.id,
          sellerName: u.name,
          type,
          title,
          desc,
          price,
          mode,
          stock: type === "physical" || type === "brand" ? Math.max(1, Math.min(9999, Math.round(+m.stock || 1))) : 9999,
          shipDays: type === "physical" || type === "brand" ? Math.max(1, Math.min(60, Math.round(+m.shipDays || 7))) : void 0,
          skillDays: type === "skill" ? Math.max(1, Math.min(90, Math.round(+m.skillDays || 5))) : void 0,
          icon: d.clean(m.icon, 4) || "\u25C6",
          color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#2f6fe0",
          delivery: delivery || void 0,
          status: "active",
          sold: 0,
          at: Date.now(),
          ...mode === "auction" ? { endsAt: Date.now() + hours * H, reserve: Math.max(0, Math.round(+m.reserve || 0)) || void 0, bids: [] } : {}
        };
        K.listings[l.id] = l;
        changed();
        d.news?.("market", `New on Fyrus Market: "${l.title}" \xB7 ${l.mode === "auction" ? "auction from" : ""} ${l.price.toLocaleString("en-US")} FYC`.replace("\xB7  ", "\xB7 "));
        reply(mine(u.id));
        reply({ t: "ok", text: mode === "auction" ? "Auction is live." : "Listing is live in Fyrus Market." });
        return true;
      }
      case "mk_remove": {
        const l = K.listings[m.id];
        if (!l || l.seller !== u.id) return true;
        if (l.mode === "auction" && l.bids?.length) {
          err("An auction with bids cannot be removed.");
          return true;
        }
        l.status = "removed";
        changed();
        reply(mine(u.id));
        return true;
      }
      case "mk_buy": {
        const l = K.listings[m.id];
        if (!l || l.status !== "active" || l.mode !== "fixed") {
          err("This item is not for sale any more.");
          return true;
        }
        if (l.seller === u.id) {
          err("That is your own listing.");
          return true;
        }
        if (a.banned) {
          err("This account is suspended.");
          return true;
        }
        const address = l.type === "physical" || l.type === "brand" ? d.clean(m.address, 300) : void 0;
        if ((l.type === "physical" || l.type === "brand") && (!address || address.length < 10)) {
          err("Add your delivery address (only the seller sees it).");
          return true;
        }
        if (!bank2.transfer(u.id, "escrow", l.price, `Escrow: ${l.title}`)) {
          err("Not enough FYC.");
          return true;
        }
        const o = makeOrder(l, u, l.price, address);
        changed();
        reply(mine(u.id));
        reply({ t: "ok", text: o.status === "delivered" ? "Paid into escrow. Your item is ready in My orders." : "Paid into escrow. The seller has been told." });
        return true;
      }
      case "mk_bid": {
        const l = K.listings[m.id];
        const amount = Math.round(+m.amount || 0);
        if (!l || l.status !== "active" || l.mode !== "auction") {
          err("This auction is closed.");
          return true;
        }
        if (l.seller === u.id) {
          err("You cannot bid on your own auction.");
          return true;
        }
        if (a.banned) {
          err("This account is suspended.");
          return true;
        }
        const top = l.bids?.length ? l.bids[l.bids.length - 1] : void 0;
        const min = top ? top.amount + Math.max(1, Math.round(top.amount * 0.05)) : l.price;
        if (amount < min) {
          err(`The lowest bid now is ${min.toLocaleString("en-US")} FYC.`);
          return true;
        }
        if (top && top.user === u.id) {
          if (!bank2.transfer(u.id, "escrow", amount - top.amount, `Bid raised: ${l.title}`)) {
            err("Not enough FYC.");
            return true;
          }
        } else {
          if (!bank2.transfer(u.id, "escrow", amount, `Bid held: ${l.title}`)) {
            err("Not enough FYC.");
            return true;
          }
          if (top) {
            bank2.transfer("escrow", top.user, top.amount, `Outbid, bid returned: ${l.title}`);
            note(top.user, `You were outbid on "${l.title}". Your ${top.amount.toLocaleString("en-US")} FYC is back.`);
          }
        }
        l.bids.push({ user: u.id, name: u.name, amount, at: Date.now() });
        if (l.endsAt && SNIPE_MS && l.endsAt - Date.now() < SNIPE_MS) l.endsAt += SNIPE_MS;
        changed();
        bank2.notify(u.id);
        reply({ t: "ok", text: `You lead with ${amount.toLocaleString("en-US")} FYC (held in escrow until the auction ends).` });
        return true;
      }
      case "mk_deliver": {
        const o = myOrder(m.order, "seller");
        if (!o || o.status !== "paid") {
          err("Nothing to deliver on that order.");
          return true;
        }
        o.note = d.clean(m.note, 1e3);
        o.tracking = d.clean(m.tracking, 80) || void 0;
        if (sentinel(o.note || "", 1, o.type)) {
          err("Sentinel blocked this message.");
          return true;
        }
        o.status = "delivered";
        o.deliveredAt = Date.now();
        o.inspectUntil = Date.now() + INSPECT_MS + (o.type === "physical" || o.type === "brand" ? (K.listings[o.listing]?.shipDays || 7) * 24 * H : 0);
        d.save();
        note(o.buyer, `"${o.title}" was ${o.type === "physical" || o.type === "brand" ? "shipped" : "delivered"}. Check it and confirm, or open a dispute before the window ends.`);
        pushMine(o.buyer);
        reply(mine(u.id));
        return true;
      }
      case "mk_open": {
        const o = myOrder(m.order, "buyer");
        const l = o && K.listings[o.listing];
        if (!o || !l) return true;
        o.opened = true;
        d.save();
        reply({ t: "mk_delivery", order: o.id, content: l.delivery || o.note || "" });
        return true;
      }
      case "mk_confirm": {
        const o = myOrder(m.order, "buyer");
        if (!o || !["paid", "delivered"].includes(o.status)) return true;
        release(o, "buyer confirmed");
        reply({ t: "ok", text: "Payment released to the seller. Thank you!" });
        return true;
      }
      case "mk_dispute": {
        const o = myOrder(m.order, "buyer");
        if (!o || !["paid", "delivered"].includes(o.status)) {
          err("This order cannot be disputed now.");
          return true;
        }
        if (o.status === "paid" && Date.now() < o.dueBy && o.type !== "digital" && o.type !== "course") {
          err(`The seller still has time to deliver (until ${new Date(o.dueBy).toUTCString().slice(5, 22)} UTC). You can dispute after that, or once it is delivered.`);
          return true;
        }
        const reason = d.clean(m.reason, 600);
        if (reason.length < 10) {
          err("Explain what went wrong (at least 10 letters).");
          return true;
        }
        o.status = "disputed";
        o.dispute = { reason, evidence: d.clean(m.evidence, 600), at: Date.now(), respondBy: Date.now() + RESPOND_MS };
        d.save();
        note(o.seller, `Dispute opened on "${o.title}". Answer within 48 hours or the buyer is refunded automatically.`);
        pushMine(o.seller);
        reply(mine(u.id));
        reply({ t: "ok", text: "Payment frozen. The seller has 48 hours to answer." });
        return true;
      }
      case "mk_respond": {
        const o = myOrder(m.order, "seller");
        if (!o || o.status !== "disputed" || !o.dispute) return true;
        if (m.refund) {
          o.dispute.ruling = "Seller accepted the refund.";
          o.dispute.ruledBy = o.sellerName;
          o.dispute.ruledAt = Date.now();
          refund(o, "seller accepted", false);
          return true;
        }
        o.dispute.sellerText = d.clean(m.text, 800);
        if (!o.dispute.sellerText) {
          err("Write your answer.");
          return true;
        }
        o.status = "review";
        d.save();
        note(o.buyer, `The seller answered your dispute on "${o.title}". The Fyrus Court will review it.`);
        pushMine(o.buyer);
        reply(mine(u.id));
        return true;
      }
      case "mk_rule": {
        if (!d.isAdmin(u.id)) {
          err("Only Fyrus Court judges can rule.");
          return true;
        }
        const o = K.orders[m.order];
        if (!o || !["disputed", "review"].includes(o.status) || !o.dispute) return true;
        o.dispute.ruling = d.clean(m.note, 400) || (m.refund ? "Refund to the buyer." : "Payment to the seller.");
        o.dispute.ruledBy = `Judge ${u.name}`;
        o.dispute.ruledAt = Date.now();
        if (m.refund) refund(o, "Fyrus Court ruling", true);
        else {
          o.status = "delivered";
          release(o, "Fyrus Court ruling");
        }
        if (m.ban) ban(o.seller, d.clean(m.note, 200) || "fraud proven in court");
        d.news?.("court", `Fyrus Court ruled on a market dispute: ${m.refund ? "the buyer was refunded" : "payment went to the seller"}${m.ban ? "; the seller is permanently banned" : ""}`);
        reply(mine(u.id));
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, release, refund, ban };
}

