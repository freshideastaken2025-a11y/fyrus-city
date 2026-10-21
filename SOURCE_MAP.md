# Fyrus source map

The live site is built from `src/` by `node build.mjs` (no dependencies). **Edit `src/`, run `node build.mjs`, then commit both `src/` and the generated `index.html` / `server.mjs`.** Never edit the generated files by hand.

- `src/client/` — the city app (React + Three.js), recovered from the production bundle. Readable, but local names are short (minified). Use the text samples below and `grep -rn "Some UI text" src/client` to find a feature.
  - `template.html` — page shell (fonts, Tailwind config, CSS). The app is injected at `/*__FYRUS_APP__*/`.
  - `head.js` / `tail.js` — wrapper (Three.js check, React mount). `manifest.json` — file order; **order matters, all files share one scope**.
  - `vendor/` — React / scheduler. Do not edit.
- `src/server/` — Node server, one file per original module with original names. `manifest.json` = order; files share one scope (former single esbuild bundle).
- Add-on layers (served as-is, not part of the build): `fyrus-plus.js`, `fyrus-world.js`, `fyrus-intro.js`.

Rules: keep file order; a new client feature can go in a new file listed in `manifest.json` before the last file (which mounts the app); never commit secrets. Verified 22 Oct 2026: the build produces a bundle whose syntax tree is identical to the previous production bundle.

## Client files

| File | KB | Top-level names | Text inside (to locate features) |
|---|---|---|---|
| `vendor/001.js` | 15 | Z9, b5, K9, X9, J9, Q9, mi, tC, P, R5, A5, U5, Zt, Y5, K5 |  |
| `vendor/002.js` | 172 | lw | "Fragment" · "Profiler" · "StrictMode" · "Suspense" · "SuspenseList" · "Activity" · "Context" · "ForwardRef" |
| `app/003.js` | 29 | hw, ea, xE, ct, U9, rM, Hl, uw, lp, pw, gw, _S, YS, qS, ZS, fw, Di, Nl, yh, mw, Ic, Fi, cp | "Fyrus General Hospital" · "Nurse shift" · "Bring the first-aid kit" · "Update charts at reception" · "Restock the medicine cart" · "Fyrus Police Stat |
| `app/004.js` | 23 | Ew, hp, up, Lw, V2, ov, $i, wh, nv, pp, Sw, Hw, Nw, Rw, gp, JS, GA, Oc, iv, Bw, Cw, QS, Tw | "Multi-agent system for customer support" · "LangGraph" · "Video diffusion" · "Whisper" · "Fine-tuning" · "Just tried ResearchPilot, it is amazing" ·  |
| `app/005.js` | 29 | Oa, yp, ki, Yi, Sr, kp, bp, gv, tn, $w, fv, Vr, zl, O2, _c, Eh, bi, zs, _w, la, wp, mv, jl | "Fyrus Core Plaza" · "Fyrus Market" · "Skyline Club" · "Lido Pool" · "Supertree Gardens" · "SkyPort" · "Marina Skyline" · "Sea View Coast" |
| `app/006.js` | 31 | mH, vH, oM, Lv, va, Hh, xH, Zc, Tr, Kc, Tp, Sp, yH, kH, nM, bH, iM, wH, V, wv, Jw, ot, C,  | "Glowing orbs float all over the city" · "Walk to a glowing door and press E" · "Open the Feed and tap the heart" · "Try an AI agent demo" · "Open any |
| `app/007.js` | 31 | QM, Op, t8, e8, a8, r8, wi, o8, Dh, n8, i8, Iv, tM, s8, rd, eM, Dp, Fh, Uh, l8, $h, J2, _h | "Posted a video" · "Claimed a plot" · "Went live" · "Drop the link please" · "Shopping in Fyrus City" · "Played an arcade game" · "Booked an ad" · "Cr |
| `app/008.js` | 31 | eg, ou, ag, $l, nu, j8, _l, Zh, Kh, rg, og, Xh, jo, ng, Ji, W8, Jh, Kv, I8, G8, V8, Yl, ko |  |
| `app/009.js` | 26 | i0, Ma, dg, aE, hg, ld, rE, cd, s0, oE, ug, pg, Zl, on, l0, Fs, gg, dd, si, fg, c0, Wo, nE | "Sora, system-ui, sans-serif" |
| `app/010.js` | 26 | rx, nr, kE, ox, _t, to, bo, xa, ts, es, Eg, Qt, Dr, as, nx, p0, Te, Ra, Lg, qe, ix, Io, Ql | "Fyrus Arcade" · "Games with friends, side by side" · "Flying cars & rockets" · "Rent free and cross the city" · "Your home, your store" · "Enter Fyru |
| `app/011.js` | 22 | PH, rc, kr, wo, g0, f0, OH, cx, SE, HE, Tg, NE, RE, BE, x0, jt, re, DH, AE, zE, jE, m0, WE | "Category" · "Brand, shop or your name" · "Grand opening today" · "Change poster" · "Poster image" · "Remove poster" · "Your name" · "Your headline he |
| `app/012.js` | 29 | ux, uo, PE, px, cu, vx, ec, OE, DE, gx, fx, ud, FE, du, $H, hu, uu, UE, mx, _H, $E, _E, xx | "FYRUS CITY GRAND PRIX" · "ArrowUp" · "ArrowDown" · "ArrowLeft" · "ArrowRight" · "PPPPPPPPRNBQKBNR" · "Chess board" · "Checkmate" |
| `app/013.js` | 27 | kx, QE, k0, Go, pu, Vo, bx, wx, di, Br, Mx, tL, eL, qH, aL, Ex, _s, Ct, ZH, rL, KH, XH, Lx | "This part" · "Marina Skyline" · "Fyrus Core Plaza" · "Fyrus Market" · "Skyline Club" · "Your street" · "WELCOME TO FYRUS CITY" · "NOW PASSING" |
| `app/014.js` | 31 | tN, eN, lL, aN, rN, mu, oN, nN, cL, gd, vu, nL, iL, dL, Xa, Mo, Hn, sL, hL, Dj, Fj, iN, Cx | "Plus Jakarta Sans" · "PARLIAMENT OF FYRUS" · "CENTRAL BANK OF FYRUS" · "CITIZEN CENTER" · "FOR SALE" |
| `app/015.js` | 31 | nc, TN, ML, EL, Wt, ns, CL, LL, TL, mt, is, Bx, Rx, Ax, zx, SN, SL, HL, NL, Se, RL, jx, Wx | "FYRUS JOYLAND" · "FYRUS EYE" · "CAROUSEL" · "SKY SWINGS" · "GARDEN SWINGS" · "THUNDER LOOP" · "POPCORN & SODA" · "Free during launch" |
| `app/016.js` | 30 | yu, Wg, pt, Ta, ss, NN, RN, Gx, Vx, BN, AN, IL, ic, GL, Ys, Px, zN, VL, jN, WN, Hi, Ig, nt | "Passport holders and invited guests" · "Free studios" · "STARTER COMMONS" · "Free studio apartments for every visitor" · "Plus Jakarta Sans" · "FYRUS |
| `app/017.js` | 30 | qL, ZL, KL, Ze, vd, XL, JL, PN, QL, ON, DN, t7, j, Yx, FN, qx, M0, UN, $N, E0, e7, Xt, _N, | "LIDO POOL" · "Walk in to swim" · "FYRUS CITY" · "Plus Jakarta Sans" · "JetBrains Mono" · "Sponsored" · "YOUR AD HERE" · "Advertise in" |
| `app/018.js` | 26 | er, st, Eo, Ri, qs, ls, ua, Ba, r7, o7, n7, i7, ui, U, d7, h7, u7, qN, ZN, p7, g7, f7, m7, | "Bebas Neue" · "Plus Jakarta Sans" · "Shop stats" · "AI Agent" · "WHAT IT DOES" · "Accurate" · "Always on" · "PACKAGES" |
| `app/019.js` | 29 | c7, Nn, v7, x7, y7, k7, b7, ku, Ae, Lo, Bi, w7, oR, Pg, L0, cs, M7, E7, L7, C7, T7, Og, le | "Capital Quarter" · "Market City" · "Tech City" · "Creator City" · "Play City" · "Learn City" · "Faith & Culture District" · "Plus Jakarta Sans" |
| `app/020.js` | 30 | H7, se, ge, N7, La, Dg, Vt, Po, Fg, pi, R7, de, lc, ty, Ks, iR, B7, A7, z7, T0, ey, j7, Ug | "Usher Rami" · "Host Lea" · "Event host" · "Orbit mocktail" · "Fyrus cold brew" · "Mango lassi" · "Bartender" · "Caster Zed" |
| `app/021.js` | 29 | I7, Co, lR, G7, Et, ce, me, po, bu, cR, ay, V7, dR, hR, uR, pR, P7, cc, O7, $g, _g, gR | "Polls are open" · "Walk to the ballot box" · "Nominations open" · "NOMINATIONS" · "Plus Jakarta Sans" · "CABINET OF FYRUS" · "Speaker Amina" · "Speak |
| `app/022.js` | 1 | Yg, ds, fR, mR, D7, Rn |  |
| `app/023.js` | 67 | qg, F7, U7, vR, wu, yd, Zg | "TEXTAREA" · "Plus Jakarta Sans" · "Creator" · "FYRUS CITY" · "JetBrains Mono" · "LIVE now" · "Your home" · "Try live demo" |
| `app/024.js` | 30 | Rt, ry, ar, rt, $7, xR, yR, kR, bR, wR, oy, sn, gt, MR, ER, LR | "Districts" · "Resets at midnight" · "Daily quests" · "Claimed" · "City directory" · "Fly now" · "Rent a flying car from where you stand" · "The city  |
| `app/025.js` | 26 | ny, S0, Dt, CR, iy, kd, Nt, TR, _7, sy, Y7, ve, ly, hy, ra, A, Me, Kg, SR, dy, HR | "My agent library" · "Standard" · "Your gig" · "AI Agents" · "New AI gig" · "Category" · "AI Video" · "Prompt Engineering" |
| `app/026.js` | 28 | NR, RR, cy, BR, AR, zR, jR, WR, Mu, Gt, IR, uy, py, Mt, q7, GR, VR, Z7 | "Lesson " · "Check answer" · "Mark as done" · "Certified" · "Finished" · "Beginner" · "Register as a teacher" · "Course title" |
| `app/027.js` | 31 | gy, To, At, PR, fy, H0, te, my, OR, Aa, DR, FR, vy, wd, Xg, He, xy, K7, bd, Ur, X7, yy, tt | "Plot at " · "Free plot" · "Exterior" · "Architecture" · "Main light" · "Accent light" · "Door sign" · "Open studio" |
| `app/028.js` | 31 | dc, Xs, YR, ky, qR, hc, ZR, KR, uc, Jg, wy, by, Qg, o9, Tt, XR, JR, n9, My, Ey, pa, QR, Md | "Profile" · "Graphics & audio" · "Privacy" · "Account" · "Display name" · "AI agent builder" · "Email for receipts" · "Name tag colour" |
| `app/029.js` | 30 | Eu, Yt, tB, Ly, An, qt, i9, eB, aB, s9, rB, Cy, Lu, Qs, Js, oB, nB, tf, l9, Ty, Sy, ef, c9 | "Open your own shop" · "Search shops" · "Classic" · "Shop page" · "Purchases" · "Revenue" · "Buy rate" · "Edit branding" |
| `app/030.js` | 30 | lB, jy, cB, Wy, G, ga, dB, Iy, f9, hB, uB, pB, gB, fB, mB | "Anonymous Citizen" · "JetBrains Mono" · "Plus Jakarta Sans" · "PASSENGER" · "DOCUMENT" · "Visa on arrival" · "RIDES IN" · "Mira City" |
| `app/031.js` | 30 | vB, jn, xB, N0, m9, R0, Oo, Ed, af, zn, Cu, v9, B0, x9, y9, Gy, rf, of, Xe, Vy, k9, K, Py, | "Constitution of Fyrus" · "Article " · "No order linked" · "English" · "Spanish" · "Deutsch" · "Portuguese" · "Russian" |
| `app/032.js` | 28 | w9, rr, Fy, A0, wt, nf, Uy, M9, E9, lf, Ar, sf, L9, $y, gr, I, Ne, cf, EB, C9, Tu, T9, _y, | "Hang up" · "TEXTAREA" · "Messages are shown in your language" · "Collapse chat" · "Message the whole city" · "Turn voice off" · "Talk with voice" · " |
| `app/033.js` | 26 | CB, TB, SB, HB, NB, $r, Q, _r, RB, BB, H9, S9, df, Yy, AB, zB | "Delivery address" · "Your bid" · "Bond amount" · "Withdraw" · "Listing title" · "Listing description" · "Buy now" · "Live auction" |
| `app/034.js` | 29 | jB, WB, IB, ln, bt, Wn, hf, qy, GB, VB, PB, OB, DB, Ld, yt, gi, Ky, N9, FB, UB, R9, Xy, Zy | "Rented to " · "Your bid" · "End my lease at the end of this month" · "Lock, keys & paint" · "Manage your plot" · "Auction" · "Rent out" · "Plot price |
| `app/035.js` | 29 | t5, Do, qB, e5, hs, xt, Fo, uf, a5, gc, kt, or, B9, r5, o5, ZB, Yr, R, fe, j0, KB, fc, A9, | "HAPPENING NOW" · "Drone tour" · "See the best places" · "Go anywhere" · "Free studio" · "Your first home" · "Election " · "Details" |
| `app/036.js` | 27 | XB, z9, JB, QB, tA, eA, aA, rA, Su, ee, tl, oA, i5, pf, Ot, Hu, nA, j9 | "MAYOR RACES" · "Independent" · "Book a hall" · "Billboards" · "Parliament seats" · "You can't vote yet" · "Save my account" · "You vote for the Mayor |
| `app/037.js` | 30 | W9, I9, Nu, St, Cd, iA, sA, s5, G9, lA, V9, P9, zi, oa, l5, O9, fi, c5, mc, xe, D9, d5, D, | "FOR SALE" · "Free check-up tips" · "First aid basics" · "Fire safety" · "Report & stay safe" · "Lost & found" · "Law & Court" · "All books" |
| `app/038.js` | 15 | yA, kA, bA, u5, p5, g5, $9 | "Hoverboard" · "Section" · "This page" · "TEXTAREA" · "Skyline Club" · "Parliament of Fyrus" · "Central Bank of Fyrus" · "Citizen Center" |

## Server files

- `src/server/_prelude.mjs`
- `src/server/index.mjs`
- `src/server/shared/data/languages.mjs`
- `src/server/edu.mjs`
- `src/server/bank.mjs`
- `src/server/market.mjs`
- `src/server/shared/data/societies.mjs`
- `src/server/estate.mjs`
- `src/server/shared/data/media.mjs`
- `src/server/news.mjs`
- `src/server/ads.mjs`
- `src/server/halls.mjs`
- `src/server/shared/data/furniture.mjs`
- `src/server/homes.mjs`
- `src/server/shared/data/politics.mjs`
- `src/server/politics.mjs`
- `src/server/shared/data/services.mjs`
- `src/server/jobs.mjs`
- `src/server/accounts.mjs`
- `src/server/ops.mjs`
- `src/server/legal.mjs`
- `src/server/index.2.mjs`
