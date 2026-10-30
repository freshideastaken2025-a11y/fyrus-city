// 27.11 tool permission table: unknown tools and prototype keys are denied; money and discounts are never auto/approve
const fs = require('fs'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../../app/src/server/businesses.mjs'), 'utf8');
const m = src.match(/var AI_TOOLS = [^\n]+\nvar aiToolLevel = [^\n]+/)[0];
const { AI_TOOLS, aiToolLevel } = new Function(m + '; return { AI_TOOLS, aiToolLevel };')();
let pass = 0, fail = 0; const t = (n, ok) => (ok ? pass++ : (fail++, console.log('FAIL', n)));
t('unknown tool denied', aiToolLevel('shell.exec') === 'deny');
t('__proto__ denied', aiToolLevel('__proto__') === 'deny' && aiToolLevel('constructor') === 'deny');
t('money.move denied', aiToolLevel('money.move') === 'deny');
t('price.discount denied', aiToolLevel('price.discount') === 'deny');
t('price.suggest needs approval', aiToolLevel('price.suggest') === 'approve');
t('no tool with money in its name is above deny', Object.keys(AI_TOOLS).filter((k) => /money|transfer|withdraw|discount/.test(k)).every((k) => AI_TOOLS[k] === 'deny'));
t('only known levels', Object.values(AI_TOOLS).every((v) => ['auto', 'approve', 'deny'].includes(v)));
console.log(`ai-tools: ${pass}/${pass + fail}`); process.exit(fail ? 1 : 0);
