// server/news.ts
var H3 = 36e5;
var FEED_EVERY = +(process.env.NEWS_FEED_MS || 20 * 6e4);
var FEEDS = (() => {
  const e = String(process.env.NEWS_FEEDS || "").trim();
  if (e === "off") return [];
  if (!e) return WORLD_FEEDS;
  return e.split(",").map((u) => u.trim()).filter((u) => /^https:\/\//.test(u)).map((url) => ({ name: new URL(url).hostname.replace(/^(www|feeds)\./, ""), url }));
})();
var decode = (s) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/\s+/g, " ").trim();
function parseRss(xml, source) {
  const out = [];
  for (const m of xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/g)) {
    const it = m[0];
    const title = decode(it.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] || "");
    let link = decode(it.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] || "") || (it.match(/<link[^>]*href="([^"]+)"/)?.[1] || "");
    const date = decode(it.match(/<(pubDate|published|updated|dc:date)[^>]*>([\s\S]*?)<\/\1>/)?.[2] || "");
    if (!title || !/^https:\/\//.test(link)) continue;
    link = link.slice(0, 400);
    out.push({ title: title.slice(0, 220), link, source, at: Date.parse(date) || Date.now() });
  }
  return out;
}
function createNews(d) {
  if (!d.db.news) {
    d.db.news = { items: [], seq: 0 };
    d.save();
  }
  const N2 = d.db.news;
  let world = [];
  let worldAt = 0;
  let worldErr = "";
  const visible = () => N2.items.filter((i) => !i.hidden).slice(-80).reverse();
  const pub2 = (i) => ({ id: i.id, kind: i.kind, cat: i.cat, title: i.title, body: i.body, at: i.at, byName: i.byName, flags: i.flags?.length || 0 });
  const state = () => ({ t: "news_state", fyrus: visible().map(pub2), world, worldAt, worldErr: world.length ? "" : worldErr, sources: FEEDS.map((f) => f.name) });
  function report2(cat, title, body) {
    const last = N2.items.at(-1);
    if (last && last.title === title && Date.now() - last.at < 6e4) return;
    const it = { id: ++N2.seq, kind: "fyrus", cat: NEWS_CATS[cat] ? cat : "nation", title: title.slice(0, 160), body: body?.slice(0, 600), at: Date.now() };
    N2.items.push(it);
    if (N2.items.length > 400) N2.items.splice(0, N2.items.length - 400);
    d.save();
    d.broadcast({ t: "news_new", item: pub2(it) });
  }
  async function fetchWorld() {
    if (!FEEDS.length) return;
    const all = [];
    const errs = [];
    await Promise.all(FEEDS.map(async (f) => {
      const ac = new AbortController();
      const tm = setTimeout(() => ac.abort(), 8e3);
      try {
        const r = await fetch(f.url, { signal: ac.signal, headers: { "user-agent": "FyrusNews/1.0 (+https://fyrus.io)", accept: "application/rss+xml, application/xml, text/xml" } });
        if (!r.ok) throw new Error("HTTP " + r.status);
        all.push(...parseRss((await r.text()).slice(0, 2e6), f.name).slice(0, 25));
      } catch (e) {
        errs.push(`${f.name}: ${e?.name === "AbortError" ? "timeout" : e?.message || "failed"}`);
      } finally {
        clearTimeout(tm);
      }
    }));
    if (all.length) {
      const seen = /* @__PURE__ */ new Set();
      world = all.filter((w) => !seen.has(w.link) && seen.add(w.link)).sort((a, b) => b.at - a.at).slice(0, 45);
      worldAt = Date.now();
      d.broadcast({ t: "news_world", world, worldAt });
    }
    worldErr = errs.join(" \xB7 ");
    if (errs.length) console.log("news feeds:", worldErr);
  }
  if (FEEDS.length) {
    setTimeout(fetchWorld, 3e3);
    setInterval(fetchWorld, FEED_EVERY);
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("news_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "news_state":
        reply(state());
        return true;
      case "news_submit": {
        const pp = d.db.users[u.id]?.passport;
        if (!pp || pp.kind === "visa") {
          err("Citizen reports are for Fyrus passport holders.");
          return true;
        }
        const title = d.filter(d.clean(m.title, 120));
        const body = d.filter(String(m.body || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").trim().slice(0, 1200));
        if (title.length < 10 || body.length < 40) {
          err("Write a headline (10+ letters) and the story (40+ letters).");
          return true;
        }
        const bad = sentinel(`${title} ${body}`, 1, "skill");
        if (bad) {
          err(bad.replace("this listing", "this report"));
          return true;
        }
        const today = N2.items.filter((i) => i.by === u.id && Date.now() - i.at < 24 * H3).length;
        if (today >= 3) {
          err("You can post 3 citizen reports a day.");
          return true;
        }
        const it = { id: ++N2.seq, kind: "citizen", cat: "citizen", title, body, at: Date.now(), by: u.id, byName: d.shown(u.id), flags: [] };
        N2.items.push(it);
        if (N2.items.length > 400) N2.items.splice(0, N2.items.length - 400);
        d.save();
        d.broadcast({ t: "news_new", item: pub2(it) });
        reply({ t: "ok", text: "Your report is live on Fyrus News (labelled as a citizen report)." });
        return true;
      }
      case "news_flag": {
        const it = N2.items.find((i) => i.id === +m.id);
        if (!it || it.kind !== "citizen" || it.hidden) return true;
        it.flags = it.flags || [];
        if (!it.flags.includes(u.id) && it.by !== u.id) it.flags.push(u.id);
        if (it.flags.length >= 3) {
          it.hidden = true;
          d.broadcast({ t: "news_gone", id: it.id });
        }
        d.save();
        reply({ t: "ok", text: it.hidden ? "Report taken off air after flags from citizens." : "Thanks, the report was flagged for review." });
        return true;
      }
      case "news_remove": {
        const it = N2.items.find((i) => i.id === +m.id);
        if (!it) return true;
        if (!d.isAdmin(u.id) && it.by !== u.id) {
          err("Only the reporter or a Fyrus judge can remove this.");
          return true;
        }
        it.hidden = true;
        d.save();
        d.broadcast({ t: "news_gone", id: it.id });
        return true;
      }
    }
    return true;
  }
  return { onMessage: onMessage2, report: report2, state, fetchWorld };
}

