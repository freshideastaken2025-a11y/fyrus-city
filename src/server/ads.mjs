// server/ads.ts
var DAY = +(process.env.AD_DAY_MS || 24 * 36e5);
var TICK = +(process.env.ADS_TICK_MS || 3e4);
function createAds(d) {
  if (!d.db.ads) {
    d.db.ads = { list: [], revenue: 0 };
    d.save();
  }
  const A = d.db.ads;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const live2 = (now = Date.now()) => A.list.filter((a) => !a.removed && a.start <= now && a.end > now);
  const pub2 = (a, img) => ({ id: a.id, spot: a.spot, ownerName: a.ownerName, brand: a.brand, headline: a.headline, color: a.color, category: a.category, image: img ? a.image : void 0, start: a.start, end: a.end, owner: a.owner });
  const freeFrom = (spot) => Math.max(Date.now(), ...A.list.filter((a) => a.spot === spot && !a.removed).map((a) => a.end));
  const state = () => {
    const now = Date.now();
    const cur = live2(now);
    return { t: "ads_state", live: cur.map((a) => pub2(a, true)), next: Object.fromEntries(Object.keys(AD_PRICES).map((s) => [s, freeFrom(s)])), queue: A.list.filter((a) => !a.removed && a.start > now).map((a) => pub2(a, false)), prices: AD_PRICES, revenue: A.revenue, now };
  };
  const mine = (uid) => ({ t: "ads_mine", list: A.list.filter((a) => a.owner === uid).slice(-30).reverse().map((a) => ({ ...pub2(a, false), paid: a.paid, removed: a.removed })) });
  let sig = "";
  const push = () => {
    const s = state();
    sig = s.live.map((a) => a.id).join(",");
    d.save();
    d.broadcast(s);
  };
  setInterval(() => {
    const now = Date.now();
    const ids = live2(now).map((a) => a.id).join(",");
    if (ids !== sig) push();
    if (A.list.length > 600) A.list = A.list.filter((a) => a.end > now - 30 * 24 * 36e5);
  }, TICK);
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !(m.t.startsWith("ad_") || m.t.startsWith("ads_"))) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "ads_state":
        reply(state());
        return true;
      case "ads_mine":
        reply(mine(u.id));
        return true;
      case "ad_book": {
        const spot = String(m.spot || "");
        if (!AD_PRICES[spot]) {
          err("No such billboard.");
          return true;
        }
        if (bank2.acct(u.id).banned) {
          err("This account is suspended.");
          return true;
        }
        const days = AD_DAYS.includes(+m.days) ? +m.days : 0;
        if (!days) {
          err("Pick 1, 7, 14 or 30 days.");
          return true;
        }
        const brand = d.filter(d.clean(m.brand, 30));
        const headline = d.filter(d.clean(m.headline, 26));
        if (brand.length < 2 || headline.length < 3) {
          err("Add a name and a headline.");
          return true;
        }
        const bad = sentinel(`${brand} ${headline}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this ad"));
          return true;
        }
        const image = typeof m.image === "string" && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(m.image) && m.image.length <= AD_IMAGE_MAX ? m.image : void 0;
        if (m.image && !image) {
          err("The poster must be a JPEG, PNG or WebP under 45 KB. Try a smaller image.");
          return true;
        }
        if (A.list.filter((a2) => a2.owner === u.id && !a2.removed && a2.end > Date.now()).length >= 6) {
          err("You can have up to 6 billboard bookings at a time.");
          return true;
        }
        const cost = adCost(spot, days);
        const start = freeFrom(spot);
        if (!bank2.transfer(u.id, "treasury", cost, `Billboard ${spot} \xB7 ${days} day${days > 1 ? "s" : ""}`)) {
          err(`You need ${cost.toLocaleString("en-US")} FYC for this booking.`);
          return true;
        }
        const a = { id: "ad" + d.rid(6), spot, owner: u.id, ownerName: u.name, brand, headline, color: /^#[0-9a-fA-F]{6}$/.test(String(m.color)) ? m.color : "#ff9a3c", category: d.clean(m.category, 20) || "Brand", image, start, end: start + days * DAY, paid: cost, at: Date.now() };
        A.list.push(a);
        A.revenue += cost;
        push();
        reply(mine(u.id));
        reply({ t: "ok", text: start <= Date.now() + 1e3 ? `Your ad is live now for ${days} day${days > 1 ? "s" : ""}.` : `Booked. Your ad goes live ${new Date(start).toUTCString().slice(5, 22)} UTC, after the current booking.` });
        d.news?.("ads", `New billboard: ${brand} \u2014 "${headline}"`);
        return true;
      }
      case "ad_cancel": {
        const a = A.list.find((x) => x.id === m.id && x.owner === u.id && !x.removed);
        if (!a) return true;
        if (a.start <= Date.now()) {
          err("This ad is already live. Live bookings run to the end and are not refunded.");
          return true;
        }
        a.removed = "cancelled";
        bank2.transfer("treasury", u.id, a.paid, `Billboard booking cancelled: ${a.spot}`);
        A.revenue -= a.paid;
        const later = A.list.filter((x) => x.spot === a.spot && !x.removed && x.start >= a.end).sort((x, y) => x.start - y.start);
        let t = Math.max(Date.now(), ...A.list.filter((x) => x.spot === a.spot && !x.removed && x.start < a.start).map((x) => x.end));
        later.forEach((x) => {
          const len = x.end - x.start;
          x.start = t;
          x.end = t + len;
          t = x.end;
        });
        push();
        reply(mine(u.id));
        reply({ t: "ok", text: "Booking cancelled and refunded." });
        return true;
      }
      case "ad_remove": {
        if (!d.isAdmin(u.id)) {
          err("Only Fyrus judges can remove ads.");
          return true;
        }
        const a = A.list.find((x) => x.id === m.id && !x.removed);
        if (!a) return true;
        const now = Date.now();
        const unused = Math.round(a.paid * Math.max(0, Math.min(1, (a.end - Math.max(now, a.start)) / (a.end - a.start))));
        a.removed = d.clean(m.reason, 200) || "Removed by a Fyrus judge";
        if (unused > 0) {
          bank2.transfer("treasury", a.owner, unused, `Billboard removed, unused days refunded: ${a.spot}`);
          A.revenue -= unused;
        }
        note(a.owner, `Your billboard "${a.headline}" was removed: ${a.removed}.${unused > 0 ? ` ${unused.toLocaleString("en-US")} FYC refunded.` : ""}`);
        push();
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, state };
}

