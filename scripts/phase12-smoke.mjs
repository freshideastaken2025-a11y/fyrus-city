const base = process.env.FYRUS_BASE_URL || 'http://127.0.0.1:8792';
const paths = ['/', '/?go=vector-bay', '/fyrus-home3d.js', '/fyrus-perf.js'];
let failed = 0;
for (const path of paths) {
  const url = new URL(path, base);
  const response = await fetch(url);
  const text = await response.text();
  const ok = response.status === 200 && text.length > 100;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${response.status} ${url.pathname}${url.search} bytes=${text.length}`);
  if (!ok) failed++;
}
if (failed) process.exitCode = 1;
