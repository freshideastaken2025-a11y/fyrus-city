/* FYRUS 28.9 leisure and entertainment (client add-on). Walking back onto Fyrus Core Plaza (not at spawn) shows a
   "Fun in Fyrus" card: the city's real leisure places with what you can do and what it costs, each with a Taxi button
   (the existing Yellow Taxi trip, normal fare) and, for Joyland, the ride list with fees. Once per visit, x or 30 s.
   Kill switch ?p28off=leisure   Debug: window.__fyrusLeisure28 { inside, shown, armed } ; window.__fyrusLeisure28.show() */
(function () {
  var OFF = /(^|,)(leisure|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var S = (window.__fyrusLeisure28 = { off: OFF, inside: false, shown: 0, armed: false });
  if (OFF) return;
  var C = { x: 0, z: 0, r: 30 }, card = null, hideT = 0, t0 = Date.now();
  var SPOTS = [
    { id: 'joyland', name: 'Fyrus Joyland', x: 130, z: -306, what: 'Fyrus Eye 30 FYC · Thunder Loop 50 FYC · Carousel, Sky Swings, jhoola free' },
    { id: 'club', name: 'Skyline Club', x: 318, z: 8, what: 'Dance floor and DJ · free entry' },
    { id: 'pool', name: 'Lido Pool', x: -118, z: -84, what: 'Swim and sunbathe · free' },
    { id: 'lounge', name: 'Skyline Lounges & Gaming Arena', x: 300, z: 128, what: 'Lounges and games with friends' },
    { id: 'gardens', name: 'Supertree Gardens', x: 40, z: 160, what: 'Walk under the supertrees · free' },
    { id: 'coast', name: 'Sea View Coast', x: 40, z: -372, what: 'Beach walk and sea views · free' }
  ];
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function close() { if (card) { card.remove(); card = null; } }
  function show() {
    close(); S.shown++;
    card = el('div', null, 'position:fixed;left:16px;bottom:96px;z-index:60;width:min(340px,calc(100vw - 32px));max-height:min(60vh,420px);overflow:auto;padding:12px 14px;border-radius:14px;background:rgba(10,14,22,.88);color:#fff;font:13px/1.4 system-ui,sans-serif;backdrop-filter:blur(6px);box-shadow:0 6px 24px rgba(0,0,0,.35)');
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Fun in Fyrus'); card.setAttribute('data-leisure-card', '');
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:6px');
    h.appendChild(el('div', 'Fun in Fyrus · where to go', 'flex:1;font-weight:700;color:#45e0ae'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = close; h.appendChild(x);
    card.appendChild(h);
    SPOTS.forEach(function (s) {
      var row = el('div', null, 'display:flex;align-items:center;gap:8px;padding:5px 0;border-top:1px solid rgba(255,255,255,.1)');
      var n = el('div', null, 'flex:1'); n.appendChild(el('div', s.name, 'font-weight:600')); n.appendChild(el('div', s.what, 'font-size:11.5px;opacity:.75'));
      var go = el('button', 'Taxi', 'background:#ffd23f;border:0;color:#1b1d22;border-radius:8px;padding:6px 10px;cursor:pointer;min-height:32px;font-weight:700');
      go.setAttribute('data-leisure-go', s.id);
      go.onclick = function () { var w = window.__fyrusW; if (w && typeof w.startTaxi === 'function') { w.startTaxi({ x: s.x, z: s.z, name: s.name }); S.lastTaxi = s.id; } close(); };
      row.appendChild(n); row.appendChild(go); card.appendChild(row);
    });
    card.appendChild(el('div', 'Taxi fare: 5 FYC + 4 per 100 m. Or open the map (M) and walk.', 'font-size:11px;opacity:.65;margin-top:6px'));
    document.body.appendChild(card);
    clearTimeout(hideT); hideT = setTimeout(close, 30e3);
  }
  S.show = show;
  setInterval(function () {
    var w = window.__fyrusW, p = w && w.player && w.player.root && w.player.root.position;
    if (!p) return;
    var inside = Math.hypot(p.x - C.x, p.z - C.z) < C.r;
    if (!inside && Date.now() - t0 > 3000) S.armed = true;   // only after the player has left the plaza once (not at spawn)
    if (inside && !S.inside && S.armed) show();
    if (!inside && S.inside) close();
    S.inside = inside;
  }, 300);
})();
