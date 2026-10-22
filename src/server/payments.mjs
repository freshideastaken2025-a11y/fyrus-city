
// --- Payments (v46): one direction only — citizens buy FYC packs from Fyrus. Off until the owner adds merchant keys. ---
// Provider: Paddle Billing (merchant of record). Set in Coolify:
//   PAY_PROVIDER=paddle
//   PADDLE_API_KEY=...            (Paddle > Developer tools > Authentication)
//   PADDLE_WEBHOOK_SECRET=...     (Paddle > Developer tools > Notifications, destination https://fyrus.io/api/pay/paddle)
//   PADDLE_ENV=sandbox | live     (start with sandbox keys to test, then live)
//   PADDLE_PRICES=fyc_s:pri_...,fyc_m:pri_...,fyc_l:pri_...   (one Paddle price per pack)
//   PADDLE_CLIENT_TOKEN=...       (Paddle > Developer tools > Authentication > client-side token; used by /pay.html)
// In Paddle > Checkout settings set the default payment link to https://fyrus.io/pay.html and approve fyrus.io.
// Optional: PAY_PACKS='[{"id":"fyc_s","fyc":5000,"label":"Starter","price":"$1.99"}, ...]' to change packs.
// FYC is credited only by the signed webhook (never by the browser), once per Paddle transaction id.
// No cash-out and no user-to-user real money. Other providers (JazzCash, Easypaisa, Safepay) plug in as another
// entry in PROVIDERS with the same three functions: ready(), checkout(order), webhook(req, raw) -> {orderId, txn, paid}.
var PAY_DEFAULT_PACKS = [
  { id: "fyc_s", fyc: 5e3, label: "Starter pack", price: "$1.99" },
  { id: "fyc_m", fyc: 15e3, label: "Citizen pack", price: "$4.99", best: true },
  { id: "fyc_l", fyc: 4e4, label: "Grand pack", price: "$9.99" }
];
function createPayments(d) {
  if (!d.db.pay) {
    d.db.pay = { orders: {}, done: {} };
    d.save();
  }
  const P = d.db.pay;
  const env = process.env;
  let PACKS = PAY_DEFAULT_PACKS;
  try {
    if (env.PAY_PACKS) PACKS = JSON.parse(env.PAY_PACKS).filter((p) => p && p.id && +p.fyc > 0).map((p) => ({ id: String(p.id), fyc: +p.fyc, label: String(p.label || p.id), price: String(p.price || ""), best: !!p.best }));
  } catch {
    console.error("PAY_PACKS is not valid JSON; using the default packs");
  }
  const prices = {};
  String(env.PADDLE_PRICES || "").split(",").forEach((x) => {
    const [k, v] = x.split(":").map((s) => (s || "").trim());
    if (k && v) prices[k] = v;
  });
  const paddleBase = String(env.PADDLE_ENV || "sandbox").toLowerCase() === "live" ? "https://api.paddle.com" : "https://sandbox-api.paddle.com";
  const PROVIDERS = {
    paddle: {
      ready: () => !!(env.PADDLE_API_KEY && env.PADDLE_WEBHOOK_SECRET && env.PADDLE_CLIENT_TOKEN && PACKS.some((p) => prices[p.id])),
      async checkout(o) {
        const r = await fetch(paddleBase + "/transactions", {
          method: "POST",
          headers: { authorization: `Bearer ${env.PADDLE_API_KEY}`, "content-type": "application/json" },
          body: JSON.stringify({ items: [{ price_id: prices[o.pack], quantity: 1 }], custom_data: { fyrus_order: o.id, fyrus_user: o.uid }, collection_mode: "automatic" })
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error("Paddle " + r.status + " " + (j.error?.detail || j.error?.code || ""));
        o.txn = j.data?.id || "";
        return { url: j.data?.checkout?.url || "", txn: o.txn, clientToken: env.PADDLE_CLIENT_TOKEN || "", env: paddleBase.includes("sandbox") ? "sandbox" : "production" };
      },
      webhook(req, raw) {
        const sig = String(req.headers["paddle-signature"] || "");
        const parts = Object.fromEntries(sig.split(";").map((kv) => kv.split("=")));
        if (!parts.ts || !parts.h1) return null;
        if (Math.abs(Date.now() / 1e3 - +parts.ts) > 600) return null;
        const want = crypto3.createHmac("sha256", env.PADDLE_WEBHOOK_SECRET).update(parts.ts + ":" + raw).digest("hex");
        const a = Buffer.from(want), b = Buffer.from(String(parts.h1));
        if (a.length !== b.length || !crypto3.timingSafeEqual(a, b)) return null;
        let ev;
        try {
          ev = JSON.parse(raw);
        } catch {
          return null;
        }
        const data = ev.data || {};
        return { orderId: data.custom_data?.fyrus_order || "", txn: data.id || "", paid: ev.event_type === "transaction.completed" || ev.event_type === "transaction.paid", type: ev.event_type || "" };
      }
    }
  };
  const provName = String(env.PAY_PROVIDER || "").toLowerCase();
  const prov = PROVIDERS[provName] || null;
  const live = () => !!(prov && prov.ready());
  const json = (res, code, v) => {
    res.writeHead(code, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify(v));
  };
  function readRaw(req, max, cb) {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > max) req.destroy();
    });
    req.on("end", () => cb(raw));
  }
  function credit(o, txn, how) {
    if (o.status === "paid") return false;
    if (txn && P.done[txn]) return false;
    const pack = PACKS.find((p) => p.id === o.pack);
    if (!pack || !d.db.users[o.uid]) return false;
    o.status = "paid";
    o.paidAt = Date.now();
    o.txn = txn || o.txn;
    if (txn) P.done[txn] = o.id;
    d.bank.transfer("mint", o.uid, pack.fyc, `Bought ${pack.label} (${pack.fyc.toLocaleString("en")} FYC) \xB7 ${how} ${o.txn || o.id}`);
    const l = d.liveOf(o.uid);
    if (l) d.send(l.ws, { t: "note", text: `Thank you! ${pack.fyc.toLocaleString("en")} FYC were added to your wallet.` });
    d.save();
    return true;
  }
  const keepOrders = () => {
    const ids = Object.keys(P.orders);
    if (ids.length > 2e4) ids.sort((a, b) => P.orders[a].at - P.orders[b].at).slice(0, ids.length - 2e4).forEach((k) => delete P.orders[k]);
  };
  const buyHits = /* @__PURE__ */ new Map();
  function http2(req, res, p, ip, auth) {
    if (!p.startsWith("/api/pay") && p !== "/api/admin/pay") return false;
    if (p === "/api/pay/config") return json(res, 200, { live: live(), provider: live() ? provName : "", clientToken: live() && provName === "paddle" ? env.PADDLE_CLIENT_TOKEN : "", env: paddleBase.includes("sandbox") ? "sandbox" : "production", packs: PACKS.map((x) => ({ ...x, ready: !prov || provName !== "paddle" || !!prices[x.id] })), note: live() ? "" : "Payments open soon." }), true;
    if (p === "/api/pay/buy" && req.method === "POST") {
      readRaw(req, 1024, async (raw) => {
        let b = {};
        try {
          b = JSON.parse(raw || "{}");
        } catch {
        }
        const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
        if (!u) return json(res, 401, { error: "Enter Fyrus first." });
        if (!live()) return json(res, 503, { error: "Payments open soon." });
        if (u.banned && u.banned.until > Date.now()) return json(res, 403, { error: "This account is suspended." });
        const pack = PACKS.find((x) => x.id === String(b.pack || ""));
        if (!pack || (provName === "paddle" && !prices[pack.id])) return json(res, 400, { error: "Unknown pack." });
        const now = Date.now();
        const hits = (buyHits.get(u.id) || []).filter((t) => now - t < 36e5);
        if (hits.length >= 12) return json(res, 429, { error: "Too many checkouts in an hour. Please wait a little." });
        hits.push(now);
        buyHits.set(u.id, hits);
        if (buyHits.size > 1e4) buyHits.clear();
        const o = { id: "O" + crypto3.randomBytes(6).toString("hex"), uid: u.id, pack: pack.id, fyc: pack.fyc, price: pack.price, at: now, status: "open", provider: provName };
        try {
          const c = await prov.checkout(o);
          P.orders[o.id] = o;
          keepOrders();
          d.save();
          json(res, 200, { ok: true, order: o.id, ...c });
        } catch (e) {
          console.error("checkout failed", e.message);
          json(res, 502, { error: "The payment service did not answer. Please try again in a minute." });
        }
      });
      return true;
    }
    if (p === "/api/pay/status") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      const id = new URL(req.url || "/", "http://x").searchParams.get("order") || "";
      const o = P.orders[id];
      if (!u || !o || o.uid !== u.id) return json(res, 404, { error: "Not found" }), true;
      return json(res, 200, { status: o.status, fyc: o.fyc }), true;
    }
    if (p === "/api/pay/mine") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      if (!u) return json(res, 200, { list: [] }), true;
      return json(res, 200, { list: Object.values(P.orders).filter((o) => o.uid === u.id && o.status === "paid").sort((a, b) => b.at - a.at).slice(0, 30).map((o) => ({ id: o.id, at: o.paidAt, fyc: o.fyc, price: o.price })) }), true;
    }
    if (p === "/api/pay/" + provName && req.method === "POST" && prov) {
      readRaw(req, 65536, (raw) => {
        const ev = prov.ready() ? prov.webhook(req, raw) : null;
        if (!ev) return json(res, 400, { error: "bad signature" });
        if (ev.paid) {
          const o = P.orders[ev.orderId];
          if (o) credit(o, ev.txn, provName);
          else console.error("payment for unknown order", ev.orderId, ev.txn);
        }
        json(res, 200, { ok: true });
      });
      return true;
    }
    if (p === "/api/admin/pay") {
      const u = auth(String(req.headers.authorization || "").replace(/^Bearer\s+/i, ""));
      if (!u || !d.isAdmin(u.id)) return json(res, 403, { error: "Judges only" }), true;
      const all = Object.values(P.orders);
      const paid = all.filter((o) => o.status === "paid");
      return json(res, 200, { live: live(), provider: provName || "", env: provName === "paddle" ? (paddleBase.includes("sandbox") ? "sandbox" : "live") : "", missing: provName === "paddle" ? ["PADDLE_API_KEY", "PADDLE_WEBHOOK_SECRET", "PADDLE_CLIENT_TOKEN"].filter((k) => !env[k]).concat(PACKS.filter((x) => !prices[x.id]).map((x) => "price for " + x.id)) : ["PAY_PROVIDER"], orders: all.length, paid: paid.length, fycSold: paid.reduce((s, o) => s + o.fyc, 0), last: paid.sort((a, b) => b.paidAt - a.paidAt).slice(0, 20).map((o) => ({ id: o.id, at: o.paidAt, who: d.db.users[o.uid]?.number || "", fyc: o.fyc, price: o.price, txn: o.txn })) }), true;
    }
    return json(res, 404, { error: "Not found" }), true;
  }
  return { http: http2, live, PACKS };
}
