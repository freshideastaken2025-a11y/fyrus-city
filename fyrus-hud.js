/* Fyrus — calm HUD (v1.0)
   - The right-hand column of extra buttons (film, book, weather, ID, museum, cinematic, easy mode,
     transit, today, arena …) folds into one "More" button. Tapping it opens the same buttons as a
     labelled list. Nothing is removed: every button still works exactly as before.
   - On phones the top bar keeps only search, wallet, settings and menu; "Happening now", "Flex my
     status" and "Map" move into the More list. The minimap gets smaller so it no longer sits under
     the top bar.
   - The More button hides itself while a window or a 3D scene is open.
   API: window.__fyrusHud.open(), .close() */
(function () {
  'use strict';
  if (window.__fyrusHud) return;
  var API = window.__fyrusHud = { version: '1.0.0' };
  var GOLD = '#c9a96e', GOLD_HI = '#e8d5a8';
  var css = '' +
    /* folded column: only the toggle shows */
    '.fxp-dock.fxu-on:not(.fxu-open)>button:not(.fxu-t){display:none!important}' +
    '.fxp-dock .fxu-t{position:relative}' +
    '.fxp-dock .fxu-t i{font-style:normal;font-size:20px;line-height:1;color:' + GOLD_HI + '}' +
    '.fxp-dock .fxu-t b{position:absolute;top:-4px;right:-4px;min-width:16px;height:16px;border-radius:8px;background:' + GOLD + ';color:#0a0f1a;font:700 9px/16px Sora,sans-serif;padding:0 3px}' +
    /* opened: a labelled list */
    '.fxp-dock.fxu-open{top:auto!important;bottom:calc(env(safe-area-inset-bottom,0px) + 96px)!important;transform:none!important;right:12px!important;width:min(300px,calc(100vw - 24px));max-height:calc(100vh - 190px);overflow-y:auto;padding:12px;border-radius:18px;background:rgba(10,15,26,.92);border:1px solid rgba(201,169,110,.35);box-shadow:0 18px 50px rgba(0,0,0,.45);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);gap:6px!important}' +
    '.fxp-dock.fxu-open>button{width:100%!important;height:44px!important;display:flex!important;align-items:center;justify-content:flex-start;gap:12px;padding:0 12px!important;font-size:19px!important;border-radius:12px!important}' +
    '.fxp-dock.fxu-open>button span{position:static!important;opacity:1!important;background:none!important;padding:0!important;font:600 13px Sora,sans-serif!important;color:#f4efe6;white-space:nowrap}' +
    '.fxp-dock.fxu-open>button.fxu-t{justify-content:space-between}' +
    '.fxp-dock.fxu-open>.fxu-t b{display:none}' +
    '.fxp-dock .fxu-h{display:none}' +
    '.fxp-dock.fxu-open .fxu-h{display:block;font:500 10px "JetBrains Mono",monospace;letter-spacing:.2em;text-transform:uppercase;color:' + GOLD + ';padding:2px 4px 4px}' +
    '.fxp-dock .fxu-p{display:none}' +
    /* calm phone top bar + smaller minimap */
    '@media (max-width:640px){' +
    '#now-btn,#flex-status,button[aria-label="Map (M)"]{display:none!important}' +
    '.fxp-dock.fxu-open .fxu-p{display:flex!important}' +
    'button[aria-label="Open map"] canvas{width:112px!important;height:112px!important}' +
    'button[aria-label="Open map"]>div{width:112px!important}' +
    '}' +
    /* hide the More button while something is open on top */
    'body.fxu-busy .fxp-dock{opacity:0!important;pointer-events:none!important}' +
    '.fxp-dock{transition:opacity .25s ease}';
  var st = document.createElement('style'); st.id = 'fyrus-hud-css'; st.textContent = css; document.head.appendChild(st);

  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) { if (k === 'onclick') e.onclick = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  }
  var dock = null, toggle = null, head = null;
  function items() { return dock ? Array.prototype.filter.call(dock.children, function (b) { return b.tagName === 'BUTTON' && !b.classList.contains('fxu-t'); }) : []; }
  function setOpen(v) {
    if (!dock) return;
    dock.classList.toggle('fxu-open', !!v);
    toggle.setAttribute('aria-expanded', v ? 'true' : 'false');
    toggle.querySelector('span').textContent = v ? 'Close' : 'More';
    toggle.querySelector('i').textContent = v ? '✕' : '✦';
  }
  API.open = function () { setOpen(true); };
  API.close = function () { setOpen(false); };
  function proxy(id, icon, label, find) {
    if (dock.querySelector('[data-fxu-p="' + id + '"]')) return;
    var b = el('button', { 'class': 'fxu-p', 'data-fxu-p': id, 'aria-label': label, type: 'button' }, [icon, el('span', null, [label])]);
    b.onclick = function () { var t = find(); setOpen(false); if (t) t.click(); };
    dock.appendChild(b);
  }
  function mount() {
    var d = document.querySelector('.fxp-dock');
    if (!d) return;
    if (d !== dock) { dock = d; toggle = null; }
    if (!toggle || !toggle.parentNode) {
      toggle = el('button', { 'class': 'fxu-t', type: 'button', 'aria-label': 'More', 'aria-expanded': 'false' }, [el('i', null, ['✦']), el('span', null, ['More']), el('b', null, [''])]);
      toggle.onclick = function (e) { e.stopPropagation(); setOpen(!dock.classList.contains('fxu-open')); };
      dock.insertBefore(toggle, dock.firstChild);
      head = el('div', { 'class': 'fxu-h' }, ['Fyrus extras']);
      dock.insertBefore(head, toggle.nextSibling);
      dock.classList.add('fxu-on');
      /* picking an item closes the list (the item still does its own thing) */
      dock.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('button'); if (b && b !== toggle && !b.classList.contains('fxu-p')) setOpen(false); }, false);
    }
    proxy('now', '🔴', 'Happening now', function () { return document.getElementById('now-btn'); });
    proxy('flex', '📸', 'Flex my status', function () { return document.getElementById('flex-status'); });
    proxy('map', '🗺️', 'City map', function () { return document.querySelector('button[aria-label="Map (M)"]'); });
    var n = items().filter(function (b) { return !b.classList.contains('fxu-p'); }).length;
    toggle.querySelector('b').textContent = n ? String(n) : '';
  }
  /* close on outside tap / Escape */
  document.addEventListener('pointerdown', function (e) { if (dock && dock.classList.contains('fxu-open') && !dock.contains(e.target)) setOpen(false); }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dock && dock.classList.contains('fxu-open')) setOpen(false); });

  /* something on top? (Fyrus windows, 3D scenes, city menus) */
  var S = function () { try { return window.__fyrus.getState(); } catch (e) { return null; } };
  function busy() {
    if (document.querySelector('.fxp-ov,.fxc-ov,.fxm,.fxh,.fx3h,.fxa,.fxi')) return true;
    var s = S();
    if (s && (s.searchOpen || s.activeGame || (s.hud && s.hud.open) || s.shopView || s.productView)) return true;
    var pops = document.querySelectorAll('.pop-in');
    for (var i = 0; i < pops.length; i++) { var r = pops[i].getBoundingClientRect(); if (r.width > 200 && r.height > 120) return true; }
    return false;
  }
  function tick() {
    try {
      mount();
      var b = busy();
      document.body.classList.toggle('fxu-busy', b);
      if (b && dock && dock.classList.contains('fxu-open')) setOpen(false);
    } catch (e) {}
  }
  setInterval(tick, 400);
  tick();
})();
