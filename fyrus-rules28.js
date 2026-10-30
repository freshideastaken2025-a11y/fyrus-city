/* FYRUS 28.12 city governance rules (client add-on). window.__fyrusRules28.open() asks the server (rules_get) for the
   city rules and the real enforcement numbers and shows them in a card, with buttons to the Terms of Use and the Fyrus
   Court. Opened from the Parliament civic card ("City rules"). Kill switch ?p28off=rules   Debug: window.__fyrusRules28 */
(function () {
  var OFF = /(^|,)(rules|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  if (OFF) { window.__fyrusRules28 = { off: true }; return; }
  var S = (window.__fyrusRules28 = { off: false, opened: 0, data: null, open: open }), box = null, hooked = null;
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function net() { return window.__fyrusNetDebug && window.__fyrusNetDebug.net(); }
  function hook() { var n = net(); if (!n || !n.ws || hooked === n.ws) return; hooked = n.ws; n.ws.addEventListener('message', function (e) { try { var m = JSON.parse(e.data); if (m.t === 'rules') { S.data = m; render(); } } catch (x) {} }); }
  function close() { if (box) { box.remove(); box = null; } }
  function render() {
    if (!box) return; var body = box.querySelector('[data-rules-body]'); body.textContent = '';
    var D = S.data; if (!D) { body.appendChild(el('div', 'Loading…', 'opacity:.8')); return; }
    D.rules.forEach(function (r) { var row = el('div', null, 'padding:5px 0;border-top:1px solid rgba(255,255,255,.1)'); row.setAttribute('data-rule', r.n); row.appendChild(el('div', r.n + '. ' + r.title, 'font-weight:700')); row.appendChild(el('div', r.text, 'font-size:12px;opacity:.85')); body.appendChild(row); });
    body.appendChild(el('div', 'How the rules are enforced', 'font-weight:700;margin-top:8px;color:#ffc27a'));
    D.enforcement.forEach(function (t) { var e = el('div', '• ' + t, 'font-size:12px;opacity:.85;margin-top:3px'); e.setAttribute('data-rules-enf', ''); body.appendChild(e); });
  }
  function open() {
    S.opened++; hook(); var n = net(); try { n && n.status === 'online' && n.send({ t: 'rules_get' }); } catch (x) {}
    close();
    box = el('div', null, 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:80;width:min(420px,calc(100vw - 32px));max-height:min(78vh,620px);overflow:auto;padding:14px 16px;border-radius:16px;background:rgba(10,14,24,.96);color:#fff;font:13px/1.45 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45)');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'City rules'); box.setAttribute('data-rules-card', '');
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:4px'); h.appendChild(el('div', 'City rules of Fyrus', 'flex:1;font-weight:800;font-size:15px;color:#ffc27a'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = close; h.appendChild(x); box.appendChild(h);
    var body = el('div'); body.setAttribute('data-rules-body', ''); box.appendChild(body);
    var row = el('div', null, 'display:flex;gap:6px;margin-top:10px');
    var terms = el('a', 'Terms of Use', 'flex:1;text-align:center;background:rgba(255,255,255,.12);color:#fff;border-radius:8px;padding:7px;text-decoration:none;font-weight:600'); terms.href = '/terms'; terms.target = '_blank'; terms.rel = 'noopener'; terms.setAttribute('data-rules-terms', '');
    var court = el('button', 'Law & Court', 'flex:1;background:#2f6fe0;border:0;color:#fff;border-radius:8px;padding:7px;cursor:pointer;font-weight:600'); court.setAttribute('data-rules-court', ''); court.onclick = function () { window.__fyrusCivicOpen && window.__fyrusCivicOpen('law'); close(); };
    row.appendChild(terms); row.appendChild(court); box.appendChild(row);
    document.body.appendChild(box); render();
  }
})();
