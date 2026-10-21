// server/politics.ts
var LEN = () => +(process.env.ELECTION_MS || 7 * 24 * 36e5);
var VOTER_AGE = () => +(process.env.VOTER_AGE_MS || 24 * 36e5);
var PROPOSAL_MS = () => +(process.env.PROPOSAL_MS || 3 * 24 * 36e5);
var HEX2 = /^#[0-9a-f]{6}$/i;
function createPolitics(d) {
  if (!d.db.politics) {
    d.db.politics = { cycle: { n: 1, start: Date.now() }, parties: {}, cands: [], homes: {}, votes: {}, results: [], proposals: {} };
    d.save();
  }
  const P = d.db.politics;
  const bank2 = d.bank;
  const isPassport = (id) => {
    const p = d.db.users[id]?.passport;
    return !!p && p.kind === "passport";
  };
  const banned = (id) => {
    const u = d.db.users[id];
    return !!(u?.banned && u.banned.until > Date.now()) || !!bank2.acct(id).banned;
  };
  function voterCheck(id) {
    const u = d.db.users[id];
    if (!u) return "Unknown citizen.";
    if (!u.email && !u.google) return "Save your account with an email or Google first (Settings \u2192 Account). Guest accounts cannot vote.";
    if (Date.now() - (u.joined || 0) < VOTER_AGE()) return "New accounts can vote after their first day in Fyrus.";
    if (banned(id)) return "This account is suspended.";
    return null;
  }
  const runCheck = (id) => voterCheck(id) || (isPassport(id) ? null : "You need a Fyrus passport to found a party or stand for office.");
  const partyOf = (id) => Object.values(P.parties).find((p) => !p.banned && p.members.includes(id));
  const ph = () => phaseAt(P.cycle.start, LEN(), Date.now());
  const counts = () => {
    const mayor = {}, party = {};
    for (const v of Object.values(P.votes)) {
      if (v.mayor) mayor[v.mayor] = (mayor[v.mayor] || 0) + 1;
      if (v.party) party[v.party] = (party[v.party] || 0) + 1;
    }
    return { mayor, party };
  };
  const pubParty = (p) => ({ id: p.id, name: p.name, short: p.short, symbol: p.symbol, color: p.color, color2: p.color2, slogan: p.slogan, manifesto: p.manifesto, leader: p.leader, leaderName: d.shown(p.leader), members: p.members.length, memberNames: p.members.slice(0, 40).map((m) => d.shown(m)), at: p.at, banned: p.banned });
  function state() {
    const c = counts();
    const x = ph();
    const live2 = Object.values(P.votes).length;
    return {
      t: "pol_state",
      n: P.cycle.n,
      start: P.cycle.start,
      phase: x.phase,
      until: x.until,
      end: x.end,
      now: Date.now(),
      seats: SEATS,
      parties: Object.values(P.parties).filter((p) => !p.banned).map(pubParty),
      cands: P.cands.map((k) => ({ id: k.id, name: d.shown(k.id), city: k.city, party: k.party, statement: k.statement, dq: k.dq, votes: x.phase === "voting" ? c.mayor[k.id] || 0 : 0 })),
      partyVotes: x.phase === "voting" ? c.party : {},
      projected: x.phase === "voting" ? dhondt(c.party) : {},
      turnout: live2,
      voters: Object.keys(P.homes).filter((k) => P.homes[k].n === P.cycle.n).length,
      office: P.results[0] || null,
      history: P.results.slice(0, 6).map((r) => ({ n: r.n, at: r.at, turnout: r.turnout, seats: r.seats })),
      proposals: Object.values(P.proposals).sort((a, b) => b.at - a.at).slice(0, 30).map((p) => ({ id: p.id, by: d.shown(p.by), title: p.title, body: p.body, at: p.at, ends: p.ends, yes: p.yes.length, no: p.no.length, closed: !!p.closed }))
    };
  }
  function me(id) {
    const h = P.homes[id];
    const v = P.votes[id];
    const pp = partyOf(id);
    const pv = {};
    for (const p of Object.values(P.proposals)) {
      if (p.yes.includes(id)) pv[p.id] = "yes";
      else if (p.no.includes(id)) pv[p.id] = "no";
    }
    return { t: "pol_me", canVote: voterCheck(id), canRun: runCheck(id), home: h && h.n === P.cycle.n ? h.city : null, voted: v ? { mayor: v.mayor || null, party: v.party || null } : null, party: pp?.id || null, leader: pp?.leader === id, cand: P.cands.find((k) => k.id === id) || null, judge: d.isAdmin(id), pvotes: pv };
  }
  let pending = null;
  const changed = (soon = false) => {
    d.save();
    if (soon) {
      if (!pending) pending = setTimeout(() => {
        pending = null;
        d.broadcast(state());
      }, 1500);
    } else d.broadcast(state());
  };
  const pushMe = (id) => {
    const l = d.liveOf(id);
    if (l) d.send(l.ws, me(id));
  };
  function closeElection() {
    const c = counts();
    const mayors = {};
    for (const city of CITIES) {
      const list = P.cands.filter((k) => k.city === city.id && !k.dq).map((k) => ({ k, v: c.mayor[k.id] || 0 })).sort((a, b) => b.v - a.v || a.k.at - b.k.at);
      const w = list[0];
      mayors[city.id] = w && w.v > 0 ? { id: w.k.id, name: d.shown(w.k.id), party: w.k.party, votes: w.v } : null;
    }
    const pv = {};
    for (const [k, v] of Object.entries(c.party)) if (P.parties[k] && !P.parties[k].banned) pv[k] = v;
    const seats = dhondt(pv);
    const mps = {};
    const names = {};
    for (const [pid, n] of Object.entries(seats)) {
      const pa = P.parties[pid];
      names[pid] = pa.name;
      mps[pid] = [pa.leader, ...pa.members.filter((x) => x !== pa.leader)].slice(0, n).map((id) => ({ id, name: d.shown(id) }));
    }
    const res = { n: P.cycle.n, at: Date.now(), turnout: Object.keys(P.votes).length, voters: Object.values(P.homes).filter((h) => h.n === P.cycle.n).length, mayors, seats, partyVotes: pv, mps, names };
    P.results.unshift(res);
    P.results = P.results.slice(0, 20);
    const top = Object.entries(seats).sort((a, b) => b[1] - a[1])[0];
    d.news?.("politics", `Election ${P.cycle.n} results: ${top ? `${P.parties[top[0]]?.name} wins ${top[1]} of ${SEATS} seats` : "no party votes"} \xB7 ${Object.values(mayors).filter(Boolean).length} mayors elected \xB7 turnout ${res.turnout}`);
    for (const [city, m] of Object.entries(mayors)) if (m) {
      d.news?.("politics", `${m.name} is the new Mayor of ${cityName(city)} (${m.votes} votes)`);
      const l = d.liveOf(m.id);
      if (l) d.send(l.ws, { t: "note", text: `Congratulations \u2014 you are the Mayor of ${cityName(city)}!` });
    }
    P.cycle = { n: P.cycle.n + 1, start: Date.now() };
    P.cands = [];
    P.votes = {};
    changed();
  }
  function closeProposals() {
    const now = Date.now();
    for (const p of Object.values(P.proposals)) if (!p.closed && now >= p.ends) {
      p.closed = true;
      d.news?.("politics", `Citizens' proposal "${p.title}": ${p.yes.length > p.no.length ? "PASSED" : "not passed"} (${p.yes.length} yes \xB7 ${p.no.length} no)`);
      changed();
    }
  }
  setInterval(() => {
    if (Date.now() >= P.cycle.start + LEN()) closeElection();
    closeProposals();
  }, +(process.env.POL_TICK_MS || 15e3));
  function onMessage2(meL, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("pol_")) return false;
    const u = meL.u;
    const reply = (x) => d.send(meL.ws, x);
    const err = (text2) => {
      reply({ t: "err", text: text2 });
      return true;
    };
    const ok = (text2) => reply({ t: "ok", text: text2 });
    const text = (v, n) => d.filter(String(v || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, n));
    switch (m.t) {
      case "pol_state":
        reply(state());
        reply(me(u.id));
        return true;
      case "pol_home": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        const city = String(m.city);
        if (!CITIES.some((c) => c.id === city)) return err("Pick a city.");
        const h = P.homes[u.id];
        if (h && h.n === P.cycle.n && h.city !== city) return err(`Your home city for this election is ${cityName(h.city)}. You can change it next election.`);
        P.homes[u.id] = { city, n: P.cycle.n };
        d.save();
        ok(`Registered to vote in ${cityName(city)}.`);
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_party_create": {
        const why = runCheck(u.id);
        if (why) return err(why);
        if (partyOf(u.id)) return err("Leave your current party first.");
        if (Object.values(P.parties).filter((p) => !p.banned).length >= LIMITS.parties) return err("The register of parties is full.");
        const name = text(m.name, LIMITS.name);
        const short = text(m.short, LIMITS.short).toUpperCase();
        const slogan = text(m.slogan, LIMITS.slogan);
        const manifesto = text(m.manifesto, LIMITS.manifesto);
        if (name.length < 3 || short.length < 2) return err("Give the party a name (3+ letters) and a short code (2\u20136 letters).");
        if (manifesto.length < 40) return err("Write a manifesto of at least a few sentences: what will your party do?");
        const real = realPolitics([name, short, slogan, manifesto].join(" "));
        if (real) return err(`Real-world parties and politicians are not allowed in Fyrus ("${real}"). Make up your own.`);
        if (/\*{3,}/.test(name + short + slogan)) return err("Keep the name and slogan clean.");
        if (Object.values(P.parties).some((p) => !p.banned && (p.name.toLowerCase() === name.toLowerCase() || p.short === short))) return err("A party with that name or code already exists.");
        if (!bank2.transfer(u.id, "treasury", FEES.party, `Party registration: ${name}`)) return err(`Registering a party costs ${FEES.party.toLocaleString("en-US")} FYC.`);
        const id = "pa" + d.rid(6);
        P.parties[id] = { id, name, short, symbol: SYMBOLS.includes(m.symbol) ? m.symbol : SYMBOLS[0], color: HEX2.test(m.color) ? m.color : PARTY_COLORS[0], color2: HEX2.test(m.color2) ? m.color2 : "#ffffff", slogan, manifesto, leader: u.id, members: [u.id], at: Date.now() };
        d.news?.("politics", `New party registered: ${name} (${short}), led by ${d.shown(u.id)}`);
        ok(`${name} is registered. You are the party leader.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_party_edit": {
        const p = partyOf(u.id);
        if (!p || p.leader !== u.id) return err("Only the party leader can edit the party.");
        const slogan = text(m.slogan ?? p.slogan, LIMITS.slogan), manifesto = text(m.manifesto ?? p.manifesto, LIMITS.manifesto);
        const real = realPolitics(slogan + " " + manifesto);
        if (real) return err(`Real-world parties and politicians are not allowed ("${real}").`);
        p.slogan = slogan;
        p.manifesto = manifesto;
        if (SYMBOLS.includes(m.symbol)) p.symbol = m.symbol;
        if (HEX2.test(m.color)) p.color = m.color;
        if (HEX2.test(m.color2)) p.color2 = m.color2;
        ok("Party updated.");
        changed();
        return true;
      }
      case "pol_join": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        if (partyOf(u.id)) return err("You are already in a party. Leave it first.");
        const p = P.parties[String(m.party)];
        if (!p || p.banned) return err("No such party.");
        if (P.cands.some((k) => k.id === u.id)) return err("Candidates cannot switch parties during an election.");
        p.members.push(u.id);
        d.save();
        ok(`You joined ${p.name}.`);
        pushMe(u.id);
        changed(true);
        const l = d.liveOf(p.leader);
        if (l) d.send(l.ws, { t: "note", text: `${d.shown(u.id)} joined ${p.name}.` });
        return true;
      }
      case "pol_leave": {
        const p = partyOf(u.id);
        if (!p) return err("You are not in a party.");
        if (P.cands.some((k) => k.id === u.id && k.party === p.id)) return err("You are standing for this party in the current election.");
        p.members = p.members.filter((x) => x !== u.id);
        if (p.leader === u.id) {
          if (p.members.length) {
            p.leader = p.members[0];
            const l = d.liveOf(p.leader);
            if (l) d.send(l.ws, { t: "note", text: `You are now the leader of ${p.name}.` });
          } else {
            p.banned = "dissolved";
            d.news?.("politics", `${p.name} has been dissolved`);
          }
        }
        d.save();
        ok(`You left ${p.name}.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_nominate": {
        const why = runCheck(u.id);
        if (why) return err(why);
        if (ph().phase !== "nominations") return err("Nominations are closed. Voting is open \u2014 the next election takes nominations again.");
        const h = P.homes[u.id];
        if (!h || h.n !== P.cycle.n) return err("Register your home city first (Vote tab). You stand for Mayor of your own city.");
        if (P.cands.some((k) => k.id === u.id)) return err("You are already a candidate.");
        const statement = text(m.statement, LIMITS.statement);
        if (statement.length < 20) return err("Write a short statement for voters (20+ characters).");
        const real = realPolitics(statement);
        if (real) return err(`Keep real-world politics out of Fyrus ("${real}").`);
        if (!bank2.transfer(u.id, "treasury", FEES.nominate, `Nomination: Mayor of ${cityName(h.city)}`)) return err(`The nomination fee is ${FEES.nominate.toLocaleString("en-US")} FYC.`);
        const p = m.independent ? void 0 : partyOf(u.id);
        P.cands.push({ id: u.id, city: h.city, party: p?.id, statement, at: Date.now() });
        d.news?.("politics", `${d.shown(u.id)} (${p ? p.short : "independent"}) is standing for Mayor of ${cityName(h.city)}`);
        ok(`You are a candidate for Mayor of ${cityName(h.city)}.`);
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_withdraw": {
        const i = P.cands.findIndex((k) => k.id === u.id);
        if (i < 0) return err("You are not a candidate.");
        if (ph().phase !== "nominations") return err("Voting has started; your name stays on the ballot.");
        P.cands.splice(i, 1);
        ok("You withdrew. The fee is not refunded.");
        pushMe(u.id);
        changed();
        return true;
      }
      case "pol_vote": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        if (ph().phase !== "voting") return err("Voting opens when nominations close.");
        const h = P.homes[u.id];
        if (!h || h.n !== P.cycle.n) return err("Choose your home city first.");
        const v = P.votes[u.id] || { at: Date.now() };
        if (m.mayor) {
          if (v.mayor) return err("You already voted for Mayor in this election.");
          const k = P.cands.find((c) => c.id === String(m.mayor) && !c.dq);
          if (!k || k.city !== h.city) return err(`Pick a candidate for Mayor of ${cityName(h.city)}.`);
          v.mayor = k.id;
        }
        if (m.party) {
          if (v.party) return err("You already voted for a party in this election.");
          const p = P.parties[String(m.party)];
          if (!p || p.banned) return err("No such party.");
          v.party = p.id;
        }
        if (!m.mayor && !m.party) return err("Nothing to vote for.");
        v.at = Date.now();
        P.votes[u.id] = v;
        d.save();
        ok("Your vote is in. Thank you for voting!");
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_propose": {
        const why = runCheck(u.id);
        if (why) return err(why);
        const mineOpen = Object.values(P.proposals).filter((p) => p.by === u.id && !p.closed).length;
        if (mineOpen >= LIMITS.openProposals) return err(`You can have ${LIMITS.openProposals} open proposals at a time.`);
        const title = text(m.title, LIMITS.proposal), body = text(m.body, LIMITS.proposalBody);
        if (title.length < 10) return err("Give the proposal a clear question (10+ characters).");
        const real = realPolitics(title + " " + body);
        if (real) return err(`Keep real-world politics out of Fyrus ("${real}").`);
        if (!bank2.transfer(u.id, "treasury", FEES.proposal, `Citizens' proposal: ${title.slice(0, 40)}`)) return err(`A proposal costs ${FEES.proposal} FYC.`);
        const id = "pr" + d.rid(6);
        P.proposals[id] = { id, by: u.id, title, body, at: Date.now(), ends: Date.now() + PROPOSAL_MS(), yes: [], no: [] };
        const old = Object.values(P.proposals).sort((a, b) => b.at - a.at).slice(80);
        old.forEach((p) => delete P.proposals[p.id]);
        d.news?.("politics", `New citizens' proposal: ${title}`);
        ok("Proposal published. Voting is open for 3 days.");
        changed();
        return true;
      }
      case "pol_pvote": {
        const why = voterCheck(u.id);
        if (why) return err(why);
        const p = P.proposals[String(m.id)];
        if (!p || p.closed) return err("That proposal is closed.");
        if (p.yes.includes(u.id) || p.no.includes(u.id)) return err("You already voted on this proposal.");
        (m.yes ? p.yes : p.no).push(u.id);
        d.save();
        ok("Vote counted.");
        pushMe(u.id);
        changed(true);
        return true;
      }
      case "pol_dq": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        const k = P.cands.find((c) => c.id === String(m.id));
        if (!k) return err("No such candidate.");
        k.dq = d.clean(m.reason, 120) || "Vote buying";
        for (const v of Object.values(P.votes)) if (v.mayor === k.id) delete v.mayor;
        d.news?.("court", `Court disqualifies ${d.shown(k.id)} from the Mayor race in ${cityName(k.city)}: ${k.dq}`);
        ok("Candidate disqualified; their votes are void.");
        changed();
        return true;
      }
      case "pol_party_ban": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        const p = P.parties[String(m.id)];
        if (!p) return err("No such party.");
        p.banned = d.clean(m.reason, 120) || "Breaking election rules";
        for (const v of Object.values(P.votes)) if (v.party === p.id) delete v.party;
        d.news?.("court", `Court deregisters ${p.name}: ${p.banned}`);
        ok("Party deregistered.");
        changed();
        return true;
      }
      case "pol_close": {
        if (!d.isAdmin(u.id)) return err("Judges only.");
        closeElection();
        return true;
      }
    }
    return true;
  }
  function titleOf(id) {
    const r = P.results[0];
    if (!r) return "";
    const city = Object.entries(r.mayors).find(([, m]) => m?.id === id)?.[0];
    if (city) return `Mayor of ${cityName(city)}`;
    return Object.values(r.mps || {}).some((l) => l.some((x) => x.id === id)) ? "Member of Parliament" : "";
  }
  return { onMessage: onMessage2, state, titleOf, closeElection };
}

