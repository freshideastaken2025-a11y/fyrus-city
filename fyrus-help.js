/* Fyrus help desk v1.0.0 — "Help & feedback" for citizens + Admin desk > Help desk for judges and moderators.
   Server side: src/server/ops.mjs (/api/support, /api/support/mine, /api/admin/support). */
(function () {
  'use strict';
  if (window.__fyrusHelp) return;
  var API = window.__fyrusHelp = { version: '1.0.0' };
  var GOLD = '#c9a96e', HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var LS = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } } };
  var tok = function () { return LS.get('fyrus.net.token') || ''; };
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  var KINDS = [['problem', '🛠️', 'Something is broken'], ['idea', '💡', 'Idea'], ['question', '❓', 'Question'], ['safety', '🛡️', 'Safety / someone is bothering me'], ['payment', '💳', 'Payment'], ['other', '✉️', 'Other']];

  var css = '' +
    '.fxhd .fxhd-card{width:min(560px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#0d1422;border:1px solid rgba(201,169,110,.35);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.55);padding:20px}' +
    '.fxhd h2{margin:0;font:400 30px/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;color:' + HI + '}' +
    '.fxhd .fxhd-sub{color:' + MUTED + ';font-size:13px;margin:6px 0 14px}' +
    '.fxhd .fxhd-x{float:right;background:none;border:1px solid rgba(255,255,255,.15);color:' + IVORY + ';border-radius:999px;width:34px;height:34px;font-size:16px;cursor:pointer}' +
    '.fxhd .fxhd-tabs{display:flex;gap:6px;margin-bottom:14px}' +
    '.fxhd .fxhd-tab,.fxhd .fxhd-k{border:1px solid rgba(201,169,110,.35);background:transparent;color:' + IVORY + ';border-radius:999px;padding:7px 13px;font:600 12px Sora,sans-serif;cursor:pointer}' +
    '.fxhd .fxhd-tab.on,.fxhd .fxhd-k.on{background:' + GOLD + ';color:#0a0f1a;border-color:' + GOLD + '}' +
    '.fxhd .fxhd-ks{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}' +
    '.fxhd label{display:block;font:500 10px "JetBrains Mono",monospace;letter-spacing:.18em;text-transform:uppercase;color:' + GOLD + ';margin:10px 0 5px}' +
    '.fxhd textarea,.fxhd input{width:100%;box-sizing:border-box;background:#0a0f1a;border:1px solid rgba(255,255,255,.14);border-radius:12px;color:' + IVORY + ';padding:11px 12px;font:14px "Plus Jakarta Sans",system-ui,sans-serif;outline:none}' +
    '.fxhd textarea:focus,.fxhd input:focus{border-color:' + GOLD + '}' +
    '.fxhd textarea{min-height:120px;resize:vertical}' +
    '.fxhd .fxhd-go{margin-top:14px;width:100%;height:46px;border:0;border-radius:999px;background:' + GOLD + ';color:#0a0f1a;font:700 14px Sora,sans-serif;letter-spacing:.04em;cursor:pointer}' +
    '.fxhd .fxhd-go[disabled]{opacity:.5;cursor:default}' +
    '.fxhd .fxhd-note{font-size:12px;color:' + MUTED + ';margin-top:8px;line-height:1.5}' +
    '.fxhd .fxhd-msg{margin-top:10px;padding:10px 12px;border-radius:12px;font-size:13px}' +
    '.fxhd .fxhd-ok{background:rgba(69,224,174,.12);border:1px solid rgba(69,224,174,.4);color:#bff5e3}' +
    '.fxhd .fxhd-bad{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.4);color:#ffd2d2}' +
    '.fxhd-t{border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:12px;margin-bottom:10px;background:rgba(255,255,255,.02)}' +
    '.fxhd-t .h{display:flex;justify-content:space-between;gap:8px;font:600 12px Sora,sans-serif;color:' + HI + '}' +
    '.fxhd-t .m{font:500 10px "JetBrains Mono",monospace;color:' + MUTED + ';letter-spacing:.08em}' +
    '.fxhd-t .b{white-space:pre-wrap;font-size:13px;color:' + IVORY + ';margin-top:6px;line-height:1.5}' +
    '.fxhd-t .r{margin-top:8px;padding:8px 10px;border-left:2px solid ' + GOLD + ';background:rgba(201,169,110,.06);border-radius:0 10px 10px 0;white-space:pre-wrap;font-size:13px;color:' + IVORY + '}' +
    '.fxhd-t .s{display:inline-block;padding:2px 8px;border-radius:999px;font:600 10px Sora,sans-serif;text-transform:uppercase;letter-spacing:.08em}' +
    '.fxhd-t .s-open{background:rgba(255,154,60,.15);color:#ffc58c}.fxhd-t .s-answered{background:rgba(77,163,255,.15);color:#a8d1ff}.fxhd-t .s-closed{background:rgba(255,255,255,.08);color:' + MUTED + '}' +
    '.fxhd-dot{position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%;background:#ff6b6b;box-shadow:0 0 0 2px #0a0f1a}' +
    '.fxhd-adm .fxhd-t textarea{min-height:70px;margin-top:8px}' +
    '.fxhd-adm .row{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}' +
    '.fxhd-adm .row button{border:1px solid rgba(201,169,110,.4);background:transparent;color:' + IVORY + ';border-radius:999px;padding:6px 12px;font:600 12px Sora,sans-serif;cursor:pointer}' +
    '.fxhd-adm .row button.p{background:' + GOLD + ';color:#0a0f1a;border-color:' + GOLD + '}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e[k] = attrs[k]; else if (k === 'text') e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function when(t) { var d = new Date(t); return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }); }
  function where() {
    var s = S(); if (!s) return '';
    try {
      if (s.activeGame) return 'Game: ' + s.activeGame;
      if (s.hud && s.hud.open) return 'Menu: ' + (s.hud.tab || '');
      var b = document.querySelector('button[aria-label="Open map"]'); var t = b && b.innerText ? b.innerText.split('\n')[0] : '';
      return t || 'City';
    } catch (e) { return ''; }
  }
  function device() {
    var ua = navigator.userAgent, os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Other';
    var br = /Edg\//.test(ua) ? 'Edge' : /SamsungBrowser/.test(ua) ? 'Samsung' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Other';
    var s = S(), q = s && s.settings ? s.settings.quality : '';
    return os + ' · ' + br + ' · ' + innerWidth + '×' + innerHeight + (q ? ' · quality ' + q : '');
  }
  function api(path, body) {
    var o = { headers: { 'content-type': 'application/json' } };
    if (tok()) o.headers.authorization = 'Bearer ' + tok();
    if (body) { o.method = 'POST'; o.body = JSON.stringify(body); }
    return fetch(path, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || ('Error ' + r.status)); return j; }); });
  }
  /* keys typed into the form must not walk the avatar */
  function shield(node) { ['keydown', 'keyup', 'keypress'].forEach(function (ev) { node.addEventListener(ev, function (e) { if (e.key !== 'Escape') e.stopPropagation(); }); }); }

  /* ---------------- citizen window ---------------- */
  var ov = null;
  function close() { if (ov) { ov.remove(); ov = null; } }
  API.close = close;
  API.open = function (opt) {
    opt = opt || {};
    close();
    var card = el('div', { 'class': 'fxhd-card', role: 'dialog', 'aria-label': 'Help and feedback' });
    ov = el('div', { 'class': 'fxp-ov fxhd' }, [card]);
    ov.onclick = function (e) { if (e.target === ov) close(); };
    shield(ov);
    document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); } });
    var body = el('div');
    var tabW = el('button', { 'class': 'fxhd-tab on', type: 'button', text: 'Write to us' });
    var tabM = el('button', { 'class': 'fxhd-tab', type: 'button', text: 'My messages' });
    tabW.onclick = function () { tabW.classList.add('on'); tabM.classList.remove('on'); form(); };
    tabM.onclick = function () { tabM.classList.add('on'); tabW.classList.remove('on'); mine(); };
    card.appendChild(el('button', { 'class': 'fxhd-x', type: 'button', 'aria-label': 'Close', text: '✕', onclick: close }));
    card.appendChild(el('h2', { text: 'Help & feedback' }));
    card.appendChild(el('div', { 'class': 'fxhd-sub', text: 'Tell the Fyrus team what broke, what you would like, or ask anything. A real person reads every message.' }));
    card.appendChild(el('div', { 'class': 'fxhd-tabs' }, [tabW, tabM]));
    card.appendChild(body);
    document.body.appendChild(ov);

    function form() {
      body.innerHTML = '';
      var kind = opt.kind || 'problem';
      var ks = el('div', { 'class': 'fxhd-ks' });
      KINDS.forEach(function (k) {
        var b = el('button', { 'class': 'fxhd-k' + (k[0] === kind ? ' on' : ''), type: 'button', text: k[1] + ' ' + k[2] });
        b.onclick = function () { kind = k[0]; Array.prototype.forEach.call(ks.children, function (x) { x.classList.remove('on'); }); b.classList.add('on'); };
        ks.appendChild(b);
      });
      var ta = el('textarea', { maxlength: '2000', placeholder: 'What happened? Where were you, and what did you expect? (Any language is fine.)' });
      var signed = !!tok();
      var em = el('input', { type: 'email', maxlength: '160', placeholder: 'you@example.com', autocomplete: 'email' });
      var go = el('button', { 'class': 'fxhd-go', type: 'button', text: 'Send to the Fyrus team' });
      var msg = el('div');
      go.onclick = function () {
        msg.innerHTML = '';
        go.disabled = true; go.textContent = 'Sending…';
        api('/api/support', { tok: tok(), kind: kind, text: ta.value, email: em.value.trim(), area: where(), device: device(), lang: navigator.language || '' }).then(function (j) {
          body.innerHTML = '';
          body.appendChild(el('div', { 'class': 'fxhd-msg fxhd-ok', text: 'Thank you. Your message ' + j.id + ' reached the Fyrus team. The answer will appear under "My messages"' + (em.value.trim() ? ' and in your e-mail.' : '.') }));
          body.appendChild(el('button', { 'class': 'fxhd-go', type: 'button', text: 'Done', onclick: close }));
        }).catch(function (e) {
          go.disabled = false; go.textContent = 'Send to the Fyrus team';
          msg.appendChild(el('div', { 'class': 'fxhd-msg fxhd-bad', text: e.message || 'Could not send. Check your connection and try again.' }));
        });
      };
      body.appendChild(el('label', { text: 'What is it about?' }));
      body.appendChild(ks);
      body.appendChild(el('label', { text: 'Your message' }));
      body.appendChild(ta);
      body.appendChild(el('label', { text: signed ? 'E-mail (optional — to get the answer by e-mail too)' : 'E-mail (so we can answer you)' }));
      body.appendChild(em);
      body.appendChild(go);
      body.appendChild(msg);
      body.appendChild(el('div', { 'class': 'fxhd-note', text: 'We attach where you are in Fyrus and your device type (for example "Android · Chrome") so we can find the problem. Nothing else. If someone is in danger in real life, contact your local emergency number first.' }));
      setTimeout(function () { try { ta.focus(); } catch (e) {} }, 60);
    }
    function mine() {
      body.innerHTML = '';
      body.appendChild(el('div', { 'class': 'fxhd-note', text: 'Loading…' }));
      api('/api/support/mine').then(function (j) {
        body.innerHTML = '';
        unread = 0; badge();
        if (!j.list || !j.list.length) { body.appendChild(el('div', { 'class': 'fxhd-note', text: tok() ? 'No messages yet.' : 'Enter Fyrus first to see your messages here. Answers to messages sent without entering go to your e-mail.' })); return; }
        j.list.forEach(function (t) { body.appendChild(ticketView(t)); });
      }).catch(function (e) { body.innerHTML = ''; body.appendChild(el('div', { 'class': 'fxhd-msg fxhd-bad', text: e.message })); });
    }
    if (opt.tab === 'mine') { tabM.onclick(); } else form();
  };
  function ticketView(t, staff) {
    var box = el('div', { 'class': 'fxhd-t' });
    box.appendChild(el('div', { 'class': 'h' }, [el('span', { text: t.id + ' · ' + t.kindLabel }), el('span', { 'class': 's s-' + t.status, text: t.status })]));
    var meta = when(t.at);
    if (staff) meta += ' · ' + (t.name || '') + (t.number ? ' ' + t.number : '') + (t.email ? ' · ' + t.email : '') + (t.area ? ' · ' + t.area : '') + (t.device ? ' · ' + t.device : '') + (t.lang ? ' · ' + t.lang : '');
    box.appendChild(el('div', { 'class': 'm', text: meta }));
    box.appendChild(el('div', { 'class': 'b', text: t.text }));
    (t.replies || []).forEach(function (r) { box.appendChild(el('div', { 'class': 'r', text: (r.by || 'Fyrus team') + ' · ' + when(r.at) + '\n' + r.text })); });
    return box;
  }

  /* ---------------- unread answers: red dot on the button + a note once ---------------- */
  var unread = 0, btn = null;
  function badge() {
    if (!btn) return;
    var d = btn.querySelector('.fxhd-dot');
    if (unread && !d) btn.appendChild(el('i', { 'class': 'fxhd-dot' }));
    if (!unread && d) d.remove();
  }
  function peek() {
    if (!tok()) return;
    var s = S(); if (!s || !s.net || s.net.status !== 'online') return;
    api('/api/support/mine?peek=1').then(function (j) { unread = j.unread || 0; badge(); }).catch(function () {});
  }
  setTimeout(peek, 20000); setInterval(peek, 5 * 60000);

  /* ---------------- entry in the ✦ More list ---------------- */
  function mount() {
    var dock = document.querySelector('.fxp-dock');
    if (!dock || dock.querySelector('[data-fxhd]')) return;
    btn = el('button', { type: 'button', 'data-fxhd': '1', 'aria-label': 'Help & feedback', title: 'Help & feedback', style: 'position:relative' }, ['🛟', el('span', { text: 'Help & feedback' })]);
    btn.onclick = function () { API.open(unread ? { tab: 'mine' } : null); };
    dock.appendChild(btn);
    badge();
  }
  setInterval(mount, 1500); mount();

  /* ---------------- Admin desk > Help desk ---------------- */
  API.mountAdmin = function (root) {
    if (!root || root.__fxhd) return; root.__fxhd = 1;
    root.classList.add('fxhd', 'fxhd-adm');
    shield(root);
    var show = 'open';
    function load() {
      root.innerHTML = '';
      root.appendChild(el('div', { 'class': 'fxhd-note', text: 'Loading the help desk…' }));
      api('/api/admin/support').then(function (j) {
        root.innerHTML = '';
        var c = j.counts || {};
        var total = (j.open || []).length;
        root.appendChild(el('div', { 'class': 'h', style: 'font:600 13px Sora,sans-serif;color:' + HI + ';margin-bottom:6px', text: 'Help desk · ' + total + ' waiting' }));
        root.appendChild(el('div', { 'class': 'fxhd-note', style: 'margin:0 0 10px', text: 'Problems ' + (c.problem || 0) + ' · Safety ' + (c.safety || 0) + ' · Questions ' + (c.question || 0) + ' · Ideas ' + (c.idea || 0) + ' · Payment ' + (c.payment || 0) + ' · Other ' + (c.other || 0) + (j.mailTo ? ' · new messages are e-mailed to ' + j.mailTo : ' · set SUPPORT_EMAIL (or BACKUP_EMAIL) in Coolify to get new messages by e-mail') }));
        var tabs = el('div', { 'class': 'fxhd-tabs' });
        [['open', 'Waiting (' + total + ')'], ['closed', 'Closed']].forEach(function (x) {
          tabs.appendChild(el('button', { 'class': 'fxhd-tab' + (show === x[0] ? ' on' : ''), type: 'button', text: x[1], onclick: function () { show = x[0]; load(); } }));
        });
        tabs.appendChild(el('button', { 'class': 'fxhd-tab', type: 'button', text: '↻ Refresh', onclick: load }));
        root.appendChild(tabs);
        var list = show === 'open' ? j.open : j.closed;
        if (!list || !list.length) root.appendChild(el('div', { 'class': 'fxhd-note', text: show === 'open' ? 'Nothing waiting. 🎉' : 'No closed messages yet.' }));
        (list || []).forEach(function (t) {
          var box = ticketView(t, true);
          var ta = el('textarea', { maxlength: '2000', placeholder: 'Write the answer (the citizen sees it in Fyrus' + (t.email ? ' and by e-mail' : '') + ')' });
          var info = el('div');
          function act(status) {
            var b = { id: t.id, reply: ta.value }; if (status) b.status = status;
            api('/api/admin/support', b).then(function () { load(); }).catch(function (e) { info.innerHTML = ''; info.appendChild(el('div', { 'class': 'fxhd-msg fxhd-bad', text: e.message })); });
          }
          var row = el('div', { 'class': 'row' }, [
            el('button', { type: 'button', 'class': 'p', text: 'Send answer', onclick: function () { if (ta.value.trim()) act(''); } }),
            el('button', { type: 'button', text: 'Send & close', onclick: function () { act('closed'); } }),
            t.status === 'closed' ? el('button', { type: 'button', text: 'Reopen', onclick: function () { act('open'); } }) : el('button', { type: 'button', text: 'Close without answer', onclick: function () { ta.value = ''; act('closed'); } })
          ]);
          box.appendChild(ta); box.appendChild(row); box.appendChild(info);
          root.appendChild(box);
        });
      }).catch(function (e) { root.innerHTML = ''; root.appendChild(el('div', { 'class': 'fxhd-msg fxhd-bad', text: e.message })); });
    }
    load();
  };
})();
