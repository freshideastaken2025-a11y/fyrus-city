var Yg = class {
  constructor() {
    this.ctx = null;
    this.out = null;
    this.timer = null;
    this.step = 0;
    this.on = !1;
  }
  start(e = 0.6) {
    if (!this.on) {
      this.on = !0;
      try {
        let a = window.AudioContext || window.webkitAudioContext;
        if (!a) return;
        let r = this.ctx || new a();
        ((this.ctx = r),
          r.resume?.(),
          this.out || ((this.out = r.createGain()), this.out.connect(r.destination)),
          (this.out.gain.value = 0.25 * e));
        let o = [55, 55, 65.4, 49];
        this.timer = setInterval(
          () => {
            let n = r.currentTime + 0.02,
              i = this.step++ % 16;
            if (i % 4 === 0) {
              let s = r.createOscillator(),
                l = r.createGain();
              (s.frequency.setValueAtTime(140, n),
                s.frequency.exponentialRampToValueAtTime(42, n + 0.12),
                l.gain.setValueAtTime(1, n),
                l.gain.exponentialRampToValueAtTime(0.001, n + 0.3),
                s.connect(l),
                l.connect(this.out),
                s.start(n),
                s.stop(n + 0.32));
            }
            if (i % 2 === 1) {
              let s = r.createBuffer(1, 2205, 44100),
                l = s.getChannelData(0);
              for (let u = 0; u < l.length; u++) l[u] = (Math.random() * 2 - 1) * (1 - u / l.length);
              let c = r.createBufferSource();
              c.buffer = s;
              let d = r.createBiquadFilter();
              ((d.type = "highpass"), (d.frequency.value = 7e3));
              let h = r.createGain();
              ((h.gain.value = 0.25), c.connect(d), d.connect(h), h.connect(this.out), c.start(n));
            }
            if (i % 4 === 2) {
              let s = r.createOscillator();
              ((s.type = "sawtooth"), (s.frequency.value = o[Math.floor(this.step / 16) % 4]));
              let l = r.createBiquadFilter();
              ((l.type = "lowpass"), (l.frequency.value = 380));
              let c = r.createGain();
              (c.gain.setValueAtTime(0.35, n),
                c.gain.exponentialRampToValueAtTime(0.001, n + 0.22),
                s.connect(l),
                l.connect(c),
                c.connect(this.out),
                s.start(n),
                s.stop(n + 0.24));
            }
          },
          1e3 / (124 / 60) / 4,
        );
      } catch {}
    }
  }
  setVolume(e) {
    this.out && (this.out.gain.value = 0.25 * e);
  }
  stop() {
    ((this.on = !1), this.timer && clearInterval(this.timer), (this.timer = null));
  }
};
var ds = 8,
  fR = 2,
  mR = ["wave", "dance", "flip", "hearts"],
  D7 = new Set();
function Rn(t) {
  t.traverse((e) => {
    (e.geometry && !D7.has(e.geometry) && e.geometry.dispose(),
      (Array.isArray(e.material) ? e.material : e.material ? [e.material] : []).forEach((r) => {
        D7.has(r) ||
          r.userData?.shared ||
          (r.map && !r.map.userData?.shared && r.map.dispose(), r.dispose?.());
      }));
  });
}
