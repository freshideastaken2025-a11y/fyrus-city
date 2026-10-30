/* FYRUS 27.2 NPC behavioural architecture: one registry over every non-player character, sorted into tiers.
 *   crowd   - walkers / pigeons / traffic (22.x): steering + schedules, no dialogue, no LLM, ever
 *   worker  - stall vendors / shop staff (22.5, 23.5): scripted reactions and fixed lines, no LLM
 *   named   - characters with a name + persona the player can "Talk to" (city NPCs, interior NPCs, bots): the
 *             dialogue engine (27.4) answers deterministically first; only this tier may ever reach the local LLM,
 *             through one shared queue with a budget (27.11 / 27.12). Never one model per NPC.
 * Every behaviour layer (perception -> schedule / needs -> state machine -> animation) stays where it already is;
 * this file only names the tiers, counts them and answers "may this character use the LLM?".
 * Kill switch ?p27off=npc. Stats / API: window.__fyrusNPC27 { census(), tierOf(def), llmEligible(def), stats } */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p27off') || '').split(',').some(function (k) { return k === 'npc' || k === 'all'; })) return;
  var MAX_NAMED_LLM = +(Q.get('llmnamed') || 24);   // hard cap on characters that may ever be LLM-backed
  var S = { censusMs: 0, last: null, llmAllowed: {} };
  function W() { return window.__fyrusW; }
  function named() {
    var w = W(), out = [];
    if (!w) return out;
    var add = function (def, where) { if (def && def.name) out.push({ id: def.id || def.name, name: def.name, persona: !!def.persona, where: where }); };
    try { (w.npcs && w.npcs.list || []).forEach(function (a) { add(a.def, 'city'); }); } catch (e) {}
    try { (w.innerNpcs && w.innerNpcs.list || []).forEach(function (a) { add(a.def, 'interior'); }); } catch (e) {}
    try { (w.bots || []).forEach(function (b) { add(b.def, 'bot'); }); } catch (e) {}
    return out;
  }
  function census() {
    var t0 = performance.now(), n = named();
    var peds = window.__fyrusPeds22 && window.__fyrusPeds22.stats || {}, shops = window.__fyrusShops22;
    var vendors = 0; try { vendors = shops && shops.vendors ? shops.vendors().length : 0; } catch (e) {}
    var c = { crowd: { walkers: peds.walkers || 0, pigeons: peds.pigeons || 0 }, worker: { vendors: vendors }, named: { total: n.length, withPersona: n.filter(function (x) { return x.persona; }).length, byWhere: n.reduce(function (m, x) { m[x.where] = (m[x.where] || 0) + 1; return m; }, {}) }, llmCap: MAX_NAMED_LLM, llmAllowedNow: Object.keys(S.llmAllowed).length };
    S.censusMs = Math.round((performance.now() - t0) * 100) / 100; S.last = c;
    return c;
  }
  function tierOf(def) { return def && def.name ? 'named' : 'crowd'; }
  // A character may reach the LLM only if it is named, has a persona, and the global cap of distinct LLM characters
  // is not exceeded (the first MAX_NAMED_LLM distinct characters that ask keep their slot for the session).
  function llmEligible(def) {
    if (!def || !def.name || !def.persona) return false;
    var id = def.id || def.name;
    if (S.llmAllowed[id]) return true;
    if (Object.keys(S.llmAllowed).length >= MAX_NAMED_LLM) return false;
    S.llmAllowed[id] = Date.now();
    return true;
  }
  window.__fyrusNPC27 = { version: '27.2', stats: S, census: census, tierOf: tierOf, llmEligible: llmEligible, named: named };
})();
