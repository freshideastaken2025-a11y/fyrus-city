/* FYRUS 28.1 district integration (client add-on). When the player walks into a residential district, a short
   welcome banner shows the district sign and tagline (sign texts drafted by the local Ollama model, reviewed and
   shortened). Checks the position 4 times a second (rectangle test only; no rendering work). Kill switch ?p28off=district
   Debug: window.__fyrusDistrict28 { current, entered, off } */
(function () {
  var OFF = /(^|,)(district|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  var SIGN = { executive: 'Welcome home to Executive Enclave', marina: 'Welcome to Marina Bay', royal: 'Welcome to Royal Sky', starter: 'Welcome to Starter Commons: free studios for everyone' };
  var S = (window.__fyrusDistrict28 = { current: null, entered: 0, off: OFF, last: null });
  if (OFF) return;
  var list = null, box = null, hideT = 0;
  function banner(d) {
    if (!box) {
      box = document.createElement('div');
      box.setAttribute('role', 'status'); box.setAttribute('aria-live', 'polite'); box.setAttribute('data-district-banner', '');
      box.style.cssText = 'position:fixed;left:50%;top:14%;transform:translateX(-50%);z-index:60;pointer-events:none;padding:10px 18px;border-radius:14px;background:rgba(10,14,22,.72);color:#fff;font:600 15px/1.35 system-ui,sans-serif;text-align:center;max-width:min(92vw,520px);backdrop-filter:blur(6px);transition:opacity .4s;opacity:0';
      document.body.appendChild(box);
    }
    box.innerHTML = '';
    var a = document.createElement('div'); a.textContent = SIGN[d.id] || 'Welcome to ' + d.name; a.style.borderBottom = '2px solid ' + (d.color || '#4da3ff'); a.style.paddingBottom = '3px';
    var b = document.createElement('div'); b.textContent = d.tagline || ''; b.style.cssText = 'font-weight:400;font-size:12.5px;opacity:.85;margin-top:4px';
    box.appendChild(a); box.appendChild(b); box.style.opacity = '1';
    clearTimeout(hideT); hideT = setTimeout(function () { box.style.opacity = '0'; }, 4200);
  }
  function at(x, z) {
    for (var i = 0; i < list.length; i++) { var r = list[i].rect; if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return list[i]; }
    return null;
  }
  setInterval(function () {
    if (!list) { if (typeof window.__fyrusDistricts !== 'function') return; list = window.__fyrusDistricts(); }
    var w = window.__fyrusW, p = w && w.player && w.player.root && w.player.root.position;
    if (!p) return;
    var d = at(p.x, p.z), id = d ? d.id : null;
    if (id !== S.current) {
      if (d) { S.entered++; S.last = { id: id, at: Date.now() }; banner(d); }
      S.current = id;
    }
  }, 250);
})();
