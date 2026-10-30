/* FYRUS 28.5 civic institutions (client add-on). Walking up to the Parliament of Fyrus shows a "Civic centre" card with the
   live election (cycle, phase, time left, turnout) and the current office holders from the server's pol_state, plus buttons
   into the existing screens: Vote / Mayors & Parliament (HUD > Politics) and Law & Court (Nation). Read-only: every vote,
   nomination and case still goes through the existing server-checked flows. Once per visit; closes after 30 s or with x.
   Kill switch ?p28off=civic   Debug: window.__fyrusCivic28 { inside, shown, off } */
(function () {
  var OFF = /(^|,)(civic|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var S = (window.__fyrusCivic28 = { inside: false, shown: 0, off: OFF });
  if (OFF) return;
  var C = { x: -58, z: -44, r: 38 }, card = null, hideT = 0, tickT = 0;
  function dur(ms) { var m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? m + ' min' : m < 2880 ? Math.round(m / 60) + ' h' : Math.round(m / 1440) + ' days'; }
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function lines() {
    var st = window.__fyrus && window.__fyrus.getState && window.__fyrus.getState(), p = st && st.politics, out = [];
    if (!p || !p.phase) return ['Loading the election…'];
    var left = (p.until || 0) - (Date.now() - (p.skew || 0));
    out.push('Election ' + p.n + ' · ' + (p.phase === 'nominations' ? 'nominations close in ' : 'polls close in ') + dur(left));
    if (p.phase === 'voting') out.push(p.turnout + ' of ' + p.voters + ' registered voters have voted');
    else out.push((p.cands || []).length + ' candidates · ' + (p.parties || []).length + ' parties so far' + (p.end ? ' · polls close in ' + dur(p.end - (Date.now() - (p.skew || 0))) : ''));  // 28.6 calendar
    var o = p.office;
    if (o && o.seats) {
      var top = Object.keys(o.seats).sort(function (a, b) { return o.seats[b] - o.seats[a]; })[0], m = 0;
      for (var k in o.mayors || {}) if (o.mayors[k]) m++;
      out.push(top ? 'In office: ' + ((o.names && o.names[top]) || 'largest party') + ' ' + o.seats[top] + '/' + p.seats + ' seats · ' + m + ' mayors' : 'Last election had no party votes');
    } else out.push('No election has closed yet — no mayors or MPs in office');
    return out;
  }
  function close() { if (card) { card.remove(); card = null; } clearInterval(tickT); }
  function fill(body) { body.textContent = ''; lines().forEach(function (l, i) { body.appendChild(el('div', l, i ? 'font-size:12px;opacity:.8' : 'font-weight:600')); }); }
  function btn(label, key, fn) {
    var b = el('button', label, 'flex:1;background:#2f6fe0;border:0;color:#fff;border-radius:8px;padding:6px 8px;cursor:pointer;min-height:34px;font:600 12px system-ui,sans-serif');
    b.setAttribute('data-civic-open', key); b.onclick = function () { fn(); close(); }; return b;
  }
  function show() {
    close(); S.shown++;
    if (window.__fyrusCivicRefresh) window.__fyrusCivicRefresh();
    card = el('div', null, 'position:fixed;left:16px;bottom:96px;z-index:60;width:min(330px,calc(100vw - 32px));padding:12px 14px;border-radius:14px;background:rgba(10,14,22,.86);color:#fff;font:13px/1.4 system-ui,sans-serif;backdrop-filter:blur(6px);box-shadow:0 6px 24px rgba(0,0,0,.35)');
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Parliament of Fyrus civic centre'); card.setAttribute('data-civic-card', '');
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:6px');
    h.appendChild(el('div', 'Parliament of Fyrus · civic centre', 'flex:1;font-weight:700;color:#ffc27a'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = close; h.appendChild(x);
    card.appendChild(h);
    var body = el('div', null, 'margin-bottom:8px'); fill(body); card.appendChild(body);
    var row = el('div', null, 'display:flex;gap:6px');
    var open = window.__fyrusCivicOpen || function () {};
    row.appendChild(btn('Vote', 'vote', function () { open('vote'); }));
    row.appendChild(btn('Mayors & MPs', 'results', function () { open('results'); }));
    row.appendChild(btn('Law & Court', 'law', function () { open('law'); }));
    card.appendChild(row);
    card.appendChild(el('div', 'Problem or lost item? Police Station help desk, or Report in the city.', 'font-size:11.5px;opacity:.7;margin-top:6px'));
    if (window.__fyrusRules28 && !window.__fyrusRules28.off) { var rl = el('button', 'City rules & how they are enforced \u203A', 'background:none;border:0;color:#7fb8ff;padding:4px 0;cursor:pointer;font:600 12px system-ui,sans-serif;min-height:28px'); rl.setAttribute('data-civic-open', 'rules'); rl.onclick = function () { window.__fyrusRules28.open(); close(); }; card.appendChild(rl); }  // 28.12
    document.body.appendChild(card);
    // keep clear of the local dev avatar panel (bottom-left) when it is open and there is room beside it
    var dp = document.getElementById('fyrus-avatar-demo-panel'), dr = dp && getComputedStyle(dp).display !== 'none' && dp.getBoundingClientRect();
    if (dr && dr.width && dr.right + 12 + card.offsetWidth <= innerWidth - 8) { card.style.left = Math.round(dr.right + 12) + 'px'; S.shifted = true; }
    tickT = setInterval(function () { if (card) fill(body); }, 1000);
    clearTimeout(hideT); hideT = setTimeout(close, 30e3);
  }
  setInterval(function () {
    var w = window.__fyrusW, p = w && w.player && w.player.root && w.player.root.position;
    if (!p) return;
    var inside = Math.hypot(p.x - C.x, p.z - C.z) < C.r;
    if (inside && !S.inside) show();
    if (!inside && S.inside) close();
    S.inside = inside;
  }, 300);
})();
