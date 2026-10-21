// server/accounts.ts
import crypto2 from "node:crypto";
var GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || "";
var RESEND = process.env.RESEND_API_KEY || "";
var MAIL_FROM = process.env.MAIL_FROM || "";
var MAX_TOKENS = 10;
var hashPw = (pw) => {
  const salt = crypto2.randomBytes(16).toString("hex");
  return salt + ":" + crypto2.scryptSync(pw, salt, 32).toString("hex");
};
var checkPw = (pw, stored) => {
  if (!stored) return false;
  const [salt, h] = stored.split(":");
  const a = Buffer.from(h, "hex"), b = crypto2.scryptSync(pw, salt, 32);
  return a.length === b.length && crypto2.timingSafeEqual(a, b);
};
var normEmail = (e) => String(e || "").trim().toLowerCase().slice(0, 120);
var okEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function createAccounts(d) {
  const byEmail = (e) => Object.values(d.db.users).find((u) => u.email === e);
  const byToken = (token) => {
    if (!token) return void 0;
    const h = d.sha(String(token));
    return Object.values(d.db.users).find((u) => u.tok === h || u.toks?.includes(h));
  };
  const issue = (u) => {
    const token = d.rid(24);
    const h = d.sha(token);
    u.toks = [...(u.toks || []).filter((t) => t !== h), h].slice(-MAX_TOKENS);
    if (!u.tok) u.tok = h;
    d.save();
    return token;
  };
  const banText = (u) => u.banned && u.banned.until > Date.now() ? `This account is suspended${u.banned.until < 8e15 ? ` until ${new Date(u.banned.until).toUTCString().slice(5, 22)} UTC` : ""}: ${u.banned.reason}` : "";
  const pub2 = (u, token) => ({ ok: true, token, user: { id: u.id, name: u.name, number: u.number, email: u.email || null, google: !!u.google } });
  const hits = /* @__PURE__ */ new Map();
  const limited = (ip, max = 12) => {
    const now = Date.now();
    const a = (hits.get(ip) || []).filter((t) => now - t < 6e4);
    a.push(now);
    hits.set(ip, a);
    if (hits.size > 5e3) hits.clear();
    return a.length > max;
  };
  async function sendMail(to, subject, text) {
    if (!RESEND || !MAIL_FROM) return false;
    try {
      const r = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${RESEND}`, "content-type": "application/json" }, body: JSON.stringify({ from: MAIL_FROM, to, subject, text }) });
      if (!r.ok) console.error("mail", r.status, (await r.text()).slice(0, 200));
      return r.ok;
    } catch (e) {
      console.error("mail failed", e);
      return false;
    }
  }
  async function handle(path3, body, ip) {
    if (path3 === "/api/auth/config") return { status: 200, json: { google: GOOGLE_ID || null, reset: !!(RESEND && MAIL_FROM) } };
    if (!path3.startsWith("/api/auth/")) return null;
    if (limited(ip)) return { status: 429, json: { error: "Too many tries. Wait a minute and try again." } };
    const fail = (error, status = 400) => ({ status, json: { error } });
    switch (path3) {
      case "/api/auth/register": {
        const email = normEmail(body.email);
        const pw = String(body.password || "");
        const name = d.clean(body.name, 24);
        if (!okEmail(email)) return fail("Enter a valid email, like you@example.com");
        if (pw.length < 8) return fail("Use at least 8 characters for your password.");
        if (body.age13 !== true) return fail("You must be 13 or older to use Fyrus.");
        if (byEmail(email)) return fail("An account with this email already exists. Log in instead.");
        let u = body.token ? byToken(String(body.token)) : void 0;
        if (u && (u.email || u.google)) u = void 0;
        let token = "";
        if (!u) {
          const c = d.createUser(name || email.split("@")[0], "en");
          u = c.u;
          token = c.token;
          u.toks = [u.tok];
        } else token = String(body.token);
        if (banText(u)) return fail(banText(u), 403);
        u.email = email;
        u.pw = hashPw(pw);
        u.age13 = true;
        if (name) u.name = name;
        d.save();
        return { status: 200, json: pub2(u, token) };
      }
      case "/api/auth/login": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        if (!u || !checkPw(String(body.password || ""), u.pw)) return fail("Wrong email or password.", 401);
        if (banText(u)) return fail(banText(u), 403);
        return { status: 200, json: pub2(u, issue(u)) };
      }
      case "/api/auth/google": {
        if (!GOOGLE_ID) return fail("Google sign-in is not set up on this server yet.", 501);
        let info;
        try {
          const r = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(String(body.credential || "")));
          info = await r.json();
          if (!r.ok) throw new Error();
        } catch {
          return fail("Google could not confirm this sign-in. Try again.", 401);
        }
        if (info.aud !== GOOGLE_ID || !["accounts.google.com", "https://accounts.google.com"].includes(info.iss) || String(info.email_verified) !== "true") return fail("Google sign-in was not valid.", 401);
        const email = normEmail(info.email);
        let u = Object.values(d.db.users).find((x) => x.google === info.sub) || byEmail(email);
        let token = "";
        if (!u) {
          const guest = body.token ? byToken(String(body.token)) : void 0;
          if (guest && !guest.email && !guest.google) {
            u = guest;
            token = String(body.token);
          } else {
            const c = d.createUser(d.clean(info.given_name || info.name, 24) || email.split("@")[0], "en");
            u = c.u;
            token = c.token;
            u.toks = [u.tok];
          }
        }
        if (banText(u)) return fail(banText(u), 403);
        if (body.age13 !== true && !u.age13) return fail("Please confirm you are 13 or older.", 400);
        u.google = info.sub;
        u.email = u.email || email;
        u.age13 = true;
        d.save();
        return { status: 200, json: pub2(u, token || issue(u)) };
      }
      case "/api/auth/reset-request": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        if (!RESEND || !MAIL_FROM) return fail("Password reset by email is not set up yet. Contact support from the Help page.", 501);
        if (u && u.pw) {
          const code = String(crypto2.randomInt(1e5, 1e6));
          u.reset = { code: d.sha(code), until: Date.now() + 15 * 6e4, tries: 0 };
          d.save();
          await sendMail(email, "Your Fyrus reset code", `Your Fyrus password reset code is ${code}. It works for 15 minutes. If you did not ask for it, ignore this email.`);
        }
        return { status: 200, json: { ok: true } };
      }
      case "/api/auth/reset": {
        const email = normEmail(body.email);
        const u = byEmail(email);
        const pw = String(body.password || "");
        if (!u || !u.reset || u.reset.until < Date.now() || u.reset.tries >= 5) return fail("That code has expired. Ask for a new one.");
        if (u.reset.code !== d.sha(String(body.code || "").trim())) {
          u.reset.tries++;
          d.save();
          return fail("That code does not match.");
        }
        if (pw.length < 8) return fail("Use at least 8 characters for your new password.");
        u.pw = hashPw(pw);
        u.reset = void 0;
        u.toks = [];
        u.tok = "";
        d.save();
        return { status: 200, json: pub2(u, issue(u)) };
      }
      case "/api/auth/logout": {
        const u = byToken(String(body.token || ""));
        if (u) {
          const h = d.sha(String(body.token));
          u.toks = (u.toks || []).filter((t) => t !== h);
          if (u.tok === h) u.tok = u.toks[0] || "";
          d.save();
        }
        return { status: 200, json: { ok: true } };
      }
    }
    return fail("Not found", 404);
  }
  function http2(req, res, path3, ip) {
    if (!path3.startsWith("/api/auth/")) return false;
    const done = (r) => {
      res.writeHead(r?.status || 404, { "content-type": "application/json", "cache-control": "no-store" });
      res.end(JSON.stringify(r?.json || { error: "Not found" }));
    };
    if (req.method === "GET") {
      handle(path3, {}, ip).then(done);
      return true;
    }
    if (req.method !== "POST") {
      done({ status: 405, json: { error: "POST only" } });
      return true;
    }
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 16384) req.destroy();
    });
    req.on("end", () => {
      let body = {};
      try {
        body = JSON.parse(raw || "{}");
      } catch {
        return done({ status: 400, json: { error: "Bad request" } });
      }
      handle(path3, body, ip).then(done).catch((e) => {
        console.error("auth", e);
        done({ status: 500, json: { error: "Server error" } });
      });
    });
    return true;
  }
  return { http: http2, handle, byToken, banText, issue };
}

