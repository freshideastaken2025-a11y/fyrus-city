// server/homes.ts
function createHomes(d) {
  if (!d.db.homes) {
    d.db.homes = {};
    d.save();
  }
  const H5 = d.db.homes;
  function residentOf(key) {
    const k = homeKind(key);
    if (k === "house") {
      const p = d.db.estate?.plots[key];
      if (!p?.owner) return null;
      const tenant = p.rent?.tenant;
      return { resident: tenant || p.owner, owner: p.owner, label: `House ${key}` };
    }
    if (k === "studio") {
      const sid = key.slice(7);
      const uid = Object.entries(d.db.estate?.studios || {}).find(([, s]) => s === sid)?.[0];
      return uid ? { resident: uid, owner: uid, label: `Studio ${sid}` } : null;
    }
    return null;
  }
  function sync(key) {
    const r = H5[key];
    if (!r) return;
    const o = residentOf(key);
    const res = o?.resident;
    if (r.res !== res) {
      if (r.res) {
        r.keys = [];
        r.passes = {};
        r.lock = "private";
        // 25.7: saved layouts belong to the person, not the house (the current interior stays with the house)
        delete r.saved;
      }
      r.res = res;
      d.save();
    }
  }
  const rec = (key) => {
    sync(key);
    return H5[key] ||= { lock: "private", keys: [], res: residentOf(key)?.resident };
  };
  const fresh = (r) => {
    if (r.passes) {
      for (const [u, t] of Object.entries(r.passes)) if (t < Date.now()) delete r.passes[u];
    }
    return r;
  };
  function canEnter(key, uid) {
    const o = residentOf(key);
    if (!o) return { ok: false, why: "Nobody lives here yet." };
    if (o.resident === uid) return { ok: true };
    sync(key);
    const r = H5[key] ? fresh(H5[key]) : void 0;
    const lock = r?.lock || "private";
    if (lock === "open") return { ok: true };
    if ((r?.passes?.[uid] || 0) > Date.now()) return { ok: true };
    if (lock === "keys" && r?.keys.some((k) => k.id === uid)) return { ok: true };
    return { ok: false, why: lock === "keys" ? "Locked. Only people with a key can go in." : "This home is private." };
  }
  // 25.3: a key can carry the "decorate" right (edit the interior). Exterior, lock and keys stay with the resident.
  const isDecorator = (key, uid) => {
    const o = residentOf(key);
    if (!o || o.resident === uid) return false;
    sync(key);
    return !!H5[key]?.keys.some((k) => k.id === uid && k.edit);
  };
  const layoutsOf = (r) => [0, 1, 2].map((i) => {
    const s = r?.saved?.[i];
    return s ? { name: s.name, at: s.at, n: s.int.items.length } : null;
  });
  const extAll = () => Object.fromEntries(Object.entries(H5).filter(([, r]) => r.ext).map(([k, r]) => [k, r.ext]));
  const pubLock = () => Object.fromEntries(Object.entries(H5).map(([k, r]) => [k, r.lock]));
  function mine(uid) {
    const homes2 = [];
    for (const [k, p] of Object.entries(d.db.estate?.plots || {})) {
      const o = residentOf(k);
      void p;
      if (o?.resident === uid) homes2.push(k);
    }
    const sid = d.db.estate?.studios[uid];
    if (sid) homes2.push("studio:" + sid);
    Object.keys(H5).forEach(sync);
    const list = homes2.map((k) => {
      const o = residentOf(k);
      const r = H5[k] ? fresh(H5[k]) : { lock: "private", keys: [] };
      return { key: k, label: o.label, lock: r.lock, keys: r.keys, ext: r.ext || null, owner: o.owner === uid, passes: Object.entries(r.passes || {}).map(([id, until]) => ({ id, name: d.shown(id), until })) };
    });
    const held = Object.entries(H5).filter(([k, r]) => {
      const o = residentOf(k);
      return o && o.resident !== uid && (r.keys.some((x) => x.id === uid) || (fresh(r).passes?.[uid] || 0) > Date.now());
    }).map(([k, r]) => {
      const o = residentOf(k);
      return { key: k, label: o.label, residentName: d.shown(o.resident), kind: r.keys.some((x) => x.id === uid) ? "key" : "pass", edit: !!r.keys.find((x) => x.id === uid)?.edit, until: r.passes?.[uid] || 0 };
    });
    return { t: "home_mine", homes: list, held };
  }
  const pushMine = (uid) => {
    const l = d.liveOf(uid);
    if (l) d.send(l.ws, mine(uid));
  };
  const knocks = /* @__PURE__ */ new Map();
  const HSTAT = { conflicts: 0 };
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("home_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    const key = String(m.key || "").slice(0, 40);
    const o = key ? residentOf(key) : null;
    const isRes = !!o && o.resident === u.id;
    const mustRes = () => {
      if (!o) {
        err("Nobody lives here yet.");
        return false;
      }
      if (!isRes) {
        err("Only the person who lives here can change this.");
        return false;
      }
      return true;
    };
    switch (m.t) {
      case "home_state":
        reply({ t: "home_ext", ext: extAll(), locks: pubLock() });
        reply(mine(u.id));
        return true;
      case "home_mine":
        reply(mine(u.id));
        return true;
      case "home_enter": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        const c = canEnter(key, u.id);
        const r = H5[key];
        if (!c.ok) {
          reply({ t: "home_access", key, ok: false, why: c.why, lock: r?.lock || "private", residentName: d.shown(o.resident), online: !!d.liveOf(o.resident) });
          return true;
        }
        const deco = !isRes && isDecorator(key, u.id);
        reply({ t: "home_access", key, ok: true, label: o.label, residentName: d.shown(o.resident), canEdit: isRes || deco, role: isRes ? "resident" : deco ? "decorator" : "guest", layouts: isRes || deco ? (sync(key), layoutsOf(H5[key])) : void 0, v: r?.v || 0, int: r?.int || defaultInt(key), ext: r?.ext || null, lock: r?.lock || "private" });
        return true;
      }
      case "home_lock": {
        if (!mustRes()) return true;
        const lock = ["private", "keys", "open"].includes(m.lock) ? m.lock : "private";
        rec(key).lock = lock;
        d.save();
        reply({ t: "ok", text: lock === "open" ? "Open house: anyone can walk in." : lock === "keys" ? "Locked. People with a key can go in." : "Private. Only you can go in; visitors can knock." });
        pushMine(u.id);
        d.broadcast({ t: "home_lock", key, lock });
        return true;
      }
      case "home_key": {
        if (!mustRes()) return true;
        const who = m.id ? own(d.db.users, String(m.id)) ? { id: String(m.id), name: d.shown(String(m.id)) } : void 0 : d.findByNumber(String(m.number || ""));
        if (!who) {
          err("No citizen with that number.");
          return true;
        }
        if (who.id === u.id) {
          err("You already live here.");
          return true;
        }
        const r = rec(key);
        if (r.keys.length >= 50) {
          err("A home can have up to 50 keys.");
          return true;
        }
        if (!r.keys.some((k) => k.id === who.id)) r.keys.push({ id: who.id, name: d.shown(who.id) });
        if (r.lock === "private") r.lock = "keys";
        d.save();
        reply({ t: "ok", text: `${d.shown(who.id)} now has a key to ${o.label}.` });
        pushMine(u.id);
        pushMine(who.id);
        const l = d.liveOf(who.id);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} gave you a key to ${o.label}. Open Homes & keys to visit.` });
        return true;
      }
      case "home_unkey": {
        if (!mustRes()) return true;
        const r = rec(key);
        const id = String(m.id || "");
        r.keys = r.keys.filter((k) => k.id !== id);
        if (r.passes) delete r.passes[id];
        d.save();
        reply({ t: "ok", text: "Key taken back." });
        pushMine(u.id);
        pushMine(id);
        return true;
      }
      case "home_knock": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (isRes) {
          reply({ t: "note", text: "This is your home. Walk in." });
          return true;
        }
        const last = knocks.get(u.id);
        if (last && last.key === key && Date.now() - last.at < 2e4) {
          err("You just knocked. Give them a moment.");
          return true;
        }
        const l = d.liveOf(o.resident);
        if (!l) {
          reply({ t: "note", text: `${d.shown(o.resident)} is not home right now. Try again later.` });
          return true;
        }
        knocks.set(u.id, { key, from: u.id, at: Date.now() });
        if (knocks.size > 5e3) knocks.clear();
        d.send(l.ws, { t: "home_knock", key, label: o.label, from: { id: u.id, name: d.shown(u.id) } });
        reply({ t: "note", text: `You knocked on ${o.label}. Waiting for ${d.shown(o.resident)}\u2026` });
        return true;
      }
      case "home_answer": {
        if (!mustRes()) return true;
        const id = String(m.id || "");
        const k = knocks.get(id);
        if (!k || k.key !== key) {
          err("That knock has expired.");
          return true;
        }
        knocks.delete(id);
        const l = d.liveOf(id);
        if (m.yes) {
          const r = rec(key);
          (r.passes ||= {})[id] = Date.now() + PASS_MS;
          d.save();
          if (l) d.send(l.ws, { t: "home_let_in", key, label: o.label, by: d.shown(u.id) });
          reply({ t: "ok", text: `You let ${d.shown(id)} in for 2 hours.` });
          pushMine(u.id);
          pushMine(id);
        } else if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} can't open the door right now.` });
        return true;
      }
      // 25.7 saved layouts: 3 named slots per home (resident saves / deletes; resident or decorator restores),
      // and "reset to the default furnishing"
      case "home_layout_save": {
        if (!mustRes()) return true;
        const r = rec(key);
        const slot = Math.round(+m.slot);
        if (!(slot >= 0 && slot < 3)) {
          err("Pick slot 1, 2 or 3.");
          return true;
        }
        (r.saved ||= [null, null, null])[slot] = { name: clean(m.name, 24) || `Layout ${slot + 1}`, at: Date.now(), int: cleanInt(r.int || defaultInt(key), key) };
        d.save();
        reply({ t: "home_layouts", key, layouts: layoutsOf(r) });
        reply({ t: "ok", text: `Saved as "${r.saved[slot].name}".` });
        return true;
      }
      case "home_layout_del": {
        if (!mustRes()) return true;
        const r = rec(key);
        const slot = Math.round(+m.slot);
        if (r.saved && slot >= 0 && slot < 3) r.saved[slot] = null;
        d.save();
        reply({ t: "home_layouts", key, layouts: layoutsOf(r) });
        return true;
      }
      case "home_layout_load":
      case "home_reset": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (!isRes && !isDecorator(key, u.id)) {
          err("Only the resident, or someone they let decorate, can change this.");
          return true;
        }
        const r = rec(key);
        let src;
        if (m.t === "home_reset") src = defaultInt(key);
        else {
          const s = r.saved?.[Math.round(+m.slot)];
          if (!s) {
            err("That slot is empty.");
            return true;
          }
          src = s.int;
        }
        r.int = cleanInt(JSON.parse(JSON.stringify(src)), key);
        r.at = Date.now();
        r.by = u.id;
        r.v = (r.v || 0) + 1;
        d.save();
        reply({ t: "home_saved", key, int: r.int, v: r.v });
        reply({ t: "ok", text: m.t === "home_reset" ? "Back to the original furnishing." : "Layout restored." });
        d.toScene("house:" + key, { t: "home_int", key, int: r.int, v: r.v });
        return true;
      }
      // 25.9: the resident can ask a visitor to leave (their timed pass is withdrawn; a key holder keeps the key)
      case "home_kick": {
        if (!mustRes()) return true;
        const id = String(m.id || "");
        const l = d.liveOf(id);
        if (!l || l.scene !== "house:" + key || id === u.id) {
          err("That visitor is not inside.");
          return true;
        }
        const r = rec(key);
        if (r.passes) delete r.passes[id];
        d.save();
        d.send(l.ws, { t: "home_kicked", key, label: o.label, by: d.shown(u.id) });
        reply({ t: "ok", text: `${d.shown(id)} was asked to leave.` });
        return true;
      }
      case "home_keyperm": {
        if (!mustRes()) return true;
        const r = rec(key);
        const k = r.keys.find((x) => x.id === String(m.id || ""));
        if (!k) {
          err("Give them a key first.");
          return true;
        }
        if (m.edit) k.edit = true;
        else delete k.edit;
        d.save();
        reply({ t: "ok", text: m.edit ? `${k.name} can now decorate ${o.label}.` : `${k.name} can no longer decorate ${o.label}.` });
        pushMine(u.id);
        const l = d.liveOf(k.id);
        if (l) d.send(l.ws, { t: "note", text: m.edit ? `${d.shown(u.id)} lets you decorate ${o.label}.` : `You can no longer decorate ${o.label}.` });
        return true;
      }
      case "home_int": {
        if (!o) {
          err("Nobody lives here yet.");
          return true;
        }
        if (!isRes && !isDecorator(key, u.id)) {
          err("Only the resident, or someone they let decorate, can change this.");
          return true;
        }
        const r = rec(key);
        // 25.8: optimistic concurrency - a save based on an older version than the stored one is refused, and the
        // editor gets the current interior (two editors no longer overwrite each other silently)
        if (m.base != null && +m.base !== (r.v || 0)) {
          HSTAT.conflicts++;
          reply({ t: "home_conflict", key, int: r.int || defaultInt(key), v: r.v || 0, by: r.by ? d.shown(r.by) : null });
          return true;
        }
        r.int = cleanInt(m.int, key);
        r.at = Date.now();
        r.by = u.id;
        r.v = (r.v || 0) + 1;
        d.save();
        reply({ t: "home_saved", key, int: r.int, v: r.v });
        d.toScene("house:" + key, { t: "home_int", key, int: r.int, v: r.v });
        return true;
      }
      case "home_ext": {
        if (!mustRes()) return true;
        const r = rec(key);
        r.ext = cleanExt(m.ext);
        d.save();
        reply({ t: "ok", text: "New paint and garden saved. Everyone sees it." });
        d.broadcast({ t: "home_ext", ext: { [key]: r.ext } });
        pushMine(u.id);
        return true;
      }
    }
    return true;
  }
  const hasRoyalKey = (uid) => Object.entries(H5).some(([k, r]) => k.startsWith("RS-") && (r.keys.some((x) => x.id === uid) || (r.passes?.[uid] || 0) > Date.now()));
  return { onMessage: onMessage2, canEnter, residentOf, hasRoyalKey, mine };
}

