/* FYRUS 28.4 education facilities (client add-on). Walking onto the Education Campus shows a "Classes today" card:
   the city's courses with the next class time (each course meets every 20 minutes, staggered 5 minutes) and buttons
   that open the course in Learn. Once per visit; closes itself after 30 s or with x. Kill switch ?p28off=campus
   Debug: window.__fyrusCampus28 { inside, shown } */
(function () {
  var OFF = /(^|,)(campus|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var S = (window.__fyrusCampus28 = { inside: false, shown: 0, off: OFF });
  if (OFF) return;
  var C = { x: -120, z: -210, r: 50 }, card = null, hideT = 0;
  function nextClass(i) {
    var per = 20 * 60e3, off = (i * 5 * 60e3) % per, now = Date.now(), t = now - ((now - off) % per + per) % per + per;
    var d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function close() { if (card) { card.remove(); card = null; } }
  function show(again) {
    var st = window.__fyrus && window.__fyrus.getState && window.__fyrus.getState(), list = ((st && st.edu && st.edu.courses) || []).slice(0, 4);
    close(); S.shown++;
    card = document.createElement('div');
    card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Classes today at the Education Campus'); card.setAttribute('data-campus-card', '');
    card.style.cssText = 'position:fixed;left:16px;bottom:96px;z-index:60;width:min(320px,calc(100vw - 32px));padding:12px 14px;border-radius:14px;background:rgba(10,14,22,.86);color:#fff;font:13px/1.4 system-ui,sans-serif;backdrop-filter:blur(6px);box-shadow:0 6px 24px rgba(0,0,0,.35)';
    var h = document.createElement('div'); h.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
    var t = document.createElement('div'); t.textContent = 'Education Campus · classes today'; t.style.cssText = 'flex:1;font-weight:700';
    var x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label', 'Close'); x.style.cssText = 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'; x.onclick = close;
    h.appendChild(t); h.appendChild(x); card.appendChild(h);
    if (!list.length && !again && window.__fyrusEduList) { window.__fyrusEduList(); setTimeout(function () { if (card && S.inside) { S.shown--; show(true); } }, 900); }
    if (!list.length) { var e = document.createElement('div'); e.textContent = 'No courses yet. Open Learn to see institutes.'; card.appendChild(e); }
    list.forEach(function (c, i) {
      var row = document.createElement('div'); row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 0;border-top:1px solid rgba(255,255,255,.1)';
      var n = document.createElement('div'); n.style.flex = '1';
      n.innerHTML = ''; var a = document.createElement('div'); a.textContent = c.title; a.style.fontWeight = '600';
      var b = document.createElement('div'); b.textContent = 'Next class ' + nextClass(i) + ' · ' + ((c.lessons && c.lessons.length) || 0) + ' lessons'; b.style.cssText = 'font-size:11.5px;opacity:.75';
      n.appendChild(a); n.appendChild(b);
      var go = document.createElement('button'); go.textContent = 'Open'; go.setAttribute('data-campus-open', c.id);
      go.style.cssText = 'background:#4da3ff;border:0;color:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;min-height:32px';
      go.onclick = function () { window.__fyrusEduOpen && window.__fyrusEduOpen(c.id); close(); };
      row.appendChild(n); row.appendChild(go); card.appendChild(row);
    });
    document.body.appendChild(card);
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
