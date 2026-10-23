/* Fyrus Brain v1.0.0 — the AI residents' own knowledge. No API key, no server call: answers come from
   /brain/fyrus-brain.json (built by tools/brain/build.mjs from the city's facts) and run in the browser.
   Languages: English, Roman Urdu, Urdu, Hindi, Arabic (+ others through the browser's built-in translator when available).
   window.__fyrusBrain.reply(npc, text) -> Promise<string|null>; .ask(text, {lang}) -> {text, lang, intent, score} (sync, for tests). */
(function (root) {
  'use strict';
  var W = root;
  if (W.__fyrusBrain) return;
  var API = W.__fyrusBrain = { version: '1.0.0', ready: false };
  var KB = null, IDX = {}, loading = null;
  var LS = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* ---------------- text normalisation ---------------- */
  var RUR_MAP = {
    kia: 'kya', kiya: 'kya', kyaa: 'kya', hy: 'hai', he: 'hai', ha: 'hai', hain: 'hai', hen: 'hai', hn: 'hai',
    kese: 'kaise', kesy: 'kaise', kasy: 'kaise', kaisay: 'kaise', kaisy: 'kaise', kase: 'kaise', kesay: 'kaise', kasay: 'kaise', kaisey: 'kaise',
    main: 'mein', me: 'mein', mai: 'mein', mn: 'mein', men: 'mein', mujhay: 'mujhe', mujy: 'mujhe', mjhe: 'mujhe', muje: 'mujhe', mjy: 'mujhe',
    kr: 'kar', kro: 'karo', krna: 'karna', krun: 'karun', karoon: 'karun', kru: 'karun', krein: 'karein', karen: 'karein', kren: 'karein', kry: 'karein',
    nai: 'nahi', ni: 'nahi', nhi: 'nahi', nahin: 'nahi', nahe: 'nahi', yeh: 'ye', yh: 'ye', woh: 'wo', vo: 'wo', ap: 'aap', app: 'aap', tm: 'tum',
    btao: 'batao', bata: 'batao', btado: 'batao', bataen: 'batao', batayen: 'batao', btaen: 'batao', btain: 'batao', chaiye: 'chahiye', chahye: 'chahiye', chahie: 'chahiye', chye: 'chahiye',
    jaon: 'jaun', jaoon: 'jaun', jau: 'jaun', jaoun: 'jaun', kharidun: 'khareedun', khreedun: 'khareedun', kharidna: 'khareedna', ghr: 'ghar', pese: 'paise', paisy: 'paise', pesay: 'paise', paisay: 'paise',
    hun: 'hoon', hu: 'hoon', hon: 'hoon', rha: 'raha', rhe: 'rahe', gya: 'gaya', kahaan: 'kahan', kaha: 'kahan', kha: 'kahan', kahn: 'kahan', khan_: 'kahan', kidr: 'kidhar',
    shukria: 'shukriya', shukrya: 'shukriya', shukriyah: 'shukriya', slam: 'salam', salaam: 'salam', asalam: 'salam', assalam: 'salam', aslam: 'salam', walaikum: 'salam',
    acha: 'acha', achha: 'acha', accha: 'acha', thik: 'theek', theak: 'theek', thek: 'theek', kesa: 'kaisa', kaesa: 'kaisa', kitny: 'kitne', kitnay: 'kitne', kitna: 'kitne',
    chalo: 'chalo', chlo: 'chalo', le: 'le', ly: 'le', lay: 'le', jana: 'jana', jna: 'jana', hy_: 'hai', plz: 'please', pls: 'please', u: 'you', ur: 'your', r: 'are', wat: 'what', wht: 'what', whr: 'where', hw: 'how', thnx: 'thanks', thx: 'thanks', ty: 'thanks'
  };
  var RUR_HINT = /\b(kya|kia|hai|hy|kaise|kese|kesy|kasy|kahan|kidhar|mein|mujhe|mujhay|mera|meri|aap|ap|tum|hoon|hun|nahi|nai|nhi|karo|kro|batao|btao|chahiye|chalo|yaar|bhai|kyun|kyon|kab|kitne|kitna|acha|theek|thik|salam|shukriya|jana|jaun|khareed|ghar|paise|raha|rha|gaya|gya|le chalo|kar|kr|wala|wali|sakta|sakti|sakte)\b/;
  var UR_ONLY = /[ٹڈڑںےگکپچژھہۓ]/;
  function scriptOf(s) {
    if (/[؀-ۿ]/.test(s)) return UR_ONLY.test(s) ? 'ur' : 'ar';
    if (/[ऀ-ॿ]/.test(s)) return 'hi';
    if (/[a-z]/i.test(s)) return 'latin';
    return 'other';
  }
  function norm(s, lang) {
    s = String(s || '').toLowerCase();
    s = s.replace(/[ً-ٰٟ۪-ۭ]/g, '')
      .replace(/[يىیےۓ]/g, 'ی').replace(/[كک]/g, 'ک').replace(/[هہةھ]/g, 'ه').replace(/[أإآٱ]/g, 'ا')
      .replace(/[।॥]/g, ' ');
    s = s.replace(/[^\p{L}\p{N}\s+]/gu, ' ').replace(/\s+/g, ' ').trim();
    if (/[\u0600-\u06ff]/.test(s)) s = s.split(' ').map(function (w) { return w.length > 4 && w.indexOf('\u0627\u0644') === 0 ? w.slice(2) : w; }).join(' ');
    if (lang === 'rur' || lang === 'en') s = s.split(' ').map(function (w) { var m = RUR_MAP[w]; return m || w; }).join(' ');
    return s;
  }
  var STOP = { en: 1, the: 1, a: 1, an: 1, is: 1, are: 1, to: 1, of: 1, i: 1, me: 1, my: 1, do: 1, can: 1, please: 1, you: 1, it: 1, this: 1, in: 1, at: 1, there: 1, here: 1, hey: 1, hi: 0 };
  function grams(s) { var g = {}, t = ' ' + s + ' '; for (var i = 0; i < t.length - 2; i++) g[t.substr(i, 3)] = 1; return g; }
  function toks(s) { var o = {}; s.split(' ').forEach(function (w) { if (w && !STOP[w]) o[w] = 1; }); return o; }

  /* ---------------- index ---------------- */
  function buildIndex(lang) {
    var L = KB.q[lang] || [], docs = [], df = {}, gdf = {}, inv = {}, ginv = {};
    L.forEach(function (row, k) {
      var n = norm(row[1], lang), t = toks(n), g = grams(n);
      docs.push({ i: row[0], t: t, g: g, nt: Object.keys(t).length, ng: Object.keys(g).length });
      Object.keys(t).forEach(function (w) { df[w] = (df[w] || 0) + 1; (inv[w] = inv[w] || []).push(k); });
      Object.keys(g).forEach(function (w) { gdf[w] = (gdf[w] || 0) + 1; (ginv[w] = ginv[w] || []).push(k); });
    });
    var N = docs.length || 1, idf = {}, gidf = {};
    Object.keys(df).forEach(function (w) { idf[w] = Math.log(1 + N / df[w]); });
    Object.keys(gdf).forEach(function (w) { gidf[w] = Math.log(1 + N / gdf[w]); });
    docs.forEach(function (d) {
      var a = 0; for (var w in d.t) a += idf[w] * idf[w]; d.tn = Math.sqrt(a) || 1;
      var b = 0; for (var x in d.g) b += gidf[x] * gidf[x]; d.gn = Math.sqrt(b) || 1;
    });
    IDX[lang] = { docs: docs, idf: idf, gidf: gidf, inv: inv, ginv: ginv, N: N };
  }
  function search(text, lang) {
    if (!IDX[lang]) buildIndex(lang);
    var X = IDX[lang], n = norm(text, lang), t = toks(n), g = grams(n), cand = {}, w;
    var qt = 0, qg = 0;
    for (w in t) { var iv = X.idf[w] || Math.log(1 + X.N); qt += iv * iv; (X.inv[w] || []).forEach(function (k) { cand[k] = 1; }); }
    for (w in g) { var gv = X.gidf[w] || Math.log(1 + X.N); qg += gv * gv; }
    var gl = Object.keys(g);
    if (Object.keys(cand).length < 40) gl.forEach(function (x) { var L = X.ginv[x]; if (L && L.length < 400) L.forEach(function (k) { cand[k] = 1; }); });
    qt = Math.sqrt(qt) || 1; qg = Math.sqrt(qg) || 1;
    var best = {}, k;
    for (k in cand) {
      var d = X.docs[k], st = 0, sg = 0;
      for (w in t) if (d.t[w]) st += X.idf[w] * X.idf[w];
      for (var j = 0; j < gl.length; j++) if (d.g[gl[j]]) sg += X.gidf[gl[j]] * X.gidf[gl[j]];
      var s = 0.55 * (st / (qt * d.tn)) + 0.45 * (sg / (qg * d.gn));
      if (!best[d.i] || s > best[d.i]) best[d.i] = s;
    }
    var out = Object.keys(best).map(function (i) { return { i: +i, s: best[i] }; }).sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, 5);
  }
  function detect(text, pref) {
    var sc = scriptOf(text);
    if (sc === 'ur' || sc === 'ar' || sc === 'hi') return sc;
    if (sc === 'latin') {
      var low = ' ' + String(text).toLowerCase() + ' ';
      if (RUR_HINT.test(low)) return 'rur';
      if (pref === 'ur' || pref === 'rur' || pref === 'hi') {
        // a short Latin "hi"/"ok" from an Urdu speaker: keep Roman Urdu
        if (low.trim().split(/\s+/).length <= 2) return 'rur';
      }
      return 'en';
    }
    return 'other';
  }

  /* ---------------- answers ---------------- */
  function pick(a, k) { if (Array.isArray(a)) return a[(k == null ? Math.floor(Math.random() * a.length) : k) % a.length]; return a; }
  var fill = function (s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null && o[k] !== '' ? o[k] : (k === 'bio' ? '' : m); }).replace(/\s+([.,!?])/g, '$1').trim(); };
  function S() { try { return W.__fyrus.getState(); } catch (e) { return null; } }
  function live(kind, lang) {
    var s = S() || {}, w = KB.words, o = {};
    if (kind === 'where') {
      var nm = '';
      try { var P = W.__fyrusW.player.root.position; var r = W.__fyrusRegion && W.__fyrusRegion(P.x, P.z); nm = r && r.name; } catch (e) {}
      if (!nm) try { var b = document.querySelector('button[aria-label="Open map"]'); nm = b && b.innerText ? b.innerText.split('\n')[0] : ''; } catch (e) {}
      o.where = nm || w.unknownPlace[lang];
    }
    if (kind === 'online') o.online = (s.net && s.net.online) || 1;
    if (kind === 'balance') { var bal = s.bank && s.bank.bal; if (bal == null) { try { bal = s.wallets && s.wallets[s.session.userId]; } catch (e) {} } if (bal == null) return w.nobalance[lang]; o.balance = Math.round(bal).toLocaleString('en'); }
    if (kind === 'number') o.number = (s.net && s.net.me && s.net.me.number) || '+2040 …';
    if (kind === 'time') {
      var d = new Date(), hh = d.getHours();
      o.time = (hh < 10 ? '0' : '') + hh + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      o.next = '';
      try { var pr = W.__fyrusCountry.programme, nx = pr.filter(function (e) { return e.h > hh; })[0] || pr[0]; if (nx) o.next = fill(w.nextEvent[lang], { title: nx.title, h: nx.h }); } catch (e) {}
    }
    if (kind === 'weather') { var we = (s.settings && s.settings.weather) || 'clear'; o.weather = (w.weather[we] || w.weather.clear)[lang]; }
    return o;
  }
  function placeOf(id) {
    var p = KB.places[id]; if (!p) return null;
    try { var R = (W.__fyrusPlaces || []).filter(function (x) { return x.id === id; })[0]; if (R && isFinite(R.x)) return Object.assign({}, p, { x: R.x, z: R.z, run: R.run }); } catch (e) {}
    return p;
  }
  function go(id) {
    var p = placeOf(id); if (!p) return;
    setTimeout(function () {
      try {
        try { W.__fyrus.setState({ talk: null }); } catch (e) {}
        if (p.vb && W.__fyrusVB) return W.__fyrusVB.go();
        if (p.open === 'hall' && W.__fyrusHall) return W.__fyrusHall.open();
        if (p.open === 'home3d' && W.__fyrusHome3D) return W.__fyrusHome3D.open({ mode: 'catalogue' });
        if (typeof p.run === 'function') return p.run();
        if (W.__fyrusW && W.__fyrusW.teleport && !p.open) W.__fyrusW.teleport({ x: p.x, z: p.z });
        else W.__fyrus.setState({ waypoint: { x: p.x, z: p.z, name: p.n } });
      } catch (e) {}
    }, 1300);
  }
  var memo = { last: null }, idIdx = null;
  function intentIndex(id) { if (!idIdx) { idIdx = {}; KB.intents.forEach(function (it, i) { idIdx[it.id] = i; }); } return id in idIdx ? idIdx[id] : -1; }
  API.ask = function (text, opt) {
    opt = opt || {};
    if (!KB) return null;
    var pref = opt.pref || '', lang = opt.lang || detect(text, pref);
    if (lang === 'other') lang = 'en';
    var res = search(text, lang), top = res[0];
    // fall back: try the other Latin language
    if ((!top || top.s < 0.34) && (lang === 'en' || lang === 'rur')) {
      var alt = lang === 'en' ? 'rur' : 'en', r2 = search(text, alt);
      if (r2[0] && (!top || r2[0].s > top.s + 0.05)) top = r2[0];
    }
    // strong topic words lift their intent; "take me" answers need a "take me" word
    var nq = ' ' + norm(text, lang) + ' ', scores = {};
    res.forEach(function (r) { scores[r.i] = r.s; });
    if (top && !(top.i in scores)) scores[top.i] = top.s;
    if (!API._kw) { API._kw = []; Object.keys(KB.kw || {}).forEach(function (id) { var i = intentIndex(id); if (i < 0) return; KB.kw[id].forEach(function (k) { API._kw.push([i, ' ' + norm(k, 'rur') + ' ', ' ' + norm(k, 'ur') + ' ']); }); }); API._take = (KB.take || []).map(function (k) { return ' ' + norm(k, 'rur') + ' '; }).concat((KB.take || []).map(function (k) { return ' ' + norm(k, 'ur') + ' '; })); }
    var hits = {};
    API._kw.forEach(function (k) { if (nq.indexOf(k[1]) >= 0 || nq.indexOf(k[2]) >= 0) hits[k[0]] = (hits[k[0]] || 0) + 1; });
    Object.keys(hits).forEach(function (i) { scores[i] = Math.max(scores[i] || 0, 0.35) + 0.25 * Math.min(2, hits[i]); });
    var bi = null, bs = 0;
    Object.keys(scores).forEach(function (i) { if (scores[i] > bs) { bs = scores[i]; bi = +i; } });
    if (bi != null) top = { i: bi, s: bs };
    if (top && KB.intents[top.i].act === 'go' && !API._take.some(function (k) { return nq.indexOf(k) >= 0; })) { var wi = intentIndex('where:' + KB.intents[top.i].place); if (wi >= 0) top = { i: wi, s: top.s }; }
    var npc = opt.npc || {}, it = top && top.s >= 0.30 ? KB.intents[top.i] : null;
    var o = { name: npc.name || 'Maya', role: npc.role || 'guide', bio: npc.bio || KB.words.bioDefault[lang], user: opt.user || '', city: 'Fyrus' };
    var out;
    if (!it) { out = pick(KB.words.dunno[lang]); return { text: out, lang: lang, intent: null, score: top ? top.s : 0 }; }
    if (it.live) { var L = live(it.live, lang); out = typeof L === 'string' ? L : fill(pick(it.a[lang] || it.a.en), Object.assign(o, L)); }
    else if (it.act === 'go') {
      var p = KB.places[it.place];
      out = fill(pick(it.a[lang] || it.a.en), { place: p ? p.n : '' });
      if (p && p.adult) out = fill(KB.words.marked[lang], { place: p.n });
      if (!opt.dry) { if (p && p.adult) try { W.__fyrus.setState({ waypoint: { x: p.x, z: p.z, name: p.n } }); } catch (e) {} else go(it.place); }
    } else out = fill(pick(it.a[lang] || it.a.en), o);
    memo.last = it.id;
    return { text: out, lang: lang, intent: it.id, score: top.s };
  };

  /* other languages through Chrome's built-in, on-device translator (no key, no server) */
  var trCache = {};
  function translator(src, dst) {
    var k = src + '>' + dst;
    if (trCache[k]) return trCache[k];
    trCache[k] = (W.Translator && W.Translator.create ? W.Translator.create({ sourceLanguage: src, targetLanguage: dst }) : Promise.reject(new Error('no translator'))).catch(function (e) { delete trCache[k]; throw e; });
    return trCache[k];
  }
  function within(p, ms) { return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error('timeout')); }, ms); })]); }
  function foreignLang(text) {
    if (!W.LanguageDetector || !W.LanguageDetector.create) return Promise.resolve(null);
    return within(W.LanguageDetector.create().then(function (d) { return d.detect(text); }), 2500).then(function (r) {
      var b = r && r[0]; if (!b || b.confidence < 0.55) return null;
      var l = String(b.detectedLanguage || '').slice(0, 2);
      return /^(en|ur|hi|ar)$/.test(l) ? null : l;
    }).catch(function () { return null; });
  }

  function load() {
    if (KB) return Promise.resolve(KB);
    if (loading) return loading;
    loading = fetch('/brain/fyrus-brain.json?v=' + API.version).then(function (r) { return r.json(); }).then(function (j) { KB = j; API.ready = true; API.kb = j; return j; }).catch(function (e) { loading = null; throw e; });
    return loading;
  }
  API.load = load;
  API.reply = function (npc, text) {
    return load().then(function () {
      var s = S() || {}, me = null;
      try { me = (s.users || []).filter(function (u) { return u.id === (s.session && s.session.userId); })[0]; } catch (e) {}
      var uiLang = (s.settings && s.settings.lang) || (navigator.language || 'en').slice(0, 2);
      var opt = { npc: { name: npc && npc.name, role: npc && npc.role ? String(npc.role).toLowerCase() : '', bio: npc && npc.bio }, user: me && me.name && me.name !== 'Guest' ? me.name : '', pref: uiLang };
      var sc = scriptOf(text);
      var direct = function () { return API.ask(text, opt).text; };
      if (sc !== 'latin' && sc !== 'other') return direct();
      if (sc === 'latin' && detect(text, uiLang) === 'rur') return direct();
      return foreignLang(text).then(function (fl) {
        if (!fl && sc !== 'other') return direct();
        var src = fl || uiLang;
        if (!W.Translator) return direct();
        return within(translator(src, 'en').then(function (t) { return t.translate(text); }), 4000).then(function (en) {
          var a = API.ask(en, Object.assign({}, opt, { lang: 'en' })).text;
          return within(translator('en', src).then(function (t) { return t.translate(a); }), 4000).catch(function () { return a; });
        }).catch(direct);
      });
    }).catch(function () { return null; });
  };

  /* ---------------- AI residents start small conversations ---------------- */
  var lastSay = 0, said = {};
  function ambient() {
    try {
      if (!KB || document.hidden) return;
      var s = S(); if (!s || s.talk || s.hud && s.hud.open || s.activeGame || s.intro) return;
      var G = W.__fyrusW; if (!G || !G.player || !G.bots) return;
      var now = Date.now(); if (now - lastSay < 26000) return;
      var P = G.player.root.position, best = null, bd = 9;
      G.bots.forEach(function (b) { var q = b.root.position, d = Math.hypot(q.x - P.x, q.z - P.z); if (d < bd && (!said[b.def.id] || now - said[b.def.id] > 180000)) { bd = d; best = b; } });
      if (!best || typeof best.say !== 'function') return;
      var lang = (function () { var l = (s.settings && s.settings.lang) || (navigator.language || 'en').slice(0, 2); return l === 'ur' ? (LS.get('fyrus.brain.script') === 'ur' ? 'ur' : 'rur') : /^(hi|ar)$/.test(l) ? l : 'en'; })();
      var tips = KB.words.tips[lang] || KB.words.tips.en;
      best.say(tips[Math.floor(Math.random() * tips.length)], G.clock ? G.clock.elapsedTime : performance.now() / 1000);
      lastSay = now; said[best.def.id] = now;
    } catch (e) {}
  }
  if (W.document) {
    setTimeout(function () { load().then(function () { setInterval(ambient, 4000); }).catch(function () {}); }, 15000);
  }
})(typeof window !== 'undefined' ? window : globalThis);
