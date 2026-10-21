// server/halls.ts
var H4 = +(process.env.HALL_HOUR_MS || 36e5);
var TICK2 = +(process.env.HALLS_TICK_MS || 2e4);
function createHalls(d) {
  if (!d.db.halls) {
    d.db.halls = { events: {} };
    d.save();
  }
  const K = d.db.halls;
  const bank2 = d.bank;
  const note = (id, text) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, { t: "note", text });
  };
  const pub2 = (e, uid) => ({ id: e.id, hall: e.hall, hostName: e.hostName, host: e.host, title: e.title, desc: e.desc, start: e.start, end: e.end, price: e.price, going: e.tickets.length, cap: hallById(e.hall)?.cap || 0, status: e.status, mine: uid ? e.tickets.includes(uid) : void 0 });
  const upcoming = () => Object.values(K.events).filter((e) => e.status === "scheduled").sort((a, b) => a.start - b.start);
  const list = (uid) => ({ t: "hall_list", events: upcoming().slice(0, 80).map((e) => pub2(e, uid)), now: Date.now() });
  const changed = () => {
    d.save();
    d.broadcast({ t: "hall_changed" });
  };
  const overlap = (hall, s, e) => upcoming().some((x) => x.hall === hall && x.start < e && x.end > s);
  function finish(e) {
    e.status = "done";
    const gross = e.price * e.tickets.length;
    if (gross > 0) {
      const host = Math.round(gross * HOST_SHARE);
      bank2.transfer("escrow", e.host, host, `Ticket sales: ${e.title}`);
      if (gross - host > 0) bank2.transfer("escrow", "treasury", gross - host, `Event fee 10%: ${e.title}`);
      note(e.host, `"${e.title}" ended. ${host.toLocaleString("en-US")} FYC from ${e.tickets.length} tickets is in your account.`);
    }
    changed();
  }
  function cancel(e, why) {
    e.status = "cancelled";
    if (e.price > 0) e.tickets.forEach((t) => bank2.transfer("escrow", t, e.price, `Ticket refunded: ${e.title}`));
    e.tickets.forEach((t) => note(t, `"${e.title}" was cancelled (${why}).${e.price ? " Your ticket is refunded." : ""}`));
    changed();
  }
  setInterval(() => {
    const now = Date.now();
    for (const e of upcoming()) {
      if (!e.started && e.start <= now) {
        e.started = true;
        d.save();
        const h = hallById(e.hall);
        [e.host, ...e.tickets].forEach((t) => note(t, `"${e.title}" is starting now in the ${h?.name}. Open Events to go in.`));
        d.news?.("events", `Now live: "${e.title}" in the ${h?.name}, hosted by ${e.hostName}`);
        d.broadcast({ t: "hall_changed" });
      }
      if (e.end <= now) finish(e);
    }
    const old = Object.values(K.events).filter((e) => e.status !== "scheduled" && e.end < now - 14 * 24 * 36e5);
    old.forEach((e) => delete K.events[e.id]);
    if (old.length) d.save();
  }, TICK2);
  function access(uid, hall) {
    const now = Date.now();
    const e = upcoming().find((x) => x.hall === hall && x.start <= now && x.end > now);
    if (!e) return { ok: true };
    if (e.price === 0 || e.host === uid || e.tickets.includes(uid)) return { ok: true, event: pub2(e, uid) };
    return { ok: false, event: pub2(e, uid) };
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("hall_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const ev = m.event ? K.events[String(m.event)] : void 0;
    switch (m.t) {
      case "hall_list":
        reply(list(u.id));
        return true;
      case "hall_enter": {
        const h = hallById(String(m.hall));
        if (!h) return true;
        reply({ t: "hall_access", hall: h.id, ...access(u.id, h.id) });
        return true;
      }
      case "hall_book": {
        const h = hallById(String(m.hall));
        if (!h) {
          err("No such hall.");
          return true;
        }
        if (bank2.acct(u.id).banned) {
          err("This account is suspended.");
          return true;
        }
        const title = d.filter(d.clean(m.title, 80));
        const desc = d.filter(String(m.desc || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, 800));
        if (title.length < 4) {
          err("Give the event a title.");
          return true;
        }
        const bad = sentinel(`${title} ${desc}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this event"));
          return true;
        }
        const hours = Math.max(1, Math.min(HALL_MAX_HOURS, Math.round(+m.hours || 1)));
        const price = Math.max(0, Math.min(TICKET_MAX, Math.round(+m.price || 0)));
        const start = Math.round(+m.start || 0);
        const now = Date.now();
        if (!(start >= now - 5 * 6e4) || start > now + 30 * 24 * 36e5) {
          err("Pick a start time from now up to 30 days ahead.");
          return true;
        }
        const end = Math.max(start, now) + hours * H4;
        if (overlap(h.id, start, end)) {
          err(`The ${h.name} is already booked at that time. Try another hour or hall.`);
          return true;
        }
        if (upcoming().filter((e2) => e2.host === u.id).length >= 5) {
          err("You can host up to 5 upcoming events.");
          return true;
        }
        const fee = h.hourly * hours;
        if (!bank2.transfer(u.id, "treasury", fee, `${h.name} booking \xB7 ${hours} h`)) {
          err(`Booking the ${h.name} for ${hours} h costs ${fee.toLocaleString("en-US")} FYC.`);
          return true;
        }
        const e = { id: "e" + d.rid(6), hall: h.id, host: u.id, hostName: u.name, title, desc, start: Math.max(start, now), end, price, tickets: [], fee, status: "scheduled", at: now };
        K.events[e.id] = e;
        changed();
        reply(list(u.id));
        reply({ t: "ok", text: `${h.name} booked: "${title}".` });
        d.news?.("events", `Coming up: "${title}" in the ${h.name}${price ? ` \xB7 tickets ${price.toLocaleString("en-US")} FYC` : " \xB7 free entry"}`);
        return true;
      }
      case "hall_ticket": {
        if (!ev || ev.status !== "scheduled") {
          err("This event is not open.");
          return true;
        }
        if (ev.host === u.id) {
          err("You are the host.");
          return true;
        }
        if (ev.tickets.includes(u.id)) {
          err("You already have a ticket.");
          return true;
        }
        if (ev.tickets.length >= (hallById(ev.hall)?.cap || 0)) {
          err("Sold out.");
          return true;
        }
        if (ev.price > 0 && !bank2.transfer(u.id, "escrow", ev.price, `Ticket held in escrow: ${ev.title}`)) {
          err(`A ticket costs ${ev.price.toLocaleString("en-US")} FYC.`);
          return true;
        }
        ev.tickets.push(u.id);
        changed();
        reply(list(u.id));
        reply({ t: "ok", text: ev.price ? "Ticket bought. Your FYC is held safely until the event ends." : "You are on the guest list." });
        if (ev.tickets.length % 10 === 0 || ev.tickets.length === 1) note(ev.host, `${ev.tickets.length} going to "${ev.title}".`);
        return true;
      }
      case "hall_leave": {
        if (!ev || ev.status !== "scheduled" || !ev.tickets.includes(u.id)) return true;
        if (ev.start <= Date.now()) {
          err("The event has started; tickets can no longer be returned.");
          return true;
        }
        ev.tickets = ev.tickets.filter((t) => t !== u.id);
        if (ev.price > 0) bank2.transfer("escrow", u.id, ev.price, `Ticket returned: ${ev.title}`);
        changed();
        reply(list(u.id));
        return true;
      }
      case "hall_cancel": {
        if (!ev || ev.status !== "scheduled") return true;
        if (ev.host !== u.id && !d.isAdmin(u.id)) {
          err("Only the host can cancel.");
          return true;
        }
        const early = ev.start - Date.now() > 36e5;
        if (early && ev.host === u.id) bank2.transfer("treasury", ev.host, ev.fee, `Hall booking refunded: ${ev.title}`);
        cancel(ev, ev.host === u.id ? "cancelled by the host" : "removed by a Fyrus judge");
        reply(list(u.id));
        reply({ t: "ok", text: `Event cancelled.${early && ev.host === u.id ? " Booking fee refunded." : ""}` });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, access, halls: HALLS };
}

