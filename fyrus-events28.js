/* FYRUS 28.10 social events (client add-on). Walking up to the Fyrus Conference Center or the Skyline Lounges shows a
   "What's on" card with the real hall bookings from the server (live now / starts in, hall, ticket price, going/capacity)
   and buttons into the existing Events screen (tickets, booking). Once per visit, x or 30 s.
   Kill switch ?p28off=events   Debug: window.__fyrusEvents28 { inside, shown } ; window.__fyrusEvents28.show() */
(function () {
  var OFF = /(^|,)(events|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var S = (window.__fyrusEvents28 = { off: OFF, inside: null, shown: 0 });
  if (OFF) return;
  var SITES = [{ id: 'halls', name: 'Fyrus Conference Center', x: -200, z: -320, r: 40 }, { id: 'lounge', name: 'Skyline Lounges & Gaming Arena', x: 300, z: 120, r: 40 }];
  var card = null, hideT = 0, tickT = 0;
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function dur(ms) { var m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? m + ' min' : m < 2880 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' days'; }
  function close() { if (card) { card.remove(); card = null; } clearInterval(tickT); }
  function open(tab) { var st = window.__fyrus && window.__fyrus.setState; if (st) st({ eventsFocus: { tab: tab || 'upcoming' }, hud: { open: true, tab: 'events' } }); close(); }
  function fill(body, site) {
    body.textContent = '';
    var st = window.__fyrus && window.__fyrus.getState && window.__fyrus.getState(), H = st && st.halls, now = Date.now();
    var list = ((H && H.events) || []).filter(function (e) { return e.end > now; }).slice(0, 4);
    if (!H) { body.appendChild(el('div', 'Loading events…', 'opacity:.8')); return; }
    if (!list.length) body.appendChild(el('div', 'Nothing booked right now. Book a hall or lounge and sell tickets — your event shows here and in the news.', 'font-size:12px;opacity:.85'));
    list.forEach(function (e) {
      var row = el('div', null, 'padding:5px 0;border-top:1px solid rgba(255,255,255,.1)'); row.setAttribute('data-events-row', e.id);
      row.appendChild(el('div', e.title, 'font-weight:600'));
      row.appendChild(el('div', (e.start <= now ? 'Live now' : 'Starts in ' + dur(e.start - now)) + ' · ' + (e.price ? e.price + ' FYC' : 'free') + ' · ' + e.going + '/' + e.cap + ' going', 'font-size:11.5px;opacity:.75'));
      body.appendChild(row);
    });
  }
  function show(site) {
    site = site || SITES[0]; close(); S.shown++;
    var net = window.__fyrusNetDebug && window.__fyrusNetDebug.net(); try { if (net && net.status === 'online') net.send({ t: 'hall_list' }); } catch (x) {}
    card = el('div', null, 'position:fixed;left:16px;bottom:96px;z-index:60;width:min(330px,calc(100vw - 32px));padding:12px 14px;border-radius:14px;background:rgba(10,14,22,.88);color:#fff;font:13px/1.4 system-ui,sans-serif;backdrop-filter:blur(6px);box-shadow:0 6px 24px rgba(0,0,0,.35)');
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', "What's on"); card.setAttribute('data-events-card', site.id);
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:6px');
    h.appendChild(el('div', site.name + " · what's on", 'flex:1;font-weight:700;color:#c792ea'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = close; h.appendChild(x);
    card.appendChild(h);
    var body = el('div'); card.appendChild(body); fill(body, site);
    var row = el('div', null, 'display:flex;gap:6px;margin-top:8px');
    [['Tickets & events', 'upcoming'], ['Book a hall', 'book']].forEach(function (b) {
      var bt = el('button', b[0], 'flex:1;background:#7a4fd6;border:0;color:#fff;border-radius:8px;padding:6px 8px;cursor:pointer;min-height:34px;font:600 12px system-ui,sans-serif');
      bt.setAttribute('data-events-open', b[1]); bt.onclick = function () { open(b[1]); }; row.appendChild(bt);
    });
    card.appendChild(row);
    document.body.appendChild(card);
    tickT = setInterval(function () { if (card) fill(body, site); }, 1000);
    clearTimeout(hideT); hideT = setTimeout(close, 30e3);
  }
  S.show = show;
  setInterval(function () {
    var w = window.__fyrusW, p = w && w.player && w.player.root && w.player.root.position;
    if (!p) return;
    var at = null; SITES.forEach(function (s) { if (Math.hypot(p.x - s.x, p.z - s.z) < s.r) at = s; });
    var id = at ? at.id : null;
    if (id && id !== S.inside) show(at);
    if (!id && S.inside) close();
    S.inside = id;
  }, 300);
})();
