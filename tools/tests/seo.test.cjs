// SEO patch guard: real robots.txt + sitemap.xml, <title>/description/canonical/JSON-LD inside <head>,
// and the things players rely on (app fallback, /health, auth API, WebSocket) still work.
const { spawn } = require('child_process'), fs = require('fs'), os = require('os'), path = require('path');
const APP = path.join(__dirname, '..', '..', 'app');
const PORT = 18000 + Math.floor(Math.random() * 1000);
const data = fs.mkdtempSync(path.join(os.tmpdir(), 'fyrus-seo-'));
const srv = spawn(process.execPath, [path.join(APP, 'server.mjs')], { env: { ...process.env, PORT: String(PORT), DATA_DIR: data, PUBLIC_DIR: APP, AI_LLM: 'off', NODE_ENV: 'production' }, stdio: 'ignore' });
let failed = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) failed++; };
const base = `http://127.0.0.1:${PORT}`;
(async () => {
  for (let i = 0; i < 50; i++) { try { if ((await fetch(base + '/health')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 200)); }
  const robots = await fetch(base + '/robots.txt'); const rt = await robots.text();
  ok(robots.status === 200 && /text\/plain/.test(robots.headers.get('content-type')) && !/<html/i.test(rt), 'robots.txt is plain text, not the app page');
  ok(/Sitemap: https:\/\/fyrus\.io\/sitemap\.xml/.test(rt) && /Disallow: \/verify\//.test(rt) && /Disallow: \/api\//.test(rt) && /Allow: \//.test(rt), 'robots.txt allows the site, hides APIs and personal certificates, points to the sitemap');
  const sm = await fetch(base + '/sitemap.xml'); const st = await sm.text();
  ok(sm.status === 200 && /xml/.test(sm.headers.get('content-type')) && (st.match(/<loc>/g) || []).length === 3 && st.includes('<loc>https://fyrus.io/</loc>'), 'sitemap.xml is XML with the public pages');
  const home = await (await fetch(base + '/')).text(); const head = home.slice(0, home.indexOf('</head>'));
  ok((home.match(/<title>/g) || []).length === 1 && /<title>Fyrus City<\/title>/.test(head), '<title> is inside <head> exactly once');
  ok(/<meta name="description"/.test(head) && /<link rel="canonical" href="https:\/\/fyrus\.io\/">/.test(head), 'description and canonical are in <head>');
  const ld = JSON.parse(head.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]); ok(ld['@type'] === 'WebSite' && ld.url === 'https://fyrus.io/', 'WebSite JSON-LD is valid');
  ok(home.includes('/*__FYRUS_APP__*/') === false && home.length > 500000, 'full game bundle is still served on /');
  const deep = await fetch(base + '/some/in-game/route'); ok(deep.status === 200 && /<title>Fyrus City<\/title>/.test(await deep.text()), 'app fallback for in-game routes is unchanged');
  const h = await (await fetch(base + '/health')).json(); ok(h.ok === true, '/health still OK');
  const api = await fetch(base + '/api/auth/me'); ok(/json/.test(api.headers.get('content-type') || ''), 'auth API still answers JSON (not the app page)');
  const ws = await new Promise((resolve) => { const s = new WebSocket(`ws://127.0.0.1:${PORT}/ws`); const t = setTimeout(() => resolve(false), 5000);
    s.onopen = () => { clearTimeout(t); s.close(); resolve(true); }; s.onerror = () => { clearTimeout(t); resolve(false); }; });
  ok(ws, 'multiplayer WebSocket /ws still connects');
  const legal = await fetch(base + '/terms'); ok(legal.status === 200, '/terms still served');
})().catch((e) => { console.log('FAIL ' + e.message); failed++; }).finally(async () => { srv.kill(); await new Promise((r) => srv.once('exit', r)); try { fs.rmSync(data, { recursive: true, force: true }); } catch {} console.log(failed ? `seo: ${failed} failed` : 'seo: ALL PASS'); process.exit(failed ? 1 : 0); });
