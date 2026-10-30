// 27.7 personalities: every core character has a fixed profile that shapes replies and the prompt deterministically
const fs = require('fs'), path = require('path');
const S = path.join(__dirname, '..', '..', 'app', 'src', 'server');
const code = ['shared/data/characters.mjs', 'personality27.mjs', 'ai27.mjs'].map((f) => fs.readFileSync(path.join(S, f), 'utf8')).join('\n');
const X = new Function(code + '\nreturn { AI_CHARS, AI_PERSONALITY, aiPersonaLines, aiWelcomeBack, aiFallback, aiMoodIndex };')();
let fails = 0; const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
ok(X.AI_CHARS.every((c) => X.AI_PERSONALITY[c.id] && X.AI_PERSONALITY[c.id].moods.length === 4), 'all 10 core characters have a personality with 4 moods');
const backs = new Set(X.AI_CHARS.map((c) => X.aiWelcomeBack(c.id, 'Amina'))); ok(backs.size === 10, '10 different welcome-backs, e.g. "' + X.aiWelcomeBack('hiro', 'Amina') + '"');
const catches = new Set(X.AI_CHARS.map((c) => X.aiFallback(c, 'x', { intent: 'open' }))); ok(catches.size === 10, 'fallbacks differ per character, e.g. "' + X.aiFallback(X.AI_CHARS[2], 'x', { intent: 'open' }) + '"');
ok([8, 13, 19, 23].map(X.aiMoodIndex).join() === '0,1,2,3', 'mood follows the hour (morning, day, evening, night)');
const m8 = X.aiPersonaLines('ravi', 8, 1), m23 = X.aiPersonaLines('ravi', 23, 7);
ok(/morning rush/.test(m8) && /sleepy/.test(m23), 'Ravi: "' + m8.match(/Current mood: [^.]+/)[0] + '" vs "' + m23.match(/Current mood: [^.]+/)[0] + '"');
ok(/new acquaintance/.test(m8) && /know them well/.test(m23), 'warmth grows with visits');
ok(X.aiPersonaLines('maya', 12, 1) === X.aiPersonaLines('maya', 12, 1), 'deterministic (same input, same prompt lines)');
ok(X.aiPersonaLines('x:noor', 12, 1) === '', 'procedural citizens get no fixed profile (their own short fields are used)');
process.exit(fails ? 1 : 0);
