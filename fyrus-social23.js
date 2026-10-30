/* FYRUS 23.7 social emotes. Kill switch: ?p23off=social
 * The player's emotes (keys 1-4 / emote buttons: wave, dance, flip, hearts) become social when someone is in front:
 *   - the player turns toward the nearest person within 5 m in a 110-degree cone (NPC, walker or other player);
 *   - a named NPC turns to the player, answers with a short line in its speech bubble and emotes back (wave -> wave,
 *     dance -> dance, hearts -> wave + "thank you", flip -> wave + "whoa");
 *   - a 22.3 walker stops, faces the player and replies with a Phase 20 emote (Wave / Clap / Laugh / Cheer);
 *   - other players already see the emote (it is broadcast by the engine); the player just faces them.
 * NPC replies have an 8 s cooldown per NPC. Wraps W.doEmote on the game instance (no engine change).
 * Stats: window.__fyrusSocial23.stats. */
(function () {
  'use strict';
  var Q = new URLSearchParams(location.search);
  if ((Q.get('p23off') || '').split(',').some(function (k) { return k === 'social' || k === 'all'; })) return;
  var S = { emotes: 0, targeted: 0, npcReplies: 0, walkerReplies: 0, peerFaced: 0, errors: 0, last: null };
  var API = window.__fyrusSocial23 = { version: '23.7', stats: S };
  var LINES = {
    wave: ['Hey, hi!', 'Hello there!', 'Good to see you!'],
    dance: ['Nice moves!', 'Ha, look at you go!', 'Love the energy!'],
    hearts: ['Aww, thank you!', 'That is sweet of you!', 'Right back at you!'],
    flip: ['Whoa, impressive!', 'Careful there!', 'Ten out of ten!']
  };
  var NPC_EMOTE = { wave: 'wave', dance: 'dance', hearts: 'wave', flip: 'wave' };
  var PED_EMOTE = { wave: 'Wave', dance: 'Cheer', hearts: 'Clap', flip: 'Laugh' };
  var cool = new Map();
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function inCone(p, yaw, q, r) { var dx = q.x - p.x, dz = q.z - p.z, d = Math.hypot(dx, dz); if (d > r || d < 0.3) return -1; return (Math.sin(yaw) * dx + Math.cos(yaw) * dz) / d >= 0.35 ? d : -1; }
  function social(W, e) {
    var p = W.player.root.position, yaw = W.player.root.rotation.y, now = performance.now() / 1000, best = null, bd = 5.01;
    // named NPCs
    (W.npcs && W.npcs.list || []).forEach(function (n) { var d = inCone(p, yaw, n.av.root.position, 5); if (d >= 0 && d < bd) { bd = d; best = { kind: 'npc', n: n, pos: n.av.root.position }; } });
    // other players
    if (W.peers) W.peers.forEach(function (l) { if (!l.root) return; var d = inCone(p, yaw, l.root.position, 5); if (d >= 0 && d < bd) { bd = d; best = { kind: 'peer', pos: l.root.position }; } });
    if (best) {
      S.targeted++; W.player.root.rotation.y = Math.atan2(best.pos.x - p.x, best.pos.z - p.z);
      if (best.kind === 'npc') {
        var n = best.n, id = n.def.id || n.def.name;
        if ((cool.get(id) || 0) < now) {
          cool.set(id, now + 8);
          var av = n.av, t = W.clock ? W.clock.elapsedTime : now;
          av.target = null; if (av.vel) av.vel.set(0, 0, 0);
          av.root.rotation.y = Math.atan2(p.x - av.root.position.x, p.z - av.root.position.z);
          setTimeout(function () { try { if (av.doEmote) av.doEmote(NPC_EMOTE[e] || 'wave', t + 0.6); if (av.say) av.say(pick(LINES[e] || LINES.wave), (W.clock ? W.clock.elapsedTime : t + 0.6)); n.greeted = t; } catch (x) { S.errors++; } }, 600);
          S.npcReplies++; S.last = { kind: 'npc', name: n.def.name, emote: e };
        }
      } else { S.peerFaced++; S.last = { kind: 'peer', emote: e }; }
      return;
    }
    var P = window.__fyrusPeds22;
    if (P && P.respond && P.respond(p, yaw, PED_EMOTE[e] || 'Wave', 5)) { S.walkerReplies++; S.last = { kind: 'walker', emote: e }; }
  }
  (function hook() {
    var W = window.__fyrusW;
    if (!W || !W.doEmote || !W.player) { setTimeout(hook, 500); return; }
    if (W.__social23) return; W.__social23 = true;
    var orig = W.doEmote;
    W.doEmote = function (e) {
      // face the target before the engine plays and broadcasts the emote
      try { S.emotes++; if (this.active === this.world || this.active === this.home) social(this, e); } catch (x) { S.errors++; S.lastError = String(x && x.message || x); }
      return orig.apply(this, arguments);
    };
    S.hooked = true;
  })();
})();
