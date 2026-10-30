// 28.9 leisure: AI "what can I do for fun" answer lists real places and real Joyland fees; kill switch; no regressions.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server'), A = path.join(__dirname, '..', '..', 'app');
const code = ['shared/data/characters.mjs', 'ai27.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const { aiRoute, AI_CHARS } = new Function(code + '\nreturn { aiRoute, AI_CHARS };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const maya = AI_CHARS.find((c) => c.id === 'maya'); delete process.env.P28_OFF;
for (const q of ['what can I do for fun?', "I'm bored", 'any entertainment around?', 'things to do tonight?']) { const r = aiRoute(q, maya, { pos: { x: 0, z: 0 } }); ok(r.intent === 'leisure' && /Fyrus Joyland \(Fyrus Eye 30 FYC, Thunder Loop 50 FYC/.test(r.answer) && /Skyline Club/.test(r.answer) && /Lido Pool/.test(r.answer), 'leisure: ' + q); }
// the fees in the answer match the client ride table
const t5 = fs.readFileSync(path.join(A, 'src', 'client', 'app', '005.js'), 'utf8');
ok(/id: "wheel",\s*name: "Fyrus Eye \(giant wheel\)",\s*fee: 30/.test(t5) && /id: "coaster",\s*name: "Thunder Loop \(roller coaster\)",\s*fee: 50/.test(t5), 'Joyland fees in the answer match the ride table (30 / 50)');
ok(aiRoute('where is the club?', maya, { pos: { x: 0, z: 0 } }).intent === 'directions', 'directions unchanged');
ok(aiRoute('how do I get around?', maya, {}).intent === 'transport', 'transport unchanged');
process.env.P28_OFF = 'leisure'; ok(aiRoute('what can I do for fun?', maya, {}).intent !== 'leisure', 'kill switch P28_OFF=leisure'); delete process.env.P28_OFF;
const add = fs.readFileSync(path.join(A, 'fyrus-leisure28.js'), 'utf8');
ok(/Fyrus Eye 30 FYC/.test(add) && /Thunder Loop 50 FYC/.test(add) && /5 FYC \+ 4 per 100 m/.test(add), 'card text uses the real fees and taxi fare');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
