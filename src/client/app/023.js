var qg = (t, e) =>
    Math.hypot(t, e) < 72 ? Math.atan2(-t, -e) : e - Math.round(e / sa) * sa >= 0 ? 0 : Math.PI,
  F7 = (t) => Xr.find((e) => e.id === t) || Xr[0],
  U7 = 0,
  vR = (t) => {
    let e = performance.now();
    e - U7 > 250 && ((U7 = e), C(t));
  },
  wu = (t, e, a) => {
    let r = ((e - t + Math.PI) % (Math.PI * 2)) - Math.PI;
    return (r < -Math.PI && (r += Math.PI * 2), t + r * a);
  },
  yd = (t) => ((t = Math.max(0, Math.min(1, t))), t * t * (3 - 2 * t)),
  Zg = class {
    constructor(e) {
      this.world = new W.Scene();
      this.home = new W.Scene();
      this.clock = new W.Clock();
      this.bots = [];
      this.peers = new Map();
      this.presence = new $g();
      this.audio = new _g();
      this.beat = new Yg();
      this.keys = new Set();
      this.yaw = 0;
      this.pitch = 0.32;
      this.dist = 9;
      this.staticInteracts = [];
      this.chunks = new Map();
      this.fixed = { group: new W.Group(), homes: new Map(), interacts: [] };
      this.colliders = [];
      this.sigs = {};
      this.raycaster = new W.Raycaster();
      this.ndc = new W.Vector2();
      this.groundMeshes = [];
      this.pointer = { down: !1, x: 0, y: 0, moved: 0 };
      this.minimap = null;
      this.t = { presence: 0, screen: 0, chatter: 0, slow: 0, lod: 0, stats: 0 };
      this.lastNearby = "";
      this.lastChunk = "";
      this.lastDistrict = "";
      this.build = null;
      this.disposed = !1;
      this.landmarks = [];
      this.boards = null;
      this.signs = null;
      this.lmInteracts = [];
      this.nation = null;
      this.nationInteracts = [];
      this.unNet = null;
      this.market = null;
      this.marketInteracts = [];
      this.shops = [];
      this.npcs = new ku();
      this.innerNpcs = new ku();
      this.interior = null;
      this.interiorInteracts = [];
      this.dancers = [];
      this.vehicle = null;
      this.introT = -1;
      this.societies = null;
      this.royalWarn = 0;
      this.services = null;
      this.joy = null;
      this.metro = null;
      this.coast = null;
      this.runway = null;
      this.trip = null;
      this.swimming = !1;
      this.inspectTarget = null;
      this.ray = new W.Raycaster();
      this.lastBump = 0;
      this.flyCache = { t: -9, x: 1e9, z: 1e9, list: [] };
      this.onKeyDown = (e) => {
        let a = e.target;
        if (
          a &&
          (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT" || a.isContentEditable)
        )
          return;
        {
          let o = ot();
          if (o.talk || o.intro || o.hud.open || o.shopView || o.activeGame || o.productView) return;
        }
        let r = e.key.toLowerCase();
        if (!(e.repeat && ["e", "h", " ", "1", "2", "3", "4"].includes(r))) {
          if ((this.keys.add(r), r === "e" || r === "enter")) {
            if (this.vehicle && this.vehicle.kind !== "rocket") {
              _h();
              return;
            }
            this.useNearest();
          }
          (r === " " && (this.vehicle || this.jump(), e.preventDefault()),
            r === "f" && !this.vehicle && this.active === this.world && Vs(),
            r === "h" && this.toggleHover(),
            r === "v" && this.trip && ot().trip?.kind === "ride" && this.toggleRideView(),
            ["1", "2", "3", "4"].includes(r) && this.doEmote(mR[Number(r) - 1]),
            ["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(r) && e.preventDefault());
        }
      };
      this.userGesture = !1;
      this.onKeyUp = (e) => {
        ((this.userGesture = !0), this.keys.delete(e.key.toLowerCase()));
      };
      this.onBlur = () => this.keys.clear();
      this.onPointerDown = (e) => {
        ((this.userGesture = !0), (this.pointer = { down: !0, x: e.clientX, y: e.clientY, moved: 0 }));
        try {
          this.renderer.domElement.setPointerCapture(e.pointerId);
        } catch {}
        this.decorDown(e.clientX, e.clientY);
      };
      this.drag = null;
      this.onPointerMove = (e) => {
        if (!this.pointer.down) return;
        let a = e.clientX - this.pointer.x,
          r = e.clientY - this.pointer.y;
        if (this.drag) {
          ((this.pointer.moved += Math.abs(a) + Math.abs(r)),
            (this.pointer.x = e.clientX),
            (this.pointer.y = e.clientY));
          let o = this.floorHit(e.clientX, e.clientY),
            n = this.interior?.bounds;
          if (o && n) {
            let i = (s) => Math.round(s * 10) / 10;
            ((this.drag.obj.position.x = i(W.MathUtils.clamp(o.x + this.drag.dx, -n.hx - 0.3, n.hx + 0.3))),
              (this.drag.obj.position.z = i(W.MathUtils.clamp(o.z + this.drag.dz, -n.hz - 0.2, n.hz + 0.2))),
              this.interior.ring.position.set(this.drag.obj.position.x, 0.03, this.drag.obj.position.z));
          }
          return;
        }
        ((this.pointer.moved += Math.abs(a) + Math.abs(r)),
          (this.pointer.x = e.clientX),
          (this.pointer.y = e.clientY),
          (this.yaw -= a * 0.006),
          (this.pitch = Math.min(1.25, Math.max(0.05, this.pitch + r * 0.004))),
          ot().showcase && C({ showcase: !1 }));
      };
      this.onPointerUp = (e) => {
        let a = this.pointer.down;
        this.pointer.down = !1;
        let r = this.drag;
        if (((this.drag = null), r)) {
          this.pointer.moved >= 3 && WM(r.idx, r.obj.position.x, r.obj.position.z);
          return;
        }
        if (a && this.pointer.moved < 6) {
          if (ot().decorating && this.active === this.home) {
            Ih(null);
            return;
          }
          this.click(e.clientX, e.clientY);
        }
      };
      this.onWheel = (e) => {
        (e.preventDefault(), (this.dist = Math.min(40, Math.max(3.5, this.dist + e.deltaY * 0.01))));
      };
      this.rideView = "rider";
      this.clipT = -1;
      this.clipDur = 15;
      this.el = e;
      let a = ot();
      ((this.renderer = (() => {
        let profiles = [
            { antialias: !0, powerPreference: "high-performance" },
            { antialias: !1, powerPreference: "default" },
            { antialias: !1, powerPreference: "low-power", failIfMajorPerformanceCaveat: !1, precision: "mediump" },
          ],
          last = null;
        for (let p of profiles)
          try {
            return new W.WebGLRenderer(p);
          } catch (x) {
            ((last = x), console.warn("[World] WebGL profile failed, trying a lighter one", p, x?.message));
          }
        throw last || new Error("Error creating WebGL context.");
      })()),
        this.applyQuality(a.settings.quality),
        (this.renderer.outputEncoding = W.sRGBEncoding),
        (this.renderer.toneMapping = W.ACESFilmicToneMapping),
        (this.renderer.toneMappingExposure = 1),
        (this.renderer.shadowMap.type = W.PCFSoftShadowMap),
        e.appendChild(this.renderer.domElement),
        (this.renderer.domElement.style.touchAction = "none"),
        (this.camera = new W.PerspectiveCamera(58, 1, 0.1, 1800)),
        (this.active = this.world),
        (this.env = new Pg(this.world)),
        (this.home.background = new W.Color("#1b1d22")));
      let r = a.users.find((o) => o.id === a.session?.userId);
      ((this.player = new Nn(r?.name || "You", r?.color || "#4da3ff", "", !0, r?.avatar)),
        (this.player.label.visible = !1),
        this.player.root.position.set(0, 0, 36),
        (this.yaw = 0),
        this.buildGround(),
        this.buildStage(),
        this.buildLandmarks(a),
        (this.traffic = new Og(() => [
          ...Oa.filter((o) => o.kind !== "homes").map((o) => ({ x: o.x, z: o.z, r: o.r + 6 })),
          ...yp.map((o) => ({ ...o, r: o.r - 4 })),
          ...xv,
          ...kv,
          ...bv,
          { x: Ze.x, z: Ze.z, r: 32 },
        ])),
        this.world.add(this.traffic.group),
        this.world.add(this.fixed.group, this.player.root),
        this.npcs.spawn([...wp.filter((o) => o.scene !== "club"), ...O7], this.world),
        this.spawnBots(),
        (this.clickMarker = new W.Mesh(
          new W.RingGeometry(0.3, 0.45, 32),
          new W.MeshBasicMaterial({
            color: "#ffffff",
            transparent: !0,
            opacity: 0,
            side: W.DoubleSide,
            depthWrite: !1,
          }),
        )),
        (this.clickMarker.rotation.x = -Math.PI / 2),
        (this.clickMarker.position.y = 0.06),
        this.world.add(this.clickMarker),
        (this.waypointBeam = new W.Mesh(
          new W.CylinderGeometry(0.6, 0.6, 120, 16, 1, !0),
          new W.MeshBasicMaterial({
            color: "#ffc27a",
            transparent: !0,
            opacity: 0.35,
            depthWrite: !1,
            side: W.DoubleSide,
          }),
        )),
        (this.waypointBeam.position.y = 60),
        (this.waypointBeam.visible = !1),
        this.world.add(this.waypointBeam),
        (this.presence.onInvite = (o) =>
          C({
            invite: {
              room: o.room,
              fromName: o.fromName,
              fromPeer: o.fromPeer,
              kind: o.kind,
              game: o.game || void 0,
            },
          })),
        (this.unNet = O.on("msg", (o) => {
          o.channel !== "near" ||
            o.from === O.meId ||
            this.peers.get("net-" + o.from)?.say(o.text, this.clock.elapsedTime);
        })),
        (this.presence.onChat = (o) => {
          let n = this.peers.get(o.id);
          !n ||
            !o.text ||
            (o.text.startsWith("::emote:")
              ? n.doEmote(o.text.slice(8), this.clock.elapsedTime)
              : n.say(o.text, this.clock.elapsedTime));
        }),
        this.sync(ot()),
        this.updateChunks(!0),
        (this.unsub = Cv(() => this.sync(ot()))),
        this.bindInput(),
        (this.ro = new ResizeObserver(() => this.resize())),
        this.ro.observe(e),
        this.resize());
      try {
        document.fonts?.ready?.then(() => {
          this.disposed || ((this.sigs.market = ""), this.sync(ot()));
        });
      } catch {}
      this.renderer.setAnimationLoop(() => this.tick());
    }
    applyQuality(e) {
      (this.renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, e === "low" ? 1 : e === "medium" ? 1.35 : 1.75),
      ),
        (this.renderer.shadowMap.enabled = e !== "low"));
    }
    buildGround() {
      ((this.groundMat = lL()),
        (this.ground = new W.Mesh(new W.PlaneGeometry(1100, 1100), this.groundMat)),
        (this.ground.rotation.x = -Math.PI / 2),
        (this.ground.name = "ground"),
        this.world.add(this.ground),
        (this.groundMeshes = [this.ground]));
      let e = new W.Mesh(new W.PlaneGeometry(150, 150), new W.ShadowMaterial({ opacity: 0.3 }));
      ((e.rotation.x = -Math.PI / 2),
        (e.position.y = 0.02),
        (e.receiveShadow = !0),
        this.world.add(e),
        (this.shadowCatcher = e));
    }
    buildStage() {
      let e = new W.Group(),
        a = new W.MeshStandardMaterial({ color: "#2b2e33", metalness: 0.5, roughness: 0.5 }),
        r = new W.MeshStandardMaterial({ color: "#3a3d42", roughness: 0.8 }),
        o = new W.Mesh(new W.CylinderGeometry(ds, ds + 0.4, 0.6, 64), r);
      ((o.position.y = 0.3), (o.receiveShadow = !0), (o.castShadow = !0), e.add(o));
      for (let v of [-6.6, 6.6]) {
        let g = new W.Mesh(new W.BoxGeometry(0.4, 9, 0.4), a);
        (g.position.set(v, 4.5, -5.5), e.add(g));
      }
      let n = new W.Mesh(new W.BoxGeometry(13.6, 0.4, 0.4), a);
      (n.position.set(0, 9, -5.5), e.add(n));
      let i = new W.Group();
      i.position.set(0, 0, 0);
      let s = new W.Mesh(
        new W.CylinderGeometry(3.2, 3.6, 1.2, 40),
        new W.MeshStandardMaterial({ color: "#d6d0c4", roughness: 0.8 }),
      );
      (s.position.set(0, 0.6, 18), e.add(s));
      let l = new W.Mesh(
          new W.SphereGeometry(1.7, 48, 24),
          new W.MeshStandardMaterial({
            color: "#2f6fe0",
            metalness: 0.3,
            roughness: 0.08,
            emissive: "#2f6fe0",
            emissiveIntensity: 0.15,
          }),
        ),
        c = new W.Mesh(
          new W.TorusGeometry(3.2, 0.28, 16, 96),
          new W.MeshStandardMaterial({ color: "#ff9a3c", metalness: 0.7, roughness: 0.3 }),
        );
      ((c.rotation.x = 1.2), i.add(l, c), i.position.set(0, 5.2, 18), e.add(i));
      let d = document.createElement("canvas");
      ((d.width = 1280), (d.height = 720));
      let h = new W.CanvasTexture(d),
        u = new W.Mesh(
          new W.PlaneGeometry(12, 6.75),
          new W.MeshStandardMaterial({ map: h, emissive: "#ffffff", emissiveMap: h, emissiveIntensity: 0.8 }),
        );
      (u.position.set(0, 5.4, -5.3), e.add(u));
      let p = new W.Mesh(new W.BoxGeometry(12.5, 7.2, 0.3), a);
      (p.position.set(0, 5.4, -5.55), e.add(p));
      for (let v of [-7.5, 7.5]) {
        let g = new W.Mesh(
          new W.BoxGeometry(1.2, 2.6, 1),
          new W.MeshStandardMaterial({ color: "#111", roughness: 0.6 }),
        );
        (g.position.set(v, 1.9, -4.5), e.add(g));
      }
      (this.world.add(e),
        (this.stage = { screenCtx: d.getContext("2d"), screenTex: h, core: i, host: null }),
        this.staticInteracts.push({
          pos: new W.Vector3(0, 0, ds + 1.2),
          radius: 3.2,
          label: "Live stage \u2014 go live or watch",
          action: "stage",
          use: () => It("live"),
        }),
        this.colliders.push({ x: 0, z: 18, r: 3.8 }));
    }
    drawScreen(e, a) {
      let r = this.stage.screenCtx,
        o = 1280,
        n = 720,
        i = a.lives.find((s) => s.where === "plaza");
      if (((r.fillStyle = "#0d1117"), r.fillRect(0, 0, o, n), i)) {
        let s = a.users.find((c) => c.id === i.hostId),
          l = r.createLinearGradient(0, 0, o, n);
        (l.addColorStop(0, "#1b2733"),
          l.addColorStop(1, "#0d1117"),
          (r.fillStyle = l),
          r.fillRect(0, 0, o, n),
          (r.fillStyle = "rgba(255,255,255,0.12)"));
        for (let c = 0; c < 40; c++) {
          let d = 20 + Math.abs(Math.sin(e * 4 + c * 0.7)) * 110;
          r.fillRect(40 + c * 30, 690 - d, 18, d);
        }
        (eo(r, 48, 44, 170, 64, 12),
          (r.fillStyle = "#e53935"),
          r.fill(),
          (r.fillStyle = "#fff"),
          (r.font = '800 40px "Plus Jakarta Sans", sans-serif'),
          r.fillText("LIVE", 88, 90),
          (r.font = '600 34px "Plus Jakarta Sans", sans-serif'),
          (r.fillStyle = "rgba(255,255,255,0.85)"),
          r.fillText(`${i.viewers} watching`, 240, 88),
          (r.fillStyle = "#fff"),
          (r.font = "800 64px Sora, sans-serif"),
          gu(r, i.title, 1150)
            .slice(0, 2)
            .forEach((c, d) => r.fillText(c, 48, 220 + d * 76)),
          (r.fillStyle = "#ffc27a"),
          (r.font = '700 40px "Plus Jakarta Sans", sans-serif'),
          r.fillText(s?.name || "Creator", 48, 390));
      } else {
        ((r.fillStyle = "#fff"),
          (r.font = "800 84px Sora, sans-serif"),
          r.fillText("FYRUS CITY", 60, 300),
          (r.fillStyle = "rgba(255,255,255,.7)"),
          (r.font = '600 40px "Plus Jakarta Sans", sans-serif'),
          r.fillText("Live stage \xB7 open to everyone", 60, 370));
        let s = new Date();
        ((r.font = '700 120px "JetBrains Mono", monospace'),
          (r.fillStyle = "#ffc27a"),
          r.fillText(s.toTimeString().slice(0, 5), 60, 560));
      }
      this.stage.screenTex.needsUpdate = !0;
    }
    buildFixedHomes(e, a) {
      (this.fixed.homes.forEach((r) => {
        (this.fixed.group.remove(r.group), Rn(r.group));
      }),
        this.fixed.homes.clear(),
        (this.fixed.interacts = []),
        e.users
          .filter((r) => !r.procedural)
          .forEach((r, o) => {
            let n = e.lives.some((d) => d.hostId === r.id && d.where === "home"),
              i = Sx(r.home, r.name, n ? "LIVE now" : r.title, o * 0.137),
              s = qg(r.home.x, r.home.z);
            (i.group.position.set(r.home.x, 0, r.home.z),
              (i.group.rotation.y = s),
              this.fixed.group.add(i.group),
              this.fixed.homes.set(r.id, i));
            let c = {
              pos: new W.Vector3(0, 0, 7.6).applyAxisAngle(new W.Vector3(0, 1, 0), s).add(i.group.position),
              radius: 2.6,
              ownerId: r.id,
              label: r.id === e.session?.userId ? "Your home" : `${r.name}'s home`,
              action: "enter-home",
              use: () => yo(r.id),
              obj: i.door,
            };
            ((i.door.userData.interact = c), this.fixed.interacts.push(c));
          }),
        a && this.playBuild(),
        this.rebuildColliders());
    }
    playBuild() {
      let e = this.fixed.homes.get(ot().session?.userId || "");
      e && (e.mats.forEach((a) => (a.uniforms.uBuild.value = 0)), (this.build = { mats: e.mats, t: 0 }));
    }
    blocked(e) {
      return [
        ...e.users.filter((a) => !a.procedural).map((a) => ({ x: a.home.x, z: a.home.z, r: 12 })),
        ...Oa.filter((a) => a.kind !== "homes").map((a) => ({ x: a.x, z: a.z, r: a.r + 8 })),
        ...yp,
        ...xv,
        ...kv,
        ...bv,
        ...ki.map((a) => ({ x: a.x, z: a.z, r: 7 })),
        ...mv.map((a) => ({ x: a.x, z: a.z, r: 3 })),
        { x: Ze.x, z: Ze.z, r: 34 },
        ...mw,
      ];
    }
    toInteract(e) {
      let a = () => this.runAction(e.action, e.payload, e.obj || null, e.pos),
        r = { pos: e.pos, radius: e.radius, label: e.label, action: e.action, use: a, obj: e.obj };
      return (e.obj && (e.obj.userData.interact = r), r);
    }
    inspectObj(e, a, r) {
      let o = new W.Vector3();
      (e ? new W.Box3().setFromObject(e).getCenter(o) : o.copy(a).setY(1.2), (this.inspectTarget = o), f8(r));
    }
    runAction(e, a, r = null, o = new W.Vector3()) {
      let n = ot();
      switch (e) {
        case "shop":
        case "vacant":
          Fp(a);
          break;
        case "shopview":
          Pl(a);
          break;
        case "openshop":
          It("openshop");
          break;
        case "nation":
          Fl(a);
          break;
        case "politics": {
          let [i, s] = String(a || "").split(":");
          ai(i || void 0, s);
          break;
        }
        case "plot":
          Fl("land", a);
          break;
        case "club":
          h8();
          break;
        case "rent-car":
          J2("car");
          break;
        case "rent-rocket":
          J2("rocket");
          break;
        case "ad":
          ((window.__fyrusAdSpot = a), It("ads"));
          break;
        case "waypoint": {
          let i = Oa.find((s) => s.id === a);
          i && od({ x: i.x, z: i.z, name: i.name });
          break;
        }
        case "agent": {
          let i = n.agents.find((s) => s.id === a);
          if (!i) break;
          (an("agent", i.id),
            this.inspectObj(r, o, {
              title: i.name,
              sub: i.tagline,
              lines: [
                `What it does: ${i.skills.join(" \xB7 ")}`,
                `Category: ${i.category}`,
                i.sample ? "Sample listing \xB7 shows how the marketplace works" : i.reviews ? `\u2605 ${i.rating} \xB7 ${i.reviews} reviews \xB7 ${i.sales.toLocaleString("en-US")} sold` : "New listing \xB7 no reviews yet",
                `Price: $${i.price}`,
              ],
              actions: [
                { label: "Try live demo", act: "demo", payload: n.scene.owner || "" },
                { label: `Buy \xB7 $${i.price}`, act: "buyAgent", payload: i.id, primary: !0 },
              ],
            }));
          break;
        }
        case "gig":
          (an("gig", a), It("gigs"));
          break;
        case "article":
        case "video":
          (an(e, a), It("feed"));
          break;
        case "product": {
          let [i, s] = a.split("|"),
            l = n.brands.find((d) => d.id === i),
            c = l?.products.find((d) => d.id === s);
          if (!l || !c) break;
          this.inspectObj(r, o, {
            title: c.name,
            sub: `${l.name} \xB7 ${c.kind}`,
            lines: [c.desc, `Price: $${c.price}`, "Ships in 2 days (demo)"],
            actions: [
              { label: "View 360\xB0", act: "view3d", payload: a },
              { label: `Buy \xB7 $${c.price}`, act: "buyProduct", payload: a, primary: !0 },
            ],
          });
          break;
        }
        case "play":
        case "vote": {
          let i = tn.find((s) => s.id === a);
          if (!i) break;
          this.inspectObj(r, o, {
            title: i.name,
            sub: i.tag,
            lines: [
              i.players,
              i.ready ? "Free to play \xB7 win orbs and XP" : `Coming soon \xB7 ${i.votes} votes`,
              `Your best: ${n.gameBest[i.id] ?? "\u2014"}`,
            ],
            actions: i.ready
              ? [{ label: "Play now", act: "play", payload: i.id, primary: !0 }]
              : [{ label: "Vote for it", act: "vote", payload: i.id, primary: !0 }],
          });
          break;
        }
        case "car": {
          let i = Xr.find((l) => l.id === a);
          if (!i) break;
          let s = n.dream.cars.includes(i.id);
          this.inspectObj(r, o, {
            title: i.name,
            sub: `${i.maker}${i.fly ? " \xB7 flying car" : ""}`,
            lines: [
              i.desc,
              `Top speed ${Math.round(i.top * 3.6)} km/h \xB7 0-100 in ${(28 / i.accel).toFixed(1)} s`,
              `Price: ${i.price.toLocaleString("en-US")} FYC`,
            ],
            actions: [
              { label: "Free test drive", act: "testDrive", payload: i.id },
              s
                ? { label: "Drive it", act: "useCar", payload: i.id, primary: !0 }
                : { label: "Buy", act: "buyCar", payload: i.id, primary: !0 },
            ],
          });
          break;
        }
        case "home": {
          let i = Qn.find((l) => l.id === a);
          if (!i) break;
          let s = n.dream.homes.includes(i.id);
          this.inspectObj(r, o, {
            title: i.name,
            sub: `${i.style} \xB7 ${i.floors} floors`,
            lines: [i.desc, `Garden size ${i.garden}/5`, `Price: ${i.price.toLocaleString("en-US")} FYC`],
            actions: [
              s
                ? { label: "Move in", act: "moveIn", payload: i.id, primary: !0 }
                : { label: "Buy this home", act: "buyHome", payload: i.id, primary: !0 },
            ],
          });
          break;
        }
        case "menu": {
          let i = qa(n).find((l) => l.id === a),
            s = jl[i?.refId || "orbit"] || jl.orbit;
          this.inspectObj(r, o, {
            title: i?.name || "Menu",
            sub: "Order at the counter",
            lines: s.map(([l, c]) => `${l} \u2014 $${c}`),
            actions: s
              .slice(0, 3)
              .map(([l, c]) => ({
                label: `${l.split(" (")[0]} \xB7 $${c}`,
                act: "order",
                payload: `${a}|${l}|${c}`,
              })),
          });
          break;
        }
        case "dance":
          this.doEmote("dance");
          break;
        case "stage":
          It("live");
          break;
        case "exit":
          Jr();
          break;
        case "ride":
          C({ rideCard: a || null });
          break;
        case "gov":
          NM(a);
          break;
        case "cruise":
          this.startCruise(a || "y3");
          break;
        case "estate":
          zo(a);
          break;
        case "fly":
          C({ travelOpen: { tab: "fly" } });
          break;
        case "edu":
          Vh(a || "explore");
          break;
        case "class":
          C({ scene: { mode: "gov", owner: "class:" + (a || "school") }, nearby: null });
          break;
        case "svc": {
          let i = Nl(a || "");
          if (!i) break;
          let s = ot(),
            l = s.scene.mode === "gov" && s.scene.owner === "svc:" + i.id;
          i.interior && !l
            ? (C({ scene: { mode: "gov", owner: "svc:" + i.id }, nearby: null, vehicle: null }),
              F(
                i.kind === "faith"
                  ? `${i.name}. Everyone is welcome \u2014 please be respectful.`
                  : `${i.name}. Walk to the ${i.kind === "shop" ? "counter" : "desk"} to buy or start a shift.`,
                "info",
              ))
            : q2(i.id);
          break;
        }
        case "jobtask":
          jv(Number(a));
          break;
        case "pray": {
          ((this.player.sitting = !0),
            setTimeout(() => {
              this.player.sitting = !1;
            }, 6e3),
            F("A quiet moment. Peace be with you.", "info"));
          break;
        }
        case "langar":
          F("Langar: you share a free meal of dal, roti and kheer. Everyone eats together here.", "ok");
          break;
        case "metro":
          C({ travelOpen: { station: a } });
          break;
        case "news":
          Gh(a || "tv");
          break;
        case "hall":
          Gs(a || "grand");
          break;
        case "events":
          a?.startsWith("book:") ? En("book", a.slice(5)) : En(a || "upcoming");
          break;
        case "games":
          It("games");
          break;
      }
    }
    buildLandmarks(e) {
      let a = (s) => Oa.find((l) => l.id === s),
        r = a("skyport"),
        o = a("gardens"),
        n = a("marina"),
        i = [
          ...Oa.map((s) => ({ x: s.x, z: s.z, r: s.r })),
          ...yp,
          ...e.users.filter((s) => !s.procedural).map((s) => ({ x: s.home.x, z: s.home.z, r: 9 })),
        ];
      ((this.landmarks = [$L(), _L(r.x, r.z), YL(o.x, o.z), qL(n.x, n.z), ZL(hv * 2, i), KL(26), JL(), kL()]),
        (this.joy = ML()),
        (this.metro = EL()),
        (this.coast = PL()),
        (this.runway = OL()),
        (this.societies = GL()),
        this.landmarks.push(
          this.joy,
          this.metro,
          this.coast,
          this.runway,
          TL(),
          this.societies,
          SL(),
          HL(),
          NL(),
        ),
        (this.services = P7()),
        this.landmarks.push(this.services),
        this.landmarks.forEach((s) => this.world.add(s.group)),
        (this.signs = QL(
          mv,
          Oa.filter((s) => s.kind !== "core" || !0),
        )),
        this.world.add(this.signs.group),
        this.rebuildBoards(e));
    }
    rebuildBoards(e) {
      (this.boards &&
        (this.boards.videos.forEach((a) => {
          (a.el.pause(), a.el.removeAttribute("src"));
        }),
        this.world.remove(this.boards.group),
        Rn(this.boards.group)),
        (this.boards = t7(
          ki,
          this.adList(e)
            .sort((a, r) => (r.at || 0) - (a.at || 0))
            .filter((a, r, o) => o.findIndex((n) => n.spotId === a.spotId) === r),
        )),
        this.world.add(this.boards.group),
        this.refreshLmInteracts());
    }
    adList(e) {
      return e.adsNet
        ? e.adsNet.live.map((a) => ({
            id: a.id,
            spotId: a.spot,
            brand: a.brand,
            headline: a.headline,
            color: a.color,
            image: a.image,
            category: a.category,
            days: 0,
            at: a.start,
            ownerId: a.owner,
            ownerName: a.ownerName,
          }))
        : [...e.ads, ...(e.sharedAds || [])];
    }
    rebuildNation(e) {
      this.nation && (this.world.remove(this.nation.group), Rn(this.nation.group));
      let a = (r) =>
        Lh.find((o) => o.id === r)?.color ||
        D2.find((o) => o.id === r)?.color ||
        e.users.find((o) => o.id === r)?.color ||
        "#4da3ff";
      ((this.nation = wL(Za(e), e.session?.userId, a)),
        this.world.add(this.nation.group),
        (this.nationInteracts = this.nation.interacts.map((r) => this.toInteract(r))),
        this.rebuildColliders());
    }
    rebuildMarket(e) {
      (this.market && (this.world.remove(this.market.group), Rn(this.market.group)),
        (this.shops = qa(e)),
        (this.market = a7(this.shops, (a) => ri(a), e.brands)),
        this.world.add(this.market.group),
        (this.marketInteracts = this.market.interacts.map((a) => this.toInteract(a))),
        this.rebuildColliders());
    }
    refreshLmInteracts() {
      let e = [...this.landmarks, ...(this.boards ? [this.boards] : []), ...(this.signs ? [this.signs] : [])];
      ((this.lmInteracts = e.flatMap((a) => a.interacts.map((r) => this.toInteract(r)))),
        this.rebuildColliders());
    }
    buildChunk(e, a, r) {
      let o = Dw(e, a, this.blocked(r)),
        n = new W.Group(),
        i = {
          key: `${e},${a}`,
          cx: e,
          cz: a,
          group: n,
          plan: o,
          homes: [],
          orbs: [],
          interacts: [],
          labels: [],
        };
      (o.homes.forEach((l) => {
        let c = Sx(l.home, l.name, l.title, (Math.abs(e * 31 + a * 17) % 100) / 100),
          d = qg(l.home.x, l.home.z);
        (c.group.position.set(l.home.x, 0, l.home.z),
          (c.group.rotation.y = d),
          n.add(c.group),
          i.homes.push({ u: l, mesh: c }),
          i.labels.push(c.label));
        let u = {
          pos: new W.Vector3(0, 0, 7.6).applyAxisAngle(new W.Vector3(0, 1, 0), d).add(c.group.position),
          radius: 2.6,
          ownerId: l.id,
          label: `${l.name}'s home`,
          action: "enter-home",
          use: () => {
            (Is(l), yo(l.id));
          },
          obj: c.door,
        };
        ((c.door.userData.interact = u), i.interacts.push(u));
        let p = (Math.abs(l.home.x * 7 + l.home.z * 13) % 100) / 100;
        if (p < 0.65) {
          let v = Rr(
              ["hatch", "sedan", "suv", "sports", "pickup"][Math.floor(p * 50) % 5],
              ["#e8e8e8", "#1c1c1c", "#9aa1a8", "#c0392b", "#1f4e79", "#2e5e3e"][Math.floor(p * 77) % 6],
            ),
            g = new W.Vector3(5.6, 0, 6.2).applyAxisAngle(new W.Vector3(0, 1, 0), d);
          (v.position.set(l.home.x + g.x, 0, l.home.z + g.z), (v.rotation.y = d + Math.PI / 2), n.add(v));
        }
      }),
        o.plots.forEach((l) => {
          let c = new W.Group();
          c.position.set(l.x, 0, l.z);
          let d = new W.Mesh(
            new W.PlaneGeometry(13, 13),
            new W.MeshStandardMaterial({ color: "#6b8f4a", roughness: 1 }),
          );
          ((d.rotation.x = -Math.PI / 2), (d.position.y = 0.03), c.add(d));
          let h = new W.MeshStandardMaterial({ color: "#efe9de", roughness: 0.8 });
          for (let f = 0; f < 4; f++)
            for (let y = -3; y <= 3; y++) {
              if (f === 0 && Math.abs(y) < 1) continue;
              let x = (f * Math.PI) / 2,
                k = new W.Mesh(new W.BoxGeometry(0.12, 0.8, 0.12), h),
                b = new W.Vector3(y * 2.1, 0.4, 6.5).applyAxisAngle(new W.Vector3(0, 1, 0), x);
              (k.position.copy(b), c.add(k));
            }
          let u = document.createElement("canvas");
          ((u.width = 256), (u.height = 160));
          let p = u.getContext("2d");
          ((p.fillStyle = "#c0392b"),
            p.fillRect(0, 0, 256, 160),
            (p.fillStyle = "#fff"),
            (p.font = '400 64px "Bebas Neue", Impact, sans-serif'),
            (p.textAlign = "center"),
            p.fillText("FREE PLOT", 128, 78),
            (p.font = '700 24px "Plus Jakarta Sans", sans-serif'),
            p.fillText("Claim & build", 128, 124));
          let v = new W.Mesh(
            new W.PlaneGeometry(1.8, 1.1),
            new W.MeshStandardMaterial({ map: new W.CanvasTexture(u), roughness: 0.7 }),
          );
          (v.position.set(0, 1.5, 6.6), c.add(v));
          let g = new W.Mesh(new W.BoxGeometry(0.1, 1.2, 0.1), h);
          (g.position.set(0, 0.6, 6.55), c.add(g), n.add(c));
          let m = {
            pos: new W.Vector3(l.x, 0, l.z),
            radius: 6,
            label: "Free plot \u2014 move your home here",
            action: "plot",
            use: () => o8(l.x, l.z),
            obj: v,
          };
          ((v.userData.interact = m), i.interacts.push(m));
        }));
      let s = new Set(r.game.collected);
      (o.orbs.forEach((l) => {
        if (s.has(l.id)) return;
        let c = zg(0.28);
        (c.position.set(l.x, l.y, l.z), n.add(c), i.orbs.push({ id: l.id, obj: c, y: l.y }));
      }),
        o.trees.forEach((l) => {
          let c = ya(l.c, l.s * 1.2, Math.abs(Math.round(l.x * 13 + l.z * 7)));
          (c.position.set(l.x, 0, l.z), n.add(c));
        }),
        o.lamps.forEach((l, c) => {
          n.add(Ni(l.x, l.z));
          let d = Math.abs(e * 73 + a * 37 + c * 11) % 7,
            h = Math.abs(((((l.z + 32) % 64) + 64) % 64) - 32) > 20,
            u = h
              ? l.z > Math.round((l.z - 32) / 64) * 64 + 32
                ? Math.PI
                : 0
              : l.x > Math.round((l.x - 32) / 64) * 64 + 32
                ? -Math.PI / 2
                : Math.PI / 2;
          d === 1
            ? n.add(
                yu(
                  l.x + (h ? 2.2 : 0.6 * Math.sign(Math.sin(u))),
                  l.z + (h ? 0.6 * Math.sign(Math.cos(u)) : 2.2),
                  u,
                ),
              )
            : (d === 3 || d === 5) && n.add(Wg(l.x + (h ? -1.3 : 0), l.z + (h ? 0 : -1.3)));
        }));
      {
        let l = e * sa + sa / 2,
          c = a * sa + sa / 2,
          d = l - 5.4,
          h = c - 5.4;
        if (
          Hi(l, c + 8) &&
          Hi(l + 8, c) &&
          !this.blocked(r).some((u) => Math.hypot(u.x - d, u.z - h) < u.r)
        ) {
          let u = zL(d, h, -Math.PI / 2);
          n.add(u);
        }
      }
      return (
        o.homes.forEach((l) => {
          if ((Math.abs(l.home.x * 7 + l.home.z * 13) % 100) / 100 < 0.65) {
            let d = qg(l.home.x, l.home.z),
              h = new W.Vector3(5.6, 0, 6.2).applyAxisAngle(new W.Vector3(0, 1, 0), d),
              u = os(1.6);
            (u.scale.set(1.1, 1, 2.3),
              (u.rotation.y = d),
              u.position.set(l.home.x + h.x, 0.04, l.home.z + h.z),
              n.add(u));
          }
        }),
        this.world.add(n),
        i
      );
    }
    updateChunks(e = !1) {
      let a = ot(),
        r = this.player.root.position,
        o = Math.floor(r.x / sa + 0.5),
        n = Math.floor(r.z / sa + 0.5),
        i = `${o},${n}`,
        s = JSON.stringify(this.blocked(a).slice(0, 12));
      if (
        (s !== this.sigs.blocked &&
          ((this.sigs.blocked = s),
          (e = !0),
          this.chunks.forEach((d) => {
            (this.world.remove(d.group), Rn(d.group));
          }),
          this.chunks.clear()),
        !e && i === this.lastChunk)
      )
        return;
      this.lastChunk = i;
      let l = new Set(),
        c = a.settings.quality === "low" ? 1 : fR;
      for (let d = -c; d <= c; d++)
        for (let h = -c; h <= c; h++) {
          let u = o + d,
            p = n + h,
            v = `${u},${p}`;
          (l.add(v), this.chunks.has(v) || this.chunks.set(v, this.buildChunk(u, p, a)));
        }
      (this.chunks.forEach((d, h) => {
        !l.has(h) &&
          (Math.abs(d.cx - o) > c + 1 || Math.abs(d.cz - n) > c + 1) &&
          (this.world.remove(d.group), Rn(d.group), this.chunks.delete(h));
      }),
        this.rebuildColliders());
    }
    rebuildColliders() {
      let e = [{ x: 0, z: 18, r: 3.8 }];
      (ot()
        .users.filter((a) => !a.procedural)
        .forEach((a) =>
          e.push({
            x: a.home.x,
            z: a.home.z,
            r: a.home.style === "villa" || a.home.style === "dome" ? 6.8 : 5.4,
          }),
        ),
        [
          ...(this.landmarks || []),
          ...(this.boards ? [this.boards] : []),
          ...(this.signs ? [this.signs] : []),
        ].forEach((a) => e.push(...a.colliders)),
        this.market && e.push(...this.market.colliders),
        this.nation && e.push(...this.nation.colliders),
        this.chunks?.forEach((a) =>
          a.homes.forEach((r) =>
            e.push({
              x: r.u.home.x,
              z: r.u.home.z,
              r: r.u.home.style === "villa" || r.u.home.style === "dome" ? 6.8 : 5.4,
            }),
          ),
        ),
        (this.colliders = e));
    }
    clearInterior() {
      (this.home.children.slice().forEach((e) => {
        e !== this.player.root && (this.home.remove(e), Rn(e));
      }),
        this.interior?.video?.pause(),
        this.innerNpcs.clear(),
        this.dancers.forEach((e) => e.dispose()),
        (this.dancers = []),
        (this.interior = null),
        (this.interiorInteracts = []),
        this.beat.stop());
    }
    buildInterior(e) {
      this.clearInterior();
      let a = null;
      if (e.scene.mode === "shop" && e.scene.owner) {
        let r = qa(e).find((o) => o.id === e.scene.owner);
        r && (a = o7(r, e, ri(r.id)));
      } else
        e.scene.mode === "club"
          ? (a = n7())
          : e.scene.mode === "gov"
            ? (a = I7(e.scene.owner || "passport"))
            : e.scene.mode === "home" && e.scene.owner && e.users.some((r) => r.id === e.scene.owner)
              ? (a = i7(e, e.scene.owner))
              : e.scene.mode === "house" &&
                e.house &&
                e.house.key === e.scene.owner &&
                (a = G7(
                  e.house.key,
                  e.house.int,
                  e.house.label,
                  e.house.residentName,
                  e.decorating ? e.decorSel : null,
                ));
      if (!a) {
        Jr();
        return;
      }
      if (
        ((this.interior = a),
        this.home.add(a.group),
        (this.home.background = new W.Color(e.scene.mode === "club" ? "#050508" : "#1b1d22")),
        (this.groundMeshes = a.group.children.filter((r) => r.name === "ground")),
        (this.interiorInteracts = a.interacts.map((r) => this.toInteract(r))),
        this.interiorInteracts.push({
          pos: new W.Vector3(0, 0, a.bounds.hz - 0.2),
          radius: 1.8,
          label: "Exit to the street",
          action: "exit",
          use: () => Jr(),
        }),
        this.innerNpcs.spawn(a.npcs, this.home),
        a.dancers.forEach((r, o) => {
          let n = new Nn("", "#fff", "", !1, void 0, b7(o + 31));
          ((n.label.visible = !1),
            n.root.position.set(r.x, 0, r.z),
            (n.root.rotation.y = Math.atan2(-r.x, -11 - r.z)),
            (n.loopDance = !0),
            n.doEmote("dance", o * 0.3),
            this.home.add(n.root),
            this.dancers.push(n));
        }),
        e.scene.mode === "club" && e.settings.music && this.beat.start(e.settings.volume),
        e.scene.mode === "home" && e.scene.owner)
      ) {
        let r = e.lives.find((n) => n.hostId === e.scene.owner && n.where === "home"),
          o = e.users.find((n) => n.id === e.scene.owner);
        if (r && o.id !== e.session?.userId) {
          let n = new Nn(o.name, o.color, "LIVE", !1, o.avatar);
          (n.root.position.set(7.5, 0.2, -1),
            (n.root.rotation.y = -Math.PI / 2),
            this.home.add(n.root),
            this.dancers.push(n));
        }
      }
    }
    setVehicle(e) {
      if (
        (this.vehicle &&
          (this.vehicle.obj.parent && this.vehicle.obj.parent.remove(this.vehicle.obj), Rn(this.vehicle.obj)),
        (this.vehicle = null),
        (this.player.body.visible = !0),
        (this.player.root.rotation.z = 0),
        !e)
      ) {
        ((this.player.root.position.y = this.groundAt(
          this.player.root.position.x,
          this.player.root.position.z,
        )),
          (this.player.vy = 0),
          (this.dist = Math.min(this.dist, 12)));
        return;
      }
      if (this.active === this.world)
        if (e === "car" || e === "drive") {
          let a = ot(),
            r = F7(m8() || a.dream.car),
            o = e === "car",
            n = Rr(r.body, r.color, o || !!r.fly);
          (this.player.root.add(n), (this.player.body.visible = !1));
          let i = new v0(r.top, r.accel);
          if (((i.heading = this.player.root.rotation.y), !o)) {
            let s = this.player.root.position;
            if (!Hi(s.x, s.z)) {
              let l = Ig(s.x, s.z);
              if (!l) {
                ((this.player.body.visible = !0),
                  this.player.root.remove(n),
                  Rn(n),
                  setTimeout(() => {
                    (C({ vehicle: null }), F("No road here. Walk to a road to drive your car.", "warn"));
                  }, 0));
                return;
              }
              (s.set(l.x, 0, l.z), (i.heading = l.heading), (this.player.root.rotation.y = l.heading));
            }
          }
          ((this.vehicle = { kind: e, obj: n, t: 0, vy: 0, drive: i, model: r.id }),
            (this.dist = 11),
            (this.pitch = 0.22),
            (this.player.hovering = !1),
            C({ hover: !1 }));
        } else {
          let a = _x();
          (a.position.copy(this.player.root.position), this.world.add(a), (this.player.body.visible = !1));
          let r = Math.random() * Math.PI * 2,
            o = 500 + Math.random() * 900;
          ((this.vehicle = {
            kind: e,
            obj: a,
            t: 0,
            vy: 0,
            dest: new W.Vector3(Math.cos(r) * o, 0, Math.sin(r) * o),
          }),
            (this.dist = 34));
        }
    }
    bumpToast(e) {
      let a = performance.now();
      a - this.lastBump > 2500 && ((this.lastBump = a), F(e, "warn"));
    }
    flyTargets(e, a) {
      let r = performance.now() / 1e3,
        o = this.flyCache;
      if (r - o.t < 0.5 && Math.hypot(o.x - e, o.z - a) < 25) return o.list;
      let n = [],
        i = this.player.root,
        s = new W.Vector3(),
        l = (c) => {
          if (c === i || c.userData?.noBlock || !c.visible) return;
          let d = c;
          if (d.isMesh && !d.isInstancedMesh && d.geometry) {
            let h = d.geometry;
            h.boundingSphere || h.computeBoundingSphere();
            let u = h.boundingSphere;
            if (u) {
              s.copy(u.center).applyMatrix4(d.matrixWorld);
              let p = d.matrixWorld.getMaxScaleOnAxis();
              Math.hypot(s.x - e, s.z - a) - u.radius * p < 70 && s.y + u.radius * p > 0.3 && n.push(d);
            }
          }
          for (let h of c.children) l(h);
        };
      return (
        this.world.updateMatrixWorld(),
        l(this.world),
        (o.t = r),
        (o.x = e),
        (o.z = a),
        (o.list = n),
        n
      );
    }
    flyBlocked(e, a, r, o) {
      let n = this.flyTargets(o.x, o.z);
      if (!n.length) return { side: !1, vert: !1 };
      this.ray.camera = this.camera;
      let i = (p) => p.some((v) => !v.object.isSprite && !v.object.isPoints && !v.object.isLine),
        s = o.x - e,
        l = o.z - a,
        c = Math.hypot(s, l),
        d = !1,
        h = !1;
      if (c > 0.001) {
        let p = new W.Vector3(s / c, 0, l / c);
        this.ray.far = c + 2.4;
        for (let v of [0.1, 0.55, 1, 1.45]) {
          for (let g of [-0.9, 0.9])
            if (
              (this.ray.set(new W.Vector3(e - p.z * g, r + v, a + p.x * g), p),
              i(this.ray.intersectObjects(n, !1)))
            ) {
              d = !0;
              break;
            }
          if (d) break;
        }
      }
      let u = o.y - r;
      if (Math.abs(u) > 0.001) {
        let p = u > 0;
        this.ray.far = Math.abs(u) + (p ? 1.9 : 0.3);
        for (let [v, g] of [
          [0, 0],
          [0.8, 1.6],
          [-0.8, -1.6],
          [0.8, -1.6],
          [-0.8, 1.6],
        ])
          if (
            (this.ray.set(new W.Vector3(e + v, r + (p ? 0 : 0.3), a + g), new W.Vector3(0, p ? 1 : -1, 0)),
            i(this.ray.intersectObjects(n, !1)) && (p || o.y > 0.4))
          ) {
            h = !0;
            break;
          }
      }
      return { side: d, vert: h };
    }
    moveVehicle(e) {
      let a = this.vehicle,
        r = this.player,
        o = r.root.position;
      if (((a.t += e), a.kind === "rocket")) {
        let p = a.obj.getObjectByName("flame");
        if ((p && ((p.visible = !0), p.scale.set(1, 0.8 + Math.random() * 0.5, 1)), a.t < 4.2))
          ((a.obj.position.y = a.t * a.t * 9), (o.y = a.obj.position.y + 4), (a.obj.rotation.y += e * 0.5));
        else if (a.dest && a.t < 4.3)
          (o.set(a.dest.x, 160, a.dest.z),
            a.obj.position.set(a.dest.x, 156, a.dest.z),
            this.camera.position.set(a.dest.x, 190, a.dest.z + 40),
            this.updateChunks(!0),
            (a.dest = void 0));
        else if (a.t < 8) {
          let v = Math.min(1, (a.t - 4.3) / 3.7),
            g = 156 * (1 - v * (2 - v));
          ((a.obj.position.y = g), (o.y = g + 4), (a.obj.rotation.y -= e * 0.4));
        } else {
          let v = Uc(o.x, o.z);
          (this.world.remove(a.obj),
            Rn(a.obj),
            (this.vehicle = null),
            (r.body.visible = !0),
            (o.y = 0),
            (r.vy = 0),
            _h(),
            F(`Touchdown in ${v.name}!`, "xp"));
        }
        return;
      }
      let n = this.keys,
        i = a.drive,
        s = (n.has("w") || n.has("arrowup") ? 1 : 0) - (n.has("s") || n.has("arrowdown") ? 1 : 0),
        l = (n.has("a") || n.has("arrowleft") ? 1 : 0) - (n.has("d") || n.has("arrowright") ? 1 : 0),
        c = a.kind === "car",
        d = i.step(e, { up: s, turn: l, brake: !c && n.has(" "), boost: n.has("shift") }),
        h = o.x,
        u = o.z;
      if (((o.x += d.dx), (o.z += d.dz), c)) {
        let p = (n.has(" ") ? 1 : 0) - (n.has("c") ? 1 : 0);
        a.vy += (p * 12 - a.vy) * Math.min(1, e * 3);
        let v = o.y;
        ((o.y = Math.max(0, Math.min(160, o.y + a.vy * e))), o.y < 14 && this.collide(o));
        let g = this.flyBlocked(h, u, v, o);
        if (
          (g.side &&
            ((o.x = h),
            (o.z = u),
            (i.speed *= -0.2),
            Math.abs(i.speed) > 1 &&
              this.bumpToast("Something is in the way. Fly up (Space), down (C) or turn.")),
          g.vert)
        ) {
          let m = o.y > v;
          ((o.y = v),
            (a.vy = 0),
            this.bumpToast(m ? "Blocked above. Fly sideways first." : "Blocked below."));
        }
        ((a.obj.rotation.z = W.MathUtils.clamp(-i.steer * i.speed * 0.02, -0.35, 0.35)),
          (a.obj.rotation.x = W.MathUtils.clamp(-a.vy * 0.02, -0.25, 0.25)),
          (a.obj.position.y = o.y > 0.5 ? Math.sin(a.t * 2) * 0.08 : 0));
      } else {
        !Hi(o.x, o.z) &&
          Hi(h, u) &&
          (Hi(h, o.z)
            ? ((o.x = h), (i.speed *= 0.97))
            : Hi(o.x, u)
              ? ((o.z = u), (i.speed *= 0.97))
              : ((o.x = h),
                (o.z = u),
                (i.speed *= 0.5),
                this.bumpToast("Cars stay on the road. Park (E) and walk from here.")));
        let p = o.clone();
        (this.collide(o),
          p.distanceToSquared(o) > 1e-4 && ((i.speed *= -0.25), Math.abs(i.speed) > 3 && F("Bump!", "warn")),
          (o.y = this.groundAt(o.x, o.z) > 0.5 && !vd(o.x, o.z) ? this.groundAt(o.x, o.z) : 0),
          vd(o.x, o.z) && ((o.x = h), (o.z = u), (i.speed = 0)),
          (a.obj.rotation.x = W.MathUtils.clamp(-s * i.speed * 0.002, -0.03, 0.03)));
      }
      ($s(a.obj, i.speed, e, i.steer * 0.6),
        (r.root.rotation.y = i.heading),
        (r.speed = Math.abs(i.speed)),
        r.vel.set(d.dx / Math.max(e, 0.001), 0, d.dz / Math.max(e, 0.001)),
        !this.pointer.down &&
          Math.abs(i.speed) > 1 &&
          (this.yaw = wu(this.yaw, i.heading + Math.PI, Math.min(1, e * 2.2))),
        (r.root.userData.groundY = o.y),
        Math.abs(i.speed) > 0.5 &&
          vR({ speedKmh: Math.round(Math.abs(i.speed) * 3.6), altitude: Math.round(o.y) }));
    }
    spawnBots() {
      for (let e = 0; e < 24; e++) {
        let a = vp((e * 53) % mp),
          r = {
            id: a.id,
            name: a.name,
            role: a.role,
            x: 0,
            z: 0,
            wander: 0,
            outfit: {
              skin: a.skin,
              hair: a.hair,
              hairColor: "#2a1a12",
              top: a.top,
              bottom: "#2b303a",
              shoes: "#efefef",
            },
            persona: xp(a),
            greeting: a.greeting,
            quick: ["What do you do?", "Any place you recommend?", "Tell me about yourself"],
          },
          o = new Nn(a.name, "#ffffff", a.role, !1, void 0, r.outfit);
        o.def = r;
        let n = Math.random() * Math.PI * 2,
          i = 20 + Math.random() * 40;
        (o.root.position.set(Math.cos(n) * i, 0, Math.sin(n) * i),
          (o.wait = Math.random() * 3),
          (o.spd = 1.3),
          this.bots.push(o),
          this.world.add(o.root));
      }
    }
    pickBotTarget(e, a) {
      let r = this.player.root.position;
      if (a.lives.find((n) => n.where === "plaza") && Math.random() < 0.4) {
        let n = (Math.random() - 0.5) * Math.PI * 0.75,
          i = ds + 1.5 + Math.random() * 4.5;
        return new W.Vector3(Math.sin(n) * i, 0, Math.cos(n) * i);
      }
      if (Math.abs(r.z) < 40 && r.x > 30 && r.x < 330 && Math.random() < 0.7)
        return new W.Vector3(r.x + (Math.random() - 0.5) * 70, 0, (Math.random() - 0.5) * 14);
      for (let n = 0; n < 6; n++) {
        let i = Math.random() * Math.PI * 2,
          s = 6 + Math.random() * 40,
          l = new W.Vector3(r.x + Math.cos(i) * s, 0, r.z + Math.sin(i) * s);
        if (
          this.colliders.every((c) => Math.hypot(c.x - l.x, c.z - l.z) > c.r + 1.5) &&
          Math.hypot(l.x, l.z) > ds + 1 &&
          !vd(l.x, l.z) &&
          !(window.__fyrusWet && window.__fyrusWet(l.x, l.z)) &&
          !(window.__fyrusSolid && window.__fyrusSolid(l.x, l.z))
        )
          return l;
      }
      return new W.Vector3(r.x + 10, 0, r.z + 10);
    }
    floorHit(e, a) {
      let r = this.renderer.domElement.getBoundingClientRect();
      (this.ndc.set(((e - r.left) / r.width) * 2 - 1, -((a - r.top) / r.height) * 2 + 1),
        this.raycaster.setFromCamera(this.ndc, this.camera));
      let o = new W.Vector3();
      return this.raycaster.ray.intersectPlane(new W.Plane(new W.Vector3(0, 1, 0), 0), o) ? o : null;
    }
    decorDown(e, a) {
      let r = ot(),
        o = this.interior;
      if (!r.decorating || !o?.house || this.active !== this.home) return;
      let n = this.renderer.domElement.getBoundingClientRect();
      (this.ndc.set(((e - n.left) / n.width) * 2 - 1, -((a - n.top) / n.height) * 2 + 1),
        this.raycaster.setFromCamera(this.ndc, this.camera));
      let i = this.raycaster.intersectObjects(o.items, !0)[0];
      if (!i) return;
      let s = i.object;
      for (; s && s.userData.idx === void 0; ) s = s.parent;
      if (!s) return;
      let l = this.floorHit(e, a);
      ((this.drag = {
        idx: s.userData.idx,
        obj: s,
        dx: l ? s.position.x - l.x : 0,
        dz: l ? s.position.z - l.z : 0,
      }),
        Ih(s.userData.idx));
    }
    frontSpot() {
      let e = this.player.root.position,
        a = this.player.root.rotation.y,
        r = this.interior?.bounds || { hx: 4, hz: 4 },
        o = W.MathUtils.clamp(e.x + Math.sin(a) * 1.8, -r.hx, r.hx),
        n = W.MathUtils.clamp(e.z + Math.cos(a) * 1.8, -r.hz, r.hz);
      return {
        x: Math.round(o * 10) / 10,
        z: Math.round(n * 10) / 10,
        r: (Math.round(((a * 180) / Math.PI + 180) / 45) * 45) % 360,
      };
    }
    bindInput() {
      (window.addEventListener("keydown", this.onKeyDown),
        window.addEventListener("keyup", this.onKeyUp),
        window.addEventListener("blur", this.onBlur));
      let e = this.renderer.domElement;
      (e.addEventListener("pointerdown", this.onPointerDown),
        e.addEventListener("pointermove", this.onPointerMove),
        e.addEventListener("pointerup", this.onPointerUp),
        e.addEventListener("wheel", this.onWheel, { passive: !1 }));
    }
    jump() {
      let e = this.player;
      e.grounded && !this.swimming && ((e.vy = e.hovering ? 7 : 8), (e.grounded = !1));
    }
    toggleHover() {
      ((this.player.hovering = !this.player.hovering), C({ hover: this.player.hovering }));
    }
    doEmote(e) {
      (this.player.doEmote(e, this.clock.elapsedTime),
        uM(),
        this.presence.send({
          t: "chat",
          text: "::emote:" + e,
          name: "",
          color: "",
          scene: "",
          x: 0,
          z: 0,
          ry: 0,
        }));
    }
    talkInteracts(e) {
      return e.list.map((a) => ({
        pos: a.av.root.position,
        radius: 2.4,
        label: `Talk to ${a.def.name}`,
        action: "talk",
        use: () => Q2(a.def),
        obj: a.av.body,
      }));
    }
    allInteracts() {
      if (this.active === this.home)
        return [...this.interiorInteracts, ...this.talkInteracts(this.innerNpcs)];
      let e = [
        ...this.staticInteracts,
        ...this.fixed.interacts,
        ...this.lmInteracts,
        ...this.marketInteracts,
        ...this.nationInteracts,
        ...this.talkInteracts(this.npcs),
      ];
      (this.bots.forEach((o) =>
        e.push({
          pos: o.root.position,
          radius: 2,
          label: `Talk to ${o.def.name}`,
          action: "talk",
          use: () => Q2(o.def),
          obj: o.body,
        }),
      ),
        this.chunks.forEach((o) => e.push(...o.interacts)));
      let a = this.player.root.position,
        r = Iw(a.x, a.z);
      if (r) {
        let o = ot().estate?.plots[r.id],
          n = Mh(r.soc),
          i = o
            ? `Plot ${r.id} \xB7 ${o.ownerName}${o.auction ? " \xB7 auction" : o.sale ? ` \xB7 for sale ${o.sale.toLocaleString("en-US")} FYC` : o.rent && !o.rent.tenant ? ` \xB7 for rent ${o.rent.price.toLocaleString("en-US")} FYC/month` : ""}`
            : r.empty
              ? `Plot ${r.id} \xB7 ${n.name} \xB7 for sale ${r.price.toLocaleString("en-US")} FYC`
              : `Plot ${r.id} \xB7 home of ${r.resident}`,
          s = o && !o.auction && !o.sale && !(o.rent && !o.rent.tenant);
        if (s) {
          let l = (o.owner === ot().net.id && !o.rent?.tenant) || o.rent?.tenant === ot().net.id,
            c = ot().homesLock[r.id] || "private",
            d = o.rent?.tenantName || o.ownerName;
          e.push({
            pos: new W.Vector3(r.x, 0, r.z + r.face * (r.size * 0.33 + 1.2)),
            radius: 4.5,
            label: l
              ? `Your home ${r.id} \u2014 go inside`
              : `Door \xB7 ${d}'s home ${r.id} \xB7 ${c === "open" ? "open house \u2014 walk in" : c === "keys" ? "locked (keys)" : "private \u2014 knock"}`,
            action: "door",
            use: () => Jn(r.id),
          });
        }
        e.push({
          pos: new W.Vector3(r.x, 0, r.z + r.face * (r.size / 2)),
          radius: s ? 3 : 7,
          label: i,
          action: "estate",
          use: () => zo(r.soc, r.id),
        });
      }
      {
        let o = ot().jobsMe?.shift,
          n = o && Nl(o.svc);
        n &&
          !n.interior &&
          this.services &&
          this.services.stations(n.id).forEach((i, s) => {
            n.job?.stations[s] &&
              e.push({
                pos: i,
                radius: 1.8,
                label: (s === o.station ? "\u25B6 " : "") + n.job.stations[s],
                action: "jobtask",
                use: () => jv(s),
              });
          });
      }
      if (Math.abs(a.x - Jt.x) < 60 && Math.abs(a.z - Jt.z) < 70) {
        let o = ot().estateMine?.studio || "";
        for (let n = 0; n < Jt.towers; n++) {
          let i = Jt.x + ((n % 3) - 1) * 30,
            s = Jt.z + (Math.floor(n / 3) - 0.5) * 50 + 7.6,
            l = o.startsWith(`SC-T${n + 1}-`);
          e.push({
            pos: new W.Vector3(i, 0, s),
            radius: 3.2,
            label: l ? `Tower ${n + 1} \u2014 go up to my studio ${o}` : `Tower ${n + 1} \xB7 free studios`,
            action: "door",
            use: () => (l ? Jn("studio:" + o) : zo("starter")),
          });
        }
      }
      return e;
    }
    click(e, a) {
      let r = this.renderer.domElement.getBoundingClientRect();
      (this.ndc.set(((e - r.left) / r.width) * 2 - 1, -((a - r.top) / r.height) * 2 + 1),
        this.raycaster.setFromCamera(this.ndc, this.camera));
      let o = this.player.root.position,
        n = this.allInteracts()
          .filter((l) => l.obj && l.pos.distanceTo(o) < 60)
          .map((l) => l.obj),
        i = this.raycaster.intersectObjects(n, !0)[0];
      if (i) {
        let l = i.object;
        for (; l && !l.userData.interact; ) l = l.parent;
        let c = l?.userData.interact;
        if (!c) {
          let d = this.allInteracts(),
            h = i.object;
          for (; h && !c; ) ((c = d.find((u) => u.obj === h)), (h = h.parent));
        }
        if (c) {
          c.pos.distanceTo(o) < c.radius + 8 ? c.use() : (this.player.target = c.pos.clone());
          return;
        }
      }
      let s = this.raycaster.intersectObjects(this.groundMeshes, !1)[0];
      s &&
        ((this.player.target = s.point.clone().setY(0)),
        this.clickMarker.position.set(
          s.point.x,
          (this.active === this.world ? this.groundAt(s.point.x, s.point.z) : 0) + 0.06,
          s.point.z,
        ),
        (this.clickMarker.material.opacity = 1),
        this.clickMarker.parent !== this.active && this.active.add(this.clickMarker));
    }
    useNearest() {
      if (this.trip) return;
      let e = this.player.root.position,
        a = null,
        r = 1e9;
      for (let o of this.allInteracts()) {
        let n = Math.hypot(o.pos.x - e.x, o.pos.z - e.z);
        n < o.radius && n < r && ((r = n), (a = o));
      }
      a?.use();
    }
    sync(e) {
      if (this.disposed) return;
      let a =
        e.users
          .filter((m) => !m.procedural)
          .map((m) => `${m.id}${m.name}${JSON.stringify(m.home)}`)
          .join("|") +
        "#" +
        e.lives
          .filter((m) => m.where === "home")
          .map((m) => m.hostId)
          .join(",");
      if (a !== this.sigs.fixed) {
        let m = e.users.find((x) => x.id === e.session?.userId),
          f = m ? `${m.home.style}${m.home.floors}${m.home.x}${m.home.z}` : "",
          y = !!this.sigs.fixed && f !== this.sigs.mine;
        ((this.sigs.mine = f),
          (this.sigs.fixed = a),
          this.buildFixedHomes(e, y),
          this.sigs.blocked && this.updateChunks());
      }
      let r = JSON.stringify(
        qa(e).map((m) => [m.id, m.row, m.slot, m.name, m.tagline, m.primary, m.secondary, m.facade, m.font]),
      );
      r !== this.sigs.market && ((this.sigs.market = r), this.rebuildMarket(e));
      let o = JSON.stringify(e.plots) + JSON.stringify(e.sharedPlots) + (e.session?.userId || "");
      o !== this.sigs.nation && ((this.sigs.nation = o), this.rebuildNation(e));
      let n = JSON.stringify(e.estate?.plots || {}) + (e.net.id || "") + JSON.stringify(e.homesExt);
      n !== this.sigs.est &&
        this.societies &&
        ((this.sigs.est = n), this.societies.refresh(e.estate?.plots || {}, e.net.id, e.homesExt));
      let i = e.users.find((m) => m.id === e.session?.userId),
        s = JSON.stringify(i?.avatar || {}) + i?.color;
      if (
        (s !== this.sigs.avatar &&
          ((this.sigs.avatar = s),
          i?.avatar &&
            (this.player.applyStyle(i.avatar), i.avatar.outfit && this.player.setOutfit(i.avatar.outfit))),
        e.settings.quality !== this.sigs.quality)
      ) {
        let m = !this.sigs.quality;
        ((this.sigs.quality = e.settings.quality),
          m || (this.applyQuality(e.settings.quality), this.resize(), this.updateChunks(!0)));
      }
      let l = e.scene.owner && e.users.find((m) => m.id === e.scene.owner),
        c = e.scene.mode + (e.scene.owner || ""),
        d =
          e.scene.mode === "home" && l
            ? `${l.id}${JSON.stringify(l.home)}${JSON.stringify(e.homeSlots[l.id] || [])}${JSON.stringify(e.decor[l.id] || [])}${e.lives.filter((m) => m.hostId === l.id).length}${e.videos.length}`
            : e.scene.mode === "shop"
              ? JSON.stringify(qa(e).find((m) => m.id === e.scene.owner)) +
                e.brands.map((m) => m.products.length).join()
              : e.scene.mode === "house"
                ? JSON.stringify(e.house?.int || {})
                : e.scene.mode === "gov" && e.scene.owner === "parliament" && e.politics
                  ? JSON.stringify([
                      e.politics.n,
                      e.politics.phase,
                      e.politics.office?.n,
                      e.politics.parties.map((m) => m.id + m.symbol + m.color),
                      e.politics.partyVotes,
                      e.politics.cands.length,
                    ])
                  : "";
      e.scene.mode === "house" &&
        this.interior?.house &&
        this.interior.select(e.decorating ? e.decorSel : null);
      let h = JSON.stringify(this.adList(e).map((m) => m.id + (m.video ? "v" : "")));
      if (h !== this.sigs.ads) {
        let m = !this.sigs.ads;
        ((this.sigs.ads = h), m || this.rebuildBoards(e));
      }
      if (c !== this.sigs.scene) {
        let m = this.active === this.world;
        if (((this.sigs.scene = c), e.scene.mode === "mall" || e.scene.mode === "arcade")) {
          Jr();
          return;
        }
        if (e.scene.mode !== "plaza") {
          if (
            (m &&
              (this.sigs.returnPos = JSON.stringify([
                this.player.root.position.x,
                this.player.root.position.z,
              ])),
            this.buildInterior(e),
            (this.sigs.inner = d),
            !this.interior)
          )
            return;
          ((this.active = this.home),
            this.home.add(this.player.root),
            this.player.root.position.copy(this.interior.spawn),
            (this.player.target = null),
            (this.yaw = 0),
            (this.dist = Math.min(this.dist, 7)),
            this.setSwimming(!1));
        } else if (
          (this.clearInterior(),
          (this.active = this.world),
          this.world.add(this.player.root),
          (this.player.target = null),
          (this.groundMeshes = [this.ground]),
          this.sigs.returnPos)
        ) {
          let [f, y] = JSON.parse(this.sigs.returnPos),
            x = new W.Vector3(f, 0, y);
          (this.player.root.position.copy(x), (this.yaw = Math.atan2(f - 0, 0) * 0));
        }
      } else if (d && d !== this.sigs.inner) {
        this.sigs.inner = d;
        let m = this.player.root.position.clone();
        (this.buildInterior(e), this.player.root.position.copy(m));
      }
      let u = e.vehicle || "";
      u !== this.sigs.vehicle && ((this.sigs.vehicle = u), this.setVehicle(e.vehicle));
      let p = e.lives.find((m) => m.where === "plaza"),
        v = p ? p.hostId : "";
      if (v !== this.sigs.host)
        if (
          ((this.sigs.host = v),
          this.stage.host &&
            (this.world.remove(this.stage.host.root), this.stage.host.dispose(), (this.stage.host = null)),
          p && p.hostId !== e.session?.userId)
        ) {
          let m = e.users.find((y) => y.id === p.hostId),
            f = new Nn(m?.name || "Host", m?.color || "#fff", "LIVE", !1, m?.avatar);
          (f.root.position.set(0, 0.6, -2), this.world.add(f.root), (this.stage.host = f));
        } else
          p &&
            p.hostId === e.session?.userId &&
            this.active === this.world &&
            (this.player.root.position.set(0, 0.6, -1.5),
            (this.player.target = null),
            (this.yaw = 0),
            (this.player.root.rotation.y = 0));
      (e.showcase && !this.sigs.showcaseOn && ((this.sigs.showcaseOn = "1"), this.playBuild()),
        e.showcase || (this.sigs.showcaseOn = ""),
        e.inspect || (this.inspectTarget = null),
        (e.photo || "") !== (this.sigs.photo || "") &&
          ((this.sigs.photo = e.photo || ""), this.player.setPhoto(e.photo)),
        e.intro && this.introT < 0 && (this.introT = 0),
        e.intro || (this.introT = -1));
      let g = e.waypoint;
      ((this.waypointBeam.visible = !!g),
        g && this.waypointBeam.position.set(g.x, 60, g.z),
        e.scene.mode === "club" &&
          (e.settings.music ? this.beat.start(e.settings.volume) : this.beat.stop(),
          this.beat.setVolume(e.settings.volume)),
        this.audio.setEnabled(e.audioOn));
    }
    resize() {
      let e = this.el.clientWidth || 1,
        a = this.el.clientHeight || 1;
      (this.renderer.setSize(e, a, !1),
        (this.renderer.domElement.style.width = "100%"),
        (this.renderer.domElement.style.height = "100%"),
        (this.camera.aspect = e / a),
        this.camera.updateProjectionMatrix());
    }
    groundAt(e, a) {
      if (this.active === this.world && window.__fyrusGround) {
        let gh = window.__fyrusGround(e, a);
        if (gh != null) return gh;
      }
      return this.active !== this.world
        ? 0
        : Math.hypot(e, a) < ds
          ? 0.6
          : vd(e, a) || a < we.water
            ? -0.55
            : XL(e, a)
              ? Ze.deck
              : 0;
    }
    setSwimming(e) {
      e !== this.swimming &&
        ((this.swimming = e),
        (this.player.swimming = e),
        C({ swimming: e }),
        e && F("Swimming! Walk to the edge to climb out.", "info"));
    }
    movePlayer(e) {
      if (this.vehicle) return this.moveVehicle(e);
      let a = this.player,
        r = a.root.position,
        o = new W.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)),
        n = new W.Vector3(-o.z, 0, o.x),
        i = new W.Vector3(),
        s = this.keys;
      ((s.has("w") || s.has("arrowup")) && i.add(o),
        (s.has("s") || s.has("arrowdown")) && i.sub(o),
        (s.has("d") || s.has("arrowright")) && i.add(n),
        (s.has("a") || s.has("arrowleft")) && i.sub(n),
        s.has("q") && (this.yaw += e * 1.8),
        s.has("z") && (this.yaw -= e * 1.8));
      let l = (this.swimming ? 2.4 : 4.6 * (s.has("shift") ? 1.9 : 1)) * (a.hovering ? 2.3 : 1);
      if (i.lengthSq() > 0) ((a.target = null), i.normalize(), ot().showcase && C({ showcase: !1 }));
      else if (a.target) {
        let h = a.target.clone().sub(r).setY(0);
        h.length() < 0.3 ? (a.target = null) : i.copy(h.normalize());
      }
      (a.vel.lerp(i.multiplyScalar(l), Math.min(1, e * (a.hovering || this.swimming ? 4 : 10))),
        (r.x += a.vel.x * e),
        (r.z += a.vel.z * e),
        this.collide(r),
        (a.speed = Math.hypot(a.vel.x, a.vel.z)),
        a.speed > 0.3 &&
          (a.root.rotation.y = wu(a.root.rotation.y, Math.atan2(a.vel.x, a.vel.z), Math.min(1, e * 12))));
      let c = this.groundAt(r.x, r.z);
      ((a.root.userData.groundY = c), r.z < -1900 && (r.z = -1900));
      let wet = window.__fyrusWet ? window.__fyrusWet(r.x, r.z) : null,
        d = this.active === this.world && (wet != null ? wet : vd(r.x, r.z) || r.z < we.water) && !a.hovering;
      if ((this.setSwimming(d), d)) {
        ((r.y += (c - r.y) * Math.min(1, e * 6)), (a.vy = 0), (a.grounded = !0));
        return;
      }
      ((a.vy -= 24 * e), (r.y += a.vy * e), r.y <= c && ((r.y = c), (a.vy = 0), (a.grounded = !0)));
    }
    collide(e) {
      if (this.active === this.world)
        for (let a of this.colliders.concat(this.traffic ? this.traffic.colliders() : [])) {
          let r = e.x - a.x,
            o = e.z - a.z,
            n = Math.hypot(r, o);
          n < a.r && n > 0.001 && ((e.x = a.x + (r / n) * a.r), (e.z = a.z + (o / n) * a.r));
        }
      if (this.active === this.world) window.__fyrusCollide && window.__fyrusCollide(e);
      else if (this.interior) {
        let { hx: a, hz: r } = this.interior.bounds;
        ((e.x = W.MathUtils.clamp(e.x, -a, a)), (e.z = W.MathUtils.clamp(e.z, -r, r)));
        for (let o of this.interior.blocks) {
          let n = e.x - o.x,
            i = e.z - o.z,
            s = o.hx + 0.3 - Math.abs(n),
            l = o.hz + 0.3 - Math.abs(i);
          s > 0 && l > 0 && (s < l ? (e.x += Math.sign(n || 1) * s) : (e.z += Math.sign(i || 1) * l));
        }
      }
    }
    introCamera(e) {
      let a = [
          new W.Vector3(-60, 90, -360),
          new W.Vector3(60, 60, -160),
          new W.Vector3(90, 30, -40),
          new W.Vector3(200, 14, 0),
          new W.Vector3(60, 12, 30),
          new W.Vector3(0, 6, 48),
        ],
        r = [
          new W.Vector3(0, 30, -270),
          new W.Vector3(0, 20, -40),
          new W.Vector3(120, 4, 0),
          new W.Vector3(260, 4, 0),
          new W.Vector3(0, 6, 0),
          new W.Vector3(0, 3, 30),
        ],
        o = Math.min(0.999, e / 14) * (a.length - 1),
        n = Math.floor(o),
        i = o - n,
        s = i * i * (3 - 2 * i);
      (this.camera.position.lerpVectors(a[n], a[n + 1], s),
        this.camera.lookAt(new W.Vector3().lerpVectors(r[n], r[n + 1], s)));
    }
    tick() {
      if (this.disposed) return;
      let e = Math.min(0.05, this.clock.getDelta()),
        a = this.clock.elapsedTime,
        r = ot();
      (this.player.setMask(!!r.settings.stealth),
        jL(a),
        this.trip ? this.tickTrip(e) : (this.movePlayer(e), this.royalGate(a)),
        this.player.update(e, a),
        this.player.ensureTrail(this.active));
      let o = this.clickMarker.material;
      ((o.opacity *= 0.94), this.clickMarker.scale.setScalar(1 + (1 - o.opacity) * 1.5));
      let n = this.player.root.position,
        i = this.fixed.homes.get(r.session?.userId || "");
      if (this.clipT >= 0) {
        this.clipT += e;
        let d = this.clipT / this.clipDur,
          h = this.player.root.rotation.y + d * Math.PI * 2,
          u = 9 - Math.sin(d * Math.PI) * 4;
        (this.camera.position.set(
          n.x + Math.sin(h) * u,
          n.y + 2.2 + Math.sin(d * Math.PI) * 3,
          n.z + Math.cos(h) * u,
        ),
          this.camera.lookAt(n.x, n.y + 1.4, n.z));
      } else if (this.trip) {
        let d = this.trip.frame(this.trip.t);
        (this.camera.position.lerp(d.pos, Math.min(1, e * 10)), this.camera.lookAt(d.look));
      } else if (this.introT >= 0 && this.active === this.world)
        ((this.introT += e), this.introCamera(this.introT));
      else {
        let d, h;
        if (r.inspect && this.inspectTarget) {
          let p = this.inspectTarget,
            v = this.player.root.position,
            g = new W.Vector3(v.x - p.x, 0, v.z - p.z);
          (g.lengthSq() < 0.01 && g.set(0, 0, 1),
            g.normalize(),
            (d = p
              .clone()
              .addScaledVector(g, 2.6)
              .add(new W.Vector3(0, 0.6, 0))),
            (h = p.clone()));
        } else if (r.showcase && i && this.active === this.world) {
          let p = i.group.position,
            v = a * 0.25,
            g = 26 + i.height * 0.6;
          ((d = new W.Vector3(p.x + Math.sin(v) * g, i.height * 0.7 + 6, p.z + Math.cos(v) * g)),
            (h = new W.Vector3(p.x, i.height * 0.45, p.z)));
        } else {
          let p = this.active === this.home ? Math.min(this.dist, 7) : this.dist;
          ((d = new W.Vector3(
            n.x + Math.sin(this.yaw) * Math.cos(this.pitch) * p,
            n.y + 1.7 + Math.sin(this.pitch) * p,
            n.z + Math.cos(this.yaw) * Math.cos(this.pitch) * p,
          )),
            (h = new W.Vector3(n.x, n.y + 1.5, n.z)),
            this.active === this.world && window.__fyrusCamera && window.__fyrusCamera(d, h),
            this.active === this.home &&
              this.interior &&
              ((d.x = W.MathUtils.clamp(d.x, -this.interior.bounds.hx, this.interior.bounds.hx)),
              (d.z = W.MathUtils.clamp(d.z, -this.interior.bounds.hz - 0.3, this.interior.bounds.hz + 0.3)),
              (d.y = Math.min(d.y, r.scene.mode === "club" || r.scene.mode === "gov" ? 7.5 : 4.3))));
        }
        this.camera.position.lerp(d, Math.min(1, e * (r.showcase ? 2 : 7)));
        let u =
          this.active === this.world
            ? this.groundAt(this.camera.position.x, this.camera.position.z) + 0.6
            : 0.6;
        (this.camera.position.y < u && (this.camera.position.y = u), this.camera.lookAt(h));
      }
      if (this.build) {
        this.build.t += e / 3.2;
        let d = Math.min(1, 1 - Math.pow(1 - this.build.t, 3));
        (this.build.mats.forEach((h) => (h.uniforms.uBuild.value = d)),
          this.build.t >= 1 && (this.build = null));
      }
      if (
        (this.env.update(
          e,
          a,
          r.settings,
          this.camera,
          this.active === this.world ? n : new W.Vector3(),
          this.renderer,
        ),
        this.active === this.world)
      ) {
        if (
          (this.ground.position.set(Math.round(n.x / 16) * 16, 0, Math.round(n.z / 16) * 16),
          this.shadowCatcher.position.set(n.x, 0.02, n.z),
          this.groundMat.uniforms.uCam.value.copy(this.camera.position),
          (this.stage.core.rotation.y += e * 0.25),
          (this.stage.core.children[1].rotation.z += e * 0.4),
          this.stage.host?.update(e, a),
          this.fixed.homes.forEach((d) => Hx(d, e, a)),
          this.chunks.forEach((d) => {
            d.homes.forEach((h) => Hx(h.mesh, e, a));
            for (let h = d.orbs.length - 1; h >= 0; h--) {
              let u = d.orbs[h];
              ((u.obj.position.y = u.y + Math.sin(a * 2 + h) * 0.25),
                (u.obj.rotation.y += e * 1.5),
                (u.obj.children[1].rotation.x = a * 1.3 + h),
                Math.hypot(u.obj.position.x - n.x, u.obj.position.z - n.z) < 1.8 &&
                  Math.abs(u.obj.position.y - n.y - 1) < 2.5 &&
                  (dM(u.id),
                  d.group.remove(u.obj),
                  Rn(u.obj),
                  d.orbs.splice(h, 1),
                  window.dispatchEvent(new CustomEvent("fyrus:orb"))));
            }
          }),
          this.updateBots(e, a, r),
          this.traffic.update(e, n, [n, ...this.bots.map((d) => d.root.position)]),
          this.npcs.update(e, a, n, r.talk?.id || null, r.settings.nameTags),
          this.landmarks.forEach((d) => d.tick?.(e, a)),
          this.market?.tick(e, a),
          a - this.t.screen > 0.15 && ((this.t.screen = a), this.drawScreen(a, r)),
          a - this.t.stats > 2 && ((this.t.stats = a), this.refreshStatBoards()),
          a - this.t.lod > 0.4)
        ) {
          ((this.t.lod = a), this.updateChunks());
          let d = (h) => {
            let u = new W.Vector3();
            (h.getWorldPosition(u),
              (h.visible = r.settings.nameTags && Math.hypot(u.x - n.x, u.z - n.z) < 30));
          };
          (this.chunks.forEach((h) => h.labels.forEach(d)), this.fixed.homes.forEach((h) => d(h.label)));
        }
        if (a - this.t.slow > 0.5) {
          this.t.slow = a;
          let d = Hr.find(
              (p) =>
                p.id !== "capital" &&
                Math.abs(n.x - p.x) < (p.cols * p.gap) / 2 + 14 &&
                Math.abs(n.z - p.z) < (p.rows * p.gap) / 2 + 14,
            ),
            h = (window.__fyrusRegion && window.__fyrusRegion(n.x, n.z)) || (d ? { key: `city:${d.id}`, name: d.name } : Uc(n.x, n.z));
          h.key !== this.lastDistrict && ((this.lastDistrict = h.key), hM(h.key, h.name));
          let u = { x: Math.round(n.x), z: Math.round(n.z) };
          ((Math.abs(u.x - r.coords.x) > 1 || Math.abs(u.z - r.coords.z) > 1) && C({ coords: u }),
            r.waypoint &&
              Math.hypot(r.waypoint.x - n.x, r.waypoint.z - n.z) < 8 &&
              (od(null), F(`Arrived: ${r.waypoint.name}`, "xp")));
        }
        ((this.waypointBeam.rotation.y += e),
          this.boards?.videos.forEach((d) => {
            let h = d.pos.distanceTo(n),
              u = r.settings.music && h < 55 && this.userGesture;
            ((d.el.muted = !u),
              u && (d.el.volume = Math.max(0, Math.min(1, (1 - h / 55) * r.settings.volume))),
              d.el.paused && d.el.play().catch(() => {}));
          }));
      } else
        (this.interior?.tick(e, a),
          this.innerNpcs.update(e, a, n, r.talk?.id || null, r.settings.nameTags),
          this.dancers.forEach((d) => d.update(e, a)));
      (this.updatePeers(e, a, r), this.updateNearby());
      let s = r.scene.mode === "plaza" ? "plaza" : r.scene.mode + ":" + (r.scene.owner || ""),
        l =
          r.scene.mode === "home"
            ? r.lives.some((d) => d.where === "home" && d.hostId === r.scene.owner)
              ? new W.Vector3(7.5, 1.6, -1)
              : null
            : r.scene.mode === "plaza" && r.lives.some((d) => d.where === "plaza")
              ? new W.Vector3(0, 2, -2)
              : null,
        c = new W.Vector3();
      if ((this.camera.getWorldDirection(c), this.audio.update(s, l, n, c), a - this.t.presence > 0.1)) {
        this.t.presence = a;
        let d = r.users.find((h) => h.id === r.session?.userId);
        if (r.settings.showOnline) {
          let h =
              this.vehicle && this.vehicle.kind !== "rocket"
                ? (() => {
                    let p = F7(this.vehicle.model || "");
                    return { b: p.body, c: p.color, f: this.vehicle.kind === "car" ? 1 : 0 };
                  })()
                : null,
            u = !!r.settings.stealth;
          this.presence.send({
            t: "pos",
            name: u ? "Anonymous citizen" : d?.name || "Guest",
            color: u ? "#8a8f98" : d?.color || "#fff",
            x: n.x,
            z: n.z,
            ry: this.player.root.rotation.y,
            scene: s,
            o: d?.avatar?.outfit,
            photo: u ? void 0 : r.photo || void 0,
            v: h,
            y: Math.round(n.y * 10) / 10,
          });
        }
        this.presence.prune();
      }
      (this.drawMinimap(r), this.renderer.render(this.active, this.camera));
    }
    refreshStatBoards() {
      if (
        this.market &&
        (this.market.statBoards.forEach((e, a) => {
          let r = ri(a),
            o = `${r.visits}|${r.purchases}|${r.history[r.history.length - 1]}`;
          if (o === e.sig) return;
          e.sig = o;
          let n = this.shops.find((s) => s.id === a);
          if (!n) return;
          let i = e.mat.map;
          ((e.mat.map = E0(n, r)),
            (e.mat.needsUpdate = !0),
            i && e.sig.length && i !== e.mat.map && i.dispose());
        }),
        this.interior?.stat && ot().scene.mode === "shop")
      ) {
        let e = ot().scene.owner,
          a = ri(e),
          r = `${a.visits}|${a.purchases}`,
          o = this.shops.find((n) => n.id === e);
        if (o && r !== this.interior.stat.sig) {
          this.interior.stat.sig = r;
          let n = this.interior.stat.mat.map;
          ((this.interior.stat.mat.map = E0(o, a)), (this.interior.stat.mat.needsUpdate = !0), n?.dispose());
        }
      }
    }
    updateBots(e, a, r) {
      let o = this.player.root.position,
        n = r.talk?.id;
      for (let i of this.bots) {
        let s = i.root.position,
          l = Math.hypot(s.x - o.x, s.z - o.z);
        if (l > 90) {
          let d = Math.random() * Math.PI * 2,
            h = new W.Vector3(o.x + Math.cos(d) * 55, 0, o.z + Math.sin(d) * 55);
          (vd(h.x, h.z) || (window.__fyrusWet && window.__fyrusWet(h.x, h.z)) || s.copy(h), (i.target = null));
        }
        if (n === i.def.id || l < 2.6)
          ((i.target = null),
            i.vel.multiplyScalar(0.8),
            (i.root.rotation.y = wu(
              i.root.rotation.y,
              Math.atan2(o.x - s.x, o.z - s.z),
              Math.min(1, e * 6),
            )));
        else if (
          (i.target ||
            ((i.wait -= e),
            i.wait <= 0 && ((i.target = this.pickBotTarget(i, r)), (i.spd = 1.1 + Math.random() * 0.6))),
          i.target)
        ) {
          let d = i.target.clone().sub(s).setY(0);
          d.length() < 0.5
            ? ((i.target = null),
              (i.wait = 2 + Math.random() * 6),
              Math.random() < 0.1 && i.doEmote("wave", a))
            : i.vel.lerp(d.normalize().multiplyScalar(i.spd), Math.min(1, e * 4));
        } else i.vel.multiplyScalar(0.85);
        s.addScaledVector(i.vel, e);
        let c = Math.hypot(s.x, s.z);
        c < ds + 0.6 && c > 0.01 && ((s.x *= (ds + 0.6) / c), (s.z *= (ds + 0.6) / c));
        for (let d of this.colliders) {
          let h = s.x - d.x,
            u = s.z - d.z,
            p = Math.hypot(h, u);
          p < d.r && p > 0.001 && ((s.x = d.x + (h / p) * d.r), (s.z = d.z + (u / p) * d.r));
        }
        window.__fyrusCollide && window.__fyrusCollide(s);
        let gO = window.__fyrusGround ? window.__fyrusGround(s.x, s.z) : null;
        ((i.speed = i.vel.length()),
          i.speed > 0.2 &&
            (i.root.rotation.y = wu(i.root.rotation.y, Math.atan2(i.vel.x, i.vel.z), Math.min(1, e * 8))),
          (s.y = gO != null ? Math.max(0, gO) : this.groundAt(s.x, s.z) > 0.5 ? 0.6 : 0),
          (i.root.userData.groundY = s.y),
          (i.label.visible = r.settings.nameTags && l < 10),
          i.update(e, a));
      }
    }
    updatePeers(e, a, r) {
      let o = r.scene.mode === "plaza" ? "plaza" : r.scene.mode + ":" + (r.scene.owner || ""),
        n = new Set();
      (this.presence.peers.forEach((i, s) => {
        if (i.scene !== o) return;
        n.add(s);
        let l = this.peers.get(s);
        if (
          (l ||
            ((l = new Nn(i.name, i.color, i.real ? "online player" : "other tab", !1, void 0, i.o || void 0)),
            this.peers.set(s, l),
            (l.label.visible = !0)),
          i.o)
        ) {
          let u = JSON.stringify(i.o);
          u !== l.oSig && (l.oSig && l.setOutfit(i.o), (l.oSig = u));
        }
        (i.photo && l.photoSig !== i.photo.length && ((l.photoSig = i.photo.length), l.setPhoto?.(i.photo)),
          l.setMask?.(!!i.mk));
        let c = i.v ? `${i.v.b}${i.v.c}${i.v.f}` : "";
        (c !== (l.vSig || "") &&
          ((l.vSig = c),
          l.car && (l.root.remove(l.car), Rn(l.car), (l.car = null)),
          (l.body.visible = !i.v),
          i.v && ((l.car = Rr(i.v.b, i.v.c, !!i.v.f)), l.root.add(l.car))),
          l.root.parent !== this.active && this.active.add(l.root));
        let d = l.root.position.clone(),
          h = i.v ? i.y || 0 : this.groundAt(i.x, i.z);
        (l.root.position.lerp(new W.Vector3(i.x, h, i.z), Math.min(1, e * 8)),
          (l.speed = d.distanceTo(l.root.position) / Math.max(e, 0.001)),
          (l.root.rotation.y = wu(l.root.rotation.y, i.ry, Math.min(1, e * 10))),
          l.car && $s(l.car, l.speed, e),
          l.update(e, a));
      }),
        this.peers.forEach((i, s) => {
          n.has(s) ||
            (i.root.parent?.remove(i.root),
            this.presence.peers.has(s) || (i.dispose(), this.peers.delete(s)));
        }));
    }
    peerCount() {
      return this.peers.size;
    }
    updateNearby() {
      if (this.trip) return;
      let e = this.player.root.position,
        a = null,
        r = 1e9;
      for (let n of this.allInteracts()) {
        let i = Math.hypot(n.pos.x - e.x, n.pos.z - e.z);
        i < n.radius && i < r && ((r = i), (a = n));
      }
      let o = a ? a.label : "";
      o !== this.lastNearby &&
        ((this.lastNearby = o),
        C({ nearby: a ? { label: a.label, ownerId: a.ownerId, action: a.action } : null }));
    }
    say(e) {
      this.player.say(e, this.clock.elapsedTime);
      let a = ot().users.find((r) => r.id === ot().session?.userId);
      this.presence.send({
        t: "chat",
        text: e,
        name: a?.name,
        color: a?.color,
        scene: "",
        x: 0,
        z: 0,
        ry: 0,
      });
    }
    teleport(e) {
      let a = ot();
      if (this.active === this.world) {
        let r = this.player.root.position;
        C({ backTo: { x: Math.round(r.x), z: Math.round(r.z), name: a.district } });
      }
      if ((this.active !== this.world && Jr(), (this.player.target = null), (this.yaw = 0), e === "stage"))
        this.player.root.position.set(0, 0, ds + 3);
      else if (e === "spawn") this.player.root.position.set(0, 0, 36);
      else if (e === "home") {
        let r = a.users.find((o) => o.id === a.session?.userId);
        if (r) {
          let o = qg(r.home.x, r.home.z),
            n = new W.Vector3(0, 0, 11).applyAxisAngle(new W.Vector3(0, 1, 0), o);
          (this.player.root.position.set(r.home.x + n.x, 0, r.home.z + n.z), (this.yaw = o));
        }
      } else
        (this.player.root.position.set(e.x, 0, e.z),
          e.face && (this.yaw = Math.atan2(-(e.face.x - e.x), -(e.face.z - e.z))));
      ((this.sigs.returnPos = JSON.stringify([this.player.root.position.x, this.player.root.position.z])),
        this.camera.position.set(this.player.root.position.x, 8, this.player.root.position.z + 10),
        this.updateChunks(!0));
    }
    beginTrip(e, a, r, o, n, i, s = !1) {
      this.active !== this.world && Jr();
      let l = this.player.root.position;
      (C({
        backTo: { x: Math.round(l.x), z: Math.round(l.z), name: ot().district },
        trip: { kind: e, label: a },
        travelOpen: null,
        nearby: null,
      }),
        (this.player.target = null),
        this.player.vel.set(0, 0, 0),
        (this.player.root.visible = s),
        i && ((i.visible = !0), i.parent || this.world.add(i)),
        (this.trip = { t: 0, dur: r, frame: o, onEnd: n, obj: i, keep: s }));
    }
    tickTrip(e) {
      let a = this.trip;
      a.t += e;
      let r = a.frame(Math.min(a.t, a.dur));
      (this.player.root.position.copy(r.body),
        (this.player.root.userData.groundY = r.body.y),
        a.t >= a.dur && this.endTrip());
    }
    endTrip() {
      let e = this.trip;
      e &&
        ((this.trip = null),
        (this.player.root.visible = !0),
        e.obj && e.obj !== this.metro?.train
          ? (e.obj.parent?.remove(e.obj), Rn(e.obj))
          : e.obj && (e.obj.visible = !1),
        C({ trip: null }),
        e.onEnd(),
        (this.player.vy = 0),
        this.updateChunks(!0));
    }
    toggleRideView() {
      return (
        (this.rideView = this.rideView === "rider" ? "outside" : "rider"),
        this.trip && (this.player.root.visible = this.rideView === "outside"),
        this.rideView
      );
    }
    startTour() {
      if (this.trip) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let e = [
          { name: "Fyrus Core Plaza", x: 0, z: 0, h: 40 },
          { name: "Parliament & Central Bank", x: -58, z: -5, h: 34 },
          { name: "Fyrus News TV", x: wn.newstv.x, z: wn.newstv.z, h: 42 },
          { name: "Fyrus Market street", x: 170, z: -48, h: 36 },
          { name: "Fyrus International Airport", x: 390, z: 0, h: 50 },
          { name: "Skyline Lounges & Gaming Arena", x: wn.lounge.x, z: wn.lounge.z, h: 34 },
          { name: "Starter Commons \u2014 free studios", x: 330, z: 260, h: 90 },
          { name: "Executive Enclave", x: 0, z: 470, h: 60 },
          { name: "Faith & Culture District", x: 0, z: 268, h: 40 },
          { name: "Creator City", x: -212, z: 212, h: 44 },
          { name: "Tech City", x: -272, z: -30, h: 44 },
          { name: "Education Campus", x: -120, z: -210, h: 36 },
          { name: "Fyrus Conference Center", x: wn.halls.x, z: wn.halls.z, h: 36 },
          { name: "Marina Skyline", x: 0, z: -270, h: 50 },
          { name: "Fyrus Joyland", x: 130, z: -300, h: 40 },
          { name: "Sea View coast", x: 40, z: -390, h: 30 },
        ],
        a = 5.5,
        r = e.length * a,
        o = e.map((l) => new W.Vector3(l.x, l.h, l.z)),
        n = new W.CatmullRomCurve3(o, !1, "centripetal"),
        i = this.player.root.position.clone(),
        s = -1;
      (this.beginTrip(
        "tour",
        "Drone tour",
        r,
        (l) => {
          let c = Math.max(0, Math.min(0.999, l / r)),
            d = Math.max(0, Math.min(e.length - 1, Math.floor(c * e.length)));
          d !== s && ((s = d), C({ trip: { kind: "tour", label: `Drone tour \xB7 ${e[d].name}` } }));
          let h = n.getPointAt(c),
            u = n.getPointAt(Math.min(0.999, c + 0.02)),
            p = new W.Vector3(e[d].x, 4, e[d].z),
            v = h.clone().add(new W.Vector3(0, 6, 0)),
            g = p.lerp(u.setY(0), 0.35);
          return { pos: v, look: g, body: i };
        },
        () => {
          (this.player.root.position.copy(i),
            F("Tour finished. Open the Map (M) to go anywhere you saw.", "xp"),
            this.updateChunks(!0),
            _2());
        },
      ),
        F("Drone tour: sit back. Skip any time.", "info"),
        Xc("tour"));
    }
    startRide(e, a) {
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let r = qc.find((i) => i.id === e),
        o = this.joy?.rides[e];
      if (!r || !o || this.trip || !Jc(r.fee, `${r.name} ride`)) return;
      let n = this.player.root.position.clone();
      ((this.rideView = a || r.view || "rider"),
        (this.player.sitting = !0),
        this.beginTrip(
          "ride",
          r.name,
          r.dur,
          (i) => {
            let s = o(i),
              l = s.seat
                ? s.seat.clone().add(new W.Vector3(0, -0.05, 0))
                : s.pos.clone().setY(Math.max(0, s.pos.y - 1.25));
            if (
              (s.face !== void 0 && (this.player.root.rotation.y = s.face),
              (this.player.root.visible = this.rideView === "outside"),
              this.rideView === "outside")
            ) {
              let c = i * 0.18 + 0.6;
              return {
                pos: l
                  .clone()
                  .add(new W.Vector3(Math.sin(c) * 15, 5 + Math.max(0, 8 - l.y * 0.3), Math.cos(c) * 15)),
                look: l.clone().add(new W.Vector3(0, 0.8, 0)),
                body: l,
              };
            }
            return { ...s, body: l };
          },
          () => {
            ((this.player.sitting = !1),
              this.player.root.position.set(n.x, 0, n.z),
              F(`Thanks for riding ${r.name}!`, "xp"));
          },
          void 0,
          !0,
        ),
        (this.player.root.visible = this.rideView === "outside"),
        F(r.fee ? `${r.name}: ${r.fee} FYC paid. Enjoy!` : `${r.name}: free ride. Enjoy!`, "ok"),
        Xc("ride:" + r.id));
    }
    startTrain(e, a) {
      if (this.trip || e === a || !this.metro) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let r = Ch(e),
        o = Ch(a);
      if (!Jc($2, `Metro ${r.name} \u2192 ${o.name}`)) return;
      let n = Ln + 0.4,
        i = [new W.Vector3(r.x, n, r.z)];
      (r.id !== ti.id && o.id !== ti.id && i.push(new W.Vector3(ti.x, n, ti.z)),
        i.push(new W.Vector3(o.x, n, o.z)));
      let s = i.slice(1).map((v, g) => v.distanceTo(i[g])),
        l = s.reduce((v, g) => v + g, 0),
        d = Math.max(8, l / 30 + 4),
        h = (v) => {
          v = W.MathUtils.clamp(v, 0, l);
          for (let g = 0; g < s.length; g++) {
            if (v <= s[g] || g === s.length - 1) {
              let m = s[g] ? Math.min(1, v / s[g]) : 1;
              return { p: i[g].clone().lerp(i[g + 1], m), dir: i[g + 1].clone().sub(i[g]).normalize() };
            }
            v -= s[g];
          }
          return { p: i[0].clone(), dir: new W.Vector3(0, 0, 1) };
        },
        u = this.metro.train,
        p = (v) => {
          let g = yd(v / d),
            { p: m, dir: f } = h(g * l);
          (u.position.copy(m).sub(u.parent.position), (u.rotation.y = Math.atan2(f.x, f.z)));
          let y = m
            .clone()
            .addScaledVector(f, 4)
            .add(new W.Vector3(0, 2.4, 0));
          return {
            pos: y,
            look: y
              .clone()
              .addScaledVector(f, 20)
              .add(new W.Vector3(0, -2, 0)),
            body: m,
          };
        };
      this.beginTrip(
        "metro",
        `Metro to ${o.name}`,
        d,
        p,
        () => {
          (this.player.root.position.set(o.x, 0, o.z + (o.id === ti.id ? 12 : 9.5)),
            (this.yaw = 0),
            F(`Arrived at ${o.name} station.`, "xp"));
        },
        u,
      );
    }
    startTaxi(e) {
      if (this.trip) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let a = this.player.root.position.clone().setY(0),
        r = new W.Vector3(e.x, 0, e.z),
        o = a.distanceTo(r);
      if (o < 15) return F("You are already there.", "info");
      let n = Th(o);
      if (!Jc(n, `Taxi to ${e.name}`)) return;
      let i = Rr("sedan", "#f4c20d"),
        s = new W.Mesh(
          new W.BoxGeometry(0.7, 0.25, 0.3),
          new W.MeshStandardMaterial({ color: "#111", emissive: "#f4c20d", emissiveIntensity: 0.6 }),
        );
      ((s.position.y = 1.75), i.add(s));
      let l = 22,
        c = 4,
        d = 4,
        h = Math.max(4, o / 45),
        u = c + h + d + 1,
        p = r.clone().sub(a).normalize(),
        v = a.clone().addScaledVector(new W.Vector3(-p.z, 0, p.x), 2.4),
        g = (m) => {
          let f;
          return (
            m < 1
              ? (f = v.clone())
              : m < 1 + c
                ? (f = v.clone().setY(l * yd((m - 1) / c)))
                : m < 1 + c + h
                  ? (f = v
                      .clone()
                      .lerp(r, yd((m - 1 - c) / h))
                      .setY(l))
                  : (f = r.clone().setY(l * (1 - yd((m - 1 - c - h) / d)))),
            i.position.copy(f),
            (i.rotation.y = Math.atan2(p.x, p.z)),
            $s(i, m < 1 + c ? 6 : 0, 0.016),
            {
              pos: f
                .clone()
                .addScaledVector(p, -9)
                .add(new W.Vector3(0, 4, 0)),
              look: f
                .clone()
                .addScaledVector(p, 6)
                .add(new W.Vector3(0, 1, 0)),
              body: f.clone(),
            }
          );
        };
      this.beginTrip(
        "taxi",
        `Taxi to ${e.name} \xB7 ${n} FYC`,
        u,
        g,
        () => {
          (this.player.root.position.set(e.x + 3, 0, e.z + 3), F(`Arrived: ${e.name}. Fare ${n} FYC.`, "xp"));
        },
        i,
      );
    }
    snapshot(e = 640) {
      try {
        if (this.active === this.world && !this.trip) {
          let o = this.player.root.position,
            n = this.player.root.rotation.y;
          (this.camera.position.set(o.x + Math.sin(n) * 4.2, o.y + 2.1, o.z + Math.cos(n) * 4.2),
            this.camera.lookAt(o.x, o.y + 1.3, o.z));
        }
        this.renderer.render(this.active, this.camera);
        let a = this.renderer.domElement,
          r = document.createElement("canvas");
        return (
          (r.width = e),
          (r.height = Math.round((e * a.height) / Math.max(1, a.width))),
          r.getContext("2d").drawImage(a, 0, 0, r.width, r.height),
          r.toDataURL("image/jpeg", 0.86)
        );
      } catch {
        return null;
      }
    }
    recordClip(e, a) {
      let r = this.renderer.domElement;
      if (!r.captureStream || typeof MediaRecorder > "u") {
        a(null);
        return;
      }
      let o =
          ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"].find((s) =>
            MediaRecorder.isTypeSupported?.(s),
          ) || "",
        n;
      try {
        n = new MediaRecorder(r.captureStream(30), o ? { mimeType: o, videoBitsPerSecond: 5e6 } : void 0);
      } catch {
        a(null);
        return;
      }
      let i = [];
      ((n.ondataavailable = (s) => {
        s.data.size && i.push(s.data);
      }),
        (n.onstop = () => {
          ((this.clipT = -1), a(i.length ? new Blob(i, { type: o.split(";")[0] || "video/webm" }) : null));
        }),
        (this.clipT = 0),
        (this.clipDur = e),
        n.start(250),
        setTimeout(() => {
          try {
            n.stop();
          } catch {
            a(null);
          }
        }, e * 1e3));
    }
    startCruise(e) {
      if (this.trip) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let a = Sh.find((v) => v.id === e) || Sh[2];
      if (!Jc(25, `Sunset cruise on ${a.name}`)) return;
      let r = Dx(20, "#b8862b"),
        o = we.pier,
        n = new W.Vector3(o.x + 130, 0, -540),
        i = 150,
        s = 110,
        l = 45,
        c = new W.Vector3(o.x, 0.2, o.z - 66),
        d = Array.from({ length: 10 }, (v, g) => {
          let m = Math.PI / 2 + (g / 10) * Math.PI * 2;
          return new W.Vector3(n.x - Math.cos(m) * i, 0.2, n.z + Math.sin(m) * s);
        }),
        h = new W.CatmullRomCurve3(
          [
            c,
            new W.Vector3(o.x + 10, 0.2, o.z - 110),
            ...d,
            new W.Vector3(o.x + 18, 0.2, o.z - 100),
            c.clone(),
          ],
          !1,
          "centripetal",
        ),
        u = (v) => h.getPointAt(Math.min(0.999, Math.max(0, v))),
        p = (v) => {
          let g = Math.min(0.999, v / l),
            m = u(g),
            y = u(Math.min(0.9995, g + 0.004))
              .clone()
              .sub(m)
              .setY(0);
          return (
            y.lengthSq() < 1e-6 && y.set(0, 0, -1),
            y.normalize(),
            r.position.copy(m).setY(0.15 + Math.sin(v * 1.2) * 0.15),
            (r.rotation.y = Math.atan2(y.x, y.z)),
            (r.rotation.z = Math.sin(v * 0.9) * 0.03),
            {
              pos: m
                .clone()
                .addScaledVector(y, -14)
                .add(new W.Vector3(0, 6, 0)),
              look: m
                .clone()
                .addScaledVector(y, 20)
                .add(new W.Vector3(0, 2, 0)),
              body: m.clone().setY(2.5),
            }
          );
        };
      (this.beginTrip(
        "cruise",
        `Sunset cruise \xB7 ${a.name}`,
        l,
        p,
        () => {
          (this.player.root.position.set(o.x, 0, o.z + 4), F("Welcome back to the marina.", "xp"));
        },
        r,
      ),
        ot().settings.time !== "sunset" &&
          F("Tip: set your season to Golden Sunset in the phone for the best view.", "info"));
    }
    startFlight(e) {
      if (this.trip) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      let a = Lp.find((u) => u.id === e);
      if (!a) return;
      let r = this.player.root.position;
      if (Math.hypot(r.x - Cn.x, r.z - Cn.z) > 45)
        return F(
          "Flights board at Fyrus International Airport. Take a taxi or the Metro there first.",
          "warn",
        );
      if (!Jc(a.fare, a.name)) return;
      let o = Ep.runway,
        n = (u, p) => {
          let v = new W.Vector3(u, 0, 0).applyAxisAngle(new W.Vector3(0, 1, 0), o.ry);
          return new W.Vector3(o.x + v.x, p, o.z + v.z);
        },
        i = [n(-o.len / 2 + 10, 3.2), n(-10, 3.2), n(o.len / 2, 14), n(o.len / 2 + 120, 70)];
      if (e === "scenic")
        i.push(
          new W.Vector3(200, 95, -260),
          new W.Vector3(0, 100, -430),
          new W.Vector3(-150, 95, -250),
          new W.Vector3(-120, 90, 40),
          new W.Vector3(60, 90, 160),
          new W.Vector3(300, 70, 160),
          n(-o.len / 2 - 140, 40),
          n(-o.len / 2 - 20, 10),
          n(-o.len / 2 + 40, 3.2),
          n(o.len / 2 - 10, 3.2),
        );
      else {
        let u = new W.Vector3(a.to.x, 0, a.to.z),
          p = i[i.length - 1],
          v = u.clone().sub(p).setY(0).normalize();
        i.push(
          u.clone().addScaledVector(v, -160).setY(90),
          u.clone().addScaledVector(v, -50).setY(30),
          u.clone().addScaledVector(v, -8).setY(4),
          u.clone().setY(3.2),
        );
      }
      let s = new W.CatmullRomCurve3(i, !1, "centripetal"),
        l = s.getLength(),
        c = Math.max(18, l / 42) + 4,
        d = Fx();
      (d.scale.setScalar(0.8), this.runway && (this.runway.plane.visible = !1));
      let h = (u) => {
        let p = Math.min(0.999, Math.max(0, (u - 2) / (c - 2))),
          v = p < 0.08 ? (p / 0.08) ** 2 * 0.08 : p,
          g = s.getPointAt(Math.min(0.999, v)),
          m = s.getPointAt(Math.min(0.9995, v + 0.003)),
          f = m.clone().sub(g).normalize();
        return (
          d.position.copy(g),
          d.lookAt(m),
          {
            pos: g
              .clone()
              .addScaledVector(f, -34)
              .add(new W.Vector3(0, 10, 0)),
            look: g.clone().addScaledVector(f, 25),
            body: g.clone(),
          }
        );
      };
      this.beginTrip(
        "flight",
        `${a.name} \xB7 ${a.fare} FYC`,
        c,
        h,
        () => {
          this.runway && (this.runway.plane.visible = !0);
          let u = e === "scenic" ? Cn : a.to;
          (this.player.root.position.set(u.x, 0, u.z),
            F(
              e === "scenic"
                ? "Landed back at Fyrus International. Welcome home!"
                : `Landed: ${a.name.replace("Fyrus Airlines to ", "")}.`,
              "xp",
            ));
        },
        d,
      );
    }
    startHeli(e, a) {
      if (this.trip) return;
      if (this.vehicle) return F("Park your vehicle first (E).", "warn");
      if (!a) return F("Private helicopters are for Fyrus passport holders.", "warn");
      let r = this.player.root.position.clone().setY(0),
        o = new W.Vector3(e.x, 0, e.z),
        n = r.distanceTo(o);
      if (n < 20) return F("You are already there.", "info");
      let i = Cp(n);
      if (!Jc(i, `Helicopter to ${e.name}`)) return;
      let s = Ux(),
        l = 60,
        c = 5,
        d = 5,
        h = Math.max(5, n / 55),
        u = 2 + c + h + d,
        p = o.clone().sub(r).normalize(),
        v = r.clone().addScaledVector(new W.Vector3(-p.z, 0, p.x), 4),
        g = (m) => {
          let f;
          return (
            m < 2
              ? (f = v.clone())
              : m < 2 + c
                ? (f = v.clone().setY(l * yd((m - 2) / c)))
                : m < 2 + c + h
                  ? (f = v
                      .clone()
                      .lerp(o, yd((m - 2 - c) / h))
                      .setY(l))
                  : (f = o.clone().setY(l * (1 - yd((m - 2 - c - h) / d)))),
            s.position.copy(f),
            (s.rotation.y = Math.atan2(p.x, p.z)),
            (s.rotation.x = m > 2 + c && m < 2 + c + h ? 0.12 : 0),
            (s.getObjectByName("rotor").rotation.y = m * 30),
            {
              pos: f
                .clone()
                .addScaledVector(p, -14)
                .add(new W.Vector3(0, 6, 0)),
              look: f
                .clone()
                .addScaledVector(p, 10)
                .add(new W.Vector3(0, -2, 0)),
              body: f.clone(),
            }
          );
        };
      this.beginTrip(
        "heli",
        `Helicopter to ${e.name} \xB7 ${i} FYC`,
        u,
        g,
        () => {
          (this.player.root.position.set(e.x + 4, 0, e.z + 4), F(`Touchdown: ${e.name}.`, "xp"));
        },
        s,
      );
    }
    royalGate(e) {
      if (this.active !== this.world) return;
      let a = this.player.root.position,
        r = As(Gr[2]);
      if (a.x < r.x0 || a.x > r.x1 || a.z < r.z0 || a.z > r.z1 || Ip()) return;
      let o = Math.min(a.x - r.x0, r.x1 - a.x),
        n = Math.min(a.z - r.z0, r.z1 - a.z);
      (o < n
        ? (a.x = a.x - r.x0 < r.x1 - a.x ? r.x0 - 0.6 : r.x1 + 0.6)
        : (a.z = a.z - r.z0 < r.z1 - a.z ? r.z0 - 0.6 : r.z1 + 0.6),
        this.vehicle && _h(),
        e - this.royalWarn > 4 &&
          ((this.royalWarn = e),
          F(
            "Royal Sky security: entry is for Fyrus passport holders, residents and invited guests.",
            "warn",
          )));
    }
    nearestStation() {
      let e = this.player.root.position,
        a = ei[0],
        r = 1e9;
      return (
        ei.forEach((o) => {
          let n = Math.hypot(o.x - e.x, o.z - e.z);
          n < r && ((r = n), (a = o));
        }),
        { station: a, dist: r }
      );
    }
    drawMinimap(e) {
      let a = this.minimap;
      if (!a) return;
      let r = a.getContext("2d");
      if (!r) return;
      let o = a.width,
        n = a.height,
        i = this.player.root.position;
      if (
        (r.clearRect(0, 0, o, n),
        r.save(),
        r.beginPath(),
        eo(r, 0, 0, o, n, 10),
        r.clip(),
        (r.fillStyle = "#3b4a3a"),
        r.fillRect(0, 0, o, n),
        r.translate(o / 2, n / 2),
        r.rotate(this.yaw),
        this.active === this.world)
      ) {
        let s = o / 160;
        (r.translate(-i.x * s, -i.z * s), (r.strokeStyle = "#6f7378"), (r.lineWidth = 8 * s));
        let l = Math.round(i.x / sa) * sa,
          c = Math.round(i.z / sa) * sa;
        for (let u = -4; u <= 4; u++) {
          let p = l + (u + 0.5) * sa;
          (r.beginPath(), r.moveTo(p * s, (c - 260) * s), r.lineTo(p * s, (c + 260) * s), r.stroke());
          let v = c + (u + 0.5) * sa;
          (r.beginPath(), r.moveTo((l - 260) * s, v * s), r.lineTo((l + 260) * s, v * s), r.stroke());
        }
        ((r.fillStyle = "#b9a98f"),
          r.fillRect(40 * s, -11 * s, 270 * s, 22 * s),
          r.fillRect(40 * s, -107 * s, 270 * s, 22 * s),
          (r.fillStyle = "#d8cbb5"),
          this.shops.forEach((u) => {
            let p = 50 + u.slot * 12;
            ((r.fillStyle = u.kind === "vacant" ? "#9a958c" : u.primary),
              r.fillRect((p - 5.6) * s, (zl(u.row) - 6) * s, 11.2 * s, 12 * s));
          }),
          (r.fillStyle = "#c8c2b6"),
          r.beginPath(),
          r.arc(0, 0, 30 * s, 0, Math.PI * 2),
          r.fill(),
          (r.fillStyle = "#4aa8c9"),
          r.fillRect((Ze.x - Ze.w / 2) * s, (Ze.z - Ze.d / 2) * s, Ze.w * s, Ze.d * s),
          (r.fillStyle = "#2c6f8f"));
        let d = Oa.find((u) => u.id === "marina");
        (r.beginPath(), r.arc(d.x * s, d.z * s, 46 * s, 0, Math.PI * 2), r.fill(), (r.fillStyle = "#5a7f3e"));
        let h = Oa.find((u) => u.id === "gardens");
        (r.beginPath(),
          r.arc(h.x * s, h.z * s, 28 * s, 0, Math.PI * 2),
          r.fill(),
          this.chunks.forEach((u) =>
            u.homes.forEach((p) => {
              ((r.fillStyle = "#9b9488"),
                r.fillRect((p.u.home.x - 5) * s, (p.u.home.z - 5) * s, 10 * s, 10 * s));
            }),
          ),
          e.users
            .filter((u) => !u.procedural)
            .forEach((u) => {
              ((r.fillStyle = u.id === e.session?.userId ? "#ff9a3c" : "#a39c90"),
                r.fillRect((u.home.x - 5) * s, (u.home.z - 5) * s, 10 * s, 10 * s));
            }),
          window.__fyrusMinimap && window.__fyrusMinimap(r, s, i),
          (r.fillStyle = "#ffd54a"),
          this.npcs.list.forEach((u) => {
            (r.beginPath(),
              r.arc(u.av.root.position.x * s, u.av.root.position.z * s, 2.4, 0, Math.PI * 2),
              r.fill());
          }),
          (r.fillStyle = "rgba(255,255,255,0.7)"),
          this.bots.forEach((u) => {
            (r.beginPath(),
              r.arc(u.root.position.x * s, u.root.position.z * s, 1.6, 0, Math.PI * 2),
              r.fill());
          }),
          (r.fillStyle = "#4da3ff"),
          this.peers.forEach((u) => {
            u.root.parent === this.world &&
              (r.beginPath(),
              r.arc(u.root.position.x * s, u.root.position.z * s, 3, 0, Math.PI * 2),
              r.fill());
          }),
          e.waypoint &&
            ((r.fillStyle = "#ffc27a"),
            (r.strokeStyle = "#000"),
            (r.lineWidth = 1.5),
            r.beginPath(),
            r.arc(e.waypoint.x * s, e.waypoint.z * s, 5, 0, Math.PI * 2),
            r.fill(),
            r.stroke()),
          r.translate(i.x * s, i.z * s));
      } else if (this.interior) {
        let s = o / (this.interior.bounds.hx * 2 + 6);
        (r.translate(-i.x * s, -i.z * s),
          (r.fillStyle = "#d8d2c6"),
          r.fillRect(
            -this.interior.bounds.hx * s,
            -this.interior.bounds.hz * s,
            this.interior.bounds.hx * 2 * s,
            this.interior.bounds.hz * 2 * s,
          ),
          (r.fillStyle = "#6d665b"),
          this.interior.blocks.forEach((l) =>
            r.fillRect((l.x - l.hx) * s, (l.z - l.hz) * s, l.hx * 2 * s, l.hz * 2 * s),
          ),
          this.interiorInteracts.forEach((l) => {
            ((r.fillStyle = l.action === "exit" ? "#2e7d32" : "#ff9a3c"),
              r.beginPath(),
              r.arc(l.pos.x * s, l.pos.z * s, 3, 0, Math.PI * 2),
              r.fill());
          }),
          (r.fillStyle = "#ffd54a"),
          this.innerNpcs.list.forEach((l) => {
            (r.beginPath(),
              r.arc(l.av.root.position.x * s, l.av.root.position.z * s, 3, 0, Math.PI * 2),
              r.fill());
          }),
          r.translate(i.x * s, i.z * s));
      }
      (r.rotate(-this.yaw),
        r.rotate(-this.player.root.rotation.y + Math.PI + this.yaw),
        (r.fillStyle = "#fff"),
        (r.strokeStyle = "#000"),
        (r.lineWidth = 1.5),
        r.beginPath(),
        r.moveTo(0, -7),
        r.lineTo(5, 5),
        r.lineTo(0, 2.5),
        r.lineTo(-5, 5),
        r.closePath(),
        r.fill(),
        r.stroke(),
        r.restore());
    }
    dispose() {
      ((this.disposed = !0),
        this.renderer.setAnimationLoop(null),
        this.unsub(),
        this.ro.disconnect(),
        window.removeEventListener("keydown", this.onKeyDown),
        window.removeEventListener("keyup", this.onKeyUp),
        window.removeEventListener("blur", this.onBlur),
        this.unNet?.(),
        this.presence.close(),
        this.audio.dispose(),
        this.beat.stop(),
        this.interior?.video?.pause(),
        this.renderer.dispose(),
        this.renderer.domElement.remove());
    }
  };
