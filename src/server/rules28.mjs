// FYRUS 28.12 city governance rules: one place for the city's rules (from the Terms of Use section 4 and the Constitution)
// and the real enforcement numbers the chat/report code uses (the constants below ARE what index.2.mjs enforces), so
// what players read always matches what happens. rules_get returns both. Kill switch P28_OFF=rules (screen + rule
// references in enforcement messages off; enforcement itself never changes).
var RULES28 = { FILTER_BLOCKS: 5, FILTER_WINDOW_MS: 6e5, FILTER_MUTE_MS: 9e5, REPORTS_TO_PAUSE: 3, REPORT_PAUSE_MS: 864e5, REPORTS_PER_DAY: 15 };
var CITY_RULES = [
  { n: 1, title: "Respect everyone", text: "No harassment, hate, threats or bullying. Every religion is respected; mocking or attacking a faith is forbidden." },
  { n: 2, title: "Keep it clean", text: "No sexual content, and nothing that sexualises anyone. Content involving minors is banned outright." },
  { n: 3, title: "No scams", text: "No fake listings and no asking for payment or contact outside Fyrus. A proven scam means a full refund to the victim and a permanent ban." },
  { n: 4, title: "No real-world politics or impersonation", text: "No real political parties or politicians in Fyrus elections, and no pretending to be real people, brands or officials." },
  { n: 5, title: "Play fair", text: "No cheating, bots, bug exploits, or extra accounts to vote or farm rewards. One citizen, one passport, one vote." },
  { n: 6, title: "Your own content only", text: "Upload only what you made or may use." },
  { n: 7, title: "FYC is play money", text: "FYC is an in-city credit. It is never traded for real money or crypto." },
  { n: 8, title: "Stay safe", text: "Never share passwords, bank or card details, not even with \"staff\". Links and contact details from brand-new accounts are blocked." }
];
var rules28Off = () => /(^|,)(rules|all)(,|$)/.test(process.env.P28_OFF || "");
function rules28Payload() {
  const R = RULES28, min = (ms) => Math.round(ms / 6e4), h = (ms) => Math.round(ms / 36e5);
  return { t: "rules", rules: CITY_RULES, enforcement: [
    `The chat filter blocks messages that break rules 1, 2, 3 or 8. ${R.FILTER_BLOCKS} blocked messages within ${min(R.FILTER_WINDOW_MS)} minutes pause your chat for ${min(R.FILTER_MUTE_MS)} minutes.`,
    `Report anyone from their profile or the chat (⋯ → Report). When ${R.REPORTS_TO_PAUSE} trusted citizens report the same person within ${h(R.REPORT_PAUSE_MS)} hours, that person's chat is paused for ${h(R.REPORT_PAUSE_MS)} hours until a judge reviews it. Each citizen can send up to ${R.REPORTS_PER_DAY} reports a day.`,
    "Moderators can mute chat for hours; Fyrus judges can disqualify candidates, deregister parties, and suspend or ban accounts.",
    "Payment problems go to the Fyrus Court (Nation › Law & Court): the money stays frozen in escrow while a judge decides."
  ] };
}
function createRules(d) {
  function onMessage(me, m) {
    if (m.t !== "rules_get") return false;
    if (rules28Off()) return d.send(me.ws, { t: "err", text: "The rules screen is switched off; read the Terms of Use at /terms." }), true;
    d.send(me.ws, rules28Payload());
    return true;
  }
  return { onMessage };
}
