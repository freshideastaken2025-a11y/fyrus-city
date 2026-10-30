// 28.12 city rules: the rules screen and the chat/report enforcement use the same constants; numbers match the 24.10
// behaviour; AI answer; kill switch keeps enforcement unchanged.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/services.mjs', 'shared/data/characters.mjs', 'rules28.mjs', 'ai27.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const { RULES28, CITY_RULES, rules28Payload, aiRoute, AI_CHARS, createRules } = new Function(code + '\nreturn { RULES28, CITY_RULES, rules28Payload, aiRoute, AI_CHARS, createRules };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
delete process.env.P28_OFF;
ok(RULES28.FILTER_BLOCKS === 5 && RULES28.FILTER_WINDOW_MS === 6e5 && RULES28.FILTER_MUTE_MS === 9e5 && RULES28.REPORTS_TO_PAUSE === 3 && RULES28.REPORT_PAUSE_MS === 864e5 && RULES28.REPORTS_PER_DAY === 15, 'constants equal the 24.10 numbers (5 / 10 min / 15 min / 3 reports / 24 h / 15 a day)');
const idx = fs.readFileSync(path.join(S, 'index.2.mjs'), 'utf8');
ok(/now - x\.at < RULES28\.FILTER_WINDOW_MS/.test(idx) && /recent >= RULES28\.FILTER_BLOCKS/.test(idx) && /now \+ RULES28\.FILTER_MUTE_MS/.test(idx) && /by\.size >= RULES28\.REPORTS_TO_PAUSE/.test(idx) && /now \+ RULES28\.REPORT_PAUSE_MS/.test(idx) && /mine\.length >= RULES28\.REPORTS_PER_DAY/.test(idx), 'chat filter and reports enforce the shared constants');
ok(!/recent >= 5\b/.test(idx) && !/u\.muteUntil = now \+ 9e5/.test(idx), 'old literals are gone');
const p = rules28Payload();
ok(p.t === 'rules' && p.rules.length === 8 && p.rules.every((r, i) => r.n === i + 1 && r.title && r.text.length > 20), '8 numbered rules');
ok(/5 blocked messages within 10 minutes pause your chat for 15 minutes/.test(p.enforcement[0]) && /3 trusted citizens .* 24 hours/.test(p.enforcement[1]), 'enforcement text uses the numbers');
const terms = fs.readFileSync(path.join(S, 'legal.mjs'), 'utf8');
ok(/No harassment, hate, threats/.test(terms) && /No scams, fake listings/.test(terms) && /no real-world political parties/.test(terms) && /No cheating, bots/.test(terms) && /upload only content you own/.test(terms), 'every rule comes from the Terms of Use section 4');
const maya = AI_CHARS.find((c) => c.id === 'maya');
let r = aiRoute('what are the rules?', maya, {}); ok(r.intent === 'civic-rules' && /8\) Stay safe/.test(r.answer) && /pause it for 24 hours/.test(r.answer), 'AI rules answer');
r = aiRoute('why am I muted?', maya, {}); ok(r.intent === 'civic-rules', 'muted question -> rules');
r = aiRoute('what does the constitution say?', maya, {}); ok(r.intent === 'civic-law', '28.5 constitution answer unchanged');
const sent = []; const R = createRules({ send: (ws, m) => sent.push(m) });
R.onMessage({ ws: 1 }, { t: 'rules_get' }); ok(sent[0].t === 'rules', 'rules_get answers');
process.env.P28_OFF = 'rules'; R.onMessage({ ws: 1 }, { t: 'rules_get' }); ok(sent[1].t === 'err' && /\/terms/.test(sent[1].text), 'kill switch: screen off, points to /terms');
ok(aiRoute('what are the rules?', maya, {}).intent !== 'civic-rules', 'kill switch: AI falls back'); delete process.env.P28_OFF;
ok(R.onMessage({ ws: 1 }, { t: 'say' }) === false, 'other messages are not taken');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
