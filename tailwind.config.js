/* Fyrus — Tailwind is compiled ahead of time (the browser no longer runs the Tailwind CDN compiler).
   Rebuild after adding new Tailwind classes:
     tailwindcss-linux-x64 (v3.4.17 standalone CLI from GitHub releases) -c tailwind.config.js -i tailwind.in.css -o fyrus-tw.css --minify
   then bump ?v= on the fyrus-tw.css link in src/client/template.html. */
module.exports = {
  content: ['./src/client/template.html', './index.html', './fyrus-*.js'],
  theme: { extend: {
    fontFamily: { display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'], body: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'] },
    colors: { night: '#040a1c', deep: '#081633', brand: '#2f6fe0', glow: '#4da3ff', sky: '#a8d8ff', ember: '#ff9a3c', mint: '#45e0ae' },
  } },
};
