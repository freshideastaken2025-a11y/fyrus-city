// FYRUS 28.11 player-made activities: any citizen can post a free, short activity at a real place ("pickup football at
// Core Plaza in 15 min, up to 10 people"); others join or leave; everyone who joined gets a note when it starts; it ends
// after an hour and disappears. No money, no booking. Server rules: fixed kinds and places, filtered 60-char title,
// one open activity per citizen, 2-minute create cooldown, 40 open activities city-wide, capacity 2-30, start in 5-120 min,
// banned/suspended accounts cannot post or join. Kill switch P28_OFF=acts.
var ACT_KINDS = { game: "Pickup game", walk: "Group walk", dance: "Dance meetup", study: "Study group", picnic: "Picnic", race: "Car meet & race", chat: "Hangout", photo: "Photo walk" };
var ACT_LEN = () => +(process.env.ACT_LEN_MS || 36e5);
function createActs(d) {
  if (!d.db.acts) { d.db.acts = { list: {}, seq: 1, last: {} }; d.save(); }
  const A = d.db.acts;
  A.last ||= {};
  const OFF = () => /(^|,)(acts|all)(,|$)/.test(process.env.P28_OFF || "");
  const placeById = (id) => (typeof AI_PLACES !== "undefined" ? AI_PLACES : []).find((p) => p.id === id);
  const open = () => Object.values(A.list).filter((a) => a.end > Date.now()).sort((a, b) => a.start - b.start);
  const pub = (a, uid) => ({ id: a.id, kind: a.kind, kindName: ACT_KINDS[a.kind], place: a.place, placeName: placeById(a.place)?.name || a.place, title: a.title, byName: a.byName, mine: a.by === uid, start: a.start, end: a.end, max: a.max, going: a.joined.length, joined: a.joined.includes(uid) });
  const list = (uid) => ({ t: "act_list", acts: open().slice(0, 40).map((a) => pub(a, uid)), now: Date.now(), kinds: ACT_KINDS, places: (typeof AI_PLACES !== "undefined" ? AI_PLACES : []).filter((p) => !p.id.startsWith("soc-")).map((p) => ({ id: p.id, name: p.name })) });
  const note = (id, text) => { const l = d.liveOf(id); if (l) d.send(l.ws, { t: "note", text }); };
  const changed = () => { d.save(); d.broadcast({ t: "act_changed" }); };
  const blocked = (u) => !!(u.banned && u.banned.until > Date.now()) || !!d.bank?.acct?.(u.id)?.banned;
  setInterval(() => {
    const now = Date.now();
    let dirty = false;
    for (const a of Object.values(A.list)) {
      if (!a.started && a.start <= now && a.end > now) { a.started = now; dirty = true; a.joined.forEach((id) => note(id, `"${a.title}" is starting now at ${placeById(a.place)?.name || "the meeting point"}. Open the map (M) to get there.`)); }
      if (a.end + 6e5 < now) { delete A.list[a.id]; dirty = true; }
    }
    if (dirty) changed();
  }, +(process.env.ACT_TICK_MS || 1e4));
  function onMessage(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("act_")) return false;
    const u = me.u, reply = (x) => d.send(me.ws, x), err = (text) => (reply({ t: "err", text }), true), ok = (text) => reply({ t: "ok", text });
    if (OFF()) return err("Player activities are switched off right now.");
    if (m.t === "act_list") return reply(list(u.id)), true;
    if (blocked(u)) return err("This account is suspended.");
    const a = typeof m.id === "string" && Object.prototype.hasOwnProperty.call(A.list, m.id) ? A.list[m.id] : null;
    switch (m.t) {
      case "act_create": {
        const now = Date.now();
        if (!Object.prototype.hasOwnProperty.call(ACT_KINDS, m.kind)) return err("Pick a kind of activity.");
        const p = placeById(String(m.place || ""));
        if (!p || p.id.startsWith("soc-")) return err("Pick a meeting place from the list.");
        const title = d.filter(String(m.title || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60));
        if (title.length < 3) return err("Give your activity a short title.");
        const inMin = Math.round(+m.inMin), max = Math.round(+m.max);
        if (!(inMin >= 5 && inMin <= 120)) return err("Start between 5 and 120 minutes from now.");
        if (!(max >= 2 && max <= 30)) return err("Choose 2 to 30 people.");
        if (open().some((x) => x.by === u.id)) return err("You already have an open activity. Cancel it first.");
        if (A.last[u.id] && now - A.last[u.id] < +(process.env.ACT_COOLDOWN_MS || 12e4)) return err("Please wait a moment before posting another activity.");
        if (open().length >= 40) return err("The city board is full right now. Try again later.");
        const id = "a" + A.seq++, start = now + inMin * +(process.env.ACT_MINUTE_MS || 6e4);
        A.list[id] = { id, by: u.id, byName: d.shown(u.id), kind: m.kind, place: p.id, title, start, end: start + ACT_LEN(), max, joined: [u.id], at: now };
        A.last[u.id] = now;
        ok(`Posted: "${title}" at ${p.name} in ${inMin} min. Others can join from Activities.`);
        changed();
        return true;
      }
      case "act_join": {
        if (!a || a.end <= Date.now()) return err("That activity is over.");
        if (a.joined.includes(u.id)) return err("You already joined.");
        if (a.joined.length >= a.max) return err("That activity is full.");
        a.joined.push(u.id);
        ok(`You joined "${a.title}". We'll remind you when it starts.`);
        if (a.by !== u.id) note(a.by, `${d.shown(u.id)} joined your activity "${a.title}" (${a.joined.length}/${a.max}).`);
        changed();
        return true;
      }
      case "act_leave": {
        if (!a || !a.joined.includes(u.id)) return err("You are not in that activity.");
        if (a.by === u.id) return err("You host it: cancel it instead.");
        a.joined = a.joined.filter((x) => x !== u.id);
        ok(`You left "${a.title}".`);
        changed();
        return true;
      }
      case "act_cancel": {
        if (!a) return err("No such activity.");
        if (a.by !== u.id && !d.isAdmin(u.id)) return err("Only the host can cancel it.");
        a.joined.filter((x) => x !== u.id).forEach((id) => note(id, `"${a.title}" was cancelled by the host.`));
        delete A.list[a.id];
        ok("Activity cancelled.");
        changed();
        return true;
      }
    }
    return err("Unknown activity request.");
  }
  return { onMessage, open: () => open().map((a) => pub(a, null)) };
}
