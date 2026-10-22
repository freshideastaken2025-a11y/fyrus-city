// --- Education ladder (v32): Fyrus Public School -> Fyrus College -> University of Fyrus ---
// Additive seed for Education City. Adds three verified institutions and nine free courses taught by the
// Fyrus Academy instructors, so certificates are issued automatically (HMAC-signed by edu.mjs) when every
// lesson is passed. Idempotent: it only adds ids that are missing and never edits a citizen's course.
var LADDER = [
  { id: "fy-school", type: "school", name: "Fyrus Public School", tagline: "Step 1 of the ladder: the basics every citizen needs", color: "#45b38a", courses: [
    ["school-digital", "Digital Citizen Basics", "Stay safe online, protect your accounts and treat people well.", ["Online safety", "Passwords", "Digital manners"], [
      ["Your account is your home", "Your account holds your money, messages and work. Use a long passphrase (four or more unrelated words), never reuse it on other sites, and turn on sign-in alerts. Nobody from Fyrus will ever ask for your password.", "Which password is strongest?", ["fyrus123", "Sunflower!", "river candle orbit pepper", "your birthday"], 2],
      ["Think before you share", "Before you post, ask: would I say this to someone's face, and would I be happy if my family read it? Never share your home address, phone number or school with strangers. A screenshot lasts forever.", "Which is safe to share with a stranger?", ["Your home address", "Your favourite book", "Your school name", "Your phone number"], 1],
      ["When something feels wrong", "If a message scares you, asks for money or asks you to keep a secret, stop replying, take a screenshot and report it. Tell a parent or someone you trust. Blocking is not rude; it keeps you safe.", "A stranger asks you to keep your chat secret. What do you do?", ["Keep the secret", "Stop, screenshot and report it", "Send them a photo", "Argue with them"], 1]
    ]],
    ["school-money", "Money and Saving", "Earning, spending, saving and why a budget matters.", ["Budgeting", "Saving", "Needs vs wants"], [
      ["Needs and wants", "A need is something you must have to live and work: food, a home, transport. A want makes life nicer but you can live without it. Pay for needs first, then decide on wants.", "Which one is a need?", ["A new game skin", "Rent for your home", "A second phone", "Concert tickets"], 1],
      ["The 50/30/20 budget", "A simple plan: 50% of what you earn for needs, 30% for wants, 20% for saving. If you earn 1,000, save 200 every month. Small, regular saving grows faster than big promises.", "If you earn 1,000, how much does the 50/30/20 plan save?", ["50", "100", "200", "500"], 2],
      ["Keep a record", "Write down every payment for one month. Most people are surprised where their money goes. In Fyrus your bank history shows every FYC in and out, so you can check it any time.", "Why keep a record of spending?", ["To see where money really goes", "To spend more", "Banks require it", "It has no use"], 0]
    ]],
    ["school-english", "Speak and Write Clearly", "Simple rules for clear messages, emails and presentations.", ["Writing", "Communication", "Presentation"], [
      ["One message, one point", "Put the main point in the first sentence. Use short sentences. If you need an answer, ask one clear question at the end.", "Where should the main point go?", ["At the end", "In the first sentence", "In a footnote", "Nowhere"], 1],
      ["Say what you need", "Instead of \"Can you help?\" write \"Can you review my shop description by Friday?\" A clear request with a deadline gets a faster, better reply.", "Which request is clearest?", ["Help me", "Any thoughts?", "Please review my price list by Friday", "Hello?"], 2],
      ["Speak to a room", "Start with why it matters to the listeners, give three points at most, and finish with what you want them to do. Practise once out loud; it is the best cure for nerves.", "How many main points work best for a short talk?", ["Three at most", "Ten", "Twenty", "As many as possible"], 0]
    ]]
  ] },
  { id: "fy-college", type: "college", name: "Fyrus College", tagline: "Step 2 of the ladder: skills you can earn with", color: "#4da3ff", courses: [
    ["college-business", "Business Foundations", "Find a customer, price your offer and keep honest books.", ["Customers", "Pricing", "Bookkeeping"], [
      ["Start with a customer", "A business starts with a person who has a problem and will pay to solve it. Talk to five possible customers before you build anything. Ask what they do today and what it costs them.", "What should you do before building a product?", ["Buy an office", "Talk to possible customers", "Print business cards", "Hire staff"], 1],
      ["Price for profit", "Price = cost + profit, then check what customers will pay. If a product costs 60 to make and you sell it at 100, your margin is 40%. Never price below cost to win a sale.", "Cost 60, price 100: what is the margin?", ["40%", "60%", "100%", "16%"], 0],
      ["Honest books", "Record every sale and every cost the same day. Keep business money separate from personal money. At month end, income minus costs is your profit; that number tells you if the business works.", "How do you find profit?", ["Income plus costs", "Income minus costs", "Costs minus income", "Count your customers"], 1]
    ]],
    ["college-code", "Coding Foundations", "How the web works, and your first HTML, CSS and JavaScript.", ["HTML", "CSS", "JavaScript"], [
      ["How a web page works", "A browser asks a server for a page. The server sends HTML (the structure), CSS (the style) and JavaScript (the behaviour). Your browser puts them together into what you see.", "Which language controls a page's style?", ["HTML", "CSS", "SQL", "JSON"], 1],
      ["Your first page", "HTML uses tags: <h1> for a heading, <p> for a paragraph, <a href=\"...\"> for a link, <img> for an image. Every page needs a clear heading and readable text before it needs decoration.", "Which tag makes a link?", ["<p>", "<h1>", "<a>", "<img>"], 2],
      ["Make it do something", "JavaScript reacts to people. button.addEventListener('click', ...) runs code when a button is pressed. Start small: change some text when a button is clicked, then build up.", "What does addEventListener('click', ...) do?", ["Styles the page", "Runs code when something is clicked", "Deletes the button", "Saves a file"], 1]
    ]],
    ["college-design", "Design Foundations", "Hierarchy, colour and type that make work look professional.", ["Visual hierarchy", "Colour", "Typography"], [
      ["Hierarchy guides the eye", "Make the most important thing the biggest or boldest. People scan before they read, so headlines, then key numbers, then details. If everything is bold, nothing is.", "What happens when everything is bold?", ["Everything stands out", "Nothing stands out", "It looks premium", "It is easier to read"], 1],
      ["Fewer colours", "Pick one main colour, one accent and neutrals. Use the accent only for the action you want, like the Buy button. Check contrast so text is readable for everyone.", "What is the accent colour for?", ["Every heading", "The background", "The one action you want people to take", "Random decoration"], 2],
      ["Two typefaces at most", "Use one face for headings and one for body text. Keep line length near 60 to 70 characters and give lines room to breathe. Good type is invisible: people just read.", "How many typefaces should a simple design use?", ["One or two", "Five", "Ten", "One per word"], 0]
    ]]
  ] },
  { id: "fy-uni", type: "university", name: "University of Fyrus", tagline: "Step 3 of the ladder: build, lead and trade across the world", color: "#c9a96e", courses: [
    ["uni-ai", "Applied AI", "Use AI responsibly to do real work: prompts, agents, evaluation and limits.", ["Applied AI", "Evaluation", "Responsible AI"], [
      ["Know the limits", "Language models predict likely text. They can be confidently wrong, especially about facts, numbers and recent events. Check important facts against a source and never let AI make a decision that harms someone without a human review.", "What must you do with an important fact from an AI?", ["Trust it", "Check it against a source", "Delete it", "Share it fast"], 1],
      ["Measure, do not guess", "Build a test set of real tasks with known good answers. Run every change of prompt or model against the same set and compare scores. Without a test set you cannot tell if a change made things better.", "Why keep a fixed test set?", ["To compare changes fairly", "To slow down work", "Models need it to run", "It is decoration"], 0],
      ["Privacy and consent", "Only give an AI the data the task needs. Remove names, phone numbers and card numbers when you can. If you use someone's photo, voice or words, ask first.", "What data should you give an AI tool?", ["Everything you have", "Only what the task needs", "Passwords", "Other people's private chats"], 1]
    ]],
    ["uni-venture", "Entrepreneurship", "From idea to first paying customers to a team.", ["Validation", "Growth", "Leadership"], [
      ["Test the riskiest idea first", "Every startup rests on guesses. Write them down and test the riskiest one first, as cheaply as possible: a landing page, ten calls, a pre-order. Learning fast beats building fast.", "Which guess should you test first?", ["The easiest", "The riskiest", "The logo colour", "The office location"], 1],
      ["Grow with one channel", "Pick the one channel where your customers already are (a marketplace, a community, word of mouth) and get good at it before adding more. Measure cost per customer and how many come back.", "What should you measure for growth?", ["Cost per customer and repeat buyers", "Number of slides", "Office size", "Followers you bought"], 0],
      ["Lead people", "Say clearly what success looks like, give people ownership of results, and give feedback early and in private. Keep promises small and keep every one of them.", "Where should you give critical feedback?", ["In public", "Early and in private", "Never", "Only in writing to everyone"], 1]
    ]],
    ["uni-trade", "Global Trade and E-commerce", "Sell across borders: listings, shipping, payments and trust.", ["E-commerce", "Logistics", "Cross-border trade"], [
      ["A listing that sells", "Clear photos on a plain background, a title with what it is and who it is for, honest measurements, and the delivery time. Answer the three questions buyers always ask before they ask them.", "What belongs in a good product title?", ["What it is and who it is for", "Only emojis", "Your phone number", "A long story"], 0],
      ["Shipping and customs", "Quote shipping before checkout, use tracked delivery, and check what the buyer's country allows. Customs may charge the buyer duties; say so in the listing to avoid angry surprises.", "Who often pays customs duties?", ["Nobody", "The buyer, so say it in the listing", "The courier for free", "Fyrus"], 1],
      ["Trust is the product", "Use escrow, deliver on time, reply within a day and solve problems quickly. One fair refund costs less than one bad review. In Fyrus the escrow and the court protect both sides.", "What protects both buyer and seller in Fyrus?", ["Paying outside the platform", "Escrow and the court", "Secret deals", "Gift cards"], 1]
    ]]
  ] }
];
function seedLadder(d) {
  const E = d.db.edu;
  if (!E || !E.inst || !E.courses) return;
  const now = Date.now();
  let changed = false;
  for (const L of LADDER) {
    if (!E.inst[L.id]) {
      E.inst[L.id] = { id: L.id, owner: "academy", type: L.type, name: L.name, tagline: L.tagline, color: L.color, staff: ["academy"], verified: true, at: now };
      changed = true;
    }
    for (const [id, title, summary, skills, lessons] of L.courses) {
      if (E.courses[id]) continue;
      E.courses[id] = {
        id, teacher: "academy", teacherName: (E.teachers.academy && E.teachers.academy.name) || "Fyrus Academy instructors",
        inst: L.id, instName: L.name, title, summary, skills,
        level: L.type === "school" ? "Beginner" : L.type === "college" ? "Intermediate" : "Advanced",
        fee: 0, students: 0, at: now,
        lessons: lessons.map(([t, body, q, opts, ans]) => ({ title: t, body, q, opts, ans }))
      };
      changed = true;
    }
  }
  if (changed) d.save();
}
