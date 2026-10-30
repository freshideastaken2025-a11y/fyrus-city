// 30.8 security: client IP for all limits. x-forwarded-for is honoured only from a loopback peer (a local reverse proxy),
// and then only the right-most entry (the one the proxy appended); a direct public peer's header is ignored.
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', '..', 'app', 'src', 'server', 'index.2.mjs'), 'utf8');
const a = src.indexOf('var PROXY_HOPS'), b = src.indexOf('var server = http.createServer');
const mk = (hops) => { process.env.TRUST_PROXY_HOPS = hops || ''; return new Function(src.slice(a, b) + '\nreturn clientIp;')(); };
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const R = (peer, xff) => ({ socket: { remoteAddress: peer }, headers: xff === undefined ? {} : { 'x-forwarded-for': xff } });
let ip = mk();
ok(ip(R('198.51.100.4', '127.0.0.1')) === '198.51.100.4', 'direct public peer: header ignored (no fake loopback)');
ok(ip(R('198.51.100.4', '10.0.0.1, 10.0.0.2')) === '198.51.100.4', 'direct public peer: rotating header ignored');
ok(ip(R('127.0.0.1', '10.9.9.9, 203.0.113.9')) === '203.0.113.9', 'local proxy: right-most (proxy-appended) entry');
ok(ip(R('::ffff:127.0.0.1', '127.0.0.1, 203.0.113.9')) === '203.0.113.9', 'local proxy: spoofed 127.0.0.1 on the left is ignored');
ok(ip(R('127.0.0.1')) === '127.0.0.1', 'local client without header stays loopback (dev/bench exemption)');
ok(ip(R('127.0.0.1', ' , ')) === '127.0.0.1', 'empty header entries ignored');
ok(ip({ socket: {}, headers: {} }) === '', 'missing socket address does not throw');
ok(ip(R('172.18.0.3', '10.9.9.9, 203.0.113.9')) === '203.0.113.9', 'Docker proxy peer (172.18.x): right-most entry');
ok(ip(R('::ffff:10.0.1.5', '127.0.0.1, 198.51.100.2')) === '198.51.100.2', 'private proxy peer: spoofed loopback on the left ignored');
ok(ip(R('172.32.0.1', '1.2.3.4')) === '172.32.0.1', '172.32.x is public: header ignored');
ip = mk('2'); ok(ip(R('127.0.0.1', 'spoof, 198.51.100.1, 172.16.0.5')) === '198.51.100.1', 'TRUST_PROXY_HOPS=2: client entry before the CDN hop');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
