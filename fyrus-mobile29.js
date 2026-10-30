/* FYRUS 29.1 Android baseline fixes (client add-on, phones only: touch + coarse pointer + short side < 820 px).
   From the 29.1 audit (docs/phase29/29.1-android-audit.md): bigger tap targets for tiny controls (checkboxes, range
   sliders, the Activities button), welcome/onboarding cards sized to the visible phone screen (dvh, so the last button is
   not hidden under the browser bar), and the local DEV avatar panel starts collapsed so it does not cover half the screen.
   No change on desktop. Kill switch ?p29off=mobile   Debug: window.__fyrusMobile29 { phone, applied, devCollapsed }
   30.9: phone layout fixes (Activities vs More dock, narrow-phone minimap, landscape stack); kill switch ?p30off=layout */
(function () {
  var OFF = /(^|,)(mobile|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '');
  var phone = false; try { phone = ('ontouchstart' in window) && matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820; } catch (e) {}
  var S = (window.__fyrusMobile29 = { off: OFF, phone: phone, applied: false, devCollapsed: false });
  if (OFF || !phone) return;
  var css = '' +
    'input[type=checkbox],input[type=radio]{min-width:22px;min-height:22px}' +
    'input[type=range]{min-height:32px}' +
    '[data-acts-button]{min-height:44px!important;padding:10px 16px!important}' +
    '.fxp-card{max-height:calc(100dvh - 24px)!important}' +
    '#fyrus-avatar-demo-panel button{min-height:32px}' +
    // 29.5 mobile HUD: the place cards (civic, campus, fun, what's on) open under the top bar instead of over the thumb-stick
    (/(^|,)(mobilehud|all)(,|$)/.test(new URLSearchParams(location.search).get('p29off') || '') ? '' :
    '[data-civic-card],[data-campus-card],[data-leisure-card],[data-events-card]{top:64px!important;bottom:auto!important;left:12px!important;width:calc(100vw - 24px)!important;max-height:calc(100dvh - 300px)!important;overflow:auto!important}');
  // 30.9 phone layout (kill switch ?p30off=layout): from the 30.9 device matrix
  //  - the Activities button sat under the "More" (fyrus extras) dock on every phone (both at bottom:150px on the right)
  //  - phones narrower than 400 px: the minimap card was under the search button of the top bar
  //  - landscape phones (short side): minimap + quest card ran into the thumb-stick, the chat row and the top bar
  //  - tablets (iPad Mini): top bar left the screen on the left, 33 px wide icons, thumb-stick over the chat row
  if (!/(^|,)(layout|all)(,|$)/.test(new URLSearchParams(location.search).get('p30off') || '')) css +=
    '[data-acts-button]{bottom:200px!important}' +
    '@media (max-width:400px){.fixed.z-20.left-3.top-3{top:60px!important}}' +
    '@media (max-height:500px){[data-touch-stick]{bottom:120px!important}[data-acts-button]{bottom:auto!important;top:64px!important}}' +
    // landscape phones: no room for the minimap card next to the wide top bar and above the thumb-stick; it is hidden
    // there (Map and Where to? stay in the top bar). Tablets / wide screens: the top bar wraps instead of leaving the
    // screen, its icons get 44 px tap targets, and the thumb-stick clears the chat row.
    '@media (max-height:500px){.fixed.z-20.left-3.top-3{display:none!important}}' +
    '@media (min-width:641px){[data-touch-stick]{bottom:124px!important}}' +
    '@media (min-width:641px) and (min-height:501px){.fixed.z-30.right-3.top-3{max-width:calc(100vw - 206px);flex-wrap:wrap;justify-content:flex-end;row-gap:6px}.fixed.z-30.right-3.top-3 button{min-width:44px;min-height:44px}}';
  var st = document.createElement('style'); st.id = 'fyrus-mobile29'; st.textContent = css; document.head.appendChild(st); S.applied = true;
  var tries = 0, iv = setInterval(function () {
    var p = document.getElementById('fyrus-avatar-demo-panel');
    if (p) { var b = p.querySelector('button'); if (b && b.textContent.trim() === '–') { b.click(); S.devCollapsed = true; } clearInterval(iv); }
    if (++tries > 60) clearInterval(iv);
  }, 1000);
})();
