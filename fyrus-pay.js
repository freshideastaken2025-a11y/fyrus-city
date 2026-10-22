/* Fyrus FYC shop v1.0.0 — appears only when the server says payments are live (/api/pay/config).
   FYC is credited by the server after the payment partner's signed webhook, never by this page.
   Admin desk > Payments shows the setup status and the last purchases (judges). */
(function () {
  'use strict';
  if (window.__fyrusPay) return;
  var API = window.__fyrusPay = { version: '1.0.0' };
  var GOLD = '#c9a96e', HI = '#e8d5a8', IVORY = '#f4efe6', MUTED = '#9aa3b2';
  var tok = function () { try { return localStorage.getItem('fyrus.net.token') || ''; } catch (e) { return ''; } };
  var cfg = null;
  var css = '' +
    '.fxpay .fxpay-card{width:min(620px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#0d1422;border:1px solid rgba(201,169,110,.35);border-radius:20px;box-shadow:0 24px 70px rgba(0,0,0,.55);padding:20px}' +
    '.fxpay h2{margin:0;font:400 30px/1 "Bebas Neue",Sora,sans-serif;letter-spacing:.06em;color:' + HI + '}' +
    '.fxpay .sub{color:' + MUTED + ';font-size:13px;margin:6px 0 16px;line-height:1.5}' +
    '.fxpay .x{float:right;background:none;border:1px solid rgba(255,255,255,.15);color:' + IVORY + ';border-radius:999px;width:34px;height:34px;font-size:16px;cursor:pointer}' +
    '.fxpay .packs{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px}' +
    '.fxpay .pk{position:relative;border:1px solid rgba(201,169,110,.3);border-radius:16px;padding:16px;background:linear-gradient(180deg,rgba(201,169,110,.08),transparent);text-align:center}' +
    '.fxpay .pk.best{border-color:' + GOLD + '}' +
    '.fxpay .pk .tag{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:' + GOLD + ';color:#0a0f1a;font:700 9px Sora,sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:999px}' +
    '.fxpay .pk .n{font:400 34px/1 "Bebas Neue",Sora,sans-serif;color:' + HI + ';margin-top:4px}' +
    '.fxpay .pk .l{font:600 12px Sora,sans-serif;color:' + IVORY + ';margin-top:4px}' +
    '.fxpay .pk button{margin-top:12px;width:100%;height:42px;border:0;border-radius:999px;background:' + GOLD + ';color:#0a0f1a;font:700 14px Sora,sans-serif;cursor:pointer}' +
    '.fxpay .pk button[disabled]{opacity:.5;cursor:default}' +
    '.fxpay .note{font-size:12px;color:' + MUTED + ';margin-top:14px;line-height:1.55}.fxpay .note a{color:' + HI + '}' +
    '.fxpay .msg{margin-top:12px;padding:10px 12px;border-radius:12px;font-size:13px}' +
    '.fxpay .ok{background:rgba(69,224,174,.12);border:1px solid rgba(69,224,174,.4);color:#bff5e3}.fxpay .bad{background:rgba(255,107,107,.1);border:1px solid rgba(255,107,107,.4);color:#ffd2d2}' +
    '.fxpay-adm .kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin:8px 0}' +
    '.fxpay-adm .kv div{border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px}.fxpay-adm .kv b{display:block;font:400 24px "Bebas Neue",Sora,sans-serif;color:' + HI + '}' +
    '.fxpay-adm table{width:100%;border-collapse:collapse;font-size:12px}.fxpay-adm td,.fxpay-adm th{padding:6px;border-bottom:1px solid rgba(255,255,255,.08);text-align:left}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k.slice(0, 2) === 'on') e[k] = attrs[k]; else if (k === 'text') e.textContent = attrs[k]; else if (k === 'html') e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  function api(path, body) {
    var o = { headers: { 'content-type': 'application/json' } };
    if (tok()) o.headers.authorization = 'Bearer ' + tok();
    if (body) { o.method = 'POST'; o.body = JSON.stringify(body); }
    return fetch(path, o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || ('Error ' + r.status)); return j; }); });
  }
  var ov = null, poll = null;
  function close() { if (ov) { ov.remove(); ov = null; } if (poll) { clearInterval(poll); poll = null; } }
  API.close = close;
  API.open = function () {
    close();
    var card = el('div', { 'class': 'fxpay-card', role: 'dialog', 'aria-label': 'Buy FYC' });
    ov = el('div', { 'class': 'fxp-ov fxpay' }, [card]);
    ov.onclick = function (e) { if (e.target === ov) close(); };
    card.appendChild(el('button', { 'class': 'x', type: 'button', 'aria-label': 'Close', text: '✕', onclick: close }));
    card.appendChild(el('h2', { text: 'Fyrus Coin packs' }));
    card.appendChild(el('div', { 'class': 'sub', text: 'Support Fyrus and get FYC for homes, land, shops and style. FYC is play money for use inside Fyrus only — it cannot be withdrawn or exchanged for cash.' }));
    var grid = el('div', { 'class': 'packs' }), msg = el('div');
    card.appendChild(grid); card.appendChild(msg);
    card.appendChild(el('div', { 'class': 'note', html: 'Secure checkout by our payment partner — your card details never reach Fyrus. Prices before local tax. <a href="/pricing" target="_blank" rel="noopener">Pricing</a> · <a href="/refunds" target="_blank" rel="noopener">14-day refunds</a> · <a href="/terms" target="_blank" rel="noopener">Terms</a>' }));
    document.body.appendChild(ov);
    (cfg && cfg.packs || []).forEach(function (p) {
      var b = el('button', { type: 'button', text: 'Buy · ' + p.price });
      if (!cfg.live || !p.ready) { b.disabled = true; b.textContent = 'Soon'; }
      b.onclick = function () { buy(p, b, msg); };
      grid.appendChild(el('div', { 'class': 'pk' + (p.best ? ' best' : '') }, [p.best ? el('span', { 'class': 'tag', text: 'Most chosen' }) : null, el('div', { 'class': 'n', text: p.fyc.toLocaleString('en') }), el('div', { 'class': 'l', text: 'FYC · ' + p.label }), b]));
    });
    if (!tok()) msg.appendChild(el('div', { 'class': 'msg bad', text: 'Enter Fyrus first, then come back here.' }));
  };
  function buy(p, b, msg) {
    msg.innerHTML = '';
    if (!tok()) { msg.appendChild(el('div', { 'class': 'msg bad', text: 'Enter Fyrus first.' })); return; }
    var w = null; try { w = window.open('about:blank', '_blank'); } catch (e) {}
    b.disabled = true; var t = b.textContent; b.textContent = 'Opening checkout…';
    api('/api/pay/buy', { pack: p.id }).then(function (j) {
      if (!j.url) throw new Error('The checkout link is missing. Please tell us via Help & feedback.');
      if (w && !w.closed) w.location.href = j.url; else location.href = j.url;
      b.textContent = 'Waiting for payment…';
      msg.appendChild(el('div', { 'class': 'msg ok', text: 'Finish the payment in the new tab. Your FYC appear here automatically within a minute after paying.' }));
      var n = 0;
      poll = setInterval(function () {
        if (++n > 200) { clearInterval(poll); poll = null; b.disabled = false; b.textContent = t; return; }
        api('/api/pay/status?order=' + encodeURIComponent(j.order)).then(function (s) {
          if (s.status === 'paid') {
            clearInterval(poll); poll = null;
            msg.innerHTML = '';
            msg.appendChild(el('div', { 'class': 'msg ok', text: '✓ Paid — ' + s.fyc.toLocaleString('en') + ' FYC were added to your wallet. Thank you for supporting Fyrus!' }));
            b.disabled = false; b.textContent = t;
          }
        }).catch(function () {});
      }, 3000);
    }).catch(function (e) {
      if (w && !w.closed) w.close();
      b.disabled = false; b.textContent = t;
      msg.appendChild(el('div', { 'class': 'msg bad', text: e.message }));
    });
  }
  /* entry in ✦ More, only when payments are live */
  function mount() {
    if (!cfg || !cfg.live) return;
    var dock = document.querySelector('.fxp-dock');
    if (!dock || dock.querySelector('[data-fxpay]')) return;
    dock.appendChild(el('button', { type: 'button', 'data-fxpay': '1', 'aria-label': 'Buy FYC', title: 'Buy FYC', onclick: function () { API.open(); } }, ['💳', el('span', { text: 'Buy FYC' })]));
  }
  fetch('/api/pay/config').then(function (r) { return r.json(); }).then(function (j) { cfg = j; API.config = j; mount(); setInterval(mount, 1500); }).catch(function () {});
  if (/[?&]buy=1/.test(location.search)) setTimeout(function () { if (cfg && cfg.live) API.open(); }, 4000);

  /* Admin desk > Payments (judges) */
  API.mountAdmin = function (root) {
    if (!root || root.__fxpay) return; root.__fxpay = 1;
    root.classList.add('fxpay', 'fxpay-adm');
    root.textContent = 'Loading…';
    api('/api/admin/pay').then(function (j) {
      root.innerHTML = '';
      root.appendChild(el('div', { style: 'font:600 13px Sora,sans-serif;color:' + HI, text: j.live ? 'Payments are LIVE · ' + j.provider + (j.env ? ' (' + j.env + ')' : '') : 'Payments are OFF' }));
      if (!j.live) root.appendChild(el('div', { 'class': 'note', text: 'To switch on, set these in Coolify and redeploy: ' + (j.missing || []).join(', ') + '. See FYRUS_HANDOFF.md → Payments.' }));
      root.appendChild(el('div', { 'class': 'kv' }, [el('div', null, [el('b', { text: String(j.paid) }), 'paid orders']), el('div', null, [el('b', { text: (j.fycSold || 0).toLocaleString('en') }), 'FYC sold']), el('div', null, [el('b', { text: String(j.orders) }), 'checkouts started'])]));
      if (j.last && j.last.length) {
        var tb = el('table', null, [el('tr', null, ['When', 'Citizen', 'FYC', 'Price', 'Payment id'].map(function (h) { return el('th', { text: h }); }))]);
        j.last.forEach(function (o) { tb.appendChild(el('tr', null, [new Date(o.at).toLocaleString(), o.who, o.fyc.toLocaleString('en'), o.price, o.txn || o.id].map(function (v) { return el('td', { text: String(v) }); }))); });
        root.appendChild(tb);
      }
    }).catch(function (e) { root.textContent = e.message; });
  };
})();
