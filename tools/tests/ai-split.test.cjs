// 27.3 deterministic vs LLM split: rules answer facts, the LLM only gets open conversation, fallback otherwise
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/characters.mjs', 'ai27.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const { AI_CHARS, AI_PLACES, aiRoute, aiDecide, aiFallback } = new Function(code + '\nreturn { AI_CHARS, AI_PLACES, aiRoute, aiDecide, aiFallback };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const maya = AI_CHARS.find((c) => c.id === 'maya');
ok(AI_CHARS.length === 10 && AI_CHARS.every((c) => c.persona.length > 100 && c.greeting), '10 core characters with persona and greeting on the server');
ok(AI_PLACES.length >= 14, AI_PLACES.length + ' places for directions');
const cases = [
  ['hi', 'greet', 'rules'], ['Assalam o alaikum', 'greet', 'rules'], ['bye!', 'bye', 'rules'],
  ['where is the pool?', 'directions', 'rules'], ['how do I get to the market', 'directions', 'rules'], ['take me to skyport', 'directions', 'rules'],
  ['where is the moon castle', 'directions-unknown', 'llm'], ['how can I earn money?', 'jobs', 'rules'], ['can I cash out FYC?', 'currency', 'rules'],
  ['who are you', 'identity', 'rules'], ['what do you think about rainy days?', 'open', 'llm'], ['tell me a story about your childhood', 'open', 'llm'],
];
for (const [t, intent, path] of cases) { const r = aiRoute(t, maya, { pos: { x: 0, z: 0 } }); const d = aiDecide(r, { llmEligible: true, llmUp: true }); ok(r.intent === intent && d === path, `"${t}" -> ${r.intent} / ${d}${r.answer ? ' : ' + r.answer.slice(0, 60) : ''}`); }
const pool = aiRoute('where is the pool', maya, { pos: { x: 0, z: 0 } }); ok(/north-west/.test(pool.answer), 'pool direction from the Core is north-west: ' + pool.answer.slice(0, 50));
ok(aiDecide(aiRoute('tell me a joke', maya), { llmEligible: false, llmUp: true }) === 'fallback', 'not LLM-eligible -> fallback');
ok(aiDecide(aiRoute('tell me a joke', maya), { llmEligible: true, llmUp: false }) === 'fallback', 'LLM down -> fallback');
ok(aiDecide(aiRoute('tell me a joke', maya), { llmEligible: true, llmUp: true, overloaded: true }) === 'fallback', 'queue overloaded -> fallback');
ok(/You could ask me/.test(aiFallback(maya, 'x', { intent: 'open' })), 'fallback stays in character with a suggested question');
const t0 = process.hrtime.bigint(); for (let i = 0; i < 10000; i++) aiRoute('where is the club tonight?', maya); const us = Number(process.hrtime.bigint() - t0) / 1e3 / 10000;
ok(us < 50, `routing cost ${us.toFixed(1)} us per message`);
process.exit(fails ? 1 : 0);
