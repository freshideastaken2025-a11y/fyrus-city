function vB() {
  let t = Y(),
    [e, a] = (0, go.useState)(""),
    [r, o] = (0, go.useState)(""),
    [n, i] = (0, go.useState)(""),
    s = t.orders.filter((l) => l.buyerId === t.session?.userId || l.sellerId === t.session?.userId);
  return (0, G.jsxs)("div", {
    className: "space-y-2",
    children: [
      (0, G.jsxs)("div", {
        className: "card p-3",
        children: [
          (0, G.jsxs)("div", {
            className: "font-bold text-sm",
            children: [
              (0, G.jsx)(yr, { className: "inline", style: { color: "#45e0ae" } }),
              " Zero-scam promise",
            ],
          }),
          (0, G.jsx)("div", {
            className: "text-[11px] mt-1",
            style: ga,
            children:
              "Every payment in Fyrus waits in escrow until the buyer confirms. If something goes wrong, file a case: the money stays frozen while the Justice ministry decides, and a proven scam means a refund and a permanent ban.",
          }),
        ],
      }),
      (0, G.jsx)("div", { className: "font-bold text-sm", children: "Constitution of Fyrus" }),
      (0, G.jsx)("ol", {
        className: "space-y-1.5",
        children: Xw.map((l) =>
          (0, G.jsxs)(
            "li",
            {
              className: "rounded-lg p-2",
              style: { border: "1px solid var(--line)" },
              children: [
                (0, G.jsxs)("div", {
                  className: "text-[12px] font-bold",
                  children: ["Article ", l.n, ". ", l.title],
                }),
                (0, G.jsx)("div", { className: "text-[11px]", style: ga, children: l.text }),
              ],
            },
            l.n,
          ),
        ),
      }),
      (0, G.jsx)("div", { className: "font-bold text-sm pt-1", children: "Fyrus Court \xB7 file a case" }),
      (0, G.jsxs)("div", {
        className: "space-y-1.5",
        children: [
          (0, G.jsx)("input", {
            className: "field py-2 text-sm",
            value: e,
            onChange: (l) => a(l.target.value),
            placeholder: "Against (name or shop number)",
            maxLength: 60,
          }),
          s.length > 0 &&
            (0, G.jsxs)("select", {
              className: "field py-2 text-sm",
              value: n,
              onChange: (l) => i(l.target.value),
              children: [
                (0, G.jsx)("option", { value: "", children: "No order linked" }),
                s.map((l) =>
                  (0, G.jsxs)(
                    "option",
                    { value: l.id, children: [l.kind, " order \xB7 ", q(l.amount), " \xB7 ", l.status] },
                    l.id,
                  ),
                ),
              ],
            }),
          (0, G.jsx)("textarea", {
            className: "field text-sm",
            value: r,
            onChange: (l) => o(l.target.value),
            placeholder: "What happened?",
            maxLength: 400,
          }),
          (0, G.jsxs)("button", {
            className: "btn btn-primary btn-sm",
            onClick: () => {
              (E8(e, r, n || void 0), o(""));
            },
            children: [(0, G.jsx)(Ei, {}), " File case"],
          }),
        ],
      }),
      t.cases.length > 0 &&
        (0, G.jsx)("div", {
          className: "space-y-1",
          children: t.cases.map((l) =>
            (0, G.jsxs)(
              "div",
              {
                className: "rounded-lg p-2 text-[12px]",
                style: { border: "1px solid var(--line)" },
                children: [
                  (0, G.jsx)("b", { children: l.against }),
                  " \xB7 ",
                  l.status,
                  " \xB7 ",
                  new Date(l.at).toLocaleDateString(),
                  (0, G.jsx)("div", { style: ga, children: l.reason }),
                ],
              },
              l.id,
            ),
          ),
        }),
    ],
  });
}
var jn = P(Zt(), 1);
var xB = { iceServers: [{ urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] }] },
  N0 = null;
async function m9() {
  return (
    (N0 && N0.getAudioTracks().some((t) => t.readyState === "live")) ||
      (N0 = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: !0, noiseSuppression: !0, autoGainControl: !0 },
      })),
    N0
  );
}
var R0 = class {
    constructor(e, a) {
      this.peer = e;
      this.kind = a;
      this.closed = !1;
      this.remoteSet = !1;
      this.queue = [];
      ((this.pc = new RTCPeerConnection(xB)),
        (this.audio = new Audio()),
        (this.audio.autoplay = !0),
        (this.audio.playsInline = !0),
        (this.pc.ontrack = (r) => {
          ((this.audio.srcObject = r.streams[0]), this.audio.play().catch(() => {}));
        }),
        (this.pc.onicecandidate = (r) => {
          r.candidate && O.send({ t: "rtc", to: e, kind: a + "-ice", data: r.candidate.toJSON() });
        }),
        (this.pc.onconnectionstatechange = () => {
          ["failed", "closed"].includes(this.pc.connectionState) && this.close();
        }));
    }
    async addMic() {
      let e = await m9();
      e.getTracks().forEach((a) => this.pc.addTrack(a, e));
    }
    async offer() {
      await this.addMic();
      let e = await this.pc.createOffer();
      (await this.pc.setLocalDescription(e),
        O.send({ t: "rtc", to: this.peer, kind: this.kind + "-offer", data: e }));
    }
    async setRemote(e) {
      (await this.pc.setRemoteDescription(e), (this.remoteSet = !0));
      for (let a of this.queue.splice(0))
        try {
          await this.pc.addIceCandidate(a);
        } catch {}
    }
    async addIce(e) {
      if (!this.remoteSet) {
        this.queue.push(e);
        return;
      }
      try {
        await this.pc.addIceCandidate(e);
      } catch {}
    }
    async answer(e) {
      (await this.addMic(), await this.setRemote(e));
      let a = await this.pc.createAnswer();
      (await this.pc.setLocalDescription(a),
        O.send({ t: "rtc", to: this.peer, kind: this.kind + "-answer", data: a }));
    }
    close() {
      if (!this.closed) {
        this.closed = !0;
        try {
          this.pc.close();
        } catch {}
        this.audio.srcObject = null;
      }
    }
  },
  Oo = null,
  Ed = null,
  af = [],
  zn = new Map();
async function Cu(t, e, a) {
  if (O.status !== "online") return F("Calls need the live city (fyrus.io).", "warn");
  if (Oo) return F("You are already in a call.", "info");
  try {
    ((Oo = new R0(t, "call")),
      C({ call: { state: "calling", peerId: t, name: e, number: a, at: Date.now() } }),
      await Oo.offer());
  } catch {
    (B0(!1), F("Allow the microphone in your browser to make calls.", "warn"));
  }
}
async function v9() {
  let t = ot().call;
  if (!(!t || !Ed))
    try {
      ((Oo = new R0(t.peerId, "call")),
        Oo.queue.push(...af.splice(0)),
        await Oo.answer(Ed),
        (Ed = null),
        C({ call: { ...t, state: "active", at: Date.now() } }));
    } catch {
      (B0(!0), F("Allow the microphone in your browser to answer calls.", "warn"));
    }
}
function B0(t = !0) {
  let e = ot().call;
  (t && e && O.send({ t: "rtc", to: e.peerId, kind: "call-end" }),
    Oo?.close(),
    (Oo = null),
    (Ed = null),
    (af = []),
    C({ call: null }));
}
function x9(t) {
  N0?.getAudioTracks().forEach((e) => (e.enabled = !t));
}
async function y9(t) {
  if (t && !ot().net.age18) {
    C({ age18Ask: !0 });
    return;
  }
  if (t)
    try {
      await m9();
    } catch {
      return F("Allow the microphone to talk to people near you.", "warn");
    }
  (C({ voiceOn: t }),
    O.send({ t: "voice", on: t }),
    t
      ? F("Voice on: people within 25 m hear you. Walk away to fade out.", "ok")
      : (zn.forEach((e) => e.close()), zn.clear()));
}
var Gy = 25;
setInterval(() => {
  if (!ot().voiceOn || O.status !== "online") return;
  let e = _t()?.player?.root?.position;
  e &&
    (O.peers.forEach((a) => {
      let r = Math.hypot(a.x - e.x, a.z - e.z),
        o = zn.get(a.id);
      if (a.vc && r < Gy && !o && O.meId < a.id) {
        let n = new R0(a.id, "prox");
        (zn.set(a.id, n),
          n.offer().catch(() => {
            (n.close(), zn.delete(a.id));
          }));
      }
      o &&
        (r > Gy + 10 || !a.vc
          ? (o.close(), zn.delete(a.id))
          : (o.audio.volume = Math.max(0, Math.min(1, 1 - r / Gy))));
    }),
    zn.forEach((a, r) => {
      (!O.peers.has(r) || a.closed) && (a.close(), zn.delete(r));
    }));
}, 700);
O.on("rtc", async (t) => {
  let e = t.kind;
  if (e === "call-offer") {
    if (Oo || ot().call) {
      O.send({ t: "rtc", to: t.from, kind: "call-busy" });
      return;
    }
    ((Ed = t.data),
      (af = []),
      C({
        call: { state: "ringing-in", peerId: t.from, name: t.fromName, number: t.number, at: Date.now() },
      }));
  } else if (e === "call-answer") {
    if (Oo) {
      await Oo.setRemote(t.data);
      let a = ot().call;
      a && C({ call: { ...a, state: "active", at: Date.now() } });
    }
  } else if (e === "call-ice") Oo ? Oo.addIce(t.data) : Ed && af.push(t.data);
  else if (e === "call-end")
    (Oo?.close(), (Oo = null), (Ed = null), ot().call && F("Call ended.", "info"), C({ call: null }));
  else if (e === "call-busy") (B0(!1), F(`${t.fromName} is on another call.`, "info"));
  else if (e === "prox-offer") {
    if (!ot().voiceOn) return;
    zn.get(t.from)?.close();
    let a = new R0(t.from, "prox");
    (zn.set(t.from, a),
      a.answer(t.data).catch(() => {
        (a.close(), zn.delete(t.from));
      }));
  } else if (e === "prox-answer")
    try {
      await zn.get(t.from)?.setRemote(t.data);
    } catch {}
  else e === "prox-ice" && zn.get(t.from)?.addIce(t.data);
});
var rf = [
    { code: "en", name: "English", native: "English" },
    { code: "ur", name: "Urdu", native: "\u0627\u0631\u062F\u0648" },
    { code: "hi", name: "Hindi", native: "\u0939\u093F\u0928\u094D\u0926\u0940" },
    { code: "ar", name: "Arabic", native: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
    { code: "zh-CN", name: "Chinese (Simplified)", native: "\u7B80\u4F53\u4E2D\u6587" },
    { code: "zh-TW", name: "Chinese (Traditional)", native: "\u7E41\u9AD4\u4E2D\u6587" },
    { code: "es", name: "Spanish", native: "Espa\xF1ol" },
    { code: "fr", name: "French", native: "Fran\xE7ais" },
    { code: "de", name: "German", native: "Deutsch" },
    { code: "pt", name: "Portuguese", native: "Portugu\xEAs" },
    { code: "ru", name: "Russian", native: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
    { code: "ja", name: "Japanese", native: "\u65E5\u672C\u8A9E" },
    { code: "ko", name: "Korean", native: "\uD55C\uAD6D\uC5B4" },
    { code: "tr", name: "Turkish", native: "T\xFCrk\xE7e" },
    { code: "fa", name: "Persian", native: "\u0641\u0627\u0631\u0633\u06CC" },
    { code: "bn", name: "Bengali", native: "\u09AC\u09BE\u0982\u09B2\u09BE" },
    { code: "pa", name: "Punjabi", native: "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40" },
    { code: "ps", name: "Pashto", native: "\u067E\u069A\u062A\u0648" },
    { code: "sd", name: "Sindhi", native: "\u0633\u0646\u068C\u064A" },
    { code: "id", name: "Indonesian", native: "Bahasa Indonesia" },
    { code: "ms", name: "Malay", native: "Bahasa Melayu" },
    { code: "it", name: "Italian", native: "Italiano" },
    { code: "nl", name: "Dutch", native: "Nederlands" },
    { code: "pl", name: "Polish", native: "Polski" },
    { code: "uk", name: "Ukrainian", native: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" },
    { code: "vi", name: "Vietnamese", native: "Ti\u1EBFng Vi\u1EC7t" },
    { code: "th", name: "Thai", native: "\u0E44\u0E17\u0E22" },
    { code: "tl", name: "Filipino", native: "Filipino" },
    { code: "sw", name: "Swahili", native: "Kiswahili" },
    { code: "af", name: "Afrikaans", native: "Afrikaans" },
    { code: "sq", name: "Albanian", native: "Shqip" },
    { code: "am", name: "Amharic", native: "\u12A0\u121B\u122D\u129B" },
    { code: "hy", name: "Armenian", native: "\u0540\u0561\u0575\u0565\u0580\u0565\u0576" },
    { code: "as", name: "Assamese", native: "\u0985\u09B8\u09AE\u09C0\u09AF\u09BC\u09BE" },
    { code: "ay", name: "Aymara", native: "Aymar aru" },
    { code: "az", name: "Azerbaijani", native: "Az\u0259rbaycan" },
    { code: "bm", name: "Bambara", native: "Bamanankan" },
    { code: "eu", name: "Basque", native: "Euskara" },
    {
      code: "be",
      name: "Belarusian",
      native: "\u0411\u0435\u043B\u0430\u0440\u0443\u0441\u043A\u0430\u044F",
    },
    { code: "bho", name: "Bhojpuri", native: "\u092D\u094B\u091C\u092A\u0941\u0930\u0940" },
    { code: "bs", name: "Bosnian", native: "Bosanski" },
    { code: "bg", name: "Bulgarian", native: "\u0411\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438" },
    { code: "ca", name: "Catalan", native: "Catal\xE0" },
    { code: "ceb", name: "Cebuano", native: "Cebuano" },
    { code: "ny", name: "Chichewa", native: "Chichewa" },
    { code: "co", name: "Corsican", native: "Corsu" },
    { code: "hr", name: "Croatian", native: "Hrvatski" },
    { code: "cs", name: "Czech", native: "\u010Ce\u0161tina" },
    { code: "da", name: "Danish", native: "Dansk" },
    { code: "dv", name: "Dhivehi", native: "\u078B\u07A8\u0788\u07AC\u0780\u07A8" },
    { code: "doi", name: "Dogri", native: "\u0921\u094B\u0917\u0930\u0940" },
    { code: "eo", name: "Esperanto", native: "Esperanto" },
    { code: "et", name: "Estonian", native: "Eesti" },
    { code: "ee", name: "Ewe", native: "E\u028Begbe" },
    { code: "fi", name: "Finnish", native: "Suomi" },
    { code: "fy", name: "Frisian", native: "Frysk" },
    { code: "gl", name: "Galician", native: "Galego" },
    { code: "ka", name: "Georgian", native: "\u10E5\u10D0\u10E0\u10D7\u10E3\u10DA\u10D8" },
    { code: "el", name: "Greek", native: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC" },
    { code: "gn", name: "Guarani", native: "Ava\xF1e'\u1EBD" },
    { code: "gu", name: "Gujarati", native: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0" },
    { code: "ht", name: "Haitian Creole", native: "Krey\xF2l ayisyen" },
    { code: "ha", name: "Hausa", native: "Hausa" },
    { code: "haw", name: "Hawaiian", native: "\u02BB\u014Clelo Hawai\u02BBi" },
    { code: "he", name: "Hebrew", native: "\u05E2\u05D1\u05E8\u05D9\u05EA" },
    { code: "hmn", name: "Hmong", native: "Hmoob" },
    { code: "hu", name: "Hungarian", native: "Magyar" },
    { code: "is", name: "Icelandic", native: "\xCDslenska" },
    { code: "ig", name: "Igbo", native: "Igbo" },
    { code: "ilo", name: "Ilocano", native: "Ilokano" },
    { code: "ga", name: "Irish", native: "Gaeilge" },
    { code: "jv", name: "Javanese", native: "Basa Jawa" },
    { code: "kn", name: "Kannada", native: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1" },
    { code: "kk", name: "Kazakh", native: "\u049A\u0430\u0437\u0430\u049B" },
    { code: "km", name: "Khmer", native: "\u1781\u17D2\u1798\u17C2\u179A" },
    { code: "rw", name: "Kinyarwanda", native: "Kinyarwanda" },
    { code: "gom", name: "Konkani", native: "\u0915\u094B\u0902\u0915\u0923\u0940" },
    { code: "kri", name: "Krio", native: "Krio" },
    { code: "ku", name: "Kurdish (Kurmanji)", native: "Kurd\xEE" },
    { code: "ckb", name: "Kurdish (Sorani)", native: "\u06A9\u0648\u0631\u062F\u06CC" },
    { code: "ky", name: "Kyrgyz", native: "\u041A\u044B\u0440\u0433\u044B\u0437\u0447\u0430" },
    { code: "lo", name: "Lao", native: "\u0EA5\u0EB2\u0EA7" },
    { code: "la", name: "Latin", native: "Latina" },
    { code: "lv", name: "Latvian", native: "Latvie\u0161u" },
    { code: "ln", name: "Lingala", native: "Ling\xE1la" },
    { code: "lt", name: "Lithuanian", native: "Lietuvi\u0173" },
    { code: "lg", name: "Luganda", native: "Luganda" },
    { code: "lb", name: "Luxembourgish", native: "L\xEBtzebuergesch" },
    {
      code: "mk",
      name: "Macedonian",
      native: "\u041C\u0430\u043A\u0435\u0434\u043E\u043D\u0441\u043A\u0438",
    },
    { code: "mai", name: "Maithili", native: "\u092E\u0948\u0925\u093F\u0932\u0940" },
    { code: "mg", name: "Malagasy", native: "Malagasy" },
    { code: "ml", name: "Malayalam", native: "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02" },
    { code: "mt", name: "Maltese", native: "Malti" },
    { code: "mi", name: "Maori", native: "M\u0101ori" },
    { code: "mr", name: "Marathi", native: "\u092E\u0930\u093E\u0920\u0940" },
    { code: "mni-Mtei", name: "Meiteilon (Manipuri)", native: "\uABC3\uABE4\uABC7\uABE9\uABC2\uABE3\uABDF" },
    { code: "lus", name: "Mizo", native: "Mizo \u1E6Dawng" },
    { code: "mn", name: "Mongolian", native: "\u041C\u043E\u043D\u0433\u043E\u043B" },
    { code: "my", name: "Myanmar (Burmese)", native: "\u1019\u103C\u1014\u103A\u1019\u102C" },
    { code: "ne", name: "Nepali", native: "\u0928\u0947\u092A\u093E\u0932\u0940" },
    { code: "no", name: "Norwegian", native: "Norsk" },
    { code: "or", name: "Odia (Oriya)", native: "\u0B13\u0B21\u0B3C\u0B3F\u0B06" },
    { code: "om", name: "Oromo", native: "Afaan Oromoo" },
    { code: "qu", name: "Quechua", native: "Runa Simi" },
    { code: "ro", name: "Romanian", native: "Rom\xE2n\u0103" },
    { code: "sm", name: "Samoan", native: "Gagana S\u0101moa" },
    { code: "sa", name: "Sanskrit", native: "\u0938\u0902\u0938\u094D\u0915\u0943\u0924\u092E\u094D" },
    { code: "gd", name: "Scots Gaelic", native: "G\xE0idhlig" },
    { code: "nso", name: "Sepedi", native: "Sepedi" },
    { code: "sr", name: "Serbian", native: "\u0421\u0440\u043F\u0441\u043A\u0438" },
    { code: "st", name: "Sesotho", native: "Sesotho" },
    { code: "sn", name: "Shona", native: "chiShona" },
    { code: "si", name: "Sinhala", native: "\u0DC3\u0DD2\u0D82\u0DC4\u0DBD" },
    { code: "sk", name: "Slovak", native: "Sloven\u010Dina" },
    { code: "sl", name: "Slovenian", native: "Sloven\u0161\u010Dina" },
    { code: "so", name: "Somali", native: "Soomaali" },
    { code: "su", name: "Sundanese", native: "Basa Sunda" },
    { code: "sv", name: "Swedish", native: "Svenska" },
    { code: "tg", name: "Tajik", native: "\u0422\u043E\u04B7\u0438\u043A\u04E3" },
    { code: "ta", name: "Tamil", native: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD" },
    { code: "tt", name: "Tatar", native: "\u0422\u0430\u0442\u0430\u0440" },
    { code: "te", name: "Telugu", native: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41" },
    { code: "ti", name: "Tigrinya", native: "\u1275\u130D\u122D\u129B" },
    { code: "ts", name: "Tsonga", native: "Xitsonga" },
    { code: "tk", name: "Turkmen", native: "T\xFCrkmen" },
    { code: "ak", name: "Twi", native: "Twi" },
    { code: "ug", name: "Uyghur", native: "\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5" },
    { code: "uz", name: "Uzbek", native: "O'zbek" },
    { code: "cy", name: "Welsh", native: "Cymraeg" },
    { code: "xh", name: "Xhosa", native: "isiXhosa" },
    { code: "yi", name: "Yiddish", native: "\u05D9\u05D9\u05B4\u05D3\u05D9\u05E9" },
    { code: "yo", name: "Yoruba", native: "Yor\xF9b\xE1" },
    { code: "zu", name: "Zulu", native: "isiZulu" },
  ],
  of = (t) => rf.find((e) => e.code === t)?.name || "English";
var Xe = P(Zt(), 1);
var Vy = [
    {
      id: "summer",
      name: "Summer",
      icon: "\u2600\uFE0F",
      set: { time: "day", weather: "clear", season: "summer", vibe: "normal" },
    },
    {
      id: "monsoon",
      name: "Monsoon rain",
      icon: "\u{1F327}\uFE0F",
      set: { time: "day", weather: "rain", season: "summer", vibe: "normal" },
    },
    {
      id: "winter",
      name: "Winter snow",
      icon: "\u2744\uFE0F",
      set: { time: "dawn", weather: "snow", season: "winter", vibe: "normal" },
    },
    {
      id: "spring",
      name: "Spring blossom",
      icon: "\u{1F338}",
      set: { time: "day", weather: "clear", season: "spring", vibe: "normal" },
    },
    {
      id: "sunset",
      name: "Golden sunset",
      icon: "\u{1F305}",
      set: { time: "sunset", weather: "clear", season: "summer", vibe: "normal" },
    },
    {
      id: "neon",
      name: "Neon night",
      icon: "\u{1F303}",
      set: { time: "night", weather: "clear", season: "autumn", vibe: "neon" },
    },
  ],
  k9 = (t) =>
    Vy.find((e) =>
      Object.entries(e.set).every(([a, r]) => t[a] === r || (a === "vibe" && r === "normal" && !t.vibe)),
    )?.id;
var K = P(ct(), 1),
  Py = (t, e) => "dm:" + [t, e].sort().join(":");
function Oy({ id: t, name: e, number: a, onClose: r, quote: o }) {
  let n = Y(),
    i = n.net.blocks.includes(t),
    s = () => {
      (C({ phoneOpen: !0 }),
        window.__fyrusPhoneOpen?.({ kind: "thread", thread: Py(n.net.id || "", t), title: e, to: t }),
        r());
    };
  return (0, K.jsx)("div", {
    className: "fixed inset-0 z-[78] grid place-items-center p-3",
    style: { background: "rgba(0,0,0,.45)" },
    onClick: r,
    children: (0, K.jsxs)("div", {
      className: "hud-box p-3 w-[min(92vw,300px)] pop-in",
      onClick: (l) => l.stopPropagation(),
      role: "dialog",
      "aria-label": `Options for ${e}`,
      children: [
        (0, K.jsx)("div", { className: "font-bold text-white", children: e }),
        (0, K.jsx)("div", { className: "text-[11px] text-white/60 mb-2", children: a || "Fyrus citizen" }),
        (0, K.jsxs)("div", {
          className: "grid grid-cols-2 gap-1.5",
          children: [
            (0, K.jsxs)("button", {
              className: "btn btn-primary btn-sm",
              onClick: s,
              children: [(0, K.jsx)(Sn, {}), " Message"],
            }),
            (0, K.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => {
                (Cu(t, e, a), r());
              },
              children: [(0, K.jsx)(Ci, {}), " Call"],
            }),
            (0, K.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => {
                (a &&
                  !n.contacts.some((l) => l.number === a) &&
                  C({ contacts: [...n.contacts, { number: a, name: e }] }),
                  F(`${e} saved to contacts.`, "ok"),
                  r());
              },
              children: [(0, K.jsx)(Os, {}), " Save"],
            }),
            (0, K.jsxs)("button", {
              className: "btn btn-ghost btn-sm",
              onClick: () => {
                (O.send({ t: i ? "unblock" : "block", id: t }),
                  F(
                    i ? `${e} unblocked.` : `${e} blocked. You will not see their messages or calls.`,
                    "info",
                  ),
                  r());
              },
              children: [(0, K.jsx)(bg, {}), " ", i ? "Unblock" : "Block"],
            }),
            (0, K.jsxs)("button", {
              className: "btn btn-ghost btn-sm col-span-2",
              onClick: () => {
                let l = prompt(`Report ${e}: what happened?`, "");
                (l && O.send({ t: "report", id: t, reason: l, msg: o }), r());
              },
              children: [(0, K.jsx)(Fs, {}), " Report"],
            }),
          ],
        }),
      ],
    }),
  });
}
function Dy() {
  let t = Y(),
    [e, a] = (0, Xe.useState)({ kind: "home" }),
    [r, o] = (0, Xe.useState)("chats"),
    [n, i] = (0, Xe.useState)([]),
    [s, l] = (0, Xe.useState)(null);
  if (
    ((0, Xe.useEffect)(
      () => (
        (window.__fyrusPhoneOpen = (d) => {
          a(d);
        }),
        () => {
          window.__fyrusPhoneOpen = null;
        }
      ),
      [],
    ),
    (0, Xe.useEffect)(() => {
      let d = O.on("threads", (h) => i(h.list));
      return (
        O.send({ t: "threads" }),
        () => {
          d();
        }
      );
    }, [e.kind]),
    (0, Xe.useEffect)(
      () =>
        O.on("msg", (d) => {
          (d.channel === "dm" || d.channel === "group") && O.send({ t: "threads" });
        }),
      [],
    ),
    !t.phoneOpen)
  )
    return null;
  let c = t.net.status === "online";
  return (0, K.jsxs)("div", {
    className:
      "fixed z-[60] right-3 bottom-20 w-[min(94vw,340px)] h-[min(78vh,560px)] rounded-[28px] overflow-hidden flex flex-col pop-in",
    style: { background: "#0d1117", border: "6px solid #22262c", boxShadow: "0 20px 60px rgba(0,0,0,.6)" },
    role: "dialog",
    "aria-label": "Fyrus Phone",
    children: [
      (0, K.jsxs)("div", {
        className: "flex items-center gap-2 px-4 pt-3 pb-2 text-white",
        children: [
          e.kind !== "home"
            ? (0, K.jsx)("button", {
                onClick: () => a({ kind: "home" }),
                "aria-label": "Back",
                children: (0, K.jsx)(Qr, {}),
              })
            : (0, K.jsx)(Ci, { className: "text-[var(--accent)]" }),
          (0, K.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, K.jsx)("div", {
                className: "text-sm font-bold truncate",
                children: e.kind === "thread" ? e.title : "Fyrus Phone",
              }),
              (0, K.jsx)("div", {
                className: "text-[10px] text-white/50 truncate",
                children: c ? `My number: ${t.net.number}` : "Connecting to the live city\u2026",
              }),
            ],
          }),
          (0, K.jsx)("button", {
            onClick: () => C({ phoneOpen: !1 }),
            "aria-label": "Close phone",
            children: (0, K.jsx)(pe, {}),
          }),
        ],
      }),
      !c &&
        (0, K.jsxs)("div", {
          className: "px-3 overflow-y-auto flex-1",
          children: [
            (0, K.jsx)("div", {
              className: "text-[12px] text-white/70 mb-3",
              children:
                "Your +2040 number, calls and messages work on fyrus.io when the live city is connected.",
            }),
            (0, K.jsx)(b9, {}),
          ],
        }),
      c && e.kind === "thread" && (0, K.jsx)(MB, { view: e }),
      c &&
        e.kind === "home" &&
        (0, K.jsxs)(K.Fragment, {
          children: [
            (0, K.jsxs)("div", {
              className: "flex-1 overflow-y-auto px-3 pb-2",
              children: [
                r === "chats" && (0, K.jsx)(yB, { threads: n, open: a }),
                r === "contacts" && (0, K.jsx)(kB, { open: a, onPerson: l }),
                r === "dial" && (0, K.jsx)(bB, { open: a }),
                r === "me" && (0, K.jsx)(wB, {}),
              ],
            }),
            (0, K.jsx)("div", {
              className: "grid grid-cols-4 border-t border-white/10 text-white/70 text-[10px]",
              children: [
                ["chats", "Chats", Sn],
                ["contacts", "People", $e],
                ["dial", "Dial", rE],
                ["me", "Me", Ul],
              ].map(([d, h, u]) =>
                (0, K.jsxs)(
                  "button",
                  {
                    className: "py-2 flex flex-col items-center gap-0.5",
                    style: r === d ? { color: "var(--accent)" } : {},
                    onClick: () => o(d),
                    children: [(0, K.jsx)(u, { className: "text-base" }), h],
                  },
                  d,
                ),
              ),
            }),
          ],
        }),
      s && (0, K.jsx)(Oy, { ...s, onClose: () => l(null) }),
    ],
  });
}
function yB({ threads: t, open: e }) {
  let a = Y(),
    [r, o] = (0, Xe.useState)(""),
    [n, i] = (0, Xe.useState)("");
  return (0, K.jsxs)("div", {
    className: "space-y-1.5 text-white",
    children: [
      t.length === 0 &&
        (0, K.jsx)("div", {
          className: "text-[12px] text-white/60 py-2",
          children: "No chats yet. Tap someone in the city chat, or dial a Fyrus number.",
        }),
      [...t]
        .sort((s, l) => (l.last?.at || 0) - (s.last?.at || 0))
        .map((s) => {
          let l = s.group ? s.group.name : s.with?.name || "Citizen";
          return (0, K.jsxs)(
            "button",
            {
              className: "w-full text-left rounded-xl p-2.5 flex gap-2 hover:bg-white/5",
              onClick: () =>
                e({ kind: "thread", thread: s.thread, title: l, to: s.with?.id, group: s.group?.id }),
              children: [
                (0, K.jsx)("span", {
                  className: "w-9 h-9 rounded-full grid place-items-center font-bold shrink-0",
                  style: { background: s.with?.color || "#2f6fe0" },
                  children: s.group ? (0, K.jsx)($e, {}) : l[0],
                }),
                (0, K.jsxs)("span", {
                  className: "min-w-0 flex-1",
                  children: [
                    (0, K.jsx)("span", { className: "block text-sm font-bold truncate", children: l }),
                    (0, K.jsx)("span", {
                      className: "block text-[11px] text-white/55 truncate",
                      children: s.last ? `${s.last.fromName}: ${s.last.text}` : "",
                    }),
                  ],
                }),
              ],
            },
            s.thread,
          );
        }),
      (0, K.jsxs)("details", {
        className: "rounded-xl p-2.5",
        style: { background: "rgba(255,255,255,.04)" },
        children: [
          (0, K.jsx)("summary", { className: "text-[12px] font-bold cursor-pointer", children: "New group" }),
          (0, K.jsx)("input", {
            className: "field py-1.5 text-sm mt-2",
            value: r,
            onChange: (s) => o(s.target.value),
            placeholder: "Group name",
            maxLength: 40,
          }),
          (0, K.jsx)("input", {
            className: "field py-1.5 text-sm mt-1.5",
            value: n,
            onChange: (s) => i(s.target.value),
            placeholder: "Members' numbers, comma separated",
          }),
          (0, K.jsx)("button", {
            className: "btn btn-primary btn-sm mt-1.5",
            onClick: () => {
              (O.send({
                t: "group_create",
                name: r,
                numbers: n
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              }),
                o(""),
                i(""),
                setTimeout(() => O.send({ t: "threads" }), 300));
            },
            children: "Create",
          }),
          a.groups.length > 0 &&
            (0, K.jsx)("div", {
              className: "mt-2 space-y-1",
              children: a.groups.map((s) =>
                (0, K.jsxs)(
                  "button",
                  {
                    className: "block text-[12px] underline",
                    onClick: () => e({ kind: "thread", thread: "group:" + s.id, title: s.name, group: s.id }),
                    children: [s.name, " (", s.members.length, ")"],
                  },
                  s.id,
                ),
              ),
            }),
        ],
      }),
    ],
  });
}
function kB({ open: t, onPerson: e }) {
  let a = Y(),
    [r, o] = (0, Xe.useState)(() => [...O.peers.values()]);
  (0, Xe.useEffect)(() => {
    let s = setInterval(() => o([...O.peers.values()]), 1500);
    return () => clearInterval(s);
  }, []);
  let [n, i] = (0, Xe.useState)({});
  return (
    (0, Xe.useEffect)(() => {
      let s = O.on("lookup", (l) => {
        l.user && i((c) => ({ ...c, [l.number]: l.user }));
      });
      return (
        a.contacts.forEach((l) => O.send({ t: "lookup", number: l.number })),
        () => {
          s();
        }
      );
    }, [a.contacts.length]),
    (0, K.jsxs)("div", {
      className: "text-white space-y-3",
      children: [
        (0, K.jsxs)("div", {
          children: [
            (0, K.jsxs)("div", {
              className: "text-[11px] font-bold text-white/50 mb-1",
              children: ["ONLINE NOW (", r.length, ")"],
            }),
            r.length === 0 &&
              (0, K.jsx)("div", {
                className: "text-[12px] text-white/60",
                children: "Nobody else is online right now.",
              }),
            r.map((s) =>
              (0, K.jsxs)(
                "button",
                {
                  className: "w-full flex items-center gap-2 py-1.5 text-left",
                  onClick: () => e({ id: s.id, name: s.name, number: "" }),
                  children: [
                    (0, K.jsx)("span", {
                      className: "w-7 h-7 rounded-full grid place-items-center text-[12px] font-bold",
                      style: { background: s.color },
                      children: s.name[0],
                    }),
                    (0, K.jsx)("span", { className: "text-sm flex-1 truncate", children: s.name }),
                    (0, K.jsx)("span", { className: "w-2 h-2 rounded-full bg-[#45e0ae]" }),
                  ],
                },
                s.id,
              ),
            ),
          ],
        }),
        (0, K.jsxs)("div", {
          children: [
            (0, K.jsx)("div", { className: "text-[11px] font-bold text-white/50 mb-1", children: "SAVED" }),
            a.contacts.length === 0 &&
              (0, K.jsx)("div", { className: "text-[12px] text-white/60", children: "No saved contacts." }),
            a.contacts.map((s) => {
              let l = n[s.number];
              return (0, K.jsxs)(
                "div",
                {
                  className: "flex items-center gap-2 py-1.5",
                  children: [
                    (0, K.jsxs)("span", {
                      className: "text-sm flex-1 truncate",
                      children: [
                        s.name,
                        " ",
                        (0, K.jsx)("span", { className: "text-white/50 text-[11px]", children: s.number }),
                      ],
                    }),
                    l &&
                      (0, K.jsxs)(K.Fragment, {
                        children: [
                          (0, K.jsx)("button", {
                            className: "hud-icon",
                            style: { width: 30, height: 30 },
                            "aria-label": "Message",
                            onClick: () =>
                              t({
                                kind: "thread",
                                thread: Py(a.net.id || "", l.id),
                                title: s.name,
                                to: l.id,
                              }),
                            children: (0, K.jsx)(Sn, {}),
                          }),
                          (0, K.jsx)("button", {
                            className: "hud-icon",
                            style: { width: 30, height: 30 },
                            "aria-label": "Call",
                            onClick: () => Cu(l.id, s.name, s.number),
                            children: (0, K.jsx)(Ci, {}),
                          }),
                        ],
                      }),
                  ],
                },
                s.number,
              );
            }),
          ],
        }),
      ],
    })
  );
}
function bB({ open: t }) {
  let e = Y(),
    [a, r] = (0, Xe.useState)("+2040-"),
    [o, n] = (0, Xe.useState)(void 0);
  (0, Xe.useEffect)(() => O.on("lookup", (l) => n(l.user)), []);
  let i = () => {
    (n(void 0), O.send({ t: "lookup", number: a }));
  };
  return (0, K.jsxs)("div", {
    className: "text-white",
    children: [
      (0, K.jsx)("input", {
        className: "w-full bg-transparent text-center text-2xl font-bold tracking-wider py-3 outline-none",
        value: a,
        onChange: (l) => r(l.target.value.toUpperCase()),
        "aria-label": "Fyrus number",
      }),
      (0, K.jsx)("div", {
        className: "grid grid-cols-3 gap-2 px-6",
        children: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "0", "\u232B"].map((l) =>
          (0, K.jsx)(
            "button",
            {
              className: "h-12 rounded-full bg-white/8 text-lg font-bold",
              style: { background: "rgba(255,255,255,.07)" },
              onClick: () => r((c) => (l === "\u232B" ? c.slice(0, -1) : l === " " ? c + " " : c + l)),
              children: l,
            },
            l,
          ),
        ),
      }),
      (0, K.jsx)("div", {
        className: "flex gap-2 justify-center mt-3",
        children: (0, K.jsx)("button", { className: "btn btn-primary btn-sm", onClick: i, children: "Find" }),
      }),
      o === null &&
        (0, K.jsx)("div", {
          className: "text-center text-[12px] text-white/60 mt-2",
          children: "No citizen has that number.",
        }),
      o &&
        (0, K.jsxs)("div", {
          className: "mt-3 rounded-xl p-3 text-center",
          style: { background: "rgba(255,255,255,.05)" },
          children: [
            (0, K.jsx)("div", { className: "font-bold", children: o.name }),
            (0, K.jsxs)("div", {
              className: "text-[11px] text-white/60",
              children: [o.number, " \xB7 ", o.online ? "online" : "offline"],
            }),
            (0, K.jsxs)("div", {
              className: "flex gap-2 justify-center mt-2",
              children: [
                (0, K.jsxs)("button", {
                  className: "btn btn-primary btn-sm",
                  onClick: () =>
                    t({ kind: "thread", thread: Py(e.net.id || "", o.id), title: o.name, to: o.id }),
                  children: [(0, K.jsx)(Sn, {}), " Message"],
                }),
                o.online &&
                  (0, K.jsxs)("button", {
                    className: "btn btn-ghost btn-sm",
                    onClick: () => Cu(o.id, o.name, o.number),
                    children: [(0, K.jsx)(Ci, {}), " Call"],
                  }),
                (0, K.jsx)("button", {
                  className: "btn btn-ghost btn-sm",
                  onClick: () => {
                    (e.contacts.some((l) => l.number === o.number) ||
                      C({ contacts: [...e.contacts, { number: o.number, name: o.name }] }),
                      F("Saved.", "ok"));
                  },
                  children: (0, K.jsx)(Os, {}),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function b9() {
  let t = Y(),
    e = k9(t.settings),
    a = !!t.settings.stealth,
    r = (o) => {
      (C({ settings: { ...ot().settings, stealth: o } }),
        O.send({ t: "profile", stealth: o }),
        F(
          o
            ? "Stealth mode: others see you as an anonymous citizen with a mask."
            : "Public mode: others see your name and photo.",
          "info",
        ));
    };
  return (0, K.jsxs)(K.Fragment, {
    children: [
      (0, K.jsxs)("div", {
        children: [
          (0, K.jsx)("div", {
            className: "text-[11px] font-bold text-white/50 mb-1",
            children: "MY SEASON \xB7 only on your screen",
          }),
          (0, K.jsx)("div", {
            className: "grid grid-cols-3 gap-1",
            children: Vy.map((o) =>
              (0, K.jsxs)(
                "button",
                {
                  "data-look": o.id,
                  className: "rounded-lg py-1.5 text-[11px] font-semibold text-white",
                  style: {
                    background:
                      e === o.id
                        ? "color-mix(in srgb, var(--accent) 35%, transparent)"
                        : "rgba(255,255,255,.06)",
                    border: "1px solid rgba(255,255,255,.1)",
                  },
                  onClick: () => C({ settings: { ...ot().settings, ...o.set } }),
                  children: [(0, K.jsx)("span", { className: "block text-base", children: o.icon }), o.name],
                },
                o.id,
              ),
            ),
          }),
        ],
      }),
      (0, K.jsxs)("div", {
        children: [
          (0, K.jsx)("div", { className: "text-[11px] font-bold text-white/50 mb-1", children: "PRIVACY" }),
          (0, K.jsxs)("div", {
            className: "grid grid-cols-2 gap-1",
            children: [
              (0, K.jsxs)("button", {
                id: "mode-stealth",
                className: "rounded-lg p-2 text-left text-white",
                style: {
                  background: a
                    ? "color-mix(in srgb, var(--accent) 35%, transparent)"
                    : "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.1)",
                },
                onClick: () => r(!0),
                children: [
                  (0, K.jsx)(B8, {}),
                  (0, K.jsx)("div", { className: "text-[12px] font-bold", children: "Stealth mask" }),
                  (0, K.jsx)("div", {
                    className: "text-[10px] text-white/60",
                    children: "Alias, no name or photo",
                  }),
                ],
              }),
              (0, K.jsxs)("button", {
                id: "mode-public",
                className: "rounded-lg p-2 text-left text-white",
                style: {
                  background: a
                    ? "rgba(255,255,255,.06)"
                    : "color-mix(in srgb, var(--accent) 35%, transparent)",
                  border: "1px solid rgba(255,255,255,.1)",
                },
                onClick: () => r(!1),
                children: [
                  (0, K.jsx)(Us, {}),
                  (0, K.jsx)("div", { className: "text-[12px] font-bold", children: "Public VIP" }),
                  (0, K.jsx)("div", {
                    className: "text-[10px] text-white/60",
                    children: "Name, photo, rank",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function wB() {
  let t = Y(),
    [e, a] = (0, Xe.useState)(""),
    r = (0, Xe.useMemo)(
      () => rf.filter((n) => (n.name + " " + n.native).toLowerCase().includes(e.toLowerCase())),
      [e],
    ),
    o = (n) => {
      (C({ settings: { ...ot().settings, lang: n } }),
        O.send({ t: "profile", lang: n }),
        F(`Messages will appear in ${of(n)}.`, "ok"));
    };
  return (0, K.jsxs)("div", {
    className: "text-white space-y-3",
    children: [
      (0, K.jsx)(b9, {}),
      (0, K.jsxs)("div", {
        className: "rounded-xl p-3 text-center",
        style: { background: "linear-gradient(135deg,#1b2a4a,#0b1d3f)" },
        children: [
          (0, K.jsx)("div", {
            className: "text-[10px] tracking-[.2em] text-[#ffc27a]",
            children: "MY FYRUS NUMBER",
          }),
          (0, K.jsx)("div", { className: "text-2xl font-bold tracking-wider mt-1", children: t.net.number }),
          (0, K.jsx)("div", {
            className: "text-[11px] text-white/60 mt-1",
            children: "Works only inside Fyrus City. Share it so friends can call and message you.",
          }),
        ],
      }),
      (0, K.jsxs)("div", {
        children: [
          (0, K.jsx)("div", {
            className: "text-[11px] font-bold text-white/50 mb-1",
            children: "READ MESSAGES IN \xB7 official language: English",
          }),
          (0, K.jsx)("input", {
            className: "field py-1.5 text-sm",
            value: e,
            onChange: (n) => a(n.target.value),
            placeholder: `Search ${rf.length} languages`,
          }),
          (0, K.jsx)("div", {
            className: "max-h-40 overflow-y-auto mt-1.5 space-y-0.5",
            children: r.map((n) =>
              (0, K.jsxs)(
                "button",
                {
                  className: "w-full flex text-left text-[13px] px-2 py-1 rounded-md hover:bg-white/5",
                  style:
                    t.settings.lang === n.code
                      ? { background: "color-mix(in srgb, var(--accent) 25%, transparent)" }
                      : {},
                  onClick: () => o(n.code),
                  children: [
                    (0, K.jsx)("span", { className: "flex-1", children: n.name }),
                    (0, K.jsx)("span", { className: "text-white/50", children: n.native }),
                  ],
                },
                n.code,
              ),
            ),
          }),
          !t.net.translate &&
            (0, K.jsx)("div", {
              className: "text-[11px] text-[#ffc27a] mt-1",
              children: "Translation switches on as soon as the city's AI key is added on the server.",
            }),
        ],
      }),
      (0, K.jsxs)("div", {
        children: [
          (0, K.jsxs)("div", {
            className: "text-[11px] font-bold text-white/50 mb-1",
            children: ["BLOCKED (", t.net.blocks.length, ")"],
          }),
          t.net.blocks.length === 0
            ? (0, K.jsx)("div", { className: "text-[12px] text-white/60", children: "Nobody." })
            : t.net.blocks.map((n) =>
                (0, K.jsxs)(
                  "div",
                  {
                    className: "flex text-[12px] py-1",
                    children: [
                      (0, K.jsx)("span", { className: "flex-1 truncate", children: n }),
                      (0, K.jsx)("button", {
                        className: "underline",
                        onClick: () => O.send({ t: "unblock", id: n }),
                        children: "Unblock",
                      }),
                    ],
                  },
                  n,
                ),
              ),
        ],
      }),
    ],
  });
}
function MB({ view: t }) {
  let e = Y(),
    [a, r] = (0, Xe.useState)([]),
    [o, n] = (0, Xe.useState)(""),
    i = (0, Xe.useRef)(null),
    [s, l] = (0, Xe.useState)({});
  ((0, Xe.useEffect)(() => {
    let d = O.on("history", (u) => {
        u.thread === t.thread && r(u.msgs);
      }),
      h = O.on("msg", (u) => {
        u.thread === t.thread && r((p) => [...p.filter((v) => v.id !== u.id), u]);
      });
    return (
      O.send({ t: "history", thread: t.thread }),
      () => {
        (d(), h());
      }
    );
  }, [t.thread]),
    (0, Xe.useEffect)(() => {
      i.current?.scrollTo({ top: 1e6 });
    }, [a.length]));
  let c = () => {
    let d = o.trim();
    d &&
      (O.send(
        t.group
          ? { t: "say", channel: "group", group: t.group, text: d }
          : { t: "say", channel: "dm", to: t.to, text: d },
      ),
      n(""));
  };
  return (0, K.jsxs)("div", {
    className: "flex-1 flex flex-col min-h-0",
    children: [
      t.to &&
        (0, K.jsx)("div", {
          className: "flex gap-2 px-3 pb-2",
          children: (0, K.jsxs)("button", {
            className: "btn btn-ghost btn-sm",
            onClick: () => Cu(t.to, t.title, ""),
            children: [(0, K.jsx)(Ci, {}), " Call"],
          }),
        }),
      (0, K.jsx)("div", {
        ref: i,
        className: "flex-1 overflow-y-auto px-3 space-y-1.5",
        children: a.map((d) => {
          let h = d.from === e.net.id;
          return (0, K.jsx)(
            "div",
            {
              className: `flex ${h ? "justify-end" : ""}`,
              children: (0, K.jsxs)("div", {
                className: "max-w-[80%] rounded-2xl px-3 py-1.5 text-[13px] text-white",
                style: { background: h ? "var(--accent)" : "rgba(255,255,255,.08)" },
                children: [
                  t.group &&
                    !h &&
                    (0, K.jsx)("div", {
                      className: "text-[10px] font-bold text-white/70",
                      children: d.fromName,
                    }),
                  s[d.id] && d.orig ? d.orig : d.text,
                  d.orig &&
                    (0, K.jsx)("button", {
                      className: "block text-[10px] text-white/60 underline",
                      onClick: () => l((u) => ({ ...u, [d.id]: !u[d.id] })),
                      children: s[d.id] ? "show translation" : "show original",
                    }),
                ],
              }),
            },
            d.id,
          );
        }),
      }),
      (0, K.jsxs)("form", {
        className: "flex gap-1.5 p-2",
        onSubmit: (d) => {
          (d.preventDefault(), c());
        },
        children: [
          (0, K.jsx)("input", {
            className: "field py-2 text-sm",
            value: o,
            onChange: (d) => n(d.target.value),
            placeholder: "Message",
            maxLength: 500,
          }),
          (0, K.jsx)("button", {
            className: "btn btn-primary btn-sm",
            "aria-label": "Send",
            children: (0, K.jsx)(Da, {}),
          }),
        ],
      }),
    ],
  });
}
