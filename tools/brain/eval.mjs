// Held-out questions (not in the seeds) to check the Brain. Usage: node tools/brain/eval.mjs <brain.json> <fyrus-brain.js>
import fs from 'node:fs';
import vm from 'node:vm';
const [kbPath, jsPath] = process.argv.slice(2);
const ctx = { console, setTimeout: () => 0, setInterval: () => 0, navigator: { language: 'en' }, performance: { now: () => 0 } };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(jsPath, 'utf8'), ctx);
const B = ctx.__fyrusBrain;
ctx.__fyrusBrain.kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
// inject KB
vm.runInContext('void 0', ctx);
const T = [
  ['en', 'where can i go swimming', 'where:pool|swim|what:pool'], ['en', 'how much does a villa cost', 'homes'], ['en', 'i want to fly across the sea to the other city', 'vector_bay_how|take:vector-bay|where:vector-bay|transit'],
  ['en', 'is fyc real cash', 'fyc'], ['en', 'somebody keeps sending me nasty messages', 'report_block'], ['en', 'my game keeps freezing', 'slow_phone|help_desk'],
  ['en', 'can my 10 year old play', 'kids_mode|age_rules'], ['en', 'what time does the concert start', 'events_programme|where:site-amph'], ['en', 'teleport me to the beach', 'take:coast'],
  ['en', 'who are you', 'who_are_you'], ['en', 'are you a real person', 'are_you_ai'], ['en', 'tell me something funny', 'joke'], ['en', 'where is the mosque', 'where:faith'],
  ['en', 'how do i get a certificate', 'education'], ['en', 'what is house maren', 'prov:azure'], ['en', 'i forgot my password', 'account'], ['en', 'make the text bigger', 'easy_mode'],
  ['rur', 'bhai swimming pool kidhar hai', 'where:pool'], ['rur', 'ghar kitne ka milta hai', 'homes'], ['rur', 'mujhe vector bay le chalo', 'take:vector-bay'], ['rur', 'kya fyc se asli paise ban sakte hain', 'fyc|earn_fyc'],
  ['rur', 'koi mujhe tang kar raha hai kya karun', 'report_block'], ['rur', 'game bohat slow chal raha hai', 'slow_phone'], ['rur', 'aap kon ho', 'who_are_you'], ['rur', 'kaise ho bhai', 'how_are_you'],
  ['rur', 'zameen kaise milti hai', 'land'], ['rur', 'masjid kahan hai', 'where:faith'], ['rur', 'free mein parhai ho sakti hai', 'education'], ['rur', 'dukan kholni hai', 'open_shop'], ['rur', 'concert kitne baje hai', 'events_programme'],
  ['ur', 'سوئمنگ پول کہاں ہے', 'where:pool'], ['ur', 'گھر کی قیمت کیا ہے', 'homes'], ['ur', 'مجھے ویکٹر بے لے چلو', 'take:vector-bay'], ['ur', 'آپ کون ہیں', 'who_are_you'], ['ur', 'کوئی تنگ کر رہا ہے', 'report_block'], ['ur', 'مسجد کہاں ہے', 'where:faith'],
  ['hi', 'स्विमिंग पूल कहाँ है', 'where:pool'], ['hi', 'घर कितने का है', 'homes'], ['hi', 'आप कौन हो', 'who_are_you'], ['hi', 'मुझे वेक्टर बे ले चलो', 'take:vector-bay'], ['hi', 'मंदिर कहाँ है', 'where:faith'], ['hi', 'गेम धीमा चल रहा है', 'slow_phone'],
  ['ar', 'أين المسبح', 'where:pool'], ['ar', 'كم سعر المنزل', 'homes'], ['ar', 'من أنت', 'who_are_you'], ['ar', 'خذني إلى فيكتور باي', 'take:vector-bay'], ['ar', 'أين المسجد', 'where:faith'], ['ar', 'هل العملة حقيقية', 'fyc'],
  ['en', 'whats the cheapest home', 'homes'], ['en', 'how do people make money in this city', 'earn_fyc'], ['en', 'where do kids play', 'where:site-park|kids_mode'], ['en', 'can i change my hairstyle', 'avatar'],
  ['en', 'is there a train station', 'where:site-central|transit'], ['en', 'who is the police here', 'where:site-peace|what:site-peace'], ['en', 'where are the yachts', 'where:marina|where:coast'], ['en', 'how many people are playing right now', 'online_now'],
  ['en', 'what is the weather like', 'weather_now'], ['en', 'thank you so much friend', 'thanks'], ['en', 'i dont know what to do', 'what_to_do|help_me'], ['en', 'can i vote in elections', 'politics'],
  ['en', 'what is silica', 'prov:silica'], ['en', 'how does the escrow work', 'escrow_dispute'], ['en', 'where do i watch news', 'where:newstv|news'], ['en', 'show me the theme park', 'where:joyland|what:joyland'],
  ['rur', 'mujhe naukri chahiye', 'jobs'], ['rur', 'meri id card kaise banegi', 'id_card'], ['rur', 'barish kaise karun', 'weather'], ['rur', 'bacha khel sakta hai kya', 'kids_mode|age_rules'],
  ['rur', 'flying car kahan milegi', 'where:skyport|vehicles'], ['rur', 'kitne log online hain abhi', 'online_now'], ['rur', 'mera balance batao', 'my_balance'], ['rur', 'shukriya bhai', 'thanks'],
  ['rur', 'ludo khelna hai', 'games'], ['rur', 'password bhool gaya hoon', 'account'], ['rur', 'kapre kaise badlun', 'avatar'], ['rur', 'allah hafiz', 'bye'],
  ['ur', 'نوکری چاہیے', 'jobs'], ['ur', 'شکریہ', 'thanks'], ['ur', 'زمین کیسے خریدوں', 'land'], ['ur', 'پاسپورٹ کیسے بنے گا', 'passport'],
  ['hi', 'नौकरी चाहिए', 'jobs'], ['hi', 'धन्यवाद', 'thanks'], ['hi', 'पासपोर्ट कैसे बनेगा', 'passport'], ['hi', 'लूडो खेलना है', 'games'],
  ['ar', 'أريد وظيفة', 'jobs'], ['ar', 'شكرا لك', 'thanks'], ['ar', 'كيف أحصل على جواز سفر', 'passport'], ['ar', 'أين الشاطئ', 'where:coast'],
  ['en', 'qwertyuiop asdf', '__none__']
];
// force-load KB without fetch
ctx.fetch = () => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(kbPath, 'utf8'))) });
await B.load();
let ok = 0; const bad = [];
for (const [l, q, want] of T) {
  const r = B.ask(q, { dry: true });
  const good = want === '__none__' ? !r.intent : want.split('|').includes(r.intent);
  if (good) ok++; else bad.push(`${l} | ${q} -> ${r.intent} (${r.score.toFixed(2)}) want ${want}`);
}
console.log(`accuracy ${ok}/${T.length} = ${(100 * ok / T.length).toFixed(0)}%`);
bad.forEach((b) => console.log('  MISS', b));
