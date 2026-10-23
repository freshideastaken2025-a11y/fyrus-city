// Fyrus Brain v3 — makes many natural ways of asking the same question (English, Roman Urdu, Urdu, Hindi):
// word synonyms + polite openers + endings. Used for the per-language datasets (1 lakh+ questions each)
// and as extra matching seeds in the browser.
export const SYN = {
  en: {
    'how do i': ['how can i', 'how should i', 'what is the way to', 'how to', 'tell me how to'], 'where is': ['where can i find', 'which way to', 'where do i find', 'how to get to'],
    'what is': ["what's", 'explain', 'tell me about', 'what do you know about'], 'buy': ['purchase', 'get', 'pay for'], 'house': ['home', 'property'], 'home': ['house', 'place'],
    'find': ['locate', 'see'], 'want to': ['would like to', 'wish to', 'need to'], 'can i': ['is it possible to', 'am i able to', 'may i'], 'money': ['cash', 'coins'],
    'friend': ['buddy', 'mate'], 'friends': ['buddies', 'people'], 'game': ['match', 'game'], 'play': ['try', 'start'], 'learn': ['study'], 'big': ['large'], 'cheap': ['affordable', 'low cost'],
    'help': ['assist', 'support'], 'show me': ['point me to', 'guide me to'], 'tell me': ['let me know', 'explain'], 'please': ['pls', 'kindly'], 'take me to': ['bring me to', 'teleport me to', 'go to'],
    'is there': ['do you have', 'is there any'], 'make': ['create'], 'change': ['switch', 'edit'], 'start': ['begin', 'open']
  },
  rur: {
    'kaise': ['kis tarah', 'kesay', 'kaisay'], 'kahan': ['kidhar', 'kis jagah', 'kahaan'], 'kya': ['kia', 'kiya'], 'hai': ['he', 'hy', 'h'], 'batao': ['bata do', 'btao', 'bataen', 'batayein'],
    'ghar': ['makan', 'ghr'], 'khareedun': ['loon', 'kharidun'], 'paise': ['pese', 'raqam', 'paisay'], 'dost': ['yaar', 'dost log'], 'mujhe': ['mjhe', 'muje'], 'chahiye': ['chaiye', 'chahye'],
    'karun': ['kru', 'karoon'], 'jaun': ['jaon', 'jaoon'], 'le chalo': ['le chalein', 'le jao', 'pohncha do'], 'kaun': ['kon', 'kaun sa'], 'mein': ['me', 'main'], 'acha': ['achha', 'badiya'],
    'game': ['khel'], 'khelna': ['khelne'], 'sikhao': ['sikha do', 'samjhao'], 'kitne': ['kitny', 'kitnay'], 'milega': ['milay ga', 'mil jayega'], 'aap': ['ap', 'tum']
  },
  ur: { 'کیسے': ['کس طرح'], 'کہاں': ['کدھر', 'کس جگہ'], 'کیا': ['کیا'], 'ہے': ['ہے'], 'بتائیں': ['بتا دیں', 'بتاؤ'], 'گھر': ['مکان'], 'پیسے': ['رقم'], 'مجھے': ['مجھ کو'], 'چاہیے': ['درکار ہے'], 'کروں': ['کروں'], 'جاؤں': ['جاؤں'], 'دوست': ['یار'] },
  hi: { 'कैसे': ['किस तरह', 'कैसे करके'], 'कहाँ': ['किधर', 'किस जगह'], 'क्या': ['क्या'], 'बताओ': ['बता दो', 'बताइए'], 'घर': ['मकान'], 'पैसे': ['रुपये', 'रक़म'], 'मुझे': ['मुझको'], 'चाहिए': ['चाहिये'], 'दोस्त': ['मित्र', 'यार'], 'जाऊँ': ['जाऊं'], 'करूँ': ['करूं'] }
};
export const OPEN = {
  en: ['', 'hey, ', 'hi, ', 'excuse me, ', 'please tell me ', 'can you tell me ', 'quick question: ', 'sorry, ', 'do you know ', 'i wonder ', 'question: ', 'hello! ', 'one thing: ', 'could you tell me '],
  rur: ['', 'bhai ', 'yaar ', 'sunein ', 'ek baat batao ', 'please batao ', 'acha ', 'bhai jaan ', 'sir ', 'madam ', 'zara batao ', 'suno ', 'ek sawal hai ', 'janab '],
  ur: ['', 'بھائی ', 'سنیں ', 'ایک بات بتائیں ', 'براہ کرم بتائیں ', 'جناب ', 'ایک سوال ہے ', 'ذرا بتائیں ', 'سر ', 'مہربانی کر کے بتائیں ', 'اچھا '],
  hi: ['', 'भाई ', 'सुनिए ', 'एक बात बताओ ', 'कृपया बताइए ', 'जी ', 'एक सवाल है ', 'ज़रा बताइए ', 'सर ', 'मैडम ', 'अच्छा ']
};
export const CLOSE = {
  en: ['', '?', ' please', ' pls', '??', ' thanks', ' asap', ' quickly', ' now'],
  rur: ['', '?', ' plz', ' jaldi batao', ' na', ' please', ' shukriya', ' abhi'],
  ur: ['', '؟', ' پلیز', ' جلدی بتائیں', ' شکریہ', ' ابھی'],
  hi: ['', '?', ' प्लीज़', ' जल्दी बताइए', ' धन्यवाद', ' अभी']
};
function subs(lang, q) {
  const S = SYN[lang] || {}, out = new Set([q]);
  const keys = Object.keys(S).filter((k) => new RegExp('(^|\\s)' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$|\\?)').test(q));
  keys.forEach((k) => S[k].forEach((v) => out.add(q.replace(k, v))));
  if (keys.length >= 2) { const [a, b] = keys; S[a].forEach((va) => S[b].slice(0, 2).forEach((vb) => out.add(q.replace(a, va).replace(b, vb)))); }
  return [...out];
}
export function paraphrases(lang, q, cap) {
  const out = new Set();
  const base = subs(lang, q);
  for (const b of base) for (const o of OPEN[lang] || ['']) for (const c of CLOSE[lang] || ['']) { out.add((o + b + c).replace(/\s+/g, ' ').trim()); if (cap && out.size >= cap) return [...out]; }
  return [...out];
}
