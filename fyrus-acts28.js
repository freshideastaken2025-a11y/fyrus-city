/* FYRUS 28.11 player-made activities (client add-on). An "Activities" button opens the city board: activities other
   citizens posted (kind, place, time, going/max) with Join / Leave / Cancel, and a small form to post your own (kind,
   meeting place, title, start in, max people). All rules are on the server (act_* messages); this is only the screen.
   Kill switch ?p28off=acts   Debug: window.__fyrusActs28 { open, list, toggle() } */
(function () {
  var OFF = /(^|,)(acts|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var S = (window.__fyrusActs28 = { off: OFF, open: false, list: null });
  if (OFF) return;
  var net = function () { return window.__fyrusNetDebug && window.__fyrusNetDebug.net(); };
  var send = function (m) { var n = net(); try { if (n && n.status === 'online') { n.send(m); return true; } } catch (x) {} return false; };
  var btn = null, panel = null, hooked = null;
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function dur(ms) { var m = Math.max(1, Math.round(ms / 6e4)); return m < 120 ? m + ' min' : Math.round(m / 60) + ' h'; }
  function small(txt, key, fn, bg) { var b = el('button', txt, 'background:' + (bg || '#2f6fe0') + ';border:0;color:#fff;border-radius:8px;padding:5px 9px;cursor:pointer;min-height:32px;font:600 12px system-ui,sans-serif'); b.setAttribute('data-acts', key); b.onclick = fn; return b; }
  function hook() {
    var n = net(); if (!n || !n.ws || hooked === n.ws) return;
    hooked = n.ws;
    n.ws.addEventListener('message', function (e) { try { var m = JSON.parse(e.data); if (m.t === 'act_list') { S.list = m; render(); } else if (m.t === 'act_changed' && S.open) send({ t: 'act_list' }); } catch (x) {} });
  }
  function render() {
    if (!panel) return;
    var L = S.list, body = panel.querySelector('[data-acts-body]'); body.textContent = '';
    if (!L) { body.appendChild(el('div', 'Loading…', 'opacity:.8')); return; }
    var now = Date.now();
    if (!L.acts.length) body.appendChild(el('div', 'No activities yet — post the first one below.', 'opacity:.8;font-size:12px'));
    L.acts.forEach(function (a) {
      var row = el('div', null, 'display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid rgba(255,255,255,.1)'); row.setAttribute('data-acts-row', a.id);
      var n = el('div', null, 'flex:1;min-width:0'); n.appendChild(el('div', a.title, 'font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'));
      n.appendChild(el('div', a.kindName + ' · ' + a.placeName + ' · ' + (a.start <= now ? 'now' : 'in ' + dur(a.start - now)) + ' · ' + a.going + '/' + a.max + ' · by ' + a.byName, 'font-size:11px;opacity:.75'));
      row.appendChild(n);
      if (a.mine) row.appendChild(small('Cancel', 'cancel-' + a.id, function () { send({ t: 'act_cancel', id: a.id }); }, '#e5484d'));
      else if (a.joined) row.appendChild(small('Leave', 'leave-' + a.id, function () { send({ t: 'act_leave', id: a.id }); }, 'rgba(255,255,255,.18)'));
      else row.appendChild(small(a.going >= a.max ? 'Full' : 'Join', 'join-' + a.id, function () { send({ t: 'act_join', id: a.id }); }));
      body.appendChild(row);
    });
    var f = panel.querySelector('[data-acts-form]');
    if (f && !f.childNodes.length && L.kinds) buildForm(f, L);
  }
  function sel(key, opts) { var s = el('select', null, 'flex:1;min-width:0;background:#141a28;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:7px;padding:5px;min-height:32px'); s.setAttribute('data-acts-in', key); opts.forEach(function (o) { var op = el('option', o[1]); op.value = o[0]; s.appendChild(op); }); return s; }
  function buildForm(f, L) {
    f.appendChild(el('div', 'Post an activity', 'font-weight:700;margin:8px 0 4px'));
    var r1 = el('div', null, 'display:flex;gap:6px'); var kind = sel('kind', Object.keys(L.kinds).map(function (k) { return [k, L.kinds[k]]; })); var place = sel('place', L.places.map(function (p) { return [p.id, p.name]; }));
    r1.appendChild(kind); r1.appendChild(place); f.appendChild(r1);
    var title = el('input', null, 'width:100%;box-sizing:border-box;margin-top:6px;background:#141a28;color:#fff;border:1px solid rgba(255,255,255,.2);border-radius:7px;padding:6px;min-height:32px'); title.maxLength = 60; title.placeholder = 'Title, e.g. Pickup football, all welcome'; title.setAttribute('data-acts-in', 'title'); f.appendChild(title);
    var r2 = el('div', null, 'display:flex;gap:6px;margin-top:6px;align-items:center');
    var inMin = sel('inMin', [[10, 'in 10 min'], [15, 'in 15 min'], [30, 'in 30 min'], [60, 'in 1 h'], [120, 'in 2 h']]); var max = sel('max', [[4, 'up to 4'], [8, 'up to 8'], [12, 'up to 12'], [20, 'up to 20'], [30, 'up to 30']]);
    r2.appendChild(inMin); r2.appendChild(max);
    r2.appendChild(small('Post', 'post', function () { send({ t: 'act_create', kind: kind.value, place: place.value, title: title.value, inMin: +inMin.value, max: +max.value }) && (title.value = ''); }, '#45a86a'));
    f.appendChild(r2);
    f.appendChild(el('div', 'Free and just for fun. Keep it friendly: titles are filtered and you can have one open activity at a time.', 'font-size:10.5px;opacity:.6;margin-top:6px'));
  }
  function toggle(force) {
    S.open = force != null ? force : !S.open;
    if (!S.open) { if (panel) panel.remove(); panel = null; return; }
    hook(); send({ t: 'act_list' });
    panel = el('div', null, 'position:fixed;right:16px;bottom:200px;z-index:61;width:min(350px,calc(100vw - 32px));max-height:min(62vh,480px);overflow:auto;padding:12px 14px;border-radius:14px;background:rgba(10,14,22,.92);color:#fff;font:13px/1.4 system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.4)');
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Citizen activities'); panel.setAttribute('data-acts-panel', '');
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:4px'); h.appendChild(el('div', 'Citizen activities', 'flex:1;font-weight:700;color:#7fd1ff'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = function () { toggle(false); }; h.appendChild(x);
    panel.appendChild(h); var body = el('div'); body.setAttribute('data-acts-body', ''); panel.appendChild(body); var f = el('div'); f.setAttribute('data-acts-form', ''); panel.appendChild(f);
    document.body.appendChild(panel); render();
  }
  S.toggle = toggle;
  function mount() {
    if (btn || !document.body) return;
    btn = el('button', 'Activities', 'position:fixed;right:16px;bottom:150px;z-index:59;background:rgba(10,14,22,.82);color:#7fd1ff;border:1px solid rgba(127,209,255,.4);border-radius:999px;padding:7px 14px;cursor:pointer;min-height:36px;font:700 12px system-ui,sans-serif');
    btn.setAttribute('data-acts-button', ''); btn.setAttribute('aria-label', 'Citizen activities'); btn.onclick = function () { toggle(); };
    document.body.appendChild(btn);
  }
  var iv = setInterval(function () { if (window.__fyrusW) { mount(); hook(); } }, 1000);
  S.stop = function () { clearInterval(iv); };
})();
