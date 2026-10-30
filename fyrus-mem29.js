/* FYRUS 29.4 mobile memory limits (client add-on).
   1. WebGL context loss (what a phone does when graphics memory runs out) was not handled: the city froze on a black
      canvas. Now the loss is caught (preventDefault, so the browser may restore it), the render loop is not left
      throwing, and a card explains it with "Reload in Lite" (a manual choice of the Phase Lite profile). If the browser
      restores the context, the page reloads itself in Lite (three.js scenes do not fully survive a restore).
   2. Memory budget watchdog (phones, or ?memtest=1): every 15 s it estimates GPU texture memory (unique textures in the
      scene) and JS heap, against a budget from navigator.deviceMemory (<=2 GB: 96 MB textures, <=4 GB: 192 MB, else
      384 MB; heap 70 % of the browser limit). Over budget on a profile above Lite -> one card offering Lite.
   Kill switch ?p29off=mem   Debug/stats: window.__fyrusMem29 */
(function () {
  var Q = new URLSearchParams(location.search);
  var OFF = /(^|,)(mem|all)(,|$)/.test(Q.get('p29off') || '');
  var phone = false; try { phone = ('ontouchstart' in window) && Math.min(screen.width, screen.height) < 820; } catch (e) {}
  var TEST = Q.get('memtest') === '1';
  var dm = navigator.deviceMemory || null;
  var S = (window.__fyrusMem29 = { off: OFF, phone: phone, deviceMemory: dm, budgetTexMB: TEST ? 1 : dm && dm <= 2 ? 96 : dm && dm <= 4 ? 192 : 384, texMB: null, heapMB: null, heapBudgetMB: null, checks: 0, over: 0, suggested: 0, lost: 0, restored: 0, hooked: false });
  if (OFF) return;
  var card = null;
  function el(tag, txt, css) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (css) e.style.cssText = css; return e; }
  function reloadLite() { var q = new URLSearchParams(location.search); q.set('quality', 'lite'); q.delete('memtest'); try { localStorage.setItem('fyrus.quality16', 'lite'); localStorage.setItem('fyrus.quality16.manual', '1'); } catch (e) {} location.search = q.toString(); }
  function show(kind, text) {
    if (card) card.remove();
    card = el('div', null, 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483200;width:min(340px,calc(100vw - 32px));padding:16px;border-radius:16px;background:rgba(10,14,24,.96);color:#fff;font:13px/1.45 system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5);text-align:center');
    card.setAttribute('role', 'alertdialog'); card.setAttribute('data-mem-card', kind);
    card.appendChild(el('div', kind === 'lost' ? 'Graphics memory ran out' : 'This phone is short on memory', 'font-weight:800;font-size:15px;margin-bottom:6px;color:#ffc27a'));
    card.appendChild(el('div', text, 'opacity:.85'));
    var row = el('div', null, 'display:flex;gap:8px;margin-top:12px');
    var a = el('button', 'Reload in Lite', 'flex:1;background:#45a86a;border:0;color:#fff;border-radius:10px;padding:10px;min-height:44px;font-weight:700;cursor:pointer'); a.setAttribute('data-mem-lite', ''); a.onclick = reloadLite; row.appendChild(a);
    if (kind !== 'lost') { var b = el('button', 'Not now', 'flex:1;background:rgba(255,255,255,.12);border:0;color:#fff;border-radius:10px;padding:10px;min-height:44px;cursor:pointer'); b.setAttribute('data-mem-later', ''); b.onclick = function () { card.remove(); card = null; }; row.appendChild(b); }
    card.appendChild(row); document.body.appendChild(card);
  }
  function hook(W) {
    var cv = W.renderer && W.renderer.domElement; if (!cv || S.hooked) return;
    S.hooked = true;
    cv.addEventListener('webglcontextlost', function (e) {
      e.preventDefault(); S.lost++;
      // stop the game's render calls from throwing on a dead context until the page reloads
      try { if (!W.renderer.__mem29) { var R = W.renderer.render; W.renderer.__mem29 = R; W.renderer.render = function () { if (S.lost > S.restored) return; return R.apply(this, arguments); }; } } catch (x) {}
      show('lost', 'Your phone took back the graphics memory. Your city progress is saved on the server. Reload in the lighter Lite profile to keep playing.');
    }, false);
    cv.addEventListener('webglcontextrestored', function () { S.restored++; setTimeout(reloadLite, 300); }, false);
  }
  function texMB(W) {
    var seen = new Set(), bytes = 0;
    W.world && W.world.traverse(function (o) { var ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (var i = 0; i < ms.length; i++) { var m = ms[i]; for (var k in m) { var t = m[k]; if (t && t.isTexture && !seen.has(t)) { seen.add(t); var im = t.image || {}; bytes += (im.width || 0) * (im.height || 0) * 4 * (t.generateMipmaps !== false ? 4 / 3 : 1); } } } });
    return Math.round(bytes / 1048576);
  }
  function check() {
    var W = window.__fyrusW; if (!W || !W.renderer) return;
    hook(W);
    if (!phone && !TEST) return;
    S.checks++;
    try { S.texMB = texMB(W); } catch (e) {}
    try { if (performance.memory) { S.heapMB = Math.round(performance.memory.usedJSHeapSize / 1048576); S.heapBudgetMB = Math.round(performance.memory.jsHeapSizeLimit * 0.7 / 1048576); } } catch (e) {}
    var q = window.__fyrusQuality && window.__fyrusQuality.name;
    var over = (S.texMB != null && S.texMB > S.budgetTexMB) || (S.heapMB != null && S.heapBudgetMB && S.heapMB > S.heapBudgetMB);
    if (over) S.over++;
    if (over && q !== 'lite' && !S.suggested && !card) { S.suggested++; show('budget', 'The city is using about ' + S.texMB + ' MB of textures' + (S.heapMB ? ' and ' + S.heapMB + ' MB of memory' : '') + '. The Lite profile uses less and runs smoother on this phone.'); }
  }
  setTimeout(function loop() { check(); setTimeout(loop, TEST ? 3000 : 15000); }, TEST ? 4000 : 20000);
  var iv = setInterval(function () { if (window.__fyrusW && window.__fyrusW.renderer) { hook(window.__fyrusW); clearInterval(iv); } }, 1000);
})();
