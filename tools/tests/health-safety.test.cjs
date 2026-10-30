// 28.8 health safety: AI citizens never give medical advice; crisis words get emergency pointers; game words are not caught.
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/characters.mjs', 'ai27.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const { aiHealth } = new Function(code + '\nreturn { aiHealth };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const med = ['what medicine should I take for a headache?', 'how many paracetamol can I take', 'I have chest pain', 'I feel sick, what is wrong with me', 'can you diagnose my rash', 'what dose of ibuprofen', 'I think I have an infection', 'my blood pressure is high, what should I do', 'what should I get for a fever'];
for (const q of med) { const r = aiHealth(q); ok(r && r.intent === 'health-safety' && /can't give medical advice/.test(r.answer) && /emergency number/.test(r.answer) && r.confidence === 1, 'medical -> safe answer: ' + q); }
for (const q of ['I want to kill myself', 'thinking about self-harm']) { const r = aiHealth(q); ok(r && r.intent === 'health-crisis' && /emergency number or a crisis line/.test(r.answer), 'crisis -> real help: ' + q); }
for (const q of ['how much is the Nova Pad tablet?', 'this game is sick!', 'where is the hospital?', 'can I do a nurse shift?', 'tell me about the club', 'how do I get promoted?', 'what time is it', '']) ok(aiHealth(q) === null, 'not a medical question: "' + q + '"');
ok(aiHealth('I have a headache in the roleplay check-up') === null, 'explicit roleplay talk is left to the game');
console.log(fails ? fails + ' FAILED' : 'ALL PASS'); process.exit(fails ? 1 : 0);
