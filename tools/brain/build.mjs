#!/usr/bin/env node
// Fyrus Brain build — turns places + intents into:
//   public/brain/fyrus-brain.json   (what the AI residents use in the browser; no API key needed)
//   <out>/fyrus-qa-10k.jsonl, -20k, -50k  (chat-format question/answer sets for local models: Ollama, LoRA, RAG)
//   <out>/fyrus-knowledge.md        (all facts as plain text, for a system prompt or retrieval)
// Usage: node tools/brain/build.mjs <publicDir> [datasetDir]
import fs from 'node:fs';
import path from 'node:path';
import { PLACES, DISTRICTS, PROVINCES } from './places.mjs';
import { HELP } from './intents-help.mjs';
import { TALK, WORDS, ENTITY } from './intents-talk.mjs';
import { KW, TAKE } from './keywords.mjs';
import { MORE, NPCS, NPC_TPL, GAME_INFO, GAME_TPL, GAME_ALIAS, HOME_INFO, HOME_TPL } from './intents-more.mjs';
import { ROLE_GROUP, TIPS, ROLE_INTENTS } from './roles.mjs';
import { LIFE, EVENTS, EVENT_TPL, EVENT_PLACE, CALC } from './intents-life.mjs';
import { paraphrases } from './paraphrase.mjs';
import zlib from 'node:zlib';

const LANGS = ['en', 'rur', 'ur', 'hi', 'ar'];
const pub = process.argv[2] || 'public';
const dsDir = process.argv[3] || '';
const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] !== undefined ? o[k] : m));
const arr = (x) => (Array.isArray(x) ? x : [x]);

/* ---------- intents ---------- */
const intents = [];
const qs = Object.fromEntries(LANGS.map((l) => [l, []]));
function add(it, questions) {
  const i = intents.length;
  intents.push(it);
  LANGS.forEach((l) => (questions[l] || []).forEach((q) => qs[l].push([i, q])));
  return i;
}
[...HELP, ...TALK, ...MORE, ...ROLE_INTENTS, ...LIFE].forEach((x) => add({ id: x.id, a: x.a, live: x.live || undefined }, x.q));

const names = (e) => [e.name, ...(e.alias || [])];
const scriptOf = (s) => (/[؀-ۿ]/.test(s) ? 'arab' : /[ऀ-ॿ]/.test(s) ? 'deva' : 'latn');
const okFor = (lang, n) => { const sc = scriptOf(n); return lang === 'ur' || lang === 'ar' ? sc !== 'deva' : lang === 'hi' ? sc !== 'arab' : sc === 'latn'; };
function entityQs(tpl, e) {
  const out = {};
  LANGS.forEach((l) => { out[l] = []; names(e).filter((n) => okFor(l, n)).forEach((n) => tpl[l].forEach((t) => out[l].push(fill(t, { x: n })))); });
  return out;
}
PLACES.forEach((p) => {
  const a = {}, w = {};
  LANGS.forEach((l) => { a[l] = fill(ENTITY.aWhere[l], { x: p.name, d: p.d[l] }); w[l] = fill(ENTITY.aWhat[l], { x: p.name, d: p.d[l] }); });
  add({ id: 'where:' + p.id, a, place: p.id }, entityQs(ENTITY.where, p));
  add({ id: 'what:' + p.id, a: w, place: p.id }, entityQs(ENTITY.what, p));
  add({ id: 'take:' + p.id, a: WORDS.going, act: 'go', place: p.id }, entityQs(ENTITY.take, p));
});
DISTRICTS.forEach((dd) => {
  const a = {};
  LANGS.forEach((l) => (a[l] = fill(ENTITY.aDistrict[l], { x: dd.name, d: dd.what[l] })));
  add({ id: 'where:' + dd.id, a, place: dd.id }, entityQs(ENTITY.where, dd));
  add({ id: 'take:' + dd.id, a: WORDS.going, act: 'go', place: dd.id }, entityQs(ENTITY.take, dd));
});
PROVINCES.forEach((pr) => {
  const a = {};
  LANGS.forEach((l) => (a[l] = fill(ENTITY.aProv[l], { x: pr.name, seat: pr.seat, house: pr.house, motto: pr.motto, d: pr.purpose[l] })));
  add({ id: 'prov:' + pr.id, a }, entityQs(ENTITY.provQ, { name: pr.name, alias: [pr.house, pr.seat] }));
});

const placeName = (id) => ([...PLACES, ...DISTRICTS].find((p) => p.id === id) || {}).name || id;
NPCS.forEach((n) => {
  const a = {};
  LANGS.forEach((l) => (a[l] = fill(NPC_TPL[l], { n: n.name, r: n.role[l], p: placeName(n.at) })));
  const q = {};
  LANGS.forEach((l) => (q[l] = []));
  const who = { en: ['who is {x}', 'where is {x}', 'where can i find {x}', 'tell me about {x}'], rur: ['{x} kaun hai', '{x} kahan hai', '{x} kahan milegi', '{x} ke bare mein batao'], ur: ['{x} کون ہے', '{x} کہاں ہے'], hi: ['{x} कौन है', '{x} कहाँ है'], ar: ['من هو {x}', 'أين {x}'] };
  const nm = { ur: { Maya: 'مایا', Zoe: 'زوئی', Ravi: 'روی', Marco: 'مارکو', Hiro: 'ہیرو', Kai: 'کائی', Aisha: 'عائشہ', Dana: 'دانا', 'DJ Lumen': 'ڈی جے لومن', Sam: 'سام' }, hi: { Maya: 'माया', Zoe: 'ज़ोई', Ravi: 'रवि', Marco: 'मार्को', Hiro: 'हीरो', Kai: 'काई', Aisha: 'आयशा', Dana: 'दाना', 'DJ Lumen': 'डीजे ल्यूमेन', Sam: 'सैम' }, ar: { Maya: 'مايا', Zoe: 'زوي', Ravi: 'رافي', Marco: 'ماركو', Hiro: 'هيرو', Kai: 'كاي', Aisha: 'عائشة', Dana: 'دانا', 'DJ Lumen': 'دي جي لومن', Sam: 'سام' } };
  LANGS.forEach((l) => { const names2 = [n.name, ...(nm[l] && nm[l][n.name] ? [nm[l][n.name]] : [])]; names2.forEach((x) => who[l].forEach((t) => q[l].push(fill(t, { x })))); });
  add({ id: 'npc:' + n.id, a, place: n.at }, q);
});
Object.entries(GAME_INFO).forEach(([g, d]) => {
  const a = {};
  LANGS.forEach((l) => (a[l] = fill(GAME_TPL.a[l], { x: g, d: d[l] })));
  add({ id: 'game:' + g, a, place: 'arcade-hall' }, entityQs(GAME_TPL.q, { name: g, alias: GAME_ALIAS[g] || [] }));
});
Object.entries(HOME_INFO).forEach(([h, [price, d]]) => {
  const a = {};
  LANGS.forEach((l) => (a[l] = fill(HOME_TPL.a[l], { x: h, d: d[l], p: price ? price.toLocaleString('en') : (l === 'en' ? 'free' : '0') })));
  add({ id: 'home:' + h, a, place: 'home-showroom' }, entityQs(HOME_TPL.q, { name: h }));
});
EVENTS.forEach((e) => {
  const a = {};
  ['en', 'rur', 'ur', 'hi'].forEach((l) => (a[l] = fill(EVENT_TPL.a[l], { x: e.title, h: e.h, at: e.at, d: e.d[l] })));
  add({ id: 'ev:' + e.k, a, place: EVENT_PLACE[e.k] }, entityQs({ ...EVENT_TPL.q, ar: [] }, { name: e.title, alias: e.alias }));
});
/* ---------- places table for "take me" ---------- */
const placeTable = Object.fromEntries([...PLACES, ...DISTRICTS].map((p) => [p.id, { n: p.name, x: p.x, z: p.z, vb: p.vb ? 1 : undefined, open: p.open, adult: p.adult ? 1 : undefined }]));

/* ---------- client bundle ---------- */
// dedupe questions per language
LANGS.forEach((l) => { const seen = new Set(); qs[l] = qs[l].filter(([i, q]) => { const k = i + '|' + q.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }); });
const bundle = { v: 1, built: new Date().toISOString().slice(0, 10), langs: LANGS, intents, q: qs, places: placeTable, words: WORDS, kw: KW, take: TAKE, roleGroup: ROLE_GROUP, tips: TIPS, calc: CALC };
fs.mkdirSync(path.join(pub, 'brain'), { recursive: true });
fs.writeFileSync(path.join(pub, 'brain', 'fyrus-brain.json'), JSON.stringify(bundle));
const baseCount = LANGS.reduce((s, l) => s + qs[l].length, 0);

/* ---------- variants (for the datasets and the stats) ---------- */
const PRE = {
  en: ['', 'hey, ', 'excuse me, ', 'please tell me ', 'can you tell me ', 'quick question: ', 'hi, ', 'sorry, ', 'do you know '],
  rur: ['', 'bhai ', 'yaar ', 'sunein ', 'ek baat batao ', 'please batao ', 'acha ', 'bhai jaan '],
  ur: ['', 'بھائی ', 'سنیں ', 'ایک بات بتائیں ', 'براہ کرم بتائیں '],
  hi: ['', 'भाई ', 'सुनिए ', 'एक बात बताओ ', 'कृपया बताइए '],
  ar: ['', 'لو سمحت ', 'من فضلك ', 'سؤال: ', 'يا أخي ']
};
const SUF = { en: ['', '?', ' please', ' pls', '??'], rur: ['', '?', ' plz', ' jaldi batao', ' na'], ur: ['', '؟', ' پلیز'], hi: ['', '?', ' प्लीज़'], ar: ['', '؟', ' من فضلك'] };
function typo(s, seed) {
  if (s.length < 6) return s;
  const i = 1 + (seed % (s.length - 2));
  return seed % 3 === 0 ? s.slice(0, i) + s.slice(i + 1) : seed % 3 === 1 ? s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2) : s.toLowerCase();
}
function variants(l, q, seed) {
  const out = new Set([q]);
  PRE[l].forEach((p, a) => SUF[l].forEach((x, b) => out.add((p + q + x).trim())));
  if (l === 'en' || l === 'rur') { out.add(typo(q, seed)); out.add(typo(q, seed + 1)); out.add(q.toUpperCase()); }
  return [...out];
}
let seed = 7;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
const all = [];
LANGS.forEach((l) => qs[l].forEach(([i, q], k) => variants(l, q, k).forEach((v) => all.push([l, i, v]))));
const stats = { intents: intents.length, baseQuestions: baseCount, perLanguage: Object.fromEntries(LANGS.map((l) => [l, qs[l].length])), withVariants: all.length };

/* ---------- datasets for local models ---------- */
if (dsDir) {
  fs.mkdirSync(dsDir, { recursive: true });
  const SYS = 'You are an AI resident of Fyrus, a free virtual country set in 2040 (fyrus.io). Answer in the same language as the visitor, in 1-3 short friendly sentences, using only facts about Fyrus. FYC is play money and cannot be cashed out. If you do not know, suggest "Where to?" or ✦ More → Help & feedback.';
  const persona = { name: 'Maya', role: 'city tour guide', bio: 'I know every corner of Fyrus.', user: 'friend', city: 'Fyrus Core' };
  const answerOf = (it, l, k) => {
    if (it.live) return null;
    let a = it.a[l] ?? it.a.en; a = arr(a); a = a[k % a.length];
    if (it.act === 'go') return fill(WORDS.marked[l], { place: placeTable[it.place].n });
    return fill(a, persona);
  };
  const rows = all.map(([l, i, q], k) => { const a = answerOf(intents[i], l, k); return a ? { l, i, q, a } : null; }).filter(Boolean);
  // shuffle deterministically, but keep every intent and language represented in the small sets
  rows.sort(() => rnd() - 0.5);
  const byKey = new Map();
  rows.forEach((r) => { const k = r.i + '|' + r.l; if (!byKey.has(k)) byKey.set(k, []); byKey.get(k).push(r); });
  function take(n) {
    const out = [], lists = [...byKey.values()].map((x) => x.slice());
    let round = 0;
    while (out.length < n) { let any = false; for (const L of lists) { if (L[round]) { out.push(L[round]); any = true; if (out.length >= n) break; } } if (!any) break; round++; }
    return out;
  }
  const sizes = [[10000, '10k'], [20000, '20k'], [50000, '50k']];
  sizes.forEach(([n, tag]) => {
    const set = take(n);
    fs.writeFileSync(path.join(dsDir, `fyrus-qa-${tag}.jsonl`), set.map((r) => JSON.stringify({ messages: [{ role: 'system', content: SYS }, { role: 'user', content: r.q }, { role: 'assistant', content: r.a }], lang: r.l, intent: intents[r.i].id })).join('\n') + '\n');
    stats['dataset_' + tag] = set.length;
  });
  // knowledge text
  const md = ['# Fyrus knowledge (for AI residents and local models)', '', `Built ${bundle.built}. Fyrus is a free virtual country set in 2040 (fyrus.io). FYC is play money only.`, '', '## Places'];
  PLACES.forEach((p) => md.push(`- **${p.name}** — ${p.d.en}`));
  md.push('', '## Districts'); DISTRICTS.forEach((d) => md.push(`- **${d.name}** — ${d.what.en}`));
  md.push('', '## Provinces'); PROVINCES.forEach((p) => md.push(`- **${p.name}** (seat ${p.seat}; ${p.house}, "${p.motto}") — ${p.purpose.en}`));
  md.push('', '## How-to and facts'); [...HELP, ...MORE.filter((h) => !h.live), ...ROLE_INTENTS.filter((h) => !h.live), ...LIFE].forEach((h) => md.push(`### ${h.q.en[0]}`, arr(h.a.en)[0], ''));
  md.push('', '## Daily programme'); EVENTS.forEach((e) => md.push(`- **${e.title}** — ${e.h}:00 local time at ${e.at}: ${e.d.en}`));
  md.push('', '## Residents you can meet'); NPCS.forEach((n) => md.push(`- **${n.name}** — ${n.role.en} (at ${placeName(n.at)})`));
  md.push('', '## Games (Arcade Hall)'); Object.entries(GAME_INFO).forEach(([g, d]) => md.push(`- **${g}** — ${d.en}`));
  md.push('', '## Homes (Luxury → Dream Life)'); Object.entries(HOME_INFO).forEach(([h, [p, d]]) => md.push(`- **${h}** — ${d.en}, ${p ? p.toLocaleString('en') + ' FYC' : 'free'}`));
  md.push('', '## Tips residents share, by kind of work'); Object.entries(TIPS).forEach(([g, t]) => md.push(`- **${g}**: ${t.en.join(' ')}`));
  fs.writeFileSync(path.join(dsDir, 'fyrus-knowledge.md'), md.join('\n'));
  fs.writeFileSync(path.join(dsDir, 'README.md'), [
    '# Fyrus Brain datasets', '',
    'Question/answer pairs about Fyrus in English, Roman Urdu, Urdu, Hindi and Arabic, generated from the same facts the AI residents on fyrus.io use.', '',
    '| File | Rows | Use it for |', '|---|---|---|',
    `| fyrus-qa-10k.jsonl | ${stats.dataset_10k} | small local models (3–4B), quick tests |`,
    `| fyrus-qa-20k.jsonl | ${stats.dataset_20k} | 7–9B models (qwen3.5 9b, gemma 12b) |`,
    `| fyrus-qa-50k.jsonl | ${stats.dataset_50k} | 20B+ models (qwen3.8 27b, gemma4 26b) or a LoRA fine-tune |`,
    '| fyrus-knowledge.md | — | paste into a system prompt or a retrieval index (works with any model, no training) |', '',
    'Each line: {"messages":[system,user,assistant],"lang","intent"} — the chat format used by most fine-tuning tools.',
    'The simplest way to make a local Ollama agent "know" Fyrus is to put fyrus-knowledge.md in its system prompt; fine-tuning is optional.',
    'Live questions (where am I, my balance, who is online) are answered in the browser and are not in these files.'
  ].join('\n') + '\n');
}
if (dsDir) {
  const BIG = ['en', 'rur', 'ur', 'hi'];
  const persona2 = { name: 'Maya', role: 'city tour guide', bio: '', user: '', city: 'Fyrus Core Plaza' };
  BIG.forEach((l) => {
    const seen = new Set(), lines = [];
    qs[l].forEach(([i, q], k) => {
      const it = intents[i];
      if (it.live && it.live !== 'roletip') return;
      let a;
      if (it.live === 'roletip') a = arr(TIPS.guide[l] || TIPS.guide.en)[k % 2];
      else if (it.act === 'go') a = fill(WORDS.marked[l] || WORDS.marked.en, { place: placeTable[it.place].n });
      else a = fill(arr(it.a[l] || it.a.en)[k % arr(it.a[l] || it.a.en).length], persona2);
      paraphrases(l, q, 60).forEach((v) => { const key = v.toLowerCase(); if (seen.has(key)) return; seen.add(key); lines.push(JSON.stringify({ q: v, a, topic: it.id })); });
    });
    fs.writeFileSync(path.join(dsDir, `fyrus-qa-${l}.jsonl.gz`), zlib.gzipSync(lines.join('\n') + '\n', { level: 9 }));
    stats['questions_' + l] = lines.length;
  });
}
fs.writeFileSync(path.join(pub, 'brain', 'stats.json'), JSON.stringify(stats, null, 1));
console.log(JSON.stringify(stats));
