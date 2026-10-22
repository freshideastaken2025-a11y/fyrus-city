/* Fyrus — growth analytics + invite links (v1.0)
   1) Every minute while the page is open and visible, tells the Fyrus server (first-party, no trackers) which area the
      citizen is in: a district, inside a building, a menu tab, a 3D room, a game. The server adds it up per day.
   2) Invite links: fyrus.io/?ref=CODE. The main app remembers the code on the first visit and sends it when the
      citizen is created; this file reports that the link was opened.
   3) Admin desk → Growth tab: new citizens, next-day / within-a-week return, where time is spent, where people leave,
      how long visits last, and every invite link with its results. Judges only.
   API: window.__fyrusGrowth.mount(el), .area() */
(function () {
  'use strict';
  if (window.__fyrusGrowth) return;
  var API = window.__fyrusGrowth = { version: '1.1.0' };
  var TOK = 'fyrus.net.token';
  var LS = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };

  /* ---------- which area is the citizen in right now ---------- */
  var GAME = function (id) { try { var g = (window.__fyrusGames || []).find(function (x) { return x.id === id; }); return g ? g.name : id; } catch (e) { return id; } };
  function area() {
    var s = S() || {};
    if (document.querySelector('.fxi')) return 'Opening film';
    if (document.querySelector('.fxa')) return 'Battle Arena';
    if (document.querySelector('.fxh')) return 'Arcade Hall (3D)';
    if (document.querySelector('.fxm')) return '3D Stores';
    if (document.querySelector('.fx3h')) return 'Home Showroom (3D)';
    if (s.activeGame) return 'Game · ' + GAME(s.activeGame);
    if (s.trip) return 'Travelling';
    if (s.productView || s.shopView) return 'Market · shop';
    if (s.hud && s.hud.open) return 'Menu · ' + (s.hud.tab || 'home');
    if (document.querySelector('.fxp-ov,.fxc-ov')) { var h = document.querySelector('.fxp-ov .fxp-h,.fxc-ov h2,.fxc-ov .fxc-h'); return 'Window · ' + ((h && h.textContent) || 'Fyrus').slice(0, 30); }
    if (s.scene && s.scene.mode && s.scene.mode !== 'plaza') return 'Inside · ' + s.scene.mode;
    return s.district || 'City';
  }
  API.area = area;
  function post(url, body) {
    try {
      var data = JSON.stringify(body);
      if (navigator.sendBeacon) { if (navigator.sendBeacon(url, new Blob([data], { type: 'application/json' }))) return; }
      fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: data, keepalive: true }).catch(function () {});
    } catch (e) {}
  }
  function tick() {
    if (document.visibilityState !== 'visible') return;
    var tok = LS.get(TOK), s = S();
    if (!tok || !s || !s.net || s.net.status !== 'online') return;
    post('/api/an', { tok: tok, a: area() });
  }
  setTimeout(tick, 15000);
  setInterval(tick, 60000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { var tok = LS.get(TOK); if (tok) post('/api/an', { tok: tok, a: area() }); } });

  /* ---------- once a day: what kind of device and where the visit came from (totals only) ---------- */
  var SRC = (function () {
    var saved = LS.get('fyrus.src'); if (saved) return saved;
    var src = 'Direct';
    try {
      var q = new URLSearchParams(location.search);
      if (q.get('ref')) src = 'Invite link';
      else if (q.get('utm_source')) src = q.get('utm_source').slice(0, 30);
      else if (document.referrer) {
        var h = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (h !== location.hostname) {
          src = /whatsapp|wa\.me/.test(h) ? 'WhatsApp' : /instagram/.test(h) ? 'Instagram' : /facebook|fb\.|messenger/.test(h) ? 'Facebook' : /google\./.test(h) ? 'Google' : /bing\./.test(h) ? 'Bing' : /(^|\.)t\.co$|twitter|x\.com/.test(h) ? 'X / Twitter' : /youtube|youtu\.be/.test(h) ? 'YouTube' : /tiktok/.test(h) ? 'TikTok' : /linkedin|lnkd/.test(h) ? 'LinkedIn' : /telegram|t\.me/.test(h) ? 'Telegram' : /reddit/.test(h) ? 'Reddit' : h.slice(0, 30);
        }
      }
    } catch (e) {}
    LS.set('fyrus.src', src);
    return src;
  })();
  function deviceInfo() {
    var ua = navigator.userAgent || '', touch = 'ontouchstart' in window || navigator.maxTouchPoints > 1, m = Math.min(screen.width, screen.height);
    var dev = touch && m < 600 ? 'Phone' : touch && m < 1100 ? 'Tablet' : 'Computer';
    var os = /Android/i.test(ua) ? 'Android' : /iPhone|iPod/i.test(ua) ? 'iPhone' : /iPad/i.test(ua) || (/Macintosh/.test(ua) && touch) ? 'iPad' : /Windows/i.test(ua) ? 'Windows' : /CrOS/.test(ua) ? 'ChromeOS' : /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /Linux/i.test(ua) ? 'Linux' : 'Other';
    var br = /SamsungBrowser/i.test(ua) ? 'Samsung Internet' : /Edg\//.test(ua) ? 'Edge' : /OPR\/|Opera/.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Other';
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    var region = tz ? tz.split('/').slice(-1)[0].replace(/_/g, ' ') + (tz.indexOf('/') > 0 ? ' (' + tz.split('/')[0] + ')' : '') : 'Unknown';
    var s = S() || {}, fps = 0; try { fps = (window.__fyrusPerf && window.__fyrusPerf.stats().fps) || 0; } catch (e) {}
    return { dev: dev, os: os, br: br, tz: region, lang: (navigator.language || 'unknown').slice(0, 12), src: SRC, q: (s.settings && s.settings.quality) || 'unknown', fps: fps };
  }
  var visitSent = false;
  function visit() {
    if (visitSent || document.visibilityState !== 'visible') return;
    var tok = LS.get(TOK), s = S();
    if (!tok || !s || !s.net || s.net.status !== 'online') return;
    visitSent = true;
    post('/api/an/visit', Object.assign({ tok: tok }, deviceInfo()));
  }
  setTimeout(visit, 35000);
  setInterval(visit, 60000);

  /* ---------- invite link opened ---------- */
  try {
    var q = new URLSearchParams(location.search).get('ref');
    if (q) {
      q = q.toLowerCase().slice(0, 24);
      if (!LS.get('fyrus.ref')) LS.set('fyrus.ref', q);
      if (!LS.get('fyrus.ref.opened.' + q)) { LS.set('fyrus.ref.opened.' + q, '1'); post('/api/ref', { c: q }); }
    }
  } catch (e) {}

  /* =================== Admin desk → Growth =================== */
  var css = '' +
    '.fxg{font:500 13px "Plus Jakarta Sans",system-ui,sans-serif;color:#f4efe6}' +
    '.fxg h3{font:600 13px Sora,sans-serif;margin:14px 0 6px;color:#e8d5a8;letter-spacing:.02em}' +
    '.fxg .k{font:500 10px "JetBrains Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:#9aa3b2}' +
    '.fxg .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px}' +
    '.fxg .tile{border:1px solid rgba(201,169,110,.25);border-radius:12px;padding:10px;background:rgba(10,15,26,.5)}' +
    '.fxg .tile b{display:block;font:700 22px Sora,sans-serif;margin-top:4px}' +
    '.fxg table{width:100%;border-collapse:collapse;font-size:12px}' +
    '.fxg td,.fxg th{padding:5px 6px;border-bottom:1px solid rgba(255,255,255,.07);text-align:right;white-space:nowrap}' +
    '.fxg td:first-child,.fxg th:first-child{text-align:left;white-space:normal}' +
    '.fxg th{font:500 10px "JetBrains Mono",monospace;letter-spacing:.12em;text-transform:uppercase;color:#9aa3b2}' +
    '.fxg .bar{position:relative;height:22px;border-radius:7px;background:rgba(255,255,255,.04);margin:4px 0;overflow:hidden}' +
    '.fxg .bar i{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(201,169,110,.55),rgba(201,169,110,.2));border-radius:7px}' +
    '.fxg .bar span{position:relative;display:flex;justify-content:space-between;padding:0 8px;line-height:22px;font-size:12px}' +
    '.fxg .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}' +
    '.fxg input{flex:1;min-width:160px;background:rgba(255,255,255,.06);border:1px solid rgba(201,169,110,.3);border-radius:10px;padding:8px 10px;color:#fff;font:500 13px "Plus Jakarta Sans",sans-serif}' +
    '.fxg button{border:1px solid rgba(201,169,110,.5);background:rgba(201,169,110,.14);color:#e8d5a8;border-radius:999px;padding:7px 12px;font:600 12px Sora,sans-serif;cursor:pointer}' +
    '.fxg button.solid{background:linear-gradient(135deg,#e8d5a8,#c9a96e);color:#0a0f1a;border:0}' +
    '.fxg .inv{border:1px solid rgba(201,169,110,.2);border-radius:12px;padding:10px;margin:6px 0;background:rgba(10,15,26,.45)}' +
    '.fxg .inv code{font:500 11px "JetBrains Mono",monospace;color:#a8d8ff;word-break:break-all}' +
    '.fxg .muted{color:#9aa3b2;font-size:12px}' +
    '.fxg .err{color:#ffb4a0}';
  var styled = false;
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'onclick') e.onclick = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c); });
    return e;
  }
  function pct(a, b) { return b ? Math.round(a * 100 / b) + '%' : '—'; }
  function fmtMin(m) { return m >= 60 ? (m / 60).toFixed(1) + ' h' : m + ' min'; }
  function bars(list, fmt) {
    var max = list.reduce(function (m, x) { return Math.max(m, x[1]); }, 0) || 1;
    return el('div', null, list.length ? list.map(function (x) { var b = el('div', { 'class': 'bar' }, [el('i', { style: 'width:' + Math.max(2, x[1] * 100 / max) + '%' }), el('span', null, [el('span', null, [x[0]]), el('b', null, [fmt ? fmt(x[1]) : String(x[1])])])]); return b; }) : [el('div', { 'class': 'muted' }, ['No data yet — it fills up as citizens visit.'])]);
  }
  function api(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({ authorization: 'Bearer ' + (LS.get(TOK) || '') }, opts.headers || {});
    return fetch(path, opts).then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.error || ('HTTP ' + r.status)); return j; }); });
  }
  function linkOf(code) { return location.origin + '/?ref=' + encodeURIComponent(code); }
  function copy(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = t; }, 1500); };
    try { navigator.clipboard.writeText(text).then(done, function () { prompt('Copy this link', text); }); } catch (e) { prompt('Copy this link', text); }
  }
  function render(root, data) {
    root.innerHTML = '';
    var tr = data.daily.slice(-7), new7 = tr.reduce(function (a, d) { return a + d.newCitizens; }, 0), today = data.daily[data.daily.length - 1] || {};
    var withNext = data.cohorts.filter(function (c) { return c.nextDay != null && !c.partial; }), joinedN = withNext.reduce(function (a, c) { return a + c.joined; }, 0), nextN = withNext.reduce(function (a, c) { return a + c.nextDay; }, 0), weekN = withNext.reduce(function (a, c) { return a + c.week; }, 0);
    root.appendChild(el('div', { 'class': 'tiles' }, [
      el('div', { 'class': 'tile' }, [el('div', { 'class': 'k' }, ['Citizens']), el('b', null, [data.totalCitizens])]),
      el('div', { 'class': 'tile' }, [el('div', { 'class': 'k' }, ['New · 7 days']), el('b', null, [new7])]),
      el('div', { 'class': 'tile' }, [el('div', { 'class': 'k' }, ['Active today']), el('b', null, [today.active || 0])]),
      el('div', { 'class': 'tile' }, [el('div', { 'class': 'k' }, ['Back next day']), el('b', null, [pct(nextN, joinedN)])]),
      el('div', { 'class': 'tile' }, [el('div', { 'class': 'k' }, ['Back within a week']), el('b', null, [pct(weekN, joinedN)])])
    ]));
    root.appendChild(el('div', { 'class': 'muted', style: 'margin-top:6px' }, ['Tracking areas and return visits since ' + data.trackingSince + '. Older citizens only count from that day on.']));

    root.appendChild(el('h3', null, ['Invite links (beta)']));
    var inp = el('input', { placeholder: "Name for the link, e.g. Ali's friends, Instagram, Office team", maxlength: '40' });
    var msg = el('div', { 'class': 'muted' });
    var mk = el('button', { 'class': 'solid', onclick: function () {
      mk.disabled = true; msg.textContent = '';
      api('/api/admin/invites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ label: inp.value }) })
        .then(function () { load(root); }).catch(function (e) { msg.className = 'err'; msg.textContent = e.message; mk.disabled = false; });
    } }, ['Make invite link']);
    root.appendChild(el('div', { 'class': 'row' }, [inp, mk])); root.appendChild(msg);
    if (!data.invites.length) root.appendChild(el('div', { 'class': 'muted', style: 'margin-top:6px' }, ['Make one link per group of people (friends, a WhatsApp group, Instagram) to see which group comes and stays.']));
    data.invites.forEach(function (iv) {
      var link = linkOf(iv.code), cb = el('button', null, ['Copy link']);
      cb.onclick = function () { copy(link, cb); };
      var wa = el('button', { onclick: function () { window.open('https://wa.me/?text=' + encodeURIComponent('Come see Fyrus — a virtual country for 2040. Get your citizen ID free: ' + link), '_blank', 'noopener'); } }, ['WhatsApp']);
      var del = el('button', { onclick: function () { if (!confirm('Delete the link "' + iv.label + '"? People who already joined keep their accounts.')) return; api('/api/admin/invites', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ del: iv.code }) }).then(function () { load(root); }); } }, ['Delete']);
      root.appendChild(el('div', { 'class': 'inv' }, [
        el('div', { 'class': 'row', style: 'justify-content:space-between' }, [el('b', null, [iv.label]), el('span', { 'class': 'muted' }, [new Date(iv.at).toLocaleDateString()])]),
        el('code', null, [link]),
        el('table', { style: 'margin-top:6px' }, [
          el('tr', null, [el('th', null, ['Opened']), el('th', null, ['Joined']), el('th', null, ['Back next day']), el('th', null, ['Active last 7 days'])]),
          el('tr', null, [el('td', null, [iv.opens]), el('td', null, [iv.joined]), el('td', null, [iv.nextDay + ' (' + pct(iv.nextDay, iv.joined) + ')']), el('td', null, [iv.active7])])
        ]),
        el('div', { 'class': 'row', style: 'margin-top:6px' }, [cb, wa, del])
      ]));
    });
    root.appendChild(el('div', { 'class': 'muted', style: 'margin-top:4px' }, ['Without an invite link: ' + data.direct.joined + ' citizens, ' + data.direct.active7 + ' active in the last 7 days.']));

    root.appendChild(el('h3', null, ['New citizens and return visits (by the day they joined)']));
    var t = el('table', null, [el('tr', null, [el('th', null, ['Joined on']), el('th', null, ['New']), el('th', null, ['Back next day']), el('th', null, ['Back within a week'])])]);
    data.cohorts.slice().reverse().forEach(function (c) {
      t.appendChild(el('tr', null, [el('td', null, [c.day]), el('td', null, [c.joined]),
        el('td', null, [c.partial ? 'not tracked' : c.nextDay == null ? 'tomorrow' : c.nextDay + ' (' + pct(c.nextDay, c.joined) + ')']),
        el('td', null, [c.partial ? 'not tracked' : c.week == null ? '—' : c.week + ' (' + pct(c.week, c.joined) + ')'])]));
    });
    if (!data.cohorts.length) t.appendChild(el('tr', null, [el('td', { colspan: '4', 'class': 'muted' }, ['No new citizens in the last 14 days.'])]));
    root.appendChild(t);

    root.appendChild(el('h3', null, ['Where people spend their time · last 7 days']));
    root.appendChild(bars(data.areas, fmtMin));
    root.appendChild(el('h3', null, ['Where visits end · last 7 days']));
    root.appendChild(el('div', { 'class': 'muted' }, ['The place a citizen was in when they closed Fyrus. A place near the top may be confusing, slow or simply the last stop.']));
    root.appendChild(bars(data.exits));
    root.appendChild(el('h3', null, ['How long visits last · last 7 days']));
    var s = data.sess;
    root.appendChild(bars([['Under 1 minute', s.m1], ['1–5 minutes', s.m5], ['5–15 minutes', s.m15], ['15–60 minutes', s.m60], ['Over 1 hour', s.more]]));
    var W = data.who || {}, names = [['device', 'Phone, tablet or computer'], ['source', 'Where visits come from'], ['region', 'Time zone (rough location)'], ['language', 'Browser language'], ['os', 'Operating system'], ['browser', 'Browser'], ['smoothness', 'How smoothly Fyrus runs'], ['quality', 'Graphics setting']];
    root.appendChild(el('h3', null, ['Who visits · last 7 days (once per citizen per day)']));
    if (!Object.keys(W).length) root.appendChild(el('div', { 'class': 'muted' }, ['Starts filling as citizens visit (each visit is counted after 35 seconds).']));
    names.forEach(function (n) { if (!W[n[0]] || !W[n[0]].length) return; root.appendChild(el('div', { 'class': 'k', style: 'margin-top:10px' }, [n[1]])); root.appendChild(bars(W[n[0]])); });
    root.appendChild(el('h3', null, ['Daily · last 14 days']));
    var dt = el('table', null, [el('tr', null, [el('th', null, ['Day']), el('th', null, ['New']), el('th', null, ['Active']), el('th', null, ['Visits']), el('th', null, ['Peak online'])])]);
    data.daily.slice().reverse().forEach(function (d) { dt.appendChild(el('tr', null, [el('td', null, [d.day]), el('td', null, [d.newCitizens]), el('td', null, [d.active]), el('td', null, [d.visits]), el('td', null, [d.peak])])); });
    root.appendChild(dt);
    root.appendChild(el('div', { 'class': 'row', style: 'margin-top:10px' }, [el('button', { onclick: function () { load(root); } }, ['Refresh'])]));
  }
  function load(root) {
    root.innerHTML = '<div class="muted">Loading growth numbers…</div>';
    api('/api/admin/analytics').then(function (d) { render(root, d); }).catch(function (e) { root.innerHTML = ''; root.appendChild(el('div', { 'class': 'err' }, [/Judges/.test(e.message) ? 'Growth numbers are for judges (FYRUS_ADMINS) only.' : 'Could not load: ' + e.message])); });
  }
  API.mount = function (host) {
    if (!host || host.__fxg) return; host.__fxg = true;
    if (!styled) { styled = true; var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st); }
    var root = el('div', { 'class': 'fxg' }); host.appendChild(root); load(root);
  };
})();
