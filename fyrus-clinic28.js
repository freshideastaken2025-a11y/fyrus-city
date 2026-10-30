/* FYRUS 28.8 healthcare roleplay (client add-on). At the Fyrus General Hospital the "Free check-up tips" card gets a
   "Start a roleplay check-up" button: reception -> nurse triage -> doctor, with fictional, game-world complaints and
   game-world "treatments" (rest in the gardens, a juice, sunscreen from the pharmacy). Clearly labelled roleplay, never
   medical advice; no money, no data stored. Kill switch ?p28off=clinic   Debug: window.__fyrusClinic28 { opened, step, done } */
(function () {
  var OFF = /(^|,)(clinic|all)(,|$)/.test(new URLSearchParams(location.search).get('p28off') || '');
  if (OFF) { window.__fyrusClinic28 = { off: true }; return; }
  var S = (window.__fyrusClinic28 = { off: false, opened: 0, step: null, done: 0, open: open });
  var NOTE = 'Roleplay only — not medical advice. For a real health problem see a doctor or pharmacist; in an emergency call your local emergency number.';
  var CASES = [
    { id: 'wheel', q: 'Dizzy after three turns on the Fyrus Eye', vit: 'Balance 3/5 · Smile 5/5', rx: 'Sit on a bench in Supertree Gardens until the city stops spinning, then try the wheel again tomorrow.' },
    { id: 'sun', q: 'Sunburnt avatar after a day at Sea View Coast', vit: 'Avatar glow: lobster · Mood 4/5', rx: 'Pick up the Sunscreen at Fyrus Pharmacy and pick a cloudy sky from the weather button next time.' },
    { id: 'club', q: 'Tired after a long night at Skyline Club', vit: 'Energy 2/5 · Dance moves 5/5', rx: 'A mango juice at the Fresh Juice Bar and a quiet hour in the Public Library.' },
    { id: 'ankle', q: 'Twisted ankle on the Joyland dance floor (in the game)', vit: 'Ankle: wobbly · Courage 5/5', rx: 'Take the Sky Bus instead of running for a day — 3 FYC flat fare in the capital.' }
  ];
  var box = null;
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function btn(txt, key, fn, alt) { var b = el('button', txt, 'display:block;width:100%;text-align:left;margin-top:6px;background:' + (alt ? 'rgba(255,255,255,.1)' : '#e5484d') + ';border:0;color:#fff;border-radius:9px;padding:8px 10px;cursor:pointer;min-height:36px;font:600 12.5px system-ui,sans-serif'); b.setAttribute('data-clinic', key); b.onclick = fn; return b; }
  function close() { if (box) { box.remove(); box = null; } S.step = null; }
  function frame(title) {
    if (box) box.remove();
    box = el('div', null, 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:80;width:min(360px,calc(100vw - 32px));padding:14px 16px;border-radius:16px;background:rgba(12,16,26,.95);color:#fff;font:13px/1.45 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.45)');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', 'Roleplay check-up'); box.setAttribute('data-clinic-card', '');
    var h = el('div', null, 'display:flex;align-items:center;gap:8px;margin-bottom:4px');
    h.appendChild(el('div', title, 'flex:1;font-weight:700;color:#ff8a8f'));
    var x = el('button', '×', 'background:none;border:0;color:#fff;font-size:18px;cursor:pointer;min-width:32px;min-height:32px'); x.setAttribute('aria-label', 'Close'); x.onclick = close; h.appendChild(x);
    box.appendChild(h); box.appendChild(el('div', NOTE, 'font-size:11px;opacity:.7;margin-bottom:8px'));
    document.body.appendChild(box); return box;
  }
  function open() {
    S.opened++; S.step = 'reception';
    var b = frame('Fyrus General Hospital · reception (roleplay)');
    b.appendChild(el('div', 'Welcome! What brings your avatar in today?'));
    CASES.forEach(function (c) { b.appendChild(btn(c.q, 'case-' + c.id, function () { triage(c); }, true)); });
  }
  function triage(c) {
    S.step = 'triage'; S.case = c.id;
    var b = frame('Nurse station · game check');
    b.appendChild(el('div', 'The nurse checks your avatar’s game stats:'));
    b.appendChild(el('div', c.vit, 'margin:6px 0;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.08);font-weight:600'));
    b.appendChild(btn('See the doctor', 'doctor', function () { doctor(c); }));
  }
  function doctor(c) {
    S.step = 'doctor';
    var b = frame('Doctor’s room · game advice');
    b.appendChild(el('div', '“' + c.rx + '”', 'margin:4px 0 6px'));
    b.appendChild(btn('Thanks, doctor! (finish)', 'finish', function () { S.done++; close(); }));
  }
})();
