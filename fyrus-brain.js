/* Fyrus Brain v1.0.0 — the AI residents' own knowledge. No API key, no server call: answers come from
   /brain/fyrus-brain.json (built by tools/brain/build.mjs from the city's facts) and run in the browser.
   Languages: English, Roman Urdu, Urdu, Hindi, Arabic (+ others through the browser's built-in translator when available).
   window.__fyrusBrain.reply(npc, text) -> Promise<string|null>; .ask(text, {lang}) -> {text, lang, intent, score} (sync, for tests). */
(function (root) {
  'use strict';
  var W = root;
  if (W.__fyrusBrain) return;
  var API = W.__fyrusBrain = { version: '1.5.1', ready: false };
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
  var RUR_HINT = /\b(kya|kia|hai|hy|kaise|kese|kesy|kasy|kahan|kidhar|mein|mujhe|mujhay|mera|meri|aap|ap|tum|hoon|hun|nahi|nai|nhi|karo|kro|batao|btao|chahiye|chalo|yaar|bhai|kyun|kyon|kab|kitne|kitna|acha|theek|thik|salam|shukriya|jana|jaun|khareed|ghar|paise|raha|rha|gaya|gya|le chalo|kar|kr|wala|wali|sakta|sakti|sakte|koi|kuch|kaun|kon|sikhao|mashwara|karna|karni|bolo|dikhao|milega|milegi|chahte|hota|hoti|bata|btao|pata|abhi|aaj|kal)\b/;
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
  var STOP = { and: 1, the: 1, a: 1, an: 1, is: 1, are: 1, to: 1, of: 1, i: 1, me: 1, my: 1, do: 1, can: 1, please: 1, you: 1, it: 1, this: 1, in: 1, at: 1, there: 1, here: 1, hey: 1, hi: 0 };
  function grams(s) { var g = {}, t = ' ' + s + ' '; for (var i = 0; i < t.length - 2; i++) g[t.substr(i, 3)] = 1; return g; }
  function toks(s) { var o = {}; s.split(' ').forEach(function (w) { if (!w || STOP[w]) return; o[w] = 1; if (/^[a-z]{4,}s$/.test(w) && !/ss$/.test(w)) o[w.slice(0, -1)] = 1; }); return o; }

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
  var fill = function (s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : (k === 'bio' ? '' : m); }).replace(/\s+([.,!?])/g, '$1').trim(); };
  function S() { try { return W.__fyrus.getState(); } catch (e) { return null; } }
  function live(kind, lang, npc) {
    var s = S() || {}, w = KB.words, o = {};
    if (kind === 'roletip') {
      var g = (KB.roleGroup || {})[String((npc && npc.role) || '').toLowerCase()] || 'guide';
      var T = (KB.tips[g] || KB.tips.guide); var arr = T[lang] || T.en;
      o.tip = arr[Math.floor(Math.random() * arr.length)];
      return o;
    }
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
  API.kbv = '3.0.0';
  /* live maths and unit conversion (exact answers, no list needed) */
  function evalMath(src) {
    var t = src.replace(/\s+/g, '').replace(/[x×]/g, '*').replace(/÷/g, '/').replace(/,/g, '');
    if (!/^[\d.+\-*/()^%]+$/.test(t) || !/\d/.test(t) || !/[+\-*/^%]/.test(t.replace(/^-/, ''))) return null;
    var i = 0;
    function num() { var m = /^\d+(\.\d+)?/.exec(t.slice(i)); if (!m) throw 0; i += m[0].length; return parseFloat(m[0]); }
    function atom() { if (t[i] === '-') { i++; return -atom(); } if (t[i] === '(') { i++; var v = add(); if (t[i] !== ')') throw 0; i++; return v; } var n = num(); if (t[i] === '%') { i++; n = n / 100; } return n; }
    function pow() { var b = atom(); if (t[i] === '^') { i++; return Math.pow(b, pow()); } return b; }
    function mul() { var v = pow(); while (t[i] === '*' || t[i] === '/') { var o = t[i++], r = pow(); v = o === '*' ? v * r : v / r; } return v; }
    function add() { var v = mul(); while (t[i] === '+' || t[i] === '-') { var o = t[i++], r = mul(); v = o === '+' ? v + r : v - r; } return v; }
    try { var v = add(); if (i !== t.length || !isFinite(v)) return null; return Math.round(v * 1e6) / 1e6; } catch (e) { return null; }
  }
  var UNITS = { km: ['km', 1000, 'm'], kilometer: ['km', 1000, 'm'], kilometers: ['km', 1000, 'm'], mile: ['mi', 1609.344, 'm'], miles: ['mi', 1609.344, 'm'], mi: ['mi', 1609.344, 'm'], m: ['m', 1, 'm'], meter: ['m', 1, 'm'], meters: ['m', 1, 'm'], metre: ['m', 1, 'm'], ft: ['ft', 0.3048, 'm'], feet: ['ft', 0.3048, 'm'], foot: ['ft', 0.3048, 'm'], cm: ['cm', 0.01, 'm'], inch: ['in', 0.0254, 'm'], inches: ['in', 0.0254, 'm'], in: ['in', 0.0254, 'm'],
    kg: ['kg', 1, 'kg'], kilo: ['kg', 1, 'kg'], kilogram: ['kg', 1, 'kg'], lb: ['lb', 0.45359237, 'kg'], lbs: ['lb', 0.45359237, 'kg'], pound: ['lb', 0.45359237, 'kg'], pounds: ['lb', 0.45359237, 'kg'], g: ['g', 0.001, 'kg'], gram: ['g', 0.001, 'kg'],
    l: ['L', 1, 'l'], liter: ['L', 1, 'l'], litre: ['L', 1, 'l'], liters: ['L', 1, 'l'], gallon: ['gal', 3.785411784, 'l'], gallons: ['gal', 3.785411784, 'l'], c: ['°C', 0, 't'], celsius: ['°C', 0, 't'], f: ['°F', 0, 't'], fahrenheit: ['°F', 0, 't'] };
  var DEFAULT_TO = { km: 'mile', mi: 'km', m: 'feet', ft: 'm', cm: 'inch', in: 'cm', kg: 'pound', lb: 'kg', g: 'pound', L: 'gallon', gal: 'liter', '°C': 'fahrenheit', '°F': 'celsius' };
  function convert(text) {
    var m = /(-?\d+(?:\.\d+)?)\s*([a-z°]+)\b(?:.*?\b(?:to|in|into|mein|me|ko|में|میں)\s+([a-z°]+))?/i.exec(String(text).toLowerCase().replace('°', ''));
    if (!m) return null;
    var a = UNITS[m[2]]; if (!a) return null;
    var bKey = m[3] && UNITS[m[3]] ? m[3] : DEFAULT_TO[a[0]]; var b = UNITS[bKey]; if (!b || b[2] !== a[2] || b[0] === a[0]) return null;
    var v = +m[1], out;
    if (a[2] === 't') out = a[0] === '°C' ? v * 9 / 5 + 32 : (v - 32) * 5 / 9;
    else out = v * a[1] / b[1];
    out = Math.round(out * 100) / 100;
    return [v + ' ' + a[0], out + ' ' + b[0]];
  }
  function liveCalc(text, lang) {
    if (!KB.calc) return null;
    var c = /\d/.test(text) && /\b(km|kilomet|mile|mi|meter|metre|feet|foot|ft|cm|inch|kg|kilo|pound|lb|gram|liter|litre|gallon|celsius|fahrenheit)\w*\b|\d\s*[cf]\b|°/i.test(text) ? convert(text) : null;
    if (c) return fill(KB.calc.conv[lang] || KB.calc.conv.en, { a: c[0], b: c[1] });
    var e = String(text).toLowerCase().replace(/\b(times|into|multiplied by|guna|zarb)\b/g, '*').replace(/\b(plus|jama|aur)\b/g, '+').replace(/\b(minus|nafi)\b/g, '-').replace(/\b(divided by|over|taqseem)\b/g, '/').replace(/what is|what's|calculate|how much is|solve|kitna hai|kitne hain|kya hai|kitna|batao|کتنا ہے|کتنے ہیں|कितना है|कितने हैं|=|\?|؟/g, ' ').trim();
    var v = evalMath(e);
    if (v === null) return null;
    return fill(KB.calc.result[lang] || KB.calc.result.en, { expr: e.replace(/\s+/g, ' '), val: v.toLocaleString('en', { maximumFractionDigits: 6 }) });
  }
  var memo = { last: null }, idIdx = null;
  function intentIndex(id) { if (!idIdx) { idIdx = {}; KB.intents.forEach(function (it, i) { idIdx[it.id] = i; }); } return id in idIdx ? idIdx[id] : -1; }
  API.ask = function (text, opt) {
    opt = opt || {};
    if (!KB) return null;
    var pref = opt.pref || '', lang = opt.lang || detect(text, pref);
    if (lang === 'other') lang = 'en';
    var fixed = KB.fix && KB.fix[qKey(text)];
    var lc = liveCalc(text, lang === 'ar' ? 'en' : lang);
    if (lc) return { text: lc, lang: lang, intent: 'calc', score: 1, hints: [] };
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
    if (fixed && intentIndex(fixed) >= 0) scores[intentIndex(fixed)] = 2;
    Object.keys(scores).forEach(function (i) { if (KB.intents[i] && KB.intents[i].custom && scores[i] >= 0.5) scores[i] += 0.15; });
    var bi = null, bs = 0;
    Object.keys(scores).forEach(function (i) { if (scores[i] > bs) { bs = scores[i]; bi = +i; } });
    if (bi != null) top = { i: bi, s: bs };
    if (top && KB.intents[top.i].act === 'go' && !API._take.some(function (k) { return nq.indexOf(k) >= 0; })) { var wi = intentIndex('where:' + KB.intents[top.i].place); if (wi >= 0) top = { i: wi, s: top.s }; }
    var ranked = Object.keys(scores).map(function (i) { return [+i, scores[i]]; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 3);
    var hints = ranked.filter(function (x) { var t = KB.intents[x[0]]; return x[1] > 0.2 && !t.live && t.act !== 'go'; }).map(function (x) { return fill(pick(KB.intents[x[0]].a.en, 0), { name: 'I', role: 'resident', bio: '', user: '' }); });
    var npc = opt.npc || {}, it = top && top.s >= 0.36 ? KB.intents[top.i] : null;
    var o = { name: npc.name || 'Maya', role: npc.role || 'guide', bio: npc.bio || KB.words.bioDefault[lang], user: opt.user || '', city: npc.city || 'Fyrus Core Plaza' };
    var out;
    if (!it) { out = pick(KB.words.dunno[lang]); return { text: out, lang: lang, intent: null, score: top ? top.s : 0, hints: hints }; }
    if (it.live === 'there_go' && memo.lastPlace && KB.places[memo.lastPlace]) {
      var pp = KB.places[memo.lastPlace];
      out = fill(pick(KB.words.going[lang] || KB.words.going.en), { place: pp.n });
      if (pp.adult) out = fill(KB.words.marked[lang], { place: pp.n });
      if (!opt.dry) { if (pp.adult) try { W.__fyrus.setState({ waypoint: { x: pp.x, z: pp.z, name: pp.n } }); } catch (e) {} else go(memo.lastPlace); }
    } else if (it.live) { var L = live(it.live, lang, npc); out = typeof L === 'string' ? L : fill(pick(it.a[lang] || it.a.en), Object.assign(o, L)); }
    else if (it.act === 'go') {
      var p = KB.places[it.place];
      out = fill(pick(it.a[lang] || it.a.en), { place: p ? p.n : '' });
      if (p && p.adult) out = fill(KB.words.marked[lang], { place: p.n });
      if (!opt.dry) { if (p && p.adult) try { W.__fyrus.setState({ waypoint: { x: p.x, z: p.z, name: p.n } }); } catch (e) {} else go(it.place); }
    } else {
      var A = it.a[lang] || (lang === 'rur' && it.a.ur) || (lang === 'ur' && it.a.rur) || (lang === 'hi' && (it.a.rur || it.a.ur)) || it.a.en;
      if (!A) { var ks = Object.keys(it.a); A = it.a[ks[0]]; }
      out = fill(pick(A), o);
    }
    memo.last = it.id;
    if (it.place && KB.places[it.place]) memo.lastPlace = it.place;
    return { text: out, lang: lang, intent: it.id, score: top.s, hints: hints, live: !!it.live, act: it.act || '' };
  };

  /* other languages through Chrome's built-in, on-device translator (no key, no server) */
  var HIST = {}, aiState = null, aiAt = 0, aiWait = 12000;
  function aiOn() {
    if (!LS.get('fyrus.net.token')) return Promise.resolve(false);
    if (aiState !== null && Date.now() - aiAt < 6e5) return Promise.resolve(aiState);
    return fetch('/api/ai/status').then(function (r) { return r.json(); }).then(function (j) { aiState = !!j.on; aiWait = Math.min(45000, (+j.wait || 10000) + 2000); aiAt = Date.now(); return aiState; }).catch(function () { return false; });
  }
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
    loading = fetch('/brain/fyrus-brain.json?v=' + API.kbv).then(function (r) { return r.json(); }).then(function (j) { KB = j; KB.base = KB.intents.length; API.ready = true; API.kb = j; return loadCustom().then(function () { return j; }); }).catch(function (e) { loading = null; throw e; });
    return loading;
  }
  API.load = load;
  /* answers written by the team in Admin desk > Brain (live, no deploy) */
  var customV = '';
  function loadCustom() {
    return fetch('/api/brain/custom').then(function (r) { return r.json(); }).then(function (c) {
      if (!c || c.v === customV) return;
      customV = c.v;
      KB.intents.length = KB.base;
      KB.langs.forEach(function (l) { KB.q[l] = (KB.q[l] || []).filter(function (row) { return row[0] < KB.base; }); });
      (c.custom || []).forEach(function (cu) {
        var i = KB.intents.length;
        KB.intents.push({ id: 'custom:' + cu.id, a: cu.a, custom: 1 });
        (cu.q || []).forEach(function (q) {
          var l = detect(q, ''); if (l === 'other' || !KB.q[l]) l = 'en';
          KB.q[l].push([i, q]);
          if (l === 'rur') KB.q.en.push([i, q]); else if (l === 'en') KB.q.rur.push([i, q]);
        });
      });
      KB.fix = c.fix || {};
      IDX = {}; idIdx = null;
    }).catch(function () {});
  }
  setInterval(function () { if (KB) loadCustom(); }, 10 * 60000);
  var qKey = function (s) { return String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 200); };
  function logQ(text, r, npc) {
    try { fetch('/api/brain/log', { method: 'POST', keepalive: true, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q: String(text).slice(0, 300), lang: r && r.lang, intent: r && r.intent, score: r && r.score, npc: npc && npc.role }) }).catch(function () {}); } catch (e) {}
  }
  API.reply = function (npc, text) {
    return load().then(function () {
      var s = S() || {}, me = null;
      try { me = (s.users || []).filter(function (u) { return u.id === (s.session && s.session.userId); })[0]; } catch (e) {}
      var uiLang = (s.settings && s.settings.lang) || (navigator.language || 'en').slice(0, 2);
      var opt = { npc: { name: npc && npc.name, role: npc && npc.role ? String(npc.role).toLowerCase() : '', bio: npc && npc.bio }, user: me && me.name && me.name !== 'Guest' ? me.name : '', pref: uiLang };
      var sc = scriptOf(text);
      var npcKey = (npc && (npc.id || npc.name)) || 'npc';
      var hist = HIST[npcKey] = HIST[npcKey] || [];
      var remember = function (a) { hist.push({ role: 'user', content: text }, { role: 'assistant', content: a }); if (hist.length > 12) hist.splice(0, hist.length - 12); return a; };
      var direct = function () {
        var r = API.ask(text, opt);
        logQ(text, r, opt.npc);
        var unsure = !r.intent || r.score < 0.45 || (hist.length >= 4 && r.score < 0.6 && !r.live && !r.act);
        if (!unsure) return remember(r.text);
        return aiOn().then(function (on) {
          if (!on) return remember(r.text);
          return within(fetch('/api/ai/talk', { method: 'POST', headers: { 'content-type': 'application/json', authorization: 'Bearer ' + (LS.get('fyrus.net.token') || '') }, body: JSON.stringify({ npc: { name: npc && npc.name, role: npc && npc.role, persona: npc && npc.persona ? String(npc.persona).slice(0, 600) : '' }, history: hist, text: text, hints: r.hints || [] }) }).then(function (x) { return x.ok ? x.json() : null; }), aiWait)
            .then(function (j) { return remember(j && j.text ? j.text : r.text); })
            .catch(function () { return remember(r.text); });
        });
      };
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

  /* Admin desk > AI (judges): gateway status, a live test and daily use */
  API.mountAdmin = function (root) {
    if (!root || root.__fxbr) return; root.__fxbr = 1;
    var tok = LS.get('fyrus.net.token') || '';
    var get = function (q) { return fetch('/api/admin/ai' + (q || ''), { headers: { authorization: 'Bearer ' + tok } }).then(function (r) { return r.json(); }); };
    function draw(j) {
      root.innerHTML = '';
      var h = function (tag, txt, st) { var e = document.createElement(tag); e.textContent = txt; if (st) e.style.cssText = st; root.appendChild(e); return e; };
      if (j.error) { h('div', j.error); return; }
      h('div', j.on ? 'AI gateway: ON · ' + j.base + ' · model ' + j.model + ' · format ' + j.format : 'AI gateway: OFF — set AI_BASE_URL and AI_API_KEY in Coolify, then Deploy. The Fyrus Brain still answers for free.', 'font:600 13px Sora,sans-serif;color:#e8d5a8;margin-bottom:6px');
      if (j.selfHosted) h('div', 'Self-hosted model (Ollama): ' + j.selfHosted + (j.inflight != null ? ' · answering now: ' + j.inflight : ''), 'font-size:12px;color:#e8d5a8');
      if (j.server) h('div', 'Server: ' + j.server.cpus + ' CPU · ' + j.server.memGB + ' GB RAM (' + j.server.freeGB + ' GB free) · load ' + j.server.load.join(' / '), 'font-size:12px;color:#9aa3b2');
      if (j.limits) h('div', 'Limits: ' + j.limits.perCitizenDay + ' AI replies per citizen per day, ' + j.limits.perDay + ' per day in total (AI_USER_DAILY, AI_DAILY_LIMIT).', 'font-size:12px;color:#9aa3b2');
      if (j.test !== undefined) h('div', 'Test answer: ' + (j.test || '(no answer)'), 'font-size:12px;color:#bff5e3;margin-top:6px');
      if (j.lastErr) h('div', 'Last error: ' + j.lastErr, 'font-size:12px;color:#ffd2d2;margin-top:6px');
      var b = h('button', 'Run a test', 'margin:10px 0;border:1px solid #c9a96e;background:transparent;color:#f4efe6;border-radius:999px;padding:6px 14px;cursor:pointer');
      b.onclick = function () { b.textContent = 'Testing…'; get('?test=1').then(draw); };
      var t = document.createElement('table'); t.style.cssText = 'width:100%;font-size:12px;border-collapse:collapse';
      t.innerHTML = '<tr><th align=left>Day</th><th align=left>Resident replies</th><th align=left>Translations</th><th align=left>People</th><th align=left>Tokens in/out</th><th align=left>Failed</th><th align=left>Too slow/busy</th></tr>' + (j.days || []).map(function (x) { return '<tr><td>' + x.day + '</td><td>' + x.talk + '</td><td>' + x.translate + '</td><td>' + x.people + '</td><td>' + x.inTok + ' / ' + x.outTok + '</td><td>' + x.fail + '</td><td>' + ((x.slow || 0) + (x.busy || 0)) + '</td></tr>'; }).join('');
      root.appendChild(t);
    }
    root.textContent = 'Loading…';
    get('').then(draw).catch(function (e) { root.textContent = String(e.message || e); });
  };

  /* Admin desk > Brain: every question residents were asked; write answers that go live at once */
  API.mountSheet = function (root) {
    if (!root || root.__fxsheet) return; root.__fxsheet = 1;
    var tok = LS.get('fyrus.net.token') || '';
    var H = { 'content-type': 'application/json', authorization: 'Bearer ' + tok };
    var tab = 'open';
    var css = document.createElement('style');
    css.textContent = '.fxbs{font:13px "Plus Jakarta Sans",system-ui,sans-serif;color:#f4efe6}.fxbs h4{margin:0 0 6px;font:600 13px Sora,sans-serif;color:#e8d5a8}.fxbs .m{font-size:12px;color:#9aa3b2}.fxbs .tabs{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0}.fxbs button{border:1px solid rgba(201,169,110,.4);background:transparent;color:#f4efe6;border-radius:999px;padding:5px 12px;font:600 12px Sora,sans-serif;cursor:pointer}.fxbs button.on,.fxbs button.p{background:#c9a96e;color:#0a0f1a;border-color:#c9a96e}.fxbs .row{border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:10px;margin-bottom:8px}.fxbs .q{font-size:14px;color:#f4efe6;word-break:break-word}.fxbs textarea,.fxbs input,.fxbs select{width:100%;box-sizing:border-box;background:#0a0f1a;border:1px solid rgba(255,255,255,.15);border-radius:10px;color:#f4efe6;padding:8px;font:13px "Plus Jakarta Sans",system-ui,sans-serif;margin-top:6px}.fxbs .acts{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.fxbs .ok{color:#bff5e3}.fxbs .bad{color:#ffd2d2}';
    root.appendChild(css);
    root.classList.add('fxbs');
    ['keydown', 'keyup', 'keypress'].forEach(function (ev) { root.addEventListener(ev, function (e) { if (e.key !== 'Escape') e.stopPropagation(); }); });
    var body = document.createElement('div'); root.appendChild(body);
    function el(tag, txt, cls) { var e = document.createElement(tag); if (txt != null) e.textContent = txt; if (cls) e.className = cls; return e; }
    var topics = [];
    function post(b) { return fetch('/api/admin/brain', { method: 'POST', headers: H, body: JSON.stringify(b) }).then(function (r) { return r.json(); }); }
    function answerForm(box, item, existing) {
      var f = el('div');
      var lang = el('select'); [['en', 'English'], ['rur', 'Roman Urdu'], ['ur', 'اردو'], ['hi', 'हिन्दी'], ['ar', 'العربية']].forEach(function (o) { var op = el('option', o[1]); op.value = o[0]; lang.appendChild(op); });
      lang.value = item && item.lang && /^(en|rur|ur|hi|ar)$/.test(item.lang) ? item.lang : 'en';
      var a = el('textarea'); a.placeholder = 'The answer residents will give (1–3 short sentences)'; a.rows = 3;
      var more = el('textarea'); more.placeholder = 'Other ways people may ask the same thing (one per line, optional)'; more.rows = 2;
      var msg = el('div', '', 'm');
      var save = el('button', 'Save answer — live now', 'p');
      save.onclick = function () { var A = {}; A[lang.value] = a.value; post({ act: 'answer', q: item ? item.q : '', more: more.value, a: A, id: existing && existing.id }).then(function (j) { if (j.ok) { msg.textContent = '✓ Saved. Residents use it within a few minutes.'; msg.className = 'm ok'; setTimeout(load, 900); } else { msg.textContent = j.error || 'Could not save'; msg.className = 'm bad'; } }); };
      f.appendChild(lang); f.appendChild(a); f.appendChild(more);
      var acts = el('div', '', 'acts'); acts.appendChild(save); f.appendChild(acts); f.appendChild(msg);
      box.appendChild(f); a.focus();
    }
    function fixForm(box, item) {
      var f = el('div');
      var inp = el('input'); inp.placeholder = 'Type to find the right topic (e.g. homes, where:pool, fyc)'; inp.setAttribute('list', 'fxbs-topics');
      var go = el('button', 'Use this topic', 'p'); var msg = el('div', '', 'm');
      go.onclick = function () { post({ act: 'fix', k: item.k, intent: inp.value.trim() }).then(function (j) { msg.textContent = j.ok ? '✓ Fixed — this question now gets that answer.' : (j.error || 'Could not save'); msg.className = j.ok ? 'm ok' : 'm bad'; if (j.ok) setTimeout(load, 900); }); };
      f.appendChild(inp); var acts = el('div', '', 'acts'); acts.appendChild(go); f.appendChild(acts); f.appendChild(msg); box.appendChild(f); inp.focus();
    }
    function row(item, mode) {
      var box = el('div', '', 'row');
      box.appendChild(el('div', item.q, 'q'));
      box.appendChild(el('div', 'Asked ' + item.n + '× · ' + (item.lang || '?') + (item.intent ? ' · matched: ' + item.intent + ' (' + item.score + ')' : ' · no match') + (item.npc ? ' · to a ' + item.npc : ''), 'm'));
      var acts = el('div', '', 'acts');
      var b1 = el('button', '✍️ Write answer'); b1.onclick = function () { b1.disabled = true; answerForm(box, item); };
      var b2 = el('button', '🎯 Correct topic'); b2.onclick = function () { b2.disabled = true; fixForm(box, item); };
      var b3 = el('button', 'Dismiss'); b3.onclick = function () { post({ act: 'dismiss', k: item.k }).then(load); };
      acts.appendChild(b1); acts.appendChild(b2); if (mode === 'open') acts.appendChild(b3);
      box.appendChild(acts);
      return box;
    }
    var load = function () {
      body.innerHTML = ''; body.appendChild(el('div', 'Loading…', 'm'));
      fetch('/api/admin/brain', { headers: H }).then(function (r) { return r.json(); }).then(function (j) {
        body.innerHTML = '';
        if (j.error) { body.appendChild(el('div', j.error, 'm bad')); return; }
        body.appendChild(el('h4', 'Brain · questions people asked the AI residents'));
        body.appendChild(el('div', j.total + ' different questions · asked ' + j.asks + ' times · ' + j.unanswered + ' without a good answer · ' + j.custom.length + ' answers written by the team · ' + j.fixes + ' topic fixes', 'm'));
        if (!document.getElementById('fxbs-topics') && KB) { var dl = el('datalist'); dl.id = 'fxbs-topics'; KB.intents.slice(0, KB.base).forEach(function (it) { var o = el('option'); o.value = it.id; dl.appendChild(o); }); document.body.appendChild(dl); }
        var tabs = el('div', '', 'tabs');
        [['open', 'Needs an answer (' + j.open.length + ')'], ['top', 'Most asked'], ['custom', 'Team answers (' + j.custom.length + ')'], ['new', '+ New answer'], ['csv', 'Sheet (CSV)']].forEach(function (t) { var b = el('button', t[1], tab === t[0] ? 'on' : ''); b.onclick = function () { tab = t[0]; load(); }; tabs.appendChild(b); });
        body.appendChild(tabs);
        if (tab === 'open') { if (!j.open.length) body.appendChild(el('div', 'Nothing waiting — residents answered everything. 🎉', 'm')); j.open.forEach(function (it) { body.appendChild(row(it, 'open')); }); }
        if (tab === 'top') j.top.forEach(function (it) { body.appendChild(row(it, 'top')); });
        if (tab === 'custom') j.custom.forEach(function (c) {
          var box = el('div', '', 'row');
          box.appendChild(el('div', c.q.join(' · '), 'q'));
          Object.keys(c.a).forEach(function (l) { box.appendChild(el('div', l + ': ' + c.a[l], 'm')); });
          var acts = el('div', '', 'acts'); var e1 = el('button', 'Add a language / edit'); e1.onclick = function () { e1.disabled = true; answerForm(box, { q: c.q[0], lang: 'en' }, c); }; var e2 = el('button', 'Delete'); e2.onclick = function () { post({ act: 'delcustom', id: c.id }).then(load); };
          acts.appendChild(e1); acts.appendChild(e2); box.appendChild(acts); body.appendChild(box);
        });
        if (tab === 'new') { var box = el('div', '', 'row'); var qi = el('input'); qi.placeholder = 'The question (for example: Fyrus mein shadi ho sakti hai?)'; box.appendChild(qi); var b = el('button', 'Next: write the answer', 'p'); b.onclick = function () { if (qi.value.trim().length < 2) return; b.disabled = true; answerForm(box, { q: qi.value.trim(), lang: detect(qi.value, '') === 'other' ? 'en' : detect(qi.value, '') }); }; var a2 = el('div', '', 'acts'); a2.appendChild(b); box.appendChild(a2); body.appendChild(box); }
        if (tab === 'csv') {
          var box2 = el('div', '', 'row');
          box2.appendChild(el('div', 'Download every question with its answer, fill the "answer" column in Excel or Google Sheets, and upload it back. Columns needed: question, answer, language (en, rur, ur, hi or ar).', 'm'));
          var dlb = el('button', '⬇ Download sheet (CSV)', 'p'); dlb.onclick = function () { fetch('/api/admin/brain.csv', { headers: H }).then(function (r) { return r.blob(); }).then(function (bl) { var a = document.createElement('a'); a.href = URL.createObjectURL(bl); a.download = 'fyrus-brain-questions.csv'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); }); };
          var file = el('input'); file.type = 'file'; file.accept = '.csv,text/csv';
          var up = el('button', '⬆ Upload filled sheet'); var msg = el('div', '', 'm');
          up.onclick = function () { var fl = file.files && file.files[0]; if (!fl) { msg.textContent = 'Choose the CSV file first.'; return; } fl.text().then(function (t) { return post({ act: 'import', csv: t }); }).then(function (j) { msg.textContent = j.ok ? '✓ ' + j.added + ' answers added — live within a few minutes.' : (j.error || 'Could not import'); msg.className = j.ok ? 'm ok' : 'm bad'; }); };
          var a3 = el('div', '', 'acts'); a3.appendChild(dlb); box2.appendChild(a3); box2.appendChild(file); var a4 = el('div', '', 'acts'); a4.appendChild(up); box2.appendChild(a4); box2.appendChild(msg); body.appendChild(box2);
        }
      }).catch(function (e) { body.innerHTML = ''; body.appendChild(el('div', String(e.message || e), 'm bad')); });
    };
    (KB ? Promise.resolve() : API.load()).then(load, load);
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
