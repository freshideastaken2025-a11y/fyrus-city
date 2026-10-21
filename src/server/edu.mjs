// server/edu.ts
import crypto from "node:crypto";
var TYPES = ["school", "college", "university", "institute"];
var ACADEMY = "academy";
var B32 = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
var newCode = () => {
  const b = crypto.randomBytes(12);
  let s = "";
  for (let i = 0; i < 12; i++) s += B32[b[i] % B32.length];
  return `FC-${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
};
function seed() {
  const now = Date.now();
  const inst = { id: ACADEMY, owner: ACADEMY, type: "institute", name: "Fyrus Academy", tagline: "Free starter courses from the Ministry of Education", color: "#2f6fe0", staff: [ACADEMY], verified: true, at: now };
  const t = { id: ACADEMY, name: "Fyrus Academy instructors", subject: "AI, prompts and selling safely", bio: "The Ministry of Education team that teaches every new arrival the basics. Courses are free.", at: now };
  const C = (id, title, summary, skills, level, lessons) => ({ id, teacher: ACADEMY, teacherName: t.name, inst: ACADEMY, instName: inst.name, title, summary, skills, level, fee: 0, lessons, students: 0, at: now });
  const courses = [
    C("agents-101", "AI Agents 101: build your first agent", "What an AI agent is, how to give it a job, tools and memory, and how to test it before you sell it.", ["AI agents", "Prompt design", "Testing"], "Beginner", [
      { title: "What is an AI agent?", body: "An AI agent is a language model that is given a goal, instructions and tools, and then works in steps until the goal is done. A chatbot answers one message; an agent plans, uses tools (search, a calculator, your files) and checks its own work.\n\nIn Fyrus you can sell agents in your shop. Buyers try a live demo first, so a clear, reliable agent sells best.", q: "What makes an agent different from a simple chatbot?", opts: ["It has a nicer avatar", "It works in steps towards a goal and can use tools", "It only speaks English"], ans: 1 },
      { title: "Give it one clear job", body: 'Agents fail most often because the job is vague. Write the job in one sentence ("Turn a product photo and price into a shop listing"). Then list: who the user is, what a good result looks like, what it must never do, and the exact output format.\n\nShort, specific instructions beat long, general ones.', q: "Which job description is best?", opts: ["Be helpful with business stuff", "Turn a product photo and price into a 60-word shop listing with 3 bullet points", "Do anything the user asks"], ans: 1 },
      { title: "Tools and memory", body: "Tools let an agent act: look things up, calculate, read a file, call an API. Give only the tools the job needs. Memory lets it remember facts between steps or sessions; keep it to what is useful (the user's shop name, preferred tone) and never store passwords or card numbers.", q: "What should an agent never store in memory?", opts: ["The shop name", "The preferred tone", "Passwords and card numbers"], ans: 2 },
      { title: "Test before you sell", body: "Make a list of 10 real requests, including 3 tricky ones (missing information, a rude user, a request it must refuse). Run them all, note every bad answer, fix the instructions and run them again. Keep the list; run it after every change.", q: "How many test requests should include tricky cases in the example?", opts: ["None", "3 of 10", "All of them"], ans: 1 },
      { title: "Publish in your shop", body: "Open a shop from the dock (Learn & Work \u2192 Open a shop), choose AI agent, write the job in the tagline and set a fair price. Turn on the live demo so buyers can try it. Answer reviews; good reviews bring more visitors from the market street." }
    ]),
    C("prompts-basics", "Prompt Writing Basics", "Write prompts that get the same good answer every time: role, task, context, format and examples.", ["Prompt writing", "Clear instructions"], "Beginner", [
      { title: "The five parts of a prompt", body: "A strong prompt has: a role (who the model is), the task, the context it needs, the output format and, when useful, an example. Missing context is the most common reason for a weak answer.", q: "Which is the most common reason for a weak answer?", opts: ["Missing context", "Too many emojis", "Using English"], ans: 0 },
      { title: "Show, don't only tell", body: "One good example of the answer you want is worth a paragraph of rules. If you need a table, show a two-row table. If you need a tone, paste a sentence in that tone." },
      { title: "Ask for the format", body: 'Say exactly how the answer should look: "three bullet points", "JSON with keys name and price", "under 80 words". Formats make answers easy to use and easy to check.', q: "Which instruction controls the format?", opts: ["Be smart", "Reply as JSON with keys name and price", "Think hard"], ans: 1 },
      { title: "Iterate", body: "Treat a prompt like code: change one thing at a time, keep the versions that work, and test with the same inputs each time." }
    ]),
    C("sell-safely", "Selling and buying safely in Fyrus", "How escrow works, how to spot a scam, and what to do if a deal goes wrong.", ["Escrow", "Trust & safety", "Customer care"], "Beginner", [
      { title: "Escrow in one minute", body: "When a buyer pays, the money waits in the Central Bank escrow. The seller is paid when the digital file is delivered or the parcel arrives, after a short inspection window. Neither side can run away with the money.", q: "Where does the money wait during a deal?", opts: ["In the seller's wallet", "In Central Bank escrow", "Nowhere"], ans: 1 },
      { title: "Spotting a scam", body: 'Red flags: someone asks you to pay outside Fyrus, sends a link to "verify" your account, asks for a password or card number, or pushes you to hurry. Fyrus staff never ask for passwords.', q: "Which one is a red flag?", opts: ["A clear product photo", "A request to pay outside Fyrus", "A delivery date"], ans: 1 },
      { title: "When something goes wrong", body: "Keep the conversation inside Fyrus, take screenshots, and file a case at the Law & Court office within the inspection window. The court can freeze the payment and refund the buyer when the seller did not deliver." }
    ])
  ];
  return { inst: { [ACADEMY]: inst }, teachers: { [ACADEMY]: t }, courses: Object.fromEntries(courses.map((c) => [c.id, c])) };
}
function createEdu(d) {
  if (!d.db.edu) {
    d.db.edu = { ...seed(), enr: {}, certs: {}, earn: {}, secret: crypto.randomBytes(32).toString("hex") };
    d.save();
  }
  const E2 = d.db.edu;
  const SECRET = process.env.CERT_SECRET || E2.secret;
  const sign = (c) => crypto.createHmac("sha256", SECRET).update(JSON.stringify([c.code, c.student, c.studentName, c.teacher, c.teacherName, c.instName || "", c.course, c.courseTitle, c.skills, c.level, c.lessons, c.issuedAt])).digest("hex").slice(0, 32);
  const valid = (c) => !!c && c.sig === sign(c);
  const forStudent = (c) => ({ ...c, lessons: c.lessons.map((l) => ({ title: l.title, body: l.body, video: l.video, q: l.q, opts: l.opts })) });
  const nameOf2 = (id) => id === ACADEMY ? E2.teachers[ACADEMY].name : d.db.users[id]?.name || "Citizen";
  const canTeachAt = (uid, instId) => !instId || E2.inst[instId] && (E2.inst[instId].owner === uid || E2.inst[instId].staff.includes(uid));
  const changed = () => {
    d.save();
    d.broadcast({ t: "edu_changed" });
  };
  function issue(en, by) {
    const c = E2.courses[en.course];
    if (!c) return "No such course.";
    if (c.teacher !== by) return "Only the teacher of this course can issue its certificate.";
    if (!en.completedAt) return "The student has not finished every lesson yet.";
    if (en.cert && E2.certs[en.cert]) return E2.certs[en.cert];
    const i = c.inst ? E2.inst[c.inst] : void 0;
    const base = { code: newCode(), student: en.user, studentName: d.db.users[en.user]?.name || en.userName, teacher: c.teacher, teacherName: nameOf2(c.teacher), inst: i?.id, instName: i?.name, instType: i?.type, instVerified: i?.verified, course: c.id, courseTitle: c.title, skills: c.skills, level: c.level, lessons: c.lessons.length, issuedAt: Date.now() };
    const cert = { ...base, sig: sign(base) };
    E2.certs[cert.code] = cert;
    en.cert = cert.code;
    d.save();
    d.news?.("education", `Certificate issued: "${c.title}"${i ? ` at ${i.name}` : ""}`);
    const l = d.liveOf(en.user);
    if (l) d.send(l.ws, { t: "edu_certified", cert });
    return cert;
  }
  function mine(uid) {
    const teaching = Object.values(E2.courses).filter((c) => c.teacher === uid);
    const ids = new Set(teaching.map((c) => c.id));
    const earn = E2.earn[uid] || 0;
    if (earn) {
      E2.earn[uid] = 0;
      d.save();
    }
    return {
      t: "edu_mine",
      teacher: E2.teachers[uid] || null,
      enr: Object.values(E2.enr).filter((e) => e.user === uid),
      certs: Object.values(E2.certs).filter((c) => c.student === uid),
      inst: Object.values(E2.inst).filter((i) => i.owner === uid || i.staff.includes(uid)),
      teaching,
      students: Object.values(E2.enr).filter((e) => ids.has(e.course)).map((e) => ({ ...e, total: E2.courses[e.course].lessons.length })),
      earn
    };
  }
  function onMessage2(me, m) {
    if (typeof m.t !== "string" || !m.t.startsWith("edu_")) return false;
    const u = me.u;
    const reply = (x) => d.send(me.ws, x);
    const err = (text) => reply({ t: "err", text });
    switch (m.t) {
      case "edu_list":
        reply({ t: "edu_list", inst: Object.values(E2.inst), teachers: Object.values(E2.teachers), courses: Object.values(E2.courses).map(forStudent) });
        return true;
      case "edu_mine":
        reply(mine(u.id));
        return true;
      case "edu_teacher": {
        const subject = d.clean(m.subject, 60), bio = d.clean(m.bio, 400);
        if (!subject) {
          err("Add the subject you teach.");
          return true;
        }
        E2.teachers[u.id] = { id: u.id, name: u.name, subject, bio, at: E2.teachers[u.id]?.at || Date.now() };
        changed();
        reply(mine(u.id));
        return true;
      }
      case "edu_inst": {
        const type = TYPES.includes(m.type) ? m.type : null;
        const name = d.clean(m.name, 60);
        if (!type || name.length < 3) {
          err("Pick a type and a name of at least 3 letters.");
          return true;
        }
        if (Object.values(E2.inst).filter((i2) => i2.owner === u.id).length >= 3) {
          err("You can register up to 3 institutions.");
          return true;
        }
        if (Object.values(E2.inst).some((i2) => i2.name.toLowerCase() === name.toLowerCase())) {
          err("That name is already registered.");
          return true;
        }
        const i = { id: "i" + d.rid(6), owner: u.id, type, name, tagline: d.clean(m.tagline, 120), color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#2f6fe0", staff: [u.id], verified: false, at: Date.now() };
        E2.inst[i.id] = i;
        if (!E2.teachers[u.id]) E2.teachers[u.id] = { id: u.id, name: u.name, subject: type === "school" ? "School teacher" : "Instructor", bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        return true;
      }
      case "edu_staff": {
        const i = E2.inst[m.inst];
        if (!i || i.owner !== u.id) {
          err("Only the owner can add teachers.");
          return true;
        }
        const x = d.findByNumber(String(m.number || ""));
        if (!x) {
          err("No citizen has that number.");
          return true;
        }
        if (!i.staff.includes(x.id)) i.staff.push(x.id);
        if (!E2.teachers[x.id]) E2.teachers[x.id] = { id: x.id, name: x.name, subject: `Teacher at ${i.name}`, bio: "", at: Date.now() };
        changed();
        reply(mine(u.id));
        const l = d.liveOf(x.id);
        if (l) d.send(l.ws, { t: "note", text: `${u.name} added you as a teacher at ${i.name}.` });
        return true;
      }
      case "edu_course": {
        if (!E2.teachers[u.id]) {
          err("Register as a teacher first.");
          return true;
        }
        const instId = m.inst ? String(m.inst) : void 0;
        if (!canTeachAt(u.id, instId)) {
          err("You do not teach at that institution.");
          return true;
        }
        const lessons = (Array.isArray(m.lessons) ? m.lessons : []).slice(0, 30).map((l) => {
          const opts = Array.isArray(l.opts) ? l.opts.map((o) => d.clean(o, 120)).filter(Boolean).slice(0, 5) : void 0;
          const q = d.clean(l.q, 200);
          const video = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)\//.test(String(l.video || "")) ? d.clean(l.video, 200) : void 0;
          return { title: d.clean(l.title, 80), body: String(l.body || "").replace(/[\u0000-\u0008\u000b-\u001f]/g, " ").slice(0, 4e3), video, ...q && opts && opts.length >= 2 ? { q, opts, ans: Math.max(0, Math.min(opts.length - 1, Math.round(+l.ans || 0))) } : {} };
        }).filter((l) => l.title && l.body);
        const title = d.clean(m.title, 80);
        if (title.length < 4 || !lessons.length) {
          err("A course needs a title and at least one lesson.");
          return true;
        }
        const old = m.id ? E2.courses[m.id] : void 0;
        if (old && old.teacher !== u.id) {
          err("That is not your course.");
          return true;
        }
        const i = instId ? E2.inst[instId] : void 0;
        const c = { id: old?.id || "c" + d.rid(6), teacher: u.id, teacherName: u.name, inst: i?.id, instName: i?.name, title, summary: d.clean(m.summary, 300), skills: (Array.isArray(m.skills) ? m.skills : String(m.skills || "").split(",")).map((s) => d.clean(s, 30)).filter(Boolean).slice(0, 6), level: ["Beginner", "Intermediate", "Advanced"].includes(m.level) ? m.level : "Beginner", fee: Math.max(0, Math.min(1e5, Math.round(+m.fee || 0))), lessons, students: old?.students || 0, at: old?.at || Date.now() };
        E2.courses[c.id] = c;
        changed();
        if (!old) d.news?.("education", `New course in Education City: "${c.title}"${c.fee ? "" : " (free)"}`);
        reply(mine(u.id));
        reply({ t: "ok", text: old ? "Course updated." : "Course published in Education City." });
        return true;
      }
      case "edu_enroll": {
        const c = E2.courses[m.course];
        if (!c) {
          err("No such course.");
          return true;
        }
        if (c.teacher === u.id) {
          err("You teach this course.");
          return true;
        }
        const k = c.id + "|" + u.id;
        if (E2.enr[k]) {
          reply(mine(u.id));
          return true;
        }
        if (c.fee > 0 && c.teacher !== ACADEMY) {
          if (d.pay) {
            const share = Math.round(c.fee * 0.9 * 100) / 100;
            if (!d.pay(u.id, c.teacher, share, `Course fee: ${c.title}`)) {
              err("Not enough FYC for this course.");
              return true;
            }
            d.pay(u.id, "treasury", Math.round((c.fee - share) * 100) / 100, `Education levy 10%: ${c.title}`);
          } else E2.earn[c.teacher] = (E2.earn[c.teacher] || 0) + Math.round(c.fee * 0.9);
        }
        E2.enr[k] = { course: c.id, user: u.id, userName: u.name, at: Date.now(), done: [] };
        c.students++;
        {
          const l = d.liveOf(c.teacher);
          if (l) d.send(l.ws, mine(c.teacher));
        }
        d.save();
        reply(mine(u.id));
        return true;
      }
      case "edu_done": {
        const c = E2.courses[m.course];
        const en = c && E2.enr[c.id + "|" + u.id];
        const i = Math.round(+m.lesson);
        if (!c || !en || !(i >= 0 && i < c.lessons.length)) {
          err("Enrol in the course first.");
          return true;
        }
        const L = c.lessons[i];
        if (L.q && L.ans !== void 0 && Math.round(+m.answer) !== L.ans) {
          reply({ t: "edu_wrong", course: c.id, lesson: i });
          return true;
        }
        if (!en.done.includes(i)) en.done.push(i);
        if (!en.completedAt && en.done.length >= c.lessons.length) {
          en.completedAt = Date.now();
          const tl = d.liveOf(c.teacher);
          if (tl) {
            d.send(tl.ws, { t: "note", text: `${u.name} finished "${c.title}". You can issue the certificate.` });
            d.send(tl.ws, mine(c.teacher));
          }
          if (c.teacher === ACADEMY) issue(en, ACADEMY);
        }
        d.save();
        reply(mine(u.id));
        return true;
      }
      case "edu_issue": {
        const en = E2.enr[String(m.course) + "|" + String(m.student)];
        if (!en) {
          err("That student is not enrolled.");
          return true;
        }
        const r = issue(en, u.id);
        if (typeof r === "string") err(r);
        else {
          reply({ t: "ok", text: `Certificate ${r.code} issued to ${r.studentName}.` });
          reply(mine(u.id));
        }
        return true;
      }
      case "edu_verify": {
        const c = E2.certs[d.clean(m.code, 20).toUpperCase()];
        reply({ t: "edu_cert", code: m.code, cert: c && valid(c) ? c : null });
        return true;
      }
    }
    return true;
  }
  const esc = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  function http2(path3, res) {
    const mm = path3.match(/^\/(verify|api\/cert)\/([A-Za-z0-9-]{6,20})\/?$/);
    if (!mm) return false;
    const c = E2.certs[mm[2].toUpperCase()];
    const ok = valid(c);
    if (mm[1] === "api/cert") {
      res.writeHead(ok ? 200 : 404, { "content-type": "application/json", "access-control-allow-origin": "*" });
      res.end(JSON.stringify(ok ? { valid: true, cert: { ...c, sig: void 0 } } : { valid: false }));
      return true;
    }
    const date = ok ? new Date(c.issuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "";
    const body = ok ? `<div class="ok">\u2713 Valid certificate</div><h1>${esc(c.courseTitle)}</h1><p class="who">Awarded to <b>${esc(c.studentName)}</b></p>
      <dl><dt>Issued by</dt><dd>${esc(c.teacherName)}</dd><dt>Institution</dt><dd>${c.instName ? esc(c.instName) + (c.instType ? ` (${c.instType})` : "") + (c.instVerified ? " \xB7 verified by the Ministry of Education" : " \xB7 registered") : "Independent teacher"}</dd>
      <dt>Skills</dt><dd>${c.skills.map(esc).join(", ") || "\u2014"}</dd><dt>Level</dt><dd>${esc(c.level)} \xB7 ${c.lessons} lessons completed</dd><dt>Date</dt><dd>${date}</dd><dt>Code</dt><dd><code>${esc(c.code)}</code></dd></dl>
      <p class="note">This is a Fyrus course-completion certificate issued by the teacher named above. It is not a government degree.</p>` : `<div class="bad">\u2715 Not found</div><h1>No valid certificate with this code</h1><p class="note">Check the code for typos. Codes look like FC-XXXX-XXXX-XXXX.</p>`;
    res.writeHead(ok ? 200 : 404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-cache", "X-Content-Type-Options": "nosniff" });
    res.end(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificate check \xB7 Fyrus</title><style>
      body{margin:0;font:16px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;background:#0b1220;color:#e8edf5;display:grid;place-items:center;min-height:100vh;padding:16px;box-sizing:border-box}
      .card{max-width:560px;width:100%;background:#121a2b;border:1px solid #2a3550;border-radius:16px;padding:28px}.brand{color:#ffc27a;font:700 13px ui-monospace,monospace;letter-spacing:.12em}
      h1{font-size:24px;margin:.4em 0}.ok{color:#45e0ae;font-weight:700}.bad{color:#ff7a8a;font-weight:700}.who{font-size:18px}dl{display:grid;grid-template-columns:120px 1fr;gap:6px 12px;margin:18px 0}dt{color:#8a96ad}dd{margin:0}
      .note{color:#8a96ad;font-size:13px}a{color:#7fb8ff}code{background:#0b1220;padding:2px 6px;border-radius:6px}</style></head>
      <body><main class="card"><div class="brand">REPUBLIC OF FYRUS \xB7 MINISTRY OF EDUCATION</div>${body}<p><a href="/">Visit Fyrus</a></p></main></body></html>`);
    return true;
  }
  return { onMessage: onMessage2, http: http2 };
}

