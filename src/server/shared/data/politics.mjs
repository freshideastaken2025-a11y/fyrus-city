// src/data/politics.ts
var CITIES = [
  { id: "capital", name: "Capital Quarter", color: "#ffc27a" },
  { id: "market", name: "Market City", color: "#ff9a3c" },
  { id: "tech", name: "Tech City", color: "#4da3ff" },
  { id: "creator", name: "Creator City", color: "#c792ea" },
  { id: "play", name: "Play City", color: "#45e0ae" },
  { id: "learn", name: "Learn City", color: "#7fd1ff" },
  { id: "faith", name: "Faith & Culture District", color: "#e6d3a3" }
];
var cityName = (id) => CITIES.find((c) => c.id === id)?.name || id;
var SEATS = 21;
var SYMBOLS = ["\u2605", "\u25C6", "\u25CF", "\u25B2", "\u2726", "\u2600", "\u263E", "\u26A1", "\u273F", "\u2756", "\u2B22", "\u265E", "\u2693", "\u{1F33F}", "\u{1F985}", "\u{1F981}", "\u{1F54A}", "\u{1F525}", "\u{1F4A1}", "\u{1F30A}", "\u{1F680}", "\u{1F4D8}", "\u2699", "\u{1F333}"];
var PARTY_COLORS = ["#2f6fe0", "#ff9a3c", "#45e0ae", "#c792ea", "#e5484d", "#ffd23f", "#7fd1ff", "#2f5d50", "#b06ad9", "#e05a8a", "#8b5a2b", "#1b1d22"];
var FEES = { party: 5e3, nominate: 1e3, proposal: 500 };
var LIMITS = { name: 32, short: 6, slogan: 80, manifesto: 1500, statement: 400, proposal: 120, proposalBody: 800, parties: 60, openProposals: 3 };
var REAL = [
  "pti",
  "pml",
  "pmln",
  "ppp",
  "mqm",
  "jui",
  "tlp",
  "anp",
  "bjp",
  "aap",
  "inc",
  "congress",
  "democrat",
  "republican",
  "gop",
  "labour",
  "labor party",
  "tory",
  "tories",
  "conservative party",
  "lib dem",
  "snp",
  "afd",
  "cdu",
  "spd",
  "anc",
  "awami",
  "bnp",
  "jamaat",
  "insaf",
  "muslim league",
  "peoples party",
  "imran",
  "nawaz",
  "sharif",
  "shehbaz",
  "maryam",
  "bhutto",
  "zardari",
  "bilawal",
  "fazl",
  "modi",
  "rahul gandhi",
  "gandhi",
  "kejriwal",
  "trump",
  "biden",
  "kamala",
  "harris",
  "obama",
  "putin",
  "xi jinping",
  "erdogan",
  "netanyahu",
  "starmer",
  "sunak",
  "macron",
  "hasina",
  "khamenei",
  "zelensky"
];
function realPolitics(text) {
  const t = " " + String(text || "").toLowerCase().replace(/[^a-z؀-ۿ ]+/g, " ").replace(/\s+/g, " ") + " ";
  return REAL.find((w) => t.includes(" " + w + " ") || w.length > 5 && t.includes(w)) || null;
}
function phaseAt(start, len, now) {
  const nomEnd = start + Math.round(len * 3 / 7);
  const end = start + len;
  return now < nomEnd ? { phase: "nominations", until: nomEnd, end } : { phase: "voting", until: end, end };
}
function dhondt(votes, seats = SEATS) {
  const out = {};
  const ids = Object.keys(votes).filter((k) => votes[k] > 0);
  if (!ids.length) return out;
  for (let s = 0; s < seats; s++) {
    let best = ids[0], bq = -1;
    for (const id of ids) {
      const q = votes[id] / ((out[id] || 0) + 1);
      if (q > bq || q === bq && votes[id] > votes[best]) {
        bq = q;
        best = id;
      }
    }
    out[best] = (out[best] || 0) + 1;
  }
  return out;
}

